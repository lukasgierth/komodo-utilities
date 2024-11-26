export const formatNumber = (
    num: number,
    options: { max?: number; min?: number } = {},
): string => {
    const { max = 2, min } = options;
    return Intl.NumberFormat("en-US", {
        maximumFractionDigits: max,
        minimumFractionDigits: min,
    }).format(num);
};

export const valToBoolean = (val: string | undefined): boolean | undefined => {
    if (val === undefined || val.trim() === "") {
        return undefined;
    }
    const clean = val.trim().toLocaleLowerCase();
    if (clean === "1" || clean === "true") {
        return true;
    } else if (clean === "0" || clean === "false") {
        return false;
    }
    throw new Error(`Expected truthy value but got '${val}'`);
};