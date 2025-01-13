import { Types } from "npm:komodo_client";

export const resolveableAlertIdentifier = (alert: Types.Alert): string => {
    return `${alert.target.id}-${alert.data.type}`;
}

export const isAlertType = (types: string[], alert: Types.Alert): boolean => {
    return types.map(x => x.toLocaleLowerCase()).includes(alert.data.type.toLocaleLowerCase());
}