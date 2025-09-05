<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PostEscalataionService;

class ProcessEscalations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'posts:process-escalations {--dry-run : Run without sending emails}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process post escalations and send email reminders';

    /**
     * Execute the console command.
     */
    public function handle(PostEscalataionService $postEscalataionService)
    {
        $this->info('Processing post escalations...');
        if($this->option('dry-run')) {
            $this->warn('Dry run mode enabled. No emails will be sent.');
            $postEscalataionService->processEscalations();
        }
        
        try {
            $postEscalataionService->processEscalations();
            $this->info('Post escalations processed successfully.');
        } catch (\Exception $e) {
            $this->error('Error processing post escalations: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
