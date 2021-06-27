const axios = require('axios');
const links = ["https://www.reddit.com"];

function getVideo(url) {
	return new Promise((resolve, reject) => {
		url = url.split('/');
		url.push(".json" + url.pop());
		url = url.join('/');
		axios.get(url).then(res => {
			const video = res?.data[0]?.data?.children[0]?.data?.secure_media?.reddit_video?.fallback_url;
			if (!video) return reject();
			resolve({ url: video });
		}).catch(() => reject());
	});
}

exports.getVideo = getVideo;
exports.links = links;