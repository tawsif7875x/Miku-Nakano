 
const axios = require("axios");

module.exports = {
   config: {
     name: "nijix",
     aliases: ["niji"],
     author: "Tawsif & Upol API",
     version: "1.0",
     cooldowns: 20,
     role: 0,
     shortDescription: "Generate an image based on a prompt using the XL API.",
     longDescription: "Generates an image using the provided prompt and streams the image to the chat.",
     category: "ai",
     guide: "{pn} <prompt>",
   },
   onStart: async function ({ message, args, api, event }) {
     const prompt = args.join(" ");
     if (!prompt) {
       return api.sendMessage("❌ | You need to provide a prompt.", event.threadID);
     }
     api.sendMessage("Please wait, generating your image...", event.threadID, event.messageID);
     const nijixApi = `https://upol-nijiy.onrender.com/xl31?prompt=${encodeURIComponent(prompt)}`; 

     try {
       const response = await axios.get(nijixApi);
       
       if (response.data && response.data.imageUrl) {
         const result = response.data.imageUrl;
         message.reply({
           body: "Here's your image",
           attachment: await global.utils.getStreamFromURL(result, "gay.png")
         });
       } 
     } catch (error) {
       console.error(error);
       api.sendMessage("Something went wrong!", event.threadID);
     }
   },
 };