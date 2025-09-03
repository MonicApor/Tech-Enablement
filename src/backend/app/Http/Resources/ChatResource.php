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
            'hr_user' => $this->whenLoaded('hrUser.employee', function () {
                return $this->hrUser && $this->hrUser->employee ? (new EmployeeResource($this->hrUser->employee->load('user')))->toArray(request()) : null;
            }),
            'employee_user' => $this->whenLoaded('employeeUser.employee', function () {
                return $this->employeeUser && $this->employeeUser->employee ? (new EmployeeResource($this->employeeUser->employee->load('user')))->toArray(request()) : null;
            }),
            'latest_message' => $this->whenLoaded('lastMessage', fn($lastMessage) => [
                'id' => $lastMessage->id,
                'content' => $lastMessage->content,
                'sender_id' => $lastMessage->sender_id,
                'sender_name' => $lastMessage->getSenderDisplayName(),
                'sender_avatar' => $lastMessage->getSenderAvatar(),
                'created_at' => $lastMessage->created_at->toISOString(),
            ]),
            'unread_count' => $this->getUnreadMessagesCount($user->id),
            'total_messages' => $this->messages()->count(),
            'status' => $this->status,
            'last_message_at' => $this->last_message_at,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'other_participant' => $this->getOtherParticipant($user->id) ? [
                'id' => $this->getOtherParticipant($user->id)->id,
                'name' => $this->getOtherParticipant($user->id)->name,
                'avatar' => $this->getOtherParticipant($user->id)->avatar,
            ] : null,
        ];
    }
}
