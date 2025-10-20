require("../../@babel/runtime/helpers/Arrayincludes");var _objectDestructuringEmpty2 = require("../../@babel/runtime/helpers/objectDestructuringEmpty");var _toConsumableArray2 = require("../../@babel/runtime/helpers/toConsumableArray");var _regeneratorRuntime2 = require("../../@babel/runtime/helpers/regeneratorRuntime");var _asyncToGenerator2 = require("../../@babel/runtime/helpers/asyncToGenerator");var _objectSpread2 = require("../../@babel/runtime/helpers/objectSpread2");var e = require("../../utils/chameleon-protocol.js"),
  s = require("../../utils/card-data.js"),
  r = require("../../services/bluetooth.js"),
  a = "hf",
  t = "idle",
  o = "scanning",
  c = "detected",
  i = "reading",
  n = "completed",
  l = "error",
  d = {
    namespaced: !0,
    state: {
      currentMode: a,
      readingState: t,
      isReaderMode: !1,
      scanSettings: {
        autoDetect: !0,
        readData: !0,
        usePassword: !1,
        password: "",
        maxRetries: 3,
        timeout: 5e3,
        useCustomKey: !1,
        customKey: "FFFFFF"
      },
      currentCard: {
        uid: "",
        type: "",
        protocol: "",
        size: 0,
        sak: "",
        atqa: "",
        ats: "",
        version: "",
        signature: "",
        sectors: [],
        pages: [],
        rawData: null,
        readTime: null,
        isComplete: !1,
        hasErrors: !1,
        errorMessage: "",
        keys: {
          keyA: [],
          keyB: []
        },
        accessBits: [],
        isEncrypted: !1
      },
      progress: {
        current: 0,
        total: 0,
        percentage: 0,
        message: "",
        eta: null,
        startTime: null,
        details: []
      },
      readHistory: [],
      supportedTypes: {
        hf: ["mifare_classic", "mifare_ultralight", "ntag", "iso14443a", "iso14443b", "iso15693"],
        lf: ["em410x", "t55xx", "hitag", "prox"]
      },
      lastError: null,
      statistics: {
        totalReads: 0,
        successfulReads: 0,
        failedReads: 0,
        hfReads: 0,
        lfReads: 0
      }
    },
    mutations: {
      SET_READER_MODE: function SET_READER_MODE(e, s) {
        e.currentMode = s;
      },
      SET_READING_STATE: function SET_READING_STATE(e, s) {
        e.readingState = s;
      },
      SET_IS_READER_MODE: function SET_IS_READER_MODE(e, s) {
        e.isReaderMode = s;
      },
      UPDATE_SCAN_SETTINGS: function UPDATE_SCAN_SETTINGS(e, s) {
        e.scanSettings = _objectSpread2(_objectSpread2({}, e.scanSettings), s);
      },
      SET_CURRENT_CARD: function SET_CURRENT_CARD(e, s) {
        e.currentCard = _objectSpread2({
          uid: "",
          type: "",
          protocol: "",
          size: 0,
          sak: "",
          atqa: "",
          ats: "",
          version: "",
          signature: "",
          sectors: [],
          pages: [],
          rawData: null,
          readTime: null,
          isComplete: !1,
          hasErrors: !1,
          errorMessage: "",
          keys: {
            keyA: [],
            keyB: []
          },
          accessBits: [],
          isEncrypted: !1
        }, s);
      },
      CLEAR_CURRENT_CARD: function CLEAR_CURRENT_CARD(e) {
        e.currentCard = {
          uid: "",
          type: "",
          protocol: "",
          size: 0,
          sak: "",
          atqa: "",
          ats: "",
          version: "",
          signature: "",
          sectors: [],
          pages: [],
          rawData: null,
          readTime: null,
          isComplete: !1,
          hasErrors: !1,
          errorMessage: "",
          keys: {
            keyA: [],
            keyB: []
          },
          accessBits: [],
          isEncrypted: !1
        };
      },
      UPDATE_PROGRESS: function UPDATE_PROGRESS(e, s) {
        if (e.progress = _objectSpread2(_objectSpread2({}, e.progress), s), e.progress.current && e.progress.total ? e.progress.percentage = Math.round(e.progress.current / e.progress.total * 100) : void 0 !== s.percentage && (e.progress.percentage = s.percentage), e.progress.current && e.progress.total && e.progress.startTime) {
          var _s = Date.now() - e.progress.startTime,
            _r = e.progress.current / _s,
            _a = e.progress.total - e.progress.current,
            _t = _a > 0 ? Math.round(_a / _r / 1e3) : 0;
          e.progress.eta = _t > 0 ? "".concat(_t, "\u79D2") : null;
        }
      },
      ADD_PROGRESS_DETAIL: function ADD_PROGRESS_DETAIL(e, s) {
        e.progress.details || (e.progress.details = []), e.progress.details.push(_objectSpread2(_objectSpread2({}, s), {}, {
          timestamp: Date.now()
        })), e.progress.details.length > 20 && (e.progress.details = e.progress.details.slice(-20));
      },
      RESET_PROGRESS: function RESET_PROGRESS(e) {
        e.progress = {
          current: 0,
          total: 0,
          percentage: 0,
          message: "",
          eta: null,
          startTime: Date.now(),
          details: []
        };
      },
      ADD_TO_HISTORY: function ADD_TO_HISTORY(e, s) {
        var r = _objectSpread2(_objectSpread2({}, s), {}, {
          id: Date.now().toString(),
          timestamp: new Date().toISOString()
        });
        e.readHistory.unshift(r), e.readHistory.length > 50 && (e.readHistory = e.readHistory.slice(0, 50));
      },
      CLEAR_HISTORY: function CLEAR_HISTORY(e) {
        e.readHistory = [];
      },
      REMOVE_FROM_HISTORY: function REMOVE_FROM_HISTORY(e, s) {
        var r = e.readHistory.findIndex(function (e) {
          return e.id === s;
        });
        -1 !== r && e.readHistory.splice(r, 1);
      },
      SET_ERROR: function SET_ERROR(e, s) {
        var r = {};
        r = "string" == typeof s ? {
          message: s,
          timestamp: Date.now()
        } : {
          title: s.title || "操作失败",
          message: s.message || "未知错误",
          details: s.details || null,
          suggestions: s.suggestions || [],
          code: s.code || "UNKNOWN_ERROR",
          timestamp: s.timestamp || Date.now()
        }, r.message.includes("设备未连接") ? r.suggestions = ["检查设备是否已开机", "确认蓝牙连接是否正常", "尝试重新连接设备"] : r.message.includes("Mifare Classic") ? r.suggestions = ["确认卡片是否为Mifare Classic类型", "尝试使用不同的密钥", "检查卡片是否损坏"] : r.message.includes("密钥") ? r.suggestions = ["检查密钥格式是否正确", "尝试使用默认密钥FFFFFFFFFFFF", "联系卡片管理员获取正确密钥"] : r.message.includes("读卡模式") && (r.suggestions = ["检查设备是否支持读卡功能", "尝试重新初始化设备", "确认设备固件版本"]), e.lastError = r;
      },
      CLEAR_ERROR: function CLEAR_ERROR(e) {
        e.lastError = null;
      },
      UPDATE_STATISTICS: function UPDATE_STATISTICS(e, s) {
        e.statistics = _objectSpread2(_objectSpread2({}, e.statistics), s);
      },
      INCREMENT_READ_COUNT: function INCREMENT_READ_COUNT(e) {
        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$success = _ref.success,
          s = _ref$success === void 0 ? !1 : _ref$success,
          _ref$mode = _ref.mode,
          r = _ref$mode === void 0 ? "hf" : _ref$mode;
        e.statistics.totalReads++, s ? e.statistics.successfulReads++ : e.statistics.failedReads++, "hf" === r ? e.statistics.hfReads++ : "lf" === r && e.statistics.lfReads++;
      }
    },
    actions: {
      initializeReader: function initializeReader(_ref2) {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee() {
          var e, s, _s2;
          return _regeneratorRuntime2().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                e = _ref2.commit, s = _ref2.rootState;
                _context.prev = 1;
                if (!(e("SET_READING_STATE", t), e("CLEAR_ERROR"), console.log("[Reader] 开始初始化读卡器..."), !s.device.isConnected)) {
                  _context.next = 4;
                  break;
                }
                throw new Error("设备未连接，请先连接Chameleon设备");
              case 4:
                if (r.bluetoothService) {
                  _context.next = 6;
                  break;
                }
                throw new Error("蓝牙服务未初始化");
              case 6:
                if (r.bluetoothService.isConnected) {
                  _context.next = 8;
                  break;
                }
                throw new Error("蓝牙连接已断开，请重新连接设备");
              case 8:
                if (!("function" != typeof r.bluetoothService.setReaderDeviceMode)) {
                  _context.next = 10;
                  break;
                }
                throw new Error("设备固件版本不支持读卡功能，请升级固件");
              case 10:
                console.log("[Reader] 检查当前设备模式...");
                _context.next = 13;
                return r.bluetoothService.isReaderDeviceMode();
              case 13:
                if (!_context.sent) {
                  _context.next = 15;
                  break;
                }
                return _context.abrupt("return", (console.log("[Reader] 设备已处于读卡模式"), e("SET_IS_READER_MODE", !0), {
                  success: !0
                }));
              case 15:
                console.log("[Reader] 切换到读卡模式...");
                _context.next = 18;
                return r.bluetoothService.setReaderDeviceMode(!0);
              case 18:
                if (_context.sent) {
                  _context.next = 20;
                  break;
                }
                throw new Error("切换到读卡模式失败，请检查设备状态");
              case 20:
                _context.next = 22;
                return new Promise(function (e) {
                  return setTimeout(e, 500);
                });
              case 22:
                _context.next = 24;
                return r.bluetoothService.isReaderDeviceMode();
              case 24:
                if (_context.sent) {
                  _context.next = 26;
                  break;
                }
                throw new Error("读卡模式切换验证失败");
              case 26:
                return _context.abrupt("return", (e("SET_IS_READER_MODE", !0), console.log("[Reader] 读卡器初始化成功"), {
                  success: !0
                }));
              case 29:
                _context.prev = 29;
                _context.t0 = _context["catch"](1);
                console.error("[Reader] 初始化读卡器失败:", _context.t0);
                _s2 = {
                  title: "读卡器初始化失败",
                  message: _context.t0.message,
                  timestamp: Date.now(),
                  suggestions: []
                };
                return _context.abrupt("return", (_context.t0.message.includes("设备未连接") ? _s2.suggestions = ["检查设备是否已开机", "确认蓝牙连接是否正常", "尝试重新连接设备"] : _context.t0.message.includes("固件版本") ? _s2.suggestions = ["检查设备固件版本", "升级到最新固件", "联系技术支持"] : _context.t0.message.includes("模式切换") && (_s2.suggestions = ["重启设备后重试", "检查设备是否正常工作", "尝试重新连接设备"]), e("SET_ERROR", _s2), {
                  success: !1,
                  error: _context.t0.message
                }));
              case 34:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[1, 29]]);
        }))();
      },
      switchMode: function switchMode(_ref3, r) {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee2() {
          var e, s;
          return _regeneratorRuntime2().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                e = _ref3.commit, s = _ref3.state;
                _context2.prev = 1;
                if (!(s.readingState === o || s.readingState === i)) {
                  _context2.next = 4;
                  break;
                }
                throw new Error("正在读取中，无法切换模式");
              case 4:
                return _context2.abrupt("return", (e("SET_READER_MODE", r), e("CLEAR_CURRENT_CARD"), e("RESET_PROGRESS"), e("CLEAR_ERROR"), {
                  success: !0
                }));
              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](1);
                return _context2.abrupt("return", (e("SET_ERROR", _context2.t0), {
                  success: !1,
                  error: _context2.t0.message
                }));
              case 10:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[1, 7]]);
        }))();
      },
      scanCard: function scanCard(_ref4) {
        var _this = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee3() {
          var e, s, i, _e, _l, _e2, _s3, _e3, _r2;
          return _regeneratorRuntime2().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                e = _ref4.commit, s = _ref4.state, i = _ref4.rootState;
                _context3.prev = 1;
                if (!(e("SET_READING_STATE", o), e("CLEAR_CURRENT_CARD"), e("RESET_PROGRESS"), e("CLEAR_ERROR"), console.log("[Reader] \u5F00\u59CB\u626B\u63CF".concat(s.currentMode === a ? "高频" : "低频", "\u5361\u7247...")), !i.device.isConnected)) {
                  _context3.next = 4;
                  break;
                }
                throw new Error("设备未连接，请先连接Chameleon设备");
              case 4:
                if (r.bluetoothService) {
                  _context3.next = 6;
                  break;
                }
                throw new Error("蓝牙服务未初始化");
              case 6:
                if (r.bluetoothService.isConnected) {
                  _context3.next = 8;
                  break;
                }
                throw new Error("蓝牙连接已断开，请重新连接设备");
              case 8:
                if (s.isReaderMode) {
                  _context3.next = 15;
                  break;
                }
                console.log("[Reader] 设备未处于读卡模式，尝试初始化...");
                _context3.next = 12;
                return _this.dispatch("reader/initializeReader");
              case 12:
                _e = _context3.sent;
                if (_e.success) {
                  _context3.next = 15;
                  break;
                }
                throw new Error("\u65E0\u6CD5\u5207\u6362\u5230\u8BFB\u5361\u6A21\u5F0F: ".concat(_e.error));
              case 15:
                _l = null;
                _context3.prev = 16;
                if (!(s.currentMode === a)) {
                  _context3.next = 23;
                  break;
                }
                _context3.next = 20;
                return _this.dispatch("reader/scanHFCard", {
                  bluetoothService: r.bluetoothService
                });
              case 20:
                _context3.t0 = _context3.sent;
                _context3.next = 26;
                break;
              case 23:
                _context3.next = 25;
                return _this.dispatch("reader/scanLFCard", {
                  bluetoothService: r.bluetoothService
                });
              case 25:
                _context3.t0 = _context3.sent;
              case 26:
                _l = _context3.t0;
                _context3.next = 33;
                break;
              case 29:
                _context3.prev = 29;
                _context3.t1 = _context3["catch"](16);
                _e2 = _context3.t1.message, _s3 = [];
                throw _e2.includes("未检测到卡片") ? _s3 = ["确保卡片紧贴设备天线", "尝试调整卡片位置", "检查卡片是否损坏", "确认卡片类型是否匹配当前模式"] : _e2.includes("通信错误") ? _s3 = ["检查设备与卡片的距离", "避免金属物体干扰", "重新放置卡片后重试"] : _e2.includes("设备模式") && (_s3 = ["重新初始化读卡器", "检查设备固件版本", "重启设备后重试"]), new Error(_e2);
              case 33:
                if (!_l) {
                  _context3.next = 42;
                  break;
                }
                if (!(e("SET_CURRENT_CARD", _l), e("SET_READING_STATE", c), e("INCREMENT_READ_COUNT", {
                  success: !0,
                  mode: s.currentMode
                }), console.log("[Reader] \u6210\u529F\u68C0\u6D4B\u5230".concat(_l.type, "\u5361\u7247, UID: ").concat(_l.uid)), s.scanSettings.readData)) {
                  _context3.next = 40;
                  break;
                }
                console.log("[Reader] 开始自动读取卡片数据...");
                _context3.next = 38;
                return _this.dispatch("reader/readCardData");
              case 38:
                _e3 = _context3.sent;
                return _context3.abrupt("return", {
                  success: _e3.success,
                  card: _e3.success ? _e3.card : _l,
                  error: _e3.error
                });
              case 40:
                _context3.next = 43;
                break;
              case 42:
                console.log("[Reader] 未检测到卡片"), e("SET_READING_STATE", t);
              case 43:
                return _context3.abrupt("return", {
                  success: !0,
                  card: _l
                });
              case 46:
                _context3.prev = 46;
                _context3.t2 = _context3["catch"](1);
                console.error("[Reader] 扫描卡片失败:", _context3.t2);
                _r2 = {
                  title: "扫描失败",
                  message: _context3.t2.message,
                  timestamp: Date.now(),
                  suggestions: []
                };
                return _context3.abrupt("return", (_context3.t2.message.includes("设备未连接") ? _r2.suggestions = ["检查设备是否已开机", "确认蓝牙连接是否正常", "尝试重新连接设备"] : _context3.t2.message.includes("未检测到卡片") ? _r2.suggestions = ["确保卡片紧贴设备天线", "尝试调整卡片位置", "检查卡片是否损坏", "\u786E\u8BA4\u5361\u7247\u7C7B\u578B\u662F\u5426\u4E3A".concat(s.currentMode === a ? "高频" : "低频", "\u5361\u7247")] : _context3.t2.message.includes("读卡模式") && (_r2.suggestions = ["重新初始化读卡器", "检查设备固件版本", "重启设备后重试"]), e("SET_ERROR", _r2), e("SET_READING_STATE", l), e("INCREMENT_READ_COUNT", {
                  success: !1,
                  mode: s.currentMode
                }), {
                  success: !1,
                  error: _context3.t2.message
                }));
              case 51:
              case "end":
                return _context3.stop();
            }
          }, _callee3, null, [[1, 46], [16, 29]]);
        }))();
      },
      scanHFCard: function scanHFCard(_ref5, _ref6) {
        var _this2 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee4() {
          var e, s, _t2, _t2$data, _o, _c, _i, _n, _l2, _d, g, u, R, E, m, _e4;
          return _regeneratorRuntime2().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                e = _ref5.commit;
                s = _ref6.bluetoothService;
                e("UPDATE_PROGRESS", {
                  message: "正在扫描高频卡片...",
                  percentage: 10
                });
                _context4.prev = 3;
                _context4.next = 6;
                return s.isReaderDeviceMode();
              case 6:
                if (_context4.sent) {
                  _context4.next = 12;
                  break;
                }
                console.log("[scanHFCard] 设备未处于读卡器模式，尝试切换...");
                _context4.next = 10;
                return s.setReaderDeviceMode(!0);
              case 10:
                if (_context4.sent) {
                  _context4.next = 12;
                  break;
                }
                throw new Error("无法切换到读卡器模式");
              case 12:
                e("UPDATE_PROGRESS", {
                  message: "正在扫描14443A卡片...",
                  percentage: 30
                });
                _context4.next = 15;
                return s.scan14443aTag();
              case 15:
                _t2 = _context4.sent;
                if (_t2.success) {
                  _context4.next = 18;
                  break;
                }
                return _context4.abrupt("return", (console.log("[scanHFCard] 扫描失败:", _t2.error), null));
              case 18:
                _t2$data = _t2.data, _o = _t2$data.uid, _c = _t2$data.atqa, _i = _t2$data.sak, _n = _t2$data.ats;
                if (!(!_o || 0 === _o.length)) {
                  _context4.next = 21;
                  break;
                }
                throw new Error("无效的UID数据");
              case 21:
                _l2 = _o.map(function (e) {
                  return e.toString(16).padStart(2, "0");
                }).join(" ").toUpperCase(), _d = _c.map(function (e) {
                  return e.toString(16).padStart(2, "0");
                }).join(" ").toUpperCase(), g = _i.toString(16).padStart(2, "0").toUpperCase(), u = _n.length > 0 ? _n.map(function (e) {
                  return e.toString(16).padStart(2, "0");
                }).join(" ").toUpperCase() : "";
                e("UPDATE_PROGRESS", {
                  message: "正在识别卡片类型...",
                  percentage: 60
                });
                R = "", E = "", m = "ISO14443A";
                _context4.prev = 24;
                console.log("[scanHFCard] 开始检测卡片类型...");
                _context4.next = 28;
                return s.detectMf1Support();
              case 28:
                if (!_context4.sent) {
                  _context4.next = 42;
                  break;
                }
                console.log("[scanHFCard] 检测到Mifare Classic卡片，开始识别具体类型...");
                _context4.prev = 30;
                _context4.next = 33;
                return _this2.dispatch("reader/mfClassicGetType", {
                  bluetoothService: s
                });
              case 33:
                _e4 = _context4.sent;
                R = _e4, E = _this2.getters["reader/formatCardTypeName"](_e4), m = "Mifare Classic", console.log("[scanHFCard] Mifare Classic\u7C7B\u578B\u8BC6\u522B\u5B8C\u6210: ".concat(_e4, " -> ").concat(E));
                _context4.next = 40;
                break;
              case 37:
                _context4.prev = 37;
                _context4.t0 = _context4["catch"](30);
                console.warn("[scanHFCard] Mifare Classic类型识别失败:", _context4.t0.message), R = "mifare_classic_1k", E = "Mifare Classic 1K", m = "Mifare Classic";
              case 40:
                _context4.next = 43;
                break;
              case 42:
                console.log("[scanHFCard] 非Mifare Classic卡片，使用静态识别"), R = _this2.getters["reader/identifyHFCardType"]({
                  sak: _i,
                  atqa: _d,
                  ats: u
                }), E = _this2.getters["reader/formatCardTypeName"](R), m = R.includes("ntag") ? "NTAG" : R.includes("ultralight") ? "Mifare Ultralight" : "ISO14443A", console.log("[scanHFCard] \u9759\u6001\u8BC6\u522B\u7ED3\u679C: ".concat(R, " -> ").concat(E));
              case 43:
                _context4.next = 48;
                break;
              case 45:
                _context4.prev = 45;
                _context4.t1 = _context4["catch"](24);
                console.warn("[scanHFCard] 卡片类型识别异常:", _context4.t1.message), R = _this2.getters["reader/identifyHFCardType"]({
                  sak: _i,
                  atqa: _d,
                  ats: u
                }), E = _this2.getters["reader/formatCardTypeName"](R) || "未知类型", m = "ISO14443A", console.log("[scanHFCard] \u5F02\u5E38\u56DE\u9000\u8BC6\u522B\u7ED3\u679C: ".concat(R, " -> ").concat(E));
              case 48:
                return _context4.abrupt("return", (e("UPDATE_PROGRESS", {
                  message: "\u68C0\u6D4B\u5230".concat(E, "\u5361\u7247"),
                  percentage: 100
                }), {
                  uid: _l2,
                  sak: g,
                  atqa: _d,
                  ats: u,
                  type: R,
                  typeDisplay: E,
                  protocol: m,
                  readTime: new Date().toISOString(),
                  isComplete: !1
                }));
              case 51:
                _context4.prev = 51;
                _context4.t2 = _context4["catch"](3);
                throw console.error("[scanHFCard] 扫描失败:", _context4.t2), new Error("\u9AD8\u9891\u5361\u7247\u626B\u63CF\u5931\u8D25: ".concat(_context4.t2.message));
              case 54:
              case "end":
                return _context4.stop();
            }
          }, _callee4, null, [[3, 51], [24, 45], [30, 37]]);
        }))();
      },
      scanLFCard: function scanLFCard(_ref7, _ref8) {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee5() {
          var e, s, r, _a2, _t3;
          return _regeneratorRuntime2().wrap(function _callee5$(_context5) {
            while (1) switch (_context5.prev = _context5.next) {
              case 0:
                e = _ref7.commit;
                s = _ref8.bluetoothService;
                e("UPDATE_PROGRESS", {
                  message: "正在扫描低频卡片...",
                  percentage: 10
                });
                _context5.prev = 3;
                _context5.next = 6;
                return s.isReaderDeviceMode();
              case 6:
                if (_context5.sent) {
                  _context5.next = 12;
                  break;
                }
                console.log("[scanLFCard] 设备未处于读卡器模式，尝试切换...");
                _context5.next = 10;
                return s.setReaderDeviceMode(!0);
              case 10:
                if (_context5.sent) {
                  _context5.next = 12;
                  break;
                }
                throw new Error("无法切换到读卡器模式");
              case 12:
                e("UPDATE_PROGRESS", {
                  message: "正在读取EM410X卡片...",
                  percentage: 50
                });
                _context5.next = 15;
                return s.readEM410X();
              case 15:
                _a2 = _context5.sent;
                if (!(!_a2 || "" === _a2)) {
                  _context5.next = 18;
                  break;
                }
                return _context5.abrupt("return", (console.log("[scanLFCard] 未检测到EM410X卡片"), null));
              case 18:
                if (!(10 !== _a2.length)) {
                  _context5.next = 20;
                  break;
                }
                throw new Error("\u65E0\u6548\u7684EM410X UID\u957F\u5EA6: ".concat(_a2.length, ", \u671F\u671B: 10"));
              case 20:
                if (/^[0-9A-Fa-f]{10}$/.test(_a2)) {
                  _context5.next = 22;
                  break;
                }
                throw new Error("无效的EM410X UID格式");
              case 22:
                _t3 = (null == (r = _a2.match(/.{2}/g)) ? void 0 : r.join(" ")) || _a2;
                return _context5.abrupt("return", (e("UPDATE_PROGRESS", {
                  message: "检测到EM410X卡片",
                  percentage: 100
                }), console.log("[scanLFCard] 成功扫描EM410X卡片, UID:", _t3), {
                  uid: _t3,
                  type: "em410x",
                  protocol: "EM410X",
                  readTime: new Date().toISOString(),
                  isComplete: !0
                }));
              case 26:
                _context5.prev = 26;
                _context5.t0 = _context5["catch"](3);
                throw console.error("[scanLFCard] 扫描失败:", _context5.t0), new Error("\u4F4E\u9891\u5361\u7247\u626B\u63CF\u5931\u8D25: ".concat(_context5.t0.message));
              case 29:
              case "end":
                return _context5.stop();
            }
          }, _callee5, null, [[3, 26]]);
        }))();
      },
      readCardData: function readCardData(_ref9) {
        var _this3 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee6() {
          var e, s, r, _a3, _r3, _r4;
          return _regeneratorRuntime2().wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                e = _ref9.commit, s = _ref9.state;
                _context6.prev = 1;
                e("SET_READING_STATE", i), e("RESET_PROGRESS");
                r = s.currentCard.type;
                _a3 = null;
                if (!_this3.getters["reader/isMifareClassicType"](r)) {
                  _context6.next = 11;
                  break;
                }
                _context6.next = 8;
                return _this3.dispatch("reader/readMifareClassic");
              case 8:
                _a3 = _context6.sent;
                _context6.next = 20;
                break;
              case 11:
                if (!_this3.getters["reader/isMifareUltralightType"](r)) {
                  _context6.next = 17;
                  break;
                }
                _context6.next = 14;
                return _this3.dispatch("reader/readMifareUltralight");
              case 14:
                _a3 = _context6.sent;
                _context6.next = 20;
                break;
              case 17:
                if (!("em410x" !== r)) {
                  _context6.next = 19;
                  break;
                }
                throw new Error("\u4E0D\u652F\u6301\u7684\u5361\u7247\u7C7B\u578B: ".concat(r));
              case 19:
                _a3 = {
                  success: !0,
                  isComplete: !0
                };
              case 20:
                if (!_a3.success) {
                  _context6.next = 23;
                  break;
                }
                _r3 = _objectSpread2(_objectSpread2(_objectSpread2({}, s.currentCard), _a3.data), {}, {
                  isComplete: !0,
                  readTime: new Date().toISOString()
                });
                return _context6.abrupt("return", (e("SET_CURRENT_CARD", _r3), e("SET_READING_STATE", n), e("ADD_TO_HISTORY", _r3), {
                  success: !0,
                  card: _r3
                }));
              case 23:
                _r4 = _objectSpread2(_objectSpread2({}, s.currentCard), {}, {
                  isComplete: !1,
                  hasErrors: !0,
                  errorMessage: _a3.error || "读取失败",
                  readTime: new Date().toISOString()
                });
                return _context6.abrupt("return", (e("SET_CURRENT_CARD", _r4), e("SET_READING_STATE", l), e("SET_ERROR", {
                  message: _a3.error || "读取失败"
                }), {
                  success: !1,
                  error: _a3.error,
                  card: _r4
                }));
              case 27:
                _context6.prev = 27;
                _context6.t0 = _context6["catch"](1);
                return _context6.abrupt("return", (e("SET_ERROR", _context6.t0), e("SET_READING_STATE", l), {
                  success: !1,
                  error: _context6.t0.message
                }));
              case 30:
              case "end":
                return _context6.stop();
            }
          }, _callee6, null, [[1, 27]]);
        }))();
      },
      readMifareClassic: function readMifareClassic(_ref10) {
        var _this4 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee7() {
          var e, s;
          return _regeneratorRuntime2().wrap(function _callee7$(_context7) {
            while (1) switch (_context7.prev = _context7.next) {
              case 0:
                e = _ref10.commit;
                console.log("[Reader] 开始智能读取Mifare Classic卡片"), e("UPDATE_PROGRESS", {
                  current: 0,
                  total: 100,
                  percentage: 0,
                  message: "正在使用默认密钥读取..."
                });
                _context7.next = 4;
                return _this4.dispatch("reader/readMifareClassicAdvanced", {
                  useDefaultKeys: !0,
                  customKeys: [],
                  useNestedAttack: !1,
                  showDetailedProgress: !1
                });
              case 4:
                s = _context7.sent;
                return _context7.abrupt("return", (s.success && (console.log("[Reader] \u667A\u80FD\u8BFB\u53D6\u5B8C\u6210\uFF0C\u53EF\u8BBF\u95EE\u6247\u533A: ".concat(s.data.accessibleSectors)), e("UPDATE_PROGRESS", {
                  current: 100,
                  total: 100,
                  percentage: 100,
                  message: "读取完成"
                }), s.data.hasErrors && console.log("[Reader] 部分扇区无法访问，用户可选择高级读取")), s));
              case 6:
              case "end":
                return _context7.stop();
            }
          }, _callee7);
        }))();
      },
      readMifareClassicAdvanced: function readMifareClassicAdvanced(_ref11) {
        var _arguments = arguments,
          _this5 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee8() {
          var s, a, t, _t$useDefaultKeys, o, _t$customKeys, c, _t$useNestedAttack, i, _t$showDetailedProgre, n, l, d, g, _t4, _e5, E, m, p, S, h, f, _loop, _e6, T, _, y, _loop2, _e7;
          return _regeneratorRuntime2().wrap(function _callee8$(_context10) {
            while (1) switch (_context10.prev = _context10.next) {
              case 0:
                s = _ref11.commit, a = _ref11.state;
                t = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : {};
                _t$useDefaultKeys = t.useDefaultKeys, o = _t$useDefaultKeys === void 0 ? !0 : _t$useDefaultKeys, _t$customKeys = t.customKeys, c = _t$customKeys === void 0 ? [] : _t$customKeys, _t$useNestedAttack = t.useNestedAttack, i = _t$useNestedAttack === void 0 ? !1 : _t$useNestedAttack, _t$showDetailedProgre = t.showDetailedProgress, n = _t$showDetailedProgre === void 0 ? !1 : _t$showDetailedProgre, l = a.currentCard, d = l.typeDisplay || l.type || "Mifare Classic", g = l.uid || "未知UID";
                s("UPDATE_PROGRESS", {
                  message: "\u6B63\u5728\u9AD8\u7EA7\u8BFB\u53D6 ".concat(d, " \u5361\u7247 (").concat(g, ")..."),
                  percentage: 0
                });
                _context10.prev = 4;
                _context10.next = 7;
                return r.bluetoothService.detectMf1Support();
              case 7:
                if (_context10.sent) {
                  _context10.next = 9;
                  break;
                }
                throw new Error("不是Mifare Classic卡片");
              case 9:
                console.log("[Reader] \u68C0\u6D4B\u5230".concat(d, "\u5361\u7247 (").concat(g, ")\uFF0C\u5F00\u59CB\u9AD8\u7EA7\u8BFB\u53D6..."));
                _t4 = [];
                if (o && (_t4 = _toConsumableArray2(e.gMifareClassicKeys), console.log("[Reader] 使用默认密钥库，共", _t4.length, "个密钥")), c && c.length > 0) {
                  _e5 = c.map(function (e) {
                    var s = [];
                    for (var _r5 = 0; _r5 < e.length; _r5 += 2) s.push(parseInt(e.substr(_r5, 2), 16));
                    return s;
                  });
                  _t4 = [].concat(_toConsumableArray2(_t4), _toConsumableArray2(_e5)), console.log("[Reader] 添加", c.length, "个自定义密钥");
                }
                if (!(0 === _t4.length)) {
                  _context10.next = 14;
                  break;
                }
                throw new Error("没有可用的密钥");
              case 14:
                console.log("[Reader] 总共将尝试", _t4.length, "个密钥");
                E = a.currentCard.type;
                m = 16;
                p = E.toLowerCase();
                p.includes("4k") ? m = 40 : p.includes("2k") ? m = 32 : p.includes("mini") && (m = 5), console.log("[Reader] 卡片类型:", E, "扇区数:", m);
                S = l.sectors || [], h = [], f = [];
                _loop = /*#__PURE__*/_regeneratorRuntime2().mark(function _loop(_e6) {
                  var s;
                  return _regeneratorRuntime2().wrap(function _loop$(_context8) {
                    while (1) switch (_context8.prev = _context8.next) {
                      case 0:
                        s = S.find(function (s) {
                          return s.sector === _e6;
                        });
                        s && s.readable ? f.push(_e6) : h.push(_e6);
                      case 2:
                      case "end":
                        return _context8.stop();
                    }
                  }, _loop);
                });
                _e6 = 0;
              case 22:
                if (!(_e6 < m)) {
                  _context10.next = 27;
                  break;
                }
                return _context10.delegateYield(_loop(_e6), "t0", 24);
              case 24:
                _e6++;
                _context10.next = 22;
                break;
              case 27:
                if (!(console.log("[Reader] \u6247\u533A\u72B6\u6001\u5206\u6790: \u53EF\u8BFB\u6247\u533A ".concat(f.length, " \u4E2A, \u9700\u8981\u89E3\u6790\u6247\u533A ").concat(h.length, " \u4E2A")), 0 === h.length)) {
                  _context10.next = 29;
                  break;
                }
                return _context10.abrupt("return", (s("UPDATE_PROGRESS", {
                  message: "".concat(d, " (").concat(g, ") - \u6240\u6709\u6247\u533A\u5DF2\u89E3\u6790\u5B8C\u6210"),
                  percentage: 100
                }), n && s("ADD_PROGRESS_DETAIL", {
                  message: "所有扇区已经可读，无需重新解析",
                  success: !0,
                  error: !1
                }), {
                  success: !0,
                  data: {
                    sectors: S,
                    hasErrors: !1,
                    errorMessage: null,
                    accessibleSectors: f.length
                  }
                }));
              case 29:
                T = f.length;
                _ = _toConsumableArray2(S), y = {
                  keyA: {},
                  keyB: {}
                };
                _loop2 = /*#__PURE__*/_regeneratorRuntime2().mark(function _loop2() {
                  var a, o, c, l, g, _e8, _i2, _d2, _e9, E, _e10, _t5, _o2, _c2, _i3, _o3, _a4, p, S;
                  return _regeneratorRuntime2().wrap(function _loop2$(_context9) {
                    while (1) switch (_context9.prev = _context9.next) {
                      case 0:
                        a = h[_e7], o = Math.round(_e7 / h.length * 90);
                        s("UPDATE_PROGRESS", {
                          current: _e7 + 1,
                          total: h.length,
                          percentage: o,
                          message: "".concat(d, " - \u6247\u533A ").concat(a + 1, "/").concat(m, " (").concat(o, "%)")
                        }), n && s("ADD_PROGRESS_DETAIL", {
                          message: "".concat(d, " - \u5F00\u59CB\u89E3\u6790\u6247\u533A ").concat(a, " (").concat(_e7 + 1, "/").concat(h.length, ")"),
                          success: !1,
                          error: !1
                        });
                        c = !1, l = "", g = 0;
                        _e8 = 0;
                      case 4:
                        if (!(_e8 < _t4.length && !c)) {
                          _context9.next = 36;
                          break;
                        }
                        _i2 = _t4[_e8], _d2 = _i2.map(function (e) {
                          return e.toString(16).padStart(2, "0");
                        }).join("").toUpperCase();
                        g = _e8 + 1, l = "KeyA", n && (s("UPDATE_PROGRESS", {
                          current: a + 1,
                          total: m,
                          percentage: o,
                          message: "\u6247\u533A ".concat(a + 1, "/").concat(m, " - \u5C1D\u8BD5 ").concat(l, " (\u5BC6\u94A5 ").concat(g, "/").concat(_t4.length, ")")
                        }), s("ADD_PROGRESS_DETAIL", {
                          message: "\u6247\u533A ".concat(a, " \u5C1D\u8BD5 KeyA \u5BC6\u94A5 ").concat(_d2),
                          success: !1,
                          error: !1
                        }));
                        _context9.prev = 7;
                        _context9.next = 10;
                        return r.bluetoothService.mf1Auth(4 * a, 96, _i2);
                      case 10:
                        if (!_context9.sent) {
                          _context9.next = 13;
                          break;
                        }
                        console.log("[Reader] \u6247\u533A ".concat(a, " KeyA \u8BA4\u8BC1\u6210\u529F\uFF0C\u5BC6\u94A5: ").concat(_d2)), T++, c = !0, y.keyA[a] = _i2, s("UPDATE_PROGRESS", {
                          current: a + 1,
                          total: m,
                          percentage: o,
                          message: "\u6247\u533A ".concat(a + 1, "/").concat(m, " - KeyA \u8BA4\u8BC1\u6210\u529F \u2713")
                        }), n && s("ADD_PROGRESS_DETAIL", {
                          message: "\u6247\u533A ".concat(a, " KeyA \u8BA4\u8BC1\u6210\u529F (\u5BC6\u94A5: ").concat(_d2, ")"),
                          success: !0,
                          error: !1
                        });
                        return _context9.abrupt("break", 36);
                      case 13:
                        _context9.next = 18;
                        break;
                      case 15:
                        _context9.prev = 15;
                        _context9.t0 = _context9["catch"](7);
                        n && s("ADD_PROGRESS_DETAIL", {
                          message: "\u6247\u533A ".concat(a, " KeyA \u8BA4\u8BC1\u5931\u8D25"),
                          success: !1,
                          error: !0
                        });
                      case 18:
                        if (c) {
                          _context9.next = 31;
                          break;
                        }
                        l = "KeyB", n && (s("UPDATE_PROGRESS", {
                          current: a + 1,
                          total: m,
                          percentage: o,
                          message: "\u6247\u533A ".concat(a + 1, "/").concat(m, " - \u5C1D\u8BD5 ").concat(l, " (\u5BC6\u94A5 ").concat(g, "/").concat(_t4.length, ")")
                        }), s("ADD_PROGRESS_DETAIL", {
                          message: "\u6247\u533A ".concat(a, " \u5C1D\u8BD5 KeyB \u5BC6\u94A5 ").concat(_d2),
                          success: !1,
                          error: !1
                        }));
                        _context9.prev = 20;
                        _context9.next = 23;
                        return r.bluetoothService.mf1Auth(4 * a, 97, _i2);
                      case 23:
                        if (!_context9.sent) {
                          _context9.next = 26;
                          break;
                        }
                        console.log("[Reader] \u6247\u533A ".concat(a, " KeyB \u8BA4\u8BC1\u6210\u529F\uFF0C\u5BC6\u94A5: ").concat(_d2)), T++, c = !0, y.keyB[a] = _i2, s("UPDATE_PROGRESS", {
                          current: a + 1,
                          total: m,
                          percentage: o,
                          message: "\u6247\u533A ".concat(a + 1, "/").concat(m, " - KeyB \u8BA4\u8BC1\u6210\u529F \u2713")
                        }), n && s("ADD_PROGRESS_DETAIL", {
                          message: "\u6247\u533A ".concat(a, " KeyB \u8BA4\u8BC1\u6210\u529F (\u5BC6\u94A5: ").concat(_d2, ")"),
                          success: !0,
                          error: !1
                        });
                        return _context9.abrupt("break", 36);
                      case 26:
                        _context9.next = 31;
                        break;
                      case 28:
                        _context9.prev = 28;
                        _context9.t1 = _context9["catch"](20);
                        n && s("ADD_PROGRESS_DETAIL", {
                          message: "\u6247\u533A ".concat(a, " KeyB \u8BA4\u8BC1\u5931\u8D25"),
                          success: !1,
                          error: !0
                        });
                      case 31:
                        _context9.next = 33;
                        return new Promise(function (e) {
                          return setTimeout(e, 50);
                        });
                      case 33:
                        _e8++;
                        _context9.next = 4;
                        break;
                      case 36:
                        if (!(c || (s("UPDATE_PROGRESS", {
                          current: a + 1,
                          total: m,
                          percentage: o,
                          message: "\u6247\u533A ".concat(a + 1, "/").concat(m, " - \u65E0\u6CD5\u8BBF\u95EE \u2717")
                        }), n && s("ADD_PROGRESS_DETAIL", {
                          message: "\u6247\u533A ".concat(a, " \u6240\u6709\u5BC6\u94A5\u5C1D\u8BD5\u5931\u8D25"),
                          success: !1,
                          error: !0
                        })), !c && i)) {
                          _context9.next = 48;
                          break;
                        }
                        n && s("UPDATE_PROGRESS", {
                          current: a + 1,
                          total: m,
                          percentage: Math.round(a / m * 80),
                          message: "\u5BF9\u6247\u533A ".concat(a, " \u6267\u884C\u5D4C\u5957\u653B\u51FB...")
                        });
                        _context9.prev = 38;
                        _context9.next = 41;
                        return _this5.dispatch("reader/performNestedAttack", a);
                      case 41:
                        _e9 = _context9.sent;
                        (_e9.keyA || _e9.keyB) && (c = !0, T++, _e9.keyA && (y.keyA[a] = _e9.keyA), _e9.keyB && (y.keyB[a] = _e9.keyB), console.log("[Reader] \u6247\u533A ".concat(a, " \u5D4C\u5957\u653B\u51FB\u6210\u529F")));
                        _context9.next = 48;
                        break;
                      case 45:
                        _context9.prev = 45;
                        _context9.t2 = _context9["catch"](38);
                        console.warn("[Reader] \u6247\u533A ".concat(a, " \u5D4C\u5957\u653B\u51FB\u5931\u8D25:"), _context9.t2.message);
                      case 48:
                        c || n && (console.warn("[Reader] \u6247\u533A ".concat(a, " \u65E0\u6CD5\u8BBF\u95EE")), s("ADD_PROGRESS_DETAIL", {
                          message: "\u6247\u533A ".concat(a, " \u65E0\u6CD5\u8BBF\u95EE"),
                          success: !1,
                          error: !0
                        }));
                        E = [];
                        if (!c) {
                          _context9.next = 77;
                          break;
                        }
                        y.keyA[a] ? (_e10 = 96, _t5 = y.keyA[a]) : y.keyB[a] ? (_e10 = 97, _t5 = y.keyB[a]) : (console.warn("[Reader] \u6247\u533A ".concat(a, " \u6CA1\u6709\u6210\u529F\u7684\u5BC6\u94A5\u8BB0\u5F55")), _e10 = 96, _t5 = [255, 255, 255, 255, 255, 255]);
                        _o2 = _t5.map(function (e) {
                          return e.toString(16).padStart(2, "0");
                        }).join("").toUpperCase();
                        console.log("[Reader] \u8BFB\u53D6\u6247\u533A ".concat(a, " \u6570\u636E\uFF0C\u4F7F\u7528\u5BC6\u94A5\u7C7B\u578B: ").concat(96 === _e10 ? "KeyA" : "KeyB", ", \u5BC6\u94A5: ").concat(_o2));
                        _c2 = Math.round(a / m * 90) + 5;
                        s("UPDATE_PROGRESS", {
                          current: a + 1,
                          total: m,
                          percentage: _c2,
                          message: "\u6247\u533A ".concat(a + 1, "/").concat(m, " - \u6B63\u5728\u8BFB\u53D6\u6570\u636E...")
                        });
                        _i3 = 0;
                      case 57:
                        if (!(_i3 < 4)) {
                          _context9.next = 75;
                          break;
                        }
                        _o3 = 4 * a + _i3;
                        n && s("ADD_PROGRESS_DETAIL", {
                          message: "\u8BFB\u53D6\u5757 ".concat(_o3, " (\u6247\u533A ").concat(a, ", \u5757 ").concat(_i3, ")"),
                          success: !1,
                          error: !1
                        });
                        _context9.prev = 60;
                        _context9.next = 63;
                        return r.bluetoothService.mf1ReadBlock(_o3, _e10, _t5);
                      case 63:
                        _a4 = _context9.sent;
                        if (_a4 && Array.isArray(_a4) && 16 === _a4.length) {
                          if (E.push(_a4), n) {
                            s("ADD_PROGRESS_DETAIL", {
                              message: "\u5757 ".concat(_o3, " \u8BFB\u53D6\u6210\u529F: ").concat(_a4.map(function (e) {
                                return e.toString(16).padStart(2, "0");
                              }).join(" ").toUpperCase()),
                              success: !0,
                              error: !1
                            });
                          }
                        } else E.push(new Array(16).fill(0)), n && s("ADD_PROGRESS_DETAIL", {
                          message: "\u5757 ".concat(_o3, " \u8BFB\u53D6\u5931\u8D25\uFF0C\u6570\u636E\u65E0\u6548"),
                          success: !1,
                          error: !0
                        });
                        _context9.next = 70;
                        break;
                      case 67:
                        _context9.prev = 67;
                        _context9.t3 = _context9["catch"](60);
                        E.push(new Array(16).fill(0)), n && s("ADD_PROGRESS_DETAIL", {
                          message: "\u5757 ".concat(_o3, " \u8BFB\u53D6\u5F02\u5E38: ").concat(_context9.t3.message),
                          success: !1,
                          error: !0
                        });
                      case 70:
                        _context9.next = 72;
                        return new Promise(function (e) {
                          return setTimeout(e, 50);
                        });
                      case 72:
                        _i3++;
                        _context9.next = 57;
                        break;
                      case 75:
                        _context9.next = 78;
                        break;
                      case 77:
                        E = Array.from({
                          length: 4
                        }, function () {
                          return new Array(16).fill(0);
                        });
                      case 78:
                        p = {
                          sector: a,
                          readable: c,
                          blocks: E,
                          keyA: y.keyA[a] || null,
                          keyB: y.keyB[a] || null
                        }, S = _.findIndex(function (e) {
                          return e.sector === a;
                        });
                        S >= 0 ? _[S] = p : _.push(p);
                        _context9.next = 82;
                        return new Promise(function (e) {
                          return setTimeout(e, 100);
                        });
                      case 82:
                      case "end":
                        return _context9.stop();
                    }
                  }, _loop2, null, [[7, 15], [20, 28], [38, 45], [60, 67]]);
                });
                _e7 = 0;
              case 33:
                if (!(_e7 < h.length)) {
                  _context10.next = 38;
                  break;
                }
                return _context10.delegateYield(_loop2(), "t1", 35);
              case 35:
                _e7++;
                _context10.next = 33;
                break;
              case 38:
                return _context10.abrupt("return", (console.log("[Reader] Mifare Classic认证完成，可访问扇区数：", T), console.log("[Reader] 成功密钥:", y), s("UPDATE_PROGRESS", {
                  message: "".concat(d, " - \u8BFB\u53D6\u5B8C\u6210\uFF0C\u53EF\u8BBF\u95EE ").concat(T, "/").concat(m, " \u4E2A\u6247\u533A"),
                  current: h.length,
                  total: h.length,
                  percentage: 100
                }), _.sort(function (e, s) {
                  return e.sector - s.sector;
                }), _.forEach(function (e) {
                  e.readable && (e.keyA = y.keyA[e.sector] || e.keyA, e.keyB = y.keyB[e.sector] || e.keyB);
                }), n && s("ADD_PROGRESS_DETAIL", {
                  message: "\u8BFB\u53D6\u5B8C\u6210\uFF01\u6210\u529F\u8BBF\u95EE ".concat(T, "/").concat(m, " \u4E2A\u6247\u533A"),
                  success: !0,
                  error: !1
                }), {
                  success: !0,
                  data: {
                    sectors: _,
                    keys: y,
                    hasErrors: T < m,
                    errorMessage: T < m ? "\u4EC5\u80FD\u8BBF\u95EE ".concat(T, "/").concat(m, " \u4E2A\u6247\u533A\uFF0C\u67D0\u4E9B\u6247\u533A\u9700\u8981\u7279\u5B9A\u5BC6\u94A5") : null,
                    accessibleSectors: T
                  }
                }));
              case 41:
                _context10.prev = 41;
                _context10.t2 = _context10["catch"](4);
                throw console.error("[Reader] Mifare Classic高级读取失败:", _context10.t2), new Error("Mifare Classic\u8BFB\u53D6\u5931\u8D25: ".concat(_context10.t2.message));
              case 44:
              case "end":
                return _context10.stop();
            }
          }, _callee8, null, [[4, 41]]);
        }))();
      },
      performNestedAttack: function performNestedAttack(_ref12, s) {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee9() {
          var e;
          return _regeneratorRuntime2().wrap(function _callee9$(_context11) {
            while (1) switch (_context11.prev = _context11.next) {
              case 0:
                e = _ref12.commit;
                console.log("[Reader] \u5BF9\u6247\u533A ".concat(s, " \u6267\u884C\u5D4C\u5957\u653B\u51FB..."));
                _context11.prev = 2;
                e("UPDATE_PROGRESS", {
                  message: "\u6B63\u5728\u5BF9\u6247\u533A ".concat(s, " \u6267\u884C\u5D4C\u5957\u653B\u51FB...")
                });
                _context11.next = 6;
                return new Promise(function (e) {
                  return setTimeout(e, 2e3);
                });
              case 6:
                return _context11.abrupt("return", {});
              case 9:
                _context11.prev = 9;
                _context11.t0 = _context11["catch"](2);
                return _context11.abrupt("return", (console.error("[Reader] \u6247\u533A ".concat(s, " \u5D4C\u5957\u653B\u51FB\u5931\u8D25"), _context11.t0), {}));
              case 12:
              case "end":
                return _context11.stop();
            }
          }, _callee9, null, [[2, 9]]);
        }))();
      },
      readMifareUltralight: function readMifareUltralight(_ref13) {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee10() {
          var e, _a5, _t6, _o4, _c3, _i4, _e11, _s4, _r6;
          return _regeneratorRuntime2().wrap(function _callee10$(_context12) {
            while (1) switch (_context12.prev = _context12.next) {
              case 0:
                e = _ref13.commit;
                e("UPDATE_PROGRESS", {
                  message: "正在读取Mifare Ultralight数据...",
                  percentage: 0
                });
                _context12.prev = 2;
                if (r.bluetoothService.isConnected) {
                  _context12.next = 5;
                  break;
                }
                throw new Error("设备未连接");
              case 5:
                _context12.next = 7;
                return r.bluetoothService.isReaderDeviceMode();
              case 7:
                if (_context12.sent) {
                  _context12.next = 13;
                  break;
                }
                console.log("[Reader] 设备未处于读卡器模式，尝试切换...");
                _context12.next = 11;
                return r.bluetoothService.setReaderDeviceMode(!0);
              case 11:
                if (_context12.sent) {
                  _context12.next = 13;
                  break;
                }
                throw new Error("无法切换到读卡器模式");
              case 13:
                e("UPDATE_PROGRESS", {
                  message: "开始读取页面数据...",
                  percentage: 10
                });
                _a5 = [], _t6 = [], _o4 = [], _c3 = 16;
                _i4 = 0;
              case 16:
                if (!(_i4 < _c3)) {
                  _context12.next = 35;
                  break;
                }
                if (!(e("UPDATE_PROGRESS", {
                  current: _i4 + 1,
                  total: _c3,
                  message: "\u6B63\u5728\u8BFB\u53D6\u9875\u9762 ".concat(_i4, "/").concat(_c3, "..."),
                  percentage: 10 + _i4 / _c3 * 80
                }), !r.bluetoothService.isConnected)) {
                  _context12.next = 19;
                  break;
                }
                throw new Error("设备连接已断开");
              case 19:
                console.log("[Reader] \u53D1\u900114A\u539F\u59CB\u547D\u4EE4\u8BFB\u53D6\u9875\u9762: ".concat(_i4));
                _context12.prev = 20;
                _context12.next = 23;
                return r.bluetoothService.send14ARaw([48, _i4], {
                  respTimeoutMs: 100,
                  autoSelect: !1,
                  keepRfField: !0
                });
              case 23:
                _e11 = _context12.sent;
                if (_e11 && _e11.length >= 4) {
                  _s4 = Array.from(_e11.slice(0, 4));
                  _a5.push(_s4), _t6.push(_i4);
                  _r6 = _s4.map(function (e) {
                    return e.toString(16).padStart(2, "0");
                  }).join(" ").toUpperCase();
                  console.log("[Reader] \u6210\u529F\u8BFB\u53D6\u9875\u9762 ".concat(_i4, ": ").concat(_r6));
                } else _a5.push([0, 0, 0, 0]), _o4.push(_i4), console.warn("[Reader] \u9875\u9762 ".concat(_i4, " \u6570\u636E\u65E0\u6548"));
                _context12.next = 30;
                break;
              case 27:
                _context12.prev = 27;
                _context12.t0 = _context12["catch"](20);
                console.warn("[Reader] \u9875\u9762 ".concat(_i4, " \u8BFB\u53D6\u5931\u8D25: ").concat(_context12.t0.message)), _a5.push([0, 0, 0, 0]), _o4.push(_i4);
              case 30:
                _context12.next = 32;
                return new Promise(function (e) {
                  return setTimeout(e, 50);
                });
              case 32:
                _i4++;
                _context12.next = 16;
                break;
              case 35:
                return _context12.abrupt("return", (e("UPDATE_PROGRESS", {
                  message: "读取完成",
                  percentage: 100
                }), console.log("[Reader] Mifare Ultralight\u8BFB\u53D6\u5B8C\u6210\uFF0C\u5171\u8BFB\u53D6 ".concat(_a5.length, " \u9875\uFF0C\u53EF\u8BFB\u9875\u9762: ").concat(_t6.length, "\uFF0C\u4E0D\u53EF\u8BFB\u9875\u9762: ").concat(_o4.length)), {
                  success: !0,
                  data: {
                    pages: _a5,
                    readablePages: _t6,
                    unreadablePages: _o4,
                    hasErrors: _o4.length > 0,
                    errorMessage: _o4.length > 0 ? "".concat(_o4.length, " \u4E2A\u9875\u9762\u65E0\u6CD5\u8BFB\u53D6") : null
                  }
                }));
              case 38:
                _context12.prev = 38;
                _context12.t1 = _context12["catch"](2);
                throw console.error("[Reader] Mifare Ultralight读取失败:", _context12.t1), new Error("Mifare Ultralight\u8BFB\u53D6\u5931\u8D25: ".concat(_context12.t1.message));
              case 41:
              case "end":
                return _context12.stop();
            }
          }, _callee10, null, [[2, 38], [20, 27]]);
        }))();
      },
      saveToCardPackage: function saveToCardPackage(_ref14) {
        var _arguments2 = arguments,
          _this6 = this;
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee11() {
          var e, r, _ref15, a, t, _o5, _c4, _i5, _e12, _r7, _e13;
          return _regeneratorRuntime2().wrap(function _callee11$(_context13) {
            while (1) switch (_context13.prev = _context13.next) {
              case 0:
                e = _ref14.state, r = _ref14.getters;
                _ref15 = _arguments2.length > 1 && _arguments2[1] !== undefined ? _arguments2[1] : {}, a = _ref15.cardData, t = _ref15.cardName;
                _context13.prev = 2;
                _o5 = a || e.currentCard;
                if (_o5.uid) {
                  _context13.next = 6;
                  break;
                }
                throw new Error("没有可保存的卡片数据");
              case 6:
                console.log("[saveToCardPackage] 开始保存卡片到卡包:", _o5);
                _c4 = t || "\u8BFB\u53D6\u7684".concat(r.formatCardTypeName(_o5.type), "\u5361\u7247");
                _i5 = null;
                if (r.isMifareClassicType(_o5.type)) {
                  _e12 = _o5.sectors || [], _r7 = [];
                  _e12.forEach(function (e) {
                    e.blocks && e.blocks.forEach(function (e) {
                      _r7.push(new Uint8Array(e));
                    });
                  }), _i5 = s.CardDataUtils.createMifareClassicCard({
                    name: _c4,
                    uid: _o5.uid,
                    sak: parseInt(_o5.sak, 16) || 0,
                    atqa: _o5.atqa ? _o5.atqa.split(" ").filter(function (e) {
                      return e;
                    }).map(function (e) {
                      return parseInt(e, 16);
                    }) : [0, 0],
                    ats: _o5.ats ? _o5.ats.split(" ").map(function (e) {
                      return parseInt(e, 16);
                    }) : [],
                    data: _r7,
                    type: _o5.type
                  });
                } else if (r.isMifareUltralightType(_o5.type)) {
                  _e13 = (_o5.pages || []).map(function (e) {
                    return new Uint8Array(e);
                  });
                  _i5 = s.CardDataUtils.createMifareUltralightCard({
                    name: _c4,
                    uid: _o5.uid,
                    sak: parseInt(_o5.sak, 16) || 0,
                    atqa: _o5.atqa ? _o5.atqa.split(" ").filter(function (e) {
                      return e;
                    }).map(function (e) {
                      return parseInt(e, 16);
                    }) : [0, 0],
                    ats: _o5.ats ? _o5.ats.split(" ").map(function (e) {
                      return parseInt(e, 16);
                    }) : [],
                    data: _e13,
                    type: _o5.type
                  });
                } else _i5 = "em410x" === _o5.type ? s.CardDataUtils.createEM410XCard({
                  name: _c4,
                  uid: _o5.uid
                }) : s.CardDataUtils.createGenericCard({
                  name: _c4,
                  uid: _o5.uid,
                  type: _o5.type,
                  protocol: _o5.protocol,
                  data: _o5.rawData || []
                });
                if (_i5) {
                  _context13.next = 12;
                  break;
                }
                throw new Error("无法创建卡片数据");
              case 12:
                console.log("[saveToCardPackage] 创建的卡片数据:", _i5);
                _context13.next = 15;
                return _this6.dispatch("cards/addCard", _i5);
              case 15:
                console.log("[saveToCardPackage] 卡片保存成功");
                return _context13.abrupt("return", {
                  success: !0,
                  cardName: _c4
                });
              case 19:
                _context13.prev = 19;
                _context13.t0 = _context13["catch"](2);
                return _context13.abrupt("return", (console.error("[saveToCardPackage] 保存失败:", _context13.t0), {
                  success: !1,
                  error: _context13.t0.message
                }));
              case 22:
              case "end":
                return _context13.stop();
            }
          }, _callee11, null, [[2, 19]]);
        }))();
      },
      stopReading: function stopReading(_ref16) {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee12() {
          var e, s;
          return _regeneratorRuntime2().wrap(function _callee12$(_context14) {
            while (1) switch (_context14.prev = _context14.next) {
              case 0:
                e = _ref16.commit, s = _ref16.state;
                s.readingState !== o && s.readingState !== i || (e("SET_READING_STATE", t), e("RESET_PROGRESS"));
              case 2:
              case "end":
                return _context14.stop();
            }
          }, _callee12);
        }))();
      },
      cleanup: function cleanup(_ref17) {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee13() {
          var e;
          return _regeneratorRuntime2().wrap(function _callee13$(_context15) {
            while (1) switch (_context15.prev = _context15.next) {
              case 0:
                e = _ref17.commit;
                e("SET_READING_STATE", t), e("CLEAR_CURRENT_CARD"), e("RESET_PROGRESS"), e("CLEAR_ERROR"), e("SET_IS_READER_MODE", !1);
              case 2:
              case "end":
                return _context15.stop();
            }
          }, _callee13);
        }))();
      },
      mfClassicGetType: function mfClassicGetType(_ref18, _ref19) {
        return _asyncToGenerator2( /*#__PURE__*/_regeneratorRuntime2().mark(function _callee14() {
          var e, _s5, _s6, _s7, _s8;
          return _regeneratorRuntime2().wrap(function _callee14$(_context16) {
            while (1) switch (_context16.prev = _context16.next) {
              case 0:
                _objectDestructuringEmpty2(_ref18);
                e = _ref19.bluetoothService;
                _context16.prev = 2;
                console.log("[mfClassicGetType] 开始识别Mifare Classic类型...");
                _context16.prev = 4;
                console.log("[mfClassicGetType] 测试4K卡 - 尝试认证块255");
                _context16.next = 8;
                return e.send14ARaw([96, 255], {
                  checkResponseCrc: !1,
                  respTimeoutMs: 200
                });
              case 8:
                _s5 = _context16.sent;
                if (!(console.log("[mfClassicGetType] 4K卡测试结果:", _s5), _s5 && 4 === _s5.length)) {
                  _context16.next = 11;
                  break;
                }
                return _context16.abrupt("return", (console.log("[mfClassicGetType] 识别为Mifare Classic 4K"), "mifare_classic_4k"));
              case 11:
                _context16.next = 16;
                break;
              case 13:
                _context16.prev = 13;
                _context16.t0 = _context16["catch"](4);
                console.log("[mfClassicGetType] 4K卡测试失败:", _context16.t0.message);
              case 16:
                _context16.prev = 16;
                console.log("[mfClassicGetType] 测试2K卡 - 尝试认证块128");
                _context16.next = 20;
                return e.send14ARaw([96, 128], {
                  checkResponseCrc: !1,
                  respTimeoutMs: 200
                });
              case 20:
                _s6 = _context16.sent;
                if (!(console.log("[mfClassicGetType] 2K卡测试结果:", _s6), _s6 && 4 === _s6.length)) {
                  _context16.next = 23;
                  break;
                }
                return _context16.abrupt("return", (console.log("[mfClassicGetType] 识别为Mifare Classic 2K"), "mifare_classic_2k"));
              case 23:
                _context16.next = 28;
                break;
              case 25:
                _context16.prev = 25;
                _context16.t1 = _context16["catch"](16);
                console.log("[mfClassicGetType] 2K卡测试失败:", _context16.t1.message);
              case 28:
                _context16.prev = 28;
                console.log("[mfClassicGetType] 测试1K卡 - 尝试认证块63");
                _context16.next = 32;
                return e.send14ARaw([96, 63], {
                  checkResponseCrc: !1,
                  respTimeoutMs: 200
                });
              case 32:
                _s7 = _context16.sent;
                if (!(console.log("[mfClassicGetType] 1K卡测试结果:", _s7), _s7 && 4 === _s7.length)) {
                  _context16.next = 35;
                  break;
                }
                return _context16.abrupt("return", (console.log("[mfClassicGetType] 识别为Mifare Classic 1K"), "mifare_classic_1k"));
              case 35:
                _context16.next = 40;
                break;
              case 37:
                _context16.prev = 37;
                _context16.t2 = _context16["catch"](28);
                console.log("[mfClassicGetType] 1K卡测试失败:", _context16.t2.message);
              case 40:
                _context16.prev = 40;
                console.log("[mfClassicGetType] 测试Mini卡 - 尝试认证块20");
                _context16.next = 44;
                return e.send14ARaw([96, 20], {
                  checkResponseCrc: !1,
                  respTimeoutMs: 200
                });
              case 44:
                _s8 = _context16.sent;
                if (!(console.log("[mfClassicGetType] Mini卡测试结果:", _s8), _s8 && 4 === _s8.length)) {
                  _context16.next = 47;
                  break;
                }
                return _context16.abrupt("return", (console.log("[mfClassicGetType] 识别为Mifare Classic Mini"), "mifare_classic_mini"));
              case 47:
                _context16.next = 52;
                break;
              case 49:
                _context16.prev = 49;
                _context16.t3 = _context16["catch"](40);
                console.log("[mfClassicGetType] Mini卡测试失败:", _context16.t3.message);
              case 52:
                return _context16.abrupt("return", (console.log("[mfClassicGetType] 所有测试都失败，默认识别为1K卡"), "mifare_classic_1k"));
              case 55:
                _context16.prev = 55;
                _context16.t4 = _context16["catch"](2);
                return _context16.abrupt("return", (console.warn("[mfClassicGetType] 卡片类型识别异常:", _context16.t4.message), "mifare_classic_1k"));
              case 58:
              case "end":
                return _context16.stop();
            }
          }, _callee14, null, [[2, 55], [4, 13], [16, 25], [28, 37], [40, 49]]);
        }))();
      }
    },
    getters: {
      currentStatus: function currentStatus(e) {
        return {
          mode: e.currentMode,
          state: e.readingState,
          isReaderMode: e.isReaderMode,
          hasCard: !!e.currentCard.uid,
          progress: e.progress
        };
      },
      supportedCardTypes: function supportedCardTypes(e) {
        return e.supportedTypes[e.currentMode] || [];
      },
      identifyHFCardType: function identifyHFCardType() {
        return function (_ref20) {
          var e = _ref20.sak,
            s = _ref20.ats;
          return 24 == (24 & e) ? "mifare_classic" : 0 == (0 & e) ? "mifare_ultralight" : s && s.length > 0 ? "ntag" : "iso14443a";
        };
      },
      readingStatistics: function readingStatistics(e) {
        var s = e.statistics.totalReads;
        return _objectSpread2(_objectSpread2({}, e.statistics), {}, {
          successRate: s > 0 ? Math.round(e.statistics.successfulReads / s * 100) : 0
        });
      },
      recentReads: function recentReads(e) {
        return e.readHistory.slice(0, 10);
      },
      canStartReading: function canStartReading(e, s, r) {
        return r.device.isConnected && e.isReaderMode && (e.readingState === t || e.readingState === n || e.readingState === l);
      },
      isMifareClassicType: function isMifareClassicType() {
        return function (e) {
          if (!e) return !1;
          var s = e.toLowerCase();
          return s.includes("mifare_classic") || "mifare_classic" === s || "mifare_classic_1k" === s || "mifare_classic_2k" === s || "mifare_classic_4k" === s || "mifare_classic_mini" === s;
        };
      },
      isMifareUltralightType: function isMifareUltralightType() {
        return function (e) {
          if (!e) return !1;
          var s = e.toLowerCase();
          return s.includes("mifare_ultralight") || "mifare_ultralight" === s || "ntag" === s;
        };
      },
      formatCardTypeName: function formatCardTypeName() {
        return function (e) {
          if (!e) return "未知类型";
          return {
            mifare_classic_1k: "Mifare Classic 1K",
            mifare_classic_2k: "Mifare Classic 2K",
            mifare_classic_4k: "Mifare Classic 4K",
            mifare_classic_mini: "Mifare Classic Mini",
            mifare_classic: "Mifare Classic",
            mifare_ultralight: "Mifare Ultralight",
            ntag_213: "NTAG213",
            ntag_215: "NTAG215",
            ntag_216: "NTAG216",
            ntag: "NTAG",
            em410x: "EM410X",
            iso14443a: "ISO14443A",
            iso14443b: "ISO14443B",
            iso15693: "ISO15693"
          }[e.toLowerCase()] || e || "未知类型";
        };
      }
    }
  };exports.reader = d;