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

    // Eingaben aus dem Formular holen
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const allgemeinservice = document.querySelector('input[name="selection"]:checked')?.value;
    const priority = document.getElementById('specialities').value;
    const additionalOptions = Array.from(
        document.querySelectorAll('input[name="additionalOptions"]:checked')
    ).map(option => option.value);

    const service = `Service: ${allgemeinservice}, Additional Options: ${additionalOptions.join(', ')}`;

    // Validierung der Eingaben
    if (!validateEmail(email)) {
        alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        return;
    }

    if (!validatePhone(phone)) {
        alert('Bitte geben Sie eine gültige Telefonnummer ein.');
        return;
    }

    if (!service) {
        alert('Bitte wählen Sie einen Service aus.');
        return;
    }

    if (!priority) {
        alert('Bitte wählen Sie eine Bearbeitungszeit aus.');
        return;
    }

    // Datum erstellen
    const currentDate = new Date();
    const pickupDate = new Date();
    pickupDate.setDate(currentDate.getDate() + (priority === 'express' ? 5 : priority === 'normal' ? 7 : 12));

    // Daten vorbereiten
    const data = {
        name,
        email,
        phone,
        priority: priority.charAt(0).toUpperCase() + priority.slice(1), // Capitalize (Standard, Normal, Express)
        service,
        additionalOptions, // Optionale zusätzliche Services
        create_date: currentDate.toISOString(),
        pickup_date: pickupDate.toISOString()
    };

    // Daten an den Server senden
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
                    `Vielen Dank, ${name}! Ihr Serviceauftrag wurde erfolgreich eingereicht. Abholdatum: ${pickupDate.toISOString().split('T')[0]}`;
                document.getElementById('confirmationMessage').classList.add('text-success');

                // Bestätigung hinzufügen
                if (confirm('Ihre Eingaben wurden erfolgreich übermittelt. Möchten Sie die Seite neu laden?')) {
                    location.reload(); // Seite neu laden, falls der Benutzer bestätigt
                }
            } else {
                document.getElementById('confirmationMessage').textContent =
                    'Fehler beim Absenden. Bitte versuchen Sie es erneut.';
                document.getElementById('confirmationMessage').classList.add('text-danger');
            }
        })
        .catch(error => {
            console.error('Fehler:', error);
            document.getElementById('confirmationMessage').textContent =
                'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.';
            document.getElementById('confirmationMessage').classList.add('text-danger');
        });
}
