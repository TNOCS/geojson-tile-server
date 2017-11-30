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
  return fs.readdirSync(folder).map(f => path.join(folder, f)).filter(f => {
    const ext = path.extname(f);
    return ext && (ext.toLowerCase() === '.geojson' || ext.toLowerCase() === '.json');
  });
};

/**
 * Create a tile index using geojson-vt
 *
 * @param {string} filename
 * @returns
 */
export const createTileIndex = async (filename: string) => {
  const geoJSON = await loadGeoJSON(filename);
  return geojsonvt(geoJSON, {
    /** max zoom to preserve detail on; can't be higher than 24 */
    maxZoom: 19,
    /** simplification tolerance (higher means simpler) */
    tolerance: 3,
    /** tile extent (both width and height) */
    extent: 4096,
    /** tile buffer on each side */
    buffer: 64,
    /** logging level (0 to disable, 1 or 2) */
    debug: 0,
    /** max zoom in the initial tile index */
    indexMaxZoom: 4,
    /** max number of points per tile in the index */
    indexMaxPoints: 100000,
    /** whether to include solid tile children in the index */
    solidChildren: false
  });
};
