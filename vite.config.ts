import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 8080,
  },
  preview: {
    host: true,
    port: 8080,
  },
  plugins: [
    react(),
    {
      name: 'geojson-middleware',
      configureServer(server) {
        // Mock geojson endpoint for development
        server.middlewares.use('/geojson', (req, res, next) => {
          if (req.method === 'GET') {
            const url = new URL(req.url || '', `http://${req.headers.host}`);
            const north = parseFloat(url.searchParams.get('north') || '0');
            const south = parseFloat(url.searchParams.get('south') || '0');
            const east = parseFloat(url.searchParams.get('east') || '0');
            const west = parseFloat(url.searchParams.get('west') || '0');
            
            const mockData = {
              "type": "FeatureCollection",
              "features": [
                {
                  "type": "Feature",
                  "properties": {
                    "color": "red",
                    "area_in_meters": 120.5,
                    "status": "High Risk",
                    "UID": "BLDG-001",
                    "latitude": 22.7201,
                    "longitude": 75.8582,
                    "risk_level": "High",
                    "last_scanned": "2023-10-15"
                  },
                  "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                      [75.8575, 22.7198],
                      [75.8580, 22.7198],
                      [75.8580, 22.7202],
                      [75.8575, 22.7202],
                      [75.8575, 22.7198]
                    ]]
                  }
                },
                {
                  "type": "Feature",
                  "properties": {
                    "color": "yellow",
                    "area_in_meters": 85.3,
                    "status": "Medium Risk",
                    "UID": "BLDG-002",
                    "latitude": 22.7192,
                    "longitude": 75.8572,
                    "risk_level": "Medium",
                    "last_scanned": "2023-10-14"
                  },
                  "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                      [75.8568, 22.7190],
                      [75.8574, 22.7190],
                      [75.8574, 22.7194],
                      [75.8568, 22.7194],
                      [75.8568, 22.7190]
                    ]]
                  }
                },
                {
                  "type": "Feature",
                  "properties": {
                    "color": "green",
                    "area_in_meters": 210.7,
                    "status": "Low Risk",
                    "UID": "BLDG-003",
                    "latitude": 22.7205,
                    "longitude": 75.8565,
                    "risk_level": "Low",
                    "last_scanned": "2023-10-16"
                  },
                  "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                      [75.8560, 22.7202],
                      [75.8568, 22.7202],
                      [75.8568, 22.7208],
                      [75.8560, 22.7208],
                      [75.8560, 22.7202]
                    ]]
                  }
                }
              ]
            };
            
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.statusCode = 200;
            res.end(JSON.stringify(mockData));
          } else {
            next();
          }
        });
        
        // Mock predict endpoint for development
        server.middlewares.use('/predict', (req, res, next) => {
          if (req.method === 'POST') {
            const mockResponse = {
              predicted_class: "High Risk",
              class_index: 0,
              probabilities: [0.85, 0.10, 0.05]
            };
            
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.statusCode = 200;
            res.end(JSON.stringify(mockResponse));
          } else {
            next();
          }
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Build configuration for production
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'framer-motion'],
          maps: ['leaflet']
        }
      }
    }
  }
});