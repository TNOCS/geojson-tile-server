# GeoJSON-tile-server

A simple tile service, that takes one or more GeoJSON files and offers them as slippy maps.

For example, if you have a local `data` folder containing two GeoJSON files (`layer1.geojson` and `layer2.geojson`), you can access the tiles at [http://localhost:8123/layer1/z/x/y.geojson](http://localhost:8123/layer1/z/x/y.geojson) and [http://localhost:8123/layer2/z/x/y.geojson](http://localhost:8123/layer2/z/x/y.geojson), where `z = zoom`, `x` and `y` need to be replaced by some sensible value based on the bounding box of your dataset.

If you are not sure what appropriate values are, have a look [here](http://www.maptiler.org/google-maps-coordinates-tile-bounds-projection).

Besides publishing the GeoJSON tiles, you can also retrieve the protobuf encoded vector tiles by replacing the `geojson` extension with `mvt`, e.g. [http://localhost:8123/layer1/z/x/y.mvt](http://localhost:8123/layer1/z/x/y.mvt).

## Installation

Either run it standalone, or get the source.

### Standalone

```console
npm i -g geojson-tile-server
```

### Source

```bash
git clone https://github.com/TNOCS/geojson-tile-server.git
cd geojson-tile-server
npm i
npm start
```

The source contains a small dataset containing some building contours in Amersfoort, The Netherlands. You can test that it is working by going to:

- [GeoJSON example](http://localhost:8123/Amersfoort.min/15/16876/10800.geojson)
- [VT example](http://localhost:8123/Amersfoort.min/15/16876/10800.vt)
- [MVT playground on flems.io](https://flems.io/#0=N4IgzgpgNhDGAuEAmIBcIB0ALeBbKIANCAGYCWMYaA2qAHYCGuEamO+RIsA9nYn6wA8AQgAiAeQDCAFQCaABQCiAAnZQAfAB06gtVrrLluiAyT7Dhwc3gNlsLAwBOkeAF5NIAK7wSAWgAcHsoA9OYWgvBk8DDqAIJISMq28FhkjokADk7wAJ7KAG5w8NyOypEwymDcno6wEILBkdEQYZbWtozM7iD5ZBAA7hkl8EE8fBB83WR0UWQMUL5gsPMQrgCMhLgMAB5kuJ64i8sw64SekI5H8wwARid03EGh2hZGS45kGfCVtd048BkwKhgsEGBkyBhyhAwBgthkbtxthgeLhgnCEdtfABzBYAKzAwXyawwAAZSWiwRjsVAMPiPOoGu9PvBWkYoNMANaqRwQEh-eAAoEgsEQqEw9GI5HcVESzE43z4wnEskkinwxHU5FgMBBHlQbpgXKULAQCAjEAhVmCQ05GIvV7KBFIPLAe0O5RbRxY6aoZQkgDcbodWQS0yxvoDQcMAF8o8oAMRw5Sugzu5RDMCzXi+25VKDeCCB1Pu4oZCNFtOO7gC6XluOGfpkJApX1rEkkgCkFYdseLRmCNrtqYaJtMYUETpyVqQZHyyib3Th9IaM-yVqZX1ZhllOIwDFgdW10m4HImylchgA5LJxABVABKvlikkkigAym-fNJxABpRQAOUvbtXnyJwPTBc9lDoAZwPVbZdwAWTBAAKFNKzGGxpggRxfUvOFL0IetKiNCBcNlYEBxIglZWCdksRwXwiRJAiiIAL24WtlDWAA2Qi+1eOpxhw5RqAAVgwABmABOAAmHjRMIZRRJkjA1lE7ipIAdhkgBdPj3WjABKIs4zhDBeGQy8oG4UwCOUEhPDoBAyAswzkyIszTCQAAZBgcmw5CiMMNDKwsJsyJFKAoCcHIWP4tNcgyUjlCsrC4tCiwqhqOpfRCjLDDFX1qEvf4yxBazjiwbhDVQfw1hkiTgliZhnBIDjHHgWFpmCYBWOjHrtn64AcmjWF8ngS89KCh1EuSy9CgQEp0vy7cdnYziZJk-T8ujbaMsvLLaggXxov8xxL1w+YoGWjLTuqeBcum15Uug3xlgyC6Uscao6CQG78pe47cW4aZPsvb7HL+vbQt2p70wYaYHvc+LK0B3xuCyWAoliiMMF4uGr3ZV6eGs87cK9G5kNEiTFLWTSFK4kkpMM-79qJ47G2bLBPq2uHYZRix+f2-oGEQRwRZyE7bmgS8iOMuMjJM+LPISSReHgb6oGQ6D+lgjFd3-BheixUWXLoNW+E15DDPlvtGVgD5N3tBpJ30Ec8A0bROEgGBnN4Kh0DWfxUE0kBdvoJgWHQWkqGIDCJngVgw8ICPmFYLVY64dWE6T6MdOjIA): You need to insert your own [Mapbox GL access key](https://account.mapbox.com) in order to make this work.

## Usage

To start the development service, run:

```bash
npm start
```

Or if you've installed it globally, run `geojson-tile-server`, which by default serves the './data' folder with the GeoJSON files, and the `./public` folder with static files.

Optionally, you can specify the PORT (default `8123`), DATA (default `./data`), and PUBLIC_FOLDER (default `./public`) folder in your environment, in which case those values will be used instead.

## Note

For another example of a Mapbox-based service, see [here](http://bl.ocks.org/jgravois/51e2b30e3d6cf6c00f06b263a29108a2).
