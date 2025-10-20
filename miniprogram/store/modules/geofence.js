var _createForOfIteratorHelper2 = require("../../@babel/runtime/helpers/createForOfIteratorHelper");var _regeneratorRuntime2 = require("../../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../../@babel/runtime/helpers/asyncToGenerator");var _objectSpread2 = require("../../@babel/runtime/helpers/objectSpread2");var e = require("../../common/vendor.js"),
  t = require("../../services/location.js"),
  o = require("../../utils/geofence-utils.js");function n(e) {
  return e * (Math.PI / 180);
}var i = {
  namespaced: !0,
  state: {
    geofences: [],
    currentPosition: null,
    currentGeofence: null,
    isWatching: !1,
    locationPermission: "unknown",
    autoSwitchEnabled: !1,
    switchHistory: [],
    isLoading: !1,
    lastError: null,
    lastPositionUpdateTime: 0,
    positionUpdateDebounceMs: 3e3,
    lastGeofenceCheckTime: 0,
    geofenceCheckCacheMs: 5e3
  },
  mutations: {
    SET_GEOFENCES: function SET_GEOFENCES(e, t) {
      e.geofences = t || [];
    },
    ADD_GEOFENCE: function ADD_GEOFENCE(e, t) {
      e.geofences.push(t);
    },
    UPDATE_GEOFENCE: function UPDATE_GEOFENCE(e, _ref) {
      var t = _ref.id,
        o = _ref.updates;
      var n = e.geofences.findIndex(function (e) {
        return e.id === t;
      });
      n >= 0 && e.geofences.splice(n, 1, _objectSpread2(_objectSpread2({}, e.geofences[n]), o));
    },
    REMOVE_GEOFENCE: function REMOVE_GEOFENCE(e, t) {
      var o = e.geofences.findIndex(function (e) {
        return e.id === t;
      });
      o >= 0 && e.geofences.splice(o, 1);
    },
    SET_CURRENT_POSITION: function SET_CURRENT_POSITION(e, t) {
      e.currentPosition = t;
    },
    SET_CURRENT_GEOFENCE: function SET_CURRENT_GEOFENCE(e, t) {
      e.currentGeofence = t;
    },
    SET_WATCHING: function SET_WATCHING(e, t) {
      e.isWatching = t;
    },
    SET_LOCATION_PERMISSION: function SET_LOCATION_PERMISSION(e, t) {
      e.locationPermission = t;
    },
    SET_AUTO_SWITCH: function SET_AUTO_SWITCH(e, t) {
      e.autoSwitchEnabled = t;
    },
    ADD_SWITCH_RECORD: function ADD_SWITCH_RECORD(e, t) {
      e.switchHistory.unshift(t), e.switchHistory.length > 100 && (e.switchHistory = e.switchHistory.slice(0, 100));
    },
    SET_LOADING: function SET_LOADING(e, t) {
      e.isLoading = t;
    },
    SET_ERROR: function SET_ERROR(e, t) {
      e.lastError = t;
    },
    SET_LAST_POSITION_UPDATE_TIME: function SET_LAST_POSITION_UPDATE_TIME(e, t) {
      e.lastPositionUpdateTime = t;
    },
    SET_LAST_GEOFENCE_CHECK_TIME: function SET_LAST_GEOFENCE_CHECK_TIME(e, t) {
      e.lastGeofenceCheckTime = t;
    }
  },
  actions: {
    initialize: function initialize(_ref2) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
        var e, t;
        return _regeneratorRuntime2().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              e = _ref2.commit, t = _ref2.dispatch;
              _context.prev = 1;
              e("SET_LOADING", !0);
              _context.next = 5;
              return t("loadGeofences");
            case 5:
              _context.next = 7;
              return t("loadSettings");
            case 7:
              _context.next = 9;
              return t("checkLocationPermission");
            case 9:
              e("SET_LOADING", !1);
              _context.next = 15;
              break;
            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](1);
              console.error("[围栏模块] 初始化失败:", _context.t0), e("SET_ERROR", _context.t0.message), e("SET_LOADING", !1);
            case 15:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[1, 12]]);
      }))();
    },
    checkLocationPermission: function checkLocationPermission(_ref3) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
        var e, _o;
        return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              e = _ref3.commit;
              _context2.prev = 1;
              _context2.next = 4;
              return t.locationService.checkLocationPermission();
            case 4:
              _o = _context2.sent;
              return _context2.abrupt("return", (e("SET_LOCATION_PERMISSION", _o.status), _o));
            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](1);
              throw console.error("[围栏模块] 检查定位权限失败:", _context2.t0), e("SET_LOCATION_PERMISSION", "denied"), _context2.t0;
            case 11:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[1, 8]]);
      }))();
    },
    requestLocationPermission: function requestLocationPermission(_ref4) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
        var e, o;
        return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              e = _ref4.commit, o = _ref4.dispatch;
              _context3.prev = 1;
              _context3.next = 4;
              return t.locationService.requestLocationPermission();
            case 4:
              if (!_context3.sent) {
                _context3.next = 6;
                break;
              }
              return _context3.abrupt("return", (e("SET_LOCATION_PERMISSION", "authorized"), !0));
            case 6:
              _context3.next = 8;
              return t.locationService.openLocationSettings();
            case 8:
              if (!_context3.sent) {
                _context3.next = 12;
                break;
              }
              _context3.t0 = (e("SET_LOCATION_PERMISSION", "authorized"), !0);
              _context3.next = 13;
              break;
            case 12:
              _context3.t0 = (e("SET_LOCATION_PERMISSION", "denied"), !1);
            case 13:
              return _context3.abrupt("return", _context3.t0);
            case 16:
              _context3.prev = 16;
              _context3.t1 = _context3["catch"](1);
              throw console.error("[围栏模块] 申请定位权限失败:", _context3.t1), e("SET_LOCATION_PERMISSION", "denied"), _context3.t1;
            case 19:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[1, 16]]);
      }))();
    },
    startWatching: function startWatching(_ref5) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4() {
        var e, o, n, i, _e;
        return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              e = _ref5.commit, o = _ref5.dispatch, n = _ref5.state, i = _ref5.rootGetters;
              if (!n.isWatching) {
                _context4.next = 5;
                break;
              }
              console.warn("[围栏模块] 已在监听位置");
              _context4.next = 38;
              break;
            case 5:
              if (i["device/isConnected"]) {
                _context4.next = 7;
                break;
              }
              throw new Error("设备未连接，无法启用围栏功能");
            case 7:
              _context4.prev = 7;
              console.log("[围栏模块] 开始监听位置变化");
              _context4.prev = 9;
              _context4.next = 12;
              return o("slots/loadAllSlots", null, {
                root: !0
              });
            case 12:
              console.log("[围栏模块] 卡槽数据已加载");
              _context4.next = 18;
              break;
            case 15:
              _context4.prev = 15;
              _context4.t0 = _context4["catch"](9);
              console.warn("[围栏模块] 卡槽数据加载失败:", _context4.t0);
            case 18:
              _context4.next = 20;
              return t.locationService.startWatching(function (t, n) {
                if (n) return console.error("[围栏模块] 位置监听错误:", n), void e("SET_ERROR", n.message);
                t && o("handlePositionUpdate", t);
              }, {
                interval: 5e3
              });
            case 20:
              e("SET_WATCHING", !0);
              _context4.prev = 21;
              _context4.next = 24;
              return t.locationService.getCurrentPosition();
            case 24:
              _e = _context4.sent;
              _context4.next = 27;
              return o("handlePositionUpdate", _e);
            case 27:
              console.log("[围栏模块] 启用监听后立即检查完成");
              _context4.next = 33;
              break;
            case 30:
              _context4.prev = 30;
              _context4.t1 = _context4["catch"](21);
              console.warn("[围栏模块] 启用监听后立即检查失败:", _context4.t1);
            case 33:
              _context4.next = 38;
              break;
            case 35:
              _context4.prev = 35;
              _context4.t2 = _context4["catch"](7);
              throw console.error("[围栏模块] 开始监听失败:", _context4.t2), e("SET_ERROR", _context4.t2.message), _context4.t2;
            case 38:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[7, 35], [9, 15], [21, 30]]);
      }))();
    },
    stopWatching: function stopWatching(_ref6) {
      var e = _ref6.commit,
        o = _ref6.state;
      o.isWatching ? (console.log("[围栏模块] 停止监听位置变化"), t.locationService.stopWatching(), e("SET_WATCHING", !1), e("SET_CURRENT_GEOFENCE", null)) : console.warn("[围栏模块] 未在监听位置");
    },
    handlePositionUpdate: function handlePositionUpdate(_ref7, a) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5() {
        var e, t, i, s, c, r, _e2, l, d, E, g, _n, _iterator, _step, _e3;
        return _regeneratorRuntime2().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              e = _ref7.commit, t = _ref7.dispatch, i = _ref7.state, s = _ref7.rootState;
              if (a) {
                _context5.next = 3;
                break;
              }
              return _context5.abrupt("return", void console.warn("[围栏模块] 收到无效位置信息"));
            case 3:
              if (!(e("SET_CURRENT_POSITION", a), !i.autoSwitchEnabled)) {
                _context5.next = 5;
                break;
              }
              return _context5.abrupt("return");
            case 5:
              if (!(0 === i.geofences.length)) {
                _context5.next = 7;
                break;
              }
              return _context5.abrupt("return");
            case 7:
              c = Date.now(), r = c - i.lastPositionUpdateTime;
              if (!(i.currentPosition && r < i.positionUpdateDebounceMs)) {
                _context5.next = 12;
                break;
              }
              _e2 = 10;
              if (!(function (e, t, o, i) {
                var s = 6371e3,
                  a = n(o - e),
                  c = n(i - t),
                  r = Math.sin(a / 2) * Math.sin(a / 2) + Math.cos(n(e)) * Math.cos(n(o)) * Math.sin(c / 2) * Math.sin(c / 2),
                  l = 2 * Math.atan2(Math.sqrt(r), Math.sqrt(1 - r));
                return s * l;
              }(i.currentPosition.latitude, i.currentPosition.longitude, a.latitude, a.longitude) < _e2)) {
                _context5.next = 12;
                break;
              }
              return _context5.abrupt("return", void console.log("[\u56F4\u680F\u6A21\u5757] \u4F4D\u7F6E\u53D8\u5316\u5C0F\u4E8E".concat(_e2, "\u7C73\uFF0C\u8DF3\u8FC7\u56F4\u680F\u68C0\u67E5")));
            case 12:
              e("SET_LAST_POSITION_UPDATE_TIME", c);
              l = s.slots.activeSlot, d = i.currentGeofence;
              E = null, g = !0;
              if (!(d && d.enabled)) {
                _context5.next = 25;
                break;
              }
              _context5.t0 = o.isPointInPolygon(a, d.polygon);
              if (!_context5.t0) {
                _context5.next = 25;
                break;
              }
              E = d;
              g = !1;
              _context5.t1 = l !== E.slotId;
              if (!_context5.t1) {
                _context5.next = 25;
                break;
              }
              console.log("[\u56F4\u680F\u6A21\u5757] \u9700\u8981\u5207\u6362\u5361\u69FD: ".concat(l, " -> ").concat(E.slotId));
              _context5.next = 25;
              return t("handleGeofenceEnter", E);
            case 25:
              if (!g) {
                _context5.next = 59;
                break;
              }
              _n = i.geofences.filter(function (e) {
                return e.enabled;
              });
              _iterator = _createForOfIteratorHelper2(_n);
              _context5.prev = 28;
              _iterator.s();
            case 30:
              if ((_step = _iterator.n()).done) {
                _context5.next = 37;
                break;
              }
              _e3 = _step.value;
              if (!o.isPointInPolygon(a, _e3.polygon)) {
                _context5.next = 35;
                break;
              }
              E = _e3;
              return _context5.abrupt("break", 37);
            case 35:
              _context5.next = 30;
              break;
            case 37:
              _context5.next = 42;
              break;
            case 39:
              _context5.prev = 39;
              _context5.t2 = _context5["catch"](28);
              _iterator.e(_context5.t2);
            case 42:
              _context5.prev = 42;
              _iterator.f();
              return _context5.finish(42);
            case 45:
              e("SET_CURRENT_GEOFENCE", E);
              if (!E) {
                _context5.next = 54;
                break;
              }
              _context5.t3 = l !== E.slotId;
              if (!_context5.t3) {
                _context5.next = 51;
                break;
              }
              _context5.next = 51;
              return t("handleGeofenceEnter", E);
            case 51:
              (null == E ? void 0 : E.id) !== (null == d ? void 0 : d.id) && console.log("[\u56F4\u680F\u6A21\u5757] \u8FDB\u5165\u56F4\u680F: ".concat(E.name));
              _context5.next = 59;
              break;
            case 54:
              _context5.t4 = d;
              if (!_context5.t4) {
                _context5.next = 59;
                break;
              }
              console.log("[\u56F4\u680F\u6A21\u5757] \u79BB\u5F00\u56F4\u680F: ".concat(d.name));
              _context5.next = 59;
              return t("handleGeofenceExit", d);
            case 59:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[28, 39, 42, 45]]);
      }))();
    },
    handleGeofenceEnter: function handleGeofenceEnter(_ref8, s) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee6() {
        var t, o, n, i, a, c, r, l;
        return _regeneratorRuntime2().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              t = _ref8.commit, o = _ref8.dispatch, n = _ref8.rootState, i = _ref8.rootGetters;
              _context6.prev = 1;
              if (i["device/isConnected"]) {
                _context6.next = 4;
                break;
              }
              return _context6.abrupt("return", void console.warn("[围栏模块] 设备未连接，无法切换卡槽"));
            case 4:
              r = n.slots.slots, l = r && r[s.slotId] ? r[s.slotId] : null;
              if (!(!l || !(null == (a = l.hf) ? void 0 : a.enabled) && !(null == (c = l.lf) ? void 0 : c.enabled))) {
                _context6.next = 8;
                break;
              }
              console.warn("[\u56F4\u680F\u6A21\u5757] \u5361\u69FD".concat(s.slotId + 1, "\u6CA1\u6709\u6709\u6548\u5361\u7247"));
              return _context6.abrupt("return", (t("ADD_SWITCH_RECORD", {
                id: Date.now(),
                timestamp: Date.now(),
                geofenceName: s.name,
                slotId: s.slotId,
                action: "enter",
                success: !1,
                error: "目标卡槽没有有效卡片"
              }), void e.index.showToast({
                title: "\u5361\u69FD".concat(s.slotId + 1, "\u65E0\u6548\u5361\u7247"),
                icon: "none",
                duration: 2e3
              })));
            case 8:
              console.log("[\u56F4\u680F\u6A21\u5757] \u51C6\u5907\u5207\u6362\u5230\u5361\u69FD ".concat(s.slotId));
              _context6.next = 11;
              return o("slots/setActiveSlot", s.slotId, {
                root: !0
              });
            case 11:
              console.log("[围栏模块] 卡槽切换完成");
              e.index.showToast({
                title: "\u81EA\u52A8\u5207\u6362\u5230\u5361\u69FD".concat(s.slotId + 1),
                icon: "success",
                duration: 2e3
              });
              t("ADD_SWITCH_RECORD", {
                id: Date.now(),
                timestamp: Date.now(),
                geofenceName: s.name,
                slotId: s.slotId,
                action: "enter",
                success: !0,
                error: null
              }), t("UPDATE_GEOFENCE", {
                id: s.id,
                updates: {
                  lastTriggerTime: Date.now(),
                  triggerCount: (s.triggerCount || 0) + 1
                }
              });
              _context6.next = 20;
              break;
            case 16:
              _context6.prev = 16;
              _context6.t0 = _context6["catch"](1);
              console.error("[围栏模块] 进入围栏处理失败:", _context6.t0);
              t("ADD_SWITCH_RECORD", {
                id: Date.now(),
                timestamp: Date.now(),
                geofenceName: s.name,
                slotId: s.slotId,
                action: "enter",
                success: !1,
                error: _context6.t0.message
              }), e.index.showToast({
                title: "卡槽切换失败",
                icon: "none",
                duration: 2e3
              }), t("SET_ERROR", _context6.t0.message);
            case 20:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[1, 16]]);
      }))();
    },
    handleGeofenceExit: function handleGeofenceExit(_ref9, t) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee7() {
        var e;
        return _regeneratorRuntime2().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              e = _ref9.commit;
              console.log("[\u56F4\u680F\u6A21\u5757] \u79BB\u5F00\u56F4\u680F: ".concat(t.name));
            case 2:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }))();
    },
    loadGeofences: function loadGeofences(_ref10) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee8() {
        var t, _o2;
        return _regeneratorRuntime2().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              t = _ref10.commit;
              try {
                _o2 = e.index.getStorageSync("geofences");
                _o2 && t("SET_GEOFENCES", JSON.parse(_o2));
              } catch (o) {
                console.error("[围栏模块] 加载围栏数据失败:", o);
              }
            case 2:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      }))();
    },
    saveGeofences: function saveGeofences(_ref11) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee9() {
        var t;
        return _regeneratorRuntime2().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              t = _ref11.state;
              try {
                e.index.setStorageSync("geofences", JSON.stringify(t.geofences));
              } catch (o) {
                console.error("[围栏模块] 保存围栏数据失败:", o);
              }
            case 2:
            case "end":
              return _context9.stop();
          }
        }, _callee9);
      }))();
    },
    addGeofence: function addGeofence(_ref12, n) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee10() {
        var e, t, _i, s;
        return _regeneratorRuntime2().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              e = _ref12.commit, t = _ref12.dispatch;
              _context10.prev = 1;
              _i = o.validateGeofence(n);
              if (_i.valid) {
                _context10.next = 5;
                break;
              }
              throw new Error(_i.errors.join(", "));
            case 5:
              s = {
                id: o.generateGeofenceId(),
                name: n.name,
                slotId: n.slotId,
                polygon: n.polygon,
                enabled: !0,
                createTime: Date.now(),
                updateTime: Date.now(),
                lastTriggerTime: null,
                triggerCount: 0
              };
              e("ADD_GEOFENCE", s);
              _context10.next = 9;
              return t("saveGeofences");
            case 9:
              return _context10.abrupt("return", s);
            case 12:
              _context10.prev = 12;
              _context10.t0 = _context10["catch"](1);
              throw console.error("[围栏模块] 添加围栏失败:", _context10.t0), _context10.t0;
            case 15:
            case "end":
              return _context10.stop();
          }
        }, _callee10, null, [[1, 12]]);
      }))();
    },
    updateGeofence: function updateGeofence(_ref13, _ref14) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee11() {
        var e, t, n, i, _e4;
        return _regeneratorRuntime2().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              e = _ref13.commit, t = _ref13.dispatch;
              n = _ref14.id, i = _ref14.updates;
              _context11.prev = 2;
              if (!(i.name || i.slotId || i.polygon)) {
                _context11.next = 7;
                break;
              }
              _e4 = o.validateGeofence(_objectSpread2({}, i));
              if (_e4.valid) {
                _context11.next = 7;
                break;
              }
              throw new Error(_e4.errors.join(", "));
            case 7:
              e("UPDATE_GEOFENCE", {
                id: n,
                updates: _objectSpread2(_objectSpread2({}, i), {}, {
                  updateTime: Date.now()
                })
              });
              _context11.next = 10;
              return t("saveGeofences");
            case 10:
              _context11.next = 15;
              break;
            case 12:
              _context11.prev = 12;
              _context11.t0 = _context11["catch"](2);
              throw console.error("[围栏模块] 更新围栏失败:", _context11.t0), _context11.t0;
            case 15:
            case "end":
              return _context11.stop();
          }
        }, _callee11, null, [[2, 12]]);
      }))();
    },
    deleteGeofence: function deleteGeofence(_ref15, o) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee12() {
        var e, t;
        return _regeneratorRuntime2().wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              e = _ref15.commit, t = _ref15.dispatch;
              _context12.prev = 1;
              e("REMOVE_GEOFENCE", o);
              _context12.next = 5;
              return t("saveGeofences");
            case 5:
              _context12.next = 10;
              break;
            case 7:
              _context12.prev = 7;
              _context12.t0 = _context12["catch"](1);
              throw console.error("[围栏模块] 删除围栏失败:", _context12.t0), _context12.t0;
            case 10:
            case "end":
              return _context12.stop();
          }
        }, _callee12, null, [[1, 7]]);
      }))();
    },
    toggleAutoSwitch: function toggleAutoSwitch(_ref16) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee13() {
        var e, t, o, n, _i2;
        return _regeneratorRuntime2().wrap(function _callee13$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              e = _ref16.commit, t = _ref16.dispatch, o = _ref16.state, n = _ref16.rootGetters;
              _context13.prev = 1;
              _i2 = !o.autoSwitchEnabled;
              if (!_i2) {
                _context13.next = 18;
                break;
              }
              if (n["device/isConnected"]) {
                _context13.next = 6;
                break;
              }
              throw new Error("设备未连接");
            case 6:
              _context13.next = 8;
              return t("checkLocationPermission");
            case 8:
              _context13.t0 = _context13.sent.status;
              if (!("authorized" !== _context13.t0)) {
                _context13.next = 14;
                break;
              }
              _context13.next = 12;
              return t("requestLocationPermission");
            case 12:
              if (_context13.sent) {
                _context13.next = 14;
                break;
              }
              throw new Error("位置权限未授权");
            case 14:
              _context13.next = 16;
              return t("startWatching");
            case 16:
              _context13.next = 19;
              break;
            case 18:
              t("stopWatching");
            case 19:
              e("SET_AUTO_SWITCH", _i2);
              _context13.next = 22;
              return t("saveSettings");
            case 22:
              _context13.next = 27;
              break;
            case 24:
              _context13.prev = 24;
              _context13.t1 = _context13["catch"](1);
              throw console.error("[围栏模块] 切换自动切换功能失败:", _context13.t1), _context13.t1;
            case 27:
            case "end":
              return _context13.stop();
          }
        }, _callee13, null, [[1, 24]]);
      }))();
    },
    getCurrentPosition: function getCurrentPosition(_ref17) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee14() {
        var e, _o3;
        return _regeneratorRuntime2().wrap(function _callee14$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              e = _ref17.commit;
              _context14.prev = 1;
              _context14.next = 4;
              return t.locationService.getCurrentPosition();
            case 4:
              _o3 = _context14.sent;
              return _context14.abrupt("return", (e("SET_CURRENT_POSITION", _o3), _o3));
            case 8:
              _context14.prev = 8;
              _context14.t0 = _context14["catch"](1);
              throw console.error("[围栏模块] 获取当前位置失败:", _context14.t0), _context14.t0;
            case 11:
            case "end":
              return _context14.stop();
          }
        }, _callee14, null, [[1, 8]]);
      }))();
    },
    saveSettings: function saveSettings(_ref18) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee15() {
        var t, _o4;
        return _regeneratorRuntime2().wrap(function _callee15$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              t = _ref18.state;
              try {
                _o4 = {
                  autoSwitchEnabled: t.autoSwitchEnabled,
                  lastSaveTime: Date.now()
                };
                e.index.setStorageSync("geofenceSettings", JSON.stringify(_o4));
              } catch (o) {
                console.error("[围栏模块] 保存设置失败:", o);
              }
            case 2:
            case "end":
              return _context15.stop();
          }
        }, _callee15);
      }))();
    },
    loadSettings: function loadSettings(_ref19) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee16() {
        var t, _o5;
        return _regeneratorRuntime2().wrap(function _callee16$(_context16) {
          while (1) switch (_context16.prev = _context16.next) {
            case 0:
              t = _ref19.commit;
              try {
                _o5 = e.index.getStorageSync("geofenceSettings");
                if (_o5) {
                  t("SET_AUTO_SWITCH", JSON.parse(_o5).autoSwitchEnabled || !1);
                }
              } catch (o) {
                console.error("[围栏模块] 加载设置失败:", o);
              }
            case 2:
            case "end":
              return _context16.stop();
          }
        }, _callee16);
      }))();
    }
  },
  getters: {
    enabledGeofences: function enabledGeofences(e) {
      return e.geofences.filter(function (e) {
        return e.enabled;
      });
    },
    getGeofenceById: function getGeofenceById(e) {
      return function (t) {
        return e.geofences.find(function (e) {
          return e.id === t;
        });
      };
    },
    statistics: function statistics(e) {
      return {
        totalGeofences: e.geofences.length,
        enabledGeofences: e.geofences.filter(function (e) {
          return e.enabled;
        }).length,
        totalTriggers: e.geofences.reduce(function (e, t) {
          return e + (t.triggerCount || 0);
        }, 0)
      };
    },
    canEnableGeofence: function canEnableGeofence(e, t, o, n) {
      return n["device/isConnected"] && "authorized" === e.locationPermission;
    }
  }
};exports.geofence = i;