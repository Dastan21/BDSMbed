const axios = require('axios');
const fbdl = require('fbdl-core');
const links = ["https://www.facebook.com", "https://m.facebook.com"];

function getVideo(url, size_limit) {
	return new Promise((resolve, reject) => {
		if (url.endsWith("/")) url = url.slice(0, -1);
		fbdl.getInfo(url).then(res => {
			if (!res?.rawVideo) return reject();
			axios.get(res.rawVideo, { responseType: 'arraybuffer' }).then(video_data => {
				if (video_data.data.length > size_limit) return reject();
				resolve({ upload: true, data: video_data.data, name: (res.name || "facebook").replace(/\s/gm, "") + ".mp4" });
			}).catch(() => reject());
		}).catch(() => reject());
	});
}

exports.getVideo = getVideo;
exports.links = links;