const fs = require("fs");
const colors = require("colors");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

let config = JSON.parse(fs.readFileSync("./storage/config.json").toString());
let moduleConfig = config.modules.find(x => x.name === "discord");
let settings = moduleConfig.settings;

function toConsole(data) {
    let x = new Date().toUTCString();
    console.log(`${colors.underline(`[ ${config.name} ${config.version} ${config.stage} - ${moduleConfig.name.toUpperCase()}/COMMAND-DEPLOY.JS - ${x} ]`)} ${data}`);
}

const commands = []
const commandFiles = fs.readdirSync("./modules/discord/commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({version: '9'}).setToken(settings.token)

rest.put(Routes.applicationCommands(settings.client_id), { body: commands })
.then(() => { toConsole('Commands registered successfully.') })
.catch(err => { if (err) throw err });