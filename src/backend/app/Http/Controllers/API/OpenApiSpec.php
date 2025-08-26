<?php

namespace App\Http\Controllers\API;

/**
 * @OA\Info(
 *     title="ANON - Anonymous Employee Platform API",
 *     version="1.0.0",
 *     description="API documentation for the Anonymous Employee Platform. This platform allows employees to post anonymous messages and interact with each other.",
 *     @OA\Contact(
 *         email="support@company.com",
 *         name="API Support"
 *     ),
 *     @OA\License(
 *         name="MIT",
 *         url="https://opensource.org/licenses/MIT"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000",
 *     description="Local Development Server"
 * )
 * 
 * @OA\Server(
 *     url="https://api.company.com",
 *     description="Production Server"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Enter your bearer token in the format: Bearer {token}"
 * )
 * 
 * @OA\Security(
 *     {
 *         "bearerAuth": {}
 *     }
 * )
 * 
 * @OA\Tag(
 *     name="Authentication",
 *     description="Authentication endpoints for Microsoft OAuth"
 * )
 * 
 * @OA\Tag(
 *     name="Posts",
 *     description="Anonymous post management endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Comments",
 *     description="Comment management endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="Categories",
 *     description="Category management endpoints"
 * )
 * 
 * @OA\Tag(
 *     name="User",
 *     description="User profile and management endpoints"
 * )
 * 
 * @OA\Components(
 *     @OA\Schema(
 *         schema="Error",
 *         type="object",
 *         @OA\Property(property="error", type="string", example="Error message"),
 *         @OA\Property(property="message", type="string", example="Detailed error message"),
 *         @OA\Property(property="debug", type="string", example="Debug information", nullable=true)
 *     ),
 *     @OA\Schema(
 *         schema="Success",
 *         type="object",
 *         @OA\Property(property="message", type="string", example="Operation completed successfully"),
 *         @OA\Property(property="data", type="object", nullable=true)
 *     ),
 *     @OA\Schema(
 *         schema="SuccessMessage",
 *         type="object",
 *         @OA\Property(property="message", type="string", example="Operation completed successfully")
 *     ),
 *     @OA\Schema(
 *         schema="UnauthorizedError",
 *         type="object",
 *         @OA\Property(property="message", type="string", example="Unauthorized")
 *     ),
 *     @OA\Schema(
 *         schema="User",
 *         type="object",
 *         @OA\Property(property="id", type="integer", example=1),
 *         @OA\Property(property="name", type="string", example="John Doe"),
 *         @OA\Property(property="email", type="string", example="john@example.com"),
 *         @OA\Property(property="microsoft_id", type="string", example="123456789", nullable=true),
 *         @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00.000000Z"),
 *         @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T00:00:00.000000Z")
 *     ),
 *     @OA\Schema(
 *         schema="Category",
 *         type="object",
 *         @OA\Property(property="id", type="integer", example=1),
 *         @OA\Property(property="name", type="string", example="Technology"),
 *         @OA\Property(property="description", type="string", example="Technology related posts", nullable=true),
 *         @OA\Property(property="posts_count", type="integer", example=15),
 *         @OA\Property(property="active_posts_count", type="integer", example=10),
 *         @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00.000000Z"),
 *         @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T00:00:00.000000Z")
 *     ),
 *     @OA\Schema(
 *         schema="Post",
 *         type="object",
 *         @OA\Property(property="id", type="integer", example=1),
 *         @OA\Property(property="title", type="string", example="Sample Post Title"),
 *         @OA\Property(property="body", type="string", example="This is the content of the post"),
 *         @OA\Property(property="user_id", type="integer", example=1),
 *         @OA\Property(property="category_id", type="integer", example=1),
 *         @OA\Property(property="upvotes", type="integer", example=5),
 *         @OA\Property(property="downvotes", type="integer", example=1),
 *         @OA\Property(property="is_resolved", type="boolean", example=false),
 *         @OA\Property(property="is_flagged", type="boolean", example=false),
 *         @OA\Property(property="user", ref="#/components/schemas/User"),
 *         @OA\Property(property="category", type="object", @OA\Property(property="id", type="integer"), @OA\Property(property="name", type="string")),
 *         @OA\Property(property="comments", type="array", @OA\Items(ref="#/components/schemas/Comment")),
 *         @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00.000000Z"),
 *         @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T00:00:00.000000Z")
 *     ),
 *     @OA\Schema(
 *         schema="Comment",
 *         type="object",
 *         @OA\Property(property="id", type="integer", example=1),
 *         @OA\Property(property="body", type="string", example="This is a great post!"),
 *         @OA\Property(property="user_id", type="integer", example=1),
 *         @OA\Property(property="post_id", type="integer", example=1),
 *         @OA\Property(property="parent_id", type="integer", example=null, nullable=true),
 *         @OA\Property(property="user", ref="#/components/schemas/User"),
 *         @OA\Property(property="replies", type="array", @OA\Items(ref="#/components/schemas/Comment")),
 *         @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00.000000Z"),
 *         @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T00:00:00.000000Z")
 *     )
 * )
 */
class OpenApiSpec
{
    // This class is used only for OpenAPI documentation
}
