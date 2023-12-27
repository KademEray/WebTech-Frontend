<template>
  <div class="skin-editor">
    <strong><h1 class="title">Skin Editor</h1></strong>
    <div class="form-container">
      <div class="color-picker">
        <h2 for="color" class="label">Choose a color:</h2>
        <input type="color" id="color" v-model="selectedColor" class="input-field" />
      </div>

      <div class="shape-picker">
        <h2 for="shape" class="label">Choose a shape:</h2>
        <select id="shape" v-model="selectedShape" class="input-field">
          <option value="rectangle">Square</option>
          <option value="circle">Circle</option>
          <option value="triangle">Triangle</option>
        </select>
      </div>
    </div>

    <button @click="saveCurrentSkinToDB" class="button save-button">Save</button>

    <div class="saved-skins">
      <div v-for="(skin, index) in savedSkins" :key="index" class="saved-skin">
        <div class="skin-info">
          <span class="skin-index">{{ index + 1 }}.</span>
          <div class="shape-preview" :style="getShapeStyle(skin)"></div>
        </div>
        <div class="skin-actions">
          <button @click="loadSkin(index)" class="skin-button load">Load</button>
          <button @click="updateSkin(index)" class="skin-button update">Update</button>
          <button @click="deleteSkin(index, skin.id)" class="skin-button delete">Delete</button>
        </div>
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
      const maxSkins = 5; // Maximale Anzahl an Skins, die gespeichert werden können


      const skin = {
        color: this.selectedColor,
        shape: this.selectedShape,
        username: username  // Benutzername aus dem Vuex-Store
      };

      // Prüfen, ob die maximale Anzahl von Skins erreicht ist
      if (this.savedSkins.length >= maxSkins) {
        alert(`Maximum number of ${maxSkins} skins reached. Please delete a skin before saving a new one.`);
        return;
      }

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
        this.loadSkin(savedSkinData.id); // Laden des gespeicherten Skins

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
    },

    getShapeStyle(skin) {
      const baseSize = '25px'; // Basisgröße für Quadrat und Kreis
      const triangleBaseWidth = baseSize; // Basisbreite des Dreiecks gleich der Basisgröße

      switch (skin.shape) {
        case 'rectangle':
          return {
            width: baseSize,
            height: '25px', // Höhe des Rechtecks anpassen, wenn nötig
            backgroundColor: skin.color
          };
        case 'circle':
          return {
            width: baseSize,
            height: baseSize,
            backgroundColor: skin.color,
            borderRadius: '50%'
          };
        case 'triangle':
          // Die Höhe des Dreiecks wird durch die borderBottom Breite bestimmt
          // Die Basisbreite wird durch die Summe von borderLeft und borderRight bestimmt
          return {
            width: '0',
            height: '0',
            borderLeft: `calc(${triangleBaseWidth} / 2) solid transparent`,
            borderRight: `calc(${triangleBaseWidth} / 2) solid transparent`,
            borderBottom: `calc(${triangleBaseWidth} * 0.866) solid ${skin.color}` // Höhe des gleichseitigen Dreiecks ist etwa 0.866 mal der Basisbreite
          };
        default:
          return {};
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
@font-face {
  font-family: 'Rocher';
  src: url('https://assets.codepen.io/9632/RocherColorGX.woff2');
}
.skin-editor {
  font-family: 'Rocher', sans-serif;
  font-size: 20px;
  padding: 50px;
  text-align: center;
  max-width: 500px; /* Setzt eine maximale Breite */
  height: auto;
  min-height: 650px;
  border: none;

}

.title {
  font-family: 'Rocher', sans-serif;
  font-size: 50px;
  margin-bottom: 20px;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  color: transparent;
  padding: 0;
  border: none;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
}

.saved-skin .skin-preview {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: none;
  margin-right: 10px;
}

input[type="color"] {
  -webkit-appearance: none;
  border: none;
  width: 250px;
  height: 75px;
}

.form-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px; /* Add space before the save button */
}

.label {
  font-family: 'Rocher', sans-serif;
  display: block; /* Make the label a block element to take up the full width */
  margin-bottom: 5px; /* Space between the label and the input/select */
}


.input-field {
  font-family: 'Rocher', sans-serif;
  padding: 20px;
  margin-bottom: 20px; /* Abstand nach jedem Eingabefeld */
  border: none;
  box-sizing: border-box;
  font-size: 20px;
  width: 250px; /* Setzt die Breite des Eingabefeldes */
}



.button {
  font-family: 'Rocher', sans-serif;
  background-color: #4CAF50;
  padding: 15px 30px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 28px;
  margin-top: 20px;
  text-align: center;
}

.button.save-button {
  font-family: 'Rocher', sans-serif;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 15px 100px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 22px;
  align-self: center; /* Center the button if the form-container uses flex */
  margin-top: 10px; /* Add top margin if not using flex in form-container */
}


.button:hover {
  background-color: #45a049;
}

.saved-skins {
  margin-top: 20px;
}

.saved-skin {
  margin-bottom: 10px;
}

@media (max-width: 600px) {
  .label-input-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .label {
    font-family: 'Rocher', sans-serif;
    margin-bottom: 5px;
    margin-right: 0;
  }

  .input-field {
    width: 100%; /* Full width on smaller screens */
  }

  .button {
    font-family: 'Rocher', sans-serif;
    width: 100%;
    padding: 15px;
    margin-top: 10px;
  }
}
.saved-skins {
  margin-top: 20px;
}

.saved-skin {
  display: flex;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
}

.skin-info {
  font-family: 'Rocher', sans-serif;
  display: flex;
  align-items: center;
  margin-right: 5px; /* Verschiebt die Form um 5px nach links */
}

.skin-index {
  font-weight: bold;
  margin-right: 10px; /* Fügt rechts vom Skin-Index einen Abstand hinzu */
}

.skin-actions {
  display: flex;
  /* Stellen Sie sicher, dass keine linken Margin oder Padding die Ausrichtung stören */
  margin-left: 0;
  padding-left: 0;
}

.skin-button {
  font-family: 'Rocher', sans-serif;
  margin-left: 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.skin-button.load {
  font-family: 'Rocher', sans-serif;
  background-color: #6495ED;
  color: white;
  font-size: 16px;
}

.skin-button.update {
  font-family: 'Rocher', sans-serif;
  background-color: #5cb85c; /* Grün */
  color: white;
  font-size: 16px;
}

.skin-button.delete {
  font-family: 'Rocher', sans-serif;
  background-color: #d9534f; /* Rot */
  color: white;
  font-size: 16px;
}

.skin-button:hover {
  opacity: 0.8;
}

@media (max-width: 600px) {
  .saved-skin {

    flex-direction: column;

    align-items: flex-start;

  }

  .skin-actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .skin-button {
    font-family: 'Rocher', sans-serif;
    width: 100%;
    margin-top: 5px;
  }

  .skin-button:first-child {
    margin-top: 0;
  }
  .input-field, .button {
    width: 80%; /* Setzt die Breite der Eingabefelder und Buttons */
    margin: 10px auto; /* Zentriert die Elemente und fügt oben und unten einen Abstand hinzu */
  }
}

.input-field {
  background-color: transparent; /* Setzt den Hintergrund auf transparent */
  border: 5px solid rgb(252,212,92);
  /* ... Ihre anderen Stile ... */
}

/* Spezifischer Stil für den <select>-Tag */
.input-field#shape {
  -webkit-appearance: none; /* Entfernt Standard-Styling für Webkit-Browser */
  -moz-appearance: none; /* Entfernt Standard-Styling für Firefox */
  appearance: none; /* Entfernt das Standard-Styling für moderne Browser */
  /* Optional: Fügen Sie einen Pfeil oder ein anderes Symbol hinzu, um anzuzeigen, dass es sich um ein Dropdown-Menü handelt */
}
.color-picker input[type="color"] {
  -webkit-appearance: none;
  border: none;
  cursor: pointer;
  height: 110px; /* Erhöhen Sie die Höhe des Buttons */
  width: 300px; /* Erhöhen Sie die Breite des Buttons */
}

/* Entfernen Sie die Standard-Styles für Webkit-Browser */
.color-picker input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 5px;
}

.color-picker input[type="color"]::-webkit-color-swatch {
  border: none;
}
</style>
