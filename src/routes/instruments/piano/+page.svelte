<script>
	import Keyboard from "$lib/instruments/Keyboard.svelte";
  const { data } = $props();
</script>

<Keyboard instrumentType="piano" library="smplr" data={data} />

<style>
</style>
