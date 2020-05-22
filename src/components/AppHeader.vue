
<template>
    <v-app-bar app color="primary" dark>
        <div class="d-flex align-center">
            India Covid19 Dashboard
        </div>

        <v-spacer></v-spacer>
<!-- 
        <v-btn
            href="https://github.com/vuetifyjs/vuetify/releases/latest"
            target="_blank"
            text
        >
            <span class="mr-2">Latest Release</span>
            <v-icon>mdi-open-in-new</v-icon>
        </v-btn> -->
        <change-theme-btn></change-theme-btn>
    </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ChangeThemeBtn from './ChaneThemeBtn.vue';

@Component({
    components: {
        ChangeThemeBtn
    }
})
export default class AppHeader extends Vue {
}
</script>
