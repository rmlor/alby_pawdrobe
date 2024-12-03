// Get the objects we need to modify
let updateAddressForm = document.getElementById('update-address-form-ajax');

// Modify the objects we need
updateAddressForm.addEventListener("submit", function (e) {
   
    console.log('Form submitted');

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputAddressID = document.getElementById("selectAddress");
    let inputStreetAddress = document.getElementById("input-streetAddress-update");
    let inputUnit = document.getElementById("input-unit-update");
    let inputCity = document.getElementById("input-city-update");
    let inputState = document.getElementById("input-state-update");
    let inputPostalCode = document.getElementById("input-postalCode-update");


    // Get the values from the form fields
    let addressIDValue = inputAddressID.value;
    let streetAddressValue = inputStreetAddress.value;
    let unitValue = inputUnit.value;
    let cityValue = inputCity.value;
    let stateValue = inputState.value;
    let postalCodeValue = inputPostalCode.value;

    console.log("Address ID:", inputAddressID.value); 
    console.log("Street Address:", inputStreetAddress.value); 
    console.log("Unit:", inputUnit.value); 
    console.log("City:", inputCity.value); 
    console.log("State:", inputState.value); 
    console.log("Postal Code:", inputPostalCode.value);
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (isNaN(unitValue)) 
    {
        unitValue = 'NULL';
    }

    // Put our data we want to send in a javascript object
    let data = {
        addressID: addressIDValue,
        streetAddress: streetAddressValue,
        unit: unitValue,
        city: cityValue,
        state: stateValue,
        postalCode: postalCodeValue,
    }

    console.log(data)
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open('PUT', '/put-address-ajax', true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, addressIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, addressID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("addresses-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == addressID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of street address value
            let td_streetAddress = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign street address  to our value we updated to
            td_streetAddress.innerHTML = parsedData[0].streetAddress; 

            // Get td of unit value
            let td_unit = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign unit to our value we updated to
            td_unit.innerHTML = parsedData[0].unit; 

            // Get td of city value
            let td_city = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign city to our value we updated to
            td_city.innerHTML = parsedData[0].city; 

            // Get td of state value
            let td_state = updateRowIndex.getElementsByTagName("td")[5];

            // Reassign state to our value we updated to
            td_state.innerHTML = parsedData[0].state; 

            // Get td of postal code value
            let td_postalCode = updateRowIndex.getElementsByTagName("td")[6];

            // Reassign postal code to our value we updated to
            td_postalCode.innerHTML = parsedData[0].postalCode; 
       }
    }
}