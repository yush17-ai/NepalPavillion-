// --- Data (edit freely) ---
const ITEMS = [
  {
    id: "ant-wood",
    cat: "antiquitaeten",
    catLabel: "Antiquitäten",
    title: "Nepalesische Antiquitäten",
    symbol: "⌁",
    vibe: ["Tradition", "Kraftvoll"],
    short: "Handverlesene Stücke mit Geschichte – Holz, Metall, Patina.",
    details:
      "Einzelstücke aus Nepal: traditionelle Formen, Spuren des Lebens, authentische Materialien. Ideal für Sammler*innen und alle, die Räume mit Charakter füllen möchten."
  },
  {
    id: "sound-bowls",
    cat: "klangschalen",
    catLabel: "Klangschalen",
    title: "Klangschalen",
    symbol: "◯",
    vibe: ["Ruhig", "Geschenk"],
    short: "Warme Obertöne – für Meditation, Yoga und Raumklang.",
    details:
      "Von klaren, hohen Tönen bis zu tiefen, tragenden Frequenzen: Klangschalen eignen sich für Entspannung, Achtsamkeit und klangbasierte Rituale."
  },
  {
    id: "incense",
    cat: "raeucherwerk",
    catLabel: "Räucherstäbchen",
    title: "Räucherwerk",
    symbol: "〰",
    vibe: ["Duftend", "Ruhig"],
    short: "Von sanft-blumig bis erdig-warm – Duft als Ritual.",
    details:
      "Räucherstäbchen schaffen Atmosphäre und Fokus. Nutze sie für Meditation, Reinigung oder einfach als ruhigen Begleiter im Alltag."
  },
  {
    id: "statues",
    cat: "statuen",
    catLabel: "Statuen",
    title: "Hinduistische & buddhistische Statuen",
    symbol: "ॐ",
    vibe: ["Tradition", "Kraftvoll"],
    short: "Symbolik, Haltung, Präsenz – spirituelle Kunst für Zuhause.",
    details:
      "Darstellungen aus Hinduismus und Buddhismus: Ob als Altarstück, Fokuspunkt für Praxis oder ästhetisches Statement – jede Statue trägt Bedeutung."
  },
  {
    id: "flags",
    cat: "gebetsfahnen",
    catLabel: "Gebetsfahnen",
    title: "Gebetsfahnen",
    symbol: "⚑",
    vibe: ["Tradition", "Geschenk"],
    short: "Farbe, Wind, Wunsch – ein Klassiker aus dem Himalaya.",
    details:
      "Gebetsfahnen verbinden Raum und Natur. Sie stehen für Mitgefühl, Schutz und positive Intention – drinnen wie draußen."
  },
  {
    id: "tea",
    cat: "tee",
    catLabel: "Tee",
    title: "Tee",
    symbol: "☼",
    vibe: ["Ruhig", "Geschenk"],
    short: "Ein stiller Moment – Tee als tägliches Innehalten.",
    details:
      "Tee als Ritual: Wärme, Duft und Ruhe. Perfekt als kleines Geschenk oder als Begleiter für Meditation und Lesen."
  },
  {
    id: "soap",
    cat: "seife",
    catLabel: "Natürliche Seife",
    title: "Natürliche Seife",
    symbol: "✧",
    vibe: ["Ruhig", "Geschenk"],
    short: "Natürlich, sanft, duftend – Pflege, die sich gut anfühlt.",
    details:
      "Natürliche Seifen bringen Achtsamkeit in den Alltag: Textur, Duft und Pflege in einem. Ideal für kleine Wellness-Momente."
  }
];

// --- Helpers ---
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const state = {
  filter: "alle",
  query: "",
  mood: null
};

function normalize(s){
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function matches(item){
  const q = normalize(state.query);
  const byFilter = state.filter === "alle" ? true : item.cat === state.filter;
  const byMood = state.mood ? item.vibe.includes(state.mood) : true;
  const byQuery = !q
    ? true
    : normalize(item.title).includes(q) ||
      normalize(item.short).includes(q) ||
      normalize(item.catLabel).includes(q);
  return byFilter && byMood && byQuery;
}

function fancyPriceHint(cat){
  // not real prices; just playful "range" hints
  const map = {
    antiquitaeten: "Unikate",
    klangschalen: "Klang-Probe",
    raeucherwerk: "Duft-Skala",
    statuen: "Symbolik",
    gebetsfahnen: "Wind & Farbe",
    tee: "Warm & ruhig",
    seife: "Natürlich"
  };
  return map[cat] || "Entdecken";
}

// --- Rendering ---
function render(){
  const grid = $("#grid");
  const filtered = ITEMS.filter(matches);

  grid.innerHTML = "";
  if(filtered.length === 0){
    const empty = document.createElement("div");
    empty.className = "strip-card reveal on";
    empty.style.gridColumn = "1 / -1";
    empty.innerHTML = `
      <h3>Keine Treffer</h3>
      <p class="muted">Probier einen anderen Filter oder eine kürzere Suche.</p>
    `;
    grid.appendChild(empty);
    return;
  }

  for(const item of filtered){
    const card = document.createElement("article");
    card.className = "card reveal";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${item.title} – Details öffnen`);
    card.dataset.id = item.id;

    card.innerHTML = `
      <div class="cover">
        <div class="badge-cat">${item.catLabel}</div>
        <div class="symbol">${item.symbol}</div>
      </div>
      <div class="body">
        <h3>${item.title}</h3>
        <p>${item.short}</p>
        <div class="meta">
          <span class="tag">${fancyPriceHint(item.cat)}</span>
          <span class="muted">${item.vibe[0]} • ${item.vibe[1] || "Inspiration"}</span>
        </div>
      </div>
    `;

    card.addEventListener("click", () => openModal(item));
    card.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        openModal(item);
      }
    });

    grid.appendChild(card);
  }

  // reveal animation
  requestAnimationFrame(() => {
    $$(".reveal", grid).forEach((el, i) => {
      setTimeout(() => el.classList.add("on"), 40 + i * 40);
    });
  });
}

// --- Modal ---
function openModal(item){
  const modal = $("#modal");
  const content = $("#modalContent");

  content.innerHTML = `
    <div class="modal-hero">
      <div class="badge-cat">${item.catLabel}</div>
      <div class="symbol">${item.symbol}</div>
    </div>
    <div class="modal-title">${item.title}</div>
    <p class="modal-text">${item.details}</p>
    <div class="modal-meta">
      ${item.vibe.map(v => `<span class="pill">${v}</span>`).join("")}
      <span class="pill">${fancyPriceHint(item.cat)}</span>
      <span class="pill">Nepal • Spirituell</span>
    </div>
  `;

  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  // focus close button for accessibility
  setTimeout(() => $(".modal-close").focus(), 0);
}

function closeModal(){
  const modal = $("#modal");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// close handlers
$$("[data-close]").forEach(el => el.addEventListener("click", closeModal));
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape" && $("#modal").getAttribute("aria-hidden") === "false"){
    closeModal();
  }
});

// --- Filters & Search ---
function setActiveFilter(value){
  state.filter = value;
  state.mood = null; // mood resets when manual category chosen (keeps UX clean)
  $$(".filter").forEach(b => b.classList.toggle("active", b.dataset.filter === value));
  render();
}

$$(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    setActiveFilter(btn.dataset.filter);
  });
});

const searchInput = $("#searchInput");
searchInput.addEventListener("input", () => {
  state.query = searchInput.value.trim();
  render();
});

$("#clearSearch").addEventListener("click", () => {
  searchInput.value = "";
  state.query = "";
  render();
  searchInput.focus();
});

// --- Mood buttons (playful discovery) ---
$$(".mood").forEach(btn => {
  btn.addEventListener("click", () => {
    const m = btn.dataset.mood;
    state.mood = (state.mood === m) ? null : m;
    // visual feedback
    $$(".mood").forEach(b => b.classList.toggle("active", b.dataset.mood === state.mood));
    // keep current category filter as is
    render();
    // scroll to grid smoothly
    $("#kategorien").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// style mood "active" without touching CSS file too much
const moodStyle = document.createElement("style");
moodStyle.textContent = `
  .mood.active{
    border-color: rgba(22,70,160,0.28);
    background: linear-gradient(135deg, rgba(22,70,160,0.16), rgba(226,44,58,0.12));
  }
`;
document.head.appendChild(moodStyle);

// --- Chips in hero -> jump + filter ---
$$(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const label = chip.dataset.chip;
    const map = {
      "Antiquitäten": "antiquitaeten",
      "Klangschalen": "klangschalen",
      "Räucherwerk": "raeucherwerk",
      "Statuen": "statuen",
      "Gebetsfahnen": "gebetsfahnen",
      "Tee": "tee",
      "Natürliche Seife": "seife"
    };
    setActiveFilter(map[label] || "alle");
    $("#kategorien").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// --- Smooth links (supports older browsers / consistent easing) ---
$$("[data-smooth]").forEach(a => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if(!href || !href.startsWith("#")) return;
    const target = document.querySelector(href);
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    // close mobile nav
    closeNav();
  });
});

// --- Mobile Nav ---
const navToggle = $("#navToggle");
const nav = $("#nav");

function openNav(){
  nav.classList.add("open");
  navToggle.setAttribute("aria-expanded", "true");
}
function closeNav(){
  nav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}
navToggle.addEventListener("click", () => {
  nav.classList.contains("open") ? closeNav() : openNav();
});
document.addEventListener("click", (e) => {
  const isInside = nav.contains(e.target) || navToggle.contains(e.target);
  if(!isInside) closeNav();
});

// --- Parallax (gentle) ---
const himalaya = $("#himalaya");
const totem = $("#totem");
let lastX = 0, lastY = 0;

function parallax(x, y){
  // subtle transforms
  const dx = (x - 0.5) * 18;
  const dy = (y - 0.5) * 14;
  himalaya.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(1.02)`;
  totem.style.transform = `translate3d(${dx * -0.4}px, ${dy * -0.5}px, 0)`;
}

window.addEventListener("pointermove", (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  // throttle-ish with small smoothing
  lastX += (x - lastX) * 0.12;
  lastY += (y - lastY) * 0.12;

  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  parallax(lastX, lastY);
});

// --- Surprise button (fun) ---
$("#surpriseMe").addEventListener("click", () => {
  // choose random item among current matches if possible
  const candidates = ITEMS.filter(matches);
  const pool = candidates.length ? candidates : ITEMS;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  openModal(pick);
});

// --- Copy address ---
$("#copyAddress").addEventListener("click", async () => {
  const addr = "Nepal Pavillon, Zeil 6, 60313 Frankfurt am Main";
  const toast = $("#toast");
  try{
    await navigator.clipboard.writeText(addr);
    toast.textContent = "Adresse kopiert.";
  }catch{
    // fallback
    const ta = document.createElement("textarea");
    ta.value = addr;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    toast.textContent = "Adresse kopiert.";
  }
  setTimeout(() => (toast.textContent = ""), 2200);
});

// --- Year ---
$("#year").textContent = new Date().getFullYear();

// Initial render + reveal
render();

// reveal sections on scroll (simple IntersectionObserver)
const io = new IntersectionObserver((entries) => {
  for(const entry of entries){
    if(entry.isIntersecting){
      entry.target.classList.add("on");
      io.unobserve(entry.target);
    }
  }
}, { threshold: 0.08 });

$$(".section, .strip, .hero, .footer").forEach(sec => {
  sec.classList.add("reveal");
  io.observe(sec);
});
