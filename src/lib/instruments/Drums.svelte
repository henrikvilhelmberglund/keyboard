<script>
	import { drumSamples, getMidiNotes, noteValueOffset } from "$lib/midinotes";
	// import { WebMidi } from "../../node_modules/webmidi/dist/esm/webmidi.esm.min.js";
	import { DrumMachine, getDrumMachineNames } from "smplr";

	// WebMidi.enable()
	// 	.then(() => {
	// 		// console.log("WebMidi enabled!");
	// 		output = WebMidi.outputs[0];
	// 		// console.log(output);
	// 		channel = output.channels[1];
	// 		// channel.start("C3");
	// 	})
	// 	.catch((err) => alert(err));

	$effect(() => {
    queueMicrotask(()=> {
		document.getElementById(getMidiNotes()[lowerLimit].name).focus();
    })
	});

	function setKeyDown(key, bool) {
		keyDown[key] = bool;
	}

	function isMobileDevice() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	let octave = $state("4");
	let lowerLimit = $derived(parseInt(octave) * 12);
	let upperLimit = $derived(isMobileDevice() ? parseInt(octave) * 12 + 24 : parseInt(octave) * 12 + 36);
	let output;
	// let channel;
	let mouseDown = $state(false);
	let keyDown = $state({});
	let touching = $state(false);
	let instrument = $state("TR-808");
	let displayInstrument = $state(instrument);
	let instrumentValue = $state(getDrumMachineNames()[instrument]);
	console.log(instrumentValue);
	const context = new AudioContext();
	let channel = $derived(new DrumMachine(context, { instrument }));
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
		oninput={() => (displayInstrument = getDrumMachineNames()[instrumentValue])}
		onchange={() => {
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
				ontouchstart={() => {
					touching = true;
					channel.start({ note: note });
					setKeyDown(note, true);
				}}
				ontouchend={() => {
					// touching = false;
					// channel.stop({ note: note });
					setKeyDown(note, false);
				}}
				onmousedown={() => {
					if (touching) return;
					channel.start({ note: note });
					mouseDown = true;
					setKeyDown(note, true);
				}}
				onmouseup={() => {
					if (touching) return;
					channel.stop({ note: note });
					mouseDown = false;
					setKeyDown(note, false);
				}}
				onmouseenter={() => {
					if (touching) return;
					if (mouseDown) {
						channel.start({ note: note });
						setKeyDown(note, true);
					}
				}}
				onmouseleave={() => {
					if (touching) return;
					channel.stop({ note: note });
					setKeyDown(note, false);
				}}
				onkeydown={(e) => {
					// console.log(e);
					// TODO fix this nightmare
					if (!keyDown[getMidiNotes()[lowerLimit + keyboardNotes[e.code]].name]) channel.start(getMidiNotes()[lowerLimit + keyboardNotes[e.code]].name);
					setKeyDown(getMidiNotes()[lowerLimit + keyboardNotes[e.code]].name, true);
				}}
				onkeyup={(e) => {
					channel.stop(getMidiNotes()[lowerLimit + keyboardNotes[e.code]].name);
					setKeyDown(getMidiNotes()[lowerLimit + keyboardNotes[e.code]].name, false);
				}}
				class:!bg-primary-300={keyDown[note.name]}
				class="border-1 dark:bg-primary-900 h-24 w-24 rounded border-black bg-white text-xs">{note}</button>
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
