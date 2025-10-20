var _toConsumableArray2 = require("../@babel/runtime/helpers/toConsumableArray");var _objectSpread2 = require("../@babel/runtime/helpers/objectSpread2");var _createForOfIteratorHelper2 = require("../@babel/runtime/helpers/createForOfIteratorHelper");require("../@babel/runtime/helpers/Arrayincludes");var _defineProperty2 = require("../@babel/runtime/helpers/defineProperty");var _classCallCheck2 = require("../@babel/runtime/helpers/classCallCheck");var _createClass2 = require("../@babel/runtime/helpers/createClass");var t = require("./chameleon-protocol.js");var a = /*#__PURE__*/function () {
  function a() {
    var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck2(this, a);
    this.ultralightSignature = t.ultralightSignature || new Uint8Array(0), this.ultralightVersion = t.ultralightVersion || new Uint8Array(0);
  }
  _createClass2(a, [{
    key: "toObject",
    value: function toObject() {
      var t = {};
      return this.ultralightSignature.length > 0 && (t.ultralightSignature = Array.from(this.ultralightSignature)), this.ultralightVersion.length > 0 && (t.ultralightVersion = Array.from(this.ultralightVersion)), t;
    }
  }], [{
    key: "fromObject",
    value: function fromObject(t) {
      return new a({
        ultralightSignature: t.ultralightSignature ? new Uint8Array(t.ultralightSignature) : new Uint8Array(0),
        ultralightVersion: t.ultralightVersion ? new Uint8Array(t.ultralightVersion) : new Uint8Array(0)
      });
    }
  }]);
  return a;
}();var e = /*#__PURE__*/function () {
  function e() {
    var _e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck2(this, e);
    this.id = _e.id || this.generateId(), this.uid = _e.uid || "", this.name = _e.name || "", this.tag = _e.tag || t.TagType.UNKNOWN, this.sak = _e.sak || 0, this.atqa = _e.atqa || new Uint8Array(0), this.ats = _e.ats || new Uint8Array(0), this.data = _e.data || [], this.extraData = _e.extraData || new a(), this.color = _e.color || "#FF5722", this.createdAt = _e.createdAt || new Date().toISOString(), this.modifiedAt = _e.modifiedAt || new Date().toISOString();
  }
  _createClass2(e, [{
    key: "generateId",
    value: function generateId() {
      return "card_" + Date.now() + "_" + Math.random().toString(36).substring(2, 11);
    }
  }, {
    key: "toJson",
    value: function toJson() {
      return JSON.stringify(this.toObject(), null, 2);
    }
  }, {
    key: "toObject",
    value: function toObject() {
      return {
        id: this.id,
        uid: this.uid,
        name: this.name,
        tag: this.tag,
        sak: this.sak,
        atqa: Array.from(this.atqa),
        ats: Array.from(this.ats),
        data: this.data.map(function (t) {
          return Array.from(t);
        }),
        extraData: this.extraData.toObject(),
        color: this.color,
        createdAt: this.createdAt,
        modifiedAt: this.modifiedAt
      };
    }
  }, {
    key: "touch",
    value: function touch() {
      this.modifiedAt = new Date().toISOString();
    }
  }, {
    key: "getTypeString",
    value: function getTypeString() {
      var _t$TagType$UNKNOWN$t$;
      return (_t$TagType$UNKNOWN$t$ = {}, _defineProperty2(_t$TagType$UNKNOWN$t$, t.TagType.UNKNOWN, "未知"), _defineProperty2(_t$TagType$UNKNOWN$t$, t.TagType.EM410X, "EM410X"), _defineProperty2(_t$TagType$UNKNOWN$t$, t.TagType.MIFARE_Mini, "Mifare Mini"), _defineProperty2(_t$TagType$UNKNOWN$t$, t.TagType.MIFARE_1024, "Mifare Classic 1K"), _defineProperty2(_t$TagType$UNKNOWN$t$, t.TagType.MIFARE_2048, "Mifare Classic 2K"), _defineProperty2(_t$TagType$UNKNOWN$t$, t.TagType.MIFARE_4096, "Mifare Classic 4K"), _defineProperty2(_t$TagType$UNKNOWN$t$, t.TagType.NTAG_213, "NTAG213"), _defineProperty2(_t$TagType$UNKNOWN$t$, t.TagType.NTAG_215, "NTAG215"), _defineProperty2(_t$TagType$UNKNOWN$t$, t.TagType.NTAG_216, "NTAG216"), _t$TagType$UNKNOWN$t$)[this.tag] || "未知类型";
    }
  }, {
    key: "getFrequency",
    value: function getFrequency() {
      var _require = require("./chameleon-protocol.js"),
        a = _require.TagFrequency;
      return this.tag === t.TagType.EM410X ? a.LF : a.HF;
    }
  }, {
    key: "isMifareClassic",
    value: function isMifareClassic() {
      return [t.TagType.MIFARE_Mini, t.TagType.MIFARE_1024, t.TagType.MIFARE_2048, t.TagType.MIFARE_4096].includes(this.tag);
    }
  }, {
    key: "isMifareUltralight",
    value: function isMifareUltralight() {
      return [t.TagType.NTAG_213, t.TagType.NTAG_215, t.TagType.NTAG_216].includes(this.tag);
    }
  }, {
    key: "getIcon",
    value: function getIcon() {
      return 1 === this.getFrequency() ? "wifi" : "credit-card";
    }
  }, {
    key: "getDescription",
    value: function getDescription() {
      var t = this.getTypeString();
      return this.uid && (t += " \u2022 UID: ".concat(this.uid)), t;
    }
  }, {
    key: "validate",
    value: function validate() {
      var a = [];
      return this.name.trim() || a.push("卡片名称不能为空"), this.uid.trim() || a.push("UID不能为空"), this.tag === t.TagType.UNKNOWN && a.push("必须指定卡片类型"), this.uid && !/^[0-9A-Fa-f\s]+$/.test(this.uid) && a.push("UID格式无效，只能包含十六进制字符和空格"), {
        isValid: 0 === a.length,
        errors: a
      };
    }
  }, {
    key: "clone",
    value: function clone() {
      var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var a = e.fromObject(this.toObject());
      return a.id = a.generateId(), a.name = t || "".concat(this.name, " (\u526F\u672C)"), a.createdAt = new Date().toISOString(), a.modifiedAt = new Date().toISOString(), a;
    }
  }], [{
    key: "fromJson",
    value: function fromJson(t) {
      try {
        var _a = JSON.parse(t);
        return e.fromObject(_a);
      } catch (a) {
        throw new Error("JSON\u89E3\u6790\u5931\u8D25: ".concat(a.message));
      }
    }
  }, {
    key: "fromObject",
    value: function fromObject(t) {
      return new e({
        id: t.id,
        uid: t.uid,
        name: t.name,
        tag: t.tag,
        sak: t.sak,
        atqa: t.atqa ? new Uint8Array(t.atqa) : new Uint8Array(0),
        ats: t.ats ? new Uint8Array(t.ats) : new Uint8Array(0),
        data: t.data ? t.data.map(function (t) {
          return new Uint8Array(t);
        }) : [],
        extraData: t.extraData ? a.fromObject(t.extraData) : new a(),
        color: t.color || "#FF5722",
        createdAt: t.createdAt,
        modifiedAt: t.modifiedAt
      });
    }
  }]);
  return e;
}();exports.CardSave = e, exports.CardSaveExtra = a, exports.CardSaveUtils = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck2(this, _class);
  }
  _createClass2(_class, null, [{
    key: "fromSlotData",
    value: function fromSlotData(a, r) {
      return new e({
        name: a.name || "\u5361\u69FD".concat(r),
        uid: a.uid || "",
        tag: a.tagType || t.TagType.UNKNOWN,
        sak: a.sak || 0,
        atqa: a.atqa || new Uint8Array(0),
        ats: a.ats || new Uint8Array(0),
        data: a.data || []
      });
    }
  }, {
    key: "validateCards",
    value: function validateCards(t) {
      var a = [];
      var _iterator = _createForOfIteratorHelper2(t),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _e2 = _step.value;
          var _t = _e2.validate();
          a.push(_objectSpread2({
            card: _e2
          }, _t));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return a;
    }
  }, {
    key: "groupByType",
    value: function groupByType(t) {
      var a = {};
      var _iterator2 = _createForOfIteratorHelper2(t),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _e3 = _step2.value;
          var _t2 = _e3.getTypeString();
          a[_t2] || (a[_t2] = []), a[_t2].push(_e3);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return a;
    }
  }, {
    key: "searchCards",
    value: function searchCards(t, a) {
      if (!a.trim()) return t;
      var e = a.toLowerCase();
      return t.filter(function (t) {
        return t.name.toLowerCase().includes(e) || t.uid.toLowerCase().includes(e) || t.getTypeString().toLowerCase().includes(e);
      });
    }
  }, {
    key: "sortCards",
    value: function sortCards(t) {
      var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "name";
      var e = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "asc";
      return _toConsumableArray2(t).sort(function (t, r) {
        var i, s;
        switch (a) {
          case "name":
          default:
            i = t.name.toLowerCase(), s = r.name.toLowerCase();
            break;
          case "type":
            i = t.getTypeString(), s = r.getTypeString();
            break;
          case "created":
            i = new Date(t.createdAt), s = new Date(r.createdAt);
            break;
          case "modified":
            i = new Date(t.modifiedAt), s = new Date(r.modifiedAt);
        }
        return i < s ? "asc" === e ? -1 : 1 : i > s ? "asc" === e ? 1 : -1 : 0;
      });
    }
  }]);
  return _class;
}();