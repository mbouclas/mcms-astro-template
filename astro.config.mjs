// Full Astro Configuration API Documentation:
// https://docs.astro.build/reference/configuration-reference
import dotenv from 'dotenv'
dotenv.config();

// @ts-check
export default /** @type {import('astro').AstroUserConfig} */ ({
	buildOptions: {
		sitemap: true,
		site: process.env.SITE_URL
	},
	// Comment out "renderers: []" to enable Astro's default component support.
	renderers: [],
});
