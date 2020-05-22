<template>
    <v-app>
        <app-header></app-header>
        <v-content>
            <router-view></router-view>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppHeader from './components/AppHeader.vue';

@Component({
    components: {
        AppHeader
    }
})
export default class  extends Vue {
}
</script>

