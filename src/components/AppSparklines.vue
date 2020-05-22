<template>
    <v-sparkline
        :value="option.value"
        :smooth="option.radius || false"
        :padding="option.padding"
        :line-width="option.width"
        :stroke-linecap="option.lineCap"
        :gradient-direction="option.gradientDirection"
        :fill="option.fill"
        :type="option.type"
        :color="option.color"
        :auto-line-width="option.autoLineWidth"
        auto-draw
    ></v-sparkline>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';


@Component
export default class AppSparklines extends Vue {
    @Prop() private option!: { [key: string]: any };
}
</script>

