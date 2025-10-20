var e = require("../common/vendor.js"),
  s = require("./modules/device.js"),
  t = require("./modules/slots.js"),
  o = require("./modules/cards.js"),
  r = require("./modules/reader.js"),
  d = require("./modules/geofence.js"),
  i = e.createStore({
    modules: {
      device: s.device,
      slots: t.slots,
      cards: o.cards,
      reader: r.reader,
      geofence: d.geofence
    },
    state: {
      isLoading: !1,
      networkStatus: !0
    },
    mutations: {
      SET_LOADING: function SET_LOADING(e, s) {
        e.isLoading = s;
      },
      SET_NETWORK_STATUS: function SET_NETWORK_STATUS(e, s) {
        e.networkStatus = s;
      }
    },
    actions: {
      setLoading: function setLoading(_ref, s) {
        var e = _ref.commit;
        e("SET_LOADING", s);
      },
      setNetworkStatus: function setNetworkStatus(_ref2, s) {
        var e = _ref2.commit;
        e("SET_NETWORK_STATUS", s);
      }
    },
    getters: {
      isConnected: function isConnected(e) {
        return e.device.connected;
      },
      deviceInfo: function deviceInfo(e) {
        return e.device.info;
      },
      slotList: function slotList(e) {
        return e.slots.slots;
      },
      cardList: function cardList(e) {
        return e.cards.cards;
      }
    }
  });exports.store = i;