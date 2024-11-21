// Function to handle delete requests
deleteOrderProduct = (orderID, productID) => {
    let data = {
        orderID: orderID,
        productID: productID,
    };

    let xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-order-product-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            deleteOrderProductRow(orderID, productID);
        } else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.error("There was an error with the input.");
        }
    };

    xhttp.send(JSON.stringify(data));
};

// Removes the corresponding row from the table
deleteOrderProductRow = (orderID, productID) => {
    let table = document.getElementById("order-products-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == `${orderID}-${productID}`) {
            table.deleteRow(i);
            break;
        }
    }
};
