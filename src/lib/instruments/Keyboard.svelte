<script lang="ts">
	import { handleMouseDown, handleMouseEnter, handleMouseLeave, handleMouseUp, handleTouchEnd, handleTouchMove, handleTouchStart } from "$lib/helpers";
	import { getMidiNotes, noteValueOffset, getDrumNotes } from "$lib/midinotes";
	import type { InstrumentType, Note, ValidInstruments } from "$lib/types";
	import { Soundfont, getSoundfontNames, ElectricPiano, getElectricPianoNames, DrumMachine, getDrumMachineNames, SplendidGrandPiano, Mellotron, getMellotronNames } from "smplr";
	import { SoundFont2 } from "soundfont2";
	import { Synthetizer } from "spessasynth_lib";

	let { instrumentType, library }: { instrumentType: string; library: string } = $props();

	// give focus to keyboard at start to directly enable keyboard input
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
	// lastKey used for touchmove later
	let lastKey = $state();

	let instrument = $state(initializeStartingInstrument());
	let instrumentList = $state(initializeInstrumentList());
	let instrumentValue = $state(instrumentList.indexOf(instrument));
	let displayInstrument = $derived(instrumentList[instrumentValue]);
	let channel = $state(initializeInstrumentType());
	let notes = $state(initializeInstrumentNotes());

	// drums use channel for notes but notes declaration can run before the channel is fully loaded, so update after loading is complete
	// above declaration makes typescript happy
	if (library === "smplr") {
		if (channel) {
			channel.load.then(() => {
				notes = initializeInstrumentNotes();
			});
		}
	}

	// if (!notes[0].value) {
	// 	setTimeout(() => {
	// 		notes = initializeInstrumentNotes();
	// 	}, 1000);
	// }

	// $inspect(instrument, instrumentList, instrumentValue, displayInstrument, channel, notes);

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

	// TODO maybe this style is better?
	// function getInstrumentNotes(instrumentType: string) {
	// 	const instrumentNotes = {
	// 		keyboard: getMidiNotes(),

	// 		electricpiano: getMidiNotes(),

	// 		mellotron: getMidiNotes(),

	// 		drums: getDrumNotes(channel),
	// 	};
	// 	return instrumentNotes[instrumentType];
	// }

	function initializeStartingInstrument() {
		if (instrumentType === "keyboard" && library === "smplr") {
			return "marimba";
		}
		if (instrumentType === "electricpiano" && library === "smplr") {
			return "CP80";
		}
		if (instrumentType === "mellotron" && library === "smplr") {
			return "300 STRINGS CELLO";
		}
		if (instrumentType === "drums" && library === "smplr") {
			return "TR-808";
		}
		if (instrumentType === "soundfont" && library === "spessasynth") {
			return "marimba";
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
		if (instrumentType === "mellotron" && library === "smplr") {
			return getMellotronNames();
		}
		if (instrumentType === "drums" && library === "smplr") {
			return getDrumMachineNames();
		}
		if (instrumentType === "soundfont" && library === "spessasynth") {
			return getSoundfontNames();
		}
		return [];
	}

	function initializeInstrumentNotes() {
		if (instrumentType === "keyboard" && library === "smplr") {
			return getMidiNotes();
		}
		if (instrumentType === "electricpiano" && library === "smplr") {
			return getMidiNotes();
		}
		if (instrumentType === "mellotron" && library === "smplr") {
			return getMidiNotes();
		}
		if (instrumentType === "piano" && library === "smplr") {
			return getMidiNotes();
		}
		if (instrumentType === "drums" && library === "smplr") {
			return getDrumNotes(channel as DrumMachine);
		}
		if (instrumentType === "soundfont" && library === "spessasynth") {
			return getMidiNotes();
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
				instrument,
				volume: 60,
			});
		}
		if (instrumentType === "mellotron" && library === "smplr") {
			return new Mellotron(context, {
				instrument,
				volume: 60,
			});
		}
		if (instrumentType === "piano" && library === "smplr") {
			return new SplendidGrandPiano(context, {
				volume: 60,
			});
		}
		if (instrumentType === "drums" && library === "smplr") {
			return new DrumMachine(context, {
				instrument,
				volume: 60,
			});
		}
		if (instrumentType === "soundfont" && library === "spessasynth") {
			context.audioWorklet.addModule("/worklet_processor.min.js").then(() => {
				fetch(`/sf2/musyng/0${instrumentValue.toString().padStart(2, "0")}.sf2`).then(async (response) => {
					console.log(instrumentValue);
					console.log(response);
					// document.getElementById("midi_input").addEventListener("change", async event => {
					// check if any files are added
					// if (!event.target.files[0]) {
					//  return;
					// }
					// const midiFile = await(event.target.files[0].arrayBuffer()); // get the file and conver to ArrayBuffer
					// }
					let soundFontArrayBuffer = await response.arrayBuffer();
					notes = initializeInstrumentNotes();
					// channel = new Synthetizer(context.destination, soundFontArrayBuffer); // create the synthetizer
					return new Synthetizer(context.destination, soundFontArrayBuffer);

					// const seq = new Sequencer([{binary: midiFile}], synth); // create the sequencer
				});
			});
		}
		// default
	}
</script>

<p class="absolute left-[50vw] top-14 text-center text-xl dark:text-white lg:left-0">{displayInstrument}</p>
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
			if (library === "smplr") {
				instrument = instrumentList[instrumentValue];
				channel = initializeInstrumentType();
				if (channel) {
					channel.load.then(() => {
						notes = initializeInstrumentNotes();
					});
				}
			} else {
				channel = initializeInstrumentType();
			}
			console.log(instrument);
			// console.log(instrument);
		}} />
</div>
<div id="keyboard" class="!m-px portrait:hidden">
	{#key octave}
		{#each notes as note, i}
			{#if i >= minimumNoteValue && i <= maximumNoteValue && channel}
				<!-- TODO fix touch move event, need support for multiple touch and move somehow + fix displayed note -->
				<!-- on:touchmove={(e) => ([keyDown[currentKey], lastKey] = handleTouchMove({ touching, velocity, mouseDown, channel, note, e, lastKey }))} -->
				<button
					id={note.name}
					ontouchstart={(e) => {
						context.resume();
						if (channel) [touching, keyDown[note.name], lastKey] = handleTouchStart({ channel, note, e });
					}}
					ontouchend={() => {
						if (channel) [touching, keyDown[note.name]] = handleTouchEnd({ channel, note });
					}}
					onmousedown={(e) => {
						context.resume();
						if (!touching && channel) [mouseDown, keyDown[note.name], velocity] = handleMouseDown({ channel, note, e, velocity });
					}}
					onmouseup={() => {
						if (!touching && channel) [mouseDown, keyDown[note.name]] = handleMouseUp({ channel, note });
					}}
					onmouseenter={(e) => {
						if (!touching && channel) [keyDown[note.name]] = handleMouseEnter({ velocity, mouseDown, channel, note, e });
					}}
					onmouseleave={() => {
						if (!touching && channel) [keyDown[note.name]] = handleMouseLeave({ channel, note });
					}}
					onkeydown={(e) => {
						console.log(e);
						context.resume();
						// TODO add support for raising/lowering octave with shift and ctrl
						if (/^(Space|AltLeft|ShiftLeft|ControlLeft)$/.test(e.code)) return;
						const pressedKeyName = notes[minimumNoteValue + noteValueOffset[e.code]].name;
						const pressedKeyValue = notes[minimumNoteValue + noteValueOffset[e.code]].value;
						if (!keyDown[pressedKeyName] && channel) {
							if (channel instanceof Synthetizer) {
								channel.noteOn(0, pressedKeyValue as number, velocity);
							} else {
								channel.start({
									note: pressedKeyValue,
									velocity,
								});
							}
						}
						setKeyDown(pressedKeyName, true);
					}}
					onkeyup={(e) => {
						if (/^(Space|AltLeft|ShiftLeft|ControlLeft)$/.test(e.code)) return;
						const pressedKeyName = notes[minimumNoteValue + noteValueOffset[e.code]].name;
						const pressedKeyValue = notes[minimumNoteValue + noteValueOffset[e.code]].value;
						if (channel && !(channel instanceof DrumMachine) && !(channel instanceof Synthetizer)) {
							channel.stop(pressedKeyValue);
						} else if (channel instanceof Synthetizer) {
							channel.noteOff(0, pressedKeyValue as number);
						}
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
