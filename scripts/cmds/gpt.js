//this is still under development and still in test. 
const { post, get } = require("axios");

module.exports = {
  config: { 
name: "gpt", 
category: "ai" 
},
  onStart() {},
  
  onChat: async ({ message: { reply: r }, args: a, event: { senderID: s, threadID: t, body: b, messageReply: msg }, commandName, usersData }) => {
const cmd = `${module.exports.config.name}`;
const pref = `${utils.getPrefix(t)}`;
const p = [`${pref}${cmd}`, `${cmd}`];
    if (a[0] && p.some(x => a[0].toLowerCase() === x)) {
      const p = a.slice(1), allow = ["lover", "helpful", "friendly", "toxic", "bisaya", "horny", "tagalog", "makima", "godmode", "default"];
      const num = allow.map((i, x) => `${x + 1}. ${i}`).join("\n");
      const { name, settings, gender } = await usersData.get(s);
      const gen = gender === 2 ? 'male' : 'female';
      const sys = settings.system || "helpful";

      if (!p.length) return r(`Hello ${name}, choose your assistant:\n${num}\nExample: ${cmd} set friendly`);

   if (p[0].toLowerCase() === "set" && p[1]?.toLowerCase()) {
        const choice = p[1].toLowerCase();
        if (allow.includes(choice)) {
          await usersData.set(s, { settings: { system: choice } });
          return r(`Assistant changed to ${choice}`);
        }
        return r(`Invalid choice.\nAllowed: ${num}\nExample: ai set friendly`);
      }

      const { result, media } = await ai(p.join(" "), s, name, sys, gen);

let attachments;
if (media && media.startsWith("https://cdn")) {
    attachments = await global.utils.getStreamFromURL(media, "spotify.mp3");
} else if (media) {
    attachments = await global.utils.getStreamFromURL(media);
}

const rs = {
    body: result,
    mentions: [{ id: s, tag: name }]
};

if (attachments) {
   rs.attachment = attachments;
}

  const { messageID: m } = await r(rs);
  global.GoatBot.onReply.set(m, { commandName, s });
    }
  },
 onReply: async ({ 
    Reply: { s, commandName }, 
    message: { reply: r }, 
    args: a, 
    event: { senderID: x, body: b, attachments, threadID: t }, 
    usersData 
}) => {
const cmd = `${module.exports.config.name}`;
const pref = `${utils.getPrefix(t)}`;
    const { name, settings, gender } = await usersData.get(x);
    const sys = settings.system || "helpful";
    if (s !== x || b?.toLowerCase().startsWith(cmd) || b?.toLowerCase().startsWith(pref + cmd) || b?.toLowerCase().startsWith(pref + "unsend")) return;
    let url = "";
    let body = a.join(" ");
    if (!b.includes(".")) {
     const img = attachments?.[0];
      if (img) {
     body = img.type === "sticker" && img.ID === "369239263222822" ? "👍" : body;
            url = img.url || "";
        }
    }
    body = body  || ".";
const { result, media } = await ai(body, s, name, sys, gender === 2 ? 'male' : 'female', url);
const rs = {
    body: result,
    mentions: [{ id: x, tag: name }]
};
if (media) {
    if (media.startsWith('https://cdn')) {
        rs.attachment = await global.utils.getStreamFromURL(media, "spotify.mp3");
    } else {
        rs.attachment = await global.utils.getStreamFromURL(media);
    }
}
 const { messageID } = await r(rs);       global.GoatBot.onReply.set(messageID, { commandName, s, sys });
}
};
//llama3-70b-8192
async function ai(prompt, id, name, system, gender, link = "") {
  const g4o = async (p, m = "gemma2-9b-it") => post(atob(String.fromCharCode(...atob((await get(atob("aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2p1bnpkZXZvZmZpY2lhbC90ZXN0L3JlZnMvaGVhZHMvbWFpbi90ZXN0LnR4dA=="))).data).split(" ").map(Number))),
    { 
      id, 
      prompt: p, 
      name, 
      model: "llama", 
      system, 
   customSystem: [
    {
default: "You are helpful assistant"
    },
    {
       makima: "You are a friendly  assistant, your name is makima"
      }
],
      gender, 
      nsfw: true,
      url: link ? { link, type: "image" } : undefined,
config: [{ 
 gemini: {
 apikey: "AIzaSyAqigdIL9j61bP-KfZ1iz6tI9Q5Gx2Ex_o", 
model:  "gemini-1.5-flash"
},
llama: { model: m }
}]
    },
    {
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer test' 
      } 
    });

  try {
    let res = await g4o(prompt);
    if (["i cannot", "i can't"].some(x => res.data.result.toLowerCase().startsWith(x))) {
      await g4o("clear");
      res = await g4o(prompt, "llama-3.1-70b-versatile");
    }
    return res.data;
  } catch {
    try {
    //  await g4o("clear");
      return (await g4o(prompt, "llama-3.1-70b-versatile")).data;
    } catch (err) {
      const e = err.response?.data;
      const errorMessage = typeof e === 'string' ? e : JSON.stringify(e);

      return errorMessage.includes("Payload Too Large") ? { result: "Your text is too long" } :            errorMessage.includes("Service Suspended") ? { result: "The API has been suspended, please wait for the dev to replace the API URL"  }:
            { result: e?.error || e || err.message };
    }
  }
}