<template>
    <table>
        <thead>
            <tr>
                <th>State/UT</th>
                <th class="is-confirmed">Cnfrmd</th>
                <th class="is-active">Actv</th>
                <th class="is-recovered">Rcvrd</th>
                <th class="is-deaths">Dcsd</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(state, index) in states" :key="index">
                <td>{{ state.state }}</td>
                <td>
                    <span class="delta is-confirmed">
                        <v-icon size="10" v-if="+state.deltaconfirmed">mdi-arrow-up-bold</v-icon>
                        {{ state.deltaconfirmed == 0 ? '' : state.deltaconfirmed }}
                    </span>
                    <span class="total ml-1">{{ state.confirmed }}</span>
                </td>
                <td>
                    <span class="delta is-active">
                        <v-icon size="10" v-if="+state.deltaactive">mdi-arrow-up-bold</v-icon>
                        {{ state.deltaactive == 0 ? '' : state.deltaactive }}
                    </span>
                    <span>{{ state.active }}</span>
                </td>
                <td>
                    <span class="delta is-recovered">
                        <v-icon size="10" v-if="+state.deltarecovered">mdi-arrow-up-bold</v-icon>
                        {{ state.deltarecovered == 0 ? '' : state.deltarecovered }}
                    </span>
                    <span class="total ml-1">{{ state.recovered }}</span>
                </td>
                <td>
                    <span class="delta is-deaths">
                        <v-icon size="10" v-if="+state.deltadeaths">mdi-arrow-up-bold</v-icon>
                        {{ state.deltadeaths == 0 ? '' : state.deltadeaths }}
                    </span>
                    <span class="total ml-1">{{ state.deaths }}</span>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style lang="scss" scoped>
$is-confirmed: rgba(255,7,58,.6);
$is-active: rgba(63,81,181,1);
$is-recovered: rgba(40,167,69,1);
$is-deaths: rgba(108,117,125,1);

table {
    align-self: center;
    border-collapse: separate;
    border-spacing: 3px 4px;
    // font-family: "archia";
    position: relative;
    width: 30rem;

    thead {
        background: rgba(108,117,125,.0627451);
        color: #6c757d;
        font-size: .75rem;
        text-align: left;

        th {
            background: #f6f6f7;
            border-radius: 5px;
            cursor: pointer;
            padding: .5rem;
            position: -webkit-sticky!important;
            position: sticky!important;
            top: 64px;
            transition: all .1s ease-in-out;
            z-index: 99;
            color: #6c757d;
        }

        th.is-confirmed {
            color: $is-confirmed;
        }

        th.is-active {
            color: $is-active;
        }

        th.is-recovered {
            color: $is-recovered;
        }

        th.is-deaths {
            color: $is-deaths;
        }
    }

    tbody {

        tr {
            background: rgba(108,117,125,.0627451);
        }

        td {
            border-radius: 4px;
            font-size: .9rem;
            padding: .25rem;
            text-align: right;
            color: #6c757d;

            &:first-child {
                font-weight: 600;
                max-width: 7.5rem!important;
                text-align: left;
                word-wrap: break-word!important;
            }

            span.delta {
                display: inline-block;
                font-size: 11px!important;

                i {
                    color: inherit;
                    position: relative;
                    top: -.1rem;
                    right: -.2rem;
                }
            }

            span.is-confirmed {
                color: $is-confirmed;
            }

            span.is-active {
                color: $is-active;
            }

            span.is-recovered {
                color: $is-recovered;
            }

            span.is-deaths {
                color: $is-deaths;
            }


        }
    }

    .theme--dark & {
        th, td {
            background-color: #1e1e30!important;
        }
    }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component
export default class AppTable extends Vue {
    @Prop() private states!: any[];
}
</script>
