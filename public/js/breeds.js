// breeds.js: Handles Breeds

/*
    Citation for DOM Manipulation and Event Handling (Dropdowns, Tables, Forms)
    - Adapted from products.js
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
            const coatTypeSelect = document.getElementById('updateBreedCoatType').value = breedData.breedCoatType;
            const shedLevelSelect = document.getElementById('updateBreedShedLevel').value = breedData.breedShedLevel;

            coatTypeSelect.value = breedData.breedCoatType.toLowerCase();
            shedLevelSelect.value = breedData.breedShedLevel.toLowerCase();
            setTimeout(() => {
                console.log("Check field values after assignment:");
                console.log("breedName:", document.getElementById('breedName').value);
                console.log("breedCoatType:", document.getElementById('breedCoatType').value);
                console.log("breedShedLevel:", document.getElementById('breedShedLevel').value);
            }, 100);

            openModal('update-breed-modal');
        })
        .catch(error => {
            console.error("Error fetching breed details:", error);
            alert("Failed to load breed details. Please try again.");
        });
}
