import { DrumMachine } from "smplr";
import type { Note, ValidInstruments } from "./types";
import { Synthetizer } from "spessasynth_lib";

function getVelocity(e: MouseEvent) {
	const keyRect = (<HTMLButtonElement>e.target).getBoundingClientRect();

	// Calculate the velocity based on the click position within the key
	const clickY = e.clientY - keyRect.top; // Y-coordinate relative to the key
	const keyHeight = keyRect.height;

	// Normalize the velocity to a range (e.g., 0 to 1)
	let factor = 0 - (clickY / keyHeight) * -1;
	let velocity = Math.round(factor * 127);
	return velocity;
}

export function handleTouchStart({ channel, note, e }: { channel: ValidInstruments; note: Note; e: TouchEvent | PointerEvent }): [boolean, boolean, string] {
	// e.preventDefault();
	console.log(note);
	if (channel instanceof Synthetizer) {
		channel.noteOn(0, note.value as number, 80, false);
	} else {
		channel.start({ note: note.value });
	}
	let touching = true;
	let keyIsDown = true;
	let lastKey = note.name;
	return [touching, keyIsDown, lastKey];
}

export function handleTouchEnd({ channel, note }: { channel: ValidInstruments; note: Note }): [boolean, boolean] {
	if (!(channel instanceof DrumMachine) && !(channel instanceof Synthetizer)) {
		channel.stop(note.value);
	} else if (channel instanceof Synthetizer) {
		channel.noteOff(0, note.value as number);
	}
	let touching = false;
	let keyIsDown = false;
	return [touching, keyIsDown];
}

export function handleTouchEndDrums(): [boolean, boolean] {
	// channel.stop(note.value);
	let touching = false;
	let keyIsDown = false;
	return [touching, keyIsDown];
}

export function handleMouseDown({ channel, note, e, velocity }: { channel: ValidInstruments; note: Note; e: MouseEvent; velocity: number }): [boolean, boolean, number] {
	// if (touching) return;
	console.log(e);
	velocity = getVelocity(e);
	// console.log(channel.sampleNames)

	if (channel instanceof Synthetizer) {
		channel.noteOn(0, note.value as number, velocity, false);
	} else {
		channel.start({ note: note.value, velocity });
	}
	let mouseDown = true;
	let keyIsDown = true;
	return [mouseDown, keyIsDown, velocity];
}

export function handleMouseUp({ channel, note }: { channel: ValidInstruments; note: Note }): [boolean, boolean] {
	// TODO if statements for each type of instruments
	if (!(channel instanceof DrumMachine) && !(channel instanceof Synthetizer)) {
		channel.stop(note.value);
	} else if (channel instanceof Synthetizer) {
		channel.noteOff(0, note.value as number);
	}

	let mouseDown = false;
	let keyIsDown = false;
	return [mouseDown, keyIsDown];
}

export function handleMouseUpDrums({ touching }: { touching: boolean }): [boolean, boolean] {
	// channel.stop(note.value);
	let mouseDown = false;
	let keyIsDown = false;
	return [mouseDown, keyIsDown];
}

export function handleTouchMove({ lastKey, channel, e }: { lastKey: string; channel: ValidInstruments; e: TouchEvent }): [boolean, string] {
	let keyIsDown = false;
	const touchedKey = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
	console.log(touchedKey);
	// if (touching) return;
	// let touching = true;
	// velocity = getVelocity(e);
	let currentKey = "";
	if (touchedKey) {
		currentKey = touchedKey.id;
	}
	console.log("currentKey", currentKey);
	console.log("lastKey", lastKey);
	if (currentKey !== lastKey) {
		if (channel instanceof Synthetizer) {
			// TODO implement touch
			// @ts-ignore
			channel.noteOn(0, currentKey, velocity, false);
		} else {
			channel.start({ note: currentKey });
		}
		keyIsDown = true;
	}

	return [keyIsDown, currentKey];
}

export function handleMouseEnter({
	mouseDown,
	channel,
	note,
	e,
	velocity,
}: {
	mouseDown: boolean;
	channel: ValidInstruments;
	note: Note;
	e: MouseEvent;
	velocity: number;
}): [boolean] {
  let keyIsDown = false;
	if (mouseDown) {
		velocity = getVelocity(e);
		if (channel instanceof Synthetizer) {
			channel.noteOn(0, note.value as number, velocity, false);
		} else {
			channel.start({ note: note.value, velocity });
		}
		keyIsDown = true;
	}
	return [keyIsDown];
}

export function handleMouseLeave({ channel, note }: { channel: ValidInstruments; note: Note }) {
	if (!(channel instanceof DrumMachine) && !(channel instanceof Synthetizer)) {
		channel.stop(note.value);
	} else if (channel instanceof Synthetizer) {
		channel.noteOff(0, note.value as number);
	}
	let keyIsDown = false;
	return [keyIsDown];
}

export function handleMouseLeaveDrums({ touching }: { touching: boolean }) {
	if (touching) return;
	// channel.stop(note.value);
	let keyIsDown = false;
	return [keyIsDown];
}

export function absorbEvent(event: TouchEvent) {
  var e = event || window.event;
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
}