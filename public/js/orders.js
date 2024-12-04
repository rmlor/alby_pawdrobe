//orders.js: Handles Orders and Order_Products

/*
    Citation for DOM Manipulation and Event Handling (Dropdowns, Tables, Forms)
    - Date: 12/1/2024
    - Adapted from:
      1. Web Development Module – Modifying the DOM Tree & DOM Events
      2. Node.js Starter App – Steps 4-8
    - Source URLs:
      1. https://canvas.oregonstate.edu/courses/1967288/pages/exploration-modifying-the-dom-tree?module_item_id=24465404
      2. https://canvas.oregonstate.edu/courses/1967288/pages/exploration-dom-events?module_item_id=24465405
      3. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data
      4. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
      5. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%206%20-%20Dynamically%20Filling%20Dropdowns%20and%20Adding%20a%20Search%20Box
      6. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data 
      7. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
    - Adaptation Details: DOM event manipulation logic, event listeners for user interactions, and its implementation for dynamic dropdowns, tables, and forms with data fetched from the backend were respectively informed by Web Development modules and Node.js Starter App repository.
*/

/*
    Citation for API Usage and CRUD Implementations
    - Date: 12/1/2024
    - Adapted from:
      1. Web Development Course Modules: Writing Asynchronous Code & Routing and API Responses
      2. Node.js Starter App – Steps 4, 5, 7 & 8
    - Source URLs
      1. https://canvas.oregonstate.edu/courses/1967288/pages/exploration-writing-asynchronous-code?module_item_id=24465423 
      2. https://canvas.oregonstate.edu/courses/1967288/pages/exploration-routing-and-forms?module_item_id=24465437 
      3. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data
      4. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
      5. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data 
      6. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
    - Adaptation Details: lient-side use of `fetch()` for sending requests to API routes and handling responses was adapted from the Web Development modules, and integration of CRUD logic into the frontend using dynamic tables and forms was informed by both the repository.
*/

/*
    Citation for Modal Integration
    - Date: 12/1/2024
    - Adapted from: W3Schools – How To Create a Modal Box
    - Source URL: https://www.w3schools.com/howto/howto_css_modals.asp
    - Adaptation Details: The structure and styling of modal boxes for displaying intersection tables, add data forms, and update data forms were modelled after the modal box example on W3Schools.
*/

/*
    DOM Manipulation
*/

document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const addOrderForm = document.getElementById('add-order-form');
    const addOrderProductForm = document.getElementById('add-order-product-form');;
    const updateOrderForm = document.getElementById('update-order-form');
    const updateOrderProductForm = document.getElementById('update-order-product-form');

    const addOrderProductTitle = document.getElementById("add-order-product-title");
    const updateOrderProductTitle = document.getElementById("update-order-product-title");
    const addOrderModal = document.getElementById('add-order-modal');
    const updateOrderModal = document.getElementById('update-order-modal')

    // Event Listeners - Handle Static Buttons
    document.getElementById('add-order-button')?.addEventListener('click', () => {
        openModal(addOrderModal);
    });
    document.getElementById('add-order-product-button')?.addEventListener('click', () => {
        showForm(addOrderProductForm);
        showTitle(addOrderProductTitle);
    });
    document.getElementById('cancel-add-order').addEventListener('click', () => {
        addOrderForm.reset();
        closeModal(addOrderModal);
    });
    document.getElementById('cancel-update-order').addEventListener('click', () => {
        updateOrderForm.reset();
        closeModal(updateOrderModal);
    });
    document.getElementById('cancel-add-order-product').addEventListener('click', () => {
        addOrderProductForm.reset();
        hideForm(addOrderProductForm)
        hideTitle(addOrderProductTitle)
    });
    document.getElementById('cancel-update-order-product').addEventListener('click', () => {
        updateOrderProductForm.reset();
        hideForm(updateOrderProductForm);
        hideTitle(updateOrderProductTitle)
    });

    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => closeModal(button.dataset.modalId));
    });

    // Event Listeners - Handle Form Submissions
    addOrderForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        createOrder();
    });
    addOrderProductForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        createOrderProduct();
    });
    updateOrderForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        updateOrder();
    });
    updateOrderProductForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const orderProductID = document.querySelector("#orderProductID").value; 
    
        // GET route for order product by ID
        fetch(`/api/order-products/${orderProductID}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch order product: ${response.statusText}`);
                }
                return response.json();
            })
            .then((orderProductData) => {
                updateOrderProduct(orderProductData); 
            })
            .catch((error) => {
                console.error("Error fetching order product data:", error);
            });
    });

    // Load and display data
    fetchOrders();                                                      //Orders table
    populateDropdown('/api/drop/dogs', 'dogID', 'id', 'name');               //dogID for Orders management
    populateDropdown('/api/drop/addresses', 'addressID', 'id', 'label');     //addressID for Orders management
    populateDropdown('/api/drop/products', 'productID', 'id', 'name');       //productID for Order_Products management
});

/* 
    CRUD - READ FUNCTIONS 
*/

// Load and display all orders 
function fetchOrders() {
    // GET route (orders)
    fetch('/api/orders')
        // Handle API response
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        // Process and render orders data (API to TABLE)
        .then((data) => {
            const tbody = document.querySelector("#orders-table tbody");
            tbody.innerHTML = ""; // Clear existing table rows

            // Populate table rows
            data.forEach((item) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.orderID}</td>
                    <td>${item.dogID}</td>
                    <td>${item.addressID}</td>
                    <td>${item.customerName}</td>
                    <td>${item.dogName}</td>
                    <td>${new Date(item.orderDate).toLocaleDateString()}</td>
                    <td>${item.orderGiftNote || ""}</td>
                    <td>${item.orderCustomRequest || "None"}</td>
                    <td>${item.orderStatus}</td>
                    <td>${item.orderShippedDate ? new Date(item.orderShippedDate).toLocaleDateString() : "-"}</td>
                    <td>${item.orderDeliveredDate ? new Date(item.orderDeliveredDate).toLocaleDateString() : "-"}</td>
                    <td>
                        <button id="manage-order-button-${item.orderID}" data-order-id="${item.orderID}">Manage</button>
                    </td>
                    <td>
                        <button id="update-order-button-${item.orderID}" data-order-id="${item.orderID}">Update</button>
                        <button id="delete-order-button-${item.orderID}" data-order-id="${item.orderID}">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);

                // Event listeners for row buttons
                document
                    .getElementById(`manage-order-button-${item.orderID}`)
                    .addEventListener("click", () => fetchOrderProducts(item.orderID));

                document
                    .getElementById(`update-order-button-${item.orderID}`)
                    .addEventListener("click", () => updateOrderModal(item.orderID));

                document
                    .getElementById(`delete-order-button-${item.orderID}`)
                    .addEventListener("click", () => deleteOrder(item.orderID));
            });
        })
        // Handle API error
        .catch((error) => {
            console.error("Error in fetchOrders:", error);
            alert("Error loading orders. Please try again.");
        });
}

// Load and display all order products for a given order
function fetchOrderProducts(orderID) {
    // GET route (order products for given orderID)
    fetch(`/api/orders/${orderID}/products`)
        // Handle API response
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch order products: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        // Process and render order products data (API to TABLE)
        .then((data) => {
            const tbody = document.querySelector("#order-products-table tbody");
            tbody.innerHTML = "";

            // Extract and display row orderID
            document.getElementById("manageOrderID").textContent = orderID;

            // Reset forms and titles in modal
            hideForm(document.getElementById("add-order-product-form"));
            hideForm(document.getElementById("update-order-product-form"));
            hideTitle(document.getElementById("add-order-product-title"));
            hideTitle(document.getElementById("update-order-product-title"));

            // Populate table rows
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

                // Event listeners for row buttons
                row.querySelector(".update-product-button").addEventListener("click", (e) => {
                    console.log("data-product:", e.target.getAttribute("data-product"));
                    const productData = e.target.getAttribute("data-product");
                    const parsedProductData = JSON.parse(productData);
                    updateOrderProduct(parsedProductData);
                });
                row.querySelector(".delete-product-button").addEventListener("click", () => {
                    deleteOrderProduct(item.orderProductID, orderID);
                });
            });

            // Display order products modal for given order 
            openModal("order-products-modal");
        })
        // Handle API errors
        .catch((error) => {
            console.error("Error in fetchOrderProducts:", error);
            alert("Error loading order products. Please try again later.");
        });
}
/*
    CRUD - CREATE FUNCTIONS
*/

// Add a new order 
function createOrder() {
    const addOrderModal = document.getElementById('add-order-modal');
    const addOrderForm = document.getElementById('add-order-form'); 
    
    // Get form data
    const formData = new FormData(addOrderForm); 
    const orderData = {
        dogID: formData.get('dogID'),
        addressID: formData.get('addressID'),
        orderDate: formData.get('orderDate'),
        orderGiftNote: formData.get('orderGiftNote') || null,
        orderCustomRequest: formData.get('orderCustomRequest') || null,
        orderStatus: formData.get('orderStatus'),
        orderShippedDate: formData.get('orderShippedDate') || null,
        orderDeliveredDate: formData.get('orderDeliveredDate') || null,
    };

    // POST route for new order
    fetch("/api/orders/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
    })
        // Handle API response
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to create order: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        // Process successfully created order
        .then((data) => {
            addOrderForm.reset();
            closeModal(addOrderModal);
            fetchOrders();
        })
        // Handle API error
        .catch((error) => {
            console.error("Error in createOrder:", error);
            alert("Failed to create the order. Please try again.");
        });
}

//Add new order product
function createOrderProduct() {
    const form = document.getElementById('add-order-product-form');

    // Extract and display current orderID
    const orderID = document.getElementById("manageOrderID").textContent;

    // Get form data
    const formData = new FormData(form);
    const orderProductData = {
        orderID: orderID,
        productID: formData.get("productID"),
        orderProductRequest: formData.get("orderProductRequest") || null,
        orderProductSalePrice: parseFloat(formData.get("orderProductSalePrice")),
    };

    // POST route for new order product
    fetch("/api/order-products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderProductData),
    })
        // Handle API response
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to create order product: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        // Process successfully created order product
        .then(() => {
            fetchOrderProducts(orderID); 
            hideForm(form); 
            form.reset(); 
        })
        // Handle API error
        .catch((error) => {
            console.error("Error in createOrderProduct:", error);
            alert("Failed to create the order product. Please try again.");
        });
}

/*
    CRUD - UPDATE FUNCTIONS
*/

// Update order by ID
function updateOrder() {
    const form = document.getElementById('update-order-form');
    const orderID = document.getElementById('orderID').value; 

    // Get form data
    const formData = new FormData(form);
    const orderData = {
        addressID: formData.get("addressID"),
        orderGiftNote: formData.get("orderGiftNote") || null,
        orderCustomRequest: formData.get("orderCustomRequest") || null,
        orderStatus: formData.get("orderStatus"),
        orderShippedDate: formData.get("orderShippedDate") || null,
        orderDeliveredDate: formData.get("orderDeliveredDate") || null
    };

    // PUT route for order by ID
    fetch(`/api/orders/update/${orderID}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(orderData),
    })
        // Handle API response
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to update order: ${response.status} ${response.statusText}`);
            }
            return response.text(); 
        })
        // Process succesfully updated order
        .then(() => {
            fetchOrders(); 
            closeModal('update-order-modal'); 
        })
        // Handle API error
        .catch((error) => {
            console.error("Error updating order:", error);
            alert("Failed to update the order. Please try again.");
        });
}

// Update an order product by ID
function updateOrderProduct(orderProductData) {
    const form = document.getElementById("update-order-product-form");
    const modal = document.getElementById("order-products-modal");

    // Get form data - populate form fields
    form.querySelector("#orderProductID").value = orderProductData.orderProductID; 
    form.querySelector("#updateOrderProductRequest").value = orderProductData.orderProductRequest || "";
    form.querySelector("#updateOrderProductSalePrice").value =
        orderProductData.orderProductSalePrice !== null && orderProductData.orderProductSalePrice !== undefined
        ? orderProductData.orderProductSalePrice.toFixed(2)
        : "";
    // Get form data - populate dropdown
    const productDropdown = form.querySelector("#productID");

    // GET route for products
    fetch("/api/drop/products")
        // Handle API response
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        // Process data for product dropdown
        .then((products) => {
            productDropdown.innerHTML = '<option value="">Select a Product</option>';
    
            // Populate dropdown options
            products.forEach((product) => {
                const option = document.createElement("option");
                option.value = product.id;
                option.textContent = product.name;
                if (product.id === orderProductData.productID) {
                    option.selected = true; // Pre-select the product in the dropdown
                }
                productDropdown.appendChild(option);
            });
 
            // Display form
            showForm(form); 
            showTitle(document.getElementById("update-order-product-title"));
        })
        // Handle API error
        .catch((error) => {
            console.error("Error populating product dropdown:", error);
            alert("Failed to load product options. Please try again.");
        });

    // Process form submission
    form.onsubmit = (e) => {
        e.preventDefault(); 
    
        // Get form data
        const updatedOrderProductData = {
            productID: form.querySelector("#productID").value,
            orderProductRequest: form.querySelector("#updateOrderProductRequest").value || null,
            orderProductSalePrice: parseFloat(form.querySelector("#updateOrderProductSalePrice").value),
        };
        const orderProductID = form.querySelector("#orderProductID").value;

        // PUT route for order product by ID
        fetch(`/api/order-products/update/${orderProductID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedOrderProductData),
        })
            // Handle API response
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to update order product: ${response.status} ${response.statusText}`);
                }
                return response.text(); // Use response.text() if no JSON is returned
            })
            // Process successfully updated order product
            .then(() => {
                const orderID = document.getElementById("manageOrderID").textContent; 
                fetchOrderProducts(orderID); 
                closeModal(modal); //
            })
            // Handle API error
            .catch((error) => {
                console.error("Error updating order product:", error);
                alert("Failed to update the order product. Please try again.");
            });
    };
}
/*
    CRUD - DELETE FUNCTIONS
*/

// Delete an order by ID - confirmation message
function deleteOrder(orderID) {
    if (confirm("Are you sure you want to delete this order?")) {
        // DELETE route for order by ID
        fetch(`/api/orders/delete/${orderID}`, { method: "DELETE" })
            // Handle API response
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete order: ${response.status} ${response.statusText}");
                }
            })
            // Handle successfully deleted order
            .then(() => {
                fetchOrders(); 
            })
            // Handle API error
            .catch((error) => {
                console.error("Error in deleteOrder:", error);
                alert("Failed to delete the order. Please try again.");
            });
    }
}

//Delete an order product by ID - confirmation message
function deleteOrderProduct(orderProductID, orderID) {
    if (confirm("Are you sure you want to delete this order product?")) {
        // DELETE route for order product by ID
        fetch(`/api/order-products/delete/${orderProductID}`, { method: "DELETE" })
            // Handle API response
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to delete order product: ${response.status} ${response.statusText}`);
                }
            })
            // Process successfully deleted order product
            .then(() => {
                fetchOrderProducts(orderID);
            })
            // Handle API error
            .catch((error) => {
                console.error("Error in deleteOrderProduct:", error);
                alert("Failed to delete the order product. Please try again.");
            });
    }
}

/*
    HELPER FUNCTIONS - DROPDOWNS
*/

function populateDropdown(endpoint, dropdownID, valueKey, textKey) {
    const dropdown = document.getElementById(dropdownID);

    // GET route for dropdown data
    fetch(endpoint)
        // Handle API response
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${endpoint}: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        // Process dropdown data
        .then(data => {
            dropdown.innerHTML = '<option value="">Select an option</option>';

            // Populate dropdown with new options
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item[valueKey];
                option.textContent = item[textKey];
                dropdown.appendChild(option);
            });
        })
        // Handle API error
        .catch(error => {
            console.error(`Error populating dropdown "${dropdownID}":`, error);
        });
}

/*
    HELPER FUNCTIONS - MODALS
*/

// Manage modal for update order form
function updateOrderModal(orderID) {
    // GET route for order by ID
    fetch(`/api/orders/${orderID}`)
        // Handle API response
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch order: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        // Process data
        .then(orderData => {
            const updateOrderIDSpan = document.getElementById('updateOrderID');
            if (updateOrderIDSpan) {
                updateOrderIDSpan.textContent = orderData.orderID; // Set the order ID
            }

            // Populate form fields
            document.getElementById('orderID').value = orderData.orderID;
            document.getElementById('updateGiftNote').value = orderData.orderGiftNote || '';
            // Custom Request Dropdown
            const customRequestSelect = document.getElementById('updateCustomRequest');
            Array.from(customRequestSelect.options).forEach(option => {
                option.selected = option.value.toLowerCase() === (orderData.orderCustomRequest || '').toLowerCase();
            });

            // Order Status Dropdown
            const orderStatusSelect = document.getElementById('updateOrderStatus');
            Array.from(orderStatusSelect.options).forEach(option => {
                option.selected = option.value.toLowerCase() === (orderData.orderStatus || '').toLowerCase();
            });
            document.getElementById('updateShippedDate').value = orderData.orderShippedDate || '';
            document.getElementById('updateDeliveredDate').value = orderData.orderDeliveredDate || '';

            // Populate dropdown options
            console.log("Populating address dropdown");
            const addressDropdown = document.getElementById('updateAddressID');
            fetch('/api/drop/addresses')
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

            // Display
            openModal('update-order-modal');
        })
        // Handle API error
        .catch(error => {
            console.error("Error fetching order details:", error);
            alert("Failed to load order details. Please try again.");
        });
}

// Manage modal for order products where op.orderID = o.orderID
function orderProductModal(orderProductID, orderID) {
    // GET route for order product by ID
    fetch(`/api/order-products/${orderProductID}`)
        // Handle API response
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch order product: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        // Process data
        .then((data) => {
            const form = document.getElementById("update-order-product-form");
            form.innerHTML = ``;

            // Handle form submission
            form.onsubmit = (e) => {
                e.preventDefault();
                updateOrderProduct(orderProductID, orderID); 
            };

            // Display
            showForm(form);
        })
        // Handle API error
        .catch((error) => {
            console.error("Error fetching order product details:", error);
            alert("Failed to load order product details. Please try again later.");
        });
}

/*
    BASIC - MODAL MANAGEMENT
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

// Close modal
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
}

/*
    BASIC - FORM MANAGEMENT
*/

// Show form
function showForm(form) {
    form.classList.remove('is-hidden');
}

//Hide form
function hideForm(form) {
    form.classList.add('is-hidden'); // Add a CSS class to hide the form
}

//Show Title
function showTitle(title) {
    title.style.display = 'block'; // Show the title
}

//Hide Title
function hideTitle(title) {
    title.style.display = 'none'; // Hide the title
}
