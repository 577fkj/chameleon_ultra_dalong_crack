var _toConsumableArray2 = require("../../@babel/runtime/helpers/toConsumableArray");var _typeof2 = require("../../@babel/runtime/helpers/typeof");require("../../@babel/runtime/helpers/Arrayincludes");var _regeneratorRuntime2 = require("../../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../../@babel/runtime/helpers/asyncToGenerator");var _objectSpread2 = require("../../@babel/runtime/helpers/objectSpread2");var t = require("../../common/vendor.js"),
  a = require("../../utils/chameleon-protocol.js"),
  e = require("../../services/bluetooth.js"),
  s = {
    name: "SlotEditPage",
    data: function data() {
      return {
        slotId: 0,
        frequency: "hf",
        isNew: !1,
        cardData: {
          name: "",
          uid: "",
          sak: "",
          atqa: "",
          ats: "",
          tagType: a.TagType.UNKNOWN
        },
        emulatorSettings: {
          gen1aEnabled: !1,
          gen2Enabled: !1,
          antiCollEnabled: !1,
          detectionEnabled: !1,
          writeMode: "normal"
        },
        isLoading: !1,
        loadingText: "处理中...",
        showSuccessToast: !1,
        successMessage: "",
        selectedTypeIndex: 0,
        writeModeIndex: 0,
        availableTypes: [{
          value: a.TagType.MIFARE_1024,
          name: "MIFARE Classic 1K"
        }, {
          value: a.TagType.MIFARE_2048,
          name: "MIFARE Classic 2K"
        }, {
          value: a.TagType.MIFARE_4096,
          name: "MIFARE Classic 4K"
        }, {
          value: a.TagType.MIFARE_Mini,
          name: "MIFARE Mini"
        }, {
          value: a.TagType.NTAG_213,
          name: "NTAG213"
        }, {
          value: a.TagType.NTAG_215,
          name: "NTAG215"
        }, {
          value: a.TagType.NTAG_216,
          name: "NTAG216"
        }, {
          value: a.TagType.MIFARE_Ultralight,
          name: "MIFARE Ultralight"
        }, {
          value: a.TagType.MIFARE_Ultralight_C,
          name: "MIFARE Ultralight C"
        }, {
          value: a.TagType.UNKNOWN,
          name: "未知类型"
        }],
        writeModes: [{
          value: "normal",
          name: "正常"
        }, {
          value: "denied",
          name: "拒绝"
        }, {
          value: "deceive",
          name: "欺骗"
        }, {
          value: "shadow",
          name: "影子"
        }],
        formErrors: {},
        cardSearchQuery: "",
        showCardPackage: !1,
        currentCardFilter: "all",
        selectedCardDetail: null,
        cardFilters: [{
          id: "all",
          name: "全部",
          icon: "list",
          count: 0
        }, {
          id: "hf",
          name: "HF",
          icon: "creditcard",
          count: 0
        }, {
          id: "lf",
          name: "LF",
          icon: "wifi",
          count: 0
        }, {
          id: "mifare",
          name: "Mifare",
          icon: "tag",
          count: 0
        }, {
          id: "em410x",
          name: "EM410X",
          icon: "key",
          count: 0
        }]
      };
    },
    computed: _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, t.mapState("slots", ["slots"])), t.mapState("cards", ["cards"])), t.mapGetters("device", ["isConnected"])), t.mapGetters("cards", ["filteredCards"])), {}, {
      pageTitle: function pageTitle() {
        return this.isNew ? "添加卡片" : "编辑卡片";
      },
      canSave: function canSave() {
        return this.cardData.name.trim().length > 0 && 0 === Object.keys(this.formErrors).length && !this.isLoading;
      },
      selectedTypeName: function selectedTypeName() {
        var t = this.availableTypes[this.selectedTypeIndex];
        return t ? t.name : "未知类型";
      },
      selectedWriteMode: function selectedWriteMode() {
        return this.writeModes[this.writeModeIndex] || this.writeModes[0];
      },
      isHFCard: function isHFCard() {
        var t = this.availableTypes[this.selectedTypeIndex];
        return t && a.ChameleonProtocol.isHighFrequency(t.value);
      },
      isMifareClassic: function isMifareClassic() {
        var t = this.availableTypes[this.selectedTypeIndex];
        return !!t && [a.TagType.MIFARE_1024, a.TagType.MIFARE_2048, a.TagType.MIFARE_4096, a.TagType.MIFARE_Mini].includes(t.value);
      },
      isNTAG: function isNTAG() {
        var t = this.availableTypes[this.selectedTypeIndex];
        return !!t && [a.TagType.NTAG_213, a.TagType.NTAG_215, a.TagType.NTAG_216].includes(t.value);
      },
      isMifareUltralight: function isMifareUltralight() {
        var t = this.availableTypes[this.selectedTypeIndex];
        return !!t && [a.TagType.MIFARE_Ultralight, a.TagType.MIFARE_Ultralight_C].includes(t.value);
      },
      filteredPackageCards: function filteredPackageCards() {
        var t = this.cards || [];
        if ("all" === this.currentCardFilter) t = "hf" === this.frequency ? t.filter(function (t) {
          return 2 === t.getFrequency();
        }) : t.filter(function (t) {
          return 1 === t.getFrequency();
        });else switch (this.currentCardFilter) {
          case "hf":
            t = t.filter(function (t) {
              return 2 === t.getFrequency();
            });
            break;
          case "lf":
            t = t.filter(function (t) {
              return 1 === t.getFrequency();
            });
            break;
          case "mifare":
            t = t.filter(function (t) {
              return t.isMifareClassic() || t.isMifareUltralight();
            });
            break;
          case "em410x":
            t = t.filter(function (t) {
              return t.tag === a.TagType.EM410X;
            });
        }
        if (this.cardSearchQuery.trim()) {
          var _a = this.cardSearchQuery.toLowerCase();
          t = t.filter(function (t) {
            return t.name.toLowerCase().includes(_a) || t.uid.toLowerCase().includes(_a) || t.getTypeString().toLowerCase().includes(_a);
          });
        }
        return this.updateFilterCounts(), t;
      }
    }),
    onLoad: function onLoad(t) {
      this.initPage(t);
    },
    methods: _objectSpread2(_objectSpread2(_objectSpread2({}, t.mapActions("slots", ["loadSlot", "getMifareEmulatorSettings", "setMifareEmulatorSettings"])), t.mapActions("cards", ["loadCardsFromStorage"])), {}, {
      initPage: function initPage(a) {
        var _this = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
          var _s, _i;
          return _regeneratorRuntime2().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _this.slotId = parseInt(a.slotId || 0), _this.frequency = a.frequency || "hf", _this.isNew = "true" === a.isNew;
                _s = "true" === a.fromPackage, _i = a.cardData;
                console.log("[SlotEdit] 初始化页面参数:", {
                  slotId: _this.slotId,
                  slotDisplayNumber: _this.slotId + 1,
                  frequency: _this.frequency,
                  isNew: _this.isNew,
                  fromPackage: _s,
                  originalSlotId: a.slotId
                });
                t.index.setNavigationBarTitle({
                  title: _this.pageTitle
                });
                t.index.setNavigationBarColor({
                  frontColor: "#000000",
                  backgroundColor: "#ffffff"
                });
                if (!_this.isNew) {
                  _context.next = 15;
                  break;
                }
                if (!(_s && _i)) {
                  _context.next = 12;
                  break;
                }
                _context.next = 10;
                return _this.loadCardFromPackage(_i);
              case 10:
                _context.next = 13;
                break;
              case 12:
                _this.setDefaultValues();
              case 13:
                _context.next = 17;
                break;
              case 15:
                _context.next = 17;
                return _this.loadExistingCard();
              case 17:
                _context.t0 = _this.isMifareClassic;
                if (!_context.t0) {
                  _context.next = 21;
                  break;
                }
                _context.next = 21;
                return _this.loadEmulatorSettings();
              case 21:
                _this.validateForm();
                _context.prev = 22;
                _context.next = 25;
                return _this.loadCardsFromStorage();
              case 25:
                _context.next = 30;
                break;
              case 27:
                _context.prev = 27;
                _context.t1 = _context["catch"](22);
                console.warn("[SlotEdit] 预加载卡包数据失败:", _context.t1);
              case 30:
                _context.next = 35;
                break;
              case 32:
                _context.prev = 32;
                _context.t2 = _context["catch"](0);
                console.error("[SlotEdit] 初始化失败:", _context.t2), _this.showError("初始化失败: " + _context.t2.message);
              case 35:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[0, 32], [22, 27]]);
        }))();
      },
      loadExistingCard: function loadExistingCard() {
        var _this2 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
          var _t, _e, _s2;
          return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                if (!_this2.isConnected) {
                  _context2.next = 27;
                  break;
                }
                _context2.prev = 1;
                _this2.isLoading = !0, _this2.loadingText = "加载卡片数据...";
                _t = _this2.slots[_this2.slotId];
                if (_t) {
                  _context2.next = 6;
                  break;
                }
                throw new Error("找不到指定的卡槽");
              case 6:
                _e = "hf" === _this2.frequency ? _t.hf : _t.lf;
                if (!(!_e || _e.tagType === a.TagType.UNKNOWN)) {
                  _context2.next = 9;
                  break;
                }
                throw new Error("\u8BE5\u5361\u69FD\u6CA1\u6709".concat(_this2.frequency.toUpperCase(), "\u5361\u7247"));
              case 9:
                _this2.cardData.name = _e.name || "\u5361\u69FD ".concat(_this2.slotId + 1), _this2.cardData.tagType = _e.tagType;
                _s2 = _this2.availableTypes.findIndex(function (t) {
                  return t.value === _e.tagType;
                });
                _this2.selectedTypeIndex = _s2 >= 0 ? _s2 : 0;
                _context2.t0 = "hf" === _this2.frequency && _this2.isHFCard;
                if (!_context2.t0) {
                  _context2.next = 17;
                  break;
                }
                _this2.loadingText = "读取卡片详情...";
                _context2.next = 17;
                return _this2.loadHFCardDetails();
              case 17:
                _context2.next = 22;
                break;
              case 19:
                _context2.prev = 19;
                _context2.t1 = _context2["catch"](1);
                console.error("[SlotEdit] 加载卡片数据失败:", _context2.t1), _this2.showError("加载卡片数据失败: " + _context2.t1.message);
              case 22:
                _context2.prev = 22;
                _this2.isLoading = !1, _this2.loadingText = "处理中...";
                return _context2.finish(22);
              case 25:
                _context2.next = 28;
                break;
              case 27:
                _this2.showConnectionRequired();
              case 28:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[1, 19, 22, 25]]);
        }))();
      },
      loadHFCardDetails: function loadHFCardDetails() {
        var _this3 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
          var _t2, _a2, _a3;
          return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return e.bluetoothService.setActiveSlot(_this3.slotId);
              case 3:
                _context3.next = 5;
                return _this3.$store.dispatch("slots/getHfCardUID", _this3.slotId);
              case 5:
                _t2 = _context3.sent;
                if (_t2) {
                  _this3.cardData.uid = _this3.formatHexData(_t2.uid);
                  _a2 = _t2.uid ? _t2.uid.replace(/\s/g, "").length / 2 : 4;
                  if (void 0 !== _t2.sak) {
                    _a3 = "number" == typeof _t2.sak ? _t2.sak : parseInt(_t2.sak, 16);
                    _this3.cardData.sak = _a3.toString(16).padStart(2, "0").toUpperCase();
                  } else _this3.cardData.sak = _this3.getDefaultSAK(_this3.cardData.tagType, _a2);
                  _t2.atqa ? _this3.cardData.atqa = _this3.formatHexData(_t2.atqa) : _this3.cardData.atqa = _this3.getDefaultATQA(_this3.cardData.tagType, _a2), _this3.cardData.ats = _this3.formatHexData(_t2.ats);
                }
                _context3.next = 12;
                break;
              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3["catch"](0);
                console.warn("[SlotEdit] 获取HF卡片详情失败:", _context3.t0.message);
              case 12:
              case "end":
                return _context3.stop();
            }
          }, _callee3, null, [[0, 9]]);
        }))();
      },
      setDefaultValues: function setDefaultValues() {
        this.cardData = {
          name: "\u5361\u69FD ".concat(this.slotId + 1),
          uid: "",
          sak: "",
          atqa: "",
          ats: "",
          tagType: a.TagType.MIFARE_1024
        };
        var t = this.availableTypes.findIndex(function (t) {
          return t.value === a.TagType.MIFARE_1024;
        });
        this.selectedTypeIndex = t >= 0 ? t : 0;
      },
      loadCardFromPackage: function loadCardFromPackage(e) {
        var _this4 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4() {
          var _s3, _t3, _t4, _t5;
          return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                try {
                  _s3 = JSON.parse(decodeURIComponent(e));
                  if (console.log("[SlotEdit] 从卡包加载卡片:", _s3.name), _this4.cardData.name = _s3.name || "\u5361\u69FD ".concat(_this4.slotId + 1), _s3.uid) {
                    _t3 = _s3.uid.replace(/\s/g, "");
                    _this4.cardData.uid = _this4.formatHexData(_t3);
                  } else _this4.cardData.uid = "";
                  if (_s3.tag) {
                    _t4 = _this4.availableTypes.findIndex(function (t) {
                      return t.value === _s3.tag;
                    });
                    -1 !== _t4 && (_this4.selectedTypeIndex = _t4, _this4.cardData.tagType = _s3.tag, a.ChameleonProtocol.isHighFrequency(_s3.tag) ? _this4.frequency = "hf" : _this4.frequency = "lf");
                  }
                  if (_this4.isHFCard) {
                    _t5 = _s3.uid ? _s3.uid.replace(/\s/g, "").length / 2 : 4;
                    void 0 !== _s3.sak && null !== _s3.sak ? _this4.cardData.sak = "number" == typeof _s3.sak ? _s3.sak.toString(16).padStart(2, "0").toUpperCase() : _s3.sak.toString() : _this4.cardData.sak = _this4.getDefaultSAK(_s3.tag, _t5), _s3.atqa && _s3.atqa.length > 0 ? _this4.cardData.atqa = Array.isArray(_s3.atqa) ? Array.from(_s3.atqa).map(function (t) {
                      return t.toString(16).padStart(2, "0");
                    }).join(" ").toUpperCase() : _s3.atqa : _this4.cardData.atqa = _this4.getDefaultATQA(_s3.tag, _t5), _s3.ats && _s3.ats.length > 0 ? _this4.cardData.ats = Array.isArray(_s3.ats) ? Array.from(_s3.ats).map(function (t) {
                      return t.toString(16).padStart(2, "0");
                    }).join(" ").toUpperCase() : _s3.ats : _this4.cardData.ats = "";
                  }
                  _s3.data && _s3.data.length > 0 && (_this4.cardData.data = _s3.data.map(function (t) {
                    return Array.isArray(t) ? Array.from(t) : t;
                  })), t.index.showToast({
                    title: "卡片数据已加载",
                    icon: "success"
                  });
                } catch (s) {
                  console.error("[SlotEdit] 加载卡包数据失败:", s), t.index.showToast({
                    title: "加载卡片数据失败",
                    icon: "error"
                  }), _this4.setDefaultValues();
                }
              case 1:
              case "end":
                return _context4.stop();
            }
          }, _callee4);
        }))();
      },
      loadEmulatorSettings: function loadEmulatorSettings() {
        var _this5 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5() {
          var _t6, _a4;
          return _regeneratorRuntime2().wrap(function _callee5$(_context5) {
            while (1) switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return e.bluetoothService.getMifareEmulatorSettings();
              case 3:
                _t6 = _context5.sent;
                _this5.emulatorSettings = {
                  gen1aEnabled: _t6.gen1aEnabled || !1,
                  gen2Enabled: _t6.gen2Enabled || !1,
                  antiCollEnabled: _t6.antiCollEnabled || !1,
                  detectionEnabled: _t6.detectionEnabled || !1,
                  writeMode: _t6.writeMode || "normal"
                };
                _a4 = _this5.writeModes.findIndex(function (t) {
                  return t.value === _this5.emulatorSettings.writeMode;
                });
                _this5.writeModeIndex = _a4 >= 0 ? _a4 : 0, console.log("[SlotEdit] 加载模拟器设置成功:", _this5.emulatorSettings);
                _context5.next = 12;
                break;
              case 9:
                _context5.prev = 9;
                _context5.t0 = _context5["catch"](0);
                console.warn("[SlotEdit] 加载模拟器设置失败:", _context5.t0.message), _this5.emulatorSettings = {
                  gen1aEnabled: !1,
                  gen2Enabled: !1,
                  antiCollEnabled: !1,
                  detectionEnabled: !1,
                  writeMode: "normal"
                }, _this5.writeModeIndex = 0;
              case 12:
              case "end":
                return _context5.stop();
            }
          }, _callee5, null, [[0, 9]]);
        }))();
      },
      formatHexData: function formatHexData(t) {
        var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !1;
        if (!t) return "";
        var e = t.toString().replace(/[^0-9A-Fa-f]/g, "");
        return a ? e.toUpperCase() : e.replace(/(.{2})/g, "$1 ").trim().toUpperCase();
      },
      formatHexInput: function formatHexInput(t, a) {
        var _this6 = this;
        var e = a.detail.value.replace(/[^0-9A-Fa-f\s]/g, "");
        if ("sak" === t) {
          var _a5 = e.replace(/\s/g, "").substring(0, 2).toUpperCase();
          this.cardData[t] = _a5;
        } else {
          e = e.replace(/\s+/g, " ");
          var _a6 = e.replace(/\s/g, "").replace(/(.{2})/g, "$1 ").trim().toUpperCase();
          this.cardData[t] = _a6;
        }
        this.$nextTick(function () {
          _this6.validateField(t);
        });
      },
      handlePaste: function handlePaste(t, a) {
        var _this7 = this;
        var e;
        var s = (null == (e = a.clipboardData) ? void 0 : e.getData("text")) || "",
          i = this.formatHexData(s);
        this.cardData[t] = i, a.preventDefault(), this.$nextTick(function () {
          _this7.validateField(t);
        });
      },
      copyHexData: function copyHexData(a) {
        var e = this.cardData[a];
        if (!e) return;
        var s = e.replace(/\s/g, "");
        t.index.setClipboardData({
          data: s,
          success: function success() {
            t.index.showToast({
              title: "已复制",
              icon: "success",
              duration: 1e3
            });
          }
        });
      },
      validateForm: function validateForm() {
        if (this.formErrors = {}, this.cardData.name.trim()) {
          var _t7 = this.getUTF8ByteLength(this.cardData.name);
          _t7 > 32 && (this.formErrors.name = "\u540D\u79F0\u8FC7\u957F\uFF0C\u6700\u591A\u652F\u630132\u5B57\u8282 (\u5F53\u524D: ".concat(_t7, "\u5B57\u8282)"));
        } else this.formErrors.name = "请输入卡片名称";
        this.isHFCard && (this.validateUID(), this.validateSAK(), this.validateATQA(), this.validateATS());
      },
      getUTF8ByteLength: function getUTF8ByteLength(t) {
        var a = 0;
        for (var _e2 = 0; _e2 < t.length; _e2++) {
          var _s4 = t.charCodeAt(_e2);
          a += _s4 < 128 ? 1 : _s4 < 2048 ? 2 : 3;
        }
        return a;
      },
      validateField: function validateField(t) {
        switch (t) {
          case "uid":
            this.validateUID();
            break;
          case "sak":
            this.validateSAK();
            break;
          case "atqa":
            this.validateATQA();
            break;
          case "ats":
            this.validateATS();
        }
      },
      getDefaultATQA: function getDefaultATQA(t) {
        var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        if (null !== e) {
          if (7 === e) return "00 44";
          if (4 === e) return "00 04";
        }
        switch (t) {
          case a.TagType.MIFARE_1024:
          case a.TagType.MIFARE_2048:
          case a.TagType.MIFARE_4096:
            return "00 04";
          case a.TagType.MIFARE_Ultralight:
          case a.TagType.NTAG_213:
          case a.TagType.NTAG_215:
          case a.TagType.NTAG_216:
            return "00 44";
          default:
            return "00 04";
        }
      },
      getDefaultSAK: function getDefaultSAK(t) {
        var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        if (null !== e) {
          if (7 === e) return "08";
          if (4 === e) switch (t) {
            case a.TagType.MIFARE_1024:
              return "08";
            case a.TagType.MIFARE_2048:
              return "18";
            case a.TagType.MIFARE_4096:
              return "38";
            default:
              return "08";
          }
        }
        switch (t) {
          case a.TagType.MIFARE_1024:
            return "08";
          case a.TagType.MIFARE_2048:
            return "18";
          case a.TagType.MIFARE_4096:
            return "38";
          case a.TagType.MIFARE_Ultralight:
          case a.TagType.NTAG_213:
          case a.TagType.NTAG_215:
          case a.TagType.NTAG_216:
            return "00";
          default:
            return "08";
        }
      },
      validateUID: function validateUID() {
        var t = this.cardData.uid.replace(/\s/g, "");
        if (!t) return void (this.formErrors.uid = "请输入UID");
        if (!/^[0-9A-Fa-f]+$/.test(t)) return void (this.formErrors.uid = "UID必须为十六进制格式");
        [8, 14, 20].includes(t.length) ? delete this.formErrors.uid : this.formErrors.uid = "UID长度必须为4、7或10字节 (当前: " + t.length / 2 + "字节)";
      },
      validateSAK: function validateSAK() {
        var t = this.cardData.sak.replace(/\s/g, "");
        t ? /^[0-9A-Fa-f]{2}$/.test(t) ? delete this.formErrors.sak : this.formErrors.sak = "SAK必须为1字节十六进制" : this.formErrors.sak = "请输入SAK";
      },
      validateATQA: function validateATQA() {
        var t = this.cardData.atqa.replace(/\s/g, "");
        t ? /^[0-9A-Fa-f]{4}$/.test(t) ? delete this.formErrors.atqa : this.formErrors.atqa = "ATQA必须为2字节十六进制" : this.formErrors.atqa = "请输入ATQA";
      },
      validateATS: function validateATS() {
        var t = this.cardData.ats.replace(/\s/g, "");
        t ? /^[0-9A-Fa-f]*$/.test(t) ? t.length % 2 == 0 ? delete this.formErrors.ats : this.formErrors.ats = "ATS长度必须为偶数" : this.formErrors.ats = "ATS必须为十六进制格式" : delete this.formErrors.ats;
      },
      onTypeChange: function onTypeChange(t) {
        this.selectedTypeIndex = t.detail.value;
        var a = this.availableTypes[this.selectedTypeIndex];
        this.cardData.tagType = a.value, this.validateForm(), this.isMifareClassic && this.loadEmulatorSettings();
      },
      onGen1AChange: function onGen1AChange(t) {
        var _this8 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee6() {
          return _regeneratorRuntime2().wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                _this8.emulatorSettings.gen1aEnabled = t.detail.value;
                _context6.next = 3;
                return _this8.updateEmulatorSetting("gen1a", t.detail.value);
              case 3:
                _this8.showSuccessMessage("GEN1A模式已更新");
              case 4:
              case "end":
                return _context6.stop();
            }
          }, _callee6);
        }))();
      },
      onGen2Change: function onGen2Change(t) {
        var _this9 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee7() {
          return _regeneratorRuntime2().wrap(function _callee7$(_context7) {
            while (1) switch (_context7.prev = _context7.next) {
              case 0:
                _this9.emulatorSettings.gen2Enabled = t.detail.value;
                _context7.next = 3;
                return _this9.updateEmulatorSetting("gen2", t.detail.value);
              case 3:
                _this9.showSuccessMessage("GEN2模式已更新");
              case 4:
              case "end":
                return _context7.stop();
            }
          }, _callee7);
        }))();
      },
      onAntiCollChange: function onAntiCollChange(t) {
        var _this10 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee8() {
          return _regeneratorRuntime2().wrap(function _callee8$(_context8) {
            while (1) switch (_context8.prev = _context8.next) {
              case 0:
                _this10.emulatorSettings.antiCollEnabled = t.detail.value;
                _context8.next = 3;
                return _this10.updateEmulatorSetting("antiColl", t.detail.value);
              case 3:
                _this10.showSuccessMessage("防冲突模式已更新");
              case 4:
              case "end":
                return _context8.stop();
            }
          }, _callee8);
        }))();
      },
      onDetectionChange: function onDetectionChange(t) {
        var _this11 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee9() {
          return _regeneratorRuntime2().wrap(function _callee9$(_context9) {
            while (1) switch (_context9.prev = _context9.next) {
              case 0:
                _this11.emulatorSettings.detectionEnabled = t.detail.value;
                _context9.next = 3;
                return _this11.updateEmulatorSetting("detection", t.detail.value);
              case 3:
                _this11.showSuccessMessage("检测模式已更新");
              case 4:
              case "end":
                return _context9.stop();
            }
          }, _callee9);
        }))();
      },
      onWriteModeChange: function onWriteModeChange(t) {
        var _this12 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee10() {
          var a;
          return _regeneratorRuntime2().wrap(function _callee10$(_context10) {
            while (1) switch (_context10.prev = _context10.next) {
              case 0:
                _this12.writeModeIndex = t.detail.value;
                a = _this12.writeModes[_this12.writeModeIndex];
                _this12.emulatorSettings.writeMode = a.value;
                _context10.next = 5;
                return _this12.updateEmulatorSetting("writeMode", a.value);
              case 5:
                _this12.showSuccessMessage("写入模式已更新");
              case 6:
              case "end":
                return _context10.stop();
            }
          }, _callee10);
        }))();
      },
      updateEmulatorSetting: function updateEmulatorSetting(t, a) {
        var _this13 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee11() {
          return _regeneratorRuntime2().wrap(function _callee11$(_context11) {
            while (1) switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                _context11.t0 = (console.log("[SlotEdit] \u66F4\u65B0\u6A21\u62DF\u5668\u8BBE\u7F6E: ".concat(t, " = ").concat(a, ", \u5361\u69FDID: ").concat(_this13.slotId, " (UI\u663E\u793A: \u5361\u69FD").concat(_this13.slotId + 1, ")")), t);
                _context11.next = _context11.t0 === "gen1a" ? 4 : _context11.t0 === "gen2" ? 7 : _context11.t0 === "antiColl" ? 10 : _context11.t0 === "detection" ? 13 : _context11.t0 === "writeMode" ? 16 : 19;
                break;
              case 4:
                _context11.next = 6;
                return e.bluetoothService.setMf1Gen1aMode(_this13.slotId, a);
              case 6:
                return _context11.abrupt("break", 20);
              case 7:
                _context11.next = 9;
                return e.bluetoothService.setMf1Gen2Mode(_this13.slotId, a);
              case 9:
                return _context11.abrupt("break", 20);
              case 10:
                _context11.next = 12;
                return e.bluetoothService.setMf1UseFirstBlockColl(_this13.slotId, a);
              case 12:
                return _context11.abrupt("break", 20);
              case 13:
                _context11.next = 15;
                return e.bluetoothService.setMf1DetectionMode(_this13.slotId, a);
              case 15:
                return _context11.abrupt("break", 20);
              case 16:
                _context11.next = 18;
                return e.bluetoothService.setMf1WriteMode(_this13.slotId, a);
              case 18:
                return _context11.abrupt("break", 20);
              case 19:
                console.warn("[SlotEdit] \u672A\u77E5\u7684\u6A21\u62DF\u5668\u8BBE\u7F6E: ".concat(t));
              case 20:
                _context11.next = 22;
                return _this13.loadEmulatorSettings();
              case 22:
                _context11.next = 30;
                break;
              case 24:
                _context11.prev = 24;
                _context11.t1 = _context11["catch"](0);
                console.error("[SlotEdit] 更新模拟器设置失败:", _context11.t1);
                _this13.showError("更新设置失败: " + _context11.t1.message);
                _context11.next = 30;
                return _this13.loadEmulatorSettings();
              case 30:
              case "end":
                return _context11.stop();
            }
          }, _callee11, null, [[0, 24]]);
        }))();
      },
      saveSlot: function saveSlot() {
        var _this14 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee12() {
          return _regeneratorRuntime2().wrap(function _callee12$(_context12) {
            while (1) switch (_context12.prev = _context12.next) {
              case 0:
                if (!_this14.canSave) {
                  _context12.next = 21;
                  break;
                }
                if (!_this14.isConnected) {
                  _context12.next = 20;
                  break;
                }
                _context12.prev = 2;
                if (!(_this14.isLoading = !0, _this14.loadingText = "验证数据...", _this14.validateForm(), Object.keys(_this14.formErrors).length > 0)) {
                  _context12.next = 5;
                  break;
                }
                return _context12.abrupt("return", void _this14.showError("请检查输入的数据格式"));
              case 5:
                _this14.loadingText = "保存到设备...";
                _context12.next = 8;
                return _this14.saveCardToDevice();
              case 8:
                _this14.showSuccessMessage("保存成功");
                setTimeout(function () {
                  _this14.goBack();
                }, 1500);
                _context12.next = 15;
                break;
              case 12:
                _context12.prev = 12;
                _context12.t0 = _context12["catch"](2);
                console.error("[SlotEdit] 保存失败:", _context12.t0), _this14.showError("保存失败: " + _context12.t0.message);
              case 15:
                _context12.prev = 15;
                _this14.isLoading = !1, _this14.loadingText = "处理中...";
                return _context12.finish(15);
              case 18:
                _context12.next = 21;
                break;
              case 20:
                _this14.showConnectionRequired();
              case 21:
              case "end":
                return _context12.stop();
            }
          }, _callee12, null, [[2, 12, 15, 18]]);
        }))();
      },
      saveCardToDevice: function saveCardToDevice() {
        var _this15 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee13() {
          var _t8, _s5, _t9, _t10;
          return _regeneratorRuntime2().wrap(function _callee13$(_context13) {
            while (1) switch (_context13.prev = _context13.next) {
              case 0:
                _context13.prev = 0;
                _t8 = _this15.getUTF8ByteLength(_this15.cardData.name);
                if (!(_t8 > 32)) {
                  _context13.next = 4;
                  break;
                }
                throw new Error("\u5361\u7247\u540D\u79F0\u8FC7\u957F\uFF0CUTF-8\u7F16\u7801\u540E\u8D85\u8FC732\u5B57\u8282 (".concat(_t8, "\u5B57\u8282)"));
              case 4:
                console.log("[SlotEdit] 准备激活卡槽:", _this15.slotId, "类型:", _typeof2(_this15.slotId));
                _context13.next = 7;
                return _this15.$store.dispatch("slots/setActiveSlot", _this15.slotId);
              case 7:
                _s5 = _this15.availableTypes[_this15.selectedTypeIndex];
                _context13.next = 10;
                return e.bluetoothService.setSlotType(_this15.slotId, _s5.value);
              case 10:
                _context13.next = 12;
                return e.bluetoothService.enableSlot(_this15.slotId, _this15.frequency, !0);
              case 12:
                _context13.next = 14;
                return e.bluetoothService.setSlotDataDefault(_this15.slotId, _s5.value);
              case 14:
                _context13.t0 = _this15.cardData.data && _this15.cardData.data.length > 0;
                if (!_context13.t0) {
                  _context13.next = 20;
                  break;
                }
                console.log("[SlotEdit] 开始写入卡片数据块...");
                _context13.next = 19;
                return _this15.writeActualCardData(_s5);
              case 19:
                console.log("[SlotEdit] 卡片数据块写入完成");
              case 20:
                if (!_this15.isHFCard) {
                  _context13.next = 26;
                  break;
                }
                _t9 = {
                  uid: _this15.cardData.uid.replace(/\s/g, ""),
                  sak: parseInt(_this15.cardData.sak.replace(/\s/g, ""), 16),
                  atqa: _this15.cardData.atqa.replace(/\s/g, ""),
                  ats: _this15.cardData.ats.replace(/\s/g, "")
                };
                console.log("[SlotEdit] 🔧 设置防冲突数据 (最后步骤，确保不被覆盖):", _t9);
                _context13.next = 25;
                return e.bluetoothService.setMf1AntiCollision(_this15.slotId, _t9);
              case 25:
                console.log("[SlotEdit] ✅ 防冲突数据设置完成");
              case 26:
                if (!(_s5.value === a.TagType.EM410X)) {
                  _context13.next = 30;
                  break;
                }
                _t10 = _this15.cardData.uid.replace(/\s/g, "");
                _context13.next = 30;
                return e.bluetoothService.setEM410XEmulatorID(_this15.slotId, _t10);
              case 30:
                _context13.next = 32;
                return _this15.$store.dispatch("slots/setSlotTagName", {
                  slotId: _this15.slotId,
                  frequency: _this15.frequency,
                  name: _this15.cardData.name
                });
              case 32:
                _context13.next = 34;
                return e.bluetoothService.saveSlotData();
              case 34:
                _context13.next = 36;
                return _this15.updateLocalSlotData(_s5);
              case 36:
                console.log("[SlotEdit] 卡片数据已保存到设备");
                _context13.next = 42;
                break;
              case 39:
                _context13.prev = 39;
                _context13.t1 = _context13["catch"](0);
                throw console.error("[SlotEdit] 保存卡片数据失败:", _context13.t1), _context13.t1;
              case 42:
              case "end":
                return _context13.stop();
            }
          }, _callee13, null, [[0, 39]]);
        }))();
      },
      writeActualCardData: function writeActualCardData(t) {
        var _this16 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee14() {
          return _regeneratorRuntime2().wrap(function _callee14$(_context14) {
            while (1) switch (_context14.prev = _context14.next) {
              case 0:
                _context14.prev = 0;
                console.log("[SlotEdit] \u5F00\u59CB\u5199\u5165\u5B9E\u9645\u5361\u7247\u6570\u636E\uFF0C\u6570\u636E\u5757\u6570\u91CF: ".concat(_this16.cardData.data.length));
                if (!_this16.isMifareClassic) {
                  _context14.next = 7;
                  break;
                }
                _context14.next = 5;
                return _this16.writeMifareClassicData();
              case 5:
                _context14.next = 13;
                break;
              case 7:
                if (!(_this16.isNTAG || _this16.isMifareUltralight)) {
                  _context14.next = 12;
                  break;
                }
                _context14.next = 10;
                return _this16.writeUltralightData();
              case 10:
                _context14.next = 13;
                break;
              case 12:
                console.log("[SlotEdit] \u5361\u7247\u7C7B\u578B ".concat(t.name, " \u4E0D\u652F\u6301\u6570\u636E\u5199\u5165"));
              case 13:
                _context14.next = 18;
                break;
              case 15:
                _context14.prev = 15;
                _context14.t0 = _context14["catch"](0);
                throw console.error("[SlotEdit] 写入实际卡片数据失败:", _context14.t0), _context14.t0;
              case 18:
              case "end":
                return _context14.stop();
            }
          }, _callee14, null, [[0, 15]]);
        }))();
      },
      writeMifareClassicData: function writeMifareClassicData() {
        var _this17 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee15() {
          var _t11, _a7, _s6, _i2, _a8, _e3, r;
          return _regeneratorRuntime2().wrap(function _callee15$(_context15) {
            while (1) switch (_context15.prev = _context15.next) {
              case 0:
                _context15.prev = 0;
                _t11 = _this17.cardData.data;
                _a7 = [], _s6 = 0;
                _i2 = 0;
              case 4:
                if (!(_i2 < _t11.length)) {
                  _context15.next = 20;
                  break;
                }
                _context15.t0 = (_t11[_i2] && 0 === _t11[_i2].length || _a7.length >= 128) && _a7.length > 0;
                if (!_context15.t0) {
                  _context15.next = 12;
                  break;
                }
                _context15.next = 9;
                return e.bluetoothService.setMf1BlockData(_s6, new Uint8Array(_a7));
              case 9:
                console.log("[SlotEdit] \u5DF2\u5199\u5165\u5757 ".concat(_s6, " \u5230 ").concat(_s6 + Math.floor(_a7.length / 16) - 1));
                _a7 = [];
                _s6 = _i2;
              case 12:
                if (!(_t11[_i2] && _t11[_i2].length > 0)) {
                  _context15.next = 15;
                  break;
                }
                _e3 = Array.isArray(_t11[_i2]) ? _t11[_i2] : Array.from(_t11[_i2]);
                (_a8 = _a7).push.apply(_a8, _toConsumableArray2(_e3));
              case 15:
                r = Math.round(_i2 / _t11.length * 100);
                r % 10 == 0 && console.log("[SlotEdit] \u5199\u5165\u8FDB\u5EA6: ".concat(r, "%"));
              case 17:
                _i2++;
                _context15.next = 4;
                break;
              case 20:
                _context15.t1 = _a7.length > 0;
                if (!_context15.t1) {
                  _context15.next = 25;
                  break;
                }
                _context15.next = 24;
                return e.bluetoothService.setMf1BlockData(_s6, new Uint8Array(_a7));
              case 24:
                console.log("[SlotEdit] \u5DF2\u5199\u5165\u6700\u540E\u6279\u6B21\u5757\u6570\u636E\uFF0C\u8D77\u59CB\u5757: ".concat(_s6));
              case 25:
                console.log("[SlotEdit] Mifare Classic数据写入完成");
                _context15.next = 31;
                break;
              case 28:
                _context15.prev = 28;
                _context15.t2 = _context15["catch"](0);
                throw console.error("[SlotEdit] 写入Mifare Classic数据失败:", _context15.t2), _context15.t2;
              case 31:
              case "end":
                return _context15.stop();
            }
          }, _callee15, null, [[0, 28]]);
        }))();
      },
      writeUltralightData: function writeUltralightData() {
        var _this18 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee16() {
          var _t12;
          return _regeneratorRuntime2().wrap(function _callee16$(_context16) {
            while (1) switch (_context16.prev = _context16.next) {
              case 0:
                _context16.prev = 0;
                console.log("[SlotEdit] Ultralight/NTAG数据写入暂未完全实现");
                _t12 = _this18.cardData.data;
                console.log("[SlotEdit] Ultralight/NTAG\u9875\u9762\u6570\u91CF: ".concat(_t12.length));
                _context16.next = 9;
                break;
              case 6:
                _context16.prev = 6;
                _context16.t0 = _context16["catch"](0);
                throw console.error("[SlotEdit] 写入Ultralight数据失败:", _context16.t0), _context16.t0;
              case 9:
              case "end":
                return _context16.stop();
            }
          }, _callee16, null, [[0, 6]]);
        }))();
      },
      updateLocalSlotData: function updateLocalSlotData(t) {
        var _this19 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee17() {
          var _t13, _a9;
          return _regeneratorRuntime2().wrap(function _callee17$(_context17) {
            while (1) switch (_context17.prev = _context17.next) {
              case 0:
                _context17.prev = 0;
                console.log("[SlotEdit] 开始更新本地卡槽数据...");
                console.log("[SlotEdit] 等待设备数据同步...");
                _context17.next = 5;
                return new Promise(function (t) {
                  return setTimeout(t, 1e3);
                });
              case 5:
                console.log("[SlotEdit] 重新激活卡槽...");
                _context17.next = 8;
                return e.bluetoothService.setActiveSlot(_this19.slotId);
              case 8:
                if (!_this19.isHFCard) {
                  _context17.next = 20;
                  break;
                }
                _context17.prev = 9;
                console.log("[SlotEdit] 开始强制刷新HF卡片数据...");
                _context17.next = 13;
                return e.bluetoothService.getMf1AntiCollData(_this19.slotId);
              case 13:
                _t13 = _context17.sent;
                if (console.log("[SlotEdit] 从设备读取到的HF数据:", _t13), _t13) {
                  _a9 = {
                    uid: _this19.cardData.uid,
                    sak: _this19.cardData.sak,
                    atqa: _this19.cardData.atqa,
                    ats: _this19.cardData.ats
                  };
                  _this19.cardData.uid = _this19.formatHexData(_t13.uid), _this19.cardData.sak = _t13.sak.toString(16).padStart(2, "0").toUpperCase(), _this19.cardData.atqa = _this19.formatHexData(_t13.atqa), _this19.cardData.ats = _this19.formatHexData(_t13.ats), console.log("[SlotEdit] 数据对比:"), console.log("  旧数据:", _a9), console.log("  新数据:", {
                    uid: _this19.cardData.uid,
                    sak: _this19.cardData.sak,
                    atqa: _this19.cardData.atqa,
                    ats: _this19.cardData.ats
                  });
                  _a9.uid !== _this19.cardData.uid || _a9.sak !== _this19.cardData.sak || _a9.atqa !== _this19.cardData.atqa || _a9.ats !== _this19.cardData.ats ? console.log("[SlotEdit] ✅ 数据已成功更新") : console.warn("[SlotEdit] ⚠️ 数据没有变化，可能存在问题");
                } else console.warn("[SlotEdit] ⚠️ 从设备读取到空的HF数据");
                _context17.next = 20;
                break;
              case 17:
                _context17.prev = 17;
                _context17.t0 = _context17["catch"](9);
                console.error("[SlotEdit] ❌ 强制刷新HF卡片数据失败:", _context17.t0);
              case 20:
                console.log("[SlotEdit] 刷新所有卡槽数据...");
                _context17.next = 23;
                return _this19.$store.dispatch("slots/loadAllSlots");
              case 23:
                console.log("[SlotEdit] ✅ 本地卡槽数据更新完成");
                _context17.next = 29;
                break;
              case 26:
                _context17.prev = 26;
                _context17.t1 = _context17["catch"](0);
                console.error("[SlotEdit] ❌ 更新本地卡槽数据失败:", _context17.t1);
              case 29:
              case "end":
                return _context17.stop();
            }
          }, _callee17, null, [[0, 26], [9, 17]]);
        }))();
      },
      clearSlotData: function clearSlotData() {
        var _this20 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee19() {
          return _regeneratorRuntime2().wrap(function _callee19$(_context19) {
            while (1) switch (_context19.prev = _context19.next) {
              case 0:
                _this20.isConnected ? t.index.showModal({
                  title: "确认清空",
                  content: "\u786E\u5B9A\u8981\u6E05\u7A7A\u5361\u69FD ".concat(_this20.slotId + 1, " \u7684\u6570\u636E\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u6062\u590D\u3002"),
                  confirmText: "清空",
                  confirmColor: "#ff4444",
                  success: function () {
                    var _success = _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee18(a) {
                      return _regeneratorRuntime2().wrap(function _callee18$(_context18) {
                        while (1) switch (_context18.prev = _context18.next) {
                          case 0:
                            if (!a.confirm) {
                              _context18.next = 15;
                              break;
                            }
                            _context18.prev = 1;
                            _this20.isLoading = !0;
                            _context18.next = 5;
                            return _this20.$store.dispatch("slots/clearSlot", _this20.slotId);
                          case 5:
                            t.index.showToast({
                              title: "卡槽已清空",
                              icon: "success"
                            });
                            setTimeout(function () {
                              _this20.goBack();
                            }, 1e3);
                            _context18.next = 12;
                            break;
                          case 9:
                            _context18.prev = 9;
                            _context18.t0 = _context18["catch"](1);
                            console.error("[SlotEdit] 清空卡槽失败:", _context18.t0), _this20.showError("清空失败: " + _context18.t0.message);
                          case 12:
                            _context18.prev = 12;
                            _this20.isLoading = !1;
                            return _context18.finish(12);
                          case 15:
                          case "end":
                            return _context18.stop();
                        }
                      }, _callee18, null, [[1, 9, 12, 15]]);
                    }));
                    function success(_x) {
                      return _success.apply(this, arguments);
                    }
                    return success;
                  }()
                }) : _this20.showConnectionRequired();
              case 1:
              case "end":
                return _context19.stop();
            }
          }, _callee19);
        }))();
      },
      goBack: function goBack() {
        t.index.navigateBack();
      },
      hexStringToBytes: function hexStringToBytes(t) {
        if (!t) return [];
        var a = t.replace(/\s/g, ""),
          e = [];
        for (var _s7 = 0; _s7 < a.length; _s7 += 2) e.push(parseInt(a.substr(_s7, 2), 16));
        return e;
      },
      showConnectionRequired: function showConnectionRequired() {
        t.index.showModal({
          title: "需要连接设备",
          content: "此功能需要先连接 Chameleon 设备，是否立即连接？",
          confirmText: "去连接",
          success: function success(a) {
            a.confirm && t.index.navigateTo({
              url: "/pages/connect/connect"
            });
          }
        });
      },
      showError: function showError(a) {
        t.index.showModal({
          title: "错误",
          content: a,
          showCancel: !1
        });
      },
      showSuccessMessage: function showSuccessMessage(t) {
        var _this21 = this;
        this.successMessage = t, this.showSuccessToast = !0, setTimeout(function () {
          _this21.showSuccessToast = !1;
        }, 2e3);
      },
      showCardPackagePop: function showCardPackagePop() {
        var _this22 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee20() {
          var a;
          return _regeneratorRuntime2().wrap(function _callee20$(_context20) {
            while (1) switch (_context20.prev = _context20.next) {
              case 0:
                _context20.prev = 0;
                console.log("[SlotEdit] 显示卡包选择弹窗");
                t.index.showToast({
                  title: "正在加载卡包...",
                  icon: "loading",
                  duration: 1e3
                });
                _context20.next = 5;
                return _this22.loadCardsFromStorage();
              case 5:
                console.log("[SlotEdit] 卡包数据加载完成，卡片数量:", (null == (a = _this22.cards) ? void 0 : a.length) || 0);
                _this22.updateFilterCounts();
                _this22.currentCardFilter = "all";
                _this22.$refs.cardPackagePopup ? (_this22.$refs.cardPackagePopup.open(), console.log("[SlotEdit] 卡包弹窗已打开")) : (console.error("[SlotEdit] 找不到卡包弹窗引用"), t.index.showToast({
                  title: "弹窗组件未找到",
                  icon: "error"
                }));
                _context20.next = 14;
                break;
              case 11:
                _context20.prev = 11;
                _context20.t0 = _context20["catch"](0);
                console.error("[SlotEdit] 加载卡包失败:", _context20.t0), t.index.showToast({
                  title: "加载卡包失败: " + _context20.t0.message,
                  icon: "error"
                });
              case 14:
              case "end":
                return _context20.stop();
            }
          }, _callee20, null, [[0, 11]]);
        }))();
      },
      closeCardPackage: function closeCardPackage() {
        this.$refs.cardPackagePopup.close(), this.cardSearchQuery = "";
      },
      handleCardSearch: function handleCardSearch() {},
      selectCardFromPackage: function selectCardFromPackage(a) {
        try {
          this.processCardSelection(a);
        } catch (e) {
          console.error("[SlotEdit] 选择卡片失败:", e), t.index.showToast({
            title: "导入卡片失败",
            icon: "error"
          });
        }
      },
      processCardSelection: function processCardSelection(a) {
        try {
          this.cardData.name = a.name, a.uid ? this.cardData.uid = this.formatHexData(a.uid.replace(/\s/g, "")) : this.cardData.uid = "";
          var _e4 = this.availableTypes.findIndex(function (t) {
            return t.value === a.tag;
          });
          if (-1 !== _e4 && (this.selectedTypeIndex = _e4, this.onTypeChange({
            detail: {
              value: _e4
            }
          })), 2 === a.getFrequency()) {
            var _t14 = this.cardData.uid ? this.cardData.uid.replace(/\s/g, "").length / 2 : 4;
            void 0 !== a.sak && null !== a.sak ? this.cardData.sak = "number" == typeof a.sak ? a.sak.toString(16).padStart(2, "0").toUpperCase() : a.sak.toString() : this.cardData.sak = this.getDefaultSAK(a.tag, _t14), a.atqa && a.atqa.length > 0 ? this.cardData.atqa = Array.from(a.atqa).map(function (t) {
              return t.toString(16).padStart(2, "0");
            }).join(" ").toUpperCase() : this.cardData.atqa = this.getDefaultATQA(a.tag, _t14), a.ats && a.ats.length > 0 ? this.cardData.ats = Array.from(a.ats).map(function (t) {
              return t.toString(16).padStart(2, "0");
            }).join(" ").toUpperCase() : this.cardData.ats = "";
          }
          a.data && a.data.length > 0 && (this.cardData.data = a.data.map(function (t) {
            return Array.from(t);
          })), this.closeCardPackage(), this.validateForm(), t.index.showToast({
            title: "卡片数据已导入",
            icon: "success"
          }), console.log("[SlotEdit] 从卡包选择卡片:", a.name);
        } catch (e) {
          console.error("[SlotEdit] 处理卡片选择失败:", e), t.index.showToast({
            title: "导入卡片失败",
            icon: "error"
          });
        }
      },
      goToCards: function goToCards() {
        this.closeCardPackage(), t.index.navigateTo({
          url: "/pages/cards/cards"
        });
      },
      selectCardFilter: function selectCardFilter(t) {
        this.currentCardFilter = t;
      },
      updateFilterCounts: function updateFilterCounts() {
        var t = this.cards || [];
        this.cardFilters.forEach(function (e) {
          switch (e.id) {
            case "all":
              e.count = t.length;
              break;
            case "hf":
              e.count = t.filter(function (t) {
                return 2 === t.getFrequency();
              }).length;
              break;
            case "lf":
              e.count = t.filter(function (t) {
                return 1 === t.getFrequency();
              }).length;
              break;
            case "mifare":
              e.count = t.filter(function (t) {
                return t.isMifareClassic() || t.isMifareUltralight();
              }).length;
              break;
            case "em410x":
              e.count = t.filter(function (t) {
                return t.tag === a.TagType.EM410X;
              }).length;
          }
        });
      },
      showCardDetails: function showCardDetails(t) {
        this.selectedCardDetail = t, this.$refs.cardDetailPopup.open();
      },
      closeCardDetails: function closeCardDetails() {
        this.selectedCardDetail = null, this.$refs.cardDetailPopup.close();
      },
      selectDetailCard: function selectDetailCard() {
        this.selectedCardDetail && (this.selectCardFromPackage(this.selectedCardDetail), this.closeCardDetails());
      },
      formatUID: function formatUID(t) {
        return t ? t.replace(/(.{2})/g, "$1 ").trim().toUpperCase() : "";
      },
      formatHex: function formatHex(t) {
        return "number" == typeof t ? "0x" + t.toString(16).padStart(2, "0").toUpperCase() : t;
      },
      formatHexArray: function formatHexArray(t) {
        return t && 0 !== t.length ? Array.from(t).map(function (t) {
          return t.toString(16).padStart(2, "0");
        }).join(" ").toUpperCase() : "";
      },
      getCardDataSize: function getCardDataSize(t) {
        return t.data && 0 !== t.data.length ? t.isMifareClassic() ? "".concat(t.data.length, " \u5757") : t.isMifareUltralight() ? "".concat(t.data.length, " \u9875") : "".concat(t.data.length, " \u5B57\u8282") : "无数据";
      },
      formatTime: function formatTime(t) {
        if (!t) return "";
        return new Date(t).toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        });
      },
      getCardIcon: function getCardIcon(t) {
        return 1 === t.getFrequency() ? "wifi" : "creditcard";
      },
      getCardTypeName: function getCardTypeName(t) {
        var a = this.availableTypes.find(function (a) {
          return a.value === t.tag;
        });
        return a ? a.name : "未知类型";
      }
    })
  };if (!Array) {
  (t.resolveComponent("uni-icons") + t.resolveComponent("uni-load-more") + t.resolveComponent("uni-search-bar") + t.resolveComponent("uni-popup"))();
}Math || (function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
} + function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.js";
} + function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-search-bar/uni-search-bar.js";
} + function () {
  return "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
})();var i = t._export_sfc(s, [["render", function (a, e, s, i, r, o) {
  return t.e({
    a: t.p({
      type: "folder-add",
      size: "16",
      color: "#007AFF"
    }),
    b: t.o(function () {
      return o.showCardPackagePop && o.showCardPackagePop.apply(o, arguments);
    }),
    c: t.t(r.slotId + 1),
    d: r.formErrors.name ? 1 : "",
    e: t.o([function (t) {
      return r.cardData.name = t.detail.value;
    }, function () {
      return o.validateForm && o.validateForm.apply(o, arguments);
    }]),
    f: r.cardData.name,
    g: t.t(o.getUTF8ByteLength(r.cardData.name)),
    h: o.getUTF8ByteLength(r.cardData.name) > 25 ? 1 : "",
    i: o.getUTF8ByteLength(r.cardData.name) > 32 ? 1 : "",
    j: r.formErrors.name
  }, r.formErrors.name ? {
    k: t.t(r.formErrors.name)
  } : {}, {
    l: t.t(o.selectedTypeName),
    m: t.p({
      type: "down",
      size: "16",
      color: "#999"
    }),
    n: r.selectedTypeIndex,
    o: r.availableTypes,
    p: t.o(function () {
      return o.onTypeChange && o.onTypeChange.apply(o, arguments);
    }),
    q: o.isHFCard
  }, o.isHFCard ? t.e({
    r: r.formErrors.uid ? 1 : "",
    s: t.o([function (t) {
      return r.cardData.uid = t.detail.value;
    }, function (t) {
      return o.formatHexInput("uid", t);
    }]),
    t: t.o(function () {
      return o.validateUID && o.validateUID.apply(o, arguments);
    }),
    v: r.cardData.uid,
    w: r.cardData.uid
  }, r.cardData.uid ? {
    x: t.p({
      type: "copy",
      size: "16",
      color: "#666"
    }),
    y: t.o(function (t) {
      return o.copyHexData("uid");
    })
  } : {}, {
    z: r.formErrors.uid
  }, r.formErrors.uid ? {
    A: t.t(r.formErrors.uid)
  } : {}, {
    B: r.formErrors.sak ? 1 : "",
    C: t.o([function (t) {
      return r.cardData.sak = t.detail.value;
    }, function (t) {
      return o.formatHexInput("sak", t);
    }]),
    D: t.o(function () {
      return o.validateSAK && o.validateSAK.apply(o, arguments);
    }),
    E: r.cardData.sak,
    F: r.cardData.sak
  }, r.cardData.sak ? {
    G: t.p({
      type: "copy",
      size: "16",
      color: "#666"
    }),
    H: t.o(function (t) {
      return o.copyHexData("sak");
    })
  } : {}, {
    I: r.formErrors.sak
  }, r.formErrors.sak ? {
    J: t.t(r.formErrors.sak)
  } : {}, {
    K: r.formErrors.atqa ? 1 : "",
    L: t.o([function (t) {
      return r.cardData.atqa = t.detail.value;
    }, function (t) {
      return o.formatHexInput("atqa", t);
    }]),
    M: t.o(function () {
      return o.validateATQA && o.validateATQA.apply(o, arguments);
    }),
    N: r.cardData.atqa,
    O: r.cardData.atqa
  }, r.cardData.atqa ? {
    P: t.p({
      type: "copy",
      size: "16",
      color: "#666"
    }),
    Q: t.o(function (t) {
      return o.copyHexData("atqa");
    })
  } : {}, {
    R: r.formErrors.atqa
  }, r.formErrors.atqa ? {
    S: t.t(r.formErrors.atqa)
  } : {}, {
    T: r.formErrors.ats ? 1 : "",
    U: t.o([function (t) {
      return r.cardData.ats = t.detail.value;
    }, function (t) {
      return o.formatHexInput("ats", t);
    }]),
    V: t.o(function () {
      return o.validateATS && o.validateATS.apply(o, arguments);
    }),
    W: r.cardData.ats,
    X: r.cardData.ats
  }, r.cardData.ats ? {
    Y: t.p({
      type: "copy",
      size: "16",
      color: "#666"
    }),
    Z: t.o(function (t) {
      return o.copyHexData("ats");
    })
  } : {}, {
    aa: r.formErrors.ats
  }, r.formErrors.ats ? {
    ab: t.t(r.formErrors.ats)
  } : {}) : {}, {
    ac: o.isMifareClassic
  }, o.isMifareClassic ? {
    ad: r.emulatorSettings.gen1aEnabled,
    ae: t.o(function () {
      return o.onGen1AChange && o.onGen1AChange.apply(o, arguments);
    }),
    af: r.isLoading,
    ag: r.emulatorSettings.gen2Enabled,
    ah: t.o(function () {
      return o.onGen2Change && o.onGen2Change.apply(o, arguments);
    }),
    ai: r.isLoading,
    aj: r.emulatorSettings.antiCollEnabled,
    ak: t.o(function () {
      return o.onAntiCollChange && o.onAntiCollChange.apply(o, arguments);
    }),
    al: r.isLoading,
    am: r.emulatorSettings.detectionEnabled,
    an: t.o(function () {
      return o.onDetectionChange && o.onDetectionChange.apply(o, arguments);
    }),
    ao: r.isLoading,
    ap: t.t(o.selectedWriteMode.name),
    aq: t.p({
      type: "down",
      size: "16",
      color: "#999"
    }),
    ar: r.writeModeIndex,
    as: r.writeModes,
    at: t.o(function () {
      return o.onWriteModeChange && o.onWriteModeChange.apply(o, arguments);
    })
  } : {}, {
    av: !r.isNew
  }, r.isNew ? {} : {
    aw: t.p({
      type: "trash",
      size: "18",
      color: "#ff4444"
    }),
    ax: t.o(function () {
      return o.clearSlotData && o.clearSlotData.apply(o, arguments);
    }),
    ay: r.isLoading
  }, {
    az: t.t(r.isLoading ? "保存中..." : "保存"),
    aA: o.canSave ? "" : 1,
    aB: t.o(function () {
      return o.saveSlot && o.saveSlot.apply(o, arguments);
    }),
    aC: !o.canSave || r.isLoading,
    aD: r.isLoading
  }, r.isLoading ? {
    aE: t.p({
      status: "loading",
      "content-text": r.loadingText
    })
  } : {}, {
    aF: r.showSuccessToast
  }, r.showSuccessToast ? {
    aG: t.p({
      type: "checkmarkempty",
      size: "24",
      color: "#4CAF50"
    }),
    aH: t.t(r.successMessage)
  } : {}, {
    aI: t.p({
      type: "close",
      size: "20",
      color: "#666"
    }),
    aJ: t.o(function () {
      return o.closeCardPackage && o.closeCardPackage.apply(o, arguments);
    }),
    aK: t.o(o.handleCardSearch),
    aL: t.o(o.handleCardSearch),
    aM: t.o(function (t) {
      return r.cardSearchQuery = t;
    }),
    aN: t.p({
      placeholder: "搜索卡片名称、UID或类型",
      focus: !1,
      "bg-color": "#f8f8f8",
      modelValue: r.cardSearchQuery
    }),
    aO: t.f(r.cardFilters, function (a, e, s) {
      return t.e({
        a: "7f581d10-13-" + s + ",7f581d10-10",
        b: t.p({
          type: a.icon,
          size: "14",
          color: r.currentCardFilter === a.id ? "#007AFF" : "#666"
        }),
        c: t.t(a.name),
        d: a.count > 0
      }, a.count > 0 ? {
        e: t.t(a.count)
      } : {}, {
        f: a.id,
        g: t.n({
          active: r.currentCardFilter === a.id
        }),
        h: t.o(function (t) {
          return o.selectCardFilter(a.id);
        }, a.id)
      });
    }),
    aP: 0 === o.filteredPackageCards.length
  }, 0 === o.filteredPackageCards.length ? {
    aQ: t.p({
      type: "folder",
      size: "60",
      color: "#ccc"
    }),
    aR: t.p({
      type: "plus",
      size: "16",
      color: "#007AFF"
    }),
    aS: t.o(function () {
      return o.goToCards && o.goToCards.apply(o, arguments);
    })
  } : {
    aT: t.f(o.filteredPackageCards, function (a, e, s) {
      return t.e({
        a: "7f581d10-16-" + s + ",7f581d10-10",
        b: t.p({
          type: o.getCardIcon(a),
          size: "20",
          color: "#fff"
        }),
        c: a.color,
        d: t.t(a.name),
        e: t.t(o.getCardTypeName(a)),
        f: a.uid
      }, a.uid ? {
        g: t.t(o.formatUID(a.uid))
      } : {}, {
        h: t.t(2 === a.getFrequency() ? "HF" : "LF"),
        i: t.n(2 === a.getFrequency() ? "hf" : "lf"),
        j: "7f581d10-17-" + s + ",7f581d10-10",
        k: t.o(function (t) {
          return o.showCardDetails(a);
        }, a.id),
        l: a.id,
        m: t.o(function (t) {
          return o.selectCardFromPackage(a);
        }, a.id),
        n: t.o(function (t) {
          return o.showCardDetails(a);
        }, a.id)
      });
    }),
    aU: t.p({
      type: "eye",
      size: "16",
      color: "#666"
    })
  }, {
    aV: t.sr("cardPackagePopup", "7f581d10-10"),
    aW: t.p({
      type: "bottom",
      "safe-area": !1
    }),
    aX: r.selectedCardDetail
  }, r.selectedCardDetail ? t.e({
    aY: t.t(r.selectedCardDetail.name),
    aZ: t.p({
      type: "close",
      size: "20",
      color: "#666"
    }),
    ba: t.o(function () {
      return o.closeCardDetails && o.closeCardDetails.apply(o, arguments);
    }),
    bb: t.t(o.getCardTypeName(r.selectedCardDetail)),
    bc: r.selectedCardDetail.uid
  }, r.selectedCardDetail.uid ? {
    bd: t.t(r.selectedCardDetail.uid)
  } : {}, {
    be: t.t(2 === r.selectedCardDetail.getFrequency() ? "HF (13.56MHz)" : "LF (125kHz)"),
    bf: r.selectedCardDetail.sak
  }, r.selectedCardDetail.sak ? {
    bg: t.t(o.formatHex(r.selectedCardDetail.sak))
  } : {}, {
    bh: r.selectedCardDetail.atqa && r.selectedCardDetail.atqa.length > 0
  }, r.selectedCardDetail.atqa && r.selectedCardDetail.atqa.length > 0 ? {
    bi: t.t(o.formatHexArray(r.selectedCardDetail.atqa))
  } : {}, {
    bj: r.selectedCardDetail.ats && r.selectedCardDetail.ats.length > 0
  }, r.selectedCardDetail.ats && r.selectedCardDetail.ats.length > 0 ? {
    bk: t.t(o.formatHexArray(r.selectedCardDetail.ats))
  } : {}, {
    bl: t.t(o.getCardDataSize(r.selectedCardDetail)),
    bm: t.t(o.formatTime(r.selectedCardDetail.createdAt)),
    bn: t.t(o.formatTime(r.selectedCardDetail.modifiedAt)),
    bo: t.o(function () {
      return o.closeCardDetails && o.closeCardDetails.apply(o, arguments);
    }),
    bp: t.o(function () {
      return o.selectDetailCard && o.selectDetailCard.apply(o, arguments);
    })
  }) : {}, {
    bq: t.sr("cardDetailPopup", "7f581d10-18"),
    br: t.p({
      type: "center"
    })
  });
}], ["__scopeId", "data-v-7f581d10"]]);wx.createPage(i);