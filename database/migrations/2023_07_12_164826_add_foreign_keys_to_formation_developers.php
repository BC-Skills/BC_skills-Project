<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToFormationDevelopers extends Migration
{
    public function up()
    {
        Schema::table('formation_developers', function (Blueprint $table) {
            $table->foreign('formation_id')->references('id')->on('formations')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('formation_developers', function (Blueprint $table) {
            $table->dropForeign('formation_developers_formation_id_foreign');
            $table->dropForeign('formation_developers_user_id_foreign');
        });
    }
}
