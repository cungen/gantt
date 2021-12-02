import dayjs from "dayjs";

export function useScaleTime({ domain = [], range = [] }) {
    const [start, end] = domain;
    const [startX = 0, endX] = range;
    const startTime = dayjs(start);
    const endTime = dayjs(end ? end : startTime.add(1, "d"));
    const unit =
        (endX ? endX : startX + 30 - startX) /
        (endTime.unix() - startTime.unix());

    return function (val) {
        const date = dayjs(val);
        if (val && date.isValid()) {
            return startX + unit * (date.unix() - startTime.unix());
        }
    };
}
