const API = "http://localhost:3000";

/* ---------------------------
  1️⃣ REGISTER PRODUCT
--------------------------- */
async function handleRegister() {
  const name = document.getElementById("name").value.trim();
  const manufacturer = document.getElementById("manufacturer").value.trim();
  const role = "Manufacturer"; // always "Manufacturer" for registration

  if (!name || !manufacturer) {
    alert("Please enter both product name and manufacturer.");
    return;
  }

  try {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, manufacturer, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Registration error:", data);
      alert(data.error || "Registration failed");
      return;
    }

    alert(`Product registered successfully! ID: ${data._id}`);
    console.log("Registered product:", data);
    loadProducts(); // refresh product list
  } catch (err) {
    console.error(err);
    alert("Network error: " + err.message);
  }
}

/* ---------------------------
  2️⃣ LOAD ALL PRODUCTS
--------------------------- */
async function loadProducts() {
  try {
    const res = await fetch(`${API}/products`);
    const products = await res.json();

    console.log("Products from backend:", products); // 👈 check what you got

    const container = document.getElementById("productList");
    container.innerHTML = "";

    if (!Array.isArray(products)) {
      container.textContent = "Error: products is not an array";
      console.error("Products is not an array", products);
      return;
    }

    if (products.length === 0) {
      container.textContent = "No products yet.";
      return;
    }

    products.forEach((p) => {
      const div = document.createElement("div");
      div.classList.add("product-item");
      div.innerHTML = `
        <strong>${p.name}</strong> — Status: ${p.status} <br>
        Manufacturer: ${p.manufacturer} <br>
        ID: ${p._id}
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

/* ---------------------------
  3️⃣ UPDATE PRODUCT STATUS
--------------------------- */
async function handleUpdateStatus() {
  const id = document.getElementById("productId").value.trim();
  const nextStatus = document.getElementById("nextStatus").value;
  const actor = document.getElementById("actor").value.trim();
  const role = document.getElementById("role").value.trim();

  if (!id || !nextStatus || !actor || !role) {
    alert("Please fill all fields to update status.");
    return;
  }

  try {
    const res = await fetch(`${API}/update-status/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nextStatus, actor, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Update error:", data);
      alert(data.error || "Status update failed");
      return;
    }

    alert(`Status updated to "${nextStatus}" successfully!`);
    console.log("Updated product:", data.product);
    loadProducts(); // refresh product list
  } catch (err) {
    console.error(err);
    alert("Network error: " + err.message);
  }
}

/* ---------------------------
  4️⃣ VERIFY PRODUCT
--------------------------- */
async function handleVerify() {
  const id = document.getElementById("verifyId").value.trim();

  if (!id) {
    alert("Enter a product ID to verify.");
    return;
  }

  try {
    const res = await fetch(`${API}/verify/${id}`);
    const data = await res.json();

    if (!res.ok) {
      console.error("Verification error:", data);
      alert(data.error || "Verification failed");
      return;
    }

    const resultDiv = document.getElementById("verifyResult");
    resultDiv.textContent = `
Name: ${data.name}
History Count: ${data.historyCount}
Status: ${data.isValid ? "✅ Chain is secure" : "❌ Chain is broken"}
Message: ${data.message}
    `;
  } catch (err) {
    console.error(err);
    alert("Network error: " + err.message);
  }
}

/* ---------------------------
  5️⃣ INITIAL LOAD
--------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});
