module.exports = {
config: {
		name: "up2",
		role: 0,
		countdown: 5,
		author: "Tawsif~",
		category: "system",
		longDescription: {
 				en: "shows current uptime"
		},
		guide: {
				en: "{pn} "
		}
},
onStart: async function ({ message }) {
const u = process.uptime();
const h = Math.floor(u/3600);
const m = Math.floor(u %3600 /60);
const s = Math.floor(u %60);
message.reply(`╭───────────╮\n│      UPTIME    INFO          │\n│───────────│\n│${h} Hrs│${m} Min │${s} Sec │\n╰───────────╯`);
	}
}