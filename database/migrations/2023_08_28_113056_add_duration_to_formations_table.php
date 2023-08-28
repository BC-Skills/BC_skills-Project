<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->integer('duree')->nullable();
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->dropColumn('duree');
        });
    }
    
};
