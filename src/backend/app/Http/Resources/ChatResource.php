<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;    
use App\Http\Resources\EmployeeResource;

class ChatResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = auth()->user();
        return [
            'id' => $this->id,
            'post' => $this->whenLoaded('post', fn($post) => [
                'id' => $post->id,
                'title' => $post->title,
                'content' => $post->body,
            ]),
            'hr_user' => $this->when($this->hrUser, function () {
                return $this->hrUser ? [
                    'id' => $this->hrUser->id,
                    'position' => $this->hrUser->position,
                    'user' => $this->hrUser->user ? [
                        'id' => $this->hrUser->user->id,
                        'username' => $this->hrUser->user->username,
                        'name' => $this->hrUser->user->name,
                        'avatar' => $this->hrUser->user->avatar,
                    ] : null,
                ] : null;
            }),
            'employee_user' => $this->when($this->employeeUser, function () {
                return $this->employeeUser ? [
                    'id' => $this->employeeUser->id,
                    'position' => $this->employeeUser->position,
                    'user' => $this->employeeUser->user ? [
                        'id' => $this->employeeUser->user->id,
                        'username' => $this->employeeUser->user->username,
                        'name' => $this->employeeUser->user->name,
                        'avatar' => $this->employeeUser->user->avatar,
                    ] : null,
                ] : null;
            }),
            'latest_message' => $this->whenLoaded('lastMessage', fn($lastMessage) => [
                'id' => $lastMessage->id,
                'content' => $lastMessage->content,
                'sender_id' => $lastMessage->sender_id,
                'sender_name' => $lastMessage->getSenderDisplayName(),
                'sender_avatar' => $lastMessage->getSenderAvatar(),
                'created_at' => $lastMessage->created_at->toISOString(),
            ]),
            'unread_count' => $user->isEmployee() ? $this->getUnreadMessagesCount($user->employee->id) : 0,
            'total_messages' => $this->messages()->count(),
            'status' => $this->status,
            'last_message_at' => $this->last_message_at,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'other_participant' => $user->isEmployee() && $this->getOtherParticipant($user->employee->id) ? [
                'id' => $this->getOtherParticipant($user->employee->id)->id,
                'name' => $this->getOtherParticipant($user->employee->id)->user->name ?? null,
                'avatar' => $this->getOtherParticipant($user->employee->id)->user->avatar ?? null,
            ] : null,
        ];
    }
}
