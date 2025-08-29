<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'other_participant' => $this->getOtherParticipant($user->id) ? [
                'id' => $this->getOtherParticipant($user->id)->id,
                'name' => $this->getOtherParticipant($user->id)->name,
                'avatar' => $this->getOtherParticipant($user->id)->avatar,
            ] : null,
            'latest_message' => $this->whenLoaded('lastMessage', fn($lastMessage) => [
                'content' => $lastMessage->content,
            ]),
            'unread_count' => $this->getUnreadMessagesCount($user->id),
            'total_messages' => $this->messages()->count(),
            'status' => $this->status,
            'last_message_at' => $this->last_message_at,
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
