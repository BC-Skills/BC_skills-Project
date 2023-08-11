<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sprint extends Model
{
    protected $fillable = [
        'name', 'description', 'status', 'date_debut', 'date_fin', 'project_id'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}