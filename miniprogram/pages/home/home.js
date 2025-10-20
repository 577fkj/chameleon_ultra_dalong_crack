var _regeneratorRuntime2 = require("../../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../../@babel/runtime/helpers/asyncToGenerator");var _objectSpread2 = require("../../@babel/runtime/helpers/objectSpread2");var e = require("../../common/vendor.js"),
  t = require("../../services/bluetooth.js"),
  o = {
    name: "HomePage",
    data: function data() {
      return {
        refreshing: !1,
        recentActivities: [{
          id: 1,
          title: "读取了卡片 UID: 04 5A 3B 2C",
          time: Date.now() - 3e5,
          icon: "scan",
          iconColor: "#FF9800"
        }, {
          id: 2,
          title: "切换到卡槽 3",
          time: Date.now() - 6e5,
          icon: "wallet",
          iconColor: "#4CAF50"
        }, {
          id: 3,
          title: "导入了 Mifare Classic 卡片",
          time: Date.now() - 12e5,
          icon: "folder",
          iconColor: "#2196F3"
        }]
      };
    },
    computed: _objectSpread2(_objectSpread2({}, e.mapGetters("device", ["isConnected", "isConnecting", "connectedDevice", "deviceInfo", "batteryInfo", "deviceStatusText", "deviceModelName", "deviceModeName", "batteryStatusText", "activeSlot"])), {}, {
      deviceDisplayName: function deviceDisplayName() {
        return this.connectedDevice ? this.connectedDevice.name || "Chameleon 设备" : "Chameleon Ultra";
      },
      deviceIconType: function deviceIconType() {
        return this.isConnected ? "checkmarkempty" : this.isConnecting ? "loop" : "closeempty";
      },
      deviceIconColor: function deviceIconColor() {
        return this.isConnected ? "#4CAF50" : this.isConnecting ? "#FF9800" : "#999";
      },
      statusColor: function statusColor() {
        return this.isConnected ? "#4CAF50" : this.isConnecting ? "#FF9800" : "#999";
      },
      signalStrengthText: function signalStrengthText() {
        if (!this.connectedDevice || !this.connectedDevice.RSSI) return "未知";
        var e = this.connectedDevice.RSSI;
        return e > -50 ? "强" : e > -70 ? "中" : e > -90 ? "弱" : "很弱";
      }
    }),
    onLoad: function onLoad() {
      this.initPage();
    },
    onShow: function onShow() {
      this.checkDeviceStatus();
    },
    onPullDownRefresh: function onPullDownRefresh() {
      this.refreshPage();
    },
    methods: _objectSpread2(_objectSpread2({}, e.mapActions("device", ["loadSettings", "refreshDeviceInfo", "syncConnectionStatus"])), {}, {
      initPage: function initPage() {
        var _this = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
          return _regeneratorRuntime2().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _this.loadSettings();
              case 3:
                _this.syncConnectionStatus();
                _context.t0 = _this.isConnected;
                if (!_context.t0) {
                  _context.next = 8;
                  break;
                }
                _context.next = 8;
                return _this.checkDeviceStatus();
              case 8:
                _context.next = 13;
                break;
              case 10:
                _context.prev = 10;
                _context.t1 = _context["catch"](0);
                console.error("[HomePage] 初始化失败", _context.t1);
              case 13:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[0, 10]]);
        }))();
      },
      checkDeviceStatus: function checkDeviceStatus() {
        var _this2 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
          return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                if (!(_this2.isConnected && !t.bluetoothService.isDFU)) {
                  _context2.next = 9;
                  break;
                }
                _context2.prev = 1;
                _context2.next = 4;
                return _this2.refreshDeviceInfo();
              case 4:
                _context2.next = 9;
                break;
              case 6:
                _context2.prev = 6;
                _context2.t0 = _context2["catch"](1);
                console.error("[HomePage] 检查设备状态失败", _context2.t0);
              case 9:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[1, 6]]);
        }))();
      },
      refreshPage: function refreshPage() {
        var _this3 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
          return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                if (!t.bluetoothService.isDFU) {
                  _context3.next = 4;
                  break;
                }
                e.index.stopPullDownRefresh();
                _context3.next = 20;
                break;
              case 4:
                _context3.prev = 4;
                _this3.refreshing = !0;
                _context3.t0 = _this3.isConnected;
                if (!_context3.t0) {
                  _context3.next = 10;
                  break;
                }
                _context3.next = 10;
                return _this3.refreshDeviceInfo();
              case 10:
                _context3.next = 12;
                return new Promise(function (e) {
                  return setTimeout(e, 1e3);
                });
              case 12:
                _context3.next = 17;
                break;
              case 14:
                _context3.prev = 14;
                _context3.t1 = _context3["catch"](4);
                console.error("[HomePage] 刷新失败", _context3.t1), e.index.showToast({
                  title: "刷新失败",
                  icon: "error"
                });
              case 17:
                _context3.prev = 17;
                _this3.refreshing = !1, e.index.stopPullDownRefresh();
                return _context3.finish(17);
              case 20:
              case "end":
                return _context3.stop();
            }
          }, _callee3, null, [[4, 14, 17, 20]]);
        }))();
      },
      refreshDeviceInfo: function refreshDeviceInfo() {
        var _this4 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4() {
          return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                if (!(_this4.isConnected && !t.bluetoothService.isDFU)) {
                  _context4.next = 16;
                  break;
                }
                _context4.prev = 1;
                e.index.showLoading({
                  title: "刷新中..."
                });
                _context4.next = 5;
                return _this4.$store.dispatch("device/refreshDeviceInfo");
              case 5:
                e.index.showToast({
                  title: "刷新成功",
                  icon: "success"
                });
                _context4.next = 11;
                break;
              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4["catch"](1);
                console.error("[HomePage] 刷新设备信息失败", _context4.t0), e.index.showToast({
                  title: "刷新失败",
                  icon: "error"
                });
              case 11:
                _context4.prev = 11;
                e.index.hideLoading();
                return _context4.finish(11);
              case 14:
                _context4.next = 17;
                break;
              case 16:
                e.index.showToast({
                  title: "设备未连接",
                  icon: "none"
                });
              case 17:
              case "end":
                return _context4.stop();
            }
          }, _callee4, null, [[1, 8, 11, 14]]);
        }))();
      },
      goToConnect: function goToConnect() {
        e.index.switchTab({
          url: "/pages/connect/connect"
        });
      },
      goToSlots: function goToSlots() {
        this.isConnected && e.index.switchTab({
          url: "/pages/slots/slots"
        });
      },
      goToCards: function goToCards() {
        this.isConnected && e.index.switchTab({
          url: "/pages/cards/cards"
        });
      },
      goToReader: function goToReader() {
        this.isConnected && e.index.switchTab({
          url: "/pages/reader/reader"
        });
      },
      goToGeofence: function goToGeofence() {
        this.isConnected && e.index.navigateTo({
          url: "/pages/geofence/geofence"
        });
      },
      goToSettings: function goToSettings() {
        e.index.navigateTo({
          url: "/pages/settings/settings"
        });
      },
      viewAllActivity: function viewAllActivity() {
        e.index.navigateTo({
          url: "/pages/activity/activity"
        });
      },
      showConnectionRequired: function showConnectionRequired() {
        var _this5 = this;
        e.index.showModal({
          title: "需要连接设备",
          content: "此功能需要先连接 Chameleon 设备，是否立即连接？",
          confirmText: "去连接",
          success: function success(e) {
            e.confirm && _this5.goToConnect();
          }
        });
      },
      formatTime: function formatTime(e) {
        if (!e) return "未知时间";
        var t = Date.now() - e;
        if (t < 6e4) return "刚刚";
        if (t < 36e5) return Math.floor(t / 6e4) + "分钟前";
        if (t < 864e5) return Math.floor(t / 36e5) + "小时前";
        return new Date(e).toLocaleDateString();
      }
    })
  };if (!Array) {
  e.resolveComponent("uni-icons")();
}Math;var i = e._export_sfc(o, [["render", function (t, o, i, n, s, c) {
  return e.e({
    a: e.p({
      type: c.deviceIconType,
      size: 40,
      color: c.deviceIconColor
    }),
    b: e.t(c.deviceDisplayName),
    c: e.t(t.deviceStatusText),
    d: c.statusColor,
    e: !t.isConnected
  }, t.isConnected ? {
    g: e.o(c.refreshDeviceInfo),
    h: e.p({
      type: "refresh",
      size: "30",
      color: "#666"
    })
  } : {
    f: e.o(function () {
      return c.goToConnect && c.goToConnect.apply(c, arguments);
    })
  }, {
    i: t.isConnected && t.deviceInfo
  }, t.isConnected && t.deviceInfo ? {
    j: e.t(t.deviceModelName),
    k: e.t(t.deviceInfo.version || "未知"),
    l: e.t(t.deviceModeName),
    m: e.t(t.batteryStatusText),
    n: e.t(t.activeSlot + 1),
    o: e.t(c.signalStrengthText)
  } : {}, {
    p: !t.isConnected
  }, (t.isConnected, {}), {
    q: e.p({
      type: "wallet",
      size: "32",
      color: "#4CAF50"
    }),
    r: !t.isConnected
  }, t.isConnected ? {} : {
    s: e.p({
      type: "locked",
      size: "20",
      color: "#999"
    })
  }, {
    t: t.isConnected ? "" : 1,
    v: e.o(function () {
      return c.goToSlots && c.goToSlots.apply(c, arguments);
    }),
    w: e.p({
      type: "folder",
      size: "32",
      color: "#2196F3"
    }),
    x: !t.isConnected
  }, t.isConnected ? {} : {
    y: e.p({
      type: "locked",
      size: "20",
      color: "#999"
    })
  }, {
    z: t.isConnected ? "" : 1,
    A: e.o(function () {
      return c.goToCards && c.goToCards.apply(c, arguments);
    }),
    B: e.p({
      type: "scan",
      size: "32",
      color: "#FF9800"
    }),
    C: !t.isConnected
  }, t.isConnected ? {} : {
    D: e.p({
      type: "locked",
      size: "20",
      color: "#999"
    })
  }, {
    E: t.isConnected ? "" : 1,
    F: e.o(function () {
      return c.goToReader && c.goToReader.apply(c, arguments);
    }),
    G: e.p({
      type: "location",
      size: "32",
      color: "#E91E63"
    }),
    H: !t.isConnected
  }, t.isConnected ? {} : {
    I: e.p({
      type: "locked",
      size: "20",
      color: "#999"
    })
  }, {
    J: t.isConnected ? "" : 1,
    K: e.o(function () {
      return c.goToGeofence && c.goToGeofence.apply(c, arguments);
    }),
    L: e.p({
      type: "gear",
      size: "32",
      color: "#9C27B0"
    }),
    M: e.o(function () {
      return c.goToSettings && c.goToSettings.apply(c, arguments);
    })
  });
}], ["__scopeId", "data-v-971c2681"]]);wx.createPage(i);