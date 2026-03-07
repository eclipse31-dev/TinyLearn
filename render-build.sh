#!/usr/bin/env bash
# Render build script for Laravel

echo "Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader

echo "Caching configuration..."
php artisan config:cache

echo "Build complete!"
