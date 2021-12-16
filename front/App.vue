<template lang="pug">
.app-container
    .app-header
        .tools
            NSpace
                NRadioGroup(size="medium" type='primary' v-model:value="viewType" @change="handleViewTypeChange")
                    NRadioButton(value="project") 项目视图2
                    NRadioButton(value="user") 成员视图
                NDatePicker(v-model='currentDate' @update:value='handleDateChange')

        DateIndicator(:days='days')
    .app-main(ref='pan')
        .task-group(v-for='(list,k) in realTask' :key='k')
            TaskTitle(:title='k')
            TaskList(:list='list')
</template>

<script>
import { defineComponent, ref } from "vue";
import { groupBy } from "lodash";
import * as d3 from "d3";
import dayjs from "dayjs";
import { rangeDays } from "./utils";
import {
    NIcon,
    NRadioGroup,
    NRadioButton,
    NDatePicker,
    NSpace,
} from "naive-ui";
import DateIndicator from "./components/date-indicator.vue";
import TaskTitle from "./components/task-title.vue";
import TaskList from "./components/task-list.vue";
import { assignColor } from "./composition-api/color";

// eslint-disable-next-line no-undef
// const vscode = acquireVsCodeApi();

// function update(text) {
//     vscode.postMessage({
//         command: "text",
//         text: text,
//     });
// }
let lastX = 0;
let startDate = null;

export default defineComponent({
    components: {
        NIcon,
        NRadioGroup,
        NRadioButton,
        NDatePicker,
        NSpace,
        DateIndicator,
        TaskTitle,
        TaskList,
    },
    setup() {
        const currentDate = ref("");
        return { assignColor, currentDate };
    },
    data() {
        return {
            days: [],
            viewType: "project",
            data: {
                tasks: [
                    {
                        project: "优化迭代",
                        user: "张三",
                        start: "2020-02-05",
                        end: "2020-02-09",
                    },
                    {
                        project: "新功能A",
                        user: "张三",
                        start: "2020-02-10",
                        end: "2020-02-13",
                    },
                    {
                        project: "优化迭代",
                        user: "李四",
                        start: "2020-02-06",
                        end: "2020-02-08",
                    },
                    {
                        project: "新功能A",
                        user: "李四",
                        start: "2020-02-08",
                        end: "2020-02-15",
                    },
                ],
            },
            realTask: [],
            zoom: d3.zoom().scaleExtent([1, 1]).on("zoom", this.handleZoom),
            panWidth: [],
        };
    },
    created() {
        window.addEventListener("message", (event) => {
            const message = event.data;
            switch (message.command) {
                case "data":
                    console.log("vue on msg", message.data);
                    // this.data = message.text;
                    this.handleDataUpdate(message.data);
                    break;
            }
        });
    },
    mounted() {
        this.panWidth = this.$refs.pan.clientWidth;
        this.bindZoom();
    },
    methods: {
        handleDataUpdate() {
            const start = this.data.tasks[0].start;
            this.days = rangeDays(start);
            this.handleViewTypeChange();
            this.assignColor(
                Array.from(new Set(this.data.tasks.map((item) => item.user)))
            );
            this.handleDateChange(start);
        },
        handleDateChange(v) {
            startDate = dayjs(v);
            console.log(startDate);
            this.resetZoom();
        },
        resetZoom() {
            const { clientWidth, clientHeight } = this.$refs.pan;
            d3.select(this.$refs.pan)
                .transition()
                .call(
                    this.zoom.translateTo,
                    clientWidth * 0.5,
                    clientHeight * 0.5
                );
        },
        handleViewTypeChange() {
            this.realTask = groupBy(this.data.tasks, this.viewType);
        },
        bindZoom() {
            d3.select(this.$refs.pan).call(this.zoom);
        },
        handleZoom(e) {
            lastX = e.transform.x;
            console.log(e.transform);
        },
    },
});
</script>

<style>
body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
}
html,
body,
#app {
    height: 100%;
}
</style>
<style scoped>
.app-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: #2c3e50;
}
.tools {
    display: flex;
    flex-direction: row;
}
.app-header {
    display: flex;
    flex-direction: column;
    flex: 0 0 80px;
    justify-content: flex-end;
    overflow: hidden;
    padding: 0 20px;
    background: #f0f0f0;
}
.app-main {
    flex: auto;
    overflow: auto;
    padding: 16px 20px;
}
svg {
    width: 100%;
    height: 100%;
}
</style>
