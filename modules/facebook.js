const axios = require('axios');
const fbdl = require('fbdl-core');
const links = ["https://www.facebook.com", "https://m.facebook.com"];

function getVideo(url, size_limit, size_limit_int) {
	return new Promise((resolve) => {
		axios.get(url).then(res => {
			url = "https://www.facebook.com" + res.request?.path.replace(/\/$/gm, "");
			fbdl.getInfo(url).then(res => {
				if (!res.rawVideo) return resolve({ error: "`Facebook` : video not found." });
				axios.get(res.rawVideo, { responseType: 'arraybuffer' }).then(video_data => {
					if (video_data.data.length > size_limit) return resolve({ error: `\`Facebook\` : video size it too large (> ${size_limit_int}MB).` });
					resolve({ upload: true, data: video_data.data, name: (res.name || "facebook").replace(/\s/gm, "") + ".mp4" });
				}).catch(() => resolve({ error: "`Facebook` : video could not be loaded." }));
			}).catch(() => resolve({ error: "`Facebook` : video could not be loaded." }));
		}).catch(err => resolve({ error: err.response.status === 404 ? "`Facebook` : video not found." : "`Facebook` : video could not be loaded." }));
	});
}

exports.getVideo = getVideo;
exports.links = links;