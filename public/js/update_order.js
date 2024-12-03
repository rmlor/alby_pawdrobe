// Get the objects we need to modify
let updateOrderForm = document.getElementById("update-order-form-ajax");

// Modify the objects we need
updateOrderForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDogID = document.getElementById("input-dogID");
    let inputAddressID = document.getElementById("input-addressID");
    let inputOrderDate = document.getElementById("input-orderDate");
    let inputOrderGiftNote = document.getElementById("input-orderGiftNote");
    let inputOrderCustomRequest = document.getElementById("input-orderCustomRequest");

    // Get the values from the form fields
    let valueDogID = inputDogID.value;
    let valueAddressID = inputAddressID.value;
    let valueOrderDate = inputOrderDate.value;
    let valueOrderGiftNote = inputOrderGiftNote.value;
    let valueOrderCustomRequest = inputOrderCustomRequest.value;

    // Put our data we want to send in a JavaScript object
    let data = {
        dogID: valueDogID,
        addressID: valueAddressID,
        orderDate: valueOrderDate,
        orderGiftNote: valueOrderGiftNote,
        orderCustomRequest: valueOrderCustomRequest,
    };

    // Setup our AJAX request
    let xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Update the table and dropdown menu
            updateOrderRow(xhttp.response, orderIDValue);

            // Clear the form inputs
            inputOrderID.value = '';
            inputDogID.value = '';
            inputAddressID.value = '';
            inputOrderDate.value = '';
            inputOrderGiftNote.value = '';
            inputOrderCustomRequest.value = '';
            inputOrderStatus.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Updates a row in the table
updateOrderRow = (data, orderID) => {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("orders-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == orderID) {
            // Update the relevant cells in the row
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            updateRowIndex.getElementsByTagName("td")[1].innerText = parsedData.dogID;
            updateRowIndex.getElementsByTagName("td")[2].innerText = parsedData.addressID;
            updateRowIndex.getElementsByTagName("td")[3].innerText = parsedData.orderDate;
            updateRowIndex.getElementsByTagName("td")[4].innerText = parsedData.orderGiftNote;
            updateRowIndex.getElementsByTagName("td")[5].innerText = parsedData.orderCustomRequest;
            updateRowIndex.getElementsByTagName("td")[6].innerText = parsedData.orderStatus;
            break;
        }
    }
}
