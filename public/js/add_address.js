/*
    Citation for DOM Manipulation and Event Handling (Dropdowns, Tables, Forms)
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
    Citation for API Usage and CRUD Implementations
    - Date: 12/1/2024
    - Adapted from: Node.js Starter App – Steps 4, 5, 7 & 8
    - Source URLs
      1.  https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data
      2. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
      3. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data 
      4. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
    - Adaptation Details: Integration of CRUD logic into the frontend using dynamic tables and forms was informed by both the repository.
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
