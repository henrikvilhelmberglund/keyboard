<script>
	import { handleMouseDown, handleMouseEnter, handleMouseLeave, handleMouseUp, handleTouchEnd, handleTouchStart } from "$lib/helpers";
	import { getMidiNotes, noteValueOffset } from "$lib/midinotes";
	import { Mellotron, getMellotronNames, CacheStorage } from "smplr";

	// import { WebMidi } from "../../node_modules/webmidi/dist/esm/webmidi.esm.min.js";
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
		document.getElementById(getMidiNotes()[minimumNoteValue].name).focus();
	});

	function setKeyDown(key, bool) {
		keyDown[key] = bool;
	}

	function isMobileDevice() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	let octave = "3";
	$: minimumNoteValue = parseInt(octave) * 12;
	$: maximumNoteValue = isMobileDevice() ? parseInt(octave) * 12 + 24 : parseInt(octave) * 12 + 36;
	let output;
	// let channel;
	let mouseDown = false;
	let keyDown = {};
	let touching = false;
	let velocity;
	// let instrument = "marimba";
	// let displayInstrument = instrument;
	// let instrumentValue = getSoundfontNames()[instrument];

	const storage = new CacheStorage();

	const instruments = getMellotronNames();

	const channel = new Mellotron(new AudioContext(), { storage, volume: 50, instrument: instruments[0] });
</script>

<p class="absolute left-0 right-0 w-min dark:text-white">Piano</p>
<div class="flex">
	<select class="mr-2 px-2" aria-label="octave picker select" bind:value={octave} name="" id="">
		<option value="1">1</option>
		<option value="2">2</option>
		<option value="3">3</option>
		<option value="4">4</option>
		<option value="5">5</option>
		<option value="6">6</option>
		<option value="7">7</option>
	</select>
</div>
<div id="keyboard" class="!m-px">
	{#key octave}
		{#each getMidiNotes() as note, i}
			{#if i >= minimumNoteValue && i <= maximumNoteValue}
				<button
					id={note.name}
					on:touchstart={(e) => ([touching, keyDown[note.name]] = handleTouchStart({ channel, note, e }))}
					on:touchend={() => ([touching, keyDown[note.name]] = handleTouchEnd({ channel, note }))}
					on:mousedown={(e) => ([mouseDown, keyDown[note.name], velocity] = handleMouseDown({ touching, channel, note, e, velocity }))}
					on:mouseup={() => ([mouseDown, keyDown[note.name]] = handleMouseUp({ touching, channel, note }))}
					on:mouseenter={(e) => ([keyDown[note.name]] = handleMouseEnter({ touching, velocity, mouseDown, channel, note, e }))}
					on:mouseleave={() => ([keyDown[note.name]] = handleMouseLeave({ touching, mouseDown, channel, note }))}
					on:keydown={(e) => {
						console.log(e);
						// TODO fix this nightmare
						if (!keyDown[getMidiNotes()[minimumNoteValue + noteValueOffset[e.code]].name])
							channel.start({
								note: getMidiNotes()[minimumNoteValue + noteValueOffset[e.code]].value,
								velocity,
							});
						setKeyDown(getMidiNotes()[minimumNoteValue + noteValueOffset[e.code]].name, true);
					}}
					on:keyup={(e) => {
						channel.stop(getMidiNotes()[minimumNoteValue + noteValueOffset[e.code]].value);
						setKeyDown(getMidiNotes()[minimumNoteValue + noteValueOffset[e.code]].name, false);
					}}
					class:black={note.name.includes("#")}
					class:!outline-primary-700={keyDown[note.name]}
					class:!dark:outline-primary-950={keyDown[note.name]}
					class:!outline-1={keyDown[note.name]}
					class:!from-primary-400={keyDown[note.name]}
					class:!dark:to-primary-900={keyDown[note.name]}
					class:!dark:from-primary-400={keyDown[note.name]}
					class:!to-primary-100={keyDown[note.name]}
					class:!bg-primary-300={keyDown[note.name]}
					class:!dark:bg-primary-600={keyDown[note.name]}
					class="dark:bg-primary-900 dark:outline-primary-500/40 outline-primary-950/40 outline-solid shadow-primary-600/30 z-10 mx-0 h-64 w-12 rounded-md rounded-t-none bg-white bg-gradient-to-b shadow-md outline-1">
					{#if !note.name.includes("#")}
						<span class="z-1 pointer-events-none relative left-0 top-0 top-1 block h-64 w-12">
							<span class="bg-primary-800/20 dark:bg-primary-950 absolute bottom-1 left-0 h-3 w-full rounded-md rounded-t-none" />
						</span>
					{/if}
				</button>
			{/if}
		{/each}
	{/key}
</div>

<style>
	.black {
		@apply absolute h-40 w-7 -translate-x-4 bg-black shadow-none outline-0;
	}
	#keyboard button {
		-webkit-tap-highlight-color: transparent;
	}
	.fancy-shadow {
		box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset,
			rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
	}
</style>
