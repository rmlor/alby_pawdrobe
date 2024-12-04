*
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
    - Adapted from:
      1. Web Development Course Modules: Writing Asynchronous Code & Routing and API Responses
      2. Node.js Starter App – Steps 4, 5, 7 & 8
    - Source URLs
      1. https://canvas.oregonstate.edu/courses/1967288/pages/exploration-writing-asynchronous-code?module_item_id=24465423 
      2. https://canvas.oregonstate.edu/courses/1967288/pages/exploration-routing-and-forms?module_item_id=24465437 
      3. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data
      4. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
      5. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data 
      6. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
    - Adaptation Details: lient-side use of `fetch()` for sending requests to API routes and handling responses was adapted from the Web Development modules, and integration of CRUD logic into the frontend using dynamic tables and forms was informed by both the repository.
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
    const addBreedForm = document.getElementById('add-breed-form');
    const updateBreedForm = document.getElementById('update-breed-form');

    const addBreedModal = document.getElementById('add-breed-modal');
    const updateBreedModal = document.getElementById('update-breed-modal');

    // Event Listeners - Handle Static Buttons
    document.getElementById('add-breed-button')?.addEventListener('click', () => {
        addBreedForm.reset();
        openModal(addBreedModal);
    });
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => closeModal(button.dataset.modalId));
    });
    document.getElementById('cancel-add-breed').addEventListener('click', () => {
        addBreedForm.reset();
        closeModal(addBreedModal);
    });
    document.getElementById('cancel-update-breed').addEventListener('click', () => {
        updateBreedForm.reset();
        closeModal(updateBreedModal);
    });

    // Event Listeners - Handle Form Submissions
    addBreedForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        createBreed();
    });
    updateBreedForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        updateBreed();
    });

    // Load and display data
    fetchBreeds();
});

/*
    CRUD - READ FUNCTIONS
*/

function fetchBreeds() {
    fetch('/api/breeds')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch breeds: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Fetched breeds:", data);
            const tbody = document.querySelector("#breeds-table tbody");
            tbody.innerHTML = "";

            // Populate table rows
            data.forEach((item) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.breedID}</td>
                    <td>${item.breedName}</td>
                    <td>${item.breedCoatType}</td>
                    <td>${item.breedShedLevel}</td>
                    <td>
                        <button id="update-breed-button-${item.breedID}" data-breed-id="${item.breedID}">Update</button>
                        <button id="delete-breed-button-${item.breedID}" data-breed-id="${item.breedID}">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);

                // Event listeners for row buttons
                document
                    .getElementById(`update-breed-button-${item.breedID}`)
                    .addEventListener("click", () => updateBreedModal(item.breedID));

                document
                    .getElementById(`delete-breed-button-${item.breedID}`)
                    .addEventListener("click", () => deleteBreed(item.breedID));
            });
        })
        .catch((error) => {
            console.error("Error in fetchBreeds:", error);
            alert("Error loading breeds. Please try again.");
        });
}

/*
    CRUD - CREATE FUNCTIONS
*/

// Add a new breed
function createBreed() {
    const addBreedModal = document.getElementById('add-breed-modal');
    const addBreedForm = document.getElementById('add-breed-form');

    // Get form data
    const formData = new FormData(addBreedForm);
    const breedData = {
        breedName: formData.get('breedName'),
        breedCoatType: formData.get('breedCoatType'),
        breedShedLevel: formData.get('breedShedLevel')
    };

    // POST request to add a breed
    fetch(`/api/breeds/add`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(breedData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to create breed: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(() => {
            addBreedForm.reset();
            closeModal(addBreedModal);
            fetchBreeds();
        })
        .catch((error) => {
            console.error("Error in createBreed:", error);
            alert("Failed to create the breed. Please try again.");
        });
}

/*
    CRUD - UPDATE FUNCTIONS
*/

// Update breed by ID
function updateBreed() {
    const form = document.getElementById('update-breed-form');
    const breedID = document.getElementById('breedID').value;

    // Get form data
    const formData = new FormData(form);
    const breedData = {
        breedName: formData.get('breedName'),
        breedCoatType: formData.get('breedCoatType'),
        breedShedLevel: formData.get('breedShedLevel')
    };

    // PUT route for breed by ID
    fetch(`/api/breeds/update/${breedID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(breedData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to update breed: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(() => {
            console.log("Update successful!");
            fetchBreeds();
            closeModal('update-breed-modal');
        })
        .catch((error) => {
            console.error("Error updating breed:", error);
            alert("Failed to update the breed. Please try again.");
        });
}

/*
    CRUD - DELETE FUNCTIONS
*/

// Delete a breed by ID - confirmation message
function deleteBreed(breedID) {
    if (confirm("Are you sure you want to delete this breed?")) {
        // DELETE route for breed by ID
        fetch(`/api/breeds/delete/${breedID}`, { method: "DELETE" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to delete breed: ${response.status} ${response.statusText}`);
                }
            })
            .then(() => {
                fetchBreeds();
            })
            .catch((error) => {
                console.error("Error in deleteBreed:", error);
                alert("Failed to delete the breed. Please try again.");
            });
    }
}

/*
    HELPER FUNCTIONS - MODALS
*/

function updateBreedModal(breedID) {
    fetch(`/api/breeds/${breedID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch breed: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(breedData => {
            const updateBreedIDSpan = document.getElementById('updateBreedID');
            if (updateBreedIDSpan) {
                updateBreedIDSpan.textContent = breedData.breedID; 
            }
            console.log("Fetched breed data:", breedData); // Log the fetched data

            document.getElementById('breedID').value = breedData.breedID;
            document.getElementById('updateBreedName').value = breedData.breedName;
            const coatTypeSelect = document.getElementById('updateBreedCoatType');
            Array.from(coatTypeSelect.options).forEach(option => {
                option.selected = option.value.toLowerCase() === breedData.breedCoatType.toLowerCase();
            });
            const shedLevelSelect = document.getElementById('updateBreedShedLevel');
            Array.from(shedLevelSelect.options).forEach(option => {
                option.selected = option.value.toLowerCase() === breedData.breedShedLevel.toLowerCase();
            });

            // Debugging log after assignment
            console.log("Selected Coat Type:", coatTypeSelect.value);
            console.log("Selected Shed Level:", shedLevelSelect.value);

            openModal('update-breed-modal');
        })
        .catch(error => {
            console.error("Error fetching breed details:", error);
            alert("Failed to load breed details. Please try again.");
        });
}
