const TwitterVideo = require('video-url-link').twitter;
const links = ["https://twitter.com", "https://t.co"];

function getVideo(url) {
	return new Promise((resolve, reject) => {
		TwitterVideo.getInfo(url, {}, (error, info) => {
			if (error) return reject();
			const video = info.variants.filter(e => e.bitrate).sort((a, b) => b.bitrate - a.bitrate)[0];
			if (!video) return reject();
			resolve({ url: video.url });
		});
	});
}

exports.getVideo = getVideo;
exports.links = links;