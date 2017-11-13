declare module 'vt-pbf' {
  const vtpbf: {
    fromGeojsonVt: (layer: { [key: string]: any }) => Buffer;
  };
  export = vtpbf;
}
