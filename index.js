const fs = require('node:fs');
const path = require('path');

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

const { BOT_TOKEN } = require('./config.js');
const { initCommands } = require('./deploy-commands.js');
const { exit } = require('node:process');
require('dotenv').config();


const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


for (const file of commandFiles) {

	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

    if ('data' in command && 'execute' in command) client.commands.set(command.data.name, command);
	else console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
};

let token;
if (process.env.BOT_TOKEN) {
	console.log("Using environnement variables.")
	token = process.env.BOT_TOKEN;
} else token = BOT_TOKEN;

client.login(token);

client.once(Events.ClientReady, (bot) => {
	console.log(`Ready! Logged in as ${bot.user.tag}`);
    initCommands(bot);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	};

	try {
        interaction.options.client = client;
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	};
});