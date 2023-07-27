<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToSprints extends Migration
{
    public function up()
    {
        Schema::table('sprints', function (Blueprint $table) {
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('sprints', function (Blueprint $table) {
            $table->dropForeign('sprints_project_id_foreign');
        });
    }
}
