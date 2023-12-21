<template>
  <div class="game-container" @keydown="handleKeydown" tabindex="0">
    <canvas ref="gameCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    <div class="score-board">
      Punkte: {{ store.state.points }}
    </div>
  </div>
</template>

<script>
import store from "../store";

export default {
  data() {
    return {
      isActive: false,
      canvasWidth: 700,
      canvasHeight: 700,
      ctx: null,
      snake: [],
      food: {},
      direction: "right",
    };
  },
  mounted() {
    this.ctx = this.$refs.gameCanvas.getContext("2d");
    this.initGame();
    this.direction = "right"; // Setzt die Anfangsrichtung auf Rechts
    this.$el.focus();
    this.draw(); // Startet das Zeichnen der Schlange und des Spiels
  },
  computed: {
    store() {
      return store
    },
    selectedShape() {
      return this.$store.state.selectedShape;
    },
    snakeColor() {
      return this.$store.state.selectedColor;  // Angenommen, Sie haben selectedColor im Vuex Store
    }
  },
  methods: {

    handleKeydown(event) {
      if (!this.isActive && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        this.isActive = true;
        this.draw();
      }
      this.changeDirection(event);
    },
    initGame() {
      // Startposition der Schlange
      this.snake = [
        { x: 100, y: 100 },  // Kopf der Schlange
        { x: 80, y: 100 },   // Zweites Segment
        { x: 60, y: 100 },   // Drittes Segment
      ];
      this.spawnFood();
    },
    draw() {
      if (!this.isActive) return;

      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      // Zeichnen der Umrandung
      this.ctx.fillStyle = "#000"; // Schwarze Farbe
      this.ctx.fillRect(0, 0, this.canvasWidth, 4); // Oberer Rand
      this.ctx.fillRect(0, 0, 4, this.canvasHeight); // Linker Rand
      this.ctx.fillRect(0, this.canvasHeight - 4, this.canvasWidth, 4); // Unterer Rand
      this.ctx.fillRect(this.canvasWidth - 4, 0, 4, this.canvasHeight); // Rechter Rand

      this.drawSnake();
      this.drawFood();
      this.moveSnake();
      this.checkCollision();
      this.checkFoodCollision();
      setTimeout(this.draw, 100);
    },

    // Haupt-Snake-Komponente, wo die drawSnake Methode definiert ist
    drawSnake() {
      // Ändern Sie die Größe der Schlange
      const snakeSize = 20;

      // Farbe und Form aus dem Vuex Store holen
      const selectedColor = this.$store.state.currentSkin ? this.$store.state.currentSkin.color : '#000000'; // Standardfarbe als Fallback
      const selectedShape = this.$store.state.currentSkin ? this.$store.state.currentSkin.shape : 'rectangle'; // Standardform als Fallback

      this.snake.forEach((segment, index) => {
        this.ctx.fillStyle = selectedColor; // Verwenden Sie die ausgewählte Farbe

        if (selectedShape === 'rectangle') {
          this.ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
        } else if (selectedShape === 'circle') {
          this.ctx.beginPath();
          this.ctx.arc(segment.x + snakeSize / 2, segment.y + snakeSize / 2, snakeSize / 2, 0, Math.PI * 2);
          this.ctx.fill();
        } else if (selectedShape === 'triangle') {
          this.ctx.beginPath();
          this.ctx.moveTo(segment.x, segment.y);
          this.ctx.lineTo(segment.x + snakeSize, segment.y);
          this.ctx.lineTo(segment.x + snakeSize / 2, segment.y + snakeSize);
          this.ctx.closePath();
          this.ctx.fill();
        }
      });
    },




    drawFood() {
      const foodSize = 20;
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(this.food.x, this.food.y, foodSize, foodSize);
    },

    moveSnake() {
      let head = { ...this.snake[0] };
      const step = 20;
      switch (this.direction) {
        case "up":
          head.y -= step;
          break;
        case "down":
          head.y += step;
          break;
        case "left":
          head.x -= step;
          break;
        case "right":
          head.x += step;
          break;
      }
      this.snake.unshift(head);
      this.snake.pop();
    },
    changeDirection(event) {
      const key = event.key;
      const oppositeDirections = {
        'up': 'down',
        'down': 'up',
        'left': 'right',
        'right': 'left'
      };
      if (this.direction === oppositeDirections[key.replace('Arrow', '').toLowerCase()]) {
        return;
      }
      switch (key) {
        case "ArrowUp":
          this.direction = "up";
          break;
        case "ArrowDown":
          this.direction = "down";
          break;
        case "ArrowLeft":
          this.direction = "left";
          break;
        case "ArrowRight":
          this.direction = "right";
          break;
      }
    },
    spawnFood() {
      const foodSize = 20; // Ändern Sie dies entsprechend
      const x = Math.floor((Math.random() * (this.canvasWidth - foodSize)) / foodSize) * foodSize;
      const y = Math.floor((Math.random() * (this.canvasHeight - foodSize)) / foodSize) * foodSize;
      this.food = { x, y };
    },
    checkCollision() {
      const head = this.snake[0];
      const snakeSize = 20; // Die Größe eines Segments der Schlange

      // Überprüfen Sie, ob die Schlange sich selbst berührt
      for (let i = 1; i < this.snake.length; i++) {
        if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
          alert("Game Over");
          this.isActive = false;
          return;
        }
      }

      // Überprüfen Sie, ob die Schlange die Wand berührt
      if (
          head.x < 0 + snakeSize / 2 || // Linker Rand
          head.y < 0 + snakeSize / 2 || // Oberer Rand
          head.x >= this.canvasWidth - snakeSize / 2 || // Rechter Rand
          head.y >= this.canvasHeight - snakeSize / 2 // Unterer Rand
      ) {
        alert("Game Over");
        this.isActive = false;
        this.initGame();
      }
    },


    checkFoodCollision() {
      if (
          this.snake[0].x === this.food.x &&
          this.snake[0].y === this.food.y
      ) {
        // Punktestand direkt aus dem Vuex-Store aktualisieren
        let points = this.$store.state.points;

        if (this.logout) {
          points = 0;  // Punktestand auf 0 setzen, wenn logout
        }

        points++;
        this.$store.commit('setPoints', points);
        this.updatePointsInDatabase();  // Punkte in der Datenbank aktualisieren

        this.snake.push({ ...this.snake[this.snake.length - 1] });
        this.spawnFood();
      }
    },
    async updatePointsInDatabase() {
      const token = localStorage.getItem('token');
      const username = this.$store.state.username; // Holen Sie den Benutzernamen aus dem Vuex Store
      const points = this.$store.state.points;

      try {
        const response = await fetch(`http://localhost:8081/api/users/${username}/points`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(points)
        });

        if (response.ok) {
          console.log('Punkte erfolgreich aktualisiert');
        } else {
          console.log('Fehler beim Aktualisieren der Punkte');
        }
      } catch (error) {
        console.error('Ein Fehler ist aufgetreten:', error);
      }
    }


  },

};
</script>

<style scoped>
.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  margin-top: 50px;
}

canvas {
  /* Entferne den schwarzen Rand und passe den Hintergrund an */
  border: none;
  background: #f0f0f0; /* Hintergrundfarbe des Canvas */
}

.score-board {
  margin-left: 20px;
  font-size: 1.5em;
  color: #333;
}

/* ... (weitere vorhandene Stile bleiben unverändert) */
</style>
