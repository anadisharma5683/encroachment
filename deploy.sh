#!/bin/bash

# Deployment script for Nirmaan Vigil AI

# Exit on any error
set -e

echo "Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm ci

# Run tests (if any)
echo "Running tests..."
npm test

# Build the application
echo "Building the application..."
npm run build

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "Docker found. Building Docker image..."
    docker build -t nirmaan-vigil-ai .
    
    echo "Starting containers with docker-compose..."
    docker-compose up -d
    
    echo "Application deployed successfully!"
    echo "Access it at http://localhost:8080"
else
    echo "Docker not found. Serving built files locally..."
    echo "To serve the application, run: npx serve dist"
    echo "Or deploy the contents of the 'dist' directory to your web server."
fi

echo "Deployment completed!"