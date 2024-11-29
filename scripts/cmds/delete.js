const fs = require('fs'); 
module.exports = {
	config: {
		name: "delete",
		version: "1.0",
		author: "Tawsif~",
		countDown: 5,
		role: 2, 
		longDescription: {
			en: "deletes file by name"
		},
		category: "owner",
		guide: {
			en: "{pn} <file name>"
		}
	},
onStart: async function ({ args, message, event }) {
	const permission = "100063840894133";
if (!permission.includes(event.senderID)) {
return message.reply("Baka! you don’t have permission to use this command. Only Tawsif can do it")};
	const name = args.join(" ");
	const path = `./${name}`;
if (!path) { 
return message.reply("provide the file name to delete")};
try {
fs.unlinkSync(path);
message.reply(`✅ succesfully deleted ${path}`);
} catch (error) {
message.reply(`${error.message}`);
		}
	}
};