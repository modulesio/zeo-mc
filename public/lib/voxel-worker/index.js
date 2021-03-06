import * as voxelAsync from '../voxel-async/index';

console = {
  log: (...args) => {
    let s = '';
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (s) {
        s += ' ';
      }
      if (typeof arg === 'string') {
        s += arg;
      } else if (arg instanceof Error) {
        s += arg.stack;
      } else {
        s += JSON.stringify(arg, null, 2);
      }
    }

    const msg = {
      type: 'log',
      log: s
    };
    postMessage(msg);
  }
};

onmessage = reqMsg => {
  function done(error, returnValue) {
    const type = 'response';
    if (!error) {
      const {result, transfers} = returnValue;
      const res = {
        type,
        error: null,
        result
      };
      postMessage(res, transfers);
    } else {
      const res = {
        type,
        error,
        result: null
      };
      postMessage(res);
    }
  }

  _tryCatch(() => {
    const {data: req} = reqMsg;
    const {type} = req;
    if (type === 'request') {
      const {method, args} = req;

      switch (method) {
        case 'init': return init(args[0] || null);
        case 'generate': return generate(args[0] || null);
        default: throw new Error('ENOENT');
      }
    }
  }, done);
};

function init(opts) {
  const result = voxelAsync.init(opts);
  return {result};
}

function generate(position) {
  const chunks = voxelAsync.generateSync(position);
  const {voxels, metadata, dims} = chunks;
  const {_cachedBlockMesh, _cachedBlockModelMesh, _cachedPlaneMesh} = dims;

  const result = chunks;
  const transfers = [
    voxels.buffer,
    metadata.buffer,
    _cachedBlockMesh.vertices.buffer,
    _cachedBlockMesh.normals.buffer,
    _cachedBlockMesh.frameUvs.buffer,
    _cachedBlockModelMesh.vertices.buffer,
    _cachedBlockModelMesh.normals.buffer,
    _cachedBlockModelMesh.faceUvs.buffer,
    _cachedPlaneMesh.vertices.buffer,
    _cachedPlaneMesh.normals.buffer,
    _cachedPlaneMesh.frameUvs.buffer,
  ];
  return {result, transfers};
}

function _tryCatch(fn, cb) {
  let result, error = null;
  try {
    result = fn();
  } catch(err) {
    error = err;
  }
  if (!error) {
    cb(null, result);
  } else {
    if (error instanceof Error) {
      error = error.stack;
    }
    cb(error);
  }
}
