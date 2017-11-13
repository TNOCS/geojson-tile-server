import * as path from 'path';
import * as express from 'express';
import * as cors from 'cors';
import * as geojsonvt from 'geojson-vt';
import * as vtpbf from 'vt-pbf';

import { createTileIndex, findGeojsonFilesInFolder } from './utils';

const startService = async (filenames: string | string[]) => {
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

  const httpPort = process.env.PORT || 8123;
  const app = express();
  app.use(cors());
  app.use(express.static(process.env.PUBLIC_FOLDER || './public'));

  app.get('/:layer/:z/:x/:y.geojson', (req, res) => {
    const layer = req.params['layer'];
    if (!tileIndexes.hasOwnProperty(layer)) {
      const availableLayers = Object.keys(tileIndexes).join(', ');
      res.status(404).send(`The layer ${layer} is unknown: available layers are ${availableLayers}.`);
    } else {
      const z = +req.params['z'];
      const x = +req.params['x'];
      const y = +req.params['y'];
      res.json(tileIndexes[layer].getTile(z, x, y).features);
    }
  });

  app.get('/:layer/:z/:x/:y.mvt', (req, res) => {
    const layer = req.params['layer'];
    if (!tileIndexes.hasOwnProperty(layer)) {
      const availableLayers = Object.keys(tileIndexes).join(', ');
      res.status(404).send(`The layer ${layer} is unknown: available layers are ${availableLayers}.`);
    } else {
      const z = +req.params['z'];
      const x = +req.params['x'];
      const y = +req.params['y'];
      const buff = vtpbf.fromGeojsonVt({ 'geojsonLayer': tileIndexes[layer].getTile(z, x, y) });
      res.send(buff);
    }
  });

  app.listen(httpPort, () => console.info(`Tile service is listening on port ${httpPort}`));
};

const dataFolder = path.resolve(process.env.DATAFOLDER || './data');
console.log(`Reading GeoJSON files from ${dataFolder}`);
startService(findGeojsonFilesInFolder(dataFolder));
