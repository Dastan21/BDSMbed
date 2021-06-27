const axios = require('axios');
const links = ["https://www.reddit.com"];

function getVideo(url) {
	return new Promise((resolve, reject) => {
		url = url.split('/');
		url.push(".json" + url.pop());
		url = url.join('/');
		axios.get(url).then(res => {
			const video = res?.data[0]?.data?.children[0]?.data?.secure_media?.reddit_video?.fallback_url;
			resolve(video ? { url: video } : { error: "`Reddit` : video could not be loaded." });
		}).catch(() => resolve({ error: "`Reddit` : video could not be loaded." }));
	});
}

exports.getVideo = getVideo;
exports.links = links;