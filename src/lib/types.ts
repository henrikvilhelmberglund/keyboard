export type Note = {
  name: string;
  value: number | string;
}

import type { DrumMachine, ElectricPiano, Mellotron, Soundfont, SplendidGrandPiano } from "smplr";
import type { Synthetizer } from "spessasynth_lib";

export type ValidInstruments = Soundfont | ElectricPiano | Mellotron | DrumMachine | SplendidGrandPiano | Synthetizer;

export type InstrumentType = {
  startingInstrument: string;
  instrumentList: string[];
  instrumentNotes: Note[];
  instrumentType: ValidInstruments;
}