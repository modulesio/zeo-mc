var resources = require('../../resources/index');
var BLOCKS = resources.BLOCKS;
var voxelFluidRenderer = require('../voxel-fluid-renderer/index');
var voxelAsync = require('../voxel-async/index');
var voxel = require('../voxel/index');

var Alea = require('alea');
var FastSimplexNoise = require('fast-simplex-noise');

var constants = require('../../constants/index');
var DEFAULT_SEED = constants.DEFAULT_SEED;
var CLOUD_VALUE = BLOCKS.BLOCKS['water_still_0'];

var round = Math.round;
var random = Math.random;

function Clouds(opts) {
  if (!(this instanceof Clouds)) return new Clouds(opts || {});
  if (opts.THREE) opts = {game:opts};
  this.game = opts.game;
  this.high = opts.high || 10;
  this.distance = opts.distance || 300;
  this.size = opts.size || 16;
  this.many = opts.many || 100;
  this.speed = opts.speed || 0.01;
  this.material = opts.material || new this.game.THREE.MeshBasicMaterial({
    shading: this.game.THREE.FlatShading,
    fog: false,
    transparent: true,
    opacity: 0.5,
  });
  this.clouds = [];
  this.generator = (() => {
    var rng = new Alea(DEFAULT_SEED);
    var noise = new FastSimplexNoise({
      min: 0,
      max: 1,
      frequency: 0.05,
      octaves: 10,
      random: rng
    });
    var offset = Number.MAX_SAFE_INTEGER / 2;

    return (x, y, i) => {
      const noiseN = noise.in2D(x + (i * this.size) + offset, y + (i * this.size) + offset);
      if (noiseN > 0.5) {
        return CLOUD_VALUE;
      } else {
        return 0;
      }
    };
  })();
  for (var i = 0; i < this.many; i++) {
    this.generate(i);
  }
}
module.exports = Clouds;

Clouds.prototype.generate = function(i) {
  var game = this.game;
  var size = this.size;

  var data = voxel.generate([0, 0, 0], [size, 1, size], (x, y, z) => {
    return this.generator(x, z, i);
  });

  var cloud = voxelFluidRenderer(data, game.THREE);
  cloud.material = this.material;

  game.scene.add(cloud);

  this._position(cloud);

  this.clouds.push(cloud);
  return cloud;
};

Clouds.prototype.tick = function(dt) {
  var self = this;
  var player = self.game.controls.target().avatar.position;
  self.clouds.forEach(function(cloud) {
    cloud.position.z += self.speed * rand(1, 1.5);
    if (distanceTo(cloud.position, player) > self.distance) {
      self._position(cloud);
    }
  });
};

Clouds.prototype._position = function(cloud) {
  var player = this.game.controls.target().avatar.position;
  var x = rand(player.x - this.distance, player.x + this.distance);
  var y = player.y + this.high + rand(0, this.high * 2);
  var z = rand(player.z - this.distance, player.z + this.distance);
  cloud.position.set(x, y, z);
};

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function distanceTo(a, b) {
  if (!Array.isArray(a)) a = [a.x, a.y, a.z];
  if (!Array.isArray(b)) b = [b.x, b.y, b.z];
  var dx = b[0] - a[0];
  var dy = b[1] - a[1];
  var dz = b[2] - a[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
