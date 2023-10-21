<template>
  <div>
    <h1>Highscores List</h1>
    <table>
      <thead>
      <tr>
        <th>Username</th>
        <th>Highscore</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="highscore in highscores" :key="highscore.id">
        <td>{{ highscore.person.username }}</td>
        <td>{{ highscore.score }}</td>
      </tr>
      </tbody>
    </table>
    <h1>Registered Users</h1>
    <table>
      <thead>
      <tr>
        <th>Username</th>
      </tr>
      </thead>
      <tbody>
      <!-- Sie müssen die Personenliste aus Ihrem Backend holen -->
      <tr v-for="person in persons" :key="person.id">
        <td>{{ person.username }}</td>
      </tr>
      </tbody>
    </table>
    <!-- Die Formulare können später mit Vue-Methoden verbunden werden -->
    <form @submit.prevent="register">
      Username: <input type="text" v-model="username" required>
      Password: <input type="password" v-model="password" required>
      <input type="submit" value="Register">
    </form>
    <form @submit.prevent="addHighscore">
      Username: <input type="text" v-model="highscoreUsername" required>
      Highscore: <input type="number" v-model="highscoreValue" required>
      <input type="submit" value="Add Highscore">
    </form>
  </div>
</template>

<script>
import HighscoreService from '@/services/HighscoreService.js';

export default {
  // ... (Der Rest des Codes bleibt unverändert) ...

  methods: {
    register() {
      const userData = {
        username: this.username,
        password: this.password
      };

      HighscoreService.register(userData)
          .then(data => {
            if (data) {
              this.persons.push(data);
            }
          })
          .catch(error => {
            console.error("Fehler bei der Registrierung:", error);
          });
    },
    addHighscore() {
      const highscoreData = {
        username: this.highscoreUsername,
        score: this.highscoreValue
      };

      HighscoreService.addHighscore(highscoreData)
          .then(data => {
            if (data) {
              this.highscores.push(data);
            }
          })
          .catch(error => {
            console.error("Fehler beim Hinzufügen des Highscores:", error);
          });
    }
  }
}
</script>