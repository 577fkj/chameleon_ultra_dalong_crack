var _regeneratorRuntime2 = require("@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("@babel/runtime/helpers/asyncToGenerator");Object.defineProperty(exports, Symbol.toStringTag, {
  value: "Module"
});var t = require("./common/vendor.js"),
  e = require("./utils/error-handler.js"),
  o = require("./store/index.js"),
  i = require("./utils/card-data.js");Math;var s = {
  data: function data() {
    return {
      bluetoothInitialized: !1,
      bluetoothInitPromise: null
    };
  },
  onLaunch: function onLaunch() {
    console.log("ChameleonUltra App 启动"), e.installErrorHandler(this), this.initializeApp();
  },
  onShow: function onShow() {
    var _this = this;
    console.log("ChameleonUltra App 显示"), setTimeout(function () {
      _this.checkBluetoothStatus();
    }, 500);
  },
  onHide: function onHide() {
    console.log("ChameleonUltra App 隐藏"), this.saveAppState();
  },
  onError: function onError(t) {
    console.error("App Error:", t), e.errorHandler.handle(t, "system", "error", {
      source: "App.vue onError"
    });
  },
  methods: {
    initializeApp: function initializeApp() {
      var _this2 = this;
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
        return _regeneratorRuntime2().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _this2.checkStoragePermission();
            case 3:
              _context.next = 5;
              return _this2.loadUserSettings();
            case 5:
              _context.next = 7;
              return _this2.initCardsData();
            case 7:
              _context.next = 9;
              return _this2.initBluetooth();
            case 9:
              console.log("应用初始化完成");
              _context.next = 15;
              break;
            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](0);
              e.errorHandler.handle(_context.t0, "system", "error", {
                source: "App初始化"
              });
            case 15:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 12]]);
      }))();
    },
    checkStoragePermission: function checkStoragePermission() {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
        return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              return _context2.abrupt("return", (t.index.setStorageSync("app_test", "test"), t.index.removeStorageSync("app_test"), !0));
            case 4:
              _context2.prev = 4;
              _context2.t0 = _context2["catch"](0);
              throw new Error("存储权限检查失败");
            case 7:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[0, 4]]);
      }))();
    },
    loadUserSettings: function loadUserSettings() {
      var _this3 = this;
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
        var _e;
        return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              try {
                _e = t.index.getStorageSync("user_settings") || {};
                _this3.$store.commit("device/UPDATE_SETTINGS", _e), _this3.$store.dispatch("device/loadSettings");
              } catch (e) {
                console.warn("加载用户配置失败:", e);
              }
            case 1:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }))();
    },
    initCardsData: function initCardsData() {
      var _this4 = this;
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4() {
        return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return _this4.$store.dispatch("cards/initCards");
            case 3:
              console.log("卡包数据初始化完成");
              _context4.next = 9;
              break;
            case 6:
              _context4.prev = 6;
              _context4.t0 = _context4["catch"](0);
              console.warn("初始化卡包数据失败:", _context4.t0);
            case 9:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[0, 6]]);
      }))();
    },
    initBluetooth: function initBluetooth() {
      var _this5 = this;
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5() {
        return _regeneratorRuntime2().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              if (!_this5.bluetoothInitPromise) {
                _context5.next = 2;
                break;
              }
              return _context5.abrupt("return", _this5.bluetoothInitPromise);
            case 2:
              _this5.bluetoothInitPromise = new Promise(function (e, o) {
                t.index.openBluetoothAdapter({
                  success: function success(t) {
                    console.log("蓝牙适配器初始化成功:", t), _this5.bluetoothInitialized = !0, e(!0);
                  },
                  fail: function fail(t) {
                    console.warn("蓝牙初始化失败:", t), 10001 === t.errCode ? (console.warn("蓝牙未打开，请打开蓝牙后重试"), _this5.bluetoothInitialized = !1, e(!1)) : 10002 === t.errCode ? (console.warn("没有找到指定设备"), _this5.bluetoothInitialized = !1, e(!1)) : t.errMsg && t.errMsg.includes("already opened") ? (console.log("蓝牙适配器已经打开，无需重复初始化"), _this5.bluetoothInitialized = !0, e(!0)) : (console.warn("蓝牙初始化失败，请检查设备蓝牙功能"), _this5.bluetoothInitialized = !1, e(!1));
                  }
                });
              });
              _context5.prev = 3;
              _context5.next = 6;
              return _this5.bluetoothInitPromise;
            case 6:
              return _context5.abrupt("return", _context5.sent);
            case 9:
              _context5.prev = 9;
              _context5.t0 = _context5["catch"](3);
              return _context5.abrupt("return", (console.warn("蓝牙初始化异常:", _context5.t0), _this5.bluetoothInitialized = !1, !1));
            case 12:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[3, 9]]);
      }))();
    },
    checkBluetoothStatus: function checkBluetoothStatus() {
      var _this6 = this;
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee6() {
        return _regeneratorRuntime2().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              if (_this6.bluetoothInitialized) {
                _context6.next = 6;
                break;
              }
              console.log("蓝牙未初始化，尝试重新初始化...");
              _context6.next = 4;
              return _this6.initBluetooth();
            case 4:
              if (_context6.sent) {
                _context6.next = 6;
                break;
              }
              return _context6.abrupt("return", void console.warn("蓝牙初始化失败，跳过状态检查"));
            case 6:
              t.index.getBluetoothAdapterState({
                success: function success(t) {
                  console.log("蓝牙状态检查成功:", t), _this6.$store.commit("device/UPDATE_BLUETOOTH_STATE", {
                    available: t.available,
                    discovering: t.discovering
                  });
                },
                fail: function fail(t) {
                  console.warn("获取蓝牙状态失败:", t), 10001 === t.errCode && (_this6.bluetoothInitialized = !1, _this6.bluetoothInitPromise = null), _this6.$store.commit("device/UPDATE_BLUETOOTH_STATE", {
                    available: !1,
                    discovering: !1
                  });
                }
              });
            case 7:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }))();
    },
    saveAppState: function saveAppState() {
      try {
        var _e2 = this.$store.state.device.settings || {};
        t.index.setStorageSync("user_settings", _e2);
        var _o = this.$store.state.cards.cards || [];
        _o.length > 0 && t.index.setStorageSync("user_cards", _o);
      } catch (e) {
        console.warn("保存应用状态失败:", e);
      }
    }
  }
};var r = t._export_sfc(s, [["render", function (t, e, o, i, s, r) {
  return {};
}]]);function n() {
  var e = t.createSSRApp(r);
  return e.use(o.store), e.config.globalProperties.$CardDataUtils = i.CardDataUtils, {
    app: e
  };
}n().app.mount("#app"), exports.createApp = n;