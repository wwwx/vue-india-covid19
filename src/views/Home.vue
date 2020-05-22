<template>
    <v-container>
        
        <ul class="Level d-flex justify-space-around" style="padding-left: 0;">
            <li class="level-item" v-for="(data, index) in generalData" :key="index"
                :style="{ color: data.color }"
                >
                <h5>{{ data.Label }}</h5>
                <h4 v-if="data.Name==='active'" style="color: transparent;">_</h4>
                <h4 v-else>{{ data.delta }}</h4>
                <h1>{{ data.total }}</h1>
                <app-sparklines class="ma-2" :option="data"></app-sparklines>
            </li>
        </ul>

        <v-row>
            
            <app-table v-if="states.length>0" style="width: 100%;" :states="states"></app-table>
        </v-row>
        
    </v-container>
</template>

<style scoped lang="scss">
.Level {
    h5 {
        font-size: 12px!important;
        margin-bottom: .5rem;
    }
    h4 {
        font-size: 11px!important;
    }
    h1 {
        font-size: 19px!important;
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
import {
    formatNumber,
    parseStateTimeseries,
    preprocessTimeseries,
    parseStateTestTimeseries,
    parseTotalTestTimeseries,
    mergeTimeseries,
} from '@/utils/commonfunctions';
import AppSparklines from '@/components/AppSparklines.vue';
import AppTable from '@/components/AppTable.vue';


const defaultOption = {
    width: 4,
    radius: 10,
    padding: 8,
    lineCap: 'round',
    value: [],
    fill: false,
    type: 'trend',
    color: '',
    autoLineWidth: false,
};

@Component({
    components: {
        AppSparklines,
        AppTable,
    }
})
export default class Home extends Vue {
    private generalData: any = [
        {
            Name: 'confirmed',
            Label: 'Confirmed',
            color: 'rgba(255,7,58,.6)',
        },
        {
            Name: 'active',
            Label: 'Active',
            color: 'rgba(63,81,181,1)',
        },
        {
            Name: 'recovered',
            Label: 'Recovered',
            color: 'rgba(40,167,69,1)',
        },
        {
            Name: 'deaths',
            Label: 'Deceased',
            color: 'rgba(108,117,125,1)',
        },
    ];

    private states: any[] = [];


    public async created() {
        // console.log(JSON.stringify(this.generalData, null, 2))

        try {
            const { data } = await axios.get('https://api.covid19india.org/data.json');
            // console.log(data);
            const statewise = data.statewise[0];
            this.generalData = this.generalData.map((item: any) => {
                item.total = formatNumber(statewise[item.Name]);

                let delta = statewise['delta' + item.Name];
                delta = isNaN(delta)
                    ? ''
                    : delta > 0
                    ? '+' + formatNumber(delta)
                    : '+0';
                item.delta = delta && ('[ ' + delta + ' ]');

                // item.value = Array.from({ length: 20 }, this.heartbeat);

                // console.log({ ...defaultOption, ...item });
                return { ...defaultOption, ...item };
            });


            const { data: statesDailyResponse } = await axios.get('https://api.covid19india.org/states_daily.json');
            const [
                // {data},
                // {data: stateDistrictWiseResponse},
                {data: stateTestData},
            ] = await Promise.all([
                // axios.get('https://api.covid19india.org/data.json'),
                // axios.get('https://api.covid19india.org/state_district_wise.json'),
                axios.get('https://api.covid19india.org/state_test_data.json'),
            ]);
            // console.log(statesDailyResponse);
            const ts: any = parseStateTimeseries(statesDailyResponse);
            ts.TT = preprocessTimeseries(data.cases_time_series);
            // console.log(ts);

            // Testing data timeseries
            // console.log(stateTestData)
            const testTs: any = parseStateTestTimeseries(stateTestData.states_tested_data);
            testTs.TT = parseTotalTestTimeseries(data.tested);
            // console.log(testTs)

            // Merge
            const tsMerged = mergeTimeseries(ts, testTs);

            // console.log(tsMerged.TT);
            const tt = tsMerged.TT;
            const [ confirmed, active, recovered, deceased ] = this.generalData;
            const l = -20;
            confirmed.value = tt.slice(l).map((obj: any) => obj.dailyconfirmed);
            active.value = tt.slice(l).map((obj: any) => obj.dailyactive);
            recovered.value = tt.slice(l).map((obj: any) => obj.dailyrecovered);
            deceased.value = tt.slice(l).map((obj: any) => obj.dailydeceased);


            // table
            this.states = data.statewise
                .filter((item: any) => item.statecode !== 'TT')
                .sort((a: any, b: any) => {
                    const nameA = a.state.toLowerCase();
                    const nameB = b.state.toLowerCase();
                    if (nameA < nameB) {
                        return -1;
                    }

                    if (nameA > nameB) {
                        return 1;
                    }

                    return 0; // default return value (no sorting)
                })
                .map((item: any) => {
                    item.confirmed = formatNumber(item.confirmed);
                    item.active = formatNumber(item.active);
                    item.recovered = formatNumber(item.recovered);
                    item.deaths = formatNumber(item.deaths);
                    item.deltaconfirmed = formatNumber(item.deltaconfirmed);
                    // item.deltaactive = formatNumber(item.deltaactive);
                    item.deltarecovered = formatNumber(item.deltarecovered);
                    item.deltadeaths = formatNumber(item.deltadeaths);
                    return item;
                });
            // console.log(JSON.stringify(this.states[0], null, 4));


        } catch (error) {
            // handle error
        }


    }

    private heartbeat() {
        return Math.ceil(Math.random() * (120 - 80) + 80);
    }
}
</script>

