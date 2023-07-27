<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToFormations extends Migration
{
    public function up()
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->foreign('formation_type_id')->references('id')->on('formation_types')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->dropForeign('formations_formation_type_id_foreign');
        });
    }
}
