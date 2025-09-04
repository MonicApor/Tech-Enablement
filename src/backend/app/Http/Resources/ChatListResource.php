<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\EmployeeResource;

class ChatListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = auth()->user();
        
        return [
            'id' => $this->id,
            'post' => [
                'id' => $this->post->id,
                'title' => $this->post->title,
            ],
            'other_participant' => $this->when(auth()->user()->isEmployee(), function () {
                $otherParticipant = $this->getOtherParticipant(auth()->user()->employee->id);
                return $otherParticipant ? [
                    'id' => $otherParticipant->id,
                    'position' => $otherParticipant->position,
                    'user' => $otherParticipant->user ? [
                        'id' => $otherParticipant->user->id,
                        'username' => $otherParticipant->user->username,
                        'name' => $otherParticipant->user->name,
                        'avatar' => $otherParticipant->user->avatar,
                    ] : null,
                ] : null;
            }),
            'latest_message' => $this->whenLoaded('lastMessage', fn($lastMessage) => [
                'content' => $lastMessage->content,
            ]),
            'unread_count' => $user->isEmployee() ? $this->getUnreadMessagesCount($user->employee->id) : 0,
            'total_messages' => $this->messages()->count(),
            'status' => $this->status,
            'last_message_at' => $this->last_message_at,
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
