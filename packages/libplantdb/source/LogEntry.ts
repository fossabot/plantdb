export class LogEntry {
  #plantId: string;
  #timestamp: Date;
  #type: string;
  #ec: number | undefined;
  #ph: number | undefined;
  #product: string | undefined;
  #note: string | undefined;

  render(): string {
    return `${this.#plantId} ${this.#timestamp.toISOString()} did something`;
  }

  constructor(plantId: string, timestamp: Date = new Date(), type = "") {
    this.#plantId = plantId;
    this.#timestamp = timestamp;
    this.#type = type;
  }

  static deserialize(dataRow: Array<string>): LogEntry {
    const logEntry = new LogEntry(dataRow[0], new Date(dataRow[1]), dataRow[2]);
    logEntry.#ec = Number(dataRow[3]);
    logEntry.#ph = Number(dataRow[4]);
    logEntry.#product = dataRow[5];
    logEntry.#note = dataRow[6];
    return logEntry;
  }
}
