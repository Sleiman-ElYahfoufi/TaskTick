#!/bin/bash
set -e

# Load environment variables
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

echo "🧹 Cleaning up existing containers..."
docker compose down

echo "🗑️ Removing unused Docker resources..."
docker system prune -af --volumes

echo "🚀 Starting database..."
docker compose up -d database

echo "⏳ Waiting for MySQL to be ready..."
sleep 15

echo "🔍 Checking MySQL readiness..."
max_retries=10
retries=0
while [ $retries -lt $max_retries ]; do
  if docker exec tasktick-database mysqladmin ping -h localhost -u"root" -p"${DB_PASSWORD}" --silent 2>/dev/null; then
    echo "✅ MySQL is ready!"
    break
  fi
  echo "⌛ MySQL not ready yet, waiting..."
  retries=$((retries+1))
  sleep 5
done

echo "🚀 Starting backend container..."
docker compose up -d backend
sleep 5

if [[ "$1" == "--with-migrations" || "$2" == "--with-migrations" ]]; then
  echo "🔄 Running migrations..."
  docker exec tasktick-backend npm run migration:run
fi

if [[ "$1" == "--with-seed" || "$2" == "--with-seed" ]]; then
  echo "🌱 Running seeders..."
  docker exec tasktick-backend npm run seed
fi

echo "✅ Deployment complete!"
echo "📊 Resource usage:"
docker stats --no-stream