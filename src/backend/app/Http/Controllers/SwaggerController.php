<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

/**
 * @OA\Schema(
 *     schema="NewUser",
 *     type="object",
 *     @OA\Property(property="name", type="string", example="John Doe"),
 *     @OA\Property(property="email", type="string", format="email", example="john.doe@example.com"),
 *     @OA\Property(property="first_name", type="string", example="John"),
 *     @OA\Property(property="last_name", type="string", example="Doe"),
 *     @OA\Property(property="middle_name", type="string", nullable=true, example="Michael"),
 *     @OA\Property(property="username", type="string", example="AnonymousEmployee1234"),
 *     @OA\Property(property="role", type="string", nullable=true, example="Employee")
 * )
 */
class SwaggerController extends Controller
{
    //
}
