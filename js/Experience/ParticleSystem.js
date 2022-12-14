import ParticleMaterial from './Shaders/Particles/ParticleMaterial'

class ParticleSystem {
  constructor(options) {
    this.scene = options.scene
    this.count = options.count || 5000
    this.init()
  }

  init() {
    const count = this.count
    this.particleMaterial = new ParticleMaterial()

    const particleGeometry = new THREE.BufferGeometry()

    const positionArray = new Float32Array(count * 3)
    const scaleArray = new Float32Array(count) // add scale randomness

    for (let i = 0; i < count; i++) {
      positionArray.set(
        [
          (Math.random() - 0.5) * 10,
          Math.random() * 10, // alternative effect -> scan effect on Y  => Math.random() * 1,
          (Math.random() - 0.5) * 10,
        ],
        i * 3
      )

      scaleArray[i] = Math.random()
    }

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positionArray, 3)
    )
    particleGeometry.setAttribute(
      'aScale',
      new THREE.BufferAttribute(scaleArray, 1)
    )

    this.instance = new THREE.Points(particleGeometry, this.particleMaterial)
    this.instance.name = 'particles'
    this.scene.add(this.instance)
  }

  update() {
    if (this.particleMaterial) {
      this.particleMaterial.uniforms.uTime.value = performance.now() / 2500
    }
  }
}

export default ParticleSystem
