const fs = require("fs");
const colors = require("colors");
const tmi = require("tmi.js");
const commandHandler = require("./command-handler");

let config = JSON.parse(fs.readFileSync("./storage/config.json").toString());
let moduleConfig = config.modules.find(x => x.name === "chat");
let settings = moduleConfig.settings;
let client;

function toConsole(data) {
    let x = new Date().toUTCString();
    console.log(`${colors.underline(`[ ${config.name} ${config.version} ${config.stage} - ${moduleConfig.name.toUpperCase()} - ${x} ]`)} ${data}`);
}

function connect() {
    client = new tmi.Client({
        connection: {
            reconnect: true,
            secure: true
        },
        identity: {
            username: settings.chat_username,
            password: settings.chat_token
        },
        channels: settings.chat_channels
    });

    client.connect().catch(err => { if (err) throw err });

    client.on("logon", () => {
        toConsole(`Logged in to chat as ${colors.yellow(settings.chat_username)}.`)
    });

    client.on("connecting", (a, p) => {
        toConsole(`Connecting to ${colors.yellow(a)}:${colors.yellow(p)}`)
    });

    client.on("reconnect", () => {
        toConsole(`${colors.italic("Attempting to reconnect...")}`)
    });

    client.on("connected", (a, p) => {
        toConsole(`Connected to ${colors.yellow(a)}:${colors.yellow(p)}`)
        if (settings.onlineMsg) {
            settings.chat_channels.forEach(channel => {
                client.say(channel, `🤖 ${config.name} ${config.version} ${config.stage} is now online.`)
            })
        }
    });

    client.on("disconnected", (reason) => {
        if (!reason) {
            toConsole(`${colors.red("Disconnected from chat.")}`)
        } else {
            toConsole(`${colors.red("Disconnected from chat:")} ${reason}`)
        }
    });

    client.on("notice", (channel, msgid, message) => {
        toConsole(`${colors.yellow(channel)} - ${colors.italic(message)}`)
    });

    client.on("ban", (channel, username, reason, tags) => {
        if (!reason) {
            toConsole(`${colors.yellow(channel)} - ${colors.cyan(username)} was banned.`)
        } else {
            toConsole(`${colors.yellow(channel)} - ${colors.cyan(username)} was banned: ${colors.italic(reason)}`)
        }
    });

    client.on("timeout", (channel, username, reason, duration, tags) => {
        if (!reason) {
            toConsole(`${colors.yellow(channel)} - ${colors.cyan(username)} was timed out for ${colors.cyan(`${duration}s`)}.`)
        } else {
            toConsole(`${colors.yellow(channel)} - ${colors.cyan(username)} was timed out for ${colors.cyan(`${duration}s`)}: ${colors.italic(reason)}`)
        }
    });

    client.on("messagedeleted", (channel, username, message, tags) => {
        toConsole(`${colors.yellow(channel)} - Message by ${colors.cyan(username)} was deleted: ${colors.italic(message)}`)
    });

    client.on("emoteonly", (channel, enabled) => {
        if (enabled) {
            toConsole(`${colors.yellow(channel)} - Emote only enabled.`)
        } else {
            toConsole(`${colors.yellow(channel)} - Emote only is no longer enabled.`)
        }
    });

    client.on("followersonly", (channel, enabled, length) => {
        if (enabled) {
            if (length === 0) {
                toConsole(`${colors.yellow(channel)} - Follower only mode enabled.`)
            } else {
                toConsole(`${colors.yellow(channel)} - ${colors.cyan(`${length}m`)} follower only mode enabled.`)
            }
        } else {
            toConsole(`${colors.yellow(channel)} - Follower only mode is no longer enabled.`)
        }
    });

    client.on("subscribers", (channel, enabled) => {
        if (enabled) {
            toConsole(`${colors.yellow(channel)} - Subscriber only mode enabled.`)
        } else {
            toConsole(`${colors.yellow(channel)} - Subscriber only mode is no longer enabled.`)
        }
    });

    client.on("r9kbeta", (channel, enabled) => {
        if (enabled) {
            toConsole(`${colors.yellow(channel)} - Unique mode (R9K) enabled.`)
        } else {
            toConsole(`${colors.yellow(channel)} - Unique mode (R9K) is no longer enabled.`)
        }
    });

    client.on("clearchat", (channel) => {
        toConsole(`${colors.yellow(channel)} - Chat was cleared.`)
    });

    client.on("slowmode", (channel, enabled, length) => {
        if (enabled) {
            toConsole(`${colors.yellow(channel)} - ${colors.cyan(`${length}s`)} slow mode enabled.`)
        } else {
            toConsole(`${colors.yellow(channel)} - Slow mode is no longer enabled.`)
        }
    });

    client.on("hosting", (channel, target, viewers) => {
        toConsole(`${colors.yellow(channel)} - Now hosting ${colors.cyan(target)} with ${colors.cyan(viewers)} viewers.`)
    });

    client.on("hosted", (channel, username, viewers, isAutohost) => {
        if (isAutohost) {
            toConsole(`${colors.yellow(channel)} - Autohost by ${colors.cyan(username)} with ${colors.cyan(viewers)} viewers.`)
        } else {
            toConsole(`${colors.yellow(channel)} - Hosted by ${colors.cyan(username)} with ${colors.cyan(viewers)} viewers.`)
        }
    });

    client.on("raided", (channel, username, viewers) => {
        toConsole(`${colors.yellow(channel)} - Raided by ${colors.cyan(username)} with ${colors.cyan(viewers)} viewers.`)
    });

    client.on("subscription", (channel, username, method, message, tags) => {
        if (!message) {
            toConsole(`${colors.yellow(channel)} - ${colors.cyan(username)} subscribed.`);
        } else {
            toConsole(`${colors.yellow(channel)} - ${colors.cyan(username)} subscribed: ${colors.italic(message)}`)
        }
    });

    client.on("subgift", (channel, username, streak, recipient, method, tags) => {
        toConsole(`${colors.yellow(channel)} - ${colors.cyan(username)} gifted a subscription to ${colors.cyan(recipient)}. They have been subscribed for ${colors.cyan(streak)} month(s).`);
    });

    client.on("giftpaidupgrade", (channel, username, sender, tags) => {
        toConsole(`${colors.yellow(channel)} - ${colors.cyan(username)} is continuing the gifted subscription they received from ${colors.cyan(sender)}.`)
    });

    client.on("whisper", (from, tags, message, self) => {
        if (!self) {
            toConsole(`Whisper from ${colors.cyan(from)}: ${message}`)
        }
    });

    client.on("action", (channel, tags, message, self) => {
        toConsole(`${colors.yellow(channel)} - ${colors.cyan(tags['display-name'])}: ${colors.italic(message)}`)
    });

    client.on("chat", async (channel, tags, message, self) => {
        toConsole(`${colors.yellow(channel)} - ${colors.cyan(tags['display-name'])}: ${message}`);
        commandHandler(channel, tags, message, self);
    });
}

connect();

exports.client = () => {
    return client
}