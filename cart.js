const CART_KEY = "peavelle_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId, qty = 1) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      alt: product.alt,
      qty: qty,
    });
  }
  saveCart(cart);
  renderAllCartUI();
  openCartDrawer();
}

function increaseQty(productId) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (item) item.qty += 1;
  saveCart(cart);
  renderAllCartUI();
}

function decreaseQty(productId) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (item) {
    item.qty -= 1;
    if (item.qty <= 0) {
      return removeFromCart(productId);
    }
  }
  saveCart(cart);
  renderAllCartUI();
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((i) => i.id !== productId);
  saveCart(cart);
  renderAllCartUI();
}

function cartTotals() {
  const cart = getCart();
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
  return { count, subtotal };
}

function renderAllCartUI() {
  updateCartCount();
  renderCartInto("cartItems", "cartDrawer");
  if (document.getElementById("cartPageItems")) {
    renderCartInto("cartPageItems", "cartPage");
  }
}

function updateCartCount() {
  const { count } = cartTotals();
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = count;
  });
}

function renderCartInto(containerId, mode) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const cart = getCart();
  const { subtotal } = cartTotals();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 3h2l2.4 12.4a2 2 0 002 1.6h8.4a2 2 0 002-1.6L21 8H6"/><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/></svg>
        <h3>Your bag is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
        <a href="index.html" class="btn btn-primary">Continue Shopping</a>
      </div>`;
  } else {
    container.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.alt}">
        <div class="cart-item-info">
          <button class="remove-item-btn" data-remove="${item.id}">Remove</button>
          <h4>${item.name}</h4>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="qty-control">
            <button data-decrease="${item.id}" aria-label="Decrease quantity">&minus;</button>
            <span>${item.qty}</span>
            <button data-increase="${item.id}" aria-label="Increase quantity">&plus;</button>
          </div>
        </div>
      </div>
    `,
      )
      .join("");
  }

  if (mode === "cartDrawer") {
    const subtotalEl = document.getElementById("cartSubtotal");
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    const footer = document.getElementById("cartDrawerFooter");
    if (footer) footer.style.display = cart.length === 0 ? "none" : "block";
  }
  if (mode === "cartPage") {
    const subtotalEl = document.getElementById("cartPageSubtotal");
    const totalEl = document.getElementById("cartPageTotal");
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
    const summary = document.getElementById("cartSummaryBox");
    if (summary) summary.style.display = cart.length === 0 ? "none" : "block";
  }
}

function openCartDrawer() {
  document.getElementById("cartDrawer")?.classList.add("open");
  document.getElementById("cartOverlay")?.classList.add("open");
}
function closeCartDrawer() {
  document.getElementById("cartDrawer")?.classList.remove("open");
  document.getElementById("cartOverlay")?.classList.remove("open");
}

document.addEventListener("DOMContentLoaded", () => {
  renderAllCartUI();

  document
    .getElementById("cartToggle")
    ?.addEventListener("click", openCartDrawer);
  document
    .getElementById("cartClose")
    ?.addEventListener("click", closeCartDrawer);
  document
    .getElementById("cartOverlay")
    ?.addEventListener("click", closeCartDrawer);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCartDrawer();
  });

  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".add-to-cart-btn");
    if (addBtn) {
      addToCart(addBtn.dataset.id);
      addBtn.classList.add("added");
      const original = addBtn.textContent;
      addBtn.textContent = "Added ✓";
      setTimeout(() => {
        addBtn.textContent = original;
        addBtn.classList.remove("added");
      }, 1200);
      return;
    }
    const incBtn = e.target.closest("[data-increase]");
    if (incBtn) return increaseQty(incBtn.dataset.increase);

    const decBtn = e.target.closest("[data-decrease]");
    if (decBtn) return decreaseQty(decBtn.dataset.decrease);

    const remBtn = e.target.closest("[data-remove]");
    if (remBtn) return removeFromCart(remBtn.dataset.remove);
  });
});
