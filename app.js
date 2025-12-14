const STORAGE_KEY = "rareEleven_v1";

const DEFAULT_DATA = {
  hero: [
    { src: "", alt: "Painting 1" },
    { src: "", alt: "Painting 2" },
    { src: "", alt: "Painting 3" },
  ],
  items: [
    // Luxury “wall scene” cards with placeholder art (admin can replace)
    { id: crypto.randomUUID(), title: "Untitled No. 1", details: "Oil • 36×48", category: "A", artSrc: "" },
    { id: crypto.randomUUID(), title: "Untitled No. 2", details: "Acrylic • 30×40", category: "B", artSrc: "" },
    { id: crypto.randomUUID(), title: "Untitled No. 3", details: "Mixed • 24×36", category: "C", artSrc: "" },
    { id: crypto.randomUUID(), title: "Untitled No. 4", details: "Oil • 18×24", category: "D", artSrc: "" },
    { id: crypto.randomUUID(), title: "Untitled No. 5", details: "Acrylic • 40×60", category: "A", artSrc: "" },
    { id: crypto.randomUUID(), title: "Untitled No. 6", details: "Oil • 20×30", category: "B", artSrc: "" },
  ],
  cartCount: 0
};

function loadData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_DATA, ...parsed };
  }catch{
    return DEFAULT_DATA;
  }
}

function saveData(data){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let data = loadData();
let activeFilter = "ALL";

const yearEl = document.getElementById("year");
yearEl.textContent = String(new Date().getFullYear());

/* ---------- HERO RENDER ---------- */
function placeholderPaintingDataURI(seedText){
  // Simple inline SVG placeholder (nude / luxury tones)
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f6f0e7"/>
        <stop offset="1" stop-color="#e6d7c6"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="620" cy="220" r="240" fill="rgba(147,96,37,0.16)"/>
    <rect x="70" y="120" width="520" height="60" fill="rgba(15,15,16,0.08)"/>
    <text x="70" y="230" font-family="ui-sans-serif, system-ui" font-size="44" fill="rgba(15,15,16,0.45)">${seedText}</text>
    <text x="70" y="290" font-family="ui-sans-serif, system-ui" font-size="20" letter-spacing="4" fill="rgba(15,15,16,0.35)">RARE ELEVEN</text>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function renderHero(){
  document.querySelectorAll(".hero-frame").forEach(frame => {
    const idx = Number(frame.getAttribute("data-hero"));
    const img = frame.querySelector("img.hero-art");
    const heroObj = data.hero[idx];

    img.src = (heroObj && heroObj.src) ? heroObj.src : placeholderPaintingDataURI(`PAINTING ${idx+1}`);
    img.alt = heroObj?.alt || `Painting ${idx+1}`;
  });
}

/* ---------- GALLERY RENDER ---------- */
function renderGrid(){
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  const filtered = data.items.filter(item => {
    if(activeFilter === "ALL") return true;
    return item.category === activeFilter;
  });

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "card";

    const artSrc = item.artSrc ? item.artSrc : placeholderPaintingDataURI(item.title);

    card.innerHTML = `
      <div class="scene" aria-label="Luxury wall display scene">
        <div class="scene-artframe">
          <img class="scene-art" alt="${escapeHtml(item.title)}" />
        </div>
      </div>
      <div class="card-body">
        <div class="meta">
          <div>
            <p class="name">${escapeHtml(item.title)}</p>
            <p class="details">${escapeHtml(item.details)}</p>
          </div>
          <div class="tag">${escapeHtml(item.category)}</div>
        </div>

        <div class="card-actions">
          <button class="btn btn-ghost" data-action="view" data-id="${item.id}">View</button>
          <button class="btn" data-action="add" data-id="${item.id}">Add to Cart</button>
        </div>
      </div>
    `;

    const img = card.querySelector(".scene-art");
    img.src = artSrc;

    card.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if(!btn) return;
      const id = btn.getAttribute("data-id");
      const action = btn.getAttribute("data-action");
      if(action === "add") addToCart(id);
      if(action === "view") viewItem(id);
    });

    grid.appendChild(card);
  });
}

function escapeHtml(str){
  return String(str || "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/* ---------- CART (simple counter) ---------- */
const cartCountEl = document.getElementById("cartCount");

function syncCart(){
  cartCountEl.textContent = String(data.cartCount || 0);
}
function addToCart(){
  data.cartCount = (data.cartCount || 0) + 1;
  saveData(data);
  syncCart();
}
function viewItem(id){
  const item = data.items.find(x => x.id === id);
  if(!item) return;
  alert(`${item.title}\n${item.details}\nCategory: ${item.category}`);
}

document.getElementById("cartBtn").addEventListener("click", () => {
  alert(`Cart items: ${data.cartCount || 0}\n(Stub cart — easy to wire to Stripe later.)`);
});

/* ---------- FILTER ---------- */
const filterBtn = document.getElementById("filterBtn");
const filterMenu = document.getElementById("filterMenu");

filterBtn.addEventListener("click", () => {
  filterMenu.classList.toggle("open");
  filterMenu.setAttribute("aria-hidden", String(!filterMenu.classList.contains("open")));
});

filterMenu.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-filter]");
  if(!btn) return;
  activeFilter = btn.getAttribute("data-filter");
  [...filterMenu.querySelectorAll(".filter-item")].forEach(x => x.classList.remove("active"));
  btn.classList.add("active");
  renderGrid();
});

/* ---------- SEARCH MODAL + SECRET LINK ---------- */
const searchBtn = document.getElementById("searchBtn");
const modal = document.getElementById("searchModal");
const searchInput = document.getElementById("searchInput");
const secretArea = document.getElementById("secretArea");

function openModal(){
  modal.hidden = false;
  secretArea.hidden = true;
  setTimeout(() => searchInput?.focus(), 0);
}
function closeModal(){
  modal.hidden = true;
}

searchBtn.addEventListener("click", openModal);

modal.addEventListener("click", (e) => {
  if(e.target?.dataset?.close === "true") closeModal();
});

document.addEventListener("keydown", (e) => {
  if(!modal.hidden && e.key === "Escape") closeModal();
});

searchInput.addEventListener("input", () => {
  const q = (searchInput.value || "").trim();
  // Hidden page only visible when searched word-for-word:
  secretArea.hidden = !(q === "Alyssa Barresi");
});

/* ---------- INIT ---------- */
renderHero();
renderGrid();
syncCart();
saveData(data); // ensures defaults exist if empty
