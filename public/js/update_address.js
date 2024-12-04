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

            document.getElementById('addressID').value = addressID;
            document.getElementById('input-streetAddress-update').value = streetAddress;
            document.getElementById('input-unit-update').value = unit;
            document.getElementById('input-city-update').value = city;
            document.getElementById('input-state-update').value = state;
            document.getElementById('input-postalCode-update').value = postalCode;

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
