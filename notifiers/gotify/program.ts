import { Types } from "npm:komodo_client";
import { gotify } from "npm:gotify@1.1.0";
import { CommonAlert, parseAlert } from "../common/alertParser.ts";
import { titleAndSubtitle } from "../common/notifierBuilder.ts";
import { valToBoolean } from "../../common/utils.ts";

const program = () => {
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

    for (
        const [level, defaultPriority] of Object.entries(severityLevelPriority)
    ) {
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

    let levelInTitle: boolean | undefined;
    try {
        levelInTitle = valToBoolean(Deno.env.get("LEVEL_IN_TITLE"));
    } catch (e) {
        console.warn(
            "Could not parse LEVEL_IN_TITLE to a truthy value, will use notifier default",
            { cause: e },
        );
    }

    const pushAlert = async (
        title: string,
        message: string,
        priority: number,
    ): Promise<any> => {
        const payload: Parameters<typeof gotify>[0] = {
            server: GOTIFY_URL,
            app: GOTIFY_APP_TOKEN,
            title: title,
            message: message,
            priority: priority,
        };
        try {
            await gotify(payload);
        } catch (e) {
            console.debug("Gotify Payload", {
                ...payload,
                app: `XXX...${
                    GOTIFY_APP_TOKEN.substring(GOTIFY_APP_TOKEN.length - 3)
                }`,
            });
            throw new Error("Error occurred while trying to push to Gotify", {
                cause: e,
            });
        }
    };

    return Deno.serve({ port: 7000 }, async (req) => {
        const alert: Types.Alert = await req.json();
        console.log(`Recieved data from ${req.headers.get("host")}...`);

        let data: CommonAlert;

        try {
            data = parseAlert(alert, { levelInTitle });
        } catch (e) {
            console.debug("Komodo Alert Payload:", alert);
            console.error(e);
            return new Response();
        }

        try {
            await pushAlert(
                titleAndSubtitle(data),
                data.message ?? "",
                severityLevelPriority[alert.level],
            );
        } catch (e) {
            console.debug("Komodo Alert Payload:", alert);
            console.error(
                new Error("Failed to push Alert to Gotify", { cause: e }),
            );
        }

        return new Response();
    });
};

export { program };
