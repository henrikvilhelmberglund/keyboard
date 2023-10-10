<script>
	import { onMount } from "svelte";
	let darkMode;
	onMount(() => {
		darkMode = localStorage.theme === "dark" ? true : false;
	});

	function toggle() {
		darkMode = !darkMode;
		// Tailwind dark mode
		// On page load or when changing themes, best to add inline in `head` to avoid FOUC
		if (!darkMode) {
			// Whenever the user explicitly chooses light mode
			localStorage.theme = "light";
		}
		if (darkMode) {
			// Whenever the user explicitly chooses dark mode
			localStorage.theme = "dark";
		}

		if (localStorage.theme === "dark" || !("theme" in localStorage)) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}

		// Whenever the user explicitly chooses to respect the OS preference
		// localStorage.removeItem("theme");
	}
</script>

<button on:click={() => toggle()} aria-label="dark mode toggle" class="i-carbon-sun dark:i-carbon-moon mx-4 p-4 text-2xl dark:text-white" />

<style>
</style>
