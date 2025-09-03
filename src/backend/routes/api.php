<?php

use App\Http\Controllers\API\HomeController;
use App\Http\Controllers\API\PostController;
use App\Http\Controllers\API\CommentController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\UserStructureController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\MicrosoftController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\TokenController;
use App\Http\Controllers\API\ChatController;
use App\Http\Controllers\API\ChatMessageController;
use App\Http\Controllers\API\BroadcastingController;



// Public auth routes (no authentication required)
Route::prefix('auth')->group(function () {
    Route::post('/microsoft/validate', [MicrosoftController::class, 'validateMsalToken']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/activate', [AuthController::class, 'activate']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/verify-token', [TokenController::class, 'verify']);
});

// Protected auth routes (authentication required)
Route::prefix('auth')->middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/user', [MicrosoftController::class, 'user']);
    Route::get('/profile', [MicrosoftController::class, 'profile']);
});

// post routes
Route::middleware('auth:api')->group(function () {
    Route::get('/posts/trending-topics', [PostController::class, 'trendingTopics']);
    Route::get('/posts/recent-activities', [PostController::class, 'recentActivities']);
    Route::apiResource('/posts', PostController::class);
    Route::post('/posts/{post}/upvote', [PostController::class, 'upvote']);
    Route::post('/posts/{post}/flag', [PostController::class, 'flag']);
    Route::post('/posts/{post}/resolve', [PostController::class, 'resolve']);
});

Route::get('/attachments/{path}', [PostController::class, 'downloadAttachment'])
    ->where('path', '.*')
    ->name('api.attachments.download');

//Comment routes
Route::middleware('auth:api')->group(function () {
    Route::apiResource('/comments', CommentController::class);
    Route::post('/comments/{comment}/flag', [CommentController::class, 'flag']);
    Route::get('/posts/{post}/comments', [CommentController::class, 'index']);
});

//Category
Route::middleware('auth:api')->group(function () {
    Route::apiResource('/categories', CategoryController::class);
});

// Chat routes
Route::middleware('auth:api')->group(function () {
    Route::get('/chats/by-post-employee', [ChatController::class, 'getChatByPostAndEmployee']);
    Route::apiResource('/chats', ChatController::class);    
    Route::post('/chats/{chat}/close', [ChatController::class, 'close']);
    Route::post('/chats/{chat}/archive', [ChatController::class, 'archive']);
    Route::post('/chats/{chat}/reopen', [ChatController::class, 'reopen']);
});

// Chat message routes
Route::middleware('auth:api')->group(function () {
    Route::apiResource('/chats/{chat}/messages', ChatMessageController::class);
});

Route::get('/', [HomeController::class, '__invoke']);

// Custom broadcasting authentication route
Route::post('/broadcasting/auth', [BroadcastingController::class, 'authenticate'])->middleware('auth:api');


