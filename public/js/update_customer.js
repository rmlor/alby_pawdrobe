// Get the objects we need to modify
let updateCustomerForm = document.getElementById('update-customer-form-ajax');

// Modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerName = document.getElementById("mySelect");
    let inputCustomerEmail = document.getElementById("input-customerEmail");
    let inputCustomerPhone = document.getElementById("input-customerPhone");

    // Get the values from the form fields
    let customerNameValue = inputCustomerName.value;
    let customerEmailValue = inputCustomerEmail.value;
    let customerPhoneValue = inputCustomerPhone.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (isNaN(customerNameValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        customerName: customerNameValue,
        customerEmail: customerEmailValue,
        customerPhone: customerPhoneValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, customerNameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    console.log(JSON.stringify(data))

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, customerID){
    let parsedData = JSON.parse(data);

    console.log(data, customerID)
    
    let table = document.getElementById("customer-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == customerID) {

            // Get the location of the row where we found the matching customer ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of customerEmail value
            let td_email = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign customerEmail to our value we updated to
            td_email.innerHTML = parsedData[0].customerEmail; 

            // Get td of customerPhone value
            let td_phone = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign customerPhone to our value we updated to
            td_phone.innerHTML = parsedData[0].customerPhone; 
       }
    }
}