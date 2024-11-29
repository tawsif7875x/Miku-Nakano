module.exports = {
  config: {
    name: "alldit",
    aliases: [],
    author: "Tawsif",  
    version: "1.0",
    cooldowns: 30,
    role: 0,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "edit all messages sent by bot"
    },
    category: "tools",
    guide: {
      en: "{p}{n}"
    }
  },
  onStart: async function ({ api, args, event }) {
    const prompt = args.join(" ");

    const unsendBotMessages = async () => {
      const threadID = event.threadID;


      const botMessages = await api.getThreadHistory(threadID, 100); // Adjust the limit as needed 50 = 50 msg


      const botSentMessages = botMessages.filter(message => message.senderID === api.getCurrentUserID());


      for (const message of botSentMessages) {
        await api.editMessage(`${prompt}`, (message.messageID));
      }
    };


    await unsendBotMessages();
  }
};