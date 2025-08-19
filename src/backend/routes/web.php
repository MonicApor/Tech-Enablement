<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\MicrosoftController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Scribe API Documentation
Route::get('/docs/{path?}', function () {
    return redirect('/docs/index.html');
})->where('path', '.*');


//Microsoft Authentication Routes
Route::get('/auth/microsoft', [MicrosoftController::class, 'redirectToMicrosoft'])->name('auth.microsoft');
Route::get('/auth/microsoft/callback', [MicrosoftController::class, 'handleMicrosoftCallback'])->name('auth.microsoft.callback');
Route::get('/auth/logout', [MicrosoftController::class, 'logout'])->name('auth.logout');
Route::get('/auth/user', [MicrosoftController::class, 'user'])->name('auth.user');