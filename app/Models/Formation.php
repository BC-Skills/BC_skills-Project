<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\FormationType;


class Formation extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'formation_type_id', 'file_path','duree'];

    public function Users()
    {
        return $this->belongsToMany(User::class, 'formation_user')
            ->withPivot('duree');
    }

    public function formationType()
    {
        return $this->belongsTo(FormationType::class, 'formation_type_id');
    }
}
