<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordUpdatedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }
    public function toMail($notifiable)
    {
        $logoPath = 'https://www.bcskills.com/images/logo.png';
        return (new MailMessage)
            ->from('bcskillscontact@gmail.com', 'BC Skills Group')
            ->subject('Password Updated')
            ->line('Your password has been updated successfully.')
            ->line('Email: ' . $notifiable->email)
            ->action('Visit our website', url('http://localhost:3000/'))
            ->line('For security, please keep your password confidential.')
            ->view('emails.password-updated', ['logoUrl' => $logoPath, 'notifiable' => $notifiable]);
    }
    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

  
    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
