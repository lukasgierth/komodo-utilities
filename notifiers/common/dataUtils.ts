export const intersect = (a: Array<any>, b: Array<any>) => {
    const setA = new Set(a);
    const setB = new Set(b);
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    return Array.from(intersection);
}


export function sleep(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
}