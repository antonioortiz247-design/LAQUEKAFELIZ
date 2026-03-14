const WHATSAPP_PHONE = "525565272072";

const catalog = [
  {
    category: "Quekas",
    items: [
      {
        id: "queka-base",
        name: "Queka clásica",
        description: "Arma tu queka con guisado y estilo de cocción.",
        type: "queka",
      },
    ],
  },
  {
    category: "Especiales",
    items: [
      { id: "esp-hawaiana", name: "Queka especial hawaiana", type: "special", specialType: "regular" },
      { id: "esp-rajas", name: "Queka especial rajas con queso", type: "special", specialType: "regular" },
      { id: "esp-sesos", name: "Queka especial sesos", type: "special", specialType: "regular" },
      { id: "esp-suadero", name: "Queka especial suadero", type: "special", specialType: "suadero" },
    ],
  },
  {
    category: "Pambazos / Gorditas / Sopes",
    items: [{ id: "pgs", name: "Pambazo / Gordita / Sope", type: "pgs", description: "Se sirven con lechuga, crema y queso." }],
  },
  {
    category: "Tostadas",
    items: [{ id: "tostadas", name: "Tostadas", type: "tostadas" }],
  },
  {
    category: "Suadero",
    items: [{ id: "suadero-gs", name: "Suadero en gordita o sope", type: "suadero" }],
  },
  {
    category: "Panucho",
    items: [{ id: "panucho", name: "Panucho de cochinita", type: "fixed", price: 36 }],
  },
  {
    category: "Refrescos",
    items: [
      { id: "refresco", name: "Refrescos", type: "drink", price: 28, options: ["Coca Cola", "Fanta", "Freska", "Sprite", "Sidral", "Mundet Rojo"] },
      { id: "boing", name: "Boing", type: "drink", price: 28, options: ["Mango", "Guayaba"] },
    ],
  },
  {
    category: "Café",
    items: [{ id: "cafe-olla", name: "Café de olla (taza grande)", type: "fixed", price: 36 }],
  },
  {
    category: "Postres",
    items: [
      { id: "gelatina", name: "Gelatina tres leches con piña", type: "fixed", price: 35 },
      { id: "arroz", name: "Arroz con leche", type: "fixed", price: 30 },
      { id: "flan", name: "Flan de vainilla", type: "fixed", price: 30 },
      { id: "pay", name: "Pay de limón", type: "fixed", price: 35 },
    ],
  },
  {
    category: "Aguas",
    items: [{ id: "aguas", name: "Aguas naturales", type: "agua" }],
  },
  {
    category: "Pozole",
    items: [{ id: "pozole", name: "Pozole tradicional estilo Jalisco", type: "fixed", price: 105, tag: "Disponible solo viernes y sábado" }],
  },
];

const optionsData = {
  quekaStyles: [
    { label: "Frita", price: 26 },
    { label: "Frita con queso", price: 30 },
    { label: "Al comal", price: 30 },
    { label: "Al comal con queso", price: 36 },
  ],
  fillings: [
    "Tinga de pollo",
    "Tinga de res",
    "Picadillo de res",
    "Huitlacoche",
    "Requesón",
    "Hongos",
    "Queso",
    "Papa",
    "Pancita",
    "Chicharrón",
    "Rajas con papas",
    "Flor de calabaza",
    "Cochinita",
  ],
  specialRegular: [
    { label: "Frita", price: 30 },
    { label: "Comal", price: 36 },
  ],
  specialSuadero: [
    { label: "Frita", price: 35 },
    { label: "Comal", price: 38 },
    { label: "Con queso", price: 45 },
  ],
  pgsTypes: ["Pambazo", "Gordita", "Sope"],
  pgsStyles: [
    { label: "Sencillo", price: 36 },
    { label: "Con quesillo", price: 40 },
    { label: "Con guisado", price: 46 },
  ],
  tostadaStyles: [
    { label: "Sencillas", price: 35 },
    { label: "Combinadas", price: 40 },
  ],
  tostadaFillings: ["Pata", "Tinga de res", "Tinga de pollo", "Picadillo", "Cochinita"],
  suaderoStyles: [
    { label: "Sencillo", price: 48 },
    { label: "Con queso", price: 56 },
  ],
  aguaSizes: [
    { label: "1/2 litro", price: 36 },
    { label: "1 litro", price: 65 },
    { label: "Jarra 2 litros", price: 120 },
  ],
};

const state = {
  activeCategory: catalog[0].category,
  cart: [],
  currentProduct: null,
  modalData: { qty: 1, choices: {} },
};

const refs = {
  categoryTabs: document.getElementById("categoryTabs"),
  menuGrid: document.getElementById("menuGrid"),
  floatingCartBtn: document.getElementById("floatingCartBtn"),
  openCartHeader: document.getElementById("openCartHeader"),
  headerCartCount: document.getElementById("headerCartCount"),
  floatingCartCount: document.getElementById("floatingCartCount"),
  cartDrawer: document.getElementById("cartDrawer"),
  closeCartBtn: document.getElementById("closeCartBtn"),
  cartItems: document.getElementById("cartItems"),
  cartTotal: document.getElementById("cartTotal"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  clearCartBtn: document.getElementById("clearCartBtn"),
  overlay: document.getElementById("overlay"),
  customizationModal: document.getElementById("customizationModal"),
  modalTitle: document.getElementById("modalTitle"),
  modalBody: document.getElementById("modalBody"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  addToCartBtn: document.getElementById("addToCartBtn"),
  customerName: document.getElementById("customerName"),
  orderNotes: document.getElementById("orderNotes"),
  prepTime: document.getElementById("prepTime"),
};

function formatPrice(value) {
  return `$${value}`;
}

function renderCategories() {
  refs.categoryTabs.innerHTML = catalog
    .map(
      ({ category }) =>
        `<button class="category-tab ${state.activeCategory === category ? "active" : ""}" data-category="${category}">${category}</button>`
    )
    .join("");
}

function getBasePrice(item) {
  if (item.price) return item.price;
  if (item.type === "queka") return 26;
  if (item.type === "special") return item.specialType === "suadero" ? 35 : 30;
  if (item.type === "pgs") return 36;
  if (item.type === "tostadas") return 35;
  if (item.type === "suadero") return 48;
  if (item.type === "agua") return 36;
  return 0;
}

function renderMenu() {
  const active = catalog.find((group) => group.category === state.activeCategory);
  refs.menuGrid.innerHTML = active.items
    .map((item) => {
      const desc = item.description ? `<p class="product-desc">${item.description}</p>` : "";
      const tag = item.tag ? `<span class="tag">${item.tag}</span>` : "";
      return `
        <article class="product-card">
          <div class="product-head">
            <h3 class="product-name">${item.name}</h3>
            <span class="price-chip">Desde ${formatPrice(getBasePrice(item))}</span>
          </div>
          ${desc}
          ${tag}
          <button class="btn primary" data-item-id="${item.id}">Personalizar</button>
        </article>
      `;
    })
    .join("");
}

function openOverlay() {
  refs.overlay.hidden = false;
}

function closeOverlayIfNeeded() {
  const open = refs.cartDrawer.classList.contains("open") || refs.customizationModal.classList.contains("open");
  refs.overlay.hidden = !open;
}

function openCart() {
  refs.cartDrawer.classList.add("open");
  refs.cartDrawer.setAttribute("aria-hidden", "false");
  openOverlay();
}

function closeCart() {
  refs.cartDrawer.classList.remove("open");
  refs.cartDrawer.setAttribute("aria-hidden", "true");
  closeOverlayIfNeeded();
}

function openModal(item) {
  state.currentProduct = item;
  state.modalData = { qty: 1, choices: {} };
  refs.modalTitle.textContent = item.name;
  refs.modalBody.innerHTML = buildModalContent(item);
  refs.customizationModal.classList.add("open");
  refs.customizationModal.setAttribute("aria-hidden", "false");
  refs.addToCartBtn.disabled = !isModalValid(item.type);
  openOverlay();
}

function closeModal() {
  refs.customizationModal.classList.remove("open");
  refs.customizationModal.setAttribute("aria-hidden", "true");
  state.currentProduct = null;
  closeOverlayIfNeeded();
}

function createRadioOptions(name, options, withPrice = true) {
  return `<div class="option-list">${options
    .map((opt, index) => {
      const label = typeof opt === "string" ? opt : opt.label;
      const price = typeof opt === "string" ? "" : withPrice ? `<strong>${formatPrice(opt.price)}</strong>` : "";
      return `<label class="option"><span><input type="radio" name="${name}" value="${label}" ${index === 0 ? "" : ""}/> ${label}</span>${price}</label>`;
    })
    .join("")}</div>`;
}

function buildModalContent(item) {
  const qtyPicker = `
    <div class="option-group">
      <h3>Paso 3 — Cantidad</h3>
      <div class="quantity-picker" data-qty-picker>
        <button type="button" data-qty="minus">−</button>
        <span id="modalQty">1</span>
        <button type="button" data-qty="plus">+</button>
      </div>
    </div>
  `;

  if (item.type === "queka") {
    return `
      <div class="option-group"><h3>Paso 1 — Selecciona cocción</h3>${createRadioOptions("style", optionsData.quekaStyles)}</div>
      <div class="option-group"><h3>Paso 2 — Selecciona guisado</h3>${createRadioOptions("filling", optionsData.fillings, false)}</div>
      ${qtyPicker}
    `;
  }

  if (item.type === "special") {
    const set = item.specialType === "suadero" ? optionsData.specialSuadero : optionsData.specialRegular;
    return `
      <div class="option-group"><h3>Paso 1 — Elige estilo</h3>${createRadioOptions("style", set)}</div>
      ${qtyPicker}
    `;
  }

  if (item.type === "pgs") {
    return `
      <div class="option-group"><h3>Paso 1 — Tipo</h3>${createRadioOptions("type", optionsData.pgsTypes, false)}</div>
      <div class="option-group"><h3>Paso 2 — Estilo</h3>${createRadioOptions("style", optionsData.pgsStyles)}</div>
      <p class="product-desc">Se sirven con lechuga, crema y queso.</p>
      ${qtyPicker}
    `;
  }

  if (item.type === "tostadas") {
    return `
      <div class="option-group"><h3>Paso 1 — Opción</h3>${createRadioOptions("style", optionsData.tostadaStyles)}</div>
      <div class="option-group"><h3>Paso 2 — Guisado</h3>${createRadioOptions("filling", optionsData.tostadaFillings, false)}</div>
      ${qtyPicker}
    `;
  }

  if (item.type === "suadero") {
    return `<div class="option-group"><h3>Elige estilo</h3>${createRadioOptions("style", optionsData.suaderoStyles)}</div>${qtyPicker}`;
  }

  if (item.type === "drink") {
    return `<div class="option-group"><h3>Sabor</h3>${createRadioOptions("flavor", item.options, false)}</div>${qtyPicker}`;
  }

  if (item.type === "agua") {
    return `<div class="option-group"><h3>Selecciona tamaño</h3>${createRadioOptions("size", optionsData.aguaSizes)}</div>${qtyPicker}`;
  }

  return qtyPicker;
}

function isModalValid(type) {
  const c = state.modalData.choices;
  if (["fixed"].includes(type)) return true;
  if (type === "queka") return !!(c.style && c.filling);
  if (["special", "suadero", "agua"].includes(type)) return !!c.style || !!c.size;
  if (type === "pgs") return !!(c.type && c.style);
  if (type === "tostadas") return !!(c.style && c.filling);
  if (type === "drink") return !!c.flavor;
  return true;
}

function getSelectedPrice(item, choices) {
  const getOptionPrice = (set, label) => set.find((o) => o.label === label)?.price || 0;
  switch (item.type) {
    case "queka":
      return getOptionPrice(optionsData.quekaStyles, choices.style);
    case "special":
      return getOptionPrice(item.specialType === "suadero" ? optionsData.specialSuadero : optionsData.specialRegular, choices.style);
    case "pgs":
      return getOptionPrice(optionsData.pgsStyles, choices.style);
    case "tostadas":
      return getOptionPrice(optionsData.tostadaStyles, choices.style);
    case "suadero":
      return getOptionPrice(optionsData.suaderoStyles, choices.style);
    case "drink":
      return item.price;
    case "agua":
      return getOptionPrice(optionsData.aguaSizes, choices.size);
    default:
      return item.price || 0;
  }
}

function buildItemSummary(item, choices) {
  const parts = [];
  if (choices.type) parts.push(choices.type);
  if (choices.style) parts.push(choices.style);
  if (choices.filling) parts.push(`Guisado: ${choices.filling}`);
  if (choices.flavor) parts.push(`Sabor: ${choices.flavor}`);
  if (choices.size) parts.push(choices.size);
  return parts.join(" · ");
}

function addCurrentToCart() {
  if (!state.currentProduct) return;
  const item = state.currentProduct;
  const choices = state.modalData.choices;
  const unitPrice = getSelectedPrice(item, choices);
  const entry = {
    id: `${item.id}-${Date.now()}`,
    name: item.name,
    qty: state.modalData.qty,
    unitPrice,
    summary: buildItemSummary(item, choices),
  };
  state.cart.push(entry);
  closeModal();
  renderCart();
  openCart();
}

function cartCount() {
  return state.cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartTotal() {
  return state.cart.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
}

function updatePrepTime() {
  const minutes = state.cart.length === 0 ? 0 : Math.min(15 + state.cart.length * 6, 55);
  refs.prepTime.textContent = `Tiempo estimado: ${minutes} min`;
}

function renderCart() {
  const count = cartCount();
  refs.headerCartCount.textContent = count;
  refs.floatingCartCount.textContent = count;
  refs.cartTotal.textContent = formatPrice(cartTotal());

  if (!state.cart.length) {
    refs.cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío. Agrega algo delicioso 🌮</p>';
  } else {
    refs.cartItems.innerHTML = state.cart
      .map(
        (item) => `
      <article class="cart-item" data-id="${item.id}">
        <h4>${item.qty}x ${item.name}</h4>
        <p>${item.summary || "Sin personalización"}</p>
        <div class="qty-row">
          <strong>${formatPrice(item.unitPrice * item.qty)}</strong>
          <div class="qty-controls">
            <button data-action="minus">−</button>
            <span>${item.qty}</span>
            <button data-action="plus">+</button>
            <button class="remove-btn" data-action="remove">Eliminar</button>
          </div>
        </div>
      </article>
    `
      )
      .join("");
  }

  updatePrepTime();
}

function updateCartItem(itemId, action) {
  const idx = state.cart.findIndex((item) => item.id === itemId);
  if (idx === -1) return;
  if (action === "remove") {
    state.cart.splice(idx, 1);
  } else if (action === "plus") {
    state.cart[idx].qty += 1;
  } else if (action === "minus") {
    state.cart[idx].qty -= 1;
    if (state.cart[idx].qty <= 0) state.cart.splice(idx, 1);
  }
  renderCart();
}

function buildWhatsAppMessage() {
  const name = refs.customerName.value.trim();
  const notes = refs.orderNotes.value.trim();
  const orderType = document.querySelector('input[name="orderType"]:checked')?.value || "Recoger";

  const lines = ["Hola, quiero hacer un pedido en La Queka Feliz:", "", "PEDIDO", ""];
  state.cart.forEach((item) => {
    lines.push(`${item.qty} ${item.name}`);
    if (item.summary) lines.push(item.summary);
    lines.push("");
  });

  if (name) lines.push(`Cliente: ${name}`);
  lines.push(`Tipo de pedido: ${orderType}`);
  if (notes) lines.push(`Notas: ${notes}`);
  lines.push(`TOTAL: ${formatPrice(cartTotal())}`);
  lines.push("Gracias.");

  return lines.join("\n");
}

function checkoutWhatsApp() {
  if (!state.cart.length) {
    alert("Tu carrito está vacío.");
    return;
  }
  const text = encodeURIComponent(buildWhatsAppMessage());
  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  window.open(url, "_blank");
}

function handleModalInteraction(event) {
  const item = state.currentProduct;
  if (!item) return;

  const qtyButton = event.target.closest("button[data-qty]");
  if (qtyButton) {
    const action = qtyButton.dataset.qty;
    if (action === "plus") state.modalData.qty += 1;
    if (action === "minus") state.modalData.qty = Math.max(1, state.modalData.qty - 1);
    const qtyNode = document.getElementById("modalQty");
    if (qtyNode) qtyNode.textContent = state.modalData.qty;
    return;
  }

  const input = event.target.closest("input[type='radio']");
  if (input) {
    state.modalData.choices[input.name] = input.value;
    refs.addToCartBtn.disabled = !isModalValid(item.type);
  }
}

function bindEvents() {
  refs.categoryTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    state.activeCategory = button.dataset.category;
    renderCategories();
    renderMenu();
  });

  refs.menuGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-item-id]");
    if (!button) return;
    const item = catalog.flatMap((group) => group.items).find((entry) => entry.id === button.dataset.itemId);
    if (item) openModal(item);
  });

  refs.customizationModal.addEventListener("click", handleModalInteraction);
  refs.addToCartBtn.addEventListener("click", addCurrentToCart);

  refs.floatingCartBtn.addEventListener("click", openCart);
  refs.openCartHeader.addEventListener("click", openCart);
  refs.closeCartBtn.addEventListener("click", closeCart);
  refs.closeModalBtn.addEventListener("click", closeModal);

  refs.overlay.addEventListener("click", () => {
    closeCart();
    closeModal();
  });

  refs.cartItems.addEventListener("click", (event) => {
    const itemNode = event.target.closest(".cart-item");
    const actionBtn = event.target.closest("button[data-action]");
    if (!itemNode || !actionBtn) return;
    updateCartItem(itemNode.dataset.id, actionBtn.dataset.action);
  });

  refs.clearCartBtn.addEventListener("click", () => {
    state.cart = [];
    renderCart();
  });

  refs.checkoutBtn.addEventListener("click", checkoutWhatsApp);
}

function init() {
  renderCategories();
  renderMenu();
  renderCart();
  bindEvents();
}

init();
