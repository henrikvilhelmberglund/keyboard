<script>
	import { getMidiNotes, keyboardNotes } from "$lib/midinotes";
	import { WebMidi } from "../../node_modules/webmidi/dist/esm/webmidi.esm.min.js";
	import { afterUpdate } from "svelte";

	WebMidi.enable()
		.then(() => {
			// console.log("WebMidi enabled!");
			output = WebMidi.outputs[0];
			// console.log(output);
			channel = output.channels[1];
			// channel.playNote("C3");
		})
		.catch((err) => alert(err));

	afterUpdate(() => {
		document.getElementById("C2").focus();
	});

	function setKeyDown(key, bool) {
		keyDown[key] = bool;
	}

	let output;
	let channel;
	let mouseDown = false;
	let keyDown = {};
</script>

<div id="keyboard">
	{#each getMidiNotes() as note, i}
		{#if i > 23 && i < 61}
			<button
				id={note.name}
				on:mousedown={() => {
					channel.playNote(note.name);
					mouseDown = true;
					setKeyDown(note.name, true);
				}}
				on:mouseleave={() => {
					channel.stopNote(note.name);
					setKeyDown(note.name, false);
				}}
				on:mouseenter={() => {
					if (mouseDown) {
						channel.playNote(note.name);
						setKeyDown(note.name, true);
					}
				}}
				on:mouseup={() => {
					channel.stopNote(note.name);
					mouseDown = false;
					setKeyDown(note.name, false);
				}}
				on:keydown={(e) => {
					console.log(e);
					if (!keyDown[keyboardNotes[e.code]]) channel.playNote(keyboardNotes[e.code]);
					setKeyDown(keyboardNotes[e.code], true);
				}}
				on:keyup={(e) => {
					channel.stopNote(keyboardNotes[e.code]);
					setKeyDown(keyboardNotes[e.code], false);
				}}
				class:black={note.name.includes("#")}
				class:!bg-primary-300={keyDown[note.name]}
				class="border-1 h-52 w-11 rounded border-black bg-white" />
		{/if}
	{/each}
</div>

<style>
	.black {
		@apply absolute h-36 w-6 -translate-x-3 bg-black;
	}
</style>
