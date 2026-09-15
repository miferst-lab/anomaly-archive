function commons(name) {
  return "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(name) + "?width=900";
}
function esc(s) {
  var d = document.createElement("div");
  d.textContent = String(s);
  return d.innerHTML;
}
var IMG = {
  "nazca-lines": ["Nazca Lines Hummingbird.jpg", "Nazca hummingbird geoglyph"],
  "roswell-1947": ["Marcel-roswell-debris 0.jpg", "Jesse Marcel with Fort Worth debris, 1947"],
  "derinkuyu": ["Derinkuyu_Underground_City_14.jpg", "Derinkuyu underground city"],
  "voynich": ["Voynich Manuscript (129).jpg", "Voynich manuscript folio"],
  "tunguska": ["Tunguska event fallen trees.jpg", "Tunguska fallen trees"],
  "nessie": ["Urquhart Castle and Loch Ness.jpg", "Loch Ness"],
  "fatima-1917": ["Santuario de Fatima Julho 2018-3.jpg", "Sanctuary of Fatima"]
};
var FALL = {
  "inner-earth": "Derinkuyu_Underground_City_14.jpg",
  "uap": "Night sky above Atacama Desert.jpg",
  "uso": "Ocean waves.jpg",
  "encounters": "Night sky above Atacama Desert.jpg",
  "crash-retrieval": "Marcel-roswell-debris 0.jpg",
  "nuclear": "Minuteman III ICBM.jpg",
  "cover-up": "CIA emblem.png",
  "cryptid": "Urquhart Castle and Loch Ness.jpg",
  "high-strangeness": "Night sky above Atacama Desert.jpg",
  "haunt": "Borley Rectory.jpg",
  "disappearance": "Flannan Isles Lighthouse.jpg",
  "fortean": "Tunguska event fallen trees.jpg",
  "artifact": "Nazca Lines Hummingbird.jpg",
  "historical-sky": "Night sky above Atacama Desert.jpg",
  "religious-anomaly": "Santuario de Fatima Julho 2018-3.jpg"
};
var DOMAINS = [
  ["inner-earth", "Inner Earth and lost races", "Atlantis, Agartha, Silurians, cave worlds"],
  ["uap", "UAP / aerial", "Radar, pilots, photographs"],
  ["uso", "USO / transmedium", "Water entries and undersea reports"],
  ["encounters", "Close encounters", "Entity and landing reports"],
  ["crash-retrieval", "Crash and retrieval", "Debris and recovery narratives"],
  ["nuclear", "Nuclear and strategic", "Missile fields and weapons sites"],
  ["cover-up", "Programs and cover", "Official programs and contested papers"],
  ["cryptid", "Cryptids", "Unverified animals"],
  ["high-strangeness", "High strangeness", "Overlapping anomaly clusters"],
  ["haunt", "Hauntings", "Residences and investigations"],
  ["disappearance", "Disappearances", "Vanishing persons and places"],
  ["fortean", "Fortean", "Falls, hums, recurrent lights"],
  ["artifact", "Artifacts", "Nazca, devices, unread objects"],
  ["historical-sky", "Pre-modern skies", "Broadsheets and portent literature"],
  ["religious-anomaly", "Religious anomalies", "Apparitions and crowd events"]
];
var EXTRA = {
  "nazca-lines": [["UNESCO Nasca and Palpa", "https://whc.unesco.org/en/list/700/"]],
  "roswell-1947": [["FBI Vault UFO files", "https://vault.fbi.gov/UFO"]],
  "hessdalen": [["Project Hessdalen", "https://www.hessdalen.org/"]]
};
var PORTALS = [
  ["Internet Archive", "https://archive.org/"],
  ["NICAP", "https://www.nicap.org/"],
  ["NARA UFO records", "https://www.archives.gov/research/military/air-force/ufos"]
];
var clean = (window.CASES || []).filter(function (c) { return c.id && c.title; });
var filecount = document.getElementById("filecount");
if (filecount) filecount.textContent = String(clean.length).padStart(3, "0");
var catsEl = document.getElementById("cats");
var rail = document.getElementById("rail");
var railwrap = document.getElementById("railwrap");
var railtitle = document.getElementById("railtitle");
var home = document.getElementById("home");
var page = document.getElementById("page");
var openDomain = null;
function pic(c) {
  if (IMG[c.id]) return { src: commons(IMG[c.id][0]), cap: IMG[c.id][1] };
  var f = FALL[c.domain] || FALL.uap;
  return { src: commons(f), cap: "Illustrative Commons image, not evidence of the claim." };
}
function wiki(u) { return /wikipedia\.org/i.test(u || ""); }
function sourcesFor(c) {
  var out = [];
  (c.sources || []).forEach(function (s) {
    if (s && s.u && !wiki(s.u)) out.push([s.n, s.u, "case file"]);
  });
  (EXTRA[c.id] || []).forEach(function (s) { out.push([s[0], s[1], "specialist"]); });
  if (out.length < 3) PORTALS.forEach(function (s) { out.push([s[0], s[1], "portal"]); });
  var seen = {};
  return out.filter(function (x) {
    if (seen[x[1]]) return false;
    seen[x[1]] = 1;
    return true;
  }).slice(0, 6);
}
function storeKey(id) { return "aa-" + id; }
function loadFB(id) {
  try { return JSON.parse(localStorage.getItem(storeKey(id)) || '{"r":0,"c":[]}'); }
  catch (e) { return { r: 0, c: [] }; }
}
function saveFB(id, data) { localStorage.setItem(storeKey(id), JSON.stringify(data)); }
function match(c, term) {
  if (!term) return true;
  return (c.title + " " + c.loc + " " + c.year + " " + c.summary + " " + (c.tags || []).join(" ")).toLowerCase().includes(term);
}
function renderCats(term) {
  catsEl.innerHTML = "";
  DOMAINS.forEach(function (d) {
    var id = d[0], label = d[1], blurb = d[2];
    var n = clean.filter(function (c) { return c.domain === id && match(c, term); }).length;
    if (term && !n) return;
    var b = document.createElement("button");
    b.className = "cat" + (openDomain === id ? " active" : "");
    b.innerHTML = "<b>" + label + "</b><span>" + n + " files - " + blurb + "</span>";
    b.onclick = function () { toggleDomain(id, label); };
    catsEl.appendChild(b);
  });
}
function toggleDomain(id, label) {
  if (openDomain === id) {
    openDomain = null;
    railwrap.classList.remove("open");
    renderCats(document.getElementById("q").value.trim().toLowerCase());
    return;
  }
  openDomain = id;
  railtitle.textContent = label + " - cases";
  fillRail(id);
  railwrap.classList.add("open");
  renderCats(document.getElementById("q").value.trim().toLowerCase());
  railwrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
function fillRail(id) {
  var term = document.getElementById("q").value.trim().toLowerCase();
  rail.innerHTML = "";
  clean.filter(function (c) { return c.domain === id && match(c, term); }).forEach(function (c) {
    var p = pic(c);
    var el = document.createElement("article");
    el.className = "chip";
    var img = document.createElement("img");
    img.src = p.src;
    var pad = document.createElement("div");
    pad.className = "pad";
    pad.innerHTML = "<div class=yr>" + esc(c.year) + "</div><h3>" + esc(c.title) + "</h3><p>" + esc(c.summary) + "</p>";
    el.appendChild(img);
    el.appendChild(pad);
    el.onclick = function () { openCase(c.id); };
    rail.appendChild(el);
  });
}
function openCase(id) {
  var c = clean.find(function (x) { return x.id === id; });
  if (!c) return;
  location.hash = "file/" + id;
  home.style.display = "none";
  page.style.display = "block";
  var fb = loadFB(id), src = sourcesFor(c), p = pic(c);
  var rel = (c.related || []).map(function (rid) { return clean.find(function (x) { return x.id === rid; }); }).filter(Boolean);
  page.innerHTML = "";
  var back = document.createElement("button");
  back.className = "back";
  back.textContent = "Back to categories";
  back.onclick = goHome;
  page.appendChild(back);
  var k = document.createElement("div");
  k.className = "page-k";
  k.textContent = "FILE " + c.id + " - " + c.year + " - " + c.domain;
  page.appendChild(k);
  var h = document.createElement("h2");
  h.textContent = c.title;
  page.appendChild(h);
  var loc = document.createElement("div");
  loc.className = "loc";
  loc.textContent = c.loc;
  page.appendChild(loc);
  var hero = document.createElement("img");
  hero.className = "hero";
  hero.src = p.src;
  page.appendChild(hero);
  var cap = document.createElement("div");
  cap.className = "cap";
  cap.textContent = p.cap;
  page.appendChild(cap);
  var body = document.createElement("p");
  body.className = "body";
  body.textContent = c.text || c.summary;
  page.appendChild(body);
  var sb = document.createElement("div");
  sb.className = "block";
  sb.innerHTML = "<h3>Sources</h3>";
  src.forEach(function (s) {
    var div = document.createElement("div");
    div.className = "src";
    var a = document.createElement("a");
    a.href = s[1];
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = s[0];
    var sm = document.createElement("small");
    sm.textContent = s[2];
    div.appendChild(a);
    div.appendChild(sm);
    sb.appendChild(div);
  });
  page.appendChild(sb);
  if (rel.length) {
    var rb = document.createElement("div");
    rb.className = "block";
    rb.innerHTML = "<h3>Related files</h3>";
    rel.forEach(function (r) {
      var btn = document.createElement("button");
      btn.textContent = r.title;
      btn.onclick = function () { openCase(r.id); };
      rb.appendChild(btn);
    });
    page.appendChild(rb);
  }
  var rate = document.createElement("div");
  rate.className = "block";
  rate.innerHTML = "<h3>Rating</h3><div class=stars id=stars></div>";
  page.appendChild(rate);
  var stars = document.getElementById("stars");
  for (var i = 1; i <= 5; i++) {
    var st = document.createElement("button");
    st.textContent = "*";
    if (fb.r >= i) st.className = "on";
    st.setAttribute("data-r", String(i));
    st.onclick = (function (n) {
      return function () {
        var d = loadFB(id);
        d.r = n;
        saveFB(id, d);
        openCase(id);
      };
    })(i);
    stars.appendChild(st);
  }
  var avg = document.createElement("span");
  avg.className = "avg";
  avg.textContent = fb.r ? (fb.r + " / 5") : "no rating yet";
  stars.appendChild(avg);
  var notes = document.createElement("div");
  notes.className = "block notes";
  notes.innerHTML = "<h3>Comments</h3>";
  var who = document.createElement("input");
  who.id = "who";
  who.placeholder = "Name or handle";
  var txt = document.createElement("textarea");
  txt.id = "txt";
  txt.rows = 4;
  var post = document.createElement("button");
  post.textContent = "File comment";
  post.onclick = function () {
    var w = who.value.trim() || "anonymous";
    var b = txt.value.trim();
    if (!b) return;
    var d = loadFB(id);
    d.c = d.c || [];
    d.c.unshift({ w: w, b: b, t: new Date().toISOString().slice(0, 16).replace("T", " ") });
    saveFB(id, d);
    openCase(id);
  };
  notes.appendChild(who);
  notes.appendChild(txt);
  notes.appendChild(post);
  var hint = document.createElement("p");
  hint.className = "note";
  hint.textContent = "Stored in this browser only.";
  notes.appendChild(hint);
  (fb.c || []).forEach(function (x) {
    var cm = document.createElement("div");
    cm.className = "comment";
    var wh = document.createElement("div");
    wh.className = "who";
    wh.textContent = x.w + " - " + x.t;
    cm.appendChild(wh);
    cm.appendChild(document.createTextNode(x.b));
    notes.appendChild(cm);
  });
  page.appendChild(notes);
  window.scrollTo(0, 0);
}
function goHome() {
  location.hash = "";
  page.style.display = "none";
  home.style.display = "block";
}
document.getElementById("goHome").onclick = goHome;
document.getElementById("q").addEventListener("input", function () {
  var t = document.getElementById("q").value.trim().toLowerCase();
  renderCats(t);
  if (openDomain) fillRail(openDomain);
});
window.addEventListener("hashchange", function () {
  var h = location.hash.replace(/^#/, "");
  if (h.indexOf("file/") === 0) openCase(decodeURIComponent(h.slice(5)));
  else goHome();
});
renderCats("");
if (location.hash.indexOf("file/") >= 0) {
  openCase(decodeURIComponent(location.hash.replace(/^#?file\//, "")));
}
