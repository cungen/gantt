<template lang="pug">
.app-container
    .app-header
        NRadioGroup(size="medium" type='primary' v-model:value="viewType" @change="handleViewTypeChange")
            NRadioButton(value="project") 项目视图
            NRadioButton(value="user") 成员视图
        DateIndicator(:days='days')
    .app-main
        .task-group(v-for='(list,k) in realTask' :key='k')
            TaskTitle(:title='k')
            TaskList(:list='list')
</template>

<script>
import { defineComponent } from "vue";
import { groupBy } from "lodash";
import { rangeDays } from "./utils";
import { NIcon, NRadioGroup, NRadioButton } from "naive-ui";
import DateIndicator from "./components/date-indicator.vue";
import TaskTitle from "./components/task-title.vue";
import TaskList from "./components/task-list.vue";
import { alignColor } from "./composition-api/color";

// const vscode = acquireVsCodeApi?();

// function update(text) {
//     vscode.postMessage({
//         command: "text",
//         text: text,
//     });
// }

export default defineComponent({
    components: {
        NIcon,
        NRadioGroup,
        NRadioButton,
        DateIndicator,
        TaskTitle,
        TaskList,
    },
    setup() {
        return { alignColor };
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
        };
    },
    created() {
        this.days = rangeDays(this.data.tasks[0].start);
        this.handleViewTypeChange();
        this.alignColor(
            Array.from(new Set(this.data.tasks.map((item) => item.user)))
        );

        window.addEventListener("message", (event) => {
            const message = event.data;
            console.log("on msg", event);
            switch (message.command) {
                case "text":
                    console.log("vue on msg", message.text);
                    this.data = message.text;
                    break;
            }
        });
    },
    methods: {
        handleViewTypeChange() {
            this.realTask = groupBy(this.data.tasks, this.viewType);
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
</style>
