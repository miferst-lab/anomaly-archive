(function () {
  var _pic = typeof pic === "function" ? pic : function () { return { src: "", cap: "" }; };
  window.pic = function (c) {
    var m = (c && c.media) || (window.MEDIA && MEDIA[c.id]);
    if (m) {
      var src = m.url || (m.file ? commons(m.file) : "");
      var label = (MEDIA_TYPES && MEDIA_TYPES[m.type]) || (m.type || "poster");
      return { src: src, cap: label + " — " + (m.cap || ""), type: m.type || "poster" };
    }
    var p = _pic(c);
    p.type = p.type || "poster";
    p.cap = (MEDIA_TYPES.poster || "POSTER") + " — " + (p.cap || "Illustrative plate.");
    return p;
  };
  var _fill = typeof fillRail === "function" ? fillRail : null;
  if (_fill) {
    window.fillRail = function (id) {
      _fill(id);
      var rail = document.getElementById("rail");
      if (!rail) return;
      var cards = rail.querySelectorAll(".chip");
      var list = (window.clean || window.CASES || []).filter(function (c) { return c.domain === id; });
      cards.forEach(function (el, i) {
        var c = list[i];
        if (!c) return;
        var p = pic(c);
        el.setAttribute("data-media", p.type || "poster");
        var img = el.querySelector("img, .poster");
        if (img) img.title = p.cap;
      });
    };
  }
  var _open = typeof openCase === "function" ? openCase : null;
  if (_open) {
    window.openCase = function (id) {
      _open(id);
      var page = document.getElementById("page");
      if (!page) return;
      var c = (window.clean || []).find ? (window.clean || []).find(function (x) { return x.id === id; }) : null;
      if (!c && window.CASES) c = CASES.filter(function (x) { return x.id === id; })[0];
      if (!c) return;
      var p = pic(c);
      var cap = page.querySelector(".cap");
      if (cap) {
        cap.textContent = p.cap;
        var tag = document.createElement("div");
        tag.className = "media-tag";
        tag.textContent = (MEDIA_TYPES[p.type] || p.type || "POSTER");
        cap.parentNode.insertBefore(tag, cap);
      }
    };
  }
})();
