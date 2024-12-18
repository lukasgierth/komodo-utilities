import { parseRegexSingle } from "npm:@foxxmd/regex-buddy-core@0.1.2";
import normalizeUrl from "npm:normalize-url@8.0.1";
import { URLData } from "./atomic.ts";

const QUOTES_UNWRAP_REGEX: RegExp = new RegExp(/^"(.*)"$/);

export const normalizeWebAddress = (val: string): URLData => {
    let cleanUserUrl = val.trim();
    const results = parseRegexSingle(QUOTES_UNWRAP_REGEX, val);
    if (results !== undefined && results.groups && results.groups.length > 0) {
        cleanUserUrl = results.groups[0];
    }

    let normal = normalizeUrl(cleanUserUrl, {removeTrailingSlash: true});
    const u = new URL(normal);
    let port: number;

    if (u.port === '') {
        port = u.protocol === 'https:' ? 443 : 80;
    } else {
        port = parseInt(u.port);
        // if user val does not include protocol and port is 443 then auto set to https
        if(port === 443 && !val.includes('http')) {
            if(u.protocol === 'http:') {
                u.protocol = 'https:';
            }
            normal = normal.replace('http:', 'https:');
        }
    }
    return {
        url: u,
        normal,
        port
    }
}

export const truncateStringToLength = (length: any, truncStr = '...') => (val: any = '') => {
    if (val === null) {
        return '';
    }
    const str = typeof val !== 'string' ? val.toString() : val;
    return str.length > length ? `${str.slice(0, length)}${truncStr}` : str;
}

/**
 * Returns value if it is a non-empty string or returns default value
 * */
export const nonEmptyStringOrDefault = <T = undefined>(str: any, 
    // @ts-expect-error this is fine
    defaultVal: T = undefined): string | T => {
    if (str === undefined || str === null || typeof str !== 'string' || str.trim() === '') {
        return defaultVal;
    }
    return str;
}

interface ArrParseOpts {
    lower?: boolean
    split?: string
}

export const parseArrayFromMaybeString = (value: string | string[] = '', opts: ArrParseOpts = {}) => {
    const {lower = false, split = ','} = opts;
    let arr: string[] = [];
    if (Array.isArray(value)) {
        arr = value;
    } else if (value.trim() === '') {
        return [];
    } else {
        arr = value.split(split);
    }
    arr = arr.map(x => x.trim());
    if (lower) {
        arr = arr.map(x => x.toLowerCase());
    }
    return arr;
}