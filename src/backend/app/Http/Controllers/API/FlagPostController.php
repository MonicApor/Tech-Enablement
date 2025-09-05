<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FlagPost;
use App\Http\Resources\FlagPostResource;
use App\Models\FlagPostStatus;
use App\Services\PostEscalataionService;
use Illuminate\Http\JsonResponse;

/**
 * @OA\Tag(
 *     name="FlagPosts",
 *     description="Flag post management endpoints"
 * )
 */
class FlagPostController extends Controller
{
    protected $escalationService;

    public function __construct(PostEscalataionService $escalationService)
    {
        $this->escalationService = $escalationService;
    }
    
    /**
     * Display a listing of the resource.
     * 
     * @OA\Get(
     *     path="/api/flag-posts",
     *     summary="Get all flag posts",
     *     tags={"FlagPosts"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="search", in="query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="sort", in="query", @OA\Schema(type="string", enum={"asc", "desc"})),
     *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="data", type="array", @OA\Items(type="object")), @OA\Property(property="meta", type="object"))),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function index(Request $request)
    {
        $query = FlagPost::with('post', 'employee.user', 'hrEmployee');

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('reason', 'like', '%' . $searchTerm . '%')
                  ->orWhereHas('post', function($postQuery) use ($searchTerm) {
                      $postQuery->where('title', 'like', '%' . $searchTerm . '%')
                               ->orWhere('body', 'like', '%' . $searchTerm . '%');
                  })
                  ->orWhereHas('employee.user', function($userQuery) use ($searchTerm) {
                      $userQuery->where('username', 'like', '%' . $searchTerm . '%')
                               ->orWhere('name', 'like', '%' . $searchTerm . '%');
                  });
            });
        }

        $sort = $request->input('sort', 'desc');
        $query->orderBy('created_at', $sort);

        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);

        $flagPosts = $query->paginate($perPage, ['*'], 'page', $page);

        $flagPostsWithRowNumbers = $flagPosts->getCollection()->map(function ($flagPost, $index) use ($page, $perPage) {
            $flagPost->row_number = ($page - 1) * $perPage + $index + 1;
            return $flagPost;
        });

        return response()->json([
            'data' => FlagPostResource::collection($flagPostsWithRowNumbers),
            'meta' => [
                'total' => $flagPosts->total(),
                'per_page' => $perPage,
                'current_page' => $page,
            ]
        ]);
    }

    /**
     * Get all flag post statuses
     * 
     * @OA\Get(
     *     path="/api/flag-posts/statuses",
     *     summary="Get all flag post statuses",
     *     tags={"FlagPosts"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="data", type="array", @OA\Items(type="object")))),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function flagPostStatuses()
    {
        $flagStatuses = FlagPostStatus::all();
        return response()->json([
            'data' => $flagStatuses,
        ]);
    }


    /**
     * Update the status of a flag post
     * 
     * @OA\Put(
     *     path="/api/flag-posts/{id}",
     *     summary="Update the status of a flag post",
     *     tags={"FlagPosts"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(type="object", @OA\Property(property="status_id", type="integer"))),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"), @OA\Property(property="data", type="object"))),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"))),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"), @OA\Property(property="errors", type="object"))),
     * )
     */
    public function update(Request $request, FlagPost $flagPost) : JsonResponse
    {
        $request->validate([
            'status_id' => 'required|exists:flag_post_statuses,id'
        ]);

        // Get the current user's employee record
        $user = auth()->user();
        if (!$user->employee) {
            return response()->json([
                'message' => 'User does not have an associated employee record'
            ], 400);
        }

        if ($request->status_id == 4) {
            $flagPost->post->update([
                'resolved_at' => now()
            ]);
            
            $flagPost->delete();
            
            return response()->json([
                'message' => 'Post resolved successfully and flag removed',
                'data' => null
            ]);
        }

        // If status is 3 (Escalated), trigger escalation process
        if ($request->status_id == 3) {
            $this->triggerEscalation($flagPost);
        }

        $flagPost->update([
            'status_id' => $request->status_id,
            'hr_employee_id' => $user->employee->id,
            'updated_at' => now()
        ]);
        
        return response()->json([
            'message' => 'Flag post status updated successfully',
            'data' => new FlagPostResource($flagPost->fresh(['post', 'employee.user', 'hrEmployee'])),
        ]);
    }

    /**
     * Trigger escalation process using the existing service
     */
    private function triggerEscalation(FlagPost $flagPost): void
    {
        try {
            // Use the injected PostEscalationService to handle escalation
            $this->escalationService->escalatePost($flagPost, false); // false = escalated by HR manually
        } catch (\Exception $e) {
            \Log::error('Failed to trigger escalation: ' . $e->getMessage());
        }
    }
}
