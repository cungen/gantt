<template lang="pug">
.date-indicator
    svg(width='100%' height='38')
        g.days
            text(
                v-for='(d,index) in days'
                :key='d.day.format("DD/MM/YYYY")'
                :x='d.x'
                y='26'
            ) {{d.day.date()}}

</template>
<script>
import { defineComponent } from "vue";
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
