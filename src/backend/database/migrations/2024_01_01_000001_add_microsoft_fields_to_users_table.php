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
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->after('email');
            $table->string('microsoft_id')->nullable()->unique()->after('username');
            $table->string('avatar')->nullable()->after('microsoft_id');
            $table->string('microsoft_tenant_id')->nullable()->after('avatar');
            $table->string('user_type')->default('Member')->after('microsoft_tenant_id');
            
            // Make password nullable since we use Microsoft 365 auth
            $table->string('password')->nullable()->change();
            
            // Add indexes for faster lookups
            $table->index('username');
            $table->index('microsoft_id');
            $table->index('microsoft_tenant_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['username']);
            $table->dropIndex(['microsoft_id']);
            $table->dropIndex(['microsoft_tenant_id']);
            $table->dropColumn([
                'username',
                'microsoft_id',
                'avatar',
                'microsoft_tenant_id',
                'user_type'
            ]);
            
            // Restore password as required
            $table->string('password')->nullable(false)->change();
        });
    }
};
