<script>
	import Keyboard from "$lib/instruments/Keyboard.svelte";
  const { data } = $props();
</script>

<Keyboard instrumentType="soundfont-drums" library="smplr" startingOctave="3" {data} />

<style>
</style>
