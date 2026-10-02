document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  let items = [];
  if (grid.dataset.category) {
    items = getByCategory(grid.dataset.category);
  } else if (grid.dataset.filter === "bestseller") {
    items = getBestSellers();
  } else if (grid.dataset.filter === "new") {
    items = getNewArrivals();
  }

  renderProductGrid(grid, items);

  const countEl = document.getElementById("resultsCount");
  if (countEl) {
    countEl.textContent = `${items.length} product${items.length === 1 ? "" : "s"}`;
  }
});

function renderProductGrid(grid, items) {
  if (!items.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <h3>No products here yet</h3>
        <p>Check back soon — we're adding new pieces to this collection.</p>
      </div>`;
    return;
  }

  grid.innerHTML = items.map(productCardHTML).join("");
}

function productCardHTML(p) {
  const badge =
    p.badges && p.badges.includes("bestseller")
      ? `<span class="product-badge">Best Seller</span>`
      : p.badges && p.badges.includes("new")
        ? `<span class="product-badge">New</span>`
        : "";

  return `
    <article class="product-card">
      <div class="product-card-image">
        <img src="${p.image}" alt="${p.alt}" loading="lazy">
        ${badge}
        <button class="wishlist-btn" data-id="${p.id}" aria-label="Add ${p.name} to wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7.5-4.6-10-9.2C.4 8.4 2 4.8 5.6 4.1c2-.4 4 .5 5 2.2 1-1.7 3-2.6 5-2.2 3.6.7 5.2 4.3 3.6 7.7-2.5 4.6-10 9.2-10 9.2z"/></svg>
        </button>
      </div>
      <div class="product-card-body">
        <h3>${p.name}</h3>
        <div class="product-rating">
          <span class="stars">${starString(p.rating)}</span>
          <span>(${p.reviews})</span>
        </div>
        <div class="product-price">$${p.price.toFixed(2)}</div>
        <button class="add-to-cart-btn" data-id="${p.id}">Add to Cart</button>
      </div>
    </article>`;
}

function starString(rating) {
  const full = Math.round(rating);
  return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
}
