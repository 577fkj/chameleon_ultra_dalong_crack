var _regeneratorRuntime2 = require("../../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../../@babel/runtime/helpers/asyncToGenerator");var _toConsumableArray2 = require("../../@babel/runtime/helpers/toConsumableArray");var _objectSpread2 = require("../../@babel/runtime/helpers/objectSpread2");var e = require("../../common/vendor.js"),
  t = {
    name: "GeofencePage",
    data: function data() {
      return {
        mapCenter: {
          latitude: 39.908775,
          longitude: 116.39674
        },
        mapScale: 16,
        drawingMode: !1,
        drawingPoints: [],
        newGeofence: {
          name: "",
          slotId: 0,
          polygon: []
        },
        selectedGeofence: null,
        debounceTimer: null,
        mapRendering: !1,
        mapTapDisabled: !1,
        lastTapTime: 0,
        mapUpdateQueue: []
      };
    },
    computed: _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, e.mapGetters("device", ["isConnected"])), e.mapGetters("geofence", ["enabledGeofences", "canEnableGeofence", "statistics"])), e.mapState("slots", ["slots"])), e.mapState("geofence", ["geofences", "currentPosition", "currentGeofence", "isWatching", "autoSwitchEnabled", "locationPermission"])), {}, {
      markers: function markers() {
        var e = [];
        return this.currentPosition && e.push({
          id: "current",
          latitude: this.currentPosition.latitude,
          longitude: this.currentPosition.longitude,
          iconPath: "/static/icons/location-current.png",
          title: "当前位置",
          width: 30,
          height: 30
        }), this.drawingMode && this.drawingPoints.forEach(function (t, o) {
          e.push({
            id: "drawing_".concat(o),
            latitude: t.latitude,
            longitude: t.longitude,
            iconPath: "/static/icons/drawing-point.png",
            width: 20,
            height: 20
          });
        }), e;
      },
      polygons: function polygons() {
        var e = [];
        return this.geofences.forEach(function (t) {
          t.polygon && t.polygon.length >= 3 && e.push({
            points: t.polygon,
            strokeColor: t.enabled ? "#007AFF" : "#999999",
            fillColor: t.enabled ? "#007AFF33" : "#99999933",
            strokeWidth: 2
          });
        }), this.drawingMode && this.drawingPoints.length >= 3 && e.push({
          points: this.drawingPoints,
          strokeColor: "#FF9500",
          fillColor: "#FF950033",
          strokeWidth: 2
        }), e;
      },
      availableSlots: function availableSlots() {
        var e, t;
        var o = [];
        for (var n = 0; n < 16; n++) {
          var i = this.slots ? this.slots[n] : null,
            a = (null == (e = null == i ? void 0 : i.hf) ? void 0 : e.enabled) && "UNKNOWN" !== i.hf.tagType,
            s = (null == (t = null == i ? void 0 : i.lf) ? void 0 : t.enabled) && "UNKNOWN" !== i.lf.tagType,
            c = a || s;
          var l = "\u5361\u69FD".concat(n + 1),
            d = [];
          a && i.hf.name ? d.push("HF:".concat(i.hf.name)) : a && d.push("HF:".concat(i.hf.tagType)), s && i.lf.name ? d.push("LF:".concat(i.lf.name)) : s && d.push("LF:".concat(i.lf.tagType)), d.length > 0 ? l += " (".concat(d.join(", "), ") \u2713") : l += " (空卡槽)", o.push({
            value: n,
            label: l,
            disabled: !c,
            hasCard: c,
            cardInfo: {
              hf: a ? {
                name: i.hf.name,
                type: i.hf.tagType,
                enabled: i.hf.enabled
              } : null,
              lf: s ? {
                name: i.lf.name,
                type: i.lf.tagType,
                enabled: i.lf.enabled
              } : null
            }
          });
        }
        return o;
      },
      canSaveGeofence: function canSaveGeofence() {
        return "" !== this.newGeofence.name.trim() && this.newGeofence.polygon.length >= 3 && this.availableSlots[this.newGeofence.slotId] && !this.availableSlots[this.newGeofence.slotId].disabled;
      },
      selectedSlotInfo: function selectedSlotInfo() {
        return this.availableSlots[this.newGeofence.slotId] || null;
      },
      includePoints: function includePoints() {
        var e = [];
        return this.currentPosition && e.push({
          latitude: this.currentPosition.latitude,
          longitude: this.currentPosition.longitude
        }), this.drawingMode && this.drawingPoints.length > 0 && e.push.apply(e, _toConsumableArray2(this.drawingPoints)), this.selectedGeofence && this.selectedGeofence.polygon && e.push.apply(e, _toConsumableArray2(this.selectedGeofence.polygon)), e.length > 1 ? e : null;
      }
    }),
    onLoad: function onLoad() {
      var _this = this;
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
        return _regeneratorRuntime2().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              if (!(e.index.showLoading({
                title: "初始化中..."
              }), _this.isConnected)) {
                _context.next = 11;
                break;
              }
              _context.prev = 2;
              _context.next = 5;
              return _this.loadAllSlots();
            case 5:
              console.log("[围栏页面] 卡槽数据加载完成");
              _context.next = 11;
              break;
            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](2);
              console.warn("[围栏页面] 卡槽数据加载失败，将在设备连接后重试:", _context.t0);
            case 11:
              _context.next = 13;
              return _this.initializeGeofence();
            case 13:
              _context.next = 15;
              return _this.getCurrentLocationAndCenter();
            case 15:
              _this.setupDebounceControl();
              _this.setupDeviceConnectionWatcher();
              e.index.hideLoading();
              _context.next = 23;
              break;
            case 20:
              _context.prev = 20;
              _context.t1 = _context["catch"](0);
              e.index.hideLoading(), console.error("[围栏页面] 初始化失败:", _context.t1), _this.showError("初始化失败: " + _context.t1.message);
            case 23:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 20], [2, 8]]);
      }))();
    },
    onUnload: function onUnload() {
      this.isWatching && this.stopWatching(), this.debounceTimer && (clearTimeout(this.debounceTimer), this.debounceTimer = null);
    },
    onShow: function onShow() {
      this.autoSwitchEnabled && !this.isWatching && this.startWatching().catch(function (e) {
        console.warn("[围栏页面] 恢复监听失败:", e);
      });
    },
    onHide: function onHide() {
      this.debounceTimer && (clearTimeout(this.debounceTimer), this.debounceTimer = null);
    },
    methods: _objectSpread2(_objectSpread2(_objectSpread2({}, e.mapActions("geofence", ["initialize", "getCurrentPosition", "startWatching", "stopWatching", "toggleAutoSwitch", "addGeofence", "updateGeofence", "deleteGeofence"])), e.mapActions("slots", ["loadAllSlots"])), {}, {
      setupDebounceControl: function setupDebounceControl() {
        var _this2 = this;
        this.$watch(function () {
          return [_this2.drawingPoints, _this2.currentPosition, _this2.geofences, _this2.selectedGeofence];
        }, this.debouncedUpdateMap, {
          deep: !0
        });
      },
      setupDeviceConnectionWatcher: function setupDeviceConnectionWatcher() {
        var _this3 = this;
        this.$watch(function () {
          return _this3.isConnected;
        }, /*#__PURE__*/function () {
          var _ref = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2(t, o) {
            return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  if (!(t && !o)) {
                    _context2.next = 12;
                    break;
                  }
                  _context2.prev = 1;
                  e.index.showLoading({
                    title: "更新卡槽数据..."
                  });
                  _context2.next = 5;
                  return _this3.loadAllSlots();
                case 5:
                  console.log("[围栏页面] 设备连接后卡槽数据刷新完成");
                  e.index.hideLoading();
                  _context2.next = 12;
                  break;
                case 9:
                  _context2.prev = 9;
                  _context2.t0 = _context2["catch"](1);
                  e.index.hideLoading(), console.error("[围栏页面] 设备连接后卡槽数据刷新失败:", _context2.t0);
                case 12:
                case "end":
                  return _context2.stop();
              }
            }, _callee2, null, [[1, 9]]);
          }));
          return function (_x, _x2) {
            return _ref.apply(this, arguments);
          };
        }(), {
          immediate: !1
        });
      },
      debouncedUpdateMap: function debouncedUpdateMap() {
        var _this4 = this;
        this.debounceTimer && clearTimeout(this.debounceTimer), this.debounceTimer = setTimeout(function () {
          _this4.mapRendering = !0, _this4.$nextTick(function () {
            _this4.mapRendering = !1;
          });
        }, 100);
      },
      initializeGeofence: function initializeGeofence() {
        var _this5 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
          return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return _this5.initialize();
              case 3:
                _context3.next = 8;
                break;
              case 5:
                _context3.prev = 5;
                _context3.t0 = _context3["catch"](0);
                throw console.error("[围栏页面] 围栏模块初始化失败:", _context3.t0), _context3.t0;
              case 8:
              case "end":
                return _context3.stop();
            }
          }, _callee3, null, [[0, 5]]);
        }))();
      },
      getCurrentLocationAndCenter: function getCurrentLocationAndCenter() {
        var _this6 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4() {
          var _e;
          return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return _this6.getCurrentPosition();
              case 3:
                _e = _context4.sent;
                _this6.mapCenter = {
                  latitude: _e.latitude,
                  longitude: _e.longitude
                };
                _context4.next = 10;
                break;
              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4["catch"](0);
                console.warn("[围栏页面] 获取当前位置失败:", _context4.t0);
              case 10:
              case "end":
                return _context4.stop();
            }
          }, _callee4, null, [[0, 7]]);
        }))();
      },
      toggleAutoSwitchFunction: function toggleAutoSwitchFunction() {
        var _this7 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5() {
          var _t;
          return _regeneratorRuntime2().wrap(function _callee5$(_context5) {
            while (1) switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return _this7.toggleAutoSwitch();
              case 3:
                _t = _this7.autoSwitchEnabled ? "围栏功能已启用" : "围栏功能已关闭";
                e.index.showToast({
                  title: _t,
                  icon: "success"
                });
                _context5.next = 10;
                break;
              case 7:
                _context5.prev = 7;
                _context5.t0 = _context5["catch"](0);
                console.error("[围栏页面] 切换自动切换功能失败:", _context5.t0), _this7.showError("操作失败: " + _context5.t0.message);
              case 10:
              case "end":
                return _context5.stop();
            }
          }, _callee5, null, [[0, 7]]);
        }))();
      },
      onMapTap: function onMapTap(t) {
        var _this8 = this;
        var o = Date.now();
        if (this.mapTapDisabled || o - this.lastTapTime < 200) return;
        if (this.lastTapTime = o, !this.drawingMode) return;
        this.mapTapDisabled = !0, setTimeout(function () {
          _this8.mapTapDisabled = !1;
        }, 150);
        var n = {
          latitude: t.detail.latitude,
          longitude: t.detail.longitude
        };
        this.drawingPoints.push(n), this.$nextTick(function () {
          e.index.vibrateShort({
            success: function success() {},
            fail: function fail() {}
          });
        }), this.drawingPoints.length >= 3 && e.index.showToast({
          title: "".concat(this.drawingPoints.length, "\u4E2A\u70B9"),
          icon: "none",
          duration: 1e3
        });
      },
      centerToCurrentLocation: function centerToCurrentLocation() {
        var _this9 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee6() {
          var _t2;
          return _regeneratorRuntime2().wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                e.index.showLoading({
                  title: "定位中..."
                });
                _context6.next = 4;
                return _this9.getCurrentPosition();
              case 4:
                _t2 = _context6.sent;
                _this9.mapCenter = {
                  latitude: _t2.latitude,
                  longitude: _t2.longitude
                }, e.index.hideLoading();
                _context6.next = 11;
                break;
              case 8:
                _context6.prev = 8;
                _context6.t0 = _context6["catch"](0);
                e.index.hideLoading(), _this9.showError("定位失败: " + _context6.t0.message);
              case 11:
              case "end":
                return _context6.stop();
            }
          }, _callee6, null, [[0, 8]]);
        }))();
      },
      manualCheckGeofence: function manualCheckGeofence() {
        var _this10 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee7() {
          var _t3;
          return _regeneratorRuntime2().wrap(function _callee7$(_context7) {
            while (1) switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                e.index.showLoading({
                  title: "检查围栏中..."
                });
                _context7.next = 4;
                return _this10.getCurrentPosition();
              case 4:
                _t3 = _context7.sent;
                _context7.next = 7;
                return _this10.$store.dispatch("geofence/handlePositionUpdate", _t3);
              case 7:
                e.index.hideLoading();
                e.index.showToast({
                  title: "围栏检查完成",
                  icon: "success"
                });
                _context7.next = 14;
                break;
              case 11:
                _context7.prev = 11;
                _context7.t0 = _context7["catch"](0);
                e.index.hideLoading(), _this10.showError("围栏检查失败: " + _context7.t0.message);
              case 14:
              case "end":
                return _context7.stop();
            }
          }, _callee7, null, [[0, 11]]);
        }))();
      },
      showAddGeofenceDialog: function showAddGeofenceDialog() {
        this.isConnected ? this.$refs.addDialog.open() : this.showError("请先连接设备");
      },
      hideAddDialog: function hideAddDialog() {
        this.$refs.addDialog.close();
      },
      startDrawing: function startDrawing() {
        this.drawingMode = !0, this.drawingPoints = [], this.hideAddDialog(), e.index.showToast({
          title: "请在地图上点击绘制围栏",
          icon: "none",
          duration: 3e3
        });
      },
      cancelDrawing: function cancelDrawing() {
        var _this11 = this;
        e.index.showModal({
          title: "确认取消",
          content: "确定要取消绘制吗？已添加的点将被清除。",
          confirmColor: "#ff0000",
          success: function success(t) {
            t.confirm && (_this11.drawingMode = !1, _this11.drawingPoints = [], e.index.showToast({
              title: "已取消绘制",
              icon: "none"
            }));
          }
        });
      },
      finishDrawing: function finishDrawing() {
        this.drawingPoints.length < 3 ? this.showError("至少需要3个点才能创建围栏") : (e.index.vibrateShort(), this.newGeofence = {
          name: "",
          slotId: 0,
          polygon: _toConsumableArray2(this.drawingPoints)
        }, this.drawingMode = !1, this.showConfigDialog());
      },
      showConfigDialog: function showConfigDialog() {
        this.$refs.configDialog.open();
      },
      hideConfigDialog: function hideConfigDialog() {
        this.$refs.configDialog.close(), this.newGeofence = {
          name: "",
          slotId: 0,
          polygon: []
        }, this.drawingPoints = [];
      },
      onSlotChange: function onSlotChange(e) {
        this.newGeofence.slotId = parseInt(e.detail.value);
      },
      refreshSlotsData: function refreshSlotsData() {
        var _this12 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee8() {
          return _regeneratorRuntime2().wrap(function _callee8$(_context8) {
            while (1) switch (_context8.prev = _context8.next) {
              case 0:
                if (!_this12.isConnected) {
                  _context8.next = 14;
                  break;
                }
                _context8.prev = 1;
                e.index.showLoading({
                  title: "刷新卡槽数据..."
                });
                _context8.next = 5;
                return _this12.loadAllSlots();
              case 5:
                e.index.hideLoading();
                e.index.showToast({
                  title: "卡槽数据已刷新",
                  icon: "success",
                  duration: 1500
                });
                _context8.next = 12;
                break;
              case 9:
                _context8.prev = 9;
                _context8.t0 = _context8["catch"](1);
                e.index.hideLoading(), console.error("[围栏页面] 刷新卡槽数据失败:", _context8.t0), _this12.showError("刷新失败: " + _context8.t0.message);
              case 12:
                _context8.next = 15;
                break;
              case 14:
                _this12.showError("请先连接设备");
              case 15:
              case "end":
                return _context8.stop();
            }
          }, _callee8, null, [[1, 9]]);
        }))();
      },
      saveGeofence: function saveGeofence() {
        var _this13 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee9() {
          return _regeneratorRuntime2().wrap(function _callee9$(_context9) {
            while (1) switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                e.index.showLoading({
                  title: "保存中..."
                });
                _context9.next = 4;
                return _this13.addGeofence(_this13.newGeofence);
              case 4:
                e.index.hideLoading();
                e.index.showToast({
                  title: "围栏创建成功",
                  icon: "success"
                });
                _this13.hideConfigDialog();
                _context9.next = 12;
                break;
              case 9:
                _context9.prev = 9;
                _context9.t0 = _context9["catch"](0);
                e.index.hideLoading(), _this13.showError("保存失败: " + _context9.t0.message);
              case 12:
              case "end":
                return _context9.stop();
            }
          }, _callee9, null, [[0, 9]]);
        }))();
      },
      selectGeofence: function selectGeofence(e) {
        if (this.selectedGeofence = e, e.polygon && e.polygon.length > 0) {
          var _t4 = this.calculatePolygonCenter(e.polygon);
          this.mapCenter = _t4;
        }
      },
      editGeofence: function editGeofence(t) {
        e.index.navigateTo({
          url: "/pages/geofence-edit/geofence-edit?id=".concat(t.id)
        });
      },
      toggleGeofenceEnabled: function toggleGeofenceEnabled(t) {
        var _this14 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee10() {
          var _o;
          return _regeneratorRuntime2().wrap(function _callee10$(_context10) {
            while (1) switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                _context10.next = 3;
                return _this14.updateGeofence({
                  id: t.id,
                  updates: {
                    enabled: !t.enabled
                  }
                });
              case 3:
                _o = t.enabled ? "围栏已禁用" : "围栏已启用";
                e.index.showToast({
                  title: _o,
                  icon: "success"
                });
                _context10.next = 10;
                break;
              case 7:
                _context10.prev = 7;
                _context10.t0 = _context10["catch"](0);
                _this14.showError("操作失败: " + _context10.t0.message);
              case 10:
              case "end":
                return _context10.stop();
            }
          }, _callee10, null, [[0, 7]]);
        }))();
      },
      deleteGeofenceConfirm: function deleteGeofenceConfirm(t) {
        var _this15 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee12() {
          return _regeneratorRuntime2().wrap(function _callee12$(_context12) {
            while (1) switch (_context12.prev = _context12.next) {
              case 0:
                e.index.showModal({
                  title: "确认删除",
                  content: "\u786E\u5B9A\u8981\u5220\u9664\u56F4\u680F\"".concat(t.name, "\"\u5417\uFF1F"),
                  success: function () {
                    var _success = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee11(o) {
                      return _regeneratorRuntime2().wrap(function _callee11$(_context11) {
                        while (1) switch (_context11.prev = _context11.next) {
                          case 0:
                            if (!o.confirm) {
                              _context11.next = 10;
                              break;
                            }
                            _context11.prev = 1;
                            _context11.next = 4;
                            return _this15.deleteGeofence(t.id);
                          case 4:
                            e.index.showToast({
                              title: "删除成功",
                              icon: "success"
                            });
                            _context11.next = 10;
                            break;
                          case 7:
                            _context11.prev = 7;
                            _context11.t0 = _context11["catch"](1);
                            _this15.showError("删除失败: " + _context11.t0.message);
                          case 10:
                          case "end":
                            return _context11.stop();
                        }
                      }, _callee11, null, [[1, 7]]);
                    }));
                    function success(_x3) {
                      return _success.apply(this, arguments);
                    }
                    return success;
                  }()
                });
              case 1:
              case "end":
                return _context12.stop();
            }
          }, _callee12);
        }))();
      },
      calculatePolygonCenter: function calculatePolygonCenter(e) {
        var t = 0,
          o = 0;
        return e.forEach(function (e) {
          t += e.latitude, o += e.longitude;
        }), {
          latitude: t / e.length,
          longitude: o / e.length
        };
      },
      showError: function showError(t) {
        e.index.showModal({
          title: "错误",
          content: t,
          showCancel: !1
        });
      },
      onMapRegionChange: function onMapRegionChange(e) {},
      onMarkerTap: function onMarkerTap(t) {
        var _this16 = this;
        var o = t.detail.markerId;
        if (!this.drawingMode || !o.startsWith("drawing_")) return;
        var n = parseInt(o.split("_")[1]);
        isNaN(n) || n < 0 || n >= this.drawingPoints.length || e.index.showActionSheet({
          itemList: ["删除此点"],
          success: function success(t) {
            0 === t.tapIndex && (_this16.drawingPoints.splice(n, 1), e.index.vibrateShort(), _this16.drawingPoints.length < 3 ? e.index.showToast({
              title: "请至少添加3个点",
              icon: "none"
            }) : e.index.showToast({
              title: "已删除一个点",
              icon: "none"
            }));
          }
        });
      }
    })
  };if (!Array) {
  (e.resolveComponent("uni-icons") + e.resolveComponent("uni-popup-dialog") + e.resolveComponent("uni-popup"))();
}Math || (function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
} + function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-popup-dialog/uni-popup-dialog.js";
} + function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
})();var o = e._export_sfc(t, [["render", function (t, o, n, i, a, s) {
  var c;
  return e.e({
    a: e.p({
      type: t.isConnected ? "wifi" : "wifi-off",
      size: 16,
      color: t.isConnected ? "#4CAF50" : "#f44336"
    }),
    b: e.t(t.isConnected ? "已连接" : "未连接"),
    c: t.isConnected ? 1 : "",
    d: e.p({
      type: t.isWatching ? "eye" : "eye-slash",
      size: 16,
      color: t.isWatching ? "#2196F3" : "#999"
    }),
    e: e.t(t.isWatching ? "监听中" : "已停止"),
    f: t.isWatching ? 1 : "",
    g: e.p({
      type: "location",
      size: 16,
      color: "#FF9800"
    }),
    h: e.t(t.statistics.enabledGeofences || 0),
    i: e.t(t.statistics.totalGeofences || 0),
    j: e.p({
      type: t.autoSwitchEnabled ? "checkmarkempty" : "close",
      size: "16"
    }),
    k: e.t(t.autoSwitchEnabled ? "关闭" : "启用"),
    l: t.autoSwitchEnabled ? 1 : "",
    m: t.canEnableGeofence ? "" : 1,
    n: e.o(function () {
      return s.toggleAutoSwitchFunction && s.toggleAutoSwitchFunction.apply(s, arguments);
    }),
    o: !t.canEnableGeofence,
    p: a.mapCenter.latitude,
    q: a.mapCenter.longitude,
    r: a.mapScale,
    s: s.markers,
    t: s.polygons,
    v: e.o(function () {
      return s.onMapRegionChange && s.onMapRegionChange.apply(s, arguments);
    }),
    w: e.o(function () {
      return s.onMarkerTap && s.onMarkerTap.apply(s, arguments);
    }),
    x: e.o(function () {
      return s.onMapTap && s.onMapTap.apply(s, arguments);
    }),
    y: s.includePoints,
    z: e.p({
      type: "location",
      size: "16"
    }),
    A: e.o(function () {
      return s.centerToCurrentLocation && s.centerToCurrentLocation.apply(s, arguments);
    }),
    B: !t.currentPosition,
    C: !a.drawingMode
  }, a.drawingMode ? {} : {
    D: e.p({
      type: "plus",
      size: "16"
    }),
    E: e.o(function () {
      return s.showAddGeofenceDialog && s.showAddGeofenceDialog.apply(s, arguments);
    }),
    F: !t.isConnected
  }, {
    G: a.drawingMode
  }, a.drawingMode ? {
    H: e.p({
      type: "checkmarkempty",
      size: "16"
    }),
    I: e.o(function () {
      return s.finishDrawing && s.finishDrawing.apply(s, arguments);
    }),
    J: a.drawingPoints.length < 3
  } : {}, {
    K: t.autoSwitchEnabled && !a.drawingMode
  }, t.autoSwitchEnabled && !a.drawingMode ? {
    L: e.p({
      type: "refresh",
      size: "16"
    }),
    M: e.o(function () {
      return s.manualCheckGeofence && s.manualCheckGeofence.apply(s, arguments);
    })
  } : {}, {
    N: a.drawingMode
  }, a.drawingMode ? {
    O: e.t(a.drawingPoints.length),
    P: e.o(function () {
      return s.cancelDrawing && s.cancelDrawing.apply(s, arguments);
    }),
    Q: e.o(function () {
      return s.finishDrawing && s.finishDrawing.apply(s, arguments);
    }),
    R: a.drawingPoints.length < 3
  } : {}, {
    S: e.t(t.statistics.enabledGeofences || 0),
    T: e.t(t.statistics.totalGeofences || 0),
    U: t.geofences.length > 0
  }, t.geofences.length > 0 ? {
    V: e.p({
      type: "plus",
      size: "16"
    }),
    W: e.o(function () {
      return s.showAddGeofenceDialog && s.showAddGeofenceDialog.apply(s, arguments);
    }),
    X: !t.isConnected
  } : {}, {
    Y: t.geofences.length > 0
  }, t.geofences.length > 0 ? {
    Z: e.f(t.geofences, function (o, n, i) {
      return e.e({
        a: e.t(o.name),
        b: "5cad4b6b-9-" + i,
        c: e.t(o.slotId + 1),
        d: "5cad4b6b-10-" + i,
        e: e.t(o.polygon.length),
        f: o.triggerCount > 0
      }, o.triggerCount > 0 ? {
        g: "5cad4b6b-11-" + i,
        h: e.p({
          type: "loop",
          size: "12",
          color: "#FF9800"
        }),
        i: e.t(o.triggerCount)
      } : {}, {
        j: o.enabled ? 1 : "",
        k: e.t(o.enabled ? "启用" : "禁用"),
        l: "5cad4b6b-12-" + i,
        m: e.o(function (e) {
          return s.editGeofence(o);
        }, o.id),
        n: "5cad4b6b-13-" + i,
        o: e.p({
          type: o.enabled ? "eye-slash" : "eye",
          size: "14"
        }),
        p: e.t(o.enabled ? "禁用" : "启用"),
        q: e.o(function (e) {
          return s.toggleGeofenceEnabled(o);
        }, o.id),
        r: "5cad4b6b-14-" + i,
        s: e.o(function (e) {
          return s.deleteGeofenceConfirm(o);
        }, o.id),
        t: e.o(function () {}, o.id),
        v: t.currentGeofence && t.currentGeofence.id === o.id
      }, (t.currentGeofence && (t.currentGeofence.id, o.id), {}), {
        w: o.id,
        x: o.enabled ? 1 : "",
        y: t.currentGeofence && t.currentGeofence.id === o.id ? 1 : "",
        z: e.o(function (e) {
          return s.selectGeofence(o);
        }, o.id)
      });
    }),
    aa: e.p({
      type: "wallet",
      size: "12",
      color: "#666"
    }),
    ab: e.p({
      type: "location-filled",
      size: "12",
      color: "#666"
    }),
    ac: e.p({
      type: "compose",
      size: "14"
    }),
    ad: e.p({
      type: "trash",
      size: "14"
    })
  } : {
    ae: e.p({
      type: "location",
      size: "48",
      color: "#E0E0E0"
    }),
    af: e.p({
      type: "plus",
      size: "16"
    }),
    ag: e.o(function () {
      return s.showAddGeofenceDialog && s.showAddGeofenceDialog.apply(s, arguments);
    }),
    ah: !t.isConnected
  }, {
    ai: t.currentPosition
  }, t.currentPosition ? e.e({
    aj: e.t(t.currentPosition.latitude.toFixed(6)),
    ak: e.t(t.currentPosition.longitude.toFixed(6)),
    al: t.currentGeofence
  }, t.currentGeofence ? {
    am: e.t(t.currentGeofence.name),
    an: e.t(t.currentGeofence.slotId + 1)
  } : (t.autoSwitchEnabled, {}), {
    ao: t.autoSwitchEnabled,
    ap: t.isWatching
  }, t.isWatching ? {
    aq: e.t(t.enabledGeofences.length)
  } : {}) : {}, {
    ar: e.o(s.startDrawing),
    as: e.o(s.hideAddDialog),
    at: e.p({
      type: "info",
      title: "提示",
      content: "请在地图上点击至少3个点来创建围栏区域，完成后点击右上角的+号。",
      confirmText: "开始绘制"
    }),
    av: e.sr("addDialog", "5cad4b6b-17"),
    aw: e.p({
      type: "dialog",
      "mask-click": !1
    }),
    ax: e.p({
      type: "close",
      size: "16"
    }),
    ay: e.o(function () {
      return s.hideConfigDialog && s.hideConfigDialog.apply(s, arguments);
    }),
    az: a.newGeofence.name,
    aA: e.o(function (e) {
      return a.newGeofence.name = e.detail.value;
    }),
    aB: e.p({
      type: "refresh",
      size: "14"
    }),
    aC: e.o(function () {
      return s.refreshSlotsData && s.refreshSlotsData.apply(s, arguments);
    }),
    aD: !t.isConnected,
    aE: e.t((null == (c = s.availableSlots[a.newGeofence.slotId]) ? void 0 : c.label) || "请选择卡槽"),
    aF: e.p({
      type: "arrowdown",
      size: "14"
    }),
    aG: s.availableSlots,
    aH: e.o(function () {
      return s.onSlotChange && s.onSlotChange.apply(s, arguments);
    }),
    aI: e.t(a.newGeofence.polygon.length),
    aJ: s.selectedSlotInfo
  }, s.selectedSlotInfo ? e.e({
    aK: s.selectedSlotInfo.cardInfo.hf
  }, s.selectedSlotInfo.cardInfo.hf ? {
    aL: e.p({
      type: "card",
      size: "14",
      color: "#2196F3"
    }),
    aM: e.t(s.selectedSlotInfo.cardInfo.hf.name || s.selectedSlotInfo.cardInfo.hf.type)
  } : {}, {
    aN: s.selectedSlotInfo.cardInfo.lf
  }, s.selectedSlotInfo.cardInfo.lf ? {
    aO: e.p({
      type: "wifi",
      size: "14",
      color: "#FF9800"
    }),
    aP: e.t(s.selectedSlotInfo.cardInfo.lf.name || s.selectedSlotInfo.cardInfo.lf.type)
  } : {}, {
    aQ: !s.selectedSlotInfo.hasCard
  }, s.selectedSlotInfo.hasCard ? {} : {
    aR: e.p({
      type: "close",
      size: "14",
      color: "#ccc"
    })
  }) : {}, {
    aS: e.o(function () {
      return s.hideConfigDialog && s.hideConfigDialog.apply(s, arguments);
    }),
    aT: e.o(function () {
      return s.saveGeofence && s.saveGeofence.apply(s, arguments);
    }),
    aU: !s.canSaveGeofence,
    aV: e.sr("configDialog", "5cad4b6b-19"),
    aW: e.p({
      type: "center",
      "mask-click": !1
    })
  });
}], ["__scopeId", "data-v-5cad4b6b"]]);wx.createPage(o);