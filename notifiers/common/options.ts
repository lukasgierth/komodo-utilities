import { valToBoolean } from "../../common/utils.ts";

export type ResolvedType = "resolved" | "unresolved";

export interface CommonOptions {
    levelInTitle?: boolean;
    resolvedIndicator?: boolean;
    allowedResolveTypes?: ResolvedType[];
}

export const asResolvedType = (val: string): val is ResolvedType => {
    return val === "resolved" || val === "unresolved";
};

export const parseOptions = (data: CommonOptions = {}) => {
    const {
        levelInTitle: lit,
        resolvedIndicator: ri,
        allowedResolveTypes: fr,
    } = data;

    let levelInTitle = lit;
    if (levelInTitle === undefined) {
        try {
            levelInTitle = valToBoolean(Deno.env.get("LEVEL_IN_TITLE"));
        } catch (e) {
            console.warn(
                "Could not parse LEVEL_IN_TITLE to a truthy value, will use notifier default",
                { cause: e },
            );
        }
    }

    let resolvedIndicator = ri;
    if (resolvedIndicator === undefined) {
        try {
            resolvedIndicator = valToBoolean(Deno.env.get("INDICATE_RESOLVED"));
        } catch (e) {
            console.warn(
                "Could not parse INDICATE_RESOLVED to a truthy value, will use notifier default",
                { cause: e },
            );
        }
    }

    let allowedResolveTypes = fr;
    if (allowedResolveTypes === undefined) {
        const types = Deno.env.get("ALLOW_RESOLVED_TYPE");
        if(types === undefined || types.trim() === '') {
            allowedResolveTypes = undefined;
        } else {
            try {
                allowedResolveTypes = parseResolvedTypesString(types);
            } catch (e) {
                throw new Error(`Could not parse 'ALLOW_RESOLVED_TYPE' ENV`, {cause: e});
            }
        }
    }
    return {
        levelInTitle,
        resolvedIndicator,
        allowedResolveTypes
    }
};

export const parseResolvedTypesString = (str: string): ResolvedType[] => {
    let allowedResolveTypes: ResolvedType[] = [];

    const splitTypes = str.split(',').map(x => x.trim().toLocaleLowerCase());
    const badTypes = splitTypes.filter(x => !asResolvedType(x));
    if(badTypes.length > 0) {
        throw new Error(`Invalid resolve types found, values must be either 'resolved' or 'unresolved'. Invalid found: ${badTypes.join(',')}`);
    }
    allowedResolveTypes = Array.from(new Set(splitTypes)) as ResolvedType[];
    return allowedResolveTypes;
}

export const resolvedTypesToVal = (types: ResolvedType[]): boolean[] => {
    const vals: boolean[] = [];
    if(types.includes('resolved')) {
        vals.push(true);
    }
    if(types.includes('unresolved')) {
        vals.push(false);
    }
    return vals;
}

export const alertResolvedAllowed = (types: undefined | ResolvedType[], alertResolved: boolean): boolean => {
    if(types === undefined) {
        return true;
    }
    const allowedTruthyVals = resolvedTypesToVal(types);
    return allowedTruthyVals.includes(alertResolved);
}