<template>
  <div id="app">
    <h1>Meine CRUD-Anwendung</h1>
    <BeispielComponent />
  </div>
</template>

<script>
import BeispielComponent from "@/components/BeispielComponent.vue";

export default {
  name: 'App',
  components: {
    BeispielComponent
  }
};
</script>

<style>
/* Deine CSS-Stile hier */
</style>
