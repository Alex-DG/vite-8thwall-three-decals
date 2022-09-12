import modelSrc from '../../assets/models/toy_gun2.glb'

class ToyGun {
  constructor(options) {
    this.scene = options.scene
    this.gltfLoader = options.gltfLoader
    console.log('yo!')
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

      console.log({ model })

      this.scene.add(this.model)
    } catch (error) {
      console.error({ error })
    }
  }

  update() {}
}

export default ToyGun
