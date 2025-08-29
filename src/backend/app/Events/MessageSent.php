<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\ChatMessage;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct(ChatMessage $message)
    {
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat.' . $this->message->chat_id),
        ];
    }
    
    public function broadcastWith(): array
    {
        return [
            'message' => [
                'id' => $this->message->id,
                'chat_id' => $this->message->chat_id,
                'sender_id' => $this->message->sender_id,
                'sender_name' => $this->message->getSenderDisplayName(),
                'sender_avatar' => $this->message->getSenderAvatar(),
                'content' => $this->message->content,
                'message_type' => $this->message->message_type,
                'created_at' => $this->message->created_at->toISOString(),
                'is_from_hr' => $this->message->isFromHR(),
                'is_from_employee' => $this->message->isFromEmployee(),
            ],
            'chat' => [
                'id' => $this->message->chat->id,
                'post_title' => $this->message->chat->post->title ?? null,
            ],
        ];
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }
}
