// 时间格式化工具类
export function formatter(date: string, format: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    const hour = ("0" + d.getHours()).slice(-2);
    const minute = ("0" + d.getMinutes()).slice(-2);
    const second = ("0" + d.getSeconds()).slice(-2);

    switch (format) {
        case "yyyy-MM-dd":
            return `${year}-${month}-${day}`;
        case "MM-dd":
            return `${month}-${day}`;
        case "HH:mm:ss":
            return `${hour}:${minute}:${second}`;
        case "yyyy-MM-dd HH:mm:ss":
            return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        default:
            throw new Error(`Unsupported format ${format}`);
    }
}
