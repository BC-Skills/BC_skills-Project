<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketAssignedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
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
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
{
    $logoPath = 'https://www.bcskills.com/images/logo.png';

    return (new MailMessage)
        ->from('bcskillscontact@gmail.com', 'BC Skills Group')
        ->subject('Ticket Assigned')
        ->line('A new ticket has been assigned to you.')
        ->line('Ticket Name: ' . $this->ticketName)
        ->line('Project: ' . $this->projectName)
        ->action('Visit our website', url('http://localhost:3000/'))
        ->line('Thank you for using our service.')
        ->view('emails.ticket-assigned', ['logoUrl' => $logoPath, 'notifiable' => $notifiable]);
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
