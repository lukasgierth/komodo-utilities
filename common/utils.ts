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
