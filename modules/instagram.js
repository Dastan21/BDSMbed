const axios = require('axios');
const links = ["https://www.instagram.com"];

function getVideo(url, size_limit, size_limit_int) {
	return new Promise((resolve, reject) => {
		url = url.split("?").shift() + "?__a=1"
		axios.get(url).then(res => {
			const video = res?.data?.graphql?.shortcode_media?.video_url.split(/(\/v\/|\?)/gm);
			if (!video) return resolve({ error: "`Instagram` : video not found." });
			const id = video[2];
			const args = video.pop().split('&').map(e => e.split('='));
			const params = {};
			args.forEach(e => params[e[0]] = e[1]);
			axios.post(process.env.INSTAGRAM_API + "video/" + id, { ...params }, { responseType: 'arraybuffer' }).then(video_data => {
				if (video_data.data.length > size_limit) return resolve({ error: `\`Instagram\` : video size it too large (> ${size_limit_int}MB).` });
				resolve({ upload: true, data: video_data.data, name: (id || "instagram.mp4").split('/').pop() });
			}).catch(() => resolve({ error: "`Instagram` : video could not be loaded." }));
		}).catch(err => resolve({ error: err.response.status === 404 ? "`Instagram` : video not found." : "`Instagram` : video could not be loaded." }));
	});
}

exports.getVideo = getVideo;
exports.links = links;
exports.disabled = true;