@echo off
REM Deployment script for Nirmaan Vigil AI (Windows)

echo Starting deployment process...

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: package.json not found. Please run this script from the project root directory.
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
npm ci

REM Run tests (if any)
echo Running tests...
npm test

REM Build the application
echo Building the application...
npm run build

REM Check if Docker is available
docker --version >nul 2>&1
if %errorlevel% == 0 (
    echo Docker found. Building Docker image...
    docker build -t nirmaan-vigil-ai .
    
    echo Starting containers with docker-compose...
    docker-compose up -d
    
    echo Application deployed successfully!
    echo Access it at http://localhost:8080
) else (
    echo Docker not found. Serving built files locally...
    echo To serve the application, run: npx serve dist
    echo Or deploy the contents of the 'dist' directory to your web server.
)

echo Deployment completed!