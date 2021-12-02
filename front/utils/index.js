import dayjs from "dayjs";

export function rangeDays(start = dayjs(), end) {
    const rs = [];
    let temp = dayjs(start);
    end = end ? end : start.add(90, "d");

    while (temp.isBefore(end)) {
        const dateStr = temp.format('YYYY-MM-DD');
        const [year, month, date] = dateStr.split('-');
        rs.push({
            dateStr,
            year,
            month,
            date,
            day: temp.day()
        });
        temp = temp.add(1, "d");
    }
    return rs;
}
