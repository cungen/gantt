<template lang="pug">
.task-item
    .rect(:style='style')
</template>
<script>
import { defineComponent } from "vue";
import { useColor } from "../composition-api/color";

export default defineComponent({
    props: {
        data: {
            type: Object,
            default() {
                return {
                    project: "",
                    user: "",
                    start: "",
                    end: "",
                    x: 0,
                    width: 0,
                };
            },
        },
    },
    computed: {
        style() {
            return {
                left: this.data.x + "px",
                width: this.data.width + "px",
                background: useColor(this.data.user),
            };
        },
    },
});
</script>
<style scoped>
.task-item {
    position: relative;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
}
.rect {
    position: absolute;
    top: 2px;
    bottom: 2px;
    display: block;
    width: auto;
    background-color: lightgray;
}
</style>
