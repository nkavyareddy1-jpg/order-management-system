const API_URL = "/api/orders";
let orders = [];
let editingOrderId = null;
let orderChart = null;

const $ = (id) => document.getElementById(id);
const orderForm = $("orderForm");
const tableBody = $("orderTableBody");
const message = $("message");

function showMessage(text, type = "success") {
  message.textContent = text;
  message.className = `message ${type}`;
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Something went wrong");
  return result;
}

function formatMoney(value) {
  return "₹" + Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  });
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN");
}

async function loadOrders() {
  tableBody.innerHTML = '<tr><td colspan="9">Loading orders...</td></tr>';
  try {
    const params = new URLSearchParams({
      search: $("searchInput").value.trim(),
      status: $("filterStatus").value
    });
    const result = await apiRequest(`${API_URL}?${params.toString()}`);
    orders = result.data;
    displayOrders();
    updateDashboard();
    updateChart();
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="9">${escapeHtml(error.message)}</td></tr>`;
    showMessage(error.message, "error");
  }
}

// Escape text before placing it inside HTML.
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}

function displayOrders() {
  tableBody.innerHTML = "";
  if (!orders.length) {
    tableBody.innerHTML = '<tr><td colspan="9">No orders found. Add your first order above.</td></tr>';
    return;
  }

  orders.forEach((order) => {
    const row = document.createElement("tr");
    const total = Number(order.quantity) * Number(order.price);
    row.innerHTML = `
      <td>${escapeHtml(order._id.slice(-6).toUpperCase())}</td>
      <td>${escapeHtml(order.customerName)}</td>
      <td>${escapeHtml(order.product)}</td>
      <td>${order.quantity}</td>
      <td>${formatMoney(order.price)}</td>
      <td>${formatMoney(total)}</td>
      <td>${formatDate(order.orderDate)}</td>
      <td><span class="status">${escapeHtml(order.status)}</span></td>
      <td>
        <button class="edit-btn" data-action="edit" data-id="${order._id}">Edit</button>
        <button class="delete-btn" data-action="delete" data-id="${order._id}">Delete</button>
      </td>`;
    tableBody.appendChild(row);
  });
}

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = {
    customerName: $("customerName").value.trim(),
    product: $("product").value.trim(),
    quantity: Number($("quantity").value),
    price: Number($("price").value),
    status: $("status").value
  };

  if (!payload.customerName || !payload.product || !Number.isInteger(payload.quantity) ||
      payload.quantity < 1 || !Number.isFinite(payload.price) || payload.price <= 0) {
    showMessage("Enter valid customer, product, quantity and price details.", "error");
    return;
  }

  try {
    if (editingOrderId) {
      await apiRequest(`${API_URL}/${editingOrderId}`, {
        method: "PUT", body: JSON.stringify(payload)
      });
      showMessage("Order updated successfully.");
    } else {
      await apiRequest(API_URL, { method: "POST", body: JSON.stringify(payload) });
      showMessage("Order added successfully.");
    }
    resetForm();
    await loadOrders();
  } catch (error) {
    showMessage(error.message, "error");
  }
});

tableBody.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  const order = orders.find((item) => item._id === id);
  if (!order) return;

  if (action === "edit") {
    editingOrderId = id;
    $("customerName").value = order.customerName;
    $("product").value = order.product;
    $("quantity").value = order.quantity;
    $("price").value = order.price;
    $("status").value = order.status;
    $("formTitle").textContent = "Edit Order";
    $("submitBtn").textContent = "Save Changes";
    $("cancelEditBtn").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (action === "delete") {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await apiRequest(`${API_URL}/${id}`, { method: "DELETE" });
      showMessage("Order deleted successfully.");
      if (editingOrderId === id) resetForm();
      await loadOrders();
    } catch (error) {
      showMessage(error.message, "error");
    }
  }
});

function resetForm() {
  orderForm.reset();
  editingOrderId = null;
  $("formTitle").textContent = "Add New Order";
  $("submitBtn").textContent = "Add Order";
  $("cancelEditBtn").classList.add("hidden");
}

$("cancelEditBtn").addEventListener("click", resetForm);
$("searchInput").addEventListener("input", loadOrders);
$("filterStatus").addEventListener("change", loadOrders);
$("refreshBtn").addEventListener("click", loadOrders);

function updateDashboard() {
  $("totalOrders").textContent = orders.length;
  $("pendingOrders").textContent = orders.filter(o => o.status === "Pending").length;
  $("deliveredOrders").textContent = orders.filter(o => o.status === "Delivered").length;
  const revenue = orders.reduce((sum, order) => sum + order.quantity * order.price, 0);
  $("totalRevenue").textContent = formatMoney(revenue);
}

function updateChart() {
  const counts = ["Pending", "Processing", "Shipped", "Delivered"]
    .map(status => orders.filter(order => order.status === status).length);
  const canvas = $("orderChart");
  if (orderChart) orderChart.destroy();
  if (typeof Chart === "undefined") return;
  orderChart = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: ["Pending", "Processing", "Shipped", "Delivered"],
      datasets: [{ data: counts }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } }
    }
  });
}

$("darkModeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  $("darkModeBtn").textContent = dark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("orderAppDarkMode", dark ? "yes" : "no");
});

if (localStorage.getItem("orderAppDarkMode") === "yes") {
  document.body.classList.add("dark");
  $("darkModeBtn").textContent = "☀️ Light Mode";
}

loadOrders();
