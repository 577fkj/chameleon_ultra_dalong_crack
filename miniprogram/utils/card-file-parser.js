var _defineProperty2 = require("../@babel/runtime/helpers/defineProperty");require("../@babel/runtime/helpers/Arrayincludes");var _toConsumableArray2 = require("../@babel/runtime/helpers/toConsumableArray");var _typeof2 = require("../@babel/runtime/helpers/typeof");var _createForOfIteratorHelper2 = require("../@babel/runtime/helpers/createForOfIteratorHelper");var _classCallCheck2 = require("../@babel/runtime/helpers/classCallCheck");var _createClass2 = require("../@babel/runtime/helpers/createClass");var e = require("./chameleon-protocol.js"),
  t = "json",
  r = "dump",
  a = "bin",
  s = "proxmark3",
  i = "flipper",
  n = "mct",
  l = "plain_hex";exports.CardFileParser = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck2(this, _class);
  }
  _createClass2(_class, null, [{
    key: "detectFormat",
    value: function detectFormat(e) {
      var g = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      if (!e) throw new Error("文件内容为空或格式无效");
      if (this.isBinaryData(e)) return a;
      if ("string" != typeof e) throw new Error("不支持的文件内容格式");
      var o = e.trim();
      if (this.isBinaryHexString(e)) return a;
      if (g) {
        var _a = g.toLowerCase().split(".").pop();
        if ("json" === _a) return e.includes('"Created": "proxmark3"') ? s : t;
        if ("nfc" === _a) return i;
        if ("mct" === _a) return n;
        if (["dump", "txt"].includes(_a)) return r;
      }
      try {
        var _e = JSON.parse(o);
        return _e.Created && "proxmark3" === _e.Created ? s : (_e.id && _e.uid && _e.tag, t);
      } catch (_unused) {}
      return e.includes("Filetype: Flipper NFC device") || e.includes("Version: 4") && e.includes("Device type:") ? i : e.includes("+Sector: 0") || e.includes("+Sector:") ? n : e.includes("# Chameleon Card Dump") || e.includes("Block") || e.includes("Sector") || e.includes("# === Card") ? r : this.isPlainHexData(e) ? l : r;
    }
  }, {
    key: "parseFile",
    value: function parseFile(e) {
      var g = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var o = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
      if (!e) throw new Error("文件内容为空");
      switch (g || (g = this.detectFormat(e, o)), console.log("[CardFileParser] \u89E3\u6790\u6587\u4EF6\u683C\u5F0F: ".concat(g)), g) {
        case t:
          return this.parseJSON(e);
        case s:
          return this.parseProxmark3JSON(e);
        case i:
          return this.parseFlipperNFC(e);
        case n:
          return this.parseMCT(e);
        case a:
          return this.parseBinary(e, o);
        case r:
          return this.parseDump(e);
        case l:
          return this.parsePlainHex(e);
        default:
          throw new Error("\u4E0D\u652F\u6301\u7684\u6587\u4EF6\u683C\u5F0F: ".concat(g));
      }
    }
  }, {
    key: "parseJSON",
    value: function parseJSON(e) {
      var _this = this;
      try {
        var _t = JSON.parse(e);
        return Array.isArray(_t) ? _t.map(function (e) {
          return _this.convertToCardSave(e);
        }) : [this.convertToCardSave(_t)];
      } catch (t) {
        throw new Error("JSON \u683C\u5F0F\u89E3\u6790\u5931\u8D25: ".concat(t.message));
      }
    }
  }, {
    key: "parseProxmark3JSON",
    value: function parseProxmark3JSON(e) {
      try {
        var _t2 = JSON.parse(e);
        if (!_t2.Card || !_t2.blocks) throw new Error("不是有效的 Proxmark3 JSON 格式");
        var _r = _t2.Card,
          _a2 = _t2.blocks,
          _s = _r.UID || "",
          _i = _r.SAK || "00",
          _n = parseInt(_i, 16),
          _l = _r.ATQA || "0000",
          g = [parseInt(_l.substring(2, 4), 16), parseInt(_l.substring(0, 2), 16)],
          o = [],
          T = Object.keys(_a2).map(function (e) {
            return parseInt(e);
          }).sort(function (e, t) {
            return e - t;
          });
        var _iterator = _createForOfIteratorHelper2(T),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _e2 = _step.value;
            var _t3 = _a2[_e2.toString()];
            _t3 && _t3.length >= 32 && o.push(this.hexToBytes(_t3));
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        var c = this.getTagTypeByDataSize(16 * o.length);
        return [{
          id: this.generateId(),
          name: _s || "Proxmark3_".concat(Date.now()),
          uid: _s,
          sak: _n,
          atqa: new Uint8Array(g),
          ats: new Uint8Array([]),
          tag: c,
          data: o,
          color: "#FF9800"
        }];
      } catch (t) {
        throw new Error("Proxmark3 JSON \u89E3\u6790\u5931\u8D25: ".concat(t.message));
      }
    }
  }, {
    key: "parseFlipperNFC",
    value: function parseFlipperNFC(e) {
      try {
        var _t4 = e.split("\n");
        var _r2 = "",
          _a3 = 0,
          _s2 = [0, 0];
        var _i2 = [];
        var _iterator2 = _createForOfIteratorHelper2(_t4),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _e3 = _step2.value;
            var _t5 = _e3.trim();
            if (_t5.startsWith("UID:")) _r2 = _t5.substring(4).trim().replace(/\s+/g, "");else if (_t5.startsWith("SAK:")) {
              var _e4 = _t5.substring(4).trim();
              _a3 = parseInt(_e4, 16);
            } else if (_t5.startsWith("ATQA:")) {
              var _e5 = _t5.substring(5).trim().replace(/\s+/g, "");
              _e5.length >= 4 && (_s2 = [parseInt(_e5.substring(0, 2), 16), parseInt(_e5.substring(2, 4), 16)]);
            } else if (_t5.startsWith("Block")) {
              var _e6 = _t5.match(/Block\s+\d+:\s*([\dA-Fa-f\s?]+)/);
              if (_e6) {
                var _t6 = _e6[1].replace(/[?\s]/g, "0").replace(/\s+/g, "");
                _t6.length >= 32 && _i2.push(this.hexToBytes(_t6));
              }
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        if (!_r2 || 0 === _i2.length) throw new Error("无法从 Flipper NFC 文件中提取有效数据");
        var _n2 = this.getTagTypeByDataSize(16 * _i2.length);
        return [{
          id: this.generateId(),
          name: _r2 || "Flipper_".concat(Date.now()),
          uid: _r2,
          sak: _a3,
          atqa: new Uint8Array(_s2),
          ats: new Uint8Array([]),
          tag: _n2,
          data: _i2,
          color: "#4CAF50"
        }];
      } catch (t) {
        throw new Error("Flipper NFC \u89E3\u6790\u5931\u8D25: ".concat(t.message));
      }
    }
  }, {
    key: "parseMCT",
    value: function parseMCT(e) {
      try {
        var _t7 = e.split("\n").filter(function (e) {
            return e.trim();
          }),
          _r3 = [];
        var _a4 = "",
          _s3 = 0,
          _i3 = [0, 0];
        for (var _e7 = 0; _e7 < _t7.length; _e7++) {
          var _n3 = _t7[_e7].trim();
          if (!_n3.startsWith("+Sector:")) {
            if (1 === _e7 && _n3.length >= 16 && (_a4 = _n3.substring(0, 8), _n3.length >= 12 && (_s3 = parseInt(_n3.substring(10, 12), 16)), _n3.length >= 16)) {
              var _e8 = _n3.substring(12, 16);
              _i3 = [parseInt(_e8.substring(2, 4), 16), parseInt(_e8.substring(0, 2), 16)];
            }
            _n3.length >= 32 && /^[0-9A-Fa-f]+$/.test(_n3) && _r3.push(this.hexToBytes(_n3));
          }
        }
        if (0 === _r3.length) throw new Error("MCT 文件中没有找到有效的块数据");
        var _n4 = this.getTagTypeByDataSize(16 * _r3.length);
        return [{
          id: this.generateId(),
          name: _a4 || "MCT_".concat(Date.now()),
          uid: _a4,
          sak: _s3,
          atqa: new Uint8Array(_i3),
          ats: new Uint8Array([]),
          tag: _n4,
          data: _r3,
          color: "#9C27B0"
        }];
      } catch (t) {
        throw new Error("MCT \u683C\u5F0F\u89E3\u6790\u5931\u8D25: ".concat(t.message));
      }
    }
  }, {
    key: "parseBinary",
    value: function parseBinary(t) {
      var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      try {
        var _a5;
        if (console.log("[CardFileParser] \u5F00\u59CB\u89E3\u6790\u4E8C\u8FDB\u5236\u6587\u4EF6, \u6587\u4EF6\u540D: ".concat(r)), "string" == typeof t) {
          if (/^[0-9A-Fa-f\s]*$/.test(t)) {
            var _e9 = t.replace(/\s+/g, "");
            _a5 = this.hexToBytes(_e9), console.log("[CardFileParser] \u89E3\u6790\u5341\u516D\u8FDB\u5236\u5B57\u7B26\u4E32, \u6570\u636E\u957F\u5EA6: ".concat(_a5.length, "\u5B57\u8282"));
          } else {
            var _e10 = [];
            for (var _r4 = 0; _r4 < t.length; _r4++) _e10.push(255 & t.charCodeAt(_r4));
            _a5 = new Uint8Array(_e10), console.log("[CardFileParser] \u89E3\u6790\u539F\u59CB\u4E8C\u8FDB\u5236\u5B57\u7B26\u4E32, \u6570\u636E\u957F\u5EA6: ".concat(_a5.length, "\u5B57\u8282"));
          }
        } else if (t instanceof ArrayBuffer || "object" == _typeof2(t) && null !== t && "number" == typeof t.byteLength && !("length" in t) && !("string" in t)) _a5 = new Uint8Array(t), console.log("[CardFileParser] \u89E3\u6790ArrayBuffer, \u6570\u636E\u957F\u5EA6: ".concat(_a5.length, "\u5B57\u8282"));else {
          if (!(t instanceof Uint8Array)) throw new Error("不支持的二进制数据格式");
          _a5 = t, console.log("[CardFileParser] \u89E3\u6790Uint8Array, \u6570\u636E\u957F\u5EA6: ".concat(_a5.length, "\u5B57\u8282"));
        }
        var _s4 = this.getTagTypeByDataSize(_a5.length);
        if (console.log("[CardFileParser] \u68C0\u6D4B\u5230\u5361\u7247\u7C7B\u578B: ".concat(_s4)), _s4 === e.TagType.UNKNOWN) throw new Error("\u65E0\u6CD5\u8BC6\u522B\u7684\u5361\u7247\u7C7B\u578B\uFF0C\u6570\u636E\u5927\u5C0F: ".concat(_a5.length, "\u5B57\u8282"));
        return _s4 === e.TagType.EM410X || _s4 === e.TagType.EM410X16 || _s4 === e.TagType.EM410X32 || _s4 === e.TagType.EM410X64 ? (console.log("[CardFileParser] 检测到低频卡，直接解析"), this.parseBinaryCard(_a5, _s4, r)) : this.isNTAG(_s4) ? (console.log("[CardFileParser] 检测到NTAG系列卡片，默认使用7字节UID"), this.parseBinaryCard(_a5, _s4, r, 7)) : this.isMifareClassic(_s4) ? (console.log("[CardFileParser] 检测到Mifare Classic卡片，需要选择UID长度"), {
          needsUidSelection: !0,
          tagType: _s4,
          cardName: this.getCardNameFromFilename(r) || "Binary_".concat(Date.now()),
          bytes: _a5
        }) : (console.log("[CardFileParser] 解析其他类型卡片，使用4字节UID"), this.parseBinaryCard(_a5, _s4, r, 4));
      } catch (a) {
        throw console.error("[CardFileParser] 二进制文件解析失败:", a), new Error("\u4E8C\u8FDB\u5236\u6587\u4EF6\u89E3\u6790\u5931\u8D25: ".concat(a.message));
      }
    }
  }, {
    key: "parseBinaryCard",
    value: function parseBinaryCard(t, r) {
      var a = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
      var s = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 4;
      console.log("[CardFileParser] \u5F00\u59CB\u89E3\u6790\u4E8C\u8FDB\u5236\u5361\u7247\u6570\u636E - \u7C7B\u578B:".concat(r, ", UID\u957F\u5EA6:").concat(s));
      var i = "",
        n = 0,
        l = [0, 0],
        g = this.getCardNameFromFilename(a) || this.getCardTypeName(r);
      if (r === e.TagType.EM410X || r === e.TagType.EM410X16 || r === e.TagType.EM410X32 || r === e.TagType.EM410X64) return i = this.bytesToHex(t), console.log("[CardFileParser] \u5904\u7406\u4F4E\u9891\u5361\u7247, UID:".concat(i)), [{
        id: this.generateId(),
        name: g || "EM410X_".concat(i.substring(0, 6)),
        uid: i,
        tag: r,
        data: [t],
        sak: 0,
        atqa: new Uint8Array([0, 0]),
        ats: new Uint8Array([]),
        color: "#45B7D1"
      }];
      if (this.isMifareClassic(r)) {
        if (t.length >= 1024) {
          var _e11 = t.slice(0, 16);
          if (4 === s) i = this.bytesToHex(_e11.slice(0, 4)), _e11.length > 5 && (n = _e11[5]), _e11.length > 7 && (l = [_e11[6], _e11[7]]);else if (7 === s) {
            if (136 === _e11[0]) {
              var _t8 = [].concat(_toConsumableArray2(_e11.slice(1, 4)), _toConsumableArray2(_e11.slice(4, 8)));
              i = this.bytesToHex(_t8);
            } else i = this.bytesToHex(_e11.slice(0, 7));
            n = this.getDefaultSAK(r, 7), l = this.getDefaultATQA(r, 7);
          }
        } else if (4 === s) i = t.length >= 4 ? this.bytesToHex(t.slice(0, 4)) : this.generateRandomUID(4), t.length > 5 && (n = t[5]), t.length > 7 && (l = [t[6], t[7]]);else if (7 === s) {
          if (t.length >= 7) {
            if (136 === t[0] && t.length >= 8) {
              var _e12 = [].concat(_toConsumableArray2(t.slice(1, 4)), _toConsumableArray2(t.slice(4, 8)));
              i = this.bytesToHex(_e12);
            } else i = this.bytesToHex(t.slice(0, 7));
          } else i = this.generateRandomUID(7);
          n = this.getDefaultSAK(r, 7), l = this.getDefaultATQA(r, 7);
        }
      } else this.isNTAG(r) || this.isMifareUltralight(r) ? (i = t.length >= 8 ? this.bytesToHex([].concat(_toConsumableArray2(t.slice(0, 3)), _toConsumableArray2(t.slice(4, 8)))) : t.length >= 7 ? this.bytesToHex(t.slice(0, 7)) : this.generateRandomUID(7), n = 0, l = [68, 0]) : (i = t.length >= 4 && 4 === s ? this.bytesToHex(t.slice(0, 4)) : t.length >= 7 && 7 === s ? this.bytesToHex(t.slice(0, 7)) : this.generateRandomUID(s), n = this.getDefaultSAK(r, s), l = this.getDefaultATQA(r, s));
      var o = this.isMifareUltralight(r) || this.isNTAG(r) ? 4 : 16,
        T = [];
      for (var _e13 = 0; _e13 < t.length; _e13 += o) {
        var _r5 = t.slice(_e13, _e13 + o);
        if (_r5.length === o) T.push(_r5);else {
          var _e14 = new Uint8Array(o);
          _e14.set(_r5), T.push(_e14);
        }
      }
      return i || (i = this.bytesToHex(this.generateRandomUID(s || 4))), console.log("[CardFileParser] \u5361\u7247\u89E3\u6790\u5B8C\u6210 - UID:".concat(i, ", SAK:0x").concat(n.toString(16), ", ATQA:[").concat(l.map(function (e) {
        return "0x" + e.toString(16);
      }).join(","), "]")), [{
        id: this.generateId(),
        name: g || "".concat(this.getCardTypeName(r), "_").concat(i.substring(0, 6)),
        uid: i,
        sak: n,
        atqa: new Uint8Array(l),
        ats: new Uint8Array([]),
        tag: r,
        data: T,
        color: this.getColorForCardType(r)
      }];
    }
  }, {
    key: "createCardWithUidLength",
    value: function createCardWithUidLength(e, t, r) {
      var a = e.tagType,
        s = e.bytes;
      return this.parseBinaryCard(s, a, r, t)[0];
    }
  }, {
    key: "parseDump",
    value: function parseDump(e) {
      try {
        var _r6 = [];
        if (e.includes("# === Card")) {
          var _a6 = e.split("# === Card");
          for (var _e15 = 1; _e15 < _a6.length; _e15++) try {
            var _t9 = this.parseDumpSection(_a6[_e15]);
            _t9 && _r6.push(_t9);
          } catch (t) {
            console.warn("\u8DF3\u8FC7\u65E0\u6548\u7684 dump \u6BB5\u843D: ".concat(t.message));
          }
        }
        if (0 === _r6.length) {
          var _t10 = this.parseSingleDump(e);
          _t10 && _r6.push(_t10);
        }
        if (0 === _r6.length) throw new Error("Dump 文件中没有找到有效的卡片数据");
        return _r6;
      } catch (t) {
        throw new Error("Dump \u683C\u5F0F\u89E3\u6790\u5931\u8D25: ".concat(t.message));
      }
    }
  }, {
    key: "parseDumpSection",
    value: function parseDumpSection(t) {
      var r = t.split("\n");
      var a = "",
        s = "",
        i = e.TagType.UNKNOWN;
      var n = [];
      var _iterator3 = _createForOfIteratorHelper2(r),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _e16 = _step3.value;
          var _t11 = _e16.trim();
          if (_t11.startsWith("# Name:")) a = _t11.substring(7).trim();else if (_t11.startsWith("# UID:")) s = _t11.substring(6).trim();else if (_t11.startsWith("# Type:")) {
            var _e17 = _t11.substring(7).trim();
            i = this.parseTagType(_e17);
          } else if (!_t11.startsWith("#") && _t11.length >= 8) {
            var _e18 = _t11.replace(/\s+/g, "");
            /^[0-9A-Fa-f]+$/.test(_e18) && n.push(this.hexToBytes(_e18));
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      if (0 === n.length) throw new Error("Dump 段落中没有找到有效数据");
      return {
        id: this.generateId(),
        name: a || s || "Dump_".concat(Date.now()),
        uid: s,
        sak: 0,
        atqa: new Uint8Array([0, 0]),
        ats: new Uint8Array([]),
        tag: i !== e.TagType.UNKNOWN ? i : this.getTagTypeByDataSize(16 * n.length),
        data: n,
        color: "#2196F3"
      };
    }
  }, {
    key: "parseSingleDump",
    value: function parseSingleDump(e) {
      var t = e.split("\n").filter(function (e) {
          var t = e.trim();
          return t && !t.startsWith("#");
        }),
        r = [];
      var _iterator4 = _createForOfIteratorHelper2(t),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _i4 = _step4.value;
          var _e19 = _i4.replace(/\s+/g, "");
          _e19.length >= 8 && /^[0-9A-Fa-f]+$/.test(_e19) && r.push(this.hexToBytes(_e19));
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      if (0 === r.length) return null;
      var a = this.getTagTypeByDataSize(16 * r.length);
      var s = "";
      return r.length > 0 && r[0].length >= 4 && (s = this.bytesToHex(r[0].slice(0, 4))), {
        id: this.generateId(),
        name: s || "Dump_".concat(Date.now()),
        uid: s,
        sak: 0,
        atqa: new Uint8Array([0, 0]),
        ats: new Uint8Array([]),
        tag: a,
        data: r,
        color: "#2196F3"
      };
    }
  }, {
    key: "parsePlainHex",
    value: function parsePlainHex(e) {
      try {
        var _t12 = e.replace(/\s+/g, "");
        if (!/^[0-9A-Fa-f]+$/.test(_t12)) throw new Error("不是有效的十六进制数据");
        var _r7 = this.hexToBytes(_t12),
          _a7 = this.getTagTypeByDataSize(_r7.length),
          _s5 = this.isMifareUltralight(_a7) ? 4 : 16,
          _i5 = [];
        for (var _e20 = 0; _e20 < _r7.length; _e20 += _s5) _i5.push(_r7.slice(_e20, _e20 + _s5));
        var _n5 = "";
        return _i5.length > 0 && _i5[0].length >= 4 && (_n5 = this.bytesToHex(_i5[0].slice(0, 4))), [{
          id: this.generateId(),
          name: _n5 || "Hex_".concat(Date.now()),
          uid: _n5,
          sak: 0,
          atqa: new Uint8Array([0, 0]),
          ats: new Uint8Array([]),
          tag: _a7,
          data: _i5,
          color: "#795548"
        }];
      } catch (t) {
        throw new Error("\u5341\u516D\u8FDB\u5236\u6570\u636E\u89E3\u6790\u5931\u8D25: ".concat(t.message));
      }
    }
  }, {
    key: "isBinaryHexString",
    value: function isBinaryHexString(e) {
      if ("string" != typeof e) return !1;
      var t = e.replace(/\s+/g, "");
      return !!(t.length > 100 && /^[0-9A-Fa-f]+$/.test(t));
    }
  }, {
    key: "isBinaryData",
    value: function isBinaryData(e) {
      if (e instanceof ArrayBuffer || e instanceof Uint8Array) return !0;
      if ("string" == typeof e) {
        var _t13 = Math.min(500, e.length);
        var _r8 = 0;
        for (var _a8 = 0; _a8 < _t13; _a8++) {
          var _t14 = e.charCodeAt(_a8);
          (_t14 < 32 || _t14 > 126) && 9 !== _t14 && 10 !== _t14 && 13 !== _t14 && _r8++;
        }
        return _r8 / _t13 > .15;
      }
      return !1;
    }
  }, {
    key: "isPlainHexData",
    value: function isPlainHexData(e) {
      if ("string" != typeof e) return !1;
      var t = e.split("\n");
      var r = 0;
      var _iterator5 = _createForOfIteratorHelper2(t),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _a9 = _step5.value;
          var _e21 = _a9.trim();
          _e21 && /^[0-9A-Fa-f\s]+$/.test(_e21) && r++;
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      return r > 0 && r / t.length > .8;
    }
  }, {
    key: "hexToBytes",
    value: function hexToBytes(e) {
      var t = e.replace(/\s+/g, ""),
        r = new Uint8Array(t.length / 2);
      for (var _a10 = 0; _a10 < t.length; _a10 += 2) r[_a10 / 2] = parseInt(t.substr(_a10, 2), 16);
      return r;
    }
  }, {
    key: "bytesToHex",
    value: function bytesToHex(e) {
      return Array.from(e).map(function (e) {
        return e.toString(16).padStart(2, "0");
      }).join("").toUpperCase();
    }
  }, {
    key: "getTagTypeByDataSize",
    value: function getTagTypeByDataSize(t) {
      switch (t) {
        case 320:
          return e.TagType.MIFARE_Mini;
        case 1024:
          return e.TagType.MIFARE_1024;
        case 1088:
        case 2048:
          return e.TagType.MIFARE_2048;
        case 4096:
          return e.TagType.MIFARE_4096;
        case 64:
          return e.TagType.MIFARE_Ultralight;
        case 192:
          return e.TagType.MIFARE_Ultralight_C;
        case 80:
          return e.TagType.MIFARE_Ultralight_EV1_11;
        case 164:
          return e.TagType.NTAG_212;
        case 180:
          return e.TagType.NTAG_213;
        case 540:
          return e.TagType.NTAG_215;
        case 924:
        case 932:
          return e.TagType.NTAG_216;
        case 5:
          return e.TagType.EM410X;
        case 2:
        case 3:
        case 4:
          if (t >= 2 && t <= 5) return e.TagType.EM410X;
        default:
          return t < 20 ? e.TagType.EM410X : t <= 100 ? e.TagType.MIFARE_Ultralight : t <= 320 ? e.TagType.MIFARE_Mini : t <= 1024 ? e.TagType.MIFARE_1024 : t <= 2048 ? e.TagType.MIFARE_2048 : t <= 4096 ? e.TagType.MIFARE_4096 : e.TagType.UNKNOWN;
      }
    }
  }, {
    key: "isMifareClassic",
    value: function isMifareClassic(t) {
      return [e.TagType.MIFARE_1024, e.TagType.MIFARE_2048, e.TagType.MIFARE_4096].includes(t);
    }
  }, {
    key: "isMifareUltralight",
    value: function isMifareUltralight(t) {
      return [e.TagType.MIFARE_Ultralight, e.TagType.MIFARE_Ultralight_C, e.TagType.MIFARE_Ultralight_EV1_11, e.TagType.MIFARE_Ultralight_EV1_21].includes(t);
    }
  }, {
    key: "isNTAG",
    value: function isNTAG(t) {
      return [e.TagType.NTAG_210, e.TagType.NTAG_212, e.TagType.NTAG_213, e.TagType.NTAG_215, e.TagType.NTAG_216].includes(t);
    }
  }, {
    key: "getCardNameFromFilename",
    value: function getCardNameFromFilename(e) {
      if (!e) return "";
      var t = e.split("/").pop();
      return t = t.split("\\\\").pop(), t = t.split(".")[0], t = t.replace(/[^\w\d\u4e00-\u9fa5\s-]/g, "").trim(), t.length > 30 && (t = t.substring(0, 30) + "..."), t || "\u5BFC\u5165\u5361\u7247_".concat(Date.now());
    }
  }, {
    key: "getDefaultSAK",
    value: function getDefaultSAK(e, t) {
      return this.isMifareClassic(e) ? 7 === t ? 24 : 8 : 0;
    }
  }, {
    key: "getDefaultATQA",
    value: function getDefaultATQA(e, t) {
      return this.isMifareClassic(e) ? 7 === t ? [0, 4] : [0, 2] : this.isMifareUltralight(e) ? [0, 68] : [0, 0];
    }
  }, {
    key: "parseTagType",
    value: function parseTagType(t) {
      var r = t.toUpperCase();
      return r.includes("MIFARE") && r.includes("1K") ? e.TagType.MIFARE_1024 : r.includes("MIFARE") && r.includes("2K") ? e.TagType.MIFARE_2048 : r.includes("MIFARE") && r.includes("4K") ? e.TagType.MIFARE_4096 : r.includes("ULTRALIGHT") ? e.TagType.MIFARE_ULTRALIGHT : r.includes("NTAG213") ? e.TagType.NTAG_213 : r.includes("NTAG215") ? e.TagType.NTAG_215 : r.includes("NTAG216") ? e.TagType.NTAG_216 : e.TagType.UNKNOWN;
    }
  }, {
    key: "convertToCardSave",
    value: function convertToCardSave(t) {
      return t.id && t.uid && void 0 !== t.tag ? t : {
        id: t.id || this.generateId(),
        name: t.name || "Imported Card",
        uid: t.uid || "",
        sak: t.sak || 0,
        atqa: t.atqa || new Uint8Array([0, 0]),
        ats: t.ats || new Uint8Array([]),
        tag: t.tag || e.TagType.UNKNOWN,
        data: t.data || [],
        color: t.color || "#2196F3"
      };
    }
  }, {
    key: "generateId",
    value: function generateId() {
      return "card_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    }
  }, {
    key: "generateRandomUID",
    value: function generateRandomUID() {
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;
      var t = new Uint8Array(e);
      for (var _r9 = 0; _r9 < e; _r9++) t[_r9] = Math.floor(256 * Math.random());
      return this.bytesToHex(t);
    }
  }, {
    key: "getCardTypeName",
    value: function getCardTypeName(t) {
      var _e$TagType$UNKNOWN$e$;
      return (_e$TagType$UNKNOWN$e$ = {}, _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.UNKNOWN, "未知类型"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.EM410X, "EM410X"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.EM410X16, "EM410X-16"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.EM410X32, "EM410X-32"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.EM410X64, "EM410X-64"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.VIKING, "Viking"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.HID_PROX, "HID Prox"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.MIFARE_Mini, "Mifare Mini"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.MIFARE_1024, "Mifare Classic 1K"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.MIFARE_2048, "Mifare Classic 2K"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.MIFARE_4096, "Mifare Classic 4K"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.NTAG_210, "NTAG210"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.NTAG_212, "NTAG212"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.NTAG_213, "NTAG213"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.NTAG_215, "NTAG215"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.NTAG_216, "NTAG216"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.MIFARE_Ultralight, "Mifare Ultralight"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.MIFARE_Ultralight_C, "Mifare Ultralight C"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.MIFARE_Ultralight_EV1_11, "Ultralight EV1-11"), _defineProperty2(_e$TagType$UNKNOWN$e$, e.TagType.MIFARE_Ultralight_EV1_21, "Ultralight EV1-21"), _e$TagType$UNKNOWN$e$)[t] || "未知类型";
    }
  }, {
    key: "getColorForCardType",
    value: function getColorForCardType(t) {
      var _e$TagType$EM410X$e$T;
      return (_e$TagType$EM410X$e$T = {}, _defineProperty2(_e$TagType$EM410X$e$T, e.TagType.EM410X, "#45B7D1"), _defineProperty2(_e$TagType$EM410X$e$T, e.TagType.EM410X16, "#45B7D1"), _defineProperty2(_e$TagType$EM410X$e$T, e.TagType.EM410X32, "#45B7D1"), _defineProperty2(_e$TagType$EM410X$e$T, e.TagType.EM410X64, "#45B7D1"), _defineProperty2(_e$TagType$EM410X$e$T, e.TagType.VIKING, "#3498db"), _defineProperty2(_e$TagType$EM410X$e$T, e.TagType.HID_PROX, "#2ecc71"), _defineProperty2(_e$TagType$EM410X$e$T, e.TagType.MIFARE_Mini, "#FF5722"), _defineProperty2(_e$TagType$EM410X$e$T, e.TagType.MIFARE_1024, "#FF5722"), _defineProperty2(_e$TagType$EM410X$e$T, e.TagType.MIFARE_2048, "#FF5722"), _defineProperty2(_e$TagType$EM410X$e$T, e.TagType.MIFARE_4096, "#FF5722"), _defineProperty2(_e$TagType$EM410X$e$T, e.TagType.NTAG_210, "#9C27B0"), _defineProperty2(_e$TagType$EM410X$e$T, e.TagType.NTAG_212, "#9C27B0"), _defineProperty2(_e$TagType$EM410X$e$T, e.TagType.NTAG_213, "#9C27B0"), _defineProperty2(_e$TagType$EM410X$e$T, e.TagType.NTAG_215, "#9C27B0"), _defineProperty2(_e$TagType$EM410X$e$T, e.TagType.NTAG_216, "#9C27B0"), _defineProperty2(_e$TagType$EM410X$e$T, e.TagType.MIFARE_Ultralight, "#4CAF50"), _defineProperty2(_e$TagType$EM410X$e$T, e.TagType.MIFARE_Ultralight_C, "#4CAF50"), _defineProperty2(_e$TagType$EM410X$e$T, e.TagType.MIFARE_Ultralight_EV1_11, "#4CAF50"), _defineProperty2(_e$TagType$EM410X$e$T, e.TagType.MIFARE_Ultralight_EV1_21, "#4CAF50"), _e$TagType$EM410X$e$T)[t] || "#607D8B";
    }
  }]);
  return _class;
}();