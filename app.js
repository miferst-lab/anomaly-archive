function commons(name) {
  return "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(name) + "?width=900";
}
function esc(s) {
  return String(s)
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """)
    .replace(/'/g, "&#39;");
}
var IMG = {
  "nazca-lines": ["Nazca Lines Hummingbird.jpg", "Nazca hummingbird geoglyph"],
  "tassili-rockart": ["Tassili.jpg", "Tassili n Ajjer plateau"],
  "atlantis-plato": ["Athanasius Kircher's Turris Babel mappa Atlantis.jpg", "Kircher Atlantis map tradition"],
  "hollow-earth": ["Hollow earth.jpg", "Historic hollow-earth diagram"],
  "derinkuyu": ["Derinkuyu_Underground_City_14.jpg", "Derinkuyu underground city"],
  "lemuria-shasta": ["Mount Shasta from Lake Siskiyou.jpg", "Mount Shasta"],
  "shaver-mystery": ["Amazing stories 194703.jpg", "Amazing Stories cover"],
  "rainbow-city": ["Operation Highjump 3.jpg", "Operation Highjump"],
  "roswell-1947": ["Marcel-roswell-debris 0.jpg", "Jesse Marcel with Fort Worth debris, 1947"],
  "voynich": ["Voynich Manuscript (129).jpg", "Voynich manuscript folio"],
  "antikythera": ["NAMA Machine d'Anticythere 1.jpg", "Antikythera mechanism"],
  "phaistos": ["Phaistos Disc side A.JPG", "Phaistos disc"],
  "fatima-1917": ["Santuario de Fatima Julho 2018-3.jpg", "Sanctuary of Fatima"],
  "nessie": ["Urquhart Castle and Loch Ness.jpg", "Loch Ness"],
  "tunguska": ["Tunguska event fallen trees.jpg", "Tunguska fallen trees"],
  "flannan": ["Flannan Isles Lighthouse.jpg", "Flannan Isles lighthouse"],
  "db-cooper": ["DB Cooper hijacking composite sketch.jpg", "FBI composite"]
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
  "tassili-rockart": [["UNESCO Tassili n Ajjer", "https://whc.unesco.org/en/list/179/"]],
  "atlantis-plato": [["Perseus Timaeus", "https://www.perseus.tufts.edu/hopper/text?doc=Plat.+Tim."]],
  "silurian-hypothesis": [["Schmidt and Frank paper", "https://www.cambridge.org/core/journals/international-journal-of-astrobiology"]],
  "roswell-1947": [["FBI Vault UFO files", "https://vault.fbi.gov/UFO"]],
  "voynich": [["Beinecke MS 408", "https://beinecke.library.yale.edu/"]],
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
    el.innerHTML = "<img src=\"" + p.src + "\" alt=\"\" /><div class=pad><div class=yr>" + c.year + "</div><h3>" + c.title + "</h3><p>" + c.summary + "</p></div>";
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
  var stars = "";
  for (var i = 1; i <= 5; i++) stars += "<button data-r=\"" + i + "\" class=\"" + (fb.r >= i ? "on" : "") + "\">*</button>";
  var comments = (fb.c || []).map(function (x) {
    return "<div class=comment><div class=who>" + esc(x.w) + " - " + x.t + "</div>" + esc(x.b) + "</div>";
  }).join("") || "<p class=note>No comments on this device.</p>";
  var srcHtml = src.map(function (s) {
    return "<div class=src><a href=\"" + s[1] + "\" target=_blank rel=noopener>" + esc(s[0]) + "</a><small>" + esc(s[2]) + "</small></div>";
  }).join("");
  var relHtml = rel.length ? "<div class=block><h3>Related files</h3>" + rel.map(function (r) {
    return "<button data-go=\"" + r.id + "\">" + esc(r.title) + "</button>";
  }).join("") + "</div>" : "";
  page.innerHTML =
    "<button class=back id=back>Back to categories</button>" +
    "<div class=page-k>FILE " + esc(c.id) + " - " + esc(c.year) + " - " + esc(c.domain) + "</div>" +
    "<h2>" + esc(c.title) + "</h2><div class=loc>" + esc(c.loc) + "</div>" +
    "<img class=hero src=\"" + p.src + "\" alt=\"\" /><div class=cap>" + esc(p.cap) + "</div>" +
    "<p class=body>" + esc(c.text || c.summary) + "</p>" +
    "<div class=block><h3>Sources</h3>" + srcHtml + "</div>" + relHtml +
    "<div class=block><h3>Rating</h3><div class=stars id=stars>" + stars +
    "<span class=avg>" + (fb.r ? fb.r + " / 5" : "no rating yet") + "</span></div></div>" +
    "<div class='block notes'><h3>Comments</h3><input id=who placeholder='Name or handle' />" +
    "<textarea id=txt rows=4></textarea><button id=post>File comment</button>" +
    "<p class=note>Stored in this browser only.</p><div id=clist>" + comments + "</div></div>";
  document.getElementById("back").onclick = goHome;
  page.querySelectorAll("[data-go]").forEach(function (b) {
    b.onclick = function () { openCase(b.getAttribute("data-go")); };
  });
  page.querySelectorAll("#stars button").forEach(function (b) {
    b.onclick = function () {
      var d = loadFB(id);
      d.r = +b.getAttribute("data-r");
      saveFB(id, d);
      openCase(id);
    };
  });
  document.getElementById("post").onclick = function () {
    var w = document.getElementById("who").value.trim() || "anonymous";
    var body = document.getElementById("txt").value.trim();
    if (!body) return;
    var d = loadFB(id);
    d.c = d.c || [];
    d.c.unshift({ w: w, b: body, t: new Date().toISOString().slice(0, 16).replace("T", " ") });
    saveFB(id, d);
    openCase(id);
  };
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
