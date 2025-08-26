<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Comment\StoreCommentRequest;
use App\Http\Requests\Comment\UpdateCommentRequest;
use Illuminate\Http\Request;
use App\Http\Resources\CommentResource;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\JsonResponse;

/**
 * @OA\Tag(
 *     name="Comments",
 *     description="Comment management endpoints"
 * )
 */
class CommentController extends Controller
{
    /**
     * Display comments for a post
     * 
     * @OA\Get(
     *     path="/api/posts/{post}/comments",
     *     summary="Get comments for a post",
     *     tags={"Comments"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="post", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Comment")))),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function index(Post $post): JsonResponse
    {
        $comments = $post->topLevelComments()->with(['user', 'replies.user'])->orderBy('created_at', 'desc')->get();
        return CommentResource::collection($comments);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @OA\Post(
     *     path="/api/comments",
     *     summary="Create a new comment",
     *     tags={"Comments"},
     *     security={{"bearerAuth": {}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(required={"body", "post_id"}, @OA\Property(property="body", type="string"), @OA\Property(property="post_id", type="integer"), @OA\Property(property="parent_id", type="integer", nullable=true))),
     *     @OA\Response(response=201, description="Created", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"), @OA\Property(property="data", ref="#/components/schemas/Comment"))),
     *     @OA\Response(response=400, description="Bad request", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function store(StoreCommentRequest $request): JsonResponse
    {
        $comment = Comment::create($request->validated());
        return response()->json([
            'message' => 'Comment created successfully',
            'data' => new CommentResource($comment->load('user')),
        ], 201);
    }

    /**
     * Display the specified resource.
     * 
     * @OA\Get(
     *     path="/api/comments/{id}",
     *     summary="Get a specific comment",
     *     tags={"Comments"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="data", ref="#/components/schemas/Comment"))),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function show(Comment $comment): JsonResponse
    {
        return response()->json([
            'data' => new CommentResource($comment->load('user')),
        ]);
    }

    /**
     * Update the specified resource in storage.
     * 
     * @OA\Put(
     *     path="/api/comments/{id}",
     *     summary="Update a comment",
     *     tags={"Comments"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(@OA\Property(property="body", type="string"))),
     *     @OA\Response(response=200, description="Updated", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"), @OA\Property(property="data", ref="#/components/schemas/Comment"))),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Unauthorized", @OA\JsonContent(ref="#/components/schemas/UnauthorizedError")),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function update(UpdateCommentRequest $request, Comment $comment): JsonResponse
    {
        //check if user owns the comment
        if(auth()->user()->id !== $comment->user_id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $comment->update($request->validated());
        return response()->json([
            'message' => 'Comment updated successfully',
            'data' => new CommentResource($comment->load('user')),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @OA\Delete(
     *     path="/api/comments/{id}",
     *     summary="Delete a comment",
     *     tags={"Comments"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(ref="#/components/schemas/SuccessMessage")),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Unauthorized", @OA\JsonContent(ref="#/components/schemas/UnauthorizedError")),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function destroy(Comment $comment): JsonResponse
    {
        //check if user owns the comment
        if(auth()->user()->id !== $comment->user_id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $comment->delete();
        return response()->json([
            'message' => 'Comment deleted successfully',
        ]);
    }

    /**
     * Flag a comment
     * 
     * @OA\Post(
     *     path="/api/comments/{id}/flag",
     *     summary="Flag a comment",
     *     tags={"Comments"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(ref="#/components/schemas/SuccessMessage")),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function flag(Comment $comment): JsonResponse
    {
        $comment->flag();
        return response()->json([
            'message' => 'Comment flagged successfully',
        ]);
    }

    /**
     * Unflag a comment
     * 
     * @OA\Post(
     *     path="/api/comments/{id}/unflag",
     *     summary="Unflag a comment",
     *     tags={"Comments"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(ref="#/components/schemas/SuccessMessage")),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function unflag(Comment $comment): JsonResponse
    {
        $comment->unflag();
        return response()->json([
            'message' => 'Comment unflagged successfully',
        ]);
    }
    
}
