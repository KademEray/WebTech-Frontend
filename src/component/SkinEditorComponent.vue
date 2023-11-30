<template>
  <div class="skin-editor">
    <h2>Skin Editor</h2>
    <label for="color">Wähle eine Farbe:</label>
    <input type="color" id="color" v-model="selectedColor" />
    <label for="shape">Wähle eine Form:</label>
    <select id="shape" v-model="selectedShape">
      <option value="rectangle">Rechteck</option>
      <option value="circle">Kreis</option>
      <option value="chain">Kette</option>
    </select>
    <button @click="saveCurrentSkinToDB">Save</button>

    <!-- Visuelle Darstellung der ausgewählten Farbe und Form auf der Schlange -->
    <div class="visual-snake" v-if="selectedColor && selectedShape">
      <div :style="{ backgroundColor: selectedColor }" :class="selectedShape"></div>
    </div>

    <!-- Gespeicherte Skins -->
    <div class="saved-skins">
      <div v-for="(skin, index) in savedSkins" :key="index" class="saved-skin">
        <!-- ... (vorhandener Code bleibt unverändert) -->
        <div :style="{ backgroundColor: skin.color }"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedColor: '#000000',
      selectedShape: 'rectangle',
      username: null,
    };
  },
  // ... (weitere vorhandene Abschnitte bleiben unverändert)
  methods: {
    // ... (weitere vorhandene Methoden bleiben unverändert)
  },
  computed: {
    // ... (weitere vorhandene Berechnungen bleiben unverändert)
  },
};

</script>

<style scoped>
.skin-editor {
  margin-top: 20px;
}

/* Stil für die visuelle Schlange */
.visual-snake {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.visual-snake div {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  border: 1px solid #000;
}

/* Stil für verschiedene Formen auf der visuellen Schlange */
.circle {
  border-radius: 50%;
}

.chain {
  width: 20px;
  height: 10px;
  border-bottom: 2px solid #000;
  margin-right: 0;
}

/* ... (weitere vorhandene Stile bleiben unverändert) */
</style>
