<template>
  <div class="overlay" v-if="!isAuthenticated">
    <div class="login-container">
      <button @click="toggleView" class="toggle-button">
        {{ showLogin ? 'Sign in' : 'Login' }}
      </button>

      <!-- Login-Formular -->
      <div v-if="showLogin">
        <h1 class="titellogin">Login</h1>
        <input v-model.trim="loginData.username" placeholder="Username" class="input-field" />
        <input v-model.trim="loginData.password" placeholder="Password" type="password" class="input-field" />
        <button @click="login" class="login-button">Login</button>
        <button @click="playAsGuest" class="Guest-button">Play as Guest</button>
      </div>

      <!-- Registrierungsformular -->
      <div v-else>
        <h1 class="titel_sign_in">Sign in</h1>
        <input v-model.trim="registerData.username" placeholder="Username" class="input-field" />
        <input v-model.trim="registerData.password" placeholder="Password" type="password" class="input-field" />
        <button @click="register" class="register-button">Sign in</button>
        <button @click="playAsGuest" class="Guest-button">Play as Guest</button>
      </div>

      <div v-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
      </div>

      <!-- Erfolgsmeldung -->
      <div v-if="successMessage" class="success-message">
        <p>{{ successMessage }}</p>
      </div>

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
      successMessage: null,
      isAuthenticated: false
    };
  },
  methods: {
    toggleView() {
      this.showLogin = !this.showLogin;
      this.errorMessage = null;
      this.successMessage = null;
    },
    playAsGuest() {
      // Handeln Sie hier die Logik ab, um als Gast zu spielen
      this.isAuthenticated = true;
      // Weitere Aktionen oder Navigation, wenn nötig
      this.$emit('authenticated');
    },

    async register()
    {
      if (!this.registerData.username || !this.registerData.password) {
        this.errorMessage = 'Username and password are required.';
        return;
      }

      if (!this.isValidPassword(this.registerData.password)) {
        this.errorMessage =
            'Password is not valid\n' +
            'At least 8 characters\n' +
            'Letters (uppercase and lowercase)\n' +
            'Numbers\n' +
            'Special characters (e.g., ! @ # $ % ^ & * ( ) , . ? " : { } | <>)';
        return;

      }
      try {
        const response = await fetch(`${API_BASE_URL}/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(this.registerData)
        });

        if (response.ok) {
          await response.json();
          this.successMessage = 'Registration successful. Please log in.';
          this.showLogin = true;
        } else {
          const errorData = await response.json();
          if (response.status === 409) { // Konfliktstatus
            this.errorMessage = 'Username already taken';
          } else {
            this.errorMessage = errorData.message || 'Registration failed';
          }
        }
      }catch (error) {
        console.error('Registration failed:', error);
        this.errorMessage = 'Registration failed';
      }
    }
,


    // Hilfsfunktion zur Überprüfung der Passwortstärke
    isValidPassword(password) {
      const minLength = 8;
      const hasLetters = /[a-zA-Z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      return password.length >= minLength && hasLetters && hasNumbers && hasSpecialChars;
    },

    async login() {
      if (!this.loginData.username || !this.loginData.password) {
        this.errorMessage = 'Username and password are required.';
        return;
      }
      try {
        const response = await fetch('http://localhost:8081/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(this.loginData)
        });
        if (response.ok) {
          const token = await response.text();
          localStorage.setItem('token', token);
          this.successMessage = 'Login successful.';
          this.isAuthenticated = true;
          this.$emit('authenticated');

          const decodedToken = jwtDecode(token);
          this.$store.commit('setUsername', this.loginData.username);
          this.$store.commit('setUserId', decodedToken.sub);

          // Laden Sie die Benutzer-Punkte und Skins
          await this.loadUserPoints(this.loginData.username, token);
          await this.fetchUserSkins();

          console.log("Username set in Vuex store:", this.$store.state.username);
        } else {
          this.errorMessage = 'Login failed';
        }
      } catch (error) {
        console.error('Login failed:', error);
        this.errorMessage = 'Login failed';
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
      console.log('Logout successful');
      this.successMessage = 'Logout successful';
    },
    async fetchUserSkins() {
      const username = this.$store.state.username;
      if (!username) return;
      try {
        const response = await fetch(`http://localhost:8081/api/skins/forUser/${username}`);
        if (response.ok) {
          const skins = await response.json();
          this.$store.commit('setSkins', skins);
        }
      } catch (error) {
        console.error('Error retrieving skins:', error);
      }
    },

    async loadUserPoints(username, token) {
      try {
        const pointsResponse = await fetch(`http://localhost:8081/api/users/${username}/points`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (pointsResponse.ok) {
          const points = await pointsResponse.json();
          // Speichern Sie die Punkte als Highscore im Vuex Store
          this.$store.commit('setHighscore', points);
        }
      } catch (error) {
        console.error('Error loading user points:', error);
      }
    },


  },
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  background-color: white;
  padding: 60px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 900px;
  margin: auto;
  width: 400px; /* oder eine andere Breite */
  height: 500px; /* oder eine andere Höhe */
}


.input-field {
  width: 100%;
  padding: 10px;
  margin: 20px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.login-button, .register-button, .toggle-button, .Guest-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 20px 40px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-bottom: 20px;
}

.login-button:hover, .register-button:hover, .toggle-button:hover, .Guest-button:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
  margin-top: 10px;
  justify-content: left;

}

.success-message {
  color: green;
  margin-top: 10px;
}

.input-field, .login-button, .register-button, .toggle-button, .error-message, .success-message, .Guest-button {
  font-size: 28px; /* Setzt die Schriftgröße auf 28px */
}

.titellogin, .titel_sign_in {
  font-size: 30px; /* Setzt die Schriftgröße auf 40px */
}
</style>
