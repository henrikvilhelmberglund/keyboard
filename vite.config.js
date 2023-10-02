import { sveltekit } from "@sveltejs/kit/vite";
import UnoCSS from "@unocss/svelte-scoped/vite";
import mkcert from "vite-plugin-mkcert";

// silly import to make changes in uno.config.js restart the Vite dev server
import { reloadMe } from "./uno.config";
import { defineConfig } from "vite";
export default defineConfig({
	server: { host: true, https: true, proxy: {} },
	plugins: [
		UnoCSS({
			injectReset: "@unocss/reset/tailwind.css",
		}),
		sveltekit(),
		mkcert(),
	],
});
