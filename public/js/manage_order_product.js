let manageOrderID = null;

function openManageProductsModal(orderID) {
    console.log("Opening Manage Products Modal for Order ID:", orderID);
    manageOrderID = orderID;

    document.getElementById("manage-orderID").innerText = orderID;
    document.getElementById("manageProductsModal").style.display = "block";
    document.getElementById("modalOverlay").style.display = "block";

    fetchPurchasedProducts(orderID);
}


// Close the Manage Products Modal
function closeManageProductsModal() {
    document.getElementById("manageProductsModal").style.display = "none";
    document.getElementById("modalOverlay").style.display = "none";
    manageOrderID = null;
}

// Fetch Purchased Products
function fetchPurchasedProducts(orderID) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", `/orders/${orderID}/products`, true);

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            console.log("Response:", xhttp.responseText);
            if (xhttp.status == 200) {
                let products = JSON.parse(xhttp.responseText);
                populatePurchasedProductsTable(products);
            } else {
                console.error("Failed to fetch products:", xhttp.responseText);
            }
        }
    };

    xhttp.send();
}
// Populate Purchased Products Table
function populatePurchasedProductsTable(products) {
    let tableBody = document.getElementById("purchased-products-table").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    products.forEach((product) => {
        let row = document.createElement("TR");

        let cellProductID = document.createElement("TD");
        let cellProductName = document.createElement("TD");
        let cellRequest = document.createElement("TD");
        let cellSalePrice = document.createElement("TD");
        let cellEdit = document.createElement("TD");
        let cellDelete = document.createElement("TD");

        cellProductID.innerText = product.productID;
        cellProductName.innerText = product.productName;
        cellRequest.innerText = product.orderProductRequest;
        cellSalePrice.innerText = product.orderProductSalePrice;

        let editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.onclick = function () {
            openEditProductModal(product.orderProductID);
        };

        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.onclick = function () {
            deletePurchasedProduct(product.orderProductID);
        };

        cellEdit.appendChild(editButton);
        cellDelete.appendChild(deleteButton);

        row.appendChild(cellProductID);
        row.appendChild(cellProductName);
        row.appendChild(cellRequest);
        row.appendChild(cellSalePrice);
        row.appendChild(cellEdit);
        row.appendChild(cellDelete);

        tableBody.appendChild(row);
    });
}

// Add Purchased Product
let addPurchasedProductForm = document.getElementById("add-purchased-product-form-ajax");
addPurchasedProductForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let productID = document.getElementById("input-productID").value;
    let request = document.getElementById("input-orderProductRequest").value;
    let salePrice = document.getElementById("input-orderProductSalePrice").value;

    let data = {
        orderID: manageOrderID,
        productID: productID,
        orderProductRequest: request,
        orderProductSalePrice: salePrice,
    };

    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", `/orders/${manageOrderID}/products/add`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            fetchPurchasedProducts(manageOrderID); // Refresh table
        }
    };

    xhttp.send(JSON.stringify(data));
});
