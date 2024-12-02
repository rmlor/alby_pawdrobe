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
let updateCustomerForm = document.getElementById('update-customer-form-ajax');

// Modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerName = document.getElementById("mySelect");
    let inputCustomerEmail = document.getElementById("input-customerEmail");
    let inputCustomerPhone = document.getElementById("input-customerPhone");

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
        customerPhone: customerPhoneValue,
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Update the table with new data
            updateRow(xhttp.response, customerNameValue);

            // Show success confirmation message
            alert("Customer updated successfully!");

            // Clear the form for the next transaction
            inputCustomerEmail.value = '';
            inputCustomerPhone.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Pre-Populate Update Form with Current Row Info
document.getElementById("mySelect").addEventListener("change", function () {
    let selectedCustomerID = this.value;
    let table = document.getElementById("customer-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == selectedCustomerID) {
            let email = row.getElementsByTagName("td")[2].innerText;
            let phone = row.getElementsByTagName("td")[3].innerText;

            document.getElementById("input-customerEmail").value = email;
            document.getElementById("input-customerPhone").value = phone;

            break;
        }
    }
});

function updateRow(data, customerID) {
    let parsedData = JSON.parse(data);
    let table = document.getElementById("customer-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == customerID) {
            // Get the location of the row where we found the matching customer ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Update customerEmail in the table
            let td_email = updateRowIndex.getElementsByTagName("td")[2];
            td_email.innerHTML = parsedData[0].customerEmail;

            // Update customerPhone in the table
            let td_phone = updateRowIndex.getElementsByTagName("td")[3];
            td_phone.innerHTML = parsedData[0].customerPhone;
        }
    }
}
