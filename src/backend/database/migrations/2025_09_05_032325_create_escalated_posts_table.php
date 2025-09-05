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
        Schema::create('escalated_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('flag_post_id')->constrained('flag_posts')->onDelete('cascade');
            $table->boolean('escalated_by_system')->default(false);
            $table->text('escalation_reason');
            $table->foreignId('status_id')->constrained('flag_post_statuses')->onDelete('cascade');
            $table->text('management_notes')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->softDeletes();

            $table->unique(['flag_post_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('escalated_posts');
    }
};
