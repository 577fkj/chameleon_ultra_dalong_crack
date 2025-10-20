require("../@babel/runtime/helpers/Arrayincludes");var _defineProperty2 = require("../@babel/runtime/helpers/defineProperty");var _createForOfIteratorHelper2 = require("../@babel/runtime/helpers/createForOfIteratorHelper");var _toConsumableArray2 = require("../@babel/runtime/helpers/toConsumableArray");var _classCallCheck2 = require("../@babel/runtime/helpers/classCallCheck");var _createClass2 = require("../@babel/runtime/helpers/createClass");var _typeof2 = require("../@babel/runtime/helpers/typeof");var _ = Object.defineProperty,
  t = function t(_t, E, e) {
    return function (t, E, e) {
      E in t ? _(t, E, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e
      }) : t[E] = e;
    }(_t, "symbol" != _typeof2(E) ? E + "" : E, e), e;
  };var E = {
    UNKNOWN: 0,
    EM410X: 100,
    EM410X16: 101,
    EM410X32: 102,
    EM410X64: 103,
    VIKING: 170,
    HID_PROX: 200,
    MIFARE_Mini: 1e3,
    MIFARE_1024: 1001,
    MIFARE_2048: 1002,
    MIFARE_4096: 1003,
    NTAG_210: 1107,
    NTAG_212: 1108,
    NTAG_213: 1100,
    NTAG_215: 1101,
    NTAG_216: 1102,
    MIFARE_Ultralight: 1103,
    MIFARE_Ultralight_C: 1104,
    MIFARE_Ultralight_EV1_11: 1105,
    MIFARE_Ultralight_EV1_21: 1106
  },
  e = {
    TAG: 0,
    READER: 1
  },
  T = 0,
  r = 1,
  A = 0,
  a = 1,
  s = 2,
  S = {
    A: 65,
    B: 66
  },
  i = 0,
  I = 1,
  n = 2,
  o = 3,
  C = 4,
  l = 5,
  c = 0,
  F = 1,
  M = 2,
  N = 3,
  R = 4,
  L = 5,
  O = 6,
  u = {
    STATUS_HF_TAG_OK: 0,
    STATUS_HF_TAG_NO: 1,
    STATUS_HF_ERR_STAT: 2,
    STATUS_HF_ERR_CRC: 3,
    STATUS_HF_COLLISION: 4,
    STATUS_HF_ERR_BCC: 5,
    STATUS_MF_ERR_AUTH: 6,
    STATUS_HF_ERR_PARITY: 7,
    STATUS_HF_ERR_ATS: 8,
    STATUS_LF_TAG_OK: 64,
    STATUS_EM410X_TAG_NO_FOUND: 65,
    STATUS_PAR_ERR: 96,
    STATUS_DEVICE_MODE_ERROR: 102,
    STATUS_INVALID_CMD: 103,
    STATUS_SUCCESS: 104,
    STATUS_NOT_IMPLEMENTED: 105,
    STATUS_FLASH_WRITE_FAIL: 112,
    STATUS_FLASH_READ_FAIL: 113,
    STATUS_INVALID_SLOT_TYPE: 114
  };var U = /*#__PURE__*/function () {
  function U() {
    _classCallCheck2(this, U);
  }
  _createClass2(U, null, [{
    key: "createCommand",
    value: function createCommand(_) {
      var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var E = t ? new Uint8Array(t) : new Uint8Array(0),
        e = [];
      e.push(this.DATA_FRAME_SOF), e.push(this.lrcCalc([this.DATA_FRAME_SOF]));
      var T = this.fromInt16BE(_);
      e.push.apply(e, _toConsumableArray2(T));
      var r = this.fromInt16BE(0);
      e.push.apply(e, _toConsumableArray2(r));
      var A = this.fromInt16BE(E.length);
      e.push.apply(e, _toConsumableArray2(A));
      var a = this.lrcCalc(e.slice(2, 8));
      e.push(a), E.length > 0 && e.push.apply(e, _toConsumableArray2(E));
      var s = this.lrcCalc(e);
      return e.push(s), new Uint8Array(e);
    }
  }, {
    key: "parseResponse",
    value: function parseResponse(_) {
      if (!_ || _.byteLength < this.MIN_PACKET_LENGTH) return console.warn("[Protocol] 接收到的数据包过短或无效，无法解析"), {
        success: !1,
        command: null,
        status: null,
        data: null,
        error: "Invalid or short packet"
      };
      try {
        var _t2 = new Uint8Array(_);
        if (console.log("[Protocol] 解析响应数据，长度:", _t2.length, "数据:", Array.from(_t2).map(function (_) {
          return _.toString(16).padStart(2, "0");
        }).join(" ")), _t2.length < 9) throw new Error("响应数据太短");
        if (_t2[0] !== this.DATA_FRAME_SOF) throw new Error("无效的帧起始标记");
        if (_t2[1] !== this.lrcCalc([_t2[0]])) throw new Error("SOF校验失败");
        var _E = this.toInt16BE(_t2.slice(2, 4)),
          _e = this.toInt16BE(_t2.slice(4, 6)),
          _T = this.toInt16BE(_t2.slice(6, 8));
        console.log("[Protocol] 帧头解析 - 命令:", _E, "状态:", _e, "长度:", _T);
        var _r = this.lrcCalc(Array.from(_t2.slice(2, 8)));
        if (_t2[8] !== _r) throw new Error("帧头校验失败");
        if (_T > this.DATA_MAX_LENGTH) throw new Error("数据长度超出限制");
        if (_t2.length !== 9 + _T + 1) throw new Error("帧长度不匹配");
        var _A = this.lrcCalc(Array.from(_t2.slice(0, -1)));
        if (_t2[_t2.length - 1] !== _A) throw new Error("整帧校验失败");
        var _a = _T > 0 ? _t2.slice(9, 9 + _T) : new Uint8Array(0);
        console.log("[Protocol] 提取数据，预期长度:", _T, "实际数据:", Array.from(_a));
        var _s = this.isCommandSuccess(_E, _e),
          _S = {
            success: _s,
            command: _E,
            status: _e,
            data: _a,
            error: _s ? null : "\u547D\u4EE4\u6267\u884C\u5931\u8D25\uFF0C\u72B6\u6001\u7801: ".concat(_e, " (0x").concat(_e.toString(16).padStart(2, "0").toUpperCase(), ") - ").concat(this.getStatusMessage(_e))
          };
        return console.log("[Protocol] 解析结果:", _S), _S;
      } catch (t) {
        return {
          success: !1,
          command: 0,
          status: -1,
          data: new Uint8Array(0),
          error: "响应数据解析失败: " + t.message
        };
      }
    }
  }, {
    key: "lrcCalc",
    value: function lrcCalc(_) {
      var t = 0;
      var _iterator = _createForOfIteratorHelper2(_),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _E2 = _step.value;
          t += _E2, t &= 255;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return 256 - t & 255;
    }
  }, {
    key: "fromInt16BE",
    value: function fromInt16BE(_) {
      return [_ >> 8 & 255, 255 & _];
    }
  }, {
    key: "toInt16BE",
    value: function toInt16BE(_) {
      return _[0] << 8 | _[1];
    }
  }, {
    key: "formatUID",
    value: function formatUID(_) {
      var t;
      return _ ? Array.isArray(_) ? _.map(function (_) {
        return _.toString(16).padStart(2, "0");
      }).join(" ").toUpperCase() : "string" == typeof _ ? (null == (t = _.replace(/[^0-9a-fA-F]/g, "").match(/.{2}/g)) ? void 0 : t.join(" ").toUpperCase()) || "" : _.toString() : "";
    }
  }, {
    key: "parseUID",
    value: function parseUID(_) {
      if (!_) return [];
      var t = _.replace(/[^0-9a-fA-F]/g, ""),
        E = [];
      for (var _e2 = 0; _e2 < t.length; _e2 += 2) {
        var _2 = parseInt(t.substr(_e2, 2), 16);
        isNaN(_2) || E.push(_2);
      }
      return E;
    }
  }, {
    key: "isCommandSuccess",
    value: function isCommandSuccess(_, t) {
      return _ >= 2e3 && _ <= 2099 ? t === u.STATUS_HF_TAG_OK : _ >= 3e3 && _ <= 3099 ? t === u.STATUS_LF_TAG_OK : t === u.STATUS_SUCCESS;
    }
  }, {
    key: "getStatusMessage",
    value: function getStatusMessage(_) {
      var _u$STATUS_HF_TAG_OK$u;
      return (_u$STATUS_HF_TAG_OK$u = {}, _defineProperty2(_u$STATUS_HF_TAG_OK$u, u.STATUS_HF_TAG_OK, "IC卡操作成功"), _defineProperty2(_u$STATUS_HF_TAG_OK$u, u.STATUS_HF_TAG_NO, "未找到IC卡 - 请确保卡片放置正确"), _defineProperty2(_u$STATUS_HF_TAG_OK$u, u.STATUS_HF_ERR_STAT, "IC卡通信错误"), _defineProperty2(_u$STATUS_HF_TAG_OK$u, u.STATUS_HF_ERR_CRC, "IC卡通信校验错误"), _defineProperty2(_u$STATUS_HF_TAG_OK$u, u.STATUS_HF_COLLISION, "IC卡冲突 - 检测到多张卡片"), _defineProperty2(_u$STATUS_HF_TAG_OK$u, u.STATUS_HF_ERR_BCC, "IC卡BCC错误"), _defineProperty2(_u$STATUS_HF_TAG_OK$u, u.STATUS_MF_ERR_AUTH, "MF卡验证失败 - 密钥错误"), _defineProperty2(_u$STATUS_HF_TAG_OK$u, u.STATUS_HF_ERR_PARITY, "IC卡奇偶校验错误"), _defineProperty2(_u$STATUS_HF_TAG_OK$u, u.STATUS_HF_ERR_ATS, "ATS错误"), _defineProperty2(_u$STATUS_HF_TAG_OK$u, u.STATUS_LF_TAG_OK, "低频卡操作成功"), _defineProperty2(_u$STATUS_HF_TAG_OK$u, u.STATUS_EM410X_TAG_NO_FOUND, "找不到有效的EM410X标签"), _defineProperty2(_u$STATUS_HF_TAG_OK$u, u.STATUS_SUCCESS, "设备操作成功"), _defineProperty2(_u$STATUS_HF_TAG_OK$u, u.STATUS_PAR_ERR, "参数错误"), _defineProperty2(_u$STATUS_HF_TAG_OK$u, u.STATUS_DEVICE_MODE_ERROR, "设备模式错误"), _defineProperty2(_u$STATUS_HF_TAG_OK$u, u.STATUS_INVALID_CMD, "无效指令"), _defineProperty2(_u$STATUS_HF_TAG_OK$u, u.STATUS_NOT_IMPLEMENTED, "未实现的操作"), _defineProperty2(_u$STATUS_HF_TAG_OK$u, u.STATUS_FLASH_WRITE_FAIL, "Flash写入失败"), _defineProperty2(_u$STATUS_HF_TAG_OK$u, u.STATUS_FLASH_READ_FAIL, "Flash读取失败"), _defineProperty2(_u$STATUS_HF_TAG_OK$u, u.STATUS_INVALID_SLOT_TYPE, "无效卡槽类型"), _u$STATUS_HF_TAG_OK$u)[_] || "未知错误";
    }
  }, {
    key: "getTagTypeName",
    value: function getTagTypeName(_) {
      var _E$UNKNOWN$E$EM410X$E;
      if ("string" == typeof _) {
        return {
          UNKNOWN: "未知",
          EM410X: "EM410X",
          MIFARE_Mini: "Mifare Mini",
          MIFARE_1024: "Mifare Classic 1K",
          MIFARE_2048: "Mifare Classic 2K",
          MIFARE_4096: "Mifare Classic 4K",
          NTAG_213: "NTAG213",
          NTAG_215: "NTAG215",
          NTAG_216: "NTAG216",
          MIFARE_Ultralight: "Mifare Ultralight",
          MIFARE_Ultralight_C: "Mifare Ultralight C",
          MIFARE_Ultralight_EV1_80B: "Ultralight EV1 (80B)",
          MIFARE_Ultralight_EV1_164B: "Ultralight EV1 (164B)"
        }[_] || "未知";
      }
      return (_E$UNKNOWN$E$EM410X$E = {}, _defineProperty2(_E$UNKNOWN$E$EM410X$E, E.UNKNOWN, "未知"), _defineProperty2(_E$UNKNOWN$E$EM410X$E, E.EM410X, "EM410X"), _defineProperty2(_E$UNKNOWN$E$EM410X$E, E.MIFARE_Mini, "MIFARE Mini"), _defineProperty2(_E$UNKNOWN$E$EM410X$E, E.MIFARE_1024, "MIFARE Classic 1K"), _defineProperty2(_E$UNKNOWN$E$EM410X$E, E.MIFARE_2048, "MIFARE Classic 2K"), _defineProperty2(_E$UNKNOWN$E$EM410X$E, E.MIFARE_4096, "MIFARE Classic 4K"), _defineProperty2(_E$UNKNOWN$E$EM410X$E, E.NTAG_213, "NTAG213"), _defineProperty2(_E$UNKNOWN$E$EM410X$E, E.NTAG_215, "NTAG215"), _defineProperty2(_E$UNKNOWN$E$EM410X$E, E.NTAG_216, "NTAG216"), _defineProperty2(_E$UNKNOWN$E$EM410X$E, E.MIFARE_Ultralight, "MIFARE Ultralight"), _defineProperty2(_E$UNKNOWN$E$EM410X$E, E.MIFARE_Ultralight_C, "MIFARE Ultralight C"), _defineProperty2(_E$UNKNOWN$E$EM410X$E, E.MIFARE_Ultralight_EV1_80B, "MIFARE Ultralight EV1 (80B)"), _defineProperty2(_E$UNKNOWN$E$EM410X$E, E.MIFARE_Ultralight_EV1_164B, "MIFARE Ultralight EV1 (164B)"), _E$UNKNOWN$E$EM410X$E)[_] || "未知类型";
    }
  }, {
    key: "getDeviceModeName",
    value: function getDeviceModeName(_) {
      var _e$TAG$e$READER$_;
      return (_e$TAG$e$READER$_ = {}, _defineProperty2(_e$TAG$e$READER$_, e.TAG, "标签模式"), _defineProperty2(_e$TAG$e$READER$_, e.READER, "读卡器模式"), _e$TAG$e$READER$_)[_] || "未知模式";
    }
  }, {
    key: "getDeviceModelName",
    value: function getDeviceModelName(_) {
      var _T$r$_;
      return (_T$r$_ = {}, _defineProperty2(_T$r$_, T, "Chameleon Ultra"), _defineProperty2(_T$r$_, r, "Chameleon Lite"), _T$r$_)[_] || "未知型号";
    }
  }, {
    key: "getButtonFunctionName",
    value: function getButtonFunctionName(_) {
      var _c$F$M$N$R$L$O$_;
      return (_c$F$M$N$R$L$O$_ = {}, _defineProperty2(_c$F$M$N$R$L$O$_, c, "禁用"), _defineProperty2(_c$F$M$N$R$L$O$_, F, "随机UID"), _defineProperty2(_c$F$M$N$R$L$O$_, M, "UID左递增"), _defineProperty2(_c$F$M$N$R$L$O$_, N, "UID右递增"), _defineProperty2(_c$F$M$N$R$L$O$_, R, "卡槽递增"), _defineProperty2(_c$F$M$N$R$L$O$_, L, "卡槽递减"), _defineProperty2(_c$F$M$N$R$L$O$_, O, "克隆UID"), _c$F$M$N$R$L$O$_)[_] || "未知功能";
    }
  }, {
    key: "isValidSlot",
    value: function isValidSlot(_) {
      return Number.isInteger(_) && _ >= 0 && _ < 16;
    }
  }, {
    key: "isValidUID",
    value: function isValidUID(_) {
      if (!_) return !1;
      var t = _.replace(/[^0-9a-fA-F]/g, "");
      return t.length >= 8 && t.length <= 20 && t.length % 2 == 0;
    }
  }, {
    key: "calculateChecksum",
    value: function calculateChecksum(_) {
      return Array.isArray(_) ? _.reduce(function (_, t) {
        return _ + t & 255;
      }, 0) : 0;
    }
  }, {
    key: "generateRandomUID",
    value: function generateRandomUID() {
      var _ = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;
      var t = [];
      for (var _E3 = 0; _E3 < _; _E3++) t.push(Math.floor(256 * Math.random()));
      return t;
    }
  }, {
    key: "getAnimationSettingName",
    value: function getAnimationSettingName(_) {
      var _A$a$s$_;
      return (_A$a$s$_ = {}, _defineProperty2(_A$a$s$_, A, "完整动画"), _defineProperty2(_A$a$s$_, a, "最小动画"), _defineProperty2(_A$a$s$_, s, "无动画"), _A$a$s$_)[_] || "未知";
    }
  }, {
    key: "getButtonConfigName",
    value: function getButtonConfigName(_) {
      var _i$I$n$o$C$l$_;
      return (_i$I$n$o$C$l$_ = {}, _defineProperty2(_i$I$n$o$C$l$_, i, "禁用"), _defineProperty2(_i$I$n$o$C$l$_, I, "向前切换"), _defineProperty2(_i$I$n$o$C$l$_, n, "向后切换"), _defineProperty2(_i$I$n$o$C$l$_, o, "克隆UID"), _defineProperty2(_i$I$n$o$C$l$_, C, "充电状态"), _defineProperty2(_i$I$n$o$C$l$_, l, "自动轮询"), _i$I$n$o$C$l$_)[_] || "未知";
    }
  }, {
    key: "getButtonTypeName",
    value: function getButtonTypeName(_) {
      var _S$A$S$B$_;
      return (_S$A$S$B$_ = {}, _defineProperty2(_S$A$S$B$_, S.A, "按钮A"), _defineProperty2(_S$A$S$B$_, S.B, "按钮B"), _S$A$S$B$_)[_] || "未知按钮";
    }
  }, {
    key: "getAnimationOptions",
    value: function getAnimationOptions() {
      return [{
        value: A,
        label: "完整动画",
        desc: "播放完整的LED动画效果"
      }, {
        value: a,
        label: "最小动画",
        desc: "播放简化的LED动画效果"
      }, {
        value: s,
        label: "无动画",
        desc: "不播放任何LED动画"
      }];
    }
  }, {
    key: "getButtonConfigOptions",
    value: function getButtonConfigOptions() {
      return [{
        value: i,
        label: "禁用",
        desc: "按钮无功能"
      }, {
        value: I,
        label: "向前切换",
        desc: "向前切换到下一个卡槽"
      }, {
        value: n,
        label: "向后切换",
        desc: "向后切换到上一个卡槽"
      }, {
        value: o,
        label: "克隆UID",
        desc: "克隆当前检测到的卡片UID"
      }, {
        value: C,
        label: "充电状态",
        desc: "显示当前充电状态"
      }, {
        value: l,
        label: "自动轮询",
        desc: "自动循环切换卡槽"
      }];
    }
  }, {
    key: "formatCardNumber",
    value: function formatCardNumber(_, t) {
      if (!_) return "";
      var E = _.replace(/[^0-9A-Fa-f]/g, "");
      if (!E) return "";
      switch (t) {
        case "MIFARE_CLASSIC_1K":
        case "MIFARE_CLASSIC_4K":
        case "MIFARE_CLASSIC_2K":
        case "NTAG213":
        case "NTAG215":
        case "NTAG216":
        default:
          return E.replace(/(.{2})/g, "$1 ").trim().toUpperCase();
        case "EM410X":
          return 10 === E.length ? "".concat(E.substring(0, 5), "-").concat(E.substring(5)) : E.toUpperCase();
      }
    }
  }, {
    key: "extractICCardNumber",
    value: function extractICCardNumber(_) {
      if (!_) return "";
      var t = _.replace(/[^0-9A-Fa-f]/g, "");
      if (t.length < 8) return "";
      var E = t.substring(0, 8);
      try {
        var _3 = parseInt(E, 16);
        return "".concat(this.formatCardNumber(E, "IC"), " (").concat(_3, ")");
      } catch (e) {
        return this.formatCardNumber(E, "IC");
      }
    }
  }, {
    key: "extractIDCardNumber",
    value: function extractIDCardNumber(_) {
      if (!_) return "";
      var t = _.replace(/[^0-9A-Fa-f]/g, "");
      if (t.length < 10) return "";
      var E = t.substring(0, 10);
      try {
        var _4 = parseInt(E, 16);
        return "".concat(this.formatCardNumber(E, "EM410X"), " (").concat(_4, ")");
      } catch (e) {
        return this.formatCardNumber(E, "EM410X");
      }
    }
  }, {
    key: "isMifareClassic",
    value: function isMifareClassic(_) {
      var t = [E.MIFARE_Mini, E.MIFARE_1024, E.MIFARE_2048, E.MIFARE_4096];
      return ["MIFARE_CLASSIC_1K", "MIFARE_CLASSIC_2K", "MIFARE_CLASSIC_4K", "MIFARE_CLASSIC_MINI", "MIFARE_1024", "MIFARE_2048", "MIFARE_4096", "MIFARE_Mini"].includes(_) || t.includes(_);
    }
  }, {
    key: "isLowFrequency",
    value: function isLowFrequency(_) {
      return ["EM410X", "T55XX", "EM4305", "FDX_B", "INDALA", "UNKNOWN_LF"].includes(_);
    }
  }, {
    key: "isHighFrequency",
    value: function isHighFrequency(_) {
      return !this.isLowFrequency(_) && "UNKNOWN" !== _;
    }
  }, {
    key: "getCardFrequency",
    value: function getCardFrequency(_) {
      return this.isLowFrequency(_) ? "LF" : this.isHighFrequency(_) ? "HF" : "UNKNOWN";
    }
  }, {
    key: "getWriteModeDisplayName",
    value: function getWriteModeDisplayName(_) {
      return {
        normal: "正常",
        denied: "拒绝",
        deceive: "欺骗",
        shadow: "影子"
      }[_] || "未知";
    }
  }, {
    key: "isValidTagType",
    value: function isValidTagType(_) {
      return _ && "UNKNOWN" !== _ && "UNKNOWN_HF" !== _ && "UNKNOWN_LF" !== _ && "" !== _.trim();
    }
  }, {
    key: "getCardCapacity",
    value: function getCardCapacity(_) {
      return {
        MIFARE_CLASSIC_1K: {
          size: 1024,
          unit: "bytes",
          blocks: 64
        },
        MIFARE_CLASSIC_2K: {
          size: 2048,
          unit: "bytes",
          blocks: 128
        },
        MIFARE_CLASSIC_4K: {
          size: 4096,
          unit: "bytes",
          blocks: 256
        },
        MIFARE_CLASSIC_MINI: {
          size: 320,
          unit: "bytes",
          blocks: 20
        },
        NTAG213: {
          size: 180,
          unit: "bytes",
          blocks: 45
        },
        NTAG215: {
          size: 540,
          unit: "bytes",
          blocks: 135
        },
        NTAG216: {
          size: 928,
          unit: "bytes",
          blocks: 232
        },
        EM410X: {
          size: 64,
          unit: "bits",
          blocks: 1
        }
      }[_] || {
        size: 0,
        unit: "bytes",
        blocks: 0
      };
    }
  }]);
  return U;
}();t(U, "DATA_FRAME_SOF", 17), t(U, "DATA_MAX_LENGTH", 512), t(U, "MIN_PACKET_LENGTH", 10), t(U, "MIFARE_WRITE_MODES", {
  NORMAL: "normal",
  DENIED: "denied",
  DECEIVE: "deceive",
  SHADOW: "shadow"
}), exports.ButtonType = S, exports.ChameleonCommand = {
  GET_APP_VERSION: 1e3,
  CHANGE_DEVICE_MODE: 1001,
  GET_DEVICE_MODE: 1002,
  SET_ACTIVE_SLOT: 1003,
  SET_SLOT_TAG_TYPE: 1004,
  SET_SLOT_DATA_DEFAULT: 1005,
  SET_SLOT_ENABLE: 1006,
  SET_SLOT_TAG_NICK: 1007,
  GET_SLOT_TAG_NICK: 1008,
  SAVE_SLOT_NICKS: 1009,
  ENTER_BOOTLOADER: 1010,
  GET_DEVICE_CHIP_ID: 1011,
  GET_DEVICE_BLE_ADDRESS: 1012,
  SAVE_SETTINGS: 1013,
  RESET_SETTINGS: 1014,
  SET_ANIMATION_MODE: 1015,
  GET_ANIMATION_MODE: 1016,
  GET_ACTIVE_SLOT: 1018,
  GET_SLOT_INFO: 1019,
  FACTORY_RESET: 1020,
  GET_ENABLED_SLOTS: 1023,
  DELETE_SLOT_INFO: 1024,
  GET_BATTERY_CHARGE: 1025,
  GET_BUTTON_PRESS_CONFIG: 1026,
  SET_BUTTON_PRESS_CONFIG: 1027,
  GET_LONG_BUTTON_PRESS_CONFIG: 1028,
  SET_LONG_BUTTON_PRESS_CONFIG: 1029,
  BLE_SET_CONNECT_KEY: 1030,
  BLE_GET_CONNECT_KEY: 1031,
  BLE_CLEAR_BONDED_DEVICES: 1032,
  GET_DEVICE_TYPE: 1033,
  GET_DEVICE_SETTINGS: 1034,
  GET_DEVICE_CAPABILITIES: 1035,
  BLE_GET_PAIR_ENABLE: 1036,
  BLE_SET_PAIR_ENABLE: 1037,
  GET_DEVICE_AUTO_POLLING: 6038,
  SET_DEVICE_AUTO_POLLING: 6039,
  GET_DEVICE_AUTO_POLLING_DELAY: 6040,
  SET_DEVICE_AUTO_POLLING_DELAY: 6041,
  GET_LICENSE_KEY: 6042,
  SET_LICENSE_KEY: 6043,
  SET_SECRET_KEY: 6044,
  GET_TRIAL_LEFT_TIMES: 6045,
  GET_IC_POLLING_ENABLED: 6046,
  SET_IC_POLLING_ENABLED: 6047,
  GET_ID_POLLING_ENABLED: 6048,
  SET_ID_POLLING_ENABLED: 6049,
  GET_GIT_VERSION: 6050,
  GET_CUSTOM_GIT_VERSION: 6050,
  GET_SLEEP_TIME: 6051,
  SET_SLEEP_TIME: 6052,
  SCAN_14A_TAG: 2e3,
  MF1_SUPPORT_DETECT: 2001,
  MF1_NT_LEVEL_DETECT: 2002,
  MF1_STATIC_NESTED_ACQUIRE: 2003,
  MF1_DARKSIDE_ACQUIRE: 2004,
  MF1_NT_DISTANCE_DETECT: 2005,
  MF1_NESTED_ACQUIRE: 2006,
  MF1_CHECK_KEY: 2007,
  MF1_READ_BLOCK: 2008,
  MF1_WRITE_BLOCK: 2009,
  HF14A_RAW: 2010,
  MF1_MANIPULATE_VALUE_BLOCK: 2011,
  MF1_CHECK_KEYS_OF_SECTORS: 2012,
  MF1_HARD_NESTED_ACQUIRE: 2013,
  MF1_STATIC_ENCRYPTED_NESTED_ACQUIRE: 2014,
  MF1_CHECK_KEYS_ON_BLOCK: 2015,
  MF0_GET_VERSION: 2016,
  MF0_GET_SIGNATURE: 2017,
  MF0_READ_PAGE: 2018,
  MF0_WRITE_PAGE: 2019,
  SCAN_EM410X_TAG: 3e3,
  WRITE_EM410X_TO_T5577: 3001,
  MF1_LOAD_BLOCK_DATA: 4e3,
  MF1_SET_ANTI_COLLISION: 4001,
  MF1_SET_DETECTION_ENABLE: 4004,
  MF1_GET_DETECTION_COUNT: 4005,
  MF1_GET_DETECTION_RESULT: 4006,
  MF1_GET_DETECTION_STATUS: 4007,
  MF1_GET_BLOCK_DATA: 4008,
  MF1_GET_EMULATOR_CONFIG: 4009,
  MF1_GET_GEN1A_MODE: 4010,
  MF1_SET_GEN1A_MODE: 4011,
  MF1_GET_GEN2_MODE: 4012,
  MF1_SET_GEN2_MODE: 4013,
  MF1_GET_FIRST_BLOCK_COLL: 4014,
  MF1_SET_FIRST_BLOCK_COLL: 4015,
  MF1_GET_WRITE_MODE: 4016,
  MF1_SET_WRITE_MODE: 4017,
  MF1_GET_ANTI_COLL_DATA: 4018,
  SET_EM410X_EMULATOR_ID: 5e3,
  GET_EM410X_EMULATOR_ID: 5001,
  GET_SLOT_POLLING_CONFIG_LIST: 6e3,
  SET_SLOT_POLLING_CONFIG_LIST: 6001,
  GET_COMPATIBLE_8_SLOTS: 6002,
  SET_COMPATIBLE_8_SLOTS: 6003
}, exports.ChameleonProtocol = U, exports.ChameleonStatus = u, exports.DeviceMode = e, exports.TagFrequency = {
  LF: 1,
  HF: 2
}, exports.TagType = E, exports.gMifareClassicKeyNames = ["Default Key (FFFFFF)", "NFC Forum MAD", "NDEF Public", "MFC EV1 Sig 17B", "MFC EV1 Sig 16A", "MFC EV1 Sig 16B", "MFC EV1 Sig 17A", "Public Transport", "SimonsVoss", "ID06", "Schlage", "Gallagher", "Saflok", "Dorma Kaba", "Bosch", "Vigik1 A", "Vigik1 B", "BTicino", "Intratone", "Vingcard", "All Zeros", "Test Key", "Common Key 1", "Common Key 2", "Common Key 3", "Common Key 4", "Common Key 5", "Common Key 6", "Common Key 7", "Common Key 8", "Incremental", "Decremental", "Repeat 1", "Repeat 2", "Repeat 3", "Repeat 4", "Repeat 5", "Repeat 6", "Repeat 7", "Repeat 8", "Repeat 9", "Repeat A", "Repeat B", "Repeat C", "Repeat D", "Repeat E"], exports.gMifareClassicKeys = [[255, 255, 255, 255, 255, 255], [160, 161, 162, 163, 164, 165], [211, 247, 211, 247, 211, 247], [75, 121, 27, 234, 123, 204], [92, 143, 249, 153, 13, 162], [208, 26, 254, 235, 137, 10], [117, 204, 181, 156, 155, 237], [252, 0, 1, 135, 120, 247], [100, 113, 165, 239, 45, 26], [78, 53, 82, 66, 107, 50], [239, 18, 50, 171, 24, 160], [183, 191, 12, 19, 6, 110], [19, 91, 136, 169, 75, 139], [42, 44, 19, 204, 36, 42], [90, 122, 82, 213, 226, 13], [49, 75, 73, 71, 73, 86], [86, 76, 80, 95, 77, 65], [2, 18, 9, 25, 117, 145], [72, 69, 88, 65, 67, 84], [236, 10, 155, 26, 158, 6], [0, 0, 0, 0, 0, 0], [176, 177, 178, 179, 180, 181], [77, 58, 153, 195, 81, 221], [26, 152, 44, 126, 69, 154], [170, 187, 204, 221, 238, 255], [113, 76, 92, 136, 110, 151], [88, 126, 229, 249, 53, 15], [160, 71, 140, 195, 144, 145], [83, 60, 182, 199, 35, 246], [143, 208, 164, 242, 86, 233], [18, 52, 86, 120, 154, 188], [254, 220, 186, 152, 118, 84], [17, 17, 17, 17, 17, 17], [34, 34, 34, 34, 34, 34], [51, 51, 51, 51, 51, 51], [68, 68, 68, 68, 68, 68], [85, 85, 85, 85, 85, 85], [102, 102, 102, 102, 102, 102], [119, 119, 119, 119, 119, 119], [136, 136, 136, 136, 136, 136], [153, 153, 153, 153, 153, 153], [170, 170, 170, 170, 170, 170], [187, 187, 187, 187, 187, 187], [204, 204, 204, 204, 204, 204], [221, 221, 221, 221, 221, 221], [238, 238, 238, 238, 238, 238]];