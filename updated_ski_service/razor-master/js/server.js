function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}
 
function validatePhone(phone) {
    const phonePattern = /^[0-9\s+()-]{7,15}$/;
    return phonePattern.test(phone);
}
 
function handleFormSubmit(event) {
    event.preventDefault();
 
   
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const priority = document.getElementById('priority').value;
    const service = document.getElementById('service').value;
    const pickup_Date = new Date().toISOString();  
 
     // Validierung und Senden der Daten an den Server
    if (validateEmail(email) && validatePhone(phone)) {
        const data = {
            name,
            email,
            phone,
            priority,
            service,
            pickup_Date,
            submission_Date: new Date().toISOString().split('T')[0]
        };
 
        // Server-Aufruf mit angepasstem API-Endpunkt
        fetch('http://localhost:5000/api/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                document.getElementById('confirmationMessage').textContent =
                    `Vielen Dank, ${customerName}! Ihr Serviceauftrag wurde erfolgreich eingereicht. Abholdatum: ${pickupDate}`;
            } else {
                document.getElementById('confirmationMessage').textContent =
                    'Fehler beim Absenden. Bitte versuchen Sie es erneut.';
            }
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Bitte überprüfen Sie Ihre Eingaben.');
    }
}