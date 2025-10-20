var _regeneratorRuntime2 = require("../../@babel/runtime/helpers/regeneratorRuntime");var _toConsumableArray2 = require("../../@babel/runtime/helpers/toConsumableArray");var _asyncToGenerator2 = require("../../@babel/runtime/helpers/asyncToGenerator");var _objectSpread2 = require("../../@babel/runtime/helpers/objectSpread2");var e = require("../../common/vendor.js"),
  t = require("../../utils/chameleon-protocol.js"),
  i = require("../../services/bluetooth.js"),
  o = {
    name: "SettingsPage",
    components: {
      SettingItem: function SettingItem() {
        return "../../components/setting-item.js";
      }
    },
    data: function data() {
      return {
        deviceSettings: null,
        slotPollingConfig: new Array(16).fill(!1),
        originalSlotPollingConfig: new Array(16).fill(!1),
        loading: !1,
        currentPollingDelay: 350
      };
    },
    computed: _objectSpread2(_objectSpread2({}, e.mapGetters("device", ["isConnected", "deviceInfo", "batteryInfo", "deviceModelName", "deviceModeName", "batteryStatusText"])), {}, {
      animationOptions: function animationOptions() {
        return t.ChameleonProtocol.getAnimationOptions();
      },
      buttonConfigOptions: function buttonConfigOptions() {
        return t.ChameleonProtocol.getButtonConfigOptions();
      }
    }),
    onLoad: function onLoad() {
      this.isConnected && this.loadDeviceSettings();
    },
    onShow: function onShow() {
      if (this.isConnected) if (this.deviceSettings) {
        var _e = this.$store.getters["device/deviceSettings"];
        _e && (this.deviceSettings = _objectSpread2({}, _e));
      } else this.loadDeviceSettings();
    },
    methods: _objectSpread2(_objectSpread2({}, e.mapActions("device", ["updateDeviceSettings"])), {}, {
      goBack: function goBack() {
        e.index.navigateBack();
      },
      goToConnect: function goToConnect() {
        e.index.switchTab({
          url: "/pages/connect/connect"
        });
      },
      loadDeviceSettings: function loadDeviceSettings() {
        var _this = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
          var _e2, _t, _i;
          return _regeneratorRuntime2().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                if (!_this.isConnected) {
                  _context.next = 26;
                  break;
                }
                _this.loading = !0;
                _context.prev = 2;
                console.log("[SettingsPage] 开始加载设备设置...");
                _context.next = 6;
                return i.bluetoothService.getDeviceSettings();
              case 6:
                _e2 = _context.sent;
                console.log("[SettingsPage] 设备设置加载完成:", _e2);
                _context.next = 10;
                return _this.delay(200);
              case 10:
                _context.next = 12;
                return i.bluetoothService.getSlotPollingConfig();
              case 12:
                _t = _context.sent;
                console.log("[SettingsPage] 卡槽轮询配置:", _t), _this.deviceSettings = _e2, _this.slotPollingConfig = _toConsumableArray2(_t), _this.originalSlotPollingConfig = _toConsumableArray2(_t), _this.currentPollingDelay = _e2.autoPollingDelay || 350, _this.updateDeviceSettings(_e2), _this.$store.dispatch("device/saveSettings"), console.log("[SettingsPage] 所有设置加载完成");
                _context.next = 21;
                break;
              case 16:
                _context.prev = 16;
                _context.t0 = _context["catch"](2);
                console.error("[SettingsPage] 加载设备设置失败", _context.t0);
                _i = "加载设置失败";
                _context.t0.message.includes("超时") ? _i = "设备响应超时，请重试" : _context.t0.message.includes("未连接") && (_i = "设备连接丢失"), e.index.showToast({
                  title: _i,
                  icon: "error",
                  duration: 3e3
                }), _context.t0.message.includes("未连接") && setTimeout(function () {
                  _this.goToConnect();
                }, 1500);
              case 21:
                _context.prev = 21;
                _this.loading = !1;
                return _context.finish(21);
              case 24:
                _context.next = 27;
                break;
              case 26:
                e.index.showToast({
                  title: "设备未连接",
                  icon: "error"
                });
              case 27:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[2, 16, 21, 24]]);
        }))();
      },
      delay: function delay(e) {
        return new Promise(function (t) {
          return setTimeout(t, e);
        });
      },
      getAnimationDescription: function getAnimationDescription(e) {
        var t = this.animationOptions.find(function (t) {
          return t.value === e;
        });
        return t ? t.desc : "未知动画模式";
      },
      updateAnimation: function updateAnimation(t) {
        var _this2 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
          return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                if (!_this2.deviceSettings) {
                  _context2.next = 13;
                  break;
                }
                _context2.prev = 1;
                _context2.next = 4;
                return i.bluetoothService.setAnimationMode(t);
              case 4:
                _context2.next = 6;
                return i.bluetoothService.saveDeviceSettings();
              case 6:
                _this2.deviceSettings.animation = t;
                e.index.showToast({
                  title: "动画设置已更新",
                  icon: "success"
                });
                _context2.next = 13;
                break;
              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](1);
                console.error("[SettingsPage] 更新动画设置失败", _context2.t0), e.index.showToast({
                  title: "设置失败",
                  icon: "error"
                });
              case 13:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[1, 10]]);
        }))();
      },
      updateButtonConfig: function updateButtonConfig(o, n, s) {
        var _this3 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
          var a, l;
          return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                if (!_this3.deviceSettings) {
                  _context3.next = 23;
                  break;
                }
                _context3.prev = 1;
                a = "A" === o ? t.ButtonType.A : t.ButtonType.B;
                if (!n) {
                  _context3.next = 11;
                  break;
                }
                _context3.next = 6;
                return i.bluetoothService.setLongButtonConfig(a, s);
              case 6:
                _context3.next = 8;
                return i.bluetoothService.saveDeviceSettings();
              case 8:
                "A" === o ? _this3.deviceSettings.buttonALongPress = s : _this3.deviceSettings.buttonBLongPress = s;
                _context3.next = 16;
                break;
              case 11:
                _context3.next = 13;
                return i.bluetoothService.setButtonConfig(a, s);
              case 13:
                _context3.next = 15;
                return i.bluetoothService.saveDeviceSettings();
              case 15:
                "A" === o ? _this3.deviceSettings.buttonAPress = s : _this3.deviceSettings.buttonBPress = s;
              case 16:
                l = t.ChameleonProtocol.getButtonConfigName(s);
                e.index.showToast({
                  title: "\u6309\u94AE".concat(o).concat(n ? "长按" : "", "\u8BBE\u7F6E\u4E3A: ").concat(l),
                  icon: "success"
                });
                _context3.next = 23;
                break;
              case 20:
                _context3.prev = 20;
                _context3.t0 = _context3["catch"](1);
                console.error("[SettingsPage] 更新按钮配置失败", _context3.t0), e.index.showToast({
                  title: "设置失败",
                  icon: "error"
                });
              case 23:
              case "end":
                return _context3.stop();
            }
          }, _callee3, null, [[1, 20]]);
        }))();
      },
      updateBLEPairing: function updateBLEPairing(t) {
        var _this4 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4() {
          return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                if (!_this4.deviceSettings) {
                  _context4.next = 15;
                  break;
                }
                _context4.prev = 1;
                _context4.next = 4;
                return i.bluetoothService.setBLEPairEnabled(t);
              case 4:
                _context4.next = 6;
                return i.bluetoothService.saveDeviceSettings();
              case 6:
                _this4.deviceSettings.pairingEnabled = t;
                _this4.updateDeviceSettings(_this4.deviceSettings);
                _this4.$store.dispatch("device/saveSettings");
                e.index.showToast({
                  title: "BLE配对已" + (t ? "启用" : "禁用"),
                  icon: "success"
                });
                _context4.next = 15;
                break;
              case 12:
                _context4.prev = 12;
                _context4.t0 = _context4["catch"](1);
                console.error("[SettingsPage] 更新BLE配对设置失败", _context4.t0), e.index.showToast({
                  title: "设置失败",
                  icon: "error"
                });
              case 15:
              case "end":
                return _context4.stop();
            }
          }, _callee4, null, [[1, 12]]);
        }))();
      },
      showBLEKeyDialog: function showBLEKeyDialog() {
        e.index.showModal({
          title: "设置BLE连接密钥",
          editable: !0,
          placeholderText: "请输入6位数字密钥",
          success: function () {
            var _success = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5(t) {
              var _n, s;
              return _regeneratorRuntime2().wrap(function _callee5$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                  case 0:
                    if (!(t.confirm && t.content)) {
                      _context5.next = 18;
                      break;
                    }
                    _n = t.content.trim();
                    if (/^\d{6}$/.test(_n)) {
                      _context5.next = 4;
                      break;
                    }
                    return _context5.abrupt("return", void e.index.showToast({
                      title: "密钥必须是6位数字",
                      icon: "error"
                    }));
                  case 4:
                    s = parseInt(_n);
                    if (!(s <= 0 || s > 4294967295)) {
                      _context5.next = 7;
                      break;
                    }
                    return _context5.abrupt("return", void e.index.showToast({
                      title: "密钥数值超出范围",
                      icon: "error"
                    }));
                  case 7:
                    _context5.prev = 7;
                    _context5.next = 10;
                    return i.bluetoothService.setBLEConnectKey(_n);
                  case 10:
                    _context5.next = 12;
                    return i.bluetoothService.saveDeviceSettings();
                  case 12:
                    e.index.showToast({
                      title: "BLE密钥设置成功",
                      icon: "success"
                    });
                    _context5.next = 18;
                    break;
                  case 15:
                    _context5.prev = 15;
                    _context5.t0 = _context5["catch"](7);
                    console.error("[SettingsPage] 设置BLE密钥失败", _context5.t0), e.index.showToast({
                      title: "设置失败",
                      icon: "error"
                    });
                  case 18:
                  case "end":
                    return _context5.stop();
                }
              }, _callee5, null, [[7, 15]]);
            }));
            function success(_x) {
              return _success.apply(this, arguments);
            }
            return success;
          }()
        });
      },
      updateAutoPolling: function updateAutoPolling(t) {
        var _this5 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee6() {
          return _regeneratorRuntime2().wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                if (!_this5.deviceSettings) {
                  _context6.next = 13;
                  break;
                }
                _context6.prev = 1;
                _context6.next = 4;
                return i.bluetoothService.setAutoPolling(t);
              case 4:
                _context6.next = 6;
                return i.bluetoothService.saveDeviceSettings();
              case 6:
                _this5.deviceSettings.autoPolling = t;
                e.index.showToast({
                  title: "自动轮询已" + (t ? "启用" : "禁用"),
                  icon: "success"
                });
                _context6.next = 13;
                break;
              case 10:
                _context6.prev = 10;
                _context6.t0 = _context6["catch"](1);
                console.error("[SettingsPage] 更新自动轮询设置失败", _context6.t0), e.index.showToast({
                  title: "设置失败",
                  icon: "error"
                });
              case 13:
              case "end":
                return _context6.stop();
            }
          }, _callee6, null, [[1, 10]]);
        }))();
      },
      updateICPolling: function updateICPolling(t) {
        var _this6 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee7() {
          return _regeneratorRuntime2().wrap(function _callee7$(_context7) {
            while (1) switch (_context7.prev = _context7.next) {
              case 0:
                if (!_this6.deviceSettings) {
                  _context7.next = 13;
                  break;
                }
                _context7.prev = 1;
                _context7.next = 4;
                return i.bluetoothService.setICPolling(t);
              case 4:
                _context7.next = 6;
                return i.bluetoothService.saveDeviceSettings();
              case 6:
                _this6.deviceSettings.icPollingEnabled = t;
                e.index.showToast({
                  title: "IC轮询已" + (t ? "启用" : "禁用"),
                  icon: "success"
                });
                _context7.next = 13;
                break;
              case 10:
                _context7.prev = 10;
                _context7.t0 = _context7["catch"](1);
                console.error("[SettingsPage] 更新IC轮询设置失败", _context7.t0), e.index.showToast({
                  title: "设置失败",
                  icon: "error"
                });
              case 13:
              case "end":
                return _context7.stop();
            }
          }, _callee7, null, [[1, 10]]);
        }))();
      },
      updateIDPolling: function updateIDPolling(t) {
        var _this7 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee8() {
          return _regeneratorRuntime2().wrap(function _callee8$(_context8) {
            while (1) switch (_context8.prev = _context8.next) {
              case 0:
                if (!_this7.deviceSettings) {
                  _context8.next = 13;
                  break;
                }
                _context8.prev = 1;
                _context8.next = 4;
                return i.bluetoothService.setIDPolling(t);
              case 4:
                _context8.next = 6;
                return i.bluetoothService.saveDeviceSettings();
              case 6:
                _this7.deviceSettings.idPollingEnabled = t;
                e.index.showToast({
                  title: "ID轮询已" + (t ? "启用" : "禁用"),
                  icon: "success"
                });
                _context8.next = 13;
                break;
              case 10:
                _context8.prev = 10;
                _context8.t0 = _context8["catch"](1);
                console.error("[SettingsPage] 更新ID轮询设置失败", _context8.t0), e.index.showToast({
                  title: "设置失败",
                  icon: "error"
                });
              case 13:
              case "end":
                return _context8.stop();
            }
          }, _callee8, null, [[1, 10]]);
        }))();
      },
      onPollingDelayInput: function onPollingDelayInput(e) {
        this.currentPollingDelay = e.detail.value;
      },
      updatePollingDelay: function updatePollingDelay(t) {
        var _this8 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee9() {
          var o;
          return _regeneratorRuntime2().wrap(function _callee9$(_context9) {
            while (1) switch (_context9.prev = _context9.next) {
              case 0:
                if (_this8.deviceSettings) {
                  _context9.next = 2;
                  break;
                }
                return _context9.abrupt("return");
              case 2:
                o = t.detail.value;
                _context9.prev = 3;
                _context9.next = 6;
                return i.bluetoothService.setAutoPollingDelay(o);
              case 6:
                _context9.next = 8;
                return i.bluetoothService.saveDeviceSettings();
              case 8:
                _this8.deviceSettings.pollingDelay = o;
                _this8.currentPollingDelay = o;
                e.index.showToast({
                  title: "\u8F6E\u8BE2\u5EF6\u8FDF\u5DF2\u8BBE\u7F6E\u4E3A ".concat(o, "ms"),
                  icon: "success"
                });
                _context9.next = 16;
                break;
              case 13:
                _context9.prev = 13;
                _context9.t0 = _context9["catch"](3);
                console.error("[SettingsPage] 更新轮询延迟设置失败", _context9.t0), e.index.showToast({
                  title: "设置失败",
                  icon: "error"
                });
              case 16:
              case "end":
                return _context9.stop();
            }
          }, _callee9, null, [[3, 13]]);
        }))();
      },
      toggleSlotPolling: function toggleSlotPolling(e) {
        var t = !this.slotPollingConfig[e];
        this.$set(this.slotPollingConfig, e, t);
      },
      hasSlotPollingChanges: function hasSlotPollingChanges() {
        for (var _e3 = 0; _e3 < 16; _e3++) if (this.slotPollingConfig[_e3] !== this.originalSlotPollingConfig[_e3]) return !0;
        return !1;
      },
      saveSlotPollingConfig: function saveSlotPollingConfig() {
        var _this9 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee10() {
          return _regeneratorRuntime2().wrap(function _callee10$(_context10) {
            while (1) switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                e.index.showLoading({
                  title: "保存中..."
                });
                _context10.next = 4;
                return i.bluetoothService.setSlotPollingConfigListAndSave(_this9.slotPollingConfig);
              case 4:
                _this9.originalSlotPollingConfig = _toConsumableArray2(_this9.slotPollingConfig);
                e.index.hideLoading();
                e.index.showToast({
                  title: "卡槽轮询配置已保存",
                  icon: "success"
                });
                _context10.next = 12;
                break;
              case 9:
                _context10.prev = 9;
                _context10.t0 = _context10["catch"](0);
                console.error("[SettingsPage] 保存卡槽轮询配置失败", _context10.t0), e.index.hideLoading(), e.index.showToast({
                  title: "保存失败",
                  icon: "error"
                });
              case 12:
              case "end":
                return _context10.stop();
            }
          }, _callee10, null, [[0, 9]]);
        }))();
      },
      resetSlotPollingConfig: function resetSlotPollingConfig() {
        this.slotPollingConfig = _toConsumableArray2(this.originalSlotPollingConfig);
      },
      updateCompatible8Slots: function updateCompatible8Slots(t) {
        var _this10 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee11() {
          return _regeneratorRuntime2().wrap(function _callee11$(_context11) {
            while (1) switch (_context11.prev = _context11.next) {
              case 0:
                if (!_this10.deviceSettings) {
                  _context11.next = 15;
                  break;
                }
                _context11.prev = 1;
                _context11.next = 4;
                return i.bluetoothService.setCompatible8Slots(t);
              case 4:
                _context11.next = 6;
                return i.bluetoothService.saveDeviceSettings();
              case 6:
                _this10.deviceSettings.compatible8Slots = t;
                _this10.updateDeviceSettings(_this10.deviceSettings);
                _this10.$store.dispatch("device/saveSettings");
                e.index.showToast({
                  title: "8卡槽兼容模式已" + (t ? "启用" : "禁用"),
                  icon: "success"
                });
                _context11.next = 15;
                break;
              case 12:
                _context11.prev = 12;
                _context11.t0 = _context11["catch"](1);
                console.error("[SettingsPage] 更新8卡槽兼容模式失败", _context11.t0), e.index.showToast({
                  title: "设置失败",
                  icon: "error"
                }), _this10.deviceSettings.compatible8Slots = !t;
              case 15:
              case "end":
                return _context11.stop();
            }
          }, _callee11, null, [[1, 12]]);
        }))();
      },
      refreshSettings: function refreshSettings() {
        var _this11 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee12() {
          return _regeneratorRuntime2().wrap(function _callee12$(_context12) {
            while (1) switch (_context12.prev = _context12.next) {
              case 0:
                _context12.prev = 0;
                e.index.showLoading({
                  title: "刷新中..."
                });
                _context12.next = 4;
                return _this11.loadDeviceSettings();
              case 4:
                e.index.hideLoading();
                e.index.showToast({
                  title: "设置已刷新",
                  icon: "success"
                });
                _context12.next = 11;
                break;
              case 8:
                _context12.prev = 8;
                _context12.t0 = _context12["catch"](0);
                console.error("[SettingsPage] 刷新设置失败", _context12.t0), e.index.hideLoading(), e.index.showToast({
                  title: "刷新失败",
                  icon: "error"
                });
              case 11:
              case "end":
                return _context12.stop();
            }
          }, _callee12, null, [[0, 8]]);
        }))();
      },
      goToFirmwarePage: function goToFirmwarePage() {
        e.index.navigateTo({
          url: "/pages/firmware/firmware"
        });
      },
      enterDFUMode: function enterDFUMode() {
        var _this12 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee14() {
          return _regeneratorRuntime2().wrap(function _callee14$(_context14) {
            while (1) switch (_context14.prev = _context14.next) {
              case 0:
                if (_this12.isConnected) try {
                  e.index.showModal({
                    title: "进入DFU模式",
                    content: "设备将进入DFU模式，这将断开当前连接。是否继续？",
                    success: function () {
                      var _success2 = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee13(t) {
                        return _regeneratorRuntime2().wrap(function _callee13$(_context13) {
                          while (1) switch (_context13.prev = _context13.next) {
                            case 0:
                              if (!t.confirm) {
                                _context13.next = 13;
                                break;
                              }
                              e.index.showLoading({
                                title: "正在进入DFU模式...",
                                mask: !0
                              });
                              _context13.prev = 2;
                              _context13.next = 5;
                              return i.bluetoothService.enterDFUMode();
                            case 5:
                              e.index.hideLoading();
                              e.index.showToast({
                                title: "已进入DFU模式",
                                icon: "success"
                              });
                              setTimeout(function () {
                                e.index.switchTab({
                                  url: "/pages/connect/connect"
                                });
                              }, 1500);
                              _context13.next = 13;
                              break;
                            case 10:
                              _context13.prev = 10;
                              _context13.t0 = _context13["catch"](2);
                              e.index.hideLoading(), console.error("[SettingsPage] 进入DFU模式失败", _context13.t0), e.index.showToast({
                                title: "进入DFU模式失败: " + _context13.t0.message,
                                icon: "none",
                                duration: 3e3
                              });
                            case 13:
                            case "end":
                              return _context13.stop();
                          }
                        }, _callee13, null, [[2, 10]]);
                      }));
                      function success(_x2) {
                        return _success2.apply(this, arguments);
                      }
                      return success;
                    }()
                  });
                } catch (t) {
                  console.error("[SettingsPage] 进入DFU模式失败", t), e.index.showToast({
                    title: "操作失败: " + t.message,
                    icon: "none",
                    duration: 3e3
                  });
                } else e.index.showToast({
                  title: "设备未连接",
                  icon: "error"
                });
              case 1:
              case "end":
                return _context14.stop();
            }
          }, _callee14);
        }))();
      }
    })
  };if (!Array) {
  (e.resolveComponent("uni-icons") + e.resolveComponent("uni-load-more") + e.resolveComponent("setting-item"))();
}Math || (function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
} + function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.js";
})();var n = e._export_sfc(o, [["render", function (t, i, o, n, s, a) {
  return e.e({
    a: !t.isConnected
  }, t.isConnected ? e.e({
    d: s.loading
  }, s.loading ? {
    e: e.p({
      status: "loading",
      "content-text": "正在加载设备设置..."
    })
  } : s.deviceSettings ? e.e({
    g: e.p({
      type: "gear-filled",
      size: "20",
      color: "#667eea"
    }),
    h: e.t(t.deviceModelName),
    i: e.t(t.deviceInfo ? t.deviceInfo.version : "未知"),
    j: e.t(t.deviceModeName),
    k: e.t(t.batteryStatusText),
    l: e.p({
      type: "gear-filled",
      size: "20",
      color: "#667eea"
    }),
    m: e.f(a.animationOptions, function (t, i, o) {
      return {
        a: e.t(t.label),
        b: t.value,
        c: s.deviceSettings.animation === t.value ? 1 : "",
        d: e.o(function (e) {
          return a.updateAnimation(t.value);
        }, t.value)
      };
    }),
    n: e.t(a.getAnimationDescription(s.deviceSettings.animation)),
    o: e.p({
      type: "gear",
      size: "20",
      color: "#667eea"
    }),
    p: e.o(function (e) {
      return a.updateButtonConfig("A", !1, e);
    }),
    q: e.p({
      label: "按钮A (短按)",
      options: a.buttonConfigOptions,
      value: s.deviceSettings.buttonAPress
    }),
    r: e.o(function (e) {
      return a.updateButtonConfig("B", !1, e);
    }),
    s: e.p({
      label: "按钮B (短按)",
      options: a.buttonConfigOptions,
      value: s.deviceSettings.buttonBPress
    }),
    t: e.o(function (e) {
      return a.updateButtonConfig("A", !0, e);
    }),
    v: e.p({
      label: "按钮A (长按)",
      options: a.buttonConfigOptions,
      value: s.deviceSettings.buttonALongPress
    }),
    w: e.o(function (e) {
      return a.updateButtonConfig("B", !0, e);
    }),
    x: e.p({
      label: "按钮B (长按)",
      options: a.buttonConfigOptions,
      value: s.deviceSettings.buttonBLongPress
    }),
    y: e.p({
      type: "wifi",
      size: "20",
      color: "#667eea"
    }),
    z: s.deviceSettings.pairingEnabled,
    A: e.o(function (e) {
      return a.updateBLEPairing(e.detail.value);
    }),
    B: s.deviceSettings.pairingEnabled
  }, s.deviceSettings.pairingEnabled ? {
    C: e.o(function () {
      return a.showBLEKeyDialog && a.showBLEKeyDialog.apply(a, arguments);
    })
  } : {}, {
    D: s.deviceSettings.pairingEnabled
  }, (s.deviceSettings.pairingEnabled, {}), {
    E: e.p({
      type: "loop",
      size: "20",
      color: "#667eea"
    }),
    F: s.deviceSettings.autoPolling,
    G: e.o(function (e) {
      return a.updateAutoPolling(e.detail.value);
    }),
    H: s.deviceSettings.icPollingEnabled,
    I: e.o(function (e) {
      return a.updateICPolling(e.detail.value);
    }),
    J: s.deviceSettings.idPollingEnabled,
    K: e.o(function (e) {
      return a.updateIDPolling(e.detail.value);
    }),
    L: e.t(s.currentPollingDelay),
    M: s.currentPollingDelay,
    N: e.o(function () {
      return a.onPollingDelayInput && a.onPollingDelayInput.apply(a, arguments);
    }),
    O: e.o(function () {
      return a.updatePollingDelay && a.updatePollingDelay.apply(a, arguments);
    }),
    P: e.p({
      type: "folder",
      size: "20",
      color: "#667eea"
    }),
    Q: e.f(s.slotPollingConfig, function (t, i, o) {
      return {
        a: e.t(i + 1),
        b: t ? 1 : "",
        c: i,
        d: t ? 1 : "",
        e: e.o(function (e) {
          return a.toggleSlotPolling(i);
        }, i)
      };
    }),
    R: a.hasSlotPollingChanges()
  }, a.hasSlotPollingChanges() ? {
    S: e.p({
      type: "checkmarkempty",
      size: "16",
      color: "#fff"
    }),
    T: e.o(function () {
      return a.saveSlotPollingConfig && a.saveSlotPollingConfig.apply(a, arguments);
    }),
    U: e.p({
      type: "refreshempty",
      size: "16",
      color: "#666"
    }),
    V: e.o(function () {
      return a.resetSlotPollingConfig && a.resetSlotPollingConfig.apply(a, arguments);
    })
  } : {}, {
    W: e.p({
      type: "settings",
      size: "20",
      color: "#667eea"
    }),
    X: s.deviceSettings.compatible8Slots,
    Y: e.o(function (e) {
      return a.updateCompatible8Slots(e.detail.value);
    }),
    Z: e.p({
      type: "download",
      size: "20",
      color: "#667eea"
    }),
    aa: e.p({
      type: "refresh",
      size: "16",
      color: "#fff"
    }),
    ab: e.o(function () {
      return a.goToFirmwarePage && a.goToFirmwarePage.apply(a, arguments);
    }),
    ac: e.p({
      type: "gear",
      size: "16",
      color: "#fff"
    }),
    ad: e.o(function () {
      return a.enterDFUMode && a.enterDFUMode.apply(a, arguments);
    }),
    ae: e.p({
      type: "refreshempty",
      size: "18",
      color: "#666"
    }),
    af: e.o(function () {
      return a.refreshSettings && a.refreshSettings.apply(a, arguments);
    })
  }) : {
    ag: e.p({
      type: "closeempty",
      size: "60",
      color: "#ff5722"
    }),
    ah: e.o(function () {
      return a.loadDeviceSettings && a.loadDeviceSettings.apply(a, arguments);
    })
  }, {
    f: s.deviceSettings
  }) : {
    b: e.p({
      type: "info",
      size: "60",
      color: "#999"
    }),
    c: e.o(function () {
      return a.goToConnect && a.goToConnect.apply(a, arguments);
    })
  });
}], ["__scopeId", "data-v-3baa783e"]]);wx.createPage(n);