#!/bin/sh

echo "⏳ Waiting for Postgres..."
until nc -z postgres 5432; do
  sleep 2
done

echo "⏳ Waiting for Redis..."
until nc -z redis 6379; do
  sleep 2
done

echo "🚀 Synchronizing database schema..."
npx prisma db push --accept-data-loss

echo "🚀 Starting app..."
npm run start:prod