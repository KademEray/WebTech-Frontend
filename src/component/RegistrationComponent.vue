<template>
  <div>
    <button @click="toggleView">
      {{ showLogin ? 'Zur Registrierung wechseln' : 'Zum Login wechseln' }}
    </button>

    <!-- Login-Formular -->
    <div class="registration" v-if="showLogin">
      <!-- ... (vorhandener Code bleibt unverändert) -->
    </div>

    <!-- Registrierungsformular -->
    <div class="registration" v-else>
      <h2>Registrierung</h2>
      <input v-model.trim="registerData.username" placeholder="Benutzername" />
      <input v-model.trim="registerData.password" placeholder="Passwort" type="password" />
      <!-- Farbauswahl für die Schlange -->
      <input type="color" v-model="registerData.snakeColor" />
      <!-- Musterauswahl für die Schlange -->
      <select v-model="registerData.snakePattern">
        <option value="circle">Kreise</option>
        <option value="triangle">Dreiecke</option>
        <!-- Weitere Muster können hier hinzugefügt werden -->
      </select>
      <button @click="register">Registrieren</button>
    </div>

    <div v-if="errorMessage">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "http://localhost:8081/api/users";

export default {
  data() {
    return {
      // ... (vorhandene Daten bleiben unverändert)
      registerData: {
        username: "",
        password: "",
        snakeColor: "#000000", // Standardfarbe für die Schlange
        snakePattern: "circle", // Standardmuster für die Schlange
      },
      // ... (weitere Daten können hier hinzugefügt werden)
    };
  },
  methods: {
    // ... (vorhandene Methoden bleiben unverändert)

    async register() {
      // ... (vorhandene Logik bleibt unverändert)

      // Hinzufügen von Farbe und Muster zur Benutzerregistrierung
      const userRegistrationData = {
        username: this.registerData.username,
        password: this.registerData.password,
        snakeColor: this.registerData.snakeColor,
        snakePattern: this.registerData.snakePattern,
      };

      try {
        const response = await fetch(`${API_BASE_URL}/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userRegistrationData),
        });

        // ... (weitere Logik bleibt unverändert)
      } catch (error) {
        // ... (vorhandene Fehlerbehandlung bleibt unverändert)
      }
    },
  },
};
</script>

<style scoped>
/* ... (vorhandene Styles bleiben unverändert) */
</style>
