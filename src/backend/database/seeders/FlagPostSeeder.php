<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FlagPost;
use App\Models\Post;
use App\Models\Employee;
use App\Models\FlagPostStatus;
use Carbon\Carbon;

class FlagPostSeeder extends Seeder
{
    public function run(): void
    {
        // Get existing data
        $posts = Post::all();
        $employees = Employee::all();
        $hrEmployees = Employee::whereHas('user.role', function($query) {
            $query->where('name', 'HR');
        })->get();
        $statuses = FlagPostStatus::all();
        
        if ($posts->isEmpty() || $employees->isEmpty() || $statuses->isEmpty()) {
            $this->command->warn('Required data not found. Please run other seeders first.');
            return;
        }
        
        // Flag post data with realistic scenarios
        $flagPostData = [
            [
                'post_title' => 'Inappropriate Behavior in Break Room',
                'reason' => 'Contains inappropriate language and behavior that violates company policy',
                'status' => 'Open',
                'days_ago' => 1,
                'hr_assigned' => false
            ],
            [
                'post_title' => 'Workplace Wellness Program Feedback',
                'reason' => 'Post contains personal health information that should not be shared publicly',
                'status' => 'In Review',
                'days_ago' => 2,
                'hr_assigned' => true
            ],
            [
                'post_title' => 'IT Infrastructure Improvements Needed',
                'reason' => 'Post contains sensitive information about company systems and security',
                'status' => 'Escalated',
                'days_ago' => 3,
                'hr_assigned' => true
            ],
            [
                'post_title' => 'Team Building Events Suggestions',
                'reason' => 'Post contains discriminatory language and inappropriate suggestions',
                'status' => 'Resolved',
                'days_ago' => 5,
                'hr_assigned' => true
            ],
            [
                'post_title' => 'Office Temperature Policy',
                'reason' => 'Post contains complaints about management that could create a hostile work environment',
                'status' => 'Open',
                'days_ago' => 1,
                'hr_assigned' => false
            ],
            [
                'post_title' => 'Meeting Room Booking System',
                'reason' => 'Post contains confidential information about company operations',
                'status' => 'In Review',
                'days_ago' => 2,
                'hr_assigned' => true
            ],
            [
                'post_title' => 'Parking Space Allocation',
                'reason' => 'Post contains personal attacks on specific employees',
                'status' => 'Escalated',
                'days_ago' => 4,
                'hr_assigned' => true
            ],
            [
                'post_title' => 'Workplace Wellness Program Feedback',
                'reason' => 'Post contains false information about company policies',
                'status' => 'Resolved',
                'days_ago' => 6,
                'hr_assigned' => true
            ],
            [
                'post_title' => 'IT Infrastructure Improvements Needed',
                'reason' => 'Post contains inappropriate jokes and unprofessional language',
                'status' => 'Open',
                'days_ago' => 1,
                'hr_assigned' => false
            ],
            [
                'post_title' => 'Team Building Events Suggestions',
                'reason' => 'Post contains discriminatory content based on gender and age',
                'status' => 'In Review',
                'days_ago' => 3,
                'hr_assigned' => true
            ],
            [
                'post_title' => 'Office Temperature Policy',
                'reason' => 'Post contains threats and aggressive language towards management',
                'status' => 'Escalated',
                'days_ago' => 2,
                'hr_assigned' => true
            ],
            [
                'post_title' => 'Meeting Room Booking System',
                'reason' => 'Post contains personal information about other employees without consent',
                'status' => 'Resolved',
                'days_ago' => 7,
                'hr_assigned' => true
            ],
            [
                'post_title' => 'Parking Space Allocation',
                'reason' => 'Post contains inappropriate content that violates company harassment policy',
                'status' => 'Open',
                'days_ago' => 1,
                'hr_assigned' => false
            ],
            [
                'post_title' => 'Workplace Wellness Program Feedback',
                'reason' => 'Post contains false accusations against specific team members',
                'status' => 'In Review',
                'days_ago' => 2,
                'hr_assigned' => true
            ],
            [
                'post_title' => 'IT Infrastructure Improvements Needed',
                'reason' => 'Post contains confidential technical information that should not be public',
                'status' => 'Escalated',
                'days_ago' => 3,
                'hr_assigned' => true
            ]
        ];
        
        foreach ($flagPostData as $data) {
            // Find a post that matches the title (or use any post if not found)
            $post = $posts->where('title', $data['post_title'])->first() ?? $posts->random();
            
            // Get a random employee to flag the post (not the post author)
            $flaggingEmployee = $employees->where('id', '!=', $post->employee_id)->random();
            
            // Get the status
            $status = $statuses->where('name', $data['status'])->first();
            
            // Get HR employee if assigned
            $hrEmployee = null;
            if ($data['hr_assigned'] && $hrEmployees->isNotEmpty()) {
                $hrEmployee = $hrEmployees->random();
            }
            
            // Create the flag post
            FlagPost::create([
                'post_id' => $post->id,
                'employee_id' => $flaggingEmployee->id,
                'hr_employee_id' => $hrEmployee?->id,
                'reason' => $data['reason'],
                'status_id' => $status->id,
                'escalated_at' => $data['status'] === 'Escalated' ? now()->subDays($data['days_ago'])->addHours(rand(1, 12)) : null,
                'created_at' => now()->subDays($data['days_ago'])->addHours(rand(1, 23))
            ]);
        }
        
        $this->command->info('Created ' . count($flagPostData) . ' flag posts.');
    }
}
