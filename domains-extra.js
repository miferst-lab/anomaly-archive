DOMAINS.push(
  ["sacred-text", "Scripture and epic", "Bible, Quran, Enoch, vimanas, living traditions"],
  ["rock-art", "Rock art and earthworks", "Caves, Wandjina, Serpent Mound"]
);
FALL["sacred-text"] = "Santuario de Fatima Julho 2018-3.jpg";
FALL["rock-art"] = "Nazca Lines Hummingbird.jpg";
if (typeof renderCats === "function") renderCats("");
var fc = document.getElementById("filecount");
if (fc && window.CASES) fc.textContent = String(CASES.filter(function(c){return c.id&&c.title;}).length).padStart(3,"0");
