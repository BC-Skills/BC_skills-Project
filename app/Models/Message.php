<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    // Define the attributes that are fillable
    protected $fillable = ['datemessage', 'notify', 'vu'];

    // Relationship: Message is sent by a user
    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from', 'id');
    }

    // Relationship: Message is associated with a chat
    public function chat()
    {
        return $this->belongsTo(Chat::class);
    }

    // Relationship: Message is received by a user
    public function toUser()
    {
        return $this->belongsTo(User::class, 'to', 'id');
    }
}
