const API = "http://localhost:3000";

// --- State Management ---
const State = {
  getRole: () => localStorage.getItem("supplyChainRole") || "Manufacturer",
  setRole: (role) => {
    localStorage.setItem("supplyChainRole", role);
    updateRoleUI();
  },
};

// --- UI Updates ---
function updateRoleUI() {
  const role = State.getRole();
  
  // Update nav badge
  const navBadge = document.querySelector(".nav-container .role-badge");
  if (navBadge) navBadge.textContent = role;

  // Update hero/page badges
  const pageBadges = document.querySelectorAll(".current-actor");
  pageBadges.forEach(el => el.textContent = role);

  // Update Role Selector on Dashboard
  const roleOptions = document.querySelectorAll(".role-option");
  roleOptions.forEach(opt => {
    if (opt.dataset.role === role) {
      opt.classList.add("selected");
    } else {
      opt.classList.remove("selected");
    }
  });

  // Update Role Info Alert on Dashboard
  const dashboardBadge = document.querySelector(".alert-info .role-badge");
  if (dashboardBadge) dashboardBadge.textContent = role;
}

// --- Page Initializers ---

function initDashboard() {
  loadProducts();

  // Role Selection Logic
  const roleOptions = document.querySelectorAll(".role-option");
  roleOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const role = option.dataset.role;
      State.setRole(role);
    });
  });

  // Search Filter
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      const products = document.querySelectorAll(".product-card");
      products.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(term) ? "block" : "none";
      });
    });
  }
}

function initRegister() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  // Force Manufacturer role display
  State.setRole("Manufacturer"); 

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const resultDiv = document.getElementById("registrationResult");
    resultDiv.classList.add("hidden");

    const name = document.getElementById("productName").value.trim();
    const manufacturer = document.getElementById("manufacturer").value.trim();
    const type = document.getElementById("productType").value;
    const description = document.getElementById("description").value.trim();

    if (!name || !manufacturer) {
      showError(resultDiv, "Please enter product name and manufacturer.");
      return;
    }

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          manufacturer, 
          role: "Manufacturer",
          // Extra fields can be stored if backend schema supports them, 
          // currently backend only saves name/manufacturer/status/history.
          // We can add them to name or extend backend later.
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Registration failed");

      showSuccess(resultDiv, `
        <strong>Success!</strong> Product Registered.<br>
        ID: <code>${data._id}</code><br>
        <small>Save this ID for updates.</small>
      `);
      form.reset();
    } catch (err) {
      showError(resultDiv, err.message);
    }
  });
}

function initUpdate() {
  const form = document.getElementById("updateForm");
  if (!form) return;

  // Update form UI based on current role
  updateRoleUI();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const resultDiv = document.getElementById("updateResult");
    resultDiv.classList.add("hidden");

    const id = document.getElementById("updateProductId").value.trim();
    const nextStatus = document.getElementById("nextStatus").value;
    const location = document.getElementById("location").value.trim();
    const role = State.getRole();
    
    // Use role as actor name for simplicity, or add an "Actor Name" input
    const actor = `${role} (${location || 'Main HQ'})`; 

    if (!id || !nextStatus) {
      showError(resultDiv, "Product ID and Next Status are required.");
      return;
    }

    try {
      const res = await fetch(`${API}/update-status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nextStatus, actor, role }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Update failed");

      showSuccess(resultDiv, `
        <strong>Success!</strong> Status updated to "${nextStatus}".<br>
        New Hash: <code>${data.product.history[data.product.history.length - 1].hash.substring(0, 20)}...</code>
      `);
      form.reset();
    } catch (err) {
      showError(resultDiv, err.message);
    }
  });
}

function initVerify() {
  const form = document.getElementById("verifyForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const resultDiv = document.getElementById("verificationResult");
    resultDiv.classList.add("hidden");

    const id = document.getElementById("verifyProductId").value.trim();

    if (!id) {
      showError(resultDiv, "Please enter a Product ID.");
      return;
    }

    try {
      const res = await fetch(`${API}/verify/${id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Verification failed");

      resultDiv.classList.remove("hidden");
      resultDiv.className = data.isValid 
        ? "verification-result verification-valid" 
        : "verification-result verification-invalid";
      
      resultDiv.innerHTML = `
        <div class="verification-icon">${data.isValid ? "✅" : "❌"}</div>
        <h3 class="verification-title">${data.isValid ? "Chain Secure" : "Chain Broken"}</h3>
        <p>${data.message}</p>
        <div class="mt-1">
          <strong>Product:</strong> ${data.name}<br>
          <strong>History Depth:</strong> ${data.historyCount} blocks
        </div>
      `;
    } catch (err) {
      showError(resultDiv, err.message);
    }
  });
}

// --- Shared Helpers ---

async function loadProducts() {
  const container = document.getElementById("productList");
  if (!container) return;

  container.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

  try {
    const res = await fetch(`${API}/products`);
    const products = await res.json();

    container.innerHTML = "";

    if (!products.length) {
      container.innerHTML = '<p class="text-center">No products found on the blockchain.</p>';
      return;
    }

    products.forEach((p) => {
      const card = document.createElement("div");
      card.className = "product-card";
      
      const statusClass = getStatusClass(p.status);
      
      card.innerHTML = `
        <div class="product-header">
          <div class="product-name">${p.name}</div>
          <span class="status-badge ${statusClass}">${p.status}</span>
        </div>
        <div class="product-id" title="Click to copy" onclick="navigator.clipboard.writeText('${p._id}'); alert('ID Copied!')">ID: ${p._id} <i class="far fa-copy"></i></div>
        <div class="product-details">
          <div class="detail-row">
            <span class="detail-label">Manufacturer</span>
            <span class="detail-value">${p.manufacturer}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Latest Hash</span>
            <span class="detail-value text-mono-sm">
              ${p.history[p.history.length - 1].hash.substring(0, 16)}...
            </span>
          </div>
        </div>
        <div class="card-actions">
          <a href="update.html?id=${p._id}" class="btn btn-secondary btn-flex">Update</a>
          <a href="verify.html?id=${p._id}" class="btn btn-success btn-flex">Verify</a>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = `<div class="alert alert-error">Failed to load products: ${err.message}</div>`;
  }
}

function getStatusClass(status) {
  switch (status) {
    case "Manufactured": return "status-manufactured";
    case "In Distribution": return "status-distribution";
    case "For Sale": return "status-for-sale";
    case "Sold": return "status-sold";
    default: return "";
  }
}

function showError(element, message) {
  element.classList.remove("hidden");
  element.innerHTML = `<div class="alert alert-error">${message}</div>`;
}

function showSuccess(element, message) {
  element.classList.remove("hidden");
  element.innerHTML = `<div class="alert alert-success">${message}</div>`;
}

// --- Initialization ---

document.addEventListener("DOMContentLoaded", () => {
  updateRoleUI();

  const path = window.location.pathname;
  
  if (path.includes("index.html") || path === "/") {
    initDashboard();
  } else if (path.includes("register.html")) {
    initRegister();
  } else if (path.includes("update.html")) {
    initUpdate();
    // Check URL params for ID
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id && document.getElementById("updateProductId")) {
      document.getElementById("updateProductId").value = id;
    }
  } else if (path.includes("verify.html")) {
    initVerify();
    // Check URL params for ID
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id && document.getElementById("verifyProductId")) {
      document.getElementById("verifyProductId").value = id;
    }
  }
});
