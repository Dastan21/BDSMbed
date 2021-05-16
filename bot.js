const videoUrlLink = require('video-url-link');
const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config');
  
bot.on('ready', () => { console.log(bot.user.tag + " is online"); });

bot.on('message', msg => {
	if (!msg.guild) return;
	if (!msg.content.includes("https://twitter.com") && !msg.content.includes("https://t.co")) return;
	downloadVideo(msg);
});

function downloadVideo(msg) {
	const args = msg.content.split(' ');
	let url = null;
	for (const a of args) if (a.startsWith("https://twitter.com") || a.startsWith("https://t.co")) { url = a; break; }
	if (!url) return;
	videoUrlLink.twitter.getInfo(url, {}, (error, info) => {
		if (error) return console.error(error);
		const video = orderJsonArray(info.variants)[3];
		msg.channel.send(video.url).catch(()=>{});
	});
}

bot.login(config.token);

function orderJsonArray(json){
	return json.sort(sortByProperty("bitrate"));
}

function sortByProperty(property){  
	return function(a,b){  
	   if(a[property] > b[property])  
		  return 1;  
	   else if(a[property] < b[property])  
		  return -1;  
	   return 0;  
	}  
 }