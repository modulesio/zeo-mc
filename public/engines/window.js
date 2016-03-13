import Immutable from 'immutable';

import Engines from './index';
const {Engine} = Engines;

class WindowEngine extends Engine {
  init() {
    return {
      'window': _updateWindowState(this.getState('window'))
    };
  }

  initWindow() {
    this.updateState('window', _syncWindow);
  }

  listen() {
    const $window = $(window);
    $window.on('resize', () => {
      this.updateState('window', _updateWindowState);
    });

  }
}

function _updateWindowState(oldState) {
  const $window = $(window);
  const width = $window.width();
  const height = $window.height();
  const pixelRatio = window.devicePixelRatio;
  const pathname = window.location.pathname;

  return oldState
    .set('width', width)
    .set('height', height)
    .set('pixelRatio', pixelRatio)
    .set('pathname', pathname);
}

module.exports = WindowEngine;
