#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh dbtest:5432 -t 30
# npm run typeorm -- --dataSource=src/database/data-source.ts query "CREATE DATABASE test;"
npm run migration:run
npm run seed:run:relational
npm run test:e2e
