<template>
  <div class="skin-editor">
    <h2>Skin Editor</h2>

    <div class="color-picker">
      <label for="color">Wähle eine Farbe:</label>
      <input type="color" id="color" v-model="selectedColor" />
      <div class="color-display" :style="{ backgroundColor: selectedColor }"></div>
    </div>

    <div class="shape-picker">
      <label for="shape">Wähle eine Form:</label>
      <select id="shape" v-model="selectedShape">
        <option value="rectangle">Rechteck</option>
        <option value="circle">Kreis</option>
        <option value="chain">Kette</option>
      </select>
    </div>

    <!-- ... (restlicher Code bleibt unverändert) -->
  </div>
</template>

<script>
// ... (Script-Bereich bleibt unverändert)
</script>

<style scoped>
.skin-editor {
  margin-top: 20px;
}

.color-picker, .shape-picker {
  margin-bottom: 20px;
}

.color-display {
  width: 50px;
  height: 20px;
  border: 1px solid #000;
  display: inline-block;
  margin-left: 10px;
}

/* ... (restlicher Style bleibt unverändert) */
</style>
