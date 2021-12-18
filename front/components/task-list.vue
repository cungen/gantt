<template lang="pug">
.task-list
    TaskItem(v-for='(item,index) in list' :key='index' :data='item' :viewType='viewType')
</template>
<script>
import { defineComponent } from "vue";
import TaskItem from "./task-item.vue";

export default defineComponent({
    components: {
        TaskItem,
    },
    props: {
        list: {
            type: Array,
            default() {
                return [];
            },
        },
        viewType: {
            type: String,
            default: "",
        },
    },
});
</script>
