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
        Schema::table('formation_user', function (Blueprint $table) {
            $table->unsignedBigInteger('formation_type_id'); 
        });
    }
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('formation_user', function (Blueprint $table) {
            $table->dropColumn(['formation_type_id']);
        });
    }
};
