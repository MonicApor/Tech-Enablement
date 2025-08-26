<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Resources\PostResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Post;

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
        $query = Post::with(['user', 'category', 'comments'])
            ->active()
            ->orderBy('created_at', 'desc');

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
        if ($request->has('sort')) {
            $query->orderBy('created_at', $request->sort);
        }

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
        $post = Post::create($request->validated());
        return response()->json([
            'message' => 'Post created successfully',
            'data' => new PostResource($post->load('user', 'category')),
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
            'data' => new PostResource($post->load('user', 'category', 'comments')),
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
        $post->update($request->validated());
        return response()->json([
            'message' => 'Post updated successfully',
            'data' => new PostResource($post->load('user', 'category')),
        ]);
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
    public function destroy(string $id)
    {
        //check if user owns the post
        if(auth()->user()->id !== $post->user_id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

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
        $post->flag();
        return response()->json([
            'message' => 'Post flagged successfully',
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
        $post->upvote();
        return response()->json([
            'message' => 'Post upvoted successfully',
        ]);
    }

    /**
     * Get posts by category
     * 
     * @OA\Get(
     *     path="/api/post/category/{categoryId}",
     *     summary="Get posts by category",
     *     tags={"Posts"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="categoryId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Post")))),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function getPostsByCategory(Request $request, $categoryId): JsonResponse
    {
        $posts = Post::with(['user', 'category', 'comments'])
            ->active()
            ->category($categoryId)
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 10), ['*'], 'page', $request->input('page', 1));
        return response()->json([
            'data' => PostResource::collection($posts),
        ]);
    }
}
