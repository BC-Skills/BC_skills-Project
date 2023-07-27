<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProfilePrivilegeTable extends Migration
{
    public function up()
    {
        Schema::create('profile_privilege', function (Blueprint $table) {
            $table->unsignedBigInteger('profile_id');
            $table->unsignedBigInteger('privilege_id');

            $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
            $table->foreign('privilege_id')->references('id')->on('privileges')->onDelete('cascade');

            $table->primary(['profile_id', 'privilege_id']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('profile_privilege');
    }
}
