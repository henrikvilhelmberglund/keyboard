import type { Soundfont } from "smplr";

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

export function handleTouchStart({ channel, note, e }: { channel: Soundfont; note: Note; e: TouchEvent }): [boolean, boolean, string] {
	e.preventDefault();
	if (e.touches.length > 1) {
	}
	channel.start(note.value);
	let touching = true;
	let keyIsDown = true;
	let lastKey = note.name;
	return [touching, keyIsDown, lastKey];
}

export function handleTouchEnd({ channel, note }: { channel: Soundfont; note: Note }): [boolean, boolean] {
	channel.stop(note.value);
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

export function handleMouseDown({ channel, note, e, velocity }: { channel: Soundfont; note: Note; e: MouseEvent; velocity: number }): [boolean, boolean, number] {
	// if (touching) return;
	console.log(e);
	velocity = getVelocity(e);

	channel.start({ note: note.value, velocity, loop: true });
	let mouseDown = true;
	let keyIsDown = true;
	return [mouseDown, keyIsDown, velocity];
}

export function handleMouseUp({ channel, note }: { channel: Soundfont; note: Note }): [boolean, boolean] {
	channel.stop(note.value);
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

export function handleTouchMove({ lastKey, channel, e }: { lastKey: string; channel: Soundfont; e: TouchEvent }): [boolean, string] {
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
		channel.start({ note: currentKey });
		keyIsDown = true;
	}

	return [keyIsDown, currentKey];
}

export function handleMouseEnter({ mouseDown, channel, note, e, velocity }: { mouseDown: boolean; channel: Soundfont; note: Note; e: MouseEvent; velocity: number }): [boolean] {
	let keyIsDown = false;
	if (mouseDown) {
		velocity = getVelocity(e);
		channel.start({ note: note.value, velocity });
		keyIsDown = true;
	}
	return [keyIsDown];
}

export function handleMouseLeave({ channel, note }: { channel: Soundfont; note: Note }) {
	channel.stop(note.value);
	let keyIsDown = false;
	return [keyIsDown];
}

export function handleMouseLeaveDrums({ touching }: { touching: boolean }) {
	if (touching) return;
	// channel.stop(note.value);
	let keyIsDown = false;
	return [keyIsDown];
}
