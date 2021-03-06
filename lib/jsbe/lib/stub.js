var util = require('util');
var vm = require('vm');

var sync = require('synchronize');

var _console = {
  log: function() {
    var s = util.format.apply(this, arguments) + '\n';
    emit('console', s);
  }
};

var _process = {
  nextTick: process.nextTick
};

function run(src) {
  sync.fiber(function() {
    var script = new vm.Script(src);
    script.runInNewContext({
      console: _console,
      process: _process,
      setTimeout: setTimeout,
      setInterval: setInterval,
      setImmediate: setImmediate,
      on: on,
      emit: emit,
      off: off
	}, {
      fileName: 'script.js'
    });
  });
}

var cbs = {};
function handle(e, d) {
  var l = cbs[e];
  if (l) {
    for (var i = 0; i < l.length; i++) {
      var cb = l[i];
      cb(d);
    }
  }
}

function on(e, cb) {
  var l = cbs[e];
  if (!l) {
    l = [];
    cbs[e] = l;
  }
  l.push(cb);
}

function emit(e, d) {
  var msg = {
    type: 'event',
    event: e,
    data: d
  };
  process.send(msg);
}

function off(e, cb) {
  var l = cbs[e];
  if (l) {
    if (typeof cb === 'undefined') {
      cbs[e] = [];
    } else {
      var index = cbs.indexOf(cb);
      if (~index) {
        cbs.splice(index, 1);
      }
    }
  }
}

process.on('message', function(msg) {
  var type = msg.type;
  if (type === 'script') {
    var data = msg.data;
    run(data);
  } else if (type === 'event') {
    var event = msg.event;
    var data = msg.data;
    handle(event, data);
  }
});
