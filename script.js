const form = document.getElementById('staffForm');
const requiredInputs = form.querySelectorAll('[required]');
const notificationBar = document.getElementById('notification-bar');
const confirmModal = document.getElementById('confirmModal');

// --- Validation Logic ---
function showError(input, message) {
    const formGroup = input.parentElement;
    const errorDisplay = formGroup.querySelector('.error-message');
    errorDisplay.innerText = message; 
    errorDisplay.style.display = 'block';
    input.classList.add('invalid');
}

function showSuccess(input) {
    const formGroup = input.parentElement;
    const errorDisplay = formGroup.querySelector('.error-message');
    errorDisplay.style.display = 'none';
    input.classList.remove('invalid');
}

function validateInput(input) {
    if (!input.checkValidity()) {
        if (input.validity.valueMissing) {
            showError(input,`${input.labels[0].textContent.replace(' *','')} is required.`);
        } else {
            showError(input, input.validationMessage);
        }
        return false;
    }
    showSuccess(input);
    return true;
}

// --- Event Listeners ---
form.addEventListener('submit', function(e) {
    e.preventDefault();
    let firstInvalidInput = null;
    let isFormValid = true;

    requiredInputs.forEach(input => {
        if (!validateInput(input)) {
            if (!firstInvalidInput) {
                firstInvalidInput = input;
             }
            isFormValid = false;
        }
    });

    if (isFormValid) {
        showNotification('Staff registration successful!', 'success');
        // Submit logic (e.g., fetch/AJAX) goes here
    } else {
        showNotification('Please correct the errors before submitting.', 'error');
        if (firstInvalidInput) {
            firstInvalidInput.focus();
            firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

requiredInputs.forEach(input => {
    input.addEventListener('blur', () => {
        validateInput(input);
    });
});

// --- Notification ---
function showNotification(message, type = 'success') {
    notificationBar.textContent = message;
    notificationBar.className = `notification-bar ${type}`;
    notificationBar.classList.add('show');
    setTimeout(() => {
        notificationBar.classList.remove('show');
    }, 3000);
}

// --- Clear Form with Confirmation ---
function confirmClear() {
    showConfirmModal('Are you sure you want to clear all fields?', () => {
        form.reset();
        requiredInputs.forEach(input => showSuccess(input));
        document.getElementById('photo-preview').style.display = 'none';
        showNotification('Form cleared.', 'success');
    });
}

// --- Confirmation Modal Logic ---
function showConfirmModal(message, onConfirmCallback) {
    const modalMessage = confirmModal.querySelector('#modalMessage');
    const confirmBtn = confirmModal.querySelector('#modalConfirm');
    const cancelBtn = confirmModal.querySelector('#modalCancel');

    modalMessage.textContent = message;
    confirmModal.classList.add('visible');

    const confirmHandler = () => {
        onConfirmCallback();
        hideConfirmModal();
        confirmBtn.removeEventListener('click', confirmHandler);
        cancelBtn.removeEventListener('click', cancelHandler);
    };

    const cancelHandler = () => {
        hideConfirmModal();
        confirmBtn.removeEventListener('click', confirmHandler);
        cancelBtn.removeEventListener('click', cancelHandler);
    };

    confirmBtn.addEventListener('click', confirmHandler);
    cancelBtn.addEventListener('click', cancelHandler);
}

function hideConfirmModal() {
    confirmModal.classList.remove('visible');
}

// --- Photo Preview ---
const photoInput = document.getElementById('profilePhoto');
const photoPreview = document.getElementById('photo-preview');
photoInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            photoPreview.src = e.target.result;
            photoPreview.style.display = 'block';
        };
        reader.readAsDataURL(this.files[0]);
    }
});
