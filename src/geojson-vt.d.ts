// declare class GeojsonVtStatic {
//   constructor(geojson: string);
// }

declare module 'geojson-vt' {
  const geojsonvt: any;
  // const foo: GeojsonVtStatic; // Temp variable to reference Mapnik in local context
  // namespace rsvp {
  // 	export var Mapnik: typeof foo;
  // }
  // export = rsvp;
  export = geojsonvt;
}
