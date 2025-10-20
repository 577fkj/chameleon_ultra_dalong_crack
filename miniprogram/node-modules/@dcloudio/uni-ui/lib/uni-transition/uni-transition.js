var _toConsumableArray2 = require("../../../../../@babel/runtime/helpers/toConsumableArray");var _objectSpread2 = require("../../../../../@babel/runtime/helpers/objectSpread2");var t = require("../../../../../common/vendor.js"),
  i = {
    name: "uniTransition",
    emits: ["click", "change"],
    props: {
      show: {
        type: Boolean,
        default: !1
      },
      modeClass: {
        type: [Array, String],
        default: function _default() {
          return "fade";
        }
      },
      duration: {
        type: Number,
        default: 300
      },
      styles: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      customClass: {
        type: String,
        default: ""
      },
      onceRender: {
        type: Boolean,
        default: !1
      }
    },
    data: function data() {
      return {
        isShow: !1,
        transform: "",
        opacity: 0,
        animationData: {},
        durationTime: 300,
        config: {}
      };
    },
    watch: {
      show: {
        handler: function handler(t) {
          t ? this.open() : this.isShow && this.close();
        },
        immediate: !0
      }
    },
    computed: {
      stylesObject: function stylesObject() {
        var t = _objectSpread2(_objectSpread2({}, this.styles), {}, {
            "transition-duration": this.duration / 1e3 + "s"
          }),
          i = "";
        for (var _s in t) {
          i += this.toLine(_s) + ":" + t[_s] + ";";
        }
        return i;
      },
      transformStyles: function transformStyles() {
        return "transform:" + this.transform + ";opacity:" + this.opacity + ";" + this.stylesObject;
      }
    },
    created: function created() {
      this.config = {
        duration: this.duration,
        timingFunction: "ease",
        transformOrigin: "50% 50%",
        delay: 0
      }, this.durationTime = this.duration;
    },
    methods: {
      init: function init() {
        var i = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        i.duration && (this.durationTime = i.duration), this.animation = t.createAnimation(Object.assign(this.config, i), this);
      },
      onClick: function onClick() {
        this.$emit("click", {
          detail: this.isShow
        });
      },
      step: function step(t) {
        var _this = this;
        var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return this.animation ? (Object.keys(t).forEach(function (i) {
          var _this$animation;
          var s = t[i];
          "function" == typeof _this.animation[i] && (Array.isArray(s) ? (_this$animation = _this.animation)[i].apply(_this$animation, _toConsumableArray2(s)) : _this.animation[i](s));
        }), this.animation.step(i), this) : this;
      },
      run: function run(t) {
        this.animation && this.animation.run(t);
      },
      open: function open() {
        var _this2 = this;
        clearTimeout(this.timer), this.isShow = !0, this.transform = this.styleInit(!1).transform || "", this.opacity = this.styleInit(!1).opacity || 0, this.$nextTick(function () {
          _this2.timer = setTimeout(function () {
            _this2.animation = t.createAnimation(_this2.config, _this2), _this2.tranfromInit(!1).step(), _this2.animation.run(function () {
              _this2.transform = "", _this2.opacity = _this2.styleInit(!1).opacity || 1, _this2.$emit("change", {
                detail: _this2.isShow
              });
            });
          }, 80);
        });
      },
      close: function close(t) {
        var _this3 = this;
        this.animation && this.tranfromInit(!0).step().run(function () {
          _this3.isShow = !1, _this3.animationData = null, _this3.animation = null;
          var _this3$styleInit = _this3.styleInit(!1),
            t = _this3$styleInit.opacity,
            i = _this3$styleInit.transform;
          _this3.opacity = t || 1, _this3.transform = i, _this3.$emit("change", {
            detail: _this3.isShow
          });
        });
      },
      styleInit: function styleInit(t) {
        var _this4 = this;
        var i = {
          transform: "",
          opacity: 1
        };
        var s = function s(t, _s2) {
          var a = _this4.animationType(t)[_s2];
          _s2.startsWith("fade") ? i.opacity = a : i.transform += a + " ";
        };
        return "string" == typeof this.modeClass ? s(t, this.modeClass) : this.modeClass.forEach(function (i) {
          return s(t, i);
        }), i;
      },
      tranfromInit: function tranfromInit(t) {
        var _this5 = this;
        var i = function i(t, _i) {
          var s = null;
          "fade" === _i ? s = t ? 0 : 1 : (s = t ? "-100%" : "0", "zoom-in" === _i && (s = t ? .8 : 1), "zoom-out" === _i && (s = t ? 1.2 : 1), "slide-right" === _i && (s = t ? "100%" : "0"), "slide-bottom" === _i && (s = t ? "100%" : "0")), _this5.animation[_this5.animationMode()[_i]](s);
        };
        return "string" == typeof this.modeClass ? i(t, this.modeClass) : this.modeClass.forEach(function (s) {
          i(t, s);
        }), this.animation;
      },
      animationType: function animationType(t) {
        return {
          fade: t ? 1 : 0,
          "slide-top": "translateY(".concat(t ? "0" : "-100%", ")"),
          "slide-right": "translateX(".concat(t ? "0" : "100%", ")"),
          "slide-bottom": "translateY(".concat(t ? "0" : "100%", ")"),
          "slide-left": "translateX(".concat(t ? "0" : "-100%", ")"),
          "zoom-in": "scaleX(".concat(t ? 1 : .8, ") scaleY(").concat(t ? 1 : .8, ")"),
          "zoom-out": "scaleX(".concat(t ? 1 : 1.2, ") scaleY(").concat(t ? 1 : 1.2, ")")
        };
      },
      animationMode: function animationMode() {
        return {
          fade: "opacity",
          "slide-top": "translateY",
          "slide-right": "translateX",
          "slide-bottom": "translateY",
          "slide-left": "translateX",
          "zoom-in": "scale",
          "zoom-out": "scale"
        };
      },
      toLine: function toLine(t) {
        return t.replace(/([A-Z])/g, "-$1").toLowerCase();
      }
    }
  };var s = t._export_sfc(i, [["render", function (i, s, a, n, o, e) {
  return {
    a: o.isShow,
    b: o.animationData,
    c: t.n(a.customClass),
    d: t.s(e.transformStyles),
    e: t.o(function () {
      return e.onClick && e.onClick.apply(e, arguments);
    })
  };
}]]);wx.createComponent(s);