require("../../@babel/runtime/helpers/Arrayincludes");var _toConsumableArray2 = require("../../@babel/runtime/helpers/toConsumableArray");var _createForOfIteratorHelper2 = require("../../@babel/runtime/helpers/createForOfIteratorHelper");var _regeneratorRuntime2 = require("../../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../../@babel/runtime/helpers/asyncToGenerator");var _objectWithoutProperties2 = require("../../@babel/runtime/helpers/objectWithoutProperties");var _excluded = ["data"];var e = require("../../common/vendor.js"),
  t = require("../../utils/card-save.js"),
  r = require("../../utils/chameleon-protocol.js");function a(e) {
  e.statistics.totalCards = e.cards.length, e.statistics.totalSize = e.cards.reduce(function (e, t) {
    return e + (t.data ? JSON.stringify(t.data).length : 0);
  }, 0);
  var t = e.cards.reduce(function (e, t) {
    var r = new Date(t.modifiedAt || t.createdAt);
    return r > e ? r : e;
  }, new Date(0));
  e.statistics.lastModified = t.getTime() > 0 ? t.toISOString() : null, e.statistics.hfCards = e.cards.filter(function (e) {
    return 2 === e.getFrequency();
  }).length, e.statistics.lfCards = e.cards.filter(function (e) {
    return 1 === e.getFrequency();
  }).length;
}function s(e) {
  var t = {
    all: e.cards.length,
    hf: 0,
    lf: 0,
    mifare_classic: 0,
    mifare_ultralight: 0,
    em410x: 0,
    ntag: 0,
    other: 0
  };
  e.cards.forEach(function (e) {
    2 === e.getFrequency() ? t.hf++ : 1 === e.getFrequency() && t.lf++, e.isMifareClassic() && t.mifare_classic++, e.isMifareUltralight() && t.mifare_ultralight++, e.tag === r.TagType.EM410X && t.em410x++, [r.TagType.NTAG_213, r.TagType.NTAG_215, r.TagType.NTAG_216].includes(e.tag) && t.ntag++;
  }), console.log("counts", t), e.categories.forEach(function (e) {
    e.count = t[e.id] || 0;
  });
}var o = {
  namespaced: !0,
  state: {
    cards: [],
    selectedCard: null,
    selectedCards: [],
    currentCard: null,
    categories: [{
      id: "all",
      name: "全部",
      icon: "list",
      count: 0
    }, {
      id: "hf",
      name: "HF卡片",
      icon: "creditcard",
      count: 0
    }, {
      id: "lf",
      name: "LF卡片",
      icon: "wifi",
      count: 0
    }, {
      id: "mifare_classic",
      name: "Mifare Classic",
      icon: "creditcard",
      count: 0
    }, {
      id: "mifare_ultralight",
      name: "Mifare Ultralight",
      icon: "tag",
      count: 0
    }, {
      id: "em410x",
      name: "EM410X",
      icon: "key",
      count: 0
    }, {
      id: "ntag",
      name: "NTAG",
      icon: "chip",
      count: 0
    }, {
      id: "other",
      name: "其他",
      icon: "dots",
      count: 0
    }],
    currentCategory: "all",
    searchKeyword: "",
    viewMode: "list",
    sortBy: "modified",
    sortOrder: "desc",
    tags: [],
    selectedTags: [],
    loading: !1,
    error: null,
    syncing: !1,
    statistics: {
      totalCards: 0,
      totalSize: 0,
      lastModified: null,
      hfCards: 0,
      lfCards: 0
    }
  },
  mutations: {
    SET_CARDS: function SET_CARDS(e, r) {
      e.cards = r.map(function (e) {
        return e instanceof t.CardSave ? e : t.CardSave.fromObject(e);
      }), a(e), s(e);
    },
    ADD_CARD: function ADD_CARD(e, r) {
      var o = r instanceof t.CardSave ? r : new t.CardSave(r);
      e.cards.unshift(o), a(e), s(e);
    },
    UPDATE_CARD: function UPDATE_CARD(e, _ref) {
      var t = _ref.id,
        r = _ref.updates;
      var o = e.cards.findIndex(function (e) {
        return e.id === t;
      });
      if (-1 !== o) {
        var _t = e.cards[o];
        if (r.data) {
          console.log("🔍 UPDATE_CARD - 更新前卡片数据块数量:", _t.data ? _t.data.length : 0), console.log("🔍 UPDATE_CARD - 接收到的数据块数量:", r.data.length), _t.data = r.data.map(function (e, t) {
            return e instanceof Uint8Array ? e : Array.isArray(e) ? new Uint8Array(e) : (console.warn("\uD83D\uDD0D UPDATE_CARD - \u5757".concat(t, "\u683C\u5F0F\u5F02\u5E38:"), e), new Uint8Array([]));
          }), console.log("🔍 UPDATE_CARD - 更新后卡片数据块数量:", _t.data.length);
          var _e = r.data,
            _a = _objectWithoutProperties2(r, _excluded);
          Object.assign(_t, _a);
        } else Object.assign(_t, r);
        _t.touch(), e.cards.splice(o, 1, _t), a(e), s(e);
      }
    },
    DELETE_CARD: function DELETE_CARD(e, t) {
      var r = e.cards.findIndex(function (e) {
        return e.id === t;
      });
      -1 !== r && (e.cards.splice(r, 1), a(e), s(e));
    },
    DELETE_CARDS: function DELETE_CARDS(e, t) {
      e.cards = e.cards.filter(function (e) {
        return !t.includes(e.id);
      }), a(e), s(e);
    },
    SET_ERROR: function SET_ERROR(e, t) {
      e.error = t;
    },
    SET_SELECTED_CARDS: function SET_SELECTED_CARDS(e, t) {
      e.selectedCards = t;
    },
    TOGGLE_CARD_SELECTION: function TOGGLE_CARD_SELECTION(e, t) {
      var r = e.selectedCards.indexOf(t);
      -1 === r ? e.selectedCards.push(t) : e.selectedCards.splice(r, 1);
    },
    CLEAR_SELECTION: function CLEAR_SELECTION(e) {
      e.selectedCards = [];
    },
    SET_CURRENT_CARD: function SET_CURRENT_CARD(e, t) {
      e.currentCard = t;
    },
    SET_SELECTED_CARD: function SET_SELECTED_CARD(e, t) {
      e.selectedCard = t;
    },
    SET_CURRENT_CATEGORY: function SET_CURRENT_CATEGORY(e, t) {
      e.currentCategory = t;
    },
    SET_SEARCH_KEYWORD: function SET_SEARCH_KEYWORD(e, t) {
      e.searchKeyword = t;
    },
    SET_VIEW_MODE: function SET_VIEW_MODE(t, r) {
      t.viewMode = r, e.index.setStorageSync("cards_view_mode", r);
    },
    SET_SORT: function SET_SORT(t, _ref2) {
      var r = _ref2.sortBy,
        a = _ref2.sortOrder;
      t.sortBy = r, t.sortOrder = a, e.index.setStorageSync("cards_sort", {
        sortBy: r,
        sortOrder: a
      });
    },
    SET_TAGS: function SET_TAGS(e, t) {
      e.tags = t;
    },
    ADD_TAG: function ADD_TAG(e, t) {
      e.tags.find(function (e) {
        return e.name === t.name;
      }) || e.tags.push({
        id: Date.now().toString(36),
        name: t.name,
        color: t.color || "#007AFF",
        count: 0
      });
    },
    SET_SELECTED_TAGS: function SET_SELECTED_TAGS(e, t) {
      e.selectedTags = t;
    },
    SET_LOADING: function SET_LOADING(e, t) {
      e.loading = t;
    },
    SET_SYNCING: function SET_SYNCING(e, t) {
      e.syncing = t;
    }
  },
  actions: {
    initCards: function initCards(_ref3) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
        var t, r, _a2, _s;
        return _regeneratorRuntime2().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              t = _ref3.commit, r = _ref3.dispatch;
              t("SET_LOADING", !0);
              _context.prev = 2;
              _context.next = 5;
              return r("loadCardsFromStorage");
            case 5:
              _a2 = e.index.getStorageSync("cards_view_mode") || "grid", _s = e.index.getStorageSync("cards_sort") || {
                sortBy: "modified",
                sortOrder: "desc"
              };
              t("SET_VIEW_MODE", _a2), t("SET_SORT", _s), console.log("✅ 卡包数据初始化完成");
              _context.next = 12;
              break;
            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](2);
              console.error("❌ 卡包数据初始化失败:", _context.t0), e.index.showToast({
                title: "加载卡包数据失败",
                icon: "error"
              });
            case 12:
              _context.prev = 12;
              t("SET_LOADING", !1);
              return _context.finish(12);
            case 15:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[2, 9, 12, 15]]);
      }))();
    },
    loadCardsFromStorage: function loadCardsFromStorage(_ref4) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
        var r, _s2, _o, _e2, c;
        return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              r = _ref4.commit;
              _context2.prev = 1;
              _s2 = e.index.getStorageSync("chameleon_cards");
              _o = [];
              if (_s2) try {
                _e2 = JSON.parse(_s2);
                Array.isArray(_e2) ? _o = _e2.map(function (e) {
                  return t.CardSave.fromObject(e);
                }) : (console.warn("⚠️ 存储的卡片数据格式不正确，重置为空数组"), _o = []);
              } catch (a) {
                console.error("❌ JSON解析失败，清除损坏的数据:", a), e.index.removeStorageSync("chameleon_cards"), _o = [];
              }
              c = e.index.getStorageSync("chameleon_tags") || [];
              return _context2.abrupt("return", (r("SET_CARDS", _o), r("SET_TAGS", c), console.log("\uD83D\uDCC2 \u4ECE\u672C\u5730\u5B58\u50A8\u52A0\u8F7D\u4E86 ".concat(_o.length, " \u5F20\u5361\u7247")), _o));
            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2["catch"](1);
              return _context2.abrupt("return", (console.error("❌ 从本地存储加载卡片失败:", _context2.t0), r("SET_CARDS", []), r("SET_TAGS", []), []));
            case 12:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[1, 9]]);
      }))();
    },
    saveCardsToStorage: function saveCardsToStorage(_ref5) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
        var t, _r;
        return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              t = _ref5.state;
              _context3.prev = 1;
              _r = t.cards.map(function (e) {
                return e.toObject();
              });
              e.index.setStorageSync("chameleon_cards", JSON.stringify(_r)), e.index.setStorageSync("chameleon_tags", t.tags), console.log("\uD83D\uDCBE \u5DF2\u4FDD\u5B58 ".concat(t.cards.length, " \u5F20\u5361\u7247\u5230\u672C\u5730\u5B58\u50A8"));
              _context3.next = 9;
              break;
            case 6:
              _context3.prev = 6;
              _context3.t0 = _context3["catch"](1);
              throw console.error("❌ 保存卡片到本地存储失败:", _context3.t0), _context3.t0;
            case 9:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[1, 6]]);
      }))();
    },
    createCard: function createCard(_ref6, s) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4() {
        var r, a, _o2, c;
        return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              r = _ref6.commit, a = _ref6.dispatch;
              _context4.prev = 1;
              _o2 = s instanceof t.CardSave ? s : new t.CardSave(s), c = _o2.validate();
              if (c.isValid) {
                _context4.next = 5;
                break;
              }
              throw new Error("\u5361\u7247\u6570\u636E\u65E0\u6548: ".concat(c.errors.join(", ")));
            case 5:
              r("ADD_CARD", _o2);
              _context4.next = 8;
              return a("saveCardsToStorage");
            case 8:
              e.index.showToast({
                title: "卡片创建成功",
                icon: "success"
              });
              console.log("[Cards] \u521B\u5EFA\u5361\u7247: ".concat(_o2.name));
              return _context4.abrupt("return", {
                success: !0,
                card: _o2
              });
            case 13:
              _context4.prev = 13;
              _context4.t0 = _context4["catch"](1);
              throw console.error("❌ 创建卡片失败:", _context4.t0), r("SET_ERROR", _context4.t0.message), e.index.showToast({
                title: "创建卡片失败",
                icon: "error"
              }), _context4.t0;
            case 16:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[1, 13]]);
      }))();
    },
    updateCard: function updateCard(_ref7, _ref8) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5() {
        var t, r, a, s;
        return _regeneratorRuntime2().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              t = _ref7.commit, r = _ref7.dispatch;
              a = _ref8.id, s = _ref8.updates;
              _context5.prev = 2;
              t("UPDATE_CARD", {
                id: a,
                updates: s
              });
              _context5.next = 6;
              return r("saveCardsToStorage");
            case 6:
              e.index.showToast({
                title: "卡片更新成功",
                icon: "success"
              });
              _context5.next = 12;
              break;
            case 9:
              _context5.prev = 9;
              _context5.t0 = _context5["catch"](2);
              throw console.error("❌ 更新卡片失败:", _context5.t0), e.index.showToast({
                title: "更新卡片失败",
                icon: "error"
              }), _context5.t0;
            case 12:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[2, 9]]);
      }))();
    },
    deleteCard: function deleteCard(_ref9, a) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee6() {
        var t, r;
        return _regeneratorRuntime2().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              t = _ref9.commit, r = _ref9.dispatch;
              _context6.prev = 1;
              t("DELETE_CARD", a);
              _context6.next = 5;
              return r("saveCardsToStorage");
            case 5:
              e.index.showToast({
                title: "卡片删除成功",
                icon: "success"
              });
              _context6.next = 11;
              break;
            case 8:
              _context6.prev = 8;
              _context6.t0 = _context6["catch"](1);
              throw console.error("❌ 删除卡片失败:", _context6.t0), e.index.showToast({
                title: "删除卡片失败",
                icon: "error"
              }), _context6.t0;
            case 11:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[1, 8]]);
      }))();
    },
    deleteCards: function deleteCards(_ref10, a) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee7() {
        var t, r;
        return _regeneratorRuntime2().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              t = _ref10.commit, r = _ref10.dispatch;
              _context7.prev = 1;
              t("DELETE_CARDS", a);
              _context7.next = 5;
              return r("saveCardsToStorage");
            case 5:
              e.index.showToast({
                title: "\u5DF2\u5220\u9664 ".concat(a.length, " \u5F20\u5361\u7247"),
                icon: "success"
              });
              _context7.next = 11;
              break;
            case 8:
              _context7.prev = 8;
              _context7.t0 = _context7["catch"](1);
              throw console.error("❌ 批量删除卡片失败:", _context7.t0), e.index.showToast({
                title: "删除卡片失败",
                icon: "error"
              }), _context7.t0;
            case 11:
            case "end":
              return _context7.stop();
          }
        }, _callee7, null, [[1, 8]]);
      }))();
    },
    deployCardToSlot: function deployCardToSlot(_ref11, _ref12) {
      var _this = this;
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee8() {
        var t, r, a, _s3;
        return _regeneratorRuntime2().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              t = _ref11.dispatch;
              r = _ref12.cardId, a = _ref12.slotIndex;
              _context8.prev = 2;
              _s3 = _this.state.cards.cards.find(function (e) {
                return e.id === r;
              });
              if (_s3) {
                _context8.next = 6;
                break;
              }
              throw new Error("卡片不存在");
            case 6:
              _context8.next = 8;
              return t("slots/updateSlot", {
                index: a,
                updates: {
                  name: _s3.name,
                  type: _s3.type,
                  data: _s3.data,
                  enabled: !0
                }
              }, {
                root: !0
              });
            case 8:
              e.index.showToast({
                title: "\u5361\u7247\u5DF2\u90E8\u7F72\u5230\u5361\u69FD ".concat(a + 1),
                icon: "success"
              });
              _context8.next = 14;
              break;
            case 11:
              _context8.prev = 11;
              _context8.t0 = _context8["catch"](2);
              throw console.error("❌ 部署卡片到卡槽失败:", _context8.t0), e.index.showToast({
                title: "部署失败",
                icon: "error"
              }), _context8.t0;
            case 14:
            case "end":
              return _context8.stop();
          }
        }, _callee8, null, [[2, 11]]);
      }))();
    },
    importCardFromSlot: function importCardFromSlot(_ref13, _ref14) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee9() {
        var r, a, s, _o3;
        return _regeneratorRuntime2().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              r = _ref13.dispatch;
              a = _ref14.slotData, s = _ref14.slotId;
              _context9.prev = 2;
              _o3 = t.CardSaveUtils.fromSlotData(a, s);
              _context9.next = 6;
              return r("createCard", _o3);
            case 6:
              e.index.showToast({
                title: "\u5DF2\u4ECE\u5361\u69FD ".concat(s, " \u5BFC\u5165\u5361\u7247"),
                icon: "success"
              });
              return _context9.abrupt("return", _o3);
            case 10:
              _context9.prev = 10;
              _context9.t0 = _context9["catch"](2);
              throw console.error("❌ 从卡槽导入卡片失败:", _context9.t0), e.index.showToast({
                title: "导入失败",
                icon: "error"
              }), _context9.t0;
            case 13:
            case "end":
              return _context9.stop();
          }
        }, _callee9, null, [[2, 10]]);
      }))();
    },
    cloneCard: function cloneCard(_ref15, _ref16) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee10() {
        var t, r, a, s, _o4, c;
        return _regeneratorRuntime2().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              t = _ref15.dispatch, r = _ref15.getters;
              a = _ref16.id, s = _ref16.newName;
              _context10.prev = 2;
              _o4 = r.getCardById(a);
              if (_o4) {
                _context10.next = 6;
                break;
              }
              throw new Error("找不到要克隆的卡片");
            case 6:
              c = _o4.clone(s);
              _context10.next = 9;
              return t("createCard", c);
            case 9:
              e.index.showToast({
                title: "卡片克隆成功",
                icon: "success"
              });
              console.log("[Cards] \u514B\u9686\u5361\u7247: ".concat(_o4.name, " -> ").concat(c.name));
              return _context10.abrupt("return", c);
            case 14:
              _context10.prev = 14;
              _context10.t0 = _context10["catch"](2);
              throw console.error("[Cards] 克隆卡片失败:", _context10.t0), _context10.t0;
            case 17:
            case "end":
              return _context10.stop();
          }
        }, _callee10, null, [[2, 14]]);
      }))();
    },
    setSearchQuery: function setSearchQuery(_ref17, t) {
      var e = _ref17.commit;
      e("SET_SEARCH_KEYWORD", t);
    },
    selectCards: function selectCards(_ref18, t) {
      var e = _ref18.commit;
      e("SET_SELECTED_CARDS", t);
    },
    toggleCardSelection: function toggleCardSelection(_ref19, t) {
      var e = _ref19.commit;
      e("TOGGLE_CARD_SELECTION", t);
    },
    clearSelection: function clearSelection(_ref20) {
      var e = _ref20.commit;
      e("CLEAR_SELECTION");
    },
    setCurrentCard: function setCurrentCard(_ref21, t) {
      var e = _ref21.commit;
      e("SET_CURRENT_CARD", t);
    },
    clearError: function clearError(_ref22) {
      var e = _ref22.commit;
      e("SET_ERROR", null);
    },
    validateCards: function validateCards(_ref23) {
      var e = _ref23.state;
      return t.CardSaveUtils.validateCards(e.cards);
    },
    exportCards: function exportCards(_ref24, _ref25) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee11() {
        var e, t, _ref25$format, r, _require, _a3, _s4, _o5;
        return _regeneratorRuntime2().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              e = _ref24.state;
              t = _ref25.cardIds, _ref25$format = _ref25.format, r = _ref25$format === void 0 ? "json" : _ref25$format;
              _context11.prev = 2;
              _require = require("../../utils/card-import-export.js"), _a3 = _require.CardImportExport;
              if (!(_s4 = t && t.length > 0 ? e.cards.filter(function (e) {
                return t.includes(e.id);
              }) : e.cards, 0 === _s4.length)) {
                _context11.next = 6;
                break;
              }
              throw new Error("没有可导出的卡片");
            case 6:
              _o5 = _a3.exportCards(_s4, r);
              return _context11.abrupt("return", (console.log("[Cards] \u5BFC\u51FA ".concat(_s4.length, " \u5F20\u5361\u7247\u4E3A ").concat(r, " \u683C\u5F0F")), _o5));
            case 10:
              _context11.prev = 10;
              _context11.t0 = _context11["catch"](2);
              throw console.error("[Cards] 导出卡片失败:", _context11.t0), _context11.t0;
            case 13:
            case "end":
              return _context11.stop();
          }
        }, _callee11, null, [[2, 10]]);
      }))();
    },
    importCards: function importCards(_ref26, _ref27) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee12() {
        var e, t, r, a, s, _require2, _o6, c, _iterator, _step, _t2;
        return _regeneratorRuntime2().wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              e = _ref26.commit, t = _ref26.dispatch;
              r = _ref27.content, a = _ref27.format, s = _ref27.filename;
              _context12.prev = 2;
              _require2 = require("../../utils/card-import-export.js"), _o6 = _require2.CardImportExport;
              a || (a = _o6.detectFormat(r, s));
              c = _o6.importCards(r, a);
              if (!(0 === c.length)) {
                _context12.next = 8;
                break;
              }
              throw new Error("没有找到有效的卡片数据");
            case 8:
              _iterator = _createForOfIteratorHelper2(c);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  _t2 = _step.value;
                  e("ADD_CARD", _t2);
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              _context12.next = 12;
              return t("saveToStorage");
            case 12:
              console.log("[Cards] \u6210\u529F\u5BFC\u5165 ".concat(c.length, " \u5F20\u5361\u7247"));
              return _context12.abrupt("return", {
                success: !0,
                count: c.length,
                cards: c
              });
            case 16:
              _context12.prev = 16;
              _context12.t0 = _context12["catch"](2);
              throw console.error("[Cards] 导入卡片失败:", _context12.t0), e("SET_ERROR", _context12.t0.message), _context12.t0;
            case 19:
            case "end":
              return _context12.stop();
          }
        }, _callee12, null, [[2, 16]]);
      }))();
    },
    importFromFile: function importFromFile(_ref28) {
      var _this2 = this;
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee14() {
        var t;
        return _regeneratorRuntime2().wrap(function _callee14$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              t = _ref28.dispatch;
              return _context14.abrupt("return", new Promise(function (r, a) {
                e.index.chooseFile({
                  count: 1,
                  extension: [".json", ".dump", ".nfc", ".txt"],
                  success: function () {
                    var _success = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee13(e) {
                      var _a4, _s5, _o7;
                      return _regeneratorRuntime2().wrap(function _callee13$(_context13) {
                        while (1) switch (_context13.prev = _context13.next) {
                          case 0:
                            _context13.prev = 0;
                            _a4 = e.tempFiles[0];
                            _context13.next = 4;
                            return _this2.readFileContent(_a4.path);
                          case 4:
                            _s5 = _context13.sent;
                            _context13.next = 7;
                            return t("importCards", {
                              content: _s5,
                              filename: _a4.name
                            });
                          case 7:
                            _o7 = _context13.sent;
                            r(_o7);
                            _context13.next = 14;
                            break;
                          case 11:
                            _context13.prev = 11;
                            _context13.t0 = _context13["catch"](0);
                            a(_context13.t0);
                          case 14:
                          case "end":
                            return _context13.stop();
                        }
                      }, _callee13, null, [[0, 11]]);
                    }));
                    function success(_x) {
                      return _success.apply(this, arguments);
                    }
                    return success;
                  }(),
                  fail: function fail() {
                    a(new Error("文件选择失败"));
                  }
                });
              }));
            case 2:
            case "end":
              return _context14.stop();
          }
        }, _callee14);
      }))();
    },
    exportToFile: function exportToFile(_ref29, _ref30) {
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee15() {
        var t, r, _ref30$format, a, _s6, _o8;
        return _regeneratorRuntime2().wrap(function _callee15$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              t = _ref29.dispatch;
              r = _ref30.cardIds, _ref30$format = _ref30.format, a = _ref30$format === void 0 ? "json" : _ref30$format;
              _context15.prev = 2;
              _context15.next = 5;
              return t("exportCards", {
                cardIds: r,
                format: a
              });
            case 5:
              _s6 = _context15.sent;
              _o8 = "".concat(e.index.env.USER_DATA_PATH, "/").concat(_s6.filename);
              _context15.next = 9;
              return e.index.saveFile({
                tempFilePath: _s6.content,
                filePath: _o8
              });
            case 9:
              return _context15.abrupt("return", {
                success: !0,
                filePath: _o8,
                filename: _s6.filename
              });
            case 12:
              _context15.prev = 12;
              _context15.t0 = _context15["catch"](2);
              throw console.error("[Cards] 导出到文件失败:", _context15.t0), _context15.t0;
            case 15:
            case "end":
              return _context15.stop();
          }
        }, _callee15, null, [[2, 12]]);
      }))();
    },
    readFileContent: function readFileContent(t) {
      return new Promise(function (r, a) {
        e.index.getFileSystemManager().readFile({
          filePath: t,
          encoding: "utf8",
          success: function success(e) {
            r(e.data);
          },
          fail: function fail() {
            a(new Error("读取文件失败"));
          }
        });
      });
    }
  },
  getters: {
    allCards: function allCards(e) {
      return e.cards;
    },
    cardCount: function cardCount(e) {
      return e.cards.length;
    },
    filteredCards: function filteredCards(e) {
      var a = _toConsumableArray2(e.cards);
      if ("all" !== e.currentCategory) switch (e.currentCategory) {
        case "hf":
          a = a.filter(function (e) {
            return 2 === e.getFrequency();
          });
          break;
        case "lf":
          a = a.filter(function (e) {
            return 1 === e.getFrequency();
          });
          break;
        case "mifare_classic":
          a = a.filter(function (e) {
            return e.isMifareClassic();
          });
          break;
        case "mifare_ultralight":
          a = a.filter(function (e) {
            return e.isMifareUltralight();
          });
          break;
        case "em410x":
          a = a.filter(function (e) {
            return e.tag === r.TagType.EM410X;
          });
          break;
        case "ntag":
          a = a.filter(function (e) {
            return [r.TagType.NTAG_213, r.TagType.NTAG_215, r.TagType.NTAG_216].includes(e.tag);
          });
          break;
        default:
          a = a.filter(function (e) {
            return !e.isMifareClassic() && !e.isMifareUltralight() && e.tag !== r.TagType.EM410X;
          });
      }
      return e.selectedTags.length > 0 && (a = a.filter(function (t) {
        return e.selectedTags.some(function (e) {
          return t.tags && t.tags.includes(e);
        });
      })), e.searchKeyword && (a = t.CardSaveUtils.searchCards(a, e.searchKeyword)), a = t.CardSaveUtils.sortCards(a, e.sortBy, e.sortOrder), a;
    },
    cardsByType: function cardsByType(e, r) {
      return t.CardSaveUtils.groupByType(r.filteredCards);
    },
    getCardById: function getCardById(e) {
      return function (t) {
        return e.cards.find(function (e) {
          return e.id === t;
        });
      };
    },
    selectedCardObjects: function selectedCardObjects(e) {
      return e.cards.filter(function (t) {
        return e.selectedCards.includes(t.id);
      });
    },
    hfCards: function hfCards(e) {
      return e.cards.filter(function (e) {
        return 2 === e.getFrequency();
      });
    },
    lfCards: function lfCards(e) {
      return e.cards.filter(function (e) {
        return 1 === e.getFrequency();
      });
    },
    hasError: function hasError(e) {
      return !!e.error;
    },
    isLoading: function isLoading(e) {
      return e.loading;
    }
  }
};exports.cards = o;