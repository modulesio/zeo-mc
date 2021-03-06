import Immutable from 'immutable';

import Engines from './index';
const {Engine} = Engines;

class Coords extends Immutable.Record({
  x: 0,
  y: 0,
}) {}

export default class MenuEngine extends Engine {
  static NAME = 'menu';

  toggleOpen() {
    this.updateState('menu', state => {
      const {open: oldOpen} = state;
      const newOpen = !oldOpen;
      const lastOpenTime = new Date();
      return state
        .set('open', newOpen)
        .set('lastOpenTime', lastOpenTime);
    });
  }

  selectTab(tab) {
    this.updateState('menu', state => state
      .set('tab', tab)
      .set('itemIndex', null));
  }

  selectItem(itemIndex) {
    this.updateState('menu', state => state
      .set('itemIndex', itemIndex));
  }

  startDrag({itemIndex, x, y}) {
    this.updateState('menu', state => state
      .set('dragItemIndex', itemIndex)
      .set('dragCoords', new Coords({x, y})));
  }

  updateDrag({x, y}) {
    this.updateState('menu', state => state
      .set('dragCoords', new Coords({x, y})));
  }

  endDrag() {
    this.updateState('menu', state => state
      .set('dragItemIndex', null)
      .set('dragCoords', null));
  }
}

module.exports = MenuEngine;
