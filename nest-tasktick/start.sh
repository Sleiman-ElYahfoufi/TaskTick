#!/bin/sh
set -e

echo "→ Running command: $1"

if [ "$1" = "start:dev" ]; then
    exec sudo npm run start:dev
elif [ "$1" = "migration:run" ]; then
    exec sudo npm run migration:run
elif [ "$1" = "seed" ]; then
    exec sudo npm run seed
elif [ "$1" = "shell" ]; then
    exec sh
else
    exec "$@"
fi