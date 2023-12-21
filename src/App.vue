<template>
  <div id="app">
    <header>
      <!-- Hier könnte eine Navigationsleiste oder ein Logo eingefügt werden -->
    </header>
    <div class="main-container">
      <skin-editor v-if="!isLoggedIn" />
      <snake-game v-else />
      <login-register v-if="!isLoggedIn" @login-success="handleLoginSuccess" />
    </div>
  </div>
</template>

<script>
import SnakeGame from './component/SnakeGameComponent.vue';
import SkinEditor from './component/SkinEditorComponent.vue';
import LoginRegister from './component/RegistrationComponent.vue';

export default {
  name: 'App',
  components: {
    SnakeGame,
    SkinEditor,
    LoginRegister,
  },
  data() {
    return {
      isLoggedIn: false,
    };
  },
  methods: {
    handleLoginSuccess() {
      this.isLoggedIn = true;
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.main-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
}

header {
  background-color: #34495e;
  padding: 15px;
  color: white;
  text-align: center;
}

/* ... (Weitere individuelle Stile können hinzugefügt werden) */
</style>
