var _defineProperty2 = require("../../@babel/runtime/helpers/defineProperty");var _toConsumableArray2 = require("../../@babel/runtime/helpers/toConsumableArray");var _regeneratorRuntime2 = require("../../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../../@babel/runtime/helpers/asyncToGenerator");var _objectSpread2 = require("../../@babel/runtime/helpers/objectSpread2");var e = require("../../common/vendor.js"),
  t = require("../../utils/chameleon-protocol.js"),
  a = require("../../utils/card-import-export.js"),
  s = {
    name: "Cards",
    data: function data() {
      return {
        searchKeyword: "",
        showAddMenu: !1,
        showSortMenu: !1,
        showImportMenu: !1,
        showExportMenu: !1,
        showCardEdit: !1,
        isSelecting: !1,
        selectedCards: [],
        currentCard: null,
        isEditing: !1,
        cardForm: {
          id: "",
          name: "",
          tag: t.TagType.UNKNOWN,
          uid: "",
          sak: "",
          atqa: "",
          ats: "",
          color: "#007AFF"
        },
        cardTypeOptions: [{
          value: t.TagType.EM410X,
          label: "EM410X",
          frequency: "LF"
        }, {
          value: t.TagType.MIFARE_1024,
          label: "Mifare Classic 1K",
          frequency: "HF"
        }, {
          value: t.TagType.MIFARE_2048,
          label: "Mifare Classic 2K",
          frequency: "HF"
        }, {
          value: t.TagType.MIFARE_4096,
          label: "Mifare Classic 4K",
          frequency: "HF"
        }, {
          value: t.TagType.NTAG_213,
          label: "NTAG213",
          frequency: "HF"
        }, {
          value: t.TagType.NTAG_215,
          label: "NTAG215",
          frequency: "HF"
        }, {
          value: t.TagType.NTAG_216,
          label: "NTAG216",
          frequency: "HF"
        }],
        colorOptions: [{
          value: "#007AFF",
          label: "蓝色"
        }, {
          value: "#FF3B30",
          label: "红色"
        }, {
          value: "#34C759",
          label: "绿色"
        }, {
          value: "#FF9500",
          label: "橙色"
        }, {
          value: "#AF52DE",
          label: "紫色"
        }, {
          value: "#FF2D92",
          label: "粉色"
        }, {
          value: "#5AC8FA",
          label: "青色"
        }, {
          value: "#FFCC00",
          label: "黄色"
        }],
        sortOptions: [{
          value: "modified",
          label: "修改时间"
        }, {
          value: "created",
          label: "创建时间"
        }, {
          value: "name",
          label: "名称"
        }, {
          value: "type",
          label: "类型"
        }],
        importOptions: [{
          value: "file",
          label: "从文件导入",
          icon: "📁"
        }, {
          value: "slot",
          label: "从卡槽导入",
          icon: "🔄"
        }],
        exportOptions: [{
          value: "json",
          label: "JSON格式",
          icon: "📄"
        }, {
          value: "dump",
          label: "Dump格式",
          icon: "📋"
        }, {
          value: "bin",
          label: "二进制格式",
          icon: "💾"
        }],
        isDevelopmentMode: !1
      };
    },
    computed: _objectSpread2(_objectSpread2(_objectSpread2({}, e.mapState("cards", ["cards", "categories", "currentCategory", "viewMode", "sortBy", "sortOrder", "statistics", "loading", "error"])), e.mapGetters("cards", ["filteredCards", "cardCount", "hfCards", "lfCards", "hasError"])), {}, {
      displayCards: function displayCards() {
        return this.filteredCards;
      },
      hasCards: function hasCards() {
        return this.cardCount > 0;
      },
      isHFCard: function isHFCard() {
        return this.cardForm.tag !== t.TagType.EM410X;
      }
    }),
    onLoad: function onLoad() {
      var _this = this;
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
        return _regeneratorRuntime2().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this.initCards();
            case 2:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))();
    },
    methods: _objectSpread2(_objectSpread2({}, e.mapActions("cards", ["initCards", "createCard", "updateCard", "deleteCard", "deleteCards", "cloneCard", "deployCardToSlot", "importCardFromSlot", "setSearchQuery", "clearError"])), {}, {
      onSearch: function onSearch() {
        this.$store.commit("cards/SET_SEARCH_KEYWORD", this.searchKeyword);
      },
      clearSearch: function clearSearch() {
        this.searchKeyword = "", this.$store.commit("cards/SET_SEARCH_KEYWORD", "");
      },
      selectCategory: function selectCategory(e) {
        this.$store.commit("cards/SET_CURRENT_CATEGORY", e);
      },
      toggleViewMode: function toggleViewMode() {
        var e = "grid" === this.viewMode ? "list" : "grid";
        this.$store.commit("cards/SET_VIEW_MODE", e);
      },
      setSortBy: function setSortBy(e) {
        this.$store.commit("cards/SET_SORT", {
          sortBy: e,
          sortOrder: this.sortOrder
        }), this.showSortMenu = !1;
      },
      setSortOrder: function setSortOrder(e) {
        this.$store.commit("cards/SET_SORT", {
          sortBy: this.sortBy,
          sortOrder: e
        }), this.showSortMenu = !1;
      },
      selectCard: function selectCard(t) {
        this.isSelecting ? this.toggleCardSelection(t.id) : e.index.navigateTo({
          url: "/pages/card-detail/card-detail?id=".concat(t.id)
        });
      },
      toggleCardSelection: function toggleCardSelection(e) {
        this.isSelecting || (this.isSelecting = !0);
        var t = this.selectedCards.indexOf(e);
        t > -1 ? (this.selectedCards.splice(t, 1), 0 === this.selectedCards.length && (this.isSelecting = !1)) : this.selectedCards.push(e);
      },
      selectAll: function selectAll() {
        this.selectedCards.length === this.displayCards.length ? (this.selectedCards = [], this.isSelecting = !1) : (this.selectedCards = this.displayCards.map(function (e) {
          return e.id;
        }), this.isSelecting = !0);
      },
      cancelSelection: function cancelSelection() {
        this.selectedCards = [], this.isSelecting = !1;
      },
      deleteSelected: function deleteSelected() {
        var _this2 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
          return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                if (!(0 === _this2.selectedCards.length)) {
                  _context2.next = 2;
                  break;
                }
                return _context2.abrupt("return");
              case 2:
                _context2.next = 4;
                return _this2.showConfirm("确认删除", "\u786E\u5B9A\u8981\u5220\u9664\u9009\u4E2D\u7684 ".concat(_this2.selectedCards.length, " \u5F20\u5361\u7247\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002"));
              case 4:
                if (!_context2.sent) {
                  _context2.next = 14;
                  break;
                }
                _context2.prev = 5;
                _context2.next = 8;
                return _this2.deleteCards(_this2.selectedCards);
              case 8:
                _this2.cancelSelection();
                _context2.next = 14;
                break;
              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2["catch"](5);
                console.error("删除卡片失败:", _context2.t0);
              case 14:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[5, 11]]);
        }))();
      },
      exportSelected: function exportSelected() {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
          return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                e.index.showToast({
                  title: "功能开发中",
                  icon: "none"
                });
              case 1:
              case "end":
                return _context3.stop();
            }
          }, _callee3);
        }))();
      },
      importFromFile: function importFromFile() {
        var _this3 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4() {
          var _t, _a;
          return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                _this3.showAddMenu = !1;
                _context4.prev = 1;
                _context4.next = 4;
                return _this3.chooseFile();
              case 4:
                _t = _context4.sent;
                if (_t) {
                  _context4.next = 7;
                  break;
                }
                return _context4.abrupt("return", void console.log("[Cards] 用户取消文件选择"));
              case 7:
                console.log("[Cards] \u7528\u6237\u9009\u62E9\u6587\u4EF6: ".concat(_t.name));
                e.index.showLoading({
                  title: "正在导入...",
                  mask: !0
                });
                _context4.next = 11;
                return _this3.processImportFile(_t);
              case 11:
                e.index.hideLoading();
                e.index.showToast({
                  title: "导入成功",
                  icon: "success",
                  duration: 2e3
                });
                _context4.next = 20;
                break;
              case 15:
                _context4.prev = 15;
                _context4.t0 = _context4["catch"](1);
                e.index.hideLoading(), console.error("[Cards] 文件导入失败:", _context4.t0);
                _a = "导入失败";
                _context4.t0.message && (_a = _context4.t0.message.includes("格式不支持") ? "文件格式不支持，请选择 JSON、Dump、Bin 或 NFC 格式的文件" : _context4.t0.message.includes("文件过大") ? "文件过大，请选择小于10MB的文件" : _context4.t0.message.includes("文件为空") ? "文件内容为空，请选择有效的卡片数据文件" : _context4.t0.message.includes("没有找到有效的卡片数据") ? "文件中没有找到有效的卡片数据，请检查文件内容" : _context4.t0.message), e.index.showModal({
                  title: "导入失败",
                  content: _a,
                  showCancel: !1,
                  confirmText: "确定"
                });
              case 20:
              case "end":
                return _context4.stop();
            }
          }, _callee4, null, [[1, 15]]);
        }))();
      },
      importFromSlot: function importFromSlot() {
        var _this4 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee6() {
          var t, a;
          return _regeneratorRuntime2().wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                _this4.showAddMenu = !1;
                t = _this4.$store.state.slots.slots.filter(function (e, t) {
                  return e.enabled;
                });
                if (!(0 === t.length)) {
                  _context6.next = 4;
                  break;
                }
                return _context6.abrupt("return", void e.index.showToast({
                  title: "没有可用的卡槽",
                  icon: "none"
                }));
              case 4:
                a = t.map(function (e, t) {
                  return "\u5361\u69FD".concat(t + 1, ": ").concat(e.name || "未命名");
                });
                e.index.showActionSheet({
                  itemList: a,
                  success: function () {
                    var _success = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5(e) {
                      var _t2;
                      return _regeneratorRuntime2().wrap(function _callee5$(_context5) {
                        while (1) switch (_context5.prev = _context5.next) {
                          case 0:
                            _context5.prev = 0;
                            _t2 = e.tapIndex;
                            _context5.next = 4;
                            return _this4.importCardFromSlot(_t2);
                          case 4:
                            _context5.next = 9;
                            break;
                          case 6:
                            _context5.prev = 6;
                            _context5.t0 = _context5["catch"](0);
                            console.error("从卡槽导入失败:", _context5.t0);
                          case 9:
                          case "end":
                            return _context5.stop();
                        }
                      }, _callee5, null, [[0, 6]]);
                    }));
                    function success(_x) {
                      return _success.apply(this, arguments);
                    }
                    return success;
                  }()
                });
              case 6:
              case "end":
                return _context6.stop();
            }
          }, _callee6);
        }))();
      },
      deployCard: function deployCard(t) {
        var _this5 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee8() {
          var a;
          return _regeneratorRuntime2().wrap(function _callee8$(_context8) {
            while (1) switch (_context8.prev = _context8.next) {
              case 0:
                a = _this5.$store.state.slots.slots.map(function (e, t) {
                  return "\u5361\u69FD".concat(t + 1, ": ").concat(e.name || "空闲").concat(e.enabled ? " (已占用)" : "");
                });
                e.index.showActionSheet({
                  itemList: a,
                  success: function () {
                    var _success2 = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee7(e) {
                      var _a2;
                      return _regeneratorRuntime2().wrap(function _callee7$(_context7) {
                        while (1) switch (_context7.prev = _context7.next) {
                          case 0:
                            _context7.prev = 0;
                            _a2 = e.tapIndex;
                            _context7.next = 4;
                            return _this5.deployCardToSlot({
                              cardId: t.id,
                              slotIndex: _a2
                            });
                          case 4:
                            _context7.next = 9;
                            break;
                          case 6:
                            _context7.prev = 6;
                            _context7.t0 = _context7["catch"](0);
                            console.error("部署卡片失败:", _context7.t0);
                          case 9:
                          case "end":
                            return _context7.stop();
                        }
                      }, _callee7, null, [[0, 6]]);
                    }));
                    function success(_x2) {
                      return _success2.apply(this, arguments);
                    }
                    return success;
                  }()
                });
              case 2:
              case "end":
                return _context8.stop();
            }
          }, _callee8);
        }))();
      },
      showCardMenu: function showCardMenu(t) {
        var _this6 = this;
        e.index.showActionSheet({
          itemList: ["写卡", "编辑", "复制", "导出", "删除"],
          success: function success(a) {
            switch (a.tapIndex) {
              case 0:
                _this6.writeCard(t);
                break;
              case 1:
                e.index.navigateTo({
                  url: "/pages/card-detail/card-detail?id=".concat(t.id, "&mode=edit")
                });
                break;
              case 2:
                _this6.duplicateCard(t);
                break;
              case 3:
                _this6.exportCard(t);
                break;
              case 4:
                _this6.confirmDeleteCard(t);
            }
          }
        });
      },
      duplicateCard: function duplicateCard(e) {
        var _this7 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee9() {
          var _t3;
          return _regeneratorRuntime2().wrap(function _callee9$(_context9) {
            while (1) switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                _t3 = _objectSpread2(_objectSpread2({}, e), {}, {
                  id: void 0,
                  name: "".concat(e.name, " - \u526F\u672C"),
                  createdAt: void 0,
                  modifiedAt: void 0
                });
                _context9.next = 4;
                return _this7.createCard(_t3);
              case 4:
                _context9.next = 9;
                break;
              case 6:
                _context9.prev = 6;
                _context9.t0 = _context9["catch"](0);
                console.error("复制卡片失败:", _context9.t0);
              case 9:
              case "end":
                return _context9.stop();
            }
          }, _callee9, null, [[0, 6]]);
        }))();
      },
      exportCard: function exportCard(t) {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee10() {
          return _regeneratorRuntime2().wrap(function _callee10$(_context10) {
            while (1) switch (_context10.prev = _context10.next) {
              case 0:
                e.index.showToast({
                  title: "功能开发中",
                  icon: "none"
                });
              case 1:
              case "end":
                return _context10.stop();
            }
          }, _callee10);
        }))();
      },
      writeCard: function writeCard(t) {
        t.data && 0 !== t.data.length ? (console.log("[Cards] 准备写入卡片:", t.name), e.index.navigateTo({
          url: "/pages/card-write/card-write?cardId=".concat(t.id)
        })) : e.index.showToast({
          title: "该卡片没有可写入的数据",
          icon: "none"
        });
      },
      confirmDeleteCard: function confirmDeleteCard(e) {
        var _this8 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee11() {
          return _regeneratorRuntime2().wrap(function _callee11$(_context11) {
            while (1) switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return _this8.showConfirm("确认删除", "\u786E\u5B9A\u8981\u5220\u9664\u5361\u7247\"".concat(e.name, "\"\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002"));
              case 2:
                if (!_context11.sent) {
                  _context11.next = 11;
                  break;
                }
                _context11.prev = 3;
                _context11.next = 6;
                return _this8.deleteCard(e.id);
              case 6:
                _context11.next = 11;
                break;
              case 8:
                _context11.prev = 8;
                _context11.t0 = _context11["catch"](3);
                console.error("删除卡片失败:", _context11.t0);
              case 11:
              case "end":
                return _context11.stop();
            }
          }, _callee11, null, [[3, 8]]);
        }))();
      },
      getCategoryIcon: function getCategoryIcon(e) {
        return {
          list: "list",
          creditcard: "wallet",
          tag: "tags",
          key: "locked",
          shield: "checkmarkempty",
          chip: "gear",
          dots: "more-filled"
        }[e] || "paperplane";
      },
      getTypeIcon: function getTypeIcon(e) {
        if (this.$CardDataUtils) {
          var _t4 = this.$CardDataUtils.getTypeInfo(e);
          return this.getCategoryIcon(_t4.icon);
        }
        return "paperplane";
      },
      getTypeName: function getTypeName(e) {
        if (this.$CardDataUtils) {
          return this.$CardDataUtils.getTypeInfo(e).name;
        }
        return "未知类型";
      },
      formatUID: function formatUID(e) {
        return e ? e.replace(/(.{2})/g, "$1 ").trim().substring(0, 11) + (e.length > 8 ? "..." : "") : "";
      },
      formatSize: function formatSize(e) {
        return this.$CardDataUtils ? this.$CardDataUtils.formatSize(e) : "".concat(e, " B");
      },
      getCardSize: function getCardSize(e) {
        return JSON.stringify(e.data || {}).length;
      },
      formatTime: function formatTime(e) {
        var t = new Date(e),
          a = new Date() - t;
        return a < 6e4 ? "刚刚" : a < 36e5 ? "".concat(Math.floor(a / 6e4), "\u5206\u949F\u524D") : a < 864e5 ? "".concat(Math.floor(a / 36e5), "\u5C0F\u65F6\u524D") : a < 6048e5 ? "".concat(Math.floor(a / 864e5), "\u5929\u524D") : t.toLocaleDateString();
      },
      showConfirm: function () {
        var _showConfirm = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee12(t, a) {
          return _regeneratorRuntime2().wrap(function _callee12$(_context12) {
            while (1) switch (_context12.prev = _context12.next) {
              case 0:
                return _context12.abrupt("return", new Promise(function (s) {
                  e.index.showModal({
                    title: t,
                    content: a,
                    success: function success(e) {
                      s(e.confirm);
                    }
                  });
                }));
              case 1:
              case "end":
                return _context12.stop();
            }
          }, _callee12);
        }));
        function showConfirm(_x3, _x4) {
          return _showConfirm.apply(this, arguments);
        }
        return showConfirm;
      }(),
      loadMore: function loadMore() {},
      chooseFile: function () {
        var _chooseFile = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee13() {
          return _regeneratorRuntime2().wrap(function _callee13$(_context13) {
            while (1) switch (_context13.prev = _context13.next) {
              case 0:
                return _context13.abrupt("return", new Promise(function (t, a) {
                  e.index.chooseMessageFile({
                    count: 1,
                    type: "file",
                    success: function success(s) {
                      var r = s.tempFiles[0];
                      if (r) {
                        r.name.toLowerCase().split(".").pop();
                        var _s = e.index.getFileSystemManager();
                        if (!r.path || 0 === r.size) return void a(new Error("文件为空或无效"));
                        console.log("[Cards] \u5FAE\u4FE1\u5C0F\u7A0B\u5E8F\u8BFB\u53D6\u6587\u4EF6: ".concat(r.name, ", \u8DEF\u5F84: ").concat(r.path, ", \u5927\u5C0F: ").concat(r.size)), _s.readFile({
                          filePath: r.path,
                          success: function success(e) {
                            var s = e.data;
                            if (!s || 0 === s.byteLength) return void a(new Error("文件内容为空"));
                            var o = new Uint8Array(s);
                            console.log("[Cards] \u6587\u4EF6\u8BFB\u53D6\u6210\u529F\uFF0C\u4E8C\u8FDB\u5236\u5927\u5C0F: ".concat(o.length, " \u5B57\u8282"));
                            var i = r.name.toLowerCase().split(".").pop();
                            if ("bin" === i || "dump" === i) t({
                              name: r.name,
                              content: s,
                              size: r.size
                            });else try {
                              var _e = new TextDecoder("utf-8").decode(o);
                              t({
                                name: r.name,
                                content: _e,
                                size: r.size
                              });
                            } catch (n) {
                              console.log("[Cards] \u6587\u672C\u89E3\u7801\u5931\u8D25\uFF0C\u4F5C\u4E3A\u4E8C\u8FDB\u5236\u5904\u7406: ".concat(n.message)), t({
                                name: r.name,
                                content: s,
                                size: r.size
                              });
                            }
                          },
                          fail: function fail(e) {
                            console.error("[Cards] \u6587\u4EF6\u8BFB\u53D6\u5931\u8D25: ".concat(JSON.stringify(e))), a(new Error("\u6587\u4EF6\u8BFB\u53D6\u5931\u8D25: ".concat(e.errMsg || "未知错误")));
                          }
                        });
                      } else t(null);
                    },
                    fail: function fail(e) {
                      console.error("[Cards] \u5FAE\u4FE1\u5C0F\u7A0B\u5E8F\u9009\u62E9\u6587\u4EF6\u5931\u8D25: ".concat(JSON.stringify(e))), a(new Error("\u6587\u4EF6\u9009\u62E9\u5931\u8D25: ".concat(e.errMsg || "未知错误")));
                    }
                  });
                }));
              case 1:
              case "end":
                return _context13.stop();
            }
          }, _callee13);
        }));
        function chooseFile() {
          return _chooseFile.apply(this, arguments);
        }
        return chooseFile;
      }(),
      processImportFile: function processImportFile(t) {
        var _this9 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee14() {
          var s, r, o, l, c, h, _e2, _t5, g, p, m, _e3, _t6, _t7, _a3;
          return _regeneratorRuntime2().wrap(function _callee14$(_context14) {
            while (1) switch (_context14.prev = _context14.next) {
              case 0:
                s = null, r = !1, o = !1;
                _context14.prev = 1;
                if (!(console.log("[Cards] \u5F00\u59CB\u5904\u7406\u6587\u4EF6\u5BFC\u5165 - \u6587\u4EF6\u540D: ".concat(t.name, ", \u5927\u5C0F: ").concat(t.size)), s = _this9.showProgressDialog("卡片导入", "正在检查文件..."), t.size > 10485760)) {
                  _context14.next = 4;
                  break;
                }
                throw new Error("文件过大，请选择小于10MB的文件");
              case 4:
                _this9.updateProgressDialog(s, "正在检测文件格式...");
                _context14.prev = 5;
                l = a.CardImportExport.detectFormat(t.content, t.name), r = !0, console.log("[Cards] \u68C0\u6D4B\u5230\u6587\u4EF6\u683C\u5F0F: ".concat(l));
                _context14.next = 12;
                break;
              case 9:
                _context14.prev = 9;
                _context14.t0 = _context14["catch"](5);
                throw console.error("[Cards] 文件格式检测失败:", _context14.t0), new Error("\u6587\u4EF6\u683C\u5F0F\u4E0D\u652F\u6301: ".concat(_context14.t0.message));
              case 12:
                _this9.updateProgressDialog(s, "\u6B63\u5728\u89E3\u6790".concat(_this9.getFormatName(l), "\u683C\u5F0F\u6587\u4EF6..."));
                _context14.prev = 13;
                c = a.CardImportExport.importCards(t.content, l, t.name), o = !0, console.log("[Cards] 文件解析完成");
                _context14.next = 20;
                break;
              case 17:
                _context14.prev = 17;
                _context14.t1 = _context14["catch"](13);
                throw console.error("[Cards] 文件解析失败:", _context14.t1), new Error("\u6587\u4EF6\u89E3\u6790\u5931\u8D25: ".concat(_context14.t1.message));
              case 20:
                if (!(c && c.needsUidSelection)) {
                  _context14.next = 26;
                  break;
                }
                console.log("[Cards] 需要用户选择UID长度");
                s && _this9.closeProgressDialog(s);
                _context14.next = 25;
                return _this9.showUidSelectionDialog(c);
              case 25:
                return _context14.abrupt("return", void _context14.sent);
              case 26:
                h = Array.isArray(c) ? c : [c];
                if (!(!h || 0 === h.length)) {
                  _context14.next = 29;
                  break;
                }
                throw new Error("文件中没有找到有效的卡片数据，请检查文件格式是否正确");
              case 29:
                _this9.updateProgressDialog(s, "\u89E3\u6790\u51FA ".concat(h.length, " \u5F20\u5361\u7247\uFF0C\u6B63\u5728\u5904\u7406..."));
                for (_e2 = 0; _e2 < h.length; _e2++) {
                  _t5 = h[_e2];
                  _t5.name && _t5.uid || (console.warn("[Cards] \u5361\u7247 ".concat(_e2 + 1, " \u6570\u636E\u4E0D\u5B8C\u6574:"), _t5), _t5.name || (_t5.name = "\u5BFC\u5165\u5361\u7247 ".concat(_e2 + 1)), _t5.uid || (_t5.uid = "00 00 00 00"));
                }
                g = 0, p = [];
                m = h.length;
                _e3 = 0;
              case 34:
                if (!(_e3 < h.length)) {
                  _context14.next = 49;
                  break;
                }
                _t6 = h[_e3];
                _this9.updateProgressDialog(s, "\u5BFC\u5165\u5361\u7247 (".concat(_e3 + 1, "/").concat(m, "): ").concat(_t6.name || "无名卡片"), _e3 / m * 100);
                _context14.prev = 37;
                _context14.next = 40;
                return _this9.createCard(_t6);
              case 40:
                g++;
                _context14.next = 46;
                break;
              case 43:
                _context14.prev = 43;
                _context14.t2 = _context14["catch"](37);
                console.error("[Cards] 创建卡片失败:", _context14.t2, _t6), p.push({
                  name: _t6.name || "无名卡片",
                  error: _context14.t2.message || "创建失败"
                });
              case 46:
                _e3++;
                _context14.next = 34;
                break;
              case 49:
                if (!(s && _this9.closeProgressDialog(s), s = null, 0 === g)) {
                  _context14.next = 51;
                  break;
                }
                throw new Error("所有卡片创建失败，请检查卡片数据格式");
              case 51:
                g < h.length ? (console.warn("[Cards] \u90E8\u5206\u5361\u7247\u5BFC\u5165\u5931\u8D25: \u6210\u529F ".concat(g, "/").concat(h.length)), _this9.showImportResultDialog("部分导入成功", "\u5171 ".concat(h.length, " \u5F20\u5361\u7247\uFF0C\u6210\u529F\u5BFC\u5165 ").concat(g, " \u5F20\uFF0C\u5931\u8D25 ").concat(p.length, " \u5F20\u3002"), p)) : e.index.showModal({
                  title: "导入成功",
                  content: "\u6210\u529F\u5BFC\u5165\u4E86 ".concat(g, " \u5F20\u5361\u7247\u3002"),
                  showCancel: !1,
                  confirmText: "完成"
                }), console.log("[Cards] \u6210\u529F\u5BFC\u5165 ".concat(g, " \u5F20\u5361\u7247"));
                _context14.next = 59;
                break;
              case 54:
                _context14.prev = 54;
                _context14.t3 = _context14["catch"](1);
                s && _this9.closeProgressDialog(s), console.error("[Cards] 文件导入失败:", _context14.t3);
                _t7 = "导入失败", _a3 = "导入过程中发生错误";
                r ? o ? (_t7 = "卡片创建失败", _context14.t3.message && (_a3 = _context14.t3.message.includes("所有卡片创建失败") ? "所有卡片创建失败，请检查卡片数据格式\n\n可能的原因：\n1. 卡片数据不完整\n2. 卡片类型不受支持\n3. 卡片数据已损坏" : _context14.t3.message)) : (_t7 = "文件解析失败", _context14.t3.message && (_a3 = _context14.t3.message.includes("没有找到有效的卡片数据") ? "文件中没有找到有效的卡片数据，请检查文件内容\n\n如果这是一个有效的卡片文件，请联系我们并提供样例" : _context14.t3.message.includes("解析失败") ? "\u6587\u4EF6\u89E3\u6790\u5931\u8D25: ".concat(_context14.t3.message.replace("文件解析失败: ", ""), "\n\n\u8BF7\u68C0\u67E5\u6587\u4EF6\u683C\u5F0F\u662F\u5426\u6B63\u786E") : _context14.t3.message)) : (_t7 = "文件格式检测失败", _context14.t3.message && (_a3 = _context14.t3.message.includes("格式不支持") ? "文件格式不支持，请选择 JSON、Dump、Bin 或 NFC 格式的文件\n\n支持格式包括：\n- 卡片包JSON\n- Chameleon Dump\n- Mifare Classic dump\n- Proxmark3 dump\n- Flipper NFC\n- 原始二进制" : _context14.t3.message.includes("文件过大") ? "文件过大，请选择小于10MB的文件" : _context14.t3.message.includes("文件为空") ? "文件内容为空，请选择有效的卡片数据文件" : _context14.t3.message)), e.index.showModal({
                  title: _t7,
                  content: _a3,
                  showCancel: !1,
                  confirmText: "确定"
                });
              case 59:
              case "end":
                return _context14.stop();
            }
          }, _callee14, null, [[1, 54], [5, 9], [13, 17], [37, 43]]);
        }))();
      },
      showProgressDialog: function showProgressDialog(t, a) {
        var s = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        return e.index.showLoading({
          title: a || t,
          mask: !0
        }), {
          title: t,
          message: a,
          progress: s,
          timestamp: Date.now()
        };
      },
      updateProgressDialog: function updateProgressDialog(t, a) {
        var s = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
        t && (t.message = a, s >= 0 && (t.progress = s), e.index.showLoading({
          title: a,
          mask: !0
        }));
      },
      closeProgressDialog: function closeProgressDialog(t) {
        t && e.index.hideLoading();
      },
      showImportResultDialog: function showImportResultDialog(t, a) {
        var s = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var r = a + "\n\n";
        if (s.length > 0) {
          var _e4 = s.slice(0, 5);
          r += "失败的卡片：\n", _e4.forEach(function (e, t) {
            r += "".concat(t + 1, ". ").concat(e.name, ": ").concat(e.error, "\n");
          }), s.length > 5 && (r += "... \u53CA\u5176\u4ED6 ".concat(s.length - 5, " \u5F20\n"));
        }
        e.index.showModal({
          title: t,
          content: r,
          showCancel: !1,
          confirmText: "完成"
        });
      },
      getFormatName: function getFormatName(e) {
        return {
          json: "JSON",
          dump: "Dump",
          bin: "二进制",
          proxmark3: "Proxmark3",
          flipper: "Flipper NFC",
          mct: "Mifare Classic Tool",
          plain_hex: "十六进制"
        }[e] || e;
      },
      showUidSelectionDialog: function showUidSelectionDialog(t) {
        var _this10 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee16() {
          var s, r, o, i, n, d, l, c, h, g;
          return _regeneratorRuntime2().wrap(function _callee16$(_context16) {
            while (1) switch (_context16.prev = _context16.next) {
              case 0:
                s = t.tagType, r = t.cardName, o = t.bytes, i = o.slice(0, 4).map(function (e) {
                  return e.toString(16).padStart(2, "0");
                }).join(" ").toUpperCase();
                n = "";
                if (136 === o[0] && o.length >= 14) {
                  n = [].concat(_toConsumableArray2(o.slice(1, 4)), _toConsumableArray2(o.slice(4, 8))).map(function (e) {
                    return e.toString(16).padStart(2, "0");
                  }).join(" ").toUpperCase();
                } else n = o.slice(0, 7).map(function (e) {
                  return e.toString(16).padStart(2, "0");
                }).join(" ").toUpperCase();
                d = null, l = null;
                o.length > 5 && (d = o[5]), o.length > 7 && (l = [o[7], o[6]]);
                c = a.CardImportExport.getDefaultSAK(s, 7), h = a.CardImportExport.getDefaultATQA(s, 7), g = "\u68C0\u6D4B\u5230".concat(_this10.getTagTypeName(s), "\u5361\u7247\u6570\u636E\uFF0C\u8BF7\u9009\u62E9UID\u957F\u5EA6\uFF1A\n\n4\u4F4DUID: ").concat(i, "\nSAK: ").concat(null !== d ? "0x" + d.toString(16).padStart(2, "0") + " (从数据提取)" : "未知", "\nATQA: ").concat(null !== l ? l.map(function (e) {
                  return e.toString(16).padStart(2, "0");
                }).join(" ") + " (从数据提取)" : "未知", "\n\n7\u4F4DUID: ").concat(n, "\nSAK: 0x").concat(c.toString(16).padStart(2, "0"), " (\u9ED8\u8BA4\u503C)\nATQA: ").concat(h.map(function (e) {
                  return e.toString(16).padStart(2, "0");
                }).join(" "), " (\u9ED8\u8BA4\u503C)\n\n\u6CE8\u610F\uFF1A4\u4F4DUID\u7684SAK\u548CATQA\u4ECE\u5361\u7247\u6570\u636E\u4E2D\u63D0\u53D6\uFF0C7\u4F4DUID\u4F7F\u7528\u9ED8\u8BA4\u503C\u3002");
                return _context16.abrupt("return", new Promise(function (s) {
                  e.index.showModal({
                    title: "选择UID长度",
                    content: g,
                    showCancel: !0,
                    cancelText: "7位UID",
                    confirmText: "4位UID",
                    success: function () {
                      var _success3 = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee15(o) {
                        var _i, _n;
                        return _regeneratorRuntime2().wrap(function _callee15$(_context15) {
                          while (1) switch (_context15.prev = _context15.next) {
                            case 0:
                              _context15.prev = 0;
                              _i = o.confirm ? 4 : 7, _n = a.CardImportExport.createCardWithUidLength(t, _i, r);
                              _context15.next = 4;
                              return _this10.createCard(_n);
                            case 4:
                              e.index.showToast({
                                title: "\u6210\u529F\u5BFC\u5165".concat(_i, "\u4F4DUID\u5361\u7247"),
                                icon: "success"
                              });
                              console.log("\u6210\u529F\u5BFC\u5165\u5361\u7247\uFF0CUID\u957F\u5EA6: ".concat(_i, "\u4F4D, UID: ").concat(_n.uid, ", SAK: 0x").concat(_n.sak.toString(16).padStart(2, "0"), ", ATQA: ").concat(_n.atqa.map(function (e) {
                                return e.toString(16).padStart(2, "0");
                              }).join(" ")));
                              s();
                              _context15.next = 12;
                              break;
                            case 9:
                              _context15.prev = 9;
                              _context15.t0 = _context15["catch"](0);
                              console.error("创建卡片失败:", _context15.t0), e.index.showToast({
                                title: "导入失败",
                                icon: "error"
                              }), s();
                            case 12:
                            case "end":
                              return _context15.stop();
                          }
                        }, _callee15, null, [[0, 9]]);
                      }));
                      function success(_x5) {
                        return _success3.apply(this, arguments);
                      }
                      return success;
                    }(),
                    fail: function fail() {
                      s();
                    }
                  });
                }));
              case 7:
              case "end":
                return _context16.stop();
            }
          }, _callee16);
        }))();
      },
      getTagTypeName: function getTagTypeName(e) {
        var _t$TagType$MIFARE_;
        return (_t$TagType$MIFARE_ = {}, _defineProperty2(_t$TagType$MIFARE_, t.TagType.MIFARE_1024, "Mifare Classic 1K"), _defineProperty2(_t$TagType$MIFARE_, t.TagType.MIFARE_2048, "Mifare Classic 2K"), _defineProperty2(_t$TagType$MIFARE_, t.TagType.MIFARE_4096, "Mifare Classic 4K"), _defineProperty2(_t$TagType$MIFARE_, t.TagType.NTAG_213, "NTAG213"), _defineProperty2(_t$TagType$MIFARE_, t.TagType.NTAG_215, "NTAG215"), _defineProperty2(_t$TagType$MIFARE_, t.TagType.NTAG_216, "NTAG216"), _defineProperty2(_t$TagType$MIFARE_, t.TagType.EM410X, "EM410X"), _t$TagType$MIFARE_)[e] || "未知类型";
      },
      showAddCardForm: function showAddCardForm() {
        this.isEditing = !1, this.resetCardForm(), this.showCardEdit = !0;
      },
      editCard: function editCard(e) {
        this.isEditing = !0, this.currentCard = e, this.cardForm = {
          id: e.id,
          name: e.name,
          tag: e.tag,
          uid: e.uid,
          sak: e.sak ? e.sak.toString(16).padStart(2, "0") : "",
          atqa: e.atqa ? Array.from(e.atqa).map(function (e) {
            return e.toString(16).padStart(2, "0");
          }).join(" ") : "",
          ats: e.ats ? Array.from(e.ats).map(function (e) {
            return e.toString(16).padStart(2, "0");
          }).join(" ") : "",
          color: e.color || "#007AFF"
        }, this.showCardEdit = !0;
      },
      saveCard: function saveCard() {
        var _this11 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee17() {
          var _t8;
          return _regeneratorRuntime2().wrap(function _callee17$(_context17) {
            while (1) switch (_context17.prev = _context17.next) {
              case 0:
                _context17.prev = 0;
                if (_this11.cardForm.name.trim()) {
                  _context17.next = 3;
                  break;
                }
                throw new Error("请输入卡片名称");
              case 3:
                if (_this11.cardForm.uid.trim()) {
                  _context17.next = 5;
                  break;
                }
                throw new Error("请输入UID");
              case 5:
                if (/^[0-9A-Fa-f\s]+$/.test(_this11.cardForm.uid)) {
                  _context17.next = 7;
                  break;
                }
                throw new Error("UID格式无效");
              case 7:
                _t8 = {
                  name: _this11.cardForm.name,
                  tag: _this11.cardForm.tag,
                  uid: _this11.cardForm.uid,
                  color: _this11.cardForm.color
                };
                _this11.isHFCard && (_this11.cardForm.sak && (_t8.sak = parseInt(_this11.cardForm.sak, 16)), _this11.cardForm.atqa && (_t8.atqa = new Uint8Array(_this11.cardForm.atqa.split(" ").filter(function (e) {
                  return e.trim();
                }).map(function (e) {
                  return parseInt(e, 16);
                }))), _this11.cardForm.ats && (_t8.ats = new Uint8Array(_this11.cardForm.ats.split(" ").filter(function (e) {
                  return e.trim();
                }).map(function (e) {
                  return parseInt(e, 16);
                }))));
                if (!_this11.isEditing) {
                  _context17.next = 14;
                  break;
                }
                _context17.next = 12;
                return _this11.updateCard({
                  id: _this11.cardForm.id,
                  updates: _t8
                });
              case 12:
                _context17.next = 16;
                break;
              case 14:
                _context17.next = 16;
                return _this11.createCard(_t8);
              case 16:
                _this11.closeCardForm();
                e.index.showToast({
                  title: _this11.isEditing ? "卡片更新成功" : "卡片创建成功",
                  icon: "success"
                });
                _context17.next = 23;
                break;
              case 20:
                _context17.prev = 20;
                _context17.t0 = _context17["catch"](0);
                console.error("[Cards] 保存卡片失败:", _context17.t0), e.index.showToast({
                  title: _context17.t0.message || "保存失败",
                  icon: "error"
                });
              case 23:
              case "end":
                return _context17.stop();
            }
          }, _callee17, null, [[0, 20]]);
        }))();
      },
      closeCardForm: function closeCardForm() {
        this.showCardEdit = !1, this.resetCardForm();
      },
      resetCardForm: function resetCardForm() {
        this.cardForm = {
          id: "",
          name: "",
          tag: t.TagType.UNKNOWN,
          uid: "",
          sak: "",
          atqa: "",
          ats: "",
          color: "#007AFF"
        }, this.currentCard = null;
      },
      cloneCardAction: function cloneCardAction(t) {
        var _this12 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee18() {
          var _a4;
          return _regeneratorRuntime2().wrap(function _callee18$(_context18) {
            while (1) switch (_context18.prev = _context18.next) {
              case 0:
                _context18.prev = 0;
                _a4 = "".concat(t.name, " (\u526F\u672C)");
                _context18.next = 4;
                return _this12.cloneCard({
                  id: t.id,
                  newName: _a4
                });
              case 4:
                e.index.showToast({
                  title: "卡片克隆成功",
                  icon: "success"
                });
                _context18.next = 10;
                break;
              case 7:
                _context18.prev = 7;
                _context18.t0 = _context18["catch"](0);
                console.error("[Cards] 克隆卡片失败:", _context18.t0), e.index.showToast({
                  title: "克隆失败",
                  icon: "error"
                });
              case 10:
              case "end":
                return _context18.stop();
            }
          }, _callee18, null, [[0, 7]]);
        }))();
      },
      deleteCardAction: function deleteCardAction(t) {
        var _this13 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee19() {
          return _regeneratorRuntime2().wrap(function _callee19$(_context19) {
            while (1) switch (_context19.prev = _context19.next) {
              case 0:
                _context19.prev = 0;
                _context19.next = 3;
                return e.index.showModal({
                  title: "确认删除",
                  content: "\u786E\u5B9A\u8981\u5220\u9664\u5361\u7247\"".concat(t.name, "\"\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u6062\u590D\u3002")
                });
              case 3:
                _context19.t0 = _context19.sent.confirm;
                if (!_context19.t0) {
                  _context19.next = 8;
                  break;
                }
                _context19.next = 7;
                return _this13.deleteCard(t.id);
              case 7:
                e.index.showToast({
                  title: "卡片删除成功",
                  icon: "success"
                });
              case 8:
                _context19.next = 13;
                break;
              case 10:
                _context19.prev = 10;
                _context19.t1 = _context19["catch"](0);
                console.error("[Cards] 删除卡片失败:", _context19.t1), e.index.showToast({
                  title: "删除失败",
                  icon: "error"
                });
              case 13:
              case "end":
                return _context19.stop();
            }
          }, _callee19, null, [[0, 10]]);
        }))();
      },
      formatDate: function formatDate(e) {
        if (!e) return "";
        return new Date(e).toLocaleDateString("zh-CN", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      },
      getCardTypeName: function getCardTypeName(e) {
        var t = this.cardTypeOptions.find(function (t) {
          return t.value === e;
        });
        return t ? t.label : "未知类型";
      },
      getCardIcon: function getCardIcon(e) {
        return 1 === e.getFrequency() ? "wifi" : "creditcard";
      }
    })
  };if (!Array) {
  e.resolveComponent("uni-icons")();
}Math;var r = e._export_sfc(s, [["render", function (t, a, s, r, o, i) {
  return e.e({
    a: e.p({
      type: "search",
      size: "18",
      color: "#999999"
    }),
    b: e.o([function (e) {
      return o.searchKeyword = e.detail.value;
    }, function () {
      return i.onSearch && i.onSearch.apply(i, arguments);
    }]),
    c: o.searchKeyword,
    d: o.searchKeyword
  }, o.searchKeyword ? {
    e: e.p({
      type: "clear",
      size: "16",
      color: "#999999"
    }),
    f: e.o(function () {
      return i.clearSearch && i.clearSearch.apply(i, arguments);
    })
  } : {}, {
    g: e.p({
      type: "bars",
      size: "20",
      color: "#666666"
    }),
    h: e.o(function (e) {
      return o.showSortMenu = !0;
    }),
    i: e.p({
      type: "plus",
      size: "20",
      color: "#666666"
    }),
    j: e.o(function (e) {
      return o.showAddMenu = !0;
    }),
    k: e.f(t.categories, function (a, s, r) {
      return {
        a: "c46d9c99-4-" + r,
        b: e.p({
          type: i.getCategoryIcon(a.icon),
          size: "18",
          color: "inherit"
        }),
        c: e.t(a.name),
        d: e.t(a.count),
        e: a.id,
        f: e.n({
          active: t.currentCategory === a.id
        }),
        g: e.o(function (e) {
          return i.selectCategory(a.id);
        }, a.id)
      };
    }),
    l: e.t(t.statistics.totalCards),
    m: e.t(i.formatSize(t.statistics.totalSize)),
    n: o.selectedCards.length > 0
  }, o.selectedCards.length > 0 ? {
    o: e.t(o.selectedCards.length)
  } : {}, {
    p: "grid" === t.viewMode
  }, "grid" === t.viewMode ? {
    q: e.f(i.displayCards, function (t, a, s) {
      return e.e(o.isSelecting ? e.e({
        a: o.selectedCards.includes(t.id)
      }, o.selectedCards.includes(t.id) ? {
        b: "c46d9c99-5-" + s,
        c: e.p({
          type: "checkmarkempty",
          size: "16",
          color: "#ffffff"
        })
      } : {}, {
        d: e.n({
          checked: o.selectedCards.includes(t.id)
        })
      }) : {}, {
        e: "c46d9c99-6-" + s,
        f: e.p({
          type: i.getTypeIcon(t.type),
          size: "24",
          color: "#ffffff"
        }),
        g: e.n("type-".concat(t.type)),
        h: t.favorite
      }, t.favorite ? {
        i: "c46d9c99-7-" + s,
        j: e.p({
          type: "star-filled",
          size: "18",
          color: "#FFD700"
        })
      } : {}, {
        k: e.t(t.name),
        l: e.t(i.getTypeName(t.type)),
        m: e.t(i.formatSize(i.getCardSize(t))),
        n: t.uid
      }, t.uid ? {
        o: e.t(i.formatUID(t.uid))
      } : {}, {
        p: t.tags && t.tags.length > 0
      }, t.tags && t.tags.length > 0 ? e.e({
        q: e.f(t.tags.slice(0, 2), function (t, a, s) {
          return {
            a: e.t(t),
            b: t
          };
        }),
        r: t.tags.length > 2
      }, t.tags.length > 2 ? {
        s: e.t(t.tags.length - 2)
      } : {}) : {}, {
        t: e.t(i.formatTime(t.modifiedAt || t.createdAt)),
        v: t.id,
        w: e.n({
          selected: o.selectedCards.includes(t.id)
        }),
        x: e.o(function (e) {
          return i.selectCard(t);
        }, t.id),
        y: e.o(function (e) {
          return i.toggleCardSelection(t.id);
        }, t.id)
      });
    }),
    r: o.isSelecting
  } : {
    s: e.f(i.displayCards, function (t, a, s) {
      return e.e(o.isSelecting ? e.e({
        a: o.selectedCards.includes(t.id)
      }, o.selectedCards.includes(t.id) ? {
        b: "c46d9c99-8-" + s,
        c: e.p({
          type: "checkmarkempty",
          size: "16",
          color: "#ffffff"
        })
      } : {}, {
        d: e.n({
          checked: o.selectedCards.includes(t.id)
        })
      }) : {}, {
        e: "c46d9c99-9-" + s,
        f: e.p({
          type: i.getTypeIcon(t.type),
          size: "32",
          color: "#000000"
        }),
        g: e.n("type-".concat(t.type)),
        h: e.t(t.name),
        i: t.favorite
      }, t.favorite ? {
        j: "c46d9c99-10-" + s,
        k: e.p({
          type: "star-filled",
          size: "16",
          color: "#FFD700"
        })
      } : {}, {
        l: e.t(i.getTypeName(t.type)),
        m: t.uid
      }, t.uid ? {
        n: e.t(i.formatUID(t.uid))
      } : {}, {
        o: t.description
      }, t.description ? {
        p: e.t(t.description)
      } : {}, {
        q: t.tags && t.tags.length > 0
      }, t.tags && t.tags.length > 0 ? {
        r: e.f(t.tags.slice(0, 3), function (t, a, s) {
          return {
            a: e.t(t),
            b: t
          };
        })
      } : {}, {
        s: e.t(i.formatTime(t.modifiedAt || t.createdAt)),
        t: "c46d9c99-11-" + s,
        v: e.o(function (e) {
          return i.deployCard(t);
        }, t.id),
        w: "c46d9c99-12-" + s,
        x: e.o(function (e) {
          return i.showCardMenu(t);
        }, t.id),
        y: t.id,
        z: e.n({
          selected: o.selectedCards.includes(t.id)
        }),
        A: e.o(function (e) {
          return i.selectCard(t);
        }, t.id),
        B: e.o(function (e) {
          return i.toggleCardSelection(t.id);
        }, t.id)
      });
    }),
    t: o.isSelecting,
    v: e.p({
      type: "upload",
      size: "18",
      color: "#666666"
    }),
    w: e.p({
      type: "more-filled",
      size: "18",
      color: "#666666"
    })
  }, {
    x: 0 === i.displayCards.length && !t.loading
  }, 0 !== i.displayCards.length || t.loading ? {} : e.e({
    y: e.p({
      type: "folder-add",
      size: "80",
      color: "#cccccc"
    }),
    z: e.t(o.searchKeyword ? "未找到匹配的卡片" : "暂无卡片数据"),
    A: !o.searchKeyword
  }, o.searchKeyword ? {} : {
    B: e.o(function (e) {
      return o.showAddMenu = !0;
    })
  }), {
    C: t.loading
  }, (t.loading, {}), {
    D: e.o(function () {
      return i.loadMore && i.loadMore.apply(i, arguments);
    }),
    E: o.isSelecting
  }, o.isSelecting ? {
    F: e.o(function () {
      return i.cancelSelection && i.cancelSelection.apply(i, arguments);
    }),
    G: e.t(o.selectedCards.length === i.displayCards.length ? "取消全选" : "全选"),
    H: e.o(function () {
      return i.selectAll && i.selectAll.apply(i, arguments);
    }),
    I: e.t(o.selectedCards.length),
    J: e.o(function () {
      return i.deleteSelected && i.deleteSelected.apply(i, arguments);
    }),
    K: 0 === o.selectedCards.length,
    L: e.t(o.selectedCards.length),
    M: e.o(function () {
      return i.exportSelected && i.exportSelected.apply(i, arguments);
    }),
    N: 0 === o.selectedCards.length
  } : {}, {
    O: o.showAddMenu
  }, o.showAddMenu ? {
    P: e.p({
      type: "close",
      size: "20",
      color: "#999999"
    }),
    Q: e.o(function (e) {
      return o.showAddMenu = !1;
    }),
    R: e.p({
      type: "upload",
      size: "24",
      color: "#007AFF"
    }),
    S: e.o(function () {
      return i.importFromFile && i.importFromFile.apply(i, arguments);
    }),
    T: e.p({
      type: "download",
      size: "24",
      color: "#007AFF"
    }),
    U: e.o(function () {
      return i.importFromSlot && i.importFromSlot.apply(i, arguments);
    }),
    V: e.o(function () {}),
    W: e.o(function (e) {
      return o.showAddMenu = !1;
    })
  } : {}, {
    X: o.showSortMenu
  }, o.showSortMenu ? e.e({
    Y: e.p({
      type: "close",
      size: "20",
      color: "#999999"
    }),
    Z: e.o(function (e) {
      return o.showSortMenu = !1;
    }),
    aa: e.f(o.sortOptions, function (a, s, r) {
      return e.e({
        a: e.t(a.label),
        b: t.sortBy === a.value
      }, t.sortBy === a.value ? {
        c: "c46d9c99-18-" + r,
        d: e.p({
          type: "checkmarkempty",
          size: "18",
          color: "#007AFF"
        })
      } : {}, {
        e: a.value,
        f: e.n({
          active: t.sortBy === a.value
        }),
        g: e.o(function (e) {
          return i.setSortBy(a.value);
        }, a.value)
      });
    }),
    ab: "asc" === t.sortOrder
  }, "asc" === t.sortOrder ? {
    ac: e.p({
      type: "checkmarkempty",
      size: "18",
      color: "#007AFF"
    })
  } : {}, {
    ad: e.n({
      active: "asc" === t.sortOrder
    }),
    ae: e.o(function (e) {
      return i.setSortOrder("asc");
    }),
    af: "desc" === t.sortOrder
  }, "desc" === t.sortOrder ? {
    ag: e.p({
      type: "checkmarkempty",
      size: "18",
      color: "#007AFF"
    })
  } : {}, {
    ah: e.n({
      active: "desc" === t.sortOrder
    }),
    ai: e.o(function (e) {
      return i.setSortOrder("desc");
    }),
    aj: e.o(function () {}),
    ak: e.o(function (e) {
      return o.showSortMenu = !1;
    })
  }) : {});
}], ["__scopeId", "data-v-c46d9c99"]]);wx.createPage(r);