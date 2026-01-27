let provider = null;
let signer = null;
let contract = null;
let currentAccount = null;
let isConnected = false;

async function initializeWeb3() {
  if (!window.ethereum) return false;

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  currentAccount = await signer.getAddress();
  isConnected = true;

  if (!contractAddress || contractAddress.includes("0x...")) return false;

  contract = new ethers.Contract(contractAddress, contractABI, signer);
  return true;
}

async function connectWallet() {
  try {
    console.log("Attempting to connect wallet...", window);
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to continue.");
      return false;
    }
    await initializeWeb3();
    updateWalletUI();
    alert("Wallet connected successfully!");
    return true;
  } catch (error) {
    console.error("Connection error:", error);
    alert("Failed to connect wallet: " + error.message);
    isConnected = false;
    updateWalletUI();
    return false;
  }
}

function disconnectWallet() {
  provider = null;
  signer = null;
  contract = null;
  currentAccount = null;
  isConnected = false;
  updateWalletUI();
}

function updateWalletUI() {
  const walletBtn = document.getElementById("walletConnectBtn");
  const walletStatus = document.getElementById("walletStatus");
  if (!walletBtn) return;

  if (isConnected && currentAccount) {
    walletBtn.textContent = `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`;
    walletBtn.classList.add("connected");
    walletBtn.classList.remove("disconnected");
    if (walletStatus) walletStatus.textContent = "Connected";
  } else {
    walletBtn.textContent = "Connect Wallet";
    walletBtn.classList.remove("connected");
    walletBtn.classList.add("disconnected");
    if (walletStatus) walletStatus.textContent = "Disconnected";
  }
}

async function ensureContractIsReady() {
  if (!isConnected || !contract) {
    const ok = await connectWallet();
    if (!ok) throw new Error("Please connect MetaMask");
  }
}

async function registerProduct(name, manufacturer, productType, description) {
  await ensureContractIsReady();

  const btn = document.querySelector("button[type='submit']");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Mining...";
  }

  const tx = await contract.registerProduct(
    name,
    manufacturer,
    productType || "General",
    description || "",
  );

  await tx.wait();

  if (btn) {
    btn.disabled = false;
    btn.textContent = "Register on Blockchain";
  }
  window.location.href = "dashboard.html";
  return receipt.transactionHash;
}

async function updateStatus(productId, newStatus, location, role) {
  await ensureContractIsReady();
  const tx = await contract.updateProductStatus(
    productId,
    newStatus,
    location || "",
    role || "",
  );
  await tx.wait();
  await loadProducts();
  return receipt.transactionHash;
}

async function getCertificate(productId) {
  await ensureContractIsReady();
  const p = await contract.getProduct(productId);
  return {
    name: p.name,
    manufacturer: p.manufacturer,
    status: p.status,
    owner: p.owner,
  };
}

async function getAllProducts() {
  const count = await contract.productCounter();
  const products = [];

  for (let i = 0; i <= count; i++) {
    products.push(await contract.getProduct(i));
  }

  return products;
}

async function verifyProduct(productId) {
  const p = await getCertificate(productId);
  return {
    isValid: true,
    productName: p.name,
    message: "Verified on Blockchain",
  };
}

async function initPageWeb3() {
  if (!window.ethereum) return;

  window.ethereum.on("accountsChanged", () => location.reload());
  window.ethereum.on("chainChanged", () => location.reload());
}
const State = {
  getRole: () => localStorage.getItem("supplyChainRole") || "Manufacturer",
  setRole: (role) => {
    localStorage.setItem("supplyChainRole", role);
    updateRoleUI();
  },
};

function updateRoleUI() {
  const badge = document.querySelector(".role-badge");
  if (badge) badge.textContent = State.getRole();
}

function initDashboard() {
  loadProducts();
  document.querySelectorAll(".role-option").forEach((opt) => {
    opt.onclick = () => State.setRole(opt.dataset.role);
  });
}

function initRegister() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const result = document.getElementById("registrationResult");

    try {
      const hash = await registerProduct(
        productName.value,
        manufacturer.value,
        productType.value,
        description.value,
      );
      showSuccess(result, `Success! Hash: ${hash}`);
      form.reset();
    } catch (err) {
      showError(result, err.message);
    }
  };
}

function initUpdate() {
  const form = document.getElementById("updateForm");
  if (!form) return;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const result = document.getElementById("updateResult");

    try {
      await updateStatus(
        updateProductId.value,
        nextStatus.value,
        location.value,
        State.getRole(),
      );
      showSuccess(result, "Status Updated!");
      form.reset();
    } catch (err) {
      showError(result, err.message);
    }
  };
}

function initVerify() {
  const form = document.getElementById("verifyForm");
  if (!form) return;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const result = document.getElementById("verificationResult");

    try {
      const res = await verifyProduct(verifyProductId.value);
      result.innerHTML = `<h3>${res.message}</h3><p>Product: ${res.productName}</p>`;
    } catch (err) {
      showError(result, err.message);
    }
  };
}

async function loadProducts() {
  const container = document.getElementById("productList");
  if (!container) return;

  try {
    const products = await getAllProducts();
    container.innerHTML = "";

    products.forEach((p, i) => {
      const div = document.createElement("div");
      div.className = "product-card";
      div.innerHTML = `
        <h4>${p.name}</h4>
        <p>Status: ${p.status}</p>
        <a href="verify.html?id=${i + 1}">Verify</a>
      `;
      container.appendChild(div);
    });
  } catch {
    container.textContent = "Error loading products.";
  }
}

function showError(el, msg) {
  el.innerHTML = `<div class="error">${msg}</div>`;
}

function showSuccess(el, msg) {
  el.innerHTML = `<div class="success">${msg}</div>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  await initPageWeb3();

  const path = location.pathname;
  if (path.includes("register.html")) initRegister();
  else if (path.includes("update.html")) initUpdate();
  else if (path.includes("verify.html")) initVerify();
  else initDashboard();

  const btn = document.getElementById("walletConnectBtn");
  if (btn) {
    btn.onclick = async (e) => {
      e.preventDefault();
      console.log("Connect wallet button clicked");
      await connectWallet();
    };
  } else {
    console.warn("Wallet connect button not found in the DOM");
  }
});
