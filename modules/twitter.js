const TwitterVideo = require('video-url-link').twitter;
const links = ["https://twitter.com", "https://t.co"];

function getVideo(url) {
	return new Promise((resolve) => {
		TwitterVideo.getInfo(url, {}, (error, info) => {
			if (error) return resolve({ error: "`Twitter` : video could not be loaded." });
			const video = info.variants.filter(e => e.bitrate).sort((a, b) => b.bitrate - a.bitrate)[0];
			resolve(video ? { url: video.url } : { error: "`Twitter` : video could not be loaded." });
		});
	});
}

exports.getVideo = getVideo;
exports.links = links;