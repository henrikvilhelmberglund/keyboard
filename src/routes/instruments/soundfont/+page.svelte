<script>
	import Keyboard from "$lib/instruments/Keyboard.svelte";
	const { data } = $props();
</script>

<Keyboard instrumentType="soundfont" library="spessasynth" {data} />

<style>
</style>
