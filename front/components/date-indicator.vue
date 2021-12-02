<template lang="pug">
.indicator
    svg(width='100%' height='60')
        g.month
            text(x='10' y='20') 04
        g.days
            text(v-for='d in days' :key='d.dateStr' x='30' y='50') {{d.date}}
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        days: {
            type: Array
        },
    },
});
</script>
<style scoped>
.days text {
    width: 40;
}
</style>
