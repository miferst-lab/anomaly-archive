(function () {
  var A = window.SRC_ACCESS || "2026-09-27";
  if (typeof sourcesFor !== "function") return;
  var orig = sourcesFor;
  sourcesFor = function (c) {
    return orig(c).map(function (row) {
      var kind = row[2] || "permalink";
      if (kind.indexOf("accessed") === -1) kind = kind + " · accessed " + A;
      return [row[0], row[1], kind];
    });
  };
})();
