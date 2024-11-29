module.exports = {
config: {
	name: "rp",
	role: 2,
},
onStart: async function(){},
onChat: async function ({ event, message }) {
const texts = "please stop exposing yourself, My Lord";
if (event.body.match(/ex/)) {
message.send(`${texts}`)};
	}
}