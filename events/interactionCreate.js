const { Events, Collection } = require("discord.js");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		const { cooldowns } = interaction.client;

		if (!interaction.isChatInputCommand()) return;
		const command = interaction.client.commands.get(
			interaction.commandName
		);
		if (!command) {
			console.error(
				`No command matching ${interaction.commandName} was found.`
			);
			return;
		}

		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const defaultCooldownDuration = 3;
		const cooldownAmount =
			(command.cooldown ?? defaultCooldownDuration) * 1000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime =
				timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const expiredTimestamp = Math.round(expirationTime / 1000);
				console.log(command.cooldown)
				return interaction.reply({
					content: `Espera um pouco! o comando \`${command.data.name}\` vai ficar disponível pra uso <t:${expiredTimestamp}:R>.`,
					ephemeral: true,
				}).then(() =>
					setTimeout(
						() => interaction.deleteReply(),
						(command.cooldown * 1000)
					)
				)
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(
			() => timestamps.delete(interaction.user.id),
			cooldownAmount
		);

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
			} else {
				await interaction.reply({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
			}
		}
	},
};
