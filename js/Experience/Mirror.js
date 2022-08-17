import { Reflector } from 'three/examples/jsm/objects/Reflector.js'

/**
 * Floating mirror
 */
class Mirror {
  constructor(options) {
    // this.scene = options.scene
    this.instance = new THREE.Group()
    this.mesh = options.mesh

    this.params = {
      height: 2,
      width: 1.5,
      segments: 2,
      offset: 1,
    }
    this.init()
  }

  init() {
    const { height, width, segments, offset } = this.params

    const mirrorGeometry = new THREE.PlaneGeometry(
      width,
      height,
      segments,
      segments
    )
    const mirrorGeometry2 = new THREE.PlaneGeometry(
      width + 1,
      height - 0.5,
      segments,
      segments
    )

    this.mirror = new Reflector(mirrorGeometry, {
      color: 0x777777,
      clipBias: 0.003,
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
    })
    this.mirror.position.z = this.mesh.position.z - offset - offset / 2
    this.mirror.position.y = this.mesh.position.y + offset + offset / 2

    const geometryCloned = mirrorGeometry2.clone()

    this.mirrorLeft = new Reflector(geometryCloned, {
      color: 0x777777,
      clipBias: 0.003,
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
    })
    this.mirrorLeft.position.copy(this.mirror.position)
    this.mirrorLeft.position.x = (offset + 1) * -1
    this.mirrorLeft.rotation.y = Math.PI / 4

    this.mirrorRight = new Reflector(geometryCloned, {
      color: 0x777777,
      clipBias: 0.003,
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
    })
    this.mirrorRight.position.copy(this.mirror.position)
    this.mirrorRight.position.x = offset + 1
    this.mirrorRight.rotation.y = (Math.PI / 4) * -1

    // this.instance.add(mirror)
    this.instance.add(this.mirrorLeft, this.mirror, this.mirrorRight)
  }

  update() {
    const t = performance.now()
    const shift = Math.sin(t / 1000)

    this.mirrorLeft.position.y -= shift * 0.015
    this.mirror.position.y -= shift * 0.01
    this.mirrorRight.position.y -= shift * 0.015
  }
}

export default Mirror
