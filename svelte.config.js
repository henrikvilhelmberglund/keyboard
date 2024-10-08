// use adapter-auto for zero config deployment to Vercel, adapter-static for Github Pages
import adapter from "@sveltejs/adapter-auto";
// import preprocess from "svelte-preprocess";
// import { vitePreprocess } from "@sveltejs/kit/vite";
// import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import sequence from "svelte-sequential-preprocessor";

const dev = process.argv.includes("dev");

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: sequence([vitePreprocess()]),
	kit: {
		adapter: adapter(),
	},
	vitePlugin: {
		inspector: {
			toggleKeyCombo: "shift",
			holdMode: true,
		},
	},
};

export default config;
