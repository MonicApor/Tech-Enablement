<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class InviteUserMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @var User
     */
    protected $user;

    /**
     * @var string
     */
    protected $url;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, $token)
    {
        $this->user = $user;
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
        $this->url = $frontendUrl . '/auth/activate?token=' . $token;
        
    }

    public function build()
    {
        return $this->view('mail.users.signup')
            ->subject('Invite User Mail')
            ->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'))
            ->with([
                'user' => $this->user,
                'url' => $this->url,
            ])
            ->withSwiftMessage(function ($message) {
                // Prevent MailHog from modifying URLs
                $message->getHeaders()->addTextHeader('X-MailHog-Disable-Click-Tracking', 'true');
            });
    }
}
