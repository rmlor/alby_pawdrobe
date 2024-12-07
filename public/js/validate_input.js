/*
Citation for Email Validation Helper Function
Date: December 2, 2024
Adapted from: StackOverflow
Source URL: https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
Adaptation Details: The original regex pattern for comprehensive email validation was retained and the implementation was simplified by wrapping it in an ES6 arrow function for readability and modularity.
*/

/*
Citation for Phone Number Validation Helper Function
Date: December 2, 2024
Adapted from: StackOverflow
Source URL: https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript
Adaptation Details: The original regex pattern for comprehensive phone validation was retained and the implementation was simplified by wrapping it in an ES6 arrow function for readability and modularity.
*/

function populateDropdown(endpoint, dropdownID, valueKey, textKey) {
    const dropdown = document.getElementById(dropdownID);

    // GET route for dropdown data
    fetch(endpoint)
        // Handle API response
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${endpoint}: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        // Process dropdown data
        .then(data => {
            dropdown.innerHTML = '<option value="">Select an option</option>';

            // Populate dropdown with new options
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item[valueKey];
                option.textContent = item[textKey];
                dropdown.appendChild(option);
            });
        })
        // Handle API error
        .catch(error => {
            console.error(`Error populating dropdown "${dropdownID}":`, error);
        });
}

// Validation Functions
const validateEmail = (email) => {
    const emailRegex = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
};

const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\(\d{3}\)|\d{3})(-|\s)?\d{3}(-|\s)\d{4}$/;
    return phoneRegex.test(phone);
};