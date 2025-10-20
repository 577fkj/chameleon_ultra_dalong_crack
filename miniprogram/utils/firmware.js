var _regeneratorRuntime2 = require("../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../@babel/runtime/helpers/asyncToGenerator");var r = require("../common/vendor.js"),
  e = require("./http.js");exports.checkFirmwareUpdate = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee(r, t) {
    var o;
    return _regeneratorRuntime2().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return e.http.post("https://i.tlq520.cn/ultra/api/v1/firmware/check", {
            version: r,
            chip_id: t
          });
        case 3:
          o = _context.sent;
          return _context.abrupt("return", (console.log("[Firmware] 检查更新结果:", o), o));
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          throw console.error("[Firmware] 检查更新失败:", _context.t0), _context.t0;
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 7]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(), exports.downloadFirmware = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2(e) {
    return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          return _context2.abrupt("return", (console.log("[Firmware] 开始下载固件:", e), new Promise(function (t, o) {
            r.index.request({
              url: e,
              method: "GET",
              responseType: "arraybuffer",
              header: {
                Accept: "*/*"
              },
              success: function success(r) {
                if (200 === r.statusCode) console.log("[Firmware] 下载固件成功，数据大小:", r.data.byteLength, "字节"), t(r.data);else {
                  var _e = new Error("\u4E0B\u8F7D\u5931\u8D25\uFF0C\u72B6\u6001\u7801: ".concat(r.statusCode));
                  console.error("[Firmware] 下载固件失败:", _e), o(_e);
                }
              },
              fail: function fail(r) {
                var e = new Error("网络连接失败");
                e.original = r, console.error("[Firmware] 下载固件失败:", e, r), o(e);
              }
            });
          })));
        case 4:
          _context2.prev = 4;
          _context2.t0 = _context2["catch"](0);
          throw console.error("[Firmware] 下载固件失败:", _context2.t0), _context2.t0;
        case 7:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 4]]);
  }));
  return function (_x3) {
    return _ref2.apply(this, arguments);
  };
}(), exports.downloadLatestDFUFirmware = /*#__PURE__*/_asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
  var _e2;
  return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
    while (1) switch (_context3.prev = _context3.next) {
      case 0:
        _context3.prev = 0;
        _e2 = "https://i.tlq520.cn/ultra/api/v1/firmware/download/lastest.zip";
        return _context3.abrupt("return", (console.log("[Firmware] 开始下载最新DFU固件:", _e2), new Promise(function (t, o) {
          r.index.request({
            url: _e2,
            method: "GET",
            responseType: "arraybuffer",
            header: {
              Accept: "*/*"
            },
            success: function success(r) {
              if (200 === r.statusCode) console.log("[Firmware] 下载最新DFU固件成功，数据大小:", r.data.byteLength, "字节"), t(r.data);else {
                var _e3 = new Error("\u4E0B\u8F7D\u5931\u8D25\uFF0C\u72B6\u6001\u7801: ".concat(r.statusCode));
                console.error("[Firmware] 下载最新DFU固件失败:", _e3), o(_e3);
              }
            },
            fail: function fail(r) {
              var e = new Error("网络连接失败");
              e.original = r, console.error("[Firmware] 下载最新DFU固件失败:", e, r), o(e);
            }
          });
        })));
      case 5:
        _context3.prev = 5;
        _context3.t0 = _context3["catch"](0);
        throw console.error("[Firmware] 下载最新DFU固件失败:", _context3.t0), _context3.t0;
      case 8:
      case "end":
        return _context3.stop();
    }
  }, _callee3, null, [[0, 5]]);
})), exports.isFirmwareCompatible = function (r) {
  return !(!r || r.length < 5);
}, exports.unpackFirmware = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4(e) {
    var t, o, a, n, i, s;
    return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          t = new r.JSZip();
          _context4.next = 4;
          return t.loadAsync(e);
        case 4:
          o = _context4.sent;
          a = new Uint8Array(0), n = new Uint8Array(0);
          i = o.file("application.dat"), s = o.file("application.bin");
          if (i) {
            _context4.next = 9;
            break;
          }
          throw new Error("固件包中缺少 application.dat 文件");
        case 9:
          _context4.t0 = Uint8Array;
          _context4.next = 12;
          return i.async("arraybuffer");
        case 12:
          _context4.t1 = _context4.sent;
          a = new _context4.t0(_context4.t1);
          if (s) {
            _context4.next = 16;
            break;
          }
          throw new Error("固件包中缺少 application.bin 文件");
        case 16:
          _context4.t2 = Uint8Array;
          _context4.next = 19;
          return s.async("arraybuffer");
        case 19:
          _context4.t3 = _context4.sent;
          n = new _context4.t2(_context4.t3);
          console.log("[Firmware] 解包固件成功:", "application.dat:", a.length, "字节", "application.bin:", n.length, "字节");
          return _context4.abrupt("return", {
            applicationDat: a,
            applicationBin: n
          });
        case 25:
          _context4.prev = 25;
          _context4.t4 = _context4["catch"](0);
          throw console.error("[Firmware] 解包固件失败:", _context4.t4), _context4.t4;
        case 28:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 25]]);
  }));
  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
}(), exports.validateFirmware = function (r, e) {
  if (!r || 0 === r.length || !e || 0 === e.length) throw new Error("固件文件为空");
  return !0;
};