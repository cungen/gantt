import { COLORS } from "../utils";

let usedIndex = 0;
const aligned = {};

export function assignColor(users = []) {
    users.forEach((user) => {
        aligned[user] = COLORS[usedIndex++];
    });
}

export function useColor(name) {
    return aligned[name];
}
