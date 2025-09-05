<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\FlagPost;
use App\Models\Employee;

class FlagPostMail extends Mailable
{
    use Queueable, SerializesModels;

    public $flagPost;
    public $hrEmployee;
    public $daysSinceCreated;

    /**
     * Create a new message instance.
     */
    public function __construct(FlagPost $flagPost, Employee $hrEmployee)
    {
        $this->flagPost = $flagPost;
        $this->hrEmployee = $hrEmployee;
        $this->daysSinceCreated = $flagPost->created_at->diffInDays(now());
    }

    public function build()
    {
        return $this->subject('URGENT: Flagged Post Requires HR Attention - Day ' . $this->daysSinceCreated)
                    ->markdown('mail.users.flag-post-reminder')
                    ->with([
                        'flagPost' => $this->flagPost,
                        'hrEmployee' => $this->hrEmployee,
                        'daysSinceCreated' => $this->daysSinceCreated,
                    ]);
    }
}
