<script>
	import { run } from 'svelte/legacy';

	import { color } from "$lib/stores";
	import { themeColors } from "./theme";

	let selectedTheme = $state();

	run(() => {
		if (selectedTheme) {
			themeColors.forEach((theme) => {
				document.documentElement.classList.remove(theme);
			});
			$color = selectedTheme;
			document.documentElement.classList.add(selectedTheme);
		}
	});
</script>

{#each themeColors as themeColor}
	<button
		onclick={() => (selectedTheme = themeColor)}
    aria-label="theme-{themeColor}"
		class="mx-2 h-10 w-16 rounded p-2 text-transparent bg-{themeColor}-500" />
{/each}

<style>
</style>
