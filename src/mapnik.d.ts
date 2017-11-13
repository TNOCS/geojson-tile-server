declare class VectorTileOptions {
  /**
   * Used to discard small polygons. If a value is greater than 0 it will trigger polygons with an area smaller than the value to be discarded. Measured in grid integers, not spherical mercator coordinates.
   *
   * @type {number}
   * @memberof VectorTileOptions
   */
  area_threshold?: number;
  /**
   * Simplification works to generalize geometries before encoding into vector tiles.simplification distance The simplify_distance value works in integer space over a 4096 pixel grid and uses the Douglas-Peucker algorithm.
   *
   * @type {number}
   * @memberof VectorTileOptions
   */
  simplify_distance?: number;
  /**
   * Ensure all geometry is valid according to OGC Simple definition
   *
   * @type {boolean}
   * @memberof VectorTileOptions
   */
  strictly_simple?: boolean;
  /**
   * union all multipolygons
   *
   * @type {boolean}
   * @memberof VectorTileOptions
   */
  multi_polygon_union?: boolean;
  /**
   * The fill type used in determining what are holes and what are outer rings. See the Clipper documentation to learn more about fill types.
   *
   * @type {Object}
   * @memberof VectorTileOptions
   */
  fill_type?: Object;
  /**
   * If true, don't assume winding order and ring order of polygons are correct according to the 2.0 Mapbox Vector Tile specification
   *
   * @type {boolean}
   * @memberof VectorTileOptions
   */
  process_all_rings?: boolean;
}

declare class VectorTileStatic {
  addGeoJSON(geojson: string, layerName: string, options: VectorTileOptions): void;
  /**
   *
   *
   * @param {(string | number)} layerName : Can be a zero-index integer representing a layer or the string keywords __array__ or __all__ to get all layers in the form of an array of GeoJSON FeatureCollections or in the form of a single GeoJSON FeatureCollection with all layers smooshed inside.
   * @param {(err: NodeJS.ErrnoException, geojson: string) => void} callback
   * @memberof VectorTileStatic
   */
  toGeoJSON(layerName: string | number, callback: (err: NodeJS.ErrnoException, geojson: string) => void): void;

  toGeoJSON(callback: (err: NodeJS.ErrnoException, geojson: string) => void): void;
}

declare namespace MapnikStatic {
  function VectorTile(z: number, x: number, y: number): VectorTileStatic;
}

declare module 'mapnik' {
  const foo: typeof MapnikStatic; // Temp variable to reference Mapnik in local context
  // namespace rsvp {
  // 	export var Mapnik: typeof foo;
  // }
  // export = rsvp;
  export = foo;
}
