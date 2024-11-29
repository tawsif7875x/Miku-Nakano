
module.exports = {
config: {
		name: "nijiz",
		aliases: [],
		version: "1.0",
		role: 0,
		countDown: 10,
		author: "Tawsif~",
		category: "image",
		longDescription: {
 				en: "generate image using nijiz API"
		},
		guide: {
				en: "{pn} <prompt>"
		}
},
onStart: async function ({ message, usersData, args, api, event }) {
	const name = await usersData.getName(event.senderID);
	const prompt = args.join(" ");
if (!prompt) { 
return api.sendMessage("please provide a prompt", event.threadID );
}
	const wtxt = await message.reply("🔄 generating your nijiz image...");
		try {
	const apiUrl = `https://tawsif-nijiz.onrender.com/niji?prompt=${encodeURIComponent(prompt)}`;
		message.reply({ body: `Here's your image, ${name} ✨`,
attachment: await global.utils.getStreamFromURL(apiUrl, "nijiz.png" )});
api.unsendMessage(wtxt.messageID);
	} catch (error) {
console.error(error); message.reply(`error: ${error.message}`)};
}
}