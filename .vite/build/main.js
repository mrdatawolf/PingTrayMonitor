"use strict";
var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
const require$$3 = require("electron");
const path = require("path");
const fs = require("fs");
const require$$1$1 = require("child_process");
const require$$0$4 = require("tty");
const require$$1 = require("util");
const require$$4 = require("net");
const zlib = require("zlib");
const require$$0$7 = require("stream");
const require$$0$5 = require("buffer");
const require$$0$6 = require("events");
const require$$0$8 = require("os");
const require$$7 = require("url");
const require$$1$3 = require("https");
const require$$2 = require("http");
const require$$4$1 = require("tls");
const require$$1$2 = require("crypto");
const require$$3$1 = require("dns");
const require$$5 = require("assert");
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        return Reflect.construct(f, arguments, this.constructor);
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
var src$1 = { exports: {} };
var browser$1 = { exports: {} };
var debug = { exports: {} };
var ms$1;
var hasRequiredMs$1;
function requireMs$1() {
  if (hasRequiredMs$1) return ms$1;
  hasRequiredMs$1 = 1;
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var y = d * 365.25;
  ms$1 = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
      return parse(val);
    } else if (type === "number" && isNaN(val) === false) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
    );
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || "ms").toLowerCase();
    switch (type) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms2) {
    if (ms2 >= d) {
      return Math.round(ms2 / d) + "d";
    }
    if (ms2 >= h) {
      return Math.round(ms2 / h) + "h";
    }
    if (ms2 >= m) {
      return Math.round(ms2 / m) + "m";
    }
    if (ms2 >= s) {
      return Math.round(ms2 / s) + "s";
    }
    return ms2 + "ms";
  }
  function fmtLong(ms2) {
    return plural(ms2, d, "day") || plural(ms2, h, "hour") || plural(ms2, m, "minute") || plural(ms2, s, "second") || ms2 + " ms";
  }
  function plural(ms2, n, name) {
    if (ms2 < n) {
      return;
    }
    if (ms2 < n * 1.5) {
      return Math.floor(ms2 / n) + " " + name;
    }
    return Math.ceil(ms2 / n) + " " + name + "s";
  }
  return ms$1;
}
var hasRequiredDebug;
function requireDebug() {
  if (hasRequiredDebug) return debug.exports;
  hasRequiredDebug = 1;
  (function(module2, exports) {
    exports = module2.exports = createDebug.debug = createDebug["default"] = createDebug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = requireMs$1();
    exports.names = [];
    exports.skips = [];
    exports.formatters = {};
    var prevTime;
    function selectColor(namespace) {
      var hash = 0, i;
      for (i in namespace) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return exports.colors[Math.abs(hash) % exports.colors.length];
    }
    function createDebug(namespace) {
      function debug2() {
        if (!debug2.enabled) return;
        var self2 = debug2;
        var curr = +/* @__PURE__ */ new Date();
        var ms2 = curr - (prevTime || curr);
        self2.diff = ms2;
        self2.prev = prevTime;
        self2.curr = curr;
        prevTime = curr;
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        args[0] = exports.coerce(args[0]);
        if ("string" !== typeof args[0]) {
          args.unshift("%O");
        }
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          if (match === "%%") return match;
          index++;
          var formatter = exports.formatters[format];
          if ("function" === typeof formatter) {
            var val = args[index];
            match = formatter.call(self2, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        exports.formatArgs.call(self2, args);
        var logFn = debug2.log || exports.log || console.log.bind(console);
        logFn.apply(self2, args);
      }
      debug2.namespace = namespace;
      debug2.enabled = exports.enabled(namespace);
      debug2.useColors = exports.useColors();
      debug2.color = selectColor(namespace);
      if ("function" === typeof exports.init) {
        exports.init(debug2);
      }
      return debug2;
    }
    function enable(namespaces) {
      exports.save(namespaces);
      exports.names = [];
      exports.skips = [];
      var split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
      var len = split.length;
      for (var i = 0; i < len; i++) {
        if (!split[i]) continue;
        namespaces = split[i].replace(/\*/g, ".*?");
        if (namespaces[0] === "-") {
          exports.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
        } else {
          exports.names.push(new RegExp("^" + namespaces + "$"));
        }
      }
    }
    function disable() {
      exports.enable("");
    }
    function enabled(name) {
      var i, len;
      for (i = 0, len = exports.skips.length; i < len; i++) {
        if (exports.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = exports.names.length; i < len; i++) {
        if (exports.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }
    function coerce(val) {
      if (val instanceof Error) return val.stack || val.message;
      return val;
    }
  })(debug, debug.exports);
  return debug.exports;
}
var hasRequiredBrowser$1;
function requireBrowser$1() {
  if (hasRequiredBrowser$1) return browser$1.exports;
  hasRequiredBrowser$1 = 1;
  (function(module2, exports) {
    exports = module2.exports = requireDebug();
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load2;
    exports.useColors = useColors;
    exports.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : localstorage();
    exports.colors = [
      "lightseagreen",
      "forestgreen",
      "goldenrod",
      "dodgerblue",
      "darkorchid",
      "crimson"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && window.process.type === "renderer") {
        return true;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    exports.formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (err) {
        return "[UnexpectedJSONParseError]: " + err.message;
      }
    };
    function formatArgs(args) {
      var useColors2 = this.useColors;
      args[0] = (useColors2 ? "%c" : "") + this.namespace + (useColors2 ? " %c" : " ") + args[0] + (useColors2 ? "%c " : " ") + "+" + exports.humanize(this.diff);
      if (!useColors2) return;
      var c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if ("%%" === match) return;
        index++;
        if ("%c" === match) {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    function log() {
      return "object" === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function save(namespaces) {
      try {
        if (null == namespaces) {
          exports.storage.removeItem("debug");
        } else {
          exports.storage.debug = namespaces;
        }
      } catch (e) {
      }
    }
    function load2() {
      var r;
      try {
        r = exports.storage.debug;
      } catch (e) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    exports.enable(load2());
    function localstorage() {
      try {
        return window.localStorage;
      } catch (e) {
      }
    }
  })(browser$1, browser$1.exports);
  return browser$1.exports;
}
var node$1 = { exports: {} };
var hasRequiredNode$1;
function requireNode$1() {
  if (hasRequiredNode$1) return node$1.exports;
  hasRequiredNode$1 = 1;
  (function(module2, exports) {
    var tty = require$$0$4;
    var util2 = require$$1;
    exports = module2.exports = requireDebug();
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load2;
    exports.useColors = useColors;
    exports.colors = [6, 2, 3, 4, 5, 1];
    exports.inspectOpts = Object.keys(process.env).filter(function(key) {
      return /^debug_/i.test(key);
    }).reduce(function(obj, key) {
      var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function(_, k) {
        return k.toUpperCase();
      });
      var val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
      else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
      else if (val === "null") val = null;
      else val = Number(val);
      obj[prop] = val;
      return obj;
    }, {});
    var fd = parseInt(process.env.DEBUG_FD, 10) || 2;
    if (1 !== fd && 2 !== fd) {
      util2.deprecate(function() {
      }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    }
    var stream2 = 1 === fd ? process.stdout : 2 === fd ? process.stderr : createWritableStdioStream(fd);
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(fd);
    }
    exports.formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts).split("\n").map(function(str) {
        return str.trim();
      }).join(" ");
    };
    exports.formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts);
    };
    function formatArgs(args) {
      var name = this.namespace;
      var useColors2 = this.useColors;
      if (useColors2) {
        var c = this.color;
        var prefix = "  \x1B[3" + c + ";1m" + name + " \x1B[0m";
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push("\x1B[3" + c + "m+" + exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + name + " " + args[0];
      }
    }
    function log() {
      return stream2.write(util2.format.apply(util2, arguments) + "\n");
    }
    function save(namespaces) {
      if (null == namespaces) {
        delete process.env.DEBUG;
      } else {
        process.env.DEBUG = namespaces;
      }
    }
    function load2() {
      return process.env.DEBUG;
    }
    function createWritableStdioStream(fd2) {
      var stream3;
      var tty_wrap = process.binding("tty_wrap");
      switch (tty_wrap.guessHandleType(fd2)) {
        case "TTY":
          stream3 = new tty.WriteStream(fd2);
          stream3._type = "tty";
          if (stream3._handle && stream3._handle.unref) {
            stream3._handle.unref();
          }
          break;
        case "FILE":
          var fs$1 = fs;
          stream3 = new fs$1.SyncWriteStream(fd2, { autoClose: false });
          stream3._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var net = require$$4;
          stream3 = new net.Socket({
            fd: fd2,
            readable: false,
            writable: true
          });
          stream3.readable = false;
          stream3.read = null;
          stream3._type = "pipe";
          if (stream3._handle && stream3._handle.unref) {
            stream3._handle.unref();
          }
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      stream3.fd = fd2;
      stream3._isStdio = true;
      return stream3;
    }
    function init(debug2) {
      debug2.inspectOpts = {};
      var keys = Object.keys(exports.inspectOpts);
      for (var i = 0; i < keys.length; i++) {
        debug2.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    exports.enable(load2());
  })(node$1, node$1.exports);
  return node$1.exports;
}
var hasRequiredSrc$1;
function requireSrc$1() {
  if (hasRequiredSrc$1) return src$1.exports;
  hasRequiredSrc$1 = 1;
  if (typeof process !== "undefined" && process.type === "renderer") {
    src$1.exports = requireBrowser$1();
  } else {
    src$1.exports = requireNode$1();
  }
  return src$1.exports;
}
var electronSquirrelStartup;
var hasRequiredElectronSquirrelStartup;
function requireElectronSquirrelStartup() {
  if (hasRequiredElectronSquirrelStartup) return electronSquirrelStartup;
  hasRequiredElectronSquirrelStartup = 1;
  var path$1 = path;
  var spawn = require$$1$1.spawn;
  var debug2 = requireSrc$1()("electron-squirrel-startup");
  var app = require$$3.app;
  var run = function(args, done) {
    var updateExe = path$1.resolve(path$1.dirname(process.execPath), "..", "Update.exe");
    debug2("Spawning `%s` with args `%s`", updateExe, args);
    spawn(updateExe, args, {
      detached: true
    }).on("close", done);
  };
  var check = function() {
    if (process.platform === "win32") {
      var cmd = process.argv[1];
      debug2("processing squirrel command `%s`", cmd);
      var target = path$1.basename(process.execPath);
      if (cmd === "--squirrel-install" || cmd === "--squirrel-updated") {
        run(["--createShortcut=" + target], app.quit);
        return true;
      }
      if (cmd === "--squirrel-uninstall") {
        run(["--removeShortcut=" + target], app.quit);
        return true;
      }
      if (cmd === "--squirrel-obsolete") {
        app.quit();
        return true;
      }
    }
    return false;
  };
  electronSquirrelStartup = check();
  return electronSquirrelStartup;
}
var electronSquirrelStartupExports = requireElectronSquirrelStartup();
const squirrelStartup = /* @__PURE__ */ getDefaultExportFromCjs(electronSquirrelStartupExports);
function crc32(data) {
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
    table[i] = c;
  }
  let crc = -1;
  for (let i = 0; i < data.length; i++) crc = table[(crc ^ data[i]) & 255] ^ crc >>> 8;
  return crc ^ -1;
}
function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const len = Buffer.allocUnsafe(4);
  len.writeUInt32BE(data.length);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcBuf = Buffer.allocUnsafe(4);
  crcBuf.writeInt32BE(crc32(crcInput));
  return Buffer.concat([len, typeBytes, data, crcBuf]);
}
function makeCircleIcon(size, hexFill) {
  const r = parseInt(hexFill.slice(1, 3), 16);
  const g = parseInt(hexFill.slice(3, 5), 16);
  const b = parseInt(hexFill.slice(5, 7), 16);
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 1;
  const innerR = outerR * 0.55;
  const stride = size * 4 + 1;
  const raw = Buffer.alloc(size * stride, 0);
  for (let y = 0; y < size; y++) {
    raw[y * stride] = 0;
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const px = y * stride + 1 + x * 4;
      if (dist <= outerR) {
        if (dist <= innerR) {
          const t = 1 - dist / innerR;
          const bright = Math.round(255 * t * 0.4);
          raw[px] = Math.min(255, r + bright);
          raw[px + 1] = Math.min(255, g + bright);
          raw[px + 2] = Math.min(255, b + bright);
          raw[px + 3] = 255;
        } else {
          raw[px] = r;
          raw[px + 1] = g;
          raw[px + 2] = b;
          raw[px + 3] = 255;
        }
      }
    }
  }
  const compressed = zlib.deflateSync(raw, { level: 6 });
  const ihdrData = Buffer.allocUnsafe(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", ihdrData),
    pngChunk("IDAT", compressed),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
  return require$$3.nativeImage.createFromBuffer(png);
}
const ICON_SIZE = 22;
const icons = {
  green: makeCircleIcon(ICON_SIZE, "#52c41a"),
  yellow: makeCircleIcon(ICON_SIZE, "#faad14"),
  red: makeCircleIcon(ICON_SIZE, "#ff4d4f"),
  grey: makeCircleIcon(ICON_SIZE, "#8c8c8c"),
  black: makeCircleIcon(ICON_SIZE, "#404040")
};
var build$1 = {};
var mqtt$2 = {};
var client = {};
var mqtt$1 = {};
var bl = { exports: {} };
var ours = { exports: {} };
var stream$1 = { exports: {} };
var primordials;
var hasRequiredPrimordials;
function requirePrimordials() {
  if (hasRequiredPrimordials) return primordials;
  hasRequiredPrimordials = 1;
  class AggregateError extends Error {
    constructor(errors2) {
      if (!Array.isArray(errors2)) {
        throw new TypeError(`Expected input to be an Array, got ${typeof errors2}`);
      }
      let message = "";
      for (let i = 0; i < errors2.length; i++) {
        message += `    ${errors2[i].stack}
`;
      }
      super(message);
      this.name = "AggregateError";
      this.errors = errors2;
    }
  }
  primordials = {
    AggregateError,
    ArrayIsArray(self2) {
      return Array.isArray(self2);
    },
    ArrayPrototypeIncludes(self2, el) {
      return self2.includes(el);
    },
    ArrayPrototypeIndexOf(self2, el) {
      return self2.indexOf(el);
    },
    ArrayPrototypeJoin(self2, sep) {
      return self2.join(sep);
    },
    ArrayPrototypeMap(self2, fn) {
      return self2.map(fn);
    },
    ArrayPrototypePop(self2, el) {
      return self2.pop(el);
    },
    ArrayPrototypePush(self2, el) {
      return self2.push(el);
    },
    ArrayPrototypeSlice(self2, start, end) {
      return self2.slice(start, end);
    },
    Error,
    FunctionPrototypeCall(fn, thisArgs, ...args) {
      return fn.call(thisArgs, ...args);
    },
    FunctionPrototypeSymbolHasInstance(self2, instance) {
      return Function.prototype[Symbol.hasInstance].call(self2, instance);
    },
    MathFloor: Math.floor,
    Number,
    NumberIsInteger: Number.isInteger,
    NumberIsNaN: Number.isNaN,
    NumberMAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
    NumberMIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
    NumberParseInt: Number.parseInt,
    ObjectDefineProperties(self2, props) {
      return Object.defineProperties(self2, props);
    },
    ObjectDefineProperty(self2, name, prop) {
      return Object.defineProperty(self2, name, prop);
    },
    ObjectGetOwnPropertyDescriptor(self2, name) {
      return Object.getOwnPropertyDescriptor(self2, name);
    },
    ObjectKeys(obj) {
      return Object.keys(obj);
    },
    ObjectSetPrototypeOf(target, proto) {
      return Object.setPrototypeOf(target, proto);
    },
    Promise,
    PromisePrototypeCatch(self2, fn) {
      return self2.catch(fn);
    },
    PromisePrototypeThen(self2, thenFn, catchFn) {
      return self2.then(thenFn, catchFn);
    },
    PromiseReject(err) {
      return Promise.reject(err);
    },
    PromiseResolve(val) {
      return Promise.resolve(val);
    },
    ReflectApply: Reflect.apply,
    RegExpPrototypeTest(self2, value) {
      return self2.test(value);
    },
    SafeSet: Set,
    String,
    StringPrototypeSlice(self2, start, end) {
      return self2.slice(start, end);
    },
    StringPrototypeToLowerCase(self2) {
      return self2.toLowerCase();
    },
    StringPrototypeToUpperCase(self2) {
      return self2.toUpperCase();
    },
    StringPrototypeTrim(self2) {
      return self2.trim();
    },
    Symbol,
    SymbolFor: Symbol.for,
    SymbolAsyncIterator: Symbol.asyncIterator,
    SymbolHasInstance: Symbol.hasInstance,
    SymbolIterator: Symbol.iterator,
    SymbolDispose: Symbol.dispose || Symbol("Symbol.dispose"),
    SymbolAsyncDispose: Symbol.asyncDispose || Symbol("Symbol.asyncDispose"),
    TypedArrayPrototypeSet(self2, buf, len) {
      return self2.set(buf, len);
    },
    Boolean,
    Uint8Array
  };
  return primordials;
}
var util$1 = { exports: {} };
var inspect;
var hasRequiredInspect;
function requireInspect() {
  if (hasRequiredInspect) return inspect;
  hasRequiredInspect = 1;
  inspect = {
    format(format, ...args) {
      return format.replace(/%([sdifj])/g, function(...[_unused, type]) {
        const replacement = args.shift();
        if (type === "f") {
          return replacement.toFixed(6);
        } else if (type === "j") {
          return JSON.stringify(replacement);
        } else if (type === "s" && typeof replacement === "object") {
          const ctor = replacement.constructor !== Object ? replacement.constructor.name : "";
          return `${ctor} {}`.trim();
        } else {
          return replacement.toString();
        }
      });
    },
    inspect(value) {
      switch (typeof value) {
        case "string":
          if (value.includes("'")) {
            if (!value.includes('"')) {
              return `"${value}"`;
            } else if (!value.includes("`") && !value.includes("${")) {
              return `\`${value}\``;
            }
          }
          return `'${value}'`;
        case "number":
          if (isNaN(value)) {
            return "NaN";
          } else if (Object.is(value, -0)) {
            return String(value);
          }
          return value;
        case "bigint":
          return `${String(value)}n`;
        case "boolean":
        case "undefined":
          return String(value);
        case "object":
          return "{}";
      }
    }
  };
  return inspect;
}
var errors;
var hasRequiredErrors;
function requireErrors() {
  if (hasRequiredErrors) return errors;
  hasRequiredErrors = 1;
  const { format, inspect: inspect2 } = requireInspect();
  const { AggregateError: CustomAggregateError } = requirePrimordials();
  const AggregateError = globalThis.AggregateError || CustomAggregateError;
  const kIsNodeError = Symbol("kIsNodeError");
  const kTypes = [
    "string",
    "function",
    "number",
    "object",
    // Accept 'Function' and 'Object' as alternative to the lower cased version.
    "Function",
    "Object",
    "boolean",
    "bigint",
    "symbol"
  ];
  const classRegExp = /^([A-Z][a-z0-9]*)+$/;
  const nodeInternalPrefix = "__node_internal_";
  const codes = {};
  function assert(value, message) {
    if (!value) {
      throw new codes.ERR_INTERNAL_ASSERTION(message);
    }
  }
  function addNumericalSeparator(val) {
    let res = "";
    let i = val.length;
    const start = val[0] === "-" ? 1 : 0;
    for (; i >= start + 4; i -= 3) {
      res = `_${val.slice(i - 3, i)}${res}`;
    }
    return `${val.slice(0, i)}${res}`;
  }
  function getMessage(key, msg, args) {
    if (typeof msg === "function") {
      assert(
        msg.length <= args.length,
        // Default options do not count.
        `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${msg.length}).`
      );
      return msg(...args);
    }
    const expectedLength = (msg.match(/%[dfijoOs]/g) || []).length;
    assert(
      expectedLength === args.length,
      `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${expectedLength}).`
    );
    if (args.length === 0) {
      return msg;
    }
    return format(msg, ...args);
  }
  function E(code, message, Base2) {
    if (!Base2) {
      Base2 = Error;
    }
    class NodeError extends Base2 {
      constructor(...args) {
        super(getMessage(code, message, args));
      }
      toString() {
        return `${this.name} [${code}]: ${this.message}`;
      }
    }
    Object.defineProperties(NodeError.prototype, {
      name: {
        value: Base2.name,
        writable: true,
        enumerable: false,
        configurable: true
      },
      toString: {
        value() {
          return `${this.name} [${code}]: ${this.message}`;
        },
        writable: true,
        enumerable: false,
        configurable: true
      }
    });
    NodeError.prototype.code = code;
    NodeError.prototype[kIsNodeError] = true;
    codes[code] = NodeError;
  }
  function hideStackFrames(fn) {
    const hidden = nodeInternalPrefix + fn.name;
    Object.defineProperty(fn, "name", {
      value: hidden
    });
    return fn;
  }
  function aggregateTwoErrors(innerError, outerError) {
    if (innerError && outerError && innerError !== outerError) {
      if (Array.isArray(outerError.errors)) {
        outerError.errors.push(innerError);
        return outerError;
      }
      const err = new AggregateError([outerError, innerError], outerError.message);
      err.code = outerError.code;
      return err;
    }
    return innerError || outerError;
  }
  class AbortError extends Error {
    constructor(message = "The operation was aborted", options = void 0) {
      if (options !== void 0 && typeof options !== "object") {
        throw new codes.ERR_INVALID_ARG_TYPE("options", "Object", options);
      }
      super(message, options);
      this.code = "ABORT_ERR";
      this.name = "AbortError";
    }
  }
  E("ERR_ASSERTION", "%s", Error);
  E(
    "ERR_INVALID_ARG_TYPE",
    (name, expected, actual) => {
      assert(typeof name === "string", "'name' must be a string");
      if (!Array.isArray(expected)) {
        expected = [expected];
      }
      let msg = "The ";
      if (name.endsWith(" argument")) {
        msg += `${name} `;
      } else {
        msg += `"${name}" ${name.includes(".") ? "property" : "argument"} `;
      }
      msg += "must be ";
      const types = [];
      const instances = [];
      const other = [];
      for (const value of expected) {
        assert(typeof value === "string", "All expected entries have to be of type string");
        if (kTypes.includes(value)) {
          types.push(value.toLowerCase());
        } else if (classRegExp.test(value)) {
          instances.push(value);
        } else {
          assert(value !== "object", 'The value "object" should be written as "Object"');
          other.push(value);
        }
      }
      if (instances.length > 0) {
        const pos = types.indexOf("object");
        if (pos !== -1) {
          types.splice(types, pos, 1);
          instances.push("Object");
        }
      }
      if (types.length > 0) {
        switch (types.length) {
          case 1:
            msg += `of type ${types[0]}`;
            break;
          case 2:
            msg += `one of type ${types[0]} or ${types[1]}`;
            break;
          default: {
            const last = types.pop();
            msg += `one of type ${types.join(", ")}, or ${last}`;
          }
        }
        if (instances.length > 0 || other.length > 0) {
          msg += " or ";
        }
      }
      if (instances.length > 0) {
        switch (instances.length) {
          case 1:
            msg += `an instance of ${instances[0]}`;
            break;
          case 2:
            msg += `an instance of ${instances[0]} or ${instances[1]}`;
            break;
          default: {
            const last = instances.pop();
            msg += `an instance of ${instances.join(", ")}, or ${last}`;
          }
        }
        if (other.length > 0) {
          msg += " or ";
        }
      }
      switch (other.length) {
        case 0:
          break;
        case 1:
          if (other[0].toLowerCase() !== other[0]) {
            msg += "an ";
          }
          msg += `${other[0]}`;
          break;
        case 2:
          msg += `one of ${other[0]} or ${other[1]}`;
          break;
        default: {
          const last = other.pop();
          msg += `one of ${other.join(", ")}, or ${last}`;
        }
      }
      if (actual == null) {
        msg += `. Received ${actual}`;
      } else if (typeof actual === "function" && actual.name) {
        msg += `. Received function ${actual.name}`;
      } else if (typeof actual === "object") {
        var _actual$constructor;
        if ((_actual$constructor = actual.constructor) !== null && _actual$constructor !== void 0 && _actual$constructor.name) {
          msg += `. Received an instance of ${actual.constructor.name}`;
        } else {
          const inspected = inspect2(actual, {
            depth: -1
          });
          msg += `. Received ${inspected}`;
        }
      } else {
        let inspected = inspect2(actual, {
          colors: false
        });
        if (inspected.length > 25) {
          inspected = `${inspected.slice(0, 25)}...`;
        }
        msg += `. Received type ${typeof actual} (${inspected})`;
      }
      return msg;
    },
    TypeError
  );
  E(
    "ERR_INVALID_ARG_VALUE",
    (name, value, reason = "is invalid") => {
      let inspected = inspect2(value);
      if (inspected.length > 128) {
        inspected = inspected.slice(0, 128) + "...";
      }
      const type = name.includes(".") ? "property" : "argument";
      return `The ${type} '${name}' ${reason}. Received ${inspected}`;
    },
    TypeError
  );
  E(
    "ERR_INVALID_RETURN_VALUE",
    (input, name, value) => {
      var _value$constructor;
      const type = value !== null && value !== void 0 && (_value$constructor = value.constructor) !== null && _value$constructor !== void 0 && _value$constructor.name ? `instance of ${value.constructor.name}` : `type ${typeof value}`;
      return `Expected ${input} to be returned from the "${name}" function but got ${type}.`;
    },
    TypeError
  );
  E(
    "ERR_MISSING_ARGS",
    (...args) => {
      assert(args.length > 0, "At least one arg needs to be specified");
      let msg;
      const len = args.length;
      args = (Array.isArray(args) ? args : [args]).map((a) => `"${a}"`).join(" or ");
      switch (len) {
        case 1:
          msg += `The ${args[0]} argument`;
          break;
        case 2:
          msg += `The ${args[0]} and ${args[1]} arguments`;
          break;
        default:
          {
            const last = args.pop();
            msg += `The ${args.join(", ")}, and ${last} arguments`;
          }
          break;
      }
      return `${msg} must be specified`;
    },
    TypeError
  );
  E(
    "ERR_OUT_OF_RANGE",
    (str, range, input) => {
      assert(range, 'Missing "range" argument');
      let received;
      if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
        received = addNumericalSeparator(String(input));
      } else if (typeof input === "bigint") {
        received = String(input);
        const limit = BigInt(2) ** BigInt(32);
        if (input > limit || input < -limit) {
          received = addNumericalSeparator(received);
        }
        received += "n";
      } else {
        received = inspect2(input);
      }
      return `The value of "${str}" is out of range. It must be ${range}. Received ${received}`;
    },
    RangeError
  );
  E("ERR_MULTIPLE_CALLBACK", "Callback called multiple times", Error);
  E("ERR_METHOD_NOT_IMPLEMENTED", "The %s method is not implemented", Error);
  E("ERR_STREAM_ALREADY_FINISHED", "Cannot call %s after a stream was finished", Error);
  E("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable", Error);
  E("ERR_STREAM_DESTROYED", "Cannot call %s after a stream was destroyed", Error);
  E("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
  E("ERR_STREAM_PREMATURE_CLOSE", "Premature close", Error);
  E("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF", Error);
  E("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event", Error);
  E("ERR_STREAM_WRITE_AFTER_END", "write after end", Error);
  E("ERR_UNKNOWN_ENCODING", "Unknown encoding: %s", TypeError);
  errors = {
    AbortError,
    aggregateTwoErrors: hideStackFrames(aggregateTwoErrors),
    hideStackFrames,
    codes
  };
  return errors;
}
const privateData = /* @__PURE__ */ new WeakMap();
const wrappers = /* @__PURE__ */ new WeakMap();
function pd(event) {
  const retv = privateData.get(event);
  console.assert(
    retv != null,
    "'this' is expected an Event object, but got",
    event
  );
  return retv;
}
function setCancelFlag(data) {
  if (data.passiveListener != null) {
    if (typeof console !== "undefined" && typeof console.error === "function") {
      console.error(
        "Unable to preventDefault inside passive event listener invocation.",
        data.passiveListener
      );
    }
    return;
  }
  if (!data.event.cancelable) {
    return;
  }
  data.canceled = true;
  if (typeof data.event.preventDefault === "function") {
    data.event.preventDefault();
  }
}
function Event(eventTarget2, event) {
  privateData.set(this, {
    eventTarget: eventTarget2,
    event,
    eventPhase: 2,
    currentTarget: eventTarget2,
    canceled: false,
    stopped: false,
    immediateStopped: false,
    passiveListener: null,
    timeStamp: event.timeStamp || Date.now()
  });
  Object.defineProperty(this, "isTrusted", { value: false, enumerable: true });
  const keys = Object.keys(event);
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    if (!(key in this)) {
      Object.defineProperty(this, key, defineRedirectDescriptor(key));
    }
  }
}
Event.prototype = {
  /**
   * The type of this event.
   * @type {string}
   */
  get type() {
    return pd(this).event.type;
  },
  /**
   * The target of this event.
   * @type {EventTarget}
   */
  get target() {
    return pd(this).eventTarget;
  },
  /**
   * The target of this event.
   * @type {EventTarget}
   */
  get currentTarget() {
    return pd(this).currentTarget;
  },
  /**
   * @returns {EventTarget[]} The composed path of this event.
   */
  composedPath() {
    const currentTarget = pd(this).currentTarget;
    if (currentTarget == null) {
      return [];
    }
    return [currentTarget];
  },
  /**
   * Constant of NONE.
   * @type {number}
   */
  get NONE() {
    return 0;
  },
  /**
   * Constant of CAPTURING_PHASE.
   * @type {number}
   */
  get CAPTURING_PHASE() {
    return 1;
  },
  /**
   * Constant of AT_TARGET.
   * @type {number}
   */
  get AT_TARGET() {
    return 2;
  },
  /**
   * Constant of BUBBLING_PHASE.
   * @type {number}
   */
  get BUBBLING_PHASE() {
    return 3;
  },
  /**
   * The target of this event.
   * @type {number}
   */
  get eventPhase() {
    return pd(this).eventPhase;
  },
  /**
   * Stop event bubbling.
   * @returns {void}
   */
  stopPropagation() {
    const data = pd(this);
    data.stopped = true;
    if (typeof data.event.stopPropagation === "function") {
      data.event.stopPropagation();
    }
  },
  /**
   * Stop event bubbling.
   * @returns {void}
   */
  stopImmediatePropagation() {
    const data = pd(this);
    data.stopped = true;
    data.immediateStopped = true;
    if (typeof data.event.stopImmediatePropagation === "function") {
      data.event.stopImmediatePropagation();
    }
  },
  /**
   * The flag to be bubbling.
   * @type {boolean}
   */
  get bubbles() {
    return Boolean(pd(this).event.bubbles);
  },
  /**
   * The flag to be cancelable.
   * @type {boolean}
   */
  get cancelable() {
    return Boolean(pd(this).event.cancelable);
  },
  /**
   * Cancel this event.
   * @returns {void}
   */
  preventDefault() {
    setCancelFlag(pd(this));
  },
  /**
   * The flag to indicate cancellation state.
   * @type {boolean}
   */
  get defaultPrevented() {
    return pd(this).canceled;
  },
  /**
   * The flag to be composed.
   * @type {boolean}
   */
  get composed() {
    return Boolean(pd(this).event.composed);
  },
  /**
   * The unix time of this event.
   * @type {number}
   */
  get timeStamp() {
    return pd(this).timeStamp;
  },
  /**
   * The target of this event.
   * @type {EventTarget}
   * @deprecated
   */
  get srcElement() {
    return pd(this).eventTarget;
  },
  /**
   * The flag to stop event bubbling.
   * @type {boolean}
   * @deprecated
   */
  get cancelBubble() {
    return pd(this).stopped;
  },
  set cancelBubble(value) {
    if (!value) {
      return;
    }
    const data = pd(this);
    data.stopped = true;
    if (typeof data.event.cancelBubble === "boolean") {
      data.event.cancelBubble = true;
    }
  },
  /**
   * The flag to indicate cancellation state.
   * @type {boolean}
   * @deprecated
   */
  get returnValue() {
    return !pd(this).canceled;
  },
  set returnValue(value) {
    if (!value) {
      setCancelFlag(pd(this));
    }
  },
  /**
   * Initialize this event object. But do nothing under event dispatching.
   * @param {string} type The event type.
   * @param {boolean} [bubbles=false] The flag to be possible to bubble up.
   * @param {boolean} [cancelable=false] The flag to be possible to cancel.
   * @deprecated
   */
  initEvent() {
  }
};
Object.defineProperty(Event.prototype, "constructor", {
  value: Event,
  configurable: true,
  writable: true
});
if (typeof window !== "undefined" && typeof window.Event !== "undefined") {
  Object.setPrototypeOf(Event.prototype, window.Event.prototype);
  wrappers.set(window.Event.prototype, Event);
}
function defineRedirectDescriptor(key) {
  return {
    get() {
      return pd(this).event[key];
    },
    set(value) {
      pd(this).event[key] = value;
    },
    configurable: true,
    enumerable: true
  };
}
function defineCallDescriptor(key) {
  return {
    value() {
      const event = pd(this).event;
      return event[key].apply(event, arguments);
    },
    configurable: true,
    enumerable: true
  };
}
function defineWrapper(BaseEvent, proto) {
  const keys = Object.keys(proto);
  if (keys.length === 0) {
    return BaseEvent;
  }
  function CustomEvent(eventTarget2, event) {
    BaseEvent.call(this, eventTarget2, event);
  }
  CustomEvent.prototype = Object.create(BaseEvent.prototype, {
    constructor: { value: CustomEvent, configurable: true, writable: true }
  });
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    if (!(key in BaseEvent.prototype)) {
      const descriptor = Object.getOwnPropertyDescriptor(proto, key);
      const isFunc = typeof descriptor.value === "function";
      Object.defineProperty(
        CustomEvent.prototype,
        key,
        isFunc ? defineCallDescriptor(key) : defineRedirectDescriptor(key)
      );
    }
  }
  return CustomEvent;
}
function getWrapper(proto) {
  if (proto == null || proto === Object.prototype) {
    return Event;
  }
  let wrapper = wrappers.get(proto);
  if (wrapper == null) {
    wrapper = defineWrapper(getWrapper(Object.getPrototypeOf(proto)), proto);
    wrappers.set(proto, wrapper);
  }
  return wrapper;
}
function wrapEvent(eventTarget2, event) {
  const Wrapper = getWrapper(Object.getPrototypeOf(event));
  return new Wrapper(eventTarget2, event);
}
function isStopped(event) {
  return pd(event).immediateStopped;
}
function setEventPhase(event, eventPhase) {
  pd(event).eventPhase = eventPhase;
}
function setCurrentTarget(event, currentTarget) {
  pd(event).currentTarget = currentTarget;
}
function setPassiveListener(event, passiveListener) {
  pd(event).passiveListener = passiveListener;
}
const listenersMap = /* @__PURE__ */ new WeakMap();
const CAPTURE = 1;
const BUBBLE = 2;
const ATTRIBUTE = 3;
function isObject(x) {
  return x !== null && typeof x === "object";
}
function getListeners(eventTarget2) {
  const listeners = listenersMap.get(eventTarget2);
  if (listeners == null) {
    throw new TypeError(
      "'this' is expected an EventTarget object, but got another value."
    );
  }
  return listeners;
}
function defineEventAttributeDescriptor(eventName) {
  return {
    get() {
      const listeners = getListeners(this);
      let node2 = listeners.get(eventName);
      while (node2 != null) {
        if (node2.listenerType === ATTRIBUTE) {
          return node2.listener;
        }
        node2 = node2.next;
      }
      return null;
    },
    set(listener) {
      if (typeof listener !== "function" && !isObject(listener)) {
        listener = null;
      }
      const listeners = getListeners(this);
      let prev = null;
      let node2 = listeners.get(eventName);
      while (node2 != null) {
        if (node2.listenerType === ATTRIBUTE) {
          if (prev !== null) {
            prev.next = node2.next;
          } else if (node2.next !== null) {
            listeners.set(eventName, node2.next);
          } else {
            listeners.delete(eventName);
          }
        } else {
          prev = node2;
        }
        node2 = node2.next;
      }
      if (listener !== null) {
        const newNode = {
          listener,
          listenerType: ATTRIBUTE,
          passive: false,
          once: false,
          next: null
        };
        if (prev === null) {
          listeners.set(eventName, newNode);
        } else {
          prev.next = newNode;
        }
      }
    },
    configurable: true,
    enumerable: true
  };
}
function defineEventAttribute(eventTargetPrototype, eventName) {
  Object.defineProperty(
    eventTargetPrototype,
    `on${eventName}`,
    defineEventAttributeDescriptor(eventName)
  );
}
function defineCustomEventTarget(eventNames) {
  function CustomEventTarget() {
    EventTarget.call(this);
  }
  CustomEventTarget.prototype = Object.create(EventTarget.prototype, {
    constructor: {
      value: CustomEventTarget,
      configurable: true,
      writable: true
    }
  });
  for (let i = 0; i < eventNames.length; ++i) {
    defineEventAttribute(CustomEventTarget.prototype, eventNames[i]);
  }
  return CustomEventTarget;
}
function EventTarget() {
  if (this instanceof EventTarget) {
    listenersMap.set(this, /* @__PURE__ */ new Map());
    return;
  }
  if (arguments.length === 1 && Array.isArray(arguments[0])) {
    return defineCustomEventTarget(arguments[0]);
  }
  if (arguments.length > 0) {
    const types = new Array(arguments.length);
    for (let i = 0; i < arguments.length; ++i) {
      types[i] = arguments[i];
    }
    return defineCustomEventTarget(types);
  }
  throw new TypeError("Cannot call a class as a function");
}
EventTarget.prototype = {
  /**
   * Add a given listener to this event target.
   * @param {string} eventName The event name to add.
   * @param {Function} listener The listener to add.
   * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
   * @returns {void}
   */
  addEventListener(eventName, listener, options) {
    if (listener == null) {
      return;
    }
    if (typeof listener !== "function" && !isObject(listener)) {
      throw new TypeError("'listener' should be a function or an object.");
    }
    const listeners = getListeners(this);
    const optionsIsObj = isObject(options);
    const capture = optionsIsObj ? Boolean(options.capture) : Boolean(options);
    const listenerType = capture ? CAPTURE : BUBBLE;
    const newNode = {
      listener,
      listenerType,
      passive: optionsIsObj && Boolean(options.passive),
      once: optionsIsObj && Boolean(options.once),
      next: null
    };
    let node2 = listeners.get(eventName);
    if (node2 === void 0) {
      listeners.set(eventName, newNode);
      return;
    }
    let prev = null;
    while (node2 != null) {
      if (node2.listener === listener && node2.listenerType === listenerType) {
        return;
      }
      prev = node2;
      node2 = node2.next;
    }
    prev.next = newNode;
  },
  /**
   * Remove a given listener from this event target.
   * @param {string} eventName The event name to remove.
   * @param {Function} listener The listener to remove.
   * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
   * @returns {void}
   */
  removeEventListener(eventName, listener, options) {
    if (listener == null) {
      return;
    }
    const listeners = getListeners(this);
    const capture = isObject(options) ? Boolean(options.capture) : Boolean(options);
    const listenerType = capture ? CAPTURE : BUBBLE;
    let prev = null;
    let node2 = listeners.get(eventName);
    while (node2 != null) {
      if (node2.listener === listener && node2.listenerType === listenerType) {
        if (prev !== null) {
          prev.next = node2.next;
        } else if (node2.next !== null) {
          listeners.set(eventName, node2.next);
        } else {
          listeners.delete(eventName);
        }
        return;
      }
      prev = node2;
      node2 = node2.next;
    }
  },
  /**
   * Dispatch a given event.
   * @param {Event|{type:string}} event The event to dispatch.
   * @returns {boolean} `false` if canceled.
   */
  dispatchEvent(event) {
    if (event == null || typeof event.type !== "string") {
      throw new TypeError('"event.type" should be a string.');
    }
    const listeners = getListeners(this);
    const eventName = event.type;
    let node2 = listeners.get(eventName);
    if (node2 == null) {
      return true;
    }
    const wrappedEvent = wrapEvent(this, event);
    let prev = null;
    while (node2 != null) {
      if (node2.once) {
        if (prev !== null) {
          prev.next = node2.next;
        } else if (node2.next !== null) {
          listeners.set(eventName, node2.next);
        } else {
          listeners.delete(eventName);
        }
      } else {
        prev = node2;
      }
      setPassiveListener(
        wrappedEvent,
        node2.passive ? node2.listener : null
      );
      if (typeof node2.listener === "function") {
        try {
          node2.listener.call(this, wrappedEvent);
        } catch (err) {
          if (typeof console !== "undefined" && typeof console.error === "function") {
            console.error(err);
          }
        }
      } else if (node2.listenerType !== ATTRIBUTE && typeof node2.listener.handleEvent === "function") {
        node2.listener.handleEvent(wrappedEvent);
      }
      if (isStopped(wrappedEvent)) {
        break;
      }
      node2 = node2.next;
    }
    setPassiveListener(wrappedEvent, null);
    setEventPhase(wrappedEvent, 0);
    setCurrentTarget(wrappedEvent, null);
    return !wrappedEvent.defaultPrevented;
  }
};
Object.defineProperty(EventTarget.prototype, "constructor", {
  value: EventTarget,
  configurable: true,
  writable: true
});
if (typeof window !== "undefined" && typeof window.EventTarget !== "undefined") {
  Object.setPrototypeOf(EventTarget.prototype, window.EventTarget.prototype);
}
class AbortSignal extends EventTarget {
  /**
   * AbortSignal cannot be constructed directly.
   */
  constructor() {
    super();
    throw new TypeError("AbortSignal cannot be constructed directly");
  }
  /**
   * Returns `true` if this `AbortSignal`'s `AbortController` has signaled to abort, and `false` otherwise.
   */
  get aborted() {
    const aborted = abortedFlags.get(this);
    if (typeof aborted !== "boolean") {
      throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${this === null ? "null" : typeof this}`);
    }
    return aborted;
  }
}
defineEventAttribute(AbortSignal.prototype, "abort");
function createAbortSignal() {
  const signal = Object.create(AbortSignal.prototype);
  EventTarget.call(signal);
  abortedFlags.set(signal, false);
  return signal;
}
function abortSignal(signal) {
  if (abortedFlags.get(signal) !== false) {
    return;
  }
  abortedFlags.set(signal, true);
  signal.dispatchEvent({ type: "abort" });
}
const abortedFlags = /* @__PURE__ */ new WeakMap();
Object.defineProperties(AbortSignal.prototype, {
  aborted: { enumerable: true }
});
if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
  Object.defineProperty(AbortSignal.prototype, Symbol.toStringTag, {
    configurable: true,
    value: "AbortSignal"
  });
}
class AbortController {
  /**
   * Initialize this controller.
   */
  constructor() {
    signals.set(this, createAbortSignal());
  }
  /**
   * Returns the `AbortSignal` object associated with this object.
   */
  get signal() {
    return getSignal(this);
  }
  /**
   * Abort and signal to any observers that the associated activity is to be aborted.
   */
  abort() {
    abortSignal(getSignal(this));
  }
}
const signals = /* @__PURE__ */ new WeakMap();
function getSignal(controller) {
  const signal = signals.get(controller);
  if (signal == null) {
    throw new TypeError(`Expected 'this' to be an 'AbortController' object, but got ${controller === null ? "null" : typeof controller}`);
  }
  return signal;
}
Object.defineProperties(AbortController.prototype, {
  signal: { enumerable: true },
  abort: { enumerable: true }
});
if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
  Object.defineProperty(AbortController.prototype, Symbol.toStringTag, {
    configurable: true,
    value: "AbortController"
  });
}
const abortController = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AbortController,
  AbortSignal,
  default: AbortController
}, Symbol.toStringTag, { value: "Module" }));
const require$$0$3 = /* @__PURE__ */ getAugmentedNamespace(abortController);
var hasRequiredUtil$1;
function requireUtil$1() {
  if (hasRequiredUtil$1) return util$1.exports;
  hasRequiredUtil$1 = 1;
  (function(module2) {
    const bufferModule = require$$0$5;
    const { format, inspect: inspect2 } = requireInspect();
    const {
      codes: { ERR_INVALID_ARG_TYPE }
    } = requireErrors();
    const { kResistStopPropagation, AggregateError, SymbolDispose } = requirePrimordials();
    const AbortSignal2 = globalThis.AbortSignal || require$$0$3.AbortSignal;
    const AbortController2 = globalThis.AbortController || require$$0$3.AbortController;
    const AsyncFunction = Object.getPrototypeOf(async function() {
    }).constructor;
    const Blob2 = globalThis.Blob || bufferModule.Blob;
    const isBlob = typeof Blob2 !== "undefined" ? function isBlob2(b) {
      return b instanceof Blob2;
    } : function isBlob2(b) {
      return false;
    };
    const validateAbortSignal = (signal, name) => {
      if (signal !== void 0 && (signal === null || typeof signal !== "object" || !("aborted" in signal))) {
        throw new ERR_INVALID_ARG_TYPE(name, "AbortSignal", signal);
      }
    };
    const validateFunction = (value, name) => {
      if (typeof value !== "function") {
        throw new ERR_INVALID_ARG_TYPE(name, "Function", value);
      }
    };
    module2.exports = {
      AggregateError,
      kEmptyObject: Object.freeze({}),
      once(callback) {
        let called = false;
        return function(...args) {
          if (called) {
            return;
          }
          called = true;
          callback.apply(this, args);
        };
      },
      createDeferredPromise: function() {
        let resolve;
        let reject;
        const promise = new Promise((res, rej) => {
          resolve = res;
          reject = rej;
        });
        return {
          promise,
          resolve,
          reject
        };
      },
      promisify(fn) {
        return new Promise((resolve, reject) => {
          fn((err, ...args) => {
            if (err) {
              return reject(err);
            }
            return resolve(...args);
          });
        });
      },
      debuglog() {
        return function() {
        };
      },
      format,
      inspect: inspect2,
      types: {
        isAsyncFunction(fn) {
          return fn instanceof AsyncFunction;
        },
        isArrayBufferView(arr) {
          return ArrayBuffer.isView(arr);
        }
      },
      isBlob,
      deprecate(fn, message) {
        return fn;
      },
      addAbortListener: require$$0$6.addAbortListener || function addAbortListener(signal, listener) {
        if (signal === void 0) {
          throw new ERR_INVALID_ARG_TYPE("signal", "AbortSignal", signal);
        }
        validateAbortSignal(signal, "signal");
        validateFunction(listener, "listener");
        let removeEventListener;
        if (signal.aborted) {
          queueMicrotask(() => listener());
        } else {
          signal.addEventListener("abort", listener, {
            __proto__: null,
            once: true,
            [kResistStopPropagation]: true
          });
          removeEventListener = () => {
            signal.removeEventListener("abort", listener);
          };
        }
        return {
          __proto__: null,
          [SymbolDispose]() {
            var _removeEventListener;
            (_removeEventListener = removeEventListener) === null || _removeEventListener === void 0 ? void 0 : _removeEventListener();
          }
        };
      },
      AbortSignalAny: AbortSignal2.any || function AbortSignalAny(signals2) {
        if (signals2.length === 1) {
          return signals2[0];
        }
        const ac = new AbortController2();
        const abort = () => ac.abort();
        signals2.forEach((signal) => {
          validateAbortSignal(signal, "signals");
          signal.addEventListener("abort", abort, {
            once: true
          });
        });
        ac.signal.addEventListener(
          "abort",
          () => {
            signals2.forEach((signal) => signal.removeEventListener("abort", abort));
          },
          {
            once: true
          }
        );
        return ac.signal;
      }
    };
    module2.exports.promisify.custom = Symbol.for("nodejs.util.promisify.custom");
  })(util$1);
  return util$1.exports;
}
var operators = {};
var validators;
var hasRequiredValidators;
function requireValidators() {
  if (hasRequiredValidators) return validators;
  hasRequiredValidators = 1;
  const {
    ArrayIsArray,
    ArrayPrototypeIncludes,
    ArrayPrototypeJoin,
    ArrayPrototypeMap,
    NumberIsInteger,
    NumberIsNaN,
    NumberMAX_SAFE_INTEGER,
    NumberMIN_SAFE_INTEGER,
    NumberParseInt,
    ObjectPrototypeHasOwnProperty,
    RegExpPrototypeExec,
    String: String2,
    StringPrototypeToUpperCase,
    StringPrototypeTrim
  } = requirePrimordials();
  const {
    hideStackFrames,
    codes: { ERR_SOCKET_BAD_PORT, ERR_INVALID_ARG_TYPE, ERR_INVALID_ARG_VALUE, ERR_OUT_OF_RANGE, ERR_UNKNOWN_SIGNAL }
  } = requireErrors();
  const { normalizeEncoding } = requireUtil$1();
  const { isAsyncFunction, isArrayBufferView } = requireUtil$1().types;
  const signals2 = {};
  function isInt32(value) {
    return value === (value | 0);
  }
  function isUint32(value) {
    return value === value >>> 0;
  }
  const octalReg = /^[0-7]+$/;
  const modeDesc = "must be a 32-bit unsigned integer or an octal string";
  function parseFileMode(value, name, def) {
    if (typeof value === "undefined") {
      value = def;
    }
    if (typeof value === "string") {
      if (RegExpPrototypeExec(octalReg, value) === null) {
        throw new ERR_INVALID_ARG_VALUE(name, value, modeDesc);
      }
      value = NumberParseInt(value, 8);
    }
    validateUint32(value, name);
    return value;
  }
  const validateInteger = hideStackFrames((value, name, min = NumberMIN_SAFE_INTEGER, max = NumberMAX_SAFE_INTEGER) => {
    if (typeof value !== "number") throw new ERR_INVALID_ARG_TYPE(name, "number", value);
    if (!NumberIsInteger(value)) throw new ERR_OUT_OF_RANGE(name, "an integer", value);
    if (value < min || value > max) throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
  });
  const validateInt32 = hideStackFrames((value, name, min = -2147483648, max = 2147483647) => {
    if (typeof value !== "number") {
      throw new ERR_INVALID_ARG_TYPE(name, "number", value);
    }
    if (!NumberIsInteger(value)) {
      throw new ERR_OUT_OF_RANGE(name, "an integer", value);
    }
    if (value < min || value > max) {
      throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
    }
  });
  const validateUint32 = hideStackFrames((value, name, positive = false) => {
    if (typeof value !== "number") {
      throw new ERR_INVALID_ARG_TYPE(name, "number", value);
    }
    if (!NumberIsInteger(value)) {
      throw new ERR_OUT_OF_RANGE(name, "an integer", value);
    }
    const min = positive ? 1 : 0;
    const max = 4294967295;
    if (value < min || value > max) {
      throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
    }
  });
  function validateString(value, name) {
    if (typeof value !== "string") throw new ERR_INVALID_ARG_TYPE(name, "string", value);
  }
  function validateNumber(value, name, min = void 0, max) {
    if (typeof value !== "number") throw new ERR_INVALID_ARG_TYPE(name, "number", value);
    if (min != null && value < min || max != null && value > max || (min != null || max != null) && NumberIsNaN(value)) {
      throw new ERR_OUT_OF_RANGE(
        name,
        `${min != null ? `>= ${min}` : ""}${min != null && max != null ? " && " : ""}${max != null ? `<= ${max}` : ""}`,
        value
      );
    }
  }
  const validateOneOf = hideStackFrames((value, name, oneOf) => {
    if (!ArrayPrototypeIncludes(oneOf, value)) {
      const allowed = ArrayPrototypeJoin(
        ArrayPrototypeMap(oneOf, (v) => typeof v === "string" ? `'${v}'` : String2(v)),
        ", "
      );
      const reason = "must be one of: " + allowed;
      throw new ERR_INVALID_ARG_VALUE(name, value, reason);
    }
  });
  function validateBoolean(value, name) {
    if (typeof value !== "boolean") throw new ERR_INVALID_ARG_TYPE(name, "boolean", value);
  }
  function getOwnPropertyValueOrDefault(options, key, defaultValue) {
    return options == null || !ObjectPrototypeHasOwnProperty(options, key) ? defaultValue : options[key];
  }
  const validateObject = hideStackFrames((value, name, options = null) => {
    const allowArray = getOwnPropertyValueOrDefault(options, "allowArray", false);
    const allowFunction = getOwnPropertyValueOrDefault(options, "allowFunction", false);
    const nullable = getOwnPropertyValueOrDefault(options, "nullable", false);
    if (!nullable && value === null || !allowArray && ArrayIsArray(value) || typeof value !== "object" && (!allowFunction || typeof value !== "function")) {
      throw new ERR_INVALID_ARG_TYPE(name, "Object", value);
    }
  });
  const validateDictionary = hideStackFrames((value, name) => {
    if (value != null && typeof value !== "object" && typeof value !== "function") {
      throw new ERR_INVALID_ARG_TYPE(name, "a dictionary", value);
    }
  });
  const validateArray = hideStackFrames((value, name, minLength = 0) => {
    if (!ArrayIsArray(value)) {
      throw new ERR_INVALID_ARG_TYPE(name, "Array", value);
    }
    if (value.length < minLength) {
      const reason = `must be longer than ${minLength}`;
      throw new ERR_INVALID_ARG_VALUE(name, value, reason);
    }
  });
  function validateStringArray(value, name) {
    validateArray(value, name);
    for (let i = 0; i < value.length; i++) {
      validateString(value[i], `${name}[${i}]`);
    }
  }
  function validateBooleanArray(value, name) {
    validateArray(value, name);
    for (let i = 0; i < value.length; i++) {
      validateBoolean(value[i], `${name}[${i}]`);
    }
  }
  function validateAbortSignalArray(value, name) {
    validateArray(value, name);
    for (let i = 0; i < value.length; i++) {
      const signal = value[i];
      const indexedName = `${name}[${i}]`;
      if (signal == null) {
        throw new ERR_INVALID_ARG_TYPE(indexedName, "AbortSignal", signal);
      }
      validateAbortSignal(signal, indexedName);
    }
  }
  function validateSignalName(signal, name = "signal") {
    validateString(signal, name);
    if (signals2[signal] === void 0) {
      if (signals2[StringPrototypeToUpperCase(signal)] !== void 0) {
        throw new ERR_UNKNOWN_SIGNAL(signal + " (signals must use all capital letters)");
      }
      throw new ERR_UNKNOWN_SIGNAL(signal);
    }
  }
  const validateBuffer = hideStackFrames((buffer, name = "buffer") => {
    if (!isArrayBufferView(buffer)) {
      throw new ERR_INVALID_ARG_TYPE(name, ["Buffer", "TypedArray", "DataView"], buffer);
    }
  });
  function validateEncoding(data, encoding) {
    const normalizedEncoding = normalizeEncoding(encoding);
    const length = data.length;
    if (normalizedEncoding === "hex" && length % 2 !== 0) {
      throw new ERR_INVALID_ARG_VALUE("encoding", encoding, `is invalid for data of length ${length}`);
    }
  }
  function validatePort(port, name = "Port", allowZero = true) {
    if (typeof port !== "number" && typeof port !== "string" || typeof port === "string" && StringPrototypeTrim(port).length === 0 || +port !== +port >>> 0 || port > 65535 || port === 0 && !allowZero) {
      throw new ERR_SOCKET_BAD_PORT(name, port, allowZero);
    }
    return port | 0;
  }
  const validateAbortSignal = hideStackFrames((signal, name) => {
    if (signal !== void 0 && (signal === null || typeof signal !== "object" || !("aborted" in signal))) {
      throw new ERR_INVALID_ARG_TYPE(name, "AbortSignal", signal);
    }
  });
  const validateFunction = hideStackFrames((value, name) => {
    if (typeof value !== "function") throw new ERR_INVALID_ARG_TYPE(name, "Function", value);
  });
  const validatePlainFunction = hideStackFrames((value, name) => {
    if (typeof value !== "function" || isAsyncFunction(value)) throw new ERR_INVALID_ARG_TYPE(name, "Function", value);
  });
  const validateUndefined = hideStackFrames((value, name) => {
    if (value !== void 0) throw new ERR_INVALID_ARG_TYPE(name, "undefined", value);
  });
  function validateUnion(value, name, union) {
    if (!ArrayPrototypeIncludes(union, value)) {
      throw new ERR_INVALID_ARG_TYPE(name, `('${ArrayPrototypeJoin(union, "|")}')`, value);
    }
  }
  const linkValueRegExp = /^(?:<[^>]*>)(?:\s*;\s*[^;"\s]+(?:=(")?[^;"\s]*\1)?)*$/;
  function validateLinkHeaderFormat(value, name) {
    if (typeof value === "undefined" || !RegExpPrototypeExec(linkValueRegExp, value)) {
      throw new ERR_INVALID_ARG_VALUE(
        name,
        value,
        'must be an array or string of format "</styles.css>; rel=preload; as=style"'
      );
    }
  }
  function validateLinkHeaderValue(hints) {
    if (typeof hints === "string") {
      validateLinkHeaderFormat(hints, "hints");
      return hints;
    } else if (ArrayIsArray(hints)) {
      const hintsLength = hints.length;
      let result = "";
      if (hintsLength === 0) {
        return result;
      }
      for (let i = 0; i < hintsLength; i++) {
        const link = hints[i];
        validateLinkHeaderFormat(link, "hints");
        result += link;
        if (i !== hintsLength - 1) {
          result += ", ";
        }
      }
      return result;
    }
    throw new ERR_INVALID_ARG_VALUE(
      "hints",
      hints,
      'must be an array or string of format "</styles.css>; rel=preload; as=style"'
    );
  }
  validators = {
    isInt32,
    isUint32,
    parseFileMode,
    validateArray,
    validateStringArray,
    validateBooleanArray,
    validateAbortSignalArray,
    validateBoolean,
    validateBuffer,
    validateDictionary,
    validateEncoding,
    validateFunction,
    validateInt32,
    validateInteger,
    validateNumber,
    validateObject,
    validateOneOf,
    validatePlainFunction,
    validatePort,
    validateSignalName,
    validateString,
    validateUint32,
    validateUndefined,
    validateUnion,
    validateAbortSignal,
    validateLinkHeaderValue
  };
  return validators;
}
var endOfStream = { exports: {} };
var process$1;
var hasRequiredProcess;
function requireProcess() {
  if (hasRequiredProcess) return process$1;
  hasRequiredProcess = 1;
  process$1 = commonjsGlobal.process;
  return process$1;
}
var utils$1;
var hasRequiredUtils$1;
function requireUtils$1() {
  if (hasRequiredUtils$1) return utils$1;
  hasRequiredUtils$1 = 1;
  const { SymbolAsyncIterator, SymbolIterator, SymbolFor } = requirePrimordials();
  const kIsDestroyed = SymbolFor("nodejs.stream.destroyed");
  const kIsErrored = SymbolFor("nodejs.stream.errored");
  const kIsReadable = SymbolFor("nodejs.stream.readable");
  const kIsWritable = SymbolFor("nodejs.stream.writable");
  const kIsDisturbed = SymbolFor("nodejs.stream.disturbed");
  const kIsClosedPromise = SymbolFor("nodejs.webstream.isClosedPromise");
  const kControllerErrorFunction = SymbolFor("nodejs.webstream.controllerErrorFunction");
  function isReadableNodeStream(obj, strict = false) {
    var _obj$_readableState;
    return !!(obj && typeof obj.pipe === "function" && typeof obj.on === "function" && (!strict || typeof obj.pause === "function" && typeof obj.resume === "function") && (!obj._writableState || ((_obj$_readableState = obj._readableState) === null || _obj$_readableState === void 0 ? void 0 : _obj$_readableState.readable) !== false) && // Duplex
    (!obj._writableState || obj._readableState));
  }
  function isWritableNodeStream(obj) {
    var _obj$_writableState;
    return !!(obj && typeof obj.write === "function" && typeof obj.on === "function" && (!obj._readableState || ((_obj$_writableState = obj._writableState) === null || _obj$_writableState === void 0 ? void 0 : _obj$_writableState.writable) !== false));
  }
  function isDuplexNodeStream(obj) {
    return !!(obj && typeof obj.pipe === "function" && obj._readableState && typeof obj.on === "function" && typeof obj.write === "function");
  }
  function isNodeStream(obj) {
    return obj && (obj._readableState || obj._writableState || typeof obj.write === "function" && typeof obj.on === "function" || typeof obj.pipe === "function" && typeof obj.on === "function");
  }
  function isReadableStream(obj) {
    return !!(obj && !isNodeStream(obj) && typeof obj.pipeThrough === "function" && typeof obj.getReader === "function" && typeof obj.cancel === "function");
  }
  function isWritableStream(obj) {
    return !!(obj && !isNodeStream(obj) && typeof obj.getWriter === "function" && typeof obj.abort === "function");
  }
  function isTransformStream(obj) {
    return !!(obj && !isNodeStream(obj) && typeof obj.readable === "object" && typeof obj.writable === "object");
  }
  function isWebStream(obj) {
    return isReadableStream(obj) || isWritableStream(obj) || isTransformStream(obj);
  }
  function isIterable(obj, isAsync) {
    if (obj == null) return false;
    if (isAsync === true) return typeof obj[SymbolAsyncIterator] === "function";
    if (isAsync === false) return typeof obj[SymbolIterator] === "function";
    return typeof obj[SymbolAsyncIterator] === "function" || typeof obj[SymbolIterator] === "function";
  }
  function isDestroyed(stream2) {
    if (!isNodeStream(stream2)) return null;
    const wState = stream2._writableState;
    const rState = stream2._readableState;
    const state2 = wState || rState;
    return !!(stream2.destroyed || stream2[kIsDestroyed] || state2 !== null && state2 !== void 0 && state2.destroyed);
  }
  function isWritableEnded(stream2) {
    if (!isWritableNodeStream(stream2)) return null;
    if (stream2.writableEnded === true) return true;
    const wState = stream2._writableState;
    if (wState !== null && wState !== void 0 && wState.errored) return false;
    if (typeof (wState === null || wState === void 0 ? void 0 : wState.ended) !== "boolean") return null;
    return wState.ended;
  }
  function isWritableFinished(stream2, strict) {
    if (!isWritableNodeStream(stream2)) return null;
    if (stream2.writableFinished === true) return true;
    const wState = stream2._writableState;
    if (wState !== null && wState !== void 0 && wState.errored) return false;
    if (typeof (wState === null || wState === void 0 ? void 0 : wState.finished) !== "boolean") return null;
    return !!(wState.finished || strict === false && wState.ended === true && wState.length === 0);
  }
  function isReadableEnded(stream2) {
    if (!isReadableNodeStream(stream2)) return null;
    if (stream2.readableEnded === true) return true;
    const rState = stream2._readableState;
    if (!rState || rState.errored) return false;
    if (typeof (rState === null || rState === void 0 ? void 0 : rState.ended) !== "boolean") return null;
    return rState.ended;
  }
  function isReadableFinished(stream2, strict) {
    if (!isReadableNodeStream(stream2)) return null;
    const rState = stream2._readableState;
    if (rState !== null && rState !== void 0 && rState.errored) return false;
    if (typeof (rState === null || rState === void 0 ? void 0 : rState.endEmitted) !== "boolean") return null;
    return !!(rState.endEmitted || strict === false && rState.ended === true && rState.length === 0);
  }
  function isReadable(stream2) {
    if (stream2 && stream2[kIsReadable] != null) return stream2[kIsReadable];
    if (typeof (stream2 === null || stream2 === void 0 ? void 0 : stream2.readable) !== "boolean") return null;
    if (isDestroyed(stream2)) return false;
    return isReadableNodeStream(stream2) && stream2.readable && !isReadableFinished(stream2);
  }
  function isWritable(stream2) {
    if (stream2 && stream2[kIsWritable] != null) return stream2[kIsWritable];
    if (typeof (stream2 === null || stream2 === void 0 ? void 0 : stream2.writable) !== "boolean") return null;
    if (isDestroyed(stream2)) return false;
    return isWritableNodeStream(stream2) && stream2.writable && !isWritableEnded(stream2);
  }
  function isFinished(stream2, opts) {
    if (!isNodeStream(stream2)) {
      return null;
    }
    if (isDestroyed(stream2)) {
      return true;
    }
    if ((opts === null || opts === void 0 ? void 0 : opts.readable) !== false && isReadable(stream2)) {
      return false;
    }
    if ((opts === null || opts === void 0 ? void 0 : opts.writable) !== false && isWritable(stream2)) {
      return false;
    }
    return true;
  }
  function isWritableErrored(stream2) {
    var _stream$_writableStat, _stream$_writableStat2;
    if (!isNodeStream(stream2)) {
      return null;
    }
    if (stream2.writableErrored) {
      return stream2.writableErrored;
    }
    return (_stream$_writableStat = (_stream$_writableStat2 = stream2._writableState) === null || _stream$_writableStat2 === void 0 ? void 0 : _stream$_writableStat2.errored) !== null && _stream$_writableStat !== void 0 ? _stream$_writableStat : null;
  }
  function isReadableErrored(stream2) {
    var _stream$_readableStat, _stream$_readableStat2;
    if (!isNodeStream(stream2)) {
      return null;
    }
    if (stream2.readableErrored) {
      return stream2.readableErrored;
    }
    return (_stream$_readableStat = (_stream$_readableStat2 = stream2._readableState) === null || _stream$_readableStat2 === void 0 ? void 0 : _stream$_readableStat2.errored) !== null && _stream$_readableStat !== void 0 ? _stream$_readableStat : null;
  }
  function isClosed(stream2) {
    if (!isNodeStream(stream2)) {
      return null;
    }
    if (typeof stream2.closed === "boolean") {
      return stream2.closed;
    }
    const wState = stream2._writableState;
    const rState = stream2._readableState;
    if (typeof (wState === null || wState === void 0 ? void 0 : wState.closed) === "boolean" || typeof (rState === null || rState === void 0 ? void 0 : rState.closed) === "boolean") {
      return (wState === null || wState === void 0 ? void 0 : wState.closed) || (rState === null || rState === void 0 ? void 0 : rState.closed);
    }
    if (typeof stream2._closed === "boolean" && isOutgoingMessage(stream2)) {
      return stream2._closed;
    }
    return null;
  }
  function isOutgoingMessage(stream2) {
    return typeof stream2._closed === "boolean" && typeof stream2._defaultKeepAlive === "boolean" && typeof stream2._removedConnection === "boolean" && typeof stream2._removedContLen === "boolean";
  }
  function isServerResponse(stream2) {
    return typeof stream2._sent100 === "boolean" && isOutgoingMessage(stream2);
  }
  function isServerRequest(stream2) {
    var _stream$req;
    return typeof stream2._consuming === "boolean" && typeof stream2._dumped === "boolean" && ((_stream$req = stream2.req) === null || _stream$req === void 0 ? void 0 : _stream$req.upgradeOrConnect) === void 0;
  }
  function willEmitClose(stream2) {
    if (!isNodeStream(stream2)) return null;
    const wState = stream2._writableState;
    const rState = stream2._readableState;
    const state2 = wState || rState;
    return !state2 && isServerResponse(stream2) || !!(state2 && state2.autoDestroy && state2.emitClose && state2.closed === false);
  }
  function isDisturbed(stream2) {
    var _stream$kIsDisturbed;
    return !!(stream2 && ((_stream$kIsDisturbed = stream2[kIsDisturbed]) !== null && _stream$kIsDisturbed !== void 0 ? _stream$kIsDisturbed : stream2.readableDidRead || stream2.readableAborted));
  }
  function isErrored(stream2) {
    var _ref, _ref2, _ref3, _ref4, _ref5, _stream$kIsErrored, _stream$_readableStat3, _stream$_writableStat3, _stream$_readableStat4, _stream$_writableStat4;
    return !!(stream2 && ((_ref = (_ref2 = (_ref3 = (_ref4 = (_ref5 = (_stream$kIsErrored = stream2[kIsErrored]) !== null && _stream$kIsErrored !== void 0 ? _stream$kIsErrored : stream2.readableErrored) !== null && _ref5 !== void 0 ? _ref5 : stream2.writableErrored) !== null && _ref4 !== void 0 ? _ref4 : (_stream$_readableStat3 = stream2._readableState) === null || _stream$_readableStat3 === void 0 ? void 0 : _stream$_readableStat3.errorEmitted) !== null && _ref3 !== void 0 ? _ref3 : (_stream$_writableStat3 = stream2._writableState) === null || _stream$_writableStat3 === void 0 ? void 0 : _stream$_writableStat3.errorEmitted) !== null && _ref2 !== void 0 ? _ref2 : (_stream$_readableStat4 = stream2._readableState) === null || _stream$_readableStat4 === void 0 ? void 0 : _stream$_readableStat4.errored) !== null && _ref !== void 0 ? _ref : (_stream$_writableStat4 = stream2._writableState) === null || _stream$_writableStat4 === void 0 ? void 0 : _stream$_writableStat4.errored));
  }
  utils$1 = {
    isDestroyed,
    kIsDestroyed,
    isDisturbed,
    kIsDisturbed,
    isErrored,
    kIsErrored,
    isReadable,
    kIsReadable,
    kIsClosedPromise,
    kControllerErrorFunction,
    kIsWritable,
    isClosed,
    isDuplexNodeStream,
    isFinished,
    isIterable,
    isReadableNodeStream,
    isReadableStream,
    isReadableEnded,
    isReadableFinished,
    isReadableErrored,
    isNodeStream,
    isWebStream,
    isWritable,
    isWritableNodeStream,
    isWritableStream,
    isWritableEnded,
    isWritableFinished,
    isWritableErrored,
    isServerRequest,
    isServerResponse,
    willEmitClose,
    isTransformStream
  };
  return utils$1;
}
var hasRequiredEndOfStream;
function requireEndOfStream() {
  if (hasRequiredEndOfStream) return endOfStream.exports;
  hasRequiredEndOfStream = 1;
  const process2 = requireProcess();
  const { AbortError, codes } = requireErrors();
  const { ERR_INVALID_ARG_TYPE, ERR_STREAM_PREMATURE_CLOSE } = codes;
  const { kEmptyObject, once } = requireUtil$1();
  const { validateAbortSignal, validateFunction, validateObject, validateBoolean } = requireValidators();
  const { Promise: Promise2, PromisePrototypeThen, SymbolDispose } = requirePrimordials();
  const {
    isClosed,
    isReadable,
    isReadableNodeStream,
    isReadableStream,
    isReadableFinished,
    isReadableErrored,
    isWritable,
    isWritableNodeStream,
    isWritableStream,
    isWritableFinished,
    isWritableErrored,
    isNodeStream,
    willEmitClose: _willEmitClose,
    kIsClosedPromise
  } = requireUtils$1();
  let addAbortListener;
  function isRequest(stream2) {
    return stream2.setHeader && typeof stream2.abort === "function";
  }
  const nop = () => {
  };
  function eos(stream2, options, callback) {
    var _options$readable, _options$writable;
    if (arguments.length === 2) {
      callback = options;
      options = kEmptyObject;
    } else if (options == null) {
      options = kEmptyObject;
    } else {
      validateObject(options, "options");
    }
    validateFunction(callback, "callback");
    validateAbortSignal(options.signal, "options.signal");
    callback = once(callback);
    if (isReadableStream(stream2) || isWritableStream(stream2)) {
      return eosWeb(stream2, options, callback);
    }
    if (!isNodeStream(stream2)) {
      throw new ERR_INVALID_ARG_TYPE("stream", ["ReadableStream", "WritableStream", "Stream"], stream2);
    }
    const readable2 = (_options$readable = options.readable) !== null && _options$readable !== void 0 ? _options$readable : isReadableNodeStream(stream2);
    const writable2 = (_options$writable = options.writable) !== null && _options$writable !== void 0 ? _options$writable : isWritableNodeStream(stream2);
    const wState = stream2._writableState;
    const rState = stream2._readableState;
    const onlegacyfinish = () => {
      if (!stream2.writable) {
        onfinish();
      }
    };
    let willEmitClose = _willEmitClose(stream2) && isReadableNodeStream(stream2) === readable2 && isWritableNodeStream(stream2) === writable2;
    let writableFinished = isWritableFinished(stream2, false);
    const onfinish = () => {
      writableFinished = true;
      if (stream2.destroyed) {
        willEmitClose = false;
      }
      if (willEmitClose && (!stream2.readable || readable2)) {
        return;
      }
      if (!readable2 || readableFinished) {
        callback.call(stream2);
      }
    };
    let readableFinished = isReadableFinished(stream2, false);
    const onend = () => {
      readableFinished = true;
      if (stream2.destroyed) {
        willEmitClose = false;
      }
      if (willEmitClose && (!stream2.writable || writable2)) {
        return;
      }
      if (!writable2 || writableFinished) {
        callback.call(stream2);
      }
    };
    const onerror = (err) => {
      callback.call(stream2, err);
    };
    let closed = isClosed(stream2);
    const onclose = () => {
      closed = true;
      const errored = isWritableErrored(stream2) || isReadableErrored(stream2);
      if (errored && typeof errored !== "boolean") {
        return callback.call(stream2, errored);
      }
      if (readable2 && !readableFinished && isReadableNodeStream(stream2, true)) {
        if (!isReadableFinished(stream2, false)) return callback.call(stream2, new ERR_STREAM_PREMATURE_CLOSE());
      }
      if (writable2 && !writableFinished) {
        if (!isWritableFinished(stream2, false)) return callback.call(stream2, new ERR_STREAM_PREMATURE_CLOSE());
      }
      callback.call(stream2);
    };
    const onclosed = () => {
      closed = true;
      const errored = isWritableErrored(stream2) || isReadableErrored(stream2);
      if (errored && typeof errored !== "boolean") {
        return callback.call(stream2, errored);
      }
      callback.call(stream2);
    };
    const onrequest = () => {
      stream2.req.on("finish", onfinish);
    };
    if (isRequest(stream2)) {
      stream2.on("complete", onfinish);
      if (!willEmitClose) {
        stream2.on("abort", onclose);
      }
      if (stream2.req) {
        onrequest();
      } else {
        stream2.on("request", onrequest);
      }
    } else if (writable2 && !wState) {
      stream2.on("end", onlegacyfinish);
      stream2.on("close", onlegacyfinish);
    }
    if (!willEmitClose && typeof stream2.aborted === "boolean") {
      stream2.on("aborted", onclose);
    }
    stream2.on("end", onend);
    stream2.on("finish", onfinish);
    if (options.error !== false) {
      stream2.on("error", onerror);
    }
    stream2.on("close", onclose);
    if (closed) {
      process2.nextTick(onclose);
    } else if (wState !== null && wState !== void 0 && wState.errorEmitted || rState !== null && rState !== void 0 && rState.errorEmitted) {
      if (!willEmitClose) {
        process2.nextTick(onclosed);
      }
    } else if (!readable2 && (!willEmitClose || isReadable(stream2)) && (writableFinished || isWritable(stream2) === false)) {
      process2.nextTick(onclosed);
    } else if (!writable2 && (!willEmitClose || isWritable(stream2)) && (readableFinished || isReadable(stream2) === false)) {
      process2.nextTick(onclosed);
    } else if (rState && stream2.req && stream2.aborted) {
      process2.nextTick(onclosed);
    }
    const cleanup = () => {
      callback = nop;
      stream2.removeListener("aborted", onclose);
      stream2.removeListener("complete", onfinish);
      stream2.removeListener("abort", onclose);
      stream2.removeListener("request", onrequest);
      if (stream2.req) stream2.req.removeListener("finish", onfinish);
      stream2.removeListener("end", onlegacyfinish);
      stream2.removeListener("close", onlegacyfinish);
      stream2.removeListener("finish", onfinish);
      stream2.removeListener("end", onend);
      stream2.removeListener("error", onerror);
      stream2.removeListener("close", onclose);
    };
    if (options.signal && !closed) {
      const abort = () => {
        const endCallback = callback;
        cleanup();
        endCallback.call(
          stream2,
          new AbortError(void 0, {
            cause: options.signal.reason
          })
        );
      };
      if (options.signal.aborted) {
        process2.nextTick(abort);
      } else {
        addAbortListener = addAbortListener || requireUtil$1().addAbortListener;
        const disposable = addAbortListener(options.signal, abort);
        const originalCallback = callback;
        callback = once((...args) => {
          disposable[SymbolDispose]();
          originalCallback.apply(stream2, args);
        });
      }
    }
    return cleanup;
  }
  function eosWeb(stream2, options, callback) {
    let isAborted = false;
    let abort = nop;
    if (options.signal) {
      abort = () => {
        isAborted = true;
        callback.call(
          stream2,
          new AbortError(void 0, {
            cause: options.signal.reason
          })
        );
      };
      if (options.signal.aborted) {
        process2.nextTick(abort);
      } else {
        addAbortListener = addAbortListener || requireUtil$1().addAbortListener;
        const disposable = addAbortListener(options.signal, abort);
        const originalCallback = callback;
        callback = once((...args) => {
          disposable[SymbolDispose]();
          originalCallback.apply(stream2, args);
        });
      }
    }
    const resolverFn = (...args) => {
      if (!isAborted) {
        process2.nextTick(() => callback.apply(stream2, args));
      }
    };
    PromisePrototypeThen(stream2[kIsClosedPromise].promise, resolverFn, resolverFn);
    return nop;
  }
  function finished(stream2, opts) {
    var _opts;
    let autoCleanup = false;
    if (opts === null) {
      opts = kEmptyObject;
    }
    if ((_opts = opts) !== null && _opts !== void 0 && _opts.cleanup) {
      validateBoolean(opts.cleanup, "cleanup");
      autoCleanup = opts.cleanup;
    }
    return new Promise2((resolve, reject) => {
      const cleanup = eos(stream2, opts, (err) => {
        if (autoCleanup) {
          cleanup();
        }
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  endOfStream.exports = eos;
  endOfStream.exports.finished = finished;
  return endOfStream.exports;
}
var destroy_1;
var hasRequiredDestroy;
function requireDestroy() {
  if (hasRequiredDestroy) return destroy_1;
  hasRequiredDestroy = 1;
  const process2 = requireProcess();
  const {
    aggregateTwoErrors,
    codes: { ERR_MULTIPLE_CALLBACK },
    AbortError
  } = requireErrors();
  const { Symbol: Symbol2 } = requirePrimordials();
  const { kIsDestroyed, isDestroyed, isFinished, isServerRequest } = requireUtils$1();
  const kDestroy = Symbol2("kDestroy");
  const kConstruct = Symbol2("kConstruct");
  function checkError(err, w, r) {
    if (err) {
      err.stack;
      if (w && !w.errored) {
        w.errored = err;
      }
      if (r && !r.errored) {
        r.errored = err;
      }
    }
  }
  function destroy(err, cb) {
    const r = this._readableState;
    const w = this._writableState;
    const s = w || r;
    if (w !== null && w !== void 0 && w.destroyed || r !== null && r !== void 0 && r.destroyed) {
      if (typeof cb === "function") {
        cb();
      }
      return this;
    }
    checkError(err, w, r);
    if (w) {
      w.destroyed = true;
    }
    if (r) {
      r.destroyed = true;
    }
    if (!s.constructed) {
      this.once(kDestroy, function(er) {
        _destroy(this, aggregateTwoErrors(er, err), cb);
      });
    } else {
      _destroy(this, err, cb);
    }
    return this;
  }
  function _destroy(self2, err, cb) {
    let called = false;
    function onDestroy(err2) {
      if (called) {
        return;
      }
      called = true;
      const r = self2._readableState;
      const w = self2._writableState;
      checkError(err2, w, r);
      if (w) {
        w.closed = true;
      }
      if (r) {
        r.closed = true;
      }
      if (typeof cb === "function") {
        cb(err2);
      }
      if (err2) {
        process2.nextTick(emitErrorCloseNT, self2, err2);
      } else {
        process2.nextTick(emitCloseNT, self2);
      }
    }
    try {
      self2._destroy(err || null, onDestroy);
    } catch (err2) {
      onDestroy(err2);
    }
  }
  function emitErrorCloseNT(self2, err) {
    emitErrorNT(self2, err);
    emitCloseNT(self2);
  }
  function emitCloseNT(self2) {
    const r = self2._readableState;
    const w = self2._writableState;
    if (w) {
      w.closeEmitted = true;
    }
    if (r) {
      r.closeEmitted = true;
    }
    if (w !== null && w !== void 0 && w.emitClose || r !== null && r !== void 0 && r.emitClose) {
      self2.emit("close");
    }
  }
  function emitErrorNT(self2, err) {
    const r = self2._readableState;
    const w = self2._writableState;
    if (w !== null && w !== void 0 && w.errorEmitted || r !== null && r !== void 0 && r.errorEmitted) {
      return;
    }
    if (w) {
      w.errorEmitted = true;
    }
    if (r) {
      r.errorEmitted = true;
    }
    self2.emit("error", err);
  }
  function undestroy() {
    const r = this._readableState;
    const w = this._writableState;
    if (r) {
      r.constructed = true;
      r.closed = false;
      r.closeEmitted = false;
      r.destroyed = false;
      r.errored = null;
      r.errorEmitted = false;
      r.reading = false;
      r.ended = r.readable === false;
      r.endEmitted = r.readable === false;
    }
    if (w) {
      w.constructed = true;
      w.destroyed = false;
      w.closed = false;
      w.closeEmitted = false;
      w.errored = null;
      w.errorEmitted = false;
      w.finalCalled = false;
      w.prefinished = false;
      w.ended = w.writable === false;
      w.ending = w.writable === false;
      w.finished = w.writable === false;
    }
  }
  function errorOrDestroy(stream2, err, sync) {
    const r = stream2._readableState;
    const w = stream2._writableState;
    if (w !== null && w !== void 0 && w.destroyed || r !== null && r !== void 0 && r.destroyed) {
      return this;
    }
    if (r !== null && r !== void 0 && r.autoDestroy || w !== null && w !== void 0 && w.autoDestroy)
      stream2.destroy(err);
    else if (err) {
      err.stack;
      if (w && !w.errored) {
        w.errored = err;
      }
      if (r && !r.errored) {
        r.errored = err;
      }
      if (sync) {
        process2.nextTick(emitErrorNT, stream2, err);
      } else {
        emitErrorNT(stream2, err);
      }
    }
  }
  function construct(stream2, cb) {
    if (typeof stream2._construct !== "function") {
      return;
    }
    const r = stream2._readableState;
    const w = stream2._writableState;
    if (r) {
      r.constructed = false;
    }
    if (w) {
      w.constructed = false;
    }
    stream2.once(kConstruct, cb);
    if (stream2.listenerCount(kConstruct) > 1) {
      return;
    }
    process2.nextTick(constructNT, stream2);
  }
  function constructNT(stream2) {
    let called = false;
    function onConstruct(err) {
      if (called) {
        errorOrDestroy(stream2, err !== null && err !== void 0 ? err : new ERR_MULTIPLE_CALLBACK());
        return;
      }
      called = true;
      const r = stream2._readableState;
      const w = stream2._writableState;
      const s = w || r;
      if (r) {
        r.constructed = true;
      }
      if (w) {
        w.constructed = true;
      }
      if (s.destroyed) {
        stream2.emit(kDestroy, err);
      } else if (err) {
        errorOrDestroy(stream2, err, true);
      } else {
        process2.nextTick(emitConstructNT, stream2);
      }
    }
    try {
      stream2._construct((err) => {
        process2.nextTick(onConstruct, err);
      });
    } catch (err) {
      process2.nextTick(onConstruct, err);
    }
  }
  function emitConstructNT(stream2) {
    stream2.emit(kConstruct);
  }
  function isRequest(stream2) {
    return (stream2 === null || stream2 === void 0 ? void 0 : stream2.setHeader) && typeof stream2.abort === "function";
  }
  function emitCloseLegacy(stream2) {
    stream2.emit("close");
  }
  function emitErrorCloseLegacy(stream2, err) {
    stream2.emit("error", err);
    process2.nextTick(emitCloseLegacy, stream2);
  }
  function destroyer(stream2, err) {
    if (!stream2 || isDestroyed(stream2)) {
      return;
    }
    if (!err && !isFinished(stream2)) {
      err = new AbortError();
    }
    if (isServerRequest(stream2)) {
      stream2.socket = null;
      stream2.destroy(err);
    } else if (isRequest(stream2)) {
      stream2.abort();
    } else if (isRequest(stream2.req)) {
      stream2.req.abort();
    } else if (typeof stream2.destroy === "function") {
      stream2.destroy(err);
    } else if (typeof stream2.close === "function") {
      stream2.close();
    } else if (err) {
      process2.nextTick(emitErrorCloseLegacy, stream2, err);
    } else {
      process2.nextTick(emitCloseLegacy, stream2);
    }
    if (!stream2.destroyed) {
      stream2[kIsDestroyed] = true;
    }
  }
  destroy_1 = {
    construct,
    destroyer,
    destroy,
    undestroy,
    errorOrDestroy
  };
  return destroy_1;
}
var legacy;
var hasRequiredLegacy;
function requireLegacy() {
  if (hasRequiredLegacy) return legacy;
  hasRequiredLegacy = 1;
  const { ArrayIsArray, ObjectSetPrototypeOf } = requirePrimordials();
  const { EventEmitter: EE } = require$$0$6;
  function Stream(opts) {
    EE.call(this, opts);
  }
  ObjectSetPrototypeOf(Stream.prototype, EE.prototype);
  ObjectSetPrototypeOf(Stream, EE);
  Stream.prototype.pipe = function(dest, options) {
    const source = this;
    function ondata(chunk) {
      if (dest.writable && dest.write(chunk) === false && source.pause) {
        source.pause();
      }
    }
    source.on("data", ondata);
    function ondrain() {
      if (source.readable && source.resume) {
        source.resume();
      }
    }
    dest.on("drain", ondrain);
    if (!dest._isStdio && (!options || options.end !== false)) {
      source.on("end", onend);
      source.on("close", onclose);
    }
    let didOnEnd = false;
    function onend() {
      if (didOnEnd) return;
      didOnEnd = true;
      dest.end();
    }
    function onclose() {
      if (didOnEnd) return;
      didOnEnd = true;
      if (typeof dest.destroy === "function") dest.destroy();
    }
    function onerror(er) {
      cleanup();
      if (EE.listenerCount(this, "error") === 0) {
        this.emit("error", er);
      }
    }
    prependListener(source, "error", onerror);
    prependListener(dest, "error", onerror);
    function cleanup() {
      source.removeListener("data", ondata);
      dest.removeListener("drain", ondrain);
      source.removeListener("end", onend);
      source.removeListener("close", onclose);
      source.removeListener("error", onerror);
      dest.removeListener("error", onerror);
      source.removeListener("end", cleanup);
      source.removeListener("close", cleanup);
      dest.removeListener("close", cleanup);
    }
    source.on("end", cleanup);
    source.on("close", cleanup);
    dest.on("close", cleanup);
    dest.emit("pipe", source);
    return dest;
  };
  function prependListener(emitter, event, fn) {
    if (typeof emitter.prependListener === "function") return emitter.prependListener(event, fn);
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);
    else if (ArrayIsArray(emitter._events[event])) emitter._events[event].unshift(fn);
    else emitter._events[event] = [fn, emitter._events[event]];
  }
  legacy = {
    Stream,
    prependListener
  };
  return legacy;
}
var addAbortSignal = { exports: {} };
var hasRequiredAddAbortSignal;
function requireAddAbortSignal() {
  if (hasRequiredAddAbortSignal) return addAbortSignal.exports;
  hasRequiredAddAbortSignal = 1;
  (function(module2) {
    const { SymbolDispose } = requirePrimordials();
    const { AbortError, codes } = requireErrors();
    const { isNodeStream, isWebStream, kControllerErrorFunction } = requireUtils$1();
    const eos = requireEndOfStream();
    const { ERR_INVALID_ARG_TYPE } = codes;
    let addAbortListener;
    const validateAbortSignal = (signal, name) => {
      if (typeof signal !== "object" || !("aborted" in signal)) {
        throw new ERR_INVALID_ARG_TYPE(name, "AbortSignal", signal);
      }
    };
    module2.exports.addAbortSignal = function addAbortSignal2(signal, stream2) {
      validateAbortSignal(signal, "signal");
      if (!isNodeStream(stream2) && !isWebStream(stream2)) {
        throw new ERR_INVALID_ARG_TYPE("stream", ["ReadableStream", "WritableStream", "Stream"], stream2);
      }
      return module2.exports.addAbortSignalNoValidate(signal, stream2);
    };
    module2.exports.addAbortSignalNoValidate = function(signal, stream2) {
      if (typeof signal !== "object" || !("aborted" in signal)) {
        return stream2;
      }
      const onAbort = isNodeStream(stream2) ? () => {
        stream2.destroy(
          new AbortError(void 0, {
            cause: signal.reason
          })
        );
      } : () => {
        stream2[kControllerErrorFunction](
          new AbortError(void 0, {
            cause: signal.reason
          })
        );
      };
      if (signal.aborted) {
        onAbort();
      } else {
        addAbortListener = addAbortListener || requireUtil$1().addAbortListener;
        const disposable = addAbortListener(signal, onAbort);
        eos(stream2, disposable[SymbolDispose]);
      }
      return stream2;
    };
  })(addAbortSignal);
  return addAbortSignal.exports;
}
var buffer_list;
var hasRequiredBuffer_list;
function requireBuffer_list() {
  if (hasRequiredBuffer_list) return buffer_list;
  hasRequiredBuffer_list = 1;
  const { StringPrototypeSlice, SymbolIterator, TypedArrayPrototypeSet, Uint8Array: Uint8Array2 } = requirePrimordials();
  const { Buffer: Buffer2 } = require$$0$5;
  const { inspect: inspect2 } = requireUtil$1();
  buffer_list = class BufferList {
    constructor() {
      this.head = null;
      this.tail = null;
      this.length = 0;
    }
    push(v) {
      const entry = {
        data: v,
        next: null
      };
      if (this.length > 0) this.tail.next = entry;
      else this.head = entry;
      this.tail = entry;
      ++this.length;
    }
    unshift(v) {
      const entry = {
        data: v,
        next: this.head
      };
      if (this.length === 0) this.tail = entry;
      this.head = entry;
      ++this.length;
    }
    shift() {
      if (this.length === 0) return;
      const ret = this.head.data;
      if (this.length === 1) this.head = this.tail = null;
      else this.head = this.head.next;
      --this.length;
      return ret;
    }
    clear() {
      this.head = this.tail = null;
      this.length = 0;
    }
    join(s) {
      if (this.length === 0) return "";
      let p = this.head;
      let ret = "" + p.data;
      while ((p = p.next) !== null) ret += s + p.data;
      return ret;
    }
    concat(n) {
      if (this.length === 0) return Buffer2.alloc(0);
      const ret = Buffer2.allocUnsafe(n >>> 0);
      let p = this.head;
      let i = 0;
      while (p) {
        TypedArrayPrototypeSet(ret, p.data, i);
        i += p.data.length;
        p = p.next;
      }
      return ret;
    }
    // Consumes a specified amount of bytes or characters from the buffered data.
    consume(n, hasStrings) {
      const data = this.head.data;
      if (n < data.length) {
        const slice = data.slice(0, n);
        this.head.data = data.slice(n);
        return slice;
      }
      if (n === data.length) {
        return this.shift();
      }
      return hasStrings ? this._getString(n) : this._getBuffer(n);
    }
    first() {
      return this.head.data;
    }
    *[SymbolIterator]() {
      for (let p = this.head; p; p = p.next) {
        yield p.data;
      }
    }
    // Consumes a specified amount of characters from the buffered data.
    _getString(n) {
      let ret = "";
      let p = this.head;
      let c = 0;
      do {
        const str = p.data;
        if (n > str.length) {
          ret += str;
          n -= str.length;
        } else {
          if (n === str.length) {
            ret += str;
            ++c;
            if (p.next) this.head = p.next;
            else this.head = this.tail = null;
          } else {
            ret += StringPrototypeSlice(str, 0, n);
            this.head = p;
            p.data = StringPrototypeSlice(str, n);
          }
          break;
        }
        ++c;
      } while ((p = p.next) !== null);
      this.length -= c;
      return ret;
    }
    // Consumes a specified amount of bytes from the buffered data.
    _getBuffer(n) {
      const ret = Buffer2.allocUnsafe(n);
      const retLen = n;
      let p = this.head;
      let c = 0;
      do {
        const buf = p.data;
        if (n > buf.length) {
          TypedArrayPrototypeSet(ret, buf, retLen - n);
          n -= buf.length;
        } else {
          if (n === buf.length) {
            TypedArrayPrototypeSet(ret, buf, retLen - n);
            ++c;
            if (p.next) this.head = p.next;
            else this.head = this.tail = null;
          } else {
            TypedArrayPrototypeSet(ret, new Uint8Array2(buf.buffer, buf.byteOffset, n), retLen - n);
            this.head = p;
            p.data = buf.slice(n);
          }
          break;
        }
        ++c;
      } while ((p = p.next) !== null);
      this.length -= c;
      return ret;
    }
    // Make sure the linked list only shows the minimal necessary information.
    [Symbol.for("nodejs.util.inspect.custom")](_, options) {
      return inspect2(this, {
        ...options,
        // Only inspect one level.
        depth: 0,
        // It should not recurse.
        customInspect: false
      });
    }
  };
  return buffer_list;
}
var state;
var hasRequiredState;
function requireState() {
  if (hasRequiredState) return state;
  hasRequiredState = 1;
  const { MathFloor, NumberIsInteger } = requirePrimordials();
  const { validateInteger } = requireValidators();
  const { ERR_INVALID_ARG_VALUE } = requireErrors().codes;
  let defaultHighWaterMarkBytes = 16 * 1024;
  let defaultHighWaterMarkObjectMode = 16;
  function highWaterMarkFrom(options, isDuplex, duplexKey) {
    return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
  }
  function getDefaultHighWaterMark(objectMode) {
    return objectMode ? defaultHighWaterMarkObjectMode : defaultHighWaterMarkBytes;
  }
  function setDefaultHighWaterMark(objectMode, value) {
    validateInteger(value, "value", 0);
    if (objectMode) {
      defaultHighWaterMarkObjectMode = value;
    } else {
      defaultHighWaterMarkBytes = value;
    }
  }
  function getHighWaterMark(state2, options, duplexKey, isDuplex) {
    const hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
    if (hwm != null) {
      if (!NumberIsInteger(hwm) || hwm < 0) {
        const name = isDuplex ? `options.${duplexKey}` : "options.highWaterMark";
        throw new ERR_INVALID_ARG_VALUE(name, hwm);
      }
      return MathFloor(hwm);
    }
    return getDefaultHighWaterMark(state2.objectMode);
  }
  state = {
    getHighWaterMark,
    getDefaultHighWaterMark,
    setDefaultHighWaterMark
  };
  return state;
}
var string_decoder = {};
var safeBuffer = { exports: {} };
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var hasRequiredSafeBuffer;
function requireSafeBuffer() {
  if (hasRequiredSafeBuffer) return safeBuffer.exports;
  hasRequiredSafeBuffer = 1;
  (function(module2, exports) {
    var buffer = require$$0$5;
    var Buffer2 = buffer.Buffer;
    function copyProps(src2, dst) {
      for (var key in src2) {
        dst[key] = src2[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module2.exports = buffer;
    } else {
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    SafeBuffer.prototype = Object.create(Buffer2.prototype);
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  })(safeBuffer, safeBuffer.exports);
  return safeBuffer.exports;
}
var hasRequiredString_decoder;
function requireString_decoder() {
  if (hasRequiredString_decoder) return string_decoder;
  hasRequiredString_decoder = 1;
  var Buffer2 = requireSafeBuffer().Buffer;
  var isEncoding = Buffer2.isEncoding || function(encoding) {
    encoding = "" + encoding;
    switch (encoding && encoding.toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
      case "raw":
        return true;
      default:
        return false;
    }
  };
  function _normalizeEncoding(enc) {
    if (!enc) return "utf8";
    var retried;
    while (true) {
      switch (enc) {
        case "utf8":
        case "utf-8":
          return "utf8";
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return "utf16le";
        case "latin1":
        case "binary":
          return "latin1";
        case "base64":
        case "ascii":
        case "hex":
          return enc;
        default:
          if (retried) return;
          enc = ("" + enc).toLowerCase();
          retried = true;
      }
    }
  }
  function normalizeEncoding(enc) {
    var nenc = _normalizeEncoding(enc);
    if (typeof nenc !== "string" && (Buffer2.isEncoding === isEncoding || !isEncoding(enc))) throw new Error("Unknown encoding: " + enc);
    return nenc || enc;
  }
  string_decoder.StringDecoder = StringDecoder;
  function StringDecoder(encoding) {
    this.encoding = normalizeEncoding(encoding);
    var nb;
    switch (this.encoding) {
      case "utf16le":
        this.text = utf16Text;
        this.end = utf16End;
        nb = 4;
        break;
      case "utf8":
        this.fillLast = utf8FillLast;
        nb = 4;
        break;
      case "base64":
        this.text = base64Text;
        this.end = base64End;
        nb = 3;
        break;
      default:
        this.write = simpleWrite;
        this.end = simpleEnd;
        return;
    }
    this.lastNeed = 0;
    this.lastTotal = 0;
    this.lastChar = Buffer2.allocUnsafe(nb);
  }
  StringDecoder.prototype.write = function(buf) {
    if (buf.length === 0) return "";
    var r;
    var i;
    if (this.lastNeed) {
      r = this.fillLast(buf);
      if (r === void 0) return "";
      i = this.lastNeed;
      this.lastNeed = 0;
    } else {
      i = 0;
    }
    if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
    return r || "";
  };
  StringDecoder.prototype.end = utf8End;
  StringDecoder.prototype.text = utf8Text;
  StringDecoder.prototype.fillLast = function(buf) {
    if (this.lastNeed <= buf.length) {
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
      return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
    this.lastNeed -= buf.length;
  };
  function utf8CheckByte(byte) {
    if (byte <= 127) return 0;
    else if (byte >> 5 === 6) return 2;
    else if (byte >> 4 === 14) return 3;
    else if (byte >> 3 === 30) return 4;
    return byte >> 6 === 2 ? -1 : -2;
  }
  function utf8CheckIncomplete(self2, buf, i) {
    var j = buf.length - 1;
    if (j < i) return 0;
    var nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
      if (nb > 0) self2.lastNeed = nb - 1;
      return nb;
    }
    if (--j < i || nb === -2) return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
      if (nb > 0) self2.lastNeed = nb - 2;
      return nb;
    }
    if (--j < i || nb === -2) return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
      if (nb > 0) {
        if (nb === 2) nb = 0;
        else self2.lastNeed = nb - 3;
      }
      return nb;
    }
    return 0;
  }
  function utf8CheckExtraBytes(self2, buf, p) {
    if ((buf[0] & 192) !== 128) {
      self2.lastNeed = 0;
      return "�";
    }
    if (self2.lastNeed > 1 && buf.length > 1) {
      if ((buf[1] & 192) !== 128) {
        self2.lastNeed = 1;
        return "�";
      }
      if (self2.lastNeed > 2 && buf.length > 2) {
        if ((buf[2] & 192) !== 128) {
          self2.lastNeed = 2;
          return "�";
        }
      }
    }
  }
  function utf8FillLast(buf) {
    var p = this.lastTotal - this.lastNeed;
    var r = utf8CheckExtraBytes(this, buf);
    if (r !== void 0) return r;
    if (this.lastNeed <= buf.length) {
      buf.copy(this.lastChar, p, 0, this.lastNeed);
      return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, p, 0, buf.length);
    this.lastNeed -= buf.length;
  }
  function utf8Text(buf, i) {
    var total = utf8CheckIncomplete(this, buf, i);
    if (!this.lastNeed) return buf.toString("utf8", i);
    this.lastTotal = total;
    var end = buf.length - (total - this.lastNeed);
    buf.copy(this.lastChar, 0, end);
    return buf.toString("utf8", i, end);
  }
  function utf8End(buf) {
    var r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed) return r + "�";
    return r;
  }
  function utf16Text(buf, i) {
    if ((buf.length - i) % 2 === 0) {
      var r = buf.toString("utf16le", i);
      if (r) {
        var c = r.charCodeAt(r.length - 1);
        if (c >= 55296 && c <= 56319) {
          this.lastNeed = 2;
          this.lastTotal = 4;
          this.lastChar[0] = buf[buf.length - 2];
          this.lastChar[1] = buf[buf.length - 1];
          return r.slice(0, -1);
        }
      }
      return r;
    }
    this.lastNeed = 1;
    this.lastTotal = 2;
    this.lastChar[0] = buf[buf.length - 1];
    return buf.toString("utf16le", i, buf.length - 1);
  }
  function utf16End(buf) {
    var r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed) {
      var end = this.lastTotal - this.lastNeed;
      return r + this.lastChar.toString("utf16le", 0, end);
    }
    return r;
  }
  function base64Text(buf, i) {
    var n = (buf.length - i) % 3;
    if (n === 0) return buf.toString("base64", i);
    this.lastNeed = 3 - n;
    this.lastTotal = 3;
    if (n === 1) {
      this.lastChar[0] = buf[buf.length - 1];
    } else {
      this.lastChar[0] = buf[buf.length - 2];
      this.lastChar[1] = buf[buf.length - 1];
    }
    return buf.toString("base64", i, buf.length - n);
  }
  function base64End(buf) {
    var r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed) return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
    return r;
  }
  function simpleWrite(buf) {
    return buf.toString(this.encoding);
  }
  function simpleEnd(buf) {
    return buf && buf.length ? this.write(buf) : "";
  }
  return string_decoder;
}
var from_1;
var hasRequiredFrom;
function requireFrom() {
  if (hasRequiredFrom) return from_1;
  hasRequiredFrom = 1;
  const process2 = requireProcess();
  const { PromisePrototypeThen, SymbolAsyncIterator, SymbolIterator } = requirePrimordials();
  const { Buffer: Buffer2 } = require$$0$5;
  const { ERR_INVALID_ARG_TYPE, ERR_STREAM_NULL_VALUES } = requireErrors().codes;
  function from(Readable, iterable, opts) {
    let iterator;
    if (typeof iterable === "string" || iterable instanceof Buffer2) {
      return new Readable({
        objectMode: true,
        ...opts,
        read() {
          this.push(iterable);
          this.push(null);
        }
      });
    }
    let isAsync;
    if (iterable && iterable[SymbolAsyncIterator]) {
      isAsync = true;
      iterator = iterable[SymbolAsyncIterator]();
    } else if (iterable && iterable[SymbolIterator]) {
      isAsync = false;
      iterator = iterable[SymbolIterator]();
    } else {
      throw new ERR_INVALID_ARG_TYPE("iterable", ["Iterable"], iterable);
    }
    const readable2 = new Readable({
      objectMode: true,
      highWaterMark: 1,
      // TODO(ronag): What options should be allowed?
      ...opts
    });
    let reading = false;
    readable2._read = function() {
      if (!reading) {
        reading = true;
        next();
      }
    };
    readable2._destroy = function(error, cb) {
      PromisePrototypeThen(
        close(error),
        () => process2.nextTick(cb, error),
        // nextTick is here in case cb throws
        (e) => process2.nextTick(cb, e || error)
      );
    };
    async function close(error) {
      const hadError = error !== void 0 && error !== null;
      const hasThrow = typeof iterator.throw === "function";
      if (hadError && hasThrow) {
        const { value, done } = await iterator.throw(error);
        await value;
        if (done) {
          return;
        }
      }
      if (typeof iterator.return === "function") {
        const { value } = await iterator.return();
        await value;
      }
    }
    async function next() {
      for (; ; ) {
        try {
          const { value, done } = isAsync ? await iterator.next() : iterator.next();
          if (done) {
            readable2.push(null);
          } else {
            const res = value && typeof value.then === "function" ? await value : value;
            if (res === null) {
              reading = false;
              throw new ERR_STREAM_NULL_VALUES();
            } else if (readable2.push(res)) {
              continue;
            } else {
              reading = false;
            }
          }
        } catch (err) {
          readable2.destroy(err);
        }
        break;
      }
    }
    return readable2;
  }
  from_1 = from;
  return from_1;
}
var readable;
var hasRequiredReadable;
function requireReadable() {
  if (hasRequiredReadable) return readable;
  hasRequiredReadable = 1;
  const process2 = requireProcess();
  const {
    ArrayPrototypeIndexOf,
    NumberIsInteger,
    NumberIsNaN,
    NumberParseInt,
    ObjectDefineProperties,
    ObjectKeys,
    ObjectSetPrototypeOf,
    Promise: Promise2,
    SafeSet,
    SymbolAsyncDispose,
    SymbolAsyncIterator,
    Symbol: Symbol2
  } = requirePrimordials();
  readable = Readable;
  Readable.ReadableState = ReadableState;
  const { EventEmitter: EE } = require$$0$6;
  const { Stream, prependListener } = requireLegacy();
  const { Buffer: Buffer2 } = require$$0$5;
  const { addAbortSignal: addAbortSignal2 } = requireAddAbortSignal();
  const eos = requireEndOfStream();
  let debug2 = requireUtil$1().debuglog("stream", (fn) => {
    debug2 = fn;
  });
  const BufferList = requireBuffer_list();
  const destroyImpl = requireDestroy();
  const { getHighWaterMark, getDefaultHighWaterMark } = requireState();
  const {
    aggregateTwoErrors,
    codes: {
      ERR_INVALID_ARG_TYPE,
      ERR_METHOD_NOT_IMPLEMENTED,
      ERR_OUT_OF_RANGE,
      ERR_STREAM_PUSH_AFTER_EOF,
      ERR_STREAM_UNSHIFT_AFTER_END_EVENT
    },
    AbortError
  } = requireErrors();
  const { validateObject } = requireValidators();
  const kPaused = Symbol2("kPaused");
  const { StringDecoder } = requireString_decoder();
  const from = requireFrom();
  ObjectSetPrototypeOf(Readable.prototype, Stream.prototype);
  ObjectSetPrototypeOf(Readable, Stream);
  const nop = () => {
  };
  const { errorOrDestroy } = destroyImpl;
  const kObjectMode = 1 << 0;
  const kEnded = 1 << 1;
  const kEndEmitted = 1 << 2;
  const kReading = 1 << 3;
  const kConstructed = 1 << 4;
  const kSync = 1 << 5;
  const kNeedReadable = 1 << 6;
  const kEmittedReadable = 1 << 7;
  const kReadableListening = 1 << 8;
  const kResumeScheduled = 1 << 9;
  const kErrorEmitted = 1 << 10;
  const kEmitClose = 1 << 11;
  const kAutoDestroy = 1 << 12;
  const kDestroyed = 1 << 13;
  const kClosed = 1 << 14;
  const kCloseEmitted = 1 << 15;
  const kMultiAwaitDrain = 1 << 16;
  const kReadingMore = 1 << 17;
  const kDataEmitted = 1 << 18;
  function makeBitMapDescriptor(bit) {
    return {
      enumerable: false,
      get() {
        return (this.state & bit) !== 0;
      },
      set(value) {
        if (value) this.state |= bit;
        else this.state &= ~bit;
      }
    };
  }
  ObjectDefineProperties(ReadableState.prototype, {
    objectMode: makeBitMapDescriptor(kObjectMode),
    ended: makeBitMapDescriptor(kEnded),
    endEmitted: makeBitMapDescriptor(kEndEmitted),
    reading: makeBitMapDescriptor(kReading),
    // Stream is still being constructed and cannot be
    // destroyed until construction finished or failed.
    // Async construction is opt in, therefore we start as
    // constructed.
    constructed: makeBitMapDescriptor(kConstructed),
    // A flag to be able to tell if the event 'readable'/'data' is emitted
    // immediately, or on a later tick.  We set this to true at first, because
    // any actions that shouldn't happen until "later" should generally also
    // not happen before the first read call.
    sync: makeBitMapDescriptor(kSync),
    // Whenever we return null, then we set a flag to say
    // that we're awaiting a 'readable' event emission.
    needReadable: makeBitMapDescriptor(kNeedReadable),
    emittedReadable: makeBitMapDescriptor(kEmittedReadable),
    readableListening: makeBitMapDescriptor(kReadableListening),
    resumeScheduled: makeBitMapDescriptor(kResumeScheduled),
    // True if the error was already emitted and should not be thrown again.
    errorEmitted: makeBitMapDescriptor(kErrorEmitted),
    emitClose: makeBitMapDescriptor(kEmitClose),
    autoDestroy: makeBitMapDescriptor(kAutoDestroy),
    // Has it been destroyed.
    destroyed: makeBitMapDescriptor(kDestroyed),
    // Indicates whether the stream has finished destroying.
    closed: makeBitMapDescriptor(kClosed),
    // True if close has been emitted or would have been emitted
    // depending on emitClose.
    closeEmitted: makeBitMapDescriptor(kCloseEmitted),
    multiAwaitDrain: makeBitMapDescriptor(kMultiAwaitDrain),
    // If true, a maybeReadMore has been scheduled.
    readingMore: makeBitMapDescriptor(kReadingMore),
    dataEmitted: makeBitMapDescriptor(kDataEmitted)
  });
  function ReadableState(options, stream2, isDuplex) {
    if (typeof isDuplex !== "boolean") isDuplex = stream2 instanceof requireDuplex();
    this.state = kEmitClose | kAutoDestroy | kConstructed | kSync;
    if (options && options.objectMode) this.state |= kObjectMode;
    if (isDuplex && options && options.readableObjectMode) this.state |= kObjectMode;
    this.highWaterMark = options ? getHighWaterMark(this, options, "readableHighWaterMark", isDuplex) : getDefaultHighWaterMark(false);
    this.buffer = new BufferList();
    this.length = 0;
    this.pipes = [];
    this.flowing = null;
    this[kPaused] = null;
    if (options && options.emitClose === false) this.state &= ~kEmitClose;
    if (options && options.autoDestroy === false) this.state &= ~kAutoDestroy;
    this.errored = null;
    this.defaultEncoding = options && options.defaultEncoding || "utf8";
    this.awaitDrainWriters = null;
    this.decoder = null;
    this.encoding = null;
    if (options && options.encoding) {
      this.decoder = new StringDecoder(options.encoding);
      this.encoding = options.encoding;
    }
  }
  function Readable(options) {
    if (!(this instanceof Readable)) return new Readable(options);
    const isDuplex = this instanceof requireDuplex();
    this._readableState = new ReadableState(options, this, isDuplex);
    if (options) {
      if (typeof options.read === "function") this._read = options.read;
      if (typeof options.destroy === "function") this._destroy = options.destroy;
      if (typeof options.construct === "function") this._construct = options.construct;
      if (options.signal && !isDuplex) addAbortSignal2(options.signal, this);
    }
    Stream.call(this, options);
    destroyImpl.construct(this, () => {
      if (this._readableState.needReadable) {
        maybeReadMore(this, this._readableState);
      }
    });
  }
  Readable.prototype.destroy = destroyImpl.destroy;
  Readable.prototype._undestroy = destroyImpl.undestroy;
  Readable.prototype._destroy = function(err, cb) {
    cb(err);
  };
  Readable.prototype[EE.captureRejectionSymbol] = function(err) {
    this.destroy(err);
  };
  Readable.prototype[SymbolAsyncDispose] = function() {
    let error;
    if (!this.destroyed) {
      error = this.readableEnded ? null : new AbortError();
      this.destroy(error);
    }
    return new Promise2((resolve, reject) => eos(this, (err) => err && err !== error ? reject(err) : resolve(null)));
  };
  Readable.prototype.push = function(chunk, encoding) {
    return readableAddChunk(this, chunk, encoding, false);
  };
  Readable.prototype.unshift = function(chunk, encoding) {
    return readableAddChunk(this, chunk, encoding, true);
  };
  function readableAddChunk(stream2, chunk, encoding, addToFront) {
    debug2("readableAddChunk", chunk);
    const state2 = stream2._readableState;
    let err;
    if ((state2.state & kObjectMode) === 0) {
      if (typeof chunk === "string") {
        encoding = encoding || state2.defaultEncoding;
        if (state2.encoding !== encoding) {
          if (addToFront && state2.encoding) {
            chunk = Buffer2.from(chunk, encoding).toString(state2.encoding);
          } else {
            chunk = Buffer2.from(chunk, encoding);
            encoding = "";
          }
        }
      } else if (chunk instanceof Buffer2) {
        encoding = "";
      } else if (Stream._isUint8Array(chunk)) {
        chunk = Stream._uint8ArrayToBuffer(chunk);
        encoding = "";
      } else if (chunk != null) {
        err = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer", "Uint8Array"], chunk);
      }
    }
    if (err) {
      errorOrDestroy(stream2, err);
    } else if (chunk === null) {
      state2.state &= ~kReading;
      onEofChunk(stream2, state2);
    } else if ((state2.state & kObjectMode) !== 0 || chunk && chunk.length > 0) {
      if (addToFront) {
        if ((state2.state & kEndEmitted) !== 0) errorOrDestroy(stream2, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());
        else if (state2.destroyed || state2.errored) return false;
        else addChunk(stream2, state2, chunk, true);
      } else if (state2.ended) {
        errorOrDestroy(stream2, new ERR_STREAM_PUSH_AFTER_EOF());
      } else if (state2.destroyed || state2.errored) {
        return false;
      } else {
        state2.state &= ~kReading;
        if (state2.decoder && !encoding) {
          chunk = state2.decoder.write(chunk);
          if (state2.objectMode || chunk.length !== 0) addChunk(stream2, state2, chunk, false);
          else maybeReadMore(stream2, state2);
        } else {
          addChunk(stream2, state2, chunk, false);
        }
      }
    } else if (!addToFront) {
      state2.state &= ~kReading;
      maybeReadMore(stream2, state2);
    }
    return !state2.ended && (state2.length < state2.highWaterMark || state2.length === 0);
  }
  function addChunk(stream2, state2, chunk, addToFront) {
    if (state2.flowing && state2.length === 0 && !state2.sync && stream2.listenerCount("data") > 0) {
      if ((state2.state & kMultiAwaitDrain) !== 0) {
        state2.awaitDrainWriters.clear();
      } else {
        state2.awaitDrainWriters = null;
      }
      state2.dataEmitted = true;
      stream2.emit("data", chunk);
    } else {
      state2.length += state2.objectMode ? 1 : chunk.length;
      if (addToFront) state2.buffer.unshift(chunk);
      else state2.buffer.push(chunk);
      if ((state2.state & kNeedReadable) !== 0) emitReadable(stream2);
    }
    maybeReadMore(stream2, state2);
  }
  Readable.prototype.isPaused = function() {
    const state2 = this._readableState;
    return state2[kPaused] === true || state2.flowing === false;
  };
  Readable.prototype.setEncoding = function(enc) {
    const decoder = new StringDecoder(enc);
    this._readableState.decoder = decoder;
    this._readableState.encoding = this._readableState.decoder.encoding;
    const buffer = this._readableState.buffer;
    let content = "";
    for (const data of buffer) {
      content += decoder.write(data);
    }
    buffer.clear();
    if (content !== "") buffer.push(content);
    this._readableState.length = content.length;
    return this;
  };
  const MAX_HWM = 1073741824;
  function computeNewHighWaterMark(n) {
    if (n > MAX_HWM) {
      throw new ERR_OUT_OF_RANGE("size", "<= 1GiB", n);
    } else {
      n--;
      n |= n >>> 1;
      n |= n >>> 2;
      n |= n >>> 4;
      n |= n >>> 8;
      n |= n >>> 16;
      n++;
    }
    return n;
  }
  function howMuchToRead(n, state2) {
    if (n <= 0 || state2.length === 0 && state2.ended) return 0;
    if ((state2.state & kObjectMode) !== 0) return 1;
    if (NumberIsNaN(n)) {
      if (state2.flowing && state2.length) return state2.buffer.first().length;
      return state2.length;
    }
    if (n <= state2.length) return n;
    return state2.ended ? state2.length : 0;
  }
  Readable.prototype.read = function(n) {
    debug2("read", n);
    if (n === void 0) {
      n = NaN;
    } else if (!NumberIsInteger(n)) {
      n = NumberParseInt(n, 10);
    }
    const state2 = this._readableState;
    const nOrig = n;
    if (n > state2.highWaterMark) state2.highWaterMark = computeNewHighWaterMark(n);
    if (n !== 0) state2.state &= ~kEmittedReadable;
    if (n === 0 && state2.needReadable && ((state2.highWaterMark !== 0 ? state2.length >= state2.highWaterMark : state2.length > 0) || state2.ended)) {
      debug2("read: emitReadable", state2.length, state2.ended);
      if (state2.length === 0 && state2.ended) endReadable(this);
      else emitReadable(this);
      return null;
    }
    n = howMuchToRead(n, state2);
    if (n === 0 && state2.ended) {
      if (state2.length === 0) endReadable(this);
      return null;
    }
    let doRead = (state2.state & kNeedReadable) !== 0;
    debug2("need readable", doRead);
    if (state2.length === 0 || state2.length - n < state2.highWaterMark) {
      doRead = true;
      debug2("length less than watermark", doRead);
    }
    if (state2.ended || state2.reading || state2.destroyed || state2.errored || !state2.constructed) {
      doRead = false;
      debug2("reading, ended or constructing", doRead);
    } else if (doRead) {
      debug2("do read");
      state2.state |= kReading | kSync;
      if (state2.length === 0) state2.state |= kNeedReadable;
      try {
        this._read(state2.highWaterMark);
      } catch (err) {
        errorOrDestroy(this, err);
      }
      state2.state &= ~kSync;
      if (!state2.reading) n = howMuchToRead(nOrig, state2);
    }
    let ret;
    if (n > 0) ret = fromList(n, state2);
    else ret = null;
    if (ret === null) {
      state2.needReadable = state2.length <= state2.highWaterMark;
      n = 0;
    } else {
      state2.length -= n;
      if (state2.multiAwaitDrain) {
        state2.awaitDrainWriters.clear();
      } else {
        state2.awaitDrainWriters = null;
      }
    }
    if (state2.length === 0) {
      if (!state2.ended) state2.needReadable = true;
      if (nOrig !== n && state2.ended) endReadable(this);
    }
    if (ret !== null && !state2.errorEmitted && !state2.closeEmitted) {
      state2.dataEmitted = true;
      this.emit("data", ret);
    }
    return ret;
  };
  function onEofChunk(stream2, state2) {
    debug2("onEofChunk");
    if (state2.ended) return;
    if (state2.decoder) {
      const chunk = state2.decoder.end();
      if (chunk && chunk.length) {
        state2.buffer.push(chunk);
        state2.length += state2.objectMode ? 1 : chunk.length;
      }
    }
    state2.ended = true;
    if (state2.sync) {
      emitReadable(stream2);
    } else {
      state2.needReadable = false;
      state2.emittedReadable = true;
      emitReadable_(stream2);
    }
  }
  function emitReadable(stream2) {
    const state2 = stream2._readableState;
    debug2("emitReadable", state2.needReadable, state2.emittedReadable);
    state2.needReadable = false;
    if (!state2.emittedReadable) {
      debug2("emitReadable", state2.flowing);
      state2.emittedReadable = true;
      process2.nextTick(emitReadable_, stream2);
    }
  }
  function emitReadable_(stream2) {
    const state2 = stream2._readableState;
    debug2("emitReadable_", state2.destroyed, state2.length, state2.ended);
    if (!state2.destroyed && !state2.errored && (state2.length || state2.ended)) {
      stream2.emit("readable");
      state2.emittedReadable = false;
    }
    state2.needReadable = !state2.flowing && !state2.ended && state2.length <= state2.highWaterMark;
    flow(stream2);
  }
  function maybeReadMore(stream2, state2) {
    if (!state2.readingMore && state2.constructed) {
      state2.readingMore = true;
      process2.nextTick(maybeReadMore_, stream2, state2);
    }
  }
  function maybeReadMore_(stream2, state2) {
    while (!state2.reading && !state2.ended && (state2.length < state2.highWaterMark || state2.flowing && state2.length === 0)) {
      const len = state2.length;
      debug2("maybeReadMore read 0");
      stream2.read(0);
      if (len === state2.length)
        break;
    }
    state2.readingMore = false;
  }
  Readable.prototype._read = function(n) {
    throw new ERR_METHOD_NOT_IMPLEMENTED("_read()");
  };
  Readable.prototype.pipe = function(dest, pipeOpts) {
    const src2 = this;
    const state2 = this._readableState;
    if (state2.pipes.length === 1) {
      if (!state2.multiAwaitDrain) {
        state2.multiAwaitDrain = true;
        state2.awaitDrainWriters = new SafeSet(state2.awaitDrainWriters ? [state2.awaitDrainWriters] : []);
      }
    }
    state2.pipes.push(dest);
    debug2("pipe count=%d opts=%j", state2.pipes.length, pipeOpts);
    const doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process2.stdout && dest !== process2.stderr;
    const endFn = doEnd ? onend : unpipe;
    if (state2.endEmitted) process2.nextTick(endFn);
    else src2.once("end", endFn);
    dest.on("unpipe", onunpipe);
    function onunpipe(readable2, unpipeInfo) {
      debug2("onunpipe");
      if (readable2 === src2) {
        if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
          unpipeInfo.hasUnpiped = true;
          cleanup();
        }
      }
    }
    function onend() {
      debug2("onend");
      dest.end();
    }
    let ondrain;
    let cleanedUp = false;
    function cleanup() {
      debug2("cleanup");
      dest.removeListener("close", onclose);
      dest.removeListener("finish", onfinish);
      if (ondrain) {
        dest.removeListener("drain", ondrain);
      }
      dest.removeListener("error", onerror);
      dest.removeListener("unpipe", onunpipe);
      src2.removeListener("end", onend);
      src2.removeListener("end", unpipe);
      src2.removeListener("data", ondata);
      cleanedUp = true;
      if (ondrain && state2.awaitDrainWriters && (!dest._writableState || dest._writableState.needDrain)) ondrain();
    }
    function pause() {
      if (!cleanedUp) {
        if (state2.pipes.length === 1 && state2.pipes[0] === dest) {
          debug2("false write response, pause", 0);
          state2.awaitDrainWriters = dest;
          state2.multiAwaitDrain = false;
        } else if (state2.pipes.length > 1 && state2.pipes.includes(dest)) {
          debug2("false write response, pause", state2.awaitDrainWriters.size);
          state2.awaitDrainWriters.add(dest);
        }
        src2.pause();
      }
      if (!ondrain) {
        ondrain = pipeOnDrain(src2, dest);
        dest.on("drain", ondrain);
      }
    }
    src2.on("data", ondata);
    function ondata(chunk) {
      debug2("ondata");
      const ret = dest.write(chunk);
      debug2("dest.write", ret);
      if (ret === false) {
        pause();
      }
    }
    function onerror(er) {
      debug2("onerror", er);
      unpipe();
      dest.removeListener("error", onerror);
      if (dest.listenerCount("error") === 0) {
        const s = dest._writableState || dest._readableState;
        if (s && !s.errorEmitted) {
          errorOrDestroy(dest, er);
        } else {
          dest.emit("error", er);
        }
      }
    }
    prependListener(dest, "error", onerror);
    function onclose() {
      dest.removeListener("finish", onfinish);
      unpipe();
    }
    dest.once("close", onclose);
    function onfinish() {
      debug2("onfinish");
      dest.removeListener("close", onclose);
      unpipe();
    }
    dest.once("finish", onfinish);
    function unpipe() {
      debug2("unpipe");
      src2.unpipe(dest);
    }
    dest.emit("pipe", src2);
    if (dest.writableNeedDrain === true) {
      pause();
    } else if (!state2.flowing) {
      debug2("pipe resume");
      src2.resume();
    }
    return dest;
  };
  function pipeOnDrain(src2, dest) {
    return function pipeOnDrainFunctionResult() {
      const state2 = src2._readableState;
      if (state2.awaitDrainWriters === dest) {
        debug2("pipeOnDrain", 1);
        state2.awaitDrainWriters = null;
      } else if (state2.multiAwaitDrain) {
        debug2("pipeOnDrain", state2.awaitDrainWriters.size);
        state2.awaitDrainWriters.delete(dest);
      }
      if ((!state2.awaitDrainWriters || state2.awaitDrainWriters.size === 0) && src2.listenerCount("data")) {
        src2.resume();
      }
    };
  }
  Readable.prototype.unpipe = function(dest) {
    const state2 = this._readableState;
    const unpipeInfo = {
      hasUnpiped: false
    };
    if (state2.pipes.length === 0) return this;
    if (!dest) {
      const dests = state2.pipes;
      state2.pipes = [];
      this.pause();
      for (let i = 0; i < dests.length; i++)
        dests[i].emit("unpipe", this, {
          hasUnpiped: false
        });
      return this;
    }
    const index = ArrayPrototypeIndexOf(state2.pipes, dest);
    if (index === -1) return this;
    state2.pipes.splice(index, 1);
    if (state2.pipes.length === 0) this.pause();
    dest.emit("unpipe", this, unpipeInfo);
    return this;
  };
  Readable.prototype.on = function(ev, fn) {
    const res = Stream.prototype.on.call(this, ev, fn);
    const state2 = this._readableState;
    if (ev === "data") {
      state2.readableListening = this.listenerCount("readable") > 0;
      if (state2.flowing !== false) this.resume();
    } else if (ev === "readable") {
      if (!state2.endEmitted && !state2.readableListening) {
        state2.readableListening = state2.needReadable = true;
        state2.flowing = false;
        state2.emittedReadable = false;
        debug2("on readable", state2.length, state2.reading);
        if (state2.length) {
          emitReadable(this);
        } else if (!state2.reading) {
          process2.nextTick(nReadingNextTick, this);
        }
      }
    }
    return res;
  };
  Readable.prototype.addListener = Readable.prototype.on;
  Readable.prototype.removeListener = function(ev, fn) {
    const res = Stream.prototype.removeListener.call(this, ev, fn);
    if (ev === "readable") {
      process2.nextTick(updateReadableListening, this);
    }
    return res;
  };
  Readable.prototype.off = Readable.prototype.removeListener;
  Readable.prototype.removeAllListeners = function(ev) {
    const res = Stream.prototype.removeAllListeners.apply(this, arguments);
    if (ev === "readable" || ev === void 0) {
      process2.nextTick(updateReadableListening, this);
    }
    return res;
  };
  function updateReadableListening(self2) {
    const state2 = self2._readableState;
    state2.readableListening = self2.listenerCount("readable") > 0;
    if (state2.resumeScheduled && state2[kPaused] === false) {
      state2.flowing = true;
    } else if (self2.listenerCount("data") > 0) {
      self2.resume();
    } else if (!state2.readableListening) {
      state2.flowing = null;
    }
  }
  function nReadingNextTick(self2) {
    debug2("readable nexttick read 0");
    self2.read(0);
  }
  Readable.prototype.resume = function() {
    const state2 = this._readableState;
    if (!state2.flowing) {
      debug2("resume");
      state2.flowing = !state2.readableListening;
      resume(this, state2);
    }
    state2[kPaused] = false;
    return this;
  };
  function resume(stream2, state2) {
    if (!state2.resumeScheduled) {
      state2.resumeScheduled = true;
      process2.nextTick(resume_, stream2, state2);
    }
  }
  function resume_(stream2, state2) {
    debug2("resume", state2.reading);
    if (!state2.reading) {
      stream2.read(0);
    }
    state2.resumeScheduled = false;
    stream2.emit("resume");
    flow(stream2);
    if (state2.flowing && !state2.reading) stream2.read(0);
  }
  Readable.prototype.pause = function() {
    debug2("call pause flowing=%j", this._readableState.flowing);
    if (this._readableState.flowing !== false) {
      debug2("pause");
      this._readableState.flowing = false;
      this.emit("pause");
    }
    this._readableState[kPaused] = true;
    return this;
  };
  function flow(stream2) {
    const state2 = stream2._readableState;
    debug2("flow", state2.flowing);
    while (state2.flowing && stream2.read() !== null) ;
  }
  Readable.prototype.wrap = function(stream2) {
    let paused = false;
    stream2.on("data", (chunk) => {
      if (!this.push(chunk) && stream2.pause) {
        paused = true;
        stream2.pause();
      }
    });
    stream2.on("end", () => {
      this.push(null);
    });
    stream2.on("error", (err) => {
      errorOrDestroy(this, err);
    });
    stream2.on("close", () => {
      this.destroy();
    });
    stream2.on("destroy", () => {
      this.destroy();
    });
    this._read = () => {
      if (paused && stream2.resume) {
        paused = false;
        stream2.resume();
      }
    };
    const streamKeys = ObjectKeys(stream2);
    for (let j = 1; j < streamKeys.length; j++) {
      const i = streamKeys[j];
      if (this[i] === void 0 && typeof stream2[i] === "function") {
        this[i] = stream2[i].bind(stream2);
      }
    }
    return this;
  };
  Readable.prototype[SymbolAsyncIterator] = function() {
    return streamToAsyncIterator(this);
  };
  Readable.prototype.iterator = function(options) {
    if (options !== void 0) {
      validateObject(options, "options");
    }
    return streamToAsyncIterator(this, options);
  };
  function streamToAsyncIterator(stream2, options) {
    if (typeof stream2.read !== "function") {
      stream2 = Readable.wrap(stream2, {
        objectMode: true
      });
    }
    const iter = createAsyncIterator(stream2, options);
    iter.stream = stream2;
    return iter;
  }
  async function* createAsyncIterator(stream2, options) {
    let callback = nop;
    function next(resolve) {
      if (this === stream2) {
        callback();
        callback = nop;
      } else {
        callback = resolve;
      }
    }
    stream2.on("readable", next);
    let error;
    const cleanup = eos(
      stream2,
      {
        writable: false
      },
      (err) => {
        error = err ? aggregateTwoErrors(error, err) : null;
        callback();
        callback = nop;
      }
    );
    try {
      while (true) {
        const chunk = stream2.destroyed ? null : stream2.read();
        if (chunk !== null) {
          yield chunk;
        } else if (error) {
          throw error;
        } else if (error === null) {
          return;
        } else {
          await new Promise2(next);
        }
      }
    } catch (err) {
      error = aggregateTwoErrors(error, err);
      throw error;
    } finally {
      if ((error || (options === null || options === void 0 ? void 0 : options.destroyOnReturn) !== false) && (error === void 0 || stream2._readableState.autoDestroy)) {
        destroyImpl.destroyer(stream2, null);
      } else {
        stream2.off("readable", next);
        cleanup();
      }
    }
  }
  ObjectDefineProperties(Readable.prototype, {
    readable: {
      __proto__: null,
      get() {
        const r = this._readableState;
        return !!r && r.readable !== false && !r.destroyed && !r.errorEmitted && !r.endEmitted;
      },
      set(val) {
        if (this._readableState) {
          this._readableState.readable = !!val;
        }
      }
    },
    readableDidRead: {
      __proto__: null,
      enumerable: false,
      get: function() {
        return this._readableState.dataEmitted;
      }
    },
    readableAborted: {
      __proto__: null,
      enumerable: false,
      get: function() {
        return !!(this._readableState.readable !== false && (this._readableState.destroyed || this._readableState.errored) && !this._readableState.endEmitted);
      }
    },
    readableHighWaterMark: {
      __proto__: null,
      enumerable: false,
      get: function() {
        return this._readableState.highWaterMark;
      }
    },
    readableBuffer: {
      __proto__: null,
      enumerable: false,
      get: function() {
        return this._readableState && this._readableState.buffer;
      }
    },
    readableFlowing: {
      __proto__: null,
      enumerable: false,
      get: function() {
        return this._readableState.flowing;
      },
      set: function(state2) {
        if (this._readableState) {
          this._readableState.flowing = state2;
        }
      }
    },
    readableLength: {
      __proto__: null,
      enumerable: false,
      get() {
        return this._readableState.length;
      }
    },
    readableObjectMode: {
      __proto__: null,
      enumerable: false,
      get() {
        return this._readableState ? this._readableState.objectMode : false;
      }
    },
    readableEncoding: {
      __proto__: null,
      enumerable: false,
      get() {
        return this._readableState ? this._readableState.encoding : null;
      }
    },
    errored: {
      __proto__: null,
      enumerable: false,
      get() {
        return this._readableState ? this._readableState.errored : null;
      }
    },
    closed: {
      __proto__: null,
      get() {
        return this._readableState ? this._readableState.closed : false;
      }
    },
    destroyed: {
      __proto__: null,
      enumerable: false,
      get() {
        return this._readableState ? this._readableState.destroyed : false;
      },
      set(value) {
        if (!this._readableState) {
          return;
        }
        this._readableState.destroyed = value;
      }
    },
    readableEnded: {
      __proto__: null,
      enumerable: false,
      get() {
        return this._readableState ? this._readableState.endEmitted : false;
      }
    }
  });
  ObjectDefineProperties(ReadableState.prototype, {
    // Legacy getter for `pipesCount`.
    pipesCount: {
      __proto__: null,
      get() {
        return this.pipes.length;
      }
    },
    // Legacy property for `paused`.
    paused: {
      __proto__: null,
      get() {
        return this[kPaused] !== false;
      },
      set(value) {
        this[kPaused] = !!value;
      }
    }
  });
  Readable._fromList = fromList;
  function fromList(n, state2) {
    if (state2.length === 0) return null;
    let ret;
    if (state2.objectMode) ret = state2.buffer.shift();
    else if (!n || n >= state2.length) {
      if (state2.decoder) ret = state2.buffer.join("");
      else if (state2.buffer.length === 1) ret = state2.buffer.first();
      else ret = state2.buffer.concat(state2.length);
      state2.buffer.clear();
    } else {
      ret = state2.buffer.consume(n, state2.decoder);
    }
    return ret;
  }
  function endReadable(stream2) {
    const state2 = stream2._readableState;
    debug2("endReadable", state2.endEmitted);
    if (!state2.endEmitted) {
      state2.ended = true;
      process2.nextTick(endReadableNT, state2, stream2);
    }
  }
  function endReadableNT(state2, stream2) {
    debug2("endReadableNT", state2.endEmitted, state2.length);
    if (!state2.errored && !state2.closeEmitted && !state2.endEmitted && state2.length === 0) {
      state2.endEmitted = true;
      stream2.emit("end");
      if (stream2.writable && stream2.allowHalfOpen === false) {
        process2.nextTick(endWritableNT, stream2);
      } else if (state2.autoDestroy) {
        const wState = stream2._writableState;
        const autoDestroy = !wState || wState.autoDestroy && // We don't expect the writable to ever 'finish'
        // if writable is explicitly set to false.
        (wState.finished || wState.writable === false);
        if (autoDestroy) {
          stream2.destroy();
        }
      }
    }
  }
  function endWritableNT(stream2) {
    const writable2 = stream2.writable && !stream2.writableEnded && !stream2.destroyed;
    if (writable2) {
      stream2.end();
    }
  }
  Readable.from = function(iterable, opts) {
    return from(Readable, iterable, opts);
  };
  let webStreamsAdapters;
  function lazyWebStreams() {
    if (webStreamsAdapters === void 0) webStreamsAdapters = {};
    return webStreamsAdapters;
  }
  Readable.fromWeb = function(readableStream, options) {
    return lazyWebStreams().newStreamReadableFromReadableStream(readableStream, options);
  };
  Readable.toWeb = function(streamReadable, options) {
    return lazyWebStreams().newReadableStreamFromStreamReadable(streamReadable, options);
  };
  Readable.wrap = function(src2, options) {
    var _ref, _src$readableObjectMo;
    return new Readable({
      objectMode: (_ref = (_src$readableObjectMo = src2.readableObjectMode) !== null && _src$readableObjectMo !== void 0 ? _src$readableObjectMo : src2.objectMode) !== null && _ref !== void 0 ? _ref : true,
      ...options,
      destroy(err, callback) {
        destroyImpl.destroyer(src2, err);
        callback(err);
      }
    }).wrap(src2);
  };
  return readable;
}
var writable;
var hasRequiredWritable;
function requireWritable() {
  if (hasRequiredWritable) return writable;
  hasRequiredWritable = 1;
  const process2 = requireProcess();
  const {
    ArrayPrototypeSlice,
    Error: Error2,
    FunctionPrototypeSymbolHasInstance,
    ObjectDefineProperty,
    ObjectDefineProperties,
    ObjectSetPrototypeOf,
    StringPrototypeToLowerCase,
    Symbol: Symbol2,
    SymbolHasInstance
  } = requirePrimordials();
  writable = Writable;
  Writable.WritableState = WritableState;
  const { EventEmitter: EE } = require$$0$6;
  const Stream = requireLegacy().Stream;
  const { Buffer: Buffer2 } = require$$0$5;
  const destroyImpl = requireDestroy();
  const { addAbortSignal: addAbortSignal2 } = requireAddAbortSignal();
  const { getHighWaterMark, getDefaultHighWaterMark } = requireState();
  const {
    ERR_INVALID_ARG_TYPE,
    ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK,
    ERR_STREAM_CANNOT_PIPE,
    ERR_STREAM_DESTROYED,
    ERR_STREAM_ALREADY_FINISHED,
    ERR_STREAM_NULL_VALUES,
    ERR_STREAM_WRITE_AFTER_END,
    ERR_UNKNOWN_ENCODING
  } = requireErrors().codes;
  const { errorOrDestroy } = destroyImpl;
  ObjectSetPrototypeOf(Writable.prototype, Stream.prototype);
  ObjectSetPrototypeOf(Writable, Stream);
  function nop() {
  }
  const kOnFinished = Symbol2("kOnFinished");
  function WritableState(options, stream2, isDuplex) {
    if (typeof isDuplex !== "boolean") isDuplex = stream2 instanceof requireDuplex();
    this.objectMode = !!(options && options.objectMode);
    if (isDuplex) this.objectMode = this.objectMode || !!(options && options.writableObjectMode);
    this.highWaterMark = options ? getHighWaterMark(this, options, "writableHighWaterMark", isDuplex) : getDefaultHighWaterMark(false);
    this.finalCalled = false;
    this.needDrain = false;
    this.ending = false;
    this.ended = false;
    this.finished = false;
    this.destroyed = false;
    const noDecode = !!(options && options.decodeStrings === false);
    this.decodeStrings = !noDecode;
    this.defaultEncoding = options && options.defaultEncoding || "utf8";
    this.length = 0;
    this.writing = false;
    this.corked = 0;
    this.sync = true;
    this.bufferProcessing = false;
    this.onwrite = onwrite.bind(void 0, stream2);
    this.writecb = null;
    this.writelen = 0;
    this.afterWriteTickInfo = null;
    resetBuffer(this);
    this.pendingcb = 0;
    this.constructed = true;
    this.prefinished = false;
    this.errorEmitted = false;
    this.emitClose = !options || options.emitClose !== false;
    this.autoDestroy = !options || options.autoDestroy !== false;
    this.errored = null;
    this.closed = false;
    this.closeEmitted = false;
    this[kOnFinished] = [];
  }
  function resetBuffer(state2) {
    state2.buffered = [];
    state2.bufferedIndex = 0;
    state2.allBuffers = true;
    state2.allNoop = true;
  }
  WritableState.prototype.getBuffer = function getBuffer() {
    return ArrayPrototypeSlice(this.buffered, this.bufferedIndex);
  };
  ObjectDefineProperty(WritableState.prototype, "bufferedRequestCount", {
    __proto__: null,
    get() {
      return this.buffered.length - this.bufferedIndex;
    }
  });
  function Writable(options) {
    const isDuplex = this instanceof requireDuplex();
    if (!isDuplex && !FunctionPrototypeSymbolHasInstance(Writable, this)) return new Writable(options);
    this._writableState = new WritableState(options, this, isDuplex);
    if (options) {
      if (typeof options.write === "function") this._write = options.write;
      if (typeof options.writev === "function") this._writev = options.writev;
      if (typeof options.destroy === "function") this._destroy = options.destroy;
      if (typeof options.final === "function") this._final = options.final;
      if (typeof options.construct === "function") this._construct = options.construct;
      if (options.signal) addAbortSignal2(options.signal, this);
    }
    Stream.call(this, options);
    destroyImpl.construct(this, () => {
      const state2 = this._writableState;
      if (!state2.writing) {
        clearBuffer(this, state2);
      }
      finishMaybe(this, state2);
    });
  }
  ObjectDefineProperty(Writable, SymbolHasInstance, {
    __proto__: null,
    value: function(object) {
      if (FunctionPrototypeSymbolHasInstance(this, object)) return true;
      if (this !== Writable) return false;
      return object && object._writableState instanceof WritableState;
    }
  });
  Writable.prototype.pipe = function() {
    errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
  };
  function _write(stream2, chunk, encoding, cb) {
    const state2 = stream2._writableState;
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = state2.defaultEncoding;
    } else {
      if (!encoding) encoding = state2.defaultEncoding;
      else if (encoding !== "buffer" && !Buffer2.isEncoding(encoding)) throw new ERR_UNKNOWN_ENCODING(encoding);
      if (typeof cb !== "function") cb = nop;
    }
    if (chunk === null) {
      throw new ERR_STREAM_NULL_VALUES();
    } else if (!state2.objectMode) {
      if (typeof chunk === "string") {
        if (state2.decodeStrings !== false) {
          chunk = Buffer2.from(chunk, encoding);
          encoding = "buffer";
        }
      } else if (chunk instanceof Buffer2) {
        encoding = "buffer";
      } else if (Stream._isUint8Array(chunk)) {
        chunk = Stream._uint8ArrayToBuffer(chunk);
        encoding = "buffer";
      } else {
        throw new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer", "Uint8Array"], chunk);
      }
    }
    let err;
    if (state2.ending) {
      err = new ERR_STREAM_WRITE_AFTER_END();
    } else if (state2.destroyed) {
      err = new ERR_STREAM_DESTROYED("write");
    }
    if (err) {
      process2.nextTick(cb, err);
      errorOrDestroy(stream2, err, true);
      return err;
    }
    state2.pendingcb++;
    return writeOrBuffer(stream2, state2, chunk, encoding, cb);
  }
  Writable.prototype.write = function(chunk, encoding, cb) {
    return _write(this, chunk, encoding, cb) === true;
  };
  Writable.prototype.cork = function() {
    this._writableState.corked++;
  };
  Writable.prototype.uncork = function() {
    const state2 = this._writableState;
    if (state2.corked) {
      state2.corked--;
      if (!state2.writing) clearBuffer(this, state2);
    }
  };
  Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
    if (typeof encoding === "string") encoding = StringPrototypeToLowerCase(encoding);
    if (!Buffer2.isEncoding(encoding)) throw new ERR_UNKNOWN_ENCODING(encoding);
    this._writableState.defaultEncoding = encoding;
    return this;
  };
  function writeOrBuffer(stream2, state2, chunk, encoding, callback) {
    const len = state2.objectMode ? 1 : chunk.length;
    state2.length += len;
    const ret = state2.length < state2.highWaterMark;
    if (!ret) state2.needDrain = true;
    if (state2.writing || state2.corked || state2.errored || !state2.constructed) {
      state2.buffered.push({
        chunk,
        encoding,
        callback
      });
      if (state2.allBuffers && encoding !== "buffer") {
        state2.allBuffers = false;
      }
      if (state2.allNoop && callback !== nop) {
        state2.allNoop = false;
      }
    } else {
      state2.writelen = len;
      state2.writecb = callback;
      state2.writing = true;
      state2.sync = true;
      stream2._write(chunk, encoding, state2.onwrite);
      state2.sync = false;
    }
    return ret && !state2.errored && !state2.destroyed;
  }
  function doWrite(stream2, state2, writev, len, chunk, encoding, cb) {
    state2.writelen = len;
    state2.writecb = cb;
    state2.writing = true;
    state2.sync = true;
    if (state2.destroyed) state2.onwrite(new ERR_STREAM_DESTROYED("write"));
    else if (writev) stream2._writev(chunk, state2.onwrite);
    else stream2._write(chunk, encoding, state2.onwrite);
    state2.sync = false;
  }
  function onwriteError(stream2, state2, er, cb) {
    --state2.pendingcb;
    cb(er);
    errorBuffer(state2);
    errorOrDestroy(stream2, er);
  }
  function onwrite(stream2, er) {
    const state2 = stream2._writableState;
    const sync = state2.sync;
    const cb = state2.writecb;
    if (typeof cb !== "function") {
      errorOrDestroy(stream2, new ERR_MULTIPLE_CALLBACK());
      return;
    }
    state2.writing = false;
    state2.writecb = null;
    state2.length -= state2.writelen;
    state2.writelen = 0;
    if (er) {
      er.stack;
      if (!state2.errored) {
        state2.errored = er;
      }
      if (stream2._readableState && !stream2._readableState.errored) {
        stream2._readableState.errored = er;
      }
      if (sync) {
        process2.nextTick(onwriteError, stream2, state2, er, cb);
      } else {
        onwriteError(stream2, state2, er, cb);
      }
    } else {
      if (state2.buffered.length > state2.bufferedIndex) {
        clearBuffer(stream2, state2);
      }
      if (sync) {
        if (state2.afterWriteTickInfo !== null && state2.afterWriteTickInfo.cb === cb) {
          state2.afterWriteTickInfo.count++;
        } else {
          state2.afterWriteTickInfo = {
            count: 1,
            cb,
            stream: stream2,
            state: state2
          };
          process2.nextTick(afterWriteTick, state2.afterWriteTickInfo);
        }
      } else {
        afterWrite(stream2, state2, 1, cb);
      }
    }
  }
  function afterWriteTick({ stream: stream2, state: state2, count, cb }) {
    state2.afterWriteTickInfo = null;
    return afterWrite(stream2, state2, count, cb);
  }
  function afterWrite(stream2, state2, count, cb) {
    const needDrain = !state2.ending && !stream2.destroyed && state2.length === 0 && state2.needDrain;
    if (needDrain) {
      state2.needDrain = false;
      stream2.emit("drain");
    }
    while (count-- > 0) {
      state2.pendingcb--;
      cb();
    }
    if (state2.destroyed) {
      errorBuffer(state2);
    }
    finishMaybe(stream2, state2);
  }
  function errorBuffer(state2) {
    if (state2.writing) {
      return;
    }
    for (let n = state2.bufferedIndex; n < state2.buffered.length; ++n) {
      var _state$errored;
      const { chunk, callback } = state2.buffered[n];
      const len = state2.objectMode ? 1 : chunk.length;
      state2.length -= len;
      callback(
        (_state$errored = state2.errored) !== null && _state$errored !== void 0 ? _state$errored : new ERR_STREAM_DESTROYED("write")
      );
    }
    const onfinishCallbacks = state2[kOnFinished].splice(0);
    for (let i = 0; i < onfinishCallbacks.length; i++) {
      var _state$errored2;
      onfinishCallbacks[i](
        (_state$errored2 = state2.errored) !== null && _state$errored2 !== void 0 ? _state$errored2 : new ERR_STREAM_DESTROYED("end")
      );
    }
    resetBuffer(state2);
  }
  function clearBuffer(stream2, state2) {
    if (state2.corked || state2.bufferProcessing || state2.destroyed || !state2.constructed) {
      return;
    }
    const { buffered, bufferedIndex, objectMode } = state2;
    const bufferedLength = buffered.length - bufferedIndex;
    if (!bufferedLength) {
      return;
    }
    let i = bufferedIndex;
    state2.bufferProcessing = true;
    if (bufferedLength > 1 && stream2._writev) {
      state2.pendingcb -= bufferedLength - 1;
      const callback = state2.allNoop ? nop : (err) => {
        for (let n = i; n < buffered.length; ++n) {
          buffered[n].callback(err);
        }
      };
      const chunks = state2.allNoop && i === 0 ? buffered : ArrayPrototypeSlice(buffered, i);
      chunks.allBuffers = state2.allBuffers;
      doWrite(stream2, state2, true, state2.length, chunks, "", callback);
      resetBuffer(state2);
    } else {
      do {
        const { chunk, encoding, callback } = buffered[i];
        buffered[i++] = null;
        const len = objectMode ? 1 : chunk.length;
        doWrite(stream2, state2, false, len, chunk, encoding, callback);
      } while (i < buffered.length && !state2.writing);
      if (i === buffered.length) {
        resetBuffer(state2);
      } else if (i > 256) {
        buffered.splice(0, i);
        state2.bufferedIndex = 0;
      } else {
        state2.bufferedIndex = i;
      }
    }
    state2.bufferProcessing = false;
  }
  Writable.prototype._write = function(chunk, encoding, cb) {
    if (this._writev) {
      this._writev(
        [
          {
            chunk,
            encoding
          }
        ],
        cb
      );
    } else {
      throw new ERR_METHOD_NOT_IMPLEMENTED("_write()");
    }
  };
  Writable.prototype._writev = null;
  Writable.prototype.end = function(chunk, encoding, cb) {
    const state2 = this._writableState;
    if (typeof chunk === "function") {
      cb = chunk;
      chunk = null;
      encoding = null;
    } else if (typeof encoding === "function") {
      cb = encoding;
      encoding = null;
    }
    let err;
    if (chunk !== null && chunk !== void 0) {
      const ret = _write(this, chunk, encoding);
      if (ret instanceof Error2) {
        err = ret;
      }
    }
    if (state2.corked) {
      state2.corked = 1;
      this.uncork();
    }
    if (err) ;
    else if (!state2.errored && !state2.ending) {
      state2.ending = true;
      finishMaybe(this, state2, true);
      state2.ended = true;
    } else if (state2.finished) {
      err = new ERR_STREAM_ALREADY_FINISHED("end");
    } else if (state2.destroyed) {
      err = new ERR_STREAM_DESTROYED("end");
    }
    if (typeof cb === "function") {
      if (err || state2.finished) {
        process2.nextTick(cb, err);
      } else {
        state2[kOnFinished].push(cb);
      }
    }
    return this;
  };
  function needFinish(state2) {
    return state2.ending && !state2.destroyed && state2.constructed && state2.length === 0 && !state2.errored && state2.buffered.length === 0 && !state2.finished && !state2.writing && !state2.errorEmitted && !state2.closeEmitted;
  }
  function callFinal(stream2, state2) {
    let called = false;
    function onFinish(err) {
      if (called) {
        errorOrDestroy(stream2, err !== null && err !== void 0 ? err : ERR_MULTIPLE_CALLBACK());
        return;
      }
      called = true;
      state2.pendingcb--;
      if (err) {
        const onfinishCallbacks = state2[kOnFinished].splice(0);
        for (let i = 0; i < onfinishCallbacks.length; i++) {
          onfinishCallbacks[i](err);
        }
        errorOrDestroy(stream2, err, state2.sync);
      } else if (needFinish(state2)) {
        state2.prefinished = true;
        stream2.emit("prefinish");
        state2.pendingcb++;
        process2.nextTick(finish, stream2, state2);
      }
    }
    state2.sync = true;
    state2.pendingcb++;
    try {
      stream2._final(onFinish);
    } catch (err) {
      onFinish(err);
    }
    state2.sync = false;
  }
  function prefinish(stream2, state2) {
    if (!state2.prefinished && !state2.finalCalled) {
      if (typeof stream2._final === "function" && !state2.destroyed) {
        state2.finalCalled = true;
        callFinal(stream2, state2);
      } else {
        state2.prefinished = true;
        stream2.emit("prefinish");
      }
    }
  }
  function finishMaybe(stream2, state2, sync) {
    if (needFinish(state2)) {
      prefinish(stream2, state2);
      if (state2.pendingcb === 0) {
        if (sync) {
          state2.pendingcb++;
          process2.nextTick(
            (stream3, state3) => {
              if (needFinish(state3)) {
                finish(stream3, state3);
              } else {
                state3.pendingcb--;
              }
            },
            stream2,
            state2
          );
        } else if (needFinish(state2)) {
          state2.pendingcb++;
          finish(stream2, state2);
        }
      }
    }
  }
  function finish(stream2, state2) {
    state2.pendingcb--;
    state2.finished = true;
    const onfinishCallbacks = state2[kOnFinished].splice(0);
    for (let i = 0; i < onfinishCallbacks.length; i++) {
      onfinishCallbacks[i]();
    }
    stream2.emit("finish");
    if (state2.autoDestroy) {
      const rState = stream2._readableState;
      const autoDestroy = !rState || rState.autoDestroy && // We don't expect the readable to ever 'end'
      // if readable is explicitly set to false.
      (rState.endEmitted || rState.readable === false);
      if (autoDestroy) {
        stream2.destroy();
      }
    }
  }
  ObjectDefineProperties(Writable.prototype, {
    closed: {
      __proto__: null,
      get() {
        return this._writableState ? this._writableState.closed : false;
      }
    },
    destroyed: {
      __proto__: null,
      get() {
        return this._writableState ? this._writableState.destroyed : false;
      },
      set(value) {
        if (this._writableState) {
          this._writableState.destroyed = value;
        }
      }
    },
    writable: {
      __proto__: null,
      get() {
        const w = this._writableState;
        return !!w && w.writable !== false && !w.destroyed && !w.errored && !w.ending && !w.ended;
      },
      set(val) {
        if (this._writableState) {
          this._writableState.writable = !!val;
        }
      }
    },
    writableFinished: {
      __proto__: null,
      get() {
        return this._writableState ? this._writableState.finished : false;
      }
    },
    writableObjectMode: {
      __proto__: null,
      get() {
        return this._writableState ? this._writableState.objectMode : false;
      }
    },
    writableBuffer: {
      __proto__: null,
      get() {
        return this._writableState && this._writableState.getBuffer();
      }
    },
    writableEnded: {
      __proto__: null,
      get() {
        return this._writableState ? this._writableState.ending : false;
      }
    },
    writableNeedDrain: {
      __proto__: null,
      get() {
        const wState = this._writableState;
        if (!wState) return false;
        return !wState.destroyed && !wState.ending && wState.needDrain;
      }
    },
    writableHighWaterMark: {
      __proto__: null,
      get() {
        return this._writableState && this._writableState.highWaterMark;
      }
    },
    writableCorked: {
      __proto__: null,
      get() {
        return this._writableState ? this._writableState.corked : 0;
      }
    },
    writableLength: {
      __proto__: null,
      get() {
        return this._writableState && this._writableState.length;
      }
    },
    errored: {
      __proto__: null,
      enumerable: false,
      get() {
        return this._writableState ? this._writableState.errored : null;
      }
    },
    writableAborted: {
      __proto__: null,
      enumerable: false,
      get: function() {
        return !!(this._writableState.writable !== false && (this._writableState.destroyed || this._writableState.errored) && !this._writableState.finished);
      }
    }
  });
  const destroy = destroyImpl.destroy;
  Writable.prototype.destroy = function(err, cb) {
    const state2 = this._writableState;
    if (!state2.destroyed && (state2.bufferedIndex < state2.buffered.length || state2[kOnFinished].length)) {
      process2.nextTick(errorBuffer, state2);
    }
    destroy.call(this, err, cb);
    return this;
  };
  Writable.prototype._undestroy = destroyImpl.undestroy;
  Writable.prototype._destroy = function(err, cb) {
    cb(err);
  };
  Writable.prototype[EE.captureRejectionSymbol] = function(err) {
    this.destroy(err);
  };
  let webStreamsAdapters;
  function lazyWebStreams() {
    if (webStreamsAdapters === void 0) webStreamsAdapters = {};
    return webStreamsAdapters;
  }
  Writable.fromWeb = function(writableStream, options) {
    return lazyWebStreams().newStreamWritableFromWritableStream(writableStream, options);
  };
  Writable.toWeb = function(streamWritable) {
    return lazyWebStreams().newWritableStreamFromStreamWritable(streamWritable);
  };
  return writable;
}
var duplexify;
var hasRequiredDuplexify;
function requireDuplexify() {
  if (hasRequiredDuplexify) return duplexify;
  hasRequiredDuplexify = 1;
  const process2 = requireProcess();
  const bufferModule = require$$0$5;
  const {
    isReadable,
    isWritable,
    isIterable,
    isNodeStream,
    isReadableNodeStream,
    isWritableNodeStream,
    isDuplexNodeStream,
    isReadableStream,
    isWritableStream
  } = requireUtils$1();
  const eos = requireEndOfStream();
  const {
    AbortError,
    codes: { ERR_INVALID_ARG_TYPE, ERR_INVALID_RETURN_VALUE }
  } = requireErrors();
  const { destroyer } = requireDestroy();
  const Duplex = requireDuplex();
  const Readable = requireReadable();
  const Writable = requireWritable();
  const { createDeferredPromise } = requireUtil$1();
  const from = requireFrom();
  const Blob2 = globalThis.Blob || bufferModule.Blob;
  const isBlob = typeof Blob2 !== "undefined" ? function isBlob2(b) {
    return b instanceof Blob2;
  } : function isBlob2(b) {
    return false;
  };
  const AbortController2 = globalThis.AbortController || require$$0$3.AbortController;
  const { FunctionPrototypeCall } = requirePrimordials();
  class Duplexify extends Duplex {
    constructor(options) {
      super(options);
      if ((options === null || options === void 0 ? void 0 : options.readable) === false) {
        this._readableState.readable = false;
        this._readableState.ended = true;
        this._readableState.endEmitted = true;
      }
      if ((options === null || options === void 0 ? void 0 : options.writable) === false) {
        this._writableState.writable = false;
        this._writableState.ending = true;
        this._writableState.ended = true;
        this._writableState.finished = true;
      }
    }
  }
  duplexify = function duplexify2(body, name) {
    if (isDuplexNodeStream(body)) {
      return body;
    }
    if (isReadableNodeStream(body)) {
      return _duplexify({
        readable: body
      });
    }
    if (isWritableNodeStream(body)) {
      return _duplexify({
        writable: body
      });
    }
    if (isNodeStream(body)) {
      return _duplexify({
        writable: false,
        readable: false
      });
    }
    if (isReadableStream(body)) {
      return _duplexify({
        readable: Readable.fromWeb(body)
      });
    }
    if (isWritableStream(body)) {
      return _duplexify({
        writable: Writable.fromWeb(body)
      });
    }
    if (typeof body === "function") {
      const { value, write, final, destroy } = fromAsyncGen(body);
      if (isIterable(value)) {
        return from(Duplexify, value, {
          // TODO (ronag): highWaterMark?
          objectMode: true,
          write,
          final,
          destroy
        });
      }
      const then2 = value === null || value === void 0 ? void 0 : value.then;
      if (typeof then2 === "function") {
        let d;
        const promise = FunctionPrototypeCall(
          then2,
          value,
          (val) => {
            if (val != null) {
              throw new ERR_INVALID_RETURN_VALUE("nully", "body", val);
            }
          },
          (err) => {
            destroyer(d, err);
          }
        );
        return d = new Duplexify({
          // TODO (ronag): highWaterMark?
          objectMode: true,
          readable: false,
          write,
          final(cb) {
            final(async () => {
              try {
                await promise;
                process2.nextTick(cb, null);
              } catch (err) {
                process2.nextTick(cb, err);
              }
            });
          },
          destroy
        });
      }
      throw new ERR_INVALID_RETURN_VALUE("Iterable, AsyncIterable or AsyncFunction", name, value);
    }
    if (isBlob(body)) {
      return duplexify2(body.arrayBuffer());
    }
    if (isIterable(body)) {
      return from(Duplexify, body, {
        // TODO (ronag): highWaterMark?
        objectMode: true,
        writable: false
      });
    }
    if (isReadableStream(body === null || body === void 0 ? void 0 : body.readable) && isWritableStream(body === null || body === void 0 ? void 0 : body.writable)) {
      return Duplexify.fromWeb(body);
    }
    if (typeof (body === null || body === void 0 ? void 0 : body.writable) === "object" || typeof (body === null || body === void 0 ? void 0 : body.readable) === "object") {
      const readable2 = body !== null && body !== void 0 && body.readable ? isReadableNodeStream(body === null || body === void 0 ? void 0 : body.readable) ? body === null || body === void 0 ? void 0 : body.readable : duplexify2(body.readable) : void 0;
      const writable2 = body !== null && body !== void 0 && body.writable ? isWritableNodeStream(body === null || body === void 0 ? void 0 : body.writable) ? body === null || body === void 0 ? void 0 : body.writable : duplexify2(body.writable) : void 0;
      return _duplexify({
        readable: readable2,
        writable: writable2
      });
    }
    const then = body === null || body === void 0 ? void 0 : body.then;
    if (typeof then === "function") {
      let d;
      FunctionPrototypeCall(
        then,
        body,
        (val) => {
          if (val != null) {
            d.push(val);
          }
          d.push(null);
        },
        (err) => {
          destroyer(d, err);
        }
      );
      return d = new Duplexify({
        objectMode: true,
        writable: false,
        read() {
        }
      });
    }
    throw new ERR_INVALID_ARG_TYPE(
      name,
      [
        "Blob",
        "ReadableStream",
        "WritableStream",
        "Stream",
        "Iterable",
        "AsyncIterable",
        "Function",
        "{ readable, writable } pair",
        "Promise"
      ],
      body
    );
  };
  function fromAsyncGen(fn) {
    let { promise, resolve } = createDeferredPromise();
    const ac = new AbortController2();
    const signal = ac.signal;
    const value = fn(
      (async function* () {
        while (true) {
          const _promise = promise;
          promise = null;
          const { chunk, done, cb } = await _promise;
          process2.nextTick(cb);
          if (done) return;
          if (signal.aborted)
            throw new AbortError(void 0, {
              cause: signal.reason
            });
          ({ promise, resolve } = createDeferredPromise());
          yield chunk;
        }
      })(),
      {
        signal
      }
    );
    return {
      value,
      write(chunk, encoding, cb) {
        const _resolve = resolve;
        resolve = null;
        _resolve({
          chunk,
          done: false,
          cb
        });
      },
      final(cb) {
        const _resolve = resolve;
        resolve = null;
        _resolve({
          done: true,
          cb
        });
      },
      destroy(err, cb) {
        ac.abort();
        cb(err);
      }
    };
  }
  function _duplexify(pair) {
    const r = pair.readable && typeof pair.readable.read !== "function" ? Readable.wrap(pair.readable) : pair.readable;
    const w = pair.writable;
    let readable2 = !!isReadable(r);
    let writable2 = !!isWritable(w);
    let ondrain;
    let onfinish;
    let onreadable;
    let onclose;
    let d;
    function onfinished(err) {
      const cb = onclose;
      onclose = null;
      if (cb) {
        cb(err);
      } else if (err) {
        d.destroy(err);
      }
    }
    d = new Duplexify({
      // TODO (ronag): highWaterMark?
      readableObjectMode: !!(r !== null && r !== void 0 && r.readableObjectMode),
      writableObjectMode: !!(w !== null && w !== void 0 && w.writableObjectMode),
      readable: readable2,
      writable: writable2
    });
    if (writable2) {
      eos(w, (err) => {
        writable2 = false;
        if (err) {
          destroyer(r, err);
        }
        onfinished(err);
      });
      d._write = function(chunk, encoding, callback) {
        if (w.write(chunk, encoding)) {
          callback();
        } else {
          ondrain = callback;
        }
      };
      d._final = function(callback) {
        w.end();
        onfinish = callback;
      };
      w.on("drain", function() {
        if (ondrain) {
          const cb = ondrain;
          ondrain = null;
          cb();
        }
      });
      w.on("finish", function() {
        if (onfinish) {
          const cb = onfinish;
          onfinish = null;
          cb();
        }
      });
    }
    if (readable2) {
      eos(r, (err) => {
        readable2 = false;
        if (err) {
          destroyer(r, err);
        }
        onfinished(err);
      });
      r.on("readable", function() {
        if (onreadable) {
          const cb = onreadable;
          onreadable = null;
          cb();
        }
      });
      r.on("end", function() {
        d.push(null);
      });
      d._read = function() {
        while (true) {
          const buf = r.read();
          if (buf === null) {
            onreadable = d._read;
            return;
          }
          if (!d.push(buf)) {
            return;
          }
        }
      };
    }
    d._destroy = function(err, callback) {
      if (!err && onclose !== null) {
        err = new AbortError();
      }
      onreadable = null;
      ondrain = null;
      onfinish = null;
      if (onclose === null) {
        callback(err);
      } else {
        onclose = callback;
        destroyer(w, err);
        destroyer(r, err);
      }
    };
    return d;
  }
  return duplexify;
}
var duplex;
var hasRequiredDuplex;
function requireDuplex() {
  if (hasRequiredDuplex) return duplex;
  hasRequiredDuplex = 1;
  const {
    ObjectDefineProperties,
    ObjectGetOwnPropertyDescriptor,
    ObjectKeys,
    ObjectSetPrototypeOf
  } = requirePrimordials();
  duplex = Duplex;
  const Readable = requireReadable();
  const Writable = requireWritable();
  ObjectSetPrototypeOf(Duplex.prototype, Readable.prototype);
  ObjectSetPrototypeOf(Duplex, Readable);
  {
    const keys = ObjectKeys(Writable.prototype);
    for (let i = 0; i < keys.length; i++) {
      const method = keys[i];
      if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
    }
  }
  function Duplex(options) {
    if (!(this instanceof Duplex)) return new Duplex(options);
    Readable.call(this, options);
    Writable.call(this, options);
    if (options) {
      this.allowHalfOpen = options.allowHalfOpen !== false;
      if (options.readable === false) {
        this._readableState.readable = false;
        this._readableState.ended = true;
        this._readableState.endEmitted = true;
      }
      if (options.writable === false) {
        this._writableState.writable = false;
        this._writableState.ending = true;
        this._writableState.ended = true;
        this._writableState.finished = true;
      }
    } else {
      this.allowHalfOpen = true;
    }
  }
  ObjectDefineProperties(Duplex.prototype, {
    writable: {
      __proto__: null,
      ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writable")
    },
    writableHighWaterMark: {
      __proto__: null,
      ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableHighWaterMark")
    },
    writableObjectMode: {
      __proto__: null,
      ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableObjectMode")
    },
    writableBuffer: {
      __proto__: null,
      ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableBuffer")
    },
    writableLength: {
      __proto__: null,
      ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableLength")
    },
    writableFinished: {
      __proto__: null,
      ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableFinished")
    },
    writableCorked: {
      __proto__: null,
      ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableCorked")
    },
    writableEnded: {
      __proto__: null,
      ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableEnded")
    },
    writableNeedDrain: {
      __proto__: null,
      ...ObjectGetOwnPropertyDescriptor(Writable.prototype, "writableNeedDrain")
    },
    destroyed: {
      __proto__: null,
      get() {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return false;
        }
        return this._readableState.destroyed && this._writableState.destroyed;
      },
      set(value) {
        if (this._readableState && this._writableState) {
          this._readableState.destroyed = value;
          this._writableState.destroyed = value;
        }
      }
    }
  });
  let webStreamsAdapters;
  function lazyWebStreams() {
    if (webStreamsAdapters === void 0) webStreamsAdapters = {};
    return webStreamsAdapters;
  }
  Duplex.fromWeb = function(pair, options) {
    return lazyWebStreams().newStreamDuplexFromReadableWritablePair(pair, options);
  };
  Duplex.toWeb = function(duplex2) {
    return lazyWebStreams().newReadableWritablePairFromDuplex(duplex2);
  };
  let duplexify2;
  Duplex.from = function(body) {
    if (!duplexify2) {
      duplexify2 = requireDuplexify();
    }
    return duplexify2(body, "body");
  };
  return duplex;
}
var transform;
var hasRequiredTransform;
function requireTransform() {
  if (hasRequiredTransform) return transform;
  hasRequiredTransform = 1;
  const { ObjectSetPrototypeOf, Symbol: Symbol2 } = requirePrimordials();
  transform = Transform;
  const { ERR_METHOD_NOT_IMPLEMENTED } = requireErrors().codes;
  const Duplex = requireDuplex();
  const { getHighWaterMark } = requireState();
  ObjectSetPrototypeOf(Transform.prototype, Duplex.prototype);
  ObjectSetPrototypeOf(Transform, Duplex);
  const kCallback = Symbol2("kCallback");
  function Transform(options) {
    if (!(this instanceof Transform)) return new Transform(options);
    const readableHighWaterMark = options ? getHighWaterMark(this, options, "readableHighWaterMark", true) : null;
    if (readableHighWaterMark === 0) {
      options = {
        ...options,
        highWaterMark: null,
        readableHighWaterMark,
        // TODO (ronag): 0 is not optimal since we have
        // a "bug" where we check needDrain before calling _write and not after.
        // Refs: https://github.com/nodejs/node/pull/32887
        // Refs: https://github.com/nodejs/node/pull/35941
        writableHighWaterMark: options.writableHighWaterMark || 0
      };
    }
    Duplex.call(this, options);
    this._readableState.sync = false;
    this[kCallback] = null;
    if (options) {
      if (typeof options.transform === "function") this._transform = options.transform;
      if (typeof options.flush === "function") this._flush = options.flush;
    }
    this.on("prefinish", prefinish);
  }
  function final(cb) {
    if (typeof this._flush === "function" && !this.destroyed) {
      this._flush((er, data) => {
        if (er) {
          if (cb) {
            cb(er);
          } else {
            this.destroy(er);
          }
          return;
        }
        if (data != null) {
          this.push(data);
        }
        this.push(null);
        if (cb) {
          cb();
        }
      });
    } else {
      this.push(null);
      if (cb) {
        cb();
      }
    }
  }
  function prefinish() {
    if (this._final !== final) {
      final.call(this);
    }
  }
  Transform.prototype._final = final;
  Transform.prototype._transform = function(chunk, encoding, callback) {
    throw new ERR_METHOD_NOT_IMPLEMENTED("_transform()");
  };
  Transform.prototype._write = function(chunk, encoding, callback) {
    const rState = this._readableState;
    const wState = this._writableState;
    const length = rState.length;
    this._transform(chunk, encoding, (err, val) => {
      if (err) {
        callback(err);
        return;
      }
      if (val != null) {
        this.push(val);
      }
      if (wState.ended || // Backwards compat.
      length === rState.length || // Backwards compat.
      rState.length < rState.highWaterMark) {
        callback();
      } else {
        this[kCallback] = callback;
      }
    });
  };
  Transform.prototype._read = function() {
    if (this[kCallback]) {
      const callback = this[kCallback];
      this[kCallback] = null;
      callback();
    }
  };
  return transform;
}
var passthrough;
var hasRequiredPassthrough;
function requirePassthrough() {
  if (hasRequiredPassthrough) return passthrough;
  hasRequiredPassthrough = 1;
  const { ObjectSetPrototypeOf } = requirePrimordials();
  passthrough = PassThrough;
  const Transform = requireTransform();
  ObjectSetPrototypeOf(PassThrough.prototype, Transform.prototype);
  ObjectSetPrototypeOf(PassThrough, Transform);
  function PassThrough(options) {
    if (!(this instanceof PassThrough)) return new PassThrough(options);
    Transform.call(this, options);
  }
  PassThrough.prototype._transform = function(chunk, encoding, cb) {
    cb(null, chunk);
  };
  return passthrough;
}
var pipeline_1;
var hasRequiredPipeline;
function requirePipeline() {
  if (hasRequiredPipeline) return pipeline_1;
  hasRequiredPipeline = 1;
  const process2 = requireProcess();
  const { ArrayIsArray, Promise: Promise2, SymbolAsyncIterator, SymbolDispose } = requirePrimordials();
  const eos = requireEndOfStream();
  const { once } = requireUtil$1();
  const destroyImpl = requireDestroy();
  const Duplex = requireDuplex();
  const {
    aggregateTwoErrors,
    codes: {
      ERR_INVALID_ARG_TYPE,
      ERR_INVALID_RETURN_VALUE,
      ERR_MISSING_ARGS,
      ERR_STREAM_DESTROYED,
      ERR_STREAM_PREMATURE_CLOSE
    },
    AbortError
  } = requireErrors();
  const { validateFunction, validateAbortSignal } = requireValidators();
  const {
    isIterable,
    isReadable,
    isReadableNodeStream,
    isNodeStream,
    isTransformStream,
    isWebStream,
    isReadableStream,
    isReadableFinished
  } = requireUtils$1();
  const AbortController2 = globalThis.AbortController || require$$0$3.AbortController;
  let PassThrough;
  let Readable;
  let addAbortListener;
  function destroyer(stream2, reading, writing) {
    let finished = false;
    stream2.on("close", () => {
      finished = true;
    });
    const cleanup = eos(
      stream2,
      {
        readable: reading,
        writable: writing
      },
      (err) => {
        finished = !err;
      }
    );
    return {
      destroy: (err) => {
        if (finished) return;
        finished = true;
        destroyImpl.destroyer(stream2, err || new ERR_STREAM_DESTROYED("pipe"));
      },
      cleanup
    };
  }
  function popCallback(streams) {
    validateFunction(streams[streams.length - 1], "streams[stream.length - 1]");
    return streams.pop();
  }
  function makeAsyncIterable(val) {
    if (isIterable(val)) {
      return val;
    } else if (isReadableNodeStream(val)) {
      return fromReadable(val);
    }
    throw new ERR_INVALID_ARG_TYPE("val", ["Readable", "Iterable", "AsyncIterable"], val);
  }
  async function* fromReadable(val) {
    if (!Readable) {
      Readable = requireReadable();
    }
    yield* Readable.prototype[SymbolAsyncIterator].call(val);
  }
  async function pumpToNode(iterable, writable2, finish, { end }) {
    let error;
    let onresolve = null;
    const resume = (err) => {
      if (err) {
        error = err;
      }
      if (onresolve) {
        const callback = onresolve;
        onresolve = null;
        callback();
      }
    };
    const wait = () => new Promise2((resolve, reject) => {
      if (error) {
        reject(error);
      } else {
        onresolve = () => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        };
      }
    });
    writable2.on("drain", resume);
    const cleanup = eos(
      writable2,
      {
        readable: false
      },
      resume
    );
    try {
      if (writable2.writableNeedDrain) {
        await wait();
      }
      for await (const chunk of iterable) {
        if (!writable2.write(chunk)) {
          await wait();
        }
      }
      if (end) {
        writable2.end();
        await wait();
      }
      finish();
    } catch (err) {
      finish(error !== err ? aggregateTwoErrors(error, err) : err);
    } finally {
      cleanup();
      writable2.off("drain", resume);
    }
  }
  async function pumpToWeb(readable2, writable2, finish, { end }) {
    if (isTransformStream(writable2)) {
      writable2 = writable2.writable;
    }
    const writer = writable2.getWriter();
    try {
      for await (const chunk of readable2) {
        await writer.ready;
        writer.write(chunk).catch(() => {
        });
      }
      await writer.ready;
      if (end) {
        await writer.close();
      }
      finish();
    } catch (err) {
      try {
        await writer.abort(err);
        finish(err);
      } catch (err2) {
        finish(err2);
      }
    }
  }
  function pipeline(...streams) {
    return pipelineImpl(streams, once(popCallback(streams)));
  }
  function pipelineImpl(streams, callback, opts) {
    if (streams.length === 1 && ArrayIsArray(streams[0])) {
      streams = streams[0];
    }
    if (streams.length < 2) {
      throw new ERR_MISSING_ARGS("streams");
    }
    const ac = new AbortController2();
    const signal = ac.signal;
    const outerSignal = opts === null || opts === void 0 ? void 0 : opts.signal;
    const lastStreamCleanup = [];
    validateAbortSignal(outerSignal, "options.signal");
    function abort() {
      finishImpl(new AbortError());
    }
    addAbortListener = addAbortListener || requireUtil$1().addAbortListener;
    let disposable;
    if (outerSignal) {
      disposable = addAbortListener(outerSignal, abort);
    }
    let error;
    let value;
    const destroys = [];
    let finishCount = 0;
    function finish(err) {
      finishImpl(err, --finishCount === 0);
    }
    function finishImpl(err, final) {
      var _disposable;
      if (err && (!error || error.code === "ERR_STREAM_PREMATURE_CLOSE")) {
        error = err;
      }
      if (!error && !final) {
        return;
      }
      while (destroys.length) {
        destroys.shift()(error);
      }
      (_disposable = disposable) === null || _disposable === void 0 ? void 0 : _disposable[SymbolDispose]();
      ac.abort();
      if (final) {
        if (!error) {
          lastStreamCleanup.forEach((fn) => fn());
        }
        process2.nextTick(callback, error, value);
      }
    }
    let ret;
    for (let i = 0; i < streams.length; i++) {
      const stream2 = streams[i];
      const reading = i < streams.length - 1;
      const writing = i > 0;
      const end = reading || (opts === null || opts === void 0 ? void 0 : opts.end) !== false;
      const isLastStream = i === streams.length - 1;
      if (isNodeStream(stream2)) {
        let onError = function(err) {
          if (err && err.name !== "AbortError" && err.code !== "ERR_STREAM_PREMATURE_CLOSE") {
            finish(err);
          }
        };
        if (end) {
          const { destroy, cleanup } = destroyer(stream2, reading, writing);
          destroys.push(destroy);
          if (isReadable(stream2) && isLastStream) {
            lastStreamCleanup.push(cleanup);
          }
        }
        stream2.on("error", onError);
        if (isReadable(stream2) && isLastStream) {
          lastStreamCleanup.push(() => {
            stream2.removeListener("error", onError);
          });
        }
      }
      if (i === 0) {
        if (typeof stream2 === "function") {
          ret = stream2({
            signal
          });
          if (!isIterable(ret)) {
            throw new ERR_INVALID_RETURN_VALUE("Iterable, AsyncIterable or Stream", "source", ret);
          }
        } else if (isIterable(stream2) || isReadableNodeStream(stream2) || isTransformStream(stream2)) {
          ret = stream2;
        } else {
          ret = Duplex.from(stream2);
        }
      } else if (typeof stream2 === "function") {
        if (isTransformStream(ret)) {
          var _ret;
          ret = makeAsyncIterable((_ret = ret) === null || _ret === void 0 ? void 0 : _ret.readable);
        } else {
          ret = makeAsyncIterable(ret);
        }
        ret = stream2(ret, {
          signal
        });
        if (reading) {
          if (!isIterable(ret, true)) {
            throw new ERR_INVALID_RETURN_VALUE("AsyncIterable", `transform[${i - 1}]`, ret);
          }
        } else {
          var _ret2;
          if (!PassThrough) {
            PassThrough = requirePassthrough();
          }
          const pt = new PassThrough({
            objectMode: true
          });
          const then = (_ret2 = ret) === null || _ret2 === void 0 ? void 0 : _ret2.then;
          if (typeof then === "function") {
            finishCount++;
            then.call(
              ret,
              (val) => {
                value = val;
                if (val != null) {
                  pt.write(val);
                }
                if (end) {
                  pt.end();
                }
                process2.nextTick(finish);
              },
              (err) => {
                pt.destroy(err);
                process2.nextTick(finish, err);
              }
            );
          } else if (isIterable(ret, true)) {
            finishCount++;
            pumpToNode(ret, pt, finish, {
              end
            });
          } else if (isReadableStream(ret) || isTransformStream(ret)) {
            const toRead = ret.readable || ret;
            finishCount++;
            pumpToNode(toRead, pt, finish, {
              end
            });
          } else {
            throw new ERR_INVALID_RETURN_VALUE("AsyncIterable or Promise", "destination", ret);
          }
          ret = pt;
          const { destroy, cleanup } = destroyer(ret, false, true);
          destroys.push(destroy);
          if (isLastStream) {
            lastStreamCleanup.push(cleanup);
          }
        }
      } else if (isNodeStream(stream2)) {
        if (isReadableNodeStream(ret)) {
          finishCount += 2;
          const cleanup = pipe(ret, stream2, finish, {
            end
          });
          if (isReadable(stream2) && isLastStream) {
            lastStreamCleanup.push(cleanup);
          }
        } else if (isTransformStream(ret) || isReadableStream(ret)) {
          const toRead = ret.readable || ret;
          finishCount++;
          pumpToNode(toRead, stream2, finish, {
            end
          });
        } else if (isIterable(ret)) {
          finishCount++;
          pumpToNode(ret, stream2, finish, {
            end
          });
        } else {
          throw new ERR_INVALID_ARG_TYPE(
            "val",
            ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],
            ret
          );
        }
        ret = stream2;
      } else if (isWebStream(stream2)) {
        if (isReadableNodeStream(ret)) {
          finishCount++;
          pumpToWeb(makeAsyncIterable(ret), stream2, finish, {
            end
          });
        } else if (isReadableStream(ret) || isIterable(ret)) {
          finishCount++;
          pumpToWeb(ret, stream2, finish, {
            end
          });
        } else if (isTransformStream(ret)) {
          finishCount++;
          pumpToWeb(ret.readable, stream2, finish, {
            end
          });
        } else {
          throw new ERR_INVALID_ARG_TYPE(
            "val",
            ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],
            ret
          );
        }
        ret = stream2;
      } else {
        ret = Duplex.from(stream2);
      }
    }
    if (signal !== null && signal !== void 0 && signal.aborted || outerSignal !== null && outerSignal !== void 0 && outerSignal.aborted) {
      process2.nextTick(abort);
    }
    return ret;
  }
  function pipe(src2, dst, finish, { end }) {
    let ended = false;
    dst.on("close", () => {
      if (!ended) {
        finish(new ERR_STREAM_PREMATURE_CLOSE());
      }
    });
    src2.pipe(dst, {
      end: false
    });
    if (end) {
      let endFn = function() {
        ended = true;
        dst.end();
      };
      if (isReadableFinished(src2)) {
        process2.nextTick(endFn);
      } else {
        src2.once("end", endFn);
      }
    } else {
      finish();
    }
    eos(
      src2,
      {
        readable: true,
        writable: false
      },
      (err) => {
        const rState = src2._readableState;
        if (err && err.code === "ERR_STREAM_PREMATURE_CLOSE" && rState && rState.ended && !rState.errored && !rState.errorEmitted) {
          src2.once("end", finish).once("error", finish);
        } else {
          finish(err);
        }
      }
    );
    return eos(
      dst,
      {
        readable: false,
        writable: true
      },
      finish
    );
  }
  pipeline_1 = {
    pipelineImpl,
    pipeline
  };
  return pipeline_1;
}
var compose;
var hasRequiredCompose;
function requireCompose() {
  if (hasRequiredCompose) return compose;
  hasRequiredCompose = 1;
  const { pipeline } = requirePipeline();
  const Duplex = requireDuplex();
  const { destroyer } = requireDestroy();
  const {
    isNodeStream,
    isReadable,
    isWritable,
    isWebStream,
    isTransformStream,
    isWritableStream,
    isReadableStream
  } = requireUtils$1();
  const {
    AbortError,
    codes: { ERR_INVALID_ARG_VALUE, ERR_MISSING_ARGS }
  } = requireErrors();
  const eos = requireEndOfStream();
  compose = function compose2(...streams) {
    if (streams.length === 0) {
      throw new ERR_MISSING_ARGS("streams");
    }
    if (streams.length === 1) {
      return Duplex.from(streams[0]);
    }
    const orgStreams = [...streams];
    if (typeof streams[0] === "function") {
      streams[0] = Duplex.from(streams[0]);
    }
    if (typeof streams[streams.length - 1] === "function") {
      const idx = streams.length - 1;
      streams[idx] = Duplex.from(streams[idx]);
    }
    for (let n = 0; n < streams.length; ++n) {
      if (!isNodeStream(streams[n]) && !isWebStream(streams[n])) {
        continue;
      }
      if (n < streams.length - 1 && !(isReadable(streams[n]) || isReadableStream(streams[n]) || isTransformStream(streams[n]))) {
        throw new ERR_INVALID_ARG_VALUE(`streams[${n}]`, orgStreams[n], "must be readable");
      }
      if (n > 0 && !(isWritable(streams[n]) || isWritableStream(streams[n]) || isTransformStream(streams[n]))) {
        throw new ERR_INVALID_ARG_VALUE(`streams[${n}]`, orgStreams[n], "must be writable");
      }
    }
    let ondrain;
    let onfinish;
    let onreadable;
    let onclose;
    let d;
    function onfinished(err) {
      const cb = onclose;
      onclose = null;
      if (cb) {
        cb(err);
      } else if (err) {
        d.destroy(err);
      } else if (!readable2 && !writable2) {
        d.destroy();
      }
    }
    const head = streams[0];
    const tail = pipeline(streams, onfinished);
    const writable2 = !!(isWritable(head) || isWritableStream(head) || isTransformStream(head));
    const readable2 = !!(isReadable(tail) || isReadableStream(tail) || isTransformStream(tail));
    d = new Duplex({
      // TODO (ronag): highWaterMark?
      writableObjectMode: !!(head !== null && head !== void 0 && head.writableObjectMode),
      readableObjectMode: !!(tail !== null && tail !== void 0 && tail.readableObjectMode),
      writable: writable2,
      readable: readable2
    });
    if (writable2) {
      if (isNodeStream(head)) {
        d._write = function(chunk, encoding, callback) {
          if (head.write(chunk, encoding)) {
            callback();
          } else {
            ondrain = callback;
          }
        };
        d._final = function(callback) {
          head.end();
          onfinish = callback;
        };
        head.on("drain", function() {
          if (ondrain) {
            const cb = ondrain;
            ondrain = null;
            cb();
          }
        });
      } else if (isWebStream(head)) {
        const writable3 = isTransformStream(head) ? head.writable : head;
        const writer = writable3.getWriter();
        d._write = async function(chunk, encoding, callback) {
          try {
            await writer.ready;
            writer.write(chunk).catch(() => {
            });
            callback();
          } catch (err) {
            callback(err);
          }
        };
        d._final = async function(callback) {
          try {
            await writer.ready;
            writer.close().catch(() => {
            });
            onfinish = callback;
          } catch (err) {
            callback(err);
          }
        };
      }
      const toRead = isTransformStream(tail) ? tail.readable : tail;
      eos(toRead, () => {
        if (onfinish) {
          const cb = onfinish;
          onfinish = null;
          cb();
        }
      });
    }
    if (readable2) {
      if (isNodeStream(tail)) {
        tail.on("readable", function() {
          if (onreadable) {
            const cb = onreadable;
            onreadable = null;
            cb();
          }
        });
        tail.on("end", function() {
          d.push(null);
        });
        d._read = function() {
          while (true) {
            const buf = tail.read();
            if (buf === null) {
              onreadable = d._read;
              return;
            }
            if (!d.push(buf)) {
              return;
            }
          }
        };
      } else if (isWebStream(tail)) {
        const readable3 = isTransformStream(tail) ? tail.readable : tail;
        const reader = readable3.getReader();
        d._read = async function() {
          while (true) {
            try {
              const { value, done } = await reader.read();
              if (!d.push(value)) {
                return;
              }
              if (done) {
                d.push(null);
                return;
              }
            } catch {
              return;
            }
          }
        };
      }
    }
    d._destroy = function(err, callback) {
      if (!err && onclose !== null) {
        err = new AbortError();
      }
      onreadable = null;
      ondrain = null;
      onfinish = null;
      if (onclose === null) {
        callback(err);
      } else {
        onclose = callback;
        if (isNodeStream(tail)) {
          destroyer(tail, err);
        }
      }
    };
    return d;
  };
  return compose;
}
var hasRequiredOperators;
function requireOperators() {
  if (hasRequiredOperators) return operators;
  hasRequiredOperators = 1;
  const AbortController2 = globalThis.AbortController || require$$0$3.AbortController;
  const {
    codes: { ERR_INVALID_ARG_VALUE, ERR_INVALID_ARG_TYPE, ERR_MISSING_ARGS, ERR_OUT_OF_RANGE },
    AbortError
  } = requireErrors();
  const { validateAbortSignal, validateInteger, validateObject } = requireValidators();
  const kWeakHandler = requirePrimordials().Symbol("kWeak");
  const kResistStopPropagation = requirePrimordials().Symbol("kResistStopPropagation");
  const { finished } = requireEndOfStream();
  const staticCompose = requireCompose();
  const { addAbortSignalNoValidate } = requireAddAbortSignal();
  const { isWritable, isNodeStream } = requireUtils$1();
  const { deprecate } = requireUtil$1();
  const {
    ArrayPrototypePush,
    Boolean: Boolean2,
    MathFloor,
    Number: Number2,
    NumberIsNaN,
    Promise: Promise2,
    PromiseReject,
    PromiseResolve,
    PromisePrototypeThen,
    Symbol: Symbol2
  } = requirePrimordials();
  const kEmpty = Symbol2("kEmpty");
  const kEof = Symbol2("kEof");
  function compose2(stream2, options) {
    if (options != null) {
      validateObject(options, "options");
    }
    if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
      validateAbortSignal(options.signal, "options.signal");
    }
    if (isNodeStream(stream2) && !isWritable(stream2)) {
      throw new ERR_INVALID_ARG_VALUE("stream", stream2, "must be writable");
    }
    const composedStream = staticCompose(this, stream2);
    if (options !== null && options !== void 0 && options.signal) {
      addAbortSignalNoValidate(options.signal, composedStream);
    }
    return composedStream;
  }
  function map(fn, options) {
    if (typeof fn !== "function") {
      throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
    }
    if (options != null) {
      validateObject(options, "options");
    }
    if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
      validateAbortSignal(options.signal, "options.signal");
    }
    let concurrency = 1;
    if ((options === null || options === void 0 ? void 0 : options.concurrency) != null) {
      concurrency = MathFloor(options.concurrency);
    }
    let highWaterMark = concurrency - 1;
    if ((options === null || options === void 0 ? void 0 : options.highWaterMark) != null) {
      highWaterMark = MathFloor(options.highWaterMark);
    }
    validateInteger(concurrency, "options.concurrency", 1);
    validateInteger(highWaterMark, "options.highWaterMark", 0);
    highWaterMark += concurrency;
    return (async function* map2() {
      const signal = requireUtil$1().AbortSignalAny(
        [options === null || options === void 0 ? void 0 : options.signal].filter(Boolean2)
      );
      const stream2 = this;
      const queue = [];
      const signalOpt = {
        signal
      };
      let next;
      let resume;
      let done = false;
      let cnt = 0;
      function onCatch() {
        done = true;
        afterItemProcessed();
      }
      function afterItemProcessed() {
        cnt -= 1;
        maybeResume();
      }
      function maybeResume() {
        if (resume && !done && cnt < concurrency && queue.length < highWaterMark) {
          resume();
          resume = null;
        }
      }
      async function pump() {
        try {
          for await (let val of stream2) {
            if (done) {
              return;
            }
            if (signal.aborted) {
              throw new AbortError();
            }
            try {
              val = fn(val, signalOpt);
              if (val === kEmpty) {
                continue;
              }
              val = PromiseResolve(val);
            } catch (err) {
              val = PromiseReject(err);
            }
            cnt += 1;
            PromisePrototypeThen(val, afterItemProcessed, onCatch);
            queue.push(val);
            if (next) {
              next();
              next = null;
            }
            if (!done && (queue.length >= highWaterMark || cnt >= concurrency)) {
              await new Promise2((resolve) => {
                resume = resolve;
              });
            }
          }
          queue.push(kEof);
        } catch (err) {
          const val = PromiseReject(err);
          PromisePrototypeThen(val, afterItemProcessed, onCatch);
          queue.push(val);
        } finally {
          done = true;
          if (next) {
            next();
            next = null;
          }
        }
      }
      pump();
      try {
        while (true) {
          while (queue.length > 0) {
            const val = await queue[0];
            if (val === kEof) {
              return;
            }
            if (signal.aborted) {
              throw new AbortError();
            }
            if (val !== kEmpty) {
              yield val;
            }
            queue.shift();
            maybeResume();
          }
          await new Promise2((resolve) => {
            next = resolve;
          });
        }
      } finally {
        done = true;
        if (resume) {
          resume();
          resume = null;
        }
      }
    }).call(this);
  }
  function asIndexedPairs(options = void 0) {
    if (options != null) {
      validateObject(options, "options");
    }
    if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
      validateAbortSignal(options.signal, "options.signal");
    }
    return (async function* asIndexedPairs2() {
      let index = 0;
      for await (const val of this) {
        var _options$signal;
        if (options !== null && options !== void 0 && (_options$signal = options.signal) !== null && _options$signal !== void 0 && _options$signal.aborted) {
          throw new AbortError({
            cause: options.signal.reason
          });
        }
        yield [index++, val];
      }
    }).call(this);
  }
  async function some(fn, options = void 0) {
    for await (const unused of filter.call(this, fn, options)) {
      return true;
    }
    return false;
  }
  async function every(fn, options = void 0) {
    if (typeof fn !== "function") {
      throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
    }
    return !await some.call(
      this,
      async (...args) => {
        return !await fn(...args);
      },
      options
    );
  }
  async function find(fn, options) {
    for await (const result of filter.call(this, fn, options)) {
      return result;
    }
    return void 0;
  }
  async function forEach(fn, options) {
    if (typeof fn !== "function") {
      throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
    }
    async function forEachFn(value, options2) {
      await fn(value, options2);
      return kEmpty;
    }
    for await (const unused of map.call(this, forEachFn, options)) ;
  }
  function filter(fn, options) {
    if (typeof fn !== "function") {
      throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
    }
    async function filterFn(value, options2) {
      if (await fn(value, options2)) {
        return value;
      }
      return kEmpty;
    }
    return map.call(this, filterFn, options);
  }
  class ReduceAwareErrMissingArgs extends ERR_MISSING_ARGS {
    constructor() {
      super("reduce");
      this.message = "Reduce of an empty stream requires an initial value";
    }
  }
  async function reduce(reducer, initialValue, options) {
    var _options$signal2;
    if (typeof reducer !== "function") {
      throw new ERR_INVALID_ARG_TYPE("reducer", ["Function", "AsyncFunction"], reducer);
    }
    if (options != null) {
      validateObject(options, "options");
    }
    if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
      validateAbortSignal(options.signal, "options.signal");
    }
    let hasInitialValue = arguments.length > 1;
    if (options !== null && options !== void 0 && (_options$signal2 = options.signal) !== null && _options$signal2 !== void 0 && _options$signal2.aborted) {
      const err = new AbortError(void 0, {
        cause: options.signal.reason
      });
      this.once("error", () => {
      });
      await finished(this.destroy(err));
      throw err;
    }
    const ac = new AbortController2();
    const signal = ac.signal;
    if (options !== null && options !== void 0 && options.signal) {
      const opts = {
        once: true,
        [kWeakHandler]: this,
        [kResistStopPropagation]: true
      };
      options.signal.addEventListener("abort", () => ac.abort(), opts);
    }
    let gotAnyItemFromStream = false;
    try {
      for await (const value of this) {
        var _options$signal3;
        gotAnyItemFromStream = true;
        if (options !== null && options !== void 0 && (_options$signal3 = options.signal) !== null && _options$signal3 !== void 0 && _options$signal3.aborted) {
          throw new AbortError();
        }
        if (!hasInitialValue) {
          initialValue = value;
          hasInitialValue = true;
        } else {
          initialValue = await reducer(initialValue, value, {
            signal
          });
        }
      }
      if (!gotAnyItemFromStream && !hasInitialValue) {
        throw new ReduceAwareErrMissingArgs();
      }
    } finally {
      ac.abort();
    }
    return initialValue;
  }
  async function toArray(options) {
    if (options != null) {
      validateObject(options, "options");
    }
    if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
      validateAbortSignal(options.signal, "options.signal");
    }
    const result = [];
    for await (const val of this) {
      var _options$signal4;
      if (options !== null && options !== void 0 && (_options$signal4 = options.signal) !== null && _options$signal4 !== void 0 && _options$signal4.aborted) {
        throw new AbortError(void 0, {
          cause: options.signal.reason
        });
      }
      ArrayPrototypePush(result, val);
    }
    return result;
  }
  function flatMap(fn, options) {
    const values = map.call(this, fn, options);
    return (async function* flatMap2() {
      for await (const val of values) {
        yield* val;
      }
    }).call(this);
  }
  function toIntegerOrInfinity(number) {
    number = Number2(number);
    if (NumberIsNaN(number)) {
      return 0;
    }
    if (number < 0) {
      throw new ERR_OUT_OF_RANGE("number", ">= 0", number);
    }
    return number;
  }
  function drop(number, options = void 0) {
    if (options != null) {
      validateObject(options, "options");
    }
    if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
      validateAbortSignal(options.signal, "options.signal");
    }
    number = toIntegerOrInfinity(number);
    return (async function* drop2() {
      var _options$signal5;
      if (options !== null && options !== void 0 && (_options$signal5 = options.signal) !== null && _options$signal5 !== void 0 && _options$signal5.aborted) {
        throw new AbortError();
      }
      for await (const val of this) {
        var _options$signal6;
        if (options !== null && options !== void 0 && (_options$signal6 = options.signal) !== null && _options$signal6 !== void 0 && _options$signal6.aborted) {
          throw new AbortError();
        }
        if (number-- <= 0) {
          yield val;
        }
      }
    }).call(this);
  }
  function take(number, options = void 0) {
    if (options != null) {
      validateObject(options, "options");
    }
    if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
      validateAbortSignal(options.signal, "options.signal");
    }
    number = toIntegerOrInfinity(number);
    return (async function* take2() {
      var _options$signal7;
      if (options !== null && options !== void 0 && (_options$signal7 = options.signal) !== null && _options$signal7 !== void 0 && _options$signal7.aborted) {
        throw new AbortError();
      }
      for await (const val of this) {
        var _options$signal8;
        if (options !== null && options !== void 0 && (_options$signal8 = options.signal) !== null && _options$signal8 !== void 0 && _options$signal8.aborted) {
          throw new AbortError();
        }
        if (number-- > 0) {
          yield val;
        }
        if (number <= 0) {
          return;
        }
      }
    }).call(this);
  }
  operators.streamReturningOperators = {
    asIndexedPairs: deprecate(asIndexedPairs, "readable.asIndexedPairs will be removed in a future version."),
    drop,
    filter,
    flatMap,
    map,
    take,
    compose: compose2
  };
  operators.promiseReturningOperators = {
    every,
    forEach,
    reduce,
    toArray,
    some,
    find
  };
  return operators;
}
var promises;
var hasRequiredPromises;
function requirePromises() {
  if (hasRequiredPromises) return promises;
  hasRequiredPromises = 1;
  const { ArrayPrototypePop, Promise: Promise2 } = requirePrimordials();
  const { isIterable, isNodeStream, isWebStream } = requireUtils$1();
  const { pipelineImpl: pl } = requirePipeline();
  const { finished } = requireEndOfStream();
  requireStream$1();
  function pipeline(...streams) {
    return new Promise2((resolve, reject) => {
      let signal;
      let end;
      const lastArg = streams[streams.length - 1];
      if (lastArg && typeof lastArg === "object" && !isNodeStream(lastArg) && !isIterable(lastArg) && !isWebStream(lastArg)) {
        const options = ArrayPrototypePop(streams);
        signal = options.signal;
        end = options.end;
      }
      pl(
        streams,
        (err, value) => {
          if (err) {
            reject(err);
          } else {
            resolve(value);
          }
        },
        {
          signal,
          end
        }
      );
    });
  }
  promises = {
    finished,
    pipeline
  };
  return promises;
}
var hasRequiredStream$1;
function requireStream$1() {
  if (hasRequiredStream$1) return stream$1.exports;
  hasRequiredStream$1 = 1;
  const { Buffer: Buffer2 } = require$$0$5;
  const { ObjectDefineProperty, ObjectKeys, ReflectApply } = requirePrimordials();
  const {
    promisify: { custom: customPromisify }
  } = requireUtil$1();
  const { streamReturningOperators, promiseReturningOperators } = requireOperators();
  const {
    codes: { ERR_ILLEGAL_CONSTRUCTOR }
  } = requireErrors();
  const compose2 = requireCompose();
  const { setDefaultHighWaterMark, getDefaultHighWaterMark } = requireState();
  const { pipeline } = requirePipeline();
  const { destroyer } = requireDestroy();
  const eos = requireEndOfStream();
  const promises2 = requirePromises();
  const utils2 = requireUtils$1();
  const Stream = stream$1.exports = requireLegacy().Stream;
  Stream.isDestroyed = utils2.isDestroyed;
  Stream.isDisturbed = utils2.isDisturbed;
  Stream.isErrored = utils2.isErrored;
  Stream.isReadable = utils2.isReadable;
  Stream.isWritable = utils2.isWritable;
  Stream.Readable = requireReadable();
  for (const key of ObjectKeys(streamReturningOperators)) {
    let fn = function(...args) {
      if (new.target) {
        throw ERR_ILLEGAL_CONSTRUCTOR();
      }
      return Stream.Readable.from(ReflectApply(op, this, args));
    };
    const op = streamReturningOperators[key];
    ObjectDefineProperty(fn, "name", {
      __proto__: null,
      value: op.name
    });
    ObjectDefineProperty(fn, "length", {
      __proto__: null,
      value: op.length
    });
    ObjectDefineProperty(Stream.Readable.prototype, key, {
      __proto__: null,
      value: fn,
      enumerable: false,
      configurable: true,
      writable: true
    });
  }
  for (const key of ObjectKeys(promiseReturningOperators)) {
    let fn = function(...args) {
      if (new.target) {
        throw ERR_ILLEGAL_CONSTRUCTOR();
      }
      return ReflectApply(op, this, args);
    };
    const op = promiseReturningOperators[key];
    ObjectDefineProperty(fn, "name", {
      __proto__: null,
      value: op.name
    });
    ObjectDefineProperty(fn, "length", {
      __proto__: null,
      value: op.length
    });
    ObjectDefineProperty(Stream.Readable.prototype, key, {
      __proto__: null,
      value: fn,
      enumerable: false,
      configurable: true,
      writable: true
    });
  }
  Stream.Writable = requireWritable();
  Stream.Duplex = requireDuplex();
  Stream.Transform = requireTransform();
  Stream.PassThrough = requirePassthrough();
  Stream.pipeline = pipeline;
  const { addAbortSignal: addAbortSignal2 } = requireAddAbortSignal();
  Stream.addAbortSignal = addAbortSignal2;
  Stream.finished = eos;
  Stream.destroy = destroyer;
  Stream.compose = compose2;
  Stream.setDefaultHighWaterMark = setDefaultHighWaterMark;
  Stream.getDefaultHighWaterMark = getDefaultHighWaterMark;
  ObjectDefineProperty(Stream, "promises", {
    __proto__: null,
    configurable: true,
    enumerable: true,
    get() {
      return promises2;
    }
  });
  ObjectDefineProperty(pipeline, customPromisify, {
    __proto__: null,
    enumerable: true,
    get() {
      return promises2.pipeline;
    }
  });
  ObjectDefineProperty(eos, customPromisify, {
    __proto__: null,
    enumerable: true,
    get() {
      return promises2.finished;
    }
  });
  Stream.Stream = Stream;
  Stream._isUint8Array = function isUint8Array(value) {
    return value instanceof Uint8Array;
  };
  Stream._uint8ArrayToBuffer = function _uint8ArrayToBuffer(chunk) {
    return Buffer2.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
  };
  return stream$1.exports;
}
ours.exports;
var hasRequiredOurs;
function requireOurs() {
  if (hasRequiredOurs) return ours.exports;
  hasRequiredOurs = 1;
  (function(module2) {
    const Stream = require$$0$7;
    if (Stream && process.env.READABLE_STREAM === "disable") {
      const promises2 = Stream.promises;
      module2.exports._uint8ArrayToBuffer = Stream._uint8ArrayToBuffer;
      module2.exports._isUint8Array = Stream._isUint8Array;
      module2.exports.isDisturbed = Stream.isDisturbed;
      module2.exports.isErrored = Stream.isErrored;
      module2.exports.isReadable = Stream.isReadable;
      module2.exports.Readable = Stream.Readable;
      module2.exports.Writable = Stream.Writable;
      module2.exports.Duplex = Stream.Duplex;
      module2.exports.Transform = Stream.Transform;
      module2.exports.PassThrough = Stream.PassThrough;
      module2.exports.addAbortSignal = Stream.addAbortSignal;
      module2.exports.finished = Stream.finished;
      module2.exports.destroy = Stream.destroy;
      module2.exports.pipeline = Stream.pipeline;
      module2.exports.compose = Stream.compose;
      Object.defineProperty(Stream, "promises", {
        configurable: true,
        enumerable: true,
        get() {
          return promises2;
        }
      });
      module2.exports.Stream = Stream.Stream;
    } else {
      const CustomStream = requireStream$1();
      const promises2 = requirePromises();
      const originalDestroy = CustomStream.Readable.destroy;
      module2.exports = CustomStream.Readable;
      module2.exports._uint8ArrayToBuffer = CustomStream._uint8ArrayToBuffer;
      module2.exports._isUint8Array = CustomStream._isUint8Array;
      module2.exports.isDisturbed = CustomStream.isDisturbed;
      module2.exports.isErrored = CustomStream.isErrored;
      module2.exports.isReadable = CustomStream.isReadable;
      module2.exports.Readable = CustomStream.Readable;
      module2.exports.Writable = CustomStream.Writable;
      module2.exports.Duplex = CustomStream.Duplex;
      module2.exports.Transform = CustomStream.Transform;
      module2.exports.PassThrough = CustomStream.PassThrough;
      module2.exports.addAbortSignal = CustomStream.addAbortSignal;
      module2.exports.finished = CustomStream.finished;
      module2.exports.destroy = CustomStream.destroy;
      module2.exports.destroy = originalDestroy;
      module2.exports.pipeline = CustomStream.pipeline;
      module2.exports.compose = CustomStream.compose;
      Object.defineProperty(CustomStream, "promises", {
        configurable: true,
        enumerable: true,
        get() {
          return promises2;
        }
      });
      module2.exports.Stream = CustomStream.Stream;
    }
    module2.exports.default = module2.exports;
  })(ours);
  return ours.exports;
}
var inherits = { exports: {} };
var inherits_browser = { exports: {} };
var hasRequiredInherits_browser;
function requireInherits_browser() {
  if (hasRequiredInherits_browser) return inherits_browser.exports;
  hasRequiredInherits_browser = 1;
  if (typeof Object.create === "function") {
    inherits_browser.exports = function inherits2(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      }
    };
  } else {
    inherits_browser.exports = function inherits2(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {
        };
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
    };
  }
  return inherits_browser.exports;
}
var hasRequiredInherits;
function requireInherits() {
  if (hasRequiredInherits) return inherits.exports;
  hasRequiredInherits = 1;
  try {
    var util2 = require("util");
    if (typeof util2.inherits !== "function") throw "";
    inherits.exports = util2.inherits;
  } catch (e) {
    inherits.exports = requireInherits_browser();
  }
  return inherits.exports;
}
var BufferList_1;
var hasRequiredBufferList;
function requireBufferList() {
  if (hasRequiredBufferList) return BufferList_1;
  hasRequiredBufferList = 1;
  const { Buffer: Buffer2 } = require$$0$5;
  const symbol = Symbol.for("BufferList");
  function BufferList(buf) {
    if (!(this instanceof BufferList)) {
      return new BufferList(buf);
    }
    BufferList._init.call(this, buf);
  }
  BufferList._init = function _init(buf) {
    Object.defineProperty(this, symbol, { value: true });
    this._bufs = [];
    this.length = 0;
    if (buf) {
      this.append(buf);
    }
  };
  BufferList.prototype._new = function _new(buf) {
    return new BufferList(buf);
  };
  BufferList.prototype._offset = function _offset(offset) {
    if (offset === 0) {
      return [0, 0];
    }
    let tot = 0;
    for (let i = 0; i < this._bufs.length; i++) {
      const _t = tot + this._bufs[i].length;
      if (offset < _t || i === this._bufs.length - 1) {
        return [i, offset - tot];
      }
      tot = _t;
    }
  };
  BufferList.prototype._reverseOffset = function(blOffset) {
    const bufferId = blOffset[0];
    let offset = blOffset[1];
    for (let i = 0; i < bufferId; i++) {
      offset += this._bufs[i].length;
    }
    return offset;
  };
  BufferList.prototype.getBuffers = function getBuffers() {
    return this._bufs;
  };
  BufferList.prototype.get = function get(index) {
    if (index > this.length || index < 0) {
      return void 0;
    }
    const offset = this._offset(index);
    return this._bufs[offset[0]][offset[1]];
  };
  BufferList.prototype.slice = function slice(start, end) {
    if (typeof start === "number" && start < 0) {
      start += this.length;
    }
    if (typeof end === "number" && end < 0) {
      end += this.length;
    }
    return this.copy(null, 0, start, end);
  };
  BufferList.prototype.copy = function copy(dst, dstStart, srcStart, srcEnd) {
    if (typeof srcStart !== "number" || srcStart < 0) {
      srcStart = 0;
    }
    if (typeof srcEnd !== "number" || srcEnd > this.length) {
      srcEnd = this.length;
    }
    if (srcStart >= this.length) {
      return dst || Buffer2.alloc(0);
    }
    if (srcEnd <= 0) {
      return dst || Buffer2.alloc(0);
    }
    const copy2 = !!dst;
    const off = this._offset(srcStart);
    const len = srcEnd - srcStart;
    let bytes = len;
    let bufoff = copy2 && dstStart || 0;
    let start = off[1];
    if (srcStart === 0 && srcEnd === this.length) {
      if (!copy2) {
        return this._bufs.length === 1 ? this._bufs[0] : Buffer2.concat(this._bufs, this.length);
      }
      for (let i = 0; i < this._bufs.length; i++) {
        this._bufs[i].copy(dst, bufoff);
        bufoff += this._bufs[i].length;
      }
      return dst;
    }
    if (bytes <= this._bufs[off[0]].length - start) {
      return copy2 ? this._bufs[off[0]].copy(dst, dstStart, start, start + bytes) : this._bufs[off[0]].slice(start, start + bytes);
    }
    if (!copy2) {
      dst = Buffer2.allocUnsafe(len);
    }
    for (let i = off[0]; i < this._bufs.length; i++) {
      const l = this._bufs[i].length - start;
      if (bytes > l) {
        this._bufs[i].copy(dst, bufoff, start);
        bufoff += l;
      } else {
        this._bufs[i].copy(dst, bufoff, start, start + bytes);
        bufoff += l;
        break;
      }
      bytes -= l;
      if (start) {
        start = 0;
      }
    }
    if (dst.length > bufoff) return dst.slice(0, bufoff);
    return dst;
  };
  BufferList.prototype.shallowSlice = function shallowSlice(start, end) {
    start = start || 0;
    end = typeof end !== "number" ? this.length : end;
    if (start < 0) {
      start += this.length;
    }
    if (end < 0) {
      end += this.length;
    }
    if (start === end) {
      return this._new();
    }
    const startOffset = this._offset(start);
    const endOffset = this._offset(end);
    const buffers = this._bufs.slice(startOffset[0], endOffset[0] + 1);
    if (endOffset[1] === 0) {
      buffers.pop();
    } else {
      buffers[buffers.length - 1] = buffers[buffers.length - 1].slice(0, endOffset[1]);
    }
    if (startOffset[1] !== 0) {
      buffers[0] = buffers[0].slice(startOffset[1]);
    }
    return this._new(buffers);
  };
  BufferList.prototype.toString = function toString(encoding, start, end) {
    return this.slice(start, end).toString(encoding);
  };
  BufferList.prototype.consume = function consume(bytes) {
    bytes = Math.trunc(bytes);
    if (Number.isNaN(bytes) || bytes <= 0) return this;
    while (this._bufs.length) {
      if (bytes >= this._bufs[0].length) {
        bytes -= this._bufs[0].length;
        this.length -= this._bufs[0].length;
        this._bufs.shift();
      } else {
        this._bufs[0] = this._bufs[0].slice(bytes);
        this.length -= bytes;
        break;
      }
    }
    return this;
  };
  BufferList.prototype.duplicate = function duplicate() {
    const copy = this._new();
    for (let i = 0; i < this._bufs.length; i++) {
      copy.append(this._bufs[i]);
    }
    return copy;
  };
  BufferList.prototype.append = function append(buf) {
    return this._attach(buf, BufferList.prototype._appendBuffer);
  };
  BufferList.prototype.prepend = function prepend(buf) {
    return this._attach(buf, BufferList.prototype._prependBuffer, true);
  };
  BufferList.prototype._attach = function _attach(buf, attacher, prepend) {
    if (buf == null) {
      return this;
    }
    if (buf.buffer) {
      attacher.call(this, Buffer2.from(buf.buffer, buf.byteOffset, buf.byteLength));
    } else if (Array.isArray(buf)) {
      const [starting, modifier] = prepend ? [buf.length - 1, -1] : [0, 1];
      for (let i = starting; i >= 0 && i < buf.length; i += modifier) {
        this._attach(buf[i], attacher, prepend);
      }
    } else if (this._isBufferList(buf)) {
      const [starting, modifier] = prepend ? [buf._bufs.length - 1, -1] : [0, 1];
      for (let i = starting; i >= 0 && i < buf._bufs.length; i += modifier) {
        this._attach(buf._bufs[i], attacher, prepend);
      }
    } else {
      if (typeof buf === "number") {
        buf = buf.toString();
      }
      attacher.call(this, Buffer2.from(buf));
    }
    return this;
  };
  BufferList.prototype._appendBuffer = function appendBuffer(buf) {
    this._bufs.push(buf);
    this.length += buf.length;
  };
  BufferList.prototype._prependBuffer = function prependBuffer(buf) {
    this._bufs.unshift(buf);
    this.length += buf.length;
  };
  BufferList.prototype.indexOf = function(search, offset, encoding) {
    if (encoding === void 0 && typeof offset === "string") {
      encoding = offset;
      offset = void 0;
    }
    if (typeof search === "function" || Array.isArray(search)) {
      throw new TypeError('The "value" argument must be one of type string, Buffer, BufferList, or Uint8Array.');
    } else if (typeof search === "number") {
      search = Buffer2.from([search]);
    } else if (typeof search === "string") {
      search = Buffer2.from(search, encoding);
    } else if (this._isBufferList(search)) {
      search = search.slice();
    } else if (Array.isArray(search.buffer)) {
      search = Buffer2.from(search.buffer, search.byteOffset, search.byteLength);
    } else if (!Buffer2.isBuffer(search)) {
      search = Buffer2.from(search);
    }
    offset = Number(offset || 0);
    if (isNaN(offset)) {
      offset = 0;
    }
    if (offset < 0) {
      offset = this.length + offset;
    }
    if (offset < 0) {
      offset = 0;
    }
    if (search.length === 0) {
      return offset > this.length ? this.length : offset;
    }
    const blOffset = this._offset(offset);
    let blIndex = blOffset[0];
    let buffOffset = blOffset[1];
    for (; blIndex < this._bufs.length; blIndex++) {
      const buff = this._bufs[blIndex];
      while (buffOffset < buff.length) {
        const availableWindow = buff.length - buffOffset;
        if (availableWindow >= search.length) {
          const nativeSearchResult = buff.indexOf(search, buffOffset);
          if (nativeSearchResult !== -1) {
            return this._reverseOffset([blIndex, nativeSearchResult]);
          }
          buffOffset = buff.length - search.length + 1;
        } else {
          const revOffset = this._reverseOffset([blIndex, buffOffset]);
          if (this._match(revOffset, search)) {
            return revOffset;
          }
          buffOffset++;
        }
      }
      buffOffset = 0;
    }
    return -1;
  };
  BufferList.prototype._match = function(offset, search) {
    if (this.length - offset < search.length) {
      return false;
    }
    for (let searchOffset = 0; searchOffset < search.length; searchOffset++) {
      if (this.get(offset + searchOffset) !== search[searchOffset]) {
        return false;
      }
    }
    return true;
  };
  (function() {
    const methods = {
      readDoubleBE: 8,
      readDoubleLE: 8,
      readFloatBE: 4,
      readFloatLE: 4,
      readBigInt64BE: 8,
      readBigInt64LE: 8,
      readBigUInt64BE: 8,
      readBigUInt64LE: 8,
      readInt32BE: 4,
      readInt32LE: 4,
      readUInt32BE: 4,
      readUInt32LE: 4,
      readInt16BE: 2,
      readInt16LE: 2,
      readUInt16BE: 2,
      readUInt16LE: 2,
      readInt8: 1,
      readUInt8: 1,
      readIntBE: null,
      readIntLE: null,
      readUIntBE: null,
      readUIntLE: null
    };
    for (const m in methods) {
      (function(m2) {
        if (methods[m2] === null) {
          BufferList.prototype[m2] = function(offset, byteLength) {
            return this.slice(offset, offset + byteLength)[m2](0, byteLength);
          };
        } else {
          BufferList.prototype[m2] = function(offset = 0) {
            return this.slice(offset, offset + methods[m2])[m2](0);
          };
        }
      })(m);
    }
  })();
  BufferList.prototype._isBufferList = function _isBufferList(b) {
    return b instanceof BufferList || BufferList.isBufferList(b);
  };
  BufferList.isBufferList = function isBufferList(b) {
    return b != null && b[symbol];
  };
  BufferList_1 = BufferList;
  return BufferList_1;
}
var hasRequiredBl;
function requireBl() {
  if (hasRequiredBl) return bl.exports;
  hasRequiredBl = 1;
  const DuplexStream = requireOurs().Duplex;
  const inherits2 = requireInherits();
  const BufferList = requireBufferList();
  function BufferListStream(callback) {
    if (!(this instanceof BufferListStream)) {
      return new BufferListStream(callback);
    }
    if (typeof callback === "function") {
      this._callback = callback;
      const piper = (function piper2(err) {
        if (this._callback) {
          this._callback(err);
          this._callback = null;
        }
      }).bind(this);
      this.on("pipe", function onPipe(src2) {
        src2.on("error", piper);
      });
      this.on("unpipe", function onUnpipe(src2) {
        src2.removeListener("error", piper);
      });
      callback = null;
    }
    BufferList._init.call(this, callback);
    DuplexStream.call(this);
  }
  inherits2(BufferListStream, DuplexStream);
  Object.assign(BufferListStream.prototype, BufferList.prototype);
  BufferListStream.prototype._new = function _new(callback) {
    return new BufferListStream(callback);
  };
  BufferListStream.prototype._write = function _write(buf, encoding, callback) {
    this._appendBuffer(buf);
    if (typeof callback === "function") {
      callback();
    }
  };
  BufferListStream.prototype._read = function _read(size) {
    if (!this.length) {
      return this.push(null);
    }
    size = Math.min(size, this.length);
    this.push(this.slice(0, size));
    this.consume(size);
  };
  BufferListStream.prototype.end = function end(chunk) {
    DuplexStream.prototype.end.call(this, chunk);
    if (this._callback) {
      this._callback(null, this.slice());
      this._callback = null;
    }
  };
  BufferListStream.prototype._destroy = function _destroy(err, cb) {
    this._bufs.length = 0;
    this.length = 0;
    cb(err);
  };
  BufferListStream.prototype._isBufferList = function _isBufferList(b) {
    return b instanceof BufferListStream || b instanceof BufferList || BufferListStream.isBufferList(b);
  };
  BufferListStream.isBufferList = BufferList.isBufferList;
  bl.exports = BufferListStream;
  bl.exports.BufferListStream = BufferListStream;
  bl.exports.BufferList = BufferList;
  return bl.exports;
}
var packet;
var hasRequiredPacket;
function requirePacket() {
  if (hasRequiredPacket) return packet;
  hasRequiredPacket = 1;
  class Packet {
    constructor() {
      this.cmd = null;
      this.retain = false;
      this.qos = 0;
      this.dup = false;
      this.length = -1;
      this.topic = null;
      this.payload = null;
    }
  }
  packet = Packet;
  return packet;
}
var constants$4 = { exports: {} };
var hasRequiredConstants$4;
function requireConstants$4() {
  if (hasRequiredConstants$4) return constants$4.exports;
  hasRequiredConstants$4 = 1;
  (function(module2) {
    const protocol = module2.exports;
    const { Buffer: Buffer2 } = require$$0$5;
    protocol.types = {
      0: "reserved",
      1: "connect",
      2: "connack",
      3: "publish",
      4: "puback",
      5: "pubrec",
      6: "pubrel",
      7: "pubcomp",
      8: "subscribe",
      9: "suback",
      10: "unsubscribe",
      11: "unsuback",
      12: "pingreq",
      13: "pingresp",
      14: "disconnect",
      15: "auth"
    };
    protocol.requiredHeaderFlags = {
      1: 0,
      // 'connect'
      2: 0,
      // 'connack'
      4: 0,
      // 'puback'
      5: 0,
      // 'pubrec'
      6: 2,
      // 'pubrel'
      7: 0,
      // 'pubcomp'
      8: 2,
      // 'subscribe'
      9: 0,
      // 'suback'
      10: 2,
      // 'unsubscribe'
      11: 0,
      // 'unsuback'
      12: 0,
      // 'pingreq'
      13: 0,
      // 'pingresp'
      14: 0,
      // 'disconnect'
      15: 0
      // 'auth'
    };
    protocol.requiredHeaderFlagsErrors = {};
    for (const k in protocol.requiredHeaderFlags) {
      const v = protocol.requiredHeaderFlags[k];
      protocol.requiredHeaderFlagsErrors[k] = "Invalid header flag bits, must be 0x" + v.toString(16) + " for " + protocol.types[k] + " packet";
    }
    protocol.codes = {};
    for (const k in protocol.types) {
      const v = protocol.types[k];
      protocol.codes[v] = k;
    }
    protocol.CMD_SHIFT = 4;
    protocol.CMD_MASK = 240;
    protocol.DUP_MASK = 8;
    protocol.QOS_MASK = 3;
    protocol.QOS_SHIFT = 1;
    protocol.RETAIN_MASK = 1;
    protocol.VARBYTEINT_MASK = 127;
    protocol.VARBYTEINT_FIN_MASK = 128;
    protocol.VARBYTEINT_MAX = 268435455;
    protocol.SESSIONPRESENT_MASK = 1;
    protocol.SESSIONPRESENT_HEADER = Buffer2.from([protocol.SESSIONPRESENT_MASK]);
    protocol.CONNACK_HEADER = Buffer2.from([protocol.codes.connack << protocol.CMD_SHIFT]);
    protocol.USERNAME_MASK = 128;
    protocol.PASSWORD_MASK = 64;
    protocol.WILL_RETAIN_MASK = 32;
    protocol.WILL_QOS_MASK = 24;
    protocol.WILL_QOS_SHIFT = 3;
    protocol.WILL_FLAG_MASK = 4;
    protocol.CLEAN_SESSION_MASK = 2;
    protocol.CONNECT_HEADER = Buffer2.from([protocol.codes.connect << protocol.CMD_SHIFT]);
    protocol.properties = {
      sessionExpiryInterval: 17,
      willDelayInterval: 24,
      receiveMaximum: 33,
      maximumPacketSize: 39,
      topicAliasMaximum: 34,
      requestResponseInformation: 25,
      requestProblemInformation: 23,
      userProperties: 38,
      authenticationMethod: 21,
      authenticationData: 22,
      payloadFormatIndicator: 1,
      messageExpiryInterval: 2,
      contentType: 3,
      responseTopic: 8,
      correlationData: 9,
      maximumQoS: 36,
      retainAvailable: 37,
      assignedClientIdentifier: 18,
      reasonString: 31,
      wildcardSubscriptionAvailable: 40,
      subscriptionIdentifiersAvailable: 41,
      sharedSubscriptionAvailable: 42,
      serverKeepAlive: 19,
      responseInformation: 26,
      serverReference: 28,
      topicAlias: 35,
      subscriptionIdentifier: 11
    };
    protocol.propertiesCodes = {};
    for (const prop in protocol.properties) {
      const id = protocol.properties[prop];
      protocol.propertiesCodes[id] = prop;
    }
    protocol.propertiesTypes = {
      sessionExpiryInterval: "int32",
      willDelayInterval: "int32",
      receiveMaximum: "int16",
      maximumPacketSize: "int32",
      topicAliasMaximum: "int16",
      requestResponseInformation: "byte",
      requestProblemInformation: "byte",
      userProperties: "pair",
      authenticationMethod: "string",
      authenticationData: "binary",
      payloadFormatIndicator: "byte",
      messageExpiryInterval: "int32",
      contentType: "string",
      responseTopic: "string",
      correlationData: "binary",
      maximumQoS: "int8",
      retainAvailable: "byte",
      assignedClientIdentifier: "string",
      reasonString: "string",
      wildcardSubscriptionAvailable: "byte",
      subscriptionIdentifiersAvailable: "byte",
      sharedSubscriptionAvailable: "byte",
      serverKeepAlive: "int16",
      responseInformation: "string",
      serverReference: "string",
      topicAlias: "int16",
      subscriptionIdentifier: "var"
    };
    function genHeader(type) {
      return [0, 1, 2].map((qos) => {
        return [0, 1].map((dup) => {
          return [0, 1].map((retain) => {
            const buf = Buffer2.alloc(1);
            buf.writeUInt8(
              protocol.codes[type] << protocol.CMD_SHIFT | (dup ? protocol.DUP_MASK : 0) | qos << protocol.QOS_SHIFT | retain,
              0,
              true
            );
            return buf;
          });
        });
      });
    }
    protocol.PUBLISH_HEADER = genHeader("publish");
    protocol.SUBSCRIBE_HEADER = genHeader("subscribe");
    protocol.SUBSCRIBE_OPTIONS_QOS_MASK = 3;
    protocol.SUBSCRIBE_OPTIONS_NL_MASK = 1;
    protocol.SUBSCRIBE_OPTIONS_NL_SHIFT = 2;
    protocol.SUBSCRIBE_OPTIONS_RAP_MASK = 1;
    protocol.SUBSCRIBE_OPTIONS_RAP_SHIFT = 3;
    protocol.SUBSCRIBE_OPTIONS_RH_MASK = 3;
    protocol.SUBSCRIBE_OPTIONS_RH_SHIFT = 4;
    protocol.SUBSCRIBE_OPTIONS_RH = [0, 16, 32];
    protocol.SUBSCRIBE_OPTIONS_NL = 4;
    protocol.SUBSCRIBE_OPTIONS_RAP = 8;
    protocol.SUBSCRIBE_OPTIONS_QOS = [0, 1, 2];
    protocol.UNSUBSCRIBE_HEADER = genHeader("unsubscribe");
    protocol.ACKS = {
      unsuback: genHeader("unsuback"),
      puback: genHeader("puback"),
      pubcomp: genHeader("pubcomp"),
      pubrel: genHeader("pubrel"),
      pubrec: genHeader("pubrec")
    };
    protocol.SUBACK_HEADER = Buffer2.from([protocol.codes.suback << protocol.CMD_SHIFT]);
    protocol.VERSION3 = Buffer2.from([3]);
    protocol.VERSION4 = Buffer2.from([4]);
    protocol.VERSION5 = Buffer2.from([5]);
    protocol.VERSION131 = Buffer2.from([131]);
    protocol.VERSION132 = Buffer2.from([132]);
    protocol.QOS = [0, 1, 2].map((qos) => {
      return Buffer2.from([qos]);
    });
    protocol.EMPTY = {
      pingreq: Buffer2.from([protocol.codes.pingreq << 4, 0]),
      pingresp: Buffer2.from([protocol.codes.pingresp << 4, 0]),
      disconnect: Buffer2.from([protocol.codes.disconnect << 4, 0])
    };
    protocol.MQTT5_PUBACK_PUBREC_CODES = {
      0: "Success",
      16: "No matching subscribers",
      128: "Unspecified error",
      131: "Implementation specific error",
      135: "Not authorized",
      144: "Topic Name invalid",
      145: "Packet identifier in use",
      151: "Quota exceeded",
      153: "Payload format invalid"
    };
    protocol.MQTT5_PUBREL_PUBCOMP_CODES = {
      0: "Success",
      146: "Packet Identifier not found"
    };
    protocol.MQTT5_SUBACK_CODES = {
      0: "Granted QoS 0",
      1: "Granted QoS 1",
      2: "Granted QoS 2",
      128: "Unspecified error",
      131: "Implementation specific error",
      135: "Not authorized",
      143: "Topic Filter invalid",
      145: "Packet Identifier in use",
      151: "Quota exceeded",
      158: "Shared Subscriptions not supported",
      161: "Subscription Identifiers not supported",
      162: "Wildcard Subscriptions not supported"
    };
    protocol.MQTT5_UNSUBACK_CODES = {
      0: "Success",
      17: "No subscription existed",
      128: "Unspecified error",
      131: "Implementation specific error",
      135: "Not authorized",
      143: "Topic Filter invalid",
      145: "Packet Identifier in use"
    };
    protocol.MQTT5_DISCONNECT_CODES = {
      0: "Normal disconnection",
      4: "Disconnect with Will Message",
      128: "Unspecified error",
      129: "Malformed Packet",
      130: "Protocol Error",
      131: "Implementation specific error",
      135: "Not authorized",
      137: "Server busy",
      139: "Server shutting down",
      141: "Keep Alive timeout",
      142: "Session taken over",
      143: "Topic Filter invalid",
      144: "Topic Name invalid",
      147: "Receive Maximum exceeded",
      148: "Topic Alias invalid",
      149: "Packet too large",
      150: "Message rate too high",
      151: "Quota exceeded",
      152: "Administrative action",
      153: "Payload format invalid",
      154: "Retain not supported",
      155: "QoS not supported",
      156: "Use another server",
      157: "Server moved",
      158: "Shared Subscriptions not supported",
      159: "Connection rate exceeded",
      160: "Maximum connect time",
      161: "Subscription Identifiers not supported",
      162: "Wildcard Subscriptions not supported"
    };
    protocol.MQTT5_AUTH_CODES = {
      0: "Success",
      24: "Continue authentication",
      25: "Re-authenticate"
    };
  })(constants$4);
  return constants$4.exports;
}
var src = { exports: {} };
var browser = { exports: {} };
var ms;
var hasRequiredMs;
function requireMs() {
  if (hasRequiredMs) return ms;
  hasRequiredMs = 1;
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;
  ms = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
      return parse(val);
    } else if (type === "number" && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
    );
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || "ms").toLowerCase();
    switch (type) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "weeks":
      case "week":
      case "w":
        return n * w;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return Math.round(ms2 / d) + "d";
    }
    if (msAbs >= h) {
      return Math.round(ms2 / h) + "h";
    }
    if (msAbs >= m) {
      return Math.round(ms2 / m) + "m";
    }
    if (msAbs >= s) {
      return Math.round(ms2 / s) + "s";
    }
    return ms2 + "ms";
  }
  function fmtLong(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return plural(ms2, msAbs, d, "day");
    }
    if (msAbs >= h) {
      return plural(ms2, msAbs, h, "hour");
    }
    if (msAbs >= m) {
      return plural(ms2, msAbs, m, "minute");
    }
    if (msAbs >= s) {
      return plural(ms2, msAbs, s, "second");
    }
    return ms2 + " ms";
  }
  function plural(ms2, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms2 / n) + " " + name + (isPlural ? "s" : "");
  }
  return ms;
}
var common$1;
var hasRequiredCommon$1;
function requireCommon$1() {
  if (hasRequiredCommon$1) return common$1;
  hasRequiredCommon$1 = 1;
  function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = requireMs();
    createDebug.destroy = destroy;
    Object.keys(env).forEach((key) => {
      createDebug[key] = env[key];
    });
    createDebug.names = [];
    createDebug.skips = [];
    createDebug.formatters = {};
    function selectColor(namespace) {
      let hash = 0;
      for (let i = 0; i < namespace.length; i++) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    function createDebug(namespace) {
      let prevTime;
      let enableOverride = null;
      let namespacesCache;
      let enabledCache;
      function debug2(...args) {
        if (!debug2.enabled) {
          return;
        }
        const self2 = debug2;
        const curr = Number(/* @__PURE__ */ new Date());
        const ms2 = curr - (prevTime || curr);
        self2.diff = ms2;
        self2.prev = prevTime;
        self2.curr = curr;
        prevTime = curr;
        args[0] = createDebug.coerce(args[0]);
        if (typeof args[0] !== "string") {
          args.unshift("%O");
        }
        let index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
          if (match === "%%") {
            return "%";
          }
          index++;
          const formatter = createDebug.formatters[format];
          if (typeof formatter === "function") {
            const val = args[index];
            match = formatter.call(self2, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        createDebug.formatArgs.call(self2, args);
        const logFn = self2.log || createDebug.log;
        logFn.apply(self2, args);
      }
      debug2.namespace = namespace;
      debug2.useColors = createDebug.useColors();
      debug2.color = createDebug.selectColor(namespace);
      debug2.extend = extend;
      debug2.destroy = createDebug.destroy;
      Object.defineProperty(debug2, "enabled", {
        enumerable: true,
        configurable: false,
        get: () => {
          if (enableOverride !== null) {
            return enableOverride;
          }
          if (namespacesCache !== createDebug.namespaces) {
            namespacesCache = createDebug.namespaces;
            enabledCache = createDebug.enabled(namespace);
          }
          return enabledCache;
        },
        set: (v) => {
          enableOverride = v;
        }
      });
      if (typeof createDebug.init === "function") {
        createDebug.init(debug2);
      }
      return debug2;
    }
    function extend(namespace, delimiter) {
      const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
      newDebug.log = this.log;
      return newDebug;
    }
    function enable(namespaces) {
      createDebug.save(namespaces);
      createDebug.namespaces = namespaces;
      createDebug.names = [];
      createDebug.skips = [];
      const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const ns of split) {
        if (ns[0] === "-") {
          createDebug.skips.push(ns.slice(1));
        } else {
          createDebug.names.push(ns);
        }
      }
    }
    function matchesTemplate(search, template) {
      let searchIndex = 0;
      let templateIndex = 0;
      let starIndex = -1;
      let matchIndex = 0;
      while (searchIndex < search.length) {
        if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
          if (template[templateIndex] === "*") {
            starIndex = templateIndex;
            matchIndex = searchIndex;
            templateIndex++;
          } else {
            searchIndex++;
            templateIndex++;
          }
        } else if (starIndex !== -1) {
          templateIndex = starIndex + 1;
          matchIndex++;
          searchIndex = matchIndex;
        } else {
          return false;
        }
      }
      while (templateIndex < template.length && template[templateIndex] === "*") {
        templateIndex++;
      }
      return templateIndex === template.length;
    }
    function disable() {
      const namespaces = [
        ...createDebug.names,
        ...createDebug.skips.map((namespace) => "-" + namespace)
      ].join(",");
      createDebug.enable("");
      return namespaces;
    }
    function enabled(name) {
      for (const skip of createDebug.skips) {
        if (matchesTemplate(name, skip)) {
          return false;
        }
      }
      for (const ns of createDebug.names) {
        if (matchesTemplate(name, ns)) {
          return true;
        }
      }
      return false;
    }
    function coerce(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }
      return val;
    }
    function destroy() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    createDebug.enable(createDebug.load());
    return createDebug;
  }
  common$1 = setup;
  return common$1;
}
var hasRequiredBrowser;
function requireBrowser() {
  if (hasRequiredBrowser) return browser.exports;
  hasRequiredBrowser = 1;
  (function(module2, exports) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load2;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load2() {
      let r;
      try {
        r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = requireCommon$1()(exports);
    const { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  })(browser, browser.exports);
  return browser.exports;
}
var node = { exports: {} };
var hasFlag;
var hasRequiredHasFlag;
function requireHasFlag() {
  if (hasRequiredHasFlag) return hasFlag;
  hasRequiredHasFlag = 1;
  hasFlag = (flag, argv = process.argv) => {
    const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
    const position = argv.indexOf(prefix + flag);
    const terminatorPosition = argv.indexOf("--");
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
  };
  return hasFlag;
}
var supportsColor_1;
var hasRequiredSupportsColor;
function requireSupportsColor() {
  if (hasRequiredSupportsColor) return supportsColor_1;
  hasRequiredSupportsColor = 1;
  const os = require$$0$8;
  const tty = require$$0$4;
  const hasFlag2 = requireHasFlag();
  const { env } = process;
  let forceColor;
  if (hasFlag2("no-color") || hasFlag2("no-colors") || hasFlag2("color=false") || hasFlag2("color=never")) {
    forceColor = 0;
  } else if (hasFlag2("color") || hasFlag2("colors") || hasFlag2("color=true") || hasFlag2("color=always")) {
    forceColor = 1;
  }
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      forceColor = 1;
    } else if (env.FORCE_COLOR === "false") {
      forceColor = 0;
    } else {
      forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
    }
  }
  function translateLevel(level) {
    if (level === 0) {
      return false;
    }
    return {
      level,
      hasBasic: true,
      has256: level >= 2,
      has16m: level >= 3
    };
  }
  function supportsColor(haveStream, streamIsTTY) {
    if (forceColor === 0) {
      return 0;
    }
    if (hasFlag2("color=16m") || hasFlag2("color=full") || hasFlag2("color=truecolor")) {
      return 3;
    }
    if (hasFlag2("color=256")) {
      return 2;
    }
    if (haveStream && !streamIsTTY && forceColor === void 0) {
      return 0;
    }
    const min = forceColor || 0;
    if (env.TERM === "dumb") {
      return min;
    }
    if (process.platform === "win32") {
      const osRelease = os.release().split(".");
      if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
        return Number(osRelease[2]) >= 14931 ? 3 : 2;
      }
      return 1;
    }
    if ("CI" in env) {
      if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
        return 1;
      }
      return min;
    }
    if ("TEAMCITY_VERSION" in env) {
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
    }
    if (env.COLORTERM === "truecolor") {
      return 3;
    }
    if ("TERM_PROGRAM" in env) {
      const version2 = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (env.TERM_PROGRAM) {
        case "iTerm.app":
          return version2 >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    if (/-256(color)?$/i.test(env.TERM)) {
      return 2;
    }
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
      return 1;
    }
    if ("COLORTERM" in env) {
      return 1;
    }
    return min;
  }
  function getSupportLevel(stream2) {
    const level = supportsColor(stream2, stream2 && stream2.isTTY);
    return translateLevel(level);
  }
  supportsColor_1 = {
    supportsColor: getSupportLevel,
    stdout: translateLevel(supportsColor(true, tty.isatty(1))),
    stderr: translateLevel(supportsColor(true, tty.isatty(2)))
  };
  return supportsColor_1;
}
var hasRequiredNode;
function requireNode() {
  if (hasRequiredNode) return node.exports;
  hasRequiredNode = 1;
  (function(module2, exports) {
    const tty = require$$0$4;
    const util2 = require$$1;
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load2;
    exports.useColors = useColors;
    exports.destroy = util2.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = requireSupportsColor();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util2.formatWithOptions(exports.inspectOpts, ...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load2() {
      return process.env.DEBUG;
    }
    function init(debug2) {
      debug2.inspectOpts = {};
      const keys = Object.keys(exports.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug2.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    module2.exports = requireCommon$1()(exports);
    const { formatters } = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts);
    };
  })(node, node.exports);
  return node.exports;
}
var hasRequiredSrc;
function requireSrc() {
  if (hasRequiredSrc) return src.exports;
  hasRequiredSrc = 1;
  if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
    src.exports = requireBrowser();
  } else {
    src.exports = requireNode();
  }
  return src.exports;
}
var parser;
var hasRequiredParser;
function requireParser() {
  if (hasRequiredParser) return parser;
  hasRequiredParser = 1;
  const bl2 = requireBl();
  const { EventEmitter } = require$$0$6;
  const Packet = requirePacket();
  const constants2 = requireConstants$4();
  const debug2 = requireSrc()("mqtt-packet:parser");
  class Parser extends EventEmitter {
    constructor() {
      super();
      this.parser = this.constructor.parser;
    }
    static parser(opt) {
      if (!(this instanceof Parser)) return new Parser().parser(opt);
      this.settings = opt || {};
      this._states = [
        "_parseHeader",
        "_parseLength",
        "_parsePayload",
        "_newPacket"
      ];
      this._resetState();
      return this;
    }
    _resetState() {
      debug2("_resetState: resetting packet, error, _list, and _stateCounter");
      this.packet = new Packet();
      this.error = null;
      this._list = bl2();
      this._stateCounter = 0;
    }
    parse(buf) {
      if (this.error) this._resetState();
      this._list.append(buf);
      debug2("parse: current state: %s", this._states[this._stateCounter]);
      while ((this.packet.length !== -1 || this._list.length > 0) && this[this._states[this._stateCounter]]() && !this.error) {
        this._stateCounter++;
        debug2("parse: state complete. _stateCounter is now: %d", this._stateCounter);
        debug2("parse: packet.length: %d, buffer list length: %d", this.packet.length, this._list.length);
        if (this._stateCounter >= this._states.length) this._stateCounter = 0;
      }
      debug2("parse: exited while loop. packet: %d, buffer list length: %d", this.packet.length, this._list.length);
      return this._list.length;
    }
    _parseHeader() {
      const zero = this._list.readUInt8(0);
      const cmdIndex = zero >> constants2.CMD_SHIFT;
      this.packet.cmd = constants2.types[cmdIndex];
      const headerFlags = zero & 15;
      const requiredHeaderFlags = constants2.requiredHeaderFlags[cmdIndex];
      if (requiredHeaderFlags != null && headerFlags !== requiredHeaderFlags) {
        return this._emitError(new Error(constants2.requiredHeaderFlagsErrors[cmdIndex]));
      }
      this.packet.retain = (zero & constants2.RETAIN_MASK) !== 0;
      this.packet.qos = zero >> constants2.QOS_SHIFT & constants2.QOS_MASK;
      if (this.packet.qos > 2) {
        return this._emitError(new Error("Packet must not have both QoS bits set to 1"));
      }
      this.packet.dup = (zero & constants2.DUP_MASK) !== 0;
      debug2("_parseHeader: packet: %o", this.packet);
      this._list.consume(1);
      return true;
    }
    _parseLength() {
      const result = this._parseVarByteNum(true);
      if (result) {
        this.packet.length = result.value;
        this._list.consume(result.bytes);
      }
      debug2("_parseLength %d", result.value);
      return !!result;
    }
    _parsePayload() {
      debug2("_parsePayload: payload %O", this._list);
      let result = false;
      if (this.packet.length === 0 || this._list.length >= this.packet.length) {
        this._pos = 0;
        switch (this.packet.cmd) {
          case "connect":
            this._parseConnect();
            break;
          case "connack":
            this._parseConnack();
            break;
          case "publish":
            this._parsePublish();
            break;
          case "puback":
          case "pubrec":
          case "pubrel":
          case "pubcomp":
            this._parseConfirmation();
            break;
          case "subscribe":
            this._parseSubscribe();
            break;
          case "suback":
            this._parseSuback();
            break;
          case "unsubscribe":
            this._parseUnsubscribe();
            break;
          case "unsuback":
            this._parseUnsuback();
            break;
          case "pingreq":
          case "pingresp":
            break;
          case "disconnect":
            this._parseDisconnect();
            break;
          case "auth":
            this._parseAuth();
            break;
          default:
            this._emitError(new Error("Not supported"));
        }
        result = true;
      }
      debug2("_parsePayload complete result: %s", result);
      return result;
    }
    _parseConnect() {
      debug2("_parseConnect");
      let topic;
      let payload;
      let password;
      let username;
      const flags = {};
      const packet2 = this.packet;
      const protocolId = this._parseString();
      if (protocolId === null) return this._emitError(new Error("Cannot parse protocolId"));
      if (protocolId !== "MQTT" && protocolId !== "MQIsdp") {
        return this._emitError(new Error("Invalid protocolId"));
      }
      packet2.protocolId = protocolId;
      if (this._pos >= this._list.length) return this._emitError(new Error("Packet too short"));
      packet2.protocolVersion = this._list.readUInt8(this._pos);
      if (packet2.protocolVersion >= 128) {
        packet2.bridgeMode = true;
        packet2.protocolVersion = packet2.protocolVersion - 128;
      }
      if (packet2.protocolVersion !== 3 && packet2.protocolVersion !== 4 && packet2.protocolVersion !== 5) {
        return this._emitError(new Error("Invalid protocol version"));
      }
      this._pos++;
      if (this._pos >= this._list.length) {
        return this._emitError(new Error("Packet too short"));
      }
      if (this._list.readUInt8(this._pos) & 1) {
        return this._emitError(new Error("Connect flag bit 0 must be 0, but got 1"));
      }
      flags.username = this._list.readUInt8(this._pos) & constants2.USERNAME_MASK;
      flags.password = this._list.readUInt8(this._pos) & constants2.PASSWORD_MASK;
      flags.will = this._list.readUInt8(this._pos) & constants2.WILL_FLAG_MASK;
      const willRetain = !!(this._list.readUInt8(this._pos) & constants2.WILL_RETAIN_MASK);
      const willQos = (this._list.readUInt8(this._pos) & constants2.WILL_QOS_MASK) >> constants2.WILL_QOS_SHIFT;
      if (flags.will) {
        packet2.will = {};
        packet2.will.retain = willRetain;
        packet2.will.qos = willQos;
      } else {
        if (willRetain) {
          return this._emitError(new Error("Will Retain Flag must be set to zero when Will Flag is set to 0"));
        }
        if (willQos) {
          return this._emitError(new Error("Will QoS must be set to zero when Will Flag is set to 0"));
        }
      }
      packet2.clean = (this._list.readUInt8(this._pos) & constants2.CLEAN_SESSION_MASK) !== 0;
      this._pos++;
      packet2.keepalive = this._parseNum();
      if (packet2.keepalive === -1) return this._emitError(new Error("Packet too short"));
      if (packet2.protocolVersion === 5) {
        const properties = this._parseProperties();
        if (Object.getOwnPropertyNames(properties).length) {
          packet2.properties = properties;
        }
      }
      const clientId = this._parseString();
      if (clientId === null) return this._emitError(new Error("Packet too short"));
      packet2.clientId = clientId;
      debug2("_parseConnect: packet.clientId: %s", packet2.clientId);
      if (flags.will) {
        if (packet2.protocolVersion === 5) {
          const willProperties = this._parseProperties();
          if (Object.getOwnPropertyNames(willProperties).length) {
            packet2.will.properties = willProperties;
          }
        }
        topic = this._parseString();
        if (topic === null) return this._emitError(new Error("Cannot parse will topic"));
        packet2.will.topic = topic;
        debug2("_parseConnect: packet.will.topic: %s", packet2.will.topic);
        payload = this._parseBuffer();
        if (payload === null) return this._emitError(new Error("Cannot parse will payload"));
        packet2.will.payload = payload;
        debug2("_parseConnect: packet.will.paylaod: %s", packet2.will.payload);
      }
      if (flags.username) {
        username = this._parseString();
        if (username === null) return this._emitError(new Error("Cannot parse username"));
        packet2.username = username;
        debug2("_parseConnect: packet.username: %s", packet2.username);
      }
      if (flags.password) {
        password = this._parseBuffer();
        if (password === null) return this._emitError(new Error("Cannot parse password"));
        packet2.password = password;
      }
      this.settings = packet2;
      debug2("_parseConnect: complete");
      return packet2;
    }
    _parseConnack() {
      debug2("_parseConnack");
      const packet2 = this.packet;
      if (this._list.length < 1) return null;
      const flags = this._list.readUInt8(this._pos++);
      if (flags > 1) {
        return this._emitError(new Error("Invalid connack flags, bits 7-1 must be set to 0"));
      }
      packet2.sessionPresent = !!(flags & constants2.SESSIONPRESENT_MASK);
      if (this.settings.protocolVersion === 5) {
        if (this._list.length >= 2) {
          packet2.reasonCode = this._list.readUInt8(this._pos++);
        } else {
          packet2.reasonCode = 0;
        }
      } else {
        if (this._list.length < 2) return null;
        packet2.returnCode = this._list.readUInt8(this._pos++);
      }
      if (packet2.returnCode === -1 || packet2.reasonCode === -1) return this._emitError(new Error("Cannot parse return code"));
      if (this.settings.protocolVersion === 5) {
        const properties = this._parseProperties();
        if (Object.getOwnPropertyNames(properties).length) {
          packet2.properties = properties;
        }
      }
      debug2("_parseConnack: complete");
    }
    _parsePublish() {
      debug2("_parsePublish");
      const packet2 = this.packet;
      packet2.topic = this._parseString();
      if (packet2.topic === null) return this._emitError(new Error("Cannot parse topic"));
      if (packet2.qos > 0) {
        if (!this._parseMessageId()) {
          return;
        }
      }
      if (this.settings.protocolVersion === 5) {
        const properties = this._parseProperties();
        if (Object.getOwnPropertyNames(properties).length) {
          packet2.properties = properties;
        }
      }
      packet2.payload = this._list.slice(this._pos, packet2.length);
      debug2("_parsePublish: payload from buffer list: %o", packet2.payload);
    }
    _parseSubscribe() {
      debug2("_parseSubscribe");
      const packet2 = this.packet;
      let topic;
      let options;
      let qos;
      let rh;
      let rap;
      let nl;
      let subscription;
      packet2.subscriptions = [];
      if (!this._parseMessageId()) {
        return;
      }
      if (this.settings.protocolVersion === 5) {
        const properties = this._parseProperties();
        if (Object.getOwnPropertyNames(properties).length) {
          packet2.properties = properties;
        }
      }
      if (packet2.length <= 0) {
        return this._emitError(new Error("Malformed subscribe, no payload specified"));
      }
      while (this._pos < packet2.length) {
        topic = this._parseString();
        if (topic === null) return this._emitError(new Error("Cannot parse topic"));
        if (this._pos >= packet2.length) return this._emitError(new Error("Malformed Subscribe Payload"));
        options = this._parseByte();
        if (this.settings.protocolVersion === 5) {
          if (options & 192) {
            return this._emitError(new Error("Invalid subscribe topic flag bits, bits 7-6 must be 0"));
          }
        } else {
          if (options & 252) {
            return this._emitError(new Error("Invalid subscribe topic flag bits, bits 7-2 must be 0"));
          }
        }
        qos = options & constants2.SUBSCRIBE_OPTIONS_QOS_MASK;
        if (qos > 2) {
          return this._emitError(new Error("Invalid subscribe QoS, must be <= 2"));
        }
        nl = (options >> constants2.SUBSCRIBE_OPTIONS_NL_SHIFT & constants2.SUBSCRIBE_OPTIONS_NL_MASK) !== 0;
        rap = (options >> constants2.SUBSCRIBE_OPTIONS_RAP_SHIFT & constants2.SUBSCRIBE_OPTIONS_RAP_MASK) !== 0;
        rh = options >> constants2.SUBSCRIBE_OPTIONS_RH_SHIFT & constants2.SUBSCRIBE_OPTIONS_RH_MASK;
        if (rh > 2) {
          return this._emitError(new Error("Invalid retain handling, must be <= 2"));
        }
        subscription = { topic, qos };
        if (this.settings.protocolVersion === 5) {
          subscription.nl = nl;
          subscription.rap = rap;
          subscription.rh = rh;
        } else if (this.settings.bridgeMode) {
          subscription.rh = 0;
          subscription.rap = true;
          subscription.nl = true;
        }
        debug2("_parseSubscribe: push subscription `%s` to subscription", subscription);
        packet2.subscriptions.push(subscription);
      }
    }
    _parseSuback() {
      debug2("_parseSuback");
      const packet2 = this.packet;
      this.packet.granted = [];
      if (!this._parseMessageId()) {
        return;
      }
      if (this.settings.protocolVersion === 5) {
        const properties = this._parseProperties();
        if (Object.getOwnPropertyNames(properties).length) {
          packet2.properties = properties;
        }
      }
      if (packet2.length <= 0) {
        return this._emitError(new Error("Malformed suback, no payload specified"));
      }
      while (this._pos < this.packet.length) {
        const code = this._list.readUInt8(this._pos++);
        if (this.settings.protocolVersion === 5) {
          if (!constants2.MQTT5_SUBACK_CODES[code]) {
            return this._emitError(new Error("Invalid suback code"));
          }
        } else {
          if (code > 2 && code !== 128) {
            return this._emitError(new Error("Invalid suback QoS, must be 0, 1, 2 or 128"));
          }
        }
        this.packet.granted.push(code);
      }
    }
    _parseUnsubscribe() {
      debug2("_parseUnsubscribe");
      const packet2 = this.packet;
      packet2.unsubscriptions = [];
      if (!this._parseMessageId()) {
        return;
      }
      if (this.settings.protocolVersion === 5) {
        const properties = this._parseProperties();
        if (Object.getOwnPropertyNames(properties).length) {
          packet2.properties = properties;
        }
      }
      if (packet2.length <= 0) {
        return this._emitError(new Error("Malformed unsubscribe, no payload specified"));
      }
      while (this._pos < packet2.length) {
        const topic = this._parseString();
        if (topic === null) return this._emitError(new Error("Cannot parse topic"));
        debug2("_parseUnsubscribe: push topic `%s` to unsubscriptions", topic);
        packet2.unsubscriptions.push(topic);
      }
    }
    _parseUnsuback() {
      debug2("_parseUnsuback");
      const packet2 = this.packet;
      if (!this._parseMessageId()) return this._emitError(new Error("Cannot parse messageId"));
      if ((this.settings.protocolVersion === 3 || this.settings.protocolVersion === 4) && packet2.length !== 2) {
        return this._emitError(new Error("Malformed unsuback, payload length must be 2"));
      }
      if (packet2.length <= 0) {
        return this._emitError(new Error("Malformed unsuback, no payload specified"));
      }
      if (this.settings.protocolVersion === 5) {
        const properties = this._parseProperties();
        if (Object.getOwnPropertyNames(properties).length) {
          packet2.properties = properties;
        }
        packet2.granted = [];
        while (this._pos < this.packet.length) {
          const code = this._list.readUInt8(this._pos++);
          if (!constants2.MQTT5_UNSUBACK_CODES[code]) {
            return this._emitError(new Error("Invalid unsuback code"));
          }
          this.packet.granted.push(code);
        }
      }
    }
    // parse packets like puback, pubrec, pubrel, pubcomp
    _parseConfirmation() {
      debug2("_parseConfirmation: packet.cmd: `%s`", this.packet.cmd);
      const packet2 = this.packet;
      this._parseMessageId();
      if (this.settings.protocolVersion === 5) {
        if (packet2.length > 2) {
          packet2.reasonCode = this._parseByte();
          switch (this.packet.cmd) {
            case "puback":
            case "pubrec":
              if (!constants2.MQTT5_PUBACK_PUBREC_CODES[packet2.reasonCode]) {
                return this._emitError(new Error("Invalid " + this.packet.cmd + " reason code"));
              }
              break;
            case "pubrel":
            case "pubcomp":
              if (!constants2.MQTT5_PUBREL_PUBCOMP_CODES[packet2.reasonCode]) {
                return this._emitError(new Error("Invalid " + this.packet.cmd + " reason code"));
              }
              break;
          }
          debug2("_parseConfirmation: packet.reasonCode `%d`", packet2.reasonCode);
        } else {
          packet2.reasonCode = 0;
        }
        if (packet2.length > 3) {
          const properties = this._parseProperties();
          if (Object.getOwnPropertyNames(properties).length) {
            packet2.properties = properties;
          }
        }
      }
      return true;
    }
    // parse disconnect packet
    _parseDisconnect() {
      const packet2 = this.packet;
      debug2("_parseDisconnect");
      if (this.settings.protocolVersion === 5) {
        if (this._list.length > 0) {
          packet2.reasonCode = this._parseByte();
          if (!constants2.MQTT5_DISCONNECT_CODES[packet2.reasonCode]) {
            this._emitError(new Error("Invalid disconnect reason code"));
          }
        } else {
          packet2.reasonCode = 0;
        }
        const properties = this._parseProperties();
        if (Object.getOwnPropertyNames(properties).length) {
          packet2.properties = properties;
        }
      }
      debug2("_parseDisconnect result: true");
      return true;
    }
    // parse auth packet
    _parseAuth() {
      debug2("_parseAuth");
      const packet2 = this.packet;
      if (this.settings.protocolVersion !== 5) {
        return this._emitError(new Error("Not supported auth packet for this version MQTT"));
      }
      packet2.reasonCode = this._parseByte();
      if (!constants2.MQTT5_AUTH_CODES[packet2.reasonCode]) {
        return this._emitError(new Error("Invalid auth reason code"));
      }
      const properties = this._parseProperties();
      if (Object.getOwnPropertyNames(properties).length) {
        packet2.properties = properties;
      }
      debug2("_parseAuth: result: true");
      return true;
    }
    _parseMessageId() {
      const packet2 = this.packet;
      packet2.messageId = this._parseNum();
      if (packet2.messageId === null) {
        this._emitError(new Error("Cannot parse messageId"));
        return false;
      }
      debug2("_parseMessageId: packet.messageId %d", packet2.messageId);
      return true;
    }
    _parseString(maybeBuffer) {
      const length = this._parseNum();
      const end = length + this._pos;
      if (length === -1 || end > this._list.length || end > this.packet.length) return null;
      const result = this._list.toString("utf8", this._pos, end);
      this._pos += length;
      debug2("_parseString: result: %s", result);
      return result;
    }
    _parseStringPair() {
      debug2("_parseStringPair");
      return {
        name: this._parseString(),
        value: this._parseString()
      };
    }
    _parseBuffer() {
      const length = this._parseNum();
      const end = length + this._pos;
      if (length === -1 || end > this._list.length || end > this.packet.length) return null;
      const result = this._list.slice(this._pos, end);
      this._pos += length;
      debug2("_parseBuffer: result: %o", result);
      return result;
    }
    _parseNum() {
      if (this._list.length - this._pos < 2) return -1;
      const result = this._list.readUInt16BE(this._pos);
      this._pos += 2;
      debug2("_parseNum: result: %s", result);
      return result;
    }
    _parse4ByteNum() {
      if (this._list.length - this._pos < 4) return -1;
      const result = this._list.readUInt32BE(this._pos);
      this._pos += 4;
      debug2("_parse4ByteNum: result: %s", result);
      return result;
    }
    _parseVarByteNum(fullInfoFlag) {
      debug2("_parseVarByteNum");
      const maxBytes = 4;
      let bytes = 0;
      let mul = 1;
      let value = 0;
      let result = false;
      let current;
      const padding = this._pos ? this._pos : 0;
      while (bytes < maxBytes && padding + bytes < this._list.length) {
        current = this._list.readUInt8(padding + bytes++);
        value += mul * (current & constants2.VARBYTEINT_MASK);
        mul *= 128;
        if ((current & constants2.VARBYTEINT_FIN_MASK) === 0) {
          result = true;
          break;
        }
        if (this._list.length <= bytes) {
          break;
        }
      }
      if (!result && bytes === maxBytes && this._list.length >= bytes) {
        this._emitError(new Error("Invalid variable byte integer"));
      }
      if (padding) {
        this._pos += bytes;
      }
      if (result) {
        if (fullInfoFlag) {
          result = { bytes, value };
        } else {
          result = value;
        }
      } else {
        result = false;
      }
      debug2("_parseVarByteNum: result: %o", result);
      return result;
    }
    _parseByte() {
      let result;
      if (this._pos < this._list.length) {
        result = this._list.readUInt8(this._pos);
        this._pos++;
      }
      debug2("_parseByte: result: %o", result);
      return result;
    }
    _parseByType(type) {
      debug2("_parseByType: type: %s", type);
      switch (type) {
        case "byte": {
          return this._parseByte() !== 0;
        }
        case "int8": {
          return this._parseByte();
        }
        case "int16": {
          return this._parseNum();
        }
        case "int32": {
          return this._parse4ByteNum();
        }
        case "var": {
          return this._parseVarByteNum();
        }
        case "string": {
          return this._parseString();
        }
        case "pair": {
          return this._parseStringPair();
        }
        case "binary": {
          return this._parseBuffer();
        }
      }
    }
    _parseProperties() {
      debug2("_parseProperties");
      const length = this._parseVarByteNum();
      const start = this._pos;
      const end = start + length;
      const result = {};
      while (this._pos < end) {
        const type = this._parseByte();
        if (!type) {
          this._emitError(new Error("Cannot parse property code type"));
          return false;
        }
        const name = constants2.propertiesCodes[type];
        if (!name) {
          this._emitError(new Error("Unknown property"));
          return false;
        }
        if (name === "userProperties") {
          if (!result[name]) {
            result[name] = /* @__PURE__ */ Object.create(null);
          }
          const currentUserProperty = this._parseByType(constants2.propertiesTypes[name]);
          if (result[name][currentUserProperty.name]) {
            if (Array.isArray(result[name][currentUserProperty.name])) {
              result[name][currentUserProperty.name].push(currentUserProperty.value);
            } else {
              const currentValue = result[name][currentUserProperty.name];
              result[name][currentUserProperty.name] = [currentValue];
              result[name][currentUserProperty.name].push(currentUserProperty.value);
            }
          } else {
            result[name][currentUserProperty.name] = currentUserProperty.value;
          }
          continue;
        }
        if (result[name]) {
          if (Array.isArray(result[name])) {
            result[name].push(this._parseByType(constants2.propertiesTypes[name]));
          } else {
            result[name] = [result[name]];
            result[name].push(this._parseByType(constants2.propertiesTypes[name]));
          }
        } else {
          result[name] = this._parseByType(constants2.propertiesTypes[name]);
        }
      }
      return result;
    }
    _newPacket() {
      debug2("_newPacket");
      if (this.packet) {
        this._list.consume(this.packet.length);
        debug2("_newPacket: parser emit packet: packet.cmd: %s, packet.payload: %s, packet.length: %d", this.packet.cmd, this.packet.payload, this.packet.length);
        this.emit("packet", this.packet);
      }
      debug2("_newPacket: new packet");
      this.packet = new Packet();
      this._pos = 0;
      return true;
    }
    _emitError(err) {
      debug2("_emitError", err);
      this.error = err;
      this.emit("error", err);
    }
  }
  parser = Parser;
  return parser;
}
var numbers;
var hasRequiredNumbers;
function requireNumbers() {
  if (hasRequiredNumbers) return numbers;
  hasRequiredNumbers = 1;
  const { Buffer: Buffer2 } = require$$0$5;
  const max = 65536;
  const cache2 = {};
  const SubOk = Buffer2.isBuffer(Buffer2.from([1, 2]).subarray(0, 1));
  function generateBuffer(i) {
    const buffer = Buffer2.allocUnsafe(2);
    buffer.writeUInt8(i >> 8, 0);
    buffer.writeUInt8(i & 255, 0 + 1);
    return buffer;
  }
  function generateCache() {
    for (let i = 0; i < max; i++) {
      cache2[i] = generateBuffer(i);
    }
  }
  function genBufVariableByteInt(num) {
    const maxLength = 4;
    let digit = 0;
    let pos = 0;
    const buffer = Buffer2.allocUnsafe(maxLength);
    do {
      digit = num % 128 | 0;
      num = num / 128 | 0;
      if (num > 0) digit = digit | 128;
      buffer.writeUInt8(digit, pos++);
    } while (num > 0 && pos < maxLength);
    if (num > 0) {
      pos = 0;
    }
    return SubOk ? buffer.subarray(0, pos) : buffer.slice(0, pos);
  }
  function generate4ByteBuffer(num) {
    const buffer = Buffer2.allocUnsafe(4);
    buffer.writeUInt32BE(num, 0);
    return buffer;
  }
  numbers = {
    cache: cache2,
    generateCache,
    generateNumber: generateBuffer,
    genBufVariableByteInt,
    generate4ByteBuffer
  };
  return numbers;
}
var processNextickArgs = { exports: {} };
var hasRequiredProcessNextickArgs;
function requireProcessNextickArgs() {
  if (hasRequiredProcessNextickArgs) return processNextickArgs.exports;
  hasRequiredProcessNextickArgs = 1;
  if (typeof process === "undefined" || !process.version || process.version.indexOf("v0.") === 0 || process.version.indexOf("v1.") === 0 && process.version.indexOf("v1.8.") !== 0) {
    processNextickArgs.exports = { nextTick };
  } else {
    processNextickArgs.exports = process;
  }
  function nextTick(fn, arg1, arg2, arg3) {
    if (typeof fn !== "function") {
      throw new TypeError('"callback" argument must be a function');
    }
    var len = arguments.length;
    var args, i;
    switch (len) {
      case 0:
      case 1:
        return process.nextTick(fn);
      case 2:
        return process.nextTick(function afterTickOne() {
          fn.call(null, arg1);
        });
      case 3:
        return process.nextTick(function afterTickTwo() {
          fn.call(null, arg1, arg2);
        });
      case 4:
        return process.nextTick(function afterTickThree() {
          fn.call(null, arg1, arg2, arg3);
        });
      default:
        args = new Array(len - 1);
        i = 0;
        while (i < args.length) {
          args[i++] = arguments[i];
        }
        return process.nextTick(function afterTick() {
          fn.apply(null, args);
        });
    }
  }
  return processNextickArgs.exports;
}
var writeToStream;
var hasRequiredWriteToStream;
function requireWriteToStream() {
  if (hasRequiredWriteToStream) return writeToStream;
  hasRequiredWriteToStream = 1;
  const protocol = requireConstants$4();
  const { Buffer: Buffer2 } = require$$0$5;
  const empty = Buffer2.allocUnsafe(0);
  const zeroBuf = Buffer2.from([0]);
  const numbers2 = requireNumbers();
  const nextTick = requireProcessNextickArgs().nextTick;
  const debug2 = requireSrc()("mqtt-packet:writeToStream");
  const numCache = numbers2.cache;
  const generateNumber = numbers2.generateNumber;
  const generateCache = numbers2.generateCache;
  const genBufVariableByteInt = numbers2.genBufVariableByteInt;
  const generate4ByteBuffer = numbers2.generate4ByteBuffer;
  let writeNumber = writeNumberCached;
  let toGenerate = true;
  function generate(packet2, stream2, opts) {
    debug2("generate called");
    if (stream2.cork) {
      stream2.cork();
      nextTick(uncork, stream2);
    }
    if (toGenerate) {
      toGenerate = false;
      generateCache();
    }
    debug2("generate: packet.cmd: %s", packet2.cmd);
    switch (packet2.cmd) {
      case "connect":
        return connect2(packet2, stream2);
      case "connack":
        return connack2(packet2, stream2, opts);
      case "publish":
        return publish2(packet2, stream2, opts);
      case "puback":
      case "pubrec":
      case "pubrel":
      case "pubcomp":
        return confirmation(packet2, stream2, opts);
      case "subscribe":
        return subscribe(packet2, stream2, opts);
      case "suback":
        return suback(packet2, stream2, opts);
      case "unsubscribe":
        return unsubscribe(packet2, stream2, opts);
      case "unsuback":
        return unsuback(packet2, stream2, opts);
      case "pingreq":
      case "pingresp":
        return emptyPacket(packet2, stream2);
      case "disconnect":
        return disconnect(packet2, stream2, opts);
      case "auth":
        return auth2(packet2, stream2, opts);
      default:
        stream2.destroy(new Error("Unknown command"));
        return false;
    }
  }
  Object.defineProperty(generate, "cacheNumbers", {
    get() {
      return writeNumber === writeNumberCached;
    },
    set(value) {
      if (value) {
        if (!numCache || Object.keys(numCache).length === 0) toGenerate = true;
        writeNumber = writeNumberCached;
      } else {
        toGenerate = false;
        writeNumber = writeNumberGenerated;
      }
    }
  });
  function uncork(stream2) {
    stream2.uncork();
  }
  function connect2(packet2, stream2, opts) {
    const settings2 = packet2 || {};
    const protocolId = settings2.protocolId || "MQTT";
    let protocolVersion = settings2.protocolVersion || 4;
    const will = settings2.will;
    let clean = settings2.clean;
    const keepalive = settings2.keepalive || 0;
    const clientId = settings2.clientId || "";
    const username = settings2.username;
    const password = settings2.password;
    const properties = settings2.properties;
    if (clean === void 0) clean = true;
    let length = 0;
    if (typeof protocolId !== "string" && !Buffer2.isBuffer(protocolId)) {
      stream2.destroy(new Error("Invalid protocolId"));
      return false;
    } else length += protocolId.length + 2;
    if (protocolVersion !== 3 && protocolVersion !== 4 && protocolVersion !== 5) {
      stream2.destroy(new Error("Invalid protocol version"));
      return false;
    } else length += 1;
    if ((typeof clientId === "string" || Buffer2.isBuffer(clientId)) && (clientId || protocolVersion >= 4) && (clientId || clean)) {
      length += Buffer2.byteLength(clientId) + 2;
    } else {
      if (protocolVersion < 4) {
        stream2.destroy(new Error("clientId must be supplied before 3.1.1"));
        return false;
      }
      if (clean * 1 === 0) {
        stream2.destroy(new Error("clientId must be given if cleanSession set to 0"));
        return false;
      }
    }
    if (typeof keepalive !== "number" || keepalive < 0 || keepalive > 65535 || keepalive % 1 !== 0) {
      stream2.destroy(new Error("Invalid keepalive"));
      return false;
    } else length += 2;
    length += 1;
    let propertiesData;
    let willProperties;
    if (protocolVersion === 5) {
      propertiesData = getProperties(stream2, properties);
      if (!propertiesData) {
        return false;
      }
      length += propertiesData.length;
    }
    if (will) {
      if (typeof will !== "object") {
        stream2.destroy(new Error("Invalid will"));
        return false;
      }
      if (!will.topic || typeof will.topic !== "string") {
        stream2.destroy(new Error("Invalid will topic"));
        return false;
      } else {
        length += Buffer2.byteLength(will.topic) + 2;
      }
      length += 2;
      if (will.payload) {
        if (will.payload.length >= 0) {
          if (typeof will.payload === "string") {
            length += Buffer2.byteLength(will.payload);
          } else {
            length += will.payload.length;
          }
        } else {
          stream2.destroy(new Error("Invalid will payload"));
          return false;
        }
      }
      willProperties = {};
      if (protocolVersion === 5) {
        willProperties = getProperties(stream2, will.properties);
        if (!willProperties) {
          return false;
        }
        length += willProperties.length;
      }
    }
    let providedUsername = false;
    if (username != null) {
      if (isStringOrBuffer(username)) {
        providedUsername = true;
        length += Buffer2.byteLength(username) + 2;
      } else {
        stream2.destroy(new Error("Invalid username"));
        return false;
      }
    }
    if (password != null) {
      if (!providedUsername) {
        stream2.destroy(new Error("Username is required to use password"));
        return false;
      }
      if (isStringOrBuffer(password)) {
        length += byteLength(password) + 2;
      } else {
        stream2.destroy(new Error("Invalid password"));
        return false;
      }
    }
    stream2.write(protocol.CONNECT_HEADER);
    writeVarByteInt(stream2, length);
    writeStringOrBuffer(stream2, protocolId);
    if (settings2.bridgeMode) {
      protocolVersion += 128;
    }
    stream2.write(
      protocolVersion === 131 ? protocol.VERSION131 : protocolVersion === 132 ? protocol.VERSION132 : protocolVersion === 4 ? protocol.VERSION4 : protocolVersion === 5 ? protocol.VERSION5 : protocol.VERSION3
    );
    let flags = 0;
    flags |= username != null ? protocol.USERNAME_MASK : 0;
    flags |= password != null ? protocol.PASSWORD_MASK : 0;
    flags |= will && will.retain ? protocol.WILL_RETAIN_MASK : 0;
    flags |= will && will.qos ? will.qos << protocol.WILL_QOS_SHIFT : 0;
    flags |= will ? protocol.WILL_FLAG_MASK : 0;
    flags |= clean ? protocol.CLEAN_SESSION_MASK : 0;
    stream2.write(Buffer2.from([flags]));
    writeNumber(stream2, keepalive);
    if (protocolVersion === 5) {
      propertiesData.write();
    }
    writeStringOrBuffer(stream2, clientId);
    if (will) {
      if (protocolVersion === 5) {
        willProperties.write();
      }
      writeString(stream2, will.topic);
      writeStringOrBuffer(stream2, will.payload);
    }
    if (username != null) {
      writeStringOrBuffer(stream2, username);
    }
    if (password != null) {
      writeStringOrBuffer(stream2, password);
    }
    return true;
  }
  function connack2(packet2, stream2, opts) {
    const version2 = opts ? opts.protocolVersion : 4;
    const settings2 = packet2 || {};
    const rc = version2 === 5 ? settings2.reasonCode : settings2.returnCode;
    const properties = settings2.properties;
    let length = 2;
    if (typeof rc !== "number") {
      stream2.destroy(new Error("Invalid return code"));
      return false;
    }
    let propertiesData = null;
    if (version2 === 5) {
      propertiesData = getProperties(stream2, properties);
      if (!propertiesData) {
        return false;
      }
      length += propertiesData.length;
    }
    stream2.write(protocol.CONNACK_HEADER);
    writeVarByteInt(stream2, length);
    stream2.write(settings2.sessionPresent ? protocol.SESSIONPRESENT_HEADER : zeroBuf);
    stream2.write(Buffer2.from([rc]));
    if (propertiesData != null) {
      propertiesData.write();
    }
    return true;
  }
  function publish2(packet2, stream2, opts) {
    debug2("publish: packet: %o", packet2);
    const version2 = opts ? opts.protocolVersion : 4;
    const settings2 = packet2 || {};
    const qos = settings2.qos || 0;
    const retain = settings2.retain ? protocol.RETAIN_MASK : 0;
    const topic = settings2.topic;
    const payload = settings2.payload || empty;
    const id = settings2.messageId;
    const properties = settings2.properties;
    let length = 0;
    if (typeof topic === "string") length += Buffer2.byteLength(topic) + 2;
    else if (Buffer2.isBuffer(topic)) length += topic.length + 2;
    else {
      stream2.destroy(new Error("Invalid topic"));
      return false;
    }
    if (!Buffer2.isBuffer(payload)) length += Buffer2.byteLength(payload);
    else length += payload.length;
    if (qos && typeof id !== "number") {
      stream2.destroy(new Error("Invalid messageId"));
      return false;
    } else if (qos) length += 2;
    let propertiesData = null;
    if (version2 === 5) {
      propertiesData = getProperties(stream2, properties);
      if (!propertiesData) {
        return false;
      }
      length += propertiesData.length;
    }
    stream2.write(protocol.PUBLISH_HEADER[qos][settings2.dup ? 1 : 0][retain ? 1 : 0]);
    writeVarByteInt(stream2, length);
    writeNumber(stream2, byteLength(topic));
    stream2.write(topic);
    if (qos > 0) writeNumber(stream2, id);
    if (propertiesData != null) {
      propertiesData.write();
    }
    debug2("publish: payload: %o", payload);
    return stream2.write(payload);
  }
  function confirmation(packet2, stream2, opts) {
    const version2 = opts ? opts.protocolVersion : 4;
    const settings2 = packet2 || {};
    const type = settings2.cmd || "puback";
    const id = settings2.messageId;
    const dup = settings2.dup && type === "pubrel" ? protocol.DUP_MASK : 0;
    let qos = 0;
    const reasonCode = settings2.reasonCode;
    const properties = settings2.properties;
    let length = version2 === 5 ? 3 : 2;
    if (type === "pubrel") qos = 1;
    if (typeof id !== "number") {
      stream2.destroy(new Error("Invalid messageId"));
      return false;
    }
    let propertiesData = null;
    if (version2 === 5) {
      if (typeof properties === "object") {
        propertiesData = getPropertiesByMaximumPacketSize(stream2, properties, opts, length);
        if (!propertiesData) {
          return false;
        }
        length += propertiesData.length;
      }
    }
    stream2.write(protocol.ACKS[type][qos][dup][0]);
    if (length === 3) length += reasonCode !== 0 ? 1 : -1;
    writeVarByteInt(stream2, length);
    writeNumber(stream2, id);
    if (version2 === 5 && length !== 2) {
      stream2.write(Buffer2.from([reasonCode]));
    }
    if (propertiesData !== null) {
      propertiesData.write();
    } else {
      if (length === 4) {
        stream2.write(Buffer2.from([0]));
      }
    }
    return true;
  }
  function subscribe(packet2, stream2, opts) {
    debug2("subscribe: packet: ");
    const version2 = opts ? opts.protocolVersion : 4;
    const settings2 = packet2 || {};
    const dup = settings2.dup ? protocol.DUP_MASK : 0;
    const id = settings2.messageId;
    const subs = settings2.subscriptions;
    const properties = settings2.properties;
    let length = 0;
    if (typeof id !== "number") {
      stream2.destroy(new Error("Invalid messageId"));
      return false;
    } else length += 2;
    let propertiesData = null;
    if (version2 === 5) {
      propertiesData = getProperties(stream2, properties);
      if (!propertiesData) {
        return false;
      }
      length += propertiesData.length;
    }
    if (typeof subs === "object" && subs.length) {
      for (let i = 0; i < subs.length; i += 1) {
        const itopic = subs[i].topic;
        const iqos = subs[i].qos;
        if (typeof itopic !== "string") {
          stream2.destroy(new Error("Invalid subscriptions - invalid topic"));
          return false;
        }
        if (typeof iqos !== "number") {
          stream2.destroy(new Error("Invalid subscriptions - invalid qos"));
          return false;
        }
        if (version2 === 5) {
          const nl = subs[i].nl || false;
          if (typeof nl !== "boolean") {
            stream2.destroy(new Error("Invalid subscriptions - invalid No Local"));
            return false;
          }
          const rap = subs[i].rap || false;
          if (typeof rap !== "boolean") {
            stream2.destroy(new Error("Invalid subscriptions - invalid Retain as Published"));
            return false;
          }
          const rh = subs[i].rh || 0;
          if (typeof rh !== "number" || rh > 2) {
            stream2.destroy(new Error("Invalid subscriptions - invalid Retain Handling"));
            return false;
          }
        }
        length += Buffer2.byteLength(itopic) + 2 + 1;
      }
    } else {
      stream2.destroy(new Error("Invalid subscriptions"));
      return false;
    }
    debug2("subscribe: writing to stream: %o", protocol.SUBSCRIBE_HEADER);
    stream2.write(protocol.SUBSCRIBE_HEADER[1][dup ? 1 : 0][0]);
    writeVarByteInt(stream2, length);
    writeNumber(stream2, id);
    if (propertiesData !== null) {
      propertiesData.write();
    }
    let result = true;
    for (const sub of subs) {
      const jtopic = sub.topic;
      const jqos = sub.qos;
      const jnl = +sub.nl;
      const jrap = +sub.rap;
      const jrh = sub.rh;
      let joptions;
      writeString(stream2, jtopic);
      joptions = protocol.SUBSCRIBE_OPTIONS_QOS[jqos];
      if (version2 === 5) {
        joptions |= jnl ? protocol.SUBSCRIBE_OPTIONS_NL : 0;
        joptions |= jrap ? protocol.SUBSCRIBE_OPTIONS_RAP : 0;
        joptions |= jrh ? protocol.SUBSCRIBE_OPTIONS_RH[jrh] : 0;
      }
      result = stream2.write(Buffer2.from([joptions]));
    }
    return result;
  }
  function suback(packet2, stream2, opts) {
    const version2 = opts ? opts.protocolVersion : 4;
    const settings2 = packet2 || {};
    const id = settings2.messageId;
    const granted = settings2.granted;
    const properties = settings2.properties;
    let length = 0;
    if (typeof id !== "number") {
      stream2.destroy(new Error("Invalid messageId"));
      return false;
    } else length += 2;
    if (typeof granted === "object" && granted.length) {
      for (let i = 0; i < granted.length; i += 1) {
        if (typeof granted[i] !== "number") {
          stream2.destroy(new Error("Invalid qos vector"));
          return false;
        }
        length += 1;
      }
    } else {
      stream2.destroy(new Error("Invalid qos vector"));
      return false;
    }
    let propertiesData = null;
    if (version2 === 5) {
      propertiesData = getPropertiesByMaximumPacketSize(stream2, properties, opts, length);
      if (!propertiesData) {
        return false;
      }
      length += propertiesData.length;
    }
    stream2.write(protocol.SUBACK_HEADER);
    writeVarByteInt(stream2, length);
    writeNumber(stream2, id);
    if (propertiesData !== null) {
      propertiesData.write();
    }
    return stream2.write(Buffer2.from(granted));
  }
  function unsubscribe(packet2, stream2, opts) {
    const version2 = opts ? opts.protocolVersion : 4;
    const settings2 = packet2 || {};
    const id = settings2.messageId;
    const dup = settings2.dup ? protocol.DUP_MASK : 0;
    const unsubs = settings2.unsubscriptions;
    const properties = settings2.properties;
    let length = 0;
    if (typeof id !== "number") {
      stream2.destroy(new Error("Invalid messageId"));
      return false;
    } else {
      length += 2;
    }
    if (typeof unsubs === "object" && unsubs.length) {
      for (let i = 0; i < unsubs.length; i += 1) {
        if (typeof unsubs[i] !== "string") {
          stream2.destroy(new Error("Invalid unsubscriptions"));
          return false;
        }
        length += Buffer2.byteLength(unsubs[i]) + 2;
      }
    } else {
      stream2.destroy(new Error("Invalid unsubscriptions"));
      return false;
    }
    let propertiesData = null;
    if (version2 === 5) {
      propertiesData = getProperties(stream2, properties);
      if (!propertiesData) {
        return false;
      }
      length += propertiesData.length;
    }
    stream2.write(protocol.UNSUBSCRIBE_HEADER[1][dup ? 1 : 0][0]);
    writeVarByteInt(stream2, length);
    writeNumber(stream2, id);
    if (propertiesData !== null) {
      propertiesData.write();
    }
    let result = true;
    for (let j = 0; j < unsubs.length; j++) {
      result = writeString(stream2, unsubs[j]);
    }
    return result;
  }
  function unsuback(packet2, stream2, opts) {
    const version2 = opts ? opts.protocolVersion : 4;
    const settings2 = packet2 || {};
    const id = settings2.messageId;
    const dup = settings2.dup ? protocol.DUP_MASK : 0;
    const granted = settings2.granted;
    const properties = settings2.properties;
    const type = settings2.cmd;
    const qos = 0;
    let length = 2;
    if (typeof id !== "number") {
      stream2.destroy(new Error("Invalid messageId"));
      return false;
    }
    if (version2 === 5) {
      if (typeof granted === "object" && granted.length) {
        for (let i = 0; i < granted.length; i += 1) {
          if (typeof granted[i] !== "number") {
            stream2.destroy(new Error("Invalid qos vector"));
            return false;
          }
          length += 1;
        }
      } else {
        stream2.destroy(new Error("Invalid qos vector"));
        return false;
      }
    }
    let propertiesData = null;
    if (version2 === 5) {
      propertiesData = getPropertiesByMaximumPacketSize(stream2, properties, opts, length);
      if (!propertiesData) {
        return false;
      }
      length += propertiesData.length;
    }
    stream2.write(protocol.ACKS[type][qos][dup][0]);
    writeVarByteInt(stream2, length);
    writeNumber(stream2, id);
    if (propertiesData !== null) {
      propertiesData.write();
    }
    if (version2 === 5) {
      stream2.write(Buffer2.from(granted));
    }
    return true;
  }
  function emptyPacket(packet2, stream2, opts) {
    return stream2.write(protocol.EMPTY[packet2.cmd]);
  }
  function disconnect(packet2, stream2, opts) {
    const version2 = opts ? opts.protocolVersion : 4;
    const settings2 = packet2 || {};
    const reasonCode = settings2.reasonCode;
    const properties = settings2.properties;
    let length = version2 === 5 ? 1 : 0;
    let propertiesData = null;
    if (version2 === 5) {
      propertiesData = getPropertiesByMaximumPacketSize(stream2, properties, opts, length);
      if (!propertiesData) {
        return false;
      }
      length += propertiesData.length;
    }
    stream2.write(Buffer2.from([protocol.codes.disconnect << 4]));
    writeVarByteInt(stream2, length);
    if (version2 === 5) {
      stream2.write(Buffer2.from([reasonCode]));
    }
    if (propertiesData !== null) {
      propertiesData.write();
    }
    return true;
  }
  function auth2(packet2, stream2, opts) {
    const version2 = opts ? opts.protocolVersion : 4;
    const settings2 = packet2 || {};
    const reasonCode = settings2.reasonCode;
    const properties = settings2.properties;
    let length = version2 === 5 ? 1 : 0;
    if (version2 !== 5) stream2.destroy(new Error("Invalid mqtt version for auth packet"));
    const propertiesData = getPropertiesByMaximumPacketSize(stream2, properties, opts, length);
    if (!propertiesData) {
      return false;
    }
    length += propertiesData.length;
    stream2.write(Buffer2.from([protocol.codes.auth << 4]));
    writeVarByteInt(stream2, length);
    stream2.write(Buffer2.from([reasonCode]));
    if (propertiesData !== null) {
      propertiesData.write();
    }
    return true;
  }
  const varByteIntCache = {};
  function writeVarByteInt(stream2, num) {
    if (num > protocol.VARBYTEINT_MAX) {
      stream2.destroy(new Error(`Invalid variable byte integer: ${num}`));
      return false;
    }
    let buffer = varByteIntCache[num];
    if (!buffer) {
      buffer = genBufVariableByteInt(num);
      if (num < 16384) varByteIntCache[num] = buffer;
    }
    debug2("writeVarByteInt: writing to stream: %o", buffer);
    return stream2.write(buffer);
  }
  function writeString(stream2, string) {
    const strlen = Buffer2.byteLength(string);
    writeNumber(stream2, strlen);
    debug2("writeString: %s", string);
    return stream2.write(string, "utf8");
  }
  function writeStringPair(stream2, name, value) {
    writeString(stream2, name);
    writeString(stream2, value);
  }
  function writeNumberCached(stream2, number) {
    debug2("writeNumberCached: number: %d", number);
    debug2("writeNumberCached: %o", numCache[number]);
    return stream2.write(numCache[number]);
  }
  function writeNumberGenerated(stream2, number) {
    const generatedNumber = generateNumber(number);
    debug2("writeNumberGenerated: %o", generatedNumber);
    return stream2.write(generatedNumber);
  }
  function write4ByteNumber(stream2, number) {
    const generated4ByteBuffer = generate4ByteBuffer(number);
    debug2("write4ByteNumber: %o", generated4ByteBuffer);
    return stream2.write(generated4ByteBuffer);
  }
  function writeStringOrBuffer(stream2, toWrite) {
    if (typeof toWrite === "string") {
      writeString(stream2, toWrite);
    } else if (toWrite) {
      writeNumber(stream2, toWrite.length);
      stream2.write(toWrite);
    } else writeNumber(stream2, 0);
  }
  function getProperties(stream2, properties) {
    if (typeof properties !== "object" || properties.length != null) {
      return {
        length: 1,
        write() {
          writeProperties(stream2, {}, 0);
        }
      };
    }
    let propertiesLength = 0;
    function getLengthProperty(name, value) {
      const type = protocol.propertiesTypes[name];
      let length = 0;
      switch (type) {
        case "byte": {
          if (typeof value !== "boolean") {
            stream2.destroy(new Error(`Invalid ${name}: ${value}`));
            return false;
          }
          length += 1 + 1;
          break;
        }
        case "int8": {
          if (typeof value !== "number" || value < 0 || value > 255) {
            stream2.destroy(new Error(`Invalid ${name}: ${value}`));
            return false;
          }
          length += 1 + 1;
          break;
        }
        case "binary": {
          if (value && value === null) {
            stream2.destroy(new Error(`Invalid ${name}: ${value}`));
            return false;
          }
          length += 1 + Buffer2.byteLength(value) + 2;
          break;
        }
        case "int16": {
          if (typeof value !== "number" || value < 0 || value > 65535) {
            stream2.destroy(new Error(`Invalid ${name}: ${value}`));
            return false;
          }
          length += 1 + 2;
          break;
        }
        case "int32": {
          if (typeof value !== "number" || value < 0 || value > 4294967295) {
            stream2.destroy(new Error(`Invalid ${name}: ${value}`));
            return false;
          }
          length += 1 + 4;
          break;
        }
        case "var": {
          if (typeof value !== "number" || value < 0 || value > 268435455) {
            stream2.destroy(new Error(`Invalid ${name}: ${value}`));
            return false;
          }
          length += 1 + Buffer2.byteLength(genBufVariableByteInt(value));
          break;
        }
        case "string": {
          if (typeof value !== "string") {
            stream2.destroy(new Error(`Invalid ${name}: ${value}`));
            return false;
          }
          length += 1 + 2 + Buffer2.byteLength(value.toString());
          break;
        }
        case "pair": {
          if (typeof value !== "object") {
            stream2.destroy(new Error(`Invalid ${name}: ${value}`));
            return false;
          }
          length += Object.getOwnPropertyNames(value).reduce((result, name2) => {
            const currentValue = value[name2];
            if (Array.isArray(currentValue)) {
              result += currentValue.reduce((currentLength, value2) => {
                currentLength += 1 + 2 + Buffer2.byteLength(name2.toString()) + 2 + Buffer2.byteLength(value2.toString());
                return currentLength;
              }, 0);
            } else {
              result += 1 + 2 + Buffer2.byteLength(name2.toString()) + 2 + Buffer2.byteLength(value[name2].toString());
            }
            return result;
          }, 0);
          break;
        }
        default: {
          stream2.destroy(new Error(`Invalid property ${name}: ${value}`));
          return false;
        }
      }
      return length;
    }
    if (properties) {
      for (const propName in properties) {
        let propLength = 0;
        let propValueLength = 0;
        const propValue = properties[propName];
        if (propValue === void 0) {
          continue;
        } else if (Array.isArray(propValue)) {
          for (let valueIndex = 0; valueIndex < propValue.length; valueIndex++) {
            propValueLength = getLengthProperty(propName, propValue[valueIndex]);
            if (!propValueLength) {
              return false;
            }
            propLength += propValueLength;
          }
        } else {
          propValueLength = getLengthProperty(propName, propValue);
          if (!propValueLength) {
            return false;
          }
          propLength = propValueLength;
        }
        if (!propLength) return false;
        propertiesLength += propLength;
      }
    }
    const propertiesLengthLength = Buffer2.byteLength(genBufVariableByteInt(propertiesLength));
    return {
      length: propertiesLengthLength + propertiesLength,
      write() {
        writeProperties(stream2, properties, propertiesLength);
      }
    };
  }
  function getPropertiesByMaximumPacketSize(stream2, properties, opts, length) {
    const mayEmptyProps = ["reasonString", "userProperties"];
    const maximumPacketSize = opts && opts.properties && opts.properties.maximumPacketSize ? opts.properties.maximumPacketSize : 0;
    let propertiesData = getProperties(stream2, properties);
    if (maximumPacketSize) {
      while (length + propertiesData.length > maximumPacketSize) {
        const currentMayEmptyProp = mayEmptyProps.shift();
        if (currentMayEmptyProp && properties[currentMayEmptyProp]) {
          delete properties[currentMayEmptyProp];
          propertiesData = getProperties(stream2, properties);
        } else {
          return false;
        }
      }
    }
    return propertiesData;
  }
  function writeProperty(stream2, propName, value) {
    const type = protocol.propertiesTypes[propName];
    switch (type) {
      case "byte": {
        stream2.write(Buffer2.from([protocol.properties[propName]]));
        stream2.write(Buffer2.from([+value]));
        break;
      }
      case "int8": {
        stream2.write(Buffer2.from([protocol.properties[propName]]));
        stream2.write(Buffer2.from([value]));
        break;
      }
      case "binary": {
        stream2.write(Buffer2.from([protocol.properties[propName]]));
        writeStringOrBuffer(stream2, value);
        break;
      }
      case "int16": {
        stream2.write(Buffer2.from([protocol.properties[propName]]));
        writeNumber(stream2, value);
        break;
      }
      case "int32": {
        stream2.write(Buffer2.from([protocol.properties[propName]]));
        write4ByteNumber(stream2, value);
        break;
      }
      case "var": {
        stream2.write(Buffer2.from([protocol.properties[propName]]));
        writeVarByteInt(stream2, value);
        break;
      }
      case "string": {
        stream2.write(Buffer2.from([protocol.properties[propName]]));
        writeString(stream2, value);
        break;
      }
      case "pair": {
        Object.getOwnPropertyNames(value).forEach((name) => {
          const currentValue = value[name];
          if (Array.isArray(currentValue)) {
            currentValue.forEach((value2) => {
              stream2.write(Buffer2.from([protocol.properties[propName]]));
              writeStringPair(stream2, name.toString(), value2.toString());
            });
          } else {
            stream2.write(Buffer2.from([protocol.properties[propName]]));
            writeStringPair(stream2, name.toString(), currentValue.toString());
          }
        });
        break;
      }
      default: {
        stream2.destroy(new Error(`Invalid property ${propName} value: ${value}`));
        return false;
      }
    }
  }
  function writeProperties(stream2, properties, propertiesLength) {
    writeVarByteInt(stream2, propertiesLength);
    for (const propName in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, propName) && properties[propName] != null) {
        const value = properties[propName];
        if (Array.isArray(value)) {
          for (let valueIndex = 0; valueIndex < value.length; valueIndex++) {
            writeProperty(stream2, propName, value[valueIndex]);
          }
        } else {
          writeProperty(stream2, propName, value);
        }
      }
    }
  }
  function byteLength(bufOrString) {
    if (!bufOrString) return 0;
    else if (bufOrString instanceof Buffer2) return bufOrString.length;
    else return Buffer2.byteLength(bufOrString);
  }
  function isStringOrBuffer(field) {
    return typeof field === "string" || field instanceof Buffer2;
  }
  writeToStream = generate;
  return writeToStream;
}
var generate_1;
var hasRequiredGenerate;
function requireGenerate() {
  if (hasRequiredGenerate) return generate_1;
  hasRequiredGenerate = 1;
  const writeToStream2 = requireWriteToStream();
  const { EventEmitter } = require$$0$6;
  const { Buffer: Buffer2 } = require$$0$5;
  function generate(packet2, opts) {
    const stream2 = new Accumulator();
    writeToStream2(packet2, stream2, opts);
    return stream2.concat();
  }
  class Accumulator extends EventEmitter {
    constructor() {
      super();
      this._array = new Array(20);
      this._i = 0;
    }
    write(chunk) {
      this._array[this._i++] = chunk;
      return true;
    }
    concat() {
      let length = 0;
      const lengths = new Array(this._array.length);
      const list = this._array;
      let pos = 0;
      let i;
      for (i = 0; i < list.length && list[i] !== void 0; i++) {
        if (typeof list[i] !== "string") lengths[i] = list[i].length;
        else lengths[i] = Buffer2.byteLength(list[i]);
        length += lengths[i];
      }
      const result = Buffer2.allocUnsafe(length);
      for (i = 0; i < list.length && list[i] !== void 0; i++) {
        if (typeof list[i] !== "string") {
          list[i].copy(result, pos);
          pos += lengths[i];
        } else {
          result.write(list[i], pos);
          pos += lengths[i];
        }
      }
      return result;
    }
    destroy(err) {
      if (err) this.emit("error", err);
    }
  }
  generate_1 = generate;
  return generate_1;
}
var hasRequiredMqtt$1;
function requireMqtt$1() {
  if (hasRequiredMqtt$1) return mqtt$1;
  hasRequiredMqtt$1 = 1;
  mqtt$1.parser = requireParser().parser;
  mqtt$1.generate = requireGenerate();
  mqtt$1.writeToStream = requireWriteToStream();
  return mqtt$1;
}
var rfdc_1;
var hasRequiredRfdc;
function requireRfdc() {
  if (hasRequiredRfdc) return rfdc_1;
  hasRequiredRfdc = 1;
  rfdc_1 = rfdc;
  function copyBuffer(cur) {
    if (cur instanceof Buffer) {
      return Buffer.from(cur);
    }
    return new cur.constructor(cur.buffer.slice(), cur.byteOffset, cur.length);
  }
  function rfdc(opts) {
    opts = opts || {};
    if (opts.circles) return rfdcCircles(opts);
    const constructorHandlers = /* @__PURE__ */ new Map();
    constructorHandlers.set(Date, (o) => new Date(o));
    constructorHandlers.set(Map, (o, fn) => new Map(cloneArray(Array.from(o), fn)));
    constructorHandlers.set(Set, (o, fn) => new Set(cloneArray(Array.from(o), fn)));
    if (opts.constructorHandlers) {
      for (const handler2 of opts.constructorHandlers) {
        constructorHandlers.set(handler2[0], handler2[1]);
      }
    }
    let handler = null;
    return opts.proto ? cloneProto : clone;
    function cloneArray(a, fn) {
      const keys = Object.keys(a);
      const a2 = new Array(keys.length);
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const cur = a[k];
        if (typeof cur !== "object" || cur === null) {
          a2[k] = cur;
        } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
          a2[k] = handler(cur, fn);
        } else if (ArrayBuffer.isView(cur)) {
          a2[k] = copyBuffer(cur);
        } else {
          a2[k] = fn(cur);
        }
      }
      return a2;
    }
    function clone(o) {
      if (typeof o !== "object" || o === null) return o;
      if (Array.isArray(o)) return cloneArray(o, clone);
      if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
        return handler(o, clone);
      }
      const o2 = {};
      for (const k in o) {
        if (Object.hasOwnProperty.call(o, k) === false) continue;
        const cur = o[k];
        if (typeof cur !== "object" || cur === null) {
          o2[k] = cur;
        } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
          o2[k] = handler(cur, clone);
        } else if (ArrayBuffer.isView(cur)) {
          o2[k] = copyBuffer(cur);
        } else {
          o2[k] = clone(cur);
        }
      }
      return o2;
    }
    function cloneProto(o) {
      if (typeof o !== "object" || o === null) return o;
      if (Array.isArray(o)) return cloneArray(o, cloneProto);
      if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
        return handler(o, cloneProto);
      }
      const o2 = {};
      for (const k in o) {
        const cur = o[k];
        if (typeof cur !== "object" || cur === null) {
          o2[k] = cur;
        } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
          o2[k] = handler(cur, cloneProto);
        } else if (ArrayBuffer.isView(cur)) {
          o2[k] = copyBuffer(cur);
        } else {
          o2[k] = cloneProto(cur);
        }
      }
      return o2;
    }
  }
  function rfdcCircles(opts) {
    const refs = [];
    const refsNew = [];
    const constructorHandlers = /* @__PURE__ */ new Map();
    constructorHandlers.set(Date, (o) => new Date(o));
    constructorHandlers.set(Map, (o, fn) => new Map(cloneArray(Array.from(o), fn)));
    constructorHandlers.set(Set, (o, fn) => new Set(cloneArray(Array.from(o), fn)));
    if (opts.constructorHandlers) {
      for (const handler2 of opts.constructorHandlers) {
        constructorHandlers.set(handler2[0], handler2[1]);
      }
    }
    let handler = null;
    return opts.proto ? cloneProto : clone;
    function cloneArray(a, fn) {
      const keys = Object.keys(a);
      const a2 = new Array(keys.length);
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const cur = a[k];
        if (typeof cur !== "object" || cur === null) {
          a2[k] = cur;
        } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
          a2[k] = handler(cur, fn);
        } else if (ArrayBuffer.isView(cur)) {
          a2[k] = copyBuffer(cur);
        } else {
          const index = refs.indexOf(cur);
          if (index !== -1) {
            a2[k] = refsNew[index];
          } else {
            a2[k] = fn(cur);
          }
        }
      }
      return a2;
    }
    function clone(o) {
      if (typeof o !== "object" || o === null) return o;
      if (Array.isArray(o)) return cloneArray(o, clone);
      if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
        return handler(o, clone);
      }
      const o2 = {};
      refs.push(o);
      refsNew.push(o2);
      for (const k in o) {
        if (Object.hasOwnProperty.call(o, k) === false) continue;
        const cur = o[k];
        if (typeof cur !== "object" || cur === null) {
          o2[k] = cur;
        } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
          o2[k] = handler(cur, clone);
        } else if (ArrayBuffer.isView(cur)) {
          o2[k] = copyBuffer(cur);
        } else {
          const i = refs.indexOf(cur);
          if (i !== -1) {
            o2[k] = refsNew[i];
          } else {
            o2[k] = clone(cur);
          }
        }
      }
      refs.pop();
      refsNew.pop();
      return o2;
    }
    function cloneProto(o) {
      if (typeof o !== "object" || o === null) return o;
      if (Array.isArray(o)) return cloneArray(o, cloneProto);
      if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
        return handler(o, cloneProto);
      }
      const o2 = {};
      refs.push(o);
      refsNew.push(o2);
      for (const k in o) {
        const cur = o[k];
        if (typeof cur !== "object" || cur === null) {
          o2[k] = cur;
        } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
          o2[k] = handler(cur, cloneProto);
        } else if (ArrayBuffer.isView(cur)) {
          o2[k] = copyBuffer(cur);
        } else {
          const i = refs.indexOf(cur);
          if (i !== -1) {
            o2[k] = refsNew[i];
          } else {
            o2[k] = cloneProto(cur);
          }
        }
      }
      refs.pop();
      refsNew.pop();
      return o2;
    }
  }
  return rfdc_1;
}
var _default;
var hasRequired_default;
function require_default() {
  if (hasRequired_default) return _default;
  hasRequired_default = 1;
  _default = requireRfdc()();
  return _default;
}
var validations = {};
var hasRequiredValidations;
function requireValidations() {
  if (hasRequiredValidations) return validations;
  hasRequiredValidations = 1;
  Object.defineProperty(validations, "__esModule", { value: true });
  validations.validateTopic = validateTopic;
  validations.validateTopics = validateTopics;
  function validateTopic(topic) {
    const parts = topic.split("/");
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === "+") {
        continue;
      }
      if (parts[i] === "#") {
        return i === parts.length - 1;
      }
      if (parts[i].indexOf("+") !== -1 || parts[i].indexOf("#") !== -1) {
        return false;
      }
    }
    return true;
  }
  function validateTopics(topics) {
    if (topics.length === 0) {
      return "empty_topic_list";
    }
    for (let i = 0; i < topics.length; i++) {
      if (!validateTopic(topics[i])) {
        return topics[i];
      }
    }
    return null;
  }
  return validations;
}
var store = {};
var hasRequiredStore;
function requireStore() {
  if (hasRequiredStore) return store;
  hasRequiredStore = 1;
  Object.defineProperty(store, "__esModule", { value: true });
  const readable_stream_1 = requireOurs();
  const streamsOpts = { objectMode: true };
  const defaultStoreOptions = {
    clean: true
  };
  class Store {
    constructor(options) {
      __publicField(this, "options");
      __publicField(this, "_inflights");
      this.options = options || {};
      this.options = { ...defaultStoreOptions, ...options };
      this._inflights = /* @__PURE__ */ new Map();
    }
    put(packet2, cb) {
      this._inflights.set(packet2.messageId, packet2);
      if (cb) {
        cb();
      }
      return this;
    }
    createStream() {
      const stream2 = new readable_stream_1.Readable(streamsOpts);
      const values = [];
      let destroyed = false;
      let i = 0;
      this._inflights.forEach((value, key) => {
        values.push(value);
      });
      stream2._read = () => {
        if (!destroyed && i < values.length) {
          stream2.push(values[i++]);
        } else {
          stream2.push(null);
        }
      };
      stream2.destroy = (err) => {
        if (destroyed) {
          return;
        }
        destroyed = true;
        setTimeout(() => {
          stream2.emit("close");
        }, 0);
        return stream2;
      };
      return stream2;
    }
    del(packet2, cb) {
      const toDelete = this._inflights.get(packet2.messageId);
      if (toDelete) {
        this._inflights.delete(packet2.messageId);
        cb(null, toDelete);
      } else if (cb) {
        cb(new Error("missing packet"));
      }
      return this;
    }
    get(packet2, cb) {
      const storedPacket = this._inflights.get(packet2.messageId);
      if (storedPacket) {
        cb(null, storedPacket);
      } else if (cb) {
        cb(new Error("missing packet"));
      }
      return this;
    }
    close(cb) {
      if (this.options.clean) {
        this._inflights = null;
      }
      if (cb) {
        cb();
      }
    }
  }
  store.default = Store;
  return store;
}
var handlers = {};
var publish = {};
var hasRequiredPublish;
function requirePublish() {
  if (hasRequiredPublish) return publish;
  hasRequiredPublish = 1;
  Object.defineProperty(publish, "__esModule", { value: true });
  const validReasonCodes = [0, 16, 128, 131, 135, 144, 145, 151, 153];
  const handlePublish = (client2, packet2, done) => {
    client2.log("handlePublish: packet %o", packet2);
    done = typeof done !== "undefined" ? done : client2.noop;
    let topic = packet2.topic.toString();
    const message = packet2.payload;
    const { qos } = packet2;
    const { messageId } = packet2;
    const { options } = client2;
    if (client2.options.protocolVersion === 5) {
      let alias;
      if (packet2.properties) {
        alias = packet2.properties.topicAlias;
      }
      if (typeof alias !== "undefined") {
        if (topic.length === 0) {
          if (alias > 0 && alias <= 65535) {
            const gotTopic = client2["topicAliasRecv"].getTopicByAlias(alias);
            if (gotTopic) {
              topic = gotTopic;
              client2.log("handlePublish :: topic complemented by alias. topic: %s - alias: %d", topic, alias);
            } else {
              client2.log("handlePublish :: unregistered topic alias. alias: %d", alias);
              client2.emit("error", new Error("Received unregistered Topic Alias"));
              return;
            }
          } else {
            client2.log("handlePublish :: topic alias out of range. alias: %d", alias);
            client2.emit("error", new Error("Received Topic Alias is out of range"));
            return;
          }
        } else if (client2["topicAliasRecv"].put(topic, alias)) {
          client2.log("handlePublish :: registered topic: %s - alias: %d", topic, alias);
        } else {
          client2.log("handlePublish :: topic alias out of range. alias: %d", alias);
          client2.emit("error", new Error("Received Topic Alias is out of range"));
          return;
        }
      }
    }
    client2.log("handlePublish: qos %d", qos);
    switch (qos) {
      case 2: {
        options.customHandleAcks(topic, message, packet2, (error, code) => {
          if (typeof error === "number") {
            code = error;
            error = null;
          }
          if (error) {
            return client2.emit("error", error);
          }
          if (validReasonCodes.indexOf(code) === -1) {
            return client2.emit("error", new Error("Wrong reason code for pubrec"));
          }
          if (code) {
            client2["_sendPacket"]({ cmd: "pubrec", messageId, reasonCode: code }, done);
          } else {
            client2.incomingStore.put(packet2, () => {
              client2["_sendPacket"]({ cmd: "pubrec", messageId }, done);
            });
          }
        });
        break;
      }
      case 1: {
        options.customHandleAcks(topic, message, packet2, (error, code) => {
          if (typeof error === "number") {
            code = error;
            error = null;
          }
          if (error) {
            return client2.emit("error", error);
          }
          if (validReasonCodes.indexOf(code) === -1) {
            return client2.emit("error", new Error("Wrong reason code for puback"));
          }
          if (!code) {
            client2.emit("message", topic, message, packet2);
          }
          client2.handleMessage(packet2, (err) => {
            if (err) {
              return done && done(err);
            }
            client2["_sendPacket"]({ cmd: "puback", messageId, reasonCode: code }, done);
          });
        });
        break;
      }
      case 0:
        client2.emit("message", topic, message, packet2);
        client2.handleMessage(packet2, done);
        break;
      default:
        client2.log("handlePublish: unknown QoS. Doing nothing.");
        break;
    }
  };
  publish.default = handlePublish;
  return publish;
}
var auth = {};
var shared = {};
const version = "5.15.1";
const require$$0$2 = {
  version
};
var hasRequiredShared;
function requireShared() {
  if (hasRequiredShared) return shared;
  hasRequiredShared = 1;
  Object.defineProperty(shared, "__esModule", { value: true });
  shared.MQTTJS_VERSION = shared.nextTick = shared.ErrorWithSubackPacket = shared.ErrorWithReasonCode = void 0;
  shared.applyMixin = applyMixin;
  class ErrorWithReasonCode extends Error {
    constructor(message, code) {
      super(message);
      __publicField(this, "code");
      this.code = code;
      Object.setPrototypeOf(this, ErrorWithReasonCode.prototype);
      Object.getPrototypeOf(this).name = "ErrorWithReasonCode";
    }
  }
  shared.ErrorWithReasonCode = ErrorWithReasonCode;
  class ErrorWithSubackPacket extends Error {
    constructor(message, packet2) {
      super(message);
      __publicField(this, "packet");
      this.packet = packet2;
      Object.setPrototypeOf(this, ErrorWithSubackPacket.prototype);
      Object.getPrototypeOf(this).name = "ErrorWithSubackPacket";
    }
  }
  shared.ErrorWithSubackPacket = ErrorWithSubackPacket;
  function applyMixin(target, mixin, includeConstructor = false) {
    const inheritanceChain = [mixin];
    while (true) {
      const current = inheritanceChain[0];
      const base = Object.getPrototypeOf(current);
      if (base == null ? void 0 : base.prototype) {
        inheritanceChain.unshift(base);
      } else {
        break;
      }
    }
    for (const ctor of inheritanceChain) {
      for (const prop of Object.getOwnPropertyNames(ctor.prototype)) {
        if (includeConstructor || prop !== "constructor") {
          Object.defineProperty(target.prototype, prop, Object.getOwnPropertyDescriptor(ctor.prototype, prop) ?? /* @__PURE__ */ Object.create(null));
        }
      }
    }
  }
  shared.nextTick = typeof (process == null ? void 0 : process.nextTick) === "function" ? process.nextTick : (callback) => {
    setTimeout(callback, 0);
  };
  shared.MQTTJS_VERSION = require$$0$2.version;
  return shared;
}
var ack = {};
var hasRequiredAck;
function requireAck() {
  if (hasRequiredAck) return ack;
  hasRequiredAck = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReasonCodes = void 0;
    const shared_1 = requireShared();
    exports.ReasonCodes = {
      0: "",
      1: "Unacceptable protocol version",
      2: "Identifier rejected",
      3: "Server unavailable",
      4: "Bad username or password",
      5: "Not authorized",
      16: "No matching subscribers",
      17: "No subscription existed",
      128: "Unspecified error",
      129: "Malformed Packet",
      130: "Protocol Error",
      131: "Implementation specific error",
      132: "Unsupported Protocol Version",
      133: "Client Identifier not valid",
      134: "Bad User Name or Password",
      135: "Not authorized",
      136: "Server unavailable",
      137: "Server busy",
      138: "Banned",
      139: "Server shutting down",
      140: "Bad authentication method",
      141: "Keep Alive timeout",
      142: "Session taken over",
      143: "Topic Filter invalid",
      144: "Topic Name invalid",
      145: "Packet identifier in use",
      146: "Packet Identifier not found",
      147: "Receive Maximum exceeded",
      148: "Topic Alias invalid",
      149: "Packet too large",
      150: "Message rate too high",
      151: "Quota exceeded",
      152: "Administrative action",
      153: "Payload format invalid",
      154: "Retain not supported",
      155: "QoS not supported",
      156: "Use another server",
      157: "Server moved",
      158: "Shared Subscriptions not supported",
      159: "Connection rate exceeded",
      160: "Maximum connect time",
      161: "Subscription Identifiers not supported",
      162: "Wildcard Subscriptions not supported"
    };
    const handleAck = (client2, packet2) => {
      const { messageId } = packet2;
      const type = packet2.cmd;
      let response = null;
      const cb = client2.outgoing[messageId] ? client2.outgoing[messageId].cb : null;
      let err = null;
      if (!cb) {
        client2.log("_handleAck :: Server sent an ack in error. Ignoring.");
        return;
      }
      client2.log("_handleAck :: packet type", type);
      switch (type) {
        case "pubcomp":
        case "puback": {
          const pubackRC = packet2.reasonCode;
          if (pubackRC && pubackRC > 0 && pubackRC !== 16) {
            err = new shared_1.ErrorWithReasonCode(`Publish error: ${exports.ReasonCodes[pubackRC]}`, pubackRC);
            client2["_removeOutgoingAndStoreMessage"](messageId, () => {
              cb(err, packet2);
            });
          } else {
            client2["_removeOutgoingAndStoreMessage"](messageId, cb);
          }
          break;
        }
        case "pubrec": {
          response = {
            cmd: "pubrel",
            qos: 2,
            messageId
          };
          const pubrecRC = packet2.reasonCode;
          if (pubrecRC && pubrecRC > 0 && pubrecRC !== 16) {
            err = new shared_1.ErrorWithReasonCode(`Publish error: ${exports.ReasonCodes[pubrecRC]}`, pubrecRC);
            client2["_removeOutgoingAndStoreMessage"](messageId, () => {
              cb(err, packet2);
            });
          } else {
            client2["_sendPacket"](response);
          }
          break;
        }
        case "suback": {
          delete client2.outgoing[messageId];
          client2.messageIdProvider.deallocate(messageId);
          const granted = packet2.granted;
          for (let grantedI = 0; grantedI < granted.length; grantedI++) {
            const subackRC = granted[grantedI];
            if ((subackRC & 128) !== 0) {
              err = new Error(`Subscribe error: ${exports.ReasonCodes[subackRC]}`);
              err.code = subackRC;
              const topics = client2.messageIdToTopic[messageId];
              if (topics) {
                topics.forEach((topic) => {
                  delete client2["_resubscribeTopics"][topic];
                });
              }
            }
          }
          delete client2.messageIdToTopic[messageId];
          client2["_invokeStoreProcessingQueue"]();
          cb(err, packet2);
          break;
        }
        case "unsuback": {
          delete client2.outgoing[messageId];
          client2.messageIdProvider.deallocate(messageId);
          client2["_invokeStoreProcessingQueue"]();
          cb(null, packet2);
          break;
        }
        default:
          client2.emit("error", new Error("unrecognized packet type"));
      }
      if (client2.disconnecting && Object.keys(client2.outgoing).length === 0) {
        client2.emit("outgoingEmpty");
      }
    };
    exports.default = handleAck;
  })(ack);
  return ack;
}
var hasRequiredAuth;
function requireAuth() {
  if (hasRequiredAuth) return auth;
  hasRequiredAuth = 1;
  Object.defineProperty(auth, "__esModule", { value: true });
  const shared_1 = requireShared();
  const ack_1 = requireAck();
  const handleAuth = (client2, packet2) => {
    const { options } = client2;
    const version2 = options.protocolVersion;
    const rc = version2 === 5 ? packet2.reasonCode : packet2.returnCode;
    if (version2 !== 5) {
      const err = new shared_1.ErrorWithReasonCode(`Protocol error: Auth packets are only supported in MQTT 5. Your version:${version2}`, rc);
      client2.emit("error", err);
      return;
    }
    client2.handleAuth(packet2, (err, packet22) => {
      if (err) {
        client2.emit("error", err);
        return;
      }
      if (rc === 24) {
        client2.reconnecting = false;
        client2["_sendPacket"](packet22);
      } else {
        const error = new shared_1.ErrorWithReasonCode(`Connection refused: ${ack_1.ReasonCodes[rc]}`, rc);
        client2.emit("error", error);
      }
    });
  };
  auth.default = handleAuth;
  return auth;
}
var connack = {};
var topicAliasSend = {};
var commonjs = {};
var hasRequiredCommonjs;
function requireCommonjs() {
  var _a, _constructing, _b, _c, _max, _maxSize, _dispose, _disposeAfter, _fetchMethod, _memoMethod, _size, _calculatedSize, _keyMap, _keyList, _valList, _next, _prev, _head, _tail, _free, _disposed, _sizes, _starts, _ttls, _hasDispose, _hasFetchMethod, _hasDisposeAfter, _LRUCache_instances, initializeTTLTracking_fn, _updateItemAge, _statusTTL, _setItemTTL, _isStale, initializeSizeTracking_fn, _removeItemSize, _addItemSize, _requireSize, indexes_fn, rindexes_fn, isValidIndex_fn, evict_fn, backgroundFetch_fn, isBackgroundFetch_fn, connect_fn, moveToTail_fn, delete_fn, clear_fn;
  if (hasRequiredCommonjs) return commonjs;
  hasRequiredCommonjs = 1;
  Object.defineProperty(commonjs, "__esModule", { value: true });
  commonjs.LRUCache = void 0;
  const perf = typeof performance === "object" && performance && typeof performance.now === "function" ? performance : Date;
  const warned = /* @__PURE__ */ new Set();
  const PROCESS = typeof process === "object" && !!process ? process : {};
  const emitWarning = (msg, type, code, fn) => {
    typeof PROCESS.emitWarning === "function" ? PROCESS.emitWarning(msg, type, code, fn) : console.error(`[${code}] ${type}: ${msg}`);
  };
  let AC = globalThis.AbortController;
  let AS = globalThis.AbortSignal;
  if (typeof AC === "undefined") {
    AS = class AbortSignal {
      constructor() {
        __publicField(this, "onabort");
        __publicField(this, "_onabort", []);
        __publicField(this, "reason");
        __publicField(this, "aborted", false);
      }
      addEventListener(_, fn) {
        this._onabort.push(fn);
      }
    };
    AC = class AbortController {
      constructor() {
        __publicField(this, "signal", new AS());
        warnACPolyfill();
      }
      abort(reason) {
        var _a2, _b2;
        if (this.signal.aborted)
          return;
        this.signal.reason = reason;
        this.signal.aborted = true;
        for (const fn of this.signal._onabort) {
          fn(reason);
        }
        (_b2 = (_a2 = this.signal).onabort) == null ? void 0 : _b2.call(_a2, reason);
      }
    };
    let printACPolyfillWarning = ((_a = PROCESS.env) == null ? void 0 : _a.LRU_CACHE_IGNORE_AC_WARNING) !== "1";
    const warnACPolyfill = () => {
      if (!printACPolyfillWarning)
        return;
      printACPolyfillWarning = false;
      emitWarning("AbortController is not defined. If using lru-cache in node 14, load an AbortController polyfill from the `node-abort-controller` package. A minimal polyfill is provided for use by LRUCache.fetch(), but it should not be relied upon in other contexts (eg, passing it to other APIs that use AbortController/AbortSignal might have undesirable effects). You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.", "NO_ABORT_CONTROLLER", "ENOTSUP", warnACPolyfill);
    };
  }
  const shouldWarn = (code) => !warned.has(code);
  const isPosInt = (n) => n && n === Math.floor(n) && n > 0 && isFinite(n);
  const getUintArray = (max) => !isPosInt(max) ? null : max <= Math.pow(2, 8) ? Uint8Array : max <= Math.pow(2, 16) ? Uint16Array : max <= Math.pow(2, 32) ? Uint32Array : max <= Number.MAX_SAFE_INTEGER ? ZeroArray : null;
  class ZeroArray extends Array {
    constructor(size) {
      super(size);
      this.fill(0);
    }
  }
  const _Stack = class _Stack {
    constructor(max, HeapCls) {
      __publicField(this, "heap");
      __publicField(this, "length");
      if (!__privateGet(_Stack, _constructing)) {
        throw new TypeError("instantiate Stack using Stack.create(n)");
      }
      this.heap = new HeapCls(max);
      this.length = 0;
    }
    static create(max) {
      const HeapCls = getUintArray(max);
      if (!HeapCls)
        return [];
      __privateSet(_Stack, _constructing, true);
      const s = new _Stack(max, HeapCls);
      __privateSet(_Stack, _constructing, false);
      return s;
    }
    push(n) {
      this.heap[this.length++] = n;
    }
    pop() {
      return this.heap[--this.length];
    }
  };
  _constructing = new WeakMap();
  // private constructor
  __privateAdd(_Stack, _constructing, false);
  let Stack2 = _Stack;
  const _LRUCache = class _LRUCache {
    constructor(options) {
      __privateAdd(this, _LRUCache_instances);
      // options that cannot be changed without disaster
      __privateAdd(this, _max);
      __privateAdd(this, _maxSize);
      __privateAdd(this, _dispose);
      __privateAdd(this, _disposeAfter);
      __privateAdd(this, _fetchMethod);
      __privateAdd(this, _memoMethod);
      /**
       * {@link LRUCache.OptionsBase.ttl}
       */
      __publicField(this, "ttl");
      /**
       * {@link LRUCache.OptionsBase.ttlResolution}
       */
      __publicField(this, "ttlResolution");
      /**
       * {@link LRUCache.OptionsBase.ttlAutopurge}
       */
      __publicField(this, "ttlAutopurge");
      /**
       * {@link LRUCache.OptionsBase.updateAgeOnGet}
       */
      __publicField(this, "updateAgeOnGet");
      /**
       * {@link LRUCache.OptionsBase.updateAgeOnHas}
       */
      __publicField(this, "updateAgeOnHas");
      /**
       * {@link LRUCache.OptionsBase.allowStale}
       */
      __publicField(this, "allowStale");
      /**
       * {@link LRUCache.OptionsBase.noDisposeOnSet}
       */
      __publicField(this, "noDisposeOnSet");
      /**
       * {@link LRUCache.OptionsBase.noUpdateTTL}
       */
      __publicField(this, "noUpdateTTL");
      /**
       * {@link LRUCache.OptionsBase.maxEntrySize}
       */
      __publicField(this, "maxEntrySize");
      /**
       * {@link LRUCache.OptionsBase.sizeCalculation}
       */
      __publicField(this, "sizeCalculation");
      /**
       * {@link LRUCache.OptionsBase.noDeleteOnFetchRejection}
       */
      __publicField(this, "noDeleteOnFetchRejection");
      /**
       * {@link LRUCache.OptionsBase.noDeleteOnStaleGet}
       */
      __publicField(this, "noDeleteOnStaleGet");
      /**
       * {@link LRUCache.OptionsBase.allowStaleOnFetchAbort}
       */
      __publicField(this, "allowStaleOnFetchAbort");
      /**
       * {@link LRUCache.OptionsBase.allowStaleOnFetchRejection}
       */
      __publicField(this, "allowStaleOnFetchRejection");
      /**
       * {@link LRUCache.OptionsBase.ignoreFetchAbort}
       */
      __publicField(this, "ignoreFetchAbort");
      // computed properties
      __privateAdd(this, _size);
      __privateAdd(this, _calculatedSize);
      __privateAdd(this, _keyMap);
      __privateAdd(this, _keyList);
      __privateAdd(this, _valList);
      __privateAdd(this, _next);
      __privateAdd(this, _prev);
      __privateAdd(this, _head);
      __privateAdd(this, _tail);
      __privateAdd(this, _free);
      __privateAdd(this, _disposed);
      __privateAdd(this, _sizes);
      __privateAdd(this, _starts);
      __privateAdd(this, _ttls);
      __privateAdd(this, _hasDispose);
      __privateAdd(this, _hasFetchMethod);
      __privateAdd(this, _hasDisposeAfter);
      // conditionally set private methods related to TTL
      __privateAdd(this, _updateItemAge, () => {
      });
      __privateAdd(this, _statusTTL, () => {
      });
      __privateAdd(this, _setItemTTL, () => {
      });
      /* c8 ignore stop */
      __privateAdd(this, _isStale, () => false);
      __privateAdd(this, _removeItemSize, (_i) => {
      });
      __privateAdd(this, _addItemSize, (_i, _s, _st) => {
      });
      __privateAdd(this, _requireSize, (_k, _v, size, sizeCalculation) => {
        if (size || sizeCalculation) {
          throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
        }
        return 0;
      });
      /**
       * A String value that is used in the creation of the default string
       * description of an object. Called by the built-in method
       * `Object.prototype.toString`.
       */
      __publicField(this, _b, "LRUCache");
      const { max = 0, ttl, ttlResolution = 1, ttlAutopurge, updateAgeOnGet, updateAgeOnHas, allowStale, dispose, disposeAfter, noDisposeOnSet, noUpdateTTL, maxSize = 0, maxEntrySize = 0, sizeCalculation, fetchMethod, memoMethod, noDeleteOnFetchRejection, noDeleteOnStaleGet, allowStaleOnFetchRejection, allowStaleOnFetchAbort, ignoreFetchAbort } = options;
      if (max !== 0 && !isPosInt(max)) {
        throw new TypeError("max option must be a nonnegative integer");
      }
      const UintArray = max ? getUintArray(max) : Array;
      if (!UintArray) {
        throw new Error("invalid max value: " + max);
      }
      __privateSet(this, _max, max);
      __privateSet(this, _maxSize, maxSize);
      this.maxEntrySize = maxEntrySize || __privateGet(this, _maxSize);
      this.sizeCalculation = sizeCalculation;
      if (this.sizeCalculation) {
        if (!__privateGet(this, _maxSize) && !this.maxEntrySize) {
          throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
        }
        if (typeof this.sizeCalculation !== "function") {
          throw new TypeError("sizeCalculation set to non-function");
        }
      }
      if (memoMethod !== void 0 && typeof memoMethod !== "function") {
        throw new TypeError("memoMethod must be a function if defined");
      }
      __privateSet(this, _memoMethod, memoMethod);
      if (fetchMethod !== void 0 && typeof fetchMethod !== "function") {
        throw new TypeError("fetchMethod must be a function if specified");
      }
      __privateSet(this, _fetchMethod, fetchMethod);
      __privateSet(this, _hasFetchMethod, !!fetchMethod);
      __privateSet(this, _keyMap, /* @__PURE__ */ new Map());
      __privateSet(this, _keyList, new Array(max).fill(void 0));
      __privateSet(this, _valList, new Array(max).fill(void 0));
      __privateSet(this, _next, new UintArray(max));
      __privateSet(this, _prev, new UintArray(max));
      __privateSet(this, _head, 0);
      __privateSet(this, _tail, 0);
      __privateSet(this, _free, Stack2.create(max));
      __privateSet(this, _size, 0);
      __privateSet(this, _calculatedSize, 0);
      if (typeof dispose === "function") {
        __privateSet(this, _dispose, dispose);
      }
      if (typeof disposeAfter === "function") {
        __privateSet(this, _disposeAfter, disposeAfter);
        __privateSet(this, _disposed, []);
      } else {
        __privateSet(this, _disposeAfter, void 0);
        __privateSet(this, _disposed, void 0);
      }
      __privateSet(this, _hasDispose, !!__privateGet(this, _dispose));
      __privateSet(this, _hasDisposeAfter, !!__privateGet(this, _disposeAfter));
      this.noDisposeOnSet = !!noDisposeOnSet;
      this.noUpdateTTL = !!noUpdateTTL;
      this.noDeleteOnFetchRejection = !!noDeleteOnFetchRejection;
      this.allowStaleOnFetchRejection = !!allowStaleOnFetchRejection;
      this.allowStaleOnFetchAbort = !!allowStaleOnFetchAbort;
      this.ignoreFetchAbort = !!ignoreFetchAbort;
      if (this.maxEntrySize !== 0) {
        if (__privateGet(this, _maxSize) !== 0) {
          if (!isPosInt(__privateGet(this, _maxSize))) {
            throw new TypeError("maxSize must be a positive integer if specified");
          }
        }
        if (!isPosInt(this.maxEntrySize)) {
          throw new TypeError("maxEntrySize must be a positive integer if specified");
        }
        __privateMethod(this, _LRUCache_instances, initializeSizeTracking_fn).call(this);
      }
      this.allowStale = !!allowStale;
      this.noDeleteOnStaleGet = !!noDeleteOnStaleGet;
      this.updateAgeOnGet = !!updateAgeOnGet;
      this.updateAgeOnHas = !!updateAgeOnHas;
      this.ttlResolution = isPosInt(ttlResolution) || ttlResolution === 0 ? ttlResolution : 1;
      this.ttlAutopurge = !!ttlAutopurge;
      this.ttl = ttl || 0;
      if (this.ttl) {
        if (!isPosInt(this.ttl)) {
          throw new TypeError("ttl must be a positive integer if specified");
        }
        __privateMethod(this, _LRUCache_instances, initializeTTLTracking_fn).call(this);
      }
      if (__privateGet(this, _max) === 0 && this.ttl === 0 && __privateGet(this, _maxSize) === 0) {
        throw new TypeError("At least one of max, maxSize, or ttl is required");
      }
      if (!this.ttlAutopurge && !__privateGet(this, _max) && !__privateGet(this, _maxSize)) {
        const code = "LRU_CACHE_UNBOUNDED";
        if (shouldWarn(code)) {
          warned.add(code);
          const msg = "TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.";
          emitWarning(msg, "UnboundedCacheWarning", code, _LRUCache);
        }
      }
    }
    /**
     * Do not call this method unless you need to inspect the
     * inner workings of the cache.  If anything returned by this
     * object is modified in any way, strange breakage may occur.
     *
     * These fields are private for a reason!
     *
     * @internal
     */
    static unsafeExposeInternals(c) {
      return {
        // properties
        starts: __privateGet(c, _starts),
        ttls: __privateGet(c, _ttls),
        sizes: __privateGet(c, _sizes),
        keyMap: __privateGet(c, _keyMap),
        keyList: __privateGet(c, _keyList),
        valList: __privateGet(c, _valList),
        next: __privateGet(c, _next),
        prev: __privateGet(c, _prev),
        get head() {
          return __privateGet(c, _head);
        },
        get tail() {
          return __privateGet(c, _tail);
        },
        free: __privateGet(c, _free),
        // methods
        isBackgroundFetch: (p) => {
          var _a2;
          return __privateMethod(_a2 = c, _LRUCache_instances, isBackgroundFetch_fn).call(_a2, p);
        },
        backgroundFetch: (k, index, options, context) => {
          var _a2;
          return __privateMethod(_a2 = c, _LRUCache_instances, backgroundFetch_fn).call(_a2, k, index, options, context);
        },
        moveToTail: (index) => {
          var _a2;
          return __privateMethod(_a2 = c, _LRUCache_instances, moveToTail_fn).call(_a2, index);
        },
        indexes: (options) => {
          var _a2;
          return __privateMethod(_a2 = c, _LRUCache_instances, indexes_fn).call(_a2, options);
        },
        rindexes: (options) => {
          var _a2;
          return __privateMethod(_a2 = c, _LRUCache_instances, rindexes_fn).call(_a2, options);
        },
        isStale: (index) => {
          var _a2;
          return __privateGet(_a2 = c, _isStale).call(_a2, index);
        }
      };
    }
    // Protected read-only members
    /**
     * {@link LRUCache.OptionsBase.max} (read-only)
     */
    get max() {
      return __privateGet(this, _max);
    }
    /**
     * {@link LRUCache.OptionsBase.maxSize} (read-only)
     */
    get maxSize() {
      return __privateGet(this, _maxSize);
    }
    /**
     * The total computed size of items in the cache (read-only)
     */
    get calculatedSize() {
      return __privateGet(this, _calculatedSize);
    }
    /**
     * The number of items stored in the cache (read-only)
     */
    get size() {
      return __privateGet(this, _size);
    }
    /**
     * {@link LRUCache.OptionsBase.fetchMethod} (read-only)
     */
    get fetchMethod() {
      return __privateGet(this, _fetchMethod);
    }
    get memoMethod() {
      return __privateGet(this, _memoMethod);
    }
    /**
     * {@link LRUCache.OptionsBase.dispose} (read-only)
     */
    get dispose() {
      return __privateGet(this, _dispose);
    }
    /**
     * {@link LRUCache.OptionsBase.disposeAfter} (read-only)
     */
    get disposeAfter() {
      return __privateGet(this, _disposeAfter);
    }
    /**
     * Return the number of ms left in the item's TTL. If item is not in cache,
     * returns `0`. Returns `Infinity` if item is in cache without a defined TTL.
     */
    getRemainingTTL(key) {
      return __privateGet(this, _keyMap).has(key) ? Infinity : 0;
    }
    /**
     * Return a generator yielding `[key, value]` pairs,
     * in order from most recently used to least recently used.
     */
    *entries() {
      for (const i of __privateMethod(this, _LRUCache_instances, indexes_fn).call(this)) {
        if (__privateGet(this, _valList)[i] !== void 0 && __privateGet(this, _keyList)[i] !== void 0 && !__privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, __privateGet(this, _valList)[i])) {
          yield [__privateGet(this, _keyList)[i], __privateGet(this, _valList)[i]];
        }
      }
    }
    /**
     * Inverse order version of {@link LRUCache.entries}
     *
     * Return a generator yielding `[key, value]` pairs,
     * in order from least recently used to most recently used.
     */
    *rentries() {
      for (const i of __privateMethod(this, _LRUCache_instances, rindexes_fn).call(this)) {
        if (__privateGet(this, _valList)[i] !== void 0 && __privateGet(this, _keyList)[i] !== void 0 && !__privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, __privateGet(this, _valList)[i])) {
          yield [__privateGet(this, _keyList)[i], __privateGet(this, _valList)[i]];
        }
      }
    }
    /**
     * Return a generator yielding the keys in the cache,
     * in order from most recently used to least recently used.
     */
    *keys() {
      for (const i of __privateMethod(this, _LRUCache_instances, indexes_fn).call(this)) {
        const k = __privateGet(this, _keyList)[i];
        if (k !== void 0 && !__privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, __privateGet(this, _valList)[i])) {
          yield k;
        }
      }
    }
    /**
     * Inverse order version of {@link LRUCache.keys}
     *
     * Return a generator yielding the keys in the cache,
     * in order from least recently used to most recently used.
     */
    *rkeys() {
      for (const i of __privateMethod(this, _LRUCache_instances, rindexes_fn).call(this)) {
        const k = __privateGet(this, _keyList)[i];
        if (k !== void 0 && !__privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, __privateGet(this, _valList)[i])) {
          yield k;
        }
      }
    }
    /**
     * Return a generator yielding the values in the cache,
     * in order from most recently used to least recently used.
     */
    *values() {
      for (const i of __privateMethod(this, _LRUCache_instances, indexes_fn).call(this)) {
        const v = __privateGet(this, _valList)[i];
        if (v !== void 0 && !__privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, __privateGet(this, _valList)[i])) {
          yield __privateGet(this, _valList)[i];
        }
      }
    }
    /**
     * Inverse order version of {@link LRUCache.values}
     *
     * Return a generator yielding the values in the cache,
     * in order from least recently used to most recently used.
     */
    *rvalues() {
      for (const i of __privateMethod(this, _LRUCache_instances, rindexes_fn).call(this)) {
        const v = __privateGet(this, _valList)[i];
        if (v !== void 0 && !__privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, __privateGet(this, _valList)[i])) {
          yield __privateGet(this, _valList)[i];
        }
      }
    }
    /**
     * Iterating over the cache itself yields the same results as
     * {@link LRUCache.entries}
     */
    [(_c = Symbol.iterator, _b = Symbol.toStringTag, _c)]() {
      return this.entries();
    }
    /**
     * Find a value for which the supplied fn method returns a truthy value,
     * similar to `Array.find()`. fn is called as `fn(value, key, cache)`.
     */
    find(fn, getOptions = {}) {
      for (const i of __privateMethod(this, _LRUCache_instances, indexes_fn).call(this)) {
        const v = __privateGet(this, _valList)[i];
        const value = __privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, v) ? v.__staleWhileFetching : v;
        if (value === void 0)
          continue;
        if (fn(value, __privateGet(this, _keyList)[i], this)) {
          return this.get(__privateGet(this, _keyList)[i], getOptions);
        }
      }
    }
    /**
     * Call the supplied function on each item in the cache, in order from most
     * recently used to least recently used.
     *
     * `fn` is called as `fn(value, key, cache)`.
     *
     * If `thisp` is provided, function will be called in the `this`-context of
     * the provided object, or the cache if no `thisp` object is provided.
     *
     * Does not update age or recenty of use, or iterate over stale values.
     */
    forEach(fn, thisp = this) {
      for (const i of __privateMethod(this, _LRUCache_instances, indexes_fn).call(this)) {
        const v = __privateGet(this, _valList)[i];
        const value = __privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, v) ? v.__staleWhileFetching : v;
        if (value === void 0)
          continue;
        fn.call(thisp, value, __privateGet(this, _keyList)[i], this);
      }
    }
    /**
     * The same as {@link LRUCache.forEach} but items are iterated over in
     * reverse order.  (ie, less recently used items are iterated over first.)
     */
    rforEach(fn, thisp = this) {
      for (const i of __privateMethod(this, _LRUCache_instances, rindexes_fn).call(this)) {
        const v = __privateGet(this, _valList)[i];
        const value = __privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, v) ? v.__staleWhileFetching : v;
        if (value === void 0)
          continue;
        fn.call(thisp, value, __privateGet(this, _keyList)[i], this);
      }
    }
    /**
     * Delete any stale entries. Returns true if anything was removed,
     * false otherwise.
     */
    purgeStale() {
      let deleted = false;
      for (const i of __privateMethod(this, _LRUCache_instances, rindexes_fn).call(this, { allowStale: true })) {
        if (__privateGet(this, _isStale).call(this, i)) {
          __privateMethod(this, _LRUCache_instances, delete_fn).call(this, __privateGet(this, _keyList)[i], "expire");
          deleted = true;
        }
      }
      return deleted;
    }
    /**
     * Get the extended info about a given entry, to get its value, size, and
     * TTL info simultaneously. Returns `undefined` if the key is not present.
     *
     * Unlike {@link LRUCache#dump}, which is designed to be portable and survive
     * serialization, the `start` value is always the current timestamp, and the
     * `ttl` is a calculated remaining time to live (negative if expired).
     *
     * Always returns stale values, if their info is found in the cache, so be
     * sure to check for expirations (ie, a negative {@link LRUCache.Entry#ttl})
     * if relevant.
     */
    info(key) {
      const i = __privateGet(this, _keyMap).get(key);
      if (i === void 0)
        return void 0;
      const v = __privateGet(this, _valList)[i];
      const value = __privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, v) ? v.__staleWhileFetching : v;
      if (value === void 0)
        return void 0;
      const entry = { value };
      if (__privateGet(this, _ttls) && __privateGet(this, _starts)) {
        const ttl = __privateGet(this, _ttls)[i];
        const start = __privateGet(this, _starts)[i];
        if (ttl && start) {
          const remain = ttl - (perf.now() - start);
          entry.ttl = remain;
          entry.start = Date.now();
        }
      }
      if (__privateGet(this, _sizes)) {
        entry.size = __privateGet(this, _sizes)[i];
      }
      return entry;
    }
    /**
     * Return an array of [key, {@link LRUCache.Entry}] tuples which can be
     * passed to {@link LRLUCache#load}.
     *
     * The `start` fields are calculated relative to a portable `Date.now()`
     * timestamp, even if `performance.now()` is available.
     *
     * Stale entries are always included in the `dump`, even if
     * {@link LRUCache.OptionsBase.allowStale} is false.
     *
     * Note: this returns an actual array, not a generator, so it can be more
     * easily passed around.
     */
    dump() {
      const arr = [];
      for (const i of __privateMethod(this, _LRUCache_instances, indexes_fn).call(this, { allowStale: true })) {
        const key = __privateGet(this, _keyList)[i];
        const v = __privateGet(this, _valList)[i];
        const value = __privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, v) ? v.__staleWhileFetching : v;
        if (value === void 0 || key === void 0)
          continue;
        const entry = { value };
        if (__privateGet(this, _ttls) && __privateGet(this, _starts)) {
          entry.ttl = __privateGet(this, _ttls)[i];
          const age = perf.now() - __privateGet(this, _starts)[i];
          entry.start = Math.floor(Date.now() - age);
        }
        if (__privateGet(this, _sizes)) {
          entry.size = __privateGet(this, _sizes)[i];
        }
        arr.unshift([key, entry]);
      }
      return arr;
    }
    /**
     * Reset the cache and load in the items in entries in the order listed.
     *
     * The shape of the resulting cache may be different if the same options are
     * not used in both caches.
     *
     * The `start` fields are assumed to be calculated relative to a portable
     * `Date.now()` timestamp, even if `performance.now()` is available.
     */
    load(arr) {
      this.clear();
      for (const [key, entry] of arr) {
        if (entry.start) {
          const age = Date.now() - entry.start;
          entry.start = perf.now() - age;
        }
        this.set(key, entry.value, entry);
      }
    }
    /**
     * Add a value to the cache.
     *
     * Note: if `undefined` is specified as a value, this is an alias for
     * {@link LRUCache#delete}
     *
     * Fields on the {@link LRUCache.SetOptions} options param will override
     * their corresponding values in the constructor options for the scope
     * of this single `set()` operation.
     *
     * If `start` is provided, then that will set the effective start
     * time for the TTL calculation. Note that this must be a previous
     * value of `performance.now()` if supported, or a previous value of
     * `Date.now()` if not.
     *
     * Options object may also include `size`, which will prevent
     * calling the `sizeCalculation` function and just use the specified
     * number if it is a positive integer, and `noDisposeOnSet` which
     * will prevent calling a `dispose` function in the case of
     * overwrites.
     *
     * If the `size` (or return value of `sizeCalculation`) for a given
     * entry is greater than `maxEntrySize`, then the item will not be
     * added to the cache.
     *
     * Will update the recency of the entry.
     *
     * If the value is `undefined`, then this is an alias for
     * `cache.delete(key)`. `undefined` is never stored in the cache.
     */
    set(k, v, setOptions = {}) {
      var _a2, _b2, _c2, _d, _e;
      if (v === void 0) {
        this.delete(k);
        return this;
      }
      const { ttl = this.ttl, start, noDisposeOnSet = this.noDisposeOnSet, sizeCalculation = this.sizeCalculation, status } = setOptions;
      let { noUpdateTTL = this.noUpdateTTL } = setOptions;
      const size = __privateGet(this, _requireSize).call(this, k, v, setOptions.size || 0, sizeCalculation);
      if (this.maxEntrySize && size > this.maxEntrySize) {
        if (status) {
          status.set = "miss";
          status.maxEntrySizeExceeded = true;
        }
        __privateMethod(this, _LRUCache_instances, delete_fn).call(this, k, "set");
        return this;
      }
      let index = __privateGet(this, _size) === 0 ? void 0 : __privateGet(this, _keyMap).get(k);
      if (index === void 0) {
        index = __privateGet(this, _size) === 0 ? __privateGet(this, _tail) : __privateGet(this, _free).length !== 0 ? __privateGet(this, _free).pop() : __privateGet(this, _size) === __privateGet(this, _max) ? __privateMethod(this, _LRUCache_instances, evict_fn).call(this, false) : __privateGet(this, _size);
        __privateGet(this, _keyList)[index] = k;
        __privateGet(this, _valList)[index] = v;
        __privateGet(this, _keyMap).set(k, index);
        __privateGet(this, _next)[__privateGet(this, _tail)] = index;
        __privateGet(this, _prev)[index] = __privateGet(this, _tail);
        __privateSet(this, _tail, index);
        __privateWrapper(this, _size)._++;
        __privateGet(this, _addItemSize).call(this, index, size, status);
        if (status)
          status.set = "add";
        noUpdateTTL = false;
      } else {
        __privateMethod(this, _LRUCache_instances, moveToTail_fn).call(this, index);
        const oldVal = __privateGet(this, _valList)[index];
        if (v !== oldVal) {
          if (__privateGet(this, _hasFetchMethod) && __privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, oldVal)) {
            oldVal.__abortController.abort(new Error("replaced"));
            const { __staleWhileFetching: s } = oldVal;
            if (s !== void 0 && !noDisposeOnSet) {
              if (__privateGet(this, _hasDispose)) {
                (_a2 = __privateGet(this, _dispose)) == null ? void 0 : _a2.call(this, s, k, "set");
              }
              if (__privateGet(this, _hasDisposeAfter)) {
                (_b2 = __privateGet(this, _disposed)) == null ? void 0 : _b2.push([s, k, "set"]);
              }
            }
          } else if (!noDisposeOnSet) {
            if (__privateGet(this, _hasDispose)) {
              (_c2 = __privateGet(this, _dispose)) == null ? void 0 : _c2.call(this, oldVal, k, "set");
            }
            if (__privateGet(this, _hasDisposeAfter)) {
              (_d = __privateGet(this, _disposed)) == null ? void 0 : _d.push([oldVal, k, "set"]);
            }
          }
          __privateGet(this, _removeItemSize).call(this, index);
          __privateGet(this, _addItemSize).call(this, index, size, status);
          __privateGet(this, _valList)[index] = v;
          if (status) {
            status.set = "replace";
            const oldValue = oldVal && __privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, oldVal) ? oldVal.__staleWhileFetching : oldVal;
            if (oldValue !== void 0)
              status.oldValue = oldValue;
          }
        } else if (status) {
          status.set = "update";
        }
      }
      if (ttl !== 0 && !__privateGet(this, _ttls)) {
        __privateMethod(this, _LRUCache_instances, initializeTTLTracking_fn).call(this);
      }
      if (__privateGet(this, _ttls)) {
        if (!noUpdateTTL) {
          __privateGet(this, _setItemTTL).call(this, index, ttl, start);
        }
        if (status)
          __privateGet(this, _statusTTL).call(this, status, index);
      }
      if (!noDisposeOnSet && __privateGet(this, _hasDisposeAfter) && __privateGet(this, _disposed)) {
        const dt = __privateGet(this, _disposed);
        let task;
        while (task = dt == null ? void 0 : dt.shift()) {
          (_e = __privateGet(this, _disposeAfter)) == null ? void 0 : _e.call(this, ...task);
        }
      }
      return this;
    }
    /**
     * Evict the least recently used item, returning its value or
     * `undefined` if cache is empty.
     */
    pop() {
      var _a2;
      try {
        while (__privateGet(this, _size)) {
          const val = __privateGet(this, _valList)[__privateGet(this, _head)];
          __privateMethod(this, _LRUCache_instances, evict_fn).call(this, true);
          if (__privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, val)) {
            if (val.__staleWhileFetching) {
              return val.__staleWhileFetching;
            }
          } else if (val !== void 0) {
            return val;
          }
        }
      } finally {
        if (__privateGet(this, _hasDisposeAfter) && __privateGet(this, _disposed)) {
          const dt = __privateGet(this, _disposed);
          let task;
          while (task = dt == null ? void 0 : dt.shift()) {
            (_a2 = __privateGet(this, _disposeAfter)) == null ? void 0 : _a2.call(this, ...task);
          }
        }
      }
    }
    /**
     * Check if a key is in the cache, without updating the recency of use.
     * Will return false if the item is stale, even though it is technically
     * in the cache.
     *
     * Check if a key is in the cache, without updating the recency of
     * use. Age is updated if {@link LRUCache.OptionsBase.updateAgeOnHas} is set
     * to `true` in either the options or the constructor.
     *
     * Will return `false` if the item is stale, even though it is technically in
     * the cache. The difference can be determined (if it matters) by using a
     * `status` argument, and inspecting the `has` field.
     *
     * Will not update item age unless
     * {@link LRUCache.OptionsBase.updateAgeOnHas} is set.
     */
    has(k, hasOptions = {}) {
      const { updateAgeOnHas = this.updateAgeOnHas, status } = hasOptions;
      const index = __privateGet(this, _keyMap).get(k);
      if (index !== void 0) {
        const v = __privateGet(this, _valList)[index];
        if (__privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, v) && v.__staleWhileFetching === void 0) {
          return false;
        }
        if (!__privateGet(this, _isStale).call(this, index)) {
          if (updateAgeOnHas) {
            __privateGet(this, _updateItemAge).call(this, index);
          }
          if (status) {
            status.has = "hit";
            __privateGet(this, _statusTTL).call(this, status, index);
          }
          return true;
        } else if (status) {
          status.has = "stale";
          __privateGet(this, _statusTTL).call(this, status, index);
        }
      } else if (status) {
        status.has = "miss";
      }
      return false;
    }
    /**
     * Like {@link LRUCache#get} but doesn't update recency or delete stale
     * items.
     *
     * Returns `undefined` if the item is stale, unless
     * {@link LRUCache.OptionsBase.allowStale} is set.
     */
    peek(k, peekOptions = {}) {
      const { allowStale = this.allowStale } = peekOptions;
      const index = __privateGet(this, _keyMap).get(k);
      if (index === void 0 || !allowStale && __privateGet(this, _isStale).call(this, index)) {
        return;
      }
      const v = __privateGet(this, _valList)[index];
      return __privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, v) ? v.__staleWhileFetching : v;
    }
    async fetch(k, fetchOptions = {}) {
      const {
        // get options
        allowStale = this.allowStale,
        updateAgeOnGet = this.updateAgeOnGet,
        noDeleteOnStaleGet = this.noDeleteOnStaleGet,
        // set options
        ttl = this.ttl,
        noDisposeOnSet = this.noDisposeOnSet,
        size = 0,
        sizeCalculation = this.sizeCalculation,
        noUpdateTTL = this.noUpdateTTL,
        // fetch exclusive options
        noDeleteOnFetchRejection = this.noDeleteOnFetchRejection,
        allowStaleOnFetchRejection = this.allowStaleOnFetchRejection,
        ignoreFetchAbort = this.ignoreFetchAbort,
        allowStaleOnFetchAbort = this.allowStaleOnFetchAbort,
        context,
        forceRefresh = false,
        status,
        signal
      } = fetchOptions;
      if (!__privateGet(this, _hasFetchMethod)) {
        if (status)
          status.fetch = "get";
        return this.get(k, {
          allowStale,
          updateAgeOnGet,
          noDeleteOnStaleGet,
          status
        });
      }
      const options = {
        allowStale,
        updateAgeOnGet,
        noDeleteOnStaleGet,
        ttl,
        noDisposeOnSet,
        size,
        sizeCalculation,
        noUpdateTTL,
        noDeleteOnFetchRejection,
        allowStaleOnFetchRejection,
        allowStaleOnFetchAbort,
        ignoreFetchAbort,
        status,
        signal
      };
      let index = __privateGet(this, _keyMap).get(k);
      if (index === void 0) {
        if (status)
          status.fetch = "miss";
        const p = __privateMethod(this, _LRUCache_instances, backgroundFetch_fn).call(this, k, index, options, context);
        return p.__returned = p;
      } else {
        const v = __privateGet(this, _valList)[index];
        if (__privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, v)) {
          const stale = allowStale && v.__staleWhileFetching !== void 0;
          if (status) {
            status.fetch = "inflight";
            if (stale)
              status.returnedStale = true;
          }
          return stale ? v.__staleWhileFetching : v.__returned = v;
        }
        const isStale = __privateGet(this, _isStale).call(this, index);
        if (!forceRefresh && !isStale) {
          if (status)
            status.fetch = "hit";
          __privateMethod(this, _LRUCache_instances, moveToTail_fn).call(this, index);
          if (updateAgeOnGet) {
            __privateGet(this, _updateItemAge).call(this, index);
          }
          if (status)
            __privateGet(this, _statusTTL).call(this, status, index);
          return v;
        }
        const p = __privateMethod(this, _LRUCache_instances, backgroundFetch_fn).call(this, k, index, options, context);
        const hasStale = p.__staleWhileFetching !== void 0;
        const staleVal = hasStale && allowStale;
        if (status) {
          status.fetch = isStale ? "stale" : "refresh";
          if (staleVal && isStale)
            status.returnedStale = true;
        }
        return staleVal ? p.__staleWhileFetching : p.__returned = p;
      }
    }
    async forceFetch(k, fetchOptions = {}) {
      const v = await this.fetch(k, fetchOptions);
      if (v === void 0)
        throw new Error("fetch() returned undefined");
      return v;
    }
    memo(k, memoOptions = {}) {
      const memoMethod = __privateGet(this, _memoMethod);
      if (!memoMethod) {
        throw new Error("no memoMethod provided to constructor");
      }
      const { context, forceRefresh, ...options } = memoOptions;
      const v = this.get(k, options);
      if (!forceRefresh && v !== void 0)
        return v;
      const vv = memoMethod(k, v, {
        options,
        context
      });
      this.set(k, vv, options);
      return vv;
    }
    /**
     * Return a value from the cache. Will update the recency of the cache
     * entry found.
     *
     * If the key is not found, get() will return `undefined`.
     */
    get(k, getOptions = {}) {
      const { allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, status } = getOptions;
      const index = __privateGet(this, _keyMap).get(k);
      if (index !== void 0) {
        const value = __privateGet(this, _valList)[index];
        const fetching = __privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, value);
        if (status)
          __privateGet(this, _statusTTL).call(this, status, index);
        if (__privateGet(this, _isStale).call(this, index)) {
          if (status)
            status.get = "stale";
          if (!fetching) {
            if (!noDeleteOnStaleGet) {
              __privateMethod(this, _LRUCache_instances, delete_fn).call(this, k, "expire");
            }
            if (status && allowStale)
              status.returnedStale = true;
            return allowStale ? value : void 0;
          } else {
            if (status && allowStale && value.__staleWhileFetching !== void 0) {
              status.returnedStale = true;
            }
            return allowStale ? value.__staleWhileFetching : void 0;
          }
        } else {
          if (status)
            status.get = "hit";
          if (fetching) {
            return value.__staleWhileFetching;
          }
          __privateMethod(this, _LRUCache_instances, moveToTail_fn).call(this, index);
          if (updateAgeOnGet) {
            __privateGet(this, _updateItemAge).call(this, index);
          }
          return value;
        }
      } else if (status) {
        status.get = "miss";
      }
    }
    /**
     * Deletes a key out of the cache.
     *
     * Returns true if the key was deleted, false otherwise.
     */
    delete(k) {
      return __privateMethod(this, _LRUCache_instances, delete_fn).call(this, k, "delete");
    }
    /**
     * Clear the cache entirely, throwing away all values.
     */
    clear() {
      return __privateMethod(this, _LRUCache_instances, clear_fn).call(this, "delete");
    }
  };
  _max = new WeakMap();
  _maxSize = new WeakMap();
  _dispose = new WeakMap();
  _disposeAfter = new WeakMap();
  _fetchMethod = new WeakMap();
  _memoMethod = new WeakMap();
  _size = new WeakMap();
  _calculatedSize = new WeakMap();
  _keyMap = new WeakMap();
  _keyList = new WeakMap();
  _valList = new WeakMap();
  _next = new WeakMap();
  _prev = new WeakMap();
  _head = new WeakMap();
  _tail = new WeakMap();
  _free = new WeakMap();
  _disposed = new WeakMap();
  _sizes = new WeakMap();
  _starts = new WeakMap();
  _ttls = new WeakMap();
  _hasDispose = new WeakMap();
  _hasFetchMethod = new WeakMap();
  _hasDisposeAfter = new WeakMap();
  _LRUCache_instances = new WeakSet();
  initializeTTLTracking_fn = function() {
    const ttls = new ZeroArray(__privateGet(this, _max));
    const starts = new ZeroArray(__privateGet(this, _max));
    __privateSet(this, _ttls, ttls);
    __privateSet(this, _starts, starts);
    __privateSet(this, _setItemTTL, (index, ttl, start = perf.now()) => {
      starts[index] = ttl !== 0 ? start : 0;
      ttls[index] = ttl;
      if (ttl !== 0 && this.ttlAutopurge) {
        const t = setTimeout(() => {
          if (__privateGet(this, _isStale).call(this, index)) {
            __privateMethod(this, _LRUCache_instances, delete_fn).call(this, __privateGet(this, _keyList)[index], "expire");
          }
        }, ttl + 1);
        if (t.unref) {
          t.unref();
        }
      }
    });
    __privateSet(this, _updateItemAge, (index) => {
      starts[index] = ttls[index] !== 0 ? perf.now() : 0;
    });
    __privateSet(this, _statusTTL, (status, index) => {
      if (ttls[index]) {
        const ttl = ttls[index];
        const start = starts[index];
        if (!ttl || !start)
          return;
        status.ttl = ttl;
        status.start = start;
        status.now = cachedNow || getNow();
        const age = status.now - start;
        status.remainingTTL = ttl - age;
      }
    });
    let cachedNow = 0;
    const getNow = () => {
      const n = perf.now();
      if (this.ttlResolution > 0) {
        cachedNow = n;
        const t = setTimeout(() => cachedNow = 0, this.ttlResolution);
        if (t.unref) {
          t.unref();
        }
      }
      return n;
    };
    this.getRemainingTTL = (key) => {
      const index = __privateGet(this, _keyMap).get(key);
      if (index === void 0) {
        return 0;
      }
      const ttl = ttls[index];
      const start = starts[index];
      if (!ttl || !start) {
        return Infinity;
      }
      const age = (cachedNow || getNow()) - start;
      return ttl - age;
    };
    __privateSet(this, _isStale, (index) => {
      const s = starts[index];
      const t = ttls[index];
      return !!t && !!s && (cachedNow || getNow()) - s > t;
    });
  };
  _updateItemAge = new WeakMap();
  _statusTTL = new WeakMap();
  _setItemTTL = new WeakMap();
  _isStale = new WeakMap();
  initializeSizeTracking_fn = function() {
    const sizes = new ZeroArray(__privateGet(this, _max));
    __privateSet(this, _calculatedSize, 0);
    __privateSet(this, _sizes, sizes);
    __privateSet(this, _removeItemSize, (index) => {
      __privateSet(this, _calculatedSize, __privateGet(this, _calculatedSize) - sizes[index]);
      sizes[index] = 0;
    });
    __privateSet(this, _requireSize, (k, v, size, sizeCalculation) => {
      if (__privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, v)) {
        return 0;
      }
      if (!isPosInt(size)) {
        if (sizeCalculation) {
          if (typeof sizeCalculation !== "function") {
            throw new TypeError("sizeCalculation must be a function");
          }
          size = sizeCalculation(v, k);
          if (!isPosInt(size)) {
            throw new TypeError("sizeCalculation return invalid (expect positive integer)");
          }
        } else {
          throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
        }
      }
      return size;
    });
    __privateSet(this, _addItemSize, (index, size, status) => {
      sizes[index] = size;
      if (__privateGet(this, _maxSize)) {
        const maxSize = __privateGet(this, _maxSize) - sizes[index];
        while (__privateGet(this, _calculatedSize) > maxSize) {
          __privateMethod(this, _LRUCache_instances, evict_fn).call(this, true);
        }
      }
      __privateSet(this, _calculatedSize, __privateGet(this, _calculatedSize) + sizes[index]);
      if (status) {
        status.entrySize = size;
        status.totalCalculatedSize = __privateGet(this, _calculatedSize);
      }
    });
  };
  _removeItemSize = new WeakMap();
  _addItemSize = new WeakMap();
  _requireSize = new WeakMap();
  indexes_fn = function* ({ allowStale = this.allowStale } = {}) {
    if (__privateGet(this, _size)) {
      for (let i = __privateGet(this, _tail); true; ) {
        if (!__privateMethod(this, _LRUCache_instances, isValidIndex_fn).call(this, i)) {
          break;
        }
        if (allowStale || !__privateGet(this, _isStale).call(this, i)) {
          yield i;
        }
        if (i === __privateGet(this, _head)) {
          break;
        } else {
          i = __privateGet(this, _prev)[i];
        }
      }
    }
  };
  rindexes_fn = function* ({ allowStale = this.allowStale } = {}) {
    if (__privateGet(this, _size)) {
      for (let i = __privateGet(this, _head); true; ) {
        if (!__privateMethod(this, _LRUCache_instances, isValidIndex_fn).call(this, i)) {
          break;
        }
        if (allowStale || !__privateGet(this, _isStale).call(this, i)) {
          yield i;
        }
        if (i === __privateGet(this, _tail)) {
          break;
        } else {
          i = __privateGet(this, _next)[i];
        }
      }
    }
  };
  isValidIndex_fn = function(index) {
    return index !== void 0 && __privateGet(this, _keyMap).get(__privateGet(this, _keyList)[index]) === index;
  };
  evict_fn = function(free) {
    var _a2, _b2;
    const head = __privateGet(this, _head);
    const k = __privateGet(this, _keyList)[head];
    const v = __privateGet(this, _valList)[head];
    if (__privateGet(this, _hasFetchMethod) && __privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, v)) {
      v.__abortController.abort(new Error("evicted"));
    } else if (__privateGet(this, _hasDispose) || __privateGet(this, _hasDisposeAfter)) {
      if (__privateGet(this, _hasDispose)) {
        (_a2 = __privateGet(this, _dispose)) == null ? void 0 : _a2.call(this, v, k, "evict");
      }
      if (__privateGet(this, _hasDisposeAfter)) {
        (_b2 = __privateGet(this, _disposed)) == null ? void 0 : _b2.push([v, k, "evict"]);
      }
    }
    __privateGet(this, _removeItemSize).call(this, head);
    if (free) {
      __privateGet(this, _keyList)[head] = void 0;
      __privateGet(this, _valList)[head] = void 0;
      __privateGet(this, _free).push(head);
    }
    if (__privateGet(this, _size) === 1) {
      __privateSet(this, _head, __privateSet(this, _tail, 0));
      __privateGet(this, _free).length = 0;
    } else {
      __privateSet(this, _head, __privateGet(this, _next)[head]);
    }
    __privateGet(this, _keyMap).delete(k);
    __privateWrapper(this, _size)._--;
    return head;
  };
  backgroundFetch_fn = function(k, index, options, context) {
    const v = index === void 0 ? void 0 : __privateGet(this, _valList)[index];
    if (__privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, v)) {
      return v;
    }
    const ac = new AC();
    const { signal } = options;
    signal == null ? void 0 : signal.addEventListener("abort", () => ac.abort(signal.reason), {
      signal: ac.signal
    });
    const fetchOpts = {
      signal: ac.signal,
      options,
      context
    };
    const cb = (v2, updateCache = false) => {
      const { aborted } = ac.signal;
      const ignoreAbort = options.ignoreFetchAbort && v2 !== void 0;
      if (options.status) {
        if (aborted && !updateCache) {
          options.status.fetchAborted = true;
          options.status.fetchError = ac.signal.reason;
          if (ignoreAbort)
            options.status.fetchAbortIgnored = true;
        } else {
          options.status.fetchResolved = true;
        }
      }
      if (aborted && !ignoreAbort && !updateCache) {
        return fetchFail(ac.signal.reason);
      }
      const bf2 = p;
      if (__privateGet(this, _valList)[index] === p) {
        if (v2 === void 0) {
          if (bf2.__staleWhileFetching) {
            __privateGet(this, _valList)[index] = bf2.__staleWhileFetching;
          } else {
            __privateMethod(this, _LRUCache_instances, delete_fn).call(this, k, "fetch");
          }
        } else {
          if (options.status)
            options.status.fetchUpdated = true;
          this.set(k, v2, fetchOpts.options);
        }
      }
      return v2;
    };
    const eb = (er) => {
      if (options.status) {
        options.status.fetchRejected = true;
        options.status.fetchError = er;
      }
      return fetchFail(er);
    };
    const fetchFail = (er) => {
      const { aborted } = ac.signal;
      const allowStaleAborted = aborted && options.allowStaleOnFetchAbort;
      const allowStale = allowStaleAborted || options.allowStaleOnFetchRejection;
      const noDelete = allowStale || options.noDeleteOnFetchRejection;
      const bf2 = p;
      if (__privateGet(this, _valList)[index] === p) {
        const del = !noDelete || bf2.__staleWhileFetching === void 0;
        if (del) {
          __privateMethod(this, _LRUCache_instances, delete_fn).call(this, k, "fetch");
        } else if (!allowStaleAborted) {
          __privateGet(this, _valList)[index] = bf2.__staleWhileFetching;
        }
      }
      if (allowStale) {
        if (options.status && bf2.__staleWhileFetching !== void 0) {
          options.status.returnedStale = true;
        }
        return bf2.__staleWhileFetching;
      } else if (bf2.__returned === bf2) {
        throw er;
      }
    };
    const pcall = (res, rej) => {
      var _a2;
      const fmp = (_a2 = __privateGet(this, _fetchMethod)) == null ? void 0 : _a2.call(this, k, v, fetchOpts);
      if (fmp && fmp instanceof Promise) {
        fmp.then((v2) => res(v2 === void 0 ? void 0 : v2), rej);
      }
      ac.signal.addEventListener("abort", () => {
        if (!options.ignoreFetchAbort || options.allowStaleOnFetchAbort) {
          res(void 0);
          if (options.allowStaleOnFetchAbort) {
            res = (v2) => cb(v2, true);
          }
        }
      });
    };
    if (options.status)
      options.status.fetchDispatched = true;
    const p = new Promise(pcall).then(cb, eb);
    const bf = Object.assign(p, {
      __abortController: ac,
      __staleWhileFetching: v,
      __returned: void 0
    });
    if (index === void 0) {
      this.set(k, bf, { ...fetchOpts.options, status: void 0 });
      index = __privateGet(this, _keyMap).get(k);
    } else {
      __privateGet(this, _valList)[index] = bf;
    }
    return bf;
  };
  isBackgroundFetch_fn = function(p) {
    if (!__privateGet(this, _hasFetchMethod))
      return false;
    const b = p;
    return !!b && b instanceof Promise && b.hasOwnProperty("__staleWhileFetching") && b.__abortController instanceof AC;
  };
  connect_fn = function(p, n) {
    __privateGet(this, _prev)[n] = p;
    __privateGet(this, _next)[p] = n;
  };
  moveToTail_fn = function(index) {
    if (index !== __privateGet(this, _tail)) {
      if (index === __privateGet(this, _head)) {
        __privateSet(this, _head, __privateGet(this, _next)[index]);
      } else {
        __privateMethod(this, _LRUCache_instances, connect_fn).call(this, __privateGet(this, _prev)[index], __privateGet(this, _next)[index]);
      }
      __privateMethod(this, _LRUCache_instances, connect_fn).call(this, __privateGet(this, _tail), index);
      __privateSet(this, _tail, index);
    }
  };
  delete_fn = function(k, reason) {
    var _a2, _b2, _c2, _d;
    let deleted = false;
    if (__privateGet(this, _size) !== 0) {
      const index = __privateGet(this, _keyMap).get(k);
      if (index !== void 0) {
        deleted = true;
        if (__privateGet(this, _size) === 1) {
          __privateMethod(this, _LRUCache_instances, clear_fn).call(this, reason);
        } else {
          __privateGet(this, _removeItemSize).call(this, index);
          const v = __privateGet(this, _valList)[index];
          if (__privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, v)) {
            v.__abortController.abort(new Error("deleted"));
          } else if (__privateGet(this, _hasDispose) || __privateGet(this, _hasDisposeAfter)) {
            if (__privateGet(this, _hasDispose)) {
              (_a2 = __privateGet(this, _dispose)) == null ? void 0 : _a2.call(this, v, k, reason);
            }
            if (__privateGet(this, _hasDisposeAfter)) {
              (_b2 = __privateGet(this, _disposed)) == null ? void 0 : _b2.push([v, k, reason]);
            }
          }
          __privateGet(this, _keyMap).delete(k);
          __privateGet(this, _keyList)[index] = void 0;
          __privateGet(this, _valList)[index] = void 0;
          if (index === __privateGet(this, _tail)) {
            __privateSet(this, _tail, __privateGet(this, _prev)[index]);
          } else if (index === __privateGet(this, _head)) {
            __privateSet(this, _head, __privateGet(this, _next)[index]);
          } else {
            const pi = __privateGet(this, _prev)[index];
            __privateGet(this, _next)[pi] = __privateGet(this, _next)[index];
            const ni = __privateGet(this, _next)[index];
            __privateGet(this, _prev)[ni] = __privateGet(this, _prev)[index];
          }
          __privateWrapper(this, _size)._--;
          __privateGet(this, _free).push(index);
        }
      }
    }
    if (__privateGet(this, _hasDisposeAfter) && ((_c2 = __privateGet(this, _disposed)) == null ? void 0 : _c2.length)) {
      const dt = __privateGet(this, _disposed);
      let task;
      while (task = dt == null ? void 0 : dt.shift()) {
        (_d = __privateGet(this, _disposeAfter)) == null ? void 0 : _d.call(this, ...task);
      }
    }
    return deleted;
  };
  clear_fn = function(reason) {
    var _a2, _b2, _c2;
    for (const index of __privateMethod(this, _LRUCache_instances, rindexes_fn).call(this, { allowStale: true })) {
      const v = __privateGet(this, _valList)[index];
      if (__privateMethod(this, _LRUCache_instances, isBackgroundFetch_fn).call(this, v)) {
        v.__abortController.abort(new Error("deleted"));
      } else {
        const k = __privateGet(this, _keyList)[index];
        if (__privateGet(this, _hasDispose)) {
          (_a2 = __privateGet(this, _dispose)) == null ? void 0 : _a2.call(this, v, k, reason);
        }
        if (__privateGet(this, _hasDisposeAfter)) {
          (_b2 = __privateGet(this, _disposed)) == null ? void 0 : _b2.push([v, k, reason]);
        }
      }
    }
    __privateGet(this, _keyMap).clear();
    __privateGet(this, _valList).fill(void 0);
    __privateGet(this, _keyList).fill(void 0);
    if (__privateGet(this, _ttls) && __privateGet(this, _starts)) {
      __privateGet(this, _ttls).fill(0);
      __privateGet(this, _starts).fill(0);
    }
    if (__privateGet(this, _sizes)) {
      __privateGet(this, _sizes).fill(0);
    }
    __privateSet(this, _head, 0);
    __privateSet(this, _tail, 0);
    __privateGet(this, _free).length = 0;
    __privateSet(this, _calculatedSize, 0);
    __privateSet(this, _size, 0);
    if (__privateGet(this, _hasDisposeAfter) && __privateGet(this, _disposed)) {
      const dt = __privateGet(this, _disposed);
      let task;
      while (task = dt == null ? void 0 : dt.shift()) {
        (_c2 = __privateGet(this, _disposeAfter)) == null ? void 0 : _c2.call(this, ...task);
      }
    }
  };
  let LRUCache = _LRUCache;
  commonjs.LRUCache = LRUCache;
  return commonjs;
}
var numberAllocator$1 = {};
var __extends$g = /* @__PURE__ */ (function() {
  var extendStatics = function(n, t) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(n2, t2) {
      n2.__proto__ = t2;
    } || function(n2, t2) {
      for (var r in t2) if (Object.prototype.hasOwnProperty.call(t2, r)) n2[r] = t2[r];
    };
    return extendStatics(n, t);
  };
  return function(n, t) {
    if (typeof t !== "function" && t !== null) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    extendStatics(n, t);
    function __() {
      this.constructor = n;
    }
    n.prototype = t === null ? Object.create(t) : (__.prototype = t.prototype, new __());
  };
})();
var ContainerIterator = (function() {
  function ContainerIterator2(n) {
    if (n === void 0) {
      n = 0;
    }
    this.iteratorType = n;
  }
  ContainerIterator2.prototype.equals = function(n) {
    return this.o === n.o;
  };
  return ContainerIterator2;
})();
var Base = (function() {
  function Base2() {
    this.M = 0;
  }
  Object.defineProperty(Base2.prototype, "length", {
    get: function() {
      return this.M;
    },
    enumerable: false,
    configurable: true
  });
  Base2.prototype.size = function() {
    return this.M;
  };
  Base2.prototype.empty = function() {
    return this.M === 0;
  };
  return Base2;
})();
var Container = (function(n) {
  __extends$g(Container2, n);
  function Container2() {
    return n !== null && n.apply(this, arguments) || this;
  }
  return Container2;
})(Base);
var __extends$f = /* @__PURE__ */ (function() {
  var extendStatics = function(t, n) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(t2, n2) {
      t2.__proto__ = n2;
    } || function(t2, n2) {
      for (var i in n2) if (Object.prototype.hasOwnProperty.call(n2, i)) t2[i] = n2[i];
    };
    return extendStatics(t, n);
  };
  return function(t, n) {
    if (typeof n !== "function" && n !== null) throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
    extendStatics(t, n);
    function __() {
      this.constructor = t;
    }
    t.prototype = n === null ? Object.create(n) : (__.prototype = n.prototype, new __());
  };
})();
var Stack = (function(t) {
  __extends$f(Stack2, t);
  function Stack2(n) {
    if (n === void 0) {
      n = [];
    }
    var i = t.call(this) || this;
    i.nt = [];
    var r = i;
    n.forEach((function(t2) {
      r.push(t2);
    }));
    return i;
  }
  Stack2.prototype.clear = function() {
    this.M = 0;
    this.nt = [];
  };
  Stack2.prototype.push = function(t2) {
    this.nt.push(t2);
    this.M += 1;
    return this.M;
  };
  Stack2.prototype.pop = function() {
    if (this.M === 0) return;
    this.M -= 1;
    return this.nt.pop();
  };
  Stack2.prototype.top = function() {
    return this.nt[this.M - 1];
  };
  return Stack2;
})(Base);
var __extends$e = /* @__PURE__ */ (function() {
  var extendStatics = function(t, i) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(t2, i2) {
      t2.__proto__ = i2;
    } || function(t2, i2) {
      for (var n in i2) if (Object.prototype.hasOwnProperty.call(i2, n)) t2[n] = i2[n];
    };
    return extendStatics(t, i);
  };
  return function(t, i) {
    if (typeof i !== "function" && i !== null) throw new TypeError("Class extends value " + String(i) + " is not a constructor or null");
    extendStatics(t, i);
    function __() {
      this.constructor = t;
    }
    t.prototype = i === null ? Object.create(i) : (__.prototype = i.prototype, new __());
  };
})();
var Queue = (function(t) {
  __extends$e(Queue2, t);
  function Queue2(i) {
    if (i === void 0) {
      i = [];
    }
    var n = t.call(this) || this;
    n.A = 0;
    n.tt = [];
    var e = n;
    i.forEach((function(t2) {
      e.push(t2);
    }));
    return n;
  }
  Queue2.prototype.clear = function() {
    this.tt = [];
    this.M = this.A = 0;
  };
  Queue2.prototype.push = function(t2) {
    var i = this.tt.length;
    if (this.A / i > 0.5 && this.A + this.M >= i && i > 4096) {
      var n = this.M;
      for (var e = 0; e < n; ++e) {
        this.tt[e] = this.tt[this.A + e];
      }
      this.A = 0;
      this.tt[this.M] = t2;
    } else this.tt[this.A + this.M] = t2;
    return ++this.M;
  };
  Queue2.prototype.pop = function() {
    if (this.M === 0) return;
    var t2 = this.tt[this.A++];
    this.M -= 1;
    return t2;
  };
  Queue2.prototype.front = function() {
    if (this.M === 0) return;
    return this.tt[this.A];
  };
  return Queue2;
})(Base);
var __extends$d = /* @__PURE__ */ (function() {
  var extendStatics = function(i, r) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(i2, r2) {
      i2.__proto__ = r2;
    } || function(i2, r2) {
      for (var t in r2) if (Object.prototype.hasOwnProperty.call(r2, t)) i2[t] = r2[t];
    };
    return extendStatics(i, r);
  };
  return function(i, r) {
    if (typeof r !== "function" && r !== null) throw new TypeError("Class extends value " + String(r) + " is not a constructor or null");
    extendStatics(i, r);
    function __() {
      this.constructor = i;
    }
    i.prototype = r === null ? Object.create(r) : (__.prototype = r.prototype, new __());
  };
})();
var __read$3 = function(i, r) {
  var t = typeof Symbol === "function" && i[Symbol.iterator];
  if (!t) return i;
  var e = t.call(i), n, u = [], s;
  try {
    while ((r === void 0 || r-- > 0) && !(n = e.next()).done) u.push(n.value);
  } catch (i2) {
    s = {
      error: i2
    };
  } finally {
    try {
      if (n && !n.done && (t = e["return"])) t.call(e);
    } finally {
      if (s) throw s.error;
    }
  }
  return u;
};
var __spreadArray$2 = function(i, r, t) {
  if (t || arguments.length === 2) for (var e = 0, n = r.length, u; e < n; e++) {
    if (u || !(e in r)) {
      if (!u) u = Array.prototype.slice.call(r, 0, e);
      u[e] = r[e];
    }
  }
  return i.concat(u || Array.prototype.slice.call(r));
};
var PriorityQueue = (function(i) {
  __extends$d(PriorityQueue2, i);
  function PriorityQueue2(r, t, e) {
    if (r === void 0) {
      r = [];
    }
    if (t === void 0) {
      t = function(i2, r2) {
        if (i2 > r2) return -1;
        if (i2 < r2) return 1;
        return 0;
      };
    }
    if (e === void 0) {
      e = true;
    }
    var n = i.call(this) || this;
    n.$ = t;
    if (Array.isArray(r)) {
      n.ii = e ? __spreadArray$2([], __read$3(r), false) : r;
    } else {
      n.ii = [];
      var u = n;
      r.forEach((function(i2) {
        u.ii.push(i2);
      }));
    }
    n.M = n.ii.length;
    var s = n.M >> 1;
    for (var o = n.M - 1 >> 1; o >= 0; --o) {
      n.ri(o, s);
    }
    return n;
  }
  PriorityQueue2.prototype.ti = function(i2) {
    var r = this.ii[i2];
    while (i2 > 0) {
      var t = i2 - 1 >> 1;
      var e = this.ii[t];
      if (this.$(e, r) <= 0) break;
      this.ii[i2] = e;
      i2 = t;
    }
    this.ii[i2] = r;
  };
  PriorityQueue2.prototype.ri = function(i2, r) {
    var t = this.ii[i2];
    while (i2 < r) {
      var e = i2 << 1 | 1;
      var n = e + 1;
      var u = this.ii[e];
      if (n < this.M && this.$(u, this.ii[n]) > 0) {
        e = n;
        u = this.ii[n];
      }
      if (this.$(u, t) >= 0) break;
      this.ii[i2] = u;
      i2 = e;
    }
    this.ii[i2] = t;
  };
  PriorityQueue2.prototype.clear = function() {
    this.M = 0;
    this.ii.length = 0;
  };
  PriorityQueue2.prototype.push = function(i2) {
    this.ii.push(i2);
    this.ti(this.M);
    this.M += 1;
  };
  PriorityQueue2.prototype.pop = function() {
    if (this.M === 0) return;
    var i2 = this.ii[0];
    var r = this.ii.pop();
    this.M -= 1;
    if (this.M) {
      this.ii[0] = r;
      this.ri(0, this.M >> 1);
    }
    return i2;
  };
  PriorityQueue2.prototype.top = function() {
    return this.ii[0];
  };
  PriorityQueue2.prototype.find = function(i2) {
    return this.ii.indexOf(i2) >= 0;
  };
  PriorityQueue2.prototype.remove = function(i2) {
    var r = this.ii.indexOf(i2);
    if (r < 0) return false;
    if (r === 0) {
      this.pop();
    } else if (r === this.M - 1) {
      this.ii.pop();
      this.M -= 1;
    } else {
      this.ii.splice(r, 1, this.ii.pop());
      this.M -= 1;
      this.ti(r);
      this.ri(r, this.M >> 1);
    }
    return true;
  };
  PriorityQueue2.prototype.updateItem = function(i2) {
    var r = this.ii.indexOf(i2);
    if (r < 0) return false;
    this.ti(r);
    this.ri(r, this.M >> 1);
    return true;
  };
  PriorityQueue2.prototype.toArray = function() {
    return __spreadArray$2([], __read$3(this.ii), false);
  };
  return PriorityQueue2;
})(Base);
var __extends$c = /* @__PURE__ */ (function() {
  var extendStatics = function(n, t) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(n2, t2) {
      n2.__proto__ = t2;
    } || function(n2, t2) {
      for (var e in t2) if (Object.prototype.hasOwnProperty.call(t2, e)) n2[e] = t2[e];
    };
    return extendStatics(n, t);
  };
  return function(n, t) {
    if (typeof t !== "function" && t !== null) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    extendStatics(n, t);
    function __() {
      this.constructor = n;
    }
    n.prototype = t === null ? Object.create(t) : (__.prototype = t.prototype, new __());
  };
})();
var SequentialContainer = (function(n) {
  __extends$c(SequentialContainer2, n);
  function SequentialContainer2() {
    return n !== null && n.apply(this, arguments) || this;
  }
  return SequentialContainer2;
})(Container);
function throwIteratorAccessError() {
  throw new RangeError("Iterator access denied!");
}
var __extends$b = /* @__PURE__ */ (function() {
  var extendStatics = function(t, r) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(t2, r2) {
      t2.__proto__ = r2;
    } || function(t2, r2) {
      for (var n in r2) if (Object.prototype.hasOwnProperty.call(r2, n)) t2[n] = r2[n];
    };
    return extendStatics(t, r);
  };
  return function(t, r) {
    if (typeof r !== "function" && r !== null) throw new TypeError("Class extends value " + String(r) + " is not a constructor or null");
    extendStatics(t, r);
    function __() {
      this.constructor = t;
    }
    t.prototype = r === null ? Object.create(r) : (__.prototype = r.prototype, new __());
  };
})();
var RandomIterator = (function(t) {
  __extends$b(RandomIterator2, t);
  function RandomIterator2(r, n) {
    var o = t.call(this, n) || this;
    o.o = r;
    if (o.iteratorType === 0) {
      o.pre = function() {
        if (this.o === 0) {
          throwIteratorAccessError();
        }
        this.o -= 1;
        return this;
      };
      o.next = function() {
        if (this.o === this.container.size()) {
          throwIteratorAccessError();
        }
        this.o += 1;
        return this;
      };
    } else {
      o.pre = function() {
        if (this.o === this.container.size() - 1) {
          throwIteratorAccessError();
        }
        this.o += 1;
        return this;
      };
      o.next = function() {
        if (this.o === -1) {
          throwIteratorAccessError();
        }
        this.o -= 1;
        return this;
      };
    }
    return o;
  }
  Object.defineProperty(RandomIterator2.prototype, "pointer", {
    get: function() {
      return this.container.getElementByPos(this.o);
    },
    set: function(t2) {
      this.container.setElementByPos(this.o, t2);
    },
    enumerable: false,
    configurable: true
  });
  return RandomIterator2;
})(ContainerIterator);
var __extends$a = /* @__PURE__ */ (function() {
  var extendStatics = function(t, r) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(t2, r2) {
      t2.__proto__ = r2;
    } || function(t2, r2) {
      for (var e in r2) if (Object.prototype.hasOwnProperty.call(r2, e)) t2[e] = r2[e];
    };
    return extendStatics(t, r);
  };
  return function(t, r) {
    if (typeof r !== "function" && r !== null) throw new TypeError("Class extends value " + String(r) + " is not a constructor or null");
    extendStatics(t, r);
    function __() {
      this.constructor = t;
    }
    t.prototype = r === null ? Object.create(r) : (__.prototype = r.prototype, new __());
  };
})();
var __generator$6 = function(t, r) {
  var e = {
    label: 0,
    sent: function() {
      if (o[0] & 1) throw o[1];
      return o[1];
    },
    trys: [],
    ops: []
  }, n, i, o, u;
  return u = {
    next: verb(0),
    throw: verb(1),
    return: verb(2)
  }, typeof Symbol === "function" && (u[Symbol.iterator] = function() {
    return this;
  }), u;
  function verb(t2) {
    return function(r2) {
      return step([t2, r2]);
    };
  }
  function step(u2) {
    if (n) throw new TypeError("Generator is already executing.");
    while (e) try {
      if (n = 1, i && (o = u2[0] & 2 ? i["return"] : u2[0] ? i["throw"] || ((o = i["return"]) && o.call(i), 0) : i.next) && !(o = o.call(i, u2[1])).done) return o;
      if (i = 0, o) u2 = [u2[0] & 2, o.value];
      switch (u2[0]) {
        case 0:
        case 1:
          o = u2;
          break;
        case 4:
          e.label++;
          return {
            value: u2[1],
            done: false
          };
        case 5:
          e.label++;
          i = u2[1];
          u2 = [0];
          continue;
        case 7:
          u2 = e.ops.pop();
          e.trys.pop();
          continue;
        default:
          if (!(o = e.trys, o = o.length > 0 && o[o.length - 1]) && (u2[0] === 6 || u2[0] === 2)) {
            e = 0;
            continue;
          }
          if (u2[0] === 3 && (!o || u2[1] > o[0] && u2[1] < o[3])) {
            e.label = u2[1];
            break;
          }
          if (u2[0] === 6 && e.label < o[1]) {
            e.label = o[1];
            o = u2;
            break;
          }
          if (o && e.label < o[2]) {
            e.label = o[2];
            e.ops.push(u2);
            break;
          }
          if (o[2]) e.ops.pop();
          e.trys.pop();
          continue;
      }
      u2 = r.call(t, e);
    } catch (t2) {
      u2 = [6, t2];
      i = 0;
    } finally {
      n = o = 0;
    }
    if (u2[0] & 5) throw u2[1];
    return {
      value: u2[0] ? u2[1] : void 0,
      done: true
    };
  }
};
var __read$2 = function(t, r) {
  var e = typeof Symbol === "function" && t[Symbol.iterator];
  if (!e) return t;
  var n = e.call(t), i, o = [], u;
  try {
    while ((r === void 0 || r-- > 0) && !(i = n.next()).done) o.push(i.value);
  } catch (t2) {
    u = {
      error: t2
    };
  } finally {
    try {
      if (i && !i.done && (e = n["return"])) e.call(n);
    } finally {
      if (u) throw u.error;
    }
  }
  return o;
};
var __spreadArray$1 = function(t, r, e) {
  if (e || arguments.length === 2) for (var n = 0, i = r.length, o; n < i; n++) {
    if (o || !(n in r)) {
      if (!o) o = Array.prototype.slice.call(r, 0, n);
      o[n] = r[n];
    }
  }
  return t.concat(o || Array.prototype.slice.call(r));
};
var __values$3 = function(t) {
  var r = typeof Symbol === "function" && Symbol.iterator, e = r && t[r], n = 0;
  if (e) return e.call(t);
  if (t && typeof t.length === "number") return {
    next: function() {
      if (t && n >= t.length) t = void 0;
      return {
        value: t && t[n++],
        done: !t
      };
    }
  };
  throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var VectorIterator = (function(t) {
  __extends$a(VectorIterator2, t);
  function VectorIterator2(r, e, n) {
    var i = t.call(this, r, n) || this;
    i.container = e;
    return i;
  }
  VectorIterator2.prototype.copy = function() {
    return new VectorIterator2(this.o, this.container, this.iteratorType);
  };
  return VectorIterator2;
})(RandomIterator);
var Vector = (function(t) {
  __extends$a(Vector2, t);
  function Vector2(r, e) {
    if (r === void 0) {
      r = [];
    }
    if (e === void 0) {
      e = true;
    }
    var n = t.call(this) || this;
    if (Array.isArray(r)) {
      n.J = e ? __spreadArray$1([], __read$2(r), false) : r;
      n.M = r.length;
    } else {
      n.J = [];
      var i = n;
      r.forEach((function(t2) {
        i.pushBack(t2);
      }));
    }
    return n;
  }
  Vector2.prototype.clear = function() {
    this.M = 0;
    this.J.length = 0;
  };
  Vector2.prototype.begin = function() {
    return new VectorIterator(0, this);
  };
  Vector2.prototype.end = function() {
    return new VectorIterator(this.M, this);
  };
  Vector2.prototype.rBegin = function() {
    return new VectorIterator(this.M - 1, this, 1);
  };
  Vector2.prototype.rEnd = function() {
    return new VectorIterator(-1, this, 1);
  };
  Vector2.prototype.front = function() {
    return this.J[0];
  };
  Vector2.prototype.back = function() {
    return this.J[this.M - 1];
  };
  Vector2.prototype.getElementByPos = function(t2) {
    if (t2 < 0 || t2 > this.M - 1) {
      throw new RangeError();
    }
    return this.J[t2];
  };
  Vector2.prototype.eraseElementByPos = function(t2) {
    if (t2 < 0 || t2 > this.M - 1) {
      throw new RangeError();
    }
    this.J.splice(t2, 1);
    this.M -= 1;
    return this.M;
  };
  Vector2.prototype.eraseElementByValue = function(t2) {
    var r = 0;
    for (var e = 0; e < this.M; ++e) {
      if (this.J[e] !== t2) {
        this.J[r++] = this.J[e];
      }
    }
    this.M = this.J.length = r;
    return this.M;
  };
  Vector2.prototype.eraseElementByIterator = function(t2) {
    var r = t2.o;
    t2 = t2.next();
    this.eraseElementByPos(r);
    return t2;
  };
  Vector2.prototype.pushBack = function(t2) {
    this.J.push(t2);
    this.M += 1;
    return this.M;
  };
  Vector2.prototype.popBack = function() {
    if (this.M === 0) return;
    this.M -= 1;
    return this.J.pop();
  };
  Vector2.prototype.setElementByPos = function(t2, r) {
    if (t2 < 0 || t2 > this.M - 1) {
      throw new RangeError();
    }
    this.J[t2] = r;
  };
  Vector2.prototype.insert = function(t2, r, e) {
    var n;
    if (e === void 0) {
      e = 1;
    }
    if (t2 < 0 || t2 > this.M) {
      throw new RangeError();
    }
    (n = this.J).splice.apply(n, __spreadArray$1([t2, 0], __read$2(new Array(e).fill(r)), false));
    this.M += e;
    return this.M;
  };
  Vector2.prototype.find = function(t2) {
    for (var r = 0; r < this.M; ++r) {
      if (this.J[r] === t2) {
        return new VectorIterator(r, this);
      }
    }
    return this.end();
  };
  Vector2.prototype.reverse = function() {
    this.J.reverse();
  };
  Vector2.prototype.unique = function() {
    var t2 = 1;
    for (var r = 1; r < this.M; ++r) {
      if (this.J[r] !== this.J[r - 1]) {
        this.J[t2++] = this.J[r];
      }
    }
    this.M = this.J.length = t2;
    return this.M;
  };
  Vector2.prototype.sort = function(t2) {
    this.J.sort(t2);
  };
  Vector2.prototype.forEach = function(t2) {
    for (var r = 0; r < this.M; ++r) {
      t2(this.J[r], r, this);
    }
  };
  Vector2.prototype[Symbol.iterator] = function() {
    return (function() {
      return __generator$6(this, (function(t2) {
        switch (t2.label) {
          case 0:
            return [5, __values$3(this.J)];
          case 1:
            t2.sent();
            return [2];
        }
      }));
    }).bind(this)();
  };
  return Vector2;
})(SequentialContainer);
var __extends$9 = /* @__PURE__ */ (function() {
  var extendStatics = function(t, i) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(t2, i2) {
      t2.__proto__ = i2;
    } || function(t2, i2) {
      for (var r in i2) if (Object.prototype.hasOwnProperty.call(i2, r)) t2[r] = i2[r];
    };
    return extendStatics(t, i);
  };
  return function(t, i) {
    if (typeof i !== "function" && i !== null) throw new TypeError("Class extends value " + String(i) + " is not a constructor or null");
    extendStatics(t, i);
    function __() {
      this.constructor = t;
    }
    t.prototype = i === null ? Object.create(i) : (__.prototype = i.prototype, new __());
  };
})();
var __generator$5 = function(t, i) {
  var r = {
    label: 0,
    sent: function() {
      if (e[0] & 1) throw e[1];
      return e[1];
    },
    trys: [],
    ops: []
  }, n, s, e, h;
  return h = {
    next: verb(0),
    throw: verb(1),
    return: verb(2)
  }, typeof Symbol === "function" && (h[Symbol.iterator] = function() {
    return this;
  }), h;
  function verb(t2) {
    return function(i2) {
      return step([t2, i2]);
    };
  }
  function step(h2) {
    if (n) throw new TypeError("Generator is already executing.");
    while (r) try {
      if (n = 1, s && (e = h2[0] & 2 ? s["return"] : h2[0] ? s["throw"] || ((e = s["return"]) && e.call(s), 0) : s.next) && !(e = e.call(s, h2[1])).done) return e;
      if (s = 0, e) h2 = [h2[0] & 2, e.value];
      switch (h2[0]) {
        case 0:
        case 1:
          e = h2;
          break;
        case 4:
          r.label++;
          return {
            value: h2[1],
            done: false
          };
        case 5:
          r.label++;
          s = h2[1];
          h2 = [0];
          continue;
        case 7:
          h2 = r.ops.pop();
          r.trys.pop();
          continue;
        default:
          if (!(e = r.trys, e = e.length > 0 && e[e.length - 1]) && (h2[0] === 6 || h2[0] === 2)) {
            r = 0;
            continue;
          }
          if (h2[0] === 3 && (!e || h2[1] > e[0] && h2[1] < e[3])) {
            r.label = h2[1];
            break;
          }
          if (h2[0] === 6 && r.label < e[1]) {
            r.label = e[1];
            e = h2;
            break;
          }
          if (e && r.label < e[2]) {
            r.label = e[2];
            r.ops.push(h2);
            break;
          }
          if (e[2]) r.ops.pop();
          r.trys.pop();
          continue;
      }
      h2 = i.call(t, r);
    } catch (t2) {
      h2 = [6, t2];
      s = 0;
    } finally {
      n = e = 0;
    }
    if (h2[0] & 5) throw h2[1];
    return {
      value: h2[0] ? h2[1] : void 0,
      done: true
    };
  }
};
var LinkListIterator = (function(t) {
  __extends$9(LinkListIterator2, t);
  function LinkListIterator2(i, r, n, s) {
    var e = t.call(this, s) || this;
    e.o = i;
    e.h = r;
    e.container = n;
    if (e.iteratorType === 0) {
      e.pre = function() {
        if (this.o.L === this.h) {
          throwIteratorAccessError();
        }
        this.o = this.o.L;
        return this;
      };
      e.next = function() {
        if (this.o === this.h) {
          throwIteratorAccessError();
        }
        this.o = this.o.m;
        return this;
      };
    } else {
      e.pre = function() {
        if (this.o.m === this.h) {
          throwIteratorAccessError();
        }
        this.o = this.o.m;
        return this;
      };
      e.next = function() {
        if (this.o === this.h) {
          throwIteratorAccessError();
        }
        this.o = this.o.L;
        return this;
      };
    }
    return e;
  }
  Object.defineProperty(LinkListIterator2.prototype, "pointer", {
    get: function() {
      if (this.o === this.h) {
        throwIteratorAccessError();
      }
      return this.o.p;
    },
    set: function(t2) {
      if (this.o === this.h) {
        throwIteratorAccessError();
      }
      this.o.p = t2;
    },
    enumerable: false,
    configurable: true
  });
  LinkListIterator2.prototype.copy = function() {
    return new LinkListIterator2(this.o, this.h, this.container, this.iteratorType);
  };
  return LinkListIterator2;
})(ContainerIterator);
var LinkList = (function(t) {
  __extends$9(LinkList2, t);
  function LinkList2(i) {
    if (i === void 0) {
      i = [];
    }
    var r = t.call(this) || this;
    r.h = {};
    r.H = r.l = r.h.L = r.h.m = r.h;
    var n = r;
    i.forEach((function(t2) {
      n.pushBack(t2);
    }));
    return r;
  }
  LinkList2.prototype.G = function(t2) {
    var i = t2.L, r = t2.m;
    i.m = r;
    r.L = i;
    if (t2 === this.H) {
      this.H = r;
    }
    if (t2 === this.l) {
      this.l = i;
    }
    this.M -= 1;
  };
  LinkList2.prototype.F = function(t2, i) {
    var r = i.m;
    var n = {
      p: t2,
      L: i,
      m: r
    };
    i.m = n;
    r.L = n;
    if (i === this.h) {
      this.H = n;
    }
    if (r === this.h) {
      this.l = n;
    }
    this.M += 1;
  };
  LinkList2.prototype.clear = function() {
    this.M = 0;
    this.H = this.l = this.h.L = this.h.m = this.h;
  };
  LinkList2.prototype.begin = function() {
    return new LinkListIterator(this.H, this.h, this);
  };
  LinkList2.prototype.end = function() {
    return new LinkListIterator(this.h, this.h, this);
  };
  LinkList2.prototype.rBegin = function() {
    return new LinkListIterator(this.l, this.h, this, 1);
  };
  LinkList2.prototype.rEnd = function() {
    return new LinkListIterator(this.h, this.h, this, 1);
  };
  LinkList2.prototype.front = function() {
    return this.H.p;
  };
  LinkList2.prototype.back = function() {
    return this.l.p;
  };
  LinkList2.prototype.getElementByPos = function(t2) {
    if (t2 < 0 || t2 > this.M - 1) {
      throw new RangeError();
    }
    var i = this.H;
    while (t2--) {
      i = i.m;
    }
    return i.p;
  };
  LinkList2.prototype.eraseElementByPos = function(t2) {
    if (t2 < 0 || t2 > this.M - 1) {
      throw new RangeError();
    }
    var i = this.H;
    while (t2--) {
      i = i.m;
    }
    this.G(i);
    return this.M;
  };
  LinkList2.prototype.eraseElementByValue = function(t2) {
    var i = this.H;
    while (i !== this.h) {
      if (i.p === t2) {
        this.G(i);
      }
      i = i.m;
    }
    return this.M;
  };
  LinkList2.prototype.eraseElementByIterator = function(t2) {
    var i = t2.o;
    if (i === this.h) {
      throwIteratorAccessError();
    }
    t2 = t2.next();
    this.G(i);
    return t2;
  };
  LinkList2.prototype.pushBack = function(t2) {
    this.F(t2, this.l);
    return this.M;
  };
  LinkList2.prototype.popBack = function() {
    if (this.M === 0) return;
    var t2 = this.l.p;
    this.G(this.l);
    return t2;
  };
  LinkList2.prototype.pushFront = function(t2) {
    this.F(t2, this.h);
    return this.M;
  };
  LinkList2.prototype.popFront = function() {
    if (this.M === 0) return;
    var t2 = this.H.p;
    this.G(this.H);
    return t2;
  };
  LinkList2.prototype.setElementByPos = function(t2, i) {
    if (t2 < 0 || t2 > this.M - 1) {
      throw new RangeError();
    }
    var r = this.H;
    while (t2--) {
      r = r.m;
    }
    r.p = i;
  };
  LinkList2.prototype.insert = function(t2, i, r) {
    if (r === void 0) {
      r = 1;
    }
    if (t2 < 0 || t2 > this.M) {
      throw new RangeError();
    }
    if (r <= 0) return this.M;
    if (t2 === 0) {
      while (r--) this.pushFront(i);
    } else if (t2 === this.M) {
      while (r--) this.pushBack(i);
    } else {
      var n = this.H;
      for (var s = 1; s < t2; ++s) {
        n = n.m;
      }
      var e = n.m;
      this.M += r;
      while (r--) {
        n.m = {
          p: i,
          L: n
        };
        n.m.L = n;
        n = n.m;
      }
      n.m = e;
      e.L = n;
    }
    return this.M;
  };
  LinkList2.prototype.find = function(t2) {
    var i = this.H;
    while (i !== this.h) {
      if (i.p === t2) {
        return new LinkListIterator(i, this.h, this);
      }
      i = i.m;
    }
    return this.end();
  };
  LinkList2.prototype.reverse = function() {
    if (this.M <= 1) return;
    var t2 = this.H;
    var i = this.l;
    var r = 0;
    while (r << 1 < this.M) {
      var n = t2.p;
      t2.p = i.p;
      i.p = n;
      t2 = t2.m;
      i = i.L;
      r += 1;
    }
  };
  LinkList2.prototype.unique = function() {
    if (this.M <= 1) {
      return this.M;
    }
    var t2 = this.H;
    while (t2 !== this.h) {
      var i = t2;
      while (i.m !== this.h && i.p === i.m.p) {
        i = i.m;
        this.M -= 1;
      }
      t2.m = i.m;
      t2.m.L = t2;
      t2 = t2.m;
    }
    return this.M;
  };
  LinkList2.prototype.sort = function(t2) {
    if (this.M <= 1) return;
    var i = [];
    this.forEach((function(t3) {
      i.push(t3);
    }));
    i.sort(t2);
    var r = this.H;
    i.forEach((function(t3) {
      r.p = t3;
      r = r.m;
    }));
  };
  LinkList2.prototype.merge = function(t2) {
    var i = this;
    if (this.M === 0) {
      t2.forEach((function(t3) {
        i.pushBack(t3);
      }));
    } else {
      var r = this.H;
      t2.forEach((function(t3) {
        while (r !== i.h && r.p <= t3) {
          r = r.m;
        }
        i.F(t3, r.L);
      }));
    }
    return this.M;
  };
  LinkList2.prototype.forEach = function(t2) {
    var i = this.H;
    var r = 0;
    while (i !== this.h) {
      t2(i.p, r++, this);
      i = i.m;
    }
  };
  LinkList2.prototype[Symbol.iterator] = function() {
    return (function() {
      var t2;
      return __generator$5(this, (function(i) {
        switch (i.label) {
          case 0:
            if (this.M === 0) return [2];
            t2 = this.H;
            i.label = 1;
          case 1:
            if (!(t2 !== this.h)) return [3, 3];
            return [4, t2.p];
          case 2:
            i.sent();
            t2 = t2.m;
            return [3, 1];
          case 3:
            return [2];
        }
      }));
    }).bind(this)();
  };
  return LinkList2;
})(SequentialContainer);
var __extends$8 = /* @__PURE__ */ (function() {
  var extendStatics = function(t, i) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(t2, i2) {
      t2.__proto__ = i2;
    } || function(t2, i2) {
      for (var r in i2) if (Object.prototype.hasOwnProperty.call(i2, r)) t2[r] = i2[r];
    };
    return extendStatics(t, i);
  };
  return function(t, i) {
    if (typeof i !== "function" && i !== null) throw new TypeError("Class extends value " + String(i) + " is not a constructor or null");
    extendStatics(t, i);
    function __() {
      this.constructor = t;
    }
    t.prototype = i === null ? Object.create(i) : (__.prototype = i.prototype, new __());
  };
})();
var __generator$4 = function(t, i) {
  var r = {
    label: 0,
    sent: function() {
      if (h[0] & 1) throw h[1];
      return h[1];
    },
    trys: [],
    ops: []
  }, e, s, h, n;
  return n = {
    next: verb(0),
    throw: verb(1),
    return: verb(2)
  }, typeof Symbol === "function" && (n[Symbol.iterator] = function() {
    return this;
  }), n;
  function verb(t2) {
    return function(i2) {
      return step([t2, i2]);
    };
  }
  function step(n2) {
    if (e) throw new TypeError("Generator is already executing.");
    while (r) try {
      if (e = 1, s && (h = n2[0] & 2 ? s["return"] : n2[0] ? s["throw"] || ((h = s["return"]) && h.call(s), 0) : s.next) && !(h = h.call(s, n2[1])).done) return h;
      if (s = 0, h) n2 = [n2[0] & 2, h.value];
      switch (n2[0]) {
        case 0:
        case 1:
          h = n2;
          break;
        case 4:
          r.label++;
          return {
            value: n2[1],
            done: false
          };
        case 5:
          r.label++;
          s = n2[1];
          n2 = [0];
          continue;
        case 7:
          n2 = r.ops.pop();
          r.trys.pop();
          continue;
        default:
          if (!(h = r.trys, h = h.length > 0 && h[h.length - 1]) && (n2[0] === 6 || n2[0] === 2)) {
            r = 0;
            continue;
          }
          if (n2[0] === 3 && (!h || n2[1] > h[0] && n2[1] < h[3])) {
            r.label = n2[1];
            break;
          }
          if (n2[0] === 6 && r.label < h[1]) {
            r.label = h[1];
            h = n2;
            break;
          }
          if (h && r.label < h[2]) {
            r.label = h[2];
            r.ops.push(n2);
            break;
          }
          if (h[2]) r.ops.pop();
          r.trys.pop();
          continue;
      }
      n2 = i.call(t, r);
    } catch (t2) {
      n2 = [6, t2];
      s = 0;
    } finally {
      e = h = 0;
    }
    if (n2[0] & 5) throw n2[1];
    return {
      value: n2[0] ? n2[1] : void 0,
      done: true
    };
  }
};
var __read$1 = function(t, i) {
  var r = typeof Symbol === "function" && t[Symbol.iterator];
  if (!r) return t;
  var e = r.call(t), s, h = [], n;
  try {
    while ((i === void 0 || i-- > 0) && !(s = e.next()).done) h.push(s.value);
  } catch (t2) {
    n = {
      error: t2
    };
  } finally {
    try {
      if (s && !s.done && (r = e["return"])) r.call(e);
    } finally {
      if (n) throw n.error;
    }
  }
  return h;
};
var __spreadArray = function(t, i, r) {
  if (r || arguments.length === 2) for (var e = 0, s = i.length, h; e < s; e++) {
    if (h || !(e in i)) {
      if (!h) h = Array.prototype.slice.call(i, 0, e);
      h[e] = i[e];
    }
  }
  return t.concat(h || Array.prototype.slice.call(i));
};
var DequeIterator = (function(t) {
  __extends$8(DequeIterator2, t);
  function DequeIterator2(i, r, e) {
    var s = t.call(this, i, e) || this;
    s.container = r;
    return s;
  }
  DequeIterator2.prototype.copy = function() {
    return new DequeIterator2(this.o, this.container, this.iteratorType);
  };
  return DequeIterator2;
})(RandomIterator);
var Deque = (function(t) {
  __extends$8(Deque2, t);
  function Deque2(i, r) {
    if (i === void 0) {
      i = [];
    }
    if (r === void 0) {
      r = 1 << 12;
    }
    var e = t.call(this) || this;
    e.A = 0;
    e.S = 0;
    e.R = 0;
    e.k = 0;
    e.C = 0;
    e.j = [];
    var s = (function() {
      if (typeof i.length === "number") return i.length;
      if (typeof i.size === "number") return i.size;
      if (typeof i.size === "function") return i.size();
      throw new TypeError("Cannot get the length or size of the container");
    })();
    e.B = r;
    e.C = Math.max(Math.ceil(s / e.B), 1);
    for (var h = 0; h < e.C; ++h) {
      e.j.push(new Array(e.B));
    }
    var n = Math.ceil(s / e.B);
    e.A = e.R = (e.C >> 1) - (n >> 1);
    e.S = e.k = e.B - s % e.B >> 1;
    var u = e;
    i.forEach((function(t2) {
      u.pushBack(t2);
    }));
    return e;
  }
  Deque2.prototype.O = function() {
    var t2 = [];
    var i = Math.max(this.C >> 1, 1);
    for (var r = 0; r < i; ++r) {
      t2[r] = new Array(this.B);
    }
    for (var r = this.A; r < this.C; ++r) {
      t2[t2.length] = this.j[r];
    }
    for (var r = 0; r < this.R; ++r) {
      t2[t2.length] = this.j[r];
    }
    t2[t2.length] = __spreadArray([], __read$1(this.j[this.R]), false);
    this.A = i;
    this.R = t2.length - 1;
    for (var r = 0; r < i; ++r) {
      t2[t2.length] = new Array(this.B);
    }
    this.j = t2;
    this.C = t2.length;
  };
  Deque2.prototype.T = function(t2) {
    var i = this.S + t2 + 1;
    var r = i % this.B;
    var e = r - 1;
    var s = this.A + (i - r) / this.B;
    if (r === 0) s -= 1;
    s %= this.C;
    if (e < 0) e += this.B;
    return {
      curNodeBucketIndex: s,
      curNodePointerIndex: e
    };
  };
  Deque2.prototype.clear = function() {
    this.j = [new Array(this.B)];
    this.C = 1;
    this.A = this.R = this.M = 0;
    this.S = this.k = this.B >> 1;
  };
  Deque2.prototype.begin = function() {
    return new DequeIterator(0, this);
  };
  Deque2.prototype.end = function() {
    return new DequeIterator(this.M, this);
  };
  Deque2.prototype.rBegin = function() {
    return new DequeIterator(this.M - 1, this, 1);
  };
  Deque2.prototype.rEnd = function() {
    return new DequeIterator(-1, this, 1);
  };
  Deque2.prototype.front = function() {
    if (this.M === 0) return;
    return this.j[this.A][this.S];
  };
  Deque2.prototype.back = function() {
    if (this.M === 0) return;
    return this.j[this.R][this.k];
  };
  Deque2.prototype.pushBack = function(t2) {
    if (this.M) {
      if (this.k < this.B - 1) {
        this.k += 1;
      } else if (this.R < this.C - 1) {
        this.R += 1;
        this.k = 0;
      } else {
        this.R = 0;
        this.k = 0;
      }
      if (this.R === this.A && this.k === this.S) this.O();
    }
    this.M += 1;
    this.j[this.R][this.k] = t2;
    return this.M;
  };
  Deque2.prototype.popBack = function() {
    if (this.M === 0) return;
    var t2 = this.j[this.R][this.k];
    if (this.M !== 1) {
      if (this.k > 0) {
        this.k -= 1;
      } else if (this.R > 0) {
        this.R -= 1;
        this.k = this.B - 1;
      } else {
        this.R = this.C - 1;
        this.k = this.B - 1;
      }
    }
    this.M -= 1;
    return t2;
  };
  Deque2.prototype.pushFront = function(t2) {
    if (this.M) {
      if (this.S > 0) {
        this.S -= 1;
      } else if (this.A > 0) {
        this.A -= 1;
        this.S = this.B - 1;
      } else {
        this.A = this.C - 1;
        this.S = this.B - 1;
      }
      if (this.A === this.R && this.S === this.k) this.O();
    }
    this.M += 1;
    this.j[this.A][this.S] = t2;
    return this.M;
  };
  Deque2.prototype.popFront = function() {
    if (this.M === 0) return;
    var t2 = this.j[this.A][this.S];
    if (this.M !== 1) {
      if (this.S < this.B - 1) {
        this.S += 1;
      } else if (this.A < this.C - 1) {
        this.A += 1;
        this.S = 0;
      } else {
        this.A = 0;
        this.S = 0;
      }
    }
    this.M -= 1;
    return t2;
  };
  Deque2.prototype.getElementByPos = function(t2) {
    if (t2 < 0 || t2 > this.M - 1) {
      throw new RangeError();
    }
    var i = this.T(t2), r = i.curNodeBucketIndex, e = i.curNodePointerIndex;
    return this.j[r][e];
  };
  Deque2.prototype.setElementByPos = function(t2, i) {
    if (t2 < 0 || t2 > this.M - 1) {
      throw new RangeError();
    }
    var r = this.T(t2), e = r.curNodeBucketIndex, s = r.curNodePointerIndex;
    this.j[e][s] = i;
  };
  Deque2.prototype.insert = function(t2, i, r) {
    if (r === void 0) {
      r = 1;
    }
    if (t2 < 0 || t2 > this.M) {
      throw new RangeError();
    }
    if (t2 === 0) {
      while (r--) this.pushFront(i);
    } else if (t2 === this.M) {
      while (r--) this.pushBack(i);
    } else {
      var e = [];
      for (var s = t2; s < this.M; ++s) {
        e.push(this.getElementByPos(s));
      }
      this.cut(t2 - 1);
      for (var s = 0; s < r; ++s) this.pushBack(i);
      for (var s = 0; s < e.length; ++s) this.pushBack(e[s]);
    }
    return this.M;
  };
  Deque2.prototype.cut = function(t2) {
    if (t2 < 0) {
      this.clear();
      return 0;
    }
    var i = this.T(t2), r = i.curNodeBucketIndex, e = i.curNodePointerIndex;
    this.R = r;
    this.k = e;
    this.M = t2 + 1;
    return this.M;
  };
  Deque2.prototype.eraseElementByPos = function(t2) {
    if (t2 < 0 || t2 > this.M - 1) {
      throw new RangeError();
    }
    if (t2 === 0) this.popFront();
    else if (t2 === this.M - 1) this.popBack();
    else {
      var i = [];
      for (var r = t2 + 1; r < this.M; ++r) {
        i.push(this.getElementByPos(r));
      }
      this.cut(t2);
      this.popBack();
      var e = this;
      i.forEach((function(t3) {
        e.pushBack(t3);
      }));
    }
    return this.M;
  };
  Deque2.prototype.eraseElementByValue = function(t2) {
    if (this.M === 0) return 0;
    var i = [];
    for (var r = 0; r < this.M; ++r) {
      var e = this.getElementByPos(r);
      if (e !== t2) i.push(e);
    }
    var s = i.length;
    for (var r = 0; r < s; ++r) this.setElementByPos(r, i[r]);
    return this.cut(s - 1);
  };
  Deque2.prototype.eraseElementByIterator = function(t2) {
    var i = t2.o;
    this.eraseElementByPos(i);
    t2 = t2.next();
    return t2;
  };
  Deque2.prototype.find = function(t2) {
    for (var i = 0; i < this.M; ++i) {
      if (this.getElementByPos(i) === t2) {
        return new DequeIterator(i, this);
      }
    }
    return this.end();
  };
  Deque2.prototype.reverse = function() {
    var t2 = 0;
    var i = this.M - 1;
    while (t2 < i) {
      var r = this.getElementByPos(t2);
      this.setElementByPos(t2, this.getElementByPos(i));
      this.setElementByPos(i, r);
      t2 += 1;
      i -= 1;
    }
  };
  Deque2.prototype.unique = function() {
    if (this.M <= 1) {
      return this.M;
    }
    var t2 = 1;
    var i = this.getElementByPos(0);
    for (var r = 1; r < this.M; ++r) {
      var e = this.getElementByPos(r);
      if (e !== i) {
        i = e;
        this.setElementByPos(t2++, e);
      }
    }
    while (this.M > t2) this.popBack();
    return this.M;
  };
  Deque2.prototype.sort = function(t2) {
    var i = [];
    for (var r = 0; r < this.M; ++r) {
      i.push(this.getElementByPos(r));
    }
    i.sort(t2);
    for (var r = 0; r < this.M; ++r) this.setElementByPos(r, i[r]);
  };
  Deque2.prototype.shrinkToFit = function() {
    if (this.M === 0) return;
    var t2 = [];
    this.forEach((function(i2) {
      t2.push(i2);
    }));
    this.C = Math.max(Math.ceil(this.M / this.B), 1);
    this.M = this.A = this.R = this.S = this.k = 0;
    this.j = [];
    for (var i = 0; i < this.C; ++i) {
      this.j.push(new Array(this.B));
    }
    for (var i = 0; i < t2.length; ++i) this.pushBack(t2[i]);
  };
  Deque2.prototype.forEach = function(t2) {
    for (var i = 0; i < this.M; ++i) {
      t2(this.getElementByPos(i), i, this);
    }
  };
  Deque2.prototype[Symbol.iterator] = function() {
    return (function() {
      var t2;
      return __generator$4(this, (function(i) {
        switch (i.label) {
          case 0:
            t2 = 0;
            i.label = 1;
          case 1:
            if (!(t2 < this.M)) return [3, 4];
            return [4, this.getElementByPos(t2)];
          case 2:
            i.sent();
            i.label = 3;
          case 3:
            ++t2;
            return [3, 1];
          case 4:
            return [2];
        }
      }));
    }).bind(this)();
  };
  return Deque2;
})(SequentialContainer);
var __extends$7 = /* @__PURE__ */ (function() {
  var extendStatics = function(e, n) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(e2, n2) {
      e2.__proto__ = n2;
    } || function(e2, n2) {
      for (var t in n2) if (Object.prototype.hasOwnProperty.call(n2, t)) e2[t] = n2[t];
    };
    return extendStatics(e, n);
  };
  return function(e, n) {
    if (typeof n !== "function" && n !== null) throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
    extendStatics(e, n);
    function __() {
      this.constructor = e;
    }
    e.prototype = n === null ? Object.create(n) : (__.prototype = n.prototype, new __());
  };
})();
var TreeNode = (function() {
  function TreeNode2(e, n) {
    this.ee = 1;
    this.u = void 0;
    this.p = void 0;
    this.K = void 0;
    this.N = void 0;
    this.rr = void 0;
    this.u = e;
    this.p = n;
  }
  TreeNode2.prototype.L = function() {
    var e = this;
    if (e.ee === 1 && e.rr.rr === e) {
      e = e.N;
    } else if (e.K) {
      e = e.K;
      while (e.N) {
        e = e.N;
      }
    } else {
      var n = e.rr;
      while (n.K === e) {
        e = n;
        n = e.rr;
      }
      e = n;
    }
    return e;
  };
  TreeNode2.prototype.m = function() {
    var e = this;
    if (e.N) {
      e = e.N;
      while (e.K) {
        e = e.K;
      }
      return e;
    } else {
      var n = e.rr;
      while (n.N === e) {
        e = n;
        n = e.rr;
      }
      if (e.N !== n) {
        return n;
      } else return e;
    }
  };
  TreeNode2.prototype.ne = function() {
    var e = this.rr;
    var n = this.N;
    var t = n.K;
    if (e.rr === this) e.rr = n;
    else if (e.K === this) e.K = n;
    else e.N = n;
    n.rr = e;
    n.K = this;
    this.rr = n;
    this.N = t;
    if (t) t.rr = this;
    return n;
  };
  TreeNode2.prototype.te = function() {
    var e = this.rr;
    var n = this.K;
    var t = n.N;
    if (e.rr === this) e.rr = n;
    else if (e.K === this) e.K = n;
    else e.N = n;
    n.rr = e;
    n.N = this;
    this.rr = n;
    this.K = t;
    if (t) t.rr = this;
    return n;
  };
  return TreeNode2;
})();
var TreeNodeEnableIndex = (function(e) {
  __extends$7(TreeNodeEnableIndex2, e);
  function TreeNodeEnableIndex2() {
    var n = e !== null && e.apply(this, arguments) || this;
    n.tr = 1;
    return n;
  }
  TreeNodeEnableIndex2.prototype.ne = function() {
    var n = e.prototype.ne.call(this);
    this.ie();
    n.ie();
    return n;
  };
  TreeNodeEnableIndex2.prototype.te = function() {
    var n = e.prototype.te.call(this);
    this.ie();
    n.ie();
    return n;
  };
  TreeNodeEnableIndex2.prototype.ie = function() {
    this.tr = 1;
    if (this.K) {
      this.tr += this.K.tr;
    }
    if (this.N) {
      this.tr += this.N.tr;
    }
  };
  return TreeNodeEnableIndex2;
})(TreeNode);
var __extends$6 = /* @__PURE__ */ (function() {
  var extendStatics = function(e, r) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(e2, r2) {
      e2.__proto__ = r2;
    } || function(e2, r2) {
      for (var i in r2) if (Object.prototype.hasOwnProperty.call(r2, i)) e2[i] = r2[i];
    };
    return extendStatics(e, r);
  };
  return function(e, r) {
    if (typeof r !== "function" && r !== null) throw new TypeError("Class extends value " + String(r) + " is not a constructor or null");
    extendStatics(e, r);
    function __() {
      this.constructor = e;
    }
    e.prototype = r === null ? Object.create(r) : (__.prototype = r.prototype, new __());
  };
})();
var __read = function(e, r) {
  var i = typeof Symbol === "function" && e[Symbol.iterator];
  if (!i) return e;
  var t = i.call(e), n, s = [], f;
  try {
    while ((r === void 0 || r-- > 0) && !(n = t.next()).done) s.push(n.value);
  } catch (e2) {
    f = {
      error: e2
    };
  } finally {
    try {
      if (n && !n.done && (i = t["return"])) i.call(t);
    } finally {
      if (f) throw f.error;
    }
  }
  return s;
};
var __values$2 = function(e) {
  var r = typeof Symbol === "function" && Symbol.iterator, i = r && e[r], t = 0;
  if (i) return i.call(e);
  if (e && typeof e.length === "number") return {
    next: function() {
      if (e && t >= e.length) e = void 0;
      return {
        value: e && e[t++],
        done: !e
      };
    }
  };
  throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var TreeContainer = (function(e) {
  __extends$6(TreeContainer2, e);
  function TreeContainer2(r, i) {
    if (r === void 0) {
      r = function(e2, r2) {
        if (e2 < r2) return -1;
        if (e2 > r2) return 1;
        return 0;
      };
    }
    if (i === void 0) {
      i = false;
    }
    var t = e.call(this) || this;
    t.W = void 0;
    t.$ = r;
    if (i) {
      t.re = TreeNodeEnableIndex;
      t.v = function(e2, r2, i2) {
        var t2 = this.se(e2, r2, i2);
        if (t2) {
          var n = t2.rr;
          while (n !== this.h) {
            n.tr += 1;
            n = n.rr;
          }
          var s = this.fe(t2);
          if (s) {
            var f = s, h = f.parentNode, u = f.grandParent, a = f.curNode;
            h.ie();
            u.ie();
            a.ie();
          }
        }
        return this.M;
      };
      t.G = function(e2) {
        var r2 = this.he(e2);
        while (r2 !== this.h) {
          r2.tr -= 1;
          r2 = r2.rr;
        }
      };
    } else {
      t.re = TreeNode;
      t.v = function(e2, r2, i2) {
        var t2 = this.se(e2, r2, i2);
        if (t2) this.fe(t2);
        return this.M;
      };
      t.G = t.he;
    }
    t.h = new t.re();
    return t;
  }
  TreeContainer2.prototype.U = function(e2, r) {
    var i = this.h;
    while (e2) {
      var t = this.$(e2.u, r);
      if (t < 0) {
        e2 = e2.N;
      } else if (t > 0) {
        i = e2;
        e2 = e2.K;
      } else return e2;
    }
    return i;
  };
  TreeContainer2.prototype.X = function(e2, r) {
    var i = this.h;
    while (e2) {
      var t = this.$(e2.u, r);
      if (t <= 0) {
        e2 = e2.N;
      } else {
        i = e2;
        e2 = e2.K;
      }
    }
    return i;
  };
  TreeContainer2.prototype.Y = function(e2, r) {
    var i = this.h;
    while (e2) {
      var t = this.$(e2.u, r);
      if (t < 0) {
        i = e2;
        e2 = e2.N;
      } else if (t > 0) {
        e2 = e2.K;
      } else return e2;
    }
    return i;
  };
  TreeContainer2.prototype.Z = function(e2, r) {
    var i = this.h;
    while (e2) {
      var t = this.$(e2.u, r);
      if (t < 0) {
        i = e2;
        e2 = e2.N;
      } else {
        e2 = e2.K;
      }
    }
    return i;
  };
  TreeContainer2.prototype.ue = function(e2) {
    while (true) {
      var r = e2.rr;
      if (r === this.h) return;
      if (e2.ee === 1) {
        e2.ee = 0;
        return;
      }
      if (e2 === r.K) {
        var i = r.N;
        if (i.ee === 1) {
          i.ee = 0;
          r.ee = 1;
          if (r === this.W) {
            this.W = r.ne();
          } else r.ne();
        } else {
          if (i.N && i.N.ee === 1) {
            i.ee = r.ee;
            r.ee = 0;
            i.N.ee = 0;
            if (r === this.W) {
              this.W = r.ne();
            } else r.ne();
            return;
          } else if (i.K && i.K.ee === 1) {
            i.ee = 1;
            i.K.ee = 0;
            i.te();
          } else {
            i.ee = 1;
            e2 = r;
          }
        }
      } else {
        var i = r.K;
        if (i.ee === 1) {
          i.ee = 0;
          r.ee = 1;
          if (r === this.W) {
            this.W = r.te();
          } else r.te();
        } else {
          if (i.K && i.K.ee === 1) {
            i.ee = r.ee;
            r.ee = 0;
            i.K.ee = 0;
            if (r === this.W) {
              this.W = r.te();
            } else r.te();
            return;
          } else if (i.N && i.N.ee === 1) {
            i.ee = 1;
            i.N.ee = 0;
            i.ne();
          } else {
            i.ee = 1;
            e2 = r;
          }
        }
      }
    }
  };
  TreeContainer2.prototype.he = function(e2) {
    var r, i;
    if (this.M === 1) {
      this.clear();
      return this.h;
    }
    var t = e2;
    while (t.K || t.N) {
      if (t.N) {
        t = t.N;
        while (t.K) t = t.K;
      } else {
        t = t.K;
      }
      r = __read([t.u, e2.u], 2), e2.u = r[0], t.u = r[1];
      i = __read([t.p, e2.p], 2), e2.p = i[0], t.p = i[1];
      e2 = t;
    }
    if (this.h.K === t) {
      this.h.K = t.rr;
    } else if (this.h.N === t) {
      this.h.N = t.rr;
    }
    this.ue(t);
    var n = t.rr;
    if (t === n.K) {
      n.K = void 0;
    } else n.N = void 0;
    this.M -= 1;
    this.W.ee = 0;
    return n;
  };
  TreeContainer2.prototype.ae = function(e2, r) {
    if (e2 === void 0) return false;
    var i = this.ae(e2.K, r);
    if (i) return true;
    if (r(e2)) return true;
    return this.ae(e2.N, r);
  };
  TreeContainer2.prototype.fe = function(e2) {
    while (true) {
      var r = e2.rr;
      if (r.ee === 0) return;
      var i = r.rr;
      if (r === i.K) {
        var t = i.N;
        if (t && t.ee === 1) {
          t.ee = r.ee = 0;
          if (i === this.W) return;
          i.ee = 1;
          e2 = i;
          continue;
        } else if (e2 === r.N) {
          e2.ee = 0;
          if (e2.K) e2.K.rr = r;
          if (e2.N) e2.N.rr = i;
          r.N = e2.K;
          i.K = e2.N;
          e2.K = r;
          e2.N = i;
          if (i === this.W) {
            this.W = e2;
            this.h.rr = e2;
          } else {
            var n = i.rr;
            if (n.K === i) {
              n.K = e2;
            } else n.N = e2;
          }
          e2.rr = i.rr;
          r.rr = e2;
          i.rr = e2;
          i.ee = 1;
          return {
            parentNode: r,
            grandParent: i,
            curNode: e2
          };
        } else {
          r.ee = 0;
          if (i === this.W) {
            this.W = i.te();
          } else i.te();
          i.ee = 1;
        }
      } else {
        var t = i.K;
        if (t && t.ee === 1) {
          t.ee = r.ee = 0;
          if (i === this.W) return;
          i.ee = 1;
          e2 = i;
          continue;
        } else if (e2 === r.K) {
          e2.ee = 0;
          if (e2.K) e2.K.rr = i;
          if (e2.N) e2.N.rr = r;
          i.N = e2.K;
          r.K = e2.N;
          e2.K = i;
          e2.N = r;
          if (i === this.W) {
            this.W = e2;
            this.h.rr = e2;
          } else {
            var n = i.rr;
            if (n.K === i) {
              n.K = e2;
            } else n.N = e2;
          }
          e2.rr = i.rr;
          r.rr = e2;
          i.rr = e2;
          i.ee = 1;
          return {
            parentNode: r,
            grandParent: i,
            curNode: e2
          };
        } else {
          r.ee = 0;
          if (i === this.W) {
            this.W = i.ne();
          } else i.ne();
          i.ee = 1;
        }
      }
      return;
    }
  };
  TreeContainer2.prototype.se = function(e2, r, i) {
    if (this.W === void 0) {
      this.M += 1;
      this.W = new this.re(e2, r);
      this.W.ee = 0;
      this.W.rr = this.h;
      this.h.rr = this.W;
      this.h.K = this.W;
      this.h.N = this.W;
      return;
    }
    var t;
    var n = this.h.K;
    var s = this.$(n.u, e2);
    if (s === 0) {
      n.p = r;
      return;
    } else if (s > 0) {
      n.K = new this.re(e2, r);
      n.K.rr = n;
      t = n.K;
      this.h.K = t;
    } else {
      var f = this.h.N;
      var h = this.$(f.u, e2);
      if (h === 0) {
        f.p = r;
        return;
      } else if (h < 0) {
        f.N = new this.re(e2, r);
        f.N.rr = f;
        t = f.N;
        this.h.N = t;
      } else {
        if (i !== void 0) {
          var u = i.o;
          if (u !== this.h) {
            var a = this.$(u.u, e2);
            if (a === 0) {
              u.p = r;
              return;
            } else if (a > 0) {
              var o = u.L();
              var l = this.$(o.u, e2);
              if (l === 0) {
                o.p = r;
                return;
              } else if (l < 0) {
                t = new this.re(e2, r);
                if (o.N === void 0) {
                  o.N = t;
                  t.rr = o;
                } else {
                  u.K = t;
                  t.rr = u;
                }
              }
            }
          }
        }
        if (t === void 0) {
          t = this.W;
          while (true) {
            var v = this.$(t.u, e2);
            if (v > 0) {
              if (t.K === void 0) {
                t.K = new this.re(e2, r);
                t.K.rr = t;
                t = t.K;
                break;
              }
              t = t.K;
            } else if (v < 0) {
              if (t.N === void 0) {
                t.N = new this.re(e2, r);
                t.N.rr = t;
                t = t.N;
                break;
              }
              t = t.N;
            } else {
              t.p = r;
              return;
            }
          }
        }
      }
    }
    this.M += 1;
    return t;
  };
  TreeContainer2.prototype.g = function(e2, r) {
    while (e2) {
      var i = this.$(e2.u, r);
      if (i < 0) {
        e2 = e2.N;
      } else if (i > 0) {
        e2 = e2.K;
      } else return e2;
    }
    return e2 || this.h;
  };
  TreeContainer2.prototype.clear = function() {
    this.M = 0;
    this.W = void 0;
    this.h.rr = void 0;
    this.h.K = this.h.N = void 0;
  };
  TreeContainer2.prototype.updateKeyByIterator = function(e2, r) {
    var i = e2.o;
    if (i === this.h) {
      throwIteratorAccessError();
    }
    if (this.M === 1) {
      i.u = r;
      return true;
    }
    if (i === this.h.K) {
      if (this.$(i.m().u, r) > 0) {
        i.u = r;
        return true;
      }
      return false;
    }
    if (i === this.h.N) {
      if (this.$(i.L().u, r) < 0) {
        i.u = r;
        return true;
      }
      return false;
    }
    var t = i.L().u;
    if (this.$(t, r) >= 0) return false;
    var n = i.m().u;
    if (this.$(n, r) <= 0) return false;
    i.u = r;
    return true;
  };
  TreeContainer2.prototype.eraseElementByPos = function(e2) {
    if (e2 < 0 || e2 > this.M - 1) {
      throw new RangeError();
    }
    var r = 0;
    var i = this;
    this.ae(this.W, (function(t) {
      if (e2 === r) {
        i.G(t);
        return true;
      }
      r += 1;
      return false;
    }));
    return this.M;
  };
  TreeContainer2.prototype.eraseElementByKey = function(e2) {
    if (this.M === 0) return false;
    var r = this.g(this.W, e2);
    if (r === this.h) return false;
    this.G(r);
    return true;
  };
  TreeContainer2.prototype.eraseElementByIterator = function(e2) {
    var r = e2.o;
    if (r === this.h) {
      throwIteratorAccessError();
    }
    var i = r.N === void 0;
    var t = e2.iteratorType === 0;
    if (t) {
      if (i) e2.next();
    } else {
      if (!i || r.K === void 0) e2.next();
    }
    this.G(r);
    return e2;
  };
  TreeContainer2.prototype.forEach = function(e2) {
    var r, i;
    var t = 0;
    try {
      for (var n = __values$2(this), s = n.next(); !s.done; s = n.next()) {
        var f = s.value;
        e2(f, t++, this);
      }
    } catch (e3) {
      r = {
        error: e3
      };
    } finally {
      try {
        if (s && !s.done && (i = n.return)) i.call(n);
      } finally {
        if (r) throw r.error;
      }
    }
  };
  TreeContainer2.prototype.getElementByPos = function(e2) {
    var r, i;
    if (e2 < 0 || e2 > this.M - 1) {
      throw new RangeError();
    }
    var t;
    var n = 0;
    try {
      for (var s = __values$2(this), f = s.next(); !f.done; f = s.next()) {
        var h = f.value;
        if (n === e2) {
          t = h;
          break;
        }
        n += 1;
      }
    } catch (e3) {
      r = {
        error: e3
      };
    } finally {
      try {
        if (f && !f.done && (i = s.return)) i.call(s);
      } finally {
        if (r) throw r.error;
      }
    }
    return t;
  };
  TreeContainer2.prototype.getHeight = function() {
    if (this.M === 0) return 0;
    var traversal = function(e2) {
      if (!e2) return 0;
      return Math.max(traversal(e2.K), traversal(e2.N)) + 1;
    };
    return traversal(this.W);
  };
  return TreeContainer2;
})(Container);
var __extends$5 = /* @__PURE__ */ (function() {
  var extendStatics = function(r, t) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(r2, t2) {
      r2.__proto__ = t2;
    } || function(r2, t2) {
      for (var e in t2) if (Object.prototype.hasOwnProperty.call(t2, e)) r2[e] = t2[e];
    };
    return extendStatics(r, t);
  };
  return function(r, t) {
    if (typeof t !== "function" && t !== null) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    extendStatics(r, t);
    function __() {
      this.constructor = r;
    }
    r.prototype = t === null ? Object.create(t) : (__.prototype = t.prototype, new __());
  };
})();
var TreeIterator = (function(r) {
  __extends$5(TreeIterator2, r);
  function TreeIterator2(t, e, i) {
    var n = r.call(this, i) || this;
    n.o = t;
    n.h = e;
    if (n.iteratorType === 0) {
      n.pre = function() {
        if (this.o === this.h.K) {
          throwIteratorAccessError();
        }
        this.o = this.o.L();
        return this;
      };
      n.next = function() {
        if (this.o === this.h) {
          throwIteratorAccessError();
        }
        this.o = this.o.m();
        return this;
      };
    } else {
      n.pre = function() {
        if (this.o === this.h.N) {
          throwIteratorAccessError();
        }
        this.o = this.o.m();
        return this;
      };
      n.next = function() {
        if (this.o === this.h) {
          throwIteratorAccessError();
        }
        this.o = this.o.L();
        return this;
      };
    }
    return n;
  }
  Object.defineProperty(TreeIterator2.prototype, "index", {
    get: function() {
      var r2 = this.o;
      var t = this.h.rr;
      if (r2 === this.h) {
        if (t) {
          return t.tr - 1;
        }
        return 0;
      }
      var e = 0;
      if (r2.K) {
        e += r2.K.tr;
      }
      while (r2 !== t) {
        var i = r2.rr;
        if (r2 === i.N) {
          e += 1;
          if (i.K) {
            e += i.K.tr;
          }
        }
        r2 = i;
      }
      return e;
    },
    enumerable: false,
    configurable: true
  });
  return TreeIterator2;
})(ContainerIterator);
var __extends$4 = /* @__PURE__ */ (function() {
  var extendStatics = function(e, t) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(e2, t2) {
      e2.__proto__ = t2;
    } || function(e2, t2) {
      for (var r in t2) if (Object.prototype.hasOwnProperty.call(t2, r)) e2[r] = t2[r];
    };
    return extendStatics(e, t);
  };
  return function(e, t) {
    if (typeof t !== "function" && t !== null) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    extendStatics(e, t);
    function __() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (__.prototype = t.prototype, new __());
  };
})();
var __generator$3 = function(e, t) {
  var r = {
    label: 0,
    sent: function() {
      if (o[0] & 1) throw o[1];
      return o[1];
    },
    trys: [],
    ops: []
  }, n, i, o, u;
  return u = {
    next: verb(0),
    throw: verb(1),
    return: verb(2)
  }, typeof Symbol === "function" && (u[Symbol.iterator] = function() {
    return this;
  }), u;
  function verb(e2) {
    return function(t2) {
      return step([e2, t2]);
    };
  }
  function step(u2) {
    if (n) throw new TypeError("Generator is already executing.");
    while (r) try {
      if (n = 1, i && (o = u2[0] & 2 ? i["return"] : u2[0] ? i["throw"] || ((o = i["return"]) && o.call(i), 0) : i.next) && !(o = o.call(i, u2[1])).done) return o;
      if (i = 0, o) u2 = [u2[0] & 2, o.value];
      switch (u2[0]) {
        case 0:
        case 1:
          o = u2;
          break;
        case 4:
          r.label++;
          return {
            value: u2[1],
            done: false
          };
        case 5:
          r.label++;
          i = u2[1];
          u2 = [0];
          continue;
        case 7:
          u2 = r.ops.pop();
          r.trys.pop();
          continue;
        default:
          if (!(o = r.trys, o = o.length > 0 && o[o.length - 1]) && (u2[0] === 6 || u2[0] === 2)) {
            r = 0;
            continue;
          }
          if (u2[0] === 3 && (!o || u2[1] > o[0] && u2[1] < o[3])) {
            r.label = u2[1];
            break;
          }
          if (u2[0] === 6 && r.label < o[1]) {
            r.label = o[1];
            o = u2;
            break;
          }
          if (o && r.label < o[2]) {
            r.label = o[2];
            r.ops.push(u2);
            break;
          }
          if (o[2]) r.ops.pop();
          r.trys.pop();
          continue;
      }
      u2 = t.call(e, r);
    } catch (e2) {
      u2 = [6, e2];
      i = 0;
    } finally {
      n = o = 0;
    }
    if (u2[0] & 5) throw u2[1];
    return {
      value: u2[0] ? u2[1] : void 0,
      done: true
    };
  }
};
var __values$1 = function(e) {
  var t = typeof Symbol === "function" && Symbol.iterator, r = t && e[t], n = 0;
  if (r) return r.call(e);
  if (e && typeof e.length === "number") return {
    next: function() {
      if (e && n >= e.length) e = void 0;
      return {
        value: e && e[n++],
        done: !e
      };
    }
  };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var OrderedSetIterator = (function(e) {
  __extends$4(OrderedSetIterator2, e);
  function OrderedSetIterator2(t, r, n, i) {
    var o = e.call(this, t, r, i) || this;
    o.container = n;
    return o;
  }
  Object.defineProperty(OrderedSetIterator2.prototype, "pointer", {
    get: function() {
      if (this.o === this.h) {
        throwIteratorAccessError();
      }
      return this.o.u;
    },
    enumerable: false,
    configurable: true
  });
  OrderedSetIterator2.prototype.copy = function() {
    return new OrderedSetIterator2(this.o, this.h, this.container, this.iteratorType);
  };
  return OrderedSetIterator2;
})(TreeIterator);
var OrderedSet = (function(e) {
  __extends$4(OrderedSet2, e);
  function OrderedSet2(t, r, n) {
    if (t === void 0) {
      t = [];
    }
    var i = e.call(this, r, n) || this;
    var o = i;
    t.forEach((function(e2) {
      o.insert(e2);
    }));
    return i;
  }
  OrderedSet2.prototype.P = function(e2) {
    return __generator$3(this, (function(t) {
      switch (t.label) {
        case 0:
          if (e2 === void 0) return [2];
          return [5, __values$1(this.P(e2.K))];
        case 1:
          t.sent();
          return [4, e2.u];
        case 2:
          t.sent();
          return [5, __values$1(this.P(e2.N))];
        case 3:
          t.sent();
          return [2];
      }
    }));
  };
  OrderedSet2.prototype.begin = function() {
    return new OrderedSetIterator(this.h.K || this.h, this.h, this);
  };
  OrderedSet2.prototype.end = function() {
    return new OrderedSetIterator(this.h, this.h, this);
  };
  OrderedSet2.prototype.rBegin = function() {
    return new OrderedSetIterator(this.h.N || this.h, this.h, this, 1);
  };
  OrderedSet2.prototype.rEnd = function() {
    return new OrderedSetIterator(this.h, this.h, this, 1);
  };
  OrderedSet2.prototype.front = function() {
    return this.h.K ? this.h.K.u : void 0;
  };
  OrderedSet2.prototype.back = function() {
    return this.h.N ? this.h.N.u : void 0;
  };
  OrderedSet2.prototype.insert = function(e2, t) {
    return this.v(e2, void 0, t);
  };
  OrderedSet2.prototype.find = function(e2) {
    var t = this.g(this.W, e2);
    return new OrderedSetIterator(t, this.h, this);
  };
  OrderedSet2.prototype.lowerBound = function(e2) {
    var t = this.U(this.W, e2);
    return new OrderedSetIterator(t, this.h, this);
  };
  OrderedSet2.prototype.upperBound = function(e2) {
    var t = this.X(this.W, e2);
    return new OrderedSetIterator(t, this.h, this);
  };
  OrderedSet2.prototype.reverseLowerBound = function(e2) {
    var t = this.Y(this.W, e2);
    return new OrderedSetIterator(t, this.h, this);
  };
  OrderedSet2.prototype.reverseUpperBound = function(e2) {
    var t = this.Z(this.W, e2);
    return new OrderedSetIterator(t, this.h, this);
  };
  OrderedSet2.prototype.union = function(e2) {
    var t = this;
    e2.forEach((function(e3) {
      t.insert(e3);
    }));
    return this.M;
  };
  OrderedSet2.prototype[Symbol.iterator] = function() {
    return this.P(this.W);
  };
  return OrderedSet2;
})(TreeContainer);
var __extends$3 = /* @__PURE__ */ (function() {
  var extendStatics = function(r, e) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(r2, e2) {
      r2.__proto__ = e2;
    } || function(r2, e2) {
      for (var t in e2) if (Object.prototype.hasOwnProperty.call(e2, t)) r2[t] = e2[t];
    };
    return extendStatics(r, e);
  };
  return function(r, e) {
    if (typeof e !== "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
    extendStatics(r, e);
    function __() {
      this.constructor = r;
    }
    r.prototype = e === null ? Object.create(e) : (__.prototype = e.prototype, new __());
  };
})();
var __generator$2 = function(r, e) {
  var t = {
    label: 0,
    sent: function() {
      if (o[0] & 1) throw o[1];
      return o[1];
    },
    trys: [],
    ops: []
  }, n, i, o, a;
  return a = {
    next: verb(0),
    throw: verb(1),
    return: verb(2)
  }, typeof Symbol === "function" && (a[Symbol.iterator] = function() {
    return this;
  }), a;
  function verb(r2) {
    return function(e2) {
      return step([r2, e2]);
    };
  }
  function step(a2) {
    if (n) throw new TypeError("Generator is already executing.");
    while (t) try {
      if (n = 1, i && (o = a2[0] & 2 ? i["return"] : a2[0] ? i["throw"] || ((o = i["return"]) && o.call(i), 0) : i.next) && !(o = o.call(i, a2[1])).done) return o;
      if (i = 0, o) a2 = [a2[0] & 2, o.value];
      switch (a2[0]) {
        case 0:
        case 1:
          o = a2;
          break;
        case 4:
          t.label++;
          return {
            value: a2[1],
            done: false
          };
        case 5:
          t.label++;
          i = a2[1];
          a2 = [0];
          continue;
        case 7:
          a2 = t.ops.pop();
          t.trys.pop();
          continue;
        default:
          if (!(o = t.trys, o = o.length > 0 && o[o.length - 1]) && (a2[0] === 6 || a2[0] === 2)) {
            t = 0;
            continue;
          }
          if (a2[0] === 3 && (!o || a2[1] > o[0] && a2[1] < o[3])) {
            t.label = a2[1];
            break;
          }
          if (a2[0] === 6 && t.label < o[1]) {
            t.label = o[1];
            o = a2;
            break;
          }
          if (o && t.label < o[2]) {
            t.label = o[2];
            t.ops.push(a2);
            break;
          }
          if (o[2]) t.ops.pop();
          t.trys.pop();
          continue;
      }
      a2 = e.call(r, t);
    } catch (r2) {
      a2 = [6, r2];
      i = 0;
    } finally {
      n = o = 0;
    }
    if (a2[0] & 5) throw a2[1];
    return {
      value: a2[0] ? a2[1] : void 0,
      done: true
    };
  }
};
var __values = function(r) {
  var e = typeof Symbol === "function" && Symbol.iterator, t = e && r[e], n = 0;
  if (t) return t.call(r);
  if (r && typeof r.length === "number") return {
    next: function() {
      if (r && n >= r.length) r = void 0;
      return {
        value: r && r[n++],
        done: !r
      };
    }
  };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var OrderedMapIterator = (function(r) {
  __extends$3(OrderedMapIterator2, r);
  function OrderedMapIterator2(e, t, n, i) {
    var o = r.call(this, e, t, i) || this;
    o.container = n;
    return o;
  }
  Object.defineProperty(OrderedMapIterator2.prototype, "pointer", {
    get: function() {
      if (this.o === this.h) {
        throwIteratorAccessError();
      }
      var r2 = this;
      return new Proxy([], {
        get: function(e, t) {
          if (t === "0") return r2.o.u;
          else if (t === "1") return r2.o.p;
        },
        set: function(e, t, n) {
          if (t !== "1") {
            throw new TypeError("props must be 1");
          }
          r2.o.p = n;
          return true;
        }
      });
    },
    enumerable: false,
    configurable: true
  });
  OrderedMapIterator2.prototype.copy = function() {
    return new OrderedMapIterator2(this.o, this.h, this.container, this.iteratorType);
  };
  return OrderedMapIterator2;
})(TreeIterator);
var OrderedMap = (function(r) {
  __extends$3(OrderedMap2, r);
  function OrderedMap2(e, t, n) {
    if (e === void 0) {
      e = [];
    }
    var i = r.call(this, t, n) || this;
    var o = i;
    e.forEach((function(r2) {
      o.setElement(r2[0], r2[1]);
    }));
    return i;
  }
  OrderedMap2.prototype.P = function(r2) {
    return __generator$2(this, (function(e) {
      switch (e.label) {
        case 0:
          if (r2 === void 0) return [2];
          return [5, __values(this.P(r2.K))];
        case 1:
          e.sent();
          return [4, [r2.u, r2.p]];
        case 2:
          e.sent();
          return [5, __values(this.P(r2.N))];
        case 3:
          e.sent();
          return [2];
      }
    }));
  };
  OrderedMap2.prototype.begin = function() {
    return new OrderedMapIterator(this.h.K || this.h, this.h, this);
  };
  OrderedMap2.prototype.end = function() {
    return new OrderedMapIterator(this.h, this.h, this);
  };
  OrderedMap2.prototype.rBegin = function() {
    return new OrderedMapIterator(this.h.N || this.h, this.h, this, 1);
  };
  OrderedMap2.prototype.rEnd = function() {
    return new OrderedMapIterator(this.h, this.h, this, 1);
  };
  OrderedMap2.prototype.front = function() {
    if (this.M === 0) return;
    var r2 = this.h.K;
    return [r2.u, r2.p];
  };
  OrderedMap2.prototype.back = function() {
    if (this.M === 0) return;
    var r2 = this.h.N;
    return [r2.u, r2.p];
  };
  OrderedMap2.prototype.lowerBound = function(r2) {
    var e = this.U(this.W, r2);
    return new OrderedMapIterator(e, this.h, this);
  };
  OrderedMap2.prototype.upperBound = function(r2) {
    var e = this.X(this.W, r2);
    return new OrderedMapIterator(e, this.h, this);
  };
  OrderedMap2.prototype.reverseLowerBound = function(r2) {
    var e = this.Y(this.W, r2);
    return new OrderedMapIterator(e, this.h, this);
  };
  OrderedMap2.prototype.reverseUpperBound = function(r2) {
    var e = this.Z(this.W, r2);
    return new OrderedMapIterator(e, this.h, this);
  };
  OrderedMap2.prototype.setElement = function(r2, e, t) {
    return this.v(r2, e, t);
  };
  OrderedMap2.prototype.find = function(r2) {
    var e = this.g(this.W, r2);
    return new OrderedMapIterator(e, this.h, this);
  };
  OrderedMap2.prototype.getElementByKey = function(r2) {
    var e = this.g(this.W, r2);
    return e.p;
  };
  OrderedMap2.prototype.union = function(r2) {
    var e = this;
    r2.forEach((function(r3) {
      e.setElement(r3[0], r3[1]);
    }));
    return this.M;
  };
  OrderedMap2.prototype[Symbol.iterator] = function() {
    return this.P(this.W);
  };
  return OrderedMap2;
})(TreeContainer);
function checkObject(t) {
  var e = typeof t;
  return e === "object" && t !== null || e === "function";
}
var __extends$2 = /* @__PURE__ */ (function() {
  var extendStatics = function(t, i) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(t2, i2) {
      t2.__proto__ = i2;
    } || function(t2, i2) {
      for (var r in i2) if (Object.prototype.hasOwnProperty.call(i2, r)) t2[r] = i2[r];
    };
    return extendStatics(t, i);
  };
  return function(t, i) {
    if (typeof i !== "function" && i !== null) throw new TypeError("Class extends value " + String(i) + " is not a constructor or null");
    extendStatics(t, i);
    function __() {
      this.constructor = t;
    }
    t.prototype = i === null ? Object.create(i) : (__.prototype = i.prototype, new __());
  };
})();
var HashContainerIterator = (function(t) {
  __extends$2(HashContainerIterator2, t);
  function HashContainerIterator2(i, r, e) {
    var n = t.call(this, e) || this;
    n.o = i;
    n.h = r;
    if (n.iteratorType === 0) {
      n.pre = function() {
        if (this.o.L === this.h) {
          throwIteratorAccessError();
        }
        this.o = this.o.L;
        return this;
      };
      n.next = function() {
        if (this.o === this.h) {
          throwIteratorAccessError();
        }
        this.o = this.o.m;
        return this;
      };
    } else {
      n.pre = function() {
        if (this.o.m === this.h) {
          throwIteratorAccessError();
        }
        this.o = this.o.m;
        return this;
      };
      n.next = function() {
        if (this.o === this.h) {
          throwIteratorAccessError();
        }
        this.o = this.o.L;
        return this;
      };
    }
    return n;
  }
  return HashContainerIterator2;
})(ContainerIterator);
var HashContainer = (function(t) {
  __extends$2(HashContainer2, t);
  function HashContainer2() {
    var i = t.call(this) || this;
    i._ = [];
    i.I = {};
    i.HASH_TAG = Symbol("@@HASH_TAG");
    Object.setPrototypeOf(i.I, null);
    i.h = {};
    i.h.L = i.h.m = i.H = i.l = i.h;
    return i;
  }
  HashContainer2.prototype.G = function(t2) {
    var i = t2.L, r = t2.m;
    i.m = r;
    r.L = i;
    if (t2 === this.H) {
      this.H = r;
    }
    if (t2 === this.l) {
      this.l = i;
    }
    this.M -= 1;
  };
  HashContainer2.prototype.v = function(t2, i, r) {
    if (r === void 0) r = checkObject(t2);
    var e;
    if (r) {
      var n = t2[this.HASH_TAG];
      if (n !== void 0) {
        this._[n].p = i;
        return this.M;
      }
      Object.defineProperty(t2, this.HASH_TAG, {
        value: this._.length,
        configurable: true
      });
      e = {
        u: t2,
        p: i,
        L: this.l,
        m: this.h
      };
      this._.push(e);
    } else {
      var s = this.I[t2];
      if (s) {
        s.p = i;
        return this.M;
      }
      e = {
        u: t2,
        p: i,
        L: this.l,
        m: this.h
      };
      this.I[t2] = e;
    }
    if (this.M === 0) {
      this.H = e;
      this.h.m = e;
    } else {
      this.l.m = e;
    }
    this.l = e;
    this.h.L = e;
    return ++this.M;
  };
  HashContainer2.prototype.g = function(t2, i) {
    if (i === void 0) i = checkObject(t2);
    if (i) {
      var r = t2[this.HASH_TAG];
      if (r === void 0) return this.h;
      return this._[r];
    } else {
      return this.I[t2] || this.h;
    }
  };
  HashContainer2.prototype.clear = function() {
    var t2 = this.HASH_TAG;
    this._.forEach((function(i) {
      delete i.u[t2];
    }));
    this._ = [];
    this.I = {};
    Object.setPrototypeOf(this.I, null);
    this.M = 0;
    this.H = this.l = this.h.L = this.h.m = this.h;
  };
  HashContainer2.prototype.eraseElementByKey = function(t2, i) {
    var r;
    if (i === void 0) i = checkObject(t2);
    if (i) {
      var e = t2[this.HASH_TAG];
      if (e === void 0) return false;
      delete t2[this.HASH_TAG];
      r = this._[e];
      delete this._[e];
    } else {
      r = this.I[t2];
      if (r === void 0) return false;
      delete this.I[t2];
    }
    this.G(r);
    return true;
  };
  HashContainer2.prototype.eraseElementByIterator = function(t2) {
    var i = t2.o;
    if (i === this.h) {
      throwIteratorAccessError();
    }
    this.G(i);
    return t2.next();
  };
  HashContainer2.prototype.eraseElementByPos = function(t2) {
    if (t2 < 0 || t2 > this.M - 1) {
      throw new RangeError();
    }
    var i = this.H;
    while (t2--) {
      i = i.m;
    }
    this.G(i);
    return this.M;
  };
  return HashContainer2;
})(Container);
var __extends$1 = /* @__PURE__ */ (function() {
  var extendStatics = function(t, r) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(t2, r2) {
      t2.__proto__ = r2;
    } || function(t2, r2) {
      for (var e in r2) if (Object.prototype.hasOwnProperty.call(r2, e)) t2[e] = r2[e];
    };
    return extendStatics(t, r);
  };
  return function(t, r) {
    if (typeof r !== "function" && r !== null) throw new TypeError("Class extends value " + String(r) + " is not a constructor or null");
    extendStatics(t, r);
    function __() {
      this.constructor = t;
    }
    t.prototype = r === null ? Object.create(r) : (__.prototype = r.prototype, new __());
  };
})();
var __generator$1 = function(t, r) {
  var e = {
    label: 0,
    sent: function() {
      if (s[0] & 1) throw s[1];
      return s[1];
    },
    trys: [],
    ops: []
  }, n, i, s, a;
  return a = {
    next: verb(0),
    throw: verb(1),
    return: verb(2)
  }, typeof Symbol === "function" && (a[Symbol.iterator] = function() {
    return this;
  }), a;
  function verb(t2) {
    return function(r2) {
      return step([t2, r2]);
    };
  }
  function step(a2) {
    if (n) throw new TypeError("Generator is already executing.");
    while (e) try {
      if (n = 1, i && (s = a2[0] & 2 ? i["return"] : a2[0] ? i["throw"] || ((s = i["return"]) && s.call(i), 0) : i.next) && !(s = s.call(i, a2[1])).done) return s;
      if (i = 0, s) a2 = [a2[0] & 2, s.value];
      switch (a2[0]) {
        case 0:
        case 1:
          s = a2;
          break;
        case 4:
          e.label++;
          return {
            value: a2[1],
            done: false
          };
        case 5:
          e.label++;
          i = a2[1];
          a2 = [0];
          continue;
        case 7:
          a2 = e.ops.pop();
          e.trys.pop();
          continue;
        default:
          if (!(s = e.trys, s = s.length > 0 && s[s.length - 1]) && (a2[0] === 6 || a2[0] === 2)) {
            e = 0;
            continue;
          }
          if (a2[0] === 3 && (!s || a2[1] > s[0] && a2[1] < s[3])) {
            e.label = a2[1];
            break;
          }
          if (a2[0] === 6 && e.label < s[1]) {
            e.label = s[1];
            s = a2;
            break;
          }
          if (s && e.label < s[2]) {
            e.label = s[2];
            e.ops.push(a2);
            break;
          }
          if (s[2]) e.ops.pop();
          e.trys.pop();
          continue;
      }
      a2 = r.call(t, e);
    } catch (t2) {
      a2 = [6, t2];
      i = 0;
    } finally {
      n = s = 0;
    }
    if (a2[0] & 5) throw a2[1];
    return {
      value: a2[0] ? a2[1] : void 0,
      done: true
    };
  }
};
var HashSetIterator = (function(t) {
  __extends$1(HashSetIterator2, t);
  function HashSetIterator2(r, e, n, i) {
    var s = t.call(this, r, e, i) || this;
    s.container = n;
    return s;
  }
  Object.defineProperty(HashSetIterator2.prototype, "pointer", {
    get: function() {
      if (this.o === this.h) {
        throwIteratorAccessError();
      }
      return this.o.u;
    },
    enumerable: false,
    configurable: true
  });
  HashSetIterator2.prototype.copy = function() {
    return new HashSetIterator2(this.o, this.h, this.container, this.iteratorType);
  };
  return HashSetIterator2;
})(HashContainerIterator);
var HashSet = (function(t) {
  __extends$1(HashSet2, t);
  function HashSet2(r) {
    if (r === void 0) {
      r = [];
    }
    var e = t.call(this) || this;
    var n = e;
    r.forEach((function(t2) {
      n.insert(t2);
    }));
    return e;
  }
  HashSet2.prototype.begin = function() {
    return new HashSetIterator(this.H, this.h, this);
  };
  HashSet2.prototype.end = function() {
    return new HashSetIterator(this.h, this.h, this);
  };
  HashSet2.prototype.rBegin = function() {
    return new HashSetIterator(this.l, this.h, this, 1);
  };
  HashSet2.prototype.rEnd = function() {
    return new HashSetIterator(this.h, this.h, this, 1);
  };
  HashSet2.prototype.front = function() {
    return this.H.u;
  };
  HashSet2.prototype.back = function() {
    return this.l.u;
  };
  HashSet2.prototype.insert = function(t2, r) {
    return this.v(t2, void 0, r);
  };
  HashSet2.prototype.getElementByPos = function(t2) {
    if (t2 < 0 || t2 > this.M - 1) {
      throw new RangeError();
    }
    var r = this.H;
    while (t2--) {
      r = r.m;
    }
    return r.u;
  };
  HashSet2.prototype.find = function(t2, r) {
    var e = this.g(t2, r);
    return new HashSetIterator(e, this.h, this);
  };
  HashSet2.prototype.forEach = function(t2) {
    var r = 0;
    var e = this.H;
    while (e !== this.h) {
      t2(e.u, r++, this);
      e = e.m;
    }
  };
  HashSet2.prototype[Symbol.iterator] = function() {
    return (function() {
      var t2;
      return __generator$1(this, (function(r) {
        switch (r.label) {
          case 0:
            t2 = this.H;
            r.label = 1;
          case 1:
            if (!(t2 !== this.h)) return [3, 3];
            return [4, t2.u];
          case 2:
            r.sent();
            t2 = t2.m;
            return [3, 1];
          case 3:
            return [2];
        }
      }));
    }).bind(this)();
  };
  return HashSet2;
})(HashContainer);
var __extends = /* @__PURE__ */ (function() {
  var extendStatics = function(t, r) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(t2, r2) {
      t2.__proto__ = r2;
    } || function(t2, r2) {
      for (var n in r2) if (Object.prototype.hasOwnProperty.call(r2, n)) t2[n] = r2[n];
    };
    return extendStatics(t, r);
  };
  return function(t, r) {
    if (typeof r !== "function" && r !== null) throw new TypeError("Class extends value " + String(r) + " is not a constructor or null");
    extendStatics(t, r);
    function __() {
      this.constructor = t;
    }
    t.prototype = r === null ? Object.create(r) : (__.prototype = r.prototype, new __());
  };
})();
var __generator = function(t, r) {
  var n = {
    label: 0,
    sent: function() {
      if (a[0] & 1) throw a[1];
      return a[1];
    },
    trys: [],
    ops: []
  }, e, i, a, s;
  return s = {
    next: verb(0),
    throw: verb(1),
    return: verb(2)
  }, typeof Symbol === "function" && (s[Symbol.iterator] = function() {
    return this;
  }), s;
  function verb(t2) {
    return function(r2) {
      return step([t2, r2]);
    };
  }
  function step(s2) {
    if (e) throw new TypeError("Generator is already executing.");
    while (n) try {
      if (e = 1, i && (a = s2[0] & 2 ? i["return"] : s2[0] ? i["throw"] || ((a = i["return"]) && a.call(i), 0) : i.next) && !(a = a.call(i, s2[1])).done) return a;
      if (i = 0, a) s2 = [s2[0] & 2, a.value];
      switch (s2[0]) {
        case 0:
        case 1:
          a = s2;
          break;
        case 4:
          n.label++;
          return {
            value: s2[1],
            done: false
          };
        case 5:
          n.label++;
          i = s2[1];
          s2 = [0];
          continue;
        case 7:
          s2 = n.ops.pop();
          n.trys.pop();
          continue;
        default:
          if (!(a = n.trys, a = a.length > 0 && a[a.length - 1]) && (s2[0] === 6 || s2[0] === 2)) {
            n = 0;
            continue;
          }
          if (s2[0] === 3 && (!a || s2[1] > a[0] && s2[1] < a[3])) {
            n.label = s2[1];
            break;
          }
          if (s2[0] === 6 && n.label < a[1]) {
            n.label = a[1];
            a = s2;
            break;
          }
          if (a && n.label < a[2]) {
            n.label = a[2];
            n.ops.push(s2);
            break;
          }
          if (a[2]) n.ops.pop();
          n.trys.pop();
          continue;
      }
      s2 = r.call(t, n);
    } catch (t2) {
      s2 = [6, t2];
      i = 0;
    } finally {
      e = a = 0;
    }
    if (s2[0] & 5) throw s2[1];
    return {
      value: s2[0] ? s2[1] : void 0,
      done: true
    };
  }
};
var HashMapIterator = (function(t) {
  __extends(HashMapIterator2, t);
  function HashMapIterator2(r, n, e, i) {
    var a = t.call(this, r, n, i) || this;
    a.container = e;
    return a;
  }
  Object.defineProperty(HashMapIterator2.prototype, "pointer", {
    get: function() {
      if (this.o === this.h) {
        throwIteratorAccessError();
      }
      var t2 = this;
      return new Proxy([], {
        get: function(r, n) {
          if (n === "0") return t2.o.u;
          else if (n === "1") return t2.o.p;
        },
        set: function(r, n, e) {
          if (n !== "1") {
            throw new TypeError("props must be 1");
          }
          t2.o.p = e;
          return true;
        }
      });
    },
    enumerable: false,
    configurable: true
  });
  HashMapIterator2.prototype.copy = function() {
    return new HashMapIterator2(this.o, this.h, this.container, this.iteratorType);
  };
  return HashMapIterator2;
})(HashContainerIterator);
var HashMap = (function(t) {
  __extends(HashMap2, t);
  function HashMap2(r) {
    if (r === void 0) {
      r = [];
    }
    var n = t.call(this) || this;
    var e = n;
    r.forEach((function(t2) {
      e.setElement(t2[0], t2[1]);
    }));
    return n;
  }
  HashMap2.prototype.begin = function() {
    return new HashMapIterator(this.H, this.h, this);
  };
  HashMap2.prototype.end = function() {
    return new HashMapIterator(this.h, this.h, this);
  };
  HashMap2.prototype.rBegin = function() {
    return new HashMapIterator(this.l, this.h, this, 1);
  };
  HashMap2.prototype.rEnd = function() {
    return new HashMapIterator(this.h, this.h, this, 1);
  };
  HashMap2.prototype.front = function() {
    if (this.M === 0) return;
    return [this.H.u, this.H.p];
  };
  HashMap2.prototype.back = function() {
    if (this.M === 0) return;
    return [this.l.u, this.l.p];
  };
  HashMap2.prototype.setElement = function(t2, r, n) {
    return this.v(t2, r, n);
  };
  HashMap2.prototype.getElementByKey = function(t2, r) {
    if (r === void 0) r = checkObject(t2);
    if (r) {
      var n = t2[this.HASH_TAG];
      return n !== void 0 ? this._[n].p : void 0;
    }
    var e = this.I[t2];
    return e ? e.p : void 0;
  };
  HashMap2.prototype.getElementByPos = function(t2) {
    if (t2 < 0 || t2 > this.M - 1) {
      throw new RangeError();
    }
    var r = this.H;
    while (t2--) {
      r = r.m;
    }
    return [r.u, r.p];
  };
  HashMap2.prototype.find = function(t2, r) {
    var n = this.g(t2, r);
    return new HashMapIterator(n, this.h, this);
  };
  HashMap2.prototype.forEach = function(t2) {
    var r = 0;
    var n = this.H;
    while (n !== this.h) {
      t2([n.u, n.p], r++, this);
      n = n.m;
    }
  };
  HashMap2.prototype[Symbol.iterator] = function() {
    return (function() {
      var t2;
      return __generator(this, (function(r) {
        switch (r.label) {
          case 0:
            t2 = this.H;
            r.label = 1;
          case 1:
            if (!(t2 !== this.h)) return [3, 3];
            return [4, [t2.u, t2.p]];
          case 2:
            r.sent();
            t2 = t2.m;
            return [3, 1];
          case 3:
            return [2];
        }
      }));
    }).bind(this)();
  };
  return HashMap2;
})(HashContainer);
const esm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Deque,
  HashMap,
  HashSet,
  LinkList,
  OrderedMap,
  OrderedSet,
  PriorityQueue,
  Queue,
  Stack,
  Vector
}, Symbol.toStringTag, { value: "Module" }));
const require$$0$1 = /* @__PURE__ */ getAugmentedNamespace(esm);
var numberAllocator;
var hasRequiredNumberAllocator$1;
function requireNumberAllocator$1() {
  if (hasRequiredNumberAllocator$1) return numberAllocator;
  hasRequiredNumberAllocator$1 = 1;
  const SortedSet = require$$0$1.OrderedSet;
  const debugTrace = requireSrc()("number-allocator:trace");
  const debugError = requireSrc()("number-allocator:error");
  function Interval(low, high) {
    this.low = low;
    this.high = high;
  }
  Interval.prototype.equals = function(other) {
    return this.low === other.low && this.high === other.high;
  };
  Interval.prototype.compare = function(other) {
    if (this.low < other.low && this.high < other.low) return -1;
    if (other.low < this.low && other.high < this.low) return 1;
    return 0;
  };
  function NumberAllocator(min, max) {
    if (!(this instanceof NumberAllocator)) {
      return new NumberAllocator(min, max);
    }
    this.min = min;
    this.max = max;
    this.ss = new SortedSet(
      [],
      (lhs, rhs) => {
        return lhs.compare(rhs);
      }
    );
    debugTrace("Create");
    this.clear();
  }
  NumberAllocator.prototype.firstVacant = function() {
    if (this.ss.size() === 0) return null;
    return this.ss.front().low;
  };
  NumberAllocator.prototype.alloc = function() {
    if (this.ss.size() === 0) {
      debugTrace("alloc():empty");
      return null;
    }
    const it = this.ss.begin();
    const low = it.pointer.low;
    const high = it.pointer.high;
    const num = low;
    if (num + 1 <= high) {
      this.ss.updateKeyByIterator(it, new Interval(low + 1, high));
    } else {
      this.ss.eraseElementByPos(0);
    }
    debugTrace("alloc():" + num);
    return num;
  };
  NumberAllocator.prototype.use = function(num) {
    const key = new Interval(num, num);
    const it = this.ss.lowerBound(key);
    if (!it.equals(this.ss.end())) {
      const low = it.pointer.low;
      const high = it.pointer.high;
      if (it.pointer.equals(key)) {
        this.ss.eraseElementByIterator(it);
        debugTrace("use():" + num);
        return true;
      }
      if (low > num) return false;
      if (low === num) {
        this.ss.updateKeyByIterator(it, new Interval(low + 1, high));
        debugTrace("use():" + num);
        return true;
      }
      if (high === num) {
        this.ss.updateKeyByIterator(it, new Interval(low, high - 1));
        debugTrace("use():" + num);
        return true;
      }
      this.ss.updateKeyByIterator(it, new Interval(num + 1, high));
      this.ss.insert(new Interval(low, num - 1));
      debugTrace("use():" + num);
      return true;
    }
    debugTrace("use():failed");
    return false;
  };
  NumberAllocator.prototype.free = function(num) {
    if (num < this.min || num > this.max) {
      debugError("free():" + num + " is out of range");
      return;
    }
    const key = new Interval(num, num);
    const it = this.ss.upperBound(key);
    if (it.equals(this.ss.end())) {
      if (it.equals(this.ss.begin())) {
        this.ss.insert(key);
        return;
      }
      it.pre();
      const low = it.pointer.high;
      const high = it.pointer.high;
      if (high + 1 === num) {
        this.ss.updateKeyByIterator(it, new Interval(low, num));
      } else {
        this.ss.insert(key);
      }
    } else {
      if (it.equals(this.ss.begin())) {
        if (num + 1 === it.pointer.low) {
          const high = it.pointer.high;
          this.ss.updateKeyByIterator(it, new Interval(num, high));
        } else {
          this.ss.insert(key);
        }
      } else {
        const rLow = it.pointer.low;
        const rHigh = it.pointer.high;
        it.pre();
        const lLow = it.pointer.low;
        const lHigh = it.pointer.high;
        if (lHigh + 1 === num) {
          if (num + 1 === rLow) {
            this.ss.eraseElementByIterator(it);
            this.ss.updateKeyByIterator(it, new Interval(lLow, rHigh));
          } else {
            this.ss.updateKeyByIterator(it, new Interval(lLow, num));
          }
        } else {
          if (num + 1 === rLow) {
            this.ss.eraseElementByIterator(it.next());
            this.ss.insert(new Interval(num, rHigh));
          } else {
            this.ss.insert(key);
          }
        }
      }
    }
    debugTrace("free():" + num);
  };
  NumberAllocator.prototype.clear = function() {
    debugTrace("clear()");
    this.ss.clear();
    this.ss.insert(new Interval(this.min, this.max));
  };
  NumberAllocator.prototype.intervalCount = function() {
    return this.ss.size();
  };
  NumberAllocator.prototype.dump = function() {
    console.log("length:" + this.ss.size());
    for (const element of this.ss) {
      console.log(element);
    }
  };
  numberAllocator = NumberAllocator;
  return numberAllocator;
}
var hasRequiredNumberAllocator;
function requireNumberAllocator() {
  if (hasRequiredNumberAllocator) return numberAllocator$1;
  hasRequiredNumberAllocator = 1;
  const NumberAllocator = requireNumberAllocator$1();
  numberAllocator$1.NumberAllocator = NumberAllocator;
  return numberAllocator$1;
}
var hasRequiredTopicAliasSend;
function requireTopicAliasSend() {
  if (hasRequiredTopicAliasSend) return topicAliasSend;
  hasRequiredTopicAliasSend = 1;
  Object.defineProperty(topicAliasSend, "__esModule", { value: true });
  const lru_cache_1 = /* @__PURE__ */ requireCommonjs();
  const number_allocator_1 = requireNumberAllocator();
  class TopicAliasSend {
    constructor(max) {
      __publicField(this, "aliasToTopic");
      __publicField(this, "topicToAlias");
      __publicField(this, "max");
      __publicField(this, "numberAllocator");
      __publicField(this, "length");
      if (max > 0) {
        this.aliasToTopic = new lru_cache_1.LRUCache({ max });
        this.topicToAlias = {};
        this.numberAllocator = new number_allocator_1.NumberAllocator(1, max);
        this.max = max;
        this.length = 0;
      }
    }
    put(topic, alias) {
      if (alias === 0 || alias > this.max) {
        return false;
      }
      const entry = this.aliasToTopic.get(alias);
      if (entry) {
        delete this.topicToAlias[entry];
      }
      this.aliasToTopic.set(alias, topic);
      this.topicToAlias[topic] = alias;
      this.numberAllocator.use(alias);
      this.length = this.aliasToTopic.size;
      return true;
    }
    getTopicByAlias(alias) {
      return this.aliasToTopic.get(alias);
    }
    getAliasByTopic(topic) {
      const alias = this.topicToAlias[topic];
      if (typeof alias !== "undefined") {
        this.aliasToTopic.get(alias);
      }
      return alias;
    }
    clear() {
      this.aliasToTopic.clear();
      this.topicToAlias = {};
      this.numberAllocator.clear();
      this.length = 0;
    }
    getLruAlias() {
      const alias = this.numberAllocator.firstVacant();
      if (alias)
        return alias;
      return [...this.aliasToTopic.keys()][this.aliasToTopic.size - 1];
    }
  }
  topicAliasSend.default = TopicAliasSend;
  return topicAliasSend;
}
var hasRequiredConnack;
function requireConnack() {
  if (hasRequiredConnack) return connack;
  hasRequiredConnack = 1;
  var __importDefault = connack && connack.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(connack, "__esModule", { value: true });
  const ack_1 = requireAck();
  const topic_alias_send_1 = __importDefault(requireTopicAliasSend());
  const shared_1 = requireShared();
  const handleConnack = (client2, packet2) => {
    client2.log("_handleConnack");
    const { options } = client2;
    const version2 = options.protocolVersion;
    const rc = version2 === 5 ? packet2.reasonCode : packet2.returnCode;
    clearTimeout(client2["connackTimer"]);
    delete client2["topicAliasSend"];
    if (packet2.properties) {
      if (packet2.properties.topicAliasMaximum) {
        if (packet2.properties.topicAliasMaximum > 65535) {
          client2.emit("error", new Error("topicAliasMaximum from broker is out of range"));
          return;
        }
        if (packet2.properties.topicAliasMaximum > 0) {
          client2["topicAliasSend"] = new topic_alias_send_1.default(packet2.properties.topicAliasMaximum);
        }
      }
      if (packet2.properties.serverKeepAlive && options.keepalive) {
        options.keepalive = packet2.properties.serverKeepAlive;
      }
      if (packet2.properties.maximumPacketSize) {
        if (!options.properties) {
          options.properties = {};
        }
        options.properties.maximumPacketSize = packet2.properties.maximumPacketSize;
      }
    }
    if (rc === 0) {
      client2.reconnecting = false;
      client2["_onConnect"](packet2);
    } else if (rc > 0) {
      const err = new shared_1.ErrorWithReasonCode(`Connection refused: ${ack_1.ReasonCodes[rc]}`, rc);
      client2.emit("error", err);
      if (client2.options.reconnectOnConnackError) {
        client2["_cleanUp"](true);
      }
    }
  };
  connack.default = handleConnack;
  return connack;
}
var pubrel = {};
var hasRequiredPubrel;
function requirePubrel() {
  if (hasRequiredPubrel) return pubrel;
  hasRequiredPubrel = 1;
  Object.defineProperty(pubrel, "__esModule", { value: true });
  const handlePubrel = (client2, packet2, done) => {
    client2.log("handling pubrel packet");
    const callback = typeof done !== "undefined" ? done : client2.noop;
    const { messageId } = packet2;
    const comp = { cmd: "pubcomp", messageId };
    client2.incomingStore.get(packet2, (err, pub) => {
      if (!err) {
        client2.emit("message", pub.topic, pub.payload, pub);
        client2.handleMessage(pub, (err2) => {
          if (err2) {
            return callback(err2);
          }
          client2.incomingStore.del(pub, client2.noop);
          client2["_sendPacket"](comp, callback);
        });
      } else {
        client2["_sendPacket"](comp, callback);
      }
    });
  };
  pubrel.default = handlePubrel;
  return pubrel;
}
var hasRequiredHandlers;
function requireHandlers() {
  if (hasRequiredHandlers) return handlers;
  hasRequiredHandlers = 1;
  var __importDefault = handlers && handlers.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(handlers, "__esModule", { value: true });
  const publish_1 = __importDefault(requirePublish());
  const auth_1 = __importDefault(requireAuth());
  const connack_1 = __importDefault(requireConnack());
  const ack_1 = __importDefault(requireAck());
  const pubrel_1 = __importDefault(requirePubrel());
  const handle = (client2, packet2, done) => {
    const { options } = client2;
    if (options.protocolVersion === 5 && options.properties && options.properties.maximumPacketSize && options.properties.maximumPacketSize < packet2.length) {
      client2.emit("error", new Error(`exceeding packets size ${packet2.cmd}`));
      client2.end({
        reasonCode: 149,
        properties: { reasonString: "Maximum packet size was exceeded" }
      });
      return client2;
    }
    client2.log("_handlePacket :: emitting packetreceive");
    client2.emit("packetreceive", packet2);
    switch (packet2.cmd) {
      case "publish":
        (0, publish_1.default)(client2, packet2, done);
        break;
      case "puback":
      case "pubrec":
      case "pubcomp":
      case "suback":
      case "unsuback":
        client2.reschedulePing();
        (0, ack_1.default)(client2, packet2);
        done();
        break;
      case "pubrel":
        client2.reschedulePing();
        (0, pubrel_1.default)(client2, packet2, done);
        break;
      case "connack":
        (0, connack_1.default)(client2, packet2);
        done();
        break;
      case "auth":
        client2.reschedulePing();
        (0, auth_1.default)(client2, packet2);
        done();
        break;
      case "pingresp":
        client2.log("_handlePacket :: received pingresp");
        client2.reschedulePing(true);
        done();
        break;
      case "disconnect":
        client2.emit("disconnect", packet2);
        done();
        break;
      default:
        client2.log("_handlePacket :: unknown command");
        done();
        break;
    }
  };
  handlers.default = handle;
  return handlers;
}
var defaultMessageIdProvider = {};
var hasRequiredDefaultMessageIdProvider;
function requireDefaultMessageIdProvider() {
  if (hasRequiredDefaultMessageIdProvider) return defaultMessageIdProvider;
  hasRequiredDefaultMessageIdProvider = 1;
  Object.defineProperty(defaultMessageIdProvider, "__esModule", { value: true });
  class DefaultMessageIdProvider {
    constructor() {
      __publicField(this, "nextId");
      this.nextId = Math.max(1, Math.floor(Math.random() * 65535));
    }
    allocate() {
      const id = this.nextId++;
      if (this.nextId === 65536) {
        this.nextId = 1;
      }
      return id;
    }
    getLastAllocated() {
      return this.nextId === 1 ? 65535 : this.nextId - 1;
    }
    register(messageId) {
      return true;
    }
    deallocate(messageId) {
    }
    clear() {
    }
  }
  defaultMessageIdProvider.default = DefaultMessageIdProvider;
  return defaultMessageIdProvider;
}
var topicAliasRecv = {};
var hasRequiredTopicAliasRecv;
function requireTopicAliasRecv() {
  if (hasRequiredTopicAliasRecv) return topicAliasRecv;
  hasRequiredTopicAliasRecv = 1;
  Object.defineProperty(topicAliasRecv, "__esModule", { value: true });
  class TopicAliasRecv {
    constructor(max) {
      __publicField(this, "aliasToTopic");
      __publicField(this, "max");
      __publicField(this, "length");
      this.aliasToTopic = {};
      this.max = max;
    }
    put(topic, alias) {
      if (alias === 0 || alias > this.max) {
        return false;
      }
      this.aliasToTopic[alias] = topic;
      this.length = Object.keys(this.aliasToTopic).length;
      return true;
    }
    getTopicByAlias(alias) {
      return this.aliasToTopic[alias];
    }
    clear() {
      this.aliasToTopic = {};
    }
  }
  topicAliasRecv.default = TopicAliasRecv;
  return topicAliasRecv;
}
var TypedEmitter = {};
var hasRequiredTypedEmitter;
function requireTypedEmitter() {
  if (hasRequiredTypedEmitter) return TypedEmitter;
  hasRequiredTypedEmitter = 1;
  var __importDefault = TypedEmitter && TypedEmitter.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(TypedEmitter, "__esModule", { value: true });
  TypedEmitter.TypedEventEmitter = void 0;
  const events_1 = __importDefault(require$$0$6);
  const shared_1 = requireShared();
  class TypedEventEmitter {
  }
  TypedEmitter.TypedEventEmitter = TypedEventEmitter;
  (0, shared_1.applyMixin)(TypedEventEmitter, events_1.default);
  return TypedEmitter;
}
var KeepaliveManager = {};
var getTimer = {};
const createCache = (lastNumberWeakMap) => {
  return (collection, nextNumber) => {
    lastNumberWeakMap.set(collection, nextNumber);
    return nextNumber;
  };
};
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER === void 0 ? 9007199254740991 : Number.MAX_SAFE_INTEGER;
const TWO_TO_THE_POWER_OF_TWENTY_NINE = 536870912;
const TWO_TO_THE_POWER_OF_THIRTY = TWO_TO_THE_POWER_OF_TWENTY_NINE * 2;
const createGenerateUniqueNumber = (cache2, lastNumberWeakMap) => {
  return (collection) => {
    const lastNumber = lastNumberWeakMap.get(collection);
    let nextNumber = lastNumber === void 0 ? collection.size : lastNumber < TWO_TO_THE_POWER_OF_THIRTY ? lastNumber + 1 : 0;
    if (!collection.has(nextNumber)) {
      return cache2(collection, nextNumber);
    }
    if (collection.size < TWO_TO_THE_POWER_OF_TWENTY_NINE) {
      while (collection.has(nextNumber)) {
        nextNumber = Math.floor(Math.random() * TWO_TO_THE_POWER_OF_THIRTY);
      }
      return cache2(collection, nextNumber);
    }
    if (collection.size > MAX_SAFE_INTEGER) {
      throw new Error("Congratulations, you created a collection of unique numbers which uses all available integers!");
    }
    while (collection.has(nextNumber)) {
      nextNumber = Math.floor(Math.random() * MAX_SAFE_INTEGER);
    }
    return cache2(collection, nextNumber);
  };
};
const LAST_NUMBER_WEAK_MAP = /* @__PURE__ */ new WeakMap();
const cache = createCache(LAST_NUMBER_WEAK_MAP);
const generateUniqueNumber = createGenerateUniqueNumber(cache, LAST_NUMBER_WEAK_MAP);
const createBrokerFactory = (createOrGetOngoingRequests, extendBrokerImplementation, generateUniqueNumber2, isMessagePort2) => (brokerImplementation) => {
  const fullBrokerImplementation = extendBrokerImplementation(brokerImplementation);
  return (sender2) => {
    const ongoingRequests = createOrGetOngoingRequests(sender2);
    sender2.addEventListener("message", (({ data: message }) => {
      const { id } = message;
      if (id !== null && ongoingRequests.has(id)) {
        const { reject, resolve } = ongoingRequests.get(id);
        ongoingRequests.delete(id);
        if (message.error === void 0) {
          resolve(message.result);
        } else {
          reject(new Error(message.error.message));
        }
      }
    }));
    if (isMessagePort2(sender2)) {
      sender2.start();
    }
    const call = (method, params = null, transferables = []) => {
      return new Promise((resolve, reject) => {
        const id = generateUniqueNumber2(ongoingRequests);
        ongoingRequests.set(id, { reject, resolve });
        if (params === null) {
          sender2.postMessage({ id, method }, transferables);
        } else {
          sender2.postMessage({ id, method, params }, transferables);
        }
      });
    };
    const notify = (method, params, transferables = []) => {
      sender2.postMessage({ id: null, method, params }, transferables);
    };
    let functions = {};
    for (const [key, handler] of Object.entries(fullBrokerImplementation)) {
      functions = { ...functions, [key]: handler({ call, notify }) };
    }
    return { ...functions };
  };
};
const createCreateOrGetOngoingRequests = (ongoingRequestsMap) => (sender2) => {
  if (ongoingRequestsMap.has(sender2)) {
    return ongoingRequestsMap.get(sender2);
  }
  const ongoingRequests = /* @__PURE__ */ new Map();
  ongoingRequestsMap.set(sender2, ongoingRequests);
  return ongoingRequests;
};
const createExtendBrokerImplementation = (portMap) => (partialBrokerImplementation) => ({
  ...partialBrokerImplementation,
  connect: ({ call }) => {
    return async () => {
      const { port1, port2 } = new MessageChannel();
      const portId = await call("connect", { port: port1 }, [port1]);
      portMap.set(port2, portId);
      return port2;
    };
  },
  disconnect: ({ call }) => {
    return async (port) => {
      const portId = portMap.get(port);
      if (portId === void 0) {
        throw new Error("The given port is not connected.");
      }
      await call("disconnect", { portId });
    };
  },
  isSupported: ({ call }) => {
    return () => call("isSupported");
  }
});
const isMessagePort = (sender2) => {
  return typeof sender2.start === "function";
};
const createBroker = createBrokerFactory(createCreateOrGetOngoingRequests(/* @__PURE__ */ new WeakMap()), createExtendBrokerImplementation(/* @__PURE__ */ new WeakMap()), generateUniqueNumber, isMessagePort);
const createClearIntervalFactory = (scheduledIntervalsState2) => (clear) => (timerId) => {
  if (typeof scheduledIntervalsState2.get(timerId) === "symbol") {
    scheduledIntervalsState2.set(timerId, null);
    clear(timerId).then(() => {
      scheduledIntervalsState2.delete(timerId);
    });
  }
};
const createClearTimeoutFactory = (scheduledTimeoutsState2) => (clear) => (timerId) => {
  if (typeof scheduledTimeoutsState2.get(timerId) === "symbol") {
    scheduledTimeoutsState2.set(timerId, null);
    clear(timerId).then(() => {
      scheduledTimeoutsState2.delete(timerId);
    });
  }
};
const createSetIntervalFactory = (generateUniqueNumber2, scheduledIntervalsState2) => (set) => (func, delay = 0, ...args) => {
  const symbol = Symbol();
  const timerId = generateUniqueNumber2(scheduledIntervalsState2);
  scheduledIntervalsState2.set(timerId, symbol);
  const schedule = () => set(delay, timerId).then(() => {
    const state2 = scheduledIntervalsState2.get(timerId);
    if (state2 === void 0) {
      throw new Error("The timer is in an undefined state.");
    }
    if (state2 === symbol) {
      func(...args);
      if (scheduledIntervalsState2.get(timerId) === symbol) {
        schedule();
      }
    }
  });
  schedule();
  return timerId;
};
const createSetTimeoutFactory = (generateUniqueNumber2, scheduledTimeoutsState2) => (set) => (func, delay = 0, ...args) => {
  const symbol = Symbol();
  const timerId = generateUniqueNumber2(scheduledTimeoutsState2);
  scheduledTimeoutsState2.set(timerId, symbol);
  set(delay, timerId).then(() => {
    const state2 = scheduledTimeoutsState2.get(timerId);
    if (state2 === void 0) {
      throw new Error("The timer is in an undefined state.");
    }
    if (state2 === symbol) {
      scheduledTimeoutsState2.delete(timerId);
      func(...args);
    }
  });
  return timerId;
};
const scheduledIntervalsState = /* @__PURE__ */ new Map([[0, null]]);
const scheduledTimeoutsState = /* @__PURE__ */ new Map([[0, null]]);
const createClearInterval = createClearIntervalFactory(scheduledIntervalsState);
const createClearTimeout = createClearTimeoutFactory(scheduledTimeoutsState);
const createSetInterval = createSetIntervalFactory(generateUniqueNumber, scheduledIntervalsState);
const createSetTimeout = createSetTimeoutFactory(generateUniqueNumber, scheduledTimeoutsState);
const wrap = createBroker({
  clearInterval: ({ call }) => createClearInterval((timerId) => call("clear", { timerId, timerType: "interval" })),
  clearTimeout: ({ call }) => createClearTimeout((timerId) => call("clear", { timerId, timerType: "timeout" })),
  setInterval: ({ call }) => createSetInterval((delay, timerId) => call("set", { delay, now: performance.timeOrigin + performance.now(), timerId, timerType: "interval" })),
  setTimeout: ({ call }) => createSetTimeout((delay, timerId) => call("set", { delay, now: performance.timeOrigin + performance.now(), timerId, timerType: "timeout" }))
});
const load = (url) => {
  const worker2 = new Worker(url);
  return wrap(worker2);
};
const createLoadOrReturnBroker = (loadBroker, worker2) => {
  let broker = null;
  return () => {
    if (broker !== null) {
      return broker;
    }
    const blob = new Blob([worker2], { type: "application/javascript; charset=utf-8" });
    const url = URL.createObjectURL(blob);
    broker = loadBroker(url);
    setTimeout(() => URL.revokeObjectURL(url));
    return broker;
  };
};
const worker = `(()=>{var e={455(e,t){!function(e){"use strict";var t=function(e){return function(t){var r=e(t);return t.add(r),r}},r=function(e){return function(t,r){return e.set(t,r),r}},n=void 0===Number.MAX_SAFE_INTEGER?9007199254740991:Number.MAX_SAFE_INTEGER,o=536870912,s=2*o,a=function(e,t){return function(r){var a=t.get(r),i=void 0===a?r.size:a<s?a+1:0;if(!r.has(i))return e(r,i);if(r.size<o){for(;r.has(i);)i=Math.floor(Math.random()*s);return e(r,i)}if(r.size>n)throw new Error("Congratulations, you created a collection of unique numbers which uses all available integers!");for(;r.has(i);)i=Math.floor(Math.random()*n);return e(r,i)}},i=new WeakMap,u=r(i),c=a(u,i),l=t(c);e.addUniqueNumber=l,e.generateUniqueNumber=c}(t)}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var s=t[n]={exports:{}};return e[n].call(s.exports,s,s.exports,r),s.exports}(()=>{"use strict";const e=-32603,t=-32602,n=-32601,o=(e,t)=>Object.assign(new Error(e),{status:t}),s=t=>o('The handler of the method called "'.concat(t,'" returned an unexpected result.'),e),a=(t,r)=>async({data:{id:a,method:i,params:u}})=>{const c=r[i];try{if(void 0===c)throw(e=>o('The requested method called "'.concat(e,'" is not supported.'),n))(i);const r=void 0===u?c():c(u);if(void 0===r)throw(t=>o('The handler of the method called "'.concat(t,'" returned no required result.'),e))(i);const l=r instanceof Promise?await r:r;if(null===a){if(void 0!==l.result)throw s(i)}else{if(void 0===l.result)throw s(i);const{result:e,transferables:r=[]}=l;t.postMessage({id:a,result:e},r)}}catch(e){const{message:r,status:n=-32603}=e;t.postMessage({error:{code:n,message:r},id:a})}};var i=r(455);const u=new Map,c=(e,r,n)=>({...r,connect:({port:t})=>{t.start();const n=e(t,r),o=(0,i.generateUniqueNumber)(u);return u.set(o,()=>{n(),t.close(),u.delete(o)}),{result:o}},disconnect:({portId:e})=>{const r=u.get(e);if(void 0===r)throw(e=>o('The specified parameter called "portId" with the given value "'.concat(e,'" does not identify a port connected to this worker.'),t))(e);return r(),{result:null}},isSupported:async()=>{if(await new Promise(e=>{const t=new ArrayBuffer(0),{port1:r,port2:n}=new MessageChannel;r.onmessage=({data:t})=>e(null!==t),n.postMessage(t,[t])})){const e=n();return{result:e instanceof Promise?await e:e}}return{result:!1}}}),l=(e,t,r=()=>!0)=>{const n=c(l,t,r),o=a(e,n);return e.addEventListener("message",o),()=>e.removeEventListener("message",o)},d=(e,t)=>r=>{const n=t.get(r);if(void 0===n)return Promise.resolve(!1);const[o,s]=n;return e(o),t.delete(r),s(!1),Promise.resolve(!0)},m=(e,t,r,n)=>(o,s,a)=>{const i=o+s-t.timeOrigin,u=i-t.now();return new Promise(t=>{e.set(a,[r(n,u,i,e,t,a),t])})},f=new Map,h=d(globalThis.clearTimeout,f),p=new Map,v=d(globalThis.clearTimeout,p),w=((e,t)=>{const r=(n,o,s,a)=>{const i=n-e.now();i>0?o.set(a,[t(r,i,n,o,s,a),s]):(o.delete(a),s(!0))};return r})(performance,globalThis.setTimeout),g=m(f,performance,globalThis.setTimeout,w),T=m(p,performance,globalThis.setTimeout,w);l(self,{clear:async({timerId:e,timerType:t})=>({result:await("interval"===t?h(e):v(e))}),set:async({delay:e,now:t,timerId:r,timerType:n})=>({result:await("interval"===n?g:T)(e,t,r)})})})()})();`;
const loadOrReturnBroker = createLoadOrReturnBroker(load, worker);
const clearInterval$1 = (timerId) => loadOrReturnBroker().clearInterval(timerId);
const clearTimeout$1 = (timerId) => loadOrReturnBroker().clearTimeout(timerId);
const setInterval$1 = (...args) => loadOrReturnBroker().setInterval(...args);
const setTimeout$1 = (...args) => loadOrReturnBroker().setTimeout(...args);
const module$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clearInterval: clearInterval$1,
  clearTimeout: clearTimeout$1,
  setInterval: setInterval$1,
  setTimeout: setTimeout$1
}, Symbol.toStringTag, { value: "Module" }));
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(module$1);
var isBrowser = {};
var hasRequiredIsBrowser;
function requireIsBrowser() {
  if (hasRequiredIsBrowser) return isBrowser;
  hasRequiredIsBrowser = 1;
  Object.defineProperty(isBrowser, "__esModule", { value: true });
  isBrowser.isReactNativeBrowser = isBrowser.isWebWorker = void 0;
  const isStandardBrowserEnv = () => {
    var _a;
    if (typeof window !== "undefined") {
      const electronRenderCheck = typeof navigator !== "undefined" && ((_a = navigator.userAgent) == null ? void 0 : _a.toLowerCase().indexOf(" electron/")) > -1;
      if (electronRenderCheck && (process == null ? void 0 : process.versions)) {
        const electronMainCheck = Object.prototype.hasOwnProperty.call(process.versions, "electron");
        return !electronMainCheck;
      }
      return typeof window.document !== "undefined";
    }
    return false;
  };
  const isWebWorkerEnv = () => {
    var _a, _b;
    return Boolean(typeof self === "object" && ((_b = (_a = self == null ? void 0 : self.constructor) == null ? void 0 : _a.name) == null ? void 0 : _b.includes("WorkerGlobalScope")) && typeof Deno === "undefined");
  };
  const isReactNativeEnv = () => typeof navigator !== "undefined" && navigator.product === "ReactNative";
  const isBrowser$1 = isStandardBrowserEnv() || isWebWorkerEnv() || isReactNativeEnv();
  isBrowser.isWebWorker = isWebWorkerEnv();
  isBrowser.isReactNativeBrowser = isReactNativeEnv();
  isBrowser.default = isBrowser$1;
  return isBrowser;
}
var hasRequiredGetTimer;
function requireGetTimer() {
  if (hasRequiredGetTimer) return getTimer;
  hasRequiredGetTimer = 1;
  var __createBinding = getTimer && getTimer.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = getTimer && getTimer.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = getTimer && getTimer.__importStar || /* @__PURE__ */ (function() {
    var ownKeys = function(o) {
      ownKeys = Object.getOwnPropertyNames || function(o2) {
        var ar = [];
        for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
        return ar;
      };
      return ownKeys(o);
    };
    return function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
      }
      __setModuleDefault(result, mod);
      return result;
    };
  })();
  Object.defineProperty(getTimer, "__esModule", { value: true });
  const worker_timers_1 = require$$0;
  const is_browser_1 = __importStar(requireIsBrowser());
  const workerTimer = {
    set: worker_timers_1.setInterval,
    clear: worker_timers_1.clearInterval
  };
  const nativeTimer = {
    set: (func, time) => setInterval(func, time),
    clear: (timerId) => clearInterval(timerId)
  };
  const getTimer$1 = (variant) => {
    switch (variant) {
      case "native": {
        return nativeTimer;
      }
      case "worker": {
        return workerTimer;
      }
      case "auto":
      default: {
        return is_browser_1.default && !is_browser_1.isWebWorker && !is_browser_1.isReactNativeBrowser ? workerTimer : nativeTimer;
      }
    }
  };
  getTimer.default = getTimer$1;
  return getTimer;
}
var hasRequiredKeepaliveManager;
function requireKeepaliveManager() {
  if (hasRequiredKeepaliveManager) return KeepaliveManager;
  hasRequiredKeepaliveManager = 1;
  var __importDefault = KeepaliveManager && KeepaliveManager.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(KeepaliveManager, "__esModule", { value: true });
  const get_timer_1 = __importDefault(requireGetTimer());
  let KeepaliveManager$1 = class KeepaliveManager {
    constructor(client2, variant) {
      __publicField(this, "_keepalive");
      __publicField(this, "timerId");
      __publicField(this, "timer");
      __publicField(this, "destroyed", false);
      __publicField(this, "counter");
      __publicField(this, "client");
      __publicField(this, "_keepaliveTimeoutTimestamp");
      __publicField(this, "_intervalEvery");
      this.client = client2;
      this.timer = typeof variant === "object" && "set" in variant && "clear" in variant ? variant : (0, get_timer_1.default)(variant);
      this.setKeepalive(client2.options.keepalive);
    }
    get keepaliveTimeoutTimestamp() {
      return this._keepaliveTimeoutTimestamp;
    }
    get intervalEvery() {
      return this._intervalEvery;
    }
    get keepalive() {
      return this._keepalive;
    }
    clear() {
      if (this.timerId) {
        this.timer.clear(this.timerId);
        this.timerId = null;
      }
    }
    setKeepalive(value) {
      value *= 1e3;
      if (isNaN(value) || value <= 0 || value > 2147483647) {
        throw new Error(`Keepalive value must be an integer between 0 and 2147483647. Provided value is ${value}`);
      }
      this._keepalive = value;
      this.reschedule();
      this.client["log"](`KeepaliveManager: set keepalive to ${value}ms`);
    }
    destroy() {
      this.clear();
      this.destroyed = true;
    }
    reschedule() {
      if (this.destroyed) {
        return;
      }
      this.clear();
      this.counter = 0;
      const keepAliveTimeout = Math.ceil(this._keepalive * 1.5);
      this._keepaliveTimeoutTimestamp = Date.now() + keepAliveTimeout;
      this._intervalEvery = Math.ceil(this._keepalive / 2);
      this.timerId = this.timer.set(() => {
        if (this.destroyed) {
          return;
        }
        this.counter += 1;
        if (this.counter === 2) {
          this.client.sendPing();
        } else if (this.counter > 2) {
          this.client.onKeepaliveTimeout();
        }
      }, this._intervalEvery);
    }
  };
  KeepaliveManager.default = KeepaliveManager$1;
  return KeepaliveManager;
}
var hasRequiredClient;
function requireClient() {
  if (hasRequiredClient) return client;
  hasRequiredClient = 1;
  var __createBinding = client && client.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = client && client.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = client && client.__importStar || /* @__PURE__ */ (function() {
    var ownKeys = function(o) {
      ownKeys = Object.getOwnPropertyNames || function(o2) {
        var ar = [];
        for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
        return ar;
      };
      return ownKeys(o);
    };
    return function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
      }
      __setModuleDefault(result, mod);
      return result;
    };
  })();
  var __importDefault = client && client.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(client, "__esModule", { value: true });
  const mqtt_packet_1 = __importDefault(requireMqtt$1());
  const readable_stream_1 = requireOurs();
  const default_1 = __importDefault(require_default());
  const debug_1 = __importDefault(requireSrc());
  const validations2 = __importStar(requireValidations());
  const store_1 = __importDefault(requireStore());
  const handlers_1 = __importDefault(requireHandlers());
  const default_message_id_provider_1 = __importDefault(requireDefaultMessageIdProvider());
  const topic_alias_recv_1 = __importDefault(requireTopicAliasRecv());
  const shared_1 = requireShared();
  const TypedEmitter_1 = requireTypedEmitter();
  const KeepaliveManager_1 = __importDefault(requireKeepaliveManager());
  const is_browser_1 = __importStar(requireIsBrowser());
  const setImmediate2 = globalThis.setImmediate || ((...args) => {
    const callback = args.shift();
    (0, shared_1.nextTick)(() => {
      callback(...args);
    });
  });
  const defaultConnectOptions = {
    keepalive: 60,
    reschedulePings: true,
    protocolId: "MQTT",
    protocolVersion: 4,
    reconnectPeriod: 1e3,
    connectTimeout: 30 * 1e3,
    clean: true,
    resubscribe: true,
    subscribeBatchSize: null,
    writeCache: true,
    timerVariant: "auto"
  };
  const _MqttClient = class _MqttClient extends TypedEmitter_1.TypedEventEmitter {
    constructor(streamBuilder, options) {
      super();
      __publicField(this, "connected");
      __publicField(this, "disconnecting");
      __publicField(this, "disconnected");
      __publicField(this, "reconnecting");
      __publicField(this, "incomingStore");
      __publicField(this, "outgoingStore");
      __publicField(this, "options");
      __publicField(this, "queueQoSZero");
      __publicField(this, "_reconnectCount");
      __publicField(this, "log");
      __publicField(this, "messageIdProvider");
      __publicField(this, "outgoing");
      __publicField(this, "messageIdToTopic");
      __publicField(this, "noop");
      __publicField(this, "keepaliveManager");
      __publicField(this, "stream");
      __publicField(this, "queue");
      __publicField(this, "streamBuilder");
      __publicField(this, "_resubscribeTopics");
      __publicField(this, "connackTimer");
      __publicField(this, "reconnectTimer");
      __publicField(this, "_storeProcessing");
      __publicField(this, "_packetIdsDuringStoreProcessing");
      __publicField(this, "_storeProcessingQueue");
      __publicField(this, "_firstConnection");
      __publicField(this, "topicAliasRecv");
      __publicField(this, "topicAliasSend");
      __publicField(this, "_deferredReconnect");
      __publicField(this, "connackPacket");
      this.options = options || {};
      for (const k in defaultConnectOptions) {
        if (typeof this.options[k] === "undefined") {
          this.options[k] = defaultConnectOptions[k];
        } else {
          this.options[k] = options[k];
        }
      }
      this.log = this.options.log || (0, debug_1.default)("mqttjs:client");
      this.noop = this._noop.bind(this);
      this.log("MqttClient :: version:", _MqttClient.VERSION);
      if (is_browser_1.isWebWorker) {
        this.log("MqttClient :: environment", "webworker");
      } else {
        this.log("MqttClient :: environment", is_browser_1.default ? "browser" : "node");
      }
      this.log("MqttClient :: options.protocol", options.protocol);
      this.log("MqttClient :: options.protocolVersion", options.protocolVersion);
      this.log("MqttClient :: options.username", options.username);
      this.log("MqttClient :: options.keepalive", options.keepalive);
      this.log("MqttClient :: options.reconnectPeriod", options.reconnectPeriod);
      this.log("MqttClient :: options.rejectUnauthorized", options.rejectUnauthorized);
      this.log("MqttClient :: options.properties.topicAliasMaximum", options.properties ? options.properties.topicAliasMaximum : void 0);
      this.options.clientId = typeof options.clientId === "string" ? options.clientId : _MqttClient.defaultId();
      this.log("MqttClient :: clientId", this.options.clientId);
      this.options.customHandleAcks = options.protocolVersion === 5 && options.customHandleAcks ? options.customHandleAcks : (...args) => {
        args[3](null, 0);
      };
      if (!this.options.writeCache) {
        mqtt_packet_1.default.writeToStream.cacheNumbers = false;
      }
      this.streamBuilder = streamBuilder;
      this.messageIdProvider = typeof this.options.messageIdProvider === "undefined" ? new default_message_id_provider_1.default() : this.options.messageIdProvider;
      this.outgoingStore = options.outgoingStore || new store_1.default();
      this.incomingStore = options.incomingStore || new store_1.default();
      this.queueQoSZero = options.queueQoSZero === void 0 ? true : options.queueQoSZero;
      this._resubscribeTopics = {};
      this.messageIdToTopic = {};
      this.keepaliveManager = null;
      this.connected = false;
      this.disconnecting = false;
      this.reconnecting = false;
      this.queue = [];
      this.connackTimer = null;
      this.reconnectTimer = null;
      this._storeProcessing = false;
      this._packetIdsDuringStoreProcessing = {};
      this._storeProcessingQueue = [];
      this.outgoing = {};
      this._firstConnection = true;
      if (options.properties && options.properties.topicAliasMaximum > 0) {
        if (options.properties.topicAliasMaximum > 65535) {
          this.log("MqttClient :: options.properties.topicAliasMaximum is out of range");
        } else {
          this.topicAliasRecv = new topic_alias_recv_1.default(options.properties.topicAliasMaximum);
        }
      }
      this.on("connect", () => {
        const { queue } = this;
        const deliver = () => {
          const entry = queue.shift();
          this.log("deliver :: entry %o", entry);
          let packet2 = null;
          if (!entry) {
            this._resubscribe();
            return;
          }
          packet2 = entry.packet;
          this.log("deliver :: call _sendPacket for %o", packet2);
          let send = true;
          if (packet2.messageId && packet2.messageId !== 0) {
            if (!this.messageIdProvider.register(packet2.messageId)) {
              send = false;
            }
          }
          if (send) {
            this._sendPacket(packet2, (err) => {
              if (entry.cb) {
                entry.cb(err);
              }
              deliver();
            });
          } else {
            this.log("messageId: %d has already used. The message is skipped and removed.", packet2.messageId);
            deliver();
          }
        };
        this.log("connect :: sending queued packets");
        deliver();
      });
      this.on("close", () => {
        this.log("close :: connected set to `false`");
        this.connected = false;
        this.log("close :: clearing connackTimer");
        clearTimeout(this.connackTimer);
        this._destroyKeepaliveManager();
        if (this.topicAliasRecv) {
          this.topicAliasRecv.clear();
        }
        this.log("close :: calling _setupReconnect");
        this._setupReconnect();
      });
      if (!this.options.manualConnect) {
        this.log("MqttClient :: setting up stream");
        this.connect();
      }
    }
    static defaultId() {
      return `mqttjs_${Math.random().toString(16).substr(2, 8)}`;
    }
    handleAuth(packet2, callback) {
      callback();
    }
    handleMessage(packet2, callback) {
      callback();
    }
    _nextId() {
      return this.messageIdProvider.allocate();
    }
    getLastMessageId() {
      return this.messageIdProvider.getLastAllocated();
    }
    connect() {
      var _a;
      const writable2 = new readable_stream_1.Writable();
      const parser2 = mqtt_packet_1.default.parser(this.options);
      let completeParse = null;
      const packets = [];
      this.log("connect :: calling method to clear reconnect");
      this._clearReconnect();
      if (this.disconnected && !this.reconnecting) {
        this.incomingStore = this.options.incomingStore || new store_1.default();
        this.outgoingStore = this.options.outgoingStore || new store_1.default();
        this.disconnecting = false;
        this.disconnected = false;
      }
      this.log("connect :: using streamBuilder provided to client to create stream");
      this.stream = this.streamBuilder(this);
      parser2.on("packet", (packet2) => {
        this.log("parser :: on packet push to packets array.");
        packets.push(packet2);
      });
      const work = () => {
        this.log("work :: getting next packet in queue");
        const packet2 = packets.shift();
        if (packet2) {
          this.log("work :: packet pulled from queue");
          (0, handlers_1.default)(this, packet2, nextTickWork);
        } else {
          this.log("work :: no packets in queue");
          const done = completeParse;
          completeParse = null;
          this.log("work :: done flag is %s", !!done);
          if (done)
            done();
        }
      };
      const nextTickWork = () => {
        if (packets.length) {
          (0, shared_1.nextTick)(work);
        } else {
          const done = completeParse;
          completeParse = null;
          done();
        }
      };
      writable2._write = (buf, enc, done) => {
        completeParse = done;
        this.log("writable stream :: parsing buffer");
        parser2.parse(buf);
        work();
      };
      const streamErrorHandler = (error) => {
        this.log("streamErrorHandler :: error", error.message);
        if (error.code) {
          this.log("streamErrorHandler :: emitting error");
          this.emit("error", error);
        } else {
          this.noop(error);
        }
      };
      this.log("connect :: pipe stream to writable stream");
      this.stream.pipe(writable2);
      this.stream.on("error", streamErrorHandler);
      this.stream.on("close", () => {
        this.log("(%s)stream :: on close", this.options.clientId);
        this._flushVolatile();
        this.log("stream: emit close to MqttClient");
        this.emit("close");
      });
      this.log("connect: sending packet `connect`");
      const connectPacket = {
        cmd: "connect",
        protocolId: this.options.protocolId,
        protocolVersion: this.options.protocolVersion,
        clean: this.options.clean,
        clientId: this.options.clientId,
        keepalive: this.options.keepalive,
        username: this.options.username,
        password: this.options.password,
        properties: this.options.properties
      };
      if (this.options.will) {
        connectPacket.will = {
          ...this.options.will,
          payload: (_a = this.options.will) == null ? void 0 : _a.payload
        };
      }
      if (this.topicAliasRecv) {
        if (!connectPacket.properties) {
          connectPacket.properties = {};
        }
        if (this.topicAliasRecv) {
          connectPacket.properties.topicAliasMaximum = this.topicAliasRecv.max;
        }
      }
      this._writePacket(connectPacket);
      parser2.on("error", this.emit.bind(this, "error"));
      if (this.options.properties) {
        if (!this.options.properties.authenticationMethod && this.options.properties.authenticationData) {
          this.end(() => this.emit("error", new Error("Packet has no Authentication Method")));
          return this;
        }
        if (this.options.properties.authenticationMethod && this.options.authPacket && typeof this.options.authPacket === "object") {
          const authPacket = {
            cmd: "auth",
            reasonCode: 0,
            ...this.options.authPacket
          };
          this._writePacket(authPacket);
        }
      }
      this.stream.setMaxListeners(1e3);
      clearTimeout(this.connackTimer);
      this.connackTimer = setTimeout(() => {
        this.log("!!connectTimeout hit!! Calling _cleanUp with force `true`");
        this.emit("error", new Error("connack timeout"));
        this._cleanUp(true);
      }, this.options.connectTimeout);
      return this;
    }
    publish(topic, message, opts, callback) {
      this.log("publish :: message `%s` to topic `%s`", message, topic);
      const { options } = this;
      if (typeof opts === "function") {
        callback = opts;
        opts = null;
      }
      opts = opts || {};
      const defaultOpts = {
        qos: 0,
        retain: false,
        dup: false
      };
      opts = { ...defaultOpts, ...opts };
      const { qos, retain, dup, properties, cbStorePut } = opts;
      if (this._checkDisconnecting(callback)) {
        return this;
      }
      const publishProc = () => {
        let messageId = 0;
        if (qos === 1 || qos === 2) {
          messageId = this._nextId();
          if (messageId === null) {
            this.log("No messageId left");
            return false;
          }
        }
        const packet2 = {
          cmd: "publish",
          topic,
          payload: message,
          qos,
          retain,
          messageId,
          dup
        };
        if (options.protocolVersion === 5) {
          packet2.properties = properties;
        }
        this.log("publish :: qos", qos);
        switch (qos) {
          case 1:
          case 2:
            this.outgoing[packet2.messageId] = {
              volatile: false,
              cb: callback || this.noop
            };
            this.log("MqttClient:publish: packet cmd: %s", packet2.cmd);
            this._sendPacket(packet2, void 0, cbStorePut);
            break;
          default:
            this.log("MqttClient:publish: packet cmd: %s", packet2.cmd);
            this._sendPacket(packet2, callback, cbStorePut);
            break;
        }
        return true;
      };
      if (this._storeProcessing || this._storeProcessingQueue.length > 0 || !publishProc()) {
        this._storeProcessingQueue.push({
          invoke: publishProc,
          cbStorePut: opts.cbStorePut,
          callback
        });
      }
      return this;
    }
    publishAsync(topic, message, opts) {
      return new Promise((resolve, reject) => {
        this.publish(topic, message, opts, (err, packet2) => {
          if (err) {
            reject(err);
          } else {
            resolve(packet2);
          }
        });
      });
    }
    subscribe(topicObject, opts, callback) {
      const version2 = this.options.protocolVersion;
      if (typeof opts === "function") {
        callback = opts;
      }
      callback = callback || this.noop;
      let resubscribe = false;
      let topicsList = [];
      if (typeof topicObject === "string") {
        topicObject = [topicObject];
        topicsList = topicObject;
      } else if (Array.isArray(topicObject)) {
        topicsList = topicObject;
      } else if (typeof topicObject === "object") {
        resubscribe = topicObject.resubscribe;
        delete topicObject.resubscribe;
        topicsList = Object.keys(topicObject);
      }
      const invalidTopic = validations2.validateTopics(topicsList);
      if (invalidTopic !== null) {
        setImmediate2(callback, new Error(`Invalid topic ${invalidTopic}`));
        return this;
      }
      if (this._checkDisconnecting(callback)) {
        this.log("subscribe: discconecting true");
        return this;
      }
      const defaultOpts = {
        qos: 0
      };
      if (version2 === 5) {
        defaultOpts.nl = false;
        defaultOpts.rap = false;
        defaultOpts.rh = 0;
      }
      opts = { ...defaultOpts, ...opts };
      const { properties } = opts;
      const subs = [];
      const parseSub = (topic, subOptions) => {
        subOptions = subOptions || opts;
        if (!Object.prototype.hasOwnProperty.call(this._resubscribeTopics, topic) || this._resubscribeTopics[topic].qos < subOptions.qos || resubscribe) {
          const currentOpts = {
            topic,
            qos: subOptions.qos
          };
          if (version2 === 5) {
            currentOpts.nl = subOptions.nl;
            currentOpts.rap = subOptions.rap;
            currentOpts.rh = subOptions.rh;
            currentOpts.properties = properties;
          }
          this.log("subscribe: pushing topic `%s` and qos `%s` to subs list", currentOpts.topic, currentOpts.qos);
          subs.push(currentOpts);
        }
      };
      if (Array.isArray(topicObject)) {
        topicObject.forEach((topic) => {
          this.log("subscribe: array topic %s", topic);
          parseSub(topic);
        });
      } else {
        Object.keys(topicObject).forEach((topic) => {
          this.log("subscribe: object topic %s, %o", topic, topicObject[topic]);
          parseSub(topic, topicObject[topic]);
        });
      }
      if (!subs.length) {
        callback(null, []);
        return this;
      }
      const subscribeChunkedSubs = (chunkedSubs, messageId) => {
        const packet2 = {
          cmd: "subscribe",
          subscriptions: chunkedSubs,
          messageId
        };
        if (properties) {
          packet2.properties = properties;
        }
        if (this.options.resubscribe) {
          this.log("subscribe :: resubscribe true");
          const topics = [];
          chunkedSubs.forEach((sub) => {
            if (this.options.reconnectPeriod > 0) {
              const topic = { qos: sub.qos };
              if (version2 === 5) {
                topic.nl = sub.nl || false;
                topic.rap = sub.rap || false;
                topic.rh = sub.rh || 0;
                topic.properties = sub.properties;
              }
              this._resubscribeTopics[sub.topic] = topic;
              topics.push(sub.topic);
            }
          });
          this.messageIdToTopic[packet2.messageId] = topics;
        }
        const promise = new Promise((resolve, reject) => {
          this.outgoing[packet2.messageId] = {
            volatile: true,
            cb(err, packet22) {
              if (!err) {
                const { granted } = packet22;
                for (let grantedI = 0; grantedI < granted.length; grantedI += 1) {
                  chunkedSubs[grantedI].qos = granted[grantedI];
                }
              }
              if (!err) {
                resolve(packet22);
              } else {
                reject(new shared_1.ErrorWithSubackPacket(err.message, packet22));
              }
            }
          };
        });
        this.log("subscribe :: call _sendPacket");
        this._sendPacket(packet2);
        return promise;
      };
      const subscribeProc = () => {
        const batchSize = this.options.subscribeBatchSize ?? subs.length;
        const subscribePromises = [];
        for (let i = 0; i < subs.length; i += batchSize) {
          const chunkedSubs = subs.slice(i, i + batchSize);
          const messageId = this._nextId();
          if (messageId === null) {
            this.log("No messageId left");
            return false;
          }
          subscribePromises.push(subscribeChunkedSubs(chunkedSubs, messageId));
        }
        Promise.all(subscribePromises).then((packets) => {
          callback(null, subs, packets.at(-1));
        }).catch((err) => {
          callback(err, subs, err.packet);
        });
        return true;
      };
      if (this._storeProcessing || this._storeProcessingQueue.length > 0 || !subscribeProc()) {
        this._storeProcessingQueue.push({
          invoke: subscribeProc,
          callback
        });
      }
      return this;
    }
    subscribeAsync(topicObject, opts) {
      return new Promise((resolve, reject) => {
        this.subscribe(topicObject, opts, (err, granted) => {
          if (err) {
            reject(err);
          } else {
            resolve(granted);
          }
        });
      });
    }
    unsubscribe(topic, opts, callback) {
      if (typeof topic === "string") {
        topic = [topic];
      }
      if (typeof opts === "function") {
        callback = opts;
      }
      callback = callback || this.noop;
      const invalidTopic = validations2.validateTopics(topic);
      if (invalidTopic !== null) {
        setImmediate2(callback, new Error(`Invalid topic ${invalidTopic}`));
        return this;
      }
      if (this._checkDisconnecting(callback)) {
        return this;
      }
      const unsubscribeProc = () => {
        const messageId = this._nextId();
        if (messageId === null) {
          this.log("No messageId left");
          return false;
        }
        const packet2 = {
          cmd: "unsubscribe",
          messageId,
          unsubscriptions: []
        };
        if (typeof topic === "string") {
          packet2.unsubscriptions = [topic];
        } else if (Array.isArray(topic)) {
          packet2.unsubscriptions = topic;
        }
        if (this.options.resubscribe) {
          packet2.unsubscriptions.forEach((topic2) => {
            delete this._resubscribeTopics[topic2];
          });
        }
        if (typeof opts === "object" && opts.properties) {
          packet2.properties = opts.properties;
        }
        this.outgoing[packet2.messageId] = {
          volatile: true,
          cb: callback
        };
        this.log("unsubscribe: call _sendPacket");
        this._sendPacket(packet2);
        return true;
      };
      if (this._storeProcessing || this._storeProcessingQueue.length > 0 || !unsubscribeProc()) {
        this._storeProcessingQueue.push({
          invoke: unsubscribeProc,
          callback
        });
      }
      return this;
    }
    unsubscribeAsync(topic, opts) {
      return new Promise((resolve, reject) => {
        this.unsubscribe(topic, opts, (err, packet2) => {
          if (err) {
            reject(err);
          } else {
            resolve(packet2);
          }
        });
      });
    }
    end(force, opts, cb) {
      this.log("end :: (%s)", this.options.clientId);
      if (force == null || typeof force !== "boolean") {
        cb = cb || opts;
        opts = force;
        force = false;
      }
      if (typeof opts !== "object") {
        cb = cb || opts;
        opts = null;
      }
      this.log("end :: cb? %s", !!cb);
      if (!cb || typeof cb !== "function") {
        cb = this.noop;
      }
      const closeStores = () => {
        this.log("end :: closeStores: closing incoming and outgoing stores");
        this.disconnected = true;
        this.incomingStore.close((e1) => {
          this.outgoingStore.close((e2) => {
            this.log("end :: closeStores: emitting end");
            this.emit("end");
            if (cb) {
              const err = e1 || e2;
              this.log("end :: closeStores: invoking callback with args");
              cb(err);
            }
          });
        });
        if (this._deferredReconnect) {
          this._deferredReconnect();
        } else if (this.options.reconnectPeriod === 0 || this.options.manualConnect) {
          this.disconnecting = false;
        }
      };
      const finish = () => {
        this.log("end :: (%s) :: finish :: calling _cleanUp with force %s", this.options.clientId, force);
        this._cleanUp(force, () => {
          this.log("end :: finish :: calling process.nextTick on closeStores");
          (0, shared_1.nextTick)(closeStores);
        }, opts);
      };
      if (this.disconnecting) {
        cb();
        return this;
      }
      this._clearReconnect();
      this.disconnecting = true;
      if (!force && Object.keys(this.outgoing).length > 0) {
        this.log("end :: (%s) :: calling finish in 10ms once outgoing is empty", this.options.clientId);
        this.once("outgoingEmpty", setTimeout.bind(null, finish, 10));
      } else {
        this.log("end :: (%s) :: immediately calling finish", this.options.clientId);
        finish();
      }
      return this;
    }
    endAsync(force, opts) {
      return new Promise((resolve, reject) => {
        this.end(force, opts, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
    removeOutgoingMessage(messageId) {
      if (this.outgoing[messageId]) {
        const { cb } = this.outgoing[messageId];
        this._removeOutgoingAndStoreMessage(messageId, () => {
          cb(new Error("Message removed"));
        });
      }
      return this;
    }
    reconnect(opts) {
      this.log("client reconnect");
      const f = () => {
        if (opts) {
          this.options.incomingStore = opts.incomingStore;
          this.options.outgoingStore = opts.outgoingStore;
        } else {
          this.options.incomingStore = null;
          this.options.outgoingStore = null;
        }
        this.incomingStore = this.options.incomingStore || new store_1.default();
        this.outgoingStore = this.options.outgoingStore || new store_1.default();
        this.disconnecting = false;
        this.disconnected = false;
        this._deferredReconnect = null;
        this._reconnect();
      };
      if (this.disconnecting && !this.disconnected) {
        this._deferredReconnect = f;
      } else {
        f();
      }
      return this;
    }
    _flushVolatile() {
      if (this.outgoing) {
        this.log("_flushVolatile :: deleting volatile messages from the queue and setting their callbacks as error function");
        Object.keys(this.outgoing).forEach((messageId) => {
          if (this.outgoing[messageId].volatile && typeof this.outgoing[messageId].cb === "function") {
            this.outgoing[messageId].cb(new Error("Connection closed"));
            delete this.outgoing[messageId];
          }
        });
      }
    }
    _flush() {
      if (this.outgoing) {
        this.log("_flush: queue exists? %b", !!this.outgoing);
        Object.keys(this.outgoing).forEach((messageId) => {
          if (typeof this.outgoing[messageId].cb === "function") {
            this.outgoing[messageId].cb(new Error("Connection closed"));
            delete this.outgoing[messageId];
          }
        });
      }
    }
    _removeTopicAliasAndRecoverTopicName(packet2) {
      let alias;
      if (packet2.properties) {
        alias = packet2.properties.topicAlias;
      }
      let topic = packet2.topic.toString();
      this.log("_removeTopicAliasAndRecoverTopicName :: alias %d, topic %o", alias, topic);
      if (topic.length === 0) {
        if (typeof alias === "undefined") {
          return new Error("Unregistered Topic Alias");
        }
        topic = this.topicAliasSend.getTopicByAlias(alias);
        if (typeof topic === "undefined") {
          return new Error("Unregistered Topic Alias");
        }
        packet2.topic = topic;
      }
      if (alias) {
        delete packet2.properties.topicAlias;
      }
    }
    _checkDisconnecting(callback) {
      if (this.disconnecting) {
        if (callback && callback !== this.noop) {
          callback(new Error("client disconnecting"));
        } else {
          this.emit("error", new Error("client disconnecting"));
        }
      }
      return this.disconnecting;
    }
    _reconnect() {
      this.log("_reconnect: emitting reconnect to client");
      this.emit("reconnect");
      if (this.connected) {
        this.end(() => {
          this.connect();
        });
        this.log("client already connected. disconnecting first.");
      } else {
        this.log("_reconnect: calling connect");
        this.connect();
      }
    }
    _setupReconnect() {
      if (!this.disconnecting && !this.reconnectTimer && this.options.reconnectPeriod > 0) {
        if (!this.reconnecting) {
          this.log("_setupReconnect :: emit `offline` state");
          this.emit("offline");
          this.log("_setupReconnect :: set `reconnecting` to `true`");
          this.reconnecting = true;
        }
        this.log("_setupReconnect :: setting reconnectTimer for %d ms", this.options.reconnectPeriod);
        this.reconnectTimer = setInterval(() => {
          this.log("reconnectTimer :: reconnect triggered!");
          this._reconnect();
        }, this.options.reconnectPeriod);
      } else {
        this.log("_setupReconnect :: doing nothing...");
      }
    }
    _clearReconnect() {
      this.log("_clearReconnect : clearing reconnect timer");
      if (this.reconnectTimer) {
        clearInterval(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    }
    _cleanUp(forced, done, opts = {}) {
      if (done) {
        this.log("_cleanUp :: done callback provided for on stream close");
        this.stream.on("close", done);
      }
      this.log("_cleanUp :: forced? %s", forced);
      if (forced) {
        if (this.options.reconnectPeriod === 0 && this.options.clean) {
          this._flush();
        }
        this.log("_cleanUp :: (%s) :: destroying stream", this.options.clientId);
        this.stream.destroy();
      } else {
        const packet2 = { cmd: "disconnect", ...opts };
        this.log("_cleanUp :: (%s) :: call _sendPacket with disconnect packet", this.options.clientId);
        this._sendPacket(packet2, () => {
          this.log("_cleanUp :: (%s) :: destroying stream", this.options.clientId);
          setImmediate2(() => {
            this.stream.end(() => {
              this.log("_cleanUp :: (%s) :: stream destroyed", this.options.clientId);
            });
          });
        });
      }
      if (!this.disconnecting && !this.reconnecting) {
        this.log("_cleanUp :: client not disconnecting/reconnecting. Clearing and resetting reconnect.");
        this._clearReconnect();
        this._setupReconnect();
      }
      this._destroyKeepaliveManager();
      if (done && !this.connected) {
        this.log("_cleanUp :: (%s) :: removing stream `done` callback `close` listener", this.options.clientId);
        this.stream.removeListener("close", done);
        done();
      }
    }
    _storeAndSend(packet2, cb, cbStorePut) {
      this.log("storeAndSend :: store packet with cmd %s to outgoingStore", packet2.cmd);
      let storePacket = packet2;
      let err;
      if (storePacket.cmd === "publish") {
        storePacket = (0, default_1.default)(packet2);
        err = this._removeTopicAliasAndRecoverTopicName(storePacket);
        if (err) {
          return cb && cb(err);
        }
      }
      this.outgoingStore.put(storePacket, (err2) => {
        if (err2) {
          return cb && cb(err2);
        }
        cbStorePut();
        this._writePacket(packet2, cb);
      });
    }
    _applyTopicAlias(packet2) {
      if (this.options.protocolVersion === 5) {
        if (packet2.cmd === "publish") {
          let alias;
          if (packet2.properties) {
            alias = packet2.properties.topicAlias;
          }
          const topic = packet2.topic.toString();
          if (this.topicAliasSend) {
            if (alias) {
              if (topic.length !== 0) {
                this.log("applyTopicAlias :: register topic: %s - alias: %d", topic, alias);
                if (!this.topicAliasSend.put(topic, alias)) {
                  this.log("applyTopicAlias :: error out of range. topic: %s - alias: %d", topic, alias);
                  return new Error("Sending Topic Alias out of range");
                }
              }
            } else if (topic.length !== 0) {
              if (this.options.autoAssignTopicAlias) {
                alias = this.topicAliasSend.getAliasByTopic(topic);
                if (alias) {
                  packet2.topic = "";
                  packet2.properties = {
                    ...packet2.properties,
                    topicAlias: alias
                  };
                  this.log("applyTopicAlias :: auto assign(use) topic: %s - alias: %d", topic, alias);
                } else {
                  alias = this.topicAliasSend.getLruAlias();
                  this.topicAliasSend.put(topic, alias);
                  packet2.properties = {
                    ...packet2.properties,
                    topicAlias: alias
                  };
                  this.log("applyTopicAlias :: auto assign topic: %s - alias: %d", topic, alias);
                }
              } else if (this.options.autoUseTopicAlias) {
                alias = this.topicAliasSend.getAliasByTopic(topic);
                if (alias) {
                  packet2.topic = "";
                  packet2.properties = {
                    ...packet2.properties,
                    topicAlias: alias
                  };
                  this.log("applyTopicAlias :: auto use topic: %s - alias: %d", topic, alias);
                }
              }
            }
          } else if (alias) {
            this.log("applyTopicAlias :: error out of range. topic: %s - alias: %d", topic, alias);
            return new Error("Sending Topic Alias out of range");
          }
        }
      }
    }
    _noop(err) {
      this.log("noop ::", err);
    }
    _writePacket(packet2, cb) {
      this.log("_writePacket :: packet: %O", packet2);
      this.log("_writePacket :: emitting `packetsend`");
      this.emit("packetsend", packet2);
      this.log("_writePacket :: writing to stream");
      const result = mqtt_packet_1.default.writeToStream(packet2, this.stream, this.options);
      this.log("_writePacket :: writeToStream result %s", result);
      if (!result && cb && cb !== this.noop) {
        this.log("_writePacket :: handle events on `drain` once through callback.");
        this.stream.once("drain", cb);
      } else if (cb) {
        this.log("_writePacket :: invoking cb");
        cb();
      }
    }
    _sendPacket(packet2, cb, cbStorePut, noStore) {
      this.log("_sendPacket :: (%s) ::  start", this.options.clientId);
      cbStorePut = cbStorePut || this.noop;
      cb = cb || this.noop;
      const err = this._applyTopicAlias(packet2);
      if (err) {
        cb(err);
        return;
      }
      if (!this.connected) {
        if (packet2.cmd === "auth") {
          this._writePacket(packet2, cb);
          return;
        }
        this.log("_sendPacket :: client not connected. Storing packet offline.");
        this._storePacket(packet2, cb, cbStorePut);
        return;
      }
      if (noStore) {
        this._writePacket(packet2, cb);
        return;
      }
      switch (packet2.cmd) {
        case "publish":
          break;
        case "pubrel":
          this._storeAndSend(packet2, cb, cbStorePut);
          return;
        default:
          this._writePacket(packet2, cb);
          return;
      }
      switch (packet2.qos) {
        case 2:
        case 1:
          this._storeAndSend(packet2, cb, cbStorePut);
          break;
        case 0:
        default:
          this._writePacket(packet2, cb);
          break;
      }
      this.log("_sendPacket :: (%s) ::  end", this.options.clientId);
    }
    _storePacket(packet2, cb, cbStorePut) {
      this.log("_storePacket :: packet: %o", packet2);
      this.log("_storePacket :: cb? %s", !!cb);
      cbStorePut = cbStorePut || this.noop;
      let storePacket = packet2;
      if (storePacket.cmd === "publish") {
        storePacket = (0, default_1.default)(packet2);
        const err = this._removeTopicAliasAndRecoverTopicName(storePacket);
        if (err) {
          return cb && cb(err);
        }
      }
      const qos = storePacket.qos || 0;
      if (qos === 0 && this.queueQoSZero || storePacket.cmd !== "publish") {
        this.queue.push({ packet: storePacket, cb });
      } else if (qos > 0) {
        cb = this.outgoing[storePacket.messageId] ? this.outgoing[storePacket.messageId].cb : null;
        this.outgoingStore.put(storePacket, (err) => {
          if (err) {
            return cb && cb(err);
          }
          cbStorePut();
        });
      } else if (cb) {
        cb(new Error("No connection to broker"));
      }
    }
    _setupKeepaliveManager() {
      this.log("_setupKeepaliveManager :: keepalive %d (seconds)", this.options.keepalive);
      if (!this.keepaliveManager && this.options.keepalive) {
        this.keepaliveManager = new KeepaliveManager_1.default(this, this.options.timerVariant);
      }
    }
    _destroyKeepaliveManager() {
      if (this.keepaliveManager) {
        this.log("_destroyKeepaliveManager :: destroying keepalive manager");
        this.keepaliveManager.destroy();
        this.keepaliveManager = null;
      }
    }
    reschedulePing(force = false) {
      if (this.keepaliveManager && this.options.keepalive && (force || this.options.reschedulePings)) {
        this._reschedulePing();
      }
    }
    _reschedulePing() {
      this.log("_reschedulePing :: rescheduling ping");
      this.keepaliveManager.reschedule();
    }
    sendPing() {
      this.log("_sendPing :: sending pingreq");
      this._sendPacket({ cmd: "pingreq" });
    }
    onKeepaliveTimeout() {
      this.emit("error", new Error("Keepalive timeout"));
      this.log("onKeepaliveTimeout :: calling _cleanUp with force true");
      this._cleanUp(true);
    }
    _resubscribe() {
      this.log("_resubscribe");
      const _resubscribeTopicsKeys = Object.keys(this._resubscribeTopics);
      if (!this._firstConnection && (this.options.clean || this.options.protocolVersion >= 4 && !this.connackPacket.sessionPresent) && _resubscribeTopicsKeys.length > 0) {
        if (this.options.resubscribe) {
          if (this.options.protocolVersion === 5) {
            this.log("_resubscribe: protocolVersion 5");
            for (let topicI = 0; topicI < _resubscribeTopicsKeys.length; topicI++) {
              const resubscribeTopic = {};
              resubscribeTopic[_resubscribeTopicsKeys[topicI]] = this._resubscribeTopics[_resubscribeTopicsKeys[topicI]];
              resubscribeTopic.resubscribe = true;
              this.subscribe(resubscribeTopic, {
                properties: resubscribeTopic[_resubscribeTopicsKeys[topicI]].properties
              });
            }
          } else {
            this._resubscribeTopics.resubscribe = true;
            this.subscribe(this._resubscribeTopics);
          }
        } else {
          this._resubscribeTopics = {};
        }
      }
      this._firstConnection = false;
    }
    _onConnect(packet2) {
      if (this.disconnected) {
        this.emit("connect", packet2);
        return;
      }
      this.connackPacket = packet2;
      this.messageIdProvider.clear();
      this._setupKeepaliveManager();
      this.connected = true;
      const startStreamProcess = () => {
        let outStore = this.outgoingStore.createStream();
        const remove = () => {
          outStore.destroy();
          outStore = null;
          this._flushStoreProcessingQueue();
          clearStoreProcessing();
        };
        const clearStoreProcessing = () => {
          this._storeProcessing = false;
          this._packetIdsDuringStoreProcessing = {};
        };
        this.once("close", remove);
        outStore.on("error", (err) => {
          clearStoreProcessing();
          this._flushStoreProcessingQueue();
          this.removeListener("close", remove);
          this.emit("error", err);
        });
        const storeDeliver = () => {
          if (!outStore) {
            return;
          }
          const packet22 = outStore.read(1);
          let cb;
          if (!packet22) {
            outStore.once("readable", storeDeliver);
            return;
          }
          this._storeProcessing = true;
          if (this._packetIdsDuringStoreProcessing[packet22.messageId]) {
            storeDeliver();
            return;
          }
          if (!this.disconnecting && !this.reconnectTimer) {
            cb = this.outgoing[packet22.messageId] ? this.outgoing[packet22.messageId].cb : null;
            this.outgoing[packet22.messageId] = {
              volatile: false,
              cb(err, status) {
                if (cb) {
                  cb(err, status);
                }
                storeDeliver();
              }
            };
            this._packetIdsDuringStoreProcessing[packet22.messageId] = true;
            if (this.messageIdProvider.register(packet22.messageId)) {
              this._sendPacket(packet22, void 0, void 0, true);
            } else {
              this.log("messageId: %d has already used.", packet22.messageId);
            }
          } else if (outStore.destroy) {
            outStore.destroy();
          }
        };
        outStore.on("end", () => {
          let allProcessed = true;
          for (const id in this._packetIdsDuringStoreProcessing) {
            if (!this._packetIdsDuringStoreProcessing[id]) {
              allProcessed = false;
              break;
            }
          }
          this.removeListener("close", remove);
          if (allProcessed) {
            clearStoreProcessing();
            this._invokeAllStoreProcessingQueue();
            this.emit("connect", packet2);
          } else {
            startStreamProcess();
          }
        });
        storeDeliver();
      };
      startStreamProcess();
    }
    _invokeStoreProcessingQueue() {
      if (!this._storeProcessing && this._storeProcessingQueue.length > 0) {
        const f = this._storeProcessingQueue[0];
        if (f && f.invoke()) {
          this._storeProcessingQueue.shift();
          return true;
        }
      }
      return false;
    }
    _invokeAllStoreProcessingQueue() {
      while (this._invokeStoreProcessingQueue()) {
      }
    }
    _flushStoreProcessingQueue() {
      for (const f of this._storeProcessingQueue) {
        if (f.cbStorePut)
          f.cbStorePut(new Error("Connection closed"));
        if (f.callback)
          f.callback(new Error("Connection closed"));
      }
      this._storeProcessingQueue.splice(0);
    }
    _removeOutgoingAndStoreMessage(messageId, cb) {
      delete this.outgoing[messageId];
      this.outgoingStore.del({ messageId }, (err, packet2) => {
        cb(err, packet2);
        this.messageIdProvider.deallocate(messageId);
        this._invokeStoreProcessingQueue();
      });
    }
  };
  __publicField(_MqttClient, "VERSION", shared_1.MQTTJS_VERSION);
  let MqttClient = _MqttClient;
  client.default = MqttClient;
  return client;
}
var uniqueMessageIdProvider = {};
var hasRequiredUniqueMessageIdProvider;
function requireUniqueMessageIdProvider() {
  if (hasRequiredUniqueMessageIdProvider) return uniqueMessageIdProvider;
  hasRequiredUniqueMessageIdProvider = 1;
  Object.defineProperty(uniqueMessageIdProvider, "__esModule", { value: true });
  const number_allocator_1 = requireNumberAllocator();
  class UniqueMessageIdProvider {
    constructor() {
      __publicField(this, "numberAllocator");
      __publicField(this, "lastId");
      this.numberAllocator = new number_allocator_1.NumberAllocator(1, 65535);
    }
    allocate() {
      this.lastId = this.numberAllocator.alloc();
      return this.lastId;
    }
    getLastAllocated() {
      return this.lastId;
    }
    register(messageId) {
      return this.numberAllocator.use(messageId);
    }
    deallocate(messageId) {
      this.numberAllocator.free(messageId);
    }
    clear() {
      this.numberAllocator.clear();
    }
  }
  uniqueMessageIdProvider.default = UniqueMessageIdProvider;
  return uniqueMessageIdProvider;
}
var connect = {};
var ws$1 = {};
var bufferUtil = { exports: {} };
var constants$3;
var hasRequiredConstants$3;
function requireConstants$3() {
  if (hasRequiredConstants$3) return constants$3;
  hasRequiredConstants$3 = 1;
  const BINARY_TYPES = ["nodebuffer", "arraybuffer", "fragments"];
  const hasBlob = typeof Blob !== "undefined";
  if (hasBlob) BINARY_TYPES.push("blob");
  constants$3 = {
    BINARY_TYPES,
    CLOSE_TIMEOUT: 3e4,
    EMPTY_BUFFER: Buffer.alloc(0),
    GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
    hasBlob,
    kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
    kListener: Symbol("kListener"),
    kStatusCode: Symbol("status-code"),
    kWebSocket: Symbol("websocket"),
    NOOP: () => {
    }
  };
  return constants$3;
}
var hasRequiredBufferUtil;
function requireBufferUtil() {
  if (hasRequiredBufferUtil) return bufferUtil.exports;
  hasRequiredBufferUtil = 1;
  const { EMPTY_BUFFER } = requireConstants$3();
  const FastBuffer = Buffer[Symbol.species];
  function concat(list, totalLength) {
    if (list.length === 0) return EMPTY_BUFFER;
    if (list.length === 1) return list[0];
    const target = Buffer.allocUnsafe(totalLength);
    let offset = 0;
    for (let i = 0; i < list.length; i++) {
      const buf = list[i];
      target.set(buf, offset);
      offset += buf.length;
    }
    if (offset < totalLength) {
      return new FastBuffer(target.buffer, target.byteOffset, offset);
    }
    return target;
  }
  function _mask(source, mask, output, offset, length) {
    for (let i = 0; i < length; i++) {
      output[offset + i] = source[i] ^ mask[i & 3];
    }
  }
  function _unmask(buffer, mask) {
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] ^= mask[i & 3];
    }
  }
  function toArrayBuffer(buf) {
    if (buf.length === buf.buffer.byteLength) {
      return buf.buffer;
    }
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
  }
  function toBuffer(data) {
    toBuffer.readOnly = true;
    if (Buffer.isBuffer(data)) return data;
    let buf;
    if (data instanceof ArrayBuffer) {
      buf = new FastBuffer(data);
    } else if (ArrayBuffer.isView(data)) {
      buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
    } else {
      buf = Buffer.from(data);
      toBuffer.readOnly = false;
    }
    return buf;
  }
  bufferUtil.exports = {
    concat,
    mask: _mask,
    toArrayBuffer,
    toBuffer,
    unmask: _unmask
  };
  if (!process.env.WS_NO_BUFFER_UTIL) {
    try {
      const bufferUtil$1 = require("bufferutil");
      bufferUtil.exports.mask = function(source, mask, output, offset, length) {
        if (length < 48) _mask(source, mask, output, offset, length);
        else bufferUtil$1.mask(source, mask, output, offset, length);
      };
      bufferUtil.exports.unmask = function(buffer, mask) {
        if (buffer.length < 32) _unmask(buffer, mask);
        else bufferUtil$1.unmask(buffer, mask);
      };
    } catch (e) {
    }
  }
  return bufferUtil.exports;
}
var limiter;
var hasRequiredLimiter;
function requireLimiter() {
  if (hasRequiredLimiter) return limiter;
  hasRequiredLimiter = 1;
  const kDone = Symbol("kDone");
  const kRun = Symbol("kRun");
  class Limiter {
    /**
     * Creates a new `Limiter`.
     *
     * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
     *     to run concurrently
     */
    constructor(concurrency) {
      this[kDone] = () => {
        this.pending--;
        this[kRun]();
      };
      this.concurrency = concurrency || Infinity;
      this.jobs = [];
      this.pending = 0;
    }
    /**
     * Adds a job to the queue.
     *
     * @param {Function} job The job to run
     * @public
     */
    add(job) {
      this.jobs.push(job);
      this[kRun]();
    }
    /**
     * Removes a job from the queue and runs it if possible.
     *
     * @private
     */
    [kRun]() {
      if (this.pending === this.concurrency) return;
      if (this.jobs.length) {
        const job = this.jobs.shift();
        this.pending++;
        job(this[kDone]);
      }
    }
  }
  limiter = Limiter;
  return limiter;
}
var permessageDeflate;
var hasRequiredPermessageDeflate;
function requirePermessageDeflate() {
  if (hasRequiredPermessageDeflate) return permessageDeflate;
  hasRequiredPermessageDeflate = 1;
  const zlib$1 = zlib;
  const bufferUtil2 = requireBufferUtil();
  const Limiter = requireLimiter();
  const { kStatusCode } = requireConstants$3();
  const FastBuffer = Buffer[Symbol.species];
  const TRAILER = Buffer.from([0, 0, 255, 255]);
  const kPerMessageDeflate = Symbol("permessage-deflate");
  const kTotalLength = Symbol("total-length");
  const kCallback = Symbol("callback");
  const kBuffers = Symbol("buffers");
  const kError = Symbol("error");
  let zlibLimiter;
  class PerMessageDeflate {
    /**
     * Creates a PerMessageDeflate instance.
     *
     * @param {Object} [options] Configuration options
     * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
     *     for, or request, a custom client window size
     * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
     *     acknowledge disabling of client context takeover
     * @param {Number} [options.concurrencyLimit=10] The number of concurrent
     *     calls to zlib
     * @param {Boolean} [options.isServer=false] Create the instance in either
     *     server or client mode
     * @param {Number} [options.maxPayload=0] The maximum allowed message length
     * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
     *     use of a custom server window size
     * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
     *     disabling of server context takeover
     * @param {Number} [options.threshold=1024] Size (in bytes) below which
     *     messages should not be compressed if context takeover is disabled
     * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
     *     deflate
     * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
     *     inflate
     */
    constructor(options) {
      this._options = options || {};
      this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
      this._maxPayload = this._options.maxPayload | 0;
      this._isServer = !!this._options.isServer;
      this._deflate = null;
      this._inflate = null;
      this.params = null;
      if (!zlibLimiter) {
        const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
        zlibLimiter = new Limiter(concurrency);
      }
    }
    /**
     * @type {String}
     */
    static get extensionName() {
      return "permessage-deflate";
    }
    /**
     * Create an extension negotiation offer.
     *
     * @return {Object} Extension parameters
     * @public
     */
    offer() {
      const params = {};
      if (this._options.serverNoContextTakeover) {
        params.server_no_context_takeover = true;
      }
      if (this._options.clientNoContextTakeover) {
        params.client_no_context_takeover = true;
      }
      if (this._options.serverMaxWindowBits) {
        params.server_max_window_bits = this._options.serverMaxWindowBits;
      }
      if (this._options.clientMaxWindowBits) {
        params.client_max_window_bits = this._options.clientMaxWindowBits;
      } else if (this._options.clientMaxWindowBits == null) {
        params.client_max_window_bits = true;
      }
      return params;
    }
    /**
     * Accept an extension negotiation offer/response.
     *
     * @param {Array} configurations The extension negotiation offers/reponse
     * @return {Object} Accepted configuration
     * @public
     */
    accept(configurations) {
      configurations = this.normalizeParams(configurations);
      this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
      return this.params;
    }
    /**
     * Releases all resources used by the extension.
     *
     * @public
     */
    cleanup() {
      if (this._inflate) {
        this._inflate.close();
        this._inflate = null;
      }
      if (this._deflate) {
        const callback = this._deflate[kCallback];
        this._deflate.close();
        this._deflate = null;
        if (callback) {
          callback(
            new Error(
              "The deflate stream was closed while data was being processed"
            )
          );
        }
      }
    }
    /**
     *  Accept an extension negotiation offer.
     *
     * @param {Array} offers The extension negotiation offers
     * @return {Object} Accepted configuration
     * @private
     */
    acceptAsServer(offers) {
      const opts = this._options;
      const accepted = offers.find((params) => {
        if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && !params.client_max_window_bits) {
          return false;
        }
        return true;
      });
      if (!accepted) {
        throw new Error("None of the extension offers can be accepted");
      }
      if (opts.serverNoContextTakeover) {
        accepted.server_no_context_takeover = true;
      }
      if (opts.clientNoContextTakeover) {
        accepted.client_no_context_takeover = true;
      }
      if (typeof opts.serverMaxWindowBits === "number") {
        accepted.server_max_window_bits = opts.serverMaxWindowBits;
      }
      if (typeof opts.clientMaxWindowBits === "number") {
        accepted.client_max_window_bits = opts.clientMaxWindowBits;
      } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
        delete accepted.client_max_window_bits;
      }
      return accepted;
    }
    /**
     * Accept the extension negotiation response.
     *
     * @param {Array} response The extension negotiation response
     * @return {Object} Accepted configuration
     * @private
     */
    acceptAsClient(response) {
      const params = response[0];
      if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
        throw new Error('Unexpected parameter "client_no_context_takeover"');
      }
      if (!params.client_max_window_bits) {
        if (typeof this._options.clientMaxWindowBits === "number") {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        }
      } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
        throw new Error(
          'Unexpected or invalid parameter "client_max_window_bits"'
        );
      }
      return params;
    }
    /**
     * Normalize parameters.
     *
     * @param {Array} configurations The extension negotiation offers/reponse
     * @return {Array} The offers/response with normalized parameters
     * @private
     */
    normalizeParams(configurations) {
      configurations.forEach((params) => {
        Object.keys(params).forEach((key) => {
          let value = params[key];
          if (value.length > 1) {
            throw new Error(`Parameter "${key}" must have only a single value`);
          }
          value = value[0];
          if (key === "client_max_window_bits") {
            if (value !== true) {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num;
            } else if (!this._isServer) {
              throw new TypeError(
                `Invalid value for parameter "${key}": ${value}`
              );
            }
          } else if (key === "server_max_window_bits") {
            const num = +value;
            if (!Number.isInteger(num) || num < 8 || num > 15) {
              throw new TypeError(
                `Invalid value for parameter "${key}": ${value}`
              );
            }
            value = num;
          } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
            if (value !== true) {
              throw new TypeError(
                `Invalid value for parameter "${key}": ${value}`
              );
            }
          } else {
            throw new Error(`Unknown parameter "${key}"`);
          }
          params[key] = value;
        });
      });
      return configurations;
    }
    /**
     * Decompress data. Concurrency limited.
     *
     * @param {Buffer} data Compressed data
     * @param {Boolean} fin Specifies whether or not this is the last fragment
     * @param {Function} callback Callback
     * @public
     */
    decompress(data, fin, callback) {
      zlibLimiter.add((done) => {
        this._decompress(data, fin, (err, result) => {
          done();
          callback(err, result);
        });
      });
    }
    /**
     * Compress data. Concurrency limited.
     *
     * @param {(Buffer|String)} data Data to compress
     * @param {Boolean} fin Specifies whether or not this is the last fragment
     * @param {Function} callback Callback
     * @public
     */
    compress(data, fin, callback) {
      zlibLimiter.add((done) => {
        this._compress(data, fin, (err, result) => {
          done();
          callback(err, result);
        });
      });
    }
    /**
     * Decompress data.
     *
     * @param {Buffer} data Compressed data
     * @param {Boolean} fin Specifies whether or not this is the last fragment
     * @param {Function} callback Callback
     * @private
     */
    _decompress(data, fin, callback) {
      const endpoint = this._isServer ? "client" : "server";
      if (!this._inflate) {
        const key = `${endpoint}_max_window_bits`;
        const windowBits = typeof this.params[key] !== "number" ? zlib$1.Z_DEFAULT_WINDOWBITS : this.params[key];
        this._inflate = zlib$1.createInflateRaw({
          ...this._options.zlibInflateOptions,
          windowBits
        });
        this._inflate[kPerMessageDeflate] = this;
        this._inflate[kTotalLength] = 0;
        this._inflate[kBuffers] = [];
        this._inflate.on("error", inflateOnError);
        this._inflate.on("data", inflateOnData);
      }
      this._inflate[kCallback] = callback;
      this._inflate.write(data);
      if (fin) this._inflate.write(TRAILER);
      this._inflate.flush(() => {
        const err = this._inflate[kError];
        if (err) {
          this._inflate.close();
          this._inflate = null;
          callback(err);
          return;
        }
        const data2 = bufferUtil2.concat(
          this._inflate[kBuffers],
          this._inflate[kTotalLength]
        );
        if (this._inflate._readableState.endEmitted) {
          this._inflate.close();
          this._inflate = null;
        } else {
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._inflate.reset();
          }
        }
        callback(null, data2);
      });
    }
    /**
     * Compress data.
     *
     * @param {(Buffer|String)} data Data to compress
     * @param {Boolean} fin Specifies whether or not this is the last fragment
     * @param {Function} callback Callback
     * @private
     */
    _compress(data, fin, callback) {
      const endpoint = this._isServer ? "server" : "client";
      if (!this._deflate) {
        const key = `${endpoint}_max_window_bits`;
        const windowBits = typeof this.params[key] !== "number" ? zlib$1.Z_DEFAULT_WINDOWBITS : this.params[key];
        this._deflate = zlib$1.createDeflateRaw({
          ...this._options.zlibDeflateOptions,
          windowBits
        });
        this._deflate[kTotalLength] = 0;
        this._deflate[kBuffers] = [];
        this._deflate.on("data", deflateOnData);
      }
      this._deflate[kCallback] = callback;
      this._deflate.write(data);
      this._deflate.flush(zlib$1.Z_SYNC_FLUSH, () => {
        if (!this._deflate) {
          return;
        }
        let data2 = bufferUtil2.concat(
          this._deflate[kBuffers],
          this._deflate[kTotalLength]
        );
        if (fin) {
          data2 = new FastBuffer(data2.buffer, data2.byteOffset, data2.length - 4);
        }
        this._deflate[kCallback] = null;
        this._deflate[kTotalLength] = 0;
        this._deflate[kBuffers] = [];
        if (fin && this.params[`${endpoint}_no_context_takeover`]) {
          this._deflate.reset();
        }
        callback(null, data2);
      });
    }
  }
  permessageDeflate = PerMessageDeflate;
  function deflateOnData(chunk) {
    this[kBuffers].push(chunk);
    this[kTotalLength] += chunk.length;
  }
  function inflateOnData(chunk) {
    this[kTotalLength] += chunk.length;
    if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
      this[kBuffers].push(chunk);
      return;
    }
    this[kError] = new RangeError("Max payload size exceeded");
    this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
    this[kError][kStatusCode] = 1009;
    this.removeListener("data", inflateOnData);
    this.reset();
  }
  function inflateOnError(err) {
    this[kPerMessageDeflate]._inflate = null;
    if (this[kError]) {
      this[kCallback](this[kError]);
      return;
    }
    err[kStatusCode] = 1007;
    this[kCallback](err);
  }
  return permessageDeflate;
}
var validation = { exports: {} };
var hasRequiredValidation;
function requireValidation() {
  if (hasRequiredValidation) return validation.exports;
  hasRequiredValidation = 1;
  const { isUtf8 } = require$$0$5;
  const { hasBlob } = requireConstants$3();
  const tokenChars = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    // 0 - 15
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    // 16 - 31
    0,
    1,
    0,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    1,
    1,
    0,
    1,
    1,
    0,
    // 32 - 47
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    // 48 - 63
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    // 64 - 79
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    1,
    1,
    // 80 - 95
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    // 96 - 111
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    1,
    0,
    1,
    0
    // 112 - 127
  ];
  function isValidStatusCode(code) {
    return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
  }
  function _isValidUTF8(buf) {
    const len = buf.length;
    let i = 0;
    while (i < len) {
      if ((buf[i] & 128) === 0) {
        i++;
      } else if ((buf[i] & 224) === 192) {
        if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
          return false;
        }
        i += 2;
      } else if ((buf[i] & 240) === 224) {
        if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || // Overlong
        buf[i] === 237 && (buf[i + 1] & 224) === 160) {
          return false;
        }
        i += 3;
      } else if ((buf[i] & 248) === 240) {
        if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || // Overlong
        buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
          return false;
        }
        i += 4;
      } else {
        return false;
      }
    }
    return true;
  }
  function isBlob(value) {
    return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
  }
  validation.exports = {
    isBlob,
    isValidStatusCode,
    isValidUTF8: _isValidUTF8,
    tokenChars
  };
  if (isUtf8) {
    validation.exports.isValidUTF8 = function(buf) {
      return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
    };
  } else if (!process.env.WS_NO_UTF_8_VALIDATE) {
    try {
      const isValidUTF8 = require("utf-8-validate");
      validation.exports.isValidUTF8 = function(buf) {
        return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
      };
    } catch (e) {
    }
  }
  return validation.exports;
}
var receiver;
var hasRequiredReceiver;
function requireReceiver() {
  if (hasRequiredReceiver) return receiver;
  hasRequiredReceiver = 1;
  const { Writable } = require$$0$7;
  const PerMessageDeflate = requirePermessageDeflate();
  const {
    BINARY_TYPES,
    EMPTY_BUFFER,
    kStatusCode,
    kWebSocket
  } = requireConstants$3();
  const { concat, toArrayBuffer, unmask } = requireBufferUtil();
  const { isValidStatusCode, isValidUTF8 } = requireValidation();
  const FastBuffer = Buffer[Symbol.species];
  const GET_INFO = 0;
  const GET_PAYLOAD_LENGTH_16 = 1;
  const GET_PAYLOAD_LENGTH_64 = 2;
  const GET_MASK = 3;
  const GET_DATA = 4;
  const INFLATING = 5;
  const DEFER_EVENT = 6;
  class Receiver extends Writable {
    /**
     * Creates a Receiver instance.
     *
     * @param {Object} [options] Options object
     * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
     *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
     *     multiple times in the same tick
     * @param {String} [options.binaryType=nodebuffer] The type for binary data
     * @param {Object} [options.extensions] An object containing the negotiated
     *     extensions
     * @param {Boolean} [options.isServer=false] Specifies whether to operate in
     *     client or server mode
     * @param {Number} [options.maxBufferedChunks=0] The maximum number of
     *     buffered data chunks
     * @param {Number} [options.maxFragments=0] The maximum number of message
     *     fragments
     * @param {Number} [options.maxPayload=0] The maximum allowed message length
     * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
     *     not to skip UTF-8 validation for text and close messages
     */
    constructor(options = {}) {
      super();
      this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
      this._binaryType = options.binaryType || BINARY_TYPES[0];
      this._extensions = options.extensions || {};
      this._isServer = !!options.isServer;
      this._maxBufferedChunks = options.maxBufferedChunks | 0;
      this._maxFragments = options.maxFragments | 0;
      this._maxPayload = options.maxPayload | 0;
      this._skipUTF8Validation = !!options.skipUTF8Validation;
      this[kWebSocket] = void 0;
      this._bufferedBytes = 0;
      this._buffers = [];
      this._compressed = false;
      this._payloadLength = 0;
      this._mask = void 0;
      this._fragmented = 0;
      this._masked = false;
      this._fin = false;
      this._opcode = 0;
      this._totalPayloadLength = 0;
      this._messageLength = 0;
      this._fragments = [];
      this._errored = false;
      this._loop = false;
      this._state = GET_INFO;
    }
    /**
     * Implements `Writable.prototype._write()`.
     *
     * @param {Buffer} chunk The chunk of data to write
     * @param {String} encoding The character encoding of `chunk`
     * @param {Function} cb Callback
     * @private
     */
    _write(chunk, encoding, cb) {
      if (this._opcode === 8 && this._state == GET_INFO) return cb();
      if (this._maxBufferedChunks > 0 && this._buffers.length >= this._maxBufferedChunks) {
        cb(
          this.createError(
            RangeError,
            "Too many buffered chunks",
            false,
            1008,
            "WS_ERR_TOO_MANY_BUFFERED_PARTS"
          )
        );
        return;
      }
      this._bufferedBytes += chunk.length;
      this._buffers.push(chunk);
      this.startLoop(cb);
    }
    /**
     * Consumes `n` bytes from the buffered data.
     *
     * @param {Number} n The number of bytes to consume
     * @return {Buffer} The consumed bytes
     * @private
     */
    consume(n) {
      this._bufferedBytes -= n;
      if (n === this._buffers[0].length) return this._buffers.shift();
      if (n < this._buffers[0].length) {
        const buf = this._buffers[0];
        this._buffers[0] = new FastBuffer(
          buf.buffer,
          buf.byteOffset + n,
          buf.length - n
        );
        return new FastBuffer(buf.buffer, buf.byteOffset, n);
      }
      const dst = Buffer.allocUnsafe(n);
      do {
        const buf = this._buffers[0];
        const offset = dst.length - n;
        if (n >= buf.length) {
          dst.set(this._buffers.shift(), offset);
        } else {
          dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
          this._buffers[0] = new FastBuffer(
            buf.buffer,
            buf.byteOffset + n,
            buf.length - n
          );
        }
        n -= buf.length;
      } while (n > 0);
      return dst;
    }
    /**
     * Starts the parsing loop.
     *
     * @param {Function} cb Callback
     * @private
     */
    startLoop(cb) {
      this._loop = true;
      do {
        switch (this._state) {
          case GET_INFO:
            this.getInfo(cb);
            break;
          case GET_PAYLOAD_LENGTH_16:
            this.getPayloadLength16(cb);
            break;
          case GET_PAYLOAD_LENGTH_64:
            this.getPayloadLength64(cb);
            break;
          case GET_MASK:
            this.getMask();
            break;
          case GET_DATA:
            this.getData(cb);
            break;
          case INFLATING:
          case DEFER_EVENT:
            this._loop = false;
            return;
        }
      } while (this._loop);
      if (!this._errored) cb();
    }
    /**
     * Reads the first two bytes of a frame.
     *
     * @param {Function} cb Callback
     * @private
     */
    getInfo(cb) {
      if (this._bufferedBytes < 2) {
        this._loop = false;
        return;
      }
      const buf = this.consume(2);
      if ((buf[0] & 48) !== 0) {
        const error = this.createError(
          RangeError,
          "RSV2 and RSV3 must be clear",
          true,
          1002,
          "WS_ERR_UNEXPECTED_RSV_2_3"
        );
        cb(error);
        return;
      }
      const compressed = (buf[0] & 64) === 64;
      if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
        const error = this.createError(
          RangeError,
          "RSV1 must be clear",
          true,
          1002,
          "WS_ERR_UNEXPECTED_RSV_1"
        );
        cb(error);
        return;
      }
      this._fin = (buf[0] & 128) === 128;
      this._opcode = buf[0] & 15;
      this._payloadLength = buf[1] & 127;
      if (this._opcode === 0) {
        if (compressed) {
          const error = this.createError(
            RangeError,
            "RSV1 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
          cb(error);
          return;
        }
        if (!this._fragmented) {
          const error = this.createError(
            RangeError,
            "invalid opcode 0",
            true,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
          cb(error);
          return;
        }
        this._opcode = this._fragmented;
      } else if (this._opcode === 1 || this._opcode === 2) {
        if (this._fragmented) {
          const error = this.createError(
            RangeError,
            `invalid opcode ${this._opcode}`,
            true,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
          cb(error);
          return;
        }
        this._compressed = compressed;
      } else if (this._opcode > 7 && this._opcode < 11) {
        if (!this._fin) {
          const error = this.createError(
            RangeError,
            "FIN must be set",
            true,
            1002,
            "WS_ERR_EXPECTED_FIN"
          );
          cb(error);
          return;
        }
        if (compressed) {
          const error = this.createError(
            RangeError,
            "RSV1 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
          cb(error);
          return;
        }
        if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
          const error = this.createError(
            RangeError,
            `invalid payload length ${this._payloadLength}`,
            true,
            1002,
            "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
          );
          cb(error);
          return;
        }
      } else {
        const error = this.createError(
          RangeError,
          `invalid opcode ${this._opcode}`,
          true,
          1002,
          "WS_ERR_INVALID_OPCODE"
        );
        cb(error);
        return;
      }
      if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
      this._masked = (buf[1] & 128) === 128;
      if (this._isServer) {
        if (!this._masked) {
          const error = this.createError(
            RangeError,
            "MASK must be set",
            true,
            1002,
            "WS_ERR_EXPECTED_MASK"
          );
          cb(error);
          return;
        }
      } else if (this._masked) {
        const error = this.createError(
          RangeError,
          "MASK must be clear",
          true,
          1002,
          "WS_ERR_UNEXPECTED_MASK"
        );
        cb(error);
        return;
      }
      if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
      else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
      else this.haveLength(cb);
    }
    /**
     * Gets extended payload length (7+16).
     *
     * @param {Function} cb Callback
     * @private
     */
    getPayloadLength16(cb) {
      if (this._bufferedBytes < 2) {
        this._loop = false;
        return;
      }
      this._payloadLength = this.consume(2).readUInt16BE(0);
      this.haveLength(cb);
    }
    /**
     * Gets extended payload length (7+64).
     *
     * @param {Function} cb Callback
     * @private
     */
    getPayloadLength64(cb) {
      if (this._bufferedBytes < 8) {
        this._loop = false;
        return;
      }
      const buf = this.consume(8);
      const num = buf.readUInt32BE(0);
      if (num > Math.pow(2, 53 - 32) - 1) {
        const error = this.createError(
          RangeError,
          "Unsupported WebSocket frame: payload length > 2^53 - 1",
          false,
          1009,
          "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
        );
        cb(error);
        return;
      }
      this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
      this.haveLength(cb);
    }
    /**
     * Payload length has been read.
     *
     * @param {Function} cb Callback
     * @private
     */
    haveLength(cb) {
      if (this._payloadLength && this._opcode < 8) {
        this._totalPayloadLength += this._payloadLength;
        if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
          const error = this.createError(
            RangeError,
            "Max payload size exceeded",
            false,
            1009,
            "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
          );
          cb(error);
          return;
        }
      }
      if (this._masked) this._state = GET_MASK;
      else this._state = GET_DATA;
    }
    /**
     * Reads mask bytes.
     *
     * @private
     */
    getMask() {
      if (this._bufferedBytes < 4) {
        this._loop = false;
        return;
      }
      this._mask = this.consume(4);
      this._state = GET_DATA;
    }
    /**
     * Reads data bytes.
     *
     * @param {Function} cb Callback
     * @private
     */
    getData(cb) {
      let data = EMPTY_BUFFER;
      if (this._payloadLength) {
        if (this._bufferedBytes < this._payloadLength) {
          this._loop = false;
          return;
        }
        data = this.consume(this._payloadLength);
        if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
          unmask(data, this._mask);
        }
      }
      if (this._opcode > 7) {
        this.controlMessage(data, cb);
        return;
      }
      if (this._compressed) {
        this._state = INFLATING;
        this.decompress(data, cb);
        return;
      }
      if (data.length) {
        if (this._maxFragments > 0 && this._fragments.length >= this._maxFragments) {
          const error = this.createError(
            RangeError,
            "Too many message fragments",
            false,
            1008,
            "WS_ERR_TOO_MANY_BUFFERED_PARTS"
          );
          cb(error);
          return;
        }
        this._messageLength = this._totalPayloadLength;
        this._fragments.push(data);
      }
      this.dataMessage(cb);
    }
    /**
     * Decompresses data.
     *
     * @param {Buffer} data Compressed data
     * @param {Function} cb Callback
     * @private
     */
    decompress(data, cb) {
      const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
      perMessageDeflate.decompress(data, this._fin, (err, buf) => {
        if (err) return cb(err);
        if (buf.length) {
          this._messageLength += buf.length;
          if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
            const error = this.createError(
              RangeError,
              "Max payload size exceeded",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
            cb(error);
            return;
          }
          if (this._maxFragments > 0 && this._fragments.length >= this._maxFragments) {
            const error = this.createError(
              RangeError,
              "Too many message fragments",
              false,
              1008,
              "WS_ERR_TOO_MANY_BUFFERED_PARTS"
            );
            cb(error);
            return;
          }
          this._fragments.push(buf);
        }
        this.dataMessage(cb);
        if (this._state === GET_INFO) this.startLoop(cb);
      });
    }
    /**
     * Handles a data message.
     *
     * @param {Function} cb Callback
     * @private
     */
    dataMessage(cb) {
      if (!this._fin) {
        this._state = GET_INFO;
        return;
      }
      const messageLength = this._messageLength;
      const fragments = this._fragments;
      this._totalPayloadLength = 0;
      this._messageLength = 0;
      this._fragmented = 0;
      this._fragments = [];
      if (this._opcode === 2) {
        let data;
        if (this._binaryType === "nodebuffer") {
          data = concat(fragments, messageLength);
        } else if (this._binaryType === "arraybuffer") {
          data = toArrayBuffer(concat(fragments, messageLength));
        } else if (this._binaryType === "blob") {
          data = new Blob(fragments);
        } else {
          data = fragments;
        }
        if (this._allowSynchronousEvents) {
          this.emit("message", data, true);
          this._state = GET_INFO;
        } else {
          this._state = DEFER_EVENT;
          setImmediate(() => {
            this.emit("message", data, true);
            this._state = GET_INFO;
            this.startLoop(cb);
          });
        }
      } else {
        const buf = concat(fragments, messageLength);
        if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
          const error = this.createError(
            Error,
            "invalid UTF-8 sequence",
            true,
            1007,
            "WS_ERR_INVALID_UTF8"
          );
          cb(error);
          return;
        }
        if (this._state === INFLATING || this._allowSynchronousEvents) {
          this.emit("message", buf, false);
          this._state = GET_INFO;
        } else {
          this._state = DEFER_EVENT;
          setImmediate(() => {
            this.emit("message", buf, false);
            this._state = GET_INFO;
            this.startLoop(cb);
          });
        }
      }
    }
    /**
     * Handles a control message.
     *
     * @param {Buffer} data Data to handle
     * @return {(Error|RangeError|undefined)} A possible error
     * @private
     */
    controlMessage(data, cb) {
      if (this._opcode === 8) {
        if (data.length === 0) {
          this._loop = false;
          this.emit("conclude", 1005, EMPTY_BUFFER);
          this.end();
        } else {
          const code = data.readUInt16BE(0);
          if (!isValidStatusCode(code)) {
            const error = this.createError(
              RangeError,
              `invalid status code ${code}`,
              true,
              1002,
              "WS_ERR_INVALID_CLOSE_CODE"
            );
            cb(error);
            return;
          }
          const buf = new FastBuffer(
            data.buffer,
            data.byteOffset + 2,
            data.length - 2
          );
          if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
            const error = this.createError(
              Error,
              "invalid UTF-8 sequence",
              true,
              1007,
              "WS_ERR_INVALID_UTF8"
            );
            cb(error);
            return;
          }
          this._loop = false;
          this.emit("conclude", code, buf);
          this.end();
        }
        this._state = GET_INFO;
        return;
      }
      if (this._allowSynchronousEvents) {
        this.emit(this._opcode === 9 ? "ping" : "pong", data);
        this._state = GET_INFO;
      } else {
        this._state = DEFER_EVENT;
        setImmediate(() => {
          this.emit(this._opcode === 9 ? "ping" : "pong", data);
          this._state = GET_INFO;
          this.startLoop(cb);
        });
      }
    }
    /**
     * Builds an error object.
     *
     * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
     * @param {String} message The error message
     * @param {Boolean} prefix Specifies whether or not to add a default prefix to
     *     `message`
     * @param {Number} statusCode The status code
     * @param {String} errorCode The exposed error code
     * @return {(Error|RangeError)} The error
     * @private
     */
    createError(ErrorCtor, message, prefix, statusCode, errorCode) {
      this._loop = false;
      this._errored = true;
      const err = new ErrorCtor(
        prefix ? `Invalid WebSocket frame: ${message}` : message
      );
      Error.captureStackTrace(err, this.createError);
      err.code = errorCode;
      err[kStatusCode] = statusCode;
      return err;
    }
  }
  receiver = Receiver;
  return receiver;
}
var sender;
var hasRequiredSender;
function requireSender() {
  if (hasRequiredSender) return sender;
  hasRequiredSender = 1;
  const { Duplex } = require$$0$7;
  const { randomFillSync } = require$$1$2;
  const {
    types: { isUint8Array }
  } = require$$1;
  const PerMessageDeflate = requirePermessageDeflate();
  const { EMPTY_BUFFER, kWebSocket, NOOP } = requireConstants$3();
  const { isBlob, isValidStatusCode } = requireValidation();
  const { mask: applyMask, toBuffer } = requireBufferUtil();
  const kByteLength = Symbol("kByteLength");
  const maskBuffer = Buffer.alloc(4);
  const RANDOM_POOL_SIZE = 8 * 1024;
  let randomPool;
  let randomPoolPointer = RANDOM_POOL_SIZE;
  const DEFAULT = 0;
  const DEFLATING = 1;
  const GET_BLOB_DATA = 2;
  class Sender {
    /**
     * Creates a Sender instance.
     *
     * @param {Duplex} socket The connection socket
     * @param {Object} [extensions] An object containing the negotiated extensions
     * @param {Function} [generateMask] The function used to generate the masking
     *     key
     */
    constructor(socket, extensions, generateMask) {
      this._extensions = extensions || {};
      if (generateMask) {
        this._generateMask = generateMask;
        this._maskBuffer = Buffer.alloc(4);
      }
      this._socket = socket;
      this._firstFragment = true;
      this._compress = false;
      this._bufferedBytes = 0;
      this._queue = [];
      this._state = DEFAULT;
      this.onerror = NOOP;
      this[kWebSocket] = void 0;
    }
    /**
     * Frames a piece of data according to the HyBi WebSocket protocol.
     *
     * @param {(Buffer|String)} data The data to frame
     * @param {Object} options Options object
     * @param {Boolean} [options.fin=false] Specifies whether or not to set the
     *     FIN bit
     * @param {Function} [options.generateMask] The function used to generate the
     *     masking key
     * @param {Boolean} [options.mask=false] Specifies whether or not to mask
     *     `data`
     * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
     *     key
     * @param {Number} options.opcode The opcode
     * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
     *     modified
     * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
     *     RSV1 bit
     * @return {(Buffer|String)[]} The framed data
     * @public
     */
    static frame(data, options) {
      let mask;
      let merge = false;
      let offset = 2;
      let skipMasking = false;
      if (options.mask) {
        mask = options.maskBuffer || maskBuffer;
        if (options.generateMask) {
          options.generateMask(mask);
        } else {
          if (randomPoolPointer === RANDOM_POOL_SIZE) {
            if (randomPool === void 0) {
              randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
            }
            randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
            randomPoolPointer = 0;
          }
          mask[0] = randomPool[randomPoolPointer++];
          mask[1] = randomPool[randomPoolPointer++];
          mask[2] = randomPool[randomPoolPointer++];
          mask[3] = randomPool[randomPoolPointer++];
        }
        skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
        offset = 6;
      }
      let dataLength;
      if (typeof data === "string") {
        if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) {
          dataLength = options[kByteLength];
        } else {
          data = Buffer.from(data);
          dataLength = data.length;
        }
      } else {
        dataLength = data.length;
        merge = options.mask && options.readOnly && !skipMasking;
      }
      let payloadLength = dataLength;
      if (dataLength >= 65536) {
        offset += 8;
        payloadLength = 127;
      } else if (dataLength > 125) {
        offset += 2;
        payloadLength = 126;
      }
      const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
      target[0] = options.fin ? options.opcode | 128 : options.opcode;
      if (options.rsv1) target[0] |= 64;
      target[1] = payloadLength;
      if (payloadLength === 126) {
        target.writeUInt16BE(dataLength, 2);
      } else if (payloadLength === 127) {
        target[2] = target[3] = 0;
        target.writeUIntBE(dataLength, 4, 6);
      }
      if (!options.mask) return [target, data];
      target[1] |= 128;
      target[offset - 4] = mask[0];
      target[offset - 3] = mask[1];
      target[offset - 2] = mask[2];
      target[offset - 1] = mask[3];
      if (skipMasking) return [target, data];
      if (merge) {
        applyMask(data, mask, target, offset, dataLength);
        return [target];
      }
      applyMask(data, mask, data, 0, dataLength);
      return [target, data];
    }
    /**
     * Sends a close message to the other peer.
     *
     * @param {Number} [code] The status code component of the body
     * @param {(String|Buffer)} [data] The message component of the body
     * @param {Boolean} [mask=false] Specifies whether or not to mask the message
     * @param {Function} [cb] Callback
     * @public
     */
    close(code, data, mask, cb) {
      let buf;
      if (code === void 0) {
        buf = EMPTY_BUFFER;
      } else if (typeof code !== "number" || !isValidStatusCode(code)) {
        throw new TypeError("First argument must be a valid error code number");
      } else if (data === void 0 || !data.length) {
        buf = Buffer.allocUnsafe(2);
        buf.writeUInt16BE(code, 0);
      } else {
        const length = Buffer.byteLength(data);
        if (length > 123) {
          throw new RangeError("The message must not be greater than 123 bytes");
        }
        buf = Buffer.allocUnsafe(2 + length);
        buf.writeUInt16BE(code, 0);
        if (typeof data === "string") {
          buf.write(data, 2);
        } else if (isUint8Array(data)) {
          buf.set(data, 2);
        } else {
          throw new TypeError("Second argument must be a string or a Uint8Array");
        }
      }
      const options = {
        [kByteLength]: buf.length,
        fin: true,
        generateMask: this._generateMask,
        mask,
        maskBuffer: this._maskBuffer,
        opcode: 8,
        readOnly: false,
        rsv1: false
      };
      if (this._state !== DEFAULT) {
        this.enqueue([this.dispatch, buf, false, options, cb]);
      } else {
        this.sendFrame(Sender.frame(buf, options), cb);
      }
    }
    /**
     * Sends a ping message to the other peer.
     *
     * @param {*} data The message to send
     * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
     * @param {Function} [cb] Callback
     * @public
     */
    ping(data, mask, cb) {
      let byteLength;
      let readOnly;
      if (typeof data === "string") {
        byteLength = Buffer.byteLength(data);
        readOnly = false;
      } else if (isBlob(data)) {
        byteLength = data.size;
        readOnly = false;
      } else {
        data = toBuffer(data);
        byteLength = data.length;
        readOnly = toBuffer.readOnly;
      }
      if (byteLength > 125) {
        throw new RangeError("The data size must not be greater than 125 bytes");
      }
      const options = {
        [kByteLength]: byteLength,
        fin: true,
        generateMask: this._generateMask,
        mask,
        maskBuffer: this._maskBuffer,
        opcode: 9,
        readOnly,
        rsv1: false
      };
      if (isBlob(data)) {
        if (this._state !== DEFAULT) {
          this.enqueue([this.getBlobData, data, false, options, cb]);
        } else {
          this.getBlobData(data, false, options, cb);
        }
      } else if (this._state !== DEFAULT) {
        this.enqueue([this.dispatch, data, false, options, cb]);
      } else {
        this.sendFrame(Sender.frame(data, options), cb);
      }
    }
    /**
     * Sends a pong message to the other peer.
     *
     * @param {*} data The message to send
     * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
     * @param {Function} [cb] Callback
     * @public
     */
    pong(data, mask, cb) {
      let byteLength;
      let readOnly;
      if (typeof data === "string") {
        byteLength = Buffer.byteLength(data);
        readOnly = false;
      } else if (isBlob(data)) {
        byteLength = data.size;
        readOnly = false;
      } else {
        data = toBuffer(data);
        byteLength = data.length;
        readOnly = toBuffer.readOnly;
      }
      if (byteLength > 125) {
        throw new RangeError("The data size must not be greater than 125 bytes");
      }
      const options = {
        [kByteLength]: byteLength,
        fin: true,
        generateMask: this._generateMask,
        mask,
        maskBuffer: this._maskBuffer,
        opcode: 10,
        readOnly,
        rsv1: false
      };
      if (isBlob(data)) {
        if (this._state !== DEFAULT) {
          this.enqueue([this.getBlobData, data, false, options, cb]);
        } else {
          this.getBlobData(data, false, options, cb);
        }
      } else if (this._state !== DEFAULT) {
        this.enqueue([this.dispatch, data, false, options, cb]);
      } else {
        this.sendFrame(Sender.frame(data, options), cb);
      }
    }
    /**
     * Sends a data message to the other peer.
     *
     * @param {*} data The message to send
     * @param {Object} options Options object
     * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
     *     or text
     * @param {Boolean} [options.compress=false] Specifies whether or not to
     *     compress `data`
     * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
     *     last one
     * @param {Boolean} [options.mask=false] Specifies whether or not to mask
     *     `data`
     * @param {Function} [cb] Callback
     * @public
     */
    send(data, options, cb) {
      const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
      let opcode = options.binary ? 2 : 1;
      let rsv1 = options.compress;
      let byteLength;
      let readOnly;
      if (typeof data === "string") {
        byteLength = Buffer.byteLength(data);
        readOnly = false;
      } else if (isBlob(data)) {
        byteLength = data.size;
        readOnly = false;
      } else {
        data = toBuffer(data);
        byteLength = data.length;
        readOnly = toBuffer.readOnly;
      }
      if (this._firstFragment) {
        this._firstFragment = false;
        if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
          rsv1 = byteLength >= perMessageDeflate._threshold;
        }
        this._compress = rsv1;
      } else {
        rsv1 = false;
        opcode = 0;
      }
      if (options.fin) this._firstFragment = true;
      const opts = {
        [kByteLength]: byteLength,
        fin: options.fin,
        generateMask: this._generateMask,
        mask: options.mask,
        maskBuffer: this._maskBuffer,
        opcode,
        readOnly,
        rsv1
      };
      if (isBlob(data)) {
        if (this._state !== DEFAULT) {
          this.enqueue([this.getBlobData, data, this._compress, opts, cb]);
        } else {
          this.getBlobData(data, this._compress, opts, cb);
        }
      } else if (this._state !== DEFAULT) {
        this.enqueue([this.dispatch, data, this._compress, opts, cb]);
      } else {
        this.dispatch(data, this._compress, opts, cb);
      }
    }
    /**
     * Gets the contents of a blob as binary data.
     *
     * @param {Blob} blob The blob
     * @param {Boolean} [compress=false] Specifies whether or not to compress
     *     the data
     * @param {Object} options Options object
     * @param {Boolean} [options.fin=false] Specifies whether or not to set the
     *     FIN bit
     * @param {Function} [options.generateMask] The function used to generate the
     *     masking key
     * @param {Boolean} [options.mask=false] Specifies whether or not to mask
     *     `data`
     * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
     *     key
     * @param {Number} options.opcode The opcode
     * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
     *     modified
     * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
     *     RSV1 bit
     * @param {Function} [cb] Callback
     * @private
     */
    getBlobData(blob, compress, options, cb) {
      this._bufferedBytes += options[kByteLength];
      this._state = GET_BLOB_DATA;
      blob.arrayBuffer().then((arrayBuffer) => {
        if (this._socket.destroyed) {
          const err = new Error(
            "The socket was closed while the blob was being read"
          );
          process.nextTick(callCallbacks, this, err, cb);
          return;
        }
        this._bufferedBytes -= options[kByteLength];
        const data = toBuffer(arrayBuffer);
        if (!compress) {
          this._state = DEFAULT;
          this.sendFrame(Sender.frame(data, options), cb);
          this.dequeue();
        } else {
          this.dispatch(data, compress, options, cb);
        }
      }).catch((err) => {
        process.nextTick(onError, this, err, cb);
      });
    }
    /**
     * Dispatches a message.
     *
     * @param {(Buffer|String)} data The message to send
     * @param {Boolean} [compress=false] Specifies whether or not to compress
     *     `data`
     * @param {Object} options Options object
     * @param {Boolean} [options.fin=false] Specifies whether or not to set the
     *     FIN bit
     * @param {Function} [options.generateMask] The function used to generate the
     *     masking key
     * @param {Boolean} [options.mask=false] Specifies whether or not to mask
     *     `data`
     * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
     *     key
     * @param {Number} options.opcode The opcode
     * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
     *     modified
     * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
     *     RSV1 bit
     * @param {Function} [cb] Callback
     * @private
     */
    dispatch(data, compress, options, cb) {
      if (!compress) {
        this.sendFrame(Sender.frame(data, options), cb);
        return;
      }
      const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
      this._bufferedBytes += options[kByteLength];
      this._state = DEFLATING;
      perMessageDeflate.compress(data, options.fin, (_, buf) => {
        if (this._socket.destroyed) {
          const err = new Error(
            "The socket was closed while data was being compressed"
          );
          callCallbacks(this, err, cb);
          return;
        }
        this._bufferedBytes -= options[kByteLength];
        this._state = DEFAULT;
        options.readOnly = false;
        this.sendFrame(Sender.frame(buf, options), cb);
        this.dequeue();
      });
    }
    /**
     * Executes queued send operations.
     *
     * @private
     */
    dequeue() {
      while (this._state === DEFAULT && this._queue.length) {
        const params = this._queue.shift();
        this._bufferedBytes -= params[3][kByteLength];
        Reflect.apply(params[0], this, params.slice(1));
      }
    }
    /**
     * Enqueues a send operation.
     *
     * @param {Array} params Send operation parameters.
     * @private
     */
    enqueue(params) {
      this._bufferedBytes += params[3][kByteLength];
      this._queue.push(params);
    }
    /**
     * Sends a frame.
     *
     * @param {(Buffer | String)[]} list The frame to send
     * @param {Function} [cb] Callback
     * @private
     */
    sendFrame(list, cb) {
      if (list.length === 2) {
        this._socket.cork();
        this._socket.write(list[0]);
        this._socket.write(list[1], cb);
        this._socket.uncork();
      } else {
        this._socket.write(list[0], cb);
      }
    }
  }
  sender = Sender;
  function callCallbacks(sender2, err, cb) {
    if (typeof cb === "function") cb(err);
    for (let i = 0; i < sender2._queue.length; i++) {
      const params = sender2._queue[i];
      const callback = params[params.length - 1];
      if (typeof callback === "function") callback(err);
    }
  }
  function onError(sender2, err, cb) {
    callCallbacks(sender2, err, cb);
    sender2.onerror(err);
  }
  return sender;
}
var eventTarget;
var hasRequiredEventTarget;
function requireEventTarget() {
  if (hasRequiredEventTarget) return eventTarget;
  hasRequiredEventTarget = 1;
  const { kForOnEventAttribute, kListener } = requireConstants$3();
  const kCode = Symbol("kCode");
  const kData = Symbol("kData");
  const kError = Symbol("kError");
  const kMessage = Symbol("kMessage");
  const kReason = Symbol("kReason");
  const kTarget = Symbol("kTarget");
  const kType = Symbol("kType");
  const kWasClean = Symbol("kWasClean");
  class Event2 {
    /**
     * Create a new `Event`.
     *
     * @param {String} type The name of the event
     * @throws {TypeError} If the `type` argument is not specified
     */
    constructor(type) {
      this[kTarget] = null;
      this[kType] = type;
    }
    /**
     * @type {*}
     */
    get target() {
      return this[kTarget];
    }
    /**
     * @type {String}
     */
    get type() {
      return this[kType];
    }
  }
  Object.defineProperty(Event2.prototype, "target", { enumerable: true });
  Object.defineProperty(Event2.prototype, "type", { enumerable: true });
  class CloseEvent extends Event2 {
    /**
     * Create a new `CloseEvent`.
     *
     * @param {String} type The name of the event
     * @param {Object} [options] A dictionary object that allows for setting
     *     attributes via object members of the same name
     * @param {Number} [options.code=0] The status code explaining why the
     *     connection was closed
     * @param {String} [options.reason=''] A human-readable string explaining why
     *     the connection was closed
     * @param {Boolean} [options.wasClean=false] Indicates whether or not the
     *     connection was cleanly closed
     */
    constructor(type, options = {}) {
      super(type);
      this[kCode] = options.code === void 0 ? 0 : options.code;
      this[kReason] = options.reason === void 0 ? "" : options.reason;
      this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
    }
    /**
     * @type {Number}
     */
    get code() {
      return this[kCode];
    }
    /**
     * @type {String}
     */
    get reason() {
      return this[kReason];
    }
    /**
     * @type {Boolean}
     */
    get wasClean() {
      return this[kWasClean];
    }
  }
  Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
  Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
  Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
  class ErrorEvent extends Event2 {
    /**
     * Create a new `ErrorEvent`.
     *
     * @param {String} type The name of the event
     * @param {Object} [options] A dictionary object that allows for setting
     *     attributes via object members of the same name
     * @param {*} [options.error=null] The error that generated this event
     * @param {String} [options.message=''] The error message
     */
    constructor(type, options = {}) {
      super(type);
      this[kError] = options.error === void 0 ? null : options.error;
      this[kMessage] = options.message === void 0 ? "" : options.message;
    }
    /**
     * @type {*}
     */
    get error() {
      return this[kError];
    }
    /**
     * @type {String}
     */
    get message() {
      return this[kMessage];
    }
  }
  Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
  Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
  class MessageEvent extends Event2 {
    /**
     * Create a new `MessageEvent`.
     *
     * @param {String} type The name of the event
     * @param {Object} [options] A dictionary object that allows for setting
     *     attributes via object members of the same name
     * @param {*} [options.data=null] The message content
     */
    constructor(type, options = {}) {
      super(type);
      this[kData] = options.data === void 0 ? null : options.data;
    }
    /**
     * @type {*}
     */
    get data() {
      return this[kData];
    }
  }
  Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
  const EventTarget2 = {
    /**
     * Register an event listener.
     *
     * @param {String} type A string representing the event type to listen for
     * @param {(Function|Object)} handler The listener to add
     * @param {Object} [options] An options object specifies characteristics about
     *     the event listener
     * @param {Boolean} [options.once=false] A `Boolean` indicating that the
     *     listener should be invoked at most once after being added. If `true`,
     *     the listener would be automatically removed when invoked.
     * @public
     */
    addEventListener(type, handler, options = {}) {
      for (const listener of this.listeners(type)) {
        if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) {
          return;
        }
      }
      let wrapper;
      if (type === "message") {
        wrapper = function onMessage(data, isBinary) {
          const event = new MessageEvent("message", {
            data: isBinary ? data : data.toString()
          });
          event[kTarget] = this;
          callListener(handler, this, event);
        };
      } else if (type === "close") {
        wrapper = function onClose(code, message) {
          const event = new CloseEvent("close", {
            code,
            reason: message.toString(),
            wasClean: this._closeFrameReceived && this._closeFrameSent
          });
          event[kTarget] = this;
          callListener(handler, this, event);
        };
      } else if (type === "error") {
        wrapper = function onError(error) {
          const event = new ErrorEvent("error", {
            error,
            message: error.message
          });
          event[kTarget] = this;
          callListener(handler, this, event);
        };
      } else if (type === "open") {
        wrapper = function onOpen() {
          const event = new Event2("open");
          event[kTarget] = this;
          callListener(handler, this, event);
        };
      } else {
        return;
      }
      wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
      wrapper[kListener] = handler;
      if (options.once) {
        this.once(type, wrapper);
      } else {
        this.on(type, wrapper);
      }
    },
    /**
     * Remove an event listener.
     *
     * @param {String} type A string representing the event type to remove
     * @param {(Function|Object)} handler The listener to remove
     * @public
     */
    removeEventListener(type, handler) {
      for (const listener of this.listeners(type)) {
        if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
          this.removeListener(type, listener);
          break;
        }
      }
    }
  };
  eventTarget = {
    CloseEvent,
    ErrorEvent,
    Event: Event2,
    EventTarget: EventTarget2,
    MessageEvent
  };
  function callListener(listener, thisArg, event) {
    if (typeof listener === "object" && listener.handleEvent) {
      listener.handleEvent.call(listener, event);
    } else {
      listener.call(thisArg, event);
    }
  }
  return eventTarget;
}
var extension;
var hasRequiredExtension;
function requireExtension() {
  if (hasRequiredExtension) return extension;
  hasRequiredExtension = 1;
  const { tokenChars } = requireValidation();
  function push(dest, name, elem) {
    if (dest[name] === void 0) dest[name] = [elem];
    else dest[name].push(elem);
  }
  function parse(header) {
    const offers = /* @__PURE__ */ Object.create(null);
    let params = /* @__PURE__ */ Object.create(null);
    let mustUnescape = false;
    let isEscaping = false;
    let inQuotes = false;
    let extensionName;
    let paramName;
    let start = -1;
    let code = -1;
    let end = -1;
    let i = 0;
    for (; i < header.length; i++) {
      code = header.charCodeAt(i);
      if (extensionName === void 0) {
        if (end === -1 && tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (i !== 0 && (code === 32 || code === 9)) {
          if (end === -1 && start !== -1) end = i;
        } else if (code === 59 || code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1) end = i;
          const name = header.slice(start, end);
          if (code === 44) {
            push(offers, name, params);
            params = /* @__PURE__ */ Object.create(null);
          } else {
            extensionName = name;
          }
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      } else if (paramName === void 0) {
        if (end === -1 && tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (code === 32 || code === 9) {
          if (end === -1 && start !== -1) end = i;
        } else if (code === 59 || code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1) end = i;
          push(params, header.slice(start, end), true);
          if (code === 44) {
            push(offers, extensionName, params);
            params = /* @__PURE__ */ Object.create(null);
            extensionName = void 0;
          }
          start = end = -1;
        } else if (code === 61 && start !== -1 && end === -1) {
          paramName = header.slice(start, i);
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      } else {
        if (isEscaping) {
          if (tokenChars[code] !== 1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (start === -1) start = i;
          else if (!mustUnescape) mustUnescape = true;
          isEscaping = false;
        } else if (inQuotes) {
          if (tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (code === 34 && start !== -1) {
            inQuotes = false;
            end = i;
          } else if (code === 92) {
            isEscaping = true;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
          inQuotes = true;
        } else if (end === -1 && tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (start !== -1 && (code === 32 || code === 9)) {
          if (end === -1) end = i;
        } else if (code === 59 || code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1) end = i;
          let value = header.slice(start, end);
          if (mustUnescape) {
            value = value.replace(/\\/g, "");
            mustUnescape = false;
          }
          push(params, paramName, value);
          if (code === 44) {
            push(offers, extensionName, params);
            params = /* @__PURE__ */ Object.create(null);
            extensionName = void 0;
          }
          paramName = void 0;
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      }
    }
    if (start === -1 || inQuotes || code === 32 || code === 9) {
      throw new SyntaxError("Unexpected end of input");
    }
    if (end === -1) end = i;
    const token = header.slice(start, end);
    if (extensionName === void 0) {
      push(offers, token, params);
    } else {
      if (paramName === void 0) {
        push(params, token, true);
      } else if (mustUnescape) {
        push(params, paramName, token.replace(/\\/g, ""));
      } else {
        push(params, paramName, token);
      }
      push(offers, extensionName, params);
    }
    return offers;
  }
  function format(extensions) {
    return Object.keys(extensions).map((extension2) => {
      let configurations = extensions[extension2];
      if (!Array.isArray(configurations)) configurations = [configurations];
      return configurations.map((params) => {
        return [extension2].concat(
          Object.keys(params).map((k) => {
            let values = params[k];
            if (!Array.isArray(values)) values = [values];
            return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
          })
        ).join("; ");
      }).join(", ");
    }).join(", ");
  }
  extension = { format, parse };
  return extension;
}
var websocket;
var hasRequiredWebsocket;
function requireWebsocket() {
  if (hasRequiredWebsocket) return websocket;
  hasRequiredWebsocket = 1;
  const EventEmitter = require$$0$6;
  const https = require$$1$3;
  const http = require$$2;
  const net = require$$4;
  const tls2 = require$$4$1;
  const { randomBytes, createHash } = require$$1$2;
  const { Duplex, Readable } = require$$0$7;
  const { URL: URL2 } = require$$7;
  const PerMessageDeflate = requirePermessageDeflate();
  const Receiver = requireReceiver();
  const Sender = requireSender();
  const { isBlob } = requireValidation();
  const {
    BINARY_TYPES,
    CLOSE_TIMEOUT,
    EMPTY_BUFFER,
    GUID,
    kForOnEventAttribute,
    kListener,
    kStatusCode,
    kWebSocket,
    NOOP
  } = requireConstants$3();
  const {
    EventTarget: { addEventListener, removeEventListener }
  } = requireEventTarget();
  const { format, parse } = requireExtension();
  const { toBuffer } = requireBufferUtil();
  const kAborted = Symbol("kAborted");
  const protocolVersions = [8, 13];
  const readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
  const subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
  class WebSocket2 extends EventEmitter {
    /**
     * Create a new `WebSocket`.
     *
     * @param {(String|URL)} address The URL to which to connect
     * @param {(String|String[])} [protocols] The subprotocols
     * @param {Object} [options] Connection options
     */
    constructor(address, protocols, options) {
      super();
      this._binaryType = BINARY_TYPES[0];
      this._closeCode = 1006;
      this._closeFrameReceived = false;
      this._closeFrameSent = false;
      this._closeMessage = EMPTY_BUFFER;
      this._closeTimer = null;
      this._errorEmitted = false;
      this._extensions = {};
      this._paused = false;
      this._protocol = "";
      this._readyState = WebSocket2.CONNECTING;
      this._receiver = null;
      this._sender = null;
      this._socket = null;
      if (address !== null) {
        this._bufferedAmount = 0;
        this._isServer = false;
        this._redirects = 0;
        if (protocols === void 0) {
          protocols = [];
        } else if (!Array.isArray(protocols)) {
          if (typeof protocols === "object" && protocols !== null) {
            options = protocols;
            protocols = [];
          } else {
            protocols = [protocols];
          }
        }
        initAsClient(this, address, protocols, options);
      } else {
        this._autoPong = options.autoPong;
        this._closeTimeout = options.closeTimeout;
        this._isServer = true;
      }
    }
    /**
     * For historical reasons, the custom "nodebuffer" type is used by the default
     * instead of "blob".
     *
     * @type {String}
     */
    get binaryType() {
      return this._binaryType;
    }
    set binaryType(type) {
      if (!BINARY_TYPES.includes(type)) return;
      this._binaryType = type;
      if (this._receiver) this._receiver._binaryType = type;
    }
    /**
     * @type {Number}
     */
    get bufferedAmount() {
      if (!this._socket) return this._bufferedAmount;
      return this._socket._writableState.length + this._sender._bufferedBytes;
    }
    /**
     * @type {String}
     */
    get extensions() {
      return Object.keys(this._extensions).join();
    }
    /**
     * @type {Boolean}
     */
    get isPaused() {
      return this._paused;
    }
    /**
     * @type {Function}
     */
    /* istanbul ignore next */
    get onclose() {
      return null;
    }
    /**
     * @type {Function}
     */
    /* istanbul ignore next */
    get onerror() {
      return null;
    }
    /**
     * @type {Function}
     */
    /* istanbul ignore next */
    get onopen() {
      return null;
    }
    /**
     * @type {Function}
     */
    /* istanbul ignore next */
    get onmessage() {
      return null;
    }
    /**
     * @type {String}
     */
    get protocol() {
      return this._protocol;
    }
    /**
     * @type {Number}
     */
    get readyState() {
      return this._readyState;
    }
    /**
     * @type {String}
     */
    get url() {
      return this._url;
    }
    /**
     * Set up the socket and the internal resources.
     *
     * @param {Duplex} socket The network socket between the server and client
     * @param {Buffer} head The first packet of the upgraded stream
     * @param {Object} options Options object
     * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
     *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
     *     multiple times in the same tick
     * @param {Function} [options.generateMask] The function used to generate the
     *     masking key
     * @param {Number} [options.maxBufferedChunks=0] The maximum number of
     *     buffered data chunks
     * @param {Number} [options.maxFragments=0] The maximum number of message
     *     fragments
     * @param {Number} [options.maxPayload=0] The maximum allowed message size
     * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
     *     not to skip UTF-8 validation for text and close messages
     * @private
     */
    setSocket(socket, head, options) {
      const receiver2 = new Receiver({
        allowSynchronousEvents: options.allowSynchronousEvents,
        binaryType: this.binaryType,
        extensions: this._extensions,
        isServer: this._isServer,
        maxBufferedChunks: options.maxBufferedChunks,
        maxFragments: options.maxFragments,
        maxPayload: options.maxPayload,
        skipUTF8Validation: options.skipUTF8Validation
      });
      const sender2 = new Sender(socket, this._extensions, options.generateMask);
      this._receiver = receiver2;
      this._sender = sender2;
      this._socket = socket;
      receiver2[kWebSocket] = this;
      sender2[kWebSocket] = this;
      socket[kWebSocket] = this;
      receiver2.on("conclude", receiverOnConclude);
      receiver2.on("drain", receiverOnDrain);
      receiver2.on("error", receiverOnError);
      receiver2.on("message", receiverOnMessage);
      receiver2.on("ping", receiverOnPing);
      receiver2.on("pong", receiverOnPong);
      sender2.onerror = senderOnError;
      if (socket.setTimeout) socket.setTimeout(0);
      if (socket.setNoDelay) socket.setNoDelay();
      if (head.length > 0) socket.unshift(head);
      socket.on("close", socketOnClose);
      socket.on("data", socketOnData);
      socket.on("end", socketOnEnd);
      socket.on("error", socketOnError);
      this._readyState = WebSocket2.OPEN;
      this.emit("open");
    }
    /**
     * Emit the `'close'` event.
     *
     * @private
     */
    emitClose() {
      if (!this._socket) {
        this._readyState = WebSocket2.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
        return;
      }
      if (this._extensions[PerMessageDeflate.extensionName]) {
        this._extensions[PerMessageDeflate.extensionName].cleanup();
      }
      this._receiver.removeAllListeners();
      this._readyState = WebSocket2.CLOSED;
      this.emit("close", this._closeCode, this._closeMessage);
    }
    /**
     * Start a closing handshake.
     *
     *          +----------+   +-----------+   +----------+
     *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
     *    |     +----------+   +-----------+   +----------+     |
     *          +----------+   +-----------+         |
     * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
     *          +----------+   +-----------+   |
     *    |           |                        |   +---+        |
     *                +------------------------+-->|fin| - - - -
     *    |         +---+                      |   +---+
     *     - - - - -|fin|<---------------------+
     *              +---+
     *
     * @param {Number} [code] Status code explaining why the connection is closing
     * @param {(String|Buffer)} [data] The reason why the connection is
     *     closing
     * @public
     */
    close(code, data) {
      if (this.readyState === WebSocket2.CLOSED) return;
      if (this.readyState === WebSocket2.CONNECTING) {
        const msg = "WebSocket was closed before the connection was established";
        abortHandshake(this, this._req, msg);
        return;
      }
      if (this.readyState === WebSocket2.CLOSING) {
        if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
          this._socket.end();
        }
        return;
      }
      this._readyState = WebSocket2.CLOSING;
      this._sender.close(code, data, !this._isServer, (err) => {
        if (err) return;
        this._closeFrameSent = true;
        if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
          this._socket.end();
        }
      });
      setCloseTimer(this);
    }
    /**
     * Pause the socket.
     *
     * @public
     */
    pause() {
      if (this.readyState === WebSocket2.CONNECTING || this.readyState === WebSocket2.CLOSED) {
        return;
      }
      this._paused = true;
      this._socket.pause();
    }
    /**
     * Send a ping.
     *
     * @param {*} [data] The data to send
     * @param {Boolean} [mask] Indicates whether or not to mask `data`
     * @param {Function} [cb] Callback which is executed when the ping is sent
     * @public
     */
    ping(data, mask, cb) {
      if (this.readyState === WebSocket2.CONNECTING) {
        throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
      }
      if (typeof data === "function") {
        cb = data;
        data = mask = void 0;
      } else if (typeof mask === "function") {
        cb = mask;
        mask = void 0;
      }
      if (typeof data === "number") data = data.toString();
      if (this.readyState !== WebSocket2.OPEN) {
        sendAfterClose(this, data, cb);
        return;
      }
      if (mask === void 0) mask = !this._isServer;
      this._sender.ping(data || EMPTY_BUFFER, mask, cb);
    }
    /**
     * Send a pong.
     *
     * @param {*} [data] The data to send
     * @param {Boolean} [mask] Indicates whether or not to mask `data`
     * @param {Function} [cb] Callback which is executed when the pong is sent
     * @public
     */
    pong(data, mask, cb) {
      if (this.readyState === WebSocket2.CONNECTING) {
        throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
      }
      if (typeof data === "function") {
        cb = data;
        data = mask = void 0;
      } else if (typeof mask === "function") {
        cb = mask;
        mask = void 0;
      }
      if (typeof data === "number") data = data.toString();
      if (this.readyState !== WebSocket2.OPEN) {
        sendAfterClose(this, data, cb);
        return;
      }
      if (mask === void 0) mask = !this._isServer;
      this._sender.pong(data || EMPTY_BUFFER, mask, cb);
    }
    /**
     * Resume the socket.
     *
     * @public
     */
    resume() {
      if (this.readyState === WebSocket2.CONNECTING || this.readyState === WebSocket2.CLOSED) {
        return;
      }
      this._paused = false;
      if (!this._receiver._writableState.needDrain) this._socket.resume();
    }
    /**
     * Send a data message.
     *
     * @param {*} data The message to send
     * @param {Object} [options] Options object
     * @param {Boolean} [options.binary] Specifies whether `data` is binary or
     *     text
     * @param {Boolean} [options.compress] Specifies whether or not to compress
     *     `data`
     * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
     *     last one
     * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
     * @param {Function} [cb] Callback which is executed when data is written out
     * @public
     */
    send(data, options, cb) {
      if (this.readyState === WebSocket2.CONNECTING) {
        throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
      }
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      if (typeof data === "number") data = data.toString();
      if (this.readyState !== WebSocket2.OPEN) {
        sendAfterClose(this, data, cb);
        return;
      }
      const opts = {
        binary: typeof data !== "string",
        mask: !this._isServer,
        compress: true,
        fin: true,
        ...options
      };
      if (!this._extensions[PerMessageDeflate.extensionName]) {
        opts.compress = false;
      }
      this._sender.send(data || EMPTY_BUFFER, opts, cb);
    }
    /**
     * Forcibly close the connection.
     *
     * @public
     */
    terminate() {
      if (this.readyState === WebSocket2.CLOSED) return;
      if (this.readyState === WebSocket2.CONNECTING) {
        const msg = "WebSocket was closed before the connection was established";
        abortHandshake(this, this._req, msg);
        return;
      }
      if (this._socket) {
        this._readyState = WebSocket2.CLOSING;
        this._socket.destroy();
      }
    }
  }
  Object.defineProperty(WebSocket2, "CONNECTING", {
    enumerable: true,
    value: readyStates.indexOf("CONNECTING")
  });
  Object.defineProperty(WebSocket2.prototype, "CONNECTING", {
    enumerable: true,
    value: readyStates.indexOf("CONNECTING")
  });
  Object.defineProperty(WebSocket2, "OPEN", {
    enumerable: true,
    value: readyStates.indexOf("OPEN")
  });
  Object.defineProperty(WebSocket2.prototype, "OPEN", {
    enumerable: true,
    value: readyStates.indexOf("OPEN")
  });
  Object.defineProperty(WebSocket2, "CLOSING", {
    enumerable: true,
    value: readyStates.indexOf("CLOSING")
  });
  Object.defineProperty(WebSocket2.prototype, "CLOSING", {
    enumerable: true,
    value: readyStates.indexOf("CLOSING")
  });
  Object.defineProperty(WebSocket2, "CLOSED", {
    enumerable: true,
    value: readyStates.indexOf("CLOSED")
  });
  Object.defineProperty(WebSocket2.prototype, "CLOSED", {
    enumerable: true,
    value: readyStates.indexOf("CLOSED")
  });
  [
    "binaryType",
    "bufferedAmount",
    "extensions",
    "isPaused",
    "protocol",
    "readyState",
    "url"
  ].forEach((property) => {
    Object.defineProperty(WebSocket2.prototype, property, { enumerable: true });
  });
  ["open", "error", "close", "message"].forEach((method) => {
    Object.defineProperty(WebSocket2.prototype, `on${method}`, {
      enumerable: true,
      get() {
        for (const listener of this.listeners(method)) {
          if (listener[kForOnEventAttribute]) return listener[kListener];
        }
        return null;
      },
      set(handler) {
        for (const listener of this.listeners(method)) {
          if (listener[kForOnEventAttribute]) {
            this.removeListener(method, listener);
            break;
          }
        }
        if (typeof handler !== "function") return;
        this.addEventListener(method, handler, {
          [kForOnEventAttribute]: true
        });
      }
    });
  });
  WebSocket2.prototype.addEventListener = addEventListener;
  WebSocket2.prototype.removeEventListener = removeEventListener;
  websocket = WebSocket2;
  function initAsClient(websocket2, address, protocols, options) {
    const opts = {
      allowSynchronousEvents: true,
      autoPong: true,
      closeTimeout: CLOSE_TIMEOUT,
      protocolVersion: protocolVersions[1],
      maxBufferedChunks: 1024 * 1024,
      maxFragments: 128 * 1024,
      maxPayload: 100 * 1024 * 1024,
      skipUTF8Validation: false,
      perMessageDeflate: true,
      followRedirects: false,
      maxRedirects: 10,
      ...options,
      socketPath: void 0,
      hostname: void 0,
      protocol: void 0,
      timeout: void 0,
      method: "GET",
      host: void 0,
      path: void 0,
      port: void 0
    };
    websocket2._autoPong = opts.autoPong;
    websocket2._closeTimeout = opts.closeTimeout;
    if (!protocolVersions.includes(opts.protocolVersion)) {
      throw new RangeError(
        `Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`
      );
    }
    let parsedUrl;
    if (address instanceof URL2) {
      parsedUrl = address;
    } else {
      try {
        parsedUrl = new URL2(address);
      } catch {
        throw new SyntaxError(`Invalid URL: ${address}`);
      }
    }
    if (parsedUrl.protocol === "http:") {
      parsedUrl.protocol = "ws:";
    } else if (parsedUrl.protocol === "https:") {
      parsedUrl.protocol = "wss:";
    }
    websocket2._url = parsedUrl.href;
    const isSecure = parsedUrl.protocol === "wss:";
    const isIpcUrl = parsedUrl.protocol === "ws+unix:";
    let invalidUrlMessage;
    if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
      invalidUrlMessage = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
    } else if (isIpcUrl && !parsedUrl.pathname) {
      invalidUrlMessage = "The URL's pathname is empty";
    } else if (parsedUrl.hash) {
      invalidUrlMessage = "The URL contains a fragment identifier";
    }
    if (invalidUrlMessage) {
      const err = new SyntaxError(invalidUrlMessage);
      if (websocket2._redirects === 0) {
        throw err;
      } else {
        emitErrorAndClose(websocket2, err);
        return;
      }
    }
    const defaultPort = isSecure ? 443 : 80;
    const key = randomBytes(16).toString("base64");
    const request = isSecure ? https.request : http.request;
    const protocolSet = /* @__PURE__ */ new Set();
    let perMessageDeflate;
    opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
    opts.defaultPort = opts.defaultPort || defaultPort;
    opts.port = parsedUrl.port || defaultPort;
    opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
    opts.headers = {
      ...opts.headers,
      "Sec-WebSocket-Version": opts.protocolVersion,
      "Sec-WebSocket-Key": key,
      Connection: "Upgrade",
      Upgrade: "websocket"
    };
    opts.path = parsedUrl.pathname + parsedUrl.search;
    opts.timeout = opts.handshakeTimeout;
    if (opts.perMessageDeflate) {
      perMessageDeflate = new PerMessageDeflate({
        ...opts.perMessageDeflate,
        isServer: false,
        maxPayload: opts.maxPayload
      });
      opts.headers["Sec-WebSocket-Extensions"] = format({
        [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
      });
    }
    if (protocols.length) {
      for (const protocol of protocols) {
        if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
          throw new SyntaxError(
            "An invalid or duplicated subprotocol was specified"
          );
        }
        protocolSet.add(protocol);
      }
      opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
    }
    if (opts.origin) {
      if (opts.protocolVersion < 13) {
        opts.headers["Sec-WebSocket-Origin"] = opts.origin;
      } else {
        opts.headers.Origin = opts.origin;
      }
    }
    if (parsedUrl.username || parsedUrl.password) {
      opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
    }
    if (isIpcUrl) {
      const parts = opts.path.split(":");
      opts.socketPath = parts[0];
      opts.path = parts[1];
    }
    let req;
    if (opts.followRedirects) {
      if (websocket2._redirects === 0) {
        websocket2._originalIpc = isIpcUrl;
        websocket2._originalSecure = isSecure;
        websocket2._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
        const headers = options && options.headers;
        options = { ...options, headers: {} };
        if (headers) {
          for (const [key2, value] of Object.entries(headers)) {
            options.headers[key2.toLowerCase()] = value;
          }
        }
      } else if (websocket2.listenerCount("redirect") === 0) {
        const isSameHost = isIpcUrl ? websocket2._originalIpc ? opts.socketPath === websocket2._originalHostOrSocketPath : false : websocket2._originalIpc ? false : parsedUrl.host === websocket2._originalHostOrSocketPath;
        if (!isSameHost || websocket2._originalSecure && !isSecure) {
          delete opts.headers.authorization;
          delete opts.headers.cookie;
          if (!isSameHost) delete opts.headers.host;
          opts.auth = void 0;
        }
      }
      if (opts.auth && !options.headers.authorization) {
        options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
      }
      req = websocket2._req = request(opts);
      if (websocket2._redirects) {
        websocket2.emit("redirect", websocket2.url, req);
      }
    } else {
      req = websocket2._req = request(opts);
    }
    if (opts.timeout) {
      req.on("timeout", () => {
        abortHandshake(websocket2, req, "Opening handshake has timed out");
      });
    }
    req.on("error", (err) => {
      if (req === null || req[kAborted]) return;
      req = websocket2._req = null;
      emitErrorAndClose(websocket2, err);
    });
    req.on("response", (res) => {
      const location = res.headers.location;
      const statusCode = res.statusCode;
      if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
        if (++websocket2._redirects > opts.maxRedirects) {
          abortHandshake(websocket2, req, "Maximum redirects exceeded");
          return;
        }
        req.abort();
        let addr;
        try {
          addr = new URL2(location, address);
        } catch (e) {
          const err = new SyntaxError(`Invalid URL: ${location}`);
          emitErrorAndClose(websocket2, err);
          return;
        }
        initAsClient(websocket2, addr, protocols, options);
      } else if (!websocket2.emit("unexpected-response", req, res)) {
        abortHandshake(
          websocket2,
          req,
          `Unexpected server response: ${res.statusCode}`
        );
      }
    });
    req.on("upgrade", (res, socket, head) => {
      websocket2.emit("upgrade", res);
      if (websocket2.readyState !== WebSocket2.CONNECTING) return;
      req = websocket2._req = null;
      const upgrade = res.headers.upgrade;
      if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
        abortHandshake(websocket2, socket, "Invalid Upgrade header");
        return;
      }
      const digest = createHash("sha1").update(key + GUID).digest("base64");
      if (res.headers["sec-websocket-accept"] !== digest) {
        abortHandshake(websocket2, socket, "Invalid Sec-WebSocket-Accept header");
        return;
      }
      const serverProt = res.headers["sec-websocket-protocol"];
      let protError;
      if (serverProt !== void 0) {
        if (!protocolSet.size) {
          protError = "Server sent a subprotocol but none was requested";
        } else if (!protocolSet.has(serverProt)) {
          protError = "Server sent an invalid subprotocol";
        }
      } else if (protocolSet.size) {
        protError = "Server sent no subprotocol";
      }
      if (protError) {
        abortHandshake(websocket2, socket, protError);
        return;
      }
      if (serverProt) websocket2._protocol = serverProt;
      const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
      if (secWebSocketExtensions !== void 0) {
        if (!perMessageDeflate) {
          const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
          abortHandshake(websocket2, socket, message);
          return;
        }
        let extensions;
        try {
          extensions = parse(secWebSocketExtensions);
        } catch (err) {
          const message = "Invalid Sec-WebSocket-Extensions header";
          abortHandshake(websocket2, socket, message);
          return;
        }
        const extensionNames = Object.keys(extensions);
        if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate.extensionName) {
          const message = "Server indicated an extension that was not requested";
          abortHandshake(websocket2, socket, message);
          return;
        }
        try {
          perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
        } catch (err) {
          const message = "Invalid Sec-WebSocket-Extensions header";
          abortHandshake(websocket2, socket, message);
          return;
        }
        websocket2._extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
      }
      websocket2.setSocket(socket, head, {
        allowSynchronousEvents: opts.allowSynchronousEvents,
        generateMask: opts.generateMask,
        maxBufferedChunks: opts.maxBufferedChunks,
        maxFragments: opts.maxFragments,
        maxPayload: opts.maxPayload,
        skipUTF8Validation: opts.skipUTF8Validation
      });
    });
    if (opts.finishRequest) {
      opts.finishRequest(req, websocket2);
    } else {
      req.end();
    }
  }
  function emitErrorAndClose(websocket2, err) {
    websocket2._readyState = WebSocket2.CLOSING;
    websocket2._errorEmitted = true;
    websocket2.emit("error", err);
    websocket2.emitClose();
  }
  function netConnect(options) {
    options.path = options.socketPath;
    return net.connect(options);
  }
  function tlsConnect(options) {
    options.path = void 0;
    if (!options.servername && options.servername !== "") {
      options.servername = net.isIP(options.host) ? "" : options.host;
    }
    return tls2.connect(options);
  }
  function abortHandshake(websocket2, stream2, message) {
    websocket2._readyState = WebSocket2.CLOSING;
    const err = new Error(message);
    Error.captureStackTrace(err, abortHandshake);
    if (stream2.setHeader) {
      stream2[kAborted] = true;
      stream2.abort();
      if (stream2.socket && !stream2.socket.destroyed) {
        stream2.socket.destroy();
      }
      process.nextTick(emitErrorAndClose, websocket2, err);
    } else {
      stream2.destroy(err);
      stream2.once("error", websocket2.emit.bind(websocket2, "error"));
      stream2.once("close", websocket2.emitClose.bind(websocket2));
    }
  }
  function sendAfterClose(websocket2, data, cb) {
    if (data) {
      const length = isBlob(data) ? data.size : toBuffer(data).length;
      if (websocket2._socket) websocket2._sender._bufferedBytes += length;
      else websocket2._bufferedAmount += length;
    }
    if (cb) {
      const err = new Error(
        `WebSocket is not open: readyState ${websocket2.readyState} (${readyStates[websocket2.readyState]})`
      );
      process.nextTick(cb, err);
    }
  }
  function receiverOnConclude(code, reason) {
    const websocket2 = this[kWebSocket];
    websocket2._closeFrameReceived = true;
    websocket2._closeMessage = reason;
    websocket2._closeCode = code;
    if (websocket2._socket[kWebSocket] === void 0) return;
    websocket2._socket.removeListener("data", socketOnData);
    process.nextTick(resume, websocket2._socket);
    if (code === 1005) websocket2.close();
    else websocket2.close(code, reason);
  }
  function receiverOnDrain() {
    const websocket2 = this[kWebSocket];
    if (!websocket2.isPaused) websocket2._socket.resume();
  }
  function receiverOnError(err) {
    const websocket2 = this[kWebSocket];
    if (websocket2._socket[kWebSocket] !== void 0) {
      websocket2._socket.removeListener("data", socketOnData);
      process.nextTick(resume, websocket2._socket);
      websocket2.close(err[kStatusCode]);
    }
    if (!websocket2._errorEmitted) {
      websocket2._errorEmitted = true;
      websocket2.emit("error", err);
    }
  }
  function receiverOnFinish() {
    this[kWebSocket].emitClose();
  }
  function receiverOnMessage(data, isBinary) {
    this[kWebSocket].emit("message", data, isBinary);
  }
  function receiverOnPing(data) {
    const websocket2 = this[kWebSocket];
    if (websocket2._autoPong) websocket2.pong(data, !this._isServer, NOOP);
    websocket2.emit("ping", data);
  }
  function receiverOnPong(data) {
    this[kWebSocket].emit("pong", data);
  }
  function resume(stream2) {
    stream2.resume();
  }
  function senderOnError(err) {
    const websocket2 = this[kWebSocket];
    if (websocket2.readyState === WebSocket2.CLOSED) return;
    if (websocket2.readyState === WebSocket2.OPEN) {
      websocket2._readyState = WebSocket2.CLOSING;
      setCloseTimer(websocket2);
    }
    this._socket.end();
    if (!websocket2._errorEmitted) {
      websocket2._errorEmitted = true;
      websocket2.emit("error", err);
    }
  }
  function setCloseTimer(websocket2) {
    websocket2._closeTimer = setTimeout(
      websocket2._socket.destroy.bind(websocket2._socket),
      websocket2._closeTimeout
    );
  }
  function socketOnClose() {
    const websocket2 = this[kWebSocket];
    this.removeListener("close", socketOnClose);
    this.removeListener("data", socketOnData);
    this.removeListener("end", socketOnEnd);
    websocket2._readyState = WebSocket2.CLOSING;
    if (!this._readableState.endEmitted && !websocket2._closeFrameReceived && !websocket2._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
      const chunk = this.read(this._readableState.length);
      websocket2._receiver.write(chunk);
    }
    websocket2._receiver.end();
    this[kWebSocket] = void 0;
    clearTimeout(websocket2._closeTimer);
    if (websocket2._receiver._writableState.finished || websocket2._receiver._writableState.errorEmitted) {
      websocket2.emitClose();
    } else {
      websocket2._receiver.on("error", receiverOnFinish);
      websocket2._receiver.on("finish", receiverOnFinish);
    }
  }
  function socketOnData(chunk) {
    if (!this[kWebSocket]._receiver.write(chunk)) {
      this.pause();
    }
  }
  function socketOnEnd() {
    const websocket2 = this[kWebSocket];
    websocket2._readyState = WebSocket2.CLOSING;
    websocket2._receiver.end();
    this.end();
  }
  function socketOnError() {
    const websocket2 = this[kWebSocket];
    this.removeListener("error", socketOnError);
    this.on("error", NOOP);
    if (websocket2) {
      websocket2._readyState = WebSocket2.CLOSING;
      this.destroy();
    }
  }
  return websocket;
}
var stream;
var hasRequiredStream;
function requireStream() {
  if (hasRequiredStream) return stream;
  hasRequiredStream = 1;
  requireWebsocket();
  const { Duplex } = require$$0$7;
  function emitClose(stream2) {
    stream2.emit("close");
  }
  function duplexOnEnd() {
    if (!this.destroyed && this._writableState.finished) {
      this.destroy();
    }
  }
  function duplexOnError(err) {
    this.removeListener("error", duplexOnError);
    this.destroy();
    if (this.listenerCount("error") === 0) {
      this.emit("error", err);
    }
  }
  function createWebSocketStream(ws2, options) {
    let terminateOnDestroy = true;
    const duplex2 = new Duplex({
      ...options,
      autoDestroy: false,
      emitClose: false,
      objectMode: false,
      writableObjectMode: false
    });
    ws2.on("message", function message(msg, isBinary) {
      const data = !isBinary && duplex2._readableState.objectMode ? msg.toString() : msg;
      if (!duplex2.push(data)) ws2.pause();
    });
    ws2.once("error", function error(err) {
      if (duplex2.destroyed) return;
      terminateOnDestroy = false;
      duplex2.destroy(err);
    });
    ws2.once("close", function close() {
      if (duplex2.destroyed) return;
      duplex2.push(null);
    });
    duplex2._destroy = function(err, callback) {
      if (ws2.readyState === ws2.CLOSED) {
        callback(err);
        process.nextTick(emitClose, duplex2);
        return;
      }
      let called = false;
      ws2.once("error", function error(err2) {
        called = true;
        callback(err2);
      });
      ws2.once("close", function close() {
        if (!called) callback(err);
        process.nextTick(emitClose, duplex2);
      });
      if (terminateOnDestroy) ws2.terminate();
    };
    duplex2._final = function(callback) {
      if (ws2.readyState === ws2.CONNECTING) {
        ws2.once("open", function open() {
          duplex2._final(callback);
        });
        return;
      }
      if (ws2._socket === null) return;
      if (ws2._socket._writableState.finished) {
        callback();
        if (duplex2._readableState.endEmitted) duplex2.destroy();
      } else {
        ws2._socket.once("finish", function finish() {
          callback();
        });
        ws2.close();
      }
    };
    duplex2._read = function() {
      if (ws2.isPaused) ws2.resume();
    };
    duplex2._write = function(chunk, encoding, callback) {
      if (ws2.readyState === ws2.CONNECTING) {
        ws2.once("open", function open() {
          duplex2._write(chunk, encoding, callback);
        });
        return;
      }
      ws2.send(chunk, callback);
    };
    duplex2.on("end", duplexOnEnd);
    duplex2.on("error", duplexOnError);
    return duplex2;
  }
  stream = createWebSocketStream;
  return stream;
}
var subprotocol;
var hasRequiredSubprotocol;
function requireSubprotocol() {
  if (hasRequiredSubprotocol) return subprotocol;
  hasRequiredSubprotocol = 1;
  const { tokenChars } = requireValidation();
  function parse(header) {
    const protocols = /* @__PURE__ */ new Set();
    let start = -1;
    let end = -1;
    let i = 0;
    for (i; i < header.length; i++) {
      const code = header.charCodeAt(i);
      if (end === -1 && tokenChars[code] === 1) {
        if (start === -1) start = i;
      } else if (i !== 0 && (code === 32 || code === 9)) {
        if (end === -1 && start !== -1) end = i;
      } else if (code === 44) {
        if (start === -1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
        if (end === -1) end = i;
        const protocol2 = header.slice(start, end);
        if (protocols.has(protocol2)) {
          throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
        }
        protocols.add(protocol2);
        start = end = -1;
      } else {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
    }
    if (start === -1 || end !== -1) {
      throw new SyntaxError("Unexpected end of input");
    }
    const protocol = header.slice(start, i);
    if (protocols.has(protocol)) {
      throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
    }
    protocols.add(protocol);
    return protocols;
  }
  subprotocol = { parse };
  return subprotocol;
}
var websocketServer;
var hasRequiredWebsocketServer;
function requireWebsocketServer() {
  if (hasRequiredWebsocketServer) return websocketServer;
  hasRequiredWebsocketServer = 1;
  const EventEmitter = require$$0$6;
  const http = require$$2;
  const { Duplex } = require$$0$7;
  const { createHash } = require$$1$2;
  const extension2 = requireExtension();
  const PerMessageDeflate = requirePermessageDeflate();
  const subprotocol2 = requireSubprotocol();
  const WebSocket2 = requireWebsocket();
  const { CLOSE_TIMEOUT, GUID, kWebSocket } = requireConstants$3();
  const keyRegex = /^[+/0-9A-Za-z]{22}==$/;
  const RUNNING = 0;
  const CLOSING = 1;
  const CLOSED = 2;
  class WebSocketServer extends EventEmitter {
    /**
     * Create a `WebSocketServer` instance.
     *
     * @param {Object} options Configuration options
     * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
     *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
     *     multiple times in the same tick
     * @param {Boolean} [options.autoPong=true] Specifies whether or not to
     *     automatically send a pong in response to a ping
     * @param {Number} [options.backlog=511] The maximum length of the queue of
     *     pending connections
     * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
     *     track clients
     * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
     *     wait for the closing handshake to finish after `websocket.close()` is
     *     called
     * @param {Function} [options.handleProtocols] A hook to handle protocols
     * @param {String} [options.host] The hostname where to bind the server
     * @param {Number} [options.maxBufferedChunks=1048576] The maximum number of
     *     buffered data chunks
     * @param {Number} [options.maxFragments=131072] The maximum number of message
     *     fragments
     * @param {Number} [options.maxPayload=104857600] The maximum allowed message
     *     size
     * @param {Boolean} [options.noServer=false] Enable no server mode
     * @param {String} [options.path] Accept only connections matching this path
     * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
     *     permessage-deflate
     * @param {Number} [options.port] The port where to bind the server
     * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
     *     server to use
     * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
     *     not to skip UTF-8 validation for text and close messages
     * @param {Function} [options.verifyClient] A hook to reject connections
     * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
     *     class to use. It must be the `WebSocket` class or class that extends it
     * @param {Function} [callback] A listener for the `listening` event
     */
    constructor(options, callback) {
      super();
      options = {
        allowSynchronousEvents: true,
        autoPong: true,
        maxBufferedChunks: 1024 * 1024,
        maxFragments: 128 * 1024,
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: false,
        handleProtocols: null,
        clientTracking: true,
        closeTimeout: CLOSE_TIMEOUT,
        verifyClient: null,
        noServer: false,
        backlog: null,
        // use default (511 as implemented in net.js)
        server: null,
        host: null,
        path: null,
        port: null,
        WebSocket: WebSocket2,
        ...options
      };
      if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
        throw new TypeError(
          'One and only one of the "port", "server", or "noServer" options must be specified'
        );
      }
      if (options.port != null) {
        this._server = http.createServer((req, res) => {
          const body = http.STATUS_CODES[426];
          res.writeHead(426, {
            "Content-Length": body.length,
            "Content-Type": "text/plain"
          });
          res.end(body);
        });
        this._server.listen(
          options.port,
          options.host,
          options.backlog,
          callback
        );
      } else if (options.server) {
        this._server = options.server;
      }
      if (this._server) {
        const emitConnection = this.emit.bind(this, "connection");
        this._removeListeners = addListeners(this._server, {
          listening: this.emit.bind(this, "listening"),
          error: this.emit.bind(this, "error"),
          upgrade: (req, socket, head) => {
            this.handleUpgrade(req, socket, head, emitConnection);
          }
        });
      }
      if (options.perMessageDeflate === true) options.perMessageDeflate = {};
      if (options.clientTracking) {
        this.clients = /* @__PURE__ */ new Set();
        this._shouldEmitClose = false;
      }
      this.options = options;
      this._state = RUNNING;
    }
    /**
     * Returns the bound address, the address family name, and port of the server
     * as reported by the operating system if listening on an IP socket.
     * If the server is listening on a pipe or UNIX domain socket, the name is
     * returned as a string.
     *
     * @return {(Object|String|null)} The address of the server
     * @public
     */
    address() {
      if (this.options.noServer) {
        throw new Error('The server is operating in "noServer" mode');
      }
      if (!this._server) return null;
      return this._server.address();
    }
    /**
     * Stop the server from accepting new connections and emit the `'close'` event
     * when all existing connections are closed.
     *
     * @param {Function} [cb] A one-time listener for the `'close'` event
     * @public
     */
    close(cb) {
      if (this._state === CLOSED) {
        if (cb) {
          this.once("close", () => {
            cb(new Error("The server is not running"));
          });
        }
        process.nextTick(emitClose, this);
        return;
      }
      if (cb) this.once("close", cb);
      if (this._state === CLOSING) return;
      this._state = CLOSING;
      if (this.options.noServer || this.options.server) {
        if (this._server) {
          this._removeListeners();
          this._removeListeners = this._server = null;
        }
        if (this.clients) {
          if (!this.clients.size) {
            process.nextTick(emitClose, this);
          } else {
            this._shouldEmitClose = true;
          }
        } else {
          process.nextTick(emitClose, this);
        }
      } else {
        const server = this._server;
        this._removeListeners();
        this._removeListeners = this._server = null;
        server.close(() => {
          emitClose(this);
        });
      }
    }
    /**
     * See if a given request should be handled by this server instance.
     *
     * @param {http.IncomingMessage} req Request object to inspect
     * @return {Boolean} `true` if the request is valid, else `false`
     * @public
     */
    shouldHandle(req) {
      if (this.options.path) {
        const index = req.url.indexOf("?");
        const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
        if (pathname !== this.options.path) return false;
      }
      return true;
    }
    /**
     * Handle a HTTP Upgrade request.
     *
     * @param {http.IncomingMessage} req The request object
     * @param {Duplex} socket The network socket between the server and client
     * @param {Buffer} head The first packet of the upgraded stream
     * @param {Function} cb Callback
     * @public
     */
    handleUpgrade(req, socket, head, cb) {
      socket.on("error", socketOnError);
      const key = req.headers["sec-websocket-key"];
      const upgrade = req.headers.upgrade;
      const version2 = +req.headers["sec-websocket-version"];
      if (req.method !== "GET") {
        const message = "Invalid HTTP method";
        abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
        return;
      }
      if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
        const message = "Invalid Upgrade header";
        abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
        return;
      }
      if (key === void 0 || !keyRegex.test(key)) {
        const message = "Missing or invalid Sec-WebSocket-Key header";
        abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
        return;
      }
      if (version2 !== 13 && version2 !== 8) {
        const message = "Missing or invalid Sec-WebSocket-Version header";
        abortHandshakeOrEmitwsClientError(this, req, socket, 400, message, {
          "Sec-WebSocket-Version": "13, 8"
        });
        return;
      }
      if (!this.shouldHandle(req)) {
        abortHandshake(socket, 400);
        return;
      }
      const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
      let protocols = /* @__PURE__ */ new Set();
      if (secWebSocketProtocol !== void 0) {
        try {
          protocols = subprotocol2.parse(secWebSocketProtocol);
        } catch (err) {
          const message = "Invalid Sec-WebSocket-Protocol header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
      }
      const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
      const extensions = {};
      if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
        const perMessageDeflate = new PerMessageDeflate({
          ...this.options.perMessageDeflate,
          isServer: true,
          maxPayload: this.options.maxPayload
        });
        try {
          const offers = extension2.parse(secWebSocketExtensions);
          if (offers[PerMessageDeflate.extensionName]) {
            perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
            extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
          }
        } catch (err) {
          const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
      }
      if (this.options.verifyClient) {
        const info = {
          origin: req.headers[`${version2 === 8 ? "sec-websocket-origin" : "origin"}`],
          secure: !!(req.socket.authorized || req.socket.encrypted),
          req
        };
        if (this.options.verifyClient.length === 2) {
          this.options.verifyClient(info, (verified, code, message, headers) => {
            if (!verified) {
              return abortHandshake(socket, code || 401, message, headers);
            }
            this.completeUpgrade(
              extensions,
              key,
              protocols,
              req,
              socket,
              head,
              cb
            );
          });
          return;
        }
        if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
      }
      this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
    }
    /**
     * Upgrade the connection to WebSocket.
     *
     * @param {Object} extensions The accepted extensions
     * @param {String} key The value of the `Sec-WebSocket-Key` header
     * @param {Set} protocols The subprotocols
     * @param {http.IncomingMessage} req The request object
     * @param {Duplex} socket The network socket between the server and client
     * @param {Buffer} head The first packet of the upgraded stream
     * @param {Function} cb Callback
     * @throws {Error} If called more than once with the same socket
     * @private
     */
    completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
      if (!socket.readable || !socket.writable) return socket.destroy();
      if (socket[kWebSocket]) {
        throw new Error(
          "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
        );
      }
      if (this._state > RUNNING) return abortHandshake(socket, 503);
      const digest = createHash("sha1").update(key + GUID).digest("base64");
      const headers = [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${digest}`
      ];
      const ws2 = new this.options.WebSocket(null, void 0, this.options);
      if (protocols.size) {
        const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
        if (protocol) {
          headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
          ws2._protocol = protocol;
        }
      }
      if (extensions[PerMessageDeflate.extensionName]) {
        const params = extensions[PerMessageDeflate.extensionName].params;
        const value = extension2.format({
          [PerMessageDeflate.extensionName]: [params]
        });
        headers.push(`Sec-WebSocket-Extensions: ${value}`);
        ws2._extensions = extensions;
      }
      this.emit("headers", headers, req);
      socket.write(headers.concat("\r\n").join("\r\n"));
      socket.removeListener("error", socketOnError);
      ws2.setSocket(socket, head, {
        allowSynchronousEvents: this.options.allowSynchronousEvents,
        maxBufferedChunks: this.options.maxBufferedChunks,
        maxFragments: this.options.maxFragments,
        maxPayload: this.options.maxPayload,
        skipUTF8Validation: this.options.skipUTF8Validation
      });
      if (this.clients) {
        this.clients.add(ws2);
        ws2.on("close", () => {
          this.clients.delete(ws2);
          if (this._shouldEmitClose && !this.clients.size) {
            process.nextTick(emitClose, this);
          }
        });
      }
      cb(ws2, req);
    }
  }
  websocketServer = WebSocketServer;
  function addListeners(server, map) {
    for (const event of Object.keys(map)) server.on(event, map[event]);
    return function removeListeners() {
      for (const event of Object.keys(map)) {
        server.removeListener(event, map[event]);
      }
    };
  }
  function emitClose(server) {
    server._state = CLOSED;
    server.emit("close");
  }
  function socketOnError() {
    this.destroy();
  }
  function abortHandshake(socket, code, message, headers) {
    message = message || http.STATUS_CODES[code];
    headers = {
      Connection: "close",
      "Content-Type": "text/html",
      "Content-Length": Buffer.byteLength(message),
      ...headers
    };
    socket.once("finish", socket.destroy);
    socket.end(
      `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message
    );
  }
  function abortHandshakeOrEmitwsClientError(server, req, socket, code, message, headers) {
    if (server.listenerCount("wsClientError")) {
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
      server.emit("wsClientError", err, socket, req);
    } else {
      abortHandshake(socket, code, message, headers);
    }
  }
  return websocketServer;
}
var ws;
var hasRequiredWs$1;
function requireWs$1() {
  if (hasRequiredWs$1) return ws;
  hasRequiredWs$1 = 1;
  const createWebSocketStream = requireStream();
  const extension2 = requireExtension();
  const PerMessageDeflate = requirePermessageDeflate();
  const Receiver = requireReceiver();
  const Sender = requireSender();
  const subprotocol2 = requireSubprotocol();
  const WebSocket2 = requireWebsocket();
  const WebSocketServer = requireWebsocketServer();
  WebSocket2.createWebSocketStream = createWebSocketStream;
  WebSocket2.extension = extension2;
  WebSocket2.PerMessageDeflate = PerMessageDeflate;
  WebSocket2.Receiver = Receiver;
  WebSocket2.Sender = Sender;
  WebSocket2.Server = WebSocketServer;
  WebSocket2.subprotocol = subprotocol2;
  WebSocket2.WebSocket = WebSocket2;
  WebSocket2.WebSocketServer = WebSocketServer;
  ws = WebSocket2;
  return ws;
}
var BufferedDuplex = {};
var hasRequiredBufferedDuplex;
function requireBufferedDuplex() {
  if (hasRequiredBufferedDuplex) return BufferedDuplex;
  hasRequiredBufferedDuplex = 1;
  Object.defineProperty(BufferedDuplex, "__esModule", { value: true });
  BufferedDuplex.BufferedDuplex = void 0;
  BufferedDuplex.writev = writev;
  const readable_stream_1 = requireOurs();
  const buffer_1 = require$$0$5;
  function writev(chunks, cb) {
    const buffers = new Array(chunks.length);
    for (let i = 0; i < chunks.length; i++) {
      if (typeof chunks[i].chunk === "string") {
        buffers[i] = buffer_1.Buffer.from(chunks[i].chunk, "utf8");
      } else {
        buffers[i] = chunks[i].chunk;
      }
    }
    this._write(buffer_1.Buffer.concat(buffers), "binary", cb);
  }
  let BufferedDuplex$1 = class BufferedDuplex extends readable_stream_1.Duplex {
    constructor(opts, proxy, socket) {
      super({
        objectMode: true
      });
      __publicField(this, "socket");
      __publicField(this, "proxy");
      __publicField(this, "isSocketOpen");
      __publicField(this, "writeQueue");
      this.proxy = proxy;
      this.socket = socket;
      this.writeQueue = [];
      if (!opts.objectMode) {
        this._writev = writev.bind(this);
      }
      this.isSocketOpen = false;
      this.proxy.on("data", (chunk) => {
        if (!this.destroyed && this.readable) {
          this.push(chunk);
        }
      });
    }
    _read(size) {
      this.proxy.read(size);
    }
    _write(chunk, encoding, cb) {
      if (!this.isSocketOpen) {
        this.writeQueue.push({ chunk, encoding, cb });
      } else {
        this.writeToProxy(chunk, encoding, cb);
      }
    }
    _final(callback) {
      this.writeQueue = [];
      this.proxy.end(callback);
    }
    _destroy(err, callback) {
      this.writeQueue = [];
      this.proxy.destroy();
      callback(err);
    }
    socketReady() {
      this.emit("connect");
      this.isSocketOpen = true;
      this.processWriteQueue();
    }
    writeToProxy(chunk, encoding, cb) {
      if (this.proxy.write(chunk, encoding) === false) {
        this.proxy.once("drain", cb);
      } else {
        cb();
      }
    }
    processWriteQueue() {
      while (this.writeQueue.length > 0) {
        const { chunk, encoding, cb } = this.writeQueue.shift();
        this.writeToProxy(chunk, encoding, cb);
      }
    }
  };
  BufferedDuplex.BufferedDuplex = BufferedDuplex$1;
  return BufferedDuplex;
}
var hasRequiredWs;
function requireWs() {
  if (hasRequiredWs) return ws$1;
  hasRequiredWs = 1;
  var __importDefault = ws$1 && ws$1.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(ws$1, "__esModule", { value: true });
  ws$1.streamBuilder = ws$1.browserStreamBuilder = void 0;
  const buffer_1 = require$$0$5;
  const ws_1 = __importDefault(requireWs$1());
  const debug_1 = __importDefault(requireSrc());
  const readable_stream_1 = requireOurs();
  const is_browser_1 = __importDefault(requireIsBrowser());
  const BufferedDuplex_1 = requireBufferedDuplex();
  const debug2 = (0, debug_1.default)("mqttjs:ws");
  const WSS_OPTIONS = [
    "rejectUnauthorized",
    "ca",
    "cert",
    "key",
    "pfx",
    "passphrase"
  ];
  function buildUrl(opts, client2) {
    let url = `${opts.protocol}://${opts.hostname}:${opts.port}${opts.path}`;
    if (typeof opts.transformWsUrl === "function") {
      url = opts.transformWsUrl(url, opts, client2);
    }
    return url;
  }
  function setDefaultOpts(opts) {
    const options = opts;
    if (!opts.port) {
      if (opts.protocol === "wss") {
        options.port = 443;
      } else {
        options.port = 80;
      }
    }
    if (!opts.path) {
      options.path = "/";
    }
    if (!opts.wsOptions) {
      options.wsOptions = {};
    }
    if (!is_browser_1.default && !opts.forceNativeWebSocket && opts.protocol === "wss") {
      WSS_OPTIONS.forEach((prop) => {
        if (Object.prototype.hasOwnProperty.call(opts, prop) && !Object.prototype.hasOwnProperty.call(opts.wsOptions, prop)) {
          options.wsOptions[prop] = opts[prop];
        }
      });
    }
    return options;
  }
  function setDefaultBrowserOpts(opts) {
    const options = setDefaultOpts(opts);
    if (!options.hostname) {
      options.hostname = options.host;
    }
    if (!options.hostname) {
      if (typeof document === "undefined") {
        throw new Error("Could not determine host. Specify host manually.");
      }
      const parsed = new URL(document.URL);
      options.hostname = parsed.hostname;
      if (!options.port) {
        options.port = Number(parsed.port);
      }
    }
    if (options.objectMode === void 0) {
      options.objectMode = !(options.binary === true || options.binary === void 0);
    }
    return options;
  }
  function createWebSocket(client2, url, opts) {
    debug2("createWebSocket");
    debug2(`protocol: ${opts.protocolId} ${opts.protocolVersion}`);
    const websocketSubProtocol = opts.protocolId === "MQIsdp" && opts.protocolVersion === 3 ? "mqttv3.1" : "mqtt";
    debug2(`creating new Websocket for url: ${url} and protocol: ${websocketSubProtocol}`);
    let socket;
    if (opts.createWebsocket) {
      socket = opts.createWebsocket(url, [websocketSubProtocol], opts);
    } else {
      socket = new ws_1.default(url, [websocketSubProtocol], opts.wsOptions);
    }
    return socket;
  }
  function createBrowserWebSocket(client2, opts) {
    const websocketSubProtocol = opts.protocolId === "MQIsdp" && opts.protocolVersion === 3 ? "mqttv3.1" : "mqtt";
    const url = buildUrl(opts, client2);
    let socket;
    if (opts.createWebsocket) {
      socket = opts.createWebsocket(url, [websocketSubProtocol], opts);
    } else {
      socket = new WebSocket(url, [websocketSubProtocol]);
    }
    socket.binaryType = "arraybuffer";
    return socket;
  }
  const streamBuilder = (client2, opts) => {
    debug2("streamBuilder");
    const options = setDefaultOpts(opts);
    options.hostname = options.hostname || options.host || "localhost";
    const url = buildUrl(options, client2);
    const socket = createWebSocket(client2, url, options);
    const webSocketStream = ws_1.default.createWebSocketStream(socket, options.wsOptions);
    webSocketStream["url"] = url;
    socket.on("close", () => {
      webSocketStream.destroy();
    });
    return webSocketStream;
  };
  ws$1.streamBuilder = streamBuilder;
  const browserStreamBuilder = (client2, opts) => {
    debug2("browserStreamBuilder");
    let stream2;
    const options = setDefaultBrowserOpts(opts);
    const bufferSize = options.browserBufferSize || 1024 * 512;
    const bufferTimeout = opts.browserBufferTimeout || 1e3;
    const coerceToBuffer = !opts.objectMode;
    const socket = createBrowserWebSocket(client2, opts);
    const proxy = buildProxy(opts, socketWriteBrowser, socketEndBrowser);
    if (!opts.objectMode) {
      proxy._writev = BufferedDuplex_1.writev.bind(proxy);
    }
    proxy.on("close", () => {
      socket.close();
    });
    const eventListenerSupport = typeof socket.addEventListener !== "undefined";
    if (socket.readyState === socket.OPEN) {
      stream2 = proxy;
      stream2.socket = socket;
    } else {
      stream2 = new BufferedDuplex_1.BufferedDuplex(opts, proxy, socket);
      if (eventListenerSupport) {
        socket.addEventListener("open", onOpen);
      } else {
        socket.onopen = onOpen;
      }
    }
    if (eventListenerSupport) {
      socket.addEventListener("close", onClose);
      socket.addEventListener("error", onError);
      socket.addEventListener("message", onMessage);
    } else {
      socket.onclose = onClose;
      socket.onerror = onError;
      socket.onmessage = onMessage;
    }
    function buildProxy(pOptions, socketWrite, socketEnd) {
      const _proxy = new readable_stream_1.Transform({
        objectMode: pOptions.objectMode
      });
      _proxy._write = socketWrite;
      _proxy._flush = socketEnd;
      return _proxy;
    }
    function onOpen() {
      debug2("WebSocket onOpen");
      if (stream2 instanceof BufferedDuplex_1.BufferedDuplex) {
        stream2.socketReady();
      }
    }
    function onClose(event) {
      debug2("WebSocket onClose", event);
      stream2.end();
      stream2.destroy();
    }
    function onError(err) {
      debug2("WebSocket onError", err);
      const error = new Error("WebSocket error");
      error["event"] = err;
      stream2.destroy(error);
    }
    async function onMessage(event) {
      if (!proxy || !proxy.readable || !proxy.writable) {
        return;
      }
      let { data } = event;
      if (data instanceof ArrayBuffer)
        data = buffer_1.Buffer.from(data);
      else if (data instanceof Blob)
        data = buffer_1.Buffer.from(await new Response(data).arrayBuffer());
      else
        data = buffer_1.Buffer.from(data, "utf8");
      proxy.push(data);
    }
    function socketWriteBrowser(chunk, enc, next) {
      if (socket.bufferedAmount > bufferSize) {
        setTimeout(socketWriteBrowser, bufferTimeout, chunk, enc, next);
        return;
      }
      if (coerceToBuffer && typeof chunk === "string") {
        chunk = buffer_1.Buffer.from(chunk, "utf8");
      }
      try {
        socket.send(chunk);
      } catch (err) {
        return next(err);
      }
      next();
    }
    function socketEndBrowser(done) {
      socket.close();
      done();
    }
    return stream2;
  };
  ws$1.browserStreamBuilder = browserStreamBuilder;
  return ws$1;
}
var tcp = {};
var socks = {};
var build = {};
var socksclient = {};
var smartbuffer = {};
var utils = {};
var hasRequiredUtils;
function requireUtils() {
  if (hasRequiredUtils) return utils;
  hasRequiredUtils = 1;
  Object.defineProperty(utils, "__esModule", { value: true });
  const buffer_1 = require$$0$5;
  const ERRORS = {
    INVALID_ENCODING: "Invalid encoding provided. Please specify a valid encoding the internal Node.js Buffer supports.",
    INVALID_SMARTBUFFER_SIZE: "Invalid size provided. Size must be a valid integer greater than zero.",
    INVALID_SMARTBUFFER_BUFFER: "Invalid Buffer provided in SmartBufferOptions.",
    INVALID_SMARTBUFFER_OBJECT: "Invalid SmartBufferOptions object supplied to SmartBuffer constructor or factory methods.",
    INVALID_OFFSET: "An invalid offset value was provided.",
    INVALID_OFFSET_NON_NUMBER: "An invalid offset value was provided. A numeric value is required.",
    INVALID_LENGTH: "An invalid length value was provided.",
    INVALID_LENGTH_NON_NUMBER: "An invalid length value was provived. A numeric value is required.",
    INVALID_TARGET_OFFSET: "Target offset is beyond the bounds of the internal SmartBuffer data.",
    INVALID_TARGET_LENGTH: "Specified length value moves cursor beyong the bounds of the internal SmartBuffer data.",
    INVALID_READ_BEYOND_BOUNDS: "Attempted to read beyond the bounds of the managed data.",
    INVALID_WRITE_BEYOND_BOUNDS: "Attempted to write beyond the bounds of the managed data."
  };
  utils.ERRORS = ERRORS;
  function checkEncoding(encoding) {
    if (!buffer_1.Buffer.isEncoding(encoding)) {
      throw new Error(ERRORS.INVALID_ENCODING);
    }
  }
  utils.checkEncoding = checkEncoding;
  function isFiniteInteger(value) {
    return typeof value === "number" && isFinite(value) && isInteger(value);
  }
  utils.isFiniteInteger = isFiniteInteger;
  function checkOffsetOrLengthValue(value, offset) {
    if (typeof value === "number") {
      if (!isFiniteInteger(value) || value < 0) {
        throw new Error(offset ? ERRORS.INVALID_OFFSET : ERRORS.INVALID_LENGTH);
      }
    } else {
      throw new Error(offset ? ERRORS.INVALID_OFFSET_NON_NUMBER : ERRORS.INVALID_LENGTH_NON_NUMBER);
    }
  }
  function checkLengthValue(length) {
    checkOffsetOrLengthValue(length, false);
  }
  utils.checkLengthValue = checkLengthValue;
  function checkOffsetValue(offset) {
    checkOffsetOrLengthValue(offset, true);
  }
  utils.checkOffsetValue = checkOffsetValue;
  function checkTargetOffset(offset, buff) {
    if (offset < 0 || offset > buff.length) {
      throw new Error(ERRORS.INVALID_TARGET_OFFSET);
    }
  }
  utils.checkTargetOffset = checkTargetOffset;
  function isInteger(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
  }
  function bigIntAndBufferInt64Check(bufferMethod) {
    if (typeof BigInt === "undefined") {
      throw new Error("Platform does not support JS BigInt type.");
    }
    if (typeof buffer_1.Buffer.prototype[bufferMethod] === "undefined") {
      throw new Error(`Platform does not support Buffer.prototype.${bufferMethod}.`);
    }
  }
  utils.bigIntAndBufferInt64Check = bigIntAndBufferInt64Check;
  return utils;
}
var hasRequiredSmartbuffer;
function requireSmartbuffer() {
  if (hasRequiredSmartbuffer) return smartbuffer;
  hasRequiredSmartbuffer = 1;
  Object.defineProperty(smartbuffer, "__esModule", { value: true });
  const utils_1 = requireUtils();
  const DEFAULT_SMARTBUFFER_SIZE = 4096;
  const DEFAULT_SMARTBUFFER_ENCODING = "utf8";
  class SmartBuffer {
    /**
     * Creates a new SmartBuffer instance.
     *
     * @param options { SmartBufferOptions } The SmartBufferOptions to apply to this instance.
     */
    constructor(options) {
      this.length = 0;
      this._encoding = DEFAULT_SMARTBUFFER_ENCODING;
      this._writeOffset = 0;
      this._readOffset = 0;
      if (SmartBuffer.isSmartBufferOptions(options)) {
        if (options.encoding) {
          utils_1.checkEncoding(options.encoding);
          this._encoding = options.encoding;
        }
        if (options.size) {
          if (utils_1.isFiniteInteger(options.size) && options.size > 0) {
            this._buff = Buffer.allocUnsafe(options.size);
          } else {
            throw new Error(utils_1.ERRORS.INVALID_SMARTBUFFER_SIZE);
          }
        } else if (options.buff) {
          if (Buffer.isBuffer(options.buff)) {
            this._buff = options.buff;
            this.length = options.buff.length;
          } else {
            throw new Error(utils_1.ERRORS.INVALID_SMARTBUFFER_BUFFER);
          }
        } else {
          this._buff = Buffer.allocUnsafe(DEFAULT_SMARTBUFFER_SIZE);
        }
      } else {
        if (typeof options !== "undefined") {
          throw new Error(utils_1.ERRORS.INVALID_SMARTBUFFER_OBJECT);
        }
        this._buff = Buffer.allocUnsafe(DEFAULT_SMARTBUFFER_SIZE);
      }
    }
    /**
     * Creates a new SmartBuffer instance with the provided internal Buffer size and optional encoding.
     *
     * @param size { Number } The size of the internal Buffer.
     * @param encoding { String } The BufferEncoding to use for strings.
     *
     * @return { SmartBuffer }
     */
    static fromSize(size, encoding) {
      return new this({
        size,
        encoding
      });
    }
    /**
     * Creates a new SmartBuffer instance with the provided Buffer and optional encoding.
     *
     * @param buffer { Buffer } The Buffer to use as the internal Buffer value.
     * @param encoding { String } The BufferEncoding to use for strings.
     *
     * @return { SmartBuffer }
     */
    static fromBuffer(buff, encoding) {
      return new this({
        buff,
        encoding
      });
    }
    /**
     * Creates a new SmartBuffer instance with the provided SmartBufferOptions options.
     *
     * @param options { SmartBufferOptions } The options to use when creating the SmartBuffer instance.
     */
    static fromOptions(options) {
      return new this(options);
    }
    /**
     * Type checking function that determines if an object is a SmartBufferOptions object.
     */
    static isSmartBufferOptions(options) {
      const castOptions = options;
      return castOptions && (castOptions.encoding !== void 0 || castOptions.size !== void 0 || castOptions.buff !== void 0);
    }
    // Signed integers
    /**
     * Reads an Int8 value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */
    readInt8(offset) {
      return this._readNumberValue(Buffer.prototype.readInt8, 1, offset);
    }
    /**
     * Reads an Int16BE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */
    readInt16BE(offset) {
      return this._readNumberValue(Buffer.prototype.readInt16BE, 2, offset);
    }
    /**
     * Reads an Int16LE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */
    readInt16LE(offset) {
      return this._readNumberValue(Buffer.prototype.readInt16LE, 2, offset);
    }
    /**
     * Reads an Int32BE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */
    readInt32BE(offset) {
      return this._readNumberValue(Buffer.prototype.readInt32BE, 4, offset);
    }
    /**
     * Reads an Int32LE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */
    readInt32LE(offset) {
      return this._readNumberValue(Buffer.prototype.readInt32LE, 4, offset);
    }
    /**
     * Reads a BigInt64BE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { BigInt }
     */
    readBigInt64BE(offset) {
      utils_1.bigIntAndBufferInt64Check("readBigInt64BE");
      return this._readNumberValue(Buffer.prototype.readBigInt64BE, 8, offset);
    }
    /**
     * Reads a BigInt64LE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { BigInt }
     */
    readBigInt64LE(offset) {
      utils_1.bigIntAndBufferInt64Check("readBigInt64LE");
      return this._readNumberValue(Buffer.prototype.readBigInt64LE, 8, offset);
    }
    /**
     * Writes an Int8 value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeInt8(value, offset) {
      this._writeNumberValue(Buffer.prototype.writeInt8, 1, value, offset);
      return this;
    }
    /**
     * Inserts an Int8 value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */
    insertInt8(value, offset) {
      return this._insertNumberValue(Buffer.prototype.writeInt8, 1, value, offset);
    }
    /**
     * Writes an Int16BE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeInt16BE(value, offset) {
      return this._writeNumberValue(Buffer.prototype.writeInt16BE, 2, value, offset);
    }
    /**
     * Inserts an Int16BE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */
    insertInt16BE(value, offset) {
      return this._insertNumberValue(Buffer.prototype.writeInt16BE, 2, value, offset);
    }
    /**
     * Writes an Int16LE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeInt16LE(value, offset) {
      return this._writeNumberValue(Buffer.prototype.writeInt16LE, 2, value, offset);
    }
    /**
     * Inserts an Int16LE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */
    insertInt16LE(value, offset) {
      return this._insertNumberValue(Buffer.prototype.writeInt16LE, 2, value, offset);
    }
    /**
     * Writes an Int32BE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeInt32BE(value, offset) {
      return this._writeNumberValue(Buffer.prototype.writeInt32BE, 4, value, offset);
    }
    /**
     * Inserts an Int32BE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */
    insertInt32BE(value, offset) {
      return this._insertNumberValue(Buffer.prototype.writeInt32BE, 4, value, offset);
    }
    /**
     * Writes an Int32LE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeInt32LE(value, offset) {
      return this._writeNumberValue(Buffer.prototype.writeInt32LE, 4, value, offset);
    }
    /**
     * Inserts an Int32LE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */
    insertInt32LE(value, offset) {
      return this._insertNumberValue(Buffer.prototype.writeInt32LE, 4, value, offset);
    }
    /**
     * Writes a BigInt64BE value to the current write position (or at optional offset).
     *
     * @param value { BigInt } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeBigInt64BE(value, offset) {
      utils_1.bigIntAndBufferInt64Check("writeBigInt64BE");
      return this._writeNumberValue(Buffer.prototype.writeBigInt64BE, 8, value, offset);
    }
    /**
     * Inserts a BigInt64BE value at the given offset value.
     *
     * @param value { BigInt } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */
    insertBigInt64BE(value, offset) {
      utils_1.bigIntAndBufferInt64Check("writeBigInt64BE");
      return this._insertNumberValue(Buffer.prototype.writeBigInt64BE, 8, value, offset);
    }
    /**
     * Writes a BigInt64LE value to the current write position (or at optional offset).
     *
     * @param value { BigInt } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeBigInt64LE(value, offset) {
      utils_1.bigIntAndBufferInt64Check("writeBigInt64LE");
      return this._writeNumberValue(Buffer.prototype.writeBigInt64LE, 8, value, offset);
    }
    /**
     * Inserts a Int64LE value at the given offset value.
     *
     * @param value { BigInt } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */
    insertBigInt64LE(value, offset) {
      utils_1.bigIntAndBufferInt64Check("writeBigInt64LE");
      return this._insertNumberValue(Buffer.prototype.writeBigInt64LE, 8, value, offset);
    }
    // Unsigned Integers
    /**
     * Reads an UInt8 value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */
    readUInt8(offset) {
      return this._readNumberValue(Buffer.prototype.readUInt8, 1, offset);
    }
    /**
     * Reads an UInt16BE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */
    readUInt16BE(offset) {
      return this._readNumberValue(Buffer.prototype.readUInt16BE, 2, offset);
    }
    /**
     * Reads an UInt16LE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */
    readUInt16LE(offset) {
      return this._readNumberValue(Buffer.prototype.readUInt16LE, 2, offset);
    }
    /**
     * Reads an UInt32BE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */
    readUInt32BE(offset) {
      return this._readNumberValue(Buffer.prototype.readUInt32BE, 4, offset);
    }
    /**
     * Reads an UInt32LE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */
    readUInt32LE(offset) {
      return this._readNumberValue(Buffer.prototype.readUInt32LE, 4, offset);
    }
    /**
     * Reads a BigUInt64BE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { BigInt }
     */
    readBigUInt64BE(offset) {
      utils_1.bigIntAndBufferInt64Check("readBigUInt64BE");
      return this._readNumberValue(Buffer.prototype.readBigUInt64BE, 8, offset);
    }
    /**
     * Reads a BigUInt64LE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { BigInt }
     */
    readBigUInt64LE(offset) {
      utils_1.bigIntAndBufferInt64Check("readBigUInt64LE");
      return this._readNumberValue(Buffer.prototype.readBigUInt64LE, 8, offset);
    }
    /**
     * Writes an UInt8 value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeUInt8(value, offset) {
      return this._writeNumberValue(Buffer.prototype.writeUInt8, 1, value, offset);
    }
    /**
     * Inserts an UInt8 value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */
    insertUInt8(value, offset) {
      return this._insertNumberValue(Buffer.prototype.writeUInt8, 1, value, offset);
    }
    /**
     * Writes an UInt16BE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeUInt16BE(value, offset) {
      return this._writeNumberValue(Buffer.prototype.writeUInt16BE, 2, value, offset);
    }
    /**
     * Inserts an UInt16BE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */
    insertUInt16BE(value, offset) {
      return this._insertNumberValue(Buffer.prototype.writeUInt16BE, 2, value, offset);
    }
    /**
     * Writes an UInt16LE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeUInt16LE(value, offset) {
      return this._writeNumberValue(Buffer.prototype.writeUInt16LE, 2, value, offset);
    }
    /**
     * Inserts an UInt16LE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */
    insertUInt16LE(value, offset) {
      return this._insertNumberValue(Buffer.prototype.writeUInt16LE, 2, value, offset);
    }
    /**
     * Writes an UInt32BE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeUInt32BE(value, offset) {
      return this._writeNumberValue(Buffer.prototype.writeUInt32BE, 4, value, offset);
    }
    /**
     * Inserts an UInt32BE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */
    insertUInt32BE(value, offset) {
      return this._insertNumberValue(Buffer.prototype.writeUInt32BE, 4, value, offset);
    }
    /**
     * Writes an UInt32LE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeUInt32LE(value, offset) {
      return this._writeNumberValue(Buffer.prototype.writeUInt32LE, 4, value, offset);
    }
    /**
     * Inserts an UInt32LE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */
    insertUInt32LE(value, offset) {
      return this._insertNumberValue(Buffer.prototype.writeUInt32LE, 4, value, offset);
    }
    /**
     * Writes a BigUInt64BE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeBigUInt64BE(value, offset) {
      utils_1.bigIntAndBufferInt64Check("writeBigUInt64BE");
      return this._writeNumberValue(Buffer.prototype.writeBigUInt64BE, 8, value, offset);
    }
    /**
     * Inserts a BigUInt64BE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */
    insertBigUInt64BE(value, offset) {
      utils_1.bigIntAndBufferInt64Check("writeBigUInt64BE");
      return this._insertNumberValue(Buffer.prototype.writeBigUInt64BE, 8, value, offset);
    }
    /**
     * Writes a BigUInt64LE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeBigUInt64LE(value, offset) {
      utils_1.bigIntAndBufferInt64Check("writeBigUInt64LE");
      return this._writeNumberValue(Buffer.prototype.writeBigUInt64LE, 8, value, offset);
    }
    /**
     * Inserts a BigUInt64LE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */
    insertBigUInt64LE(value, offset) {
      utils_1.bigIntAndBufferInt64Check("writeBigUInt64LE");
      return this._insertNumberValue(Buffer.prototype.writeBigUInt64LE, 8, value, offset);
    }
    // Floating Point
    /**
     * Reads an FloatBE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */
    readFloatBE(offset) {
      return this._readNumberValue(Buffer.prototype.readFloatBE, 4, offset);
    }
    /**
     * Reads an FloatLE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */
    readFloatLE(offset) {
      return this._readNumberValue(Buffer.prototype.readFloatLE, 4, offset);
    }
    /**
     * Writes a FloatBE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeFloatBE(value, offset) {
      return this._writeNumberValue(Buffer.prototype.writeFloatBE, 4, value, offset);
    }
    /**
     * Inserts a FloatBE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */
    insertFloatBE(value, offset) {
      return this._insertNumberValue(Buffer.prototype.writeFloatBE, 4, value, offset);
    }
    /**
     * Writes a FloatLE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeFloatLE(value, offset) {
      return this._writeNumberValue(Buffer.prototype.writeFloatLE, 4, value, offset);
    }
    /**
     * Inserts a FloatLE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */
    insertFloatLE(value, offset) {
      return this._insertNumberValue(Buffer.prototype.writeFloatLE, 4, value, offset);
    }
    // Double Floating Point
    /**
     * Reads an DoublEBE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */
    readDoubleBE(offset) {
      return this._readNumberValue(Buffer.prototype.readDoubleBE, 8, offset);
    }
    /**
     * Reads an DoubleLE value from the current read position or an optionally provided offset.
     *
     * @param offset { Number } The offset to read data from (optional)
     * @return { Number }
     */
    readDoubleLE(offset) {
      return this._readNumberValue(Buffer.prototype.readDoubleLE, 8, offset);
    }
    /**
     * Writes a DoubleBE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeDoubleBE(value, offset) {
      return this._writeNumberValue(Buffer.prototype.writeDoubleBE, 8, value, offset);
    }
    /**
     * Inserts a DoubleBE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */
    insertDoubleBE(value, offset) {
      return this._insertNumberValue(Buffer.prototype.writeDoubleBE, 8, value, offset);
    }
    /**
     * Writes a DoubleLE value to the current write position (or at optional offset).
     *
     * @param value { Number } The value to write.
     * @param offset { Number } The offset to write the value at.
     *
     * @return this
     */
    writeDoubleLE(value, offset) {
      return this._writeNumberValue(Buffer.prototype.writeDoubleLE, 8, value, offset);
    }
    /**
     * Inserts a DoubleLE value at the given offset value.
     *
     * @param value { Number } The value to insert.
     * @param offset { Number } The offset to insert the value at.
     *
     * @return this
     */
    insertDoubleLE(value, offset) {
      return this._insertNumberValue(Buffer.prototype.writeDoubleLE, 8, value, offset);
    }
    // Strings
    /**
     * Reads a String from the current read position.
     *
     * @param arg1 { Number | String } The number of bytes to read as a String, or the BufferEncoding to use for
     *             the string (Defaults to instance level encoding).
     * @param encoding { String } The BufferEncoding to use for the string (Defaults to instance level encoding).
     *
     * @return { String }
     */
    readString(arg1, encoding) {
      let lengthVal;
      if (typeof arg1 === "number") {
        utils_1.checkLengthValue(arg1);
        lengthVal = Math.min(arg1, this.length - this._readOffset);
      } else {
        encoding = arg1;
        lengthVal = this.length - this._readOffset;
      }
      if (typeof encoding !== "undefined") {
        utils_1.checkEncoding(encoding);
      }
      const value = this._buff.slice(this._readOffset, this._readOffset + lengthVal).toString(encoding || this._encoding);
      this._readOffset += lengthVal;
      return value;
    }
    /**
     * Inserts a String
     *
     * @param value { String } The String value to insert.
     * @param offset { Number } The offset to insert the string at.
     * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
     *
     * @return this
     */
    insertString(value, offset, encoding) {
      utils_1.checkOffsetValue(offset);
      return this._handleString(value, true, offset, encoding);
    }
    /**
     * Writes a String
     *
     * @param value { String } The String value to write.
     * @param arg2 { Number | String } The offset to write the string at, or the BufferEncoding to use.
     * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
     *
     * @return this
     */
    writeString(value, arg2, encoding) {
      return this._handleString(value, false, arg2, encoding);
    }
    /**
     * Reads a null-terminated String from the current read position.
     *
     * @param encoding { String } The BufferEncoding to use for the string (Defaults to instance level encoding).
     *
     * @return { String }
     */
    readStringNT(encoding) {
      if (typeof encoding !== "undefined") {
        utils_1.checkEncoding(encoding);
      }
      let nullPos = this.length;
      for (let i = this._readOffset; i < this.length; i++) {
        if (this._buff[i] === 0) {
          nullPos = i;
          break;
        }
      }
      const value = this._buff.slice(this._readOffset, nullPos);
      this._readOffset = nullPos + 1;
      return value.toString(encoding || this._encoding);
    }
    /**
     * Inserts a null-terminated String.
     *
     * @param value { String } The String value to write.
     * @param arg2 { Number | String } The offset to write the string to, or the BufferEncoding to use.
     * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
     *
     * @return this
     */
    insertStringNT(value, offset, encoding) {
      utils_1.checkOffsetValue(offset);
      this.insertString(value, offset, encoding);
      this.insertUInt8(0, offset + value.length);
      return this;
    }
    /**
     * Writes a null-terminated String.
     *
     * @param value { String } The String value to write.
     * @param arg2 { Number | String } The offset to write the string to, or the BufferEncoding to use.
     * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
     *
     * @return this
     */
    writeStringNT(value, arg2, encoding) {
      this.writeString(value, arg2, encoding);
      this.writeUInt8(0, typeof arg2 === "number" ? arg2 + value.length : this.writeOffset);
      return this;
    }
    // Buffers
    /**
     * Reads a Buffer from the internal read position.
     *
     * @param length { Number } The length of data to read as a Buffer.
     *
     * @return { Buffer }
     */
    readBuffer(length) {
      if (typeof length !== "undefined") {
        utils_1.checkLengthValue(length);
      }
      const lengthVal = typeof length === "number" ? length : this.length;
      const endPoint = Math.min(this.length, this._readOffset + lengthVal);
      const value = this._buff.slice(this._readOffset, endPoint);
      this._readOffset = endPoint;
      return value;
    }
    /**
     * Writes a Buffer to the current write position.
     *
     * @param value { Buffer } The Buffer to write.
     * @param offset { Number } The offset to write the Buffer to.
     *
     * @return this
     */
    insertBuffer(value, offset) {
      utils_1.checkOffsetValue(offset);
      return this._handleBuffer(value, true, offset);
    }
    /**
     * Writes a Buffer to the current write position.
     *
     * @param value { Buffer } The Buffer to write.
     * @param offset { Number } The offset to write the Buffer to.
     *
     * @return this
     */
    writeBuffer(value, offset) {
      return this._handleBuffer(value, false, offset);
    }
    /**
     * Reads a null-terminated Buffer from the current read poisiton.
     *
     * @return { Buffer }
     */
    readBufferNT() {
      let nullPos = this.length;
      for (let i = this._readOffset; i < this.length; i++) {
        if (this._buff[i] === 0) {
          nullPos = i;
          break;
        }
      }
      const value = this._buff.slice(this._readOffset, nullPos);
      this._readOffset = nullPos + 1;
      return value;
    }
    /**
     * Inserts a null-terminated Buffer.
     *
     * @param value { Buffer } The Buffer to write.
     * @param offset { Number } The offset to write the Buffer to.
     *
     * @return this
     */
    insertBufferNT(value, offset) {
      utils_1.checkOffsetValue(offset);
      this.insertBuffer(value, offset);
      this.insertUInt8(0, offset + value.length);
      return this;
    }
    /**
     * Writes a null-terminated Buffer.
     *
     * @param value { Buffer } The Buffer to write.
     * @param offset { Number } The offset to write the Buffer to.
     *
     * @return this
     */
    writeBufferNT(value, offset) {
      if (typeof offset !== "undefined") {
        utils_1.checkOffsetValue(offset);
      }
      this.writeBuffer(value, offset);
      this.writeUInt8(0, typeof offset === "number" ? offset + value.length : this._writeOffset);
      return this;
    }
    /**
     * Clears the SmartBuffer instance to its original empty state.
     */
    clear() {
      this._writeOffset = 0;
      this._readOffset = 0;
      this.length = 0;
      return this;
    }
    /**
     * Gets the remaining data left to be read from the SmartBuffer instance.
     *
     * @return { Number }
     */
    remaining() {
      return this.length - this._readOffset;
    }
    /**
     * Gets the current read offset value of the SmartBuffer instance.
     *
     * @return { Number }
     */
    get readOffset() {
      return this._readOffset;
    }
    /**
     * Sets the read offset value of the SmartBuffer instance.
     *
     * @param offset { Number } - The offset value to set.
     */
    set readOffset(offset) {
      utils_1.checkOffsetValue(offset);
      utils_1.checkTargetOffset(offset, this);
      this._readOffset = offset;
    }
    /**
     * Gets the current write offset value of the SmartBuffer instance.
     *
     * @return { Number }
     */
    get writeOffset() {
      return this._writeOffset;
    }
    /**
     * Sets the write offset value of the SmartBuffer instance.
     *
     * @param offset { Number } - The offset value to set.
     */
    set writeOffset(offset) {
      utils_1.checkOffsetValue(offset);
      utils_1.checkTargetOffset(offset, this);
      this._writeOffset = offset;
    }
    /**
     * Gets the currently set string encoding of the SmartBuffer instance.
     *
     * @return { BufferEncoding } The string Buffer encoding currently set.
     */
    get encoding() {
      return this._encoding;
    }
    /**
     * Sets the string encoding of the SmartBuffer instance.
     *
     * @param encoding { BufferEncoding } The string Buffer encoding to set.
     */
    set encoding(encoding) {
      utils_1.checkEncoding(encoding);
      this._encoding = encoding;
    }
    /**
     * Gets the underlying internal Buffer. (This includes unmanaged data in the Buffer)
     *
     * @return { Buffer } The Buffer value.
     */
    get internalBuffer() {
      return this._buff;
    }
    /**
     * Gets the value of the internal managed Buffer (Includes managed data only)
     *
     * @param { Buffer }
     */
    toBuffer() {
      return this._buff.slice(0, this.length);
    }
    /**
     * Gets the String value of the internal managed Buffer
     *
     * @param encoding { String } The BufferEncoding to display the Buffer as (defaults to instance level encoding).
     */
    toString(encoding) {
      const encodingVal = typeof encoding === "string" ? encoding : this._encoding;
      utils_1.checkEncoding(encodingVal);
      return this._buff.toString(encodingVal, 0, this.length);
    }
    /**
     * Destroys the SmartBuffer instance.
     */
    destroy() {
      this.clear();
      return this;
    }
    /**
     * Handles inserting and writing strings.
     *
     * @param value { String } The String value to insert.
     * @param isInsert { Boolean } True if inserting a string, false if writing.
     * @param arg2 { Number | String } The offset to insert the string at, or the BufferEncoding to use.
     * @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
     */
    _handleString(value, isInsert, arg3, encoding) {
      let offsetVal = this._writeOffset;
      let encodingVal = this._encoding;
      if (typeof arg3 === "number") {
        offsetVal = arg3;
      } else if (typeof arg3 === "string") {
        utils_1.checkEncoding(arg3);
        encodingVal = arg3;
      }
      if (typeof encoding === "string") {
        utils_1.checkEncoding(encoding);
        encodingVal = encoding;
      }
      const byteLength = Buffer.byteLength(value, encodingVal);
      if (isInsert) {
        this.ensureInsertable(byteLength, offsetVal);
      } else {
        this._ensureWriteable(byteLength, offsetVal);
      }
      this._buff.write(value, offsetVal, byteLength, encodingVal);
      if (isInsert) {
        this._writeOffset += byteLength;
      } else {
        if (typeof arg3 === "number") {
          this._writeOffset = Math.max(this._writeOffset, offsetVal + byteLength);
        } else {
          this._writeOffset += byteLength;
        }
      }
      return this;
    }
    /**
     * Handles writing or insert of a Buffer.
     *
     * @param value { Buffer } The Buffer to write.
     * @param offset { Number } The offset to write the Buffer to.
     */
    _handleBuffer(value, isInsert, offset) {
      const offsetVal = typeof offset === "number" ? offset : this._writeOffset;
      if (isInsert) {
        this.ensureInsertable(value.length, offsetVal);
      } else {
        this._ensureWriteable(value.length, offsetVal);
      }
      value.copy(this._buff, offsetVal);
      if (isInsert) {
        this._writeOffset += value.length;
      } else {
        if (typeof offset === "number") {
          this._writeOffset = Math.max(this._writeOffset, offsetVal + value.length);
        } else {
          this._writeOffset += value.length;
        }
      }
      return this;
    }
    /**
     * Ensures that the internal Buffer is large enough to read data.
     *
     * @param length { Number } The length of the data that needs to be read.
     * @param offset { Number } The offset of the data that needs to be read.
     */
    ensureReadable(length, offset) {
      let offsetVal = this._readOffset;
      if (typeof offset !== "undefined") {
        utils_1.checkOffsetValue(offset);
        offsetVal = offset;
      }
      if (offsetVal < 0 || offsetVal + length > this.length) {
        throw new Error(utils_1.ERRORS.INVALID_READ_BEYOND_BOUNDS);
      }
    }
    /**
     * Ensures that the internal Buffer is large enough to insert data.
     *
     * @param dataLength { Number } The length of the data that needs to be written.
     * @param offset { Number } The offset of the data to be written.
     */
    ensureInsertable(dataLength, offset) {
      utils_1.checkOffsetValue(offset);
      this._ensureCapacity(this.length + dataLength);
      if (offset < this.length) {
        this._buff.copy(this._buff, offset + dataLength, offset, this._buff.length);
      }
      if (offset + dataLength > this.length) {
        this.length = offset + dataLength;
      } else {
        this.length += dataLength;
      }
    }
    /**
     * Ensures that the internal Buffer is large enough to write data.
     *
     * @param dataLength { Number } The length of the data that needs to be written.
     * @param offset { Number } The offset of the data to be written (defaults to writeOffset).
     */
    _ensureWriteable(dataLength, offset) {
      const offsetVal = typeof offset === "number" ? offset : this._writeOffset;
      this._ensureCapacity(offsetVal + dataLength);
      if (offsetVal + dataLength > this.length) {
        this.length = offsetVal + dataLength;
      }
    }
    /**
     * Ensures that the internal Buffer is large enough to write at least the given amount of data.
     *
     * @param minLength { Number } The minimum length of the data needs to be written.
     */
    _ensureCapacity(minLength) {
      const oldLength = this._buff.length;
      if (minLength > oldLength) {
        let data = this._buff;
        let newLength = oldLength * 3 / 2 + 1;
        if (newLength < minLength) {
          newLength = minLength;
        }
        this._buff = Buffer.allocUnsafe(newLength);
        data.copy(this._buff, 0, 0, oldLength);
      }
    }
    /**
     * Reads a numeric number value using the provided function.
     *
     * @typeparam T { number | bigint } The type of the value to be read
     *
     * @param func { Function(offset: number) => number } The function to read data on the internal Buffer with.
     * @param byteSize { Number } The number of bytes read.
     * @param offset { Number } The offset to read from (optional). When this is not provided, the managed readOffset is used instead.
     *
     * @returns { T } the number value
     */
    _readNumberValue(func, byteSize, offset) {
      this.ensureReadable(byteSize, offset);
      const value = func.call(this._buff, typeof offset === "number" ? offset : this._readOffset);
      if (typeof offset === "undefined") {
        this._readOffset += byteSize;
      }
      return value;
    }
    /**
     * Inserts a numeric number value based on the given offset and value.
     *
     * @typeparam T { number | bigint } The type of the value to be written
     *
     * @param func { Function(offset: T, offset?) => number} The function to write data on the internal Buffer with.
     * @param byteSize { Number } The number of bytes written.
     * @param value { T } The number value to write.
     * @param offset { Number } the offset to write the number at (REQUIRED).
     *
     * @returns SmartBuffer this buffer
     */
    _insertNumberValue(func, byteSize, value, offset) {
      utils_1.checkOffsetValue(offset);
      this.ensureInsertable(byteSize, offset);
      func.call(this._buff, value, offset);
      this._writeOffset += byteSize;
      return this;
    }
    /**
     * Writes a numeric number value based on the given offset and value.
     *
     * @typeparam T { number | bigint } The type of the value to be written
     *
     * @param func { Function(offset: T, offset?) => number} The function to write data on the internal Buffer with.
     * @param byteSize { Number } The number of bytes written.
     * @param value { T } The number value to write.
     * @param offset { Number } the offset to write the number at (REQUIRED).
     *
     * @returns SmartBuffer this buffer
     */
    _writeNumberValue(func, byteSize, value, offset) {
      if (typeof offset === "number") {
        if (offset < 0) {
          throw new Error(utils_1.ERRORS.INVALID_WRITE_BEYOND_BOUNDS);
        }
        utils_1.checkOffsetValue(offset);
      }
      const offsetVal = typeof offset === "number" ? offset : this._writeOffset;
      this._ensureWriteable(byteSize, offsetVal);
      func.call(this._buff, value, offsetVal);
      if (typeof offset === "number") {
        this._writeOffset = Math.max(this._writeOffset, offsetVal + byteSize);
      } else {
        this._writeOffset += byteSize;
      }
      return this;
    }
  }
  smartbuffer.SmartBuffer = SmartBuffer;
  return smartbuffer;
}
var constants$2 = {};
var hasRequiredConstants$2;
function requireConstants$2() {
  if (hasRequiredConstants$2) return constants$2;
  hasRequiredConstants$2 = 1;
  Object.defineProperty(constants$2, "__esModule", { value: true });
  constants$2.SOCKS5_NO_ACCEPTABLE_AUTH = constants$2.SOCKS5_CUSTOM_AUTH_END = constants$2.SOCKS5_CUSTOM_AUTH_START = constants$2.SOCKS_INCOMING_PACKET_SIZES = constants$2.SocksClientState = constants$2.Socks5Response = constants$2.Socks5HostType = constants$2.Socks5Auth = constants$2.Socks4Response = constants$2.SocksCommand = constants$2.ERRORS = constants$2.DEFAULT_TIMEOUT = void 0;
  const DEFAULT_TIMEOUT = 3e4;
  constants$2.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT;
  const ERRORS = {
    InvalidSocksCommand: "An invalid SOCKS command was provided. Valid options are connect, bind, and associate.",
    InvalidSocksCommandForOperation: "An invalid SOCKS command was provided. Only a subset of commands are supported for this operation.",
    InvalidSocksCommandChain: "An invalid SOCKS command was provided. Chaining currently only supports the connect command.",
    InvalidSocksClientOptionsDestination: "An invalid destination host was provided.",
    InvalidSocksClientOptionsExistingSocket: "An invalid existing socket was provided. This should be an instance of stream.Duplex.",
    InvalidSocksClientOptionsProxy: "Invalid SOCKS proxy details were provided.",
    InvalidSocksClientOptionsTimeout: "An invalid timeout value was provided. Please enter a value above 0 (in ms).",
    InvalidSocksClientOptionsProxiesLength: "At least two socks proxies must be provided for chaining.",
    InvalidSocksClientOptionsCustomAuthRange: "Custom auth must be a value between 0x80 and 0xFE.",
    InvalidSocksClientOptionsCustomAuthOptions: "When a custom_auth_method is provided, custom_auth_request_handler, custom_auth_response_size, and custom_auth_response_handler must also be provided and valid.",
    NegotiationError: "Negotiation error",
    SocketClosed: "Socket closed",
    ProxyConnectionTimedOut: "Proxy connection timed out",
    InternalError: "SocksClient internal error (this should not happen)",
    InvalidSocks4HandshakeResponse: "Received invalid Socks4 handshake response",
    Socks4ProxyRejectedConnection: "Socks4 Proxy rejected connection",
    InvalidSocks4IncomingConnectionResponse: "Socks4 invalid incoming connection response",
    Socks4ProxyRejectedIncomingBoundConnection: "Socks4 Proxy rejected incoming bound connection",
    InvalidSocks5InitialHandshakeResponse: "Received invalid Socks5 initial handshake response",
    InvalidSocks5IntiailHandshakeSocksVersion: "Received invalid Socks5 initial handshake (invalid socks version)",
    InvalidSocks5InitialHandshakeNoAcceptedAuthType: "Received invalid Socks5 initial handshake (no accepted authentication type)",
    InvalidSocks5InitialHandshakeUnknownAuthType: "Received invalid Socks5 initial handshake (unknown authentication type)",
    Socks5AuthenticationFailed: "Socks5 Authentication failed",
    InvalidSocks5FinalHandshake: "Received invalid Socks5 final handshake response",
    InvalidSocks5FinalHandshakeRejected: "Socks5 proxy rejected connection",
    InvalidSocks5IncomingConnectionResponse: "Received invalid Socks5 incoming connection response",
    Socks5ProxyRejectedIncomingBoundConnection: "Socks5 Proxy rejected incoming bound connection"
  };
  constants$2.ERRORS = ERRORS;
  const SOCKS_INCOMING_PACKET_SIZES = {
    Socks5InitialHandshakeResponse: 2,
    Socks5UserPassAuthenticationResponse: 2,
    // Command response + incoming connection (bind)
    Socks5ResponseHeader: 5,
    // We need at least 5 to read the hostname length, then we wait for the address+port information.
    Socks5ResponseIPv4: 10,
    // 4 header + 4 ip + 2 port
    Socks5ResponseIPv6: 22,
    // 4 header + 16 ip + 2 port
    Socks5ResponseHostname: (hostNameLength) => hostNameLength + 7,
    // 4 header + 1 host length + host + 2 port
    // Command response + incoming connection (bind)
    Socks4Response: 8
    // 2 header + 2 port + 4 ip
  };
  constants$2.SOCKS_INCOMING_PACKET_SIZES = SOCKS_INCOMING_PACKET_SIZES;
  var SocksCommand;
  (function(SocksCommand2) {
    SocksCommand2[SocksCommand2["connect"] = 1] = "connect";
    SocksCommand2[SocksCommand2["bind"] = 2] = "bind";
    SocksCommand2[SocksCommand2["associate"] = 3] = "associate";
  })(SocksCommand || (constants$2.SocksCommand = SocksCommand = {}));
  var Socks4Response;
  (function(Socks4Response2) {
    Socks4Response2[Socks4Response2["Granted"] = 90] = "Granted";
    Socks4Response2[Socks4Response2["Failed"] = 91] = "Failed";
    Socks4Response2[Socks4Response2["Rejected"] = 92] = "Rejected";
    Socks4Response2[Socks4Response2["RejectedIdent"] = 93] = "RejectedIdent";
  })(Socks4Response || (constants$2.Socks4Response = Socks4Response = {}));
  var Socks5Auth;
  (function(Socks5Auth2) {
    Socks5Auth2[Socks5Auth2["NoAuth"] = 0] = "NoAuth";
    Socks5Auth2[Socks5Auth2["GSSApi"] = 1] = "GSSApi";
    Socks5Auth2[Socks5Auth2["UserPass"] = 2] = "UserPass";
  })(Socks5Auth || (constants$2.Socks5Auth = Socks5Auth = {}));
  const SOCKS5_CUSTOM_AUTH_START = 128;
  constants$2.SOCKS5_CUSTOM_AUTH_START = SOCKS5_CUSTOM_AUTH_START;
  const SOCKS5_CUSTOM_AUTH_END = 254;
  constants$2.SOCKS5_CUSTOM_AUTH_END = SOCKS5_CUSTOM_AUTH_END;
  const SOCKS5_NO_ACCEPTABLE_AUTH = 255;
  constants$2.SOCKS5_NO_ACCEPTABLE_AUTH = SOCKS5_NO_ACCEPTABLE_AUTH;
  var Socks5Response;
  (function(Socks5Response2) {
    Socks5Response2[Socks5Response2["Granted"] = 0] = "Granted";
    Socks5Response2[Socks5Response2["Failure"] = 1] = "Failure";
    Socks5Response2[Socks5Response2["NotAllowed"] = 2] = "NotAllowed";
    Socks5Response2[Socks5Response2["NetworkUnreachable"] = 3] = "NetworkUnreachable";
    Socks5Response2[Socks5Response2["HostUnreachable"] = 4] = "HostUnreachable";
    Socks5Response2[Socks5Response2["ConnectionRefused"] = 5] = "ConnectionRefused";
    Socks5Response2[Socks5Response2["TTLExpired"] = 6] = "TTLExpired";
    Socks5Response2[Socks5Response2["CommandNotSupported"] = 7] = "CommandNotSupported";
    Socks5Response2[Socks5Response2["AddressNotSupported"] = 8] = "AddressNotSupported";
  })(Socks5Response || (constants$2.Socks5Response = Socks5Response = {}));
  var Socks5HostType;
  (function(Socks5HostType2) {
    Socks5HostType2[Socks5HostType2["IPv4"] = 1] = "IPv4";
    Socks5HostType2[Socks5HostType2["Hostname"] = 3] = "Hostname";
    Socks5HostType2[Socks5HostType2["IPv6"] = 4] = "IPv6";
  })(Socks5HostType || (constants$2.Socks5HostType = Socks5HostType = {}));
  var SocksClientState;
  (function(SocksClientState2) {
    SocksClientState2[SocksClientState2["Created"] = 0] = "Created";
    SocksClientState2[SocksClientState2["Connecting"] = 1] = "Connecting";
    SocksClientState2[SocksClientState2["Connected"] = 2] = "Connected";
    SocksClientState2[SocksClientState2["SentInitialHandshake"] = 3] = "SentInitialHandshake";
    SocksClientState2[SocksClientState2["ReceivedInitialHandshakeResponse"] = 4] = "ReceivedInitialHandshakeResponse";
    SocksClientState2[SocksClientState2["SentAuthentication"] = 5] = "SentAuthentication";
    SocksClientState2[SocksClientState2["ReceivedAuthenticationResponse"] = 6] = "ReceivedAuthenticationResponse";
    SocksClientState2[SocksClientState2["SentFinalHandshake"] = 7] = "SentFinalHandshake";
    SocksClientState2[SocksClientState2["ReceivedFinalResponse"] = 8] = "ReceivedFinalResponse";
    SocksClientState2[SocksClientState2["BoundWaitingForConnection"] = 9] = "BoundWaitingForConnection";
    SocksClientState2[SocksClientState2["Established"] = 10] = "Established";
    SocksClientState2[SocksClientState2["Disconnected"] = 11] = "Disconnected";
    SocksClientState2[SocksClientState2["Error"] = 99] = "Error";
  })(SocksClientState || (constants$2.SocksClientState = SocksClientState = {}));
  return constants$2;
}
var helpers$1 = {};
var util = {};
var hasRequiredUtil;
function requireUtil() {
  if (hasRequiredUtil) return util;
  hasRequiredUtil = 1;
  Object.defineProperty(util, "__esModule", { value: true });
  util.shuffleArray = util.SocksClientError = void 0;
  class SocksClientError extends Error {
    constructor(message, options) {
      super(message);
      this.options = options;
    }
  }
  util.SocksClientError = SocksClientError;
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  util.shuffleArray = shuffleArray;
  return util;
}
var ipAddress = {};
var ipv4 = {};
var common = {};
var addressError = {};
var hasRequiredAddressError;
function requireAddressError() {
  if (hasRequiredAddressError) return addressError;
  hasRequiredAddressError = 1;
  Object.defineProperty(addressError, "__esModule", { value: true });
  addressError.AddressError = void 0;
  class AddressError extends Error {
    constructor(message, parseMessage) {
      super(message);
      this.name = "AddressError";
      this.parseMessage = parseMessage;
    }
  }
  addressError.AddressError = AddressError;
  return addressError;
}
var hasRequiredCommon;
function requireCommon() {
  if (hasRequiredCommon) return common;
  hasRequiredCommon = 1;
  Object.defineProperty(common, "__esModule", { value: true });
  common.isInSubnet = isInSubnet;
  common.isCorrect = isCorrect;
  common.prefixLengthFromMask = prefixLengthFromMask;
  common.numberToPaddedHex = numberToPaddedHex;
  common.stringToPaddedHex = stringToPaddedHex;
  common.testBit = testBit;
  const address_error_1 = /* @__PURE__ */ requireAddressError();
  function isInSubnet(address) {
    if (this.subnetMask < address.subnetMask) {
      return false;
    }
    if (this.mask(address.subnetMask) === address.mask()) {
      return true;
    }
    return false;
  }
  function isCorrect(defaultBits) {
    return function() {
      if (this.addressMinusSuffix !== this.correctForm()) {
        return false;
      }
      if (this.subnetMask === defaultBits && !this.parsedSubnet) {
        return true;
      }
      return this.parsedSubnet === String(this.subnetMask);
    };
  }
  function prefixLengthFromMask(value, totalBits) {
    const binary = value.toString(2).padStart(totalBits, "0");
    if (binary.length > totalBits) {
      throw new address_error_1.AddressError("Invalid subnet mask.");
    }
    const firstZero = binary.indexOf("0");
    if (firstZero === -1) {
      return totalBits;
    }
    if (binary.slice(firstZero).includes("1")) {
      throw new address_error_1.AddressError("Invalid subnet mask.");
    }
    return firstZero;
  }
  function numberToPaddedHex(number) {
    return number.toString(16).padStart(2, "0");
  }
  function stringToPaddedHex(numberString) {
    return numberToPaddedHex(parseInt(numberString, 10));
  }
  function testBit(binaryValue, position) {
    const { length } = binaryValue;
    if (position > length) {
      return false;
    }
    const positionInString = length - position;
    return binaryValue.substring(positionInString, positionInString + 1) === "1";
  }
  return common;
}
var constants$1 = {};
var hasRequiredConstants$1;
function requireConstants$1() {
  if (hasRequiredConstants$1) return constants$1;
  hasRequiredConstants$1 = 1;
  Object.defineProperty(constants$1, "__esModule", { value: true });
  constants$1.RE_SUBNET_STRING = constants$1.RE_ADDRESS = constants$1.GROUPS = constants$1.BITS = void 0;
  constants$1.BITS = 32;
  constants$1.GROUPS = 4;
  constants$1.RE_ADDRESS = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/g;
  constants$1.RE_SUBNET_STRING = /\/\d{1,2}$/;
  return constants$1;
}
var hasRequiredIpv4;
function requireIpv4() {
  if (hasRequiredIpv4) return ipv4;
  hasRequiredIpv4 = 1;
  var __createBinding = ipv4 && ipv4.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = ipv4 && ipv4.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = ipv4 && ipv4.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(ipv4, "__esModule", { value: true });
  ipv4.Address4 = void 0;
  const common2 = __importStar(/* @__PURE__ */ requireCommon());
  const constants2 = __importStar(/* @__PURE__ */ requireConstants$1());
  const address_error_1 = /* @__PURE__ */ requireAddressError();
  const isCorrect4 = common2.isCorrect(constants2.BITS);
  class Address4 {
    constructor(address) {
      this.groups = constants2.GROUPS;
      this.parsedAddress = [];
      this.parsedSubnet = "";
      this.subnet = "/32";
      this.subnetMask = 32;
      this.v4 = true;
      this.isCorrect = isCorrect4;
      this.isInSubnet = common2.isInSubnet;
      this.address = address;
      const subnet = constants2.RE_SUBNET_STRING.exec(address);
      if (subnet) {
        this.parsedSubnet = subnet[0].replace("/", "");
        this.subnetMask = parseInt(this.parsedSubnet, 10);
        this.subnet = `/${this.subnetMask}`;
        if (this.subnetMask < 0 || this.subnetMask > constants2.BITS) {
          throw new address_error_1.AddressError("Invalid subnet mask.");
        }
        address = address.replace(constants2.RE_SUBNET_STRING, "");
      }
      this.addressMinusSuffix = address;
      this.parsedAddress = this.parse(address);
    }
    /**
     * Returns true if the given string is a valid IPv4 address (with optional
     * CIDR subnet), false otherwise. Host bits in the subnet portion are
     * allowed (e.g. `192.168.1.5/24` is valid); for strict network-address
     * validation compare `correctForm()` to `startAddress().correctForm()`,
     * or use `networkForm()`.
     */
    static isValid(address) {
      try {
        new Address4(address);
        return true;
      } catch (e) {
        return false;
      }
    }
    /**
     * Parses an IPv4 address string into its four octet groups and stores the
     * result on `this.parsedAddress`. Called automatically by the constructor;
     * you typically don't need to call it directly. Throws `AddressError` if
     * the input is not a valid IPv4 address.
     */
    parse(address) {
      const groups = address.split(".");
      if (!address.match(constants2.RE_ADDRESS)) {
        throw new address_error_1.AddressError("Invalid IPv4 address.");
      }
      return groups;
    }
    /**
     * Returns the address in correct form: octets joined with `.` and any
     * leading zeros stripped (e.g. `192.168.1.1`). For IPv4 this matches the
     * canonical dotted-decimal representation.
     */
    correctForm() {
      return this.parsedAddress.map((part) => parseInt(part, 10)).join(".");
    }
    /**
     * Construct an `Address4` from an address and a dotted-decimal subnet
     * mask given as separate strings (e.g. as returned by Node's
     * `os.networkInterfaces()`). Throws `AddressError` if the mask is
     * non-contiguous (e.g. `255.0.255.0`).
     * @example
     * var address = Address4.fromAddressAndMask('192.168.1.1', '255.255.255.0');
     * address.subnetMask; // 24
     */
    static fromAddressAndMask(address, mask) {
      const bits = common2.prefixLengthFromMask(new Address4(mask).bigInt(), constants2.BITS);
      return new Address4(`${address}/${bits}`);
    }
    /**
     * Construct an `Address4` from an address and a Cisco-style wildcard mask
     * given as separate strings (e.g. `0.0.0.255` for a `/24`). The wildcard
     * mask is the bitwise inverse of the subnet mask. Throws `AddressError`
     * if the mask is non-contiguous (e.g. `0.255.0.255`).
     * @example
     * var address = Address4.fromAddressAndWildcardMask('10.0.0.1', '0.0.0.255');
     * address.subnetMask; // 24
     */
    static fromAddressAndWildcardMask(address, wildcardMask) {
      const wildcard = new Address4(wildcardMask).bigInt();
      const allOnes = (BigInt(1) << BigInt(constants2.BITS)) - BigInt(1);
      const mask = wildcard ^ allOnes;
      const bits = common2.prefixLengthFromMask(mask, constants2.BITS);
      return new Address4(`${address}/${bits}`);
    }
    /**
     * Construct an `Address4` from a wildcard pattern with trailing `*`
     * octets. The number of trailing wildcards determines the prefix
     * length: each `*` represents 8 bits.
     *
     * Only trailing whole-octet wildcards are supported. Partial-octet
     * wildcards (e.g. `192.168.0.1*`) and interior wildcards (e.g.
     * `192.*.0.1`) throw `AddressError`.
     * @example
     * Address4.fromWildcard('192.168.0.*').subnet;   // '/24'
     * Address4.fromWildcard('192.168.*.*').subnet;   // '/16'
     * Address4.fromWildcard('*.*.*.*').subnet;       // '/0'
     */
    static fromWildcard(input) {
      const groups = input.split(".");
      if (groups.length !== constants2.GROUPS) {
        throw new address_error_1.AddressError("Wildcard pattern must have 4 octets");
      }
      let firstWildcard = -1;
      for (let i = 0; i < groups.length; i++) {
        if (groups[i] === "*") {
          if (firstWildcard === -1) {
            firstWildcard = i;
          }
        } else if (firstWildcard !== -1) {
          throw new address_error_1.AddressError("Wildcard `*` must only appear in trailing octets (e.g. `192.168.0.*`)");
        }
      }
      const trailing = firstWildcard === -1 ? 0 : groups.length - firstWildcard;
      const replaced = groups.map((g) => g === "*" ? "0" : g);
      const subnetBits = constants2.BITS - trailing * 8;
      return new Address4(`${replaced.join(".")}/${subnetBits}`);
    }
    /**
     * Converts a hex string to an IPv4 address object. Accepts 8 hex digits
     * with optional `:` separators (e.g. `'7f000001'` or `'7f:00:00:01'`).
     * Throws `AddressError` for any other length or for non-hex characters.
     * @param {string} hex - a hex string to convert
     * @returns {Address4}
     */
    static fromHex(hex) {
      const stripped = hex.replace(/:/g, "");
      if (!/^[0-9a-fA-F]{8}$/.test(stripped)) {
        throw new address_error_1.AddressError("IPv4 hex must be exactly 8 hex digits");
      }
      const groups = [];
      for (let i = 0; i < 8; i += 2) {
        groups.push(parseInt(stripped.slice(i, i + 2), 16));
      }
      return new Address4(groups.join("."));
    }
    /**
     * Converts an integer into a IPv4 address object. The integer must be a
     * non-negative safe integer in the range `[0, 2**32 - 1]`; otherwise
     * `AddressError` is thrown.
     * @param {integer} integer - a number to convert
     * @returns {Address4}
     */
    static fromInteger(integer) {
      if (!Number.isInteger(integer) || integer < 0 || integer > 4294967295) {
        throw new address_error_1.AddressError("IPv4 integer must be in the range 0 to 2**32 - 1");
      }
      return Address4.fromHex(integer.toString(16).padStart(8, "0"));
    }
    /**
     * Return an address from in-addr.arpa form
     * @param {string} arpaFormAddress - an 'in-addr.arpa' form ipv4 address
     * @returns {Adress4}
     * @example
     * var address = Address4.fromArpa(42.2.0.192.in-addr.arpa.)
     * address.correctForm(); // '192.0.2.42'
     */
    static fromArpa(arpaFormAddress) {
      const leader = arpaFormAddress.replace(/(\.in-addr\.arpa)?\.$/, "");
      const address = leader.split(".").reverse().join(".");
      return new Address4(address);
    }
    /**
     * Converts an IPv4 address object to a hex string
     * @returns {String}
     */
    toHex() {
      return this.parsedAddress.map((part) => common2.stringToPaddedHex(part)).join(":");
    }
    /**
     * Converts an IPv4 address object to an array of bytes.
     *
     * To get a Node.js `Buffer`, wrap the result: `Buffer.from(address.toArray())`.
     * @returns {Array}
     */
    toArray() {
      return this.parsedAddress.map((part) => parseInt(part, 10));
    }
    /**
     * Converts an IPv4 address object to an IPv6 address group
     * @returns {String}
     */
    toGroup6() {
      const output = [];
      let i;
      for (i = 0; i < constants2.GROUPS; i += 2) {
        output.push(`${common2.stringToPaddedHex(this.parsedAddress[i])}${common2.stringToPaddedHex(this.parsedAddress[i + 1])}`);
      }
      return output.join(":");
    }
    /**
     * Returns the address as a `bigint`
     * @returns {bigint}
     */
    bigInt() {
      return BigInt(`0x${this.parsedAddress.map((n) => common2.stringToPaddedHex(n)).join("")}`);
    }
    /**
     * Helper function getting start address.
     * @returns {bigint}
     */
    _startAddress() {
      return BigInt(`0b${this.mask() + "0".repeat(constants2.BITS - this.subnetMask)}`);
    }
    /**
     * The first address in the range given by this address' subnet.
     * Often referred to as the Network Address.
     * @returns {Address4}
     */
    startAddress() {
      return Address4.fromBigInt(this._startAddress());
    }
    /**
     * The first host address in the range given by this address's subnet ie
     * the first address after the Network Address
     * @returns {Address4}
     */
    startAddressExclusive() {
      const adjust = BigInt("1");
      return Address4.fromBigInt(this._startAddress() + adjust);
    }
    /**
     * Helper function getting end address.
     * @returns {bigint}
     */
    _endAddress() {
      return BigInt(`0b${this.mask() + "1".repeat(constants2.BITS - this.subnetMask)}`);
    }
    /**
     * The last address in the range given by this address' subnet
     * Often referred to as the Broadcast
     * @returns {Address4}
     */
    endAddress() {
      return Address4.fromBigInt(this._endAddress());
    }
    /**
     * The last host address in the range given by this address's subnet ie
     * the last address prior to the Broadcast Address
     * @returns {Address4}
     */
    endAddressExclusive() {
      const adjust = BigInt("1");
      return Address4.fromBigInt(this._endAddress() - adjust);
    }
    /**
     * The dotted-decimal form of the subnet mask, e.g. `255.255.240.0` for
     * a `/20`. Returns an `Address4`; call `.correctForm()` for the string.
     * @returns {Address4}
     */
    subnetMaskAddress() {
      return Address4.fromBigInt(BigInt(`0b${"1".repeat(this.subnetMask)}${"0".repeat(constants2.BITS - this.subnetMask)}`));
    }
    /**
     * The Cisco-style wildcard mask, e.g. `0.0.0.255` for a `/24`. This is
     * the bitwise inverse of `subnetMaskAddress()`. Returns an `Address4`;
     * call `.correctForm()` for the string.
     * @returns {Address4}
     */
    wildcardMask() {
      return Address4.fromBigInt(BigInt(`0b${"0".repeat(this.subnetMask)}${"1".repeat(constants2.BITS - this.subnetMask)}`));
    }
    /**
     * The network address in CIDR string form, e.g. `192.168.1.0/24` for
     * `192.168.1.5/24`. For an address with no explicit subnet the prefix is
     * `/32`, e.g. `networkForm()` on `192.168.1.5` returns `192.168.1.5/32`.
     * @returns {string}
     */
    networkForm() {
      return `${this.startAddress().correctForm()}/${this.subnetMask}`;
    }
    /**
     * Converts a BigInt to a v4 address object. The value must be in the
     * range `[0, 2**32 - 1]`; otherwise `AddressError` is thrown.
     * @param {bigint} bigInt - a BigInt to convert
     * @returns {Address4}
     */
    static fromBigInt(bigInt) {
      if (bigInt < 0n || bigInt > 0xffffffffn) {
        throw new address_error_1.AddressError("IPv4 BigInt must be in the range 0 to 2**32 - 1");
      }
      return Address4.fromHex(bigInt.toString(16).padStart(8, "0"));
    }
    /**
     * Convert a byte array to an Address4 object.
     *
     * To convert from a Node.js `Buffer`, spread it: `Address4.fromByteArray([...buf])`.
     * @param {Array<number>} bytes - an array of 4 bytes (0-255)
     * @returns {Address4}
     */
    static fromByteArray(bytes) {
      if (bytes.length !== 4) {
        throw new address_error_1.AddressError("IPv4 addresses require exactly 4 bytes");
      }
      for (let i = 0; i < bytes.length; i++) {
        if (!Number.isInteger(bytes[i]) || bytes[i] < 0 || bytes[i] > 255) {
          throw new address_error_1.AddressError("All bytes must be integers between 0 and 255");
        }
      }
      return this.fromUnsignedByteArray(bytes);
    }
    /**
     * Convert an unsigned byte array to an Address4 object
     * @param {Array<number>} bytes - an array of 4 unsigned bytes (0-255)
     * @returns {Address4}
     */
    static fromUnsignedByteArray(bytes) {
      if (bytes.length !== 4) {
        throw new address_error_1.AddressError("IPv4 addresses require exactly 4 bytes");
      }
      const address = bytes.join(".");
      return new Address4(address);
    }
    /**
     * Returns the first n bits of the address, defaulting to the
     * subnet mask
     * @returns {String}
     */
    mask(mask) {
      if (mask === void 0) {
        mask = this.subnetMask;
      }
      return this.getBitsBase2(0, mask);
    }
    /**
     * Returns the bits in the given range as a base-2 string
     * @returns {string}
     */
    getBitsBase2(start, end) {
      return this.binaryZeroPad().slice(start, end);
    }
    /**
     * Return the reversed ip6.arpa form of the address
     * @param {Object} options
     * @param {boolean} options.omitSuffix - omit the "in-addr.arpa" suffix
     * @returns {String}
     */
    reverseForm(options) {
      if (!options) {
        options = {};
      }
      const reversed = this.correctForm().split(".").reverse().join(".");
      if (options.omitSuffix) {
        return reversed;
      }
      return `${reversed}.in-addr.arpa.`;
    }
    /**
     * Returns true if the given address is a multicast address
     * @returns {boolean}
     */
    isMulticast() {
      return this.isInSubnet(MULTICAST_V4);
    }
    /**
     * Returns true if the address is in one of the [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918) private address ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).
     * @returns {boolean}
     */
    isPrivate() {
      return PRIVATE_V4.some((subnet) => this.isInSubnet(subnet));
    }
    /**
     * Returns true if the address is in the loopback range `127.0.0.0/8` ([RFC 1122](https://datatracker.ietf.org/doc/html/rfc1122)).
     * @returns {boolean}
     */
    isLoopback() {
      return this.isInSubnet(LOOPBACK_V4);
    }
    /**
     * Returns true if the address is in the link-local range `169.254.0.0/16` ([RFC 3927](https://datatracker.ietf.org/doc/html/rfc3927)).
     * @returns {boolean}
     */
    isLinkLocal() {
      return this.isInSubnet(LINK_LOCAL_V4);
    }
    /**
     * Returns true if the address is the unspecified address `0.0.0.0`.
     * @returns {boolean}
     */
    isUnspecified() {
      return this.isInSubnet(UNSPECIFIED_V4);
    }
    /**
     * Returns true if the address is the limited broadcast address `255.255.255.255` ([RFC 919](https://datatracker.ietf.org/doc/html/rfc919)).
     * @returns {boolean}
     */
    isBroadcast() {
      return this.isInSubnet(BROADCAST_V4);
    }
    /**
     * Returns true if the address is in the carrier-grade NAT range `100.64.0.0/10` ([RFC 6598](https://datatracker.ietf.org/doc/html/rfc6598)).
     * @returns {boolean}
     */
    isCGNAT() {
      return this.isInSubnet(CGNAT_V4);
    }
    /**
     * Returns a zero-padded base-2 string representation of the address
     * @returns {string}
     */
    binaryZeroPad() {
      if (this._binaryZeroPad === void 0) {
        this._binaryZeroPad = this.bigInt().toString(2).padStart(constants2.BITS, "0");
      }
      return this._binaryZeroPad;
    }
    /**
     * Groups an IPv4 address for inclusion at the end of an IPv6 address
     * @returns {String}
     */
    groupForV6() {
      const segments = this.parsedAddress;
      return this.address.replace(constants2.RE_ADDRESS, `<span class="hover-group group-v4 group-6">${segments.slice(0, 2).join(".")}</span>.<span class="hover-group group-v4 group-7">${segments.slice(2, 4).join(".")}</span>`);
    }
  }
  ipv4.Address4 = Address4;
  const MULTICAST_V4 = new Address4("224.0.0.0/4");
  const PRIVATE_V4 = [
    new Address4("10.0.0.0/8"),
    new Address4("172.16.0.0/12"),
    new Address4("192.168.0.0/16")
  ];
  const LOOPBACK_V4 = new Address4("127.0.0.0/8");
  const LINK_LOCAL_V4 = new Address4("169.254.0.0/16");
  const UNSPECIFIED_V4 = new Address4("0.0.0.0/32");
  const BROADCAST_V4 = new Address4("255.255.255.255/32");
  const CGNAT_V4 = new Address4("100.64.0.0/10");
  return ipv4;
}
var ipv6 = {};
var constants = {};
var hasRequiredConstants;
function requireConstants() {
  if (hasRequiredConstants) return constants;
  hasRequiredConstants = 1;
  Object.defineProperty(constants, "__esModule", { value: true });
  constants.RE_URL_WITH_PORT = constants.RE_URL = constants.RE_ZONE_STRING = constants.RE_SUBNET_STRING = constants.RE_BAD_ADDRESS = constants.RE_BAD_CHARACTERS = constants.TYPES = constants.SCOPES = constants.GROUPS = constants.BITS = void 0;
  constants.BITS = 128;
  constants.GROUPS = 8;
  constants.SCOPES = {
    0: "Reserved",
    1: "Interface local",
    2: "Link local",
    4: "Admin local",
    5: "Site local",
    8: "Organization local",
    14: "Global",
    15: "Reserved"
  };
  constants.TYPES = {
    "ff01::1/128": "Multicast (All nodes on this interface)",
    "ff01::2/128": "Multicast (All routers on this interface)",
    "ff02::1/128": "Multicast (All nodes on this link)",
    "ff02::2/128": "Multicast (All routers on this link)",
    "ff05::2/128": "Multicast (All routers in this site)",
    "ff02::5/128": "Multicast (OSPFv3 AllSPF routers)",
    "ff02::6/128": "Multicast (OSPFv3 AllDR routers)",
    "ff02::9/128": "Multicast (RIP routers)",
    "ff02::a/128": "Multicast (EIGRP routers)",
    "ff02::d/128": "Multicast (PIM routers)",
    "ff02::16/128": "Multicast (MLDv2 reports)",
    "ff01::fb/128": "Multicast (mDNSv6)",
    "ff02::fb/128": "Multicast (mDNSv6)",
    "ff05::fb/128": "Multicast (mDNSv6)",
    "ff02::1:2/128": "Multicast (All DHCP servers and relay agents on this link)",
    "ff05::1:2/128": "Multicast (All DHCP servers and relay agents in this site)",
    "ff02::1:3/128": "Multicast (All DHCP servers on this link)",
    "ff05::1:3/128": "Multicast (All DHCP servers in this site)",
    "::/128": "Unspecified",
    "::1/128": "Loopback",
    "ff00::/8": "Multicast",
    "fe80::/10": "Link-local unicast",
    "fc00::/7": "Unique local",
    "2002::/16": "6to4",
    "2001:db8::/32": "Documentation",
    "64:ff9b::/96": "NAT64 (well-known)",
    "64:ff9b:1::/48": "NAT64 (local-use)"
  };
  constants.RE_BAD_CHARACTERS = /([^0-9a-f:/%])/gi;
  constants.RE_BAD_ADDRESS = /([0-9a-f]{5,}|:{3,}|[^:]:$|^:[^:]|\/$)/gi;
  constants.RE_SUBNET_STRING = /\/\d{1,3}(?=%|$)/;
  constants.RE_ZONE_STRING = /%.*$/;
  constants.RE_URL = /^\[{0,1}([0-9a-f:]+)\]{0,1}/;
  constants.RE_URL_WITH_PORT = /\[([0-9a-f:]+)\]:([0-9]{1,5})/;
  return constants;
}
var helpers = {};
var hasRequiredHelpers$1;
function requireHelpers$1() {
  if (hasRequiredHelpers$1) return helpers;
  hasRequiredHelpers$1 = 1;
  Object.defineProperty(helpers, "__esModule", { value: true });
  helpers.escapeHtml = escapeHtml;
  helpers.spanAllZeroes = spanAllZeroes;
  helpers.spanAll = spanAll;
  helpers.spanLeadingZeroes = spanLeadingZeroes;
  helpers.simpleGroup = simpleGroup;
  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function spanAllZeroes(s) {
    return escapeHtml(s).replace(/(0+)/g, '<span class="zero">$1</span>');
  }
  function spanAll(s, offset = 0) {
    const letters = s.split("");
    return letters.map((n, i) => `<span class="digit value-${escapeHtml(n)} position-${i + offset}">${spanAllZeroes(n)}</span>`).join("");
  }
  function spanLeadingZeroesSimple(group) {
    return escapeHtml(group).replace(/^(0+)/, '<span class="zero">$1</span>');
  }
  function spanLeadingZeroes(address) {
    const groups = address.split(":");
    return groups.map((g) => spanLeadingZeroesSimple(g)).join(":");
  }
  function simpleGroup(addressString, offset = 0) {
    const groups = addressString.split(":");
    return groups.map((g, i) => {
      if (/group-v4/.test(g)) {
        return g;
      }
      return `<span class="hover-group group-${i + offset}">${spanLeadingZeroesSimple(g)}</span>`;
    });
  }
  return helpers;
}
var regularExpressions = {};
var hasRequiredRegularExpressions;
function requireRegularExpressions() {
  if (hasRequiredRegularExpressions) return regularExpressions;
  hasRequiredRegularExpressions = 1;
  var __createBinding = regularExpressions && regularExpressions.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = regularExpressions && regularExpressions.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = regularExpressions && regularExpressions.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(regularExpressions, "__esModule", { value: true });
  regularExpressions.ADDRESS_BOUNDARY = void 0;
  regularExpressions.groupPossibilities = groupPossibilities;
  regularExpressions.padGroup = padGroup;
  regularExpressions.simpleRegularExpression = simpleRegularExpression;
  regularExpressions.possibleElisions = possibleElisions;
  const v6 = __importStar(/* @__PURE__ */ requireConstants());
  function groupPossibilities(possibilities) {
    return `(${possibilities.join("|")})`;
  }
  function padGroup(group) {
    if (group.length < 4) {
      return `0{0,${4 - group.length}}${group}`;
    }
    return group;
  }
  regularExpressions.ADDRESS_BOUNDARY = "[^A-Fa-f0-9:]";
  function simpleRegularExpression(groups) {
    const zeroIndexes = [];
    groups.forEach((group, i) => {
      const groupInteger = parseInt(group, 16);
      if (groupInteger === 0) {
        zeroIndexes.push(i);
      }
    });
    const possibilities = zeroIndexes.map((zeroIndex) => groups.map((group, i) => {
      if (i === zeroIndex) {
        const elision = i === 0 || i === v6.GROUPS - 1 ? ":" : "";
        return groupPossibilities([padGroup(group), elision]);
      }
      return padGroup(group);
    }).join(":"));
    possibilities.push(groups.map(padGroup).join(":"));
    return groupPossibilities(possibilities);
  }
  function possibleElisions(elidedGroups, moreLeft, moreRight) {
    const left = moreLeft ? "" : ":";
    const right = moreRight ? "" : ":";
    const possibilities = [];
    if (!moreLeft && !moreRight) {
      possibilities.push("::");
    }
    if (moreLeft && moreRight) {
      possibilities.push("");
    }
    if (moreRight && !moreLeft || !moreRight && moreLeft) {
      possibilities.push(":");
    }
    possibilities.push(`${left}(:0{1,4}){1,${elidedGroups - 1}}`);
    possibilities.push(`(0{1,4}:){1,${elidedGroups - 1}}${right}`);
    possibilities.push(`(0{1,4}:){${elidedGroups - 1}}0{1,4}`);
    for (let groups = 1; groups < elidedGroups - 1; groups++) {
      for (let position = 1; position < elidedGroups - groups; position++) {
        possibilities.push(`(0{1,4}:){${position}}:(0{1,4}:){${elidedGroups - position - groups - 1}}0{1,4}`);
      }
    }
    return groupPossibilities(possibilities);
  }
  return regularExpressions;
}
var hasRequiredIpv6;
function requireIpv6() {
  if (hasRequiredIpv6) return ipv6;
  hasRequiredIpv6 = 1;
  var __createBinding = ipv6 && ipv6.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = ipv6 && ipv6.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = ipv6 && ipv6.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(ipv6, "__esModule", { value: true });
  ipv6.Address6 = void 0;
  const common2 = __importStar(/* @__PURE__ */ requireCommon());
  const constants4 = __importStar(/* @__PURE__ */ requireConstants$1());
  const constants6 = __importStar(/* @__PURE__ */ requireConstants());
  const helpers2 = __importStar(/* @__PURE__ */ requireHelpers$1());
  const ipv4_1 = /* @__PURE__ */ requireIpv4();
  const regular_expressions_1 = /* @__PURE__ */ requireRegularExpressions();
  const address_error_1 = /* @__PURE__ */ requireAddressError();
  const common_1 = /* @__PURE__ */ requireCommon();
  const isCorrect6 = common2.isCorrect(constants6.BITS);
  function assert(condition) {
    if (!condition) {
      throw new Error("Assertion failed.");
    }
  }
  function addCommas(number) {
    const r = /(\d+)(\d{3})/;
    while (r.test(number)) {
      number = number.replace(r, "$1,$2");
    }
    return number;
  }
  function spanLeadingZeroes4(n) {
    n = n.replace(/^(0{1,})([1-9]+)$/, '<span class="parse-error">$1</span>$2');
    n = n.replace(/^(0{1,})(0)$/, '<span class="parse-error">$1</span>$2');
    return n;
  }
  function compact(address, slice) {
    const s1 = [];
    const s2 = [];
    let i;
    for (i = 0; i < address.length; i++) {
      if (i < slice[0]) {
        s1.push(address[i]);
      } else if (i > slice[1]) {
        s2.push(address[i]);
      }
    }
    return s1.concat(["compact"]).concat(s2);
  }
  function paddedHex(octet) {
    return parseInt(octet, 16).toString(16).padStart(4, "0");
  }
  function unsignByte(b) {
    return b & 255;
  }
  class Address6 {
    constructor(address, optionalGroups) {
      this.addressMinusSuffix = "";
      this.parsedSubnet = "";
      this.subnet = "/128";
      this.subnetMask = 128;
      this.v4 = false;
      this.zone = "";
      this.isInSubnet = common2.isInSubnet;
      this.isCorrect = isCorrect6;
      if (optionalGroups === void 0) {
        this.groups = constants6.GROUPS;
      } else {
        this.groups = optionalGroups;
      }
      this.address = address;
      const subnet = constants6.RE_SUBNET_STRING.exec(address);
      if (subnet) {
        this.parsedSubnet = subnet[0].replace("/", "");
        this.subnetMask = parseInt(this.parsedSubnet, 10);
        this.subnet = `/${this.subnetMask}`;
        if (Number.isNaN(this.subnetMask) || this.subnetMask < 0 || this.subnetMask > constants6.BITS) {
          throw new address_error_1.AddressError("Invalid subnet mask.");
        }
        address = address.replace(constants6.RE_SUBNET_STRING, "");
      } else if (/\//.test(address)) {
        throw new address_error_1.AddressError("Invalid subnet mask.");
      }
      const zone = constants6.RE_ZONE_STRING.exec(address);
      if (zone) {
        this.zone = zone[0];
        address = address.replace(constants6.RE_ZONE_STRING, "");
      }
      this.addressMinusSuffix = address;
      this.parsedAddress = this.parse(this.addressMinusSuffix);
    }
    /**
     * Returns true if the given string is a valid IPv6 address (with optional
     * CIDR subnet and zone identifier), false otherwise. Host bits in the
     * subnet portion are allowed (e.g. `2001:db8::1/32` is valid); for strict
     * network-address validation compare `correctForm()` to
     * `startAddress().correctForm()`, or use `networkForm()`.
     */
    static isValid(address) {
      try {
        new Address6(address);
        return true;
      } catch (e) {
        return false;
      }
    }
    /**
     * Convert a BigInt to a v6 address object. The value must be in the
     * range `[0, 2**128 - 1]`; otherwise `AddressError` is thrown.
     * @param {bigint} bigInt - a BigInt to convert
     * @returns {Address6}
     * @example
     * var bigInt = BigInt('1000000000000');
     * var address = Address6.fromBigInt(bigInt);
     * address.correctForm(); // '::e8:d4a5:1000'
     */
    static fromBigInt(bigInt) {
      if (bigInt < 0n || bigInt > (1n << BigInt(constants6.BITS)) - 1n) {
        throw new address_error_1.AddressError("IPv6 BigInt must be in the range 0 to 2**128 - 1");
      }
      const hex = bigInt.toString(16).padStart(32, "0");
      const groups = [];
      for (let i = 0; i < constants6.GROUPS; i++) {
        groups.push(hex.slice(i * 4, (i + 1) * 4));
      }
      return new Address6(groups.join(":"));
    }
    /**
     * Parse a URL (with optional bracketed host and port) into an address and
     * port. Returns either `{ address, port }` on success or
     * `{ error, address: null, port: null }` if the URL could not be parsed.
     * Ports are returned as numbers (or `null` if absent or out of range).
     * @example
     * var addressAndPort = Address6.fromURL('http://[ffff::]:8080/foo/');
     * addressAndPort.address.correctForm(); // 'ffff::'
     * addressAndPort.port; // 8080
     */
    static fromURL(url) {
      let host;
      let port = null;
      let result;
      if (url.indexOf("[") !== -1 && url.indexOf("]:") !== -1) {
        result = constants6.RE_URL_WITH_PORT.exec(url);
        if (result === null) {
          return {
            error: "failed to parse address with port",
            address: null,
            port: null
          };
        }
        host = result[1];
        port = result[2];
      } else if (url.indexOf("/") !== -1) {
        url = url.replace(/^[a-z0-9]+:\/\//, "");
        result = constants6.RE_URL.exec(url);
        if (result === null) {
          return {
            error: "failed to parse address from URL",
            address: null,
            port: null
          };
        }
        host = result[1];
      } else {
        host = url;
      }
      if (port) {
        port = parseInt(port, 10);
        if (port < 0 || port > 65536) {
          port = null;
        }
      } else {
        port = null;
      }
      return {
        address: new Address6(host),
        port
      };
    }
    /**
     * Construct an `Address6` from an address and a hex subnet mask given as
     * separate strings (e.g. as returned by Node's `os.networkInterfaces()`).
     * Throws `AddressError` if the mask is non-contiguous (e.g.
     * `ffff::ffff`).
     * @example
     * var address = Address6.fromAddressAndMask('fe80::1', 'ffff:ffff:ffff:ffff::');
     * address.subnetMask; // 64
     */
    static fromAddressAndMask(address, mask) {
      const bits = common2.prefixLengthFromMask(new Address6(mask).bigInt(), constants6.BITS);
      return new Address6(`${address}/${bits}`);
    }
    /**
     * Construct an `Address6` from an address and a Cisco-style wildcard mask
     * given as separate strings (e.g. `::ffff:ffff:ffff:ffff` for a `/64`).
     * The wildcard mask is the bitwise inverse of the subnet mask. Throws
     * `AddressError` if the mask is non-contiguous.
     * @example
     * var address = Address6.fromAddressAndWildcardMask('fe80::1', '::ffff:ffff:ffff:ffff');
     * address.subnetMask; // 64
     */
    static fromAddressAndWildcardMask(address, wildcardMask) {
      const wildcard = new Address6(wildcardMask).bigInt();
      const allOnes = (BigInt(1) << BigInt(constants6.BITS)) - BigInt(1);
      const mask = wildcard ^ allOnes;
      const bits = common2.prefixLengthFromMask(mask, constants6.BITS);
      return new Address6(`${address}/${bits}`);
    }
    /**
     * Construct an `Address6` from a wildcard pattern with trailing `*`
     * groups. The number of trailing wildcards determines the prefix
     * length: each `*` represents 16 bits. `::` is expanded to zero groups
     * (not wildcards) before evaluating trailing wildcards.
     *
     * Only trailing whole-group wildcards are supported. Partial-group
     * wildcards (e.g. `2001:db8::0*`) and interior wildcards (e.g.
     * `*::1`) throw `AddressError`.
     * @example
     * Address6.fromWildcard('2001:db8:*:*:*:*:*:*').subnet;  // '/32'
     * Address6.fromWildcard('2001:db8::*').subnet;           // '/112'
     * Address6.fromWildcard('*:*:*:*:*:*:*:*').subnet;       // '/0'
     */
    static fromWildcard(input) {
      if (input.includes("%") || input.includes("/")) {
        throw new address_error_1.AddressError("Wildcard pattern must not include a zone or CIDR suffix");
      }
      const halves = input.split("::");
      if (halves.length > 2) {
        throw new address_error_1.AddressError("Wildcard pattern cannot contain more than one '::'");
      }
      let groups;
      if (halves.length === 2) {
        const left = halves[0] === "" ? [] : halves[0].split(":");
        const right = halves[1] === "" ? [] : halves[1].split(":");
        const remaining = constants6.GROUPS - left.length - right.length;
        if (remaining < 1) {
          throw new address_error_1.AddressError("Wildcard pattern with '::' has too many groups");
        }
        groups = [...left, ...new Array(remaining).fill("0"), ...right];
      } else {
        groups = input.split(":");
      }
      if (groups.length !== constants6.GROUPS) {
        throw new address_error_1.AddressError("Wildcard pattern must have 8 groups");
      }
      let firstWildcard = -1;
      for (let i = 0; i < groups.length; i++) {
        if (groups[i] === "*") {
          if (firstWildcard === -1) {
            firstWildcard = i;
          }
        } else if (firstWildcard !== -1) {
          throw new address_error_1.AddressError("Wildcard `*` must only appear in trailing groups (e.g. `2001:db8:*:*:*:*:*:*`)");
        }
      }
      const trailing = firstWildcard === -1 ? 0 : groups.length - firstWildcard;
      const replaced = groups.map((g) => g === "*" ? "0" : g);
      const subnetBits = constants6.BITS - trailing * 16;
      return new Address6(`${replaced.join(":")}/${subnetBits}`);
    }
    /**
     * Create an IPv6-mapped address given an IPv4 address
     * @param {string} address - An IPv4 address string
     * @returns {Address6}
     * @example
     * var address = Address6.fromAddress4('192.168.0.1');
     * address.correctForm(); // '::ffff:c0a8:1'
     * address.to4in6(); // '::ffff:192.168.0.1'
     */
    static fromAddress4(address) {
      const address4 = new ipv4_1.Address4(address);
      const mask6 = constants6.BITS - (constants4.BITS - address4.subnetMask);
      return new Address6(`::ffff:${address4.correctForm()}/${mask6}`);
    }
    /**
     * Return an address from ip6.arpa form
     * @param {string} arpaFormAddress - an 'ip6.arpa' form address
     * @returns {Adress6}
     * @example
     * var address = Address6.fromArpa(e.f.f.f.3.c.2.6.f.f.f.e.6.6.8.e.1.0.6.7.9.4.e.c.0.0.0.0.1.0.0.2.ip6.arpa.)
     * address.correctForm(); // '2001:0:ce49:7601:e866:efff:62c3:fffe'
     */
    static fromArpa(arpaFormAddress) {
      let address = arpaFormAddress.replace(/(\.ip6\.arpa)?\.$/, "");
      const semicolonAmount = 7;
      if (address.length !== 63) {
        throw new address_error_1.AddressError("Invalid 'ip6.arpa' form.");
      }
      const parts = address.split(".").reverse();
      for (let i = semicolonAmount; i > 0; i--) {
        const insertIndex = i * 4;
        parts.splice(insertIndex, 0, ":");
      }
      address = parts.join("");
      return new Address6(address);
    }
    /**
     * Return the Microsoft UNC transcription of the address
     * @returns {String} the Microsoft UNC transcription of the address
     */
    microsoftTranscription() {
      return `${this.correctForm().replace(/:/g, "-")}.ipv6-literal.net`;
    }
    /**
     * Return the first n bits of the address, defaulting to the subnet mask
     * @param {number} [mask=subnet] - the number of bits to mask
     * @returns {String} the first n bits of the address as a string
     */
    mask(mask = this.subnetMask) {
      return this.getBitsBase2(0, mask);
    }
    /**
     * Return the number of possible subnets of a given size in the address
     * @param {number} [subnetSize=128] - the subnet size
     * @returns {String}
     */
    // TODO: probably useful to have a numeric version of this too
    possibleSubnets(subnetSize = 128) {
      const availableBits = constants6.BITS - this.subnetMask;
      const subnetBits = Math.abs(subnetSize - constants6.BITS);
      const subnetPowers = availableBits - subnetBits;
      if (subnetPowers < 0) {
        return "0";
      }
      return addCommas((BigInt("2") ** BigInt(subnetPowers)).toString(10));
    }
    /**
     * Helper function getting start address.
     * @returns {bigint}
     */
    _startAddress() {
      return BigInt(`0b${this.mask() + "0".repeat(constants6.BITS - this.subnetMask)}`);
    }
    /**
     * The first address in the range given by this address' subnet
     * Often referred to as the Network Address.
     * @returns {Address6}
     */
    startAddress() {
      return Address6.fromBigInt(this._startAddress());
    }
    /**
     * The first host address in the range given by this address's subnet ie
     * the first address after the Network Address
     * @returns {Address6}
     */
    startAddressExclusive() {
      const adjust = BigInt("1");
      return Address6.fromBigInt(this._startAddress() + adjust);
    }
    /**
     * Helper function getting end address.
     * @returns {bigint}
     */
    _endAddress() {
      return BigInt(`0b${this.mask() + "1".repeat(constants6.BITS - this.subnetMask)}`);
    }
    /**
     * The last address in the range given by this address' subnet
     * Often referred to as the Broadcast
     * @returns {Address6}
     */
    endAddress() {
      return Address6.fromBigInt(this._endAddress());
    }
    /**
     * The last host address in the range given by this address's subnet ie
     * the last address prior to the Broadcast Address
     * @returns {Address6}
     */
    endAddressExclusive() {
      const adjust = BigInt("1");
      return Address6.fromBigInt(this._endAddress() - adjust);
    }
    /**
     * The hex form of the subnet mask, e.g. `ffff:ffff:ffff:ffff::` for a
     * `/64`. Returns an `Address6`; call `.correctForm()` for the string.
     * @returns {Address6}
     */
    subnetMaskAddress() {
      return Address6.fromBigInt(BigInt(`0b${"1".repeat(this.subnetMask)}${"0".repeat(constants6.BITS - this.subnetMask)}`));
    }
    /**
     * The Cisco-style wildcard mask, e.g. `::ffff:ffff:ffff:ffff` for a
     * `/64`. This is the bitwise inverse of `subnetMaskAddress()`. Returns
     * an `Address6`; call `.correctForm()` for the string.
     * @returns {Address6}
     */
    wildcardMask() {
      return Address6.fromBigInt(BigInt(`0b${"0".repeat(this.subnetMask)}${"1".repeat(constants6.BITS - this.subnetMask)}`));
    }
    /**
     * The network address in CIDR string form, e.g. `2001:db8::/32` for
     * `2001:db8::1/32`. For an address with no explicit subnet the prefix
     * is `/128`, e.g. `networkForm()` on `2001:db8::1` returns
     * `2001:db8::1/128`.
     * @returns {string}
     */
    networkForm() {
      return `${this.startAddress().correctForm()}/${this.subnetMask}`;
    }
    /**
     * Return the scope of the address. The 4-bit scope field
     * ([RFC 4291 §2.7](https://datatracker.ietf.org/doc/html/rfc4291#section-2.7))
     * is only defined for multicast addresses; for unicast addresses the scope
     * is derived from the address type per
     * [RFC 4007 §6](https://datatracker.ietf.org/doc/html/rfc4007#section-6).
     * @returns {String}
     */
    getScope() {
      const type = this.getType();
      if (type === "Multicast" || type.startsWith("Multicast ")) {
        const scope = constants6.SCOPES[parseInt(this.getBits(12, 16).toString(10), 10)];
        return scope || "Unknown";
      }
      if (type === "Link-local unicast" || type === "Loopback") {
        return "Link local";
      }
      if (type === "Unspecified") {
        return "Unknown";
      }
      return "Global";
    }
    /**
     * Return the type of the address
     * @returns {String}
     */
    getType() {
      for (let i = 0; i < TYPE_SUBNETS.length; i++) {
        const entry = TYPE_SUBNETS[i];
        if (this.isInSubnet(entry[0])) {
          return entry[1];
        }
      }
      return "Global unicast";
    }
    /**
     * Return the bits in the given range as a BigInt
     * @returns {bigint}
     */
    getBits(start, end) {
      return BigInt(`0b${this.getBitsBase2(start, end)}`);
    }
    /**
     * Return the bits in the given range as a base-2 string
     * @returns {String}
     */
    getBitsBase2(start, end) {
      return this.binaryZeroPad().slice(start, end);
    }
    /**
     * Return the bits in the given range as a base-16 string
     * @returns {String}
     */
    getBitsBase16(start, end) {
      const length = end - start;
      if (length % 4 !== 0) {
        throw new Error("Length of bits to retrieve must be divisible by four");
      }
      return this.getBits(start, end).toString(16).padStart(length / 4, "0");
    }
    /**
     * Return the bits that are set past the subnet mask length
     * @returns {String}
     */
    getBitsPastSubnet() {
      return this.getBitsBase2(this.subnetMask, constants6.BITS);
    }
    /**
     * Return the reversed ip6.arpa form of the address
     * @param {Object} options
     * @param {boolean} options.omitSuffix - omit the "ip6.arpa" suffix
     * @returns {String}
     */
    reverseForm(options) {
      if (!options) {
        options = {};
      }
      const characters = Math.floor(this.subnetMask / 4);
      const reversed = this.canonicalForm().replace(/:/g, "").split("").slice(0, characters).reverse().join(".");
      if (characters > 0) {
        if (options.omitSuffix) {
          return reversed;
        }
        return `${reversed}.ip6.arpa.`;
      }
      if (options.omitSuffix) {
        return "";
      }
      return "ip6.arpa.";
    }
    /**
     * Returns the address in correct form, per
     * [RFC 5952](https://datatracker.ietf.org/doc/html/rfc5952): leading zeros
     * stripped, the longest run of zero groups collapsed to `::`, and hex digits
     * lowercased (e.g. `2001:db8::1`). This is the recommended form for display.
     */
    correctForm() {
      let i;
      let groups = [];
      let zeroCounter = 0;
      const zeroes = [];
      for (i = 0; i < this.parsedAddress.length; i++) {
        const value = parseInt(this.parsedAddress[i], 16);
        if (value === 0) {
          zeroCounter++;
        }
        if (value !== 0 && zeroCounter > 0) {
          if (zeroCounter > 1) {
            zeroes.push([i - zeroCounter, i - 1]);
          }
          zeroCounter = 0;
        }
      }
      if (zeroCounter > 1) {
        zeroes.push([this.parsedAddress.length - zeroCounter, this.parsedAddress.length - 1]);
      }
      const zeroLengths = zeroes.map((n) => n[1] - n[0] + 1);
      if (zeroes.length > 0) {
        const index = zeroLengths.indexOf(Math.max(...zeroLengths));
        groups = compact(this.parsedAddress, zeroes[index]);
      } else {
        groups = this.parsedAddress;
      }
      for (i = 0; i < groups.length; i++) {
        if (groups[i] !== "compact") {
          groups[i] = parseInt(groups[i], 16).toString(16);
        }
      }
      let correct = groups.join(":");
      correct = correct.replace(/^compact$/, "::");
      correct = correct.replace(/(^compact)|(compact$)/, ":");
      correct = correct.replace(/compact/, "");
      return correct;
    }
    /**
     * Return a zero-padded base-2 string representation of the address
     * @returns {String}
     * @example
     * var address = new Address6('2001:4860:4001:803::1011');
     * address.binaryZeroPad();
     * // '0010000000000001010010000110000001000000000000010000100000000011
     * //  0000000000000000000000000000000000000000000000000001000000010001'
     */
    binaryZeroPad() {
      if (this._binaryZeroPad === void 0) {
        this._binaryZeroPad = this.bigInt().toString(2).padStart(constants6.BITS, "0");
      }
      return this._binaryZeroPad;
    }
    /**
     * Parses a v4-in-v6 string (e.g. `::ffff:192.168.0.1`) by extracting the
     * trailing IPv4 address into `this.address4` / `this.parsedAddress4` and
     * returning the address with the v4 portion converted to two v6 groups.
     * Used internally by `parse()`.
     */
    // TODO: Improve the semantics of this helper function
    parse4in6(address) {
      if (address.indexOf(".") === -1) {
        return address;
      }
      const groups = address.split(":");
      const lastGroup = groups.slice(-1)[0];
      const address4 = lastGroup.match(constants4.RE_ADDRESS);
      if (address4) {
        this.parsedAddress4 = address4[0];
        this.address4 = new ipv4_1.Address4(this.parsedAddress4);
        for (let i = 0; i < this.address4.groups; i++) {
          if (/^0[0-9]+/.test(this.address4.parsedAddress[i])) {
            const highlighted = this.address4.parsedAddress.map(spanLeadingZeroes4).join(".");
            const prefix = groups.slice(0, -1).map(helpers2.escapeHtml).join(":");
            const separator = groups.length > 1 ? ":" : "";
            throw new address_error_1.AddressError("IPv4 addresses can't have leading zeroes.", `${prefix}${separator}${highlighted}`);
          }
        }
        this.v4 = true;
        groups[groups.length - 1] = this.address4.toGroup6();
        address = groups.join(":");
      }
      return address;
    }
    /**
     * Parses an IPv6 address string into its 8 hexadecimal groups (expanding
     * any `::` elision and any trailing v4-in-v6 portion) and stores the result
     * on `this.parsedAddress`. Called automatically by the constructor; you
     * typically don't need to call it directly. Throws `AddressError` if the
     * input is malformed.
     */
    // TODO: Make private?
    parse(address) {
      address = this.parse4in6(address);
      const badCharacters = address.match(constants6.RE_BAD_CHARACTERS);
      if (badCharacters) {
        throw new address_error_1.AddressError(`Bad character${badCharacters.length > 1 ? "s" : ""} detected in address: ${badCharacters.join("")}`, address.replace(constants6.RE_BAD_CHARACTERS, '<span class="parse-error">$1</span>'));
      }
      const badAddress = address.match(constants6.RE_BAD_ADDRESS);
      if (badAddress) {
        throw new address_error_1.AddressError(`Address failed regex: ${badAddress.join("")}`, address.replace(constants6.RE_BAD_ADDRESS, '<span class="parse-error">$1</span>'));
      }
      let groups = [];
      const halves = address.split("::");
      if (halves.length === 2) {
        let first = halves[0].split(":");
        let last = halves[1].split(":");
        if (first.length === 1 && first[0] === "") {
          first = [];
        }
        if (last.length === 1 && last[0] === "") {
          last = [];
        }
        const remaining = this.groups - (first.length + last.length);
        if (!remaining) {
          throw new address_error_1.AddressError("Error parsing groups");
        }
        this.elidedGroups = remaining;
        this.elisionBegin = first.length;
        this.elisionEnd = first.length + this.elidedGroups;
        groups = groups.concat(first);
        for (let i = 0; i < remaining; i++) {
          groups.push("0");
        }
        groups = groups.concat(last);
      } else if (halves.length === 1) {
        groups = address.split(":");
        this.elidedGroups = 0;
      } else {
        throw new address_error_1.AddressError("Too many :: groups found");
      }
      groups = groups.map((group) => parseInt(group, 16).toString(16));
      if (groups.length !== this.groups) {
        throw new address_error_1.AddressError("Incorrect number of groups found");
      }
      return groups;
    }
    /**
     * Returns the canonical (fully expanded) form of the address: all 8 groups,
     * each padded to 4 hex digits, with no `::` collapsing
     * (e.g. `2001:0db8:0000:0000:0000:0000:0000:0001`). Useful for sorting and
     * byte-exact comparison.
     */
    canonicalForm() {
      return this.parsedAddress.map(paddedHex).join(":");
    }
    /**
     * Return the decimal form of the address
     * @returns {String}
     */
    decimal() {
      return this.parsedAddress.map((n) => parseInt(n, 16).toString(10).padStart(5, "0")).join(":");
    }
    /**
     * Return the address as a BigInt
     * @returns {bigint}
     */
    bigInt() {
      return BigInt(`0x${this.parsedAddress.map(paddedHex).join("")}`);
    }
    /**
     * Return the last two groups of this address as an IPv4 address string
     * @returns {Address4}
     * @example
     * var address = new Address6('2001:4860:4001::1825:bf11');
     * address.to4().correctForm(); // '24.37.191.17'
     */
    to4() {
      const binary = this.binaryZeroPad().split("");
      return ipv4_1.Address4.fromHex(BigInt(`0b${binary.slice(96, 128).join("")}`).toString(16).padStart(8, "0"));
    }
    /**
     * Return the v4-in-v6 form of the address
     * @returns {String}
     */
    to4in6() {
      const address4 = this.to4();
      const address6 = new Address6(this.parsedAddress.slice(0, 6).join(":"), 6);
      const correct = address6.correctForm();
      let infix = "";
      if (!/:$/.test(correct)) {
        infix = ":";
      }
      return correct + infix + address4.address;
    }
    /**
     * Decodes the Teredo tunneling fields embedded in this address. Returns the
     * Teredo prefix, server IPv4, client IPv4, raw flag bits, cone-NAT flag,
     * UDP port, and Microsoft-format flag breakdown (reserved, universal/local,
     * group/individual, nonce). Only meaningful for addresses in `2001::/32`.
     */
    inspectTeredo() {
      const prefix = this.getBitsBase16(0, 32);
      const bitsForUdpPort = this.getBits(80, 96);
      const udpPort = (bitsForUdpPort ^ BigInt("0xffff")).toString();
      const server4 = ipv4_1.Address4.fromHex(this.getBitsBase16(32, 64));
      const bitsForClient4 = this.getBits(96, 128);
      const client4 = ipv4_1.Address4.fromHex((bitsForClient4 ^ BigInt("0xffffffff")).toString(16).padStart(8, "0"));
      const flagsBase2 = this.getBitsBase2(64, 80);
      const coneNat = (0, common_1.testBit)(flagsBase2, 15);
      const reserved = (0, common_1.testBit)(flagsBase2, 14);
      const groupIndividual = (0, common_1.testBit)(flagsBase2, 8);
      const universalLocal = (0, common_1.testBit)(flagsBase2, 9);
      const nonce = BigInt(`0b${flagsBase2.slice(2, 6) + flagsBase2.slice(8, 16)}`).toString(10);
      return {
        prefix: `${prefix.slice(0, 4)}:${prefix.slice(4, 8)}`,
        server4: server4.address,
        client4: client4.address,
        flags: flagsBase2,
        coneNat,
        microsoft: {
          reserved,
          universalLocal,
          groupIndividual,
          nonce
        },
        udpPort
      };
    }
    /**
     * Decodes the 6to4 tunneling fields embedded in this address. Returns the
     * 6to4 prefix and the embedded IPv4 gateway address. Only meaningful for
     * addresses in `2002::/16`.
     */
    inspect6to4() {
      const prefix = this.getBitsBase16(0, 16);
      const gateway = ipv4_1.Address4.fromHex(this.getBitsBase16(16, 48));
      return {
        prefix: prefix.slice(0, 4),
        gateway: gateway.address
      };
    }
    /**
     * Return a v6 6to4 address from a v6 v4inv6 address
     * @returns {Address6}
     */
    to6to4() {
      if (!this.is4()) {
        return null;
      }
      const addr6to4 = [
        "2002",
        this.getBitsBase16(96, 112),
        this.getBitsBase16(112, 128),
        "",
        "/16"
      ].join(":");
      return new Address6(addr6to4);
    }
    /**
     * Embed an IPv4 address into a NAT64 IPv6 address using the encoding
     * defined by [RFC 6052](https://datatracker.ietf.org/doc/html/rfc6052).
     * The default prefix is the well-known prefix `64:ff9b::/96`. The prefix
     * length must be one of 32, 40, 48, 56, 64, or 96; for prefixes shorter
     * than /64 the IPv4 octets are split around the reserved bits 64–71.
     * @example
     * Address6.fromAddress4Nat64('192.0.2.33').correctForm(); // '64:ff9b::c000:221'
     * Address6.fromAddress4Nat64('192.0.2.33', '2001:db8::/32').correctForm(); // '2001:db8:c000:221::'
     */
    static fromAddress4Nat64(address, prefix = "64:ff9b::/96") {
      const v4 = new ipv4_1.Address4(address);
      const prefix6 = new Address6(prefix);
      const pl = prefix6.subnetMask;
      if (pl !== 32 && pl !== 40 && pl !== 48 && pl !== 56 && pl !== 64 && pl !== 96) {
        throw new address_error_1.AddressError("NAT64 prefix length must be 32, 40, 48, 56, 64, or 96");
      }
      const prefixBits = prefix6.binaryZeroPad();
      const v4Bits = v4.binaryZeroPad();
      let bits;
      if (pl === 96) {
        bits = prefixBits.slice(0, 96) + v4Bits;
      } else {
        const beforeU = 64 - pl;
        bits = prefixBits.slice(0, pl) + v4Bits.slice(0, beforeU) + "00000000" + v4Bits.slice(beforeU) + "0".repeat(128 - 72 - (32 - beforeU));
      }
      const hex = BigInt(`0b${bits}`).toString(16).padStart(32, "0");
      const groups = [];
      for (let i = 0; i < 8; i++) {
        groups.push(hex.slice(i * 4, (i + 1) * 4));
      }
      return new Address6(groups.join(":"));
    }
    /**
     * Extract the embedded IPv4 address from a NAT64 IPv6 address using the
     * encoding defined by [RFC 6052](https://datatracker.ietf.org/doc/html/rfc6052).
     * The default prefix is the well-known prefix `64:ff9b::/96`. Returns
     * `null` if this address is not contained within the given prefix.
     * @example
     * new Address6('64:ff9b::c000:221').toAddress4Nat64()!.correctForm(); // '192.0.2.33'
     */
    toAddress4Nat64(prefix = "64:ff9b::/96") {
      const prefix6 = new Address6(prefix);
      const pl = prefix6.subnetMask;
      if (pl !== 32 && pl !== 40 && pl !== 48 && pl !== 56 && pl !== 64 && pl !== 96) {
        throw new address_error_1.AddressError("NAT64 prefix length must be 32, 40, 48, 56, 64, or 96");
      }
      if (!this.isInSubnet(prefix6)) {
        return null;
      }
      const bits = this.binaryZeroPad();
      let v4Bits;
      if (pl === 96) {
        v4Bits = bits.slice(96, 128);
      } else {
        const beforeU = 64 - pl;
        v4Bits = bits.slice(pl, pl + beforeU) + bits.slice(72, 72 + (32 - beforeU));
      }
      const octets = [];
      for (let i = 0; i < 4; i++) {
        octets.push(parseInt(v4Bits.slice(i * 8, (i + 1) * 8), 2).toString());
      }
      return new ipv4_1.Address4(octets.join("."));
    }
    /**
     * Return a byte array.
     *
     * To get a Node.js `Buffer`, wrap the result: `Buffer.from(address.toByteArray())`.
     * @returns {Array}
     */
    toByteArray() {
      const valueWithoutPadding = this.bigInt().toString(16);
      const leadingPad = "0".repeat(valueWithoutPadding.length % 2);
      const value = `${leadingPad}${valueWithoutPadding}`;
      const bytes = [];
      for (let i = 0, length = value.length; i < length; i += 2) {
        bytes.push(parseInt(value.substring(i, i + 2), 16));
      }
      return bytes;
    }
    /**
     * Return an unsigned byte array.
     *
     * To get a Node.js `Buffer`, wrap the result: `Buffer.from(address.toUnsignedByteArray())`.
     * @returns {Array}
     */
    toUnsignedByteArray() {
      return this.toByteArray().map(unsignByte);
    }
    /**
     * Convert a byte array to an Address6 object.
     *
     * To convert from a Node.js `Buffer`, spread it: `Address6.fromByteArray([...buf])`.
     * @returns {Address6}
     */
    static fromByteArray(bytes) {
      return this.fromUnsignedByteArray(bytes.map(unsignByte));
    }
    /**
     * Convert an unsigned byte array to an Address6 object.
     *
     * To convert from a Node.js `Buffer`, spread it: `Address6.fromUnsignedByteArray([...buf])`.
     * @returns {Address6}
     */
    static fromUnsignedByteArray(bytes) {
      const BYTE_MAX = BigInt("256");
      let result = BigInt("0");
      let multiplier = BigInt("1");
      for (let i = bytes.length - 1; i >= 0; i--) {
        result += multiplier * BigInt(bytes[i].toString(10));
        multiplier *= BYTE_MAX;
      }
      return Address6.fromBigInt(result);
    }
    /**
     * Returns true if the address is in the canonical form, false otherwise
     * @returns {boolean}
     */
    isCanonical() {
      return this.addressMinusSuffix === this.canonicalForm();
    }
    /**
     * Returns true if the address is a link local address, false otherwise
     * @returns {boolean}
     */
    isLinkLocal() {
      if (this.getBitsBase2(0, 64) === "1111111010000000000000000000000000000000000000000000000000000000") {
        return true;
      }
      return false;
    }
    /**
     * Returns true if the address is a multicast address, false otherwise
     * @returns {boolean}
     */
    isMulticast() {
      const type = this.getType();
      return type === "Multicast" || type.startsWith("Multicast ");
    }
    /**
     * Returns true if the address was written in v4-in-v6 dotted-quad notation
     * (e.g. `::ffff:127.0.0.1`), false otherwise. This is a notation-level flag
     * and does not reflect whether the address bits lie in the IPv4-mapped
     * (`::ffff:0:0/96`) subnet — for that, see {@link isMapped4}.
     * @returns {boolean}
     */
    is4() {
      return this.v4;
    }
    /**
     * Returns true if the address is an IPv4-mapped IPv6 address in
     * `::ffff:0:0/96` ([RFC 4291 §2.5.5.2](https://datatracker.ietf.org/doc/html/rfc4291#section-2.5.5.2)),
     * false otherwise. Unlike {@link is4}, this checks the underlying address
     * bits rather than the textual notation, so `::ffff:127.0.0.1` and
     * `::ffff:7f00:1` both return true.
     * @returns {boolean}
     */
    isMapped4() {
      return this.isInSubnet(IPV4_MAPPED_SUBNET);
    }
    /**
     * Returns true if the address is a Teredo address, false otherwise
     * @returns {boolean}
     */
    isTeredo() {
      return this.isInSubnet(TEREDO_SUBNET);
    }
    /**
     * Returns true if the address is a 6to4 address, false otherwise
     * @returns {boolean}
     */
    is6to4() {
      return this.isInSubnet(SIX_TO_FOUR_SUBNET);
    }
    /**
     * Returns true if the address is a loopback address, false otherwise
     * @returns {boolean}
     */
    isLoopback() {
      return this.getType() === "Loopback";
    }
    /**
     * Returns true if the address is a Unique Local Address in `fc00::/7` ([RFC 4193](https://datatracker.ietf.org/doc/html/rfc4193)). ULAs are the IPv6 equivalent of IPv4 [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918) private addresses.
     * @returns {boolean}
     */
    isULA() {
      return this.isInSubnet(ULA_SUBNET);
    }
    /**
     * Returns true if the address is the unspecified address `::`.
     * @returns {boolean}
     */
    isUnspecified() {
      return this.getType() === "Unspecified";
    }
    /**
     * Returns true if the address is in the documentation prefix `2001:db8::/32` ([RFC 3849](https://datatracker.ietf.org/doc/html/rfc3849)).
     * @returns {boolean}
     */
    isDocumentation() {
      return this.isInSubnet(DOCUMENTATION_SUBNET);
    }
    // #endregion
    // #region HTML
    /**
     * Returns the address as an HTTP URL with the host bracketed, e.g.
     * `http://[2001:db8::1]/`. If `optionalPort` is provided it is appended,
     * e.g. `http://[2001:db8::1]:8080/`.
     */
    href(optionalPort) {
      if (optionalPort === void 0) {
        optionalPort = "";
      } else {
        optionalPort = `:${optionalPort}`;
      }
      return `http://[${this.correctForm()}]${optionalPort}/`;
    }
    /**
     * Returns an HTML `<a>` element whose `href` encodes the address in a URL
     * hash fragment (default prefix `/#address=`). Useful for linking between
     * pages of an address-inspector UI.
     * @param options.className - CSS class for the rendered `<a>` element
     * @param options.prefix - hash prefix prepended to the address (default `/#address=`)
     * @param options.v4 - when true, render the address in v4-in-v6 form
     */
    link(options) {
      if (!options) {
        options = {};
      }
      if (options.className === void 0) {
        options.className = "";
      }
      if (options.prefix === void 0) {
        options.prefix = "/#address=";
      }
      if (options.v4 === void 0) {
        options.v4 = false;
      }
      let formFunction = this.correctForm;
      if (options.v4) {
        formFunction = this.to4in6;
      }
      const form = formFunction.call(this);
      const safeHref = helpers2.escapeHtml(`${options.prefix}${form}`);
      const safeForm = helpers2.escapeHtml(form);
      if (options.className) {
        const safeClass = helpers2.escapeHtml(options.className);
        return `<a href="${safeHref}" class="${safeClass}">${safeForm}</a>`;
      }
      return `<a href="${safeHref}">${safeForm}</a>`;
    }
    /**
     * Groups an address
     * @returns {String}
     */
    group() {
      if (this.elidedGroups === 0) {
        return helpers2.simpleGroup(this.addressMinusSuffix).join(":");
      }
      assert(typeof this.elidedGroups === "number");
      assert(typeof this.elisionBegin === "number");
      const output = [];
      const [left, right] = this.addressMinusSuffix.split("::");
      if (left.length) {
        output.push(...helpers2.simpleGroup(left));
      } else {
        output.push("");
      }
      const classes = ["hover-group"];
      for (let i = this.elisionBegin; i < this.elisionBegin + this.elidedGroups; i++) {
        classes.push(`group-${i}`);
      }
      output.push(`<span class="${classes.join(" ")}"></span>`);
      if (right.length) {
        output.push(...helpers2.simpleGroup(right, this.elisionEnd));
      } else {
        output.push("");
      }
      if (this.is4()) {
        assert(this.address4 instanceof ipv4_1.Address4);
        output.pop();
        output.push(this.address4.groupForV6());
      }
      return output.join(":");
    }
    // #endregion
    // #region Regular expressions
    /**
     * Generate a regular expression string that can be used to find or validate
     * all variations of this address
     * @param {boolean} substringSearch
     * @returns {string}
     */
    regularExpressionString(substringSearch = false) {
      let output = [];
      const address6 = new Address6(this.correctForm());
      if (address6.elidedGroups === 0) {
        output.push((0, regular_expressions_1.simpleRegularExpression)(address6.parsedAddress));
      } else if (address6.elidedGroups === constants6.GROUPS) {
        output.push((0, regular_expressions_1.possibleElisions)(constants6.GROUPS));
      } else {
        const halves = address6.address.split("::");
        if (halves[0].length) {
          output.push((0, regular_expressions_1.simpleRegularExpression)(halves[0].split(":")));
        }
        assert(typeof address6.elidedGroups === "number");
        output.push((0, regular_expressions_1.possibleElisions)(address6.elidedGroups, halves[0].length !== 0, halves[1].length !== 0));
        if (halves[1].length) {
          output.push((0, regular_expressions_1.simpleRegularExpression)(halves[1].split(":")));
        }
        output = [output.join(":")];
      }
      if (!substringSearch) {
        output = [
          "(?=^|",
          regular_expressions_1.ADDRESS_BOUNDARY,
          "|[^\\w\\:])(",
          ...output,
          ")(?=[^\\w\\:]|",
          regular_expressions_1.ADDRESS_BOUNDARY,
          "|$)"
        ];
      }
      return output.join("");
    }
    /**
     * Generate a regular expression that can be used to find or validate all
     * variations of this address.
     * @param {boolean} substringSearch
     * @returns {RegExp}
     */
    regularExpression(substringSearch = false) {
      return new RegExp(this.regularExpressionString(substringSearch), "i");
    }
  }
  ipv6.Address6 = Address6;
  const TYPE_SUBNETS = Object.keys(constants6.TYPES).map((subnet) => [
    new Address6(subnet),
    constants6.TYPES[subnet]
  ]);
  const TEREDO_SUBNET = new Address6("2001::/32");
  const SIX_TO_FOUR_SUBNET = new Address6("2002::/16");
  const ULA_SUBNET = new Address6("fc00::/7");
  const DOCUMENTATION_SUBNET = new Address6("2001:db8::/32");
  const IPV4_MAPPED_SUBNET = new Address6("::ffff:0:0/96");
  return ipv6;
}
var hasRequiredIpAddress;
function requireIpAddress() {
  if (hasRequiredIpAddress) return ipAddress;
  hasRequiredIpAddress = 1;
  (function(exports) {
    var __createBinding = ipAddress && ipAddress.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = ipAddress && ipAddress.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = ipAddress && ipAddress.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.v6 = exports.AddressError = exports.Address6 = exports.Address4 = void 0;
    var ipv4_1 = /* @__PURE__ */ requireIpv4();
    Object.defineProperty(exports, "Address4", { enumerable: true, get: function() {
      return ipv4_1.Address4;
    } });
    var ipv6_1 = /* @__PURE__ */ requireIpv6();
    Object.defineProperty(exports, "Address6", { enumerable: true, get: function() {
      return ipv6_1.Address6;
    } });
    var address_error_1 = /* @__PURE__ */ requireAddressError();
    Object.defineProperty(exports, "AddressError", { enumerable: true, get: function() {
      return address_error_1.AddressError;
    } });
    const helpers2 = __importStar(/* @__PURE__ */ requireHelpers$1());
    exports.v6 = { helpers: helpers2 };
  })(ipAddress);
  return ipAddress;
}
var hasRequiredHelpers;
function requireHelpers() {
  if (hasRequiredHelpers) return helpers$1;
  hasRequiredHelpers = 1;
  Object.defineProperty(helpers$1, "__esModule", { value: true });
  helpers$1.ipToBuffer = helpers$1.int32ToIpv4 = helpers$1.ipv4ToInt32 = helpers$1.validateSocksClientChainOptions = helpers$1.validateSocksClientOptions = void 0;
  const util_1 = requireUtil();
  const constants_1 = requireConstants$2();
  const stream2 = require$$0$7;
  const ip_address_1 = /* @__PURE__ */ requireIpAddress();
  const net = require$$4;
  function validateSocksClientOptions(options, acceptedCommands = ["connect", "bind", "associate"]) {
    if (!constants_1.SocksCommand[options.command]) {
      throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksCommand, options);
    }
    if (acceptedCommands.indexOf(options.command) === -1) {
      throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksCommandForOperation, options);
    }
    if (!isValidSocksRemoteHost(options.destination)) {
      throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsDestination, options);
    }
    if (!isValidSocksProxy(options.proxy)) {
      throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsProxy, options);
    }
    validateCustomProxyAuth(options.proxy, options);
    if (options.timeout && !isValidTimeoutValue(options.timeout)) {
      throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsTimeout, options);
    }
    if (options.existing_socket && !(options.existing_socket instanceof stream2.Duplex)) {
      throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsExistingSocket, options);
    }
  }
  helpers$1.validateSocksClientOptions = validateSocksClientOptions;
  function validateSocksClientChainOptions(options) {
    if (options.command !== "connect") {
      throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksCommandChain, options);
    }
    if (!isValidSocksRemoteHost(options.destination)) {
      throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsDestination, options);
    }
    if (!(options.proxies && Array.isArray(options.proxies) && options.proxies.length >= 2)) {
      throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsProxiesLength, options);
    }
    options.proxies.forEach((proxy) => {
      if (!isValidSocksProxy(proxy)) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsProxy, options);
      }
      validateCustomProxyAuth(proxy, options);
    });
    if (options.timeout && !isValidTimeoutValue(options.timeout)) {
      throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsTimeout, options);
    }
  }
  helpers$1.validateSocksClientChainOptions = validateSocksClientChainOptions;
  function validateCustomProxyAuth(proxy, options) {
    if (proxy.custom_auth_method !== void 0) {
      if (proxy.custom_auth_method < constants_1.SOCKS5_CUSTOM_AUTH_START || proxy.custom_auth_method > constants_1.SOCKS5_CUSTOM_AUTH_END) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthRange, options);
      }
      if (proxy.custom_auth_request_handler === void 0 || typeof proxy.custom_auth_request_handler !== "function") {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, options);
      }
      if (proxy.custom_auth_response_size === void 0) {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, options);
      }
      if (proxy.custom_auth_response_handler === void 0 || typeof proxy.custom_auth_response_handler !== "function") {
        throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, options);
      }
    }
  }
  function isValidSocksRemoteHost(remoteHost) {
    return remoteHost && typeof remoteHost.host === "string" && Buffer.byteLength(remoteHost.host) < 256 && typeof remoteHost.port === "number" && remoteHost.port >= 0 && remoteHost.port <= 65535;
  }
  function isValidSocksProxy(proxy) {
    return proxy && (typeof proxy.host === "string" || typeof proxy.ipaddress === "string") && typeof proxy.port === "number" && proxy.port >= 0 && proxy.port <= 65535 && (proxy.type === 4 || proxy.type === 5);
  }
  function isValidTimeoutValue(value) {
    return typeof value === "number" && value > 0;
  }
  function ipv4ToInt32(ip) {
    const address = new ip_address_1.Address4(ip);
    return address.toArray().reduce((acc, part) => (acc << 8) + part, 0) >>> 0;
  }
  helpers$1.ipv4ToInt32 = ipv4ToInt32;
  function int32ToIpv4(int32) {
    const octet1 = int32 >>> 24 & 255;
    const octet2 = int32 >>> 16 & 255;
    const octet3 = int32 >>> 8 & 255;
    const octet4 = int32 & 255;
    return [octet1, octet2, octet3, octet4].join(".");
  }
  helpers$1.int32ToIpv4 = int32ToIpv4;
  function ipToBuffer(ip) {
    if (net.isIPv4(ip)) {
      const address = new ip_address_1.Address4(ip);
      return Buffer.from(address.toArray());
    } else if (net.isIPv6(ip)) {
      const address = new ip_address_1.Address6(ip);
      return Buffer.from(address.canonicalForm().split(":").map((segment) => segment.padStart(4, "0")).join(""), "hex");
    } else {
      throw new Error("Invalid IP address format");
    }
  }
  helpers$1.ipToBuffer = ipToBuffer;
  return helpers$1;
}
var receivebuffer = {};
var hasRequiredReceivebuffer;
function requireReceivebuffer() {
  if (hasRequiredReceivebuffer) return receivebuffer;
  hasRequiredReceivebuffer = 1;
  Object.defineProperty(receivebuffer, "__esModule", { value: true });
  receivebuffer.ReceiveBuffer = void 0;
  class ReceiveBuffer {
    constructor(size = 4096) {
      this.buffer = Buffer.allocUnsafe(size);
      this.offset = 0;
      this.originalSize = size;
    }
    get length() {
      return this.offset;
    }
    append(data) {
      if (!Buffer.isBuffer(data)) {
        throw new Error("Attempted to append a non-buffer instance to ReceiveBuffer.");
      }
      if (this.offset + data.length >= this.buffer.length) {
        const tmp = this.buffer;
        this.buffer = Buffer.allocUnsafe(Math.max(this.buffer.length + this.originalSize, this.buffer.length + data.length));
        tmp.copy(this.buffer);
      }
      data.copy(this.buffer, this.offset);
      return this.offset += data.length;
    }
    peek(length) {
      if (length > this.offset) {
        throw new Error("Attempted to read beyond the bounds of the managed internal data.");
      }
      return this.buffer.slice(0, length);
    }
    get(length) {
      if (length > this.offset) {
        throw new Error("Attempted to read beyond the bounds of the managed internal data.");
      }
      const value = Buffer.allocUnsafe(length);
      this.buffer.slice(0, length).copy(value);
      this.buffer.copyWithin(0, length, length + this.offset - length);
      this.offset -= length;
      return value;
    }
  }
  receivebuffer.ReceiveBuffer = ReceiveBuffer;
  return receivebuffer;
}
var hasRequiredSocksclient;
function requireSocksclient() {
  if (hasRequiredSocksclient) return socksclient;
  hasRequiredSocksclient = 1;
  (function(exports) {
    var __awaiter = socksclient && socksclient.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SocksClientError = exports.SocksClient = void 0;
    const events_1 = require$$0$6;
    const net = require$$4;
    const smart_buffer_1 = requireSmartbuffer();
    const constants_1 = requireConstants$2();
    const helpers_1 = requireHelpers();
    const receivebuffer_1 = requireReceivebuffer();
    const util_1 = requireUtil();
    Object.defineProperty(exports, "SocksClientError", { enumerable: true, get: function() {
      return util_1.SocksClientError;
    } });
    const ip_address_1 = /* @__PURE__ */ requireIpAddress();
    class SocksClient extends events_1.EventEmitter {
      constructor(options) {
        super();
        this.options = Object.assign({}, options);
        (0, helpers_1.validateSocksClientOptions)(options);
        this.setState(constants_1.SocksClientState.Created);
      }
      /**
       * Creates a new SOCKS connection.
       *
       * Note: Supports callbacks and promises. Only supports the connect command.
       * @param options { SocksClientOptions } Options.
       * @param callback { Function } An optional callback function.
       * @returns { Promise }
       */
      static createConnection(options, callback) {
        return new Promise((resolve, reject) => {
          try {
            (0, helpers_1.validateSocksClientOptions)(options, ["connect"]);
          } catch (err) {
            if (typeof callback === "function") {
              callback(err);
              return resolve(err);
            } else {
              return reject(err);
            }
          }
          const client2 = new SocksClient(options);
          client2.connect(options.existing_socket);
          client2.once("established", (info) => {
            client2.removeAllListeners();
            if (typeof callback === "function") {
              callback(null, info);
              resolve(info);
            } else {
              resolve(info);
            }
          });
          client2.once("error", (err) => {
            client2.removeAllListeners();
            if (typeof callback === "function") {
              callback(err);
              resolve(err);
            } else {
              reject(err);
            }
          });
        });
      }
      /**
       * Creates a new SOCKS connection chain to a destination host through 2 or more SOCKS proxies.
       *
       * Note: Supports callbacks and promises. Only supports the connect method.
       * Note: Implemented via createConnection() factory function.
       * @param options { SocksClientChainOptions } Options
       * @param callback { Function } An optional callback function.
       * @returns { Promise }
       */
      static createConnectionChain(options, callback) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
          try {
            (0, helpers_1.validateSocksClientChainOptions)(options);
          } catch (err) {
            if (typeof callback === "function") {
              callback(err);
              return resolve(err);
            } else {
              return reject(err);
            }
          }
          if (options.randomizeChain) {
            (0, util_1.shuffleArray)(options.proxies);
          }
          try {
            let sock;
            for (let i = 0; i < options.proxies.length; i++) {
              const nextProxy = options.proxies[i];
              const nextDestination = i === options.proxies.length - 1 ? options.destination : {
                host: options.proxies[i + 1].host || options.proxies[i + 1].ipaddress,
                port: options.proxies[i + 1].port
              };
              const result = yield SocksClient.createConnection({
                command: "connect",
                proxy: nextProxy,
                destination: nextDestination,
                existing_socket: sock
              });
              sock = sock || result.socket;
            }
            if (typeof callback === "function") {
              callback(null, { socket: sock });
              resolve({ socket: sock });
            } else {
              resolve({ socket: sock });
            }
          } catch (err) {
            if (typeof callback === "function") {
              callback(err);
              resolve(err);
            } else {
              reject(err);
            }
          }
        }));
      }
      /**
       * Creates a SOCKS UDP Frame.
       * @param options
       */
      static createUDPFrame(options) {
        const buff = new smart_buffer_1.SmartBuffer();
        buff.writeUInt16BE(0);
        buff.writeUInt8(options.frameNumber || 0);
        if (net.isIPv4(options.remoteHost.host)) {
          buff.writeUInt8(constants_1.Socks5HostType.IPv4);
          buff.writeUInt32BE((0, helpers_1.ipv4ToInt32)(options.remoteHost.host));
        } else if (net.isIPv6(options.remoteHost.host)) {
          buff.writeUInt8(constants_1.Socks5HostType.IPv6);
          buff.writeBuffer((0, helpers_1.ipToBuffer)(options.remoteHost.host));
        } else {
          buff.writeUInt8(constants_1.Socks5HostType.Hostname);
          buff.writeUInt8(Buffer.byteLength(options.remoteHost.host));
          buff.writeString(options.remoteHost.host);
        }
        buff.writeUInt16BE(options.remoteHost.port);
        buff.writeBuffer(options.data);
        return buff.toBuffer();
      }
      /**
       * Parses a SOCKS UDP frame.
       * @param data
       */
      static parseUDPFrame(data) {
        const buff = smart_buffer_1.SmartBuffer.fromBuffer(data);
        buff.readOffset = 2;
        const frameNumber = buff.readUInt8();
        const hostType = buff.readUInt8();
        let remoteHost;
        if (hostType === constants_1.Socks5HostType.IPv4) {
          remoteHost = (0, helpers_1.int32ToIpv4)(buff.readUInt32BE());
        } else if (hostType === constants_1.Socks5HostType.IPv6) {
          remoteHost = ip_address_1.Address6.fromByteArray(Array.from(buff.readBuffer(16))).canonicalForm();
        } else {
          remoteHost = buff.readString(buff.readUInt8());
        }
        const remotePort = buff.readUInt16BE();
        return {
          frameNumber,
          remoteHost: {
            host: remoteHost,
            port: remotePort
          },
          data: buff.readBuffer()
        };
      }
      /**
       * Internal state setter. If the SocksClient is in an error state, it cannot be changed to a non error state.
       */
      setState(newState) {
        if (this.state !== constants_1.SocksClientState.Error) {
          this.state = newState;
        }
      }
      /**
       * Starts the connection establishment to the proxy and destination.
       * @param existingSocket Connected socket to use instead of creating a new one (internal use).
       */
      connect(existingSocket) {
        this.onDataReceived = (data) => this.onDataReceivedHandler(data);
        this.onClose = () => this.onCloseHandler();
        this.onError = (err) => this.onErrorHandler(err);
        this.onConnect = () => this.onConnectHandler();
        const timer = setTimeout(() => this.onEstablishedTimeout(), this.options.timeout || constants_1.DEFAULT_TIMEOUT);
        if (timer.unref && typeof timer.unref === "function") {
          timer.unref();
        }
        if (existingSocket) {
          this.socket = existingSocket;
        } else {
          this.socket = new net.Socket();
        }
        this.socket.once("close", this.onClose);
        this.socket.once("error", this.onError);
        this.socket.once("connect", this.onConnect);
        this.socket.on("data", this.onDataReceived);
        this.setState(constants_1.SocksClientState.Connecting);
        this.receiveBuffer = new receivebuffer_1.ReceiveBuffer();
        if (existingSocket) {
          this.socket.emit("connect");
        } else {
          this.socket.connect(this.getSocketOptions());
          if (this.options.set_tcp_nodelay !== void 0 && this.options.set_tcp_nodelay !== null) {
            this.socket.setNoDelay(!!this.options.set_tcp_nodelay);
          }
        }
        this.prependOnceListener("established", (info) => {
          setImmediate(() => {
            if (this.receiveBuffer.length > 0) {
              const excessData = this.receiveBuffer.get(this.receiveBuffer.length);
              info.socket.emit("data", excessData);
            }
            info.socket.resume();
          });
        });
      }
      // Socket options (defaults host/port to options.proxy.host/options.proxy.port)
      getSocketOptions() {
        return Object.assign(Object.assign({}, this.options.socket_options), { host: this.options.proxy.host || this.options.proxy.ipaddress, port: this.options.proxy.port });
      }
      /**
       * Handles internal Socks timeout callback.
       * Note: If the Socks client is not BoundWaitingForConnection or Established, the connection will be closed.
       */
      onEstablishedTimeout() {
        if (this.state !== constants_1.SocksClientState.Established && this.state !== constants_1.SocksClientState.BoundWaitingForConnection) {
          this.closeSocket(constants_1.ERRORS.ProxyConnectionTimedOut);
        }
      }
      /**
       * Handles Socket connect event.
       */
      onConnectHandler() {
        this.setState(constants_1.SocksClientState.Connected);
        if (this.options.proxy.type === 4) {
          this.sendSocks4InitialHandshake();
        } else {
          this.sendSocks5InitialHandshake();
        }
        this.setState(constants_1.SocksClientState.SentInitialHandshake);
      }
      /**
       * Handles Socket data event.
       * @param data
       */
      onDataReceivedHandler(data) {
        this.receiveBuffer.append(data);
        this.processData();
      }
      /**
       * Handles processing of the data we have received.
       */
      processData() {
        while (this.state !== constants_1.SocksClientState.Established && this.state !== constants_1.SocksClientState.Error && this.receiveBuffer.length >= this.nextRequiredPacketBufferSize) {
          if (this.state === constants_1.SocksClientState.SentInitialHandshake) {
            if (this.options.proxy.type === 4) {
              this.handleSocks4FinalHandshakeResponse();
            } else {
              this.handleInitialSocks5HandshakeResponse();
            }
          } else if (this.state === constants_1.SocksClientState.SentAuthentication) {
            this.handleInitialSocks5AuthenticationHandshakeResponse();
          } else if (this.state === constants_1.SocksClientState.SentFinalHandshake) {
            this.handleSocks5FinalHandshakeResponse();
          } else if (this.state === constants_1.SocksClientState.BoundWaitingForConnection) {
            if (this.options.proxy.type === 4) {
              this.handleSocks4IncomingConnectionResponse();
            } else {
              this.handleSocks5IncomingConnectionResponse();
            }
          } else {
            this.closeSocket(constants_1.ERRORS.InternalError);
            break;
          }
        }
      }
      /**
       * Handles Socket close event.
       * @param had_error
       */
      onCloseHandler() {
        this.closeSocket(constants_1.ERRORS.SocketClosed);
      }
      /**
       * Handles Socket error event.
       * @param err
       */
      onErrorHandler(err) {
        this.closeSocket(err.message);
      }
      /**
       * Removes internal event listeners on the underlying Socket.
       */
      removeInternalSocketHandlers() {
        this.socket.pause();
        this.socket.removeListener("data", this.onDataReceived);
        this.socket.removeListener("close", this.onClose);
        this.socket.removeListener("error", this.onError);
        this.socket.removeListener("connect", this.onConnect);
      }
      /**
       * Closes and destroys the underlying Socket. Emits an error event.
       * @param err { String } An error string to include in error event.
       */
      closeSocket(err) {
        if (this.state !== constants_1.SocksClientState.Error) {
          this.setState(constants_1.SocksClientState.Error);
          this.socket.destroy();
          this.removeInternalSocketHandlers();
          this.emit("error", new util_1.SocksClientError(err, this.options));
        }
      }
      /**
       * Sends initial Socks v4 handshake request.
       */
      sendSocks4InitialHandshake() {
        const userId = this.options.proxy.userId || "";
        const buff = new smart_buffer_1.SmartBuffer();
        buff.writeUInt8(4);
        buff.writeUInt8(constants_1.SocksCommand[this.options.command]);
        buff.writeUInt16BE(this.options.destination.port);
        if (net.isIPv4(this.options.destination.host)) {
          buff.writeBuffer((0, helpers_1.ipToBuffer)(this.options.destination.host));
          buff.writeStringNT(userId);
        } else {
          buff.writeUInt8(0);
          buff.writeUInt8(0);
          buff.writeUInt8(0);
          buff.writeUInt8(1);
          buff.writeStringNT(userId);
          buff.writeStringNT(this.options.destination.host);
        }
        this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks4Response;
        this.socket.write(buff.toBuffer());
      }
      /**
       * Handles Socks v4 handshake response.
       * @param data
       */
      handleSocks4FinalHandshakeResponse() {
        const data = this.receiveBuffer.get(8);
        if (data[1] !== constants_1.Socks4Response.Granted) {
          this.closeSocket(`${constants_1.ERRORS.Socks4ProxyRejectedConnection} - (${constants_1.Socks4Response[data[1]]})`);
        } else {
          if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.bind) {
            const buff = smart_buffer_1.SmartBuffer.fromBuffer(data);
            buff.readOffset = 2;
            const remoteHost = {
              port: buff.readUInt16BE(),
              host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE())
            };
            if (remoteHost.host === "0.0.0.0") {
              remoteHost.host = this.options.proxy.ipaddress;
            }
            this.setState(constants_1.SocksClientState.BoundWaitingForConnection);
            this.emit("bound", { remoteHost, socket: this.socket });
          } else {
            this.setState(constants_1.SocksClientState.Established);
            this.removeInternalSocketHandlers();
            this.emit("established", { socket: this.socket });
          }
        }
      }
      /**
       * Handles Socks v4 incoming connection request (BIND)
       * @param data
       */
      handleSocks4IncomingConnectionResponse() {
        const data = this.receiveBuffer.get(8);
        if (data[1] !== constants_1.Socks4Response.Granted) {
          this.closeSocket(`${constants_1.ERRORS.Socks4ProxyRejectedIncomingBoundConnection} - (${constants_1.Socks4Response[data[1]]})`);
        } else {
          const buff = smart_buffer_1.SmartBuffer.fromBuffer(data);
          buff.readOffset = 2;
          const remoteHost = {
            port: buff.readUInt16BE(),
            host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE())
          };
          this.setState(constants_1.SocksClientState.Established);
          this.removeInternalSocketHandlers();
          this.emit("established", { remoteHost, socket: this.socket });
        }
      }
      /**
       * Sends initial Socks v5 handshake request.
       */
      sendSocks5InitialHandshake() {
        const buff = new smart_buffer_1.SmartBuffer();
        const supportedAuthMethods = [constants_1.Socks5Auth.NoAuth];
        if (this.options.proxy.userId || this.options.proxy.password) {
          supportedAuthMethods.push(constants_1.Socks5Auth.UserPass);
        }
        if (this.options.proxy.custom_auth_method !== void 0) {
          supportedAuthMethods.push(this.options.proxy.custom_auth_method);
        }
        buff.writeUInt8(5);
        buff.writeUInt8(supportedAuthMethods.length);
        for (const authMethod of supportedAuthMethods) {
          buff.writeUInt8(authMethod);
        }
        this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5InitialHandshakeResponse;
        this.socket.write(buff.toBuffer());
        this.setState(constants_1.SocksClientState.SentInitialHandshake);
      }
      /**
       * Handles initial Socks v5 handshake response.
       * @param data
       */
      handleInitialSocks5HandshakeResponse() {
        const data = this.receiveBuffer.get(2);
        if (data[0] !== 5) {
          this.closeSocket(constants_1.ERRORS.InvalidSocks5IntiailHandshakeSocksVersion);
        } else if (data[1] === constants_1.SOCKS5_NO_ACCEPTABLE_AUTH) {
          this.closeSocket(constants_1.ERRORS.InvalidSocks5InitialHandshakeNoAcceptedAuthType);
        } else {
          if (data[1] === constants_1.Socks5Auth.NoAuth) {
            this.socks5ChosenAuthType = constants_1.Socks5Auth.NoAuth;
            this.sendSocks5CommandRequest();
          } else if (data[1] === constants_1.Socks5Auth.UserPass) {
            this.socks5ChosenAuthType = constants_1.Socks5Auth.UserPass;
            this.sendSocks5UserPassAuthentication();
          } else if (data[1] === this.options.proxy.custom_auth_method) {
            this.socks5ChosenAuthType = this.options.proxy.custom_auth_method;
            this.sendSocks5CustomAuthentication();
          } else {
            this.closeSocket(constants_1.ERRORS.InvalidSocks5InitialHandshakeUnknownAuthType);
          }
        }
      }
      /**
       * Sends Socks v5 user & password auth handshake.
       *
       * Note: No auth and user/pass are currently supported.
       */
      sendSocks5UserPassAuthentication() {
        const userId = this.options.proxy.userId || "";
        const password = this.options.proxy.password || "";
        const buff = new smart_buffer_1.SmartBuffer();
        buff.writeUInt8(1);
        buff.writeUInt8(Buffer.byteLength(userId));
        buff.writeString(userId);
        buff.writeUInt8(Buffer.byteLength(password));
        buff.writeString(password);
        this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5UserPassAuthenticationResponse;
        this.socket.write(buff.toBuffer());
        this.setState(constants_1.SocksClientState.SentAuthentication);
      }
      sendSocks5CustomAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
          this.nextRequiredPacketBufferSize = this.options.proxy.custom_auth_response_size;
          this.socket.write(yield this.options.proxy.custom_auth_request_handler());
          this.setState(constants_1.SocksClientState.SentAuthentication);
        });
      }
      handleSocks5CustomAuthHandshakeResponse(data) {
        return __awaiter(this, void 0, void 0, function* () {
          return yield this.options.proxy.custom_auth_response_handler(data);
        });
      }
      handleSocks5AuthenticationNoAuthHandshakeResponse(data) {
        return __awaiter(this, void 0, void 0, function* () {
          return data[1] === 0;
        });
      }
      handleSocks5AuthenticationUserPassHandshakeResponse(data) {
        return __awaiter(this, void 0, void 0, function* () {
          return data[1] === 0;
        });
      }
      /**
       * Handles Socks v5 auth handshake response.
       * @param data
       */
      handleInitialSocks5AuthenticationHandshakeResponse() {
        return __awaiter(this, void 0, void 0, function* () {
          this.setState(constants_1.SocksClientState.ReceivedAuthenticationResponse);
          let authResult = false;
          if (this.socks5ChosenAuthType === constants_1.Socks5Auth.NoAuth) {
            authResult = yield this.handleSocks5AuthenticationNoAuthHandshakeResponse(this.receiveBuffer.get(2));
          } else if (this.socks5ChosenAuthType === constants_1.Socks5Auth.UserPass) {
            authResult = yield this.handleSocks5AuthenticationUserPassHandshakeResponse(this.receiveBuffer.get(2));
          } else if (this.socks5ChosenAuthType === this.options.proxy.custom_auth_method) {
            authResult = yield this.handleSocks5CustomAuthHandshakeResponse(this.receiveBuffer.get(this.options.proxy.custom_auth_response_size));
          }
          if (!authResult) {
            this.closeSocket(constants_1.ERRORS.Socks5AuthenticationFailed);
          } else {
            this.sendSocks5CommandRequest();
          }
        });
      }
      /**
       * Sends Socks v5 final handshake request.
       */
      sendSocks5CommandRequest() {
        const buff = new smart_buffer_1.SmartBuffer();
        buff.writeUInt8(5);
        buff.writeUInt8(constants_1.SocksCommand[this.options.command]);
        buff.writeUInt8(0);
        if (net.isIPv4(this.options.destination.host)) {
          buff.writeUInt8(constants_1.Socks5HostType.IPv4);
          buff.writeBuffer((0, helpers_1.ipToBuffer)(this.options.destination.host));
        } else if (net.isIPv6(this.options.destination.host)) {
          buff.writeUInt8(constants_1.Socks5HostType.IPv6);
          buff.writeBuffer((0, helpers_1.ipToBuffer)(this.options.destination.host));
        } else {
          buff.writeUInt8(constants_1.Socks5HostType.Hostname);
          buff.writeUInt8(this.options.destination.host.length);
          buff.writeString(this.options.destination.host);
        }
        buff.writeUInt16BE(this.options.destination.port);
        this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHeader;
        this.socket.write(buff.toBuffer());
        this.setState(constants_1.SocksClientState.SentFinalHandshake);
      }
      /**
       * Handles Socks v5 final handshake response.
       * @param data
       */
      handleSocks5FinalHandshakeResponse() {
        const header = this.receiveBuffer.peek(5);
        if (header[0] !== 5 || header[1] !== constants_1.Socks5Response.Granted) {
          this.closeSocket(`${constants_1.ERRORS.InvalidSocks5FinalHandshakeRejected} - ${constants_1.Socks5Response[header[1]]}`);
        } else {
          const addressType = header[3];
          let remoteHost;
          let buff;
          if (addressType === constants_1.Socks5HostType.IPv4) {
            const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv4;
            if (this.receiveBuffer.length < dataNeeded) {
              this.nextRequiredPacketBufferSize = dataNeeded;
              return;
            }
            buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
            remoteHost = {
              host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE()),
              port: buff.readUInt16BE()
            };
            if (remoteHost.host === "0.0.0.0") {
              remoteHost.host = this.options.proxy.ipaddress;
            }
          } else if (addressType === constants_1.Socks5HostType.Hostname) {
            const hostLength = header[4];
            const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHostname(hostLength);
            if (this.receiveBuffer.length < dataNeeded) {
              this.nextRequiredPacketBufferSize = dataNeeded;
              return;
            }
            buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(5));
            remoteHost = {
              host: buff.readString(hostLength),
              port: buff.readUInt16BE()
            };
          } else if (addressType === constants_1.Socks5HostType.IPv6) {
            const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv6;
            if (this.receiveBuffer.length < dataNeeded) {
              this.nextRequiredPacketBufferSize = dataNeeded;
              return;
            }
            buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
            remoteHost = {
              host: ip_address_1.Address6.fromByteArray(Array.from(buff.readBuffer(16))).canonicalForm(),
              port: buff.readUInt16BE()
            };
          }
          this.setState(constants_1.SocksClientState.ReceivedFinalResponse);
          if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.connect) {
            this.setState(constants_1.SocksClientState.Established);
            this.removeInternalSocketHandlers();
            this.emit("established", { remoteHost, socket: this.socket });
          } else if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.bind) {
            this.setState(constants_1.SocksClientState.BoundWaitingForConnection);
            this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHeader;
            this.emit("bound", { remoteHost, socket: this.socket });
          } else if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.associate) {
            this.setState(constants_1.SocksClientState.Established);
            this.removeInternalSocketHandlers();
            this.emit("established", {
              remoteHost,
              socket: this.socket
            });
          }
        }
      }
      /**
       * Handles Socks v5 incoming connection request (BIND).
       */
      handleSocks5IncomingConnectionResponse() {
        const header = this.receiveBuffer.peek(5);
        if (header[0] !== 5 || header[1] !== constants_1.Socks5Response.Granted) {
          this.closeSocket(`${constants_1.ERRORS.Socks5ProxyRejectedIncomingBoundConnection} - ${constants_1.Socks5Response[header[1]]}`);
        } else {
          const addressType = header[3];
          let remoteHost;
          let buff;
          if (addressType === constants_1.Socks5HostType.IPv4) {
            const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv4;
            if (this.receiveBuffer.length < dataNeeded) {
              this.nextRequiredPacketBufferSize = dataNeeded;
              return;
            }
            buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
            remoteHost = {
              host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE()),
              port: buff.readUInt16BE()
            };
            if (remoteHost.host === "0.0.0.0") {
              remoteHost.host = this.options.proxy.ipaddress;
            }
          } else if (addressType === constants_1.Socks5HostType.Hostname) {
            const hostLength = header[4];
            const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHostname(hostLength);
            if (this.receiveBuffer.length < dataNeeded) {
              this.nextRequiredPacketBufferSize = dataNeeded;
              return;
            }
            buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(5));
            remoteHost = {
              host: buff.readString(hostLength),
              port: buff.readUInt16BE()
            };
          } else if (addressType === constants_1.Socks5HostType.IPv6) {
            const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv6;
            if (this.receiveBuffer.length < dataNeeded) {
              this.nextRequiredPacketBufferSize = dataNeeded;
              return;
            }
            buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
            remoteHost = {
              host: ip_address_1.Address6.fromByteArray(Array.from(buff.readBuffer(16))).canonicalForm(),
              port: buff.readUInt16BE()
            };
          }
          this.setState(constants_1.SocksClientState.Established);
          this.removeInternalSocketHandlers();
          this.emit("established", { remoteHost, socket: this.socket });
        }
      }
      get socksClientOptions() {
        return Object.assign({}, this.options);
      }
    }
    exports.SocksClient = SocksClient;
  })(socksclient);
  return socksclient;
}
var hasRequiredBuild$1;
function requireBuild$1() {
  if (hasRequiredBuild$1) return build;
  hasRequiredBuild$1 = 1;
  (function(exports) {
    var __createBinding = build && build.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = build && build.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(requireSocksclient(), exports);
  })(build);
  return build;
}
var hasRequiredSocks;
function requireSocks() {
  if (hasRequiredSocks) return socks;
  hasRequiredSocks = 1;
  var __createBinding = socks && socks.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = socks && socks.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = socks && socks.__importStar || /* @__PURE__ */ (function() {
    var ownKeys = function(o) {
      ownKeys = Object.getOwnPropertyNames || function(o2) {
        var ar = [];
        for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
        return ar;
      };
      return ownKeys(o);
    };
    return function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
      }
      __setModuleDefault(result, mod);
      return result;
    };
  })();
  var __importDefault = socks && socks.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(socks, "__esModule", { value: true });
  socks.default = openSocks;
  const debug_1 = __importDefault(requireSrc());
  const stream_1 = require$$0$7;
  const socks_1 = requireBuild$1();
  const dns = __importStar(require$$3$1);
  const util_1 = require$$1;
  const assert_1 = __importDefault(require$$5);
  const debug2 = (0, debug_1.default)("mqttjs:socks");
  class ProxyStream extends stream_1.Duplex {
    constructor() {
      super({ autoDestroy: false });
      __publicField(this, "_flowing", false);
      __publicField(this, "_socket");
      __publicField(this, "_onData", (chunk) => {
        (0, assert_1.default)(this._socket);
        this._flowing = this.push(chunk);
        if (!this._flowing)
          this._socket.pause();
      });
      __publicField(this, "_onEnd", () => {
        debug2("proxy stream received EOF");
        this.push(null);
      });
      __publicField(this, "_onClose", () => {
        debug2("proxy stream closed");
        this.destroy();
      });
      __publicField(this, "_onError", (err) => {
        debug2("proxy stream died with error %s", err);
        this.destroy(err);
      });
      this.cork();
    }
    _start(socket) {
      debug2("proxy stream started");
      (0, assert_1.default)(!this._socket);
      if (this.destroyed) {
        socket.destroy(this.errored);
        return;
      }
      this._socket = socket;
      if (!this._flowing)
        socket.pause();
      socket.on("data", this._onData);
      socket.on("end", this._onEnd);
      socket.on("error", this._onError);
      socket.on("close", this._onClose);
      socket.emit("connect");
      this.uncork();
    }
    _write(chunk, encoding, callback) {
      (0, assert_1.default)(this._socket);
      this._socket.write(chunk, callback);
    }
    _read(size) {
      var _a, _b;
      this._flowing = true;
      (_b = (_a = this._socket) == null ? void 0 : _a.resume) == null ? void 0 : _b.call(_a);
    }
    _destroy(error, callback) {
      var _a, _b;
      (_b = (_a = this._socket) == null ? void 0 : _a.destroy) == null ? void 0 : _b.call(_a, error);
      callback(error);
    }
  }
  function fatal(e) {
    try {
      if (e.code === void 0)
        e.code = "SOCKS";
      return e;
    } catch {
      return e;
    }
  }
  function typeFromProtocol(proto) {
    switch (proto) {
      case "socks5h:":
        return [5, true];
      case "socks4a:":
        return [4, true];
      case "socks5:":
        return [5, false];
      case "socks4:":
        return [4, false];
      default:
        return [void 0, false];
    }
  }
  function parseSocksUrl(url) {
    const parsedUrl = new URL(url);
    if (parsedUrl.pathname || parsedUrl.hash || parsedUrl.search) {
      throw fatal(new Error("bad SOCKS URL"));
    }
    const [type, resolveThroughProxy] = typeFromProtocol(parsedUrl.protocol);
    if (!type) {
      throw fatal(new Error("bad SOCKS URL: invalid protocol"));
    }
    const port = parseInt(parsedUrl.port, 10);
    if (Number.isNaN(port)) {
      throw fatal(new Error("bad SOCKS URL: invalid port"));
    }
    const proxy = {
      host: parsedUrl.hostname,
      port,
      type
    };
    return [proxy, resolveThroughProxy];
  }
  async function connectSocks(destinationHost, destinationPort, socksUrl, stream2, options = {}) {
    const lookup = options.lookup ?? (0, util_1.promisify)(dns.lookup);
    const [proxy, resolveThroughProxy] = parseSocksUrl(socksUrl);
    if (!resolveThroughProxy) {
      debug2("resolving %s locally", destinationHost);
      destinationHost = (await lookup(destinationHost, {
        family: proxy.type === 4 ? 4 : 0
      })).address;
    }
    debug2("establishing SOCKS%d connection to %s:%d via %s:%d", proxy.type, destinationHost, destinationPort, proxy.host, proxy.port);
    const socksClient = new socks_1.SocksClient({
      command: "connect",
      destination: {
        host: destinationHost,
        port: destinationPort
      },
      proxy: { ...proxy },
      timeout: options.timeout
    });
    socksClient.connect();
    socksClient.on("established", ({ socket }) => stream2._start(socket));
    socksClient.on("error", (e) => {
      debug2("SOCKS failed: %s", e);
      stream2.destroy(fatal(e));
    });
  }
  function openSocks(destinationHost, destinationPort, socksUrl, options) {
    debug2("SOCKS connection to %s:%d via %s", destinationHost, destinationPort, socksUrl);
    const stream2 = new ProxyStream();
    connectSocks(destinationHost, destinationPort, socksUrl, stream2, options).catch((e) => {
      debug2("SOCKS failed: %s", e);
      stream2.destroy(e);
    });
    return stream2;
  }
  return socks;
}
var hasRequiredTcp;
function requireTcp() {
  if (hasRequiredTcp) return tcp;
  hasRequiredTcp = 1;
  var __importDefault = tcp && tcp.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(tcp, "__esModule", { value: true });
  const net_1 = __importDefault(require$$4);
  const debug_1 = __importDefault(requireSrc());
  const socks_1 = __importDefault(requireSocks());
  const debug2 = (0, debug_1.default)("mqttjs:tcp");
  const buildStream = (client2, opts) => {
    opts.port = opts.port || 1883;
    opts.hostname = opts.hostname || opts.host || "localhost";
    if (opts.socksProxy) {
      return (0, socks_1.default)(opts.hostname, opts.port, opts.socksProxy, {
        timeout: opts.socksTimeout
      });
    }
    const { port, path: path2 } = opts;
    const host = opts.hostname;
    debug2("port %d and host %s", port, host);
    return net_1.default.createConnection({ port, host, path: path2 });
  };
  tcp.default = buildStream;
  return tcp;
}
var tls = {};
var hasRequiredTls;
function requireTls() {
  if (hasRequiredTls) return tls;
  hasRequiredTls = 1;
  var __importDefault = tls && tls.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(tls, "__esModule", { value: true });
  const tls_1 = require$$4$1;
  const net_1 = __importDefault(require$$4);
  const debug_1 = __importDefault(requireSrc());
  const socks_1 = __importDefault(requireSocks());
  const debug2 = (0, debug_1.default)("mqttjs:tls");
  function connect2(opts) {
    const { host, port, socksProxy, ...rest } = opts;
    if (socksProxy !== void 0) {
      const socket = (0, socks_1.default)(host, port, socksProxy, {
        timeout: opts.socksTimeout
      });
      return (0, tls_1.connect)({
        ...rest,
        socket
      });
    }
    return (0, tls_1.connect)(opts);
  }
  const buildStream = (client2, opts) => {
    opts.port = opts.port || 8883;
    opts.host = opts.hostname || opts.host || "localhost";
    if (net_1.default.isIP(opts.host) === 0) {
      opts.servername = opts.host;
    }
    opts.rejectUnauthorized = opts.rejectUnauthorized !== false;
    delete opts.path;
    debug2("port %d host %s rejectUnauthorized %b", opts.port, opts.host, opts.rejectUnauthorized);
    const connection = connect2(opts);
    connection.on("secureConnect", () => {
      if (opts.rejectUnauthorized && !connection.authorized) {
        connection.emit("error", new Error("TLS not authorized"));
      } else {
        connection.removeListener("error", handleTLSerrors);
      }
    });
    function handleTLSerrors(err) {
      if (opts.rejectUnauthorized) {
        client2.emit("error", err);
      }
      connection.end();
    }
    connection.on("error", handleTLSerrors);
    return connection;
  };
  tls.default = buildStream;
  return tls;
}
var wx$1 = {};
var hasRequiredWx;
function requireWx() {
  if (hasRequiredWx) return wx$1;
  hasRequiredWx = 1;
  Object.defineProperty(wx$1, "__esModule", { value: true });
  const buffer_1 = require$$0$5;
  const readable_stream_1 = requireOurs();
  const BufferedDuplex_1 = requireBufferedDuplex();
  let socketTask;
  let proxy;
  let stream2;
  function buildProxy() {
    const _proxy = new readable_stream_1.Transform();
    _proxy._write = (chunk, encoding, next) => {
      socketTask.send({
        data: chunk.buffer,
        success() {
          next();
        },
        fail(errMsg) {
          next(new Error(errMsg));
        }
      });
    };
    _proxy._flush = (done) => {
      socketTask.close({
        success() {
          done();
        }
      });
    };
    return _proxy;
  }
  function setDefaultOpts(opts) {
    if (!opts.hostname) {
      opts.hostname = "localhost";
    }
    if (!opts.path) {
      opts.path = "/";
    }
    if (!opts.wsOptions) {
      opts.wsOptions = {};
    }
  }
  function buildUrl(opts, client2) {
    const protocol = opts.protocol === "wxs" ? "wss" : "ws";
    let url = `${protocol}://${opts.hostname}${opts.path}`;
    if (opts.port && opts.port !== 80 && opts.port !== 443) {
      url = `${protocol}://${opts.hostname}:${opts.port}${opts.path}`;
    }
    if (typeof opts.transformWsUrl === "function") {
      url = opts.transformWsUrl(url, opts, client2);
    }
    return url;
  }
  function bindEventHandler() {
    socketTask.onOpen(() => {
      stream2.socketReady();
    });
    socketTask.onMessage((res) => {
      let { data } = res;
      if (data instanceof ArrayBuffer)
        data = buffer_1.Buffer.from(data);
      else
        data = buffer_1.Buffer.from(data, "utf8");
      proxy.push(data);
    });
    socketTask.onClose(() => {
      stream2.emit("close");
      stream2.end();
      stream2.destroy();
    });
    socketTask.onError((error) => {
      const err = new Error(error.errMsg);
      stream2.destroy(err);
    });
  }
  const buildStream = (client2, opts) => {
    opts.hostname = opts.hostname || opts.host;
    if (!opts.hostname) {
      throw new Error("Could not determine host. Specify host manually.");
    }
    const websocketSubProtocol = opts.protocolId === "MQIsdp" && opts.protocolVersion === 3 ? "mqttv3.1" : "mqtt";
    setDefaultOpts(opts);
    const url = buildUrl(opts, client2);
    socketTask = wx.connectSocket({
      url,
      protocols: [websocketSubProtocol]
    });
    proxy = buildProxy();
    stream2 = new BufferedDuplex_1.BufferedDuplex(opts, proxy, socketTask);
    stream2._destroy = (err, cb) => {
      socketTask.close({
        success() {
          if (cb)
            cb(err);
        }
      });
    };
    const destroyRef = stream2.destroy;
    stream2.destroy = (err, cb) => {
      stream2.destroy = destroyRef;
      setTimeout(() => {
        socketTask.close({
          fail() {
            stream2._destroy(err, cb);
          }
        });
      }, 0);
      return stream2;
    };
    bindEventHandler();
    return stream2;
  };
  wx$1.default = buildStream;
  return wx$1;
}
var ali = {};
var hasRequiredAli;
function requireAli() {
  if (hasRequiredAli) return ali;
  hasRequiredAli = 1;
  Object.defineProperty(ali, "__esModule", { value: true });
  const buffer_1 = require$$0$5;
  const readable_stream_1 = requireOurs();
  const BufferedDuplex_1 = requireBufferedDuplex();
  let my;
  let proxy;
  let stream2;
  let isInitialized = false;
  function buildProxy() {
    const _proxy = new readable_stream_1.Transform();
    _proxy._write = (chunk, encoding, next) => {
      my.sendSocketMessage({
        data: chunk.buffer,
        success() {
          next();
        },
        fail() {
          next(new Error());
        }
      });
    };
    _proxy._flush = (done) => {
      my.closeSocket({
        success() {
          done();
        }
      });
    };
    return _proxy;
  }
  function setDefaultOpts(opts) {
    if (!opts.hostname) {
      opts.hostname = "localhost";
    }
    if (!opts.path) {
      opts.path = "/";
    }
    if (!opts.wsOptions) {
      opts.wsOptions = {};
    }
  }
  function buildUrl(opts, client2) {
    const protocol = opts.protocol === "alis" ? "wss" : "ws";
    let url = `${protocol}://${opts.hostname}${opts.path}`;
    if (opts.port && opts.port !== 80 && opts.port !== 443) {
      url = `${protocol}://${opts.hostname}:${opts.port}${opts.path}`;
    }
    if (typeof opts.transformWsUrl === "function") {
      url = opts.transformWsUrl(url, opts, client2);
    }
    return url;
  }
  function bindEventHandler() {
    if (isInitialized)
      return;
    isInitialized = true;
    my.onSocketOpen(() => {
      stream2.socketReady();
    });
    my.onSocketMessage((res) => {
      if (typeof res.data === "string") {
        const buffer = buffer_1.Buffer.from(res.data, "base64");
        proxy.push(buffer);
      } else {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          if (reader.result instanceof ArrayBuffer) {
            proxy.push(buffer_1.Buffer.from(reader.result));
            return;
          }
          proxy.push(buffer_1.Buffer.from(reader.result, "utf-8"));
        });
        reader.readAsArrayBuffer(res.data);
      }
    });
    my.onSocketClose(() => {
      stream2.end();
      stream2.destroy();
    });
    my.onSocketError((err) => {
      stream2.destroy(err);
    });
  }
  const buildStream = (client2, opts) => {
    opts.hostname = opts.hostname || opts.host;
    if (!opts.hostname) {
      throw new Error("Could not determine host. Specify host manually.");
    }
    const websocketSubProtocol = opts.protocolId === "MQIsdp" && opts.protocolVersion === 3 ? "mqttv3.1" : "mqtt";
    setDefaultOpts(opts);
    const url = buildUrl(opts, client2);
    my = opts.my;
    my.connectSocket({
      url,
      protocols: websocketSubProtocol
    });
    proxy = buildProxy();
    stream2 = new BufferedDuplex_1.BufferedDuplex(opts, proxy, my);
    bindEventHandler();
    return stream2;
  };
  ali.default = buildStream;
  return ali;
}
var hasRequiredConnect;
function requireConnect() {
  if (hasRequiredConnect) return connect;
  hasRequiredConnect = 1;
  var __importDefault = connect && connect.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(connect, "__esModule", { value: true });
  connect.connectAsync = connectAsync;
  const debug_1 = __importDefault(requireSrc());
  const url_1 = __importDefault(require$$7);
  const client_1 = __importDefault(requireClient());
  const is_browser_1 = __importDefault(requireIsBrowser());
  if (typeof (process == null ? void 0 : process.nextTick) !== "function") {
    process.nextTick = setImmediate;
  }
  const debug2 = (0, debug_1.default)("mqttjs");
  let protocols = null;
  function parseAuthOptions(opts) {
    let matches;
    if (opts.auth) {
      matches = opts.auth.match(/^(.+):(.+)$/);
      if (matches) {
        const [, username, password] = matches;
        opts.username = username;
        opts.password = password;
      } else {
        opts.username = opts.auth;
      }
    }
  }
  function connect$1(brokerUrl, opts) {
    var _a, _b, _c;
    debug2("connecting to an MQTT broker...");
    if (typeof brokerUrl === "object" && !opts) {
      opts = brokerUrl;
      brokerUrl = "";
    }
    opts = opts || {};
    if (brokerUrl && typeof brokerUrl === "string") {
      const parsedUrl = url_1.default.parse(brokerUrl, true);
      const parsedOptions = {};
      if (parsedUrl.port != null) {
        parsedOptions.port = Number(parsedUrl.port);
      }
      parsedOptions.host = parsedUrl.hostname;
      parsedOptions.query = parsedUrl.query;
      parsedOptions.auth = parsedUrl.auth;
      parsedOptions.protocol = parsedUrl.protocol;
      parsedOptions.path = parsedUrl.path;
      opts = { ...parsedOptions, ...opts };
      if (!opts.protocol) {
        throw new Error("Missing protocol");
      }
      opts.protocol = opts.protocol.replace(/:$/, "");
    }
    opts.unixSocket = opts.unixSocket || ((_a = opts.protocol) == null ? void 0 : _a.includes("+unix"));
    if (opts.unixSocket) {
      opts.protocol = opts.protocol.replace("+unix", "");
    } else if (!((_b = opts.protocol) == null ? void 0 : _b.startsWith("ws")) && !((_c = opts.protocol) == null ? void 0 : _c.startsWith("wx"))) {
      delete opts.path;
    }
    parseAuthOptions(opts);
    if (opts.query && typeof opts.query.clientId === "string") {
      opts.clientId = opts.query.clientId;
    }
    if (is_browser_1.default || opts.unixSocket) {
      opts.socksProxy = void 0;
    } else if (opts.socksProxy === void 0 && typeof process !== "undefined") {
      opts.socksProxy = process.env["MQTTJS_SOCKS_PROXY"];
    }
    if (opts.cert && opts.key) {
      if (opts.protocol) {
        if (["mqtts", "wss", "wxs", "alis"].indexOf(opts.protocol) === -1) {
          switch (opts.protocol) {
            case "mqtt":
              opts.protocol = "mqtts";
              break;
            case "ws":
              opts.protocol = "wss";
              break;
            case "wx":
              opts.protocol = "wxs";
              break;
            case "ali":
              opts.protocol = "alis";
              break;
            default:
              throw new Error(`Unknown protocol for secure connection: "${opts.protocol}"!`);
          }
        }
      } else {
        throw new Error("Missing secure protocol key");
      }
    }
    if (!protocols) {
      protocols = {};
      if (!is_browser_1.default && !opts.forceNativeWebSocket) {
        protocols.ws = requireWs().streamBuilder;
        protocols.wss = requireWs().streamBuilder;
        protocols.mqtt = requireTcp().default;
        protocols.tcp = requireTcp().default;
        protocols.ssl = requireTls().default;
        protocols.tls = protocols.ssl;
        protocols.mqtts = requireTls().default;
      } else {
        protocols.ws = requireWs().browserStreamBuilder;
        protocols.wss = requireWs().browserStreamBuilder;
        protocols.wx = requireWx().default;
        protocols.wxs = requireWx().default;
        protocols.ali = requireAli().default;
        protocols.alis = requireAli().default;
      }
    }
    if (!protocols[opts.protocol]) {
      const isSecure = ["mqtts", "wss"].indexOf(opts.protocol) !== -1;
      opts.protocol = [
        "mqtt",
        "mqtts",
        "ws",
        "wss",
        "wx",
        "wxs",
        "ali",
        "alis"
      ].filter((key, index) => {
        if (isSecure && index % 2 === 0) {
          return false;
        }
        return typeof protocols[key] === "function";
      })[0];
    }
    if (opts.clean === false && !opts.clientId) {
      throw new Error("Missing clientId for unclean clients");
    }
    if (opts.protocol) {
      opts.defaultProtocol = opts.protocol;
    }
    function wrapper(client3) {
      if (opts.servers) {
        if (!client3._reconnectCount || client3._reconnectCount === opts.servers.length) {
          client3._reconnectCount = 0;
        }
        opts.host = opts.servers[client3._reconnectCount].host;
        opts.port = opts.servers[client3._reconnectCount].port;
        opts.protocol = !opts.servers[client3._reconnectCount].protocol ? opts.defaultProtocol : opts.servers[client3._reconnectCount].protocol;
        opts.hostname = opts.host;
        client3._reconnectCount++;
      }
      debug2("calling streambuilder for", opts.protocol);
      return protocols[opts.protocol](client3, opts);
    }
    const client2 = new client_1.default(wrapper, opts);
    client2.on("error", () => {
    });
    return client2;
  }
  function connectAsync(brokerUrl, opts, allowRetries = true) {
    return new Promise((resolve, reject) => {
      const client2 = connect$1(brokerUrl, opts);
      const promiseResolutionListeners = {
        connect: (connack2) => {
          removePromiseResolutionListeners();
          resolve(client2);
        },
        end: () => {
          removePromiseResolutionListeners();
          resolve(client2);
        },
        error: (err) => {
          removePromiseResolutionListeners();
          client2.end();
          reject(err);
        }
      };
      if (allowRetries === false) {
        promiseResolutionListeners.close = () => {
          promiseResolutionListeners.error(new Error("Couldn't connect to server"));
        };
      }
      function removePromiseResolutionListeners() {
        Object.keys(promiseResolutionListeners).forEach((eventName) => {
          client2.off(eventName, promiseResolutionListeners[eventName]);
        });
      }
      Object.keys(promiseResolutionListeners).forEach((eventName) => {
        client2.on(eventName, promiseResolutionListeners[eventName]);
      });
    });
  }
  connect.default = connect$1;
  return connect;
}
var hasRequiredMqtt;
function requireMqtt() {
  if (hasRequiredMqtt) return mqtt$2;
  hasRequiredMqtt = 1;
  (function(exports) {
    var __createBinding = mqtt$2 && mqtt$2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = mqtt$2 && mqtt$2.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = mqtt$2 && mqtt$2.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    var __exportStar = mqtt$2 && mqtt$2.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    var __importDefault = mqtt$2 && mqtt$2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReasonCodes = exports.KeepaliveManager = exports.UniqueMessageIdProvider = exports.DefaultMessageIdProvider = exports.Store = exports.MqttClient = exports.connectAsync = exports.connect = exports.Client = void 0;
    const client_1 = __importDefault(requireClient());
    exports.MqttClient = client_1.default;
    const default_message_id_provider_1 = __importDefault(requireDefaultMessageIdProvider());
    exports.DefaultMessageIdProvider = default_message_id_provider_1.default;
    const unique_message_id_provider_1 = __importDefault(requireUniqueMessageIdProvider());
    exports.UniqueMessageIdProvider = unique_message_id_provider_1.default;
    const store_1 = __importDefault(requireStore());
    exports.Store = store_1.default;
    const connect_1 = __importStar(requireConnect());
    exports.connect = connect_1.default;
    Object.defineProperty(exports, "connectAsync", { enumerable: true, get: function() {
      return connect_1.connectAsync;
    } });
    const KeepaliveManager_1 = __importDefault(requireKeepaliveManager());
    exports.KeepaliveManager = KeepaliveManager_1.default;
    exports.Client = client_1.default;
    __exportStar(requireClient(), exports);
    __exportStar(requireShared(), exports);
    __exportStar(requireValidations(), exports);
    var ack_1 = requireAck();
    Object.defineProperty(exports, "ReasonCodes", { enumerable: true, get: function() {
      return ack_1.ReasonCodes;
    } });
  })(mqtt$2);
  return mqtt$2;
}
var hasRequiredBuild;
function requireBuild() {
  if (hasRequiredBuild) return build$1;
  hasRequiredBuild = 1;
  (function(exports) {
    var __createBinding = build$1 && build$1.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = build$1 && build$1.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = build$1 && build$1.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    var __exportStar = build$1 && build$1.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    const mqtt2 = __importStar(requireMqtt());
    exports.default = mqtt2;
    __exportStar(requireMqtt(), exports);
  })(build$1);
  return build$1;
}
var buildExports = requireBuild();
const mqtt = /* @__PURE__ */ getDefaultExportFromCjs(buildExports);
function computeConnectionStatus(item, now) {
  const { payload } = item;
  const refreshMs = ((payload == null ? void 0 : payload.refreshMinutes) || 5) * 6e4;
  const type = payload == null ? void 0 : payload.type;
  if (type === "icmp" || type === "tcp" || type === "dated_file_exists" || type === "file_mtime" || type === "db_currency") {
    if (payload.checkedAt) {
      const staleness = now - new Date(payload.checkedAt).getTime();
      if (staleness > 5 * refreshMs) return "red";
      if (staleness > 3 * refreshMs) return "yellow";
    }
    if (type === "icmp" || type === "tcp") return payload.available ? "green" : "red";
    if (type === "dated_file_exists") {
      if (payload.error) return "red";
      return payload.exists ? "green" : "red";
    }
    if (payload.error) return "red";
    if (payload.ageSeconds == null) return "red";
    const ageMs = payload.ageSeconds * 1e3;
    if (ageMs < 3 * refreshMs) return "green";
    if (ageMs < 5 * refreshMs) return "yellow";
    return "red";
  }
  const lr = item.lastReceivedTracked || (payload == null ? void 0 : payload.lastReceived);
  if (!lr) return "red";
  const age = now - new Date(lr).getTime();
  if (age < 3 * refreshMs) return "green";
  if (age < 5 * refreshMs) return "yellow";
  return "red";
}
function subjectAggregateStatus(downCount, total) {
  if (downCount === 0) return "green";
  return downCount / total > 0.5 ? "red" : "orange";
}
const CONNECTIONS_WILDCARD = "connections/#";
function topicsForSource(source) {
  const base = `${source.projectId}/${source.systemId}`;
  if (source.type === "process_status") return [`${base}/status`];
  if (source.type === "connection_status") return [`${base}/checks/+`];
  return [`${base}/status`, `${base}/checks/+`];
}
function messageTypeForTopic(topic, source) {
  const base = `${source.projectId}/${source.systemId}`;
  if (source.type === "process_status" && topic === `${base}/status`) return "process_status";
  if (source.type === "connection_status" && topic.startsWith(`${base}/checks/`)) return "connection_status";
  if (topic === `${base}/status`) return "process_status";
  if (topic.startsWith(`${base}/checks/`)) return "connection_status";
  return null;
}
function findSourceForTopic(sources, topic) {
  for (const source of sources) {
    const type = messageTypeForTopic(topic, source);
    if (type) return { source, type };
  }
  return null;
}
function buildConnectionUrl(settings2) {
  const protocol = settings2.mqttProtocol || "mqtt";
  if (protocol === "ws" || protocol === "wss") {
    const path2 = (settings2.mqttWsPath || "/").trim();
    const normalizedPath = path2.startsWith("/") ? path2 : `/${path2}`;
    return `${protocol}://${settings2.mqttHost}:${settings2.mqttWsPort}${normalizedPath}`;
  }
  return `${protocol}://${settings2.mqttHost}:${settings2.mqttPort}`;
}
const STALENESS_CHECK_MS = 6e4;
function createMqttRuntime(initialSettings, initialRemovedTopics, handlers2 = {}) {
  let settings2 = initialSettings;
  let mqttClient = null;
  let connectionState = "grey";
  let stalenessInterval = null;
  const items = /* @__PURE__ */ new Map();
  const removedTopics = new Map((initialRemovedTopics || []).map((r) => [r.topicKey, r]));
  function emitItems() {
    var _a;
    (_a = handlers2.onItems) == null ? void 0 : _a.call(handlers2, Object.fromEntries(items));
  }
  function emitRemovedTopics() {
    var _a;
    (_a = handlers2.onRemovedTopics) == null ? void 0 : _a.call(handlers2, [...removedTopics.values()]);
  }
  function setConnectionState(state2) {
    var _a;
    if (connectionState === state2) return;
    connectionState = state2;
    (_a = handlers2.onConnectionState) == null ? void 0 : _a.call(handlers2, state2);
  }
  function connect2(newSettings) {
    settings2 = newSettings;
    if (mqttClient) {
      mqttClient.end(true);
      mqttClient = null;
    }
    items.clear();
    emitItems();
    setConnectionState("grey");
    const url = buildConnectionUrl(settings2);
    const opts = { clean: true, reconnectPeriod: 15e3 };
    if (settings2.mqttUsername) {
      opts.username = settings2.mqttUsername;
      opts.password = settings2.mqttPassword || "";
    }
    console.log(`[MQTT] Connecting to ${url}`);
    mqttClient = mqtt.connect(url, opts);
    mqttClient.on("connect", () => {
      console.log("[MQTT] Connected — subscribing to all source topics");
      for (const source of settings2.sources || []) {
        for (const topic of topicsForSource(source)) {
          mqttClient.subscribe(topic, { qos: 1 });
          console.log(`[MQTT] Subscribed: ${topic}`);
        }
      }
      mqttClient.subscribe(CONNECTIONS_WILDCARD, { qos: 1 });
      console.log(`[MQTT] Subscribed: ${CONNECTIONS_WILDCARD}`);
    });
    mqttClient.on("message", (topic, message) => {
      var _a;
      if (removedTopics.has(topic)) return;
      if (message.length === 0) {
        if (items.delete(topic)) emitItems();
        return;
      }
      let payload;
      try {
        payload = JSON.parse(message.toString());
      } catch {
        return;
      }
      let type, sourceLabel;
      if (topic.startsWith("connections/")) {
        if (!payload.subjectId) return;
        type = "connections_status";
        sourceLabel = payload.subjectLabel || payload.subjectId;
      } else {
        const match = findSourceForTopic(settings2.sources || [], topic);
        if (!match) return;
        type = match.type;
        sourceLabel = match.source.label || match.source.id;
      }
      const existing = items.get(topic);
      let computedStatus;
      let lastReceivedTracked = (existing == null ? void 0 : existing.lastReceivedTracked) ?? null;
      if (type === "connection_status" || type === "connections_status") {
        if (payload.lastReceived) lastReceivedTracked = payload.lastReceived;
        computedStatus = computeConnectionStatus({ payload, lastReceivedTracked }, Date.now());
      } else {
        computedStatus = payload.status || "grey";
      }
      items.set(topic, {
        topicKey: topic,
        messageType: type,
        sourceLabel,
        payload,
        computedStatus,
        lastReceivedTracked,
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      });
      setConnectionState("live");
      emitItems();
      if (type === "process_status" && existing && existing.computedStatus !== computedStatus && connectionState === "live") {
        (_a = handlers2.onProcessStatusChange) == null ? void 0 : _a.call(handlers2, sourceLabel, computedStatus, payload);
      }
    });
    mqttClient.on("error", (err) => {
      console.error("[MQTT] Error:", err.message);
      setConnectionState("black");
    });
    mqttClient.on("close", () => {
      if (connectionState === "live") setConnectionState("grey");
    });
  }
  function recheckStaleness() {
    if (connectionState !== "live") return;
    let changed = false;
    const now = Date.now();
    for (const [key, item] of items) {
      if (item.messageType !== "connection_status" && item.messageType !== "connections_status") continue;
      const newStatus = computeConnectionStatus(item, now);
      if (newStatus !== item.computedStatus) {
        items.set(key, { ...item, computedStatus: newStatus });
        changed = true;
      }
    }
    if (changed) emitItems();
  }
  function removeTopicInternal(topicKey) {
    var _a, _b;
    const item = items.get(topicKey);
    items.delete(topicKey);
    removedTopics.set(topicKey, {
      topicKey,
      sourceLabel: (item == null ? void 0 : item.sourceLabel) || "",
      label: ((_a = item == null ? void 0 : item.payload) == null ? void 0 : _a.label) || ((_b = item == null ? void 0 : item.payload) == null ? void 0 : _b.id) || topicKey
    });
    if (mqttClient == null ? void 0 : mqttClient.connected) {
      mqttClient.publish(topicKey, "", { retain: true, qos: 1 }, (err) => {
        if (err) console.error(`[MQTT] Failed to clear retained: ${topicKey}`, err.message);
        else console.log(`[MQTT] Cleared retained message: ${topicKey}`);
      });
    } else {
      console.warn(`[MQTT] Not connected — removed locally but could not clear retained: ${topicKey}`);
    }
  }
  connect2(settings2);
  stalenessInterval = setInterval(recheckStaleness, STALENESS_CHECK_MS);
  return {
    getSnapshot() {
      return {
        items: Object.fromEntries(items),
        connectionState,
        removedTopics: [...removedTopics.values()]
      };
    },
    // Applies new settings (host/port/protocol/sources/credentials) and
    // reconnects from scratch.
    reconnect(newSettings) {
      connect2(newSettings);
    },
    removeItem(topicKey) {
      removeTopicInternal(topicKey);
      emitItems();
      emitRemovedTopics();
    },
    removeItems(topicKeys) {
      for (const topicKey of topicKeys || []) {
        if (items.has(topicKey)) removeTopicInternal(topicKey);
      }
      emitItems();
      emitRemovedTopics();
    },
    restoreItem(topicKey) {
      removedTopics.delete(topicKey);
      if (mqttClient == null ? void 0 : mqttClient.connected) {
        mqttClient.subscribe(topicKey, { qos: 1 }, (err) => {
          if (err) console.error(`[MQTT] Failed to re-subscribe: ${topicKey}`, err.message);
          else console.log(`[MQTT] Re-subscribed (restored): ${topicKey}`);
        });
      }
      emitRemovedTopics();
    },
    end() {
      clearInterval(stalenessInterval);
      if (mqttClient) mqttClient.end(true);
    }
  };
}
function aggregateItemsStatus(items) {
  var _a;
  const values = Object.values(items || {});
  if (!values.length) return "grey";
  const statuses = [];
  const subjectGroups = /* @__PURE__ */ new Map();
  const now = Date.now();
  for (const item of values) {
    if (item.messageType === "connections_status") {
      const sid = (_a = item.payload) == null ? void 0 : _a.subjectId;
      if (!subjectGroups.has(sid)) subjectGroups.set(sid, []);
      subjectGroups.get(sid).push(item);
    } else if (item.messageType === "connection_status") {
      statuses.push(computeConnectionStatus(item, now));
    } else {
      statuses.push(item.computedStatus || "grey");
    }
  }
  for (const groupItems of subjectGroups.values()) {
    const downCount = groupItems.filter((i) => computeConnectionStatus(i, now) === "red").length;
    const status = subjectAggregateStatus(downCount, groupItems.length);
    statuses.push(status === "orange" ? "yellow" : status);
  }
  if (!statuses.length) return "grey";
  if (statuses.includes("red")) return "red";
  if (statuses.includes("yellow")) return "yellow";
  return "green";
}
if (squirrelStartup) require$$3.app.quit();
process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught exception:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("[FATAL] Unhandled promise rejection:", reason);
});
const SETTINGS_FILE = path.join(require$$3.app.getPath("userData"), "settings.json");
const DEFAULT_SETTINGS = {
  theme: "dark",
  removedTopics: [],
  mqttHost: "24.121.212.206",
  mqttPort: 1883,
  mqttWsPort: 9001,
  mqttWsPath: "/ws",
  mqttProtocol: "mqtt",
  mqttUsername: "",
  mqttPassword: "",
  sources: [
    {
      id: "proc",
      projectId: "cc098b5e-72be-4b91-b272-7303616aaa1f",
      systemId: "82b0c530-21bc-4840-adfe-7e462b3dfa36",
      label: "Process Monitor",
      type: "process_status"
    },
    {
      id: "conn",
      projectId: "1bb37209-8136-44a1-9361-d4e7d25c3d26",
      systemId: "aed0a884-ef2f-47cb-b7d6-01350079320c",
      label: "Connection Monitor",
      type: "connection_status"
    }
  ]
};
function loadSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8")) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}
function saveSettings(settings2) {
  fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true });
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings2, null, 2));
}
function loginItemSettingsFor(openAtLogin) {
  if (process.platform !== "win32") return { openAtLogin };
  const appFolder = path.dirname(process.execPath);
  const updateExe = path.resolve(appFolder, "..", "Update.exe");
  const exeName = path.basename(process.execPath);
  if (fs.existsSync(updateExe)) {
    return { openAtLogin, path: updateExe, args: ["--processStart", `"${exeName}"`] };
  }
  return { openAtLogin };
}
function getAutostart() {
  return require$$3.app.getLoginItemSettings(loginItemSettingsFor(false)).openAtLogin;
}
function setAutostart(enabled) {
  require$$3.app.setLoginItemSettings(loginItemSettingsFor(enabled));
  return getAutostart();
}
let tray = null;
let mainWindow = null;
let isQuitting = false;
let settings = loadSettings();
let currentConnectionState = "grey";
let currentItems = {};
function currentTrayStatus() {
  if (currentConnectionState === "black") return "black";
  if (currentConnectionState === "grey") return "grey";
  return aggregateItemsStatus(currentItems);
}
function statusLabel(s) {
  const labels = {
    green: "All Systems OK",
    yellow: "Degraded",
    red: "Issues Detected",
    grey: "Connecting…",
    black: "Broker Unreachable"
  };
  return labels[s] || "Unknown";
}
function buildContextMenu(status) {
  return require$$3.Menu.buildFromTemplate([
    { label: "Ping Monitor", enabled: false },
    { label: `Status: ${statusLabel(status)}`, enabled: false },
    { type: "separator" },
    { label: "Open Details", click: () => showWindow() },
    { type: "separator" },
    { label: "Quit", click: () => require$$3.app.quit() }
  ]);
}
function updateTray(status) {
  if (!tray) return;
  tray.setImage(icons[status] || icons.grey);
  tray.setToolTip(`Ping Monitor — ${statusLabel(status)}`);
  tray.setContextMenu(buildContextMenu(status));
}
function createWindow() {
  const trayBounds = tray ? tray.getBounds() : null;
  const display = trayBounds && trayBounds.width ? require$$3.screen.getDisplayNearestPoint({ x: trayBounds.x, y: trayBounds.y }) : require$$3.screen.getPrimaryDisplay();
  const height = Math.round(display.workAreaSize.height * 0.9);
  mainWindow = new require$$3.BrowserWindow({
    width: 460,
    height,
    resizable: false,
    skipTaskbar: true,
    show: false,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  {
    mainWindow.loadURL("http://localhost:5173");
  }
  mainWindow.on("close", (e) => {
    if (isQuitting) return;
    e.preventDefault();
    mainWindow.hide();
  });
  mainWindow.on("blur", () => {
    if (!mainWindow.webContents.isDevToolsOpened()) mainWindow.hide();
  });
}
function showWindow() {
  if (!mainWindow) createWindow();
  const trayBounds = tray.getBounds();
  const windowBounds = mainWindow.getBounds();
  const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);
  const y = trayBounds.y > 400 ? trayBounds.y - windowBounds.height - 4 : trayBounds.y + trayBounds.height + 4;
  mainWindow.setPosition(x, y);
  mainWindow.show();
  mainWindow.focus();
}
function broadcastItems(itemsObj) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("mqtt:items", itemsObj);
  }
}
function broadcastRemovedTopics(removedTopicsArray) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("mqtt:removedTopics", removedTopicsArray);
  }
}
function broadcastConnectionState(state2) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("mqtt:connection", state2);
  }
}
function sendProcessNotification(sourceLabel, status, payload) {
  if (!require$$3.Notification.isSupported()) return;
  const titles = { green: "Pipeline OK", yellow: "Pipeline Warning", red: "Pipeline Error" };
  new require$$3.Notification({
    title: `${sourceLabel} — ${titles[status] || "Status Changed"}`,
    body: payload.detail || "",
    urgency: status === "red" ? "critical" : "normal"
  }).show();
}
const runtime = createMqttRuntime(settings, settings.removedTopics || [], {
  onItems: (itemsObj) => {
    currentItems = itemsObj;
    updateTray(currentTrayStatus());
    broadcastItems(itemsObj);
  },
  onConnectionState: (state2) => {
    currentConnectionState = state2;
    updateTray(currentTrayStatus());
    broadcastConnectionState(state2);
  },
  onRemovedTopics: (removedTopicsArray) => {
    settings = { ...settings, removedTopics: removedTopicsArray };
    saveSettings(settings);
    broadcastRemovedTopics(removedTopicsArray);
  },
  onProcessStatusChange: sendProcessNotification
});
require$$3.app.whenReady().then(() => {
  if (require$$3.app.dock) require$$3.app.dock.hide();
  tray = new require$$3.Tray(icons.grey);
  updateTray(currentTrayStatus());
  tray.on("click", () => {
    if (mainWindow && mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      showWindow();
    }
  });
});
require$$3.app.on("before-quit", () => {
  isQuitting = true;
});
require$$3.app.on("window-all-closed", () => {
});
require$$3.app.on("will-quit", () => runtime.end());
require$$3.ipcMain.handle("items:get", () => runtime.getSnapshot());
require$$3.ipcMain.handle("settings:get", () => settings);
require$$3.ipcMain.handle("settings:save", (_e, newSettings) => {
  settings = { ...settings, ...newSettings };
  saveSettings(settings);
  runtime.reconnect(settings);
  return { ok: true };
});
require$$3.ipcMain.handle("items:remove", (_e, topicKey) => {
  runtime.removeItem(topicKey);
  return { ok: true };
});
require$$3.ipcMain.handle("items:removeMany", (_e, topicKeys) => {
  const keys = Array.isArray(topicKeys) ? topicKeys : [];
  runtime.removeItems(keys);
  return { ok: true, removed: keys.length };
});
require$$3.ipcMain.handle("items:getRemovedTopics", () => runtime.getSnapshot().removedTopics);
require$$3.ipcMain.handle("items:restore", (_e, topicKey) => {
  runtime.restoreItem(topicKey);
  return { ok: true };
});
require$$3.ipcMain.handle("shell:openExternal", (_e, url) => require$$3.shell.openExternal(url));
require$$3.ipcMain.handle("autostart:get", () => getAutostart());
require$$3.ipcMain.handle("autostart:set", (_e, enabled) => ({ ok: true, enabled: setAutostart(!!enabled) }));
require$$3.ipcMain.handle("theme:get", () => settings.theme || "dark");
require$$3.ipcMain.handle("theme:set", (_e, mode) => {
  settings = { ...settings, theme: mode === "light" ? "light" : "dark" };
  saveSettings(settings);
  return { ok: true, theme: settings.theme };
});
