const constants = require('../../constants/index');

export const DEFAULT_SEED = 'kazmer';

export const FRAME_RATE = 60;
export const WORLD_TICK_RATE = 10;

export const CHUNK_SIZE = constants.CHUNK_SIZE;
export const CHUNK_DISTANCE = 3;

export const INITIAL_POSITION = [0, 32, 0];
export const GRAVITY = [0, -0.0000036, 0];

export const MENU_TIME = 0.2;

export const FACE_VERTICES = 6;
export const MATERIAL_FRAMES = constants.MATERIAL_FRAMES;
export const PARTICLE_FRAMES = 160;
export const FRAME_UV_ATTRIBUTE_SIZE = 4;
export const FRAME_UVS_PER_ATTRIBUTE = FRAME_UV_ATTRIBUTE_SIZE / 2;
export const FRAME_UV_ATTRIBUTES = MATERIAL_FRAMES * 2 / FRAME_UV_ATTRIBUTE_SIZE;
export const FRAME_UV_ATTRIBUTE_SIZE_PER_FACE = FACE_VERTICES * MATERIAL_FRAMES * 2;
export const FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME = FRAME_UV_ATTRIBUTE_SIZE_PER_FACE / FRAME_UV_ATTRIBUTES;

export const NUM_WORKERS = 4;

export const UI_MODES = {
  WORLD: 'world',
  EDITOR: 'editor'
};
