<?php
use Illuminate\Database\Eloquent\Model;

class FormationDeveloper extends Model
{
    protected $table = 'formation_developers';

    protected $fillable = [
        'formation_id', 'user_id', 'duree'
    ];
}
