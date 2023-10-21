import axios from 'axios';

const API_URL = 'http://localhost:8080';

export default {
    getHighscores() {
        return axios.get(`${API_URL}/api/highscores`)
            .then(response => {
                if (response && response.data) {
                    return response.data;
                }
            })
            .catch(error => {
                console.error("Fehler beim Abrufen der Highscores:", error);
            });
    },
    getPersons() {
        return axios.get(`${API_URL}/api/persons`)
            .then(response => {
                if (response && response.data) {
                    return response.data;
                }
            })
            .catch(error => {
                console.error("Fehler beim Abrufen der Personen:", error);
            });
    },
    register(userData) {
        return axios.post(`${API_URL}/api/persons`, JSON.stringify(userData), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response && response.data) {
                    console.log("Registrierung erfolgreich:", response.data);
                    return response.data;
                }
            })
            .catch(error => {
                console.error("Fehler bei der Registrierung:", error);
            });
    },
    addHighscore(highscoreData) {
        return axios.post(`${API_URL}/addHighscore`, highscoreData)
            .then(response => {
                if (response && response.data) {
                    return response.data;
                }
            })
            .catch(error => {
                console.error("Fehler beim Hinzufügen des Highscores:", error);
            });
    }
    // ... (Der Rest des Codes bleibt unverändert) ...
}
