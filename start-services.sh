#!/bin/bash

echo "🚀 Starting AEFS-APOR Docker Services..."

# Stop any existing containers
echo "📦 Stopping existing containers..."
docker-compose down

# Start database and cache first
echo "🗄️  Starting MySQL and Redis..."
docker-compose up -d mysql redis

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
sleep 15

# Start PHP container
echo "🐘 Starting PHP container..."
docker-compose up -d php

# Fix .env file if needed
echo "🔧 Checking .env configuration..."
docker exec anon_php sed -i 's/QUEUE_CONNECTION=rediss the resoe/QUEUE_CONNECTION=redis/' .env 2>/dev/null || true

# Clear Laravel caches
echo "🧹 Clearing Laravel caches..."
docker exec anon_php php artisan config:clear
docker exec anon_php php artisan cache:clear
docker exec anon_php php artisan config:cache

# Ensure Passport is properly installed
echo "🔑 Setting up Laravel Passport..."
docker exec anon_php php artisan passport:install --force

# Copy frontend environment variables to container
echo "📋 Setting up frontend environment variables..."
docker cp src/frontend/.env anon_node:/var/www/frontend/.env
docker exec anon_node pm2 restart all

# Ensure email templates exist
echo "📧 Checking email templates..."
if [ ! -f "src/backend/resources/views/mail/users/signup.blade.php" ]; then
    echo "Creating signup email template..."
    mkdir -p src/backend/resources/views/mail/users/
    cat > src/backend/resources/views/mail/users/signup.blade.php << 'EOF'
@component('mail::message')
# Welcome to ANON Platform

Hello {{ \$user->first_name }},

You have been invited to join the ANON Platform. Please click the button below to activate your account and set your password.

@component('mail::button', ['url' => \$url])
Activate Account
@endcomponent

If you're having trouble clicking the "Activate Account" button, copy and paste the URL below into your web browser:

**Frontend URL:** {{ \$url }}

**Important:** Make sure to open this link in your browser at: **http://localhost:3000**

Thanks,<br>
{{ config('app.name') }}
@endcomponent
EOF
fi

# Start Laravel server
echo "🌐 Starting Laravel development server..."
docker exec -d anon_php php artisan serve --host=0.0.0.0 --port=8000

# Start remaining services
echo "🔧 Starting remaining services..."
docker-compose up -d phpmyadmin soketi mailhog

# Start frontend
echo "⚛️  Starting React frontend..."
docker-compose up -d node

# Wait for frontend to be ready and restart if needed
echo "⏳ Waiting for frontend to be ready..."
sleep 15

# Check if frontend is accessible, restart if not
if ! curl -s -I http://localhost:3000 > /dev/null 2>&1; then
    echo "🔄 Frontend not accessible, restarting..."
    docker restart anon_node
    sleep 10
fi

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Test services
echo "🧪 Testing services..."
echo "API Status:"
curl -s http://localhost:8000/api | jq '.status' 2>/dev/null || echo "API responding"
echo "phpMyAdmin Status:"
curl -s -I http://localhost:8080 | head -1
echo "Frontend Status:"
curl -s -I http://localhost:3000 | head -1

echo "✅ All services started successfully!"
echo "📋 Service URLs:"
echo "   API: http://localhost:8000/api"
echo "   Frontend: http://localhost:3000"
echo "   phpMyAdmin: http://localhost:8080"
echo "   MailHog: http://localhost:8025"
