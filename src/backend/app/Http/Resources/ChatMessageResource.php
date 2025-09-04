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
        $currentUser = auth()->user();
        $isFromHR = $this->isFromHR();
        $isFromEmployee = $this->isFromEmployee();
        
        // Determine display name based on current user's role and message sender
        $displayName = 'Unknown';
        $displayAvatar = 'U';
        
        if ($isFromHR) {
            // If message is from HR
            if ($currentUser->role_id === 2) {
                // Current user is HR - show their own name
                $displayName = $this->sender->user->name ?? 'HR Manager';
                $displayAvatar = $this->sender->user->avatar ?? 'HR';
            } else {
                // Current user is employee - show HR name
                $displayName = $this->sender->user->name ?? 'HR Manager';
                $displayAvatar = $this->sender->user->avatar ?? 'HR';
            }
        } else if ($isFromEmployee) {
            // If message is from employee
            if ($currentUser->role_id === 2) {
                // Current user is HR - show employee username for anonymity
                $displayName = $this->sender->user->username ?? 'Anonymous Employee';
                $displayAvatar = $this->sender->user->avatar ?? 'AE';
            } else {
                // Current user is employee - show their own name
                $displayName = $this->sender->user->name ?? 'Anonymous Employee';
                $displayAvatar = $this->sender->user->avatar ?? 'AE';
            }
        }
        
        return [
            'id' => $this->id,
            'chat_id' => $this->chat_id,
            'sender_id' => $this->sender_id,
            'sender_name' => $displayName,
            'sender_avatar' => $displayAvatar,
            'content' => $this->content,
            'message_type' => $this->message_type,
            'read_at' => $this->read_at?->toISOString(),
            'is_read' => $this->isRead(),
            'is_deleted' => $this->is_deleted,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'is_from_hr' => $isFromHR,
            'is_from_employee' => $isFromEmployee,
            'is_from_current_user' => $this->sender_id === $currentUser->employee->id,
            'sender' => $this->sender ? [
                'id' => $this->sender->id,
                'name' => $this->sender->user->name ?? null,
                'username' => $this->sender->user->username ?? null,
                'avatar' => $this->sender->user->avatar ?? null,
                'role_id' => $this->sender->user->role_id ?? null,
                'email' => $this->sender->user->email ?? null,
            ] : null,
        ];
    }
}
