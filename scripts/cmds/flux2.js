const axios = require('axios');
const { shortenURL, getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "flux2",
    version: "1.0",
    author: "Mahi--",
    countDown: 0,
    longDescription: {
      en: "Create four images from your text using the FluxPro API."
    },
    category: "image",
    role: 0,
    guide: {
      en: "Use this command with your prompt text to generate images."
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const prompt = args.join(' ').trim();

    if (!prompt) return message.reply("Please provide a prompt, baka!");

    message.reply("Generating images... Please wait! 🖼", async (err, info) => {
      let ui = info.messageID;
      try {
        const apiUrl = `https://hopeless.serveftp.com/api/fluxxpro?prompt=${encodeURIComponent(prompt)}`;
        const response = await axios.get(apiUrl);
        const combinedImg = response.data.combinedImage;

        // Prevent the combined image from being unsent
        message.reply({
          body: "Reply with the image number (1, 2, 3, 4) to get the specific high-resolution image.",
          attachment: await getStreamFromURL(combinedImg, "combined_fluxpro.png")
        }, async (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            imageUrls: response.data.imageUrls
          });
        });
      } catch (error) {
        console.error(error);
        api.sendMessage(`⚠ Error: ${error.message}`, event.threadID);
      }
    });
  },

  onReply: async function ({ api, event, Reply, args, message }) {
    const reply = parseInt(args[0]);
    const { author, imageUrls } = Reply;

    if (event.senderID !== author) return;

    try {
      if (reply >= 1 && reply <= 4) {
        const img = imageUrls[`image${reply}`];
        const shortenedUrl = await shortenURL(img);

        const imageStream = await getStreamFromURL(img, `fluxpro_image${reply}.png`);

        message.reply({
          body: `Here is image ${reply}: ${shortenedUrl}`,
          attachment: imageStream
        });
      } else {
        message.reply("❌ Invalid number. Please reply with 1, 2, 3, or 4.");
      }
    } catch (error) {
      console.error(error);
      message.reply(`⚠ Error: ${error.message}`);
    }
  },
};