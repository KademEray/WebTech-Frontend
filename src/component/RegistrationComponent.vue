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
      showLogin: true, // Kontrolliert, ob Login- oder Registrierungsformular angezeigt wird
      registerData: {
        username: "",
        password: "",
      },
      errorMessage: null, // Für Fehlermeldungen
      // ... (weitere Daten können hier hinzugefügt werden)
    };
  },
  methods: {
    toggleView() {
      this.showLogin = !this.showLogin;
    },
    async register() {
      // ... (Registrierungslogik bleibt unverändert, aber achte darauf, dass sie mit dem Backend verbunden ist)
    },
    // ... (weitere vorhandene Methoden bleiben unverändert)
  },
};
</script>

<style scoped>
/* ... (vorhandene Styles bleiben unverändert) */
</style>
