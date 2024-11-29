const axios = require('axios');
module.exports = {
config: {
		name: "animix",
		role: 0,
		countdown: 5,
		author: "Team Hopeless (Tawsif)",
		category: "image",
		longDescription: {
 				en: "generate image using Animix API"
		},
		guide: {
				en: "{pn} <prompt>"
		}
},
onStart: async function ({ message, usersData, args, api, event }) {
	const name = await usersData.getName(event.senderID);
	const prompt = args.join(" ");
if (!prompt) { 
return api.sendMessage("please provide a prompt🐧", event.threadID );
}
	const wtxt = await message.reply("✅ generating your animix image...");
		try {
	const apiUrl = `https://hopeless.serveftp.com/api/animix?prompt=${encodeURIComponent(prompt)}`;
	const response = await axios.get(apiUrl);
	const output = response.data.imageUrl;
api.unsendMessage(wtxt.messageID);
		message.reply({ body: `Here's your image, ${name}`,
attachment: await global.utils.getStreamFromURL(output, "animix.png" )});
	} catch (error) {
console.error(error); message.reply(`error: ${error.message}`)};
}
}