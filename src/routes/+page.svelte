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
	import Piano from "./Piano.svelte";
	import ElectricPiano from "./ElectricPiano.svelte";

	// let color = "blue";
	// $: if (browser) color = localStorage.color;

	let currentInstrument = "keyboard";
</script>


<Keyboard />

<Footer />

<style>
</style>
