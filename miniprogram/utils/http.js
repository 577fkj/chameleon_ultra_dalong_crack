var _objectSpread2 = require("../@babel/runtime/helpers/objectSpread2");var _classCallCheck2 = require("../@babel/runtime/helpers/classCallCheck");var _createClass2 = require("../@babel/runtime/helpers/createClass");var e = require("../common/vendor.js");var t = new ( /*#__PURE__*/function () {
  function _class() {
    _classCallCheck2(this, _class);
  }
  _createClass2(_class, [{
    key: "get",
    value: function get(e) {
      var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var s = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.request(_objectSpread2({
        url: e,
        method: "GET",
        data: t
      }, s));
    }
  }, {
    key: "post",
    value: function post(e) {
      var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var s = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.request(_objectSpread2({
        url: e,
        method: "POST",
        data: t
      }, s));
    }
  }, {
    key: "request",
    value: function request(t) {
      var _this = this;
      var s = {
        url: t.url.startsWith("http") ? t.url : "https://i.tlq520.cn/ultra/api/v1".concat(t.url),
        method: t.method || "GET",
        data: t.data || {},
        header: _objectSpread2({
          "Content-Type": t.contentType || "application/json"
        }, t.header),
        timeout: t.timeout || 3e4
      };
      return this.beforeRequest(s), new Promise(function (t, r) {
        e.index.request(_objectSpread2(_objectSpread2({}, s), {}, {
          success: function success(e) {
            _this.handleResponse(e, t, r);
          },
          fail: function fail(e) {
            _this.handleError(e, r);
          }
        }));
      });
    }
  }, {
    key: "beforeRequest",
    value: function beforeRequest(e) {
      console.log("[HTTP] 请求开始", e);
    }
  }, {
    key: "handleResponse",
    value: function handleResponse(e, t, s) {
      var r, o;
      if (console.log("[HTTP] 响应数据", e), e.statusCode >= 200 && e.statusCode < 300) {
        if (e.data instanceof ArrayBuffer) return console.log("[HTTP] 返回二进制数据，长度:", e.data.byteLength), void t(e.data);
        if (e.data && 200 === e.data.code) t(e.data);else {
          var _t = new Error((null == (r = e.data) ? void 0 : r.message) || "请求失败");
          _t.code = (null == (o = e.data) ? void 0 : o.code) || -1, _t.data = e.data, s(_t);
        }
      } else {
        var _t2 = new Error("HTTP \u9519\u8BEF: ".concat(e.statusCode));
        _t2.statusCode = e.statusCode, _t2.data = e.data, s(_t2);
      }
    }
  }, {
    key: "handleError",
    value: function handleError(e, t) {
      console.error("[HTTP] 请求错误", e);
      var s = "网络请求失败";
      e.errMsg && (e.errMsg.includes("timeout") ? s = "请求超时" : e.errMsg.includes("fail") && (s = "网络连接失败"));
      var r = new Error(s);
      r.original = e, t(r);
    }
  }]);
  return _class;
}())();exports.http = t;