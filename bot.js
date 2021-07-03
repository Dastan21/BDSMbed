require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();
const SIZE_LIMIT = [8388608, 8388608, 52428800, 104857600];
const modules = {};

// bot is up
bot.on('ready', () => console.log(bot.user.tag + " is online"));

// every message
bot.on('message', msg => {
	if (!msg.guild) return;
	if (!Object.keys(modules)) return;

	const args = msg.content.split(/\s/gm);
	for (const module_name in modules)
		for (const link of modules[module_name]?.links)
			for (const arg of args)
				if (arg.startsWith(link) && !modules[module_name].disabled) {
					modules[module_name]?.getVideo(arg, SIZE_LIMIT[msg.guild.premiumTier]).then(video => {
						if (video.upload) msg.channel.send("", new Discord.MessageAttachment(video.data, video.name)).catch(() => {});
						else msg.channel.send(video.url).catch(() => {});
					}).catch(() => {});
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
