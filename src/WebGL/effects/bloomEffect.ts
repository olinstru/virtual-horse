import { Uniform } from "three"
import { Effect } from "postprocessing"
import fragmentShader from "../shaders/bloom.frag?raw"

export class BloomEffect extends Effect {
  constructor() {
    super("BloomEffect", fragmentShader, {
      uniforms: new Map([
        ["intensity", new Uniform(5)], 
        ["range", new Uniform(0.1)], // Length of glow streaks
        ["steps", new Uniform(0.003)], // Number of texture samples / 2
        ["threshold", new Uniform(0.4)], // Color key threshold (0-1)
      ]),
    })
  }
}
