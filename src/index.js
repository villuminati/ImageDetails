/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
		const formData = await request.formData();
		const image = formData.get("image");

		// To understand the byte manipulations refer: https://stackoverflow.com/questions/15327959/get-height-and-width-dimensions-from-a-base64-encoded-png-image
		function toInt32(bytes) {
			return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
		}

		const buffer = await image.arrayBuffer();
		const array = new Uint8Array(buffer);

		const responseContent = JSON.stringify({
			dimensions: {
				width: toInt32(array.slice(16, 20)),
				height: toInt32(array.slice(20, 24)),
			},
			size: image.size,
		});

		return new Response(responseContent, {
			headers: {
				"content-type": "application/json;charset=UTF-8",
			},
		});
	},
};
