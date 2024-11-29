module.exports = {
  config: {
    name: 'ping',
    aliases: [],
    version: '1.1',
    author: 'Mahi--',
    role: 0,
    shortDescription: 'Check bot ping in real time',
    longDescription: 'Displays the bot\'s ping and updates it in real time for 5 times with 2-second intervals.',
    category: 'system'
  },
  onStart: async function ({ message, api }) {
    try {
      // Send the initial message
      let sentMessage = await message.reply('Calculating ping...');

      // Function to update ping with 2-second delay and update 5 times
      const updatePing = async (count = 0) => {
        if (count < 5) {
          const startTime = Date.now(); // Mark the time before the API request
          
          // Simulate an API call to measure latency (ping)
          const tempMessage = await api.getThreadInfo(message.threadID); // Any API call can be used to calculate latency
          
          const botPing = Date.now() - startTime; // Calculate the actual ping

          // Edit message with updated ping
          await api.editMessage(`Ping: ${botPing}ms\n[Update ${count + 1}/5]`, sentMessage.messageID);

          // Set a 2-second delay before the next update
          setTimeout(() => updatePing(count + 1), 2000);
        } else {
          // Final ping measurement after 5 updates
          const finalPing = Date.now() - sentMessage.timestamp;
          api.editMessage(`✅ Final ping: ${finalPing}ms`, sentMessage.messageID);
        }
      };

      // Start updating the ping 5 times with 2-second intervals
      updatePing();

    } catch (err) {
      console.error(err);
      return message.reply("❌ An error occurred while checking the ping.");
    }
  }
};