var e = require("../../../../../common/vendor.js"),
  _e$initVueI18n = e.initVueI18n(e.messages$2),
  t = _e$initVueI18n.t,
  a = {
    name: "UniSearchBar",
    emits: ["input", "update:modelValue", "clear", "cancel", "confirm", "blur", "focus"],
    props: {
      placeholder: {
        type: String,
        default: ""
      },
      radius: {
        type: [Number, String],
        default: 5
      },
      clearButton: {
        type: String,
        default: "auto"
      },
      cancelButton: {
        type: String,
        default: "auto"
      },
      cancelText: {
        type: String,
        default: ""
      },
      bgColor: {
        type: String,
        default: "#F8F8F8"
      },
      textColor: {
        type: String,
        default: "#000000"
      },
      maxlength: {
        type: [Number, String],
        default: 100
      },
      value: {
        type: [Number, String],
        default: ""
      },
      modelValue: {
        type: [Number, String],
        default: ""
      },
      focus: {
        type: Boolean,
        default: !1
      },
      readonly: {
        type: Boolean,
        default: !1
      }
    },
    data: function data() {
      return {
        show: !1,
        showSync: !1,
        searchVal: ""
      };
    },
    computed: {
      cancelTextI18n: function cancelTextI18n() {
        return this.cancelText || t("uni-search-bar.cancel");
      },
      placeholderText: function placeholderText() {
        return this.placeholder || t("uni-search-bar.placeholder");
      }
    },
    watch: {
      modelValue: {
        immediate: !0,
        handler: function handler(e) {
          this.searchVal = e, e && (this.show = !0);
        }
      },
      focus: {
        immediate: !0,
        handler: function handler(e) {
          var _this = this;
          if (e) {
            if (this.readonly) return;
            this.show = !0, this.$nextTick(function () {
              _this.showSync = !0;
            });
          }
        }
      },
      searchVal: function searchVal(e, t) {
        this.$emit("input", e), this.$emit("update:modelValue", e);
      }
    },
    methods: {
      searchClick: function searchClick() {
        var _this2 = this;
        this.readonly || this.show || (this.show = !0, this.$nextTick(function () {
          _this2.showSync = !0;
        }));
      },
      clear: function clear() {
        var _this3 = this;
        this.searchVal = "", this.$nextTick(function () {
          _this3.$emit("clear", {
            value: ""
          });
        });
      },
      cancel: function cancel() {
        this.readonly || (this.$emit("cancel", {
          value: this.searchVal
        }), this.searchVal = "", this.show = !1, this.showSync = !1, e.index.hideKeyboard());
      },
      confirm: function confirm() {
        e.index.hideKeyboard(), this.$emit("confirm", {
          value: this.searchVal
        });
      },
      blur: function blur() {
        e.index.hideKeyboard(), this.$emit("blur", {
          value: this.searchVal
        });
      },
      emitFocus: function emitFocus(e) {
        this.$emit("focus", e.detail);
      }
    }
  };if (!Array) {
  e.resolveComponent("uni-icons")();
}Math;var l = e._export_sfc(a, [["render", function (t, a, l, c, r, o) {
  return e.e({
    a: e.p({
      color: "#c0c4cc",
      size: "18",
      type: "search"
    }),
    b: r.show || r.searchVal
  }, r.show || r.searchVal ? {
    c: r.showSync,
    d: l.readonly,
    e: o.placeholderText,
    f: l.maxlength,
    g: l.textColor,
    h: e.o(function () {
      return o.confirm && o.confirm.apply(o, arguments);
    }),
    i: e.o(function () {
      return o.blur && o.blur.apply(o, arguments);
    }),
    j: e.o(function () {
      return o.emitFocus && o.emitFocus.apply(o, arguments);
    }),
    k: r.searchVal,
    l: e.o(function (e) {
      return r.searchVal = e.detail.value;
    })
  } : {
    m: e.t(l.placeholder)
  }, {
    n: r.show && ("always" === l.clearButton || "auto" === l.clearButton && "" !== r.searchVal) && !l.readonly
  }, r.show && ("always" === l.clearButton || "auto" === l.clearButton && "" !== r.searchVal) && !l.readonly ? {
    o: e.p({
      color: "#c0c4cc",
      size: "20",
      type: "clear"
    }),
    p: e.o(function () {
      return o.clear && o.clear.apply(o, arguments);
    })
  } : {}, {
    q: l.radius + "px",
    r: l.bgColor,
    s: e.o(function () {
      return o.searchClick && o.searchClick.apply(o, arguments);
    }),
    t: "always" === l.cancelButton || r.show && "auto" === l.cancelButton
  }, "always" === l.cancelButton || r.show && "auto" === l.cancelButton ? {
    v: e.t(o.cancelTextI18n),
    w: e.o(function () {
      return o.cancel && o.cancel.apply(o, arguments);
    })
  } : {});
}]]);wx.createComponent(l);