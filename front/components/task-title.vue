<template lang="pug">
.task-title {{title}}
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        title: {
            type: String,
            default: "",
        },
    },
});
</script>
<style scoped>
.task-title {
    color: #999;
    font-weight: 500;
}
</style>
