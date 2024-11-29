module.exports = {
config: {
		name: "xl2",
		aliases: [],
		version: "1.0",
		role: 0,
		countDown: 10,
		author: "Tawsif~",
		category: "image",
		longDescription: {
 				en: "generate image using XL API"
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
	const wtxt = await message.reply("🔄 generating your XL image...");
const d = new Date().getTime();
		try {
	const apiUrl = `https://tawsif-xls.onrender.com/xl?prompt=${encodeURIComponent(prompt)}`;
const stream = await global.utils.getStreamFromURL(apiUrl, "xl2.png" );
const d2 = new Date().getTime();
		message.reply({ body: `✅ Here's your image, ${name} ✨\nTime taken: ${(d2-d)/1e3} Seconds 🕓`,
attachment: stream });
api.unsendMessage(wtxt.messageID);
	} catch (error) {
console.error(error); message.reply(`error: ${error.message}`)};
}
}