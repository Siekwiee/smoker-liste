<?php
$file = 'teilnehmer.txt';
$newData = file_get_contents('php://input');
if (file_put_contents($file, $newData) !== false) {
    // Erfolgreich geschrieben
    http_response_code(200); // OK-Statuscode senden
    echo 'Daten erfolgreich aktualisiert.';
} else {
    // Fehler beim Schreiben
    http_response_code(500); // Internal Server Error-Statuscode senden
    echo 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.';
}
