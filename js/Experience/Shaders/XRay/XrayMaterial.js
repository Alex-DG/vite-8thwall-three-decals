import { ShaderMaterial, AdditiveBlending, Color } from 'three'

import { ShaderChunk } from 'three'

const vertexShader = `
  uniform float uPower;
  uniform float uTime;
  varying float vIntensity;

  ${ShaderChunk.skinning_pars_vertex}

  void main() {
    vec3 vNormal = normalize(normalMatrix * normal);
    
    mat4 modelViewProjectionMatrix = projectionMatrix * modelViewMatrix;
   
    ${ShaderChunk.beginnormal_vertex}
    ${ShaderChunk.skinbase_vertex}
    ${ShaderChunk.skinnormal_vertex}

    vec3 transformed = vec3(position);

    ${ShaderChunk.skinning_vertex}

    gl_Position = modelViewProjectionMatrix * vec4(transformed, 1.0);
    
    vIntensity = pow(1.0 - abs(dot(vNormal, vec3(0,0,uTime))), uPower);
  }
`

const fragmentShader = `
  uniform vec3 uGlowColor;
  uniform float uOpacity;

  varying float vIntensity;
  
  void main()
  {
      vec3 glow = uGlowColor * vIntensity;
      gl_FragColor = vec4(glow, uOpacity);
  }
`

class XrayMaterial extends ShaderMaterial {
  constructor() {
    super({
      wireframe: true,
      blending: AdditiveBlending,
      transparent: true,
      // depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPower: { value: 10.0 },
        uOpacity: { value: 1.0 },
        uGlowColor: { value: new Color('#1d5378') },
      },
      vertexShader,
      fragmentShader,
    })
  }
}

export default XrayMaterial
