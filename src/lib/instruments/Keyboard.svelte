<script lang="ts">
	import { absorbEvent, handleMouseDown, handleMouseEnter, handleMouseLeave, handleMouseUp, handleTouchEnd, handleTouchMove, handleTouchStart } from "$lib/helpers";
	import { getMidiNotes, noteValueOffset, getDrumNotes } from "$lib/midinotes";
	import { soundfontNames } from "$lib/soundfontInstrumentNames/musyng/musyng";
	import type { InstrumentType, Note, ValidInstruments } from "$lib/types";
	import { Soundfont, getSoundfontNames, ElectricPiano, getElectricPianoNames, DrumMachine, getDrumMachineNames, SplendidGrandPiano, Mellotron, getMellotronNames } from "smplr";
	import { Synthetizer } from "spessasynth_lib";
	import { SvelteMap } from "svelte/reactivity";

	let { instrumentType, library, startingOctave }: { instrumentType: string; library: string; startingOctave: string } = $props();

	const DEV = false;

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

	let octave = $state(startingOctave ? startingOctave : "4");
	let size = $state("100");
	let minimumNoteValue = $derived(parseInt(octave) * 12);
	let maximumNoteValue = $derived(isMobileDevice() ? parseInt(octave) * 12 + (size === "100" ? 24 : size === "150" ? 16 : size === "200" ? 12 : 24) : parseInt(octave) * 12 + (size === "100" ? 48 : size === "150" ? 36 : size === "200" ? 24 : 48));
	let mouseDown = $state(false);
	let keyDown: { [key: string]: boolean } = $state({});
	let touching = $state(false);
	let velocity = $state(80);
	// lastKey used for touchmove later
	let lastKey = $state();
	let workletLoaded = $state(false);

	let instrument = $state(initializeStartingInstrument());
	let instrumentList = $state(initializeInstrumentList());
	let instrumentValue = $state(instrumentList.indexOf(initializeStartingInstrument()));
	let displayInstrument = $derived(instrumentList[instrumentValue]);
	let channel = $state(initializeInstrumentType());
	let notes = $state(initializeInstrumentNotes());
	let touchingNotes = new SvelteMap();
	let touchingNotesStart = new SvelteMap();

	// drums use channel for notes but notes declaration can run before the channel is fully loaded, so update after loading is complete
	$effect(() => {
		if (library === "smplr") {
			if (channel && !(channel instanceof Synthetizer)) {
				channel.load.then(() => {
					notes = initializeInstrumentNotes();
				});
			}
		}
	});

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
    if (instrumentType === "soundfont-drums" && library === "smplr") {
			return "a";
		}
		if (instrumentType === "soundfont" && library === "spessasynth") {
			return "Marimba";
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
		if (instrumentType === "soundfont-drums" && library === "smplr") {
			return getSoundfontNames();
		}
		if (instrumentType === "soundfont" && library === "spessasynth") {
			return soundfontNames;
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
    if (instrumentType === "soundfont-drums" && library === "smplr") {
			return getMidiNotes();
		}
		if (instrumentType === "soundfont" && library === "spessasynth") {
			return getMidiNotes();
		}
		return [];
	}

	// initialize instrument type
	function initializeInstrumentType(): ValidInstruments | undefined {
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
    if (instrumentType === "soundfont-drums" && library === "smplr") {
			return new Soundfont(context, {
				instrumentUrl: "https://henrikvilhelmberglund.com/midi-js-compat-soundfonts/GM-soundfonts/FluidR3_GM/drumkits/Standard-mp3.js",
				volume: 80,
				// loadLoopData: true
			});
		}
		if (instrumentType === "soundfont" && library === "spessasynth") {
			if (!workletLoaded) {
				context.audioWorklet.addModule("/worklet_processor.min.js").then(() => {
					workletLoaded = true;
					fetch(
						DEV
							? `/sf2/musyng/0${instrumentValue.toString().padStart(2, "0")}.sf2`
							: `https://henrikvilhelmberglund.com/split-sf2/musyng/0${instrumentValue.toString().padStart(2, "0")}.sf2`
					).then(async (response) => {
						// document.getElementById("midi_input").addEventListener("change", async event => {
						// check if any files are added
						// if (!event.target.files[0]) {
						//  return;
						// }
						// const midiFile = await(event.target.files[0].arrayBuffer()); // get the file and conver to ArrayBuffer
						// }
						let soundFontArrayBuffer = await response.arrayBuffer();
						notes = initializeInstrumentNotes();
						channel = new Synthetizer(context.destination, soundFontArrayBuffer); // create the synthetizer
						return new Synthetizer(context.destination, soundFontArrayBuffer);

						// const seq = new Sequencer([{binary: midiFile}], synth); // create the sequencer
					});
				});
			} else {
				fetch(
					DEV
						? `/sf2/musyng/0${instrumentValue.toString().padStart(2, "0")}.sf2`
						: `https://henrikvilhelmberglund.com/split-sf2/musyng/0${instrumentValue.toString().padStart(2, "0")}.sf2`
				).then(async (response) => {
					// document.getElementById("midi_input").addEventListener("change", async event => {
					// check if any files are added
					// if (!event.target.files[0]) {
					//  return;
					// }
					// const midiFile = await(event.target.files[0].arrayBuffer()); // get the file and conver to ArrayBuffer
					// }
					let soundFontArrayBuffer = await response.arrayBuffer();
					notes = initializeInstrumentNotes();
					channel = new Synthetizer(context.destination, soundFontArrayBuffer); // create the synthetizer
					return new Synthetizer(context.destination, soundFontArrayBuffer);

					// const seq = new Sequencer([{binary: midiFile}], synth); // create the sequencer
				});
			}
		}
		// default
	}

	function changeSoundFont() {
		fetch(
			DEV
				? `/sf2/musyng/0${instrumentValue.toString().padStart(2, "0")}.sf2`
				: `https://henrikvilhelmberglund.com/split-sf2/musyng/0${instrumentValue.toString().padStart(2, "0")}.sf2`
		).then(async (response) => {
			let soundFontArrayBuffer = await response.arrayBuffer();
			notes = initializeInstrumentNotes();
			await (<Synthetizer>channel).soundfontManager.reloadManager(soundFontArrayBuffer);
		});
	}

	function actionTouchStart(node: HTMLButtonElement) {
		node.addEventListener("touchstart", absorbEvent);

		return {
			destroy() {
				node.removeEventListener("touchstart", absorbEvent);
			},
		};
	}
</script>

<p class="absolute left-[50vw] lg:translate-x-0 translate-x-[-50%] lg:top-14 -top-4 text-center text-xl dark:text-white lg:left-0">{displayInstrument}</p>
<select class="mr-2 mt-1 px-1 left-0 absolute" aria-label="size select" bind:value={size} name="" id="">
	<option value="100">100%</option>
	<option value="150">150%</option>
	<option value="200">200%</option>
</select>
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
				if (channel && !(channel instanceof Synthetizer)) {
					channel.load.then(() => {
						notes = initializeInstrumentNotes();
					});
				}
			} else {
				changeSoundFont();
			}
			// console.log(instrument);
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
					use:actionTouchStart
					onpointerdown={(e) => {
						context.resume();
						if (e.pointerType === "touch") {
							// touchingNotes.set(note.name, note.name);
							touchingNotesStart.set(note.name, note.name);
							if (channel) [touching, keyDown[note.name], lastKey] = handleTouchStart({ channel, note, e });
						}
						if (e.pointerType === "mouse") {
							if (!touching && channel) [mouseDown, keyDown[note.name], velocity] = handleMouseDown({ channel, note, e, velocity });
						}
					}}
					onpointerenter={(e) => {
						if (e.pointerType === "touch") {
							// if (channel) [touching, keyDown[note.name], lastKey] = handleTouchStart({ channel, note, e });
						}
						if (e.pointerType === "mouse") {
							if (!touching && channel) [keyDown[note.name]] = handleMouseEnter({ velocity, mouseDown, channel, note, e });
						}
					}}
					onpointerup={(e) => {
						if (e.pointerType === "touch") {
							if (channel) [touching, keyDown[note.name]] = handleTouchEnd({ channel, note });
						}
						if (e.pointerType === "mouse") {
							if (!touching && channel) [mouseDown, keyDown[note.name]] = handleMouseUp({ channel, note });
						}
					}}
					onpointerout={(e) => {
						if (e.pointerType === "touch") {
							if (channel) [touching, keyDown[note.name]] = handleTouchEnd({ channel, note });
						}
						if (e.pointerType === "mouse") {
							if (!touching && channel) [keyDown[note.name]] = handleMouseLeave({ channel, note });
						}
					}}
					ontouchmove={(e) => {
						if (!e.touches) return;
						// if (e.touches.length > 1) return;

						context.resume();
						let myLocation = e.touches;

						for (let j = 0; j < myLocation.length; j++) {
							const thisLocation = myLocation[j];

							let myLocationTarget = thisLocation.target as HTMLButtonElement;
							let realTarget = document.elementFromPoint(thisLocation.clientX, thisLocation.clientY);
							let realNote = notes[notes.findIndex((i) => i.name === realTarget?.id)];
							let realNoteSnapshot = $state.snapshot(realNote);
							touchingNotes.set(myLocationTarget.id, realNoteSnapshot.name);
							// touchingNotesStart.set(myLocationTarget.id, myLocationTarget.id);
							// console.log(realNoteSnapshot);
							// console.log("myLocationTarget id", myLocationTarget.id)
							// console.log("realnotesnapshot name", realNoteSnapshot.name)
							// console.log("touchingNotes get",touchingNotes.get(myLocationTarget.id))
							// console.log("touchingNotesStart get",touchingNotesStart.get(myLocationTarget.id))
							// console.log(realTarget)
							if (channel && realNoteSnapshot && touchingNotesStart.get(myLocationTarget.id) !== touchingNotes.get(myLocationTarget.id)) {
								// keyDown[lastKey] = false;
								let lastNote = notes[notes.findIndex((i) => i.name === touchingNotesStart.get(myLocationTarget.id))];
								keyDown[touchingNotesStart.get(myLocationTarget.id) as string] = false;
								[touching, keyDown[note.name]] = handleTouchEnd({ channel, note: lastNote });
								touchingNotesStart.set(myLocationTarget.id, touchingNotes.get(myLocationTarget.id));

								[touching, keyDown[realNoteSnapshot.name], lastKey] = handleTouchStart({ channel, note: realNoteSnapshot, e });
							}
						}
						// if (channel && realNoteSnapshot && realNoteSnapshot.name === lastKey) [touching, keyDown[realNoteSnapshot.name]] = handleTouchEnd({ channel, note });
					}}
					ontouchend={(e) => {
						// console.log(e);
						let myLocation = e.changedTouches[0];
						let realTarget = document.elementFromPoint(myLocation.clientX, myLocation.clientY);
						let realNote = notes[notes.findIndex((i) => i.name === realTarget?.id)];
						if (!realNote && channel) {
							// hack for edge keys
							keyDown[getMidiNotes()[minimumNoteValue].name] = false;
							keyDown[getMidiNotes()[maximumNoteValue].name] = false;
							handleTouchEnd({ channel, note: { name: "N/A", value: minimumNoteValue } });
							handleTouchEnd({ channel, note: { name: "N/A", value: maximumNoteValue } });
						}
						let realNoteSnapshot = $state.snapshot(realNote);
						keyDown[realNoteSnapshot.name] = false;
						if (channel) {
							[touching, keyDown[note.name]] = handleTouchEnd({ channel, note: realNoteSnapshot });
						}
					}}
					onmousedown={(e) => {}}
					onmouseup={() => {}}
					onmouseenter={(e) => {}}
					onmouseleave={() => {}}
					onkeydown={(e) => {
						// console.log(e);
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
					class:-translate-x-[1.25rem]={note.name.match(/C#|F#/) && size === "100"}
					class:-translate-x-[1.85rem]={note.name.match(/C#|F#/) && size === "150"}
					class:-translate-x-[2.45rem]={note.name.match(/C#|F#/) && size === "200"}
					class:black-right={note.name.match(/D#|A#/)}
					class:-translate-x-[0.55rem]={note.name.match(/D#|A#/) && size === "100"}
					class:-translate-x-[0.95rem]={note.name.match(/D#|A#/) && size === "150"}
					class:-translate-x-[1.35rem]={note.name.match(/D#|A#/) && size === "200"}
					class:black-middle={note.name.includes("G#")}
					class:-translate-x-[0.90rem]={note.name.includes("G#") && size === "100"}
					class:-translate-x-[1.351rem]={note.name.includes("G#") && size === "150"}
					class:-translate-x-[1.75rem]={note.name.includes("G#") && size === "200"}
					class:!outline-primary-700={keyDown[note.name]}
					class:!dark:outline-primary-950={keyDown[note.name]}
					class:!outline-1={keyDown[note.name]}
					class:!from-primary-400={keyDown[note.name]}
					class:!dark:to-primary-900={keyDown[note.name]}
					class:!dark:from-primary-400={keyDown[note.name]}
					class:!to-primary-100={keyDown[note.name]}
					class:!bg-primary-300={keyDown[note.name]}
					class:!dark:bg-primary-600={keyDown[note.name]}
					data-TODO="TODO fix this below when new multiple utility class directive is available"
					class:w-12={size === "100" && !note.name.includes("#")}
					class:w-18={size === "150" && !note.name.includes("#")}
					class:w-24={size === "200" && !note.name.includes("#")}
					class:w-7={size === "100" && note.name.includes("#")}
					class:w-10.5={size === "150" && note.name.includes("#")}
					class:w-14={size === "200" && note.name.includes("#")}
					class="dark:bg-primary-900 dark:outline-primary-500/40 z-100 outline-primary-950/40 outline-solid shadow-primary-600/30 z-10 mx-0 h-64 rounded-md rounded-t-none bg-white bg-gradient-to-b shadow-md outline-1">
					{#if !note.name.includes("#")}
						<span class="pointer-events-none relative left-0 top-0 top-1 block h-64 {size === '100' ? 'w-12' : size === '150' ? 'w-18' : size === '200' ? 'w-24' : 'w-7'}">
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
		@apply absolute h-40 bg-black shadow-none outline-0;
	}
	.black-right {
		@apply absolute h-40 bg-black shadow-none outline-0;
	}
	.black-middle {
		@apply absolute h-40 bg-black shadow-none outline-0;
	}

	#keyboard button {
		-webkit-tap-highlight-color: transparent;
	}
	/* .fancy-shadow {
		box-shadow:
			rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
			rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
			rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset,
			rgba(0, 0, 0, 0.06) 0px 2px 1px,
			rgba(0, 0, 0, 0.09) 0px 4px 2px,
			rgba(0, 0, 0, 0.09) 0px 8px 4px,
			rgba(0, 0, 0, 0.09) 0px 16px 8px,
			rgba(0, 0, 0, 0.09) 0px 32px 16px;
	} */

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
