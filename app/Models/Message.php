<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    public $name; 

    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from', 'id');
    }

    // Relationship: Message belongs to the receiver (the user who received the message)
 
    public function chat()
    {
        return $this->belongsTo(Chat::class);
    }

    
}


