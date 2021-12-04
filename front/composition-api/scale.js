import dayjs from "dayjs";

let instance = null;

export function useScaleTime({ domain = [], range = [] } = {}) {
    if (instance) {
        return instance;
    }

    const [start, end] = domain;
    const [startX = 0, endX] = range;
    const startTime = dayjs(start);
    const endTime = dayjs(end ? end : startTime.add(1, "d"));
    const unit =
        (endX ? endX : startX + 30 - startX) /
        (endTime.unix() - startTime.unix());

    instance = function (val) {
        const date = dayjs(val);
        if (val && date.isValid()) {
            return startX + unit * (date.unix() - startTime.unix());
        }
    };
    return instance;
}
