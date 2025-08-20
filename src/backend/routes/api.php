<?php

use App\Http\Controllers\API\HomeController;
use Illuminate\Support\Facades\Route;
use Laravel\Passport\Http\Controllers\AccessTokenController;
use App\Http\Controllers\Auth\MicrosoftController;

Route::post('/oauth/token', [AccessTokenController::class, 'issueToken'])->middleware('throttle')->name('passport.auth');

Route::prefix('auth')->group(function () {
    Route::post('/microsoft/validate', [MicrosoftController::class, 'validateMsalToken']);
    Route::post('/logout', [MicrosoftController::class, 'logout']);
    Route::get('/user', [MicrosoftController::class, 'user']);
});

Route::get('/', [HomeController::class, '__invoke']);
