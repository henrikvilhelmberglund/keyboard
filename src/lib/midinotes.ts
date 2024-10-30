import type { DrumMachine } from "smplr";

export function getMidiNotes() {
	const midiNotes = [];

	const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

	for (let midiValue = 0; midiValue <= 127; midiValue++) {
		const octave = Math.floor(midiValue / 12) - 1;
		const noteName = noteNames[midiValue % 12] + octave;

		midiNotes.push({
			name: noteName,
			value: midiValue,
		});
	}

	return midiNotes;
}

export const noteValueOffset: Record<string, number> = {
	// row1
	KeyZ: 0,
	KeyS: 1,
	KeyX: 2,
	KeyD: 3,
	KeyC: 4,
	KeyV: 5,
	KeyG: 6,
	KeyB: 7,
	KeyH: 8,
	KeyN: 9,
	KeyJ: 10,
	KeyM: 11,
	Comma: 12,
	KeyL: 13,
	Period: 14,
	Semicolon: 15,
	Slash: 16,

	// row3
	Digit1: 10,
	KeyQ: 11,
	KeyW: 12,
	Digit3: 13,
	KeyE: 14,
	Digit4: 15,
	KeyR: 16,
	KeyT: 17,
	Digit6: 18,
	KeyY: 19,
	Digit7: 20,
	KeyU: 21,
	Digit8: 22,
	KeyI: 23,
	KeyO: 24,
	Digit0: 25,
	KeyP: 26,
	Minus: 27,
	BracketLeft: 28,
	BracketRight: 29,
};

export function getDrumNotes(channel: DrumMachine) {
	
  // TODO variation samples
  
	let drumSamples = channel.sampleNames;

	const midiNotes = [];
	const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

	for (let midiValue = 0; midiValue <= 127; midiValue++) {
		const octave = Math.floor(midiValue / 12) - 1;
		const noteName = noteNames[midiValue % 12] + octave;
    const noteValue = drumSamples[midiValue] ? drumSamples[midiValue] : drumSamples[midiValue % drumSamples.length];

		midiNotes.push({
			name: noteName,
			value: noteValue,
		});
	}

  console.log(midiNotes)
	return midiNotes;
}
