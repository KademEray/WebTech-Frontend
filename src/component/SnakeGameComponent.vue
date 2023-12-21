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
  // ... (Rest des Skripts bleibt unverändert)
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
