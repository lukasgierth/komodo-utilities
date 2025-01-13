import { setTimeout, clearTimeout } from "node:timers";
import { alertResolvedAllowed, CommonOptions } from "./options.ts";
import { Types } from "npm:komodo_client";
import { isAlertType, resolveableAlertIdentifier } from "./alertUtils.ts";

const alertFriendly = (alert: Types.Alert): string => `Alert ${alert._id} for ${alert.target.id}-${alert.data.type}`;

export const createNotifierPipe = (opts: CommonOptions) => {

    const {
        resolverTimeout,
        resolverTypes = [],
        allowedResolveTypes
    } = opts;

    const resolverTimeouts = new Map<string,NodeJS.Timeout>();

    return async (alert: Types.Alert, pushFunc: () => Promise<void>) => {

        if(!alertResolvedAllowed(allowedResolveTypes, alert.resolved)) {
            console.debug(`Not pushing ${alertFriendly(alert)} becuase it is ${alert.resolved ? 'resolved' : 'unresolved'} which is not included in allowed resolved types of '${allowedResolveTypes}'`);
            return;
        }

        if(resolverTimeout === undefined || (resolverTypes.length > 0 && !isAlertType(resolverTypes, alert))) {
            console.debug(`Pushing ${alertFriendly(alert)}`);
            return await pushFunc();   
        }

        const id = resolveableAlertIdentifier(alert);

        if(alert.resolved) {
            // if we had a waiting unresolved then the assumption is we *do not* want to notify of the resolved status
            // since it was transient
            if(resolverTimeouts.has(id)) {
                console.debug(`Not pushing ${alertFriendly(alert)} because it is RESOVLED and had an UNRESOLVED notification that was wait waiting to be pushed (and has now been canceled).`)
                clearTimeout(resolverTimeouts.get(id));
                resolverTimeouts.delete(id);
                return;
            } else {
                // if there was no unresolved then the unresolved was either already sent or there was never an unresolved to begin with
                // in either case, notify of resolved
                console.debug(`Pushing ${alertFriendly(alert)}`);
                return await pushFunc();
            }
        } else {
            // at this point we know the alert is unresolved 
            // and alert was either in resolverTypes or resolverTypes was empty (wait on all unresolved)

            if(resolverTimeouts.has(id)) {
                // if alert was produced again, before previous timeout has ended, clear the previous
                console.debug(`${alertFriendly(alert)} -- replacing previously waiting notification of same type (reset timeout)`);
                clearTimeout(resolverTimeouts.get(id));
                resolverTimeouts.delete(id);
            }

            const timeout = setTimeout(async () => {
                console.debug(`${alertFriendly(alert)} -- timeout of ${resolverTimeout} lapsed, pushing`);
                await pushFunc();
                resolverTimeouts.delete(id);
            }, resolverTimeout);

            console.debug(`${alertFriendly(alert)} -- set timeout for ${resolverTimeout} ms`);
            resolverTimeouts.set(id, timeout);
        }

        return;
    };
}