//Orders.js: Handles Orders and Order_Products

/*
    DOM manipulation
*/

document.addEventListener("DOMContentLoaded", () => {
    // DOM elements
    const ordersTable = document.getElementById('orders-table');
    const addOrderModal = document.getElementById('add-order-modal');
    const addOrderForm = document.getElementById('add-order-form');
    const updateOrderModal = document.getElementById('update-order-modal');

    const orderProductsModal = document.getElementById('order-products-modal');
    const orderProductsTable = document.getElementById('order-products-table');
    const addOrderProductForm = document.getElementById('add-order-product-form');
    const updateOrderProductForm = document.getElementById('update-order-product-form');

    // Error checking for missing elements
    if (!ordersTable) console.error("ordersTable element not found!");
    if (!addOrderModal) console.error("addOrderModal element not found!");
    if (!addOrderForm) console.error("addOrderForm element not found!");

    if (!orderProductsTable) console.error("orderProductsTable element not found!");
    if (!orderProductsModal) console.error("orderProductsModal element not found!");
    if (!addOrderProductForm) console.error("addOrderProductForm element not found!");
    if (!updateOrderProductForm) console.error("updateOrderProductForm element not found!");

    // Initialize event listeners if elements exist
    document.getElementById('add-order-button')?.addEventListener('click', () => openModal(addOrderModal));
    document.getElementById('add-order-product-button')?.addEventListener('click', () => {
        showForm(addOrderProductForm);
        showTitle(document.getElementById("add-order-product-title"));
    });

    document.addEventListener("DOMContentLoaded", () => {
        // Other initialization code...
    
        // Attach click event to "Manage" buttons
        document.querySelectorAll(".manage-button").forEach((button) => {
            button.addEventListener("click", () => {
                const orderID = button.getAttribute("data-order-id");
                fetchOrderProducts(orderID); // Call fetchOrderProducts with the correct orderID
            });
        });
    });
    document.querySelectorAll(".update-button").forEach((button) => {
        button.addEventListener("click", (e) => {
            const row = e.target.closest("tr");
            const orderID = row.dataset.value;
            console.log("Order ID from row:", orderID); // Should log the correct ID
            if (orderID) {
                updateOrderModal(orderID);
            } else {
                console.error("No orderID found for update!");
            }
        });
    });
    document.getElementById('cancel-add-order').addEventListener('click', () => {
        const addOrderForm = document.getElementById('add-order-form');
        const addOrderModal = document.getElementById('add-order-modal');
    
        // Reset the form fields
        addOrderForm.reset();
    
        // Close the modal
        closeModal(addOrderModal);
    });
    document.getElementById('cancel-update-order').addEventListener('click', () => {
        const updateOrderForm = document.getElementById('update-order-form');
        const updateOrderModal = document.getElementById('update-order-modal');
    
        // Reset the form fields
        updateOrderForm.reset();
    
        // Close the modal
        closeModal(updateOrderModal);
    });

    document.getElementById('update-order-form').addEventListener('submit', (e) => {
        e.preventDefault();
        updateOrder(); // Submit the update
    });

    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => closeModal(button.dataset.modalId));
    });

    addOrderForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        createOrder();
    });
    addOrderProductForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        createOrderProduct();
    });

    


    // Initialize orders and dropdowns
    fetchOrders();
    populateDropdown('/api/dogs', 'dogID', 'id', 'name'); // For Dog ID in Add Order form
    populateDropdown('/api/addresses', 'addressID', 'id', 'label'); // For Address ID in Add Order form
    populateDropdown('/api/products', 'productID', 'id', 'name'); // For Product ID in Add Order Product form
    
});

/* 
    READ FUNCTIONS 
*/

// Fetch orders
function fetchOrders() {
    fetch("/api/orders")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            const tbody = document.querySelector("#orders-table tbody");
            tbody.innerHTML = ""; // Clear existing rows

            data.forEach((item) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.orderID}</td>
                    <td>${item.dogID}</td>
                    <td>${item.addressID}</td>
                    <td>${new Date(item.orderDate).toLocaleDateString()}</td>
                    <td>${item.orderGiftNote || ""}</td>
                    <td>${item.orderCustomRequest || "None"}</td>
                    <td>${item.orderStatus}</td>
                    <td>${item.orderShippedDate ? new Date(item.orderShippedDate).toLocaleDateString() : "-"}</td>
                    <td>${item.orderDeliveredDate ? new Date(item.orderDeliveredDate).toLocaleDateString() : "-"}</td>
                    <td>
                        <button class="manage-button" data-order-id="${item.orderID}">Manage</button>
                    </td>
                    <td>
                        <button class="update-button" data-order-id="${item.orderID}">Update</button>
                        <button class="delete-button" data-order-id="${item.orderID}">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);

                // Add Event Listeners for Buttons
                row.querySelector('.manage-button').addEventListener('click', () => fetchOrderProducts(item.orderID));
                row.querySelector('.update-button').addEventListener('click', () => updateOrderModal(item.orderID));
                row.querySelector('.delete-button').addEventListener('click', () => deleteOrder(item.orderID));
            });
        })
        .catch((error) => {
            console.error("Error in fetchOrders:", error);
            alert("Error loading orders. Please try again.");
        });
}

// Fetch order products
function fetchOrderProducts(orderID) {
    fetch(`/api/orders/${orderID}/products`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch order products: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            const tbody = document.querySelector("#order-products-table tbody");
            tbody.innerHTML = "";

            document.getElementById("manageOrderID").textContent = orderID;

            hideForm(document.getElementById("add-order-product-form"));
            hideForm(document.getElementById("update-order-product-form"));
            hideTitle(document.getElementById("add-order-product-title"));
            hideTitle(document.getElementById("update-order-product-title"));

            data.forEach((item) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.orderProductID}</td>
                    <td>${item.orderID}</td>
                    <td>${item.productID} (${item.productName || "Unknown"})</td>
                    <td>${item.orderProductRequest || "None"}</td>
                    <td>${item.orderProductSalePrice !== null && item.orderProductSalePrice !== undefined ? item.orderProductSalePrice.toFixed(2) : "-"}</td>
                    <td>
                        <button class="update-product-button" data-product='${JSON.stringify(item)}'>Update</button>
                        <button class="delete-product-button" data-order-product-id="${item.orderProductID}" data-order-id="${orderID}">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);

                // Use the correct function
                row.querySelector(".update-product-button").addEventListener("click", (e) => {
                    console.log("data-product:", e.target.getAttribute("data-product"));
                    const productData = e.target.getAttribute("data-product");
                    if (!productData) {
                        console.error("No product data found on button!");
                        return;
                    }
                
                    const parsedProductData = JSON.parse(productData);
                    updateOrderProduct(parsedProductData); // Call the function with parsed data
                });
                row.querySelector(".delete-product-button").addEventListener("click", () => {
                    deleteOrderProduct(item.orderProductID, orderID);
                });
            });

            openModal("order-products-modal");
        })
        .catch((error) => {
            console.error("Error in fetchOrderProducts:", error);
            alert("Error loading order products. Please try again later.");
        });
}
/*
    CREATE
*/

// Add new order
function createOrder() {
    const addOrderModal = document.getElementById('add-order-modal');
    const addOrderForm = document.getElementById('add-order-form'); // Get the form element
    const formData = new FormData(addOrderForm); // Use the form element
    const orderData = {
        dogID: formData.get("dogID"),
        addressID: formData.get("addressID"),
        orderDate: formData.get("orderDate"),
        orderGiftNote: formData.get("orderGiftNote") || null,
        orderCustomRequest: formData.get("orderCustomRequest") || null,
        orderStatus: formData.get("orderStatus"),
        orderShippedDate: formData.get("orderShippedDate") || null,
        orderDeliveredDate: formData.get("orderDeliveredDate") || null,
    };

    console.log("Order Data:", orderData);

    fetch("/api/orders/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
    })
        .then((response) => {
            if (!response.ok) {
                console.error(`Failed to create order: ${response.status}`);
                throw new Error(`Failed to create order: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Order created successfully:", data);

            // Reset the form fields
            addOrderForm.reset();

            // Close the modal
            closeModal(addOrderModal);

            // Refresh the orders table
            fetchOrders();
        })
        .catch((error) => {
            console.error("Error in createOrder:", error);
            alert("Failed to create the order. Please try again.");
        });
}

//Add new order product
function createOrderProduct() {
    const form = document.getElementById('add-order-product-form');
    if (!form) {
        console.error("Form for adding order product not found!");
        return;
    }
    const formData = new FormData(form);
    const orderID = document.getElementById("manageOrderID").textContent; // Get the current order ID

    const orderProductData = {
        orderID: orderID,
        productID: formData.get("productID"),
        orderProductRequest: formData.get("orderProductRequest") || null,
        orderProductSalePrice: parseFloat(formData.get("orderProductSalePrice")),
    };

    fetch("/api/order-products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderProductData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to create order product: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(() => {
            fetchOrderProducts(orderID); // Refresh the order products table
            hideForm(form); // Hide the form after successful submission
            form.reset(); // Reset the form fields
        })
        .catch((error) => {
            console.error("Error in createOrderProduct:", error);
            alert("Failed to create the order product. Please try again.");
        });
}

/*
    UPDATE
*/

// Update an order
function updateOrder() {
    const form = document.getElementById('update-order-form');
    const orderID = document.getElementById('orderID').value; // Retrieve hidden Order ID

    if (!orderID) {
        console.error("No Order ID provided for update!");
        return;
    }

    const formData = new FormData(form);
    const orderData = {
        addressID: formData.get("addressID"),
        orderGiftNote: formData.get("orderGiftNote") || null,
        orderCustomRequest: formData.get("orderCustomRequest") || null,
        orderStatus: formData.get("orderStatus"),
        orderShippedDate: formData.get("orderShippedDate") || null,
        orderDeliveredDate: formData.get("orderDeliveredDate") || null,
    };

    console.log("Updating order with data:", orderData);

    fetch(`/api/orders/update/${orderID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to update order: ${response.status} ${response.statusText}`);
            }
            return response.text(); // Use `response.text()` if server doesn't send JSON
        })
        .then(() => {
            console.log("Order updated successfully");
            closeModal('update-order-modal'); // Close the modal
            fetchOrders(); // Refresh the orders table
        })
        .catch((error) => {
            console.error("Error updating order:", error);
            alert("Failed to update the order. Please try again.");
        });
}
// Update an order product
function updateOrderProduct(orderProductData) {
    // Get the update form and modal elements
    if (!orderProductData) {
        console.error("updateOrderProduct called without orderProductData!");
        return;
    }
    console.log("orderProductData:", orderProductData);
    const form = document.getElementById("update-order-product-form");
    const modal = document.getElementById("order-products-modal");

    // Populate the form fields with the provided orderProductData
    form.querySelector("#orderProductID").value = orderProductData.orderProductID; // Hidden input for ID
    form.querySelector("#updateOrderProductRequest").value = orderProductData.orderProductRequest || "";
    form.querySelector("#updateOrderProductSalePrice").value =
        orderProductData.orderProductSalePrice !== null && orderProductData.orderProductSalePrice !== undefined
            ? orderProductData.orderProductSalePrice.toFixed(2)
            : "";

    // Populate the product dropdown dynamically
    const productDropdown = form.querySelector("#productID");

    fetch("/api/products")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then((products) => {
            console.log("Fetched products:", products); // Add this debug log
            productDropdown.innerHTML = '<option value="">Select a Product</option>';
    
            products.forEach((product) => {
                const option = document.createElement("option");
                option.value = product.id;
                option.textContent = product.name;
                if (product.id === orderProductData.productID) {
                    option.selected = true; // Pre-select the product in the dropdown
                }

                productDropdown.appendChild(option);
            });

            showForm(form); // Display the form after dropdown is populated
            showTitle(document.getElementById("update-order-product-title"));
        })
        .catch((error) => {
            console.error("Error populating product dropdown:", error);
            alert("Failed to load product options. Please try again.");
        });

    // Add event listener to handle form submission (update logic)
    form.onsubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
    
        const updatedOrderProductData = {
            productID: form.querySelector("#productID").value,
            orderProductRequest: form.querySelector("#updateOrderProductRequest").value || null,
            orderProductSalePrice: parseFloat(form.querySelector("#updateOrderProductSalePrice").value),
        };
    
        // Get the orderProductID from the form
        const orderProductID = form.querySelector("#orderProductID").value;
    
        if (!orderProductID) {
            console.error("orderProductID is undefined. Cannot update.");
            return;
        }
    
        // Send the update request to the server
        fetch(`/api/order-products/update/${orderProductID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedOrderProductData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to update order product: ${response.status} ${response.statusText}`);
                }
                return response.text(); // Use response.text() if no JSON is returned
            })
            .then(() => {
                const orderID = document.getElementById("manageOrderID").textContent; // Get the current order ID
                fetchOrderProducts(orderID); // Refresh the products table
                closeModal(modal); // Close the modal after successful update
            })
            .catch((error) => {
                console.error("Error updating order product:", error);
                alert("Failed to update the order product. Please try again.");
            });
    };
    
    
}
/*
    DELETE
*/

// Delete an order
function deleteOrder(orderID) {
    if (confirm("Are you sure you want to delete this order?")) {
        fetch(`/api/orders/delete/${orderID}`, { method: "DELETE" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to delete order: ${response.status} ${response.statusText}`);
                }
            })
            .then(() => {
                fetchOrders(); // Refresh the orders table
            })
            .catch((error) => {
                console.error("Error in deleteOrder:", error);
                alert("Failed to delete the order. Please try again.");
            });
    }
}
//Delete an order product
function deleteOrderProduct(orderProductID, orderID) {
    if (confirm("Are you sure you want to delete this order product?")) {
        fetch(`/api/order-products/delete/${orderProductID}`, { method: "DELETE" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to delete order product: ${response.status} ${response.statusText}`);
                }
            })
            .then(() => {
                fetchOrderProducts(orderID); // Refresh the order products table
            })
            .catch((error) => {
                console.error("Error in deleteOrderProduct:", error);
                alert("Failed to delete the order product. Please try again.");
            });
    }
}

/*
    MODAL MANAGEMENT
*/

// Open Modal
function openModal(modal) {
    if (typeof modal === "string") {
        modal = document.getElementById(modal);
    }
    if (!modal) {
        console.error("Modal element not found!");
        return;
    }
    modal.style.display = "block";
    modal.classList.add("is-active");
}

function closeModal(modal) {
    if (typeof modal === "string") {
        modal = document.getElementById(modal);
    }
    if (!modal) {
        console.error("Modal element not found!");
        return;
    }
    modal.style.display = "none";
    modal.classList.remove("is-active");

    const form = modal.querySelector('form');
    if (form) {
        form.reset();
    }
}

// Show Form
function showForm(form) {
    form.classList.remove('is-hidden');
}
function hideForm(form) {
    if (!form) {
        console.error("Form not found to hide!");
        return;
    }
    form.classList.add('is-hidden'); // Add a CSS class to hide the form
}

function hideTitle(title) {
    title.style.display = 'none'; // Hide the title
}

function showTitle(title) {
    title.style.display = 'block'; // Show the title
}

function updateOrderModal(orderID) {
    console.log("updateOrderModal called with orderID:", orderID);

    fetch(`/api/orders/${orderID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch order: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(orderData => {
            console.log("Fetched Order Data:", orderData);

            const modalTitle = document.querySelector('#update-order-modal .modal-content h2');
            if (modalTitle) {
                modalTitle.textContent = `Order #${orderData.orderID} - Update`;
            }
            // Populate form fields
            document.getElementById('orderID').value = orderData.orderID;
            document.getElementById('updateGiftNote').value = orderData.orderGiftNote || '';
            document.getElementById('updateCustomRequest').value = orderData.orderCustomRequest || '';
            document.getElementById('updateOrderStatus').value = orderData.orderStatus || '';
            document.getElementById('updateShippedDate').value = orderData.orderShippedDate || '';
            document.getElementById('updateDeliveredDate').value = orderData.orderDeliveredDate || '';

            // Dynamically populate the address dropdown without preselection
            console.log("Populating address dropdown");
            const addressDropdown = document.getElementById('updateAddressID');
            fetch('/api/addresses')
                .then(response => response.json())
                .then(data => {
                    addressDropdown.innerHTML = '<option value="">Select an option</option>';
                    data.forEach(address => {
                        const option = document.createElement('option');
                        option.value = address.id;
                        option.textContent = address.label;
                        if (address.id === orderData.addressID) {
                            option.selected = true; // Pre-select the current address
                        }
                        addressDropdown.appendChild(option);
                    });
                });

            openModal('update-order-modal');
        })
        .catch(error => {
            console.error("Error fetching order details:", error);
            alert("Failed to load order details. Please try again.");
        });
}
function orderProductModal(orderProductID, orderID) {
    fetch(`/api/order-products/${orderProductID}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch order product: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            // Populate the form dynamically
            const form = document.getElementById("update-order-product-form");
            form.innerHTML = ``;

            // Attach form submission handler
            form.onsubmit = (e) => {
                e.preventDefault();
                updateOrderProduct(orderProductID, orderID); // Call the update function
            };

            // Show the form within the modal
            showForm(form);
        })
        .catch((error) => {
            console.error("Error fetching order product details:", error);
            alert("Failed to load order product details. Please try again later.");
        });
}
function populateDropdown(endpoint, dropdownID, valueKey, textKey) {
    const dropdown = document.getElementById(dropdownID);

    if (!dropdown) {
        console.error(`Dropdown with ID "${dropdownID}" not found!`);
        return;
    }

    // Fetch data from the server
    fetch(endpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${endpoint}: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`Data fetched for ${dropdownID}:`, data); // Add this line
            // Clear existing options
            dropdown.innerHTML = '<option value="">Select an option</option>';

            // Populate dropdown with new options
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item[valueKey];
                option.textContent = item[textKey];
                dropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error(`Error populating dropdown "${dropdownID}":`, error);
        });
}


function populateUpdateOrderProductForm(productData) {
    const form = document.getElementById("update-order-product-form");

    form.querySelector("#orderProductID").value = productData.orderProductID; // Ensure this value is set
    form.querySelector("#updateOrderProductRequest").value = productData.orderProductRequest || "";
    form.querySelector("#updateOrderProductSalePrice").value =
        productData.orderProductSalePrice !== null && productData.orderProductSalePrice !== undefined
            ? productData.orderProductSalePrice.toFixed(2)
            : "";

    // Dynamically populate the productID dropdown
    const productDropdown = form.querySelector("#productID");

    fetch("/api/products")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then((products) => {
            productDropdown.innerHTML = '<option value="">Select a Product</option>'; // Clear existing options

            products.forEach((product) => {
                const option = document.createElement("option");
                option.value = product.id; // Match the value with the database's productID
                option.textContent = product.name; // Display product name
                if (product.id === productData.productID) {
                    option.selected = true; // Pre-select the product in the dropdown
                }
                productDropdown.appendChild(option);
            });

            showForm(form); // Display the form after dropdown is populated
            showTitle(document.getElementById("update-order-product-title"));
        })
        .catch((error) => {
            console.error("Error populating product dropdown:", error);
            alert("Failed to load product options. Please try again.");
        });

    openModal("order-products-modal");
}
