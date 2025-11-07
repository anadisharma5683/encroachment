// src/pages/MapPage.tsx
import { useEffect, useRef } from 'react';
import L, { Map as LeafletMap, GeoJSON } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { Eye, AlertTriangle, MapPin, Zap } from 'lucide-react';
import { fetchGeoData } from '@/data/geoDataService';
import { FeatureCollection, Geometry } from 'geojson';

interface CustomProperties {
  color: string;
  area_in_meters: number;
  status: string;
  UID: string;
  latitude: number;
  longitude: number;
  risk_level: string;
  last_scanned: string;
}

function MapPage() {
  const mapRef = useRef<LeafletMap | null>(null);
  const geoJsonLayerRef = useRef<GeoJSON | null>(null);

  useEffect(() => {
    // Prevent map from being initialized more than once
    if (mapRef.current) return;

    // Use environment variable for map tile URL
    const mapTileUrl = import.meta.env.VITE_MAP_API_URL || 
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    const map = L.map('map').setView([22.7196, 75.8577], 15);
    mapRef.current = map;

    // Add tile layer
    L.tileLayer(mapTileUrl, {
      attribution: '&copy; Esri — Source: Esri, Maxar',
      maxZoom: 20,
    }).addTo(map);

    // Load polygons from our service
    const loadBoxes = () => {
      const bounds = map.getBounds();
      
      fetchGeoData(
        bounds.getNorth(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getWest()
      )
        .then((data: FeatureCollection<Geometry, CustomProperties>) => {
          if (geoJsonLayerRef.current) {
            map.removeLayer(geoJsonLayerRef.current);
          }

          const geoJsonLayer = L.geoJSON(data, {
            style: (feature) => {
              const properties = feature?.properties || {};
              return {
                color: properties.color || 'red',
                fillColor: properties.color || 'red',
                weight: 2,
                fillOpacity: 0.4,
              };
            },
            onEachFeature: (feature, layer) => {
              const p = feature.properties || {};

              const popupDiv = document.createElement('div');
              popupDiv.innerHTML = `
                <b>Area:</b> ${p.area_in_meters ?? '-'} m²<br>
                <b>Status:</b> ${p.status ?? '-'}<br>
                <b>UID:</b> ${p.UID ?? '-'}<br>
                <b>Lat:</b> ${p.latitude ?? '-'}<br>
                <b>Lng:</b> ${p.longitude ?? '-'}<br><br>
                <b>Risk Level:</b> ${p.risk_level ?? 'Unknown'}<br>
                <b>Last Scanned:</b> ${p.last_scanned ?? 'N/A'}<br>

              `;

              layer.bindPopup(popupDiv);

              layer.on('popupopen', () => {
                const buttons = popupDiv.querySelectorAll('button');
                buttons.forEach((btn) => {
                  btn.addEventListener('click', () => {
                    const target = btn as HTMLButtonElement;
                    const color = target.dataset.color;
                    if (color && layer instanceof L.Path) {
                      layer.setStyle({ fillColor: color, color: color });
                      if (feature.properties) {
                        feature.properties.color = color;
                      }
                    }
                  });
                });
              });
            },
          });

          geoJsonLayer.addTo(map);
          geoJsonLayerRef.current = geoJsonLayer;
        })
        .catch((err) => {
          console.error('Error fetching polygons:', err);
        });
    };

    map.on('moveend zoomend', loadBoxes);
    map.whenReady(() => {
      // Delay the first load to avoid premature bounds fetching
      setTimeout(loadBoxes, 500);
    });

    return () => {
      map.off();
      map.remove();
    };
  }, []);

  return (
    <div className="h-screen w-full relative">
      <div id="map" className="h-full w-full"></div>
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg p-4 z-[1000]">
        <h2 className="text-lg font-bold mb-3 text-gray-800">Encroachment Detection</h2>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className="text-sm">High Risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span className="text-sm">Medium Risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className="text-sm">Low Risk</span>
          </div>
        </div>
      </div>
      
      {/* Stats Panel */}
      <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg p-4 z-[1000]">
        <h3 className="font-bold text-gray-800 mb-2">Detection Stats</h3>
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Eye className="w-4 h-4 mr-2 text-blue-500" />
            <span>Active Monitoring: 127 zones</span>
          </div>
          <div className="flex items-center text-sm">
            <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
            <span>Alerts Today: 8</span>
          </div>
          <div className="flex items-center text-sm">
            <Zap className="w-4 h-4 mr-2 text-green-500" />
            <span>AI Accuracy: 96%</span>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-4 z-[1000]">
        <h3 className="font-bold text-gray-800 mb-2">Map Legend</h3>
        <div className="space-y-1 text-sm">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-red-500" />
            <span>Detected Encroachment</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-200 border border-blue-500 mr-2"></div>
            <span>Public Land</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-200 border border-green-500 mr-2"></div>
            <span>Verified Legal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapPage;