;(function () {
  var rules = [
    [/poland|polish|gdańsk|gdansk|emilcin|wylatowo|gdynia|warsaw|targówek|nautilus|lublin|opole|kuyavian|baltic sea anomaly/i, ["poland"]],
    [/ussr|soviet|voronezh|petrozavodsk|dalnegorsk/i, ["ussr", "russia"]],
    [/russian empire|siberia|urals|dyatlov|tunguska|karelia|primorsky/i, ["russia"]],
    [/united kingdom|england|wales|scotland|suffolk|essex|cornwall/i, ["uk"]],
    [/united states|usa|new mexico|nevada|arizona|california|washington|montana|texas/i, ["usa"]]
  ];
  (window.CASES || []).forEach(function (c) {
    if (!c) return;
    c.tags = c.tags || [];
    var blob = [c.loc, c.title, c.summary, (c.tags || []).join(" ")].join(" ");
    rules.forEach(function (r) {
      if (r[0].test(blob)) {
        r[1].forEach(function (t) {
          if (c.tags.indexOf(t) < 0) c.tags.push(t);
        });
      }
    });
  });
})();
