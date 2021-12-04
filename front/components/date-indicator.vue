<template lang="pug">
.date-indicator
    svg(width='100%' height='38')
        g.days
            text(
                v-for='(d,index) in days'
                :key='d.dateStr'
                :x='timeScale(d.dateStr)'
                y='26'
            ) {{d.date}}

</template>
<script>
import { defineComponent } from "vue";
import { useScaleTime } from "../composition-api/scale";
import { get } from "lodash";

export default defineComponent({
    props: {
        days: {
            type: Array,
            default() {
                return [];
            },
        },
    },
    setup(props) {
        const timeScale = useScaleTime({
            domain: [get(props.days, "[0].dateStr")],
        });
        return {
            timeScale,
        };
    },
});
</script>
<style scoped>
.date-indicator {
    height: 38px;
}
.days text {
    fill: #666;
    border: 1px solid #e0e0e0;
}
</style>
