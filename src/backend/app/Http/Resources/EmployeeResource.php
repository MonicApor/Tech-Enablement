<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
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
            'user_id' => $this->user_id,
            'position' => $this->position,
            'immediate_supervisor' => $this->immediate_supervisor ?? null,
            'hire_date' => $this->hire_date ? $this->hire_date->format('Y-m-d') : null,
            'status' => $this->status,
            'user' => [
                'id' => $this->user->id ?? null,
                'name' => $this->user->name ?? null,
                'username' => $this->user->username ?? null,
                'avatar' => $this->user->avatar ?? null,
                'role' => $this->user->role ?? null,
                'email' => $this->user->email ?? null,
            ],
        ];
    }
}
