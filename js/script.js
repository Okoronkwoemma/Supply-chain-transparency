// Configuration
const API_BASE_URL = "http://localhost:3000"; // Your backend URL

// State Management
let currentUser = {
  name: "Demo User",
  role: "Manufacturer", // Default role
};

// DOM Elements
let currentPage = "dashboard";

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  setupEventListeners();
  loadInitialData();
});

function initializeApp() {
  // Set current page based on URL or default
  const path = window.location.pathname.split("/").pop() || "index.html";
  currentPage = path.replace(".html", "").replace("index", "dashboard");

  // Update active navigation
  updateActiveNav();

  // Load user role from localStorage
  const savedRole = localStorage.getItem("supplyChainRole");
  if (savedRole) {
    currentUser.role = savedRole;
    updateRoleDisplay();
  }
}

function updateActiveNav() {
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(currentPage)) {
      link.classList.add("active");
    }
  });
}

function setupEventListeners() {
  // Role selection
  document.querySelectorAll(".role-option").forEach((option) => {
    option.addEventListener("click", function () {
      selectRole(this.dataset.role);
    });
  });

  // Register form submission
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  // Update status form
  const updateForm = document.getElementById("updateForm");
  if (updateForm) {
    updateForm.addEventListener("submit", handleUpdateStatus);
  }

  // Verify form
  const verifyForm = document.getElementById("verifyForm");
  if (verifyForm) {
    verifyForm.addEventListener("submit", handleVerify);
  }

  // Search functionality
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
  }
}

// Role Management
function selectRole(role) {
  currentUser.role = role;
  localStorage.setItem("supplyChainRole", role);
  updateRoleDisplay();
  showAlert(`Role changed to: ${role}`, "success");

  // Update any role-specific UI
  if (document.getElementById("productList")) {
    loadProducts();
  }
}

function updateRoleDisplay() {
  // Update role badges
  document.querySelectorAll(".role-badge").forEach((badge) => {
    badge.textContent = currentUser.role;
  });

  // Update role selector
  document.querySelectorAll(".role-option").forEach((option) => {
    option.classList.remove("selected");
    if (option.dataset.role === currentUser.role) {
      option.classList.add("selected");
    }
  });

  // Update form fields with current role
  document.querySelectorAll(".current-actor").forEach((field) => {
    if (field.tagName === "INPUT") {
      field.value = currentUser.role;
    } else {
      field.textContent = currentUser.role;
    }
  });
}

// Product Management
async function loadProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`); // You'll need to add this endpoint
    if (!response.ok) throw new Error("Failed to load products");

    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    showAlert("Error loading products: " + error.message, "error");
    // For demo, show mock data
    displayMockProducts();
  }
}

function displayProducts(products) {
  const container = document.getElementById("productList");
  if (!container) return;

  container.innerHTML = "";

  products.forEach((product) => {
    const card = createProductCard(product);
    container.appendChild(card);
  });
}

function createProductCard(product) {
  const div = document.createElement("div");
  div.className = "product-card";

  const statusClass = `status-${product.status
    .toLowerCase()
    .replace(" ", "-")}`;

  div.innerHTML = `
        <div class="product-header">
            <div>
                <div class="product-name">${product.name}</div>
                <div class="product-id">ID: ${product._id || product.id}</div>
            </div>
            <span class="status-badge ${statusClass}">${product.status}</span>
        </div>
        
        <div class="product-details">
            <div class="detail-row">
                <span class="detail-label">Manufacturer:</span>
                <span class="detail-value">${product.manufacturer}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Current Role:</span>
                <span class="detail-value">${currentUser.role}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">History Entries:</span>
                <span class="detail-value">${
                  product.history?.length || 0
                }</span>
            </div>
        </div>
        
        <div class="mt-2">
            <button onclick="viewProductDetails('${
              product._id || product.id
            }')" 
                    class="btn btn-primary" style="width: 100%;">
                View Details
            </button>
        </div>
    `;

  return div;
}

// Register Product
async function handleRegister(e) {
  e.preventDefault();

  const formData = {
    name: document.getElementById("productName").value,
    manufacturer: document.getElementById("manufacturer").value,
    role: currentUser.role,
  };

  try {
    showLoading(true);

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registration failed");
    }

    const product = await response.json();
    showAlert(`Product "${product.name}" registered successfully!`, "success");

    // Clear form
    e.target.reset();

    // Show success details
    showRegistrationSuccess(product);
  } catch (error) {
    showAlert(error.message, "error");
  } finally {
    showLoading(false);
  }
}

// Update Product Status
async function handleUpdateStatus(e) {
  e.preventDefault();

  const productId = document.getElementById("updateProductId").value;
  const nextStatus = document.getElementById("nextStatus").value;

  const formData = {
    nextStatus: nextStatus,
    actor: currentUser.role,
    role: currentUser.role,
  };

  try {
    showLoading(true);

    const response = await fetch(`${API_BASE_URL}/update-status/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Update failed");
    }

    const result = await response.json();
    showAlert(`Status updated to: ${nextStatus}`, "success");

    // Clear form
    document.getElementById("updateProductId").value = "";

    // Show transaction details
    showUpdateSuccess(result.product);
  } catch (error) {
    showAlert(error.message, "error");
  } finally {
    showLoading(false);
  }
}

// Verify Product
async function handleVerify(e) {
  e.preventDefault();

  const productId = document.getElementById("verifyProductId").value;

  try {
    showLoading(true);

    const response = await fetch(`${API_BASE_URL}/verify/${productId}`);

    if (!response.ok) {
      throw new Error("Verification failed");
    }

    const result = await response.json();
    showVerificationResult(result);
  } catch (error) {
    showAlert(error.message, "error");
    showVerificationResult({ isValid: false, message: "Verification failed" });
  } finally {
    showLoading(false);
  }
}

// Search Products
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    const productName = card
      .querySelector(".product-name")
      .textContent.toLowerCase();
    const productId = card
      .querySelector(".product-id")
      .textContent.toLowerCase();

    if (productName.includes(searchTerm) || productId.includes(searchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// UI Helpers
function showAlert(message, type = "info") {
  // Remove existing alerts
  document.querySelectorAll(".alert").forEach((alert) => alert.remove());

  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;

  // Insert at top of main content
  const mainContent = document.querySelector(".container");
  if (mainContent) {
    mainContent.insertBefore(alertDiv, mainContent.firstChild);
  }

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.parentNode.removeChild(alertDiv);
    }
  }, 5000);
}

function showLoading(show) {
  const buttons = document.querySelectorAll('button[type="submit"]');
  buttons.forEach((button) => {
    if (show) {
      button.disabled = true;
      button.innerHTML = "<span>Processing...</span>";
    } else {
      button.disabled = false;
      button.innerHTML =
        button.getAttribute("data-original-text") || button.textContent;
    }
  });
}

function showRegistrationSuccess(product) {
  const container = document.getElementById("registrationResult");
  if (!container) return;

  container.innerHTML = `
        <div class="alert alert-success">
            <h3>✅ Product Registered Successfully!</h3>
            <p><strong>Name:</strong> ${product.name}</p>
            <p><strong>ID:</strong> ${product._id || product.id}</p>
            <p><strong>Initial Status:</strong> ${product.status}</p>
            <p><strong>Initial Hash:</strong> ${
              product.history?.[0]?.hash || "N/A"
            }</p>
        </div>
    `;
  container.classList.remove("hidden");
}

function showUpdateSuccess(product) {
  const container = document.getElementById("updateResult");
  if (!container) return;

  const lastEntry = product.history[product.history.length - 1];

  container.innerHTML = `
        <div class="alert alert-success">
            <h3>✅ Status Updated Successfully!</h3>
            <p><strong>Product:</strong> ${product.name}</p>
            <p><strong>New Status:</strong> ${product.status}</p>
            <p><strong>Updated by:</strong> ${lastEntry?.actor || "Unknown"}</p>
            <p><strong>New Hash:</strong> ${lastEntry?.hash || "N/A"}</p>
            <p><strong>Previous Hash:</strong> ${
              lastEntry?.previousHash || "N/A"
            }</p>
        </div>
    `;
  container.classList.remove("hidden");
}

function showVerificationResult(result) {
  const container = document.getElementById("verificationResult");
  if (!container) return;

  const isValid = result.isValid;

  container.innerHTML = `
        <div class="verification-result ${
          isValid ? "verification-valid" : "verification-invalid"
        }">
            <div class="verification-icon">${isValid ? "✅" : "❌"}</div>
            <h2 class="verification-title">${
              isValid ? "Chain Valid" : "Chain Broken"
            }</h2>
            <p>${result.message}</p>
            <p><strong>Product:</strong> ${result.name || "Unknown"}</p>
            <p><strong>History Entries:</strong> ${result.historyCount || 0}</p>
            ${
              !isValid
                ? '<p class="mt-2"><strong>⚠️ Warning: Possible tampering detected!</strong></p>'
                : ""
            }
        </div>
    `;
  container.classList.remove("hidden");
}

function viewProductDetails(productId) {
  // For now, show an alert. You could implement a modal or redirect to details page
  showAlert(`Viewing details for product: ${productId}`, "info");

  // In a full implementation, you would:
  // 1. Fetch product details from API
  // 2. Display in a modal or new page
  // 3. Show full history timeline
}

// Mock data for demo (remove in production)
function displayMockProducts() {
  const mockProducts = [
    {
      id: "1",
      name: "Smartphone X",
      manufacturer: "TechCorp",
      status: "Manufactured",
      history: [
        {
          status: "Manufactured",
          actor: "Manufacturer",
          timestamp: new Date().toISOString(),
        },
      ],
    },
    {
      id: "2",
      name: "Organic Coffee",
      manufacturer: "Green Farms",
      status: "In Distribution",
      history: [
        {
          status: "Manufactured",
          actor: "Manufacturer",
          timestamp: new Date().toISOString(),
        },
        {
          status: "In Distribution",
          actor: "Distributor",
          timestamp: new Date().toISOString(),
        },
      ],
    },
    {
      id: "3",
      name: "Winter Jacket",
      manufacturer: "Outdoor Gear",
      status: "For Sale",
      history: [
        {
          status: "Manufactured",
          actor: "Manufacturer",
          timestamp: new Date().toISOString(),
        },
        {
          status: "In Distribution",
          actor: "Distributor",
          timestamp: new Date().toISOString(),
        },
        {
          status: "For Sale",
          actor: "Retailer",
          timestamp: new Date().toISOString(),
        },
      ],
    },
  ];

  displayProducts(mockProducts);
}

function loadInitialData() {
  if (document.getElementById("productList")) {
    displayMockProducts();
  }

  // Set current role in forms
  updateRoleDisplay();
}
