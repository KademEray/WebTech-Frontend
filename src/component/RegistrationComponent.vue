<template>
  <div class="login-container">
    <button @click="toggleView" class="toggle-button">
      {{ showLogin ? 'Zur Registrierung wechseln' : 'Zum Login wechseln' }}
    </button>

    <!-- Erfolgsmeldung -->
    <div v-if="successMessage" class="success-message">
      <p>{{ successMessage }}</p>
    </div>

    <!-- Fehlermeldung -->
    <div v-if="errorMessage" :class="messageClass">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Login-Formular -->
    <div v-if="showLogin">
      <h2>Login</h2>
      <input v-model.trim="loginData.username" placeholder="Benutzername" class="input-field" />
      <input v-model.trim="loginData.password" placeholder="Passwort" type="password" class="input-field" />
      <button @click="login" class="login-button">Login</button>
      <button @click="logout" class="logout-button">Logout</button>
    </div>

    <!-- Registrierungsformular -->
    <div v-else>
      <h2>Registrierung</h2>
      <input v-model.trim="registerData.username" placeholder="Benutzername" class="input-field" />
      <input v-model.trim="registerData.password" placeholder="Passwort" type="password" class="input-field" />
      <button @click="register" class="register-button">Registrieren</button>
    </div>


  </div>
</template>

<script>
import {jwtDecode} from "jwt-decode";

const API_BASE_URL = 'http://localhost:8081/api/users';

export default {
  data() {
    return {
      showLogin: true,
      loginData: { username: "", password: "" },
      registerData: { username: "", password: "" },
      errorMessage: null,
      pointsData: { points: 0 },
      successMessage: null,
    };
  },
  mounted() {
    if (this.$store.state.username) {
      this.fetchUserSkins();
    }
  },
  computed: {
    messageClass() {
      return {
        'error-message': this.errorMessage && !this.errorMessage.includes('erfolgreich'),
        'success-message': this.errorMessage && this.errorMessage.includes('erfolgreich')
      };
    }
  },
  methods: {
    toggleView() {
      this.showLogin = !this.showLogin;
      this.errorMessage = null;
    },
    async register() {
      this.errorMessage = null; // Setze die Fehlermeldung zurück
      this.successMessage = null; // Setze die Erfolgsmeldung zurück
      if (!this.registerData.username || !this.registerData.password) {
        this.errorMessage = 'Benutzername und Passwort sind erforderlich';
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(this.registerData)
        });
        if (response.ok) {
          const userData = await response.json();
          console.log('Registrierung erfolgreich:', userData);
          // Anzeigen der Login-Ansicht nach erfolgreicher Registrierung
          this.showLogin = true;
        } else {
          const errorData = await response.json();
          this.errorMessage = errorData.message || 'Registrierung fehlgeschlagen';
        }
      } catch (error) {
        console.error('Registrierung fehlgeschlagen:', error);
        this.errorMessage = 'Registrierung fehlgeschlagen';
      }
    },


    async login() {
      // Setze den Benutzernamen und den Token im Vuex-Store zurück
      this.$store.commit('setPoints', 0);
      this.$store.commit('resetState');
      if (!this.loginData.username || !this.loginData.password) {
        this.errorMessage = 'Benutzername und Passwort sind erforderlich';
        return;
      }
      const userDetails = {
        username: this.loginData.username,
        password: this.loginData.password,
      };
      try {
        const response = await fetch('http://localhost:8081/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify(userDetails)
        });
        if (response.ok) {
          const token = await response.text();
          localStorage.setItem('token', token);
          console.log('Login erfolgreich:', token);
          this.successMessage = 'Login erfolgreich';

          // Setzen des Benutzernamens im Vuex Store
          this.$store.commit('setUsername', this.loginData.username);
          this.$store.commit('setPoints', this.pointsData.points);

          // Benutzer-ID aus dem Token extrahieren
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.sub; // 'sub' enthält normalerweise die Benutzer-ID

          // Benutzer-ID im Vuex Store speichern
          this.$store.commit('setUserId', userId);

          // Punkte des Benutzers abrufen
          const pointsResponse = await fetch(`http://localhost:8081/api/users/${this.loginData.username}/points`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          // Skins des Benutzers abrufen
          await this.fetchUserSkins();
          if (pointsResponse.ok) {
            const points = await pointsResponse.json();
            this.$store.commit('setPoints', points);
          }

          console.log("Benutzername im Vuex Store gesetzt:", this.$store.state.username);
        } else {
          this.errorMessage = 'Login fehlgeschlagen';
        }
      } catch (error) {
        console.error('Login fehlgeschlagen:', error);
        this.errorMessage = 'Login fehlgeschlagen';
      }
    },
    logout() {
      // Lösche den Token aus dem Local Storage
      localStorage.removeItem('token');

      // Setze den Benutzernamen und den Token im Vuex-Store zurück
      this.$store.commit('logout');
      this.$store.commit('setUsername', null);
      this.$store.commit('setPoints', 0);
      this.$store.commit('resetState');
      this.showLogin = true;
      console.log('Logout erfolgreich');
      this.successMessage = 'Logout erfolgreich';
    },

    async fetchUserData() {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch(`${API_BASE_URL}/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          console.log('Fehler beim Abrufen der Benutzerdaten');
          return;
        }
        const text = await response.text();
        if (text) {
          const userData = JSON.parse(text);
          console.log('Benutzerdaten:', userData);
        } else {
          console.log('Leere Antwort vom Server');
          console.log('Statuscode:', response.status);
        }
      } catch (error) {
        console.error('Ein Fehler ist aufgetreten:', error);
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
  created() {
    this.fetchUserData();
  },
}
</script>


<style scoped>
.login-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 300px;
  margin: auto;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.login-button, .logout-button, .register-button, .toggle-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-bottom: 10px;
}

.login-button:hover, .logout-button:hover, .register-button:hover, .toggle-button:hover {
  background-color: #45a049;
}

.success-message {
  color: green;
}
.error-message {
  color: red;
}
</style>

