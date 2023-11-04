<template>
  <div>
    <button @click="toggleView">
      {{ showLogin ? 'Zur Registrierung wechseln' : 'Zum Login wechseln' }}
    </button>

    <!-- Login-Formular -->
    <div class="registration" v-if="showLogin">
      <h2>Login</h2>
      <input v-model.trim="loginData.username" placeholder="Benutzername" />
      <input v-model.trim="loginData.password" placeholder="Passwort" type="password" />
      <button @click="login">Login</button>

      <button @click="logout">Logout</button>
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
    };
  },
  mounted() {
    if (this.$store.state.username) {
      this.fetchUserSkins();
    }
  },
  methods: {
    toggleView() {
      this.showLogin = !this.showLogin;
      this.errorMessage = null;
    },
    async register() {
      if (!this.registerData.username || !this.registerData.password) {
        this.errorMessage = 'Benutzername und Passwort sind erforderlich';
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.registerData)
        });
        if (!response.ok) {
          const errorData = await response.json();
          this.errorMessage = errorData.message || 'Registrierung fehlgeschlagen';
          return;
        }
        const userData = await response.json();
        console.log('Registrierung erfolgreich:', userData);
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
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userDetails)
        });
        if (response.ok) {
          const token = await response.text();
          localStorage.setItem('token', token);
          console.log('Login erfolgreich:', token);

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
.registration {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.registration input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
}
.registration button {
  display: block;
  width: 100%;
}
</style>
