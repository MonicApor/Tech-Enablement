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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            
            // Name fields
            $table->string('first_name')->nullable();
            $table->string('middle_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('name');
            
            // Authentication fields
            $table->string('email')->unique();
            $table->string('username')->unique();
            $table->string('password')->nullable(); // Nullable for Microsoft auth
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            
            // Microsoft authentication fields
            $table->string('microsoft_id')->nullable()->unique();
            $table->string('microsoft_tenant_id')->nullable();
            $table->string('avatar')->nullable();
            $table->string('user_type')->default('Member');
            
            // Employee fields
            $table->string('role')->nullable();
            $table->string('immediate_supervisor')->nullable();
            $table->date('hire_date')->nullable();
            $table->string('position')->nullable();
            
            // Status and security fields
            $table->integer('login_attempts')->default(0);
            $table->unsignedBigInteger('user_status_id')->nullable();

            $table->softDeletes();
            
            $table->timestamps();
            
            // Add indexes for faster lookups
            $table->index('username');
            $table->index('microsoft_id');
            $table->index('microsoft_tenant_id');
            $table->index('email');
            
            // Add foreign key constraint for user_status_id
            $table->foreign('user_status_id')->references('id')->on('user_statuses')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
