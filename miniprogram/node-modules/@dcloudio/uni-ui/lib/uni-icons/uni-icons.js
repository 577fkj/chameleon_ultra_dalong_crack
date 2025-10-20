var t = require("../../../../../common/vendor.js"),
  e = {
    name: "UniIcons",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      color: {
        type: String,
        default: "#333333"
      },
      size: {
        type: [Number, String],
        default: 16
      },
      customPrefix: {
        type: String,
        default: ""
      },
      fontFamily: {
        type: String,
        default: ""
      }
    },
    data: function data() {
      return {
        icons: t.fontData
      };
    },
    computed: {
      unicode: function unicode() {
        var _this = this;
        var t = this.icons.find(function (t) {
          return t.font_class === _this.type;
        });
        return t ? t.unicode : "";
      },
      iconSize: function iconSize() {
        return "number" == typeof (t = this.size) || /^[0-9]*$/g.test(t) ? t + "px" : t;
        var t;
      },
      styleObj: function styleObj() {
        return "" !== this.fontFamily ? "color: ".concat(this.color, "; font-size: ").concat(this.iconSize, "; font-family: ").concat(this.fontFamily, ";") : "color: ".concat(this.color, "; font-size: ").concat(this.iconSize, ";");
      }
    },
    methods: {
      _onClick: function _onClick() {
        this.$emit("click");
      }
    }
  };var i = t._export_sfc(e, [["render", function (e, i, o, n, s, c) {
  return {
    a: t.s(c.styleObj),
    b: t.n("uniui-" + o.type),
    c: t.n(o.customPrefix),
    d: t.n(o.customPrefix ? o.type : ""),
    e: t.o(function () {
      return c._onClick && c._onClick.apply(c, arguments);
    })
  };
}]]);wx.createComponent(i);