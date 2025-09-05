<?php

namespace App\Services;

use Exception;
use App\Models\FlagPost;
use App\Models\Employee;
use Illuminate\Support\Facades\Mail;
use App\Mail\FlagPostMail;
use App\Mail\PostEscalatedMail;
use Illuminate\Support\Facades\Log;
use App\Models\EscalatedPost;

class PostEscalataionService
{
    /**
     * Create a new PostEscalataionService instance.
     */
    public function __construct()
    {
        //
    }

    public function processEscalations() : void
    {
        $this->sendEmailReminders();
        $this->escalateOverduePosts();

    }

    private function sendEmailReminders() : void
    {
        $flagPostsNeedReminder = FlagPost::where('status_id', 1)->where('hr_employee_id', null)->where('escalated_at', null)->get()
        ->filter(function($flagPost) {
            return $flagPost->needsEmailReminder();
        });
        foreach ($flagPostsNeedReminder as $flagPost) {
            $this->sendReminderEmail($flagPost);
        }
    }

    //send reminder email to hr employee
    private function sendReminderEmail(FlagPost $flagPost) : void
    {
        $hrEmployees = Employee::whereHas('user', function($query) {
            $query->where('role_id', 2);
        })->where('status', 'active')->get();
        
        foreach ($hrEmployees as $hrEmployee) {
            try {
                Mail::to($hrEmployee->user->email)->send(new FlagPostMail($flagPost, $hrEmployee));
            } catch (Exception $e) {
                Log::error('Failed to send reminder email to HR employee: ' . $e->getMessage());
            }
        }
    }

    public function escalatePost(FlagPost $flagPost, bool $escalatedBySystem = true) : void
    {
        try {
            $flagPost->update(['escalated_at' => now()]);

            $escalationReason = $escalatedBySystem 
                ? 'Post has been escalated by the system after 6 days'
                : 'Post escalated by HR employee for management review';

            $escalatedPost = EscalatedPost::create([
                'flag_post_id' => $flagPost->id,
                'status_id' => 1,
                'escalated_by_system' => $escalatedBySystem,
                'escalation_reason' => $escalationReason,
                'management_notes' => null,
                'resolved_at' => null,
            ]);

            $this->notifyManagement($escalatedPost);
        } catch (Exception $e) {
            Log::error('Failed to escalate post: ' . $e->getMessage());
        }
    }

    private function notifyManagement(EscalatedPost $escalatedPost) : void
    {
        $management = Employee::whereHas('user', function($query) {
            $query->where('role_id', 1);
        })->where('status', 'active')->get();
        
        foreach ($management as $manager) {
            try {
                Mail::to($manager->user->email)->send(new PostEscalatedMail($escalatedPost->flagPost, $manager));
            } catch (Exception $e) {
                Log::error('Failed to notify management: ' . $e->getMessage());
            }
        }
    }

    private function escalateOverduePosts() : void
    {
        $flagPostsNeedEscalated = FlagPost::where('status_id', 1)->where('escalated_at', null)->where('hr_employee_id', null)->get()
        ->filter(function($flagPost) {
            return $flagPost->needsEscalation();
        });
        foreach ($flagPostsNeedEscalated as $flagPost) {
            $this->escalatePost($flagPost);
        }
    }
}
