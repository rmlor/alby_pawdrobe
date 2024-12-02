// Validation Functions
const validateEmail = (email) => {
    const emailRegex = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
};

const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\(\d{3}\)|\d{3})(-|\s)?\d{3}(-|\s)\d{4}$/;
    return phoneRegex.test(phone);
};

// Get the objects we need to modify
let addCustomerForm = document.getElementById('add-customer-form-ajax');

// Modify the objects we need
addCustomerForm.addEventListener("submit", function (e) {
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
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from bsg_people
function addRowToTable(data) {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("customer-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let customerIDCell = document.createElement("TD");
    let customerNameCell = document.createElement("TD");
    let customerEmailCell = document.createElement("TD");
    let customerPhoneCell = document.createElement("TD");

    // Fill the cells with correct data
    customerIDCell.innerText = newRow.customerID;
    customerNameCell.innerText = newRow.customerName;
    customerEmailCell.innerText = newRow.customerEmail;
    customerPhoneCell.innerText = newRow.customerPhone;

    // Add the cells to the row
    row.appendChild(customerIDCell);
    row.appendChild(customerNameCell);
    row.appendChild(customerEmailCell);
    row.appendChild(customerPhoneCell);

    // Add the row to the table
    currentTable.appendChild(row);
}
