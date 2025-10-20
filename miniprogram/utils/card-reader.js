var _createForOfIteratorHelper2 = require("../@babel/runtime/helpers/createForOfIteratorHelper");var _toConsumableArray2 = require("../@babel/runtime/helpers/toConsumableArray");var _objectSpread2 = require("../@babel/runtime/helpers/objectSpread2");var _regeneratorRuntime2 = require("../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../@babel/runtime/helpers/asyncToGenerator");var _classCallCheck2 = require("../@babel/runtime/helpers/classCallCheck");var _createClass2 = require("../@babel/runtime/helpers/createClass");var e = require("./chameleon-protocol.js"),
  t = "iso14443a",
  s = "em410x",
  a = "unknown",
  r = {
    MIFARE_CLASSIC_1K: {
      name: "Mifare Classic 1K",
      protocol: t,
      sectors: 16,
      blocks: 64,
      blockSize: 16,
      frequency: "hf"
    },
    MIFARE_CLASSIC_4K: {
      name: "Mifare Classic 4K",
      protocol: t,
      sectors: 40,
      blocks: 256,
      blockSize: 16,
      frequency: "hf"
    },
    MIFARE_ULTRALIGHT: {
      name: "Mifare Ultralight",
      protocol: t,
      pages: 16,
      pageSize: 4,
      frequency: "hf"
    },
    NTAG213: {
      name: "NTAG213",
      protocol: t,
      pages: 45,
      pageSize: 4,
      frequency: "hf"
    },
    NTAG215: {
      name: "NTAG215",
      protocol: t,
      pages: 135,
      pageSize: 4,
      frequency: "hf"
    },
    NTAG216: {
      name: "NTAG216",
      protocol: t,
      pages: 231,
      pageSize: 4,
      frequency: "hf"
    },
    EM410X: {
      name: "EM410X",
      protocol: s,
      uidSize: 5,
      frequency: "lf"
    },
    T55XX: {
      name: "T55XX",
      protocol: "t55xx",
      blocks: 8,
      blockSize: 4,
      frequency: "lf"
    }
  };var o = /*#__PURE__*/function () {
  function o() {
    _classCallCheck2(this, o);
  }
  _createClass2(o, null, [{
    key: "getMifareClassicTypeByHardware",
    value: function () {
      var _getMifareClassicTypeByHardware = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee(e) {
        var _t, _s, _a;
        return _regeneratorRuntime2().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return e.send14ARaw([96, 255], {
                checkResponseCrc: !1,
                autoSelect: !1,
                activateRfField: !1,
                waitResponse: !0,
                appendCrc: !0
              });
            case 3:
              _t = _context.sent;
              if (!(_t && 4 === _t.length)) {
                _context.next = 6;
                break;
              }
              return _context.abrupt("return", "4k");
            case 6:
              _context.next = 8;
              return e.send14ARaw([96, 80], {
                checkResponseCrc: !1,
                autoSelect: !1,
                activateRfField: !1,
                waitResponse: !0,
                appendCrc: !0
              });
            case 8:
              _s = _context.sent;
              if (!(_s && 4 === _s.length)) {
                _context.next = 11;
                break;
              }
              return _context.abrupt("return", "2k");
            case 11:
              _context.next = 13;
              return e.send14ARaw([96, 63], {
                checkResponseCrc: !1,
                autoSelect: !1,
                activateRfField: !1,
                waitResponse: !0,
                appendCrc: !0
              });
            case 13:
              _a = _context.sent;
              return _context.abrupt("return", _a && 4 === _a.length ? "1k" : "mini");
            case 17:
              _context.prev = 17;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", (console.error("[CardIdentifier] 卡片类型识别失败:", _context.t0), "1k"));
            case 20:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 17]]);
      }));
      function getMifareClassicTypeByHardware(_x) {
        return _getMifareClassicTypeByHardware.apply(this, arguments);
      }
      return getMifareClassicTypeByHardware;
    }()
  }, {
    key: "identifyHFCard",
    value: function identifyHFCard(_ref) {
      var e = _ref.sak,
        s = _ref.atqa,
        a = _ref.ats,
        _o = _ref.uid;
      var c = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var n = "string" == typeof e ? parseInt(e, 16) : e;
      var i;
      if ("string" == typeof s) {
        var _e = s.replace(/\s/g, "");
        i = parseInt(_e, 16);
      } else i = s;
      return 24 == (24 & n) ? {
        type: "mifare_classic",
        subtype: "unknown",
        info: r.MIFARE_CLASSIC_1K,
        protocol: t,
        needsHardwareCheck: !0
      } : 0 === n && 68 === i ? {
        type: "mifare_ultralight",
        subtype: "unknown",
        info: r.MIFARE_ULTRALIGHT,
        protocol: t,
        needsVersionCheck: !0
      } : 0 !== n || 68 !== i && 4 !== i ? {
        type: "iso14443a",
        subtype: "unknown",
        info: {
          name: "ISO14443A",
          protocol: t,
          frequency: "hf"
        },
        protocol: t
      } : {
        type: "ntag",
        subtype: "unknown",
        info: r.NTAG213,
        protocol: t,
        needsVersionCheck: !0
      };
    }
  }, {
    key: "identifyLFCard",
    value: function identifyLFCard(_ref2) {
      var e = _ref2.uid,
        t = _ref2.rawData;
      return e && 10 === e.replace(/\s/g, "").length ? {
        type: "em410x",
        subtype: "standard",
        info: r.EM410X,
        protocol: s
      } : {
        type: "unknown_lf",
        subtype: "unknown",
        info: {
          name: "未知低频卡片",
          protocol: a,
          frequency: "lf"
        },
        protocol: a
      };
    }
  }, {
    key: "identifyNTAGByVersion",
    value: function identifyNTAGByVersion(e) {
      if (!e || e.length < 8) return r.MIFARE_ULTRALIGHT;
      var t = e[6];
      switch (e[6], t) {
        case 18:
          return r.NTAG213;
        case 62:
          return r.NTAG215;
        case 109:
          return r.NTAG216;
        case 111:
          return _objectSpread2(_objectSpread2({}, r.NTAG216), {}, {
            name: "NTAG216F"
          });
        default:
          return r.MIFARE_ULTRALIGHT;
      }
    }
  }]);
  return o;
}();exports.CardDataFormatter = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck2(this, _class);
  }
  _createClass2(_class, null, [{
    key: "formatUID",
    value: function formatUID(e) {
      var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : " ";
      var s;
      if (!e) return "";
      var a = e.toString().replace(/\s/g, "").toUpperCase();
      return (null == (s = a.match(/.{2}/g)) ? void 0 : s.join(t)) || a;
    }
  }, {
    key: "formatHexData",
    value: function formatHexData(e) {
      var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;
      var s = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : " ";
      if (!e) return "";
      var a = (Array.isArray(e) ? e : Array.from(e)).map(function (e) {
        return e.toString(16).padStart(2, "0").toUpperCase();
      }).join(s);
      if (t > 0) {
        var _e2 = [],
          _r = a.split(s);
        for (var _a2 = 0; _a2 < _r.length; _a2 += t) _e2.push(_r.slice(_a2, _a2 + t).join(s));
        return _e2.join("\n");
      }
      return a;
    }
  }, {
    key: "formatMifareClassicSector",
    value: function formatMifareClassicSector(e, t) {
      var _this = this;
      var s = [];
      if (s.push("Sector ".concat(t, ":")), e.blocks.forEach(function (a, r) {
        var o = 4 * t + r;
        var c = a;
        3 === r && e.keyA && Array.isArray(a) && 16 === a.length && (c = [].concat(_toConsumableArray2(e.keyA), _toConsumableArray2(a.slice(6))));
        var n = _this.formatHexData(c, 16, " ");
        s.push("Block ".concat(o, ": ").concat(n));
      }), e.keyB) {
        var _t2 = this.formatHexData(e.keyB, 6, " ");
        s.push("Key B: ".concat(_t2));
      }
      return s.join("\n");
    }
  }, {
    key: "formatMifareUltralightPages",
    value: function formatMifareUltralightPages(e) {
      var _this2 = this;
      var t = [];
      return e.forEach(function (e, s) {
        var a = _this2.formatHexData(e, 4, " ");
        t.push("Page ".concat(s, ": ").concat(a));
      }), t.join("\n");
    }
  }, {
    key: "calculateDataSize",
    value: function calculateDataSize(e) {
      var t = 0;
      return e.sectors ? t = 4 * e.sectors.length * 16 : e.pages ? t = 4 * e.pages.length : e.uid && (t = e.uid.replace(/\s/g, "").length / 2), t;
    }
  }, {
    key: "formatFileSize",
    value: function formatFileSize(e) {
      if (0 === e) return "0 B";
      var t = Math.floor(Math.log(e) / Math.log(1024));
      return parseFloat((e / Math.pow(1024, t)).toFixed(1)) + " " + ["B", "KB", "MB", "GB"][t];
    }
  }]);
  return _class;
}(), exports.CardDataReader = /*#__PURE__*/function () {
  function _class2(e) {
    _classCallCheck2(this, _class2);
    this.bluetoothService = e, this.isReading = !1, this.abortController = null;
  }
  _createClass2(_class2, [{
    key: "setAbortController",
    value: function setAbortController(e) {
      this.abortController = e;
    }
  }, {
    key: "checkAbort",
    value: function checkAbort() {
      if (this.abortController && this.abortController.signal.aborted) throw new Error("读取被用户中断");
    }
  }, {
    key: "readHFCardData",
    value: function () {
      var _readHFCardData = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2(e) {
        var t,
          _s2,
          _args2 = arguments;
        return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              t = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : function () {};
              this.isReading = !0;
              _context2.prev = 2;
              _s2 = o.identifyHFCard(e, this.bluetoothService);
              _context2.t0 = _s2.type;
              _context2.next = _context2.t0 === "mifare_classic" ? 7 : _context2.t0 === "mifare_ultralight" ? 10 : _context2.t0 === "ntag" ? 10 : 13;
              break;
            case 7:
              _context2.next = 9;
              return this.readMifareClassicData(e, _s2, t);
            case 9:
              return _context2.abrupt("return", _context2.sent);
            case 10:
              _context2.next = 12;
              return this.readMifareUltralightData(e, _s2, t);
            case 12:
              return _context2.abrupt("return", _context2.sent);
            case 13:
              return _context2.abrupt("return", _objectSpread2(_objectSpread2({}, e), {}, {
                type: "unknown",
                isComplete: !0,
                data: {
                  basicInfo: e
                }
              }));
            case 14:
              _context2.prev = 14;
              this.isReading = !1;
              return _context2.finish(14);
            case 17:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[2,, 14, 17]]);
      }));
      function readHFCardData(_x2) {
        return _readHFCardData.apply(this, arguments);
      }
      return readHFCardData;
    }()
  }, {
    key: "readMifareClassicData",
    value: function () {
      var _readMifareClassicData = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3(t, s, a) {
        var _this3 = this;
        var _s3, _r2, c, n, _loop, _e3;
        return _regeneratorRuntime2().wrap(function _callee3$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              a({
                message: "正在读取Mifare Classic数据...",
                percentage: 0
              });
              _context4.prev = 1;
              this.checkAbort();
              _context4.next = 5;
              return this.bluetoothService.sendCommand(e.ChameleonCommand.MF1_SUPPORT_DETECT, []);
            case 5:
              if (_context4.sent.success) {
                _context4.next = 7;
                break;
              }
              throw new Error("不是Mifare Classic卡片");
            case 7:
              a({
                message: "正在识别卡片类型...",
                percentage: 10
              });
              _context4.next = 10;
              return o.getMifareClassicTypeByHardware(this.bluetoothService);
            case 10:
              _s3 = _context4.sent;
              console.log("[CardReader] 识别到卡片类型:", _s3);
              _r2 = 16;
              "2k" === _s3 ? _r2 = 32 : "4k" === _s3 ? _r2 = 40 : "mini" === _s3 && (_r2 = 5), a({
                message: "\u68C0\u6D4B\u5230Mifare Classic ".concat(_s3.toUpperCase(), "\u5361\u7247\uFF0C\u5171").concat(_r2, "\u4E2A\u6247\u533A"),
                percentage: 15
              });
              c = {
                cardType: _s3,
                sectors: [],
                keys: {
                  keyA: [],
                  keyB: []
                },
                readableBlocks: [],
                unreadableBlocks: [],
                hasErrors: !1,
                errorMessages: []
              }, n = [[255, 255, 255, 255, 255, 255], [160, 161, 162, 163, 164, 165], [211, 247, 211, 247, 211, 247], [0, 0, 0, 0, 0, 0], [176, 177, 178, 179, 180, 181], [170, 187, 204, 221, 238, 255], [77, 58, 153, 195, 81, 221], [26, 152, 44, 126, 69, 154], [113, 76, 92, 136, 110, 151], [88, 126, 229, 249, 53, 15], [160, 71, 140, 195, 144, 145], [83, 60, 182, 199, 35, 246], [143, 208, 164, 242, 86, 233], [26, 43, 60, 77, 94, 111], [18, 52, 86, 120, 154, 188], [1, 2, 3, 4, 5, 6], [18, 52, 86, 171, 205, 239], [171, 205, 239, 18, 52, 86]];
              _loop = /*#__PURE__*/_regeneratorRuntime2().mark(function _loop(_e3) {
                var _c$readableBlocks, _c$unreadableBlocks;
                var t;
                return _regeneratorRuntime2().wrap(function _loop$(_context3) {
                  while (1) switch (_context3.prev = _context3.next) {
                    case 0:
                      _this3.checkAbort(), a({
                        message: "\u6B63\u5728\u8BFB\u53D6\u6247\u533A ".concat(_e3, "/").concat(_r2, "..."),
                        percentage: 20 + _e3 / _r2 * 60
                      });
                      _context3.next = 3;
                      return _this3.readMifareClassicSector(_e3, n);
                    case 3:
                      t = _context3.sent;
                      c.sectors.push(t);
                      t.readable ? (_c$readableBlocks = c.readableBlocks).push.apply(_c$readableBlocks, _toConsumableArray2(t.blocks.map(function (t, s) {
                        return 4 * _e3 + s;
                      }))) : ((_c$unreadableBlocks = c.unreadableBlocks).push.apply(_c$unreadableBlocks, _toConsumableArray2(Array.from({
                        length: 4
                      }, function (t, s) {
                        return 4 * _e3 + s;
                      }))), c.hasErrors = !0, c.errorMessages.push("\u6247\u533A ".concat(_e3, " \u65E0\u6CD5\u8BFB\u53D6")));
                      _context3.next = 8;
                      return new Promise(function (e) {
                        return setTimeout(e, 100);
                      });
                    case 8:
                    case "end":
                      return _context3.stop();
                  }
                }, _loop);
              });
              _e3 = 0;
            case 17:
              if (!(_e3 < _r2)) {
                _context4.next = 22;
                break;
              }
              return _context4.delegateYield(_loop(_e3), "t0", 19);
            case 19:
              _e3++;
              _context4.next = 17;
              break;
            case 22:
              return _context4.abrupt("return", (a({
                message: "数据读取完成",
                percentage: 100
              }), _objectSpread2(_objectSpread2(_objectSpread2({}, t), {}, {
                type: "mifare_classic_".concat(_s3),
                cardType: _s3,
                subtype: _s3
              }, c), {}, {
                isComplete: !c.hasErrors,
                readTime: new Date().toISOString()
              })));
            case 25:
              _context4.prev = 25;
              _context4.t1 = _context4["catch"](1);
              throw new Error("Mifare Classic\u8BFB\u53D6\u5931\u8D25: ".concat(_context4.t1.message));
            case 28:
            case "end":
              return _context4.stop();
          }
        }, _callee3, this, [[1, 25]]);
      }));
      function readMifareClassicData(_x3, _x4, _x5) {
        return _readMifareClassicData.apply(this, arguments);
      }
      return readMifareClassicData;
    }()
  }, {
    key: "readMifareClassicSector",
    value: function () {
      var _readMifareClassicSector = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4(t, s) {
        var a, _iterator, _step, _o2, _s4, _r3, c;
        return _regeneratorRuntime2().wrap(function _callee4$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              a = {
                sector: t,
                blocks: [],
                readable: !1,
                keyA: null,
                keyB: null,
                accessBits: null
              };
              _iterator = _createForOfIteratorHelper2(s);
              _context5.prev = 2;
              _iterator.s();
            case 4:
              if ((_step = _iterator.n()).done) {
                _context5.next = 29;
                break;
              }
              _o2 = _step.value;
              _context5.prev = 6;
              _context5.next = 9;
              return this.bluetoothService.sendCommand(e.ChameleonCommand.MF1_CHECK_KEY, [96, 4 * t].concat(_toConsumableArray2(_o2)), 2e3);
            case 9:
              if (!_context5.sent.success) {
                _context5.next = 22;
                break;
              }
              a.keyA = Array.from(_o2), a.readable = !0;
              _s4 = 0;
            case 12:
              if (!(_s4 < 4)) {
                _context5.next = 21;
                break;
              }
              _r3 = 4 * t + _s4;
              _context5.next = 16;
              return this.bluetoothService.sendCommand(e.ChameleonCommand.MF1_READ_BLOCK, [96, _r3].concat(_toConsumableArray2(_o2)), 2e3);
            case 16:
              c = _context5.sent;
              c.success && c.data.length >= 16 ? a.blocks.push(Array.from(c.data.slice(0, 16))) : a.blocks.push(new Array(16).fill(0));
            case 18:
              _s4++;
              _context5.next = 12;
              break;
            case 21:
              return _context5.abrupt("break", 29);
            case 22:
              _context5.next = 27;
              break;
            case 24:
              _context5.prev = 24;
              _context5.t0 = _context5["catch"](6);
              return _context5.abrupt("continue", 27);
            case 27:
              _context5.next = 4;
              break;
            case 29:
              _context5.next = 34;
              break;
            case 31:
              _context5.prev = 31;
              _context5.t1 = _context5["catch"](2);
              _iterator.e(_context5.t1);
            case 34:
              _context5.prev = 34;
              _iterator.f();
              return _context5.finish(34);
            case 37:
              return _context5.abrupt("return", (a.readable || (a.blocks = Array.from({
                length: 4
              }, function () {
                return new Array(16).fill(0);
              })), a));
            case 38:
            case "end":
              return _context5.stop();
          }
        }, _callee4, this, [[2, 31, 34, 37], [6, 24]]);
      }));
      function readMifareClassicSector(_x6, _x7) {
        return _readMifareClassicSector.apply(this, arguments);
      }
      return readMifareClassicSector;
    }()
  }, {
    key: "readMifareUltralightData",
    value: function () {
      var _readMifareUltralightData = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5(t, s, a) {
        var c, n, _t3, i, l, d, _e4, _t4, _s5, h, _t5;
        return _regeneratorRuntime2().wrap(function _callee5$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              a({
                message: "正在读取Mifare Ultralight数据...",
                percentage: 0
              });
              _context6.prev = 1;
              this.checkAbort();
              c = s.info, n = 16;
              _context6.prev = 4;
              _context6.next = 7;
              return this.bluetoothService.sendCommand(e.ChameleonCommand.MF0_GET_VERSION, [], 2e3);
            case 7:
              _t3 = _context6.sent;
              _t3.success && _t3.data.length >= 8 && (c = o.identifyNTAGByVersion(_t3.data), n = c.pages || 16, a({
                message: "\u68C0\u6D4B\u5230".concat(c.name, "\uFF0C\u5171").concat(n, "\u9875"),
                percentage: 10
              }));
              _context6.next = 14;
              break;
            case 11:
              _context6.prev = 11;
              _context6.t0 = _context6["catch"](4);
              console.warn("版本检测失败，使用默认页面数:", _context6.t0.message);
            case 14:
              i = [], l = [], d = [];
              _e4 = 0;
            case 16:
              if (!(_e4 < n)) {
                _context6.next = 33;
                break;
              }
              this.checkAbort(), a({
                message: "\u6B63\u5728\u8BFB\u53D6\u9875\u9762 ".concat(_e4, "/").concat(n, "..."),
                percentage: 10 + _e4 / n * 80
              });
              _context6.prev = 18;
              _context6.next = 21;
              return this.bluetoothService.send14ARaw([48, _e4], {
                respTimeoutMs: 100,
                autoSelect: !1,
                keepRfField: !0
              });
            case 21:
              _t4 = _context6.sent;
              if (_t4 && _t4.length >= 4) {
                _s5 = Array.from(_t4.slice(0, 4));
                i.push(_s5), l.push(_e4);
              } else i.push([0, 0, 0, 0]), d.push(_e4);
              _context6.next = 28;
              break;
            case 25:
              _context6.prev = 25;
              _context6.t1 = _context6["catch"](18);
              i.push([0, 0, 0, 0]), d.push(_e4);
            case 28:
              _context6.next = 30;
              return new Promise(function (e) {
                return setTimeout(e, 50);
              });
            case 30:
              _e4++;
              _context6.next = 16;
              break;
            case 33:
              h = "";
              _context6.prev = 34;
              _context6.next = 37;
              return this.bluetoothService.sendCommand(e.ChameleonCommand.MF0_GET_SIGNATURE, [], 2e3);
            case 37:
              _t5 = _context6.sent;
              _t5.success && _t5.data.length > 0 && (h = Array.from(_t5.data).map(function (e) {
                return e.toString(16).padStart(2, "0");
              }).join(" ").toUpperCase());
              _context6.next = 43;
              break;
            case 41:
              _context6.prev = 41;
              _context6.t2 = _context6["catch"](34);
            case 43:
              return _context6.abrupt("return", (a({
                message: "数据读取完成",
                percentage: 100
              }), _objectSpread2(_objectSpread2({}, t), {}, {
                type: c.name.toLowerCase().replace(/\s/g, "_"),
                pages: i,
                readablePages: l,
                unreadablePages: d,
                signature: h,
                version: c.name,
                isComplete: 0 === d.length,
                hasErrors: d.length > 0,
                errorMessage: d.length > 0 ? "".concat(d.length, "\u4E2A\u9875\u9762\u65E0\u6CD5\u8BFB\u53D6") : "",
                readTime: new Date().toISOString()
              })));
            case 46:
              _context6.prev = 46;
              _context6.t3 = _context6["catch"](1);
              throw new Error("Mifare Ultralight\u8BFB\u53D6\u5931\u8D25: ".concat(_context6.t3.message));
            case 49:
            case "end":
              return _context6.stop();
          }
        }, _callee5, this, [[1, 46], [4, 11], [18, 25], [34, 41]]);
      }));
      function readMifareUltralightData(_x8, _x9, _x10) {
        return _readMifareUltralightData.apply(this, arguments);
      }
      return readMifareUltralightData;
    }()
  }, {
    key: "readLFCardData",
    value: function () {
      var _readLFCardData = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee6(e) {
        var t,
          _args7 = arguments;
        return _regeneratorRuntime2().wrap(function _callee6$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              t = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : function () {};
              this.isReading = !0;
              _context7.prev = 2;
              return _context7.abrupt("return", "em410x" === o.identifyLFCard(e).type ? _objectSpread2(_objectSpread2({}, e), {}, {
                isComplete: !0,
                readTime: new Date().toISOString()
              }) : _objectSpread2(_objectSpread2({}, e), {}, {
                isComplete: !0,
                hasErrors: !0,
                errorMessage: "不支持的低频卡片类型",
                readTime: new Date().toISOString()
              }));
            case 4:
              _context7.prev = 4;
              this.isReading = !1;
              return _context7.finish(4);
            case 7:
            case "end":
              return _context7.stop();
          }
        }, _callee6, this, [[2,, 4, 7]]);
      }));
      function readLFCardData(_x11) {
        return _readLFCardData.apply(this, arguments);
      }
      return readLFCardData;
    }()
  }, {
    key: "abort",
    value: function abort() {
      this.abortController && this.abortController.abort();
    }
  }, {
    key: "isCurrentlyReading",
    get: function get() {
      return this.isReading;
    }
  }, {
    key: "checkBackdoorSupport",
    value: function () {
      var _checkBackdoorSupport = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee7() {
        var _s6, _a3, _t6;
        return _regeneratorRuntime2().wrap(function _callee7$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              console.log("[CardReader] 检测后门支持...");
              _context8.next = 4;
              return this.bluetoothService.send14ARaw([100, 0], {
                autoSelect: !0,
                checkResponseCrc: !1,
                respTimeoutMs: 1e3,
                keepRfField: !0
              });
            case 4:
              _s6 = _context8.sent;
              if (!(!_s6 || 4 !== _s6.length)) {
                _context8.next = 7;
                break;
              }
              return _context8.abrupt("return", (console.log("[CardReader] 后门检测失败: 响应长度不正确"), !1));
            case 7:
              _a3 = [163, 150, 239, 164, 226, 79];
              _context8.prev = 8;
              _context8.next = 11;
              return this.bluetoothService.sendCommand(e.ChameleonCommand.MF1_STATIC_ENCRYPTED_NESTED_ACQUIRE, [].concat(_a3, [1, 0]), 5e3);
            case 11:
              _t6 = _context8.sent;
              if (!(_t6 && _t6.success)) {
                _context8.next = 14;
                break;
              }
              return _context8.abrupt("return", (console.log("[CardReader] 检测到后门支持!"), !0));
            case 14:
              _context8.next = 19;
              break;
            case 16:
              _context8.prev = 16;
              _context8.t0 = _context8["catch"](8);
              console.log("[CardReader] 静态加密Nested获取失败:", _context8.t0.message);
            case 19:
              return _context8.abrupt("return", !1);
            case 22:
              _context8.prev = 22;
              _context8.t1 = _context8["catch"](0);
              return _context8.abrupt("return", (console.error("[CardReader] 后门检测异常:", _context8.t1), !1));
            case 25:
            case "end":
              return _context8.stop();
          }
        }, _callee7, this, [[0, 22], [8, 16]]);
      }));
      function checkBackdoorSupport() {
        return _checkBackdoorSupport.apply(this, arguments);
      }
      return checkBackdoorSupport;
    }()
  }, {
    key: "getNTLevel",
    value: function () {
      var _getNTLevel = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee8() {
        var _t7, _e5, _s7;
        return _regeneratorRuntime2().wrap(function _callee8$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              _context9.prev = 0;
              _context9.next = 3;
              return this.bluetoothService.sendCommand(e.ChameleonCommand.MF1_NT_LEVEL_DETECT, [], 3e3);
            case 3:
              _t7 = _context9.sent;
              if (!(_t7 && _t7.success && _t7.data)) {
                _context9.next = 7;
                break;
              }
              _e5 = _t7.data[0], _s7 = {
                0: "weak",
                1: "static",
                2: "hard"
              }[_e5] || "weak";
              return _context9.abrupt("return", (console.log("[CardReader] NT\u7EA7\u522B: ".concat(_s7)), _s7));
            case 7:
              return _context9.abrupt("return", "weak");
            case 10:
              _context9.prev = 10;
              _context9.t0 = _context9["catch"](0);
              return _context9.abrupt("return", (console.error("[CardReader] NT级别检测失败:", _context9.t0), "weak"));
            case 13:
            case "end":
              return _context9.stop();
          }
        }, _callee8, this, [[0, 10]]);
      }));
      function getNTLevel() {
        return _getNTLevel.apply(this, arguments);
      }
      return getNTLevel;
    }()
  }, {
    key: "backdoorAttack",
    value: function () {
      var _backdoorAttack = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee9(t, s) {
        var _r4, c, n, i, _t8, _r5, _i, _r6, _o3, _a4, _r7, l;
        return _regeneratorRuntime2().wrap(function _callee9$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              console.log("[CardReader] 开始后门攻击...");
              _context10.prev = 1;
              s && s({
                message: "检测后门支持...",
                percentage: 5,
                details: [{
                  message: "正在检测后门",
                  success: !1
                }]
              });
              _context10.next = 5;
              return o.getMifareClassicTypeByHardware(this.bluetoothService);
            case 5:
              _r4 = _context10.sent;
              c = 16;
              "2k" === _r4 ? c = 32 : "4k" === _r4 ? c = 40 : "mini" === _r4 && (c = 5), s && s({
                message: "获取后门数据...",
                percentage: 15,
                details: [{
                  message: "正在获取后门数据",
                  success: !1
                }]
              });
              _context10.next = 10;
              return this.bluetoothService.sendCommand(e.ChameleonCommand.MF1_STATIC_NESTED_ACQUIRE, [c], 3e4);
            case 10:
              n = _context10.sent;
              if (!(!n || !n.success)) {
                _context10.next = 13;
                break;
              }
              throw new Error("后门数据获取失败");
            case 13:
              console.log("[CardReader] 后门数据获取成功,开始破解密钥...");
              i = {
                keyA: {},
                keyB: {}
              };
              _t8 = 0;
            case 16:
              if (!(_t8 < c)) {
                _context10.next = 43;
                break;
              }
              this.checkAbort(), s && s({
                message: "\u540E\u95E8\u653B\u51FB\u6247\u533A ".concat(_t8, "/").concat(c, "..."),
                percentage: 15 + _t8 / c * 70,
                current: _t8,
                total: c,
                details: [{
                  message: "\u6B63\u5728\u653B\u51FB\u6247\u533A ".concat(_t8),
                  success: !1
                }]
              });
              _r5 = [[163, 150, 239, 164, 226, 79], [163, 22, 103, 168, 206, 193], [81, 139, 51, 84, 231, 96], [115, 185, 131, 108, 241, 104]];
              _i = 0, _r6 = _r5;
            case 20:
              if (!(_i < _r6.length)) {
                _context10.next = 38;
                break;
              }
              _o3 = _r6[_i];
              _context10.prev = 22;
              _a4 = 4 * _t8;
              _context10.next = 26;
              return this.bluetoothService.sendCommand(e.ChameleonCommand.MF1_CHECK_KEY, [96, _a4].concat(_toConsumableArray2(_o3)), 1e3);
            case 26:
              _r7 = _context10.sent;
              if (!(_r7 && _r7.success)) {
                _context10.next = 30;
                break;
              }
              i.keyA[_t8] = Array.from(_o3), s && s({
                details: [{
                  message: "\u6247\u533A ".concat(_t8, " Key A \u7834\u89E3\u6210\u529F(\u540E\u95E8)"),
                  success: !0
                }]
              });
              return _context10.abrupt("break", 38);
            case 30:
              _context10.next = 35;
              break;
            case 32:
              _context10.prev = 32;
              _context10.t0 = _context10["catch"](22);
              return _context10.abrupt("continue", 35);
            case 35:
              _i++;
              _context10.next = 20;
              break;
            case 38:
              _context10.next = 40;
              return new Promise(function (e) {
                return setTimeout(e, 50);
              });
            case 40:
              _t8++;
              _context10.next = 16;
              break;
            case 43:
              s && s({
                message: "后门攻击完成",
                percentage: 100
              });
              l = Object.keys(i.keyA).length;
              return _context10.abrupt("return", (console.log("[CardReader] \u540E\u95E8\u653B\u51FB\u5B8C\u6210: ".concat(l, "/").concat(c, " \u6247\u533A")), _objectSpread2(_objectSpread2({}, t), {}, {
                type: "mifare_classic_".concat(_r4),
                cardType: _r4,
                attackMethod: "backdoor",
                recoveredKeys: i,
                crackedSectors: l,
                totalSectors: c,
                successRate: (l / c * 100).toFixed(1)
              })));
            case 48:
              _context10.prev = 48;
              _context10.t1 = _context10["catch"](1);
              throw console.error("[CardReader] 后门攻击失败:", _context10.t1), _context10.t1;
            case 51:
            case "end":
              return _context10.stop();
          }
        }, _callee9, this, [[1, 48], [22, 32]]);
      }));
      function backdoorAttack(_x12, _x13) {
        return _backdoorAttack.apply(this, arguments);
      }
      return backdoorAttack;
    }()
  }, {
    key: "smartKeyRecovery",
    value: function () {
      var _smartKeyRecovery = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee10(e) {
        var t,
          s,
          _r8,
          c,
          n,
          i,
          l,
          d,
          h,
          _e6,
          _args11 = arguments;
        return _regeneratorRuntime2().wrap(function _callee10$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              t = _args11.length > 1 && _args11[1] !== undefined ? _args11[1] : [];
              s = _args11.length > 2 ? _args11[2] : undefined;
              console.log("[CardReader] 开始智能密钥恢复...");
              _context11.prev = 3;
              this.isReading = !0, s && s({
                message: "初始化密钥恢复...",
                percentage: 0,
                phase: "init",
                details: []
              });
              _context11.next = 7;
              return this.bluetoothService.isReaderDeviceMode();
            case 7:
              _context11.t0 = _context11.sent;
              if (_context11.t0) {
                _context11.next = 12;
                break;
              }
              _context11.next = 11;
              return this.bluetoothService.setReaderDeviceMode(!0);
            case 11:
              console.log("[CardReader] 已切换到读卡模式");
            case 12:
              _context11.next = 14;
              return this.bluetoothService.scan14443aTag();
            case 14:
              _r8 = _context11.sent;
              if (!(!_r8 || !_r8.success)) {
                _context11.next = 17;
                break;
              }
              throw new Error("扫描卡片失败");
            case 17:
              console.log("[CardReader] 卡片已扫描");
              _context11.next = 20;
              return this.bluetoothService.detectMf1Support();
            case 20:
              if (_context11.sent) {
                _context11.next = 22;
                break;
              }
              throw new Error("不是 Mifare Classic 卡片");
            case 22:
              console.log("[CardReader] 确认为 Mifare Classic 卡片");
              _context11.next = 25;
              return o.getMifareClassicTypeByHardware(this.bluetoothService);
            case 25:
              c = _context11.sent;
              n = 16;
              "2k" === c ? n = 32 : "4k" === c ? n = 40 : "mini" === c && (n = 5), s && s({
                message: "\u8BC6\u522B\u5230".concat(c.toUpperCase(), "\u5361\u7247"),
                percentage: 5,
                details: [{
                  message: "\u5361\u7247\u7C7B\u578B: ".concat(c),
                  success: !0
                }]
              });
              i = {
                cardType: c,
                sectors: n,
                recoveredKeys: {
                  keyA: {},
                  keyB: {}
                },
                attackMethods: [],
                phases: []
              };
              s && s({
                message: "阶段1: 字典攻击...",
                percentage: 10,
                phase: "dictionary",
                details: [{
                  message: "开始字典攻击",
                  success: !1
                }]
              });
              _context11.next = 32;
              return this.dictionaryAttackPhase(n, t, function (e) {
                s && s({
                  message: "\u5B57\u5178\u653B\u51FB: ".concat(e.current, "/").concat(e.total),
                  percentage: 10 + e.current / e.total * 25,
                  phase: "dictionary",
                  details: e.details
                });
              });
            case 32:
              l = _context11.sent;
              i.recoveredKeys = this.mergeKeys(i.recoveredKeys, l.keys), i.attackMethods.push("dictionary"), i.phases.push({
                name: "dictionary",
                success: l.foundKeys > 0,
                keysFound: l.foundKeys
              }), console.log("[CardReader] \u5B57\u5178\u653B\u51FB\u627E\u5230 ".concat(l.foundKeys, " \u4E2A\u5BC6\u94A5"));
              if (!this.checkAllKeysFound(i.recoveredKeys, n)) {
                _context11.next = 36;
                break;
              }
              return _context11.abrupt("return", (s && s({
                message: "字典攻击成功,所有密钥已找到!",
                percentage: 100,
                phase: "completed"
              }), this.buildRecoveryResult(e, i)));
            case 36:
              s && s({
                message: "阶段2: 检测后门...",
                percentage: 40,
                phase: "backdoor_detection",
                details: [{
                  message: "正在检测后门",
                  success: !1
                }]
              });
              _context11.next = 39;
              return this.checkBackdoorSupport();
            case 39:
              d = _context11.sent;
              _context11.next = 42;
              return this.getNTLevel();
            case 42:
              h = _context11.sent;
              if (!(s && s({
                details: [{
                  message: "后门支持: " + (d ? "是" : "否"),
                  success: d
                }, {
                  message: "NT\u7EA7\u522B: ".concat(h),
                  success: !0
                }]
              }), d)) {
                _context11.next = 55;
                break;
              }
              s && s({
                message: "阶段3: 后门攻击...",
                percentage: 45,
                phase: "backdoor",
                details: [{
                  message: "使用后门攻击",
                  success: !1
                }]
              });
              _context11.prev = 45;
              _context11.next = 48;
              return this.backdoorAttackPhase(n, function (e) {
                s && s({
                  message: "\u540E\u95E8\u653B\u51FB: ".concat(e.current || 0, "/").concat(e.total || n),
                  percentage: 45 + (e.current || 0) / n * 40,
                  phase: "backdoor",
                  details: e.details
                });
              });
            case 48:
              _e6 = _context11.sent;
              i.recoveredKeys = this.mergeKeys(i.recoveredKeys, _e6.keys), i.attackMethods.push("backdoor"), i.phases.push({
                name: "backdoor",
                success: _e6.foundKeys > 0,
                keysFound: _e6.foundKeys
              }), console.log("[CardReader] \u540E\u95E8\u653B\u51FB\u627E\u5230 ".concat(_e6.foundKeys, " \u4E2A\u5BC6\u94A5"));
              _context11.next = 55;
              break;
            case 52:
              _context11.prev = 52;
              _context11.t1 = _context11["catch"](45);
              console.warn("[CardReader] 后门攻击失败:", _context11.t1.message), s && s({
                details: [{
                  message: "后门攻击失败",
                  error: !0
                }]
              });
            case 55:
              if (!this.checkAllKeysFound(i.recoveredKeys, n)) {
                _context11.next = 57;
                break;
              }
              return _context11.abrupt("return", (s && s({
                message: "密钥恢复成功!",
                percentage: 100,
                phase: "completed"
              }), this.buildRecoveryResult(e, i)));
            case 57:
              return _context11.abrupt("return", (this.hasAnyKnownKey(i.recoveredKeys) && !d && (s && s({
                message: "阶段4: Nested攻击...",
                percentage: 85,
                phase: "nested",
                details: [{
                  message: "\u4F7F\u7528Nested\u653B\u51FB(".concat(h, ")"),
                  success: !1
                }]
              }), s && s({
                details: [{
                  message: "Nested攻击需要额外的算法库支持",
                  error: !0
                }]
              })), s && s({
                message: "密钥恢复完成",
                percentage: 100,
                phase: "completed"
              }), this.buildRecoveryResult(e, i)));
            case 60:
              _context11.prev = 60;
              _context11.t2 = _context11["catch"](3);
              throw console.error("[CardReader] 智能密钥恢复失败:", _context11.t2), _context11.t2;
            case 63:
              _context11.prev = 63;
              this.isReading = !1;
              return _context11.finish(63);
            case 66:
            case "end":
              return _context11.stop();
          }
        }, _callee10, this, [[3, 60, 63, 66], [45, 52]]);
      }));
      function smartKeyRecovery(_x14) {
        return _smartKeyRecovery.apply(this, arguments);
      }
      return smartKeyRecovery;
    }()
  }, {
    key: "dictionaryAttackPhase",
    value: function () {
      var _dictionaryAttackPhase = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee11(t, s, a) {
        var r, o, c, i, _iterator2, _step2, _t9, _s8, _c, _e7, _iterator3, _step3, _t10, _s9, _c2, _e8;
        return _regeneratorRuntime2().wrap(function _callee11$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              r = {
                keyA: {},
                keyB: {}
              };
              o = 0;
              c = [[255, 255, 255, 255, 255, 255], [160, 161, 162, 163, 164, 165], [211, 247, 211, 247, 211, 247], [0, 0, 0, 0, 0, 0], [176, 177, 178, 179, 180, 181], [170, 187, 204, 221, 238, 255], [77, 58, 153, 195, 81, 221], [26, 152, 44, 126, 69, 154], [163, 150, 239, 164, 226, 79], [163, 22, 103, 168, 206, 193], [81, 139, 51, 84, 231, 96], [115, 185, 131, 108, 241, 104]].concat(_toConsumableArray2(s.map(function (e) {
                var t = e.replace(/\s/g, ""),
                  s = [];
                for (var _a5 = 0; _a5 < t.length; _a5 += 2) s.push(parseInt(t.substr(_a5, 2), 16));
                return s;
              })));
              i = 0;
            case 4:
              if (!(i < t)) {
                _context12.next = 71;
                break;
              }
              this.checkAbort(), a && a({
                current: i,
                total: t,
                details: [{
                  message: "\u68C0\u67E5\u6247\u533A ".concat(i),
                  success: !1
                }]
              });
              _iterator2 = _createForOfIteratorHelper2(c);
              _context12.prev = 7;
              _iterator2.s();
            case 9:
              if ((_step2 = _iterator2.n()).done) {
                _context12.next = 28;
                break;
              }
              _t9 = _step2.value;
              _context12.prev = 11;
              _s8 = 4 * i;
              _context12.next = 15;
              return this.bluetoothService.sendCommand(e.ChameleonCommand.MF1_CHECK_KEY, [96, _s8].concat(_toConsumableArray2(_t9)), 800);
            case 15:
              _c = _context12.sent;
              if (!(_c && _c.success)) {
                _context12.next = 21;
                break;
              }
              r.keyA[i] = Array.from(_t9), o++;
              _e7 = _t9.map(function (e) {
                return e.toString(16).padStart(2, "0");
              }).join("").toUpperCase();
              a && a({
                details: [{
                  message: "\u6247\u533A ".concat(i, " Key A: ").concat(_e7),
                  success: !0
                }]
              });
              return _context12.abrupt("break", 28);
            case 21:
              _context12.next = 26;
              break;
            case 23:
              _context12.prev = 23;
              _context12.t0 = _context12["catch"](11);
              return _context12.abrupt("continue", 26);
            case 26:
              _context12.next = 9;
              break;
            case 28:
              _context12.next = 33;
              break;
            case 30:
              _context12.prev = 30;
              _context12.t1 = _context12["catch"](7);
              _iterator2.e(_context12.t1);
            case 33:
              _context12.prev = 33;
              _iterator2.f();
              return _context12.finish(33);
            case 36:
              _iterator3 = _createForOfIteratorHelper2(c);
              _context12.prev = 37;
              _iterator3.s();
            case 39:
              if ((_step3 = _iterator3.n()).done) {
                _context12.next = 58;
                break;
              }
              _t10 = _step3.value;
              _context12.prev = 41;
              _s9 = 4 * i;
              _context12.next = 45;
              return this.bluetoothService.sendCommand(e.ChameleonCommand.MF1_CHECK_KEY, [97, _s9].concat(_toConsumableArray2(_t10)), 800);
            case 45:
              _c2 = _context12.sent;
              if (!(_c2 && _c2.success)) {
                _context12.next = 51;
                break;
              }
              r.keyB[i] = Array.from(_t10), o++;
              _e8 = _t10.map(function (e) {
                return e.toString(16).padStart(2, "0");
              }).join("").toUpperCase();
              a && a({
                details: [{
                  message: "\u6247\u533A ".concat(i, " Key B: ").concat(_e8),
                  success: !0
                }]
              });
              return _context12.abrupt("break", 58);
            case 51:
              _context12.next = 56;
              break;
            case 53:
              _context12.prev = 53;
              _context12.t2 = _context12["catch"](41);
              return _context12.abrupt("continue", 56);
            case 56:
              _context12.next = 39;
              break;
            case 58:
              _context12.next = 63;
              break;
            case 60:
              _context12.prev = 60;
              _context12.t3 = _context12["catch"](37);
              _iterator3.e(_context12.t3);
            case 63:
              _context12.prev = 63;
              _iterator3.f();
              return _context12.finish(63);
            case 66:
              _context12.next = 68;
              return new Promise(function (e) {
                return setTimeout(e, 30);
              });
            case 68:
              i++;
              _context12.next = 4;
              break;
            case 71:
              return _context12.abrupt("return", {
                keys: r,
                foundKeys: o
              });
            case 72:
            case "end":
              return _context12.stop();
          }
        }, _callee11, this, [[7, 30, 33, 36], [11, 23], [37, 60, 63, 66], [41, 53]]);
      }));
      function dictionaryAttackPhase(_x15, _x16, _x17) {
        return _dictionaryAttackPhase.apply(this, arguments);
      }
      return dictionaryAttackPhase;
    }()
  }, {
    key: "backdoorAttackPhase",
    value: function () {
      var _backdoorAttackPhase = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee12(t, s) {
        var a, r, o, n, _iterator4, _step4, _t11, _o4, c, _e9;
        return _regeneratorRuntime2().wrap(function _callee12$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              a = {
                keyA: {},
                keyB: {}
              };
              r = 0;
              o = [[163, 150, 239, 164, 226, 79], [163, 22, 103, 168, 206, 193], [81, 139, 51, 84, 231, 96], [115, 185, 131, 108, 241, 104]];
              n = 0;
            case 4:
              if (!(n < t)) {
                _context13.next = 41;
                break;
              }
              this.checkAbort(), s && s({
                current: n,
                total: t,
                details: [{
                  message: "\u540E\u95E8\u653B\u51FB\u6247\u533A ".concat(n),
                  success: !1
                }]
              });
              _iterator4 = _createForOfIteratorHelper2(o);
              _context13.prev = 7;
              _iterator4.s();
            case 9:
              if ((_step4 = _iterator4.n()).done) {
                _context13.next = 28;
                break;
              }
              _t11 = _step4.value;
              _context13.prev = 11;
              _o4 = 4 * n;
              _context13.next = 15;
              return this.bluetoothService.sendCommand(e.ChameleonCommand.MF1_CHECK_KEY, [96, _o4].concat(_toConsumableArray2(_t11)), 1e3);
            case 15:
              c = _context13.sent;
              if (!(c && c.success)) {
                _context13.next = 21;
                break;
              }
              a.keyA[n] = Array.from(_t11), a.keyB[n] = Array.from(_t11), r += 2;
              _e9 = _t11.map(function (e) {
                return e.toString(16).padStart(2, "0");
              }).join("").toUpperCase();
              s && s({
                details: [{
                  message: "\u6247\u533A ".concat(n, " \u540E\u95E8\u5BC6\u94A5: ").concat(_e9),
                  success: !0
                }]
              });
              return _context13.abrupt("break", 28);
            case 21:
              _context13.next = 26;
              break;
            case 23:
              _context13.prev = 23;
              _context13.t0 = _context13["catch"](11);
              return _context13.abrupt("continue", 26);
            case 26:
              _context13.next = 9;
              break;
            case 28:
              _context13.next = 33;
              break;
            case 30:
              _context13.prev = 30;
              _context13.t1 = _context13["catch"](7);
              _iterator4.e(_context13.t1);
            case 33:
              _context13.prev = 33;
              _iterator4.f();
              return _context13.finish(33);
            case 36:
              _context13.next = 38;
              return new Promise(function (e) {
                return setTimeout(e, 50);
              });
            case 38:
              n++;
              _context13.next = 4;
              break;
            case 41:
              return _context13.abrupt("return", {
                keys: a,
                foundKeys: r
              });
            case 42:
            case "end":
              return _context13.stop();
          }
        }, _callee12, this, [[7, 30, 33, 36], [11, 23]]);
      }));
      function backdoorAttackPhase(_x18, _x19) {
        return _backdoorAttackPhase.apply(this, arguments);
      }
      return backdoorAttackPhase;
    }()
  }, {
    key: "mergeKeys",
    value: function mergeKeys(e, t) {
      var s = _objectSpread2({}, e);
      return Object.keys(t.keyA || {}).forEach(function (e) {
        s.keyA[e] || (s.keyA[e] = t.keyA[e]);
      }), Object.keys(t.keyB || {}).forEach(function (e) {
        s.keyB[e] || (s.keyB[e] = t.keyB[e]);
      }), s;
    }
  }, {
    key: "checkAllKeysFound",
    value: function checkAllKeysFound(e, t) {
      for (var _s10 = 0; _s10 < t; _s10++) if (!e.keyA[_s10] || !e.keyB[_s10]) return !1;
      return !0;
    }
  }, {
    key: "hasAnyKnownKey",
    value: function hasAnyKnownKey(e) {
      return Object.keys(e.keyA).length > 0 || Object.keys(e.keyB).length > 0;
    }
  }, {
    key: "buildRecoveryResult",
    value: function buildRecoveryResult(e, t) {
      var s = 2 * t.sectors,
        a = Object.keys(t.recoveredKeys.keyA).length + Object.keys(t.recoveredKeys.keyB).length,
        r = (a / s * 100).toFixed(1);
      return _objectSpread2(_objectSpread2({}, e), {}, {
        type: "mifare_classic_".concat(t.cardType),
        cardType: t.cardType,
        recoveredKeys: t.recoveredKeys,
        attackMethods: t.attackMethods,
        phases: t.phases,
        totalSectors: t.sectors,
        totalKeys: s,
        foundKeys: a,
        successRate: r,
        isComplete: a === s,
        hasErrors: a < s,
        readTime: new Date().toISOString()
      });
    }
  }, {
    key: "dictionaryAttack",
    value: function () {
      var _dictionaryAttack = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee13(t) {
        var s,
          a,
          c,
          n,
          i,
          l,
          d,
          h,
          u,
          m,
          _t12,
          _s11,
          _o5,
          _c3,
          _iterator5,
          _step5,
          _n,
          _c4,
          _c5,
          _a7,
          _o6,
          _t13,
          _r9,
          _e10,
          y,
          g,
          p,
          _args14 = arguments;
        return _regeneratorRuntime2().wrap(function _callee13$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              s = _args14.length > 1 && _args14[1] !== undefined ? _args14[1] : [];
              a = _args14.length > 2 ? _args14[2] : undefined;
              console.log("[CardReader] 开始密钥字典攻击...");
              _context14.prev = 3;
              this.isReading = !0;
              _context14.next = 7;
              return o.getMifareClassicTypeByHardware(this.bluetoothService);
            case 7:
              c = _context14.sent;
              n = 16;
              "2k" === c ? n = 32 : "4k" === c ? n = 40 : "mini" === c && (n = 5);
              i = {
                keyA: {},
                keyB: {}
              }, l = {
                sectors: []
              }, d = {
                current: 0,
                total: n,
                message: "\u6B63\u5728\u653B\u51FB".concat(c.toUpperCase(), "\u5361\u7247..."),
                details: []
              };
              a && a(d);
              h = [[255, 255, 255, 255, 255, 255], [160, 161, 162, 163, 164, 165], [211, 247, 211, 247, 211, 247], [75, 121, 27, 234, 123, 204], [92, 143, 249, 153, 13, 162], [208, 26, 254, 235, 137, 10], [117, 204, 181, 156, 155, 237], [0, 0, 0, 0, 0, 0], [176, 177, 178, 179, 180, 181], [170, 187, 204, 221, 238, 255], [77, 58, 153, 195, 81, 221], [26, 152, 44, 126, 69, 154], [113, 76, 92, 136, 110, 151], [88, 126, 229, 249, 53, 15], [160, 71, 140, 195, 144, 145], [83, 60, 182, 199, 35, 246], [143, 208, 164, 242, 86, 233], [26, 43, 60, 77, 94, 111], [18, 52, 86, 120, 154, 188], [1, 2, 3, 4, 5, 6], [18, 52, 86, 171, 205, 239], [171, 205, 239, 18, 52, 86], [72, 73, 68, 32, 73, 83], [32, 71, 82, 69, 65, 84], [100, 113, 165, 239, 45, 26], [239, 18, 50, 171, 24, 160], [183, 191, 12, 19, 6, 110]], u = s.map(function (e) {
                var t = e.replace(/\s/g, ""),
                  s = [];
                for (var _a6 = 0; _a6 < t.length; _a6 += 2) s.push(parseInt(t.substr(_a6, 2), 16));
                return s;
              }), m = [].concat(h, _toConsumableArray2(u));
              console.log("[CardReader] \u603B\u5171\u4F7F\u7528 ".concat(m.length, " \u4E2A\u5BC6\u94A5\u8FDB\u884C\u653B\u51FB")), d.details.push({
                message: "\u4F7F\u7528 ".concat(m.length, " \u4E2A\u5BC6\u94A5"),
                success: !0
              }), a && a(d);
              _t12 = 0;
            case 15:
              if (!(_t12 < n)) {
                _context14.next = 85;
                break;
              }
              this.checkAbort(), d.current = _t12, d.message = "\u6B63\u5728\u653B\u51FB\u6247\u533A ".concat(_t12, "/").concat(n, "..."), a && a(d);
              _s11 = {
                sector: _t12,
                blocks: [],
                readable: !1,
                keyA: null,
                keyB: null
              };
              _o5 = !1, _c3 = !1;
              _iterator5 = _createForOfIteratorHelper2(m);
              _context14.prev = 20;
              _iterator5.s();
            case 22:
              if ((_step5 = _iterator5.n()).done) {
                _context14.next = 70;
                break;
              }
              _n = _step5.value;
              if (!(this.checkAbort(), !_o5)) {
                _context14.next = 53;
                break;
              }
              _context14.prev = 25;
              _c4 = 4 * _t12;
              _context14.next = 29;
              return this.bluetoothService.sendCommand(e.ChameleonCommand.MF1_CHECK_KEY, [96, _c4].concat(_toConsumableArray2(_n)), 1e3);
            case 29:
              if (!_context14.sent.success) {
                _context14.next = 49;
                break;
              }
              i.keyA[_t12] = Array.from(_n), _s11.keyA = Array.from(_n), _o5 = !0;
              _c5 = _n.map(function (e) {
                return e.toString(16).padStart(2, "0");
              }).join("").toUpperCase();
              console.log("[CardReader] \u6247\u533A ".concat(_t12, " Key A \u7834\u89E3\u6210\u529F: ").concat(_c5)), d.details.push({
                message: "\u6247\u533A ".concat(_t12, " Key A: ").concat(_c5),
                success: !0
              }), a && a(d), _s11.readable = !0;
              _a7 = 0;
            case 34:
              if (!(_a7 < 4)) {
                _context14.next = 49;
                break;
              }
              _o6 = 4 * _t12 + _a7;
              _context14.prev = 36;
              _context14.next = 39;
              return this.bluetoothService.sendCommand(e.ChameleonCommand.MF1_READ_BLOCK, [96, _o6].concat(_toConsumableArray2(_n)), 1e3);
            case 39:
              _t13 = _context14.sent;
              _t13.success && _t13.data && _t13.data.length >= 16 ? _s11.blocks.push(Array.from(_t13.data.slice(0, 16))) : _s11.blocks.push(new Array(16).fill(0));
              _context14.next = 46;
              break;
            case 43:
              _context14.prev = 43;
              _context14.t0 = _context14["catch"](36);
              _s11.blocks.push(new Array(16).fill(0));
            case 46:
              _a7++;
              _context14.next = 34;
              break;
            case 49:
              _context14.next = 53;
              break;
            case 51:
              _context14.prev = 51;
              _context14.t1 = _context14["catch"](25);
            case 53:
              if (_c3) {
                _context14.next = 66;
                break;
              }
              _context14.prev = 54;
              _r9 = 4 * _t12;
              _context14.next = 58;
              return this.bluetoothService.sendCommand(e.ChameleonCommand.MF1_CHECK_KEY, [97, _r9].concat(_toConsumableArray2(_n)), 1e3);
            case 58:
              if (!_context14.sent.success) {
                _context14.next = 62;
                break;
              }
              i.keyB[_t12] = Array.from(_n), _s11.keyB = Array.from(_n), _c3 = !0;
              _e10 = _n.map(function (e) {
                return e.toString(16).padStart(2, "0");
              }).join("").toUpperCase();
              console.log("[CardReader] \u6247\u533A ".concat(_t12, " Key B \u7834\u89E3\u6210\u529F: ").concat(_e10)), d.details.push({
                message: "\u6247\u533A ".concat(_t12, " Key B: ").concat(_e10),
                success: !0
              }), a && a(d);
            case 62:
              _context14.next = 66;
              break;
            case 64:
              _context14.prev = 64;
              _context14.t2 = _context14["catch"](54);
            case 66:
              if (!(_o5 && _c3)) {
                _context14.next = 68;
                break;
              }
              return _context14.abrupt("break", 70);
            case 68:
              _context14.next = 22;
              break;
            case 70:
              _context14.next = 75;
              break;
            case 72:
              _context14.prev = 72;
              _context14.t3 = _context14["catch"](20);
              _iterator5.e(_context14.t3);
            case 75:
              _context14.prev = 75;
              _iterator5.f();
              return _context14.finish(75);
            case 78:
              _s11.readable || (_s11.blocks = Array.from({
                length: 4
              }, function () {
                return new Array(16).fill(0);
              }), d.details.push({
                message: "\u6247\u533A ".concat(_t12, " \u5BC6\u94A5\u672A\u627E\u5230"),
                error: !0
              }));
              l.sectors.push(_s11);
              _context14.next = 82;
              return new Promise(function (e) {
                return setTimeout(e, 50);
              });
            case 82:
              _t12++;
              _context14.next = 15;
              break;
            case 85:
              d.current = d.total, d.message = "密钥字典攻击完成", d.percentage = 100, a && a(d);
              y = n, g = l.sectors.filter(function (e) {
                return e.readable;
              }).length, p = (g / y * 100).toFixed(1);
              return _context14.abrupt("return", (console.log("[CardReader] \u653B\u51FB\u5B8C\u6210: ".concat(g, "/").concat(y, " \u6247\u533A\u7834\u89E3\u6210\u529F (").concat(p, "%)")), _objectSpread2(_objectSpread2({}, t), {}, {
                type: "mifare_classic_".concat(c),
                cardType: c,
                subtype: c,
                recoveredKeys: i,
                sectors: l.sectors,
                crackedSectors: g,
                totalSectors: y,
                successRate: p,
                isComplete: g === y,
                hasErrors: g < y,
                readTime: new Date().toISOString()
              })));
            case 90:
              _context14.prev = 90;
              _context14.t4 = _context14["catch"](3);
              throw console.error("[CardReader] 密钥恢复失败", _context14.t4), _context14.t4;
            case 93:
              _context14.prev = 93;
              this.isReading = !1;
              return _context14.finish(93);
            case 96:
            case "end":
              return _context14.stop();
          }
        }, _callee13, this, [[3, 90, 93, 96], [20, 72, 75, 78], [25, 51], [36, 43], [54, 64]]);
      }));
      function dictionaryAttack(_x20) {
        return _dictionaryAttack.apply(this, arguments);
      }
      return dictionaryAttack;
    }()
  }, {
    key: "performNestedAttack",
    value: function () {
      var _performNestedAttack = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee14(t) {
        var _s12;
        return _regeneratorRuntime2().wrap(function _callee14$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              console.log("[CardReader] \u5BF9\u6247\u533A ".concat(t, " \u6267\u884C\u5D4C\u5957\u653B\u51FB..."));
              _context15.prev = 1;
              _context15.next = 4;
              return this.bluetoothService.sendCommand(e.ChameleonCommand.MF_NESTED_ATTACK, {
                sector: t,
                iterations: 100,
                timeout: 3e4
              });
            case 4:
              _s12 = _context15.sent;
              return _context15.abrupt("return", _s12.success && _s12.keys ? {
                keyA: _s12.keys.keyA,
                keyB: _s12.keys.keyB
              } : {});
            case 8:
              _context15.prev = 8;
              _context15.t0 = _context15["catch"](1);
              return _context15.abrupt("return", (console.error("[CardReader] \u6247\u533A ".concat(t, " \u5D4C\u5957\u653B\u51FB\u5931\u8D25"), _context15.t0), {}));
            case 11:
            case "end":
              return _context15.stop();
          }
        }, _callee14, this, [[1, 8]]);
      }));
      function performNestedAttack(_x21) {
        return _performNestedAttack.apply(this, arguments);
      }
      return performNestedAttack;
    }()
  }, {
    key: "advancedHFDetection",
    value: function () {
      var _advancedHFDetection = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee15(t) {
        var _this4 = this;
        var _a8, _r10, _o7, _loop2, _e11;
        return _regeneratorRuntime2().wrap(function _callee15$(_context17) {
          while (1) switch (_context17.prev = _context17.next) {
            case 0:
              console.log("[CardReader] 开始高级HF卡片检测...");
              _context17.prev = 1;
              this.isReading = !0;
              _a8 = [], _r10 = [{
                name: "ISO14443A",
                command: e.ChameleonCommand.HF_14A_SCAN
              }, {
                name: "ISO14443B",
                command: e.ChameleonCommand.HF_14B_SCAN
              }, {
                name: "ISO15693",
                command: e.ChameleonCommand.HF_15693_SCAN
              }], _o7 = {
                current: 0,
                total: _r10.length,
                message: "检测协议..."
              };
              _loop2 = /*#__PURE__*/_regeneratorRuntime2().mark(function _loop2() {
                var c, _e12;
                return _regeneratorRuntime2().wrap(function _loop2$(_context16) {
                  while (1) switch (_context16.prev = _context16.next) {
                    case 0:
                      _this4.checkAbort();
                      c = _r10[_e11];
                      _o7.current = _e11, _o7.message = "\u6B63\u5728\u68C0\u6D4B ".concat(c.name, " \u534F\u8BAE..."), t && t(_o7);
                      _context16.prev = 3;
                      _context16.next = 6;
                      return _this4.bluetoothService.sendCommand(c.command, {
                        timeout: 5e3,
                        continuous: !1
                      });
                    case 6:
                      _e12 = _context16.sent;
                      _e12.success && _e12.cards && _e12.cards.forEach(function (e) {
                        e.protocol = c.name, e.detectedAt = Date.now(), _a8.push(e);
                      });
                      _context16.next = 13;
                      break;
                    case 10:
                      _context16.prev = 10;
                      _context16.t0 = _context16["catch"](3);
                      console.warn("[CardReader] ".concat(c.name, " \u68C0\u6D4B\u5931\u8D25"), _context16.t0);
                    case 13:
                      _context16.next = 15;
                      return new Promise(function (e) {
                        return setTimeout(e, 200);
                      });
                    case 15:
                    case "end":
                      return _context16.stop();
                  }
                }, _loop2, null, [[3, 10]]);
              });
              _e11 = 0;
            case 6:
              if (!(_e11 < _r10.length)) {
                _context17.next = 11;
                break;
              }
              return _context17.delegateYield(_loop2(), "t0", 8);
            case 8:
              _e11++;
              _context17.next = 6;
              break;
            case 11:
              return _context17.abrupt("return", (_o7.current = _o7.total, _o7.message = "\u68C0\u6D4B\u5B8C\u6210\uFF0C\u53D1\u73B0 ".concat(_a8.length, " \u5F20\u5361\u7247"), t && t(_o7), _a8));
            case 14:
              _context17.prev = 14;
              _context17.t1 = _context17["catch"](1);
              throw console.error("[CardReader] 高级HF检测失败", _context17.t1), _context17.t1;
            case 17:
              _context17.prev = 17;
              this.isReading = !1;
              return _context17.finish(17);
            case 20:
            case "end":
              return _context17.stop();
          }
        }, _callee15, this, [[1, 14, 17, 20]]);
      }));
      function advancedHFDetection(_x22) {
        return _advancedHFDetection.apply(this, arguments);
      }
      return advancedHFDetection;
    }()
  }, {
    key: "advancedLFDetection",
    value: function () {
      var _advancedLFDetection = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee16(t) {
        var _a9, _r11, _o8, c, _i2, _r12, n, _iterator6, _step6, _r13, _t14;
        return _regeneratorRuntime2().wrap(function _callee16$(_context18) {
          while (1) switch (_context18.prev = _context18.next) {
            case 0:
              console.log("[CardReader] 开始高级LF卡片检测...");
              _context18.prev = 1;
              this.isReading = !0;
              _a9 = [], _r11 = [125, 134], _o8 = ["EM410X", "T55XX", "HITAG"], c = {
                current: 0,
                total: _r11.length * _o8.length,
                message: "检测低频卡片..."
              };
              _i2 = 0, _r12 = _r11;
            case 5:
              if (!(_i2 < _r12.length)) {
                _context18.next = 38;
                break;
              }
              n = _r12[_i2];
              _iterator6 = _createForOfIteratorHelper2(_o8);
              _context18.prev = 8;
              _iterator6.s();
            case 10:
              if ((_step6 = _iterator6.n()).done) {
                _context18.next = 27;
                break;
              }
              _r13 = _step6.value;
              this.checkAbort(), c.current++, c.message = "\u6B63\u5728\u68C0\u6D4B ".concat(n, "kHz ").concat(_r13, " \u534F\u8BAE..."), t && t(c);
              _context18.prev = 13;
              _context18.next = 16;
              return this.bluetoothService.sendCommand(e.ChameleonCommand.LF_SEARCH, {
                frequency: n,
                protocol: _r13,
                timeout: 3e3
              });
            case 16:
              _t14 = _context18.sent;
              _t14.success && _t14.card && (_t14.card.frequency = n, _t14.card.protocol = _r13, _t14.card.detectedAt = Date.now(), _a9.push(_t14.card));
              _context18.next = 23;
              break;
            case 20:
              _context18.prev = 20;
              _context18.t0 = _context18["catch"](13);
              console.warn("[CardReader] ".concat(n, "kHz ").concat(_r13, " \u68C0\u6D4B\u5931\u8D25"), _context18.t0);
            case 23:
              _context18.next = 25;
              return new Promise(function (e) {
                return setTimeout(e, 100);
              });
            case 25:
              _context18.next = 10;
              break;
            case 27:
              _context18.next = 32;
              break;
            case 29:
              _context18.prev = 29;
              _context18.t1 = _context18["catch"](8);
              _iterator6.e(_context18.t1);
            case 32:
              _context18.prev = 32;
              _iterator6.f();
              return _context18.finish(32);
            case 35:
              _i2++;
              _context18.next = 5;
              break;
            case 38:
              return _context18.abrupt("return", (c.current = c.total, c.message = "\u68C0\u6D4B\u5B8C\u6210\uFF0C\u53D1\u73B0 ".concat(_a9.length, " \u5F20\u5361\u7247"), t && t(c), _a9));
            case 41:
              _context18.prev = 41;
              _context18.t2 = _context18["catch"](1);
              throw console.error("[CardReader] 高级LF检测失败", _context18.t2), _context18.t2;
            case 44:
              _context18.prev = 44;
              this.isReading = !1;
              return _context18.finish(44);
            case 47:
            case "end":
              return _context18.stop();
          }
        }, _callee16, this, [[1, 41, 44, 47], [8, 29, 32, 35], [13, 20]]);
      }));
      function advancedLFDetection(_x23) {
        return _advancedLFDetection.apply(this, arguments);
      }
      return advancedLFDetection;
    }()
  }, {
    key: "validateDataIntegrity",
    value: function validateDataIntegrity(e) {
      var t, s, a, o;
      var c = [],
        n = [];
      if ("mifare_classic" === e.type) {
        var _a10 = "1k" === e.subtype ? 16 : 40;
        (!e.sectors || e.sectors.length < _a10) && c.push("\u7F3A\u5C11\u6247\u533A\u6570\u636E\uFF0C\u671F\u671B ".concat(_a10, " \u4E2A\u6247\u533A\uFF0C\u5B9E\u9645 ").concat((null == (t = e.sectors) ? void 0 : t.length) || 0, " \u4E2A")), null == (s = e.sectors) || s.forEach(function (e, t) {
          e.accessBits || n.push("\u6247\u533A ".concat(t, " \u7F3A\u5C11\u8BBF\u95EE\u6743\u9650\u4FE1\u606F")), e.keyA || e.keyB || n.push("\u6247\u533A ".concat(t, " \u7F3A\u5C11\u5BC6\u94A5\u4FE1\u606F"));
        });
      } else if ("mifare_ultralight" === e.type || e.type.includes("ntag")) {
        var _t15 = (r[null == (a = e.subtype) ? void 0 : a.toUpperCase()] || r.MIFARE_ULTRALIGHT).pages;
        if ((!e.pages || e.pages.length < _t15) && c.push("\u7F3A\u5C11\u9875\u9762\u6570\u636E\uFF0C\u671F\u671B ".concat(_t15, " \u9875\uFF0C\u5B9E\u9645 ").concat((null == (o = e.pages) ? void 0 : o.length) || 0, " \u9875")), e.pages && e.pages.length > 3) {
          var _t16 = e.pages[3];
          _t16 && !_t16.every(function (e) {
            return 0 === e;
          }) || n.push("配置页面可能为空或未正确读取");
        }
      }
      return {
        isComplete: 0 === c.length,
        hasWarnings: n.length > 0,
        issues: c,
        warnings: n,
        score: Math.max(0, 100 - 30 * c.length - 10 * n.length)
      };
    }
  }]);
  return _class2;
}();