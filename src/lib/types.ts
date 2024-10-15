export type Note = {
  name: string;
  value: number;
}

import type { DrumMachine, ElectricPiano, Mellotron, Soundfont, SplendidGrandPiano } from "smplr";

export type ValidInstruments = Soundfont | ElectricPiano | Mellotron | DrumMachine | SplendidGrandPiano;

