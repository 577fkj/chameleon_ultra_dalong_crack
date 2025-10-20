var _objectSpread2 = require("../../@babel/runtime/helpers/objectSpread2");var a = require("../../common/vendor.js"),
  t = require("../../utils/chameleon-protocol.js"),
  e = {
    name: "SectorDetails",
    components: {
      CardDataViewer: function CardDataViewer() {
        return "../../components/card-data-viewer/card-data-viewer.js";
      }
    },
    data: function data() {
      return {
        cardData: {},
        sectors: [],
        viewMode: "sectors",
        isDataEditing: !1,
        hasUnsavedChanges: !1
      };
    },
    computed: {
      totalSectors: function totalSectors() {
        return this.sectors.length;
      },
      accessibleSectors: function accessibleSectors() {
        return this.sectors.filter(function (a) {
          return a.readable;
        }).length;
      },
      successRate: function successRate() {
        return 0 === this.totalSectors ? 0 : Math.round(this.accessibleSectors / this.totalSectors * 100);
      },
      unifiedCardData: function unifiedCardData() {
        var a = [];
        return this.sectors.forEach(function (t, e) {
          if (t.readable && t.blocks) t.blocks.forEach(function (t) {
            a.push(t);
          });else for (var _r = 0; _r < 4; _r++) a.push(new Array(16).fill(0));
        }), {
          tag: t.TagType.MIFARE_1024,
          uid: this.cardData.uid || [],
          data: a,
          type: this.cardData.type || "Mifare Classic"
        };
      }
    },
    onLoad: function onLoad(a) {
      this.loadCardData();
    },
    methods: {
      loadCardData: function loadCardData() {
        var a = this.$store.state.reader.currentCard;
        a && (this.cardData = a, this.sectors = a.sectors || []);
      },
      onCardDataChanged: function onCardDataChanged(t) {
        this.hasUnsavedChanges = !0;
        var e = [];
        for (var _a = 0; _a < t.data.length; _a += 4) {
          var _r2 = Math.floor(_a / 4),
            o = this.sectors[_r2] || {
              readable: !0
            };
          e.push(_objectSpread2(_objectSpread2({}, o), {}, {
            blocks: t.data.slice(_a, _a + 4)
          }));
        }
        this.sectors = e;
        var r = _objectSpread2(_objectSpread2({}, this.cardData), {}, {
          sectors: e,
          data: t.data,
          modifiedAt: new Date().toISOString()
        });
        this.$store.commit("reader/SET_CURRENT_CARD", r), this.hasUnsavedChanges = !1, a.index.showToast({
          title: "扇区数据已更新",
          icon: "success"
        });
      },
      onEditStart: function onEditStart() {
        this.isDataEditing = !0;
      },
      onEditCancel: function onEditCancel() {
        this.isDataEditing = !1, this.hasUnsavedChanges = !1, this.loadCardData();
      },
      goBack: function goBack() {
        a.index.navigateBack();
      },
      formatUID: function formatUID(a) {
        return a && Array.isArray(a) ? a.map(function (a) {
          return a.toString(16).padStart(2, "0").toUpperCase();
        }).join(" ") : "未知";
      },
      formatKey: function formatKey(a) {
        return a && Array.isArray(a) ? a.map(function (a) {
          return a.toString(16).padStart(2, "0").toUpperCase();
        }).join(" ") : "未知";
      },
      formatBlockData: function formatBlockData(a) {
        return a && Array.isArray(a) ? a.map(function (a) {
          return a.toString(16).padStart(2, "0").toUpperCase();
        }).join(" ") : "无数据";
      },
      formatBlockDataWithKeys: function formatBlockDataWithKeys(a, t, e) {
        return a && Array.isArray(a) ? 3 === t ? this.formatTrailerBlock(a, e) : this.formatBlockData(a) : "无数据";
      },
      formatTrailerBlock: function formatTrailerBlock(a, t) {
        if (!a || !Array.isArray(a) || a.length < 16) return "无数据";
        var e = "",
          r = "",
          o = "";
        return e = t.keyA && Array.isArray(t.keyA) ? t.keyA.map(function (a) {
          return a.toString(16).padStart(2, "0").toUpperCase();
        }).join(" ") : a.slice(0, 6).map(function (a) {
          return a.toString(16).padStart(2, "0").toUpperCase();
        }).join(" "), r = a.slice(6, 10).map(function (a) {
          return a.toString(16).padStart(2, "0").toUpperCase();
        }).join(" "), o = t.keyB && Array.isArray(t.keyB) ? t.keyB.map(function (a) {
          return a.toString(16).padStart(2, "0").toUpperCase();
        }).join(" ") : a.slice(10, 16).map(function (a) {
          return a.toString(16).padStart(2, "0").toUpperCase();
        }).join(" "), "".concat(e, " ").concat(r, " ").concat(o);
      },
      getBlockTypeName: function getBlockTypeName(a) {
        return 3 === a ? "扇区尾块" : 0 === a ? "数据块0" : "\u6570\u636E\u5757".concat(a);
      },
      copyBlockData: function copyBlockData(t) {
        if (!t || !Array.isArray(t)) return void a.index.showToast({
          title: "无数据可复制",
          icon: "none"
        });
        var e = this.formatBlockData(t);
        a.index.setClipboardData({
          data: e,
          success: function success() {
            a.index.showToast({
              title: "块数据已复制",
              icon: "success"
            });
          }
        });
      },
      parseAccessBits: function parseAccessBits(a) {
        if (!a || !Array.isArray(a) || a.length < 16) return "无法解析";
        var t = [a[6], a[7], a[8]],
          e = t[1] >> 4 & 15,
          r = 15 & t[1],
          o = t[2] >> 4 & 15;
        return 0 === e && 0 === r && 0 === o ? "默认访问权限" : 1 === e && 0 === r && 0 === o ? "只读访问" : 0 === e && 1 === r && 0 === o ? "读写访问" : "\u81EA\u5B9A\u4E49\u6743\u9650 (".concat(t.map(function (a) {
          return a.toString(16).padStart(2, "0");
        }).join(" "), ")");
      },
      exportAllData: function exportAllData() {
        var t = {
            cardInfo: this.cardData,
            sectors: this.sectors,
            exportTime: new Date().toISOString()
          },
          e = JSON.stringify(t, null, 2);
        a.index.setClipboardData({
          data: e,
          success: function success() {
            a.index.showToast({
              title: "全部数据已复制",
              icon: "success"
            });
          }
        });
      }
    }
  };if (!Array) {
  (a.resolveComponent("uni-icons") + a.resolveComponent("card-data-viewer"))();
}Math || (function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
} + function () {
  return "../../components/card-data-viewer/card-data-viewer.js";
})();var r = a._export_sfc(e, [["render", function (t, e, r, o, s, i) {
  return a.e({
    a: a.t(s.cardData.type || "未知卡片"),
    b: a.t(i.formatUID(s.cardData.uid)),
    c: a.t(i.accessibleSectors),
    d: a.t(i.totalSectors),
    e: a.t(i.successRate),
    f: a.p({
      type: "download",
      size: "16",
      color: "white"
    }),
    g: a.o(function () {
      return i.exportAllData && i.exportAllData.apply(i, arguments);
    }),
    h: "sectors" === s.viewMode ? 1 : "",
    i: a.o(function (a) {
      return s.viewMode = "sectors";
    }),
    j: "unified" === s.viewMode ? 1 : "",
    k: a.o(function (a) {
      return s.viewMode = "unified";
    }),
    l: "unified" === s.viewMode
  }, "unified" === s.viewMode ? {
    m: a.o(i.onCardDataChanged),
    n: a.o(i.onEditStart),
    o: a.o(i.onEditCancel),
    p: a.p({
      card: i.unifiedCardData,
      editable: !0
    })
  } : {
    q: a.f(s.sectors, function (t, e, r) {
      return a.e({
        a: a.t(e),
        b: "3320a0d2-2-" + r,
        c: a.p({
          type: t.readable ? "checkmarkempty" : "closeempty",
          color: t.readable ? "#4CAF50" : "#f44336",
          size: "16"
        }),
        d: a.t(t.readable ? "可读" : "不可读"),
        e: t.readable && t.blocks
      }, t.readable && t.blocks ? {
        f: a.f(t.blocks, function (o, s, c) {
          return {
            a: a.t(4 * e + s),
            b: a.t(i.getBlockTypeName(s)),
            c: "3320a0d2-3-" + r + "-" + c,
            d: a.o(function (a) {
              return i.copyBlockData(o);
            }, s),
            e: a.t(i.formatBlockDataWithKeys(o, s, t)),
            f: s,
            g: 3 === s ? 1 : "",
            h: s < 3 ? 1 : ""
          };
        }),
        g: a.p({
          type: "paperclip",
          size: "14",
          color: "#007AFF"
        })
      } : {}, {
        h: !t.readable
      }, t.readable ? {} : {
        i: "3320a0d2-4-" + r,
        j: a.p({
          type: "info",
          size: "16",
          color: "#999"
        })
      }, {
        k: e,
        l: t.readable ? 1 : "",
        m: t.readable ? "" : 1
      });
    })
  });
}], ["__scopeId", "data-v-3320a0d2"]]);wx.createPage(r);