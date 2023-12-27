export default class Highscore {
    async fetchHighscores() {
        try {
            const response = await fetch('/api/users/highscores');
            if (response.ok) {
                return await response.json(); // Rückgabe der Daten statt sie hier zu speichern
            } else {
                console.error('Error retrieving highscores:', response.status, await response.text());
                return []; // Rückgabe eines leeren Arrays im Fehlerfall
            }
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }
}
