<script>
	import { drumSamples, getMidiNotes, noteValueOffset } from "$lib/midinotes";
	// import { WebMidi } from "../../node_modules/webmidi/dist/esm/webmidi.esm.min.js";
	import { DrumMachine, getDrumMachineNames } from "smplr";
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
		if (!isMobileDevice()) return;
		document.getElementById(getMidiNotes()[lowerLimit].name).focus();
	});

	function setKeyDown(key, bool) {
		keyDown[key] = bool;
	}

	function isMobileDevice() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);
	}

	let octave = "4";
	$: lowerLimit = parseInt(octave) * 12;
	$: upperLimit = isMobileDevice() ? parseInt(octave) * 12 + 24 : parseInt(octave) * 12 + 36;
	let output;
	// let channel;
	let mouseDown = false;
	let keyDown = {};
	let touching = false;
	let instrument = "TR-808";
	let displayInstrument = instrument;
	let instrumentValue = getDrumMachineNames()[instrument];
	const context = new AudioContext();
	$: channel = new DrumMachine(context, { instrument });
</script>

<p class="absolute left-0 right-0 w-min dark:text-white">{displayInstrument}</p>
<div class="flex">
	<select class="mr-2 px-2" bind:value={octave} name="" id="">
		<option value="1">1</option>
		<option value="2">2</option>
		<option value="3">3</option>
		<option value="4">4</option>
		<option value="5">5</option>
		<option value="6">6</option>
		<option value="7">7</option>
	</select>
	<input
		type="range"
		name=""
		id=""
		class="w-[calc(100vw-100px)]"
		min="0"
		max="127"
		bind:value={instrumentValue}
		on:input={() => (displayInstrument = getDrumMachineNames()[instrumentValue])}
		on:change={() => {
			instrument = getDrumMachineNames()[instrumentValue];
			console.log(instrument);
		}} />
</div>
<div id="keyboard" class="!m-px">
	{#key octave}
		{#each drumSamples as note, i}
			<!-- {#if i >= lowerLimit && i <= upperLimit} -->
			<button
				id={note}
				on:touchstart={() => {
					touching = true;
					channel.start(note);
					setKeyDown(note, true);
				}}
				on:touchend={() => {
					// touching = false;
					// channel.stop(note.name);
					setKeyDown(note, false);
				}}
				on:mousedown={() => {
					if (touching) return;
					channel.start(note);
					mouseDown = true;
					setKeyDown(note, true);
				}}
				on:mouseup={() => {
					if (touching) return;
					channel.stop(note);
					mouseDown = false;
					setKeyDown(note, false);
				}}
				on:mouseenter={() => {
					if (touching) return;
					if (mouseDown) {
						channel.start(note);
						setKeyDown(note, true);
					}
				}}
				on:mouseleave={() => {
					if (touching) return;
					channel.stop(note);
					setKeyDown(note, false);
				}}
				on:keydown={(e) => {
					// console.log(e);
					// TODO fix this nightmare
					if (!keyDown[getMidiNotes()[lowerLimit + keyboardNotes[e.code]].name])
						channel.start(getMidiNotes()[lowerLimit + keyboardNotes[e.code]].name);
					setKeyDown(getMidiNotes()[lowerLimit + keyboardNotes[e.code]].name, true);
				}}
				on:keyup={(e) => {
					channel.stop(getMidiNotes()[lowerLimit + keyboardNotes[e.code]].name);
					setKeyDown(getMidiNotes()[lowerLimit + keyboardNotes[e.code]].name, false);
				}}
				class:!bg-primary-300={keyDown[note.name]}
				class="border-1 dark:bg-primary-900 h-24 w-24 rounded border-black bg-white text-xs"
				>{note}</button>
			<!-- {/if} -->
		{/each}
	{/key}
</div>

<style>
	.black {
		@apply absolute h-40 w-8 -translate-x-4 bg-black;
	}
	#keyboard button {
		-webkit-tap-highlight-color: transparent;
	}
</style>
