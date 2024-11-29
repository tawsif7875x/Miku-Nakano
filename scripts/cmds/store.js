const axios = require('axios'); 

module.exports = {
	config: {
		name: "store",
		version: "1.0",
		author: "UPoL 🐔",
		countDown: 5,
		role: 0, 
		shortDescription: {
			en: ""
		},
		description: {
			en: "Get commands from store"
		},
		category: "utility",
		guide: {
			en: "{pn} [page | show | pasteurl ]"
		}
	},

	onStart: async function ({ api, args, message, event, role }) {
		const baseURL = "https://hopeless-store.onrender.com";

		const action = args[0]; 
		let pageNumber = args[1] || 1;
		const param = args[1];
		const isAdmin = role >= 1;
		pageNumber = parseInt(pageNumber, 10);
		if (action === "page") {
			try {
				const response = await axios.get(`${baseURL}/page`, {
					params: { pageNum: pageNumber }
				});
				const commandList = response.data.map(cmd =>
					`Cmd Number: ${cmd.number}, Name: ${cmd.name}, Author: ${cmd.author}`).join("\n");

				message.reply(`Commands on page ${pageNumber}:\n${commandList}`);
			} catch (error) {
				message.reply(`Error fetching commands: ${error.response?.data || error.message}`);
			}
		} 	else if (action === "show") {
			if (!param) return message.reply("Missing parameters, please provide a command name or cmd ID.");

			try {
				const response = await axios.get(`${baseURL}/show`, {
					params: param.match(/^\d+$/) ? { cmd: param } : { name: param }
				});
				if (Array.isArray(response.data) && response.data.length > 0) {
					const commandList = response.data.map(cmd =>
						`Cmd Number: ${cmd.number}, Name: ${cmd.name}, Author: ${cmd.author}, Description: ${cmd.description}`).join("\n\n");

					message.reply(`Multiple commands with the name "${param}":\n\n${commandList}`);
				} else if (response.data) {
					const command = response.data;
					message.reply(`Command Details:\nCmd Number: ${command.number}\nName: ${command.name}\nAuthor: ${command.author}\nDescription: ${command.description}`);
				} else {
					message.reply(`No command found with the name or cmd "${param}".`);
				}
			} catch (error) {
				message.reply(`Error checking command: ${error.response?.data || error.message}`);
			}
		} 	else if (action === "paste") {
			if (!param) return message.reply("Missing parameters, please provide a command name.");

			try {
				const response = await axios.get(`${baseURL}/paste`, {
					params: { name: param }
				});

				if (response.data) {
					message.reply(`Paste URL for command "${param}": ${response.data.pasteurl}`);
				} else {
					message.reply(`No paste URL found for the command "${param}".`);
				}
			} catch (error) {
				message.reply(`Error fetching paste URL: ${error.response?.data || error.message}`);
			}
		} else {
			message.reply("Invalid action. Use show, check, add, delete, add-admin, remove-admin, or paste.");
		}
	}
};