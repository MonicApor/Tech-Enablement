#!/bin/bash

# Start PHP-FPM in the background
php-fpm -D

# Start Laravel development server
cd /var/www/backend
php artisan serve --host=0.0.0.0 --port=8000
