<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('chats', function (Blueprint $table) {
            // Drop the existing foreign key constraints
            $table->dropForeign(['post_id']);
            $table->dropForeign(['hr_employee_id']);
            $table->dropForeign(['employee_employee_id']);
            
            // Re-add them without cascade delete
            $table->foreign('post_id')->references('id')->on('posts')->onDelete('restrict');
            $table->foreign('hr_employee_id')->references('id')->on('employees')->onDelete('restrict');
            $table->foreign('employee_employee_id')->references('id')->on('employees')->onDelete('restrict');
        });

        Schema::table('chat_messages', function (Blueprint $table) {
            // Drop the existing foreign key constraints
            $table->dropForeign(['chat_id']);
            $table->dropForeign(['sender_id']);
            
            // Re-add them without cascade delete
            $table->foreign('chat_id')->references('id')->on('chats')->onDelete('restrict');
            $table->foreign('sender_id')->references('id')->on('employees')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chats', function (Blueprint $table) {
            // Drop the restrict constraints
            $table->dropForeign(['post_id']);
            $table->dropForeign(['hr_employee_id']);
            $table->dropForeign(['employee_employee_id']);
            
            // Re-add the cascade constraints
            $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
            $table->foreign('hr_employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->foreign('employee_employee_id')->references('id')->on('employees')->onDelete('cascade');
        });

        Schema::table('chat_messages', function (Blueprint $table) {
            // Drop the restrict constraints
            $table->dropForeign(['chat_id']);
            $table->dropForeign(['sender_id']);
            
            // Re-add the cascade constraints
            $table->foreign('chat_id')->references('id')->on('chats')->onDelete('cascade');
            $table->foreign('sender_id')->references('id')->on('employees')->onDelete('cascade');
        });
    }
};
