var _defineProperty2 = require("../@babel/runtime/helpers/defineProperty");var _toConsumableArray2 = require("../@babel/runtime/helpers/toConsumableArray");require("../@babel/runtime/helpers/Arrayincludes");var _objectSpread2 = require("../@babel/runtime/helpers/objectSpread2");var _classCallCheck2 = require("../@babel/runtime/helpers/classCallCheck");var _createClass2 = require("../@babel/runtime/helpers/createClass");var e = require("../common/vendor.js"),
  r = "bluetooth",
  o = "device",
  n = "data",
  t = "system",
  s = "info",
  i = "warning",
  l = "error",
  a = "critical";var d = new ( /*#__PURE__*/function () {
  function _class() {
    _classCallCheck2(this, _class);
    this.errorLog = [], this.maxLogSize = 100;
  }
  _createClass2(_class, [{
    key: "handle",
    value: function handle(e) {
      var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : t;
      var o = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : l;
      var n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var s = this._formatError(e, r, o, n);
      return this._logError(s), this._showUserMessage(s), o === a && this._reportError(s), s;
    }
  }, {
    key: "handleBluetoothError",
    value: function handleBluetoothError(e) {
      var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var n = "蓝牙操作失败",
        t = l;
      return "string" == typeof e && (e.includes("not available") ? n = "蓝牙不可用，请检查设备蓝牙设置" : e.includes("permission") ? (n = "缺少蓝牙权限，请在设置中允许蓝牙访问", t = i) : e.includes("timeout") ? n = "连接超时，请重试" : e.includes("connection failed") ? n = "设备连接失败，请确保设备已开机且在范围内" : e.includes("service not found") && (n = "设备服务不可用，请检查设备固件版本")), this.handle(e, r, t, _objectSpread2(_objectSpread2({}, o), {}, {
        userMessage: n
      }));
    }
  }, {
    key: "handleDeviceError",
    value: function handleDeviceError(e) {
      var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var n = "设备操作失败";
      return "string" == typeof e && (e.includes("not connected") ? n = "设备未连接，请先连接设备" : e.includes("command failed") ? n = "设备命令执行失败，请重试" : e.includes("invalid response") ? n = "设备响应异常，请检查设备状态" : e.includes("firmware") && (n = "固件版本不兼容，请更新设备固件")), this.handle(e, o, l, _objectSpread2(_objectSpread2({}, r), {}, {
        userMessage: n
      }));
    }
  }, {
    key: "handleDataError",
    value: function handleDataError(e) {
      var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var o = "数据处理失败";
      return "string" == typeof e && (e.includes("invalid format") ? o = "数据格式无效，请检查输入" : e.includes("validation") ? o = "数据验证失败，请确认输入内容" : e.includes("storage") ? o = "数据存储失败，请检查设备存储空间" : e.includes("parse") && (o = "数据解析失败，文件可能已损坏")), this.handle(e, n, i, _objectSpread2(_objectSpread2({}, r), {}, {
        userMessage: o
      }));
    }
  }, {
    key: "getErrorLog",
    value: function getErrorLog() {
      return _toConsumableArray2(this.errorLog);
    }
  }, {
    key: "clearErrorLog",
    value: function clearErrorLog() {
      this.errorLog = [];
    }
  }, {
    key: "exportErrorLog",
    value: function exportErrorLog() {
      return JSON.stringify(this.errorLog, null, 2);
    }
  }, {
    key: "_formatError",
    value: function _formatError(e, r, o, n) {
      return {
        timestamp: new Date().toISOString(),
        type: r,
        level: o,
        message: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : void 0,
        context: n,
        userMessage: n.userMessage || this._getDefaultUserMessage(r, o)
      };
    }
  }, {
    key: "_logError",
    value: function _logError(r) {
      this.errorLog.unshift(r), this.errorLog.length > this.maxLogSize && (this.errorLog = this.errorLog.slice(0, this.maxLogSize));
      var o = r.level === a || r.level === l ? "error" : r.level === i ? "warn" : "log";
      console[o]("[ErrorHandler]", r.type, r.message, r.context);
      try {
        var _o = e.index.getStorageSync("error_log") || [];
        _o.unshift(r);
        var _n = _o.slice(0, 50);
        e.index.setStorageSync("error_log", _n);
      } catch (n) {
        console.warn("[ErrorHandler] Failed to save error log to storage:", n);
      }
    }
  }, {
    key: "_showUserMessage",
    value: function _showUserMessage(r) {
      var o = r.level,
        n = r.userMessage;
      o === s ? e.index.showToast({
        title: n,
        icon: "none",
        duration: 2e3
      }) : o === i ? e.index.showToast({
        title: n,
        icon: "none",
        duration: 3e3
      }) : e.index.showModal({
        title: o === a ? "严重错误" : "操作失败",
        content: n,
        showCancel: !1,
        confirmText: "确定"
      });
    }
  }, {
    key: "_reportError",
    value: function _reportError(e) {
      console.warn("[ErrorHandler] Critical error reported:", e);
    }
  }, {
    key: "_getDefaultUserMessage",
    value: function _getDefaultUserMessage(e, t) {
      var _r, _o2, _n2, _r$o$n$e;
      var s;
      return (null == (s = (_r$o$n$e = {}, _defineProperty2(_r$o$n$e, r, (_r = {}, _defineProperty2(_r, l, "蓝牙连接出现问题，请重试"), _defineProperty2(_r, i, "蓝牙操作需要注意"), _defineProperty2(_r, a, "蓝牙系统严重错误"), _r)), _defineProperty2(_r$o$n$e, o, (_o2 = {}, _defineProperty2(_o2, l, "设备操作失败，请检查设备状态"), _defineProperty2(_o2, i, "设备操作需要注意"), _defineProperty2(_o2, a, "设备系统严重错误"), _o2)), _defineProperty2(_r$o$n$e, n, (_n2 = {}, _defineProperty2(_n2, l, "数据操作失败，请重试"), _defineProperty2(_n2, i, "数据格式需要注意"), _defineProperty2(_n2, a, "数据严重损坏"), _n2)), _r$o$n$e)[e]) ? void 0 : s[t]) || "操作失败，请重试";
    }
  }]);
  return _class;
}())();"undefined" != typeof window && (window.addEventListener("error", function (e) {
  d.handle(e.error || e.message, t, l, {
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno
  });
}), window.addEventListener("unhandledrejection", function (e) {
  d.handle(e.reason, t, l, {
    type: "unhandledrejection"
  });
})), exports.errorHandler = d, exports.installErrorHandler = function (e) {
  e && e.config && (e.config.errorHandler = function (e, r, o) {
    var n;
    d.handle(e, t, l, {
      component: (null == (n = null == r ? void 0 : r.$options) ? void 0 : n.name) || "Unknown",
      errorInfo: o
    });
  });
};