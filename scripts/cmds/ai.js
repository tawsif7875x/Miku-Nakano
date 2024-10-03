const axios = require("axios");

module.exports = {
  config: {
    name: "ai",
    category: "ai"
  },
  onStart() {},
  onChat: async ({ message: { reply: r }, args: a, event: { senderID: s, threadID: t, body: b }, commandName, usersData }) => {

    const allow = ["lover", "helpful", "friendly", "toxic", "bisaya", "horny", "tagalog"/*"naughty"*/];
    const num = allow.map((i, x) => `${x + 1}. ${i}`).join("\n");
    if (!b?.toLowerCase().startsWith("ai")) return;

    var p = a.slice(1);
    const { name, settings, gender } = await usersData.get(s);
const gen = gender === 2 ? 'male': 'female';
    const sys = settings.system || "helpful";
    if (!p.length) {
      return r(`Hello ${name}, how can I help you?\nYou can choose your assistant by typing:\nai set <assistant name>\navailable assistants are\n${num}\n\nexample: ai set friendly\n`);
    }
    if (p[0].toLowerCase() === "set" && p.length > 1) {
      const choice = p[1].toLowerCase();
      if (allow.includes(choice)) {
        await usersData.set(s, { settings: { system: choice } });
        return r(`Successfully changed assistant to ${choice}`);
      } else {
        return r(`Invalid choice.\nAllowed assistants are:\n${num}\nExample: ai set friendly\n`);
      }
    }
    const { messageID: m } = await r({
body: await ai(p.join(" "), s, name, sys, gen),
mentions: [{ id: s, tag: name }]
});
    global.GoatBot.onReply.set(m, { commandName, s });
  },
  onReply: async ({ Reply: { s, commandName }, message: { reply: r }, args: a, event: { senderID: x, body: b }, usersData }) => {
    const { name, settings, gender } = await usersData.get(x);
const gen = gender === 2 ? 'male': 'female';
    const sys = settings.system || "helpful";
    if (s !== x || (b?.toLowerCase().startsWith("ai"))) return;
    const { messageID: m } = await r({
body: await ai(a.join(" ") || "👍", s, name, sys, gen),
mentions: [{ id: x, tag: name }]
});
    global.GoatBot.onReply.set(m, { commandName, s, sys });
  }
};

async function ai(prompt, id, name, system, gender) {
  const post = (p, m = "llama3-70b-8192") => axios.post("https://apis-v70.onrender.com/g4o", { id, prompt: p, name, model: m, system, gender });  
  try {
    let response = await post(prompt);
if (["i cannot", "i can't"].some(x => response.data.toLowerCase().startsWith(x))) {
 await post("clear");
 response = await post(prompt, "llama-3.1-70b-versatile"); 
}
    return `${response.data.replace(/😂/g, "🤭")}\n`;
  } catch {
    try {
await post("clear");
      const retry = await post(prompt);
      return `${retry.data}\n`;
      
    } catch (err) {
      return err.response?.data || err.message;
    }
  }
           }