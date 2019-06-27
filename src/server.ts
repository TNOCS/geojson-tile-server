import * as path from 'path';
import * as express from 'express';
import * as cors from 'cors';
import * as vtpbf from 'vt-pbf';
import { Request, Response } from 'express';
import { createTileIndex, findGeojsonFilesInFolder } from './utils';
import { ICommandOptions } from './cli';
import { IVectorTile, toFeatureCollection } from './vt2geojson';

/** GeojsonVT extent option */
const extent = 4096;

const emptyResponse = { tile: undefined, x: 0, y: 0, z: 0 };

const startService = async (filenames: string | string[], options: ICommandOptions) => {
  if (typeof filenames === 'string') {
    filenames = [filenames];
  }

  const tileIndexes: { [key: string]: any } = {};
  let countFiles = filenames.length;
  filenames.forEach(async f => {
    const layerName = path.basename(f).replace(path.extname(f), '');
    console.log(`Processing layer ${layerName}...`);
    const tileIndex = await createTileIndex(f, {
      extent,
      maxZoom: options.maxZoom,
      generateId: options.generatedId,
      promoteId: options.promoteId,
      buffer: options.buffer,
    });
    tileIndexes[layerName] = tileIndex;
    countFiles--;
    if (countFiles <= 0) {
      console.log('Finished loading the layers.');
    }
  });

  const httpPort = options.port || process.env.PORT || 8123;
  const app = express();
  app.use(cors());
  app.use(express.static(process.env.PUBLIC_FOLDER || options.static));

  const extensions = ['geojson', 'mvt (for MapBox GL, use source-layer: "all")', 'vt'];

  const ulList = (l: string) => '<ul>' + extensions.map(ext => `<li>${l}/{z}/{x}/{y}.${ext}</li>`).join('\n') + '</ul>';

  const send404 = (res: Response) => {
    const availableLayers = Object.keys(tileIndexes);
    const list = availableLayers
      .sort()
      .map(l => `<ol><li>${ulList(l)}</li></ol>`)
      .join('\n');
    res.status(404).send(
      `<h1>Layer not found</h1>
        <p>Available layers are:
        ${list}
        </p>`
    );
  };

  const getTile = (req: Request, res: Response) => {
    const layer = req.params['layer'];
    if (!tileIndexes.hasOwnProperty(layer)) {
      send404(res);
      return emptyResponse;
    }
    const z = +req.params['z'];
    const x = +req.params['x'];
    const y = +req.params['y'];
    const tile = tileIndexes[layer].getTile(z, x, y);
    if (!tile || !tile.features) {
      res.json({});
    }
    return { tile, x, y, z };
  };

  app.get('/', (_, res) => send404(res));

  app.get('/:layer/:z/:x/:y.geojson', (req, res) => {
    const { tile, x, y, z } = getTile(req, res);
    if (!tile || !tile.features) {
      return;
    }
    const vectorTiles = tile.features as IVectorTile[];
    res.json(toFeatureCollection(vectorTiles, x, y, z, extent));
  });

  app.get('/:layer/:z/:x/:y.vt', (req, res) => {
    const { tile } = getTile(req, res);
    if (!tile || !tile.features) {
      return;
    }
    const vectorTiles = tile.features as IVectorTile[];
    res.json(vectorTiles);
  });

  app.get('/:layer/:z/:x/:y.mvt', (req, res) => {
    const { tile } = getTile(req, res);
    if (!tile || !tile.features) {
      return;
    }
    /** Notice that I set the source-layer (for Mapbox GL) to all */
    res.send(Buffer.from(vtpbf.fromGeojsonVt({ all: tile })));
  });

  app.listen(httpPort, () => console.info(`Tile service is listening on port ${httpPort}`));
};

export const createService = (options: ICommandOptions) => {
  const dataFolder = path.resolve(options.data || process.env.DATAFOLDER || './data');
  console.log(`Reading GeoJSON files from ${dataFolder}`);
  startService(findGeojsonFilesInFolder(dataFolder), options);
};
