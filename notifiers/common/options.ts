import { Types } from "npm:komodo_client";
import { valToBoolean } from "../../common/utils.ts";

export type ResolvedType = "resolved" | "unresolved";
export type AlertTypes = Types.Alert['data']['type'];

export interface CommonOptions {
    levelInTitle?: boolean;
    resolvedIndicator?: boolean;
    allowedResolveTypes?: ResolvedType[];
    resolverTimeout?: number
    resolverTypes?: AlertTypes[]
}

export const asResolvedType = (val: string): val is ResolvedType => {
    return val === "resolved" || val === "unresolved";
};

export const parseOptions = (data: CommonOptions = {}) => {
    const {
        levelInTitle: lit,
        resolvedIndicator: ri,
        allowedResolveTypes: fr,
        resolverTypes: rt,
        resolverTimeout: rtime,
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

    let resolverTypes = rt;
    if (resolverTypes === undefined) {
        const types = Deno.env.get("UNRESOLVED_TIMEOUT_TYPES");
        if(types === undefined || types.trim() === '') {
            resolverTypes = undefined;
        } else {
            try {
                resolverTypes = parseAlertTypesString(types);
            } catch (e) {
                throw new Error(`Could not parse 'UNRESOLVED_TIMEOUT_TYPES' ENV`, {cause: e});
            }
        }
    }

    let resolverTimeout = rtime;
    if (resolverTimeout === undefined) {
        const timeVal = Deno.env.get("UNRESOLVED_TIMEOUT");
        if(timeVal !== undefined) {
            const time = Number.parseInt(timeVal);
            if(Number.isNaN(time)) {
                throw new Error(`Could not parse 'UNRESOLVED_TIMEOUT' ENV as a number`);
            }
            resolverTimeout = time;
        }
    }

    return {
        levelInTitle,
        resolvedIndicator,
        allowedResolveTypes,
        resolverTypes,
        resolverTimeout
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

export const parseAlertTypesString = (str: string): AlertTypes[] => {
    let types: AlertTypes[] = [];

    const splitTypes = str.split(',').map(x => x.trim().toLocaleLowerCase());
    // TODO don't have a good way to generate types from TS and don't want to handcode
    // const badTypes = splitTypes.filter(x => !asResolvedType(x));
    // if(badTypes.length > 0) {
    //     throw new Error(`Invalid resolve types found, values must be either 'resolved' or 'unresolved'. Invalid found: ${badTypes.join(',')}`);
    // }
    types = Array.from(new Set(splitTypes)) as AlertTypes[];
    return types;
}