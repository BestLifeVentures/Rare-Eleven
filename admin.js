const STORAGE_KEY = "rareEleven_v1";

function load(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch{
    return null;
  }
}
function save(data){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function ensureData(d){
  if(!d) d = {};
  if(!Array.isArray(d.hero)) d.hero = [{src:"",alt:"Painting 1"},{src:"",alt:"Painting 2"},{src:"",alt:"Painting 3"}];
  if(!Array.isArray(d.items)) d.items = [];
  if(typeof d.cartCount !== "number") d.cartCount = 0;
  return d;
}

let data = ensureData(load());

const heroInputs = document.getElementById("heroInputs");
const itemsList = document.getElementById("itemsList");

function fileToDataURL(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function heroRow(i){
  const wrapper = document.createElement("div");
  wrapper.className = "item";

  wrapper.innerHTML = `
    <div class="item-head">
      <div>
        <p style="margin:0;font-weight:650;">Hero Painting ${i+1}</p>
        <p class="mini" style="margin:6px 0 0;">Upload or paste URL</p>
      </div>
    </div>

    <label class="label">Image URL</label>
    <input class="input" type="url" placeholder="https://..." value="${escapeAttr(data.hero[i]?.src || "")}" data-hero-url="${i}" />

    <div style="height:10px;"></div>

    <label class="label">Upload image</label>
    <input class="input" style="padding:10px;" type="file" accept="image/*" data-hero-file="${i}" />

    <div style="height:10px;"></div>

    <label class="label">Alt text</label>
    <input class="input" type="text" value="${escapeAttr(data.hero[i]?.alt || `Painting ${i+1}`)}" data-hero-alt="${i}" />
  `;

  return wrapper;
}

function renderHero(){
  heroInputs.innerHTML = "";
  for(let i=0;i<3;i++){
    heroInputs.appendChild(heroRow(i));
  }

  heroInputs.addEventListener("input", (e) => {
    const urlIdx = e.target.getAttribute?.("data-hero-url");
    const altIdx = e.target.getAttribute?.("data-hero-alt");

    if(urlIdx !== null){
      data.hero[Number(urlIdx)].src = e.target.value.trim();
      save(data);
    }
    if(altIdx !== null){
      data.hero[Number(altIdx)].alt = e.target.value.trim();
      save(data);
    }
  });

  heroInputs.addEventListener("change", async (e) => {
    const fileIdx = e.target.getAttribute?.("data-hero-file");
    if(fileIdx === null) return;
    const file = e.target.files?.[0];
    if(!file) return;

    const url = await fileToDataURL(file);
    data.hero[Number(fileIdx)].src = url;
    save(data);
    alert(`Hero ${Number(fileIdx)+1} updated.`);
  });
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

    <p class="mini">Note: uploaded images are stored in your browser (localStorage).</p>
  `;
  return el;
}

function renderItems(){
  itemsList.innerHTML = "";
  data.items.forEach(item => itemsList.appendChild(itemCard(item)));
}

itemsList.addEventListener("input", (e) => {
  const id =
    e.target.getAttribute?.("data-title") ||
    e.target.getAttribute?.("data-details") ||
    e.target.getAttribute?.("data-url");

  if(!id) return;

  const item = data.items.find(x => x.id === id);
  if(!item) return;

  if(e.target.hasAttribute("data-title")) item.title = e.target.value;
  if(e.target.hasAttribute("data-details")) item.details = e.target.value;
  if(e.target.hasAttribute("data-url")) item.artSrc = e.target.value.trim();

  save(data);
});

itemsList.addEventListener("change", async (e) => {
  const delId = e.target.getAttribute?.("data-del");
  const catId = e.target.getAttribute?.("data-cat");
  const fileId = e.target.getAttribute?.("data-file");

  if(delId){
    data.items = data.items.filter(x => x.id !== delId);
    save(data);
    renderItems();
    return;
  }

  if(catId){
    const item = data.items.find(x => x.id === catId);
    if(item) item.category = e.target.value;
    save(data);
    return;
  }

  if(fileId){
    const file = e.target.files?.[0];
    if(!file) return;
    const url = await fileToDataURL(file);
    const item = data.items.find(x => x.id === fileId);
    if(item) item.artSrc = url;
    save(data);
    alert("Item image updated.");
  }
});

document.getElementById("addItemBtn").addEventListener("click", () => {
  data.items.unshift(newItem());
  save(data);
  renderItems();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if(!confirm("Reset all site data (hero + portfolio + cart) on this browser?")) return;
  localStorage.removeItem(STORAGE_KEY);
  data = ensureData(load());
  renderHero();
  renderItems();
  alert("Reset complete.");
});

function escapeHtml(str){
  return String(str || "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
function escapeAttr(str){
  return escapeHtml(str).replaceAll("\n"," ");
}

/* init */
renderHero();
renderItems();
