<script>
	import { color } from "$lib/stores";
	import { themeColors } from "./theme";

	let selectedTheme;

	$: {
		if (selectedTheme) {
			themeColors.forEach((theme) => {
				document.documentElement.classList.remove(theme);
			});
			$color = selectedTheme;
			document.documentElement.classList.add(selectedTheme);
		}
	}
</script>

{#each themeColors as themeColor}
	<button
		on:click={() => (selectedTheme = themeColor)}
		class="mx-2 h-10 w-16 rounded p-2 text-transparent bg-{themeColor}-500" />
{/each}

<style>
</style>
