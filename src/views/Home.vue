<template>
    <v-container>
        
        <ul class="Level d-flex justify-space-around" style="padding-left: 0;">
            <li class="level-item" v-for="(data, index) in generalData" :key="index"
                :style="{ color: data.color }"
                >
                <h5>{{ data.label }}</h5>
                <h4>[ {{ data.delta }} ]</h4>
                <h1>{{ data.total }}</h1>
                <app-sparklines class="ma-2" :option="{ value: data.value }"></app-sparklines>
            </li>
        </ul>
    </v-container>
</template>

<style scoped lang="scss">
.Level {
    h5 {
        font-size: 12px!important;
        margin-bottom: .5rem;
    }
    h4 {
        font-size: 13px!important;
    }
    h1 {
        font-size: 20px!important;
    }
    .level-item  {
        display: flex;
        flex-direction: column;
        width: 25%;
        
        > * {
            align-self: center;
        }   
    }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';
import { formatNumber } from '@/utils/commonfunctions';
import AppSparklines from '@/components/AppSparklines.vue';


const defaultOption = {
    width: 4,
    radius: 10,
    padding: 8,
    lineCap: 'round',
    value: [],
    gradientDirection: 'top',
    fill: false,
    type: 'trend',
    color: '',
    autoLineWidth: false,
};

@Component({
    components: {
        AppSparklines
    }
})
export default class Home extends Vue {
    private generalData = [
        {
            type: 'confirmed',
            label: 'Confirmed',
            change: '+123',
            total: '',
            delta: '',
            color: 'rgba(255,7,58,.6)',
            value: [0, 12, 15, 19, 15, 10, 3, 15, 10, 10, 11, 8, 2, 9, 10]
        },
        {
            type: 'active',
            label: 'Active',
            change: '',
            total: '',
            delta: '',
            color: 'rgba(63,81,181,1)',
            value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0]
        },
        {
            type: 'recovered',
            label: 'Recovered',
            change: '+392',
            total: '',
            delta: '',
            color: 'rgba(40,167,69,1)',
            value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0]
        },
        {
            type: 'deaths',
            label: 'Deceased',
            change: '+15',
            total: '',
            delta: '',
            color: 'rgba(108,117,125,1)',
            value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0]
        },
    ];

    public async created() {
        // console.log(JSON.stringify(this.generalData, null, 2))

        try {
            const { data } = await axios.get('https://api.covid19india.org/data.json');
            // console.log(data.statewise[0]);
            const statewise = data.statewise[0];
            this.generalData = this.generalData.map((item: any) => {
                item.total = formatNumber(statewise[item.type]);
                item.delta = formatNumber(statewise['delta' + item.type]);
                return { ...defaultOption, ...item };
            });
        } catch {
            // do error
        }

    }
}
</script>

