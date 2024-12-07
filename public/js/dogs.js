//Dogs.js: Handles Dogs and Dog_Breeds

/*
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
    // DOM elements
    const addDogForm = document.getElementById('add-dog-form');
    const addDogBreedForm = document.getElementById('add-dog-breed-form');;
    const updateDogForm = document.getElementById('update-dog-form');
    const updateDogBreedForm = document.getElementById('update-dog-breed-form');

    const addDogBreedTitle = document.getElementById("add-dog-breed-title");
    const updateDogBreedTitle = document.getElementById("update-dog-breed-title");
    const addDogModal = document.getElementById('add-dog-modal');
    const updateDogModal = document.getElementById('update-dog-modal')

    // Event Listeners - Handle Static Buttons
    document.getElementById('add-dog-button')?.addEventListener('click', () => {
        openModal(addDogModal);
    });
    document.getElementById('add-dog-breed-button')?.addEventListener('click', () => {
        showForm(addDogBreedForm);
        showTitle(addDogBreedTitle);
    });
    document.getElementById('cancel-add-dog').addEventListener('click', () => {
        addDogForm.reset();
        closeModal(addDogModal);
    });
    document.getElementById('cancel-update-dog').addEventListener('click', () => {
        updateDogForm.reset();
        closeModal(updateDogModal);
    });
    document.getElementById('cancel-add-dog-breed').addEventListener('click', () => {
        addDogBreedForm.reset();
        hideForm(addDogBreedForm)
        hideTitle(addDogBreedTitle)
    });
    document.getElementById('cancel-update-dog-breed').addEventListener('click', () => {
        updateDogBreedForm.reset();
        hideForm(updateDogBreedForm);
        hideTitle(updateDogBreedTitle)
    });

    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => closeModal(button.dataset.modalId));
    });

    // Event Listeners - Handle Form Submissions
    addDogForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        createDog();
    });
    addDogBreedForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        createDogBreed();
    });
    updateDogForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        updateDog();
    });
    updateDogBreedForm?.addEventListener('submit', (e) => {
        e.preventDefault();
    
        // Get form data
        const form = document.getElementById("update-dog-breed-form");
        const dogBreedID = document.querySelector("#dogBreedID").value;

        if (!form) {
            console.error("Form not found at page load.");
        }
        if (!dogBreedID) {
            console.error("No dog breed ID provided.");
            alert("Please select a valid dog breed ID.");
            return;
        }
    
        // GET route for dog breed by ID
        fetch(`/api/dog-breeds/${dogBreedID}`)
            .then((response) => {
                console.log("Dog breed API response:", response);
                if (!response.ok) {
                    throw new Error(`Failed to fetch dog breeds: ${response.statusText}`);
                }
                return response.json();
            })
            .then((dogBreedData) => {
                console.log("Dog breed data:", dogBreedData);
                if (!dogBreedData || !dogBreedData.dogBreedID || !dogBreedData.breedID) {
                    throw new Error("Invalid dog breed data received.");
                }
                updateDogBreed(dogBreedData); 
            })
            .catch((error) => {
                console.error("Error fetching dog breed data:", error);
                alert("Failed to load dog breed data. Please try again.");
            });
    });
});
    // Load and display data
    fetchDogs();                                                                       // Dogs table
    populateDropdown('/api/drop/customers', 'customerID', 'id', 'name');               // customerID for Dogs management
    populateDropdown('/api/drop/breeds', 'breedID', 'id', 'name');                     // breedID for Dog management

/* 
    CRUD - READ FUNCTIONS 
*/

// Load and display all dogs 
function fetchDogs() {
    // GET route (dogs)
    fetch('/api/dogs')
        // Handle API response
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch dogs: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        // Process and render dogs data (API to TABLE)
        .then((data) => {
            const tbody = document.querySelector("#dogs-table tbody");
            tbody.innerHTML = ""; // Clear existing table rows

            // Populate table rows
            data.forEach((item) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.dogID}</td>
                    <td>${item.customerID}</td>
                    <td>${item.dogName}</td>
                    <td>${item.customerName}</td>
                    <td>${item.upperNeckGirthIn}</td>
                    <td>${item.lowerNeckGirthIn}</td>
                    <td>${item.chestGirthIn}</td>
                    <td>${item.backLengthIn}</td>
                    <td>${item.heightLengthIn}</td>
                    <td>${item.pawWidthIn}</td>
                    <td>${item.pawLengthIn}</td>
                    <td>
                        <button id="manage-dog-button-${item.dogID}" data-dog-id="${item.dogID}">Manage</button>
                    </td>
                    <td>
                        <button id="update-dog-button-${item.dogID}" data-dog-id="${item.dogID}">Update</button>
                        <button id="delete-dog-button-${item.dogID}" data-dog-id="${item.dogID}">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);

                // Event listeners for row buttons
                document
                    .getElementById(`manage-dog-button-${item.dogID}`)
                    .addEventListener("click", () => {
                        if (!item.dogID) {
                            console.error("Dog ID is undefined or null for item:", item);
                            return;
                        }
                        fetchDogBreeds(item.dogID);
                    });

                document
                    .getElementById(`update-dog-button-${item.dogID}`)
                    .addEventListener("click", () => updateDogModal(item.dogID));

                document
                    .getElementById(`delete-dog-button-${item.dogID}`)
                    .addEventListener("click", () => deleteDog(item.dogID));
            });
        })
        // Handle API error
        .catch((error) => {
            console.error("Error in fetchDogs:", error);
            alert("Error loading dogs. Please try again.");
        });
}

// Load and display all dog breeds for a given dog
function fetchDogBreeds(dogID) {
    // GET route (dog breeds for a given dogID)
    fetch(`/api/dogs/${dogID}/breeds`)
        // Handle API response
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch dog breeds: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        // Process and render dog breeds data
        .then((data) => {
            console.log("Received dog breeds data:", data); // Debugging log

            const tbody = document.querySelector("#dog-breeds-table tbody");
            if (!tbody) {
                console.error("Table body not found. Check your HTML structure.");
                return;
            }

            // Clear existing rows
            tbody.innerHTML = "";

            // Update "Manage Dog ID" header
            document.getElementById("manageDogID").textContent = dogID;

            // Reset forms and titles in modal
            hideForm(document.getElementById("add-dog-breed-form"));
            hideForm(document.getElementById("update-dog-breed-form"));
            hideTitle(document.getElementById("add-dog-breed-title"));
            hideTitle(document.getElementById("update-dog-breed-title"));

            // Populate rows with received data
            data.forEach((item) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.dogBreedID}</td>
                    <td>${item.dogID}</td>
                    <td>${item.breedID} (${item.breedName || "Unknown"})</td>
                    <td>
                        <button class="update-breed-button" data-breed='${JSON.stringify(item)}'>Update</button>
                        <button class="delete-breed-button" data-dog-breed-id="${item.dogBreedID}" data-dog-id="${dogID}">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);

                // Attach event listeners to buttons
                row.querySelector(".update-breed-button").addEventListener("click", (e) => {
                    const breedData = e.target.getAttribute("data-breed");
                    updateDogBreed(JSON.parse(breedData)); // Parse and pass data
                });

                row.querySelector(".delete-breed-button").addEventListener("click", () => {
                    deleteDogBreed(item.dogBreedID, dogID);
                });
            });

            // Display modal
            openModal("dog-breeds-modal");
        })
        // Handle API errors
        .catch((error) => {
            console.error("Error in fetchDogBreeds:", error);
            alert("Error loading dog breeds. Please try again later.");
        });
}

/*
    CRUD - CREATE FUNCTIONS
*/

// Add a new dog
function createDog() {
    const addDogModal = document.getElementById('add-dog-modal');
    const addDogForm = document.getElementById('add-dog-form'); 
    
    // Get form data
    const formData = new FormData(addDogForm); 
    const dogData = {
        customerID: formData.get('customerID'),
        dogName: formData.get('dogName'),
        upperNeckGirthIn: formData.get('upperNeckGirthIn'),
        lowerNeckGirthIn: formData.get('lowerNeckGirthIn'),
        chestGirthIn: formData.get('chestGirthIn'),
        backLengthIn: formData.get('backLengthIn'),
        heightLengthIn: formData.get('heightLengthIn'),
        pawWidthIn: formData.get('pawWidthIn'),
        pawLengthIn: formData.get('pawLengthIn')
    };

    // POST route for new dog
    fetch("/api/dogs/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dogData),
    })
        // Handle API response
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to create dog: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        // Process successfully created dog
        .then((data) => {
            addDogForm.reset();
            closeModal(addDogModal);
            fetchDogs();
        })
        // Handle API error
        .catch((error) => {
            console.error("Error in createDog:", error);
            alert("Failed to create the dog. Please try again.");
        });
}

//Add new dog breed
function createDogBreed() {
    const form = document.getElementById('add-dog-breed-form');

    // Extract and display current dogID
    const dogID = document.getElementById("manageDogID").textContent;

    // Get form data
    const formData = new FormData(form);
    const dogBreedData = {
        dogID: dogID,
        breedID: formData.get("breedID")
    };

    // POST route for new dog breed
    fetch("/api/dog-breeds/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dogBreedData),
    })
        // Handle API response
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to create dog breed: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        // Process successfully created dog breed
        .then(() => {
            fetchDogBreeds(dogID); 
            hideForm(form); 
            form.reset(); 
        })
        // Handle API error
        .catch((error) => {
            console.error("Error in createDogBreed:", error);
            alert("Failed to create the dog breed. Please try again.");
        });
}

/*
    CRUD - UPDATE FUNCTIONS
*/

// Update dog by ID
function updateDog() {
    const form = document.getElementById('update-dog-form');
    const dogID = document.getElementById('dogID').value; 

    // Get form data
    const formData = new FormData(form);
    const dogData = {
        dogName: formData.get('dogName'),
        upperNeckGirthIn: formData.get('upperNeckGirthIn'),
        lowerNeckGirthIn: formData.get('lowerNeckGirthIn'),
        chestGirthIn: formData.get('chestGirthIn'),
        backLengthIn: formData.get('backLengthIn'),
        heightLengthIn: formData.get('heightLengthIn'),
        pawWidthIn: formData.get('pawWidthIn'),
        pawLengthIn: formData.get('pawLengthIn')
    };

    // PUT route for dog by ID
    fetch(`/api/dogs/update/${dogID}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dogData),
    })
        // Handle API response
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to update dog: ${response.status} ${response.statusText}`);
            }
            return response.text(); 
        })
        // Process succesfully updated dog
        .then(() => {
            fetchDogs(); 
            closeModal('update-dog-modal'); 
        })
        // Handle API error
        .catch((error) => {
            console.error("Error updating dog:", error);
            alert("Failed to update the dog. Please try again.");
        });
}

// Update an dog breed by ID
function updateDogBreed(dogBreedData) {
    console.log("dogBreedData received:", dogBreedData);

    const form = document.getElementById("update-dog-breed-form");
    const modal = document.getElementById("dog-breeds-modal");
    if (!form) {
        console.error("Form with ID 'update-dog-breed-form' not found.");
        return;
    }

    // Get form data - populate form fields
    form.querySelector("#dogBreedID").value = dogBreedData.dogBreedID; 
    form.querySelector("#updateBreedID").value = dogBreedData.breedID;
    
    // Get form data - populate dropdown
    const breedDropdown = form.querySelector("#updateBreedID");

    const dogBreedIDField = form.querySelector("#dogBreedID");
    if (!dogBreedIDField) {
        console.error("Field with ID 'dogBreedID' not found in form.");
        return;
    }
    if (!breedDropdown) {
        console.error("Field with ID 'breedID' not found in form.");
        return;
    }

    // GET route for breeds
    fetch("/api/drop/breeds")
        // Handle API response
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch breeds: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        // Process data for breeds dropdown
        .then((breeds) => {
            breedDropdown.innerHTML = '<option value="">Select a Breed</option>';
    
            // Populate dropdown options
            breeds.forEach((breed) => {
                const option = document.createElement("option");
                option.value = breed.id;
                option.textContent = breed.name;
                if (breed.id === dogBreedData.breedID) {
                    option.selected = true; 
                }
                breedDropdown.appendChild(option);
            });
 
            // Display form
            showForm(form); 
            showTitle(document.getElementById("update-dog-breed-title"));
        })
        // Handle API error
        .catch((error) => {
            console.error("Error populating breed dropdown:", error);
            alert("Failed to load breed options. Please try again.");
        });

    // Process form submission
    form.onsubmit = (e) => {
        e.preventDefault(); 
    
        // Get form data
        const updatedDogBreedData = {
            breedID: form.querySelector("#updateBreedID").value,
        };
        const dogBreedID = form.querySelector("#dogBreedID").value;

        // PUT route for dog breed by ID
        fetch(`/api/dog-breeds/update/${dogBreedID}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(updatedDogBreedData),
        })
            // Handle API response
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to update dog breed: ${response.status} ${response.statusText}`);
                }
                return response.text(); // Use response.text() if no JSON is returned
            })
            // Process successfully updated dog breed
            .then(() => {
                const dogID = document.getElementById("manageDogID").textContent; 
                fetchDogBreeds(dogID); 
                closeModal(modal); 
            })
            // Handle API error
            .catch((error) => {
                console.error("Error updating dog breed:", error);
                alert("Failed to update the dog breed. Please try again.");
            });
    };
}
/*
    CRUD - DELETE FUNCTIONS
*/

// Delete an dog by ID - confirmation message
function deleteDog(dogID) {
    if (confirm("Are you sure you want to delete this pup?")) {
        // DELETE route for dog by ID
        fetch(`/api/dogs/delete/${dogID}`, {method: "DELETE"})
            // Handle API response
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete dog: ${response.status} ${response.statusText}");
                }
            })
            // Handle successfully deleted dog
            .then(() => {
                fetchDogs(); 
            })
            // Handle API error
            .catch((error) => {
                console.error("Error in deleteDog:", error);
                alert("Failed to delete the dog. Please try again.");
            });
    }
}

//Delete an dog breed by ID - confirmation message
function deleteDogBreed(dogBreedID, dogID) {
    if (confirm("Are you sure you want to delete this dog breed?")) {
        // DELETE route for dog breed by ID
        fetch(`/api/dog-breeds/delete/${dogBreedID}`, {method: "DELETE"})
            // Handle API response
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to delete dog breed: ${response.status} ${response.statusText}`);
                }
            })
            // Process successfully deleted dog breed
            .then(() => {
                fetchDogBreeds(dogID);
            })
            // Handle API error
            .catch((error) => {
                console.error("Error in deleteDogBreed:", error);
                alert("Failed to delete the dog breed. Please try again.");
            });
    }
}

/*
    HELPER FUNCTIONS - DROPDOWNS
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

/*
    HELPER FUNCTIONS - MODALS
*/

// Manage modal for update dog form
function updateDogModal(dogID) {
    // GET route for dogby ID
    fetch(`/api/dogs/${dogID}`)
        // Handle API response
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch dog: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        // Process data
        .then(dogData => {
            const updateDogIDSpan = document.getElementById('updateDogID');
            if (updateDogIDSpan) {
                updateDogIDSpan.textContent = dogData.dogID; 
            }

            // Populate form fields
            document.getElementById('dogID').value = dogData.dogID;
            document.getElementById('dogName').value = dogData.dogName;
            document.getElementById('updateDogName').value = dogData.dogName;
            document.getElementById('updateUpperNeckGirthIn').value = dogData.upperNeckGirthIn;
            document.getElementById('updateLowerNeckGirthIn').value = dogData.lowerNeckGirthIn;
            document.getElementById('updateChestGirthIn').value = dogData.chestGirthIn;
            document.getElementById('updateBackLengthIn').value = dogData.backLengthIn;
            document.getElementById('updateHeightLengthIn').value = dogData.heightLengthIn;
            document.getElementById('updatePawWidthIn').value = dogData.pawWidthIn;
            document.getElementById('updatePawLengthIn').value = dogData.pawLengthIn;

            // Display
            openModal('update-dog-modal');
        })
        // Handle API error
        .catch(error => {
            console.error("Error fetching dog details:", error);
            alert("Failed to load dog details. Please try again.");
        });
}

// Manage modal for dog breed where db.dogID = d.dogID
function dogBreedModal(dogBreedID, dogID) {
    // GET route for dog breed by ID
    fetch(`/api/dog-breeds/${dogBreedID}`)
        // Handle API response
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch dog breed: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        // Process data
        .then((data) => {
            console.log("Dog breed data:", data);
            const form = document.getElementById("update-dog-breed-form");
            form.innerHTML = ``;

            // Handle form submission
            form.onsubmit = (e) => {
                e.preventDefault();
                updateDogBreed(dogBreedID, breedID); 
            };

            // Display
            showForm(form);
        })
        // Handle API error
        .catch((error) => {
            console.error("Error fetching dog breed details:", error);
            alert("Failed to load dog breed details. Please try again later.");
        });
}

/*
    BASIC - MODAL MANAGEMENT
*/

// Open Modal
function openModal(modal) {
    if (typeof modal === "string") {
        modal = document.getElementById(modal);
    }
    if (!modal) {
        console.error("Modal element not found!");
        return;
    }
    modal.style.display = "block";
    modal.classList.add("is-active");
}

// Close modal
function closeModal(modal) {
    if (typeof modal === "string") {
        modal = document.getElementById(modal);
    }
    if (!modal) {
        console.error("Modal element not found!");
        return;
    }
    modal.style.display = "none";
    modal.classList.remove("is-active");
}

/*
    BASIC - FORM MANAGEMENT
*/

// Show form
function showForm(form) {
    form.classList.remove('is-hidden');
}

//Hide form
function hideForm(form) {
    form.classList.add('is-hidden'); // Add a CSS class to hide the form
}

//Show Title
function showTitle(title) {
    title.style.display = 'block'; // Show the title
}

//Hide Title
function hideTitle(title) {
    title.style.display = 'none'; // Hide the title
}
