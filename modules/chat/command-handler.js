const fs = require("fs");
const chat = require("./index");
const database = require("./database");
const services = require("./services");

let config = JSON.parse(fs.readFileSync("./storage/config.json").toString());

function commandManagerHandler(channel, tags, message, msgParams) {
    switch (msgParams[2].toLowerCase()) {
        case "count":
            chat.client().say(channel, `@${tags['display-name']} - there are currently ${database.list().length} commands in the database. SeemsGood`)
            break;
        case "info":
            if (!msgParams[3]) {
                chat.client().say(channel, `@${tags['display-name']} - command missing parameters. Usage: !${config.name.toLowerCase()} command info [TRIGGER]`)
            } else {
                let x = database.list().find(cmd => cmd.trigger === msgParams[3].toLowerCase())
                if (!x) {
                    chat.client().say(channel, `@${tags['display-name']} - that command doesn't exist. Loser`)
                } else {
                    if (x.enabled) {
                        if (x['created-by'] !== undefined) {
                            if (x['edited-by'] !== undefined) {
                                chat.client().say(channel, `@${tags['display-name']} - ${x.trigger} is enabled. The command was created by ${x['created-by']}, the last edit was by ${x['edited-by']}.`)
                            } else {
                                chat.client().say(channel, `@${tags['display-name']} - ${x.trigger} is enabled. The command was created by ${x['created-by']}.`);
                            }
                        } else {
                            if (x['edited-by'] !== undefined) {
                                chat.client().say(channel, `@${tags['display-name']} - ${x.trigger} is enabled. The command has no owner, likely created via web management. The last edit was by ${x['edited-by']}.`);
                            } else {
                                chat.client().say(channel, `@${tags['display-name']} - ${x.trigger} is enabled. The command has no owner, likely created via web management.`);
                            }
                        }
                    } else {
                        if (x['created-by'] !== undefined) {
                            if (x['edited-by'] !== undefined) {
                                chat.client().say(channel, `@${tags['display-name']} - ${x.trigger} is disabled. The command was created by ${x['created-by']}, the last edit was by ${x['edited-by']}.`)
                            } else {
                                chat.client().say(channel, `@${tags['display-name']} - ${x.trigger} is disabled. The command was created by ${x['created-by']}.`);
                            }
                        } else {
                            if (x['edited-by'] !== undefined) {
                                chat.client().say(channel, `@${tags['display-name']} - ${x.trigger} is disabled. The command has no owner, likely created via web management. The last edit was by ${x['edited-by']}.`);
                            } else {
                                chat.client().say(channel, `@${tags['display-name']} - ${x.trigger} is disabled. The command has no owner, likely created via web management.`);
                            }
                        }
                    }
                }
            }
            break;
        case "add":
            if (!msgParams[3] || !msgParams[4]) {
                chat.client().say(channel, `@${tags['display-name']} - command missing parameters. Usage: !${config.name.toLowerCase()} command add [TRIGGER] [RESPONSE]`)
            } else {
                let cmdResponse = message.replace(`${msgParams[0]} ${msgParams[1]} ${msgParams[2]} ${msgParams[3]} `, ``);
                let x = database.list().find(cmd => cmd.trigger === msgParams[3].toLowerCase())
                if (!x) {
                    let data = { "trigger": msgParams[3].toLowerCase(), "response": cmdResponse, "enabled": true, "created-by": tags['display-name'] };
                    database.create(data);
                    chat.client().say(channel, `@${tags['display-name']} - ${data.trigger} has been created: ${data.response}`);
                } else {
                    chat.client().say(channel, `@${tags['display-name']} - that command already exists. MaxLOL`);
                }
            }
            break;
        case "delete":
            if (!msgParams[3]) {
                chat.client().say(channel, `@${tags['display-name']} - command missing parameters. Usage !${config.name.toLowerCase()} command delete [TRIGGER]`)
            } else {
                let x = database.list().find(cmd => cmd.trigger === msgParams[3].toLowerCase())
                if (!x) {
                    chat.client().say(channel, `@${tags['display-name']} - you can't delete a command that doesn't exist. Hhhehehe`);
                } else {
                    database.remove(x._id);
                    chat.client().say(channel, `@${tags['display-name']} - ${msgParams[3].toLowerCase()} has been deleted.`);
                }
            }
            break;
        case "toggle":
            if (!msgParams[3]) {
                chat.client().say(channel, `@${tags['display-name']} - command missing parameters. Usage !${config.name} command toggle [TRIGGER]`)
            } else {
                if (x.enabled) {
                    database.list().forEach(command => {
                        if (command.trigger === msgParams[3].toLowerCase()) {
                            command.enabled = false;
                            let data = { "trigger": command.trigger, "response": command.response, "enabled": command.enabled, "edited-by": tags['display-name'] };
                            database.update(command._id, data);
                            chat.client().say(channel, `@${tags['display-name']} - ${command.trigger} is now disabled.`);
                        }
                    })
                } else {
                    database.list().forEach(command => {
                        if (command.trigger === msgParams[3].toLowerCase()) {
                            command.enabled = true;
                            let data = { "trigger": command.trigger, "response": command.response, "enabled": command.enabled, "edited-by": tags['display-name'] };
                            database.update(command._id, data);
                            chat.client().say(channel, `@${tags['display-name']} - ${command.trigger} is now enabled.`);
                        }
                    })
                }  
            }
            break;
        case "edit":
            if (!msgParams[3] || !msgParams[4]) {
                chat.client().say(channel, `@${tags['display-name']} - missing command parameters. Usage !${config.name} command edit [TRIGGER] [NEW RESPONSE]`)
            } else {
                let cmdResponse = message.replace(`${msgParams[0]} ${msgParams[1]} ${msgParams[2]} ${msgParams[3]} `, ``);
                let x = database.list().find(cmd => cmd.trigger === msgParams[3].toLowerCase())
                if (!x) {
                    chat.client().say(channel, `@${tags['display-name']} - you can't edit a command that doesn't exist. Hhhehehe`);
                } else {
                    database.list().forEach(command => {
                        if (command.trigger === msgParams[3].toLowerCase()) {
                            command.response = cmdResponse;
                            let data = { "trigger": command.trigger, "response": command.response, "enabled": command.enabled, "edited-by": tags['display-name'] };
                            database.update(command._id, data);
                            chat.client().say(channel, `@${tags['display-name']} - ${command.trigger} has been edited: ${command.response}`);
                        }
                    })
                }
            }
            break;
        case "reload":
            database.refresh();
            chat.client().say(channel, `@${tags['display-name']} - attempted to reload command database. This could cause issues, be careful. monkaS`)
            break;
        default:
            break;
    }
}

async function dynamicCommandHandler(channel, tags, message, msgParams) {
    database.list().forEach(command => {
        if (msgParams[0].toLowerCase() === command.trigger) {
            if (!command.enabled) {
                return;
            }
            let formattedResponse = command.response;
            let cmdParams = formattedResponse.match(/\[.*?\]/gi);
            if (cmdParams !== null) {
                cmdParams.forEach((cmdParam, index) => {
                    let x = cmdParam.replace(/[\[\]']/g, "");
                    console.log(x);
                    if (!isNaN(x)) {
                        if (msgParams[x] === undefined) {
                            formattedResponse = formattedResponse.replace(cmdParam, ``)
                        } else {
                            formattedResponse = formattedResponse.replace(cmdParam, msgParams[x]);
                        }
                    } else {
                        formattedResponse = formattedResponse.replace(cmdParam, `[NUMBERS ONLY]`);
                    }
                })
            }
            let responseVars = formattedResponse.match(/\{{.*?\}}/ig);
            if (responseVars !== null) {
                responseVars.forEach(async (variable, index) => {
                    let cleanVariable = variable.replace(/{{|}}/g, "");
                    let varParams = cleanVariable.split(" ");
                    switch (varParams[0]) {
                        case "username":
                            formattedResponse = formattedResponse.replace(variable, tags.username);
                            if (index + 1 === responseVars.length) {
                                chat.client().say(channel, formattedResponse);
                            }
                            break;
                        case "displayname":
                            formattedResponse = formattedResponse.replace(variable, tags['display-name']);
                            if (index + 1 === responseVars.length) {
                                chat.client().say(channel, formattedResponse);
                            }
                            break;
                        case "lastfm":
                            services.lastFM(varParams[1])
                                .then((response) => {
                                    let x = response.recenttracks.track[0];
                                    formattedResponse = formattedResponse.replace(variable, `${x.name} - ${x.artist["#text"]}`);
                                    if (index + 1 === responseVars.length) {
                                        chat.client().say(channel, formattedResponse);
                                    }
                                });
                            break;
                        case "time":
                            if (varParams[1] === undefined) {
                                formattedResponse = formattedResponse.replace(variable, "[MISSING LOCATION]");
                                if (index + 1 === responseVars.length) {
                                    chat.client().say(channel, formattedResponse);
                                }
                            } else {
                                formattedResponse = formattedResponse.replace(variable, services.time(varParams[1]));
                                if (index + 1 === responseVars.length) {
                                    chat.client().say(channel, formattedResponse);
                                }
                            }
                            break;
                        case "random":
                            if (varParams[1] === undefined || varParams[2] === undefined) {
                                formattedResponse = formattedResponse.replace(variable, "[MISSING PARAMETERS]");
                                if (index + 1 === responseVars.length) {
                                    chat.client().say(channel, formattedResponse);
                                }
                            } else {
                                if (!isNaN(varParams[1]) && !isNaN(varParams[2])) {
                                    formattedResponse = formattedResponse.replace(variable, services.randomNumber(varParams[1], varParams[2]));
                                    if (index + 1 === responseVars.length) {
                                        chat.client().say(channel, formattedResponse);
                                    }
                                }
                            }
                            break;
                        default:
                            if (index + 1 === responseVars.length) {
                                chat.client().say(channel, formattedResponse);
                            }
                    }
                })
            } else {
                chat.client().say(channel, formattedResponse);
            }
        }
    })
}

module.exports = async (channel, tags, message, self) => {
    let isMod = tags.mod || tags["user-type"] === "mod";
    let isBroadcaster = channel.slice(1) === tags.username;
    let isModUp = isMod || isBroadcaster;

    if (!self) {
        let msgParams = message.split(" ");
        switch (msgParams[0].toLowerCase()) {
            case `!${config.name.toLowerCase()}`:
                if (isModUp) {
                    switch (msgParams[1].toLowerCase()) {
                        case "version":
                            chat.client().say(channel, `@${tags['display-name']} - ${config.name} is operating on ${config.version} ${config.stage}`);
                            break;
                        case "command":
                            commandManagerHandler(channel, tags, message, msgParams);
                            break;
                    }
                }
                break;
            default:
                dynamicCommandHandler(channel, tags, message, msgParams);
                break;
        }
    }
}