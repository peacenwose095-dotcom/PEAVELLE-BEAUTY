document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initSearch();
  initWishlistButtons();
  initNewsletterForm();
  markActiveNavLink();
});

function initMobileNav() {
  const toggle = document.getElementById("mobileMenuToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    nav.classList.toggle("mobile-open");
  });
}

function markActiveNavLink() {
  const links = document.querySelectorAll(".main-nav a");
  const current = window.location.pathname.split("/").pop() || "index.html";
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current) link.classList.add("active");
  });
}

function initSearch() {
  const searchToggle = document.getElementById("searchToggle");
  const overlay = document.getElementById("searchOverlay");
  const closeBtn = document.getElementById("searchClose");
  const input = document.getElementById("searchInput");
  const resultsBox = document.getElementById("searchResults");
  if (!searchToggle || !overlay) return;

  const openSearch = () => {
    overlay.classList.add("open");
    setTimeout(() => input.focus(), 50);
    renderSearchResults("", resultsBox);
  };
  const closeSearch = () => {
    overlay.classList.remove("open");
    input.value = "";
  };

  searchToggle.addEventListener("click", openSearch);
  closeBtn.addEventListener("click", closeSearch);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeSearch();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSearch();
  });
  input.addEventListener("input", () => {
    renderSearchResults(input.value.trim(), resultsBox);
  });
}

function renderSearchResults(query, box) {
  if (!box) return;

  if (!query) {
    box.innerHTML = `<p class="search-hint">Start typing to search skincare, makeup, lip &amp; fragrance...</p>`;
    return;
  }

  const q = query.toLowerCase();
  const matches = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
  );

  if (matches.length === 0) {
    box.innerHTML = `<p class="search-empty">No products found for "${escapeHtml(query)}". Try a different word.</p>`;
    return;
  }

  box.innerHTML = matches
    .map((p) => {
      const isBestSeller = p.badges && p.badges.includes("bestseller");
      const href = isBestSeller ? "best-sellers.html" : `${p.category}.html`;
      return `
    <a class="search-result" href="${href}">
      <img src="${p.image}" alt="${p.alt}">
      <div>
        <div class="search-result-name">${p.name}</div>
        <div class="search-result-cat">${categoryLabel(p.category)}</div>
      </div>
      <span class="search-result-price">$${p.price.toFixed(2)}</span>
    </a>
  `;
    })
    .join("");
}

function categoryLabel(slug) {
  const map = {
    skincare: "Skincare",
    makeup: "Makeup",
    "lip-collection": "Lip Collection",
    fragrance: "Fragrance",
  };
  return map[slug] || slug;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function getWishlist() {
  return JSON.parse(localStorage.getItem("peavelle_wishlist") || "[]");
}
function saveWishlist(list) {
  localStorage.setItem("peavelle_wishlist", JSON.stringify(list));
}
function initWishlistButtons() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".wishlist-btn");
    if (!btn) return;
    const id = btn.dataset.id;
    let list = getWishlist();
    if (list.includes(id)) {
      list = list.filter((x) => x !== id);
      btn.classList.remove("active");
    } else {
      list.push(id);
      btn.classList.add("active");
    }
    saveWishlist(list);
  });
  const list = getWishlist();
  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    if (list.includes(btn.dataset.id)) btn.classList.add("active");
  });
}

function initNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;
  const input = form.querySelector("input[type='email']");
  const msg = form.querySelector(".form-message");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = input.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValid) {
      msg.textContent = "Please enter a valid email address.";
      msg.className = "form-message error";
      return;
    }
    msg.textContent = "You're on the list! Welcome to the Beauty Club.";
    msg.className = "form-message success";
    form.reset();
  });
}
