import { themeColors } from "./src/lib/theme/theme.js";
const safelistTypes = [
	"text",
	// "decoration",
	// "placeholder",
	"bg",
	// "from",
	// "via",
	// "to",
	// "border-x",
	// "border-y",
	// "border-t",
	// "border-r",
	// "border-b",
	// "border-l",
	// "border",
	// "divide",
	"outline",
	// "ring",
	// "ring-offset",
	// "shadow",
	// "accent",
	// "caret",
	// "fill",
	// "stroke",
];
const safelistColors = ["primary", "secondary", "base", "gray", ...themeColors];
const safelistShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
// let mode = 2;
// let myArray = [];

// safelistTypes.forEach((type) => {
// 	if (mode === 1) console.log("[");
// 	safelistColors.forEach((color) => {
// 		safelistShades.forEach((shade) => {
// 			if (mode === 1) {
// 				console.log(`"${type}-${color}-${shade}",`);
// 			} else if (mode === 2) {
// 				myArray.push(`${type}-${color}-${shade}`);
// 			}
// 		});
// 	});
// 	if (mode === 1) console.log("],");
// });

// if (mode === 2) {
// 	console.log(myArray.join(" "));
// 	return myArray.join(" ");
// }

export function createSafeList() {
	const safelistArray = [];

	safelistTypes.forEach((type) => {
		safelistColors.forEach((color) => {
			safelistShades.forEach((shade) => {
				safelistArray.push(`${type}-${color}-${shade}`);
			});
		});
	});
	return safelistArray;
}
