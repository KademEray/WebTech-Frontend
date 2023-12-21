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
      <button @click="saveCurrentSkinToDB">Save</button>
    </div>
    <div class="saved-skins">
      <div v-for="(skin, index) in savedSkins" :key="index" class="saved-skin">
        <span>{{ index + 1 }}. </span>
        <button @click="loadSkin(index)">Laden</button>
        <button @click="updateSkin(index)">Aktualisieren</button>
        <button @click="deleteSkin(index, skin.id)">Löschen</button>
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
  mounted() {
    if (this.$store.state.username) {
      this.fetchUserSkins();
    }
  },
  methods: {
    async updateSkin(index = null) {
      let skin;
      if (index !== null) {
        skin = this.savedSkins[index];
      } else {
        skin = this.$store.state.currentSkin;
      }

      if (!skin) {
        console.error('Kein Skin zum Aktualisieren gefunden');
        return;
      }

      const updatedSkin = {
        color: this.selectedColor,
        shape: this.selectedShape,
        username: this.$store.state.username
      };

      try {
        const response = await fetch(`http://localhost:8081/api/skins/${skin.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedSkin)
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Fehler beim Aktualisieren des Skins:', errorData.message || 'Unbekannter Fehler');
          return;
        }

        const updatedSkinData = await response.json();
        console.log('Skin erfolgreich aktualisiert:', updatedSkinData);
        this.$store.commit('updateSkin', { index, updatedSkin: updatedSkinData });


      } catch (error) {
        console.error('Fehler beim Aktualisieren des Skins:', error);
      }
    },

    async saveCurrentSkinToDB() {
      const username = this.$store.state.username;  // Benutzername aus dem Vuex Store

      const skin = {
        color: this.selectedColor,
        shape: this.selectedShape,
        username: username  // Benutzername aus dem Vuex-Store
      };

      if (!username) {
        // Benutzer ist nicht angemeldet, speichern Sie den Skin nur im Vuex Store
        this.$store.commit('setCurrentSkin', skin);  // Jetzt ist 'skin' definiert
        alert("Skin wurde lokal gespeichert, aber nicht in der Datenbank.");
        return;
      }

      try {
        const response = await fetch('http://localhost:8081/api/skins/createSkin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(skin)
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Fehler beim Speichern des Skins:', errorData.message || 'Unbekannter Fehler');
          return;
        }

        const savedSkinData = await response.json();
        console.log('Skin erfolgreich gespeichert:', savedSkinData);
        this.$store.commit('saveSkin', savedSkinData);  // Optional: Speichern des Skins im Vuex-Store

      } catch (error) {
        console.error('Fehler beim Speichern des Skins:', error);
      }
    },

    loadSkin(index) {
      const skin = this.savedSkins[index];
      this.selectedColor = skin.color;
      this.selectedShape = skin.shape;
      this.$store.commit('setCurrentSkin', skin); // Aktualisieren des currentSkin im Vuex Store
      this.updateSkin();
    },
    async deleteSkin(index, id) {
      try {
        // API-Aufruf, um den Skin im Backend zu löschen
        const response = await fetch(`http://localhost:8081/api/skins/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Lokale Löschung im Vuex Store
          this.$store.commit('deleteSkin', index);
        } else {
          console.error("Fehler beim Löschen des Skins:", response.status);
        }
      } catch (error) {
        console.error("Fehler beim Löschen des Skins:", error);
      }
    },

    async fetchUserSkins() {
      const username = this.$store.state.username;  // Benutzername aus dem Vuex Store
      if (!username) return;
      try {
        const response = await fetch(`http://localhost:8081/api/skins/forUser/${username}`);
        if (response.ok) {
          const skins = await response.json();
          this.$store.commit('setSkins', skins);  // Speichern der Skins im Vuex-Store
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Skins:', error);
      }
    }




  },

  computed: {
    savedSkins() {
      return this.$store.state.savedSkins;
    },
  }
};

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
.saved-skins {
  display: inline;

}
.saved-skin {
  width: 10px;
  height: 10px;
  margin: 5px;
  display: inline;

}

</style>
