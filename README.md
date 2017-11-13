# geojson-tile-server

A simple tile service, that takes one or more GeoJSON files and offers them as slippy maps.

For example, if you have a local `data` folder containing two GeoJSON files (`layer1.geojson` and `layer2.geojson`), you can access the tiles at [http://localhost:8123/layer1/z/x/y.geojson](http://localhost:8123/layer1/z/x/y.geojson) and [http://localhost:8123/layer2/z/x/y.geojson](http://localhost:8123/layer2/z/x/y.geojson), where `z = zoom`, `x` and `y` need to be replaced by some sensible value based on the bounding box of your dataset. If you are not sure what appropriate values are, have a look [here](http://www.maptiler.org/google-maps-coordinates-tile-bounds-projection).



## Installation

Either run it standalone, or get the source.

### Standalone

```console
npm i -g geojson-tile-server
```

### Source
```console
git clone https://github.com/TNOCS/geojson-tile-server.git
cd geojson-tile-server
yarn
yarn build
```

## Usage

To start the development service, run:
```console
yarn start
```
Or if you've installed it globally, run `geojson-tile-server`, which by default serves the './data' folder with the GeoJSON files, and the `./public` folder with static files.

Optionally, you can specifiy the PORT (default `8123`), DATA (default `./data`), and PUBLIC_FOLDER (default `./public`) folder in your environment, in which case those values will be used instead.
