import store from "@/store";
import SnakeGameComponent from "@/component/SnakeGameComponent.vue";

export default class Board {
    constructor(ctx, width, height, updateHighscoreCallback) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.food = {};
        this.store = store;
        this.updateHighscoreCallback = updateHighscoreCallback; // Speichern der Callback-Funktion
    }

    initGame(snake) {
        this.snake = snake;
        this.spawnFood();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawGrid();
        this.drawBorder();
        if (this.snake) {
            this.snake.drawSnake();
        }
        this.drawFood();
    }

    drawGrid() {
        const gridSize = 20; // Die Größe der Zellen in Ihrem Raster
        const colors = ["#58bc58", "#4ca948"]; // Die zwei Farben, die Sie verwenden möchten

        for (let x = 0; x < this.width; x += gridSize) {
            for (let y = 0; y < this.height; y += gridSize) {
                // Wechseln Sie die Farbe basierend auf der aktuellen Zeile und Spalte
                let colorIndex = (Math.floor(x / gridSize) + Math.floor(y / gridSize)) % colors.length;
                this.ctx.fillStyle = colors[colorIndex];

                // Zeichnen Sie ein Quadrat mit der ausgewählten Farbe
                this.ctx.fillRect(x, y, gridSize, gridSize);
            }
        }


    }

    drawBorder() {
        const borderWidth = 4; // Breite des Randes
        this.ctx.fillStyle = "#000"; // Farbe des Randes, kann geändert werden

        // Zeichnen Sie den Rand außen statt innen
        this.ctx.fillRect(-borderWidth, -borderWidth, this.width + borderWidth * 2, borderWidth);
        this.ctx.fillRect(-borderWidth, -borderWidth, borderWidth, this.height + borderWidth * 2);
        this.ctx.fillRect(-borderWidth, this.height, this.width + borderWidth * 2, borderWidth);
        this.ctx.fillRect(this.width, -borderWidth, borderWidth, this.height + borderWidth * 2);
    }

    drawFood() {
        const foodSize = 20;
        const glowRadius = 25; // Noch größerer Radius für einen intensiveren Neon-Effekt
        const gradient = this.ctx.createRadialGradient(
            this.food.x + foodSize / 2, this.food.y + foodSize / 2, 0,
            this.food.x + foodSize / 2, this.food.y + foodSize / 2, glowRadius
        );

        // Noch intensivere Neon-Rot-Farben
        gradient.addColorStop(0, "rgba(255, 0, 0, 1)"); // Lebhaftes Rot
        gradient.addColorStop(0.2, "rgba(255, 0, 0, 0.8)"); // Leicht weniger transparentes Rot
        gradient.addColorStop(1, "rgba(255, 0, 0, 0)"); // Vollständig transparent

        // Zeichnen des leuchtenden Umkreises
        this.ctx.beginPath();
        this.ctx.fillStyle = gradient;
        this.ctx.arc(this.food.x + foodSize / 2, this.food.y + foodSize / 2, foodSize + glowRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Zeichnen des Food-Objekts
        this.ctx.fillStyle = "rgba(255, 0, 0, 1)"; // Intensives Rot
        this.ctx.fillRect(this.food.x, this.food.y, foodSize, foodSize);
    }




    spawnFood() {
        const foodSize = 20;
        let x, y, foodOnSnake;

        do {
            x = Math.floor(Math.random() * (this.width / foodSize)) * foodSize;
            y = Math.floor(Math.random() * (this.height / foodSize)) * foodSize;

            // Überprüfen, ob das Food auf der Schlange erscheint
            foodOnSnake = this.snake.snake.some(segment => segment.x === x && segment.y === y);
        } while (foodOnSnake); // Wiederhole, bis das Food nicht auf der Schlange erscheint

        this.food = { x, y };
    }


    checkCollision() {
        if (!this.snake) return false;
        const head = this.snake.getHead();
        const snakeSize = 20; // Größe eines Schlangensegments

        // Überprüfen Sie, ob der Kopf der Schlange die Grenzen des Spielfelds erreicht hat
        return head.x < 0 || head.y < 0 || head.x + snakeSize > this.width || head.y + snakeSize > this.height;
    }


    async updatePointsInDatabase() {
        const username = store.state.username;
        const points = store.state.points;

        try {
            const response = await fetch(`/api/users/${username}/points`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ points })
            });

            if (!response.ok) {
                throw new Error('Fehler beim Aktualisieren der Benutzerpunkte');
            }

            console.log('Punkte erfolgreich aktualisiert');
        } catch (error) {
            console.error('Fehler beim Aktualisieren der Punkte:', error);
        }
    }

    async checkFoodCollision() {
        const head = this.snake.getHead();
        if (head.x === this.food.x && head.y === this.food.y) {
            this.snake.grow(); // Schlange wächst NUR hier
            store.commit('addPoints', 10); // Punkte hinzufügen
            this.updateHighscoreCallback(); // Highscore prüfen und aktualisieren

            // Hier wird die Methode aufgerufen
            await this.updatePointsInDatabase();

            this.spawnFood();
            return true;
        }
        return false;
    }
}
