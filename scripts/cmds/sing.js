
const axios = require('axios');
const yts = require("yt-search");

module.exports = {
  config: {
    name: "sing",
    version: "1.3",
    author: "shahadat & Tawsif",
    countDown: 15,
    role: 0,
    category: "media",
  },
  onStart: async function ({ api, event, message }) {
    try {
      const input = event.body;
      const data = input.split(" ");

      if (data.length < 2) {
        return message.reply("Please put a song.");
      }

      data.shift();
      const song = data.join(" ");
      const originalMessage = await message.reply(`Searching for "${song}"...`);
      const searchResults = await yts(song);

      if (!searchResults.videos.length) {
        return message.reply("Error: Invalid request.");
      }

      const video = searchResults.videos[0];
      const videoId = video.videoId;
      const videoTitle = video.title;
      const videoChannel = video.author.name;

      const urls = `https://www.noobs-api.000.pe/dipto/ytDl3?link=${videoId}&format=mp3`;
      try {
        const response = await axios.get(urls);

        if (response.data && response.data.downloadLink) {
          const audioURL = response.data.downloadLink;
          const sentMessage = await message.reply({
            body: `Title: ${videoTitle}\nAuthor: ${videoChannel}`,
            attachment: await global.utils.getStreamFromURL(audioURL)
          });

          setTimeout(() => {
            api.unsendMessage(originalMessage);
          }, 0);

          setTimeout(() => {
            api.unsendMessage(originalMessage);
          }, 5 * 1000); // delete the sent message after 10 seconds
        } else {
          throw new Error('No audio data found');
        }
      } catch (error) {
        throw new Error(`Failed to download: ${error.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  },
};