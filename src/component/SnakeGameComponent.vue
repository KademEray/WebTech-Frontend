<template>
  <div @keydown="handleKeydown" tabindex="0">
    <canvas ref="gameCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    <div>
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
      pattern: "circle", // Standardmuster
    };
  },
  mounted() {
    this.ctx = this.$refs.gameCanvas.getContext("2d");
    this.initGame();
    this.direction = "right";
    this.$el.focus();
    this.draw();
  },
  computed: {
    store() {
      return store;
    },
    selectedShape() {
      return this.$store.state.currentSkin ? this.$store.state.currentSkin.shape : "rectangle";
    },
    snakeColor() {
      return this.$store.state.selectedColor || "#000000";
    },
  },
  methods: {
    // ... (vorhandene Methoden bleiben unverändert)

    drawSnake() {
      const snakeSize = 20;

      const selectedShape = this.$store.state.currentSkin ? this.$store.state.currentSkin.shape : "rectangle";
      const selectedColor = this.$store.state.selectedColor || "#000000";
      const pattern = this.pattern;

      this.snake.forEach((segment, index) => {
        this.ctx.fillStyle = selectedColor;

        if (selectedShape === "rectangle") {
          this.ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
        } else if (selectedShape === "circle") {
          this.drawPatternCircle(segment.x, segment.y, snakeSize, pattern);
        } else if (selectedShape === "triangle") {
          this.drawPatternTriangle(segment.x, segment.y, snakeSize, pattern);
        }
        // ... (weitere Muster können hier hinzugefügt werden)
      });
    },

    drawPatternCircle(x, y, size, pattern) {
      // Hier implementiere die Logik zum Zeichnen des Musters "Kreis"
      // Beispiel: Zeichne einen Kreis im Rechteck (x, y, size, size)
      this.ctx.beginPath();
      this.ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      this.ctx.fill();
    },

    drawPatternTriangle(x, y, size, pattern) {
      // Hier implementiere die Logik zum Zeichnen des Musters "Dreieck"
      // Beispiel: Zeichne ein gleichseitiges Dreieck im Rechteck (x, y, size, size)
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + size, y);
      this.ctx.lineTo(x + size / 2, y + size);
      this.ctx.closePath();
      this.ctx.fill();
    },

    // ... (weitere Muster können hier hinzugefügt werden)
  },
};
</script>

<style scoped>
/* ... (vorhandene Styles bleiben unverändert) */
</style>

