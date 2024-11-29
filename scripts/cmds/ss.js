module.exports = {
config: {
name: "ss",
author: "Tawsif",
role: 0,
category: "image"
},
onStart: async function ({ message, event, api,  args}) {
const prompt = args.join(" ");
if (!prompt) {
return api.sendMessage("please provide an URL", event.threadID, event.messageID )};
 try {
message.reply({
body: "✅ Here's your captured screenshot",
attachment: await global.utils.getStreamFromURL(`https://tawsif-screenshots3.onrender.com/ss?url=${args[0]}`, "ss.png" )
});
} catch (error) {
api.sendMessage(`error: ${error.message}`, event.threadID)}
	}
}