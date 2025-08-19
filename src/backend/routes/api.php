<?php

use App\Http\Controllers\API\HomeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Passport\Http\Controllers\AccessTokenController;

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

// Microsoft 365 Authentication Routes
Route::prefix('auth')->group(function () {
    Route::get('/microsoft', [App\Http\Controllers\Auth\MicrosoftController::class, 'redirectToMicrosoft']);
    Route::get('/microsoft/callback', [App\Http\Controllers\Auth\MicrosoftController::class, 'handleMicrosoftCallback']);
    Route::post('/microsoft/validate', [App\Http\Controllers\Auth\MicrosoftController::class, 'validateMsalToken']);
    Route::post('/logout', [App\Http\Controllers\Auth\MicrosoftController::class, 'logout']);
    Route::get('/user', [App\Http\Controllers\Auth\MicrosoftController::class, 'user']);
    
    // Test endpoint
    Route::get('/test', function () {
        return response()->json([
            'status' => 'success',
            'message' => 'Backend API is working',
            'timestamp' => now()->toISOString(),
            'passport_keys_exist' => file_exists(storage_path('oauth-private.key')) && file_exists(storage_path('oauth-public.key'))
        ]);
    });
});

// Default API Homepage
Route::get('/', [HomeController::class, '__invoke']);

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
