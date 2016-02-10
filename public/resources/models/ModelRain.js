import ModelBase from './ModelBase';

const MAX_POSITION = -20;
const MIN_POSITION = 20;
const FALL_FREQUENCY = 0.5;

export default class ModelRain extends ModelBase {
  constructor([], [s1 = 0, s2 = 1] = []) {
    super([], [s1, s2]);

    const positionOffset = MAX_POSITION + (((s1 % FALL_FREQUENCY) / FALL_FREQUENCY) * (MIN_POSITION - MAX_POSITION));
    const position = [-5, positionOffset, 0];
    const dimensions = [10, 10, 0]

    this.texture = 'environment/rain';
    this.meshes = [
      {
        name: 'rain1',
        offset: [0, 0 + 64 * 0, 64, 0 + 64 * 1],
        position: position,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI / 2 * 0, 0]
      },
      {
        name: 'rain2',
        offset: [0, 0 + 64 * 1, 64, 0 + 64 * 2],
        position: position,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI / 4 * 1, 0]
      },
      {
        name: 'rain3',
        offset: [0, 0 + 64 * 2, 64, 0 + 64 * 3],
        position: position,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI / 2 * 2, 0]
      },
      {
        name: 'rain4',
        offset: [0, 0 + 64 * 3, 64, 0 + 64 * 4],
        position: position,
        dimensions: dimensions,
        rotationPoint: [0, 0, 0],
        rotation: [0, Math.PI / 2 * 3, 0]
      },
    ]
  }
}

// XXX
// var m,i=0; function go(i) {game.scene.remove(m); m = MODELS.rain(game, [], [i, 1]); game.scene.add(m); m.position.set(-20, 10, 10); }; setInterval(() => {go(i += (1 / 50))}, 50);