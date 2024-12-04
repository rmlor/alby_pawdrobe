//orders.js: Handles Orders and Order_Products

/*
    Citation for DOM Manipulation and Event Handling (Tables, Forms)
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
    Citation for CRUD Implementations
    - Date: 12/1/2024
    - Adapted from: Node.js Starter App – Steps 4, 5, 7 & 8
    - Source URLs
      1. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data
      2. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
      3. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data 
      4. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
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
