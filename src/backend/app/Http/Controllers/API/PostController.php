<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use App\Models\PostAttachment;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

/**
 * @OA\Tag(
 *     name="Posts",
 *     description="API Endpoints for Posts"
 * )
 */
class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @OA\Get(
     *     path="/api/posts",
     *     summary="Get all posts",
     *     tags={"Posts"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="category_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="search", in="query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="sort", in="query", @OA\Schema(type="string", enum={"asc", "desc"})),
     *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Post")), @OA\Property(property="meta", type="object"))),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Post::with(['user.employee', 'category', 'comments', 'attachments'])
            ->active();

        // filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        //search functionality
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('body', 'like', '%' . $request->search . '%');
        }

        //sorting
        $sort = $request->input('sort', 'desc');
        $query->orderBy('created_at', $sort);

        //pagination
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);

        $posts = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => PostResource::collection($posts),
            'meta' => [
                'total' => $posts->total(),
                'per_page' => $perPage,
                'current_page' => $page,
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @OA\Post(
     *     path="/api/posts",
     *     summary="Create a new post",
     *     tags={"Posts"},
     *     security={{"bearerAuth": {}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(required={"title", "body", "category_id"}, @OA\Property(property="title", type="string"), @OA\Property(property="body", type="string"), @OA\Property(property="category_id", type="integer"))),
        *     @OA\Response(response=201, description="Created", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"), @OA\Property(property="data", ref="#/components/schemas/Post"))),
     *     @OA\Response(response=400, description="Bad request", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function store(StorePostRequest $request): JsonResponse
    {
        $this->authorize('create', Post::class);
        
        $post = Post::create([
            ...$request->validated(),
            'user_id' => auth()->id(),
        ]);

        // Handle file uploads        
        if ($request->hasFile('attachments')) {
            $files = $request->file('attachments');
            
            foreach ($files as $index => $file) {
                if ($file->isValid()) {
                    $originalName = $file->getClientOriginalName();
                    $extension = $file->getClientOriginalExtension();
                    $fileName = Str::uuid() . '.' . $extension;
                    
                    // Create the full path
                    $filePath = 'posts/' . date('Y/m/d') . '/' . $fileName;
                    
                    // Upload to MinIO
                    $uploaded = Storage::disk('minio')->put($filePath, file_get_contents($file));
                    
                    if ($uploaded) {
                        $attachment = PostAttachment::create([
                            'post_id' => $post->id,
                            'user_id' => auth()->id(),
                            'original_name' => $originalName,
                            'file_name' => $fileName,
                            'file_path' => $filePath,
                            'file_size' => $file->getSize(),
                            'mime_type' => $file->getMimeType(),
                            'disk' => 'minio',
                            'url' => route('api.attachments.download', ['path' => $filePath]),
                        ]);
                    }
                }
            }
        }

        // AI auto-flag based on title and body
        try {
            if ($this->shouldFlagPostAI($post->title, $post->body)) {
                $post->update(['flaged_at' => now()]);
            }
        } catch (\Throwable $e) {
            // Swallow AI errors to not block post creation
        }
        return response()->json([
            'message' => 'Post created successfully',
            'data' => new PostResource($post->load('user.employee', 'category', 'attachments')),
        ], 201);
    }

    /**
     * Display the specified resource.
     * 
     * @OA\Get(
     *     path="/api/posts/{id}",
     *     summary="Get a specific post",
     *     tags={"Posts"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="data", ref="#/components/schemas/Post"))),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function show(Post $post): JsonResponse
    {
        $post->incrementViews();
        return response()->json([
            'data' => new PostResource($post->load('user.employee', 'category', 'comments', 'attachments')),
        ]);
    }

    /**
     * Update the specified resource in storage.
     * 
     * @OA\Put(
     *     path="/api/posts/{id}",
     *     summary="Update a post",
     *     tags={"Posts"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(@OA\Property(property="title", type="string"), @OA\Property(property="body", type="string"), @OA\Property(property="category_id", type="integer"))),
     *     @OA\Response(response=200, description="Updated", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"), @OA\Property(property="data", ref="#/components/schemas/Post"))),
     *     @OA\Response(response=400, description="Bad request", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function update(UpdatePostRequest $request, Post $post): JsonResponse
    {
        $this->authorize('update', $post);
        
        
        $post->update($request->only(['title', 'body', 'category_id', 'status']));
                
        // Remove specified attachments
        if ($request->has('remove_attachments') && is_array($request->remove_attachments)) {
            foreach ($request->remove_attachments as $attachmentId) {
                $attachment = PostAttachment::find($attachmentId);
                if ($attachment && $attachment->post_id === $post->id) {
                    if (Storage::disk('minio')->exists($attachment->file_path)) {
                        Storage::disk('minio')->delete($attachment->file_path);
                    }
                    $attachment->delete();
                }
            }
        }
        
        // Add new file uploads
        if ($request->hasFile('attachments')) {
            $files = $request->file('attachments');
            
            if (is_array($files) && !empty($files)) {
                foreach ($files as $index => $file) {
                    if ($file->isValid()) {
                        $originalName = $file->getClientOriginalName();
                        $extension = $file->getClientOriginalExtension();
                        $fileName = Str::uuid() . '.' . $extension;
                        
                        $filePath = 'posts/' . date('Y/m/d') . '/' . $fileName;
                        
                        $uploaded = Storage::disk('minio')->put($filePath, file_get_contents($file));
                        
                        if ($uploaded) {
                            $attachment = PostAttachment::create([
                                'post_id' => $post->id,
                                'user_id' => auth()->id(),
                                'original_name' => $originalName,
                                'file_name' => $fileName,
                                'file_path' => $filePath,
                                'file_size' => $file->getSize(),
                                'mime_type' => $file->getMimeType(),
                                'disk' => 'minio',
                                'url' => route('api.attachments.download', ['path' => $filePath]),
                            ]);
                        }
                    }
                }
            }
        }
        
        return response()->json([
            'message' => 'Post updated successfully',
            'data' => new PostResource($post->load('user.employee', 'category', 'attachments')),
        ]);
    }

    /**
     * Download attachment file
     */
    public function downloadAttachment(Request $request, $path): \Symfony\Component\HttpFoundation\Response
    {
        try {
            $decodedPath = urldecode($path);
            
            if (!Storage::disk('minio')->exists($decodedPath)) {
                abort(404, 'File not found');
            }

            $fileContents = Storage::disk('minio')->get($decodedPath);
            
            $mimeType = Storage::disk('minio')->mimeType($decodedPath);
            $fileName = basename($decodedPath);
            
            return response($fileContents)
                ->header('Content-Type', $mimeType)
                ->header('Content-Disposition', 'inline; filename="' . $fileName . '"');
                
        } catch (\Exception $e) {
            abort(500, 'Error downloading file');
        }
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @OA\Delete(
     *     path="/api/posts/{id}",
     *     summary="Delete a post",
     *     tags={"Posts"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(ref="#/components/schemas/SuccessMessage")),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Unauthorized", @OA\JsonContent(ref="#/components/schemas/UnauthorizedError")),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();
        return response()->json([
            'message' => 'Post deleted successfully',
        ]);
    }

    /**
     * Flag a post
     * 
     * @OA\Post(
     *     path="/api/posts/{id}/flag",
     *     summary="Flag a post",
     *     tags={"Posts"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(ref="#/components/schemas/SuccessMessage")),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function flag(Post $post): JsonResponse
    {
        $isFlagged = $post->toggleFlag();
        return response()->json([
            'message' => $isFlagged ? 'Post flagged successfully' : 'Post unflagged successfully',
            'is_flagged' => $isFlagged,
        ]);
    }

    /**
     * Resolve a post
     * 
     * @OA\Post(
     *     path="/api/posts/{id}/resolve",
     *     summary="Resolve a post",
     *     tags={"Posts"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(ref="#/components/schemas/SuccessMessage")),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function resolve(Post $post): JsonResponse
    {
        $post->resolve();
        return response()->json([
            'message' => 'Post resolved successfully',
        ]);
    }

    /**
     * Upvote a post
     * 
     * @OA\Post(
     *     path="/api/posts/{id}/upvote",
     *     summary="Upvote a post",
     *     tags={"Posts"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(ref="#/components/schemas/SuccessMessage")),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function upvote(Post $post): JsonResponse
    {
        
        $isUpvoted = $post->upvote();
        
        return response()->json([
            'message' => $isUpvoted ? 'Post upvoted successfully' : 'Post upvote removed successfully',
            'is_upvoted' => $isUpvoted,
            'upvotes_count' => $post->fresh()->upvotes_count,
        ]);
    }

    /**
     * Get trending topics
     * 
     * @OA\Get(
     *     path="/api/posts/trending-topics",
     *     summary="Get trending topics",
     *     tags={"Posts"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", properties={@OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Post"))})),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function trendingTopics(): JsonResponse
    {
        $trendingTopics = Post::trending()->get();
        return response()->json([
            'data' => PostResource::collection($trendingTopics),
        ]);
    }

    /**
     * Get recent activities
     * 
     * @OA\Get(
     *     path="/api/posts/recent-activities",
     *     summary="Get recent activities",
     *     tags={"Posts"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", properties={@OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Post"))})),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function recentActivities(): JsonResponse
    {
        $user = Auth::user();
        $activities = collect(); //new collection to store activities

        //get 5 recent posts 
        $recentPost = Post::where('user_id', $user->id)->whereNull('flaged_at')
        ->where('status', 'active')->latest()->take(5)->get();
        
        //populate activities with recent posts
        $activities = $activities->concat($recentPost->map(fn($post) => [
            'type' => 'Post',
            'post' => $post->id,
            'title' => $post->title,
            'time' => $post->created_at->diffForHumans(),
        ]));

        //get 5 recent hr replies if current user is hr 
        if ($user->role === 'hr') {
            $recentHrReplies = Comment::where('user_id', $user->id)->latest()->take(5)->get();
        

            //populate activities with recent hr replies
            $activities = $activities->concat($recentHrReplies->map(fn($reply) => [
                'type' => 'HrReply',
                'id' => $reply->id,
                'post_id' => $reply->post_id,
                'body' => $reply->body,
                'time' => $reply->created_at->diffForHumans(),
            ]));
        }

        //get 5 recent comments of the currecnt user
        $recentComments = Comment::where('user_id', $user->id)->latest()->take(5)->get();

        //populate activities with recent comments
        $activities = $activities->concat($recentComments->map(fn($comment) => [
            'type' => 'Comment',
            'id' => $comment->id,
            'post_id' => $comment->post_id,
            'body' => $comment->body,
            'time' => $comment->created_at->diffForHumans(),
        ]));

        //get 5 recent flagged posts
        $recentFlaggedPosts = Post::whereNotNull('flaged_at')->where('user_id', $user->id)->latest()->take(5)->get();

        //populate activities with recent flagged posts
        $activities = $activities->concat($recentFlaggedPosts->map(fn($post) => [
            'type' => 'FlaggedPost',
            'id' => $post->id,
            'title' => $post->title,
            'time' => $post->flaged_at->diffForHumans(),
        ]));

        //sort activities by time
        $sortedActivities = $activities->sortByDesc(function($activity) {
            if (isset($activity['time'])) {
                return $activity['time'];
            }
            if (isset($activity['flagged_at'])) {
                return $activity['flagged_at'];
            }
            return now();
        })->values();

        //get 5 recent activities
        $recentActivities = $sortedActivities->take(5);

        return response()->json([
            'data' => $recentActivities,
        ]);
    }

    /**
     * Call OpenRouter to determine if post should be flagged.
     */
    private function shouldFlagPostAI(string $title, string $body): bool
    {
        $apiKey = env('OPENROUTER_API_KEY');
        if (empty($apiKey)) {
            return false;
        }

        $prompt = $this->buildAIFlagPrompt($title, $body);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
            'HTTP-Referer' => config('app.url'),
            'X-Title' => config('app.name', 'AEFS-Apor'),
        ])->post('https://openrouter.ai/api/v1/chat/completions', [
            'model' => 'anthropic/claude-3-haiku',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'You are a content moderation assistant for an anonymous employee feedback system. Return only JSON.'
                ],
                [
                    'role' => 'user',
                    'content' => $prompt,
                ],
            ],
            'max_tokens' => 200,
            'temperature' => 0.1,
        ]);

        if (!$response->successful()) {
            return false;
        }

        $content = data_get($response->json(), 'choices.0.message.content');
        if (!is_string($content)) {
            return false;
        }

        // Extract JSON from the model output
        $jsonStart = strpos($content, '{');
        $jsonEnd = strrpos($content, '}');
        if ($jsonStart !== false && $jsonEnd !== false) {
            $json = substr($content, $jsonStart, $jsonEnd - $jsonStart + 1);
        } else {
            $json = $content;
        }

        $parsed = json_decode($json, true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($parsed)) {
            return false;
        }

        return (bool)($parsed['should_flag'] ?? false);
    }

    private function buildAIFlagPrompt(string $title, string $body): string
    {
        $content = "Title: {$title}\n\nContent: {$body}";
        return <<<PROMPT
Analyze the following anonymous employee feedback for policy violations. Respond ONLY with JSON using this schema:
{
  "should_flag": boolean,
  "confidence": number (0-100),
  "reasons": ["string", ...]
}

Flag if it includes: harassment/bullying, threats, discrimination, explicit sexual content, hate speech, doxxing, credible accusations without evidence, or clear policy violations. Be conservative; if unclear, set should_flag to false.

$content
PROMPT;
    }
}
