import { Types } from "npm:komodo_client";
import { formatNumber } from "../../common/utils.ts";

export interface CommonAlert {
    title: string;
    subtitle: string | undefined;
    message: string | undefined;
}

export interface ParsingOptions {
    levelInTitle?: boolean;
}

export const parseAlert = (
    alert: Types.Alert,
    options: ParsingOptions = {},
): CommonAlert => {
    const {
        levelInTitle = true,
    } = options;

    const {
        data: {
            type,
            data,
        } = {},
    } = alert;

    const message: string[] = [];
    const title: string[] = [];
    const subtitle: string[] = [];

    let titleStr: string = "";
    let messageStr: string = "";
    let subtitleStr: string = "";

    try {
        if (levelInTitle) {
            title.push(`[${alert.level}]`);
        }
        title.push(`${type}`);

        if (data !== undefined) {
            if ("name" in data) {
                subtitle.push(`for ${data.name}`);
            }
            if ("server_name" in data) {
                subtitle.push(`on ${data.server_name}`);
            }

            switch (type) {
                case "ServerCpu":
                    message.push(
                        `Hit ${formatNumber(data.percentage, { max: 0 })}%`,
                    );
                    break;
                case "ServerMem":
                    message.push(
                        `Used ${formatNumber(data.used_gb)}/${
                            formatNumber(data.total_gb)
                        }GB`,
                    );
                    break;
                case "ServerDisk":
                    message.push(
                        `Disk at ${data.path} used ${
                            formatNumber(data.used_gb)
                        }/${formatNumber(data.total_gb)}GB`,
                    );
                    break;
                case "StackImageUpdateAvailable":
                    message.push(
                        `Service ${data.service} | Image ${data.image}`,
                    );
                    break;
                case "DeploymentImageUpdateAvailable":
                    message.push(`Image ${data.image}`);
                    break;
                case "AwsBuilderTerminationFailed":
                    message.push(
                        `Instance ${data.instance_id} | Reason: ${data.message}`,
                    );
                    break;
                case "None":
                    break;
                default:
                    if ("err" in data && data.err !== undefined) {
                        message.push(`Err: ${data.err.error}`);
                    }
                    if ("from" in data) {
                        message.push(`From ${data.from}`);
                    }
                    if ("to" in data) {
                        message.push(`To ${data.to}`);
                    }
                    if ("version" in data) {
                        message.push(
                            `Version ${data.version.major}.${data.version.minor}.${data.version.patch}`,
                        );
                    }
                    break;
            }
        }

        return {
            title: title.join(" "),
            subtitle: subtitle.length > 0 ? subtitle.join(" ") : undefined,
            message: message.length > 0 ? message.join(" ") : undefined,
        };
    } catch (e) {
        throw new Error("Error occurred while trying to parse Alert data", {
            cause: e,
        });
    } finally {
        titleStr = title.join(" ");
        subtitleStr = subtitle.length > 0 ? subtitle.join(" ") : "(None)";
        messageStr = message.length > 0 ? message.join(" ") : "(None)";
        console.log(
            `== Alert Summary ==
Title    : ${titleStr}
Subtitle : ${subtitleStr}
Message  : ${messageStr}`,
        );
    }
};
