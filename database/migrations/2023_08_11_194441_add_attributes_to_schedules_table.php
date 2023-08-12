<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAttributesToSchedulesTable extends Migration
{
    public function up()
    {
        Schema::table('schedules', function (Blueprint $table) {
            // Add the new columns
            $table->date('date')->after('id')->nullable();
            $table->time('start_hour')->after('date')->nullable();
            $table->time('end_hour')->after('start_hour')->nullable();
            $table->binary('file')->nullable();
            $table->string('file_name')->nullable();
            $table->string('file_path')->nullable();
            
            $table->unsignedBigInteger('project_id')->after('ticket_id')->nullable();
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            // Add the foreign key constraint if necessary
        });
    }

    public function down()
    {
       
    }
}