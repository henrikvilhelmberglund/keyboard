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
	KeyZ: "C2",
	KeyS: "C#2",
	KeyX: "D2",
	KeyD: "D#2",
	KeyC: "E2",
	KeyV: "F2",
	KeyG: "F#2",
	KeyB: "G2",
	KeyH: "G#2",
	KeyN: "A2",
	KeyJ: "A#2",
	KeyM: "B2",
	Comma: "C3",
	KeyL: "C#3",
	Period: "D3",
	SemiColon: "D#3",
	Slash: "E3",

	// row2
	KeyW: "C3",
	Digit3: "C#3",
	KeyE: "D3",
	Digit4: "D#3",
	KeyR: "E3",
	KeyT: "F3",
	Digit6: "F#3",
	KeyY: "G3",
	Digit7: "G#3",
	KeyU: "A3",
	Digit8: "A#3",
	KeyI: "B3",
	KeyO: "C4",
	Digit0: "C#4",
	KeyP: "D4",
	Minus: "D#4",
	BracketLeft: "E4",
	BracketRight: "F4",
};
