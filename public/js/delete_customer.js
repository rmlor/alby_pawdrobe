/*
    Citation for DOM Manipulation and Event Handling (Tables, Forms)
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
