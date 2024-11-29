const fs = require('fs'); 
module.exports = {
	config: {
		name: "install",
		version: "1.0",
		author: "Tawsif~",
		countDown: 5,
		role: 2, 
		longDescription: {
			en: "installs file in the given path"
		},
		category: "owner",
		guide: {
			en: "{pn} <path> <your code>"
		}
	},
onStart: async function ({ args, message }) {
	const path = args[0];
if (!path) { 
return message.reply("provide a path to install your code\nexample:\n./segs.js")};
	const text = args.slice(1).join(" ");
if (!text) { 
return message.reply("provide your text to install it")}; 
try {
fs.writeFileSync(path, text);
message.reply("✅ succesfully installed your code");
} catch (error) {
message.reply(`${error.message}`);
		}
	}
};