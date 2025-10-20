var _typeof2 = require("../../@babel/runtime/helpers/typeof");var _regeneratorRuntime2 = require("../../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../../@babel/runtime/helpers/asyncToGenerator");var _objectSpread2 = require("../../@babel/runtime/helpers/objectSpread2");var a = require("../../common/vendor.js"),
  t = require("../../utils/chameleon-protocol.js"),
  e = {
    name: "CardDetail",
    components: {
      CardDataViewer: function CardDataViewer() {
        return "../../components/card-data-viewer/card-data-viewer.js";
      }
    },
    data: function data() {
      return {
        mode: "view",
        cardId: null,
        formData: {
          name: "",
          tag: t.TagType.UNKNOWN,
          uid: "",
          sak: "",
          atqa: "",
          ats: "",
          color: "#007AFF",
          data: []
        },
        newTag: "",
        sectorsText: "",
        pagesText: "",
        jsonDataText: "",
        isDataEditing: !1,
        hasUnsavedChanges: !1,
        uidError: "",
        jsonError: "",
        showActions: !1,
        cardTypes: [{
          value: t.TagType.EM410X,
          name: "EM410X"
        }, {
          value: t.TagType.MIFARE_1024,
          name: "Mifare Classic 1K"
        }, {
          value: t.TagType.MIFARE_2048,
          name: "Mifare Classic 2K"
        }, {
          value: t.TagType.MIFARE_4096,
          name: "Mifare Classic 4K"
        }, {
          value: t.TagType.NTAG_213,
          name: "NTAG213"
        }, {
          value: t.TagType.NTAG_215,
          name: "NTAG215"
        }, {
          value: t.TagType.NTAG_216,
          name: "NTAG216"
        }],
        colorOptions: [{
          value: "#007AFF",
          name: "蓝色"
        }, {
          value: "#FF3B30",
          name: "红色"
        }, {
          value: "#34C759",
          name: "绿色"
        }, {
          value: "#FF9500",
          name: "橙色"
        }, {
          value: "#AF52DE",
          name: "紫色"
        }, {
          value: "#FF2D92",
          name: "粉色"
        }, {
          value: "#5AC8FA",
          name: "青色"
        }, {
          value: "#FFCC00",
          name: "黄色"
        }]
      };
    },
    computed: _objectSpread2(_objectSpread2(_objectSpread2({}, a.mapState("cards", ["cards"])), a.mapGetters("cards", ["getCardById"])), {}, {
      isEditMode: function isEditMode() {
        return "edit" === this.mode;
      },
      card: function card() {
        return this.getCardById(this.cardId) || {};
      },
      typeInfo: function typeInfo() {
        var a = this.card.tag || this.formData.tag,
          t = this.cardTypes.find(function (t) {
            return t.value === a;
          });
        return {
          name: t ? t.name : "未知类型",
          color: this.card.color || this.formData.color || "#007AFF"
        };
      },
      selectedType: function selectedType() {
        var _this = this;
        return this.cardTypes.find(function (a) {
          return a.value === _this.formData.tag;
        }) || this.cardTypes[0];
      },
      selectedTypeIndex: function selectedTypeIndex() {
        var _this2 = this;
        return this.cardTypes.findIndex(function (a) {
          return a.value === _this2.formData.tag;
        });
      },
      isHFCard: function isHFCard() {
        return this.formData.tag !== t.TagType.EM410X;
      },
      isFormValid: function isFormValid() {
        return this.formData.name.trim().length > 0 && this.formData.uid.trim().length > 0 && /^[0-9A-Fa-f\s]+$/.test(this.formData.uid);
      }
    }),
    onLoad: function onLoad(a) {
      var _this3 = this;
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
        return _regeneratorRuntime2().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _this3.cardId = a.id;
              _this3.mode = a.mode || "view";
              _context.next = 4;
              return _this3.initCards();
            case 4:
              _this3.initViewMode();
            case 5:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))();
    },
    methods: _objectSpread2(_objectSpread2({}, a.mapActions("cards", ["initCards", "createCard", "updateCard", "deleteCard", "cloneCard", "exportCards", "deployCardToSlot"])), {}, {
      onCardDataChanged: function onCardDataChanged(t) {
        var _this4 = this;
        this.hasUnsavedChanges = !0, console.log("🔍 卡片数据变更 - 更新前原始卡片:", this.card), console.log("🔍 卡片数据变更 - 接收到的更新数据:", t), console.log("🔍 卡片数据变更 - 数据块数量:", t.data ? t.data.length : 0);
        var e = t.data.map(function (a, t) {
            if (a instanceof Uint8Array) return a;
            if (Array.isArray(a)) return new Uint8Array(a);
            if (a && "object" == _typeof2(a)) {
              console.warn("🔍 发现异常数据块格式:", a);
              var _e = Object.keys(a);
              if (_e.every(function (a) {
                return !isNaN(parseInt(a));
              })) {
                var _t = [];
                for (var _i = 0; _i < _e.length; _i++) _t[_i] = void 0 !== a[_i] ? a[_i] : 0;
                return new Uint8Array(_t);
              }
              {
                var _a = _this4.card.data && _this4.card.data[t];
                if (_a) {
                  if (_a instanceof Uint8Array) return _a;
                  if (Array.isArray(_a)) return new Uint8Array(_a);
                }
                return new Uint8Array(16);
              }
            }
            return console.warn("🔍 发现未知数据块格式:", a), new Uint8Array(16);
          }),
          i = {
            data: e,
            modifiedAt: new Date().toISOString()
          };
        console.log("🔍 卡片数据变更 - 原始数据类型检查:"), t.data.forEach(function (a, t) {
          console.log("  \u5757".concat(t, ": ").concat(a.constructor.name, ", \u957F\u5EA6: ").concat(a.length));
        }), console.log("🔍 卡片数据变更 - 处理后数据类型检查:"), e.forEach(function (a, t) {
          console.log("  \u5757".concat(t, ": ").concat(a.constructor.name, ", \u957F\u5EA6: ").concat(a.length));
        }), console.log("🔍 卡片数据变更 - 准备保存的updates:", i), this.updateCard({
          id: this.cardId,
          updates: i
        }).then(function () {
          _this4.hasUnsavedChanges = !1, console.log("🔍 卡片数据变更 - 保存后的卡片:", _this4.card), a.index.showToast({
            title: "卡片数据已保存",
            icon: "success"
          });
        }).catch(function (t) {
          console.error("🔍 卡片数据变更 - 保存失败:", t), a.index.showToast({
            title: "保存失败: " + t.message,
            icon: "none"
          });
        });
      },
      onEditStart: function onEditStart() {
        this.isDataEditing = !0;
      },
      onEditCancel: function onEditCancel() {
        this.isDataEditing = !1, this.hasUnsavedChanges = !1;
      },
      initViewMode: function initViewMode() {
        this.card && this.card.id ? this.loadCardData() : (a.index.showToast({
          title: "卡片不存在",
          icon: "error"
        }), setTimeout(function () {
          a.index.navigateBack();
        }, 1500));
      },
      loadCardData: function loadCardData() {
        this.formData = {
          name: this.card.name || "",
          tag: this.card.tag || t.TagType.UNKNOWN,
          uid: this.card.uid || "",
          sak: this.card.sak ? this.card.sak.toString(16).padStart(2, "0") : "",
          atqa: this.card.atqa ? Array.from(this.card.atqa).map(function (a) {
            return a.toString(16).padStart(2, "0");
          }).join(" ") : "",
          ats: this.card.ats ? Array.from(this.card.ats).map(function (a) {
            return a.toString(16).padStart(2, "0");
          }).join(" ") : "",
          color: this.card.color || "#007AFF",
          data: this.card.data || []
        }, this.card.sectors && (this.sectorsText = this.card.sectors.map(function (a) {
          return a.join(" ");
        }).join("\n")), this.card.pages && (this.pagesText = this.card.pages.join("\n")), this.jsonDataText = JSON.stringify(this.card.data || {}, null, 2);
      },
      toggleEditMode: function toggleEditMode() {
        this.isEditMode ? this.cancelEdit() : this.editCard();
      },
      editCard: function editCard() {
        this.mode = "edit", this.loadCardData(), this.showActions = !1;
      },
      cancelEdit: function cancelEdit() {
        this.mode = "view", this.loadCardData(), this.clearErrors();
      },
      saveCard: function saveCard() {
        var _this5 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
          var _t2, _e2;
          return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                if (!_this5.isFormValid) {
                  _context2.next = 17;
                  break;
                }
                _context2.prev = 1;
                _t2 = _this5.validateCardData();
                if (_t2.isValid) {
                  _context2.next = 5;
                  break;
                }
                return _context2.abrupt("return", void a.index.showToast({
                  title: _t2.errors[0],
                  icon: "error"
                }));
              case 5:
                _e2 = _this5.prepareCardData();
                _context2.next = 8;
                return _this5.updateCard({
                  id: _this5.cardId,
                  updates: _e2
                });
              case 8:
                _this5.mode = "view";
                a.index.showToast({
                  title: "卡片更新成功",
                  icon: "success"
                });
                _context2.next = 15;
                break;
              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](1);
                console.error("保存卡片失败:", _context2.t0), a.index.showToast({
                  title: "保存失败",
                  icon: "error"
                });
              case 15:
                _context2.next = 18;
                break;
              case 17:
                a.index.showToast({
                  title: "请检查输入信息",
                  icon: "error"
                });
              case 18:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[1, 12]]);
        }))();
      },
      validateCardData: function validateCardData() {
        var a = [];
        return this.formData.name.trim() || a.push("卡片名称不能为空"), this.formData.uid.trim() ? /^[0-9A-Fa-f\s]+$/.test(this.formData.uid) || a.push("UID格式无效，只能包含十六进制字符和空格") : a.push("UID不能为空"), this.formData.tag === t.TagType.UNKNOWN && a.push("请选择卡片类型"), {
          isValid: 0 === a.length,
          errors: a
        };
      },
      prepareCardData: function prepareCardData() {
        var a = {
          name: this.formData.name.trim(),
          tag: this.formData.tag,
          uid: this.formData.uid.trim(),
          color: this.formData.color,
          data: this.formData.data || []
        };
        return this.isHFCard && (this.formData.sak && (a.sak = parseInt(this.formData.sak, 16)), this.formData.atqa && (a.atqa = new Uint8Array(this.formData.atqa.split(" ").filter(function (a) {
          return a.trim();
        }).map(function (a) {
          return parseInt(a, 16);
        }))), this.formData.ats && (a.ats = new Uint8Array(this.formData.ats.split(" ").filter(function (a) {
          return a.trim();
        }).map(function (a) {
          return parseInt(a, 16);
        })))), a;
      },
      onTypeChange: function onTypeChange(a) {
        var t = this.cardTypes[a.detail.value].value;
        this.formData.tag = t, this.clearTypeSpecificData();
      },
      clearTypeSpecificData: function clearTypeSpecificData() {
        this.formData.tag === t.TagType.EM410X && (this.formData.sak = "", this.formData.atqa = "", this.formData.ats = ""), this.clearErrors();
      },
      onUIDInput: function onUIDInput() {
        this.validateUID();
      },
      validateUID: function validateUID() {
        var a;
        if (this.uidError = "", !this.formData.uid) return;
        var t = this.formData.uid.replace(/\s/g, "");
        switch (this.formData.type) {
          case "mifare_classic":
          case "mifare_ultralight":
            /^[0-9A-Fa-f]{8,20}$/.test(t) || (this.uidError = "UID格式无效，应为4-10字节的十六进制数据");
            break;
          case "em410x":
            /^[0-9A-Fa-f]{10}$/.test(t) || (this.uidError = "EM410X UID应为5字节的十六进制数据");
        }
        if (!this.uidError && t.length > 0) {
          var _e3 = (null == (a = t.match(/.{2}/g)) ? void 0 : a.join(" ")) || t;
          this.formData.uid !== _e3 && (this.formData.uid = _e3);
        }
      },
      onSectorsInput: function onSectorsInput() {
        try {
          var _a2 = this.sectorsText.split("\n").filter(function (a) {
            return a.trim();
          });
          this.formData.sectors = _a2.map(function (a) {
            return a.trim().split(/\s+/).filter(function (a) {
              return a;
            });
          });
        } catch (a) {
          console.error("解析扇区数据失败:", a);
        }
      },
      onJsonDataInput: function onJsonDataInput() {
        this.jsonError = "";
        try {
          this.jsonDataText.trim() ? this.formData.data = JSON.parse(this.jsonDataText) : this.formData.data = {};
        } catch (a) {
          this.jsonError = "JSON格式错误";
        }
      },
      onFavoriteChange: function onFavoriteChange(a) {
        this.formData.favorite = a.detail.value;
      },
      addTag: function addTag() {
        this.newTag.trim() && !this.formData.tags.includes(this.newTag.trim()) && (this.formData.tags.push(this.newTag.trim()), this.newTag = "");
      },
      removeTag: function removeTag(a) {
        this.formData.tags.splice(a, 1);
      },
      duplicateCard: function duplicateCard() {
        var _this6 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
          var _t3;
          return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _t3 = _objectSpread2(_objectSpread2({}, _this6.card), {}, {
                  id: void 0,
                  name: "".concat(_this6.card.name, " - \u526F\u672C"),
                  createdAt: void 0,
                  modifiedAt: void 0
                });
                _context3.next = 4;
                return _this6.createCard(_t3);
              case 4:
                _this6.showActions = !1;
                a.index.showToast({
                  title: "卡片已复制",
                  icon: "success"
                });
                _context3.next = 11;
                break;
              case 8:
                _context3.prev = 8;
                _context3.t0 = _context3["catch"](0);
                console.error("复制卡片失败:", _context3.t0), a.index.showToast({
                  title: "复制失败",
                  icon: "error"
                });
              case 11:
              case "end":
                return _context3.stop();
            }
          }, _callee3, null, [[0, 8]]);
        }))();
      },
      exportCard: function exportCard() {
        var _this7 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4() {
          return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                _this7.showActions = !1, a.index.showToast({
                  title: "功能开发中",
                  icon: "none"
                });
              case 1:
              case "end":
                return _context4.stop();
            }
          }, _callee4);
        }))();
      },
      deployToSlot: function deployToSlot() {
        var _this8 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee6() {
          var t;
          return _regeneratorRuntime2().wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                _this8.showActions = !1;
                t = _this8.$store.state.slots.slots.map(function (a, t) {
                  return "\u5361\u69FD".concat(t + 1, ": ").concat(a.name || "空闲").concat(a.enabled ? " (已占用)" : "");
                });
                a.index.showActionSheet({
                  itemList: t,
                  success: function () {
                    var _success = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5(a) {
                      return _regeneratorRuntime2().wrap(function _callee5$(_context5) {
                        while (1) switch (_context5.prev = _context5.next) {
                          case 0:
                            _context5.prev = 0;
                            _context5.next = 3;
                            return _this8.deployCardToSlot({
                              cardId: _this8.card.id,
                              slotIndex: a.tapIndex
                            });
                          case 3:
                            _context5.next = 8;
                            break;
                          case 5:
                            _context5.prev = 5;
                            _context5.t0 = _context5["catch"](0);
                            console.error("部署卡片失败:", _context5.t0);
                          case 8:
                          case "end":
                            return _context5.stop();
                        }
                      }, _callee5, null, [[0, 5]]);
                    }));
                    function success(_x) {
                      return _success.apply(this, arguments);
                    }
                    return success;
                  }()
                });
              case 3:
              case "end":
                return _context6.stop();
            }
          }, _callee6);
        }))();
      },
      confirmDeleteCard: function confirmDeleteCard() {
        var _this9 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee7() {
          return _regeneratorRuntime2().wrap(function _callee7$(_context7) {
            while (1) switch (_context7.prev = _context7.next) {
              case 0:
                _this9.showActions = !1;
                _context7.next = 3;
                return _this9.showConfirm("确认删除", "\u786E\u5B9A\u8981\u5220\u9664\u5361\u7247\"".concat(_this9.card.name, "\"\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002"));
              case 3:
                if (!_context7.sent) {
                  _context7.next = 14;
                  break;
                }
                _context7.prev = 4;
                _context7.next = 7;
                return _this9.deleteCard(_this9.card.id);
              case 7:
                a.index.showToast({
                  title: "卡片已删除",
                  icon: "success"
                });
                setTimeout(function () {
                  a.index.navigateBack();
                }, 1500);
                _context7.next = 14;
                break;
              case 11:
                _context7.prev = 11;
                _context7.t0 = _context7["catch"](4);
                console.error("删除卡片失败:", _context7.t0);
              case 14:
              case "end":
                return _context7.stop();
            }
          }, _callee7, null, [[4, 11]]);
        }))();
      },
      clearErrors: function clearErrors() {
        this.uidError = "", this.jsonError = "";
      },
      getDataSize: function getDataSize() {
        return this.isEditMode ? JSON.stringify(this.formData.data || {}).length : JSON.stringify(this.card.data || {}).length;
      },
      formatSize: function formatSize(a) {
        return this.$CardDataUtils ? this.$CardDataUtils.formatSize(a) : "".concat(a, " B");
      },
      formatDateTime: function formatDateTime(a) {
        if (!a) return "";
        return new Date(a).toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
      },
      showConfirm: function () {
        var _showConfirm = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee8(t, e) {
          return _regeneratorRuntime2().wrap(function _callee8$(_context8) {
            while (1) switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", new Promise(function (i) {
                  a.index.showModal({
                    title: t,
                    content: e,
                    success: function success(a) {
                      i(a.confirm);
                    }
                  });
                }));
              case 1:
              case "end":
                return _context8.stop();
            }
          }, _callee8);
        }));
        function showConfirm(_x2, _x3) {
          return _showConfirm.apply(this, arguments);
        }
        return showConfirm;
      }()
    })
  };if (!Array) {
  (a.resolveComponent("uni-icons") + a.resolveComponent("card-data-viewer"))();
}Math || (function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
} + function () {
  return "../../components/card-data-viewer/card-data-viewer.js";
})();var i = a._export_sfc(e, [["render", function (t, e, i, o, r, s) {
  return a.e({
    a: a.t(s.isEditMode ? "编辑卡片" : "卡片详情"),
    b: a.p({
      type: s.isEditMode ? "closeempty" : "compose",
      size: "16",
      color: "#ffffff"
    }),
    c: a.t(s.isEditMode ? "取消" : "编辑"),
    d: a.o(function () {
      return s.toggleEditMode && s.toggleEditMode.apply(s, arguments);
    }),
    e: !s.isEditMode
  }, s.isEditMode ? {} : {
    f: a.p({
      type: "more-filled",
      size: "16",
      color: "#ffffff"
    }),
    g: a.o(function (a) {
      return r.showActions = !0;
    })
  }, {
    h: !s.isEditMode
  }, s.isEditMode ? {} : {
    i: a.t(s.typeInfo.name),
    j: s.typeInfo.color
  }, {
    k: s.isEditMode
  }, s.isEditMode ? {
    l: r.formData.name,
    m: a.o(function (a) {
      return r.formData.name = a.detail.value;
    })
  } : {
    n: a.t(s.card.name)
  }, {
    o: s.isEditMode
  }, s.isEditMode ? {
    p: a.t(s.selectedType.name),
    q: r.cardTypes,
    r: s.selectedTypeIndex,
    s: a.o(function () {
      return s.onTypeChange && s.onTypeChange.apply(s, arguments);
    })
  } : {
    t: a.t(s.typeInfo.name)
  }, {
    v: s.isEditMode
  }, s.isEditMode ? {
    w: r.formData.description,
    x: a.o(function (a) {
      return r.formData.description = a.detail.value;
    })
  } : {
    y: a.t(s.card.description || "无描述")
  }, {
    z: s.isEditMode
  }, s.isEditMode ? {
    A: a.f(r.formData.tags, function (t, e, i) {
      return {
        a: a.t(t),
        b: a.o(function (a) {
          return s.removeTag(e);
        }, e),
        c: e
      };
    }),
    B: a.o(function () {
      return s.addTag && s.addTag.apply(s, arguments);
    }),
    C: r.newTag,
    D: a.o(function (a) {
      return r.newTag = a.detail.value;
    })
  } : a.e({
    E: a.f(s.card.tags, function (t, e, i) {
      return {
        a: a.t(t),
        b: t
      };
    }),
    F: !s.card.tags || 0 === s.card.tags.length
  }, (s.card.tags && s.card.tags.length, {})), {
    G: s.isEditMode
  }, s.isEditMode ? {
    H: r.formData.favorite,
    I: a.o(function () {
      return s.onFavoriteChange && s.onFavoriteChange.apply(s, arguments);
    })
  } : {
    J: a.t(s.card.favorite ? "已收藏" : "未收藏")
  }, {
    K: a.t(s.formatSize(s.getDataSize())),
    L: "mifare_classic" === r.formData.type
  }, "mifare_classic" === r.formData.type ? a.e({
    M: s.isEditMode
  }, s.isEditMode ? {
    N: a.o([function (a) {
      return r.formData.uid = a.detail.value;
    }, function () {
      return s.onUIDInput && s.onUIDInput.apply(s, arguments);
    }]),
    O: r.formData.uid
  } : {
    P: a.t(s.card.uid || "未设置")
  }, {
    Q: r.uidError
  }, r.uidError ? {
    R: a.t(r.uidError)
  } : {}, {
    S: s.isEditMode
  }, s.isEditMode ? {
    T: r.formData.sak,
    U: a.o(function (a) {
      return r.formData.sak = a.detail.value;
    })
  } : {
    V: a.t(s.card.sak || "未设置")
  }, {
    W: s.isEditMode
  }, s.isEditMode ? {
    X: r.formData.atqa,
    Y: a.o(function (a) {
      return r.formData.atqa = a.detail.value;
    })
  } : {
    Z: a.t(s.card.atqa || "未设置")
  }, {
    aa: s.isEditMode
  }, s.isEditMode ? {
    ab: a.o([function (a) {
      return r.sectorsText = a.detail.value;
    }, function () {
      return s.onSectorsInput && s.onSectorsInput.apply(s, arguments);
    }]),
    ac: r.sectorsText
  } : {
    ad: a.o(s.onCardDataChanged),
    ae: a.o(s.onEditStart),
    af: a.o(s.onEditCancel),
    ag: a.p({
      card: s.card,
      editable: !0
    })
  }) : "em410x" === r.formData.type ? a.e({
    ai: s.isEditMode
  }, s.isEditMode ? {
    aj: a.o([function (a) {
      return r.formData.uid = a.detail.value;
    }, function () {
      return s.onUIDInput && s.onUIDInput.apply(s, arguments);
    }]),
    ak: r.formData.uid
  } : {
    al: a.t(s.card.uid || "未设置")
  }, {
    am: r.uidError
  }, r.uidError ? {
    an: a.t(r.uidError)
  } : {}, {
    ao: s.isEditMode
  }, s.isEditMode ? {
    ap: r.formData.rawData,
    aq: a.o(function (a) {
      return r.formData.rawData = a.detail.value;
    })
  } : {
    ar: a.o(s.onCardDataChanged),
    as: a.o(s.onEditStart),
    at: a.o(s.onEditCancel),
    av: a.p({
      card: s.card,
      editable: !0
    })
  }) : a.e({
    aw: s.isEditMode
  }, s.isEditMode ? a.e({
    ax: a.o([function (a) {
      return r.jsonDataText = a.detail.value;
    }, function () {
      return s.onJsonDataInput && s.onJsonDataInput.apply(s, arguments);
    }]),
    ay: r.jsonDataText,
    az: r.jsonError
  }, r.jsonError ? {
    aA: a.t(r.jsonError)
  } : {}) : {
    aB: a.o(s.onCardDataChanged),
    aC: a.o(s.onEditStart),
    aD: a.o(s.onEditCancel),
    aE: a.p({
      card: s.card,
      editable: !0
    })
  }), {
    ah: "em410x" === r.formData.type,
    aF: a.t(s.card.id),
    aG: a.t(s.formatDateTime(s.card.createdAt)),
    aH: a.t(s.formatDateTime(s.card.modifiedAt || s.card.createdAt)),
    aI: a.t(s.formatSize(s.getDataSize())),
    aJ: s.isEditMode
  }, s.isEditMode ? {
    aK: a.p({
      type: "closeempty",
      size: "16",
      color: "#333333"
    }),
    aL: a.o(function () {
      return s.cancelEdit && s.cancelEdit.apply(s, arguments);
    }),
    aM: a.p({
      type: "checkmarkempty",
      size: "16",
      color: "#ffffff"
    }),
    aN: a.o(function () {
      return s.saveCard && s.saveCard.apply(s, arguments);
    }),
    aO: !s.isFormValid
  } : {}, {
    aP: !s.isEditMode
  }, s.isEditMode ? {} : {
    aQ: a.p({
      type: "download",
      size: "16",
      color: "#007AFF"
    }),
    aR: a.o(function () {
      return s.deployToSlot && s.deployToSlot.apply(s, arguments);
    }),
    aS: a.p({
      type: "paperclip",
      size: "16",
      color: "#007AFF"
    }),
    aT: a.o(function () {
      return s.duplicateCard && s.duplicateCard.apply(s, arguments);
    }),
    aU: a.p({
      type: "upload",
      size: "16",
      color: "#007AFF"
    }),
    aV: a.o(function () {
      return s.exportCard && s.exportCard.apply(s, arguments);
    })
  }, {
    aW: r.showActions
  }, r.showActions ? {
    aX: a.o(function (a) {
      return r.showActions = !1;
    }),
    aY: a.o(function () {
      return s.editCard && s.editCard.apply(s, arguments);
    }),
    aZ: a.o(function () {
      return s.duplicateCard && s.duplicateCard.apply(s, arguments);
    }),
    ba: a.o(function () {
      return s.exportCard && s.exportCard.apply(s, arguments);
    }),
    bb: a.o(function () {
      return s.deployToSlot && s.deployToSlot.apply(s, arguments);
    }),
    bc: a.o(function () {
      return s.confirmDeleteCard && s.confirmDeleteCard.apply(s, arguments);
    }),
    bd: a.o(function () {}),
    be: a.o(function (a) {
      return r.showActions = !1;
    })
  } : {});
}], ["__scopeId", "data-v-fdb5dbe3"]]);wx.createPage(i);