const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("hello")
        .setDescription("The bot will say hello."),
    async execute(interaction) {
        await interaction.reply("yo")
    }
}