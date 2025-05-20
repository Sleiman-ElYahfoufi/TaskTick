#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npm run migration:run

echo "🌱 Running database seeders..."
npm run seed

echo "🚀 Starting application in production mode..."
exec npm run start:prod