<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/docs/{path?}', function () {
    return redirect('/docs/index.html');
})->where('path', '.*');