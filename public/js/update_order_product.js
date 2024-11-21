// Get the objects we need to modify
let updateOrderProductForm = document.getElementById("update-order-product-form-ajax");

// Modify the objects we need
updateOrderProductForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let inputOrderID = document.getElementById("update-orderID");
    let inputProductID = document.getElementById("update-productID");
    let inputOrderProductRequest = document.getElementById("update-orderProductRequest");
    let inputOrderProductSalePrice = document.getElementById("update-orderProductSalePrice");

    let valueOrderID = inputOrderID.value;
    let valueProductID = inputProductID.value;
    let valueOrderProductRequest = inputOrderProductRequest.value;
    let valueOrderProductSalePrice = parseFloat(inputOrderProductSalePrice.value);

    let data = {
        orderID: valueOrderID,
        productID: valueProductID,
        orderProductRequest: valueOrderProductRequest,
        orderProductSalePrice: valueOrderProductSalePrice,
    };

    let xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-order-product-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            updateOrderProductRow(xhttp.response, valueOrderID, valueProductID);
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.error("There was an error with the input.");
        }
    };

    xhttp.send(JSON.stringify(data));
});

// Updates a row in the table
updateOrderProductRow = (data, orderID, productID) => {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("order-products-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == `${orderID}-${productID}`) {
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            updateRowIndex.getElementsByTagName("td")[2].innerText = parsedData.orderProductRequest;
            updateRowIndex.getElementsByTagName("td")[3].innerText = parsedData.orderProductSalePrice;
            break;
        }
    }
};
