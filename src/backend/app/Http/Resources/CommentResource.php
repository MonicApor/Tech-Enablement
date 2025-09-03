<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
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
            'body' => $this->body,
            'upvotes_count' => $this->upvotes_count,
            'replies_count' => $this->replies_count,
            'is_reply' => $this->isReply(),
            'is_flagged' => $this->isFlagged(),
            'parent_id' => $this->parent_id,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'employee' => $this->whenLoaded('user.employee', function () {
                return $this->user && $this->user->employee ? (new \App\Http\Resources\EmployeeResource($this->user->employee->load('user')))->toArray(request()) : null;
            }),
            'replies' => CommentResource::collection($this->whenLoaded('replies')),
            'created_at_human' => $this->created_at->diffForHumans(),
        ];
    }
}
