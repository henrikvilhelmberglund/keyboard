<script>
	import DarkModeToggle from "$lib/theme/DarkModeToggle.svelte";
	import ThemeSwitcher from "$lib/theme/ThemeSwitcher.svelte";
	import "@unocss/reset/tailwind.css";
</script>

<main
	class="dark:bg-primary-950 bg-primary-100 min-w-screen flex min-h-screen flex-col items-center [&>*]:m-4">
	<header>
		<ThemeSwitcher />
		<DarkModeToggle />
		<a href="/keyboard" class="btn-primary">Keyboard</a>
		<a href="/piano" class="btn-primary">Piano</a>
		<a href="/electricpiano" class="btn-primary">Electric piano</a>
		<a href="/drums" class="btn-primary">Drums</a>
	</header>

	<slot />
</main>

<style></style>
