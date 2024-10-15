<script>
	import { onMount } from "svelte";
	import { base } from "$app/paths";
	import Footer from "$lib/Footer.svelte";
	import DarkModeToggle from "$lib/theme/DarkModeToggle.svelte";
	import ThemeSwitcher from "$lib/theme/ThemeSwitcher.svelte";
	import { browser } from "$app/environment";
	import { color } from "$lib/stores";
	import Keyboard from "$lib/instruments/Keyboard.svelte";
	import Drums from "$lib/instruments/Drums.svelte";
	import Piano from "$lib/instruments/Piano.svelte";
	import ElectricPiano from "$lib/instruments/ElectricPiano.svelte";

	// let color = "blue";
	// $: if (browser) color = localStorage.color;

	
</script>

<Keyboard instrumentType="keyboard" library="smplr" />

<Footer />

<style>
</style>
