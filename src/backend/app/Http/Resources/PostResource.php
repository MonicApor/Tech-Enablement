<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\EmployeeResource;
use App\Http\Resources\CommentResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PostAttachmentResource;
use App\Models\FlagPost;

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
            'upvotes_count' => $this->upvotes_count,
            'views_count' => $this->viewer_count ?? 0,
            'comments_count' => $this->comments_count,
            'is_flagged' => $this->isFlagged(),
            'flag_status_id' => $this->when($this->isFlagged(), function () {
                $flagPost = FlagPost::where('post_id', $this->id)->latest()->first();
                return $flagPost?->status_id;
            }),
            'is_upvoted' => $this->isUpvotedByUser(),
            'is_viewed' => $this->isViewedByUser(),
            'is_resolved' => $this->isResolved(),
            'employee' => $this->when($this->employee, [
                'id' => $this->employee->id,
                'status' => $this->employee->status,
                'user' => [
                    'id' => $this->employee->user->id,
                    'username' => $this->employee->user->username,
                    'avatar' => $this->employee->user->avatar,
                    'role' => $this->employee->user->role,
                ],
            ]),
            'comments' => $this->when($this->relationLoaded('topLevelComments'), function () {
                return $this->topLevelComments->map(function ($comment) {
                    return [
                        'id' => $comment->id,
                        'body' => $comment->body,
                        'created_at_human' => $comment->created_at->diffForHumans(),
                        'upvotes_count' => $comment->upvotes_count,
                        'is_reply' => !is_null($comment->parent_id),
                        'is_flagged' => !is_null($comment->flaged_at),
                        'parent_id' => $comment->parent_id,
                        'employee' => [
                            'id' => $comment->employee->id,
                            'user' => [
                                'id' => $comment->employee->user->id,
                                'username' => $comment->employee->user->username,
                                'avatar' => $comment->employee->user->avatar,
                            ],
                        ],
                    ];
                });
            }),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'attachments' => PostAttachmentResource::collection($this->whenLoaded('attachments')),
            'created_at_human' => $this->created_at->diffForHumans(),
        ];
    }
}
