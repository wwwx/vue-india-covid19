import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: false,
        themes: {
            light: {
                primary: '#3f51b5',
            },
            dark: {
                primary: '#1e1e30',
            },
        }
    }
});
