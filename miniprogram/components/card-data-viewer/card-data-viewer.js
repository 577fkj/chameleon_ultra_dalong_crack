var _createForOfIteratorHelper2 = require("../../@babel/runtime/helpers/createForOfIteratorHelper");var _objectSpread2 = require("../../@babel/runtime/helpers/objectSpread2");var _typeof2 = require("../../@babel/runtime/helpers/typeof");var _toConsumableArray2 = require("../../@babel/runtime/helpers/toConsumableArray");var t = require("../../common/vendor.js"),
  e = require("../../utils/chameleon-protocol.js"),
  i = {
    name: "CardDataViewer",
    props: {
      card: {
        type: Object,
        required: !0
      },
      editable: {
        type: Boolean,
        default: !1
      }
    },
    data: function data() {
      return {
        isEditing: !1,
        editableCard: null,
        editingBlock: null,
        editingPage: null,
        tempEditValue: "",
        quickEditValue: "",
        showEditDialog: !1
      };
    },
    computed: {
      isMifareClassic: function isMifareClassic() {
        return this.card.tag === e.TagType.MIFARE_1024 || this.card.tag === e.TagType.MIFARE_2048 || this.card.tag === e.TagType.MIFARE_4096;
      },
      isNTAG: function isNTAG() {
        return this.card.tag === e.TagType.NTAG_213 || this.card.tag === e.TagType.NTAG_215 || this.card.tag === e.TagType.NTAG_216;
      },
      isEM410X: function isEM410X() {
        return this.card.tag === e.TagType.EM410X;
      },
      displayCard: function displayCard() {
        return this.isEditing ? this.editableCard : this.card;
      },
      quickEditPlaceholder: function quickEditPlaceholder() {
        return "\u8BF7\u8F93\u5165\u5B8C\u6574\u7684\u5361\u7247\u6570\u636E\uFF0C\u6BCF\u884C\u4EE3\u8868\u4E00\u4E2A".concat(this.isMifareClassic ? "块" : "页面", "\u7684\u6570\u636E\n\u4F8B\u5982:\nFF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF\n00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00");
      },
      sectors: function sectors() {
        if (!this.isMifareClassic || !this.displayCard.data) return [];
        var t = [];
        for (var _e = 0; _e < this.displayCard.data.length; _e += 4) {
          var _i = this.displayCard.data.slice(_e, _e + 4);
          t.push(_i);
        }
        return t;
      },
      pages: function pages() {
        return this.isNTAG && this.displayCard.data ? this.displayCard.data : [];
      },
      sectorCount: function sectorCount() {
        return this.sectors.length;
      },
      blockCount: function blockCount() {
        return this.getAllBlocks.length;
      },
      pageCount: function pageCount() {
        return this.pages.length;
      },
      getAllBlocks: function getAllBlocks() {
        if (this.isMifareClassic) {
          if (this.displayCard.data && this.displayCard.data.length > 0) return this.displayCard.data;
          if (this.displayCard.sectors && this.displayCard.sectors.length > 0) {
            var _t = [];
            return this.displayCard.sectors.forEach(function (e) {
              e.blocks && e.blocks.length > 0 ? _t.push.apply(_t, _toConsumableArray2(e.blocks)) : Array.isArray(e) && e.length > 0 && _t.push.apply(_t, _toConsumableArray2(e));
            }), _t;
          }
          {
            var _t2 = [];
            return this.sectors.forEach(function (e) {
              _t2.push.apply(_t2, _toConsumableArray2(e));
            }), _t2;
          }
        }
        return this.displayCard.pages && this.displayCard.pages.length > 0 ? this.displayCard.pages : this.displayCard.data && this.displayCard.data.length > 0 ? this.displayCard.data : this.pages;
      },
      dataSize: function dataSize() {
        return this.card.data ? this.card.data.reduce(function (t, e) {
          return t + (e.length || 0);
        }, 0) : 0;
      }
    },
    watch: {
      card: {
        handler: function handler(t) {
          t && !this.isEditing && (this.editableCard = this.deepCloneCard(t));
        },
        immediate: !0,
        deep: !0
      }
    },
    methods: {
      convertToArray: function convertToArray(t) {
        if (!t) return [];
        if (Array.isArray(t)) return t;
        if ("object" == _typeof2(t)) {
          if ("number" == typeof t.length) return Array.from(t);
          return Object.keys(t).map(function (t) {
            return parseInt(t);
          }).filter(function (t) {
            return !isNaN(t);
          }).sort(function (t, e) {
            return t - e;
          }).map(function (e) {
            return t[e];
          });
        }
        return [];
      },
      formatBlockData: function formatBlockData(t) {
        try {
          var _e2 = this.convertToArray(t);
          return 0 === _e2.length ? "无数据" : _e2.map(function (t) {
            return t.toString(16).padStart(2, "0").toUpperCase();
          }).join(" ");
        } catch (e) {
          return console.error("formatBlockData error:", e, t), "数据错误";
        }
      },
      formatPageData: function formatPageData(t) {
        return this.formatBlockData(t);
      },
      getBlockTypeName: function getBlockTypeName(t) {
        return 3 === t ? "扇区尾块" : "数据块";
      },
      getPageTypeName: function getPageTypeName(t) {
        return t < 4 ? "头部页面" : t >= this.pageCount - 5 ? "配置页面" : "用户页面";
      },
      formatKeyA: function formatKeyA(t) {
        try {
          var _e3 = this.convertToArray(t);
          if (_e3.length < 6) return "未知";
          return _e3.slice(0, 6).map(function (t) {
            return t.toString(16).padStart(2, "0").toUpperCase();
          }).join(" ");
        } catch (e) {
          return console.error("formatKeyA error:", e, t), "未知";
        }
      },
      formatKeyB: function formatKeyB(t) {
        try {
          var _e4 = this.convertToArray(t);
          if (_e4.length < 16) return "未知";
          return _e4.slice(10, 16).map(function (t) {
            return t.toString(16).padStart(2, "0").toUpperCase();
          }).join(" ");
        } catch (e) {
          return console.error("formatKeyB error:", e, t), "未知";
        }
      },
      formatAccessBits: function formatAccessBits(t) {
        try {
          var _e5 = this.convertToArray(t);
          if (_e5.length < 10) return "未知";
          return _e5.slice(6, 10).map(function (t) {
            return t.toString(16).padStart(2, "0").toUpperCase();
          }).join(" ");
        } catch (e) {
          return console.error("formatAccessBits error:", e, t), "未知";
        }
      },
      formatUID: function formatUID(t) {
        try {
          var _e6 = this.convertToArray(t);
          if (_e6.length < 4) return "未知";
          return _e6.slice(0, 4).map(function (t) {
            return t.toString(16).padStart(2, "0").toUpperCase();
          }).join(" ");
        } catch (e) {
          return console.error("formatUID error:", e, t), "未知";
        }
      },
      formatEM410XData: function formatEM410XData() {
        if (!this.card.data || 0 === this.card.data.length) return "无数据";
        var t = this.card.data[0];
        return this.formatBlockData(t);
      },
      copyEMData: function copyEMData() {
        var e = "EM410X\u6570\u636E:\n\u5B8C\u6574\u6570\u636E: ".concat(this.formatEM410XData(), "\nUID: ").concat(this.card.uid);
        t.index.setClipboardData({
          data: e,
          success: function success() {
            t.index.showToast({
              title: "已复制EM410X数据",
              icon: "success"
            });
          }
        });
      },
      copyAllData: function copyAllData() {
        var _this = this;
        if (!this.card.data || 0 === this.card.data.length) return void t.index.showToast({
          title: "无数据可复制",
          icon: "none"
        });
        var e = this.card.data.map(function (t, e) {
          return "\u5757 ".concat(e, ": ").concat(_this.formatBlockData(t));
        }).join("\n");
        t.index.setClipboardData({
          data: e,
          success: function success() {
            t.index.showToast({
              title: "已复制全部数据",
              icon: "success"
            });
          }
        });
      },
      copyBlockData: function copyBlockData(e) {
        var i = this.formatBlockData(e);
        t.index.setClipboardData({
          data: i,
          success: function success() {
            t.index.showToast({
              title: "已复制到剪贴板",
              icon: "success"
            });
          }
        });
      },
      copyPageData: function copyPageData(t) {
        this.copyBlockData(t);
      },
      deepCloneCard: function deepCloneCard(t) {
        var e = _objectSpread2(_objectSpread2({}, t), {}, {
          data: t.data ? t.data.map(function (t) {
            if (t instanceof Uint8Array) return Array.from(t);
            if (Array.isArray(t)) return _toConsumableArray2(t);
            if (t && "object" == _typeof2(t)) {
              var _e7 = Object.keys(t);
              if (_e7.every(function (t) {
                return !isNaN(parseInt(t));
              })) {
                var _i2 = [];
                for (var _a = 0; _a < _e7.length; _a++) _i2[_a] = t[_a];
                return _i2;
              }
            }
            return console.warn("🔍 deepCloneCard - 未知数据块格式:", t), [];
          }) : []
        });
        return console.log("🔍 deepCloneCard - 原始数据:", t.data ? t.data.length : 0, "块"), console.log("🔍 deepCloneCard - 克隆数据:", e.data ? e.data.length : 0, "块"), e;
      },
      startEditing: function startEditing() {
        this.isEditing = !0, this.editableCard = this.deepCloneCard(this.card), this.editableCard.data || (this.editableCard.data = []), console.log("🔍 开始编辑 - 原始卡片:", this.card), console.log("🔍 开始编辑 - 克隆后的editableCard:", this.editableCard), console.log("🔍 开始编辑 - 原始数据块数量:", this.card.data ? this.card.data.length : 0), console.log("🔍 开始编辑 - 克隆数据块数量:", this.editableCard.data ? this.editableCard.data.length : 0), this.$emit("edit-start");
      },
      saveChanges: function saveChanges() {
        this.exitEditing();
      },
      exitEditing: function exitEditing() {
        this.isEditing = !1, console.log("🔍 退出编辑 - 原始卡片数据:", this.card), console.log("🔍 退出编辑 - 编辑后数据:", this.editableCard), console.log("🔍 退出编辑 - 数据块数量:", this.editableCard.data ? this.editableCard.data.length : 0), this.$emit("data-changed", this.editableCard), t.index.showToast({
          title: "编辑完成，数据已保存",
          icon: "success"
        });
      },
      editBlock: function editBlock(t, e, i) {
        this.editingBlock = {
          sectorIndex: t,
          blockIndex: e
        }, this.editingPage = null, this.tempEditValue = this.formatBlockData(i), this.$refs.editPopup.open();
      },
      editPage: function editPage(t, e) {
        this.editingPage = {
          pageIndex: t
        }, this.editingBlock = null, this.tempEditValue = this.formatPageData(e), this.$refs.editPopup.open();
      },
      isPageEditable: function isPageEditable(t) {
        return t >= 4 && t < this.pageCount - 5;
      },
      openQuickEdit: function openQuickEdit() {
        this.quickEditValue = this.convertCardDataToText(), this.$refs.quickEditPopup.open();
      },
      convertCardDataToText: function convertCardDataToText() {
        var _this2 = this;
        return this.getAllBlocks.map(function (t) {
          return _this2.convertToArray(t).map(function (t) {
            return t.toString(16).padStart(2, "0").toUpperCase();
          }).join(" ");
        }).join("\n");
      },
      isValidQuickEditData: function isValidQuickEditData() {
        if (!this.quickEditValue.trim()) return !1;
        var t = this.quickEditValue.trim().split("\n"),
          e = this.getAllBlocks.length;
        if (t.length !== e) return !1;
        var _iterator = _createForOfIteratorHelper2(t),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _i3 = _step.value;
            var _t3 = _i3.replace(/\s+/g, "").toUpperCase();
            if (!/^[0-9A-F]{32}$/.test(_t3)) return !1;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        return !0;
      },
      getQuickEditValidationMessage: function getQuickEditValidationMessage() {
        if (!this.quickEditValue.trim()) return "请输入数据";
        var t = this.quickEditValue.trim().split("\n"),
          e = this.getAllBlocks.length;
        if (t.length !== e) return "\u9700\u8981".concat(e, "\u884C\u6570\u636E\uFF0C\u5F53\u524D: ").concat(t.length, "\u884C");
        for (var _i4 = 0; _i4 < t.length; _i4++) {
          var _e8 = t[_i4].replace(/\s+/g, "").toUpperCase();
          if (!/^[0-9A-F]{32}$/.test(_e8)) return "\u7B2C".concat(_i4 + 1, "\u884C\u6570\u636E\u683C\u5F0F\u9519\u8BEF\uFF0C\u9700\u898132\u4E2A\u5341\u516D\u8FDB\u5236\u5B57\u7B26");
        }
        return "数据格式正确";
      },
      closeQuickEditDialog: function closeQuickEditDialog() {
        this.$refs.quickEditPopup.close(), this.quickEditValue = "";
      },
      confirmQuickEdit: function confirmQuickEdit() {
        if (!this.isValidQuickEditData()) return void t.index.showToast({
          title: "数据格式不正确",
          icon: "none"
        });
        var e = this.quickEditValue.trim().split("\n").map(function (t) {
          var e = t.replace(/\s+/g, "").toUpperCase(),
            i = [];
          for (var _a2 = 0; _a2 < e.length; _a2 += 2) i.push(parseInt(e.substr(_a2, 2), 16));
          return i;
        });
        this.editableCard || (this.editableCard = this.deepCloneCard(this.card)), this.editableCard.data = e, this.isEditing = !0, this.closeQuickEditDialog(), t.index.showToast({
          title: '数据已更新，请点击"退出编辑"保存',
          icon: "success"
        });
      },
      isValidHexData: function isValidHexData() {
        if (!this.tempEditValue) return !1;
        var t = this.tempEditValue.replace(/\s+/g, "").toUpperCase();
        return !!/^[0-9A-F]*$/.test(t) && t.length % 2 == 0 && 32 === t.length;
      },
      getValidationMessage: function getValidationMessage() {
        if (!this.tempEditValue) return "请输入数据";
        var t = this.tempEditValue.replace(/\s+/g, "").toUpperCase();
        return /^[0-9A-F\s]*$/.test(this.tempEditValue) ? t.length % 2 != 0 ? "十六进制字符数必须为偶数" : 32 !== t.length ? "\u9700\u898116\u5B57\u8282\u6570\u636E (32\u4E2A\u5B57\u7B26)\uFF0C\u5F53\u524D: ".concat(t.length, "\u4E2A\u5B57\u7B26") : "数据格式正确" : "只能包含十六进制字符 (0-9, A-F) 和空格";
      },
      closeEditDialog: function closeEditDialog() {
        this.$refs.editPopup.close(), this.editingBlock = null, this.editingPage = null, this.tempEditValue = "";
      },
      confirmEdit: function confirmEdit() {
        if (!this.isValidHexData()) return void t.index.showToast({
          title: "数据格式不正确",
          icon: "none"
        });
        var e = this.tempEditValue.replace(/\s+/g, "").toUpperCase(),
          i = [];
        for (var _t4 = 0; _t4 < e.length; _t4 += 2) i.push(parseInt(e.substr(_t4, 2), 16));
        console.log("🔍 确认编辑 - 编辑前editableCard数据块数量:", this.editableCard.data ? this.editableCard.data.length : 0), console.log("🔍 确认编辑 - 要更新的字节数据:", i), this.editingBlock ? (console.log("🔍 确认编辑 - 更新块:", this.editingBlock.sectorIndex, this.editingBlock.blockIndex), this.updateBlockData(this.editingBlock.sectorIndex, this.editingBlock.blockIndex, i)) : this.editingPage && (console.log("🔍 确认编辑 - 更新页面:", this.editingPage.pageIndex), this.updatePageData(this.editingPage.pageIndex, i)), console.log("🔍 确认编辑 - 编辑后editableCard数据块数量:", this.editableCard.data ? this.editableCard.data.length : 0), console.log("🔍 确认编辑 - 编辑后editableCard:", this.editableCard), this.closeEditDialog(), t.index.showToast({
          title: "数据已更新",
          icon: "success"
        });
      },
      updateBlockData: function updateBlockData(t, e, i) {
        this.editableCard.data || (this.editableCard.data = []);
        var a = 4 * t + e;
        console.log("🔍 updateBlockData - 块位置:", a, "当前数组长度:", this.editableCard.data.length), a < this.editableCard.data.length ? (this.$set(this.editableCard.data, a, i), console.log("🔍 updateBlockData - 更新现有块:", a)) : console.warn("🔍 updateBlockData - 块位置超出范围:", a, "数组长度:", this.editableCard.data.length), console.log("🔍 updateBlockData - 更新后的数据:", this.editableCard.data[a]);
      },
      updatePageData: function updatePageData(t, e) {
        this.editableCard.data || (this.editableCard.data = []), console.log("🔍 updatePageData - 页面索引:", t, "当前数组长度:", this.editableCard.data.length), t < this.editableCard.data.length ? (this.$set(this.editableCard.data, t, e), console.log("🔍 updatePageData - 更新现有页面:", t)) : console.warn("🔍 updatePageData - 页面索引超出范围:", t, "数组长度:", this.editableCard.data.length), console.log("🔍 updatePageData - 更新后的数据:", this.editableCard.data[t]);
      }
    }
  };if (!Array) {
  (t.resolveComponent("uni-icons") + t.resolveComponent("uni-popup"))();
}Math || (function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
} + function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
})();var a = t._export_sfc(i, [["render", function (e, i, a, s, r, o) {
  return t.e({
    a: o.isMifareClassic
  }, o.isMifareClassic ? t.e({
    b: a.editable
  }, a.editable ? t.e({
    c: !r.isEditing
  }, r.isEditing ? {} : {
    d: t.p({
      type: "compose",
      size: "20",
      color: "#FFF"
    }),
    e: t.o(function () {
      return o.openQuickEdit && o.openQuickEdit.apply(o, arguments);
    })
  }, {
    f: !r.isEditing
  }, r.isEditing ? {
    i: t.p({
      type: "checkmarkempty",
      size: "20",
      color: "#FFF"
    }),
    j: t.o(function () {
      return o.exitEditing && o.exitEditing.apply(o, arguments);
    })
  } : {
    g: t.p({
      type: "gear",
      size: "20",
      color: "#FFF"
    }),
    h: t.o(function () {
      return o.startEditing && o.startEditing.apply(o, arguments);
    })
  }) : {}, {
    k: r.isEditing
  }, (r.isEditing, {}), {
    l: t.f(o.sectors, function (e, i, a) {
      return {
        a: t.f(e, function (e, s, d) {
          return t.e({
            a: 0 === s
          }, 0 === s ? {
            b: t.t(i)
          } : {}, {
            c: t.t(4 * i + s),
            d: t.t(o.formatBlockData(e))
          }, r.isEditing ? {
            e: "b99b25cd-3-" + a + "-" + d,
            f: t.p({
              type: "compose",
              size: "18",
              color: "#FFF"
            }),
            g: t.o(function (t) {
              return o.editBlock(i, s, e);
            }, "".concat(i, "-").concat(s))
          } : {}, {
            h: "".concat(i, "-").concat(s),
            i: 3 === s ? 1 : "",
            j: s < 3 ? 1 : ""
          });
        }),
        b: i
      };
    }),
    m: r.isEditing
  }) : o.isNTAG ? t.e({
    o: a.editable
  }, a.editable ? t.e({
    p: !r.isEditing
  }, r.isEditing ? {} : {
    q: t.p({
      type: "compose",
      size: "20",
      color: "#FFF"
    }),
    r: t.o(function () {
      return o.openQuickEdit && o.openQuickEdit.apply(o, arguments);
    })
  }, {
    s: !r.isEditing
  }, r.isEditing ? {
    w: t.p({
      type: "checkmarkempty",
      size: "20",
      color: "#FFF"
    }),
    x: t.o(function () {
      return o.exitEditing && o.exitEditing.apply(o, arguments);
    })
  } : {
    t: t.p({
      type: "gear",
      size: "20",
      color: "#FFF"
    }),
    v: t.o(function () {
      return o.startEditing && o.startEditing.apply(o, arguments);
    })
  }) : {}, {
    y: r.isEditing
  }, (r.isEditing, {}), {
    z: t.f(o.pages, function (e, i, a) {
      return t.e({
        a: 0 === i
      }, (0 === i || 4 === i || o.pageCount, {}), {
        b: 4 === i,
        c: i === o.pageCount - 5,
        d: t.t(i),
        e: t.t(o.formatPageData(e)),
        f: 0 === i
      }, 0 === i ? {
        g: t.t(o.formatUID(e))
      } : {}, r.isEditing ? t.e({
        h: o.isPageEditable(i)
      }, o.isPageEditable(i) ? {
        i: "b99b25cd-7-" + a,
        j: t.p({
          type: "compose",
          size: "18",
          color: "#FFF"
        }),
        k: t.o(function (t) {
          return o.editPage(i, e);
        }, i)
      } : {}) : {}, {
        l: i,
        m: i < 4 ? 1 : "",
        n: i >= 4 && i < o.pageCount - 5 ? 1 : "",
        o: i >= o.pageCount - 5 ? 1 : ""
      });
    }),
    A: r.isEditing
  }) : o.isEM410X ? t.e({
    C: a.editable
  }, a.editable ? {
    D: t.p({
      type: "paperclip",
      size: "20",
      color: "#FFF"
    }),
    E: t.o(function (t) {
      return o.copyEMData();
    })
  } : {}, {
    F: t.t(o.formatEM410XData()),
    G: t.t(a.card.uid)
  }) : t.e({
    H: a.editable
  }, a.editable ? {
    I: t.p({
      type: "paperclip",
      size: "20",
      color: "#FFF"
    }),
    J: t.o(function (t) {
      return o.copyAllData();
    })
  } : {}, {
    K: t.f(a.card.data, function (e, i, a) {
      return {
        a: t.t(i),
        b: t.t(o.formatBlockData(e)),
        c: i
      };
    })
  }), {
    n: o.isNTAG,
    B: o.isEM410X,
    L: t.t(a.card.type || "卡片数据"),
    M: o.quickEditPlaceholder,
    N: r.quickEditValue,
    O: t.o(function (t) {
      return r.quickEditValue = t.detail.value;
    }),
    P: t.t(o.isMifareClassic ? "块" : "页面"),
    Q: t.t(o.getAllBlocks.length),
    R: t.t(o.getQuickEditValidationMessage()),
    S: o.isValidQuickEditData ? "" : 1,
    T: t.o(function () {
      return o.closeQuickEditDialog && o.closeQuickEditDialog.apply(o, arguments);
    }),
    U: !o.isValidQuickEditData,
    V: t.o(function () {
      return o.confirmQuickEdit && o.confirmQuickEdit.apply(o, arguments);
    }),
    W: t.sr("quickEditPopup", "b99b25cd-10"),
    X: t.p({
      type: "dialog",
      "mask-click": !1
    }),
    Y: t.t(r.editingBlock ? "\u7F16\u8F91\u5757 ".concat(4 * r.editingBlock.sectorIndex + r.editingBlock.blockIndex) : r.editingPage ? "\u7F16\u8F91\u9875\u9762 ".concat(r.editingPage.pageIndex) : "编辑数据"),
    Z: (r.editingBlock && r.editingBlock.blockIndex, 47),
    aa: r.tempEditValue,
    ab: t.o(function (t) {
      return r.tempEditValue = t.detail.value;
    }),
    ac: t.t(r.editingBlock && 3 === r.editingBlock.blockIndex ? "扇区尾块格式: KeyA(6字节) + 访问位(4字节) + KeyB(6字节)" : "请输入16字节的十六进制数据"),
    ad: t.t(o.getValidationMessage()),
    ae: o.isValidHexData ? "" : 1,
    af: t.o(function () {
      return o.closeEditDialog && o.closeEditDialog.apply(o, arguments);
    }),
    ag: !o.isValidHexData,
    ah: t.o(function () {
      return o.confirmEdit && o.confirmEdit.apply(o, arguments);
    }),
    ai: t.sr("editPopup", "b99b25cd-11"),
    aj: t.p({
      type: "dialog",
      "mask-click": !1
    })
  });
}], ["__scopeId", "data-v-b99b25cd"]]);wx.createComponent(a);