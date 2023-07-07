const fs = require('node:fs');
const { REST, Routes } = require('discord.js');

const { BOT_TOKEN } = require('./config.js');

const initCommands = async (client) => {

	const commands = [];

	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
	
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		commands.push(command.data.toJSON());
	}

	let token;
	if (process.env.BOT_TOKEN) token = process.env.BOT_TOKEN;
	else token = BOT_TOKEN;

	const rest = new REST({ version: '10' }).setToken(token);

	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const Guilds = client.guilds.cache.map(guild => guild.id);
		
		for (let guild of Guilds) {
			await rest.put(
				Routes.applicationGuildCommands(client.user.id, guild),
				{ body: commands },
			);
		}

		console.log(`Successfully reloaded ${commands.length} application (/) commands.`);

	} catch (error) {

		console.error(error);
	}
}


module.exports = {
	initCommands: initCommands,
}