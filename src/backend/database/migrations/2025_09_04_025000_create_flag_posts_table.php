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
        Schema::create('flag_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('hr_employee_id')->nullable()->constrained('employees')->onDelete('cascade');
            $table->text('reason');
            $table->foreignId('status_id')->constrained('flag_post_statuses')->onDelete('cascade');
            $table->timestamp('escalated_at')->nullable();
            $table->timestamps();
            
            // Prevent duplicate flags from same employee for same post
            $table->unique(['post_id', 'employee_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flag_posts');
    }
};
