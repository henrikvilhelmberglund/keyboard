<script>
	import { getMidiNotes, keyboardNotes } from "$lib/midinotes";
	// import { WebMidi } from "../../node_modules/webmidi/dist/esm/webmidi.esm.min.js";
	import { Soundfont, getSoundfontNames } from "smplr";
	import { afterUpdate } from "svelte";

	// WebMidi.enable()
	// 	.then(() => {
	// 		// console.log("WebMidi enabled!");
	// 		output = WebMidi.outputs[0];
	// 		// console.log(output);
	// 		channel = output.channels[1];
	// 		// channel.start("C3");
	// 	})
	// 	.catch((err) => alert(err));

	afterUpdate(() => {
		document.getElementById("C3").focus();
	});

	function setKeyDown(key, bool) {
		keyDown[key] = bool;
	}

	function isMobileDevice() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);
	}

	let limit;
	let output;
	// let channel;
	let mouseDown = false;
	let keyDown = {};
	let touching = false;
	let instrument = "marimba";
	let instrumentValue = 0;
	const context = new AudioContext();
	$: channel = new Soundfont(context, { instrument });

	if (isMobileDevice()) {
		limit = 61;
	} else {
		limit = 73;
	}
</script>

<input
	type="range"
	name=""
	id=""
	class="w-[calc(100vw-60px)]"
	min="0"
	max="127"
	bind:value={instrumentValue}
	on:change={() => {
		instrument = getSoundfontNames()[instrumentValue];
		console.log(instrument);
	}} />
<div id="keyboard" class="!m-px">
	{#each getMidiNotes() as note, i}
		{#if i > 35 && i < limit}
			<button
				id={note.name}
				on:touchstart={() => {
					touching = true;
					channel.start(note.name);
					setKeyDown(note.name, true);
				}}
				on:touchend={() => {
					// touching = false;
					// channel.stop(note.name);
					setKeyDown(note.name, false);
				}}
				on:mousedown={() => {
					if (touching) return;
					channel.start(note.name);
					mouseDown = true;
					setKeyDown(note.name, true);
				}}
				on:mouseup={() => {
					if (touching) return;
					channel.stop(note.name);
					mouseDown = false;
					setKeyDown(note.name, false);
				}}
				on:mouseenter={() => {
					if (touching) return;
					if (mouseDown) {
						channel.start(note.name);
						setKeyDown(note.name, true);
					}
				}}
				on:mouseleave={() => {
					if (touching) return;
					channel.stop(note.name);
					setKeyDown(note.name, false);
				}}
				on:keydown={(e) => {
					// console.log(e);
					if (!keyDown[keyboardNotes[e.code]]) channel.start(keyboardNotes[e.code]);
					setKeyDown(keyboardNotes[e.code], true);
				}}
				on:keyup={(e) => {
					channel.stop(keyboardNotes[e.code]);
					setKeyDown(keyboardNotes[e.code], false);
				}}
				class:black={note.name.includes("#")}
				class:!bg-primary-300={keyDown[note.name]}
				class="border-1 h-64 w-12 rounded border-black bg-white" />
		{/if}
	{/each}
</div>

<style>
	.black {
		@apply absolute h-40 w-8 -translate-x-4 bg-black;
	}
	#keyboard button {
		-webkit-tap-highlight-color: transparent;
	}
</style>
