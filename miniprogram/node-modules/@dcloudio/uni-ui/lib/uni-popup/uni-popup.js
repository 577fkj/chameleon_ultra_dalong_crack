var t = require("../../../../../common/vendor.js"),
  s = {
    name: "uniPopup",
    components: {},
    emits: ["change", "maskClick"],
    props: {
      animation: {
        type: Boolean,
        default: !0
      },
      type: {
        type: String,
        default: "center"
      },
      isMaskClick: {
        type: Boolean,
        default: null
      },
      maskClick: {
        type: Boolean,
        default: null
      },
      backgroundColor: {
        type: String,
        default: "none"
      },
      safeArea: {
        type: Boolean,
        default: !0
      },
      maskBackgroundColor: {
        type: String,
        default: "rgba(0, 0, 0, 0.4)"
      },
      borderRadius: {
        type: String
      }
    },
    watch: {
      type: {
        handler: function handler(t) {
          this.config[t] && this[this.config[t]](!0);
        },
        immediate: !0
      },
      isDesktop: {
        handler: function handler(t) {
          this.config[t] && this[this.config[this.type]](!0);
        },
        immediate: !0
      },
      maskClick: {
        handler: function handler(t) {
          this.mkclick = t;
        },
        immediate: !0
      },
      isMaskClick: {
        handler: function handler(t) {
          this.mkclick = t;
        },
        immediate: !0
      },
      showPopup: function showPopup(t) {}
    },
    data: function data() {
      return {
        duration: 300,
        ani: [],
        showPopup: !1,
        showTrans: !1,
        popupWidth: 0,
        popupHeight: 0,
        config: {
          top: "top",
          bottom: "bottom",
          center: "center",
          left: "left",
          right: "right",
          message: "top",
          dialog: "center",
          share: "bottom"
        },
        maskClass: {
          position: "fixed",
          bottom: 0,
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)"
        },
        transClass: {
          backgroundColor: "transparent",
          borderRadius: this.borderRadius || "0",
          position: "fixed",
          left: 0,
          right: 0
        },
        maskShow: !0,
        mkclick: !0,
        popupstyle: "top"
      };
    },
    computed: {
      getStyles: function getStyles() {
        var t = {
          backgroundColor: this.bg
        };
        return this.borderRadius, t = Object.assign(t, {
          borderRadius: this.borderRadius
        }), t;
      },
      isDesktop: function isDesktop() {
        return this.popupWidth >= 500 && this.popupHeight >= 500;
      },
      bg: function bg() {
        return "" === this.backgroundColor || "none" === this.backgroundColor ? "transparent" : this.backgroundColor;
      }
    },
    mounted: function mounted() {
      var _this = this;
      (function () {
        var _t$index$getWindowInf = t.index.getWindowInfo(),
          s = _t$index$getWindowInf.windowWidth,
          i = _t$index$getWindowInf.windowHeight,
          o = _t$index$getWindowInf.windowTop,
          e = _t$index$getWindowInf.safeArea,
          a = _t$index$getWindowInf.screenHeight,
          r = _t$index$getWindowInf.safeAreaInsets;
        _this.popupWidth = s, _this.popupHeight = i + (o || 0), e && _this.safeArea ? _this.safeAreaInsets = a - e.bottom : _this.safeAreaInsets = 0;
      })();
    },
    unmounted: function unmounted() {
      this.setH5Visible();
    },
    activated: function activated() {
      this.setH5Visible(!this.showPopup);
    },
    deactivated: function deactivated() {
      this.setH5Visible(!0);
    },
    created: function created() {
      null === this.isMaskClick && null === this.maskClick ? this.mkclick = !0 : this.mkclick = null !== this.isMaskClick ? this.isMaskClick : this.maskClick, this.animation ? this.duration = 300 : this.duration = 0, this.messageChild = null, this.clearPropagation = !1, this.maskClass.backgroundColor = this.maskBackgroundColor;
    },
    methods: {
      setH5Visible: function setH5Visible() {
        var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : !0;
      },
      closeMask: function closeMask() {
        this.maskShow = !1;
      },
      disableMask: function disableMask() {
        this.mkclick = !1;
      },
      clear: function clear(t) {
        t.stopPropagation(), this.clearPropagation = !0;
      },
      open: function open(t) {
        if (this.showPopup) return;
        t && -1 !== ["top", "center", "bottom", "left", "right", "message", "dialog", "share"].indexOf(t) || (t = this.type), this.config[t] ? (this[this.config[t]](), this.$emit("change", {
          show: !0,
          type: t
        })) : console.error("缺少类型：", t);
      },
      close: function close(t) {
        var _this2 = this;
        this.showTrans = !1, this.$emit("change", {
          show: !1,
          type: this.type
        }), clearTimeout(this.timer), this.timer = setTimeout(function () {
          _this2.showPopup = !1;
        }, 300);
      },
      touchstart: function touchstart() {
        this.clearPropagation = !1;
      },
      onTap: function onTap() {
        this.clearPropagation ? this.clearPropagation = !1 : (this.$emit("maskClick"), this.mkclick && this.close());
      },
      top: function top(t) {
        var _this3 = this;
        this.popupstyle = this.isDesktop ? "fixforpc-top" : "top", this.ani = ["slide-top"], this.transClass = {
          position: "fixed",
          left: 0,
          right: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0"
        }, t || (this.showPopup = !0, this.showTrans = !0, this.$nextTick(function () {
          _this3.showPoptrans(), _this3.messageChild && "message" === _this3.type && _this3.messageChild.timerClose();
        }));
      },
      bottom: function bottom(t) {
        this.popupstyle = "bottom", this.ani = ["slide-bottom"], this.transClass = {
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          paddingBottom: this.safeAreaInsets + "px",
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0"
        }, t || this.showPoptrans();
      },
      center: function center(t) {
        this.popupstyle = "center", this.ani = ["fade"], this.transClass = {
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: this.borderRadius || "0"
        }, t || this.showPoptrans();
      },
      left: function left(t) {
        this.popupstyle = "left", this.ani = ["slide-left"], this.transClass = {
          position: "fixed",
          left: 0,
          bottom: 0,
          top: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0",
          display: "flex",
          flexDirection: "column"
        }, t || this.showPoptrans();
      },
      right: function right(t) {
        this.popupstyle = "right", this.ani = ["slide-right"], this.transClass = {
          position: "fixed",
          bottom: 0,
          right: 0,
          top: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0",
          display: "flex",
          flexDirection: "column"
        }, t || this.showPoptrans();
      },
      showPoptrans: function showPoptrans() {
        var _this4 = this;
        this.$nextTick(function () {
          _this4.showPopup = !0, _this4.showTrans = !0;
        });
      }
    }
  };if (!Array) {
  t.resolveComponent("uni-transition")();
}Math;var i = t._export_sfc(s, [["render", function (s, i, o, e, a, r) {
  return t.e({
    a: a.showPopup
  }, a.showPopup ? t.e({
    b: a.maskShow
  }, a.maskShow ? {
    c: t.o(r.onTap),
    d: t.p({
      name: "mask",
      "mode-class": "fade",
      styles: a.maskClass,
      duration: a.duration,
      show: a.showTrans
    })
  } : {}, {
    e: t.s(r.getStyles),
    f: t.n(a.popupstyle),
    g: t.o(function () {
      return r.clear && r.clear.apply(r, arguments);
    }),
    h: t.o(r.onTap),
    i: t.p({
      "mode-class": a.ani,
      name: "content",
      styles: a.transClass,
      duration: a.duration,
      show: a.showTrans
    }),
    j: t.o(function () {
      return r.touchstart && r.touchstart.apply(r, arguments);
    }),
    k: t.n(a.popupstyle),
    l: t.n(r.isDesktop ? "fixforpc-z-index" : "")
  }) : {});
}]]);wx.createComponent(i);