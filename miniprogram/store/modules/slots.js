var _toConsumableArray2 = require("../../@babel/runtime/helpers/toConsumableArray");var _defineProperty2 = require("../../@babel/runtime/helpers/defineProperty");var _createForOfIteratorHelper2 = require("../../@babel/runtime/helpers/createForOfIteratorHelper");var _regeneratorRuntime2 = require("../../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../../@babel/runtime/helpers/asyncToGenerator");var _objectSpread2 = require("../../@babel/runtime/helpers/objectSpread2");var _actions;var e = require("../../common/vendor.js"),
  t = require("../../utils/chameleon-protocol.js"),
  o = require("../../services/bluetooth.js"),
  l = {
    enabled: !1,
    tagType: t.TagType.UNKNOWN,
    uid: "",
    nickname: "",
    hf: {
      enabled: !1,
      tagType: t.TagType.UNKNOWN,
      name: "",
      data: null
    },
    lf: {
      enabled: !1,
      tagType: t.TagType.UNKNOWN,
      name: "",
      data: null
    },
    atqa: "",
    sak: "",
    ats: "",
    size: 0,
    dataHash: "",
    lastModified: null,
    syncStatus: "synced",
    readCount: 0,
    writeCount: 0,
    lastAccessed: null
  };function r(e) {
  var o = e.slots.filter(function (e) {
      return e.enabled && (e.tagType !== t.TagType.UNKNOWN || e.uid);
    }).length,
    l = {};
  e.slots.forEach(function (e) {
    if (e.tagType !== t.TagType.UNKNOWN) {
      var _o = t.ChameleonProtocol.getTagTypeName(e.tagType);
      l[_o] = (l[_o] || 0) + 1;
    }
  }), e.statistics = _objectSpread2(_objectSpread2({}, e.statistics), {}, {
    usedSlots: o,
    emptySlots: 16 - o,
    typeDistribution: l
  });
}var s = {
  namespaced: !0,
  state: {
    slots: Array.from({
      length: 16
    }, function (e, t) {
      return _objectSpread2(_objectSpread2({
        id: t
      }, l), {}, {
        nickname: "\u5361\u69FD ".concat(t + 1)
      });
    }),
    activeSlot: 0,
    isLoading: !1,
    isUpdating: !1,
    lastError: null,
    slotSettings: {
      autoSave: !0,
      quickSwitch: !0,
      showEmptySlots: !0,
      sortBy: "index",
      filterBy: "all"
    },
    selectedSlots: [],
    batchOperation: null,
    statistics: {
      totalSlots: 16,
      usedSlots: 0,
      emptySlots: 16,
      typeDistribution: {},
      lastSyncTime: null
    },
    mifareEmulatorSettings: {
      gen1aEnabled: !1,
      gen2Enabled: !1,
      antiCollEnabled: !1,
      detectionEnabled: !1,
      writeMode: "normal"
    }
  },
  mutations: {
    SET_SLOT_DATA: function SET_SLOT_DATA(e, _ref) {
      var t = _ref.slotId,
        o = _ref.data;
      t >= 0 && t < 16 && (e.slots[t] = _objectSpread2(_objectSpread2(_objectSpread2({}, e.slots[t]), o), {}, {
        lastModified: Date.now()
      }), r(e));
    },
    SET_SLOT_UID: function SET_SLOT_UID(e, _ref2) {
      var t = _ref2.slotId,
        o = _ref2.uid;
      t >= 0 && t < 16 && (e.slots[t].uid = o, e.slots[t].lastModified = Date.now(), r(e));
    },
    SET_SLOT_TAG_TYPE: function SET_SLOT_TAG_TYPE(e, _ref3) {
      var t = _ref3.slotId,
        o = _ref3.tagType;
      t >= 0 && t < 16 && (e.slots[t].tagType = o, e.slots[t].lastModified = Date.now(), r(e));
    },
    SET_SLOT_NICKNAME: function SET_SLOT_NICKNAME(e, _ref4) {
      var t = _ref4.slotId,
        o = _ref4.nickname;
      t >= 0 && t < 16 && (e.slots[t].nickname = o || "\u5361\u69FD ".concat(t + 1), e.slots[t].lastModified = Date.now());
    },
    SET_SLOT_ENABLED: function SET_SLOT_ENABLED(e, _ref5) {
      var t = _ref5.slotId,
        o = _ref5.enabled;
      t >= 0 && t < 16 && (e.slots[t].enabled = o, e.slots[t].lastModified = Date.now(), r(e));
    },
    SET_ACTIVE_SLOT: function SET_ACTIVE_SLOT(e, t) {
      t >= 0 && t < 16 && (e.activeSlot = t);
    },
    CLEAR_SLOT: function CLEAR_SLOT(e, t) {
      t >= 0 && t < 16 && (e.slots[t] = _objectSpread2(_objectSpread2({
        id: t
      }, l), {}, {
        nickname: "\u5361\u69FD ".concat(t + 1),
        lastModified: Date.now()
      }), r(e));
    },
    COPY_SLOT: function COPY_SLOT(e, _ref6) {
      var t = _ref6.fromSlot,
        o = _ref6.toSlot;
      if (t >= 0 && t < 16 && o >= 0 && o < 16 && t !== o) {
        var _l = e.slots[t];
        e.slots[o] = _objectSpread2(_objectSpread2({}, _l), {}, {
          id: o,
          nickname: _l.nickname + " (副本)",
          lastModified: Date.now()
        }), r(e);
      }
    },
    SWAP_SLOTS: function SWAP_SLOTS(e, _ref7) {
      var t = _ref7.slotA,
        o = _ref7.slotB;
      if (t >= 0 && t < 16 && o >= 0 && o < 16 && t !== o) {
        var _l2 = _objectSpread2({}, e.slots[t]),
          _s = _objectSpread2({}, e.slots[o]);
        e.slots[t] = _objectSpread2(_objectSpread2({}, _s), {}, {
          id: t,
          lastModified: Date.now()
        }), e.slots[o] = _objectSpread2(_objectSpread2({}, _l2), {}, {
          id: o,
          lastModified: Date.now()
        }), r(e);
      }
    },
    SET_LOADING: function SET_LOADING(e, t) {
      e.isLoading = t;
    },
    SET_UPDATING: function SET_UPDATING(e, t) {
      e.isUpdating = t;
    },
    SET_ERROR: function SET_ERROR(e, t) {
      e.lastError = t;
    },
    SET_SLOT_SETTINGS: function SET_SLOT_SETTINGS(e, t) {
      e.slotSettings = _objectSpread2(_objectSpread2({}, e.slotSettings), t);
    },
    SELECT_SLOT: function SELECT_SLOT(e, t) {
      e.selectedSlots.includes(t) || e.selectedSlots.push(t);
    },
    DESELECT_SLOT: function DESELECT_SLOT(e, t) {
      var o = e.selectedSlots.indexOf(t);
      o > -1 && e.selectedSlots.splice(o, 1);
    },
    CLEAR_SELECTION: function CLEAR_SELECTION(e) {
      e.selectedSlots = [];
    },
    SET_BATCH_OPERATION: function SET_BATCH_OPERATION(e, t) {
      e.batchOperation = t;
    },
    UPDATE_STATISTICS: function UPDATE_STATISTICS(e, t) {
      e.statistics = _objectSpread2(_objectSpread2({}, e.statistics), t);
    },
    BATCH_UPDATE_SLOTS: function BATCH_UPDATE_SLOTS(e, t) {
      t.forEach(function (_ref8) {
        var t = _ref8.slotId,
          o = _ref8.data;
        t >= 0 && t < 16 && (e.slots[t] = _objectSpread2(_objectSpread2(_objectSpread2({}, e.slots[t]), o), {}, {
          lastModified: Date.now()
        }));
      }), r(e);
    },
    UPDATE_SLOT_FREQUENCY_STATUS: function UPDATE_SLOT_FREQUENCY_STATUS(e, _ref9) {
      var t = _ref9.slotId,
        o = _ref9.frequency,
        l = _ref9.enabled;
      if (e.slots[t]) {
        var _r = o.toLowerCase();
        e.slots[t][_r] && (e.slots[t][_r].enabled = l);
      }
    },
    UPDATE_CARD_DETAILS: function UPDATE_CARD_DETAILS(e, _ref10) {
      var t = _ref10.slotId,
        o = _ref10.frequency,
        l = _ref10.details;
      if (e.slots[t]) {
        var _r2 = o.toLowerCase();
        e.slots[t][_r2] && (e.slots[t][_r2] = _objectSpread2(_objectSpread2(_objectSpread2({}, e.slots[t][_r2]), l), {}, {
          cardNumber: l.cardNumber
        }));
      }
    },
    SET_MIFARE_EMULATOR_SETTINGS: function SET_MIFARE_EMULATOR_SETTINGS(e, t) {
      e.mifareEmulatorSettings = t;
    },
    UPDATE_MIFARE_EMULATOR_SETTING: function UPDATE_MIFARE_EMULATOR_SETTING(e, _ref11) {
      var t = _ref11.key,
        o = _ref11.value;
      e.mifareEmulatorSettings && (e.mifareEmulatorSettings[t] = o);
    }
  },
  actions: (_actions = {
    loadAllSlots: function loadAllSlots(_ref12) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
        var e, r, _r3, a, i, _e, n, c, S, d, T, f;
        return _regeneratorRuntime2().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              e = _ref12.commit, r = _ref12.rootGetters;
              if (r["device/isConnected"]) {
                _context.next = 3;
                break;
              }
              throw new Error("设备未连接");
            case 3:
              _context.prev = 3;
              if (!(e("SET_LOADING", !0), e("SET_ERROR", null), "function" != typeof o.bluetoothService.getSlotInfo)) {
                _context.next = 6;
                break;
              }
              throw new Error("蓝牙服务getSlotInfo方法不存在");
            case 6:
              _context.next = 8;
              return o.bluetoothService.getSlotInfo();
            case 8:
              _r3 = _context.sent;
              _context.next = 11;
              return o.bluetoothService.getEnabledSlots();
            case 11:
              a = _context.sent;
              _context.t0 = e;
              _context.next = 15;
              return o.bluetoothService.getActiveSlot();
            case 15:
              _context.t1 = _context.sent;
              (0, _context.t0)("SET_ACTIVE_SLOT", _context.t1);
              i = [];
              _e = 0;
            case 19:
              if (!(_e < 16)) {
                _context.next = 51;
                break;
              }
              n = _r3[_e] || {
                id: _e,
                hfType: 0,
                lfType: 0,
                hfTagType: "UNKNOWN",
                lfTagType: "UNKNOWN"
              }, c = a[_e] || {
                id: _e,
                hf: !1,
                lf: !1,
                any: !1
              };
              S = "", d = "";
              _context.prev = 22;
              _context.t2 = c.hf && "UNKNOWN" !== n.hfTagType;
              if (!_context.t2) {
                _context.next = 28;
                break;
              }
              _context.next = 27;
              return o.bluetoothService.getSlotTagName(_e, t.TagFrequency.HF);
            case 27:
              S = _context.sent;
            case 28:
              _context.next = 33;
              break;
            case 30:
              _context.prev = 30;
              _context.t3 = _context["catch"](22);
              _context.t3.message.includes("Flash读取失败") || console.warn("[Slots] \u83B7\u53D6\u5361\u69FD ".concat(_e, " HF\u540D\u79F0\u5931\u8D25:"), _context.t3);
            case 33:
              _context.prev = 33;
              _context.t4 = c.lf && "UNKNOWN" !== n.lfTagType;
              if (!_context.t4) {
                _context.next = 39;
                break;
              }
              _context.next = 38;
              return o.bluetoothService.getSlotTagName(_e, t.TagFrequency.LF);
            case 38:
              d = _context.sent;
            case 39:
              _context.next = 44;
              break;
            case 41:
              _context.prev = 41;
              _context.t5 = _context["catch"](33);
              _context.t5.message.includes("Flash读取失败") || console.warn("[Slots] \u83B7\u53D6\u5361\u69FD ".concat(_e, " LF\u540D\u79F0\u5931\u8D25:"), _context.t5);
            case 44:
              T = "UNKNOWN";
              "UNKNOWN" !== n.hfTagType ? T = n.hfTagType : "UNKNOWN" !== n.lfTagType && (T = n.lfTagType);
              f = _objectSpread2(_objectSpread2({}, l), {}, {
                id: _e,
                enabled: c.any,
                hf: _objectSpread2(_objectSpread2({}, l.hf), {}, {
                  enabled: c.hf,
                  tagType: n.hfTagType,
                  name: S || ("UNKNOWN" !== n.hfTagType ? "" : "空")
                }),
                lf: _objectSpread2(_objectSpread2({}, l.lf), {}, {
                  enabled: c.lf,
                  tagType: n.lfTagType,
                  name: d || ("UNKNOWN" !== n.lfTagType ? "" : "空")
                }),
                tagType: T,
                nickname: S || d || "\u5361\u69FD ".concat(_e + 1)
              });
              i.push({
                slotId: _e,
                data: f
              });
            case 48:
              _e++;
              _context.next = 19;
              break;
            case 51:
              e("BATCH_UPDATE_SLOTS", i), console.log("[Slots] \u6210\u529F\u52A0\u8F7D ".concat(i.length, " \u4E2A\u5361\u69FD\u6570\u636E"));
              _context.next = 57;
              break;
            case 54:
              _context.prev = 54;
              _context.t6 = _context["catch"](3);
              throw console.error("[Slots] 加载卡槽数据失败:", _context.t6), e("SET_ERROR", _context.t6.message), _context.t6;
            case 57:
              _context.prev = 57;
              e("SET_LOADING", !1);
              return _context.finish(57);
            case 60:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[3, 54, 57, 60], [22, 30], [33, 41]]);
      }))();
    },
    loadSlot: function loadSlot(_ref13, l) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
        var e, o;
        return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              e = _ref13.commit, o = _ref13.rootGetters;
              if (o["device/isConnected"]) {
                _context2.next = 3;
                break;
              }
              throw new Error("设备未连接");
            case 3:
              if (t.ChameleonProtocol.isValidSlot(l)) {
                _context2.next = 5;
                break;
              }
              throw new Error("无效的卡槽编号");
            case 5:
              _context2.prev = 5;
              e("SET_LOADING", !0);
              e("SET_SLOT_DATA", {
                slotId: l,
                data: {
                  enabled: !0,
                  tagType: t.TagType.MIFARE_1024,
                  nickname: "\u5361\u69FD ".concat(l + 1),
                  uid: "",
                  data: null,
                  size: 0,
                  isReadOnly: !1
                }
              });
              _context2.next = 13;
              break;
            case 10:
              _context2.prev = 10;
              _context2.t0 = _context2["catch"](5);
              throw console.error("[Slots] \u52A0\u8F7D\u5361\u69FD ".concat(l, " \u5931\u8D25:"), _context2.t0), e("SET_ERROR", _context2.t0.message), _context2.t0;
            case 13:
              _context2.prev = 13;
              e("SET_LOADING", !1);
              return _context2.finish(13);
            case 16:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[5, 10, 13, 16]]);
      }))();
    },
    setActiveSlot: function setActiveSlot(_ref14, r) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
        var e, l;
        return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              e = _ref14.commit, l = _ref14.rootGetters;
              if (l["device/isConnected"]) {
                _context3.next = 3;
                break;
              }
              throw new Error("设备未连接");
            case 3:
              if (t.ChameleonProtocol.isValidSlot(r)) {
                _context3.next = 5;
                break;
              }
              throw new Error("无效的卡槽编号");
            case 5:
              _context3.prev = 5;
              if (!(e("SET_UPDATING", !0), "function" != typeof o.bluetoothService.setActiveSlot)) {
                _context3.next = 8;
                break;
              }
              throw new Error("蓝牙服务setActiveSlot方法不存在");
            case 8:
              _context3.next = 10;
              return o.bluetoothService.setActiveSlot(r);
            case 10:
              e("SET_ACTIVE_SLOT", r);
              console.log("[Slots] \u6210\u529F\u8BBE\u7F6E\u6D3B\u52A8\u5361\u69FD\u4E3A ".concat(r));
              _context3.next = 17;
              break;
            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3["catch"](5);
              throw console.error("[Slots] 设置活动卡槽失败:", _context3.t0), e("SET_ERROR", _context3.t0.message), _context3.t0;
            case 17:
              _context3.prev = 17;
              e("SET_UPDATING", !1);
              return _context3.finish(17);
            case 20:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[5, 14, 17, 20]]);
      }))();
    },
    updateSlotConfig: function updateSlotConfig(_ref15, _ref16) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4() {
        var e, o, l, r;
        return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              e = _ref15.commit, o = _ref15.rootGetters;
              l = _ref16.slotId, r = _ref16.config;
              if (o["device/isConnected"]) {
                _context4.next = 4;
                break;
              }
              throw new Error("设备未连接");
            case 4:
              if (t.ChameleonProtocol.isValidSlot(l)) {
                _context4.next = 6;
                break;
              }
              throw new Error("无效的卡槽编号");
            case 6:
              _context4.prev = 6;
              e("SET_UPDATING", !0), void 0 !== r.tagType && e("SET_SLOT_TAG_TYPE", {
                slotId: l,
                tagType: r.tagType
              }), void 0 !== r.enabled && e("SET_SLOT_ENABLED", {
                slotId: l,
                enabled: r.enabled
              }), void 0 !== r.nickname && e("SET_SLOT_NICKNAME", {
                slotId: l,
                nickname: r.nickname
              }), console.log("[Slots] \u6210\u529F\u66F4\u65B0\u5361\u69FD ".concat(l, " \u914D\u7F6E"));
              _context4.next = 13;
              break;
            case 10:
              _context4.prev = 10;
              _context4.t0 = _context4["catch"](6);
              throw console.error("[Slots] 更新卡槽配置失败:", _context4.t0), e("SET_ERROR", _context4.t0.message), _context4.t0;
            case 13:
              _context4.prev = 13;
              e("SET_UPDATING", !1);
              return _context4.finish(13);
            case 16:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[6, 10, 13, 16]]);
      }))();
    },
    clearSlot: function clearSlot(_ref17, r) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5() {
        var e, l;
        return _regeneratorRuntime2().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              e = _ref17.commit, l = _ref17.rootGetters;
              if (l["device/isConnected"]) {
                _context5.next = 3;
                break;
              }
              throw new Error("设备未连接");
            case 3:
              if (t.ChameleonProtocol.isValidSlot(r)) {
                _context5.next = 5;
                break;
              }
              throw new Error("无效的卡槽编号");
            case 5:
              _context5.prev = 5;
              if (!(e("SET_UPDATING", !0), "function" != typeof o.bluetoothService.clearSlot)) {
                _context5.next = 8;
                break;
              }
              throw new Error("蓝牙服务clearSlot方法不存在");
            case 8:
              _context5.next = 10;
              return o.bluetoothService.clearSlot(r);
            case 10:
              e("CLEAR_SLOT", r);
              console.log("[Slots] \u6210\u529F\u6E05\u7A7A\u5361\u69FD ".concat(r));
              _context5.next = 17;
              break;
            case 14:
              _context5.prev = 14;
              _context5.t0 = _context5["catch"](5);
              throw console.error("[Slots] 清空卡槽失败:", _context5.t0), e("SET_ERROR", _context5.t0.message), _context5.t0;
            case 17:
              _context5.prev = 17;
              e("SET_UPDATING", !1);
              return _context5.finish(17);
            case 20:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[5, 14, 17, 20]]);
      }))();
    },
    copySlot: function copySlot(_ref18, _ref19) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee6() {
        var e, o, l, r;
        return _regeneratorRuntime2().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              e = _ref18.commit, o = _ref18.rootGetters;
              l = _ref19.fromSlot, r = _ref19.toSlot;
              if (o["device/isConnected"]) {
                _context6.next = 4;
                break;
              }
              throw new Error("设备未连接");
            case 4:
              if (!(!t.ChameleonProtocol.isValidSlot(l) || !t.ChameleonProtocol.isValidSlot(r))) {
                _context6.next = 6;
                break;
              }
              throw new Error("无效的卡槽编号");
            case 6:
              if (!(l === r)) {
                _context6.next = 8;
                break;
              }
              throw new Error("源卡槽和目标卡槽不能相同");
            case 8:
              _context6.prev = 8;
              e("SET_UPDATING", !0), e("COPY_SLOT", {
                fromSlot: l,
                toSlot: r
              }), console.log("[Slots] \u6210\u529F\u590D\u5236\u5361\u69FD ".concat(l, " \u5230 ").concat(r));
              _context6.next = 15;
              break;
            case 12:
              _context6.prev = 12;
              _context6.t0 = _context6["catch"](8);
              throw console.error("[Slots] 复制卡槽失败:", _context6.t0), e("SET_ERROR", _context6.t0.message), _context6.t0;
            case 15:
              _context6.prev = 15;
              e("SET_UPDATING", !1);
              return _context6.finish(15);
            case 18:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[8, 12, 15, 18]]);
      }))();
    },
    batchOperation: function batchOperation(_ref20, _ref21) {
      var _this = this;
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee7() {
        var e, o, l, r, s, a, _iterator, _step, _e2;
        return _regeneratorRuntime2().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              e = _ref20.commit, o = _ref20.state, l = _ref20.rootGetters;
              r = _ref21.operation, s = _ref21.slotIds, a = _ref21.config;
              if (l["device/isConnected"]) {
                _context7.next = 4;
                break;
              }
              throw new Error("设备未连接");
            case 4:
              if (!(!Array.isArray(s) || 0 === s.length)) {
                _context7.next = 6;
                break;
              }
              throw new Error("请选择要操作的卡槽");
            case 6:
              _context7.prev = 6;
              e("SET_UPDATING", !0), e("SET_BATCH_OPERATION", r);
              _iterator = _createForOfIteratorHelper2(s);
              _context7.prev = 9;
              _iterator.s();
            case 11:
              if ((_step = _iterator.n()).done) {
                _context7.next = 32;
                break;
              }
              _e2 = _step.value;
              if (!t.ChameleonProtocol.isValidSlot(_e2)) {
                _context7.next = 30;
                break;
              }
              _context7.t0 = r;
              _context7.next = _context7.t0 === "clear" ? 17 : _context7.t0 === "enable" ? 20 : _context7.t0 === "disable" ? 23 : _context7.t0 === "setType" ? 26 : 30;
              break;
            case 17:
              _context7.next = 19;
              return _this.dispatch("slots/clearSlot", _e2);
            case 19:
              return _context7.abrupt("break", 30);
            case 20:
              _context7.next = 22;
              return _this.dispatch("slots/updateSlotConfig", {
                slotId: _e2,
                config: {
                  enabled: !0
                }
              });
            case 22:
              return _context7.abrupt("break", 30);
            case 23:
              _context7.next = 25;
              return _this.dispatch("slots/updateSlotConfig", {
                slotId: _e2,
                config: {
                  enabled: !1
                }
              });
            case 25:
              return _context7.abrupt("break", 30);
            case 26:
              _context7.t1 = a && a.tagType;
              if (!_context7.t1) {
                _context7.next = 30;
                break;
              }
              _context7.next = 30;
              return _this.dispatch("slots/updateSlotConfig", {
                slotId: _e2,
                config: {
                  tagType: a.tagType
                }
              });
            case 30:
              _context7.next = 11;
              break;
            case 32:
              _context7.next = 37;
              break;
            case 34:
              _context7.prev = 34;
              _context7.t2 = _context7["catch"](9);
              _iterator.e(_context7.t2);
            case 37:
              _context7.prev = 37;
              _iterator.f();
              return _context7.finish(37);
            case 40:
              e("CLEAR_SELECTION"), console.log("[Slots] \u6210\u529F\u6267\u884C\u6279\u91CF\u64CD\u4F5C: ".concat(r));
              _context7.next = 46;
              break;
            case 43:
              _context7.prev = 43;
              _context7.t3 = _context7["catch"](6);
              throw console.error("[Slots] 批量操作失败:", _context7.t3), e("SET_ERROR", _context7.t3.message), _context7.t3;
            case 46:
              _context7.prev = 46;
              e("SET_UPDATING", !1), e("SET_BATCH_OPERATION", null);
              return _context7.finish(46);
            case 49:
            case "end":
              return _context7.stop();
          }
        }, _callee7, null, [[6, 43, 46, 49], [9, 34, 37, 40]]);
      }))();
    },
    saveSlotSettings: function saveSlotSettings(_ref22) {
      var t = _ref22.commit,
        o = _ref22.state;
      try {
        e.index.setStorageSync("slotSettings", o.slotSettings), console.log("[Slots] 卡槽设置已保存");
      } catch (l) {
        console.error("[Slots] 保存卡槽设置失败:", l);
      }
    },
    loadSlotSettings: function loadSlotSettings(_ref23) {
      var t = _ref23.commit;
      try {
        var _o2 = e.index.getStorageSync("slotSettings");
        _o2 && (t("SET_SLOT_SETTINGS", _o2), console.log("[Slots] 卡槽设置已加载"));
      } catch (o) {
        console.error("[Slots] 加载卡槽设置失败:", o);
      }
    },
    enableSlotFrequency: function enableSlotFrequency(_ref24, _ref25) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee8() {
        var e, l, r, s, a;
        return _regeneratorRuntime2().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              e = _ref24.commit, l = _ref24.rootGetters;
              r = _ref25.slotId, s = _ref25.frequency, a = _ref25.enabled;
              if (l["device/isConnected"]) {
                _context8.next = 4;
                break;
              }
              throw new Error("设备未连接");
            case 4:
              if (t.ChameleonProtocol.isValidSlot(r)) {
                _context8.next = 6;
                break;
              }
              throw new Error("无效的卡槽编号");
            case 6:
              _context8.prev = 6;
              _context8.next = 9;
              return o.bluetoothService.enableSlotFrequency(r, s, a);
            case 9:
              e("UPDATE_SLOT_FREQUENCY_STATUS", {
                slotId: r,
                frequency: s.toLowerCase(),
                enabled: a
              });
              console.log("[SlotsStore] \u6210\u529F\u8BBE\u7F6E\u5361\u69FD".concat(r, "\u7684").concat(s, "\u9891\u7387\u542F\u7528\u72B6\u6001: ").concat(a));
              return _context8.abrupt("return", !0);
            case 14:
              _context8.prev = 14;
              _context8.t0 = _context8["catch"](6);
              throw console.error("[SlotsStore] 启用/禁用卡槽频率失败:", _context8.t0), e("SET_ERROR", _context8.t0.message), _context8.t0;
            case 17:
            case "end":
              return _context8.stop();
          }
        }, _callee8, null, [[6, 14]]);
      }))();
    },
    getMf1EmulatorSettings: function getMf1EmulatorSettings(_ref26, r) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee9() {
        var e, l, _e3;
        return _regeneratorRuntime2().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              e = _ref26.commit, l = _ref26.rootGetters;
              if (l["device/isConnected"]) {
                _context9.next = 3;
                break;
              }
              throw new Error("设备未连接");
            case 3:
              if (t.ChameleonProtocol.isValidSlot(r)) {
                _context9.next = 5;
                break;
              }
              throw new Error("无效的卡槽编号");
            case 5:
              _context9.prev = 5;
              _context9.next = 8;
              return o.bluetoothService.getMf1EmulatorSettings(r);
            case 8:
              _e3 = _context9.sent;
              return _context9.abrupt("return", (console.log("[SlotsStore] \u6210\u529F\u83B7\u53D6\u5361\u69FD".concat(r, "\u7684\u6A21\u62DF\u5668\u8BBE\u7F6E:"), _e3), _e3));
            case 12:
              _context9.prev = 12;
              _context9.t0 = _context9["catch"](5);
              throw console.error("[SlotsStore] \u83B7\u53D6\u5361\u69FD".concat(r, "\u6A21\u62DF\u5668\u8BBE\u7F6E\u5931\u8D25:"), _context9.t0), e("SET_ERROR", _context9.t0.message), _context9.t0;
            case 15:
            case "end":
              return _context9.stop();
          }
        }, _callee9, null, [[5, 12]]);
      }))();
    },
    setMifareGen1aMode: function setMifareGen1aMode(_ref27, _ref28) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee10() {
        var e, l, r, s;
        return _regeneratorRuntime2().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              e = _ref27.commit, l = _ref27.rootGetters;
              r = _ref28.slotId, s = _ref28.enabled;
              if (l["device/isConnected"]) {
                _context10.next = 4;
                break;
              }
              throw new Error("设备未连接");
            case 4:
              if (t.ChameleonProtocol.isValidSlot(r)) {
                _context10.next = 6;
                break;
              }
              throw new Error("无效的卡槽编号");
            case 6:
              _context10.prev = 6;
              _context10.next = 9;
              return o.bluetoothService.setMf1Gen1aMode(r, s);
            case 9:
              console.log("[SlotsStore] \u6210\u529F\u8BBE\u7F6E\u5361\u69FD".concat(r, "\u7684Gen1A\u6A21\u5F0F: ").concat(s));
              return _context10.abrupt("return", !0);
            case 13:
              _context10.prev = 13;
              _context10.t0 = _context10["catch"](6);
              throw console.error("[SlotsStore] \u8BBE\u7F6E\u5361\u69FD".concat(r, "Gen1A\u6A21\u5F0F\u5931\u8D25:"), _context10.t0), e("SET_ERROR", _context10.t0.message), _context10.t0;
            case 16:
            case "end":
              return _context10.stop();
          }
        }, _callee10, null, [[6, 13]]);
      }))();
    },
    setMifareGen2Mode: function setMifareGen2Mode(_ref29, _ref30) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee11() {
        var e, l, r, s;
        return _regeneratorRuntime2().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              e = _ref29.commit, l = _ref29.rootGetters;
              r = _ref30.slotId, s = _ref30.enabled;
              if (l["device/isConnected"]) {
                _context11.next = 4;
                break;
              }
              throw new Error("设备未连接");
            case 4:
              if (t.ChameleonProtocol.isValidSlot(r)) {
                _context11.next = 6;
                break;
              }
              throw new Error("无效的卡槽编号");
            case 6:
              _context11.prev = 6;
              _context11.next = 9;
              return o.bluetoothService.setMf1Gen2Mode(r, s);
            case 9:
              console.log("[SlotsStore] \u6210\u529F\u8BBE\u7F6E\u5361\u69FD".concat(r, "\u7684Gen2\u6A21\u5F0F: ").concat(s));
              return _context11.abrupt("return", !0);
            case 13:
              _context11.prev = 13;
              _context11.t0 = _context11["catch"](6);
              throw console.error("[SlotsStore] \u8BBE\u7F6E\u5361\u69FD".concat(r, "Gen2\u6A21\u5F0F\u5931\u8D25:"), _context11.t0), e("SET_ERROR", _context11.t0.message), _context11.t0;
            case 16:
            case "end":
              return _context11.stop();
          }
        }, _callee11, null, [[6, 13]]);
      }))();
    },
    getMifareEmulatorSettings: function getMifareEmulatorSettings(_ref31) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee12() {
        var e, t, _t, _t2;
        return _regeneratorRuntime2().wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              e = _ref31.commit, t = _ref31.rootGetters;
              if (t["device/isConnected"]) {
                _context12.next = 3;
                break;
              }
              throw new Error("设备未连接");
            case 3:
              _context12.prev = 3;
              if (!("function" != typeof o.bluetoothService.getMifareEmulatorSettings)) {
                _context12.next = 8;
                break;
              }
              console.warn("getMifareEmulatorSettings方法不存在，返回默认设置");
              _t = {
                gen1aEnabled: !1,
                gen2Enabled: !1,
                antiCollEnabled: !1,
                detectionEnabled: !1,
                writeMode: "normal"
              };
              return _context12.abrupt("return", (e("SET_MIFARE_EMULATOR_SETTINGS", _t), _t));
            case 8:
              _context12.next = 10;
              return o.bluetoothService.getMifareEmulatorSettings();
            case 10:
              _t2 = _context12.sent;
              return _context12.abrupt("return", (e("SET_MIFARE_EMULATOR_SETTINGS", _t2), _t2));
            case 14:
              _context12.prev = 14;
              _context12.t0 = _context12["catch"](3);
              throw console.error("[SlotsStore] 获取Mifare模拟器设置失败:", _context12.t0), _context12.t0;
            case 17:
            case "end":
              return _context12.stop();
          }
        }, _callee12, null, [[3, 14]]);
      }))();
    },
    setMifareWriteMode: function setMifareWriteMode(_ref32, l) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee13() {
        var e, t;
        return _regeneratorRuntime2().wrap(function _callee13$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              e = _ref32.commit, t = _ref32.rootGetters;
              if (t["device/isConnected"]) {
                _context13.next = 3;
                break;
              }
              throw new Error("设备未连接");
            case 3:
              _context13.prev = 3;
              if (!("function" != typeof o.bluetoothService.setMifareWriteMode)) {
                _context13.next = 6;
                break;
              }
              throw console.warn("setMifareWriteMode方法不存在"), new Error("蓝牙服务暂不支持写入模式设置");
            case 6:
              _context13.next = 8;
              return o.bluetoothService.setMifareWriteMode(l);
            case 8:
              e("UPDATE_MIFARE_EMULATOR_SETTING", {
                key: "writeMode",
                value: l
              });
              return _context13.abrupt("return", !0);
            case 12:
              _context13.prev = 12;
              _context13.t0 = _context13["catch"](3);
              throw console.error("[SlotsStore] 设置写入模式失败:", _context13.t0), _context13.t0;
            case 15:
            case "end":
              return _context13.stop();
          }
        }, _callee13, null, [[3, 12]]);
      }))();
    },
    getLfEmulatorSettings: function getLfEmulatorSettings(_ref33, r) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee14() {
        var e, l, _e4;
        return _regeneratorRuntime2().wrap(function _callee14$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              e = _ref33.commit, l = _ref33.rootGetters;
              if (l["device/isConnected"]) {
                _context14.next = 3;
                break;
              }
              throw new Error("设备未连接");
            case 3:
              if (t.ChameleonProtocol.isValidSlot(r)) {
                _context14.next = 5;
                break;
              }
              throw new Error("无效的卡槽编号");
            case 5:
              _context14.prev = 5;
              _context14.next = 8;
              return o.bluetoothService.getLfEmulatorSettings(r);
            case 8:
              _e4 = _context14.sent;
              return _context14.abrupt("return", (console.log("[SlotsStore] \u6210\u529F\u83B7\u53D6\u5361\u69FD".concat(r, "\u7684LF\u8BBE\u7F6E:"), _e4), _e4));
            case 12:
              _context14.prev = 12;
              _context14.t0 = _context14["catch"](5);
              throw console.error("[SlotsStore] \u83B7\u53D6\u5361\u69FD".concat(r, "LF\u8BBE\u7F6E\u5931\u8D25:"), _context14.t0), e("SET_ERROR", _context14.t0.message), _context14.t0;
            case 15:
            case "end":
              return _context14.stop();
          }
        }, _callee14, null, [[5, 12]]);
      }))();
    },
    setEM410XEmulatorID: function setEM410XEmulatorID(_ref34, _ref35) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee15() {
        var e, l, r, s;
        return _regeneratorRuntime2().wrap(function _callee15$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              e = _ref34.commit, l = _ref34.rootGetters;
              r = _ref35.slotId, s = _ref35.uid;
              if (l["device/isConnected"]) {
                _context15.next = 4;
                break;
              }
              throw new Error("设备未连接");
            case 4:
              if (t.ChameleonProtocol.isValidSlot(r)) {
                _context15.next = 6;
                break;
              }
              throw new Error("无效的卡槽编号");
            case 6:
              _context15.prev = 6;
              _context15.next = 9;
              return o.bluetoothService.setEM410XEmulatorID(r, s);
            case 9:
              e("UPDATE_SLOT_FREQUENCY_STATUS", {
                slotId: r,
                frequency: "lf",
                enabled: !0
              });
              console.log("[SlotsStore] \u6210\u529F\u8BBE\u7F6E\u5361\u69FD".concat(r, "\u7684EM410X ID\u4E3A: ").concat(s));
              _context15.next = 16;
              break;
            case 13:
              _context15.prev = 13;
              _context15.t0 = _context15["catch"](6);
              throw console.error("[SlotsStore] \u8BBE\u7F6E\u5361\u69FD".concat(r, "EM410X ID\u5931\u8D25:"), _context15.t0), e("SET_ERROR", _context15.t0.message), _context15.t0;
            case 16:
            case "end":
              return _context15.stop();
          }
        }, _callee15, null, [[6, 13]]);
      }))();
    },
    getHfCardUID: function getHfCardUID(_ref36, r) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee16() {
        var e, l, _e5;
        return _regeneratorRuntime2().wrap(function _callee16$(_context16) {
          while (1) switch (_context16.prev = _context16.next) {
            case 0:
              e = _ref36.commit, l = _ref36.rootGetters;
              if (l["device/isConnected"]) {
                _context16.next = 3;
                break;
              }
              throw new Error("设备未连接");
            case 3:
              if (t.ChameleonProtocol.isValidSlot(r)) {
                _context16.next = 5;
                break;
              }
              throw new Error("无效的卡槽编号");
            case 5:
              _context16.prev = 5;
              console.log("[SlotsStore] \u5F00\u59CB\u83B7\u53D6\u5361\u69FD".concat(r, "\u7684HF UID"));
              _context16.next = 9;
              return o.bluetoothService.getMf1AntiCollData(r);
            case 9:
              _e5 = _context16.sent;
              return _context16.abrupt("return", (console.log("[SlotsStore] \u6210\u529F\u83B7\u53D6\u5361\u69FD".concat(r, "\u7684HF UID:"), _e5.uid), _e5));
            case 13:
              _context16.prev = 13;
              _context16.t0 = _context16["catch"](5);
              throw console.warn("[SlotsStore] \u83B7\u53D6\u5361\u69FD".concat(r, "HF UID\u5931\u8D25:"), _context16.t0.message), _context16.t0;
            case 16:
            case "end":
              return _context16.stop();
          }
        }, _callee16, null, [[5, 13]]);
      }))();
    },
    getLfCardUID: function getLfCardUID(_ref37, r) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee17() {
        var e, l, _e6;
        return _regeneratorRuntime2().wrap(function _callee17$(_context17) {
          while (1) switch (_context17.prev = _context17.next) {
            case 0:
              e = _ref37.commit, l = _ref37.rootGetters;
              if (l["device/isConnected"]) {
                _context17.next = 3;
                break;
              }
              throw new Error("设备未连接");
            case 3:
              if (t.ChameleonProtocol.isValidSlot(r)) {
                _context17.next = 5;
                break;
              }
              throw new Error("无效的卡槽编号");
            case 5:
              _context17.prev = 5;
              console.log("[SlotsStore] \u5F00\u59CB\u83B7\u53D6\u5361\u69FD".concat(r, "\u7684LF UID"));
              _context17.next = 9;
              return o.bluetoothService.getEM410XEmulatorID(r);
            case 9:
              _e6 = _context17.sent;
              return _context17.abrupt("return", (console.log("[SlotsStore] \u6210\u529F\u83B7\u53D6\u5361\u69FD".concat(r, "\u7684LF UID:"), _e6), _e6));
            case 13:
              _context17.prev = 13;
              _context17.t0 = _context17["catch"](5);
              throw console.warn("[SlotsStore] \u83B7\u53D6\u5361\u69FD".concat(r, "LF UID\u5931\u8D25:"), _context17.t0.message), _context17.t0;
            case 16:
            case "end":
              return _context17.stop();
          }
        }, _callee17, null, [[5, 13]]);
      }))();
    }
  }, _defineProperty2(_actions, "setMifareWriteMode", function setMifareWriteMode(_ref38, _ref39) {
    return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee18() {
      var e, l, r, s;
      return _regeneratorRuntime2().wrap(function _callee18$(_context18) {
        while (1) switch (_context18.prev = _context18.next) {
          case 0:
            e = _ref38.commit, l = _ref38.rootGetters;
            r = _ref39.slotId, s = _ref39.mode;
            if (l["device/isConnected"]) {
              _context18.next = 4;
              break;
            }
            throw new Error("设备未连接");
          case 4:
            if (t.ChameleonProtocol.isValidSlot(r)) {
              _context18.next = 6;
              break;
            }
            throw new Error("无效的卡槽编号");
          case 6:
            _context18.prev = 6;
            _context18.next = 9;
            return o.bluetoothService.setMf1WriteMode(r, s);
          case 9:
            console.log("[SlotsStore] \u6210\u529F\u8BBE\u7F6E\u5361\u69FD".concat(r, "\u7684\u5199\u5165\u6A21\u5F0F: ").concat(s));
            return _context18.abrupt("return", !0);
          case 13:
            _context18.prev = 13;
            _context18.t0 = _context18["catch"](6);
            throw console.error("[SlotsStore] \u8BBE\u7F6E\u5361\u69FD".concat(r, "\u5199\u5165\u6A21\u5F0F\u5931\u8D25:"), _context18.t0), e("SET_ERROR", _context18.t0.message), _context18.t0;
          case 16:
          case "end":
            return _context18.stop();
        }
      }, _callee18, null, [[6, 13]]);
    }))();
  }), _defineProperty2(_actions, "setMifareAntiCollision", function setMifareAntiCollision(_ref40, _ref41) {
    return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee19() {
      var e, l, r, s;
      return _regeneratorRuntime2().wrap(function _callee19$(_context19) {
        while (1) switch (_context19.prev = _context19.next) {
          case 0:
            e = _ref40.commit, l = _ref40.rootGetters;
            r = _ref41.slotId, s = _ref41.cardData;
            if (l["device/isConnected"]) {
              _context19.next = 4;
              break;
            }
            throw new Error("设备未连接");
          case 4:
            if (t.ChameleonProtocol.isValidSlot(r)) {
              _context19.next = 6;
              break;
            }
            throw new Error("无效的卡槽编号");
          case 6:
            _context19.prev = 6;
            _context19.next = 9;
            return o.bluetoothService.setMf1AntiCollision(r, s);
          case 9:
            console.log("[SlotsStore] \u6210\u529F\u8BBE\u7F6E\u5361\u69FD".concat(r, "\u7684\u9632\u78B0\u649E\u6570\u636E"));
            return _context19.abrupt("return", !0);
          case 13:
            _context19.prev = 13;
            _context19.t0 = _context19["catch"](6);
            throw console.error("[SlotsStore] \u8BBE\u7F6E\u5361\u69FD".concat(r, "\u9632\u78B0\u649E\u6570\u636E\u5931\u8D25:"), _context19.t0), e("SET_ERROR", _context19.t0.message), _context19.t0;
          case 16:
          case "end":
            return _context19.stop();
        }
      }, _callee19, null, [[6, 13]]);
    }))();
  }), _defineProperty2(_actions, "setSlotTagName", function setSlotTagName(_ref42, _ref43) {
    return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee20() {
      var e, l, r, s, a, _require, _t3;
      return _regeneratorRuntime2().wrap(function _callee20$(_context20) {
        while (1) switch (_context20.prev = _context20.next) {
          case 0:
            e = _ref42.commit, l = _ref42.rootGetters;
            r = _ref43.slotId, s = _ref43.frequency, a = _ref43.name;
            if (l["device/isConnected"]) {
              _context20.next = 4;
              break;
            }
            throw new Error("设备未连接");
          case 4:
            if (t.ChameleonProtocol.isValidSlot(r)) {
              _context20.next = 6;
              break;
            }
            throw new Error("无效的卡槽编号");
          case 6:
            _context20.prev = 6;
            _context20.next = 9;
            return o.bluetoothService.setSlotTagName(r, s, a);
          case 9:
            console.log("[SlotsStore] \u6210\u529F\u8BBE\u7F6E\u5361\u69FD".concat(r, "\u7684\u540D\u79F0: ").concat(a));
            _require = require("../../utils/chameleon-protocol.js"), _t3 = _require.TagFrequency;
            return _context20.abrupt("return", ("hf" === s || s === _t3.HF ? e("UPDATE_CARD_DETAILS", {
              slotId: r,
              frequency: "hf",
              details: {
                name: a
              }
            }) : "lf" !== s && s !== _t3.LF || e("UPDATE_CARD_DETAILS", {
              slotId: r,
              frequency: "lf",
              details: {
                name: a
              }
            }), !0));
          case 14:
            _context20.prev = 14;
            _context20.t0 = _context20["catch"](6);
            throw console.error("[SlotsStore] \u8BBE\u7F6E\u5361\u69FD".concat(r, "\u540D\u79F0\u5931\u8D25:"), _context20.t0), e("SET_ERROR", _context20.t0.message), _context20.t0;
          case 17:
          case "end":
            return _context20.stop();
        }
      }, _callee20, null, [[6, 14]]);
    }))();
  }), _defineProperty2(_actions, "setMifareDetectionMode", function setMifareDetectionMode(_ref44, _ref45) {
    return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee21() {
      var e, l, r, s;
      return _regeneratorRuntime2().wrap(function _callee21$(_context21) {
        while (1) switch (_context21.prev = _context21.next) {
          case 0:
            e = _ref44.commit, l = _ref44.rootGetters;
            r = _ref45.slotId, s = _ref45.enabled;
            if (l["device/isConnected"]) {
              _context21.next = 4;
              break;
            }
            throw new Error("设备未连接");
          case 4:
            if (t.ChameleonProtocol.isValidSlot(r)) {
              _context21.next = 6;
              break;
            }
            throw new Error("无效的卡槽编号");
          case 6:
            _context21.prev = 6;
            _context21.next = 9;
            return o.bluetoothService.setMf1DetectionMode(r, s);
          case 9:
            console.log("[SlotsStore] \u6210\u529F\u8BBE\u7F6E\u5361\u69FD".concat(r, "\u7684\u68C0\u6D4B\u6A21\u5F0F: ").concat(s ? "启用" : "禁用"));
            return _context21.abrupt("return", !0);
          case 13:
            _context21.prev = 13;
            _context21.t0 = _context21["catch"](6);
            throw console.error("[SlotsStore] \u8BBE\u7F6E\u5361\u69FD".concat(r, "\u68C0\u6D4B\u6A21\u5F0F\u5931\u8D25:"), _context21.t0), e("SET_ERROR", _context21.t0.message), _context21.t0;
          case 16:
          case "end":
            return _context21.stop();
        }
      }, _callee21, null, [[6, 13]]);
    }))();
  }), _defineProperty2(_actions, "deployCardToSlot", function deployCardToSlot(_ref46, _ref47) {
    return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee22() {
      var e, l, r, s, a, _e7, _e8;
      return _regeneratorRuntime2().wrap(function _callee22$(_context22) {
        while (1) switch (_context22.prev = _context22.next) {
          case 0:
            e = _ref46.commit, l = _ref46.dispatch;
            r = _ref47.slotId, s = _ref47.cardData, a = _ref47.frequency;
            _context22.prev = 2;
            e("SET_UPDATING", !0);
            console.log("[SlotsStore] \u5F00\u59CB\u90E8\u7F72\u5361\u7247\u5230\u5361\u69FD".concat(r, ":"), s.name);
            _context22.next = 7;
            return l("setActiveSlot", r);
          case 7:
            _context22.next = 9;
            return o.bluetoothService.setSlotType(r, s.tag);
          case 9:
            _context22.next = 11;
            return o.bluetoothService.enableSlot(r, a, !0);
          case 11:
            _context22.next = 13;
            return o.bluetoothService.setSlotDataDefault(r, s.tag);
          case 13:
            if (!("hf" === a && t.ChameleonProtocol.isHighFrequency(s.tag))) {
              _context22.next = 17;
              break;
            }
            _e7 = {
              uid: s.uid.replace(/\s/g, ""),
              sak: "string" == typeof s.sak ? parseInt(s.sak.replace(/\s/g, ""), 16) : s.sak,
              atqa: s.atqa.replace(/\s/g, ""),
              ats: s.ats.replace(/\s/g, "")
            };
            _context22.next = 17;
            return l("setMifareAntiCollision", {
              slotId: r,
              cardData: _e7
            });
          case 17:
            if (!("lf" === a && s.tag === t.TagType.EM410X)) {
              _context22.next = 21;
              break;
            }
            _e8 = t.ChameleonProtocol.hexStringToBytes(s.uid.replace(/\s/g, ""));
            _context22.next = 21;
            return o.bluetoothService.setEM410XEmulatorID(_e8);
          case 21:
            _context22.next = 23;
            return o.bluetoothService.setSlotTagName(r, s.name || "\u5361\u69FD ".concat(r + 1), a);
          case 23:
            s.data && s.data.length > 0 && console.log("[SlotsStore] \u5361\u7247\u5305\u542B ".concat(s.data.length, " \u5757\u6570\u636E"));
            _context22.next = 26;
            return o.bluetoothService.saveSlotData();
          case 26:
            _context22.next = 28;
            return l("loadSlotData", r);
          case 28:
            console.log("[SlotsStore] \u6210\u529F\u90E8\u7F72\u5361\u7247 \"".concat(s.name, "\" \u5230\u5361\u69FD").concat(r));
            return _context22.abrupt("return", {
              success: !0
            });
          case 32:
            _context22.prev = 32;
            _context22.t0 = _context22["catch"](2);
            throw console.error("[SlotsStore] \u90E8\u7F72\u5361\u7247\u5230\u5361\u69FD".concat(r, "\u5931\u8D25:"), _context22.t0), e("SET_ERROR", _context22.t0.message), _context22.t0;
          case 35:
            _context22.prev = 35;
            e("SET_UPDATING", !1);
            return _context22.finish(35);
          case 38:
          case "end":
            return _context22.stop();
        }
      }, _callee22, null, [[2, 32, 35, 38]]);
    }))();
  }), _actions),
  getters: {
    getSlot: function getSlot(e) {
      return function (t) {
        return e.slots[t] || null;
      };
    },
    activeSlotData: function activeSlotData(e, t) {
      var o = t.validSlots[e.activeSlot];
      return o ? _objectSpread2(_objectSpread2({}, o), {}, {
        displayInfo: {
          hfCard: o.hf ? {
            name: o.hf.name,
            type: o.hf.tagType,
            cardNumber: o.hf.cardNumber,
            enabled: o.hf.enabled
          } : null,
          lfCard: o.lf ? {
            name: o.lf.name,
            type: o.lf.tagType,
            cardNumber: o.lf.cardNumber,
            enabled: o.lf.enabled
          } : null
        }
      }) : null;
    },
    usedSlots: function usedSlots(e) {
      return e.slots.filter(function (e) {
        return e.enabled && (e.tagType !== t.TagType.UNKNOWN || e.uid);
      });
    },
    emptySlots: function emptySlots(e) {
      return e.slots.filter(function (e) {
        return e.tagType === t.TagType.UNKNOWN && !e.uid;
      });
    },
    slotsByType: function slotsByType(e) {
      return function (t) {
        return e.slots.filter(function (e) {
          return e.tagType === t;
        });
      };
    },
    enabledSlots: function enabledSlots(e) {
      return e.slots.filter(function (e) {
        return e.enabled;
      });
    },
    disabledSlots: function disabledSlots(e) {
      return e.slots.filter(function (e) {
        return !e.enabled;
      });
    },
    filteredSortedSlots: function filteredSortedSlots(e) {
      var o = _toConsumableArray2(e.slots);
      switch (e.slotSettings.filterBy) {
        case "used":
          o = o.filter(function (e) {
            return e.enabled && (e.tagType !== t.TagType.UNKNOWN || e.uid);
          });
          break;
        case "empty":
          o = o.filter(function (e) {
            return e.tagType === t.TagType.UNKNOWN && !e.uid;
          });
          break;
        case "enabled":
          o = o.filter(function (e) {
            return e.enabled;
          });
          break;
        case "disabled":
          o = o.filter(function (e) {
            return !e.enabled;
          });
      }
      switch (e.slotSettings.sortBy) {
        case "name":
          o.sort(function (e, t) {
            return e.nickname.localeCompare(t.nickname);
          });
          break;
        case "type":
          o.sort(function (e, t) {
            return e.tagType - t.tagType;
          });
          break;
        case "lastModified":
          o.sort(function (e, t) {
            return (t.lastModified || 0) - (e.lastModified || 0);
          });
          break;
        default:
          o.sort(function (e, t) {
            return e.id - t.id;
          });
      }
      return o;
    },
    slotStatistics: function slotStatistics(e, t) {
      var o = t.validSlots;
      var l = 0,
        r = 0,
        s = 0;
      return o.forEach(function (e) {
        var t = e.hf && e.hf.enabled,
          o = e.lf && e.lf.enabled;
        (t || o) && l++, t && r++, o && s++;
      }), {
        usedSlots: l,
        emptySlots: 16 - l,
        hfSlots: r,
        lfSlots: s,
        totalSlots: 16
      };
    },
    selectedSlots: function selectedSlots(e) {
      return e.selectedSlots;
    },
    hasSelection: function hasSelection(e) {
      return e.selectedSlots.length > 0;
    },
    slotSettings: function slotSettings(e) {
      return e.slotSettings;
    },
    isLoading: function isLoading(e) {
      return e.isLoading;
    },
    isUpdating: function isUpdating(e) {
      return e.isUpdating;
    },
    lastError: function lastError(e) {
      return e.lastError;
    },
    validSlots: function validSlots(e) {
      var _require2 = require("../../utils/chameleon-protocol.js"),
        t = _require2.ChameleonProtocol;
      return e.slots.map(function (e) {
        var o = _objectSpread2({}, e);
        return e.hf && t.isValidTagType(e.hf.tagType) ? (o.hf = _objectSpread2({}, e.hf), e.hf.uid && (o.hf.cardNumber = t.extractICCardNumber(e.hf.uid))) : o.hf = null, e.lf && t.isValidTagType(e.lf.tagType) ? (o.lf = _objectSpread2({}, e.lf), e.lf.uid && (o.lf.cardNumber = t.extractIDCardNumber(e.lf.uid))) : o.lf = null, o;
      });
    }
  }
};exports.slots = s;