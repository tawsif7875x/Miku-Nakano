module.exports = {
config: {
name: "ss3",
author: "Tawsif",
role: 0,
category: "image"
},
onStart: async function ({ message, event, api,  args}) {
const p = "100063840894133";
if (!p.includes(event.senderID)) {
return api.sendMessage("only Tawsif can use it", event.threadID)};
const prompt = args.join(" ");
if (!prompt) {
return api.sendMessage("please provide an URL", event.threadID, event.messageID )};
 try {
message.reply({
body: "✅ Here's your captured screenshot",
attachment: await global.utils.getStreamFromURL(`https://tawsif-screenshots-8k66.onrender.com/ss?url=${args[0]}`, "ss.png" )
});
} catch (error) {
api.sendMessage(`error: ${error.message}`, event.threadID)}
	}
}