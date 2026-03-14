const WA_PHONE = "525565272072";

const categories = [
  "Quekas",
  "Especiales",
  "Pambazos",
  "Tostadas",
  "Suadero",
  "Panucho",
  "Bebidas",
  "Postres",
  "Aguas",
  "Pozole",
];

const menu = {
  Quekas: [
    { id: "queka", name: "Quekas", desc: "Hechas al momento, personaliza estilo y guisado.", base: 26, kind: "queka" },
  ],
  Especiales: [
    { id: "esp-h", name: "Hawaiana", base: 30, kind: "special" },
    { id: "esp-r", name: "Rajas con queso", base: 30, kind: "special" },
    { id: "esp-s", name: "Sesos", base: 30, kind: "special" },
    { id: "esp-su", name: "Suadero especial", base: 35, kind: "special-suadero" },
  ],
  Pambazos: [
    { id: "pgs", name: "Pambazo / Gordita / Sope", desc: "Se sirven con lechuga, crema y queso.", base: 36, kind: "pgs" },
  ],
  Tostadas: [{ id: "tos", name: "Tostadas", base: 35, kind: "tostadas" }],
  Suadero: [{ id: "suadero", name: "Gorditas y Sopes de suadero", base: 48, kind: "suadero" }],
  Panucho: [{ id: "pan", name: "Panucho de cochinita", base: 36, kind: "fixed" }],
  Bebidas: [
    { id: "ref", name: "Refresco", base: 28, kind: "drink", opts: ["Coca Cola", "Fanta", "Freska", "Sprite", "Sidral", "Mundet Rojo"] },
    { id: "boing", name: "Boing", base: 28, kind: "drink", opts: ["Mango", "Guayaba"] },
    { id: "cafe", name: "Café de olla (taza grande)", base: 36, kind: "fixed" },
  ],
  Postres: [
    { id: "gel", name: "Gelatina tres leches con piña", base: 35, kind: "fixed" },
    { id: "arr", name: "Arroz con leche", base: 30, kind: "fixed" },
    { id: "fla", name: "Flan de vainilla", base: 30, kind: "fixed" },
    { id: "pay", name: "Pay de limón", base: 35, kind: "fixed" },
  ],
  Aguas: [{ id: "aguas", name: "Aguas naturales", base: 36, kind: "agua" }],
  Pozole: [{ id: "poz", name: "Pozole tradicional estilo Jalisco", desc: "Disponible solo viernes y sábado", base: 105, kind: "fixed" }],
};

const opts = {
  quekaStyles: [
    ["Frita", 26],
    ["Frita con queso", 30],
    ["Al comal", 30],
    ["Al comal con queso", 36],
  ],
  fillings: ["Tinga de pollo", "Tinga de res", "Picadillo de res", "Huitlacoche", "Requesón", "Hongos", "Queso", "Papa", "Pancita", "Chicharrón", "Rajas con papas", "Flor de calabaza", "Cochinita"],
  pgsTypes: ["Pambazo", "Gordita", "Sope"],
  pgsStyles: [["Sencillo", 36], ["Con quesillo", 40], ["Con guisado", 46]],
  tostadasStyles: [["Sencillas", 35], ["Combinadas", 40]],
  tostadasFillings: ["Pata", "Tinga de res", "Tinga de pollo", "Picadillo", "Cochinita"],
  suaderoStyles: [["Sencillo", 48], ["Con queso", 56]],
  special: [["Frita", 30], ["Comal", 36]],
  specialSuadero: [["Frita", 35], ["Comal", 38], ["Con queso", 45]],
  aguas: [["1/2 litro", 36], ["1 litro", 65], ["Jarra 2 litros", 120]],
};

const state = { activeCat: "Quekas", query: "", cart: [], current: null, selection: { qty: 1, values: {} } };
let deferredInstallPrompt = null;

const $ = (s) => document.querySelector(s);
const refs = {
  categoryBar: $("#categoryBar"), menuList: $("#menuList"), searchWrap: $("#searchWrap"), searchInput: $("#searchInput"),
  searchToggleBtn: $("#searchToggleBtn"), headerCartBtn: $("#headerCartBtn"), downloadAppBtn: $("#downloadAppBtn"), headerCartCount: $("#headerCartCount"), floatingCartBtn: $("#floatingCartBtn"),
  floatingCartCount: $("#floatingCartCount"), backdrop: $("#backdrop"), sheet: $("#customizationSheet"), sheetTitle: $("#sheetTitle"), sheetContent: $("#sheetContent"),
  priceLive: $("#priceLive"), closeSheetBtn: $("#closeSheetBtn"), addToCartBtn: $("#addToCartBtn"), cartDrawer: $("#cartDrawer"), closeCartBtn: $("#closeCartBtn"),
  cartItems: $("#cartItems"), subtotalValue: $("#subtotalValue"), totalValue: $("#totalValue"), customerName: $("#customerName"), orderNotes: $("#orderNotes"),
  deliveryAddress: $("#deliveryAddress"), addressGroup: $("#addressGroup"), clearCartBtn: $("#clearCartBtn"), whatsAppBtn: $("#whatsAppBtn")
};

const money = (n) => `$${n}`;

function renderCategories() {
  refs.categoryBar.innerHTML = categories
    .map((c) => `<button class="cat-btn ${c === state.activeCat ? "active" : ""}" data-cat="${c}">${c}</button>`)
    .join("");
}

function inSearch(item) {
  if (!state.query) return true;
  return (`${item.name} ${item.desc || ""}`).toLowerCase().includes(state.query.toLowerCase());
}

function renderMenu() {
  const list = (menu[state.activeCat] || []).filter(inSearch);
  refs.menuList.innerHTML = list.length
    ? list.map((i) => `
      <article class="card">
        <div class="card-head">
          <div>
            <h3>${i.name}</h3>
            ${i.desc ? `<p>${i.desc}</p>` : ""}
          </div>
          <div class="price">Desde ${money(i.base)}</div>
        </div>
        <button class="btn btn-primary" data-item="${i.id}">Personalizar</button>
      </article>
    `).join("")
    : `<p class="empty">No encontramos productos para "${state.query}".</p>`;
}

function getItemsFlat() { return Object.values(menu).flat(); }

function openBackdrop() { refs.backdrop.hidden = false; }
function closeBackdrop() {
  const open = refs.sheet.classList.contains("open") || refs.cartDrawer.classList.contains("open");
  refs.backdrop.hidden = !open;
}

function openSheet(item) {
  state.current = item;
  state.selection = { qty: 1, values: {} };
  refs.sheetTitle.textContent = item.name;
  refs.sheetContent.innerHTML = getSheetHTML(item);
  refs.sheet.classList.add("open");
  refs.sheet.setAttribute("aria-hidden", "false");
  refs.addToCartBtn.disabled = !isValid(item.kind);
  updateLivePrice();
  openBackdrop();
}

function closeSheet() {
  refs.sheet.classList.remove("open");
  refs.sheet.setAttribute("aria-hidden", "true");
  state.current = null;
  closeBackdrop();
}

function openCart() {
  refs.cartDrawer.classList.add("open");
  refs.cartDrawer.setAttribute("aria-hidden", "false");
  openBackdrop();
}

function closeCart() {
  refs.cartDrawer.classList.remove("open");
  refs.cartDrawer.setAttribute("aria-hidden", "true");
  closeBackdrop();
}

function radioBlock(name, title, rows) {
  return `<section class="option-block"><h4>${title}</h4>${rows.map(([label, price]) => `
      <label class="radio-option">
        <span><input type="radio" name="${name}" value="${label}" /> ${label}</span>
        ${price != null ? `<strong>${money(price)}</strong>` : ""}
      </label>`).join("")}
    </section>`;
}

function chipBlock(name, title, rows) {
  return `<section class="option-block"><h4>${title}</h4><div class="chips" data-chip-group="${name}">
      ${rows.map((r) => `<button type="button" class="chip" data-chip="${r}">${r}</button>`).join("")}
    </div></section>`;
}

function qtyBlock() {
  return `<section class="option-block"><h4>Cantidad</h4>
      <div class="stepper">
        <button type="button" data-step="minus">−</button>
        <span id="qtyVal">1</span>
        <button type="button" data-step="plus">+</button>
      </div>
    </section>`;
}

function getSheetHTML(item) {
  if (item.kind === "queka") return `${radioBlock("style","Selecciona estilo",opts.quekaStyles)}${chipBlock("filling","Selecciona guisado",opts.fillings)}${qtyBlock()}`;
  if (item.kind === "special") return `${radioBlock("style","Selecciona estilo",opts.special)}${qtyBlock()}`;
  if (item.kind === "special-suadero") return `${radioBlock("style","Selecciona estilo",opts.specialSuadero)}${qtyBlock()}`;
  if (item.kind === "pgs") return `${radioBlock("type","Tipo",opts.pgsTypes.map((x)=>[x,null]))}${radioBlock("style","Estilo",opts.pgsStyles)}${qtyBlock()}`;
  if (item.kind === "tostadas") return `${radioBlock("style","Opción",opts.tostadasStyles)}${chipBlock("filling","Guisado",opts.tostadasFillings)}${qtyBlock()}`;
  if (item.kind === "suadero") return `${radioBlock("style","Estilo",opts.suaderoStyles)}${qtyBlock()}`;
  if (item.kind === "drink") return `${chipBlock("flavor","Sabor",item.opts)}${qtyBlock()}`;
  if (item.kind === "agua") return `${radioBlock("size","Tamaño",opts.aguas)}${qtyBlock()}`;
  return qtyBlock();
}

function isValid(kind) {
  const v = state.selection.values;
  if (["fixed"].includes(kind)) return true;
  if (kind === "queka") return !!(v.style && v.filling);
  if (kind === "pgs") return !!(v.type && v.style);
  if (kind === "tostadas") return !!(v.style && v.filling);
  if (kind === "drink") return !!v.flavor;
  if (kind === "agua") return !!v.size;
  if (["special", "special-suadero", "suadero"].includes(kind)) return !!v.style;
  return true;
}

function priceFor(item, values) {
  const from = (rows, key) => (rows.find((r) => r[0] === key) || [null, item.base])[1];
  if (item.kind === "queka") return from(opts.quekaStyles, values.style);
  if (item.kind === "special") return from(opts.special, values.style);
  if (item.kind === "special-suadero") return from(opts.specialSuadero, values.style);
  if (item.kind === "pgs") return from(opts.pgsStyles, values.style);
  if (item.kind === "tostadas") return from(opts.tostadasStyles, values.style);
  if (item.kind === "suadero") return from(opts.suaderoStyles, values.style);
  if (item.kind === "agua") return from(opts.aguas, values.size);
  return item.base;
}

function updateLivePrice() {
  const item = state.current;
  if (!item) return;
  const unit = priceFor(item, state.selection.values);
  refs.priceLive.textContent = `Total parcial: ${money(unit * state.selection.qty)}`;
  refs.addToCartBtn.disabled = !isValid(item.kind);
}

function summary(values) {
  const out = [];
  if (values.type) out.push(values.type);
  if (values.style) out.push(values.style);
  if (values.filling) out.push(`Guisado: ${values.filling}`);
  if (values.flavor) out.push(`Sabor: ${values.flavor}`);
  if (values.size) out.push(values.size);
  return out.join(" · ");
}

function addToCart() {
  const item = state.current;
  if (!item || !isValid(item.kind)) return;
  const unit = priceFor(item, state.selection.values);
  state.cart.push({
    id: `${item.id}-${Date.now()}`,
    name: item.name,
    qty: state.selection.qty,
    unit,
    details: summary(state.selection.values),
  });
  refs.floatingCartBtn.classList.add("add-bounce");
  setTimeout(() => refs.floatingCartBtn.classList.remove("add-bounce"), 360);
  closeSheet();
  renderCart();
  openCart();
}

function cartCount() { return state.cart.reduce((a, i) => a + i.qty, 0); }
function cartTotal() { return state.cart.reduce((a, i) => a + (i.qty * i.unit), 0); }

function renderCart() {
  const count = cartCount();
  refs.headerCartCount.textContent = count;
  refs.floatingCartCount.textContent = count;
  refs.headerCartCount.classList.add("bump");
  refs.floatingCartCount.classList.add("bump");
  setTimeout(() => { refs.headerCartCount.classList.remove("bump"); refs.floatingCartCount.classList.remove("bump"); }, 250);

  if (!state.cart.length) {
    refs.cartItems.innerHTML = `<p class="empty">Tu carrito está vacío.</p>`;
  } else {
    refs.cartItems.innerHTML = state.cart.map((it) => `
      <article class="cart-item" data-id="${it.id}">
        <h5>${it.qty}x ${it.name}</h5>
        <p>${it.details || "Sin personalización"}</p>
        <div class="row">
          <strong>${money(it.qty * it.unit)}</strong>
          <div class="qty">
            <button data-act="minus">−</button>
            <span>${it.qty}</span>
            <button data-act="plus">+</button>
            <button data-act="remove">🗑</button>
          </div>
        </div>
      </article>
    `).join("");
  }

  refs.subtotalValue.textContent = money(cartTotal());
  refs.totalValue.textContent = money(cartTotal());
}

function editCart(id, action) {
  const i = state.cart.findIndex((x) => x.id === id);
  if (i < 0) return;
  if (action === "remove") state.cart.splice(i, 1);
  if (action === "plus") state.cart[i].qty += 1;
  if (action === "minus") {
    state.cart[i].qty -= 1;
    if (state.cart[i].qty <= 0) state.cart.splice(i, 1);
  }
  renderCart();
}

function buildMessage() {
  const name = refs.customerName.value.trim();
  const notes = refs.orderNotes.value.trim();
  const orderType = document.querySelector('input[name="orderType"]:checked')?.value || "Recoger";
  const address = refs.deliveryAddress.value.trim();

  const lines = ["Hola, quiero hacer un pedido en La Queka Feliz:", ""];
  if (name) lines.push(`Cliente: ${name}`, "");
  lines.push("PEDIDO", "");

  state.cart.forEach((it) => {
    lines.push(`${it.qty} ${it.name}`);
    if (it.details) lines.push(it.details);
    lines.push("");
  });

  lines.push(`Tipo de pedido: ${orderType}`);
  if (orderType === "Entrega" && address) lines.push(`Dirección: ${address}`);
  lines.push(`TOTAL: ${money(cartTotal())}`);
  if (notes) lines.push(`Notas: ${notes}`);
  lines.push("", "Gracias.");
  return lines.join("\n");
}


function showInstallHint(message) {
  const old = document.querySelector(".install-hint");
  if (old) old.remove();
  const hint = document.createElement("div");
  hint.className = "install-hint";
  hint.textContent = message;
  document.body.appendChild(hint);
  setTimeout(() => hint.remove(), 3200);
}

async function handleInstallClick() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    return;
  }
  showInstallHint("Para instalar: abre el menú del navegador y selecciona 'Agregar a pantalla de inicio'.");
}

function sendWhatsApp() {
  if (!state.cart.length) return alert("Tu carrito está vacío.");
  const orderType = document.querySelector('input[name="orderType"]:checked')?.value;
  if (orderType === "Entrega" && !refs.deliveryAddress.value.trim()) {
    return alert("Agrega la dirección para entrega.");
  }
  window.open(`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(buildMessage())}`, "_blank");
}

function bind() {
  refs.categoryBar.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-cat]");
    if (!btn) return;
    state.activeCat = btn.dataset.cat;
    renderCategories();
    renderMenu();
  });

  refs.searchToggleBtn.addEventListener("click", () => {
    refs.searchWrap.hidden = !refs.searchWrap.hidden;
    if (!refs.searchWrap.hidden) refs.searchInput.focus();
  });

  refs.downloadAppBtn.addEventListener("click", handleInstallClick);

  refs.searchInput.addEventListener("input", () => {
    state.query = refs.searchInput.value.trim();
    renderMenu();
  });

  refs.menuList.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-item]");
    if (!btn) return;
    const item = getItemsFlat().find((x) => x.id === btn.dataset.item);
    if (item) openSheet(item);
  });

  refs.sheetContent.addEventListener("click", (e) => {
    const chip = e.target.closest("button[data-chip]");
    const step = e.target.closest("button[data-step]");

    if (chip) {
      const group = chip.closest("[data-chip-group]").dataset.chipGroup;
      chip.closest("[data-chip-group]").querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      state.selection.values[group] = chip.dataset.chip;
      updateLivePrice();
      return;
    }

    if (step) {
      state.selection.qty = Math.max(1, state.selection.qty + (step.dataset.step === "plus" ? 1 : -1));
      const qtyVal = $("#qtyVal");
      if (qtyVal) qtyVal.textContent = state.selection.qty;
      updateLivePrice();
    }
  });

  refs.sheetContent.addEventListener("change", (e) => {
    const radio = e.target.closest("input[type='radio']");
    if (!radio) return;
    state.selection.values[radio.name] = radio.value;
    updateLivePrice();
  });

  refs.addToCartBtn.addEventListener("click", addToCart);

  refs.floatingCartBtn.addEventListener("click", openCart);
  refs.headerCartBtn.addEventListener("click", openCart);
  refs.closeCartBtn.addEventListener("click", closeCart);
  refs.closeSheetBtn.addEventListener("click", closeSheet);

  refs.cartItems.addEventListener("click", (e) => {
    const itemNode = e.target.closest(".cart-item");
    const btn = e.target.closest("button[data-act]");
    if (!itemNode || !btn) return;
    editCart(itemNode.dataset.id, btn.dataset.act);
  });

  refs.clearCartBtn.addEventListener("click", () => { state.cart = []; renderCart(); });
  refs.whatsAppBtn.addEventListener("click", sendWhatsApp);

  document.querySelectorAll('input[name="orderType"]').forEach((r) => {
    r.addEventListener("change", () => {
      refs.addressGroup.hidden = r.value !== "Entrega" || !r.checked;
    });
  });

  refs.backdrop.addEventListener("click", () => { closeSheet(); closeCart(); });
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
});

function init() {
  renderCategories();
  renderMenu();
  renderCart();
  bind();
}

init();
