export type Note = {
  name: string;
  value: number | string;
}

import type { DrumMachine, ElectricPiano, Mellotron, Soundfont, SplendidGrandPiano } from "smplr";

export type ValidInstruments = Soundfont | ElectricPiano | Mellotron | DrumMachine | SplendidGrandPiano;

export type InstrumentType = {
  startingInstrument: string;
  instrumentList: string[];
  instrumentNotes: Note[];
  instrumentType: ValidInstruments;
}