// Get the objects we need to modify
let addOrderForm = document.getElementById("add-order-form-ajax");

// Modify the objects we need
addOrderForm.addEventListener("submit", function (e) {
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
    xhttp.open("POST", "/add-orders-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle the AJAX response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addOrderRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputDogID.value = '';
            inputAddressID.value = '';
            inputOrderDate.value = '';
            inputOrderGiftNote.value = '';
            inputOrderCustomRequest.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.error("There was an error with the input.");
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from Orders
addOrderRowToTable = (data) => {
    // Get a reference to the current table on the page
    let currentTable = document.getElementById("orders-table");

    // Get the new row from the database query response
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a new table row
    let row = document.createElement("TR");
    row.setAttribute('data-value', newRow.orderID); // Assign custom data attribute for deletion

    // Populate the row with cells
    row.innerHTML = `
        <td>${newRow.orderID}</td>
        <td>${newRow.dogName}</td>
        <td>${newRow.customerName}</td>
        <td>${newRow.address}</td>
        <td>${newRow.orderDate}</td>
        <td>${newRow.orderGiftNote}</td>
        <td>${newRow.orderCustomRequest}</td>
        <td>${newRow.orderStatus}</td>
        <td>${newRow.orderShippedDate || 'N/A'}</td>
        <td>${newRow.orderDeliveredDate || 'N/A'}</td>
        <td>
            <button onclick="openProductModal(${newRow.orderID})">View Products</button>
        </td>
        <td>
            <button onclick="openOrderModal('edit', ${newRow.orderID})">Edit</button>
            <button onclick="confirmDeleteOrderModal(${newRow.orderID})">Delete</button>
        </td>
    `;

    // Add the row to the table
    currentTable.appendChild(row);
};

addOrderToDropDown = (newRow) => {
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");

    // Customize the text for the dropdown option
    option.text = `Order ${newRow.id}: Dog ${newRow.dogID} - Address ${newRow.addressID}`;
    option.value = newRow.id;

    // Add the new option to the dropdown menu
    selectMenu.add(option);
};