<script>
import { defineComponent } from "vue";
import { rangeDays } from "./utils";
import DateIndicator from "./components/date-indicator.vue";

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
.container
    .header
        DateIndicator(:days='days')
    .main
</template>

<style>
body {
    margin: 0;
}
#app {
    height: 100%;
}
</style>
<style scoped>
.container {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
    height: 100%;
    color: #2c3e50;
    flex-direction: column;
}
.header {
    flex: 0 0 80px;
}
.main {
    flex: auto;
    background: #f0f0f0;
}
</style>
