import { GeometryObject, GeoJsonProperties, Feature, LineString, Polygon, Point, FeatureCollection } from 'geojson';

const extent = 4096;

enum GeometryType {
  Unknown = 0, Point = 1, LineString = 2, Polygon = 3
};

export interface IVectorTile {
  geometry: number[][] | number[][][] | number[][][][];
  type: number;
  tags: { [key: string]: string | number };
}

export const toFeatureCollection = (features: IVectorTile[], x: number, y: number, z: number): FeatureCollection<GeometryObject, GeoJsonProperties> => {
  return {
    type: 'FeatureCollection',
    features: features.map(f => toGeoJSON(f, x, y, z))
  };
};

const toGeoJSON = (feature: IVectorTile, x: number, y: number, z: number) => {
  const size = extent * Math.pow(2, z);
  const x0 = extent * x;
  const y0 = extent * y;
  let coords = feature.geometry;
  let type = GeometryType[feature.type as GeometryType];
  // let type = feature.type;
  // let i, j;

  const project = (line: number[][]) => {
    for (let j = 0; j < line.length; j++) {
      const p = line[j];
      const y2 = 180 - (p[1] + y0) * 360 / size;
      line[j] = [
        (p[0] + x0) * 360 / size - 180,
        360 / Math.PI * Math.atan(Math.exp(y2 * Math.PI / 180)) - 90
      ];
    }
  };

  switch (feature.type) {
    case GeometryType.Point:
      project(coords as number[][]);
      break;

    case GeometryType.LineString:
      type = 'LineString';
      for (let i = 0; i < coords.length; i++) {
        project(coords[i] as number[][]);
      }
      break;

    case GeometryType.Polygon:
      type = 'Polygon';
      coords = classifyRings(coords as number[][][]);
      for (let i = 0; i < coords.length; i++) {
        for (let j = 0; j < coords[i].length; j++) {
          project(coords[i][j] as number[][]);
        }
      }
      break;
  }

  if (coords.length === 1) {
    coords = coords[0] as number[][];
  } else {
    type = 'Multi' + type;
  }

  const result: Feature<any> = {
    type: 'Feature',
    geometry: {
      type: type,
      coordinates: coords
    },
    properties: feature.tags
  };

  return result;
};

// classifies an array of rings into polygons with outer rings and holes

const classifyRings = (rings: number[][][]) => {
  const len = rings.length;

  if (len <= 1) return [rings];

  const polygons = [];
  let polygon: number[][][] = [];
  let ccw;

  for (let i = 0; i < len; i++) {
    const area = signedArea(rings[i]);
    if (area === 0) continue;

    if (ccw === undefined) ccw = area < 0;

    if (ccw === area < 0) {
      if (polygon) polygons.push(polygon);
      polygon = [rings[i]];
    } else {
      polygon.push(rings[i]);
    }
  }
  if (polygon) polygons.push(polygon);

  return polygons;
};

const signedArea = (ring: number[][]) => {
  let sum = 0;
  for (let i = 0, len = ring.length, j = len - 1, p1, p2; i < len; j = i++) {
    p1 = ring[i];
    p2 = ring[j];
    sum += (p2[0] - p1[0]) * (p1[1] + p2[1]);
  }
  return sum;
};
