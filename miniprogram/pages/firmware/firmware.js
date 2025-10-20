var _regeneratorRuntime2 = require("../../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../../@babel/runtime/helpers/asyncToGenerator");var _objectSpread2 = require("../../@babel/runtime/helpers/objectSpread2");var e = require("../../common/vendor.js"),
  t = require("../../services/bluetooth.js"),
  a = require("../../utils/dfu.js"),
  i = require("../../utils/firmware.js"),
  s = {
    name: "FirmwarePage",
    data: function data() {
      return {
        isChecking: !1,
        isUpdating: !1,
        updateProgress: 0,
        updateAvailable: !1,
        updateInfo: null,
        updateStatusText: '点击"检查更新"按钮获取最新固件',
        updateSuccess: !1,
        updateResultMessage: "",
        chipId: "",
        customVersion: "",
        isFlashing: !1,
        progress: 0
      };
    },
    computed: _objectSpread2({}, e.mapGetters("device", ["isConnected", "deviceInfo", "deviceModelName"])),
    onLoad: function onLoad(e) {
      var _this = this;
      if (console.log("[FirmwarePage] 页面加载，参数:", e), this.loadDeviceInfo(), e && "true" === e.autoDFU) {
        console.log("[FirmwarePage] 检测到autoDFU参数，准备自动开始刷入最新DFU固件");
        try {
          var _e = this.getOpenerEventChannel();
          if (console.log("[FirmwarePage] 事件通道:", _e), _e && _e.on) {
            var _t = !1;
            _e.on("dfuDevice", function (e) {
              console.log("[FirmwarePage] 接收到DFU设备信息:", e), _t = !0, setTimeout(function () {
                _this.flashLatestDFUFirmware(e);
              }, 500);
            }), setTimeout(function () {
              _t || (console.log("[FirmwarePage] 未在超时时间内接收到DFU设备信息，将自动扫描DFU设备"), _this.flashLatestDFUFirmware());
            }, 3e3);
          } else console.log("[FirmwarePage] 未获取到事件通道，将自动扫描DFU设备"), setTimeout(function () {
            _this.flashLatestDFUFirmware();
          }, 500);
        } catch (t) {
          console.error("[FirmwarePage] 处理自动DFU参数时出错:", t), setTimeout(function () {
            _this.flashLatestDFUFirmware();
          }, 500);
        }
      }
      if (e && "true" === e.autoFlash) {
        console.log("[FirmwarePage] 检测到autoFlash参数，准备自动开始刷入兼容固件");
        try {
          var _e2 = this.getOpenerEventChannel();
          if (console.log("[FirmwarePage] 事件通道:", _e2), _e2 && _e2.on) {
            var _t2 = !1;
            _e2.on("flashDevice", function (e) {
              console.log("[FirmwarePage] 接收到flash设备信息:", e), _t2 = !0, setTimeout(function () {
                _this.autoFlashCompatibleFirmware(e);
              }, 500);
            }), setTimeout(function () {
              _t2 || (console.log("[FirmwarePage] 未在超时时间内接收到flash设备信息，将使用当前连接设备"), _this.autoFlashCompatibleFirmware());
            }, 3e3);
          } else console.log("[FirmwarePage] 未获取到事件通道，将使用当前连接设备"), setTimeout(function () {
            _this.autoFlashCompatibleFirmware();
          }, 500);
        } catch (t) {
          console.error("[FirmwarePage] 处理自动Flash参数时出错:", t), setTimeout(function () {
            _this.autoFlashCompatibleFirmware();
          }, 500);
        }
      }
    },
    methods: {
      goBack: function goBack() {
        e.index.navigateBack();
      },
      goToConnect: function goToConnect() {
        e.index.switchTab({
          url: "/pages/connect/connect"
        });
      },
      loadDeviceInfo: function loadDeviceInfo() {
        var _this2 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
          return _regeneratorRuntime2().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                if (!t.bluetoothService.isDFU) {
                  _context.next = 4;
                  break;
                }
                console.log("[FirmwarePage] DFU模式，跳过加载设备信息");
                _context.next = 24;
                break;
              case 4:
                if (!_this2.isConnected) {
                  _context.next = 24;
                  break;
                }
                _context.prev = 5;
                _context.next = 8;
                return t.bluetoothService.getDeviceChipID();
              case 8:
                _this2.chipId = _context.sent;
                _context.prev = 9;
                _context.next = 12;
                return t.bluetoothService.getCustomGitCommitHash();
              case 12:
                _this2.customVersion = _context.sent;
                _context.next = 18;
                break;
              case 15:
                _context.prev = 15;
                _context.t0 = _context["catch"](9);
                console.error("[FirmwarePage] 获取自定义版本失败", _context.t0), _this2.customVersion = "";
              case 18:
                console.log("[FirmwarePage] 设备信息加载完成", {
                  chipId: _this2.chipId,
                  customVersion: _this2.customVersion
                });
                _context.next = 24;
                break;
              case 21:
                _context.prev = 21;
                _context.t1 = _context["catch"](5);
                console.error("[FirmwarePage] 加载设备信息失败", _context.t1), _this2.showError("加载设备信息失败: " + _context.t1.message);
              case 24:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[5, 21], [9, 15]]);
        }))();
      },
      checkUpdate: function checkUpdate() {
        var _this3 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
          return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                if (!(!_this3.isChecking && !_this3.isUpdating)) {
                  _context2.next = 20;
                  break;
                }
                _this3.isChecking = !0, _this3.updateStatusText = "正在检查更新...";
                _context2.prev = 2;
                _context2.t0 = _this3.chipId;
                if (_context2.t0) {
                  _context2.next = 7;
                  break;
                }
                _context2.next = 7;
                return _this3.loadDeviceInfo();
              case 7:
                _context2.next = 9;
                return i.checkFirmwareUpdate(_this3.customVersion, _this3.chipId);
              case 9:
                _this3.updateInfo = _context2.sent;
                _this3.updateInfo.need_update ? (_this3.updateAvailable = !0, _this3.updateStatusText = "\u53D1\u73B0\u65B0\u7248\u672C: ".concat(_this3.updateInfo.firmware_info.version)) : (_this3.updateAvailable = !1, _this3.updateStatusText = _this3.updateInfo.message || "当前已是最新版本");
                console.log("[FirmwarePage] 检查更新结果", _this3.updateInfo);
                _context2.next = 17;
                break;
              case 14:
                _context2.prev = 14;
                _context2.t1 = _context2["catch"](2);
                console.error("[FirmwarePage] 检查更新失败", _context2.t1), _this3.updateStatusText = "检查更新失败: " + _context2.t1.message;
              case 17:
                _context2.prev = 17;
                _this3.isChecking = !1;
                return _context2.finish(17);
              case 20:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[2, 14, 17, 20]]);
        }))();
      },
      startUpdate: function startUpdate() {
        var _this4 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
          var _s, _yield$i$unpackFirmwa, _o, r, u, _a, n;
          return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                if (!(!_this4.isUpdating && _this4.updateAvailable)) {
                  _context3.next = 87;
                  break;
                }
                _this4.isUpdating = !0, _this4.updateProgress = 0, _this4.updateStatusText = "准备下载固件...";
                _context3.prev = 2;
                _this4.updateStatusText = "正在下载固件...";
                _context3.next = 6;
                return i.downloadFirmware(_this4.updateInfo.firmware_info.download_url);
              case 6:
                _s = _context3.sent;
                _this4.updateStatusText = "正在解析固件...";
                _context3.next = 10;
                return i.unpackFirmware(_s);
              case 10:
                _yield$i$unpackFirmwa = _context3.sent;
                _o = _yield$i$unpackFirmwa.applicationDat;
                r = _yield$i$unpackFirmwa.applicationBin;
                i.validateFirmware(_o, r), _this4.updateStatusText = "正在进入 DFU 模式...";
                _context3.prev = 14;
                _context3.next = 17;
                return t.bluetoothService.enterDFUMode();
              case 17:
                _this4.updateStatusText = "等待设备进入 DFU 模式...";
                _context3.next = 20;
                return _this4.delay(3e3);
              case 20:
                _context3.next = 30;
                break;
              case 22:
                _context3.prev = 22;
                _context3.t0 = _context3["catch"](14);
                if (!(!_context3.t0.message.includes("超时") && !_context3.t0.message.includes("重启"))) {
                  _context3.next = 26;
                  break;
                }
                throw _context3.t0;
              case 26:
                console.log("[FirmwarePage] 设备可能已进入DFU模式，继续流程");
                _this4.updateStatusText = "设备正在重启进入 DFU 模式...";
                _context3.next = 30;
                return _this4.delay(3e3);
              case 30:
                _this4.updateStatusText = "正在扫描 DFU 设备...";
                _context3.next = 33;
                return t.bluetoothService.initialize();
              case 33:
                _context3.next = 35;
                return t.bluetoothService.startScan();
              case 35:
                _context3.next = 37;
                return _this4.scanDFUDevice();
              case 37:
                u = _context3.sent;
                if (u) {
                  _context3.next = 40;
                  break;
                }
                throw new Error("未找到 DFU 模式的设备，请重试");
              case 40:
                _this4.updateStatusText = "正在连接 DFU 设备...";
                _context3.prev = 41;
                _context3.next = 44;
                return t.bluetoothService.connectToDevice(u);
              case 44:
                _context3.next = 62;
                break;
              case 46:
                _context3.prev = 46;
                _context3.t1 = _context3["catch"](41);
                console.error("[FirmwarePage] 首次连接DFU设备失败，尝试重新扫描", _context3.t1);
                _this4.updateStatusText = "重新扫描 DFU 设备...";
                _context3.next = 52;
                return _this4.delay(2e3);
              case 52:
                _context3.next = 54;
                return t.bluetoothService.startScan();
              case 54:
                _context3.next = 56;
                return _this4.scanDFUDevice();
              case 56:
                _a = _context3.sent;
                if (_a) {
                  _context3.next = 59;
                  break;
                }
                throw new Error("重新扫描未找到 DFU 设备，请重启设备后重试");
              case 59:
                _this4.updateStatusText = "重新连接 DFU 设备...";
                _context3.next = 62;
                return t.bluetoothService.connectToDevice(_a);
              case 62:
                n = new a.DFUCommunicator(t.bluetoothService);
                _this4.updateStatusText = "正在刷入固件...";
                _context3.next = 66;
                return n.flashFirmware(1, _o, function (e) {
                  _this4.updateProgress = Math.floor(e / 2), _this4.updateStatusText = "\u6B63\u5728\u5237\u5165\u56FA\u4EF6 (1/2): ".concat(2 * _this4.updateProgress, "%");
                });
              case 66:
                _context3.next = 68;
                return n.flashFirmware(2, r, function (e) {
                  _this4.updateProgress = 50 + Math.floor(e / 2), _this4.updateStatusText = "\u6B63\u5728\u5237\u5165\u56FA\u4EF6 (2/2): ".concat(e, "%");
                });
              case 68:
                _this4.updateProgress = 100;
                _this4.updateStatusText = "固件更新完成，设备正在重启...";
                _context3.next = 72;
                return _this4.delay(3e3);
              case 72:
                _this4.updateSuccess = !0;
                _this4.updateResultMessage = "固件已成功更新到最新版本，设备将重新连接。";
                _this4.$refs.resultPopup.open();
                _context3.next = 77;
                return t.bluetoothService.initialize();
              case 77:
                _context3.next = 79;
                return t.bluetoothService.startScan();
              case 79:
                _context3.next = 84;
                break;
              case 81:
                _context3.prev = 81;
                _context3.t2 = _context3["catch"](2);
                console.error("[FirmwarePage] 更新固件失败", _context3.t2), _this4.updateSuccess = !1, _this4.updateResultMessage = "更新失败: " + _context3.t2.message, _this4.$refs.resultPopup.open(), _this4.updateStatusText = "更新失败: " + _context3.t2.message;
              case 84:
                _context3.prev = 84;
                _this4.isUpdating = !1;
                return _context3.finish(84);
              case 87:
              case "end":
                return _context3.stop();
            }
          }, _callee3, null, [[2, 81, 84, 87], [14, 22], [41, 46]]);
        }))();
      },
      scanDFUDevice: function scanDFUDevice() {
        var _this5 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5() {
          return _regeneratorRuntime2().wrap(function _callee5$(_context5) {
            while (1) switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", new Promise(function (e) {
                  var a = 0,
                    i = [];
                  var s = function s(e) {
                    e.name && (e.name.startsWith("CU-") || e.name.startsWith("CL-")) && (console.log("[FirmwarePage] 发现DFU设备:", e), i.push(e));
                  };
                  t.bluetoothService.on("deviceFound", s);
                  var o = setInterval( /*#__PURE__*/_asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4() {
                    return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
                      while (1) switch (_context4.prev = _context4.next) {
                        case 0:
                          if (!(a++, i.length > 0)) {
                            _context4.next = 2;
                            break;
                          }
                          return _context4.abrupt("return", (clearInterval(o), t.bluetoothService.off("deviceFound", s), void e(i[0])));
                        case 2:
                          if (!(a >= 15)) {
                            _context4.next = 4;
                            break;
                          }
                          return _context4.abrupt("return", (clearInterval(o), t.bluetoothService.off("deviceFound", s), void e(null)));
                        case 4:
                          if (!(_this5.updateStatusText = "\u6B63\u5728\u626B\u63CFDFU\u8BBE\u5907 (".concat(a, "/15)..."), a % 3 == 0)) {
                            _context4.next = 17;
                            break;
                          }
                          _context4.prev = 5;
                          _context4.next = 8;
                          return t.bluetoothService.stopScan();
                        case 8:
                          _context4.next = 10;
                          return _this5.delay(500);
                        case 10:
                          _context4.next = 12;
                          return t.bluetoothService.startScan();
                        case 12:
                          _context4.next = 17;
                          break;
                        case 14:
                          _context4.prev = 14;
                          _context4.t0 = _context4["catch"](5);
                          console.error("[FirmwarePage] 重新启动扫描失败", _context4.t0);
                        case 17:
                        case "end":
                          return _context4.stop();
                      }
                    }, _callee4, null, [[5, 14]]);
                  })), 1e3);
                }));
              case 1:
              case "end":
                return _context5.stop();
            }
          }, _callee5);
        }))();
      },
      closeResultDialog: function closeResultDialog() {
        this.$refs.resultPopup.close(), this.updateSuccess && e.index.switchTab({
          url: "/pages/connect/connect"
        });
      },
      showError: function showError(t) {
        e.index.showToast({
          title: t,
          icon: "none",
          duration: 3e3
        });
      },
      delay: function delay(e) {
        return new Promise(function (t) {
          return setTimeout(t, e);
        });
      },
      flashLatestDFUFirmware: function flashLatestDFUFirmware() {
        var _arguments = arguments,
          _this6 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee6() {
          var e, _o2, _e3, _yield$i$unpackFirmwa2, r, u, _e4, n;
          return _regeneratorRuntime2().wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                e = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : null;
                if (!_this6.isUpdating) {
                  _context6.next = 3;
                  break;
                }
                return _context6.abrupt("return", (console.log("[FirmwarePage] 已经在更新中，忽略重复调用"), !1));
              case 3:
                _this6.isUpdating = !0, _this6.updateProgress = 0, _this6.updateStatusText = "准备下载最新DFU固件...";
                _context6.prev = 4;
                _this6.updateStatusText = "正在下载最新DFU固件...";
                _o2 = null;
                _e3 = 1;
              case 8:
                if (!(_e3 <= 3)) {
                  _context6.next = 28;
                  break;
                }
                _context6.prev = 9;
                console.log("[FirmwarePage] \u5C1D\u8BD5\u4E0B\u8F7D\u56FA\u4EF6 (".concat(_e3, "/3)"));
                _context6.next = 13;
                return i.downloadLatestDFUFirmware();
              case 13:
                _o2 = _context6.sent;
                console.log("[FirmwarePage] 固件下载成功，数据大小:", _o2.byteLength);
                return _context6.abrupt("break", 28);
              case 18:
                _context6.prev = 18;
                _context6.t0 = _context6["catch"](9);
                if (!(console.error("[FirmwarePage] \u7B2C".concat(_e3, "\u6B21\u4E0B\u8F7D\u56FA\u4EF6\u5931\u8D25:"), _context6.t0), 3 === _e3)) {
                  _context6.next = 22;
                  break;
                }
                throw new Error("下载固件失败，请检查网络连接后重试");
              case 22:
                _this6.updateStatusText = "\u4E0B\u8F7D\u5931\u8D25\uFF0C\u6B63\u5728\u91CD\u8BD5 (".concat(_e3, "/3)...");
                _context6.next = 25;
                return _this6.delay(2e3);
              case 25:
                _e3++;
                _context6.next = 8;
                break;
              case 28:
                if (_o2 && _o2 instanceof ArrayBuffer) {
                  _context6.next = 30;
                  break;
                }
                throw new Error("下载的固件数据无效");
              case 30:
                _this6.updateStatusText = "正在解析固件...";
                _context6.next = 33;
                return i.unpackFirmware(_o2);
              case 33:
                _yield$i$unpackFirmwa2 = _context6.sent;
                r = _yield$i$unpackFirmwa2.applicationDat;
                u = _yield$i$unpackFirmwa2.applicationBin;
                i.validateFirmware(r, u);
                _context6.t1 = e;
                if (_context6.t1) {
                  _context6.next = 48;
                  break;
                }
                _this6.updateStatusText = "正在初始化蓝牙...";
                _context6.next = 42;
                return t.bluetoothService.initialize();
              case 42:
                _this6.updateStatusText = "正在扫描DFU设备...";
                _context6.next = 45;
                return t.bluetoothService.startScan();
              case 45:
                _context6.next = 47;
                return _this6.scanDFUDevice();
              case 47:
                _context6.t1 = e = _context6.sent;
              case 48:
                if (_context6.t1) {
                  _context6.next = 50;
                  break;
                }
                throw new Error("未找到DFU模式的设备，请确保设备已进入DFU模式");
              case 50:
                if (!(!t.bluetoothService.isConnected || t.bluetoothService.deviceId !== e.deviceId)) {
                  _context6.next = 73;
                  break;
                }
                _this6.updateStatusText = "正在连接DFU设备...";
                _context6.prev = 52;
                _context6.next = 55;
                return t.bluetoothService.connectToDevice(e);
              case 55:
                _context6.next = 73;
                break;
              case 57:
                _context6.prev = 57;
                _context6.t2 = _context6["catch"](52);
                console.error("[FirmwarePage] 首次连接DFU设备失败，尝试重新扫描", _context6.t2);
                _this6.updateStatusText = "重新扫描DFU设备...";
                _context6.next = 63;
                return _this6.delay(2e3);
              case 63:
                _context6.next = 65;
                return t.bluetoothService.startScan();
              case 65:
                _context6.next = 67;
                return _this6.scanDFUDevice();
              case 67:
                _e4 = _context6.sent;
                if (_e4) {
                  _context6.next = 70;
                  break;
                }
                throw new Error("重新扫描未找到DFU设备，请重启设备后重试");
              case 70:
                _this6.updateStatusText = "重新连接DFU设备...";
                _context6.next = 73;
                return t.bluetoothService.connectToDevice(_e4);
              case 73:
                n = new a.DFUCommunicator(t.bluetoothService);
                _this6.updateStatusText = "正在刷入固件...";
                _context6.next = 77;
                return n.flashFirmware(1, r, function (e) {
                  _this6.updateProgress = Math.floor(e / 2), _this6.updateStatusText = "\u6B63\u5728\u5237\u5165\u56FA\u4EF6(1/2): ".concat(2 * _this6.updateProgress, "%");
                });
              case 77:
                _context6.next = 79;
                return n.flashFirmware(2, u, function (e) {
                  _this6.updateProgress = 50 + Math.floor(e / 2), _this6.updateStatusText = "\u6B63\u5728\u5237\u5165\u56FA\u4EF6(2/2): ".concat(e, "%");
                });
              case 79:
                _this6.updateProgress = 100;
                _this6.updateStatusText = "固件更新完成，设备正在重启...";
                _context6.next = 83;
                return _this6.delay(3e3);
              case 83:
                _this6.updateSuccess = !0;
                _this6.updateResultMessage = "最新固件已成功刷入，设备将重新连接。";
                _this6.$refs.resultPopup.open();
                _context6.next = 88;
                return t.bluetoothService.initialize();
              case 88:
                _context6.next = 90;
                return t.bluetoothService.startScan();
              case 90:
                return _context6.abrupt("return", !0);
              case 93:
                _context6.prev = 93;
                _context6.t3 = _context6["catch"](4);
                return _context6.abrupt("return", (console.error("[FirmwarePage] 刷入最新DFU固件失败", _context6.t3), _this6.updateSuccess = !1, _this6.updateResultMessage = "刷入失败: " + _context6.t3.message, _this6.$refs.resultPopup.open(), _this6.updateStatusText = "刷入失败: " + _context6.t3.message, !1));
              case 96:
                _context6.prev = 96;
                _this6.isUpdating = !1;
                return _context6.finish(96);
              case 99:
              case "end":
                return _context6.stop();
            }
          }, _callee6, null, [[4, 93, 96, 99], [9, 18], [52, 57]]);
        }))();
      },
      updateProgress: function updateProgress(e) {
        this.progress = e;
      },
      autoFlashCompatibleFirmware: function autoFlashCompatibleFirmware() {
        var _arguments2 = arguments,
          _this7 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee7() {
          var e, _o3, _e5, _yield$i$unpackFirmwa3, r, u, n, _e6, c;
          return _regeneratorRuntime2().wrap(function _callee7$(_context7) {
            while (1) switch (_context7.prev = _context7.next) {
              case 0:
                e = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : null;
                if (!_this7.isUpdating) {
                  _context7.next = 3;
                  break;
                }
                return _context7.abrupt("return", (console.log("[FirmwarePage] 已经在更新中，忽略重复调用"), !1));
              case 3:
                _this7.isUpdating = !0, _this7.updateProgress = 0, _this7.updateStatusText = "准备自动刷入兼容固件...";
                _context7.prev = 4;
                if (!(!e && _this7.isConnected && (e = {
                  deviceId: t.bluetoothService.deviceId,
                  name: t.bluetoothService.deviceName
                }, console.log("[FirmwarePage] 使用当前连接设备:", e)), !e)) {
                  _context7.next = 7;
                  break;
                }
                throw new Error("未找到设备信息，无法进行自动刷入");
              case 7:
                _this7.updateStatusText = "正在下载最新兼容固件...";
                _o3 = null;
                _e5 = 1;
              case 10:
                if (!(_e5 <= 3)) {
                  _context7.next = 30;
                  break;
                }
                _context7.prev = 11;
                console.log("[FirmwarePage] \u5C1D\u8BD5\u4E0B\u8F7D\u517C\u5BB9\u56FA\u4EF6 (".concat(_e5, "/3)"));
                _context7.next = 15;
                return i.downloadLatestDFUFirmware();
              case 15:
                _o3 = _context7.sent;
                console.log("[FirmwarePage] 兼容固件下载成功，数据大小:", _o3.byteLength);
                return _context7.abrupt("break", 30);
              case 20:
                _context7.prev = 20;
                _context7.t0 = _context7["catch"](11);
                if (!(console.error("[FirmwarePage] \u7B2C".concat(_e5, "\u6B21\u4E0B\u8F7D\u517C\u5BB9\u56FA\u4EF6\u5931\u8D25:"), _context7.t0), 3 === _e5)) {
                  _context7.next = 24;
                  break;
                }
                throw new Error("下载兼容固件失败，请检查网络连接后重试");
              case 24:
                _this7.updateStatusText = "\u4E0B\u8F7D\u5931\u8D25\uFF0C\u6B63\u5728\u91CD\u8BD5 (".concat(_e5, "/3)...");
                _context7.next = 27;
                return _this7.delay(2e3);
              case 27:
                _e5++;
                _context7.next = 10;
                break;
              case 30:
                if (_o3 && _o3 instanceof ArrayBuffer) {
                  _context7.next = 32;
                  break;
                }
                throw new Error("下载的兼容固件数据无效");
              case 32:
                _this7.updateStatusText = "正在解析兼容固件...";
                _context7.next = 35;
                return i.unpackFirmware(_o3);
              case 35:
                _yield$i$unpackFirmwa3 = _context7.sent;
                r = _yield$i$unpackFirmwa3.applicationDat;
                u = _yield$i$unpackFirmwa3.applicationBin;
                i.validateFirmware(r, u), _this7.updateStatusText = "正在进入 DFU 模式...";
                _context7.prev = 39;
                _context7.next = 42;
                return t.bluetoothService.enterDFUMode();
              case 42:
                _this7.updateStatusText = "等待设备进入 DFU 模式...";
                _context7.next = 45;
                return _this7.delay(3e3);
              case 45:
                _context7.next = 55;
                break;
              case 47:
                _context7.prev = 47;
                _context7.t1 = _context7["catch"](39);
                if (!(!_context7.t1.message.includes("超时") && !_context7.t1.message.includes("重启"))) {
                  _context7.next = 51;
                  break;
                }
                throw _context7.t1;
              case 51:
                console.log("[FirmwarePage] 设备可能已进入DFU模式，继续流程");
                _this7.updateStatusText = "设备正在重启进入 DFU 模式...";
                _context7.next = 55;
                return _this7.delay(3e3);
              case 55:
                _this7.updateStatusText = "正在扫描 DFU 设备...";
                _context7.next = 58;
                return t.bluetoothService.initialize();
              case 58:
                _context7.next = 60;
                return t.bluetoothService.startScan();
              case 60:
                _context7.next = 62;
                return _this7.scanDFUDevice();
              case 62:
                n = _context7.sent;
                if (n) {
                  _context7.next = 65;
                  break;
                }
                throw new Error("未找到 DFU 模式的设备，请重试");
              case 65:
                _this7.updateStatusText = "正在连接 DFU 设备...";
                _context7.prev = 66;
                _context7.next = 69;
                return t.bluetoothService.connectToDevice(n);
              case 69:
                _context7.next = 87;
                break;
              case 71:
                _context7.prev = 71;
                _context7.t2 = _context7["catch"](66);
                console.error("[FirmwarePage] 首次连接DFU设备失败，尝试重新扫描", _context7.t2);
                _this7.updateStatusText = "重新扫描 DFU 设备...";
                _context7.next = 77;
                return _this7.delay(2e3);
              case 77:
                _context7.next = 79;
                return t.bluetoothService.startScan();
              case 79:
                _context7.next = 81;
                return _this7.scanDFUDevice();
              case 81:
                _e6 = _context7.sent;
                if (_e6) {
                  _context7.next = 84;
                  break;
                }
                throw new Error("重新扫描未找到 DFU 设备，请重启设备后重试");
              case 84:
                _this7.updateStatusText = "重新连接 DFU 设备...";
                _context7.next = 87;
                return t.bluetoothService.connectToDevice(_e6);
              case 87:
                c = new a.DFUCommunicator(t.bluetoothService);
                _this7.updateStatusText = "正在刷入兼容固件...";
                _context7.next = 91;
                return c.flashFirmware(1, r, function (e) {
                  _this7.updateProgress = Math.floor(e / 2), _this7.updateStatusText = "\u6B63\u5728\u5237\u5165\u517C\u5BB9\u56FA\u4EF6 (1/2): ".concat(2 * _this7.updateProgress, "%");
                });
              case 91:
                _context7.next = 93;
                return c.flashFirmware(2, u, function (e) {
                  _this7.updateProgress = 50 + Math.floor(e / 2), _this7.updateStatusText = "\u6B63\u5728\u5237\u5165\u517C\u5BB9\u56FA\u4EF6 (2/2): ".concat(e, "%");
                });
              case 93:
                _this7.updateProgress = 100;
                _this7.updateStatusText = "兼容固件更新完成，设备正在重启...";
                _context7.next = 97;
                return _this7.delay(3e3);
              case 97:
                _this7.updateSuccess = !0;
                _this7.updateResultMessage = "兼容固件已成功刷入，设备将重新连接。";
                _this7.$refs.resultPopup.open();
                _context7.next = 102;
                return t.bluetoothService.initialize();
              case 102:
                _context7.next = 104;
                return t.bluetoothService.startScan();
              case 104:
                return _context7.abrupt("return", !0);
              case 107:
                _context7.prev = 107;
                _context7.t3 = _context7["catch"](4);
                return _context7.abrupt("return", (console.error("[FirmwarePage] 自动刷入兼容固件失败", _context7.t3), _this7.updateSuccess = !1, _this7.updateResultMessage = "自动刷入失败: " + _context7.t3.message, _this7.$refs.resultPopup.open(), _this7.updateStatusText = "自动刷入失败: " + _context7.t3.message, !1));
              case 110:
                _context7.prev = 110;
                _this7.isUpdating = !1;
                return _context7.finish(110);
              case 113:
              case "end":
                return _context7.stop();
            }
          }, _callee7, null, [[4, 107, 110, 113], [11, 20], [39, 47], [66, 71]]);
        }))();
      }
    }
  };if (!Array) {
  (e.resolveComponent("uni-icons") + e.resolveComponent("uni-popup-dialog") + e.resolveComponent("uni-popup"))();
}Math || (function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
} + function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-popup-dialog/uni-popup-dialog.js";
} + function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
})();var o = e._export_sfc(s, [["render", function (t, a, i, s, o, r) {
  return e.e({
    a: !t.isConnected
  }, t.isConnected ? e.e({
    d: e.p({
      type: "info-filled",
      size: "20",
      color: "#667eea"
    }),
    e: e.t(t.deviceModelName),
    f: e.t(t.deviceInfo ? t.deviceInfo.version : "未知"),
    g: e.t(o.chipId || "未知"),
    h: e.p({
      type: "download-filled",
      size: "20",
      color: "#667eea"
    }),
    i: e.t(o.updateStatusText),
    j: o.isUpdating
  }, o.isUpdating ? {
    k: "".concat(r.updateProgress, "%"),
    l: e.t(r.updateProgress)
  } : {}, {
    m: e.p({
      type: "refresh",
      size: "16",
      color: "#fff"
    }),
    n: e.t(o.isChecking ? "检查中..." : "检查更新"),
    o: e.o(function () {
      return r.checkUpdate && r.checkUpdate.apply(r, arguments);
    }),
    p: o.isUpdating || o.isChecking,
    q: e.p({
      type: "download",
      size: "16",
      color: "#fff"
    }),
    r: e.t(o.isUpdating ? "更新中..." : "开始更新"),
    s: e.o(function () {
      return r.startUpdate && r.startUpdate.apply(r, arguments);
    }),
    t: o.isUpdating || !o.updateAvailable || o.isChecking,
    v: o.updateInfo && o.updateInfo.firmware_info
  }, o.updateInfo && o.updateInfo.firmware_info ? {
    w: e.t(o.updateInfo.firmware_info.version)
  } : {}, {
    x: e.p({
      type: "help-filled",
      size: "20",
      color: "#667eea"
    })
  }) : {
    b: e.p({
      type: "info",
      size: "60",
      color: "#999"
    }),
    c: e.o(function () {
      return r.goToConnect && r.goToConnect.apply(r, arguments);
    })
  }, {
    y: e.t(o.updateResultMessage),
    z: e.o(r.closeResultDialog),
    A: e.p({
      type: o.updateSuccess ? "success" : "error",
      title: o.updateSuccess ? "更新成功" : "更新失败",
      confirmText: "确定",
      "before-close": !0
    }),
    B: e.sr("resultPopup", "2926a4f6-6"),
    C: e.p({
      type: "dialog",
      "mask-click": !1,
      animation: !0
    })
  });
}], ["__scopeId", "data-v-2926a4f6"]]);wx.createPage(o);