<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'nom', 'project_type_id', 'description','status', 'start_date','end_date','project_manager_id','client_id',"duree"
    ];

    public function projectManager()
    {
        return $this->belongsTo(User::class, 'project_manager_id');
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }
    
}