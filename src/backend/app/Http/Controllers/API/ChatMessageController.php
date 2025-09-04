<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Chat;
use App\Http\Resources\ChatMessageResource;
use Illuminate\Http\JsonResponse;
use App\Events\MessageSent;
use App\Models\ChatMessage;

/**
 * @OA\Tag(
 *     name="Chat Messages",
 *     description="Chat message management endpoints"
 * )
 */

class ChatMessageController extends Controller
{
    /**
    * Display a listing of the user's chat messages.
    * 
    * @OA\Get(
    *     path="/api/chats/{chat}/messages",
    *     summary="Get user's chat messages",
    *     tags={"Chat Messages"},
    *     security={{"bearerAuth": {}}},
    *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="data", type="array", @OA\Items(type="object")))),
    *     @OA\Response(response=401, description="Unauthenticated")
    * )
    */

    public function index(Chat $chat): JsonResponse
    {
        $this->authorize('readMessages', $chat);

        $user = auth()->user();
        $chat->markAsRead($user->employee->id);

        $messages = $chat->messages()->with('sender')->orderBy('created_at', 'asc')->get();

        return response()->json([
            'data' => ChatMessageResource::collection($messages)
        ]);
    }

    /**
     * Store a newly created chat message in storage.
     * 
     * @OA\Post(
     *     path="/api/chats/{chat}/messages",
     *     summary="Send a message to a chat",
     *     tags={"Chat Messages"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="chat", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(required={"content"}, @OA\Property(property="content", type="string"))),
     *     @OA\Response(response=201, description="Created", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"), @OA\Property(property="data", type="object"))),
     *     @OA\Response(response=400, description="Bad request", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=404, description="Not Found")
     * )
     */

    public function store(Request $request, Chat $chat): JsonResponse
    {
        $this->authorize('sendMessage', $chat);

        $request->validate([
            'content' => 'required|string',
        ]);

        $user = auth()->user();

        $message = $chat->messages()->create([
            'sender_id' => $user->employee->id,
            'content' => $request->content,
            'message_type' => $request->message_type ?? 'text',
        ]);

        $chat->updateLastMessage($message);

        $message->load('sender');

        event(new MessageSent($message));

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => new ChatMessageResource($message)
        ], 201);
    }

    /**
     * Display the specified chat message.
     * 
     * @OA\Get(
     *     path="/api/chats/{chat}/messages/{message}",
     *     summary="Get a chat message by ID",
     *     tags={"Chat Messages"},
     *     security={{"bearerAuth": {}}},
         *     @OA\Parameter(name="chat", in="path", required=true, @OA\Schema(type="integer")),
    *     @OA\Parameter(name="message", in="path", required=true, @OA\Schema(type="integer")),
    *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object")),
    *     @OA\Response(response=401, description="Unauthenticated"),
    *     @OA\Response(response=404, description="Not Found")
     * )
     */
    
    public function show(ChatMessage $message): JsonResponse
    {
        $this->authorize('readMessage', $message->chat);

        $message->markAsRead();

        $message->load('sender');   

        return response()->json([
            'message' => 'Message read successfully',
            'data' => new ChatMessageResource($message)
        ]);
    }

    /**
     * Update the specified chat message.
     * 
     * @OA\Put(
     *     path="/api/chats/{chat}/messages/{message}",
     *     summary="Update a chat message",
     *     tags={"Chat Messages"},
     *     security={{"bearerAuth": {}}},
         *     @OA\Parameter(name="chat", in="path", required=true, @OA\Schema(type="integer")),
    *     @OA\Parameter(name="message", in="path", required=true, @OA\Schema(type="integer")),
    *     @OA\RequestBody(required=true, @OA\JsonContent(required={"content"}, @OA\Property(property="content", type="string"))),
    *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object")),
    *     @OA\Response(response=401, description="Unauthenticated"),
    *     @OA\Response(response=404, description="Not Found")
     * )
     */

    public function update(Request $request, ChatMessage $message): JsonResponse
    {
        $this->authorize('readMessage', $message->chat);

        $user = auth()->user();

        if ($message->sender_id !== $user->employee->id) {
            return response()->json([
                'message' => 'You are not authorized to update this message',
            ], 403);
        }

        $request->validate([
            'content' => 'required|string',
        ]);

        $message->update([
            'content' => $request->content,
        ]);

        $message->load('sender');

        return response()->json([
            'message' => 'Message updated successfully',
            'data' => new ChatMessageResource($message)
        ]);
    }

    /**
     * Delete the specified chat message.
     * 
     * @OA\Delete(
     *     path="/api/chats/{chat}/messages/{message}",
     *     summary="Delete a chat message", 
     *     tags={"Chat Messages"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="chat", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="message", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"))),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=404, description="Not Found")
     * )
     */

    public function destroy(ChatMessage $message): JsonResponse
    {
        $this->authorize('readMessage', $message->chat);

        $user = auth()->user();

        if ($message->sender_id !== $user->employee->id) {
            return response()->json([
                'message' => 'You are not authorized to delete this message',
            ], 403);
        }

        $message->update([
            'is_deleted' => true,
        ]);

        return response()->json([
            'message' => 'Message deleted successfully',
        ]);
    }
}
