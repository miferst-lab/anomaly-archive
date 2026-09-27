window.SRC_ACCESS = "2026-09-27";
window.SRC_MAP = {
  "https://www.nasa.gov/": { u: "https://arxiv.org/abs/1804.03748", n: "Schmidt & Frank — The Silurian Hypothesis (arXiv:1804.03748)" },
  "https://www.nasa.gov": { u: "https://arxiv.org/abs/1804.03748", n: "Schmidt & Frank — Silurian Hypothesis" },
  "https://www.latimes.com/": { u: "https://www.latimes.com/la-sh-lizard-people-throwback-thursday-20140123-story.html", n: "LA Times — 1934 Lizard People / Shufelt recap" },
  "https://www.latimes.com": { u: "https://www.latimes.com/la-sh-lizard-people-throwback-thursday-20140123-story.html", n: "LA Times — Lizard People" },
  "https://www.archives.gov/": { u: "https://www.archives.gov/research/topics/uaps/textual-and-microfilm", n: "NARA — UFO/UAP textual and microfilm series" },
  "https://www.archives.gov": { u: "https://www.archives.gov/research/topics/uaps/rg-615", n: "NARA RG 615 UAP Records Collection" },
  "https://www.hessdalen.org/": { u: "https://hessdalen.org/reports/", n: "Project Hessdalen — reports index" },
  "https://www.hessdalen.org": { u: "https://hessdalen.org/reports/", n: "Project Hessdalen — reports" },
  "https://minotb52ufo.com/": { u: "https://minotb52ufo.com/doc.php", n: "Minot AFB 24 Oct 1968 — document set" },
  "https://minotb52ufo.com": { u: "https://minotb52ufo.com/narrative.php", n: "Minot AFB 1968 — narrative" },
  "https://www.nicap.org/": { u: "https://www.nicap.org/waves/1952wave.htm", n: "NICAP — 1952 wave file" },
  "https://www.nicap.org": { u: "https://www.nicap.org/waves/1952wave.htm", n: "NICAP — 1952 wave" },
  "https://uaprad.org/research": { u: "https://www.archives.gov/research/topics/uaps/textual-and-microfilm", n: "NARA UAP textual series" },
  "https://www.ufoindex.com/famous-ufo-uap-cases": { u: "https://www.nicap.org/waves.htm", n: "NICAP waves index" },
  "https://www.area52.shop": { u: "https://www.youtube.com/watch?v=DnXPAidAxG8", n: "Area 52 ep. 101 — Jane interview" },
  "https://www.unioneufologica.com/": { u: "https://firenzeurbanlifestyle.com/en/florence-ufo-1954-fiorentina-match-suspended/", n: "FUL — Florence stadium 27 Oct 1954" }
};
window.SRC_CASE = {
  "gdansk-bay-uso": {
    "https://www.imgw.pl/": { u: "https://wiadomosci.gazeta.pl/wiadomosci/7,114883,25616044,pierwsze-polskie-ufo-tajemniczy-obiekt-z-gdynskiego-portu.html", n: "Gazeta.pl — Gdynia port object, 21 Jan 1959" }
  },
  "gdynia-1959": {
    "http://www.nautilus.org.pl": { u: "https://dziennikbaltycki.pl/ufo-w-gdyni-kosmici-w-porcie-i-na-plazy-czy-zwykly-meteoryt-oto-historia-polskiego-roswell/ar/c1p2-27979475", n: "Dziennik Bałtycki — Gdynia 1959 (Nautilus witnesses quoted)" },
    "https://www.imgw.pl/": { u: "https://www.rmf24.pl/regiony/trojmiasto/news-to-jedna-z-najwiekszych-zagadek-prl-co-wpadlo-do-basenu-port,nId,8058897", n: "RMF24 — Gdynia basin 1959" }
  },
  "wylatowo-circles": {
    "https://bydgoszcz.eska.pl/": { u: "https://www.eska.pl/bydgoszcz/kregi-zbozowe-w-wylatowie-sa-dzis-mniej-spektakularne-nazywaja-je-zartobliwie-kaszubskimi-piramidami-aa-qP2n-i5kN-S2nK.html", n: "Eska — Wylatowo crop circles" }
  },
  "silurian-hypothesis": {
    "https://www.nasa.gov/": { u: "https://arxiv.org/abs/1804.03748", n: "Schmidt & Frank — Silurian Hypothesis" }
  },
  "silurians-folklore": {
    "https://www.latimes.com/": { u: "https://www.latimes.com/la-sh-lizard-people-throwback-thursday-20140123-story.html", n: "LA Times — Lizard People 1934" }
  },
  "florence-1954": {
    "https://www.unioneufologica.com/": { u: "https://firenzeurbanlifestyle.com/en/florence-ufo-1954-fiorentina-match-suspended/", n: "FUL — Florence 1954 match halt" }
  }
};
(function () {
  var A = window.SRC_ACCESS;
  function keyset(u) {
    var n = String(u || "").trim();
    return [n, n.replace(/\/$/, ""), n + "/", n.replace(/\/$/, "") + "/"];
  }
  function lookup(map, u) {
    if (!map) return null;
    var ks = keyset(u);
    for (var i = 0; i < ks.length; i++) if (map[ks[i]]) return map[ks[i]];
    return null;
  }
  (window.CASES || []).forEach(function (c) {
    (c.sources || []).forEach(function (s) {
      if (!s || !s.u) return;
      var hit = lookup(window.SRC_CASE[c.id], s.u) || lookup(window.SRC_MAP, s.u);
      if (hit) {
        if (hit.u) s.u = hit.u;
        if (hit.n) s.n = hit.n;
      }
      s.d = s.d || A;
    });
  });
})();
