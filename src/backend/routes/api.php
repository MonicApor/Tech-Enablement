<?php

use App\Http\Controllers\API\HomeController;
use App\Http\Controllers\API\PostController;
use App\Http\Controllers\API\CommentController;
use App\Http\Controllers\API\CategoryController;
use Illuminate\Support\Facades\Route;
use Laravel\Passport\Http\Controllers\AccessTokenController;
use App\Http\Controllers\Auth\MicrosoftController;

Route::post('/oauth/token', [AccessTokenController::class, 'issueToken'])->middleware('throttle')->name('passport.auth');

Route::prefix('auth')->group(function () {
    Route::post('/microsoft/validate', [MicrosoftController::class, 'validateMsalToken']);
    Route::post('/logout', [MicrosoftController::class, 'logout']);
    Route::get('/user', [MicrosoftController::class, 'user']);
});


// post routest p
Route::middleware('auth:api')->group(function () {
    Route::apiResource('/posts', PostController::class);
    Route::post('/posts/{post}/upvote', [PostController::class, 'upvote']);
    Route::post('/posts/{post}/flag', [PostController::class, 'flag']);
    Route::post('/posts/{post}/resolve', [PostController::class, 'resolve']);
    Route::get('/post/category/{categoryId}', [PostController::class, 'getPostsByCategory']);
});

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


Route::get('/', [HomeController::class, '__invoke']);

// protected routes
Route::middleware('auth:api')->group(function () {
    Route::get('/profile', [MicrosoftController::class, 'profile']);
});
