var NX = { t0: null, t1: null, tMin: null, tMax: null };
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
function inWindow(y) {
  if (y == null) return false;
  return y >= NX.t0 && y <= NX.t1;
}
function mapHref() {
  return "https://images.weserv.nl/?url=" + encodeURIComponent("upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/1280px-Equirectangular_projection_SW.jpg") + "&w=1280&we";
}
function buildNexus() {
  var box = document.getElementById("nexus");
  if (!box) return;
  var all = (window.CASES || []).filter(function (c) { return c && c.id; });
  var years = all.map(yearOf).filter(function (y) { return y != null; });
  NX.tMin = Math.min.apply(null, years);
  NX.tMax = Math.max.apply(null, years);
  if (NX.tMin === NX.tMax) NX.tMax = NX.tMin + 1;
  if (NX.t0 == null) NX.t0 = NX.tMin;
  if (NX.t1 == null) NX.t1 = NX.tMax;
  if (NX.t0 < NX.tMin) NX.t0 = NX.tMin;
  if (NX.t1 > NX.tMax) NX.t1 = NX.tMax;
  if (NX.t0 > NX.t1) { var sw = NX.t0; NX.t0 = NX.t1; NX.t1 = sw; }
  var files = all.filter(function (c) { var y = yearOf(c); return y == null || inWindow(y); });
  var w = Math.max(320, box.clientWidth || 640);
  var hMap = Math.max(220, Math.min(360, Math.round(w * 0.48)));
  var hTime = 96;
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
  var grid = "";
  for (var lon = -180; lon <= 180; lon += 30) {
    var x = xy(0, lon, w, hMap).x;
    grid += "<line x1='" + x + "' y1='0' x2='" + x + "' y2='" + hMap + "' stroke='#1c2a3a' stroke-opacity='0.55'/>";
  }
  for (var lat = -60; lat <= 60; lat += 30) {
    var y = xy(lat, 0, w, hMap).y;
    grid += "<line x1='0' y1='" + y + "' x2='" + w + "' y2='" + y + "' stroke='#1c2a3a' stroke-opacity='0.55'/>";
  }
  var svgMap = "<image href='" + mapHref() + "' x='0' y='0' width='" + w + "' height='" + hMap + "' preserveAspectRatio='none' opacity='0.42'/>" + grid;
  edges.forEach(function (e) {
    var pa = posOf(e.a), pb = posOf(e.b);
    if (!pa || !pb) return;
    var sa = xy(pa.lat, pa.lon, w, hMap), sb = xy(pb.lat, pb.lon, w, hMap);
    var col = e.kind === "dossier" ? "#6ee7e0" : e.kind === "space-time" ? "#e8b86d" : "#8aa0b5";
    svgMap += "<line x1='" + sa.x.toFixed(1) + "' y1='" + sa.y.toFixed(1) + "' x2='" + sb.x.toFixed(1) + "' y2='" + sb.y.toFixed(1) + "' stroke='" + col + "' stroke-opacity='0.7' stroke-width='1'/>";
  });
  files.forEach(function (c) {
    var p = posOf(c);
    if (!p) return;
    var s = xy(p.lat, p.lon, w, hMap);
    svgMap += "<circle class='nx-dot' data-id='" + c.id + "' cx='" + s.x.toFixed(1) + "' cy='" + s.y.toFixed(1) + "' r='4.5' fill='#7dffb3' stroke='#05070a' stroke-width='1.2'/>";
  });
  var span = NX.t1 - NX.t0 || 1;
  var svgTime = "<rect x='8' y='34' width='" + (w - 16) + "' height='12' fill='#121a24' stroke='#1c2a3a'/>";
  all.forEach(function (c) {
    var y = yearOf(c);
    if (y == null) return;
    var x = 8 + (y - NX.tMin) / (NX.tMax - NX.tMin) * (w - 16);
    var on = inWindow(y);
    svgTime += "<circle class='nx-dot" + (on ? "" : " nx-dim") + "' data-id='" + c.id + "' cx='" + x.toFixed(1) + "' cy='40' r='" + (on ? 3.6 : 2.2) + "' fill='" + (on ? "#e8b86d" : "#3d4a58") + "'/>";
  });
  var x0 = 8 + (NX.t0 - NX.tMin) / (NX.tMax - NX.tMin) * (w - 16);
  var x1 = 8 + (NX.t1 - NX.tMin) / (NX.tMax - NX.tMin) * (w - 16);
  svgTime += "<rect x='" + Math.min(x0, x1) + "' y='34' width='" + Math.max(2, Math.abs(x1 - x0)) + "' height='12' fill='#e8b86d' fill-opacity='0.18' stroke='#e8b86d' stroke-opacity='0.6'/>";
  svgTime += "<text x='8' y='78' fill='#7d8c9d' font-size='11'>" + NX.t0 + "</text>";
  svgTime += "<text x='" + (w / 2 - 20) + "' y='78' fill='#e8b86d' font-size='11'>" + files.length + " files</text>";
  svgTime += "<text x='" + (w - 56) + "' y='78' fill='#7d8c9d' font-size='11'>" + NX.t1 + "</text>";
  box.innerHTML =
    "<div class='nx-legend'><span class='c1'></span> dossier <span class='c2'></span> place + close years <span class='c3'></span> place / region</div>" +
    "<div class='nx-tools'>" +
    "<button type='button' data-win='all'>All</button>" +
    "<button type='button' data-win='anc'>to 1500</button>" +
    "<button type='button' data-win='e'>1500-1900</button>" +
    "<button type='button' data-win='w'>1900-1950</button>" +
    "<button type='button' data-win='c'>1950-2000</button>" +
    "<button type='button' data-win='n'>2000+</button>" +
    "<button type='button' data-win='in'>Zoom in</button>" +
    "<button type='button' data-win='out'>Zoom out</button>" +
    "</div>" +
    "<div class='nx-sliders'><label>From <input id='nxFrom' type='range' min='" + NX.tMin + "' max='" + NX.tMax + "' value='" + NX.t0 + "'></label>" +
    "<label>To <input id='nxTo' type='range' min='" + NX.tMin + "' max='" + NX.tMax + "' value='" + NX.t1 + "'></label></div>" +
    "<svg id='nx-map' viewBox='0 0 " + w + " " + hMap + "' width='100%' height='" + hMap + "'>" + svgMap + "</svg>" +
    "<div class='nx-cap'>Equirectangular world plate under the network. Schematic, not a survey map.</div>" +
    "<svg id='nx-time' viewBox='0 0 " + w + " " + hTime + "' width='100%' height='" + hTime + "'>" + svgTime + "</svg>" +
    "<div class='nx-cap'>Drag sliders or use presets. Wheel over the timeline zooms the window. Dim dots sit outside the current span.</div>" +
    "<div id='nx-info' class='nx-info'>Tap a point. Window " + NX.t0 + " – " + NX.t1 + ".</div>";
  function applyWin(t0, t1) {
    NX.t0 = Math.round(t0);
    NX.t1 = Math.round(t1);
    buildNexus();
  }
  box.querySelectorAll("[data-win]").forEach(function (b) {
    b.onclick = function () {
      var k = b.getAttribute("data-win");
      var mid = (NX.t0 + NX.t1) / 2;
      var half = Math.max(8, (NX.t1 - NX.t0) / 2);
      if (k === "all") applyWin(NX.tMin, NX.tMax);
      else if (k === "anc") applyWin(NX.tMin, 1500);
      else if (k === "e") applyWin(1500, 1900);
      else if (k === "w") applyWin(1900, 1950);
      else if (k === "c") applyWin(1950, 2000);
      else if (k === "n") applyWin(2000, NX.tMax);
      else if (k === "in") applyWin(mid - half / 2, mid + half / 2);
      else if (k === "out") applyWin(mid - half * 2, mid + half * 2);
    };
  });
  document.getElementById("nxFrom").oninput = function () { applyWin(+this.value, NX.t1); };
  document.getElementById("nxTo").oninput = function () { applyWin(NX.t0, +this.value); };
  document.getElementById("nx-time").addEventListener("wheel", function (ev) {
    ev.preventDefault();
    var mid = (NX.t0 + NX.t1) / 2;
    var half = Math.max(6, (NX.t1 - NX.t0) / 2);
    half = ev.deltaY < 0 ? half * 0.7 : half * 1.4;
    applyWin(mid - half, mid + half);
  }, { passive: false });
  box.querySelectorAll(".nx-dot").forEach(function (dot) {
    dot.addEventListener("click", function (ev) {
      ev.stopPropagation();
      var id = dot.getAttribute("data-id");
      var c = all.find(function (x) { return x.id === id; });
      if (!c) return;
      var linked = edges.filter(function (e) { return e.a.id === id || e.b.id === id; }).map(function (e) {
        var o = e.a.id === id ? e.b : e.a;
        return o.title + " (" + e.kind + ")";
      });
      var info = document.getElementById("nx-info");
      info.innerHTML = "<b>" + c.title + "</b> — " + c.year + " · " + c.loc +
        (linked.length ? "<br>links: " + linked.slice(0, 8).join("; ") : "<br>no computed links in this window") +
        " <button type='button' class='nx-open'>Open file</button>";
      info.querySelector(".nx-open").onclick = function () { if (typeof openCase === "function") openCase(id); };
    });
  });
}
function showNexus() {
  document.getElementById("home").style.display = "none";
  document.getElementById("page").style.display = "none";
  document.getElementById("nexus-wrap").style.display = "block";
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
