<script>
	import Keyboard from "$lib/instruments/Keyboard.svelte";
	const { data } = $props();
</script>

<Keyboard instrumentType="drums" library="smplr" {data} />

<style>
</style>
