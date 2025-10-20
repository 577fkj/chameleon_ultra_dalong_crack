var _regeneratorRuntime2 = require("../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../@babel/runtime/helpers/asyncToGenerator");var _toConsumableArray2 = require("../@babel/runtime/helpers/toConsumableArray");var _classCallCheck2 = require("../@babel/runtime/helpers/classCallCheck");var _createClass2 = require("../@babel/runtime/helpers/createClass");var _typeof2 = require("../@babel/runtime/helpers/typeof");var t = Object.defineProperty,
  e = function e(_e, o, r) {
    return function (e, o, r) {
      o in e ? t(e, o, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: r
      }) : e[o] = r;
    }(_e, "symbol" != _typeof2(o) ? o + "" : o, r), r;
  };var o = {
    CREATE_OBJECT: 1,
    SET_PRN: 2,
    CALC_CHECKSUM: 3,
    EXECUTE: 4,
    READ_ERROR: 5,
    READ_OBJECT: 6,
    GET_SERIAL_MTU: 7,
    WRITE_OBJECT: 8,
    PING: 9,
    GET_HW: 10,
    RESPONSE: 96
  },
  r = 1,
  n = 11,
  s = function () {
    var t = new Uint32Array(256);
    for (var _e2 = 0; _e2 < 256; _e2++) {
      var _o = _e2;
      for (var _t = 0; _t < 8; _t++) 0 != (1 & _o) ? _o = 3988292384 ^ _o >>> 1 : _o >>>= 1;
      t[_e2] = _o >>> 0;
    }
    return t;
  }();function i(t) {
  var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  e = ~e >>> 0;
  for (var _o2 = 0; _o2 < t.length; _o2++) e = e >>> 8 ^ s[255 & (e ^ t[_o2])];
  return ~e >>> 0;
}var c = /*#__PURE__*/function () {
  function c() {
    _classCallCheck2(this, c);
  }
  _createClass2(c, null, [{
    key: "encode",
    value: function encode(t) {
      var e = [];
      for (var _o3 = 0; _o3 < t.length; _o3++) {
        var _r = t[_o3];
        _r === this.SLIP_BYTE_END ? (e.push(this.SLIP_BYTE_ESC), e.push(this.SLIP_BYTE_ESC_END)) : _r === this.SLIP_BYTE_ESC ? (e.push(this.SLIP_BYTE_ESC), e.push(this.SLIP_BYTE_ESC_ESC)) : e.push(_r);
      }
      return e.push(this.SLIP_BYTE_END), new Uint8Array(e);
    }
  }, {
    key: "decode",
    value: function decode(t) {
      var e = !1,
        o = this.SLIP_STATE_DECODING;
      var r = [];
      for (var _n = 0; _n < t.length; _n++) {
        var _s = t[_n],
          _i = this.decodeAddByte(_s, r, o);
        if (e = _i.finished, o = _i.state, e) break;
      }
      return new Uint8Array(r);
    }
  }, {
    key: "decodeAddByte",
    value: function decodeAddByte(t, e, o) {
      var r = !1;
      var n = _toConsumableArray2(e);
      return o === this.SLIP_STATE_DECODING ? t === this.SLIP_BYTE_END ? r = !0 : t === this.SLIP_BYTE_ESC ? o = this.SLIP_STATE_ESC_RECEIVED : n.push(t) : o === this.SLIP_STATE_ESC_RECEIVED ? t === this.SLIP_BYTE_ESC_END ? (n.push(this.SLIP_BYTE_END), o = this.SLIP_STATE_DECODING) : t === this.SLIP_BYTE_ESC_ESC ? (n.push(this.SLIP_BYTE_ESC), o = this.SLIP_STATE_DECODING) : o = this.SLIP_STATE_CLEARING_INVALID_PACKET : o === this.SLIP_STATE_CLEARING_INVALID_PACKET && t === this.SLIP_BYTE_END && (o = this.SLIP_STATE_DECODING, n.length = 0), {
        finished: r,
        state: o,
        decoded: n
      };
    }
  }]);
  return c;
}();e(c, "SLIP_BYTE_END", 192), e(c, "SLIP_BYTE_ESC", 219), e(c, "SLIP_BYTE_ESC_END", 220), e(c, "SLIP_BYTE_ESC_ESC", 221), e(c, "SLIP_STATE_DECODING", 1), e(c, "SLIP_STATE_ESC_RECEIVED", 2), e(c, "SLIP_STATE_CLEARING_INVALID_PACKET", 3);exports.DFUCommunicator = /*#__PURE__*/function () {
  function _class(t) {
    _classCallCheck2(this, _class);
    this.bluetoothService = t, this.isBLE = !0, this.mtu = 0, this.prn = 0;
  }
  _createClass2(_class, [{
    key: "sendCmd",
    value: function () {
      var _sendCmd = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee(t) {
        var _this = this;
        var e,
          s,
          i,
          l,
          a,
          h,
          E,
          S,
          f,
          C,
          g,
          D,
          _,
          U,
          _t2,
          _args = arguments;
        return _regeneratorRuntime2().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              e = _args.length > 1 && _args[1] !== undefined ? _args[1] : new Uint8Array(0);
              f = new Uint8Array([t].concat(_toConsumableArray2(e)));
              C = f;
              this.isBLE || (C = c.encode(f)), console.log("[DFU] 发送命令:", this.arrayToHexString(C), "原始命令值:", t.toString(16));
              g = new Promise(function (t, e) {
                var o = !1;
                var r = setTimeout(function () {
                    o || (o = !0, _this.bluetoothService.off("dataReceived", n), console.log("[DFU] 命令响应超时，移除事件监听器"), e(new Error("DFU 命令响应超时")));
                  }, 5e3),
                  n = function n(s) {
                    if (o) return void console.log("[DFU] 收到重复响应，忽略");
                    o = !0, console.log("[DFU] 接收到响应数据:", _typeof2(s), s instanceof ArrayBuffer ? "ArrayBuffer" : "Other"), console.log("[DFU] 响应数据字节长度:", s.byteLength || s.length || 0), clearTimeout(r), _this.bluetoothService.off("dataReceived", n);
                    var i = s;
                    if (s instanceof ArrayBuffer) i = s;else {
                      if (!s.buffer) return console.error("[DFU] 响应数据格式不正确:", s), void e(new Error("DFU 响应数据格式错误"));
                      i = s.buffer;
                    }
                    console.log("[DFU] 响应处理完成，准备解析"), t(i);
                  };
                console.log("[DFU] 注册 dataReceived 事件监听器"), _this.bluetoothService.on("dataReceived", n), console.log("[DFU] 事件监听器已注册，准备发送数据"), setTimeout(function () {
                  o || _this.bluetoothService.sendData(C.buffer, !1, "write").catch(function (t) {
                    o || (o = !0, _this.bluetoothService.off("dataReceived", n), console.error("[DFU] 发送命令失败:", t), e(t));
                  });
                }, 50);
              });
              _context.next = 7;
              return g;
            case 7:
              D = _context.sent;
              console.log("[DFU] 接收响应原始数据:", this.arrayToHexString(new Uint8Array(D))), console.log("[DFU] 响应数据长度:", D.byteLength);
              _ = new Uint8Array(D);
              if (!(this.isBLE || (_ = c.decode(_), console.log("[DFU] SLIP 解码后:", this.arrayToHexString(_))), console.log("[DFU] 最终处理的响应数据:", this.arrayToHexString(_)), console.log("[DFU] 检查响应格式 - 期望命令:", t.toString(16), "响应头:", null == (s = _[0]) ? void 0 : s.toString(16), null == (i = _[1]) ? void 0 : i.toString(16), null == (l = _[2]) ? void 0 : l.toString(16)), _[0] !== o.RESPONSE)) {
                _context.next = 12;
                break;
              }
              throw console.error("[DFU] 响应头不正确，期望:", o.RESPONSE.toString(16), "实际:", null == (a = _[0]) ? void 0 : a.toString(16)), new Error("DFU 响应不正确");
            case 12:
              U = t === o.EXECUTE && _[1] === o.CALC_CHECKSUM || t === o.CREATE_OBJECT && _[1] === o.CALC_CHECKSUM || !1;
              if (!(_[1] !== t && !U)) {
                _context.next = 15;
                break;
              }
              throw console.error("[DFU] 命令不匹配，期望:", t.toString(16), "实际:", null == (h = _[1]) ? void 0 : h.toString(16), "cmd类型:", _typeof2(t), "responseData[1]类型:", _typeof2(_[1])), new Error("DFU 命令不匹配");
            case 15:
              if (!(U && console.log("[DFU] 收到特殊命令响应，这是正常现象"), _[2] === r)) {
                _context.next = 18;
                break;
              }
              _t2 = _.slice(3);
              return _context.abrupt("return", (console.log("[DFU] 命令执行成功，返回数据:", this.arrayToHexString(_t2)), _t2));
            case 18:
              if (!(_[2] === n)) {
                _context.next = 20;
                break;
              }
              throw console.error("[DFU] 扩展错误码:", null == (E = _[3]) ? void 0 : E.toString(16)), new Error("DFU \u9519\u8BEF: ".concat(_[3]));
            case 20:
              throw console.error("[DFU] 错误码:", null == (S = _[2]) ? void 0 : S.toString(16)), new Error("DFU \u9519\u8BEF: ".concat(_[2]));
            case 21:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function sendCmd(_x) {
        return _sendCmd.apply(this, arguments);
      }
      return sendCmd;
    }()
  }, {
    key: "setPRN",
    value: function () {
      var _setPRN = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
        var t,
          e,
          _args2 = arguments;
        return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              t = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : 0;
              this.prn = t;
              e = new Uint8Array([255 & t, t >> 8 & 255]);
              _context2.next = 5;
              return this.sendCmd(o.SET_PRN, e);
            case 5:
              console.log("[DFU] 设置 PRN:", t);
            case 6:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function setPRN() {
        return _setPRN.apply(this, arguments);
      }
      return setPRN;
    }()
  }, {
    key: "getMTU",
    value: function () {
      var _getMTU = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
        var t;
        return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.sendCmd(o.GET_SERIAL_MTU);
            case 2:
              t = _context3.sent;
              return _context3.abrupt("return", (this.mtu = t[0] | t[1] << 8, console.log("[DFU] 获取 MTU:", this.mtu), this.mtu));
            case 4:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function getMTU() {
        return _getMTU.apply(this, arguments);
      }
      return getMTU;
    }()
  }, {
    key: "createObject",
    value: function () {
      var _createObject = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4(t, e) {
        var r;
        return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              r = new Uint8Array([t, 255 & e, e >> 8 & 255, e >> 16 & 255, e >> 24 & 255]);
              _context4.next = 3;
              return this.sendCmd(o.CREATE_OBJECT, r);
            case 3:
              console.log("[DFU] 创建对象:", t, e);
            case 4:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function createObject(_x2, _x3) {
        return _createObject.apply(this, arguments);
      }
      return createObject;
    }()
  }, {
    key: "writeObject",
    value: function () {
      var _writeObject = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5(t) {
        return _regeneratorRuntime2().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              if (!(!t || 0 === t.length)) {
                _context5.next = 2;
                break;
              }
              throw console.error("[DFU] 尝试写入空数据"), new Error("无法写入空数据");
            case 2:
              _context5.next = 4;
              return this.bluetoothService.sendData(t, !0, "writeNoResponse");
            case 4:
              console.log("[DFU] 写入对象数据:", t.length, "字节");
            case 5:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function writeObject(_x4) {
        return _writeObject.apply(this, arguments);
      }
      return writeObject;
    }()
  }, {
    key: "executeObject",
    value: function () {
      var _executeObject = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee6() {
        return _regeneratorRuntime2().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return this.sendCmd(o.EXECUTE);
            case 2:
              console.log("[DFU] 执行对象");
            case 3:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this);
      }));
      function executeObject() {
        return _executeObject.apply(this, arguments);
      }
      return executeObject;
    }()
  }, {
    key: "calculateChecksum",
    value: function () {
      var _calculateChecksum = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee7() {
        var t, e, r, n;
        return _regeneratorRuntime2().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return this.sendCmd(o.CALC_CHECKSUM);
            case 2:
              t = _context7.sent;
              e = new DataView(t.buffer, t.byteOffset, t.byteLength);
              r = e.getUint32(0, !0);
              n = e.getUint32(4, !0);
              return _context7.abrupt("return", (console.log("[DFU] 计算校验和结果:", {
                offset: r,
                crc: n
              }), {
                offset: r,
                crc: n
              }));
            case 7:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function calculateChecksum() {
        return _calculateChecksum.apply(this, arguments);
      }
      return calculateChecksum;
    }()
  }, {
    key: "flashFirmware",
    value: function () {
      var _flashFirmware = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee8(t, e, o) {
        var r, n, s, i, _e3, l, a, h, _o4, E;
        return _regeneratorRuntime2().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              if (!(!e || 0 === e.length)) {
                _context8.next = 2;
                break;
              }
              throw new Error("固件数据为空");
            case 2:
              r = e;
              if (r instanceof Uint8Array) {
                _context8.next = 15;
                break;
              }
              if (!(console.log("[DFU] firmwareBytes 不是 Uint8Array 类型，尝试转换"), r.buffer && r.buffer instanceof ArrayBuffer)) {
                _context8.next = 8;
                break;
              }
              r = new Uint8Array(r.buffer);
              _context8.next = 15;
              break;
            case 8:
              if (!(r instanceof ArrayBuffer)) {
                _context8.next = 12;
                break;
              }
              r = new Uint8Array(r);
              _context8.next = 15;
              break;
            case 12:
              if (Array.isArray(r)) {
                _context8.next = 14;
                break;
              }
              throw console.error("[DFU] 无法识别的固件数据类型:", _typeof2(r), r), new Error("无法将固件数据转换为 Uint8Array");
            case 14:
              r = new Uint8Array(r);
            case 15:
              if (!(!(r instanceof Uint8Array) || 0 === r.length)) {
                _context8.next = 17;
                break;
              }
              throw console.error("[DFU] 固件数据转换失败或为空"), new Error("固件数据转换失败");
            case 17:
              if (!(console.log("[DFU] 开始刷入固件:", t, r.length, "字节"), console.log("[DFU] 固件数据类型:", r.constructor.name), console.log("[DFU] 固件数据前10个字节:", this.arrayToHexString(r.slice(0, 10))), 0 === this.mtu)) {
                _context8.next = 27;
                break;
              }
              _context8.prev = 18;
              _context8.next = 21;
              return this.getMTU();
            case 21:
              this.mtu = _context8.sent;
              _context8.next = 27;
              break;
            case 24:
              _context8.prev = 24;
              _context8.t0 = _context8["catch"](18);
              console.warn("[DFU] 获取MTU失败，使用默认值20:", _context8.t0), this.mtu = 20;
            case 27:
              this.prn = 0;
              _context8.prev = 28;
              _context8.next = 31;
              return this.setPRN(16);
            case 31:
              this.prn = 16;
              _context8.next = 37;
              break;
            case 34:
              _context8.prev = 34;
              _context8.t1 = _context8["catch"](28);
              console.warn("[DFU] 设置PRN失败，将禁用PRN功能:", _context8.t1), this.prn = 0;
            case 37:
              n = 0, s = 0, i = 0;
              console.log("[DFU] 初始CRC值: 0x" + i.toString(16));
            case 39:
              if (!(n < r.length)) {
                _context8.next = 74;
                break;
              }
              _e3 = Math.min(r.length - n, 4096), l = 3;
              a = 0, h = !1;
            case 42:
              if (!(a < l && !h)) {
                _context8.next = 69;
                break;
              }
              a++;
              _context8.prev = 44;
              console.log("[DFU] [Attempt ".concat(a, "] \u521B\u5EFA\u5BF9\u8C61 - \u7C7B\u578B: ").concat(t, ", \u5927\u5C0F: ").concat(_e3));
              _context8.next = 48;
              return this.createObject(t, _e3);
            case 48:
              _o4 = r.slice(n, n + _e3);
              console.log("[DFU] \u53D1\u9001\u56FA\u4EF6\u5757: \u504F\u79FB=".concat(n, ", \u5927\u5C0F=").concat(_o4.length, ", \u5F53\u524DCRC=0x").concat(i.toString(16)));
              _context8.next = 52;
              return this.sendFirmwareObject(_o4, i, n);
            case 52:
              i = _context8.sent;
              console.log("[DFU] \u56FA\u4EF6\u5757\u53D1\u9001\u5B8C\u6210: \u65B0CRC=0x".concat(i.toString(16)));
              console.log("[DFU] [Attempt ".concat(a, "] \u6267\u884C\u5BF9\u8C61"));
              _context8.next = 57;
              return this.executeObject();
            case 57:
              h = !0;
              _context8.next = 67;
              break;
            case 60:
              _context8.prev = 60;
              _context8.t2 = _context8["catch"](44);
              if (!(console.error("[DFU] [Attempt ".concat(a, "] \u5237\u5165\u5757\u5931\u8D25:"), _context8.t2), a >= l)) {
                _context8.next = 64;
                break;
              }
              throw console.error("[DFU] 达到最大重试次数，刷入失败"), _context8.t2;
            case 64:
              console.log("[DFU] \u5728\u4E0B\u6B21\u5C1D\u8BD5\u524D\u7B49\u5F85 ".concat(100 * a, "ms"));
              _context8.next = 67;
              return this.delay(100 * a);
            case 67:
              _context8.next = 42;
              break;
            case 69:
              n += _e3;
              E = Math.floor(n / r.length * 100);
              E > s && (s = E, o && o(E));
            case 72:
              _context8.next = 39;
              break;
            case 74:
              o && o(100), console.log("[DFU] 固件刷入完成");
            case 75:
            case "end":
              return _context8.stop();
          }
        }, _callee8, this, [[18, 24], [28, 34], [44, 60]]);
      }));
      function flashFirmware(_x5, _x6, _x7) {
        return _flashFirmware.apply(this, arguments);
      }
      return flashFirmware;
    }()
  }, {
    key: "sendFirmwareObject",
    value: function () {
      var _sendFirmwareObject = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee9(t, e, o) {
        var r, n, s, c, _e4, _l, _a, _t3, _e5, l, a;
        return _regeneratorRuntime2().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              r = e, n = 0, s = 0;
              c = this.isBLE ? this.mtu > 0 ? this.mtu - 4 : 16 : 64;
              console.log("[DFU] \u53D1\u9001\u56FA\u4EF6\u5BF9\u8C61: \u5927\u5C0F=".concat(t.length, ", \u521D\u59CBCRC=0x").concat(r.toString(16), ", \u5168\u5C40\u504F\u79FB\u91CF=").concat(o));
            case 3:
              if (!(n < t.length)) {
                _context9.next = 23;
                break;
              }
              _e4 = Math.min(t.length - n, c), _l = t.slice(n, n + _e4);
              _context9.next = 7;
              return this.writeObject(_l);
            case 7:
              _context9.next = 9;
              return this.delay(2);
            case 9:
              _l.length > 0 && console.log("[DFU] \u53D1\u9001\u6570\u636E\u5757: \u957F\u5EA6=".concat(_l.length, ", \u524D\u51E0\u4E2A\u5B57\u8282=").concat(this.arrayToHexString(_l.slice(0, Math.min(4, _l.length)))));
              _a = r;
              if (!(r = i(_l, r), console.log("[DFU] CRC\u66F4\u65B0: 0x".concat(_a.toString(16), " -> 0x").concat(r.toString(16), ", \u5757\u5927\u5C0F=").concat(_l.length, "\u5B57\u8282")), n += _e4, this.prn > 0 && (s++, s === this.prn))) {
                _context9.next = 21;
                break;
              }
              _context9.next = 14;
              return this.delay(50);
            case 14:
              _context9.next = 16;
              return this.calculateChecksum();
            case 16:
              _t3 = _context9.sent;
              _e5 = o + n;
              if (!(console.log("[DFU] PRN \u6821\u9A8C: CRC=0x".concat(r.toString(16), ", \u8BBE\u5907\u8FD4\u56DECRC=0x").concat(_t3.crc.toString(16), " | Offset=").concat(_e5, ", \u8BBE\u5907\u8FD4\u56DEOffset=").concat(_t3.offset)), _t3.crc !== r || _t3.offset !== _e5)) {
                _context9.next = 20;
                break;
              }
              throw console.error("[DFU] CRC\u4E0D\u5339\u914D: \u8BA1\u7B97\u503C=0x".concat(r.toString(16), ", \u8BBE\u5907\u503C=0x").concat(_t3.crc.toString(16))), new Error("PRN \u6821\u9A8C\u5931\u8D25: CRC\u6216Offset\u4E0D\u5339\u914D (\u671F\u671BCRC=".concat(r, ", \u5B9E\u9645CRC=").concat(_t3.crc, ")"));
            case 20:
              s = 0;
            case 21:
              _context9.next = 3;
              break;
            case 23:
              _context9.next = 25;
              return this.delay(50);
            case 25:
              _context9.next = 27;
              return this.calculateChecksum();
            case 27:
              l = _context9.sent;
              a = o + n;
              if (!(console.log("[DFU] \u6700\u7EC8\u6821\u9A8C: CRC=0x".concat(r.toString(16), ", \u8BBE\u5907\u8FD4\u56DECRC=0x").concat(l.crc.toString(16), " | Offset=").concat(a, ", \u8BBE\u5907\u8FD4\u56DEOffset=").concat(l.offset)), l.crc !== r || l.offset !== a)) {
                _context9.next = 31;
                break;
              }
              throw console.error("[DFU] \u6700\u7EC8CRC\u4E0D\u5339\u914D: \u8BA1\u7B97\u503C=0x".concat(r.toString(16), ", \u8BBE\u5907\u503C=0x").concat(l.crc.toString(16))), new Error("\u6700\u7EC8\u6821\u9A8C\u5931\u8D25: CRC\u6216Offset\u4E0D\u5339\u914D (\u671F\u671BCRC=".concat(r, ", \u5B9E\u9645CRC=").concat(l.crc, ")"));
            case 31:
              return _context9.abrupt("return", r);
            case 32:
            case "end":
              return _context9.stop();
          }
        }, _callee9, this);
      }));
      function sendFirmwareObject(_x8, _x9, _x10) {
        return _sendFirmwareObject.apply(this, arguments);
      }
      return sendFirmwareObject;
    }()
  }, {
    key: "arrayToHexString",
    value: function arrayToHexString(t) {
      return Array.from(t).map(function (t) {
        return t.toString(16).padStart(2, "0");
      }).join(" ");
    }
  }, {
    key: "delay",
    value: function () {
      var _delay = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee10(t) {
        return _regeneratorRuntime2().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              return _context10.abrupt("return", new Promise(function (e) {
                return setTimeout(e, t);
              }));
            case 1:
            case "end":
              return _context10.stop();
          }
        }, _callee10);
      }));
      function delay(_x11) {
        return _delay.apply(this, arguments);
      }
      return delay;
    }()
  }]);
  return _class;
}();