const fs = require("fs");
const colors = require("colors");
const { Client, Collection, Intents } = require("discord.js");

let config = JSON.parse(fs.readFileSync("./storage/config.json").toString());
let moduleConfig = config.modules.find(x => x.name === "discord");
let settings = moduleConfig.settings;
let client = new Client({ intents: [Intents.FLAGS.GUILDS] });

if (settings.dev.deploy_commands) require("./command-deploy");

function toConsole(data) {
    let x = new Date().toUTCString();
    console.log(`${colors.underline(`[ ${config.name} ${config.version} ${config.stage} - ${moduleConfig.name.toUpperCase()} - ${x} ]`)} ${data}`);
}

client.once("ready", () => {
    toConsole(`Logged in to Discord as ${colors.yellow(client.user.tag)}`);

    client.user.setActivity({
        type: "WATCHING",
        name: "for commands. 👀"
    });
})

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    let command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction)
    } catch (error) {
        if (err) throw err;
        await interaction.reply({ content: "The developer made a mistake somewhere. Whoops.", ephemeral: true });
    }
})

client.commands = new Collection();
const commandFiles = fs.readdirSync("./modules/discord/commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
};

client.login(settings.token);