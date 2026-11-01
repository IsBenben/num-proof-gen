const seed = 'num-proof-gen';

export class SeedRandom {
  private readonly state = new Uint8Array(256);
  private indexI = 0;
  private indexJ = 0;

  constructor() {
    const state = this.state;
    for (let index = 0; index < 256; index++) {
      state[index] = index;
    }

    const keyLength = seed.length;
    let keyIndex = 0;
    for (let index = 0; index < 256; index++) {
      keyIndex =
        (keyIndex + state[index] + seed.charCodeAt(index % keyLength)) & 255;
      const swap = state[index];
      state[index] = state[keyIndex];
      state[keyIndex] = swap;
    }
    for (let index = 0; index < 256; index++) {
      this.generateByte();
    }
  }

  private generateByte(): number {
    const state = this.state;
    this.indexI = (this.indexI + 1) & 255;
    const swap = state[this.indexI];
    this.indexJ = (this.indexJ + swap) & 255;
    state[this.indexI] = state[this.indexJ];
    state[this.indexJ] = swap;
    return state[(state[this.indexI] + state[this.indexJ]) & 255];
  }

  next(): number {
    let accumulator = 0;
    for (let index = 0; index < 6; index++) {
      accumulator = accumulator * 256 + this.generateByte();
    }
    return accumulator / 2 ** 48;
  }
}
