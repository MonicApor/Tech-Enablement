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
        Schema::create('chats', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('post_id');
            $table->unsignedBigInteger('hr_employee_id');
            $table->unsignedBigInteger('employee_employee_id');
            $table->enum('status', ['active', 'closed','archived'])->default('active');
            $table->unsignedBigInteger('last_message_id')->nullable();
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();
            

            $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
            $table->foreign('hr_employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->foreign('employee_employee_id')->references('id')->on('employees')->onDelete('cascade');

            $table->unique(['post_id', 'employee_employee_id']);

            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chats');
    }
};
