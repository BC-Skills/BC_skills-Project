<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Storage;

class UserCreatedNotification extends Notification
{
    use Queueable;

    public $password;

    /**
     * Create a new notification instance.
     */
    public function __construct($password)
    {
        $this->password = $password;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array<string>
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $logoPath = 'https://www.bcskills.com/images/logo.png';


        return (new MailMessage)
            ->from('bcskillscontact@gmail.com', 'BC Skills Group')
            ->subject('Account Created')
            ->line('Your account has been created successfully.')
            ->line('Email: ' . $notifiable->email)
            ->line('Password: ' . $this->password)
            ->line('Welcome to our company!')
            ->action('Visit our website', url('http://localhost:3000/'))
            ->line('Make sure to update your password after logging in.')
            ->view('emails.user-created', ['logoUrl' => $logoPath,'notifiable'=>$notifiable,'password'=>$this->password]); // Pass the logo URL to the email template
    }

    // Rest of the methods...
}

    // Rest of the methods...

