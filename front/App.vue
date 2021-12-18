<template lang="pug">
.app-container
    .app-header
        .tools
            NSpace
                NRadioGroup(size="medium" type='primary' v-model:value="viewType" @change="updateTasksStatus")
                    NRadioButton(value="project") Projects
                    NRadioButton(value="user") Members
                NDatePicker(v-model='currentDate' @update:value='handleDateChange')

        DateIndicator(:days='days')
    .app-main(ref='pan')
        .task-group(v-for='(list,k) in realTask' :key='k')
            TaskTitle(:title='k')
            TaskList(:list='list' :viewType='viewType')
    .app-footer

</template>

<script>
import { defineComponent, ref } from "vue";
import { forEach, groupBy, range } from "lodash";
import * as d3 from "d3";
import dayjs from "dayjs";
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
                        x: 0,
                        width: 0,
                    },
                    {
                        project: "优化迭代",
                        user: "张三",
                        start: "2020-02-10",
                        end: "2020-02-13",
                        x: 0,
                        width: 0,
                    },
                    {
                        project: "新功能A",
                        user: "张三",
                        start: "2020-02-10",
                        end: "2020-02-13",
                        x: 0,
                        width: 0,
                    },
                    {
                        project: "优化迭代",
                        user: "李四",
                        start: "2020-02-06",
                        end: "2020-02-08",
                        x: 0,
                        width: 0,
                    },
                    {
                        project: "新功能A",
                        user: "李四",
                        start: "2020-02-08",
                        end: "2020-02-15",
                        x: 0,
                        width: 0,
                    },
                ],
            },
            realTask: [],
            zoom: d3.zoom().scaleExtent([1, 1]).on("zoom", this.handleZoom),
            panWidth: 0,
            timeScale: null,
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
        this.handleDataUpdate();
        this.bindZoom();
        window.addEventListener("resize", this.handleWindowResize);
        this.handleWindowResize();
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.handleWindowResize);
    },
    methods: {
        handleWindowResize() {
            this.panWidth = this.$refs.pan.clientWidth;
            this.updateAxisDays();
        },
        updateAxisDays() {
            this.timeScale = d3
                .scaleLinear()
                .domain([lastX, lastX + 30])
                .range([
                    startDate.unix() * 1000,
                    dayjs(startDate).add(1, "day").unix() * 1000,
                ]);
            let startUnix = this.timeScale(0);
            startUnix = startUnix - (startUnix % (1000 * 24 * 60 * 60));

            this.days = range(
                this.timeScale.invert(startUnix),
                this.panWidth,
                30
            ).map((x) => {
                return {
                    day: dayjs(this.timeScale(x)),
                    x,
                };
            });
        },
        handleDataUpdate() {
            this.data.tasks.forEach((task) => {
                if (!task.startDay) {
                    task.startDay = dayjs(task.start);
                    task.endDay = dayjs(task.end);
                }
            });
            const start = this.data.tasks[0].start;
            this.assignColor(
                Array.from(new Set(this.data.tasks.map((item) => item.user)))
            );
            this.handleDateChange(start);
            this.updateAxisDays();
            this.updateTasksStatus();
        },
        handleDateChange(v) {
            startDate = dayjs(v);
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
        updateTasksStatus() {
            const tasks = groupBy(this.data.tasks, this.viewType);
            forEach(tasks, (list) => {
                list.forEach((task) => {
                    task.x = Math.max(
                        0,
                        this.timeScale.invert(task.startDay.unix() * 1000)
                    );
                    task.width = Math.max(
                        0,
                        this.timeScale.invert(task.endDay.unix() * 1000) -
                            task.x
                    );
                });
            });
            this.realTask = tasks;
        },
        bindZoom() {
            d3.select(this.$refs.pan).call(this.zoom);
        },
        handleZoom(e) {
            lastX = e.transform.x;
            this.updateAxisDays();
            this.updateTasksStatus();
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
.app-footer {
    flex: 0 0 26px;
    align-items: center;
    background: #f0f0f0;
}
.task-group {
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
}
.task-group:last-child {
    border-bottom: 0;
}
svg {
    width: 100%;
    height: 100%;
}
</style>
