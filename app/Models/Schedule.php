<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'start_hour',
        'end_hour',
        'ticket_id', // Foreign key to link to the Ticket model
        'project_id', // Foreign key to link to the Project model
        'user_id', // Foreign key to link to the User model
        'file',
        'file_name', // Add 'file_name' to the $fillable array
        'description',
        'file_path',
        
    ];

    // Define the relationships with User, Ticket, and Project models
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}

