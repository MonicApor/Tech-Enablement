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
                'content' => $this->post->body,
            ],
            'other_participant' => $this->getOtherParticipantData(),
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

    private function getOtherParticipantData()
    {
        $user = auth()->user();
        $otherParticipant = $this->getOtherParticipant($user->employee->id);
        if (!$otherParticipant) return null;
        
        // If current user is employee, show HR details (name, not username)
        if ($user->isEmployee() && $otherParticipant->user && $otherParticipant->user->role_id === 2) {
            return [
                'id' => $otherParticipant->id,
                'position' => $otherParticipant->position,
                'user' => [
                    'id' => $otherParticipant->user->id,
                    'username' => $otherParticipant->user->username,
                    'name' => $otherParticipant->user->name, // Show real name for HR
                    'avatar' => $otherParticipant->user->avatar,
                    'role_id' => $otherParticipant->user->role_id,
                ],
            ];
        }
        
        // If current user is HR, show employee details (username only for anonymity)
        if ($user->role_id === 2 && $otherParticipant->user && $otherParticipant->user->role_id !== 2) {
            return [
                'id' => $otherParticipant->id,
                'position' => $otherParticipant->position,
                'user' => [
                    'id' => $otherParticipant->user->id,
                    'username' => $otherParticipant->user->username, // Show username for anonymity
                    'name' => $otherParticipant->user->username, // Use username as display name
                    'avatar' => $otherParticipant->user->avatar,
                    'role_id' => $otherParticipant->user->role_id,
                ],
            ];
        }
        
        return null;
    }
}
