import Button from "./button";

const buildOscillators = (ctx, destination) => {
  const frequencies = {
    oct8: [
      4186.01, 4434.92, 4698.63, 4978.03, 5274.04, 5587.65,
      5919.91, 6271.93, 6644.88, 7040.00, 7458.62, 7902.13
    ]
  };
  for(let i = 8; i > 0; i--) {
    frequencies["oct" + (i - 1)] = frequencies["oct" + i].map((freq) => (
      freq / 2
    ));
  }

  for (let i = 0; i < 8; i++) {
    frequencies["oct" + i] = frequencies["oct" + i].map((frequency) => {
      return new Button({ frequency, ctx, destination });
    });
  }
  return frequencies;
};

class Board {
  constructor({ audioCtx }) {
    this.gainNode = audioCtx.createGain();
    this.compressor = audioCtx.createDynamicsCompressor();
    const finish = audioCtx.destination;
    this.oscillators = buildOscillators(audioCtx, finish);
    this.gainNode.connect(this.compressor);
    this.compressor.connect(finish);
    this.octave = 4;
    this.keyBindings = {
      a: {
        noteIdx: 0
      },
      s: {
        noteIdx: 2
      },
      d: {
        noteIdx: 4
      },
      f: {
        noteIdx: 5
      },
      g: {
        noteIdx: 7
      },
      h: {
        noteIdx: 9
      },
      j: {
        noteIdx: 11
      },
      k: {
        noteIdx: 0,
        octaveMod: 1
      },
      l: {
        noteIdx: 2,
        octaveMod: 1
      },
    };
  }

  onKeyChange(upOrDown) {
    return (e) => {
      const keyBinding = this.keyBindings[e.key];
      if (!keyBinding) {
        return;
      }
      let { noteIdx, octaveMod } = keyBinding;
      octaveMod = octaveMod || 0;
      const oscillator = this.oscillators["oct" + (this.octave + octaveMod)][noteIdx];
      if (upOrDown === "down") {
        oscillator.press(this.gainNode);
      } else if (upOrDown === "up") {
        oscillator.release();
      }
    };
  }
}

export default Board;