"use strict";

const BLOCK_MODELS = require('./block-models.json');

const BLOCK_MODEL_INDEX = (() => {
  const result = Array(Object.keys(BLOCK_MODELS).length);
  for (let k in BLOCK_MODELS) {
    const blockModel = BLOCK_MODELS[k];
    const {index} = blockModel;
    result[index] = k;
  }
  return result;
})();

const api = {};

api.BLOCK_MODELS = BLOCK_MODELS;

api.BLOCK_MODEL_INDEX = BLOCK_MODEL_INDEX;

module.exports = api;
