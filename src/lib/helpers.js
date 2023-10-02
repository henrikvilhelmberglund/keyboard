export function handleTouchStart({ channel, note, e }) {
	e.preventDefault();
	if (e.touches.length > 1) {
	}
	channel.start(note.name);
	let touching = true;
	let keyIsDown = true;
	return [touching, keyIsDown];
}

export function handleTouchEnd({ channel, note }) {
  channel.stop({ note: note.name });
	let touching = false;
	let keyIsDown = false;
	return [touching, keyIsDown];
}

export function handleMouseDown({ touching, channel, note, e, velocity }) {
	if (touching) return;
	console.log(e);
	// TODO add velocity variable from mouse position (low = high velocity) and use it in mousedown and mouseenter
	const keyRect = e.target.getBoundingClientRect();

	// Calculate the velocity based on the click position within the key
	const clickY = e.clientY - keyRect.top; // Y-coordinate relative to the key
	const keyHeight = keyRect.height;

	// Normalize the velocity to a range (e.g., 0 to 1)
	let factor = 0 - (clickY / keyHeight) * -1;
  velocity = Math.round(factor * 127);
  

	console.log(velocity);
	channel.start({ note: note.name, velocity });
	let mouseDown = true;
	let keyIsDown = true;
	return [mouseDown, keyIsDown, velocity];
}

export function handleMouseUp({ touching, channel, note }) {
	if (touching) return;
  channel.stop({ note: note.name });
	let mouseDown = false;
	let keyIsDown = false;
	return [mouseDown, keyIsDown];
}

export function handleMouseEnter({ touching, mouseDown, channel, note, velocity }) {
	let keyIsDown = false;
	if (touching) return;
	if (mouseDown) {
		channel.start({ note: note.name, velocity });
		keyIsDown = true;
	}
	return [keyIsDown];
}

export function handleMouseLeave({ touching, channel, note }) {
	if (touching) return;
  channel.stop({ note: note.name });
	let keyIsDown = false;
	return [keyIsDown];
}
