import { IVectorTile, toFeatureCollection } from './vt2geojson';
import * as path from 'path';
import * as express from 'express';
import { Request, Response } from 'express';
import * as cors from 'cors';
import * as geojsonvt from 'geojson-vt';
import * as vtpbf from 'vt-pbf';
import { createTileIndex, findGeojsonFilesInFolder } from './utils';
import { ICommandOptions } from './cli';
import { GeometryObject } from 'geojson';

const startService = async (filenames: string | string[], options: ICommandOptions) => {
  if (typeof filenames === 'string') { filenames = [filenames]; }

  const tileIndexes: { [key: string]: any } = {};
  let countFiles = filenames.length;
  filenames.forEach(async f => {
    const layerName = path.basename(f).replace(path.extname(f), '');
    console.log(`Processing layer ${layerName}...`);
    const tileIndex = await createTileIndex(f);
    tileIndexes[layerName] = tileIndex;
    countFiles--;
    if (countFiles <= 0) { console.log('Finished loading the layers.'); }
  });

  const httpPort = options.port || process.env.PORT || 8123;
  const app = express();
  app.use(cors());
  app.use(express.static(process.env.PUBLIC_FOLDER || './public'));

  const send404 = (res: Response) => {
    const availableLayers = Object.keys(tileIndexes).join(', ');
    res.status(404).send(`Available layers are ${availableLayers}. Please create a query using LAYERNAME/z/x/y.ext, where ext is geojson, vt or mvt.`);
  };

  app.get('/', (req, res) => send404(res));

  app.get('/:layer/:z/:x/:y.geojson', (req, res) => {
    const layer = req.params['layer'];
    if (!tileIndexes.hasOwnProperty(layer)) { send404(res); }
    const z = +req.params['z'];
    const x = +req.params['x'];
    const y = +req.params['y'];
    const tile = tileIndexes[layer].getTile(z, x, y);
    if (!tile || !tile.features) { return res.json({}); }
    const vectorTiles = tile.features as IVectorTile[];
    res.json(toFeatureCollection(vectorTiles, x, y, z));
  });

  app.get('/:layer/:z/:x/:y.vt', (req, res) => {
    const layer = req.params['layer'];
    if (!tileIndexes.hasOwnProperty(layer)) { send404(res); }
    const z = +req.params['z'];
    const x = +req.params['x'];
    const y = +req.params['y'];
    const tile = tileIndexes[layer].getTile(z, x, y);
    if (!tile || !tile.features) { return res.json({}); }
    const vectorTiles = tile.features as IVectorTile[];
    res.json(vectorTiles);
  });

  app.get('/:layer/:z/:x/:y.mvt', (req, res) => {
    const layer = req.params['layer'];
    if (!tileIndexes.hasOwnProperty(layer)) { send404(res); }
    const z = +req.params['z'];
    const x = +req.params['x'];
    const y = +req.params['y'];
    const tile = tileIndexes[layer].getTile(z, x, y);
    if (!tile || !tile.features) { return res.json({}); }
    const buff = vtpbf.fromGeojsonVt({ 'geojsonLayer': tile });
    res.send(buff);
  });

  app.listen(httpPort, () => console.info(`Tile service is listening on port ${httpPort}`));
};

export const createService = (options: ICommandOptions) => {
  const dataFolder = path.resolve(options.data || process.env.DATAFOLDER || './data');
  console.log(`Reading GeoJSON files from ${dataFolder}`);
  startService(findGeojsonFilesInFolder(dataFolder), options);
};
