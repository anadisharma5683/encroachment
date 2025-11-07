# Nirmaan Vigil AI

A comprehensive encroachment detection system with map visualization and building analysis capabilities.

## Features

- Interactive map with color-coded building risk levels (red, yellow, green)
- Building encroachment detection using AI analysis
- Analytics dashboard with risk distribution statistics
- Responsive UI with tab navigation

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Docker (optional, for containerized deployment)

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to http://localhost:8080

## Deployment

### Option 1: Docker Deployment (Recommended)

1. Build and run with Docker Compose:
   ```bash
   npm run docker:compose
   ```

2. Access the application at http://localhost:8080

### Option 2: Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist` directory. Deploy these files to your web server.

### Option 3: Automated Deployment

Run the deployment script:
```bash
npm run deploy
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=/api
VITE_MAP_API_URL=https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── data/               # Data services and mock data
├── pages/              # Page components
│   ├── admin/          # Admin dashboard pages
│   └── citizen/        # Citizen-facing pages
├── lib/                # Utility functions
└── hooks/              # Custom React hooks
```

## API Endpoints

In development, the application uses mock endpoints:
- `/geojson` - Returns mock GeoJSON data for map visualization
- `/predict` - Returns mock building analysis results

In production, these should be replaced with actual backend services.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Running in Production Mode

```bash
npm run preview
```

## Docker Deployment

1. Build the Docker image:
   ```bash
   npm run docker:build
   ```

2. Run the container:
   ```bash
   npm run docker:run
   ```

3. Or use Docker Compose:
   ```bash
   npm run docker:compose
   ```

## Health Check

The application provides a health check endpoint at `/health.json`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.