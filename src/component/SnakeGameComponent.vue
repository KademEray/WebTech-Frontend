<template>
  <div class="game-container">
    <div class="scoreboard">
      <div class="points">Points: {{ points }}</div>
      <div class="Highscore">Highscore: {{ Highscore }}</div>
    </div>
    <div class="snake-game" @keydown="handleKeydown" tabindex="0">
      <canvas ref="gameCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>
  </div>
</template>

<script>
import store from "../store";
import Snake from "./Snake.js";
import Board from "./Board.js";


export default {
  computed: {
    points() {
      return this.$store.state.points;
    },
    Highscore() {
      return this.$store.state.highscore;
    },
    username() {
      // Annahme: Benutzername ist im Vuex Store gespeichert
      return this.$store.state.username;
    }
  },

  props: {
    isMuted: {
      type: Boolean,
      required: true
    },
  },


  watch: {
    isMuted(newVal) {
      if (newVal) {
        this.muteSounds();
      } else {
        this.unmuteSounds();
      }
    },
  },


  data() {
    return {
      isActive: false,
      canvasWidth: 700,
      canvasHeight: 700,
      snake: null,
      board: null,
      lastRenderTime: 0,
      moveInterval: 0.15,
      gameOver: false, // Neuer Statusindikator
      lastKeydownTime: 0,
      keyDelay: 100, // Verzögerung in Millisekunden
      gameSounds: {
        eatSound: new Audio('/scale-d6-106129.mp3'),
      },
    };
  },


  mounted() {
    const ctx = this.$refs.gameCanvas.getContext("2d");
    this.snake = new Snake(ctx, store);
    // Übergeben Sie eine Callback-Funktion an Board
    this.board = new Board(ctx, this.canvasWidth, this.canvasHeight, () => this.updateHighscoreIfNeeded());
    this.snake.initSnake(this.canvasWidth / 2, this.canvasHeight / 2, 'up');
    this.board.initGame(this.snake);
  },

  methods: {
    handleKeydown(event) {
      const currentTime = Date.now();
      if (currentTime - this.lastKeydownTime < this.keyDelay) {
        // Ignoriere den Tastendruck, wenn die Verzögerung noch nicht abgelaufen ist
        return;
      }

      // Aktualisiere den Zeitpunkt des letzten Tastendrucks
      this.lastKeydownTime = currentTime;

      if (!this.isActive && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        this.isActive = true;
        this.lastRenderTime = performance.now();
        this.gameLoop();
      }

      // Reagiere nur auf Pfeiltasten, ignoriere andere Tasten
      if (this.isActive && this.snake && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        this.snake.changeDirection(event.key);
      }
    },

    muteSounds() {
      // Mute logic for all sounds
      this.gameSounds.eatSound.muted = true;
    },

    unmuteSounds() {
      // Unmute logic for all sounds
      this.gameSounds.eatSound.muted = false;
    },

    playEatSound() {
      if (!this.isMuted) {
        this.gameSounds.eatSound.play();
      }
    },


    async gameLoop(currentTime) {
      if (!this.isActive) {
        return;
      }
      requestAnimationFrame(this.gameLoop);

      const secondsSinceLastRender = (currentTime - this.lastRenderTime) / 1000;
      if (secondsSinceLastRender < this.moveInterval) return;
      this.lastRenderTime = currentTime;

      this.board.draw();
      this.snake.moveSnake();

      if (this.board.checkCollision() || this.snake.checkSelfCollision()) {
        this.gameOver = true;
        alert("Game Over");
        await this.resetGame();
      }

      // Überprüfen, ob der Snake den Food gegessen hat
      if (this.snake.getHead().x === this.board.food.x && this.snake.getHead().y === this.board.food.y) {
        this.snake.grow();
        this.playEatSound();
        // Spawn eines neuen Foods, sobald der aktuelle gegessen wurde
        this.board.spawnFood();
        this.$store.commit('addPoints', 10); // Punkte hinzufügen
        this.updateHighscoreIfNeeded();
        await this.updatePointsInDatabase();
      }
    },

    async resetGame() {
      this.isActive = false;
      this.gameOver = false;
      this.snake.initSnake(this.canvasWidth / 2, this.canvasHeight / 2, 'up');
      this.board.initGame(this.snake);
      this.$store.commit('setPoints', 0); // Punkte zurücksetzen

      // Laden Sie den aktuellen Highscore vom Backend und aktualisieren Sie den Vuex Store
      await this.loadUserHighscore(this.username);

      // Laden Sie die Highscore-Liste neu
      await this.$store.dispatch('fetchHighscores');
    },

    async loadUserHighscore(username) {
      const token = localStorage.getItem('token');
      if (!username || !token) return;

      try {
        const HighscoreResponse = await fetch(`http://localhost:8081/api/users/${username}/points`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (HighscoreResponse.ok) {
          const Highscore = await HighscoreResponse.json();
          this.$store.commit('setHighscore', Highscore);
        }
      } catch (error) {
        console.error('Error loading highscores:', error);
      }
    },


    updateHighscoreIfNeeded() {
      if (this.points > this.highscore) {
        this.$store.commit('setHighscore', this.points);
        this.updateHighscoreInDatabase(this.points);
      }
    },

    async updateHighscoreInDatabase(newHighscore) {
      try {
        const response = await fetch(`/api/users/${this.username}/points`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Highscore: newHighscore })
        });

        if (!response.ok) {
          throw new Error('Error updating highscores');
        }
        console.log('Highscore successfully updated:');
      } catch (error) {
        console.error('Error updating the highscore:', error);
      }
    },

    async updatePointsInDatabase() {
      const username = this.$store.state.username;
      const points = this.$store.state.points;

      try {
        const response = await fetch(`/api/users/${username}/points`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({points})
        });

        if (!response.ok) {
          throw new Error('Error updating the user points');
        }
        console.log('Points successfully updated');
      } catch (error) {
        console.error('Error updating points:', error);
      }
    }
    },
};
</script>

<style scoped>
@font-face {
  font-family: 'Rocher';
  src: url('https://assets.codepen.io/9632/RocherColorGX.woff2');
}
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.scoreboard {
  font-family: 'Rocher', sans-serif;
  display: flex;
  justify-content: space-between;
  width: 600px; /* Gleiche Breite wie das Canvas */
  margin-bottom: 10px;
}

.points, .Highscore {
  font-family: 'Rocher', sans-serif;
  font-weight: bold;
  font-size: 26px;
}

.snake-game {
  display: flex;
  justify-content: center;
  align-items: center;

}

canvas {
  border: 4px solid #000;

}
</style>

