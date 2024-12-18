import net from 'node:net';
import { join as joinPath } from "node:path";

export interface PortReachableOpts {
    host: string,
    timeout?: number
}
/**
 * Copied from https://github.com/sindresorhus/is-port-reachable with error reporting
 * */
export const isPortReachable = async (port: number, opts: PortReachableOpts) => {
    const {host, timeout = 1000} = opts;

    const promise = new Promise(((resolve, reject) => {
        const socket = new net.Socket();

        const onError = (e: Error) => {
            socket.destroy();
            reject(e);
        };
        const onTimeout = () => {
            socket.destroy();
            reject(new Error(`Connection timed out after ${timeout}ms`));
        }

        socket.setTimeout(timeout);
        socket.once('error', onError);
        socket.once('timeout', onTimeout);

        socket.connect(port, host, () => {
            socket.end();
            resolve(true);
        });
    }));

    try {
        await promise;
        return true;
    } catch (e) {
        throw e;
    }
}

export const joinedUrl = (url: URL, ...paths: string[]): URL => {
    // https://github.com/jfromaniello/url-join#in-nodejs
    const finalUrl = new URL(url);
    finalUrl.pathname = joinPath(url.pathname, ...(paths.filter(x => x.trim() !== '')));
    return finalUrl;
}