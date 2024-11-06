import { Types } from "npm:komodo_client";
import { gotify } from "npm:gotify@1.1.0";

const GOTIFY_URL: string = Deno.env.get("GOTIFY_URL") as string;
if (GOTIFY_URL === undefined || GOTIFY_URL.trim() === "") {
    console.error("GOTIFY_URL not defined in ENV");
    Deno.exit(1);
} else {
    console.info(`Gotify URL: ${GOTIFY_URL}`);
}

const GOTIFY_APP_TOKEN: string = Deno.env.get("GOTIFY_APP_TOKEN") as string;
if (GOTIFY_APP_TOKEN === undefined || GOTIFY_APP_TOKEN.trim() === "") {
    console.error("GOTIFY_APP_TOKEN not defined in ENV");
    Deno.exit(1);
}

const severityLevelPriority: Record<Types.SeverityLevel, number> = {
    [Types.SeverityLevel.Ok]: 3,
    [Types.SeverityLevel.Warning]: 5,
    [Types.SeverityLevel.Critical]: 8,
};

for (const [level, defaultPriority] of Object.entries(severityLevelPriority)) {
    const envLevel = `GOTIFY_${level}_PRIORITY`;
    const envLevelVal = Deno.env.get(envLevel);
    if (envLevelVal !== undefined && envLevelVal.trim() !== "") {
        const intVal = parseInt(envLevelVal);
        if (isNaN(intVal)) {
            console.warn(
                `Value of "${envLevelVal}" for ENV ${envLevel} could not be parsed as integer. Using default priority instead`,
            );
        } else {
            severityLevelPriority[level as Types.SeverityLevel] = intVal;
        }
    }
    console.log(
        `Using Gotify priority ${
            severityLevelPriority[level as Types.SeverityLevel]
        } for Komodo severity level "${level}"`,
    );
}

async function handle_alert(alert: Types.Alert) {
    const {
        data: {
            type,
            data,
        } = {},
    } = alert;

    const message: string[] = [];
    const title: string[] = [];
    const titleName: string[] = [];

    let titleStr: string = "";
    let messageStr: string = "";

    try {
        title.push(`[${alert.level}] ${type}`);

        if (data !== undefined) {
            if ("name" in data) {
                titleName.push(`for ${data.name}`);
            }
            if ("server_name" in data) {
                titleName.push(`on ${data.server_name}`);
            }
            if (titleName.length > 0) {
                title.push(titleName.join(" "));
            }

            switch (type) {
                case "ServerCpu":
                    message.push(`Hit ${data.percentage}%`);
                    break;
                case "ServerMem":
                    message.push(`Used ${data.used_gb}/${data.total_gb}GB`);
                    break;
                case "ServerDisk":
                    message.push(
                        `Disk at ${data.path} used ${data.used_gb}/${data.total_gb}GB`,
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
    } catch (e) {
        throw new Error("Error occurred while trying to parse Alert data", {
            cause: e,
        });
    } finally {
        titleStr = title.join(" ");
        messageStr = message.length > 0 ? message.join(" ") : "";
        console.log(
            `Alert Summary => ${titleStr}${
                messageStr === "" ? "(No Message)" : ` => ${messageStr}`
            }`,
        );
    }

    try {
        await gotify({
            server: GOTIFY_URL,
            app: GOTIFY_APP_TOKEN,
            title: titleStr,
            message: messageStr,
            priority: severityLevelPriority[alert.level],
        });
    } catch (e) {
        throw new Error("Error occurred while trying to push to Gotify", {
            cause: e,
        });
    }
}

Deno.serve({ port: 7000 }, async (req) => {
    const alert: Types.Alert = await req.json();
    console.log(`Recieved data from ${req.headers.get("host")}...`);

    handle_alert(alert).catch((e) => {
        console.error(
            new Error("Failed to push Alert to Gotify", { cause: e }),
        );
    });
    return new Response();
});
