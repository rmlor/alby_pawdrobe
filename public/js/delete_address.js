document.addEventListener('DOMContentLoaded', () => {
    // Attach event listeners to all Delete buttons
    document.querySelectorAll('[id^="delete-address-button-"]').forEach(button => {
        button.addEventListener('click', function () {
            const addressID = this.dataset.addressId;
            confirmAndDeleteAddress(addressID);
        });
    });
});

/**
 * Confirms and deletes an address by ID.
 * @param {number} addressID - The ID of the address to delete.
 */
function confirmAndDeleteAddress(addressID) {
    if (!confirm("Are you sure you want to delete this address?")) return;

    const data = { id: addressID };

    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-address-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 204) {
            // Remove the row from the table
            deleteAddressRow(addressID);
        } else if (xhttp.readyState === 4) {
            alert("Failed to delete address. Please try again.");
            console.error("Error deleting address:", xhttp.responseText);
        }
    };

    xhttp.send(JSON.stringify(data));
}

/**
 * Removes the row of the deleted address from the table.
 * @param {number} addressID - The ID of the address to remove.
 */
function deleteAddressRow(addressID) {
    const table = document.getElementById("addresses-table");
    for (let i = 0, row; (row = table.rows[i]); i++) {
        if (row.getAttribute("data-value") === addressID) {
            table.deleteRow(i);
            break;
        }
    }
}
