 
module.exports = {
  config: {
    name: "gen",
    version: "1.0",
    author: "Team Calyx & Tawsif",
    category: "image",
    shortDescription: "Generates an image based on the provided prompt.",
    longDescription: "",
    guide: "{pn} <prompt>",
  },

  onStart: async function ({ event, message, args }) {
    if (args.length === 0) {
      return message.reply("Please provide a prompt🐧");
    }

    const prompt = args.join(" ");

    try {
      const apiUrl = `http://45.90.12.34:5047/gen?prompt=${encodeURIComponent(prompt)}`;
      message.reply({ attachment: await global.utils.getStreamFromURL(apiUrl) });
    } catch (error) {
      console.error("Error fetching the image:", error);
      message.reply("❌ Failed to generate image. Please try again later.");
    }
  },
};