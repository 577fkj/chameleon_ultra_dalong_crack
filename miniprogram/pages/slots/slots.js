var _defineProperty2 = require("../../@babel/runtime/helpers/defineProperty");var _regeneratorRuntime2 = require("../../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../../@babel/runtime/helpers/asyncToGenerator");var _objectSpread2 = require("../../@babel/runtime/helpers/objectSpread2");var t = require("../../common/vendor.js"),
  e = require("../../utils/chameleon-protocol.js"),
  s = {
    name: "SlotsPage",
    data: function data() {
      return {
        isRefreshing: !1,
        showGlobalSettingsPopup: !1
      };
    },
    computed: _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, t.mapState("slots", ["slots", "activeSlot", "isLoading", "isUpdating", "lastError", "slotSettings"])), t.mapGetters("slots", ["activeSlotData", "validSlots", "slotStatistics"])), t.mapGetters("device", ["isConnected"])), {}, {
      statistics: function statistics() {
        return this.slotStatistics || {
          usedSlots: 0,
          emptySlots: 16
        };
      }
    }),
    onLoad: function onLoad() {
      this.initPage();
    },
    onShow: function onShow() {
      this.isConnected && this.checkSlotsData();
    },
    onPullDownRefresh: function onPullDownRefresh() {
      this.refreshSlots();
    },
    methods: _objectSpread2(_objectSpread2({}, t.mapActions("slots", ["loadAllSlots", "setActiveSlot", "clearSlot", "loadSlotSettings", "saveSlotSettings", "enableSlotFrequency"])), {}, {
      initPage: function initPage() {
        var _this = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
          return _regeneratorRuntime2().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _this.loadSlotSettings();
              case 3:
                _context.t0 = _this.isConnected;
                if (!_context.t0) {
                  _context.next = 7;
                  break;
                }
                _context.next = 7;
                return _this.loadAllSlots();
              case 7:
                _context.next = 12;
                break;
              case 9:
                _context.prev = 9;
                _context.t1 = _context["catch"](0);
                console.error("[SlotsPage] 初始化失败", _context.t1), _this.showError("初始化失败: " + _context.t1.message);
              case 12:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[0, 9]]);
        }))();
      },
      checkSlotsData: function checkSlotsData() {
        var _this2 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
          return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                if (!_this2.isConnected) {
                  _context2.next = 7;
                  break;
                }
                _context2.t0 = 0 !== _this2.statistics.usedSlots || _this2.isLoading;
                if (_context2.t0) {
                  _context2.next = 5;
                  break;
                }
                _context2.next = 5;
                return _this2.refreshSlots();
              case 5:
                _context2.next = 8;
                break;
              case 7:
                _this2.showConnectionRequired();
              case 8:
              case "end":
                return _context2.stop();
            }
          }, _callee2);
        }))();
      },
      refreshSlots: function refreshSlots() {
        var _this3 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
          return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                if (!_this3.isConnected) {
                  _context3.next = 16;
                  break;
                }
                _context3.prev = 1;
                _this3.isRefreshing = !0;
                _context3.next = 5;
                return _this3.loadAllSlots();
              case 5:
                t.index.showToast({
                  title: "刷新成功",
                  icon: "success"
                });
                _context3.next = 11;
                break;
              case 8:
                _context3.prev = 8;
                _context3.t0 = _context3["catch"](1);
                console.error("[SlotsPage] 刷新失败", _context3.t0), _this3.showError("刷新失败: " + _context3.t0.message);
              case 11:
                _context3.prev = 11;
                _this3.isRefreshing = !1, t.index.stopPullDownRefresh();
                return _context3.finish(11);
              case 14:
                _context3.next = 17;
                break;
              case 16:
                _this3.showConnectionRequired();
              case 17:
              case "end":
                return _context3.stop();
            }
          }, _callee3, null, [[1, 8, 11, 14]]);
        }))();
      },
      handleSlotClick: function handleSlotClick(e) {
        var _this4 = this;
        this.isConnected ? this.slotSettings.quickSwitch && e.enabled ? this.switchToSlot(e.id) : this.isSlotUsed(e) ? t.index.navigateTo({
          url: "/pages/card-detail/card-detail?slotId=".concat(e.id)
        }) : t.index.showActionSheet({
          itemList: ["从卡包添加卡片", "手动添加HF卡片", "手动添加LF卡片"],
          success: function success(t) {
            if (0 === t.tapIndex) _this4.addCardFromPackage(e.id);else {
              var _s = 1 === t.tapIndex ? "hf" : "lf";
              _this4.addCard(e.id, _s);
            }
          }
        }) : this.showConnectionRequired();
      },
      showSlotSettings: function showSlotSettings(e) {
        var _this5 = this;
        e.nickname || e.id;
        var s = e.id === this.activeSlot,
          o = this.isSlotUsed(e),
          i = e.hf && e.hf.enabled && "UNKNOWN" !== e.hf.tagType,
          a = e.lf && e.lf.enabled && "UNKNOWN" !== e.lf.tagType,
          l = [];
        o ? (l.push("查看详细信息"), s || l.push("设为活动卡槽"), i && l.push("HF卡片设置"), a && l.push("LF卡片设置"), i || (l.push("从卡包添加HF卡片"), l.push("手动添加HF卡片")), a || (l.push("从卡包添加LF卡片"), l.push("手动添加LF卡片")), l.push("清空卡槽")) : (l.push("从卡包添加卡片"), l.push("手动添加HF卡片"), l.push("手动添加LF卡片")), t.index.showActionSheet({
          itemList: l,
          success: function () {
            var _success = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4(t) {
              return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.t0 = l[t.tapIndex];
                    _context4.next = _context4.t0 === "查看详细信息" ? 3 : _context4.t0 === "设为活动卡槽" ? 5 : _context4.t0 === "HF卡片设置" ? 8 : _context4.t0 === "LF卡片设置" ? 10 : _context4.t0 === "清空卡槽" ? 12 : _context4.t0 === "从卡包添加卡片" ? 14 : _context4.t0 === "从卡包添加HF卡片" ? 16 : _context4.t0 === "从卡包添加LF卡片" ? 18 : _context4.t0 === "手动添加HF卡片" ? 20 : _context4.t0 === "手动添加LF卡片" ? 22 : 23;
                    break;
                  case 3:
                    _this5.showSlotDetails(e);
                    return _context4.abrupt("break", 23);
                  case 5:
                    _context4.next = 7;
                    return _this5.switchToSlot(e.id);
                  case 7:
                    return _context4.abrupt("break", 23);
                  case 8:
                    _this5.editSlotCard(e.id, "hf");
                    return _context4.abrupt("break", 23);
                  case 10:
                    _this5.editSlotCard(e.id, "lf");
                    return _context4.abrupt("break", 23);
                  case 12:
                    _this5.clearSlotWithConfirm(e.id);
                    return _context4.abrupt("break", 23);
                  case 14:
                    _this5.addCardFromPackage(e.id);
                    return _context4.abrupt("break", 23);
                  case 16:
                    _this5.addCardFromPackage(e.id, "hf");
                    return _context4.abrupt("break", 23);
                  case 18:
                    _this5.addCardFromPackage(e.id, "lf");
                    return _context4.abrupt("break", 23);
                  case 20:
                    _this5.addCard(e.id, "hf");
                    return _context4.abrupt("break", 23);
                  case 22:
                    _this5.addCard(e.id, "lf");
                  case 23:
                  case "end":
                    return _context4.stop();
                }
              }, _callee4);
            }));
            function success(_x) {
              return _success.apply(this, arguments);
            }
            return success;
          }()
        });
      },
      toggleSlotFrequency: function toggleSlotFrequency(e, s, o) {
        var _this6 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5() {
          var i, _t;
          return _regeneratorRuntime2().wrap(function _callee5$(_context5) {
            while (1) switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return _this6.enableSlotFrequency({
                  slotId: e,
                  frequency: s,
                  enabled: o
                });
              case 3:
                i = o ? "启用" : "禁用";
                t.index.showToast({
                  title: "\u5DF2".concat(i, "\u5361\u69FD").concat(e + 1, "\u7684").concat(s, "\u9891\u7387"),
                  icon: "success"
                });
                _context5.next = 12;
                break;
              case 7:
                _context5.prev = 7;
                _context5.t0 = _context5["catch"](0);
                console.error("[SlotsPage] \u8BBE\u7F6E".concat(s, "\u9891\u7387\u5931\u8D25:"), _context5.t0);
                _t = o ? "启用" : "禁用";
                _this6.showError("".concat(_t).concat(s, "\u9891\u7387\u5931\u8D25: ").concat(_context5.t0.message));
              case 12:
              case "end":
                return _context5.stop();
            }
          }, _callee5, null, [[0, 7]]);
        }))();
      },
      showSlotDetails: function showSlotDetails(e) {
        var _this7 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee6() {
          var _o, _t2, _t3;
          return _regeneratorRuntime2().wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                t.index.showLoading({
                  title: "获取详细信息..."
                });
                _o = "\u5361\u69FD\u7F16\u53F7: ".concat(e.id + 1, "\n");
                if (!(_o += "\u6635\u79F0: ".concat(e.nickname || "\u5361\u69FD ".concat(e.id + 1), "\n"), _o += "\u72B6\u6001: ".concat(e.id === _this7.activeSlot ? "当前活动" : "未激活", "\n\n"), e.hf && e.hf.enabled && "UNKNOWN" !== e.hf.tagType)) {
                  _context6.next = 19;
                  break;
                }
                _o += "HF频率 (13.56MHz):\n", _o += "  \u7C7B\u578B: ".concat(_this7.getTagTypeName(e.hf.tagType), "\n"), e.hf.name && (_o += "  \u540D\u79F0: ".concat(e.hf.name, "\n"));
                _context6.prev = 5;
                console.log("[SlotsPage] \u6B63\u5728\u83B7\u53D6\u5361\u69FD".concat(e.id, "\u7684HF UID..."));
                _context6.next = 9;
                return _this7.$store.dispatch("slots/getHfCardUID", e.id);
              case 9:
                _t2 = _context6.sent;
                _t2 && _t2.uid && (_o += "  UID: ".concat(_t2.uid, "\n"));
                _context6.next = 16;
                break;
              case 13:
                _context6.prev = 13;
                _context6.t0 = _context6["catch"](5);
                console.warn("[SlotsPage] 获取HF UID失败:", _context6.t0.message), _o += "  UID: 获取失败\n";
              case 16:
                _o += "  状态: 已启用\n\n";
                _context6.next = 20;
                break;
              case 19:
                e.hf && (_o += "HF频率: 已禁用\n\n");
              case 20:
                if (!(e.lf && e.lf.enabled && "UNKNOWN" !== e.lf.tagType)) {
                  _context6.next = 36;
                  break;
                }
                _o += "LF频率 (125KHz):\n", _o += "  \u7C7B\u578B: ".concat(_this7.getTagTypeName(e.lf.tagType), "\n"), e.lf.name && (_o += "  \u540D\u79F0: ".concat(e.lf.name, "\n"));
                _context6.prev = 22;
                console.log("[SlotsPage] \u6B63\u5728\u83B7\u53D6\u5361\u69FD".concat(e.id, "\u7684LF UID..."));
                _context6.next = 26;
                return _this7.$store.dispatch("slots/getLfCardUID", e.id);
              case 26:
                _t3 = _context6.sent;
                _t3 && (_o += "  UID: ".concat(_t3, "\n"));
                _context6.next = 33;
                break;
              case 30:
                _context6.prev = 30;
                _context6.t1 = _context6["catch"](22);
                console.warn("[SlotsPage] 获取LF UID失败:", _context6.t1.message), _o += "  UID: 获取失败\n";
              case 33:
                _o += "  状态: 已启用\n";
                _context6.next = 37;
                break;
              case 36:
                e.lf && (_o += "LF频率: 已禁用\n");
              case 37:
                _this7.isSlotUsed(e) || (_o += "此卡槽为空\n"), t.index.hideLoading(), t.index.showModal({
                  title: "\u5361\u69FD ".concat(e.id + 1, " \u8BE6\u60C5"),
                  content: _o,
                  showCancel: !1,
                  confirmText: "确定"
                });
                _context6.next = 43;
                break;
              case 40:
                _context6.prev = 40;
                _context6.t2 = _context6["catch"](0);
                t.index.hideLoading(), console.error("[SlotsPage] 显示卡槽详情失败:", _context6.t2), _this7.showError("获取详情失败: " + _context6.t2.message);
              case 43:
              case "end":
                return _context6.stop();
            }
          }, _callee6, null, [[0, 40], [5, 13], [22, 30]]);
        }))();
      },
      switchToSlot: function switchToSlot(e) {
        var _this8 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee7() {
          return _regeneratorRuntime2().wrap(function _callee7$(_context7) {
            while (1) switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return _this8.setActiveSlot(e);
              case 3:
                t.index.showToast({
                  title: "\u5DF2\u5207\u6362\u5230\u5361\u69FD ".concat(e + 1),
                  icon: "success"
                });
                _context7.next = 9;
                break;
              case 6:
                _context7.prev = 6;
                _context7.t0 = _context7["catch"](0);
                console.error("[SlotsPage] 切换卡槽失败", _context7.t0), _this8.showError("切换失败: " + _context7.t0.message);
              case 9:
              case "end":
                return _context7.stop();
            }
          }, _callee7, null, [[0, 6]]);
        }))();
      },
      switchToPrevSlot: function switchToPrevSlot() {
        var _this9 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee8() {
          var t;
          return _regeneratorRuntime2().wrap(function _callee8$(_context8) {
            while (1) switch (_context8.prev = _context8.next) {
              case 0:
                if (_this9.isConnected) {
                  _context8.next = 2;
                  break;
                }
                return _context8.abrupt("return", void _this9.showConnectionRequired());
              case 2:
                t = _this9.activeSlot > 0 ? _this9.activeSlot - 1 : 15;
                _context8.next = 5;
                return _this9.switchToSlot(t);
              case 5:
              case "end":
                return _context8.stop();
            }
          }, _callee8);
        }))();
      },
      switchToNextSlot: function switchToNextSlot() {
        var _this10 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee9() {
          var t;
          return _regeneratorRuntime2().wrap(function _callee9$(_context9) {
            while (1) switch (_context9.prev = _context9.next) {
              case 0:
                if (_this10.isConnected) {
                  _context9.next = 2;
                  break;
                }
                return _context9.abrupt("return", void _this10.showConnectionRequired());
              case 2:
                t = _this10.activeSlot < 15 ? _this10.activeSlot + 1 : 0;
                _context9.next = 5;
                return _this10.switchToSlot(t);
              case 5:
              case "end":
                return _context9.stop();
            }
          }, _callee9);
        }))();
      },
      showGlobalSettings: function showGlobalSettings() {
        this.showGlobalSettingsPopup = !0;
      },
      closeGlobalSettings: function closeGlobalSettings() {
        this.showGlobalSettingsPopup = !1;
      },
      updateGlobalSetting: function updateGlobalSetting(t, e) {
        var s = _objectSpread2(_objectSpread2({}, this.slotSettings), {}, _defineProperty2({}, t, e));
        this.$store.commit("slots/SET_SLOT_SETTINGS", s), this.saveSlotSettings();
      },
      copyCardNumber: function copyCardNumber(e) {
        t.index.setClipboardData({
          data: e,
          success: function success() {
            t.index.showToast({
              title: "卡号已复制",
              icon: "success"
            });
          },
          fail: function fail() {
            t.index.showToast({
              title: "复制失败",
              icon: "error"
            });
          }
        });
      },
      clearSlotWithConfirm: function clearSlotWithConfirm(e) {
        var _this11 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee11() {
          var s;
          return _regeneratorRuntime2().wrap(function _callee11$(_context11) {
            while (1) switch (_context11.prev = _context11.next) {
              case 0:
                s = _this11.slots[e];
                s && _this11.isSlotUsed(s) ? t.index.showModal({
                  title: "确认清空",
                  content: "\u786E\u5B9A\u8981\u6E05\u7A7A\u5361\u69FD ".concat(e + 1, " (").concat(s.nickname || "\u5361\u69FD ".concat(e + 1), ") \u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u6062\u590D\u3002"),
                  confirmText: "清空",
                  confirmColor: "#ff4444",
                  success: function () {
                    var _success2 = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee10(s) {
                      return _regeneratorRuntime2().wrap(function _callee10$(_context10) {
                        while (1) switch (_context10.prev = _context10.next) {
                          case 0:
                            if (!s.confirm) {
                              _context10.next = 10;
                              break;
                            }
                            _context10.prev = 1;
                            _context10.next = 4;
                            return _this11.clearSlot(e);
                          case 4:
                            t.index.showToast({
                              title: "卡槽已清空",
                              icon: "success"
                            });
                            _context10.next = 10;
                            break;
                          case 7:
                            _context10.prev = 7;
                            _context10.t0 = _context10["catch"](1);
                            console.error("[SlotsPage] 清空卡槽失败", _context10.t0), _this11.showError("清空失败: " + _context10.t0.message);
                          case 10:
                          case "end":
                            return _context10.stop();
                        }
                      }, _callee10, null, [[1, 7]]);
                    }));
                    function success(_x2) {
                      return _success2.apply(this, arguments);
                    }
                    return success;
                  }()
                }) : t.index.showToast({
                  title: "卡槽已为空",
                  icon: "none"
                });
              case 2:
              case "end":
                return _context11.stop();
            }
          }, _callee11);
        }))();
      },
      addCard: function addCard(e) {
        var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "hf";
        t.index.navigateTo({
          url: "/pages/slot-edit/slot-edit?slotId=".concat(e, "&frequency=").concat(s, "&isNew=true")
        });
      },
      addCardFromPackage: function addCardFromPackage(e) {
        var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var o = "/pages/card-select/card-select?slotId=".concat(e, "&mode=deploy");
        s && (o += "&frequency=".concat(s)), t.index.navigateTo({
          url: o
        });
      },
      editSlotCard: function editSlotCard(e) {
        var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "hf";
        var o = this.slots[e];
        if (!o) return void this.showError("找不到指定的卡槽");
        "hf" === s && o.hf && "UNKNOWN" !== o.hf.tagType || "lf" === s && o.lf && "UNKNOWN" !== o.lf.tagType ? t.index.navigateTo({
          url: "/pages/slot-edit/slot-edit?slotId=".concat(e, "&frequency=").concat(s)
        }) : this.showError("\u8BE5\u5361\u69FD\u6CA1\u6709".concat(s.toUpperCase(), "\u5361\u7247"));
      },
      isSlotUsed: function isSlotUsed(t) {
        if (!t) return !1;
        var e = t.hf && t.hf.tagType && "UNKNOWN" !== t.hf.tagType,
          s = t.lf && t.lf.tagType && "UNKNOWN" !== t.lf.tagType;
        return e || s;
      },
      getTagTypeName: function getTagTypeName(t) {
        return e.ChameleonProtocol.getTagTypeName(t);
      },
      formatCardNumber: function formatCardNumber(t) {
        return t ? t.length > 12 ? t.substring(0, 4) + "..." + t.substring(t.length - 4) : t : "";
      },
      showConnectionRequired: function showConnectionRequired() {
        t.index.showModal({
          title: "需要连接设备",
          content: "此功能需要先连接 Chameleon 设备，是否立即连接？",
          confirmText: "去连接",
          success: function success(e) {
            e.confirm && t.index.navigateTo({
              url: "/pages/connect/connect"
            });
          }
        });
      },
      showError: function showError(e) {
        t.index.showModal({
          title: "错误",
          content: e,
          showCancel: !1
        });
      },
      editSlot: function editSlot(e, s) {
        if (!this.isConnected) return void this.showConnectionRequired();
        var o = this.slots[e];
        if (!o) return void this.showError("找不到指定的卡槽");
        console.log("[SlotsPage] 编辑卡槽:", {
          slotId: e,
          frequency: s,
          slotDisplayNumber: e + 1,
          slot: o
        });
        if (!("hf" === s && o.hf && "UNKNOWN" !== o.hf.tagType || "lf" === s && o.lf && "UNKNOWN" !== o.lf.tagType)) return void this.addNewCard(e, s);
        var i = "/pages/slot-edit/slot-edit?slotId=".concat(e, "&frequency=").concat(s, "&isNew=false");
        console.log("[SlotsPage] 跳转到编辑页面，URL:", i), t.index.navigateTo({
          url: i
        });
      },
      addNewCard: function addNewCard(e) {
        var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        this.isConnected ? s ? t.index.navigateTo({
          url: "/pages/slot-edit/slot-edit?slotId=".concat(e, "&frequency=").concat(s, "&isNew=true")
        }) : t.index.showActionSheet({
          itemList: ["添加HF卡片 (13.56MHz)", "添加LF卡片 (125KHz)"],
          success: function success(s) {
            var o = 0 === s.tapIndex ? "hf" : "lf";
            t.index.navigateTo({
              url: "/pages/slot-edit/slot-edit?slotId=".concat(e, "&frequency=").concat(o, "&isNew=true")
            });
          }
        }) : this.showConnectionRequired();
      }
    })
  };if (!Array) {
  (t.resolveComponent("uni-icons") + t.resolveComponent("uni-load-more"))();
}Math || (function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
} + function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.js";
})();var o = t._export_sfc(s, [["render", function (e, s, o, i, a, l) {
  return t.e({
    a: e.activeSlotData
  }, e.activeSlotData ? t.e({
    b: t.p({
      type: "checkmarkempty",
      size: "16",
      color: "#4CAF50"
    }),
    c: t.t(e.activeSlot + 1),
    d: t.t(e.activeSlotData.nickname || "\u5361\u69FD ".concat(e.activeSlot + 1)),
    e: e.activeSlotData.displayInfo.hfCard
  }, e.activeSlotData.displayInfo.hfCard ? {
    f: t.p({
      type: "card",
      size: "16",
      color: "#2196F3"
    }),
    g: t.t(l.getTagTypeName(e.activeSlotData.displayInfo.hfCard.type))
  } : {}, {
    h: e.activeSlotData.displayInfo.lfCard
  }, e.activeSlotData.displayInfo.lfCard ? {
    i: t.p({
      type: "wifi",
      size: "16",
      color: "#FF9800"
    }),
    j: t.t(l.getTagTypeName(e.activeSlotData.displayInfo.lfCard.type))
  } : {}) : {}, {
    k: t.p({
      type: "left",
      size: "30"
    }),
    l: t.o(function () {
      return l.switchToPrevSlot && l.switchToPrevSlot.apply(l, arguments);
    }),
    m: !e.isConnected,
    n: t.p({
      type: "right",
      size: "30"
    }),
    o: t.o(function () {
      return l.switchToNextSlot && l.switchToNextSlot.apply(l, arguments);
    }),
    p: !e.isConnected,
    q: e.isLoading ? 1 : "",
    r: t.p({
      type: "refresh",
      size: "30"
    }),
    s: t.o(function () {
      return l.refreshSlots && l.refreshSlots.apply(l, arguments);
    }),
    t: e.isLoading,
    v: t.t(l.statistics.usedSlots),
    w: t.t(l.statistics.emptySlots),
    x: e.isLoading
  }, e.isLoading ? {
    y: t.p({
      status: "loading",
      "content-text": "加载中..."
    })
  } : {
    z: t.f(e.validSlots, function (s, o, i) {
      return t.e({
        a: t.t(s.id + 1),
        b: t.t(s.nickname || "\u5361\u69FD ".concat(s.id + 1)),
        c: s.id === e.activeSlot
      }, s.id === e.activeSlot ? {
        d: "66e607d7-7-" + i,
        e: t.p({
          type: "checkmarkempty",
          size: "14",
          color: "#4CAF50"
        })
      } : (l.isSlotUsed(s), {}), {
        f: l.isSlotUsed(s),
        g: "66e607d7-8-" + i,
        h: t.o(function (t) {
          return l.showSlotSettings(s);
        }, s.id),
        i: s.hf && s.hf.tagType && "UNKNOWN" !== s.hf.tagType
      }, s.hf && s.hf.tagType && "UNKNOWN" !== s.hf.tagType ? {
        j: "66e607d7-9-" + i,
        k: t.p({
          type: "card",
          size: "16",
          color: "#2196F3"
        }),
        l: t.t(s.hf.enabled ? "启用" : "禁用"),
        m: s.hf.enabled ? 1 : "",
        n: s.hf.enabled ? "" : 1,
        o: s.hf.enabled,
        p: t.o(function (t) {
          return l.toggleSlotFrequency(s.id, "HF", t.detail.value);
        }, s.id),
        q: t.o(function () {}, s.id),
        r: t.t(s.hf.name || l.getTagTypeName(s.hf.tagType)),
        s: "66e607d7-10-" + i,
        t: t.p({
          type: "compose",
          size: "14",
          color: "#999"
        }),
        v: t.o(function (t) {
          return l.editSlot(s.id, "hf");
        }, s.id)
      } : {}, {
        w: s.lf && s.lf.tagType && "UNKNOWN" !== s.lf.tagType
      }, s.lf && s.lf.tagType && "UNKNOWN" !== s.lf.tagType ? {
        x: "66e607d7-11-" + i,
        y: t.p({
          type: "wifi",
          size: "16",
          color: "#FF9800"
        }),
        z: t.t(s.lf.enabled ? "启用" : "禁用"),
        A: s.lf.enabled ? 1 : "",
        B: s.lf.enabled ? "" : 1,
        C: s.lf.enabled,
        D: t.o(function (t) {
          return l.toggleSlotFrequency(s.id, "LF", t.detail.value);
        }, s.id),
        E: t.o(function () {}, s.id),
        F: t.t(s.lf.name || l.getTagTypeName(s.lf.tagType)),
        G: "66e607d7-12-" + i,
        H: t.p({
          type: "compose",
          size: "14",
          color: "#999"
        }),
        I: t.o(function (t) {
          return l.editSlot(s.id, "lf");
        }, s.id)
      } : {}, {
        J: !l.isSlotUsed(s)
      }, l.isSlotUsed(s) ? {} : {
        K: "66e607d7-13-" + i,
        L: t.p({
          type: "plus",
          size: "18",
          color: "#999"
        }),
        M: t.o(function (t) {
          return l.addNewCard(s.id);
        }, s.id)
      }, {
        N: s.id,
        O: s.id === e.activeSlot ? 1 : "",
        P: l.isSlotUsed(s) ? 1 : "",
        Q: s.enabled ? "" : 1,
        R: t.o(function (t) {
          return l.handleSlotClick(s);
        }, s.id)
      });
    }),
    A: t.p({
      type: "gear",
      size: "32",
      color: "#666"
    })
  }, {
    B: a.showGlobalSettingsPopup
  }, a.showGlobalSettingsPopup ? {
    C: t.p({
      type: "close",
      size: "18",
      color: "#666"
    }),
    D: t.o(function () {
      return l.closeGlobalSettings && l.closeGlobalSettings.apply(l, arguments);
    }),
    E: e.slotSettings.showEmptySlots,
    F: t.o(function (t) {
      return l.updateGlobalSetting("showEmptySlots", t.detail.value);
    }),
    G: e.slotSettings.quickSwitch,
    H: t.o(function (t) {
      return l.updateGlobalSetting("quickSwitch", t.detail.value);
    }),
    I: t.o(function () {}),
    J: t.o(function () {
      return l.closeGlobalSettings && l.closeGlobalSettings.apply(l, arguments);
    })
  } : {});
}], ["__scopeId", "data-v-66e607d7"]]);wx.createPage(o);