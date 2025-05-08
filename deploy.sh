#!/bin/bash

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "🧹 Cleaning up existing containers..."
docker-compose down

echo "🗑️ Removing unused Docker resources..."
docker system prune -af --volumes

echo "🚀 Starting essential services..."
docker-compose up -d database

echo "⏳ Waiting for MySQL to be ready..."
sleep 10

echo "🚀 Starting application services..."
docker-compose up -d  backend

if [ "$1" == "--with-migrations" ]; then
  echo "🔄 Running database migrations..."
  docker-compose exec -T backend ./start.sh migration:run
fi

if [ "$1" == "--with-seed" ] || [ "$2" == "--with-seed" ]; then
  echo "🌱 Running database seeders..."
  docker-compose exec -T backend ./start.sh seed
fi



echo "✅ Deployment complete!"
echo "📊 Resource usage:"
docker stats --no-stream