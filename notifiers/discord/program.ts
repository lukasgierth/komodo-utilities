import { Types } from "npm:komodo_client";
import { EmbedBuilder, WebhookClient } from "npm:discord.js";
import { CommonAlert, parseAlert } from "../common/alertParser.ts";
import path from "node:path";
import { alertResolvedAllowed, parseOptions } from "../common/options.ts";

const program = () => {
    const DISCORD_WEBHOOK: string = Deno.env.get("DISCORD_WEBHOOK") as string;
    if (DISCORD_WEBHOOK === undefined || DISCORD_WEBHOOK.trim() === "") {
        console.error("DISCORD_WEBHOOK not defined in ENV");
        Deno.exit(1);
    }

    console.log(`Webhook      : ${DISCORD_WEBHOOK}`);

    const hookParts = path.parse(DISCORD_WEBHOOK);
    const token = hookParts.name;
    const id = hookParts.dir.split("/").pop();

    if (id === undefined) {
        console.error(
            "Could not find ID in DISCORD_WEBHOOK. Is the webhook URL properly formed? https://discordjs.guide/popular-topics/webhooks.html#creating-webhooks-through-server-settings",
        );
        Deno.exit(1);
    }
    console.info(`Webhook ID   : ${id}`);
    if (token === undefined) {
        console.error(
            "Could not find token in DISCORD_WEBHOOK. Is the webhook URL properly formed? https://discordjs.guide/popular-topics/webhooks.html#creating-webhooks-through-server-settings",
        );
        Deno.exit(1);
    }
    console.info(`Webhook Token: ${token}`);

    const commonOpts = parseOptions();

    const pushAlert = async (
        data: CommonAlert,
        level: Types.SeverityLevel,
    ): Promise<any> => {
        const embed = new EmbedBuilder();
        switch (level) {
            case Types.SeverityLevel.Ok:
                embed.setColor("#58b9ff");
                break;
            case Types.SeverityLevel.Warning:
                embed.setColor("#fa8020");
                break;
            case Types.SeverityLevel.Critical:
                embed.setColor("#fa2020");
                break;
        }

        embed.setTitle(data.title);
        if (data.subtitle !== undefined) {
            embed.setDescription(data.subtitle);
        }
        if (data.message !== undefined) {
            embed.addFields({ name: "Message", value: data.message });
        }

        const client = new WebhookClient({ id, token });
        try {
            const msg = await client.send({
                embeds: [embed],
            });
        } catch (e) {
            throw new Error("Failed to send Discord Webhook", { cause: e });
        }
    };

    const server = Deno.serve({ port: 7000 }, async (req) => {
        const alert: Types.Alert = await req.json();
        console.log(`Recieved data from ${req.headers.get("host")}...`);

        let data: CommonAlert;

        try {
            data = parseAlert(alert, { ...commonOpts, markdown: true });
        } catch (e) {
            console.debug("Komodo Alert Payload:", alert);
            console.error(e);
            return new Response();
        }

        if(!alertResolvedAllowed(commonOpts.allowedResolveTypes, alert.resolved)) {
            console.debug(`Not pushing alert because Alert is ${alert.resolved ? 'resolved' : 'unresolved'} which is not included in allowed resolved types of '${commonOpts.allowedResolveTypes}'`);
            return new Response();
        }

        try {
            await pushAlert(data, alert.level);
        } catch (e) {
            console.debug("Komodo Alert Payload:", alert);
            console.error(
                new Error("Failed to push Alert to Gotify", { cause: e }),
            );
        }

        return new Response();
    });

    return server;
};

export { program };
