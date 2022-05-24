import { DatabaseFormat } from "./DatabaseFormat.js";
import { LogEntry } from "./LogEntry.js";
import { PlantDB } from "./PlantDB.js";
import { kindSummarize, tryParseFloat, tryParseInt } from "./Tools.js";

/**
 * Matches a Plant ID.
 */
export const MATCH_PID = /PID-\d{1,6}/;

/**
 * Matches all Plant IDs.
 */
export const MATCH_PID_ALL = /PID-\d{1,6}/g;

/**
 * Internally understood pot shapes.
 */
export type PotShapeTop = "Oval" | "Rectangle" | "Round" | "Square";

/**
 * Internally understood pot colors.
 */
export type PotColor =
  | "Black"
  | "Brown"
  | "Grey"
  | "LightGrey"
  | "Orange"
  | "Transparent"
  | "White";

/**
 * Describes an object containing all the fields required to initialize a `Plant`.
 */
export type PlantSerialized = {
  /**
   * The ID of the plant.
   */
  id: string;

  /**
   * The name of the plant.
   */
  name?: string;

  /**
   * The kind (or kinds) of the plant.
   */
  kind?: string | Array<string>;

  /**
   * The current substrate the plant is planted in.
   */
  substrate?: string | Array<string>;

  /**
   * The shape of the pot, when viewed from above.
   */
  potShapeTop?: string;

  /**
   * The color of the pot.
   */
  potColor?: string;

  /**
   * Does the plant current sit on a saucer?
   */
  onSaucer?: boolean;

  /**
   * The current location of the plant.
   */
  location?: string | Array<string>;

  /**
   * The minimum pH value for this plant.
   */
  phMin?: number;

  /**
   * The maximum pH value for this plant.
   */
  phMax?: number;

  /**
   * The minium EC value for this plant.
   */
  ecMin?: number;

  /**
   * The maximum EC value for this plant.
   */
  ecMax?: number;

  /**
   * The minimum temperature for this plant.
   */
  tempMin?: number;

  /**
   * The maximum temperature for this plant.
   */
  tempMax?: number;

  /**
   * Any notes about this plant.
   */
  notes?: string;
};

export class Plant {
  #plantDb: PlantDB;
  #id: string;
  #name: string | undefined;
  #kind: string | Array<string> | undefined;
  #location: string | Array<string> | undefined;
  #notes: string | undefined;

  // Pot
  #substrate: string | Array<string> | undefined;
  #potShapeTop: PotShapeTop | string | undefined;
  #potColor: PotColor | string | undefined;
  #onSaucer: boolean | undefined;

  // Diagnostics
  #phMin: number | undefined;
  #phMax: number | undefined;
  #ecMin: number | undefined;
  #ecMax: number | undefined;
  #tempMin: number | undefined;
  #tempMax: number | undefined;

  get plantDb() {
    return this.#plantDb;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get kind() {
    return this.#kind;
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

  get phMin() {
    return this.#phMin;
  }
  get phMax() {
    return this.#phMax;
  }

  get ecMin() {
    return this.#ecMin;
  }
  get ecMax() {
    return this.#ecMax;
  }

  get tempMin() {
    return this.#tempMin;
  }
  get tempMax() {
    return this.#tempMin;
  }

  get notes() {
    return this.#notes;
  }

  get log() {
    return this.#plantDb.log.filter(logEntry => logEntry.plantId === this.id) ?? [];
  }

  get logEntryOldest(): LogEntry | undefined {
    return this.log[0];
  }
  get logEntryLatest(): LogEntry | undefined {
    return this.log[this.log.length - 1];
  }

  private constructor(plantDb: PlantDB, plantId: string) {
    this.#plantDb = plantDb;
    this.#id = plantId;
  }

  identify() {
    return `Plant ${this.#name ?? "<unnamed>"} (${this.id}) ${kindSummarize(this.#kind)}`;
  }

  toString() {
    return this.identify();
  }

  static fromPlant(other: Plant, initializer?: Partial<Plant>) {
    const plant = new Plant(initializer?.plantDb ?? other.#plantDb, initializer?.id ?? other.id);
    plant.#name = initializer?.name ?? other.#name;
    plant.#kind = initializer?.kind ?? other.#kind;
    plant.#substrate = initializer?.substrate ?? other.#substrate;
    plant.#potShapeTop = initializer?.potShapeTop ?? other.#potShapeTop;
    plant.#potColor = initializer?.potColor ?? other.#potColor;
    plant.#onSaucer = initializer?.onSaucer ?? other.#onSaucer;
    plant.#location = initializer?.location ?? other.#location;
    plant.#phMin = initializer?.phMin ?? other.phMin;
    plant.#phMax = initializer?.phMax ?? other.phMax;
    plant.#ecMin = initializer?.ecMin ?? other.#ecMin;
    plant.#ecMax = initializer?.ecMax ?? other.#ecMax;
    plant.#tempMin = initializer?.tempMin ?? other.#tempMin;
    plant.#tempMax = initializer?.tempMax ?? other.#tempMax;
    plant.#notes = initializer?.notes ?? other.#notes;
    return plant;
  }

  static fromCSVData(plantDb: PlantDB, dataRow: Array<string>): Plant {
    const plant = new Plant(plantDb, dataRow[0]);
    plant.#name = dataRow[1] !== "" ? dataRow[1] : undefined;
    plant.#kind =
      dataRow[2] !== ""
        ? dataRow[2].includes("\n")
          ? dataRow[2].split("\n")
          : dataRow[2]
        : undefined;
    plant.#substrate =
      dataRow[3] !== ""
        ? dataRow[3].includes("\n")
          ? dataRow[3].split("\n")
          : dataRow[3]
        : undefined;
    plant.#potShapeTop = dataRow[4] !== "" ? dataRow[4] : undefined;
    plant.#potColor = dataRow[5] !== "" ? dataRow[5] : undefined;
    plant.#onSaucer = dataRow[6] === "TRUE" ? true : dataRow[6] === "FALSE" ? false : undefined;
    plant.#location =
      dataRow[7] !== ""
        ? dataRow[7].includes("\n")
          ? dataRow[7].split("\n")
          : dataRow[7]
        : undefined;
    plant.#phMin = dataRow[8] !== "" ? tryParseFloat(dataRow[8]) : undefined;
    plant.#phMax = dataRow[9] !== "" ? tryParseFloat(dataRow[9]) : undefined;
    plant.#ecMin = dataRow[10] !== "" ? tryParseInt(dataRow[10]) : undefined;
    plant.#ecMax = dataRow[11] !== "" ? tryParseInt(dataRow[11]) : undefined;
    plant.#tempMin = dataRow[12] !== "" ? tryParseFloat(dataRow[12]) : undefined;
    plant.#tempMax = dataRow[13] !== "" ? tryParseFloat(dataRow[13]) : undefined;
    plant.#notes = dataRow[14] !== "" ? dataRow[14] : undefined;
    return plant;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toCSVData(databaseFormat: DatabaseFormat) {
    const serialized = this.toJSObject();
    return [
      serialized.id,
      serialized.name,
      Array.isArray(serialized.kind) ? serialized.kind.join("\n") : serialized.kind,
      Array.isArray(serialized.substrate) ? serialized.substrate.join("\n") : serialized.substrate,
      serialized.potShapeTop,
      serialized.potColor,
      serialized.onSaucer === true ? "TRUE" : serialized.onSaucer === false ? "FALSE" : undefined,
      serialized.location,
      serialized.phMin,
      serialized.phMax,
      serialized.ecMin,
      serialized.ecMax,
      serialized.tempMin,
      serialized.tempMax,
      serialized.notes,
    ];
  }

  static fromJSObject(plantDb: PlantDB, dataObject: PlantSerialized) {
    const plant = new Plant(plantDb, dataObject.id);
    plant.#name = dataObject.name ?? plant.#name;
    plant.#kind = dataObject.kind ?? plant.#kind;
    plant.#substrate = dataObject.substrate ?? plant.#substrate;
    plant.#potShapeTop = dataObject.potShapeTop ?? plant.#potShapeTop;
    plant.#potColor = dataObject.potColor ?? plant.#potColor;
    plant.#onSaucer = dataObject.onSaucer ?? plant.#onSaucer;
    plant.#location = dataObject.location ?? plant.#location;
    plant.#phMin = dataObject.phMin ?? plant.phMin;
    plant.#phMax = dataObject.phMax ?? plant.phMax;
    plant.#ecMin = dataObject.ecMin ?? plant.#ecMin;
    plant.#ecMax = dataObject.ecMax ?? plant.#ecMax;
    plant.#tempMin = dataObject.tempMin ?? plant.#tempMin;
    plant.#tempMax = dataObject.tempMax ?? plant.#tempMax;
    plant.#notes = dataObject.notes ?? plant.#notes;
    return plant;
  }

  /**
   * Parse a JSON string and construct a new `Plant` from it.
   *
   * @param plantDb The `PlantDB` this `Plant` belongs to
   * @param dataString The JSON-serialized plant.
   * @returns The new `Plant`.
   */
  static fromJSON(plantDb: PlantDB, dataString: string) {
    const data = JSON.parse(dataString) as PlantSerialized;
    return Plant.fromJSObject(plantDb, data);
  }

  toJSObject(): PlantSerialized {
    return {
      id: this.#id,
      name: this.#name,
      kind: this.#kind,
      substrate: this.#substrate,
      potShapeTop: this.#potShapeTop,
      potColor: this.#potColor,
      onSaucer: this.#onSaucer,
      location: this.#location,
      phMin: this.#phMin,
      phMax: this.#phMax,
      ecMin: this.#ecMin,
      ecMax: this.#ecMax,
      tempMin: this.#tempMin,
      tempMax: this.#tempMax,
      notes: this.#notes,
    };
  }

  /**
   * Pre-serialize the `Plant` into an object ready to be turned into a JSON string.
   *
   * @returns The `Plant` as JSON-serializable object.
   */
  toJSON() {
    return this.toJSObject();
  }
}
