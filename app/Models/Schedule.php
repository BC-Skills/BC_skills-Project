<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// app/Models/Schedule.php

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', // Foreign key to link to the User model
        'hour',
        'ticket_id', // Foreign key to link to the Ticket model
        'description',
    ];

    // Define the relationships with User and Ticket models
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }
}

