var _typeof2 = require("../@babel/runtime/helpers/typeof");var _createForOfIteratorHelper2 = require("../@babel/runtime/helpers/createForOfIteratorHelper");var _objectSpread2 = require("../@babel/runtime/helpers/objectSpread2");var _inherits2 = require("../@babel/runtime/helpers/inherits");var _createSuper2 = require("../@babel/runtime/helpers/createSuper");require("../@babel/runtime/helpers/Arrayincludes");var _classCallCheck2 = require("../@babel/runtime/helpers/classCallCheck");var _createClass2 = require("../@babel/runtime/helpers/createClass");var t,
  e = Object.defineProperty;var r = /*#__PURE__*/function () {
  function r() {
    var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck2(this, r);
    this.id = t.id || null, this.name = t.name || "", this.type = t.type || "other", this.data = t.data || {}, this.tags = t.tags || [], this.description = t.description || "", this.color = t.color || "#007AFF", this.favorite = t.favorite || !1, this.createdAt = t.createdAt || new Date().toISOString(), this.modifiedAt = t.modifiedAt || new Date().toISOString();
  }
  _createClass2(r, [{
    key: "validate",
    value: function validate() {
      var t = [];
      return this.name && 0 !== this.name.trim().length || t.push("卡片名称不能为空"), this.name.length > 50 && t.push("卡片名称不能超过50个字符"), this.isValidType() || t.push("无效的卡片类型"), {
        isValid: 0 === t.length,
        errors: t
      };
    }
  }, {
    key: "isValidType",
    value: function isValidType() {
      return ["mifare_classic", "mifare_ultralight", "em410x", "t55xx", "ntag", "other"].includes(this.type);
    }
  }, {
    key: "getSize",
    value: function getSize() {
      return JSON.stringify(this.data).length;
    }
  }, {
    key: "clone",
    value: function clone() {
      return new r(JSON.parse(JSON.stringify(this)));
    }
  }, {
    key: "toObject",
    value: function toObject() {
      return {
        id: this.id,
        name: this.name,
        type: this.type,
        data: this.data,
        tags: this.tags,
        description: this.description,
        color: this.color,
        favorite: this.favorite,
        createdAt: this.createdAt,
        modifiedAt: this.modifiedAt
      };
    }
  }]);
  return r;
}();var i = /*#__PURE__*/function (_r) {
  _inherits2(i, _r);
  var _super = _createSuper2(i);
  function i() {
    var _this;
    var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck2(this, i);
    _this = _super.call(this, t), _this.type = "mifare_classic", _this.sectors = t.sectors || [], _this.keys = t.keys || {
      keyA: [],
      keyB: []
    }, _this.accessBits = t.accessBits || [], _this.uid = t.uid || "", _this.sak = t.sak || "", _this.atqa = t.atqa || "";
    return _this;
  }
  _createClass2(i, [{
    key: "validateUID",
    value: function validateUID() {
      if (!this.uid) return {
        isValid: !1,
        error: "UID不能为空"
      };
      return /^[0-9A-Fa-f\s]{8,20}$/.test(this.uid.replace(/\s/g, "")) ? {
        isValid: !0
      } : {
        isValid: !1,
        error: "UID格式无效，应为4-10字节的十六进制数据"
      };
    }
  }, {
    key: "formatUID",
    value: function formatUID() {
      var t;
      if (!this.uid) return "";
      var e = this.uid.replace(/\s/g, "").toUpperCase();
      return (null == (t = e.match(/.{2}/g)) ? void 0 : t.join(" ")) || e;
    }
  }, {
    key: "getSectorCount",
    value: function getSectorCount() {
      return this.sectors.length;
    }
  }, {
    key: "getBlockCount",
    value: function getBlockCount() {
      return 4 * this.sectors.length;
    }
  }, {
    key: "hasCompleteKeys",
    value: function hasCompleteKeys() {
      var _this2 = this;
      return this.sectors.every(function (t, e) {
        return _this2.keys.keyA[e] && _this2.keys.keyB[e];
      });
    }
  }]);
  return i;
}(r);var a = /*#__PURE__*/function (_r2) {
  _inherits2(a, _r2);
  var _super2 = _createSuper2(a);
  function a() {
    var _this3;
    var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck2(this, a);
    _this3 = _super2.call(this, t), _this3.type = "mifare_ultralight", _this3.pages = t.pages || [], _this3.uid = t.uid || "", _this3.version = t.version || "", _this3.signature = t.signature || "", _this3.counter = t.counter || 0;
    return _this3;
  }
  _createClass2(a, [{
    key: "getPageCount",
    value: function getPageCount() {
      return this.pages.length;
    }
  }, {
    key: "getUserDataPages",
    value: function getUserDataPages() {
      return this.pages.slice(4, 16);
    }
  }, {
    key: "isNTAG",
    value: function isNTAG() {
      return this.version && this.version.includes("NTAG");
    }
  }]);
  return a;
}(r);var s = /*#__PURE__*/function (_r3) {
  _inherits2(s, _r3);
  var _super3 = _createSuper2(s);
  function s() {
    var _this4;
    var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck2(this, s);
    _this4 = _super3.call(this, t), _this4.type = "em410x", _this4.uid = t.uid || "", _this4.rawData = t.rawData || "";
    return _this4;
  }
  _createClass2(s, [{
    key: "validateUID",
    value: function validateUID() {
      if (!this.uid) return {
        isValid: !1,
        error: "UID不能为空"
      };
      return /^[0-9A-Fa-f]{10}$/.test(this.uid.replace(/\s/g, "")) ? {
        isValid: !0
      } : {
        isValid: !1,
        error: "EM410X UID应为5字节的十六进制数据"
      };
    }
  }, {
    key: "formatUID",
    value: function formatUID() {
      var t;
      if (!this.uid) return "";
      var e = this.uid.replace(/\s/g, "").toUpperCase();
      return (null == (t = e.match(/.{2}/g)) ? void 0 : t.join(" ")) || e;
    }
  }]);
  return s;
}(r);var n = /*#__PURE__*/function () {
  function n() {
    _classCallCheck2(this, n);
  }
  _createClass2(n, null, [{
    key: "getTypeInfo",
    value: function getTypeInfo(t) {
      return this.typeMap[t] || this.typeMap.other;
    }
  }, {
    key: "createCard",
    value: function createCard(t) {
      var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      switch (t) {
        case "mifare_classic":
          return new i(e);
        case "mifare_ultralight":
          return new a(e);
        case "em410x":
          return new s(e);
        default:
          return new r(_objectSpread2(_objectSpread2({}, e), {}, {
            type: t
          }));
      }
    }
  }, {
    key: "fromRawData",
    value: function fromRawData(t, e) {
      var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var i = this.createCard(t, r);
      switch (t) {
        case "mifare_classic":
          this.parseMifareClassicData(i, e);
          break;
        case "mifare_ultralight":
          this.parseMifareUltralightData(i, e);
          break;
        case "em410x":
          this.parseEM410XData(i, e);
          break;
        default:
          i.data = {
            raw: e
          };
      }
      return i;
    }
  }, {
    key: "parseMifareClassicData",
    value: function parseMifareClassicData(t, e) {
      e.sectors && (t.sectors = e.sectors), e.keys && (t.keys = e.keys), e.uid && (t.uid = e.uid), t.data = e;
    }
  }, {
    key: "parseMifareUltralightData",
    value: function parseMifareUltralightData(t, e) {
      e.pages && (t.pages = e.pages), e.uid && (t.uid = e.uid), t.data = e;
    }
  }, {
    key: "parseEM410XData",
    value: function parseEM410XData(t, e) {
      "string" == typeof e ? (t.uid = e, t.rawData = e) : e.uid && (t.uid = e.uid, t.rawData = e.raw || e.uid), t.data = {
        uid: t.uid,
        raw: t.rawData
      };
    }
  }, {
    key: "validateCardData",
    value: function validateCardData(t) {
      return t instanceof r ? t.validate() : {
        isValid: !1,
        errors: ["无效的卡片数据对象"]
      };
    }
  }, {
    key: "formatSize",
    value: function formatSize(t) {
      return t < 1024 ? "".concat(t, " B") : t < 1048576 ? "".concat((t / 1024).toFixed(1), " KB") : "".concat((t / 1048576).toFixed(1), " MB");
    }
  }, {
    key: "generatePreview",
    value: function generatePreview(t) {
      var e = "\u7C7B\u578B: ".concat(this.getTypeInfo(t.type).name);
      t.uid && (e += "\nUID: ".concat(t.uid)), t.description && (e += "\n\u63CF\u8FF0: ".concat(t.description));
      var r = t.getSize();
      return e += "\n\u5927\u5C0F: ".concat(this.formatSize(r)), e;
    }
  }, {
    key: "exportCard",
    value: function exportCard(t) {
      var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "json";
      switch (e.toLowerCase()) {
        case "json":
          return JSON.stringify(t.toObject(), null, 2);
        case "bin":
          return this.exportBinaryData(t);
        case "dump":
          return this.exportDumpFormat(t);
        default:
          throw new Error("\u4E0D\u652F\u6301\u7684\u5BFC\u51FA\u683C\u5F0F: ".concat(e));
      }
    }
  }, {
    key: "exportBinaryData",
    value: function exportBinaryData(t) {
      switch (t.type) {
        case "mifare_classic":
          return this.exportMifareClassicBinary(t);
        case "mifare_ultralight":
          return this.exportMifareUltralightBinary(t);
        default:
          return JSON.stringify(t.data);
      }
    }
  }, {
    key: "exportDumpFormat",
    value: function exportDumpFormat(t) {
      var e = "# Chameleon Card Dump\n";
      switch (e += "# Name: ".concat(t.name, "\n"), e += "# Type: ".concat(t.type, "\n"), e += "# Created: ".concat(t.createdAt, "\n"), e += "# Modified: ".concat(t.modifiedAt, "\n"), e += "\n", t.type) {
        case "mifare_classic":
          e += this.exportMifareClassicDump(t);
          break;
        case "mifare_ultralight":
          e += this.exportMifareUltralightDump(t);
          break;
        default:
          e += JSON.stringify(t.data, null, 2);
      }
      return e;
    }
  }, {
    key: "importCard",
    value: function importCard(t) {
      var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "json";
      switch (e.toLowerCase()) {
        case "json":
          return this.importJsonData(t);
        case "dump":
          return this.importDumpData(t);
        default:
          throw new Error("\u4E0D\u652F\u6301\u7684\u5BFC\u5165\u683C\u5F0F: ".concat(e));
      }
    }
  }, {
    key: "importJsonData",
    value: function importJsonData(t) {
      try {
        var _e = "string" == typeof t ? JSON.parse(t) : t;
        return this.createCard(_e.type || "other", _e);
      } catch (e) {
        throw new Error("JSON\u6570\u636E\u89E3\u6790\u5931\u8D25: ".concat(e.message));
      }
    }
  }, {
    key: "importDumpData",
    value: function importDumpData(t) {
      var e = t.split("\n"),
        r = {};
      var i = [];
      var _iterator = _createForOfIteratorHelper2(e),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _s = _step.value;
          _s.startsWith("# Name:") ? r.name = _s.substring(7).trim() : _s.startsWith("# Type:") ? r.type = _s.substring(7).trim() : !_s.startsWith("#") && _s.trim() && i.push(_s.trim());
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var a = this.createCard(r.type || "other", r);
      if (i.length > 0) try {
        var _t = JSON.parse(i.join("\n"));
        Object.assign(a.data, _t);
      } catch (_unused) {
        a.data = {
          raw: i.join("\n")
        };
      }
      return a;
    }
  }, {
    key: "exportMifareClassicBinary",
    value: function exportMifareClassicBinary(t) {
      var e = "";
      return t.sectors && t.sectors.length > 0 && t.sectors.forEach(function (t) {
        e += t.join("");
      }), e;
    }
  }, {
    key: "exportMifareUltralightBinary",
    value: function exportMifareUltralightBinary(t) {
      var e = "";
      return t.pages && t.pages.length > 0 && (e = t.pages.join("")), e;
    }
  }, {
    key: "exportMifareClassicDump",
    value: function exportMifareClassicDump(t) {
      var e = "UID: ".concat(t.uid || "Unknown", "\n");
      return e += "SAK: ".concat(t.sak || "Unknown", "\n"), e += "ATQA: ".concat(t.atqa || "Unknown", "\n\n"), t.sectors && t.sectors.length > 0 && t.sectors.forEach(function (t, r) {
        e += "Sector ".concat(r, ":\n"), t.forEach(function (t, i) {
          e += "Block ".concat(4 * r + i, ": ").concat(t, "\n");
        }), e += "\n";
      }), e;
    }
  }, {
    key: "exportMifareUltralightDump",
    value: function exportMifareUltralightDump(t) {
      var e = "UID: ".concat(t.uid || "Unknown", "\n");
      return e += "Version: ".concat(t.version || "Unknown", "\n\n"), t.pages && t.pages.length > 0 && t.pages.forEach(function (t, r) {
        e += "Page ".concat(r.toString().padStart(2, "0"), ": ").concat(t, "\n");
      }), e;
    }
  }]);
  return n;
}();(function (t, r, i) {
  r in t ? e(t, r, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: i
  }) : t[r] = i;
})(n, "symbol" != _typeof2(t = "typeMap") ? t + "" : t, {
  mifare_classic: {
    name: "Mifare Classic",
    icon: "creditcard",
    color: "#FF6B35",
    description: "ISO14443-A，支持1K/4K/8K容量"
  },
  mifare_ultralight: {
    name: "Mifare Ultralight",
    icon: "tag",
    color: "#4ECDC4",
    description: "ISO14443-A，小容量标签"
  },
  em410x: {
    name: "EM410X",
    icon: "key",
    color: "#45B7D1",
    description: "125KHz 只读标签"
  },
  t55xx: {
    name: "T55XX",
    icon: "shield",
    color: "#96CEB4",
    description: "125KHz 可写标签"
  },
  ntag: {
    name: "NTAG",
    icon: "chip",
    color: "#FFEAA7",
    description: "NFC论坛类型2标签"
  },
  other: {
    name: "其他",
    icon: "dots",
    color: "#DDA0DD",
    description: "其他类型卡片"
  }
}), exports.CardDataUtils = n;