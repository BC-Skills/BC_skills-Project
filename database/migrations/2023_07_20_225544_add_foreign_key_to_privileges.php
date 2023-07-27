<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeyToPrivileges extends Migration
{
    public function up()
    {
        Schema::table('privileges', function (Blueprint $table) {
            // Add the foreign key constraint
            $table->foreign('status_id')->references('id')->on('statuses');
        });
    }

    public function down()
    {
        Schema::table('privileges', function (Blueprint $table) {
            // Drop the foreign key constraint if needed
            $table->dropForeign(['status_id']);
        });
    }
}
