(function () {
  "use strict";
  var D = astrologyData, RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }
  var ST = { placeholder: "Nội dung mẫu", transcribed: "Chép từ lá số", derived: "Suy ra từ lá số", verified: "Đã xác minh", uncertain: "Chưa chắc, cần kiểm tra" };
  var KEYS = ["orca", "canhcut"], NAME = { orca: "Orca", canhcut: "Canhcut" };

  /* ---------- building blocks ---------- */
  function topicEl(t) {
    var d = el("details"), s = el("summary"); s.appendChild(el("span", "", t.title)); d.appendChild(s);
    var b = el("div", "body"); b.appendChild(el("span", "tag", ST[t.status] || t.status));
    [["Dữ kiện trên lá số", t.chartFacts], ["Nguồn", t.source], ["Luận giải theo truyền thống", t.interpretation], ["Điểm chưa chắc chắn", t.uncertainty], ["Thông tin còn thiếu", t.missing]].forEach(function (r) {
      if (!r[1]) return; var p = el("p"); p.appendChild(el("b", "", r[0] + ": ")); p.appendChild(document.createTextNode(r[1])); b.appendChild(p);
    });
    d.appendChild(b); return d;
  }
  function topicList(topics) {
    var w = el("div"), tools = el("div", "tools"), all = el("button", "btn sm ghost", "Mở tất cả"), items = topics.map(topicEl), openAll = false;
    all.type = "button";
    all.addEventListener("click", function () { openAll = !openAll; items.forEach(function (d) { d.open = openAll; }); all.textContent = openAll ? "Thu gọn tất cả" : "Mở tất cả"; });
    tools.appendChild(all); w.appendChild(tools); items.forEach(function (d) { w.appendChild(d); });
    return { node: w, items: items };
  }
  function tabs(mount, defs) {
    var bar = el("div", "tabs"), panels = [], btns = [];
    bar.setAttribute("role", "tablist");
    function pick(i, focus) {
      btns.forEach(function (b, j) { b.setAttribute("aria-selected", j === i); b.tabIndex = j === i ? 0 : -1; panels[j].hidden = j !== i; });
      if (focus) btns[i].focus();
      panels[i].querySelectorAll(".bars").forEach(function (b) { b.classList.remove("in"); void b.offsetWidth; b.classList.add("in"); });
    }
    defs.forEach(function (d, i) {
      var b = el("button", "", d.label); b.type = "button"; b.setAttribute("role", "tab");
      b.addEventListener("click", function () { pick(i); });
      b.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); pick((i + 1) % defs.length, true); }
        if (e.key === "ArrowLeft") { e.preventDefault(); pick((i + defs.length - 1) % defs.length, true); }
      });
      var p = el("div", "panel"); p.setAttribute("role", "tabpanel"); p.appendChild(d.node);
      bar.appendChild(b); btns.push(b); panels.push(p);
    });
    mount.appendChild(bar); panels.forEach(function (p) { mount.appendChild(p); }); pick(0);
  }
  var ORDER = ["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"];
  function bars(list) {
    var w = el("div", "bars");
    ORDER.forEach(function (e) {
      var r = el("div", "bar");
      list.forEach(function (l, k) {
        if (k) r = el("div", "bar b2");
        r.appendChild(el("span", "", k ? "" : e));
        var tr = el("div"), f = el("i"); f.style.setProperty("--w", (l.data[e] / 4 * 100) + "%"); tr.appendChild(f); r.appendChild(tr);
        r.appendChild(el("span", "", String(l.data[e]))); r.setAttribute("title", l.name + " — " + e + ": " + l.data[e]); w.appendChild(r);
      });
    });
    return w;
  }
  function board(key) {
    var P = D[key].palaces, w = el("div"), g = el("div", "board"), core = el("div", "core");
    var pos = { "Tỵ": [1, 1], "Ngọ": [1, 2], "Mùi": [1, 3], "Thân": [1, 4], "Dậu": [2, 4], "Tuất": [3, 4], "Hợi": [4, 4], "Tý": [4, 3], "Sửu": [4, 2], "Dần": [4, 1], "Mão": [3, 1], "Thìn": [2, 1] };
    var btns = [];
    core.setAttribute("aria-live", "polite"); g.appendChild(core);
    function sel(i) {
      var b = BR.indexOf(P[i][1]), rel = [b, (b + 4) % 12, (b + 8) % 12, (b + 6) % 12].map(function (n) { return BR[n]; });
      btns.forEach(function (x, j) { x.classList.toggle("sel", j === i); x.classList.toggle("rel", j !== i && rel.indexOf(P[j][1]) > -1); x.setAttribute("aria-pressed", j === i); });
      core.textContent = ""; core.appendChild(el("strong", "", "Cung " + P[i][0] + " (" + P[i][1] + ")"));
      core.appendChild(el("span", "", P[i][2] + (P[i][3] ? " · " + P[i][3] : "")));
      core.appendChild(el("span", "", "Tam phương tứ chính: " + rel.join(", ")));
    }
    P.forEach(function (p, i) {
      var b = el("button", "pal"); b.type = "button"; b.style.gridArea = pos[p[1]][0] + "/" + pos[p[1]][1];
      b.appendChild(el("b", "", p[0])); b.appendChild(el("small", "", p[2] === "Không có chính tinh" ? "vô chính diệu" : p[2]));
      b.appendChild(el("small", "", p[1] + (p[3] ? " · " + p[3] : "")));
      b.addEventListener("click", function () { sel(i); }); g.appendChild(b); btns.push(b);
    });
    sel(0); w.appendChild(g); w.appendChild(el("p", "legend", "Bấm vào một cung để xem chính tinh và các cung tam phương tứ chính được làm sáng."));
    return w;
  }
  function pillars(key, items) {
    var w = el("div", "pillars");
    D[key].pillars.forEach(function (p, i) {
      var b = el("button", "pil" + (i === 2 ? " day" : "")); b.type = "button";
      b.setAttribute("aria-label", "Trụ " + p[0] + ": " + p[1] + " " + p[3] + ". Bấm để mở phần luận giải");
      b.appendChild(el("small", "", "Trụ " + p[0] + (i === 2 ? " · Nhật chủ" : "")));
      b.appendChild(el("strong", "", p[1])); b.appendChild(el("span", "", p[2])); b.appendChild(el("hr"));
      b.appendChild(el("strong", "", p[3])); b.appendChild(el("span", "", p[4]));
      b.addEventListener("click", function () { var d = items[i]; d.open = true; d.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "center" }); });
      w.appendChild(b);
    }); return w;
  }

  /* ---------- profiles ---------- */
  function open(src, alt) { $("lb-img").src = src; $("lb-img").alt = alt; zoom = 100; setZ(); $("lightbox").showModal(); $("lb-close").focus(); }
  function profile(key, svg) {
    var p = D[key].profile, c = el("article", "card"), m = el("img", "m"); m.src = svg; m.alt = ""; c.appendChild(m);
    c.appendChild(el("h3", "", p.nickname + " · " + p.mascot)); c.appendChild(el("p", "", p.intro));
    var f = el("div", "facts"); D[key].facts.forEach(function (x) { f.appendChild(el("span", "", x)); }); c.appendChild(f);
    var b = el("button", "chart-btn"); b.type = "button"; b.setAttribute("aria-label", "Mở " + p.chartAlt + " cỡ lớn");
    var img = el("img"); img.alt = p.chartAlt; img.src = p.chartImage;
    img.onerror = function () { b.replaceChild(el("div", "ph", "Chưa có ảnh lá số. Hãy lưu ảnh với tên " + p.chartImage + " để hiển thị tại đây."), img); b.disabled = true; b.style.cursor = "default"; };
    b.appendChild(img); b.appendChild(el("em", "", "Phóng to"));
    b.addEventListener("click", function () { if (!b.disabled) open(p.chartImage, p.chartAlt); });
    c.appendChild(b);
    var r = el("div", "row"), a1 = el("a", "btn sm ghost", "Xem Tử Vi"), a2 = el("a", "btn sm ghost", "Xem Bát Tự");
    a1.href = "#tuvi"; a2.href = "#battu"; [a1, a2].forEach(function (a) { a.setAttribute("data-scroll", ""); r.appendChild(a); });
    c.appendChild(r); return c;
  }
  if (D.site.isPlaceholder) $("notice").textContent = D.site.notice; else $("notice").textContent = D.site.notice;
  $("tuvi-intro").textContent = D.site.tuviIntro; $("batu-intro").textContent = D.site.batuIntro;
  $("syn-intro").textContent = D.site.synIntro; $("disclaimer").textContent = D.site.disclaimer;
  $("profiles").appendChild(profile("orca", "assets/orca.svg")); $("profiles").appendChild(profile("canhcut", "assets/penguin.svg"));

  /* ---------- Tử Vi / Bát Tự tabs ---------- */
  tabs($("tuvi-mount"), KEYS.map(function (k) {
    var n = el("div"); n.appendChild(el("p", "intro", D[k].tuViDauSo.school)); n.appendChild(el("h4", "", "Mười hai cung"));
    n.appendChild(board(k)); n.appendChild(el("h4", "", "Luận giải từng mục")); n.appendChild(topicList(D[k].tuViDauSo.topics).node);
    return { label: NAME[k], node: n };
  }));
  tabs($("batu-mount"), KEYS.map(function (k) {
    var n = el("div"), tl = topicList(D[k].batTu.topics);
    n.appendChild(el("p", "intro", D[k].batTu.convention)); n.appendChild(el("h4", "", "Tứ Trụ (bấm vào trụ để xem luận giải)"));
    n.appendChild(pillars(k, tl.items)); n.appendChild(el("h4", "", "Phân bố ngũ hành"));
    n.appendChild(bars([{ name: NAME[k], data: D[k].elements }])); n.appendChild(el("h4", "", "Luận giải từng mục")); n.appendChild(tl.node);
    return { label: NAME[k], node: n };
  }));

  /* ---------- synastry ---------- */
  var C = D.compatibility, s1 = el("div"), s2 = el("div"), s3 = el("div");
  s1.appendChild(topicList(C.tuViDauSo).node);
  s2.appendChild(el("h4", "", "So sánh ngũ hành"));
  var cm = el("div", "cmp"); cm.innerHTML = "<span><i></i>Orca</span><span><i class=\"g\"></i>Canhcut</span>"; s2.appendChild(cm);
  s2.appendChild(bars([{ name: "Orca", data: D.orca.elements }, { name: "Canhcut", data: D.canhcut.elements }])); s2.appendChild(topicList(C.batTu).node);
  s3.appendChild(topicList(C.synthesis).node); s3.appendChild(el("p", "intro", C.closing));
  tabs($("syn-mount"), [{ label: "Từ Tử Vi", node: s1 }, { label: "Từ Bát Tự", node: s2 }, { label: "Tổng hợp", node: s3 }]);

  /* ---------- lightbox + zoom ---------- */
  var zoom = 100, lb = $("lightbox");
  function setZ() { $("lb-img").style.setProperty("--z", zoom + "%"); $("z-reset").textContent = zoom + "%"; }
  $("z-in").addEventListener("click", function () { zoom = Math.min(400, zoom + 25); setZ(); });
  $("z-out").addEventListener("click", function () { zoom = Math.max(50, zoom - 25); setZ(); });
  $("z-reset").addEventListener("click", function () { zoom = 100; setZ(); });
  $("lb-close").addEventListener("click", function () { lb.close(); });
  lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });

  /* ---------- scroll, nav, progress ---------- */
  function go(id) { var t = document.querySelector(id); if (t) t.scrollIntoView({ behavior: RM ? "auto" : "smooth" }); }
  document.addEventListener("click", function (e) { var a = e.target.closest("[data-scroll]"); if (a) { e.preventDefault(); go(a.getAttribute("href")); } });
  $("to-top").addEventListener("click", function () { window.scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" }); });
  var links = [].slice.call(document.querySelectorAll("#nav a")), ticking = false;
  function onScroll() {
    var h = document.documentElement, y = h.scrollTop, cur = null;
    $("progress").style.width = (y / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + "%";
    links.forEach(function (a) { var s = document.querySelector(a.getAttribute("href")); if (s && s.getBoundingClientRect().top < window.innerHeight * .4) cur = a; });
    links.forEach(function (a) { a.classList.toggle("on", a === cur); }); ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add("in"); }); }, { threshold: .3 });
    document.querySelectorAll(".bars").forEach(function (b) { io.observe(b); });
  } else document.querySelectorAll(".bars").forEach(function (b) { b.classList.add("in"); });

  /* ---------- hero interaction ---------- */
  var hero = $("top");
  if (!RM) hero.addEventListener("pointermove", function (e) {
    var r = hero.getBoundingClientRect();
    hero.style.setProperty("--px", ((e.clientX - r.left) / r.width - .5) * 2);
    hero.style.setProperty("--py", ((e.clientY - r.top) / r.height - .5) * 2);
  });
  function burst(btn, chars, cls) {
    if (RM) return; var fx = $("fx"), r = btn.getBoundingClientRect(), h = hero.getBoundingClientRect();
    for (var i = 0; i < 14; i++) {
      var b = el("b", cls, chars[i % chars.length]);
      b.style.left = (r.left - h.left + Math.random() * r.width) + "px"; b.style.top = (cls ? 0 : r.top - h.top) + "px";
      b.style.setProperty("--dx", (Math.random() * 80 - 40) + "px"); b.style.fontSize = (10 + Math.random() * 16) + "px"; b.style.animationDelay = (i * 60) + "ms";
      fx.appendChild(b); setTimeout(function (n) { n.remove(); }, 3600, b);
    }
  }
  $("b-orca").addEventListener("click", function () { burst(this, ["○", "◦", "°"], ""); });
  $("b-peng").addEventListener("click", function () { burst(this, ["✦", "·", "•"], "snow"); });
})();
