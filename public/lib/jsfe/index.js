var URL = window.URL || window.webkitURL;

var WORKER_HEADER = '"use strict";\n' +
'(' + (function() {
  var _postMessage = self.postMessage;
  delete self.postMessage;

  var _cbs = {};
  self.on = function(e, cb) {
    var l = _cbs[e];
    if (!l) {
      l = [];
      _cbs[e] = l;
    }
    l.push(cb);
  };
  self.off = function(e, cb) {
    var l = _cbs[e];
    if (l) {
      if (typeof cb === 'undefined') {
        _cbs[e] = [];
      } else {
        var index = l.indexOf(cb);
        if (~index) {
          l.splice(index, 1);
        }
      }
    }
  };
  self.emit = function(e, d) {
    var msg = {
      type: e,
      data: d
    };
    _postMessage(msg);
  };

  self.onmessage = function(m) {
    var msg = m.data;
    var e = msg.type;
    var data = msg.data;

    var l = _cbs[e];
    if (l) {
      for (var i = 0; i < l.length; i++) {
        var cb = l[i];
        cb(data);
      }
    }
  };
}).toString() + ')();\n';

function Script(src) {
  this._src = src;
  this._cbs = {};
  this._worker = null;
}
Script.prototype = {
  start: function() {
    function makeWorker(src, cbs) {
      var prefixedSrc = WORKER_HEADER + src;
      var blob = new Blob([prefixedSrc], {type: 'application/javascript'});
      var objectUrl = URL.createObjectURL(blob);

      var worker = new Worker(objectUrl);
      worker.onmessage = function(event) {
        var msg = event.data;
        var e = msg.type;
        var data = msg.data;

        var l = cbs[e];
        if (l) {
          for (var i = 0; i < l.length; i++) {
            var cb = l[i];
            cb(data);
          }
        }
      };

      return worker;
    }

    if (!this._worker) {
      this._worker = makeWorker(this._src, this._cbs);
    }
  },
  kill: function() {
    if (this._worker) {
      this._worker.terminate();
      this._worker = null;
    }
  },
  emit: function(e, d) {
    if (this._worker) {
      var msg = {
        type: e,
        data: d
      };
      this._worker.postMessage(msg);
    }
  },
  on: function(e, cb) {
    var cbs = this._cbs;
    var l = cbs[e];
    if (!l) {
      l = [];
      cbs[e] = l;
    }
    l.push(cb);
  },
  off: function(e, cb) {
    var cbs = this._cbs;
    var l = cbs[e];
    if (l) {
      if (typeof cb === 'undefined') {
        cbs[e] = [];
      } else {
        var index = l.indexOf(cb);
        if (~index) {
          l.splice(index, 1);
        }
      }
    }
  }
};

var jsfe = {
  Script: Script
};

module.exports = jsfe;
