"use strict";

const events = require('events');
const EventEmitter = events.EventEmitter;

const React = require('react');
const ReactDomServer = require('react-dom/server');
const Immutable = require('immutable');

const NodeInstance = require('../node-instance');

class Worlds extends EventEmitter {
  constructor(opts) {
    super();

    this._worlds = Immutable.fromJS({
      worlds: []
    });
    this._worldsMap = Immutable.fromJS({});
    this._db = opts.db;

    this.init();
  }

  init() {
    const cb = err => {
      if (!err) {
        this.emit('ready');
      } else {
        this.emit('error', err);
      }
    };

    this._db.getWorlds().then(worlds => {
      if (worlds) {
        this._worlds = Immutable.fromJS(worlds);
      }
      _pender(this._worlds.get('worlds').toArray(), (id, pend) => {
        const world = new World({
          world: {
            id
          },
          db: this._db
        });
        world.load();
        world.on('ready', () => {
          this._worldsMap = this._worldsMap.set(world.getId(), world);

          pend();
        });
        world.on('error', err => {
          pend(err);
        });
      }, cb);
    }).catch(cb);
  }

  getWorld(id) {
    return this._worldsMap.get(id) || null;
  }

  createWorld(id, cb) {
    const world = new World({
      world: {
        id,
        nodes: []
      },
      db: this._db
    });

    this._db.setWorld(world.toJSON()).then(newWorld => {
      world._world = Immutable.fromJS(newWorld);

      const newWorlds = this._worlds.update('worlds', worlds => worlds.push(world.getId()));
      const newWorldsJson = Worlds.toJSON({
        _worlds: newWorlds
      });
      this._db.setWorlds(newWorldsJson).then(worlds => {
        this._worlds = Immutable.fromJS(worlds);
        this._worldsMap = this._worldsMap.set(world.getId(), world);

        cb(null, world);
      }).catch(cb);
    }).catch(cb);
  }

  destroy(cb) {
    this._worldsMap.forEach(world => {
      world._nodesMap.forEach(node => {
        node.destroy();
      });
    });

    process.nextTick(cb);
  }

  toJSON() {
    return Worlds.toJSON(this);
  }
}
Worlds.toJSON = worlds => {
  return worlds._worlds.toJSON();
};

class World extends EventEmitter {
  constructor(opts) {
    super();

    this._world = Immutable.fromJS(opts.world);
    this._nodesMap = Immutable.fromJS({});
    this._db = opts.db;
  }

  getId() {
    return this._world.get('id');
  }

  load() {
    const cb = err => {
      if (!err) {
        this.emit('ready');
      } else {
        this.emit('error', err);
      }
    };

    this._db.getWorld(this.getId()).then(world => {
      this._world = Immutable.fromJS(world);

      const nodesToLoad = world.nodes;
      _pender(nodesToLoad, (id, pend) => {
        const node = new Node({
          node: {
            id
          },
          world: this,
          db: this._db
        });
        node.load();
        node.on('ready', () => {
          this._world = this._world.update('nodes', nodes => nodes.push(node));
          this._nodesMap = this._nodesMap.set(node.getId(), node);

          pend();
        });
        node.on('error', err => {
          pend(err);
        });
      }, cb);
    }).catch(cb);
  }

  getNode(id) {
    return this._nodesMap.get(id) || null;
  }

  getProps() {
    return {
      world: this.getId()
    };
  }

  createNode(opts, cb) {
    const id = opts.id;
    const src = opts.src;
    const state = opts.state;

    const node = new Node({
      node: {
        id,
        src,
        state
      },
      world: this,
      db: this._db
    });
    this._db.setNode(node.toJSON()).then(newNode => {
      node._node = Immutable.fromJS(newNode);
      node._oldNode = node._node;

      const newWorld = this._world.update('nodes', nodes => nodes.push(id));
      const newWorldJson = World.toJSON({
        _world: newWorld
      });
      this._db.setWorld(newWorldJson).then(world => {
        this._world = Immutable.fromJS(world);
        this._nodesMap = this._nodesMap.set(node.getId(), node);

        node.boot();

        cb(null, node);
      }).catch(cb);
    }).catch(cb);
  }

  destroyNode(id) {
    // XXX implement this
  }

  toJSON() {
    return World.toJSON(this);
  }
}
World.toJSON = world => {
  return world._world.toJSON();
};
Worlds.World = World;

class Node extends EventEmitter {
  constructor(opts) {
    super();

    this._node = Immutable.fromJS(opts.node);
    this._world = opts.world;
    this._db = opts.db;

    this._oldNode = this._node;

    this.save = this.makeSave();
  }

  getId() {
    return this._node.get('id');
  }

  load() {
    const cb = err => {
      if (!err) {
        this.emit('ready');
      } else {
        this.emit('error', err);
      }
    };

    this._db.getNode(this.getId()).then(node => {
      this._node = Immutable.fromJS(node);
      this._oldNode = this._node;

      this.boot();

      cb();
    }).catch(cb);
  }

  makeSave() {
    return _single(() => {
      const newNode = this._node;
      const oldNode = this._oldNode;

      if (!Immutable.is(newNode, oldNode)) {
        return new Promise((accept, reject) => {
          this._db.setNode(newJSON).then(function() {
            this._oldNode = newNode;

            accept.apply(this, arguments);
          }).catch(reject);
        });
      } else {
        return Promise.resolve();
      }
    });
  }

  boot() {
    this._instance = new NodeInstance({
      src: this._node.get('src'),
      props: this._world.getProps(),
      state: this._node.get('state').toJS()
    });
    this._instance.on('render', element => {
      this._world.emit('render', {
        node: this.getId(),
        html: _renderElement(element)
      });
    });
    this._instance.on('update', state => {
      this._node.state = state;

      this.save();
    });
    this._instance.on('error', err => {
      this.emit('error', err);
    });
    this._instance.start();
  }

  unboot() {
    this._instance.kill();
    this._instance = null;
  }

  reboot() {
    this.unboot();
    this.boot();
  }

  destroy() {
    this.unboot();
    this.save.destroy();
  }

  setSrc(src) {
    this._node = this._node.set('src', src);

    this.reboot();
    this.save();
  }

  toJSON() {
    return Node.toJSON(this);
  }
}
Node.toJSON = node => {
  return node._node.toJSON();
};
Worlds.Node = Node;

function _pender(a, handler, cb) {
  let pending = a.length, error = null;
  function pend(err) {
    error = error || err;

    pending--;

    checkDone();
  }

  function checkDone() {
    if (pending === 0) {
      done();
    }
  }

  function done() {
    if (!error) {
      cb(error);
    } else {
      cb();
    }
  }

  a.forEach(e => {
    handler(e, pend);
  });

  if (pending === 0) {
    process.nextTick(cb);
  }
}

function _single(handler) {
  let running = false;
  let queue = [];

  function tryStart() {
    if (!running) {
      running = true;

      next();
    }
  }

  function next() {
    if (queue.length > 0) {
      const promise = queue.shift();
      promise.trigger();
    } else {
      running = false;
    }
  }

  const result = function() {
    const promise = new Promise(function(accept, reject) {
      promise.trigger = function() {
        handler().then(function(result) {
          accept(result);

          next();
        }).catch(function(error) {
          reject(error);

          next();
        });
      };

      tryStart();
    });

    queue.push(promise);

    return promise;
  };
  result.destroy = function() {
    queue = [];
  };
  return result;
}

function _renderElement(element) {
  if (element !== null) {
    return ReactDomServer.renderToStaticMarkup(_createElement(element));
  } else {
    return null;
  }
}
function _createElement(element) {
  return React.createElement(element.type, element.props, _createElementChildren(element.children));
}
function _createElementChildren(children) {
  if (typeof children === 'string') {
    return children;
  } else if (Array.isArray(children)) {
    return children.map(_createElement);
  } else {
    return null;
  }
}

module.exports = Worlds;