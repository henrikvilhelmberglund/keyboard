export function clickOutside(element, callbackFunction) {
	function onEsc(event) {
		if (event.key === "Escape") {
			// console.log("pressed esc - closing!");
			callbackFunction();
		}
	}

	function onClick(event) {
		if (!element.contains(event.target)) {
			// console.log("clicked outside of modal - closing!");
			callbackFunction();
		} else {
			// console.log("clicked in modal");
		}
	}
	document.body.addEventListener("mousedown", onClick);
	document.body.addEventListener("keydown", onEsc);
	return {
		update(newCallbackFunction) {
			callbackFunction = newCallbackFunction;
		},
		destroy() {
			document.body.removeEventListener("mousedown", onClick);
			document.body.removeEventListener("keydown", onEsc);
		},
	};
}
