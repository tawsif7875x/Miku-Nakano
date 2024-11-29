
module.exports = {
  config: {
    name: "edit",
    version: "1.0",
    author: "Tawsif",
    countDown: 5,
    role: 0,
    shortDescription: "tools",
    longDescription: "",
    category: "tools",
  },
  onStart: async function({ event, args, api,  message }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage("Please provide a prompt.", event.threadID);
    }

    try {
 api.editMessage(`${prompt}`, (event.messageReply.messageID));
    } catch (error) {
      api.sendMessage("An error occurred while editing the message.", event.threadID);
      console.error(error);
    }
  },
};