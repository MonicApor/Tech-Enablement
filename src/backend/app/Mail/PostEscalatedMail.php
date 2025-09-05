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

class PostEscalatedMail extends Mailable
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
        return $this->subject('ESCALATED: Post requires Management Review ' . $this->daysSinceCreated . ' Days Overdue')
                    ->markdown('mail.users.post-escalated')
                    ->with([
                        'flagPost' => $this->flagPost,
                        'manager' => $this->hrEmployee,
                        'daysSinceCreated' => $this->daysSinceCreated,
                    ]);
    }
}
