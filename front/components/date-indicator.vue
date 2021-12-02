<template lang="pug">
.indicator
    svg(width='100%' height='60')
        g.days
            text(
                v-for='(d,index) in days'
                :key='d.dateStr'
                :x='timeScale(d.dateStr)'
                y='20'
            ) {{d.date}}

</template>
<script>
import { defineComponent } from "vue";
import { useScaleTime } from "../composition-api/scale";
import { get } from "lodash";

export default defineComponent({
    setup(props) {
        const timeScale = useScaleTime({
            domain: [get(props.days, "[0].dateStr")],
        });
        return {
            timeScale,
        };
    },
    props: {
        days: {
            type: Array,
        },
    },
});
</script>
<style scoped>
.days text {
    fill: #666;
}
</style>
