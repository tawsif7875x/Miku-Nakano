const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
	config: {
		name: "trash",
		version: "1.1",
		author: "NTKhang & Tawsif~",
		countDown: 5,
		role: 0,
		shortDescription: "",
		longDescription: "trash someone",
		category: "fun",
		guide: {
			en: "   {pn} @tag | reply"
		}
	},

	langs: {
		vi: {
			noTag: "Bạn phải tag người bạn muốn tát"
		},
		en: {
			noTag: "You must tag or reply the person you want to trash"
		}
	},

	onStart: async function ({ event, message, usersData, args, getLang }) {
		const uid1 = event.senderID;
		let uid2 = Object.keys(event.mentions)[0];
if (event.type === "message_reply") {
uid2 = event.messageReply.senderID;}
		if (!uid2)
			return message.reply(getLang("noTag"));
		const avatarURL2 = await usersData.getAvatarUrl(uid2);
		const img = await new DIG.Trash().getImage(avatarURL2);
		const pathSave = `${__dirname}/tmp/${uid1}_${uid2}trash.png`;
		fs.writeFileSync(pathSave, Buffer.from(img));
		const content = args.join(' ').replace(Object.keys(event.mentions)[0], "");
		message.reply({
			body: `${(content || "trash spotted")}`,
			attachment: fs.createReadStream(pathSave)
		}, () => fs.unlinkSync(pathSave));
	}
};