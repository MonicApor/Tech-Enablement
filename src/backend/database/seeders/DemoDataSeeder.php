<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\Comment;
use App\Models\PostAttachment;
use App\Models\Chat;
use App\Models\ChatMessage;
use App\Models\Category;
use App\Models\Employee;
use Carbon\Carbon;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();
        $employees = Employee::all();
        $hrEmployees = Employee::whereHas('user.role', function($query) {
            $query->where('name', 'HR');
        })->get();
        
        // Create demo posts
        $posts = $this->createDemoPosts($categories, $employees);
        
        // Create comments and replies
        $this->createDemoComments($posts, $employees);
        
        // Create attachments
        $this->createDemoAttachments($posts, $employees);
        
        // Create upvotes for posts
        $this->createDemoUpvotes($posts, $employees);
        
        // Create chats for flagged posts
        $this->createDemoChats($posts, $hrEmployees);
    }
    
    private function createDemoPosts($categories, $employees)
    {
        $postData = [
            [
                'title' => 'Workplace Wellness Program Feedback',
                'body' => 'I think we should implement a workplace wellness program. The current stress levels are affecting productivity and team morale. Would love to see yoga sessions, mental health days, and flexible work arrangements.',
                'category' => 'Wellness',
                'upvote_count' => 15,
                'viewer_count' => 45,
                'status' => 'active',
                'days_ago' => 2
            ],
            [
                'title' => 'IT Infrastructure Improvements Needed',
                'body' => 'Our IT infrastructure needs serious upgrades. The internet is slow, computers are outdated, and we\'re losing valuable time waiting for systems to load. This affects our ability to serve clients effectively.',
                'category' => 'IT',
                'upvote_count' => 12,
                'viewer_count' => 38,
                'status' => 'active',
                'days_ago' => 3
            ],
            [
                'title' => 'Team Building Events Suggestions',
                'body' => 'I have some great ideas for team building events that could improve collaboration and team spirit. Monthly team lunches, escape room challenges, and volunteer activities would be amazing!',
                'category' => 'Events',
                'upvote_count' => 18,
                'viewer_count' => 52,
                'status' => 'active',
                'days_ago' => 1
            ],
            [
                'title' => 'Office Temperature Policy',
                'body' => 'Can we discuss the office temperature policy? Some areas are too cold while others are too warm. A consistent temperature would improve everyone\'s comfort and productivity.',
                'category' => 'Policy',
                'upvote_count' => 5,
                'viewer_count' => 22,
                'status' => 'active',
                'days_ago' => 5
            ],
            [
                'title' => 'Meeting Room Booking System',
                'body' => 'The current meeting room booking system is confusing and often leads to double bookings. A digital solution with calendar integration would solve this issue.',
                'category' => 'Workplace',
                'upvote_count' => 3,
                'viewer_count' => 18,
                'status' => 'active',
                'days_ago' => 7
            ],
            [
                'title' => 'Inappropriate Behavior in Break Room',
                'body' => 'There have been some concerning incidents in the break room that need immediate attention from HR. This is affecting the work environment.',
                'category' => 'Workplace',
                'upvote_count' => 2,
                'viewer_count' => 15,
                'status' => 'flagged',
                'days_ago' => 4
            ],
            [
                'title' => 'Parking Space Allocation',
                'body' => 'The parking situation has been resolved with the new parking management system. Thank you HR for addressing this concern promptly.',
                'category' => 'Workplace',
                'upvote_count' => 8,
                'viewer_count' => 28,
                'status' => 'resolved',
                'days_ago' => 10
            ]
        ];
        
        $posts = [];
        foreach ($postData as $data) {
            $category = $categories->where('name', $data['category'])->first();
            $employee = $employees->random();
            
            $post = Post::create([
                'category_id' => $category->id,
                'employee_id' => $employee->id,
                'title' => $data['title'],
                'body' => $data['body'],
                'status' => $data['status'],
                'upvote_count' => $data['upvote_count'],
                'viewer_count' => $data['viewer_count'],
                'flaged_at' => $data['status'] === 'flagged' ? now()->subHours(6) : null,
                'resolved_at' => $data['status'] === 'resolved' ? now()->subHours(12) : null,
                'created_at' => now()->subDays($data['days_ago'])
            ]);
            
            $posts[] = $post;
        }
        
        return $posts;
    }
    
    private function createDemoComments($posts, $employees)
    {
        foreach ($posts as $post) {
            if ($post->status === 'resolved') continue;
            
            // Create 2-4 top-level comments
            $commentCount = rand(2, 4);
            for ($i = 0; $i < $commentCount; $i++) {
                $comment = Comment::create([
                    'post_id' => $post->id,
                    'employee_id' => $employees->random()->id,
                    'body' => $this->getCommentBody($i),
                    'upvote_count' => rand(0, 8),
                    'status' => 'active',
                    'created_at' => $post->created_at->addHours(rand(1, 24))
                ]);
                
                // 50% chance of having replies
                if (rand(1, 2) === 1) {
                    $replyCount = rand(1, 3);
                    for ($j = 0; $j < $replyCount; $j++) {
                        Comment::create([
                            'post_id' => $post->id,
                            'employee_id' => $employees->random()->id,
                            'body' => $this->getReplyBody($j),
                            'parent_id' => $comment->id,
                            'upvote_count' => rand(0, 5),
                            'status' => 'active',
                            'created_at' => $comment->created_at->addHours(rand(1, 12))
                        ]);
                    }
                }
            }
        }
    }
    
    private function createDemoAttachments($posts, $employees)
    {
        $fileNames = [
            'workplace_wellness_proposal.pdf',
            'it_infrastructure_report.docx',
            'team_building_ideas.pptx',
            'office_layout_diagram.jpg',
            'meeting_room_schedule.xlsx',
            'policy_document.pdf',
            'feedback_summary.pdf'
        ];
        
        foreach ($posts as $post) {
            // 70% chance of having attachments (increased probability)
            if (rand(1, 10) <= 7) {
                $attachmentCount = rand(1, 2);
                
                for ($i = 0; $i < $attachmentCount; $i++) {
                    $fileName = $fileNames[array_rand($fileNames)];
                    $extension = pathinfo($fileName, PATHINFO_EXTENSION);
                    
                    try {
                        PostAttachment::create([
                            'post_id' => $post->id,
                            'employee_id' => $post->employee_id,
                            'original_name' => $fileName,
                            'file_name' => 'att_' . $post->id . '_' . $i . '.' . $extension,
                            'file_path' => 'attachments/' . $post->id . '/' . 'att_' . $post->id . '_' . $i . '.' . $extension,
                            'file_size' => rand(1024, 10240),
                            'mime_type' => $this->getMimeType($extension),
                            'disk' => 'minio',
                            'url' => 'https://minio.example.com/attachments/' . $post->id . '/' . 'att_' . $post->id . '_' . $i . '.' . $extension
                        ]);
                    } catch (\Exception $e) {
                        // Log error if attachment creation fails
                        \Log::error("Failed to create attachment for post {$post->id}: " . $e->getMessage());
                    }
                }
            }
        }
    }

    private function createDemoUpvotes($posts, $employees)
    {
        foreach ($posts as $post) {
            // Get the upvote count from the post
            $upvoteCount = $post->upvote_count;
            
            // Create actual upvote records for that many employees
            $upvotingEmployees = $employees->random(min($upvoteCount, $employees->count()));
            
            foreach ($upvotingEmployees as $employee) {
                try {
                    \App\Models\PostUpvote::create([
                        'post_id' => $post->id,
                        'employee_id' => $employee->id,
                        'created_at' => $post->created_at->addHours(rand(1, 24))
                    ]);
                } catch (\Exception $e) {
                    // Log error if upvote creation fails
                    \Log::error("Failed to create upvote for post {$post->id} by employee {$employee->id}: " . $e->getMessage());
                }
            }
        }
    }
    
    private function createDemoChats($posts, $hrEmployees)
    {
        if ($hrEmployees->isEmpty()) return;
        
        foreach ($posts as $post) {
            // Create chat for flagged posts or posts with high engagement
            if ($post->status === 'flagged' || $post->upvote_count > 10) {
                $hrEmployee = $hrEmployees->random();
                $postEmployee = Employee::find($post->employee_id);
                
                $chat = Chat::create([
                    'post_id' => $post->id,
                    'hr_employee_id' => $hrEmployee->id,
                    'employee_employee_id' => $postEmployee->id,
                    'status' => 'active',
                    'created_at' => $post->created_at->addHours(rand(2, 6))
                ]);
                
                // Create chat messages
                $this->createChatMessages($chat, $hrEmployee, $postEmployee, $post);
            }
        }
    }
    
    private function createChatMessages($chat, $hrEmployee, $postEmployee, $post)
    {
        $messages = [
            [
                'sender_id' => $hrEmployee->id,
                'content' => "Hi, I noticed your post about '{$post->title}'. I'd like to discuss this with you to understand the situation better.",
                'created_at' => $chat->created_at->addMinutes(5)
            ],
            [
                'sender_id' => $postEmployee->id,
                'content' => "Thank you for reaching out. I appreciate that you're taking this seriously. When would be a good time to discuss this?",
                'created_at' => $chat->created_at->addMinutes(10)
            ],
            [
                'sender_id' => $hrEmployee->id,
                'content' => "I'm available today at 2 PM or tomorrow morning at 10 AM. Which works better for you?",
                'created_at' => $chat->created_at->addMinutes(15)
            ]
        ];
        
        foreach ($messages as $messageData) {
            ChatMessage::create([
                'chat_id' => $chat->id,
                'sender_id' => $messageData['sender_id'],
                'content' => $messageData['content'],
                'message_type' => 'text',
                'created_at' => $messageData['created_at']
            ]);
        }
        
        // Update chat with last message info
        $lastMessage = ChatMessage::where('chat_id', $chat->id)->latest()->first();
        $chat->update([
            'last_message_id' => $lastMessage->id,
            'last_message_at' => $lastMessage->created_at
        ]);
    }
    
    private function getCommentBody($index)
    {
        $templates = [
            "Great suggestion! I completely agree with this.",
            "This is a valid concern that needs attention.",
            "I've experienced similar issues. Something should be done about this.",
            "Interesting perspective. Have you considered alternative solutions?",
            "This affects our team directly. We need to address it soon.",
            "I support this idea. It would improve our work environment.",
            "Good point raised here. Management should look into this.",
            "I think this is worth discussing further in our next meeting."
        ];
        
        return $templates[$index % count($templates)];
    }
    
    private function getReplyBody($index)
    {
        $templates = [
            "Exactly! That's what I was thinking too.",
            "I agree with your point. Well said.",
            "Good addition to the discussion.",
            "You're absolutely right about that.",
            "I hadn't considered that angle. Good insight.",
            "That makes a lot of sense.",
            "I'm on the same page as you.",
            "Well articulated response."
        ];
        
        return $templates[$index % count($templates)];
    }
    
    private function getMimeType($extension)
    {
        return match($extension) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'pdf' => 'application/pdf',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            default => 'application/octet-stream'
        };
    }
}
