var _regeneratorRuntime2 = require("../../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../../@babel/runtime/helpers/asyncToGenerator");var _toConsumableArray2 = require("../../@babel/runtime/helpers/toConsumableArray");var _objectSpread2 = require("../../@babel/runtime/helpers/objectSpread2");var e = require("../../common/vendor.js"),
  t = require("../../utils/chameleon-protocol.js"),
  r = {
    name: "CardSelectPage",
    data: function data() {
      return {
        slotId: 0,
        mode: "select",
        frequency: null,
        searchQuery: "",
        currentCategory: "all",
        viewMode: "list",
        sortBy: "modified",
        sortOrder: "desc",
        selectedCard: null,
        detailCard: null,
        showSortMenu: !1,
        loading: !1,
        pageSize: 20,
        currentPage: 1,
        sortOptions: [{
          value: "name",
          label: "按名称排序"
        }, {
          value: "created",
          label: "按创建时间"
        }, {
          value: "modified",
          label: "按修改时间"
        }, {
          value: "type",
          label: "按类型排序"
        }]
      };
    },
    computed: _objectSpread2(_objectSpread2(_objectSpread2({}, e.mapState("cards", ["cards"])), e.mapGetters("cards", ["categories"])), {}, {
      filteredCards: function filteredCards() {
        var _this = this;
        var e = this.cards || [];
        if (this.frequency && ("hf" === this.frequency ? e = e.filter(function (e) {
          return 2 === e.getFrequency();
        }) : "lf" === this.frequency && (e = e.filter(function (e) {
          return 1 === e.getFrequency();
        }))), "all" !== this.currentCategory && (e = e.filter(function (e) {
          switch (_this.currentCategory) {
            case "hf":
              return 2 === e.getFrequency();
            case "lf":
              return 1 === e.getFrequency();
            case "mifare_classic":
              return e.isMifareClassic();
            case "mifare_ultralight":
              return e.isMifareUltralight();
            case "em410x":
              return e.tag === t.TagType.EM410X;
            case "ntag":
              return e.isNTAG();
            default:
              return !0;
          }
        })), this.searchQuery.trim()) {
          var _t = this.searchQuery.toLowerCase();
          e = e.filter(function (e) {
            return e.name.toLowerCase().includes(_t) || e.uid.toLowerCase().includes(_t) || e.getTypeString().toLowerCase().includes(_t);
          });
        }
        return e;
      },
      sortedCards: function sortedCards() {
        var _this2 = this;
        var e = _toConsumableArray2(this.filteredCards);
        return e.sort(function (e, t) {
          var r = 0;
          switch (_this2.sortBy) {
            case "name":
              r = e.name.localeCompare(t.name);
              break;
            case "created":
              r = new Date(e.createdAt) - new Date(t.createdAt);
              break;
            case "modified":
              r = new Date(e.modifiedAt) - new Date(t.modifiedAt);
              break;
            case "type":
              r = e.getTypeString().localeCompare(t.getTypeString());
          }
          return "desc" === _this2.sortOrder ? -r : r;
        }), e;
      },
      displayCards: function displayCards() {
        var e = this.currentPage * this.pageSize;
        return this.sortedCards.slice(0, e);
      }
    }),
    onLoad: function onLoad(t) {
      this.slotId = parseInt(t.slotId) || 0, this.mode = t.mode || "select", this.frequency = t.frequency || null;
      var r = "deploy" === this.mode ? "选择卡片部署" : "选择卡片";
      this.frequency && (r += " (".concat(this.frequency.toUpperCase(), ")")), e.index.setNavigationBarTitle({
        title: r
      }), this.initData();
    },
    methods: _objectSpread2(_objectSpread2({}, e.mapActions("cards", ["loadCards"])), {}, {
      initData: function initData() {
        var _this3 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
          return _regeneratorRuntime2().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _this3.loading = !0;
                _context.next = 4;
                return _this3.loadCards();
              case 4:
                _context.next = 9;
                break;
              case 6:
                _context.prev = 6;
                _context.t0 = _context["catch"](0);
                console.error("[CardSelect] 初始化失败:", _context.t0), e.index.showToast({
                  title: "加载失败",
                  icon: "error"
                });
              case 9:
                _context.prev = 9;
                _this3.loading = !1;
                return _context.finish(9);
              case 12:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[0, 6, 9, 12]]);
        }))();
      },
      handleSearch: function handleSearch() {
        this.currentPage = 1;
      },
      selectCategory: function selectCategory(e) {
        this.currentCategory = e, this.currentPage = 1;
      },
      toggleViewMode: function toggleViewMode() {
        this.viewMode = "grid" === this.viewMode ? "list" : "grid";
      },
      setSortBy: function setSortBy(e) {
        this.sortBy === e ? this.sortOrder = "asc" === this.sortOrder ? "desc" : "asc" : (this.sortBy = e, this.sortOrder = "desc"), this.showSortMenu = !1, this.$refs.sortPopup.close();
      },
      loadMore: function loadMore() {
        this.displayCards.length < this.sortedCards.length && this.currentPage++;
      },
      selectCard: function selectCard(e) {
        this.selectedCard = e, "deploy" === this.mode ? this.deployCard() : this.returnResult(e);
      },
      showCardDetails: function showCardDetails(e) {
        this.detailCard = e, this.$refs.detailPopup.open();
      },
      closeCardDetails: function closeCardDetails() {
        this.detailCard = null, this.$refs.detailPopup.close();
      },
      deploySelectedCard: function deploySelectedCard() {
        this.detailCard && (this.selectedCard = this.detailCard, this.closeCardDetails(), this.deployCard());
      },
      deployCard: function deployCard() {
        var _this4 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
          var _t2, _r;
          return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                if (_this4.selectedCard) try {
                  e.index.showLoading({
                    title: "部署中..."
                  });
                  _t2 = encodeURIComponent(JSON.stringify({
                    id: _this4.selectedCard.id,
                    name: _this4.selectedCard.name,
                    uid: _this4.selectedCard.uid,
                    tag: _this4.selectedCard.tag,
                    sak: _this4.selectedCard.sak,
                    atqa: _this4.selectedCard.atqa,
                    ats: _this4.selectedCard.ats,
                    data: _this4.selectedCard.data
                  }));
                  e.index.hideLoading();
                  _r = "/pages/slot-edit/slot-edit?slotId=".concat(_this4.slotId, "&cardData=").concat(_t2, "&isNew=true&fromPackage=true");
                  if (_this4.frequency) _r += "&frequency=".concat(_this4.frequency);else {
                    _r += "&frequency=".concat(2 === _this4.selectedCard.getFrequency() ? "hf" : "lf");
                  }
                  e.index.redirectTo({
                    url: _r
                  });
                } catch (t) {
                  e.index.hideLoading(), console.error("[CardSelect] 部署失败:", t), e.index.showToast({
                    title: "部署失败",
                    icon: "error"
                  });
                } else e.index.showToast({
                  title: "请选择卡片",
                  icon: "error"
                });
              case 1:
              case "end":
                return _context2.stop();
            }
          }, _callee2);
        }))();
      },
      returnResult: function returnResult(t) {
        var r = getCurrentPages(),
          a = r[r.length - 2];
        a && a.$vm.onCardSelected && a.$vm.onCardSelected(t), e.index.navigateBack();
      },
      goToCards: function goToCards() {
        e.index.navigateTo({
          url: "/pages/cards/cards"
        });
      },
      getCardIcon: function getCardIcon(e) {
        return e.isMifareClassic() ? "creditcard" : e.isMifareUltralight() ? "tag" : e.tag === t.TagType.EM410X ? "key" : e.isNTAG() ? "chip" : "creditcard";
      },
      getCardTypeName: function getCardTypeName(e) {
        return e.getTypeString();
      },
      formatUID: function formatUID(e) {
        return e ? e.replace(/(.{2})/g, "$1 ").trim().toUpperCase() : "";
      },
      formatTime: function formatTime(e) {
        if (!e) return "";
        var t = new Date(e),
          r = new Date() - t;
        return r < 6e4 ? "刚刚" : r < 36e5 ? "".concat(Math.floor(r / 6e4), "\u5206\u949F\u524D") : r < 864e5 ? "".concat(Math.floor(r / 36e5), "\u5C0F\u65F6\u524D") : r < 6048e5 ? "".concat(Math.floor(r / 864e5), "\u5929\u524D") : t.toLocaleDateString();
      }
    })
  };if (!Array) {
  (e.resolveComponent("uni-search-bar") + e.resolveComponent("uni-icons") + e.resolveComponent("uni-popup"))();
}Math || (function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-search-bar/uni-search-bar.js";
} + function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
} + function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
})();var a = e._export_sfc(r, [["render", function (t, r, a, d, o, s) {
  return e.e({
    a: e.o(s.handleSearch),
    b: e.o(s.handleSearch),
    c: e.o(function (e) {
      return o.searchQuery = e;
    }),
    d: e.p({
      placeholder: "搜索卡片名称、UID或类型",
      focus: !1,
      "bg-color": "#f8f8f8",
      "cancel-color": "#007AFF",
      modelValue: o.searchQuery
    }),
    e: e.f(t.categories, function (t, r, a) {
      return e.e({
        a: "63df2d62-1-" + a,
        b: e.p({
          type: t.icon,
          size: "16",
          color: o.currentCategory === t.id ? "#007AFF" : "#666"
        }),
        c: e.t(t.name),
        d: t.count > 0
      }, t.count > 0 ? {
        e: e.t(t.count)
      } : {}, {
        f: t.id,
        g: e.n({
          active: o.currentCategory === t.id
        }),
        h: e.o(function (e) {
          return s.selectCategory(t.id);
        }, t.id)
      });
    }),
    f: e.p({
      type: "grid" === o.viewMode ? "list" : "th",
      size: "18",
      color: "#666"
    }),
    g: e.o(function () {
      return s.toggleViewMode && s.toggleViewMode.apply(s, arguments);
    }),
    h: e.p({
      type: "funnel",
      size: "18",
      color: "#666"
    }),
    i: e.o(function (e) {
      return o.showSortMenu = !0;
    }),
    j: 0 === s.displayCards.length
  }, 0 === s.displayCards.length ? {
    k: e.p({
      type: "folder",
      size: "80",
      color: "#ccc"
    }),
    l: e.p({
      type: "plus",
      size: "16",
      color: "#007AFF"
    }),
    m: e.o(function () {
      return s.goToCards && s.goToCards.apply(s, arguments);
    })
  } : "grid" === o.viewMode ? {
    o: e.f(s.displayCards, function (t, r, a) {
      return e.e({
        a: "63df2d62-6-" + a,
        b: e.p({
          type: s.getCardIcon(t),
          size: "24",
          color: "#fff"
        }),
        c: t.color,
        d: e.t(t.name),
        e: e.t(s.getCardTypeName(t)),
        f: t.uid
      }, t.uid ? {
        g: e.t(s.formatUID(t.uid))
      } : {}, {
        h: e.t(2 === t.getFrequency() ? "HF" : "LF"),
        i: e.n(2 === t.getFrequency() ? "hf" : "lf"),
        j: t.id,
        k: e.o(function (e) {
          return s.selectCard(t);
        }, t.id),
        l: e.o(function (e) {
          return s.showCardDetails(t);
        }, t.id)
      });
    })
  } : {
    p: e.f(s.displayCards, function (t, r, a) {
      return e.e({
        a: "63df2d62-7-" + a,
        b: e.p({
          type: s.getCardIcon(t),
          size: "28",
          color: "#fff"
        }),
        c: t.color,
        d: e.t(t.name),
        e: e.t(2 === t.getFrequency() ? "HF" : "LF"),
        f: e.n(2 === t.getFrequency() ? "hf" : "lf"),
        g: e.t(s.getCardTypeName(t)),
        h: t.uid
      }, t.uid ? {
        i: e.t(s.formatUID(t.uid))
      } : {}, {
        j: e.t(s.formatTime(t.modifiedAt)),
        k: "63df2d62-8-" + a,
        l: e.o(function (e) {
          return s.showCardDetails(t);
        }, t.id),
        m: t.id,
        n: e.o(function (e) {
          return s.selectCard(t);
        }, t.id),
        o: e.o(function (e) {
          return s.showCardDetails(t);
        }, t.id)
      });
    }),
    q: e.p({
      type: "eye",
      size: "18",
      color: "#666"
    })
  }, {
    n: "grid" === o.viewMode,
    r: e.o(function () {
      return s.loadMore && s.loadMore.apply(s, arguments);
    }),
    s: "deploy" === o.mode
  }, "deploy" === o.mode ? {
    t: e.t(o.slotId + 1),
    v: e.p({
      type: "upload",
      size: "16",
      color: "#fff"
    }),
    w: !o.selectedCard,
    x: e.o(function () {
      return s.deployCard && s.deployCard.apply(s, arguments);
    })
  } : {}, {
    y: e.p({
      type: "close",
      size: "20",
      color: "#666"
    }),
    z: e.o(function (e) {
      return o.showSortMenu = !1;
    }),
    A: e.f(o.sortOptions, function (t, r, a) {
      return e.e({
        a: e.t(t.label),
        b: o.sortBy === t.value
      }, o.sortBy === t.value ? {
        c: "63df2d62-12-" + a + ",63df2d62-10",
        d: e.p({
          type: "checkmarkempty",
          size: "16",
          color: "#007AFF"
        })
      } : {}, {
        e: t.value,
        f: e.n({
          active: o.sortBy === t.value
        }),
        g: e.o(function (e) {
          return s.setSortBy(t.value);
        }, t.value)
      });
    }),
    B: e.sr("sortPopup", "63df2d62-10"),
    C: e.p({
      type: "bottom"
    }),
    D: o.detailCard
  }, o.detailCard ? e.e({
    E: e.t(o.detailCard.name),
    F: e.p({
      type: "close",
      size: "20",
      color: "#666"
    }),
    G: e.o(function () {
      return s.closeCardDetails && s.closeCardDetails.apply(s, arguments);
    }),
    H: e.t(s.getCardTypeName(o.detailCard)),
    I: o.detailCard.uid
  }, o.detailCard.uid ? {
    J: e.t(o.detailCard.uid)
  } : {}, {
    K: e.t(2 === o.detailCard.getFrequency() ? "HF (13.56MHz)" : "LF (125kHz)"),
    L: e.t(s.formatTime(o.detailCard.createdAt)),
    M: e.t(s.formatTime(o.detailCard.modifiedAt)),
    N: e.o(function () {
      return s.closeCardDetails && s.closeCardDetails.apply(s, arguments);
    }),
    O: "deploy" === o.mode
  }, "deploy" === o.mode ? {
    P: e.o(function () {
      return s.deploySelectedCard && s.deploySelectedCard.apply(s, arguments);
    })
  } : {}) : {}, {
    Q: e.sr("detailPopup", "63df2d62-13"),
    R: e.p({
      type: "center"
    })
  });
}], ["__scopeId", "data-v-63df2d62"]]);wx.createPage(a);