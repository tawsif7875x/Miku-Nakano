const fs = require("fs-extra");
const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: "allfile",
    version: "1.1",
    role: 0,
    coolDown: 5,
    author: "Mahi--",
    category: "admin",
    shortDescription: {
      en: "Send any file from bot's directory"
    },
    longDescription: {
      en: "Allows bot admins to send any file from the bot's file structure.",
    },
  },
  onStart: async function ({ api, event, args, message }) {
    const permission = ["100063840894133"];

    // Admin permission check
    if (!permission.includes(event.senderID)) {
      return api.sendMessage(
        "Baka! Only Tawsif can use this command.",
        event.threadID,
        event.messageID
      );
    }

    const { threadID, messageID } = event;
    const prefix = getPrefix(threadID);
    const commandName = this.config.name;
    const command = prefix + commandName;

    // Check if a file name was provided
    if (args.length === 0) {
      return message.reply(`Please specify a file name. Usage: ${command} <file_name>`);
    }

    // Handle file extension - add `.js` if no extension is provided
    let fileName = args[0];
    if (!fileName.includes(".")) {
      fileName += ".js"; // Default extension is `.js`
    }

    const filePath = fileName; // This allows you to specify any file in the bot directory

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return message.reply(`File ${fileName} not found. Please check the file name.`);
    }

    try {
      // Read and send file content
      const fileData = await fs.readFile(filePath, "utf-8");
      api.sendMessage(fileData, threadID, messageID);
    } catch (error) {
      console.error(error);
      message.reply(`There was an issue reading the file. Please check the file and try again.`);
    }
  }
};