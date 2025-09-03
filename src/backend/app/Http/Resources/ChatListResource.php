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
            'other_participant' => $this->whenLoaded('otherParticipant.employee', function () {
                $otherParticipant = $this->getOtherParticipant(auth()->user()->id);
                return $otherParticipant && $otherParticipant->employee ? (new \App\Http\Resources\EmployeeResource($otherParticipant->employee->load('user')))->toArray(request()) : null;
            }),
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
