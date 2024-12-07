document.addEventListener('DOMContentLoaded', () => {
    const addAddressForm = document.getElementById('add-address-form-ajax');
    const addAddressModal = document.getElementById('add-address-modal');

    // Open Add Address Modal
    document.getElementById('add-address-button').addEventListener('click', () => {
        openModal(addAddressModal);
    });

    // Close Modal on Cancel or Close Button
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => closeModal(button.dataset.modalId));
    });
    document.getElementById('cancel-add-address').addEventListener('click', () => {
        addAddressForm.reset();
        closeModal(addAddressModal);
    });

    // Handle Add Address Form Submission
    addAddressForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form fields
        const inputCustomerID = document.getElementById('input-customerID');
        const inputStreetAddress = document.getElementById('input-streetAddress');
        const inputUnit = document.getElementById('input-unit');
        const inputCity = document.getElementById('input-city');
        const inputState = document.getElementById('input-state');
        const inputPostalCode = document.getElementById('input-postalCode');

        // Get values
        const customerIDValue = inputCustomerID.value.trim();
        const streetAddressValue = inputStreetAddress.value.trim();
        const unitValue = inputUnit.value.trim();
        const cityValue = inputCity.value.trim();
        const stateValue = inputState.value.trim();
        const postalCodeValue = inputPostalCode.value.trim();

        // Validation
        if (!customerIDValue) {
            alert('Customer ID is required.');
            return;
        }
        if (!streetAddressValue) {
            alert('Street Address is required.');
            return;
        }
        if (!cityValue) {
            alert('City is required.');
            return;
        }
        if (!stateValue) {
            alert('State is required.');
            return;
        }
        if (!postalCodeValue || isNaN(postalCodeValue)) {
            alert('Valid Postal Code is required.');
            return;
        }

        // Prepare data to send
        const data = {
            customerID: customerIDValue,
            streetAddress: streetAddressValue,
            unit: unitValue,
            city: cityValue,
            state: stateValue,
            postalCode: postalCodeValue,
        };

        console.log('Data being sent to server:', data);

        // Setup AJAX Request
        const xhttp = new XMLHttpRequest();
        xhttp.open('POST', '/add-address-ajax', true);
        xhttp.setRequestHeader('Content-type', 'application/json');

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                // Add the new data to the table
                addRowToTable(xhttp.response);

                // Clear the form and close the modal
                inputCustomerID.value = '';
                inputStreetAddress.value = '';
                inputUnit.value = '';
                inputCity.value = '';
                inputState.value = '';
                inputPostalCode.value = '';
                
                closeModal(addAddressModal);
            } else if (xhttp.readyState === 4 && xhttp.status !== 200) {
                console.log('There was an error with the input.');
            }
        };

        // Send the request
        xhttp.send(JSON.stringify(data));
    });
});

function addRowToTable(data) {
    const currentTable = document.getElementById('addresses-table').querySelector('tbody');
    const parsedData = JSON.parse(data);
    const newRow = parsedData[0]; // Fetch the first item from the parsed array

    console.log("Parsed Data:", parsedData); // Debugging parsed data
    if (!newRow) {
        console.error("No new row data found in the server response.");
        return;
    }

    // Create a new table row
    const row = document.createElement('tr'); // Correctly define 'row'
    row.setAttribute('data-value', newRow.addressID);

    // Create table cells
    row.innerHTML = `
        <td>${newRow.addressID}</td>
        <td>${newRow.customerID}</td>
        <td>${newRow.customerName}</td> <!-- This ensures customerName is correctly placed -->
        <td>${newRow.streetAddress}</td>
        <td>${newRow.unit || 'N/A'}</td>
        <td>${newRow.city}</td>
        <td>${newRow.state}</td>
        <td>${newRow.postalCode}</td>
        <td>
            <button id="update-address-button-${newRow.addressID}" data-address-id="${newRow.addressID}">Update</button>
            <button id="delete-address-button-${newRow.addressID}" data-address-id="${newRow.addressID}">Delete</button>
        </td>
    `;

    currentTable.appendChild(row);

    console.log("Row added successfully:", row); // Debugging successful row addition
}
