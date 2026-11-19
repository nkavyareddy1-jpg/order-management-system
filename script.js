```javascript
// Get saved orders

let orders =
    JSON.parse(localStorage.getItem("orders")) || [];


// Get elements

const orderForm =
    document.getElementById("orderForm");

const tableBody =
    document.getElementById("orderTableBody");

const searchInput =
    document.getElementById("searchInput");

const filterStatus =
    document.getElementById("filterStatus");


// Add Order

orderForm.addEventListener("submit", function(event) {

    event.preventDefault();


    let customerName =
        document.getElementById("customerName").value;

    let product =
        document.getElementById("product").value;

    let quantity =
        Number(document.getElementById("quantity").value);

    let price =
        Number(document.getElementById("price").value);

    let status =
        document.getElementById("status").value;


    // Generate ID

    let orderId =
        "ORD" +
        String(Date.now()).slice(-5);


    // Current date

    let date =
        new Date().toLocaleDateString();


    // Create order

    let order = {

        id: orderId,

        customerName: customerName,

        product: product,

        quantity: quantity,

        price: price,

        status: status,

        date: date

    };


    orders.push(order);


    saveOrders();

    displayOrders();

    updateDashboard();

    updateChart();


    orderForm.reset();


    alert("Order added successfully!");

});


// Display Orders

function displayOrders() {

    tableBody.innerHTML = "";


    let searchText =
        searchInput.value.toLowerCase();


    let selectedStatus =
        filterStatus.value;


    let filteredOrders =
        orders.filter(function(order) {


            let matchesSearch =

                order.customerName
                    .toLowerCase()
                    .includes(searchText)

                ||

                order.product
                    .toLowerCase()
                    .includes(searchText);


            let matchesStatus =

                selectedStatus === "All"

                ||

                order.status === selectedStatus;


            return matchesSearch &&
                   matchesStatus;

        });


    filteredOrders.forEach(function(order) {


        let row =
            document.createElement("tr");


        let total =
            order.quantity *
            order.price;


        row.innerHTML = `

            <td>${order.id}</td>

            <td>${order.customerName}</td>

            <td>${order.product}</td>

            <td>${order.quantity}</td>

            <td>₹${order.price}</td>

            <td>₹${total}</td>

            <td>${order.date || "N/A"}</td>

            <td>
                <span class="status">
                    ${order.status}
                </span>
            </td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editOrder('${order.id}')">

                    Edit

                </button>


                <button
                    class="delete-btn"
                    onclick="deleteOrder('${order.id}')">

                    Delete

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// Delete Order

function deleteOrder(id) {


    let confirmDelete =
        confirm(
            "Are you sure you want to delete this order?"
        );


    if (!confirmDelete) {

        return;

    }


    orders =
        orders.filter(function(order) {

            return order.id !== id;

        });


    saveOrders();

    displayOrders();

    updateDashboard();

    updateChart();

}


// Edit Order

let editingOrderId = null;


function editOrder(id) {


    let order =
        orders.find(function(order) {

            return order.id === id;

        });


    if (!order) {

        return;

    }


    editingOrderId = id;


    document.getElementById("editCustomer").value =
        order.customerName;


    document.getElementById("editProduct").value =
        order.product;


    document.getElementById("editQuantity").value =
        order.quantity;


    document.getElementById("editPrice").value =
        order.price;


    document.getElementById("editStatus").value =
        order.status;


    document.getElementById("editModal").style.display =
        "block";

}


// Save edited order

document.getElementById("editForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        let order =
            orders.find(function(order) {

                return order.id === editingOrderId;

            });


        if (!order) {

            return;

        }


        order.customerName =
            document.getElementById("editCustomer").value;


        order.product =
            document.getElementById("editProduct").value;


        order.quantity =
            Number(
                document.getElementById("editQuantity").value
            );


        order.price =
            Number(
                document.getElementById("editPrice").value
            );


        order.status =
            document.getElementById("editStatus").value;


        saveOrders();

        displayOrders();

        updateDashboard();

        updateChart();


        closeModal();

    });


// Close Modal

function closeModal() {

    document.getElementById("editModal").style.display =
        "none";

}


document.getElementById("closeModal")
    .addEventListener("click", closeModal);


// Close when clicking outside

window.addEventListener("click", function(event) {

    let modal =
        document.getElementById("editModal");


    if (event.target === modal) {

        closeModal();

    }

});


// Search

searchInput.addEventListener(
    "input",
    displayOrders
);


// Filter

filterStatus.addEventListener(
    "change",
    displayOrders
);


// Save Orders

function saveOrders() {

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

}


// Dashboard

function updateDashboard() {


    // Total

    document.getElementById("totalOrders")
        .innerText = orders.length;


    // Pending

    let pending =
        orders.filter(function(order) {

            return order.status === "Pending";

        }).length;


    document.getElementById("pendingOrders")
        .innerText = pending;


    // Delivered

    let delivered =
        orders.filter(function(order) {

            return order.status === "Delivered";

        }).length;


    document.getElementById("deliveredOrders")
        .innerText = delivered;


    // Revenue

    let revenue =
        orders.reduce(function(total, order) {

            return total +
                (order.quantity * order.price);

        }, 0);


    document.getElementById("totalRevenue")
        .innerText = "₹" + revenue;

}


// Chart

let orderChart;


function updateChart() {


    let pending = 0;

    let processing = 0;

    let shipped = 0;

    let delivered = 0;


    orders.forEach(function(order) {


        if (order.status === "Pending") {

            pending++;

        }

        else if (order.status === "Processing") {

            processing++;

        }

        else if (order.status === "Shipped") {

            shipped++;

        }

        else if (order.status === "Delivered") {

            delivered++;

        }

    });


    let ctx =
        document.getElementById("orderChart");


    if (orderChart) {

        orderChart.destroy();

    }


    orderChart =
        new Chart(ctx, {

            type: "doughnut",

            data: {

                labels: [
                    "Pending",
                    "Processing",
                    "Shipped",
                    "Delivered"
                ],

                datasets: [{

                    data: [
                        pending,
                        processing,
                        shipped,
                        delivered
                    ]

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        });

}


// Dark Mode

const darkModeBtn =
    document.getElementById("darkModeBtn");


darkModeBtn.addEventListener(
    "click",
    function() {


        document.body.classList.toggle("dark");


        if (
            document.body.classList.contains("dark")
        ) {

            darkModeBtn.innerText =
                "☀️ Light Mode";

        }

        else {

            darkModeBtn.innerText =
                "🌙 Dark Mode";

        }

    }
);


// Load data when page opens

displayOrders();

updateDashboard();

updateChart();
```
