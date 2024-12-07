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