document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('booking-form');
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            petName: document.getElementById('petName').value,
            ownerName: document.getElementById('ownerName').value,
            phone: document.getElementById('phone').value,
            date: document.getElementById('date').value,
            services: []
        };
        
        // Collect selected services
        const services = ['bathing', 'trimming', 'nails'];
        services.forEach(service => {
            if (document.getElementById(service).checked) {
                formData.services.push(service);
            }
        });
        
        // Simple validation
        if (!formData.petName || !formData.ownerName || !formData.phone || !formData.date) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Here you would typically send the data to a server
        // For now, we'll just show a success message
        alert('Thank you! Your appointment has been booked successfully.');
        bookingForm.reset();
    });
});
