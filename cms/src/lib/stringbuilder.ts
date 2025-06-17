export class StringBuilder {
  strings: string[];

  constructor() {
    this.strings = new Array();
    //this.append(value);
  }
  append(value: string) {
    if (value) {
      this.strings.push(value);
    }
  }
  clear() {
    this.strings.length = 0;
  }
  toString() {
    return this.strings.join("");
  }
}
