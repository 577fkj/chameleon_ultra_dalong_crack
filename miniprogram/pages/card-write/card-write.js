var _defineProperty2 = require("../../@babel/runtime/helpers/defineProperty");var _regeneratorRuntime2 = require("../../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../../@babel/runtime/helpers/asyncToGenerator");var _objectSpread2 = require("../../@babel/runtime/helpers/objectSpread2");var e = require("../../common/vendor.js"),
  t = require("../../utils/chameleon-protocol.js"),
  r = require("../../services/bluetooth.js"),
  i = {
    name: "CardWritePage",
    data: function data() {
      return {
        currentStep: 0,
        steps: [{
          title: "选择卡片"
        }, {
          title: "检测魔术卡"
        }, {
          title: "写入数据"
        }],
        selectedCard: null,
        availableCards: [],
        detecting: !1,
        magicCardDetected: !1,
        detectedMagicType: null,
        isCardCompatible: !0,
        writeProgress: -1,
        currentWriteStep: "",
        writeETA: "",
        writeErrors: [],
        writeWarnings: []
      };
    },
    computed: _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, e.mapState("device", ["isConnected"])), e.mapState("reader", ["isReaderMode"])), e.mapGetters("cards", ["allCards"])), {}, {
      canProceed: function canProceed() {
        switch (this.currentStep) {
          case 0:
            return null !== this.selectedCard;
          case 1:
            return this.magicCardDetected;
          default:
            return !1;
        }
      },
      canWrite: function canWrite() {
        return this.isConnected && this.selectedCard && this.magicCardDetected;
      }
    }),
    onLoad: function onLoad(t) {
      var _this = this;
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
        var _e;
        return _regeneratorRuntime2().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this.loadAvailableCards();
            case 2:
              _context.next = 4;
              return _this.checkReaderMode();
            case 4:
              if (!t.cardId) {
                _context.next = 7;
                break;
              }
              _e = _this.availableCards.find(function (e) {
                return e.id === t.cardId;
              });
              _e ? (_this.selectedCard = _e, console.log("[CardWrite] 预选卡片:", _e.name), _this.isConnected && _this.isReaderMode && setTimeout(function () {
                _this.currentStep = 1;
              }, 500)) : console.warn("[CardWrite] 未找到指定的卡片ID:", t.cardId);
            case 7:
              0 === _this.availableCards.length && e.index.showModal({
                title: "没有可写入的卡片",
                content: "卡包中没有可写入的卡片，请先读取一些卡片并保存到卡包中。",
                confirmText: "去读卡",
                cancelText: "返回",
                success: function success(t) {
                  t.confirm ? e.index.redirectTo({
                    url: "/pages/reader/reader"
                  }) : e.index.navigateBack();
                }
              });
            case 8:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))();
    },
    methods: _objectSpread2(_objectSpread2({}, e.mapActions("cards", ["loadCards"])), {}, {
      loadAvailableCards: function loadAvailableCards() {
        var _this2 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
          return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return _this2.loadCards();
              case 3:
                _this2.availableCards = _this2.allCards.filter(function (e) {
                  return e.uid && "" !== e.uid.trim() && e.data && e.data.length > 0;
                });
                console.log("[CardWrite] 加载可写入卡片:", _this2.availableCards.length);
                _context2.next = 10;
                break;
              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);
                console.error("[CardWrite] 加载卡片失败:", _context2.t0), e.index.showToast({
                  title: "加载卡片失败",
                  icon: "none"
                });
              case 10:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[0, 7]]);
        }))();
      },
      checkReaderMode: function checkReaderMode() {
        var _this3 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
          return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                if (!_this3.isConnected) {
                  _context3.next = 16;
                  break;
                }
                if (_this3.isReaderMode) {
                  _context3.next = 14;
                  break;
                }
                _context3.prev = 2;
                e.index.showLoading({
                  title: "设置读卡模式..."
                });
                _context3.next = 6;
                return r.bluetoothService.setReaderDeviceMode(!0);
              case 6:
                _this3.$store.commit("reader/SET_READER_MODE", !0);
                e.index.hideLoading();
                console.log("[CardWrite] 读卡模式已启动");
                _context3.next = 14;
                break;
              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3["catch"](2);
                e.index.hideLoading(), console.error("[CardWrite] 设置读卡模式失败:", _context3.t0), e.index.showToast({
                  title: "读卡模式启动失败",
                  icon: "none"
                });
              case 14:
                _context3.next = 17;
                break;
              case 16:
                e.index.showModal({
                  title: "设备未连接",
                  content: "写卡功能需要连接到Chameleon设备，请先连接设备。",
                  confirmText: "去连接",
                  cancelText: "返回",
                  success: function success(t) {
                    t.confirm ? e.index.redirectTo({
                      url: "/pages/connect/connect"
                    }) : e.index.navigateBack();
                  }
                });
              case 17:
              case "end":
                return _context3.stop();
            }
          }, _callee3, null, [[2, 11]]);
        }))();
      },
      showCardSelection: function showCardSelection() {
        0 !== this.availableCards.length ? this.$refs.cardSelectionPopup.open() : e.index.showToast({
          title: "没有可写入的卡片",
          icon: "none"
        });
      },
      closeCardSelection: function closeCardSelection() {
        this.$refs.cardSelectionPopup.close();
      },
      selectCard: function selectCard(e) {
        this.selectedCard = e, this.closeCardSelection(), console.log("[CardWrite] 选择卡片:", e.name);
      },
      startDetection: function startDetection() {
        var _this4 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4() {
          var _t;
          return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                if (!_this4.isConnected) {
                  _context4.next = 26;
                  break;
                }
                _this4.detecting = !0, _this4.magicCardDetected = !1;
                _context4.prev = 2;
                console.log("[CardWrite] 开始检测魔术卡...");
                _context4.next = 6;
                return r.bluetoothService.detectMagicCardType();
              case 6:
                _t = _context4.sent;
                if (_t.success) {
                  _context4.next = 9;
                  break;
                }
                throw new Error(_t.error || "未检测到支持的魔术卡");
              case 9:
                _this4.detectedMagicType = _t.type;
                _this4.magicCardDetected = !0;
                _context4.next = 13;
                return _this4.checkCardCompatibility();
              case 13:
                _this4.isCardCompatible = _context4.sent;
                console.log("[CardWrite] 检测到魔术卡类型:", _this4.detectedMagicType);
                e.index.showToast({
                  title: "\u68C0\u6D4B\u6210\u529F: ".concat(_this4.getMagicCardName(_this4.detectedMagicType)),
                  icon: "success"
                });
                _context4.next = 21;
                break;
              case 18:
                _context4.prev = 18;
                _context4.t0 = _context4["catch"](2);
                console.error("[CardWrite] 魔术卡检测失败:", _context4.t0), e.index.showToast({
                  title: _context4.t0.message || "检测失败",
                  icon: "none"
                });
              case 21:
                _context4.prev = 21;
                _this4.detecting = !1;
                return _context4.finish(21);
              case 24:
                _context4.next = 27;
                break;
              case 26:
                e.index.showToast({
                  title: "设备未连接",
                  icon: "none"
                });
              case 27:
              case "end":
                return _context4.stop();
            }
          }, _callee4, null, [[2, 18, 21, 24]]);
        }))();
      },
      restartDetection: function restartDetection() {
        this.magicCardDetected = !1, this.detectedMagicType = null;
      },
      checkCardCompatibility: function checkCardCompatibility() {
        var _this5 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5() {
          var _e2;
          return _regeneratorRuntime2().wrap(function _callee5$(_context5) {
            while (1) switch (_context5.prev = _context5.next) {
              case 0:
                if (!(!_this5.selectedCard || !_this5.detectedMagicType)) {
                  _context5.next = 2;
                  break;
                }
                return _context5.abrupt("return", !1);
              case 2:
                _context5.prev = 2;
                _context5.next = 5;
                return r.bluetoothService.verifyCardCompatibility(_this5.selectedCard, _this5.detectedMagicType);
              case 5:
                _e2 = _context5.sent;
                return _context5.abrupt("return", (_e2.warnings && _e2.warnings.length > 0 && (_this5.writeWarnings = _e2.warnings), _e2.compatible));
              case 9:
                _context5.prev = 9;
                _context5.t0 = _context5["catch"](2);
                return _context5.abrupt("return", (console.error("[CardWrite] 兼容性检查失败:", _context5.t0), !1));
              case 12:
              case "end":
                return _context5.stop();
            }
          }, _callee5, null, [[2, 9]]);
        }))();
      },
      startWrite: function startWrite() {
        var _this6 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee6() {
          var _t2;
          return _regeneratorRuntime2().wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                if (!_this6.canWrite) {
                  _context6.next = 13;
                  break;
                }
                _this6.writeProgress = 0, _this6.writeErrors = [], _this6.currentWriteStep = "准备写入...";
                _context6.prev = 2;
                console.log("[CardWrite] 开始写入数据...");
                _context6.next = 6;
                return r.bluetoothService.writeMagicCard(_this6.selectedCard, _this6.detectedMagicType, function (e, t) {
                  _this6.writeProgress = e, _this6.currentWriteStep = t;
                });
              case 6:
                _t2 = _context6.sent;
                _t2.failedBlocks && _t2.failedBlocks.length > 0 && (_this6.writeErrors = _t2.failedBlocks.map(function (e) {
                  return {
                    block: e,
                    message: "写入失败"
                  };
                })), console.log("[CardWrite] 写入完成，结果:", _t2), _t2.success ? e.index.showToast({
                  title: "写入成功",
                  icon: "success"
                }) : e.index.showToast({
                  title: "\u5199\u5165\u5B8C\u6210\uFF0C".concat(_this6.writeErrors.length, "\u4E2A\u5757\u5931\u8D25"),
                  icon: "none"
                });
                _context6.next = 13;
                break;
              case 10:
                _context6.prev = 10;
                _context6.t0 = _context6["catch"](2);
                console.error("[CardWrite] 写入失败:", _context6.t0), e.index.showToast({
                  title: _context6.t0.message || "写入失败",
                  icon: "none"
                }), _this6.writeProgress = -1;
              case 13:
              case "end":
                return _context6.stop();
            }
          }, _callee6, null, [[2, 10]]);
        }))();
      },
      goBack: function goBack() {
        this.currentStep > 0 && this.currentStep--;
      },
      goNext: function goNext() {
        this.currentStep < 2 && this.canProceed && this.currentStep++;
      },
      finishWrite: function finishWrite() {
        e.index.navigateBack();
      },
      writeAgain: function writeAgain() {
        this.writeProgress = -1, this.writeErrors = [], this.writeWarnings = [];
      },
      delay: function delay(e) {
        return new Promise(function (t) {
          return setTimeout(t, e);
        });
      },
      formatUID: function formatUID(e) {
        return e ? e.replace(/(.{2})/g, "$1 ").trim().toUpperCase() : "";
      },
      getCardIcon: function getCardIcon(e) {
        return e >= t.TagType.MIFARE_1024 && e <= t.TagType.MIFARE_4096 ? "creditcard" : e >= t.TagType.NTAG_213 && e <= t.TagType.MIFARE_Ultralight_EV1_164B ? "chip" : e === t.TagType.EM410X ? "key" : "creditcard";
      },
      getCardTypeName: function getCardTypeName(e) {
        var _t$TagType$MIFARE_;
        return (_t$TagType$MIFARE_ = {}, _defineProperty2(_t$TagType$MIFARE_, t.TagType.MIFARE_1024, "Mifare Classic 1K"), _defineProperty2(_t$TagType$MIFARE_, t.TagType.MIFARE_2048, "Mifare Classic 2K"), _defineProperty2(_t$TagType$MIFARE_, t.TagType.MIFARE_4096, "Mifare Classic 4K"), _defineProperty2(_t$TagType$MIFARE_, t.TagType.NTAG_213, "NTAG213"), _defineProperty2(_t$TagType$MIFARE_, t.TagType.NTAG_215, "NTAG215"), _defineProperty2(_t$TagType$MIFARE_, t.TagType.NTAG_216, "NTAG216"), _defineProperty2(_t$TagType$MIFARE_, t.TagType.EM410X, "EM410X"), _t$TagType$MIFARE_)[e] || "未知类型";
      },
      getCardDataSize: function getCardDataSize(e) {
        if (!e.data) return "0 KB";
        return "".concat((16 * e.data.length / 1024).toFixed(1), " KB");
      },
      getMagicCardName: function getMagicCardName(e) {
        return {
          gen1: "Gen1 魔术卡",
          gen2: "Gen2 魔术卡",
          gen3: "Gen3 魔术卡",
          ntag: "NTAG 魔术卡"
        }[e] || "未知魔术卡";
      },
      getMagicCardColor: function getMagicCardColor(e) {
        return {
          gen1: "#FF6B35",
          gen2: "#4ECDC4",
          gen3: "#45B7D1",
          ntag: "#96CEB4"
        }[e] || "#999";
      },
      getMagicCardFeatures: function getMagicCardFeatures(e) {
        return {
          gen1: "后门指令访问",
          gen2: "直接块写入",
          gen3: "高级写入模式",
          ntag: "标准ISO14443写入"
        }[e] || "标准写入";
      },
      getDataBlockCount: function getDataBlockCount() {
        return this.selectedCard && this.selectedCard.data ? this.selectedCard.data.length : 0;
      }
    })
  };if (!Array) {
  (e.resolveComponent("uni-icons") + e.resolveComponent("uni-popup"))();
}Math || (function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
} + function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
})();var a = e._export_sfc(i, [["render", function (t, r, i, a, s, c) {
  var o;
  return e.e({
    a: e.p({
      type: t.isConnected ? "checkmarkempty" : "closeempty",
      color: t.isConnected ? "#4CAF50" : "#f44336",
      size: "20"
    }),
    b: e.t(t.isConnected ? "设备已连接" : "设备未连接"),
    c: t.isConnected ? 1 : "",
    d: e.p({
      type: "scan",
      color: t.isReaderMode ? "#007AFF" : "#999",
      size: "20"
    }),
    e: e.t(t.isReaderMode ? "读卡模式" : "待激活"),
    f: t.isReaderMode ? 1 : "",
    g: e.f(s.steps, function (t, r, i) {
      return e.e({
        a: s.currentStep > r
      }, s.currentStep > r ? {
        b: "64ca8dc1-2-" + i,
        c: e.p({
          type: "checkmarkempty",
          color: "white",
          size: "16"
        })
      } : {
        d: e.t(r + 1)
      }, {
        e: e.t(t.title),
        f: r,
        g: s.currentStep >= r ? 1 : "",
        h: s.currentStep === r ? 1 : "",
        i: s.currentStep > r ? 1 : ""
      });
    }),
    h: 0 === s.currentStep
  }, 0 === s.currentStep ? e.e({
    i: e.t(s.steps[0].title),
    j: s.selectedCard
  }, s.selectedCard ? {
    k: e.p({
      type: c.getCardIcon(s.selectedCard.tag),
      color: s.selectedCard.color || "#007AFF",
      size: "32"
    }),
    l: e.t(s.selectedCard.name),
    m: e.t(c.formatUID(s.selectedCard.uid)),
    n: e.t(c.getCardTypeName(s.selectedCard.tag)),
    o: e.p({
      type: "forward",
      color: "#007AFF",
      size: "16"
    }),
    p: e.o(function () {
      return c.showCardSelection && c.showCardSelection.apply(c, arguments);
    })
  } : {
    q: e.p({
      type: "plus",
      color: "#999",
      size: "48"
    }),
    r: e.o(function () {
      return c.showCardSelection && c.showCardSelection.apply(c, arguments);
    })
  }, {
    s: 0 === s.availableCards.length
  }, 0 === s.availableCards.length ? {
    t: e.p({
      type: "info",
      color: "#999",
      size: "32"
    })
  } : {}) : {}, {
    v: 1 === s.currentStep
  }, 1 === s.currentStep ? e.e({
    w: e.t(s.steps[1].title),
    x: !s.magicCardDetected
  }, s.magicCardDetected ? e.e({
    G: e.p({
      type: "checkmarkempty",
      color: "#4CAF50",
      size: "32"
    }),
    H: e.t(c.getMagicCardName(s.detectedMagicType)),
    I: c.getMagicCardColor(s.detectedMagicType),
    J: e.t(c.getMagicCardName(s.detectedMagicType)),
    K: e.t(c.getMagicCardFeatures(s.detectedMagicType)),
    L: e.t(s.isCardCompatible ? "兼容" : "可能不兼容"),
    M: s.isCardCompatible ? 1 : "",
    N: s.isCardCompatible ? "" : 1,
    O: !s.isCardCompatible
  }, s.isCardCompatible ? {} : {
    P: e.p({
      type: "info",
      color: "#FF9500",
      size: "20"
    })
  }, {
    Q: e.p({
      type: "refreshempty",
      color: "#007AFF",
      size: "16"
    }),
    R: e.o(function () {
      return c.restartDetection && c.restartDetection.apply(c, arguments);
    })
  }) : {
    y: s.detecting ? 1 : "",
    z: e.p({
      type: s.detecting ? "refreshempty" : "scan",
      color: s.detecting ? "#007AFF" : "#999",
      size: "64"
    }),
    A: e.t(s.detecting ? "正在检测魔术卡..." : "将魔术卡靠近设备"),
    B: e.t(s.detecting ? "请保持卡片位置不变" : "支持 Gen1、Gen2、NTAG 等类型"),
    C: e.p({
      type: "scan",
      color: "white",
      size: "16"
    }),
    D: e.t(s.detecting ? "检测中..." : "开始检测"),
    E: !t.isConnected || s.detecting,
    F: e.o(function () {
      return c.startDetection && c.startDetection.apply(c, arguments);
    })
  }) : {}, {
    S: 2 === s.currentStep
  }, 2 === s.currentStep ? e.e({
    T: e.t(s.steps[2].title),
    U: -1 === s.writeProgress
  }, -1 === s.writeProgress ? e.e({
    V: e.p({
      type: "forward",
      color: "#007AFF",
      size: "24"
    }),
    W: e.t(null == (o = s.selectedCard) ? void 0 : o.name),
    X: e.t(c.getMagicCardName(s.detectedMagicType)),
    Y: e.t(c.getDataBlockCount()),
    Z: s.writeWarnings.length > 0
  }, s.writeWarnings.length > 0 ? {
    aa: e.p({
      type: "info",
      color: "#FF9500",
      size: "20"
    }),
    ab: e.f(s.writeWarnings, function (t, r, i) {
      return {
        a: e.t(t),
        b: r
      };
    })
  } : {}) : s.writeProgress >= 0 && s.writeProgress < 100 ? e.e({
    ad: e.t(s.writeProgress),
    ae: s.writeProgress + "%",
    af: e.t(s.currentWriteStep),
    ag: s.writeETA
  }, s.writeETA ? {
    ah: e.t(s.writeETA)
  } : {}, {
    ai: s.writeErrors.length > 0
  }, s.writeErrors.length > 0 ? {
    aj: e.f(s.writeErrors, function (t, r, i) {
      return {
        a: e.t(t.block),
        b: e.t(t.message),
        c: r
      };
    })
  } : {}) : 100 === s.writeProgress ? e.e({
    al: e.p({
      type: "checkmarkempty",
      color: "#4CAF50",
      size: "64"
    }),
    am: e.t(0 === s.writeErrors.length ? "所有数据写入成功" : "\u5199\u5165\u5B8C\u6210\uFF0C".concat(s.writeErrors.length, " \u4E2A\u5757\u5199\u5165\u5931\u8D25")),
    an: s.writeErrors.length > 0
  }, s.writeErrors.length > 0 ? {
    ao: e.f(s.writeErrors, function (t, r, i) {
      return {
        a: e.t(t.block),
        b: r
      };
    })
  } : {}) : {}, {
    ac: s.writeProgress >= 0 && s.writeProgress < 100,
    ak: 100 === s.writeProgress
  }) : {}, {
    ap: s.currentStep > 0 && -1 === s.writeProgress
  }, s.currentStep > 0 && -1 === s.writeProgress ? {
    aq: e.p({
      type: "back",
      color: "#666",
      size: "16"
    }),
    ar: e.o(function () {
      return c.goBack && c.goBack.apply(c, arguments);
    })
  } : {}, {
    as: s.currentStep < 2
  }, s.currentStep < 2 ? {
    at: e.p({
      type: "forward",
      color: "white",
      size: "16"
    }),
    av: !c.canProceed,
    aw: e.o(function () {
      return c.goNext && c.goNext.apply(c, arguments);
    })
  } : {}, {
    ax: 2 === s.currentStep && -1 === s.writeProgress
  }, 2 === s.currentStep && -1 === s.writeProgress ? {
    ay: e.p({
      type: "download",
      color: "white",
      size: "16"
    }),
    az: !c.canWrite,
    aA: e.o(function () {
      return c.startWrite && c.startWrite.apply(c, arguments);
    })
  } : {}, {
    aB: 100 === s.writeProgress
  }, 100 === s.writeProgress ? {
    aC: e.p({
      type: "checkmarkempty",
      color: "white",
      size: "16"
    }),
    aD: e.o(function () {
      return c.finishWrite && c.finishWrite.apply(c, arguments);
    })
  } : {}, {
    aE: 100 === s.writeProgress
  }, 100 === s.writeProgress ? {
    aF: e.p({
      type: "refreshempty",
      color: "#666",
      size: "16"
    }),
    aG: e.o(function () {
      return c.writeAgain && c.writeAgain.apply(c, arguments);
    })
  } : {}, {
    aH: e.o(c.closeCardSelection),
    aI: e.p({
      type: "closeempty",
      size: "24"
    }),
    aJ: e.f(s.availableCards, function (t, r, i) {
      return e.e({
        a: "64ca8dc1-22-" + i + ",64ca8dc1-20",
        b: e.p({
          type: c.getCardIcon(t.tag),
          color: t.color || "#007AFF",
          size: "24"
        }),
        c: e.t(t.name),
        d: e.t(c.formatUID(t.uid)),
        e: e.t(c.getCardTypeName(t.tag)),
        f: e.t(c.getCardDataSize(t)),
        g: s.selectedCard && s.selectedCard.id === t.id
      }, s.selectedCard && s.selectedCard.id === t.id ? {
        h: "64ca8dc1-23-" + i + ",64ca8dc1-20",
        i: e.p({
          type: "checkmarkempty",
          color: "#007AFF",
          size: "20"
        })
      } : {}, {
        j: t.id,
        k: s.selectedCard && s.selectedCard.id === t.id ? 1 : "",
        l: e.o(function (e) {
          return c.selectCard(t);
        }, t.id)
      });
    }),
    aK: e.sr("cardSelectionPopup", "64ca8dc1-20"),
    aL: e.p({
      type: "bottom",
      "background-color": "#fff"
    })
  });
}], ["__scopeId", "data-v-64ca8dc1"]]);wx.createPage(a);