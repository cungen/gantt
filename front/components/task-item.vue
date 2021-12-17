<template lang="pug">
.task-item
    .rect(:style='style')
</template>
<script>
import { get } from "lodash";
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
                };
            },
        },
    },
    computed: {
        style() {
            // const left = this.timeScale(this.data.start);

            return {
                // left: left + "px",
                // width: this.timeScale(this.data.end) - left + "px",
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
