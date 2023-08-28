<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Formation;

class User extends Authenticatable
{
    use HasApiTokens;
    
    protected $fillable = ['name', 'email', 'password', 'tel', 'profile_picture', 'profile_id', 'is_connected']; // Add 'is_connected'

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_connected' => 'boolean', // Add casting for 'is_connected'
    ];
    
    public function profile()
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }
    public function managedProjects()
    {
        return $this->hasMany(Project::class, 'project_manager_id');
    }

    public function clientProjects()
    {
        return $this->hasMany(Project::class, 'client_id');
    }

    public function formations()
{
    return $this->belongsToMany(Formation::class, 'formation_user')
        ->withPivot('duree') 
        ->withTimestamps(); 
}

    public function googleAccounts()
    {
        return $this->hasMany(GoogleAccount::class);
    }
    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'from', 'id');
    }

    // Relationship: User has many messages received (messages where the user is the 'to' receiver)
    

    
    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_user');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'user_id');
    }

    public function assignedTickets()
    {
        return $this->hasMany(Ticket::class, 'assign_to');
    }

    //test

    public function chats()
{
    return $this->hasMany(Chat::class);
}
public function otherChats()
{
    return $this->hasMany(Chat::class, 'other_user_id');
}

public function receivedMessages()
{
    return $this->hasMany(Message::class, 'to', 'id');
}

}
