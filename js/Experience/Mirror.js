import { Reflector } from 'three/examples/jsm/objects/Reflector.js'

/**
 * Floating mirror
 */
class Mirror {
  constructor(options) {
    this.instance = new THREE.Group()
    this.mesh = options.mesh

    this.params = {
      height: 2,
      width: 3,
      segments: 16,
      offset: 0.8,
    }
    this.init()
  }

  init() {
    const { height, width, segments, offset } = this.params

    this.mirrorGeometry = new THREE.PlaneGeometry(
      width,
      height,
      segments,
      segments
    )
    // const mirrorGeometry2 = new THREE.PlaneGeometry(
    //   width + 1,
    //   height - 0.5,
    //   segments,
    //   segments
    // )

    // > Main mirror
    this.mirror = new Reflector(this.mirrorGeometry, {
      color: 0x777777,
      clipBias: 0.003,
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
    })
    this.mirror.position.z = this.mesh.position.z - offset - offset / 2
    this.mirror.position.y = this.mesh.position.y + offset + offset / 2

    const geometryCloned = mirrorGeometry2.clone()

    // > Left mirror
    this.mirrorLeft = new Reflector(geometryCloned, {
      color: 0x777777,
      clipBias: 0.003,
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
    })
    this.mirrorLeft.position.copy(this.mirror.position)
    this.mirrorLeft.position.x = (offset + 1) * -1
    this.mirrorLeft.rotation.y = Math.PI / 4

    //> Right mirror
    this.mirrorRight = new Reflector(geometryCloned, {
      color: 0x777777,
      clipBias: 0.003,
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
    })
    this.mirrorRight.position.copy(this.mirror.position)
    this.mirrorRight.position.x = offset + 1
    this.mirrorRight.rotation.y = (Math.PI / 4) * -1

    this.instance.add(this.mirror)
    this.instance.rotation.y = -0.3
    // this.instance.add(this.mirrorLeft, this.mirror, this.mirrorRight)
  }

  update() {
    const t = performance.now()
    const shift = Math.sin(t / 1000)

    // this.mirrorLeft.position.y -= shift * 0.015
    this.mirror.position.y -= shift * 0.01
    // this.mirrorRight.position.y -= shift * 0.015

    const position = this.mirrorGeometry.attributes.position

    for (let i = 0; i < position.count; i++) {
      const z = 0.5 * Math.sin(i / 5 + (t / 100 + i) / 7)
      position.setZ(i, z)
    }
    position.needsUpdate = true
  }
}

export default Mirror
