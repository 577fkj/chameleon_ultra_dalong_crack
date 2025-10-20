var _slicedToArray2 = require("../../@babel/runtime/helpers/slicedToArray");var _regeneratorRuntime2 = require("../../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../../@babel/runtime/helpers/asyncToGenerator");var _objectSpread2 = require("../../@babel/runtime/helpers/objectSpread2");var e = require("../../common/vendor.js"),
  t = require("../../utils/chameleon-protocol.js"),
  c = require("../../services/bluetooth.js"),
  n = {
    namespaced: !0,
    state: {
      isConnected: !1,
      isConnecting: !1,
      connectionError: null,
      bluetoothState: {
        available: !1,
        discovering: !1
      },
      connectedDevice: null,
      deviceInfo: null,
      batteryInfo: null,
      deviceMode: t.DeviceMode.TAG,
      activeSlot: 0,
      deviceSettings: null,
      capabilities: {},
      recentDevices: [],
      autoConnect: !1,
      lastConnectedDeviceId: null,
      licenseKey: "",
      trialCount: {
        usedCount: 0,
        remainingCount: 0
      },
      chipId: ""
    },
    mutations: {
      SET_CONNECTION_STATUS: function SET_CONNECTION_STATUS(e, t) {
        e.isConnected = t, t || (e.connectedDevice = null, e.deviceInfo = null, e.batteryInfo = null);
      },
      SET_CONNECTING_STATUS: function SET_CONNECTING_STATUS(e, t) {
        e.isConnecting = t, t || (e.connectionError = null);
      },
      SET_CONNECTION_ERROR: function SET_CONNECTION_ERROR(e, t) {
        e.connectionError = t, e.isConnecting = !1;
      },
      UPDATE_BLUETOOTH_STATE: function UPDATE_BLUETOOTH_STATE(e, t) {
        e.bluetoothState = _objectSpread2(_objectSpread2({}, e.bluetoothState), t);
      },
      SET_CONNECTED_DEVICE: function SET_CONNECTED_DEVICE(e, t) {
        if (e.connectedDevice = t, t) {
          e.lastConnectedDeviceId = t.deviceId;
          var _c = e.recentDevices.findIndex(function (e) {
            return e.deviceId === t.deviceId;
          });
          _c >= 0 && e.recentDevices.splice(_c, 1), e.recentDevices.unshift(_objectSpread2(_objectSpread2({}, t), {}, {
            lastConnected: Date.now()
          })), e.recentDevices.length > 10 && e.recentDevices.pop();
        }
      },
      SET_DEVICE_INFO: function SET_DEVICE_INFO(e, t) {
        e.deviceInfo = t;
      },
      SET_BATTERY_INFO: function SET_BATTERY_INFO(e, t) {
        e.batteryInfo = t;
      },
      SET_DEVICE_CAPABILITIES: function SET_DEVICE_CAPABILITIES(e, t) {
        e.capabilities = t;
      },
      SET_DEVICE_SETTINGS: function SET_DEVICE_SETTINGS(e, t) {
        e.deviceSettings = t;
      },
      SET_DEVICE_MODE: function SET_DEVICE_MODE(e, t) {
        e.deviceMode = t;
      },
      SET_ACTIVE_SLOT: function SET_ACTIVE_SLOT(e, t) {
        e.activeSlot = t;
      },
      SET_AUTO_CONNECT: function SET_AUTO_CONNECT(e, t) {
        e.autoConnect = t;
      },
      SET_LAST_CONNECTED_DEVICE_ID: function SET_LAST_CONNECTED_DEVICE_ID(e, t) {
        e.lastConnectedDeviceId = t;
      },
      UPDATE_SETTINGS: function UPDATE_SETTINGS(e, t) {
        void 0 !== t.autoConnect && (e.autoConnect = t.autoConnect), void 0 !== t.lastConnectedDeviceId && (e.lastConnectedDeviceId = t.lastConnectedDeviceId);
      },
      CLEAR_DEVICE_DATA: function CLEAR_DEVICE_DATA(e) {
        e.isConnected = !1, e.isConnecting = !1, e.connectionError = null, e.connectedDevice = null, e.deviceInfo = null, e.batteryInfo = null, e.deviceMode = t.DeviceMode.TAG, e.activeSlot = 0, e.capabilities = {}, e.deviceSettings = null;
      },
      SET_LICENSE_KEY: function SET_LICENSE_KEY(e, t) {
        e.licenseKey = t;
      },
      SET_TRIAL_COUNT: function SET_TRIAL_COUNT(e, t) {
        e.trialCount = t;
      },
      SET_CHIP_ID: function SET_CHIP_ID(e, t) {
        e.chipId = t;
      }
    },
    actions: {
      setConnectionStatus: function setConnectionStatus(_ref, t) {
        var e = _ref.commit;
        e("SET_CONNECTION_STATUS", t);
      },
      setConnectingStatus: function setConnectingStatus(_ref2, t) {
        var e = _ref2.commit;
        e("SET_CONNECTING_STATUS", t);
      },
      setConnectionError: function setConnectionError(_ref3, t) {
        var e = _ref3.commit;
        e("SET_CONNECTION_ERROR", t);
      },
      setConnectedDevice: function setConnectedDevice(_ref4, t) {
        var e = _ref4.commit;
        e("SET_CONNECTED_DEVICE", t), t && e("SET_CONNECTION_STATUS", !0);
      },
      updateDeviceInfo: function updateDeviceInfo(_ref5, t) {
        var e = _ref5.commit;
        e("SET_DEVICE_INFO", t), t.mode && e("SET_DEVICE_MODE", t.mode);
      },
      updateBatteryInfo: function updateBatteryInfo(_ref6, t) {
        var e = _ref6.commit;
        e("SET_BATTERY_INFO", t);
      },
      updateDeviceCapabilities: function updateDeviceCapabilities(_ref7, t) {
        var e = _ref7.commit;
        e("SET_DEVICE_CAPABILITIES", t);
      },
      changeDeviceMode: function changeDeviceMode(_ref8, c) {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
          var e, t;
          return _regeneratorRuntime2().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                e = _ref8.commit, t = _ref8.dispatch;
                _context.prev = 1;
                e("SET_DEVICE_MODE", c);
                _context.next = 5;
                return t("refreshDeviceInfo");
              case 5:
                _context.next = 10;
                break;
              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](1);
                throw console.error("[Device Store] 切换设备模式失败", _context.t0), _context.t0;
              case 10:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[1, 7]]);
        }))();
      },
      setActiveSlot: function setActiveSlot(_ref9, c) {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
          var e;
          return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                e = _ref9.commit;
                _context2.prev = 1;
                if (t.ChameleonProtocol.isValidSlot(c)) {
                  _context2.next = 4;
                  break;
                }
                throw new Error("无效的卡槽编号");
              case 4:
                e("SET_ACTIVE_SLOT", c);
                _context2.next = 10;
                break;
              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](1);
                throw console.error("[Device Store] 设置活动卡槽失败", _context2.t0), _context2.t0;
              case 10:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[1, 7]]);
        }))();
      },
      refreshDeviceInfo: function refreshDeviceInfo(_ref10) {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
          var e, t, _yield$Promise$all, _yield$Promise$all2, _t, _n;
          return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                e = _ref10.commit, t = _ref10.state;
                if (c.bluetoothService.isConnected) {
                  _context3.next = 3;
                  break;
                }
                throw e("SET_CONNECTION_STATUS", !1), new Error("设备未连接");
              case 3:
                _context3.prev = 3;
                _context3.next = 6;
                return Promise.all([c.bluetoothService.getDeviceInfo(), c.bluetoothService.getBatteryInfo()]);
              case 6:
                _yield$Promise$all = _context3.sent;
                _yield$Promise$all2 = _slicedToArray2(_yield$Promise$all, 2);
                _t = _yield$Promise$all2[0];
                _n = _yield$Promise$all2[1];
                return _context3.abrupt("return", (e("SET_DEVICE_INFO", _t), e("SET_BATTERY_INFO", _n), void 0 !== _t.mode && e("SET_DEVICE_MODE", _t.mode), {
                  deviceInfo: _t,
                  batteryInfo: _n
                }));
              case 13:
                _context3.prev = 13;
                _context3.t0 = _context3["catch"](3);
                throw console.error("[Device Store] 刷新设备信息失败", _context3.t0), _context3.t0;
              case 16:
              case "end":
                return _context3.stop();
            }
          }, _callee3, null, [[3, 13]]);
        }))();
      },
      syncConnectionStatus: function syncConnectionStatus(_ref11) {
        var e = _ref11.commit;
        var t = c.bluetoothService.isConnected,
          n = c.bluetoothService.connectedDevice;
        e("SET_CONNECTION_STATUS", t), e("SET_CONNECTED_DEVICE", t && n ? n : null);
      },
      disconnectDevice: function disconnectDevice(_ref12) {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4() {
          var e;
          return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                e = _ref12.commit;
                _context4.prev = 1;
                _context4.next = 4;
                return c.bluetoothService.disconnect();
              case 4:
                e("CLEAR_DEVICE_DATA");
                _context4.next = 10;
                break;
              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4["catch"](1);
                throw console.error("[Device Store] 断开连接失败", _context4.t0), _context4.t0;
              case 10:
              case "end":
                return _context4.stop();
            }
          }, _callee4, null, [[1, 7]]);
        }))();
      },
      setAutoConnect: function setAutoConnect(_ref13, c) {
        var t = _ref13.commit;
        t("SET_AUTO_CONNECT", c), e.index.setStorageSync("autoConnect", c);
      },
      loadSettings: function loadSettings(_ref14) {
        var t = _ref14.commit;
        try {
          var _c2 = e.index.getStorageSync("autoConnect"),
            _n2 = e.index.getStorageSync("lastConnectedDeviceId"),
            o = e.index.getStorageSync("recentDevices") || [],
            i = e.index.getStorageSync("deviceSettings");
          "boolean" == typeof _c2 && t("SET_AUTO_CONNECT", _c2), _n2 && t("SET_LAST_CONNECTED_DEVICE_ID", _n2), Array.isArray(o) && o.forEach(function (e) {
            t("SET_CONNECTED_DEVICE", e);
          }), i && t("SET_DEVICE_SETTINGS", i);
        } catch (c) {
          console.error("[Device Store] 加载设置失败", c);
        }
      },
      saveSettings: function saveSettings(_ref15) {
        var t = _ref15.state;
        try {
          e.index.setStorageSync("autoConnect", t.autoConnect), e.index.setStorageSync("lastConnectedDeviceId", t.lastConnectedDeviceId), e.index.setStorageSync("recentDevices", t.recentDevices), t.deviceSettings && e.index.setStorageSync("deviceSettings", t.deviceSettings);
        } catch (c) {
          console.error("[Device Store] 保存设置失败", c);
        }
      },
      updateDeviceSettings: function updateDeviceSettings(_ref16, t) {
        var e = _ref16.commit;
        e("SET_DEVICE_SETTINGS", t);
      },
      getLicenseKey: function getLicenseKey(_ref17) {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5() {
          var e, _t2;
          return _regeneratorRuntime2().wrap(function _callee5$(_context5) {
            while (1) switch (_context5.prev = _context5.next) {
              case 0:
                e = _ref17.commit;
                _context5.prev = 1;
                _context5.next = 4;
                return c.bluetoothService.getLicenseKey();
              case 4:
                _t2 = _context5.sent;
                return _context5.abrupt("return", (e("SET_LICENSE_KEY", _t2), _t2));
              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5["catch"](1);
                return _context5.abrupt("return", (console.error("[Device Store] 获取激活码失败", _context5.t0), ""));
              case 11:
              case "end":
                return _context5.stop();
            }
          }, _callee5, null, [[1, 8]]);
        }))();
      },
      setLicenseKey: function setLicenseKey(_ref18, t) {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee6() {
          var e;
          return _regeneratorRuntime2().wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                e = _ref18.commit;
                _context6.prev = 1;
                _context6.next = 4;
                return c.bluetoothService.setLicenseKey(t);
              case 4:
                e("SET_LICENSE_KEY", t);
                return _context6.abrupt("return", !0);
              case 8:
                _context6.prev = 8;
                _context6.t0 = _context6["catch"](1);
                return _context6.abrupt("return", (console.error("[Device Store] 设置激活码失败", _context6.t0), !1));
              case 11:
              case "end":
                return _context6.stop();
            }
          }, _callee6, null, [[1, 8]]);
        }))();
      },
      getTrialCount: function getTrialCount(_ref19) {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee7() {
          var e, _t3;
          return _regeneratorRuntime2().wrap(function _callee7$(_context7) {
            while (1) switch (_context7.prev = _context7.next) {
              case 0:
                e = _ref19.commit;
                _context7.prev = 1;
                _context7.next = 4;
                return c.bluetoothService.getTrialCount();
              case 4:
                _t3 = _context7.sent;
                return _context7.abrupt("return", (e("SET_TRIAL_COUNT", _t3), _t3));
              case 8:
                _context7.prev = 8;
                _context7.t0 = _context7["catch"](1);
                return _context7.abrupt("return", (console.error("[Device Store] 获取试用次数失败", _context7.t0), {
                  usedCount: 0,
                  remainingCount: 0
                }));
              case 11:
              case "end":
                return _context7.stop();
            }
          }, _callee7, null, [[1, 8]]);
        }))();
      },
      getDeviceChipID: function getDeviceChipID(_ref20) {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee8() {
          var e, _t4;
          return _regeneratorRuntime2().wrap(function _callee8$(_context8) {
            while (1) switch (_context8.prev = _context8.next) {
              case 0:
                e = _ref20.commit;
                _context8.prev = 1;
                _context8.next = 4;
                return c.bluetoothService.getDeviceChipID();
              case 4:
                _t4 = _context8.sent;
                return _context8.abrupt("return", (e("SET_CHIP_ID", _t4), _t4));
              case 8:
                _context8.prev = 8;
                _context8.t0 = _context8["catch"](1);
                return _context8.abrupt("return", (console.error("[Device Store] 获取设备芯片ID失败", _context8.t0), ""));
              case 11:
              case "end":
                return _context8.stop();
            }
          }, _callee8, null, [[1, 8]]);
        }))();
      },
      verifyActivationCode: function verifyActivationCode(_ref21, _ref22) {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee9() {
          var e, t, n, _ref22$firmwareVersio, o, i, r;
          return _regeneratorRuntime2().wrap(function _callee9$(_context9) {
            while (1) switch (_context9.prev = _context9.next) {
              case 0:
                e = _ref21.state, t = _ref21.dispatch;
                n = _ref22.code, _ref22$firmwareVersio = _ref22.firmwareVersion, o = _ref22$firmwareVersio === void 0 ? "" : _ref22$firmwareVersio;
                _context9.prev = 2;
                i = e.chipId;
                _context9.t0 = i;
                if (_context9.t0) {
                  _context9.next = 9;
                  break;
                }
                _context9.next = 8;
                return t("getDeviceChipID");
              case 8:
                i = _context9.sent;
              case 9:
                _context9.next = 11;
                return c.bluetoothService.verifyActivationCode(n, i, o);
              case 11:
                r = _context9.sent;
                _context9.t1 = r.success;
                if (!_context9.t1) {
                  _context9.next = 20;
                  break;
                }
                _context9.next = 16;
                return c.bluetoothService.setLicenseKey(n);
              case 16:
                _context9.next = 18;
                return c.bluetoothService.setSecretKey(r.secret_key);
              case 18:
                t("getLicenseKey");
                t("getTrialCount");
              case 20:
                return _context9.abrupt("return", r);
              case 23:
                _context9.prev = 23;
                _context9.t2 = _context9["catch"](2);
                return _context9.abrupt("return", (console.error("[Device Store] 验证激活码失败", _context9.t2), {
                  success: !1,
                  message: _context9.t2.message || "验证失败",
                  secret_key: ""
                }));
              case 26:
              case "end":
                return _context9.stop();
            }
          }, _callee9, null, [[2, 23]]);
        }))();
      },
      getDeviceInfo: function getDeviceInfo(_ref23) {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee10() {
          var e;
          return _regeneratorRuntime2().wrap(function _callee10$(_context10) {
            while (1) switch (_context10.prev = _context10.next) {
              case 0:
                e = _ref23.dispatch;
                _context10.prev = 1;
                _context10.next = 4;
                return e("refreshDeviceInfo");
              case 4:
                return _context10.abrupt("return", _context10.sent.deviceInfo);
              case 7:
                _context10.prev = 7;
                _context10.t0 = _context10["catch"](1);
                throw console.error("[Device Store] 获取设备信息失败", _context10.t0), _context10.t0;
              case 10:
              case "end":
                return _context10.stop();
            }
          }, _callee10, null, [[1, 7]]);
        }))();
      }
    },
    getters: {
      isConnected: function isConnected(e) {
        return e.isConnected;
      },
      isConnecting: function isConnecting(e) {
        return e.isConnecting;
      },
      connectionError: function connectionError(e) {
        return e.connectionError;
      },
      connectedDevice: function connectedDevice(e) {
        return e.connectedDevice;
      },
      deviceInfo: function deviceInfo(e) {
        return e.deviceInfo;
      },
      batteryInfo: function batteryInfo(e) {
        return e.batteryInfo;
      },
      deviceStatusText: function deviceStatusText(e) {
        return e.isConnected ? "已连接" : e.isConnecting ? "连接中..." : e.connectionError ? "连接错误" : "未连接";
      },
      deviceModelName: function deviceModelName(e) {
        return e.deviceInfo && e.deviceInfo.model ? e.deviceInfo.model : "未知型号";
      },
      deviceModeName: function deviceModeName(e) {
        return e.deviceInfo && e.deviceInfo.mode ? e.deviceInfo.mode : "未知模式";
      },
      batteryStatusText: function batteryStatusText(e) {
        if (!e.batteryInfo) return "未知";
        var _e$batteryInfo = e.batteryInfo,
          t = _e$batteryInfo.level,
          c = _e$batteryInfo.isCharging;
        var n = "".concat(t || 0, "%");
        return c && (n += " (充电中)"), n;
      },
      deviceCapabilities: function deviceCapabilities(e) {
        return e.capabilities;
      },
      recentDevices: function recentDevices(e) {
        return e.recentDevices;
      },
      autoConnect: function autoConnect(e) {
        return e.autoConnect;
      },
      lastConnectedDeviceId: function lastConnectedDeviceId(e) {
        return e.lastConnectedDeviceId;
      },
      activeSlot: function activeSlot(e) {
        return e.activeSlot;
      },
      deviceSettings: function deviceSettings(e) {
        return e.deviceSettings;
      },
      shouldShowConnectionGuide: function shouldShowConnectionGuide(e) {
        return !e.isConnected && 0 === e.recentDevices.length;
      },
      licenseKey: function licenseKey(e) {
        return e.licenseKey;
      },
      isActivated: function isActivated(e) {
        return !!e.licenseKey && e.licenseKey.length > 0;
      },
      trialCount: function trialCount(e) {
        return e.trialCount;
      },
      chipId: function chipId(e) {
        return e.chipId;
      }
    }
  };exports.device = n;