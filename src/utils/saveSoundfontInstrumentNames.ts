import { loadSoundFont } from "spessasynth_lib";
import { readFileSync, readdirSync, writeFileSync } from "fs";

const sf2path = "static/sf2/musyng";

// read all files in the sf2 folder using loadSoundFont
const soundFontFolder = readdirSync(sf2path, "utf-8");

// console.log(soundFontFolder);

const outputFile = "src/lib/soundfontInstrumentNames/musyng/musyng.ts";
let outputText = "export const soundfontNames = [\n";
let outputTextEnd = "];\n";

for (const file of soundFontFolder) {
	const sf2 = readFileSync(sf2path + "/" + file);
	const loadedSf2 = loadSoundFont(sf2);
	// console.log(loadedSf2.presets[0].presetName);
	outputText += `"${loadedSf2.presets[0].presetName}",\n`;
}

outputText += outputTextEnd;

writeFileSync(outputFile, outputText);
