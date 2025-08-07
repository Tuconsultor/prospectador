document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const form = document.getElementById('leadForm');
    const newRecordBtn = document.getElementById('newRecordBtn');

    const showScreen = (screenId) => {
        screens.forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    };

    document.getElementById('toScreen2').addEventListener('click', () => showScreen('screen2'));
    document.getElementById('toScreen3').addEventListener('click', () => showScreen('screen3'));
    document.getElementById('backToScreen2').addEventListener('click', () => showScreen('screen2'));
    
    newRecordBtn.addEventListener('click', () => {
        form.reset();
        form.style.display = 'block';
        newRecordBtn.style.display = 'none';
        showScreen('screen1');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const leadData = {
            timestamp: new Date().toISOString(),
            nombre: document.getElementById('nombre').value,
            empresa: document.getElementById('empresa').value,
            telefono: document.getElementById('telefono').value,
            correo: document.getElementById('correo').value,
            producto: document.getElementById('producto').value,
            adquisicion: document.getElementById('adquisicion').value,
            comentarios: document.getElementById('comentarios').value
        };

        // 1. Guardar Localmente
        saveLocally(leadData);

        // 2. Enviar a Google Sheets
        const success = await saveToGoogleSheets(leadData);

        if (success) {
            // 3. Mostrar Notificación
            showAndroidNotification('Información guardada', 'El nuevo lead ha sido registrado correctamente.');
            form.style.display = 'none';
            newRecordBtn.style.display = 'block';
        } else {
            showAndroidNotification('Error', 'No se pudo guardar en la nube. Datos guardados localmente.');
        }
    });

    function saveLocally(data) {
        try {
            const localLeads = JSON.parse(localStorage.getItem('fawLeads')) || [];
            localLeads.push(data);
            localStorage.setItem('fawLeads', JSON.stringify(localLeads));
            console.log('Guardado localmente:', data);
        } catch (error) {
            console.error('Error al guardar localmente:', error);
        }
    }

    async function saveToGoogleSheets(data) {
        // Esta URL apunta a una Netlify Function que crearemos
        const endpoint = '/.netlify/functions/addToSheet';
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return response.ok;
        } catch (error) {
            console.error('Error al enviar a Google Sheets:', error);
            return false;
        }
    }

    function showAndroidNotification(title, message) {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    navigator.serviceWorker.ready.then(registration => {
                        registration.showNotification(title, {
                            body: message,
                            icon: 'icon-192.png' // Necesitarás un ícono
                        });
                    });
                }
            });
        }
        alert(title + ": " + message); // Fallback por si las notificaciones no funcionan
    }

    // Registrar el Service Worker para la funcionalidad PWA (notificaciones, offline)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(() => console.log('Service Worker Registrado'));
    }

});
