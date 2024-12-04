document.addEventListener('DOMContentLoaded', () => {
    
    // Get the objects we need to modify
    let addCustomerForm = document.getElementById('add-customer-form-ajax');
    let addCustomerModal = document.getElementById('add-customer-modal');

    document.getElementById('add-customer-button').addEventListener('click', () => {
        openModal(addCustomerModal);
    });

    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => closeModal(button.dataset.modalId));
    });

    document.getElementById('cancel-add-customer').addEventListener('click', () => {
        addCustomerForm.reset();
        closeModal(addCustomerModal);
    });

    addCustomerForm?.addEventListener("submit", function (e) {
        // Prevent the form from submitting
        e.preventDefault();
    
        // Get form fields we need to get data from
        let inputCustomerName = document.getElementById("customerName");
        let inputCustomerEmail = document.getElementById("customerEmail");
        let inputCustomerPhone = document.getElementById("customerPhone");
    
        // Get the values from the form fields
        let customerNameValue = inputCustomerName.value.trim();
        let customerEmailValue = inputCustomerEmail.value.trim();
        let customerPhoneValue = inputCustomerPhone.value.trim();
    
        // Validate inputs
        if (!customerNameValue) {
            alert("Customer name is required.");
            return;
        }
        if (!validateEmail(customerEmailValue)) {
            alert("Please enter a valid email address.");
            return;
        }
        if (!validatePhoneNumber(customerPhoneValue)) {
            alert("Please enter a valid phone number in the format 123-456-7890 or (123) 456-7890.");
            return;
        }
    
        // Put our data we want to send in a JavaScript object
        let data = {
            customerName: customerNameValue,
            customerEmail: customerEmailValue,
            customerPhone: customerPhoneValue
        };
    
        console.log("Data being sent to server:", data);
    
        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/add-customer-ajax", true);
        xhttp.setRequestHeader("Content-type", "application/json");
    
        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                // Add the new data to the table
                addRowToTable(xhttp.response);
    
                // Alert success
                alert("Customer added successfully!");
    
                // Clear the input fields for another transaction
                inputCustomerName.value = '';
                inputCustomerEmail.value = '';
                inputCustomerPhone.value = '';
                closeModal(addCustomerModal); // Close the modal
            } else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.");
            }
        };
    
        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    });
});

// Creates a single row from an Object representing a single record from bsg_people
function addRowToTable(data) {
    // Get a reference to the current table on the page
    const currentTable = document.getElementById("customer-table").querySelector("tbody");

    // Parse the JSON data and extract the last object (newly added row)
    const parsedData = JSON.parse(data);
    const newRow = parsedData[parsedData.length - 1];

    // Create a new table row
    const row = document.createElement("tr");
    row.setAttribute("data-value", newRow.customerID);

    // Create table cells
    const customerIDCell = document.createElement("td");
    const customerNameCell = document.createElement("td");
    const customerEmailCell = document.createElement("td");
    const customerPhoneCell = document.createElement("td");
    const actionsCell = document.createElement("td");

    // Fill the cells with the correct data
    customerIDCell.innerText = newRow.customerID;
    customerNameCell.innerText = newRow.customerName;
    customerEmailCell.innerText = newRow.customerEmail;
    customerPhoneCell.innerText = newRow.customerPhone;

    // Create Update and Delete buttons
    const updateButton = document.createElement("button");
    updateButton.id = `update-customer-button-${newRow.customerID}`;
    updateButton.dataset.customerId = newRow.customerID;
    updateButton.innerText = "Update";
    updateButton.addEventListener("click", () => fetchCustomerDetails(newRow.customerID));

    const deleteButton = document.createElement("button");
    deleteButton.id = `delete-customer-button-${newRow.customerID}`;
    deleteButton.dataset.customerId = newRow.customerID;
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", () => deleteRow(newRow.customerID));

    // Add buttons to the actions cell
    actionsCell.appendChild(updateButton);
    actionsCell.appendChild(deleteButton);

    // Append the cells to the row
    row.appendChild(customerIDCell);
    row.appendChild(customerNameCell);
    row.appendChild(customerEmailCell);
    row.appendChild(customerPhoneCell);
    row.appendChild(actionsCell);

    // Add the row to the table body
    currentTable.appendChild(row);
}
