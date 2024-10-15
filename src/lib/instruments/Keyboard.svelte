<script lang="ts">
	import { handleMouseDown, handleMouseEnter, handleMouseLeave, handleMouseUp, handleTouchEnd, handleTouchMove, handleTouchStart } from "$lib/helpers";
	import { getMidiNotes, noteValueOffset } from "$lib/midinotes";
	import { Soundfont, getSoundfontNames, ElectricPiano, getElectricPianoNames } from "smplr";
	import { SoundFont2 } from "soundfont2";

	let { instrumentType, library } = $props();

	$effect(() => {
		queueMicrotask(() => {
			const minimumNoteElement = document.getElementById(getMidiNotes()[minimumNoteValue].name);
			if (minimumNoteElement) {
				minimumNoteElement.focus();
			}
		});
	});

	function setKeyDown(key: string, bool: boolean) {
		keyDown[key] = bool;
	}

	function isMobileDevice() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	const context = new AudioContext();

	let octave = $state("4");
	let minimumNoteValue = $derived(parseInt(octave) * 12);
	let maximumNoteValue = $derived(isMobileDevice() ? parseInt(octave) * 12 + 24 : parseInt(octave) * 12 + 48);
	let mouseDown = $state(false);
	let keyDown: { [key: string]: boolean } = $state({});
	let touching = $state(false);
	let velocity = $state(80);
	let instrumentList = initializeInstrumentList();
	let instrument = $state(initializeStartingInstrument());
	let instrumentValue = $state(instrumentList.indexOf(instrument));
	let displayInstrument = $derived(instrumentList[instrumentValue]);
	let lastKey = $state();

	// TODO use sf2 instead later
	// const channel = $derived(new Soundfont2Sampler(context, {
	//   url: `/sf2/musyng/0${paddedInstrumentValue}.sf2`,
	//   createSoundfont: (data) => new SoundFont2(data),
	// }))
	// $effect(()=> {

	//   channel.load.then(() => {
	//     // list all available instruments for the soundfont
	//     console.log(channel.instrumentNames);

	//     // load the first available instrument
	//     channel.loadInstrument(channel.instrumentNames[0]);

	//   });
	// })
	// onchange={() => {
	//   console.log(channel.instrumentNames);
	//   if (channel.instrumentNames[0]) {
	//     channel.loadInstrument(channel.instrumentNames[0]);
	//     instrument = channel.instrumentNames[0];
	//     displayInstrument = channel.instrumentNames[0];
	//   }
	function initializeStartingInstrument() {
		if (instrumentType === "keyboard" && library === "smplr") {
			return "marimba";
		}
		if (instrumentType === "electricpiano" && library === "smplr") {
			return "CP80";
		}
		return "starting instrument not initialized";
	}

	function initializeInstrumentList() {
		if (instrumentType === "keyboard" && library === "smplr") {
			return getSoundfontNames();
		}
		if (instrumentType === "electricpiano" && library === "smplr") {
			return getElectricPianoNames();
		}
		return [];
	}

	// initialize instrument type
	function initializeInstrumentType() {
		if (instrumentType === "keyboard" && library === "smplr") {
			return new Soundfont(context, {
				instrument,
				volume: 80,
				// loadLoopData: true
			});
		}
		if (instrumentType === "electricpiano" && library === "smplr") {
			return new ElectricPiano(context, {
				instrument: "WurlitzerEP200",
				volume: 60,
			});
		} else {
			// default
			return new Soundfont(context, {
				instrument,
				volume: 80,
				// loadLoopData: true
			});
		}
	}
	let channel = $state(initializeInstrumentType());
</script>

<p class="absolute left-[50vw] top-8 w-min text-center text-xl dark:text-white lg:left-0">{displayInstrument}</p>
<div class="flex">
	<select class="mr-2 mt-4 px-2" aria-label="octave picker select" bind:value={octave} name="" id="">
		<option value="1">1</option>
		<option value="2">2</option>
		<option value="3">3</option>
		<option value="4">4</option>
		<option value="5">5</option>
		<option value="6">6</option>
		<option value="7">7</option>
	</select>
	<input
		aria-label="instrument picker slider"
		type="range"
		name=""
		id=""
		class="mt-4 w-[calc(100vw-100px)]"
		min="0"
		max="127"
		bind:value={instrumentValue}
		onchange={() => {
			instrument = instrumentList[instrumentValue];
			channel = initializeInstrumentType();
			console.log(instrument);
			// console.log(instrument);
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
					ontouchstart={(e) => ([touching, keyDown[note.name], lastKey] = handleTouchStart({ channel, note, e }))}
					ontouchend={() => ([touching, keyDown[note.name]] = handleTouchEnd({ channel, note }))}
					onmousedown={(e) => (!touching ? ([mouseDown, keyDown[note.name], velocity] = handleMouseDown({ channel, note, e, velocity })) : null)}
					onmouseup={() => (!touching ? ([mouseDown, keyDown[note.name]] = handleMouseUp({ channel, note })) : null)}
					onmouseenter={(e) => (!touching ? ([keyDown[note.name]] = handleMouseEnter({ velocity, mouseDown, channel, note, e })) : null)}
					onmouseleave={() => (!touching ? ([keyDown[note.name]] = handleMouseLeave({ channel, note })) : null)}
					onkeydown={(e) => {
						console.log(e);
						// TODO add support for raising/lowering octave with shift and ctrl
						if (/^(Space|AltLeft|ShiftLeft|ControlLeft)$/.test(e.code)) return;
						const pressedKeyName = getMidiNotes()[minimumNoteValue + noteValueOffset[e.code]].name;
						const pressedKeyValue = getMidiNotes()[minimumNoteValue + noteValueOffset[e.code]].value;
						if (!keyDown[pressedKeyName])
							channel.start({
								note: pressedKeyValue,
								velocity,
							});
						setKeyDown(pressedKeyName, true);
					}}
					onkeyup={(e) => {
						if (/^(Space|AltLeft|ShiftLeft|ControlLeft)$/.test(e.code)) return;
						const pressedKeyName = getMidiNotes()[minimumNoteValue + noteValueOffset[e.code]].name;
						const pressedKeyValue = getMidiNotes()[minimumNoteValue + noteValueOffset[e.code]].value;
						channel.stop(pressedKeyValue);
						console.log("aaa");
						setKeyDown(pressedKeyName, false);
					}}
					class:black={note.name.includes("#")}
					class:black-left={note.name.match(/C#|F#/)}
					class:black-right={note.name.match(/D#|A#/)}
					class:black-middle={note.name.includes("G#")}
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
							<span class="bg-primary-800/20 dark:bg-primary-950 absolute bottom-1 left-0 h-3 w-full rounded-md rounded-t-none"></span>
							{#if keyDown[note.name] && !document.documentElement.classList.contains("dark")}
								<!-- ??? -->
								<span class="neon-drop-shadow absolute -top-0 h-px"></span>
								<span class="neon-drop-shadow2 absolute -bottom-1 h-px"></span>
							{:else if keyDown[note.name] && document.documentElement.classList.contains("dark")}
								<span class="neon-drop-shadow-dark absolute -top-0 h-px"></span>
								<span class="neon-drop-shadow2-dark absolute -bottom-1 h-px"></span>
							{/if}
						</span>
					{:else}
						<span class="pointer-events-none relative left-0 top-0 top-1 block h-40 w-7">
							{#if keyDown[note.name] && !document.documentElement.classList.contains("dark")}
								<!-- ??? -->
								<span class="neon-drop-shadow absolute -top-0 h-px"></span>
								<span class="neon-drop-shadow2 absolute -bottom-1 h-px"></span>
							{:else if keyDown[note.name] && document.documentElement.classList.contains("dark")}
								<span class="neon-drop-shadow-dark absolute -top-0 h-px"></span>
								<span class="neon-drop-shadow2-dark absolute -bottom-1 h-px"></span>
							{/if}
						</span>
					{/if}
				</button>
			{/if}
		{/each}
	{/key}
</div>

<style>
	.black-left {
		@apply absolute h-40 w-7 -translate-x-[1.25rem] bg-black shadow-none outline-0;
	}
	.black-right {
		@apply absolute h-40 w-7 -translate-x-[0.55rem] bg-black shadow-none outline-0;
	}
	.black-middle {
		@apply absolute h-40 w-7 -translate-x-[0.9rem] bg-black shadow-none outline-0;
	}

	#keyboard button {
		-webkit-tap-highlight-color: transparent;
	}
	.fancy-shadow {
		box-shadow:
			rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
			rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
			rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset,
			rgba(0, 0, 0, 0.06) 0px 2px 1px,
			rgba(0, 0, 0, 0.09) 0px 4px 2px,
			rgba(0, 0, 0, 0.09) 0px 8px 4px,
			rgba(0, 0, 0, 0.09) 0px 16px 8px,
			rgba(0, 0, 0, 0.09) 0px 32px 16px;
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
