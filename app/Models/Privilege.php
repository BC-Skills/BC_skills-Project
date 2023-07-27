<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Privilege extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
    ];
    
    public function profiles()
    {
        return $this->belongsToMany(Profile::class, 'profile_privilege');
    }
    public function status()
    {
        return $this->belongsTo(Status::class);
    }
    
}
