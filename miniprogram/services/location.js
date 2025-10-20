var _objectSpread2 = require("../@babel/runtime/helpers/objectSpread2");var _regeneratorRuntime2 = require("../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../@babel/runtime/helpers/asyncToGenerator");var _classCallCheck2 = require("../@babel/runtime/helpers/classCallCheck");var _createClass2 = require("../@babel/runtime/helpers/createClass");var t = require("../common/vendor.js");var s = new ( /*#__PURE__*/function () {
  function _class() {
    _classCallCheck2(this, _class);
    this.isWatching = !1, this.watchId = null, this.lastPosition = null, this.lastNotifiedPosition = null, this.listeners = [], this.authSettings = null;
  }
  _createClass2(_class, [{
    key: "checkLocationPermission",
    value: function () {
      var _checkLocationPermission = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
        var _this = this;
        return _regeneratorRuntime2().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", new Promise(function (s, e) {
                t.index.getSetting({
                  success: function success(t) {
                    console.log("[位置服务] 当前权限设置:", t.authSetting), _this.authSettings = t.authSetting, void 0 === t.authSetting["scope.userLocation"] ? s({
                      status: "not_determined",
                      needAuth: !0
                    }) : !0 === t.authSetting["scope.userLocation"] ? s({
                      status: "authorized",
                      needAuth: !1
                    }) : s({
                      status: "denied",
                      needAuth: !1
                    });
                  },
                  fail: function fail(t) {
                    console.error("[位置服务] 获取权限设置失败:", t), e(t);
                  }
                });
              }));
            case 1:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function checkLocationPermission() {
        return _checkLocationPermission.apply(this, arguments);
      }
      return checkLocationPermission;
    }()
  }, {
    key: "requestLocationPermission",
    value: function () {
      var _requestLocationPermission = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
        return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", new Promise(function (s, e) {
                t.index.authorize({
                  scope: "scope.userLocation",
                  success: function success() {
                    console.log("[位置服务] 定位权限申请成功"), s(!0);
                  },
                  fail: function fail(t) {
                    console.error("[位置服务] 定位权限申请失败:", t), s(!1);
                  }
                });
              }));
            case 1:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function requestLocationPermission() {
        return _requestLocationPermission.apply(this, arguments);
      }
      return requestLocationPermission;
    }()
  }, {
    key: "openLocationSettings",
    value: function openLocationSettings() {
      return new Promise(function (s, e) {
        t.index.showModal({
          title: "位置权限未开启",
          content: "电子围栏功能需要位置权限，请在设置中开启位置权限",
          confirmText: "去设置",
          cancelText: "取消",
          success: function success(i) {
            i.confirm ? t.index.openSetting({
              success: function success(t) {
                console.log("[位置服务] 设置页面返回:", t.authSetting), t.authSetting["scope.userLocation"] ? s(!0) : s(!1);
              },
              fail: function fail(t) {
                console.error("[位置服务] 打开设置页面失败:", t), e(t);
              }
            }) : s(!1);
          }
        });
      });
    }
  }, {
    key: "getCurrentPosition",
    value: function () {
      var _getCurrentPosition = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
        var _this2 = this;
        var s,
          e,
          i,
          _args3 = arguments;
        return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              s = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {};
              e = _objectSpread2({
                type: "gcj02",
                altitude: !1,
                isHighAccuracy: !0,
                highAccuracyExpireTime: 4e3
              }, s), i = Date.now();
              return _context3.abrupt("return", !1 !== s.useCache && this.lastPosition && i - (this.lastPosition.timestamp || 0) < 3e3 ? (console.log("[位置服务] 使用缓存位置:", this.lastPosition), Promise.resolve(this.lastPosition)) : new Promise(function (i, n) {
                var o = setTimeout(function () {
                  _this2.lastPosition ? (console.warn("[位置服务] 位置获取超时，使用缓存位置"), i(_this2.lastPosition)) : n(new Error("获取位置超时"));
                }, s.timeout || 1e4);
                t.index.getSetting({
                  success: function success(a) {
                    if (!1 === a.authSetting["scope.userLocation"]) return clearTimeout(o), void n(new Error("位置权限被拒绝，请在设置中开启位置权限"));
                    t.index.getLocation(_objectSpread2(_objectSpread2({}, e), {}, {
                      success: function success(t) {
                        clearTimeout(o), console.log("[位置服务] 获取当前位置成功:", t);
                        var s = {
                          latitude: t.latitude,
                          longitude: t.longitude,
                          accuracy: t.accuracy,
                          altitude: t.altitude || 0,
                          timestamp: Date.now()
                        };
                        _this2.lastPosition = s, i(s);
                      },
                      fail: function fail(t) {
                        clearTimeout(o), console.error("[位置服务] 获取当前位置失败:", t);
                        var e = "获取位置失败";
                        t.errMsg && (e = t.errMsg.includes("auth deny") ? "位置权限被拒绝，请在设置中开启位置权限" : t.errMsg.includes("requiredPrivateInfos") ? "小程序配置错误，请联系开发者" : "\u83B7\u53D6\u4F4D\u7F6E\u5931\u8D25: ".concat(t.errMsg)), _this2.lastPosition && !s.ignoreCache ? (console.warn("[位置服务] 位置获取失败，使用缓存位置"), i(_this2.lastPosition)) : n(new Error(e));
                      }
                    }));
                  },
                  fail: function fail(t) {
                    clearTimeout(o), n(new Error("检查权限失败"));
                  }
                });
              }));
            case 3:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function getCurrentPosition() {
        return _getCurrentPosition.apply(this, arguments);
      }
      return getCurrentPosition;
    }()
  }, {
    key: "startWatching",
    value: function () {
      var _startWatching = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5(t) {
        var _this3 = this;
        var s,
          i,
          _t,
          _args5 = arguments;
        return _regeneratorRuntime2().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              s = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : {};
              if (!this.isWatching) {
                _context5.next = 3;
                break;
              }
              return _context5.abrupt("return", (console.warn("[位置服务] 已在监听位置变化"), void (t && "function" == typeof t && !this.listeners.includes(t) && this.listeners.push(t))));
            case 3:
              _context5.prev = 3;
              _context5.next = 6;
              return this.checkLocationPermission();
            case 6:
              _context5.t0 = _context5.sent.status;
              if (!("authorized" !== _context5.t0)) {
                _context5.next = 9;
                break;
              }
              throw new Error("位置权限未授权");
            case 9:
              console.log("[位置服务] 开始监听位置变化"), this.isWatching = !0, t && "function" == typeof t && !this.listeners.includes(t) && this.listeners.push(t);
              i = {
                interval: s.interval || 5e3,
                minDistanceChange: s.minDistanceChange || 10,
                useCache: !0
              };
              _context5.prev = 11;
              _context5.next = 14;
              return this.getCurrentPosition(_objectSpread2(_objectSpread2({}, s), {}, {
                useCache: !1
              }));
            case 14:
              _t = _context5.sent;
              this.notifyListeners(_t);
              _context5.next = 21;
              break;
            case 18:
              _context5.prev = 18;
              _context5.t1 = _context5["catch"](11);
              console.warn("[位置服务] 初始位置获取失败:", _context5.t1);
            case 21:
              this.watchId = setInterval( /*#__PURE__*/_asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4() {
                var _t2;
                return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
                  while (1) switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.prev = 0;
                      _context4.next = 3;
                      return _this3.getCurrentPosition(_objectSpread2(_objectSpread2({}, s), {}, {
                        useCache: i.useCache
                      }));
                    case 3:
                      _t2 = _context4.sent;
                      _this3._hasPositionChanged(_t2, i.minDistanceChange) && _this3.notifyListeners(_t2);
                      _context4.next = 10;
                      break;
                    case 7:
                      _context4.prev = 7;
                      _context4.t0 = _context4["catch"](0);
                      console.error("[位置服务] 定时获取位置失败:", _context4.t0), _this3.notifyListeners(null, _context4.t0);
                    case 10:
                    case "end":
                      return _context4.stop();
                  }
                }, _callee4, null, [[0, 7]]);
              })), i.interval);
              _context5.next = 27;
              break;
            case 24:
              _context5.prev = 24;
              _context5.t2 = _context5["catch"](3);
              throw console.error("[位置服务] 开始监听失败:", _context5.t2), this.isWatching = !1, _context5.t2;
            case 27:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this, [[3, 24], [11, 18]]);
      }));
      function startWatching(_x) {
        return _startWatching.apply(this, arguments);
      }
      return startWatching;
    }()
  }, {
    key: "_hasPositionChanged",
    value: function _hasPositionChanged(t) {
      var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
      if (!t || !this.lastNotifiedPosition) return this.lastNotifiedPosition = t, !0;
      return this.calculateDistance(t.latitude, t.longitude, this.lastNotifiedPosition.latitude, this.lastNotifiedPosition.longitude) > s && (this.lastNotifiedPosition = t, !0);
    }
  }, {
    key: "stopWatching",
    value: function stopWatching() {
      this.isWatching ? (console.log("[位置服务] 停止监听位置变化"), this.isWatching = !1, this.watchId && (clearInterval(this.watchId), this.watchId = null), this.listeners = []) : console.warn("[位置服务] 未在监听位置变化");
    }
  }, {
    key: "notifyListeners",
    value: function notifyListeners(t) {
      var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.listeners.forEach(function (e) {
        try {
          e(t, s);
        } catch (i) {
          console.error("[位置服务] 监听器回调错误:", i);
        }
      });
    }
  }, {
    key: "addListener",
    value: function addListener(t) {
      "function" == typeof t && this.listeners.push(t);
    }
  }, {
    key: "removeListener",
    value: function removeListener(t) {
      var s = this.listeners.indexOf(t);
      s > -1 && this.listeners.splice(s, 1);
    }
  }, {
    key: "getLastPosition",
    value: function getLastPosition() {
      return this.lastPosition;
    }
  }, {
    key: "calculateDistance",
    value: function calculateDistance(t, s, e, i) {
      var n = this.deg2rad(e - t),
        o = this.deg2rad(i - s),
        a = Math.sin(n / 2) * Math.sin(n / 2) + Math.cos(this.deg2rad(t)) * Math.cos(this.deg2rad(e)) * Math.sin(o / 2) * Math.sin(o / 2);
      return 6371e3 * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }
  }, {
    key: "deg2rad",
    value: function deg2rad(t) {
      return t * (Math.PI / 180);
    }
  }]);
  return _class;
}())();exports.locationService = s;