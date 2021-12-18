<template lang="pug">
.task-item
    .rect(:style='style')
        .label {{viewType === 'project' ? data.user : data.project}}
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
        viewType: {
            type: String,
            default: "",
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
    display: flex;
    position: relative;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
}
.label {
    position: relative;
    height: 16px;
    line-height: 16px;
    padding: 0 4px;
    margin: 0 4px;
    z-index: 10;
    border-radius: 2px;
    color: #343434;
    background: rgba(255, 255, 255, 0.35);
    font-size: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.rect {
    position: absolute;
    top: 2px;
    bottom: 2px;
    display: flex;
    align-items: center;
    width: auto;
    overflow: hidden;
    background-color: lightgray;
    border-radius: 2px;
}
</style>
