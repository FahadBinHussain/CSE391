// Car Workshop Admin Panel JavaScript

let appointments = [];
let currentEditId = null;
let currentDeleteId = null;

// Sample mechanics data (same as in appointment.js)
const mechanics = [
    { id: 1, name: "John Smith", specialization: "Engine Specialist" },
    { id: 2, name: "Sarah Johnson", specialization: "Transmission Expert" },
    { id: 3, name: "Mike Wilson", specialization: "Electrical Systems" },
    { id: 4, name: "Lisa Brown", specialization: "Brake Specialist" },
    { id: 5, name: "David Lee", specialization: "General Mechanic" }
];

// Sample appointments data (in real app, this comes from database)
const sampleAppointments = [
    {
        id: 1,
        client_name: "Alice Johnson",
        address: "123 Main St, City",
        phone: "+1-234-567-8901",
        car_license: "ABC123",
        car_engine: "ENG456789",
        appointment_date: "2025-12-05",
        mechanic_id: 1,
        mechanic_name: "John Smith",
        status: "scheduled",
        created_at: "2025-12-01T10:00:00Z"
    },
    {
        id: 2,
        client_name: "Bob Wilson",
        address: "456 Oak Ave, Town",
        phone: "+1-234-567-8902",
        car_license: "XYZ789",
        car_engine: "ENG123456",
        appointment_date: "2025-12-06",
        mechanic_id: 2,
        mechanic_name: "Sarah Johnson",
        status: "in_progress",
        created_at: "2025-12-01T11:30:00Z"
    },
    {
        id: 3,
        client_name: "Carol Smith",
        address: "789 Pine Rd, Village",
        phone: "+1-234-567-8903",
        car_license: "LMN456",
        car_engine: "ENG789123",
        appointment_date: "2025-12-04",
        mechanic_id: 1,
        mechanic_name: "John Smith",
        status: "completed",
        created_at: "2025-11-30T14:15:00Z"
    }
];

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadAppointments();
    populateMechanicFilters();
    updateDashboardStats();
});

// Load appointments from server
function loadAppointments() {
    console.log('🔄 Loading appointments from server...');
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'admin_data.php', true);
    
    xhr.onreadystatechange = function() {
        console.log(`📡 XHR State: ${xhr.readyState}, Status: ${xhr.status}`);
        
        if (xhr.readyState === 4) {
            console.log(`📥 Response received: Status ${xhr.status}`);
            console.log('📄 Raw response:', xhr.responseText);
            
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    console.log('📊 Parsed response:', response);
                    
                    if (response.success) {
                        appointments = response.appointments;
                        console.log('✅ Successfully loaded', appointments.length, 'appointments');
                        console.log('📋 Appointments data:', appointments);
                        
                        displayAppointments(appointments);
                        
                        // Update dashboard stats
                        if (response.stats) {
                            console.log('📈 Updating stats:', response.stats);
                            updateDashboardStatsFromServer(response.stats);
                        }
                        
                        console.log('🎉 Admin data loaded successfully!');
                    } else {
                        console.error('❌ Server returned error:', response.error);
                        console.log('🔄 Falling back to sample data...');
                        appointments = [...sampleAppointments];
                        displayAppointments(appointments);
                    }
                } catch (e) {
                    console.error('❌ JSON parsing error:', e);
                    console.log('📄 Raw response that failed to parse:', xhr.responseText);
                    console.log('🔄 Falling back to sample data...');
                    appointments = [...sampleAppointments];
                    displayAppointments(appointments);
                }
            } else {
                console.error('❌ HTTP error:', xhr.status, xhr.statusText);
                console.log('🔄 Falling back to sample data...');
                appointments = [...sampleAppointments];
                displayAppointments(appointments);
            }
        }
    };
    
    console.log('📤 Sending request to admin_data.php...');
    xhr.send();
}

// Display appointments in table
function displayAppointments(appointmentsToShow) {
    const tbody = document.getElementById('appointmentsBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (appointmentsToShow.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 20px; color: #666;">
                    No appointments found
                </td>
            </tr>
        `;
        return;
    }
    
    appointmentsToShow.forEach(appointment => {
        const row = createAppointmentRow(appointment);
        tbody.appendChild(row);
    });
}

// Create appointment table row
function createAppointmentRow(appointment) {
    const row = document.createElement('tr');
    
    const statusClass = `status-${appointment.status.replace('_', '-')}`;
    const formattedDate = formatDate(appointment.appointment_date);
    
    row.innerHTML = `
        <td>#${appointment.id}</td>
        <td>${appointment.client_name}</td>
        <td>${appointment.phone}</td>
        <td>${appointment.car_license}</td>
        <td>${formattedDate}</td>
        <td>${appointment.mechanic_name}</td>
        <td><span class="status-badge ${statusClass}">${formatStatus(appointment.status)}</span></td>
        <td>
            <button class="action-btn edit-btn" onclick="editAppointment(${appointment.id})">Edit</button>
            <button class="action-btn delete-btn" onclick="deleteAppointment(${appointment.id})">Delete</button>
        </td>
    `;
    
    return row;
}

// Populate mechanic filter dropdown
function populateMechanicFilters() {
    const filterSelect = document.getElementById('filterMechanic');
    const editSelect = document.getElementById('editMechanic');
    
    const selects = [filterSelect, editSelect].filter(select => select);
    
    selects.forEach(select => {
        // Keep existing options if any
        const existingOptions = select.innerHTML;
        
        mechanics.forEach(mechanic => {
            const option = document.createElement('option');
            option.value = mechanic.id;
            option.textContent = `${mechanic.name} - ${mechanic.specialization}`;
            select.appendChild(option);
        });
    });
}

// Update dashboard statistics
function updateDashboardStats() {
    const totalElement = document.getElementById('totalAppointments');
    const todayElement = document.getElementById('todayAppointments');
    const availableElement = document.getElementById('availableSlots');
    
    if (totalElement) {
        totalElement.textContent = appointments.length;
    }
    
    if (todayElement) {
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointments.filter(apt => apt.appointment_date === today);
        todayElement.textContent = todayAppointments.length;
    }
    
    if (availableElement) {
        // Calculate available slots (5 mechanics × 4 slots - booked appointments for today)
        const today = new Date().toISOString().split('T')[0];
        const todayBooked = appointments.filter(apt => 
            apt.appointment_date === today && apt.status !== 'cancelled'
        ).length;
        const totalSlots = mechanics.length * 4;
        availableElement.textContent = Math.max(0, totalSlots - todayBooked);
    }
}

// Update stats from server response
function updateDashboardStatsFromServer(stats) {
    const totalElement = document.getElementById('totalAppointments');
    const todayElement = document.getElementById('todayAppointments');
    const availableElement = document.getElementById('availableSlots');
    
    if (totalElement && stats.total_appointments !== undefined) {
        totalElement.textContent = stats.total_appointments;
    }
    
    if (todayElement && stats.today_appointments !== undefined) {
        todayElement.textContent = stats.today_appointments;
    }
    
    if (availableElement && stats.available_slots !== undefined) {
        availableElement.textContent = stats.available_slots;
    }
}

// Filter appointments
function filterAppointments() {
    const dateFilter = document.getElementById('filterDate').value;
    const mechanicFilter = document.getElementById('filterMechanic').value;
    
    let filtered = [...appointments];
    
    if (dateFilter) {
        filtered = filtered.filter(apt => apt.appointment_date === dateFilter);
    }
    
    if (mechanicFilter) {
        filtered = filtered.filter(apt => apt.mechanic_id == mechanicFilter);
    }
    
    displayAppointments(filtered);
}

// Clear filters
function clearFilters() {
    document.getElementById('filterDate').value = '';
    document.getElementById('filterMechanic').value = '';
    displayAppointments(appointments);
}

// Edit appointment
function editAppointment(appointmentId) {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) return;
    
    currentEditId = appointmentId;
    
    // Populate edit form
    document.getElementById('editAppointmentId').value = appointment.id;
    document.getElementById('editClientName').value = appointment.client_name;
    document.getElementById('editPhone').value = appointment.phone;
    document.getElementById('editCarLicense').value = appointment.car_license;
    document.getElementById('editDate').value = appointment.appointment_date;
    document.getElementById('editMechanic').value = appointment.mechanic_id;
    document.getElementById('editStatus').value = appointment.status;
    
    // Show modal
    document.getElementById('editModal').style.display = 'block';
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditId = null;
}

// Handle edit form submission
document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('📝 Edit form submitted');
    
    const formData = new FormData(e.target);
    
    // Log form data
    console.log('📋 Edit form data:');
    for (let [key, value] of formData.entries()) {
        console.log(`  ${key}: ${value}`);
    }
    
    // Send update to server
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'simple_update.php', true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log(`📡 Update response: Status ${xhr.status}`);
            console.log('📄 Response text:', xhr.responseText);
            
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    console.log('📊 Parsed update response:', response);
                    
                    if (response.success) {
                        console.log('✅ Appointment updated successfully');
                        
                        // Refresh appointments from server
                        loadAppointments();
                        closeEditModal();
                        showToast('Appointment updated successfully', 'success');
                    } else {
                        console.log('❌ Update failed:', response.error);
                        showToast('Update failed: ' + response.error, 'error');
                    }
                } catch (e) {
                    console.error('❌ JSON parsing error:', e);
                    showToast('Server response error', 'error');
                }
            } else {
                console.error('❌ HTTP error:', xhr.status);
                showToast('Server error: HTTP ' + xhr.status, 'error');
            }
        }
    };
    
    console.log('📤 Sending update request...');
    xhr.send(formData);
});

// Delete appointment
function deleteAppointment(appointmentId) {
    currentDeleteId = appointmentId;
    document.getElementById('deleteModal').style.display = 'block';
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    currentDeleteId = null;
}

// Confirm delete
function confirmDelete() {
    if (!currentDeleteId) return;
    
    console.log('🗑️ Deleting appointment ID:', currentDeleteId);
    
    // Send delete request to server
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'simple_delete.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log(`📡 Delete response: Status ${xhr.status}`);
            console.log('📄 Response text:', xhr.responseText);
            
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    console.log('📊 Parsed delete response:', response);
                    
                    if (response.success) {
                        console.log('✅ Appointment deleted successfully');
                        
                        // Refresh appointments from server
                        loadAppointments();
                        closeDeleteModal();
                        showToast('Appointment deleted successfully', 'success');
                    } else {
                        console.log('❌ Delete failed:', response.error);
                        showToast('Delete failed: ' + response.error, 'error');
                    }
                } catch (e) {
                    console.error('❌ JSON parsing error:', e);
                    showToast('Server response error', 'error');
                }
            } else {
                console.error('❌ HTTP error:', xhr.status);
                showToast('Server error: HTTP ' + xhr.status, 'error');
            }
        }
    };
    
    console.log('📤 Sending delete request...');
    xhr.send('appointment_id=' + currentDeleteId);
}

// Get mechanic name by ID
function getMechanicName(mechanicId) {
    const mechanic = mechanics.find(m => m.id == mechanicId);
    return mechanic ? mechanic.name : 'Unknown';
}

// Format status for display
function formatStatus(status) {
    const statusMap = {
        'scheduled': 'Scheduled',
        'in_progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    
    return statusMap[status] || status;
}

// Format date for display
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Show toast notification
function showToast(message, type) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add styles
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '5px',
        color: 'white',
        backgroundColor: type === 'success' ? '#27ae60' : '#e74c3c',
        zIndex: '10000',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const editModal = document.getElementById('editModal');
    const deleteModal = document.getElementById('deleteModal');
    
    if (e.target === editModal) {
        closeEditModal();
    }
    
    if (e.target === deleteModal) {
        closeDeleteModal();
    }
});

// Export functions for potential use
window.AdminPanel = {
    filterAppointments,
    clearFilters,
    editAppointment,
    deleteAppointment,
    appointments,
    mechanics
};