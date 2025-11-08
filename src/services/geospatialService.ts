// src/services/geospatialService.ts

// Types
export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface Polygon {
  coordinates: GeoPoint[][];
}

export interface GeoFeature {
  id: string;
  type: string;
  geometry: {
    type: string;
    coordinates: any;
  };
  properties: Record<string, any>;
}

// Geospatial calculations
class GeospatialService {
  // Calculate distance between two points using Haversine formula
  calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = point1.lat * Math.PI/180;
    const φ2 = point2.lat * Math.PI/180;
    const Δφ = (point2.lat - point1.lat) * Math.PI/180;
    const Δλ = (point2.lng - point1.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  // Check if a point is within a bounding box
  isPointInBoundingBox(point: GeoPoint, bbox: BoundingBox): boolean {
    return (
      point.lat >= bbox.south &&
      point.lat <= bbox.north &&
      point.lng >= bbox.west &&
      point.lng <= bbox.east
    );
  }

  // Check if a point is within a polygon using ray casting algorithm
  isPointInPolygon(point: GeoPoint, polygon: GeoPoint[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lng, yi = polygon[i].lat;
      const xj = polygon[j].lng, yj = polygon[j].lat;

      const intersect = ((yi > point.lat) !== (yj > point.lat))
          && (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // Calculate bounding box from a set of points
  calculateBoundingBox(points: GeoPoint[]): BoundingBox {
    if (points.length === 0) {
      return { north: 0, south: 0, east: 0, west: 0 };
    }

    let north = points[0].lat;
    let south = points[0].lat;
    let east = points[0].lng;
    let west = points[0].lng;

    for (const point of points) {
      if (point.lat > north) north = point.lat;
      if (point.lat < south) south = point.lat;
      if (point.lng > east) east = point.lng;
      if (point.lng < west) west = point.lng;
    }

    return { north, south, east, west };
  }

  // Calculate centroid of a polygon
  calculateCentroid(polygon: GeoPoint[]): GeoPoint {
    let cx = 0;
    let cy = 0;
    let area = 0;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lng;
      const yi = polygon[i].lat;
      const xj = polygon[j].lng;
      const yj = polygon[j].lat;

      const f = (xi * yj) - (xj * yi);
      area += f;
      cx += (xi + xj) * f;
      cy += (yi + yj) * f;
    }

    area /= 2;
    cx /= (6 * area);
    cy /= (6 * area);

    return { lat: cy, lng: cx };
  }

  // Calculate area of a polygon in square meters
  calculatePolygonArea(polygon: GeoPoint[]): number {
    let area = 0;
    const earthRadius = 6371e3; // Earth radius in meters

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lng * Math.PI/180;
      const yi = polygon[i].lat * Math.PI/180;
      const xj = polygon[j].lng * Math.PI/180;
      const yj = polygon[j].lat * Math.PI/180;

      area += (xj - xi) * (2 + Math.sin(yi) + Math.sin(yj));
    }

    return Math.abs(area * earthRadius * earthRadius / 2);
  }

  // Filter features by bounding box
  filterFeaturesByBoundingBox(
    features: GeoFeature[],
    bbox: BoundingBox
  ): GeoFeature[] {
    return features.filter(feature => {
      if (feature.geometry.type === 'Point') {
        const point = {
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0]
        };
        return this.isPointInBoundingBox(point, bbox);
      } else if (feature.geometry.type === 'Polygon') {
        // For polygons, check if any point is within the bbox
        const coordinates = feature.geometry.coordinates[0];
        for (const coord of coordinates) {
          const point = { lat: coord[1], lng: coord[0] };
          if (this.isPointInBoundingBox(point, bbox)) {
            return true;
          }
        }
        return false;
      }
      return false;
    });
  }

  // Convert degrees to radians
  toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Convert radians to degrees
  toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }
}

// Export singleton instance
export const geospatialService = new GeospatialService();