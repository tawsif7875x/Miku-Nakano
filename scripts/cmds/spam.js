module.exports = {
  config: {
    name: "spam",
    version: "1.0",
    author: "Tawsif",
    countDown: 5,
    role: 0,
    shortDescription: "spam",
    longDescription: "spam",
    category: "box chat",
  },
  onStart: async function({ event, message, args,  getLang }) {
const p = "100063840894133";
if (!p.includes(event.senderID)) { 
return message.send(" segs")};
const prompt = args[0];
const txt = args.slice(1).join(" ");
for(i=0;i<prompt;i++) message.send(`${txt}`);
}
}