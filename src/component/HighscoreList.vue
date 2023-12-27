<template>
  <div class="Highscore-container">
    <header class="Highscore-header">
    <strong><h1 class="titel">Highscores</h1></strong>
    <div class="separator-line"></div>
    </header>
    <div class="Highscore-content">
    <ul class="Highscore-list">
      <li v-for="(user, index) in users" :key="user.id" :class="{'gold-frame': index === 0, 'silver-frame': index === 1, 'bronze-frame': index === 2, 'logged-in-user': isCurrentUser(user.username)}">
        <span class="rank">{{ index + 1 }}.</span> <!-- Punkt nach der Platzierungsnummer -->
        <span class="username">{{ user.username }}</span>
        <span class="points">{{ user.points }}</span>
      </li>
    </ul>
  </div>
  </div>
</template>



<script>

import {mapState} from "vuex";
  export default {

    computed: {
      ...mapState({
        users: state => state.highscores,
        currentUser: state => state.username,
      }),
    },
    mounted() {
      this.$store.dispatch('fetchHighscores');
    },
    methods: {
      isCurrentUser(username) {
        return this.currentUser === username;
      },
    },
};
</script>

<style scoped>
@font-face {
  font-family: 'Rocher';
  src: url('https://assets.codepen.io/9632/RocherColorGX.woff2');
}
.Highscore-header {
  position: sticky;
  top: 0;
  z-index: 10;
  padding-bottom: 10px; /* Abstand zur Trennlinie */
}
.Highscore-container {
  width: 500px;
  max-height: 80vh;
  overflow: hidden; /* Verhindert Scrollen innerhalb des gesamten Containers */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  height: 900px;
}
.Highscore-content {
  overflow: auto; /* Erlaubt Scrollen innerhalb dieses Elements */
  max-height: calc(80vh - 100px); /* Passt die Höhe an den verbleibenden Platz an, abzüglich der Header-Höhe */
  width: 400px; /* Gleich wie die Breite des Containers */
}

/* Stile für den Scrollbar */
.Highscore-content::-webkit-scrollbar {
  width: 10px;
}

.Highscore-content::-webkit-scrollbar-track {
  background: #f1f1f1; /* Hintergrundfarbe des Scrollbar-Tracks */
}

.Highscore-content::-webkit-scrollbar-thumb {
  background: rgb(252,212,92); /* Ihre gewünschte Scrollbar-Farbe */
  border-radius: 5px;
}

.Highscore-content::-webkit-scrollbar-thumb:hover {
  background: #555; /* Dunklere Farbe beim Hover */
}

/* Firefox Scrollbar Stile */
.Highscore-content {
  scrollbar-width: thin;
  scrollbar-color: rgb(252,212,92) #f1f1f1; /* Border- und Hintergrundfarben */
}

.titel {
  font-family: 'Rocher', sans-serif;
  text-align: center;
  margin-bottom: 10px;
  font-size: 50px;
}

.separator-line {
    margin-bottom: 10px;
    top: 0;
    left: 5%;
    right: 5%;
    width: 90%;
    height: 8px;
    background-image: linear-gradient(to right, transparent, rgb(252,212,92), transparent);

}

.Highscore-list {
  font-family: 'Rocher', sans-serif;
  list-style: none;
  padding: 0;
  width: 100%;
}

.Highscore-list li {
  font-family: 'Rocher', sans-serif;
  display: flex;
  justify-content: space-between; /* Elemente verteilen */
  border-bottom: 1px solid black; /* Dickeren Linienstil */
  padding: 5px 0; /* Abstand oben und unten */
  margin-bottom: 4px; /* Erhöht den Abstand nach unten für jedes Listenelement auf 4px */
}

.rank, .username, .points {
  font-family: 'Rocher', sans-serif;
  flex: 1; /* Gleichmäßige Verteilung der Elemente */
  font-size: 22px;
  font-weight: bold;
  margin-right: 35px;
}

.username {
  font-family: 'Rocher', sans-serif;
  text-align: center; /* Username zentrieren */
}

.points {
  font-family: 'Rocher', sans-serif;
  text-align: right; /* Punkte rechtsbündig */
}

.gold-frame {
  border: 3px solid;
  border-image: linear-gradient(to right, #ffd700, #ffcc00, #ffd700) 1;
  box-shadow: 0 0 12px #ffd700, 0 0 20px #ffd700; /* Stärkster Leuchteffekt für Gold */
}

.silver-frame {
  border: 3px solid;
  border-image: linear-gradient(to right, #c0c0c0, #d9d9d9, #c0c0c0) 1;
  box-shadow: 0 0 8px #c0c0c0, 0 0 15px #c0c0c0; /* Mittlerer Leuchteffekt für Silber */
}

.bronze-frame {
  border: 3px solid;
  border-image: linear-gradient(to right, #cd7f32, #e5ac6d, #cd7f32) 1;
  box-shadow: 0 0 5px #cd7f32, 0 0 10px #cd7f32; /* Schwächerer Leuchteffekt für Bronze */
}

.logged-in-user {
  background-color: #39ff14; /* Lebendiges Grün */
  color: black;
  box-shadow: 0 0 5px #39ff14, /* Leichter äußerer Leuchteffekt */
  0 0 10px #39ff14; /* Stärkerer äußerer Leuchteffekt */
}

/* Zusätzlicher Stil für Text-Leuchteffekt */
.Highscore-list li {
  position: relative;
  z-index: 1;
}

.Highscore-list li::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: inherit;
  box-shadow: inherit;
}
</style>


