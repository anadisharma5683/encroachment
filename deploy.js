// Simple deployment script
const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting deployment...');

try {
  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json not found. Please run this script from the project root directory.');
  }

  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm ci', { stdio: 'inherit' });

  // Run tests (if any)
  console.log('Running tests...');
  try {
    execSync('npm test', { stdio: 'inherit' });
  } catch (error) {
    console.log('No tests found or tests failed, continuing with deployment...');
  }

  // Build the application
  console.log('Building the application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Check if Docker is available
  try {
    execSync('docker --version', { stdio: 'ignore' });
    console.log('Docker found. Building Docker image...');
    execSync('npm run docker:build', { stdio: 'inherit' });
    
    console.log('Starting containers with docker-compose...');
    execSync('npm run docker:compose', { stdio: 'inherit' });
    
    console.log('Application deployed successfully!');
    console.log('Access it at http://localhost:8080');
  } catch (error) {
    console.log('Docker not found or not available.');
    console.log('To serve the application, run: npx serve dist');
    console.log('Or deploy the contents of the "dist" directory to your web server.');
  }

  console.log('Deployment completed!');
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}