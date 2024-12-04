<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Manage Customers</title>
    <link rel="stylesheet" type="text/css" href="/css/style.css">
    <link rel="stylesheet" type="text/css" href="/css/modal.css">
</head>
<body>
    <h1>Customer Profiles - Humans Behind the Pups</h1>
    <p>Oraganize customer information and their contact details</p>
    {{!-- Create a table --}}
    <table id="customer-table">
        {{!-- Header section --}}
        <thead>
            {{!-- For just the first row, we print each key of the row object as a header cell so we
            know what each column means when the page renders --}}
            <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Customer Actions</th>
            </tr>
        </thead>

        {{!-- Body section --}}
        <tbody>
            {{!-- For each row, print the id, fname, lname, homeworld and age, in order --}}
            {{#each data}}
            <tr data-value={{this.customerID}}>
                <td>{{this.customerID}}</td>
                <td>{{this.customerName}}</td>
                <td>{{this.customerEmail}}</td>
                <td>{{this.customerPhone}}</td>
                <td>
                    <button id="update-customer-button-{{this.customerID}}" data-customer-id="{{this.customerID}}">Update</button>
                    <button id="delete-customer-button-{{this.customerID}}" data-customer-id="{{this.customerID}}">Delete</button>
                </td>
            </tr>
            {{/each}}
        </tbody>
    </table>

    <!-- Add Customer Button -->
    <button id="add-customer-button">Add New Customer</button>

    <!-- Add Customer Modal -->
    <div id="add-customer-modal" class="modal">
        <div class="modal-content">
            <span class="close-modal" data-modal-id="add-customer-modal">&times;</span>
            <h2>Add New Customer</h2>
            <form id="add-customer-form-ajax">
                <label for="customerName">Name: </label>
                <input type="text" name="customerName" id="customerName" required> 
                
                <label for="customerEmail">Email: </label>
                <input type="text" name="customerEmail" id="customerEmail" value="example@example.com" required>

                <label for="customerPhone">Phone Number: </label>
                <input type="text" name="customerPhone" id="customerPhone" value="999-999-9999" required>

                <button type="submit">Add Customer</button>
                <button type="button" id="cancel-add-customer">Cancel Customer</button>
            </form>
        </div>
    </div>
    
    <!-- Update Customer Modal -->
    <div id="update-customer-modal" class="modal">
        <div class="modal-content">
            <span class="close-modal" data-modal-id="update-customer-modal">&times;</span>
            <h2>Customer #<span id="updateCustomerID"></span> - Update Customer</h2>
            <form id="update-customer-form-ajax">
                <input type="hidden" id="customerID" name="customerID">
                <label for="input-customerEmail">Email:</label>
                <input type="email" id="input-customerEmail" name="customerEmail" required>
                <label for="input-customerPhone">Phone:</label>
                <input type="tel" id="input-customerPhone" name="customerPhone" required>
                <button type="submit">Save</button>
                <button type="button" id="cancel-update-customer">Cancel</button>
            </form>
        </div>
    </div>

    {{!-- Embed our javascript to handle the DOM manipulation and AJAX request --}}
    <script src="./js/validate_input.js"></script>
    <script src="./js/manage_modal.js"></script>
    <script src="./js/add_customer.js"></script>
    <script src="./js/delete_customer.js"></script>
    <script src="./js/update_customer.js"></script>

</body>
</html>
