<template>
  <div id="app">
    <HighscoresList />
  </div>
</template>

<script>
import HighscoresList from './components/HighscoresList.vue'

export default {
  components: {
    HighscoresList
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
</style>
