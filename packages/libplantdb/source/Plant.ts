import { LogEntry } from "./LogEntry.js";
import { kindFlatten, kindSummarize } from "./Tools.js";

export const MATCH_PID = /PID-\n{1,6}/;

export type PotShapeTop = "Round" | "Square";
export type PotColor = "Grey" | "LightGrey" | "White";

export class Plant {
  #plantId: string;
  #name: string | undefined;
  #kind: string | Array<string> | undefined;
  #substrate: string | undefined;
  #potShapeTop: PotShapeTop | string | undefined;
  #potColor: PotColor | string | undefined;
  #onSaucer: boolean | undefined;
  #location: string | undefined;
  #phIdeal: number | undefined;
  #ecIdeal: number | undefined;
  #tempIdeal: number | undefined;
  #notes = "";

  #log = new Array<LogEntry>();

  get id() {
    return this.#plantId;
  }

  get name() {
    return this.#name;
  }

  get kind() {
    return this.#kind;
  }

  get indexableText() {
    return `${this.id} ${this.name ?? ""} ${kindFlatten(this.kind)}`.toLocaleLowerCase();
  }

  get substrate() {
    return this.#substrate;
  }

  get potShapeTop() {
    return this.#potShapeTop;
  }

  get potColor() {
    return this.#potColor;
  }

  get onSaucer() {
    return this.#onSaucer;
  }

  get location() {
    return this.#location;
  }

  get phIdeal() {
    return this.#phIdeal;
  }

  get ecIdeal() {
    return this.#ecIdeal;
  }

  get tempIdeal() {
    return this.#tempIdeal;
  }

  get notes() {
    return this.#notes;
  }

  get log() {
    return this.#log.filter(logEntry => logEntry.plantId === this.id);
  }

  get logEntryOldest() {
    return this.log[0];
  }
  get logEntryLatest() {
    return this.log[this.log.length - 1];
  }

  private constructor(plantId: string) {
    this.#plantId = plantId;
  }

  identify() {
    return `Plant ${this.#name ?? "<unnamed>"} (${this.id}) ${kindSummarize(this.#kind)}`;
  }

  toString() {
    return this.identify();
  }

  static Empty() {
    return new Plant("PID-0");
  }

  static fromCSV(dataRow: Array<string>, log = new Array<LogEntry>()): Plant {
    const plant = new Plant(dataRow[0]);
    plant.#name = dataRow[1];
    plant.#kind = dataRow[2].includes("\n") ? dataRow[2].split("\n") : dataRow[2];
    plant.#substrate = dataRow[3];
    plant.#potShapeTop = dataRow[4];
    plant.#potColor = dataRow[5];
    plant.#onSaucer = dataRow[6] === "TRUE";
    plant.#location = dataRow[7];
    plant.#phIdeal = Number(dataRow[8]);
    plant.#ecIdeal = Number(dataRow[9]);
    plant.#tempIdeal = Number(dataRow[10]);
    plant.#notes = dataRow[11];

    plant.#log = log;
    return plant;
  }

  static fromJSON(dataObject: Partial<Plant> & { id: string }, log = new Array<LogEntry>()) {
    const plant = new Plant(dataObject.id);
    plant.#name = dataObject.name ?? plant.#name;
    plant.#kind = dataObject.kind ?? plant.#kind;
    plant.#substrate = dataObject.substrate ?? plant.#substrate;
    plant.#potShapeTop = dataObject.potShapeTop ?? plant.#potShapeTop;
    plant.#potColor = dataObject.potColor ?? plant.#potColor;
    plant.#onSaucer = dataObject.onSaucer ?? plant.#onSaucer;
    plant.#location = dataObject.location ?? plant.#location;
    plant.#phIdeal = dataObject.phIdeal ?? plant.#phIdeal;
    plant.#ecIdeal = dataObject.ecIdeal ?? plant.#ecIdeal;
    plant.#tempIdeal = dataObject.tempIdeal ?? plant.#tempIdeal;
    plant.#notes = dataObject.notes ?? plant.#notes;

    plant.#log = log;
    return plant;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      kind: this.kind,
      substrate: this.substrate,
      potShapeTop: this.potShapeTop,
      potColor: this.potColor,
      onSaucer: this.onSaucer,
      location: this.location,
      phIdeal: this.phIdeal,
      ecIdeal: this.ecIdeal,
      tempIdeal: this.tempIdeal,
      notes: this.notes,
    };
  }
}
