import * as fs from 'fs';
import * as path from 'path';
import * as geojsonvt from 'geojson-vt';

/**
 * Load a GeoJSON file
 *
 * @param {string} file
 * @returns
 */
export const loadGeoJSON = (file: string) => {
  return new Promise<JSON>((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

/**
 * Get all GeoJSON files in a folder
 *
 * @param {string} folder
 * @returns
 */
export const findGeojsonFilesInFolder = (folder: string) => {
  return fs
    .readdirSync(folder)
    .map(f => path.join(folder, f))
    .filter(f => {
      const ext = path.extname(f);
      return ext && (ext.toLowerCase() === '.geojson' || ext.toLowerCase() === '.json');
    });
};

export interface IGeojsonVTOptions {
  /** max zoom to preserve detail on; can't be higher than 24 */
  maxZoom?: number;
  /** simplification tolerance (higher means simpler) */
  tolerance?: number;
  /** tile extent (both width and height) - this needs to match the value that is used in vt2geojson.ts */
  extent?: number;
  /** tile buffer on each side */
  buffer?: number;
  /** logging level (0 to disable, 1 or 2) */
  debug?: 0 | 1 | 2;
  /** whether to enable line metrics tracking for LineString/MultiLineString features */
  lineMetrics?: false;
  /** name of a feature property to promote to feature.id. Cannot be used with `generateId` */
  promoteId?: string;
  /** whether to generate feature ids. Cannot be used with `promoteId` */
  generateId?: boolean;
  /** max zoom in the initial tile index?: if indexMaxZoom === maxZoom, and indexMaxPoints === 0, pre-generate all tiles */
  indexMaxZoom?: number;
  /** max number of points per tile in the index */
  indexMaxPoints?: number;
  /** whether to include solid tile children in the index */
  solidChildren?: boolean;
}

/**
 * Create a tile index using geojson-vt
 *
 * @param {string} filename
 * @returns
 */
export const createTileIndex = async (filename: string, options?: IGeojsonVTOptions) => {
  const geoJSON = await loadGeoJSON(filename);
  return geojsonvt(
    geoJSON,
    Object.assign(
      {
        maxZoom: 22,
        tolerance: 3,
        extent: 4096,
        buffer: 64,
        debug: 0,
        generateId: true,
        indexMaxZoom: 4,
        indexMaxPoints: 100000,
        solidChildren: false,
      } as IGeojsonVTOptions,
      options
    )
  );
};
