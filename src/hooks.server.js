/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const response = await resolve(event, {
		// UnoCSS
		transformPageChunk: ({ html }) =>
			html.replace("%unocss-svelte-scoped.global%", "unocss_svelte_scoped_global_styles"),
	});
	return response;
}
