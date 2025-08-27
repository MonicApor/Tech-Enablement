<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class MakeServiceCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:service {name : The name of the service class}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new service class';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->argument('name');
        $servicePath = app_path('Services/' . $name . '.php');
        
        // Check if service already exists
        if (File::exists($servicePath)) {
            $this->error("Service {$name} already exists!");
            return 1;
        }

        // Create Services directory if it doesn't exist
        if (!File::exists(app_path('Services'))) {
            File::makeDirectory(app_path('Services'), 0755, true);
        }

        // Generate service content
        $content = $this->generateServiceContent($name);
        
        // Write the file
        File::put($servicePath, $content);
        
        $this->info("Service {$name} created successfully!");
        $this->line("Location: {$servicePath}");
        
        return 0;
    }

    /**
     * Generate the service class content
     *
     * @param string $name
     * @return string
     */
    private function generateServiceContent(string $name): string
    {
        return "<?php

namespace App\\Services;

use Exception;

class {$name}
{
    /**
     * Create a new {$name} instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Example method
     *
     * @return array
     */
    public function example(): array
    {
        try {
            // Your business logic here
            return [
                'success' => true,
                'message' => 'Operation completed successfully'
            ];
        } catch (Exception \$e) {
            throw new Exception('Operation failed: ' . \$e->getMessage());
        }
    }
}
";
    }
}
