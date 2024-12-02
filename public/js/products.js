//products.js: Handles Products 

/*
    DOM Manipulation
*/

document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const addProductForm = document.getElementById('add-product-form');
    const updateProductForm = document.getElementById('update-product-form')

    const addProductModal = document.getElementById('add-product-modal');
    const updateProductModal = document.getElementById('update-product-modal')

    // Event Listeners - Handle Static Buttons
    document.getElementById('add-product-button')?.addEventListener('click', () => {
        openModal(addProductModal);
    });
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => closeModal(button.dataset.modalId));
    });
    document.getElementById('cancel-add-product').addEventListener('click', () => {
        addProductForm.reset();
        closeModal(addProductModal);
    });
    document.getElementById('cancel-update-product').addEventListener('click', () => {
        updateProductForm.reset();
        closeModal(updateProductModal);
    });

    // Event Listeners - Handle Form Submissions
    addProductForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        createProduct();
    });
    updateProductForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        updateProduct();
    });

    // Load and display data
    fetchProducts();
});

/*
    CRUD - READ FUNCTIONS
*/

function fetchProducts() {
    fetch('/api/products')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            const tbody = document.querySelector("#products-table tbody");
            tbody.innerHTML = "";

            // Populate table rows
            data.forEach((item) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.productID}</td>
                    <td>${item.productName}</td>
                    <td>${item.productDescription}</td>
                    <td>${item.productType}</td>
                    <td>${item.productColorBase}</td>
                    <td>${item.productColorStyle}</td>
                    <td>${item.productLiningMaterial}</td>
                    <td>${item.productFillingMaterial || ""}</td>
                    <td>${item.productBasePrice.toFixed(2)}</td>
                    <td>
                        <button id="update-product-button-${item.productID}" data-product-id="${item.productID}">Update</button>
                        <button id="delete-product-button-${item.productID}" data-product-id="${item.productID}">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);

                // Event listeners for row buttons
                document
                    .getElementById(`update-product-button-${item.productID}`)
                    .addEventListener("click", () => updateProductModal(item.productID));

                document
                    .getElementById(`delete-product-button-${item.productID}`)
                    .addEventListener("click", () => deleteProduct(item.productID));
            });
        })
        .catch((error) => {
            console.error("Error in fetchProducts:", error);
            alert("Error loading products. Please try again.");
        });
}
/* 
    CRUD - CREATE FUNCTIONS
*/

// Add a new product
function createProduct() {
    const addProductModal = document.getElementById('add-product-modal');
    const addProductForm = document.getElementById('add-product-form');

    // Get form data
    const formData = new FormData(addProductForm);
    const productData = {
        productName: formData.get('productName'),
        productDescription: formData.get('productDescription'),
        productType: formData.get('productType'),
        productColorBase: formData.get('productColorBase'),
        productColorStyle: formData.get('productColorStyle'),
        productLiningMaterial: formData.get('productLiningMaterial'),
        productFillingMaterial: formData.get('productFillingMaterial') || null,
        productBasePrice: parseFloat(formData.get('productBasePrice')),
    };
    // POST request to add a product
    fetch('/api/products/add', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
    })
        // Handle API response
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to create product: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        // Process product data
        .then(() => {
            addProductForm.reset();
            closeModal(addProductModal);
            fetchProducts();
        })
        // Handle API error
        .catch((error) => {
            console.error("Error in createProduct:", error);
            alert("Failed to create the product. Please try again.");
        });
}

/*
    CRUD - UPDATE FUNCTIONS
*/

// Update product by ID
function updateProduct() {
    const form = document.getElementById('update-product-form');
    const productID = document.getElementById('productID').value;

    // Get form data
    const formData = new FormData(form);
    const productData = {
        productName: formData.get('productName'),
        productDescription: formData.get('productDescription'),
        productType: formData.get('productType'),
        productColorBase: formData.get('productColorBase'),
        productColorStyle: formData.get('productColorStyle'),
        productLiningMaterial: formData.get('productLiningMaterial'),
        productFillingMaterial: formData.get('productFillingMaterial') || null,
        productBasePrice: parseFloat(formData.get('productBasePrice'))
    };

    // PUT route for product by ID
    fetch(`/api/products/update/${productID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
    })
        // Handle API response
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to update product: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        // Process product data
        .then((data) => {
            fetchProducts(); // Refresh the product list
            closeModal('update-product-modal'); // Close the modal
        })
        // Handle API error
        .catch((error) => {
            console.error("Error updating product:", error);
            alert("Failed to update the product. Please try again.");
        });
}

/*
    CRUD - DELETE FUNCTIONS
*/

// Delete an product by ID - confirmation message
function deleteProduct(productID) {
    if (confirm("Are you sure you want to delete this product?")) {
        // DELETE route for product by ID
        fetch(`/api/products/delete/${productID}`, {method: "DELETE"})
            // Handle API response
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete product: ${response.status} ${response.statusText}");
                }
                return response.json();
            })
            // Handle successfully deleted product
            .then(() => {
                fetchProducts(); 
            })
            // Handle API error
            .catch((error) => {
                console.error("Error in deleteProduct:", error);
                alert("Failed to delete the product. Please try again.");
            });
    }
}

/*
    HELPER FUNCTIONS - MODALS
*/

// Manage modal for update product form
function updateProductModal(productID) {
    // GET route for order by ID
    fetch(`/api/products/${productID}`)
        // Handle API response
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        // Process data
        .then(productData => {
            const updateProductIDSpan = document.getElementById('updateProductID');
            if (updateProductIDSpan) {
                updateProductIDSpan.textContent = productData.productID; 
            }

            // Populate form fields
            document.getElementById('productID').value = productData.productID;
            document.getElementById('updateProductName').value = productData.productName;
            document.getElementById('updateProductDescription').value = productData.productDescription;
            document.getElementById('updateProductType').value = productData.productType;
            document.getElementById('updateProductColorBase').value = productData.productColorBase;
            document.getElementById('updateProductColorStyle').value = productData.productColorStyle;
            document.getElementById('updateProductLiningMaterial').value = productData.productLiningMaterial;
            document.getElementById('updateProductFillingMaterial').value = productData.productFillingMaterial || "";
            document.getElementById('updateProductBasePrice').value = productData.productBasePrice;

            // Display
            openModal('update-product-modal');
        })
        // Handle API error
        .catch(error => {
            console.error("Error fetching product details:", error);
            alert("Failed to load product details. Please try again.");
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