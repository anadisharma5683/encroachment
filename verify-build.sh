#!/bin/bash

# Deployment Verification Script
echo "🔍 Verifying Encroachment Detection System Build..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if dist folder exists
if [ -d "dist" ]; then
    echo -e "${GREEN}✓${NC} dist folder exists"
else
    echo -e "${RED}✗${NC} dist folder not found. Run 'npm run build' first."
    exit 1
fi

# Check if index.html exists in dist
if [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✓${NC} index.html found in dist"
else
    echo -e "${RED}✗${NC} index.html not found in dist"
    exit 1
fi

# Check if assets folder exists
if [ -d "dist/assets" ]; then
    echo -e "${GREEN}✓${NC} assets folder exists"
    
    # Count JS files
    JS_COUNT=$(find dist/assets -name "*.js" | wc -l)
    echo -e "${GREEN}✓${NC} Found $JS_COUNT JavaScript files"
    
    # Count CSS files
    CSS_COUNT=$(find dist/assets -name "*.css" | wc -l)
    echo -e "${GREEN}✓${NC} Found $CSS_COUNT CSS files"
else
    echo -e "${RED}✗${NC} assets folder not found"
    exit 1
fi

# Check environment files
echo ""
echo "🔧 Environment Configuration:"

if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} Frontend .env exists"
else
    echo -e "${YELLOW}⚠${NC} Frontend .env not found (optional for production)"
fi

if [ -f ".env.production" ]; then
    echo -e "${GREEN}✓${NC} Production .env exists"
else
    echo -e "${RED}✗${NC} .env.production not found"
fi

if [ -f "server/.env" ]; then
    echo -e "${GREEN}✓${NC} Backend .env exists"
else
    echo -e "${YELLOW}⚠${NC} Backend .env not found - needed for API"
fi

# Check critical files
echo ""
echo "📋 Critical Files:"

CRITICAL_FILES=("package.json" "vite.config.ts" "index.html" "nginx.conf" "Dockerfile")

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file missing"
    fi
done

# Check dist size
echo ""
echo "📦 Build Size:"
DIST_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
echo -e "${GREEN}✓${NC} Total dist size: $DIST_SIZE"

# Summary
echo ""
echo "================================"
echo -e "${GREEN}✓ Build verification complete!${NC}"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Run 'npm run preview' to test locally"
echo "2. Deploy the 'dist' folder to your hosting"
echo "3. Set up the backend server with proper .env"
echo "4. Update VITE_API_URL in production"
echo ""
