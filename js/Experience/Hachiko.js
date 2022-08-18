import modelSrc from '../../assets/models/hachiko.glb' // dog
import modelSrc2 from '../../assets/models/shoe-draco.glb' // shoe

import Mirror from './Mirror'
import XrayMaterial from './Shaders/XRay/XrayMaterial'
import DebugPane from './Utils/Debug'

class Hachiko {
  constructor(options) {
    this.scene = options.scene
    this.gltfLoader = options.gltfLoader
    this.decals = options.decals

    this.init()
  }

  debug() {
    const params = {
      color: '#36a2ee',
    }

    const cb = (value) => {
      this.model.children[0].material.uniforms.uGlowColor.value =
        new THREE.Color(value)
    }

    DebugPane.addSlider(
      this.model.children[0].material.uniforms.uPower,
      'value',
      {
        min: -10,
        max: 10,
        step: 0.001,
        label: 'power',
      }
    )
    DebugPane.addColorPicker(
      params,
      'color',
      {
        label: 'glow',
      },
      cb
    )
  }

  async init() {
    try {
      const model = await this.gltfLoader.loadAsync(modelSrc)
      this.model = model.scene

      // this.model.traverse((child) => {
      //   if (child.isMesh) {
      //     // if (this.iterations % 2 === 0) {
      //     //   child.material = new THREE.MeshStandardMaterial({
      //     //     color: 0x00ffff,
      //     //     wireframe: true,
      //     //   })
      //     // }
      //     // child.material.shading = THREE.FlatShading
      //     // child.material.wireframe = true
      //     // child.material.blending = THREE.AdditiveBlending
      //     // child.material = material.clone()
      //     // child.material = new THREE.MeshPhongMaterial({
      //     //   map: child.material.map,
      //     //   // shading: THREE.FlatShading,
      //     // })
      //   }
      // })

      this.model.position.z = -3.5

      // this.mirror = new Mirror({ mesh: this.model.children[0] })
      // this.model.add(this.mirror.instance)

      this.scene.add(this.model)

      this.model.children[0].name = 'hachiko'
      this.decals.setTarget(this.model.children[0])

      // this.debug()
    } catch (error) {
      console.error({ error })
    }
  }

  update() {
    this.mirror?.update()

    // if (this.model) {
    //   this.model.traverse((child) => {
    //     if (child.isMesh) {
    //       child.material.uniforms.uTime.value = performance.now() * 1000
    //     }
    //   })
    // }
  }
}

export default Hachiko
