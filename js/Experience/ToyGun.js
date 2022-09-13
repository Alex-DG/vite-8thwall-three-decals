import modelSrc from '../../assets/models/toy_gun2.glb'

import crosshairSrc from '../../assets/textures/crosshair.png'

class ToyGun {
  constructor(options) {
    this.scene = options.scene
    this.gltfLoader = options.gltfLoader
    this.textureLoader = options.textureLoader
    this.camera = options.camera
    this.uiScene = options.uiScene
    this.decals = options.decals

    this.init()
  }

  async setCursor() {
    const crosshair = await this.textureLoader.loadAsync(crosshairSrc)
    this.cursor = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: crosshair,
        color: 0xff0000,
        fog: false,
        depthTest: false,
        depthWrite: false,
      })
    )
    this.cursor.name = 'cursor'
    this.cursor.scale.set(0.19, 0.19, 1)
    this.cursor.position.set(0, 0, -10)
    this.uiScene.add(this.cursor)
    this.decals.setCursor(this.cursor)

    // const cameraMin = this.camera.aspect

    // const cursorSize = 1
    // const cursorThickness = 1.2
    // const cursorGeometry = new THREE.RingBufferGeometry(
    //   cursorSize * cameraMin,
    //   cursorSize * cameraMin * cursorThickness,
    //   32,
    //   0,
    //   Math.PI * 0.5,
    //   Math.PI * 2
    // )
    // const cursorMaterial = new THREE.MeshBasicMaterial({
    //   color: 'white',
    //   side: THREE.DoubleSide,
    // })
    // cursorMaterial.polygonOffset = true
    // cursorMaterial.polygonOffsetUnit = 1
    // cursorMaterial.polygonOffsetFactor = 1

    // const cursor = new THREE.Mesh(cursorGeometry, cursorMaterial)
    // cursor.renderOrder = 2
    // cursor.position.z = -cameraMin * 50

    // cursor.renderOrder = 999
    // // cursor.material.depthTest = false
    // cursor.material.depthWrite = false
    // cursor.onBeforeRender = function (renderer) {
    //   // renderer.clearDepth()
    // }

    // this.camera.add(cursor)
  }

  async init() {
    try {
      const model = await this.gltfLoader.loadAsync(modelSrc)

      this.model = model.scene

      this.model.position.z = -2
      this.model.position.y = -1
      this.model.position.x = 0.2
      this.model.rotation.y = Math.PI * 0.05

      this.model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      this.camera.add(this.model)
      this.decals.setToyGun(this.model)
      this.setCursor()
    } catch (error) {
      console.error({ error })
    }
  }

  update() {}
}

export default ToyGun
