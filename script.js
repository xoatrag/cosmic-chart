(function () {
  "use strict";
  var D = astrologyData, $ = function (id) { return document.getElementById(id); };
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }
  var STATUS = { placeholder: "Nội dung mẫu", transcribed: "Đã chép từ lá số, chờ xác minh", derived: "Suy ra từ dữ kiện đã chép, chờ xác minh", verified: "Đã kiểm chứng", uncertain: "Chưa chắc, cần kiểm tra thủ công" };

  function topicEl(t) {
    var d = el("details"), s = el("summary"); s.appendChild(el("span", "", t.title)); d.appendChild(s);
    var b = el("div", "body"), tag = el("span", "tag", STATUS[t.status] || t.status); b.appendChild(tag);
    [["Dữ kiện trên lá số", t.chartFacts], ["Nguồn", t.source], ["Luận giải theo truyền thống", t.interpretation], ["Điểm chưa chắc chắn", t.uncertainty], ["Thông tin còn thiếu", t.missing]].forEach(function (r) {
      if (!r[1]) return; var p = el("p"); p.appendChild(el("b", "", r[0] + ": ")); p.appendChild(document.createTextNode(r[1])); b.appendChild(p);
    });
    d.appendChild(b); return d;
  }
  function column(name, intro, topics, mascot) {
    var c = el("div", "card"); c.appendChild(el("h3", "", name));
    if (intro) c.appendChild(el("p", "intro", intro));
    topics.forEach(function (t) { c.appendChild(topicEl(t)); }); return c;
  }
  function open(src, alt) { $("lb-img").src = src; $("lb-img").alt = alt; $("lightbox").showModal(); $("lb-close").focus(); }

  function profile(key, svg) {
    var p = D[key].profile, c = el("article", "card"), m = el("img", "m" + (key === "canhcut" ? " peng-i" : ""));
    m.src = svg; m.alt = ""; c.appendChild(m); c.appendChild(el("h3", "", p.nickname));
    c.appendChild(el("p", "", p.intro));
    var b = el("button", "chart-btn"); b.type = "button"; b.setAttribute("aria-label", "Mở " + p.chartAlt + " cỡ lớn");
    var img = el("img"); img.alt = p.chartAlt; img.src = p.chartImage;
    img.onerror = function () {
      var ph = el("div", "ph", "Chưa có ảnh lá số. Hãy lưu ảnh với tên " + p.chartImage + " để hiển thị tại đây.");
      b.replaceChild(ph, img); b.disabled = true; b.style.cursor = "default";
    };
    b.appendChild(img); b.addEventListener("click", function () { if (!b.disabled) open(p.chartImage, p.chartAlt); });
    c.appendChild(b);
    var r = el("div", "row"), a1 = el("a", "btn sm ghost", "Xem Tử Vi"), a2 = el("a", "btn sm ghost", "Xem Bát Tự");
    a1.href = "#tuvi"; a2.href = "#battu"; [a1, a2].forEach(function (a) { a.setAttribute("data-scroll", ""); r.appendChild(a); });
    c.appendChild(r); return c;
  }

  if (D.site.isPlaceholder) $("notice").textContent = D.site.notice; else $("notice").hidden = true;
  $("tuvi-intro").textContent = D.site.tuviIntro; $("batu-intro").textContent = D.site.batuIntro;
  $("syn-intro").textContent = D.site.synIntro; $("disclaimer").textContent = D.site.disclaimer;
  $("profiles").appendChild(profile("orca", "assets/orca.svg")); $("profiles").appendChild(profile("canhcut", "assets/penguin.svg"));
  ["orca", "canhcut"].forEach(function (k) {
    $("tuvi-cols").appendChild(column(D[k].profile.nickname, D[k].tuViDauSo.school, D[k].tuViDauSo.topics));
    $("batu-cols").appendChild(column(D[k].profile.nickname, D[k].batTu.convention, D[k].batTu.topics));
  });
  var C = D.compatibility;
  $("syn-cols").appendChild(column("Theo Tử Vi Đẩu Số", "", C.tuViDauSo));
  $("syn-cols").appendChild(column("Theo Bát Tự", "", C.batTu));
  var syn = column("Luận giải tổng hợp", "", C.synthesis); syn.appendChild(el("p", "intro", C.closing)); $("syn-synth").appendChild(syn);

  var lb = $("lightbox");
  $("lb-close").addEventListener("click", function () { lb.close(); });
  lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function go(id) { var t = document.querySelector(id); if (t) t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-scroll]"); if (a) { e.preventDefault(); go(a.getAttribute("href")); }
  });
  $("to-top").addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
})();
