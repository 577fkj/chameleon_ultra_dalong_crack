require("../@babel/runtime/helpers/Arrayincludes");var _typeof2 = require("../@babel/runtime/helpers/typeof");var _slicedToArray2 = require("../@babel/runtime/helpers/slicedToArray");var _createForOfIteratorHelper2 = require("../@babel/runtime/helpers/createForOfIteratorHelper");var _defineProperty2 = require("../@babel/runtime/helpers/defineProperty");var _toConsumableArray2 = require("../@babel/runtime/helpers/toConsumableArray");var _classCallCheck2 = require("../@babel/runtime/helpers/classCallCheck");var _createClass2 = require("../@babel/runtime/helpers/createClass");var t = require("./card-save.js"),
  e = require("./chameleon-protocol.js"),
  r = require("./card-file-parser.js"),
  a = "json",
  n = "dump",
  i = "bin",
  s = "pm3",
  o = "flipper",
  p = "mct";exports.CardImportExport = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck2(this, _class);
  }
  _createClass2(_class, null, [{
    key: "exportCards",
    value: function exportCards(t) {
      var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : a;
      var r = Array.isArray(t) ? t : [t];
      switch (e) {
        case a:
          return this.exportAsJSON(r);
        case n:
          return this.exportAsDump(r);
        case i:
          return this.exportAsBin(r);
        default:
          throw new Error("\u4E0D\u652F\u6301\u7684\u5BFC\u51FA\u683C\u5F0F: ".concat(e));
      }
    }
  }, {
    key: "exportAsJSON",
    value: function exportAsJSON(t) {
      var e = {
        version: "1.0",
        type: "chameleon_cards",
        exported_at: new Date().toISOString(),
        count: t.length,
        cards: t.map(function (t) {
          return t.toObject();
        })
      };
      return {
        content: JSON.stringify(e, null, 2),
        filename: "chameleon_cards_".concat(this.getTimestamp(), ".json"),
        mimeType: "application/json"
      };
    }
  }, {
    key: "exportAsDump",
    value: function exportAsDump(t) {
      var _this = this;
      var r = "# Chameleon Ultra Card Dump\n";
      return r += "# Exported: ".concat(new Date().toISOString(), "\n"), r += "# Count: ".concat(t.length, "\n\n"), t.forEach(function (t, a) {
        r += "# === Card ".concat(a + 1, ": ").concat(t.name, " ===\n"), r += "# Type: ".concat(t.getTypeString(), "\n"), r += "# UID: ".concat(t.uid, "\n"), r += "# Created: ".concat(t.createdAt, "\n"), r += "# Modified: ".concat(t.modifiedAt, "\n\n"), t.isMifareClassic() ? r += _this.exportMifareClassicDump(t) : t.isMifareUltralight() ? r += _this.exportMifareUltralightDump(t) : t.tag === e.TagType.EM410X ? r += _this.exportEM410XDump(t) : r += "# Raw data:\n".concat(JSON.stringify(t.data, null, 2), "\n"), r += "\n";
      }), {
        content: r,
        filename: "chameleon_cards_".concat(this.getTimestamp(), ".dump"),
        mimeType: "text/plain"
      };
    }
  }, {
    key: "exportAsBin",
    value: function exportAsBin(t) {
      if (1 !== t.length) throw new Error("二进制格式只支持单个卡片导出");
      var e = t[0];
      var r;
      if (e.isMifareClassic()) r = this.exportMifareClassicBin(e);else {
        if (!e.isMifareUltralight()) throw new Error("\u4E0D\u652F\u6301\u7684\u5361\u7247\u7C7B\u578B: ".concat(e.getTypeString()));
        r = this.exportMifareUltralightBin(e);
      }
      return {
        content: r,
        filename: "".concat(e.name, "_").concat(this.getTimestamp(), ".bin"),
        mimeType: "application/octet-stream"
      };
    }
  }, {
    key: "importCards",
    value: function importCards(t, e) {
      var _this2 = this;
      var a = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
      try {
        var _n = r.CardFileParser.parseFile(t, e, a);
        if (_n && _n.needsUidSelection) return _n;
        return (Array.isArray(_n) ? _n : [_n]).map(function (t) {
          return _this2.convertToCardSave(t);
        });
      } catch (n) {
        return console.warn("[CardImportExport] 新解析器导入失败，使用回退方法:", n.message), this.importCardsLegacy(t, e);
      }
    }
  }, {
    key: "importCardsLegacy",
    value: function importCardsLegacy(t, e) {
      switch (e) {
        case a:
          return this.importFromJSON(t);
        case n:
          return this.importFromDump(t);
        case i:
          return this.importFromBin(t);
        case s:
          return this.importFromProxmark3(t);
        case o:
          return this.importFromFlipper(t);
        case p:
          return this.importFromMCT(t);
        default:
          throw new Error("\u4E0D\u652F\u6301\u7684\u5BFC\u5165\u683C\u5F0F: ".concat(e));
      }
    }
  }, {
    key: "convertToCardSave",
    value: function convertToCardSave(r) {
      if (r instanceof t.CardSave) return r;
      var a = {
        id: r.id || this.generateId(),
        name: r.name || "Imported Card",
        uid: r.uid || "",
        sak: r.sak || 0,
        atqa: r.atqa || new Uint8Array([0, 0]),
        ats: r.ats || new Uint8Array([]),
        tag: r.tag || e.TagType.UNKNOWN,
        data: r.data || [],
        color: r.color || "#2196F3"
      };
      return a.atqa instanceof Uint8Array || (a.atqa = new Uint8Array(a.atqa)), a.ats instanceof Uint8Array || (a.ats = new Uint8Array(a.ats)), a.data && Array.isArray(a.data) && (a.data = a.data.map(function (t) {
        return t instanceof Uint8Array ? t : new Uint8Array(t);
      })), new t.CardSave(a);
    }
  }, {
    key: "createCardWithUidLength",
    value: function createCardWithUidLength(r, a, n) {
      var i = r.tagType,
        s = r.bytes;
      console.log("[CardImportExport] \u521B\u5EFA\u5361\u7247 - \u7C7B\u578B: ".concat(i, ", UID\u957F\u5EA6: ").concat(a, ", \u6570\u636E\u957F\u5EA6: ").concat(s.length));
      var o = "",
        p = 0,
        c = [0, 0];
      if (i === e.TagType.EM410X) o = s.map(function (t) {
        return t.toString(16).padStart(2, "0");
      }).join("").toUpperCase();else {
        if (4 === a) {
          o = s.slice(0, 4).map(function (t) {
            return t.toString(16).padStart(2, "0");
          }).join(" ").toUpperCase(), this.isNTAG(i) ? (p = 0, c = [68, 0]) : s.length > 5 && (p = s[5], s.length > 7 && (c = [s[6], s[7]]));
        } else if (7 === a) if (this.isNTAG(i)) {
          o = s.slice(0, 7).map(function (t) {
            return t.toString(16).padStart(2, "0");
          }).join(" ").toUpperCase(), p = 0, c = [68, 0];
        } else {
          if (136 === s[0] && s.length >= 8) {
            o = s.slice(1, 8).map(function (t) {
              return t.toString(16).padStart(2, "0");
            }).join(" ").toUpperCase();
          } else {
            o = s.slice(0, 7).map(function (t) {
              return t.toString(16).padStart(2, "0");
            }).join(" ").toUpperCase();
          }
          p = this.getDefaultSAK(i, 7), c = this.getDefaultATQA(i, 7);
        }
        console.log("[CardImportExport] UID=".concat(o, ", SAK=0x").concat(p.toString(16).padStart(2, "0"), ", ATQA=").concat(c.map(function (t) {
          return t.toString(16).padStart(2, "0");
        }).join(" ")));
      }
      var l = [];
      if (this.isMifareClassic(i)) for (var _t = 0; _t < s.length; _t += 16) {
        var _e = s.slice(_t, _t + 16);
        if (16 === _e.length) l.push(new Uint8Array(_e));else if (_e.length > 0) {
          var _t2 = new Uint8Array(16);
          _t2.set(_e), l.push(_t2);
        }
      } else if (this.isNTAG(i)) for (var _t3 = 0; _t3 < s.length; _t3 += 4) {
        var _e2 = s.slice(_t3, _t3 + 4);
        if (4 === _e2.length) l.push(new Uint8Array(_e2));else if (_e2.length > 0) {
          var _t4 = new Uint8Array(4);
          _t4.set(_e2), l.push(_t4);
        }
      } else l.push(new Uint8Array(s));
      var g = new t.CardSave({
        name: n || "".concat(this.getTagTypeName(i), " (").concat(a, "\u4F4DUID)"),
        uid: o,
        tag: i,
        data: l,
        sak: p,
        atqa: c
      });
      return console.log("[CardImportExport] \u521B\u5EFA\u5361\u7247\u6210\u529F - \u540D\u79F0: ".concat(g.name, ", UID: ").concat(g.uid, ", \u6570\u636E\u5757\u6570: ").concat(g.data.length)), g;
    }
  }, {
    key: "getDefaultSAK",
    value: function getDefaultSAK(t, r) {
      if (7 === r) return 8;
      if (4 === r) switch (t) {
        case e.TagType.MIFARE_Mini:
          return 9;
        case e.TagType.MIFARE_1024:
          return 8;
        case e.TagType.MIFARE_2048:
          return 24;
        case e.TagType.MIFARE_4096:
          return 56;
        case e.TagType.NTAG_213:
        case e.TagType.NTAG_215:
        case e.TagType.NTAG_216:
          return 0;
        default:
          return 8;
      }
      switch (t) {
        case e.TagType.MIFARE_Mini:
          return 9;
        case e.TagType.MIFARE_1024:
          return 8;
        case e.TagType.MIFARE_2048:
          return 24;
        case e.TagType.MIFARE_4096:
          return 56;
        case e.TagType.NTAG_213:
        case e.TagType.NTAG_215:
        case e.TagType.NTAG_216:
          return 0;
        default:
          return 8;
      }
    }
  }, {
    key: "getDefaultATQA",
    value: function getDefaultATQA(t, r) {
      if (7 === r) return [68, 0];
      if (4 === r) return [4, 0];
      switch (t) {
        case e.TagType.MIFARE_Mini:
        case e.TagType.MIFARE_1024:
        case e.TagType.MIFARE_2048:
        case e.TagType.MIFARE_4096:
          return [4, 0];
        case e.TagType.NTAG_213:
        case e.TagType.NTAG_215:
        case e.TagType.NTAG_216:
          return [68, 0];
        default:
          return [4, 0];
      }
    }
  }, {
    key: "generateId",
    value: function generateId() {
      return "card_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    }
  }, {
    key: "importFromJSON",
    value: function importFromJSON(e) {
      var _this3 = this;
      try {
        var _r = JSON.parse(e);
        if ("proxmark3" === _r.Created) return this.importFromProxmark3(e);
        if ("chameleon_cards" === _r.type && _r.cards) return _r.cards.map(function (e) {
          return t.CardSave.fromObject(e);
        });
        if (_r.id && _r.uid && _r.name && void 0 !== _r.tag) return [this.convertFlutterCardSave(_r)];
        if (_r.id || _r.name) return [t.CardSave.fromObject(_r)];
        if (Array.isArray(_r)) return _r.map(function (e) {
          return e.id && e.uid && e.name && void 0 !== e.tag ? _this3.convertFlutterCardSave(e) : t.CardSave.fromObject(e);
        });
        throw new Error("无法识别的JSON格式");
      } catch (r) {
        throw new Error("JSON\u89E3\u6790\u5931\u8D25: ".concat(r.message));
      }
    }
  }, {
    key: "convertFlutterCardSave",
    value: function convertFlutterCardSave(e) {
      return new t.CardSave({
        id: e.id,
        uid: e.uid,
        name: e.name,
        tag: e.tag,
        sak: e.sak || 0,
        atqa: e.atqa ? new Uint8Array(e.atqa) : new Uint8Array(0),
        ats: e.ats ? new Uint8Array(e.ats) : new Uint8Array(0),
        data: e.data ? e.data.map(function (t) {
          return new Uint8Array(t);
        }) : [],
        extraData: e.extra ? t.CardSaveExtra.fromObject(e.extra) : new t.CardSaveExtra(),
        color: e.color || "#FF5722",
        createdAt: e.createdAt || new Date().toISOString(),
        modifiedAt: e.modifiedAt || new Date().toISOString()
      });
    }
  }, {
    key: "importFromDump",
    value: function importFromDump(t) {
      var e = [];
      if (this.isBinaryContent(t)) {
        console.log("[CardImportExport] 处理二进制dump文件");
        try {
          var _r2 = this.parseBinaryDump(t);
          if (_r2 && _r2.length > 0) return e.push.apply(e, _toConsumableArray2(_r2)), e;
        } catch (r) {
          console.warn("[CardImportExport] \u4E8C\u8FDB\u5236dump\u89E3\u6790\u5931\u8D25: ".concat(r.message));
        }
      }
      if (t.includes("# === Card")) {
        var _a = t.split("# === Card");
        for (var _t5 = 1; _t5 < _a.length; _t5++) try {
          var _r3 = _a[_t5],
            _n2 = this.parseDumpSection(_r3);
          _n2 && e.push(_n2);
        } catch (r) {
          console.warn("[CardImportExport] \u8DF3\u8FC7\u65E0\u6548\u7684dump\u6BB5\u843D: ".concat(r.message));
        }
      }
      if (0 === e.length) try {
        var _r4 = this.parseSingleDump(t);
        _r4 && e.push(_r4);
      } catch (r) {
        console.warn("[CardImportExport] \u5355\u4E2Adump\u89E3\u6790\u5931\u8D25: ".concat(r.message));
      }
      if (0 === e.length) try {
        var _r5 = t.split("\n").map(function (t) {
          return t.trim();
        }).filter(function (t) {
          return t && !t.startsWith("#") && /^[0-9A-Fa-f\s]+$/.test(t);
        });
        if (_r5.length > 0) {
          var _t6 = _r5.join("").replace(/\s+/g, "");
          if (_t6.length > 0) {
            var _r6 = this.importFromBin(_t6);
            if (_r6 && _r6.needsUidSelection) return _r6;
            Array.isArray(_r6) ? e.push.apply(e, _toConsumableArray2(_r6)) : _r6 && e.push(_r6);
          }
        }
      } catch (r) {
        console.warn("[CardImportExport] \u5341\u516D\u8FDB\u5236\u6570\u636E\u89E3\u6790\u5931\u8D25: ".concat(r.message));
      }
      if (0 === e.length) throw new Error("Dump文件中没有找到有效的卡片数据");
      return e;
    }
  }, {
    key: "importFromBin",
    value: function importFromBin(r) {
      try {
        console.log("[CardImportExport] 开始处理Bin文件导入");
        var _a2 = r;
        if (_a2 = /^[0-9A-Fa-f\s]*$/.test(r) ? r.replace(/\s+/g, "") : r.replace(/[^0-9A-Fa-f]/g, ""), 0 === _a2.length) throw new Error("Bin文件不包含有效的十六进制数据");
        _a2.length % 2 != 0 && (_a2 = "0" + _a2);
        var _n3 = [];
        for (var _t7 = 0; _t7 < _a2.length; _t7 += 2) {
          var _e3 = parseInt(_a2.substr(_t7, 2), 16);
          _n3.push(_e3);
        }
        console.log("[CardImportExport] Bin\u6570\u636E\u957F\u5EA6: ".concat(_n3.length, " \u5B57\u8282"));
        var _i = _n3.length;
        var _s = e.TagType.MIFARE_1024,
          _o = "Bin导入卡片";
        if (1024 === _i ? (_s = e.TagType.MIFARE_1024, _o = "Mifare Classic 1K") : 2048 === _i ? (_s = e.TagType.MIFARE_2048, _o = "Mifare Classic 2K") : 4096 === _i ? (_s = e.TagType.MIFARE_4096, _o = "Mifare Classic 4K") : 180 === _i ? (_s = e.TagType.NTAG_213, _o = "NTAG213") : 540 === _i ? (_s = e.TagType.NTAG_215, _o = "NTAG215") : 924 === _i || 932 === _i ? (_s = e.TagType.NTAG_216, _o = "NTAG216") : 320 === _i ? (_s = e.TagType.MIFARE_Mini, _o = "Mifare Mini") : 5 === _i ? (_s = e.TagType.EM410X, _o = "EM410X") : (_s = this.detectTagTypeFromBinData(_n3), _o = "\u672A\u77E5\u5361\u7247 (".concat(_i, "\u5B57\u8282)")), console.log("[CardImportExport] \u68C0\u6D4B\u5230\u5361\u7247\u7C7B\u578B: ".concat(_s, ", \u540D\u79F0: ").concat(_o)), _s === e.TagType.EM410X) {
          var _e4 = _n3.map(function (t) {
            return t.toString(16).padStart(2, "0");
          }).join("").toUpperCase();
          return [new t.CardSave({
            name: _o,
            uid: _e4,
            tag: _s,
            data: [new Uint8Array(_n3)],
            sak: 0,
            atqa: [0, 0]
          })];
        }
        if (this.isNTAG(_s)) {
          return [this.createCardWithUidLength({
            tagType: _s,
            bytes: _n3,
            hexData: _a2
          }, 7, _o)];
        }
        return {
          needsUidSelection: !0,
          tagType: _s,
          cardName: _o,
          bytes: _n3,
          hexData: _a2
        };
      } catch (a) {
        throw console.error("[CardImportExport] Bin导入失败:", a), new Error("Bin\u6587\u4EF6\u5BFC\u5165\u5931\u8D25: ".concat(a.message));
      }
    }
  }, {
    key: "detectTagTypeFromBinData",
    value: function detectTagTypeFromBinData(t) {
      if (t.length < 16) return e.TagType.EM410X;
      if (t.length >= 16) {
        if (180 === t.length) return e.TagType.NTAG_213;
        if (540 === t.length) return e.TagType.NTAG_215;
        if (924 === t.length || 932 === t.length) return e.TagType.NTAG_216;
      }
      return t.length <= 320 ? e.TagType.MIFARE_Mini : t.length <= 1024 ? e.TagType.MIFARE_1024 : t.length <= 2048 ? e.TagType.MIFARE_2048 : e.TagType.MIFARE_4096;
    }
  }, {
    key: "isMifareClassic",
    value: function isMifareClassic(t) {
      return [e.TagType.MIFARE_Mini, e.TagType.MIFARE_1024, e.TagType.MIFARE_2048, e.TagType.MIFARE_4096].includes(t);
    }
  }, {
    key: "isNTAG",
    value: function isNTAG(t) {
      return [e.TagType.NTAG_210, e.TagType.NTAG_212, e.TagType.NTAG_213, e.TagType.NTAG_215, e.TagType.NTAG_216].includes(t);
    }
  }, {
    key: "isMifareUltralight",
    value: function isMifareUltralight(t) {
      return [e.TagType.MIFARE_Ultralight, e.TagType.MIFARE_Ultralight_C, e.TagType.MIFARE_Ultralight_EV1_11, e.TagType.MIFARE_Ultralight_EV1_21].includes(t);
    }
  }, {
    key: "getTagTypeName",
    value: function getTagTypeName(t) {
      var _e$TagType$UNKNOWN$e$;
      return (_e$TagType$UNKNOWN$e$ = {}, _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.UNKNOWN, "未知类型"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.EM410X, "EM410X"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.EM410X16, "EM410X-16"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.EM410X32, "EM410X-32"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.EM410X64, "EM410X-64"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.VIKING, "Viking"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.HID_PROX, "HID Prox"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.MIFARE_Mini, "Mifare Mini"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.MIFARE_1024, "Mifare Classic 1K"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.MIFARE_2048, "Mifare Classic 2K"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.MIFARE_4096, "Mifare Classic 4K"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.NTAG_210, "NTAG210"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.NTAG_212, "NTAG212"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.NTAG_213, "NTAG213"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.NTAG_215, "NTAG215"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.NTAG_216, "NTAG216"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.MIFARE_Ultralight, "Mifare Ultralight"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.MIFARE_Ultralight_C, "Mifare Ultralight C"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.MIFARE_Ultralight_EV1_11, "Ultralight EV1-11"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.MIFARE_Ultralight_EV1_21, "Ultralight EV1-21"), _e$TagType$UNKNOWN$e$)[t] || "\u672A\u77E5\u7C7B\u578B(".concat(t, ")");
    }
  }, {
    key: "importFromProxmark3",
    value: function importFromProxmark3(e) {
      try {
        console.log("[CardImportExport] 开始处理Proxmark3格式导入");
        var _a3 = JSON.parse(e);
        if (!_a3.Created || "proxmark3" !== _a3.Created) throw new Error("不是有效的Proxmark3格式");
        var _n4 = _a3.Card || {},
          _i2 = _n4.UID || "",
          _s2 = _n4.SAK || "08",
          _o2 = _n4.ATQA || "0004";
        var _p = 8;
        try {
          _p = parseInt(_s2.replace(/[^0-9A-Fa-f]/g, ""), 16);
        } catch (r) {
          console.warn("[CardImportExport] SAK解析失败，使用默认值");
        }
        var c = [4, 0];
        try {
          _o2.length >= 4 && (c = [parseInt(_o2.substring(2, 4), 16), parseInt(_o2.substring(0, 2), 16)]);
        } catch (r) {
          console.warn("[CardImportExport] ATQA解析失败，使用默认值");
        }
        var l = this.detectTagTypeFromPM3(_a3),
          g = this.convertPM3Data(_a3),
          T = new t.CardSave({
            name: _n4.Name || _i2 || "Proxmark3导入",
            uid: _i2,
            tag: l,
            sak: _p,
            atqa: c,
            data: g
          });
        return console.log("[CardImportExport] Proxmark3\u5BFC\u5165\u6210\u529F - UID: ".concat(_i2, ", SAK: 0x").concat(_p.toString(16).padStart(2, "0"), ", ATQA: ").concat(c.map(function (t) {
          return t.toString(16).padStart(2, "0");
        }).join(" "))), [T];
      } catch (a) {
        throw console.error("[CardImportExport] Proxmark3导入失败:", a), new Error("Proxmark3\u683C\u5F0F\u89E3\u6790\u5931\u8D25: ".concat(a.message));
      }
    }
  }, {
    key: "importFromFlipper",
    value: function importFromFlipper(e) {
      try {
        console.log("[CardImportExport] 开始处理Flipper格式导入");
        var _a4 = e.split("\n"),
          _n5 = {};
        var _iterator = _createForOfIteratorHelper2(_a4),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _t8 = _step.value;
            var _e5 = _t8.trim();
            if (_e5.startsWith("Filetype:") && !_e5.includes("Flipper NFC device")) throw new Error("不是有效的Flipper NFC格式");
            if (_e5.includes(":")) {
              var _e5$split$map = _e5.split(":").map(function (t) {
                  return t.trim();
                }),
                _e5$split$map2 = _slicedToArray2(_e5$split$map, 2),
                _t9 = _e5$split$map2[0],
                _r7 = _e5$split$map2[1];
              _n5[_t9] = _r7;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        var _i3 = _n5.UID || "",
          _s3 = _n5.SAK || "08",
          _o3 = _n5.ATQA || "0004";
        var _p2 = 8;
        try {
          _p2 = parseInt(_s3.replace(/[^0-9A-Fa-f]/g, ""), 16);
        } catch (r) {
          console.warn("[CardImportExport] Flipper SAK解析失败，使用默认值");
        }
        var c = [4, 0];
        try {
          _o3.length >= 4 && (c = [parseInt(_o3.substring(0, 2), 16), parseInt(_o3.substring(2, 4), 16)]);
        } catch (r) {
          console.warn("[CardImportExport] Flipper ATQA解析失败，使用默认值");
        }
        var l = this.detectTagTypeFromFlipper(_n5),
          g = this.convertFlipperData(_n5),
          T = new t.CardSave({
            name: _n5.Name || _i3 || "Flipper导入",
            uid: _i3,
            tag: l,
            sak: _p2,
            atqa: c,
            data: g
          });
        return console.log("[CardImportExport] Flipper\u5BFC\u5165\u6210\u529F - UID: ".concat(_i3, ", SAK: 0x").concat(_p2.toString(16).padStart(2, "0"), ", ATQA: ").concat(c.map(function (t) {
          return t.toString(16).padStart(2, "0");
        }).join(" "))), [T];
      } catch (a) {
        throw console.error("[CardImportExport] Flipper导入失败:", a), new Error("Flipper\u683C\u5F0F\u89E3\u6790\u5931\u8D25: ".concat(a.message));
      }
    }
  }, {
    key: "importFromMCT",
    value: function importFromMCT(r) {
      try {
        console.log("[CardImportExport] 开始处理MCT格式导入");
        var _n6 = r.split("\n"),
          _i4 = {};
        var _s4 = null;
        var _iterator2 = _createForOfIteratorHelper2(_n6),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _t11 = _step2.value;
            var _e7 = _t11.trim();
            _e7.startsWith("+Sector:") ? (_s4 = parseInt(_e7.split(":")[1].trim()), _i4[_s4] = []) : _e7.match(/^[0-9A-Fa-f\s]+$/) && _e7.length >= 32 && null !== _s4 && _i4[_s4].push(_e7);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        var _o4 = "",
          _p3 = 8,
          c = [4, 0];
        if (_n6.length > 1) {
          var _t10 = _n6[1].trim();
          if (_t10.length >= 16) {
            if (_o4 = _t10.substring(0, 8), _t10.length >= 12) try {
              _p3 = parseInt(_t10.substring(10, 12), 16);
            } catch (a) {
              console.warn("[CardImportExport] MCT SAK解析失败，使用默认值");
            }
            if (_t10.length >= 16) try {
              var _e6 = _t10.substring(12, 16);
              c = [parseInt(_e6.substring(2, 4), 16), parseInt(_e6.substring(0, 2), 16)];
            } catch (a) {
              console.warn("[CardImportExport] MCT ATQA解析失败，使用默认值");
            }
          }
        }
        var l = Math.max.apply(Math, _toConsumableArray2(Object.keys(_i4).map(function (t) {
          return parseInt(t);
        })));
        var g = e.TagType.MIFARE_1024;
        l >= 32 ? g = e.TagType.MIFARE_4096 : l >= 16 && (g = e.TagType.MIFARE_2048);
        var T = this.convertMCTData(_i4),
          d = new t.CardSave({
            name: _o4 || "MCT导入",
            uid: _o4,
            tag: g,
            sak: _p3,
            atqa: c,
            data: T
          });
        return console.log("[CardImportExport] MCT\u5BFC\u5165\u6210\u529F - UID: ".concat(_o4, ", SAK: 0x").concat(_p3.toString(16).padStart(2, "0"), ", ATQA: ").concat(c.map(function (t) {
          return t.toString(16).padStart(2, "0");
        }).join(" "))), [d];
      } catch (n) {
        throw console.error("[CardImportExport] MCT导入失败:", n), new Error("MCT\u683C\u5F0F\u89E3\u6790\u5931\u8D25: ".concat(n.message));
      }
    }
  }, {
    key: "isBinaryContent",
    value: function isBinaryContent(t) {
      if (t instanceof ArrayBuffer || t instanceof Uint8Array) return !0;
      if ("object" == _typeof2(t) && null !== t && "number" == typeof t.byteLength && !("length" in t) && !("string" in t)) return !0;
      if ("string" == typeof t) {
        var _e8 = Math.min(100, t.length);
        var _r8 = 0;
        for (var _a5 = 0; _a5 < _e8; _a5++) {
          var _e9 = t.charCodeAt(_a5);
          (_e9 < 32 || _e9 > 126) && 10 !== _e9 && 13 !== _e9 && _r8++;
        }
        return _r8 / _e8 > .2;
      }
      return !1;
    }
  }, {
    key: "detectFormat",
    value: function detectFormat(t) {
      var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      try {
        return r.CardFileParser.detectFormat(t, e);
      } catch (a) {
        return console.warn("[CardImportExport] 新解析器检测失败，使用回退逻辑:", a.message), this.detectFormatFallback(t, e);
      }
    }
  }, {
    key: "detectFormatFallback",
    value: function detectFormatFallback(t) {
      var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      if (!t) throw new Error("无效的文件内容：文件为空或格式不正确");
      if (this.isBinaryContent(t)) {
        console.log("[CardImportExport] 检测到二进制内容");
        var _t12 = e.toLowerCase().split(".").pop();
        return "dump" === _t12 ? (console.log("[CardImportExport] 二进制dump格式"), n) : "bin" === _t12 ? (console.log("[CardImportExport] 二进制bin格式"), i) : (console.log("[CardImportExport] 默认二进制dump格式"), n);
      }
      if ("string" == typeof t) {
        var c = t.trim();
        if (0 === c.length) throw new Error("文件内容为空，请选择有效的卡片数据文件");
        console.log("[CardImportExport] \u68C0\u6D4B\u5B57\u7B26\u4E32\u6587\u4EF6\u683C\u5F0F - \u6587\u4EF6\u540D: ".concat(e, ", \u5185\u5BB9\u957F\u5EA6: ").concat(c.length));
        var l = e.toLowerCase().split(".").pop();
        try {
          var _t13 = JSON.parse(c);
          return "proxmark3" === _t13.Created ? (console.log("[CardImportExport] 检测到Proxmark3格式"), s) : "chameleon_cards" === _t13.type ? (console.log("[CardImportExport] 检测到Chameleon JSON格式"), a) : _t13.id && _t13.uid && _t13.name && void 0 !== _t13.tag ? (console.log("[CardImportExport] 检测到Flutter CardSave格式"), a) : _t13.id || _t13.name || Array.isArray(_t13) ? (console.log("[CardImportExport] 检测到通用JSON格式"), a) : (console.log("[CardImportExport] 检测到未知JSON格式，尝试作为通用JSON处理"), a);
        } catch (r) {
          console.log("[CardImportExport] 不是JSON格式，继续检测其他格式");
        }
        if (c.includes("Filetype: Flipper NFC device")) return console.log("[CardImportExport] 检测到Flipper NFC格式"), o;
        if (c.includes("+Sector:")) return console.log("[CardImportExport] 检测到MCT格式"), p;
        if (c.includes("# Chameleon") || c.includes("# === Card")) return console.log("[CardImportExport] 检测到Chameleon Dump格式"), n;
        if (c.includes("Block ") || c.includes("Page ") || c.includes("# Name:") || c.includes("# Type:")) return console.log("[CardImportExport] 检测到通用Dump格式"), n;
        var g = c.split("\n").map(function (t) {
            return t.trim();
          }).filter(function (t) {
            return t;
          }),
          T = g.filter(function (t) {
            return /^[0-9A-Fa-f\s]+$/.test(t);
          });
        if (T.length > 0 && T.length / g.length > .7) return console.log("[CardImportExport] 检测到十六进制数据，判断为Bin格式"), i;
        if ("json" === l) return console.log("[CardImportExport] 根据扩展名判断为JSON格式"), a;
        if ("dump" === l) return console.log("[CardImportExport] 根据扩展名判断为Dump格式"), n;
        if ("bin" === l) return console.log("[CardImportExport] 根据扩展名判断为Bin格式"), i;
        if ("nfc" === l) return console.log("[CardImportExport] 根据扩展名判断为Flipper格式"), o;
        throw console.warn("[CardImportExport] 无法识别文件格式，使用默认Dump格式"), new Error("无法识别文件格式。支持的格式：JSON (.json)、Dump (.dump)、Bin (.bin)、Flipper NFC (.nfc)、MCT、Proxmark3");
      }
      throw new Error("不支持的内容类型，请提供有效的文本或二进制数据");
    }
  }, {
    key: "getTimestamp",
    value: function getTimestamp() {
      return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    }
  }, {
    key: "exportMifareClassicDump",
    value: function exportMifareClassicDump(t) {
      var e = "";
      return t.data && t.data.length > 0 && t.data.forEach(function (t, r) {
        var a = Array.from(t).map(function (t) {
          return t.toString(16).padStart(2, "0");
        }).join(" ");
        e += "Block ".concat(r.toString().padStart(2, "0"), ": ").concat(a, "\n");
      }), e;
    }
  }, {
    key: "exportMifareUltralightDump",
    value: function exportMifareUltralightDump(t) {
      var e = "";
      return t.data && t.data.length > 0 && t.data.forEach(function (t, r) {
        var a = Array.from(t).map(function (t) {
          return t.toString(16).padStart(2, "0");
        }).join(" ");
        e += "Page ".concat(r.toString().padStart(2, "0"), ": ").concat(a, "\n");
      }), e;
    }
  }, {
    key: "exportEM410XDump",
    value: function exportEM410XDump(t) {
      return "UID: ".concat(t.uid, "\n");
    }
  }, {
    key: "exportMifareClassicBin",
    value: function exportMifareClassicBin(t) {
      var e = new ArrayBuffer(16 * t.data.length),
        r = new Uint8Array(e);
      return t.data.forEach(function (t, e) {
        r.set(t, 16 * e);
      }), e;
    }
  }, {
    key: "exportMifareUltralightBin",
    value: function exportMifareUltralightBin(t) {
      var e = new ArrayBuffer(4 * t.data.length),
        r = new Uint8Array(e);
      return t.data.forEach(function (t, e) {
        r.set(t, 4 * e);
      }), e;
    }
  }, {
    key: "parseBinaryDump",
    value: function parseBinaryDump(r) {
      console.log("[CardImportExport] 开始解析二进制dump文件");
      var a = [];
      for (var _t14 = 0; _t14 < r.length; _t14++) a.push(255 & r.charCodeAt(_t14));
      console.log("[CardImportExport] \u4E8C\u8FDB\u5236dump\u6587\u4EF6\u5927\u5C0F: ".concat(a.length, " \u5B57\u8282"));
      var n = e.TagType.MIFARE_1024,
        i = "Dump导入卡片";
      1024 === a.length ? (n = e.TagType.MIFARE_1024, i = "Mifare Classic 1K (Dump)") : 2048 === a.length ? (n = e.TagType.MIFARE_2048, i = "Mifare Classic 2K (Dump)") : 4096 === a.length ? (n = e.TagType.MIFARE_4096, i = "Mifare Classic 4K (Dump)") : 180 === a.length ? (n = e.TagType.NTAG_213, i = "NTAG213 (Dump)") : 540 === a.length ? (n = e.TagType.NTAG_215, i = "NTAG215 (Dump)") : 924 === a.length || 932 === a.length ? (n = e.TagType.NTAG_216, i = "NTAG216 (Dump)") : 5 === a.length && (n = e.TagType.EM410X, i = "EM410X (Dump)");
      var s = "";
      a.length >= 4 ? (s = a.slice(0, 4).map(function (t) {
        return t.toString(16).padStart(2, "0");
      }).join(" ").toUpperCase(), console.log("[CardImportExport] \u4ECE\u4E8C\u8FDB\u5236dump\u63D0\u53D6UID: ".concat(s))) : s = "00 00 00 00";
      var o = n === e.TagType.MIFARE_1024 || n === e.TagType.MIFARE_2048 || n === e.TagType.MIFARE_4096 ? 16 : 4,
        p = [];
      var _loop = function _loop() {
        var e = a.slice(_t15, _t15 + o);
        if (e.length === o) p.push(new Uint8Array(e));else {
          var _t16 = new Uint8Array(o);
          e.forEach(function (e, r) {
            _t16[r] = e;
          }), p.push(_t16);
        }
      };
      for (var _t15 = 0; _t15 < a.length; _t15 += o) {
        _loop();
      }
      var c = new t.CardSave({
        name: "".concat(i, " (").concat(s, ")"),
        uid: s,
        tag: n,
        data: p
      });
      return console.log("[CardImportExport] \u4E8C\u8FDB\u5236dump\u89E3\u6790\u5B8C\u6210: name=".concat(c.name, ", uid=").concat(c.uid, ", blocks=").concat(p.length)), [c];
    }
  }, {
    key: "parseSingleDump",
    value: function parseSingleDump(e) {
      var r;
      var a = e.split("\n"),
        n = {},
        i = [];
      var _iterator3 = _createForOfIteratorHelper2(a),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _t19 = _step3.value;
          var _e10 = _t19.trim();
          if (_e10.startsWith("# Name:")) n.name = _e10.substring(7).trim();else if (_e10.startsWith("# Type:")) n.type = _e10.substring(7).trim();else if (_e10.startsWith("# UID:")) n.uid = _e10.substring(6).trim();else if (_e10.startsWith("# Created:")) n.created = _e10.substring(10).trim();else if (_e10.startsWith("# Modified:")) n.modified = _e10.substring(11).trim();else if (_e10.startsWith("Block ") || _e10.startsWith("Page ")) {
            var _t20 = _e10.match(/^(Block|Page)\s+\d+:\s*([0-9A-Fa-f\s]+)/);
            _t20 && i.push(_t20[2]);
          } else !_e10.startsWith("#") && _e10 && /^[0-9A-Fa-f\s]+$/.test(_e10) && i.push(_e10);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      if (!n.name && !n.type && !n.uid && i.length > 0) {
        var _t17 = i[0].replace(/\s+/g, "");
        _t17.length >= 8 && (n.uid = _t17.substring(0, 8).match(/.{2}/g).join(" ").toUpperCase(), n.name = "Dump\u5BFC\u5165 (".concat(n.uid, ")"));
      }
      n.name || (n.name = "Dump导入");
      var s = new t.CardSave({
        name: n.name || "Dump导入",
        uid: n.uid || "",
        tag: this.detectTagTypeFromString(n.type),
        createdAt: n.created || new Date().toISOString(),
        modifiedAt: n.modified || new Date().toISOString()
      });
      if (i.length > 0 && (s.data = this.parseDataLines(i), !s.uid && s.data.length > 0)) {
        var _t18 = s.data[0];
        _t18 && _t18.length >= 4 && (s.uid = Array.from(_t18.slice(0, 4)).map(function (t) {
          return t.toString(16).padStart(2, "0");
        }).join(" ").toUpperCase(), console.log("[CardImportExport] \u4ECE\u6570\u636E\u4E2D\u63D0\u53D6UID: ".concat(s.uid)));
      }
      return s.uid || (console.warn("[CardImportExport] 无法提取UID，使用默认UID"), s.uid = "00 00 00 00"), console.log("[CardImportExport] \u89E3\u6790dump\u5B8C\u6210: name=".concat(s.name, ", uid=").concat(s.uid, ", dataBlocks=").concat((null == (r = s.data) ? void 0 : r.length) || 0)), s;
    }
  }, {
    key: "parseDumpSection",
    value: function parseDumpSection(e) {
      var r;
      var a = e.split("\n"),
        n = {},
        i = [];
      var _iterator4 = _createForOfIteratorHelper2(a),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _t22 = _step4.value;
          var _e11 = _t22.trim();
          _e11.startsWith("# Type:") ? n.type = _e11.substring(7).trim() : _e11.startsWith("# UID:") ? n.uid = _e11.substring(6).trim() : _e11.startsWith("# Name:") ? n.name = _e11.substring(7).trim() : !_e11.startsWith("#") && _e11 && i.push(_e11);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      var s = new t.CardSave({
        name: n.name || "导入的卡片",
        uid: n.uid || "",
        tag: this.detectTagTypeFromString(n.type)
      });
      if (i.length > 0 && (s.data = this.parseDataLines(i), !s.uid && s.data.length > 0)) {
        var _t21 = s.data[0];
        _t21 && _t21.length >= 4 && (s.uid = Array.from(_t21.slice(0, 4)).map(function (t) {
          return t.toString(16).padStart(2, "0");
        }).join(" ").toUpperCase(), console.log("[CardImportExport] \u4ECE\u6BB5\u843D\u6570\u636E\u4E2D\u63D0\u53D6UID: ".concat(s.uid)));
      }
      return s.uid || (console.warn("[CardImportExport] 段落无法提取UID，使用默认UID"), s.uid = "00 00 00 00"), console.log("[CardImportExport] \u89E3\u6790dump\u6BB5\u843D\u5B8C\u6210: name=".concat(s.name, ", uid=").concat(s.uid, ", dataBlocks=").concat((null == (r = s.data) ? void 0 : r.length) || 0)), s;
    }
  }, {
    key: "detectTagTypeFromString",
    value: function detectTagTypeFromString(t) {
      if (!t) return e.TagType.MIFARE_1024;
      var r = t.toLowerCase();
      if (r.includes("em410x") || r.includes("em4100")) return e.TagType.EM410X;
      if (r.includes("mifare classic") || r.includes("mf1")) return r.includes("1k") || r.includes("1024") ? e.TagType.MIFARE_1024 : r.includes("2k") || r.includes("2048") ? e.TagType.MIFARE_2048 : r.includes("4k") || r.includes("4096") ? e.TagType.MIFARE_4096 : e.TagType.MIFARE_1024;
      if (r.includes("ntag")) return r.includes("213") ? e.TagType.NTAG_213 : r.includes("215") ? e.TagType.NTAG_215 : r.includes("216") ? e.TagType.NTAG_216 : e.TagType.NTAG_213;
      if (r.includes("ultralight") || r.includes("ul")) return e.TagType.MIFARE_Ultralight;
      var a = parseInt(t);
      if (!isNaN(a)) switch (a) {
        case 0:
          return e.TagType.EM410X;
        case 1:
        default:
          return e.TagType.MIFARE_1024;
        case 2:
          return e.TagType.MIFARE_2048;
        case 3:
          return e.TagType.MIFARE_4096;
        case 4:
          return e.TagType.MIFARE_Ultralight;
        case 5:
          return e.TagType.NTAG_213;
        case 6:
          return e.TagType.NTAG_215;
        case 7:
          return e.TagType.NTAG_216;
      }
      return e.TagType.MIFARE_1024;
    }
  }, {
    key: "parseDataLines",
    value: function parseDataLines(t) {
      var e = [];
      var _iterator5 = _createForOfIteratorHelper2(t),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _a6 = _step5.value;
          var _t23 = _a6.trim();
          if (_t23 = _t23.replace(/^(Block|Page)\s+\d+:\s*/, ""), _t23 = _t23.replace(/[^0-9A-Fa-f\s]/g, "").trim(), _t23) try {
            var _r9 = void 0;
            _r9 = _t23.includes(" ") ? _t23.split(/\s+/).filter(function (t) {
              return t.length > 0;
            }) : _t23.match(/.{1,2}/g) || [];
            var _a7 = _r9.map(function (t) {
              var e = parseInt(t, 16);
              if (isNaN(e)) throw new Error("\u65E0\u6548\u7684\u5341\u516D\u8FDB\u5236\u503C: ".concat(t));
              return e;
            });
            _a7.length > 0 && e.push(new Uint8Array(_a7));
          } catch (r) {
            console.warn("[CardImportExport] \u8DF3\u8FC7\u65E0\u6548\u7684\u6570\u636E\u884C: ".concat(_a6, ", \u9519\u8BEF: ").concat(r.message));
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      return e;
    }
  }, {
    key: "detectTagTypeFromPM3",
    value: function detectTagTypeFromPM3(t) {
      if (t.Card && t.Card.SAK) {
        var _r10 = parseInt(t.Card.SAK.replace(/[^0-9A-Fa-f]/g, ""), 16);
        if (8 === _r10) return e.TagType.MIFARE_1024;
        if (24 === _r10) return e.TagType.MIFARE_2048;
        if (56 === _r10) return e.TagType.MIFARE_4096;
        if (9 === _r10) return e.TagType.MIFARE_Mini;
        if (0 === _r10) return e.TagType.NTAG_213;
      }
      return e.TagType.MIFARE_1024;
    }
  }, {
    key: "convertPM3Data",
    value: function convertPM3Data(t) {
      var e = [];
      return t.blocks && t.blocks.forEach(function (t) {
        if ("string" == typeof t) {
          var _r11 = t.replace(/\s/g, ""),
            _a8 = [];
          for (var _t24 = 0; _t24 < _r11.length; _t24 += 2) _a8.push(parseInt(_r11.substring(_t24, _t24 + 2), 16));
          e.push(new Uint8Array(_a8));
        }
      }), e;
    }
  }, {
    key: "detectTagTypeFromFlipper",
    value: function detectTagTypeFromFlipper(t) {
      if (t.SAK) {
        var _r12 = parseInt(t.SAK.replace(/[^0-9A-Fa-f]/g, ""), 16);
        if (8 === _r12) return e.TagType.MIFARE_1024;
        if (24 === _r12) return e.TagType.MIFARE_2048;
        if (56 === _r12) return e.TagType.MIFARE_4096;
        if (9 === _r12) return e.TagType.MIFARE_Mini;
        if (0 === _r12) return e.TagType.NTAG_213;
      }
      return e.TagType.MIFARE_1024;
    }
  }, {
    key: "convertFlipperData",
    value: function convertFlipperData(t) {
      var e = [];
      return Object.keys(t).forEach(function (r) {
        if (r.startsWith("Block")) {
          var _a9 = t[r].replace(/\?/g, "0").replace(/\s/g, ""),
            _n7 = [];
          for (var _t25 = 0; _t25 < _a9.length; _t25 += 2) _n7.push(parseInt(_a9.substr(_t25, 2), 16));
          _n7.length > 0 && e.push(new Uint8Array(_n7));
        }
      }), e;
    }
  }, {
    key: "convertMCTData",
    value: function convertMCTData(t) {
      var e = [];
      return Object.keys(t).sort(function (t, e) {
        return parseInt(t) - parseInt(e);
      }).forEach(function (r) {
        t[r].forEach(function (t) {
          var r = t.replace(/\s/g, "").match(/.{2}/g).map(function (t) {
            return parseInt(t, 16);
          });
          e.push(new Uint8Array(r));
        });
      }), e;
    }
  }]);
  return _class;
}();