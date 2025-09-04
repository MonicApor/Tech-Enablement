<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatMessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'chat_id' => $this->chat_id,
            'sender_id' => $this->sender_id,
            'sender_name' => $this->getSenderDisplayName(),
            'sender_avatar' => $this->getSenderAvatar(),
            'content' => $this->content,
            'message_type' => $this->message_type,
            'read_at' => $this->read_at?->toISOString(),
            'is_read' => $this->isRead(),
            'is_deleted' => $this->is_deleted,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'is_from_hr' => $this->isFromHR(),
            'is_from_employee' => $this->isFromEmployee(),
            'sender' => $this->sender ? [
                'id' => $this->sender->id,
                'name' => $this->sender->user->name ?? null,
                'email' => $this->sender->user->email ?? null,
                'username' => $this->sender->user->username ?? null,
            ] : null,
        ];
    }
}
