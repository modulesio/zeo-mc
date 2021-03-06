"use strict";

const PlaneBase = require('./PlaneBase');
const constants = require('../../constants/index');
const BIOME_TEXTURES = constants.BIOME_TEXTURES;

const NAME = 'tallgrass';

const MATERIALS = [].concat([
  'reeds'
]).concat(
  BIOME_TEXTURES.map(biomeTexture => 'tallgrass_' + biomeTexture)
);

const SIZE = 1;

class PlaneTallgrass extends PlaneBase {
  constructor(p) {
    p = p || [];
    const p1 = p[0];

    super([], []);

    const materialIndex = p1;
    this.materials = MATERIALS[materialIndex];

    const offset = [0, 0, 16, 16];
    const position = [0, 0, 0];
    const dimensions = [SIZE, SIZE, 0];

    this.meshes = [
      {
        name: 'tallgrass1',
        offset: offset,
        position: position,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 1 / 4, 0]
      },
      {
        name: 'tallgrass2',
        offset: offset,
        position: position,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI * 3 / 4, 0]
      },
    ]
  }
}
PlaneTallgrass.NAME = 'tallgrass';
PlaneTallgrass.MATERIALS = MATERIALS;

module.exports = PlaneTallgrass;

// XXX
// var m; function go() {game.scene.remove(m); m = MODELS.make('tallgrass', [], [], game); game.scene.add(m); m.position.set(-20, 10, 10); }; go();
