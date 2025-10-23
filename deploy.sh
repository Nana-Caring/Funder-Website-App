#!/bin/bash

# Deployment Script for Nana Caring Frontend
# This script builds and prepares the frontend for deployment

echo "🚀 Starting Nana Caring Frontend Deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build files are in the 'dist' directory"
    echo ""
    echo "🌐 Production API Configuration:"
    echo "   Backend URL: https://nanacaring-backend.onrender.com"
    echo "   API Endpoints: /api/auth, /api/funder, /api/caregiver"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Deploy the 'dist' folder to your hosting service"
    echo "   2. Configure your hosting service to handle SPA routing"
    echo "   3. Test the deployed application"
    echo ""
    echo "🎉 Ready for deployment!"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
