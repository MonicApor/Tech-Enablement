<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;

/**
 * @OA\Tag(
 *     name="Categories",
 *     description="Category management endpoints"
 * )
 */
class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @OA\Get(
     *     path="/api/categories",
     *     summary="Get all categories",
     *     tags={"Categories"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Category")))),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function index()
    {
        $categories = Category::withCount('posts')->get();
        return CategoryResource::collection($categories);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @OA\Post(
     *     path="/api/categories",
     *     summary="Create a new category",
     *     tags={"Categories"},
     *     security={{"bearerAuth": {}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(required={"name"}, @OA\Property(property="name", type="string"), @OA\Property(property="description", type="string", nullable=true))),
     *     @OA\Response(response=201, description="Created", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"), @OA\Property(property="data", ref="#/components/schemas/Category"))),
     *     @OA\Response(response=400, description="Bad request", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = Category::create($request->validated());
        return response()->json([
            'message' => 'Category created successfully',
            'data' => new CategoryResource($category),
        ], 201);
    }

    /**
     * Display the specified resource.
     * 
     * @OA\Get(
     *     path="/api/categories/{id}",
     *     summary="Get a specific category",
     *     tags={"Categories"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(type="object", @OA\Property(property="data", ref="#/components/schemas/Category"))),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function show(Category $category): JsonResponse
    {
        return response()->json([
            'data' => new CategoryResource($category),
        ]);
    }

    /**
     * Update the specified resource in storage.
     * 
     * @OA\Put(
     *     path="/api/categories/{id}",
     *     summary="Update a category",
     *     tags={"Categories"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(@OA\Property(property="name", type="string"), @OA\Property(property="description", type="string", nullable=true))),
     *     @OA\Response(response=200, description="Updated", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"), @OA\Property(property="data", ref="#/components/schemas/Category"))),
     *     @OA\Response(response=400, description="Bad request", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $category->update($request->validated());
        return response()->json([
            'message' => 'Category updated successfully',
            'data' => new CategoryResource($category),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @OA\Delete(
     *     path="/api/categories/{id}",
     *     summary="Delete a category",
     *     tags={"Categories"},
     *     security={{"bearerAuth": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success", @OA\JsonContent(ref="#/components/schemas/SuccessMessage")),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=404, description="Not found", @OA\JsonContent(ref="#/components/schemas/Error")),
     *     @OA\Response(response=500, description="Server error", @OA\JsonContent(ref="#/components/schemas/Error"))
     * )
     */
    public function destroy(Category $category): JsonResponse
    {
        $category->delete();
        return response()->json([
            'message' => 'Category deleted successfully',
        ]);
    }
}
