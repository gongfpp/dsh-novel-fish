(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/.pnpm/jszip@3.10.2/node_modules/jszip/dist/jszip.min.js
  var require_jszip_min = __commonJS({
    "node_modules/.pnpm/jszip@3.10.2/node_modules/jszip/dist/jszip.min.js"(exports, module) {
      !(function(e) {
        if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
        else if ("function" == typeof define && define.amd) define([], e);
        else {
          ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).JSZip = e();
        }
      })(function() {
        return (function s(a, o, h) {
          function u(r, e2) {
            if (!o[r]) {
              if (!a[r]) {
                var t = "function" == typeof __require && __require;
                if (!e2 && t) return t(r, true);
                if (l) return l(r, true);
                var n = new Error("Cannot find module '" + r + "'");
                throw n.code = "MODULE_NOT_FOUND", n;
              }
              var i = o[r] = { exports: {} };
              a[r][0].call(i.exports, function(e3) {
                var t2 = a[r][1][e3];
                return u(t2 || e3);
              }, i, i.exports, s, a, o, h);
            }
            return o[r].exports;
          }
          for (var l = "function" == typeof __require && __require, e = 0; e < h.length; e++) u(h[e]);
          return u;
        })({ 1: [function(e, t, r) {
          "use strict";
          var d = e("./utils"), c = e("./support"), p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
          r.encode = function(e2) {
            for (var t2, r2, n, i, s, a, o, h = [], u = 0, l = e2.length, f = l, c2 = "string" !== d.getTypeOf(e2); u < e2.length; ) f = l - u, n = c2 ? (t2 = e2[u++], r2 = u < l ? e2[u++] : 0, u < l ? e2[u++] : 0) : (t2 = e2.charCodeAt(u++), r2 = u < l ? e2.charCodeAt(u++) : 0, u < l ? e2.charCodeAt(u++) : 0), i = t2 >> 2, s = (3 & t2) << 4 | r2 >> 4, a = 1 < f ? (15 & r2) << 2 | n >> 6 : 64, o = 2 < f ? 63 & n : 64, h.push(p.charAt(i) + p.charAt(s) + p.charAt(a) + p.charAt(o));
            return h.join("");
          }, r.decode = function(e2) {
            var t2, r2, n, i, s, a, o = 0, h = 0, u = "data:";
            if (e2.substr(0, u.length) === u) throw new Error("Invalid base64 input, it looks like a data url.");
            var l, f = 3 * (e2 = e2.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
            if (e2.charAt(e2.length - 1) === p.charAt(64) && f--, e2.charAt(e2.length - 2) === p.charAt(64) && f--, f % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
            for (l = c.uint8array ? new Uint8Array(0 | f) : new Array(0 | f); o < e2.length; ) t2 = p.indexOf(e2.charAt(o++)) << 2 | (i = p.indexOf(e2.charAt(o++))) >> 4, r2 = (15 & i) << 4 | (s = p.indexOf(e2.charAt(o++))) >> 2, n = (3 & s) << 6 | (a = p.indexOf(e2.charAt(o++))), l[h++] = t2, 64 !== s && (l[h++] = r2), 64 !== a && (l[h++] = n);
            return l;
          };
        }, { "./support": 30, "./utils": 32 }], 2: [function(e, t, r) {
          "use strict";
          var n = e("./external"), i = e("./stream/DataWorker"), s = e("./stream/Crc32Probe"), a = e("./stream/DataLengthProbe");
          function o(e2, t2, r2, n2, i2) {
            this.compressedSize = e2, this.uncompressedSize = t2, this.crc32 = r2, this.compression = n2, this.compressedContent = i2;
          }
          o.prototype = { getContentWorker: function() {
            var e2 = new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")), t2 = this;
            return e2.on("end", function() {
              if (this.streamInfo.data_length !== t2.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
            }), e2;
          }, getCompressedWorker: function() {
            return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
          } }, o.createWorkerFrom = function(e2, t2, r2) {
            return e2.pipe(new s()).pipe(new a("uncompressedSize")).pipe(t2.compressWorker(r2)).pipe(new a("compressedSize")).withStreamInfo("compression", t2);
          }, t.exports = o;
        }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, t, r) {
          "use strict";
          var n = e("./stream/GenericWorker");
          r.STORE = { magic: "\0\0", compressWorker: function() {
            return new n("STORE compression");
          }, uncompressWorker: function() {
            return new n("STORE decompression");
          } }, r.DEFLATE = e("./flate");
        }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, t, r) {
          "use strict";
          var n = e("./utils");
          var o = (function() {
            for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
              e2 = r2;
              for (var n2 = 0; n2 < 8; n2++) e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
              t2[r2] = e2;
            }
            return t2;
          })();
          t.exports = function(e2, t2) {
            return void 0 !== e2 && e2.length ? "string" !== n.getTypeOf(e2) ? (function(e3, t3, r2, n2) {
              var i = o, s = n2 + r2;
              e3 ^= -1;
              for (var a = n2; a < s; a++) e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3[a])];
              return -1 ^ e3;
            })(0 | t2, e2, e2.length, 0) : (function(e3, t3, r2, n2) {
              var i = o, s = n2 + r2;
              e3 ^= -1;
              for (var a = n2; a < s; a++) e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3.charCodeAt(a))];
              return -1 ^ e3;
            })(0 | t2, e2, e2.length, 0) : 0;
          };
        }, { "./utils": 32 }], 5: [function(e, t, r) {
          "use strict";
          r.base64 = false, r.binary = false, r.dir = false, r.createFolders = true, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
        }, {}], 6: [function(e, t, r) {
          "use strict";
          var n = null;
          n = "undefined" != typeof Promise ? Promise : e("lie"), t.exports = { Promise: n };
        }, { lie: 37 }], 7: [function(e, t, r) {
          "use strict";
          var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array, i = e("pako"), s = e("./utils"), a = e("./stream/GenericWorker"), o = n ? "uint8array" : "array";
          function h(e2, t2) {
            a.call(this, "FlateWorker/" + e2), this._pako = null, this._pakoAction = e2, this._pakoOptions = t2, this.meta = {};
          }
          r.magic = "\b\0", s.inherits(h, a), h.prototype.processChunk = function(e2) {
            this.meta = e2.meta, null === this._pako && this._createPako(), this._pako.push(s.transformTo(o, e2.data), false);
          }, h.prototype.flush = function() {
            a.prototype.flush.call(this), null === this._pako && this._createPako(), this._pako.push([], true);
          }, h.prototype.cleanUp = function() {
            a.prototype.cleanUp.call(this), this._pako = null;
          }, h.prototype._createPako = function() {
            this._pako = new i[this._pakoAction]({ raw: true, level: this._pakoOptions.level || -1 });
            var t2 = this;
            this._pako.onData = function(e2) {
              t2.push({ data: e2, meta: t2.meta });
            };
          }, r.compressWorker = function(e2) {
            return new h("Deflate", e2);
          }, r.uncompressWorker = function() {
            return new h("Inflate", {});
          };
        }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, t, r) {
          "use strict";
          function A(e2, t2) {
            var r2, n2 = "";
            for (r2 = 0; r2 < t2; r2++) n2 += String.fromCharCode(255 & e2), e2 >>>= 8;
            return n2;
          }
          function n(e2, t2, r2, n2, i2, s2) {
            var a, o, h = e2.file, u = e2.compression, l = s2 !== O.utf8encode, f = I.transformTo("string", s2(h.name)), c = I.transformTo("string", O.utf8encode(h.name)), d = h.comment, p = I.transformTo("string", s2(d)), m = I.transformTo("string", O.utf8encode(d)), _ = c.length !== h.name.length, g = m.length !== d.length, b = "", v = "", y = "", w = h.dir, k = h.date, x = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
            t2 && !r2 || (x.crc32 = e2.crc32, x.compressedSize = e2.compressedSize, x.uncompressedSize = e2.uncompressedSize);
            var S = 0;
            t2 && (S |= 8), l || !_ && !g || (S |= 2048);
            var z = 0, C = 0;
            w && (z |= 16), "UNIX" === i2 ? (C = 798, z |= (function(e3, t3) {
              var r3 = e3;
              return e3 || (r3 = t3 ? 16893 : 33204), (65535 & r3) << 16;
            })(h.unixPermissions, w)) : (C = 20, z |= (function(e3) {
              return 63 & (e3 || 0);
            })(h.dosPermissions)), a = k.getUTCHours(), a <<= 6, a |= k.getUTCMinutes(), a <<= 5, a |= k.getUTCSeconds() / 2, o = k.getUTCFullYear() - 1980, o <<= 4, o |= k.getUTCMonth() + 1, o <<= 5, o |= k.getUTCDate(), _ && (v = A(1, 1) + A(B(f), 4) + c, b += "up" + A(v.length, 2) + v), g && (y = A(1, 1) + A(B(p), 4) + m, b += "uc" + A(y.length, 2) + y);
            var E = "";
            return E += "\n\0", E += A(S, 2), E += u.magic, E += A(a, 2), E += A(o, 2), E += A(x.crc32, 4), E += A(x.compressedSize, 4), E += A(x.uncompressedSize, 4), E += A(f.length, 2), E += A(b.length, 2), { fileRecord: R.LOCAL_FILE_HEADER + E + f + b, dirRecord: R.CENTRAL_FILE_HEADER + A(C, 2) + E + A(p.length, 2) + "\0\0\0\0" + A(z, 4) + A(n2, 4) + f + b + p };
          }
          var I = e("../utils"), i = e("../stream/GenericWorker"), O = e("../utf8"), B = e("../crc32"), R = e("../signature");
          function s(e2, t2, r2, n2) {
            i.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = t2, this.zipPlatform = r2, this.encodeFileName = n2, this.streamFiles = e2, this.accumulate = false, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
          }
          I.inherits(s, i), s.prototype.push = function(e2) {
            var t2 = e2.meta.percent || 0, r2 = this.entriesCount, n2 = this._sources.length;
            this.accumulate ? this.contentBuffer.push(e2) : (this.bytesWritten += e2.data.length, i.prototype.push.call(this, { data: e2.data, meta: { currentFile: this.currentFile, percent: r2 ? (t2 + 100 * (r2 - n2 - 1)) / r2 : 100 } }));
          }, s.prototype.openedSource = function(e2) {
            this.currentSourceOffset = this.bytesWritten, this.currentFile = e2.file.name;
            var t2 = this.streamFiles && !e2.file.dir;
            if (t2) {
              var r2 = n(e2, t2, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
              this.push({ data: r2.fileRecord, meta: { percent: 0 } });
            } else this.accumulate = true;
          }, s.prototype.closedSource = function(e2) {
            this.accumulate = false;
            var t2 = this.streamFiles && !e2.file.dir, r2 = n(e2, t2, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            if (this.dirRecords.push(r2.dirRecord), t2) this.push({ data: (function(e3) {
              return R.DATA_DESCRIPTOR + A(e3.crc32, 4) + A(e3.compressedSize, 4) + A(e3.uncompressedSize, 4);
            })(e2), meta: { percent: 100 } });
            else for (this.push({ data: r2.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
            this.currentFile = null;
          }, s.prototype.flush = function() {
            for (var e2 = this.bytesWritten, t2 = 0; t2 < this.dirRecords.length; t2++) this.push({ data: this.dirRecords[t2], meta: { percent: 100 } });
            var r2 = this.bytesWritten - e2, n2 = (function(e3, t3, r3, n3, i2) {
              var s2 = I.transformTo("string", i2(n3));
              return R.CENTRAL_DIRECTORY_END + "\0\0\0\0" + A(e3, 2) + A(e3, 2) + A(t3, 4) + A(r3, 4) + A(s2.length, 2) + s2;
            })(this.dirRecords.length, r2, e2, this.zipComment, this.encodeFileName);
            this.push({ data: n2, meta: { percent: 100 } });
          }, s.prototype.prepareNextSource = function() {
            this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
          }, s.prototype.registerPrevious = function(e2) {
            this._sources.push(e2);
            var t2 = this;
            return e2.on("data", function(e3) {
              t2.processChunk(e3);
            }), e2.on("end", function() {
              t2.closedSource(t2.previous.streamInfo), t2._sources.length ? t2.prepareNextSource() : t2.end();
            }), e2.on("error", function(e3) {
              t2.error(e3);
            }), this;
          }, s.prototype.resume = function() {
            return !!i.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), true) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), true));
          }, s.prototype.error = function(e2) {
            var t2 = this._sources;
            if (!i.prototype.error.call(this, e2)) return false;
            for (var r2 = 0; r2 < t2.length; r2++) try {
              t2[r2].error(e2);
            } catch (e3) {
            }
            return true;
          }, s.prototype.lock = function() {
            i.prototype.lock.call(this);
            for (var e2 = this._sources, t2 = 0; t2 < e2.length; t2++) e2[t2].lock();
          }, t.exports = s;
        }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, t, r) {
          "use strict";
          var u = e("../compressions"), n = e("./ZipFileWorker");
          r.generateWorker = function(e2, a, t2) {
            var o = new n(a.streamFiles, t2, a.platform, a.encodeFileName), h = 0;
            try {
              e2.forEach(function(e3, t3) {
                h++;
                var r2 = (function(e4, t4) {
                  var r3 = e4 || t4, n3 = u[r3];
                  if (!n3) throw new Error(r3 + " is not a valid compression method !");
                  return n3;
                })(t3.options.compression, a.compression), n2 = t3.options.compressionOptions || a.compressionOptions || {}, i = t3.dir, s = t3.date;
                t3._compressWorker(r2, n2).withStreamInfo("file", { name: e3, dir: i, date: s, comment: t3.comment || "", unixPermissions: t3.unixPermissions, dosPermissions: t3.dosPermissions }).pipe(o);
              }), o.entriesCount = h;
            } catch (e3) {
              o.error(e3);
            }
            return o;
          };
        }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, t, r) {
          "use strict";
          function n() {
            if (!(this instanceof n)) return new n();
            if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
            this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
              var e2 = new n();
              for (var t2 in this) "function" != typeof this[t2] && (e2[t2] = this[t2]);
              return e2;
            };
          }
          (n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.10.2", n.loadAsync = function(e2, t2) {
            return new n().loadAsync(e2, t2);
          }, n.external = e("./external"), t.exports = n;
        }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, t, r) {
          "use strict";
          var u = e("./utils"), i = e("./external"), n = e("./utf8"), s = e("./zipEntries"), a = e("./stream/Crc32Probe"), l = e("./nodejsUtils");
          function f(n2) {
            return new i.Promise(function(e2, t2) {
              var r2 = n2.decompressed.getContentWorker().pipe(new a());
              r2.on("error", function(e3) {
                t2(e3);
              }).on("end", function() {
                r2.streamInfo.crc32 !== n2.decompressed.crc32 ? t2(new Error("Corrupted zip : CRC32 mismatch")) : e2();
              }).resume();
            });
          }
          t.exports = function(e2, o) {
            var h = this;
            return o = u.extend(o || {}, { base64: false, checkCRC32: false, optimizedBinaryString: false, createFolders: false, decodeFileName: n.utf8decode }), l.isNode && l.isStream(e2) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : u.prepareContent("the loaded zip file", e2, true, o.optimizedBinaryString, o.base64).then(function(e3) {
              var t2 = new s(o);
              return t2.load(e3), t2;
            }).then(function(e3) {
              var t2 = [i.Promise.resolve(e3)], r2 = e3.files;
              if (o.checkCRC32) for (var n2 = 0; n2 < r2.length; n2++) t2.push(f(r2[n2]));
              return i.Promise.all(t2);
            }).then(function(e3) {
              for (var t2 = e3.shift(), r2 = t2.files, n2 = 0; n2 < r2.length; n2++) {
                var i2 = r2[n2], s2 = i2.fileNameStr, a2 = u.resolve(i2.fileNameStr);
                h.file(a2, i2.decompressed, { binary: true, optimizedBinaryString: true, date: i2.date, dir: i2.dir, comment: i2.fileCommentStr.length ? i2.fileCommentStr : null, unixPermissions: i2.unixPermissions, dosPermissions: i2.dosPermissions, createFolders: o.createFolders }), i2.dir || (h.file(a2).unsafeOriginalName = s2);
              }
              return t2.zipComment.length && (h.comment = t2.zipComment), h;
            });
          };
        }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("../stream/GenericWorker");
          function s(e2, t2) {
            i.call(this, "Nodejs stream input adapter for " + e2), this._upstreamEnded = false, this._bindStream(t2);
          }
          n.inherits(s, i), s.prototype._bindStream = function(e2) {
            var t2 = this;
            (this._stream = e2).pause(), e2.on("data", function(e3) {
              t2.push({ data: e3, meta: { percent: 0 } });
            }).on("error", function(e3) {
              t2.isPaused ? this.generatedError = e3 : t2.error(e3);
            }).on("end", function() {
              t2.isPaused ? t2._upstreamEnded = true : t2.end();
            });
          }, s.prototype.pause = function() {
            return !!i.prototype.pause.call(this) && (this._stream.pause(), true);
          }, s.prototype.resume = function() {
            return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), true);
          }, t.exports = s;
        }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, t, r) {
          "use strict";
          var i = e("readable-stream").Readable;
          function n(e2, t2, r2) {
            i.call(this, t2), this._helper = e2;
            var n2 = this;
            e2.on("data", function(e3, t3) {
              n2.push(e3) || n2._helper.pause(), r2 && r2(t3);
            }).on("error", function(e3) {
              n2.emit("error", e3);
            }).on("end", function() {
              n2.push(null);
            });
          }
          e("../utils").inherits(n, i), n.prototype._read = function() {
            this._helper.resume();
          }, t.exports = n;
        }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, t, r) {
          "use strict";
          t.exports = { isNode: "undefined" != typeof Buffer, newBufferFrom: function(e2, t2) {
            if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(e2, t2);
            if ("number" == typeof e2) throw new Error('The "data" argument must not be a number');
            return new Buffer(e2, t2);
          }, allocBuffer: function(e2) {
            if (Buffer.alloc) return Buffer.alloc(e2);
            var t2 = new Buffer(e2);
            return t2.fill(0), t2;
          }, isBuffer: function(e2) {
            return Buffer.isBuffer(e2);
          }, isStream: function(e2) {
            return e2 && "function" == typeof e2.on && "function" == typeof e2.pause && "function" == typeof e2.resume;
          } };
        }, {}], 15: [function(e, t, r) {
          "use strict";
          function s(e2, t2, r2) {
            var n2, i2 = u.getTypeOf(t2), s2 = u.extend(r2 || {}, f);
            s2.date = s2.date || /* @__PURE__ */ new Date(), null !== s2.compression && (s2.compression = s2.compression.toUpperCase()), "string" == typeof s2.unixPermissions && (s2.unixPermissions = parseInt(s2.unixPermissions, 8)), s2.unixPermissions && 16384 & s2.unixPermissions && (s2.dir = true), s2.dosPermissions && 16 & s2.dosPermissions && (s2.dir = true), s2.dir && (e2 = g(e2)), s2.createFolders && (n2 = _(e2)) && b.call(this, n2, true);
            var a2 = "string" === i2 && false === s2.binary && false === s2.base64;
            r2 && void 0 !== r2.binary || (s2.binary = !a2), (t2 instanceof c && 0 === t2.uncompressedSize || s2.dir || !t2 || 0 === t2.length) && (s2.base64 = false, s2.binary = true, t2 = "", s2.compression = "STORE", i2 = "string");
            var o2 = null;
            o2 = t2 instanceof c || t2 instanceof l ? t2 : p.isNode && p.isStream(t2) ? new m(e2, t2) : u.prepareContent(e2, t2, s2.binary, s2.optimizedBinaryString, s2.base64);
            var h2 = new d(e2, o2, s2);
            this.files[e2] = h2;
          }
          var i = e("./utf8"), u = e("./utils"), l = e("./stream/GenericWorker"), a = e("./stream/StreamHelper"), f = e("./defaults"), c = e("./compressedObject"), d = e("./zipObject"), o = e("./generate"), p = e("./nodejsUtils"), m = e("./nodejs/NodejsStreamInputAdapter"), _ = function(e2) {
            "/" === e2.slice(-1) && (e2 = e2.substring(0, e2.length - 1));
            var t2 = e2.lastIndexOf("/");
            return 0 < t2 ? e2.substring(0, t2) : "";
          }, g = function(e2) {
            return "/" !== e2.slice(-1) && (e2 += "/"), e2;
          }, b = function(e2, t2) {
            return t2 = void 0 !== t2 ? t2 : f.createFolders, e2 = g(e2), this.files[e2] || s.call(this, e2, null, { dir: true, createFolders: t2 }), this.files[e2];
          };
          function h(e2) {
            return "[object RegExp]" === Object.prototype.toString.call(e2);
          }
          var n = { load: function() {
            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
          }, forEach: function(e2) {
            var t2, r2, n2;
            for (t2 in this.files) n2 = this.files[t2], (r2 = t2.slice(this.root.length, t2.length)) && t2.slice(0, this.root.length) === this.root && e2(r2, n2);
          }, filter: function(r2) {
            var n2 = [];
            return this.forEach(function(e2, t2) {
              r2(e2, t2) && n2.push(t2);
            }), n2;
          }, file: function(e2, t2, r2) {
            if (1 !== arguments.length) return e2 = this.root + e2, s.call(this, e2, t2, r2), this;
            if (h(e2)) {
              var n2 = e2;
              return this.filter(function(e3, t3) {
                return !t3.dir && n2.test(e3);
              });
            }
            var i2 = this.files[this.root + e2];
            return i2 && !i2.dir ? i2 : null;
          }, folder: function(r2) {
            if (!r2) return this;
            if (h(r2)) return this.filter(function(e3, t3) {
              return t3.dir && r2.test(e3);
            });
            var e2 = this.root + r2, t2 = b.call(this, e2), n2 = this.clone();
            return n2.root = t2.name, n2;
          }, remove: function(r2) {
            r2 = this.root + r2;
            var e2 = this.files[r2];
            if (e2 || ("/" !== r2.slice(-1) && (r2 += "/"), e2 = this.files[r2]), e2 && !e2.dir) delete this.files[r2];
            else for (var t2 = this.filter(function(e3, t3) {
              return t3.name.slice(0, r2.length) === r2;
            }), n2 = 0; n2 < t2.length; n2++) delete this.files[t2[n2].name];
            return this;
          }, generate: function() {
            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
          }, generateInternalStream: function(e2) {
            var t2, r2 = {};
            try {
              if ((r2 = u.extend(e2 || {}, { streamFiles: false, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = r2.type.toLowerCase(), r2.compression = r2.compression.toUpperCase(), "binarystring" === r2.type && (r2.type = "string"), !r2.type) throw new Error("No output type specified.");
              u.checkSupport(r2.type), "darwin" !== r2.platform && "freebsd" !== r2.platform && "linux" !== r2.platform && "sunos" !== r2.platform || (r2.platform = "UNIX"), "win32" === r2.platform && (r2.platform = "DOS");
              var n2 = r2.comment || this.comment || "";
              t2 = o.generateWorker(this, r2, n2);
            } catch (e3) {
              (t2 = new l("error")).error(e3);
            }
            return new a(t2, r2.type || "string", r2.mimeType);
          }, generateAsync: function(e2, t2) {
            return this.generateInternalStream(e2).accumulate(t2);
          }, generateNodeStream: function(e2, t2) {
            return (e2 = e2 || {}).type || (e2.type = "nodebuffer"), this.generateInternalStream(e2).toNodejsStream(t2);
          } };
          t.exports = n;
        }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, t, r) {
          "use strict";
          t.exports = e("stream");
        }, { stream: void 0 }], 17: [function(e, t, r) {
          "use strict";
          var n = e("./DataReader");
          function i(e2) {
            n.call(this, e2);
            for (var t2 = 0; t2 < this.data.length; t2++) e2[t2] = 255 & e2[t2];
          }
          e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
            return this.data[this.zero + e2];
          }, i.prototype.lastIndexOfSignature = function(e2) {
            for (var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.length - 4; 0 <= s; --s) if (this.data[s] === t2 && this.data[s + 1] === r2 && this.data[s + 2] === n2 && this.data[s + 3] === i2) return s - this.zero;
            return -1;
          }, i.prototype.readAndCheckSignature = function(e2) {
            var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.readData(4);
            return t2 === s[0] && r2 === s[1] && n2 === s[2] && i2 === s[3];
          }, i.prototype.readData = function(e2) {
            if (this.checkOffset(e2), 0 === e2) return [];
            var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, t, r) {
          "use strict";
          var n = e("../utils");
          function i(e2) {
            this.data = e2, this.length = e2.length, this.index = 0, this.zero = 0;
          }
          i.prototype = { checkOffset: function(e2) {
            this.checkIndex(this.index + e2);
          }, checkIndex: function(e2) {
            if (this.length < this.zero + e2 || e2 < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + e2 + "). Corrupted zip ?");
          }, setIndex: function(e2) {
            this.checkIndex(e2), this.index = e2;
          }, skip: function(e2) {
            this.setIndex(this.index + e2);
          }, byteAt: function() {
          }, readInt: function(e2) {
            var t2, r2 = 0;
            for (this.checkOffset(e2), t2 = this.index + e2 - 1; t2 >= this.index; t2--) r2 = (r2 << 8) + this.byteAt(t2);
            return this.index += e2, r2;
          }, readString: function(e2) {
            return n.transformTo("string", this.readData(e2));
          }, readData: function() {
          }, lastIndexOfSignature: function() {
          }, readAndCheckSignature: function() {
          }, readDate: function() {
            var e2 = this.readInt(4);
            return new Date(Date.UTC(1980 + (e2 >> 25 & 127), (e2 >> 21 & 15) - 1, e2 >> 16 & 31, e2 >> 11 & 31, e2 >> 5 & 63, (31 & e2) << 1));
          } }, t.exports = i;
        }, { "../utils": 32 }], 19: [function(e, t, r) {
          "use strict";
          var n = e("./Uint8ArrayReader");
          function i(e2) {
            n.call(this, e2);
          }
          e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
            this.checkOffset(e2);
            var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, t, r) {
          "use strict";
          var n = e("./DataReader");
          function i(e2) {
            n.call(this, e2);
          }
          e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
            return this.data.charCodeAt(this.zero + e2);
          }, i.prototype.lastIndexOfSignature = function(e2) {
            return this.data.lastIndexOf(e2) - this.zero;
          }, i.prototype.readAndCheckSignature = function(e2) {
            return e2 === this.readData(4);
          }, i.prototype.readData = function(e2) {
            this.checkOffset(e2);
            var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, t, r) {
          "use strict";
          var n = e("./ArrayReader");
          function i(e2) {
            n.call(this, e2);
          }
          e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
            if (this.checkOffset(e2), 0 === e2) return new Uint8Array(0);
            var t2 = this.data.subarray(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("../support"), s = e("./ArrayReader"), a = e("./StringReader"), o = e("./NodeBufferReader"), h = e("./Uint8ArrayReader");
          t.exports = function(e2) {
            var t2 = n.getTypeOf(e2);
            return n.checkSupport(t2), "string" !== t2 || i.uint8array ? "nodebuffer" === t2 ? new o(e2) : i.uint8array ? new h(n.transformTo("uint8array", e2)) : new s(n.transformTo("array", e2)) : new a(e2);
          };
        }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, t, r) {
          "use strict";
          r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\x07\b";
        }, {}], 24: [function(e, t, r) {
          "use strict";
          var n = e("./GenericWorker"), i = e("../utils");
          function s(e2) {
            n.call(this, "ConvertWorker to " + e2), this.destType = e2;
          }
          i.inherits(s, n), s.prototype.processChunk = function(e2) {
            this.push({ data: i.transformTo(this.destType, e2.data), meta: e2.meta });
          }, t.exports = s;
        }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, t, r) {
          "use strict";
          var n = e("./GenericWorker"), i = e("../crc32");
          function s() {
            n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
          }
          e("../utils").inherits(s, n), s.prototype.processChunk = function(e2) {
            this.streamInfo.crc32 = i(e2.data, this.streamInfo.crc32 || 0), this.push(e2);
          }, t.exports = s;
        }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("./GenericWorker");
          function s(e2) {
            i.call(this, "DataLengthProbe for " + e2), this.propName = e2, this.withStreamInfo(e2, 0);
          }
          n.inherits(s, i), s.prototype.processChunk = function(e2) {
            if (e2) {
              var t2 = this.streamInfo[this.propName] || 0;
              this.streamInfo[this.propName] = t2 + e2.data.length;
            }
            i.prototype.processChunk.call(this, e2);
          }, t.exports = s;
        }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("./GenericWorker");
          function s(e2) {
            i.call(this, "DataWorker");
            var t2 = this;
            this.dataIsReady = false, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = false, e2.then(function(e3) {
              t2.dataIsReady = true, t2.data = e3, t2.max = e3 && e3.length || 0, t2.type = n.getTypeOf(e3), t2.isPaused || t2._tickAndRepeat();
            }, function(e3) {
              t2.error(e3);
            });
          }
          n.inherits(s, i), s.prototype.cleanUp = function() {
            i.prototype.cleanUp.call(this), this.data = null;
          }, s.prototype.resume = function() {
            return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = true, n.delay(this._tickAndRepeat, [], this)), true);
          }, s.prototype._tickAndRepeat = function() {
            this._tickScheduled = false, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = true));
          }, s.prototype._tick = function() {
            if (this.isPaused || this.isFinished) return false;
            var e2 = null, t2 = Math.min(this.max, this.index + 16384);
            if (this.index >= this.max) return this.end();
            switch (this.type) {
              case "string":
                e2 = this.data.substring(this.index, t2);
                break;
              case "uint8array":
                e2 = this.data.subarray(this.index, t2);
                break;
              case "array":
              case "nodebuffer":
                e2 = this.data.slice(this.index, t2);
            }
            return this.index = t2, this.push({ data: e2, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
          }, t.exports = s;
        }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, t, r) {
          "use strict";
          function n(e2) {
            this.name = e2 || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = true, this.isFinished = false, this.isLocked = false, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
          }
          n.prototype = { push: function(e2) {
            this.emit("data", e2);
          }, end: function() {
            if (this.isFinished) return false;
            this.flush();
            try {
              this.emit("end"), this.cleanUp(), this.isFinished = true;
            } catch (e2) {
              this.emit("error", e2);
            }
            return true;
          }, error: function(e2) {
            return !this.isFinished && (this.isPaused ? this.generatedError = e2 : (this.isFinished = true, this.emit("error", e2), this.previous && this.previous.error(e2), this.cleanUp()), true);
          }, on: function(e2, t2) {
            return this._listeners[e2].push(t2), this;
          }, cleanUp: function() {
            this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
          }, emit: function(e2, t2) {
            if (this._listeners[e2]) for (var r2 = 0; r2 < this._listeners[e2].length; r2++) this._listeners[e2][r2].call(this, t2);
          }, pipe: function(e2) {
            return e2.registerPrevious(this);
          }, registerPrevious: function(e2) {
            if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
            this.streamInfo = e2.streamInfo, this.mergeStreamInfo(), this.previous = e2;
            var t2 = this;
            return e2.on("data", function(e3) {
              t2.processChunk(e3);
            }), e2.on("end", function() {
              t2.end();
            }), e2.on("error", function(e3) {
              t2.error(e3);
            }), this;
          }, pause: function() {
            return !this.isPaused && !this.isFinished && (this.isPaused = true, this.previous && this.previous.pause(), true);
          }, resume: function() {
            if (!this.isPaused || this.isFinished) return false;
            var e2 = this.isPaused = false;
            return this.generatedError && (this.error(this.generatedError), e2 = true), this.previous && this.previous.resume(), !e2;
          }, flush: function() {
          }, processChunk: function(e2) {
            this.push(e2);
          }, withStreamInfo: function(e2, t2) {
            return this.extraStreamInfo[e2] = t2, this.mergeStreamInfo(), this;
          }, mergeStreamInfo: function() {
            for (var e2 in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, e2) && (this.streamInfo[e2] = this.extraStreamInfo[e2]);
          }, lock: function() {
            if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
            this.isLocked = true, this.previous && this.previous.lock();
          }, toString: function() {
            var e2 = "Worker " + this.name;
            return this.previous ? this.previous + " -> " + e2 : e2;
          } }, t.exports = n;
        }, {}], 29: [function(e, t, r) {
          "use strict";
          var h = e("../utils"), i = e("./ConvertWorker"), s = e("./GenericWorker"), u = e("../base64"), n = e("../support"), a = e("../external"), o = null;
          if (n.nodestream) try {
            o = e("../nodejs/NodejsStreamOutputAdapter");
          } catch (e2) {
          }
          function l(e2, o2) {
            return new a.Promise(function(t2, r2) {
              var n2 = [], i2 = e2._internalType, s2 = e2._outputType, a2 = e2._mimeType;
              e2.on("data", function(e3, t3) {
                n2.push(e3), o2 && o2(t3);
              }).on("error", function(e3) {
                n2 = [], r2(e3);
              }).on("end", function() {
                try {
                  var e3 = (function(e4, t3, r3) {
                    switch (e4) {
                      case "blob":
                        return h.newBlob(h.transformTo("arraybuffer", t3), r3);
                      case "base64":
                        return u.encode(t3);
                      default:
                        return h.transformTo(e4, t3);
                    }
                  })(s2, (function(e4, t3) {
                    var r3, n3 = 0, i3 = null, s3 = 0;
                    for (r3 = 0; r3 < t3.length; r3++) s3 += t3[r3].length;
                    switch (e4) {
                      case "string":
                        return t3.join("");
                      case "array":
                        return Array.prototype.concat.apply([], t3);
                      case "uint8array":
                        for (i3 = new Uint8Array(s3), r3 = 0; r3 < t3.length; r3++) i3.set(t3[r3], n3), n3 += t3[r3].length;
                        return i3;
                      case "nodebuffer":
                        return Buffer.concat(t3);
                      default:
                        throw new Error("concat : unsupported type '" + e4 + "'");
                    }
                  })(i2, n2), a2);
                  t2(e3);
                } catch (e4) {
                  r2(e4);
                }
                n2 = [];
              }).resume();
            });
          }
          function f(e2, t2, r2) {
            var n2 = t2;
            switch (t2) {
              case "blob":
              case "arraybuffer":
                n2 = "uint8array";
                break;
              case "base64":
                n2 = "string";
            }
            try {
              this._internalType = n2, this._outputType = t2, this._mimeType = r2, h.checkSupport(n2), this._worker = e2.pipe(new i(n2)), e2.lock();
            } catch (e3) {
              this._worker = new s("error"), this._worker.error(e3);
            }
          }
          f.prototype = { accumulate: function(e2) {
            return l(this, e2);
          }, on: function(e2, t2) {
            var r2 = this;
            return "data" === e2 ? this._worker.on(e2, function(e3) {
              t2.call(r2, e3.data, e3.meta);
            }) : this._worker.on(e2, function() {
              h.delay(t2, arguments, r2);
            }), this;
          }, resume: function() {
            return h.delay(this._worker.resume, [], this._worker), this;
          }, pause: function() {
            return this._worker.pause(), this;
          }, toNodejsStream: function(e2) {
            if (h.checkSupport("nodestream"), "nodebuffer" !== this._outputType) throw new Error(this._outputType + " is not supported by this method");
            return new o(this, { objectMode: "nodebuffer" !== this._outputType }, e2);
          } }, t.exports = f;
        }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, t, r) {
          "use strict";
          if (r.base64 = true, r.array = true, r.string = true, r.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, r.nodebuffer = "undefined" != typeof Buffer, r.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) r.blob = false;
          else {
            var n = new ArrayBuffer(0);
            try {
              r.blob = 0 === new Blob([n], { type: "application/zip" }).size;
            } catch (e2) {
              try {
                var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
                i.append(n), r.blob = 0 === i.getBlob("application/zip").size;
              } catch (e3) {
                r.blob = false;
              }
            }
          }
          try {
            r.nodestream = !!e("readable-stream").Readable;
          } catch (e2) {
            r.nodestream = false;
          }
        }, { "readable-stream": 16 }], 31: [function(e, t, s) {
          "use strict";
          for (var o = e("./utils"), h = e("./support"), r = e("./nodejsUtils"), n = e("./stream/GenericWorker"), u = new Array(256), i = 0; i < 256; i++) u[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1;
          u[254] = u[254] = 1;
          function a() {
            n.call(this, "utf-8 decode"), this.leftOver = null;
          }
          function l() {
            n.call(this, "utf-8 encode");
          }
          s.utf8encode = function(e2) {
            return h.nodebuffer ? r.newBufferFrom(e2, "utf-8") : (function(e3) {
              var t2, r2, n2, i2, s2, a2 = e3.length, o2 = 0;
              for (i2 = 0; i2 < a2; i2++) 55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o2 += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
              for (t2 = h.uint8array ? new Uint8Array(o2) : new Array(o2), i2 = s2 = 0; s2 < o2; i2++) 55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
              return t2;
            })(e2);
          }, s.utf8decode = function(e2) {
            return h.nodebuffer ? o.transformTo("nodebuffer", e2).toString("utf-8") : (function(e3) {
              var t2, r2, n2, i2, s2 = e3.length, a2 = new Array(2 * s2);
              for (t2 = r2 = 0; t2 < s2; ) if ((n2 = e3[t2++]) < 128) a2[r2++] = n2;
              else if (4 < (i2 = u[n2])) a2[r2++] = 65533, t2 += i2 - 1;
              else {
                for (n2 &= 2 === i2 ? 31 : 3 === i2 ? 15 : 7; 1 < i2 && t2 < s2; ) n2 = n2 << 6 | 63 & e3[t2++], i2--;
                1 < i2 ? a2[r2++] = 65533 : n2 < 65536 ? a2[r2++] = n2 : (n2 -= 65536, a2[r2++] = 55296 | n2 >> 10 & 1023, a2[r2++] = 56320 | 1023 & n2);
              }
              return a2.length !== r2 && (a2.subarray ? a2 = a2.subarray(0, r2) : a2.length = r2), o.applyFromCharCode(a2);
            })(e2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2));
          }, o.inherits(a, n), a.prototype.processChunk = function(e2) {
            var t2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2.data);
            if (this.leftOver && this.leftOver.length) {
              if (h.uint8array) {
                var r2 = t2;
                (t2 = new Uint8Array(r2.length + this.leftOver.length)).set(this.leftOver, 0), t2.set(r2, this.leftOver.length);
              } else t2 = this.leftOver.concat(t2);
              this.leftOver = null;
            }
            var n2 = (function(e3, t3) {
              var r3;
              for ((t3 = t3 || e3.length) > e3.length && (t3 = e3.length), r3 = t3 - 1; 0 <= r3 && 128 == (192 & e3[r3]); ) r3--;
              return r3 < 0 ? t3 : 0 === r3 ? t3 : r3 + u[e3[r3]] > t3 ? r3 : t3;
            })(t2), i2 = t2;
            n2 !== t2.length && (h.uint8array ? (i2 = t2.subarray(0, n2), this.leftOver = t2.subarray(n2, t2.length)) : (i2 = t2.slice(0, n2), this.leftOver = t2.slice(n2, t2.length))), this.push({ data: s.utf8decode(i2), meta: e2.meta });
          }, a.prototype.flush = function() {
            this.leftOver && this.leftOver.length && (this.push({ data: s.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
          }, s.Utf8DecodeWorker = a, o.inherits(l, n), l.prototype.processChunk = function(e2) {
            this.push({ data: s.utf8encode(e2.data), meta: e2.meta });
          }, s.Utf8EncodeWorker = l;
        }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, t, a) {
          "use strict";
          var o = e("./support"), h = e("./base64"), r = e("./nodejsUtils"), u = e("./external");
          function n(e2) {
            return e2;
          }
          function l(e2, t2) {
            for (var r2 = 0; r2 < e2.length; ++r2) t2[r2] = 255 & e2.charCodeAt(r2);
            return t2;
          }
          e("setimmediate"), a.newBlob = function(t2, r2) {
            a.checkSupport("blob");
            try {
              return new Blob([t2], { type: r2 });
            } catch (e2) {
              try {
                var n2 = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
                return n2.append(t2), n2.getBlob(r2);
              } catch (e3) {
                throw new Error("Bug : can't construct the Blob.");
              }
            }
          };
          var i = { stringifyByChunk: function(e2, t2, r2) {
            var n2 = [], i2 = 0, s2 = e2.length;
            if (s2 <= r2) return String.fromCharCode.apply(null, e2);
            for (; i2 < s2; ) "array" === t2 || "nodebuffer" === t2 ? n2.push(String.fromCharCode.apply(null, e2.slice(i2, Math.min(i2 + r2, s2)))) : n2.push(String.fromCharCode.apply(null, e2.subarray(i2, Math.min(i2 + r2, s2)))), i2 += r2;
            return n2.join("");
          }, stringifyByChar: function(e2) {
            for (var t2 = "", r2 = 0; r2 < e2.length; r2++) t2 += String.fromCharCode(e2[r2]);
            return t2;
          }, applyCanBeUsed: { uint8array: (function() {
            try {
              return o.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length;
            } catch (e2) {
              return false;
            }
          })(), nodebuffer: (function() {
            try {
              return o.nodebuffer && 1 === String.fromCharCode.apply(null, r.allocBuffer(1)).length;
            } catch (e2) {
              return false;
            }
          })() } };
          function s(e2) {
            var t2 = 65536, r2 = a.getTypeOf(e2), n2 = true;
            if ("uint8array" === r2 ? n2 = i.applyCanBeUsed.uint8array : "nodebuffer" === r2 && (n2 = i.applyCanBeUsed.nodebuffer), n2) for (; 1 < t2; ) try {
              return i.stringifyByChunk(e2, r2, t2);
            } catch (e3) {
              t2 = Math.floor(t2 / 2);
            }
            return i.stringifyByChar(e2);
          }
          function f(e2, t2) {
            for (var r2 = 0; r2 < e2.length; r2++) t2[r2] = e2[r2];
            return t2;
          }
          a.applyFromCharCode = s;
          var c = {};
          c.string = { string: n, array: function(e2) {
            return l(e2, new Array(e2.length));
          }, arraybuffer: function(e2) {
            return c.string.uint8array(e2).buffer;
          }, uint8array: function(e2) {
            return l(e2, new Uint8Array(e2.length));
          }, nodebuffer: function(e2) {
            return l(e2, r.allocBuffer(e2.length));
          } }, c.array = { string: s, array: n, arraybuffer: function(e2) {
            return new Uint8Array(e2).buffer;
          }, uint8array: function(e2) {
            return new Uint8Array(e2);
          }, nodebuffer: function(e2) {
            return r.newBufferFrom(e2);
          } }, c.arraybuffer = { string: function(e2) {
            return s(new Uint8Array(e2));
          }, array: function(e2) {
            return f(new Uint8Array(e2), new Array(e2.byteLength));
          }, arraybuffer: n, uint8array: function(e2) {
            return new Uint8Array(e2);
          }, nodebuffer: function(e2) {
            return r.newBufferFrom(new Uint8Array(e2));
          } }, c.uint8array = { string: s, array: function(e2) {
            return f(e2, new Array(e2.length));
          }, arraybuffer: function(e2) {
            return e2.buffer;
          }, uint8array: n, nodebuffer: function(e2) {
            return r.newBufferFrom(e2);
          } }, c.nodebuffer = { string: s, array: function(e2) {
            return f(e2, new Array(e2.length));
          }, arraybuffer: function(e2) {
            return c.nodebuffer.uint8array(e2).buffer;
          }, uint8array: function(e2) {
            return f(e2, new Uint8Array(e2.length));
          }, nodebuffer: n }, a.transformTo = function(e2, t2) {
            if (t2 = t2 || "", !e2) return t2;
            a.checkSupport(e2);
            var r2 = a.getTypeOf(t2);
            return c[r2][e2](t2);
          }, a.resolve = function(e2) {
            for (var t2 = e2.split("/"), r2 = [], n2 = 0; n2 < t2.length; n2++) {
              var i2 = t2[n2];
              "." === i2 || "" === i2 && 0 !== n2 && n2 !== t2.length - 1 || (".." === i2 ? r2.pop() : r2.push(i2));
            }
            return r2.join("/");
          }, a.getTypeOf = function(e2) {
            if ("string" == typeof e2) return "string";
            var t2 = Object.prototype.toString.call(e2);
            return "[object Array]" === t2 ? "array" : o.nodebuffer && r.isBuffer(e2) ? "nodebuffer" : o.uint8array && "[object Uint8Array]" === t2 ? "uint8array" : o.arraybuffer && "[object ArrayBuffer]" === t2 ? "arraybuffer" : void 0;
          }, a.checkSupport = function(e2) {
            if (!o[e2.toLowerCase()]) throw new Error(e2 + " is not supported by this platform");
          }, a.MAX_VALUE_16BITS = 65535, a.MAX_VALUE_32BITS = -1, a.pretty = function(e2) {
            var t2, r2, n2 = "";
            for (r2 = 0; r2 < (e2 || "").length; r2++) n2 += "\\x" + ((t2 = e2.charCodeAt(r2)) < 16 ? "0" : "") + t2.toString(16).toUpperCase();
            return n2;
          }, a.delay = function(e2, t2, r2) {
            setImmediate(function() {
              e2.apply(r2 || null, t2 || []);
            });
          }, a.inherits = function(e2, t2) {
            function r2() {
            }
            r2.prototype = t2.prototype, e2.prototype = new r2();
          }, a.extend = function() {
            var e2, t2, r2 = {};
            for (e2 = 0; e2 < arguments.length; e2++) for (t2 in arguments[e2]) Object.prototype.hasOwnProperty.call(arguments[e2], t2) && void 0 === r2[t2] && (r2[t2] = arguments[e2][t2]);
            return r2;
          }, a.prepareContent = function(r2, e2, n2, i2, s2) {
            return u.Promise.resolve(e2).then(function(n3) {
              return o.blob && (n3 instanceof Blob || -1 !== ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(n3))) ? void 0 !== Blob.prototype.arrayBuffer ? n3.arrayBuffer() : "undefined" != typeof FileReader ? new u.Promise(function(t2, r3) {
                var e3 = new FileReader();
                e3.onload = function(e4) {
                  t2(e4.target.result);
                }, e3.onerror = function(e4) {
                  r3(e4.target.error);
                }, e3.readAsArrayBuffer(n3);
              }) : u.Promise.reject(new Error(r2 + " is a Blob, but we have no way of reading it.")) : n3;
            }).then(function(e3) {
              var t2 = a.getTypeOf(e3);
              return t2 ? ("arraybuffer" === t2 ? e3 = a.transformTo("uint8array", e3) : "string" === t2 && (s2 ? e3 = h.decode(e3) : n2 && true !== i2 && (e3 = (function(e4) {
                return l(e4, o.uint8array ? new Uint8Array(e4.length) : new Array(e4.length));
              })(e3))), e3) : u.Promise.reject(new Error("Can't read the data of '" + r2 + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
            });
          };
        }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, t, r) {
          "use strict";
          var n = e("./reader/readerFor"), i = e("./utils"), s = e("./signature"), a = e("./zipEntry"), o = e("./support");
          function h(e2) {
            this.files = [], this.loadOptions = e2;
          }
          h.prototype = { checkSignature: function(e2) {
            if (!this.reader.readAndCheckSignature(e2)) {
              this.reader.index -= 4;
              var t2 = this.reader.readString(4);
              throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(t2) + ", expected " + i.pretty(e2) + ")");
            }
          }, isSignature: function(e2, t2) {
            var r2 = this.reader.index;
            this.reader.setIndex(e2);
            var n2 = this.reader.readString(4) === t2;
            return this.reader.setIndex(r2), n2;
          }, readBlockEndOfCentral: function() {
            this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
            var e2 = this.reader.readData(this.zipCommentLength), t2 = o.uint8array ? "uint8array" : "array", r2 = i.transformTo(t2, e2);
            this.zipComment = this.loadOptions.decodeFileName(r2);
          }, readBlockZip64EndOfCentral: function() {
            this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
            for (var e2, t2, r2, n2 = this.zip64EndOfCentralSize - 44; 0 < n2; ) e2 = this.reader.readInt(2), t2 = this.reader.readInt(4), r2 = this.reader.readData(t2), this.zip64ExtensibleData[e2] = { id: e2, length: t2, value: r2 };
          }, readBlockZip64EndOfCentralLocator: function() {
            if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
          }, readLocalFiles: function() {
            var e2, t2;
            for (e2 = 0; e2 < this.files.length; e2++) t2 = this.files[e2], this.reader.setIndex(t2.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), t2.readLocalPart(this.reader), t2.handleUTF8(), t2.processAttributes();
          }, readCentralDir: function() {
            var e2;
            for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER); ) (e2 = new a({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(e2);
            if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
          }, readEndOfCentral: function() {
            var e2 = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
            if (e2 < 0) throw !this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip: can't find end of central directory");
            this.reader.setIndex(e2);
            var t2 = e2;
            if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
              if (this.zip64 = true, (e2 = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
              if (this.reader.setIndex(e2), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
              this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
            }
            var r2 = this.centralDirOffset + this.centralDirSize;
            this.zip64 && (r2 += 20, r2 += 12 + this.zip64EndOfCentralSize);
            var n2 = t2 - r2;
            if (0 < n2) this.isSignature(t2, s.CENTRAL_FILE_HEADER) || (this.reader.zero = n2);
            else if (n2 < 0) throw new Error("Corrupted zip: missing " + Math.abs(n2) + " bytes.");
          }, prepareReader: function(e2) {
            this.reader = n(e2);
          }, load: function(e2) {
            this.prepareReader(e2), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
          } }, t.exports = h;
        }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, t, r) {
          "use strict";
          var n = e("./reader/readerFor"), s = e("./utils"), i = e("./compressedObject"), a = e("./crc32"), o = e("./utf8"), h = e("./compressions"), u = e("./support");
          function l(e2, t2) {
            this.options = e2, this.loadOptions = t2;
          }
          l.prototype = { isEncrypted: function() {
            return 1 == (1 & this.bitFlag);
          }, useUTF8: function() {
            return 2048 == (2048 & this.bitFlag);
          }, readLocalPart: function(e2) {
            var t2, r2;
            if (e2.skip(22), this.fileNameLength = e2.readInt(2), r2 = e2.readInt(2), this.fileName = e2.readData(this.fileNameLength), e2.skip(r2), -1 === this.compressedSize || -1 === this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
            if (null === (t2 = (function(e3) {
              for (var t3 in h) if (Object.prototype.hasOwnProperty.call(h, t3) && h[t3].magic === e3) return h[t3];
              return null;
            })(this.compressionMethod))) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
            this.decompressed = new i(this.compressedSize, this.uncompressedSize, this.crc32, t2, e2.readData(this.compressedSize));
          }, readCentralPart: function(e2) {
            this.versionMadeBy = e2.readInt(2), e2.skip(2), this.bitFlag = e2.readInt(2), this.compressionMethod = e2.readString(2), this.date = e2.readDate(), this.crc32 = e2.readInt(4), this.compressedSize = e2.readInt(4), this.uncompressedSize = e2.readInt(4);
            var t2 = e2.readInt(2);
            if (this.extraFieldsLength = e2.readInt(2), this.fileCommentLength = e2.readInt(2), this.diskNumberStart = e2.readInt(2), this.internalFileAttributes = e2.readInt(2), this.externalFileAttributes = e2.readInt(4), this.localHeaderOffset = e2.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
            e2.skip(t2), this.readExtraFields(e2), this.parseZIP64ExtraField(e2), this.fileComment = e2.readData(this.fileCommentLength);
          }, processAttributes: function() {
            this.unixPermissions = null, this.dosPermissions = null;
            var e2 = this.versionMadeBy >> 8;
            this.dir = !!(16 & this.externalFileAttributes), 0 == e2 && (this.dosPermissions = 63 & this.externalFileAttributes), 3 == e2 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = true);
          }, parseZIP64ExtraField: function() {
            if (this.extraFields[1]) {
              var e2 = n(this.extraFields[1].value);
              this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = e2.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = e2.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = e2.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = e2.readInt(4));
            }
          }, readExtraFields: function(e2) {
            var t2, r2, n2, i2 = e2.index + this.extraFieldsLength;
            for (this.extraFields || (this.extraFields = {}); e2.index + 4 < i2; ) t2 = e2.readInt(2), r2 = e2.readInt(2), n2 = e2.readData(r2), this.extraFields[t2] = { id: t2, length: r2, value: n2 };
            e2.setIndex(i2);
          }, handleUTF8: function() {
            var e2 = u.uint8array ? "uint8array" : "array";
            if (this.useUTF8()) this.fileNameStr = o.utf8decode(this.fileName), this.fileCommentStr = o.utf8decode(this.fileComment);
            else {
              var t2 = this.findExtraFieldUnicodePath();
              if (null !== t2) this.fileNameStr = t2;
              else {
                var r2 = s.transformTo(e2, this.fileName);
                this.fileNameStr = this.loadOptions.decodeFileName(r2);
              }
              var n2 = this.findExtraFieldUnicodeComment();
              if (null !== n2) this.fileCommentStr = n2;
              else {
                var i2 = s.transformTo(e2, this.fileComment);
                this.fileCommentStr = this.loadOptions.decodeFileName(i2);
              }
            }
          }, findExtraFieldUnicodePath: function() {
            var e2 = this.extraFields[28789];
            if (e2) {
              var t2 = n(e2.value);
              return 1 !== t2.readInt(1) ? null : a(this.fileName) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
            }
            return null;
          }, findExtraFieldUnicodeComment: function() {
            var e2 = this.extraFields[25461];
            if (e2) {
              var t2 = n(e2.value);
              return 1 !== t2.readInt(1) ? null : a(this.fileComment) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
            }
            return null;
          } }, t.exports = l;
        }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, t, r) {
          "use strict";
          function n(e2, t2, r2) {
            this.name = e2, this.dir = r2.dir, this.date = r2.date, this.comment = r2.comment, this.unixPermissions = r2.unixPermissions, this.dosPermissions = r2.dosPermissions, this._data = t2, this._dataBinary = r2.binary, this.options = { compression: r2.compression, compressionOptions: r2.compressionOptions };
          }
          var s = e("./stream/StreamHelper"), i = e("./stream/DataWorker"), a = e("./utf8"), o = e("./compressedObject"), h = e("./stream/GenericWorker");
          n.prototype = { internalStream: function(e2) {
            var t2 = null, r2 = "string";
            try {
              if (!e2) throw new Error("No output type specified.");
              var n2 = "string" === (r2 = e2.toLowerCase()) || "text" === r2;
              "binarystring" !== r2 && "text" !== r2 || (r2 = "string"), t2 = this._decompressWorker();
              var i2 = !this._dataBinary;
              i2 && !n2 && (t2 = t2.pipe(new a.Utf8EncodeWorker())), !i2 && n2 && (t2 = t2.pipe(new a.Utf8DecodeWorker()));
            } catch (e3) {
              (t2 = new h("error")).error(e3);
            }
            return new s(t2, r2, "");
          }, async: function(e2, t2) {
            return this.internalStream(e2).accumulate(t2);
          }, nodeStream: function(e2, t2) {
            return this.internalStream(e2 || "nodebuffer").toNodejsStream(t2);
          }, _compressWorker: function(e2, t2) {
            if (this._data instanceof o && this._data.compression.magic === e2.magic) return this._data.getCompressedWorker();
            var r2 = this._decompressWorker();
            return this._dataBinary || (r2 = r2.pipe(new a.Utf8EncodeWorker())), o.createWorkerFrom(r2, e2, t2);
          }, _decompressWorker: function() {
            return this._data instanceof o ? this._data.getContentWorker() : this._data instanceof h ? this._data : new i(this._data);
          } };
          for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], l = function() {
            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
          }, f = 0; f < u.length; f++) n.prototype[u[f]] = l;
          t.exports = n;
        }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, l, t) {
          (function(t2) {
            "use strict";
            var r, n, e2 = t2.MutationObserver || t2.WebKitMutationObserver;
            if (e2) {
              var i = 0, s = new e2(u), a = t2.document.createTextNode("");
              s.observe(a, { characterData: true }), r = function() {
                a.data = i = ++i % 2;
              };
            } else if (t2.setImmediate || void 0 === t2.MessageChannel) r = "document" in t2 && "onreadystatechange" in t2.document.createElement("script") ? function() {
              var e3 = t2.document.createElement("script");
              e3.onreadystatechange = function() {
                u(), e3.onreadystatechange = null, e3.parentNode.removeChild(e3), e3 = null;
              }, t2.document.documentElement.appendChild(e3);
            } : function() {
              setTimeout(u, 0);
            };
            else {
              var o = new t2.MessageChannel();
              o.port1.onmessage = u, r = function() {
                o.port2.postMessage(0);
              };
            }
            var h = [];
            function u() {
              var e3, t3;
              n = true;
              for (var r2 = h.length; r2; ) {
                for (t3 = h, h = [], e3 = -1; ++e3 < r2; ) t3[e3]();
                r2 = h.length;
              }
              n = false;
            }
            l.exports = function(e3) {
              1 !== h.push(e3) || n || r();
            };
          }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {}], 37: [function(e, t, r) {
          "use strict";
          var i = e("immediate");
          function u() {
          }
          var l = {}, s = ["REJECTED"], a = ["FULFILLED"], n = ["PENDING"];
          function o(e2) {
            if ("function" != typeof e2) throw new TypeError("resolver must be a function");
            this.state = n, this.queue = [], this.outcome = void 0, e2 !== u && d(this, e2);
          }
          function h(e2, t2, r2) {
            this.promise = e2, "function" == typeof t2 && (this.onFulfilled = t2, this.callFulfilled = this.otherCallFulfilled), "function" == typeof r2 && (this.onRejected = r2, this.callRejected = this.otherCallRejected);
          }
          function f(t2, r2, n2) {
            i(function() {
              var e2;
              try {
                e2 = r2(n2);
              } catch (e3) {
                return l.reject(t2, e3);
              }
              e2 === t2 ? l.reject(t2, new TypeError("Cannot resolve promise with itself")) : l.resolve(t2, e2);
            });
          }
          function c(e2) {
            var t2 = e2 && e2.then;
            if (e2 && ("object" == typeof e2 || "function" == typeof e2) && "function" == typeof t2) return function() {
              t2.apply(e2, arguments);
            };
          }
          function d(t2, e2) {
            var r2 = false;
            function n2(e3) {
              r2 || (r2 = true, l.reject(t2, e3));
            }
            function i2(e3) {
              r2 || (r2 = true, l.resolve(t2, e3));
            }
            var s2 = p(function() {
              e2(i2, n2);
            });
            "error" === s2.status && n2(s2.value);
          }
          function p(e2, t2) {
            var r2 = {};
            try {
              r2.value = e2(t2), r2.status = "success";
            } catch (e3) {
              r2.status = "error", r2.value = e3;
            }
            return r2;
          }
          (t.exports = o).prototype.finally = function(t2) {
            if ("function" != typeof t2) return this;
            var r2 = this.constructor;
            return this.then(function(e2) {
              return r2.resolve(t2()).then(function() {
                return e2;
              });
            }, function(e2) {
              return r2.resolve(t2()).then(function() {
                throw e2;
              });
            });
          }, o.prototype.catch = function(e2) {
            return this.then(null, e2);
          }, o.prototype.then = function(e2, t2) {
            if ("function" != typeof e2 && this.state === a || "function" != typeof t2 && this.state === s) return this;
            var r2 = new this.constructor(u);
            this.state !== n ? f(r2, this.state === a ? e2 : t2, this.outcome) : this.queue.push(new h(r2, e2, t2));
            return r2;
          }, h.prototype.callFulfilled = function(e2) {
            l.resolve(this.promise, e2);
          }, h.prototype.otherCallFulfilled = function(e2) {
            f(this.promise, this.onFulfilled, e2);
          }, h.prototype.callRejected = function(e2) {
            l.reject(this.promise, e2);
          }, h.prototype.otherCallRejected = function(e2) {
            f(this.promise, this.onRejected, e2);
          }, l.resolve = function(e2, t2) {
            var r2 = p(c, t2);
            if ("error" === r2.status) return l.reject(e2, r2.value);
            var n2 = r2.value;
            if (n2) d(e2, n2);
            else {
              e2.state = a, e2.outcome = t2;
              for (var i2 = -1, s2 = e2.queue.length; ++i2 < s2; ) e2.queue[i2].callFulfilled(t2);
            }
            return e2;
          }, l.reject = function(e2, t2) {
            e2.state = s, e2.outcome = t2;
            for (var r2 = -1, n2 = e2.queue.length; ++r2 < n2; ) e2.queue[r2].callRejected(t2);
            return e2;
          }, o.resolve = function(e2) {
            if (e2 instanceof this) return e2;
            return l.resolve(new this(u), e2);
          }, o.reject = function(e2) {
            var t2 = new this(u);
            return l.reject(t2, e2);
          }, o.all = function(e2) {
            var r2 = this;
            if ("[object Array]" !== Object.prototype.toString.call(e2)) return this.reject(new TypeError("must be an array"));
            var n2 = e2.length, i2 = false;
            if (!n2) return this.resolve([]);
            var s2 = new Array(n2), a2 = 0, t2 = -1, o2 = new this(u);
            for (; ++t2 < n2; ) h2(e2[t2], t2);
            return o2;
            function h2(e3, t3) {
              r2.resolve(e3).then(function(e4) {
                s2[t3] = e4, ++a2 !== n2 || i2 || (i2 = true, l.resolve(o2, s2));
              }, function(e4) {
                i2 || (i2 = true, l.reject(o2, e4));
              });
            }
          }, o.race = function(e2) {
            var t2 = this;
            if ("[object Array]" !== Object.prototype.toString.call(e2)) return this.reject(new TypeError("must be an array"));
            var r2 = e2.length, n2 = false;
            if (!r2) return this.resolve([]);
            var i2 = -1, s2 = new this(u);
            for (; ++i2 < r2; ) a2 = e2[i2], t2.resolve(a2).then(function(e3) {
              n2 || (n2 = true, l.resolve(s2, e3));
            }, function(e3) {
              n2 || (n2 = true, l.reject(s2, e3));
            });
            var a2;
            return s2;
          };
        }, { immediate: 36 }], 38: [function(e, t, r) {
          "use strict";
          var n = {};
          (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), t.exports = n;
        }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, t, r) {
          "use strict";
          var a = e("./zlib/deflate"), o = e("./utils/common"), h = e("./utils/strings"), i = e("./zlib/messages"), s = e("./zlib/zstream"), u = Object.prototype.toString, l = 0, f = -1, c = 0, d = 8;
          function p(e2) {
            if (!(this instanceof p)) return new p(e2);
            this.options = o.assign({ level: f, method: d, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: c, to: "" }, e2 || {});
            var t2 = this.options;
            t2.raw && 0 < t2.windowBits ? t2.windowBits = -t2.windowBits : t2.gzip && 0 < t2.windowBits && t2.windowBits < 16 && (t2.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new s(), this.strm.avail_out = 0;
            var r2 = a.deflateInit2(this.strm, t2.level, t2.method, t2.windowBits, t2.memLevel, t2.strategy);
            if (r2 !== l) throw new Error(i[r2]);
            if (t2.header && a.deflateSetHeader(this.strm, t2.header), t2.dictionary) {
              var n2;
              if (n2 = "string" == typeof t2.dictionary ? h.string2buf(t2.dictionary) : "[object ArrayBuffer]" === u.call(t2.dictionary) ? new Uint8Array(t2.dictionary) : t2.dictionary, (r2 = a.deflateSetDictionary(this.strm, n2)) !== l) throw new Error(i[r2]);
              this._dict_set = true;
            }
          }
          function n(e2, t2) {
            var r2 = new p(t2);
            if (r2.push(e2, true), r2.err) throw r2.msg || i[r2.err];
            return r2.result;
          }
          p.prototype.push = function(e2, t2) {
            var r2, n2, i2 = this.strm, s2 = this.options.chunkSize;
            if (this.ended) return false;
            n2 = t2 === ~~t2 ? t2 : true === t2 ? 4 : 0, "string" == typeof e2 ? i2.input = h.string2buf(e2) : "[object ArrayBuffer]" === u.call(e2) ? i2.input = new Uint8Array(e2) : i2.input = e2, i2.next_in = 0, i2.avail_in = i2.input.length;
            do {
              if (0 === i2.avail_out && (i2.output = new o.Buf8(s2), i2.next_out = 0, i2.avail_out = s2), 1 !== (r2 = a.deflate(i2, n2)) && r2 !== l) return this.onEnd(r2), !(this.ended = true);
              0 !== i2.avail_out && (0 !== i2.avail_in || 4 !== n2 && 2 !== n2) || ("string" === this.options.to ? this.onData(h.buf2binstring(o.shrinkBuf(i2.output, i2.next_out))) : this.onData(o.shrinkBuf(i2.output, i2.next_out)));
            } while ((0 < i2.avail_in || 0 === i2.avail_out) && 1 !== r2);
            return 4 === n2 ? (r2 = a.deflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === l) : 2 !== n2 || (this.onEnd(l), !(i2.avail_out = 0));
          }, p.prototype.onData = function(e2) {
            this.chunks.push(e2);
          }, p.prototype.onEnd = function(e2) {
            e2 === l && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
          }, r.Deflate = p, r.deflate = n, r.deflateRaw = function(e2, t2) {
            return (t2 = t2 || {}).raw = true, n(e2, t2);
          }, r.gzip = function(e2, t2) {
            return (t2 = t2 || {}).gzip = true, n(e2, t2);
          };
        }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, t, r) {
          "use strict";
          var c = e("./zlib/inflate"), d = e("./utils/common"), p = e("./utils/strings"), m = e("./zlib/constants"), n = e("./zlib/messages"), i = e("./zlib/zstream"), s = e("./zlib/gzheader"), _ = Object.prototype.toString;
          function a(e2) {
            if (!(this instanceof a)) return new a(e2);
            this.options = d.assign({ chunkSize: 16384, windowBits: 0, to: "" }, e2 || {});
            var t2 = this.options;
            t2.raw && 0 <= t2.windowBits && t2.windowBits < 16 && (t2.windowBits = -t2.windowBits, 0 === t2.windowBits && (t2.windowBits = -15)), !(0 <= t2.windowBits && t2.windowBits < 16) || e2 && e2.windowBits || (t2.windowBits += 32), 15 < t2.windowBits && t2.windowBits < 48 && 0 == (15 & t2.windowBits) && (t2.windowBits |= 15), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new i(), this.strm.avail_out = 0;
            var r2 = c.inflateInit2(this.strm, t2.windowBits);
            if (r2 !== m.Z_OK) throw new Error(n[r2]);
            this.header = new s(), c.inflateGetHeader(this.strm, this.header);
          }
          function o(e2, t2) {
            var r2 = new a(t2);
            if (r2.push(e2, true), r2.err) throw r2.msg || n[r2.err];
            return r2.result;
          }
          a.prototype.push = function(e2, t2) {
            var r2, n2, i2, s2, a2, o2, h = this.strm, u = this.options.chunkSize, l = this.options.dictionary, f = false;
            if (this.ended) return false;
            n2 = t2 === ~~t2 ? t2 : true === t2 ? m.Z_FINISH : m.Z_NO_FLUSH, "string" == typeof e2 ? h.input = p.binstring2buf(e2) : "[object ArrayBuffer]" === _.call(e2) ? h.input = new Uint8Array(e2) : h.input = e2, h.next_in = 0, h.avail_in = h.input.length;
            do {
              if (0 === h.avail_out && (h.output = new d.Buf8(u), h.next_out = 0, h.avail_out = u), (r2 = c.inflate(h, m.Z_NO_FLUSH)) === m.Z_NEED_DICT && l && (o2 = "string" == typeof l ? p.string2buf(l) : "[object ArrayBuffer]" === _.call(l) ? new Uint8Array(l) : l, r2 = c.inflateSetDictionary(this.strm, o2)), r2 === m.Z_BUF_ERROR && true === f && (r2 = m.Z_OK, f = false), r2 !== m.Z_STREAM_END && r2 !== m.Z_OK) return this.onEnd(r2), !(this.ended = true);
              h.next_out && (0 !== h.avail_out && r2 !== m.Z_STREAM_END && (0 !== h.avail_in || n2 !== m.Z_FINISH && n2 !== m.Z_SYNC_FLUSH) || ("string" === this.options.to ? (i2 = p.utf8border(h.output, h.next_out), s2 = h.next_out - i2, a2 = p.buf2string(h.output, i2), h.next_out = s2, h.avail_out = u - s2, s2 && d.arraySet(h.output, h.output, i2, s2, 0), this.onData(a2)) : this.onData(d.shrinkBuf(h.output, h.next_out)))), 0 === h.avail_in && 0 === h.avail_out && (f = true);
            } while ((0 < h.avail_in || 0 === h.avail_out) && r2 !== m.Z_STREAM_END);
            return r2 === m.Z_STREAM_END && (n2 = m.Z_FINISH), n2 === m.Z_FINISH ? (r2 = c.inflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === m.Z_OK) : n2 !== m.Z_SYNC_FLUSH || (this.onEnd(m.Z_OK), !(h.avail_out = 0));
          }, a.prototype.onData = function(e2) {
            this.chunks.push(e2);
          }, a.prototype.onEnd = function(e2) {
            e2 === m.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = d.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
          }, r.Inflate = a, r.inflate = o, r.inflateRaw = function(e2, t2) {
            return (t2 = t2 || {}).raw = true, o(e2, t2);
          }, r.ungzip = o;
        }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, t, r) {
          "use strict";
          var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
          r.assign = function(e2) {
            for (var t2 = Array.prototype.slice.call(arguments, 1); t2.length; ) {
              var r2 = t2.shift();
              if (r2) {
                if ("object" != typeof r2) throw new TypeError(r2 + "must be non-object");
                for (var n2 in r2) r2.hasOwnProperty(n2) && (e2[n2] = r2[n2]);
              }
            }
            return e2;
          }, r.shrinkBuf = function(e2, t2) {
            return e2.length === t2 ? e2 : e2.subarray ? e2.subarray(0, t2) : (e2.length = t2, e2);
          };
          var i = { arraySet: function(e2, t2, r2, n2, i2) {
            if (t2.subarray && e2.subarray) e2.set(t2.subarray(r2, r2 + n2), i2);
            else for (var s2 = 0; s2 < n2; s2++) e2[i2 + s2] = t2[r2 + s2];
          }, flattenChunks: function(e2) {
            var t2, r2, n2, i2, s2, a;
            for (t2 = n2 = 0, r2 = e2.length; t2 < r2; t2++) n2 += e2[t2].length;
            for (a = new Uint8Array(n2), t2 = i2 = 0, r2 = e2.length; t2 < r2; t2++) s2 = e2[t2], a.set(s2, i2), i2 += s2.length;
            return a;
          } }, s = { arraySet: function(e2, t2, r2, n2, i2) {
            for (var s2 = 0; s2 < n2; s2++) e2[i2 + s2] = t2[r2 + s2];
          }, flattenChunks: function(e2) {
            return [].concat.apply([], e2);
          } };
          r.setTyped = function(e2) {
            e2 ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, i)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, s));
          }, r.setTyped(n);
        }, {}], 42: [function(e, t, r) {
          "use strict";
          var h = e("./common"), i = true, s = true;
          try {
            String.fromCharCode.apply(null, [0]);
          } catch (e2) {
            i = false;
          }
          try {
            String.fromCharCode.apply(null, new Uint8Array(1));
          } catch (e2) {
            s = false;
          }
          for (var u = new h.Buf8(256), n = 0; n < 256; n++) u[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1;
          function l(e2, t2) {
            if (t2 < 65537 && (e2.subarray && s || !e2.subarray && i)) return String.fromCharCode.apply(null, h.shrinkBuf(e2, t2));
            for (var r2 = "", n2 = 0; n2 < t2; n2++) r2 += String.fromCharCode(e2[n2]);
            return r2;
          }
          u[254] = u[254] = 1, r.string2buf = function(e2) {
            var t2, r2, n2, i2, s2, a = e2.length, o = 0;
            for (i2 = 0; i2 < a; i2++) 55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
            for (t2 = new h.Buf8(o), i2 = s2 = 0; s2 < o; i2++) 55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
            return t2;
          }, r.buf2binstring = function(e2) {
            return l(e2, e2.length);
          }, r.binstring2buf = function(e2) {
            for (var t2 = new h.Buf8(e2.length), r2 = 0, n2 = t2.length; r2 < n2; r2++) t2[r2] = e2.charCodeAt(r2);
            return t2;
          }, r.buf2string = function(e2, t2) {
            var r2, n2, i2, s2, a = t2 || e2.length, o = new Array(2 * a);
            for (r2 = n2 = 0; r2 < a; ) if ((i2 = e2[r2++]) < 128) o[n2++] = i2;
            else if (4 < (s2 = u[i2])) o[n2++] = 65533, r2 += s2 - 1;
            else {
              for (i2 &= 2 === s2 ? 31 : 3 === s2 ? 15 : 7; 1 < s2 && r2 < a; ) i2 = i2 << 6 | 63 & e2[r2++], s2--;
              1 < s2 ? o[n2++] = 65533 : i2 < 65536 ? o[n2++] = i2 : (i2 -= 65536, o[n2++] = 55296 | i2 >> 10 & 1023, o[n2++] = 56320 | 1023 & i2);
            }
            return l(o, n2);
          }, r.utf8border = function(e2, t2) {
            var r2;
            for ((t2 = t2 || e2.length) > e2.length && (t2 = e2.length), r2 = t2 - 1; 0 <= r2 && 128 == (192 & e2[r2]); ) r2--;
            return r2 < 0 ? t2 : 0 === r2 ? t2 : r2 + u[e2[r2]] > t2 ? r2 : t2;
          };
        }, { "./common": 41 }], 43: [function(e, t, r) {
          "use strict";
          t.exports = function(e2, t2, r2, n) {
            for (var i = 65535 & e2 | 0, s = e2 >>> 16 & 65535 | 0, a = 0; 0 !== r2; ) {
              for (r2 -= a = 2e3 < r2 ? 2e3 : r2; s = s + (i = i + t2[n++] | 0) | 0, --a; ) ;
              i %= 65521, s %= 65521;
            }
            return i | s << 16 | 0;
          };
        }, {}], 44: [function(e, t, r) {
          "use strict";
          t.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
        }, {}], 45: [function(e, t, r) {
          "use strict";
          var o = (function() {
            for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
              e2 = r2;
              for (var n = 0; n < 8; n++) e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
              t2[r2] = e2;
            }
            return t2;
          })();
          t.exports = function(e2, t2, r2, n) {
            var i = o, s = n + r2;
            e2 ^= -1;
            for (var a = n; a < s; a++) e2 = e2 >>> 8 ^ i[255 & (e2 ^ t2[a])];
            return -1 ^ e2;
          };
        }, {}], 46: [function(e, t, r) {
          "use strict";
          var h, c = e("../utils/common"), u = e("./trees"), d = e("./adler32"), p = e("./crc32"), n = e("./messages"), l = 0, f = 4, m = 0, _ = -2, g = -1, b = 4, i = 2, v = 8, y = 9, s = 286, a = 30, o = 19, w = 2 * s + 1, k = 15, x = 3, S = 258, z = S + x + 1, C = 42, E = 113, A = 1, I = 2, O = 3, B = 4;
          function R(e2, t2) {
            return e2.msg = n[t2], t2;
          }
          function T(e2) {
            return (e2 << 1) - (4 < e2 ? 9 : 0);
          }
          function D(e2) {
            for (var t2 = e2.length; 0 <= --t2; ) e2[t2] = 0;
          }
          function F(e2) {
            var t2 = e2.state, r2 = t2.pending;
            r2 > e2.avail_out && (r2 = e2.avail_out), 0 !== r2 && (c.arraySet(e2.output, t2.pending_buf, t2.pending_out, r2, e2.next_out), e2.next_out += r2, t2.pending_out += r2, e2.total_out += r2, e2.avail_out -= r2, t2.pending -= r2, 0 === t2.pending && (t2.pending_out = 0));
          }
          function N(e2, t2) {
            u._tr_flush_block(e2, 0 <= e2.block_start ? e2.block_start : -1, e2.strstart - e2.block_start, t2), e2.block_start = e2.strstart, F(e2.strm);
          }
          function U(e2, t2) {
            e2.pending_buf[e2.pending++] = t2;
          }
          function P(e2, t2) {
            e2.pending_buf[e2.pending++] = t2 >>> 8 & 255, e2.pending_buf[e2.pending++] = 255 & t2;
          }
          function L(e2, t2) {
            var r2, n2, i2 = e2.max_chain_length, s2 = e2.strstart, a2 = e2.prev_length, o2 = e2.nice_match, h2 = e2.strstart > e2.w_size - z ? e2.strstart - (e2.w_size - z) : 0, u2 = e2.window, l2 = e2.w_mask, f2 = e2.prev, c2 = e2.strstart + S, d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
            e2.prev_length >= e2.good_match && (i2 >>= 2), o2 > e2.lookahead && (o2 = e2.lookahead);
            do {
              if (u2[(r2 = t2) + a2] === p2 && u2[r2 + a2 - 1] === d2 && u2[r2] === u2[s2] && u2[++r2] === u2[s2 + 1]) {
                s2 += 2, r2++;
                do {
                } while (u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && s2 < c2);
                if (n2 = S - (c2 - s2), s2 = c2 - S, a2 < n2) {
                  if (e2.match_start = t2, o2 <= (a2 = n2)) break;
                  d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
                }
              }
            } while ((t2 = f2[t2 & l2]) > h2 && 0 != --i2);
            return a2 <= e2.lookahead ? a2 : e2.lookahead;
          }
          function j(e2) {
            var t2, r2, n2, i2, s2, a2, o2, h2, u2, l2, f2 = e2.w_size;
            do {
              if (i2 = e2.window_size - e2.lookahead - e2.strstart, e2.strstart >= f2 + (f2 - z)) {
                for (c.arraySet(e2.window, e2.window, f2, f2, 0), e2.match_start -= f2, e2.strstart -= f2, e2.block_start -= f2, t2 = r2 = e2.hash_size; n2 = e2.head[--t2], e2.head[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; ) ;
                for (t2 = r2 = f2; n2 = e2.prev[--t2], e2.prev[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; ) ;
                i2 += f2;
              }
              if (0 === e2.strm.avail_in) break;
              if (a2 = e2.strm, o2 = e2.window, h2 = e2.strstart + e2.lookahead, u2 = i2, l2 = void 0, l2 = a2.avail_in, u2 < l2 && (l2 = u2), r2 = 0 === l2 ? 0 : (a2.avail_in -= l2, c.arraySet(o2, a2.input, a2.next_in, l2, h2), 1 === a2.state.wrap ? a2.adler = d(a2.adler, o2, l2, h2) : 2 === a2.state.wrap && (a2.adler = p(a2.adler, o2, l2, h2)), a2.next_in += l2, a2.total_in += l2, l2), e2.lookahead += r2, e2.lookahead + e2.insert >= x) for (s2 = e2.strstart - e2.insert, e2.ins_h = e2.window[s2], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + 1]) & e2.hash_mask; e2.insert && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + x - 1]) & e2.hash_mask, e2.prev[s2 & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = s2, s2++, e2.insert--, !(e2.lookahead + e2.insert < x)); ) ;
            } while (e2.lookahead < z && 0 !== e2.strm.avail_in);
          }
          function Z(e2, t2) {
            for (var r2, n2; ; ) {
              if (e2.lookahead < z) {
                if (j(e2), e2.lookahead < z && t2 === l) return A;
                if (0 === e2.lookahead) break;
              }
              if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 !== r2 && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2)), e2.match_length >= x) if (n2 = u._tr_tally(e2, e2.strstart - e2.match_start, e2.match_length - x), e2.lookahead -= e2.match_length, e2.match_length <= e2.max_lazy_match && e2.lookahead >= x) {
                for (e2.match_length--; e2.strstart++, e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart, 0 != --e2.match_length; ) ;
                e2.strstart++;
              } else e2.strstart += e2.match_length, e2.match_length = 0, e2.ins_h = e2.window[e2.strstart], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + 1]) & e2.hash_mask;
              else n2 = u._tr_tally(e2, 0, e2.window[e2.strstart]), e2.lookahead--, e2.strstart++;
              if (n2 && (N(e2, false), 0 === e2.strm.avail_out)) return A;
            }
            return e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
          }
          function W(e2, t2) {
            for (var r2, n2, i2; ; ) {
              if (e2.lookahead < z) {
                if (j(e2), e2.lookahead < z && t2 === l) return A;
                if (0 === e2.lookahead) break;
              }
              if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), e2.prev_length = e2.match_length, e2.prev_match = e2.match_start, e2.match_length = x - 1, 0 !== r2 && e2.prev_length < e2.max_lazy_match && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2), e2.match_length <= 5 && (1 === e2.strategy || e2.match_length === x && 4096 < e2.strstart - e2.match_start) && (e2.match_length = x - 1)), e2.prev_length >= x && e2.match_length <= e2.prev_length) {
                for (i2 = e2.strstart + e2.lookahead - x, n2 = u._tr_tally(e2, e2.strstart - 1 - e2.prev_match, e2.prev_length - x), e2.lookahead -= e2.prev_length - 1, e2.prev_length -= 2; ++e2.strstart <= i2 && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 != --e2.prev_length; ) ;
                if (e2.match_available = 0, e2.match_length = x - 1, e2.strstart++, n2 && (N(e2, false), 0 === e2.strm.avail_out)) return A;
              } else if (e2.match_available) {
                if ((n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1])) && N(e2, false), e2.strstart++, e2.lookahead--, 0 === e2.strm.avail_out) return A;
              } else e2.match_available = 1, e2.strstart++, e2.lookahead--;
            }
            return e2.match_available && (n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1]), e2.match_available = 0), e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
          }
          function M(e2, t2, r2, n2, i2) {
            this.good_length = e2, this.max_lazy = t2, this.nice_length = r2, this.max_chain = n2, this.func = i2;
          }
          function H() {
            this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new c.Buf16(2 * w), this.dyn_dtree = new c.Buf16(2 * (2 * a + 1)), this.bl_tree = new c.Buf16(2 * (2 * o + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new c.Buf16(k + 1), this.heap = new c.Buf16(2 * s + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new c.Buf16(2 * s + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
          }
          function G(e2) {
            var t2;
            return e2 && e2.state ? (e2.total_in = e2.total_out = 0, e2.data_type = i, (t2 = e2.state).pending = 0, t2.pending_out = 0, t2.wrap < 0 && (t2.wrap = -t2.wrap), t2.status = t2.wrap ? C : E, e2.adler = 2 === t2.wrap ? 0 : 1, t2.last_flush = l, u._tr_init(t2), m) : R(e2, _);
          }
          function K(e2) {
            var t2 = G(e2);
            return t2 === m && (function(e3) {
              e3.window_size = 2 * e3.w_size, D(e3.head), e3.max_lazy_match = h[e3.level].max_lazy, e3.good_match = h[e3.level].good_length, e3.nice_match = h[e3.level].nice_length, e3.max_chain_length = h[e3.level].max_chain, e3.strstart = 0, e3.block_start = 0, e3.lookahead = 0, e3.insert = 0, e3.match_length = e3.prev_length = x - 1, e3.match_available = 0, e3.ins_h = 0;
            })(e2.state), t2;
          }
          function Y(e2, t2, r2, n2, i2, s2) {
            if (!e2) return _;
            var a2 = 1;
            if (t2 === g && (t2 = 6), n2 < 0 ? (a2 = 0, n2 = -n2) : 15 < n2 && (a2 = 2, n2 -= 16), i2 < 1 || y < i2 || r2 !== v || n2 < 8 || 15 < n2 || t2 < 0 || 9 < t2 || s2 < 0 || b < s2) return R(e2, _);
            8 === n2 && (n2 = 9);
            var o2 = new H();
            return (e2.state = o2).strm = e2, o2.wrap = a2, o2.gzhead = null, o2.w_bits = n2, o2.w_size = 1 << o2.w_bits, o2.w_mask = o2.w_size - 1, o2.hash_bits = i2 + 7, o2.hash_size = 1 << o2.hash_bits, o2.hash_mask = o2.hash_size - 1, o2.hash_shift = ~~((o2.hash_bits + x - 1) / x), o2.window = new c.Buf8(2 * o2.w_size), o2.head = new c.Buf16(o2.hash_size), o2.prev = new c.Buf16(o2.w_size), o2.lit_bufsize = 1 << i2 + 6, o2.pending_buf_size = 4 * o2.lit_bufsize, o2.pending_buf = new c.Buf8(o2.pending_buf_size), o2.d_buf = 1 * o2.lit_bufsize, o2.l_buf = 3 * o2.lit_bufsize, o2.level = t2, o2.strategy = s2, o2.method = r2, K(e2);
          }
          h = [new M(0, 0, 0, 0, function(e2, t2) {
            var r2 = 65535;
            for (r2 > e2.pending_buf_size - 5 && (r2 = e2.pending_buf_size - 5); ; ) {
              if (e2.lookahead <= 1) {
                if (j(e2), 0 === e2.lookahead && t2 === l) return A;
                if (0 === e2.lookahead) break;
              }
              e2.strstart += e2.lookahead, e2.lookahead = 0;
              var n2 = e2.block_start + r2;
              if ((0 === e2.strstart || e2.strstart >= n2) && (e2.lookahead = e2.strstart - n2, e2.strstart = n2, N(e2, false), 0 === e2.strm.avail_out)) return A;
              if (e2.strstart - e2.block_start >= e2.w_size - z && (N(e2, false), 0 === e2.strm.avail_out)) return A;
            }
            return e2.insert = 0, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : (e2.strstart > e2.block_start && (N(e2, false), e2.strm.avail_out), A);
          }), new M(4, 4, 8, 4, Z), new M(4, 5, 16, 8, Z), new M(4, 6, 32, 32, Z), new M(4, 4, 16, 16, W), new M(8, 16, 32, 32, W), new M(8, 16, 128, 128, W), new M(8, 32, 128, 256, W), new M(32, 128, 258, 1024, W), new M(32, 258, 258, 4096, W)], r.deflateInit = function(e2, t2) {
            return Y(e2, t2, v, 15, 8, 0);
          }, r.deflateInit2 = Y, r.deflateReset = K, r.deflateResetKeep = G, r.deflateSetHeader = function(e2, t2) {
            return e2 && e2.state ? 2 !== e2.state.wrap ? _ : (e2.state.gzhead = t2, m) : _;
          }, r.deflate = function(e2, t2) {
            var r2, n2, i2, s2;
            if (!e2 || !e2.state || 5 < t2 || t2 < 0) return e2 ? R(e2, _) : _;
            if (n2 = e2.state, !e2.output || !e2.input && 0 !== e2.avail_in || 666 === n2.status && t2 !== f) return R(e2, 0 === e2.avail_out ? -5 : _);
            if (n2.strm = e2, r2 = n2.last_flush, n2.last_flush = t2, n2.status === C) if (2 === n2.wrap) e2.adler = 0, U(n2, 31), U(n2, 139), U(n2, 8), n2.gzhead ? (U(n2, (n2.gzhead.text ? 1 : 0) + (n2.gzhead.hcrc ? 2 : 0) + (n2.gzhead.extra ? 4 : 0) + (n2.gzhead.name ? 8 : 0) + (n2.gzhead.comment ? 16 : 0)), U(n2, 255 & n2.gzhead.time), U(n2, n2.gzhead.time >> 8 & 255), U(n2, n2.gzhead.time >> 16 & 255), U(n2, n2.gzhead.time >> 24 & 255), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 255 & n2.gzhead.os), n2.gzhead.extra && n2.gzhead.extra.length && (U(n2, 255 & n2.gzhead.extra.length), U(n2, n2.gzhead.extra.length >> 8 & 255)), n2.gzhead.hcrc && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending, 0)), n2.gzindex = 0, n2.status = 69) : (U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 3), n2.status = E);
            else {
              var a2 = v + (n2.w_bits - 8 << 4) << 8;
              a2 |= (2 <= n2.strategy || n2.level < 2 ? 0 : n2.level < 6 ? 1 : 6 === n2.level ? 2 : 3) << 6, 0 !== n2.strstart && (a2 |= 32), a2 += 31 - a2 % 31, n2.status = E, P(n2, a2), 0 !== n2.strstart && (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), e2.adler = 1;
            }
            if (69 === n2.status) if (n2.gzhead.extra) {
              for (i2 = n2.pending; n2.gzindex < (65535 & n2.gzhead.extra.length) && (n2.pending !== n2.pending_buf_size || (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending !== n2.pending_buf_size)); ) U(n2, 255 & n2.gzhead.extra[n2.gzindex]), n2.gzindex++;
              n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), n2.gzindex === n2.gzhead.extra.length && (n2.gzindex = 0, n2.status = 73);
            } else n2.status = 73;
            if (73 === n2.status) if (n2.gzhead.name) {
              i2 = n2.pending;
              do {
                if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                  s2 = 1;
                  break;
                }
                s2 = n2.gzindex < n2.gzhead.name.length ? 255 & n2.gzhead.name.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
              } while (0 !== s2);
              n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.gzindex = 0, n2.status = 91);
            } else n2.status = 91;
            if (91 === n2.status) if (n2.gzhead.comment) {
              i2 = n2.pending;
              do {
                if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                  s2 = 1;
                  break;
                }
                s2 = n2.gzindex < n2.gzhead.comment.length ? 255 & n2.gzhead.comment.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
              } while (0 !== s2);
              n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.status = 103);
            } else n2.status = 103;
            if (103 === n2.status && (n2.gzhead.hcrc ? (n2.pending + 2 > n2.pending_buf_size && F(e2), n2.pending + 2 <= n2.pending_buf_size && (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), e2.adler = 0, n2.status = E)) : n2.status = E), 0 !== n2.pending) {
              if (F(e2), 0 === e2.avail_out) return n2.last_flush = -1, m;
            } else if (0 === e2.avail_in && T(t2) <= T(r2) && t2 !== f) return R(e2, -5);
            if (666 === n2.status && 0 !== e2.avail_in) return R(e2, -5);
            if (0 !== e2.avail_in || 0 !== n2.lookahead || t2 !== l && 666 !== n2.status) {
              var o2 = 2 === n2.strategy ? (function(e3, t3) {
                for (var r3; ; ) {
                  if (0 === e3.lookahead && (j(e3), 0 === e3.lookahead)) {
                    if (t3 === l) return A;
                    break;
                  }
                  if (e3.match_length = 0, r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++, r3 && (N(e3, false), 0 === e3.strm.avail_out)) return A;
                }
                return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
              })(n2, t2) : 3 === n2.strategy ? (function(e3, t3) {
                for (var r3, n3, i3, s3, a3 = e3.window; ; ) {
                  if (e3.lookahead <= S) {
                    if (j(e3), e3.lookahead <= S && t3 === l) return A;
                    if (0 === e3.lookahead) break;
                  }
                  if (e3.match_length = 0, e3.lookahead >= x && 0 < e3.strstart && (n3 = a3[i3 = e3.strstart - 1]) === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3]) {
                    s3 = e3.strstart + S;
                    do {
                    } while (n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && i3 < s3);
                    e3.match_length = S - (s3 - i3), e3.match_length > e3.lookahead && (e3.match_length = e3.lookahead);
                  }
                  if (e3.match_length >= x ? (r3 = u._tr_tally(e3, 1, e3.match_length - x), e3.lookahead -= e3.match_length, e3.strstart += e3.match_length, e3.match_length = 0) : (r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++), r3 && (N(e3, false), 0 === e3.strm.avail_out)) return A;
                }
                return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
              })(n2, t2) : h[n2.level].func(n2, t2);
              if (o2 !== O && o2 !== B || (n2.status = 666), o2 === A || o2 === O) return 0 === e2.avail_out && (n2.last_flush = -1), m;
              if (o2 === I && (1 === t2 ? u._tr_align(n2) : 5 !== t2 && (u._tr_stored_block(n2, 0, 0, false), 3 === t2 && (D(n2.head), 0 === n2.lookahead && (n2.strstart = 0, n2.block_start = 0, n2.insert = 0))), F(e2), 0 === e2.avail_out)) return n2.last_flush = -1, m;
            }
            return t2 !== f ? m : n2.wrap <= 0 ? 1 : (2 === n2.wrap ? (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), U(n2, e2.adler >> 16 & 255), U(n2, e2.adler >> 24 & 255), U(n2, 255 & e2.total_in), U(n2, e2.total_in >> 8 & 255), U(n2, e2.total_in >> 16 & 255), U(n2, e2.total_in >> 24 & 255)) : (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), F(e2), 0 < n2.wrap && (n2.wrap = -n2.wrap), 0 !== n2.pending ? m : 1);
          }, r.deflateEnd = function(e2) {
            var t2;
            return e2 && e2.state ? (t2 = e2.state.status) !== C && 69 !== t2 && 73 !== t2 && 91 !== t2 && 103 !== t2 && t2 !== E && 666 !== t2 ? R(e2, _) : (e2.state = null, t2 === E ? R(e2, -3) : m) : _;
          }, r.deflateSetDictionary = function(e2, t2) {
            var r2, n2, i2, s2, a2, o2, h2, u2, l2 = t2.length;
            if (!e2 || !e2.state) return _;
            if (2 === (s2 = (r2 = e2.state).wrap) || 1 === s2 && r2.status !== C || r2.lookahead) return _;
            for (1 === s2 && (e2.adler = d(e2.adler, t2, l2, 0)), r2.wrap = 0, l2 >= r2.w_size && (0 === s2 && (D(r2.head), r2.strstart = 0, r2.block_start = 0, r2.insert = 0), u2 = new c.Buf8(r2.w_size), c.arraySet(u2, t2, l2 - r2.w_size, r2.w_size, 0), t2 = u2, l2 = r2.w_size), a2 = e2.avail_in, o2 = e2.next_in, h2 = e2.input, e2.avail_in = l2, e2.next_in = 0, e2.input = t2, j(r2); r2.lookahead >= x; ) {
              for (n2 = r2.strstart, i2 = r2.lookahead - (x - 1); r2.ins_h = (r2.ins_h << r2.hash_shift ^ r2.window[n2 + x - 1]) & r2.hash_mask, r2.prev[n2 & r2.w_mask] = r2.head[r2.ins_h], r2.head[r2.ins_h] = n2, n2++, --i2; ) ;
              r2.strstart = n2, r2.lookahead = x - 1, j(r2);
            }
            return r2.strstart += r2.lookahead, r2.block_start = r2.strstart, r2.insert = r2.lookahead, r2.lookahead = 0, r2.match_length = r2.prev_length = x - 1, r2.match_available = 0, e2.next_in = o2, e2.input = h2, e2.avail_in = a2, r2.wrap = s2, m;
          }, r.deflateInfo = "pako deflate (from Nodeca project)";
        }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, t, r) {
          "use strict";
          t.exports = function() {
            this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
          };
        }, {}], 48: [function(e, t, r) {
          "use strict";
          t.exports = function(e2, t2) {
            var r2, n, i, s, a, o, h, u, l, f, c, d, p, m, _, g, b, v, y, w, k, x, S, z, C;
            r2 = e2.state, n = e2.next_in, z = e2.input, i = n + (e2.avail_in - 5), s = e2.next_out, C = e2.output, a = s - (t2 - e2.avail_out), o = s + (e2.avail_out - 257), h = r2.dmax, u = r2.wsize, l = r2.whave, f = r2.wnext, c = r2.window, d = r2.hold, p = r2.bits, m = r2.lencode, _ = r2.distcode, g = (1 << r2.lenbits) - 1, b = (1 << r2.distbits) - 1;
            e: do {
              p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = m[d & g];
              t: for (; ; ) {
                if (d >>>= y = v >>> 24, p -= y, 0 === (y = v >>> 16 & 255)) C[s++] = 65535 & v;
                else {
                  if (!(16 & y)) {
                    if (0 == (64 & y)) {
                      v = m[(65535 & v) + (d & (1 << y) - 1)];
                      continue t;
                    }
                    if (32 & y) {
                      r2.mode = 12;
                      break e;
                    }
                    e2.msg = "invalid literal/length code", r2.mode = 30;
                    break e;
                  }
                  w = 65535 & v, (y &= 15) && (p < y && (d += z[n++] << p, p += 8), w += d & (1 << y) - 1, d >>>= y, p -= y), p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = _[d & b];
                  r: for (; ; ) {
                    if (d >>>= y = v >>> 24, p -= y, !(16 & (y = v >>> 16 & 255))) {
                      if (0 == (64 & y)) {
                        v = _[(65535 & v) + (d & (1 << y) - 1)];
                        continue r;
                      }
                      e2.msg = "invalid distance code", r2.mode = 30;
                      break e;
                    }
                    if (k = 65535 & v, p < (y &= 15) && (d += z[n++] << p, (p += 8) < y && (d += z[n++] << p, p += 8)), h < (k += d & (1 << y) - 1)) {
                      e2.msg = "invalid distance too far back", r2.mode = 30;
                      break e;
                    }
                    if (d >>>= y, p -= y, (y = s - a) < k) {
                      if (l < (y = k - y) && r2.sane) {
                        e2.msg = "invalid distance too far back", r2.mode = 30;
                        break e;
                      }
                      if (S = c, (x = 0) === f) {
                        if (x += u - y, y < w) {
                          for (w -= y; C[s++] = c[x++], --y; ) ;
                          x = s - k, S = C;
                        }
                      } else if (f < y) {
                        if (x += u + f - y, (y -= f) < w) {
                          for (w -= y; C[s++] = c[x++], --y; ) ;
                          if (x = 0, f < w) {
                            for (w -= y = f; C[s++] = c[x++], --y; ) ;
                            x = s - k, S = C;
                          }
                        }
                      } else if (x += f - y, y < w) {
                        for (w -= y; C[s++] = c[x++], --y; ) ;
                        x = s - k, S = C;
                      }
                      for (; 2 < w; ) C[s++] = S[x++], C[s++] = S[x++], C[s++] = S[x++], w -= 3;
                      w && (C[s++] = S[x++], 1 < w && (C[s++] = S[x++]));
                    } else {
                      for (x = s - k; C[s++] = C[x++], C[s++] = C[x++], C[s++] = C[x++], 2 < (w -= 3); ) ;
                      w && (C[s++] = C[x++], 1 < w && (C[s++] = C[x++]));
                    }
                    break;
                  }
                }
                break;
              }
            } while (n < i && s < o);
            n -= w = p >> 3, d &= (1 << (p -= w << 3)) - 1, e2.next_in = n, e2.next_out = s, e2.avail_in = n < i ? i - n + 5 : 5 - (n - i), e2.avail_out = s < o ? o - s + 257 : 257 - (s - o), r2.hold = d, r2.bits = p;
          };
        }, {}], 49: [function(e, t, r) {
          "use strict";
          var I = e("../utils/common"), O = e("./adler32"), B = e("./crc32"), R = e("./inffast"), T = e("./inftrees"), D = 1, F = 2, N = 0, U = -2, P = 1, n = 852, i = 592;
          function L(e2) {
            return (e2 >>> 24 & 255) + (e2 >>> 8 & 65280) + ((65280 & e2) << 8) + ((255 & e2) << 24);
          }
          function s() {
            this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new I.Buf16(320), this.work = new I.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
          }
          function a(e2) {
            var t2;
            return e2 && e2.state ? (t2 = e2.state, e2.total_in = e2.total_out = t2.total = 0, e2.msg = "", t2.wrap && (e2.adler = 1 & t2.wrap), t2.mode = P, t2.last = 0, t2.havedict = 0, t2.dmax = 32768, t2.head = null, t2.hold = 0, t2.bits = 0, t2.lencode = t2.lendyn = new I.Buf32(n), t2.distcode = t2.distdyn = new I.Buf32(i), t2.sane = 1, t2.back = -1, N) : U;
          }
          function o(e2) {
            var t2;
            return e2 && e2.state ? ((t2 = e2.state).wsize = 0, t2.whave = 0, t2.wnext = 0, a(e2)) : U;
          }
          function h(e2, t2) {
            var r2, n2;
            return e2 && e2.state ? (n2 = e2.state, t2 < 0 ? (r2 = 0, t2 = -t2) : (r2 = 1 + (t2 >> 4), t2 < 48 && (t2 &= 15)), t2 && (t2 < 8 || 15 < t2) ? U : (null !== n2.window && n2.wbits !== t2 && (n2.window = null), n2.wrap = r2, n2.wbits = t2, o(e2))) : U;
          }
          function u(e2, t2) {
            var r2, n2;
            return e2 ? (n2 = new s(), (e2.state = n2).window = null, (r2 = h(e2, t2)) !== N && (e2.state = null), r2) : U;
          }
          var l, f, c = true;
          function j(e2) {
            if (c) {
              var t2;
              for (l = new I.Buf32(512), f = new I.Buf32(32), t2 = 0; t2 < 144; ) e2.lens[t2++] = 8;
              for (; t2 < 256; ) e2.lens[t2++] = 9;
              for (; t2 < 280; ) e2.lens[t2++] = 7;
              for (; t2 < 288; ) e2.lens[t2++] = 8;
              for (T(D, e2.lens, 0, 288, l, 0, e2.work, { bits: 9 }), t2 = 0; t2 < 32; ) e2.lens[t2++] = 5;
              T(F, e2.lens, 0, 32, f, 0, e2.work, { bits: 5 }), c = false;
            }
            e2.lencode = l, e2.lenbits = 9, e2.distcode = f, e2.distbits = 5;
          }
          function Z(e2, t2, r2, n2) {
            var i2, s2 = e2.state;
            return null === s2.window && (s2.wsize = 1 << s2.wbits, s2.wnext = 0, s2.whave = 0, s2.window = new I.Buf8(s2.wsize)), n2 >= s2.wsize ? (I.arraySet(s2.window, t2, r2 - s2.wsize, s2.wsize, 0), s2.wnext = 0, s2.whave = s2.wsize) : (n2 < (i2 = s2.wsize - s2.wnext) && (i2 = n2), I.arraySet(s2.window, t2, r2 - n2, i2, s2.wnext), (n2 -= i2) ? (I.arraySet(s2.window, t2, r2 - n2, n2, 0), s2.wnext = n2, s2.whave = s2.wsize) : (s2.wnext += i2, s2.wnext === s2.wsize && (s2.wnext = 0), s2.whave < s2.wsize && (s2.whave += i2))), 0;
          }
          r.inflateReset = o, r.inflateReset2 = h, r.inflateResetKeep = a, r.inflateInit = function(e2) {
            return u(e2, 15);
          }, r.inflateInit2 = u, r.inflate = function(e2, t2) {
            var r2, n2, i2, s2, a2, o2, h2, u2, l2, f2, c2, d, p, m, _, g, b, v, y, w, k, x, S, z, C = 0, E = new I.Buf8(4), A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
            if (!e2 || !e2.state || !e2.output || !e2.input && 0 !== e2.avail_in) return U;
            12 === (r2 = e2.state).mode && (r2.mode = 13), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, f2 = o2, c2 = h2, x = N;
            e: for (; ; ) switch (r2.mode) {
              case P:
                if (0 === r2.wrap) {
                  r2.mode = 13;
                  break;
                }
                for (; l2 < 16; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (2 & r2.wrap && 35615 === u2) {
                  E[r2.check = 0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0), l2 = u2 = 0, r2.mode = 2;
                  break;
                }
                if (r2.flags = 0, r2.head && (r2.head.done = false), !(1 & r2.wrap) || (((255 & u2) << 8) + (u2 >> 8)) % 31) {
                  e2.msg = "incorrect header check", r2.mode = 30;
                  break;
                }
                if (8 != (15 & u2)) {
                  e2.msg = "unknown compression method", r2.mode = 30;
                  break;
                }
                if (l2 -= 4, k = 8 + (15 & (u2 >>>= 4)), 0 === r2.wbits) r2.wbits = k;
                else if (k > r2.wbits) {
                  e2.msg = "invalid window size", r2.mode = 30;
                  break;
                }
                r2.dmax = 1 << k, e2.adler = r2.check = 1, r2.mode = 512 & u2 ? 10 : 12, l2 = u2 = 0;
                break;
              case 2:
                for (; l2 < 16; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (r2.flags = u2, 8 != (255 & r2.flags)) {
                  e2.msg = "unknown compression method", r2.mode = 30;
                  break;
                }
                if (57344 & r2.flags) {
                  e2.msg = "unknown header flags set", r2.mode = 30;
                  break;
                }
                r2.head && (r2.head.text = u2 >> 8 & 1), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 3;
              case 3:
                for (; l2 < 32; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.head && (r2.head.time = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, E[2] = u2 >>> 16 & 255, E[3] = u2 >>> 24 & 255, r2.check = B(r2.check, E, 4, 0)), l2 = u2 = 0, r2.mode = 4;
              case 4:
                for (; l2 < 16; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.head && (r2.head.xflags = 255 & u2, r2.head.os = u2 >> 8), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 5;
              case 5:
                if (1024 & r2.flags) {
                  for (; l2 < 16; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.length = u2, r2.head && (r2.head.extra_len = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0;
                } else r2.head && (r2.head.extra = null);
                r2.mode = 6;
              case 6:
                if (1024 & r2.flags && (o2 < (d = r2.length) && (d = o2), d && (r2.head && (k = r2.head.extra_len - r2.length, r2.head.extra || (r2.head.extra = new Array(r2.head.extra_len)), I.arraySet(r2.head.extra, n2, s2, d, k)), 512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, r2.length -= d), r2.length)) break e;
                r2.length = 0, r2.mode = 7;
              case 7:
                if (2048 & r2.flags) {
                  if (0 === o2) break e;
                  for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.name += String.fromCharCode(k)), k && d < o2; ) ;
                  if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k) break e;
                } else r2.head && (r2.head.name = null);
                r2.length = 0, r2.mode = 8;
              case 8:
                if (4096 & r2.flags) {
                  if (0 === o2) break e;
                  for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.comment += String.fromCharCode(k)), k && d < o2; ) ;
                  if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k) break e;
                } else r2.head && (r2.head.comment = null);
                r2.mode = 9;
              case 9:
                if (512 & r2.flags) {
                  for (; l2 < 16; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (u2 !== (65535 & r2.check)) {
                    e2.msg = "header crc mismatch", r2.mode = 30;
                    break;
                  }
                  l2 = u2 = 0;
                }
                r2.head && (r2.head.hcrc = r2.flags >> 9 & 1, r2.head.done = true), e2.adler = r2.check = 0, r2.mode = 12;
                break;
              case 10:
                for (; l2 < 32; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                e2.adler = r2.check = L(u2), l2 = u2 = 0, r2.mode = 11;
              case 11:
                if (0 === r2.havedict) return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, 2;
                e2.adler = r2.check = 1, r2.mode = 12;
              case 12:
                if (5 === t2 || 6 === t2) break e;
              case 13:
                if (r2.last) {
                  u2 >>>= 7 & l2, l2 -= 7 & l2, r2.mode = 27;
                  break;
                }
                for (; l2 < 3; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                switch (r2.last = 1 & u2, l2 -= 1, 3 & (u2 >>>= 1)) {
                  case 0:
                    r2.mode = 14;
                    break;
                  case 1:
                    if (j(r2), r2.mode = 20, 6 !== t2) break;
                    u2 >>>= 2, l2 -= 2;
                    break e;
                  case 2:
                    r2.mode = 17;
                    break;
                  case 3:
                    e2.msg = "invalid block type", r2.mode = 30;
                }
                u2 >>>= 2, l2 -= 2;
                break;
              case 14:
                for (u2 >>>= 7 & l2, l2 -= 7 & l2; l2 < 32; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if ((65535 & u2) != (u2 >>> 16 ^ 65535)) {
                  e2.msg = "invalid stored block lengths", r2.mode = 30;
                  break;
                }
                if (r2.length = 65535 & u2, l2 = u2 = 0, r2.mode = 15, 6 === t2) break e;
              case 15:
                r2.mode = 16;
              case 16:
                if (d = r2.length) {
                  if (o2 < d && (d = o2), h2 < d && (d = h2), 0 === d) break e;
                  I.arraySet(i2, n2, s2, d, a2), o2 -= d, s2 += d, h2 -= d, a2 += d, r2.length -= d;
                  break;
                }
                r2.mode = 12;
                break;
              case 17:
                for (; l2 < 14; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (r2.nlen = 257 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ndist = 1 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ncode = 4 + (15 & u2), u2 >>>= 4, l2 -= 4, 286 < r2.nlen || 30 < r2.ndist) {
                  e2.msg = "too many length or distance symbols", r2.mode = 30;
                  break;
                }
                r2.have = 0, r2.mode = 18;
              case 18:
                for (; r2.have < r2.ncode; ) {
                  for (; l2 < 3; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.lens[A[r2.have++]] = 7 & u2, u2 >>>= 3, l2 -= 3;
                }
                for (; r2.have < 19; ) r2.lens[A[r2.have++]] = 0;
                if (r2.lencode = r2.lendyn, r2.lenbits = 7, S = { bits: r2.lenbits }, x = T(0, r2.lens, 0, 19, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
                  e2.msg = "invalid code lengths set", r2.mode = 30;
                  break;
                }
                r2.have = 0, r2.mode = 19;
              case 19:
                for (; r2.have < r2.nlen + r2.ndist; ) {
                  for (; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (b < 16) u2 >>>= _, l2 -= _, r2.lens[r2.have++] = b;
                  else {
                    if (16 === b) {
                      for (z = _ + 2; l2 < z; ) {
                        if (0 === o2) break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      if (u2 >>>= _, l2 -= _, 0 === r2.have) {
                        e2.msg = "invalid bit length repeat", r2.mode = 30;
                        break;
                      }
                      k = r2.lens[r2.have - 1], d = 3 + (3 & u2), u2 >>>= 2, l2 -= 2;
                    } else if (17 === b) {
                      for (z = _ + 3; l2 < z; ) {
                        if (0 === o2) break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      l2 -= _, k = 0, d = 3 + (7 & (u2 >>>= _)), u2 >>>= 3, l2 -= 3;
                    } else {
                      for (z = _ + 7; l2 < z; ) {
                        if (0 === o2) break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      l2 -= _, k = 0, d = 11 + (127 & (u2 >>>= _)), u2 >>>= 7, l2 -= 7;
                    }
                    if (r2.have + d > r2.nlen + r2.ndist) {
                      e2.msg = "invalid bit length repeat", r2.mode = 30;
                      break;
                    }
                    for (; d--; ) r2.lens[r2.have++] = k;
                  }
                }
                if (30 === r2.mode) break;
                if (0 === r2.lens[256]) {
                  e2.msg = "invalid code -- missing end-of-block", r2.mode = 30;
                  break;
                }
                if (r2.lenbits = 9, S = { bits: r2.lenbits }, x = T(D, r2.lens, 0, r2.nlen, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
                  e2.msg = "invalid literal/lengths set", r2.mode = 30;
                  break;
                }
                if (r2.distbits = 6, r2.distcode = r2.distdyn, S = { bits: r2.distbits }, x = T(F, r2.lens, r2.nlen, r2.ndist, r2.distcode, 0, r2.work, S), r2.distbits = S.bits, x) {
                  e2.msg = "invalid distances set", r2.mode = 30;
                  break;
                }
                if (r2.mode = 20, 6 === t2) break e;
              case 20:
                r2.mode = 21;
              case 21:
                if (6 <= o2 && 258 <= h2) {
                  e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, R(e2, c2), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, 12 === r2.mode && (r2.back = -1);
                  break;
                }
                for (r2.back = 0; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (g && 0 == (240 & g)) {
                  for (v = _, y = g, w = b; g = (C = r2.lencode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  u2 >>>= v, l2 -= v, r2.back += v;
                }
                if (u2 >>>= _, l2 -= _, r2.back += _, r2.length = b, 0 === g) {
                  r2.mode = 26;
                  break;
                }
                if (32 & g) {
                  r2.back = -1, r2.mode = 12;
                  break;
                }
                if (64 & g) {
                  e2.msg = "invalid literal/length code", r2.mode = 30;
                  break;
                }
                r2.extra = 15 & g, r2.mode = 22;
              case 22:
                if (r2.extra) {
                  for (z = r2.extra; l2 < z; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.length += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
                }
                r2.was = r2.length, r2.mode = 23;
              case 23:
                for (; g = (C = r2.distcode[u2 & (1 << r2.distbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (0 == (240 & g)) {
                  for (v = _, y = g, w = b; g = (C = r2.distcode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  u2 >>>= v, l2 -= v, r2.back += v;
                }
                if (u2 >>>= _, l2 -= _, r2.back += _, 64 & g) {
                  e2.msg = "invalid distance code", r2.mode = 30;
                  break;
                }
                r2.offset = b, r2.extra = 15 & g, r2.mode = 24;
              case 24:
                if (r2.extra) {
                  for (z = r2.extra; l2 < z; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.offset += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
                }
                if (r2.offset > r2.dmax) {
                  e2.msg = "invalid distance too far back", r2.mode = 30;
                  break;
                }
                r2.mode = 25;
              case 25:
                if (0 === h2) break e;
                if (d = c2 - h2, r2.offset > d) {
                  if ((d = r2.offset - d) > r2.whave && r2.sane) {
                    e2.msg = "invalid distance too far back", r2.mode = 30;
                    break;
                  }
                  p = d > r2.wnext ? (d -= r2.wnext, r2.wsize - d) : r2.wnext - d, d > r2.length && (d = r2.length), m = r2.window;
                } else m = i2, p = a2 - r2.offset, d = r2.length;
                for (h2 < d && (d = h2), h2 -= d, r2.length -= d; i2[a2++] = m[p++], --d; ) ;
                0 === r2.length && (r2.mode = 21);
                break;
              case 26:
                if (0 === h2) break e;
                i2[a2++] = r2.length, h2--, r2.mode = 21;
                break;
              case 27:
                if (r2.wrap) {
                  for (; l2 < 32; ) {
                    if (0 === o2) break e;
                    o2--, u2 |= n2[s2++] << l2, l2 += 8;
                  }
                  if (c2 -= h2, e2.total_out += c2, r2.total += c2, c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, a2 - c2) : O(r2.check, i2, c2, a2 - c2)), c2 = h2, (r2.flags ? u2 : L(u2)) !== r2.check) {
                    e2.msg = "incorrect data check", r2.mode = 30;
                    break;
                  }
                  l2 = u2 = 0;
                }
                r2.mode = 28;
              case 28:
                if (r2.wrap && r2.flags) {
                  for (; l2 < 32; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (u2 !== (4294967295 & r2.total)) {
                    e2.msg = "incorrect length check", r2.mode = 30;
                    break;
                  }
                  l2 = u2 = 0;
                }
                r2.mode = 29;
              case 29:
                x = 1;
                break e;
              case 30:
                x = -3;
                break e;
              case 31:
                return -4;
              case 32:
              default:
                return U;
            }
            return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, (r2.wsize || c2 !== e2.avail_out && r2.mode < 30 && (r2.mode < 27 || 4 !== t2)) && Z(e2, e2.output, e2.next_out, c2 - e2.avail_out) ? (r2.mode = 31, -4) : (f2 -= e2.avail_in, c2 -= e2.avail_out, e2.total_in += f2, e2.total_out += c2, r2.total += c2, r2.wrap && c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, e2.next_out - c2) : O(r2.check, i2, c2, e2.next_out - c2)), e2.data_type = r2.bits + (r2.last ? 64 : 0) + (12 === r2.mode ? 128 : 0) + (20 === r2.mode || 15 === r2.mode ? 256 : 0), (0 == f2 && 0 === c2 || 4 === t2) && x === N && (x = -5), x);
          }, r.inflateEnd = function(e2) {
            if (!e2 || !e2.state) return U;
            var t2 = e2.state;
            return t2.window && (t2.window = null), e2.state = null, N;
          }, r.inflateGetHeader = function(e2, t2) {
            var r2;
            return e2 && e2.state ? 0 == (2 & (r2 = e2.state).wrap) ? U : ((r2.head = t2).done = false, N) : U;
          }, r.inflateSetDictionary = function(e2, t2) {
            var r2, n2 = t2.length;
            return e2 && e2.state ? 0 !== (r2 = e2.state).wrap && 11 !== r2.mode ? U : 11 === r2.mode && O(1, t2, n2, 0) !== r2.check ? -3 : Z(e2, t2, n2, n2) ? (r2.mode = 31, -4) : (r2.havedict = 1, N) : U;
          }, r.inflateInfo = "pako inflate (from Nodeca project)";
        }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, t, r) {
          "use strict";
          var D = e("../utils/common"), F = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], N = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], U = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], P = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
          t.exports = function(e2, t2, r2, n, i, s, a, o) {
            var h, u, l, f, c, d, p, m, _, g = o.bits, b = 0, v = 0, y = 0, w = 0, k = 0, x = 0, S = 0, z = 0, C = 0, E = 0, A = null, I = 0, O = new D.Buf16(16), B = new D.Buf16(16), R = null, T = 0;
            for (b = 0; b <= 15; b++) O[b] = 0;
            for (v = 0; v < n; v++) O[t2[r2 + v]]++;
            for (k = g, w = 15; 1 <= w && 0 === O[w]; w--) ;
            if (w < k && (k = w), 0 === w) return i[s++] = 20971520, i[s++] = 20971520, o.bits = 1, 0;
            for (y = 1; y < w && 0 === O[y]; y++) ;
            for (k < y && (k = y), b = z = 1; b <= 15; b++) if (z <<= 1, (z -= O[b]) < 0) return -1;
            if (0 < z && (0 === e2 || 1 !== w)) return -1;
            for (B[1] = 0, b = 1; b < 15; b++) B[b + 1] = B[b] + O[b];
            for (v = 0; v < n; v++) 0 !== t2[r2 + v] && (a[B[t2[r2 + v]]++] = v);
            if (d = 0 === e2 ? (A = R = a, 19) : 1 === e2 ? (A = F, I -= 257, R = N, T -= 257, 256) : (A = U, R = P, -1), b = y, c = s, S = v = E = 0, l = -1, f = (C = 1 << (x = k)) - 1, 1 === e2 && 852 < C || 2 === e2 && 592 < C) return 1;
            for (; ; ) {
              for (p = b - S, _ = a[v] < d ? (m = 0, a[v]) : a[v] > d ? (m = R[T + a[v]], A[I + a[v]]) : (m = 96, 0), h = 1 << b - S, y = u = 1 << x; i[c + (E >> S) + (u -= h)] = p << 24 | m << 16 | _ | 0, 0 !== u; ) ;
              for (h = 1 << b - 1; E & h; ) h >>= 1;
              if (0 !== h ? (E &= h - 1, E += h) : E = 0, v++, 0 == --O[b]) {
                if (b === w) break;
                b = t2[r2 + a[v]];
              }
              if (k < b && (E & f) !== l) {
                for (0 === S && (S = k), c += y, z = 1 << (x = b - S); x + S < w && !((z -= O[x + S]) <= 0); ) x++, z <<= 1;
                if (C += 1 << x, 1 === e2 && 852 < C || 2 === e2 && 592 < C) return 1;
                i[l = E & f] = k << 24 | x << 16 | c - s | 0;
              }
            }
            return 0 !== E && (i[c + E] = b - S << 24 | 64 << 16 | 0), o.bits = k, 0;
          };
        }, { "../utils/common": 41 }], 51: [function(e, t, r) {
          "use strict";
          t.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
        }, {}], 52: [function(e, t, r) {
          "use strict";
          var i = e("../utils/common"), o = 0, h = 1;
          function n(e2) {
            for (var t2 = e2.length; 0 <= --t2; ) e2[t2] = 0;
          }
          var s = 0, a = 29, u = 256, l = u + 1 + a, f = 30, c = 19, _ = 2 * l + 1, g = 15, d = 16, p = 7, m = 256, b = 16, v = 17, y = 18, w = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], k = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], S = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], z = new Array(2 * (l + 2));
          n(z);
          var C = new Array(2 * f);
          n(C);
          var E = new Array(512);
          n(E);
          var A = new Array(256);
          n(A);
          var I = new Array(a);
          n(I);
          var O, B, R, T = new Array(f);
          function D(e2, t2, r2, n2, i2) {
            this.static_tree = e2, this.extra_bits = t2, this.extra_base = r2, this.elems = n2, this.max_length = i2, this.has_stree = e2 && e2.length;
          }
          function F(e2, t2) {
            this.dyn_tree = e2, this.max_code = 0, this.stat_desc = t2;
          }
          function N(e2) {
            return e2 < 256 ? E[e2] : E[256 + (e2 >>> 7)];
          }
          function U(e2, t2) {
            e2.pending_buf[e2.pending++] = 255 & t2, e2.pending_buf[e2.pending++] = t2 >>> 8 & 255;
          }
          function P(e2, t2, r2) {
            e2.bi_valid > d - r2 ? (e2.bi_buf |= t2 << e2.bi_valid & 65535, U(e2, e2.bi_buf), e2.bi_buf = t2 >> d - e2.bi_valid, e2.bi_valid += r2 - d) : (e2.bi_buf |= t2 << e2.bi_valid & 65535, e2.bi_valid += r2);
          }
          function L(e2, t2, r2) {
            P(e2, r2[2 * t2], r2[2 * t2 + 1]);
          }
          function j(e2, t2) {
            for (var r2 = 0; r2 |= 1 & e2, e2 >>>= 1, r2 <<= 1, 0 < --t2; ) ;
            return r2 >>> 1;
          }
          function Z(e2, t2, r2) {
            var n2, i2, s2 = new Array(g + 1), a2 = 0;
            for (n2 = 1; n2 <= g; n2++) s2[n2] = a2 = a2 + r2[n2 - 1] << 1;
            for (i2 = 0; i2 <= t2; i2++) {
              var o2 = e2[2 * i2 + 1];
              0 !== o2 && (e2[2 * i2] = j(s2[o2]++, o2));
            }
          }
          function W(e2) {
            var t2;
            for (t2 = 0; t2 < l; t2++) e2.dyn_ltree[2 * t2] = 0;
            for (t2 = 0; t2 < f; t2++) e2.dyn_dtree[2 * t2] = 0;
            for (t2 = 0; t2 < c; t2++) e2.bl_tree[2 * t2] = 0;
            e2.dyn_ltree[2 * m] = 1, e2.opt_len = e2.static_len = 0, e2.last_lit = e2.matches = 0;
          }
          function M(e2) {
            8 < e2.bi_valid ? U(e2, e2.bi_buf) : 0 < e2.bi_valid && (e2.pending_buf[e2.pending++] = e2.bi_buf), e2.bi_buf = 0, e2.bi_valid = 0;
          }
          function H(e2, t2, r2, n2) {
            var i2 = 2 * t2, s2 = 2 * r2;
            return e2[i2] < e2[s2] || e2[i2] === e2[s2] && n2[t2] <= n2[r2];
          }
          function G(e2, t2, r2) {
            for (var n2 = e2.heap[r2], i2 = r2 << 1; i2 <= e2.heap_len && (i2 < e2.heap_len && H(t2, e2.heap[i2 + 1], e2.heap[i2], e2.depth) && i2++, !H(t2, n2, e2.heap[i2], e2.depth)); ) e2.heap[r2] = e2.heap[i2], r2 = i2, i2 <<= 1;
            e2.heap[r2] = n2;
          }
          function K(e2, t2, r2) {
            var n2, i2, s2, a2, o2 = 0;
            if (0 !== e2.last_lit) for (; n2 = e2.pending_buf[e2.d_buf + 2 * o2] << 8 | e2.pending_buf[e2.d_buf + 2 * o2 + 1], i2 = e2.pending_buf[e2.l_buf + o2], o2++, 0 === n2 ? L(e2, i2, t2) : (L(e2, (s2 = A[i2]) + u + 1, t2), 0 !== (a2 = w[s2]) && P(e2, i2 -= I[s2], a2), L(e2, s2 = N(--n2), r2), 0 !== (a2 = k[s2]) && P(e2, n2 -= T[s2], a2)), o2 < e2.last_lit; ) ;
            L(e2, m, t2);
          }
          function Y(e2, t2) {
            var r2, n2, i2, s2 = t2.dyn_tree, a2 = t2.stat_desc.static_tree, o2 = t2.stat_desc.has_stree, h2 = t2.stat_desc.elems, u2 = -1;
            for (e2.heap_len = 0, e2.heap_max = _, r2 = 0; r2 < h2; r2++) 0 !== s2[2 * r2] ? (e2.heap[++e2.heap_len] = u2 = r2, e2.depth[r2] = 0) : s2[2 * r2 + 1] = 0;
            for (; e2.heap_len < 2; ) s2[2 * (i2 = e2.heap[++e2.heap_len] = u2 < 2 ? ++u2 : 0)] = 1, e2.depth[i2] = 0, e2.opt_len--, o2 && (e2.static_len -= a2[2 * i2 + 1]);
            for (t2.max_code = u2, r2 = e2.heap_len >> 1; 1 <= r2; r2--) G(e2, s2, r2);
            for (i2 = h2; r2 = e2.heap[1], e2.heap[1] = e2.heap[e2.heap_len--], G(e2, s2, 1), n2 = e2.heap[1], e2.heap[--e2.heap_max] = r2, e2.heap[--e2.heap_max] = n2, s2[2 * i2] = s2[2 * r2] + s2[2 * n2], e2.depth[i2] = (e2.depth[r2] >= e2.depth[n2] ? e2.depth[r2] : e2.depth[n2]) + 1, s2[2 * r2 + 1] = s2[2 * n2 + 1] = i2, e2.heap[1] = i2++, G(e2, s2, 1), 2 <= e2.heap_len; ) ;
            e2.heap[--e2.heap_max] = e2.heap[1], (function(e3, t3) {
              var r3, n3, i3, s3, a3, o3, h3 = t3.dyn_tree, u3 = t3.max_code, l2 = t3.stat_desc.static_tree, f2 = t3.stat_desc.has_stree, c2 = t3.stat_desc.extra_bits, d2 = t3.stat_desc.extra_base, p2 = t3.stat_desc.max_length, m2 = 0;
              for (s3 = 0; s3 <= g; s3++) e3.bl_count[s3] = 0;
              for (h3[2 * e3.heap[e3.heap_max] + 1] = 0, r3 = e3.heap_max + 1; r3 < _; r3++) p2 < (s3 = h3[2 * h3[2 * (n3 = e3.heap[r3]) + 1] + 1] + 1) && (s3 = p2, m2++), h3[2 * n3 + 1] = s3, u3 < n3 || (e3.bl_count[s3]++, a3 = 0, d2 <= n3 && (a3 = c2[n3 - d2]), o3 = h3[2 * n3], e3.opt_len += o3 * (s3 + a3), f2 && (e3.static_len += o3 * (l2[2 * n3 + 1] + a3)));
              if (0 !== m2) {
                do {
                  for (s3 = p2 - 1; 0 === e3.bl_count[s3]; ) s3--;
                  e3.bl_count[s3]--, e3.bl_count[s3 + 1] += 2, e3.bl_count[p2]--, m2 -= 2;
                } while (0 < m2);
                for (s3 = p2; 0 !== s3; s3--) for (n3 = e3.bl_count[s3]; 0 !== n3; ) u3 < (i3 = e3.heap[--r3]) || (h3[2 * i3 + 1] !== s3 && (e3.opt_len += (s3 - h3[2 * i3 + 1]) * h3[2 * i3], h3[2 * i3 + 1] = s3), n3--);
              }
            })(e2, t2), Z(s2, u2, e2.bl_count);
          }
          function X(e2, t2, r2) {
            var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
            for (0 === a2 && (h2 = 138, u2 = 3), t2[2 * (r2 + 1) + 1] = 65535, n2 = 0; n2 <= r2; n2++) i2 = a2, a2 = t2[2 * (n2 + 1) + 1], ++o2 < h2 && i2 === a2 || (o2 < u2 ? e2.bl_tree[2 * i2] += o2 : 0 !== i2 ? (i2 !== s2 && e2.bl_tree[2 * i2]++, e2.bl_tree[2 * b]++) : o2 <= 10 ? e2.bl_tree[2 * v]++ : e2.bl_tree[2 * y]++, s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4));
          }
          function V(e2, t2, r2) {
            var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
            for (0 === a2 && (h2 = 138, u2 = 3), n2 = 0; n2 <= r2; n2++) if (i2 = a2, a2 = t2[2 * (n2 + 1) + 1], !(++o2 < h2 && i2 === a2)) {
              if (o2 < u2) for (; L(e2, i2, e2.bl_tree), 0 != --o2; ) ;
              else 0 !== i2 ? (i2 !== s2 && (L(e2, i2, e2.bl_tree), o2--), L(e2, b, e2.bl_tree), P(e2, o2 - 3, 2)) : o2 <= 10 ? (L(e2, v, e2.bl_tree), P(e2, o2 - 3, 3)) : (L(e2, y, e2.bl_tree), P(e2, o2 - 11, 7));
              s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4);
            }
          }
          n(T);
          var q = false;
          function J(e2, t2, r2, n2) {
            P(e2, (s << 1) + (n2 ? 1 : 0), 3), (function(e3, t3, r3, n3) {
              M(e3), n3 && (U(e3, r3), U(e3, ~r3)), i.arraySet(e3.pending_buf, e3.window, t3, r3, e3.pending), e3.pending += r3;
            })(e2, t2, r2, true);
          }
          r._tr_init = function(e2) {
            q || ((function() {
              var e3, t2, r2, n2, i2, s2 = new Array(g + 1);
              for (n2 = r2 = 0; n2 < a - 1; n2++) for (I[n2] = r2, e3 = 0; e3 < 1 << w[n2]; e3++) A[r2++] = n2;
              for (A[r2 - 1] = n2, n2 = i2 = 0; n2 < 16; n2++) for (T[n2] = i2, e3 = 0; e3 < 1 << k[n2]; e3++) E[i2++] = n2;
              for (i2 >>= 7; n2 < f; n2++) for (T[n2] = i2 << 7, e3 = 0; e3 < 1 << k[n2] - 7; e3++) E[256 + i2++] = n2;
              for (t2 = 0; t2 <= g; t2++) s2[t2] = 0;
              for (e3 = 0; e3 <= 143; ) z[2 * e3 + 1] = 8, e3++, s2[8]++;
              for (; e3 <= 255; ) z[2 * e3 + 1] = 9, e3++, s2[9]++;
              for (; e3 <= 279; ) z[2 * e3 + 1] = 7, e3++, s2[7]++;
              for (; e3 <= 287; ) z[2 * e3 + 1] = 8, e3++, s2[8]++;
              for (Z(z, l + 1, s2), e3 = 0; e3 < f; e3++) C[2 * e3 + 1] = 5, C[2 * e3] = j(e3, 5);
              O = new D(z, w, u + 1, l, g), B = new D(C, k, 0, f, g), R = new D(new Array(0), x, 0, c, p);
            })(), q = true), e2.l_desc = new F(e2.dyn_ltree, O), e2.d_desc = new F(e2.dyn_dtree, B), e2.bl_desc = new F(e2.bl_tree, R), e2.bi_buf = 0, e2.bi_valid = 0, W(e2);
          }, r._tr_stored_block = J, r._tr_flush_block = function(e2, t2, r2, n2) {
            var i2, s2, a2 = 0;
            0 < e2.level ? (2 === e2.strm.data_type && (e2.strm.data_type = (function(e3) {
              var t3, r3 = 4093624447;
              for (t3 = 0; t3 <= 31; t3++, r3 >>>= 1) if (1 & r3 && 0 !== e3.dyn_ltree[2 * t3]) return o;
              if (0 !== e3.dyn_ltree[18] || 0 !== e3.dyn_ltree[20] || 0 !== e3.dyn_ltree[26]) return h;
              for (t3 = 32; t3 < u; t3++) if (0 !== e3.dyn_ltree[2 * t3]) return h;
              return o;
            })(e2)), Y(e2, e2.l_desc), Y(e2, e2.d_desc), a2 = (function(e3) {
              var t3;
              for (X(e3, e3.dyn_ltree, e3.l_desc.max_code), X(e3, e3.dyn_dtree, e3.d_desc.max_code), Y(e3, e3.bl_desc), t3 = c - 1; 3 <= t3 && 0 === e3.bl_tree[2 * S[t3] + 1]; t3--) ;
              return e3.opt_len += 3 * (t3 + 1) + 5 + 5 + 4, t3;
            })(e2), i2 = e2.opt_len + 3 + 7 >>> 3, (s2 = e2.static_len + 3 + 7 >>> 3) <= i2 && (i2 = s2)) : i2 = s2 = r2 + 5, r2 + 4 <= i2 && -1 !== t2 ? J(e2, t2, r2, n2) : 4 === e2.strategy || s2 === i2 ? (P(e2, 2 + (n2 ? 1 : 0), 3), K(e2, z, C)) : (P(e2, 4 + (n2 ? 1 : 0), 3), (function(e3, t3, r3, n3) {
              var i3;
              for (P(e3, t3 - 257, 5), P(e3, r3 - 1, 5), P(e3, n3 - 4, 4), i3 = 0; i3 < n3; i3++) P(e3, e3.bl_tree[2 * S[i3] + 1], 3);
              V(e3, e3.dyn_ltree, t3 - 1), V(e3, e3.dyn_dtree, r3 - 1);
            })(e2, e2.l_desc.max_code + 1, e2.d_desc.max_code + 1, a2 + 1), K(e2, e2.dyn_ltree, e2.dyn_dtree)), W(e2), n2 && M(e2);
          }, r._tr_tally = function(e2, t2, r2) {
            return e2.pending_buf[e2.d_buf + 2 * e2.last_lit] = t2 >>> 8 & 255, e2.pending_buf[e2.d_buf + 2 * e2.last_lit + 1] = 255 & t2, e2.pending_buf[e2.l_buf + e2.last_lit] = 255 & r2, e2.last_lit++, 0 === t2 ? e2.dyn_ltree[2 * r2]++ : (e2.matches++, t2--, e2.dyn_ltree[2 * (A[r2] + u + 1)]++, e2.dyn_dtree[2 * N(t2)]++), e2.last_lit === e2.lit_bufsize - 1;
          }, r._tr_align = function(e2) {
            P(e2, 2, 3), L(e2, m, z), (function(e3) {
              16 === e3.bi_valid ? (U(e3, e3.bi_buf), e3.bi_buf = 0, e3.bi_valid = 0) : 8 <= e3.bi_valid && (e3.pending_buf[e3.pending++] = 255 & e3.bi_buf, e3.bi_buf >>= 8, e3.bi_valid -= 8);
            })(e2);
          };
        }, { "../utils/common": 41 }], 53: [function(e, t, r) {
          "use strict";
          t.exports = function() {
            this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
          };
        }, {}], 54: [function(e, t, r) {
          (function(e2) {
            !(function(r2, n) {
              "use strict";
              if (!r2.setImmediate) {
                var i, s, t2, a, o = 1, h = {}, u = false, l = r2.document, e3 = Object.getPrototypeOf && Object.getPrototypeOf(r2);
                e3 = e3 && e3.setTimeout ? e3 : r2, i = "[object process]" === {}.toString.call(r2.process) ? function(e4) {
                  process.nextTick(function() {
                    c(e4);
                  });
                } : (function() {
                  if (r2.postMessage && !r2.importScripts) {
                    var e4 = true, t3 = r2.onmessage;
                    return r2.onmessage = function() {
                      e4 = false;
                    }, r2.postMessage("", "*"), r2.onmessage = t3, e4;
                  }
                })() ? (a = "setImmediate$" + Math.random() + "$", r2.addEventListener ? r2.addEventListener("message", d, false) : r2.attachEvent("onmessage", d), function(e4) {
                  r2.postMessage(a + e4, "*");
                }) : r2.MessageChannel ? ((t2 = new MessageChannel()).port1.onmessage = function(e4) {
                  c(e4.data);
                }, function(e4) {
                  t2.port2.postMessage(e4);
                }) : l && "onreadystatechange" in l.createElement("script") ? (s = l.documentElement, function(e4) {
                  var t3 = l.createElement("script");
                  t3.onreadystatechange = function() {
                    c(e4), t3.onreadystatechange = null, s.removeChild(t3), t3 = null;
                  }, s.appendChild(t3);
                }) : function(e4) {
                  setTimeout(c, 0, e4);
                }, e3.setImmediate = function(e4) {
                  "function" != typeof e4 && (e4 = new Function("" + e4));
                  for (var t3 = new Array(arguments.length - 1), r3 = 0; r3 < t3.length; r3++) t3[r3] = arguments[r3 + 1];
                  var n2 = { callback: e4, args: t3 };
                  return h[o] = n2, i(o), o++;
                }, e3.clearImmediate = f;
              }
              function f(e4) {
                delete h[e4];
              }
              function c(e4) {
                if (u) setTimeout(c, 0, e4);
                else {
                  var t3 = h[e4];
                  if (t3) {
                    u = true;
                    try {
                      !(function(e5) {
                        var t4 = e5.callback, r3 = e5.args;
                        switch (r3.length) {
                          case 0:
                            t4();
                            break;
                          case 1:
                            t4(r3[0]);
                            break;
                          case 2:
                            t4(r3[0], r3[1]);
                            break;
                          case 3:
                            t4(r3[0], r3[1], r3[2]);
                            break;
                          default:
                            t4.apply(n, r3);
                        }
                      })(t3);
                    } finally {
                      f(e4), u = false;
                    }
                  }
                }
              }
              function d(e4) {
                e4.source === r2 && "string" == typeof e4.data && 0 === e4.data.indexOf(a) && c(+e4.data.slice(a.length));
              }
            })("undefined" == typeof self ? void 0 === e2 ? this : e2 : self);
          }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {}] }, {}, [10])(10);
      });
    }
  });

  // node_modules/.pnpm/crc-32@1.2.2/node_modules/crc-32/crc32.js
  var require_crc32 = __commonJS({
    "node_modules/.pnpm/crc-32@1.2.2/node_modules/crc-32/crc32.js"(exports) {
      var CRC322;
      (function(factory) {
        if (typeof DO_NOT_EXPORT_CRC === "undefined") {
          if ("object" === typeof exports) {
            factory(exports);
          } else if ("function" === typeof define && define.amd) {
            define(function() {
              var module2 = {};
              factory(module2);
              return module2;
            });
          } else {
            factory(CRC322 = {});
          }
        } else {
          factory(CRC322 = {});
        }
      })(function(CRC323) {
        CRC323.version = "1.2.2";
        function signed_crc_table() {
          var c = 0, table = new Array(256);
          for (var n = 0; n != 256; ++n) {
            c = n;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            table[n] = c;
          }
          return typeof Int32Array !== "undefined" ? new Int32Array(table) : table;
        }
        var T0 = signed_crc_table();
        function slice_by_16_tables(T) {
          var c = 0, v = 0, n = 0, table = typeof Int32Array !== "undefined" ? new Int32Array(4096) : new Array(4096);
          for (n = 0; n != 256; ++n) table[n] = T[n];
          for (n = 0; n != 256; ++n) {
            v = T[n];
            for (c = 256 + n; c < 4096; c += 256) v = table[c] = v >>> 8 ^ T[v & 255];
          }
          var out = [];
          for (n = 1; n != 16; ++n) out[n - 1] = typeof Int32Array !== "undefined" ? table.subarray(n * 256, n * 256 + 256) : table.slice(n * 256, n * 256 + 256);
          return out;
        }
        var TT = slice_by_16_tables(T0);
        var T1 = TT[0], T2 = TT[1], T3 = TT[2], T4 = TT[3], T5 = TT[4];
        var T6 = TT[5], T7 = TT[6], T8 = TT[7], T9 = TT[8], Ta = TT[9];
        var Tb = TT[10], Tc = TT[11], Td = TT[12], Te = TT[13], Tf = TT[14];
        function crc32_bstr(bstr, seed) {
          var C = seed ^ -1;
          for (var i = 0, L = bstr.length; i < L; ) C = C >>> 8 ^ T0[(C ^ bstr.charCodeAt(i++)) & 255];
          return ~C;
        }
        function crc32_buf(B, seed) {
          var C = seed ^ -1, L = B.length - 15, i = 0;
          for (; i < L; ) C = Tf[B[i++] ^ C & 255] ^ Te[B[i++] ^ C >> 8 & 255] ^ Td[B[i++] ^ C >> 16 & 255] ^ Tc[B[i++] ^ C >>> 24] ^ Tb[B[i++]] ^ Ta[B[i++]] ^ T9[B[i++]] ^ T8[B[i++]] ^ T7[B[i++]] ^ T6[B[i++]] ^ T5[B[i++]] ^ T4[B[i++]] ^ T3[B[i++]] ^ T2[B[i++]] ^ T1[B[i++]] ^ T0[B[i++]];
          L += 15;
          while (i < L) C = C >>> 8 ^ T0[(C ^ B[i++]) & 255];
          return ~C;
        }
        function crc32_str(str, seed) {
          var C = seed ^ -1;
          for (var i = 0, L = str.length, c = 0, d = 0; i < L; ) {
            c = str.charCodeAt(i++);
            if (c < 128) {
              C = C >>> 8 ^ T0[(C ^ c) & 255];
            } else if (c < 2048) {
              C = C >>> 8 ^ T0[(C ^ (192 | c >> 6 & 31)) & 255];
              C = C >>> 8 ^ T0[(C ^ (128 | c & 63)) & 255];
            } else if (c >= 55296 && c < 57344) {
              c = (c & 1023) + 64;
              d = str.charCodeAt(i++) & 1023;
              C = C >>> 8 ^ T0[(C ^ (240 | c >> 8 & 7)) & 255];
              C = C >>> 8 ^ T0[(C ^ (128 | c >> 2 & 63)) & 255];
              C = C >>> 8 ^ T0[(C ^ (128 | d >> 6 & 15 | (c & 3) << 4)) & 255];
              C = C >>> 8 ^ T0[(C ^ (128 | d & 63)) & 255];
            } else {
              C = C >>> 8 ^ T0[(C ^ (224 | c >> 12 & 15)) & 255];
              C = C >>> 8 ^ T0[(C ^ (128 | c >> 6 & 63)) & 255];
              C = C >>> 8 ^ T0[(C ^ (128 | c & 63)) & 255];
            }
          }
          return ~C;
        }
        CRC323.table = T0;
        CRC323.bstr = crc32_bstr;
        CRC323.buf = crc32_buf;
        CRC323.str = crc32_str;
      });
    }
  });

  // node_modules/.pnpm/@xmldom+xmldom@0.9.12/node_modules/@xmldom/xmldom/lib/conventions.js
  var require_conventions = __commonJS({
    "node_modules/.pnpm/@xmldom+xmldom@0.9.12/node_modules/@xmldom/xmldom/lib/conventions.js"(exports) {
      "use strict";
      function find(list, predicate, ac) {
        if (ac === void 0) {
          ac = Array.prototype;
        }
        if (list && typeof ac.find === "function") {
          return ac.find.call(list, predicate);
        }
        for (var i = 0; i < list.length; i++) {
          if (hasOwn(list, i)) {
            var item = list[i];
            if (predicate.call(void 0, item, i, list)) {
              return item;
            }
          }
        }
      }
      function freeze(object, oc) {
        if (oc === void 0) {
          oc = Object;
        }
        if (oc && typeof oc.getOwnPropertyDescriptors === "function") {
          object = oc.create(null, oc.getOwnPropertyDescriptors(object));
        }
        return oc && typeof oc.freeze === "function" ? oc.freeze(object) : object;
      }
      function hasOwn(object, key) {
        return Object.prototype.hasOwnProperty.call(object, key);
      }
      function assign(target, source) {
        if (target === null || typeof target !== "object") {
          throw new TypeError("target is not an object");
        }
        for (var key in source) {
          if (hasOwn(source, key)) {
            target[key] = source[key];
          }
        }
        return target;
      }
      var HTML_BOOLEAN_ATTRIBUTES = freeze({
        allowfullscreen: true,
        async: true,
        autofocus: true,
        autoplay: true,
        checked: true,
        controls: true,
        default: true,
        defer: true,
        disabled: true,
        formnovalidate: true,
        hidden: true,
        ismap: true,
        itemscope: true,
        loop: true,
        multiple: true,
        muted: true,
        nomodule: true,
        novalidate: true,
        open: true,
        playsinline: true,
        readonly: true,
        required: true,
        reversed: true,
        selected: true
      });
      function isHTMLBooleanAttribute(name) {
        return hasOwn(HTML_BOOLEAN_ATTRIBUTES, name.toLowerCase());
      }
      var HTML_VOID_ELEMENTS = freeze({
        area: true,
        base: true,
        br: true,
        col: true,
        embed: true,
        hr: true,
        img: true,
        input: true,
        link: true,
        meta: true,
        param: true,
        source: true,
        track: true,
        wbr: true
      });
      function isHTMLVoidElement(tagName) {
        return hasOwn(HTML_VOID_ELEMENTS, tagName.toLowerCase());
      }
      var HTML_RAW_TEXT_ELEMENTS = freeze({
        script: false,
        style: false,
        textarea: true,
        title: true
      });
      function isHTMLRawTextElement(tagName) {
        var key = tagName.toLowerCase();
        return hasOwn(HTML_RAW_TEXT_ELEMENTS, key) && !HTML_RAW_TEXT_ELEMENTS[key];
      }
      function isHTMLEscapableRawTextElement(tagName) {
        var key = tagName.toLowerCase();
        return hasOwn(HTML_RAW_TEXT_ELEMENTS, key) && HTML_RAW_TEXT_ELEMENTS[key];
      }
      function isHTMLMimeType(mimeType) {
        return mimeType === MIME_TYPE.HTML;
      }
      function hasDefaultHTMLNamespace(mimeType) {
        return isHTMLMimeType(mimeType) || mimeType === MIME_TYPE.XML_XHTML_APPLICATION;
      }
      var MIME_TYPE = freeze({
        /**
         * `text/html`, the only mime type that triggers treating an XML document as HTML.
         *
         * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
         * @see https://en.wikipedia.org/wiki/HTML Wikipedia
         * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
         * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring
         *      WHATWG HTML Spec
         */
        HTML: "text/html",
        /**
         * `application/xml`, the standard mime type for XML documents.
         *
         * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType
         *      registration
         * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
         * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
         */
        XML_APPLICATION: "application/xml",
        /**
         * `text/xml`, an alias for `application/xml`.
         *
         * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
         * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
         * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
         */
        XML_TEXT: "text/xml",
        /**
         * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
         * but is parsed as an XML document.
         *
         * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType
         *      registration
         * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
         * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
         */
        XML_XHTML_APPLICATION: "application/xhtml+xml",
        /**
         * `image/svg+xml`,
         *
         * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
         * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
         * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
         */
        XML_SVG_IMAGE: "image/svg+xml"
      });
      var _MIME_TYPES = Object.keys(MIME_TYPE).map(function(key) {
        return MIME_TYPE[key];
      });
      function isValidMimeType(mimeType) {
        return _MIME_TYPES.indexOf(mimeType) > -1;
      }
      var NAMESPACE = freeze({
        /**
         * The XHTML namespace.
         *
         * @see http://www.w3.org/1999/xhtml
         */
        HTML: "http://www.w3.org/1999/xhtml",
        /**
         * The SVG namespace.
         *
         * @see http://www.w3.org/2000/svg
         */
        SVG: "http://www.w3.org/2000/svg",
        /**
         * The `xml:` namespace.
         *
         * @see http://www.w3.org/XML/1998/namespace
         */
        XML: "http://www.w3.org/XML/1998/namespace",
        /**
         * The `xmlns:` namespace.
         *
         * @see https://www.w3.org/2000/xmlns/
         */
        XMLNS: "http://www.w3.org/2000/xmlns/"
      });
      exports.assign = assign;
      exports.find = find;
      exports.freeze = freeze;
      exports.HTML_BOOLEAN_ATTRIBUTES = HTML_BOOLEAN_ATTRIBUTES;
      exports.HTML_RAW_TEXT_ELEMENTS = HTML_RAW_TEXT_ELEMENTS;
      exports.HTML_VOID_ELEMENTS = HTML_VOID_ELEMENTS;
      exports.hasDefaultHTMLNamespace = hasDefaultHTMLNamespace;
      exports.hasOwn = hasOwn;
      exports.isHTMLBooleanAttribute = isHTMLBooleanAttribute;
      exports.isHTMLRawTextElement = isHTMLRawTextElement;
      exports.isHTMLEscapableRawTextElement = isHTMLEscapableRawTextElement;
      exports.isHTMLMimeType = isHTMLMimeType;
      exports.isHTMLVoidElement = isHTMLVoidElement;
      exports.isValidMimeType = isValidMimeType;
      exports.MIME_TYPE = MIME_TYPE;
      exports.NAMESPACE = NAMESPACE;
    }
  });

  // node_modules/.pnpm/@xmldom+xmldom@0.9.12/node_modules/@xmldom/xmldom/lib/errors.js
  var require_errors = __commonJS({
    "node_modules/.pnpm/@xmldom+xmldom@0.9.12/node_modules/@xmldom/xmldom/lib/errors.js"(exports) {
      "use strict";
      var conventions = require_conventions();
      function extendError(constructor, writableName) {
        constructor.prototype = Object.create(Error.prototype, {
          constructor: { value: constructor },
          name: { value: constructor.name, enumerable: true, writable: writableName }
        });
      }
      var DOMExceptionName = conventions.freeze({
        /**
         * the default value as defined by the spec
         */
        Error: "Error",
        /**
         * @deprecated
         * Use RangeError instead.
         */
        IndexSizeError: "IndexSizeError",
        /**
         * @deprecated
         * Just to match the related static code, not part of the spec.
         */
        DomstringSizeError: "DomstringSizeError",
        HierarchyRequestError: "HierarchyRequestError",
        WrongDocumentError: "WrongDocumentError",
        InvalidCharacterError: "InvalidCharacterError",
        /**
         * @deprecated
         * Just to match the related static code, not part of the spec.
         */
        NoDataAllowedError: "NoDataAllowedError",
        NoModificationAllowedError: "NoModificationAllowedError",
        NotFoundError: "NotFoundError",
        NotSupportedError: "NotSupportedError",
        InUseAttributeError: "InUseAttributeError",
        InvalidStateError: "InvalidStateError",
        SyntaxError: "SyntaxError",
        InvalidModificationError: "InvalidModificationError",
        NamespaceError: "NamespaceError",
        /**
         * @deprecated
         * Use TypeError for invalid arguments,
         * "NotSupportedError" DOMException for unsupported operations,
         * and "NotAllowedError" DOMException for denied requests instead.
         */
        InvalidAccessError: "InvalidAccessError",
        /**
         * @deprecated
         * Just to match the related static code, not part of the spec.
         */
        ValidationError: "ValidationError",
        /**
         * @deprecated
         * Use TypeError instead.
         */
        TypeMismatchError: "TypeMismatchError",
        SecurityError: "SecurityError",
        NetworkError: "NetworkError",
        AbortError: "AbortError",
        /**
         * @deprecated
         * Just to match the related static code, not part of the spec.
         */
        URLMismatchError: "URLMismatchError",
        QuotaExceededError: "QuotaExceededError",
        TimeoutError: "TimeoutError",
        InvalidNodeTypeError: "InvalidNodeTypeError",
        DataCloneError: "DataCloneError",
        EncodingError: "EncodingError",
        NotReadableError: "NotReadableError",
        UnknownError: "UnknownError",
        ConstraintError: "ConstraintError",
        DataError: "DataError",
        TransactionInactiveError: "TransactionInactiveError",
        ReadOnlyError: "ReadOnlyError",
        VersionError: "VersionError",
        OperationError: "OperationError",
        NotAllowedError: "NotAllowedError",
        OptOutError: "OptOutError"
      });
      var DOMExceptionNames = Object.keys(DOMExceptionName);
      function isValidDomExceptionCode(value) {
        return typeof value === "number" && value >= 1 && value <= 25;
      }
      function endsWithError(value) {
        return typeof value === "string" && value.substring(value.length - DOMExceptionName.Error.length) === DOMExceptionName.Error;
      }
      function DOMException(messageOrCode, nameOrMessage) {
        if (isValidDomExceptionCode(messageOrCode)) {
          this.name = DOMExceptionNames[messageOrCode];
          this.message = nameOrMessage || "";
        } else {
          this.message = messageOrCode;
          this.name = endsWithError(nameOrMessage) ? nameOrMessage : DOMExceptionName.Error;
        }
        if (Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
      }
      extendError(DOMException, true);
      Object.defineProperties(DOMException.prototype, {
        code: {
          enumerable: true,
          get: function() {
            var code = DOMExceptionNames.indexOf(this.name);
            if (isValidDomExceptionCode(code)) return code;
            return 0;
          }
        }
      });
      var ExceptionCode = {
        INDEX_SIZE_ERR: 1,
        DOMSTRING_SIZE_ERR: 2,
        HIERARCHY_REQUEST_ERR: 3,
        WRONG_DOCUMENT_ERR: 4,
        INVALID_CHARACTER_ERR: 5,
        NO_DATA_ALLOWED_ERR: 6,
        NO_MODIFICATION_ALLOWED_ERR: 7,
        NOT_FOUND_ERR: 8,
        NOT_SUPPORTED_ERR: 9,
        INUSE_ATTRIBUTE_ERR: 10,
        INVALID_STATE_ERR: 11,
        SYNTAX_ERR: 12,
        INVALID_MODIFICATION_ERR: 13,
        NAMESPACE_ERR: 14,
        INVALID_ACCESS_ERR: 15,
        VALIDATION_ERR: 16,
        TYPE_MISMATCH_ERR: 17,
        SECURITY_ERR: 18,
        NETWORK_ERR: 19,
        ABORT_ERR: 20,
        URL_MISMATCH_ERR: 21,
        QUOTA_EXCEEDED_ERR: 22,
        TIMEOUT_ERR: 23,
        INVALID_NODE_TYPE_ERR: 24,
        DATA_CLONE_ERR: 25
      };
      var entries = Object.entries(ExceptionCode);
      for (i = 0; i < entries.length; i++) {
        key = entries[i][0];
        DOMException[key] = entries[i][1];
      }
      var key;
      var i;
      function ParseError(message, locator, cause) {
        this.message = message;
        this.locator = locator;
        this.cause = cause;
        if (Error.captureStackTrace) Error.captureStackTrace(this, ParseError);
      }
      extendError(ParseError);
      exports.DOMException = DOMException;
      exports.DOMExceptionName = DOMExceptionName;
      exports.ExceptionCode = ExceptionCode;
      exports.ParseError = ParseError;
    }
  });

  // node_modules/.pnpm/@xmldom+xmldom@0.9.12/node_modules/@xmldom/xmldom/lib/grammar.js
  var require_grammar = __commonJS({
    "node_modules/.pnpm/@xmldom+xmldom@0.9.12/node_modules/@xmldom/xmldom/lib/grammar.js"(exports) {
      "use strict";
      function detectUnicodeSupport(RegExpImpl) {
        try {
          if (typeof RegExpImpl !== "function") {
            RegExpImpl = RegExp;
          }
          var match = new RegExpImpl("\u{1D306}", "u").exec("\u{1D306}");
          return !!match && match[0].length === 2;
        } catch (error) {
        }
        return false;
      }
      var UNICODE_SUPPORT = detectUnicodeSupport();
      function chars(regexp) {
        if (regexp.source[0] !== "[") {
          throw new Error(regexp + " can not be used with chars");
        }
        return regexp.source.slice(1, regexp.source.lastIndexOf("]"));
      }
      function chars_without(regexp, search) {
        if (regexp.source[0] !== "[") {
          throw new Error("/" + regexp.source + "/ can not be used with chars_without");
        }
        if (!search || typeof search !== "string") {
          throw new Error(JSON.stringify(search) + " is not a valid search");
        }
        if (regexp.source.indexOf(search) === -1) {
          throw new Error('"' + search + '" is not is /' + regexp.source + "/");
        }
        if (search === "-" && regexp.source.indexOf(search) !== 1) {
          throw new Error('"' + search + '" is not at the first postion of /' + regexp.source + "/");
        }
        return new RegExp(regexp.source.replace(search, ""), UNICODE_SUPPORT ? "u" : "");
      }
      function reg(args) {
        var self2 = this;
        return new RegExp(
          Array.prototype.slice.call(arguments).map(function(part) {
            var isStr = typeof part === "string";
            if (isStr && self2 === void 0 && part === "|") {
              throw new Error("use regg instead of reg to wrap expressions with `|`!");
            }
            return isStr ? part : part.source;
          }).join(""),
          UNICODE_SUPPORT ? "u" : ""
        );
      }
      function regg(args) {
        if (arguments.length === 0) {
          throw new Error("no parameters provided");
        }
        return reg.apply(regg, ["(?:"].concat(Array.prototype.slice.call(arguments), [")"]));
      }
      var UNICODE_REPLACEMENT_CHARACTER = "\uFFFD";
      var Char = /[-\x09\x0A\x0D\x20-\x2C\x2E-\uD7FF\uE000-\uFFFD]/;
      if (UNICODE_SUPPORT) {
        Char = reg("[", chars(Char), "\\u{10000}-\\u{10FFFF}", "]");
      }
      var InvalidChar = new RegExp("[^" + chars(Char) + "]", UNICODE_SUPPORT ? "u" : "");
      var _SChar = /[\x20\x09\x0D\x0A]/;
      var SChar_s = chars(_SChar);
      var S = reg(_SChar, "+");
      var S_OPT = reg(_SChar, "*");
      var NameStartChar = /[:_a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
      if (UNICODE_SUPPORT) {
        NameStartChar = reg("[", chars(NameStartChar), "\\u{10000}-\\u{10FFFF}", "]");
      }
      var NameStartChar_s = chars(NameStartChar);
      var NameChar = reg("[", NameStartChar_s, chars(/[-.0-9\xB7]/), chars(/[\u0300-\u036F\u203F-\u2040]/), "]");
      var Name = reg(NameStartChar, NameChar, "*");
      var Name_exact = reg("^", Name, "$");
      var Nmtoken = reg(NameChar, "+");
      var EntityRef = reg("&", Name, ";");
      var CharRef = regg(/&#[0-9]+;|&#x[0-9a-fA-F]+;/);
      var Reference = regg(EntityRef, "|", CharRef);
      var PEReference = reg("%", Name, ";");
      var EntityValue = regg(
        reg('"', regg(/[^%&"]/, "|", PEReference, "|", Reference), "*", '"'),
        "|",
        reg("'", regg(/[^%&']/, "|", PEReference, "|", Reference), "*", "'")
      );
      var AttValue = regg('"', regg(/[^<&"]/, "|", Reference), "*", '"', "|", "'", regg(/[^<&']/, "|", Reference), "*", "'");
      var NCNameStartChar = chars_without(NameStartChar, ":");
      var NCNameChar = chars_without(NameChar, ":");
      var NCName = reg(NCNameStartChar, NCNameChar, "*");
      var NCName_exact = reg("^", NCName, "$");
      var QName = reg(NCName, regg(":", NCName), "?");
      var QName_exact = reg("^", QName, "$");
      var QName_group = reg("(", QName, ")");
      var SystemLiteral = regg(/"[^"]*"|'[^']*'/);
      var PI = reg(/^<\?/, "(", Name, ")", regg(S, "(?!", _SChar, ")(", Char, "*?)"), "?", /\?>/);
      var PubidChar = /[\x20\x0D\x0Aa-zA-Z0-9-'()+,./:=?;!*#@$_%]/;
      var PubidLiteral = regg('"', PubidChar, '*"', "|", "'", chars_without(PubidChar, "'"), "*'");
      var COMMENT_START = "<!--";
      var COMMENT_END = "-->";
      var Comment = reg(COMMENT_START, regg(chars_without(Char, "-"), "|", reg("-", chars_without(Char, "-"))), "*", COMMENT_END);
      var PCDATA = "#PCDATA";
      var Mixed = regg(
        reg(/\(/, S_OPT, PCDATA, regg(S_OPT, /\|/, S_OPT, QName), "*", S_OPT, /\)\*/),
        "|",
        reg(/\(/, S_OPT, PCDATA, S_OPT, /\)/)
      );
      var _children_quantity = /[?*+]?/;
      var children = reg(
        /\([^>]+\)/,
        _children_quantity
        /*regg(choice, '|', seq), _children_quantity*/
      );
      var contentspec = regg("EMPTY", "|", "ANY", "|", Mixed, "|", children);
      var ELEMENTDECL_START = "<!ELEMENT";
      var elementdecl = reg(ELEMENTDECL_START, S, regg(QName, "|", PEReference), S, regg(contentspec, "|", PEReference), S_OPT, ">");
      var NotationType = reg("NOTATION", S, /\(/, S_OPT, Name, regg(S_OPT, /\|/, S_OPT, Name), "*", S_OPT, /\)/);
      var Enumeration = reg(/\(/, S_OPT, Nmtoken, regg(S_OPT, /\|/, S_OPT, Nmtoken), "*", S_OPT, /\)/);
      var EnumeratedType = regg(NotationType, "|", Enumeration);
      var AttType = regg(/CDATA|ID|IDREF|IDREFS|ENTITY|ENTITIES|NMTOKEN|NMTOKENS/, "|", EnumeratedType);
      var DefaultDecl = regg(/#REQUIRED|#IMPLIED/, "|", regg(regg("#FIXED", S), "?", AttValue));
      var AttDef = regg(S, Name, S, AttType, S, DefaultDecl);
      var ATTLIST_DECL_START = "<!ATTLIST";
      var AttlistDecl = reg(ATTLIST_DECL_START, S, Name, AttDef, "*", S_OPT, ">");
      var ABOUT_LEGACY_COMPAT = "about:legacy-compat";
      var ABOUT_LEGACY_COMPAT_SystemLiteral = regg('"' + ABOUT_LEGACY_COMPAT + '"', "|", "'" + ABOUT_LEGACY_COMPAT + "'");
      var SYSTEM = "SYSTEM";
      var PUBLIC = "PUBLIC";
      var ExternalID = regg(regg(SYSTEM, S, SystemLiteral), "|", regg(PUBLIC, S, PubidLiteral, S, SystemLiteral));
      var ExternalID_match = reg(
        "^",
        regg(
          regg(SYSTEM, S, "(?<SystemLiteralOnly>", SystemLiteral, ")"),
          "|",
          regg(PUBLIC, S, "(?<PubidLiteral>", PubidLiteral, ")", S, "(?<SystemLiteral>", SystemLiteral, ")")
        )
      );
      var PubidLiteral_match = reg("^", PubidLiteral, "$");
      var SystemLiteral_match = reg("^", SystemLiteral, "$");
      var NDataDecl = regg(S, "NDATA", S, Name);
      var EntityDef = regg(EntityValue, "|", regg(ExternalID, NDataDecl, "?"));
      var ENTITY_DECL_START = "<!ENTITY";
      var GEDecl = reg(ENTITY_DECL_START, S, Name, S, EntityDef, S_OPT, ">");
      var PEDef = regg(EntityValue, "|", ExternalID);
      var PEDecl = reg(ENTITY_DECL_START, S, "%", S, Name, S, PEDef, S_OPT, ">");
      var EntityDecl = regg(GEDecl, "|", PEDecl);
      var PublicID = reg(PUBLIC, S, PubidLiteral);
      var NotationDecl = reg("<!NOTATION", S, Name, S, regg(ExternalID, "|", PublicID), S_OPT, ">");
      var Eq = reg(S_OPT, "=", S_OPT);
      var VersionNum = /1[.]\d+/;
      var VersionInfo = reg(S, "version", Eq, regg("'", VersionNum, "'", "|", '"', VersionNum, '"'));
      var EncName = /[A-Za-z][-A-Za-z0-9._]*/;
      var EncodingDecl = regg(S, "encoding", Eq, regg('"', EncName, '"', "|", "'", EncName, "'"));
      var SDDecl = regg(S, "standalone", Eq, regg("'", regg("yes", "|", "no"), "'", "|", '"', regg("yes", "|", "no"), '"'));
      var XMLDecl = reg(/^<\?xml/, VersionInfo, EncodingDecl, "?", SDDecl, "?", S_OPT, /\?>/);
      var DOCTYPE_DECL_START = "<!DOCTYPE";
      var CDATA_START = "<![CDATA[";
      var CDATA_END = "]]>";
      var CDStart = /<!\[CDATA\[/;
      var CDEnd = /\]\]>/;
      var CData = reg(Char, "*?", CDEnd);
      var CDSect = reg(CDStart, CData);
      exports.chars = chars;
      exports.chars_without = chars_without;
      exports.detectUnicodeSupport = detectUnicodeSupport;
      exports.reg = reg;
      exports.regg = regg;
      exports.ABOUT_LEGACY_COMPAT = ABOUT_LEGACY_COMPAT;
      exports.ABOUT_LEGACY_COMPAT_SystemLiteral = ABOUT_LEGACY_COMPAT_SystemLiteral;
      exports.AttlistDecl = AttlistDecl;
      exports.CDATA_START = CDATA_START;
      exports.CDATA_END = CDATA_END;
      exports.CDSect = CDSect;
      exports.Char = Char;
      exports.Comment = Comment;
      exports.COMMENT_START = COMMENT_START;
      exports.COMMENT_END = COMMENT_END;
      exports.DOCTYPE_DECL_START = DOCTYPE_DECL_START;
      exports.elementdecl = elementdecl;
      exports.EntityDecl = EntityDecl;
      exports.EntityValue = EntityValue;
      exports.ExternalID = ExternalID;
      exports.ExternalID_match = ExternalID_match;
      exports.Name = Name;
      exports.Name_exact = Name_exact;
      exports.NCName_exact = NCName_exact;
      exports.NotationDecl = NotationDecl;
      exports.Reference = Reference;
      exports.PEReference = PEReference;
      exports.PI = PI;
      exports.PUBLIC = PUBLIC;
      exports.PubidLiteral = PubidLiteral;
      exports.PubidLiteral_match = PubidLiteral_match;
      exports.QName = QName;
      exports.QName_exact = QName_exact;
      exports.QName_group = QName_group;
      exports.S = S;
      exports.SChar_s = SChar_s;
      exports.S_OPT = S_OPT;
      exports.SYSTEM = SYSTEM;
      exports.SystemLiteral = SystemLiteral;
      exports.SystemLiteral_match = SystemLiteral_match;
      exports.InvalidChar = InvalidChar;
      exports.UNICODE_REPLACEMENT_CHARACTER = UNICODE_REPLACEMENT_CHARACTER;
      exports.UNICODE_SUPPORT = UNICODE_SUPPORT;
      exports.XMLDecl = XMLDecl;
    }
  });

  // node_modules/.pnpm/@xmldom+xmldom@0.9.12/node_modules/@xmldom/xmldom/lib/dom.js
  var require_dom = __commonJS({
    "node_modules/.pnpm/@xmldom+xmldom@0.9.12/node_modules/@xmldom/xmldom/lib/dom.js"(exports) {
      "use strict";
      var conventions = require_conventions();
      var find = conventions.find;
      var hasDefaultHTMLNamespace = conventions.hasDefaultHTMLNamespace;
      var hasOwn = conventions.hasOwn;
      var isHTMLMimeType = conventions.isHTMLMimeType;
      var isHTMLRawTextElement = conventions.isHTMLRawTextElement;
      var isHTMLVoidElement = conventions.isHTMLVoidElement;
      var MIME_TYPE = conventions.MIME_TYPE;
      var NAMESPACE = conventions.NAMESPACE;
      var PDC = Symbol();
      var errors = require_errors();
      var DOMException = errors.DOMException;
      var DOMExceptionName = errors.DOMExceptionName;
      var g = require_grammar();
      function checkSymbol(symbol) {
        if (symbol !== PDC) {
          throw new TypeError("Illegal constructor");
        }
      }
      function notEmptyString(input) {
        return input !== "";
      }
      function splitOnASCIIWhitespace(input) {
        return input ? input.split(/[\t\n\f\r ]+/).filter(notEmptyString) : [];
      }
      function orderedSetReducer(current, element) {
        if (!hasOwn(current, element)) {
          current[element] = true;
        }
        return current;
      }
      function toOrderedSet(input) {
        if (!input) return [];
        var list = splitOnASCIIWhitespace(input);
        return Object.keys(list.reduce(orderedSetReducer, {}));
      }
      function arrayIncludes(list) {
        return function(element) {
          return list && list.indexOf(element) !== -1;
        };
      }
      function validateQualifiedName(qualifiedName) {
        if (!g.QName_exact.test(qualifiedName)) {
          throw new DOMException(DOMException.INVALID_CHARACTER_ERR, 'invalid character in qualified name "' + qualifiedName + '"');
        }
      }
      function validateAndExtract(namespace, qualifiedName) {
        validateQualifiedName(qualifiedName);
        namespace = namespace || null;
        var prefix = null;
        var localName = qualifiedName;
        if (qualifiedName.indexOf(":") >= 0) {
          var splitResult = qualifiedName.split(":");
          prefix = splitResult[0];
          localName = splitResult[1];
        }
        if (prefix !== null && namespace === null) {
          throw new DOMException(DOMException.NAMESPACE_ERR, "prefix is non-null and namespace is null");
        }
        if (prefix === "xml" && namespace !== conventions.NAMESPACE.XML) {
          throw new DOMException(DOMException.NAMESPACE_ERR, 'prefix is "xml" and namespace is not the XML namespace');
        }
        if ((prefix === "xmlns" || qualifiedName === "xmlns") && namespace !== conventions.NAMESPACE.XMLNS) {
          throw new DOMException(
            DOMException.NAMESPACE_ERR,
            'either qualifiedName or prefix is "xmlns" and namespace is not the XMLNS namespace'
          );
        }
        if (namespace === conventions.NAMESPACE.XMLNS && prefix !== "xmlns" && qualifiedName !== "xmlns") {
          throw new DOMException(
            DOMException.NAMESPACE_ERR,
            'namespace is the XMLNS namespace and neither qualifiedName nor prefix is "xmlns"'
          );
        }
        return [namespace, prefix, localName];
      }
      function copy(src, dest) {
        for (var p in src) {
          if (hasOwn(src, p)) {
            dest[p] = src[p];
          }
        }
      }
      function _extends(Class, Super) {
        var pt = Class.prototype;
        if (!(pt instanceof Super)) {
          let t = function() {
          };
          t.prototype = Super.prototype;
          t = new t();
          copy(pt, t);
          Class.prototype = pt = t;
        }
        if (pt.constructor != Class) {
          if (typeof Class != "function") {
            console.error("unknown Class:" + Class);
          }
          pt.constructor = Class;
        }
      }
      var NodeType = {};
      var ELEMENT_NODE = NodeType.ELEMENT_NODE = 1;
      var ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE = 2;
      var TEXT_NODE = NodeType.TEXT_NODE = 3;
      var CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE = 4;
      var ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE = 5;
      var ENTITY_NODE = NodeType.ENTITY_NODE = 6;
      var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
      var COMMENT_NODE = NodeType.COMMENT_NODE = 8;
      var DOCUMENT_NODE = NodeType.DOCUMENT_NODE = 9;
      var DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE = 10;
      var DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE = 11;
      var NOTATION_NODE = NodeType.NOTATION_NODE = 12;
      var DocumentPosition = conventions.freeze({
        DOCUMENT_POSITION_DISCONNECTED: 1,
        DOCUMENT_POSITION_PRECEDING: 2,
        DOCUMENT_POSITION_FOLLOWING: 4,
        DOCUMENT_POSITION_CONTAINS: 8,
        DOCUMENT_POSITION_CONTAINED_BY: 16,
        DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: 32
      });
      function commonAncestor(a, b) {
        if (b.length < a.length) return commonAncestor(b, a);
        var c = null;
        for (var n in a) {
          if (a[n] !== b[n]) return c;
          c = a[n];
        }
        return c;
      }
      function docGUID(doc) {
        if (!doc.guid) doc.guid = Math.random();
        return doc.guid;
      }
      function NodeList() {
      }
      NodeList.prototype = {
        /**
         * The number of nodes in the list. The range of valid child node indices is 0 to length-1
         * inclusive.
         *
         * @type {number}
         */
        length: 0,
        /**
         * Returns the item at `index`. If index is greater than or equal to the number of nodes in
         * the list, this returns null.
         *
         * @param index
         * Unsigned long Index into the collection.
         * @returns {Node | null}
         * The node at position `index` in the NodeList,
         * or null if that is not a valid index.
         */
        item: function(index) {
          return index >= 0 && index < this.length ? this[index] : null;
        },
        /**
         * Returns a string representation of the NodeList.
         *
         * Accepts the same `options` object as `XMLSerializer.prototype.serializeToString`
         * (`requireWellFormed`, `splitCDATASections`, `nodeFilter`). Passing a function is treated as
         * a legacy `nodeFilter` for backward compatibility.
         *
         * @param {Object | function} [options]
         * @param {boolean} [options.requireWellFormed=false]
         * @param {boolean} [options.splitCDATASections=true]
         * @param {function} [options.nodeFilter]
         * @returns {string}
         */
        toString: function(options) {
          var opts;
          if (typeof options === "function") {
            opts = { requireWellFormed: false, splitCDATASections: true, nodeFilter: options };
          } else if (!!options) {
            opts = {
              requireWellFormed: !!options.requireWellFormed,
              splitCDATASections: options.splitCDATASections !== false,
              nodeFilter: options.nodeFilter || null
            };
          } else {
            opts = { requireWellFormed: false, splitCDATASections: true, nodeFilter: null };
          }
          for (var buf = [], i = 0; i < this.length; i++) {
            serializeToString(this[i], buf, null, opts);
          }
          return buf.join("");
        },
        /**
         * Filters the NodeList based on a predicate.
         *
         * @param {function(Node): boolean} predicate
         * - A predicate function to filter the NodeList.
         * @returns {Node[]}
         * An array of nodes that satisfy the predicate.
         * @private
         */
        filter: function(predicate) {
          return Array.prototype.filter.call(this, predicate);
        },
        /**
         * Returns the first index at which a given node can be found in the NodeList, or -1 if it is
         * not present.
         *
         * @param {Node} item
         * - The Node item to locate in the NodeList.
         * @returns {number}
         * The first index of the node in the NodeList; -1 if not found.
         * @private
         */
        indexOf: function(item) {
          return Array.prototype.indexOf.call(this, item);
        }
      };
      NodeList.prototype[Symbol.iterator] = function() {
        var me = this;
        var index = 0;
        return {
          next: function() {
            if (index < me.length) {
              return {
                value: me[index++],
                done: false
              };
            } else {
              return {
                done: true
              };
            }
          },
          return: function() {
            return {
              done: true
            };
          }
        };
      };
      function LiveNodeList(node, refresh) {
        this._node = node;
        this._refresh = refresh;
        _updateLiveList(this);
      }
      function _updateLiveList(list) {
        var inc = list._node._inc || list._node.ownerDocument._inc;
        if (list._inc !== inc) {
          var ls = list._refresh(list._node);
          __set__(list, "length", ls.length);
          if (!list.$$length || ls.length < list.$$length) {
            for (var i = ls.length; i in list; i++) {
              if (hasOwn(list, i)) {
                delete list[i];
              }
            }
          }
          copy(ls, list);
          list._inc = inc;
        }
      }
      LiveNodeList.prototype.item = function(i) {
        _updateLiveList(this);
        return this[i] || null;
      };
      _extends(LiveNodeList, NodeList);
      function NamedNodeMap() {
        this._nsIndex = /* @__PURE__ */ Object.create(null);
        this._noNsIndex = /* @__PURE__ */ Object.create(null);
      }
      function _findNodeIndex(list, node) {
        var i = 0;
        while (i < list.length) {
          if (list[i] === node) {
            return i;
          }
          i++;
        }
      }
      function _nnmBucket(map, namespaceURI, create) {
        if (!namespaceURI) {
          return map._noNsIndex;
        }
        var bucket = map._nsIndex[namespaceURI];
        if (!bucket && create) {
          bucket = map._nsIndex[namespaceURI] = /* @__PURE__ */ Object.create(null);
        }
        return bucket;
      }
      function _nnmIndexFind(map, namespaceURI, localName) {
        var bucket = _nnmBucket(map, namespaceURI, false);
        var found = bucket && bucket[localName];
        return found ? found : null;
      }
      function _nnmIndexAdd(map, attr) {
        _nnmBucket(map, attr.namespaceURI, true)[attr.localName] = attr;
      }
      function _nnmIndexRemove(map, attr) {
        var bucket = _nnmBucket(map, attr.namespaceURI, false);
        if (bucket) {
          delete bucket[attr.localName];
        }
      }
      function _addNamedNode(el, list, newAttr, oldAttr) {
        if (oldAttr) {
          list[_findNodeIndex(list, oldAttr)] = newAttr;
        } else {
          list[list.length] = newAttr;
          list.length++;
        }
        _nnmIndexAdd(list, newAttr);
        if (el) {
          newAttr.ownerElement = el;
          var doc = el.ownerDocument;
          if (doc) {
            oldAttr && _onRemoveAttribute(doc, el, oldAttr);
            _onAddAttribute(doc, el, newAttr);
          }
        }
      }
      function _removeNamedNode(el, list, attr) {
        var i = _findNodeIndex(list, attr);
        if (i >= 0) {
          var lastIndex = list.length - 1;
          while (i <= lastIndex) {
            list[i] = list[++i];
          }
          list.length = lastIndex;
          _nnmIndexRemove(list, attr);
          if (el) {
            var doc = el.ownerDocument;
            if (doc) {
              _onRemoveAttribute(doc, el, attr);
            }
            attr.ownerElement = null;
          }
        }
      }
      NamedNodeMap.prototype = {
        length: 0,
        item: NodeList.prototype.item,
        /**
         * Get an attribute by name. Note: Name is in lower case in case of HTML namespace and
         * document.
         *
         * @param {string} localName
         * The local name of the attribute.
         * @returns {Attr | null}
         * The attribute with the given local name, or null if no such attribute exists.
         * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-name
         */
        getNamedItem: function(localName) {
          if (this._ownerElement && this._ownerElement._isInHTMLDocumentAndNamespace()) {
            localName = localName.toLowerCase();
          }
          var i = 0;
          while (i < this.length) {
            var attr = this[i];
            if (attr.nodeName === localName) {
              return attr;
            }
            i++;
          }
          return null;
        },
        /**
         * Set an attribute.
         *
         * @param {Attr} attr
         * The attribute to set.
         * @returns {Attr | null}
         * The old attribute with the same local name and namespace URI as the new one, or null if no
         * such attribute exists.
         * @throws {DOMException}
         * With code:
         * - {@link INUSE_ATTRIBUTE_ERR} - If the attribute is already an attribute of another
         * element.
         * @see https://dom.spec.whatwg.org/#concept-element-attributes-set
         */
        setNamedItem: function(attr) {
          var el = attr.ownerElement;
          if (el && el !== this._ownerElement) {
            throw new DOMException(DOMException.INUSE_ATTRIBUTE_ERR);
          }
          var oldAttr = _nnmIndexFind(this, attr.namespaceURI, attr.localName);
          if (oldAttr === attr) {
            return attr;
          }
          _addNamedNode(this._ownerElement, this, attr, oldAttr);
          return oldAttr;
        },
        /**
         * Set an attribute, replacing an existing attribute with the same local name and namespace
         * URI if one exists.
         *
         * @param {Attr} attr
         * The attribute to set.
         * @returns {Attr | null}
         * The old attribute with the same local name and namespace URI as the new one, or null if no
         * such attribute exists.
         * @throws {DOMException}
         * Throws a DOMException with the name "InUseAttributeError" if the attribute is already an
         * attribute of another element.
         * @see https://dom.spec.whatwg.org/#concept-element-attributes-set
         */
        setNamedItemNS: function(attr) {
          return this.setNamedItem(attr);
        },
        /**
         * Removes an attribute specified by the local name.
         *
         * @param {string} localName
         * The local name of the attribute to be removed.
         * @returns {Attr}
         * The attribute node that was removed.
         * @throws {DOMException}
         * With code:
         * - {@link DOMException.NOT_FOUND_ERR} if no attribute with the given name is found.
         * @see https://dom.spec.whatwg.org/#dom-namednodemap-removenameditem
         * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-name
         */
        removeNamedItem: function(localName) {
          var attr = this.getNamedItem(localName);
          if (!attr) {
            throw new DOMException(DOMException.NOT_FOUND_ERR, localName);
          }
          _removeNamedNode(this._ownerElement, this, attr);
          return attr;
        },
        /**
         * Removes an attribute specified by the namespace and local name.
         *
         * @param {string | null} namespaceURI
         * The namespace URI of the attribute to be removed.
         * @param {string} localName
         * The local name of the attribute to be removed.
         * @returns {Attr}
         * The attribute node that was removed.
         * @throws {DOMException}
         * With code:
         * - {@link DOMException.NOT_FOUND_ERR} if no attribute with the given namespace URI and local
         * name is found.
         * @see https://dom.spec.whatwg.org/#dom-namednodemap-removenameditemns
         * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-namespace
         */
        removeNamedItemNS: function(namespaceURI, localName) {
          var attr = this.getNamedItemNS(namespaceURI, localName);
          if (!attr) {
            throw new DOMException(DOMException.NOT_FOUND_ERR, namespaceURI ? namespaceURI + " : " + localName : localName);
          }
          _removeNamedNode(this._ownerElement, this, attr);
          return attr;
        },
        /**
         * Get an attribute by namespace and local name.
         *
         * @param {string | null} namespaceURI
         * The namespace URI of the attribute.
         * @param {string} localName
         * The local name of the attribute.
         * @returns {Attr | null}
         * The attribute with the given namespace URI and local name, or null if no such attribute
         * exists.
         * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-namespace
         */
        getNamedItemNS: function(namespaceURI, localName) {
          if (!namespaceURI) {
            namespaceURI = null;
          }
          var i = 0;
          while (i < this.length) {
            var node = this[i];
            if (node.localName === localName && node.namespaceURI === namespaceURI) {
              return node;
            }
            i++;
          }
          return null;
        }
      };
      NamedNodeMap.prototype[Symbol.iterator] = function() {
        var me = this;
        var index = 0;
        return {
          next: function() {
            if (index < me.length) {
              return {
                value: me[index++],
                done: false
              };
            } else {
              return {
                done: true
              };
            }
          },
          return: function() {
            return {
              done: true
            };
          }
        };
      };
      function DOMImplementation() {
      }
      DOMImplementation.prototype = {
        /**
         * Test if the DOM implementation implements a specific feature and version, as specified in
         * {@link https://www.w3.org/TR/DOM-Level-3-Core/core.html#DOMFeatures DOM Features}.
         *
         * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given
         * feature is supported. The different implementations fairly diverged in what kind of
         * features were reported. The latest version of the spec settled to force this method to
         * always return true, where the functionality was accurate and in use.
         *
         * @deprecated
         * It is deprecated and modern browsers return true in all cases.
         * @function DOMImplementation#hasFeature
         * @param {string} feature
         * The name of the feature to test.
         * @param {string} [version]
         * This is the version number of the feature to test.
         * @returns {boolean}
         * Always returns true.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
         * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
         * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
         * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-5CED94D7 DOM Level 3 Core
         */
        hasFeature: function(feature, version) {
          return true;
        },
        /**
         * Creates a DOM Document object of the specified type with its document element. Note that
         * based on the {@link DocumentType}
         * given to create the document, the implementation may instantiate specialized
         * {@link Document} objects that support additional features than the "Core", such as "HTML"
         * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#DOM2HTML DOM Level 2 HTML}.
         * On the other hand, setting the {@link DocumentType} after the document was created makes
         * this very unlikely to happen. Alternatively, specialized {@link Document} creation methods,
         * such as createHTMLDocument
         * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#DOM2HTML DOM Level 2 HTML},
         * can be used to obtain specific types of {@link Document} objects.
         *
         * __It behaves slightly different from the description in the living standard__:
         * - There is no interface/class `XMLDocument`, it returns a `Document`
         * instance (with it's `type` set to `'xml'`).
         * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
         *
         * @function DOMImplementation.createDocument
         * @param {string | null} namespaceURI
         * The
         * {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-namespaceURI namespace URI}
         * of the document element to create or null.
         * @param {string | null} qualifiedName
         * The
         * {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-qualifiedname qualified name}
         * of the document element to be created or null.
         * @param {DocumentType | null} [doctype=null]
         * The type of document to be created or null. When doctype is not null, its
         * {@link Node#ownerDocument} attribute is set to the document being created. Default is
         * `null`
         * @returns {Document}
         * A new {@link Document} object with its document element. If the NamespaceURI,
         * qualifiedName, and doctype are null, the returned {@link Document} is empty with no
         * document element.
         * @throws {DOMException}
         * With code:
         *
         * - `INVALID_CHARACTER_ERR`: Raised if the specified qualified name is not an XML name
         * according to {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#XML XML 1.0}.
         * - `NAMESPACE_ERR`: Raised if the qualifiedName is malformed, if the qualifiedName has a
         * prefix and the namespaceURI is null, or if the qualifiedName is null and the namespaceURI
         * is different from null, or if the qualifiedName has a prefix that is "xml" and the
         * namespaceURI is different from "{@link http://www.w3.org/XML/1998/namespace}"
         * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#Namespaces XML Namespaces},
         * or if the DOM implementation does not support the "XML" feature but a non-null namespace
         * URI was provided, since namespaces were defined by XML.
         * - `WRONG_DOCUMENT_ERR`: Raised if doctype has already been used with a different document
         * or was created from a different implementation.
         * - `NOT_SUPPORTED_ERR`: May be raised if the implementation does not support the feature
         * "XML" and the language exposed through the Document does not support XML Namespaces (such
         * as {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#HTML40 HTML 4.01}).
         * @since DOM Level 2.
         * @see {@link #createHTMLDocument}
         * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
         * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument DOM Living Standard
         * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Level-2-Core-DOM-createDocument DOM
         *      Level 3 Core
         * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM
         *      Level 2 Core (initial)
         */
        createDocument: function(namespaceURI, qualifiedName, doctype) {
          var contentType = MIME_TYPE.XML_APPLICATION;
          if (namespaceURI === NAMESPACE.HTML) {
            contentType = MIME_TYPE.XML_XHTML_APPLICATION;
          } else if (namespaceURI === NAMESPACE.SVG) {
            contentType = MIME_TYPE.XML_SVG_IMAGE;
          }
          var doc = new Document(PDC, { contentType });
          doc.implementation = this;
          doc.childNodes = new NodeList();
          doc.doctype = doctype || null;
          if (doctype) {
            doc.appendChild(doctype);
          }
          if (qualifiedName) {
            var root = doc.createElementNS(namespaceURI, qualifiedName);
            doc.appendChild(root);
          }
          return doc;
        },
        /**
         * Creates an empty DocumentType node. Entity declarations and notations are not made
         * available. Entity reference expansions and default attribute additions do not occur.
         *
         * **This behavior is slightly different from the one in the specs**:
         * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
         * - `publicId` and `systemId` contain the raw data including any possible quotes,
         *   so they can always be serialized back to the original value
         * - `internalSubset` contains the raw string between `[` and `]` if present,
         *   but is not parsed or validated in any form.
         *
         * @function DOMImplementation#createDocumentType
         * @param {string} qualifiedName
         * The {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-qualifiedname qualified
         * name} of the document type to be created.
         * @param {string} [publicId]
         * The external subset public identifier. Stored verbatim including surrounding quotes.
         * When serialized with `requireWellFormed: true`, the serializer throws `InvalidStateError`
         * if the value is non-empty and does not match the XML `PubidLiteral` production
         * (W3C DOM Parsing §3.2.1.3; XML 1.0 production [12]). Creation-time validation is not
         * enforced — deferred to a future breaking release.
         * @param {string} [systemId]
         * The external subset system identifier. Stored verbatim including surrounding quotes.
         * When serialized with `requireWellFormed: true`, the serializer throws `InvalidStateError`
         * if the value is non-empty and does not match the XML `SystemLiteral` production
         * (W3C DOM Parsing §3.2.1.3; XML 1.0 production [11]). Creation-time validation is not
         * enforced — deferred to a future breaking release.
         * @param {string} [internalSubset]
         * The internal subset or an empty string if it is not present. Stored verbatim.
         * When serialized with `requireWellFormed: true`, the serializer throws `InvalidStateError`
         * if the value contains `"]>"`. Creation-time validation is not enforced.
         * @returns {DocumentType}
         * A new {@link DocumentType} node with {@link Node#ownerDocument} set to null.
         * @throws {DOMException}
         * With code:
         *
         * - `INVALID_CHARACTER_ERR`: Raised if the specified qualified name is not an XML name
         * according to {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#XML XML 1.0}.
         * - `NAMESPACE_ERR`: Raised if the qualifiedName is malformed.
         * - `NOT_SUPPORTED_ERR`: May be raised if the implementation does not support the feature
         * "XML" and the language exposed through the Document does not support XML Namespaces (such
         * as {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#HTML40 HTML 4.01}).
         * @since DOM Level 2.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType
         *      MDN
         * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living
         *      Standard
         * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Level-3-Core-DOM-createDocType DOM
         *      Level 3 Core
         * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM
         *      Level 2 Core
         * @see https://github.com/xmldom/xmldom/blob/master/CHANGELOG.md#050
         * @see https://www.w3.org/TR/DOM-Level-2-Core/#core-ID-Core-DocType-internalSubset
         * @prettierignore
         */
        createDocumentType: function(qualifiedName, publicId, systemId, internalSubset) {
          validateQualifiedName(qualifiedName);
          var node = new DocumentType(PDC);
          node.name = qualifiedName;
          node.nodeName = qualifiedName;
          node.publicId = publicId || "";
          node.systemId = systemId || "";
          node.internalSubset = internalSubset || "";
          node.childNodes = new NodeList();
          return node;
        },
        /**
         * Returns an HTML document, that might already have a basic DOM structure.
         *
         * __It behaves slightly different from the description in the living standard__:
         * - If the first argument is `false` no initial nodes are added (steps 3-7 in the specs are
         * omitted)
         * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
         *
         * @param {string | false} [title]
         * A string containing the title to give the new HTML document.
         * @returns {Document}
         * The HTML document.
         * @since WHATWG Living Standard.
         * @see {@link #createDocument}
         * @see https://dom.spec.whatwg.org/#dom-domimplementation-createhtmldocument
         * @see https://dom.spec.whatwg.org/#html-document
         */
        createHTMLDocument: function(title) {
          var doc = new Document(PDC, { contentType: MIME_TYPE.HTML });
          doc.implementation = this;
          doc.childNodes = new NodeList();
          if (title !== false) {
            doc.doctype = this.createDocumentType("html");
            doc.doctype.ownerDocument = doc;
            doc.appendChild(doc.doctype);
            var htmlNode = doc.createElement("html");
            doc.appendChild(htmlNode);
            var headNode = doc.createElement("head");
            htmlNode.appendChild(headNode);
            if (typeof title === "string") {
              var titleNode = doc.createElement("title");
              titleNode.appendChild(doc.createTextNode(title));
              headNode.appendChild(titleNode);
            }
            htmlNode.appendChild(doc.createElement("body"));
          }
          return doc;
        }
      };
      function Node2(symbol) {
        checkSymbol(symbol);
      }
      Node2.prototype = {
        /**
         * The first child of this node.
         *
         * @type {Node | null}
         */
        firstChild: null,
        /**
         * The last child of this node.
         *
         * @type {Node | null}
         */
        lastChild: null,
        /**
         * The previous sibling of this node.
         *
         * @type {Node | null}
         */
        previousSibling: null,
        /**
         * The next sibling of this node.
         *
         * @type {Node | null}
         */
        nextSibling: null,
        /**
         * The parent node of this node.
         *
         * @type {Node | null}
         */
        parentNode: null,
        /**
         * The parent element of this node.
         *
         * @type {Element | null}
         */
        get parentElement() {
          return this.parentNode && this.parentNode.nodeType === this.ELEMENT_NODE ? this.parentNode : null;
        },
        /**
         * The child nodes of this node.
         *
         * @type {NodeList}
         */
        childNodes: null,
        /**
         * The document object associated with this node.
         *
         * @type {Document | null}
         */
        ownerDocument: null,
        /**
         * The value of this node.
         *
         * @type {string | null}
         */
        nodeValue: null,
        /**
         * The namespace URI of this node.
         *
         * @type {string | null}
         */
        namespaceURI: null,
        /**
         * The prefix of the namespace for this node.
         *
         * @type {string | null}
         */
        prefix: null,
        /**
         * The local part of the qualified name of this node.
         *
         * @type {string | null}
         */
        localName: null,
        /**
         * The baseURI is currently always `about:blank`,
         * since that's what happens when you create a document from scratch.
         *
         * @type {'about:blank'}
         */
        baseURI: "about:blank",
        /**
         * Is true if this node is part of a document.
         *
         * @type {boolean}
         */
        get isConnected() {
          var rootNode = this.getRootNode();
          return rootNode && rootNode.nodeType === rootNode.DOCUMENT_NODE;
        },
        /**
         * Checks whether `other` is an inclusive descendant of this node.
         *
         * @param {Node | null | undefined} other
         * The node to check.
         * @returns {boolean}
         * True if `other` is an inclusive descendant of this node; false otherwise.
         * @see https://dom.spec.whatwg.org/#dom-node-contains
         */
        contains: function(other) {
          if (!other) return false;
          var parent2 = other;
          do {
            if (this === parent2) return true;
            parent2 = parent2.parentNode;
          } while (parent2);
          return false;
        },
        /**
         * @typedef GetRootNodeOptions
         * @property {boolean} [composed=false]
         */
        /**
         * Searches for the root node of this node.
         *
         * **This behavior is slightly different from the in the specs**:
         * - ignores `options.composed`, since `ShadowRoot`s are unsupported, always returns root.
         *
         * @param {GetRootNodeOptions} [options]
         * @returns {Node}
         * Root node.
         * @see https://dom.spec.whatwg.org/#dom-node-getrootnode
         * @see https://dom.spec.whatwg.org/#concept-shadow-including-root
         */
        getRootNode: function(options) {
          var parent2 = this;
          do {
            if (!parent2.parentNode) {
              return parent2;
            }
            parent2 = parent2.parentNode;
          } while (parent2);
        },
        /**
         * Checks whether the given node is equal to this node.
         *
         * Two nodes are equal when they have the same type, defining characteristics (for the type),
         * and the same childNodes. The comparison is iterative to avoid stack overflows on
         * deeply-nested trees. Attribute nodes of each Element pair are also pushed onto the stack
         * and compared the same way.
         *
         * @param {Node} [otherNode]
         * @returns {boolean}
         * @see https://dom.spec.whatwg.org/#concept-node-equals
         * @see ../docs/walk-dom.md.
         */
        isEqualNode: function(otherNode) {
          if (!otherNode) return false;
          var stack = [{ node: this, other: otherNode }];
          while (stack.length > 0) {
            var pair = stack.pop();
            var node = pair.node;
            var other = pair.other;
            if (node.nodeType !== other.nodeType) return false;
            switch (node.nodeType) {
              case node.DOCUMENT_TYPE_NODE:
                if (node.name !== other.name) return false;
                if (node.publicId !== other.publicId) return false;
                if (node.systemId !== other.systemId) return false;
                break;
              case node.ELEMENT_NODE:
                if (node.namespaceURI !== other.namespaceURI) return false;
                if (node.prefix !== other.prefix) return false;
                if (node.localName !== other.localName) return false;
                if (node.attributes.length !== other.attributes.length) return false;
                for (var i = 0; i < node.attributes.length; i++) {
                  var attr = node.attributes.item(i);
                  var otherAttr = other.getAttributeNodeNS(attr.namespaceURI, attr.localName);
                  if (!otherAttr) return false;
                  stack.push({ node: attr, other: otherAttr });
                }
                break;
              case node.ATTRIBUTE_NODE:
                if (node.namespaceURI !== other.namespaceURI) return false;
                if (node.localName !== other.localName) return false;
                if (node.value !== other.value) return false;
                break;
              case node.PROCESSING_INSTRUCTION_NODE:
                if (node.target !== other.target || node.data !== other.data) return false;
                break;
              case node.TEXT_NODE:
              case node.CDATA_SECTION_NODE:
              case node.COMMENT_NODE:
                if (node.data !== other.data) return false;
                break;
            }
            if (node.childNodes.length !== other.childNodes.length) return false;
            for (var i = node.childNodes.length - 1; i >= 0; i--) {
              stack.push({ node: node.childNodes[i], other: other.childNodes[i] });
            }
          }
          return true;
        },
        /**
         * Checks whether or not the given node is this node.
         *
         * @param {Node} [otherNode]
         */
        isSameNode: function(otherNode) {
          return this === otherNode;
        },
        /**
         * Inserts a node before a reference node as a child of this node.
         *
         * @param {Node} newChild
         * The new child node to be inserted.
         * @param {Node | null} refChild
         * The reference node before which newChild will be inserted.
         * @returns {Node}
         * The new child node successfully inserted.
         * @throws {DOMException}
         * Throws a DOMException if inserting the node would result in a DOM tree that is not
         * well-formed, or if `child` is provided but is not a child of `parent`.
         * See {@link _insertBefore} for more details.
         * @since Modified in DOM L2
         */
        insertBefore: function(newChild, refChild) {
          return _insertBefore(this, newChild, refChild);
        },
        /**
         * Replaces an old child node with a new child node within this node.
         *
         * @param {Node} newChild
         * The new node that is to replace the old node.
         * If it already exists in the DOM, it is removed from its original position.
         * @param {Node} oldChild
         * The existing child node to be replaced.
         * @returns {Node}
         * Returns the replaced child node.
         * @throws {DOMException}
         * Throws a DOMException if replacing the node would result in a DOM tree that is not
         * well-formed, or if `oldChild` is not a child of `this`.
         * This can also occur if the pre-replacement validity assertion fails.
         * See {@link _insertBefore}, {@link Node.removeChild}, and
         * {@link assertPreReplacementValidityInDocument} for more details.
         * @see https://dom.spec.whatwg.org/#concept-node-replace
         */
        replaceChild: function(newChild, oldChild) {
          _insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
          if (oldChild) {
            this.removeChild(oldChild);
          }
        },
        /**
         * Removes an existing child node from this node.
         *
         * @param {Node} oldChild
         * The child node to be removed.
         * @returns {Node}
         * Returns the removed child node.
         * @throws {DOMException}
         * Throws a DOMException if `oldChild` is not a child of `this`.
         * See {@link _removeChild} for more details.
         */
        removeChild: function(oldChild) {
          return _removeChild(this, oldChild);
        },
        /**
         * Appends a child node to this node.
         *
         * @param {Node} newChild
         * The child node to be appended to this node.
         * If it already exists in the DOM, it is removed from its original position.
         * @returns {Node}
         * Returns the appended child node.
         * @throws {DOMException}
         * Throws a DOMException if appending the node would result in a DOM tree that is not
         * well-formed, or if `newChild` is not a valid Node.
         * See {@link insertBefore} for more details.
         */
        appendChild: function(newChild) {
          return this.insertBefore(newChild, null);
        },
        /**
         * Determines whether this node has any child nodes.
         *
         * @returns {boolean}
         * Returns true if this node has any child nodes, and false otherwise.
         */
        hasChildNodes: function() {
          return this.firstChild != null;
        },
        /**
         * Creates a copy of the calling node.
         *
         * @param {boolean} deep
         * If true, the contents of the node are recursively copied.
         * If false, only the node itself (and its attributes, if it is an element) are copied.
         * @returns {Node}
         * Returns the newly created copy of the node.
         * @throws {DOMException}
         * May throw a DOMException if operations within {@link Element#setAttributeNode} or
         * {@link Node#appendChild} (which are potentially invoked in this method) do not meet their
         * specific constraints.
         * @see {@link cloneNode}
         */
        cloneNode: function(deep) {
          return cloneNode(this.ownerDocument || this, this, deep);
        },
        /**
         * Puts the specified node and all of its subtree into a "normalized" form. In a normalized
         * subtree, no text nodes in the subtree are empty and there are no adjacent text nodes.
         *
         * Specifically, this method merges any adjacent text nodes (i.e., nodes for which `nodeType`
         * is `TEXT_NODE`) into a single node with the combined data. It also removes any empty text
         * nodes.
         *
         * This method iterativly traverses all child nodes to normalize all descendent nodes within
         * the subtree.
         *
         * @throws {DOMException}
         * May throw a DOMException if operations within removeChild or appendData (which are
         * potentially invoked in this method) do not meet their specific constraints.
         * @since Modified in DOM Level 2
         * @see {@link Node.removeChild}
         * @see {@link CharacterData.appendData}
         * @see ../docs/walk-dom.md.
         */
        normalize: function() {
          walkDOM(this, null, {
            enter: function(node) {
              var child = node.firstChild;
              while (child) {
                var next = child.nextSibling;
                if (next !== null && next.nodeType === TEXT_NODE && child.nodeType === TEXT_NODE) {
                  var tail = [];
                  var sibling = next;
                  while (sibling !== null && sibling.nodeType === TEXT_NODE) {
                    tail.push(sibling.data);
                    sibling = sibling.nextSibling;
                  }
                  var removed = child.nextSibling;
                  while (removed !== sibling) {
                    var following = removed.nextSibling;
                    removed.parentNode = null;
                    removed.previousSibling = null;
                    removed.nextSibling = null;
                    removed = following;
                  }
                  child.nextSibling = sibling;
                  if (sibling !== null) {
                    sibling.previousSibling = child;
                  } else {
                    node.lastChild = child;
                  }
                  child.appendData(tail.join(""));
                  _onUpdateChild(node.ownerDocument, node);
                  child = sibling;
                } else {
                  child = next;
                }
              }
              return true;
            }
          });
        },
        /**
         * Checks whether the DOM implementation implements a specific feature and its version.
         *
         * @deprecated
         * Since `DOMImplementation.hasFeature` is deprecated and always returns true.
         * @param {string} feature
         * The package name of the feature to test. This is the same name that can be passed to the
         * method `hasFeature` on `DOMImplementation`.
         * @param {string} version
         * This is the version number of the package name to test.
         * @returns {boolean}
         * Returns true in all cases in the current implementation.
         * @since Introduced in DOM Level 2
         * @see {@link DOMImplementation.hasFeature}
         */
        isSupported: function(feature, version) {
          return this.ownerDocument.implementation.hasFeature(feature, version);
        },
        /**
         * Look up the prefix associated to the given namespace URI, starting from this node.
         * **The default namespace declarations are ignored by this method.**
         * See Namespace Prefix Lookup for details on the algorithm used by this method.
         *
         * **This behavior is different from the in the specs**:
         * - no node type specific handling
         * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
         *
         * @param {string | null} namespaceURI
         * The namespace URI for which to find the associated prefix.
         * @returns {string | null}
         * The associated prefix, if found; otherwise, null.
         * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespacePrefix
         * @see https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespacePrefixAlgo
         * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
         * @see https://github.com/xmldom/xmldom/issues/322
         * @prettierignore
         */
        lookupPrefix: function(namespaceURI) {
          var el = this;
          while (el) {
            var map = el._nsMap;
            if (map) {
              for (var n in map) {
                if (hasOwn(map, n) && map[n] === namespaceURI) {
                  return n;
                }
              }
            }
            el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
          }
          return null;
        },
        /**
         * This function is used to look up the namespace URI associated with the given prefix,
         * starting from this node.
         *
         * **This behavior is different from the in the specs**:
         * - no node type specific handling
         * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
         *
         * @param {string | null} prefix
         * The prefix for which to find the associated namespace URI.
         * @returns {string | null}
         * The associated namespace URI, if found; otherwise, null.
         * @since DOM Level 3
         * @see https://dom.spec.whatwg.org/#dom-node-lookupnamespaceuri
         * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespaceURI
         * @prettierignore
         */
        lookupNamespaceURI: function(prefix) {
          var el = this;
          while (el) {
            var map = el._nsMap;
            if (map) {
              if (hasOwn(map, prefix)) {
                return map[prefix];
              }
            }
            el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
          }
          return null;
        },
        /**
         * Determines whether the given namespace URI is the default namespace.
         *
         * The function works by looking up the prefix associated with the given namespace URI. If no
         * prefix is found (i.e., the namespace URI is not registered in the namespace map of this
         * node or any of its ancestors), it returns `true`, implying the namespace URI is considered
         * the default.
         *
         * **This behavior is different from the in the specs**:
         * - no node type specific handling
         * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
         *
         * @param {string | null} namespaceURI
         * The namespace URI to be checked.
         * @returns {boolean}
         * Returns true if the given namespace URI is the default namespace, false otherwise.
         * @since DOM Level 3
         * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-isDefaultNamespace
         * @see https://dom.spec.whatwg.org/#dom-node-isdefaultnamespace
         * @prettierignore
         */
        isDefaultNamespace: function(namespaceURI) {
          var prefix = this.lookupPrefix(namespaceURI);
          return prefix == null;
        },
        /**
         * Compares the reference node with a node with regard to their position in the document and
         * according to the document order.
         *
         * @param {Node} other
         * The node to compare the reference node to.
         * @returns {number}
         * Returns how the node is positioned relatively to the reference node according to the
         * bitmask. 0 if reference node and given node are the same.
         * @since DOM Level 3
         * @see https://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html#Node3-compare
         * @see https://dom.spec.whatwg.org/#dom-node-comparedocumentposition
         */
        compareDocumentPosition: function(other) {
          if (this === other) return 0;
          var node1 = other;
          var node2 = this;
          var attr1 = null;
          var attr2 = null;
          if (node1 instanceof Attr) {
            attr1 = node1;
            node1 = attr1.ownerElement;
          }
          if (node2 instanceof Attr) {
            attr2 = node2;
            node2 = attr2.ownerElement;
            if (attr1 && node1 && node2 === node1) {
              for (var i = 0, attr; attr = node2.attributes[i]; i++) {
                if (attr === attr1)
                  return DocumentPosition.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + DocumentPosition.DOCUMENT_POSITION_PRECEDING;
                if (attr === attr2)
                  return DocumentPosition.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
              }
            }
          }
          if (!node1 || !node2 || node2.ownerDocument !== node1.ownerDocument) {
            return DocumentPosition.DOCUMENT_POSITION_DISCONNECTED + DocumentPosition.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + (docGUID(node2.ownerDocument) > docGUID(node1.ownerDocument) ? DocumentPosition.DOCUMENT_POSITION_FOLLOWING : DocumentPosition.DOCUMENT_POSITION_PRECEDING);
          }
          if (attr2 && node1 === node2) {
            return DocumentPosition.DOCUMENT_POSITION_CONTAINS + DocumentPosition.DOCUMENT_POSITION_PRECEDING;
          }
          if (attr1 && node1 === node2) {
            return DocumentPosition.DOCUMENT_POSITION_CONTAINED_BY + DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
          }
          var chain1 = [];
          var ancestor1 = node1.parentNode;
          while (ancestor1) {
            if (!attr2 && ancestor1 === node2) {
              return DocumentPosition.DOCUMENT_POSITION_CONTAINED_BY + DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
            }
            chain1.push(ancestor1);
            ancestor1 = ancestor1.parentNode;
          }
          chain1.reverse();
          var chain2 = [];
          var ancestor2 = node2.parentNode;
          while (ancestor2) {
            if (!attr1 && ancestor2 === node1) {
              return DocumentPosition.DOCUMENT_POSITION_CONTAINS + DocumentPosition.DOCUMENT_POSITION_PRECEDING;
            }
            chain2.push(ancestor2);
            ancestor2 = ancestor2.parentNode;
          }
          chain2.reverse();
          var ca = commonAncestor(chain1, chain2);
          for (var n in ca.childNodes) {
            var child = ca.childNodes[n];
            if (child === node2) return DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
            if (child === node1) return DocumentPosition.DOCUMENT_POSITION_PRECEDING;
            if (chain2.indexOf(child) >= 0) return DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
            if (chain1.indexOf(child) >= 0) return DocumentPosition.DOCUMENT_POSITION_PRECEDING;
          }
          return 0;
        }
      };
      function _xmlEncoder(c) {
        return c == "<" && "&lt;" || c == ">" && "&gt;" || c == "&" && "&amp;" || c == '"' && "&quot;" || "&#" + c.charCodeAt() + ";";
      }
      copy(NodeType, Node2);
      copy(NodeType, Node2.prototype);
      copy(DocumentPosition, Node2);
      copy(DocumentPosition, Node2.prototype);
      function _visitNode(node, callback) {
        walkDOM(node, null, {
          enter: function(n) {
            return callback(n) ? walkDOM.STOP : true;
          }
        });
      }
      function walkDOM(node, context, callbacks) {
        var stack = [{ node, context, phase: walkDOM.ENTER }];
        while (stack.length > 0) {
          var frame = stack.pop();
          if (frame.phase === walkDOM.ENTER) {
            var childContext = callbacks.enter(frame.node, frame.context);
            if (childContext === walkDOM.STOP) {
              return walkDOM.STOP;
            }
            stack.push({ node: frame.node, context: childContext, phase: walkDOM.EXIT });
            if (childContext === null || childContext === void 0) {
              continue;
            }
            var child = frame.node.lastChild;
            while (child) {
              stack.push({ node: child, context: childContext, phase: walkDOM.ENTER });
              child = child.previousSibling;
            }
          } else {
            if (callbacks.exit) {
              callbacks.exit(frame.node, frame.context);
            }
          }
        }
      }
      walkDOM.STOP = Symbol("walkDOM.STOP");
      walkDOM.ENTER = 0;
      walkDOM.EXIT = 1;
      function Document(symbol, options) {
        checkSymbol(symbol);
        var opt = options || {};
        this.ownerDocument = this;
        this.contentType = opt.contentType || MIME_TYPE.XML_APPLICATION;
        this.type = isHTMLMimeType(this.contentType) ? "html" : "xml";
      }
      function _onAddAttribute(doc, el, newAttr) {
        doc && doc._inc++;
        var ns = newAttr.namespaceURI;
        if (ns === NAMESPACE.XMLNS) {
          el._nsMap[newAttr.prefix ? newAttr.localName : ""] = newAttr.value;
        }
      }
      function _onRemoveAttribute(doc, el, newAttr, remove) {
        doc && doc._inc++;
        var ns = newAttr.namespaceURI;
        if (ns === NAMESPACE.XMLNS) {
          delete el._nsMap[newAttr.prefix ? newAttr.localName : ""];
        }
      }
      function _onUpdateChild(doc, parent2, newChild) {
        if (doc && doc._inc) {
          doc._inc++;
          var childNodes = parent2.childNodes;
          if (newChild && !newChild.nextSibling) {
            childNodes[childNodes.length++] = newChild;
          } else {
            var child = parent2.firstChild;
            var i = 0;
            while (child) {
              childNodes[i++] = child;
              child = child.nextSibling;
            }
            childNodes.length = i;
            delete childNodes[childNodes.length];
          }
        }
      }
      function _removeChild(parentNode, child) {
        if (parentNode !== child.parentNode) {
          throw new DOMException(DOMException.NOT_FOUND_ERR, "child's parent is not parent");
        }
        var oldPreviousSibling = child.previousSibling;
        var oldNextSibling = child.nextSibling;
        if (oldPreviousSibling) {
          oldPreviousSibling.nextSibling = oldNextSibling;
        } else {
          parentNode.firstChild = oldNextSibling;
        }
        if (oldNextSibling) {
          oldNextSibling.previousSibling = oldPreviousSibling;
        } else {
          parentNode.lastChild = oldPreviousSibling;
        }
        _onUpdateChild(parentNode.ownerDocument, parentNode);
        child.parentNode = null;
        child.previousSibling = null;
        child.nextSibling = null;
        return child;
      }
      function hasValidParentNodeType(node) {
        return node && (node.nodeType === Node2.DOCUMENT_NODE || node.nodeType === Node2.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node2.ELEMENT_NODE);
      }
      function hasInsertableNodeType(node) {
        return node && (node.nodeType === Node2.CDATA_SECTION_NODE || node.nodeType === Node2.COMMENT_NODE || node.nodeType === Node2.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node2.DOCUMENT_TYPE_NODE || node.nodeType === Node2.ELEMENT_NODE || node.nodeType === Node2.PROCESSING_INSTRUCTION_NODE || node.nodeType === Node2.TEXT_NODE);
      }
      function isDocTypeNode(node) {
        return node && node.nodeType === Node2.DOCUMENT_TYPE_NODE;
      }
      function isElementNode(node) {
        return node && node.nodeType === Node2.ELEMENT_NODE;
      }
      function isTextNode(node) {
        return node && node.nodeType === Node2.TEXT_NODE;
      }
      function isElementInsertionPossible(doc, child) {
        var parentChildNodes = doc.childNodes || [];
        if (find(parentChildNodes, isElementNode) || isDocTypeNode(child)) {
          return false;
        }
        var docTypeNode = find(parentChildNodes, isDocTypeNode);
        return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
      }
      function isElementReplacementPossible(doc, child) {
        var parentChildNodes = doc.childNodes || [];
        function hasElementChildThatIsNotChild(node) {
          return isElementNode(node) && node !== child;
        }
        if (find(parentChildNodes, hasElementChildThatIsNotChild)) {
          return false;
        }
        var docTypeNode = find(parentChildNodes, isDocTypeNode);
        return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
      }
      function assertPreInsertionValidity1to5(parent2, node, child) {
        if (!hasValidParentNodeType(parent2)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Unexpected parent node type " + parent2.nodeType);
        }
        if (child && child.parentNode !== parent2) {
          throw new DOMException(DOMException.NOT_FOUND_ERR, "child not in parent");
        }
        if (
          // 4. If `node` is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw a "HierarchyRequestError" DOMException.
          !hasInsertableNodeType(node) || // 5. If either `node` is a Text node and `parent` is a document,
          // the sax parser currently adds top level text nodes, this will be fixed in 0.9.0
          // || (node.nodeType === Node.TEXT_NODE && parent.nodeType === Node.DOCUMENT_NODE)
          // or `node` is a doctype and `parent` is not a document, then throw a "HierarchyRequestError" DOMException.
          isDocTypeNode(node) && parent2.nodeType !== Node2.DOCUMENT_NODE
        ) {
          throw new DOMException(
            DOMException.HIERARCHY_REQUEST_ERR,
            "Unexpected node type " + node.nodeType + " for parent node type " + parent2.nodeType
          );
        }
      }
      function assertPreInsertionValidityInDocument(parent2, node, child) {
        var parentChildNodes = parent2.childNodes || [];
        var nodeChildNodes = node.childNodes || [];
        if (node.nodeType === Node2.DOCUMENT_FRAGMENT_NODE) {
          var nodeChildElements = nodeChildNodes.filter(isElementNode);
          if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
            throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
          }
          if (nodeChildElements.length === 1 && !isElementInsertionPossible(parent2, child)) {
            throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
          }
        }
        if (isElementNode(node)) {
          if (!isElementInsertionPossible(parent2, child)) {
            throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
          }
        }
        if (isDocTypeNode(node)) {
          if (find(parentChildNodes, isDocTypeNode)) {
            throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
          }
          var parentElementChild = find(parentChildNodes, isElementNode);
          if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
            throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
          }
          if (!child && parentElementChild) {
            throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Doctype can not be appended since element is present");
          }
        }
      }
      function assertPreReplacementValidityInDocument(parent2, node, child) {
        var parentChildNodes = parent2.childNodes || [];
        var nodeChildNodes = node.childNodes || [];
        if (node.nodeType === Node2.DOCUMENT_FRAGMENT_NODE) {
          var nodeChildElements = nodeChildNodes.filter(isElementNode);
          if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
            throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
          }
          if (nodeChildElements.length === 1 && !isElementReplacementPossible(parent2, child)) {
            throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
          }
        }
        if (isElementNode(node)) {
          if (!isElementReplacementPossible(parent2, child)) {
            throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
          }
        }
        if (isDocTypeNode(node)) {
          let hasDoctypeChildThatIsNotChild = function(node2) {
            return isDocTypeNode(node2) && node2 !== child;
          };
          if (find(parentChildNodes, hasDoctypeChildThatIsNotChild)) {
            throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
          }
          var parentElementChild = find(parentChildNodes, isElementNode);
          if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
            throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
          }
        }
      }
      function _insertBefore(parent2, node, child, _inDocumentAssertion) {
        assertPreInsertionValidity1to5(parent2, node, child);
        if (parent2.nodeType === Node2.DOCUMENT_NODE) {
          (_inDocumentAssertion || assertPreInsertionValidityInDocument)(parent2, node, child);
        }
        var cp = node.parentNode;
        if (cp) {
          cp.removeChild(node);
        }
        if (node.nodeType === DOCUMENT_FRAGMENT_NODE) {
          var newFirst = node.firstChild;
          if (newFirst == null) {
            return node;
          }
          var newLast = node.lastChild;
        } else {
          newFirst = newLast = node;
        }
        var pre = child ? child.previousSibling : parent2.lastChild;
        newFirst.previousSibling = pre;
        newLast.nextSibling = child;
        if (pre) {
          pre.nextSibling = newFirst;
        } else {
          parent2.firstChild = newFirst;
        }
        if (child == null) {
          parent2.lastChild = newLast;
        } else {
          child.previousSibling = newLast;
        }
        do {
          newFirst.parentNode = parent2;
        } while (newFirst !== newLast && (newFirst = newFirst.nextSibling));
        _onUpdateChild(parent2.ownerDocument || parent2, parent2, node);
        if (node.nodeType == DOCUMENT_FRAGMENT_NODE) {
          node.firstChild = node.lastChild = null;
        }
        return node;
      }
      Document.prototype = {
        /**
         * The implementation that created this document.
         *
         * @type DOMImplementation
         * @readonly
         */
        implementation: null,
        nodeName: "#document",
        nodeType: DOCUMENT_NODE,
        /**
         * The DocumentType node of the document.
         *
         * @type DocumentType
         * @readonly
         */
        doctype: null,
        documentElement: null,
        _inc: 1,
        insertBefore: function(newChild, refChild) {
          if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
            var child = newChild.firstChild;
            while (child) {
              var next = child.nextSibling;
              this.insertBefore(child, refChild);
              child = next;
            }
            return newChild;
          }
          _insertBefore(this, newChild, refChild);
          newChild.ownerDocument = this;
          if (this.documentElement === null && newChild.nodeType === ELEMENT_NODE) {
            this.documentElement = newChild;
          }
          return newChild;
        },
        removeChild: function(oldChild) {
          var removed = _removeChild(this, oldChild);
          if (removed === this.documentElement) {
            this.documentElement = null;
          }
          return removed;
        },
        replaceChild: function(newChild, oldChild) {
          _insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
          newChild.ownerDocument = this;
          if (oldChild) {
            this.removeChild(oldChild);
          }
          if (isElementNode(newChild)) {
            this.documentElement = newChild;
          }
        },
        /**
         * Imports a node from another document into this document, creating a new copy owned by this
         * document. The source node and its subtree are not modified.
         *
         * @param {Node} importedNode
         * The node to import.
         * @param {boolean} deep
         * If true, the contents of the node are recursively imported.
         * If false, only the node itself (and its attributes, if it is an element) are imported.
         * @returns {Node}
         * Returns the newly created import of the node.
         * @see {@link importNode}
         * @see {@link https://dom.spec.whatwg.org/#dom-document-importnode}
         */
        importNode: function(importedNode, deep) {
          return importNode(this, importedNode, deep);
        },
        // Introduced in DOM Level 2:
        getElementById: function(id) {
          var rtv = null;
          _visitNode(this.documentElement, function(node) {
            if (node.nodeType == ELEMENT_NODE) {
              if (node.getAttribute("id") == id) {
                rtv = node;
                return true;
              }
            }
          });
          return rtv;
        },
        /**
         * Creates a new `Element` that is owned by this `Document`.
         * In HTML Documents `localName` is the lower cased `tagName`,
         * otherwise no transformation is being applied.
         * When `contentType` implies the HTML namespace, it will be set as `namespaceURI`.
         *
         * __This implementation differs from the specification:__ - The provided name is not checked
         * against the `Name` production,
         * so no related error will be thrown.
         * - There is no interface `HTMLElement`, it is always an `Element`.
         * - There is no support for a second argument to indicate using custom elements.
         *
         * @param {string} tagName
         * @returns {Element}
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
         * @see https://dom.spec.whatwg.org/#dom-document-createelement
         * @see https://dom.spec.whatwg.org/#concept-create-element
         */
        createElement: function(tagName) {
          var node = new Element2(PDC);
          node.ownerDocument = this;
          if (this.type === "html") {
            tagName = tagName.toLowerCase();
          }
          if (hasDefaultHTMLNamespace(this.contentType)) {
            node.namespaceURI = NAMESPACE.HTML;
          }
          node.nodeName = tagName;
          node.tagName = tagName;
          node.localName = tagName;
          node.childNodes = new NodeList();
          var attrs = node.attributes = new NamedNodeMap();
          attrs._ownerElement = node;
          return node;
        },
        /**
         * @returns {DocumentFragment}
         */
        createDocumentFragment: function() {
          var node = new DocumentFragment(PDC);
          node.ownerDocument = this;
          node.childNodes = new NodeList();
          return node;
        },
        /**
         * @param {string} data
         * @returns {Text}
         */
        createTextNode: function(data) {
          var node = new Text(PDC);
          node.ownerDocument = this;
          node.childNodes = new NodeList();
          node.appendData(data);
          return node;
        },
        /**
         * @param {string} data
         * @returns {Comment}
         * @see https://dom.spec.whatwg.org/#dom-document-createcomment
         * @see https://www.w3.org/TR/xml/#NT-Comment XML 1.0 production [15]
         * @see https://www.w3.org/TR/DOM-Parsing/#dfn-concept-serialize-xml §3.2.1.3
         *
         *      Note: no validation is performed at creation time. When the resulting document is
         *      serialized with `requireWellFormed: true`, the serializer throws `InvalidStateError`
         *      if the comment data contains `--` anywhere, ends with `-`, or contains characters
         *      outside the XML Char production (W3C DOM Parsing §3.2.1.3). Without that option the
         *      data is emitted verbatim.
         */
        createComment: function(data) {
          var node = new Comment(PDC);
          node.ownerDocument = this;
          node.childNodes = new NodeList();
          node.appendData(data);
          return node;
        },
        /**
         * Returns a new CDATASection node whose data is `data`.
         *
         * __This implementation differs from the specification:__ - calling this method on an HTML
         * document does not throw `NotSupportedError`.
         *
         * @param {string} data
         * @returns {CDATASection}
         * @throws {DOMException}
         * With code `INVALID_CHARACTER_ERR` if `data` contains `"]]>"`.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createCDATASection
         * @see https://dom.spec.whatwg.org/#dom-document-createcdatasection
         */
        createCDATASection: function(data) {
          if (data.indexOf("]]>") !== -1) {
            throw new DOMException(DOMException.INVALID_CHARACTER_ERR, 'data contains "]]>"');
          }
          var node = new CDATASection(PDC);
          node.ownerDocument = this;
          node.childNodes = new NodeList();
          node.appendData(data);
          return node;
        },
        /**
         * Returns a ProcessingInstruction node whose target is target and data is data.
         *
         * __This behavior is slightly different from the in the specs__:
         * - it does not do any input validation on the arguments and doesn't throw
         * "InvalidCharacterError".
         *
         * Note: When the resulting document is serialized with `requireWellFormed: true`, the
         * serializer throws `InvalidStateError` if `.target` is not a valid XML `NCName` (a `Name`
         * with no colon) or is an ASCII case-insensitive match for `"xml"`, or if `.data` contains
         * `?>` or characters outside the XML Char production (W3C DOM Parsing §3.2.1.7). Without that
         * option the target and data are emitted verbatim.
         *
         * @param {string} target
         * @param {string} data
         * @returns {ProcessingInstruction}
         * @see https://developer.mozilla.org/docs/Web/API/Document/createProcessingInstruction
         * @see https://dom.spec.whatwg.org/#dom-document-createprocessinginstruction
         * @see https://www.w3.org/TR/DOM-Parsing/#dfn-concept-serialize-xml §3.2.1.7
         */
        createProcessingInstruction: function(target, data) {
          var node = new ProcessingInstruction(PDC);
          node.ownerDocument = this;
          node.childNodes = new NodeList();
          node.nodeName = node.target = target;
          node.nodeValue = node.data = data;
          return node;
        },
        /**
         * Creates an `Attr` node that is owned by this document.
         * In HTML Documents `localName` is the lower cased `name`,
         * otherwise no transformation is being applied.
         *
         * __This implementation differs from the specification:__ - The provided name is not checked
         * against the `Name` production,
         * so no related error will be thrown.
         *
         * @param {string} name
         * @returns {Attr}
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createAttribute
         * @see https://dom.spec.whatwg.org/#dom-document-createattribute
         */
        createAttribute: function(name) {
          if (!g.QName_exact.test(name)) {
            throw new DOMException(DOMException.INVALID_CHARACTER_ERR, 'invalid character in name "' + name + '"');
          }
          if (this.type === "html") {
            name = name.toLowerCase();
          }
          return this._createAttribute(name);
        },
        _createAttribute: function(name) {
          var node = new Attr(PDC);
          node.ownerDocument = this;
          node.childNodes = new NodeList();
          node.name = name;
          node.nodeName = name;
          node.localName = name;
          node.specified = true;
          return node;
        },
        /**
         * Creates an EntityReference object.
         * The current implementation does not fill the `childNodes` with those of the corresponding
         * `Entity`
         *
         * The `name` is validated against the XML `Name` production at creation time; an invalid name
         * throws `InvalidCharacterError`. When the resulting node is serialized with
         * `requireWellFormed: true`, the serializer re-validates `nodeName` against the XML `Name`
         * production and throws `InvalidStateError` if a later `nodeName` mutation made it invalid;
         * without that option the name is emitted verbatim.
         *
         * __This implementation differs from the specification:__ xmldom does not expand entities —
         * the parser resolves entity references inline and never constructs `EntityReference` nodes,
         * so this method is the only producer.
         *
         * @deprecated
         * In DOM Level 4.
         * @param {string} name
         * The name of the entity to reference. No namespace well-formedness checks are performed.
         * @returns {EntityReference}
         * @throws {DOMException}
         * With code `INVALID_CHARACTER_ERR` when `name` is not a valid XML `Name`.
         * @throws {DOMException}
         * with code `NOT_SUPPORTED_ERR` when the document is of type `html`
         * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-392B75AE
         */
        createEntityReference: function(name) {
          if (!g.Name_exact.test(name)) {
            throw new DOMException(DOMException.INVALID_CHARACTER_ERR, 'not a valid xml name "' + name + '"');
          }
          if (this.type === "html") {
            throw new DOMException("document is an html document", DOMExceptionName.NotSupportedError);
          }
          var node = new EntityReference(PDC);
          node.ownerDocument = this;
          node.childNodes = new NodeList();
          node.nodeName = name;
          return node;
        },
        // Introduced in DOM Level 2:
        /**
         * @param {string} namespaceURI
         * @param {string} qualifiedName
         * @returns {Element}
         */
        createElementNS: function(namespaceURI, qualifiedName) {
          var validated = validateAndExtract(namespaceURI, qualifiedName);
          var node = new Element2(PDC);
          var attrs = node.attributes = new NamedNodeMap();
          node.childNodes = new NodeList();
          node.ownerDocument = this;
          node.nodeName = qualifiedName;
          node.tagName = qualifiedName;
          node.namespaceURI = validated[0];
          node.prefix = validated[1];
          node.localName = validated[2];
          attrs._ownerElement = node;
          return node;
        },
        // Introduced in DOM Level 2:
        /**
         * @param {string} namespaceURI
         * @param {string} qualifiedName
         * @returns {Attr}
         */
        createAttributeNS: function(namespaceURI, qualifiedName) {
          var validated = validateAndExtract(namespaceURI, qualifiedName);
          var node = new Attr(PDC);
          node.ownerDocument = this;
          node.childNodes = new NodeList();
          node.nodeName = qualifiedName;
          node.name = qualifiedName;
          node.specified = true;
          node.namespaceURI = validated[0];
          node.prefix = validated[1];
          node.localName = validated[2];
          return node;
        }
      };
      _extends(Document, Node2);
      function Element2(symbol) {
        checkSymbol(symbol);
        this._nsMap = /* @__PURE__ */ Object.create(null);
      }
      Element2.prototype = {
        nodeType: ELEMENT_NODE,
        /**
         * The attributes of this element.
         *
         * @type {NamedNodeMap | null}
         */
        attributes: null,
        getQualifiedName: function() {
          return this.prefix ? this.prefix + ":" + this.localName : this.localName;
        },
        _isInHTMLDocumentAndNamespace: function() {
          return this.ownerDocument.type === "html" && this.namespaceURI === NAMESPACE.HTML;
        },
        /**
         * Implementaton of Level2 Core function hasAttributes.
         *
         * @returns {boolean}
         * True if attribute list is not empty.
         * @see https://www.w3.org/TR/DOM-Level-2-Core/#core-ID-NodeHasAttrs
         */
        hasAttributes: function() {
          return !!(this.attributes && this.attributes.length);
        },
        hasAttribute: function(name) {
          return !!this.getAttributeNode(name);
        },
        /**
         * Returns element’s first attribute whose qualified name is `name`, and `null`
         * if there is no such attribute.
         *
         * @param {string} name
         * @returns {string | null}
         */
        getAttribute: function(name) {
          var attr = this.getAttributeNode(name);
          return attr ? attr.value : null;
        },
        getAttributeNode: function(name) {
          if (this._isInHTMLDocumentAndNamespace()) {
            name = name.toLowerCase();
          }
          return this.attributes.getNamedItem(name);
        },
        /**
         * Sets the value of element’s first attribute whose qualified name is qualifiedName to value.
         *
         * @param {string} name
         * @param {string} value
         */
        setAttribute: function(name, value) {
          if (this._isInHTMLDocumentAndNamespace()) {
            name = name.toLowerCase();
          }
          var attr = this.getAttributeNode(name);
          if (attr) {
            attr.value = attr.nodeValue = "" + value;
          } else {
            attr = this.ownerDocument._createAttribute(name);
            attr.value = attr.nodeValue = "" + value;
            this.setAttributeNode(attr);
          }
        },
        removeAttribute: function(name) {
          var attr = this.getAttributeNode(name);
          attr && this.removeAttributeNode(attr);
        },
        setAttributeNode: function(newAttr) {
          return this.attributes.setNamedItem(newAttr);
        },
        setAttributeNodeNS: function(newAttr) {
          return this.attributes.setNamedItemNS(newAttr);
        },
        removeAttributeNode: function(oldAttr) {
          return this.attributes.removeNamedItem(oldAttr.nodeName);
        },
        //get real attribute name,and remove it by removeAttributeNode
        removeAttributeNS: function(namespaceURI, localName) {
          var old = this.getAttributeNodeNS(namespaceURI, localName);
          old && this.removeAttributeNode(old);
        },
        hasAttributeNS: function(namespaceURI, localName) {
          return this.getAttributeNodeNS(namespaceURI, localName) != null;
        },
        /**
         * Returns element’s attribute whose namespace is `namespaceURI` and local name is
         * `localName`,
         * or `null` if there is no such attribute.
         *
         * @param {string} namespaceURI
         * @param {string} localName
         * @returns {string | null}
         */
        getAttributeNS: function(namespaceURI, localName) {
          var attr = this.getAttributeNodeNS(namespaceURI, localName);
          return attr ? attr.value : null;
        },
        /**
         * Sets the value of element’s attribute whose namespace is `namespaceURI` and local name is
         * `localName` to value.
         *
         * @param {string} namespaceURI
         * @param {string} qualifiedName
         * @param {string} value
         * @see https://dom.spec.whatwg.org/#dom-element-setattributens
         */
        setAttributeNS: function(namespaceURI, qualifiedName, value) {
          var validated = validateAndExtract(namespaceURI, qualifiedName);
          var localName = validated[2];
          var attr = this.getAttributeNodeNS(namespaceURI, localName);
          if (attr) {
            attr.value = attr.nodeValue = "" + value;
          } else {
            attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
            attr.value = attr.nodeValue = "" + value;
            this.setAttributeNode(attr);
          }
        },
        getAttributeNodeNS: function(namespaceURI, localName) {
          return this.attributes.getNamedItemNS(namespaceURI, localName);
        },
        /**
         * Returns a LiveNodeList of all child elements which have **all** of the given class name(s).
         *
         * Returns an empty list if `classNames` is an empty string or only contains HTML white space
         * characters.
         *
         * Warning: This returns a live LiveNodeList.
         * Changes in the DOM will reflect in the array as the changes occur.
         * If an element selected by this array no longer qualifies for the selector,
         * it will automatically be removed. Be aware of this for iteration purposes.
         *
         * @param {string} classNames
         * Is a string representing the class name(s) to match; multiple class names are separated by
         * (ASCII-)whitespace.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
         * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
         */
        getElementsByClassName: function(classNames) {
          var classNamesSet = toOrderedSet(classNames);
          return new LiveNodeList(this, function(base) {
            var ls = [];
            if (classNamesSet.length > 0) {
              _visitNode(base, function(node) {
                if (node !== base && node.nodeType === ELEMENT_NODE) {
                  var nodeClassNames = node.getAttribute("class");
                  if (nodeClassNames) {
                    var matches = classNames === nodeClassNames;
                    if (!matches) {
                      var nodeClassNamesSet = toOrderedSet(nodeClassNames);
                      matches = classNamesSet.every(arrayIncludes(nodeClassNamesSet));
                    }
                    if (matches) {
                      ls.push(node);
                    }
                  }
                }
              });
            }
            return ls;
          });
        },
        /**
         * Returns a LiveNodeList of elements with the given qualifiedName.
         * Searching for all descendants can be done by passing `*` as `qualifiedName`.
         *
         * All descendants of the specified element are searched, but not the element itself.
         * The returned list is live, which means it updates itself with the DOM tree automatically.
         * Therefore, there is no need to call `Element.getElementsByTagName()`
         * with the same element and arguments repeatedly if the DOM changes in between calls.
         *
         * When called on an HTML element in an HTML document,
         * `getElementsByTagName` lower-cases the argument before searching for it.
         * This is undesirable when trying to match camel-cased SVG elements (such as
         * `<linearGradient>`) in an HTML document.
         * Instead, use `Element.getElementsByTagNameNS()`,
         * which preserves the capitalization of the tag name.
         *
         * `Element.getElementsByTagName` is similar to `Document.getElementsByTagName()`,
         * except that it only searches for elements that are descendants of the specified element.
         *
         * @param {string} qualifiedName
         * @returns {LiveNodeList}
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName
         * @see https://dom.spec.whatwg.org/#concept-getelementsbytagname
         */
        getElementsByTagName: function(qualifiedName) {
          var isHTMLDocument = (this.nodeType === DOCUMENT_NODE ? this : this.ownerDocument).type === "html";
          var lowerQualifiedName = qualifiedName.toLowerCase();
          return new LiveNodeList(this, function(base) {
            var ls = [];
            _visitNode(base, function(node) {
              if (node === base || node.nodeType !== ELEMENT_NODE) {
                return;
              }
              if (qualifiedName === "*") {
                ls.push(node);
              } else {
                var nodeQualifiedName = node.getQualifiedName();
                var matchingQName = isHTMLDocument && node.namespaceURI === NAMESPACE.HTML ? lowerQualifiedName : qualifiedName;
                if (nodeQualifiedName === matchingQName) {
                  ls.push(node);
                }
              }
            });
            return ls;
          });
        },
        getElementsByTagNameNS: function(namespaceURI, localName) {
          return new LiveNodeList(this, function(base) {
            var ls = [];
            _visitNode(base, function(node) {
              if (node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === "*" || node.namespaceURI === namespaceURI) && (localName === "*" || node.localName == localName)) {
                ls.push(node);
              }
            });
            return ls;
          });
        }
      };
      Document.prototype.getElementsByClassName = Element2.prototype.getElementsByClassName;
      Document.prototype.getElementsByTagName = Element2.prototype.getElementsByTagName;
      Document.prototype.getElementsByTagNameNS = Element2.prototype.getElementsByTagNameNS;
      _extends(Element2, Node2);
      function Attr(symbol) {
        checkSymbol(symbol);
        this.namespaceURI = null;
        this.prefix = null;
        this.ownerElement = null;
      }
      Attr.prototype.nodeType = ATTRIBUTE_NODE;
      _extends(Attr, Node2);
      function CharacterData(symbol) {
        checkSymbol(symbol);
      }
      CharacterData.prototype = {
        data: "",
        substringData: function(offset, count) {
          return this.data.substring(offset, offset + count);
        },
        appendData: function(text) {
          text = this.data + text;
          this.nodeValue = this.data = text;
          this.length = text.length;
        },
        insertData: function(offset, text) {
          this.replaceData(offset, 0, text);
        },
        deleteData: function(offset, count) {
          this.replaceData(offset, count, "");
        },
        replaceData: function(offset, count, text) {
          var start = this.data.substring(0, offset);
          var end = this.data.substring(offset + count);
          text = start + text + end;
          this.nodeValue = this.data = text;
          this.length = text.length;
        }
      };
      _extends(CharacterData, Node2);
      function Text(symbol) {
        checkSymbol(symbol);
      }
      Text.prototype = {
        nodeName: "#text",
        nodeType: TEXT_NODE,
        splitText: function(offset) {
          var text = this.data;
          var newText = text.substring(offset);
          text = text.substring(0, offset);
          this.data = this.nodeValue = text;
          this.length = text.length;
          var newNode = this.ownerDocument.createTextNode(newText);
          if (this.parentNode) {
            this.parentNode.insertBefore(newNode, this.nextSibling);
          }
          return newNode;
        }
      };
      _extends(Text, CharacterData);
      function Comment(symbol) {
        checkSymbol(symbol);
      }
      Comment.prototype = {
        nodeName: "#comment",
        nodeType: COMMENT_NODE
      };
      _extends(Comment, CharacterData);
      function CDATASection(symbol) {
        checkSymbol(symbol);
      }
      CDATASection.prototype = {
        nodeName: "#cdata-section",
        nodeType: CDATA_SECTION_NODE
      };
      _extends(CDATASection, Text);
      function DocumentType(symbol) {
        checkSymbol(symbol);
      }
      DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
      _extends(DocumentType, Node2);
      function Notation(symbol) {
        checkSymbol(symbol);
      }
      Notation.prototype.nodeType = NOTATION_NODE;
      _extends(Notation, Node2);
      function Entity(symbol) {
        checkSymbol(symbol);
      }
      Entity.prototype.nodeType = ENTITY_NODE;
      _extends(Entity, Node2);
      function EntityReference(symbol) {
        checkSymbol(symbol);
      }
      EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
      _extends(EntityReference, Node2);
      function DocumentFragment(symbol) {
        checkSymbol(symbol);
      }
      DocumentFragment.prototype.nodeName = "#document-fragment";
      DocumentFragment.prototype.nodeType = DOCUMENT_FRAGMENT_NODE;
      _extends(DocumentFragment, Node2);
      function ProcessingInstruction(symbol) {
        checkSymbol(symbol);
      }
      ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
      _extends(ProcessingInstruction, CharacterData);
      function XMLSerializer() {
      }
      XMLSerializer.prototype.serializeToString = function(node, options) {
        return nodeSerializeToString.call(node, options);
      };
      Node2.prototype.toString = nodeSerializeToString;
      function nodeSerializeToString(options) {
        var opts;
        if (typeof options === "function") {
          opts = { requireWellFormed: false, splitCDATASections: true, nodeFilter: options };
        } else if (options != null) {
          opts = {
            requireWellFormed: !!options.requireWellFormed,
            splitCDATASections: options.splitCDATASections !== false,
            nodeFilter: options.nodeFilter || null
          };
        } else {
          opts = { requireWellFormed: false, splitCDATASections: true, nodeFilter: null };
        }
        var buf = [];
        var refNode = this.nodeType === DOCUMENT_NODE && this.documentElement || this;
        var prefix = refNode.prefix;
        var uri = refNode.namespaceURI;
        if (uri && prefix == null) {
          var prefix = refNode.lookupPrefix(uri);
          if (prefix == null) {
            var visibleNamespaces = [
              { namespace: uri, prefix: null }
              //{namespace:uri,prefix:''}
            ];
          }
        }
        serializeToString(this, buf, visibleNamespaces, opts);
        return buf.join("");
      }
      function needNamespaceDefine(node, isHTML, visibleNamespaces) {
        var prefix = node.prefix || "";
        var uri = node.namespaceURI;
        if (!uri) {
          return false;
        }
        if (prefix === "xml" && uri === NAMESPACE.XML || uri === NAMESPACE.XMLNS) {
          return false;
        }
        var i = visibleNamespaces.length;
        while (i--) {
          var ns = visibleNamespaces[i];
          if (ns.prefix === prefix) {
            return ns.namespace !== uri;
          }
        }
        return true;
      }
      function addSerializedAttribute(buf, qualifiedName, value, requireWellFormed) {
        if (requireWellFormed && !g.QName_exact.test(qualifiedName)) {
          throw new DOMException(
            'The attribute name "' + qualifiedName + '" is not a valid XML QName',
            DOMExceptionName.InvalidStateError
          );
        }
        buf.push(" ", qualifiedName, '="', value.replace(/[<>&"\t\n\r]/g, _xmlEncoder), '"');
      }
      function serializeToString(node, buf, visibleNamespaces, opts) {
        if (!visibleNamespaces) {
          visibleNamespaces = [];
        }
        var nodeFilter = opts.nodeFilter;
        var requireWellFormed = opts.requireWellFormed;
        var splitCDATASections = opts.splitCDATASections;
        var doc = node.nodeType === DOCUMENT_NODE ? node : node.ownerDocument;
        var isHTML = doc.type === "html";
        walkDOM(
          node,
          { ns: visibleNamespaces },
          {
            enter: function(n, ctx) {
              var namespaces = ctx.ns;
              if (nodeFilter) {
                n = nodeFilter(n);
                if (n) {
                  if (typeof n == "string") {
                    buf.push(n);
                    return null;
                  }
                } else {
                  return null;
                }
              }
              switch (n.nodeType) {
                case ELEMENT_NODE:
                  var attrs = n.attributes;
                  var len = attrs.length;
                  var nodeName = n.tagName;
                  var prefixedNodeName = nodeName;
                  if (!isHTML && !n.prefix && n.namespaceURI) {
                    var defaultNS;
                    for (var ai = 0; ai < attrs.length; ai++) {
                      if (attrs.item(ai).name === "xmlns") {
                        defaultNS = attrs.item(ai).value;
                        break;
                      }
                    }
                    if (!defaultNS) {
                      for (var nsi = namespaces.length - 1; nsi >= 0; nsi--) {
                        var nsEntry = namespaces[nsi];
                        if (nsEntry.prefix === "" && nsEntry.namespace === n.namespaceURI) {
                          defaultNS = nsEntry.namespace;
                          break;
                        }
                      }
                    }
                    if (defaultNS !== n.namespaceURI) {
                      for (var nsi = namespaces.length - 1; nsi >= 0; nsi--) {
                        var nsEntry = namespaces[nsi];
                        if (nsEntry.namespace === n.namespaceURI) {
                          if (nsEntry.prefix) {
                            prefixedNodeName = nsEntry.prefix + ":" + nodeName;
                          }
                          break;
                        }
                      }
                    }
                  }
                  if (requireWellFormed && !g.QName_exact.test(prefixedNodeName)) {
                    throw new DOMException(
                      'The element name "' + prefixedNodeName + '" is not a valid XML QName',
                      DOMExceptionName.InvalidStateError
                    );
                  }
                  buf.push("<", prefixedNodeName);
                  var childNamespaces = namespaces.slice();
                  for (var i = 0; i < len; i++) {
                    var attr = attrs.item(i);
                    if (attr.prefix == "xmlns") {
                      childNamespaces.push({
                        prefix: attr.localName,
                        namespace: attr.value
                      });
                    } else if (attr.nodeName == "xmlns") {
                      childNamespaces.push({ prefix: "", namespace: attr.value });
                    }
                  }
                  for (var i = 0; i < len; i++) {
                    var attr = attrs.item(i);
                    if (needNamespaceDefine(attr, isHTML, childNamespaces)) {
                      var attrPrefix = attr.prefix || "";
                      var uri = attr.namespaceURI;
                      addSerializedAttribute(buf, attrPrefix ? "xmlns:" + attrPrefix : "xmlns", uri, requireWellFormed);
                      childNamespaces.push({ prefix: attrPrefix, namespace: uri });
                    }
                    var filteredAttr = nodeFilter ? nodeFilter(attr) : attr;
                    if (filteredAttr) {
                      if (typeof filteredAttr === "string") {
                        buf.push(filteredAttr);
                      } else {
                        addSerializedAttribute(buf, filteredAttr.name, filteredAttr.value, requireWellFormed);
                      }
                    }
                  }
                  if (nodeName === prefixedNodeName && needNamespaceDefine(n, isHTML, childNamespaces)) {
                    var nodePrefix = n.prefix || "";
                    var uri = n.namespaceURI;
                    addSerializedAttribute(buf, nodePrefix ? "xmlns:" + nodePrefix : "xmlns", uri, requireWellFormed);
                    childNamespaces.push({ prefix: nodePrefix, namespace: uri });
                  }
                  var canCloseTag = !n.firstChild;
                  if (canCloseTag && (isHTML || n.namespaceURI === NAMESPACE.HTML)) {
                    canCloseTag = isHTMLVoidElement(nodeName);
                  }
                  if (canCloseTag) {
                    buf.push("/>");
                    return null;
                  }
                  buf.push(">");
                  if (isHTML && isHTMLRawTextElement(nodeName)) {
                    var child = n.firstChild;
                    while (child) {
                      if (child.data) {
                        buf.push(child.data);
                      } else {
                        serializeToString(child, buf, childNamespaces.slice(), opts);
                      }
                      child = child.nextSibling;
                    }
                    buf.push("</", prefixedNodeName, ">");
                    return null;
                  }
                  return { ns: childNamespaces, tag: prefixedNodeName };
                case DOCUMENT_NODE:
                case DOCUMENT_FRAGMENT_NODE:
                  if (requireWellFormed && n.nodeType === DOCUMENT_NODE && n.documentElement == null) {
                    throw new DOMException("The Document has no documentElement", DOMExceptionName.InvalidStateError);
                  }
                  return { ns: namespaces };
                case ATTRIBUTE_NODE:
                  addSerializedAttribute(buf, n.name, n.value, requireWellFormed);
                  return null;
                case TEXT_NODE:
                  if (requireWellFormed && g.InvalidChar.test(n.data)) {
                    throw new DOMException(
                      "The Text node data contains characters outside the XML Char production",
                      DOMExceptionName.InvalidStateError
                    );
                  }
                  buf.push(n.data.replace(/[<&>]/g, _xmlEncoder));
                  return null;
                case CDATA_SECTION_NODE:
                  if (requireWellFormed && n.data.indexOf("]]>") !== -1) {
                    throw new DOMException('The CDATASection data contains "]]>"', DOMExceptionName.InvalidStateError);
                  }
                  if (splitCDATASections) {
                    buf.push(g.CDATA_START, n.data.replace(/]]>/g, "]]]]><![CDATA[>"), g.CDATA_END);
                  } else {
                    buf.push(g.CDATA_START, n.data, g.CDATA_END);
                  }
                  return null;
                case COMMENT_NODE:
                  if (requireWellFormed) {
                    if (g.InvalidChar.test(n.data)) {
                      throw new DOMException(
                        "The comment node data contains characters outside the XML Char production",
                        DOMExceptionName.InvalidStateError
                      );
                    }
                    if (n.data.indexOf("--") !== -1 || n.data[n.data.length - 1] === "-") {
                      throw new DOMException(
                        'The comment node data contains "--" or ends with "-"',
                        DOMExceptionName.InvalidStateError
                      );
                    }
                  }
                  buf.push(g.COMMENT_START, n.data, g.COMMENT_END);
                  return null;
                case DOCUMENT_TYPE_NODE:
                  var pubid = n.publicId;
                  var sysid = n.systemId;
                  if (requireWellFormed) {
                    if (!g.Name_exact.test(n.name)) {
                      throw new DOMException(
                        'The doctype name "' + n.name + '" is not a valid XML Name',
                        DOMExceptionName.InvalidStateError
                      );
                    }
                    if (pubid && !g.PubidLiteral_match.test(pubid)) {
                      throw new DOMException("DocumentType publicId is not a valid PubidLiteral", DOMExceptionName.InvalidStateError);
                    }
                    if (sysid && sysid !== "." && !g.SystemLiteral_match.test(sysid)) {
                      throw new DOMException("DocumentType systemId is not a valid SystemLiteral", DOMExceptionName.InvalidStateError);
                    }
                    if (n.internalSubset && n.internalSubset.indexOf("]>") !== -1) {
                      throw new DOMException('DocumentType internalSubset contains "]>"', DOMExceptionName.InvalidStateError);
                    }
                  }
                  buf.push(g.DOCTYPE_DECL_START, " ", n.name);
                  if (pubid) {
                    buf.push(" ", g.PUBLIC, " ", pubid);
                    if (sysid && sysid !== ".") {
                      buf.push(" ", sysid);
                    }
                  } else if (sysid && sysid !== ".") {
                    buf.push(" ", g.SYSTEM, " ", sysid);
                  }
                  if (n.internalSubset) {
                    buf.push(" [", n.internalSubset, "]");
                  }
                  buf.push(">");
                  return null;
                case PROCESSING_INSTRUCTION_NODE:
                  if (requireWellFormed) {
                    if (!g.NCName_exact.test(n.target) || n.target.toLowerCase() === "xml") {
                      throw new DOMException(
                        'The processing instruction target "' + n.target + '" is not a valid XML NCName or is reserved',
                        DOMExceptionName.InvalidStateError
                      );
                    }
                    if (g.InvalidChar.test(n.data)) {
                      throw new DOMException(
                        "The ProcessingInstruction data contains characters outside the XML Char production",
                        DOMExceptionName.InvalidStateError
                      );
                    }
                    if (n.data.indexOf("?>") !== -1) {
                      throw new DOMException('The ProcessingInstruction data contains "?>"', DOMExceptionName.InvalidStateError);
                    }
                  }
                  buf.push("<?", n.target, " ", n.data, "?>");
                  return null;
                case ENTITY_REFERENCE_NODE:
                  if (requireWellFormed && !g.Name_exact.test(n.nodeName)) {
                    throw new DOMException(
                      'The entity reference name "' + n.nodeName + '" is not a valid XML Name',
                      DOMExceptionName.InvalidStateError
                    );
                  }
                  buf.push("&", n.nodeName, ";");
                  return null;
                //case ENTITY_NODE:
                //case NOTATION_NODE:
                default:
                  buf.push("??", n.nodeName);
                  return null;
              }
            },
            exit: function(n, childCtx) {
              if (childCtx && childCtx.tag) {
                buf.push("</", childCtx.tag, ">");
              }
            }
          }
        );
      }
      function importNode(doc, node, deep) {
        var destRoot;
        walkDOM(node, null, {
          enter: function(srcNode, destParent) {
            var destNode = srcNode.cloneNode(false);
            destNode.ownerDocument = doc;
            destNode.parentNode = null;
            if (destParent === null) {
              destRoot = destNode;
            } else {
              destParent.appendChild(destNode);
            }
            var shouldDeep = srcNode.nodeType === ATTRIBUTE_NODE || deep;
            return shouldDeep ? destNode : null;
          }
        });
        return destRoot;
      }
      function cloneNode(doc, node, deep) {
        var destRoot;
        walkDOM(node, null, {
          enter: function(srcNode, destParent) {
            var destNode = new srcNode.constructor(PDC);
            for (var n in srcNode) {
              if (hasOwn(srcNode, n)) {
                var v = srcNode[n];
                if (typeof v != "object") {
                  if (v != destNode[n]) {
                    destNode[n] = v;
                  }
                }
              }
            }
            if (srcNode.childNodes) {
              destNode.childNodes = new NodeList();
            }
            destNode.ownerDocument = doc;
            var shouldDeep = deep;
            switch (destNode.nodeType) {
              case ELEMENT_NODE:
                var attrs = srcNode.attributes;
                var attrs2 = destNode.attributes = new NamedNodeMap();
                var len = attrs.length;
                attrs2._ownerElement = destNode;
                for (var i = 0; i < len; i++) {
                  destNode.setAttributeNode(cloneNode(doc, attrs.item(i), true));
                }
                break;
              case ATTRIBUTE_NODE:
                shouldDeep = true;
            }
            if (destParent !== null) {
              destParent.appendChild(destNode);
            } else {
              destRoot = destNode;
            }
            return shouldDeep ? destNode : null;
          }
        });
        return destRoot;
      }
      function __set__(object, key, value) {
        object[key] = value;
      }
      function childrenRefresh(node) {
        var ls = [];
        var child = node.firstChild;
        while (child) {
          if (child.nodeType === ELEMENT_NODE) {
            ls.push(child);
          }
          child = child.nextSibling;
        }
        return ls;
      }
      try {
        if (Object.defineProperty) {
          Object.defineProperty(LiveNodeList.prototype, "length", {
            get: function() {
              _updateLiveList(this);
              return this.$$length;
            }
          });
          Object.defineProperty(Node2.prototype, "textContent", {
            get: function() {
              if (this.nodeType === ELEMENT_NODE || this.nodeType === DOCUMENT_FRAGMENT_NODE) {
                var buf = [];
                walkDOM(this, null, {
                  enter: function(n) {
                    if (n.nodeType === ELEMENT_NODE || n.nodeType === DOCUMENT_FRAGMENT_NODE) {
                      return true;
                    }
                    if (n.nodeType === PROCESSING_INSTRUCTION_NODE || n.nodeType === COMMENT_NODE) {
                      return null;
                    }
                    buf.push(n.nodeValue);
                  }
                });
                return buf.join("");
              }
              return this.nodeValue;
            },
            set: function(data) {
              switch (this.nodeType) {
                case ELEMENT_NODE:
                case DOCUMENT_FRAGMENT_NODE:
                  while (this.firstChild) {
                    this.removeChild(this.firstChild);
                  }
                  if (data || String(data)) {
                    this.appendChild(this.ownerDocument.createTextNode(data));
                  }
                  break;
                default:
                  this.data = data;
                  this.value = data;
                  this.nodeValue = data;
              }
            }
          });
          Object.defineProperty(CharacterData.prototype, "data", {
            get: function() {
              return this._data != null ? this._data : "";
            },
            set: function(v) {
              this._data = v;
              this.length = typeof v === "string" ? v.length : 0;
            }
          });
          Object.defineProperty(CharacterData.prototype, "nodeValue", {
            get: function() {
              return this.data;
            },
            set: function(v) {
              this.data = v;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(Element2.prototype, "children", {
            get: function() {
              return new LiveNodeList(this, childrenRefresh);
            }
          });
          Object.defineProperty(Document.prototype, "children", {
            get: function() {
              return new LiveNodeList(this, childrenRefresh);
            }
          });
          Object.defineProperty(DocumentFragment.prototype, "children", {
            get: function() {
              return new LiveNodeList(this, childrenRefresh);
            }
          });
          __set__ = function(object, key, value) {
            object["$$" + key] = value;
          };
        }
      } catch (e) {
      }
      exports._updateLiveList = _updateLiveList;
      exports.Attr = Attr;
      exports.CDATASection = CDATASection;
      exports.CharacterData = CharacterData;
      exports.Comment = Comment;
      exports.Document = Document;
      exports.DocumentFragment = DocumentFragment;
      exports.DocumentType = DocumentType;
      exports.DOMImplementation = DOMImplementation;
      exports.Element = Element2;
      exports.Entity = Entity;
      exports.EntityReference = EntityReference;
      exports.LiveNodeList = LiveNodeList;
      exports.NamedNodeMap = NamedNodeMap;
      exports.Node = Node2;
      exports.NodeList = NodeList;
      exports.Notation = Notation;
      exports.Text = Text;
      exports.ProcessingInstruction = ProcessingInstruction;
      exports.walkDOM = walkDOM;
      exports.XMLSerializer = XMLSerializer;
    }
  });

  // node_modules/.pnpm/@xmldom+xmldom@0.9.12/node_modules/@xmldom/xmldom/lib/entities.js
  var require_entities = __commonJS({
    "node_modules/.pnpm/@xmldom+xmldom@0.9.12/node_modules/@xmldom/xmldom/lib/entities.js"(exports) {
      "use strict";
      var freeze = require_conventions().freeze;
      exports.XML_ENTITIES = freeze({
        amp: "&",
        apos: "'",
        gt: ">",
        lt: "<",
        quot: '"'
      });
      exports.HTML_ENTITIES = freeze({
        Aacute: "\xC1",
        aacute: "\xE1",
        Abreve: "\u0102",
        abreve: "\u0103",
        ac: "\u223E",
        acd: "\u223F",
        acE: "\u223E\u0333",
        Acirc: "\xC2",
        acirc: "\xE2",
        acute: "\xB4",
        Acy: "\u0410",
        acy: "\u0430",
        AElig: "\xC6",
        aelig: "\xE6",
        af: "\u2061",
        Afr: "\u{1D504}",
        afr: "\u{1D51E}",
        Agrave: "\xC0",
        agrave: "\xE0",
        alefsym: "\u2135",
        aleph: "\u2135",
        Alpha: "\u0391",
        alpha: "\u03B1",
        Amacr: "\u0100",
        amacr: "\u0101",
        amalg: "\u2A3F",
        AMP: "&",
        amp: "&",
        And: "\u2A53",
        and: "\u2227",
        andand: "\u2A55",
        andd: "\u2A5C",
        andslope: "\u2A58",
        andv: "\u2A5A",
        ang: "\u2220",
        ange: "\u29A4",
        angle: "\u2220",
        angmsd: "\u2221",
        angmsdaa: "\u29A8",
        angmsdab: "\u29A9",
        angmsdac: "\u29AA",
        angmsdad: "\u29AB",
        angmsdae: "\u29AC",
        angmsdaf: "\u29AD",
        angmsdag: "\u29AE",
        angmsdah: "\u29AF",
        angrt: "\u221F",
        angrtvb: "\u22BE",
        angrtvbd: "\u299D",
        angsph: "\u2222",
        angst: "\xC5",
        angzarr: "\u237C",
        Aogon: "\u0104",
        aogon: "\u0105",
        Aopf: "\u{1D538}",
        aopf: "\u{1D552}",
        ap: "\u2248",
        apacir: "\u2A6F",
        apE: "\u2A70",
        ape: "\u224A",
        apid: "\u224B",
        apos: "'",
        ApplyFunction: "\u2061",
        approx: "\u2248",
        approxeq: "\u224A",
        Aring: "\xC5",
        aring: "\xE5",
        Ascr: "\u{1D49C}",
        ascr: "\u{1D4B6}",
        Assign: "\u2254",
        ast: "*",
        asymp: "\u2248",
        asympeq: "\u224D",
        Atilde: "\xC3",
        atilde: "\xE3",
        Auml: "\xC4",
        auml: "\xE4",
        awconint: "\u2233",
        awint: "\u2A11",
        backcong: "\u224C",
        backepsilon: "\u03F6",
        backprime: "\u2035",
        backsim: "\u223D",
        backsimeq: "\u22CD",
        Backslash: "\u2216",
        Barv: "\u2AE7",
        barvee: "\u22BD",
        Barwed: "\u2306",
        barwed: "\u2305",
        barwedge: "\u2305",
        bbrk: "\u23B5",
        bbrktbrk: "\u23B6",
        bcong: "\u224C",
        Bcy: "\u0411",
        bcy: "\u0431",
        bdquo: "\u201E",
        becaus: "\u2235",
        Because: "\u2235",
        because: "\u2235",
        bemptyv: "\u29B0",
        bepsi: "\u03F6",
        bernou: "\u212C",
        Bernoullis: "\u212C",
        Beta: "\u0392",
        beta: "\u03B2",
        beth: "\u2136",
        between: "\u226C",
        Bfr: "\u{1D505}",
        bfr: "\u{1D51F}",
        bigcap: "\u22C2",
        bigcirc: "\u25EF",
        bigcup: "\u22C3",
        bigodot: "\u2A00",
        bigoplus: "\u2A01",
        bigotimes: "\u2A02",
        bigsqcup: "\u2A06",
        bigstar: "\u2605",
        bigtriangledown: "\u25BD",
        bigtriangleup: "\u25B3",
        biguplus: "\u2A04",
        bigvee: "\u22C1",
        bigwedge: "\u22C0",
        bkarow: "\u290D",
        blacklozenge: "\u29EB",
        blacksquare: "\u25AA",
        blacktriangle: "\u25B4",
        blacktriangledown: "\u25BE",
        blacktriangleleft: "\u25C2",
        blacktriangleright: "\u25B8",
        blank: "\u2423",
        blk12: "\u2592",
        blk14: "\u2591",
        blk34: "\u2593",
        block: "\u2588",
        bne: "=\u20E5",
        bnequiv: "\u2261\u20E5",
        bNot: "\u2AED",
        bnot: "\u2310",
        Bopf: "\u{1D539}",
        bopf: "\u{1D553}",
        bot: "\u22A5",
        bottom: "\u22A5",
        bowtie: "\u22C8",
        boxbox: "\u29C9",
        boxDL: "\u2557",
        boxDl: "\u2556",
        boxdL: "\u2555",
        boxdl: "\u2510",
        boxDR: "\u2554",
        boxDr: "\u2553",
        boxdR: "\u2552",
        boxdr: "\u250C",
        boxH: "\u2550",
        boxh: "\u2500",
        boxHD: "\u2566",
        boxHd: "\u2564",
        boxhD: "\u2565",
        boxhd: "\u252C",
        boxHU: "\u2569",
        boxHu: "\u2567",
        boxhU: "\u2568",
        boxhu: "\u2534",
        boxminus: "\u229F",
        boxplus: "\u229E",
        boxtimes: "\u22A0",
        boxUL: "\u255D",
        boxUl: "\u255C",
        boxuL: "\u255B",
        boxul: "\u2518",
        boxUR: "\u255A",
        boxUr: "\u2559",
        boxuR: "\u2558",
        boxur: "\u2514",
        boxV: "\u2551",
        boxv: "\u2502",
        boxVH: "\u256C",
        boxVh: "\u256B",
        boxvH: "\u256A",
        boxvh: "\u253C",
        boxVL: "\u2563",
        boxVl: "\u2562",
        boxvL: "\u2561",
        boxvl: "\u2524",
        boxVR: "\u2560",
        boxVr: "\u255F",
        boxvR: "\u255E",
        boxvr: "\u251C",
        bprime: "\u2035",
        Breve: "\u02D8",
        breve: "\u02D8",
        brvbar: "\xA6",
        Bscr: "\u212C",
        bscr: "\u{1D4B7}",
        bsemi: "\u204F",
        bsim: "\u223D",
        bsime: "\u22CD",
        bsol: "\\",
        bsolb: "\u29C5",
        bsolhsub: "\u27C8",
        bull: "\u2022",
        bullet: "\u2022",
        bump: "\u224E",
        bumpE: "\u2AAE",
        bumpe: "\u224F",
        Bumpeq: "\u224E",
        bumpeq: "\u224F",
        Cacute: "\u0106",
        cacute: "\u0107",
        Cap: "\u22D2",
        cap: "\u2229",
        capand: "\u2A44",
        capbrcup: "\u2A49",
        capcap: "\u2A4B",
        capcup: "\u2A47",
        capdot: "\u2A40",
        CapitalDifferentialD: "\u2145",
        caps: "\u2229\uFE00",
        caret: "\u2041",
        caron: "\u02C7",
        Cayleys: "\u212D",
        ccaps: "\u2A4D",
        Ccaron: "\u010C",
        ccaron: "\u010D",
        Ccedil: "\xC7",
        ccedil: "\xE7",
        Ccirc: "\u0108",
        ccirc: "\u0109",
        Cconint: "\u2230",
        ccups: "\u2A4C",
        ccupssm: "\u2A50",
        Cdot: "\u010A",
        cdot: "\u010B",
        cedil: "\xB8",
        Cedilla: "\xB8",
        cemptyv: "\u29B2",
        cent: "\xA2",
        CenterDot: "\xB7",
        centerdot: "\xB7",
        Cfr: "\u212D",
        cfr: "\u{1D520}",
        CHcy: "\u0427",
        chcy: "\u0447",
        check: "\u2713",
        checkmark: "\u2713",
        Chi: "\u03A7",
        chi: "\u03C7",
        cir: "\u25CB",
        circ: "\u02C6",
        circeq: "\u2257",
        circlearrowleft: "\u21BA",
        circlearrowright: "\u21BB",
        circledast: "\u229B",
        circledcirc: "\u229A",
        circleddash: "\u229D",
        CircleDot: "\u2299",
        circledR: "\xAE",
        circledS: "\u24C8",
        CircleMinus: "\u2296",
        CirclePlus: "\u2295",
        CircleTimes: "\u2297",
        cirE: "\u29C3",
        cire: "\u2257",
        cirfnint: "\u2A10",
        cirmid: "\u2AEF",
        cirscir: "\u29C2",
        ClockwiseContourIntegral: "\u2232",
        CloseCurlyDoubleQuote: "\u201D",
        CloseCurlyQuote: "\u2019",
        clubs: "\u2663",
        clubsuit: "\u2663",
        Colon: "\u2237",
        colon: ":",
        Colone: "\u2A74",
        colone: "\u2254",
        coloneq: "\u2254",
        comma: ",",
        commat: "@",
        comp: "\u2201",
        compfn: "\u2218",
        complement: "\u2201",
        complexes: "\u2102",
        cong: "\u2245",
        congdot: "\u2A6D",
        Congruent: "\u2261",
        Conint: "\u222F",
        conint: "\u222E",
        ContourIntegral: "\u222E",
        Copf: "\u2102",
        copf: "\u{1D554}",
        coprod: "\u2210",
        Coproduct: "\u2210",
        COPY: "\xA9",
        copy: "\xA9",
        copysr: "\u2117",
        CounterClockwiseContourIntegral: "\u2233",
        crarr: "\u21B5",
        Cross: "\u2A2F",
        cross: "\u2717",
        Cscr: "\u{1D49E}",
        cscr: "\u{1D4B8}",
        csub: "\u2ACF",
        csube: "\u2AD1",
        csup: "\u2AD0",
        csupe: "\u2AD2",
        ctdot: "\u22EF",
        cudarrl: "\u2938",
        cudarrr: "\u2935",
        cuepr: "\u22DE",
        cuesc: "\u22DF",
        cularr: "\u21B6",
        cularrp: "\u293D",
        Cup: "\u22D3",
        cup: "\u222A",
        cupbrcap: "\u2A48",
        CupCap: "\u224D",
        cupcap: "\u2A46",
        cupcup: "\u2A4A",
        cupdot: "\u228D",
        cupor: "\u2A45",
        cups: "\u222A\uFE00",
        curarr: "\u21B7",
        curarrm: "\u293C",
        curlyeqprec: "\u22DE",
        curlyeqsucc: "\u22DF",
        curlyvee: "\u22CE",
        curlywedge: "\u22CF",
        curren: "\xA4",
        curvearrowleft: "\u21B6",
        curvearrowright: "\u21B7",
        cuvee: "\u22CE",
        cuwed: "\u22CF",
        cwconint: "\u2232",
        cwint: "\u2231",
        cylcty: "\u232D",
        Dagger: "\u2021",
        dagger: "\u2020",
        daleth: "\u2138",
        Darr: "\u21A1",
        dArr: "\u21D3",
        darr: "\u2193",
        dash: "\u2010",
        Dashv: "\u2AE4",
        dashv: "\u22A3",
        dbkarow: "\u290F",
        dblac: "\u02DD",
        Dcaron: "\u010E",
        dcaron: "\u010F",
        Dcy: "\u0414",
        dcy: "\u0434",
        DD: "\u2145",
        dd: "\u2146",
        ddagger: "\u2021",
        ddarr: "\u21CA",
        DDotrahd: "\u2911",
        ddotseq: "\u2A77",
        deg: "\xB0",
        Del: "\u2207",
        Delta: "\u0394",
        delta: "\u03B4",
        demptyv: "\u29B1",
        dfisht: "\u297F",
        Dfr: "\u{1D507}",
        dfr: "\u{1D521}",
        dHar: "\u2965",
        dharl: "\u21C3",
        dharr: "\u21C2",
        DiacriticalAcute: "\xB4",
        DiacriticalDot: "\u02D9",
        DiacriticalDoubleAcute: "\u02DD",
        DiacriticalGrave: "`",
        DiacriticalTilde: "\u02DC",
        diam: "\u22C4",
        Diamond: "\u22C4",
        diamond: "\u22C4",
        diamondsuit: "\u2666",
        diams: "\u2666",
        die: "\xA8",
        DifferentialD: "\u2146",
        digamma: "\u03DD",
        disin: "\u22F2",
        div: "\xF7",
        divide: "\xF7",
        divideontimes: "\u22C7",
        divonx: "\u22C7",
        DJcy: "\u0402",
        djcy: "\u0452",
        dlcorn: "\u231E",
        dlcrop: "\u230D",
        dollar: "$",
        Dopf: "\u{1D53B}",
        dopf: "\u{1D555}",
        Dot: "\xA8",
        dot: "\u02D9",
        DotDot: "\u20DC",
        doteq: "\u2250",
        doteqdot: "\u2251",
        DotEqual: "\u2250",
        dotminus: "\u2238",
        dotplus: "\u2214",
        dotsquare: "\u22A1",
        doublebarwedge: "\u2306",
        DoubleContourIntegral: "\u222F",
        DoubleDot: "\xA8",
        DoubleDownArrow: "\u21D3",
        DoubleLeftArrow: "\u21D0",
        DoubleLeftRightArrow: "\u21D4",
        DoubleLeftTee: "\u2AE4",
        DoubleLongLeftArrow: "\u27F8",
        DoubleLongLeftRightArrow: "\u27FA",
        DoubleLongRightArrow: "\u27F9",
        DoubleRightArrow: "\u21D2",
        DoubleRightTee: "\u22A8",
        DoubleUpArrow: "\u21D1",
        DoubleUpDownArrow: "\u21D5",
        DoubleVerticalBar: "\u2225",
        DownArrow: "\u2193",
        Downarrow: "\u21D3",
        downarrow: "\u2193",
        DownArrowBar: "\u2913",
        DownArrowUpArrow: "\u21F5",
        DownBreve: "\u0311",
        downdownarrows: "\u21CA",
        downharpoonleft: "\u21C3",
        downharpoonright: "\u21C2",
        DownLeftRightVector: "\u2950",
        DownLeftTeeVector: "\u295E",
        DownLeftVector: "\u21BD",
        DownLeftVectorBar: "\u2956",
        DownRightTeeVector: "\u295F",
        DownRightVector: "\u21C1",
        DownRightVectorBar: "\u2957",
        DownTee: "\u22A4",
        DownTeeArrow: "\u21A7",
        drbkarow: "\u2910",
        drcorn: "\u231F",
        drcrop: "\u230C",
        Dscr: "\u{1D49F}",
        dscr: "\u{1D4B9}",
        DScy: "\u0405",
        dscy: "\u0455",
        dsol: "\u29F6",
        Dstrok: "\u0110",
        dstrok: "\u0111",
        dtdot: "\u22F1",
        dtri: "\u25BF",
        dtrif: "\u25BE",
        duarr: "\u21F5",
        duhar: "\u296F",
        dwangle: "\u29A6",
        DZcy: "\u040F",
        dzcy: "\u045F",
        dzigrarr: "\u27FF",
        Eacute: "\xC9",
        eacute: "\xE9",
        easter: "\u2A6E",
        Ecaron: "\u011A",
        ecaron: "\u011B",
        ecir: "\u2256",
        Ecirc: "\xCA",
        ecirc: "\xEA",
        ecolon: "\u2255",
        Ecy: "\u042D",
        ecy: "\u044D",
        eDDot: "\u2A77",
        Edot: "\u0116",
        eDot: "\u2251",
        edot: "\u0117",
        ee: "\u2147",
        efDot: "\u2252",
        Efr: "\u{1D508}",
        efr: "\u{1D522}",
        eg: "\u2A9A",
        Egrave: "\xC8",
        egrave: "\xE8",
        egs: "\u2A96",
        egsdot: "\u2A98",
        el: "\u2A99",
        Element: "\u2208",
        elinters: "\u23E7",
        ell: "\u2113",
        els: "\u2A95",
        elsdot: "\u2A97",
        Emacr: "\u0112",
        emacr: "\u0113",
        empty: "\u2205",
        emptyset: "\u2205",
        EmptySmallSquare: "\u25FB",
        emptyv: "\u2205",
        EmptyVerySmallSquare: "\u25AB",
        emsp: "\u2003",
        emsp13: "\u2004",
        emsp14: "\u2005",
        ENG: "\u014A",
        eng: "\u014B",
        ensp: "\u2002",
        Eogon: "\u0118",
        eogon: "\u0119",
        Eopf: "\u{1D53C}",
        eopf: "\u{1D556}",
        epar: "\u22D5",
        eparsl: "\u29E3",
        eplus: "\u2A71",
        epsi: "\u03B5",
        Epsilon: "\u0395",
        epsilon: "\u03B5",
        epsiv: "\u03F5",
        eqcirc: "\u2256",
        eqcolon: "\u2255",
        eqsim: "\u2242",
        eqslantgtr: "\u2A96",
        eqslantless: "\u2A95",
        Equal: "\u2A75",
        equals: "=",
        EqualTilde: "\u2242",
        equest: "\u225F",
        Equilibrium: "\u21CC",
        equiv: "\u2261",
        equivDD: "\u2A78",
        eqvparsl: "\u29E5",
        erarr: "\u2971",
        erDot: "\u2253",
        Escr: "\u2130",
        escr: "\u212F",
        esdot: "\u2250",
        Esim: "\u2A73",
        esim: "\u2242",
        Eta: "\u0397",
        eta: "\u03B7",
        ETH: "\xD0",
        eth: "\xF0",
        Euml: "\xCB",
        euml: "\xEB",
        euro: "\u20AC",
        excl: "!",
        exist: "\u2203",
        Exists: "\u2203",
        expectation: "\u2130",
        ExponentialE: "\u2147",
        exponentiale: "\u2147",
        fallingdotseq: "\u2252",
        Fcy: "\u0424",
        fcy: "\u0444",
        female: "\u2640",
        ffilig: "\uFB03",
        fflig: "\uFB00",
        ffllig: "\uFB04",
        Ffr: "\u{1D509}",
        ffr: "\u{1D523}",
        filig: "\uFB01",
        FilledSmallSquare: "\u25FC",
        FilledVerySmallSquare: "\u25AA",
        fjlig: "fj",
        flat: "\u266D",
        fllig: "\uFB02",
        fltns: "\u25B1",
        fnof: "\u0192",
        Fopf: "\u{1D53D}",
        fopf: "\u{1D557}",
        ForAll: "\u2200",
        forall: "\u2200",
        fork: "\u22D4",
        forkv: "\u2AD9",
        Fouriertrf: "\u2131",
        fpartint: "\u2A0D",
        frac12: "\xBD",
        frac13: "\u2153",
        frac14: "\xBC",
        frac15: "\u2155",
        frac16: "\u2159",
        frac18: "\u215B",
        frac23: "\u2154",
        frac25: "\u2156",
        frac34: "\xBE",
        frac35: "\u2157",
        frac38: "\u215C",
        frac45: "\u2158",
        frac56: "\u215A",
        frac58: "\u215D",
        frac78: "\u215E",
        frasl: "\u2044",
        frown: "\u2322",
        Fscr: "\u2131",
        fscr: "\u{1D4BB}",
        gacute: "\u01F5",
        Gamma: "\u0393",
        gamma: "\u03B3",
        Gammad: "\u03DC",
        gammad: "\u03DD",
        gap: "\u2A86",
        Gbreve: "\u011E",
        gbreve: "\u011F",
        Gcedil: "\u0122",
        Gcirc: "\u011C",
        gcirc: "\u011D",
        Gcy: "\u0413",
        gcy: "\u0433",
        Gdot: "\u0120",
        gdot: "\u0121",
        gE: "\u2267",
        ge: "\u2265",
        gEl: "\u2A8C",
        gel: "\u22DB",
        geq: "\u2265",
        geqq: "\u2267",
        geqslant: "\u2A7E",
        ges: "\u2A7E",
        gescc: "\u2AA9",
        gesdot: "\u2A80",
        gesdoto: "\u2A82",
        gesdotol: "\u2A84",
        gesl: "\u22DB\uFE00",
        gesles: "\u2A94",
        Gfr: "\u{1D50A}",
        gfr: "\u{1D524}",
        Gg: "\u22D9",
        gg: "\u226B",
        ggg: "\u22D9",
        gimel: "\u2137",
        GJcy: "\u0403",
        gjcy: "\u0453",
        gl: "\u2277",
        gla: "\u2AA5",
        glE: "\u2A92",
        glj: "\u2AA4",
        gnap: "\u2A8A",
        gnapprox: "\u2A8A",
        gnE: "\u2269",
        gne: "\u2A88",
        gneq: "\u2A88",
        gneqq: "\u2269",
        gnsim: "\u22E7",
        Gopf: "\u{1D53E}",
        gopf: "\u{1D558}",
        grave: "`",
        GreaterEqual: "\u2265",
        GreaterEqualLess: "\u22DB",
        GreaterFullEqual: "\u2267",
        GreaterGreater: "\u2AA2",
        GreaterLess: "\u2277",
        GreaterSlantEqual: "\u2A7E",
        GreaterTilde: "\u2273",
        Gscr: "\u{1D4A2}",
        gscr: "\u210A",
        gsim: "\u2273",
        gsime: "\u2A8E",
        gsiml: "\u2A90",
        Gt: "\u226B",
        GT: ">",
        gt: ">",
        gtcc: "\u2AA7",
        gtcir: "\u2A7A",
        gtdot: "\u22D7",
        gtlPar: "\u2995",
        gtquest: "\u2A7C",
        gtrapprox: "\u2A86",
        gtrarr: "\u2978",
        gtrdot: "\u22D7",
        gtreqless: "\u22DB",
        gtreqqless: "\u2A8C",
        gtrless: "\u2277",
        gtrsim: "\u2273",
        gvertneqq: "\u2269\uFE00",
        gvnE: "\u2269\uFE00",
        Hacek: "\u02C7",
        hairsp: "\u200A",
        half: "\xBD",
        hamilt: "\u210B",
        HARDcy: "\u042A",
        hardcy: "\u044A",
        hArr: "\u21D4",
        harr: "\u2194",
        harrcir: "\u2948",
        harrw: "\u21AD",
        Hat: "^",
        hbar: "\u210F",
        Hcirc: "\u0124",
        hcirc: "\u0125",
        hearts: "\u2665",
        heartsuit: "\u2665",
        hellip: "\u2026",
        hercon: "\u22B9",
        Hfr: "\u210C",
        hfr: "\u{1D525}",
        HilbertSpace: "\u210B",
        hksearow: "\u2925",
        hkswarow: "\u2926",
        hoarr: "\u21FF",
        homtht: "\u223B",
        hookleftarrow: "\u21A9",
        hookrightarrow: "\u21AA",
        Hopf: "\u210D",
        hopf: "\u{1D559}",
        horbar: "\u2015",
        HorizontalLine: "\u2500",
        Hscr: "\u210B",
        hscr: "\u{1D4BD}",
        hslash: "\u210F",
        Hstrok: "\u0126",
        hstrok: "\u0127",
        HumpDownHump: "\u224E",
        HumpEqual: "\u224F",
        hybull: "\u2043",
        hyphen: "\u2010",
        Iacute: "\xCD",
        iacute: "\xED",
        ic: "\u2063",
        Icirc: "\xCE",
        icirc: "\xEE",
        Icy: "\u0418",
        icy: "\u0438",
        Idot: "\u0130",
        IEcy: "\u0415",
        iecy: "\u0435",
        iexcl: "\xA1",
        iff: "\u21D4",
        Ifr: "\u2111",
        ifr: "\u{1D526}",
        Igrave: "\xCC",
        igrave: "\xEC",
        ii: "\u2148",
        iiiint: "\u2A0C",
        iiint: "\u222D",
        iinfin: "\u29DC",
        iiota: "\u2129",
        IJlig: "\u0132",
        ijlig: "\u0133",
        Im: "\u2111",
        Imacr: "\u012A",
        imacr: "\u012B",
        image: "\u2111",
        ImaginaryI: "\u2148",
        imagline: "\u2110",
        imagpart: "\u2111",
        imath: "\u0131",
        imof: "\u22B7",
        imped: "\u01B5",
        Implies: "\u21D2",
        in: "\u2208",
        incare: "\u2105",
        infin: "\u221E",
        infintie: "\u29DD",
        inodot: "\u0131",
        Int: "\u222C",
        int: "\u222B",
        intcal: "\u22BA",
        integers: "\u2124",
        Integral: "\u222B",
        intercal: "\u22BA",
        Intersection: "\u22C2",
        intlarhk: "\u2A17",
        intprod: "\u2A3C",
        InvisibleComma: "\u2063",
        InvisibleTimes: "\u2062",
        IOcy: "\u0401",
        iocy: "\u0451",
        Iogon: "\u012E",
        iogon: "\u012F",
        Iopf: "\u{1D540}",
        iopf: "\u{1D55A}",
        Iota: "\u0399",
        iota: "\u03B9",
        iprod: "\u2A3C",
        iquest: "\xBF",
        Iscr: "\u2110",
        iscr: "\u{1D4BE}",
        isin: "\u2208",
        isindot: "\u22F5",
        isinE: "\u22F9",
        isins: "\u22F4",
        isinsv: "\u22F3",
        isinv: "\u2208",
        it: "\u2062",
        Itilde: "\u0128",
        itilde: "\u0129",
        Iukcy: "\u0406",
        iukcy: "\u0456",
        Iuml: "\xCF",
        iuml: "\xEF",
        Jcirc: "\u0134",
        jcirc: "\u0135",
        Jcy: "\u0419",
        jcy: "\u0439",
        Jfr: "\u{1D50D}",
        jfr: "\u{1D527}",
        jmath: "\u0237",
        Jopf: "\u{1D541}",
        jopf: "\u{1D55B}",
        Jscr: "\u{1D4A5}",
        jscr: "\u{1D4BF}",
        Jsercy: "\u0408",
        jsercy: "\u0458",
        Jukcy: "\u0404",
        jukcy: "\u0454",
        Kappa: "\u039A",
        kappa: "\u03BA",
        kappav: "\u03F0",
        Kcedil: "\u0136",
        kcedil: "\u0137",
        Kcy: "\u041A",
        kcy: "\u043A",
        Kfr: "\u{1D50E}",
        kfr: "\u{1D528}",
        kgreen: "\u0138",
        KHcy: "\u0425",
        khcy: "\u0445",
        KJcy: "\u040C",
        kjcy: "\u045C",
        Kopf: "\u{1D542}",
        kopf: "\u{1D55C}",
        Kscr: "\u{1D4A6}",
        kscr: "\u{1D4C0}",
        lAarr: "\u21DA",
        Lacute: "\u0139",
        lacute: "\u013A",
        laemptyv: "\u29B4",
        lagran: "\u2112",
        Lambda: "\u039B",
        lambda: "\u03BB",
        Lang: "\u27EA",
        lang: "\u27E8",
        langd: "\u2991",
        langle: "\u27E8",
        lap: "\u2A85",
        Laplacetrf: "\u2112",
        laquo: "\xAB",
        Larr: "\u219E",
        lArr: "\u21D0",
        larr: "\u2190",
        larrb: "\u21E4",
        larrbfs: "\u291F",
        larrfs: "\u291D",
        larrhk: "\u21A9",
        larrlp: "\u21AB",
        larrpl: "\u2939",
        larrsim: "\u2973",
        larrtl: "\u21A2",
        lat: "\u2AAB",
        lAtail: "\u291B",
        latail: "\u2919",
        late: "\u2AAD",
        lates: "\u2AAD\uFE00",
        lBarr: "\u290E",
        lbarr: "\u290C",
        lbbrk: "\u2772",
        lbrace: "{",
        lbrack: "[",
        lbrke: "\u298B",
        lbrksld: "\u298F",
        lbrkslu: "\u298D",
        Lcaron: "\u013D",
        lcaron: "\u013E",
        Lcedil: "\u013B",
        lcedil: "\u013C",
        lceil: "\u2308",
        lcub: "{",
        Lcy: "\u041B",
        lcy: "\u043B",
        ldca: "\u2936",
        ldquo: "\u201C",
        ldquor: "\u201E",
        ldrdhar: "\u2967",
        ldrushar: "\u294B",
        ldsh: "\u21B2",
        lE: "\u2266",
        le: "\u2264",
        LeftAngleBracket: "\u27E8",
        LeftArrow: "\u2190",
        Leftarrow: "\u21D0",
        leftarrow: "\u2190",
        LeftArrowBar: "\u21E4",
        LeftArrowRightArrow: "\u21C6",
        leftarrowtail: "\u21A2",
        LeftCeiling: "\u2308",
        LeftDoubleBracket: "\u27E6",
        LeftDownTeeVector: "\u2961",
        LeftDownVector: "\u21C3",
        LeftDownVectorBar: "\u2959",
        LeftFloor: "\u230A",
        leftharpoondown: "\u21BD",
        leftharpoonup: "\u21BC",
        leftleftarrows: "\u21C7",
        LeftRightArrow: "\u2194",
        Leftrightarrow: "\u21D4",
        leftrightarrow: "\u2194",
        leftrightarrows: "\u21C6",
        leftrightharpoons: "\u21CB",
        leftrightsquigarrow: "\u21AD",
        LeftRightVector: "\u294E",
        LeftTee: "\u22A3",
        LeftTeeArrow: "\u21A4",
        LeftTeeVector: "\u295A",
        leftthreetimes: "\u22CB",
        LeftTriangle: "\u22B2",
        LeftTriangleBar: "\u29CF",
        LeftTriangleEqual: "\u22B4",
        LeftUpDownVector: "\u2951",
        LeftUpTeeVector: "\u2960",
        LeftUpVector: "\u21BF",
        LeftUpVectorBar: "\u2958",
        LeftVector: "\u21BC",
        LeftVectorBar: "\u2952",
        lEg: "\u2A8B",
        leg: "\u22DA",
        leq: "\u2264",
        leqq: "\u2266",
        leqslant: "\u2A7D",
        les: "\u2A7D",
        lescc: "\u2AA8",
        lesdot: "\u2A7F",
        lesdoto: "\u2A81",
        lesdotor: "\u2A83",
        lesg: "\u22DA\uFE00",
        lesges: "\u2A93",
        lessapprox: "\u2A85",
        lessdot: "\u22D6",
        lesseqgtr: "\u22DA",
        lesseqqgtr: "\u2A8B",
        LessEqualGreater: "\u22DA",
        LessFullEqual: "\u2266",
        LessGreater: "\u2276",
        lessgtr: "\u2276",
        LessLess: "\u2AA1",
        lesssim: "\u2272",
        LessSlantEqual: "\u2A7D",
        LessTilde: "\u2272",
        lfisht: "\u297C",
        lfloor: "\u230A",
        Lfr: "\u{1D50F}",
        lfr: "\u{1D529}",
        lg: "\u2276",
        lgE: "\u2A91",
        lHar: "\u2962",
        lhard: "\u21BD",
        lharu: "\u21BC",
        lharul: "\u296A",
        lhblk: "\u2584",
        LJcy: "\u0409",
        ljcy: "\u0459",
        Ll: "\u22D8",
        ll: "\u226A",
        llarr: "\u21C7",
        llcorner: "\u231E",
        Lleftarrow: "\u21DA",
        llhard: "\u296B",
        lltri: "\u25FA",
        Lmidot: "\u013F",
        lmidot: "\u0140",
        lmoust: "\u23B0",
        lmoustache: "\u23B0",
        lnap: "\u2A89",
        lnapprox: "\u2A89",
        lnE: "\u2268",
        lne: "\u2A87",
        lneq: "\u2A87",
        lneqq: "\u2268",
        lnsim: "\u22E6",
        loang: "\u27EC",
        loarr: "\u21FD",
        lobrk: "\u27E6",
        LongLeftArrow: "\u27F5",
        Longleftarrow: "\u27F8",
        longleftarrow: "\u27F5",
        LongLeftRightArrow: "\u27F7",
        Longleftrightarrow: "\u27FA",
        longleftrightarrow: "\u27F7",
        longmapsto: "\u27FC",
        LongRightArrow: "\u27F6",
        Longrightarrow: "\u27F9",
        longrightarrow: "\u27F6",
        looparrowleft: "\u21AB",
        looparrowright: "\u21AC",
        lopar: "\u2985",
        Lopf: "\u{1D543}",
        lopf: "\u{1D55D}",
        loplus: "\u2A2D",
        lotimes: "\u2A34",
        lowast: "\u2217",
        lowbar: "_",
        LowerLeftArrow: "\u2199",
        LowerRightArrow: "\u2198",
        loz: "\u25CA",
        lozenge: "\u25CA",
        lozf: "\u29EB",
        lpar: "(",
        lparlt: "\u2993",
        lrarr: "\u21C6",
        lrcorner: "\u231F",
        lrhar: "\u21CB",
        lrhard: "\u296D",
        lrm: "\u200E",
        lrtri: "\u22BF",
        lsaquo: "\u2039",
        Lscr: "\u2112",
        lscr: "\u{1D4C1}",
        Lsh: "\u21B0",
        lsh: "\u21B0",
        lsim: "\u2272",
        lsime: "\u2A8D",
        lsimg: "\u2A8F",
        lsqb: "[",
        lsquo: "\u2018",
        lsquor: "\u201A",
        Lstrok: "\u0141",
        lstrok: "\u0142",
        Lt: "\u226A",
        LT: "<",
        lt: "<",
        ltcc: "\u2AA6",
        ltcir: "\u2A79",
        ltdot: "\u22D6",
        lthree: "\u22CB",
        ltimes: "\u22C9",
        ltlarr: "\u2976",
        ltquest: "\u2A7B",
        ltri: "\u25C3",
        ltrie: "\u22B4",
        ltrif: "\u25C2",
        ltrPar: "\u2996",
        lurdshar: "\u294A",
        luruhar: "\u2966",
        lvertneqq: "\u2268\uFE00",
        lvnE: "\u2268\uFE00",
        macr: "\xAF",
        male: "\u2642",
        malt: "\u2720",
        maltese: "\u2720",
        Map: "\u2905",
        map: "\u21A6",
        mapsto: "\u21A6",
        mapstodown: "\u21A7",
        mapstoleft: "\u21A4",
        mapstoup: "\u21A5",
        marker: "\u25AE",
        mcomma: "\u2A29",
        Mcy: "\u041C",
        mcy: "\u043C",
        mdash: "\u2014",
        mDDot: "\u223A",
        measuredangle: "\u2221",
        MediumSpace: "\u205F",
        Mellintrf: "\u2133",
        Mfr: "\u{1D510}",
        mfr: "\u{1D52A}",
        mho: "\u2127",
        micro: "\xB5",
        mid: "\u2223",
        midast: "*",
        midcir: "\u2AF0",
        middot: "\xB7",
        minus: "\u2212",
        minusb: "\u229F",
        minusd: "\u2238",
        minusdu: "\u2A2A",
        MinusPlus: "\u2213",
        mlcp: "\u2ADB",
        mldr: "\u2026",
        mnplus: "\u2213",
        models: "\u22A7",
        Mopf: "\u{1D544}",
        mopf: "\u{1D55E}",
        mp: "\u2213",
        Mscr: "\u2133",
        mscr: "\u{1D4C2}",
        mstpos: "\u223E",
        Mu: "\u039C",
        mu: "\u03BC",
        multimap: "\u22B8",
        mumap: "\u22B8",
        nabla: "\u2207",
        Nacute: "\u0143",
        nacute: "\u0144",
        nang: "\u2220\u20D2",
        nap: "\u2249",
        napE: "\u2A70\u0338",
        napid: "\u224B\u0338",
        napos: "\u0149",
        napprox: "\u2249",
        natur: "\u266E",
        natural: "\u266E",
        naturals: "\u2115",
        nbsp: "\xA0",
        nbump: "\u224E\u0338",
        nbumpe: "\u224F\u0338",
        ncap: "\u2A43",
        Ncaron: "\u0147",
        ncaron: "\u0148",
        Ncedil: "\u0145",
        ncedil: "\u0146",
        ncong: "\u2247",
        ncongdot: "\u2A6D\u0338",
        ncup: "\u2A42",
        Ncy: "\u041D",
        ncy: "\u043D",
        ndash: "\u2013",
        ne: "\u2260",
        nearhk: "\u2924",
        neArr: "\u21D7",
        nearr: "\u2197",
        nearrow: "\u2197",
        nedot: "\u2250\u0338",
        NegativeMediumSpace: "\u200B",
        NegativeThickSpace: "\u200B",
        NegativeThinSpace: "\u200B",
        NegativeVeryThinSpace: "\u200B",
        nequiv: "\u2262",
        nesear: "\u2928",
        nesim: "\u2242\u0338",
        NestedGreaterGreater: "\u226B",
        NestedLessLess: "\u226A",
        NewLine: "\n",
        nexist: "\u2204",
        nexists: "\u2204",
        Nfr: "\u{1D511}",
        nfr: "\u{1D52B}",
        ngE: "\u2267\u0338",
        nge: "\u2271",
        ngeq: "\u2271",
        ngeqq: "\u2267\u0338",
        ngeqslant: "\u2A7E\u0338",
        nges: "\u2A7E\u0338",
        nGg: "\u22D9\u0338",
        ngsim: "\u2275",
        nGt: "\u226B\u20D2",
        ngt: "\u226F",
        ngtr: "\u226F",
        nGtv: "\u226B\u0338",
        nhArr: "\u21CE",
        nharr: "\u21AE",
        nhpar: "\u2AF2",
        ni: "\u220B",
        nis: "\u22FC",
        nisd: "\u22FA",
        niv: "\u220B",
        NJcy: "\u040A",
        njcy: "\u045A",
        nlArr: "\u21CD",
        nlarr: "\u219A",
        nldr: "\u2025",
        nlE: "\u2266\u0338",
        nle: "\u2270",
        nLeftarrow: "\u21CD",
        nleftarrow: "\u219A",
        nLeftrightarrow: "\u21CE",
        nleftrightarrow: "\u21AE",
        nleq: "\u2270",
        nleqq: "\u2266\u0338",
        nleqslant: "\u2A7D\u0338",
        nles: "\u2A7D\u0338",
        nless: "\u226E",
        nLl: "\u22D8\u0338",
        nlsim: "\u2274",
        nLt: "\u226A\u20D2",
        nlt: "\u226E",
        nltri: "\u22EA",
        nltrie: "\u22EC",
        nLtv: "\u226A\u0338",
        nmid: "\u2224",
        NoBreak: "\u2060",
        NonBreakingSpace: "\xA0",
        Nopf: "\u2115",
        nopf: "\u{1D55F}",
        Not: "\u2AEC",
        not: "\xAC",
        NotCongruent: "\u2262",
        NotCupCap: "\u226D",
        NotDoubleVerticalBar: "\u2226",
        NotElement: "\u2209",
        NotEqual: "\u2260",
        NotEqualTilde: "\u2242\u0338",
        NotExists: "\u2204",
        NotGreater: "\u226F",
        NotGreaterEqual: "\u2271",
        NotGreaterFullEqual: "\u2267\u0338",
        NotGreaterGreater: "\u226B\u0338",
        NotGreaterLess: "\u2279",
        NotGreaterSlantEqual: "\u2A7E\u0338",
        NotGreaterTilde: "\u2275",
        NotHumpDownHump: "\u224E\u0338",
        NotHumpEqual: "\u224F\u0338",
        notin: "\u2209",
        notindot: "\u22F5\u0338",
        notinE: "\u22F9\u0338",
        notinva: "\u2209",
        notinvb: "\u22F7",
        notinvc: "\u22F6",
        NotLeftTriangle: "\u22EA",
        NotLeftTriangleBar: "\u29CF\u0338",
        NotLeftTriangleEqual: "\u22EC",
        NotLess: "\u226E",
        NotLessEqual: "\u2270",
        NotLessGreater: "\u2278",
        NotLessLess: "\u226A\u0338",
        NotLessSlantEqual: "\u2A7D\u0338",
        NotLessTilde: "\u2274",
        NotNestedGreaterGreater: "\u2AA2\u0338",
        NotNestedLessLess: "\u2AA1\u0338",
        notni: "\u220C",
        notniva: "\u220C",
        notnivb: "\u22FE",
        notnivc: "\u22FD",
        NotPrecedes: "\u2280",
        NotPrecedesEqual: "\u2AAF\u0338",
        NotPrecedesSlantEqual: "\u22E0",
        NotReverseElement: "\u220C",
        NotRightTriangle: "\u22EB",
        NotRightTriangleBar: "\u29D0\u0338",
        NotRightTriangleEqual: "\u22ED",
        NotSquareSubset: "\u228F\u0338",
        NotSquareSubsetEqual: "\u22E2",
        NotSquareSuperset: "\u2290\u0338",
        NotSquareSupersetEqual: "\u22E3",
        NotSubset: "\u2282\u20D2",
        NotSubsetEqual: "\u2288",
        NotSucceeds: "\u2281",
        NotSucceedsEqual: "\u2AB0\u0338",
        NotSucceedsSlantEqual: "\u22E1",
        NotSucceedsTilde: "\u227F\u0338",
        NotSuperset: "\u2283\u20D2",
        NotSupersetEqual: "\u2289",
        NotTilde: "\u2241",
        NotTildeEqual: "\u2244",
        NotTildeFullEqual: "\u2247",
        NotTildeTilde: "\u2249",
        NotVerticalBar: "\u2224",
        npar: "\u2226",
        nparallel: "\u2226",
        nparsl: "\u2AFD\u20E5",
        npart: "\u2202\u0338",
        npolint: "\u2A14",
        npr: "\u2280",
        nprcue: "\u22E0",
        npre: "\u2AAF\u0338",
        nprec: "\u2280",
        npreceq: "\u2AAF\u0338",
        nrArr: "\u21CF",
        nrarr: "\u219B",
        nrarrc: "\u2933\u0338",
        nrarrw: "\u219D\u0338",
        nRightarrow: "\u21CF",
        nrightarrow: "\u219B",
        nrtri: "\u22EB",
        nrtrie: "\u22ED",
        nsc: "\u2281",
        nsccue: "\u22E1",
        nsce: "\u2AB0\u0338",
        Nscr: "\u{1D4A9}",
        nscr: "\u{1D4C3}",
        nshortmid: "\u2224",
        nshortparallel: "\u2226",
        nsim: "\u2241",
        nsime: "\u2244",
        nsimeq: "\u2244",
        nsmid: "\u2224",
        nspar: "\u2226",
        nsqsube: "\u22E2",
        nsqsupe: "\u22E3",
        nsub: "\u2284",
        nsubE: "\u2AC5\u0338",
        nsube: "\u2288",
        nsubset: "\u2282\u20D2",
        nsubseteq: "\u2288",
        nsubseteqq: "\u2AC5\u0338",
        nsucc: "\u2281",
        nsucceq: "\u2AB0\u0338",
        nsup: "\u2285",
        nsupE: "\u2AC6\u0338",
        nsupe: "\u2289",
        nsupset: "\u2283\u20D2",
        nsupseteq: "\u2289",
        nsupseteqq: "\u2AC6\u0338",
        ntgl: "\u2279",
        Ntilde: "\xD1",
        ntilde: "\xF1",
        ntlg: "\u2278",
        ntriangleleft: "\u22EA",
        ntrianglelefteq: "\u22EC",
        ntriangleright: "\u22EB",
        ntrianglerighteq: "\u22ED",
        Nu: "\u039D",
        nu: "\u03BD",
        num: "#",
        numero: "\u2116",
        numsp: "\u2007",
        nvap: "\u224D\u20D2",
        nVDash: "\u22AF",
        nVdash: "\u22AE",
        nvDash: "\u22AD",
        nvdash: "\u22AC",
        nvge: "\u2265\u20D2",
        nvgt: ">\u20D2",
        nvHarr: "\u2904",
        nvinfin: "\u29DE",
        nvlArr: "\u2902",
        nvle: "\u2264\u20D2",
        nvlt: "<\u20D2",
        nvltrie: "\u22B4\u20D2",
        nvrArr: "\u2903",
        nvrtrie: "\u22B5\u20D2",
        nvsim: "\u223C\u20D2",
        nwarhk: "\u2923",
        nwArr: "\u21D6",
        nwarr: "\u2196",
        nwarrow: "\u2196",
        nwnear: "\u2927",
        Oacute: "\xD3",
        oacute: "\xF3",
        oast: "\u229B",
        ocir: "\u229A",
        Ocirc: "\xD4",
        ocirc: "\xF4",
        Ocy: "\u041E",
        ocy: "\u043E",
        odash: "\u229D",
        Odblac: "\u0150",
        odblac: "\u0151",
        odiv: "\u2A38",
        odot: "\u2299",
        odsold: "\u29BC",
        OElig: "\u0152",
        oelig: "\u0153",
        ofcir: "\u29BF",
        Ofr: "\u{1D512}",
        ofr: "\u{1D52C}",
        ogon: "\u02DB",
        Ograve: "\xD2",
        ograve: "\xF2",
        ogt: "\u29C1",
        ohbar: "\u29B5",
        ohm: "\u03A9",
        oint: "\u222E",
        olarr: "\u21BA",
        olcir: "\u29BE",
        olcross: "\u29BB",
        oline: "\u203E",
        olt: "\u29C0",
        Omacr: "\u014C",
        omacr: "\u014D",
        Omega: "\u03A9",
        omega: "\u03C9",
        Omicron: "\u039F",
        omicron: "\u03BF",
        omid: "\u29B6",
        ominus: "\u2296",
        Oopf: "\u{1D546}",
        oopf: "\u{1D560}",
        opar: "\u29B7",
        OpenCurlyDoubleQuote: "\u201C",
        OpenCurlyQuote: "\u2018",
        operp: "\u29B9",
        oplus: "\u2295",
        Or: "\u2A54",
        or: "\u2228",
        orarr: "\u21BB",
        ord: "\u2A5D",
        order: "\u2134",
        orderof: "\u2134",
        ordf: "\xAA",
        ordm: "\xBA",
        origof: "\u22B6",
        oror: "\u2A56",
        orslope: "\u2A57",
        orv: "\u2A5B",
        oS: "\u24C8",
        Oscr: "\u{1D4AA}",
        oscr: "\u2134",
        Oslash: "\xD8",
        oslash: "\xF8",
        osol: "\u2298",
        Otilde: "\xD5",
        otilde: "\xF5",
        Otimes: "\u2A37",
        otimes: "\u2297",
        otimesas: "\u2A36",
        Ouml: "\xD6",
        ouml: "\xF6",
        ovbar: "\u233D",
        OverBar: "\u203E",
        OverBrace: "\u23DE",
        OverBracket: "\u23B4",
        OverParenthesis: "\u23DC",
        par: "\u2225",
        para: "\xB6",
        parallel: "\u2225",
        parsim: "\u2AF3",
        parsl: "\u2AFD",
        part: "\u2202",
        PartialD: "\u2202",
        Pcy: "\u041F",
        pcy: "\u043F",
        percnt: "%",
        period: ".",
        permil: "\u2030",
        perp: "\u22A5",
        pertenk: "\u2031",
        Pfr: "\u{1D513}",
        pfr: "\u{1D52D}",
        Phi: "\u03A6",
        phi: "\u03C6",
        phiv: "\u03D5",
        phmmat: "\u2133",
        phone: "\u260E",
        Pi: "\u03A0",
        pi: "\u03C0",
        pitchfork: "\u22D4",
        piv: "\u03D6",
        planck: "\u210F",
        planckh: "\u210E",
        plankv: "\u210F",
        plus: "+",
        plusacir: "\u2A23",
        plusb: "\u229E",
        pluscir: "\u2A22",
        plusdo: "\u2214",
        plusdu: "\u2A25",
        pluse: "\u2A72",
        PlusMinus: "\xB1",
        plusmn: "\xB1",
        plussim: "\u2A26",
        plustwo: "\u2A27",
        pm: "\xB1",
        Poincareplane: "\u210C",
        pointint: "\u2A15",
        Popf: "\u2119",
        popf: "\u{1D561}",
        pound: "\xA3",
        Pr: "\u2ABB",
        pr: "\u227A",
        prap: "\u2AB7",
        prcue: "\u227C",
        prE: "\u2AB3",
        pre: "\u2AAF",
        prec: "\u227A",
        precapprox: "\u2AB7",
        preccurlyeq: "\u227C",
        Precedes: "\u227A",
        PrecedesEqual: "\u2AAF",
        PrecedesSlantEqual: "\u227C",
        PrecedesTilde: "\u227E",
        preceq: "\u2AAF",
        precnapprox: "\u2AB9",
        precneqq: "\u2AB5",
        precnsim: "\u22E8",
        precsim: "\u227E",
        Prime: "\u2033",
        prime: "\u2032",
        primes: "\u2119",
        prnap: "\u2AB9",
        prnE: "\u2AB5",
        prnsim: "\u22E8",
        prod: "\u220F",
        Product: "\u220F",
        profalar: "\u232E",
        profline: "\u2312",
        profsurf: "\u2313",
        prop: "\u221D",
        Proportion: "\u2237",
        Proportional: "\u221D",
        propto: "\u221D",
        prsim: "\u227E",
        prurel: "\u22B0",
        Pscr: "\u{1D4AB}",
        pscr: "\u{1D4C5}",
        Psi: "\u03A8",
        psi: "\u03C8",
        puncsp: "\u2008",
        Qfr: "\u{1D514}",
        qfr: "\u{1D52E}",
        qint: "\u2A0C",
        Qopf: "\u211A",
        qopf: "\u{1D562}",
        qprime: "\u2057",
        Qscr: "\u{1D4AC}",
        qscr: "\u{1D4C6}",
        quaternions: "\u210D",
        quatint: "\u2A16",
        quest: "?",
        questeq: "\u225F",
        QUOT: '"',
        quot: '"',
        rAarr: "\u21DB",
        race: "\u223D\u0331",
        Racute: "\u0154",
        racute: "\u0155",
        radic: "\u221A",
        raemptyv: "\u29B3",
        Rang: "\u27EB",
        rang: "\u27E9",
        rangd: "\u2992",
        range: "\u29A5",
        rangle: "\u27E9",
        raquo: "\xBB",
        Rarr: "\u21A0",
        rArr: "\u21D2",
        rarr: "\u2192",
        rarrap: "\u2975",
        rarrb: "\u21E5",
        rarrbfs: "\u2920",
        rarrc: "\u2933",
        rarrfs: "\u291E",
        rarrhk: "\u21AA",
        rarrlp: "\u21AC",
        rarrpl: "\u2945",
        rarrsim: "\u2974",
        Rarrtl: "\u2916",
        rarrtl: "\u21A3",
        rarrw: "\u219D",
        rAtail: "\u291C",
        ratail: "\u291A",
        ratio: "\u2236",
        rationals: "\u211A",
        RBarr: "\u2910",
        rBarr: "\u290F",
        rbarr: "\u290D",
        rbbrk: "\u2773",
        rbrace: "}",
        rbrack: "]",
        rbrke: "\u298C",
        rbrksld: "\u298E",
        rbrkslu: "\u2990",
        Rcaron: "\u0158",
        rcaron: "\u0159",
        Rcedil: "\u0156",
        rcedil: "\u0157",
        rceil: "\u2309",
        rcub: "}",
        Rcy: "\u0420",
        rcy: "\u0440",
        rdca: "\u2937",
        rdldhar: "\u2969",
        rdquo: "\u201D",
        rdquor: "\u201D",
        rdsh: "\u21B3",
        Re: "\u211C",
        real: "\u211C",
        realine: "\u211B",
        realpart: "\u211C",
        reals: "\u211D",
        rect: "\u25AD",
        REG: "\xAE",
        reg: "\xAE",
        ReverseElement: "\u220B",
        ReverseEquilibrium: "\u21CB",
        ReverseUpEquilibrium: "\u296F",
        rfisht: "\u297D",
        rfloor: "\u230B",
        Rfr: "\u211C",
        rfr: "\u{1D52F}",
        rHar: "\u2964",
        rhard: "\u21C1",
        rharu: "\u21C0",
        rharul: "\u296C",
        Rho: "\u03A1",
        rho: "\u03C1",
        rhov: "\u03F1",
        RightAngleBracket: "\u27E9",
        RightArrow: "\u2192",
        Rightarrow: "\u21D2",
        rightarrow: "\u2192",
        RightArrowBar: "\u21E5",
        RightArrowLeftArrow: "\u21C4",
        rightarrowtail: "\u21A3",
        RightCeiling: "\u2309",
        RightDoubleBracket: "\u27E7",
        RightDownTeeVector: "\u295D",
        RightDownVector: "\u21C2",
        RightDownVectorBar: "\u2955",
        RightFloor: "\u230B",
        rightharpoondown: "\u21C1",
        rightharpoonup: "\u21C0",
        rightleftarrows: "\u21C4",
        rightleftharpoons: "\u21CC",
        rightrightarrows: "\u21C9",
        rightsquigarrow: "\u219D",
        RightTee: "\u22A2",
        RightTeeArrow: "\u21A6",
        RightTeeVector: "\u295B",
        rightthreetimes: "\u22CC",
        RightTriangle: "\u22B3",
        RightTriangleBar: "\u29D0",
        RightTriangleEqual: "\u22B5",
        RightUpDownVector: "\u294F",
        RightUpTeeVector: "\u295C",
        RightUpVector: "\u21BE",
        RightUpVectorBar: "\u2954",
        RightVector: "\u21C0",
        RightVectorBar: "\u2953",
        ring: "\u02DA",
        risingdotseq: "\u2253",
        rlarr: "\u21C4",
        rlhar: "\u21CC",
        rlm: "\u200F",
        rmoust: "\u23B1",
        rmoustache: "\u23B1",
        rnmid: "\u2AEE",
        roang: "\u27ED",
        roarr: "\u21FE",
        robrk: "\u27E7",
        ropar: "\u2986",
        Ropf: "\u211D",
        ropf: "\u{1D563}",
        roplus: "\u2A2E",
        rotimes: "\u2A35",
        RoundImplies: "\u2970",
        rpar: ")",
        rpargt: "\u2994",
        rppolint: "\u2A12",
        rrarr: "\u21C9",
        Rrightarrow: "\u21DB",
        rsaquo: "\u203A",
        Rscr: "\u211B",
        rscr: "\u{1D4C7}",
        Rsh: "\u21B1",
        rsh: "\u21B1",
        rsqb: "]",
        rsquo: "\u2019",
        rsquor: "\u2019",
        rthree: "\u22CC",
        rtimes: "\u22CA",
        rtri: "\u25B9",
        rtrie: "\u22B5",
        rtrif: "\u25B8",
        rtriltri: "\u29CE",
        RuleDelayed: "\u29F4",
        ruluhar: "\u2968",
        rx: "\u211E",
        Sacute: "\u015A",
        sacute: "\u015B",
        sbquo: "\u201A",
        Sc: "\u2ABC",
        sc: "\u227B",
        scap: "\u2AB8",
        Scaron: "\u0160",
        scaron: "\u0161",
        sccue: "\u227D",
        scE: "\u2AB4",
        sce: "\u2AB0",
        Scedil: "\u015E",
        scedil: "\u015F",
        Scirc: "\u015C",
        scirc: "\u015D",
        scnap: "\u2ABA",
        scnE: "\u2AB6",
        scnsim: "\u22E9",
        scpolint: "\u2A13",
        scsim: "\u227F",
        Scy: "\u0421",
        scy: "\u0441",
        sdot: "\u22C5",
        sdotb: "\u22A1",
        sdote: "\u2A66",
        searhk: "\u2925",
        seArr: "\u21D8",
        searr: "\u2198",
        searrow: "\u2198",
        sect: "\xA7",
        semi: ";",
        seswar: "\u2929",
        setminus: "\u2216",
        setmn: "\u2216",
        sext: "\u2736",
        Sfr: "\u{1D516}",
        sfr: "\u{1D530}",
        sfrown: "\u2322",
        sharp: "\u266F",
        SHCHcy: "\u0429",
        shchcy: "\u0449",
        SHcy: "\u0428",
        shcy: "\u0448",
        ShortDownArrow: "\u2193",
        ShortLeftArrow: "\u2190",
        shortmid: "\u2223",
        shortparallel: "\u2225",
        ShortRightArrow: "\u2192",
        ShortUpArrow: "\u2191",
        shy: "\xAD",
        Sigma: "\u03A3",
        sigma: "\u03C3",
        sigmaf: "\u03C2",
        sigmav: "\u03C2",
        sim: "\u223C",
        simdot: "\u2A6A",
        sime: "\u2243",
        simeq: "\u2243",
        simg: "\u2A9E",
        simgE: "\u2AA0",
        siml: "\u2A9D",
        simlE: "\u2A9F",
        simne: "\u2246",
        simplus: "\u2A24",
        simrarr: "\u2972",
        slarr: "\u2190",
        SmallCircle: "\u2218",
        smallsetminus: "\u2216",
        smashp: "\u2A33",
        smeparsl: "\u29E4",
        smid: "\u2223",
        smile: "\u2323",
        smt: "\u2AAA",
        smte: "\u2AAC",
        smtes: "\u2AAC\uFE00",
        SOFTcy: "\u042C",
        softcy: "\u044C",
        sol: "/",
        solb: "\u29C4",
        solbar: "\u233F",
        Sopf: "\u{1D54A}",
        sopf: "\u{1D564}",
        spades: "\u2660",
        spadesuit: "\u2660",
        spar: "\u2225",
        sqcap: "\u2293",
        sqcaps: "\u2293\uFE00",
        sqcup: "\u2294",
        sqcups: "\u2294\uFE00",
        Sqrt: "\u221A",
        sqsub: "\u228F",
        sqsube: "\u2291",
        sqsubset: "\u228F",
        sqsubseteq: "\u2291",
        sqsup: "\u2290",
        sqsupe: "\u2292",
        sqsupset: "\u2290",
        sqsupseteq: "\u2292",
        squ: "\u25A1",
        Square: "\u25A1",
        square: "\u25A1",
        SquareIntersection: "\u2293",
        SquareSubset: "\u228F",
        SquareSubsetEqual: "\u2291",
        SquareSuperset: "\u2290",
        SquareSupersetEqual: "\u2292",
        SquareUnion: "\u2294",
        squarf: "\u25AA",
        squf: "\u25AA",
        srarr: "\u2192",
        Sscr: "\u{1D4AE}",
        sscr: "\u{1D4C8}",
        ssetmn: "\u2216",
        ssmile: "\u2323",
        sstarf: "\u22C6",
        Star: "\u22C6",
        star: "\u2606",
        starf: "\u2605",
        straightepsilon: "\u03F5",
        straightphi: "\u03D5",
        strns: "\xAF",
        Sub: "\u22D0",
        sub: "\u2282",
        subdot: "\u2ABD",
        subE: "\u2AC5",
        sube: "\u2286",
        subedot: "\u2AC3",
        submult: "\u2AC1",
        subnE: "\u2ACB",
        subne: "\u228A",
        subplus: "\u2ABF",
        subrarr: "\u2979",
        Subset: "\u22D0",
        subset: "\u2282",
        subseteq: "\u2286",
        subseteqq: "\u2AC5",
        SubsetEqual: "\u2286",
        subsetneq: "\u228A",
        subsetneqq: "\u2ACB",
        subsim: "\u2AC7",
        subsub: "\u2AD5",
        subsup: "\u2AD3",
        succ: "\u227B",
        succapprox: "\u2AB8",
        succcurlyeq: "\u227D",
        Succeeds: "\u227B",
        SucceedsEqual: "\u2AB0",
        SucceedsSlantEqual: "\u227D",
        SucceedsTilde: "\u227F",
        succeq: "\u2AB0",
        succnapprox: "\u2ABA",
        succneqq: "\u2AB6",
        succnsim: "\u22E9",
        succsim: "\u227F",
        SuchThat: "\u220B",
        Sum: "\u2211",
        sum: "\u2211",
        sung: "\u266A",
        Sup: "\u22D1",
        sup: "\u2283",
        sup1: "\xB9",
        sup2: "\xB2",
        sup3: "\xB3",
        supdot: "\u2ABE",
        supdsub: "\u2AD8",
        supE: "\u2AC6",
        supe: "\u2287",
        supedot: "\u2AC4",
        Superset: "\u2283",
        SupersetEqual: "\u2287",
        suphsol: "\u27C9",
        suphsub: "\u2AD7",
        suplarr: "\u297B",
        supmult: "\u2AC2",
        supnE: "\u2ACC",
        supne: "\u228B",
        supplus: "\u2AC0",
        Supset: "\u22D1",
        supset: "\u2283",
        supseteq: "\u2287",
        supseteqq: "\u2AC6",
        supsetneq: "\u228B",
        supsetneqq: "\u2ACC",
        supsim: "\u2AC8",
        supsub: "\u2AD4",
        supsup: "\u2AD6",
        swarhk: "\u2926",
        swArr: "\u21D9",
        swarr: "\u2199",
        swarrow: "\u2199",
        swnwar: "\u292A",
        szlig: "\xDF",
        Tab: "	",
        target: "\u2316",
        Tau: "\u03A4",
        tau: "\u03C4",
        tbrk: "\u23B4",
        Tcaron: "\u0164",
        tcaron: "\u0165",
        Tcedil: "\u0162",
        tcedil: "\u0163",
        Tcy: "\u0422",
        tcy: "\u0442",
        tdot: "\u20DB",
        telrec: "\u2315",
        Tfr: "\u{1D517}",
        tfr: "\u{1D531}",
        there4: "\u2234",
        Therefore: "\u2234",
        therefore: "\u2234",
        Theta: "\u0398",
        theta: "\u03B8",
        thetasym: "\u03D1",
        thetav: "\u03D1",
        thickapprox: "\u2248",
        thicksim: "\u223C",
        ThickSpace: "\u205F\u200A",
        thinsp: "\u2009",
        ThinSpace: "\u2009",
        thkap: "\u2248",
        thksim: "\u223C",
        THORN: "\xDE",
        thorn: "\xFE",
        Tilde: "\u223C",
        tilde: "\u02DC",
        TildeEqual: "\u2243",
        TildeFullEqual: "\u2245",
        TildeTilde: "\u2248",
        times: "\xD7",
        timesb: "\u22A0",
        timesbar: "\u2A31",
        timesd: "\u2A30",
        tint: "\u222D",
        toea: "\u2928",
        top: "\u22A4",
        topbot: "\u2336",
        topcir: "\u2AF1",
        Topf: "\u{1D54B}",
        topf: "\u{1D565}",
        topfork: "\u2ADA",
        tosa: "\u2929",
        tprime: "\u2034",
        TRADE: "\u2122",
        trade: "\u2122",
        triangle: "\u25B5",
        triangledown: "\u25BF",
        triangleleft: "\u25C3",
        trianglelefteq: "\u22B4",
        triangleq: "\u225C",
        triangleright: "\u25B9",
        trianglerighteq: "\u22B5",
        tridot: "\u25EC",
        trie: "\u225C",
        triminus: "\u2A3A",
        TripleDot: "\u20DB",
        triplus: "\u2A39",
        trisb: "\u29CD",
        tritime: "\u2A3B",
        trpezium: "\u23E2",
        Tscr: "\u{1D4AF}",
        tscr: "\u{1D4C9}",
        TScy: "\u0426",
        tscy: "\u0446",
        TSHcy: "\u040B",
        tshcy: "\u045B",
        Tstrok: "\u0166",
        tstrok: "\u0167",
        twixt: "\u226C",
        twoheadleftarrow: "\u219E",
        twoheadrightarrow: "\u21A0",
        Uacute: "\xDA",
        uacute: "\xFA",
        Uarr: "\u219F",
        uArr: "\u21D1",
        uarr: "\u2191",
        Uarrocir: "\u2949",
        Ubrcy: "\u040E",
        ubrcy: "\u045E",
        Ubreve: "\u016C",
        ubreve: "\u016D",
        Ucirc: "\xDB",
        ucirc: "\xFB",
        Ucy: "\u0423",
        ucy: "\u0443",
        udarr: "\u21C5",
        Udblac: "\u0170",
        udblac: "\u0171",
        udhar: "\u296E",
        ufisht: "\u297E",
        Ufr: "\u{1D518}",
        ufr: "\u{1D532}",
        Ugrave: "\xD9",
        ugrave: "\xF9",
        uHar: "\u2963",
        uharl: "\u21BF",
        uharr: "\u21BE",
        uhblk: "\u2580",
        ulcorn: "\u231C",
        ulcorner: "\u231C",
        ulcrop: "\u230F",
        ultri: "\u25F8",
        Umacr: "\u016A",
        umacr: "\u016B",
        uml: "\xA8",
        UnderBar: "_",
        UnderBrace: "\u23DF",
        UnderBracket: "\u23B5",
        UnderParenthesis: "\u23DD",
        Union: "\u22C3",
        UnionPlus: "\u228E",
        Uogon: "\u0172",
        uogon: "\u0173",
        Uopf: "\u{1D54C}",
        uopf: "\u{1D566}",
        UpArrow: "\u2191",
        Uparrow: "\u21D1",
        uparrow: "\u2191",
        UpArrowBar: "\u2912",
        UpArrowDownArrow: "\u21C5",
        UpDownArrow: "\u2195",
        Updownarrow: "\u21D5",
        updownarrow: "\u2195",
        UpEquilibrium: "\u296E",
        upharpoonleft: "\u21BF",
        upharpoonright: "\u21BE",
        uplus: "\u228E",
        UpperLeftArrow: "\u2196",
        UpperRightArrow: "\u2197",
        Upsi: "\u03D2",
        upsi: "\u03C5",
        upsih: "\u03D2",
        Upsilon: "\u03A5",
        upsilon: "\u03C5",
        UpTee: "\u22A5",
        UpTeeArrow: "\u21A5",
        upuparrows: "\u21C8",
        urcorn: "\u231D",
        urcorner: "\u231D",
        urcrop: "\u230E",
        Uring: "\u016E",
        uring: "\u016F",
        urtri: "\u25F9",
        Uscr: "\u{1D4B0}",
        uscr: "\u{1D4CA}",
        utdot: "\u22F0",
        Utilde: "\u0168",
        utilde: "\u0169",
        utri: "\u25B5",
        utrif: "\u25B4",
        uuarr: "\u21C8",
        Uuml: "\xDC",
        uuml: "\xFC",
        uwangle: "\u29A7",
        vangrt: "\u299C",
        varepsilon: "\u03F5",
        varkappa: "\u03F0",
        varnothing: "\u2205",
        varphi: "\u03D5",
        varpi: "\u03D6",
        varpropto: "\u221D",
        vArr: "\u21D5",
        varr: "\u2195",
        varrho: "\u03F1",
        varsigma: "\u03C2",
        varsubsetneq: "\u228A\uFE00",
        varsubsetneqq: "\u2ACB\uFE00",
        varsupsetneq: "\u228B\uFE00",
        varsupsetneqq: "\u2ACC\uFE00",
        vartheta: "\u03D1",
        vartriangleleft: "\u22B2",
        vartriangleright: "\u22B3",
        Vbar: "\u2AEB",
        vBar: "\u2AE8",
        vBarv: "\u2AE9",
        Vcy: "\u0412",
        vcy: "\u0432",
        VDash: "\u22AB",
        Vdash: "\u22A9",
        vDash: "\u22A8",
        vdash: "\u22A2",
        Vdashl: "\u2AE6",
        Vee: "\u22C1",
        vee: "\u2228",
        veebar: "\u22BB",
        veeeq: "\u225A",
        vellip: "\u22EE",
        Verbar: "\u2016",
        verbar: "|",
        Vert: "\u2016",
        vert: "|",
        VerticalBar: "\u2223",
        VerticalLine: "|",
        VerticalSeparator: "\u2758",
        VerticalTilde: "\u2240",
        VeryThinSpace: "\u200A",
        Vfr: "\u{1D519}",
        vfr: "\u{1D533}",
        vltri: "\u22B2",
        vnsub: "\u2282\u20D2",
        vnsup: "\u2283\u20D2",
        Vopf: "\u{1D54D}",
        vopf: "\u{1D567}",
        vprop: "\u221D",
        vrtri: "\u22B3",
        Vscr: "\u{1D4B1}",
        vscr: "\u{1D4CB}",
        vsubnE: "\u2ACB\uFE00",
        vsubne: "\u228A\uFE00",
        vsupnE: "\u2ACC\uFE00",
        vsupne: "\u228B\uFE00",
        Vvdash: "\u22AA",
        vzigzag: "\u299A",
        Wcirc: "\u0174",
        wcirc: "\u0175",
        wedbar: "\u2A5F",
        Wedge: "\u22C0",
        wedge: "\u2227",
        wedgeq: "\u2259",
        weierp: "\u2118",
        Wfr: "\u{1D51A}",
        wfr: "\u{1D534}",
        Wopf: "\u{1D54E}",
        wopf: "\u{1D568}",
        wp: "\u2118",
        wr: "\u2240",
        wreath: "\u2240",
        Wscr: "\u{1D4B2}",
        wscr: "\u{1D4CC}",
        xcap: "\u22C2",
        xcirc: "\u25EF",
        xcup: "\u22C3",
        xdtri: "\u25BD",
        Xfr: "\u{1D51B}",
        xfr: "\u{1D535}",
        xhArr: "\u27FA",
        xharr: "\u27F7",
        Xi: "\u039E",
        xi: "\u03BE",
        xlArr: "\u27F8",
        xlarr: "\u27F5",
        xmap: "\u27FC",
        xnis: "\u22FB",
        xodot: "\u2A00",
        Xopf: "\u{1D54F}",
        xopf: "\u{1D569}",
        xoplus: "\u2A01",
        xotime: "\u2A02",
        xrArr: "\u27F9",
        xrarr: "\u27F6",
        Xscr: "\u{1D4B3}",
        xscr: "\u{1D4CD}",
        xsqcup: "\u2A06",
        xuplus: "\u2A04",
        xutri: "\u25B3",
        xvee: "\u22C1",
        xwedge: "\u22C0",
        Yacute: "\xDD",
        yacute: "\xFD",
        YAcy: "\u042F",
        yacy: "\u044F",
        Ycirc: "\u0176",
        ycirc: "\u0177",
        Ycy: "\u042B",
        ycy: "\u044B",
        yen: "\xA5",
        Yfr: "\u{1D51C}",
        yfr: "\u{1D536}",
        YIcy: "\u0407",
        yicy: "\u0457",
        Yopf: "\u{1D550}",
        yopf: "\u{1D56A}",
        Yscr: "\u{1D4B4}",
        yscr: "\u{1D4CE}",
        YUcy: "\u042E",
        yucy: "\u044E",
        Yuml: "\u0178",
        yuml: "\xFF",
        Zacute: "\u0179",
        zacute: "\u017A",
        Zcaron: "\u017D",
        zcaron: "\u017E",
        Zcy: "\u0417",
        zcy: "\u0437",
        Zdot: "\u017B",
        zdot: "\u017C",
        zeetrf: "\u2128",
        ZeroWidthSpace: "\u200B",
        Zeta: "\u0396",
        zeta: "\u03B6",
        Zfr: "\u2128",
        zfr: "\u{1D537}",
        ZHcy: "\u0416",
        zhcy: "\u0436",
        zigrarr: "\u21DD",
        Zopf: "\u2124",
        zopf: "\u{1D56B}",
        Zscr: "\u{1D4B5}",
        zscr: "\u{1D4CF}",
        zwj: "\u200D",
        zwnj: "\u200C"
      });
      exports.entityMap = exports.HTML_ENTITIES;
    }
  });

  // node_modules/.pnpm/@xmldom+xmldom@0.9.12/node_modules/@xmldom/xmldom/lib/sax.js
  var require_sax = __commonJS({
    "node_modules/.pnpm/@xmldom+xmldom@0.9.12/node_modules/@xmldom/xmldom/lib/sax.js"(exports) {
      "use strict";
      var conventions = require_conventions();
      var g = require_grammar();
      var errors = require_errors();
      var isHTMLEscapableRawTextElement = conventions.isHTMLEscapableRawTextElement;
      var isHTMLMimeType = conventions.isHTMLMimeType;
      var isHTMLRawTextElement = conventions.isHTMLRawTextElement;
      var hasOwn = conventions.hasOwn;
      var NAMESPACE = conventions.NAMESPACE;
      var ParseError = errors.ParseError;
      var DOMException = errors.DOMException;
      var S_TAG = 0;
      var S_ATTR = 1;
      var S_ATTR_SPACE = 2;
      var S_EQ = 3;
      var S_ATTR_NOQUOT_VALUE = 4;
      var S_ATTR_END = 5;
      var S_TAG_SPACE = 6;
      var S_TAG_CLOSE = 7;
      function XMLReader() {
      }
      XMLReader.prototype = {
        parse: function(source, defaultNSMap, entityMap) {
          var domBuilder = this.domBuilder;
          domBuilder.startDocument();
          _copy(defaultNSMap, defaultNSMap = /* @__PURE__ */ Object.create(null));
          parse(source, defaultNSMap, entityMap, domBuilder, this.errorHandler);
          domBuilder.endDocument();
        }
      };
      var ENTITY_REG = /&#?\w+;?/g;
      function parse(source, defaultNSMapCopy, entityMap, domBuilder, errorHandler) {
        var isHTML = isHTMLMimeType(domBuilder.mimeType);
        if (source.indexOf(g.UNICODE_REPLACEMENT_CHARACTER) >= 0) {
          errorHandler.warning("Unicode replacement character detected, source encoding issues?");
        }
        function fixedFromCharCode(code) {
          if (code > 65535) {
            code -= 65536;
            var surrogate1 = 55296 + (code >> 10), surrogate2 = 56320 + (code & 1023);
            return String.fromCharCode(surrogate1, surrogate2);
          } else {
            return String.fromCharCode(code);
          }
        }
        function entityReplacer(a2) {
          var complete = a2[a2.length - 1] === ";" ? a2 : a2 + ";";
          if (!isHTML && complete !== a2) {
            errorHandler.error("EntityRef: expecting ;");
            return a2;
          }
          var match = g.Reference.exec(complete);
          if (!match || match[0].length !== complete.length) {
            errorHandler.error("entity not matching Reference production: " + a2);
            return a2;
          }
          var k = complete.slice(1, -1);
          if (hasOwn(entityMap, k)) {
            return entityMap[k];
          } else if (k.charAt(0) === "#") {
            return fixedFromCharCode(parseInt(k.substring(1).replace("x", "0x")));
          } else {
            errorHandler.error("entity not found:" + a2);
            return a2;
          }
        }
        function appendText(end2) {
          if (end2 > start) {
            var xt = source.substring(start, end2).replace(ENTITY_REG, entityReplacer);
            locator && position(start);
            domBuilder.characters(xt, 0, end2 - start);
            start = end2;
          }
        }
        var lineStart = 0;
        var lineEnd = 0;
        var linePattern = /\r\n?|\n|$/g;
        var locator = domBuilder.locator;
        function position(p, m) {
          while (p >= lineEnd && (m = linePattern.exec(source))) {
            lineStart = lineEnd;
            lineEnd = m.index + m[0].length;
            locator.lineNumber++;
          }
          locator.columnNumber = p - lineStart + 1;
        }
        var parseStack = [{ currentNSMap: defaultNSMapCopy }];
        var unclosedTags = [];
        var start = 0;
        while (true) {
          try {
            var tagStart = source.indexOf("<", start);
            if (tagStart < 0) {
              if (!isHTML && unclosedTags.length > 0) {
                return errorHandler.fatalError("unclosed xml tag(s): " + unclosedTags.join(", "));
              }
              if (!source.substring(start).match(/^\s*$/)) {
                var doc = domBuilder.doc;
                var text = doc.createTextNode(source.substring(start));
                if (doc.documentElement) {
                  return errorHandler.error("Extra content at the end of the document");
                }
                doc.appendChild(text);
                domBuilder.currentElement = text;
              }
              return;
            }
            if (tagStart > start) {
              var fromSource = source.substring(start, tagStart);
              if (!isHTML && unclosedTags.length === 0) {
                fromSource = fromSource.replace(new RegExp(g.S_OPT.source, "g"), "");
                fromSource && errorHandler.error("Unexpected content outside root element: '" + fromSource + "'");
              }
              appendText(tagStart);
            }
            switch (source.charAt(tagStart + 1)) {
              case "/":
                var end = source.indexOf(">", tagStart + 2);
                var tagNameRaw = source.substring(tagStart + 2, end > 0 ? end : void 0);
                if (!tagNameRaw) {
                  return errorHandler.fatalError("end tag name missing");
                }
                var endTagNameStrict = g.reg("^", g.QName_group, g.S_OPT, "$");
                var tagNameMatch = end > 0 && endTagNameStrict.exec(tagNameRaw);
                if (!tagNameMatch) {
                  var leadingTagNameMatch = end > 0 && g.reg("^", g.QName_group).exec(tagNameRaw);
                  if (isHTML && leadingTagNameMatch) {
                    errorHandler.warning('end tag name contains invalid trailing characters: "' + tagNameRaw + '"');
                    tagNameMatch = leadingTagNameMatch;
                  } else if (
                    // Backward compatibility, remove this whole `else if` arm in the next breaking release
                    // (XML then falls through to the `fatalError` below, for a clean mode split: XML fatal,
                    // HTML warning). A valid end-tag name followed by a line break and trailing content was
                    // silently accepted while `reg` still used the `m` flag; re-adding `m` here matches exactly
                    // those inputs, kept recoverable and reported.
                    leadingTagNameMatch && new RegExp(endTagNameStrict.source, endTagNameStrict.flags + "m").test(tagNameRaw)
                  ) {
                    errorHandler.error('end tag name is followed by a line break and trailing content: "' + tagNameRaw + '"');
                    tagNameMatch = leadingTagNameMatch;
                  } else {
                    return errorHandler.fatalError('end tag name contains invalid characters: "' + tagNameRaw + '"');
                  }
                }
                if (!domBuilder.currentElement && !domBuilder.doc.documentElement) {
                  return;
                }
                var currentTagName = unclosedTags[unclosedTags.length - 1] || domBuilder.currentElement.tagName || domBuilder.doc.documentElement.tagName || "";
                if (currentTagName !== tagNameMatch[1]) {
                  var tagNameLower = tagNameMatch[1].toLowerCase();
                  if (!isHTML || currentTagName.toLowerCase() !== tagNameLower) {
                    return errorHandler.fatalError('Opening and ending tag mismatch: "' + currentTagName + '" != "' + tagNameRaw + '"');
                  }
                }
                var config = parseStack.pop();
                unclosedTags.pop();
                var localNSMap = config.localNSMap;
                domBuilder.endElement(config.uri, config.localName, currentTagName);
                if (localNSMap) {
                  for (var prefix in localNSMap) {
                    if (hasOwn(localNSMap, prefix)) {
                      domBuilder.endPrefixMapping(prefix);
                    }
                  }
                }
                end++;
                break;
              // end element
              case "?":
                locator && position(tagStart);
                end = parseProcessingInstruction(source, tagStart, domBuilder, errorHandler);
                break;
              case "!":
                locator && position(tagStart);
                end = parseDoctypeCommentOrCData(source, tagStart, domBuilder, errorHandler, isHTML);
                break;
              default:
                locator && position(tagStart);
                var el = new ElementAttributes();
                var currentNSMap = parseStack[parseStack.length - 1].currentNSMap;
                var end = parseElementStartPart(source, tagStart, el, currentNSMap, entityReplacer, errorHandler, isHTML);
                var len = el.length;
                if (!el.closed) {
                  if (isHTML && conventions.isHTMLVoidElement(el.tagName)) {
                    el.closed = true;
                  } else {
                    unclosedTags.push(el.tagName);
                  }
                }
                if (locator && len) {
                  var locator2 = copyLocator(locator, {});
                  for (var i = 0; i < len; i++) {
                    var a = el[i];
                    position(a.offset);
                    a.locator = copyLocator(locator, {});
                  }
                  domBuilder.locator = locator2;
                  if (appendElement(el, domBuilder, currentNSMap)) {
                    parseStack.push(el);
                  }
                  domBuilder.locator = locator;
                } else {
                  if (appendElement(el, domBuilder, currentNSMap)) {
                    parseStack.push(el);
                  }
                }
                if (isHTML && !el.closed) {
                  end = parseHtmlSpecialContent(source, end, el.tagName, entityReplacer, domBuilder);
                } else {
                  end++;
                }
            }
          } catch (e) {
            if (e instanceof ParseError) {
              throw e;
            } else if (e instanceof DOMException) {
              return errorHandler.fatalError("Error constructing the DOM: " + e.name + ": " + e.message, e);
            }
            errorHandler.error("element parse error: " + e);
            end = -1;
          }
          if (end > start) {
            start = end;
          } else {
            appendText(Math.max(tagStart, start) + 1);
          }
        }
      }
      function copyLocator(f, t) {
        t.lineNumber = f.lineNumber;
        t.columnNumber = f.columnNumber;
        return t;
      }
      function parseElementStartPart(source, start, el, currentNSMap, entityReplacer, errorHandler, isHTML) {
        function addAttribute(qname, value2, startIndex) {
          if (hasOwn(el.attributeNames, qname)) {
            return errorHandler.fatalError("Attribute " + qname + " redefined");
          }
          if (!isHTML && value2.indexOf("<") >= 0) {
            return errorHandler.fatalError("Unescaped '<' not allowed in attributes values");
          }
          el.addValue(
            qname,
            // @see https://www.w3.org/TR/xml/#AVNormalize
            // since the xmldom sax parser does not "interpret" DTD the following is not implemented:
            // - recursive replacement of (DTD) entity references
            // - trimming and collapsing multiple spaces into a single one for attributes that are not of type CDATA
            value2.replace(/[\t\n\r]/g, " ").replace(ENTITY_REG, entityReplacer),
            startIndex
          );
        }
        var attrName;
        var value;
        var p = ++start;
        var s = S_TAG;
        while (true) {
          var c = source.charAt(p);
          if (s === S_TAG && c === "<") {
            throw new Error("unexpected < in tag name: " + source.slice(start, p));
          }
          switch (c) {
            case "=":
              if (s === S_ATTR) {
                attrName = source.slice(start, p);
                s = S_EQ;
              } else if (s === S_ATTR_SPACE) {
                s = S_EQ;
              } else {
                throw new Error("attribute equal must after attrName");
              }
              break;
            case "'":
            case '"':
              if (s === S_EQ || s === S_ATTR) {
                if (s === S_ATTR) {
                  errorHandler.warning('attribute value must after "="');
                  attrName = source.slice(start, p);
                }
                start = p + 1;
                p = source.indexOf(c, start);
                if (p > 0) {
                  value = source.slice(start, p);
                  addAttribute(attrName, value, start - 1);
                  s = S_ATTR_END;
                } else {
                  throw new Error("attribute value no end '" + c + "' match");
                }
              } else if (s == S_ATTR_NOQUOT_VALUE) {
                value = source.slice(start, p);
                addAttribute(attrName, value, start);
                errorHandler.warning('attribute "' + attrName + '" missed start quot(' + c + ")!!");
                start = p + 1;
                s = S_ATTR_END;
              } else {
                throw new Error('attribute value must after "="');
              }
              break;
            case "/":
              switch (s) {
                case S_TAG:
                  el.setTagName(source.slice(start, p));
                case S_ATTR_END:
                case S_TAG_SPACE:
                case S_TAG_CLOSE:
                  s = S_TAG_CLOSE;
                  el.closed = true;
                case S_ATTR_NOQUOT_VALUE:
                case S_ATTR:
                  break;
                case S_ATTR_SPACE:
                  el.closed = true;
                  break;
                //case S_EQ:
                default:
                  throw new Error("attribute invalid close char('/')");
              }
              break;
            case "":
              errorHandler.error("unexpected end of input");
              if (s == S_TAG) {
                el.setTagName(source.slice(start, p));
              }
              return p;
            case ">":
              switch (s) {
                case S_TAG:
                  el.setTagName(source.slice(start, p));
                case S_ATTR_END:
                case S_TAG_SPACE:
                case S_TAG_CLOSE:
                  break;
                //normal
                case S_ATTR_NOQUOT_VALUE:
                //Compatible state
                case S_ATTR:
                  value = source.slice(start, p);
                  if (value.slice(-1) === "/") {
                    el.closed = true;
                    value = value.slice(0, -1);
                  }
                case S_ATTR_SPACE:
                  if (s === S_ATTR_SPACE) {
                    value = attrName;
                  }
                  if (s == S_ATTR_NOQUOT_VALUE) {
                    errorHandler.warning('attribute "' + value + '" missed quot(")!');
                    addAttribute(attrName, value, start);
                  } else {
                    if (!isHTML) {
                      errorHandler.warning('attribute "' + value + '" missed value!! "' + value + '" instead!!');
                    }
                    addAttribute(value, value, start);
                  }
                  break;
                case S_EQ:
                  if (!isHTML) {
                    return errorHandler.fatalError(`AttValue: ' or " expected`);
                  }
              }
              return p;
            /*xml space '\x20' | #x9 | #xD | #xA; */
            case "\x80":
              c = " ";
            default:
              if (c <= " ") {
                switch (s) {
                  case S_TAG:
                    el.setTagName(source.slice(start, p));
                    s = S_TAG_SPACE;
                    break;
                  case S_ATTR:
                    attrName = source.slice(start, p);
                    s = S_ATTR_SPACE;
                    break;
                  case S_ATTR_NOQUOT_VALUE:
                    var value = source.slice(start, p);
                    errorHandler.warning('attribute "' + value + '" missed quot(")!!');
                    addAttribute(attrName, value, start);
                  case S_ATTR_END:
                    s = S_TAG_SPACE;
                    break;
                }
              } else {
                switch (s) {
                  //case S_TAG:void();break;
                  //case S_ATTR:void();break;
                  //case S_ATTR_NOQUOT_VALUE:void();break;
                  case S_ATTR_SPACE:
                    if (!isHTML) {
                      errorHandler.warning('attribute "' + attrName + '" missed value!! "' + attrName + '" instead2!!');
                    }
                    addAttribute(attrName, attrName, start);
                    start = p;
                    s = S_ATTR;
                    break;
                  case S_ATTR_END:
                    errorHandler.warning('attribute space is required"' + attrName + '"!!');
                  case S_TAG_SPACE:
                    s = S_ATTR;
                    start = p;
                    break;
                  case S_EQ:
                    s = S_ATTR_NOQUOT_VALUE;
                    start = p;
                    break;
                  case S_TAG_CLOSE:
                    throw new Error("elements closed character '/' and '>' must be connected to");
                }
              }
          }
          p++;
        }
      }
      function appendElement(el, domBuilder, currentNSMap) {
        var tagName = el.tagName;
        var localNSMap = null;
        var i = el.length;
        while (i--) {
          var a = el[i];
          var qName = a.qName;
          var value = a.value;
          var nsp = qName.indexOf(":");
          if (nsp > 0) {
            var prefix = a.prefix = qName.slice(0, nsp);
            var localName = qName.slice(nsp + 1);
            var nsPrefix = prefix === "xmlns" && localName;
          } else {
            localName = qName;
            prefix = null;
            nsPrefix = qName === "xmlns" && "";
          }
          a.localName = localName;
          if (nsPrefix !== false) {
            if (localNSMap == null) {
              localNSMap = /* @__PURE__ */ Object.create(null);
              currentNSMap = Object.create(currentNSMap);
            }
            currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
            a.uri = NAMESPACE.XMLNS;
            domBuilder.startPrefixMapping(nsPrefix, value);
          }
        }
        var i = el.length;
        while (i--) {
          a = el[i];
          if (a.prefix) {
            if (a.prefix === "xml") {
              a.uri = NAMESPACE.XML;
            }
            if (a.prefix !== "xmlns") {
              a.uri = currentNSMap[a.prefix];
            }
          }
        }
        var nsp = tagName.indexOf(":");
        if (nsp > 0) {
          prefix = el.prefix = tagName.slice(0, nsp);
          localName = el.localName = tagName.slice(nsp + 1);
        } else {
          prefix = null;
          localName = el.localName = tagName;
        }
        var ns = el.uri = currentNSMap[prefix || ""];
        domBuilder.startElement(ns, localName, tagName, el);
        if (el.closed) {
          domBuilder.endElement(ns, localName, tagName);
          if (localNSMap) {
            for (prefix in localNSMap) {
              if (hasOwn(localNSMap, prefix)) {
                domBuilder.endPrefixMapping(prefix);
              }
            }
          }
        } else {
          el.currentNSMap = currentNSMap;
          el.localNSMap = localNSMap;
          return true;
        }
      }
      function parseHtmlSpecialContent(source, elStartEnd, tagName, entityReplacer, domBuilder) {
        var isEscapableRaw = isHTMLEscapableRawTextElement(tagName);
        if (isEscapableRaw || isHTMLRawTextElement(tagName)) {
          var closeTag = new RegExp("</" + tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ">", "ig");
          closeTag.lastIndex = elStartEnd;
          var match = closeTag.exec(source);
          var elEndStart = match ? match.index : -1;
          if (elEndStart < 0) {
            return elStartEnd + 1;
          }
          var text = source.substring(elStartEnd + 1, elEndStart);
          if (isEscapableRaw) {
            text = text.replace(ENTITY_REG, entityReplacer);
          }
          domBuilder.characters(text, 0, text.length);
          return elEndStart;
        }
        return elStartEnd + 1;
      }
      function _copy(source, target) {
        for (var n in source) {
          if (hasOwn(source, n)) {
            target[n] = source[n];
          }
        }
      }
      function parseUtils(source, start) {
        var index = start;
        function char(n) {
          n = n || 0;
          return source.charAt(index + n);
        }
        function skip(n) {
          n = n || 1;
          index += n;
        }
        function skipBlanks() {
          var blanks = 0;
          while (index < source.length) {
            var c = char();
            if (c !== " " && c !== "\n" && c !== "	" && c !== "\r") {
              return blanks;
            }
            blanks++;
            skip();
          }
          return -1;
        }
        function substringFromIndex() {
          return source.substring(index);
        }
        function substringStartsWith(text) {
          return source.substring(index, index + text.length) === text;
        }
        function substringStartsWithCaseInsensitive(text) {
          return source.substring(index, index + text.length).toUpperCase() === text.toUpperCase();
        }
        function getMatch(args) {
          var expr = g.reg("^", args);
          var match = expr.exec(substringFromIndex());
          if (match) {
            skip(match[0].length);
            return match[0];
          }
          return null;
        }
        return {
          char,
          getIndex: function() {
            return index;
          },
          getMatch,
          getSource: function() {
            return source;
          },
          skip,
          skipBlanks,
          substringFromIndex,
          substringStartsWith,
          substringStartsWithCaseInsensitive
        };
      }
      function parseDoctypeInternalSubset(p, errorHandler) {
        function parsePI(p2, errorHandler2) {
          var match = g.PI.exec(p2.substringFromIndex());
          if (!match) {
            return errorHandler2.fatalError("processing instruction is not well-formed at position " + p2.getIndex());
          }
          if (match[1].toLowerCase() === "xml") {
            return errorHandler2.fatalError(
              "xml declaration is only allowed at the start of the document, but found at position " + p2.getIndex()
            );
          }
          p2.skip(match[0].length);
          return match[0];
        }
        var source = p.getSource();
        if (p.char() === "[") {
          p.skip(1);
          var intSubsetStart = p.getIndex();
          while (p.getIndex() < source.length) {
            p.skipBlanks();
            if (p.char() === "]") {
              var internalSubset = source.substring(intSubsetStart, p.getIndex());
              p.skip(1);
              return internalSubset;
            }
            var current = null;
            if (p.char() === "<" && p.char(1) === "!") {
              switch (p.char(2)) {
                case "E":
                  if (p.char(3) === "L") {
                    current = p.getMatch(g.elementdecl);
                  } else if (p.char(3) === "N") {
                    current = p.getMatch(g.EntityDecl);
                  }
                  break;
                case "A":
                  current = p.getMatch(g.AttlistDecl);
                  break;
                case "N":
                  current = p.getMatch(g.NotationDecl);
                  break;
                case "-":
                  current = p.getMatch(g.Comment);
                  break;
              }
            } else if (p.char() === "<" && p.char(1) === "?") {
              current = parsePI(p, errorHandler);
            } else if (p.char() === "%") {
              current = p.getMatch(g.PEReference);
            } else {
              return errorHandler.fatalError("Error detected in Markup declaration");
            }
            if (!current) {
              return errorHandler.fatalError("Error in internal subset at position " + p.getIndex());
            }
          }
          return errorHandler.fatalError("doctype internal subset is not well-formed, missing ]");
        }
      }
      function parseDoctypeCommentOrCData(source, start, domBuilder, errorHandler, isHTML) {
        var p = parseUtils(source, start);
        switch (isHTML ? p.char(2).toUpperCase() : p.char(2)) {
          case "-":
            var comment = p.getMatch(g.Comment);
            if (comment) {
              domBuilder.comment(comment, g.COMMENT_START.length, comment.length - g.COMMENT_START.length - g.COMMENT_END.length);
              return p.getIndex();
            } else {
              return errorHandler.fatalError("comment is not well-formed at position " + p.getIndex());
            }
          case "[":
            var cdata = p.getMatch(g.CDSect);
            if (cdata) {
              if (!isHTML && !domBuilder.currentElement) {
                return errorHandler.fatalError("CDATA outside of element");
              }
              domBuilder.startCDATA();
              domBuilder.characters(cdata, g.CDATA_START.length, cdata.length - g.CDATA_START.length - g.CDATA_END.length);
              domBuilder.endCDATA();
              return p.getIndex();
            } else {
              return errorHandler.fatalError("Invalid CDATA starting at position " + start);
            }
          case "D": {
            if (domBuilder.doc && domBuilder.doc.documentElement) {
              return errorHandler.fatalError("Doctype not allowed inside or after documentElement at position " + p.getIndex());
            }
            if (isHTML ? !p.substringStartsWithCaseInsensitive(g.DOCTYPE_DECL_START) : !p.substringStartsWith(g.DOCTYPE_DECL_START)) {
              return errorHandler.fatalError("Expected " + g.DOCTYPE_DECL_START + " at position " + p.getIndex());
            }
            p.skip(g.DOCTYPE_DECL_START.length);
            if (p.skipBlanks() < 1) {
              return errorHandler.fatalError("Expected whitespace after " + g.DOCTYPE_DECL_START + " at position " + p.getIndex());
            }
            var doctype = {
              name: void 0,
              publicId: void 0,
              systemId: void 0,
              internalSubset: void 0
            };
            doctype.name = p.getMatch(g.Name);
            if (!doctype.name)
              return errorHandler.fatalError("doctype name missing or contains unexpected characters at position " + p.getIndex());
            if (isHTML && doctype.name.toLowerCase() !== "html") {
              errorHandler.warning("Unexpected DOCTYPE in HTML document at position " + p.getIndex());
            }
            p.skipBlanks();
            if (p.substringStartsWith(g.PUBLIC) || p.substringStartsWith(g.SYSTEM)) {
              var match = g.ExternalID_match.exec(p.substringFromIndex());
              if (!match) {
                return errorHandler.fatalError("doctype external id is not well-formed at position " + p.getIndex());
              }
              if (match.groups.SystemLiteralOnly !== void 0) {
                doctype.systemId = match.groups.SystemLiteralOnly;
              } else {
                doctype.systemId = match.groups.SystemLiteral;
                doctype.publicId = match.groups.PubidLiteral;
              }
              p.skip(match[0].length);
            } else if (isHTML && p.substringStartsWithCaseInsensitive(g.SYSTEM)) {
              p.skip(g.SYSTEM.length);
              if (p.skipBlanks() < 1) {
                return errorHandler.fatalError("Expected whitespace after " + g.SYSTEM + " at position " + p.getIndex());
              }
              doctype.systemId = p.getMatch(g.ABOUT_LEGACY_COMPAT_SystemLiteral);
              if (!doctype.systemId) {
                return errorHandler.fatalError(
                  "Expected " + g.ABOUT_LEGACY_COMPAT + " in single or double quotes after " + g.SYSTEM + " at position " + p.getIndex()
                );
              }
            }
            if (isHTML && doctype.systemId && !g.ABOUT_LEGACY_COMPAT_SystemLiteral.test(doctype.systemId)) {
              errorHandler.warning("Unexpected doctype.systemId in HTML document at position " + p.getIndex());
            }
            if (!isHTML) {
              p.skipBlanks();
              doctype.internalSubset = parseDoctypeInternalSubset(p, errorHandler);
            }
            p.skipBlanks();
            if (p.char() !== ">") {
              return errorHandler.fatalError("doctype not terminated with > at position " + p.getIndex());
            }
            p.skip(1);
            domBuilder.startDTD(doctype.name, doctype.publicId, doctype.systemId, doctype.internalSubset);
            domBuilder.endDTD();
            return p.getIndex();
          }
          default:
            return errorHandler.fatalError('Not well-formed XML starting with "<!" at position ' + start);
        }
      }
      function parseProcessingInstruction(source, start, domBuilder, errorHandler) {
        var match = source.substring(start).match(g.PI);
        if (!match) {
          return errorHandler.fatalError("Invalid processing instruction starting at position " + start);
        }
        if (match[1].toLowerCase() === "xml") {
          if (start > 0) {
            return errorHandler.fatalError(
              "processing instruction at position " + start + " is an xml declaration which is only at the start of the document"
            );
          }
          if (!g.XMLDecl.test(source.substring(start))) {
            return errorHandler.fatalError("xml declaration is not well-formed");
          }
        }
        domBuilder.processingInstruction(match[1], match[2]);
        return start + match[0].length;
      }
      function ElementAttributes() {
        this.attributeNames = /* @__PURE__ */ Object.create(null);
      }
      ElementAttributes.prototype = {
        setTagName: function(tagName) {
          if (!g.QName_exact.test(tagName)) {
            throw new Error("invalid tagName:" + tagName);
          }
          this.tagName = tagName;
        },
        addValue: function(qName, value, offset) {
          if (!g.QName_exact.test(qName)) {
            throw new Error("invalid attribute:" + qName);
          }
          this.attributeNames[qName] = this.length;
          this[this.length++] = { qName, value, offset };
        },
        length: 0,
        getLocalName: function(i) {
          return this[i].localName;
        },
        getLocator: function(i) {
          return this[i].locator;
        },
        getQName: function(i) {
          return this[i].qName;
        },
        getURI: function(i) {
          return this[i].uri;
        },
        getValue: function(i) {
          return this[i].value;
        }
        //	,getIndex:function(uri, localName)){
        //		if(localName){
        //
        //		}else{
        //			var qName = uri
        //		}
        //	},
        //	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
        //	getType:function(uri,localName){}
        //	getType:function(i){},
      };
      exports.XMLReader = XMLReader;
      exports.parseUtils = parseUtils;
      exports.parseDoctypeCommentOrCData = parseDoctypeCommentOrCData;
    }
  });

  // node_modules/.pnpm/@xmldom+xmldom@0.9.12/node_modules/@xmldom/xmldom/lib/dom-parser.js
  var require_dom_parser = __commonJS({
    "node_modules/.pnpm/@xmldom+xmldom@0.9.12/node_modules/@xmldom/xmldom/lib/dom-parser.js"(exports) {
      "use strict";
      var conventions = require_conventions();
      var dom = require_dom();
      var errors = require_errors();
      var entities = require_entities();
      var sax = require_sax();
      var DOMImplementation = dom.DOMImplementation;
      var hasDefaultHTMLNamespace = conventions.hasDefaultHTMLNamespace;
      var isHTMLMimeType = conventions.isHTMLMimeType;
      var isValidMimeType = conventions.isValidMimeType;
      var MIME_TYPE = conventions.MIME_TYPE;
      var NAMESPACE = conventions.NAMESPACE;
      var ParseError = errors.ParseError;
      var XMLReader = sax.XMLReader;
      function normalizeLineEndings(input) {
        return input.replace(/\r[\n\u0085]/g, "\n").replace(/[\r\u0085\u2028\u2029]/g, "\n");
      }
      function DOMParser3(options) {
        options = options || {};
        if (options.locator === void 0) {
          options.locator = true;
        }
        this.assign = options.assign || conventions.assign;
        this.domHandler = options.domHandler || DOMHandler;
        this.onError = options.onError || options.errorHandler;
        if (options.errorHandler && typeof options.errorHandler !== "function") {
          throw new TypeError("errorHandler object is no longer supported, switch to onError!");
        } else if (options.errorHandler) {
          options.errorHandler("warning", "The `errorHandler` option has been deprecated, use `onError` instead!", this);
        }
        this.normalizeLineEndings = options.normalizeLineEndings || normalizeLineEndings;
        this.locator = !!options.locator;
        this.xmlns = this.assign(/* @__PURE__ */ Object.create(null), options.xmlns);
      }
      DOMParser3.prototype.parseFromString = function(source, mimeType) {
        if (!isValidMimeType(mimeType)) {
          throw new TypeError('DOMParser.parseFromString: the provided mimeType "' + mimeType + '" is not valid.');
        }
        var defaultNSMap = this.assign(/* @__PURE__ */ Object.create(null), this.xmlns);
        var entityMap = entities.XML_ENTITIES;
        var defaultNamespace = defaultNSMap[""] || null;
        if (hasDefaultHTMLNamespace(mimeType)) {
          entityMap = entities.HTML_ENTITIES;
          defaultNamespace = NAMESPACE.HTML;
        } else if (mimeType === MIME_TYPE.XML_SVG_IMAGE) {
          defaultNamespace = NAMESPACE.SVG;
        }
        defaultNSMap[""] = defaultNamespace;
        defaultNSMap.xml = defaultNSMap.xml || NAMESPACE.XML;
        var domBuilder = new this.domHandler({
          mimeType,
          defaultNamespace,
          onError: this.onError
        });
        var locator = this.locator ? {} : void 0;
        if (this.locator) {
          domBuilder.setDocumentLocator(locator);
        }
        var sax2 = new XMLReader();
        sax2.errorHandler = domBuilder;
        sax2.domBuilder = domBuilder;
        var isXml = !conventions.isHTMLMimeType(mimeType);
        if (isXml && typeof source !== "string") {
          sax2.errorHandler.fatalError("source is not a string");
        }
        sax2.parse(this.normalizeLineEndings(String(source)), defaultNSMap, entityMap);
        if (!domBuilder.doc.documentElement) {
          sax2.errorHandler.fatalError("missing root element");
        }
        return domBuilder.doc;
      };
      function DOMHandler(options) {
        var opt = options || {};
        this.mimeType = opt.mimeType || MIME_TYPE.XML_APPLICATION;
        this.defaultNamespace = opt.defaultNamespace || null;
        this.cdata = false;
        this.currentElement = void 0;
        this.doc = void 0;
        this.locator = void 0;
        this.onError = opt.onError;
      }
      function position(locator, node) {
        node.lineNumber = locator.lineNumber;
        node.columnNumber = locator.columnNumber;
      }
      DOMHandler.prototype = {
        /**
         * Either creates an XML or an HTML document and stores it under `this.doc`.
         * If it is an XML document, `this.defaultNamespace` is used to create it,
         * and it will not contain any `childNodes`.
         * If it is an HTML document, it will be created without any `childNodes`.
         *
         * @see http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
         */
        startDocument: function() {
          var impl = new DOMImplementation();
          this.doc = isHTMLMimeType(this.mimeType) ? impl.createHTMLDocument(false) : impl.createDocument(this.defaultNamespace, "");
        },
        startElement: function(namespaceURI, localName, qName, attrs) {
          var doc = this.doc;
          var el = doc.createElementNS(namespaceURI, qName || localName);
          var len = attrs.length;
          appendElement(this, el);
          this.currentElement = el;
          this.locator && position(this.locator, el);
          for (var i = 0; i < len; i++) {
            var namespaceURI = attrs.getURI(i);
            var value = attrs.getValue(i);
            var qName = attrs.getQName(i);
            var attr = doc.createAttributeNS(namespaceURI, qName);
            this.locator && position(attrs.getLocator(i), attr);
            attr.value = attr.nodeValue = value;
            el.setAttributeNode(attr);
          }
        },
        endElement: function(namespaceURI, localName, qName) {
          this.currentElement = this.currentElement.parentNode;
        },
        startPrefixMapping: function(prefix, uri) {
        },
        endPrefixMapping: function(prefix) {
        },
        processingInstruction: function(target, data) {
          var ins = this.doc.createProcessingInstruction(target, data);
          this.locator && position(this.locator, ins);
          appendElement(this, ins);
        },
        ignorableWhitespace: function(ch, start, length) {
        },
        characters: function(chars, start, length) {
          chars = _toString.apply(this, arguments);
          if (chars) {
            if (this.cdata) {
              var charNode = this.doc.createCDATASection(chars);
            } else {
              var charNode = this.doc.createTextNode(chars);
            }
            if (this.currentElement) {
              this.currentElement.appendChild(charNode);
            } else if (/^\s*$/.test(chars)) {
              this.doc.appendChild(charNode);
            }
            this.locator && position(this.locator, charNode);
          }
        },
        skippedEntity: function(name) {
        },
        endDocument: function() {
          this.doc.normalize();
        },
        /**
         * Stores the locator to be able to set the `columnNumber` and `lineNumber`
         * on the created DOM nodes.
         *
         * @param {Locator} locator
         */
        setDocumentLocator: function(locator) {
          if (locator) {
            locator.lineNumber = 0;
          }
          this.locator = locator;
        },
        //LexicalHandler
        comment: function(chars, start, length) {
          chars = _toString.apply(this, arguments);
          var comm = this.doc.createComment(chars);
          this.locator && position(this.locator, comm);
          appendElement(this, comm);
        },
        startCDATA: function() {
          this.cdata = true;
        },
        endCDATA: function() {
          this.cdata = false;
        },
        startDTD: function(name, publicId, systemId, internalSubset) {
          var impl = this.doc.implementation;
          if (impl && impl.createDocumentType) {
            var dt = impl.createDocumentType(name, publicId, systemId, internalSubset);
            this.locator && position(this.locator, dt);
            appendElement(this, dt);
            this.doc.doctype = dt;
          }
        },
        reportError: function(level, message) {
          if (typeof this.onError === "function") {
            try {
              this.onError(level, message, this);
            } catch (e) {
              throw new ParseError("Reporting " + level + ' "' + message + '" caused ' + e, this.locator);
            }
          } else {
            console.error("[xmldom " + level + "]	" + message, _locator(this.locator));
          }
        },
        /**
         * @see http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
         */
        warning: function(message) {
          this.reportError("warning", message);
        },
        error: function(message) {
          this.reportError("error", message);
        },
        /**
         * This function reports a fatal error and throws a ParseError.
         *
         * @param {string} message
         * - The message to be used for reporting and throwing the error.
         * @param {Error} [cause]
         * The error that caused this fatal error, preserved as the thrown `ParseError`'s `cause`.
         * @returns {never}
         * This function always throws an error and never returns a value.
         * @throws {ParseError}
         * Always throws a ParseError with the provided message.
         */
        fatalError: function(message, cause) {
          this.reportError("fatalError", message);
          throw new ParseError(message, this.locator, cause);
        }
      };
      function _locator(l) {
        if (l) {
          return "\n@#[line:" + l.lineNumber + ",col:" + l.columnNumber + "]";
        }
      }
      function _toString(chars, start, length) {
        if (typeof chars == "string") {
          return chars.substr(start, length);
        } else {
          if (chars.length >= start + length || start) {
            return new java.lang.String(chars, start, length) + "";
          }
          return chars;
        }
      }
      "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(
        /\w+/g,
        function(key) {
          DOMHandler.prototype[key] = function() {
            return null;
          };
        }
      );
      function appendElement(handler, node) {
        if (!handler.currentElement) {
          handler.doc.appendChild(node);
        } else {
          handler.currentElement.appendChild(node);
        }
      }
      function onErrorStopParsing(level) {
        if (level === "error") throw "onErrorStopParsing";
      }
      function onWarningStopParsing() {
        throw "onWarningStopParsing";
      }
      exports.__DOMHandler = DOMHandler;
      exports.DOMParser = DOMParser3;
      exports.normalizeLineEndings = normalizeLineEndings;
      exports.onErrorStopParsing = onErrorStopParsing;
      exports.onWarningStopParsing = onWarningStopParsing;
    }
  });

  // node_modules/.pnpm/@xmldom+xmldom@0.9.12/node_modules/@xmldom/xmldom/lib/index.js
  var require_lib = __commonJS({
    "node_modules/.pnpm/@xmldom+xmldom@0.9.12/node_modules/@xmldom/xmldom/lib/index.js"(exports) {
      "use strict";
      var conventions = require_conventions();
      exports.assign = conventions.assign;
      exports.hasDefaultHTMLNamespace = conventions.hasDefaultHTMLNamespace;
      exports.isHTMLMimeType = conventions.isHTMLMimeType;
      exports.isValidMimeType = conventions.isValidMimeType;
      exports.MIME_TYPE = conventions.MIME_TYPE;
      exports.NAMESPACE = conventions.NAMESPACE;
      var errors = require_errors();
      exports.DOMException = errors.DOMException;
      exports.DOMExceptionName = errors.DOMExceptionName;
      exports.ExceptionCode = errors.ExceptionCode;
      exports.ParseError = errors.ParseError;
      var dom = require_dom();
      exports.Attr = dom.Attr;
      exports.CDATASection = dom.CDATASection;
      exports.CharacterData = dom.CharacterData;
      exports.Comment = dom.Comment;
      exports.Document = dom.Document;
      exports.DocumentFragment = dom.DocumentFragment;
      exports.DocumentType = dom.DocumentType;
      exports.DOMImplementation = dom.DOMImplementation;
      exports.Element = dom.Element;
      exports.Entity = dom.Entity;
      exports.EntityReference = dom.EntityReference;
      exports.LiveNodeList = dom.LiveNodeList;
      exports.NamedNodeMap = dom.NamedNodeMap;
      exports.Node = dom.Node;
      exports.NodeList = dom.NodeList;
      exports.Notation = dom.Notation;
      exports.ProcessingInstruction = dom.ProcessingInstruction;
      exports.Text = dom.Text;
      exports.XMLSerializer = dom.XMLSerializer;
      var domParser = require_dom_parser();
      exports.DOMParser = domParser.DOMParser;
      exports.normalizeLineEndings = domParser.normalizeLineEndings;
      exports.onErrorStopParsing = domParser.onErrorStopParsing;
      exports.onWarningStopParsing = domParser.onWarningStopParsing;
    }
  });

  // node_modules/.pnpm/path-webpack@0.0.3/node_modules/path-webpack/path.js
  var require_path = __commonJS({
    "node_modules/.pnpm/path-webpack@0.0.3/node_modules/path-webpack/path.js"(exports, module) {
      "use strict";
      if (!process2) {
        process2 = {
          "cwd": function() {
            return "/";
          }
        };
      }
      var process2;
      function assertPath(path) {
        if (typeof path !== "string") {
          throw new TypeError("Path must be a string. Received " + path);
        }
      }
      function normalizeStringPosix(path, allowAboveRoot) {
        var res = "";
        var lastSlash = -1;
        var dots = 0;
        var code;
        for (var i = 0; i <= path.length; ++i) {
          if (i < path.length)
            code = path.charCodeAt(i);
          else if (code === 47)
            break;
          else
            code = 47;
          if (code === 47) {
            if (lastSlash === i - 1 || dots === 1) {
            } else if (lastSlash !== i - 1 && dots === 2) {
              if (res.length < 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
                if (res.length > 2) {
                  var start = res.length - 1;
                  var j = start;
                  for (; j >= 0; --j) {
                    if (res.charCodeAt(j) === 47)
                      break;
                  }
                  if (j !== start) {
                    if (j === -1)
                      res = "";
                    else
                      res = res.slice(0, j);
                    lastSlash = i;
                    dots = 0;
                    continue;
                  }
                } else if (res.length === 2 || res.length === 1) {
                  res = "";
                  lastSlash = i;
                  dots = 0;
                  continue;
                }
              }
              if (allowAboveRoot) {
                if (res.length > 0)
                  res += "/..";
                else
                  res = "..";
              }
            } else {
              if (res.length > 0)
                res += "/" + path.slice(lastSlash + 1, i);
              else
                res = path.slice(lastSlash + 1, i);
            }
            lastSlash = i;
            dots = 0;
          } else if (code === 46 && dots !== -1) {
            ++dots;
          } else {
            dots = -1;
          }
        }
        return res;
      }
      function _format(sep, pathObject) {
        var dir = pathObject.dir || pathObject.root;
        var base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
        if (!dir) {
          return base;
        }
        if (dir === pathObject.root) {
          return dir + base;
        }
        return dir + sep + base;
      }
      var posix = {
        // path.resolve([from ...], to)
        resolve: function resolve() {
          var resolvedPath = "";
          var resolvedAbsolute = false;
          var cwd;
          for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path;
            if (i >= 0)
              path = arguments[i];
            else {
              if (cwd === void 0)
                cwd = process2.cwd();
              path = cwd;
            }
            assertPath(path);
            if (path.length === 0) {
              continue;
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charCodeAt(0) === 47;
          }
          resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
          if (resolvedAbsolute) {
            if (resolvedPath.length > 0)
              return "/" + resolvedPath;
            else
              return "/";
          } else if (resolvedPath.length > 0) {
            return resolvedPath;
          } else {
            return ".";
          }
        },
        normalize: function normalize(path) {
          assertPath(path);
          if (path.length === 0)
            return ".";
          var isAbsolute = path.charCodeAt(0) === 47;
          var trailingSeparator = path.charCodeAt(path.length - 1) === 47;
          path = normalizeStringPosix(path, !isAbsolute);
          if (path.length === 0 && !isAbsolute)
            path = ".";
          if (path.length > 0 && trailingSeparator)
            path += "/";
          if (isAbsolute)
            return "/" + path;
          return path;
        },
        isAbsolute: function isAbsolute(path) {
          assertPath(path);
          return path.length > 0 && path.charCodeAt(0) === 47;
        },
        join: function join() {
          if (arguments.length === 0)
            return ".";
          var joined;
          for (var i = 0; i < arguments.length; ++i) {
            var arg = arguments[i];
            assertPath(arg);
            if (arg.length > 0) {
              if (joined === void 0)
                joined = arg;
              else
                joined += "/" + arg;
            }
          }
          if (joined === void 0)
            return ".";
          return posix.normalize(joined);
        },
        relative: function relative(from, to) {
          assertPath(from);
          assertPath(to);
          if (from === to)
            return "";
          from = posix.resolve(from);
          to = posix.resolve(to);
          if (from === to)
            return "";
          var fromStart = 1;
          for (; fromStart < from.length; ++fromStart) {
            if (from.charCodeAt(fromStart) !== 47)
              break;
          }
          var fromEnd = from.length;
          var fromLen = fromEnd - fromStart;
          var toStart = 1;
          for (; toStart < to.length; ++toStart) {
            if (to.charCodeAt(toStart) !== 47)
              break;
          }
          var toEnd = to.length;
          var toLen = toEnd - toStart;
          var length = fromLen < toLen ? fromLen : toLen;
          var lastCommonSep = -1;
          var i = 0;
          for (; i <= length; ++i) {
            if (i === length) {
              if (toLen > length) {
                if (to.charCodeAt(toStart + i) === 47) {
                  return to.slice(toStart + i + 1);
                } else if (i === 0) {
                  return to.slice(toStart + i);
                }
              } else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === 47) {
                  lastCommonSep = i;
                } else if (i === 0) {
                  lastCommonSep = 0;
                }
              }
              break;
            }
            var fromCode = from.charCodeAt(fromStart + i);
            var toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode)
              break;
            else if (fromCode === 47)
              lastCommonSep = i;
          }
          var out = "";
          for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
            if (i === fromEnd || from.charCodeAt(i) === 47) {
              if (out.length === 0)
                out += "..";
              else
                out += "/..";
            }
          }
          if (out.length > 0)
            return out + to.slice(toStart + lastCommonSep);
          else {
            toStart += lastCommonSep;
            if (to.charCodeAt(toStart) === 47)
              ++toStart;
            return to.slice(toStart);
          }
        },
        _makeLong: function _makeLong(path) {
          return path;
        },
        dirname: function dirname(path) {
          assertPath(path);
          if (path.length === 0)
            return ".";
          var code = path.charCodeAt(0);
          var hasRoot = code === 47;
          var end = -1;
          var matchedSlash = true;
          for (var i = path.length - 1; i >= 1; --i) {
            code = path.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                end = i;
                break;
              }
            } else {
              matchedSlash = false;
            }
          }
          if (end === -1)
            return hasRoot ? "/" : ".";
          if (hasRoot && end === 1)
            return "//";
          return path.slice(0, end);
        },
        basename: function basename(path, ext) {
          if (ext !== void 0 && typeof ext !== "string")
            throw new TypeError('"ext" argument must be a string');
          assertPath(path);
          var start = 0;
          var end = -1;
          var matchedSlash = true;
          var i;
          if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path)
              return "";
            var extIdx = ext.length - 1;
            var firstNonSlashEnd = -1;
            for (i = path.length - 1; i >= 0; --i) {
              var code = path.charCodeAt(i);
              if (code === 47) {
                if (!matchedSlash) {
                  start = i + 1;
                  break;
                }
              } else {
                if (firstNonSlashEnd === -1) {
                  matchedSlash = false;
                  firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                  if (code === ext.charCodeAt(extIdx)) {
                    if (--extIdx === -1) {
                      end = i;
                    }
                  } else {
                    extIdx = -1;
                    end = firstNonSlashEnd;
                  }
                }
              }
            }
            if (start === end)
              end = firstNonSlashEnd;
            else if (end === -1)
              end = path.length;
            return path.slice(start, end);
          } else {
            for (i = path.length - 1; i >= 0; --i) {
              if (path.charCodeAt(i) === 47) {
                if (!matchedSlash) {
                  start = i + 1;
                  break;
                }
              } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
              }
            }
            if (end === -1)
              return "";
            return path.slice(start, end);
          }
        },
        extname: function extname(path) {
          assertPath(path);
          var startDot = -1;
          var startPart = 0;
          var end = -1;
          var matchedSlash = true;
          var preDotState = 0;
          for (var i = path.length - 1; i >= 0; --i) {
            var code = path.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                startPart = i + 1;
                break;
              }
              continue;
            }
            if (end === -1) {
              matchedSlash = false;
              end = i + 1;
            }
            if (code === 46) {
              if (startDot === -1)
                startDot = i;
              else if (preDotState !== 1)
                preDotState = 1;
            } else if (startDot !== -1) {
              preDotState = -1;
            }
          }
          if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
          preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
          preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            return "";
          }
          return path.slice(startDot, end);
        },
        format: function format(pathObject) {
          if (pathObject === null || typeof pathObject !== "object") {
            throw new TypeError(
              'Parameter "pathObject" must be an object, not ' + typeof pathObject
            );
          }
          return _format("/", pathObject);
        },
        parse: function parse(path) {
          assertPath(path);
          var ret = { root: "", dir: "", base: "", ext: "", name: "" };
          if (path.length === 0)
            return ret;
          var code = path.charCodeAt(0);
          var isAbsolute = code === 47;
          var start;
          if (isAbsolute) {
            ret.root = "/";
            start = 1;
          } else {
            start = 0;
          }
          var startDot = -1;
          var startPart = 0;
          var end = -1;
          var matchedSlash = true;
          var i = path.length - 1;
          var preDotState = 0;
          for (; i >= start; --i) {
            code = path.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                startPart = i + 1;
                break;
              }
              continue;
            }
            if (end === -1) {
              matchedSlash = false;
              end = i + 1;
            }
            if (code === 46) {
              if (startDot === -1)
                startDot = i;
              else if (preDotState !== 1)
                preDotState = 1;
            } else if (startDot !== -1) {
              preDotState = -1;
            }
          }
          if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
          preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
          preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            if (end !== -1) {
              if (startPart === 0 && isAbsolute)
                ret.base = ret.name = path.slice(1, end);
              else
                ret.base = ret.name = path.slice(startPart, end);
            }
          } else {
            if (startPart === 0 && isAbsolute) {
              ret.name = path.slice(1, startDot);
              ret.base = path.slice(1, end);
            } else {
              ret.name = path.slice(startPart, startDot);
              ret.base = path.slice(startPart, end);
            }
            ret.ext = path.slice(startDot, end);
          }
          if (startPart > 0)
            ret.dir = path.slice(0, startPart - 1);
          else if (isAbsolute)
            ret.dir = "/";
          return ret;
        },
        sep: "/",
        delimiter: ":",
        posix: null
      };
      module.exports = posix;
    }
  });

  // node_modules/.pnpm/@xmldom+xmldom@0.7.13/node_modules/@xmldom/xmldom/lib/conventions.js
  var require_conventions2 = __commonJS({
    "node_modules/.pnpm/@xmldom+xmldom@0.7.13/node_modules/@xmldom/xmldom/lib/conventions.js"(exports) {
      "use strict";
      function find(list, predicate, ac) {
        if (ac === void 0) {
          ac = Array.prototype;
        }
        if (list && typeof ac.find === "function") {
          return ac.find.call(list, predicate);
        }
        for (var i = 0; i < list.length; i++) {
          if (Object.prototype.hasOwnProperty.call(list, i)) {
            var item = list[i];
            if (predicate.call(void 0, item, i, list)) {
              return item;
            }
          }
        }
      }
      function freeze(object, oc) {
        if (oc === void 0) {
          oc = Object;
        }
        return oc && typeof oc.freeze === "function" ? oc.freeze(object) : object;
      }
      var MIME_TYPE = freeze({
        /**
         * `text/html`, the only mime type that triggers treating an XML document as HTML.
         *
         * @see DOMParser.SupportedType.isHTML
         * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
         * @see https://en.wikipedia.org/wiki/HTML Wikipedia
         * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
         * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring WHATWG HTML Spec
         */
        HTML: "text/html",
        /**
         * Helper method to check a mime type if it indicates an HTML document
         *
         * @param {string} [value]
         * @returns {boolean}
         *
         * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
         * @see https://en.wikipedia.org/wiki/HTML Wikipedia
         * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
         * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring 	 */
        isHTML: function(value) {
          return value === MIME_TYPE.HTML;
        },
        /**
         * `application/xml`, the standard mime type for XML documents.
         *
         * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType registration
         * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
         * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
         */
        XML_APPLICATION: "application/xml",
        /**
         * `text/html`, an alias for `application/xml`.
         *
         * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
         * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
         * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
         */
        XML_TEXT: "text/xml",
        /**
         * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
         * but is parsed as an XML document.
         *
         * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType registration
         * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
         * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
         */
        XML_XHTML_APPLICATION: "application/xhtml+xml",
        /**
         * `image/svg+xml`,
         *
         * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
         * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
         * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
         */
        XML_SVG_IMAGE: "image/svg+xml"
      });
      var NAMESPACE = freeze({
        /**
         * The XHTML namespace.
         *
         * @see http://www.w3.org/1999/xhtml
         */
        HTML: "http://www.w3.org/1999/xhtml",
        /**
         * Checks if `uri` equals `NAMESPACE.HTML`.
         *
         * @param {string} [uri]
         *
         * @see NAMESPACE.HTML
         */
        isHTML: function(uri) {
          return uri === NAMESPACE.HTML;
        },
        /**
         * The SVG namespace.
         *
         * @see http://www.w3.org/2000/svg
         */
        SVG: "http://www.w3.org/2000/svg",
        /**
         * The `xml:` namespace.
         *
         * @see http://www.w3.org/XML/1998/namespace
         */
        XML: "http://www.w3.org/XML/1998/namespace",
        /**
         * The `xmlns:` namespace
         *
         * @see https://www.w3.org/2000/xmlns/
         */
        XMLNS: "http://www.w3.org/2000/xmlns/"
      });
      exports.find = find;
      exports.freeze = freeze;
      exports.MIME_TYPE = MIME_TYPE;
      exports.NAMESPACE = NAMESPACE;
    }
  });

  // node_modules/.pnpm/@xmldom+xmldom@0.7.13/node_modules/@xmldom/xmldom/lib/dom.js
  var require_dom2 = __commonJS({
    "node_modules/.pnpm/@xmldom+xmldom@0.7.13/node_modules/@xmldom/xmldom/lib/dom.js"(exports) {
      var conventions = require_conventions2();
      var find = conventions.find;
      var NAMESPACE = conventions.NAMESPACE;
      function notEmptyString(input) {
        return input !== "";
      }
      function splitOnASCIIWhitespace(input) {
        return input ? input.split(/[\t\n\f\r ]+/).filter(notEmptyString) : [];
      }
      function orderedSetReducer(current, element) {
        if (!current.hasOwnProperty(element)) {
          current[element] = true;
        }
        return current;
      }
      function toOrderedSet(input) {
        if (!input) return [];
        var list = splitOnASCIIWhitespace(input);
        return Object.keys(list.reduce(orderedSetReducer, {}));
      }
      function arrayIncludes(list) {
        return function(element) {
          return list && list.indexOf(element) !== -1;
        };
      }
      function copy(src, dest) {
        for (var p in src) {
          if (Object.prototype.hasOwnProperty.call(src, p)) {
            dest[p] = src[p];
          }
        }
      }
      function _extends(Class, Super) {
        var pt = Class.prototype;
        if (!(pt instanceof Super)) {
          let t2 = function() {
          };
          var t = t2;
          ;
          t2.prototype = Super.prototype;
          t2 = new t2();
          copy(pt, t2);
          Class.prototype = pt = t2;
        }
        if (pt.constructor != Class) {
          if (typeof Class != "function") {
            console.error("unknown Class:" + Class);
          }
          pt.constructor = Class;
        }
      }
      var NodeType = {};
      var ELEMENT_NODE = NodeType.ELEMENT_NODE = 1;
      var ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE = 2;
      var TEXT_NODE = NodeType.TEXT_NODE = 3;
      var CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE = 4;
      var ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE = 5;
      var ENTITY_NODE = NodeType.ENTITY_NODE = 6;
      var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
      var COMMENT_NODE = NodeType.COMMENT_NODE = 8;
      var DOCUMENT_NODE = NodeType.DOCUMENT_NODE = 9;
      var DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE = 10;
      var DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE = 11;
      var NOTATION_NODE = NodeType.NOTATION_NODE = 12;
      var ExceptionCode = {};
      var ExceptionMessage = {};
      var INDEX_SIZE_ERR = ExceptionCode.INDEX_SIZE_ERR = (ExceptionMessage[1] = "Index size error", 1);
      var DOMSTRING_SIZE_ERR = ExceptionCode.DOMSTRING_SIZE_ERR = (ExceptionMessage[2] = "DOMString size error", 2);
      var HIERARCHY_REQUEST_ERR = ExceptionCode.HIERARCHY_REQUEST_ERR = (ExceptionMessage[3] = "Hierarchy request error", 3);
      var WRONG_DOCUMENT_ERR = ExceptionCode.WRONG_DOCUMENT_ERR = (ExceptionMessage[4] = "Wrong document", 4);
      var INVALID_CHARACTER_ERR = ExceptionCode.INVALID_CHARACTER_ERR = (ExceptionMessage[5] = "Invalid character", 5);
      var NO_DATA_ALLOWED_ERR = ExceptionCode.NO_DATA_ALLOWED_ERR = (ExceptionMessage[6] = "No data allowed", 6);
      var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = (ExceptionMessage[7] = "No modification allowed", 7);
      var NOT_FOUND_ERR = ExceptionCode.NOT_FOUND_ERR = (ExceptionMessage[8] = "Not found", 8);
      var NOT_SUPPORTED_ERR = ExceptionCode.NOT_SUPPORTED_ERR = (ExceptionMessage[9] = "Not supported", 9);
      var INUSE_ATTRIBUTE_ERR = ExceptionCode.INUSE_ATTRIBUTE_ERR = (ExceptionMessage[10] = "Attribute in use", 10);
      var INVALID_STATE_ERR = ExceptionCode.INVALID_STATE_ERR = (ExceptionMessage[11] = "Invalid state", 11);
      var SYNTAX_ERR = ExceptionCode.SYNTAX_ERR = (ExceptionMessage[12] = "Syntax error", 12);
      var INVALID_MODIFICATION_ERR = ExceptionCode.INVALID_MODIFICATION_ERR = (ExceptionMessage[13] = "Invalid modification", 13);
      var NAMESPACE_ERR = ExceptionCode.NAMESPACE_ERR = (ExceptionMessage[14] = "Invalid namespace", 14);
      var INVALID_ACCESS_ERR = ExceptionCode.INVALID_ACCESS_ERR = (ExceptionMessage[15] = "Invalid access", 15);
      function DOMException(code, message) {
        if (message instanceof Error) {
          var error = message;
        } else {
          error = this;
          Error.call(this, ExceptionMessage[code]);
          this.message = ExceptionMessage[code];
          if (Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
        }
        error.code = code;
        if (message) this.message = this.message + ": " + message;
        return error;
      }
      DOMException.prototype = Error.prototype;
      copy(ExceptionCode, DOMException);
      function NodeList() {
      }
      NodeList.prototype = {
        /**
         * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
         * @standard level1
         */
        length: 0,
        /**
         * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
         * @standard level1
         * @param index  unsigned long
         *   Index into the collection.
         * @return Node
         * 	The node at the indexth position in the NodeList, or null if that is not a valid index.
         */
        item: function(index) {
          return index >= 0 && index < this.length ? this[index] : null;
        },
        toString: function(isHTML, nodeFilter) {
          for (var buf = [], i = 0; i < this.length; i++) {
            serializeToString(this[i], buf, isHTML, nodeFilter);
          }
          return buf.join("");
        },
        /**
         * @private
         * @param {function (Node):boolean} predicate
         * @returns {Node[]}
         */
        filter: function(predicate) {
          return Array.prototype.filter.call(this, predicate);
        },
        /**
         * @private
         * @param {Node} item
         * @returns {number}
         */
        indexOf: function(item) {
          return Array.prototype.indexOf.call(this, item);
        }
      };
      function LiveNodeList(node, refresh) {
        this._node = node;
        this._refresh = refresh;
        _updateLiveList(this);
      }
      function _updateLiveList(list) {
        var inc = list._node._inc || list._node.ownerDocument._inc;
        if (list._inc !== inc) {
          var ls = list._refresh(list._node);
          __set__(list, "length", ls.length);
          if (!list.$$length || ls.length < list.$$length) {
            for (var i = ls.length; i in list; i++) {
              if (Object.prototype.hasOwnProperty.call(list, i)) {
                delete list[i];
              }
            }
          }
          copy(ls, list);
          list._inc = inc;
        }
      }
      LiveNodeList.prototype.item = function(i) {
        _updateLiveList(this);
        return this[i] || null;
      };
      _extends(LiveNodeList, NodeList);
      function NamedNodeMap() {
      }
      function _findNodeIndex(list, node) {
        var i = list.length;
        while (i--) {
          if (list[i] === node) {
            return i;
          }
        }
      }
      function _addNamedNode(el, list, newAttr, oldAttr) {
        if (oldAttr) {
          list[_findNodeIndex(list, oldAttr)] = newAttr;
        } else {
          list[list.length++] = newAttr;
        }
        if (el) {
          newAttr.ownerElement = el;
          var doc = el.ownerDocument;
          if (doc) {
            oldAttr && _onRemoveAttribute(doc, el, oldAttr);
            _onAddAttribute(doc, el, newAttr);
          }
        }
      }
      function _removeNamedNode(el, list, attr) {
        var i = _findNodeIndex(list, attr);
        if (i >= 0) {
          var lastIndex = list.length - 1;
          while (i < lastIndex) {
            list[i] = list[++i];
          }
          list.length = lastIndex;
          if (el) {
            var doc = el.ownerDocument;
            if (doc) {
              _onRemoveAttribute(doc, el, attr);
              attr.ownerElement = null;
            }
          }
        } else {
          throw new DOMException(NOT_FOUND_ERR, new Error(el.tagName + "@" + attr));
        }
      }
      NamedNodeMap.prototype = {
        length: 0,
        item: NodeList.prototype.item,
        getNamedItem: function(key) {
          var i = this.length;
          while (i--) {
            var attr = this[i];
            if (attr.nodeName == key) {
              return attr;
            }
          }
        },
        setNamedItem: function(attr) {
          var el = attr.ownerElement;
          if (el && el != this._ownerElement) {
            throw new DOMException(INUSE_ATTRIBUTE_ERR);
          }
          var oldAttr = this.getNamedItem(attr.nodeName);
          _addNamedNode(this._ownerElement, this, attr, oldAttr);
          return oldAttr;
        },
        /* returns Node */
        setNamedItemNS: function(attr) {
          var el = attr.ownerElement, oldAttr;
          if (el && el != this._ownerElement) {
            throw new DOMException(INUSE_ATTRIBUTE_ERR);
          }
          oldAttr = this.getNamedItemNS(attr.namespaceURI, attr.localName);
          _addNamedNode(this._ownerElement, this, attr, oldAttr);
          return oldAttr;
        },
        /* returns Node */
        removeNamedItem: function(key) {
          var attr = this.getNamedItem(key);
          _removeNamedNode(this._ownerElement, this, attr);
          return attr;
        },
        // raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
        //for level2
        removeNamedItemNS: function(namespaceURI, localName) {
          var attr = this.getNamedItemNS(namespaceURI, localName);
          _removeNamedNode(this._ownerElement, this, attr);
          return attr;
        },
        getNamedItemNS: function(namespaceURI, localName) {
          var i = this.length;
          while (i--) {
            var node = this[i];
            if (node.localName == localName && node.namespaceURI == namespaceURI) {
              return node;
            }
          }
          return null;
        }
      };
      function DOMImplementation() {
      }
      DOMImplementation.prototype = {
        /**
         * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given feature is supported.
         * The different implementations fairly diverged in what kind of features were reported.
         * The latest version of the spec settled to force this method to always return true, where the functionality was accurate and in use.
         *
         * @deprecated It is deprecated and modern browsers return true in all cases.
         *
         * @param {string} feature
         * @param {string} [version]
         * @returns {boolean} always true
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
         * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
         * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
         */
        hasFeature: function(feature, version) {
          return true;
        },
        /**
         * Creates an XML Document object of the specified type with its document element.
         *
         * __It behaves slightly different from the description in the living standard__:
         * - There is no interface/class `XMLDocument`, it returns a `Document` instance.
         * - `contentType`, `encoding`, `mode`, `origin`, `url` fields are currently not declared.
         * - this implementation is not validating names or qualified names
         *   (when parsing XML strings, the SAX parser takes care of that)
         *
         * @param {string|null} namespaceURI
         * @param {string} qualifiedName
         * @param {DocumentType=null} doctype
         * @returns {Document}
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
         * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM Level 2 Core (initial)
         * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument  DOM Level 2 Core
         *
         * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
         * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
         * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
         */
        createDocument: function(namespaceURI, qualifiedName, doctype) {
          var doc = new Document();
          doc.implementation = this;
          doc.childNodes = new NodeList();
          doc.doctype = doctype || null;
          if (doctype) {
            doc.appendChild(doctype);
          }
          if (qualifiedName) {
            var root = doc.createElementNS(namespaceURI, qualifiedName);
            doc.appendChild(root);
          }
          return doc;
        },
        /**
         * Returns a doctype, with the given `qualifiedName`, `publicId`, and `systemId`.
         *
         * __This behavior is slightly different from the in the specs__:
         * - this implementation is not validating names or qualified names
         *   (when parsing XML strings, the SAX parser takes care of that)
         *
         * @param {string} qualifiedName
         * @param {string} [publicId]
         * @param {string} [systemId]
         * @returns {DocumentType} which can either be used with `DOMImplementation.createDocument` upon document creation
         * 				  or can be put into the document via methods like `Node.insertBefore()` or `Node.replaceChild()`
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType MDN
         * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM Level 2 Core
         * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living Standard
         *
         * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
         * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
         * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
         */
        createDocumentType: function(qualifiedName, publicId, systemId) {
          var node = new DocumentType();
          node.name = qualifiedName;
          node.nodeName = qualifiedName;
          node.publicId = publicId || "";
          node.systemId = systemId || "";
          return node;
        }
      };
      function Node2() {
      }
      Node2.prototype = {
        firstChild: null,
        lastChild: null,
        previousSibling: null,
        nextSibling: null,
        attributes: null,
        parentNode: null,
        childNodes: null,
        ownerDocument: null,
        nodeValue: null,
        namespaceURI: null,
        prefix: null,
        localName: null,
        // Modified in DOM Level 2:
        insertBefore: function(newChild, refChild) {
          return _insertBefore(this, newChild, refChild);
        },
        replaceChild: function(newChild, oldChild) {
          _insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
          if (oldChild) {
            this.removeChild(oldChild);
          }
        },
        removeChild: function(oldChild) {
          return _removeChild(this, oldChild);
        },
        appendChild: function(newChild) {
          return this.insertBefore(newChild, null);
        },
        hasChildNodes: function() {
          return this.firstChild != null;
        },
        cloneNode: function(deep) {
          return cloneNode(this.ownerDocument || this, this, deep);
        },
        // Modified in DOM Level 2:
        normalize: function() {
          var child = this.firstChild;
          while (child) {
            var next = child.nextSibling;
            if (next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE) {
              this.removeChild(next);
              child.appendData(next.data);
            } else {
              child.normalize();
              child = next;
            }
          }
        },
        // Introduced in DOM Level 2:
        isSupported: function(feature, version) {
          return this.ownerDocument.implementation.hasFeature(feature, version);
        },
        // Introduced in DOM Level 2:
        hasAttributes: function() {
          return this.attributes.length > 0;
        },
        /**
         * Look up the prefix associated to the given namespace URI, starting from this node.
         * **The default namespace declarations are ignored by this method.**
         * See Namespace Prefix Lookup for details on the algorithm used by this method.
         *
         * _Note: The implementation seems to be incomplete when compared to the algorithm described in the specs._
         *
         * @param {string | null} namespaceURI
         * @returns {string | null}
         * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespacePrefix
         * @see https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespacePrefixAlgo
         * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
         * @see https://github.com/xmldom/xmldom/issues/322
         */
        lookupPrefix: function(namespaceURI) {
          var el = this;
          while (el) {
            var map = el._nsMap;
            if (map) {
              for (var n in map) {
                if (Object.prototype.hasOwnProperty.call(map, n) && map[n] === namespaceURI) {
                  return n;
                }
              }
            }
            el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
          }
          return null;
        },
        // Introduced in DOM Level 3:
        lookupNamespaceURI: function(prefix) {
          var el = this;
          while (el) {
            var map = el._nsMap;
            if (map) {
              if (prefix in map) {
                if (Object.prototype.hasOwnProperty.call(map, prefix)) {
                  return map[prefix];
                }
              }
            }
            el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
          }
          return null;
        },
        // Introduced in DOM Level 3:
        isDefaultNamespace: function(namespaceURI) {
          var prefix = this.lookupPrefix(namespaceURI);
          return prefix == null;
        }
      };
      function _xmlEncoder(c) {
        return c == "<" && "&lt;" || c == ">" && "&gt;" || c == "&" && "&amp;" || c == '"' && "&quot;" || "&#" + c.charCodeAt() + ";";
      }
      copy(NodeType, Node2);
      copy(NodeType, Node2.prototype);
      function _visitNode(node, callback) {
        if (callback(node)) {
          return true;
        }
        if (node = node.firstChild) {
          do {
            if (_visitNode(node, callback)) {
              return true;
            }
          } while (node = node.nextSibling);
        }
      }
      function Document() {
        this.ownerDocument = this;
      }
      function _onAddAttribute(doc, el, newAttr) {
        doc && doc._inc++;
        var ns = newAttr.namespaceURI;
        if (ns === NAMESPACE.XMLNS) {
          el._nsMap[newAttr.prefix ? newAttr.localName : ""] = newAttr.value;
        }
      }
      function _onRemoveAttribute(doc, el, newAttr, remove) {
        doc && doc._inc++;
        var ns = newAttr.namespaceURI;
        if (ns === NAMESPACE.XMLNS) {
          delete el._nsMap[newAttr.prefix ? newAttr.localName : ""];
        }
      }
      function _onUpdateChild(doc, el, newChild) {
        if (doc && doc._inc) {
          doc._inc++;
          var cs = el.childNodes;
          if (newChild) {
            cs[cs.length++] = newChild;
          } else {
            var child = el.firstChild;
            var i = 0;
            while (child) {
              cs[i++] = child;
              child = child.nextSibling;
            }
            cs.length = i;
            delete cs[cs.length];
          }
        }
      }
      function _removeChild(parentNode, child) {
        var previous = child.previousSibling;
        var next = child.nextSibling;
        if (previous) {
          previous.nextSibling = next;
        } else {
          parentNode.firstChild = next;
        }
        if (next) {
          next.previousSibling = previous;
        } else {
          parentNode.lastChild = previous;
        }
        child.parentNode = null;
        child.previousSibling = null;
        child.nextSibling = null;
        _onUpdateChild(parentNode.ownerDocument, parentNode);
        return child;
      }
      function hasValidParentNodeType(node) {
        return node && (node.nodeType === Node2.DOCUMENT_NODE || node.nodeType === Node2.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node2.ELEMENT_NODE);
      }
      function hasInsertableNodeType(node) {
        return node && (isElementNode(node) || isTextNode(node) || isDocTypeNode(node) || node.nodeType === Node2.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node2.COMMENT_NODE || node.nodeType === Node2.PROCESSING_INSTRUCTION_NODE);
      }
      function isDocTypeNode(node) {
        return node && node.nodeType === Node2.DOCUMENT_TYPE_NODE;
      }
      function isElementNode(node) {
        return node && node.nodeType === Node2.ELEMENT_NODE;
      }
      function isTextNode(node) {
        return node && node.nodeType === Node2.TEXT_NODE;
      }
      function isElementInsertionPossible(doc, child) {
        var parentChildNodes = doc.childNodes || [];
        if (find(parentChildNodes, isElementNode) || isDocTypeNode(child)) {
          return false;
        }
        var docTypeNode = find(parentChildNodes, isDocTypeNode);
        return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
      }
      function isElementReplacementPossible(doc, child) {
        var parentChildNodes = doc.childNodes || [];
        function hasElementChildThatIsNotChild(node) {
          return isElementNode(node) && node !== child;
        }
        if (find(parentChildNodes, hasElementChildThatIsNotChild)) {
          return false;
        }
        var docTypeNode = find(parentChildNodes, isDocTypeNode);
        return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
      }
      function assertPreInsertionValidity1to5(parent2, node, child) {
        if (!hasValidParentNodeType(parent2)) {
          throw new DOMException(HIERARCHY_REQUEST_ERR, "Unexpected parent node type " + parent2.nodeType);
        }
        if (child && child.parentNode !== parent2) {
          throw new DOMException(NOT_FOUND_ERR, "child not in parent");
        }
        if (
          // 4. If `node` is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw a "HierarchyRequestError" DOMException.
          !hasInsertableNodeType(node) || // 5. If either `node` is a Text node and `parent` is a document,
          // the sax parser currently adds top level text nodes, this will be fixed in 0.9.0
          // || (node.nodeType === Node.TEXT_NODE && parent.nodeType === Node.DOCUMENT_NODE)
          // or `node` is a doctype and `parent` is not a document, then throw a "HierarchyRequestError" DOMException.
          isDocTypeNode(node) && parent2.nodeType !== Node2.DOCUMENT_NODE
        ) {
          throw new DOMException(
            HIERARCHY_REQUEST_ERR,
            "Unexpected node type " + node.nodeType + " for parent node type " + parent2.nodeType
          );
        }
      }
      function assertPreInsertionValidityInDocument(parent2, node, child) {
        var parentChildNodes = parent2.childNodes || [];
        var nodeChildNodes = node.childNodes || [];
        if (node.nodeType === Node2.DOCUMENT_FRAGMENT_NODE) {
          var nodeChildElements = nodeChildNodes.filter(isElementNode);
          if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
          }
          if (nodeChildElements.length === 1 && !isElementInsertionPossible(parent2, child)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
          }
        }
        if (isElementNode(node)) {
          if (!isElementInsertionPossible(parent2, child)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
          }
        }
        if (isDocTypeNode(node)) {
          if (find(parentChildNodes, isDocTypeNode)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
          }
          var parentElementChild = find(parentChildNodes, isElementNode);
          if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
          }
          if (!child && parentElementChild) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "Doctype can not be appended since element is present");
          }
        }
      }
      function assertPreReplacementValidityInDocument(parent2, node, child) {
        var parentChildNodes = parent2.childNodes || [];
        var nodeChildNodes = node.childNodes || [];
        if (node.nodeType === Node2.DOCUMENT_FRAGMENT_NODE) {
          var nodeChildElements = nodeChildNodes.filter(isElementNode);
          if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
          }
          if (nodeChildElements.length === 1 && !isElementReplacementPossible(parent2, child)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
          }
        }
        if (isElementNode(node)) {
          if (!isElementReplacementPossible(parent2, child)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
          }
        }
        if (isDocTypeNode(node)) {
          let hasDoctypeChildThatIsNotChild2 = function(node2) {
            return isDocTypeNode(node2) && node2 !== child;
          };
          var hasDoctypeChildThatIsNotChild = hasDoctypeChildThatIsNotChild2;
          if (find(parentChildNodes, hasDoctypeChildThatIsNotChild2)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
          }
          var parentElementChild = find(parentChildNodes, isElementNode);
          if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
          }
        }
      }
      function _insertBefore(parent2, node, child, _inDocumentAssertion) {
        assertPreInsertionValidity1to5(parent2, node, child);
        if (parent2.nodeType === Node2.DOCUMENT_NODE) {
          (_inDocumentAssertion || assertPreInsertionValidityInDocument)(parent2, node, child);
        }
        var cp = node.parentNode;
        if (cp) {
          cp.removeChild(node);
        }
        if (node.nodeType === DOCUMENT_FRAGMENT_NODE) {
          var newFirst = node.firstChild;
          if (newFirst == null) {
            return node;
          }
          var newLast = node.lastChild;
        } else {
          newFirst = newLast = node;
        }
        var pre = child ? child.previousSibling : parent2.lastChild;
        newFirst.previousSibling = pre;
        newLast.nextSibling = child;
        if (pre) {
          pre.nextSibling = newFirst;
        } else {
          parent2.firstChild = newFirst;
        }
        if (child == null) {
          parent2.lastChild = newLast;
        } else {
          child.previousSibling = newLast;
        }
        do {
          newFirst.parentNode = parent2;
        } while (newFirst !== newLast && (newFirst = newFirst.nextSibling));
        _onUpdateChild(parent2.ownerDocument || parent2, parent2);
        if (node.nodeType == DOCUMENT_FRAGMENT_NODE) {
          node.firstChild = node.lastChild = null;
        }
        return node;
      }
      function _appendSingleChild(parentNode, newChild) {
        if (newChild.parentNode) {
          newChild.parentNode.removeChild(newChild);
        }
        newChild.parentNode = parentNode;
        newChild.previousSibling = parentNode.lastChild;
        newChild.nextSibling = null;
        if (newChild.previousSibling) {
          newChild.previousSibling.nextSibling = newChild;
        } else {
          parentNode.firstChild = newChild;
        }
        parentNode.lastChild = newChild;
        _onUpdateChild(parentNode.ownerDocument, parentNode, newChild);
        return newChild;
      }
      Document.prototype = {
        //implementation : null,
        nodeName: "#document",
        nodeType: DOCUMENT_NODE,
        /**
         * The DocumentType node of the document.
         *
         * @readonly
         * @type DocumentType
         */
        doctype: null,
        documentElement: null,
        _inc: 1,
        insertBefore: function(newChild, refChild) {
          if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
            var child = newChild.firstChild;
            while (child) {
              var next = child.nextSibling;
              this.insertBefore(child, refChild);
              child = next;
            }
            return newChild;
          }
          _insertBefore(this, newChild, refChild);
          newChild.ownerDocument = this;
          if (this.documentElement === null && newChild.nodeType === ELEMENT_NODE) {
            this.documentElement = newChild;
          }
          return newChild;
        },
        removeChild: function(oldChild) {
          if (this.documentElement == oldChild) {
            this.documentElement = null;
          }
          return _removeChild(this, oldChild);
        },
        replaceChild: function(newChild, oldChild) {
          _insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
          newChild.ownerDocument = this;
          if (oldChild) {
            this.removeChild(oldChild);
          }
          if (isElementNode(newChild)) {
            this.documentElement = newChild;
          }
        },
        // Introduced in DOM Level 2:
        importNode: function(importedNode, deep) {
          return importNode(this, importedNode, deep);
        },
        // Introduced in DOM Level 2:
        getElementById: function(id) {
          var rtv = null;
          _visitNode(this.documentElement, function(node) {
            if (node.nodeType == ELEMENT_NODE) {
              if (node.getAttribute("id") == id) {
                rtv = node;
                return true;
              }
            }
          });
          return rtv;
        },
        /**
         * The `getElementsByClassName` method of `Document` interface returns an array-like object
         * of all child elements which have **all** of the given class name(s).
         *
         * Returns an empty list if `classeNames` is an empty string or only contains HTML white space characters.
         *
         *
         * Warning: This is a live LiveNodeList.
         * Changes in the DOM will reflect in the array as the changes occur.
         * If an element selected by this array no longer qualifies for the selector,
         * it will automatically be removed. Be aware of this for iteration purposes.
         *
         * @param {string} classNames is a string representing the class name(s) to match; multiple class names are separated by (ASCII-)whitespace
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
         * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
         */
        getElementsByClassName: function(classNames) {
          var classNamesSet = toOrderedSet(classNames);
          return new LiveNodeList(this, function(base) {
            var ls = [];
            if (classNamesSet.length > 0) {
              _visitNode(base.documentElement, function(node) {
                if (node !== base && node.nodeType === ELEMENT_NODE) {
                  var nodeClassNames = node.getAttribute("class");
                  if (nodeClassNames) {
                    var matches = classNames === nodeClassNames;
                    if (!matches) {
                      var nodeClassNamesSet = toOrderedSet(nodeClassNames);
                      matches = classNamesSet.every(arrayIncludes(nodeClassNamesSet));
                    }
                    if (matches) {
                      ls.push(node);
                    }
                  }
                }
              });
            }
            return ls;
          });
        },
        //document factory method:
        createElement: function(tagName) {
          var node = new Element2();
          node.ownerDocument = this;
          node.nodeName = tagName;
          node.tagName = tagName;
          node.localName = tagName;
          node.childNodes = new NodeList();
          var attrs = node.attributes = new NamedNodeMap();
          attrs._ownerElement = node;
          return node;
        },
        createDocumentFragment: function() {
          var node = new DocumentFragment();
          node.ownerDocument = this;
          node.childNodes = new NodeList();
          return node;
        },
        createTextNode: function(data) {
          var node = new Text();
          node.ownerDocument = this;
          node.appendData(data);
          return node;
        },
        createComment: function(data) {
          var node = new Comment();
          node.ownerDocument = this;
          node.appendData(data);
          return node;
        },
        createCDATASection: function(data) {
          var node = new CDATASection();
          node.ownerDocument = this;
          node.appendData(data);
          return node;
        },
        createProcessingInstruction: function(target, data) {
          var node = new ProcessingInstruction();
          node.ownerDocument = this;
          node.tagName = node.nodeName = node.target = target;
          node.nodeValue = node.data = data;
          return node;
        },
        createAttribute: function(name) {
          var node = new Attr();
          node.ownerDocument = this;
          node.name = name;
          node.nodeName = name;
          node.localName = name;
          node.specified = true;
          return node;
        },
        createEntityReference: function(name) {
          var node = new EntityReference();
          node.ownerDocument = this;
          node.nodeName = name;
          return node;
        },
        // Introduced in DOM Level 2:
        createElementNS: function(namespaceURI, qualifiedName) {
          var node = new Element2();
          var pl = qualifiedName.split(":");
          var attrs = node.attributes = new NamedNodeMap();
          node.childNodes = new NodeList();
          node.ownerDocument = this;
          node.nodeName = qualifiedName;
          node.tagName = qualifiedName;
          node.namespaceURI = namespaceURI;
          if (pl.length == 2) {
            node.prefix = pl[0];
            node.localName = pl[1];
          } else {
            node.localName = qualifiedName;
          }
          attrs._ownerElement = node;
          return node;
        },
        // Introduced in DOM Level 2:
        createAttributeNS: function(namespaceURI, qualifiedName) {
          var node = new Attr();
          var pl = qualifiedName.split(":");
          node.ownerDocument = this;
          node.nodeName = qualifiedName;
          node.name = qualifiedName;
          node.namespaceURI = namespaceURI;
          node.specified = true;
          if (pl.length == 2) {
            node.prefix = pl[0];
            node.localName = pl[1];
          } else {
            node.localName = qualifiedName;
          }
          return node;
        }
      };
      _extends(Document, Node2);
      function Element2() {
        this._nsMap = {};
      }
      Element2.prototype = {
        nodeType: ELEMENT_NODE,
        hasAttribute: function(name) {
          return this.getAttributeNode(name) != null;
        },
        getAttribute: function(name) {
          var attr = this.getAttributeNode(name);
          return attr && attr.value || "";
        },
        getAttributeNode: function(name) {
          return this.attributes.getNamedItem(name);
        },
        setAttribute: function(name, value) {
          var attr = this.ownerDocument.createAttribute(name);
          attr.value = attr.nodeValue = "" + value;
          this.setAttributeNode(attr);
        },
        removeAttribute: function(name) {
          var attr = this.getAttributeNode(name);
          attr && this.removeAttributeNode(attr);
        },
        //four real opeartion method
        appendChild: function(newChild) {
          if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
            return this.insertBefore(newChild, null);
          } else {
            return _appendSingleChild(this, newChild);
          }
        },
        setAttributeNode: function(newAttr) {
          return this.attributes.setNamedItem(newAttr);
        },
        setAttributeNodeNS: function(newAttr) {
          return this.attributes.setNamedItemNS(newAttr);
        },
        removeAttributeNode: function(oldAttr) {
          return this.attributes.removeNamedItem(oldAttr.nodeName);
        },
        //get real attribute name,and remove it by removeAttributeNode
        removeAttributeNS: function(namespaceURI, localName) {
          var old = this.getAttributeNodeNS(namespaceURI, localName);
          old && this.removeAttributeNode(old);
        },
        hasAttributeNS: function(namespaceURI, localName) {
          return this.getAttributeNodeNS(namespaceURI, localName) != null;
        },
        getAttributeNS: function(namespaceURI, localName) {
          var attr = this.getAttributeNodeNS(namespaceURI, localName);
          return attr && attr.value || "";
        },
        setAttributeNS: function(namespaceURI, qualifiedName, value) {
          var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
          attr.value = attr.nodeValue = "" + value;
          this.setAttributeNode(attr);
        },
        getAttributeNodeNS: function(namespaceURI, localName) {
          return this.attributes.getNamedItemNS(namespaceURI, localName);
        },
        getElementsByTagName: function(tagName) {
          return new LiveNodeList(this, function(base) {
            var ls = [];
            _visitNode(base, function(node) {
              if (node !== base && node.nodeType == ELEMENT_NODE && (tagName === "*" || node.tagName == tagName)) {
                ls.push(node);
              }
            });
            return ls;
          });
        },
        getElementsByTagNameNS: function(namespaceURI, localName) {
          return new LiveNodeList(this, function(base) {
            var ls = [];
            _visitNode(base, function(node) {
              if (node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === "*" || node.namespaceURI === namespaceURI) && (localName === "*" || node.localName == localName)) {
                ls.push(node);
              }
            });
            return ls;
          });
        }
      };
      Document.prototype.getElementsByTagName = Element2.prototype.getElementsByTagName;
      Document.prototype.getElementsByTagNameNS = Element2.prototype.getElementsByTagNameNS;
      _extends(Element2, Node2);
      function Attr() {
      }
      Attr.prototype.nodeType = ATTRIBUTE_NODE;
      _extends(Attr, Node2);
      function CharacterData() {
      }
      CharacterData.prototype = {
        data: "",
        substringData: function(offset, count) {
          return this.data.substring(offset, offset + count);
        },
        appendData: function(text) {
          text = this.data + text;
          this.nodeValue = this.data = text;
          this.length = text.length;
        },
        insertData: function(offset, text) {
          this.replaceData(offset, 0, text);
        },
        appendChild: function(newChild) {
          throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR]);
        },
        deleteData: function(offset, count) {
          this.replaceData(offset, count, "");
        },
        replaceData: function(offset, count, text) {
          var start = this.data.substring(0, offset);
          var end = this.data.substring(offset + count);
          text = start + text + end;
          this.nodeValue = this.data = text;
          this.length = text.length;
        }
      };
      _extends(CharacterData, Node2);
      function Text() {
      }
      Text.prototype = {
        nodeName: "#text",
        nodeType: TEXT_NODE,
        splitText: function(offset) {
          var text = this.data;
          var newText = text.substring(offset);
          text = text.substring(0, offset);
          this.data = this.nodeValue = text;
          this.length = text.length;
          var newNode = this.ownerDocument.createTextNode(newText);
          if (this.parentNode) {
            this.parentNode.insertBefore(newNode, this.nextSibling);
          }
          return newNode;
        }
      };
      _extends(Text, CharacterData);
      function Comment() {
      }
      Comment.prototype = {
        nodeName: "#comment",
        nodeType: COMMENT_NODE
      };
      _extends(Comment, CharacterData);
      function CDATASection() {
      }
      CDATASection.prototype = {
        nodeName: "#cdata-section",
        nodeType: CDATA_SECTION_NODE
      };
      _extends(CDATASection, CharacterData);
      function DocumentType() {
      }
      DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
      _extends(DocumentType, Node2);
      function Notation() {
      }
      Notation.prototype.nodeType = NOTATION_NODE;
      _extends(Notation, Node2);
      function Entity() {
      }
      Entity.prototype.nodeType = ENTITY_NODE;
      _extends(Entity, Node2);
      function EntityReference() {
      }
      EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
      _extends(EntityReference, Node2);
      function DocumentFragment() {
      }
      DocumentFragment.prototype.nodeName = "#document-fragment";
      DocumentFragment.prototype.nodeType = DOCUMENT_FRAGMENT_NODE;
      _extends(DocumentFragment, Node2);
      function ProcessingInstruction() {
      }
      ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
      _extends(ProcessingInstruction, Node2);
      function XMLSerializer() {
      }
      XMLSerializer.prototype.serializeToString = function(node, isHtml, nodeFilter) {
        return nodeSerializeToString.call(node, isHtml, nodeFilter);
      };
      Node2.prototype.toString = nodeSerializeToString;
      function nodeSerializeToString(isHtml, nodeFilter) {
        var buf = [];
        var refNode = this.nodeType == 9 && this.documentElement || this;
        var prefix = refNode.prefix;
        var uri = refNode.namespaceURI;
        if (uri && prefix == null) {
          var prefix = refNode.lookupPrefix(uri);
          if (prefix == null) {
            var visibleNamespaces = [
              { namespace: uri, prefix: null }
              //{namespace:uri,prefix:''}
            ];
          }
        }
        serializeToString(this, buf, isHtml, nodeFilter, visibleNamespaces);
        return buf.join("");
      }
      function needNamespaceDefine(node, isHTML, visibleNamespaces) {
        var prefix = node.prefix || "";
        var uri = node.namespaceURI;
        if (!uri) {
          return false;
        }
        if (prefix === "xml" && uri === NAMESPACE.XML || uri === NAMESPACE.XMLNS) {
          return false;
        }
        var i = visibleNamespaces.length;
        while (i--) {
          var ns = visibleNamespaces[i];
          if (ns.prefix === prefix) {
            return ns.namespace !== uri;
          }
        }
        return true;
      }
      function addSerializedAttribute(buf, qualifiedName, value) {
        buf.push(" ", qualifiedName, '="', value.replace(/[<&"]/g, _xmlEncoder), '"');
      }
      function serializeToString(node, buf, isHTML, nodeFilter, visibleNamespaces) {
        if (!visibleNamespaces) {
          visibleNamespaces = [];
        }
        if (nodeFilter) {
          node = nodeFilter(node);
          if (node) {
            if (typeof node == "string") {
              buf.push(node);
              return;
            }
          } else {
            return;
          }
        }
        switch (node.nodeType) {
          case ELEMENT_NODE:
            var attrs = node.attributes;
            var len = attrs.length;
            var child = node.firstChild;
            var nodeName = node.tagName;
            isHTML = NAMESPACE.isHTML(node.namespaceURI) || isHTML;
            var prefixedNodeName = nodeName;
            if (!isHTML && !node.prefix && node.namespaceURI) {
              var defaultNS;
              for (var ai = 0; ai < attrs.length; ai++) {
                if (attrs.item(ai).name === "xmlns") {
                  defaultNS = attrs.item(ai).value;
                  break;
                }
              }
              if (!defaultNS) {
                for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
                  var namespace = visibleNamespaces[nsi];
                  if (namespace.prefix === "" && namespace.namespace === node.namespaceURI) {
                    defaultNS = namespace.namespace;
                    break;
                  }
                }
              }
              if (defaultNS !== node.namespaceURI) {
                for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
                  var namespace = visibleNamespaces[nsi];
                  if (namespace.namespace === node.namespaceURI) {
                    if (namespace.prefix) {
                      prefixedNodeName = namespace.prefix + ":" + nodeName;
                    }
                    break;
                  }
                }
              }
            }
            buf.push("<", prefixedNodeName);
            for (var i = 0; i < len; i++) {
              var attr = attrs.item(i);
              if (attr.prefix == "xmlns") {
                visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
              } else if (attr.nodeName == "xmlns") {
                visibleNamespaces.push({ prefix: "", namespace: attr.value });
              }
            }
            for (var i = 0; i < len; i++) {
              var attr = attrs.item(i);
              if (needNamespaceDefine(attr, isHTML, visibleNamespaces)) {
                var prefix = attr.prefix || "";
                var uri = attr.namespaceURI;
                addSerializedAttribute(buf, prefix ? "xmlns:" + prefix : "xmlns", uri);
                visibleNamespaces.push({ prefix, namespace: uri });
              }
              serializeToString(attr, buf, isHTML, nodeFilter, visibleNamespaces);
            }
            if (nodeName === prefixedNodeName && needNamespaceDefine(node, isHTML, visibleNamespaces)) {
              var prefix = node.prefix || "";
              var uri = node.namespaceURI;
              addSerializedAttribute(buf, prefix ? "xmlns:" + prefix : "xmlns", uri);
              visibleNamespaces.push({ prefix, namespace: uri });
            }
            if (child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)) {
              buf.push(">");
              if (isHTML && /^script$/i.test(nodeName)) {
                while (child) {
                  if (child.data) {
                    buf.push(child.data);
                  } else {
                    serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
                  }
                  child = child.nextSibling;
                }
              } else {
                while (child) {
                  serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
                  child = child.nextSibling;
                }
              }
              buf.push("</", prefixedNodeName, ">");
            } else {
              buf.push("/>");
            }
            return;
          case DOCUMENT_NODE:
          case DOCUMENT_FRAGMENT_NODE:
            var child = node.firstChild;
            while (child) {
              serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
              child = child.nextSibling;
            }
            return;
          case ATTRIBUTE_NODE:
            return addSerializedAttribute(buf, node.name, node.value);
          case TEXT_NODE:
            return buf.push(
              node.data.replace(/[<&]/g, _xmlEncoder).replace(/]]>/g, "]]&gt;")
            );
          case CDATA_SECTION_NODE:
            return buf.push("<![CDATA[", node.data, "]]>");
          case COMMENT_NODE:
            return buf.push("<!--", node.data, "-->");
          case DOCUMENT_TYPE_NODE:
            var pubid = node.publicId;
            var sysid = node.systemId;
            buf.push("<!DOCTYPE ", node.name);
            if (pubid) {
              buf.push(" PUBLIC ", pubid);
              if (sysid && sysid != ".") {
                buf.push(" ", sysid);
              }
              buf.push(">");
            } else if (sysid && sysid != ".") {
              buf.push(" SYSTEM ", sysid, ">");
            } else {
              var sub = node.internalSubset;
              if (sub) {
                buf.push(" [", sub, "]");
              }
              buf.push(">");
            }
            return;
          case PROCESSING_INSTRUCTION_NODE:
            return buf.push("<?", node.target, " ", node.data, "?>");
          case ENTITY_REFERENCE_NODE:
            return buf.push("&", node.nodeName, ";");
          //case ENTITY_NODE:
          //case NOTATION_NODE:
          default:
            buf.push("??", node.nodeName);
        }
      }
      function importNode(doc, node, deep) {
        var node2;
        switch (node.nodeType) {
          case ELEMENT_NODE:
            node2 = node.cloneNode(false);
            node2.ownerDocument = doc;
          //var attrs = node2.attributes;
          //var len = attrs.length;
          //for(var i=0;i<len;i++){
          //node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
          //}
          case DOCUMENT_FRAGMENT_NODE:
            break;
          case ATTRIBUTE_NODE:
            deep = true;
            break;
        }
        if (!node2) {
          node2 = node.cloneNode(false);
        }
        node2.ownerDocument = doc;
        node2.parentNode = null;
        if (deep) {
          var child = node.firstChild;
          while (child) {
            node2.appendChild(importNode(doc, child, deep));
            child = child.nextSibling;
          }
        }
        return node2;
      }
      function cloneNode(doc, node, deep) {
        var node2 = new node.constructor();
        for (var n in node) {
          if (Object.prototype.hasOwnProperty.call(node, n)) {
            var v = node[n];
            if (typeof v != "object") {
              if (v != node2[n]) {
                node2[n] = v;
              }
            }
          }
        }
        if (node.childNodes) {
          node2.childNodes = new NodeList();
        }
        node2.ownerDocument = doc;
        switch (node2.nodeType) {
          case ELEMENT_NODE:
            var attrs = node.attributes;
            var attrs2 = node2.attributes = new NamedNodeMap();
            var len = attrs.length;
            attrs2._ownerElement = node2;
            for (var i = 0; i < len; i++) {
              node2.setAttributeNode(cloneNode(doc, attrs.item(i), true));
            }
            break;
            ;
          case ATTRIBUTE_NODE:
            deep = true;
        }
        if (deep) {
          var child = node.firstChild;
          while (child) {
            node2.appendChild(cloneNode(doc, child, deep));
            child = child.nextSibling;
          }
        }
        return node2;
      }
      function __set__(object, key, value) {
        object[key] = value;
      }
      try {
        if (Object.defineProperty) {
          let getTextContent2 = function(node) {
            switch (node.nodeType) {
              case ELEMENT_NODE:
              case DOCUMENT_FRAGMENT_NODE:
                var buf = [];
                node = node.firstChild;
                while (node) {
                  if (node.nodeType !== 7 && node.nodeType !== 8) {
                    buf.push(getTextContent2(node));
                  }
                  node = node.nextSibling;
                }
                return buf.join("");
              default:
                return node.nodeValue;
            }
          };
          getTextContent = getTextContent2;
          Object.defineProperty(LiveNodeList.prototype, "length", {
            get: function() {
              _updateLiveList(this);
              return this.$$length;
            }
          });
          Object.defineProperty(Node2.prototype, "textContent", {
            get: function() {
              return getTextContent2(this);
            },
            set: function(data) {
              switch (this.nodeType) {
                case ELEMENT_NODE:
                case DOCUMENT_FRAGMENT_NODE:
                  while (this.firstChild) {
                    this.removeChild(this.firstChild);
                  }
                  if (data || String(data)) {
                    this.appendChild(this.ownerDocument.createTextNode(data));
                  }
                  break;
                default:
                  this.data = data;
                  this.value = data;
                  this.nodeValue = data;
              }
            }
          });
          __set__ = function(object, key, value) {
            object["$$" + key] = value;
          };
        }
      } catch (e) {
      }
      var getTextContent;
      exports.DocumentType = DocumentType;
      exports.DOMException = DOMException;
      exports.DOMImplementation = DOMImplementation;
      exports.Element = Element2;
      exports.Node = Node2;
      exports.NodeList = NodeList;
      exports.XMLSerializer = XMLSerializer;
    }
  });

  // node_modules/.pnpm/@xmldom+xmldom@0.7.13/node_modules/@xmldom/xmldom/lib/entities.js
  var require_entities2 = __commonJS({
    "node_modules/.pnpm/@xmldom+xmldom@0.7.13/node_modules/@xmldom/xmldom/lib/entities.js"(exports) {
      "use strict";
      var freeze = require_conventions2().freeze;
      exports.XML_ENTITIES = freeze({
        amp: "&",
        apos: "'",
        gt: ">",
        lt: "<",
        quot: '"'
      });
      exports.HTML_ENTITIES = freeze({
        Aacute: "\xC1",
        aacute: "\xE1",
        Abreve: "\u0102",
        abreve: "\u0103",
        ac: "\u223E",
        acd: "\u223F",
        acE: "\u223E\u0333",
        Acirc: "\xC2",
        acirc: "\xE2",
        acute: "\xB4",
        Acy: "\u0410",
        acy: "\u0430",
        AElig: "\xC6",
        aelig: "\xE6",
        af: "\u2061",
        Afr: "\u{1D504}",
        afr: "\u{1D51E}",
        Agrave: "\xC0",
        agrave: "\xE0",
        alefsym: "\u2135",
        aleph: "\u2135",
        Alpha: "\u0391",
        alpha: "\u03B1",
        Amacr: "\u0100",
        amacr: "\u0101",
        amalg: "\u2A3F",
        AMP: "&",
        amp: "&",
        And: "\u2A53",
        and: "\u2227",
        andand: "\u2A55",
        andd: "\u2A5C",
        andslope: "\u2A58",
        andv: "\u2A5A",
        ang: "\u2220",
        ange: "\u29A4",
        angle: "\u2220",
        angmsd: "\u2221",
        angmsdaa: "\u29A8",
        angmsdab: "\u29A9",
        angmsdac: "\u29AA",
        angmsdad: "\u29AB",
        angmsdae: "\u29AC",
        angmsdaf: "\u29AD",
        angmsdag: "\u29AE",
        angmsdah: "\u29AF",
        angrt: "\u221F",
        angrtvb: "\u22BE",
        angrtvbd: "\u299D",
        angsph: "\u2222",
        angst: "\xC5",
        angzarr: "\u237C",
        Aogon: "\u0104",
        aogon: "\u0105",
        Aopf: "\u{1D538}",
        aopf: "\u{1D552}",
        ap: "\u2248",
        apacir: "\u2A6F",
        apE: "\u2A70",
        ape: "\u224A",
        apid: "\u224B",
        apos: "'",
        ApplyFunction: "\u2061",
        approx: "\u2248",
        approxeq: "\u224A",
        Aring: "\xC5",
        aring: "\xE5",
        Ascr: "\u{1D49C}",
        ascr: "\u{1D4B6}",
        Assign: "\u2254",
        ast: "*",
        asymp: "\u2248",
        asympeq: "\u224D",
        Atilde: "\xC3",
        atilde: "\xE3",
        Auml: "\xC4",
        auml: "\xE4",
        awconint: "\u2233",
        awint: "\u2A11",
        backcong: "\u224C",
        backepsilon: "\u03F6",
        backprime: "\u2035",
        backsim: "\u223D",
        backsimeq: "\u22CD",
        Backslash: "\u2216",
        Barv: "\u2AE7",
        barvee: "\u22BD",
        Barwed: "\u2306",
        barwed: "\u2305",
        barwedge: "\u2305",
        bbrk: "\u23B5",
        bbrktbrk: "\u23B6",
        bcong: "\u224C",
        Bcy: "\u0411",
        bcy: "\u0431",
        bdquo: "\u201E",
        becaus: "\u2235",
        Because: "\u2235",
        because: "\u2235",
        bemptyv: "\u29B0",
        bepsi: "\u03F6",
        bernou: "\u212C",
        Bernoullis: "\u212C",
        Beta: "\u0392",
        beta: "\u03B2",
        beth: "\u2136",
        between: "\u226C",
        Bfr: "\u{1D505}",
        bfr: "\u{1D51F}",
        bigcap: "\u22C2",
        bigcirc: "\u25EF",
        bigcup: "\u22C3",
        bigodot: "\u2A00",
        bigoplus: "\u2A01",
        bigotimes: "\u2A02",
        bigsqcup: "\u2A06",
        bigstar: "\u2605",
        bigtriangledown: "\u25BD",
        bigtriangleup: "\u25B3",
        biguplus: "\u2A04",
        bigvee: "\u22C1",
        bigwedge: "\u22C0",
        bkarow: "\u290D",
        blacklozenge: "\u29EB",
        blacksquare: "\u25AA",
        blacktriangle: "\u25B4",
        blacktriangledown: "\u25BE",
        blacktriangleleft: "\u25C2",
        blacktriangleright: "\u25B8",
        blank: "\u2423",
        blk12: "\u2592",
        blk14: "\u2591",
        blk34: "\u2593",
        block: "\u2588",
        bne: "=\u20E5",
        bnequiv: "\u2261\u20E5",
        bNot: "\u2AED",
        bnot: "\u2310",
        Bopf: "\u{1D539}",
        bopf: "\u{1D553}",
        bot: "\u22A5",
        bottom: "\u22A5",
        bowtie: "\u22C8",
        boxbox: "\u29C9",
        boxDL: "\u2557",
        boxDl: "\u2556",
        boxdL: "\u2555",
        boxdl: "\u2510",
        boxDR: "\u2554",
        boxDr: "\u2553",
        boxdR: "\u2552",
        boxdr: "\u250C",
        boxH: "\u2550",
        boxh: "\u2500",
        boxHD: "\u2566",
        boxHd: "\u2564",
        boxhD: "\u2565",
        boxhd: "\u252C",
        boxHU: "\u2569",
        boxHu: "\u2567",
        boxhU: "\u2568",
        boxhu: "\u2534",
        boxminus: "\u229F",
        boxplus: "\u229E",
        boxtimes: "\u22A0",
        boxUL: "\u255D",
        boxUl: "\u255C",
        boxuL: "\u255B",
        boxul: "\u2518",
        boxUR: "\u255A",
        boxUr: "\u2559",
        boxuR: "\u2558",
        boxur: "\u2514",
        boxV: "\u2551",
        boxv: "\u2502",
        boxVH: "\u256C",
        boxVh: "\u256B",
        boxvH: "\u256A",
        boxvh: "\u253C",
        boxVL: "\u2563",
        boxVl: "\u2562",
        boxvL: "\u2561",
        boxvl: "\u2524",
        boxVR: "\u2560",
        boxVr: "\u255F",
        boxvR: "\u255E",
        boxvr: "\u251C",
        bprime: "\u2035",
        Breve: "\u02D8",
        breve: "\u02D8",
        brvbar: "\xA6",
        Bscr: "\u212C",
        bscr: "\u{1D4B7}",
        bsemi: "\u204F",
        bsim: "\u223D",
        bsime: "\u22CD",
        bsol: "\\",
        bsolb: "\u29C5",
        bsolhsub: "\u27C8",
        bull: "\u2022",
        bullet: "\u2022",
        bump: "\u224E",
        bumpE: "\u2AAE",
        bumpe: "\u224F",
        Bumpeq: "\u224E",
        bumpeq: "\u224F",
        Cacute: "\u0106",
        cacute: "\u0107",
        Cap: "\u22D2",
        cap: "\u2229",
        capand: "\u2A44",
        capbrcup: "\u2A49",
        capcap: "\u2A4B",
        capcup: "\u2A47",
        capdot: "\u2A40",
        CapitalDifferentialD: "\u2145",
        caps: "\u2229\uFE00",
        caret: "\u2041",
        caron: "\u02C7",
        Cayleys: "\u212D",
        ccaps: "\u2A4D",
        Ccaron: "\u010C",
        ccaron: "\u010D",
        Ccedil: "\xC7",
        ccedil: "\xE7",
        Ccirc: "\u0108",
        ccirc: "\u0109",
        Cconint: "\u2230",
        ccups: "\u2A4C",
        ccupssm: "\u2A50",
        Cdot: "\u010A",
        cdot: "\u010B",
        cedil: "\xB8",
        Cedilla: "\xB8",
        cemptyv: "\u29B2",
        cent: "\xA2",
        CenterDot: "\xB7",
        centerdot: "\xB7",
        Cfr: "\u212D",
        cfr: "\u{1D520}",
        CHcy: "\u0427",
        chcy: "\u0447",
        check: "\u2713",
        checkmark: "\u2713",
        Chi: "\u03A7",
        chi: "\u03C7",
        cir: "\u25CB",
        circ: "\u02C6",
        circeq: "\u2257",
        circlearrowleft: "\u21BA",
        circlearrowright: "\u21BB",
        circledast: "\u229B",
        circledcirc: "\u229A",
        circleddash: "\u229D",
        CircleDot: "\u2299",
        circledR: "\xAE",
        circledS: "\u24C8",
        CircleMinus: "\u2296",
        CirclePlus: "\u2295",
        CircleTimes: "\u2297",
        cirE: "\u29C3",
        cire: "\u2257",
        cirfnint: "\u2A10",
        cirmid: "\u2AEF",
        cirscir: "\u29C2",
        ClockwiseContourIntegral: "\u2232",
        CloseCurlyDoubleQuote: "\u201D",
        CloseCurlyQuote: "\u2019",
        clubs: "\u2663",
        clubsuit: "\u2663",
        Colon: "\u2237",
        colon: ":",
        Colone: "\u2A74",
        colone: "\u2254",
        coloneq: "\u2254",
        comma: ",",
        commat: "@",
        comp: "\u2201",
        compfn: "\u2218",
        complement: "\u2201",
        complexes: "\u2102",
        cong: "\u2245",
        congdot: "\u2A6D",
        Congruent: "\u2261",
        Conint: "\u222F",
        conint: "\u222E",
        ContourIntegral: "\u222E",
        Copf: "\u2102",
        copf: "\u{1D554}",
        coprod: "\u2210",
        Coproduct: "\u2210",
        COPY: "\xA9",
        copy: "\xA9",
        copysr: "\u2117",
        CounterClockwiseContourIntegral: "\u2233",
        crarr: "\u21B5",
        Cross: "\u2A2F",
        cross: "\u2717",
        Cscr: "\u{1D49E}",
        cscr: "\u{1D4B8}",
        csub: "\u2ACF",
        csube: "\u2AD1",
        csup: "\u2AD0",
        csupe: "\u2AD2",
        ctdot: "\u22EF",
        cudarrl: "\u2938",
        cudarrr: "\u2935",
        cuepr: "\u22DE",
        cuesc: "\u22DF",
        cularr: "\u21B6",
        cularrp: "\u293D",
        Cup: "\u22D3",
        cup: "\u222A",
        cupbrcap: "\u2A48",
        CupCap: "\u224D",
        cupcap: "\u2A46",
        cupcup: "\u2A4A",
        cupdot: "\u228D",
        cupor: "\u2A45",
        cups: "\u222A\uFE00",
        curarr: "\u21B7",
        curarrm: "\u293C",
        curlyeqprec: "\u22DE",
        curlyeqsucc: "\u22DF",
        curlyvee: "\u22CE",
        curlywedge: "\u22CF",
        curren: "\xA4",
        curvearrowleft: "\u21B6",
        curvearrowright: "\u21B7",
        cuvee: "\u22CE",
        cuwed: "\u22CF",
        cwconint: "\u2232",
        cwint: "\u2231",
        cylcty: "\u232D",
        Dagger: "\u2021",
        dagger: "\u2020",
        daleth: "\u2138",
        Darr: "\u21A1",
        dArr: "\u21D3",
        darr: "\u2193",
        dash: "\u2010",
        Dashv: "\u2AE4",
        dashv: "\u22A3",
        dbkarow: "\u290F",
        dblac: "\u02DD",
        Dcaron: "\u010E",
        dcaron: "\u010F",
        Dcy: "\u0414",
        dcy: "\u0434",
        DD: "\u2145",
        dd: "\u2146",
        ddagger: "\u2021",
        ddarr: "\u21CA",
        DDotrahd: "\u2911",
        ddotseq: "\u2A77",
        deg: "\xB0",
        Del: "\u2207",
        Delta: "\u0394",
        delta: "\u03B4",
        demptyv: "\u29B1",
        dfisht: "\u297F",
        Dfr: "\u{1D507}",
        dfr: "\u{1D521}",
        dHar: "\u2965",
        dharl: "\u21C3",
        dharr: "\u21C2",
        DiacriticalAcute: "\xB4",
        DiacriticalDot: "\u02D9",
        DiacriticalDoubleAcute: "\u02DD",
        DiacriticalGrave: "`",
        DiacriticalTilde: "\u02DC",
        diam: "\u22C4",
        Diamond: "\u22C4",
        diamond: "\u22C4",
        diamondsuit: "\u2666",
        diams: "\u2666",
        die: "\xA8",
        DifferentialD: "\u2146",
        digamma: "\u03DD",
        disin: "\u22F2",
        div: "\xF7",
        divide: "\xF7",
        divideontimes: "\u22C7",
        divonx: "\u22C7",
        DJcy: "\u0402",
        djcy: "\u0452",
        dlcorn: "\u231E",
        dlcrop: "\u230D",
        dollar: "$",
        Dopf: "\u{1D53B}",
        dopf: "\u{1D555}",
        Dot: "\xA8",
        dot: "\u02D9",
        DotDot: "\u20DC",
        doteq: "\u2250",
        doteqdot: "\u2251",
        DotEqual: "\u2250",
        dotminus: "\u2238",
        dotplus: "\u2214",
        dotsquare: "\u22A1",
        doublebarwedge: "\u2306",
        DoubleContourIntegral: "\u222F",
        DoubleDot: "\xA8",
        DoubleDownArrow: "\u21D3",
        DoubleLeftArrow: "\u21D0",
        DoubleLeftRightArrow: "\u21D4",
        DoubleLeftTee: "\u2AE4",
        DoubleLongLeftArrow: "\u27F8",
        DoubleLongLeftRightArrow: "\u27FA",
        DoubleLongRightArrow: "\u27F9",
        DoubleRightArrow: "\u21D2",
        DoubleRightTee: "\u22A8",
        DoubleUpArrow: "\u21D1",
        DoubleUpDownArrow: "\u21D5",
        DoubleVerticalBar: "\u2225",
        DownArrow: "\u2193",
        Downarrow: "\u21D3",
        downarrow: "\u2193",
        DownArrowBar: "\u2913",
        DownArrowUpArrow: "\u21F5",
        DownBreve: "\u0311",
        downdownarrows: "\u21CA",
        downharpoonleft: "\u21C3",
        downharpoonright: "\u21C2",
        DownLeftRightVector: "\u2950",
        DownLeftTeeVector: "\u295E",
        DownLeftVector: "\u21BD",
        DownLeftVectorBar: "\u2956",
        DownRightTeeVector: "\u295F",
        DownRightVector: "\u21C1",
        DownRightVectorBar: "\u2957",
        DownTee: "\u22A4",
        DownTeeArrow: "\u21A7",
        drbkarow: "\u2910",
        drcorn: "\u231F",
        drcrop: "\u230C",
        Dscr: "\u{1D49F}",
        dscr: "\u{1D4B9}",
        DScy: "\u0405",
        dscy: "\u0455",
        dsol: "\u29F6",
        Dstrok: "\u0110",
        dstrok: "\u0111",
        dtdot: "\u22F1",
        dtri: "\u25BF",
        dtrif: "\u25BE",
        duarr: "\u21F5",
        duhar: "\u296F",
        dwangle: "\u29A6",
        DZcy: "\u040F",
        dzcy: "\u045F",
        dzigrarr: "\u27FF",
        Eacute: "\xC9",
        eacute: "\xE9",
        easter: "\u2A6E",
        Ecaron: "\u011A",
        ecaron: "\u011B",
        ecir: "\u2256",
        Ecirc: "\xCA",
        ecirc: "\xEA",
        ecolon: "\u2255",
        Ecy: "\u042D",
        ecy: "\u044D",
        eDDot: "\u2A77",
        Edot: "\u0116",
        eDot: "\u2251",
        edot: "\u0117",
        ee: "\u2147",
        efDot: "\u2252",
        Efr: "\u{1D508}",
        efr: "\u{1D522}",
        eg: "\u2A9A",
        Egrave: "\xC8",
        egrave: "\xE8",
        egs: "\u2A96",
        egsdot: "\u2A98",
        el: "\u2A99",
        Element: "\u2208",
        elinters: "\u23E7",
        ell: "\u2113",
        els: "\u2A95",
        elsdot: "\u2A97",
        Emacr: "\u0112",
        emacr: "\u0113",
        empty: "\u2205",
        emptyset: "\u2205",
        EmptySmallSquare: "\u25FB",
        emptyv: "\u2205",
        EmptyVerySmallSquare: "\u25AB",
        emsp: "\u2003",
        emsp13: "\u2004",
        emsp14: "\u2005",
        ENG: "\u014A",
        eng: "\u014B",
        ensp: "\u2002",
        Eogon: "\u0118",
        eogon: "\u0119",
        Eopf: "\u{1D53C}",
        eopf: "\u{1D556}",
        epar: "\u22D5",
        eparsl: "\u29E3",
        eplus: "\u2A71",
        epsi: "\u03B5",
        Epsilon: "\u0395",
        epsilon: "\u03B5",
        epsiv: "\u03F5",
        eqcirc: "\u2256",
        eqcolon: "\u2255",
        eqsim: "\u2242",
        eqslantgtr: "\u2A96",
        eqslantless: "\u2A95",
        Equal: "\u2A75",
        equals: "=",
        EqualTilde: "\u2242",
        equest: "\u225F",
        Equilibrium: "\u21CC",
        equiv: "\u2261",
        equivDD: "\u2A78",
        eqvparsl: "\u29E5",
        erarr: "\u2971",
        erDot: "\u2253",
        Escr: "\u2130",
        escr: "\u212F",
        esdot: "\u2250",
        Esim: "\u2A73",
        esim: "\u2242",
        Eta: "\u0397",
        eta: "\u03B7",
        ETH: "\xD0",
        eth: "\xF0",
        Euml: "\xCB",
        euml: "\xEB",
        euro: "\u20AC",
        excl: "!",
        exist: "\u2203",
        Exists: "\u2203",
        expectation: "\u2130",
        ExponentialE: "\u2147",
        exponentiale: "\u2147",
        fallingdotseq: "\u2252",
        Fcy: "\u0424",
        fcy: "\u0444",
        female: "\u2640",
        ffilig: "\uFB03",
        fflig: "\uFB00",
        ffllig: "\uFB04",
        Ffr: "\u{1D509}",
        ffr: "\u{1D523}",
        filig: "\uFB01",
        FilledSmallSquare: "\u25FC",
        FilledVerySmallSquare: "\u25AA",
        fjlig: "fj",
        flat: "\u266D",
        fllig: "\uFB02",
        fltns: "\u25B1",
        fnof: "\u0192",
        Fopf: "\u{1D53D}",
        fopf: "\u{1D557}",
        ForAll: "\u2200",
        forall: "\u2200",
        fork: "\u22D4",
        forkv: "\u2AD9",
        Fouriertrf: "\u2131",
        fpartint: "\u2A0D",
        frac12: "\xBD",
        frac13: "\u2153",
        frac14: "\xBC",
        frac15: "\u2155",
        frac16: "\u2159",
        frac18: "\u215B",
        frac23: "\u2154",
        frac25: "\u2156",
        frac34: "\xBE",
        frac35: "\u2157",
        frac38: "\u215C",
        frac45: "\u2158",
        frac56: "\u215A",
        frac58: "\u215D",
        frac78: "\u215E",
        frasl: "\u2044",
        frown: "\u2322",
        Fscr: "\u2131",
        fscr: "\u{1D4BB}",
        gacute: "\u01F5",
        Gamma: "\u0393",
        gamma: "\u03B3",
        Gammad: "\u03DC",
        gammad: "\u03DD",
        gap: "\u2A86",
        Gbreve: "\u011E",
        gbreve: "\u011F",
        Gcedil: "\u0122",
        Gcirc: "\u011C",
        gcirc: "\u011D",
        Gcy: "\u0413",
        gcy: "\u0433",
        Gdot: "\u0120",
        gdot: "\u0121",
        gE: "\u2267",
        ge: "\u2265",
        gEl: "\u2A8C",
        gel: "\u22DB",
        geq: "\u2265",
        geqq: "\u2267",
        geqslant: "\u2A7E",
        ges: "\u2A7E",
        gescc: "\u2AA9",
        gesdot: "\u2A80",
        gesdoto: "\u2A82",
        gesdotol: "\u2A84",
        gesl: "\u22DB\uFE00",
        gesles: "\u2A94",
        Gfr: "\u{1D50A}",
        gfr: "\u{1D524}",
        Gg: "\u22D9",
        gg: "\u226B",
        ggg: "\u22D9",
        gimel: "\u2137",
        GJcy: "\u0403",
        gjcy: "\u0453",
        gl: "\u2277",
        gla: "\u2AA5",
        glE: "\u2A92",
        glj: "\u2AA4",
        gnap: "\u2A8A",
        gnapprox: "\u2A8A",
        gnE: "\u2269",
        gne: "\u2A88",
        gneq: "\u2A88",
        gneqq: "\u2269",
        gnsim: "\u22E7",
        Gopf: "\u{1D53E}",
        gopf: "\u{1D558}",
        grave: "`",
        GreaterEqual: "\u2265",
        GreaterEqualLess: "\u22DB",
        GreaterFullEqual: "\u2267",
        GreaterGreater: "\u2AA2",
        GreaterLess: "\u2277",
        GreaterSlantEqual: "\u2A7E",
        GreaterTilde: "\u2273",
        Gscr: "\u{1D4A2}",
        gscr: "\u210A",
        gsim: "\u2273",
        gsime: "\u2A8E",
        gsiml: "\u2A90",
        Gt: "\u226B",
        GT: ">",
        gt: ">",
        gtcc: "\u2AA7",
        gtcir: "\u2A7A",
        gtdot: "\u22D7",
        gtlPar: "\u2995",
        gtquest: "\u2A7C",
        gtrapprox: "\u2A86",
        gtrarr: "\u2978",
        gtrdot: "\u22D7",
        gtreqless: "\u22DB",
        gtreqqless: "\u2A8C",
        gtrless: "\u2277",
        gtrsim: "\u2273",
        gvertneqq: "\u2269\uFE00",
        gvnE: "\u2269\uFE00",
        Hacek: "\u02C7",
        hairsp: "\u200A",
        half: "\xBD",
        hamilt: "\u210B",
        HARDcy: "\u042A",
        hardcy: "\u044A",
        hArr: "\u21D4",
        harr: "\u2194",
        harrcir: "\u2948",
        harrw: "\u21AD",
        Hat: "^",
        hbar: "\u210F",
        Hcirc: "\u0124",
        hcirc: "\u0125",
        hearts: "\u2665",
        heartsuit: "\u2665",
        hellip: "\u2026",
        hercon: "\u22B9",
        Hfr: "\u210C",
        hfr: "\u{1D525}",
        HilbertSpace: "\u210B",
        hksearow: "\u2925",
        hkswarow: "\u2926",
        hoarr: "\u21FF",
        homtht: "\u223B",
        hookleftarrow: "\u21A9",
        hookrightarrow: "\u21AA",
        Hopf: "\u210D",
        hopf: "\u{1D559}",
        horbar: "\u2015",
        HorizontalLine: "\u2500",
        Hscr: "\u210B",
        hscr: "\u{1D4BD}",
        hslash: "\u210F",
        Hstrok: "\u0126",
        hstrok: "\u0127",
        HumpDownHump: "\u224E",
        HumpEqual: "\u224F",
        hybull: "\u2043",
        hyphen: "\u2010",
        Iacute: "\xCD",
        iacute: "\xED",
        ic: "\u2063",
        Icirc: "\xCE",
        icirc: "\xEE",
        Icy: "\u0418",
        icy: "\u0438",
        Idot: "\u0130",
        IEcy: "\u0415",
        iecy: "\u0435",
        iexcl: "\xA1",
        iff: "\u21D4",
        Ifr: "\u2111",
        ifr: "\u{1D526}",
        Igrave: "\xCC",
        igrave: "\xEC",
        ii: "\u2148",
        iiiint: "\u2A0C",
        iiint: "\u222D",
        iinfin: "\u29DC",
        iiota: "\u2129",
        IJlig: "\u0132",
        ijlig: "\u0133",
        Im: "\u2111",
        Imacr: "\u012A",
        imacr: "\u012B",
        image: "\u2111",
        ImaginaryI: "\u2148",
        imagline: "\u2110",
        imagpart: "\u2111",
        imath: "\u0131",
        imof: "\u22B7",
        imped: "\u01B5",
        Implies: "\u21D2",
        in: "\u2208",
        incare: "\u2105",
        infin: "\u221E",
        infintie: "\u29DD",
        inodot: "\u0131",
        Int: "\u222C",
        int: "\u222B",
        intcal: "\u22BA",
        integers: "\u2124",
        Integral: "\u222B",
        intercal: "\u22BA",
        Intersection: "\u22C2",
        intlarhk: "\u2A17",
        intprod: "\u2A3C",
        InvisibleComma: "\u2063",
        InvisibleTimes: "\u2062",
        IOcy: "\u0401",
        iocy: "\u0451",
        Iogon: "\u012E",
        iogon: "\u012F",
        Iopf: "\u{1D540}",
        iopf: "\u{1D55A}",
        Iota: "\u0399",
        iota: "\u03B9",
        iprod: "\u2A3C",
        iquest: "\xBF",
        Iscr: "\u2110",
        iscr: "\u{1D4BE}",
        isin: "\u2208",
        isindot: "\u22F5",
        isinE: "\u22F9",
        isins: "\u22F4",
        isinsv: "\u22F3",
        isinv: "\u2208",
        it: "\u2062",
        Itilde: "\u0128",
        itilde: "\u0129",
        Iukcy: "\u0406",
        iukcy: "\u0456",
        Iuml: "\xCF",
        iuml: "\xEF",
        Jcirc: "\u0134",
        jcirc: "\u0135",
        Jcy: "\u0419",
        jcy: "\u0439",
        Jfr: "\u{1D50D}",
        jfr: "\u{1D527}",
        jmath: "\u0237",
        Jopf: "\u{1D541}",
        jopf: "\u{1D55B}",
        Jscr: "\u{1D4A5}",
        jscr: "\u{1D4BF}",
        Jsercy: "\u0408",
        jsercy: "\u0458",
        Jukcy: "\u0404",
        jukcy: "\u0454",
        Kappa: "\u039A",
        kappa: "\u03BA",
        kappav: "\u03F0",
        Kcedil: "\u0136",
        kcedil: "\u0137",
        Kcy: "\u041A",
        kcy: "\u043A",
        Kfr: "\u{1D50E}",
        kfr: "\u{1D528}",
        kgreen: "\u0138",
        KHcy: "\u0425",
        khcy: "\u0445",
        KJcy: "\u040C",
        kjcy: "\u045C",
        Kopf: "\u{1D542}",
        kopf: "\u{1D55C}",
        Kscr: "\u{1D4A6}",
        kscr: "\u{1D4C0}",
        lAarr: "\u21DA",
        Lacute: "\u0139",
        lacute: "\u013A",
        laemptyv: "\u29B4",
        lagran: "\u2112",
        Lambda: "\u039B",
        lambda: "\u03BB",
        Lang: "\u27EA",
        lang: "\u27E8",
        langd: "\u2991",
        langle: "\u27E8",
        lap: "\u2A85",
        Laplacetrf: "\u2112",
        laquo: "\xAB",
        Larr: "\u219E",
        lArr: "\u21D0",
        larr: "\u2190",
        larrb: "\u21E4",
        larrbfs: "\u291F",
        larrfs: "\u291D",
        larrhk: "\u21A9",
        larrlp: "\u21AB",
        larrpl: "\u2939",
        larrsim: "\u2973",
        larrtl: "\u21A2",
        lat: "\u2AAB",
        lAtail: "\u291B",
        latail: "\u2919",
        late: "\u2AAD",
        lates: "\u2AAD\uFE00",
        lBarr: "\u290E",
        lbarr: "\u290C",
        lbbrk: "\u2772",
        lbrace: "{",
        lbrack: "[",
        lbrke: "\u298B",
        lbrksld: "\u298F",
        lbrkslu: "\u298D",
        Lcaron: "\u013D",
        lcaron: "\u013E",
        Lcedil: "\u013B",
        lcedil: "\u013C",
        lceil: "\u2308",
        lcub: "{",
        Lcy: "\u041B",
        lcy: "\u043B",
        ldca: "\u2936",
        ldquo: "\u201C",
        ldquor: "\u201E",
        ldrdhar: "\u2967",
        ldrushar: "\u294B",
        ldsh: "\u21B2",
        lE: "\u2266",
        le: "\u2264",
        LeftAngleBracket: "\u27E8",
        LeftArrow: "\u2190",
        Leftarrow: "\u21D0",
        leftarrow: "\u2190",
        LeftArrowBar: "\u21E4",
        LeftArrowRightArrow: "\u21C6",
        leftarrowtail: "\u21A2",
        LeftCeiling: "\u2308",
        LeftDoubleBracket: "\u27E6",
        LeftDownTeeVector: "\u2961",
        LeftDownVector: "\u21C3",
        LeftDownVectorBar: "\u2959",
        LeftFloor: "\u230A",
        leftharpoondown: "\u21BD",
        leftharpoonup: "\u21BC",
        leftleftarrows: "\u21C7",
        LeftRightArrow: "\u2194",
        Leftrightarrow: "\u21D4",
        leftrightarrow: "\u2194",
        leftrightarrows: "\u21C6",
        leftrightharpoons: "\u21CB",
        leftrightsquigarrow: "\u21AD",
        LeftRightVector: "\u294E",
        LeftTee: "\u22A3",
        LeftTeeArrow: "\u21A4",
        LeftTeeVector: "\u295A",
        leftthreetimes: "\u22CB",
        LeftTriangle: "\u22B2",
        LeftTriangleBar: "\u29CF",
        LeftTriangleEqual: "\u22B4",
        LeftUpDownVector: "\u2951",
        LeftUpTeeVector: "\u2960",
        LeftUpVector: "\u21BF",
        LeftUpVectorBar: "\u2958",
        LeftVector: "\u21BC",
        LeftVectorBar: "\u2952",
        lEg: "\u2A8B",
        leg: "\u22DA",
        leq: "\u2264",
        leqq: "\u2266",
        leqslant: "\u2A7D",
        les: "\u2A7D",
        lescc: "\u2AA8",
        lesdot: "\u2A7F",
        lesdoto: "\u2A81",
        lesdotor: "\u2A83",
        lesg: "\u22DA\uFE00",
        lesges: "\u2A93",
        lessapprox: "\u2A85",
        lessdot: "\u22D6",
        lesseqgtr: "\u22DA",
        lesseqqgtr: "\u2A8B",
        LessEqualGreater: "\u22DA",
        LessFullEqual: "\u2266",
        LessGreater: "\u2276",
        lessgtr: "\u2276",
        LessLess: "\u2AA1",
        lesssim: "\u2272",
        LessSlantEqual: "\u2A7D",
        LessTilde: "\u2272",
        lfisht: "\u297C",
        lfloor: "\u230A",
        Lfr: "\u{1D50F}",
        lfr: "\u{1D529}",
        lg: "\u2276",
        lgE: "\u2A91",
        lHar: "\u2962",
        lhard: "\u21BD",
        lharu: "\u21BC",
        lharul: "\u296A",
        lhblk: "\u2584",
        LJcy: "\u0409",
        ljcy: "\u0459",
        Ll: "\u22D8",
        ll: "\u226A",
        llarr: "\u21C7",
        llcorner: "\u231E",
        Lleftarrow: "\u21DA",
        llhard: "\u296B",
        lltri: "\u25FA",
        Lmidot: "\u013F",
        lmidot: "\u0140",
        lmoust: "\u23B0",
        lmoustache: "\u23B0",
        lnap: "\u2A89",
        lnapprox: "\u2A89",
        lnE: "\u2268",
        lne: "\u2A87",
        lneq: "\u2A87",
        lneqq: "\u2268",
        lnsim: "\u22E6",
        loang: "\u27EC",
        loarr: "\u21FD",
        lobrk: "\u27E6",
        LongLeftArrow: "\u27F5",
        Longleftarrow: "\u27F8",
        longleftarrow: "\u27F5",
        LongLeftRightArrow: "\u27F7",
        Longleftrightarrow: "\u27FA",
        longleftrightarrow: "\u27F7",
        longmapsto: "\u27FC",
        LongRightArrow: "\u27F6",
        Longrightarrow: "\u27F9",
        longrightarrow: "\u27F6",
        looparrowleft: "\u21AB",
        looparrowright: "\u21AC",
        lopar: "\u2985",
        Lopf: "\u{1D543}",
        lopf: "\u{1D55D}",
        loplus: "\u2A2D",
        lotimes: "\u2A34",
        lowast: "\u2217",
        lowbar: "_",
        LowerLeftArrow: "\u2199",
        LowerRightArrow: "\u2198",
        loz: "\u25CA",
        lozenge: "\u25CA",
        lozf: "\u29EB",
        lpar: "(",
        lparlt: "\u2993",
        lrarr: "\u21C6",
        lrcorner: "\u231F",
        lrhar: "\u21CB",
        lrhard: "\u296D",
        lrm: "\u200E",
        lrtri: "\u22BF",
        lsaquo: "\u2039",
        Lscr: "\u2112",
        lscr: "\u{1D4C1}",
        Lsh: "\u21B0",
        lsh: "\u21B0",
        lsim: "\u2272",
        lsime: "\u2A8D",
        lsimg: "\u2A8F",
        lsqb: "[",
        lsquo: "\u2018",
        lsquor: "\u201A",
        Lstrok: "\u0141",
        lstrok: "\u0142",
        Lt: "\u226A",
        LT: "<",
        lt: "<",
        ltcc: "\u2AA6",
        ltcir: "\u2A79",
        ltdot: "\u22D6",
        lthree: "\u22CB",
        ltimes: "\u22C9",
        ltlarr: "\u2976",
        ltquest: "\u2A7B",
        ltri: "\u25C3",
        ltrie: "\u22B4",
        ltrif: "\u25C2",
        ltrPar: "\u2996",
        lurdshar: "\u294A",
        luruhar: "\u2966",
        lvertneqq: "\u2268\uFE00",
        lvnE: "\u2268\uFE00",
        macr: "\xAF",
        male: "\u2642",
        malt: "\u2720",
        maltese: "\u2720",
        Map: "\u2905",
        map: "\u21A6",
        mapsto: "\u21A6",
        mapstodown: "\u21A7",
        mapstoleft: "\u21A4",
        mapstoup: "\u21A5",
        marker: "\u25AE",
        mcomma: "\u2A29",
        Mcy: "\u041C",
        mcy: "\u043C",
        mdash: "\u2014",
        mDDot: "\u223A",
        measuredangle: "\u2221",
        MediumSpace: "\u205F",
        Mellintrf: "\u2133",
        Mfr: "\u{1D510}",
        mfr: "\u{1D52A}",
        mho: "\u2127",
        micro: "\xB5",
        mid: "\u2223",
        midast: "*",
        midcir: "\u2AF0",
        middot: "\xB7",
        minus: "\u2212",
        minusb: "\u229F",
        minusd: "\u2238",
        minusdu: "\u2A2A",
        MinusPlus: "\u2213",
        mlcp: "\u2ADB",
        mldr: "\u2026",
        mnplus: "\u2213",
        models: "\u22A7",
        Mopf: "\u{1D544}",
        mopf: "\u{1D55E}",
        mp: "\u2213",
        Mscr: "\u2133",
        mscr: "\u{1D4C2}",
        mstpos: "\u223E",
        Mu: "\u039C",
        mu: "\u03BC",
        multimap: "\u22B8",
        mumap: "\u22B8",
        nabla: "\u2207",
        Nacute: "\u0143",
        nacute: "\u0144",
        nang: "\u2220\u20D2",
        nap: "\u2249",
        napE: "\u2A70\u0338",
        napid: "\u224B\u0338",
        napos: "\u0149",
        napprox: "\u2249",
        natur: "\u266E",
        natural: "\u266E",
        naturals: "\u2115",
        nbsp: "\xA0",
        nbump: "\u224E\u0338",
        nbumpe: "\u224F\u0338",
        ncap: "\u2A43",
        Ncaron: "\u0147",
        ncaron: "\u0148",
        Ncedil: "\u0145",
        ncedil: "\u0146",
        ncong: "\u2247",
        ncongdot: "\u2A6D\u0338",
        ncup: "\u2A42",
        Ncy: "\u041D",
        ncy: "\u043D",
        ndash: "\u2013",
        ne: "\u2260",
        nearhk: "\u2924",
        neArr: "\u21D7",
        nearr: "\u2197",
        nearrow: "\u2197",
        nedot: "\u2250\u0338",
        NegativeMediumSpace: "\u200B",
        NegativeThickSpace: "\u200B",
        NegativeThinSpace: "\u200B",
        NegativeVeryThinSpace: "\u200B",
        nequiv: "\u2262",
        nesear: "\u2928",
        nesim: "\u2242\u0338",
        NestedGreaterGreater: "\u226B",
        NestedLessLess: "\u226A",
        NewLine: "\n",
        nexist: "\u2204",
        nexists: "\u2204",
        Nfr: "\u{1D511}",
        nfr: "\u{1D52B}",
        ngE: "\u2267\u0338",
        nge: "\u2271",
        ngeq: "\u2271",
        ngeqq: "\u2267\u0338",
        ngeqslant: "\u2A7E\u0338",
        nges: "\u2A7E\u0338",
        nGg: "\u22D9\u0338",
        ngsim: "\u2275",
        nGt: "\u226B\u20D2",
        ngt: "\u226F",
        ngtr: "\u226F",
        nGtv: "\u226B\u0338",
        nhArr: "\u21CE",
        nharr: "\u21AE",
        nhpar: "\u2AF2",
        ni: "\u220B",
        nis: "\u22FC",
        nisd: "\u22FA",
        niv: "\u220B",
        NJcy: "\u040A",
        njcy: "\u045A",
        nlArr: "\u21CD",
        nlarr: "\u219A",
        nldr: "\u2025",
        nlE: "\u2266\u0338",
        nle: "\u2270",
        nLeftarrow: "\u21CD",
        nleftarrow: "\u219A",
        nLeftrightarrow: "\u21CE",
        nleftrightarrow: "\u21AE",
        nleq: "\u2270",
        nleqq: "\u2266\u0338",
        nleqslant: "\u2A7D\u0338",
        nles: "\u2A7D\u0338",
        nless: "\u226E",
        nLl: "\u22D8\u0338",
        nlsim: "\u2274",
        nLt: "\u226A\u20D2",
        nlt: "\u226E",
        nltri: "\u22EA",
        nltrie: "\u22EC",
        nLtv: "\u226A\u0338",
        nmid: "\u2224",
        NoBreak: "\u2060",
        NonBreakingSpace: "\xA0",
        Nopf: "\u2115",
        nopf: "\u{1D55F}",
        Not: "\u2AEC",
        not: "\xAC",
        NotCongruent: "\u2262",
        NotCupCap: "\u226D",
        NotDoubleVerticalBar: "\u2226",
        NotElement: "\u2209",
        NotEqual: "\u2260",
        NotEqualTilde: "\u2242\u0338",
        NotExists: "\u2204",
        NotGreater: "\u226F",
        NotGreaterEqual: "\u2271",
        NotGreaterFullEqual: "\u2267\u0338",
        NotGreaterGreater: "\u226B\u0338",
        NotGreaterLess: "\u2279",
        NotGreaterSlantEqual: "\u2A7E\u0338",
        NotGreaterTilde: "\u2275",
        NotHumpDownHump: "\u224E\u0338",
        NotHumpEqual: "\u224F\u0338",
        notin: "\u2209",
        notindot: "\u22F5\u0338",
        notinE: "\u22F9\u0338",
        notinva: "\u2209",
        notinvb: "\u22F7",
        notinvc: "\u22F6",
        NotLeftTriangle: "\u22EA",
        NotLeftTriangleBar: "\u29CF\u0338",
        NotLeftTriangleEqual: "\u22EC",
        NotLess: "\u226E",
        NotLessEqual: "\u2270",
        NotLessGreater: "\u2278",
        NotLessLess: "\u226A\u0338",
        NotLessSlantEqual: "\u2A7D\u0338",
        NotLessTilde: "\u2274",
        NotNestedGreaterGreater: "\u2AA2\u0338",
        NotNestedLessLess: "\u2AA1\u0338",
        notni: "\u220C",
        notniva: "\u220C",
        notnivb: "\u22FE",
        notnivc: "\u22FD",
        NotPrecedes: "\u2280",
        NotPrecedesEqual: "\u2AAF\u0338",
        NotPrecedesSlantEqual: "\u22E0",
        NotReverseElement: "\u220C",
        NotRightTriangle: "\u22EB",
        NotRightTriangleBar: "\u29D0\u0338",
        NotRightTriangleEqual: "\u22ED",
        NotSquareSubset: "\u228F\u0338",
        NotSquareSubsetEqual: "\u22E2",
        NotSquareSuperset: "\u2290\u0338",
        NotSquareSupersetEqual: "\u22E3",
        NotSubset: "\u2282\u20D2",
        NotSubsetEqual: "\u2288",
        NotSucceeds: "\u2281",
        NotSucceedsEqual: "\u2AB0\u0338",
        NotSucceedsSlantEqual: "\u22E1",
        NotSucceedsTilde: "\u227F\u0338",
        NotSuperset: "\u2283\u20D2",
        NotSupersetEqual: "\u2289",
        NotTilde: "\u2241",
        NotTildeEqual: "\u2244",
        NotTildeFullEqual: "\u2247",
        NotTildeTilde: "\u2249",
        NotVerticalBar: "\u2224",
        npar: "\u2226",
        nparallel: "\u2226",
        nparsl: "\u2AFD\u20E5",
        npart: "\u2202\u0338",
        npolint: "\u2A14",
        npr: "\u2280",
        nprcue: "\u22E0",
        npre: "\u2AAF\u0338",
        nprec: "\u2280",
        npreceq: "\u2AAF\u0338",
        nrArr: "\u21CF",
        nrarr: "\u219B",
        nrarrc: "\u2933\u0338",
        nrarrw: "\u219D\u0338",
        nRightarrow: "\u21CF",
        nrightarrow: "\u219B",
        nrtri: "\u22EB",
        nrtrie: "\u22ED",
        nsc: "\u2281",
        nsccue: "\u22E1",
        nsce: "\u2AB0\u0338",
        Nscr: "\u{1D4A9}",
        nscr: "\u{1D4C3}",
        nshortmid: "\u2224",
        nshortparallel: "\u2226",
        nsim: "\u2241",
        nsime: "\u2244",
        nsimeq: "\u2244",
        nsmid: "\u2224",
        nspar: "\u2226",
        nsqsube: "\u22E2",
        nsqsupe: "\u22E3",
        nsub: "\u2284",
        nsubE: "\u2AC5\u0338",
        nsube: "\u2288",
        nsubset: "\u2282\u20D2",
        nsubseteq: "\u2288",
        nsubseteqq: "\u2AC5\u0338",
        nsucc: "\u2281",
        nsucceq: "\u2AB0\u0338",
        nsup: "\u2285",
        nsupE: "\u2AC6\u0338",
        nsupe: "\u2289",
        nsupset: "\u2283\u20D2",
        nsupseteq: "\u2289",
        nsupseteqq: "\u2AC6\u0338",
        ntgl: "\u2279",
        Ntilde: "\xD1",
        ntilde: "\xF1",
        ntlg: "\u2278",
        ntriangleleft: "\u22EA",
        ntrianglelefteq: "\u22EC",
        ntriangleright: "\u22EB",
        ntrianglerighteq: "\u22ED",
        Nu: "\u039D",
        nu: "\u03BD",
        num: "#",
        numero: "\u2116",
        numsp: "\u2007",
        nvap: "\u224D\u20D2",
        nVDash: "\u22AF",
        nVdash: "\u22AE",
        nvDash: "\u22AD",
        nvdash: "\u22AC",
        nvge: "\u2265\u20D2",
        nvgt: ">\u20D2",
        nvHarr: "\u2904",
        nvinfin: "\u29DE",
        nvlArr: "\u2902",
        nvle: "\u2264\u20D2",
        nvlt: "<\u20D2",
        nvltrie: "\u22B4\u20D2",
        nvrArr: "\u2903",
        nvrtrie: "\u22B5\u20D2",
        nvsim: "\u223C\u20D2",
        nwarhk: "\u2923",
        nwArr: "\u21D6",
        nwarr: "\u2196",
        nwarrow: "\u2196",
        nwnear: "\u2927",
        Oacute: "\xD3",
        oacute: "\xF3",
        oast: "\u229B",
        ocir: "\u229A",
        Ocirc: "\xD4",
        ocirc: "\xF4",
        Ocy: "\u041E",
        ocy: "\u043E",
        odash: "\u229D",
        Odblac: "\u0150",
        odblac: "\u0151",
        odiv: "\u2A38",
        odot: "\u2299",
        odsold: "\u29BC",
        OElig: "\u0152",
        oelig: "\u0153",
        ofcir: "\u29BF",
        Ofr: "\u{1D512}",
        ofr: "\u{1D52C}",
        ogon: "\u02DB",
        Ograve: "\xD2",
        ograve: "\xF2",
        ogt: "\u29C1",
        ohbar: "\u29B5",
        ohm: "\u03A9",
        oint: "\u222E",
        olarr: "\u21BA",
        olcir: "\u29BE",
        olcross: "\u29BB",
        oline: "\u203E",
        olt: "\u29C0",
        Omacr: "\u014C",
        omacr: "\u014D",
        Omega: "\u03A9",
        omega: "\u03C9",
        Omicron: "\u039F",
        omicron: "\u03BF",
        omid: "\u29B6",
        ominus: "\u2296",
        Oopf: "\u{1D546}",
        oopf: "\u{1D560}",
        opar: "\u29B7",
        OpenCurlyDoubleQuote: "\u201C",
        OpenCurlyQuote: "\u2018",
        operp: "\u29B9",
        oplus: "\u2295",
        Or: "\u2A54",
        or: "\u2228",
        orarr: "\u21BB",
        ord: "\u2A5D",
        order: "\u2134",
        orderof: "\u2134",
        ordf: "\xAA",
        ordm: "\xBA",
        origof: "\u22B6",
        oror: "\u2A56",
        orslope: "\u2A57",
        orv: "\u2A5B",
        oS: "\u24C8",
        Oscr: "\u{1D4AA}",
        oscr: "\u2134",
        Oslash: "\xD8",
        oslash: "\xF8",
        osol: "\u2298",
        Otilde: "\xD5",
        otilde: "\xF5",
        Otimes: "\u2A37",
        otimes: "\u2297",
        otimesas: "\u2A36",
        Ouml: "\xD6",
        ouml: "\xF6",
        ovbar: "\u233D",
        OverBar: "\u203E",
        OverBrace: "\u23DE",
        OverBracket: "\u23B4",
        OverParenthesis: "\u23DC",
        par: "\u2225",
        para: "\xB6",
        parallel: "\u2225",
        parsim: "\u2AF3",
        parsl: "\u2AFD",
        part: "\u2202",
        PartialD: "\u2202",
        Pcy: "\u041F",
        pcy: "\u043F",
        percnt: "%",
        period: ".",
        permil: "\u2030",
        perp: "\u22A5",
        pertenk: "\u2031",
        Pfr: "\u{1D513}",
        pfr: "\u{1D52D}",
        Phi: "\u03A6",
        phi: "\u03C6",
        phiv: "\u03D5",
        phmmat: "\u2133",
        phone: "\u260E",
        Pi: "\u03A0",
        pi: "\u03C0",
        pitchfork: "\u22D4",
        piv: "\u03D6",
        planck: "\u210F",
        planckh: "\u210E",
        plankv: "\u210F",
        plus: "+",
        plusacir: "\u2A23",
        plusb: "\u229E",
        pluscir: "\u2A22",
        plusdo: "\u2214",
        plusdu: "\u2A25",
        pluse: "\u2A72",
        PlusMinus: "\xB1",
        plusmn: "\xB1",
        plussim: "\u2A26",
        plustwo: "\u2A27",
        pm: "\xB1",
        Poincareplane: "\u210C",
        pointint: "\u2A15",
        Popf: "\u2119",
        popf: "\u{1D561}",
        pound: "\xA3",
        Pr: "\u2ABB",
        pr: "\u227A",
        prap: "\u2AB7",
        prcue: "\u227C",
        prE: "\u2AB3",
        pre: "\u2AAF",
        prec: "\u227A",
        precapprox: "\u2AB7",
        preccurlyeq: "\u227C",
        Precedes: "\u227A",
        PrecedesEqual: "\u2AAF",
        PrecedesSlantEqual: "\u227C",
        PrecedesTilde: "\u227E",
        preceq: "\u2AAF",
        precnapprox: "\u2AB9",
        precneqq: "\u2AB5",
        precnsim: "\u22E8",
        precsim: "\u227E",
        Prime: "\u2033",
        prime: "\u2032",
        primes: "\u2119",
        prnap: "\u2AB9",
        prnE: "\u2AB5",
        prnsim: "\u22E8",
        prod: "\u220F",
        Product: "\u220F",
        profalar: "\u232E",
        profline: "\u2312",
        profsurf: "\u2313",
        prop: "\u221D",
        Proportion: "\u2237",
        Proportional: "\u221D",
        propto: "\u221D",
        prsim: "\u227E",
        prurel: "\u22B0",
        Pscr: "\u{1D4AB}",
        pscr: "\u{1D4C5}",
        Psi: "\u03A8",
        psi: "\u03C8",
        puncsp: "\u2008",
        Qfr: "\u{1D514}",
        qfr: "\u{1D52E}",
        qint: "\u2A0C",
        Qopf: "\u211A",
        qopf: "\u{1D562}",
        qprime: "\u2057",
        Qscr: "\u{1D4AC}",
        qscr: "\u{1D4C6}",
        quaternions: "\u210D",
        quatint: "\u2A16",
        quest: "?",
        questeq: "\u225F",
        QUOT: '"',
        quot: '"',
        rAarr: "\u21DB",
        race: "\u223D\u0331",
        Racute: "\u0154",
        racute: "\u0155",
        radic: "\u221A",
        raemptyv: "\u29B3",
        Rang: "\u27EB",
        rang: "\u27E9",
        rangd: "\u2992",
        range: "\u29A5",
        rangle: "\u27E9",
        raquo: "\xBB",
        Rarr: "\u21A0",
        rArr: "\u21D2",
        rarr: "\u2192",
        rarrap: "\u2975",
        rarrb: "\u21E5",
        rarrbfs: "\u2920",
        rarrc: "\u2933",
        rarrfs: "\u291E",
        rarrhk: "\u21AA",
        rarrlp: "\u21AC",
        rarrpl: "\u2945",
        rarrsim: "\u2974",
        Rarrtl: "\u2916",
        rarrtl: "\u21A3",
        rarrw: "\u219D",
        rAtail: "\u291C",
        ratail: "\u291A",
        ratio: "\u2236",
        rationals: "\u211A",
        RBarr: "\u2910",
        rBarr: "\u290F",
        rbarr: "\u290D",
        rbbrk: "\u2773",
        rbrace: "}",
        rbrack: "]",
        rbrke: "\u298C",
        rbrksld: "\u298E",
        rbrkslu: "\u2990",
        Rcaron: "\u0158",
        rcaron: "\u0159",
        Rcedil: "\u0156",
        rcedil: "\u0157",
        rceil: "\u2309",
        rcub: "}",
        Rcy: "\u0420",
        rcy: "\u0440",
        rdca: "\u2937",
        rdldhar: "\u2969",
        rdquo: "\u201D",
        rdquor: "\u201D",
        rdsh: "\u21B3",
        Re: "\u211C",
        real: "\u211C",
        realine: "\u211B",
        realpart: "\u211C",
        reals: "\u211D",
        rect: "\u25AD",
        REG: "\xAE",
        reg: "\xAE",
        ReverseElement: "\u220B",
        ReverseEquilibrium: "\u21CB",
        ReverseUpEquilibrium: "\u296F",
        rfisht: "\u297D",
        rfloor: "\u230B",
        Rfr: "\u211C",
        rfr: "\u{1D52F}",
        rHar: "\u2964",
        rhard: "\u21C1",
        rharu: "\u21C0",
        rharul: "\u296C",
        Rho: "\u03A1",
        rho: "\u03C1",
        rhov: "\u03F1",
        RightAngleBracket: "\u27E9",
        RightArrow: "\u2192",
        Rightarrow: "\u21D2",
        rightarrow: "\u2192",
        RightArrowBar: "\u21E5",
        RightArrowLeftArrow: "\u21C4",
        rightarrowtail: "\u21A3",
        RightCeiling: "\u2309",
        RightDoubleBracket: "\u27E7",
        RightDownTeeVector: "\u295D",
        RightDownVector: "\u21C2",
        RightDownVectorBar: "\u2955",
        RightFloor: "\u230B",
        rightharpoondown: "\u21C1",
        rightharpoonup: "\u21C0",
        rightleftarrows: "\u21C4",
        rightleftharpoons: "\u21CC",
        rightrightarrows: "\u21C9",
        rightsquigarrow: "\u219D",
        RightTee: "\u22A2",
        RightTeeArrow: "\u21A6",
        RightTeeVector: "\u295B",
        rightthreetimes: "\u22CC",
        RightTriangle: "\u22B3",
        RightTriangleBar: "\u29D0",
        RightTriangleEqual: "\u22B5",
        RightUpDownVector: "\u294F",
        RightUpTeeVector: "\u295C",
        RightUpVector: "\u21BE",
        RightUpVectorBar: "\u2954",
        RightVector: "\u21C0",
        RightVectorBar: "\u2953",
        ring: "\u02DA",
        risingdotseq: "\u2253",
        rlarr: "\u21C4",
        rlhar: "\u21CC",
        rlm: "\u200F",
        rmoust: "\u23B1",
        rmoustache: "\u23B1",
        rnmid: "\u2AEE",
        roang: "\u27ED",
        roarr: "\u21FE",
        robrk: "\u27E7",
        ropar: "\u2986",
        Ropf: "\u211D",
        ropf: "\u{1D563}",
        roplus: "\u2A2E",
        rotimes: "\u2A35",
        RoundImplies: "\u2970",
        rpar: ")",
        rpargt: "\u2994",
        rppolint: "\u2A12",
        rrarr: "\u21C9",
        Rrightarrow: "\u21DB",
        rsaquo: "\u203A",
        Rscr: "\u211B",
        rscr: "\u{1D4C7}",
        Rsh: "\u21B1",
        rsh: "\u21B1",
        rsqb: "]",
        rsquo: "\u2019",
        rsquor: "\u2019",
        rthree: "\u22CC",
        rtimes: "\u22CA",
        rtri: "\u25B9",
        rtrie: "\u22B5",
        rtrif: "\u25B8",
        rtriltri: "\u29CE",
        RuleDelayed: "\u29F4",
        ruluhar: "\u2968",
        rx: "\u211E",
        Sacute: "\u015A",
        sacute: "\u015B",
        sbquo: "\u201A",
        Sc: "\u2ABC",
        sc: "\u227B",
        scap: "\u2AB8",
        Scaron: "\u0160",
        scaron: "\u0161",
        sccue: "\u227D",
        scE: "\u2AB4",
        sce: "\u2AB0",
        Scedil: "\u015E",
        scedil: "\u015F",
        Scirc: "\u015C",
        scirc: "\u015D",
        scnap: "\u2ABA",
        scnE: "\u2AB6",
        scnsim: "\u22E9",
        scpolint: "\u2A13",
        scsim: "\u227F",
        Scy: "\u0421",
        scy: "\u0441",
        sdot: "\u22C5",
        sdotb: "\u22A1",
        sdote: "\u2A66",
        searhk: "\u2925",
        seArr: "\u21D8",
        searr: "\u2198",
        searrow: "\u2198",
        sect: "\xA7",
        semi: ";",
        seswar: "\u2929",
        setminus: "\u2216",
        setmn: "\u2216",
        sext: "\u2736",
        Sfr: "\u{1D516}",
        sfr: "\u{1D530}",
        sfrown: "\u2322",
        sharp: "\u266F",
        SHCHcy: "\u0429",
        shchcy: "\u0449",
        SHcy: "\u0428",
        shcy: "\u0448",
        ShortDownArrow: "\u2193",
        ShortLeftArrow: "\u2190",
        shortmid: "\u2223",
        shortparallel: "\u2225",
        ShortRightArrow: "\u2192",
        ShortUpArrow: "\u2191",
        shy: "\xAD",
        Sigma: "\u03A3",
        sigma: "\u03C3",
        sigmaf: "\u03C2",
        sigmav: "\u03C2",
        sim: "\u223C",
        simdot: "\u2A6A",
        sime: "\u2243",
        simeq: "\u2243",
        simg: "\u2A9E",
        simgE: "\u2AA0",
        siml: "\u2A9D",
        simlE: "\u2A9F",
        simne: "\u2246",
        simplus: "\u2A24",
        simrarr: "\u2972",
        slarr: "\u2190",
        SmallCircle: "\u2218",
        smallsetminus: "\u2216",
        smashp: "\u2A33",
        smeparsl: "\u29E4",
        smid: "\u2223",
        smile: "\u2323",
        smt: "\u2AAA",
        smte: "\u2AAC",
        smtes: "\u2AAC\uFE00",
        SOFTcy: "\u042C",
        softcy: "\u044C",
        sol: "/",
        solb: "\u29C4",
        solbar: "\u233F",
        Sopf: "\u{1D54A}",
        sopf: "\u{1D564}",
        spades: "\u2660",
        spadesuit: "\u2660",
        spar: "\u2225",
        sqcap: "\u2293",
        sqcaps: "\u2293\uFE00",
        sqcup: "\u2294",
        sqcups: "\u2294\uFE00",
        Sqrt: "\u221A",
        sqsub: "\u228F",
        sqsube: "\u2291",
        sqsubset: "\u228F",
        sqsubseteq: "\u2291",
        sqsup: "\u2290",
        sqsupe: "\u2292",
        sqsupset: "\u2290",
        sqsupseteq: "\u2292",
        squ: "\u25A1",
        Square: "\u25A1",
        square: "\u25A1",
        SquareIntersection: "\u2293",
        SquareSubset: "\u228F",
        SquareSubsetEqual: "\u2291",
        SquareSuperset: "\u2290",
        SquareSupersetEqual: "\u2292",
        SquareUnion: "\u2294",
        squarf: "\u25AA",
        squf: "\u25AA",
        srarr: "\u2192",
        Sscr: "\u{1D4AE}",
        sscr: "\u{1D4C8}",
        ssetmn: "\u2216",
        ssmile: "\u2323",
        sstarf: "\u22C6",
        Star: "\u22C6",
        star: "\u2606",
        starf: "\u2605",
        straightepsilon: "\u03F5",
        straightphi: "\u03D5",
        strns: "\xAF",
        Sub: "\u22D0",
        sub: "\u2282",
        subdot: "\u2ABD",
        subE: "\u2AC5",
        sube: "\u2286",
        subedot: "\u2AC3",
        submult: "\u2AC1",
        subnE: "\u2ACB",
        subne: "\u228A",
        subplus: "\u2ABF",
        subrarr: "\u2979",
        Subset: "\u22D0",
        subset: "\u2282",
        subseteq: "\u2286",
        subseteqq: "\u2AC5",
        SubsetEqual: "\u2286",
        subsetneq: "\u228A",
        subsetneqq: "\u2ACB",
        subsim: "\u2AC7",
        subsub: "\u2AD5",
        subsup: "\u2AD3",
        succ: "\u227B",
        succapprox: "\u2AB8",
        succcurlyeq: "\u227D",
        Succeeds: "\u227B",
        SucceedsEqual: "\u2AB0",
        SucceedsSlantEqual: "\u227D",
        SucceedsTilde: "\u227F",
        succeq: "\u2AB0",
        succnapprox: "\u2ABA",
        succneqq: "\u2AB6",
        succnsim: "\u22E9",
        succsim: "\u227F",
        SuchThat: "\u220B",
        Sum: "\u2211",
        sum: "\u2211",
        sung: "\u266A",
        Sup: "\u22D1",
        sup: "\u2283",
        sup1: "\xB9",
        sup2: "\xB2",
        sup3: "\xB3",
        supdot: "\u2ABE",
        supdsub: "\u2AD8",
        supE: "\u2AC6",
        supe: "\u2287",
        supedot: "\u2AC4",
        Superset: "\u2283",
        SupersetEqual: "\u2287",
        suphsol: "\u27C9",
        suphsub: "\u2AD7",
        suplarr: "\u297B",
        supmult: "\u2AC2",
        supnE: "\u2ACC",
        supne: "\u228B",
        supplus: "\u2AC0",
        Supset: "\u22D1",
        supset: "\u2283",
        supseteq: "\u2287",
        supseteqq: "\u2AC6",
        supsetneq: "\u228B",
        supsetneqq: "\u2ACC",
        supsim: "\u2AC8",
        supsub: "\u2AD4",
        supsup: "\u2AD6",
        swarhk: "\u2926",
        swArr: "\u21D9",
        swarr: "\u2199",
        swarrow: "\u2199",
        swnwar: "\u292A",
        szlig: "\xDF",
        Tab: "	",
        target: "\u2316",
        Tau: "\u03A4",
        tau: "\u03C4",
        tbrk: "\u23B4",
        Tcaron: "\u0164",
        tcaron: "\u0165",
        Tcedil: "\u0162",
        tcedil: "\u0163",
        Tcy: "\u0422",
        tcy: "\u0442",
        tdot: "\u20DB",
        telrec: "\u2315",
        Tfr: "\u{1D517}",
        tfr: "\u{1D531}",
        there4: "\u2234",
        Therefore: "\u2234",
        therefore: "\u2234",
        Theta: "\u0398",
        theta: "\u03B8",
        thetasym: "\u03D1",
        thetav: "\u03D1",
        thickapprox: "\u2248",
        thicksim: "\u223C",
        ThickSpace: "\u205F\u200A",
        thinsp: "\u2009",
        ThinSpace: "\u2009",
        thkap: "\u2248",
        thksim: "\u223C",
        THORN: "\xDE",
        thorn: "\xFE",
        Tilde: "\u223C",
        tilde: "\u02DC",
        TildeEqual: "\u2243",
        TildeFullEqual: "\u2245",
        TildeTilde: "\u2248",
        times: "\xD7",
        timesb: "\u22A0",
        timesbar: "\u2A31",
        timesd: "\u2A30",
        tint: "\u222D",
        toea: "\u2928",
        top: "\u22A4",
        topbot: "\u2336",
        topcir: "\u2AF1",
        Topf: "\u{1D54B}",
        topf: "\u{1D565}",
        topfork: "\u2ADA",
        tosa: "\u2929",
        tprime: "\u2034",
        TRADE: "\u2122",
        trade: "\u2122",
        triangle: "\u25B5",
        triangledown: "\u25BF",
        triangleleft: "\u25C3",
        trianglelefteq: "\u22B4",
        triangleq: "\u225C",
        triangleright: "\u25B9",
        trianglerighteq: "\u22B5",
        tridot: "\u25EC",
        trie: "\u225C",
        triminus: "\u2A3A",
        TripleDot: "\u20DB",
        triplus: "\u2A39",
        trisb: "\u29CD",
        tritime: "\u2A3B",
        trpezium: "\u23E2",
        Tscr: "\u{1D4AF}",
        tscr: "\u{1D4C9}",
        TScy: "\u0426",
        tscy: "\u0446",
        TSHcy: "\u040B",
        tshcy: "\u045B",
        Tstrok: "\u0166",
        tstrok: "\u0167",
        twixt: "\u226C",
        twoheadleftarrow: "\u219E",
        twoheadrightarrow: "\u21A0",
        Uacute: "\xDA",
        uacute: "\xFA",
        Uarr: "\u219F",
        uArr: "\u21D1",
        uarr: "\u2191",
        Uarrocir: "\u2949",
        Ubrcy: "\u040E",
        ubrcy: "\u045E",
        Ubreve: "\u016C",
        ubreve: "\u016D",
        Ucirc: "\xDB",
        ucirc: "\xFB",
        Ucy: "\u0423",
        ucy: "\u0443",
        udarr: "\u21C5",
        Udblac: "\u0170",
        udblac: "\u0171",
        udhar: "\u296E",
        ufisht: "\u297E",
        Ufr: "\u{1D518}",
        ufr: "\u{1D532}",
        Ugrave: "\xD9",
        ugrave: "\xF9",
        uHar: "\u2963",
        uharl: "\u21BF",
        uharr: "\u21BE",
        uhblk: "\u2580",
        ulcorn: "\u231C",
        ulcorner: "\u231C",
        ulcrop: "\u230F",
        ultri: "\u25F8",
        Umacr: "\u016A",
        umacr: "\u016B",
        uml: "\xA8",
        UnderBar: "_",
        UnderBrace: "\u23DF",
        UnderBracket: "\u23B5",
        UnderParenthesis: "\u23DD",
        Union: "\u22C3",
        UnionPlus: "\u228E",
        Uogon: "\u0172",
        uogon: "\u0173",
        Uopf: "\u{1D54C}",
        uopf: "\u{1D566}",
        UpArrow: "\u2191",
        Uparrow: "\u21D1",
        uparrow: "\u2191",
        UpArrowBar: "\u2912",
        UpArrowDownArrow: "\u21C5",
        UpDownArrow: "\u2195",
        Updownarrow: "\u21D5",
        updownarrow: "\u2195",
        UpEquilibrium: "\u296E",
        upharpoonleft: "\u21BF",
        upharpoonright: "\u21BE",
        uplus: "\u228E",
        UpperLeftArrow: "\u2196",
        UpperRightArrow: "\u2197",
        Upsi: "\u03D2",
        upsi: "\u03C5",
        upsih: "\u03D2",
        Upsilon: "\u03A5",
        upsilon: "\u03C5",
        UpTee: "\u22A5",
        UpTeeArrow: "\u21A5",
        upuparrows: "\u21C8",
        urcorn: "\u231D",
        urcorner: "\u231D",
        urcrop: "\u230E",
        Uring: "\u016E",
        uring: "\u016F",
        urtri: "\u25F9",
        Uscr: "\u{1D4B0}",
        uscr: "\u{1D4CA}",
        utdot: "\u22F0",
        Utilde: "\u0168",
        utilde: "\u0169",
        utri: "\u25B5",
        utrif: "\u25B4",
        uuarr: "\u21C8",
        Uuml: "\xDC",
        uuml: "\xFC",
        uwangle: "\u29A7",
        vangrt: "\u299C",
        varepsilon: "\u03F5",
        varkappa: "\u03F0",
        varnothing: "\u2205",
        varphi: "\u03D5",
        varpi: "\u03D6",
        varpropto: "\u221D",
        vArr: "\u21D5",
        varr: "\u2195",
        varrho: "\u03F1",
        varsigma: "\u03C2",
        varsubsetneq: "\u228A\uFE00",
        varsubsetneqq: "\u2ACB\uFE00",
        varsupsetneq: "\u228B\uFE00",
        varsupsetneqq: "\u2ACC\uFE00",
        vartheta: "\u03D1",
        vartriangleleft: "\u22B2",
        vartriangleright: "\u22B3",
        Vbar: "\u2AEB",
        vBar: "\u2AE8",
        vBarv: "\u2AE9",
        Vcy: "\u0412",
        vcy: "\u0432",
        VDash: "\u22AB",
        Vdash: "\u22A9",
        vDash: "\u22A8",
        vdash: "\u22A2",
        Vdashl: "\u2AE6",
        Vee: "\u22C1",
        vee: "\u2228",
        veebar: "\u22BB",
        veeeq: "\u225A",
        vellip: "\u22EE",
        Verbar: "\u2016",
        verbar: "|",
        Vert: "\u2016",
        vert: "|",
        VerticalBar: "\u2223",
        VerticalLine: "|",
        VerticalSeparator: "\u2758",
        VerticalTilde: "\u2240",
        VeryThinSpace: "\u200A",
        Vfr: "\u{1D519}",
        vfr: "\u{1D533}",
        vltri: "\u22B2",
        vnsub: "\u2282\u20D2",
        vnsup: "\u2283\u20D2",
        Vopf: "\u{1D54D}",
        vopf: "\u{1D567}",
        vprop: "\u221D",
        vrtri: "\u22B3",
        Vscr: "\u{1D4B1}",
        vscr: "\u{1D4CB}",
        vsubnE: "\u2ACB\uFE00",
        vsubne: "\u228A\uFE00",
        vsupnE: "\u2ACC\uFE00",
        vsupne: "\u228B\uFE00",
        Vvdash: "\u22AA",
        vzigzag: "\u299A",
        Wcirc: "\u0174",
        wcirc: "\u0175",
        wedbar: "\u2A5F",
        Wedge: "\u22C0",
        wedge: "\u2227",
        wedgeq: "\u2259",
        weierp: "\u2118",
        Wfr: "\u{1D51A}",
        wfr: "\u{1D534}",
        Wopf: "\u{1D54E}",
        wopf: "\u{1D568}",
        wp: "\u2118",
        wr: "\u2240",
        wreath: "\u2240",
        Wscr: "\u{1D4B2}",
        wscr: "\u{1D4CC}",
        xcap: "\u22C2",
        xcirc: "\u25EF",
        xcup: "\u22C3",
        xdtri: "\u25BD",
        Xfr: "\u{1D51B}",
        xfr: "\u{1D535}",
        xhArr: "\u27FA",
        xharr: "\u27F7",
        Xi: "\u039E",
        xi: "\u03BE",
        xlArr: "\u27F8",
        xlarr: "\u27F5",
        xmap: "\u27FC",
        xnis: "\u22FB",
        xodot: "\u2A00",
        Xopf: "\u{1D54F}",
        xopf: "\u{1D569}",
        xoplus: "\u2A01",
        xotime: "\u2A02",
        xrArr: "\u27F9",
        xrarr: "\u27F6",
        Xscr: "\u{1D4B3}",
        xscr: "\u{1D4CD}",
        xsqcup: "\u2A06",
        xuplus: "\u2A04",
        xutri: "\u25B3",
        xvee: "\u22C1",
        xwedge: "\u22C0",
        Yacute: "\xDD",
        yacute: "\xFD",
        YAcy: "\u042F",
        yacy: "\u044F",
        Ycirc: "\u0176",
        ycirc: "\u0177",
        Ycy: "\u042B",
        ycy: "\u044B",
        yen: "\xA5",
        Yfr: "\u{1D51C}",
        yfr: "\u{1D536}",
        YIcy: "\u0407",
        yicy: "\u0457",
        Yopf: "\u{1D550}",
        yopf: "\u{1D56A}",
        Yscr: "\u{1D4B4}",
        yscr: "\u{1D4CE}",
        YUcy: "\u042E",
        yucy: "\u044E",
        Yuml: "\u0178",
        yuml: "\xFF",
        Zacute: "\u0179",
        zacute: "\u017A",
        Zcaron: "\u017D",
        zcaron: "\u017E",
        Zcy: "\u0417",
        zcy: "\u0437",
        Zdot: "\u017B",
        zdot: "\u017C",
        zeetrf: "\u2128",
        ZeroWidthSpace: "\u200B",
        Zeta: "\u0396",
        zeta: "\u03B6",
        Zfr: "\u2128",
        zfr: "\u{1D537}",
        ZHcy: "\u0416",
        zhcy: "\u0436",
        zigrarr: "\u21DD",
        Zopf: "\u2124",
        zopf: "\u{1D56B}",
        Zscr: "\u{1D4B5}",
        zscr: "\u{1D4CF}",
        zwj: "\u200D",
        zwnj: "\u200C"
      });
      exports.entityMap = exports.HTML_ENTITIES;
    }
  });

  // node_modules/.pnpm/@xmldom+xmldom@0.7.13/node_modules/@xmldom/xmldom/lib/sax.js
  var require_sax2 = __commonJS({
    "node_modules/.pnpm/@xmldom+xmldom@0.7.13/node_modules/@xmldom/xmldom/lib/sax.js"(exports) {
      var NAMESPACE = require_conventions2().NAMESPACE;
      var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
      var nameChar = new RegExp("[\\-\\.0-9" + nameStartChar.source.slice(1, -1) + "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
      var tagNamePattern = new RegExp("^" + nameStartChar.source + nameChar.source + "*(?::" + nameStartChar.source + nameChar.source + "*)?$");
      var S_TAG = 0;
      var S_ATTR = 1;
      var S_ATTR_SPACE = 2;
      var S_EQ = 3;
      var S_ATTR_NOQUOT_VALUE = 4;
      var S_ATTR_END = 5;
      var S_TAG_SPACE = 6;
      var S_TAG_CLOSE = 7;
      function ParseError(message, locator) {
        this.message = message;
        this.locator = locator;
        if (Error.captureStackTrace) Error.captureStackTrace(this, ParseError);
      }
      ParseError.prototype = new Error();
      ParseError.prototype.name = ParseError.name;
      function XMLReader() {
      }
      XMLReader.prototype = {
        parse: function(source, defaultNSMap, entityMap) {
          var domBuilder = this.domBuilder;
          domBuilder.startDocument();
          _copy(defaultNSMap, defaultNSMap = {});
          parse(
            source,
            defaultNSMap,
            entityMap,
            domBuilder,
            this.errorHandler
          );
          domBuilder.endDocument();
        }
      };
      function parse(source, defaultNSMapCopy, entityMap, domBuilder, errorHandler) {
        function fixedFromCharCode(code) {
          if (code > 65535) {
            code -= 65536;
            var surrogate1 = 55296 + (code >> 10), surrogate2 = 56320 + (code & 1023);
            return String.fromCharCode(surrogate1, surrogate2);
          } else {
            return String.fromCharCode(code);
          }
        }
        function entityReplacer(a2) {
          var k = a2.slice(1, -1);
          if (k in entityMap) {
            return entityMap[k];
          } else if (k.charAt(0) === "#") {
            return fixedFromCharCode(parseInt(k.substr(1).replace("x", "0x")));
          } else {
            errorHandler.error("entity not found:" + a2);
            return a2;
          }
        }
        function appendText(end2) {
          if (end2 > start) {
            var xt = source.substring(start, end2).replace(/&#?\w+;/g, entityReplacer);
            locator && position(start);
            domBuilder.characters(xt, 0, end2 - start);
            start = end2;
          }
        }
        function position(p, m) {
          while (p >= lineEnd && (m = linePattern.exec(source))) {
            lineStart = m.index;
            lineEnd = lineStart + m[0].length;
            locator.lineNumber++;
          }
          locator.columnNumber = p - lineStart + 1;
        }
        var lineStart = 0;
        var lineEnd = 0;
        var linePattern = /.*(?:\r\n?|\n)|.*$/g;
        var locator = domBuilder.locator;
        var parseStack = [{ currentNSMap: defaultNSMapCopy }];
        var closeMap = {};
        var start = 0;
        while (true) {
          try {
            var tagStart = source.indexOf("<", start);
            if (tagStart < 0) {
              if (!source.substr(start).match(/^\s*$/)) {
                var doc = domBuilder.doc;
                var text = doc.createTextNode(source.substr(start));
                doc.appendChild(text);
                domBuilder.currentElement = text;
              }
              return;
            }
            if (tagStart > start) {
              appendText(tagStart);
            }
            switch (source.charAt(tagStart + 1)) {
              case "/":
                var end = source.indexOf(">", tagStart + 3);
                var tagName = source.substring(tagStart + 2, end).replace(/[ \t\n\r]+$/g, "");
                var config = parseStack.pop();
                if (end < 0) {
                  tagName = source.substring(tagStart + 2).replace(/[\s<].*/, "");
                  errorHandler.error("end tag name: " + tagName + " is not complete:" + config.tagName);
                  end = tagStart + 1 + tagName.length;
                } else if (tagName.match(/\s</)) {
                  tagName = tagName.replace(/[\s<].*/, "");
                  errorHandler.error("end tag name: " + tagName + " maybe not complete");
                  end = tagStart + 1 + tagName.length;
                }
                var localNSMap = config.localNSMap;
                var endMatch = config.tagName == tagName;
                var endIgnoreCaseMach = endMatch || config.tagName && config.tagName.toLowerCase() == tagName.toLowerCase();
                if (endIgnoreCaseMach) {
                  domBuilder.endElement(config.uri, config.localName, tagName);
                  if (localNSMap) {
                    for (var prefix in localNSMap) {
                      if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
                        domBuilder.endPrefixMapping(prefix);
                      }
                    }
                  }
                  if (!endMatch) {
                    errorHandler.fatalError("end tag name: " + tagName + " is not match the current start tagName:" + config.tagName);
                  }
                } else {
                  parseStack.push(config);
                }
                end++;
                break;
              // end elment
              case "?":
                locator && position(tagStart);
                end = parseInstruction(source, tagStart, domBuilder);
                break;
              case "!":
                locator && position(tagStart);
                end = parseDCC(source, tagStart, domBuilder, errorHandler);
                break;
              default:
                locator && position(tagStart);
                var el = new ElementAttributes();
                var currentNSMap = parseStack[parseStack.length - 1].currentNSMap;
                var end = parseElementStartPart(source, tagStart, el, currentNSMap, entityReplacer, errorHandler);
                var len = el.length;
                if (!el.closed && fixSelfClosed(source, end, el.tagName, closeMap)) {
                  el.closed = true;
                  if (!entityMap.nbsp) {
                    errorHandler.warning("unclosed xml attribute");
                  }
                }
                if (locator && len) {
                  var locator2 = copyLocator(locator, {});
                  for (var i = 0; i < len; i++) {
                    var a = el[i];
                    position(a.offset);
                    a.locator = copyLocator(locator, {});
                  }
                  domBuilder.locator = locator2;
                  if (appendElement(el, domBuilder, currentNSMap)) {
                    parseStack.push(el);
                  }
                  domBuilder.locator = locator;
                } else {
                  if (appendElement(el, domBuilder, currentNSMap)) {
                    parseStack.push(el);
                  }
                }
                if (NAMESPACE.isHTML(el.uri) && !el.closed) {
                  end = parseHtmlSpecialContent(source, end, el.tagName, entityReplacer, domBuilder);
                } else {
                  end++;
                }
            }
          } catch (e) {
            if (e instanceof ParseError) {
              throw e;
            }
            errorHandler.error("element parse error: " + e);
            end = -1;
          }
          if (end > start) {
            start = end;
          } else {
            appendText(Math.max(tagStart, start) + 1);
          }
        }
      }
      function copyLocator(f, t) {
        t.lineNumber = f.lineNumber;
        t.columnNumber = f.columnNumber;
        return t;
      }
      function parseElementStartPart(source, start, el, currentNSMap, entityReplacer, errorHandler) {
        function addAttribute(qname, value2, startIndex) {
          if (el.attributeNames.hasOwnProperty(qname)) {
            errorHandler.fatalError("Attribute " + qname + " redefined");
          }
          el.addValue(qname, value2, startIndex);
        }
        var attrName;
        var value;
        var p = ++start;
        var s = S_TAG;
        while (true) {
          var c = source.charAt(p);
          switch (c) {
            case "=":
              if (s === S_ATTR) {
                attrName = source.slice(start, p);
                s = S_EQ;
              } else if (s === S_ATTR_SPACE) {
                s = S_EQ;
              } else {
                throw new Error("attribute equal must after attrName");
              }
              break;
            case "'":
            case '"':
              if (s === S_EQ || s === S_ATTR) {
                if (s === S_ATTR) {
                  errorHandler.warning('attribute value must after "="');
                  attrName = source.slice(start, p);
                }
                start = p + 1;
                p = source.indexOf(c, start);
                if (p > 0) {
                  value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
                  addAttribute(attrName, value, start - 1);
                  s = S_ATTR_END;
                } else {
                  throw new Error("attribute value no end '" + c + "' match");
                }
              } else if (s == S_ATTR_NOQUOT_VALUE) {
                value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
                addAttribute(attrName, value, start);
                errorHandler.warning('attribute "' + attrName + '" missed start quot(' + c + ")!!");
                start = p + 1;
                s = S_ATTR_END;
              } else {
                throw new Error('attribute value must after "="');
              }
              break;
            case "/":
              switch (s) {
                case S_TAG:
                  el.setTagName(source.slice(start, p));
                case S_ATTR_END:
                case S_TAG_SPACE:
                case S_TAG_CLOSE:
                  s = S_TAG_CLOSE;
                  el.closed = true;
                case S_ATTR_NOQUOT_VALUE:
                case S_ATTR:
                  break;
                case S_ATTR_SPACE:
                  el.closed = true;
                  break;
                //case S_EQ:
                default:
                  throw new Error("attribute invalid close char('/')");
              }
              break;
            case "":
              errorHandler.error("unexpected end of input");
              if (s == S_TAG) {
                el.setTagName(source.slice(start, p));
              }
              return p;
            case ">":
              switch (s) {
                case S_TAG:
                  el.setTagName(source.slice(start, p));
                case S_ATTR_END:
                case S_TAG_SPACE:
                case S_TAG_CLOSE:
                  break;
                //normal
                case S_ATTR_NOQUOT_VALUE:
                //Compatible state
                case S_ATTR:
                  value = source.slice(start, p);
                  if (value.slice(-1) === "/") {
                    el.closed = true;
                    value = value.slice(0, -1);
                  }
                case S_ATTR_SPACE:
                  if (s === S_ATTR_SPACE) {
                    value = attrName;
                  }
                  if (s == S_ATTR_NOQUOT_VALUE) {
                    errorHandler.warning('attribute "' + value + '" missed quot(")!');
                    addAttribute(attrName, value.replace(/&#?\w+;/g, entityReplacer), start);
                  } else {
                    if (!NAMESPACE.isHTML(currentNSMap[""]) || !value.match(/^(?:disabled|checked|selected)$/i)) {
                      errorHandler.warning('attribute "' + value + '" missed value!! "' + value + '" instead!!');
                    }
                    addAttribute(value, value, start);
                  }
                  break;
                case S_EQ:
                  throw new Error("attribute value missed!!");
              }
              return p;
            /*xml space '\x20' | #x9 | #xD | #xA; */
            case "\x80":
              c = " ";
            default:
              if (c <= " ") {
                switch (s) {
                  case S_TAG:
                    el.setTagName(source.slice(start, p));
                    s = S_TAG_SPACE;
                    break;
                  case S_ATTR:
                    attrName = source.slice(start, p);
                    s = S_ATTR_SPACE;
                    break;
                  case S_ATTR_NOQUOT_VALUE:
                    var value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
                    errorHandler.warning('attribute "' + value + '" missed quot(")!!');
                    addAttribute(attrName, value, start);
                  case S_ATTR_END:
                    s = S_TAG_SPACE;
                    break;
                }
              } else {
                switch (s) {
                  //case S_TAG:void();break;
                  //case S_ATTR:void();break;
                  //case S_ATTR_NOQUOT_VALUE:void();break;
                  case S_ATTR_SPACE:
                    var tagName = el.tagName;
                    if (!NAMESPACE.isHTML(currentNSMap[""]) || !attrName.match(/^(?:disabled|checked|selected)$/i)) {
                      errorHandler.warning('attribute "' + attrName + '" missed value!! "' + attrName + '" instead2!!');
                    }
                    addAttribute(attrName, attrName, start);
                    start = p;
                    s = S_ATTR;
                    break;
                  case S_ATTR_END:
                    errorHandler.warning('attribute space is required"' + attrName + '"!!');
                  case S_TAG_SPACE:
                    s = S_ATTR;
                    start = p;
                    break;
                  case S_EQ:
                    s = S_ATTR_NOQUOT_VALUE;
                    start = p;
                    break;
                  case S_TAG_CLOSE:
                    throw new Error("elements closed character '/' and '>' must be connected to");
                }
              }
          }
          p++;
        }
      }
      function appendElement(el, domBuilder, currentNSMap) {
        var tagName = el.tagName;
        var localNSMap = null;
        var i = el.length;
        while (i--) {
          var a = el[i];
          var qName = a.qName;
          var value = a.value;
          var nsp = qName.indexOf(":");
          if (nsp > 0) {
            var prefix = a.prefix = qName.slice(0, nsp);
            var localName = qName.slice(nsp + 1);
            var nsPrefix = prefix === "xmlns" && localName;
          } else {
            localName = qName;
            prefix = null;
            nsPrefix = qName === "xmlns" && "";
          }
          a.localName = localName;
          if (nsPrefix !== false) {
            if (localNSMap == null) {
              localNSMap = {};
              _copy(currentNSMap, currentNSMap = {});
            }
            currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
            a.uri = NAMESPACE.XMLNS;
            domBuilder.startPrefixMapping(nsPrefix, value);
          }
        }
        var i = el.length;
        while (i--) {
          a = el[i];
          var prefix = a.prefix;
          if (prefix) {
            if (prefix === "xml") {
              a.uri = NAMESPACE.XML;
            }
            if (prefix !== "xmlns") {
              a.uri = currentNSMap[prefix || ""];
            }
          }
        }
        var nsp = tagName.indexOf(":");
        if (nsp > 0) {
          prefix = el.prefix = tagName.slice(0, nsp);
          localName = el.localName = tagName.slice(nsp + 1);
        } else {
          prefix = null;
          localName = el.localName = tagName;
        }
        var ns = el.uri = currentNSMap[prefix || ""];
        domBuilder.startElement(ns, localName, tagName, el);
        if (el.closed) {
          domBuilder.endElement(ns, localName, tagName);
          if (localNSMap) {
            for (prefix in localNSMap) {
              if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
                domBuilder.endPrefixMapping(prefix);
              }
            }
          }
        } else {
          el.currentNSMap = currentNSMap;
          el.localNSMap = localNSMap;
          return true;
        }
      }
      function parseHtmlSpecialContent(source, elStartEnd, tagName, entityReplacer, domBuilder) {
        if (/^(?:script|textarea)$/i.test(tagName)) {
          var elEndStart = source.indexOf("</" + tagName + ">", elStartEnd);
          var text = source.substring(elStartEnd + 1, elEndStart);
          if (/[&<]/.test(text)) {
            if (/^script$/i.test(tagName)) {
              domBuilder.characters(text, 0, text.length);
              return elEndStart;
            }
            text = text.replace(/&#?\w+;/g, entityReplacer);
            domBuilder.characters(text, 0, text.length);
            return elEndStart;
          }
        }
        return elStartEnd + 1;
      }
      function fixSelfClosed(source, elStartEnd, tagName, closeMap) {
        var pos = closeMap[tagName];
        if (pos == null) {
          pos = source.lastIndexOf("</" + tagName + ">");
          if (pos < elStartEnd) {
            pos = source.lastIndexOf("</" + tagName);
          }
          closeMap[tagName] = pos;
        }
        return pos < elStartEnd;
      }
      function _copy(source, target) {
        for (var n in source) {
          if (Object.prototype.hasOwnProperty.call(source, n)) {
            target[n] = source[n];
          }
        }
      }
      function parseDCC(source, start, domBuilder, errorHandler) {
        var next = source.charAt(start + 2);
        switch (next) {
          case "-":
            if (source.charAt(start + 3) === "-") {
              var end = source.indexOf("-->", start + 4);
              if (end > start) {
                domBuilder.comment(source, start + 4, end - start - 4);
                return end + 3;
              } else {
                errorHandler.error("Unclosed comment");
                return -1;
              }
            } else {
              return -1;
            }
          default:
            if (source.substr(start + 3, 6) == "CDATA[") {
              var end = source.indexOf("]]>", start + 9);
              domBuilder.startCDATA();
              domBuilder.characters(source, start + 9, end - start - 9);
              domBuilder.endCDATA();
              return end + 3;
            }
            var matchs = split(source, start);
            var len = matchs.length;
            if (len > 1 && /!doctype/i.test(matchs[0][0])) {
              var name = matchs[1][0];
              var pubid = false;
              var sysid = false;
              if (len > 3) {
                if (/^public$/i.test(matchs[2][0])) {
                  pubid = matchs[3][0];
                  sysid = len > 4 && matchs[4][0];
                } else if (/^system$/i.test(matchs[2][0])) {
                  sysid = matchs[3][0];
                }
              }
              var lastMatch = matchs[len - 1];
              domBuilder.startDTD(name, pubid, sysid);
              domBuilder.endDTD();
              return lastMatch.index + lastMatch[0].length;
            }
        }
        return -1;
      }
      function parseInstruction(source, start, domBuilder) {
        var end = source.indexOf("?>", start);
        if (end) {
          var match = source.substring(start, end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
          if (match) {
            var len = match[0].length;
            domBuilder.processingInstruction(match[1], match[2]);
            return end + 2;
          } else {
            return -1;
          }
        }
        return -1;
      }
      function ElementAttributes() {
        this.attributeNames = {};
      }
      ElementAttributes.prototype = {
        setTagName: function(tagName) {
          if (!tagNamePattern.test(tagName)) {
            throw new Error("invalid tagName:" + tagName);
          }
          this.tagName = tagName;
        },
        addValue: function(qName, value, offset) {
          if (!tagNamePattern.test(qName)) {
            throw new Error("invalid attribute:" + qName);
          }
          this.attributeNames[qName] = this.length;
          this[this.length++] = { qName, value, offset };
        },
        length: 0,
        getLocalName: function(i) {
          return this[i].localName;
        },
        getLocator: function(i) {
          return this[i].locator;
        },
        getQName: function(i) {
          return this[i].qName;
        },
        getURI: function(i) {
          return this[i].uri;
        },
        getValue: function(i) {
          return this[i].value;
        }
        //	,getIndex:function(uri, localName)){
        //		if(localName){
        //
        //		}else{
        //			var qName = uri
        //		}
        //	},
        //	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
        //	getType:function(uri,localName){}
        //	getType:function(i){},
      };
      function split(source, start) {
        var match;
        var buf = [];
        var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
        reg.lastIndex = start;
        reg.exec(source);
        while (match = reg.exec(source)) {
          buf.push(match);
          if (match[1]) return buf;
        }
      }
      exports.XMLReader = XMLReader;
      exports.ParseError = ParseError;
    }
  });

  // node_modules/.pnpm/@xmldom+xmldom@0.7.13/node_modules/@xmldom/xmldom/lib/dom-parser.js
  var require_dom_parser2 = __commonJS({
    "node_modules/.pnpm/@xmldom+xmldom@0.7.13/node_modules/@xmldom/xmldom/lib/dom-parser.js"(exports) {
      var conventions = require_conventions2();
      var dom = require_dom2();
      var entities = require_entities2();
      var sax = require_sax2();
      var DOMImplementation = dom.DOMImplementation;
      var NAMESPACE = conventions.NAMESPACE;
      var ParseError = sax.ParseError;
      var XMLReader = sax.XMLReader;
      function DOMParser3(options) {
        this.options = options || { locator: {} };
      }
      DOMParser3.prototype.parseFromString = function(source, mimeType) {
        var options = this.options;
        var sax2 = new XMLReader();
        var domBuilder = options.domBuilder || new DOMHandler();
        var errorHandler = options.errorHandler;
        var locator = options.locator;
        var defaultNSMap = options.xmlns || {};
        var isHTML = /\/x?html?$/.test(mimeType);
        var entityMap = isHTML ? entities.HTML_ENTITIES : entities.XML_ENTITIES;
        if (locator) {
          domBuilder.setDocumentLocator(locator);
        }
        sax2.errorHandler = buildErrorHandler(errorHandler, domBuilder, locator);
        sax2.domBuilder = options.domBuilder || domBuilder;
        if (isHTML) {
          defaultNSMap[""] = NAMESPACE.HTML;
        }
        defaultNSMap.xml = defaultNSMap.xml || NAMESPACE.XML;
        if (source && typeof source === "string") {
          sax2.parse(source, defaultNSMap, entityMap);
        } else {
          sax2.errorHandler.error("invalid doc source");
        }
        return domBuilder.doc;
      };
      function buildErrorHandler(errorImpl, domBuilder, locator) {
        if (!errorImpl) {
          if (domBuilder instanceof DOMHandler) {
            return domBuilder;
          }
          errorImpl = domBuilder;
        }
        var errorHandler = {};
        var isCallback = errorImpl instanceof Function;
        locator = locator || {};
        function build(key) {
          var fn = errorImpl[key];
          if (!fn && isCallback) {
            fn = errorImpl.length == 2 ? function(msg) {
              errorImpl(key, msg);
            } : errorImpl;
          }
          errorHandler[key] = fn && function(msg) {
            fn("[xmldom " + key + "]	" + msg + _locator(locator));
          } || function() {
          };
        }
        build("warning");
        build("error");
        build("fatalError");
        return errorHandler;
      }
      function DOMHandler() {
        this.cdata = false;
      }
      function position(locator, node) {
        node.lineNumber = locator.lineNumber;
        node.columnNumber = locator.columnNumber;
      }
      DOMHandler.prototype = {
        startDocument: function() {
          this.doc = new DOMImplementation().createDocument(null, null, null);
          if (this.locator) {
            this.doc.documentURI = this.locator.systemId;
          }
        },
        startElement: function(namespaceURI, localName, qName, attrs) {
          var doc = this.doc;
          var el = doc.createElementNS(namespaceURI, qName || localName);
          var len = attrs.length;
          appendElement(this, el);
          this.currentElement = el;
          this.locator && position(this.locator, el);
          for (var i = 0; i < len; i++) {
            var namespaceURI = attrs.getURI(i);
            var value = attrs.getValue(i);
            var qName = attrs.getQName(i);
            var attr = doc.createAttributeNS(namespaceURI, qName);
            this.locator && position(attrs.getLocator(i), attr);
            attr.value = attr.nodeValue = value;
            el.setAttributeNode(attr);
          }
        },
        endElement: function(namespaceURI, localName, qName) {
          var current = this.currentElement;
          var tagName = current.tagName;
          this.currentElement = current.parentNode;
        },
        startPrefixMapping: function(prefix, uri) {
        },
        endPrefixMapping: function(prefix) {
        },
        processingInstruction: function(target, data) {
          var ins = this.doc.createProcessingInstruction(target, data);
          this.locator && position(this.locator, ins);
          appendElement(this, ins);
        },
        ignorableWhitespace: function(ch, start, length) {
        },
        characters: function(chars, start, length) {
          chars = _toString.apply(this, arguments);
          if (chars) {
            if (this.cdata) {
              var charNode = this.doc.createCDATASection(chars);
            } else {
              var charNode = this.doc.createTextNode(chars);
            }
            if (this.currentElement) {
              this.currentElement.appendChild(charNode);
            } else if (/^\s*$/.test(chars)) {
              this.doc.appendChild(charNode);
            }
            this.locator && position(this.locator, charNode);
          }
        },
        skippedEntity: function(name) {
        },
        endDocument: function() {
          this.doc.normalize();
        },
        setDocumentLocator: function(locator) {
          if (this.locator = locator) {
            locator.lineNumber = 0;
          }
        },
        //LexicalHandler
        comment: function(chars, start, length) {
          chars = _toString.apply(this, arguments);
          var comm = this.doc.createComment(chars);
          this.locator && position(this.locator, comm);
          appendElement(this, comm);
        },
        startCDATA: function() {
          this.cdata = true;
        },
        endCDATA: function() {
          this.cdata = false;
        },
        startDTD: function(name, publicId, systemId) {
          var impl = this.doc.implementation;
          if (impl && impl.createDocumentType) {
            var dt = impl.createDocumentType(name, publicId, systemId);
            this.locator && position(this.locator, dt);
            appendElement(this, dt);
            this.doc.doctype = dt;
          }
        },
        /**
         * @see org.xml.sax.ErrorHandler
         * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
         */
        warning: function(error) {
          console.warn("[xmldom warning]	" + error, _locator(this.locator));
        },
        error: function(error) {
          console.error("[xmldom error]	" + error, _locator(this.locator));
        },
        fatalError: function(error) {
          throw new ParseError(error, this.locator);
        }
      };
      function _locator(l) {
        if (l) {
          return "\n@" + (l.systemId || "") + "#[line:" + l.lineNumber + ",col:" + l.columnNumber + "]";
        }
      }
      function _toString(chars, start, length) {
        if (typeof chars == "string") {
          return chars.substr(start, length);
        } else {
          if (chars.length >= start + length || start) {
            return new java.lang.String(chars, start, length) + "";
          }
          return chars;
        }
      }
      "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function(key) {
        DOMHandler.prototype[key] = function() {
          return null;
        };
      });
      function appendElement(hander, node) {
        if (!hander.currentElement) {
          hander.doc.appendChild(node);
        } else {
          hander.currentElement.appendChild(node);
        }
      }
      exports.__DOMHandler = DOMHandler;
      exports.DOMParser = DOMParser3;
      exports.DOMImplementation = dom.DOMImplementation;
      exports.XMLSerializer = dom.XMLSerializer;
    }
  });

  // node_modules/.pnpm/@xmldom+xmldom@0.7.13/node_modules/@xmldom/xmldom/lib/index.js
  var require_lib2 = __commonJS({
    "node_modules/.pnpm/@xmldom+xmldom@0.7.13/node_modules/@xmldom/xmldom/lib/index.js"(exports) {
      var dom = require_dom2();
      exports.DOMImplementation = dom.DOMImplementation;
      exports.XMLSerializer = dom.XMLSerializer;
      exports.DOMParser = require_dom_parser2().DOMParser;
    }
  });

  // node_modules/.pnpm/epubjs@0.3.93/node_modules/epubjs/lib/utils/core.js
  var require_core = __commonJS({
    "node_modules/.pnpm/epubjs@0.3.93/node_modules/epubjs/lib/utils/core.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.RangeObject = void 0;
      exports.blob2base64 = blob2base64;
      exports.borders = borders;
      exports.bounds = bounds;
      exports.createBase64Url = createBase64Url;
      exports.createBlob = createBlob;
      exports.createBlobUrl = createBlobUrl;
      exports.defaults = defaults;
      exports.defer = defer;
      exports.documentHeight = documentHeight;
      exports.extend = extend;
      exports.filterChildren = filterChildren;
      exports.findChildren = findChildren;
      exports.getParentByTagName = getParentByTagName;
      exports.indexOfElementNode = indexOfElementNode;
      exports.indexOfNode = indexOfNode;
      exports.indexOfSorted = indexOfSorted;
      exports.indexOfTextNode = indexOfTextNode;
      exports.insert = insert;
      exports.isElement = isElement;
      exports.isFloat = isFloat;
      exports.isNumber = isNumber;
      exports.isXml = isXml;
      exports.locationOf = locationOf;
      exports.nodeBounds = nodeBounds;
      exports.parents = parents;
      exports.parse = parse;
      exports.prefixed = prefixed;
      exports.qs = qs;
      exports.qsa = qsa;
      exports.qsp = qsp;
      exports.querySelectorByType = querySelectorByType;
      exports.requestAnimationFrame = void 0;
      exports.revokeBlobUrl = revokeBlobUrl;
      exports.sprint = sprint;
      exports.treeWalker = treeWalker;
      exports.type = type;
      exports.uuid = uuid;
      exports.walk = walk;
      exports.windowBounds = windowBounds;
      var _xmldom = require_lib2();
      var requestAnimationFrame = typeof window != "undefined" ? window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame : false;
      exports.requestAnimationFrame = requestAnimationFrame;
      var ELEMENT_NODE = 1;
      var TEXT_NODE = 3;
      var _URL = typeof URL != "undefined" ? URL : typeof window != "undefined" ? window.URL || window.webkitURL || window.mozURL : void 0;
      function uuid() {
        var d = (/* @__PURE__ */ new Date()).getTime();
        var uuid2 = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == "x" ? r : r & 7 | 8).toString(16);
        });
        return uuid2;
      }
      function documentHeight() {
        return Math.max(document.documentElement.clientHeight, document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight);
      }
      function isElement(obj) {
        return !!(obj && obj.nodeType == 1);
      }
      function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }
      function isFloat(n) {
        let f = parseFloat(n);
        if (isNumber(n) === false) {
          return false;
        }
        if (typeof n === "string" && n.indexOf(".") > -1) {
          return true;
        }
        return Math.floor(f) !== f;
      }
      function prefixed(unprefixed) {
        var vendors = ["Webkit", "webkit", "Moz", "O", "ms"];
        var prefixes = ["-webkit-", "-webkit-", "-moz-", "-o-", "-ms-"];
        var lower = unprefixed.toLowerCase();
        var length = vendors.length;
        if (typeof document === "undefined" || typeof document.body.style[lower] != "undefined") {
          return unprefixed;
        }
        for (var i = 0; i < length; i++) {
          if (typeof document.body.style[prefixes[i] + lower] != "undefined") {
            return prefixes[i] + lower;
          }
        }
        return unprefixed;
      }
      function defaults(obj) {
        for (var i = 1, length = arguments.length; i < length; i++) {
          var source = arguments[i];
          for (var prop in source) {
            if (obj[prop] === void 0) obj[prop] = source[prop];
          }
        }
        return obj;
      }
      function extend(target) {
        var sources = [].slice.call(arguments, 1);
        sources.forEach(function(source) {
          if (!source) return;
          Object.getOwnPropertyNames(source).forEach(function(propName) {
            Object.defineProperty(target, propName, Object.getOwnPropertyDescriptor(source, propName));
          });
        });
        return target;
      }
      function insert(item, array, compareFunction) {
        var location = locationOf(item, array, compareFunction);
        array.splice(location, 0, item);
        return location;
      }
      function locationOf(item, array, compareFunction, _start, _end) {
        var start = _start || 0;
        var end = _end || array.length;
        var pivot = parseInt(start + (end - start) / 2);
        var compared;
        if (!compareFunction) {
          compareFunction = function(a, b) {
            if (a > b) return 1;
            if (a < b) return -1;
            if (a == b) return 0;
          };
        }
        if (end - start <= 0) {
          return pivot;
        }
        compared = compareFunction(array[pivot], item);
        if (end - start === 1) {
          return compared >= 0 ? pivot : pivot + 1;
        }
        if (compared === 0) {
          return pivot;
        }
        if (compared === -1) {
          return locationOf(item, array, compareFunction, pivot, end);
        } else {
          return locationOf(item, array, compareFunction, start, pivot);
        }
      }
      function indexOfSorted(item, array, compareFunction, _start, _end) {
        var start = _start || 0;
        var end = _end || array.length;
        var pivot = parseInt(start + (end - start) / 2);
        var compared;
        if (!compareFunction) {
          compareFunction = function(a, b) {
            if (a > b) return 1;
            if (a < b) return -1;
            if (a == b) return 0;
          };
        }
        if (end - start <= 0) {
          return -1;
        }
        compared = compareFunction(array[pivot], item);
        if (end - start === 1) {
          return compared === 0 ? pivot : -1;
        }
        if (compared === 0) {
          return pivot;
        }
        if (compared === -1) {
          return indexOfSorted(item, array, compareFunction, pivot, end);
        } else {
          return indexOfSorted(item, array, compareFunction, start, pivot);
        }
      }
      function bounds(el) {
        var style = window.getComputedStyle(el);
        var widthProps = ["width", "paddingRight", "paddingLeft", "marginRight", "marginLeft", "borderRightWidth", "borderLeftWidth"];
        var heightProps = ["height", "paddingTop", "paddingBottom", "marginTop", "marginBottom", "borderTopWidth", "borderBottomWidth"];
        var width = 0;
        var height = 0;
        widthProps.forEach(function(prop) {
          width += parseFloat(style[prop]) || 0;
        });
        heightProps.forEach(function(prop) {
          height += parseFloat(style[prop]) || 0;
        });
        return {
          height,
          width
        };
      }
      function borders(el) {
        var style = window.getComputedStyle(el);
        var widthProps = ["paddingRight", "paddingLeft", "marginRight", "marginLeft", "borderRightWidth", "borderLeftWidth"];
        var heightProps = ["paddingTop", "paddingBottom", "marginTop", "marginBottom", "borderTopWidth", "borderBottomWidth"];
        var width = 0;
        var height = 0;
        widthProps.forEach(function(prop) {
          width += parseFloat(style[prop]) || 0;
        });
        heightProps.forEach(function(prop) {
          height += parseFloat(style[prop]) || 0;
        });
        return {
          height,
          width
        };
      }
      function nodeBounds(node) {
        let elPos;
        let doc = node.ownerDocument;
        if (node.nodeType == Node.TEXT_NODE) {
          let elRange = doc.createRange();
          elRange.selectNodeContents(node);
          elPos = elRange.getBoundingClientRect();
        } else {
          elPos = node.getBoundingClientRect();
        }
        return elPos;
      }
      function windowBounds() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        return {
          top: 0,
          left: 0,
          right: width,
          bottom: height,
          width,
          height
        };
      }
      function indexOfNode(node, typeId) {
        var parent2 = node.parentNode;
        var children = parent2.childNodes;
        var sib;
        var index = -1;
        for (var i = 0; i < children.length; i++) {
          sib = children[i];
          if (sib.nodeType === typeId) {
            index++;
          }
          if (sib == node) break;
        }
        return index;
      }
      function indexOfTextNode(textNode) {
        return indexOfNode(textNode, TEXT_NODE);
      }
      function indexOfElementNode(elementNode) {
        return indexOfNode(elementNode, ELEMENT_NODE);
      }
      function isXml(ext) {
        return ["xml", "opf", "ncx"].indexOf(ext) > -1;
      }
      function createBlob(content, mime) {
        return new Blob([content], {
          type: mime
        });
      }
      function createBlobUrl(content, mime) {
        var tempUrl;
        var blob = createBlob(content, mime);
        tempUrl = _URL.createObjectURL(blob);
        return tempUrl;
      }
      function revokeBlobUrl(url) {
        return _URL.revokeObjectURL(url);
      }
      function createBase64Url(content, mime) {
        var data;
        var datauri;
        if (typeof content !== "string") {
          return;
        }
        data = btoa(content);
        datauri = "data:" + mime + ";base64," + data;
        return datauri;
      }
      function type(obj) {
        return Object.prototype.toString.call(obj).slice(8, -1);
      }
      function parse(markup, mime, forceXMLDom) {
        var doc;
        var Parser;
        if (typeof DOMParser === "undefined" || forceXMLDom) {
          Parser = _xmldom.DOMParser;
        } else {
          Parser = DOMParser;
        }
        if (markup.charCodeAt(0) === 65279) {
          markup = markup.slice(1);
        }
        doc = new Parser().parseFromString(markup, mime);
        return doc;
      }
      function qs(el, sel) {
        var elements;
        if (!el) {
          throw new Error("No Element Provided");
        }
        if (typeof el.querySelector != "undefined") {
          return el.querySelector(sel);
        } else {
          elements = el.getElementsByTagName(sel);
          if (elements.length) {
            return elements[0];
          }
        }
      }
      function qsa(el, sel) {
        if (typeof el.querySelector != "undefined") {
          return el.querySelectorAll(sel);
        } else {
          return el.getElementsByTagName(sel);
        }
      }
      function qsp(el, sel, props) {
        var q, filtered;
        if (typeof el.querySelector != "undefined") {
          sel += "[";
          for (var prop in props) {
            sel += prop + "~='" + props[prop] + "'";
          }
          sel += "]";
          return el.querySelector(sel);
        } else {
          q = el.getElementsByTagName(sel);
          filtered = Array.prototype.slice.call(q, 0).filter(function(el2) {
            for (var prop2 in props) {
              if (el2.getAttribute(prop2) === props[prop2]) {
                return true;
              }
            }
            return false;
          });
          if (filtered) {
            return filtered[0];
          }
        }
      }
      function sprint(root, func) {
        var doc = root.ownerDocument || root;
        if (typeof doc.createTreeWalker !== "undefined") {
          treeWalker(root, func, NodeFilter.SHOW_TEXT);
        } else {
          walk(root, function(node) {
            if (node && node.nodeType === 3) {
              func(node);
            }
          }, true);
        }
      }
      function treeWalker(root, func, filter) {
        var treeWalker2 = document.createTreeWalker(root, filter, null, false);
        let node;
        while (node = treeWalker2.nextNode()) {
          func(node);
        }
      }
      function walk(node, callback) {
        if (callback(node)) {
          return true;
        }
        node = node.firstChild;
        if (node) {
          do {
            let walked = walk(node, callback);
            if (walked) {
              return true;
            }
            node = node.nextSibling;
          } while (node);
        }
      }
      function blob2base64(blob) {
        return new Promise(function(resolve, reject) {
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function() {
            resolve(reader.result);
          };
        });
      }
      function defer() {
        this.resolve = null;
        this.reject = null;
        this.id = uuid();
        this.promise = new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;
        });
        Object.freeze(this);
      }
      function querySelectorByType(html, element, type2) {
        var query;
        if (typeof html.querySelector != "undefined") {
          query = html.querySelector(`${element}[*|type="${type2}"]`);
        }
        if (!query || query.length === 0) {
          query = qsa(html, element);
          for (var i = 0; i < query.length; i++) {
            if (query[i].getAttributeNS("http://www.idpf.org/2007/ops", "type") === type2 || query[i].getAttribute("epub:type") === type2) {
              return query[i];
            }
          }
        } else {
          return query;
        }
      }
      function findChildren(el) {
        var result = [];
        var childNodes = el.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
          let node = childNodes[i];
          if (node.nodeType === 1) {
            result.push(node);
          }
        }
        return result;
      }
      function parents(node) {
        var nodes = [node];
        for (; node; node = node.parentNode) {
          nodes.unshift(node);
        }
        return nodes;
      }
      function filterChildren(el, nodeName, single) {
        var result = [];
        var childNodes = el.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
          let node = childNodes[i];
          if (node.nodeType === 1 && node.nodeName.toLowerCase() === nodeName) {
            if (single) {
              return node;
            } else {
              result.push(node);
            }
          }
        }
        if (!single) {
          return result;
        }
      }
      function getParentByTagName(node, tagname) {
        let parent2;
        if (node === null || tagname === "") return;
        parent2 = node.parentNode;
        while (parent2.nodeType === 1) {
          if (parent2.tagName.toLowerCase() === tagname) {
            return parent2;
          }
          parent2 = parent2.parentNode;
        }
      }
      var RangeObject = class {
        constructor() {
          this.collapsed = false;
          this.commonAncestorContainer = void 0;
          this.endContainer = void 0;
          this.endOffset = void 0;
          this.startContainer = void 0;
          this.startOffset = void 0;
        }
        setStart(startNode, startOffset) {
          this.startContainer = startNode;
          this.startOffset = startOffset;
          if (!this.endContainer) {
            this.collapse(true);
          } else {
            this.commonAncestorContainer = this._commonAncestorContainer();
          }
          this._checkCollapsed();
        }
        setEnd(endNode, endOffset) {
          this.endContainer = endNode;
          this.endOffset = endOffset;
          if (!this.startContainer) {
            this.collapse(false);
          } else {
            this.collapsed = false;
            this.commonAncestorContainer = this._commonAncestorContainer();
          }
          this._checkCollapsed();
        }
        collapse(toStart) {
          this.collapsed = true;
          if (toStart) {
            this.endContainer = this.startContainer;
            this.endOffset = this.startOffset;
            this.commonAncestorContainer = this.startContainer.parentNode;
          } else {
            this.startContainer = this.endContainer;
            this.startOffset = this.endOffset;
            this.commonAncestorContainer = this.endOffset.parentNode;
          }
        }
        selectNode(referenceNode) {
          let parent2 = referenceNode.parentNode;
          let index = Array.prototype.indexOf.call(parent2.childNodes, referenceNode);
          this.setStart(parent2, index);
          this.setEnd(parent2, index + 1);
        }
        selectNodeContents(referenceNode) {
          let end = referenceNode.childNodes[referenceNode.childNodes - 1];
          let endIndex = referenceNode.nodeType === 3 ? referenceNode.textContent.length : parent.childNodes.length;
          this.setStart(referenceNode, 0);
          this.setEnd(referenceNode, endIndex);
        }
        _commonAncestorContainer(startContainer, endContainer) {
          var startParents = parents(startContainer || this.startContainer);
          var endParents = parents(endContainer || this.endContainer);
          if (startParents[0] != endParents[0]) return void 0;
          for (var i = 0; i < startParents.length; i++) {
            if (startParents[i] != endParents[i]) {
              return startParents[i - 1];
            }
          }
        }
        _checkCollapsed() {
          if (this.startContainer === this.endContainer && this.startOffset === this.endOffset) {
            this.collapsed = true;
          } else {
            this.collapsed = false;
          }
        }
        toString() {
        }
      };
      exports.RangeObject = RangeObject;
    }
  });

  // node_modules/.pnpm/epubjs@0.3.93/node_modules/epubjs/lib/container.js
  var require_container = __commonJS({
    "node_modules/.pnpm/epubjs@0.3.93/node_modules/epubjs/lib/container.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _pathWebpack = _interopRequireDefault(require_path());
      var _core = require_core();
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var Container2 = class {
        constructor(containerDocument) {
          this.packagePath = "";
          this.directory = "";
          this.encoding = "";
          if (containerDocument) {
            this.parse(containerDocument);
          }
        }
        /**
         * Parse the Container XML
         * @param  {document} containerDocument
         */
        parse(containerDocument) {
          var rootfile;
          if (!containerDocument) {
            throw new Error("Container File Not Found");
          }
          rootfile = (0, _core.qs)(containerDocument, "rootfile");
          if (!rootfile) {
            throw new Error("No RootFile Found");
          }
          this.packagePath = rootfile.getAttribute("full-path");
          this.directory = _pathWebpack.default.dirname(this.packagePath);
          this.encoding = containerDocument.xmlEncoding;
        }
        destroy() {
          this.packagePath = void 0;
          this.directory = void 0;
          this.encoding = void 0;
        }
      };
      var _default = Container2;
      exports.default = _default;
    }
  });

  // node_modules/.pnpm/epubjs@0.3.93/node_modules/epubjs/lib/packaging.js
  var require_packaging = __commonJS({
    "node_modules/.pnpm/epubjs@0.3.93/node_modules/epubjs/lib/packaging.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _core = require_core();
      var Packaging2 = class {
        constructor(packageDocument) {
          this.manifest = {};
          this.navPath = "";
          this.ncxPath = "";
          this.coverPath = "";
          this.spineNodeIndex = 0;
          this.spine = [];
          this.metadata = {};
          if (packageDocument) {
            this.parse(packageDocument);
          }
        }
        /**
         * Parse OPF XML
         * @param  {document} packageDocument OPF XML
         * @return {object} parsed package parts
         */
        parse(packageDocument) {
          var metadataNode, manifestNode, spineNode;
          if (!packageDocument) {
            throw new Error("Package File Not Found");
          }
          metadataNode = (0, _core.qs)(packageDocument, "metadata");
          if (!metadataNode) {
            throw new Error("No Metadata Found");
          }
          manifestNode = (0, _core.qs)(packageDocument, "manifest");
          if (!manifestNode) {
            throw new Error("No Manifest Found");
          }
          spineNode = (0, _core.qs)(packageDocument, "spine");
          if (!spineNode) {
            throw new Error("No Spine Found");
          }
          this.manifest = this.parseManifest(manifestNode);
          this.navPath = this.findNavPath(manifestNode);
          this.ncxPath = this.findNcxPath(manifestNode, spineNode);
          this.coverPath = this.findCoverPath(packageDocument);
          this.spineNodeIndex = (0, _core.indexOfElementNode)(spineNode);
          this.spine = this.parseSpine(spineNode, this.manifest);
          this.uniqueIdentifier = this.findUniqueIdentifier(packageDocument);
          this.metadata = this.parseMetadata(metadataNode);
          this.metadata.direction = spineNode.getAttribute("page-progression-direction");
          return {
            "metadata": this.metadata,
            "spine": this.spine,
            "manifest": this.manifest,
            "navPath": this.navPath,
            "ncxPath": this.ncxPath,
            "coverPath": this.coverPath,
            "spineNodeIndex": this.spineNodeIndex
          };
        }
        /**
         * Parse Metadata
         * @private
         * @param  {node} xml
         * @return {object} metadata
         */
        parseMetadata(xml) {
          var metadata = {};
          metadata.title = this.getElementText(xml, "title");
          metadata.creator = this.getElementText(xml, "creator");
          metadata.description = this.getElementText(xml, "description");
          metadata.pubdate = this.getElementText(xml, "date");
          metadata.publisher = this.getElementText(xml, "publisher");
          metadata.identifier = this.getElementText(xml, "identifier");
          metadata.language = this.getElementText(xml, "language");
          metadata.rights = this.getElementText(xml, "rights");
          metadata.modified_date = this.getPropertyText(xml, "dcterms:modified");
          metadata.layout = this.getPropertyText(xml, "rendition:layout");
          metadata.orientation = this.getPropertyText(xml, "rendition:orientation");
          metadata.flow = this.getPropertyText(xml, "rendition:flow");
          metadata.viewport = this.getPropertyText(xml, "rendition:viewport");
          metadata.media_active_class = this.getPropertyText(xml, "media:active-class");
          metadata.spread = this.getPropertyText(xml, "rendition:spread");
          return metadata;
        }
        /**
         * Parse Manifest
         * @private
         * @param  {node} manifestXml
         * @return {object} manifest
         */
        parseManifest(manifestXml) {
          var manifest = {};
          var selected = (0, _core.qsa)(manifestXml, "item");
          var items = Array.prototype.slice.call(selected);
          items.forEach(function(item) {
            var id = item.getAttribute("id"), href = item.getAttribute("href") || "", type = item.getAttribute("media-type") || "", overlay = item.getAttribute("media-overlay") || "", properties = item.getAttribute("properties") || "";
            manifest[id] = {
              "href": href,
              // "url" : href,
              "type": type,
              "overlay": overlay,
              "properties": properties.length ? properties.split(" ") : []
            };
          });
          return manifest;
        }
        /**
         * Parse Spine
         * @private
         * @param  {node} spineXml
         * @param  {Packaging.manifest} manifest
         * @return {object} spine
         */
        parseSpine(spineXml, manifest) {
          var spine = [];
          var selected = (0, _core.qsa)(spineXml, "itemref");
          var items = Array.prototype.slice.call(selected);
          items.forEach(function(item, index) {
            var idref = item.getAttribute("idref");
            var props = item.getAttribute("properties") || "";
            var propArray = props.length ? props.split(" ") : [];
            var itemref = {
              "id": item.getAttribute("id"),
              "idref": idref,
              "linear": item.getAttribute("linear") || "yes",
              "properties": propArray,
              // "href" : manifest[Id].href,
              // "url" :  manifest[Id].url,
              "index": index
              // "cfiBase" : cfiBase
            };
            spine.push(itemref);
          });
          return spine;
        }
        /**
         * Find Unique Identifier
         * @private
         * @param  {node} packageXml
         * @return {string} Unique Identifier text
         */
        findUniqueIdentifier(packageXml) {
          var uniqueIdentifierId = packageXml.documentElement.getAttribute("unique-identifier");
          if (!uniqueIdentifierId) {
            return "";
          }
          var identifier = packageXml.getElementById(uniqueIdentifierId);
          if (!identifier) {
            return "";
          }
          if (identifier.localName === "identifier" && identifier.namespaceURI === "http://purl.org/dc/elements/1.1/") {
            return identifier.childNodes.length > 0 ? identifier.childNodes[0].nodeValue.trim() : "";
          }
          return "";
        }
        /**
         * Find TOC NAV
         * @private
         * @param {element} manifestNode
         * @return {string}
         */
        findNavPath(manifestNode) {
          var node = (0, _core.qsp)(manifestNode, "item", {
            "properties": "nav"
          });
          return node ? node.getAttribute("href") : false;
        }
        /**
         * Find TOC NCX
         * media-type="application/x-dtbncx+xml" href="toc.ncx"
         * @private
         * @param {element} manifestNode
         * @param {element} spineNode
         * @return {string}
         */
        findNcxPath(manifestNode, spineNode) {
          var node = (0, _core.qsp)(manifestNode, "item", {
            "media-type": "application/x-dtbncx+xml"
          });
          var tocId;
          if (!node) {
            tocId = spineNode.getAttribute("toc");
            if (tocId) {
              node = manifestNode.querySelector(`#${tocId}`);
            }
          }
          return node ? node.getAttribute("href") : false;
        }
        /**
         * Find the Cover Path
         * <item properties="cover-image" id="ci" href="cover.svg" media-type="image/svg+xml" />
         * Fallback for Epub 2.0
         * @private
         * @param  {node} packageXml
         * @return {string} href
         */
        findCoverPath(packageXml) {
          var pkg = (0, _core.qs)(packageXml, "package");
          var epubVersion = pkg.getAttribute("version");
          var node = (0, _core.qsp)(packageXml, "item", {
            "properties": "cover-image"
          });
          if (node) return node.getAttribute("href");
          var metaCover = (0, _core.qsp)(packageXml, "meta", {
            "name": "cover"
          });
          if (metaCover) {
            var coverId = metaCover.getAttribute("content");
            var cover = packageXml.getElementById(coverId);
            return cover ? cover.getAttribute("href") : "";
          } else {
            return false;
          }
        }
        /**
         * Get text of a namespaced element
         * @private
         * @param  {node} xml
         * @param  {string} tag
         * @return {string} text
         */
        getElementText(xml, tag) {
          var found = xml.getElementsByTagNameNS("http://purl.org/dc/elements/1.1/", tag);
          var el;
          if (!found || found.length === 0) return "";
          el = found[0];
          if (el.childNodes.length) {
            return el.childNodes[0].nodeValue;
          }
          return "";
        }
        /**
         * Get text by property
         * @private
         * @param  {node} xml
         * @param  {string} property
         * @return {string} text
         */
        getPropertyText(xml, property) {
          var el = (0, _core.qsp)(xml, "meta", {
            "property": property
          });
          if (el && el.childNodes.length) {
            return el.childNodes[0].nodeValue;
          }
          return "";
        }
        /**
         * Load JSON Manifest
         * @param  {document} packageDocument OPF XML
         * @return {object} parsed package parts
         */
        load(json) {
          this.metadata = json.metadata;
          let spine = json.readingOrder || json.spine;
          this.spine = spine.map((item, index) => {
            item.index = index;
            item.linear = item.linear || "yes";
            return item;
          });
          json.resources.forEach((item, index) => {
            this.manifest[index] = item;
            if (item.rel && item.rel[0] === "cover") {
              this.coverPath = item.href;
            }
          });
          this.spineNodeIndex = 0;
          this.toc = json.toc.map((item, index) => {
            item.label = item.title;
            return item;
          });
          return {
            "metadata": this.metadata,
            "spine": this.spine,
            "manifest": this.manifest,
            "navPath": this.navPath,
            "ncxPath": this.ncxPath,
            "coverPath": this.coverPath,
            "spineNodeIndex": this.spineNodeIndex,
            "toc": this.toc
          };
        }
        destroy() {
          this.manifest = void 0;
          this.navPath = void 0;
          this.ncxPath = void 0;
          this.coverPath = void 0;
          this.spineNodeIndex = void 0;
          this.spine = void 0;
          this.metadata = void 0;
        }
      };
      var _default = Packaging2;
      exports.default = _default;
    }
  });

  // node_modules/.pnpm/epubjs@0.3.93/node_modules/epubjs/lib/navigation.js
  var require_navigation = __commonJS({
    "node_modules/.pnpm/epubjs@0.3.93/node_modules/epubjs/lib/navigation.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;
      var _core = require_core();
      var Navigation2 = class {
        constructor(xml) {
          this.toc = [];
          this.tocByHref = {};
          this.tocById = {};
          this.landmarks = [];
          this.landmarksByType = {};
          this.length = 0;
          if (xml) {
            this.parse(xml);
          }
        }
        /**
         * Parse out the navigation items
         * @param {document} xml navigation html / xhtml / ncx
         */
        parse(xml) {
          let isXml = xml.nodeType;
          let html;
          let ncx;
          if (isXml) {
            html = (0, _core.qs)(xml, "html");
            ncx = (0, _core.qs)(xml, "ncx");
          }
          if (!isXml) {
            this.toc = this.load(xml);
          } else if (html) {
            this.toc = this.parseNav(xml);
            this.landmarks = this.parseLandmarks(xml);
          } else if (ncx) {
            this.toc = this.parseNcx(xml);
          }
          this.length = 0;
          this.unpack(this.toc);
        }
        /**
         * Unpack navigation items
         * @private
         * @param  {array} toc
         */
        unpack(toc) {
          var item;
          for (var i = 0; i < toc.length; i++) {
            item = toc[i];
            if (item.href) {
              this.tocByHref[item.href] = i;
            }
            if (item.id) {
              this.tocById[item.id] = i;
            }
            this.length++;
            if (item.subitems.length) {
              this.unpack(item.subitems);
            }
          }
        }
        /**
         * Get an item from the navigation
         * @param  {string} target
         * @return {object} navItem
         */
        get(target) {
          var index;
          if (!target) {
            return this.toc;
          }
          if (target.indexOf("#") === 0) {
            index = this.tocById[target.substring(1)];
          } else if (target in this.tocByHref) {
            index = this.tocByHref[target];
          }
          return this.getByIndex(target, index, this.toc);
        }
        /**
         * Get an item from navigation subitems recursively by index
         * @param  {string} target
         * @param  {number} index
         * @param  {array} navItems
         * @return {object} navItem
         */
        getByIndex(target, index, navItems) {
          if (navItems.length === 0) {
            return;
          }
          const item = navItems[index];
          if (item && (target === item.id || target === item.href)) {
            return item;
          } else {
            let result;
            for (let i = 0; i < navItems.length; ++i) {
              result = this.getByIndex(target, index, navItems[i].subitems);
              if (result) {
                break;
              }
            }
            return result;
          }
        }
        /**
         * Get a landmark by type
         * List of types: https://idpf.github.io/epub-vocabs/structure/
         * @param  {string} type
         * @return {object} landmarkItem
         */
        landmark(type) {
          var index;
          if (!type) {
            return this.landmarks;
          }
          index = this.landmarksByType[type];
          return this.landmarks[index];
        }
        /**
         * Parse toc from a Epub > 3.0 Nav
         * @private
         * @param  {document} navHtml
         * @return {array} navigation list
         */
        parseNav(navHtml) {
          var navElement = (0, _core.querySelectorByType)(navHtml, "nav", "toc");
          var list = [];
          if (!navElement) return list;
          let navList = (0, _core.filterChildren)(navElement, "ol", true);
          if (!navList) return list;
          list = this.parseNavList(navList);
          return list;
        }
        /**
         * Parses lists in the toc
         * @param  {document} navListHtml
         * @param  {string} parent id
         * @return {array} navigation list
         */
        parseNavList(navListHtml, parent2) {
          const result = [];
          if (!navListHtml) return result;
          if (!navListHtml.children) return result;
          for (let i = 0; i < navListHtml.children.length; i++) {
            const item = this.navItem(navListHtml.children[i], parent2);
            if (item) {
              result.push(item);
            }
          }
          return result;
        }
        /**
         * Create a navItem
         * @private
         * @param  {element} item
         * @return {object} navItem
         */
        navItem(item, parent2) {
          let id = item.getAttribute("id") || void 0;
          let content = (0, _core.filterChildren)(item, "a", true) || (0, _core.filterChildren)(item, "span", true);
          if (!content) {
            return;
          }
          let src = content.getAttribute("href") || "";
          if (!id) {
            id = src;
          }
          let text = content.textContent || "";
          let subitems = [];
          let nested = (0, _core.filterChildren)(item, "ol", true);
          if (nested) {
            subitems = this.parseNavList(nested, id);
          }
          return {
            "id": id,
            "href": src,
            "label": text,
            "subitems": subitems,
            "parent": parent2
          };
        }
        /**
         * Parse landmarks from a Epub > 3.0 Nav
         * @private
         * @param  {document} navHtml
         * @return {array} landmarks list
         */
        parseLandmarks(navHtml) {
          var navElement = (0, _core.querySelectorByType)(navHtml, "nav", "landmarks");
          var navItems = navElement ? (0, _core.qsa)(navElement, "li") : [];
          var length = navItems.length;
          var i;
          var list = [];
          var item;
          if (!navItems || length === 0) return list;
          for (i = 0; i < length; ++i) {
            item = this.landmarkItem(navItems[i]);
            if (item) {
              list.push(item);
              this.landmarksByType[item.type] = i;
            }
          }
          return list;
        }
        /**
         * Create a landmarkItem
         * @private
         * @param  {element} item
         * @return {object} landmarkItem
         */
        landmarkItem(item) {
          let content = (0, _core.filterChildren)(item, "a", true);
          if (!content) {
            return;
          }
          let type = content.getAttributeNS("http://www.idpf.org/2007/ops", "type") || void 0;
          let href = content.getAttribute("href") || "";
          let text = content.textContent || "";
          return {
            "href": href,
            "label": text,
            "type": type
          };
        }
        /**
         * Parse from a Epub > 3.0 NC
         * @private
         * @param  {document} navHtml
         * @return {array} navigation list
         */
        parseNcx(tocXml) {
          var navPoints = (0, _core.qsa)(tocXml, "navPoint");
          var length = navPoints.length;
          var i;
          var toc = {};
          var list = [];
          var item, parent2;
          if (!navPoints || length === 0) return list;
          for (i = 0; i < length; ++i) {
            item = this.ncxItem(navPoints[i]);
            toc[item.id] = item;
            if (!item.parent) {
              list.push(item);
            } else {
              parent2 = toc[item.parent];
              parent2.subitems.push(item);
            }
          }
          return list;
        }
        /**
         * Create a ncxItem
         * @private
         * @param  {element} item
         * @return {object} ncxItem
         */
        ncxItem(item) {
          var id = item.getAttribute("id") || false, content = (0, _core.qs)(item, "content"), src = content.getAttribute("src"), navLabel = (0, _core.qs)(item, "navLabel"), text = navLabel.textContent ? navLabel.textContent : "", subitems = [], parentNode = item.parentNode, parent2;
          if (parentNode && (parentNode.nodeName === "navPoint" || parentNode.nodeName.split(":").slice(-1)[0] === "navPoint")) {
            parent2 = parentNode.getAttribute("id");
          }
          return {
            "id": id,
            "href": src,
            "label": text,
            "subitems": subitems,
            "parent": parent2
          };
        }
        /**
         * Load Spine Items
         * @param  {object} json the items to be loaded
         * @return {Array} navItems
         */
        load(json) {
          return json.map((item) => {
            item.label = item.title;
            item.subitems = item.children ? this.load(item.children) : [];
            return item;
          });
        }
        /**
         * forEach pass through
         * @param  {Function} fn function to run on each item
         * @return {method} forEach loop
         */
        forEach(fn) {
          return this.toc.forEach(fn);
        }
      };
      var _default = Navigation2;
      exports.default = _default;
    }
  });

  // src/persistence.js
  var DATABASE_NAME = "dsh-touch-fish-novel";
  var DATABASE_VERSION = 1;
  var SETTINGS_KEY = "settings";
  var IndexedDbStorage = class {
    constructor(indexedDb = globalThis.indexedDB, keyRange = globalThis.IDBKeyRange) {
      this.indexedDb = indexedDb;
      this.keyRange = keyRange;
      this.database = void 0;
    }
    close() {
      this.database?.close();
      this.database = void 0;
    }
    async load() {
      const db = await this.#open();
      const tx = db.transaction(["books", "settings"], "readonly");
      const done = transactionDone(tx);
      const books = await requestResult(tx.objectStore("books").getAll());
      const settings = await requestResult(tx.objectStore("settings").get(SETTINGS_KEY));
      await done;
      return { books, settings: settings?.value };
    }
    async saveSettings(value) {
      const db = await this.#open();
      const tx = db.transaction("settings", "readwrite");
      const done = transactionDone(tx);
      tx.objectStore("settings").put({ key: SETTINGS_KEY, value });
      await done;
    }
    async addBook(book, segments) {
      const db = await this.#open();
      const tx = db.transaction(["books", "segments"], "readwrite");
      const done = transactionDone(tx);
      tx.objectStore("books").put(book);
      const segmentStore = tx.objectStore("segments");
      segments.forEach((segment, index) => segmentStore.put({
        id: `${book.id}:${index}`,
        bookId: book.id,
        index,
        ...segment
      }));
      await done;
    }
    async updateBook(book) {
      const db = await this.#open();
      const tx = db.transaction("books", "readwrite");
      const done = transactionDone(tx);
      const books = tx.objectStore("books");
      const existing = await requestResult(books.get(book.id));
      if (!existing) {
        await done;
        throw new Error("\u627E\u4E0D\u5230\u8FD9\u672C\u4E66\uFF0C\u65E0\u6CD5\u4FDD\u5B58\u9605\u8BFB\u8FDB\u5EA6");
      }
      books.put(book);
      await done;
    }
    async getSegment(bookId, index) {
      const db = await this.#open();
      const tx = db.transaction("segments", "readonly");
      const done = transactionDone(tx);
      const result = await requestResult(tx.objectStore("segments").get(`${bookId}:${index}`));
      await done;
      if (!result) return null;
      const { id: _id, bookId: _bookId, index: _index, ...segment } = result;
      return segment;
    }
    async deleteBook(bookId) {
      const db = await this.#open();
      const tx = db.transaction(["books", "segments"], "readwrite");
      const done = transactionDone(tx);
      tx.objectStore("books").delete(bookId);
      const cursorRequest = tx.objectStore("segments").index("bookId").openCursor(this.keyRange.only(bookId));
      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result;
        if (!cursor) return;
        cursor.delete();
        cursor.continue();
      };
      await done;
    }
    async #open() {
      if (this.database) return this.database;
      if (!this.indexedDb) throw new Error("\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301 IndexedDB");
      this.database = await new Promise((resolve, reject) => {
        const request = this.indexedDb.open(DATABASE_NAME, DATABASE_VERSION);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains("books")) db.createObjectStore("books", { keyPath: "id" });
          if (!db.objectStoreNames.contains("segments")) {
            const store = db.createObjectStore("segments", { keyPath: "id" });
            store.createIndex("bookId", "bookId", { unique: false });
          }
          if (!db.objectStoreNames.contains("settings")) db.createObjectStore("settings", { keyPath: "key" });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error("\u65E0\u6CD5\u6253\u5F00\u672C\u5730\u4E66\u5E93"));
        request.onblocked = () => reject(new Error("\u672C\u5730\u4E66\u5E93\u6B63\u5728\u88AB\u5176\u4ED6\u9875\u9762\u5360\u7528\uFF0C\u8BF7\u5173\u95ED\u91CD\u590D\u9875\u9762\u540E\u91CD\u8BD5"));
      });
      this.database.onversionchange = () => {
        this.database?.close();
        this.database = void 0;
      };
      return this.database;
    }
  };
  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error("\u672C\u5730\u4E66\u5E93\u8BFB\u5199\u5931\u8D25"));
    });
  }
  function transactionDone(transaction) {
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("\u672C\u5730\u4E66\u5E93\u4E8B\u52A1\u5931\u8D25"));
      transaction.onabort = () => reject(transaction.error ?? new Error("\u672C\u5730\u4E66\u5E93\u4E8B\u52A1\u5DF2\u53D6\u6D88"));
    });
  }

  // src/epub.js
  var import_jszip = __toESM(require_jszip_min(), 1);
  var import_crc_32 = __toESM(require_crc32(), 1);

  // src/text-decoding.js
  function decodeBookText(input, { xml = false } = {}) {
    const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
    let encoding = "utf-8";
    let marked = false;
    if (bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191) marked = true;
    else if (bytes[0] === 255 && bytes[1] === 254) {
      encoding = "utf-16le";
      marked = true;
    } else if (bytes[0] === 254 && bytes[1] === 255) {
      encoding = "utf-16be";
      marked = true;
    } else if (xml && bytes[0] === 60 && bytes[1] === 0 && bytes[3] === 0) encoding = "utf-16le";
    else if (xml && bytes[0] === 0 && bytes[1] === 60 && bytes[2] === 0) encoding = "utf-16be";
    let text;
    try {
      text = new TextDecoder(encoding, { fatal: true }).decode(bytes);
    } catch {
      throw new Error("\u6587\u672C\u7F16\u7801\u65E0\u6548\uFF1A\u8BF7\u4F7F\u7528 UTF-8 \u6216\u5E26 BOM \u7684 UTF-16 \u6587\u4EF6");
    }
    if (text.includes("\0")) throw new Error("\u4E0D\u652F\u6301\u7684\u6587\u672C\u7F16\u7801\uFF1A\u8BF7\u8F6C\u6362\u4E3A UTF-8 \u6216\u5E26 BOM \u7684 UTF-16");
    if (xml) {
      const declared = /^<\?xml\s[^?]*\bencoding\s*=\s*(['"])([^'"]+)\1/iu.exec(text)?.[2].toLowerCase();
      const allowed = { "utf-8": "utf-8", utf8: "utf-8", "utf-16": "utf-16", "utf-16le": "utf-16le", "utf-16be": "utf-16be" };
      if (declared && !allowed[declared]) throw new Error(`\u4E0D\u652F\u6301\u7684 XML \u7F16\u7801\uFF1A${declared}`);
      if (declared && (allowed[declared] === "utf-16" ? !encoding.startsWith("utf-16") : allowed[declared] !== encoding)) {
        throw new Error(`XML \u7F16\u7801\u58F0\u660E\u4E0E${marked ? " BOM" : "\u5B9E\u9645\u5B57\u8282"}\u4E0D\u7B26\uFF1A${declared}`);
      }
    }
    return text;
  }

  // src/epub.js
  var import_xmldom = __toESM(require_lib(), 1);
  var import_container = __toESM(require_container(), 1);
  var import_packaging = __toESM(require_packaging(), 1);
  var import_navigation = __toESM(require_navigation(), 1);

  // src/segments.js
  var DEFAULT_SEGMENT_LENGTH = 600;
  var TXT_CHAPTER = /^\s*(?:第[0-9０-９零〇一二三四五六七八九十百千万两壹贰叁肆伍陆柒捌玖拾佰仟]{1,24}[章节卷篇回部](?:[\t \u3000]+[^。！？!?，,；;\r\n]{1,80})?|chapter\s+\d+(?:[\t ]+[^.!?\r\n]{1,80})?|(?:序章|楔子|前言|尾声|后记|附录)(?:[\t \u3000]+[^。！？!?，,；;\r\n]{1,80})?)\s*$/iu;
  var MD_HEADING = /^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/u;
  function textToChapters(text, format = "txt") {
    const lines = String(text).replace(/^\uFEFF/u, "").replace(/\r\n?/gu, "\n").split("\n");
    const chapters = [];
    let title = "\u6B63\u6587";
    let body = [];
    let sawHeading = false;
    const flush = () => {
      const content = body.join("\n").trim();
      if (content) chapters.push({ title, text: content });
      body = [];
    };
    for (const line of lines) {
      const heading = format === "md" ? line.match(MD_HEADING) : line.match(TXT_CHAPTER);
      if (!heading) {
        body.push(line);
        continue;
      }
      flush();
      title = format === "md" ? heading[2].trim() : line.trim();
      sawHeading = true;
    }
    flush();
    if (!chapters.length && !sawHeading) {
      const content = lines.join("\n").trim();
      if (content) chapters.push({ title: "\u6B63\u6587", text: content });
    }
    return chapters;
  }
  function segmentChapters(chapters, targetLength = DEFAULT_SEGMENT_LENGTH) {
    const limit = positiveInteger(targetLength);
    const segments = [];
    chapters.forEach((chapter, chapterIndex) => {
      for (const text of splitChapter(chapter.text, limit)) {
        segments.push({ text, chapterTitle: chapter.title, chapterIndex });
      }
    });
    return segments;
  }
  function parseTextBook(text, format = "txt", targetLength = DEFAULT_SEGMENT_LENGTH) {
    const chapters = textToChapters(text, format);
    const segments = segmentChapters(chapters, targetLength);
    if (!segments.length) throw new Error("\u6587\u4EF6\u91CC\u6CA1\u6709\u53EF\u9605\u8BFB\u7684\u6B63\u6587\u6587\u672C");
    return { chapters, segments };
  }
  function splitChapter(text, limit) {
    const paragraphs = String(text).split(/\n\s*\n+/u).map((value) => value.trim()).filter(Boolean);
    const segments = [];
    let current = "";
    const flush = () => {
      if (current) segments.push(current);
      current = "";
    };
    const append = (part) => {
      if (!part) return;
      const next = current ? `${current}

${part}` : part;
      if (lengthOf(next) <= limit) {
        current = next;
        return;
      }
      flush();
      if (lengthOf(part) <= limit) {
        current = part;
        return;
      }
      for (const sentence of splitSentences(part)) {
        if (lengthOf(sentence) > limit) {
          for (const fragment of splitLongText(sentence, limit)) append(fragment);
        } else {
          const joined = current ? `${current} ${sentence}` : sentence;
          if (lengthOf(joined) <= limit) current = joined;
          else {
            flush();
            current = sentence;
          }
        }
      }
    };
    for (const paragraph of paragraphs) append(paragraph);
    flush();
    return segments;
  }
  function splitSentences(text) {
    if (typeof Intl.Segmenter === "function") {
      const segmenter = new Intl.Segmenter(void 0, { granularity: "sentence" });
      const sentences = [...segmenter.segment(text)].map((item) => item.segment.trim()).filter(Boolean);
      if (sentences.length > 1) return sentences;
    }
    return text.match(/[^。！？!?；;]+[。！？!?；;…]*[”’」』】）)]*|[^。！？!?；;]+$/gu)?.map((value) => value.trim()).filter(Boolean) ?? [text];
  }
  function splitLongText(text, limit) {
    const points = [...text];
    const pieces = [];
    for (let start = 0; start < points.length; ) {
      let end = Math.min(start + limit, points.length);
      if (end < points.length) {
        const minimum = start + Math.floor(limit * 0.65);
        for (let index = end; index > minimum; index -= 1) {
          if (/\s/u.test(points[index - 1] ?? "")) {
            end = index;
            break;
          }
        }
      }
      const piece = points.slice(start, end).join("").trim();
      if (piece) pieces.push(piece);
      start = end;
    }
    return pieces;
  }
  function lengthOf(text) {
    return [...text].length;
  }
  function positiveInteger(value) {
    if (!Number.isInteger(value) || value < 1) throw new RangeError("\u5206\u6BB5\u957F\u5EA6\u5FC5\u987B\u662F\u6B63\u6574\u6570");
    return value;
  }

  // src/epub.js
  var Container = import_container.default.default ?? import_container.default;
  var Packaging = import_packaging.default.default ?? import_packaging.default;
  var Navigation = import_navigation.default.default ?? import_navigation.default;
  var ORIGIN = "https://local-epub.invalid/";
  var MAX_UNPACKED_BYTES = 128 * 1024 * 1024;
  async function parseEpub(file, targetLength = 600) {
    try {
      const zip = await import_jszip.default.loadAsync(await file.arrayBuffer());
      const budget = { remaining: MAX_UNPACKED_BYTES };
      const readXml = async (path) => {
        const entry = zip.file(path);
        if (!entry) throw new Error(`\u4E66\u5185\u6587\u4EF6\u7F3A\u5931\uFF1A${path}`);
        const bytes = await readEntry(entry, budget);
        const source = decodeBookText(bytes, { xml: true });
        if (/<!ENTITY|<!DOCTYPE[^>]*\[/iu.test(source)) throw new Error(`\u4E0D\u652F\u6301\u542B\u5916\u90E8\u5B9E\u4F53\u58F0\u660E\u7684\u4E66\u5185\u6587\u4EF6\uFF1A${path}`);
        return new import_xmldom.DOMParser({
          onError(level, message) {
            if (level !== "warning") throw new Error(`${path}: ${message}`);
          }
        }).parseFromString(source, "application/xml");
      };
      const container = new Container(await readXml("META-INF/container.xml"));
      const packagePath = archivePath(container.packagePath);
      const packaging = new Packaging(await readXml(packagePath));
      const navPath = packaging.navPath || packaging.ncxPath;
      const navigation = navPath ? new Navigation(await readXml(archivePath(navPath, packagePath))) : null;
      const labels = tocLabels(navigation?.toc ?? [], packagePath);
      const chapters = [];
      for (const item of packaging.spine) {
        if (item.linear === "no") continue;
        const manifest = packaging.manifest[item.idref];
        if (!manifest) throw new Error(`\u9605\u8BFB\u987A\u5E8F\u5F15\u7528\u4E86\u7F3A\u5931\u7AE0\u8282\uFF1A${item.idref}`);
        if (!["application/xhtml+xml", "text/html"].includes(manifest.type)) {
          throw new Error(`\u4E0D\u652F\u6301\u7684\u7AE0\u8282\u683C\u5F0F\uFF1A${manifest.type}`);
        }
        const path = archivePath(manifest.href, packagePath);
        const document2 = await readXml(path);
        const body = document2.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "body")[0] || document2.getElementsByTagNameNS(null, "body")[0];
        if (!body) throw new Error(`\u7AE0\u8282\u6CA1\u6709\u6B63\u6587\uFF1A${path}`);
        const sectionTitle = labels.get(path) || manifest.href.replace(/\.[^.]+$/u, "");
        let current = { title: sectionTitle, paragraphs: [] };
        const flush = () => {
          const text = current.paragraphs.join("\n\n").trim();
          if (text) chapters.push({ title: current.title, text });
          current = { title: sectionTitle, paragraphs: [] };
        };
        for (const block of extractBlocks(body)) {
          if (block.kind === "heading") {
            flush();
            current = { title: block.text, paragraphs: [] };
          } else current.paragraphs.push(block.text);
        }
        flush();
      }
      const segments = segmentChapters(chapters, targetLength);
      if (!segments.length) throw new Error("EPUB \u6CA1\u6709\u53EF\u8BFB\u53D6\u7684\u7EBF\u6027\u6B63\u6587");
      return { chapters, segments, title: packaging.metadata.title || "" };
    } catch (error) {
      throw new Error(`EPUB \u65E0\u6CD5\u89E3\u6790\uFF1A${error instanceof Error ? error.message : String(error)}`);
    }
  }
  function readEntry(entry, budget) {
    return new Promise((resolve, reject) => {
      const stream = entry.internalStream("uint8array");
      let chunks = [];
      let length = 0;
      let checksum = 0;
      let settled = false;
      const fail = (error) => {
        if (settled) return;
        settled = true;
        stream.pause();
        chunks = [];
        reject(error);
      };
      stream.on("data", (chunk) => {
        if (settled) return;
        if (chunk.byteLength > budget.remaining) {
          fail(new Error("EPUB \u89E3\u538B\u6B63\u6587\u8D85\u8FC7 128 MiB\uFF0C\u8BF7\u4F7F\u7528\u8F83\u5C0F\u4E66\u7C4D"));
          return;
        }
        budget.remaining -= chunk.byteLength;
        length += chunk.byteLength;
        checksum = import_crc_32.default.buf(chunk, checksum);
        chunks.push(chunk);
      }).on("error", fail).on("end", () => {
        if (settled) return;
        if (checksum >>> 0 !== entry._data.crc32 >>> 0) {
          fail(new Error(`\u4E66\u5185\u6587\u4EF6 CRC \u6821\u9A8C\u5931\u8D25\uFF1A${entry.name}`));
          return;
        }
        const bytes = new Uint8Array(length);
        let offset = 0;
        for (const chunk of chunks) {
          bytes.set(chunk, offset);
          offset += chunk.byteLength;
        }
        chunks = [];
        settled = true;
        resolve(bytes);
      }).resume();
    });
  }
  function archivePath(href, base = "") {
    const url = new URL(href, new URL(base, ORIGIN));
    if (url.origin !== new URL(ORIGIN).origin || url.search) throw new Error("EPUB \u53EA\u80FD\u5F15\u7528\u4E66\u5185\u6587\u4EF6");
    return decodeURIComponent(url.pathname.slice(1));
  }
  function hidden(node) {
    const tag = String(node.localName ?? node.nodeName).toLowerCase();
    return ["script", "style", "noscript", "iframe", "object", "svg", "nav"].includes(tag) || node.hasAttribute("hidden") || node.getAttribute("aria-hidden") === "true" || /(?:display\s*:\s*none|visibility\s*:\s*hidden)/iu.test(node.getAttribute("style") || "");
  }
  function extractBlocks(root) {
    const blocks = [];
    const blockTags = /* @__PURE__ */ new Set([
      "div",
      "section",
      "article",
      "aside",
      "main",
      "header",
      "footer",
      "address",
      "p",
      "li",
      "ul",
      "ol",
      "blockquote",
      "pre",
      "figure",
      "figcaption",
      "dl",
      "dt",
      "dd",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "td",
      "th",
      "hr"
    ]);
    let pending = "";
    let kind = "paragraph";
    const flush = () => {
      const text = pending.replace(/\u00a0/gu, " ").trim();
      if (text) blocks.push({ kind, text });
      pending = "";
    };
    const walk = (node) => {
      if (node.nodeType === 3 || node.nodeType === 4) {
        pending += node.nodeValue || "";
        return;
      }
      if (node.nodeType !== 1 || hidden(node)) return;
      const tag = String(node.localName ?? node.nodeName).toLowerCase();
      if (tag === "br") {
        pending += "\n";
        return;
      }
      const heading = /^h[1-6]$/u.test(tag);
      const block = heading || blockTags.has(tag);
      const previousKind = kind;
      if (block) {
        flush();
        kind = heading ? "heading" : "paragraph";
      }
      for (const child of Array.from(node.childNodes ?? [])) walk(child);
      if (block) {
        flush();
        kind = previousKind;
      }
    };
    walk(root);
    flush();
    return blocks;
  }
  function tocLabels(items, base, labels = /* @__PURE__ */ new Map()) {
    for (const item of items) {
      if (item.href && item.label) labels.set(archivePath(item.href, base), String(item.label).trim());
      tocLabels(item.subitems ?? item.items ?? [], base, labels);
    }
    return labels;
  }

  // src/store.js
  var TARGET_TYPES = Object.freeze(["reasoning", "tool-call", "read-file", "command", "file-search"]);
  var DEFAULT_SETTINGS = Object.freeze({
    enabled: true,
    currentBookId: null,
    targetTypes: Object.freeze(["reasoning"]),
    mainTitle: "",
    extraTitle: ""
  });
  var EMPTY_STATUS = Object.freeze({ kind: "empty" });
  function passageSnapshotKey(bookId, stepKey) {
    return `${bookId}\0${stepKey}`;
  }
  var NovelStore = class {
    constructor(storage) {
      this.storage = storage;
      this.state = { books: [], settings: { ...DEFAULT_SETTINGS }, hydrated: false, error: null };
      this.ui = { notice: null };
      this.listeners = /* @__PURE__ */ new Set();
      this.settingsListeners = /* @__PURE__ */ new Set();
      this.uiListeners = /* @__PURE__ */ new Set();
      this.passageListeners = /* @__PURE__ */ new Set();
      this.passageStates = /* @__PURE__ */ new Map();
      this.passageSnapshot = Object.freeze({});
      this.stateSource = Object.freeze({ getSnapshot: this.getSnapshot, subscribe: this.subscribe });
      this.settingsSource = Object.freeze({ getSnapshot: this.getSettingsSnapshot, subscribe: this.subscribeSettings });
      this.uiSource = Object.freeze({ getSnapshot: this.getUiSnapshot, subscribe: this.subscribeUi });
      this.passageSource = Object.freeze({ getSnapshot: this.getPassageSnapshot, subscribe: this.subscribePassages });
      this.pendingReads = /* @__PURE__ */ new Map();
      this.cacheGeneration = 0;
      this.disposed = false;
      this.persistenceError = null;
      this.mutationQueue = Promise.resolve();
      this.ready = this.#hydrate();
    }
    getSnapshot = () => this.state;
    getSettingsSnapshot = () => this.state.settings;
    getUiSnapshot = () => this.ui;
    getPassageSnapshot = () => this.passageSnapshot;
    subscribe = (listener) => this.#subscribe(this.listeners, listener);
    subscribeSettings = (listener) => this.#subscribe(this.settingsListeners, listener);
    subscribeUi = (listener) => this.#subscribe(this.uiListeners, listener);
    subscribePassages = (listener) => this.#subscribe(this.passageListeners, listener);
    getPassageStatus(bookId, stepKey) {
      if (!bookId) return EMPTY_STATUS;
      return this.passageStates.get(passageSnapshotKey(bookId, stepKey)) ?? EMPTY_STATUS;
    }
    dispose() {
      this.disposed = true;
      this.cacheGeneration += 1;
      this.passageStates.clear();
      this.passageSnapshot = Object.freeze({});
      this.pendingReads.clear();
      this.listeners.clear();
      this.settingsListeners.clear();
      this.uiListeners.clear();
      this.passageListeners.clear();
      this.storage.close?.();
    }
    setNotice(notice) {
      this.ui = { ...this.ui, notice: notice ? String(notice) : null };
      this.#emitUi();
    }
    async setOption(key, value) {
      if (!["enabled", "targetTypes", "mainTitle", "extraTitle"].includes(key)) throw new Error("\u672A\u77E5\u8BBE\u7F6E\u9879");
      let normalized;
      if (key === "targetTypes") {
        if (!Array.isArray(value) || value.some((type) => !TARGET_TYPES.includes(type)) || new Set(value).size !== value.length) {
          throw new Error("\u9605\u8BFB\u7C7B\u578B\u5FC5\u987B\u662F\u6709\u6548\u4E14\u4E0D\u91CD\u590D\u7684\u7C7B\u578B\u6570\u7EC4");
        }
        normalized = Object.freeze([...value]);
      } else {
        normalized = key === "enabled" ? Boolean(value) : String(value);
      }
      if (key === "enabled" && !normalized || key === "targetTypes") this.#cancelPendingReads();
      return this.#updateSettings(() => ({ [key]: normalized }));
    }
    async selectBook(bookId) {
      const nextId = bookId || null;
      this.cacheGeneration += 1;
      return this.#enqueueMutation(async () => {
        if (nextId && !this.state.books.some((book) => book.id === nextId)) throw new Error("\u627E\u4E0D\u5230\u8FD9\u672C\u4E66");
        if (nextId === this.state.settings.currentBookId) return;
        await this.#saveSettings({ ...this.state.settings, currentBookId: nextId });
        this.#clearPassages(false);
      });
    }
    async importFile(file) {
      await this.ready;
      this.#assertWritable();
      const extension = String(file.name).split(".").at(-1)?.toLowerCase();
      if (!["epub", "txt", "md"].includes(extension)) throw new Error("\u53EA\u652F\u6301 EPUB\u3001TXT\u3001MD \u6587\u4EF6");
      const parsed = extension === "epub" ? await parseEpub(file, DEFAULT_SEGMENT_LENGTH) : parseTextBook(decodeBookText(await file.arrayBuffer()), extension, DEFAULT_SEGMENT_LENGTH);
      const fallbackTitle = String(file.name).replace(/\.(epub|txt|md)$/iu, "");
      return this.#addBook({
        title: parsed.title?.trim() || fallbackTitle || "\u672A\u547D\u540D\u4E66\u7C4D",
        format: extension,
        segments: parsed.segments
      });
    }
    async deleteBook(bookId) {
      if (bookId === this.state.settings.currentBookId) this.cacheGeneration += 1;
      return this.#enqueueMutation(async () => {
        if (!this.state.books.some((item) => item.id === bookId)) return;
        const books = this.state.books.filter((item) => item.id !== bookId);
        const previousSettings = this.state.settings;
        const settings = {
          ...previousSettings,
          currentBookId: previousSettings.currentBookId === bookId ? books[0]?.id ?? null : previousSettings.currentBookId
        };
        await this.storage.saveSettings(settings);
        try {
          await this.storage.deleteBook(bookId);
        } catch (error) {
          await this.#restore(() => this.storage.saveSettings(previousSettings));
          throw error;
        }
        this.#setState({ books, settings });
        if (settings.currentBookId !== previousSettings.currentBookId) this.#clearPassages(false);
      });
    }
    async claimPassage(stepKey, targetType = "reasoning") {
      if (this.disposed) return EMPTY_STATUS;
      const generation = this.cacheGeneration;
      const requestKey = `${generation}\0${targetType}\0${stepKey}`;
      const inFlight = this.pendingReads.get(requestKey);
      if (inFlight) return inFlight;
      let bookId;
      let loadingStatus;
      const operation = this.#enqueueMutation(async () => {
        if (!this.#canRead(generation, targetType)) return EMPTY_STATUS;
        bookId = this.state.settings.currentBookId;
        if (!bookId) return EMPTY_STATUS;
        const existing = this.getPassageStatus(bookId, stepKey);
        if (existing.kind === "ready" || existing.kind === "end") return existing;
        const book = this.state.books.find((item) => item.id === bookId);
        if (!book || book.progress >= book.segmentCount) {
          return this.#writePassageStatus(bookId, stepKey, { kind: "end", bookId });
        }
        loadingStatus = { kind: "loading" };
        this.#writePassageStatus(bookId, stepKey, loadingStatus);
        const index = book.progress;
        const passage = await this.storage.getSegment(bookId, index);
        if (!passage?.text) throw new Error("\u5F53\u524D\u6BB5\u843D\u4E3A\u7A7A\u6216\u5DF2\u635F\u574F");
        if (!this.#canRead(generation, targetType)) return EMPTY_STATUS;
        const updated = { ...book, progress: index + 1 };
        await this.storage.updateBook(updated);
        if (!this.#canRead(generation, targetType)) {
          await this.#restore(() => this.storage.updateBook(book));
          return EMPTY_STATUS;
        }
        const result = { kind: "ready", bookId, index, passage };
        this.#setState({ books: this.state.books.map((item) => item.id === bookId ? updated : item) });
        return this.#writePassageStatus(bookId, stepKey, result);
      }).catch((error) => {
        if (!this.persistenceError && !this.#canRead(generation, targetType)) return EMPTY_STATUS;
        const failure = { kind: "error", message: messageOf(error) };
        if (this.#canRead(generation, targetType) && bookId) this.#writePassageStatus(bookId, stepKey, failure);
        return failure;
      });
      this.pendingReads.set(requestKey, operation);
      try {
        return await operation;
      } finally {
        if (this.pendingReads.get(requestKey) === operation) this.pendingReads.delete(requestKey);
        if (bookId && loadingStatus && generation !== this.cacheGeneration && this.getPassageStatus(bookId, stepKey) === loadingStatus) {
          this.#writePassageStatus(bookId, stepKey, EMPTY_STATUS);
        }
      }
    }
    async #hydrate() {
      try {
        const stored = await this.storage.load();
        const books = stored.books ?? [];
        const storedSettings = stored.settings ?? {};
        const availableIds = new Set(books.map((book) => book.id));
        const settings = {
          ...Object.fromEntries(Object.entries(DEFAULT_SETTINGS).map(([key, fallback]) => [key, storedSettings[key] ?? fallback])),
          currentBookId: availableIds.has(storedSettings.currentBookId) ? storedSettings.currentBookId : null,
          // Migrate the old reasoning-only field once; never carry it into writes.
          targetTypes: Object.freeze(Array.isArray(storedSettings.targetTypes) ? [...new Set(storedSettings.targetTypes.filter((type) => TARGET_TYPES.includes(type)))] : [...DEFAULT_SETTINGS.targetTypes])
        };
        this.#setState({ books, settings, hydrated: true, error: null });
      } catch (error) {
        this.persistenceError = error;
        this.#setState({ hydrated: true, error: messageOf(error) });
      }
    }
    #addBook({ title, format, segments }) {
      return this.#enqueueMutation(async () => {
        if (!segments.length) throw new Error("\u6CA1\u6709\u53EF\u5BFC\u5165\u7684\u6B63\u6587");
        const book = {
          id: randomId(),
          title: String(title).trim() || "\u672A\u547D\u540D\u4E66\u7C4D",
          format,
          segmentCount: segments.length,
          progress: 0,
          importedAt: Date.now()
        };
        await this.storage.addBook(book, segments);
        const settings = this.state.settings.currentBookId ? this.state.settings : { ...this.state.settings, currentBookId: book.id };
        try {
          if (settings !== this.state.settings) await this.storage.saveSettings(settings);
        } catch (error) {
          await this.#restore(() => this.storage.deleteBook(book.id));
          throw error;
        }
        if (settings !== this.state.settings) this.#clearPassages();
        this.#setState({ books: [...this.state.books, book], settings });
        return book;
      });
    }
    #updateSettings(update) {
      return this.#enqueueMutation(async () => {
        const patch = update(this.state.settings);
        if (!patch) return this.state.settings;
        return this.#saveSettings({ ...this.state.settings, ...patch });
      });
    }
    async #saveSettings(settings) {
      await this.storage.saveSettings(settings);
      this.#setState({ settings });
      return settings;
    }
    #enqueueMutation(action) {
      const operation = this.mutationQueue.then(async () => {
        await this.ready;
        this.#assertWritable();
        return action();
      });
      this.mutationQueue = operation.catch(() => void 0);
      return operation;
    }
    #assertWritable() {
      if (this.persistenceError) throw new Error(`\u672C\u5730\u4E66\u5E93\u4E0D\u53EF\u7528\uFF0C\u8BF7\u5237\u65B0\u540E\u91CD\u8BD5\uFF1A${messageOf(this.persistenceError)}`);
      if (this.disposed) throw new Error("\u672C\u5730\u4E66\u5E93\u5DF2\u5173\u95ED");
    }
    async #restore(action) {
      try {
        await action();
      } catch (error) {
        this.persistenceError = error;
        this.#setState({ error: `\u672C\u5730\u4E66\u5E93\u6062\u590D\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u540E\u68C0\u67E5\u9605\u8BFB\u8FDB\u5EA6\uFF1A${messageOf(error)}` });
        throw error;
      }
    }
    #canRead(generation, targetType) {
      return !this.disposed && generation === this.cacheGeneration && this.state.settings.enabled && this.state.settings.targetTypes.includes(targetType);
    }
    #cancelPendingReads() {
      this.cacheGeneration += 1;
      this.pendingReads.clear();
      let changed = false;
      for (const [key, status] of this.passageStates) {
        if (status.kind === "loading") {
          this.passageStates.delete(key);
          changed = true;
        }
      }
      if (changed) {
        this.passageSnapshot = Object.freeze(Object.fromEntries(this.passageStates));
        this.#emitPassages();
      }
    }
    #clearPassages(cancelReads = true) {
      if (cancelReads) this.cacheGeneration += 1;
      this.passageStates.clear();
      this.passageSnapshot = Object.freeze({});
      this.#emitPassages();
    }
    #writePassageStatus(bookId, stepKey, status) {
      if (!bookId) return status;
      const key = passageSnapshotKey(bookId, stepKey);
      this.passageStates.set(key, status);
      this.passageSnapshot = Object.freeze({ ...this.passageSnapshot, [key]: status });
      this.#emitPassages();
      return status;
    }
    #setState(changes) {
      const next = { ...this.state, ...changes };
      this.state = next;
      for (const listener of [...this.listeners]) listener();
      if (changes.settings !== void 0) {
        for (const listener of [...this.settingsListeners]) listener();
      }
    }
    #emitPassages() {
      for (const listener of [...this.passageListeners]) listener();
    }
    #emitUi() {
      for (const listener of [...this.uiListeners]) listener();
    }
    #subscribe(listeners, listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
  function randomId() {
    return globalThis.crypto?.randomUUID?.() ?? `book-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
  function messageOf(error) {
    return error instanceof Error ? error.message : String(error);
  }

  // src/novel-content.js
  var NOVEL_STYLE = {
    fontSize: "var(--dsh-content-font-size-secondary, 13px)",
    lineHeight: "var(--dsh-content-line-height-secondary, 1.6)",
    color: "var(--dsw-alias-label-tertiary)",
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere"
  };
  var SEPARATOR_STYLE = {
    border: 0,
    borderTop: "1px solid var(--dsw-alias-border-l2)",
    margin: "10px 0 8px"
  };
  function novelContent(status, hasBook, t) {
    if (status.kind === "ready") return {
      label: t("chat.novel"),
      chapter: status.passage.chapterTitle || "",
      text: status.passage.text,
      index: status.index + 1
    };
    const message = status.kind === "loading" ? "chat.loading" : status.kind === "end" ? "chat.end" : status.kind === "error" ? "chat.readError" : hasBook ? "chat.switchHint" : "chat.noBook";
    return { label: t("chat.novel"), chapter: "", text: t(message), role: status.kind === "error" ? "alert" : "status" };
  }

  // src/chat-adapter.js
  var THOUGHT = '[data-chat-flow-kind="assistant-step"] [data-variant="think"]';
  var TOOL = '[data-chat-call-id] [data-tool], [data-chat-call-id] [data-sample="bash"]';
  var REGIONS = `${THOUGHT}, ${TOOL}`;
  var EMPTY = Object.freeze({ kind: "empty" });
  function registerChatAdapter(ctx, store, React, locale) {
    const t = ctx.locale?.bind(locale) ?? ((key) => key);
    ctx.slots.inject("conversation.chat.reasoning.body", () => ctx.slots.register({
      name: "conversation.chat.reasoning.body",
      priority: -10,
      locale,
      inject: () => ({ hooks: { novelSettings: store.settingsSource, novelPassages: store.passageSource } })
    }, createBody(React)));
    ctx.effect(() => {
      const decorated = /* @__PURE__ */ new Map();
      const pending = /* @__PURE__ */ new Map();
      const view = document.defaultView;
      let disposed = false;
      const restore = (root) => {
        const record = decorated.get(root);
        if (!record) return;
        for (const [node, text] of record.texts) restoreText(node, text);
        record.append?.remove();
        root.removeAttribute("data-novel-target");
        decorated.delete(root);
      };
      const refresh = () => {
        const settings = store.getSettingsSnapshot();
        for (const [toggle, intent] of pending) {
          const id = identityOf(intent.root);
          if (!toggle.isConnected || !settings.enabled || settings.currentBookId !== intent.bookId || !isTarget(settings, id) || readingKey(id) !== intent.key || store.cacheGeneration !== intent.generation) {
            if (intent.frame !== null) view.cancelAnimationFrame(intent.frame);
            pending.delete(toggle);
          }
        }
        for (const root of decorated.keys()) {
          if (!root.isConnected || !settings.enabled || !isTarget(settings, identityOf(root))) restore(root);
        }
        for (const root of document.querySelectorAll(REGIONS)) {
          const id = identityOf(root);
          const header = headerOf(root);
          if (!header || !settings.enabled || !isTarget(settings, id)) continue;
          let record = decorated.get(root);
          if (!record || record.header !== header) {
            restore(root);
            record = { header, texts: /* @__PURE__ */ new Map(), append: null, signature: null };
            decorated.set(root, record);
            root.setAttribute("data-novel-target", "");
          }
          const desired = /* @__PURE__ */ new Map();
          const content = [...header.children].find((child) => child.querySelector("[data-shimmer-decoration]"));
          const layers = [content?.firstElementChild, content?.querySelector("[inert]")?.firstElementChild?.firstElementChild];
          for (const layer of layers) {
            const title = layer?.firstElementChild;
            if (!title) continue;
            collectText(title, settings.mainTitle.trim(), desired);
            const separator = title.nextElementSibling;
            if (separator?.hasAttribute("data-shimmer-decoration")) collectText(separator.nextElementSibling, settings.extraTitle.trim(), desired);
          }
          for (const [node, text] of record.texts) {
            if (!desired.has(node)) {
              restoreText(node, text);
              record.texts.delete(node);
            }
          }
          for (const [node, value] of desired) {
            const current = readText(node);
            const previous = record.texts.get(node);
            const native = previous && current === previous.shown ? previous.native : current;
            record.texts.set(node, { native, shown: value });
            if (current !== value) writeText(node, value);
          }
          if (id.type !== "reasoning") {
            const toggle = toggleOf(header);
            if (toggle?.getAttribute("aria-expanded") !== "true") {
              record.append?.remove();
              record.append = null;
              record.signature = null;
              continue;
            }
            const status = store.getPassageStatus(settings.currentBookId, readingKey(id));
            const model = novelContent(status, Boolean(settings.currentBookId), t);
            const signature = JSON.stringify(model);
            const container = root.matches('[data-sample="bash"]') ? root.parentElement : root;
            if (!record.append || !container.contains(record.append)) {
              record.append = document.createElement("div");
              record.append.setAttribute("data-novel-append", "");
              container.append(record.append);
              record.signature = null;
            }
            if (signature !== record.signature) {
              renderPlainAppend(record.append, model);
              record.signature = signature;
            }
          }
        }
      };
      const activate = (event) => {
        if (!event.isTrusted || event.defaultPrevented) return;
        if (event.type === "keydown" && (event.repeat || !["Enter", " "].includes(event.key))) return;
        if (event.type === "click" && event.button > 0) return;
        const target = event.target instanceof Element ? event.target : event.target?.parentElement;
        const header = target?.closest('[data-disclosure-row], [data-sample="bash"][aria-expanded]');
        const root = header?.matches('[data-sample="bash"]') ? header : header?.closest('[data-tool], [data-variant="think"]');
        if (!root?.matches(REGIONS)) return;
        const toggle = toggleOf(header);
        if (!toggle || !toggle.contains(target) || toggle.getAttribute("aria-expanded") !== "false") return;
        const control = target.closest('button, [role="button"], a, input, select, textarea, [contenteditable="true"]');
        if (control && control !== toggle) return;
        if (event.type === "keydown" && target !== toggle) return;
        const id = identityOf(root);
        const settings = store.getSettingsSnapshot();
        if (!settings.enabled || !isTarget(settings, id) || pending.has(toggle)) return;
        const bookId = settings.currentBookId;
        const intent = { frame: null, root, key: readingKey(id), bookId, generation: store.cacheGeneration };
        pending.set(toggle, intent);
        const verify = () => {
          if (pending.get(toggle) !== intent) return;
          pending.delete(toggle);
          const current = store.getSettingsSnapshot();
          const currentId = identityOf(root);
          if (!disposed && toggle.isConnected && toggle.getAttribute("aria-expanded") === "true" && current.enabled && current.currentBookId === bookId && isTarget(current, currentId) && store.cacheGeneration === intent.generation && readingKey(currentId) === intent.key) {
            void store.claimPassage(readingKey(id), id.type);
          }
        };
        if (view?.requestAnimationFrame) intent.frame = view.requestAnimationFrame(verify);
        else queueMicrotask(verify);
      };
      const observer = new MutationObserver(refresh);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["data-shimmer-text", "aria-expanded", "data-tool", "data-state"]
      });
      document.addEventListener("click", activate, true);
      document.addEventListener("keydown", activate, true);
      const stopSettings = store.subscribeSettings(refresh);
      const stopPassages = store.subscribePassages(refresh);
      refresh();
      return () => {
        disposed = true;
        observer.disconnect();
        stopSettings();
        stopPassages();
        document.removeEventListener("click", activate, true);
        document.removeEventListener("keydown", activate, true);
        for (const intent of pending.values()) if (intent.frame !== null) view.cancelAnimationFrame(intent.frame);
        pending.clear();
        for (const root of decorated.keys()) restore(root);
      };
    }, "novel-fish: native disclosure adapter");
  }
  function headerOf(root) {
    return root.matches('[data-sample="bash"]') ? root : root.querySelector("[data-disclosure-row]");
  }
  function toggleOf(header) {
    return header.matches('[role="button"][aria-expanded]') ? header : header.querySelector(":scope > button[aria-expanded]");
  }
  function collectText(element, value, desired) {
    if (!element || !value) return;
    const walker = element.ownerDocument.createTreeWalker(element, 4);
    let first = true;
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      desired.set(node, first ? value : "");
      first = false;
    }
    for (const node of [element, ...element.querySelectorAll("[data-shimmer-text]")]) {
      if (node.hasAttribute("data-shimmer-text")) desired.set(node, value);
    }
  }
  function readText(node) {
    return node.nodeType === 3 ? node.nodeValue : node.getAttribute("data-shimmer-text");
  }
  function writeText(node, value) {
    if (node.nodeType === 3) node.nodeValue = value;
    else node.setAttribute("data-shimmer-text", value);
  }
  function restoreText(node, text) {
    if (readText(node) === text.shown) writeText(node, text.native);
  }
  function createBody(React) {
    const h = React.createElement;
    return function NovelBody({ text, running, sessionId, useNovelSettings, useNovelPassages, renderFactorySlot, t }) {
      const ref = React.useRef(null);
      const [identity, setIdentity] = React.useState(null);
      const settings = useNovelSettings((value) => value);
      React.useEffect(() => {
        setIdentity(identityOf(ref.current));
      }, [sessionId]);
      const selected = settings.enabled && isTarget(settings, identity);
      const key = settings.currentBookId && identity ? passageSnapshotKey(settings.currentBookId, readingKey(identity)) : null;
      const status = useNovelPassages((snapshot) => key ? snapshot[key] : void 0) ?? EMPTY;
      const model = selected ? novelContent(status, Boolean(settings.currentBookId), t) : null;
      return h(
        "div",
        { ref },
        h("div", { "data-novel-original": true }, renderFactorySlot("conversation.chat.reasoning.content", { text, running })),
        model === null ? null : h(
          "div",
          { "data-novel-append": true, style: NOVEL_STYLE },
          h("hr", { style: SEPARATOR_STYLE }),
          h("div", { "data-novel-label": true }, model.chapter ? `${model.label} \xB7 ${model.chapter}` : model.label),
          h("div", { "data-novel-passage": model.index, role: model.role }, model.text)
        )
      );
    };
  }
  function renderPlainAppend(element, model) {
    Object.assign(element.style, NOVEL_STYLE);
    const divider = document.createElement("hr");
    Object.assign(divider.style, SEPARATOR_STYLE);
    const label = document.createElement("div");
    label.setAttribute("data-novel-label", "");
    label.textContent = model.chapter ? `${model.label} \xB7 ${model.chapter}` : model.label;
    const content = document.createElement("div");
    if (model.index) content.setAttribute("data-novel-passage", model.index);
    if (model.role) content.setAttribute("role", model.role);
    content.textContent = model.text;
    element.replaceChildren(divider, label, content);
  }
  function identityOf(element) {
    const root = element?.closest('[data-variant="think"], [data-tool], [data-sample="bash"]');
    const node = root?.closest("[data-chat-node-key]");
    const container = node?.closest("[data-conversation-session]");
    if (!root || !node || !container) return null;
    const sessionId = container.getAttribute("data-conversation-session");
    const nodeKey = node.getAttribute("data-chat-node-key");
    if (!sessionId || !nodeKey) return null;
    if (root.matches(THOUGHT)) {
      const regions = [...node.querySelectorAll('[data-variant="think"]')].filter((region) => region.closest("[data-chat-node-key]") === node);
      const index = regions.indexOf(root);
      return index < 0 ? null : { sessionId, nodeKey, type: "reasoning", index };
    }
    const call = root.closest("[data-chat-call-id]");
    if (!call || !call.getAttribute("data-chat-call-id")) return null;
    const variant = root.getAttribute("data-variant");
    const name = root.getAttribute("data-tool");
    const type = variant === "bash" ? "command" : ["read", "read_image"].includes(name) ? "read-file" : ["grep", "glob"].includes(name) ? "file-search" : "tool-call";
    return { sessionId, nodeKey, type, index: call.getAttribute("data-chat-call-id") };
  }
  function readingKey(identity) {
    return JSON.stringify([identity.sessionId, identity.nodeKey, identity.type, identity.index]);
  }
  function isTarget(settings, identity) {
    return identity !== null && settings.targetTypes?.includes(identity.type);
  }

  // src/settings.js
  var TYPE_LABELS = { reasoning: "typeReasoning", "tool-call": "typeToolCall", "read-file": "typeReadFile", command: "typeCommand", "file-search": "typeFileSearch" };
  var PANEL = {
    display: "grid",
    gap: 14,
    padding: 14,
    border: "1px solid var(--dsw-alias-border-l2)",
    borderRadius: "var(--dsw-radius-md, 10px)",
    color: "var(--dsw-alias-label-primary)",
    fontSize: "var(--dsh-content-font-size-secondary, 13px)"
  };
  var LABEL = { display: "grid", gap: 5, color: "var(--dsw-alias-label-secondary)" };
  var CONTROL = {
    boxSizing: "border-box",
    width: "100%",
    minWidth: 0,
    border: "1px solid var(--dsw-alias-border-l2)",
    borderRadius: "var(--dsw-radius-sm, 6px)",
    background: "var(--dsw-alias-bg-base)",
    color: "var(--dsw-alias-label-primary)",
    padding: "7px 9px",
    font: "inherit"
  };
  var BUTTON = {
    ...CONTROL,
    width: "auto",
    cursor: "pointer",
    background: "var(--dsw-alias-interactive-bg-hover)"
  };
  var MAIN_TITLES = ["", "\u601D\u8003", "\u5206\u6790", "\u68C0\u67E5", "Thinking"];
  var EXTRA_TITLES = ["", "Checking project structure", "Analyzing the request", "Reviewing implementation", "Verifying results"];
  function createSettingsRow(React, Switch) {
    const h = React.createElement;
    function PresetField({ t, label, value, choices, disabled, onChange, testId, maxLength }) {
      const [custom, setCustom] = React.useState(!choices.includes(value));
      const showCustom = custom || !choices.includes(value);
      return h(
        "label",
        { style: LABEL },
        h("span", null, label),
        h(
          "select",
          {
            style: CONTROL,
            value: showCustom ? "__custom" : value,
            disabled,
            "data-novel-preset": testId,
            onChange: (event) => {
              const next = event.currentTarget.value;
              if (next === "__custom") setCustom(true);
              else void onChange(next).then((saved) => {
                if (saved) setCustom(false);
              });
            }
          },
          choices.map((choice) => h("option", { key: choice, value: choice }, choice || t(testId === "title" ? "settings.nativeTitle" : "settings.noExtra"))),
          h("option", { value: "__custom" }, t("settings.custom"))
        ),
        showCustom ? h("input", {
          style: CONTROL,
          defaultValue: value,
          disabled,
          maxLength,
          "aria-label": t("settings.customField", { label }),
          [`data-novel-${testId}`]: true,
          onChange: (event) => onChange(event.currentTarget.value)
        }) : null
      );
    }
    function SettingsRow({ t, useNovelState, useNovelUi, onSetOption, onSetNotice, onSelectBook, onDeleteBook, onImportFile }) {
      const state = useNovelState((value) => value);
      const ui = useNovelUi((value) => value);
      const [busy, setBusy] = React.useState(false);
      const [savingTypes, setSavingTypes] = React.useState(false);
      const [savingEnabled, setSavingEnabled] = React.useState(false);
      const enabling = React.useRef(false);
      const selectedBook = state.books.find((book) => book.id === state.settings.currentBookId);
      const disabled = busy || !state.hydrated || Boolean(state.error);
      const perform = async (action) => {
        try {
          await action();
          return true;
        } catch (error) {
          onSetNotice(t("settings.actionError", { message: errorMessage(error) }));
          return false;
        }
      };
      const setEnabled = async (enabled) => {
        if (disabled || enabling.current) return;
        enabling.current = true;
        setSavingEnabled(true);
        try {
          await perform(() => onSetOption("enabled", enabled));
        } finally {
          enabling.current = false;
          setSavingEnabled(false);
        }
      };
      const setTypes = async (types) => {
        setSavingTypes(true);
        try {
          await perform(() => onSetOption("targetTypes", types));
        } finally {
          setSavingTypes(false);
        }
      };
      const importFile = async (event) => {
        const input = event.currentTarget;
        const file = input.files?.[0];
        if (!file) return;
        setBusy(true);
        onSetNotice(t("settings.importing"));
        try {
          const book = await onImportFile(file);
          onSetNotice(t("settings.importDone", { count: book.segmentCount }));
        } catch (error) {
          onSetNotice(t("settings.importError", { message: errorMessage(error) }));
        } finally {
          input.value = "";
          setBusy(false);
        }
      };
      return h(
        "section",
        { style: PANEL, "data-novel-settings": true },
        h(
          "div",
          { style: { display: "grid", gap: 3 } },
          h("strong", { style: { fontSize: 14, color: "var(--dsw-alias-label-primary)" } }, t("settings.title")),
          h("span", { style: { color: "var(--dsw-alias-label-tertiary)" } }, t("settings.description"))
        ),
        !state.hydrated && !state.error ? h("div", null, t("settings.storageLoading")) : null,
        state.error ? h("div", { role: "alert" }, state.error) : null,
        h(
          "div",
          { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 } },
          h("span", null, t("settings.enabled")),
          h(Switch, { checked: state.settings.enabled, disabled: disabled || savingEnabled, label: t("settings.enabled"), onChange: (enabled) => {
            void setEnabled(enabled);
          } })
        ),
        h(
          "label",
          { style: LABEL },
          h("span", null, t("settings.bookSource")),
          h("input", { type: "file", accept: ".epub,.txt,.md,application/epub+zip,text/plain,text/markdown", onChange: (event) => {
            void importFile(event);
          }, disabled, "data-novel-file-input": true })
        ),
        h(
          "label",
          { style: LABEL },
          h("span", null, t("settings.selectBook")),
          h(
            "select",
            {
              style: CONTROL,
              disabled: disabled || !state.books.length,
              value: state.settings.currentBookId ?? "",
              "data-novel-book-select": true,
              onChange: (event) => {
                const id = event.currentTarget.value;
                void perform(() => onSelectBook(id));
              }
            },
            h("option", { value: "" }, t("settings.noBook")),
            state.books.map((book) => h("option", { key: book.id, value: book.id }, `${book.title} \xB7 ${book.format.toUpperCase()}`))
          )
        ),
        selectedBook ? h(
          "div",
          { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 } },
          h("span", { "data-novel-progress": true }, t("settings.progressValue", { progress: selectedBook.progress, total: selectedBook.segmentCount, percent: Math.floor(selectedBook.progress / selectedBook.segmentCount * 100) })),
          h("button", { type: "button", style: BUTTON, disabled, onClick: () => {
            if (globalThis.confirm?.(t("settings.removeConfirm", { title: selectedBook.title }))) void perform(() => onDeleteBook(selectedBook.id));
          } }, t("settings.deleteBook"))
        ) : h("div", null, t("settings.emptyLibrary")),
        h(
          "div",
          { style: LABEL },
          h("span", { id: "novel-type-label" }, t("settings.targetType")),
          h(
            "details",
            { style: CONTROL, "data-novel-type-select": true },
            h(
              "summary",
              { style: { cursor: "pointer" }, "aria-labelledby": "novel-type-label" },
              t("settings.selectedTypes", { count: state.settings.targetTypes.length, total: TARGET_TYPES.length })
            ),
            h(
              "fieldset",
              { disabled: disabled || savingTypes, style: { border: 0, margin: "8px 0 0", padding: 0, display: "grid", gap: 7 }, "aria-label": t("settings.targetType") },
              h(
                "label",
                null,
                h("input", {
                  type: "checkbox",
                  "data-novel-type-all": true,
                  checked: state.settings.targetTypes.length === TARGET_TYPES.length,
                  onChange: (event) => {
                    void setTypes(event.currentTarget.checked ? [...TARGET_TYPES] : []);
                  }
                }),
                t("settings.allTypes")
              ),
              TARGET_TYPES.map((type) => h(
                "label",
                { key: type },
                h("input", {
                  type: "checkbox",
                  checked: state.settings.targetTypes.includes(type),
                  "data-novel-type": type,
                  onChange: (event) => {
                    const selected = event.currentTarget.checked;
                    void setTypes(selected ? TARGET_TYPES.filter((value) => value === type || state.settings.targetTypes.includes(value)) : state.settings.targetTypes.filter((value) => value !== type));
                  }
                }),
                t(`settings.${TYPE_LABELS[type]}`)
              ))
            )
          ),
          h("span", null, t("settings.typeHint"))
        ),
        h(
          "div",
          { key: String(state.hydrated), style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 8 } },
          [
            ["mainTitle", "settings.titleMain", "title", MAIN_TITLES],
            ["extraTitle", "settings.titleExtra", "extra", EXTRA_TITLES]
          ].map(([key, label, testId, choices, maxLength]) => h(PresetField, {
            key,
            t,
            label: t(label),
            value: state.settings[key],
            choices,
            disabled,
            testId,
            maxLength,
            onChange: (value) => perform(() => onSetOption(key, value))
          }))
        ),
        h("span", { style: { color: "var(--dsw-alias-label-tertiary)" } }, t("settings.nativeControls")),
        h("span", { style: { color: "var(--dsw-alias-label-tertiary)" } }, t("settings.presetHint")),
        ui.notice ? h("div", { role: "status", "data-novel-notice": true }, ui.notice) : null
      );
    }
    return React.memo(SettingsRow);
  }
  function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
  }

  // locale/zh.json
  var zh_default = {
    meta: {
      title: "\u5C0F\u8BF4\u6478\u9C7C",
      description: "\u4E3B\u52A8\u5C55\u5F00\u9009\u4E2D\u7684\u539F\u751F\u533A\u57DF\u65F6\uFF0C\u5728\u771F\u5B9E\u5185\u5BB9\u540E\u7684\u5206\u9694\u7EBF\u4E0B\u8FFD\u52A0\u672C\u5730\u5C0F\u8BF4\u3002"
    },
    chat: {
      novel: "\u5C0F\u8BF4",
      think: "\u601D\u8003",
      running: "\u8FD0\u884C\u4E2D",
      stopped: "\u5DF2\u505C\u6B62",
      unknownBlock: "\u672A\u77E5\u5185\u5BB9\u5757",
      jsonTruncated: "\u2026 \u5DF2\u622A\u65AD\uFF0C\u5171 {total} \u5B57\u7B26",
      noBook: "\u8BF7\u5148\u5728\u63D2\u4EF6 \u2192 \u5C0F\u8BF4\u6478\u9C7C\u4E2D\u9009\u62E9\u4E00\u672C\u4E66\u3002",
      switchHint: "\u8BF7\u6536\u8D77\u540E\u518D\u4E3B\u52A8\u5C55\u5F00\u6B64\u533A\u57DF\uFF0C\u4ECE\u5F53\u524D\u8FDB\u5EA6\u8BFB\u53D6\u3002",
      loading: "\u6B63\u5728\u8BFB\u53D6\u2026",
      readError: "\u5C0F\u8BF4\u672A\u80FD\u52A0\u8F7D\uFF0C\u9605\u8BFB\u8FDB\u5EA6\u672A\u6539\u53D8\u3002",
      end: "\u672C\u4E66\u5DF2\u8BFB\u5B8C\u3002",
      retry: "\u8BF7\u6536\u8D77\u540E\u518D\u4E3B\u52A8\u5C55\u5F00\uFF0C\u4EE5\u91CD\u8BD5\u8BFB\u53D6\u3002",
      chapter: "\u7B2C {number} \u7AE0 \xB7 {title}",
      passage: "\u7B2C {number} \u6BB5"
    },
    settings: {
      title: "\u5C0F\u8BF4\u6478\u9C7C",
      description: "\u5BFC\u5165\u5E76\u9009\u62E9\u4E00\u672C\u4E66\uFF0C\u518D\u591A\u9009\u539F\u751F\u533A\u57DF\u7C7B\u578B\u3002\u4E3B\u52A8\u5C55\u5F00\u65F6\u4FDD\u7559\u771F\u5B9E\u5185\u5BB9\uFF0C\u5728\u5206\u9694\u7EBF\u4E0B\u8FFD\u52A0\u7EAF\u6587\u672C\u5C0F\u8BF4\uFF1B\u4E0D\u53D1\u9001\u7ED9\u6A21\u578B\u3002",
      storageLoading: "\u6B63\u5728\u6253\u5F00\u672C\u5730\u4E66\u5E93\u2026",
      enabled: "\u542F\u7528\u804A\u5929\u5185\u9605\u8BFB",
      targetType: "\u9605\u8BFB\u533A\u57DF\u7C7B\u578B",
      typeReasoning: "\u601D\u8003\uFF08Thinking\uFF09",
      typeToolCall: "\u5176\u4ED6\u5DE5\u5177\u8C03\u7528",
      typeReadFile: "\u6253\u5F00\u6587\u4EF6\uFF08read / read_image\uFF09",
      typeCommand: "\u8FD0\u884C\u547D\u4EE4\uFF08bash / pwsh\uFF09",
      typeFileSearch: "\u6587\u4EF6\u641C\u7D22\uFF08grep / glob\uFF09",
      selectedTypes: "\u5DF2\u9009\u62E9 {count} / {total} \u7C7B \xB7 \u70B9\u51FB\u591A\u9009",
      allTypes: "\u5168\u9009 / \u53D6\u6D88\u5168\u9009",
      typeHint: "\u4E94\u7C7B\u4E92\u4E0D\u91CD\u53E0\uFF0C\u53EF\u591A\u9009\u6216\u5168\u9009\uFF1B\u7A7A\u9009\u4E0D\u8BFB\u53D6\u3002\u4EC5\u9002\u914D\u5DF2\u6709\u539F\u751F\u6298\u53E0\u533A\u57DF\uFF0C\u4E0D\u6539\u5DE5\u5177\u8F93\u5165\u8F93\u51FA\u6216\u56DE\u7B54\uFF0C\u4E5F\u4E0D\u4E3A\u4E0D\u53EF\u5C55\u5F00\u7684\u5361\u7247\u5236\u9020\u63A7\u4EF6\u3002\u9996\u6B21\u4E3B\u52A8\u5C55\u5F00\u53E6\u4E00\u5904\u624D\u7EED\u8BFB\u3002",
      bookSource: "\u5BFC\u5165\u4E66\u7C4D\uFF08EPUB / TXT / MD\uFF09",
      selectBook: "\u5F53\u524D\u4E66\u7C4D",
      noBook: "\u8BF7\u9009\u62E9\u4E66\u7C4D",
      deleteBook: "\u5220\u9664\u5F53\u524D\u4E66\u7C4D",
      progressValue: "\u5DF2\u8BFB {progress} / {total} \u6BB5\uFF08{percent}%\uFF09\xB7 \u81EA\u52A8\u8BB0\u5FC6\u8FDB\u5EA6",
      emptyLibrary: "\u8BF7\u5BFC\u5165 EPUB\u3001TXT \u6216 MD \u6587\u4EF6\u5F00\u59CB\u9605\u8BFB\u3002",
      nativeControls: "\u56FE\u6807\u3001\u60AC\u505C\u7BAD\u5934\u3001\u5C55\u5F00\u7BAD\u5934\u4E0E\u6298\u53E0\u4EA4\u4E92\u5747\u8DDF\u968F DSH \u539F\u751F\uFF0C\u4E0D\u505A\u81EA\u5B9A\u4E49\u8986\u76D6\u3002",
      titleMain: "\u4E3B\u6807\u9898",
      titleExtra: "\u8865\u5145\u6587\u5B57",
      nativeTitle: "\u8DDF\u968F DSH \u7684\u539F\u751F\u533A\u57DF\u6807\u9898",
      noExtra: "\u8DDF\u968F DSH \u7684\u539F\u751F\u533A\u57DF\u6458\u8981",
      custom: "\u81EA\u5B9A\u4E49\u2026",
      customField: "\u81EA\u5B9A\u4E49{label}",
      presetHint: "\u76F4\u63A5\u9009\u62E9\u9884\u8BBE\uFF0C\u65E0\u9700\u6253\u5B57\uFF1B\u53EA\u6709\u9009\u62E9\u201C\u81EA\u5B9A\u4E49\u201D\u65F6\u624D\u663E\u793A\u8F93\u5165\u6846\u3002",
      importing: "\u6B63\u5728\u8BFB\u53D6\u5E76\u5206\u6BB5\u2026",
      importDone: "\u5BFC\u5165\u5B8C\u6210\uFF1A{count} \u6BB5",
      importError: "\u65E0\u6CD5\u5BFC\u5165\uFF1A{message}",
      actionError: "\u64CD\u4F5C\u5931\u8D25\uFF1A{message}",
      removeConfirm: "\u5220\u9664\u300A{title}\u300B\u53CA\u5176\u672C\u5730\u9605\u8BFB\u8FDB\u5EA6\uFF1F"
    }
  };

  // locale/en.json
  var en_default = {
    meta: {
      title: "Novel Fish",
      description: "Append local novel text below a separator after real content when actively expanding selected native regions."
    },
    chat: {
      novel: "Novel",
      think: "Thinking",
      running: "Running",
      stopped: "Stopped",
      unknownBlock: "Unknown content block",
      jsonTruncated: "\u2026 truncated, {total} characters",
      noBook: "Select a book under Plugins \u2192 Novel Fish first.",
      switchHint: "Collapse and actively expand this region to read from the current progress.",
      loading: "Loading\u2026",
      readError: "The passage could not be loaded; progress did not change.",
      end: "The book is finished.",
      retry: "Collapse and actively expand this region to retry.",
      chapter: "Chapter {number} \xB7 {title}",
      passage: "Passage {number}"
    },
    settings: {
      title: "Novel Fish",
      description: "Import a book and select one or more native region types. Active expansion keeps real content and appends plain novel text below a separator; nothing is sent to the model.",
      storageLoading: "Opening the local library\u2026",
      enabled: "Enable reading in chat",
      targetType: "Reading region type",
      typeReasoning: "Thinking",
      typeToolCall: "Other tool calls",
      typeReadFile: "Open files (read / read_image)",
      typeCommand: "Run commands (bash / pwsh)",
      typeFileSearch: "File search (grep / glob)",
      selectedTypes: "{count} / {total} types selected \xB7 expand to choose",
      allTypes: "Select / deselect all",
      typeHint: "Five non-overlapping types; select several, all or none. Only existing native disclosures are adapted. Tool inputs, outputs and chat answers stay intact, with no new controls for non-expandable cards. A different region's first active expansion continues reading.",
      bookSource: "Import a book (EPUB / TXT / MD)",
      selectBook: "Current book",
      noBook: "Select a book",
      deleteBook: "Delete current book",
      progressValue: "Read {progress} / {total} passages ({percent}%) \xB7 automatically saved",
      emptyLibrary: "Import an EPUB, TXT, or MD file to begin.",
      nativeControls: "Icons, hover/open chevrons and disclosure interactions remain entirely native to DSH.",
      titleMain: "Main title",
      titleExtra: "Additional text",
      nativeTitle: "Follow the native DSH region title",
      noExtra: "Follow the native DSH region summary",
      custom: "Custom\u2026",
      customField: "Custom {label}",
      presetHint: "Choose presets without typing; an input appears only when Custom is selected.",
      importing: "Reading and splitting\u2026",
      importDone: "Imported: {count} passages",
      importError: "Import failed: {message}",
      actionError: "Action failed: {message}",
      removeConfirm: "Delete {title} and its local reading progress?"
    }
  };

  // src/client.js
  var MODULE_ID = "@gongfpp/dsh-novel-fish";
  var LOCALE = "novel-fish";
  function flatten(value, prefix = "") {
    return Object.fromEntries(Object.entries(value).flatMap(([key, item]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return typeof item === "string" ? [[path, item]] : Object.entries(flatten(item, path));
    }));
  }
  window.__ModuleLoader__.load({
    id: MODULE_ID,
    factory(require2) {
      const React = require2("react");
      const { Switch } = require2("@deepseek-ai/dsh-client-ui-primitives");
      return {
        inject: ["slots", "locale"],
        apply(ctx) {
          const storage = new IndexedDbStorage();
          const store = new NovelStore(storage);
          const SettingsRow = createSettingsRow(React, Switch);
          const settingsActions = {
            onSetOption: (key, value) => store.setOption(key, value),
            onSetNotice: (notice) => store.setNotice(notice),
            onSelectBook: (bookId) => store.selectBook(bookId),
            onDeleteBook: (bookId) => store.deleteBook(bookId),
            onImportFile: (file) => store.importFile(file)
          };
          ctx.effect(() => ctx.locale.register(LOCALE, { zh: flatten(zh_default), en: flatten(en_default) }), "novel-fish: locale");
          ctx.effect(() => () => store.dispose(), "novel-fish: store");
          ctx.slots.inject("plugins.bundle.config", () => ctx.slots.register({
            name: "plugins.bundle.config",
            key: MODULE_ID,
            locale: LOCALE,
            inject: () => ({
              hooks: {
                novelState: store.stateSource,
                novelUi: store.uiSource
              },
              ...settingsActions
            })
          }, SettingsRow));
          registerChatAdapter(ctx, store, React, LOCALE);
        }
      };
    }
  });
})();
/*! Bundled license information:

jszip/dist/jszip.min.js:
  (*!

  JSZip v3.10.2 - A JavaScript class for generating and reading zip files
  <http://stuartk.com/jszip>

  (c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
  Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

  JSZip uses the library pako released under the MIT license :
  https://github.com/nodeca/pako/blob/main/LICENSE
  *)

crc-32/crc32.js:
  (*! crc32.js (C) 2014-present SheetJS -- http://sheetjs.com *)
*/
