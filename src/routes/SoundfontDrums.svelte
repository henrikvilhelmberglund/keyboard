<script>
	import { handleMouseDown, handleMouseEnter, handleMouseLeave, handleMouseLeaveDrums, handleMouseUp, handleMouseUpDrums, handleTouchEnd, handleTouchEndDrums, handleTouchMove, handleTouchStart } from "$lib/helpers";
	import { getMidiNotes, noteValueOffset } from "$lib/midinotes";
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
		if (!isMobileDevice()) return;
		document.getElementById(getMidiNotes()[minimumNoteValue].name).focus();
	});

	function setKeyDown(key, bool) {
		keyDown[key] = bool;
	}

	function isMobileDevice() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	let octave = "4";
	$: minimumNoteValue = parseInt(octave) * 12;
	$: maximumNoteValue = isMobileDevice() ? parseInt(octave) * 12 + 24 : parseInt(octave) * 12 + 36;
	let output;
	// let channel;
	let mouseDown = false;
	let keyDown = {};
	let touching = false;
	let velocity;
	let instrument = "marimba";
	let displayInstrument = instrument;
	let lastKey;
	let currentKey;
	let instrumentValue = getSoundfontNames()[instrument];
	const context = new AudioContext();
	const channel = new Soundfont(context, {
    instrumentUrl:
    "https://henrikvilhelmberglund.com/midi-js-compat-soundfonts/GM-soundfonts/FluidR3_GM/drumkits/Standard/mp3/sounds.js",
		volume: 80,
		// loadLoopData: true
	});
</script>

<p class="absolute left-[50vw] top-8 w-min text-center text-xl dark:text-white lg:left-0">{displayInstrument}</p>
<div class="flex">
	<select class="mr-2 mt-4 px-2" bind:value={octave} name="" id="">
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
		class="mt-4 w-[calc(100vw-100px)]"
		min="0"
		max="127"
		bind:value={instrumentValue}
		on:input={() => (displayInstrument = getSoundfontNames()[instrumentValue])}
		on:change={() => {
			instrument = getSoundfontNames()[instrumentValue];
			console.log(instrument);
		}} />
</div>
<div id="keyboard" class="!m-px portrait:hidden">
	{#key octave}
		{#each getMidiNotes() as note, i}
			{#if i >= minimumNoteValue && i <= maximumNoteValue}
				<!-- TODO fix touch move event, need support for multiple touch and move somehow + fix displayed note -->
				<!-- on:touchmove={(e) => ([keyDown[currentKey], lastKey] = handleTouchMove({ touching, velocity, mouseDown, channel, note, e, lastKey }))} -->
				<button
					id={note.name}
					on:touchstart={(e) => ([touching, keyDown[note.name], lastKey] = handleTouchStart({ channel, note, e }))}
					on:touchend={() => ([touching, keyDown[note.name]] = handleTouchEndDrums({ channel, note }))}
					on:mousedown={(e) => ([mouseDown, keyDown[note.name], velocity] = handleMouseDown({ touching, channel, note, e, velocity }))}
					on:mouseup={() => ([mouseDown, keyDown[note.name]] = handleMouseUpDrums({ touching, channel, note }))}
					on:mouseenter={(e) => ([keyDown[note.name]] = handleMouseEnter({ touching, velocity, mouseDown, channel, note, e }))}
					on:mouseleave={() => ([keyDown[note.name]] = handleMouseLeaveDrums({ touching, mouseDown, channel, note }))}
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
						// channel.stop(getMidiNotes()[minimumNoteValue + noteValueOffset[e.code]].value);
						console.log("aaa");
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
					class="dark:bg-primary-900 dark:outline-primary-500/40 z-100 outline-primary-950/40 outline-solid shadow-primary-600/30 z-10 mx-0 h-64 w-12 rounded-md rounded-t-none bg-white bg-gradient-to-b shadow-md outline-1">
					{#if !note.name.includes("#")}
						<span class="pointer-events-none relative left-0 top-0 top-1 block h-64 w-12">
							<span class="bg-primary-800/20 dark:bg-primary-950 absolute bottom-1 left-0 h-3 w-full rounded-md rounded-t-none" />
							{#if keyDown[note.name] && !document.documentElement.classList.contains("dark")}
								<!-- ??? -->
								<span class="neon-drop-shadow absolute -top-0 h-px" />
								<span class="neon-drop-shadow2 absolute -bottom-1 h-px" />
							{:else if keyDown[note.name] && document.documentElement.classList.contains("dark")}
								<span class="neon-drop-shadow-dark absolute -top-0 h-px" />
								<span class="neon-drop-shadow2-dark absolute -bottom-1 h-px" />
							{/if}
						</span>
					{:else}
						<span class="pointer-events-none relative left-0 top-0 top-1 block h-40 w-7">
							{#if keyDown[note.name] && !document.documentElement.classList.contains("dark")}
								<!-- ??? -->
								<span class="neon-drop-shadow absolute -top-0 h-px" />
								<span class="neon-drop-shadow2 absolute -bottom-1 h-px" />
							{:else if keyDown[note.name] && document.documentElement.classList.contains("dark")}
								<span class="neon-drop-shadow-dark absolute -top-0 h-px" />
								<span class="neon-drop-shadow2-dark absolute -bottom-1 h-px" />
							{/if}
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

	/* TODO turn into unocss shortcuts with regex */
	/* TODO make it look good */
	.neon-drop-shadow {
		box-shadow: 0 0 50px 20px rgb(var(--un-preset-theme-colors-primary-300)); /* Neon green color with a large spread radius */
	}
	.neon-drop-shadow-dark {
		box-shadow: 0 0 50px 20px rgb(var(--un-preset-theme-colors-primary-800)); /* Neon green color with a large spread radius */
	}
	.neon-drop-shadow2 {
		box-shadow: 0 0 50px 20px rgb(var(--un-preset-theme-colors-primary-300)); /* Neon green color with a large spread radius */
	}
	.neon-drop-shadow2-dark {
		box-shadow: 0 0 50px 20px rgb(var(--un-preset-theme-colors-primary-900)); /* Neon green color with a large spread radius */
	}
</style>
