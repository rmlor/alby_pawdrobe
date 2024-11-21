// Get the objects we need to modify
let addOrderProductForm = document.getElementById("add-order-product-form-ajax");

// Modify the objects we need
addOrderProductForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderID = document.getElementById("input-orderID");
    let inputProductID = document.getElementById("input-productID");
    let inputOrderProductRequest = document.getElementById("input-orderProductRequest");
    let inputOrderProductSalePrice = document.getElementById("input-orderProductSalePrice");

    // Get the values from the form fields
    let valueOrderID = inputOrderID.value;
    let valueProductID = inputProductID.value;
    let valueOrderProductRequest = inputOrderProductRequest.value;
    let valueOrderProductSalePrice = parseFloat(inputOrderProductSalePrice.value);

    // Put our data we want to send in a JavaScript object
    let data = {
        orderID: valueOrderID,
        productID: valueProductID,
        orderProductRequest: valueOrderProductRequest,
        orderProductSalePrice: valueOrderProductSalePrice,
    };

    // Setup our AJAX request
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-order-product-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addOrderProductRowToTable(xhttp.response);

            // Clear the input fields
            inputOrderID.value = '';
            inputProductID.value = '';
            inputOrderProductRequest.value = '';
            inputOrderProductSalePrice.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.error("There was an error with the input.");
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from Order_Products
addOrderProductRowToTable = (data) => {
    let currentTable = document.getElementById("order-products-table");

    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    let row = document.createElement("TR");
    row.setAttribute("data-value", `${newRow.orderID}-${newRow.productID}`);

    row.innerHTML = `
        <td>${newRow.orderID}</td>
        <td>${newRow.productName}</td>
        <td>${newRow.orderProductRequest}</td>
        <td>${newRow.orderProductSalePrice}</td>
        <td>
            <button onclick="editOrderProduct(${newRow.orderID}, ${newRow.productID})">Edit</button>
            <button onclick="deleteOrderProduct(${newRow.orderID}, ${newRow.productID})">Delete</button>
        </td>
    `;

    currentTable.appendChild(row);
};
