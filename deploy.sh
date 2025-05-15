#!/bin/bash
set -e

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "🧹 Cleaning up existing containers..."
docker compose down

echo "🗑️ Removing unused Docker resources..."
docker system prune -af --volumes

echo "🚀 Starting database..."
docker compose up -d database

echo "⏳ Waiting for MySQL to be ready..."
sleep 15  # Increased wait time for MySQL initialization

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

if [ $retries -eq $max_retries ]; then
  echo "❌ MySQL failed to become ready. Check logs:"
  docker logs tasktick-database
  exit 1
fi

echo "🚀 Starting application (migrations and seeding will run automatically)..."
docker compose up -d backend

sleep 10

echo "📋 Backend startup logs:"
docker logs tasktick-backend --tail 20

echo "✅ Deployment complete!"
echo "📊 Resource usage:"
docker stats --no-stream