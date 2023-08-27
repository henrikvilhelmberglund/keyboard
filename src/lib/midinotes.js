export function getMidiNotes() {
	const midiNotes = [];

	const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

	for (let midiValue = 0; midiValue <= 127; midiValue++) {
		const octave = Math.floor(midiValue / 12);
		const noteName = noteNames[midiValue % 12] + octave;

		midiNotes.push({
			name: noteName,
			value: midiValue,
		});
	}

	return midiNotes;
}

export const keyboardNotes = {
	// row1
	KeyZ: "C3",
	KeyS: "C#3",
	KeyX: "D3",
	KeyD: "D#3",
	KeyC: "E3",
	KeyV: "F3",
	KeyG: "F#3",
	KeyB: "G3",
	KeyH: "G#3",
	KeyN: "A3",
	KeyJ: "A#3",
	KeyM: "B3",
	Comma: "C4",
	KeyL: "C#4",
	Period: "D4",
	SemiColon: "D#4",
	Slash: "E4",

	// row3
	KeyW: "C4",
	Digit4: "C#4",
	KeyE: "D4",
	Digit4: "D#4",
	KeyR: "E4",
	KeyT: "F4",
	Digit6: "F#4",
	KeyY: "G4",
	Digit7: "G#4",
	KeyU: "A4",
	Digit8: "A#4",
	KeyI: "B4",
	KeyO: "C4",
	Digit0: "C#4",
	KeyP: "D4",
	Minus: "D#4",
	BracketLeft: "E4",
	BracketRight: "F4",
};
