const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const yts = require("yt-search");

async function searchYoutube(query) {
  try {
    const searchResults = await yts(query);
    return searchResults.videos.slice(0, 6).map(video => ({
      id: video.videoId,
      title: video.title,
      channel: video.author.name,
      thumbnail: video.thumbnail,
      duration: video.timestamp
    }));
  } catch (error) {
    throw new Error(`Failed to search YouTube: ${error.message}`);
  }
}

async function downloadAndStreamVideo(videoId, videoTitle, videoChannel, message) {
  const apiUrl = `https://shahadat-ytdl-api.onrender.com/id=${encodeURIComponent(videoId)}`;

  try {
    const response = await axios.get(apiUrl);

    if (response.data && response.data.video_url) {
      const videoURL = response.data.video_url;

      

      await message.reply({
        body: `Title: ${videoTitle}\nChannel: ${videoChannel}`,
        attachment: await global.utils.getStreamFromURL(videoURL)
      });

    } else {
      throw new Error('No video data found');
    }
  } catch (error) {
    throw new Error(`Failed to download: ${error.message}`);
  }
}

async function downloadAndStreamAudio(videoId, videoTitle, videoChannel, message) {
  const apiUrl = `https://shahadat-ytdl-api.onrender.com/id=${encodeURIComponent(videoId)}`;

  try {
    const response = await axios.get(apiUrl);

    if (response.data && response.data.audio_url) {
      const audioURL = response.data.audio_url;

      await message.reply({
        body: `Title: ${videoTitle}\nChannel: ${videoChannel}`,
        attachment: await global.utils.getStreamFromURL(audioURL)
      });

    } else {
      throw new Error('No audio data found');
    }
  } catch (error) {
    throw new Error(`Failed to download: ${error.message}`);
  }
}

async function downloadThumbnail(url, index) {
  try {
    const thumbnailPath = path.join(__dirname, `thumb_${index}.jpg`);
    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(thumbnailPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    return thumbnailPath;
  } catch (error) {
    throw new Error(`Failed to download thumbnail: ${error.message}`);
  }
}

module.exports = {
  config: {
    name: "ytb2",
    version: "4.0",
    author: "shahadat & modified by Tawsif",
    countDown: 20,
    role: 0,
    description: {
      vi: "Tải video, audio hoặc xem thông tin video trên YouTube",
      en: "Download video or audio from YouTube"
    },
    category: "media",
    guide: {
      en: "   {pn} [video|-v] [<video name>|<video link>]: download video\n   {pn} [audio|-a] [<video name>|<video link>]: download audio\n   {pn} [info|-i] [<video name>|<video link>]: view info"
    }
  },

  langs: {
    en: {
      error: "❌ An error occurred: %1",
      noResult: "⭕ No search results match the keyword %1",
      choose: "%1Reply with the a video number to download your video.",
      downloading: "⬇Downloading your %1 senpai, please wait.",
      info: "💠 Title: %1\n🏪 Channel: %2\n⏱ Duration: %3\n🔠 ID: %4\n🔗 Link: %5"
    }
  },

  onStart: async function ({ api, args, message, event, commandName, getLang }) {
    let type;
    switch (args[0]) {
      case "-v":
      case "video":
        type = "video";
        break;
      case "-a":
      case "-s":
      case "audio":
      case "sing":
        type = "audio";
        break;
      case "-i":
      case "info":
        type = "info";
        break;
      default:
        return message.SyntaxError();
    }

    const input = args.slice(1).join(" ");
    if (!input) return message.SyntaxError();

    try {
      const youtubeUrlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
      if (youtubeUrlPattern.test(input)) {
        const videoId = extractVideoId(input);
        await processYoutubeUrl(videoId, type, message, getLang);
      } else {
        const searchResults = await searchYoutube(input);
        if (searchResults.length === 0) {
          return message.reply(getLang("noResult", input));
        }

        let msg = "";
        for (let i = 0; i < searchResults.length; i++) {
          msg += `${i + 1}. Tittle: ${searchResults[i].title}\nDuration: ${searchResults[i].duration}\nChanel: ${searchResults[i].channel}\n\n`;
        }

        const thumbnailPaths = await Promise.all(
          searchResults.map((result, index) => downloadThumbnail(result.thumbnail, index))
        );

        const response = await message.reply({
          body: getLang("choose", msg),
          attachment: thumbnailPaths.map(path => fs.createReadStream(path))
        });

        thumbnailPaths.forEach(path => fs.unlinkSync(path));

        global.GoatBot.onReply.set(response.messageID, {
          commandName,
          messageID: response.messageID,
          author: event.senderID,
          type,
          searchResults
        });
      }
    } catch (error) {
      console.error(error);
      return message.reply(getLang("error", error.message));
    }
  },

  onReply: async function ({ api, message, event, getLang, Reply }) {
    const { type, searchResults, messageID } = Reply;
    const choice = parseInt(event.body);

    if (isNaN(choice) || choice < 1 || choice > searchResults.length) {
      return message.reply(getLang("error", "Invalid choice"));
    }

    await message.unsend(messageID);
    const waitingMessage = (await message.reply(getLang("downloading", type))).messageID;
    
    const selectedVideo = searchResults[choice - 1];
    const videoId = selectedVideo.id;

    try {
      await processYoutubeUrl(videoId, type, message, getLang, selectedVideo.title, selectedVideo.channel);
      api.unsendMessage(waitingMessage);
    } catch (error) {
      console.error(error);
      return message.reply(getLang("error", error.message));
    }
  }
};

async function processYoutubeUrl(videoId, type, message, getLang, videoTitle, videoChannel) {
  try {
    if (type === "video") {
      await downloadAndStreamVideo(videoId, videoTitle, videoChannel, message);
    } else if (type === "audio") {
      await downloadAndStreamAudio(videoId, videoTitle, videoChannel, message);
    } else if (type === "info") {
      const searchResults = await yts({ videoId });
      const videoInfo = searchResults.videos[0];
      const infoMsg = getLang("info", 
        videoInfo.title || "N/A",
        videoInfo.author.name || "N/A",
        videoInfo.timestamp || "N/A",
        videoId,
        `https://youtu.be/${videoId}`
      );
      await message.reply(infoMsg);
    }
  } catch (error) {
    throw new Error(`Failed to process YouTube URL: ${error.message}`);
  }
}

function extractVideoId(url) {
  const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
  return videoIdMatch ? videoIdMatch[1] : null;
}