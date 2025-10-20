var _slicedToArray2 = require("../../@babel/runtime/helpers/slicedToArray");var _regeneratorRuntime2 = require("../../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../../@babel/runtime/helpers/asyncToGenerator");var _objectSpread2 = require("../../@babel/runtime/helpers/objectSpread2");var e = require("../../common/vendor.js"),
  o = require("../../services/bluetooth.js"),
  t = require("../../utils/chameleon-protocol.js"),
  i = require("../../utils/firmware.js"),
  n = {
    name: "ConnectPage",
    data: function data() {
      return {
        isScanning: !1,
        isConnected: !1,
        isConnecting: !1,
        foundDevices: [],
        connectedDevice: null,
        deviceInfo: null,
        batteryInfo: {},
        activationDialogVisible: !1,
        activationCode: "",
        activationError: "",
        activationLoading: !1,
        scanTimer: null,
        lastScanTime: 0,
        firmwareDialogVisible: !1,
        firmwareCheckDone: !1,
        updateInfo: {
          hasUpdate: !1,
          version: "",
          notes: "",
          downloadUrl: ""
        },
        updateCheckDone: !1,
        loadingText: {
          contentdown: "正在扫描设备...",
          contentrefresh: "扫描中...",
          contentnomore: "没有更多设备"
        }
      };
    },
    computed: _objectSpread2({
      statusClass: function statusClass() {
        return this.isConnected ? "status-connected" : this.isConnecting ? "status-connecting" : this.isScanning ? "status-scanning" : "status-disconnected";
      },
      statusText: function statusText() {
        return this.isConnected ? "已连接" : this.isConnecting ? "连接中..." : this.isScanning ? "扫描中..." : "未连接";
      },
      isDFU: function isDFU() {
        return o.bluetoothService.isDFU;
      }
    }, e.mapGetters("device", ["isConnected", "deviceInfo", "batteryInfo", "licenseKey", "isActivated", "trialCount", "chipId"])),
    onLoad: function onLoad() {
      this.initBluetooth();
    },
    onShow: function onShow() {
      this.isConnected || this.startScan(), this.isConnected && this.loadActivationInfo();
    },
    onUnload: function onUnload() {
      this.cleanup();
    },
    onHide: function onHide() {
      this.isScanning && this.stopScan();
    },
    methods: _objectSpread2(_objectSpread2({}, e.mapActions("device", ["getLicenseKey", "getTrialCount", "getDeviceChipID", "verifyActivationCode", "getDeviceInfo"])), {}, {
      initBluetooth: function initBluetooth() {
        var _this = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
          return _regeneratorRuntime2().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                console.log("[ConnectPage] 初始化蓝牙服务...");
                o.bluetoothService.on("deviceFound", _this.onDeviceFound);
                o.bluetoothService.on("connected", _this.onDeviceConnected);
                o.bluetoothService.on("disconnected", _this.onDeviceDisconnected);
                o.bluetoothService.on("error", _this.onBluetoothError);
                _context.next = 8;
                return o.bluetoothService.initialize();
              case 8:
                console.log("[ConnectPage] 蓝牙服务初始化完成");
                _this.checkConnectionStatus();
                _context.next = 15;
                break;
              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](0);
                console.error("[ConnectPage] 蓝牙初始化失败", _context.t0), _this.showError("蓝牙初始化失败: " + _context.t0.message);
              case 15:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[0, 12]]);
        }))();
      },
      startScan: function startScan() {
        var _this2 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
          return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                console.log("[ConnectPage] 开始扫描设备...");
                _this2.foundDevices = [];
                _this2.isScanning = !0;
                _this2.lastScanTime = Date.now();
                _context2.next = 7;
                return o.bluetoothService.startScan();
              case 7:
                _this2.scanTimer = setTimeout(function () {
                  _this2.stopScan();
                }, 1e4);
                _context2.next = 13;
                break;
              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](0);
                console.error("[ConnectPage] 扫描失败", _context2.t0), _this2.isScanning = !1, _this2.showError("扫描失败: " + _context2.t0.message);
              case 13:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[0, 10]]);
        }))();
      },
      stopScan: function stopScan() {
        var _this3 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
          return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return o.bluetoothService.stopScan();
              case 3:
                _this3.isScanning = !1;
                _this3.scanTimer && (clearTimeout(_this3.scanTimer), _this3.scanTimer = null);
                console.log("[ConnectPage] 停止扫描");
                _context3.next = 11;
                break;
              case 8:
                _context3.prev = 8;
                _context3.t0 = _context3["catch"](0);
                console.error("[ConnectPage] 停止扫描失败", _context3.t0);
              case 11:
              case "end":
                return _context3.stop();
            }
          }, _callee3, null, [[0, 8]]);
        }))();
      },
      connectDevice: function connectDevice(t) {
        var _this4 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4() {
          return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                console.log("[ConnectPage] 连接设备", t);
                _this4.isConnecting = !0;
                e.index.showLoading({
                  title: "正在连接设备...",
                  mask: !0
                });
                _context4.next = 6;
                return _this4.stopScan();
              case 6:
                _context4.next = 8;
                return o.bluetoothService.connectToDevice(t);
              case 8:
                console.log("[ConnectPage] 设备连接成功");
                _this4.checkFirmwareCompatibility();
                _context4.next = 15;
                break;
              case 12:
                _context4.prev = 12;
                _context4.t0 = _context4["catch"](0);
                console.error("[ConnectPage] 连接失败", _context4.t0), _this4.isConnecting = !1, e.index.hideLoading(), _this4.showError("连接失败: " + _context4.t0.message);
              case 15:
              case "end":
                return _context4.stop();
            }
          }, _callee4, null, [[0, 12]]);
        }))();
      },
      disconnect: function disconnect() {
        var _this5 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5() {
          return _regeneratorRuntime2().wrap(function _callee5$(_context5) {
            while (1) switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return o.bluetoothService.disconnect();
              case 3:
                _this5.connectedDevice = null;
                _this5.deviceInfo = null;
                _this5.batteryInfo = {};
                _this5.isConnected = !1;
                e.index.showToast({
                  title: "已断开连接",
                  icon: "success"
                });
                _context5.next = 13;
                break;
              case 10:
                _context5.prev = 10;
                _context5.t0 = _context5["catch"](0);
                console.error("[ConnectPage] 断开连接失败", _context5.t0), _this5.showError("断开连接失败: " + _context5.t0.message);
              case 13:
              case "end":
                return _context5.stop();
            }
          }, _callee5, null, [[0, 10]]);
        }))();
      },
      refreshDeviceInfo: function refreshDeviceInfo() {
        var _this6 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee6() {
          var _yield$Promise$all, _yield$Promise$all2, _t, _i;
          return _regeneratorRuntime2().wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                if (!_this6.isConnected) {
                  _context6.next = 15;
                  break;
                }
                _context6.prev = 1;
                e.index.showLoading({
                  title: "正在获取设备信息...",
                  mask: !1
                });
                _context6.next = 5;
                return Promise.all([_this6.getDeviceInfo(), o.bluetoothService.getBatteryInfo()]);
              case 5:
                _yield$Promise$all = _context6.sent;
                _yield$Promise$all2 = _slicedToArray2(_yield$Promise$all, 2);
                _t = _yield$Promise$all2[0];
                _i = _yield$Promise$all2[1];
                _this6.deviceInfo = _t, _this6.batteryInfo = _i, console.log("[ConnectPage] 设备信息已更新", _t, _i), _this6.$store.commit("device/SET_DEVICE_INFO", _t), _this6.$store.commit("device/SET_BATTERY_INFO", _i), e.index.hideLoading(), _this6.checkForUpdates();
                _context6.next = 15;
                break;
              case 12:
                _context6.prev = 12;
                _context6.t0 = _context6["catch"](1);
                console.error("[ConnectPage] 获取设备信息失败", _context6.t0), e.index.hideLoading(), _this6.showError("获取设备信息失败: " + _context6.t0.message);
              case 15:
              case "end":
                return _context6.stop();
            }
          }, _callee6, null, [[1, 12]]);
        }))();
      },
      checkConnectionStatus: function checkConnectionStatus() {
        this.isConnected = o.bluetoothService.isConnected, this.isConnected && (this.connectedDevice = o.bluetoothService.connectedDevice, this.refreshDeviceInfo());
      },
      onDeviceFound: function onDeviceFound(e) {
        console.log("[ConnectPage] 发现设备", e);
        var o = this.foundDevices.findIndex(function (o) {
          return o.deviceId === e.deviceId;
        });
        e.lastSeen = Date.now(), o >= 0 ? this.foundDevices.splice(o, 1, e) : this.foundDevices.push(e), this.foundDevices.sort(function (e, o) {
          return (o.RSSI || -100) - (e.RSSI || -100);
        });
      },
      onDeviceConnected: function onDeviceConnected(t) {
        var _this7 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee7() {
          return _regeneratorRuntime2().wrap(function _callee7$(_context7) {
            while (1) switch (_context7.prev = _context7.next) {
              case 0:
                if (!(console.log("[ConnectPage] 设备连接成功", t), _this7.isConnecting = !1, _this7.isConnected = !0, _this7.connectedDevice = t, e.index.hideLoading(), _this7.foundDevices = [], _this7.$store.commit("device/SET_CONNECTED_DEVICE", t), _this7.$store.commit("device/SET_CONNECTION_STATUS", !0), o.bluetoothService.isDFU)) {
                  _context7.next = 2;
                  break;
                }
                return _context7.abrupt("return", (console.log("[ConnectPage] 设备处于 DFU 模式，显示固件损坏提示"), void _this7.$refs.dfuPopup.open()));
              case 2:
                e.index.showToast({
                  title: "设备连接成功",
                  icon: "success",
                  duration: 1500
                });
                _context7.next = 5;
                return _this7.delay(1e3);
              case 5:
                _context7.prev = 5;
                console.log("[ConnectPage] 开始获取设备信息");
                _context7.next = 9;
                return _this7.getDeviceInfoWithRetry();
              case 9:
                _context7.t0 = _this7.isDFU;
                if (_context7.t0) {
                  _context7.next = 19;
                  break;
                }
                console.log("[ConnectPage] 开始加载激活信息");
                _context7.next = 14;
                return _this7.loadActivationInfo();
              case 14:
                console.log("[ConnectPage] 准备检查固件更新");
                _context7.next = 17;
                return _this7.delay(1e3);
              case 17:
                _context7.next = 19;
                return _this7.checkForUpdates();
              case 19:
                _context7.next = 24;
                break;
              case 21:
                _context7.prev = 21;
                _context7.t1 = _context7["catch"](5);
                console.error("[ConnectPage] 获取设备信息或激活信息失败", _context7.t1);
              case 24:
              case "end":
                return _context7.stop();
            }
          }, _callee7, null, [[5, 21]]);
        }))();
      },
      getDeviceInfoWithRetry: function getDeviceInfoWithRetry() {
        var _arguments = arguments,
          _this8 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee8() {
          var e, t, i, _i2, _n;
          return _regeneratorRuntime2().wrap(function _callee8$(_context8) {
            while (1) switch (_context8.prev = _context8.next) {
              case 0:
                e = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : 3;
                t = 0, i = null;
              case 2:
                if (!(t <= e)) {
                  _context8.next = 24;
                  break;
                }
                _context8.prev = 3;
                if (!(console.log("[ConnectPage] \u5C1D\u8BD5\u83B7\u53D6\u8BBE\u5907\u4FE1\u606F (\u5C1D\u8BD5 ".concat(t + 1, "/").concat(e + 1, ")")), !o.bluetoothService.isConnected)) {
                  _context8.next = 6;
                  break;
                }
                throw new Error("设备未连接");
              case 6:
                _context8.next = 8;
                return _this8.getDeviceInfo();
              case 8:
                _i2 = _context8.sent;
                _context8.next = 11;
                return o.bluetoothService.getBatteryInfo();
              case 11:
                _n = _context8.sent;
                return _context8.abrupt("return", (_this8.deviceInfo = _i2, _this8.batteryInfo = _n, _this8.$store.commit("device/SET_DEVICE_INFO", _i2), _this8.$store.commit("device/SET_BATTERY_INFO", _n), console.log("[ConnectPage] 成功获取设备信息:", _i2), _i2));
              case 15:
                _context8.prev = 15;
                _context8.t0 = _context8["catch"](3);
                if (!(console.error("[ConnectPage] \u83B7\u53D6\u8BBE\u5907\u4FE1\u606F\u5931\u8D25 (\u5C1D\u8BD5 ".concat(t + 1, "/").concat(e + 1, ")"), _context8.t0), i = _context8.t0, _context8.t0.message.includes("设备未连接"))) {
                  _context8.next = 19;
                  break;
                }
                return _context8.abrupt("break", 24);
              case 19:
                _context8.next = 21;
                return _this8.delay(1e3);
              case 21:
                t++;
              case 22:
                _context8.next = 2;
                break;
              case 24:
                throw i || new Error("无法获取设备信息");
              case 25:
              case "end":
                return _context8.stop();
            }
          }, _callee8, null, [[3, 15]]);
        }))();
      },
      delay: function delay(e) {
        return new Promise(function (o) {
          return setTimeout(o, e);
        });
      },
      checkFirmwareCompatibility: function checkFirmwareCompatibility() {
        var _this9 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee9() {
          var _e;
          return _regeneratorRuntime2().wrap(function _callee9$(_context9) {
            while (1) switch (_context9.prev = _context9.next) {
              case 0:
                if (!_this9.isConnected) {
                  _context9.next = 12;
                  break;
                }
                _context9.prev = 1;
                console.log("[ConnectPage] 检查固件兼容性");
                _context9.next = 5;
                return o.bluetoothService.getCustomGitCommitHash();
              case 5:
                _e = _context9.sent;
                console.log("[ConnectPage] 自定义固件版本:", _e), i.isFirmwareCompatible(_e) ? (console.log("[ConnectPage] 固件兼容"), _this9.firmwareCheckDone = !0) : (console.warn("[ConnectPage] 固件不兼容:", _e), _this9.showFirmwareDialog());
                _context9.next = 12;
                break;
              case 9:
                _context9.prev = 9;
                _context9.t0 = _context9["catch"](1);
                console.error("[ConnectPage] 检查固件兼容性失败:", _context9.t0), _this9.showFirmwareDialog();
              case 12:
              case "end":
                return _context9.stop();
            }
          }, _callee9, null, [[1, 9]]);
        }))();
      },
      onDeviceDisconnected: function onDeviceDisconnected(o) {
        console.log("[ConnectPage] 设备断开连接", o), this.isConnected = !1, this.connectedDevice = null, this.deviceInfo = null, this.batteryInfo = {}, this.$store.commit("device/SET_CONNECTION_STATUS", !1), this.$store.commit("device/SET_CONNECTED_DEVICE", null), e.index.showToast({
          title: "设备已断开",
          icon: "none"
        });
      },
      onBluetoothError: function onBluetoothError(o) {
        console.error("[ConnectPage] 蓝牙错误", o), this.isConnecting = !1, e.index.hideLoading(), this.showError("蓝牙错误: " + o.message);
      },
      formatTime: function formatTime(e) {
        if (!e) return "未知";
        var o = Date.now() - e;
        if (o < 1e3) return "刚刚";
        if (o < 6e4) return Math.floor(o / 1e3) + "秒前";
        if (o < 36e5) return Math.floor(o / 6e4) + "分钟前";
        return new Date(e).toLocaleTimeString();
      },
      getModelName: function getModelName(e) {
        return t.ChameleonProtocol.getDeviceModelName(e);
      },
      getModeName: function getModeName(e) {
        return t.ChameleonProtocol.getDeviceModeName(e);
      },
      showError: function showError(o) {
        e.index.showModal({
          title: "错误",
          content: o,
          showCancel: !1
        });
      },
      goBack: function goBack() {
        e.index.navigateBack();
      },
      loadActivationInfo: function loadActivationInfo() {
        var _this10 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee10() {
          var _o, _t2, _i3;
          return _regeneratorRuntime2().wrap(function _callee10$(_context10) {
            while (1) switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                if (!_this10.isConnected) {
                  _context10.next = 15;
                  break;
                }
                e.index.showLoading({
                  title: "加载中...",
                  mask: !0
                }), console.log("[ConnectPage] 开始获取激活码");
                _context10.next = 5;
                return _this10.getLicenseKey();
              case 5:
                _o = _context10.sent;
                console.log("[ConnectPage] 获取激活码结果:", _o ? "已激活" : "未激活"), console.log("[ConnectPage] 开始获取试用次数");
                _context10.next = 9;
                return _this10.getTrialCount();
              case 9:
                _t2 = _context10.sent;
                console.log("[ConnectPage] 获取试用次数结果:", _t2), console.log("[ConnectPage] 开始获取设备芯片ID");
                _context10.next = 13;
                return _this10.getDeviceChipID();
              case 13:
                _i3 = _context10.sent;
                return _context10.abrupt("return", (console.log("[ConnectPage] 获取设备芯片ID结果:", _i3), e.index.hideLoading(), {
                  licenseKey: _o,
                  trialCount: _t2,
                  chipId: _i3
                }));
              case 15:
                _context10.next = 20;
                break;
              case 17:
                _context10.prev = 17;
                _context10.t0 = _context10["catch"](0);
                return _context10.abrupt("return", (console.error("[ConnectPage] 加载激活信息失败", _context10.t0), null));
              case 20:
              case "end":
                return _context10.stop();
            }
          }, _callee10, null, [[0, 17]]);
        }))();
      },
      showActivationDialog: function showActivationDialog() {
        var _this11 = this;
        this.activationDialogVisible = !0, this.activationCode = "", this.activationError = "", this.$nextTick(function () {
          _this11.$refs.activationPopup.open();
        });
      },
      hideActivationDialog: function hideActivationDialog() {
        var _this12 = this;
        this.$refs.activationPopup.close(), setTimeout(function () {
          _this12.activationDialogVisible = !1;
        }, 200);
      },
      submitActivationCode: function submitActivationCode() {
        var _this13 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee11() {
          var _i4, _n2;
          return _regeneratorRuntime2().wrap(function _callee11$(_context11) {
            while (1) switch (_context11.prev = _context11.next) {
              case 0:
                if (!_this13.activationCode) {
                  _context11.next = 38;
                  break;
                }
                if (!(12 === _this13.activationCode.length)) {
                  _context11.next = 35;
                  break;
                }
                _this13.activationLoading = !0;
                _context11.prev = 3;
                _i4 = "轮询固件 v1.0.0";
                _context11.prev = 5;
                _context11.next = 8;
                return o.bluetoothService.getCustomGitCommitHash();
              case 8:
                _i4 = _context11.sent;
                _context11.next = 14;
                break;
              case 11:
                _context11.prev = 11;
                _context11.t0 = _context11["catch"](5);
                console.error("[ConnectPage] 获取自定义版本失败", _context11.t0);
              case 14:
                _context11.next = 16;
                return _this13.verifyActivationCode({
                  code: _this13.activationCode,
                  firmwareVersion: _i4
                });
              case 16:
                _n2 = _context11.sent;
                if (!_n2.success) {
                  _context11.next = 24;
                  break;
                }
                e.index.showToast({
                  title: "激活成功",
                  icon: "success"
                });
                _this13.hideActivationDialog();
                _context11.next = 22;
                return _this13.loadActivationInfo();
              case 22:
                _context11.next = 25;
                break;
              case 24:
                _this13.activationError = _n2.message || "激活失败";
              case 25:
                _context11.next = 30;
                break;
              case 27:
                _context11.prev = 27;
                _context11.t1 = _context11["catch"](3);
                console.error("[ConnectPage] 激活失败", _context11.t1), _this13.activationError = "激活失败: " + _context11.t1.message;
              case 30:
                _context11.prev = 30;
                _this13.activationLoading = !1;
                return _context11.finish(30);
              case 33:
                _context11.next = 36;
                break;
              case 35:
                _this13.activationError = "激活码必须为12位";
              case 36:
                _context11.next = 39;
                break;
              case 38:
                _this13.activationError = "请输入激活码";
              case 39:
              case "end":
                return _context11.stop();
            }
          }, _callee11, null, [[3, 27, 30, 33], [5, 11]]);
        }))();
      },
      cleanup: function cleanup() {
        o.bluetoothService.off("deviceFound", this.onDeviceFound), o.bluetoothService.off("connected", this.onDeviceConnected), o.bluetoothService.off("disconnected", this.onDeviceDisconnected), o.bluetoothService.off("error", this.onBluetoothError), this.scanTimer && (clearTimeout(this.scanTimer), this.scanTimer = null), this.isScanning && this.stopScan();
      },
      copyText: function copyText(o) {
        var _this14 = this;
        e.index.setClipboardData({
          data: o,
          success: function success() {
            e.index.showToast({
              title: "已复制到剪贴板",
              icon: "success"
            });
          },
          fail: function fail(e) {
            console.error("[ConnectPage] 复制文本失败", e), _this14.showError("复制文本失败");
          }
        });
      },
      showFirmwareDialog: function showFirmwareDialog() {
        this.firmwareDialogVisible = !0, this.$refs.firmwarePopup.open();
      },
      hideFirmwareDialog: function hideFirmwareDialog() {
        this.firmwareDialogVisible = !1, this.$refs.firmwarePopup.close();
      },
      flashFirmware: function flashFirmware() {
        console.log("[ConnectPage] 开始自动刷入兼容固件");
        var o = this.connectedDevice;
        console.log("[ConnectPage] 当前连接的设备:", o), e.index.navigateTo({
          url: "/pages/firmware/firmware?autoFlash=true",
          success: function success(e) {
            console.log("[ConnectPage] 跳转到固件页面成功，将自动开始刷入固件");
            try {
              var _t3 = e.eventChannel;
              console.log("[ConnectPage] 事件通道:", _t3), _t3 && _t3.emit ? (console.log("[ConnectPage] 正在传递设备信息"), _t3.emit("flashDevice", o)) : console.error("[ConnectPage] 无法获取事件通道或emit方法不存在");
            } catch (t) {
              console.error("[ConnectPage] 传递设备信息时出错:", t);
            }
          },
          fail: function fail(o) {
            console.error("[ConnectPage] 跳转到固件页面失败", o), e.index.showToast({
              title: "跳转固件页面失败",
              icon: "none"
            });
          }
        });
      },
      hideDFUDialog: function hideDFUDialog(e) {
        console.log("[ConnectPage] 隐藏 DFU 对话框", e), this.$refs.dfuPopup.close(), "cancel" === e && (o.bluetoothService.disconnect(), this.isConnecting = !1, this.isConnected = !1, this.connectedDevice = null, this.$store.commit("device/SET_CONNECTED_DEVICE", null), this.$store.commit("device/SET_CONNECTION_STATUS", !1));
      },
      flashDFUFirmware: function flashDFUFirmware() {
        var _this15 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee12() {
          var o;
          return _regeneratorRuntime2().wrap(function _callee12$(_context12) {
            while (1) switch (_context12.prev = _context12.next) {
              case 0:
                console.log("[ConnectPage] 开始刷入 DFU 固件");
                o = _this15.connectedDevice;
                console.log("[ConnectPage] 当前连接的DFU设备:", o), e.index.navigateTo({
                  url: "/pages/firmware/firmware?autoDFU=true",
                  success: function success(e) {
                    console.log("[ConnectPage] 跳转到固件页面成功，将自动开始刷入固件");
                    try {
                      var _t4 = e.eventChannel;
                      console.log("[ConnectPage] 事件通道:", _t4), _t4 && _t4.emit ? (console.log("[ConnectPage] 正在传递DFU设备信息"), _t4.emit("dfuDevice", o)) : console.error("[ConnectPage] 无法获取事件通道或emit方法不存在");
                    } catch (t) {
                      console.error("[ConnectPage] 传递DFU设备信息时出错:", t);
                    }
                  },
                  fail: function fail(o) {
                    console.error("[ConnectPage] 跳转到固件页面失败", o), e.index.showToast({
                      title: "跳转固件页面失败",
                      icon: "none"
                    });
                  }
                });
              case 3:
              case "end":
                return _context12.stop();
            }
          }, _callee12);
        }))();
      },
      checkForUpdates: function checkForUpdates() {
        var _this16 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee13() {
          var _e2, _e3, _o2;
          return _regeneratorRuntime2().wrap(function _callee13$(_context13) {
            while (1) switch (_context13.prev = _context13.next) {
              case 0:
                if (!(_this16.isConnected && _this16.deviceInfo)) {
                  _context13.next = 29;
                  break;
                }
                if (_this16.chipId) {
                  _context13.next = 14;
                  break;
                }
                console.log("[ConnectPage] 芯片ID为空，尝试重新获取");
                _context13.prev = 3;
                _context13.next = 6;
                return _this16.getDeviceChipID();
              case 6:
                _e2 = _context13.sent;
                if (!(console.log("[ConnectPage] 重新获取芯片ID结果:", _e2), !_e2)) {
                  _context13.next = 9;
                  break;
                }
                return _context13.abrupt("return", void console.log("[ConnectPage] 无法获取芯片ID，取消检查更新"));
              case 9:
                _context13.next = 14;
                break;
              case 11:
                _context13.prev = 11;
                _context13.t0 = _context13["catch"](3);
                return _context13.abrupt("return", void console.error("[ConnectPage] 获取芯片ID失败:", _context13.t0));
              case 14:
                console.log("[ConnectPage] 开始检查固件更新，芯片ID:", _this16.chipId);
                _context13.prev = 15;
                _e3 = _this16.deviceInfo.version;
                console.log("[ConnectPage] 当前固件版本:", _e3);
                _context13.next = 20;
                return i.checkFirmwareUpdate(_e3, _this16.chipId);
              case 20:
                _o2 = _context13.sent;
                _o2 && _o2.need_update ? (console.log("[ConnectPage] 发现新版本:", _o2), _this16.updateInfo = {
                  hasUpdate: !0,
                  version: _o2.firmware_info.version || "未知版本",
                  downloadUrl: _o2.firmware_info.download_url || ""
                }, _this16.showUpdateDialog()) : console.log("[ConnectPage] 已是最新版本"), _this16.updateCheckDone = !0;
                _context13.next = 27;
                break;
              case 24:
                _context13.prev = 24;
                _context13.t1 = _context13["catch"](15);
                console.error("[ConnectPage] 检查更新失败:", _context13.t1);
              case 27:
                _context13.next = 30;
                break;
              case 29:
                console.log("[ConnectPage] 无法检查更新：设备未连接或缺少设备信息");
              case 30:
              case "end":
                return _context13.stop();
            }
          }, _callee13, null, [[3, 11], [15, 24]]);
        }))();
      },
      showUpdateDialog: function showUpdateDialog() {
        this.$refs.updatePopup.open();
      },
      hideUpdateDialog: function hideUpdateDialog() {
        this.$refs.updatePopup.close();
      },
      goToUpdateFirmware: function goToUpdateFirmware() {
        e.index.navigateTo({
          url: "/pages/firmware/firmware?updateUrl=" + encodeURIComponent(this.updateInfo.downloadUrl)
        });
      }
    })
  };if (!Array) {
  (e.resolveComponent("uni-icons") + e.resolveComponent("uni-load-more") + e.resolveComponent("uni-popup-dialog") + e.resolveComponent("uni-popup"))();
}Math || (function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
} + function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.js";
} + function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-popup-dialog/uni-popup-dialog.js";
} + function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
})();var c = e._export_sfc(n, [["render", function (o, t, i, n, c, s) {
  return e.e({
    a: c.isConnected
  }, c.isConnected ? e.e({
    b: e.p({
      type: o.isActivated ? "checkmarkempty" : "info",
      size: "16",
      color: o.isActivated ? "#4CAF50" : "#FF9800"
    }),
    c: e.t(o.isActivated ? "已激活" : "未激活"),
    d: e.o(s.loadActivationInfo),
    e: e.p({
      type: "refresh",
      size: "30",
      color: "#666"
    }),
    f: o.isActivated
  }, o.isActivated ? {
    g: e.t(o.licenseKey),
    h: e.o(function (e) {
      return s.copyText(o.licenseKey);
    }),
    i: e.p({
      type: "paperplane",
      size: "14",
      color: "#666"
    }),
    j: e.t(o.chipId || "未知"),
    k: e.o(function (e) {
      return s.copyText(o.chipId);
    }),
    l: e.p({
      type: "paperplane",
      size: "14",
      color: "#666"
    })
  } : {
    m: e.t(o.trialCount.remainingCount || "未知"),
    n: e.t(o.chipId || "未知"),
    o: e.p({
      type: "paperplane",
      size: "14",
      color: "#666"
    }),
    p: e.o(function (e) {
      return s.copyText(o.chipId);
    })
  }, {
    q: !o.isActivated
  }, o.isActivated ? {} : {
    r: e.t(c.isConnected ? "激活" : "请先连接"),
    s: e.o(function () {
      return s.showActivationDialog && s.showActivationDialog.apply(s, arguments);
    }),
    t: !c.isConnected
  }, {
    v: o.isActivated ? 1 : ""
  }) : {}, {
    w: e.t(s.statusText),
    x: e.n(s.statusClass),
    y: c.connectedDevice
  }, c.connectedDevice ? {
    z: e.t(c.connectedDevice.name),
    A: e.t(c.connectedDevice.deviceId),
    B: e.t(c.connectedDevice.RSSI)
  } : {}, {
    C: !c.isConnected
  }, c.isConnected ? {} : {
    D: e.t(c.isScanning ? "正在扫描..." : "扫描设备"),
    E: c.isScanning,
    F: e.o(function () {
      return s.startScan && s.startScan.apply(s, arguments);
    })
  }, {
    G: c.isConnected
  }, c.isConnected ? {
    H: e.o(function () {
      return s.disconnect && s.disconnect.apply(s, arguments);
    })
  } : {}, {
    I: !c.isConnected
  }, c.isConnected ? {} : e.e({
    J: e.t(c.foundDevices.length),
    K: 0 === c.foundDevices.length && !c.isScanning
  }, 0 !== c.foundDevices.length || c.isScanning ? {} : {
    L: e.p({
      type: "bluetooth",
      size: "60",
      color: "#cccccc"
    })
  }, {
    M: c.isScanning
  }, c.isScanning ? {
    N: e.p({
      status: "loading",
      "content-text": c.loadingText
    })
  } : {}, {
    O: c.foundDevices.length > 0
  }, c.foundDevices.length > 0 ? {
    P: e.f(c.foundDevices, function (o, t, i) {
      return {
        a: e.t(o.name || "未知设备"),
        b: e.t(o.deviceId),
        c: e.t(o.RSSI),
        d: "b4f65ab7-7-" + i,
        e: e.t(s.formatTime(o.lastSeen)),
        f: o.deviceId,
        g: e.o(function (e) {
          return s.connectDevice(o);
        }, o.deviceId)
      };
    }),
    Q: e.p({
      type: "right",
      size: "16",
      color: "#cccccc"
    })
  } : {}), {
    R: c.isConnected && c.deviceInfo
  }, c.isConnected && c.deviceInfo ? {
    S: e.o(s.refreshDeviceInfo),
    T: e.p({
      type: "refresh",
      size: "30"
    }),
    U: e.t(c.deviceInfo.version || "未知"),
    V: e.t(c.deviceInfo.model || "未知"),
    W: e.t(c.batteryInfo.level || "未知"),
    X: e.t(c.deviceInfo.mode || "未知")
  } : {}, {
    Y: c.activationLoading,
    Z: c.activationCode,
    aa: e.o(function (e) {
      return c.activationCode = e.detail.value;
    }),
    ab: c.activationError
  }, c.activationError ? {
    ac: e.t(c.activationError)
  } : {}, {
    ad: c.activationLoading
  }, c.activationLoading ? {
    ae: e.p({
      status: "loading",
      "content-text": {
        contentdown: "激活中..."
      }
    })
  } : {}, {
    af: e.o(s.hideActivationDialog),
    ag: e.o(s.submitActivationCode),
    ah: e.p({
      type: "info",
      title: "设备激活",
      "before-close": !0
    }),
    ai: e.sr("activationPopup", "b4f65ab7-9"),
    aj: c.activationDialogVisible,
    ak: e.p({
      type: "dialog",
      "mask-click": !1,
      animation: !0
    }),
    al: e.o(s.hideFirmwareDialog),
    am: e.o(s.flashFirmware),
    an: e.p({
      type: "warning",
      title: "固件不兼容",
      confirmText: "刷入固件",
      "before-close": !0
    }),
    ao: e.sr("firmwarePopup", "b4f65ab7-12"),
    ap: e.p({
      type: "dialog",
      "mask-click": !1,
      animation: !0
    }),
    aq: e.o(s.hideDFUDialog),
    ar: e.o(s.flashDFUFirmware),
    as: e.p({
      type: "warning",
      title: "固件可能已损坏",
      cancelText: "取消",
      confirmText: "刷入最新固件",
      "before-close": !0
    }),
    at: e.sr("dfuPopup", "b4f65ab7-14"),
    av: e.p({
      type: "dialog",
      "mask-click": !1,
      animation: !0
    }),
    aw: e.t(c.updateInfo.version || ""),
    ax: c.updateInfo.notes
  }, c.updateInfo.notes ? {
    ay: e.t(c.updateInfo.notes)
  } : {}, {
    az: e.o(s.hideUpdateDialog),
    aA: e.o(s.goToUpdateFirmware),
    aB: e.p({
      type: "info",
      title: "发现新固件",
      cancelText: "稍后再说",
      confirmText: "立即更新",
      "before-close": !0
    }),
    aC: e.sr("updatePopup", "b4f65ab7-16"),
    aD: e.p({
      type: "dialog",
      "mask-click": !1,
      animation: !0
    })
  });
}], ["__scopeId", "data-v-b4f65ab7"]]);wx.createPage(c);