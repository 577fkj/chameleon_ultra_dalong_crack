require("../../@babel/runtime/helpers/Arrayincludes");var _toConsumableArray2 = require("../../@babel/runtime/helpers/toConsumableArray");var _regeneratorRuntime2 = require("../../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../../@babel/runtime/helpers/asyncToGenerator");var _objectSpread2 = require("../../@babel/runtime/helpers/objectSpread2");var e = require("../../common/vendor.js"),
  t = require("../../utils/card-reader.js"),
  a = require("../../utils/chameleon-protocol.js"),
  s = require("../../utils/card-save.js"),
  r = require("../../services/bluetooth.js"),
  i = {
    name: "ReaderPage",
    data: function data() {
      return {
        isInitializing: !1,
        customKey: "",
        customKeys: [],
        useDefaultKeys: !0,
        useNestedAttack: !1,
        useBackdoorAttack: !0,
        showDetailedProgress: !0,
        showKeyDictionary: !1,
        selectedDictionaryKeys: [0, 1, 2],
        selectedStrategy: "standard",
        autoRetryFailedSectors: !0,
        showPresetMenu: !1,
        saveCardName: "",
        saveCompleteData: !0,
        saveReadTime: !0
      };
    },
    computed: _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, e.mapState("device", ["isConnected"])), e.mapState("reader", ["currentMode", "readingState", "isReaderMode", "currentCard", "progress", "readHistory", "statistics", "lastError"])), e.mapGetters("reader", ["currentStatus", "supportedCardTypes", "readingStatistics", "recentReads", "canStartReading"])), {}, {
      showProgress: function showProgress() {
        return "reading" === this.readingState || "analyzing" === this.readingState;
      },
      keyDictionaryNames: function keyDictionaryNames() {
        return a.gMifareClassicKeyNames;
      },
      keyDictionary: function keyDictionary() {
        return a.gMifareClassicKeys;
      },
      shouldShowAdvancedRead: function shouldShowAdvancedRead() {
        return !!this.isMifareClassic(this.currentCard.type) && this.currentCard.isComplete && this.currentCard.hasErrors && this.currentCard.accessibleSectors < this.totalSectorCount;
      },
      totalSectorCount: function totalSectorCount() {
        if (!this.currentCard.type) return 16;
        var e = this.currentCard.type.toLowerCase();
        return e.includes("4k") ? 40 : e.includes("2k") ? 32 : e.includes("mini") ? 5 : 16;
      }
    }),
    onLoad: function onLoad() {
      var _this = this;
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
        return _regeneratorRuntime2().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = _this.isConnected && !_this.isReaderMode;
              if (!_context.t0) {
                _context.next = 4;
                break;
              }
              _context.next = 4;
              return _this.handleInitializeReader();
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))();
    },
    onShow: function onShow() {
      var _this2 = this;
      return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
        return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.t0 = _this2.isConnected && !_this2.isReaderMode;
              if (!_context2.t0) {
                _context2.next = 4;
                break;
              }
              _context2.next = 4;
              return _this2.handleInitializeReader();
            case 4:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }))();
    },
    methods: _objectSpread2(_objectSpread2({}, e.mapActions("reader", ["initializeReader", "switchMode", "scanCard", "stopReading", "saveToCardPackage", "cleanup"])), {}, {
      handleSwitchMode: function handleSwitchMode(t) {
        var _this3 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
          var _a;
          return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                if (!("scanning" !== _this3.readingState && "reading" !== _this3.readingState)) {
                  _context3.next = 13;
                  break;
                }
                _context3.prev = 1;
                _context3.next = 4;
                return _this3.switchMode(t);
              case 4:
                _a = _context3.sent;
                _a.success || e.index.showToast({
                  title: _a.error,
                  icon: "none"
                });
                _context3.next = 11;
                break;
              case 8:
                _context3.prev = 8;
                _context3.t0 = _context3["catch"](1);
                e.index.showToast({
                  title: "模式切换失败",
                  icon: "none"
                });
              case 11:
                _context3.next = 14;
                break;
              case 13:
                e.index.showToast({
                  title: "正在读取中，请稍后",
                  icon: "none"
                });
              case 14:
              case "end":
                return _context3.stop();
            }
          }, _callee3, null, [[1, 8]]);
        }))();
      },
      handleInitializeReader: function handleInitializeReader() {
        var _this4 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4() {
          var _t;
          return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                if (_this4.isInitializing) {
                  _context4.next = 15;
                  break;
                }
                _this4.isInitializing = !0;
                _context4.prev = 2;
                _context4.next = 5;
                return _this4.initializeReader();
              case 5:
                _t = _context4.sent;
                _t.success ? e.index.showToast({
                  title: "读卡模式已启动",
                  icon: "success"
                }) : e.index.showToast({
                  title: _t.error || "初始化失败",
                  icon: "none"
                });
                _context4.next = 12;
                break;
              case 9:
                _context4.prev = 9;
                _context4.t0 = _context4["catch"](2);
                e.index.showToast({
                  title: "初始化失败",
                  icon: "none"
                });
              case 12:
                _context4.prev = 12;
                _this4.isInitializing = !1;
                return _context4.finish(12);
              case 15:
              case "end":
                return _context4.stop();
            }
          }, _callee4, null, [[2, 9, 12, 15]]);
        }))();
      },
      handleScanAction: function handleScanAction() {
        var _this5 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5() {
          var _t2;
          return _regeneratorRuntime2().wrap(function _callee5$(_context5) {
            while (1) switch (_context5.prev = _context5.next) {
              case 0:
                if (!("scanning" === _this5.readingState || "reading" === _this5.readingState)) {
                  _context5.next = 5;
                  break;
                }
                _context5.next = 3;
                return _this5.stopReading();
              case 3:
                _context5.next = 16;
                break;
              case 5:
                _context5.prev = 5;
                e.index.showLoading({
                  title: "正在扫描..."
                });
                _context5.next = 9;
                return _this5.scanCard();
              case 9:
                _t2 = _context5.sent;
                e.index.hideLoading(), _t2.success ? _t2.card ? e.index.showToast({
                  title: "扫描成功",
                  icon: "success"
                }) : e.index.showToast({
                  title: "未检测到卡片",
                  icon: "none"
                }) : e.index.showToast({
                  title: _t2.error || "扫描失败",
                  icon: "none"
                });
                _context5.next = 16;
                break;
              case 13:
                _context5.prev = 13;
                _context5.t0 = _context5["catch"](5);
                e.index.hideLoading(), e.index.showToast({
                  title: "扫描失败",
                  icon: "none"
                });
              case 16:
              case "end":
                return _context5.stop();
            }
          }, _callee5, null, [[5, 13]]);
        }))();
      },
      saveToCardPackage: function saveToCardPackage() {
        var _this6 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee6() {
          return _regeneratorRuntime2().wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                if (_this6.currentCard.uid) {
                  _context6.next = 3;
                  break;
                }
                return _context6.abrupt("return", void e.index.showToast({
                  title: "没有可保存的卡片数据",
                  icon: "none"
                }));
              case 3:
                _this6.showSaveOptions();
                _context6.next = 9;
                break;
              case 6:
                _context6.prev = 6;
                _context6.t0 = _context6["catch"](0);
                console.error("[Reader] 保存到卡包失败:", _context6.t0), e.index.showToast({
                  title: "保存失败",
                  icon: "none"
                });
              case 9:
              case "end":
                return _context6.stop();
            }
          }, _callee6, null, [[0, 6]]);
        }))();
      },
      goToCardWrite: function goToCardWrite() {
        e.index.showModal({
          title: "写卡功能",
          content: "写卡功能需要从卡包中选择卡片。是否前往卡包选择要写入的卡片？",
          confirmText: "前往卡包",
          cancelText: "取消",
          success: function success(t) {
            t.confirm && e.index.navigateTo({
              url: "/pages/cards/cards"
            });
          }
        });
      },
      showSaveOptions: function showSaveOptions() {
        this.saveCardName = this.generateCardName(), this.$refs.saveOptionsPopup.open();
      },
      closeSaveOptions: function closeSaveOptions() {
        this.$refs.saveOptionsPopup.close();
      },
      generateCardName: function generateCardName() {
        return "".concat(this.getCardTypeName(this.currentCard.type), " ").concat(this.currentCard.uid.replace(/\s/g, "").substring(0, 8), " (").concat(new Date().toLocaleString("zh-CN", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        }), ")");
      },
      executeSave: function executeSave() {
        var _this7 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee7() {
          var _t3, _a2;
          return _regeneratorRuntime2().wrap(function _callee7$(_context7) {
            while (1) switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                e.index.showLoading({
                  title: "保存中..."
                });
                _t3 = _this7.convertToCardSave(_this7.currentCard, _this7.saveCardName);
                _context7.next = 5;
                return _this7.$store.dispatch("cards/createCard", _t3);
              case 5:
                _a2 = _context7.sent;
                e.index.hideLoading(), _this7.closeSaveOptions(), _a2.success ? (e.index.showToast({
                  title: "已保存到卡包",
                  icon: "success"
                }), _this7.showSaveSuccessOptions()) : e.index.showToast({
                  title: _a2.error || "保存失败",
                  icon: "none"
                });
                _context7.next = 12;
                break;
              case 9:
                _context7.prev = 9;
                _context7.t0 = _context7["catch"](0);
                e.index.hideLoading(), console.error("[Reader] 保存失败:", _context7.t0), e.index.showToast({
                  title: "保存失败",
                  icon: "none"
                });
              case 12:
              case "end":
                return _context7.stop();
            }
          }, _callee7, null, [[0, 9]]);
        }))();
      },
      convertToCardSave: function convertToCardSave(e, t) {
        var r = a.TagType.UNKNOWN;
        this.isMifareClassic(e.type) ? r = e.type.includes("4k") ? a.TagType.MIFARE_4096 : e.type.includes("2k") ? a.TagType.MIFARE_2048 : a.TagType.MIFARE_1024 : this.isMifareUltralight(e.type) ? r = a.TagType.NTAG_213 : "em410x" === e.type && (r = a.TagType.EM410X);
        var i = [];
        e.sectors && e.sectors.length > 0 ? e.sectors.forEach(function (e) {
          e.blocks && e.blocks.length > 0 && e.blocks.forEach(function (e) {
            Array.isArray(e) && i.push(new Uint8Array(e));
          });
        }) : e.pages && e.pages.length > 0 && e.pages.forEach(function (e) {
          Array.isArray(e) && i.push(new Uint8Array(e));
        });
        var o = e.uid;
        "string" == typeof o && (o = o.replace(/\s/g, ""));
        var c = 0;
        e.sak && (c = "string" == typeof e.sak ? parseInt(e.sak.replace(/\s/g, ""), 16) : e.sak);
        var n = new Uint8Array(0);
        if (e.atqa) if (Array.isArray(e.atqa)) n = new Uint8Array(e.atqa);else if ("string" == typeof e.atqa) {
          var _t4,
            _a3 = e.atqa.trim();
          _t4 = _a3.includes(" ") ? _a3.split(" ").filter(function (e) {
            return e;
          }).map(function (e) {
            return parseInt(e, 16);
          }) : _a3.match(/.{1,2}/g).map(function (e) {
            return parseInt(e, 16);
          }), n = new Uint8Array(_t4);
        }
        var d = new Uint8Array(0);
        if (e.ats) if (Array.isArray(e.ats)) d = new Uint8Array(e.ats);else if ("string" == typeof e.ats) {
          var _t5 = e.ats.split(" ").map(function (e) {
            return parseInt(e, 16);
          });
          d = new Uint8Array(_t5);
        }
        return new s.CardSave({
          name: t,
          uid: o,
          tag: r,
          sak: c,
          atqa: n,
          ats: d,
          data: i,
          color: this.getCardTypeColor(e.type)
        });
      },
      showSaveSuccessOptions: function showSaveSuccessOptions() {
        e.index.showModal({
          title: "保存成功",
          content: "卡片已保存到卡包，是否查看卡包？",
          confirmText: "查看卡包",
          cancelText: "继续读取",
          success: function success(t) {
            t.confirm && e.index.navigateTo({
              url: "/pages/cards/cards"
            });
          }
        });
      },
      showAdvancedReadOptions: function showAdvancedReadOptions() {
        this.$refs.advancedReadPopup.open();
      },
      closeAdvancedReadPopup: function closeAdvancedReadPopup() {
        this.$refs.advancedReadPopup.close();
      },
      showSectorDetails: function showSectorDetails() {
        this.currentCard.sectors && 0 !== this.currentCard.sectors.length ? e.index.navigateTo({
          url: "/pages/sector-details/sector-details"
        }) : e.index.showToast({
          title: "没有扇区数据",
          icon: "none"
        });
      },
      showPageDetails: function showPageDetails() {
        this.currentCard.pages && 0 !== this.currentCard.pages.length ? this.$refs.pageDetailsPopup.open() : e.index.showToast({
          title: "没有页面数据",
          icon: "none"
        });
      },
      closePageDetailsPopup: function closePageDetailsPopup() {
        this.$refs.pageDetailsPopup.close();
      },
      formatKeyInput: function formatKeyInput(e) {
        var t = e.detail.value.replace(/[^0-9A-Fa-f]/g, "").toUpperCase();
        t.length > 12 && (t = t.substring(0, 12)), this.customKey = t;
      },
      addCustomKey: function addCustomKey() {
        12 === this.customKey.length ? this.customKeys.includes(this.customKey) ? e.index.showToast({
          title: "密钥已存在",
          icon: "none"
        }) : (this.customKeys.push(this.customKey), this.customKey = "", e.index.showToast({
          title: "密钥已添加",
          icon: "success"
        })) : e.index.showToast({
          title: "密钥必须是12位十六进制字符",
          icon: "none"
        });
      },
      removeCustomKey: function removeCustomKey(e) {
        this.customKeys.splice(e, 1);
      },
      toggleDefaultKeys: function toggleDefaultKeys(e) {
        this.useDefaultKeys = e.detail.value;
      },
      toggleBackdoorAttack: function toggleBackdoorAttack(e) {
        this.useBackdoorAttack = e.detail.value;
      },
      toggleNestedAttack: function toggleNestedAttack(e) {
        this.useNestedAttack = e.detail.value;
      },
      toggleDetailedProgress: function toggleDetailedProgress(e) {
        this.showDetailedProgress = e.detail.value;
      },
      startAdvancedRead: function startAdvancedRead() {
        var _this8 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee8() {
          var _a4;
          return _regeneratorRuntime2().wrap(function _callee8$(_context8) {
            while (1) switch (_context8.prev = _context8.next) {
              case 0:
                _this8.closeAdvancedReadPopup();
                _context8.prev = 1;
                if (_this8.validateReadConfiguration()) {
                  _context8.next = 4;
                  break;
                }
                return _context8.abrupt("return");
              case 4:
                if (!(!r.bluetoothService || !r.bluetoothService.isConnected)) {
                  _context8.next = 6;
                  break;
                }
                return _context8.abrupt("return", void e.index.showToast({
                  title: "蓝牙服务未连接",
                  icon: "none"
                }));
              case 6:
                _a4 = new t.CardDataReader(r.bluetoothService);
                if (!("smart" === _this8.selectedStrategy)) {
                  _context8.next = 12;
                  break;
                }
                _context8.next = 10;
                return _this8.performSmartRecovery(_a4);
              case 10:
                _context8.next = 14;
                break;
              case 12:
                _context8.next = 14;
                return _this8.performDictionaryAttack(_a4);
              case 14:
                _context8.next = 19;
                break;
              case 16:
                _context8.prev = 16;
                _context8.t0 = _context8["catch"](1);
                console.error("[Reader] 高级读取失败:", _context8.t0), e.index.hideLoading(), e.index.showToast({
                  title: "读取失败: " + _context8.t0.message,
                  icon: "none",
                  duration: 3e3
                });
              case 19:
              case "end":
                return _context8.stop();
            }
          }, _callee8, null, [[1, 16]]);
        }))();
      },
      performSmartRecovery: function performSmartRecovery(t) {
        var _this9 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee9() {
          var a, _s, _r, _i, _o;
          return _regeneratorRuntime2().wrap(function _callee9$(_context9) {
            while (1) switch (_context9.prev = _context9.next) {
              case 0:
                console.log("[Reader] 开始智能密钥恢复..."), e.index.showLoading({
                  title: "智能恢复中...",
                  mask: !0
                });
                _context9.prev = 1;
                _s = _toConsumableArray2(_this9.customKeys);
                _context9.next = 5;
                return t.smartKeyRecovery({
                  uid: _this9.currentCard.uid,
                  sak: _this9.currentCard.sak,
                  atqa: _this9.currentCard.atqa
                }, _s, function (t) {
                  _this9.$store.commit("reader/UPDATE_PROGRESS", {
                    message: t.message || "",
                    percentage: t.percentage || 0,
                    phase: t.phase || "",
                    current: t.current || 0,
                    total: t.total || 0,
                    details: t.details || []
                  }), t.message && e.index.showLoading({
                    title: t.message,
                    mask: !0
                  }), console.log("[Reader] \u8FDB\u5EA6: ".concat(t.message, " ").concat(t.percentage, "%"));
                });
              case 5:
                _r = _context9.sent;
                e.index.hideLoading();
                _i = _objectSpread2(_objectSpread2(_objectSpread2({}, _this9.currentCard), _r), {}, {
                  attackMethods: _r.attackMethods || [],
                  phases: _r.phases || [],
                  isComplete: _r.isComplete || !1,
                  hasErrors: _r.hasErrors || !1,
                  readTime: _r.readTime || new Date().toISOString()
                });
                _this9.$store.commit("reader/SET_CURRENT_CARD", _i);
                _o = _r.attackMethods ? _r.attackMethods.join(" → ") : "未知";
                e.index.showModal({
                  title: "智能恢复完成",
                  content: "\u5361\u7247\u7C7B\u578B: ".concat(null == (a = _r.cardType) ? void 0 : a.toUpperCase(), "\n\u6210\u529F\u7387: ").concat(_r.successRate, "%\n\u653B\u51FB\u65B9\u5F0F: ").concat(_o, "\n\u627E\u5230\u5BC6\u94A5: ").concat(_r.foundKeys, "/").concat(_r.totalKeys),
                  showCancel: !1,
                  confirmText: "查看详情",
                  success: function success(e) {
                    e.confirm && _this9.showSectorDetails();
                  }
                }), console.log("[Reader] 智能恢复完成:", _r);
                _context9.next = 16;
                break;
              case 13:
                _context9.prev = 13;
                _context9.t0 = _context9["catch"](1);
                throw console.error("[Reader] 智能恢复失败:", _context9.t0), _context9.t0;
              case 16:
              case "end":
                return _context9.stop();
            }
          }, _callee9, null, [[1, 13]]);
        }))();
      },
      performDictionaryAttack: function performDictionaryAttack(t) {
        var _this10 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee10() {
          var a, _s2, _r2, _i2;
          return _regeneratorRuntime2().wrap(function _callee10$(_context10) {
            while (1) switch (_context10.prev = _context10.next) {
              case 0:
                console.log("[Reader] 开始密钥字典攻击..."), e.index.showLoading({
                  title: "正在读取...",
                  mask: !0
                });
                _context10.prev = 1;
                a = _this10.selectedDictionaryKeys.map(function (e) {
                  return _this10.keyDictionary[e].map(function (e) {
                    return e.toString(16).padStart(2, "0");
                  }).join("").toUpperCase();
                });
                _s2 = [].concat(_toConsumableArray2(_this10.customKeys), _toConsumableArray2(a));
                "quick" === _this10.selectedStrategy ? _s2 = a.slice(0, 5) : "deep" === _this10.selectedStrategy && (_this10.useNestedAttack = !0);
                _context10.next = 7;
                return t.dictionaryAttack({
                  uid: _this10.currentCard.uid,
                  sak: _this10.currentCard.sak,
                  atqa: _this10.currentCard.atqa
                }, _s2, function (t) {
                  _this10.$store.commit("reader/UPDATE_PROGRESS", {
                    message: t.message || "",
                    percentage: t.percentage || 0,
                    current: t.current || 0,
                    total: t.total || 0,
                    details: t.details || []
                  }), t.message && e.index.showLoading({
                    title: t.message,
                    mask: !0
                  });
                });
              case 7:
                _r2 = _context10.sent;
                e.index.hideLoading();
                _i2 = _objectSpread2(_objectSpread2(_objectSpread2({}, _this10.currentCard), _r2), {}, {
                  isComplete: _r2.isComplete || !1,
                  hasErrors: _r2.hasErrors || !1
                });
                _this10.$store.commit("reader/SET_CURRENT_CARD", _i2), e.index.showToast({
                  title: "\u8BFB\u53D6\u5B8C\u6210\uFF0C\u6210\u529F\u7387 ".concat(_r2.successRate, "%"),
                  icon: "success",
                  duration: 3e3
                }), console.log("[Reader] 字典攻击完成:", _r2);
                _context10.next = 16;
                break;
              case 13:
                _context10.prev = 13;
                _context10.t0 = _context10["catch"](1);
                throw console.error("[Reader] 字典攻击失败:", _context10.t0), _context10.t0;
              case 16:
              case "end":
                return _context10.stop();
            }
          }, _callee10, null, [[1, 13]]);
        }))();
      },
      validateReadConfiguration: function validateReadConfiguration() {
        return !(0 === this.selectedDictionaryKeys.length && 0 === this.customKeys.length && !this.useDefaultKeys) || (e.index.showToast({
          title: "请至少选择一种密钥来源",
          icon: "none"
        }), !1);
      },
      buildReadOptions: function buildReadOptions() {
        var _this11 = this;
        var e = this.selectedDictionaryKeys.map(function (e) {
          return _this11.keyDictionary[e].map(function (e) {
            return e.toString(16).padStart(2, "0");
          }).join("").toUpperCase();
        });
        var t = [].concat(_toConsumableArray2(this.customKeys), _toConsumableArray2(e));
        return "quick" === this.selectedStrategy ? t = e.slice(0, 5) : "deep" === this.selectedStrategy && (this.useNestedAttack = !0), {
          useDefaultKeys: this.useDefaultKeys,
          customKeys: t,
          useNestedAttack: this.useNestedAttack,
          showDetailedProgress: this.showDetailedProgress,
          autoRetryFailedSectors: this.autoRetryFailedSectors,
          strategy: this.selectedStrategy
        };
      },
      toggleKeyDictionary: function toggleKeyDictionary() {
        this.showKeyDictionary = !this.showKeyDictionary;
      },
      toggleDictionaryKey: function toggleDictionaryKey(e) {
        var t = this.selectedDictionaryKeys.indexOf(e);
        t > -1 ? this.selectedDictionaryKeys.splice(t, 1) : this.selectedDictionaryKeys.push(e);
      },
      selectAllDictionaryKeys: function selectAllDictionaryKeys() {
        this.selectedDictionaryKeys = Array.from({
          length: this.keyDictionaryNames.length
        }, function (e, t) {
          return t;
        });
      },
      clearDictionarySelection: function clearDictionarySelection() {
        this.selectedDictionaryKeys = [];
      },
      selectCommonKeys: function selectCommonKeys() {
        this.selectedDictionaryKeys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      },
      formatDictionaryKey: function formatDictionaryKey(e) {
        if (e >= this.keyDictionary.length) return "";
        return this.keyDictionary[e].map(function (e) {
          return e.toString(16).padStart(2, "0");
        }).join("").toUpperCase();
      },
      selectStrategy: function selectStrategy(e) {
        this.selectedStrategy = e, "quick" === e ? (this.selectedDictionaryKeys = [0, 1, 2, 3, 4], this.useNestedAttack = !1, this.useBackdoorAttack = !1) : "standard" === e ? (this.selectedDictionaryKeys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], this.useNestedAttack = !1, this.useBackdoorAttack = !0) : "deep" === e ? (this.selectAllDictionaryKeys(), this.useNestedAttack = !0, this.useBackdoorAttack = !0, this.autoRetryFailedSectors = !0) : "smart" === e && (this.selectAllDictionaryKeys(), this.useNestedAttack = !0, this.useBackdoorAttack = !0, this.autoRetryFailedSectors = !0, this.showDetailedProgress = !0);
      },
      toggleAutoRetry: function toggleAutoRetry(e) {
        this.autoRetryFailedSectors = e.detail.value;
      },
      clearCustomKeys: function clearCustomKeys() {
        var _this12 = this;
        e.index.showModal({
          title: "确认清空",
          content: "确定要清空所有自定义密钥吗？",
          success: function success(t) {
            t.confirm && (_this12.customKeys = [], e.index.showToast({
              title: "已清空自定义密钥",
              icon: "success"
            }));
          }
        });
      },
      showPresetMenu: function showPresetMenu() {
        var _this13 = this;
        e.index.showActionSheet({
          itemList: ["新手模式", "专家模式", "自定义模式"],
          success: function success(e) {
            _this13.applyPreset(e.tapIndex);
          }
        });
      },
      applyPreset: function applyPreset(t) {
        switch (t) {
          case 0:
            this.selectedStrategy = "quick", this.useDefaultKeys = !0, this.useNestedAttack = !1, this.showDetailedProgress = !0, this.autoRetryFailedSectors = !0, this.selectedDictionaryKeys = [0, 1, 2, 3, 4];
            break;
          case 1:
            this.selectedStrategy = "deep", this.useDefaultKeys = !0, this.useNestedAttack = !0, this.showDetailedProgress = !0, this.autoRetryFailedSectors = !0, this.selectAllDictionaryKeys();
        }
        e.index.showToast({
          title: "预设已应用",
          icon: "success"
        });
      },
      showKeyDictionaryHelp: function showKeyDictionaryHelp() {
        e.index.showModal({
          title: "密钥字典说明",
          content: "密钥字典包含常用的Mifare Classic密钥，这些密钥可以解锁大多数扇区。选择更多密钥可以提高读取成功率，但会增加读取时间。",
          showCancel: !1
        });
      },
      toggleSaveCompleteData: function toggleSaveCompleteData(e) {
        this.saveCompleteData = e.detail.value;
      },
      toggleSaveReadTime: function toggleSaveReadTime(e) {
        this.saveReadTime = e.detail.value;
      },
      exportCardData: function exportCardData() {
        var _this14 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee11() {
          var a, _s3;
          return _regeneratorRuntime2().wrap(function _callee11$(_context11) {
            while (1) switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                a = _this14.currentCard;
                if (a.uid) {
                  _context11.next = 4;
                  break;
                }
                return _context11.abrupt("return", void e.index.showToast({
                  title: "没有可导出的数据",
                  icon: "none"
                }));
              case 4:
                _s3 = "卡片信息导出\n";
                _s3 += "\u5BFC\u51FA\u65F6\u95F4: ".concat(new Date().toLocaleString(), "\n\n"), _s3 += "UID: ".concat(a.uid, "\n"), _s3 += "\u7C7B\u578B: ".concat(_this14.getCardTypeName(a.type), "\n"), _s3 += "\u534F\u8BAE: ".concat(a.protocol || "未知", "\n"), a.sak && (_s3 += "SAK: ".concat(a.sak, "\n")), a.atqa && (_s3 += "ATQA: ".concat(a.atqa, "\n")), a.ats && (_s3 += "ATS: ".concat(a.ats, "\n")), _s3 += "\n\u6570\u636E\u5B8C\u6574\u6027: ".concat(a.isComplete ? "完整" : "不完整", "\n"), a.hasErrors && a.errorMessage && (_s3 += "\u9519\u8BEF\u4FE1\u606F: ".concat(a.errorMessage, "\n")), a.sectors && a.sectors.length > 0 && (_s3 += "\n扇区数据:\n", a.sectors.forEach(function (e, a) {
                  e.readable && (_s3 += t.CardDataFormatter.formatMifareClassicSector(e, a) + "\n\n");
                })), a.pages && a.pages.length > 0 && (_s3 += "\n页面数据:\n", _s3 += t.CardDataFormatter.formatMifareUltralightPages(a.pages) + "\n"), e.index.setClipboardData({
                  data: _s3,
                  success: function success() {
                    e.index.showToast({
                      title: "数据已复制到剪贴板",
                      icon: "success"
                    });
                  }
                });
                _context11.next = 11;
                break;
              case 8:
                _context11.prev = 8;
                _context11.t0 = _context11["catch"](0);
                e.index.showToast({
                  title: "导出失败",
                  icon: "none"
                });
              case 11:
              case "end":
                return _context11.stop();
            }
          }, _callee11, null, [[0, 8]]);
        }))();
      },
      loadHistoryCard: function loadHistoryCard(t) {
        this.$store.commit("reader/SET_CURRENT_CARD", t), e.index.showToast({
          title: "已加载历史记录",
          icon: "success"
        });
      },
      clearHistory: function clearHistory() {
        var _this15 = this;
        e.index.showModal({
          title: "确认清空",
          content: "确定要清空所有读取历史吗？",
          success: function success(t) {
            t.confirm && (_this15.$store.commit("reader/CLEAR_HISTORY"), e.index.showToast({
              title: "历史记录已清空",
              icon: "success"
            }));
          }
        });
      },
      dismissError: function dismissError() {
        this.$store.commit("reader/CLEAR_ERROR");
      },
      showErrorDetails: function showErrorDetails() {
        this.lastError && this.$refs.errorDetailsPopup.open();
      },
      closeErrorDetailsPopup: function closeErrorDetailsPopup() {
        this.$refs.errorDetailsPopup.close();
      },
      retryLastOperation: function retryLastOperation() {
        var _this16 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee12() {
          return _regeneratorRuntime2().wrap(function _callee12$(_context12) {
            while (1) switch (_context12.prev = _context12.next) {
              case 0:
                _this16.closeErrorDetailsPopup();
                _this16.dismissError();
                if (!(_this16.currentCard.uid && _this16.isMifareClassic(_this16.currentCard.type))) {
                  _context12.next = 6;
                  break;
                }
                _this16.showAdvancedReadOptions();
                _context12.next = 8;
                break;
              case 6:
                _context12.next = 8;
                return _this16.handleScanAction();
              case 8:
              case "end":
                return _context12.stop();
            }
          }, _callee12);
        }))();
      },
      getScanIcon: function getScanIcon() {
        switch (this.readingState) {
          case "scanning":
            return "refreshempty";
          case "reading":
            return "download";
          case "analyzing":
            return "gear";
          case "completed":
            return "checkmarkempty";
          case "error":
            return "closeempty";
          default:
            return "scan";
        }
      },
      getScanIconColor: function getScanIconColor() {
        switch (this.readingState) {
          case "scanning":
          case "reading":
          case "analyzing":
            return "#007AFF";
          case "completed":
            return "#4CAF50";
          case "error":
            return "#f44336";
          default:
            return "#999";
        }
      },
      getScanTitle: function getScanTitle() {
        switch (this.readingState) {
          case "scanning":
            return "正在扫描...";
          case "reading":
            return "正在读取...";
          case "analyzing":
            return "正在分析...";
          case "completed":
            return "读取完成";
          case "error":
            return "读取失败";
          default:
            return "将卡片靠近设备";
        }
      },
      getScanDescription: function getScanDescription() {
        if (!this.isConnected) return "请先连接设备";
        if (!this.isReaderMode) return "请先启动读卡模式";
        switch (this.readingState) {
          case "scanning":
            return "正在搜索卡片信号...";
          case "reading":
            return "正在读取卡片数据...";
          case "analyzing":
            return "正在分析卡片类型...";
          case "completed":
            return "数据读取成功";
          case "error":
            return this.lastError ? this.lastError.message : "读取过程中出现错误";
          default:
            return "\u70B9\u51FB\u5F00\u59CB\u626B\u63CF".concat(this.currentMode.toUpperCase(), "\u5361\u7247");
        }
      },
      getScanButtonText: function getScanButtonText() {
        return "scanning" === this.readingState || "reading" === this.readingState ? "停止扫描" : "开始扫描";
      },
      getCardTypeIcon: function getCardTypeIcon(e) {
        var t = {
          mifare_classic: "creditcard",
          mifare_classic_1k: "creditcard",
          mifare_classic_2k: "creditcard",
          mifare_classic_4k: "creditcard",
          mifare_classic_mini: "creditcard",
          mifare_ultralight: "tag",
          ntag: "chip",
          ntag_213: "chip",
          ntag_215: "chip",
          ntag_216: "chip",
          em410x: "key",
          t55xx: "shield",
          iso14443a: "wifi",
          iso14443b: "wifi",
          iso15693: "radio"
        };
        if (!t[e] && e) {
          var _t6 = e.toLowerCase();
          if (_t6.includes("mifare_classic")) return "creditcard";
          if (_t6.includes("ultralight")) return "tag";
          if (_t6.includes("ntag")) return "chip";
          if (_t6.includes("em410x")) return "key";
        }
        return t[e] || "creditcard";
      },
      getCardTypeName: function getCardTypeName(e) {
        if (this.currentCard && this.currentCard.typeDisplay) return this.currentCard.typeDisplay;
        var t = {
          mifare_classic: "Mifare Classic",
          mifare_classic_1k: "Mifare Classic 1K",
          mifare_classic_2k: "Mifare Classic 2K",
          mifare_classic_4k: "Mifare Classic 4K",
          mifare_classic_mini: "Mifare Classic Mini",
          mifare_ultralight: "Mifare Ultralight",
          ntag: "NTAG",
          ntag_213: "NTAG213",
          ntag_215: "NTAG215",
          ntag_216: "NTAG216",
          em410x: "EM410X",
          t55xx: "T55XX",
          iso14443a: "ISO14443A",
          iso14443b: "ISO14443B",
          iso15693: "ISO15693"
        };
        if (!t[e] && e) {
          var _t7 = e.toLowerCase();
          if (_t7.includes("mifare_classic")) return _t7.includes("4k") ? "Mifare Classic 4K" : _t7.includes("2k") ? "Mifare Classic 2K" : _t7.includes("mini") ? "Mifare Classic Mini" : "Mifare Classic 1K";
          if (_t7.includes("ultralight")) return "Mifare Ultralight";
          if (_t7.includes("ntag")) return "NTAG";
        }
        return t[e] || "未知类型";
      },
      getCardTypeColor: function getCardTypeColor(e) {
        var t = {
          mifare_classic: "#FF6B35",
          mifare_classic_1k: "#FF6B35",
          mifare_classic_2k: "#FF8C42",
          mifare_classic_4k: "#FFAD42",
          mifare_classic_mini: "#FF4757",
          mifare_ultralight: "#4ECDC4",
          ntag: "#FFEAA7",
          ntag_213: "#FFEAA7",
          ntag_215: "#FFD93D",
          ntag_216: "#FFA502",
          em410x: "#45B7D1",
          t55xx: "#96CEB4",
          iso14443a: "#74B9FF",
          iso14443b: "#A29BFE",
          iso15693: "#6C5CE7"
        };
        if (!t[e] && e) {
          var _t8 = e.toLowerCase();
          if (_t8.includes("mifare_classic")) return "#FF6B35";
          if (_t8.includes("ultralight")) return "#4ECDC4";
          if (_t8.includes("ntag")) return "#FFEAA7";
          if (_t8.includes("em410x")) return "#45B7D1";
        }
        return t[e] || "#DDA0DD";
      },
      formatTime: function formatTime(e) {
        if (!e) return "未知";
        return new Date(e).toLocaleString();
      },
      formatRelativeTime: function formatRelativeTime(e) {
        if (!e) return "未知";
        var t = new Date(),
          a = new Date(e),
          s = t - a,
          r = Math.floor(s / 6e4),
          i = Math.floor(s / 36e5),
          o = Math.floor(s / 864e5);
        return r < 1 ? "刚刚" : r < 60 ? "".concat(r, "\u5206\u949F\u524D") : i < 24 ? "".concat(i, "\u5C0F\u65F6\u524D") : o < 7 ? "".concat(o, "\u5929\u524D") : a.toLocaleDateString();
      },
      isMifareClassic: function isMifareClassic(e) {
        return this.$store.getters["reader/isMifareClassicType"](e);
      },
      isMifareUltralight: function isMifareUltralight(e) {
        return this.$store.getters["reader/isMifareUltralightType"](e);
      },
      formatBlockData: function formatBlockData(e) {
        return e && Array.isArray(e) ? e.map(function (e) {
          return e.toString(16).padStart(2, "0").toUpperCase();
        }).join(" ") : "无数据";
      },
      formatKey: function formatKey(e) {
        return e && Array.isArray(e) ? e.map(function (e) {
          return e.toString(16).padStart(2, "0").toUpperCase();
        }).join("") : "未知";
      },
      getBlockTypeName: function getBlockTypeName(e) {
        return 3 === e ? "扇区尾块" : 0 === e ? "数据块0" : "\u6570\u636E\u5757".concat(e);
      },
      copyBlockData: function copyBlockData(t) {
        if (!t || !Array.isArray(t)) return void e.index.showToast({
          title: "无数据可复制",
          icon: "none"
        });
        var a = this.formatBlockData(t);
        e.index.setClipboardData({
          data: a,
          success: function success() {
            e.index.showToast({
              title: "块数据已复制",
              icon: "success"
            });
          }
        });
      },
      parseAccessBits: function parseAccessBits(e) {
        if (!e || !Array.isArray(e) || e.length < 16) return "无法解析";
        var t = [e[6], e[7], e[8]],
          a = t[1] >> 4 & 15,
          s = 15 & t[1],
          r = t[2] >> 4 & 15;
        return 0 === a && 0 === s && 0 === r ? "默认访问权限" : 1 === a && 0 === s && 0 === r ? "只读访问" : 0 === a && 1 === s && 0 === r ? "读写访问" : "\u81EA\u5B9A\u4E49\u6743\u9650 (".concat(t.map(function (e) {
          return e.toString(16).padStart(2, "0");
        }).join(" "), ")");
      },
      formatPageData: function formatPageData(e) {
        return e && Array.isArray(e) ? e.map(function (e) {
          return e.toString(16).padStart(2, "0").toUpperCase();
        }).join(" ") : "无数据";
      },
      copyPageData: function copyPageData(t) {
        if (!t || !Array.isArray(t)) return void e.index.showToast({
          title: "无数据可复制",
          icon: "none"
        });
        var a = this.formatPageData(t);
        e.index.setClipboardData({
          data: a,
          success: function success() {
            e.index.showToast({
              title: "页面数据已复制",
              icon: "success"
            });
          }
        });
      },
      isSpecialPage: function isSpecialPage(e) {
        return e <= 3;
      },
      getPageTypeName: function getPageTypeName(e) {
        switch (e) {
          case 0:
          case 1:
            return "UID/BCC";
          case 2:
            return "BCC/内部";
          case 3:
            return "OTP/锁定";
          default:
            return "用户数据";
        }
      },
      getPageInfo: function getPageInfo(e, t) {
        if (!t || !Array.isArray(t)) return "无数据";
        switch (e) {
          case 0:
            return "UID\u524D4\u5B57\u8282: ".concat(t.slice(0, 3).map(function (e) {
              return e.toString(16).padStart(2, "0");
            }).join(" "));
          case 1:
            return "UID\u540E4\u5B57\u8282: ".concat(t.slice(0, 4).map(function (e) {
              return e.toString(16).padStart(2, "0");
            }).join(" "));
          case 2:
            return "BCC\u6821\u9A8C: ".concat(t[0].toString(16).padStart(2, "0"), ", \u5185\u90E8\u6570\u636E: ").concat(t[1].toString(16).padStart(2, "0"));
          case 3:
            return "OTP: ".concat(t.slice(0, 4).map(function (e) {
              return e.toString(16).padStart(2, "0");
            }).join(" "));
          default:
            return "用户自定义数据";
        }
      }
    }),
    onUnload: function onUnload() {
      this.cleanup();
    }
  };if (!Array) {
  (e.resolveComponent("uni-icons") + e.resolveComponent("uni-popup"))();
}Math || (function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
} + function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
})();var o = e._export_sfc(i, [["render", function (t, a, s, r, i, o) {
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
    g: e.p({
      type: "wifi",
      color: "#007AFF",
      size: "24"
    }),
    h: "hf" === t.currentMode ? 1 : "",
    i: e.o(function (e) {
      return o.handleSwitchMode("hf");
    }),
    j: e.p({
      type: "radio",
      color: "#FF9500",
      size: "24"
    }),
    k: "lf" === t.currentMode ? 1 : "",
    l: e.o(function (e) {
      return o.handleSwitchMode("lf");
    }),
    m: e.f(t.supportedCardTypes, function (t, a, s) {
      return {
        a: "77ae6d1e-4-" + s,
        b: e.p({
          type: o.getCardTypeIcon(t),
          color: "#666",
          size: "20"
        }),
        c: e.t(o.getCardTypeName(t)),
        d: t
      };
    }),
    n: "scanning" === t.readingState || "reading" === t.readingState
  }, ("scanning" === t.readingState || t.readingState, {}), {
    o: e.p({
      type: o.getScanIcon(),
      color: o.getScanIconColor(),
      size: "64"
    }),
    p: e.t(o.getScanTitle()),
    q: e.t(o.getScanDescription()),
    r: o.showProgress
  }, o.showProgress ? e.e({
    s: e.t(t.progress.message),
    t: e.t(t.progress.percentage || 0),
    v: (t.progress.percentage || 0) + "%",
    w: t.progress.current && t.progress.total
  }, t.progress.current && t.progress.total ? e.e({
    x: e.t(t.progress.current),
    y: e.t(t.progress.total),
    z: t.progress.eta
  }, t.progress.eta ? {
    A: e.t(t.progress.eta)
  } : {}) : {}, {
    B: t.progress.details && t.progress.details.length > 0
  }, t.progress.details && t.progress.details.length > 0 ? {
    C: e.f(t.progress.details.slice(-3), function (t, a, s) {
      return {
        a: "77ae6d1e-6-" + s,
        b: e.p({
          type: t.success ? "checkmarkempty" : t.error ? "closeempty" : "gear",
          color: t.success ? "#4CAF50" : t.error ? "#f44336" : "#007AFF",
          size: "14"
        }),
        c: e.t(t.message),
        d: a,
        e: t.success ? 1 : "",
        f: t.error ? 1 : ""
      };
    })
  } : {}) : {}, {
    D: "scanning" === t.readingState || "reading" === t.readingState ? 1 : "",
    E: e.p({
      type: "scanning" === t.readingState || "reading" === t.readingState ? "closeempty" : "scan",
      color: "white",
      size: "20"
    }),
    F: e.t(o.getScanButtonText()),
    G: t.canStartReading ? "" : 1,
    H: "scanning" === t.readingState || "reading" === t.readingState ? 1 : "",
    I: !t.canStartReading,
    J: e.o(function () {
      return o.handleScanAction && o.handleScanAction.apply(o, arguments);
    }),
    K: !t.isReaderMode && t.isConnected
  }, !t.isReaderMode && t.isConnected ? {
    L: e.p({
      type: "gear",
      color: "white",
      size: "20"
    }),
    M: e.t(i.isInitializing ? "初始化中..." : "启动读卡模式"),
    N: e.o(function () {
      return o.handleInitializeReader && o.handleInitializeReader.apply(o, arguments);
    }),
    O: i.isInitializing
  } : {}, {
    P: t.currentCard.uid
  }, t.currentCard.uid ? e.e({
    Q: e.t(o.getCardTypeName(t.currentCard.type)),
    R: o.getCardTypeColor(t.currentCard.type),
    S: e.t(t.currentCard.uid),
    T: t.currentCard.sak
  }, t.currentCard.sak ? {
    U: e.t(t.currentCard.sak)
  } : {}, {
    V: t.currentCard.atqa
  }, t.currentCard.atqa ? {
    W: e.t(t.currentCard.atqa)
  } : {}, {
    X: t.currentCard.ats
  }, t.currentCard.ats ? {
    Y: e.t(t.currentCard.ats)
  } : {}, {
    Z: e.t(t.currentCard.protocol || "未知"),
    aa: e.t(o.formatTime(t.currentCard.readTime)),
    ab: void 0 !== t.currentCard.accessibleSectors
  }, void 0 !== t.currentCard.accessibleSectors ? {
    ac: e.t(t.currentCard.accessibleSectors),
    ad: e.t(o.totalSectorCount)
  } : {}, {
    ae: e.p({
      type: t.currentCard.isComplete ? "checkmarkempty" : "closeempty",
      color: t.currentCard.isComplete ? "#4CAF50" : "#f44336",
      size: "16"
    }),
    af: e.t(t.currentCard.isComplete ? "数据完整" : t.currentCard.hasErrors ? "数据不完整" : "基本信息"),
    ag: t.currentCard.isComplete ? 1 : "",
    ah: t.currentCard.hasErrors ? 1 : "",
    ai: t.currentCard.hasErrors && t.currentCard.errorMessage
  }, t.currentCard.hasErrors && t.currentCard.errorMessage ? {
    aj: e.t(t.currentCard.errorMessage)
  } : {}, {
    ak: e.p({
      type: "wallet",
      color: "white",
      size: "16"
    }),
    al: e.o(function () {
      return o.saveToCardPackage && o.saveToCardPackage.apply(o, arguments);
    }),
    am: e.p({
      type: "compose",
      color: "white",
      size: "16"
    }),
    an: e.o(function () {
      return o.goToCardWrite && o.goToCardWrite.apply(o, arguments);
    }),
    ao: o.isMifareClassic(t.currentCard.type) && o.shouldShowAdvancedRead
  }, o.isMifareClassic(t.currentCard.type) && o.shouldShowAdvancedRead ? {
    ap: e.p({
      type: "gear",
      color: "white",
      size: "16"
    }),
    aq: e.o(function () {
      return o.showAdvancedReadOptions && o.showAdvancedReadOptions.apply(o, arguments);
    })
  } : {}, {
    ar: o.isMifareClassic(t.currentCard.type)
  }, o.isMifareClassic(t.currentCard.type) ? {
    as: e.p({
      type: "list",
      color: "white",
      size: "16"
    }),
    at: e.o(function () {
      return o.showSectorDetails && o.showSectorDetails.apply(o, arguments);
    })
  } : {}, {
    av: o.isMifareUltralight(t.currentCard.type)
  }, o.isMifareUltralight(t.currentCard.type) ? {
    aw: e.p({
      type: "list",
      color: "white",
      size: "16"
    }),
    ax: e.o(function () {
      return o.showPageDetails && o.showPageDetails.apply(o, arguments);
    })
  } : {}, {
    ay: e.p({
      type: "download",
      color: "white",
      size: "16"
    }),
    az: e.o(function () {
      return o.exportCardData && o.exportCardData.apply(o, arguments);
    })
  }) : {}, {
    aA: t.recentReads.length > 0
  }, t.recentReads.length > 0 ? {
    aB: e.o(function () {
      return o.clearHistory && o.clearHistory.apply(o, arguments);
    }),
    aC: e.f(t.recentReads, function (t, a, s) {
      return {
        a: "77ae6d1e-16-" + s,
        b: e.p({
          type: o.getCardTypeIcon(t.type),
          color: "#666",
          size: "20"
        }),
        c: e.t(t.uid),
        d: e.t(o.getCardTypeName(t.type)),
        e: e.t(o.formatRelativeTime(t.timestamp)),
        f: t.id,
        g: e.o(function (e) {
          return o.loadHistoryCard(t);
        }, t.id)
      };
    })
  } : {}, {
    aD: e.t(t.statistics.totalReads),
    aE: e.t(t.statistics.successfulReads),
    aF: e.t(t.statistics.successRate),
    aG: e.t(t.statistics.hfReads),
    aH: e.t(t.statistics.lfReads),
    aI: e.p({
      type: "gear",
      size: "20",
      color: "#007AFF"
    }),
    aJ: e.o(function () {
      return o.showPresetMenu && o.showPresetMenu.apply(o, arguments);
    }),
    aK: e.o(o.closeAdvancedReadPopup),
    aL: e.p({
      type: "closeempty",
      size: "24"
    }),
    aM: e.p({
      type: "help",
      size: "16",
      color: "#007AFF"
    }),
    aN: e.o(function () {
      return o.showKeyDictionaryHelp && o.showKeyDictionaryHelp.apply(o, arguments);
    }),
    aO: e.t(o.keyDictionaryNames.length),
    aP: e.t(i.showKeyDictionary ? "收起" : "展开"),
    aQ: e.o(function () {
      return o.toggleKeyDictionary && o.toggleKeyDictionary.apply(o, arguments);
    }),
    aR: i.showKeyDictionary
  }, i.showKeyDictionary ? {
    aS: e.f(o.keyDictionaryNames, function (t, a, s) {
      return {
        a: e.t(t),
        b: e.t(o.formatDictionaryKey(a)),
        c: "77ae6d1e-21-" + s + ",77ae6d1e-17",
        d: e.p({
          type: i.selectedDictionaryKeys.includes(a) ? "checkmarkempty" : "circle",
          color: i.selectedDictionaryKeys.includes(a) ? "#007AFF" : "#ccc",
          size: "20"
        }),
        e: a,
        f: i.selectedDictionaryKeys.includes(a) ? 1 : "",
        g: e.o(function (e) {
          return o.toggleDictionaryKey(a);
        }, a)
      };
    })
  } : {}, {
    aT: e.o(function () {
      return o.selectAllDictionaryKeys && o.selectAllDictionaryKeys.apply(o, arguments);
    }),
    aU: e.o(function () {
      return o.clearDictionarySelection && o.clearDictionarySelection.apply(o, arguments);
    }),
    aV: e.o(function () {
      return o.selectCommonKeys && o.selectCommonKeys.apply(o, arguments);
    }),
    aW: e.o([function (e) {
      return i.customKey = e.detail.value;
    }, function () {
      return o.formatKeyInput && o.formatKeyInput.apply(o, arguments);
    }]),
    aX: i.customKey,
    aY: e.o(function () {
      return o.addCustomKey && o.addCustomKey.apply(o, arguments);
    }),
    aZ: i.customKeys.length > 0
  }, i.customKeys.length > 0 ? {
    ba: e.t(i.customKeys.length),
    bb: e.o(function () {
      return o.clearCustomKeys && o.clearCustomKeys.apply(o, arguments);
    }),
    bc: e.f(i.customKeys, function (t, a, s) {
      return {
        a: e.t(t),
        b: e.o(function (e) {
          return o.removeCustomKey(a);
        }, a),
        c: "77ae6d1e-22-" + s + ",77ae6d1e-17",
        d: a
      };
    }),
    bd: e.p({
      type: "closeempty",
      size: "16",
      color: "#f44336"
    })
  } : {}, {
    be: e.p({
      type: "flash",
      color: "quick" === i.selectedStrategy ? "#007AFF" : "#999",
      size: "20"
    }),
    bf: e.p({
      type: "quick" === i.selectedStrategy ? "checkmarkempty" : "circle",
      color: "quick" === i.selectedStrategy ? "#007AFF" : "#ccc",
      size: "20"
    }),
    bg: "quick" === i.selectedStrategy ? 1 : "",
    bh: e.o(function (e) {
      return o.selectStrategy("quick");
    }),
    bi: e.p({
      type: "gear",
      color: "standard" === i.selectedStrategy ? "#007AFF" : "#999",
      size: "20"
    }),
    bj: e.p({
      type: "standard" === i.selectedStrategy ? "checkmarkempty" : "circle",
      color: "standard" === i.selectedStrategy ? "#007AFF" : "#ccc",
      size: "20"
    }),
    bk: "standard" === i.selectedStrategy ? 1 : "",
    bl: e.o(function (e) {
      return o.selectStrategy("standard");
    }),
    bm: e.p({
      type: "search",
      color: "deep" === i.selectedStrategy ? "#007AFF" : "#999",
      size: "20"
    }),
    bn: e.p({
      type: "deep" === i.selectedStrategy ? "checkmarkempty" : "circle",
      color: "deep" === i.selectedStrategy ? "#007AFF" : "#ccc",
      size: "20"
    }),
    bo: "deep" === i.selectedStrategy ? 1 : "",
    bp: e.o(function (e) {
      return o.selectStrategy("deep");
    }),
    bq: e.p({
      type: "star",
      color: "smart" === i.selectedStrategy ? "#007AFF" : "#999",
      size: "20"
    }),
    br: e.p({
      type: "smart" === i.selectedStrategy ? "checkmarkempty" : "circle",
      color: "smart" === i.selectedStrategy ? "#007AFF" : "#ccc",
      size: "20"
    }),
    bs: "smart" === i.selectedStrategy ? 1 : "",
    bt: e.o(function (e) {
      return o.selectStrategy("smart");
    }),
    bv: i.useDefaultKeys,
    bw: e.o(function () {
      return o.toggleDefaultKeys && o.toggleDefaultKeys.apply(o, arguments);
    }),
    bx: i.useBackdoorAttack,
    by: e.o(function () {
      return o.toggleBackdoorAttack && o.toggleBackdoorAttack.apply(o, arguments);
    }),
    bz: i.useNestedAttack,
    bA: e.o(function () {
      return o.toggleNestedAttack && o.toggleNestedAttack.apply(o, arguments);
    }),
    bB: i.showDetailedProgress,
    bC: e.o(function () {
      return o.toggleDetailedProgress && o.toggleDetailedProgress.apply(o, arguments);
    }),
    bD: i.autoRetryFailedSectors,
    bE: e.o(function () {
      return o.toggleAutoRetry && o.toggleAutoRetry.apply(o, arguments);
    }),
    bF: e.o(function () {
      return o.closeAdvancedReadPopup && o.closeAdvancedReadPopup.apply(o, arguments);
    }),
    bG: e.o(function () {
      return o.startAdvancedRead && o.startAdvancedRead.apply(o, arguments);
    }),
    bH: e.sr("advancedReadPopup", "77ae6d1e-17"),
    bI: e.p({
      type: "bottom",
      "background-color": "#fff"
    }),
    bJ: e.o(o.closePageDetailsPopup),
    bK: e.p({
      type: "closeempty",
      size: "24"
    }),
    bL: t.currentCard.pages
  }, t.currentCard.pages ? {
    bM: e.f(t.currentCard.pages, function (t, a, s) {
      return e.e({
        a: e.t(a),
        b: e.t(o.getPageTypeName(a)),
        c: e.t(o.formatPageData(t)),
        d: "77ae6d1e-33-" + s + ",77ae6d1e-31",
        e: e.o(function (e) {
          return o.copyPageData(t);
        }, a),
        f: o.isSpecialPage(a)
      }, o.isSpecialPage(a) ? {
        g: e.t(o.getPageInfo(a, t))
      } : {}, {
        h: a,
        i: o.isSpecialPage(a) ? 1 : "",
        j: o.isSpecialPage(a) ? "" : 1
      });
    }),
    bN: e.p({
      type: "paperclip",
      size: "14",
      color: "#007AFF"
    })
  } : {}, {
    bO: e.sr("pageDetailsPopup", "77ae6d1e-31"),
    bP: e.p({
      type: "center",
      "background-color": "#fff"
    }),
    bQ: e.o(o.closeErrorDetailsPopup),
    bR: e.p({
      type: "closeempty",
      size: "24"
    }),
    bS: t.lastError
  }, t.lastError ? e.e({
    bT: e.p({
      type: "closeempty",
      color: "#f44336",
      size: "32"
    }),
    bU: e.t(t.lastError.title || "读取失败"),
    bV: e.t(t.lastError.message),
    bW: t.lastError.details
  }, t.lastError.details ? {
    bX: e.t(t.lastError.details)
  } : {}, {
    bY: t.lastError.suggestions && t.lastError.suggestions.length > 0
  }, t.lastError.suggestions && t.lastError.suggestions.length > 0 ? {
    bZ: e.f(t.lastError.suggestions, function (t, a, s) {
      return {
        a: e.t(a + 1),
        b: e.t(t),
        c: a
      };
    })
  } : {}, {
    ca: e.t(o.formatTime(t.lastError.timestamp))
  }) : {}, {
    cb: e.o(function () {
      return o.retryLastOperation && o.retryLastOperation.apply(o, arguments);
    }),
    cc: e.o(function () {
      return o.closeErrorDetailsPopup && o.closeErrorDetailsPopup.apply(o, arguments);
    }),
    cd: e.sr("errorDetailsPopup", "77ae6d1e-34"),
    ce: e.p({
      type: "center",
      "background-color": "#fff"
    }),
    cf: e.o(o.closeSaveOptions),
    cg: e.p({
      type: "closeempty",
      size: "24"
    }),
    ch: e.p({
      type: o.getCardTypeIcon(t.currentCard.type),
      color: o.getCardTypeColor(t.currentCard.type),
      size: "32"
    }),
    ci: e.t(o.getCardTypeName(t.currentCard.type)),
    cj: e.t(t.currentCard.uid),
    ck: e.t(t.currentCard.uid),
    cl: t.currentCard.sak
  }, t.currentCard.sak ? {
    cm: e.t(t.currentCard.sak)
  } : {}, {
    cn: t.currentCard.atqa
  }, t.currentCard.atqa ? {
    co: e.t(t.currentCard.atqa)
  } : {}, {
    cp: e.t(o.formatTime(t.currentCard.readTime)),
    cq: void 0 !== t.currentCard.accessibleSectors
  }, void 0 !== t.currentCard.accessibleSectors ? {
    cr: e.t(t.currentCard.accessibleSectors),
    cs: e.t(o.totalSectorCount)
  } : {}, {
    ct: i.saveCardName,
    cv: e.o(function (e) {
      return i.saveCardName = e.detail.value;
    }),
    cw: i.saveCompleteData,
    cx: e.o(function () {
      return o.toggleSaveCompleteData && o.toggleSaveCompleteData.apply(o, arguments);
    }),
    cy: i.saveReadTime,
    cz: e.o(function () {
      return o.toggleSaveReadTime && o.toggleSaveReadTime.apply(o, arguments);
    }),
    cA: e.o(function () {
      return o.closeSaveOptions && o.closeSaveOptions.apply(o, arguments);
    }),
    cB: e.o(function () {
      return o.executeSave && o.executeSave.apply(o, arguments);
    }),
    cC: e.sr("saveOptionsPopup", "77ae6d1e-37"),
    cD: e.p({
      type: "center",
      "background-color": "#fff"
    }),
    cE: t.lastError
  }, t.lastError ? {
    cF: e.p({
      type: "closeempty",
      color: "#f44336",
      size: "20"
    }),
    cG: e.t(t.lastError.message),
    cH: e.o(function () {
      return o.showErrorDetails && o.showErrorDetails.apply(o, arguments);
    }),
    cI: e.o(function () {
      return o.dismissError && o.dismissError.apply(o, arguments);
    })
  } : {});
}], ["__scopeId", "data-v-77ae6d1e"]]);wx.createPage(o);