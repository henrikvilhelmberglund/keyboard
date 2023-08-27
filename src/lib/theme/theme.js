import { colors } from "@unocss/preset-mini";

// add colors here, then create an object inside presetTheme({theme: {} in uno.config.js
export const themes = createThemes([
	{ name: "blue", primary: colors.blue, secondary: colors.purple, gray: colors.slate },
	{ name: "green", primary: colors.green, secondary: colors.orange, gray: colors.gray },
	{ name: "yellow", primary: colors.yellow, secondary: colors.pink, gray: colors.stone },
	{ name: "pink", primary: colors.pink, secondary: colors.rose, gray: colors.stone },
]);
export const themeColors = Object.entries(themes).map((theme) => {
	// console.log(theme[0]);
	return theme[0];
});

export function createThemes(objects) {
	function generateColorObject(name, primary, secondary, gray) {
		const colors = {
			primary: {
				50: primary["50"],
				100: primary["100"],
				200: primary["200"],
				300: primary["300"],
				400: primary["400"],
				500: primary["500"],
				600: primary["600"],
				700: primary["700"],
				800: primary["800"],
				900: primary["900"],
				950: primary["950"],
			},
			secondary: {
				50: secondary["50"],
				100: secondary["100"],
				200: secondary["200"],
				300: secondary["300"],
				400: secondary["400"],
				500: secondary["500"],
				600: secondary["600"],
				700: secondary["700"],
				800: secondary["800"],
				900: secondary["900"],
				950: secondary["950"],
			},
			gray: {
				50: gray["50"],
				100: gray["100"],
				200: gray["200"],
				300: gray["300"],
				400: gray["400"],
				500: gray["500"],
				600: gray["600"],
				700: gray["700"],
				800: gray["800"],
				900: gray["900"],
				950: gray["950"],
			},
		};

		const output = {};
		output[name] = { colors };

		return output;
	}

	const themes = objects.map((object) => {
		const { name, primary, secondary, gray } = object;
		return generateColorObject(name, primary, secondary, gray);
	});

	return Object.assign({}, ...themes);
}
