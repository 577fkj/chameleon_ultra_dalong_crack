var e = require("../common/vendor.js"),
  t = {
    name: "SettingItem",
    props: {
      label: {
        type: String,
        required: !0
      },
      options: {
        type: Array,
        required: !0,
        default: function _default() {
          return [];
        }
      },
      value: {
        type: Number,
        default: 0
      }
    },
    computed: {
      optionLabels: function optionLabels() {
        return this.options.map(function (e) {
          return e.label;
        });
      },
      currentIndex: function currentIndex() {
        var _this = this;
        var e = this.options.findIndex(function (e) {
          return e.value === _this.value;
        });
        return e >= 0 ? e : 0;
      },
      currentLabel: function currentLabel() {
        var _this2 = this;
        var e = this.options.find(function (e) {
          return e.value === _this2.value;
        });
        return e ? e.label : "未知";
      }
    },
    methods: {
      handleChange: function handleChange(e) {
        var t = e.detail.value,
          n = this.options[t];
        n && this.$emit("change", n.value);
      }
    }
  };if (!Array) {
  e.resolveComponent("uni-icons")();
}Math;var n = e._export_sfc(t, [["render", function (t, n, o, r, a, i) {
  return {
    a: e.t(o.label),
    b: e.t(i.currentLabel),
    c: e.p({
      type: "arrowdown",
      size: "14",
      color: "#999"
    }),
    d: i.optionLabels,
    e: i.currentIndex,
    f: e.o(function () {
      return i.handleChange && i.handleChange.apply(i, arguments);
    })
  };
}], ["__scopeId", "data-v-a80667a0"]]);wx.createComponent(n);