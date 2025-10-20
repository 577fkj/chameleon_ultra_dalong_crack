var _regeneratorRuntime2 = require("../../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../../@babel/runtime/helpers/asyncToGenerator");var _toConsumableArray2 = require("../../@babel/runtime/helpers/toConsumableArray");var _objectSpread2 = require("../../@babel/runtime/helpers/objectSpread2");var t = require("../../common/vendor.js"),
  e = {
    name: "GeofenceEditPage",
    data: function data() {
      return {
        geofenceId: "",
        geofence: null,
        formData: {
          name: "",
          slotId: 0,
          enabled: !0,
          polygon: []
        },
        mapCenter: {
          latitude: 39.908775,
          longitude: 116.39674
        },
        tempPoints: [],
        editingMode: !1,
        mapTapDisabled: !1
      };
    },
    computed: _objectSpread2(_objectSpread2(_objectSpread2({}, t.mapGetters("geofence", ["getGeofenceById"])), t.mapState("slots", ["slots"])), {}, {
      availableSlots: function availableSlots() {
        var t, e;
        var o = [];
        for (var i = 0; i < 16; i++) {
          var n = this.slots ? this.slots[i] : null,
            a = n && ((null == (t = n.hf) ? void 0 : t.enabled) || (null == (e = n.lf) ? void 0 : e.enabled));
          o.push({
            value: i,
            label: "\u5361\u69FD".concat(i + 1).concat(a ? " ✓" : " (空)"),
            disabled: !a
          });
        }
        return o;
      },
      canSave: function canSave() {
        return "" !== this.formData.name.trim() && this.formData.polygon.length >= 3 && this.availableSlots[this.formData.slotId] && !this.availableSlots[this.formData.slotId].disabled;
      },
      mapMarkers: function mapMarkers() {
        return this.tempPoints.map(function (t, e) {
          return {
            id: "point_".concat(e),
            latitude: t.latitude,
            longitude: t.longitude,
            iconPath: "/static/icons/edit-point.png",
            width: 24,
            height: 24,
            title: "\u70B9 ".concat(e + 1)
          };
        });
      },
      mapPolygons: function mapPolygons() {
        return this.tempPoints.length >= 3 ? [{
          points: this.tempPoints,
          strokeColor: "#007AFF",
          fillColor: "#007AFF33",
          strokeWidth: 2
        }] : [];
      }
    }),
    onLoad: function onLoad(t) {
      t.id && (this.geofenceId = t.id, this.loadGeofence());
    },
    methods: _objectSpread2(_objectSpread2({}, t.mapActions("geofence", ["updateGeofence", "getCurrentPosition"])), {}, {
      loadGeofence: function loadGeofence() {
        if (this.geofence = this.getGeofenceById(this.geofenceId), !this.geofence) return this.showError("围栏不存在"), void this.goBack();
        this.formData = {
          name: this.geofence.name,
          slotId: this.geofence.slotId,
          enabled: this.geofence.enabled,
          polygon: _toConsumableArray2(this.geofence.polygon)
        }, this.formData.polygon.length > 0 && (this.mapCenter = this.calculatePolygonCenter(this.formData.polygon));
      },
      onSlotChange: function onSlotChange(t) {
        this.formData.slotId = parseInt(t.detail.value);
      },
      removePoint: function removePoint(t) {
        this.formData.polygon.splice(t, 1);
      },
      clearPoints: function clearPoints() {
        var _this = this;
        t.index.showModal({
          title: "确认操作",
          content: "确定要清空所有点位吗？",
          success: function success(t) {
            t.confirm && (_this.formData.polygon = []);
          }
        });
      },
      editOnMap: function editOnMap() {
        this.tempPoints = _toConsumableArray2(this.formData.polygon), this.editingMode = !0, this.$refs.mapDialog.open();
      },
      closeMapDialog: function closeMapDialog() {
        this.editingMode = !1, this.tempPoints = [], this.$refs.mapDialog.close();
      },
      centerToCurrentLocation: function centerToCurrentLocation() {
        var _this2 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
          var _e;
          return _regeneratorRuntime2().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                t.index.showLoading({
                  title: "定位中..."
                });
                _context.next = 4;
                return _this2.getCurrentPosition();
              case 4:
                _e = _context.sent;
                _e && (_this2.mapCenter = {
                  latitude: _e.latitude,
                  longitude: _e.longitude
                }, _this2.tempPoints.length < 3 && (_this2.tempPoints.push({
                  latitude: _e.latitude,
                  longitude: _e.longitude
                }), t.index.showToast({
                  title: "已添加当前位置",
                  icon: "none"
                }))), t.index.hideLoading();
                _context.next = 11;
                break;
              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](0);
                t.index.hideLoading(), t.index.showToast({
                  title: "定位失败",
                  icon: "none"
                });
              case 11:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[0, 8]]);
        }))();
      },
      fitPolygon: function fitPolygon() {
        this.tempPoints.length < 2 ? t.index.showToast({
          title: "至少需要2个点",
          icon: "none"
        }) : t.index.showToast({
          title: "已适应围栏范围",
          icon: "none"
        });
      },
      addPointAtCurrentLocation: function addPointAtCurrentLocation() {
        var _this3 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
          var _e2;
          return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                t.index.showLoading({
                  title: "定位中..."
                });
                _context2.next = 4;
                return _this3.getCurrentPosition();
              case 4:
                _e2 = _context2.sent;
                _e2 && (_this3.tempPoints.push({
                  latitude: _e2.latitude,
                  longitude: _e2.longitude
                }), t.index.showToast({
                  title: "已添加当前位置",
                  icon: "success"
                })), t.index.hideLoading();
                _context2.next = 11;
                break;
              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](0);
                t.index.hideLoading(), t.index.showToast({
                  title: "定位失败",
                  icon: "none"
                });
              case 11:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[0, 8]]);
        }))();
      },
      onMapTap: function onMapTap(e) {
        var _this4 = this;
        if (!this.editingMode) return;
        if (this.mapTapDisabled) return;
        this.mapTapDisabled = !0, setTimeout(function () {
          _this4.mapTapDisabled = !1;
        }, 500);
        var o = {
          latitude: e.detail.latitude,
          longitude: e.detail.longitude
        };
        this.tempPoints.push(o), t.index.vibrateShort(), t.index.showToast({
          title: "\u5DF2\u6DFB\u52A0\u70B9 ".concat(this.tempPoints.length),
          icon: "none"
        });
      },
      onMarkerTap: function onMarkerTap(e) {
        var _this5 = this;
        if (!this.editingMode) return;
        var o = e.detail.markerId;
        if (!o.startsWith("point_")) return;
        var i = parseInt(o.split("_")[1]);
        isNaN(i) || i < 0 || i >= this.tempPoints.length || t.index.showActionSheet({
          itemList: ["删除此点", "在此位置添加点"],
          success: function success(e) {
            if (0 === e.tapIndex) _this5.tempPoints.splice(i, 1), t.index.vibrateShort(), t.index.showToast({
              title: "已删除点",
              icon: "none"
            });else if (1 === e.tapIndex) {
              var _e3 = _this5.tempPoints[i],
                _o = {
                  latitude: _e3.latitude + 1e-4,
                  longitude: _e3.longitude + 1e-4
                };
              _this5.tempPoints.splice(i + 1, 0, _o), t.index.showToast({
                title: "已添加点",
                icon: "none"
              });
            }
          }
        });
      },
      clearMapPoints: function clearMapPoints() {
        var _this6 = this;
        t.index.showModal({
          title: "确认操作",
          content: "确定要清空地图上的所有点位吗？",
          success: function success(t) {
            t.confirm && (_this6.tempPoints = []);
          }
        });
      },
      confirmMapChanges: function confirmMapChanges() {
        this.tempPoints.length < 3 ? this.showError("至少需要3个点才能形成围栏") : (this.formData.polygon = _toConsumableArray2(this.tempPoints), this.closeMapDialog(), t.index.showToast({
          title: "围栏区域已更新",
          icon: "success"
        }));
      },
      toggleEnabled: function toggleEnabled(t) {
        this.formData.enabled = t.detail.value;
      },
      saveChanges: function saveChanges() {
        var _this7 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
          return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                if (!_this7.canSave) {
                  _context3.next = 15;
                  break;
                }
                _context3.prev = 1;
                t.index.showLoading({
                  title: "保存中..."
                });
                _context3.next = 5;
                return _this7.updateGeofence({
                  id: _this7.geofenceId,
                  updates: {
                    name: _this7.formData.name,
                    slotId: _this7.formData.slotId,
                    enabled: _this7.formData.enabled,
                    polygon: _this7.formData.polygon
                  }
                });
              case 5:
                t.index.hideLoading();
                t.index.showToast({
                  title: "保存成功",
                  icon: "success"
                });
                setTimeout(function () {
                  _this7.goBack();
                }, 1500);
                _context3.next = 13;
                break;
              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3["catch"](1);
                t.index.hideLoading(), _this7.showError("保存失败: " + _context3.t0.message);
              case 13:
                _context3.next = 16;
                break;
              case 15:
                _this7.showError("请完善围栏信息");
              case 16:
              case "end":
                return _context3.stop();
            }
          }, _callee3, null, [[1, 10]]);
        }))();
      },
      goBack: function goBack() {
        t.index.navigateBack();
      },
      calculatePolygonCenter: function calculatePolygonCenter(t) {
        if (!t || 0 === t.length) return {
          latitude: 39.908775,
          longitude: 116.39674
        };
        var e = 0,
          o = 0;
        return t.forEach(function (t) {
          e += t.latitude, o += t.longitude;
        }), {
          latitude: e / t.length,
          longitude: o / t.length
        };
      },
      formatTime: function formatTime(t) {
        if (!t) return "-";
        return new Date(t).toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        });
      },
      showError: function showError(e) {
        t.index.showModal({
          title: "错误",
          content: e,
          showCancel: !1
        });
      }
    })
  };if (!Array) {
  (t.resolveComponent("uni-icons") + t.resolveComponent("uni-popup"))();
}Math || (function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
} + function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
})();var o = t._export_sfc(e, [["render", function (e, o, i, n, a, s) {
  var l;
  return t.e({
    a: a.formData.name,
    b: t.o(function (t) {
      return a.formData.name = t.detail.value;
    }),
    c: t.t((null == (l = s.availableSlots[a.formData.slotId]) ? void 0 : l.label) || "请选择卡槽"),
    d: t.p({
      type: "arrowdown",
      size: "14"
    }),
    e: s.availableSlots,
    f: a.formData.slotId,
    g: t.o(function () {
      return s.onSlotChange && s.onSlotChange.apply(s, arguments);
    }),
    h: a.formData.enabled,
    i: t.o(function () {
      return s.toggleEnabled && s.toggleEnabled.apply(s, arguments);
    }),
    j: t.t(a.formData.polygon.length),
    k: a.formData.polygon.length > 0
  }, a.formData.polygon.length > 0 ? {
    l: t.f(a.formData.polygon, function (e, o, i) {
      return {
        a: t.t(o + 1),
        b: t.t(e.latitude.toFixed(6)),
        c: t.t(e.longitude.toFixed(6)),
        d: "b20df31c-1-" + i,
        e: t.o(function (t) {
          return s.removePoint(o);
        }, o),
        f: o
      };
    }),
    m: t.p({
      type: "close",
      size: "16"
    })
  } : {}, {
    n: t.o(function () {
      return s.clearPoints && s.clearPoints.apply(s, arguments);
    }),
    o: t.o(function () {
      return s.editOnMap && s.editOnMap.apply(s, arguments);
    }),
    p: a.geofence
  }, a.geofence ? {
    q: t.t(s.formatTime(a.geofence.createTime)),
    r: t.t(s.formatTime(a.geofence.updateTime)),
    s: t.t(a.geofence.triggerCount || 0),
    t: t.t(a.geofence.lastTriggerTime ? s.formatTime(a.geofence.lastTriggerTime) : "从未触发")
  } : {}, {
    v: t.o(function () {
      return s.goBack && s.goBack.apply(s, arguments);
    }),
    w: t.o(function () {
      return s.saveChanges && s.saveChanges.apply(s, arguments);
    }),
    x: !s.canSave,
    y: t.p({
      type: "close",
      size: "20"
    }),
    z: t.o(function () {
      return s.closeMapDialog && s.closeMapDialog.apply(s, arguments);
    }),
    A: a.mapCenter.latitude,
    B: a.mapCenter.longitude,
    C: s.mapMarkers,
    D: s.mapPolygons,
    E: a.tempPoints.length > 0 ? a.tempPoints : null,
    F: t.o(function () {
      return s.onMapTap && s.onMapTap.apply(s, arguments);
    }),
    G: t.o(function () {
      return s.onMarkerTap && s.onMarkerTap.apply(s, arguments);
    }),
    H: t.p({
      type: "location",
      size: "20",
      color: "#333"
    }),
    I: t.o(function () {
      return s.centerToCurrentLocation && s.centerToCurrentLocation.apply(s, arguments);
    }),
    J: t.p({
      type: "scan",
      size: "20",
      color: "#333"
    }),
    K: t.o(function () {
      return s.fitPolygon && s.fitPolygon.apply(s, arguments);
    }),
    L: a.tempPoints.length > 0
  }, a.tempPoints.length > 0 ? {
    M: t.p({
      type: "plusempty",
      size: "20",
      color: "#333"
    }),
    N: t.o(function () {
      return s.addPointAtCurrentLocation && s.addPointAtCurrentLocation.apply(s, arguments);
    })
  } : {}, {
    O: a.tempPoints.length > 0
  }, a.tempPoints.length > 0 ? {
    P: t.t(a.tempPoints.length)
  } : {}, {
    Q: t.o(function () {
      return s.clearMapPoints && s.clearMapPoints.apply(s, arguments);
    }),
    R: t.t(a.tempPoints.length),
    S: t.o(function () {
      return s.confirmMapChanges && s.confirmMapChanges.apply(s, arguments);
    }),
    T: a.tempPoints.length < 3,
    U: t.sr("mapDialog", "b20df31c-2"),
    V: t.p({
      type: "center",
      "mask-click": !1
    })
  });
}], ["__scopeId", "data-v-b20df31c"]]);wx.createPage(o);