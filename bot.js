require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();
const SIZE_LIMIT = [8388608, 8388608, 52428800, 104857600];
const SIZE_LIMIT_INT = [8, 8, 50, 100];
const modules = {};

// bot is up
bot.on('ready', () => console.log(bot.user.tag + " is online"));

// every message
bot.on('message', msg => {
	if (!msg.guild) return;
	if (!Object.keys(modules)) return;
	if (msg.guild.id !== "763510590718476298") return; // DEBUG

	const args = msg.content.split(/\s/gm);
	for (const module_name in modules)
		for (const link of modules[module_name]?.links)
			for (const arg of args)
				if (arg.startsWith(link) && !modules[module_name]?.disabled) {
					msg.channel.send("Loading `" + module_name + "` video...").then(msg => {
						modules[module_name]?.getVideo(arg, SIZE_LIMIT[msg.guild.premiumTier], SIZE_LIMIT_INT[msg.guild.premiumTier]).then(video => {
							if (video.error) msg.channel.send(video.error).then(() => msg.delete().catch(() => {})).catch(() => {});
							else if (video.upload) msg.channel.send("", new Discord.MessageAttachment(video.data, video.name)).then(() => msg.delete().catch(() => {})).catch(() => {});
							else msg.channel.send(video.url).then(() => msg.delete().catch(() => {})).catch(() => {});
						}).catch(() => msg.delete().catch(() => {}));
					}).catch(() => msg.delete().catch(() => {}));
				}
});

// modules initialization
(() => {
	fs.readdir(process.env.MODULES_PATH, (err, files) => {
		if (err) return console.error(err);

		files.forEach(file => {
			if (file.endsWith(".js")) {
				const module_name = file.split(".js")[0];
				try {
					modules[module_name] = require(process.env.MODULES_PATH + module_name);
				} catch (e) {
					console.error(e);
				}
			}
		});
	});
})()

// bot authentification
bot.login(process.env.TOKEN);
