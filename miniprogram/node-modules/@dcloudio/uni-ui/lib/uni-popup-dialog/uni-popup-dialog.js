var e = require("../../../../../common/vendor.js"),
  _e$initVueI18n = e.initVueI18n(e.messages$1),
  t = _e$initVueI18n.t,
  o = {
    name: "uniPopupDialog",
    mixins: [e.popup],
    emits: ["confirm", "close", "update:modelValue", "input"],
    props: {
      inputType: {
        type: String,
        default: "text"
      },
      showClose: {
        type: Boolean,
        default: !0
      },
      modelValue: {
        type: [Number, String],
        default: ""
      },
      placeholder: {
        type: [String, Number],
        default: ""
      },
      type: {
        type: String,
        default: "error"
      },
      mode: {
        type: String,
        default: "base"
      },
      title: {
        type: String,
        default: ""
      },
      content: {
        type: String,
        default: ""
      },
      beforeClose: {
        type: Boolean,
        default: !1
      },
      cancelText: {
        type: String,
        default: ""
      },
      confirmText: {
        type: String,
        default: ""
      },
      maxlength: {
        type: Number,
        default: -1
      },
      focus: {
        type: Boolean,
        default: !0
      }
    },
    data: function data() {
      return {
        dialogType: "error",
        val: ""
      };
    },
    computed: {
      okText: function okText() {
        return this.confirmText || t("uni-popup.ok");
      },
      closeText: function closeText() {
        return this.cancelText || t("uni-popup.cancel");
      },
      placeholderText: function placeholderText() {
        return this.placeholder || t("uni-popup.placeholder");
      },
      titleText: function titleText() {
        return this.title || t("uni-popup.title");
      }
    },
    watch: {
      type: function type(e) {
        this.dialogType = e;
      },
      mode: function mode(e) {
        "input" === e && (this.dialogType = "info");
      },
      value: function value(e) {
        this.setVal(e);
      },
      modelValue: function modelValue(e) {
        this.setVal(e);
      },
      val: function val(e) {
        this.$emit("update:modelValue", e);
      }
    },
    created: function created() {
      this.popup.disableMask(), "input" === this.mode ? (this.dialogType = "info", this.val = this.value, this.val = this.modelValue) : this.dialogType = this.type;
    },
    methods: {
      setVal: function setVal(e) {
        -1 != this.maxlength && "input" === this.mode ? this.val = e.slice(0, this.maxlength) : this.val = e;
      },
      onOk: function onOk() {
        "input" === this.mode ? this.$emit("confirm", this.val) : this.$emit("confirm"), this.beforeClose || this.popup.close();
      },
      closeDialog: function closeDialog() {
        this.$emit("close"), this.beforeClose || this.popup.close();
      },
      close: function close() {
        this.popup.close();
      }
    }
  };var l = e._export_sfc(o, [["render", function (t, o, l, i, s, p) {
  return e.e({
    a: e.t(p.titleText),
    b: e.n("uni-popup__" + s.dialogType),
    c: "base" === l.mode
  }, "base" === l.mode ? {
    d: e.t(l.content)
  } : {
    e: l.maxlength,
    f: l.inputType,
    g: p.placeholderText,
    h: l.focus,
    i: s.val,
    j: e.o(function (e) {
      return s.val = e.detail.value;
    })
  }, {
    k: l.showClose
  }, l.showClose ? {
    l: e.t(p.closeText),
    m: e.o(function () {
      return p.closeDialog && p.closeDialog.apply(p, arguments);
    })
  } : {}, {
    n: e.t(p.okText),
    o: e.n(l.showClose ? "uni-border-left" : ""),
    p: e.o(function () {
      return p.onOk && p.onOk.apply(p, arguments);
    })
  });
}]]);wx.createComponent(l);