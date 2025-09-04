<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('flag_post_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            // $table->timestamps(); np need for now
        });

        DB::table('flag_post_statuses')->insert([
            ['name' => 'Open'],
            ['name' => 'In Review'],
            ['name' => 'Escalated'],
            ['name' => 'Resolved'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flag_post_statuses');
    }
};
