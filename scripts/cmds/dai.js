const axios = require("axios");

module.exports = {
   config: {
     name: "dai",
     aliases: [],
     author: "Tawsif & Upol API",
     version: "1.0",
     cooldowns: 20,
     role: 0,
     shortDescription: "Generate an image based on a prompt using the XL API.",
     longDescription: "Generates an image using the provided prompt and streams the image to the chat.",
     category: "image",
     guide: "{pn} <prompt>",
   },
   onStart: async function ({ message, args, api, event }) {
     const prompt = args.join(" ");
     if (!prompt) {
       return api.sendMessage("please provide a prompt🐧", event.threadID);
     }
     api.sendMessage("✅ | generating your image, please wait...", event.threadID, event.messageID);
     const nijixApi = `https://upol-dai.onrender.com/dai?prompt=${encodeURIComponent(prompt)}`; 

     try {
       const response = await axios.get(nijixApi);
       
       if (response.data && response.data.imageUrl) {
         const result = response.data.imageUrl;
         message.reply({
           body: "Here's your image",
           attachment: await global.utils.getStreamFromURL(result, "segs.png")
         });
       } 
     } catch (error) {
       console.error(error);
       api.sendMessage("Something went wrong!", event.threadID);
     }
   },
 };