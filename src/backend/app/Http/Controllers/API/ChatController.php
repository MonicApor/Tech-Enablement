<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Chat;
use App\Http\Resources\ChatResource;
use App\Http\Resources\ChatListResource;
use Illuminate\Http\JsonResponse;
use App\Models\User;

/**
 * @OA\Tag(
 *     name="Chats",
 *     description="Chat management endpoints"
 * )
 */
class ChatController extends Controller
{
   /**
    * Display a listing of the user's chats.
    * 
    * @OA\Get(
    *     path="/api/chats",
    *     summary="Get user's chats",
    *     tags={"Chats"},
    *     security={{"bearerAuth": {}}},
    *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="data", type="array", @OA\Items(type="object")))),
    *     @OA\Response(response=401, description="Unauthenticated")
    * )
    */

   public function index(Request $request): JsonResponse
   {
      $this->authorize('viewAny', Chat::class);

      $user = auth()->user();
      $chats = Chat::forUser($user->employee->id)
      ->with(['post', 'employeeUser.user', 'hrUser.user', 'lastMessage'])
      ->orderBy('last_message_at', 'desc')
      ->get();

      return response()->json([
         'data' => ChatListResource::collection($chats)
      ]);
   }

   /**
    * Store a newly created chat in storage.
    * 
    * @OA\Post(
    *     path="/api/chats",
    *     summary="Create a new chat",
    *     tags={"Chats"},
    *     security={{"bearerAuth": {}}},
    *     @OA\RequestBody(required=true, @OA\JsonContent(required={"post_id", "employee_user_id"}, @OA\Property(property="post_id", type="integer"), @OA\Property(property="employee_user_id", type="integer"))),
    *     @OA\Response(response=201, description="Created", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"), @OA\Property(property="data", type="object"))),
    *     @OA\Response(response=400, description="Bad request", @OA\JsonContent(ref="#/components/schemas/Error")),
    *     @OA\Response(response=401, description="Unauthenticated"),
    *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error"))
    * )
    */

   public function store(Request $request): JsonResponse
   {
      $this->authorize('create', Chat::class);

      $request->validate([
         'post_id' => 'required|exists:posts,id',
         'employee_user_id' => 'required|exists:users,id',
      ]);

      $user = auth()->user();

      $hrEmployeeId = null;
      $employeeEmployeeId = null;

      if ($user->role_id === 2) {
         $hrEmployeeId = $user->employee->id;
         $employeeUser = User::find($request->employee_user_id);
         if (!$employeeUser || !$employeeUser->employee) {
            return response()->json(['message' => 'Employee user not found or has no employee record'], 400);
         }
         $employeeEmployeeId = $employeeUser->employee->id;
         
         if ($hrEmployeeId === $employeeEmployeeId) {
            return response()->json(['message' => 'HR user cannot create a chat with themselves'], 400);
         }
      } else {
         $hrUser = User::where('role_id', 2)->first();
         if (!$hrUser) {
            return response()->json(['message' => 'No HR user available'], 400);
         }
         $hrEmployeeId = $hrUser->employee->id;
         $employeeEmployeeId = $user->employee->id;
      }

      // Prevent creating chat where HR and employee are the same person
      if ($hrEmployeeId === $employeeEmployeeId) {
         return response()->json(['message' => 'Cannot create chat with yourself'], 400);
      }

      // Check if chat already exists for this specific post-employee-HR combination
      $existingChat = Chat::where('post_id', $request->post_id)
         ->where('employee_employee_id', $employeeEmployeeId)
         ->where('hr_employee_id', $hrEmployeeId)
         ->first();

      if ($existingChat) {
         $existingChat->load(['post', 'employeeUser.user', 'hrUser.user']);
         return response()->json([
            'message' => 'Chat already exists',
            'data' => new ChatResource($existingChat)
         ], 400);
      }

      // Create new chat
      $chat = Chat::create([
         'post_id' => $request->post_id,
         'employee_employee_id' => $employeeEmployeeId,
         'hr_employee_id' => $hrEmployeeId,
         'status' => 'active',
         'last_message_at' => now(),
      ]);

      $chat->load(['post', 'employeeUser.user', 'hrUser.user']);

      return response()->json([
         'message' => 'Chat created successfully',
         'data' => new ChatResource($chat)
      ], 201);
      
   }

   /**
   * Display the specified chat.
   * 
   * @OA\Get(
   *     path="/api/chats/{id}",
   *     summary="Get a chat by ID",
   *     tags={"Chats"},
   *     security={{"bearerAuth": {}}},
   *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
   *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="data", type="object"))),
   *     @OA\Response(response=400, description="Bad request", @OA\JsonContent(ref="#/components/schemas/Error")),
   *     @OA\Response(response=401, description="Unauthenticated"),
   *     @OA\Response(response=404, description="Not Found")
   * )
   */
   public function show(Chat $chat): JsonResponse
   {
      $this->authorize('view', $chat);

      $user = auth()->user();

      $chat->markAsRead($user->id);

      $chat->load(['post', 'employeeUser', 'hrUser', 'messages.sender']);
      
      return response()->json([
         'data' => new ChatResource($chat)
      ]);
   }

   /**
   * Get chat by post and employee.
   * 
   * @OA\Get(
   *     path="/api/chats/by-post-employee",
   *     summary="Get a chat by post ID and employee user ID",
   *     tags={"Chats"},
   *     security={{"bearerAuth": {}}},
   *     @OA\Parameter(name="post_id", in="query", required=true, @OA\Schema(type="integer")),
   *     @OA\Parameter(name="employee_user_id", in="query", required=true, @OA\Schema(type="integer")),
   *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="data", type="object"))),
   *     @OA\Response(response=401, description="Unauthenticated"),
   *     @OA\Response(response=404, description="Not Found")
   * )
   */
   public function getChatByPostAndEmployee(Request $request): JsonResponse
   {
      $request->validate([
         'post_id' => 'required|exists:posts,id',
         'employee_user_id' => 'required|exists:users,id',
      ]);

      $user = auth()->user();

      $employeeUser = User::find($request->employee_user_id);
      if (!$employeeUser || !$employeeUser->employee) {
         return response()->json(['message' => 'Employee user not found or has no employee record'], 400);
      }
      
      $chat = Chat::where('post_id', $request->post_id)
         ->where('employee_employee_id', $employeeUser->employee->id)
         ->where('hr_employee_id', $user->employee->id)
         ->first();

      if (!$chat) {
         return response()->json(['message' => 'Chat not found'], 404);
      }

      $this->authorize('view', $chat);

      $chat->markAsRead($user->employee->id);
      $chat->load(['post', 'employeeUser.user', 'hrUser.user', 'messages.sender']);
      
      // Ensure the other participant's user relationship is loaded
      if ($chat->employeeUser && !$chat->employeeUser->relationLoaded('user')) {
          $chat->employeeUser->load('user');
      }
      if ($chat->hrUser && !$chat->hrUser->relationLoaded('user')) {
          $chat->hrUser->load('user');
      }
      
      return response()->json([
         'data' => new ChatResource($chat)
      ]);
   }

   /**
    * Update the specified chat.
    * 
    * @OA\Put(
    *     path="/api/chats/{id}",
    *     summary="Update a chat",
    *     tags={"Chats"},
    *     security={{"bearerAuth": {}}},
    *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
    *     @OA\RequestBody(required=true, @OA\JsonContent(@OA\Property(property="status", type="string", enum={"active", "closed", "archived"}))),
    *     @OA\Response(response=200, description="Updated", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"), @OA\Property(property="data", type="object"))),
    *     @OA\Response(response=400, description="Bad request", @OA\JsonContent(ref="#/components/schemas/Error")),
    *     @OA\Response(response=401, description="Unauthenticated"),
    *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error"))
    * )
    */

   public function update(Request $request, Chat $chat): JsonResponse
   {
      $this->authorize('update', $chat);

      $request->validate([
         'status' => 'required|in:active,closed,archived',
      ]);

      $oldStatus = $chat->status;
      $chat->update([
         'status' => $request->status,
      ]);

      $chat->load(['post', 'employeeUser.user', 'hrUser.user']);

      $message = match($request->status) {
         'active' => 'Chat reopened',
         'closed' => 'Chat closed',
         'archived' => 'Chat archived',
         default => 'Chat status updated',
      };

      return response()->json([
         'message' => $message,
            'data' => new ChatResource($chat)
      ]);
   }

   /**
   * Remove the specified chat.
   * 
   * @OA\Delete(
   *     path="/api/chats/{id}",
   *     summary="Delete a chat",
   *     tags={"Chats"},
   *     security={{"bearerAuth": {}}},
   *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
   *     @OA\Response(response=200, description="Deleted", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"))),
   *     @OA\Response(response=401, description="Unauthenticated"),
   *     @OA\Response(response=404, description="Not Found")
   * )
   */

   public function destroy(Chat $chat): JsonResponse
   {
      $this->authorize('delete', $chat);

      $chat->delete();

      return response()->json([
         'message' => 'Chat deleted successfully'
      ]);
   }

    

    /**
     * Close a chat.
     * 
     * @OA\Post(
     *     path="/api/chats/{id}/close",
     *     summary="Close a chat",
     *     tags={"Chats"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"), @OA\Property(property="data", type="object"))),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */

    public function close(Chat $chat): JsonResponse
    {
      $this->authorize('update', $chat);

      $chat->update(['status' => 'closed']);

      $chat->load(['post', 'employeeUser.user', 'hrUser.user']);

      return response()->json([
         'message' => 'Chat closed successfully',
         'data' => new ChatResource($chat)
      ]);
    }

    /**
     * Archive a chat.
     * 
     * @OA\Post(
     *     path="/api/chats/{id}/archive",
     *     summary="Archive a chat",
     *     tags={"Chats"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"), @OA\Property(property="data", type="object"))),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */

    public function archive(Chat $chat): JsonResponse
    {
      $this->authorize('update', $chat);

      $chat->update(['status' => 'archived']);

      $chat->load(['post', 'employeeUser', 'hrUser']);

      return response()->json([
         'message' => 'Chat archived successfully',
         'data' => new ChatResource($chat)
      ]);
    }

    /**
     * Reopen a chat.
     * 
     * @OA\Post(
     *     path="/api/chats/{id}/reopen",
     *     summary="Reopen a chat",
     *     tags={"Chats"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"), @OA\Property(property="data", type="object"))),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */

    public function reopen(Chat $chat): JsonResponse
    {
      $this->authorize('update', $chat);

      $chat->update(['status' => 'active']);

      $chat->load(['post', 'employeeUser', 'hrUser']);   

      return response()->json([
         'message' => 'Chat reopened successfully',
         'data' => new ChatResource($chat)
      ]);
    }
   
}
