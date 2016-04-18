"use strict";

const Blocks = require('../blocks/index');
const BLOCKS = Blocks.BLOCKS;

const OAK_MIN_HEIGHT = 4;
const OAK_MAX_HEIGHT = 14;
const OAK_BASE_MIN_RATIO = 0.1;
const OAK_BASE_MAX_RATIO = 0.7;
const OAK_LEAF_RATE = 0.5;
const OAK_LEAF_SIZE = 2;
const OAK_LOG_VALUE = BLOCKS['log_big_oak'];
const OAK_LEAVES_VALUE = BLOCKS['leaves_big_oak_plains'];

const OAK_DIRECTIONS = (function() {
  var result = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const numMatches = +(x === y) + +(y === z) + +(x === z);
        if (numMatches === 1) {
          result.push({ x: x, y: y, z: z });
        }
      }
    }
  }
  return result;
})();

const floor = Math.floor;
const sqrt = Math.sqrt;

const TREES = [
  // oak
  function(opts) {
    const position = opts.position;
    const x = position[0];
    const y = position[1];
    const z = position[2];
    const typeNoise = opts.typeNoise;
    const heightNoise = opts.heightNoise;
    const baseNoise = opts.baseNoise;
    const trunkNoise = opts.trunkNoise;
    const leafNoise = opts.leafNoise;
    const onPoint = opts.onPoint;
    const voxelUtils = opts.voxelUtils;

    const heightNoiseN = heightNoise.in2D(x, z);
    const height = OAK_MIN_HEIGHT + (heightNoiseN * (OAK_MAX_HEIGHT - OAK_MIN_HEIGHT));
    const baseNoiseN = baseNoise.in2D(x, z);
    const base = height * (OAK_BASE_MIN_RATIO + (baseNoiseN * (OAK_BASE_MAX_RATIO - OAK_BASE_MIN_RATIO)));

    function leafPoints(fn) {
      for (let j = -OAK_LEAF_SIZE; j <= OAK_LEAF_SIZE; j++) {
        for (let k = -OAK_LEAF_SIZE; k <= OAK_LEAF_SIZE; k++) {
          if (j === 0 && k === 0) continue;
          fn(j, k);
        }
      }
    }

    for (let i = 0; i < height; i++) {
      let yi = y + i;
      onPoint(x, yi, z, OAK_LOG_VALUE);

      if (i >= base) {
        const leafSets = {};
        leafPoints((j, k) => {
          const xi = x + j;
          const zi = z + k;

          const leafN = leafNoise.in3D(xi, yi, zi);
          const leafDistance = sqrt(j * j + k * k);
          const leafProbability = OAK_LEAF_RATE - ((leafDistance - 1) / (OAK_LEAF_SIZE - 1)) * OAK_LEAF_RATE;
          if (leafN < leafProbability) {
            const idx = voxelUtils.getIndex(xi, yi, zi);
            leafSets[idx] = true;
          }
        });
        leafPoints((j, k) => {
          const xi = x + j;
          const zi = z + k;

          if (OAK_DIRECTIONS.some(function(d) {
            const idx = voxelUtils.getIndex(xi + d.x, yi + d.y, zi + d.z);
            return !!leafSets[idx];
          })) {
            onPoint(xi, yi, zi, LEAVES_VALUE);
          }
        });
      }
    }

    const snappedHeight = floor(height);
    const yi = y + snappedHeight;
    const tipTreeLeafN = leafNoise.in3D(x, yi, z);
    if (tipTreeLeafN < OAK_LEAF_RATE) {
      onPoint(x, yi, z, LEAVES_VALUE);
    }
  },
];

function make(opts) {
  const position = opts.position;
  const x = position[0];
  const z = position[2];
  const typeNoise = opts.typeNoise;

  const typeNoiseN = typeNoise.in2D(x, z);
  const type = floor(typeNoiseN * TREES.length);
  const treeFn = TREES[type];
  treeFn(opts);
}

const api = {
  TREES,
  make,
};

module.exports = api;
