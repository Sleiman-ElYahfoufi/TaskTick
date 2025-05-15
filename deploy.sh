#!/bin/bash

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "🧹 Cleaning up existing containers..."
docker compose down

echo "🗑️ Removing unused Docker resources..."
docker system prune -af --volumes

echo "🚀 Starting essential services..."
docker compose up -d database

echo "⏳ Waiting for MySQL to be ready..."
sleep 10

echo "🔍 Checking MySQL readiness..."
max_retries=10
retries=0
while [ $retries -lt $max_retries ]; do
  if docker exec tasktick-database mysqladmin ping -h localhost -u"root" -p"${DB_PASSWORD}" --silent 2>/dev/null; then
    echo "✅ MySQL is ready!"
    break
  fi
  echo "⌛ MySQL not ready yet, waiting (attempt $((retries+1))/$max_retries)..."
  retries=$((retries+1))
  sleep 5
done

echo "🚀 Starting application services..."
docker compose up -d  backend

if [ "$1" == "--with-migrations" ]; then
  echo "🔄 Running database migrations..."
  sudo docker exec tasktick-backend /app/start.sh migration:run
fi

if [ "$1" == "--with-seed" ] || [ "$2" == "--with-seed" ]; then
  echo "🌱 Running database seeders..."
  sudo docker exec  tasktick-backend /app/start.sh seed  
fi



echo "✅ Deployment complete!"
echo "📊 Resource usage:"
docker stats --no-stream