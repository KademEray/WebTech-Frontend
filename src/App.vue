<template>
  <div id="app">
    <!-- Navigationsleiste -->
    <nav class="navbar">
      <div class="nav-buttons">
        <a href="#" @click.prevent="toggleMute" class="speaker" :class="{ 'mute': isMuted }">
          <span></span>
        </a>
        <button @click="showLoginOverlay" class="nav-button">Login</button>
        <button @click="logout" class="nav-button">Logout</button>
      </div>
    </nav>

    <!-- LoginOverlay und Hauptinhalt -->
    <LoginOverlay v-if="!isAuthenticated" @authenticated="handleAuthenticated" />
    <div class="main-container" v-if="isAuthenticated">
      <skin-editor class="skin-editor" v-if="!isLoggedIn" />
      <SnakeGame :is-muted="isMuted" class="snake-game" />
      <Highscore-list class="Highscore-container" />
    </div>
  </div>
</template>

<script>
import LoginOverlay from './component/LoginOverlay.vue';
import SnakeGame from './component/SnakeGameComponent.vue';
import SkinEditor from './component/SkinEditorComponent.vue';
import HighscoreList from './component/HighscoreList.vue';

export default {
  name: 'App',
  components: {
    LoginOverlay,
    SnakeGame,
    SkinEditor,
    HighscoreList,
  },
  data() {
    return {
      isLoggedIn: false,
      isAuthenticated: false,
      isMuted: false,
    };
  },
  methods: {

    showLoginOverlay() {
      this.isAuthenticated = false; // Zeigt das Login-Overlay
    },
    logout() {
      this.isAuthenticated = false;
      this.isLoggedIn = false;

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

      // Hier kann die Logout-Logik hinzugefügt werden, z.B. Token entfernen
    },
    handleAuthenticated() {
      this.isAuthenticated = true;
    },

    toggleMute() {
      this.isMuted = !this.isMuted;
    },

  },

};
</script>

<style>
@font-face {
  font-family: 'Rocher';
  src: url('https://assets.codepen.io/9632/RocherColorGX.woff2');
}

/* Navigationsleiste */
.navbar {
  font-family: 'Rocher', sans-serif;
  display: flex;
  justify-content: space-between; /* Gleiche Verteilung der Elemente in der Leiste */
  padding: 5px;
  background-color: #34495e;
  hight: 50px;
}

/* Container für die Buttons */
.nav-buttons {
  display: flex;
  align-items: center;
}

/* Buttons in der Navigationsleiste */
.nav-button {
  font-family: 'Rocher', sans-serif;
  background-color: #4CAF50; /* Grüne Farbe wie im LoginOverlay */
  color: white;
  border: none;
  padding: 7px 40px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 22px;
  margin-left: 185px;
}

.nav-button:not(:last-child) {
  margin-right: 30px; /* 30px Abstand zwischen den Buttons */
}

.nav-button:hover {
  background-color: #45a049; /* Farbwechsel beim Hover */
}

.speaker {
  margin-left: 20px;
  margin-right: 2030px;
  height: 60px; /* Halbe Größe */
  width: 60px;
  position: relative;
  overflow: hidden;
  display: inline-block;

  span {
    display: block;
    width: 16px; /* Halbe Breite */
    height: 16px; /* Halbe Höhe */
    background: #fff;
    margin: 22px 0 0 4px; /* Angepasste Position */


    &:after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-style: solid;
      border-color: transparent #fff transparent transparent;
      border-width: 20px 28px 20px 30px; /* Halbe Größe */
      left: -26px; /* Angepasste Position */
      top: 10px; /* Angepasste Position */
    }

    &:before {
      transform: rotate(45deg);
      border-radius: 0 100px 0 0; /* Angepasster Radius */
      content: '';
      position: absolute;
      width: 10px; /* Halbe Breite */
      height: 10px; /* Halbe Höhe */
      border-style: double;
      border-color: #fff;
      border-width: 14px 14px 0 0; /* Halbe Dicke */
      left: 36px; /* Angepasste Position */
      top: 18px; /* Angepasste Position */
      transition: all 0.2s ease-out;
    }
  }

  &:hover {
    span:before {
      transform: scale(.8) translate(-6px, 0) rotate(42deg); /* Angepasste Transformation */
    }
  }

  &.mute {
    span:before {
      transform: scale(.5) translate(-30px, 0) rotate(36deg); /* Angepasste Transformation */
      opacity: 0;
    }
  }
}

/* Hauptcontainer-Stile */
.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  padding: 20px;
}

/* Skin-Editor-Stile */
.skin-editor {
  margin: 0 50px; /* 100px Abstand links und rechts */
  height: 708px;
}

/* Spiel-Container Stile */
.snake-game {
  margin: 0 50px; /* 100px Abstand links und rechts */
}

/* Highscore-Container Stile */
.Highscore-container {
  margin: 0 50px; /* 100px Abstand links und rechts */
  height: 708px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0; /* Entfernt den Standardrand */
  padding: 0; /* Entfernt den Standardabstand */
}
body {
  background-color: RGB(72, 159, 181); /* Pastellgrün */
}

html, body {
  margin: 0; /* Entfernt den Standardrand */
  padding: 0; /* Entfernt den Standardabstand */
  /* Ihre anderen Stile... */
}

</style>

