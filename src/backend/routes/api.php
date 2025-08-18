<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Passport\Http\Controllers\AccessTokenController;
use App\Http\Controllers\Auth\MicrosoftController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/oauth/token', [AccessTokenController::class, 'issueToken'])->middleware('throttle')->name('passport.auth');

// Default API Homepage
Route::get('/', function () {
    return response()->json([
        'message' => 'Welcome to ANON API - Anonymous Employee Platform',
        'version' => '1.0.0',
        'status' => 'active'
    ]);
});

// Microsoft Authentication Routes
Route::prefix('auth')->group(function () {
    // Public routes
    Route::get('microsoft', [MicrosoftController::class, 'redirectToMicrosoft'])->name('auth.microsoft');
    Route::get('microsoft/callback', [MicrosoftController::class, 'handleMicrosoftCallback'])->name('auth.microsoft.callback');
    
    // Protected routes
    Route::middleware('microsoft.auth')->group(function () {
        Route::get('user', [MicrosoftController::class, 'user'])->name('auth.user');
        Route::post('logout', [MicrosoftController::class, 'logout'])->name('auth.logout');
    });
});

// Legacy profile endpoint
Route::middleware('microsoft.auth')->get('profile', [MicrosoftController::class, 'user'])->name('profile');

// Build your ANON (Anonymous Employee Platform) API routes here!
// Follow Laravel best practices:
// 
// Example structure:
// Route::post('register', [UserController::class, 'register']);
// Route::post('activate', [UserController::class, 'activate']);
// Route::post('password/forgot', [PasswordController::class, 'forgot']);
// Route::post('password/reset', [PasswordController::class, 'reset']);
//
// Route::prefix('posts')->group(function () {
//     Route::get('/', [PostController::class, 'index']);
//     Route::post('/', [PostController::class, 'create']);
//     Route::get('{id}', [PostController::class, 'read']);
//     Route::put('{id}', [PostController::class, 'update']);
//     Route::delete('{id}', [PostController::class, 'delete']);
// });
