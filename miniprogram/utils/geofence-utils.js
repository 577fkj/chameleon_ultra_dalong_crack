exports.generateGeofenceId = function () {
  return "gf_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}, exports.isPointInPolygon = function (t, e) {
  if (!t || !e || e.length < 3) return !1;
  var n = t.longitude,
    o = t.latitude;
  var r = !1,
    l = e.length - 1;
  for (var s = 0; s < e.length; s++) {
    var _t = e[s].longitude,
      i = e[s].latitude,
      u = e[l].longitude,
      d = e[l].latitude;
    i > o != d > o && n < (u - _t) * (o - i) / (d - i) + _t && (r = !r), l = s;
  }
  return r;
}, exports.validateGeofence = function (t) {
  var e = [];
  return t ? (t.name && "" !== t.name.trim() || e.push("围栏名称不能为空"), (void 0 === t.slotId || t.slotId < 0 || t.slotId > 15) && e.push("卡槽ID必须在0-15之间"), (!t.polygon || t.polygon.length < 3) && e.push("围栏区域至少需要3个点"), {
    valid: 0 === e.length,
    errors: e
  }) : (e.push("围栏配置不能为空"), {
    valid: !1,
    errors: e
  });
};