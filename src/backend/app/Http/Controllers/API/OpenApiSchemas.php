<?php

namespace App\Http\Controllers\API;

/**
 * @OA\Schema(
 *     schema="Chat",
 *     title="Chat",
 *     description="Chat model",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="post_id", type="integer", example=1),
 *     @OA\Property(property="post_title", type="string", example="New Office Policy Implementation"),
 *     @OA\Property(property="post_content", type="string", example="I think the new office policy regarding remote work is great..."),
 *     @OA\Property(property="hr_user_id", type="integer", example=5),
 *     @OA\Property(property="hr_user_name", type="string", example="HR Manager"),
 *     @OA\Property(property="employee_user_id", type="integer", example=10),
 *     @OA\Property(property="employee_user_name", type="string", example="Anonymous Employee"),
 *     @OA\Property(property="status", type="string", enum={"active", "closed", "archived"}, example="active"),
 *     @OA\Property(property="last_message_at", type="string", format="date-time", example="2024-08-28T14:30:00Z"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-08-28T10:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-08-28T14:30:00Z"),
 *     @OA\Property(property="unread_count", type="integer", example=2),
 *     @OA\Property(property="total_messages", type="integer", example=5),
 *     @OA\Property(
 *         property="latest_message",
 *         type="object",
 *         nullable=true,
 *         @OA\Property(property="id", type="integer", example=1),
 *         @OA\Property(property="content", type="string", example="Hi! I saw your feedback about the collaboration tools."),
 *         @OA\Property(property="sender_id", type="integer", example=5),
 *         @OA\Property(property="sender_name", type="string", example="HR Manager"),
 *         @OA\Property(property="sender_avatar", type="string", example="HR"),
 *         @OA\Property(property="created_at", type="string", format="date-time", example="2024-08-28T14:30:00Z")
 *     ),
 *     @OA\Property(
 *         property="other_participant",
 *         type="object",
 *         nullable=true,
 *         @OA\Property(property="id", type="integer", example=10),
 *         @OA\Property(property="name", type="string", example="Anonymous Employee"),
 *         @OA\Property(property="avatar", type="string", example="AE")
 *     )
 * )
 */

/**
 * @OA\Schema(
 *     schema="ChatMessage",
 *     title="Chat Message",
 *     description="Chat message model",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="chat_id", type="integer", example=1),
 *     @OA\Property(property="sender_id", type="integer", example=5),
 *     @OA\Property(property="sender_name", type="string", example="HR Manager"),
 *     @OA\Property(property="sender_avatar", type="string", example="HR"),
 *     @OA\Property(property="content", type="string", example="Hi! I saw your feedback about the collaboration tools."),
 *     @OA\Property(property="message_type", type="string", enum={"text", "image", "file", "system"}, example="text"),
 *     @OA\Property(property="read_at", type="string", format="date-time", nullable=true, example="2024-08-28T14:35:00Z"),
 *     @OA\Property(property="is_read", type="boolean", example=true),
 *     @OA\Property(property="is_deleted", type="boolean", example=false),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-08-28T14:30:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-08-28T14:30:00Z"),
 *     @OA\Property(property="is_from_hr", type="boolean", example=true),
 *     @OA\Property(property="is_from_employee", type="boolean", example=false),
 *     @OA\Property(
 *         property="sender",
 *         type="object",
 *         nullable=true,
 *         @OA\Property(property="id", type="integer", example=5),
 *         @OA\Property(property="name", type="string", example="HR Manager"),
 *         @OA\Property(property="email", type="string", example="hr@company.com")
 *     )
 * )
 */

/**
 * @OA\Schema(
 *     schema="SuccessMessage",
 *     title="Success Message",
 *     description="Success response message",
 *     @OA\Property(property="message", type="string", example="Operation completed successfully")
 * )
 */

/**
 * @OA\Schema(
 *     schema="Error",
 *     title="Error Response",
 *     description="Error response",
 *     @OA\Property(property="message", type="string", example="An error occurred"),
 *     @OA\Property(property="errors", type="object", nullable=true)
 * )
 */

/**
 * @OA\Schema(
 *     schema="UnauthorizedError",
 *     title="Unauthorized Error",
 *     description="Unauthorized error response",
 *     @OA\Property(property="message", type="string", example="Unauthorized action.")
 * )
 */
