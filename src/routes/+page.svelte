<script>
	import { onMount } from "svelte";
	import { base } from "$app/paths";
	import Footer from "$lib/Footer.svelte";
	import DarkModeToggle from "$lib/theme/DarkModeToggle.svelte";
	import ThemeSwitcher from "$lib/theme/ThemeSwitcher.svelte";
	import { browser } from "$app/environment";
	import { color } from "$lib/stores";
	import MeltAccordion from "$lib/melt-examples/MeltAccordion.svelte";
	import Keyboard from "./Keyboard.svelte";
	import Drums from "./Drums.svelte";

	// let color = "blue";
	// $: if (browser) color = localStorage.color;

	let currentInstrument = "keyboard";
</script>

<main
	class="dark:bg-primary-950 bg-primary-100 min-w-screen flex min-h-screen flex-col items-center [&>*]:m-4">
	<header>
		<ThemeSwitcher />
		<DarkModeToggle />
		<button on:click={() => (currentInstrument = "keyboard")} class="btn-primary">Keyboard</button>
		<button on:click={() => (currentInstrument = "drums")} class="btn-secondary">Drums</button>
	</header>

	{#if currentInstrument === "keyboard"}
		<Keyboard />
	{:else if currentInstrument === "drums"}
		<Drums />
	{/if}
</main>

<Footer />

<style>
</style>
