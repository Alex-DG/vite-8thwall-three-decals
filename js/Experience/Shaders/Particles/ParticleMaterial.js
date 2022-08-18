import { ShaderMaterial, AdditiveBlending } from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

class ParticleMaterial extends ShaderMaterial {
  constructor() {
    super({
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 50 },
        uHighY: { value: 4 },
        uLowY: { value: 0.5 },
      },
      vertexShader,
      fragmentShader,
    })
  }
}

export default ParticleMaterial
