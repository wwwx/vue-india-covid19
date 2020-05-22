<template>
  <v-container>
    <v-btn color="primary" @click="useDark()">Use Dark Theme</v-btn>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HelloWorld',

  data: () => ({}),
  methods: {
    useDark() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    }
  }
});
</script>
