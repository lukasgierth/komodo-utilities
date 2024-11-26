import { CommonAlert } from "./alertParser.ts";

export const titleAndSubtitle = (alert: CommonAlert): string => {
    if(alert.subtitle !== undefined) {
        return `${alert.title} ${alert.subtitle}`;
    }
    return alert.title;
}