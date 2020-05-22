<template>
  <v-btn color="primary" @click="useDark()">
      {{ !$vuetify.theme.dark ? 'dark' : 'light' }}
  </v-btn>
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
