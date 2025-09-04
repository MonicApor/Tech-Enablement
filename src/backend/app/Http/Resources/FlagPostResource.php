<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FlagPostResource extends JsonResource
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
            'post' => $this->when($this->post, [
                'id' => $this->post?->id,
                'title' => $this->post?->title,
                'body' => $this->post?->body,
                'flaged_at' => $this->post?->flaged_at?->format('Y-m-d H:i:s'),
            ]),
            'employee' => $this->when($this->employee && $this->employee->user, [
                'id' => $this->employee?->id,
                'username' => $this->employee?->user?->username,
                'avatar' => $this->employee?->user?->avatar,
            ]),
            'hr_employee' => $this->when($this->hr_employee && $this->hr_employee->user, [
                'id' => $this->hr_employee?->id,
                'position' => $this->hr_employee?->position,
                'user' => [
                    'id' => $this->hr_employee?->user?->id,
                    'username' => $this->hr_employee?->user?->username,
                    'avatar' => $this->hr_employee?->user?->avatar,
                    'email' => $this->hr_employee?->user?->email,
                    'name' => $this->hr_employee?->user?->name,
                ],
            ]),
            'reason' => $this->reason,
            'status_id' => $this->status_id,
            'escalated_at' => $this->escalated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
