declare module 'vt-pbf' {
  const vtpbf: {
    fromGeojsonVt: (layer: { [key: string]: any }) => Buffer;
  };
  export = vtpbf;
}

declare module '*.json' {
  const foo: {
    name: string;
    version: string;
    author: string;
    license: string;
    description: string;
  };
  export = foo;
}