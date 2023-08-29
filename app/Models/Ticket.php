<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = ['nom', 'status', 'sprint_id', 'project_id', 'user_id', 'assign_to'];

    public function sprint()
    {
        return $this->belongsTo(Sprint::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function assignedToUser()
    {
        return $this->belongsTo(User::class, 'assign_to');
    }
    public function Schedules()
    {
        return $this->hasMany(Schedule::class);
    }
    
}
