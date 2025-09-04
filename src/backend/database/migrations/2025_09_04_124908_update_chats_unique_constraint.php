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
            $table->dropForeign('chats_employee_employee_id_foreign');
            
            $table->dropUnique('chats_post_id_employee_employee_id_unique');
            
            $table->unique(['post_id', 'employee_employee_id', 'hr_employee_id'], 'chats_post_employee_hr_unique');
            
            $table->foreign('employee_employee_id')->references('id')->on('employees')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chats', function (Blueprint $table) {
            $table->dropForeign('chats_employee_employee_id_foreign');
            
            $table->dropUnique('chats_post_employee_hr_unique');
            
            $table->unique(['post_id', 'employee_employee_id'], 'chats_post_id_employee_employee_id_unique');
            
            $table->foreign('employee_employee_id')->references('id')->on('employees')->onDelete('cascade');
        });
    }
};
