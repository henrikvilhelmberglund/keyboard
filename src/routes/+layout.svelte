<script>
	import { page } from "$app/stores";
	import DarkModeToggle from "$lib/theme/DarkModeToggle.svelte";
	import ThemeSwitcher from "$lib/theme/ThemeSwitcher.svelte";
	import "@unocss/reset/tailwind.css";
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();

	let routes = {
    "/instruments/soundfont": "Soundfont player",
		"/instruments/keyboard": "Keyboard",
		"/instruments/piano": "Piano",
		"/instruments/mellotron": "Mellotron",
		"/instruments/electricpiano": "Electric Piano",
		"/instruments/soundfont-drums": "Soundfont Drums",
		"/instruments/drums": "Drums",
	};

	let currentRoute = $derived($page.route.id);
</script>

<svelte:head>
	<title>Keyboard - a playable keyboard</title>
	<meta name="description" content="This site contains a playable keyboard with several instruments, including general midi patches, piano and drums." />
</svelte:head>

<main class="dark:bg-primary-950 bg-primary-100 min-w-screen flex min-h-screen flex-col items-center [&>*]:m-4">
	<header class="flex lg:flex landscape:hidden">
		<ThemeSwitcher />
		<DarkModeToggle />
		<!-- <a href="/keyboard" class="btn-primary">Keyboard</a>
		<a href="/piano" class="btn-primary">Piano</a>
		<a href="/electricpiano" class="btn-primary">Electric piano</a>
		<a href="/drums" class="btn-primary">Drums</a> -->
		<div class="absolute top-[50vw] flex flex-col gap-24 md:relative md:top-0 md:flex-row md:gap-40">
			{#each Object.entries(routes) as [url, name]}
				<a href={url} class="group relative">
					<span class="relative">
						<span
							class:group-hover:bg-primary-100={url !== currentRoute}
							class:dark:group-hover:bg-primary-400={url !== currentRoute}
							class:!bg-primary-200={url === currentRoute || (url === "/keyboard" && currentRoute === "/")}
							class:!dark:bg-primary-500={url === currentRoute || (url === "/keyboard" && currentRoute === "/")}
							class:!mt-2={url === currentRoute || (url === "/keyboard" && currentRoute === "/")}
							class="border-primary-500 bg-primary-300 absolute z-10 w-36 rounded-2xl border-2 p-1 py-4 text-center transition-all">{name}</span>
					</span>
					<span class="border-primary-400 bg-primary-400 absolute inset-0 top-4 w-36 rounded-2xl border-2 p-1 py-6"></span>
				</a>
			{/each}
		</div>
	</header>

	{@render children?.()}
</main>

<style></style>
