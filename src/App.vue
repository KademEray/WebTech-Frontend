<template>
  <div id="app">
    <div class="main-container">
      <skin-editor />
      <snake-game />
      <login-register v-if="!isLoggedIn" @login-success="handleLoginSuccess" />
    </div>
  </div>
</template>

<script>
import SnakeGame from './component/SnakeGameComponent.vue';
import SkinEditor from './component/SkinEditorComponent.vue';
import LoginRegister from './component/RegistrationComponent.vue'; // Ihr Anmelde- und Registrierungsformular

export default {
  name: 'App',
  components: {
    SnakeGame,
    SkinEditor,
    LoginRegister,
  },
  data() {
    return {
      isLoggedIn: false, // Zustand, der steuert, ob der Benutzer angemeldet ist
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
.main-container {
  display: flex;
  justify-content: space-between;
}
</style>
