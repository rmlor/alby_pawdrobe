// Get the objects we need to modify
let addAddressForm = document.getElementById('add-address-form-ajax');

// Modify the objects we need
addAddressForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerID = document.getElementById("input-customerID");
    let inputStreetAddress = document.getElementById("input-streetAddress");
    let inputUnit = document.getElementById("input-unit");
    let inputCity = document.getElementById("input-city");
    let inputState = document.getElementById("input-state");
    let inputPostalCode = document.getElementById("input-postalCode");

    console.log(inputCustomerID)

    // Get the values from the form fields
    let customerIDValue = inputCustomerID.value;
    let streetAddressValue = inputStreetAddress.value;
    let unitValue = inputUnit.value;
    let cityValue = inputCity.value;
    let stateValue = inputState.value;
    let postalCodeValue = inputPostalCode.value;


    // Put our data we want to send in a javascript object
    let data = {
        customerID: customerIDValue,
        streetAddress: streetAddressValue,
        unit: unitValue,
        city: cityValue,
        state: stateValue,
        postalCode: postalCodeValue
    }
    
    console.log(data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-address-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCustomerID.value = '';
            inputStreetAddress.value = '';
            inputUnit.value = '';
            inputCity.value = '';
            inputState.value = '';
            inputPostalCode.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from Addresses
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("addresses-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let addressIDCell = document.createElement("TD");
    let customerIDCell = document.createElement("TD");
    let streetAddressCell = document.createElement("TD");
    let unitCell = document.createElement("TD");
    let cityCell = document.createElement("TD");
    let stateCell = document.createElement("TD");
    let postalCodeCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    addressIDCell.innerText = newRow.addressID;
    customerIDCell.innerText = newRow.customerID;
    streetAddressCell.innerText = newRow.streetAddress;
    unitCell.innerText = newRow.unit;
    cityCell.innerText = newRow.city;
    stateCell.innerText = newRow.state;
    postalCodeCell.innerText = newRow.postalCode;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteAddress(newRow.addressID);
        deleteAddress(newRow.addressID);
    };

    // Add the cells to the row 
    row.appendChild(addressIDCell);
    row.appendChild(customerIDCell);
    row.appendChild(streetAddressCell);
    row.appendChild(unitCell);
    row.appendChild(cityCell);
    row.appendChild(stateCell);
    row.appendChild(postalCodeCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.addressID);
    
    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("selectAddress");
    let option = document.createElement("option");
    option.text = newRow.streetAddress+ ', ' +  newRow.unit + ', ' +  newRow.city + ', ' +  newRow.state + ', ' +  newRow.postalCode;
    option.value = newRow.addressID;
    selectMenu.add(option);


}
