// Full Astro Configuration API Documentation:
// https://docs.astro.build/reference/configuration-reference
import dotenv from 'dotenv';
import fs from 'fs';
let path;
if (fs.existsSync('/etc/secrets/.env')) {
	path = '/etc/secrets/.env';
}

dotenv.config({path});

// @ts-check
export default /** @type {import('astro').AstroUserConfig} */ ({
	buildOptions: {
		sitemap: true,
		site: process.env.SITE_URL
	},
	// Comment out "renderers: []" to enable Astro's default component support.
	renderers: [],
});
