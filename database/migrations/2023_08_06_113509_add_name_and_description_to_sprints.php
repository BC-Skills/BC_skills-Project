<?php

// database/migrations/YYYY_MM_DD_HHmmss_add_name_and_description_to_sprints.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNameAndDescriptionToSprints extends Migration
{
    public function up()
    {
        Schema::table('sprints', function (Blueprint $table) {
            $table->string('name');
            $table->text('description')->nullable();
        });
    }

    public function down()
    {
        Schema::table('sprints', function (Blueprint $table) {
            $table->dropColumn(['name', 'description']);
        });
    }
}
