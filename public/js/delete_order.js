// Function to handle delete requests
deleteOrder = (orderID) => {
    // Put our data we want to send in a JavaScript object
    let data = {
        id: orderID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // Remove the row from the table
            deleteOrderRow(orderID);
        } else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.");
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

// Function to remove a row from the table
deleteOrderRow = (orderID) => {
    // Find the table
    let table = document.getElementById("orders-table");

    // Iterate through rows to find the matching row by data-value attribute
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == orderID) {
            table.deleteRow(i);
            break;
        }
    }
}

// Function to handle the delete modal confirmation
openDeleteOrderModal =(orderID) => {
    let modal = document.getElementById("deleteModal");
    modal.style.display = "block";

    // Set the "Yes" button to confirm deletion
    let confirmDeleteButton = document.getElementById("confirmDeleteButton");
    confirmDeleteButton.onclick = function () {
        deleteOrder(orderID);
        closeModal("deleteModal");
    };
}

// Function to close the modal
closeModal = (modalId) => {
    let modal = document.getElementById(modalId);
    modal.style.display = "none";
}

deleteOrderFromDropDown = (personID) => {
    let dropdown = document.getElementById("orderSelectDropdown"); 

    for (let i = 0; i < dropdown.options.length; i++) {
        if (Number(dropdown.options[i].value) === Number(orderID)) {
            dropdown.remove(i);
            break;
        }
    }
}