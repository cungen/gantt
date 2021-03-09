const app = new Vue({
    el: '#app',
    data: {
        title: '',
        taskGroup: []
    },
    mounted: function () {
        window.addEventListener('message', this.onMessage);
    },
    beforeDestroy: function () {
        window.removeEventListener('message', this.onMessage);
    },
    methods: {
        onMessage: function ({ data }) {
            const groupInfo = {
                default: {
                    name: '',
                    children: []
                }
            };
            this.title = data.title || '';
            (data.tasks || []).forEach(task => {
                if (task.project) {
                    if (!groupInfo[task.project]) {
                        groupInfo[task.project] = {
                            name: task.project,
                            children: []
                        };
                    }
                    groupInfo[task.project].children.push(task);
                } else {
                    groupInfo.default.children.push(task);
                }
            });
            this.taskGroup = Object.values(groupInfo);
        }
    }
});
