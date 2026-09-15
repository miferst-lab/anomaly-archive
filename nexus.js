function yearOf(c) {
  var g = window.GEO && GEO[c.id];
  if (g) return g[2];
  var m = String(c.year || "").match(/(-?\d{3,4})/);
  return m ? parseInt(m[1], 10) : null;
}
function posOf(c) {
  var g = window.GEO && GEO[c.id];
  if (g) return { lat: g[0], lon: g[1] };
  return null;
}
function regionKey(c) {
  var loc = (c.loc || "").toLowerCase();
  var keys = ["usa","united states","uk","united kingdom","england","wales","canada","australia","brazil","peru","iran","belgium","portugal","ireland","egypt","turkey","turkiye","algeria","antarctica","new mexico","nevada","arizona","california","washington","pacific","atlantic"];
  for (var i = 0; i < keys.length; i++) if (loc.indexOf(keys[i]) >= 0) return keys[i];
  return loc.split(",").pop().trim() || "unknown";
}
function distKm(a, b) {
  if (!a || !b) return 1e9;
  var R = 6371, dLat = (b.lat - a.lat) * Math.PI / 180, dLon = (b.lon - a.lon) * Math.PI / 180;
  var la1 = a.lat * Math.PI / 180, la2 = b.lat * Math.PI / 180;
  var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
function xy(lat, lon, w, h) {
  return { x: (lon + 180) / 360 * w, y: (90 - lat) / 180 * h };
}
function buildNexus() {
  var box = document.getElementById("nexus");
  if (!box) return;
  var files = (window.CASES || []).filter(function (c) { return c && c.id; });
  var w = Math.max(320, box.clientWidth || 640);
  var hMap = 280, hTime = 90;
  var edges = [];
  var seen = {};
  function addEdge(a, b, kind) {
    if (!a || !b || a.id === b.id) return;
    var k = a.id < b.id ? a.id + "|" + b.id : b.id + "|" + a.id;
    if (seen[k]) return;
    seen[k] = 1;
    edges.push({ a: a, b: b, kind: kind });
  }
  files.forEach(function (c) {
    (c.related || []).forEach(function (rid) {
      var o = files.find(function (x) { return x.id === rid; });
      addEdge(c, o, "dossier");
    });
  });
  for (var i = 0; i < files.length; i++) {
    for (var j = i + 1; j < files.length; j++) {
      var A = files[i], B = files[j];
      var pa = posOf(A), pb = posOf(B);
      var ya = yearOf(A), yb = yearOf(B);
      var near = distKm(pa, pb) < 400;
      var sameReg = regionKey(A) === regionKey(B) && regionKey(A) !== "unknown";
      var closeT = ya != null && yb != null && Math.abs(ya - yb) <= 8;
      if (near && closeT) addEdge(A, B, "space-time");
      else if (near) addEdge(A, B, "place");
      else if (sameReg && closeT) addEdge(A, B, "region-time");
    }
  }
  var svgMap = "";
  edges.forEach(function (e) {
    var pa = posOf(e.a), pb = posOf(e.b);
    if (!pa || !pb) return;
    var sa = xy(pa.lat, pa.lon, w, hMap), sb = xy(pb.lat, pb.lon, w, hMap);
    var col = e.kind === "dossier" ? "#6ee7e0" : e.kind === "space-time" ? "#e8b86d" : "#3d4a58";
    svgMap += "<line x1='" + sa.x.toFixed(1) + "' y1='" + sa.y.toFixed(1) + "' x2='" + sb.x.toFixed(1) + "' y2='" + sb.y.toFixed(1) + "' stroke='" + col + "' stroke-opacity='0.45' stroke-width='1'/>";
  });
  files.forEach(function (c) {
    var p = posOf(c);
    if (!p) return;
    var s = xy(p.lat, p.lon, w, hMap);
    svgMap += "<circle class='nx-dot' data-id='" + c.id + "' cx='" + s.x.toFixed(1) + "' cy='" + s.y.toFixed(1) + "' r='4' fill='#7dffb3' stroke='#05070a'/>";
  });
  var years = files.map(yearOf).filter(function (y) { return y != null; });
  var ymin = Math.min.apply(null, years), ymax = Math.max.apply(null, years);
  if (ymin === ymax) ymax = ymin + 1;
  var svgTime = "";
  svgTime += "<line x1='8' y1='40' x2='" + (w - 8) + "' y2='40' stroke='#1c2a3a' stroke-width='2'/>";
  files.forEach(function (c) {
    var y = yearOf(c);
    if (y == null) return;
    var x = 8 + (y - ymin) / (ymax - ymin) * (w - 16);
    svgTime += "<circle class='nx-dot' data-id='" + c.id + "' cx='" + x.toFixed(1) + "' cy='40' r='3.5' fill='#e8b86d'/>";
  });
  svgTime += "<text x='8' y='78' fill='#7d8c9d' font-size='11'>" + ymin + "</text>";
  svgTime += "<text x='" + (w - 48) + "' y='78' fill='#7d8c9d' font-size='11'>" + ymax + "</text>";
  box.innerHTML =
    "<div class='nx-legend'><span class='c1'></span> dossier link <span class='c2'></span> same place + close years <span class='c3'></span> place or region</div>" +
    "<svg id='nx-map' viewBox='0 0 " + w + " " + hMap + "' width='100%' height='" + hMap + "'>" + svgMap + "</svg>" +
    "<div class='nx-cap'>Map is schematic (lat/lon on an equirectangular plate). Not a surveyed GIS layer.</div>" +
    "<svg id='nx-time' viewBox='0 0 " + w + " " + hTime + "' width='100%' height='" + hTime + "'>" + svgTime + "</svg>" +
    "<div class='nx-cap'>Timeline uses the first readable year in the file (BCE as negative).</div>" +
    "<div id='nx-info' class='nx-info'>Tap a point.</div>";
  box.querySelectorAll(".nx-dot").forEach(function (dot) {
    dot.addEventListener("click", function (ev) {
      ev.stopPropagation();
      var id = dot.getAttribute("data-id");
      var c = files.find(function (x) { return x.id === id; });
      if (!c) return;
      var linked = edges.filter(function (e) { return e.a.id === id || e.b.id === id; }).map(function (e) {
        var o = e.a.id === id ? e.b : e.a;
        return o.title + " (" + e.kind + ")";
      });
      var info = document.getElementById("nx-info");
      info.innerHTML = "<b>" + c.title + "</b> — " + c.year + " · " + c.loc +
        (linked.length ? "<br>links: " + linked.slice(0, 8).join("; ") : "<br>no computed links") +
        " <button type='button' class='nx-open' data-id='" + id + "'>Open file</button>";
      var btn = info.querySelector(".nx-open");
      if (btn) btn.onclick = function () { if (typeof openCase === "function") openCase(id); };
    });
  });
}
function showNexus() {
  document.getElementById("home").style.display = "none";
  document.getElementById("page").style.display = "none";
  var nx = document.getElementById("nexus-wrap");
  nx.style.display = "block";
  requestAnimationFrame(buildNexus);
}
function hideNexus() {
  document.getElementById("nexus-wrap").style.display = "none";
  document.getElementById("home").style.display = "block";
}
document.getElementById("btnNexus").onclick = showNexus;
document.getElementById("nxBack").onclick = hideNexus;
window.addEventListener("resize", function () {
  if (document.getElementById("nexus-wrap").style.display === "block") buildNexus();
});
