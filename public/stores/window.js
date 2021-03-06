import Immutable from 'immutable';

export default class Window extends Immutable.Record({
  width: 0,
  height: 0,
  devicePixelRatio: 1,
  pathname: '',
}) {}
