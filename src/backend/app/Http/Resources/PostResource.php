<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\EmployeeResource;
use App\Http\Resources\CommentResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PostAttachmentResource;

class PostResource extends JsonResource
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
            'title' => $this->title,
            'body' => $this->body,
            'status' => $this->status,
            'upvotes_count' => $this->upvotes_count,
            'views_count' => $this->views_count,
            'comments_count' => $this->comments_count,
            'is_flagged' => $this->isFlagged(),
            'is_resolved' => $this->isResolved(),
            'is_upvoted' => $this->isUpvotedByUser(),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'employee' => $this->user && $this->user->employee ? (new EmployeeResource($this->user->employee->load('user')))->toArray(request()) : null, 
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'attachments' => PostAttachmentResource::collection($this->whenLoaded('attachments')),
            'created_at_human' => $this->created_at->diffForHumans(),
        ];
    }
}
