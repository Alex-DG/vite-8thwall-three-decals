import modelSrc from '../../assets/models/shoe-draco.glb' // shoe

import Mirror from './Mirror'
import XrayMaterial from './Shaders/XRay/XrayMaterial'
import DebugPane from './Utils/Debug'

class Shoe {
  constructor(options) {
    this.scene = options.scene
    this.gltfLoader = options.gltfLoader
    this.decals = options.decals

    this.init()
  }

  async init() {
    try {
      const model = await this.gltfLoader.loadAsync(modelSrc)
      this.model = model.scene

      this.model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      // this.model.position.z = -3.5

      // this.mirror = new Mirror({ mesh: this.model.children[0] })
      // this.model.add(this.mirror.instance)

      this.scene.add(this.model)

      this.model.children[0].name = 'shoe'
      this.decals.setTarget(this.model.children[0])
    } catch (error) {
      console.error({ error })
    }
  }

  update() {
    // this.mirror?.update()
    // if (this.model) {
    //   this.model.traverse((child) => {
    //     if (child.isMesh) {
    //       child.material.uniforms.uTime.value = performance.now() * 1000
    //     }
    //   })
    // }
  }
}

export default Shoe
