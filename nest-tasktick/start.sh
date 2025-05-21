#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npm run migration:run

echo "🌱 Running database seeder..."
npm run seed:single -- tech-stack

echo "🚀 Starting application in production mode..."
exec npm run start:prod