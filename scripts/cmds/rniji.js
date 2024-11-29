const axios = require("axios");

module.exports = {
  config: {
    name: "rniji",
    aliases: [],
    author: "Mahi-- & Tawsif",
    version: "1.1",
    cooldowns: 20,
    role: 0,
    shortDescription: "Generate an anime-style image based on a prompt using the RNiji API.",
    longDescription: "Generates a high-quality anime-style image using the provided prompt and streams the image to the chat.",
    category: "ai",
    guide: "{p}rniji <prompt>",
  },
  onStart: async function ({ message, args, api, event }) {
    const prompt = args.join(" ");

    if (!prompt) {
      return api.sendMessage("❌ | You must provide a prompt to generate an anime-style image.", event.threadID);
    }
 api.sendMessage("🖼 | Creating your image, please wait a moment...", event.threadID, event.messageID);

    try {
      const apiUrl = `https://hopeless-nijiz-8nkg.onrender.com/api/rniji?prompt=${encodeURIComponent(prompt)}`;

      // Call the API to get the image URL
      const response = await axios.get(apiUrl);
      const imageUrl = response.data.imageUrl;
      message.reply({
        body: `✅ | Your anime-style image is ready!`,
        attachment: await global.utils.getStreamFromURL(imageUrl, "rniji.png")
      });

    } catch (error) {
      console.error("Error:", error);
      return api.sendMessage("❌ | An error occurred while generating the image. Please try again later.", event.threadID);
    }
  }
};