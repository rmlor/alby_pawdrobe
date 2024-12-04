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

                alert('Address added successfully!');
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
    const addressIDCell = document.createElement('td');
    const customerIDCell = document.createElement('td');
    const customerNameCell = document.createElement('td');
    const streetAddressCell = document.createElement('td');
    const unitCell = document.createElement('td');
    const cityCell = document.createElement('td');
    const stateCell = document.createElement('td');
    const postalCodeCell = document.createElement('td');
    const actionsCell = document.createElement('td');

    // Fill the cells with the correct data
    addressIDCell.innerText = newRow.addressID;
    customerIDCell.innerText = newRow.customerID;
    customerNameCell.innerText = newRow.customerName;
    streetAddressCell.innerText = newRow.streetAddress;
    unitCell.innerText = newRow.unit || 'N/A';
    cityCell.innerText = newRow.city;
    stateCell.innerText = newRow.state;
    postalCodeCell.innerText = newRow.postalCode;

    // Create Update and Delete buttons
    const updateButton = document.createElement('button');
    updateButton.id = `update-address-button-${newRow.addressID}`;
    updateButton.dataset.addressId = newRow.addressID;
    updateButton.innerText = 'Update';
    updateButton.addEventListener('click', () => openUpdateAddressModal(newRow.addressID));

    const deleteButton = document.createElement('button');
    deleteButton.id = `delete-address-button-${newRow.addressID}`;
    deleteButton.dataset.addressId = newRow.addressID;
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => confirmAndDeleteAddress(newRow.addressID));

    // Add buttons to the actions cell
    actionsCell.appendChild(updateButton);
    actionsCell.appendChild(deleteButton);

    // Append cells to the row
    row.appendChild(addressIDCell);
    row.appendChild(customerIDCell);
    row.appendChild(customerNameCell);
    row.appendChild(streetAddressCell);
    row.appendChild(unitCell);
    row.appendChild(cityCell);
    row.appendChild(stateCell);
    row.appendChild(postalCodeCell);
    row.appendChild(actionsCell);

    // Append row to the table
    currentTable.appendChild(row);

    console.log("Row added successfully:", row); // Debugging successful row addition
}