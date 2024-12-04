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
    const updateAddressForm = document.getElementById('update-address-form-ajax');
    const updateAddressModal = document.getElementById('update-address-modal');

    // Attach event listeners to all Update buttons
    document.querySelectorAll('[id^="update-address-button-"]').forEach(button => {
        button.addEventListener('click', function () {
            const addressID = this.dataset.addressId;
            if (addressID) {
                openUpdateAddressModal(addressID);
            } else {
                console.error("Address ID is missing on the button.");
            }
        });
    });

    // Close the modal on "Cancel" or close button
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => closeModal(button.dataset.modalId));
    });

    document.getElementById('cancel-update-address').addEventListener('click', () => {
        if (updateAddressForm) {
            updateAddressForm.reset();
        }
        closeModal(updateAddressModal);
    });

    // Handle form submission for updating an address
    if (updateAddressForm) {
        updateAddressForm.addEventListener('submit', function (e) {
            e.preventDefault();
            updateAddress();
        });
    }
});
/**
 * Opens the update modal and populates it with the selected address's data.
 * @param {number} addressID - The ID of the address to update.
 */
function openUpdateAddressModal(addressID) {
    const table = document.getElementById('addresses-table');

    if (!table) {
        console.error("Table element with ID 'addresses-table' not found.");
        return;
    }

    for (let i = 0, row; (row = table.rows[i]); i++) {
        if (row.getAttribute('data-value') == addressID) {
            const streetAddress = row.cells[3]?.innerText || '';
            const unit = row.cells[4]?.innerText || '';
            const city = row.cells[5]?.innerText || '';
            const state = row.cells[6]?.innerText || '';
            const postalCode = row.cells[7]?.innerText || '';

            // Update modal fields
            document.getElementById('addressID').value = addressID;
            document.getElementById('input-streetAddress-update').value = streetAddress;
            document.getElementById('input-unit-update').value = unit;
            document.getElementById('input-city-update').value = city;
            document.getElementById('input-state-update').value = state;
            document.getElementById('input-postalCode-update').value = postalCode;

            // Update modal header
            const updateAddressIDSpan = document.getElementById('updateAddressID');
            if (updateAddressIDSpan) {
                updateAddressIDSpan.textContent = addressID;
            }

            openModal('update-address-modal');
            return; // Exit the loop
        }
    }

    console.error(`No row found for address ID: ${addressID}`);
}

/**
 * Sends the updated address details to the server.
 */
function updateAddress() {
    const addressID = document.getElementById('addressID').value.trim();
    const streetAddress = document.getElementById('input-streetAddress-update').value.trim();
    const unit = document.getElementById('input-unit-update').value.trim();
    const city = document.getElementById('input-city-update').value.trim();
    const state = document.getElementById('input-state-update').value.trim();
    const postalCode = document.getElementById('input-postalCode-update').value.trim();

    // Debugging
    console.log('Address ID:', addressID);
    console.log('Street Address:', streetAddress, 'Unit:', unit, 'City:', city, 'State:', state, 'Postal Code:', postalCode);

    if (!addressID || isNaN(addressID)) {
        alert('Invalid Address ID.');
        return;
    }
    if (!streetAddress) {
        alert('Street Address is required.');
        return;
    }
    if (!city) {
        alert('City is required.');
        return;
    }
    if (!state) {
        alert('State is required.');
        return;
    }
    if (!postalCode || isNaN(postalCode)) {
        alert('Valid Postal Code is required.');
        return;
    }

    const data = {
        addressID: parseInt(addressID, 10),
        streetAddress,
        unit: unit || null, // Allow null if no unit provided
        city,
        state,
        postalCode,
    };

    const xhttp = new XMLHttpRequest();
    xhttp.open('PUT', '/put-address-ajax', true);
    xhttp.setRequestHeader('Content-type', 'application/json');

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {

            // Update the table with the new address data
            updateAddressRow(xhttp.response, addressID);

            // Reset the form and close the modal
            document.getElementById('addressID').value = '';
            document.getElementById('input-streetAddress-update').value = '';
            document.getElementById('input-unit-update').value = '';
            document.getElementById('input-city-update').value = '';
            document.getElementById('input-state-update').value = '';
            document.getElementById('input-postalCode-update').value = '';
            closeModal('update-address-modal');

            alert('Address updated successfully!');
        } else if (xhttp.readyState === 4) {
            alert('Failed to update address. Please try again.');
            console.error('Error updating address:', xhttp.responseText);
        }
    };

    xhttp.send(JSON.stringify(data));
}

/**
 * Updates a specific address's row in the table.
 * @param {string} data - JSON response string containing updated address details.
 * @param {number} addressID - The ID of the address to update.
 */
function updateAddressRow(data, addressID) {
    const parsedData = JSON.parse(data);
    const updatedAddress = parsedData[0]; // Assuming the response returns the updated address object
    const table = document.getElementById('addresses-table');

    for (let i = 0, row; (row = table.rows[i]); i++) {
        if (row.getAttribute('data-value') == addressID) {
            // Update the table with the new data
            row.cells[2].innerText = updatedAddress.streetAddress;
            row.cells[3].innerText = updatedAddress.unit || 'N/A';
            row.cells[4].innerText = updatedAddress.city;
            row.cells[5].innerText = updatedAddress.state;
            row.cells[6].innerText = updatedAddress.postalCode;
            break;
        }
    }
}
