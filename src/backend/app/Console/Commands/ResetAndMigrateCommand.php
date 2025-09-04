<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class ResetAndMigrateCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:reset-fresh {--seed : Run seeders after migration}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset database completely and run fresh migrations';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('⚠️  WARNING: This will completely reset your database!');
        $this->info('All data will be lost!');
        
        if (!$this->confirm('Are you absolutely sure you want to continue?')) {
            $this->info('Operation cancelled.');
            return 0;
        }

        try {
            $this->info('🔄 Dropping all tables...');
            
            // Drop all tables
            $tables = DB::select('SHOW TABLES');
            $dbName = 'Tables_in_' . env('DB_DATABASE');
            
            DB::statement('SET FOREIGN_KEY_CHECKS=0');
            
            foreach ($tables as $table) {
                $tableName = $table->$dbName;
                if ($tableName !== 'migrations') {
                    DB::statement("DROP TABLE IF EXISTS `{$tableName}`");
                    $this->line("Dropped table: {$tableName}");
                }
            }
            
            DB::statement('SET FOREIGN_KEY_CHECKS=1');
            
            $this->info('✅ All tables dropped successfully!');
            
            // Clear migration cache
            $this->info('🧹 Clearing migration cache...');
            Artisan::call('config:clear');
            Artisan::call('cache:clear');
            
            // Run fresh migrations
            $this->info('🔄 Running fresh migrations...');
            Artisan::call('migrate', [], $this->getOutput());
            
            if ($this->option('seed')) {
                $this->info('🌱 Running seeders...');
                Artisan::call('db:seed', [], $this->getOutput());
            }
            
            $this->info('🎉 Database reset and migration completed successfully!');
            
        } catch (\Exception $e) {
            $this->error('❌ Error occurred: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
