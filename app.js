const CONTENT_URL = "content.json";         // published content
const DRAFT_KEY = "rareEleven_draft_v1";    // Alyssa draft content
const CART_KEY = "rareEleven_cart_v1";

let published = null;
let draft = null;
let activeFilter = "ALL";

function placeholderPaintingDataURI(seedText){
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

function escapeHtml(str){
  return String(str || "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

async function fetchPublished(){
  const res = await fetch(CONTENT_URL, { cache: "no-store" });
  if(!res.ok) throw new Error(`Failed to load ${CONTENT_URL}`);
  return await res.json();
}

function loadDraft(){
  try{
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch{
    return null;
  }
}

function loadCartCount(){
  try{
    const raw = localStorage.getItem(CART_KEY);
    return raw ? Number(raw) : 0;
  }catch{
    return 0;
  }
}
function saveCartCount(n){
  localStorage.setItem(CART_KEY, String(n));
}

function getActiveContent(){
  // If Alyssa has a draft and we’re viewing in same browser, show draft on site.
  // This makes “Preview” possible without publishing.
  return draft || published;
}

/* ---------- HERO ---------- */
function renderHero(){
  const c = getActiveContent();
  document.querySelectorAll(".hero-frame").forEach(frame => {
    const idx = Number(frame.getAttribute("data-hero"));
    const img = frame.querySelector("img.hero-art");
    const heroObj = c?.hero?.[idx];

    img.src = heroObj?.src ? heroObj.src : placeholderPaintingDataURI(`PAINTING ${idx+1}`);
    img.alt = heroObj?.alt || `Painting ${idx+1}`;
  });
}

/* ---------- GRID ---------- */
function renderGrid(){
  const c = getActiveContent();
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  const items = Array.isArray(c?.items) ? c.items : [];
  const filtered = items.filter(item => activeFilter === "ALL" ? true : item.category === activeFilter);

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "card";

    const artSrc = item.artSrc ? item.artSrc : placeholderPaintingDataURI(item.title || "Artwork");

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
          <button class="btn btn-ghost" data-action="view">View</button>
          <button class="btn" data-action="add">Add to Cart</button>
        </div>
      </div>
    `;

    card.querySelector(".scene-art").src = artSrc;

    card.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if(!btn) return;

      const action = btn.getAttribute("data-action");
      if(action === "add"){
        cartCount++;
        saveCartCount(cartCount);
        syncCart();
      }
      if(action === "view"){
        alert(`${item.title}\n${item.details}\nCategory: ${item.category}`);
      }
    });

    grid.appendChild(card);
  });
}

/* ---------- CART ---------- */
let cartCount = loadCartCount();
const cartCountEl = document.getElementById("cartCount");
function syncCart(){ cartCountEl.textContent = String(cartCount); }
document.getElementById("cartBtn").addEventListener("click", () => {
  alert(`Cart items: ${cartCount}\n(Stub cart — can wire to Stripe later.)`);
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

/* ---------- SEARCH + SECRET LINK ---------- */
const searchBtn = document.getElementById("searchBtn");
const modal = document.getElementById("searchModal");
const searchInput = document.getElementById("searchInput");
const secretArea = document.getElementById("secretArea");

function openModal(){
  modal.hidden = false;
  secretArea.hidden = true;
  setTimeout(() => searchInput?.focus(), 0);
}
function closeModal(){ modal.hidden = true; }

searchBtn.addEventListener("click", openModal);
modal.addEventListener("click", (e) => { if(e.target?.dataset?.close === "true") closeModal(); });
document.addEventListener("keydown", (e) => { if(!modal.hidden && e.key === "Escape") closeModal(); });

searchInput.addEventListener("input", () => {
  const q = (searchInput.value || "").trim();
  secretArea.hidden = !(q === "Alyssa Barresi");
});

/* ---------- INIT ---------- */
(async function init(){
  document.getElementById("year").textContent = String(new Date().getFullYear());
  draft = loadDraft();
  published = await fetchPublished();
  renderHero();
  renderGrid();
  syncCart();
})();
