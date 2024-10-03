const axios = require("axios");
const a = 'xyz';
module.exports = {
  config: {
    name: "alldl",
    aliases: ["aldl"],
    version: "1.0",
    author: "Team_Calyx | Fahim_Noob",
    role: 0,
    shortDescription: {
      en: "Retrieves and sends video from a provided URL."
    },
    longDescription: {
      en: "Retrieves video details from the provided URL and sends the video as an attachment."
    },
    category: "Media",
    guide: {
      en: "Use this command to retrieve video details and receive the video as an attachment."
    }
  },
  onStart: async function ({ api, event, args }) {
    if (args.length === 0) {
      return api.sendMessage("Please provide a URL after the command.", event.threadID, event.messageID);
    }

    const videoURL = args.join(" ");
    const apiURL = `https://smfahim.${a}/alldl?url=${encodeURIComponent(videoURL)}`;

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const response = await axios.get(apiURL);

      const { data: { url: { data: { high, title } } } } = response;

      if (!high) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return api.sendMessage("No video content available.", event.threadID, event.messageID);
      }

      const stream = await global.utils.getStreamFromURL(high, "video.mp4");

      api.sendMessage({
        body: title,
        attachment: stream
      }, event.threadID, (err, messageInfo) => {
        if (!err) {
          api.setMessageReaction("✅", event.messageID, () => {}, true);
        } else {
          api.setMessageReaction("❌", event.messageID, () => {}, true);
        }
      }, event.messageID);
    } catch (error) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage("An error occurred while retrieving video details.", event.threadID, event.messageID);
    }
  }
};