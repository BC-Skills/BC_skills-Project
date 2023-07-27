<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    public $name; // Define the 'name' attribute as a public property

    // Relationship: Message belongs to the sender (the user who sent the message)
    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from', 'id');
    }

    // Relationship: Message belongs to the receiver (the user who received the message)
    public function toUser()
    {
        return $this->belongsTo(User::class, 'to', 'id');
    }

    public function chat()
    {
        return $this->belongsTo(Chat::class);
    }
}


