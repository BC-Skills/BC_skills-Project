<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
    
    protected $fillable = ['name', 'email', 'password', 'tel', 'profile_picture', 'profile_id'];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = ['email_verified_at' => 'datetime', 'password' => 'hashed'];

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function managedProjects()
    {
        return $this->hasMany(Project::class, 'project_manager_id');
    }

    public function clientProjects()
    {
        return $this->hasMany(Project::class, 'client_id');
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
    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'to', 'id');
    }
    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_user');
    }
}
