const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName("nickname")
		.setDescription("Altera o apelido de alguém no servidor")
		.setDescriptionLocalizations({
			"en-US": "Change someone server's nickname",
			"pt-BR": "Altera o apelido de alguém no servidor",
		})
		.addUserOption((option) =>
			option
				.setName("usuario")
				.setNameLocalizations({
					"en-US": "user",
					"pt-BR": "usuario",
				})
				.setDescription(
					"Selecione um usuário para modificar seu apelido"
				)
				.setDescriptionLocalizations({
					"en-US": "Select a user to modify their nickname",
					"pt-BR": "Selecione um usuário para modificar seu apelido",
				})
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("apelido")
				.setNameLocalizations({
					"en-US": "nickname",
					"pt-BR": "apelido",
				})
				.setDescription("Apelido desejado")
				.setDescriptionLocalizations({
					"en-US": "Type a new user's nickname.",
					"pt-BR": "Digite um novo apelido para o usuário.",
				})
				.setMaxLength(32)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ChangeNickname),
	async execute(interaction) {
		const { options } = interaction;

        //pega os dados do usuário
		const user = options.getMember("usuario");
		const nick = options.getString("apelido");


        // dicionário das traduções
        const locales = {
            "en-US": {
                reset: `${user}` + " nickname got reseted!",
                success: `${user}` + " nickname was changed successfully to `" + `${nick}` +"!`"
            },
            "pt-BR": {
                reset: "Apelido do usuário " + `${user}` + " foi resetado!",
                success: "Apelido do usuário " + `${user}` + " alterado com sucesso para `" + `${nick}` +"!`",
            }
        }

        if (!(interaction.locale in locales)) {
            interaction.locale = "en-US"; // Default to "en-US" if locale is not found
        }

        //respostas
		if (nick == null) {
			interaction.reply(locales[interaction.locale].reset);
			user.setNickname("");
		} else {
			interaction.reply(locales[interaction.locale].success);
			user.setNickname(`${nick}`);
		}
	},
};
