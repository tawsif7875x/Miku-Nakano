const axios = require("axios");
  const fs = require("fs");

  module.exports = {
    config: {
      name: "pending",
      aliases: [],
      version: "1.0",
      author: "Xemon",
      countDown: 5,
      role: 2,
      shortDescription: "Accept pending messages",
      longDescription: "Accept pending messages",
      category: "utility",
    },

    onReply: async function ({ message, api, event, usersData, Reply }) {
      const { author, pending } = Reply;
      if (String(event.senderID) !== String(author)) return; // Ignore if not the original author

      const { body, threadID, messageID } = event;
      let count = 0; 

      // Handling cancellation of pending messages
      if (isNaN(body) && (body.indexOf("c") === 0 || body.indexOf("cancel") === 0)) {
        const index = body.slice(1).split(/\s+/); 
        for (const singleIndex of index) {
          if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > pending.length) 
            return api.sendMessage(`[ ERR ] ${singleIndex} Not a valid number`, threadID, messageID);
        }
        return api.sendMessage(`[ OK ] Successfully refused`, threadID, messageID);
      } else {
        const index = body.split(/\s+/);
        for (const singleIndex of index) {
          if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > pending.length)
            return api.sendMessage(`❯ ${singleIndex} Not a valid number`, threadID, messageID);

          // Approving a pending message
          api.unsendMessage(messageID); // Delete the pending message
          api.changeNickname(
            `${!global.GoatBot.config.nickNameBot ? "Made by ???" : global.GoatBot.config.nickNameBot}`,
            pending[singleIndex - 1].threadID,
            api.getCurrentUserID()
          );
          api.sendMessage(
            { 
              body: `${global.GoatBot.config.nickNameBot} Bot has been approved by Owner Tawsif! Use ${global.GoatBot.config.prefix}help to see the Command Lists` 
            },
            pending[singleIndex - 1].threadID
          ); 
        }
      }
      
      setTimeout(() => { 
        const replyData = global.GoatBot.onReply.get(info.messageID);
        if (replyData) {
          const { messageID } = replyData;
          global.GoatBot.onReply.delete(messageID);
          api.unsendMessage(messageID);
        }
      }, 5000); // Cleanup after 5 seconds

      return api.sendMessage(`[ OK ] Successfully approved ${count} thread(s)!`, threadID, messageID); 

    },

    onStart: async function ({ message, api, event, args, usersData }) {
      if (args.join() === "") { 
        return api.sendMessage("❯ Use pending:\n❯ pending user: User queue\n❯ pending thread: Group queue\n❯ pending all: All boxes are waiting for approval", event.threadID, event.messageID);
      }

      const content = args.slice(1, args.length);
      switch (args[0]) {
        case "user":
        case "u":
        case "-u":
        case "User": {
          const permission = global.GoatBot.config.adminBot;
          if (!permission.includes(event.senderID)) return api.sendMessage("[ OPPS ] You don't have permission to use this command!!", event.threadID, event.messageID);

          const { threadID, messageID } = event;
          const commandName = this.config.name; 
          let msg = "", index = 1;

          try {
            var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
            var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
          } catch (e) {
            return api.sendMessage("[ ERR ] Can't get the current list", threadID, messageID);
          }

          const list = [...spam, ...pending].filter(group => group.isGroup === false);

          for (const single of list) {
            const userName = await usersData.getName(single.threadID);
            msg += `${index++}/ ${userName}(${single.threadID})\n`;
          }

          if (list.length !== 0) {
            return api.sendMessage(`❯ Total number of users to browse: ${list.length} user \n❯ Reply number below to browse\n\n${msg}`, threadID, (error, info) => {
              global.GoatBot.onReply.set(info.messageID, {
                commandName, 
                messageID: info.messageID, 
                author: event.senderID, 
                pending: list
              });
            }, messageID);
          } else {
            return api.sendMessage("[ - ] There are currently no users to browse", threadID, messageID);
          }
        }
        case "thread": 
        case "-t":
        case "t":
        case "Thread": {
          const permission = global.GoatBot.config.adminBot;
          if (!permission.includes(event.senderID)) return api.sendMessage("[ OPPS ] You don't have Permission to use this command!", event.threadID, event.messageID);
          const { threadID, messageID } = event;
          const commandName = this.config.name; 
          let msg = "", index = 1;

          try {
            var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
            var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
          } catch (e) {
            return api.sendMessage("[ ERR ] can't get the waiting list", threadID, messageID);
          }

          const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

          for (const single of list) {
            const threadName = single.name || "Unknown";
            msg += `${index++}/ ${threadName}(${single.threadID})\n`;
          }

          if (list.length !== 0) {
            return api.sendMessage(`❯ Total number of groups to be approved: ${list.length} group \n❯ Reply the order number below to browse !!!\n${msg}`, threadID, (error, info) => {
              global.GoatBot.onReply.set(info.messageID, {
                commandName,
                messageID: info.messageID,
                author: event.senderID,
                pending: list
              });
            }, messageID);
          } else {
            return api.sendMessage("[ - ] There are currently no groups in the queue", threadID, messageID);
          }
        }
        case "all":  
        case "a":
        case "-a":
        case "al": {
          const permission = global.GoatBot.config.adminBot;
          if (!permission.includes(event.senderID)) return api.sendMessage("[ OPPS ] You don't have Permission to use this command!!", event.threadID, event.messageID);
          const { threadID, messageID } = event;
          const commandName = this.config.name; 
          let msg = "", index = 1;

          try {
            var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
            var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
          } catch (e) {
            return api.sendMessage("[ ERR ] Can't get the waiting list", threadID, messageID);
          }

          const listThread = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);
          const listUser = [...spam, ...pending].filter(group => group.isGroup === false);
          const list = [...spam, ...pending].filter(group => group.isSubscribed);
          for (const single of list) {
            let displayName;
            if (single.isGroup) {
              displayName = single.name || "Unknown";
            } else {
              if (single.threadID >= 1000) {
                const userName = await usersData.getName(single.threadID);
                displayName = userName || "Unknown";
              } else {
                displayName = "Unknown";
              }
            }
            msg += `${index++}/ ${displayName}(${single.threadID})\n`;
          }

          if (list.length !== 0) {
            return api.sendMessage(`❯ Total number of Users & Threads to be approved: ${list.length} users & Threads \n❯ Reply to the order number below to browse !\n${msg}`, threadID, (error, info) => {
              global.GoatBot.onReply.set(info.messageID, {
                commandName,
                messageID: info.messageID,
                author: event.senderID,
                pending: list
              });
            }, messageID);
          } else {
            return api.sendMessage("[ - ] There are currently no users or threads in the waiting list", threadID, messageID);
          }
        }
      }
    }
  };