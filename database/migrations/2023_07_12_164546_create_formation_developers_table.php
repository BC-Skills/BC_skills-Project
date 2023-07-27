<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFormationDevelopersTable extends Migration
{
    public function up()
    {
        Schema::create('formation_developers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('formation_id');
            $table->unsignedBigInteger('user_id');
            $table->integer('duree');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('formation_developers');
    }
}
