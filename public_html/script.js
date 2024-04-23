document.addEventListener("DOMContentLoaded", function() {
    const teilnehmerListe = document.getElementById("teilnehmer-liste");
    const teilnehmerForm = document.getElementById("teilnehmer-form");
    const teilnehmerNameInput = document.getElementById("teilnehmer-name");

    // Lade Teilnehmerliste beim Start der Anwendung
    ladeTeilnehmer();

    teilnehmerForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Verhindere das Absenden des Formulars

        const name = teilnehmerNameInput.value.trim();
        if (name !== "") {
            const id = generiereTeilnehmerID();
            const punkte = 0;
            const neuerTeilnehmer = { id, name, punkte };

            // Füge neuen Teilnehmer hinzu
            addTeilnehmer(neuerTeilnehmer);

            // Setze das Eingabefeld zurück
            teilnehmerNameInput.value = "";
        }
    });

    // Funktion zum Laden der Teilnehmerliste
    function ladeTeilnehmer() {
        fetch('https://smoker-liste.de/teilnehmer.txt')
            .then(response => response.text())
            .then(data => {
                    teilnehmerListe.innerHTML = ""; // Leere die Liste, bevor du sie neu erstellst
                    const teilnehmerArray = data.split(',');
                    teilnehmerArray.forEach(function(teString) {
                    const [id, name, punkte] = teString.split(';');
                    const teilnehmer = { id, name, punkte: parseInt(punkte) };
                    zeigeTeilnehmer(teilnehmer);
                    });                             
            })
            .catch(error => {
                console.error('Fehler beim Laden der Teilnehmerliste:', error);
            });
    }

    // Funktion zum Hinzufügen eines Teilnehmers zur Liste
    function addTeilnehmer(teilnehmer) {
        fetch('https://smoker-liste.de/teilnehmer.txt')
            .then(response => response.text())
            .then(data => {
                const newData = data + `,${teilnehmer.id};${teilnehmer.name};${teilnehmer.punkte}`;
                // Aktualisiere die Textdatei mit den aktualisierten Daten
                return fetch('https://smoker-liste.de/update_teilnehmer.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: newData
                });
            })
            .then(() => {
                // Lade die Teilnehmerliste neu
                ladeTeilnehmer();
            })
            .catch(error => {
                console.error('Fehler beim Hinzufügen des Teilnehmers:', error);
            });
    }

    // Funktion zum Anzeigen eines Teilnehmers in der Liste
    function zeigeTeilnehmer(te) {
        const teilnehmerElement = document.createElement("div");
        teilnehmerElement.classList.add("teilnehmer");
        teilnehmerElement.innerHTML = `
            <span>Name: ${te.name}</span>
            <span>Punkte: ${te.punkte}</span>
            <button class="punkte-button" data-id="${te.id}" data-action="plus">+</button>
            <button class="punkte-button" data-id="${te.id}" data-action="minus">-</button>
        `;
        teilnehmerListe.appendChild(teilnehmerElement);

        // Füge Event Listener für Punkte-Buttons hinzu
        const punkteButtons = teilnehmerElement.querySelectorAll(".punkte-button");
        punkteButtons.forEach(function(btn) {
            btn.addEventListener("click", function() {
                const id = btn.getAttribute("data-id");
                const action = btn.getAttribute("data-action");
                updatePunkte(id, action);
            });
        });
    }

    // Funktion zum Aktualisieren der Punkte eines Teilnehmers
    function updatePunkte(id, action) {
        fetch('https://smoker-liste.de/teilnehmer.txt')
            .then(response => response.text())
            .then(data => {
                const teilnehmerArray = data.split(',');
                const updatedTeilnehmerArray = teilnehmerArray.map(teString => {
                    const [teID, name, punkte] = teString.split(';');
                    if (teID === id) {
                        if (action === 'plus') return `${teID};${name};${parseInt(punkte) + 1}`;
                        else if (action === 'minus') return `${teID};${name};${parseInt(punkte) - 1}`;
                    }
                    return teString;
                });
                const updatedData = updatedTeilnehmerArray.join(',');
                // Aktualisiere die Textdatei mit den aktualisierten Daten
                return fetch('https://smoker-liste.de/update_teilnehmer.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: updatedData
                });
            })
            .then(() => {
                // Lade die Teilnehmerliste neu
                ladeTeilnehmer();
            })
            .catch(error => {
                console.error('Fehler beim Aktualisieren der Teilnehmerpunkte:', error);
            });
    }

    // Funktion zur Generierung einer eindeutigen Teilnehmer-ID
    function generiereTeilnehmerID() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
});


