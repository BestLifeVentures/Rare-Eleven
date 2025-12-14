const DRAFT_KEY = "rareEleven_draft_v1";     // Alyssa working draft
const PUBLISHED_URL = "content.json";        // current published file (read-only)
const DEFAULT = {
  hero: [
    { src: "", alt: "Painting 1" },
    { src: "", alt: "Painting 2" },
    { src: "", alt: "Painting 3" }
  ],
  items: []
};

function safeParse(raw){
  try{ return JSON.parse(raw); }catch{ return null; }
}
async function loadPublished(){
  const res = await fetch(PUBLISHED_URL, { cache: "no-store" });
  if(!res.ok) throw new Error("Could not load published content.json");
  return await res.json();
}
function loadDraft(){
  const raw = localStorage.getItem(DRAFT_KEY);
  return raw ? safeParse(raw) : null;
}
function saveDraft(d){
  localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
}

function ensure(d){
  d = d || {};
  if(!Array.isArray(d.hero)) d.hero = DEFAULT.hero.map(x => ({...x}));
  if(!Array.isArray(d.items)) d.items = [];
  return d;
}

function escapeHtml(str){
  return String(str || "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
function escapeAttr(str){ return escapeHtml(str).replaceAll("\n"," "); }

function fileToDataURL(file){
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

let draft = null;

const heroInputs = document.getElementById("heroInputs");
const itemsList = document.getElementById("itemsList");
const previewFrame = document.getElementById("previewFrame");

function heroRow(i){
  const w = document.createElement("div");
  w.className = "item";
  w.innerHTML = `
    <div class="item-head">
      <div>
        <p style="margin:0;font-weight:650;">Hero Painting ${i+1}</p>
        <p class="mini" style="margin:6px 0 0;">Upload or paste URL</p>
      </div>
    </div>

    <label class="label">Image URL</label>
    <input class="input" type="url" placeholder="https://..." value="${escapeAttr(draft.hero[i]?.src || "")}" data-hero-url="${i}" />

    <div style="height:10px;"></div>

    <label class="label">Upload image</label>
    <input class="input" style="padding:10px;" type="file" accept="image/*" data-hero-file="${i}" />

    <div style="height:10px;"></div>

    <label class="label">Alt text</label>
    <input class="input" type="text" value="${escapeAttr(draft.hero[i]?.alt || `Painting ${i+1}`)}" data-hero-alt="${i}" />
  `;
  return w;
}

function renderHero(){
  heroInputs.innerHTML = "";
  for(let i=0;i<3;i++) heroInputs.appendChild(heroRow(i));
}

function newItem(){
  return {
    id: crypto.randomUUID(),
    title: "Untitled",
    details: "Oil • Size",
    category: "A",
    artSrc: ""
  };
}

function itemCard(item){
  const el = document.createElement("div");
  el.className = "item";
  el.innerHTML = `
    <div class="item-head">
      <div>
        <p style="margin:0;font-weight:650;">${escapeHtml(item.title)}</p>
        <p class="mini" style="margin:6px 0 0;">ID: ${item.id}</p>
      </div>
      <button class="pill-btn danger" data-del="${item.id}">Delete</button>
    </div>

    <div class="row">
      <div>
        <label class="label">Title</label>
        <input class="input" type="text" value="${escapeAttr(item.title)}" data-title="${item.id}" />
      </div>
      <div>
        <label class="label">Details</label>
        <input class="input" type="text" value="${escapeAttr(item.details)}" data-details="${item.id}" />
      </div>
    </div>

    <div style="height:10px;"></div>

    <div class="row">
      <div>
        <label class="label">Category</label>
        <select class="input" data-cat="${item.id}">
          ${["A","B","C","D"].map(c => `<option value="${c}" ${item.category===c?"selected":""}>${c}</option>`).join("")}
        </select>
      </div>
      <div>
        <label class="label">Image URL</label>
        <input class="input" type="url" placeholder="https://..." value="${escapeAttr(item.artSrc || "")}" data-url="${item.id}" />
      </div>
    </div>

    <div style="height:10px;"></div>

    <label class="label">Upload image</label>
    <input class="input" style="padding:10px;" type="file" accept="image/*" data-file="${item.id}" />

    <p class="mini">Uploads store in the draft (local). Publishing exports to content.json.</p>
  `;
  return el;
}

function renderItems(){
  itemsList.innerHTML = "";
  draft.items.forEach(item => itemsList.appendChild(itemCard(item)));
}

function persist(){
  saveDraft(draft);
}

function refreshPreview(){
  // The homepage reads draft from localStorage; reload iframe to reflect it
  if(previewFrame) previewFrame.contentWindow?.location?.reload();
}

/* Events: hero inputs */
heroInputs.addEventListener("input", (e) => {
  const urlIdx = e.target.getAttribute?.("data-hero-url");
  const altIdx = e.target.getAttribute?.("data-hero-alt");

  if(urlIdx !== null){
    draft.hero[Number(urlIdx)].src = e.target.value.trim();
    persist();
  }
  if(altIdx !== null){
    draft.hero[Number(altIdx)].alt = e.target.value.trim();
    persist();
  }
});

heroInputs.addEventListener("change", async (e) => {
  const fileIdx = e.target.getAttribute?.("data-hero-file");
  if(fileIdx === null) return;
  const file = e.target.files?.[0];
  if(!file) return;
  draft.hero[Number(fileIdx)].src = await fileToDataURL(file);
  persist();
  alert(`Hero ${Number(fileIdx)+1} updated in Draft.`);
});

/* Events: item inputs */
itemsList.addEventListener("input", (e) => {
  const id =
    e.target.getAttribute?.("data-title") ||
    e.target.getAttribute?.("data-details") ||
    e.target.getAttribute?.("data-url");
  if(!id) return;

  const item = draft.items.find(x => x.id === id);
  if(!item) return;

  if(e.target.hasAttribute("data-title")) item.title = e.target.value;
  if(e.target.hasAttribute("data-details")) item.details = e.target.value;
  if(e.target.hasAttribute("data-url")) item.artSrc = e.target.value.trim();

  persist();
});

itemsList.addEventListener("change", async (e) => {
  const delId = e.target.getAttribute?.("data-del");
  const catId = e.target.getAttribute?.("data-cat");
  const fileId = e.target.getAttribute?.("data-file");

  if(delId){
    draft.items = draft.items.filter(x => x.id !== delId);
    persist();
    renderItems();
    return;
  }

  if(catId){
    const item = draft.items.find(x => x.id === catId);
    if(item) item.category = e.target.value;
    persist();
    return;
  }

  if(fileId){
    const file = e.target.files?.[0];
    if(!file) return;
    const url = await fileToDataURL(file);
    const item = draft.items.find(x => x.id === fileId);
    if(item) item.artSrc = url;
    persist();
    alert("Item image updated in Draft.");
  }
});

/* Buttons */
document.getElementById("addItemBtn").addEventListener("click", () => {
  draft.items.unshift(newItem());
  persist();
  renderItems();
});

document.getElementById("previewBtn").addEventListener("click", () => {
  refreshPreview();
});

document.getElementById("publishDownloadBtn").addEventListener("click", () => {
  // Publishing for static site = produce a content.json file
  const json = JSON.stringify(draft, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "content.json";
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);

  alert("Downloaded content.json. Commit/replace it in GitHub to publish site-wide.");
});

document.getElementById("resetBtn").addEventListener("click", async () => {
  if(!confirm("Reset Draft to the currently published site content.json?")) return;
  const pub = await loadPublished();
  draft = ensure(pub);
  persist();
  renderHero();
  renderItems();
  refreshPreview();
  alert("Draft reset to published content.");
});

/* INIT */
(async function init(){
  const pub = ensure(await loadPublished());
  draft = ensure(loadDraft() || pub);  // default draft = published
  persist();
  renderHero();
  renderItems();
})();
