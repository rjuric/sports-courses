#!/usr/bin/env sh

source .env

# Run the PostgreSQL container
docker run --name custom_postgres \
  -e POSTGRES_DB=$DB_NAME \
  -e POSTGRES_USER=$DB_USERNAME \
  -e POSTGRES_PASSWORD=$DB_PASSWORD \
  -d -p $DB_PORT:5432 postgres
