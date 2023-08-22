<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormationType extends Model
{
    protected $fillable = ['name', 'description','imagePath','imageUrl'];

    public function formations()
{
    return $this->hasMany(Formation::class);
}
}
