// Car Workshop Appointment System - Client-side JavaScript

// Sample mechanics data (in real application, this would come from backend)
const mechanics = [
    { id: 1, name: "John Smith", specialization: "Engine Specialist", available_slots: 2 },
    { id: 2, name: "Sarah Johnson", specialization: "Transmission Expert", available_slots: 4 },
    { id: 3, name: "Mike Wilson", specialization: "Electrical Systems", available_slots: 1 },
    { id: 4, name: "Lisa Brown", specialization: "Brake Specialist", available_slots: 3 },
    { id: 5, name: "David Lee", specialization: "General Mechanic", available_slots: 0 }
];

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Appointment page JavaScript loaded!');
    
    loadMechanics();
    setMinDate();
    setupFormValidation();

});

// Load mechanics availability display
function loadMechanics() {
    const mechanicsList = document.getElementById('mechanics-list');
    const mechanicSelect = document.getElementById('mechanic');
    
    if (mechanicsList) {
        mechanicsList.innerHTML = '';
        mechanics.forEach(mechanic => {
            const card = createMechanicCard(mechanic);
            mechanicsList.appendChild(card);
        });
    }
    
    if (mechanicSelect) {
        mechanicSelect.innerHTML = '<option value="">Choose a mechanic...</option>';
        mechanics.forEach(mechanic => {
            if (mechanic.available_slots > 0) {
                const option = document.createElement('option');
                option.value = mechanic.id;
                option.textContent = `${mechanic.name} - ${mechanic.specialization} (${mechanic.available_slots} slots available)`;
                mechanicSelect.appendChild(option);
            }
        });
    }
}

// Create mechanic card element
function createMechanicCard(mechanic) {
    const card = document.createElement('div');
    card.className = 'mechanic-card';
    
    let availabilityClass = 'available';
    let availabilityText = `${mechanic.available_slots}/4 slots available`;
    
    if (mechanic.available_slots === 0) {
        availabilityClass = 'full';
        availabilityText = 'Fully booked';
    } else if (mechanic.available_slots <= 1) {
        availabilityClass = 'limited';
        availabilityText = `Only ${mechanic.available_slots} slot available`;
    }
    
    card.innerHTML = `
        <div class="mechanic-name">${mechanic.name}</div>
        <div class="mechanic-specialization">${mechanic.specialization}</div>
        <div class="availability ${availabilityClass}">${availabilityText}</div>
    `;
    
    return card;
}

// Set minimum date to today
function setMinDate() {
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('appointmentForm');
    if (!form) return;
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
    });
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
}

// Validate individual field
function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch(fieldName) {
        case 'client_name':
            if (!value) {
                errorMessage = 'Name is required';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
                isValid = false;
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                errorMessage = 'Name should only contain letters and spaces';
                isValid = false;
            }
            break;
            
        case 'address':
            if (!value) {
                errorMessage = 'Address is required';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Please provide a complete address';
                isValid = false;
            }
            break;
            
        case 'phone':
            if (!value) {
                errorMessage = 'Phone number is required';
                isValid = false;
            } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(value)) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
            break;
            
        case 'car_license':
            if (!value) {
                errorMessage = 'Car license number is required';
                isValid = false;
            } else if (value.length < 3) {
                errorMessage = 'License number seems too short';
                isValid = false;
            }
            break;
            
        case 'car_engine':
            if (!value) {
                errorMessage = 'Car engine number is required';
                isValid = false;
            } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
                errorMessage = 'Engine number should only contain letters and numbers';
                isValid = false;
            }
            break;
            
        case 'appointment_date':
            if (!value) {
                errorMessage = 'Appointment date is required';
                isValid = false;
            } else {
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    errorMessage = 'Cannot book appointments for past dates';
                    isValid = false;
                }
                
                // Check if it's Sunday (workshop closed)
                if (selectedDate.getDay() === 0) {
                    errorMessage = 'Workshop is closed on Sundays';
                    isValid = false;
                }
            }
            break;
            
        case 'mechanic_id':
            if (!value) {
                errorMessage = 'Please select a mechanic';
                isValid = false;
            }
            break;
    }
    
    showFieldError(field, isValid ? '' : errorMessage);
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    const errorId = getErrorId(field.name);
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.textContent = message;
        field.classList.toggle('error-field', !!message);
    }
}

// Clear field error
function clearError(field) {
    const errorId = getErrorId(field.name);
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.textContent = '';
        field.classList.remove('error-field');
    }
}

// Get error element ID for field
function getErrorId(fieldName) {
    const errorMap = {
        'client_name': 'nameError',
        'address': 'addressError',
        'phone': 'phoneError',
        'car_license': 'licenseError',
        'car_engine': 'engineError',
        'appointment_date': 'dateError',
        'mechanic_id': 'mechanicError'
    };
    
    return errorMap[fieldName] || fieldName + 'Error';
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    console.log('📝 Form submitted!');
    
    const form = e.target;
    const formData = new FormData(form);
    let isFormValid = true;
    
    // Log form data
    console.log('📋 Form data:');
    for (let [key, value] of formData.entries()) {
        console.log(`  ${key}: ${value}`);
    }
    
    // Validate all fields
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        console.log('❌ Form validation failed');

        showMessage('Please correct the errors above', 'error');
        return;
    }
    
    console.log('✅ Form validation passed');

    
    // Check for duplicate appointments (client-side check)
    const appointmentDate = formData.get('appointment_date');
    const mechanicId = formData.get('mechanic_id');
    
    // Submit to server
    submitAppointment(formData);
}

// Submit appointment to server
function submitAppointment(formData) {
    console.log('📤 Submitting appointment to ultra_simple.php...');
    
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Booking...';
    submitBtn.disabled = true;
    
    // Create XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'ultra_simple.php', true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    
                    if (response.success) {
                        console.log('🎉 Appointment booked successfully!', response);
                        

                        
                        showMessage('Appointment booked successfully! Appointment ID: ' + response.appointment_id, 'success');
                        document.getElementById('appointmentForm').reset();
                        setMinDate();
                        
                        // Update mechanic availability
                        const mechanicId = parseInt(formData.get('mechanic_id'));
                        const mechanic = mechanics.find(m => m.id === mechanicId);
                        if (mechanic && mechanic.available_slots > 0) {
                            mechanic.available_slots--;
                            loadMechanics(); // Refresh mechanics display
                        }
                    } else {
                        console.log('❌ Booking failed:', response);
                        

                        
                        let errorMsg = 'Booking failed: ';
                        if (response.errors && response.errors.length > 0) {
                            errorMsg += response.errors.join(', ');
                        } else {
                            errorMsg += 'Unknown error occurred';
                        }
                        showMessage(errorMsg, 'error');
                    }
                } catch (e) {
                    console.error('Response parsing error:', e);
                    console.log('Raw response:', xhr.responseText);
                    showMessage('Error: Invalid server response. Check console for details.', 'error');
                }
            } else {
                console.error('HTTP Error:', xhr.status, xhr.statusText);
                console.log('Response:', xhr.responseText);
                showMessage('Server error (HTTP ' + xhr.status + '). Check console for details.', 'error');
            }
        }
    };
    
    xhr.onerror = function() {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showMessage('Network error. Please check your connection and try again.', 'error');
    };
    
    // Send the form data
    xhr.send(formData);
}

// Show message to user
function showMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    const messageText = document.getElementById('messageText');
    
    if (messageContainer && messageText) {
        messageText.textContent = message;
        messageContainer.className = `message-container ${type}`;
        messageContainer.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 5000);
        
        // Scroll to message
        messageContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

// Utility function to check appointment conflicts
function checkAppointmentConflict(date, mechanicId) {
    // In a real application, this would check against the database
    // For now, we'll simulate some conflicts
    const conflicts = [
        { date: '2025-12-05', mechanicId: 1 },
        { date: '2025-12-06', mechanicId: 2 }
    ];
    
    return conflicts.some(conflict => 
        conflict.date === date && conflict.mechanicId === parseInt(mechanicId)
    );
}

// Format date for display
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Export functions for potential use in other scripts
window.AppointmentSystem = {
    validateField,
    showMessage,
    formatDate,
    mechanics
};