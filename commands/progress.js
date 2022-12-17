const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Account } = require('../Account');
const config = require('../config');

const seconds_to_hm = (sec) => `${sec / 3600 >> 0}h ${sec % 3600 / 60 >> 0}min`

module.exports = {

	data: new SlashCommandBuilder()
		.setName('progress')
		.setDescription('Shows current progress'),

	async execute(interaction) {

        emojis = {};

        for (let k of Object.keys(config.emoji_ids)) emojis[k] = interaction.options.client.emojis.cache.get(config.emoji_ids[k]);

        await interaction.deferReply();

        let accounts = [];
        let embedFields = [];

        for (let api_key of config.api_keys) {
            let new_acc = new Account(api_key);
            await new_acc.init();
            accounts.push(new_acc);
            embedFields.push({
                name: 'Compte: '+new_acc.account['name'],
                value: `Argent: ${new_acc.gold} ${emojis.gold_coin} ${new_acc.silver} ${emojis.silver_coin} ${new_acc.bronze} ${emojis.bronze_coin}\nTemps de jeu total: ${seconds_to_hm(new_acc.account['age'])} ⌛\n\nMain: ${new_acc.main_character['name']} (level ${new_acc.main_character['level']})\nClasse: ${new_acc.main_character['profession']}\nTemps de jeu: ${seconds_to_hm(new_acc.main_character['age'])} ⌛\nDeath count: ${new_acc.main_character['deaths']} 💀\n\u1CBC\u1CBC`
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