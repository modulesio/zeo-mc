var funstance = require('funstance');
var EventEmitter = require('events').EventEmitter;

module.exports = function (game, opts) {
    if (!opts) opts = {};
    if (!opts.limit) opts.limit = function () { return false };
    if (opts.yield === undefined) opts.yield = 4;
    if (typeof opts.yield !== 'function') {
        opts.yield = (function (y) {
            return function () { return y };
        })(opts.yield);
    }
    
    if (!opts.expire) opts.expire = {};
    if (typeof opts.expire === 'number') {
        opts.expire = { start : opts.expire, end : opts.expire };
    }
    if (!opts.expire.start) opts.expire.start = 15 * 1000;
    if (!opts.expire.end) opts.expire.end = 30 * 1000;
    if (!opts.power) opts.power = 1;
    
    game.on('collision', function (item) {
      if (!item._debris) return;
      if (opts.limit && opts.limit(item)) return;

      game.removeItem(item);
      item._collected = true;
      em.emit('collect', item);
    });
    
    var em = new EventEmitter;
    return funstance(em, function (pos) {
        var value = game.getBlock(pos);
        if (value === 0) return;
        game.setBlock(pos, 0);
        
        for (var i = 0; i < opts.yield(value); i++) {
            var item = createDebris(game, pos, value, opts.power);
            item = game.addItem(item);
            
            var time = opts.expire.start + Math.random() * (opts.expire.end - opts.expire.start);

            (function(item) {
              game.setTimeout(function() {
                game.removeItem(item);
                if (!item._collected) em.emit('expire', item);
              }, time);
            })(item);
        }
    });
}

function createDebris(game, pos, value, power) {
    var mesh = new game.THREE.Mesh(
      new game.THREE.CubeGeometry(1, 1, 1),
      // new game.THREE.MeshBasicMaterial({color: 0x888888})
      game.materials.material
    );
    game.materials.paint(mesh, game.materials.materials[value - 1]);
    mesh.scale.set(0.25, 0.25, 0.25);
    mesh.translateX(pos[0]);
    mesh.translateY(pos[1]);
    mesh.translateZ(pos[2]);
    
    return {
      mesh: mesh,
      size: 1,
      collisionRadius: 22,
      value: value,
      velocity: {
        x: Math.random() * 0.02 * power,
        y: Math.random() * 0.02 * power,
        z: Math.random() * 0.02 * power
      },
      _debris: true
    };
}