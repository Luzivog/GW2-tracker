const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Account } = require('../Account');
const config = require('../config');
require("dotenv").config();

const seconds_to_hm = (sec) => `${sec / 3600 >> 0}h ${sec % 3600 / 60 >> 0}min`

module.exports = {

	data: new SlashCommandBuilder()
		.setName('progress')
		.setDescription('Shows current progress'),

	async execute(interaction) {

        emojis = {};

        for (let emoji_name of config.emoji_names) emojis[emoji_name] = interaction.options.client.emojis.cache.find(emoji => emoji.name === emoji_name);

        await interaction.deferReply();

        let accounts = [];
        let embedFields = [];
        let apiKeys = [];

        if (process.env.API_KEYS) apiKeys = process.env.API_KEYS.split(",");
        else apiKeys = config.api_keys;

        for (let api_key of apiKeys) {
            let new_acc = new Account(api_key);
            await new_acc.init();
            accounts.push(new_acc);
            embedFields.push({
                name: 'Account: '+new_acc.account['name'],
                value: `Money: ${new_acc.gold} ${emojis.gold_coin} ${new_acc.silver} ${emojis.silver_coin} ${new_acc.bronze} ${emojis.bronze_coin}\nTotal time played: ${seconds_to_hm(new_acc.account['age'])} ⌛\n\nMain: ${new_acc.main_character['name']} (level ${new_acc.main_character['level']})\nClass: ${new_acc.main_character['profession']}\nTime played: ${seconds_to_hm(new_acc.main_character['age'])} ⌛\nDeath count: ${new_acc.main_character['deaths']} 💀\n\u1CBC\u1CBC`
            })
        };

        const progressEmbed = new EmbedBuilder()
        .setColor(0xEA600C)
        .setAuthor({ name: 'Progress', iconURL: 'https://www.pngitem.com/pimgs/m/174-1741597_guild-wars-2-logo-png-guild-wars-2.png', url: 'https://www.guildwars.com/fr' })
        .addFields(embedFields)
        .setTimestamp()

        await interaction.editReply({ embeds: [progressEmbed] });
	},
};