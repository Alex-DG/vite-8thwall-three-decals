import modelSrc from '../../assets/models/hachiko.glb' // dog
import modelSrc2 from '../../assets/models/shoe-draco.glb' // shoe

import Mirror from './Mirror'

class Hachiko {
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

      this.model.position.z = -3.5

      this.mirror = new Mirror({ mesh: this.model.children[0] })
      this.model.add(this.mirror.instance)

      this.scene.add(this.model)

      this.model.children[0].name = 'hachiko'
      this.decals.setTarget(this.model.children[0])
    } catch (error) {
      console.error({ error })
    }
  }

  update() {
    this.mirror?.update()
  }
}

export default Hachiko
