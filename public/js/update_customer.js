document.addEventListener('DOMContentLoaded', () => {
    const updateCustomerForm = document.getElementById('update-customer-form-ajax');
    const updateCustomerModal = document.getElementById('update-customer-modal');

    // Attach event listeners to all Update buttons
    document.querySelectorAll('[id^="update-customer-button-"]').forEach(button => {
        button.addEventListener('click', function () {
            const customerID = this.dataset.customerId;
            openUpdateModal(customerID);
        });
    });

    // Close the modal on "Cancel" or close button
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => closeModal(button.dataset.modalId));
    });
    document.getElementById('cancel-update-customer').addEventListener('click', () => {
        updateCustomerForm.reset();
        closeModal(updateCustomerModal);
    });

    // Handle form submission for updating customer
    updateCustomerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        updateCustomer();
    });
});

/**
 * Opens the update modal and populates it with the selected customer's data.
 * @param {number} customerID - The ID of the customer to update.
 */
function openUpdateModal(customerID) {
    const table = document.getElementById('customer-table');

    for (let i = 0, row; row = table.rows[i]; i++) {
        if (row.getAttribute('data-value') == customerID) {
            // Populate the modal fields with the row data
            const email = row.getElementsByTagName('td')[2].innerText;
            const phone = row.getElementsByTagName('td')[3].innerText;

            document.getElementById('customerID').value = customerID;
            document.getElementById('input-customerEmail').value = email;
            document.getElementById('input-customerPhone').value = phone;

            // Update modal header
            const updateCustomerIDSpan = document.getElementById('updateCustomerID');
            if (updateCustomerIDSpan) {
                updateCustomerIDSpan.textContent = customerID;
            }

            openModal('update-customer-modal');
            break;
        }
    }
}

/**
 * Sends the updated customer details to the server.
 */
function updateCustomer() {
    const customerID = document.getElementById('customerID').value;
    const customerEmail = document.getElementById('input-customerEmail').value.trim();
    const customerPhone = document.getElementById('input-customerPhone').value.trim();

    // Debugging
    console.log('Customer ID:', customerID);
    console.log('Email:', customerEmail, 'Phone:', customerPhone);
    if (!customerID || isNaN(customerID)) {
        alert('Invalid Customer ID.');
        return;
    }
    // Validate input
    if (!validateEmail(customerEmail)) {
        alert('Please enter a valid email address.');
        return;
    }
    if (!validatePhoneNumber(customerPhone)) {
        alert('Please enter a valid phone number in the format 123-456-7890 or (123) 456-7890.');
        return;
    }

    const data = {
        customerID: parseInt(customerID, 10),
        customerEmail,
        customerPhone,
    };

    const xhttp = new XMLHttpRequest();
    xhttp.open('PUT', '/put-customer-ajax', true);
    xhttp.setRequestHeader('Content-type', 'application/json');

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // Update the table with the new customer data
            updateRow(xhttp.response, customerID);

            // Reset the form and close the modal
            document.getElementById('customerID').value = "";
            document.getElementById('input-customerEmail').value = "";
            document.getElementById('input-customerPhone').value = "";
            closeModal('update-customer-modal');

            alert('Customer updated successfully!');

        } else if (xhttp.readyState === 4) {
            alert('Failed to update customer. Please try again.');
            console.error('Error updating customer:', xhttp.responseText);
        }
    };

    xhttp.send(JSON.stringify(data));
}

/**
 * Updates a specific customer's row in the table.
 * @param {string} data - JSON response string containing updated customer details.
 * @param {number} customerID - The ID of the customer to update.
 */
function updateRow(data, customerID) {
    const parsedData = JSON.parse(data);
    const updatedCustomer = parsedData[0]; // Assuming the response returns the updated customer object
    const table = document.getElementById('customer-table');

    for (let i = 0, row; row = table.rows[i]; i++) {
        if (row.getAttribute('data-value') === customerID) {
            // Update customerEmail in the table
            row.cells[2].innerText = updatedCustomer.customerEmail;

            // Update customerPhone in the table
            row.cells[3].innerText = updatedCustomer.customerPhone;
            break;
        }
    }
}
