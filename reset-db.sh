#!/bin/bash

# Database Reset Script
# This script will completely reset the database and seed with sample data

echo "🗄️  Database Reset Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  WARNING: This will DELETE ALL data in the database!"
echo ""
read -p "Are you sure you want to continue? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]
then
    echo "❌ Cancelled"
    exit 1
fi

echo "🛑 Stopping containers..."
docker-compose down -v

echo ""
echo "🚀 Starting MySQL container..."
docker-compose up -d

echo ""
echo "⏳ Waiting for MySQL to be ready..."
sleep 15

echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

echo ""
echo "📦 Running migrations..."
npx prisma migrate deploy

echo ""
echo "🌱 Seeding database..."
npx ts-node prisma/seed.ts

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Database reset completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "   1. Run: npm run dev"
echo "   2. Test login with sample accounts (see DATABASE_SETUP.md)"
echo ""
