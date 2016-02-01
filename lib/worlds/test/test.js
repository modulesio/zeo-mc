var path = require('path');

var config = require('../../config');
var Db = require('../../db');
var jsUtils = require('../../js-utils');

var Worlds = require('../');

require('should');

var TEST_DATABASE_PATH = path.join('/', 'tmp', 'worlds-test');
var TEST_WORLD_ID = 'test-world';

var TEST_NODE_ID = 'test-world-node';
var TEST_NODE_SRC = `
  export function render() {
    return <div className={this.state.className}>{this.state.value}</div>;
  };
`;
var TEST_NODE_SRC2 = `
  export function render() {
    return <div className={this.state.className + "2"}>{this.state.value + "2"}</div>;
  };
`;
var TEST_NODE_SRC3 = `
  export function init() {
    return {value: 0};
  };
  export function update(state) {
    return {value: state.value + 1};
  };
  export function render() {
    return <div>{'Counter: ' + String(this.state.value)}</div>;
  };
`;
var TEST_NODE_STATE = {
  value: 'lol',
  className: 'zol'
};
var TEST_NODE_STATE3 = {};

var db = new Db(TEST_DATABASE_PATH);
function _resetDb(cb) {
  function createDb(cb) {
    db = new Db(TEST_DATABASE_PATH);

    process.nextTick(cb);
  }

  function destroyDb(cb) {
    function done() {
      db = null;

      cb();
    }

    db.destroy().then(done).catch(done);
  }

  destroyDb(function() {
    createDb(cb);
  });
}
beforeEach(_resetDb);

function _makeWorlds(cb) {
  var worlds = new Worlds({
    db: db
  });
  worlds.on('ready', function() {
    cb(null, worlds);
  });
  worlds.on('error', function(err) {
    cb(err);
  });
}

describe('basic', function() {
  it('create world + node', function(cb) {
    _makeWorlds(jsUtils.ok(cb, function(worlds) {
      worlds.createWorld(TEST_WORLD_ID, jsUtils.ok(cb, function(world) {
        world.should.be.an.instanceOf(Worlds.World);
        world.getId().should.equal(TEST_WORLD_ID);

        world.createNode({
          id: TEST_NODE_ID,
          src: TEST_NODE_SRC,
          state: TEST_NODE_STATE
        }, jsUtils.ok(cb, function(node) {
          node.should.be.an.instanceOf(Worlds.Node);
          node.getId().should.equal(TEST_NODE_ID);

          world.on('error', err => {
            console.warn(err);
          });

          worlds.destroy(jsUtils.ok(cb, function() {
            _makeWorlds(jsUtils.ok(cb, function(worlds2) {
              var world = worlds2.getWorld(TEST_WORLD_ID);
              world.should.be.an.instanceOf(Worlds.World);
              world.getId().should.equal(TEST_WORLD_ID);

              var node = world.getNode(TEST_NODE_ID);
              node.should.be.an.instanceOf(Worlds.Node);
              node.getId().should.equal(TEST_NODE_ID);

              node.on('error', err => {
                console.warn(err);
              });

              cb();
            }));
          }));
        }));
      }));
    }));
  });

  it('render node', function(cb) {
    _makeWorlds(jsUtils.ok(cb, function(worlds) {
      worlds.createWorld(TEST_WORLD_ID, jsUtils.ok(cb, function(world) {
        world.createNode({
          id: TEST_NODE_ID,
          src: TEST_NODE_SRC,
          state: TEST_NODE_STATE
        }, jsUtils.ok(cb, function(node) {
          node.should.be.an.instanceOf(Worlds.Node);
          node.getId().should.equal(TEST_NODE_ID);

          node.on('error', err => {
            console.warn(err);
          });
        }));

        world.on('render', function(o) {
          o.should.deepEqual({
            node: TEST_NODE_ID,
            html: '<div class="zol">lol</div>'
          });

          cb();
        });
      }));
    }));
  });

  it('set node src', function(cb) {
    _makeWorlds(jsUtils.ok(cb, function(worlds) {
      worlds.createWorld(TEST_WORLD_ID, jsUtils.ok(cb, function(world) {
        world.createNode({
          id: TEST_NODE_ID,
          src: TEST_NODE_SRC,
          state: TEST_NODE_STATE
        }, jsUtils.ok(cb, function(node) {
          node.should.be.an.instanceOf(Worlds.Node);
          node.getId().should.equal(TEST_NODE_ID);

          node.on('error', err => {
            console.warn(err);
          });

          world.once('render', function(o) {
            o.should.deepEqual({
              node: TEST_NODE_ID,
              html: '<div class="zol">lol</div>'
            });

            node.setSrc(TEST_NODE_SRC2);

            world.once('render', function(o) {
              o.should.deepEqual({
                node: TEST_NODE_ID,
                html: '<div class="zol2">lol2</div>'
              });

              cb();
            });
          });
        }));
      }));
    }));
  });

  it('live updating node', function(cb) {
    _makeWorlds(jsUtils.ok(cb, function(worlds) {
      worlds.createWorld(TEST_WORLD_ID, jsUtils.ok(cb, function(world) {
        world.createNode({
          id: TEST_NODE_ID,
          src: TEST_NODE_SRC3,
          state: TEST_NODE_STATE3
        }, jsUtils.ok(cb, function(node) {
          node.should.be.an.instanceOf(Worlds.Node);
          node.getId().should.equal(TEST_NODE_ID);

          node.on('error', err => {
            console.warn(err);
          });

          world.once('render', function(o) {
            o.should.deepEqual({
              node: TEST_NODE_ID,
              html: '<div>Counter: 0</div>'
            });

            world.once('render', function(o) {
              o.should.deepEqual({
                node: TEST_NODE_ID,
                html: '<div>Counter: 1</div>'
              });

              cb();
            });
          });
        }));
      }));
    }));
  });
});