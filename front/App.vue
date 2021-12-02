<script>
import { defineComponent } from "vue";
import { rangeDays } from "./utils";
import DateIndicator from "./components/date-indicator.vue";
import { Angry } from "@vicons/fa";
import { NIcon } from 'naive-ui'

// const vscode = acquireVsCodeApi?();

// function update(text) {
//     vscode.postMessage({
//         command: "text",
//         text: text,
//     });
// }

export default defineComponent({
    components: {
        DateIndicator,
        NIcon,
        Angry,
    },
    data() {
        return {
            days: [],
            data: {},
        };
    },
    created() {
        this.days = rangeDays();

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
});
</script>

<template lang="pug">
el-container
    el-header(height='40px')
        DateIndicator(:days='days')
    el-main
        n-icon(size='20' color='cyan'): Angry
        el-time-select(
            start="08:30"
            step="00:15"
            end="18:30"
            placeholder="Select time"
        )
</template>

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
.el-container {
    display: flex;
    height: 100%;
    color: #2c3e50;
    flex-direction: column;
    padding: 24px;
}
.el-main {
    flex: auto;
    background: #f0f0f0;
}
</style>
