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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('chat_id');
            $table->unsignedBigInteger('from');
            $table->text('content'); // You may want to add a 'content' column to store the message content
            $table->timestamps();

            $table->foreign('chat_id')->references('id')->on('chats');
            $table->foreign('from')->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('messages');
    }
};
