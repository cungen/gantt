import { withDirectives } from "vue";

function handleMouseDown() {
    console.log("mouse down");
}
function handleMouseUp() {
    console.log("mouse up");
}

export default {
    mounted(el) {
        el.addEventListener("mousedown", handleMouseDown);
        el.addEventListener("mouseup", handleMouseUp);
    },
    beforeUnmount(el) {
        el.removeEventListener("mousedown", handleMouseDown);
        el.removeEventListener("mouseup", handleMouseUp);
    },
};
