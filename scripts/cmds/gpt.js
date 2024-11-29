const axios = require('axios');
module.exports = {
config: {
		name: "gpt",
		aliases: [],
		role: 0,
		countdown: 5,
		author: "Tawsif & Upol API",
		category: "ai",
		longDescription: {
 				en: "chat with gemini"
		},
		guide: {
				en: "{pn} prompt"
		}
},
onStart: async function ({ message, args, api, event }) {
const prompt = args.join(" ");
if (!prompt) { 
return api.sendMessage("provide a prompt, kid🐧", event.threadID );
}
		try {
	const apiUrl = `https://upol-piu.onrender.com/gemini?prompt=${encodeURIComponent(prompt)}`;
	const response = await axios.get(apiUrl);
	const output = response.data.answer;
		message.reply({ body: `${output}`});
	} catch (error) {
console.error(error); message.reply(`error: ${error.message}`)};
}
}