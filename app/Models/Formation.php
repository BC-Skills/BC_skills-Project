<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\FormationType;


class Formation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'description', 'formation_type_id'
    ];

    public function developers()
    {
        return $this->belongsToMany(Developer::class, 'formation_developers')
            ->withPivot('duree');
    }

    public function formationType()
    {
        return $this->belongsTo(FormationType::class, 'formation_type_id');
    }
}
