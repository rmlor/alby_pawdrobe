document.addEventListener('DOMContentLoaded', () => {
    // Attach event listeners to all Delete buttons
    document.querySelectorAll('[id^="delete-customer-button-"]').forEach(button => {
        button.addEventListener('click', function () {
            const customerID = this.dataset.customerId;
            confirmAndDeleteCustomer(customerID);
        });
    });
});

/**
* Confirms and deletes a customer by ID.
* @param {number} customerID - The ID of the customer to delete.
*/
function confirmAndDeleteCustomer(customerID) {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    const data = { id: customerID };

    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 204) {
            // Remove the row from the table
            deleteRow(customerID);
            alert("Customer deleted successfully!");
        } else if (xhttp.readyState === 4) {
            alert("Failed to delete customer. Please try again.");
            console.error("Error deleting customer:", xhttp.responseText);
        }
    };

    xhttp.send(JSON.stringify(data));
}

/**
* Removes the row of the deleted customer from the table.
* @param {number} customerID - The ID of the customer to remove.
*/
function deleteRow(customerID) {
    const table = document.getElementById("customer-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (row.getAttribute("data-value") === customerID) {
            table.deleteRow(i);
            break;
        }
    }
}
