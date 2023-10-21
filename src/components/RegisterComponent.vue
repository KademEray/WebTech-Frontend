<template>
  <div>
    <!-- Ihr Registrierungsformular -->
    <form @submit.prevent="register">
      <input v-model="username" placeholder="Username" required>
      <input type="password" v-model="password" placeholder="Password" required>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import HighscoreService from '@/services/HighscoreService.js';

export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    register() {
      const userData = {
        username: this.username,
        password: this.password
      };

      HighscoreService.register(userData).then(response => {
        // Verarbeiten Sie die Antwort oder führen Sie weitere Aktionen durch
        // Zum Beispiel: Benachrichtigen Sie den Benutzer, dass die Registrierung erfolgreich war
        alert('Registration successful!');
      }).catch(error => {
        console.error("Fehler beim Aufruf des Endpunkts:", error.config.url);
        console.error("Fehlermeldung:", error.message);
      });
    }
  }
}
</script>
