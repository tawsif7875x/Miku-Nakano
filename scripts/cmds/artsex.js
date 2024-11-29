const axios = require("axios");
module.exports = {
    config: {
        name: "niji",
        aliases: ["art"],
        version: "1.0",
        author: "Tawsif",
        countDown: 10,
        role: 2,
        longDescription: "Text to Image",
        category: "image",
        guide: {
    en: `{pn} <prompt> --ar [ratio], [preset], [style]`,
      }
    },

    onStart: async function({ api, args, message, event }) {
        try {
            let prompt = "";
            let style = "";
            let imageUrl = "";
            let preset = "";
            let aspectRatio = ""; 

            const styleIndex = args.indexOf("--style");
            if (styleIndex !== -1 && args.length > styleIndex + 1) {
                style = args[styleIndex + 1];
                args.splice(styleIndex, 2); 
            }

            const presetIndex = args.indexOf("--preset");
            if (presetIndex !== -1 && args.length > presetIndex + 1) {
                preset = args[presetIndex + 1];
                args.splice(presetIndex, 2); 
            }
            
            const aspectIndex = args.indexOf("--ar");
            if (aspectIndex !== -1 && args.length > aspectIndex + 1) {
                aspectRatio = args[aspectIndex + 1];
                args.splice(aspectIndex, 2); 
            }

            if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments.length > 0 && ["photo", "sticker"].includes(event.messageReply.attachments[0].type)) {
                imageUrl = encodeURIComponent(event.messageReply.attachments[0].url);
            } else if (args.length === 0) {
                message.reply("Please provide a prompt🐧");
                return;
            }
            
            if (args.length > 0) {
                prompt = args.join(" ");
            }

            
            let apiUrl = `https://rehatdesu.xyz/api/imagine/niji?prompt=${encodeURIComponent(prompt)}.&aspectRatio=${aspectRatio}&style=${style}&preset=${preset}&apikey=sumu`;
            if (imageUrl) {
                apiUrl += `&imageUrl=${imageUrl}`;
            }

            const processingMessage = await message.reply("✅ | generating your image, please wait...");
            const response = await axios.post(apiUrl);
            const img = response.data.url;

            await message.reply({
                attachment: await global.utils.getStreamFromURL(img)
            });

        } catch (error) {
            console.error(error);
            message.reply("An error occurred.");
        }
    }
};