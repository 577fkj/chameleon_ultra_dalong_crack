require("../@babel/runtime/helpers/Arrayincludes");var _toConsumableArray2 = require("../@babel/runtime/helpers/toConsumableArray");var _createForOfIteratorHelper2 = require("../@babel/runtime/helpers/createForOfIteratorHelper");var _slicedToArray2 = require("../@babel/runtime/helpers/slicedToArray");var _regeneratorRuntime2 = require("../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../@babel/runtime/helpers/asyncToGenerator");var _classCallCheck2 = require("../@babel/runtime/helpers/classCallCheck");var _createClass2 = require("../@babel/runtime/helpers/createClass");var e = require("../common/vendor.js"),
  t = require("../utils/chameleon-protocol.js"),
  o = require("../utils/http.js"),
  r = {
    DEVICE_NAME_PREFIXES: ["ChameleonUltra", "ChameleonLite", "Chameleon"],
    SERVICE_UUID: "6E400001-B5A3-F393-E0A9-E50E24DCCA9E",
    TX_CHARACTERISTIC_UUID: "6E400002-B5A3-F393-E0A9-E50E24DCCA9E",
    RX_CHARACTERISTIC_UUID: "6E400003-B5A3-F393-E0A9-E50E24DCCA9E",
    SCAN_TIMEOUT: 1e4,
    CONNECT_TIMEOUT: 15e3,
    HEARTBEAT_INTERVAL: 15e3,
    MAX_RETRY_COUNT: 3,
    MAX_HEARTBEAT_FAILURES: 2
  },
  n = "FE59",
  s = "8EC90001-F315-4F60-9FB8-838830DAEA50",
  a = "8EC90002-F315-4F60-9FB8-838830DAEA50";var i = new ( /*#__PURE__*/function () {
  function _class() {
    _classCallCheck2(this, _class);
    this.isInitialized = !1, this.isScanning = !1, this.isConnected = !1, this.connectedDevice = null, this.deviceId = null, this.serviceId = null, this.txCharacteristicId = null, this.rxCharacteristicId = null, this.firmwareCharacteristicId = null, this.isDFU = !1, this.isDfuMode = !1, this.listeners = {
      deviceFound: [],
      connected: [],
      disconnected: [],
      dataReceived: [],
      error: []
    }, this.dataQueue = [], this.responseWaiters = new Map(), this.commandCounter = 0, this.commandQueue = [], this.isProcessingQueue = !1, this.lastCommandTime = 0, this.heartbeatTimer = null, this.heartbeatPaused = !1, this.heartbeatFailCount = 0, this.retryCount = 0, this.autoReconnect = !0;
  }
  _createClass2(_class, [{
    key: "initialize",
    value: function () {
      var _initialize = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
        var _this = this;
        return _regeneratorRuntime2().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              console.log("[Bluetooth] 初始化蓝牙适配器...");
              _context.next = 4;
              return new Promise(function (t, o) {
                e.index.openBluetoothAdapter({
                  success: function success(e) {
                    console.log("[Bluetooth] 蓝牙适配器初始化成功", e), _this.isInitialized = !0, t(e);
                  },
                  fail: function fail(e) {
                    console.error("[Bluetooth] 蓝牙适配器初始化失败", e), o(new Error("\u84DD\u7259\u9002\u914D\u5668\u521D\u59CB\u5316\u5931\u8D25: ".concat(e.errMsg)));
                  }
                });
              });
            case 4:
              e.index.onBluetoothAdapterStateChange(function (e) {
                console.log("[Bluetooth] 蓝牙适配器状态变化", e), e.available || _this.emit("error", new Error("蓝牙适配器不可用"));
              });
              e.index.onBLEConnectionStateChange(function (e) {
                console.log("[Bluetooth] BLE 连接状态变化", e), e.deviceId === _this.deviceId && (e.connected ? (console.log("[Bluetooth] 设备已连接"), _this.retryCount = 0, _this.isDFU || _this.isDfuMode || _this.startHeartbeat()) : (console.log("[Bluetooth] 设备已断开连接"), _this.handleDisconnect()));
              });
              e.index.onBLECharacteristicValueChange(function (e) {
                e.deviceId === _this.deviceId && e.characteristicId === _this.rxCharacteristicId && _this.handleDataReceived(e.value);
              });
              console.log("[Bluetooth] 蓝牙服务初始化完成");
              _context.next = 13;
              break;
            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](0);
              throw this.emit("error", _context.t0), _context.t0;
            case 13:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[0, 10]]);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
  }, {
    key: "startScan",
    value: function () {
      var _startScan = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
        var _this2 = this;
        return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.t0 = this.isInitialized;
              if (_context2.t0) {
                _context2.next = 4;
                break;
              }
              _context2.next = 4;
              return this.initialize();
            case 4:
              if (!this.isScanning) {
                _context2.next = 6;
                break;
              }
              throw new Error("正在扫描中，请稍后再试");
            case 6:
              _context2.prev = 6;
              console.log("[Bluetooth] 开始扫描设备...");
              this.isScanning = !0;
              _context2.next = 11;
              return new Promise(function (t, o) {
                e.index.startBluetoothDevicesDiscovery({
                  allowDuplicatesKey: !1,
                  interval: 0,
                  success: t,
                  fail: o
                });
              });
            case 11:
              e.index.onBluetoothDeviceFound(function (e) {
                (e.devices || []).forEach(function (e) {
                  _this2.isChameleonDevice(e) && (console.log("[Bluetooth] 发现 Chameleon 设备", e), _this2.emit("deviceFound", e));
                });
              });
              setTimeout(function () {
                _this2.isScanning && _this2.stopScan();
              }, r.SCAN_TIMEOUT);
              _context2.next = 18;
              break;
            case 15:
              _context2.prev = 15;
              _context2.t1 = _context2["catch"](6);
              throw this.isScanning = !1, this.emit("error", _context2.t1), _context2.t1;
            case 18:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[6, 15]]);
      }));
      function startScan() {
        return _startScan.apply(this, arguments);
      }
      return startScan;
    }()
  }, {
    key: "stopScan",
    value: function () {
      var _stopScan = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
        return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (!this.isScanning) {
                _context3.next = 11;
                break;
              }
              _context3.prev = 1;
              _context3.next = 4;
              return new Promise(function (t) {
                e.index.stopBluetoothDevicesDiscovery({
                  success: t,
                  fail: t
                });
              });
            case 4:
              this.isScanning = !1;
              console.log("[Bluetooth] 停止扫描");
              _context3.next = 11;
              break;
            case 8:
              _context3.prev = 8;
              _context3.t0 = _context3["catch"](1);
              console.warn("[Bluetooth] 停止扫描失败", _context3.t0);
            case 11:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this, [[1, 8]]);
      }));
      function stopScan() {
        return _stopScan.apply(this, arguments);
      }
      return stopScan;
    }()
  }, {
    key: "connectToDevice",
    value: function () {
      var _connectToDevice = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4(t) {
        var _this3 = this;
        var o, i, c, l, h, u, d, m;
        return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.t0 = this.isConnected;
              if (!_context4.t0) {
                _context4.next = 4;
                break;
              }
              _context4.next = 4;
              return this.disconnect();
            case 4:
              _context4.t1 = this.isInitialized;
              if (_context4.t1) {
                _context4.next = 8;
                break;
              }
              _context4.next = 8;
              return this.initialize();
            case 8:
              _context4.prev = 8;
              console.log("[Bluetooth] 开始连接设备:", t.name);
              _context4.t2 = this.isScanning;
              if (!_context4.t2) {
                _context4.next = 14;
                break;
              }
              _context4.next = 14;
              return this.stopScan();
            case 14:
              this.connectedDevice = t;
              this.deviceId = t.deviceId;
              this.isDFU = this.isDFUDevice(t);
              console.log("[Bluetooth] 设备是否处于 DFU 模式:", this.isDFU);
              this.isDFU && this.enterDfuMode();
              _context4.next = 21;
              return new Promise(function (t, o) {
                var n = setTimeout(function () {
                  o(new Error("连接超时"));
                }, r.CONNECT_TIMEOUT);
                e.index.createBLEConnection({
                  deviceId: _this3.deviceId,
                  timeout: r.CONNECT_TIMEOUT,
                  success: function success(e) {
                    clearTimeout(n), console.log("[Bluetooth] 设备连接成功", e), t(e);
                  },
                  fail: function fail(e) {
                    clearTimeout(n), console.error("[Bluetooth] 设备连接失败", e), o(new Error("\u8BBE\u5907\u8FDE\u63A5\u5931\u8D25: ".concat(e.errMsg)));
                  }
                });
              });
            case 21:
              _context4.next = 23;
              return new Promise(function (e) {
                return setTimeout(e, 1e3);
              });
            case 23:
              _context4.next = 25;
              return this.getBLEDeviceServices();
            case 25:
              d = _context4.sent;
              if (!(console.log("[Bluetooth] 发现的服务列表", d), this.isDFU ? this.serviceId = null == (o = d.find(function (e) {
                return e.uuid.toUpperCase().includes(n);
              })) ? void 0 : o.uuid : this.serviceId = null == (i = d.find(function (e) {
                return e.uuid.toUpperCase().includes(r.SERVICE_UUID);
              })) ? void 0 : i.uuid, !this.serviceId)) {
                _context4.next = 28;
                break;
              }
              throw new Error("未找到指定的服务");
            case 28:
              console.log("[Bluetooth] \u4F7F\u7528\u670D\u52A1ID: ".concat(this.serviceId));
              _context4.next = 31;
              return this.getBLEDeviceCharacteristics();
            case 31:
              m = _context4.sent;
              if (!(console.log("[Bluetooth] 获取到的所有特征值:", m), this.isDFU ? (this.txCharacteristicId = null == (c = m.find(function (e) {
                return e.uuid.toUpperCase().includes(s);
              })) ? void 0 : c.uuid, this.rxCharacteristicId = this.txCharacteristicId, this.firmwareCharacteristicId = null == (l = m.find(function (e) {
                return e.uuid.toUpperCase().includes(a);
              })) ? void 0 : l.uuid) : (this.txCharacteristicId = null == (h = m.find(function (e) {
                return e.uuid.toUpperCase().includes(r.TX_CHARACTERISTIC_UUID);
              })) ? void 0 : h.uuid, this.rxCharacteristicId = null == (u = m.find(function (e) {
                return e.uuid.toUpperCase().includes(r.RX_CHARACTERISTIC_UUID);
              })) ? void 0 : u.uuid), !this.txCharacteristicId || !this.rxCharacteristicId)) {
                _context4.next = 34;
                break;
              }
              throw new Error("未找到指定的特征值");
            case 34:
              if (!(this.isDFU && !this.firmwareCharacteristicId)) {
                _context4.next = 36;
                break;
              }
              throw new Error("未找到DFU固件写入特征值");
            case 36:
              console.log("[Bluetooth] \u4F7F\u7528TX\u7279\u5F81ID: ".concat(this.txCharacteristicId));
              console.log("[Bluetooth] \u4F7F\u7528RX\u7279\u5F81ID: ".concat(this.rxCharacteristicId));
              this.isDFU && console.log("[Bluetooth] \u4F7F\u7528Firmware\u7279\u5F81ID: ".concat(this.firmwareCharacteristicId));
              _context4.next = 41;
              return new Promise(function (t, o) {
                e.index.notifyBLECharacteristicValueChange({
                  deviceId: _this3.deviceId,
                  serviceId: _this3.serviceId,
                  characteristicId: _this3.rxCharacteristicId,
                  state: !0,
                  success: t,
                  fail: o
                });
              });
            case 41:
              this.isConnected = !0;
              console.log("[Bluetooth] 设备连接和配置完成");
              this.emit("connected", this.connectedDevice);
              _context4.next = 49;
              break;
            case 46:
              _context4.prev = 46;
              _context4.t3 = _context4["catch"](8);
              throw console.error("[Bluetooth] 连接设备失败", _context4.t3), this.cleanup(), this.emit("error", _context4.t3), _context4.t3;
            case 49:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this, [[8, 46]]);
      }));
      function connectToDevice(_x) {
        return _connectToDevice.apply(this, arguments);
      }
      return connectToDevice;
    }()
  }, {
    key: "disconnect",
    value: function () {
      var _disconnect = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5() {
        var _this4 = this;
        return _regeneratorRuntime2().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              this.autoReconnect = !1;
              _context5.t0 = this.deviceId;
              if (!_context5.t0) {
                _context5.next = 6;
                break;
              }
              _context5.next = 6;
              return new Promise(function (t) {
                e.index.closeBLEConnection({
                  deviceId: _this4.deviceId,
                  success: t,
                  fail: t
                });
              });
            case 6:
              this.cleanup();
              console.log("[Bluetooth] 已断开连接");
              _context5.next = 13;
              break;
            case 10:
              _context5.prev = 10;
              _context5.t1 = _context5["catch"](0);
              console.warn("[Bluetooth] 断开连接失败", _context5.t1);
            case 13:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this, [[0, 10]]);
      }));
      function disconnect() {
        return _disconnect.apply(this, arguments);
      }
      return disconnect;
    }()
  }, {
    key: "sendCommand",
    value: function () {
      var _sendCommand = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee6(e) {
        var _this5 = this;
        var t,
          o,
          _args6 = arguments;
        return _regeneratorRuntime2().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              t = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : null;
              o = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : 8e3;
              if (!(!this.isConnected || !this.deviceId)) {
                _context6.next = 4;
                break;
              }
              throw new Error("设备未连接");
            case 4:
              return _context6.abrupt("return", (this.isDFU && o > 5e3 && (o = 5e3), this.pauseHeartbeat(), new Promise(function (r, n) {
                var s = {
                  id: "".concat(e, "_").concat(++_this5.commandCounter, "_").concat(Date.now()),
                  command: e,
                  data: t,
                  timeout: o,
                  resolve: r,
                  reject: n,
                  retryCount: 0,
                  maxRetries: _this5.isDFU ? 1 : 2
                };
                _this5.commandQueue.push(s), _this5.processCommandQueue();
              })));
            case 5:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this);
      }));
      function sendCommand(_x2) {
        return _sendCommand.apply(this, arguments);
      }
      return sendCommand;
    }()
  }, {
    key: "processCommandQueue",
    value: function () {
      var _processCommandQueue = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee7() {
        var _t;
        return _regeneratorRuntime2().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              if (!(!this.isProcessingQueue && 0 !== this.commandQueue.length)) {
                _context7.next = 26;
                break;
              }
              this.isProcessingQueue = !0;
            case 2:
              if (!(this.commandQueue.length > 0)) {
                _context7.next = 25;
                break;
              }
              _t = this.commandQueue.shift();
              _context7.prev = 4;
              _context7.next = 7;
              return this.executeCommand(_t);
            case 7:
              _context7.next = 9;
              return this.delay(100);
            case 9:
              _context7.next = 23;
              break;
            case 11:
              _context7.prev = 11;
              _context7.t0 = _context7["catch"](4);
              console.warn("[Bluetooth] \u547D\u4EE4\u6267\u884C\u5931\u8D25: ".concat(_t.command), _context7.t0);
              if (!(_context7.t0 && _context7.t0.message && _context7.t0.message.includes("超时") && _t.retryCount < _t.maxRetries)) {
                _context7.next = 22;
                break;
              }
              _t.retryCount++;
              console.log("[Bluetooth] \u91CD\u8BD5\u547D\u4EE4 ".concat(_t.command, ", \u7B2C").concat(_t.retryCount, "\u6B21\u91CD\u8BD5"));
              this.commandQueue.unshift(_t);
              _context7.next = 20;
              return this.delay(500);
            case 20:
              _context7.next = 23;
              break;
            case 22:
              _t.reject(_context7.t0);
            case 23:
              _context7.next = 2;
              break;
            case 25:
              this.isProcessingQueue = !1, this.resumeHeartbeat();
            case 26:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this, [[4, 11]]);
      }));
      function processCommandQueue() {
        return _processCommandQueue.apply(this, arguments);
      }
      return processCommandQueue;
    }()
  }, {
    key: "executeCommand",
    value: function () {
      var _executeCommand = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee8(e) {
        var _this6 = this;
        var o, r, n, s, a, i, c;
        return _regeneratorRuntime2().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              o = e.id, r = e.command, n = e.data, s = e.timeout, a = e.resolve, i = e.reject, c = t.ChameleonProtocol.createCommand(r, n);
              return _context8.abrupt("return", new Promise(function (e, r) {
                var n = setTimeout(function () {
                  _this6.responseWaiters.delete(o);
                  var e = new Error("命令执行超时");
                  i(e), r(e);
                }, s);
                _this6.responseWaiters.set(o, {
                  resolve: function resolve(s) {
                    clearTimeout(n), _this6.responseWaiters.delete(o);
                    var c = t.ChameleonProtocol.parseResponse(s);
                    if (c.success) a(c), e(c);else {
                      var _e = new Error(c.error || "命令执行失败");
                      i(_e), r(_e);
                    }
                  },
                  reject: function reject(e) {
                    clearTimeout(n), _this6.responseWaiters.delete(o), i(e), r(e);
                  }
                }), _this6.sendData(c).catch(function (e) {
                  clearTimeout(n), _this6.responseWaiters.delete(o), i(e), r(e);
                });
              }));
            case 2:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      }));
      function executeCommand(_x3) {
        return _executeCommand.apply(this, arguments);
      }
      return executeCommand;
    }()
  }, {
    key: "delay",
    value: function delay(e) {
      return new Promise(function (t) {
        return setTimeout(t, e);
      });
    }
  }, {
    key: "sendData",
    value: function () {
      var _sendData = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee9(t) {
        var _this7 = this;
        var o,
          r,
          _n,
          _s,
          _args9 = arguments;
        return _regeneratorRuntime2().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              o = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : !1;
              r = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : "write";
              if (!(!this.isConnected || !this.deviceId)) {
                _context9.next = 4;
                break;
              }
              throw new Error("设备未连接");
            case 4:
              _context9.prev = 4;
              if (!(_n = t instanceof Uint8Array ? t.buffer.slice(t.byteOffset, t.byteOffset + t.byteLength) : this.dataToArrayBuffer(t), _s = o ? this.firmwareCharacteristicId : this.txCharacteristicId, !_s)) {
                _context9.next = 7;
                break;
              }
              throw new Error("\u53D1\u9001\u5931\u8D25: ".concat(o ? "Firmware" : "TX", " \u7279\u5F81\u503C\u672A\u627E\u5230"));
            case 7:
              _context9.next = 9;
              return new Promise(function (t, o) {
                e.index.writeBLECharacteristicValue({
                  deviceId: _this7.deviceId,
                  serviceId: _this7.serviceId,
                  characteristicId: _s,
                  value: _n,
                  writeType: r,
                  success: t,
                  fail: o
                });
              });
            case 9:
              console.log("[Bluetooth] \u6570\u636E\u53D1\u9001\u5230 ".concat(_s, " \u6210\u529F"), Array.from(new Uint8Array(_n)).map(function (e) {
                return e.toString(16).padStart(2, "0");
              }).join(" "));
              _context9.next = 15;
              break;
            case 12:
              _context9.prev = 12;
              _context9.t0 = _context9["catch"](4);
              throw console.error("[Bluetooth] 数据发送失败", _context9.t0), this.emit("error", _context9.t0), _context9.t0;
            case 15:
            case "end":
              return _context9.stop();
          }
        }, _callee9, this, [[4, 12]]);
      }));
      function sendData(_x4) {
        return _sendData.apply(this, arguments);
      }
      return sendData;
    }()
  }, {
    key: "on",
    value: function on(e, t) {
      this.listeners[e] && this.listeners[e].push(t);
    }
  }, {
    key: "off",
    value: function off(e, t) {
      if (this.listeners[e]) {
        var o = this.listeners[e].indexOf(t);
        o > -1 && this.listeners[e].splice(o, 1);
      }
    }
  }, {
    key: "emit",
    value: function emit(e, t) {
      this.listeners[e] && this.listeners[e].forEach(function (e) {
        try {
          e(t);
        } catch (o) {
          console.error("[Bluetooth] 事件监听器错误", o);
        }
      });
    }
  }, {
    key: "getDeviceInfo",
    value: function () {
      var _getDeviceInfo = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee10() {
        var _yield$Promise$all, _yield$Promise$all2, e, o, r, n, s, a, i, c, l;
        return _regeneratorRuntime2().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              console.log("[Bluetooth] 开始获取设备信息...");
              _context10.next = 3;
              return Promise.all([this.sendCommand(t.ChameleonCommand.GET_APP_VERSION), this.sendCommand(t.ChameleonCommand.GET_GIT_VERSION), this.sendCommand(t.ChameleonCommand.GET_DEVICE_MODE), this.sendCommand(t.ChameleonCommand.GET_DEVICE_TYPE)]);
            case 3:
              _yield$Promise$all = _context10.sent;
              _yield$Promise$all2 = _slicedToArray2(_yield$Promise$all, 4);
              e = _yield$Promise$all2[0];
              o = _yield$Promise$all2[1];
              r = _yield$Promise$all2[2];
              n = _yield$Promise$all2[3];
              s = e;
              a = o;
              i = r;
              c = n;
              console.log("[Bluetooth] 获取设备信息完成，开始解析...");
              l = this.parseDeviceInfo(s, a, i, c);
              return _context10.abrupt("return", (console.log("[Bluetooth] 获取并解析设备信息完成:", l), l));
            case 16:
            case "end":
              return _context10.stop();
          }
        }, _callee10, this);
      }));
      function getDeviceInfo() {
        return _getDeviceInfo.apply(this, arguments);
      }
      return getDeviceInfo;
    }()
  }, {
    key: "parseDeviceInfo",
    value: function parseDeviceInfo(e, o, r, n) {
      console.log("[Bluetooth] 开始解析设备信息响应...");
      var s = {
        version: "Unknown",
        mode: "未知模式",
        model: "未知型号",
        device: null
      };
      if (o && o.success && o.data) {
        var _e2 = o.data instanceof ArrayBuffer ? o.data : o.data.buffer,
          _t2 = this.arrayBufferToString(_e2).split("\0")[0];
        s.version = _t2 || "Unknown", console.log("[Bluetooth] Git版本解析结果:", _t2);
      } else if (e && e.success && e.data) {
        var _t3 = e.data instanceof Uint8Array ? Array.from(e.data) : this.arrayBufferToData(e.data);
        s.version = "App ".concat(_t3[0]), console.log("[Bluetooth] App版本解析结果:", s.version);
      }
      if (r && r.success && r.data) {
        var _e3 = (r.data instanceof Uint8Array ? Array.from(r.data) : this.arrayBufferToData(r.data))[0];
        s.mode = t.ChameleonProtocol.getDeviceModeName(_e3), console.log("[Bluetooth] 设备模式解析结果:", _e3, "->", s.mode);
      }
      if (n && n.success && n.data) {
        var _e4 = (n.data instanceof Uint8Array ? Array.from(n.data) : this.arrayBufferToData(n.data))[0];
        s.model = t.ChameleonProtocol.getDeviceModelName(_e4), console.log("[Bluetooth] 设备型号解析结果:", _e4, "->", s.model);
      }
      return s.device = this.connectedDevice, console.log("[Bluetooth] 最终解析的设备信息:", s), s;
    }
  }, {
    key: "getBatteryInfo",
    value: function () {
      var _getBatteryInfo = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee11() {
        var _e5, _t4, o, _r;
        return _regeneratorRuntime2().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              _context11.prev = 0;
              _context11.next = 3;
              return this.sendCommand(t.ChameleonCommand.GET_BATTERY_CHARGE);
            case 3:
              _e5 = _context11.sent.data;
              if (!(console.log("[Bluetooth] 电池信息数据长度:", _e5 ? _e5.length : 0), console.log("[Bluetooth] 电池信息原始数据:", _e5 ? Array.from(_e5) : "null"), _e5 && _e5.length >= 3)) {
                _context11.next = 7;
                break;
              }
              _t4 = _e5[0] << 8 | _e5[1], o = _e5[2], _r = _e5.length > 3 && 1 === _e5[3];
              return _context11.abrupt("return", (console.log("[Bluetooth] 解析电池信息:", {
                voltage: _t4,
                percentage: o,
                isCharging: _r
              }), {
                level: o,
                voltage: _t4,
                isCharging: _r,
                status: _r ? "charging" : o > 0 ? "normal" : "low"
              }));
            case 7:
              return _context11.abrupt("return", (console.warn("[Bluetooth] 电池信息数据长度不足:", _e5 ? _e5.length : 0), {
                level: 0,
                voltage: 0,
                isCharging: !1,
                status: "unknown"
              }));
            case 10:
              _context11.prev = 10;
              _context11.t0 = _context11["catch"](0);
              return _context11.abrupt("return", (console.error("[Bluetooth] 获取电池信息失败", _context11.t0), {
                level: 0,
                voltage: 0,
                isCharging: !1,
                status: "unknown"
              }));
            case 13:
            case "end":
              return _context11.stop();
          }
        }, _callee11, this, [[0, 10]]);
      }));
      function getBatteryInfo() {
        return _getBatteryInfo.apply(this, arguments);
      }
      return getBatteryInfo;
    }()
  }, {
    key: "changeDeviceMode",
    value: function () {
      var _changeDeviceMode = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee12(e) {
        var o, _r2, _n2;
        return _regeneratorRuntime2().wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              _context12.prev = 0;
              console.log("[Bluetooth] 切换设备模式到:", e);
              o = new Uint8Array([e]);
              _context12.next = 5;
              return this.sendCommand(t.ChameleonCommand.CHANGE_DEVICE_MODE, o);
            case 5:
              _r2 = _context12.sent;
              _n2 = t.ChameleonProtocol.parseResponse(_r2);
              if (!_n2.success) {
                _context12.next = 9;
                break;
              }
              return _context12.abrupt("return", (console.log("[Bluetooth] 设备模式切换成功"), {
                success: !0
              }));
            case 9:
              throw new Error("\u6A21\u5F0F\u5207\u6362\u5931\u8D25: ".concat(_n2.error));
            case 12:
              _context12.prev = 12;
              _context12.t0 = _context12["catch"](0);
              throw console.error("[Bluetooth] 切换设备模式失败", _context12.t0), _context12.t0;
            case 15:
            case "end":
              return _context12.stop();
          }
        }, _callee12, this, [[0, 12]]);
      }));
      function changeDeviceMode(_x5) {
        return _changeDeviceMode.apply(this, arguments);
      }
      return changeDeviceMode;
    }()
  }, {
    key: "isChameleonDevice",
    value: function isChameleonDevice(e) {
      var t = e.name || "",
        o = r.DEVICE_NAME_PREFIXES.some(function (e) {
          return t.startsWith(e);
        }),
        n = t.startsWith("CU-") || t.startsWith("CL-");
      return o || n;
    }
  }, {
    key: "getBLEDeviceServices",
    value: function () {
      var _getBLEDeviceServices = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee13() {
        var _this8 = this;
        return _regeneratorRuntime2().wrap(function _callee13$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              return _context13.abrupt("return", new Promise(function (t, o) {
                e.index.getBLEDeviceServices({
                  deviceId: _this8.deviceId,
                  success: function success(e) {
                    return t(e.services);
                  },
                  fail: o
                });
              }));
            case 1:
            case "end":
              return _context13.stop();
          }
        }, _callee13);
      }));
      function getBLEDeviceServices() {
        return _getBLEDeviceServices.apply(this, arguments);
      }
      return getBLEDeviceServices;
    }()
  }, {
    key: "getBLEDeviceCharacteristics",
    value: function () {
      var _getBLEDeviceCharacteristics = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee14() {
        var _this9 = this;
        return _regeneratorRuntime2().wrap(function _callee14$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              return _context14.abrupt("return", new Promise(function (t, o) {
                e.index.getBLEDeviceCharacteristics({
                  deviceId: _this9.deviceId,
                  serviceId: _this9.serviceId,
                  success: function success(e) {
                    return t(e.characteristics);
                  },
                  fail: o
                });
              }));
            case 1:
            case "end":
              return _context14.stop();
          }
        }, _callee14);
      }));
      function getBLEDeviceCharacteristics() {
        return _getBLEDeviceCharacteristics.apply(this, arguments);
      }
      return getBLEDeviceCharacteristics;
    }()
  }, {
    key: "handleDataReceived",
    value: function handleDataReceived(e) {
      try {
        if (console.log("[Bluetooth] 接收到原始数据", Array.from(new Uint8Array(e)).map(function (e) {
          return e.toString(16).padStart(2, "0");
        }).join(" ")), this.isDFU) return console.log("[Bluetooth] DFU模式数据，直接触发事件"), console.log("[Bluetooth] DFU事件监听器数量:", this.listeners.dataReceived ? this.listeners.dataReceived.length : 0), console.log("[Bluetooth] 准备触发dataReceived事件，数据:", Array.from(new Uint8Array(e)).map(function (e) {
          return e.toString(16).padStart(2, "0");
        }).join(" ")), this.emit("dataReceived", e), void console.log("[Bluetooth] DFU dataReceived事件已触发");
        var o = t.ChameleonProtocol.parseResponse(e);
        console.log("[Bluetooth] 解析后数据", o);
        var _r3 = null;
        var _iterator = _createForOfIteratorHelper2(this.responseWaiters.entries()),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _step$value = _slicedToArray2(_step.value, 2),
              _e6 = _step$value[0],
              _t5 = _step$value[1];
            if (_e6.startsWith("".concat(o.command, "_"))) {
              _r3 = {
                id: _e6,
                waiter: _t5
              };
              break;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        _r3 ? _r3.waiter.resolve(e) : (console.log("[Bluetooth] 未找到对应的命令等待者，命令:", o.command), this.emit("dataReceived", o));
      } catch (o) {
        console.error("[Bluetooth] 数据解析失败", o), this.emit("error", o);
      }
    }
  }, {
    key: "handleDisconnect",
    value: function handleDisconnect() {
      var _this10 = this;
      var e = this.isConnected;
      if (this.isConnected = !1, this.stopHeartbeat(), this.cleanup(), console.log("[Bluetooth] \u5904\u7406\u65AD\u5F00\u8FDE\u63A5 - \u4E4B\u524D\u5DF2\u8FDE\u63A5: ".concat(e, ", \u91CD\u8BD5\u6B21\u6570: ").concat(this.retryCount, ", \u5FC3\u8DF3\u5931\u8D25: ").concat(this.heartbeatFailCount)), e) if (this.emit("disconnected", this.connectedDevice), this.autoReconnect && this.retryCount < r.MAX_RETRY_COUNT) {
        this.retryCount++;
        var _e7 = Math.min(1e3 * this.retryCount, 5e3);
        console.log("[Bluetooth] \u5F00\u59CB\u7B2C ".concat(this.retryCount, " \u6B21\u91CD\u8FDE\uFF0C\u5EF6\u8FDF ").concat(_e7, "ms...")), setTimeout( /*#__PURE__*/_asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee15() {
          return _regeneratorRuntime2().wrap(function _callee15$(_context15) {
            while (1) switch (_context15.prev = _context15.next) {
              case 0:
                if (!(_this10.connectedDevice && _this10.autoReconnect)) {
                  _context15.next = 11;
                  break;
                }
                _context15.prev = 1;
                console.log("[Bluetooth] \u6267\u884C\u7B2C ".concat(_this10.retryCount, " \u6B21\u91CD\u8FDE\u5C1D\u8BD5"));
                _context15.next = 5;
                return _this10.connectToDevice(_this10.connectedDevice);
              case 5:
                console.log("[Bluetooth] \u7B2C ".concat(_this10.retryCount, " \u6B21\u91CD\u8FDE\u6210\u529F"));
                _context15.next = 11;
                break;
              case 8:
                _context15.prev = 8;
                _context15.t0 = _context15["catch"](1);
                console.error("[Bluetooth] \u7B2C ".concat(_this10.retryCount, " \u6B21\u91CD\u8FDE\u5931\u8D25:"), _context15.t0), _this10.retryCount >= r.MAX_RETRY_COUNT && (console.error("[Bluetooth] \u5DF2\u8FBE\u6700\u5927\u91CD\u8FDE\u6B21\u6570 (".concat(r.MAX_RETRY_COUNT, ")\uFF0C\u505C\u6B62\u81EA\u52A8\u91CD\u8FDE")), _this10.autoReconnect = !1, _this10.emit("error", new Error("连接失败，已停止自动重连")));
              case 11:
              case "end":
                return _context15.stop();
            }
          }, _callee15, null, [[1, 8]]);
        })), _e7);
      } else this.autoReconnect ? console.log("[Bluetooth] \u5DF2\u8FBE\u6700\u5927\u91CD\u8FDE\u6B21\u6570 (".concat(r.MAX_RETRY_COUNT, ")\uFF0C\u505C\u6B62\u91CD\u8FDE")) : console.log("[Bluetooth] 自动重连已禁用，跳过重连");
    }
  }, {
    key: "startHeartbeat",
    value: function startHeartbeat() {
      var _this11 = this;
      this.stopHeartbeat(), this.heartbeatFailCount = 0, console.log("[Bluetooth] \u542F\u52A8\u5FC3\u8DF3\u68C0\u6D4B\uFF0C\u95F4\u9694: ".concat(r.HEARTBEAT_INTERVAL, "ms")), this.heartbeatTimer = setInterval( /*#__PURE__*/_asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee16() {
        return _regeneratorRuntime2().wrap(function _callee16$(_context16) {
          while (1) switch (_context16.prev = _context16.next) {
            case 0:
              if (!_this11.isDfuMode) {
                _context16.next = 4;
                break;
              }
              console.log("[Bluetooth] DFU模式下，跳过心跳检测");
              _context16.next = 15;
              break;
            case 4:
              if (!(_this11.isConnected && !_this11.heartbeatPaused)) {
                _context16.next = 15;
                break;
              }
              if (!_this11.isProcessingQueue) {
                _context16.next = 7;
                break;
              }
              return _context16.abrupt("return", void console.log("[Bluetooth] 跳过心跳检测 - 正在处理命令队列"));
            case 7:
              _context16.prev = 7;
              _context16.next = 10;
              return _this11.sendHeartbeatCommand();
            case 10:
              _context16.next = 15;
              break;
            case 12:
              _context16.prev = 12;
              _context16.t0 = _context16["catch"](7);
              console.warn("[Bluetooth] 心跳检测失败", _context16.t0);
            case 15:
            case "end":
              return _context16.stop();
          }
        }, _callee16, null, [[7, 12]]);
      })), r.HEARTBEAT_INTERVAL);
    }
  }, {
    key: "sendHeartbeatCommand",
    value: function () {
      var _sendHeartbeatCommand = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee17() {
        return _regeneratorRuntime2().wrap(function _callee17$(_context17) {
          while (1) switch (_context17.prev = _context17.next) {
            case 0:
              if (!(this.isConnected && this.deviceId)) {
                _context17.next = 11;
                break;
              }
              _context17.prev = 1;
              _context17.next = 4;
              return this.sendCommand(t.ChameleonCommand.GET_APP_VERSION, null, 5e3);
            case 4:
              console.log("[Bluetooth] 心跳发送并响应成功");
              this.heartbeatFailCount = 0;
              _context17.next = 11;
              break;
            case 8:
              _context17.prev = 8;
              _context17.t0 = _context17["catch"](1);
              this.heartbeatFailCount++, console.warn("[Bluetooth] \u5FC3\u8DF3\u5931\u8D25 (".concat(this.heartbeatFailCount, "/").concat(r.MAX_HEARTBEAT_FAILURES, ")"), _context17.t0), this.heartbeatFailCount >= r.MAX_HEARTBEAT_FAILURES && (console.error("[Bluetooth] 心跳连续失败，可能连接异常，准备重连..."), this.handleHeartbeatFailure());
            case 11:
            case "end":
              return _context17.stop();
          }
        }, _callee17, this, [[1, 8]]);
      }));
      function sendHeartbeatCommand() {
        return _sendHeartbeatCommand.apply(this, arguments);
      }
      return sendHeartbeatCommand;
    }()
  }, {
    key: "handleHeartbeatFailure",
    value: function handleHeartbeatFailure() {
      var _this12 = this;
      console.log("[Bluetooth] 处理心跳失败，主动断开连接以触发重连机制"), this.heartbeatFailCount = 0, this.deviceId && e.index.closeBLEConnection({
        deviceId: this.deviceId,
        success: function success() {
          console.log("[Bluetooth] 因心跳失败主动断开连接成功");
        },
        fail: function fail(e) {
          console.warn("[Bluetooth] 主动断开连接失败", e), _this12.handleDisconnect();
        }
      });
    }
  }, {
    key: "pauseHeartbeat",
    value: function pauseHeartbeat() {
      this.heartbeatPaused = !0, console.log("[Bluetooth] 心跳已暂停");
    }
  }, {
    key: "resumeHeartbeat",
    value: function resumeHeartbeat() {
      this.heartbeatPaused = !1, console.log("[Bluetooth] 心跳已恢复");
    }
  }, {
    key: "stopHeartbeat",
    value: function stopHeartbeat() {
      this.heartbeatTimer && (clearInterval(this.heartbeatTimer), this.heartbeatTimer = null), this.heartbeatPaused = !1;
    }
  }, {
    key: "checkConnectionStability",
    value: function () {
      var _checkConnectionStability = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee18() {
        return _regeneratorRuntime2().wrap(function _callee18$(_context18) {
          while (1) switch (_context18.prev = _context18.next) {
            case 0:
              if (this.isConnected) {
                _context18.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context18.prev = 2;
              _context18.next = 5;
              return this.sendCommand(t.ChameleonCommand.GET_APP_VERSION, null, 3e3);
            case 5:
              console.log("[Bluetooth] 连接稳定性检查通过");
              return _context18.abrupt("return", !0);
            case 9:
              _context18.prev = 9;
              _context18.t0 = _context18["catch"](2);
              return _context18.abrupt("return", (console.warn("[Bluetooth] 连接稳定性检查失败", _context18.t0), !1));
            case 12:
            case "end":
              return _context18.stop();
          }
        }, _callee18, this, [[2, 9]]);
      }));
      function checkConnectionStability() {
        return _checkConnectionStability.apply(this, arguments);
      }
      return checkConnectionStability;
    }()
  }, {
    key: "checkConnectionHealth",
    value: function () {
      var _checkConnectionHealth = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee19() {
        var e;
        return _regeneratorRuntime2().wrap(function _callee19$(_context19) {
          while (1) switch (_context19.prev = _context19.next) {
            case 0:
              e = {
                isConnected: this.isConnected,
                heartbeatFailCount: this.heartbeatFailCount,
                isProcessingQueue: this.isProcessingQueue,
                queueLength: this.commandQueue.length,
                waitersCount: this.responseWaiters.size,
                retryCount: this.retryCount
              };
              return _context19.abrupt("return", (console.log("[Bluetooth] 连接健康状态:", e), this.heartbeatFailCount > 0 && console.warn("[Bluetooth] \u8FDE\u63A5\u8D28\u91CF\u8B66\u544A: \u5FC3\u8DF3\u5931\u8D25 ".concat(this.heartbeatFailCount, " \u6B21")), this.commandQueue.length > 5 && console.warn("[Bluetooth] \u547D\u4EE4\u961F\u5217\u5806\u79EF: ".concat(this.commandQueue.length, " \u4E2A\u547D\u4EE4\u5F85\u5904\u7406")), e));
            case 2:
            case "end":
              return _context19.stop();
          }
        }, _callee19, this);
      }));
      function checkConnectionHealth() {
        return _checkConnectionHealth.apply(this, arguments);
      }
      return checkConnectionHealth;
    }()
  }, {
    key: "cleanup",
    value: function cleanup() {
      this.isConnected = !1, this.deviceId = null, this.serviceId = null, this.txCharacteristicId = null, this.rxCharacteristicId = null, this.connectedDevice = null, this.stopHeartbeat(), this.heartbeatFailCount = 0, this.responseWaiters.clear(), this.commandQueue = [], this.isProcessingQueue = !1, this.isDFU = !1, this.isDfuMode = !1;
    }
  }, {
    key: "dataToArrayBuffer",
    value: function dataToArrayBuffer(e) {
      if (e instanceof ArrayBuffer) return e;
      if (Array.isArray(e)) return new Uint8Array(e).buffer;
      var t;
      return t = "string" == typeof e ? e : JSON.stringify(e), this.stringToArrayBuffer(t);
    }
  }, {
    key: "arrayBufferToData",
    value: function arrayBufferToData(e) {
      try {
        var _t6 = this.arrayBufferToString(e);
        try {
          return JSON.parse(_t6);
        } catch (_unused) {
          return _t6;
        }
      } catch (t) {
        return console.error("[Bluetooth] 数据解码失败", t), Array.from(new Uint8Array(e));
      }
    }
  }, {
    key: "stringToArrayBuffer",
    value: function stringToArrayBuffer(e) {
      if ("undefined" != typeof TextEncoder) try {
        return new TextEncoder().encode(e).buffer;
      } catch (o) {
        console.warn("[Bluetooth] TextEncoder失败，使用备选方案", o);
      }
      var t = [];
      for (var _r4 = 0; _r4 < e.length; _r4++) {
        var o = e.charCodeAt(_r4);
        if (o < 128) t.push(o);else if (o < 2048) t.push(192 | o >> 6), t.push(128 | 63 & o);else if (o < 55296 || o >= 57344) t.push(224 | o >> 12), t.push(128 | o >> 6 & 63), t.push(128 | 63 & o);else {
          _r4++;
          var _n3 = 65536 + ((1023 & o) << 10 | 1023 & e.charCodeAt(_r4));
          t.push(240 | _n3 >> 18), t.push(128 | _n3 >> 12 & 63), t.push(128 | _n3 >> 6 & 63), t.push(128 | 63 & _n3);
        }
      }
      return new Uint8Array(t).buffer;
    }
  }, {
    key: "arrayToHexString",
    value: function arrayToHexString(e) {
      return e && 0 !== e.length ? Array.from(e).map(function (e) {
        return e.toString(16).toUpperCase().padStart(2, "0");
      }).join("") : "";
    }
  }, {
    key: "arrayToHexLowerString",
    value: function arrayToHexLowerString(e) {
      return e && 0 !== e.length ? Array.from(e).map(function (e) {
        return e.toString(16).toLowerCase().padStart(2, "0");
      }).join("") : "";
    }
  }, {
    key: "arrayBufferToString",
    value: function arrayBufferToString(e) {
      if ("undefined" != typeof TextDecoder) try {
        return new TextDecoder().decode(e);
      } catch (n) {
        console.warn("[Bluetooth] TextDecoder失败，使用备选方案", n);
      }
      var t = new Uint8Array(e);
      var o = "",
        r = 0;
      for (; r < t.length;) {
        var _e8 = t[r++];
        if (_e8 < 128) o += String.fromCharCode(_e8);else if (_e8 >> 5 == 6) {
          var _n4 = t[r++];
          o += String.fromCharCode((31 & _e8) << 6 | 63 & _n4);
        } else if (_e8 >> 4 == 14) {
          var _n5 = t[r++],
            _s2 = t[r++];
          o += String.fromCharCode((15 & _e8) << 12 | (63 & _n5) << 6 | 63 & _s2);
        } else if (_e8 >> 3 == 30) {
          var _n6 = (7 & _e8) << 18 | (63 & t[r++]) << 12 | (63 & t[r++]) << 6 | 63 & t[r++],
            _s3 = 55296 + (_n6 - 65536 >> 10),
            _a = 56320 + (_n6 - 65536 & 1023);
          o += String.fromCharCode(_s3, _a);
        } else console.warn("[Bluetooth] 无效的UTF-8字节:", _e8.toString(16));
      }
      return o;
    }
  }, {
    key: "getDeviceSettings",
    value: function () {
      var _getDeviceSettings = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee20() {
        var _e9, _t7;
        return _regeneratorRuntime2().wrap(function _callee20$(_context20) {
          while (1) switch (_context20.prev = _context20.next) {
            case 0:
              _context20.prev = 0;
              console.log("[Bluetooth] 开始获取设备设置...");
              _context20.next = 4;
              return this.sendCommand(t.ChameleonCommand.GET_DEVICE_SETTINGS);
            case 4:
              _e9 = _context20.sent.data;
              if (!(console.log("[Bluetooth] 设备设置原始数据:", _e9 ? Array.from(_e9) : "null"), _e9 && _e9.length >= 19)) {
                _context20.next = 8;
                break;
              }
              _t7 = {
                version: _e9[0],
                animation: _e9[1],
                buttonAPress: _e9[2],
                buttonBPress: _e9[3],
                buttonALongPress: _e9[4],
                buttonBLongPress: _e9[5],
                pairingEnabled: 1 === _e9[6],
                autoPolling: 1 === _e9[7],
                icPollingEnabled: 1 === _e9[8],
                idPollingEnabled: 1 === _e9[9],
                autoPollingDelay: _e9[10] << 8 | _e9[11],
                bleKey: this.arrayBufferToString(_e9.slice(12, 18).buffer),
                compatible8Slots: 1 === _e9[18]
              };
              return _context20.abrupt("return", (console.log("[Bluetooth] 解析设备设置:", _t7), _t7));
            case 8:
              return _context20.abrupt("return", (console.warn("[Bluetooth] 设备设置数据长度不足:", _e9 ? _e9.length : 0), null));
            case 11:
              _context20.prev = 11;
              _context20.t0 = _context20["catch"](0);
              return _context20.abrupt("return", (console.error("[Bluetooth] 获取设备设置失败", _context20.t0), null));
            case 14:
            case "end":
              return _context20.stop();
          }
        }, _callee20, this, [[0, 11]]);
      }));
      function getDeviceSettings() {
        return _getDeviceSettings.apply(this, arguments);
      }
      return getDeviceSettings;
    }()
  }, {
    key: "setAnimationMode",
    value: function () {
      var _setAnimationMode = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee21(e) {
        var o;
        return _regeneratorRuntime2().wrap(function _callee21$(_context21) {
          while (1) switch (_context21.prev = _context21.next) {
            case 0:
              _context21.prev = 0;
              console.log("[Bluetooth] 设置动画模式:", e);
              o = new Uint8Array([e]);
              _context21.next = 5;
              return this.sendCommand(t.ChameleonCommand.SET_ANIMATION_MODE, o);
            case 5:
              console.log("[Bluetooth] 动画模式设置成功");
              return _context21.abrupt("return", !0);
            case 9:
              _context21.prev = 9;
              _context21.t0 = _context21["catch"](0);
              throw console.error("[Bluetooth] 设置动画模式失败", _context21.t0), _context21.t0;
            case 12:
            case "end":
              return _context21.stop();
          }
        }, _callee21, this, [[0, 9]]);
      }));
      function setAnimationMode(_x6) {
        return _setAnimationMode.apply(this, arguments);
      }
      return setAnimationMode;
    }()
  }, {
    key: "getAnimationMode",
    value: function () {
      var _getAnimationMode = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee22() {
        var _e10;
        return _regeneratorRuntime2().wrap(function _callee22$(_context22) {
          while (1) switch (_context22.prev = _context22.next) {
            case 0:
              _context22.prev = 0;
              _context22.next = 3;
              return this.sendCommand(t.ChameleonCommand.GET_ANIMATION_MODE);
            case 3:
              _e10 = _context22.sent;
              return _context22.abrupt("return", _e10.data && _e10.data.length > 0 ? _e10.data[0] : 0);
            case 7:
              _context22.prev = 7;
              _context22.t0 = _context22["catch"](0);
              return _context22.abrupt("return", (console.error("[Bluetooth] 获取动画模式失败", _context22.t0), 0));
            case 10:
            case "end":
              return _context22.stop();
          }
        }, _callee22, this, [[0, 7]]);
      }));
      function getAnimationMode() {
        return _getAnimationMode.apply(this, arguments);
      }
      return getAnimationMode;
    }()
  }, {
    key: "setButtonConfig",
    value: function () {
      var _setButtonConfig = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee23(e, o) {
        var _r5;
        return _regeneratorRuntime2().wrap(function _callee23$(_context23) {
          while (1) switch (_context23.prev = _context23.next) {
            case 0:
              _context23.prev = 0;
              console.log("[Bluetooth] 设置按钮配置 - 按钮:", e, "配置:", o);
              _r5 = new Uint8Array([e, o]);
              _context23.next = 5;
              return this.sendCommand(t.ChameleonCommand.SET_BUTTON_PRESS_CONFIG, _r5);
            case 5:
              console.log("[Bluetooth] 按钮配置设置成功");
              return _context23.abrupt("return", !0);
            case 9:
              _context23.prev = 9;
              _context23.t0 = _context23["catch"](0);
              throw console.error("[Bluetooth] 设置按钮配置失败", _context23.t0), _context23.t0;
            case 12:
            case "end":
              return _context23.stop();
          }
        }, _callee23, this, [[0, 9]]);
      }));
      function setButtonConfig(_x7, _x8) {
        return _setButtonConfig.apply(this, arguments);
      }
      return setButtonConfig;
    }()
  }, {
    key: "setLongButtonConfig",
    value: function () {
      var _setLongButtonConfig = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee24(e, o) {
        var _r6;
        return _regeneratorRuntime2().wrap(function _callee24$(_context24) {
          while (1) switch (_context24.prev = _context24.next) {
            case 0:
              _context24.prev = 0;
              console.log("[Bluetooth] 设置按钮长按配置 - 按钮:", e, "配置:", o);
              _r6 = new Uint8Array([e, o]);
              _context24.next = 5;
              return this.sendCommand(t.ChameleonCommand.SET_LONG_BUTTON_PRESS_CONFIG, _r6);
            case 5:
              console.log("[Bluetooth] 按钮长按配置设置成功");
              return _context24.abrupt("return", !0);
            case 9:
              _context24.prev = 9;
              _context24.t0 = _context24["catch"](0);
              throw console.error("[Bluetooth] 设置按钮长按配置失败", _context24.t0), _context24.t0;
            case 12:
            case "end":
              return _context24.stop();
          }
        }, _callee24, this, [[0, 9]]);
      }));
      function setLongButtonConfig(_x9, _x10) {
        return _setLongButtonConfig.apply(this, arguments);
      }
      return setLongButtonConfig;
    }()
  }, {
    key: "setBLEPairEnabled",
    value: function () {
      var _setBLEPairEnabled = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee25(e) {
        var o;
        return _regeneratorRuntime2().wrap(function _callee25$(_context25) {
          while (1) switch (_context25.prev = _context25.next) {
            case 0:
              _context25.prev = 0;
              console.log("[Bluetooth] 设置BLE配对:", e ? "启用" : "禁用");
              o = new Uint8Array([e ? 1 : 0]);
              _context25.next = 5;
              return this.sendCommand(t.ChameleonCommand.BLE_SET_PAIR_ENABLE, o);
            case 5:
              console.log("[Bluetooth] BLE配对设置成功");
              return _context25.abrupt("return", !0);
            case 9:
              _context25.prev = 9;
              _context25.t0 = _context25["catch"](0);
              throw console.error("[Bluetooth] 设置BLE配对失败", _context25.t0), _context25.t0;
            case 12:
            case "end":
              return _context25.stop();
          }
        }, _callee25, this, [[0, 9]]);
      }));
      function setBLEPairEnabled(_x11) {
        return _setBLEPairEnabled.apply(this, arguments);
      }
      return setBLEPairEnabled;
    }()
  }, {
    key: "getSlotPollingConfig",
    value: function () {
      var _getSlotPollingConfig = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee26() {
        var _e11, _t8;
        return _regeneratorRuntime2().wrap(function _callee26$(_context26) {
          while (1) switch (_context26.prev = _context26.next) {
            case 0:
              _context26.prev = 0;
              console.log("[Bluetooth] 获取卡槽轮询配置...");
              _context26.next = 4;
              return this.sendCommand(t.ChameleonCommand.GET_SLOT_POLLING_CONFIG_LIST);
            case 4:
              _e11 = _context26.sent;
              if (_e11.success) {
                _context26.next = 7;
                break;
              }
              throw new Error("\u83B7\u53D6\u5361\u69FD\u8F6E\u8BE2\u914D\u7F6E\u5931\u8D25: ".concat(_e11.error));
            case 7:
              if (!(_e11.data && _e11.data.length >= 16)) {
                _context26.next = 10;
                break;
              }
              _t8 = Array.from(_e11.data.slice(0, 16)).map(function (e) {
                return 1 === e;
              });
              return _context26.abrupt("return", (console.log("[Bluetooth] 卡槽轮询配置:", _t8), _t8));
            case 10:
              return _context26.abrupt("return", (console.warn("[Bluetooth] 卡槽轮询配置数据长度不足:", _e11.data ? _e11.data.length : 0), new Array(16).fill(!1)));
            case 13:
              _context26.prev = 13;
              _context26.t0 = _context26["catch"](0);
              return _context26.abrupt("return", (console.error("[Bluetooth] 获取卡槽轮询配置失败", _context26.t0), new Array(16).fill(!1)));
            case 16:
            case "end":
              return _context26.stop();
          }
        }, _callee26, this, [[0, 13]]);
      }));
      function getSlotPollingConfig() {
        return _getSlotPollingConfig.apply(this, arguments);
      }
      return getSlotPollingConfig;
    }()
  }, {
    key: "setSlotPollingConfigList",
    value: function () {
      var _setSlotPollingConfigList = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee27(e) {
        var o, _t9, _r7;
        return _regeneratorRuntime2().wrap(function _callee27$(_context27) {
          while (1) switch (_context27.prev = _context27.next) {
            case 0:
              _context27.prev = 0;
              if (!(console.log("[Bluetooth] 设置卡槽轮询配置列表:", e), !Array.isArray(e) || 16 !== e.length)) {
                _context27.next = 3;
                break;
              }
              throw new Error("配置数组必须包含16个元素");
            case 3:
              o = new Uint8Array(16);
              for (_t9 = 0; _t9 < 16; _t9++) o[_t9] = e[_t9] ? 1 : 0;
              _context27.next = 7;
              return this.sendCommand(t.ChameleonCommand.SET_SLOT_POLLING_CONFIG_LIST, o);
            case 7:
              _r7 = _context27.sent;
              if (_r7.success) {
                _context27.next = 10;
                break;
              }
              throw new Error("\u8BBE\u7F6E\u5361\u69FD\u8F6E\u8BE2\u914D\u7F6E\u5931\u8D25: ".concat(_r7.error));
            case 10:
              return _context27.abrupt("return", (console.log("[Bluetooth] 卡槽轮询配置设置成功"), !0));
            case 13:
              _context27.prev = 13;
              _context27.t0 = _context27["catch"](0);
              throw console.error("[Bluetooth] 设置卡槽轮询配置失败", _context27.t0), _context27.t0;
            case 16:
            case "end":
              return _context27.stop();
          }
        }, _callee27, this, [[0, 13]]);
      }));
      function setSlotPollingConfigList(_x12) {
        return _setSlotPollingConfigList.apply(this, arguments);
      }
      return setSlotPollingConfigList;
    }()
  }, {
    key: "setSlotPollingConfig",
    value: function () {
      var _setSlotPollingConfig = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee28(e, t) {
        var o;
        return _regeneratorRuntime2().wrap(function _callee28$(_context28) {
          while (1) switch (_context28.prev = _context28.next) {
            case 0:
              _context28.prev = 0;
              console.log("[Bluetooth] 设置单个卡槽轮询 - 卡槽:", e, "状态:", t);
              _context28.next = 4;
              return this.getSlotPollingConfig();
            case 4:
              o = _context28.sent;
              o[e] = t;
              _context28.next = 8;
              return this.setSlotPollingConfigList(o);
            case 8:
              return _context28.abrupt("return", !0);
            case 11:
              _context28.prev = 11;
              _context28.t0 = _context28["catch"](0);
              throw console.error("[Bluetooth] 设置卡槽轮询配置失败", _context28.t0), _context28.t0;
            case 14:
            case "end":
              return _context28.stop();
          }
        }, _callee28, this, [[0, 11]]);
      }));
      function setSlotPollingConfig(_x13, _x14) {
        return _setSlotPollingConfig.apply(this, arguments);
      }
      return setSlotPollingConfig;
    }()
  }, {
    key: "setSlotPollingConfigListAndSave",
    value: function () {
      var _setSlotPollingConfigListAndSave = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee29(e) {
        return _regeneratorRuntime2().wrap(function _callee29$(_context29) {
          while (1) switch (_context29.prev = _context29.next) {
            case 0:
              _context29.prev = 0;
              _context29.next = 3;
              return this.setSlotPollingConfigList(e);
            case 3:
              _context29.next = 5;
              return this.saveDeviceSettings();
            case 5:
              console.log("[Bluetooth] 卡槽轮询配置设置并保存成功");
              return _context29.abrupt("return", !0);
            case 9:
              _context29.prev = 9;
              _context29.t0 = _context29["catch"](0);
              throw console.error("[Bluetooth] 设置并保存卡槽轮询配置失败", _context29.t0), _context29.t0;
            case 12:
            case "end":
              return _context29.stop();
          }
        }, _callee29, this, [[0, 9]]);
      }));
      function setSlotPollingConfigListAndSave(_x15) {
        return _setSlotPollingConfigListAndSave.apply(this, arguments);
      }
      return setSlotPollingConfigListAndSave;
    }()
  }, {
    key: "setAutoPolling",
    value: function () {
      var _setAutoPolling = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee30(e) {
        var o;
        return _regeneratorRuntime2().wrap(function _callee30$(_context30) {
          while (1) switch (_context30.prev = _context30.next) {
            case 0:
              _context30.prev = 0;
              console.log("[Bluetooth] 设置自动轮询:", e ? "启用" : "禁用");
              o = new Uint8Array([e ? 1 : 0]);
              _context30.next = 5;
              return this.sendCommand(t.ChameleonCommand.SET_DEVICE_AUTO_POLLING, o);
            case 5:
              console.log("[Bluetooth] 自动轮询设置成功");
              return _context30.abrupt("return", !0);
            case 9:
              _context30.prev = 9;
              _context30.t0 = _context30["catch"](0);
              throw console.error("[Bluetooth] 设置自动轮询失败", _context30.t0), _context30.t0;
            case 12:
            case "end":
              return _context30.stop();
          }
        }, _callee30, this, [[0, 9]]);
      }));
      function setAutoPolling(_x16) {
        return _setAutoPolling.apply(this, arguments);
      }
      return setAutoPolling;
    }()
  }, {
    key: "getAutoPolling",
    value: function () {
      var _getAutoPolling = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee31() {
        var _e12;
        return _regeneratorRuntime2().wrap(function _callee31$(_context31) {
          while (1) switch (_context31.prev = _context31.next) {
            case 0:
              _context31.prev = 0;
              _context31.next = 3;
              return this.sendCommand(t.ChameleonCommand.GET_DEVICE_AUTO_POLLING);
            case 3:
              _e12 = _context31.sent;
              return _context31.abrupt("return", !!(_e12.data && _e12.data.length > 0) && 1 === _e12.data[0]);
            case 7:
              _context31.prev = 7;
              _context31.t0 = _context31["catch"](0);
              return _context31.abrupt("return", (console.error("[Bluetooth] 获取自动轮询状态失败", _context31.t0), !1));
            case 10:
            case "end":
              return _context31.stop();
          }
        }, _callee31, this, [[0, 7]]);
      }));
      function getAutoPolling() {
        return _getAutoPolling.apply(this, arguments);
      }
      return getAutoPolling;
    }()
  }, {
    key: "setICPolling",
    value: function () {
      var _setICPolling = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee32(e) {
        var o;
        return _regeneratorRuntime2().wrap(function _callee32$(_context32) {
          while (1) switch (_context32.prev = _context32.next) {
            case 0:
              _context32.prev = 0;
              console.log("[Bluetooth] 设置IC轮询:", e ? "启用" : "禁用");
              o = new Uint8Array([e ? 1 : 0]);
              _context32.next = 5;
              return this.sendCommand(t.ChameleonCommand.SET_IC_POLLING_ENABLED, o);
            case 5:
              console.log("[Bluetooth] IC轮询设置成功");
              return _context32.abrupt("return", !0);
            case 9:
              _context32.prev = 9;
              _context32.t0 = _context32["catch"](0);
              throw console.error("[Bluetooth] 设置IC轮询失败", _context32.t0), _context32.t0;
            case 12:
            case "end":
              return _context32.stop();
          }
        }, _callee32, this, [[0, 9]]);
      }));
      function setICPolling(_x17) {
        return _setICPolling.apply(this, arguments);
      }
      return setICPolling;
    }()
  }, {
    key: "getICPolling",
    value: function () {
      var _getICPolling = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee33() {
        var _e13;
        return _regeneratorRuntime2().wrap(function _callee33$(_context33) {
          while (1) switch (_context33.prev = _context33.next) {
            case 0:
              _context33.prev = 0;
              _context33.next = 3;
              return this.sendCommand(t.ChameleonCommand.GET_IC_POLLING_ENABLED);
            case 3:
              _e13 = _context33.sent;
              return _context33.abrupt("return", !!(_e13.data && _e13.data.length > 0) && 1 === _e13.data[0]);
            case 7:
              _context33.prev = 7;
              _context33.t0 = _context33["catch"](0);
              return _context33.abrupt("return", (console.error("[Bluetooth] 获取IC轮询状态失败", _context33.t0), !1));
            case 10:
            case "end":
              return _context33.stop();
          }
        }, _callee33, this, [[0, 7]]);
      }));
      function getICPolling() {
        return _getICPolling.apply(this, arguments);
      }
      return getICPolling;
    }()
  }, {
    key: "setIDPolling",
    value: function () {
      var _setIDPolling = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee34(e) {
        var o;
        return _regeneratorRuntime2().wrap(function _callee34$(_context34) {
          while (1) switch (_context34.prev = _context34.next) {
            case 0:
              _context34.prev = 0;
              console.log("[Bluetooth] 设置ID轮询:", e ? "启用" : "禁用");
              o = new Uint8Array([e ? 1 : 0]);
              _context34.next = 5;
              return this.sendCommand(t.ChameleonCommand.SET_ID_POLLING_ENABLED, o);
            case 5:
              console.log("[Bluetooth] ID轮询设置成功");
              return _context34.abrupt("return", !0);
            case 9:
              _context34.prev = 9;
              _context34.t0 = _context34["catch"](0);
              throw console.error("[Bluetooth] 设置ID轮询失败", _context34.t0), _context34.t0;
            case 12:
            case "end":
              return _context34.stop();
          }
        }, _callee34, this, [[0, 9]]);
      }));
      function setIDPolling(_x18) {
        return _setIDPolling.apply(this, arguments);
      }
      return setIDPolling;
    }()
  }, {
    key: "getIDPolling",
    value: function () {
      var _getIDPolling = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee35() {
        var _e14;
        return _regeneratorRuntime2().wrap(function _callee35$(_context35) {
          while (1) switch (_context35.prev = _context35.next) {
            case 0:
              _context35.prev = 0;
              _context35.next = 3;
              return this.sendCommand(t.ChameleonCommand.GET_ID_POLLING_ENABLED);
            case 3:
              _e14 = _context35.sent;
              return _context35.abrupt("return", !!(_e14.data && _e14.data.length > 0) && 1 === _e14.data[0]);
            case 7:
              _context35.prev = 7;
              _context35.t0 = _context35["catch"](0);
              return _context35.abrupt("return", (console.error("[Bluetooth] 获取ID轮询状态失败", _context35.t0), !1));
            case 10:
            case "end":
              return _context35.stop();
          }
        }, _callee35, this, [[0, 7]]);
      }));
      function getIDPolling() {
        return _getIDPolling.apply(this, arguments);
      }
      return getIDPolling;
    }()
  }, {
    key: "setAutoPollingDelay",
    value: function () {
      var _setAutoPollingDelay = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee36(e) {
        var o;
        return _regeneratorRuntime2().wrap(function _callee36$(_context36) {
          while (1) switch (_context36.prev = _context36.next) {
            case 0:
              _context36.prev = 0;
              console.log("[Bluetooth] 设置轮询延迟:", e + "ms");
              o = new Uint8Array(2);
              o[0] = e >> 8 & 255;
              o[1] = 255 & e;
              _context36.next = 7;
              return this.sendCommand(t.ChameleonCommand.SET_DEVICE_AUTO_POLLING_DELAY, o);
            case 7:
              console.log("[Bluetooth] 轮询延迟设置成功");
              return _context36.abrupt("return", !0);
            case 11:
              _context36.prev = 11;
              _context36.t0 = _context36["catch"](0);
              throw console.error("[Bluetooth] 设置轮询延迟失败", _context36.t0), _context36.t0;
            case 14:
            case "end":
              return _context36.stop();
          }
        }, _callee36, this, [[0, 11]]);
      }));
      function setAutoPollingDelay(_x19) {
        return _setAutoPollingDelay.apply(this, arguments);
      }
      return setAutoPollingDelay;
    }()
  }, {
    key: "getAutoPollingDelay",
    value: function () {
      var _getAutoPollingDelay = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee37() {
        var _e15, _t10;
        return _regeneratorRuntime2().wrap(function _callee37$(_context37) {
          while (1) switch (_context37.prev = _context37.next) {
            case 0:
              _context37.prev = 0;
              _context37.next = 3;
              return this.sendCommand(t.ChameleonCommand.GET_DEVICE_AUTO_POLLING_DELAY);
            case 3:
              _e15 = _context37.sent;
              if (!(_e15.data && _e15.data.length >= 2)) {
                _context37.next = 7;
                break;
              }
              _t10 = _e15.data[0] << 8 | _e15.data[1];
              return _context37.abrupt("return", (console.log("[Bluetooth] 获取轮询延迟:", _t10 + "ms"), _t10));
            case 7:
              return _context37.abrupt("return", 350);
            case 10:
              _context37.prev = 10;
              _context37.t0 = _context37["catch"](0);
              return _context37.abrupt("return", (console.error("[Bluetooth] 获取轮询延迟失败", _context37.t0), 350));
            case 13:
            case "end":
              return _context37.stop();
          }
        }, _callee37, this, [[0, 10]]);
      }));
      function getAutoPollingDelay() {
        return _getAutoPollingDelay.apply(this, arguments);
      }
      return getAutoPollingDelay;
    }()
  }, {
    key: "saveDeviceSettings",
    value: function () {
      var _saveDeviceSettings = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee38() {
        return _regeneratorRuntime2().wrap(function _callee38$(_context38) {
          while (1) switch (_context38.prev = _context38.next) {
            case 0:
              _context38.prev = 0;
              console.log("[Bluetooth] 保存设备设置...");
              _context38.next = 4;
              return this.sendCommand(t.ChameleonCommand.SAVE_SETTINGS);
            case 4:
              console.log("[Bluetooth] 设备设置保存成功");
              return _context38.abrupt("return", !0);
            case 8:
              _context38.prev = 8;
              _context38.t0 = _context38["catch"](0);
              throw console.error("[Bluetooth] 保存设备设置失败", _context38.t0), _context38.t0;
            case 11:
            case "end":
              return _context38.stop();
          }
        }, _callee38, this, [[0, 8]]);
      }));
      function saveDeviceSettings() {
        return _saveDeviceSettings.apply(this, arguments);
      }
      return saveDeviceSettings;
    }()
  }, {
    key: "getCompatible8Slots",
    value: function () {
      var _getCompatible8Slots = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee39() {
        var _e16, _t11;
        return _regeneratorRuntime2().wrap(function _callee39$(_context39) {
          while (1) switch (_context39.prev = _context39.next) {
            case 0:
              _context39.prev = 0;
              console.log("[Bluetooth] 获取兼容8卡槽状态...");
              _context39.next = 4;
              return this.sendCommand(t.ChameleonCommand.GET_COMPATIBLE_8_SLOTS);
            case 4:
              _e16 = _context39.sent;
              if (!(_e16.data && _e16.data.length > 0)) {
                _context39.next = 8;
                break;
              }
              _t11 = 1 === _e16.data[0];
              return _context39.abrupt("return", (console.log("[Bluetooth] 兼容8卡槽状态:", _t11 ? "启用" : "禁用"), _t11));
            case 8:
              return _context39.abrupt("return", !1);
            case 11:
              _context39.prev = 11;
              _context39.t0 = _context39["catch"](0);
              return _context39.abrupt("return", (console.error("[Bluetooth] 获取兼容8卡槽状态失败", _context39.t0), !1));
            case 14:
            case "end":
              return _context39.stop();
          }
        }, _callee39, this, [[0, 11]]);
      }));
      function getCompatible8Slots() {
        return _getCompatible8Slots.apply(this, arguments);
      }
      return getCompatible8Slots;
    }()
  }, {
    key: "setCompatible8Slots",
    value: function () {
      var _setCompatible8Slots = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee40(e) {
        var o;
        return _regeneratorRuntime2().wrap(function _callee40$(_context40) {
          while (1) switch (_context40.prev = _context40.next) {
            case 0:
              _context40.prev = 0;
              console.log("[Bluetooth] 设置兼容8卡槽状态:", e ? "启用" : "禁用");
              o = new Uint8Array([e ? 1 : 0]);
              _context40.next = 5;
              return this.sendCommand(t.ChameleonCommand.SET_COMPATIBLE_8_SLOTS, o);
            case 5:
              console.log("[Bluetooth] 兼容8卡槽状态设置成功");
              return _context40.abrupt("return", !0);
            case 9:
              _context40.prev = 9;
              _context40.t0 = _context40["catch"](0);
              throw console.error("[Bluetooth] 设置兼容8卡槽状态失败", _context40.t0), _context40.t0;
            case 12:
            case "end":
              return _context40.stop();
          }
        }, _callee40, this, [[0, 9]]);
      }));
      function setCompatible8Slots(_x20) {
        return _setCompatible8Slots.apply(this, arguments);
      }
      return setCompatible8Slots;
    }()
  }, {
    key: "setBLEConnectKey",
    value: function () {
      var _setBLEConnectKey = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee41(e) {
        var o;
        return _regeneratorRuntime2().wrap(function _callee41$(_context41) {
          while (1) switch (_context41.prev = _context41.next) {
            case 0:
              _context41.prev = 0;
              console.log("[Bluetooth] 设置BLE连接密钥...");
              o = this.stringToArrayBuffer(e);
              _context41.next = 5;
              return this.sendCommand(t.ChameleonCommand.BLE_SET_CONNECT_KEY, Array.from(new Uint8Array(o)));
            case 5:
              console.log("[Bluetooth] BLE连接密钥设置成功");
              return _context41.abrupt("return", !0);
            case 9:
              _context41.prev = 9;
              _context41.t0 = _context41["catch"](0);
              throw console.error("[Bluetooth] 设置BLE连接密钥失败", _context41.t0), _context41.t0;
            case 12:
            case "end":
              return _context41.stop();
          }
        }, _callee41, this, [[0, 9]]);
      }));
      function setBLEConnectKey(_x21) {
        return _setBLEConnectKey.apply(this, arguments);
      }
      return setBLEConnectKey;
    }()
  }, {
    key: "getBLEConnectKey",
    value: function () {
      var _getBLEConnectKey = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee42() {
        var _e17, _t12;
        return _regeneratorRuntime2().wrap(function _callee42$(_context42) {
          while (1) switch (_context42.prev = _context42.next) {
            case 0:
              _context42.prev = 0;
              console.log("[Bluetooth] 获取BLE连接密钥...");
              _context42.next = 4;
              return this.sendCommand(t.ChameleonCommand.BLE_GET_CONNECT_KEY);
            case 4:
              _e17 = _context42.sent;
              if (!_e17.data) {
                _context42.next = 8;
                break;
              }
              _t12 = this.arrayBufferToString(_e17.data.buffer);
              return _context42.abrupt("return", (console.log("[Bluetooth] BLE连接密钥获取成功"), _t12));
            case 8:
              return _context42.abrupt("return", "");
            case 11:
              _context42.prev = 11;
              _context42.t0 = _context42["catch"](0);
              return _context42.abrupt("return", (console.error("[Bluetooth] 获取BLE连接密钥失败", _context42.t0), ""));
            case 14:
            case "end":
              return _context42.stop();
          }
        }, _callee42, this, [[0, 11]]);
      }));
      function getBLEConnectKey() {
        return _getBLEConnectKey.apply(this, arguments);
      }
      return getBLEConnectKey;
    }()
  }, {
    key: "setActiveSlot",
    value: function () {
      var _setActiveSlot = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee43(e) {
        var o, _t13;
        return _regeneratorRuntime2().wrap(function _callee43$(_context43) {
          while (1) switch (_context43.prev = _context43.next) {
            case 0:
              if (this.isConnected) {
                _context43.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              if (!(e < 0 || e > 15)) {
                _context43.next = 4;
                break;
              }
              throw new Error("无效的卡槽编号");
            case 4:
              _context43.prev = 4;
              console.log("[\u84DD\u7259\u670D\u52A1] \u8BBE\u7F6E\u6D3B\u52A8\u5361\u69FD: ".concat(e, " (UI\u663E\u793A: \u5361\u69FD").concat(e + 1, ")"));
              _context43.next = 8;
              return this.sendCommand(t.ChameleonCommand.SET_ACTIVE_SLOT, new Uint8Array([e]));
            case 8:
              o = _context43.sent;
              if (!o.success) {
                _context43.next = 17;
                break;
              }
              console.log("[\u84DD\u7259\u670D\u52A1] \u6210\u529F\u8BBE\u7F6E\u6D3B\u52A8\u5361\u69FD\u4E3A ".concat(e, " (UI\u663E\u793A: \u5361\u69FD").concat(e + 1, ")"));
              _context43.next = 13;
              return this.getActiveSlot();
            case 13:
              _t13 = _context43.sent;
              if (!(_t13 !== e)) {
                _context43.next = 16;
                break;
              }
              throw new Error("\u5361\u69FD\u5207\u6362\u5931\u8D25\uFF0C\u5F53\u524D\u5361\u69FD: ".concat(_t13, ", \u671F\u671B: ").concat(e));
            case 16:
              return _context43.abrupt("return", o);
            case 17:
              throw new Error("\u8BBE\u7F6E\u6D3B\u52A8\u5361\u69FD\u5931\u8D25: ".concat(o.error || "未知错误"));
            case 20:
              _context43.prev = 20;
              _context43.t0 = _context43["catch"](4);
              throw console.error("[蓝牙服务] 设置活动卡槽失败:", _context43.t0), _context43.t0;
            case 23:
            case "end":
              return _context43.stop();
          }
        }, _callee43, this, [[4, 20]]);
      }));
      function setActiveSlot(_x22) {
        return _setActiveSlot.apply(this, arguments);
      }
      return setActiveSlot;
    }()
  }, {
    key: "getActiveSlot",
    value: function () {
      var _getActiveSlot = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee44() {
        var _e18, _t14;
        return _regeneratorRuntime2().wrap(function _callee44$(_context44) {
          while (1) switch (_context44.prev = _context44.next) {
            case 0:
              if (this.isConnected) {
                _context44.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context44.prev = 2;
              console.log("[蓝牙服务] 获取当前活动卡槽");
              _context44.next = 6;
              return this.sendCommand(t.ChameleonCommand.GET_ACTIVE_SLOT);
            case 6:
              _e18 = _context44.sent;
              if (!(_e18.success && _e18.data && _e18.data.length > 0)) {
                _context44.next = 10;
                break;
              }
              _t14 = _e18.data[0];
              return _context44.abrupt("return", (console.log("[\u84DD\u7259\u670D\u52A1] \u5F53\u524D\u6D3B\u52A8\u5361\u69FD: ".concat(_t14)), _t14));
            case 10:
              throw new Error("获取活动卡槽失败");
            case 13:
              _context44.prev = 13;
              _context44.t0 = _context44["catch"](2);
              throw console.error("[蓝牙服务] 获取活动卡槽失败:", _context44.t0), _context44.t0;
            case 16:
            case "end":
              return _context44.stop();
          }
        }, _callee44, this, [[2, 13]]);
      }));
      function getActiveSlot() {
        return _getActiveSlot.apply(this, arguments);
      }
      return getActiveSlot;
    }()
  }, {
    key: "getSlotInfo",
    value: function () {
      var _getSlotInfo = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee45() {
        var _e19, _t15, o, _r8, _n7, _s4;
        return _regeneratorRuntime2().wrap(function _callee45$(_context45) {
          while (1) switch (_context45.prev = _context45.next) {
            case 0:
              if (this.isConnected) {
                _context45.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context45.prev = 2;
              console.log("[蓝牙服务] 获取卡槽信息");
              _context45.next = 6;
              return this.sendCommand(t.ChameleonCommand.GET_SLOT_INFO);
            case 6:
              _e19 = _context45.sent;
              if (!(_e19.success && _e19.data)) {
                _context45.next = 12;
                break;
              }
              _t15 = [];
              o = 0;
              for (_r8 = 0; _r8 < 16; _r8++) {
                _n7 = this.bytesToU16(_e19.data.slice(o, o + 2)), _s4 = this.bytesToU16(_e19.data.slice(o + 2, o + 4));
                _t15.push({
                  id: _r8,
                  hfType: _n7,
                  lfType: _s4,
                  hfTagType: this.numberToChameleonTag(_n7),
                  lfTagType: this.numberToChameleonTag(_s4)
                }), o += 4;
              }
              return _context45.abrupt("return", (console.log("[\u84DD\u7259\u670D\u52A1] \u83B7\u53D6\u5230 ".concat(_t15.length, " \u4E2A\u5361\u69FD\u4FE1\u606F")), _t15));
            case 12:
              throw new Error("获取卡槽信息失败");
            case 15:
              _context45.prev = 15;
              _context45.t0 = _context45["catch"](2);
              throw console.error("[蓝牙服务] 获取卡槽信息失败:", _context45.t0), _context45.t0;
            case 18:
            case "end":
              return _context45.stop();
          }
        }, _callee45, this, [[2, 15]]);
      }));
      function getSlotInfo() {
        return _getSlotInfo.apply(this, arguments);
      }
      return getSlotInfo;
    }()
  }, {
    key: "getEnabledSlots",
    value: function () {
      var _getEnabledSlots = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee46() {
        var _e20, _t16, o, _r9, _n8;
        return _regeneratorRuntime2().wrap(function _callee46$(_context46) {
          while (1) switch (_context46.prev = _context46.next) {
            case 0:
              if (this.isConnected) {
                _context46.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context46.prev = 2;
              console.log("[蓝牙服务] 获取卡槽启用状态");
              _context46.next = 6;
              return this.sendCommand(t.ChameleonCommand.GET_ENABLED_SLOTS);
            case 6:
              _e20 = _context46.sent;
              if (!(_e20.success && _e20.data)) {
                _context46.next = 11;
                break;
              }
              _t16 = [];
              for (o = 0; o < 16; o++) {
                _r9 = 1 === _e20.data[2 * o], _n8 = 1 === _e20.data[2 * o + 1];
                _t16.push({
                  id: o,
                  hf: _r9,
                  lf: _n8,
                  any: _r9 || _n8
                });
              }
              return _context46.abrupt("return", (console.log("[\u84DD\u7259\u670D\u52A1] \u83B7\u53D6\u5230 ".concat(_t16.length, " \u4E2A\u5361\u69FD\u542F\u7528\u72B6\u6001")), _t16));
            case 11:
              throw new Error("获取卡槽启用状态失败");
            case 14:
              _context46.prev = 14;
              _context46.t0 = _context46["catch"](2);
              throw console.error("[蓝牙服务] 获取卡槽启用状态失败:", _context46.t0), _context46.t0;
            case 17:
            case "end":
              return _context46.stop();
          }
        }, _callee46, this, [[2, 14]]);
      }));
      function getEnabledSlots() {
        return _getEnabledSlots.apply(this, arguments);
      }
      return getEnabledSlots;
    }()
  }, {
    key: "getSlotTagName",
    value: function () {
      var _getSlotTagName = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee47(e, o) {
        var _r10, _t17;
        return _regeneratorRuntime2().wrap(function _callee47$(_context47) {
          while (1) switch (_context47.prev = _context47.next) {
            case 0:
              if (this.isConnected) {
                _context47.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              if (!(e < 0 || e > 15)) {
                _context47.next = 4;
                break;
              }
              throw new Error("无效的卡槽编号");
            case 4:
              _context47.prev = 4;
              console.log("[\u84DD\u7259\u670D\u52A1] \u83B7\u53D6\u5361\u69FD ".concat(e, " \u540D\u79F0 (\u9891\u7387: ").concat(o, ")"));
              _context47.next = 8;
              return this.sendCommand(t.ChameleonCommand.GET_SLOT_TAG_NICK, new Uint8Array([e, o]));
            case 8:
              _r10 = _context47.sent;
              if (!(_r10.success && _r10.data)) {
                _context47.next = 12;
                break;
              }
              _t17 = this.decodeUTF8(_r10.data);
              return _context47.abrupt("return", (console.log("[\u84DD\u7259\u670D\u52A1] \u5361\u69FD ".concat(e, " \u540D\u79F0: ").concat(_t17)), _t17.trim()));
            case 12:
              throw new Error("获取卡槽名称失败");
            case 15:
              _context47.prev = 15;
              _context47.t0 = _context47["catch"](4);
              return _context47.abrupt("return", (console.error("[蓝牙服务] 获取卡槽名称失败:", _context47.t0), ""));
            case 18:
            case "end":
              return _context47.stop();
          }
        }, _callee47, this, [[4, 15]]);
      }));
      function getSlotTagName(_x23, _x24) {
        return _getSlotTagName.apply(this, arguments);
      }
      return getSlotTagName;
    }()
  }, {
    key: "setSlotTagName",
    value: function () {
      var _setSlotTagName = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee48(e, o, r) {
        var _n9, _s5, _a2, i;
        return _regeneratorRuntime2().wrap(function _callee48$(_context48) {
          while (1) switch (_context48.prev = _context48.next) {
            case 0:
              if (this.isConnected) {
                _context48.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              if (!(e < 0 || e > 15)) {
                _context48.next = 4;
                break;
              }
              throw new Error("无效的卡槽编号");
            case 4:
              _context48.prev = 4;
              console.log("[\u84DD\u7259\u670D\u52A1] \u8BBE\u7F6E\u5361\u69FD ".concat(e, " \u540D\u79F0: ").concat(r, " (\u9891\u7387: ").concat(o, ")"));
              _n9 = this.encodeUTF8(r);
              if (!(_n9.length > 32)) {
                _context48.next = 9;
                break;
              }
              throw new Error("\u5361\u7247\u540D\u79F0\u8FC7\u957F\uFF0CUTF-8\u7F16\u7801\u540E\u8D85\u8FC732\u5B57\u8282 (\u5F53\u524D: ".concat(_n9.length, "\u5B57\u8282)"));
            case 9:
              if (!("hf" === o || o === t.TagFrequency.HF)) {
                _context48.next = 13;
                break;
              }
              _s5 = t.TagFrequency.HF;
              _context48.next = 16;
              break;
            case 13:
              if (!("lf" !== o && o !== t.TagFrequency.LF)) {
                _context48.next = 15;
                break;
              }
              throw new Error('无效的频率类型，必须是"hf"或"lf"');
            case 15:
              _s5 = t.TagFrequency.LF;
            case 16:
              _a2 = new Uint8Array(2 + _n9.length);
              _a2[0] = e, _a2[1] = _s5, _a2.set(_n9, 2);
              _context48.next = 20;
              return this.sendCommand(t.ChameleonCommand.SET_SLOT_TAG_NICK, _a2);
            case 20:
              i = _context48.sent;
              if (!i.success) {
                _context48.next = 23;
                break;
              }
              return _context48.abrupt("return", (console.log("[\u84DD\u7259\u670D\u52A1] \u6210\u529F\u8BBE\u7F6E\u5361\u69FD ".concat(e, " \u540D\u79F0")), i));
            case 23:
              throw new Error("\u8BBE\u7F6E\u5361\u69FD\u540D\u79F0\u5931\u8D25: ".concat(i.error || "未知错误"));
            case 26:
              _context48.prev = 26;
              _context48.t0 = _context48["catch"](4);
              throw console.error("[蓝牙服务] 设置卡槽名称失败:", _context48.t0), _context48.t0;
            case 29:
            case "end":
              return _context48.stop();
          }
        }, _callee48, this, [[4, 26]]);
      }));
      function setSlotTagName(_x25, _x26, _x27) {
        return _setSlotTagName.apply(this, arguments);
      }
      return setSlotTagName;
    }()
  }, {
    key: "encodeUTF8",
    value: function encodeUTF8(e) {
      var t = [];
      for (var o = 0; o < e.length; o++) {
        var _r11 = e.charCodeAt(o);
        _r11 < 128 ? t.push(_r11) : _r11 < 2048 ? t.push(192 | _r11 >> 6, 128 | 63 & _r11) : t.push(224 | _r11 >> 12, 128 | _r11 >> 6 & 63, 128 | 63 & _r11);
      }
      return new Uint8Array(t);
    }
  }, {
    key: "decodeUTF8",
    value: function decodeUTF8(e) {
      var t = "",
        o = 0;
      for (; o < e.length;) {
        var _r12 = e[o];
        _r12 < 128 ? (t += String.fromCharCode(_r12), o++) : _r12 > 191 && _r12 < 224 ? (t += String.fromCharCode((31 & _r12) << 6 | 63 & e[o + 1]), o += 2) : (t += String.fromCharCode((15 & _r12) << 12 | (63 & e[o + 1]) << 6 | 63 & e[o + 2]), o += 3);
      }
      return t;
    }
  }, {
    key: "bytesToU16",
    value: function bytesToU16(e) {
      return e.length < 2 ? 0 : e[0] << 8 | e[1];
    }
  }, {
    key: "u16ToBytes",
    value: function u16ToBytes(e) {
      return [e >> 8 & 255, 255 & e];
    }
  }, {
    key: "send14ARaw",
    value: function () {
      var _send14ARaw = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee49(e) {
        var o,
          _o$respTimeoutMs,
          r,
          _o$bitLen,
          n,
          _o$activateRfField,
          s,
          _o$waitResponse,
          a,
          _o$appendCrc,
          i,
          _o$autoSelect,
          c,
          _o$keepRfField,
          l,
          _o$checkResponseCrc,
          h,
          u,
          d,
          m,
          C,
          _args49 = arguments;
        return _regeneratorRuntime2().wrap(function _callee49$(_context49) {
          while (1) switch (_context49.prev = _context49.next) {
            case 0:
              o = _args49.length > 1 && _args49[1] !== undefined ? _args49[1] : {};
              _o$respTimeoutMs = o.respTimeoutMs, r = _o$respTimeoutMs === void 0 ? 100 : _o$respTimeoutMs, _o$bitLen = o.bitLen, n = _o$bitLen === void 0 ? null : _o$bitLen, _o$activateRfField = o.activateRfField, s = _o$activateRfField === void 0 ? !0 : _o$activateRfField, _o$waitResponse = o.waitResponse, a = _o$waitResponse === void 0 ? !0 : _o$waitResponse, _o$appendCrc = o.appendCrc, i = _o$appendCrc === void 0 ? !0 : _o$appendCrc, _o$autoSelect = o.autoSelect, c = _o$autoSelect === void 0 ? !0 : _o$autoSelect, _o$keepRfField = o.keepRfField, l = _o$keepRfField === void 0 ? !1 : _o$keepRfField, _o$checkResponseCrc = o.checkResponseCrc, h = _o$checkResponseCrc === void 0 ? !0 : _o$checkResponseCrc, u = null !== n ? n : 8 * e.length;
              d = 0;
              s && (d += 128), a && (d += 64), i && (d += 32), c && (d += 16), l && (d += 8), h && (d += 4);
              m = [d].concat(_toConsumableArray2(this.u16ToBytes(r)), _toConsumableArray2(this.u16ToBytes(u)), _toConsumableArray2(e));
              console.log("[Bluetooth] \u53D1\u900114A\u539F\u59CB\u547D\u4EE4\uFF0C\u6570\u636E: [".concat(e.join(", "), "], \u9009\u9879: 0x").concat(d.toString(16)));
              _context49.next = 8;
              return this.sendCommand(t.ChameleonCommand.HF14A_RAW_COMMAND, m, r + 1e3);
            case 8:
              C = _context49.sent;
              if (!C.success) {
                _context49.next = 11;
                break;
              }
              return _context49.abrupt("return", C.data);
            case 11:
              throw new Error(C.error || "14A原始命令执行失败");
            case 12:
            case "end":
              return _context49.stop();
          }
        }, _callee49, this);
      }));
      function send14ARaw(_x28) {
        return _send14ARaw.apply(this, arguments);
      }
      return send14ARaw;
    }()
  }, {
    key: "numberToChameleonTag",
    value: function numberToChameleonTag(e) {
      switch (e) {
        case 0:
        default:
          return "UNKNOWN";
        case 100:
          return "EM410X";
        case 1e3:
          return "MIFARE_Mini";
        case 1001:
          return "MIFARE_1024";
        case 1002:
          return "MIFARE_2048";
        case 1003:
          return "MIFARE_4096";
        case 1100:
          return "NTAG_213";
        case 1101:
          return "NTAG_215";
        case 1102:
          return "NTAG_216";
        case 1103:
          return "MIFARE_Ultralight";
        case 1104:
          return "MIFARE_Ultralight_C";
        case 1105:
          return "MIFARE_Ultralight_EV1_80B";
        case 1106:
          return "MIFARE_Ultralight_EV1_164B";
        case 1107:
          return "NTAG_210";
        case 1108:
          return "NTAG_212";
      }
    }
  }, {
    key: "activateSlot",
    value: function () {
      var _activateSlot = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee50(e) {
        var o;
        return _regeneratorRuntime2().wrap(function _callee50$(_context50) {
          while (1) switch (_context50.prev = _context50.next) {
            case 0:
              if (this.isConnected) {
                _context50.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context50.prev = 2;
              _context50.next = 5;
              return this.sendCommand(t.ChameleonCommand.SET_ACTIVE_SLOT, [e]);
            case 5:
              o = _context50.sent;
              return _context50.abrupt("return", (console.log("[\u84DD\u7259\u670D\u52A1] \u6FC0\u6D3B\u5361\u69FD: ".concat(e)), o));
            case 9:
              _context50.prev = 9;
              _context50.t0 = _context50["catch"](2);
              throw console.error("[蓝牙服务] 激活卡槽失败:", _context50.t0), _context50.t0;
            case 12:
            case "end":
              return _context50.stop();
          }
        }, _callee50, this, [[2, 9]]);
      }));
      function activateSlot(_x29) {
        return _activateSlot.apply(this, arguments);
      }
      return activateSlot;
    }()
  }, {
    key: "enableSlot",
    value: function () {
      var _enableSlot = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee51(e, o, r) {
        var _n10, _s6, _a3;
        return _regeneratorRuntime2().wrap(function _callee51$(_context51) {
          while (1) switch (_context51.prev = _context51.next) {
            case 0:
              if (this.isConnected) {
                _context51.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context51.prev = 2;
              _n10 = "hf" === o ? 2 : 1;
              _s6 = r ? 1 : 0;
              _context51.next = 7;
              return this.sendCommand(t.ChameleonCommand.SET_SLOT_ENABLE, [e, _n10, _s6]);
            case 7:
              _a3 = _context51.sent;
              return _context51.abrupt("return", (console.log("[\u84DD\u7259\u670D\u52A1] \u8BBE\u7F6E\u5361\u69FD".concat(e, " ").concat(o, "\u9891\u7387\u542F\u7528\u72B6\u6001: ").concat(r)), _a3));
            case 11:
              _context51.prev = 11;
              _context51.t0 = _context51["catch"](2);
              throw console.error("[蓝牙服务] 设置卡槽启用状态失败:", _context51.t0), _context51.t0;
            case 14:
            case "end":
              return _context51.stop();
          }
        }, _callee51, this, [[2, 11]]);
      }));
      function enableSlot(_x30, _x31, _x32) {
        return _enableSlot.apply(this, arguments);
      }
      return enableSlot;
    }()
  }, {
    key: "setSlotType",
    value: function () {
      var _setSlotType = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee52(e, o) {
        var _r13, _n11;
        return _regeneratorRuntime2().wrap(function _callee52$(_context52) {
          while (1) switch (_context52.prev = _context52.next) {
            case 0:
              if (this.isConnected) {
                _context52.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context52.prev = 2;
              _r13 = this.u16ToBytes(o);
              _context52.next = 6;
              return this.sendCommand(t.ChameleonCommand.SET_SLOT_TAG_TYPE, [e].concat(_toConsumableArray2(_r13)));
            case 6:
              _n11 = _context52.sent;
              return _context52.abrupt("return", (console.log("[\u84DD\u7259\u670D\u52A1] \u8BBE\u7F6E\u5361\u69FD".concat(e, "\u6807\u7B7E\u7C7B\u578B: ").concat(o)), _n11));
            case 10:
              _context52.prev = 10;
              _context52.t0 = _context52["catch"](2);
              throw console.error("[蓝牙服务] 设置卡槽标签类型失败:", _context52.t0), _context52.t0;
            case 13:
            case "end":
              return _context52.stop();
          }
        }, _callee52, this, [[2, 10]]);
      }));
      function setSlotType(_x33, _x34) {
        return _setSlotType.apply(this, arguments);
      }
      return setSlotType;
    }()
  }, {
    key: "setDefaultDataToSlot",
    value: function () {
      var _setDefaultDataToSlot = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee53(e, o) {
        var _r14, _n12;
        return _regeneratorRuntime2().wrap(function _callee53$(_context53) {
          while (1) switch (_context53.prev = _context53.next) {
            case 0:
              if (this.isConnected) {
                _context53.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context53.prev = 2;
              _r14 = this.u16ToBytes(o);
              _context53.next = 6;
              return this.sendCommand(t.ChameleonCommand.SET_SLOT_DATA_DEFAULT, [e].concat(_toConsumableArray2(_r14)));
            case 6:
              _n12 = _context53.sent;
              return _context53.abrupt("return", (console.log("[\u84DD\u7259\u670D\u52A1] \u8BBE\u7F6E\u5361\u69FD".concat(e, "\u9ED8\u8BA4\u6570\u636E\uFF0C\u6807\u7B7E\u7C7B\u578B: ").concat(o)), _n12));
            case 10:
              _context53.prev = 10;
              _context53.t0 = _context53["catch"](2);
              throw console.error("[蓝牙服务] 设置卡槽默认数据失败:", _context53.t0), _context53.t0;
            case 13:
            case "end":
              return _context53.stop();
          }
        }, _callee53, this, [[2, 10]]);
      }));
      function setDefaultDataToSlot(_x35, _x36) {
        return _setDefaultDataToSlot.apply(this, arguments);
      }
      return setDefaultDataToSlot;
    }()
  }, {
    key: "setSlotDataDefault",
    value: function () {
      var _setSlotDataDefault = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee54(e, t) {
        return _regeneratorRuntime2().wrap(function _callee54$(_context54) {
          while (1) switch (_context54.prev = _context54.next) {
            case 0:
              return _context54.abrupt("return", this.setDefaultDataToSlot(e, t));
            case 1:
            case "end":
              return _context54.stop();
          }
        }, _callee54, this);
      }));
      function setSlotDataDefault(_x37, _x38) {
        return _setSlotDataDefault.apply(this, arguments);
      }
      return setSlotDataDefault;
    }()
  }, {
    key: "saveSlotData",
    value: function () {
      var _saveSlotData = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee55() {
        var _e21;
        return _regeneratorRuntime2().wrap(function _callee55$(_context55) {
          while (1) switch (_context55.prev = _context55.next) {
            case 0:
              if (this.isConnected) {
                _context55.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context55.prev = 2;
              _context55.next = 5;
              return this.sendCommand(t.ChameleonCommand.SAVE_SLOT_NICKS, []);
            case 5:
              _e21 = _context55.sent;
              return _context55.abrupt("return", (console.log("[蓝牙服务] 保存卡槽数据成功"), _e21));
            case 9:
              _context55.prev = 9;
              _context55.t0 = _context55["catch"](2);
              throw console.error("[蓝牙服务] 保存卡槽数据失败:", _context55.t0), _context55.t0;
            case 12:
            case "end":
              return _context55.stop();
          }
        }, _callee55, this, [[2, 9]]);
      }));
      function saveSlotData() {
        return _saveSlotData.apply(this, arguments);
      }
      return saveSlotData;
    }()
  }, {
    key: "deleteSlotInfo",
    value: function () {
      var _deleteSlotInfo = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee56(e, o) {
        var _r15;
        return _regeneratorRuntime2().wrap(function _callee56$(_context56) {
          while (1) switch (_context56.prev = _context56.next) {
            case 0:
              if (this.isConnected) {
                _context56.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context56.prev = 2;
              _context56.next = 5;
              return this.sendCommand(t.ChameleonCommand.DELETE_SLOT_INFO, [e, o]);
            case 5:
              _r15 = _context56.sent;
              return _context56.abrupt("return", (console.log("[\u84DD\u7259\u670D\u52A1] \u5220\u9664\u5361\u69FD".concat(e, " \u9891\u7387").concat(o, "\u4FE1\u606F\u6210\u529F")), _r15));
            case 9:
              _context56.prev = 9;
              _context56.t0 = _context56["catch"](2);
              throw console.error("[蓝牙服务] 删除卡槽信息失败:", _context56.t0), _context56.t0;
            case 12:
            case "end":
              return _context56.stop();
          }
        }, _callee56, this, [[2, 9]]);
      }));
      function deleteSlotInfo(_x39, _x40) {
        return _deleteSlotInfo.apply(this, arguments);
      }
      return deleteSlotInfo;
    }()
  }, {
    key: "clearSlot",
    value: function () {
      var _clearSlot = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee57(e) {
        return _regeneratorRuntime2().wrap(function _callee57$(_context57) {
          while (1) switch (_context57.prev = _context57.next) {
            case 0:
              if (this.isConnected) {
                _context57.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context57.prev = 2;
              console.log("[\u84DD\u7259\u670D\u52A1] \u5F00\u59CB\u6E05\u7A7A\u5361\u69FD ".concat(e));
              _context57.prev = 4;
              _context57.next = 7;
              return this.deleteSlotInfo(e, t.TagFrequency.HF);
            case 7:
              console.log("[蓝牙服务] 删除HF频率信息成功");
              _context57.next = 13;
              break;
            case 10:
              _context57.prev = 10;
              _context57.t0 = _context57["catch"](4);
              console.warn("[蓝牙服务] 删除HF频率信息失败:", _context57.t0);
            case 13:
              _context57.prev = 13;
              _context57.next = 16;
              return this.deleteSlotInfo(e, t.TagFrequency.LF);
            case 16:
              console.log("[蓝牙服务] 删除LF频率信息成功");
              _context57.next = 22;
              break;
            case 19:
              _context57.prev = 19;
              _context57.t1 = _context57["catch"](13);
              console.warn("[蓝牙服务] 删除LF频率信息失败:", _context57.t1);
            case 22:
              _context57.prev = 22;
              _context57.next = 25;
              return this.setSlotTagName(e, t.TagFrequency.HF, "");
            case 25:
              console.log("[蓝牙服务] 清空HF频率名称成功");
              _context57.next = 31;
              break;
            case 28:
              _context57.prev = 28;
              _context57.t2 = _context57["catch"](22);
              console.warn("[蓝牙服务] 清空HF频率名称失败:", _context57.t2);
            case 31:
              _context57.prev = 31;
              _context57.next = 34;
              return this.setSlotTagName(e, t.TagFrequency.LF, "");
            case 34:
              console.log("[蓝牙服务] 清空LF频率名称成功");
              _context57.next = 40;
              break;
            case 37:
              _context57.prev = 37;
              _context57.t3 = _context57["catch"](31);
              console.warn("[蓝牙服务] 清空LF频率名称失败:", _context57.t3);
            case 40:
              _context57.next = 42;
              return this.saveSlotData();
            case 42:
              console.log("[\u84DD\u7259\u670D\u52A1] \u5361\u69FD ".concat(e, " \u6E05\u7A7A\u5B8C\u6210"));
              _context57.next = 48;
              break;
            case 45:
              _context57.prev = 45;
              _context57.t4 = _context57["catch"](2);
              throw console.error("[蓝牙服务] 清空卡槽失败:", _context57.t4), _context57.t4;
            case 48:
            case "end":
              return _context57.stop();
          }
        }, _callee57, this, [[2, 45], [4, 10], [13, 19], [22, 28], [31, 37]]);
      }));
      function clearSlot(_x41) {
        return _clearSlot.apply(this, arguments);
      }
      return clearSlot;
    }()
  }, {
    key: "enableSlotFrequency",
    value: function () {
      var _enableSlotFrequency = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee58(e, o, r) {
        var _n13, _s7, _a4;
        return _regeneratorRuntime2().wrap(function _callee58$(_context58) {
          while (1) switch (_context58.prev = _context58.next) {
            case 0:
              if (this.isConnected) {
                _context58.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context58.prev = 2;
              _n13 = "hf" === o.toLowerCase() ? 2 : 1;
              _s7 = r ? 1 : 0;
              _context58.next = 7;
              return this.sendCommand(t.ChameleonCommand.SET_SLOT_ENABLE, [e, _n13, _s7]);
            case 7:
              _a4 = _context58.sent;
              if (_a4.success) {
                _context58.next = 10;
                break;
              }
              throw new Error("\u542F\u7528/\u7981\u7528\u5361\u69FD\u9891\u7387\u5931\u8D25: ".concat(_a4.error));
            case 10:
              return _context58.abrupt("return", (console.log("[BluetoothService] \u6210\u529F\u8BBE\u7F6E\u5361\u69FD".concat(e, "\u7684").concat(o, "\u9891\u7387\u542F\u7528\u72B6\u6001: ").concat(r)), _a4));
            case 13:
              _context58.prev = 13;
              _context58.t0 = _context58["catch"](2);
              throw console.error("[BluetoothService] \u542F\u7528/\u7981\u7528\u5361\u69FD".concat(e, "\u7684").concat(o, "\u9891\u7387\u5931\u8D25:"), _context58.t0), _context58.t0;
            case 16:
            case "end":
              return _context58.stop();
          }
        }, _callee58, this, [[2, 13]]);
      }));
      function enableSlotFrequency(_x42, _x43, _x44) {
        return _enableSlotFrequency.apply(this, arguments);
      }
      return enableSlotFrequency;
    }()
  }, {
    key: "getMifareGen1aMode",
    value: function () {
      var _getMifareGen1aMode = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee59() {
        var _e22, _t18;
        return _regeneratorRuntime2().wrap(function _callee59$(_context59) {
          while (1) switch (_context59.prev = _context59.next) {
            case 0:
              if (this.isConnected) {
                _context59.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context59.prev = 2;
              _e22 = {
                cmd: "GET_MF1_GEN1A_MODE"
              };
              _context59.next = 6;
              return this.sendCommand(_e22);
            case 6:
              _t18 = _context59.sent;
              if (!("success" !== _t18.status)) {
                _context59.next = 9;
                break;
              }
              throw new Error("\u83B7\u53D6GEN1A\u6A21\u5F0F\u5931\u8D25: ".concat(_t18.error));
            case 9:
              return _context59.abrupt("return", _t18.data.enabled || !1);
            case 12:
              _context59.prev = 12;
              _context59.t0 = _context59["catch"](2);
              throw console.error("[BluetoothService] 获取GEN1A模式失败:", _context59.t0), _context59.t0;
            case 15:
            case "end":
              return _context59.stop();
          }
        }, _callee59, this, [[2, 12]]);
      }));
      function getMifareGen1aMode() {
        return _getMifareGen1aMode.apply(this, arguments);
      }
      return getMifareGen1aMode;
    }()
  }, {
    key: "setMifareGen1aMode",
    value: function () {
      var _setMifareGen1aMode = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee60(e) {
        var _t19, o;
        return _regeneratorRuntime2().wrap(function _callee60$(_context60) {
          while (1) switch (_context60.prev = _context60.next) {
            case 0:
              if (this.isConnected) {
                _context60.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context60.prev = 2;
              _t19 = {
                cmd: "SET_MF1_GEN1A_MODE",
                data: {
                  enabled: e
                }
              };
              _context60.next = 6;
              return this.sendCommand(_t19);
            case 6:
              o = _context60.sent;
              if (!("success" !== o.status)) {
                _context60.next = 9;
                break;
              }
              throw new Error("\u8BBE\u7F6EGEN1A\u6A21\u5F0F\u5931\u8D25: ".concat(o.error));
            case 9:
              return _context60.abrupt("return", o.data);
            case 12:
              _context60.prev = 12;
              _context60.t0 = _context60["catch"](2);
              throw console.error("[BluetoothService] 设置GEN1A模式失败:", _context60.t0), _context60.t0;
            case 15:
            case "end":
              return _context60.stop();
          }
        }, _callee60, this, [[2, 12]]);
      }));
      function setMifareGen1aMode(_x45) {
        return _setMifareGen1aMode.apply(this, arguments);
      }
      return setMifareGen1aMode;
    }()
  }, {
    key: "getMifareGen2Mode",
    value: function () {
      var _getMifareGen2Mode = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee61() {
        var _e23, _t20;
        return _regeneratorRuntime2().wrap(function _callee61$(_context61) {
          while (1) switch (_context61.prev = _context61.next) {
            case 0:
              if (this.isConnected) {
                _context61.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context61.prev = 2;
              _e23 = {
                cmd: "GET_MF1_GEN2_MODE"
              };
              _context61.next = 6;
              return this.sendCommand(_e23);
            case 6:
              _t20 = _context61.sent;
              if (!("success" !== _t20.status)) {
                _context61.next = 9;
                break;
              }
              throw new Error("\u83B7\u53D6GEN2\u6A21\u5F0F\u5931\u8D25: ".concat(_t20.error));
            case 9:
              return _context61.abrupt("return", _t20.data.enabled || !1);
            case 12:
              _context61.prev = 12;
              _context61.t0 = _context61["catch"](2);
              throw console.error("[BluetoothService] 获取GEN2模式失败:", _context61.t0), _context61.t0;
            case 15:
            case "end":
              return _context61.stop();
          }
        }, _callee61, this, [[2, 12]]);
      }));
      function getMifareGen2Mode() {
        return _getMifareGen2Mode.apply(this, arguments);
      }
      return getMifareGen2Mode;
    }()
  }, {
    key: "setMifareGen2Mode",
    value: function () {
      var _setMifareGen2Mode = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee62(e) {
        var _t21, o;
        return _regeneratorRuntime2().wrap(function _callee62$(_context62) {
          while (1) switch (_context62.prev = _context62.next) {
            case 0:
              if (this.isConnected) {
                _context62.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context62.prev = 2;
              _t21 = {
                cmd: "SET_MF1_GEN2_MODE",
                data: {
                  enabled: e
                }
              };
              _context62.next = 6;
              return this.sendCommand(_t21);
            case 6:
              o = _context62.sent;
              if (!("success" !== o.status)) {
                _context62.next = 9;
                break;
              }
              throw new Error("\u8BBE\u7F6EGEN2\u6A21\u5F0F\u5931\u8D25: ".concat(o.error));
            case 9:
              return _context62.abrupt("return", o.data);
            case 12:
              _context62.prev = 12;
              _context62.t0 = _context62["catch"](2);
              throw console.error("[BluetoothService] 设置GEN2模式失败:", _context62.t0), _context62.t0;
            case 15:
            case "end":
              return _context62.stop();
          }
        }, _callee62, this, [[2, 12]]);
      }));
      function setMifareGen2Mode(_x46) {
        return _setMifareGen2Mode.apply(this, arguments);
      }
      return setMifareGen2Mode;
    }()
  }, {
    key: "getMifareEmulatorSettings",
    value: function () {
      var _getMifareEmulatorSettings = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee63() {
        var _e24, o, _r16, _n14;
        return _regeneratorRuntime2().wrap(function _callee63$(_context63) {
          while (1) switch (_context63.prev = _context63.next) {
            case 0:
              if (this.isConnected) {
                _context63.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context63.prev = 2;
              console.log("[BluetoothService] 获取Mifare模拟器设置...");
              _context63.next = 6;
              return this.sendCommand(t.ChameleonCommand.MF1_GET_EMULATOR_CONFIG, []);
            case 6:
              _e24 = _context63.sent;
              if (_e24.success) {
                _context63.next = 9;
                break;
              }
              throw new Error("\u83B7\u53D6\u6A21\u62DF\u5668\u8BBE\u7F6E\u5931\u8D25: ".concat(_e24.error));
            case 9:
              o = _e24.data || [];
              if (!(o.length < 5)) {
                _context63.next = 12;
                break;
              }
              throw new Error("模拟器设置数据格式错误");
            case 12:
              _r16 = "normal";
              _context63.t0 = o[4];
              _context63.next = _context63.t0 === 1 ? 16 : _context63.t0 === 2 ? 18 : _context63.t0 === 3 ? 20 : _context63.t0 === 4 ? 20 : 22;
              break;
            case 16:
              _r16 = "denied";
              return _context63.abrupt("break", 23);
            case 18:
              _r16 = "deceive";
              return _context63.abrupt("break", 23);
            case 20:
              _r16 = "shadow";
              return _context63.abrupt("break", 23);
            case 22:
              _r16 = "normal";
            case 23:
              _n14 = {
                gen1aEnabled: 1 === o[1],
                gen2Enabled: 1 === o[2],
                antiCollEnabled: 1 === o[3],
                detectionEnabled: 1 === o[0],
                writeMode: _r16
              };
              return _context63.abrupt("return", (console.log("[BluetoothService] 获取到模拟器设置:", _n14), _n14));
            case 27:
              _context63.prev = 27;
              _context63.t1 = _context63["catch"](2);
              throw console.error("[BluetoothService] 获取模拟器设置失败:", _context63.t1), _context63.t1;
            case 30:
            case "end":
              return _context63.stop();
          }
        }, _callee63, this, [[2, 27]]);
      }));
      function getMifareEmulatorSettings() {
        return _getMifareEmulatorSettings.apply(this, arguments);
      }
      return getMifareEmulatorSettings;
    }()
  }, {
    key: "setMifareWriteMode",
    value: function () {
      var _setMifareWriteMode = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee64(e) {
        var _t22, o;
        return _regeneratorRuntime2().wrap(function _callee64$(_context64) {
          while (1) switch (_context64.prev = _context64.next) {
            case 0:
              if (this.isConnected) {
                _context64.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context64.prev = 2;
              _t22 = {
                cmd: "SET_MF1_WRITE_MODE",
                data: {
                  mode: e
                }
              };
              _context64.next = 6;
              return this.sendCommand(_t22);
            case 6:
              o = _context64.sent;
              if (!("success" !== o.status)) {
                _context64.next = 9;
                break;
              }
              throw new Error("\u8BBE\u7F6E\u5199\u5165\u6A21\u5F0F\u5931\u8D25: ".concat(o.error));
            case 9:
              return _context64.abrupt("return", o.data);
            case 12:
              _context64.prev = 12;
              _context64.t0 = _context64["catch"](2);
              throw console.error("[BluetoothService] 设置写入模式失败:", _context64.t0), _context64.t0;
            case 15:
            case "end":
              return _context64.stop();
          }
        }, _callee64, this, [[2, 12]]);
      }));
      function setMifareWriteMode(_x47) {
        return _setMifareWriteMode.apply(this, arguments);
      }
      return setMifareWriteMode;
    }()
  }, {
    key: "getMf1AntiCollData",
    value: function () {
      var _getMf1AntiCollData = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee65(e) {
        var o, _r17, _n15, _s8;
        return _regeneratorRuntime2().wrap(function _callee65$(_context65) {
          while (1) switch (_context65.prev = _context65.next) {
            case 0:
              if (this.isConnected) {
                _context65.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context65.prev = 2;
              _context65.next = 5;
              return this.setActiveSlot(e);
            case 5:
              _context65.next = 7;
              return this.sendCommand(t.ChameleonCommand.MF1_GET_ANTI_COLL_DATA, []);
            case 7:
              o = _context65.sent;
              if (o.success) {
                _context65.next = 10;
                break;
              }
              throw new Error("\u83B7\u53D6HF\u5361\u7247\u6570\u636E\u5931\u8D25: ".concat(o.error));
            case 10:
              _r17 = o.data || [];
              if (!(Array.isArray(_r17) && 0 === _r17.length && o.data.data && (_r17 = o.data.data || []), console.log("[BluetoothService] 获取到HF卡片原始数据:", _r17), console.log("[BluetoothService] 完整响应结构:", o), _r17.length < 5)) {
                _context65.next = 13;
                break;
              }
              throw console.error("[BluetoothService] HF\u6570\u636E\u957F\u5EA6\u4E0D\u8DB3: ".concat(_r17.length, ", \u9700\u8981\u81F3\u5C115\u5B57\u8282")), new Error("HF卡片数据格式错误");
            case 13:
              _n15 = _r17[0];
              if (!(_r17.length < _n15 + 5)) {
                _context65.next = 16;
                break;
              }
              throw new Error("HF卡片数据长度不足");
            case 16:
              _s8 = _r17[_n15 + 4];
              return _context65.abrupt("return", {
                uid: this.arrayToHexString(_r17.slice(1, _n15 + 1)),
                atqa: this.arrayToHexString(_r17.slice(_n15 + 1, _n15 + 3).reverse()),
                sak: _r17[_n15 + 3],
                ats: this.arrayToHexString(_r17.slice(_n15 + 5, _n15 + 5 + _s8))
              });
            case 20:
              _context65.prev = 20;
              _context65.t0 = _context65["catch"](2);
              throw console.error("[BluetoothService] 获取HF卡片数据失败:", _context65.t0), _context65.t0;
            case 23:
            case "end":
              return _context65.stop();
          }
        }, _callee65, this, [[2, 20]]);
      }));
      function getMf1AntiCollData(_x48) {
        return _getMf1AntiCollData.apply(this, arguments);
      }
      return getMf1AntiCollData;
    }()
  }, {
    key: "getEM410XEmulatorID",
    value: function () {
      var _getEM410XEmulatorID = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee66(e) {
        var o, _r18;
        return _regeneratorRuntime2().wrap(function _callee66$(_context66) {
          while (1) switch (_context66.prev = _context66.next) {
            case 0:
              if (this.isConnected) {
                _context66.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context66.prev = 2;
              _context66.next = 5;
              return this.setActiveSlot(e);
            case 5:
              _context66.next = 7;
              return this.sendCommand(t.ChameleonCommand.GET_EM410X_EMULATOR_ID, []);
            case 7:
              o = _context66.sent;
              if (o.success) {
                _context66.next = 10;
                break;
              }
              throw new Error("\u83B7\u53D6LF\u5361\u7247ID\u5931\u8D25: ".concat(o.error));
            case 10:
              _r18 = o.data || [];
              return _context66.abrupt("return", (Array.isArray(_r18) && 0 === _r18.length && o.data.data && (_r18 = o.data.data || []), console.log("[BluetoothService] 获取到LF卡片原始数据:", _r18), console.log("[BluetoothService] 完整响应结构:", o), this.arrayToHexString(_r18)));
            case 14:
              _context66.prev = 14;
              _context66.t0 = _context66["catch"](2);
              throw console.error("[BluetoothService] 获取LF卡片ID失败:", _context66.t0), _context66.t0;
            case 17:
            case "end":
              return _context66.stop();
          }
        }, _callee66, this, [[2, 14]]);
      }));
      function getEM410XEmulatorID(_x49) {
        return _getEM410XEmulatorID.apply(this, arguments);
      }
      return getEM410XEmulatorID;
    }()
  }, {
    key: "getMf1EmulatorSettings",
    value: function () {
      var _getMf1EmulatorSettings = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee67(e) {
        var o, _r19, _n16, _s9;
        return _regeneratorRuntime2().wrap(function _callee67$(_context67) {
          while (1) switch (_context67.prev = _context67.next) {
            case 0:
              if (this.isConnected) {
                _context67.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context67.prev = 2;
              _context67.next = 5;
              return this.setActiveSlot(e);
            case 5:
              _context67.next = 7;
              return this.sendCommand(t.ChameleonCommand.MF1_GET_EMULATOR_CONFIG, []);
            case 7:
              o = _context67.sent;
              if (o.success) {
                _context67.next = 10;
                break;
              }
              throw new Error("\u83B7\u53D6\u6A21\u62DF\u5668\u8BBE\u7F6E\u5931\u8D25: ".concat(o.error));
            case 10:
              _r19 = o.data || [];
              if (!(Array.isArray(_r19) && 0 === _r19.length && o.data.data && (_r19 = o.data.data || []), console.log("[BluetoothService] 获取到模拟器设置原始数据:", _r19), console.log("[BluetoothService] 完整响应结构:", o), _r19.length < 5)) {
                _context67.next = 13;
                break;
              }
              throw console.error("[BluetoothService] \u6570\u636E\u957F\u5EA6\u4E0D\u8DB3: ".concat(_r19.length, ", \u9700\u8981\u81F3\u5C115\u5B57\u8282")), new Error("\u6A21\u62DF\u5668\u8BBE\u7F6E\u6570\u636E\u957F\u5EA6\u4E0D\u8DB3: ".concat(_r19.length));
            case 13:
              _n16 = "normal";
              1 === _r19[4] ? _n16 = "denied" : 2 === _r19[4] ? _n16 = "deceive" : 3 !== _r19[4] && 4 !== _r19[4] || (_n16 = "shadow");
              _s9 = {
                isDetectionEnabled: 1 === _r19[0],
                isGen1a: 1 === _r19[1],
                isGen2: 1 === _r19[2],
                isAntiColl: 1 === _r19[3],
                writeMode: _n16
              };
              return _context67.abrupt("return", (console.log("[BluetoothService] 解析后的模拟器设置:", _s9), _s9));
            case 19:
              _context67.prev = 19;
              _context67.t0 = _context67["catch"](2);
              throw console.error("[BluetoothService] 获取模拟器设置失败:", _context67.t0), _context67.t0;
            case 22:
            case "end":
              return _context67.stop();
          }
        }, _callee67, this, [[2, 19]]);
      }));
      function getMf1EmulatorSettings(_x50) {
        return _getMf1EmulatorSettings.apply(this, arguments);
      }
      return getMf1EmulatorSettings;
    }()
  }, {
    key: "setMf1Gen1aMode",
    value: function () {
      var _setMf1Gen1aMode = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee68(e, o) {
        var _r20;
        return _regeneratorRuntime2().wrap(function _callee68$(_context68) {
          while (1) switch (_context68.prev = _context68.next) {
            case 0:
              if (this.isConnected) {
                _context68.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context68.prev = 2;
              _context68.next = 5;
              return this.setActiveSlot(e);
            case 5:
              _context68.next = 7;
              return this.sendCommand(t.ChameleonCommand.MF1_SET_GEN1A_MODE, [o ? 1 : 0]);
            case 7:
              _r20 = _context68.sent;
              if (_r20.success) {
                _context68.next = 10;
                break;
              }
              throw new Error("\u8BBE\u7F6EGen1A\u6A21\u5F0F\u5931\u8D25: ".concat(_r20.error));
            case 10:
              return _context68.abrupt("return", _r20);
            case 13:
              _context68.prev = 13;
              _context68.t0 = _context68["catch"](2);
              throw console.error("[BluetoothService] 设置Gen1A模式失败:", _context68.t0), _context68.t0;
            case 16:
            case "end":
              return _context68.stop();
          }
        }, _callee68, this, [[2, 13]]);
      }));
      function setMf1Gen1aMode(_x51, _x52) {
        return _setMf1Gen1aMode.apply(this, arguments);
      }
      return setMf1Gen1aMode;
    }()
  }, {
    key: "setMf1Gen2Mode",
    value: function () {
      var _setMf1Gen2Mode = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee69(e, o) {
        var _r21;
        return _regeneratorRuntime2().wrap(function _callee69$(_context69) {
          while (1) switch (_context69.prev = _context69.next) {
            case 0:
              if (this.isConnected) {
                _context69.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context69.prev = 2;
              _context69.next = 5;
              return this.setActiveSlot(e);
            case 5:
              _context69.next = 7;
              return this.sendCommand(t.ChameleonCommand.MF1_SET_GEN2_MODE, [o ? 1 : 0]);
            case 7:
              _r21 = _context69.sent;
              if (_r21.success) {
                _context69.next = 10;
                break;
              }
              throw new Error("\u8BBE\u7F6EGen2\u6A21\u5F0F\u5931\u8D25: ".concat(_r21.error));
            case 10:
              return _context69.abrupt("return", _r21);
            case 13:
              _context69.prev = 13;
              _context69.t0 = _context69["catch"](2);
              throw console.error("[BluetoothService] 设置Gen2模式失败:", _context69.t0), _context69.t0;
            case 16:
            case "end":
              return _context69.stop();
          }
        }, _callee69, this, [[2, 13]]);
      }));
      function setMf1Gen2Mode(_x53, _x54) {
        return _setMf1Gen2Mode.apply(this, arguments);
      }
      return setMf1Gen2Mode;
    }()
  }, {
    key: "setMf1WriteMode",
    value: function () {
      var _setMf1WriteMode = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee70(e, o) {
        var _r22, _n17;
        return _regeneratorRuntime2().wrap(function _callee70$(_context70) {
          while (1) switch (_context70.prev = _context70.next) {
            case 0:
              if (this.isConnected) {
                _context70.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context70.prev = 2;
              _context70.next = 5;
              return this.setActiveSlot(e);
            case 5:
              _r22 = 0;
              _context70.t0 = o;
              _context70.next = _context70.t0 === "normal" ? 9 : _context70.t0 === "denied" ? 11 : _context70.t0 === "deceive" ? 13 : _context70.t0 === "shadow" ? 15 : 17;
              break;
            case 9:
              _r22 = 0;
              return _context70.abrupt("break", 18);
            case 11:
              _r22 = 1;
              return _context70.abrupt("break", 18);
            case 13:
              _r22 = 2;
              return _context70.abrupt("break", 18);
            case 15:
              _r22 = 3;
              return _context70.abrupt("break", 18);
            case 17:
              throw new Error("\u65E0\u6548\u7684\u5199\u5165\u6A21\u5F0F: ".concat(o));
            case 18:
              _context70.next = 20;
              return this.sendCommand(t.ChameleonCommand.MF1_SET_WRITE_MODE, [_r22]);
            case 20:
              _n17 = _context70.sent;
              if (_n17.success) {
                _context70.next = 23;
                break;
              }
              throw new Error("\u8BBE\u7F6E\u5199\u5165\u6A21\u5F0F\u5931\u8D25: ".concat(_n17.error));
            case 23:
              return _context70.abrupt("return", (console.log("[BluetoothService] \u6210\u529F\u8BBE\u7F6E\u5361\u69FD".concat(e, "\u7684\u5199\u5165\u6A21\u5F0F\u4E3A: ").concat(o)), _n17));
            case 26:
              _context70.prev = 26;
              _context70.t1 = _context70["catch"](2);
              throw console.error("[BluetoothService] 设置写入模式失败:", _context70.t1), _context70.t1;
            case 29:
            case "end":
              return _context70.stop();
          }
        }, _callee70, this, [[2, 26]]);
      }));
      function setMf1WriteMode(_x55, _x56) {
        return _setMf1WriteMode.apply(this, arguments);
      }
      return setMf1WriteMode;
    }()
  }, {
    key: "setMf1DetectionMode",
    value: function () {
      var _setMf1DetectionMode = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee71(e, o) {
        var _r23;
        return _regeneratorRuntime2().wrap(function _callee71$(_context71) {
          while (1) switch (_context71.prev = _context71.next) {
            case 0:
              if (this.isConnected) {
                _context71.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context71.prev = 2;
              _context71.next = 5;
              return this.setActiveSlot(e);
            case 5:
              _context71.next = 7;
              return this.sendCommand(t.ChameleonCommand.MF1_SET_DETECTION_ENABLE, [o ? 1 : 0]);
            case 7:
              _r23 = _context71.sent;
              if (_r23.success) {
                _context71.next = 10;
                break;
              }
              throw new Error("\u8BBE\u7F6E\u68C0\u6D4B\u6A21\u5F0F\u5931\u8D25: ".concat(_r23.error));
            case 10:
              return _context71.abrupt("return", (console.log("[BluetoothService] \u6210\u529F\u8BBE\u7F6E\u5361\u69FD".concat(e, "\u7684\u68C0\u6D4B\u6A21\u5F0F\u4E3A: ").concat(o ? "启用" : "禁用")), _r23));
            case 13:
              _context71.prev = 13;
              _context71.t0 = _context71["catch"](2);
              throw console.error("[BluetoothService] 设置检测模式失败:", _context71.t0), _context71.t0;
            case 16:
            case "end":
              return _context71.stop();
          }
        }, _callee71, this, [[2, 13]]);
      }));
      function setMf1DetectionMode(_x57, _x58) {
        return _setMf1DetectionMode.apply(this, arguments);
      }
      return setMf1DetectionMode;
    }()
  }, {
    key: "setMf1UseFirstBlockColl",
    value: function () {
      var _setMf1UseFirstBlockColl = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee72(e, o) {
        var _r24;
        return _regeneratorRuntime2().wrap(function _callee72$(_context72) {
          while (1) switch (_context72.prev = _context72.next) {
            case 0:
              if (this.isConnected) {
                _context72.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context72.prev = 2;
              _context72.next = 5;
              return this.setActiveSlot(e);
            case 5:
              _context72.next = 7;
              return this.sendCommand(t.ChameleonCommand.MF1_SET_FIRST_BLOCK_COLL, [o ? 1 : 0]);
            case 7:
              _r24 = _context72.sent;
              if (_r24.success) {
                _context72.next = 10;
                break;
              }
              throw new Error("\u8BBE\u7F6EBlock 0\u9632\u78B0\u649E\u6A21\u5F0F\u5931\u8D25: ".concat(_r24.error));
            case 10:
              return _context72.abrupt("return", (console.log("[BluetoothService] \u6210\u529F\u8BBE\u7F6E\u5361\u69FD".concat(e, "\u7684Block 0\u9632\u78B0\u649E\u6A21\u5F0F\u4E3A: ").concat(o ? "启用" : "禁用")), _r24));
            case 13:
              _context72.prev = 13;
              _context72.t0 = _context72["catch"](2);
              throw console.error("[BluetoothService] 设置Block 0防碰撞模式失败:", _context72.t0), _context72.t0;
            case 16:
            case "end":
              return _context72.stop();
          }
        }, _callee72, this, [[2, 13]]);
      }));
      function setMf1UseFirstBlockColl(_x59, _x60) {
        return _setMf1UseFirstBlockColl.apply(this, arguments);
      }
      return setMf1UseFirstBlockColl;
    }()
  }, {
    key: "setMf1AntiCollision",
    value: function () {
      var _setMf1AntiCollision = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee73(e, o) {
        var _r25, _n18, _s10, _a5, i, c;
        return _regeneratorRuntime2().wrap(function _callee73$(_context73) {
          while (1) switch (_context73.prev = _context73.next) {
            case 0:
              if (this.isConnected) {
                _context73.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context73.prev = 2;
              _context73.next = 5;
              return this.setActiveSlot(e);
            case 5:
              _r25 = this.hexStringToArray(o.uid || ""), _n18 = this.hexStringToArray(o.atqa || ""), _s10 = this.hexStringToArray(o.ats || ""), _a5 = "number" == typeof o.sak ? o.sak : parseInt(o.sak) || 0, i = [];
              i.push(_r25.length), i.push.apply(i, _toConsumableArray2(_r25)), i.push.apply(i, _toConsumableArray2(_toConsumableArray2(_n18).reverse())), i.push(_a5), i.push(_s10.length), i.push.apply(i, _toConsumableArray2(_s10));
              _context73.next = 9;
              return this.sendCommand(t.ChameleonCommand.MF1_SET_ANTI_COLLISION, i);
            case 9:
              c = _context73.sent;
              if (c.success) {
                _context73.next = 12;
                break;
              }
              throw new Error("\u8BBE\u7F6E\u9632\u78B0\u649E\u6570\u636E\u5931\u8D25: ".concat(c.error));
            case 12:
              return _context73.abrupt("return", (console.log("[BluetoothService] \u6210\u529F\u8BBE\u7F6E\u5361\u69FD".concat(e, "\u7684\u9632\u78B0\u649E\u6570\u636E")), c));
            case 15:
              _context73.prev = 15;
              _context73.t0 = _context73["catch"](2);
              throw console.error("[BluetoothService] 设置防碰撞数据失败:", _context73.t0), _context73.t0;
            case 18:
            case "end":
              return _context73.stop();
          }
        }, _callee73, this, [[2, 15]]);
      }));
      function setMf1AntiCollision(_x61, _x62) {
        return _setMf1AntiCollision.apply(this, arguments);
      }
      return setMf1AntiCollision;
    }()
  }, {
    key: "setMf1BlockData",
    value: function () {
      var _setMf1BlockData = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee74(e, o) {
        var _r26, _n19, _s11, _a6;
        return _regeneratorRuntime2().wrap(function _callee74$(_context74) {
          while (1) switch (_context74.prev = _context74.next) {
            case 0:
              if (this.isConnected) {
                _context74.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context74.prev = 2;
              _r26 = Array.isArray(o) ? o : Array.from(o);
              _n19 = [255 & e].concat(_toConsumableArray2(_r26));
              _context74.next = 7;
              return this.sendCommand(t.ChameleonCommand.MF1_LOAD_BLOCK_DATA, _n19);
            case 7:
              _s11 = _context74.sent;
              if (_s11.success) {
                _context74.next = 10;
                break;
              }
              throw new Error("\u8BBE\u7F6E\u5757\u6570\u636E\u5931\u8D25: ".concat(_s11.error));
            case 10:
              _a6 = Math.floor(_r26.length / 16);
              return _context74.abrupt("return", (console.log("[BluetoothService] \u6210\u529F\u8BBE\u7F6E".concat(_a6, "\u4E2A\u5757\u6570\u636E\uFF0C\u8D77\u59CB\u5757: ").concat(e)), _s11));
            case 14:
              _context74.prev = 14;
              _context74.t0 = _context74["catch"](2);
              throw console.error("[BluetoothService] 设置块数据失败:", _context74.t0), _context74.t0;
            case 17:
            case "end":
              return _context74.stop();
          }
        }, _callee74, this, [[2, 14]]);
      }));
      function setMf1BlockData(_x63, _x64) {
        return _setMf1BlockData.apply(this, arguments);
      }
      return setMf1BlockData;
    }()
  }, {
    key: "hexStringToArray",
    value: function hexStringToArray(e) {
      if (!e) return [];
      var t = e.replace(/\s/g, "").toUpperCase(),
        o = [];
      for (var _r27 = 0; _r27 < t.length; _r27 += 2) {
        var _e25 = parseInt(t.substring(_r27, _r27 + 2), 16);
        isNaN(_e25) || o.push(_e25);
      }
      return o;
    }
  }, {
    key: "setEM410XEmulatorID",
    value: function () {
      var _setEM410XEmulatorID = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee75(e, o) {
        var _r28, _n20;
        return _regeneratorRuntime2().wrap(function _callee75$(_context75) {
          while (1) switch (_context75.prev = _context75.next) {
            case 0:
              if (this.isConnected) {
                _context75.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context75.prev = 2;
              _context75.next = 5;
              return this.setActiveSlot(e);
            case 5:
              _r28 = this.stringToArrayBuffer(o.replace(/\s/g, ""));
              _context75.next = 8;
              return this.sendCommand(t.ChameleonCommand.SET_EM410X_EMULATOR_ID, Array.from(new Uint8Array(_r28)));
            case 8:
              _n20 = _context75.sent;
              if (_n20.success) {
                _context75.next = 11;
                break;
              }
              throw new Error("\u8BBE\u7F6EEM410X ID\u5931\u8D25: ".concat(_n20.error));
            case 11:
              return _context75.abrupt("return", (console.log("[BluetoothService] \u6210\u529F\u8BBE\u7F6E\u5361\u69FD".concat(e, "\u7684EM410X ID\u4E3A: ").concat(o)), _n20));
            case 14:
              _context75.prev = 14;
              _context75.t0 = _context75["catch"](2);
              throw console.error("[BluetoothService] 设置EM410X ID失败:", _context75.t0), _context75.t0;
            case 17:
            case "end":
              return _context75.stop();
          }
        }, _callee75, this, [[2, 14]]);
      }));
      function setEM410XEmulatorID(_x65, _x66) {
        return _setEM410XEmulatorID.apply(this, arguments);
      }
      return setEM410XEmulatorID;
    }()
  }, {
    key: "getLfEmulatorSettings",
    value: function () {
      var _getLfEmulatorSettings = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee76(e) {
        return _regeneratorRuntime2().wrap(function _callee76$(_context76) {
          while (1) switch (_context76.prev = _context76.next) {
            case 0:
              if (this.isConnected) {
                _context76.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context76.prev = 2;
              _context76.next = 5;
              return this.setActiveSlot(e);
            case 5:
              _context76.next = 7;
              return this.getEM410XEmulatorID(e);
            case 7:
              _context76.t0 = _context76.sent;
              return _context76.abrupt("return", {
                uid: _context76.t0,
                type: "EM410X"
              });
            case 11:
              _context76.prev = 11;
              _context76.t1 = _context76["catch"](2);
              throw console.error("[BluetoothService] 获取LF模拟器设置失败:", _context76.t1), _context76.t1;
            case 14:
            case "end":
              return _context76.stop();
          }
        }, _callee76, this, [[2, 11]]);
      }));
      function getLfEmulatorSettings(_x67) {
        return _getLfEmulatorSettings.apply(this, arguments);
      }
      return getLfEmulatorSettings;
    }()
  }, {
    key: "getLicenseKey",
    value: function () {
      var _getLicenseKey = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee77() {
        var _e26, o;
        return _regeneratorRuntime2().wrap(function _callee77$(_context77) {
          while (1) switch (_context77.prev = _context77.next) {
            case 0:
              if (this.isConnected) {
                _context77.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context77.prev = 2;
              _context77.next = 5;
              return this.sendCommand(t.ChameleonCommand.GET_LICENSE_KEY);
            case 5:
              _e26 = _context77.sent;
              if (_e26.success) {
                _context77.next = 8;
                break;
              }
              throw new Error("\u83B7\u53D6\u6FC0\u6D3B\u7801\u5931\u8D25: ".concat(_e26.error));
            case 8:
              o = this.arrayBufferToString(_e26.data);
              return _context77.abrupt("return", (console.log("[BluetoothService] \u83B7\u53D6\u6FC0\u6D3B\u7801: ".concat(o)), o));
            case 12:
              _context77.prev = 12;
              _context77.t0 = _context77["catch"](2);
              throw console.error("[BluetoothService] 获取激活码失败:", _context77.t0), _context77.t0;
            case 15:
            case "end":
              return _context77.stop();
          }
        }, _callee77, this, [[2, 12]]);
      }));
      function getLicenseKey() {
        return _getLicenseKey.apply(this, arguments);
      }
      return getLicenseKey;
    }()
  }, {
    key: "setLicenseKey",
    value: function () {
      var _setLicenseKey = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee78(e) {
        var o, _r29;
        return _regeneratorRuntime2().wrap(function _callee78$(_context78) {
          while (1) switch (_context78.prev = _context78.next) {
            case 0:
              if (this.isConnected) {
                _context78.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context78.prev = 2;
              o = this.stringToArrayBuffer(e);
              _context78.next = 6;
              return this.sendCommand(t.ChameleonCommand.SET_LICENSE_KEY, Array.from(new Uint8Array(o)));
            case 6:
              _r29 = _context78.sent;
              if (_r29.success) {
                _context78.next = 9;
                break;
              }
              throw new Error("\u8BBE\u7F6E\u6FC0\u6D3B\u7801\u5931\u8D25: ".concat(_r29.error));
            case 9:
              return _context78.abrupt("return", (console.log("[BluetoothService] \u8BBE\u7F6E\u6FC0\u6D3B\u7801\u6210\u529F: ".concat(e)), _r29));
            case 12:
              _context78.prev = 12;
              _context78.t0 = _context78["catch"](2);
              throw console.error("[BluetoothService] 设置激活码失败:", _context78.t0), _context78.t0;
            case 15:
            case "end":
              return _context78.stop();
          }
        }, _callee78, this, [[2, 12]]);
      }));
      function setLicenseKey(_x68) {
        return _setLicenseKey.apply(this, arguments);
      }
      return setLicenseKey;
    }()
  }, {
    key: "setSecretKey",
    value: function () {
      var _setSecretKey = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee79(e) {
        var o, _r30;
        return _regeneratorRuntime2().wrap(function _callee79$(_context79) {
          while (1) switch (_context79.prev = _context79.next) {
            case 0:
              if (this.isConnected) {
                _context79.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context79.prev = 2;
              o = this.stringToArrayBuffer(e);
              _context79.next = 6;
              return this.sendCommand(t.ChameleonCommand.SET_SECRET_KEY, Array.from(new Uint8Array(o)));
            case 6:
              _r30 = _context79.sent;
              if (_r30.success) {
                _context79.next = 9;
                break;
              }
              throw new Error("\u8BBE\u7F6E\u5BC6\u94A5\u5931\u8D25: ".concat(_r30.error));
            case 9:
              return _context79.abrupt("return", (console.log("[BluetoothService] 设置密钥成功"), _r30));
            case 12:
              _context79.prev = 12;
              _context79.t0 = _context79["catch"](2);
              throw console.error("[BluetoothService] 设置密钥失败:", _context79.t0), _context79.t0;
            case 15:
            case "end":
              return _context79.stop();
          }
        }, _callee79, this, [[2, 12]]);
      }));
      function setSecretKey(_x69) {
        return _setSecretKey.apply(this, arguments);
      }
      return setSecretKey;
    }()
  }, {
    key: "getTrialCount",
    value: function () {
      var _getTrialCount = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee80() {
        var _e27, o, _r31;
        return _regeneratorRuntime2().wrap(function _callee80$(_context80) {
          while (1) switch (_context80.prev = _context80.next) {
            case 0:
              if (this.isConnected) {
                _context80.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context80.prev = 2;
              _context80.next = 5;
              return this.sendCommand(t.ChameleonCommand.GET_TRIAL_LEFT_TIMES);
            case 5:
              _e27 = _context80.sent;
              if (_e27.success) {
                _context80.next = 8;
                break;
              }
              throw new Error("\u83B7\u53D6\u8BD5\u7528\u6B21\u6570\u5931\u8D25: ".concat(_e27.error));
            case 8:
              if (!(_e27.data.length < 4)) {
                _context80.next = 10;
                break;
              }
              throw new Error("无效的试用次数数据");
            case 10:
              o = this.bytesToU16(_e27.data.slice(0, 2)), _r31 = this.bytesToU16(_e27.data.slice(2, 4));
              return _context80.abrupt("return", (console.log("[BluetoothService] \u83B7\u53D6\u8BD5\u7528\u6B21\u6570: \u5DF2\u4F7F\u7528".concat(o, "\u6B21\uFF0C\u5269\u4F59").concat(_r31, "\u6B21")), {
                usedCount: o,
                remainingCount: _r31
              }));
            case 14:
              _context80.prev = 14;
              _context80.t0 = _context80["catch"](2);
              throw console.error("[BluetoothService] 获取试用次数失败:", _context80.t0), _context80.t0;
            case 17:
            case "end":
              return _context80.stop();
          }
        }, _callee80, this, [[2, 14]]);
      }));
      function getTrialCount() {
        return _getTrialCount.apply(this, arguments);
      }
      return getTrialCount;
    }()
  }, {
    key: "verifyActivationCode",
    value: function () {
      var _verifyActivationCode = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee81(e, t) {
        var r,
          _n21,
          _args81 = arguments;
        return _regeneratorRuntime2().wrap(function _callee81$(_context81) {
          while (1) switch (_context81.prev = _context81.next) {
            case 0:
              r = _args81.length > 2 && _args81[2] !== undefined ? _args81[2] : "";
              _context81.prev = 1;
              _context81.next = 4;
              return o.http.post("/device/register", {
                activation_code: e,
                chip_id: t,
                firmware_version: r
              });
            case 4:
              _n21 = _context81.sent;
              return _context81.abrupt("return", {
                success: 200 === _n21.code,
                message: _n21.message || "未知错误",
                secret_key: _n21.secret_key || ""
              });
            case 8:
              _context81.prev = 8;
              _context81.t0 = _context81["catch"](1);
              return _context81.abrupt("return", (console.error("[BluetoothService] 验证激活码失败:", _context81.t0), {
                success: !1,
                message: _context81.t0.message || "网络请求失败",
                secret_key: ""
              }));
            case 11:
            case "end":
              return _context81.stop();
          }
        }, _callee81, null, [[1, 8]]);
      }));
      function verifyActivationCode(_x70, _x71) {
        return _verifyActivationCode.apply(this, arguments);
      }
      return verifyActivationCode;
    }()
  }, {
    key: "getDeviceChipID",
    value: function () {
      var _getDeviceChipID = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee82() {
        var _e28, _o;
        return _regeneratorRuntime2().wrap(function _callee82$(_context82) {
          while (1) switch (_context82.prev = _context82.next) {
            case 0:
              if (this.isConnected) {
                _context82.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context82.prev = 2;
              _context82.next = 5;
              return this.sendCommand(t.ChameleonCommand.GET_DEVICE_CHIP_ID);
            case 5:
              _e28 = _context82.sent;
              if (_e28.success) {
                _context82.next = 8;
                break;
              }
              throw new Error("\u83B7\u53D6\u8BBE\u5907\u82AF\u7247ID\u5931\u8D25: ".concat(_e28.error));
            case 8:
              _o = this.arrayToHexLowerString(_e28.data);
              return _context82.abrupt("return", (console.log("[BluetoothService] \u83B7\u53D6\u8BBE\u5907\u82AF\u7247ID: ".concat(_o)), _o));
            case 12:
              _context82.prev = 12;
              _context82.t0 = _context82["catch"](2);
              throw console.error("[BluetoothService] 获取设备芯片ID失败:", _context82.t0), _context82.t0;
            case 15:
            case "end":
              return _context82.stop();
          }
        }, _callee82, this, [[2, 12]]);
      }));
      function getDeviceChipID() {
        return _getDeviceChipID.apply(this, arguments);
      }
      return getDeviceChipID;
    }()
  }, {
    key: "getCustomGitCommitHash",
    value: function () {
      var _getCustomGitCommitHash = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee83() {
        var _e29, _o2;
        return _regeneratorRuntime2().wrap(function _callee83$(_context83) {
          while (1) switch (_context83.prev = _context83.next) {
            case 0:
              if (this.isConnected) {
                _context83.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context83.prev = 2;
              _context83.next = 5;
              return this.sendCommand(t.ChameleonCommand.GET_CUSTOM_GIT_VERSION);
            case 5:
              _e29 = _context83.sent;
              if (_e29.success) {
                _context83.next = 8;
                break;
              }
              throw new Error("\u83B7\u53D6\u81EA\u5B9A\u4E49Git\u7248\u672C\u5931\u8D25: ".concat(_e29.error));
            case 8:
              _o2 = this.arrayBufferToString(_e29.data);
              return _context83.abrupt("return", (console.log("[BluetoothService] \u83B7\u53D6\u81EA\u5B9A\u4E49Git\u7248\u672C: ".concat(_o2)), _o2));
            case 12:
              _context83.prev = 12;
              _context83.t0 = _context83["catch"](2);
              throw console.error("[BluetoothService] 获取自定义Git版本失败:", _context83.t0), _context83.t0;
            case 15:
            case "end":
              return _context83.stop();
          }
        }, _callee83, this, [[2, 12]]);
      }));
      function getCustomGitCommitHash() {
        return _getCustomGitCommitHash.apply(this, arguments);
      }
      return getCustomGitCommitHash;
    }()
  }, {
    key: "detectMagicCardType",
    value: function () {
      var _detectMagicCardType = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee84() {
        var _t23, _o3, _r32, _n22;
        return _regeneratorRuntime2().wrap(function _callee84$(_context84) {
          while (1) switch (_context84.prev = _context84.next) {
            case 0:
              if (this.isConnected) {
                _context84.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context84.prev = 2;
              console.log("[BluetoothService] 开始检测魔术卡类型...");
              _context84.next = 6;
              return this.isReaderDeviceMode();
            case 6:
              _context84.t0 = _context84.sent;
              if (_context84.t0) {
                _context84.next = 10;
                break;
              }
              _context84.next = 10;
              return this.setReaderDeviceMode(!0);
            case 10:
              _context84.next = 12;
              return this.scan14443aTag();
            case 12:
              _t23 = _context84.sent;
              if (_t23.success) {
                _context84.next = 15;
                break;
              }
              return _context84.abrupt("return", {
                success: !1,
                error: "未检测到卡片"
              });
            case 15:
              _o3 = [];
              _r32 = "unknown";
              _context84.prev = 17;
              _context84.next = 20;
              return this.mf1Auth(0, 96, [255, 255, 255, 255, 255, 255]);
            case 20:
              _context84.t1 = _context84.sent;
              if (!_context84.t1) {
                _context84.next = 23;
                break;
              }
              _o3.push("gen1_block0_auth"), _r32 = "gen1", console.log("[BluetoothService] 检测到Gen1特征: 可认证块0");
            case 23:
              _context84.next = 28;
              break;
            case 25:
              _context84.prev = 25;
              _context84.t2 = _context84["catch"](17);
              console.log("[BluetoothService] Gen1特征检测失败:", _context84.t2);
            case 28:
              _context84.prev = 28;
              _context84.next = 31;
              return this.mf1Auth(3, 96, [255, 255, 255, 255, 255, 255]);
            case 31:
              _context84.t3 = _context84.sent;
              if (!_context84.t3) {
                _context84.next = 34;
                break;
              }
              _context84.t3 = "unknown" === _r32;
            case 34:
              _context84.t4 = _context84.t3;
              if (!_context84.t4) {
                _context84.next = 37;
                break;
              }
              _o3.push("gen2_standard_auth"), _r32 = "gen2", console.log("[BluetoothService] 检测到Gen2特征: 标准认证");
            case 37:
              _context84.next = 42;
              break;
            case 39:
              _context84.prev = 39;
              _context84.t5 = _context84["catch"](28);
              console.log("[BluetoothService] Gen2特征检测失败:", _context84.t5);
            case 42:
              0 === _t23.data.sak && (_o3.push("ntag_sak"), "unknown" === _r32 && (_r32 = "ntag", console.log("[BluetoothService] 检测到NTAG特征: SAK=0x00")));
              _n22 = {
                success: "unknown" !== _r32,
                type: _r32,
                features: _o3,
                cardInfo: _t23.data
              };
              return _context84.abrupt("return", (console.log("[BluetoothService] 魔术卡检测完成:", _n22), _n22));
            case 47:
              _context84.prev = 47;
              _context84.t6 = _context84["catch"](2);
              return _context84.abrupt("return", (console.error("[BluetoothService] 魔术卡检测失败:", _context84.t6), {
                success: !1,
                error: _context84.t6.message
              }));
            case 50:
            case "end":
              return _context84.stop();
          }
        }, _callee84, this, [[2, 47], [17, 25], [28, 39]]);
      }));
      function detectMagicCardType() {
        return _detectMagicCardType.apply(this, arguments);
      }
      return detectMagicCardType;
    }()
  }, {
    key: "verifyCardCompatibility",
    value: function () {
      var _verifyCardCompatibility = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee85(e, t) {
        var _o4, _r33;
        return _regeneratorRuntime2().wrap(function _callee85$(_context85) {
          while (1) switch (_context85.prev = _context85.next) {
            case 0:
              _context85.prev = 0;
              console.log("[BluetoothService] 验证卡片兼容性...");
              _o4 = [];
              _r33 = !0;
              return _context85.abrupt("return", ("gen1" === t || "gen2" === t ? (e.tag < 1e3 || e.tag > 1003) && (_r33 = !1, _o4.push("源卡片不是Mifare Classic类型，可能无法正常写入")) : "ntag" === t && (e.tag < 1100 || e.tag > 1108) && (_r33 = !1, _o4.push("源卡片不是NTAG/Ultralight类型，可能无法正常写入")), e.data && 0 !== e.data.length || (_r33 = !1, _o4.push("源卡片没有可写入的数据")), e.uid && e.uid.length > 14 && _o4.push("源卡片使用7字节UID，某些魔术卡可能不支持"), {
                compatible: _r33,
                warnings: _o4
              }));
            case 7:
              _context85.prev = 7;
              _context85.t0 = _context85["catch"](0);
              return _context85.abrupt("return", (console.error("[BluetoothService] 兼容性验证失败:", _context85.t0), {
                compatible: !1,
                warnings: ["兼容性验证失败"]
              }));
            case 10:
            case "end":
              return _context85.stop();
          }
        }, _callee85, null, [[0, 7]]);
      }));
      function verifyCardCompatibility(_x72, _x73) {
        return _verifyCardCompatibility.apply(this, arguments);
      }
      return verifyCardCompatibility;
    }()
  }, {
    key: "writeMagicCard",
    value: function () {
      var _writeMagicCard = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee86(e, t, o) {
        return _regeneratorRuntime2().wrap(function _callee86$(_context86) {
          while (1) switch (_context86.prev = _context86.next) {
            case 0:
              if (this.isConnected) {
                _context86.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context86.prev = 2;
              console.log("[BluetoothService] \u5F00\u59CB\u5199\u5165".concat(t, "\u9B54\u672F\u5361..."));
              if (!(0 === (e.data ? e.data.length : 0))) {
                _context86.next = 6;
                break;
              }
              throw new Error("没有可写入的数据");
            case 6:
              if (!("gen1" === t)) {
                _context86.next = 10;
                break;
              }
              _context86.next = 9;
              return this.writeGen1MagicCard(e, o);
            case 9:
              return _context86.abrupt("return", _context86.sent);
            case 10:
              if (!("gen2" === t)) {
                _context86.next = 14;
                break;
              }
              _context86.next = 13;
              return this.writeGen2MagicCard(e, o);
            case 13:
              return _context86.abrupt("return", _context86.sent);
            case 14:
              if (!("ntag" === t)) {
                _context86.next = 18;
                break;
              }
              _context86.next = 17;
              return this.writeNTAGMagicCard(e, o);
            case 17:
              return _context86.abrupt("return", _context86.sent);
            case 18:
              throw new Error("\u4E0D\u652F\u6301\u7684\u9B54\u672F\u5361\u7C7B\u578B: ".concat(t));
            case 21:
              _context86.prev = 21;
              _context86.t0 = _context86["catch"](2);
              throw console.error("[BluetoothService] 写入魔术卡失败:", _context86.t0), _context86.t0;
            case 24:
            case "end":
              return _context86.stop();
          }
        }, _callee86, this, [[2, 21]]);
      }));
      function writeMagicCard(_x74, _x75, _x76) {
        return _writeMagicCard.apply(this, arguments);
      }
      return writeMagicCard;
    }()
  }, {
    key: "writeGen1MagicCard",
    value: function () {
      var _writeGen1MagicCard = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee87(e, t) {
        var o, r, n, _a7, i;
        return _regeneratorRuntime2().wrap(function _callee87$(_context87) {
          while (1) switch (_context87.prev = _context87.next) {
            case 0:
              o = [], r = e.data.length, n = [255, 255, 255, 255, 255, 255];
              _context87.prev = 1;
              t(0, "开始写入Gen1魔术卡...");
              _a7 = 0;
            case 4:
              if (!(_a7 < r)) {
                _context87.next = 24;
                break;
              }
              i = e.data[_a7];
              if (!(i && 16 === i.length)) {
                _context87.next = 21;
                break;
              }
              _context87.prev = 7;
              t(Math.floor(_a7 / r * 100), "\u5199\u5165\u5757 ".concat(_a7, "..."));
              _context87.next = 11;
              return this.mf1WriteBlock(_a7, 96, n, new Uint8Array(i));
            case 11:
              _context87.t0 = _context87.sent;
              if (_context87.t0) {
                _context87.next = 14;
                break;
              }
              o.push(_a7);
            case 14:
              _context87.next = 16;
              return new Promise(function (e) {
                return setTimeout(e, 50);
              });
            case 16:
              _context87.next = 21;
              break;
            case 18:
              _context87.prev = 18;
              _context87.t1 = _context87["catch"](7);
              console.error("[BluetoothService] Gen1\u5199\u5165\u5757".concat(_a7, "\u5931\u8D25:"), _context87.t1), o.push(_a7);
            case 21:
              _a7++;
              _context87.next = 4;
              break;
            case 24:
              return _context87.abrupt("return", (t(100, "写入完成"), {
                success: 0 === o.length,
                failedBlocks: o
              }));
            case 27:
              _context87.prev = 27;
              _context87.t2 = _context87["catch"](1);
              throw console.error("[BluetoothService] Gen1魔术卡写入失败:", _context87.t2), _context87.t2;
            case 30:
            case "end":
              return _context87.stop();
          }
        }, _callee87, this, [[1, 27], [7, 18]]);
      }));
      function writeGen1MagicCard(_x77, _x78) {
        return _writeGen1MagicCard.apply(this, arguments);
      }
      return writeGen1MagicCard;
    }()
  }, {
    key: "writeGen2MagicCard",
    value: function () {
      var _writeGen2MagicCard = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee88(e, t) {
        var o, r, n, _a8, i, _e30, l, _a9, _c, c, _r34, _a10, _i;
        return _regeneratorRuntime2().wrap(function _callee88$(_context88) {
          while (1) switch (_context88.prev = _context88.next) {
            case 0:
              o = [], r = e.data.length, n = [255, 255, 255, 255, 255, 255];
              _context88.prev = 1;
              t(0, "开始写入Gen2魔术卡...");
              _a8 = [0, 3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47, 51, 55, 59, 63], i = [];
              for (_e30 = 0; _e30 < r; _e30++) _a8.includes(_e30) || i.push(_e30);
              l = 0;
            case 6:
              if (!(l < i.length)) {
                _context88.next = 26;
                break;
              }
              _a9 = i[l], _c = e.data[_a9];
              if (!(_c && 16 === _c.length)) {
                _context88.next = 23;
                break;
              }
              _context88.prev = 9;
              t(Math.floor(l / r * 60), "\u5199\u5165\u6570\u636E\u5757 ".concat(_a9, "..."));
              _context88.next = 13;
              return this.mf1WriteBlock(_a9, 96, n, new Uint8Array(_c));
            case 13:
              _context88.t0 = _context88.sent;
              if (_context88.t0) {
                _context88.next = 16;
                break;
              }
              o.push(_a9);
            case 16:
              _context88.next = 18;
              return new Promise(function (e) {
                return setTimeout(e, 100);
              });
            case 18:
              _context88.next = 23;
              break;
            case 20:
              _context88.prev = 20;
              _context88.t1 = _context88["catch"](9);
              console.error("[BluetoothService] Gen2\u5199\u5165\u5757".concat(_a9, "\u5931\u8D25:"), _context88.t1), o.push(_a9);
            case 23:
              l++;
              _context88.next = 6;
              break;
            case 26:
              c = _a8.filter(function (t) {
                return t < r && e.data[t];
              });
              _r34 = 0;
            case 28:
              if (!(_r34 < c.length)) {
                _context88.next = 47;
                break;
              }
              _a10 = c[_r34], _i = e.data[_a10];
              _context88.prev = 30;
              t(60 + Math.floor(_r34 / c.length * 40), "\u5199\u5165\u63A7\u5236\u5757 ".concat(_a10, "..."));
              _context88.next = 34;
              return this.mf1WriteBlock(_a10, 96, n, new Uint8Array(_i));
            case 34:
              _context88.t2 = _context88.sent;
              if (_context88.t2) {
                _context88.next = 37;
                break;
              }
              o.push(_a10);
            case 37:
              _context88.next = 39;
              return new Promise(function (e) {
                return setTimeout(e, 150);
              });
            case 39:
              _context88.next = 44;
              break;
            case 41:
              _context88.prev = 41;
              _context88.t3 = _context88["catch"](30);
              console.error("[BluetoothService] Gen2\u5199\u5165\u5757".concat(_a10, "\u5931\u8D25:"), _context88.t3), o.push(_a10);
            case 44:
              _r34++;
              _context88.next = 28;
              break;
            case 47:
              return _context88.abrupt("return", (t(100, "写入完成"), {
                success: 0 === o.length,
                failedBlocks: o
              }));
            case 50:
              _context88.prev = 50;
              _context88.t4 = _context88["catch"](1);
              throw console.error("[BluetoothService] Gen2魔术卡写入失败:", _context88.t4), _context88.t4;
            case 53:
            case "end":
              return _context88.stop();
          }
        }, _callee88, this, [[1, 50], [9, 20], [30, 41]]);
      }));
      function writeGen2MagicCard(_x79, _x80) {
        return _writeGen2MagicCard.apply(this, arguments);
      }
      return writeGen2MagicCard;
    }()
  }, {
    key: "writeNTAGMagicCard",
    value: function () {
      var _writeNTAGMagicCard = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee89(e, t) {
        var o, r, _s12, _a11, _e31;
        return _regeneratorRuntime2().wrap(function _callee89$(_context89) {
          while (1) switch (_context89.prev = _context89.next) {
            case 0:
              o = [], r = e.data.length;
              _context89.prev = 1;
              t(0, "开始写入NTAG魔术卡...");
              _s12 = 0;
            case 4:
              if (!(_s12 < r)) {
                _context89.next = 22;
                break;
              }
              _a11 = e.data[_s12];
              if (!(_a11 && 4 === _a11.length)) {
                _context89.next = 19;
                break;
              }
              _context89.prev = 7;
              t(Math.floor(_s12 / r * 100), "\u5199\u5165\u9875\u9762 ".concat(_s12, "..."));
              _e31 = [162, _s12].concat(_toConsumableArray2(_a11));
              _context89.next = 12;
              return this.send14ARaw(_e31, {
                waitResponse: !0,
                appendCrc: !0,
                checkResponseCrc: !0
              });
            case 12:
              _context89.next = 14;
              return new Promise(function (e) {
                return setTimeout(e, 50);
              });
            case 14:
              _context89.next = 19;
              break;
            case 16:
              _context89.prev = 16;
              _context89.t0 = _context89["catch"](7);
              console.error("[BluetoothService] NTAG\u5199\u5165\u9875\u9762".concat(_s12, "\u5931\u8D25:"), _context89.t0), o.push(_s12);
            case 19:
              _s12++;
              _context89.next = 4;
              break;
            case 22:
              return _context89.abrupt("return", (t(100, "写入完成"), {
                success: 0 === o.length,
                failedBlocks: o
              }));
            case 25:
              _context89.prev = 25;
              _context89.t1 = _context89["catch"](1);
              throw console.error("[BluetoothService] NTAG魔术卡写入失败:", _context89.t1), _context89.t1;
            case 28:
            case "end":
              return _context89.stop();
          }
        }, _callee89, this, [[1, 25], [7, 16]]);
      }));
      function writeNTAGMagicCard(_x81, _x82) {
        return _writeNTAGMagicCard.apply(this, arguments);
      }
      return writeNTAGMagicCard;
    }()
  }, {
    key: "enterDFUMode",
    value: function () {
      var _enterDFUMode = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee90() {
        var _o5, _r35, _e32;
        return _regeneratorRuntime2().wrap(function _callee90$(_context90) {
          while (1) switch (_context90.prev = _context90.next) {
            case 0:
              if (this.isConnected) {
                _context90.next = 2;
                break;
              }
              throw new Error("设备未连接");
            case 2:
              _context90.prev = 2;
              console.log("[BluetoothService] 让设备进入 DFU 模式");
              _o5 = new Promise(function (e, t) {
                setTimeout(function () {
                  console.log("[BluetoothService] 进入DFU模式命令超时，设备可能已重启"), t(new Error("进入DFU模式命令超时，设备可能已重启"));
                }, 1e3);
              }), _r35 = this.sendCommand(t.ChameleonCommand.ENTER_BOOTLOADER);
              _context90.prev = 5;
              _context90.next = 8;
              return Promise.race([_r35, _o5]);
            case 8:
              _e32 = _context90.sent;
              console.log("[BluetoothService] 设备已进入 DFU 模式", _e32);
              _context90.next = 17;
              break;
            case 12:
              _context90.prev = 12;
              _context90.t0 = _context90["catch"](5);
              if (_context90.t0.message.includes("超时")) {
                _context90.next = 16;
                break;
              }
              throw _context90.t0;
            case 16:
              console.log("[BluetoothService] 设备正在重启进入DFU模式");
            case 17:
              this.isConnected = !1;
              this.connectedDevice = null;
              _context90.next = 21;
              return new Promise(function (e) {
                return setTimeout(e, 1e3);
              });
            case 21:
              return _context90.abrupt("return", !0);
            case 24:
              _context90.prev = 24;
              _context90.t1 = _context90["catch"](2);
              throw console.error("[BluetoothService] 进入 DFU 模式失败:", _context90.t1), _context90.t1;
            case 27:
            case "end":
              return _context90.stop();
          }
        }, _callee90, this, [[2, 24], [5, 12]]);
      }));
      function enterDFUMode() {
        return _enterDFUMode.apply(this, arguments);
      }
      return enterDFUMode;
    }()
  }, {
    key: "isDFUDevice",
    value: function isDFUDevice(e) {
      var t = e.name || "";
      return t.startsWith("CU-") || t.startsWith("CL-");
    }
  }, {
    key: "scan14443aTag",
    value: function () {
      var _scan14443aTag = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee91() {
        var e, _o6, _r36, _r37, _n23, _s13, _a12, i, c, l;
        return _regeneratorRuntime2().wrap(function _callee91$(_context91) {
          while (1) switch (_context91.prev = _context91.next) {
            case 0:
              _context91.prev = 0;
              console.log("[Bluetooth] 扫描14443A标签...");
              _context91.next = 4;
              return this.sendCommand(t.ChameleonCommand.SCAN_14A_TAG, [], 5e3);
            case 4:
              _o6 = _context91.sent;
              if (_o6.success) {
                _context91.next = 8;
                break;
              }
              _r36 = t.ChameleonProtocol.getStatusMessage(_o6.status);
              return _context91.abrupt("return", (console.log("[Bluetooth] \u626B\u63CF14443A\u5931\u8D25, \u72B6\u6001\u7801:0x".concat(null == (e = _o6.status) ? void 0 : e.toString(16), ", \u9519\u8BEF:").concat(_r36)), {
                success: !1,
                error: _r36 || "扫描失败"
              }));
            case 8:
              if (!(!_o6.data || 0 === _o6.data.length)) {
                _context91.next = 10;
                break;
              }
              return _context91.abrupt("return", (console.log("[Bluetooth] 扫描14443A未检测到卡片"), {
                success: !1,
                error: "未检测到卡片"
              }));
            case 10:
              _r37 = _o6.data, _n23 = _r37[0];
              if (!(_n23 < 4 || _n23 > 10)) {
                _context91.next = 13;
                break;
              }
              return _context91.abrupt("return", (console.error("[Bluetooth] \u65E0\u6548\u7684UID\u957F\u5EA6: ".concat(_n23)), {
                success: !1,
                error: "无效的UID长度"
              }));
            case 13:
              if (!(_r37.length < _n23 + 5)) {
                _context91.next = 15;
                break;
              }
              return _context91.abrupt("return", (console.error("[Bluetooth] \u626B\u63CF\u6570\u636E\u957F\u5EA6\u4E0D\u8DB3: ".concat(_r37.length, ", \u671F\u671B: ").concat(_n23 + 5)), {
                success: !1,
                error: "扫描数据格式错误"
              }));
            case 15:
              _s13 = Array.from(_r37.slice(1, _n23 + 1)), _a12 = Array.from(_r37.slice(_n23 + 1, _n23 + 3)), i = _r37[_n23 + 3], c = _r37[_n23 + 4], l = c > 0 ? Array.from(_r37.slice(_n23 + 5, _n23 + 5 + c)) : [];
              return _context91.abrupt("return", (c > 0 && _r37.length < _n23 + 5 + c && console.warn("[Bluetooth] ATS\u6570\u636E\u957F\u5EA6\u4E0D\u8DB3, \u671F\u671B:".concat(c, ", \u5B9E\u9645:").concat(_r37.length - _n23 - 5)), console.log("[Bluetooth] 扫描结果:", {
                uid: _s13.map(function (e) {
                  return e.toString(16).padStart(2, "0");
                }).join(" ").toUpperCase(),
                atqa: _a12.map(function (e) {
                  return e.toString(16).padStart(2, "0");
                }).join("").toUpperCase(),
                sak: i.toString(16).padStart(2, "0").toUpperCase(),
                ats: l.map(function (e) {
                  return e.toString(16).padStart(2, "0");
                }).join(" ").toUpperCase()
              }), {
                success: !0,
                data: {
                  uid: _s13,
                  atqa: _a12,
                  sak: i,
                  ats: l
                }
              }));
            case 19:
              _context91.prev = 19;
              _context91.t0 = _context91["catch"](0);
              return _context91.abrupt("return", (console.error("[Bluetooth] 扫描14443A标签异常", _context91.t0), {
                success: !1,
                error: _context91.t0.message
              }));
            case 22:
            case "end":
              return _context91.stop();
          }
        }, _callee91, this, [[0, 19]]);
      }));
      function scan14443aTag() {
        return _scan14443aTag.apply(this, arguments);
      }
      return scan14443aTag;
    }()
  }, {
    key: "readEM410X",
    value: function () {
      var _readEM410X = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee92() {
        var e, _o7, _r38, _e33;
        return _regeneratorRuntime2().wrap(function _callee92$(_context92) {
          while (1) switch (_context92.prev = _context92.next) {
            case 0:
              _context92.prev = 0;
              console.log("[Bluetooth] 读取EM410X标签...");
              _context92.next = 4;
              return this.sendCommand(t.ChameleonCommand.SCAN_EM410X_TAG, [], 8e3);
            case 4:
              _o7 = _context92.sent;
              if (_o7.success) {
                _context92.next = 8;
                break;
              }
              _r38 = t.ChameleonProtocol.getStatusMessage(_o7.status);
              return _context92.abrupt("return", (console.log("[Bluetooth] \u8BFB\u53D6EM410X\u5931\u8D25, \u72B6\u6001\u7801:0x".concat(null == (e = _o7.status) ? void 0 : e.toString(16), ", \u9519\u8BEF:").concat(_r38)), ""));
            case 8:
              if (!(!_o7.data || 0 === _o7.data.length)) {
                _context92.next = 10;
                break;
              }
              return _context92.abrupt("return", (console.log("[Bluetooth] 未检测到EM410X卡片"), ""));
            case 10:
              if (!(_o7.data.length >= 5)) {
                _context92.next = 13;
                break;
              }
              _e33 = Array.from(_o7.data.slice(0, 5)).map(function (e) {
                return e.toString(16).padStart(2, "0");
              }).join("").toUpperCase();
              return _context92.abrupt("return", "0000000000" === _e33 || "FFFFFFFFFF" === _e33 ? (console.warn("[Bluetooth] 检测到无效的EM410X UID:", _e33), "") : (console.log("[Bluetooth] EM410X UID:", _e33), _e33));
            case 13:
              return _context92.abrupt("return", (console.error("[Bluetooth] EM410X\u6570\u636E\u957F\u5EA6\u4E0D\u8DB3: ".concat(_o7.data.length, ", \u671F\u671B\u81F3\u5C115\u5B57\u8282")), ""));
            case 16:
              _context92.prev = 16;
              _context92.t0 = _context92["catch"](0);
              return _context92.abrupt("return", (console.error("[Bluetooth] 读取EM410X异常", _context92.t0), ""));
            case 19:
            case "end":
              return _context92.stop();
          }
        }, _callee92, this, [[0, 16]]);
      }));
      function readEM410X() {
        return _readEM410X.apply(this, arguments);
      }
      return readEM410X;
    }()
  }, {
    key: "setReaderDeviceMode",
    value: function () {
      var _setReaderDeviceMode = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee93(e) {
        var _o8;
        return _regeneratorRuntime2().wrap(function _callee93$(_context93) {
          while (1) switch (_context93.prev = _context93.next) {
            case 0:
              _context93.prev = 0;
              console.log("[Bluetooth] 设置读卡器模式:", e);
              _o8 = e ? 1 : 0;
              _context93.next = 5;
              return this.sendCommand(t.ChameleonCommand.CHANGE_DEVICE_MODE, [_o8], 3e3);
            case 5:
              if (!_context93.sent.success) {
                _context93.next = 9;
                break;
              }
              _context93.t0 = (console.log("[Bluetooth] 设备模式切换成功"), !0);
              _context93.next = 10;
              break;
            case 9:
              _context93.t0 = (console.error("[Bluetooth] 设备模式切换失败"), !1);
            case 10:
              return _context93.abrupt("return", _context93.t0);
            case 13:
              _context93.prev = 13;
              _context93.t1 = _context93["catch"](0);
              return _context93.abrupt("return", (console.error("[Bluetooth] 设置读卡器模式失败", _context93.t1), !1));
            case 16:
            case "end":
              return _context93.stop();
          }
        }, _callee93, this, [[0, 13]]);
      }));
      function setReaderDeviceMode(_x83) {
        return _setReaderDeviceMode.apply(this, arguments);
      }
      return setReaderDeviceMode;
    }()
  }, {
    key: "isReaderDeviceMode",
    value: function () {
      var _isReaderDeviceMode = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee94() {
        var e;
        return _regeneratorRuntime2().wrap(function _callee94$(_context94) {
          while (1) switch (_context94.prev = _context94.next) {
            case 0:
              _context94.prev = 0;
              _context94.next = 3;
              return this.sendCommand(t.ChameleonCommand.GET_DEVICE_MODE, [], 3e3);
            case 3:
              e = _context94.sent;
              if (!(e.success && e.data && e.data.length > 0)) {
                _context94.next = 6;
                break;
              }
              return _context94.abrupt("return", 1 === e.data[0]);
            case 6:
              return _context94.abrupt("return", !1);
            case 9:
              _context94.prev = 9;
              _context94.t0 = _context94["catch"](0);
              return _context94.abrupt("return", (console.error("[Bluetooth] 检查设备模式失败", _context94.t0), !1));
            case 12:
            case "end":
              return _context94.stop();
          }
        }, _callee94, this, [[0, 9]]);
      }));
      function isReaderDeviceMode() {
        return _isReaderDeviceMode.apply(this, arguments);
      }
      return isReaderDeviceMode;
    }()
  }, {
    key: "detectMf1Support",
    value: function () {
      var _detectMf1Support = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee95() {
        var e, _o9, _r39;
        return _regeneratorRuntime2().wrap(function _callee95$(_context95) {
          while (1) switch (_context95.prev = _context95.next) {
            case 0:
              _context95.prev = 0;
              console.log("[Bluetooth] 检测Mifare Classic支持...");
              _context95.next = 4;
              return this.sendCommand(t.ChameleonCommand.MF1_SUPPORT_DETECT, [], 3e3);
            case 4:
              _o9 = _context95.sent;
              if (!(_o9.success && _o9.status === t.ChameleonStatus.STATUS_HF_TAG_OK)) {
                _context95.next = 7;
                break;
              }
              return _context95.abrupt("return", (console.log("[Bluetooth] 检测到Mifare Classic卡片"), !0));
            case 7:
              _r39 = t.ChameleonProtocol.getStatusMessage(_o9.status);
              return _context95.abrupt("return", (console.log("[Bluetooth] \u672A\u68C0\u6D4B\u5230Mifare Classic\u5361\u7247, \u72B6\u6001\u7801:0x".concat(null == (e = _o9.status) ? void 0 : e.toString(16), ", \u9519\u8BEF:").concat(_r39)), !1));
            case 11:
              _context95.prev = 11;
              _context95.t0 = _context95["catch"](0);
              return _context95.abrupt("return", (console.error("[Bluetooth] 检测Mifare Classic支持失败", _context95.t0), !1));
            case 14:
            case "end":
              return _context95.stop();
          }
        }, _callee95, this, [[0, 11]]);
      }));
      function detectMf1Support() {
        return _detectMf1Support.apply(this, arguments);
      }
      return detectMf1Support;
    }()
  }, {
    key: "mf1Auth",
    value: function () {
      var _mf1Auth = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee96(e, o, r) {
        var n, _s14, _a13, i, c, l, _o10;
        return _regeneratorRuntime2().wrap(function _callee96$(_context96) {
          while (1) switch (_context96.prev = _context96.next) {
            case 0:
              _context96.prev = 0;
              _s14 = 96 === o ? "KeyA" : "KeyB", _a13 = Array.from(r).map(function (e) {
                return e.toString(16).padStart(2, "0");
              }).join("").toUpperCase();
              console.log("[Bluetooth] Mifare\u8BA4\u8BC1 \u5757:".concat(e, ", \u5BC6\u94A5\u7C7B\u578B:").concat(_s14, ", \u5BC6\u94A5:").concat(_a13));
              i = [o, e].concat(_toConsumableArray2(r));
              _context96.next = 6;
              return this.sendCommand(t.ChameleonCommand.MF1_CHECK_KEY, i, 3e3);
            case 6:
              c = _context96.sent;
              l = c.success && c.status === t.ChameleonStatus.STATUS_HF_TAG_OK;
              if (l) console.log("[Bluetooth] Mifare\u8BA4\u8BC1\u6210\u529F \u5757:".concat(e, ", \u5BC6\u94A5\u7C7B\u578B:").concat(_s14, ", \u5BC6\u94A5:").concat(_a13));else {
                _o10 = t.ChameleonProtocol.getStatusMessage(c.status);
                console.log("[Bluetooth] Mifare\u8BA4\u8BC1\u5931\u8D25 \u5757:".concat(e, ", \u5BC6\u94A5\u7C7B\u578B:").concat(_s14, ", \u5BC6\u94A5:").concat(_a13, ", \u72B6\u6001\u7801:0x").concat(null == (n = c.status) ? void 0 : n.toString(16), ", \u9519\u8BEF:").concat(_o10));
              }
              return _context96.abrupt("return", l);
            case 12:
              _context96.prev = 12;
              _context96.t0 = _context96["catch"](0);
              return _context96.abrupt("return", (console.error("[Bluetooth] Mifare\u8BA4\u8BC1\u5F02\u5E38 \u5757:".concat(e, ", \u5BC6\u94A5\u7C7B\u578B:").concat(o), _context96.t0), !1));
            case 15:
            case "end":
              return _context96.stop();
          }
        }, _callee96, this, [[0, 12]]);
      }));
      function mf1Auth(_x84, _x85, _x86) {
        return _mf1Auth.apply(this, arguments);
      }
      return mf1Auth;
    }()
  }, {
    key: "mf1ReadBlock",
    value: function () {
      var _mf1ReadBlock = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee97(e) {
        var o,
          r,
          n,
          s,
          _a14,
          i,
          c,
          l,
          _o11,
          h,
          _args97 = arguments;
        return _regeneratorRuntime2().wrap(function _callee97$(_context97) {
          while (1) switch (_context97.prev = _context97.next) {
            case 0:
              o = _args97.length > 1 && _args97[1] !== undefined ? _args97[1] : 96;
              r = _args97.length > 2 && _args97[2] !== undefined ? _args97[2] : [255, 255, 255, 255, 255, 255];
              _context97.prev = 2;
              _a14 = 96 === o ? "KeyA" : "KeyB", i = Array.from(r).map(function (e) {
                return e.toString(16).padStart(2, "0");
              }).join("").toUpperCase();
              console.log("[Bluetooth] \u8BFB\u53D6Mifare\u5757 ".concat(e, ", \u5BC6\u94A5\u7C7B\u578B:").concat(_a14, ", \u5BC6\u94A5:").concat(i));
              c = [o, e].concat(_toConsumableArray2(r));
              _context97.next = 8;
              return this.sendCommand(t.ChameleonCommand.MF1_READ_BLOCK, c, 3e3);
            case 8:
              l = _context97.sent;
              if (l.success) {
                _context97.next = 12;
                break;
              }
              _o11 = t.ChameleonProtocol.getStatusMessage(l.status);
              return _context97.abrupt("return", (console.error("[Bluetooth] \u8BFB\u53D6Mifare\u5757 ".concat(e, " \u5931\u8D25, \u72B6\u6001\u7801:0x").concat(null == (n = l.status) ? void 0 : n.toString(16), ", \u9519\u8BEF:").concat(_o11)), null));
            case 12:
              if (!(!l.data || l.data.length < 16)) {
                _context97.next = 14;
                break;
              }
              return _context97.abrupt("return", (console.error("[Bluetooth] \u8BFB\u53D6Mifare\u5757 ".concat(e, " \u6570\u636E\u65E0\u6548, \u957F\u5EA6:").concat((null == (s = l.data) ? void 0 : s.length) || 0)), null));
            case 14:
              h = Array.from(l.data.slice(0, 16));
              return _context97.abrupt("return", (console.log("[Bluetooth] \u6210\u529F\u8BFB\u53D6Mifare\u5757 ".concat(e, ", \u6570\u636E:").concat(h.map(function (e) {
                return e.toString(16).padStart(2, "0");
              }).join(" ").toUpperCase())), h));
            case 18:
              _context97.prev = 18;
              _context97.t0 = _context97["catch"](2);
              return _context97.abrupt("return", (console.error("[Bluetooth] \u8BFB\u53D6Mifare\u5757 ".concat(e, " \u5F02\u5E38:"), _context97.t0), null));
            case 21:
            case "end":
              return _context97.stop();
          }
        }, _callee97, this, [[2, 18]]);
      }));
      function mf1ReadBlock(_x87) {
        return _mf1ReadBlock.apply(this, arguments);
      }
      return mf1ReadBlock;
    }()
  }, {
    key: "mf1WriteBlock",
    value: function () {
      var _mf1WriteBlock = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee98(e) {
        var o,
          r,
          n,
          s,
          _a15,
          _args98 = arguments;
        return _regeneratorRuntime2().wrap(function _callee98$(_context98) {
          while (1) switch (_context98.prev = _context98.next) {
            case 0:
              o = _args98.length > 1 && _args98[1] !== undefined ? _args98[1] : 96;
              r = _args98.length > 2 && _args98[2] !== undefined ? _args98[2] : [255, 255, 255, 255, 255, 255];
              n = _args98.length > 3 ? _args98[3] : undefined;
              _context98.prev = 3;
              if (!(console.log("[Bluetooth] \u5199\u5165Mifare\u5757 ".concat(e)), !n || 16 !== n.length)) {
                _context98.next = 6;
                break;
              }
              throw new Error("\u5757\u6570\u636E\u957F\u5EA6\u5FC5\u987B\u4E3A16\u5B57\u8282\uFF0C\u5F53\u524D: ".concat(n ? n.length : 0));
            case 6:
              s = [o, e].concat(_toConsumableArray2(r), _toConsumableArray2(Array.from(n)));
              _context98.next = 9;
              return this.sendCommand(t.ChameleonCommand.MF1_WRITE_BLOCK, s, 3e3);
            case 9:
              _a15 = _context98.sent;
              return _context98.abrupt("return", _a15.success ? (console.log("[Bluetooth] \u6210\u529F\u5199\u5165Mifare\u5757 ".concat(e)), !0) : (console.error("[Bluetooth] \u5199\u5165Mifare\u5757 ".concat(e, " \u5931\u8D25: ").concat(_a15.error)), !1));
            case 13:
              _context98.prev = 13;
              _context98.t0 = _context98["catch"](3);
              return _context98.abrupt("return", (console.error("[Bluetooth] \u5199\u5165Mifare\u5757 ".concat(e, " \u5F02\u5E38:"), _context98.t0), !1));
            case 16:
            case "end":
              return _context98.stop();
          }
        }, _callee98, this, [[3, 13]]);
      }));
      function mf1WriteBlock(_x88) {
        return _mf1WriteBlock.apply(this, arguments);
      }
      return mf1WriteBlock;
    }()
  }, {
    key: "enterDfuMode",
    value: function enterDfuMode() {
      console.log("[Bluetooth] 进入DFU模式，暂停心跳"), this.isDfuMode = !0, this.stopHeartbeat();
    }
  }, {
    key: "exitDfuMode",
    value: function exitDfuMode() {
      console.log("[Bluetooth] 退出DFU模式，恢复心跳"), this.isDfuMode = !1, this.startHeartbeat();
    }
  }]);
  return _class;
}())();exports.bluetoothService = i;