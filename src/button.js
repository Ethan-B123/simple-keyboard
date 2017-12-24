function makeDistortionCurve(amount) {
  let k = typeof amount === 'number' ? amount : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for (; i < n_samples; ++i) {
    x = i * 2 / n_samples - 1;
    curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

class Button {
  constructor({ ctx, frequency, destination }) {
    this.oscillator = ctx.createOscillator();
    this.oscillator.frequency.value = frequency;
    this.oscillator.start();

    // this.distortion = ctx.createWaveShaper();
    // this.distortion.curve = makeDistortionCurve(100);

    this.gainNode = ctx.createGain();
    this.oscillator.connect(this.gainNode);

    this.gainNode.connect(destination);
    this.gainNode.gain.value = 0;
    this.currentlyPressed = false;

    this.ctx = ctx;
  }

  press() {
    if (this.currentlyPressed) {
      return;
    }
    this.currentlyPressed = true;
    this.gainNode.gain.cancelAndHoldAtTime(this.ctx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 0.005);
  }


  release() {
    this.currentlyPressed = false;
    this.gainNode.gain.cancelAndHoldAtTime(this.ctx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.005);
  }
}

export default Button;