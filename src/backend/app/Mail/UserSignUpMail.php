<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class UserSignUpMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The URL to activate the user's account.
     *
     * @var string
     */
    protected $url;

    /**
     * The user to send the email to.
     *
     * @var User
     */
    protected $user;

    /**
     * The subject of the email.
     *
     * @var string
     */
    public $subject;

    /**
     * The password of the user.
     *
     * @var string
     */
    protected $password;

    /**
     * The view of the email.
     *
     * @var string
     */
    public $view;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, $token)
    {
        $this->user = $user;
        $this->url = env('FRONTEND_URL') . '/activate?token=' . $token;
        $this->subject = 'Activate your account';
        $this->view = 'mail.users.signup';
    }

    public function build()
    {
        return $this->subject($this->subject)
                    ->markdown($this->view)
                    ->with([
                        'url' => $this->url,
                        'user' => $this->user,
                    ]);
    }
}
