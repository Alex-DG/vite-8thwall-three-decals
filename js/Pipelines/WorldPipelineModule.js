import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

import Dummy from '../Experience/Dummy'
import Hachiko from '../Experience/Hachiko'
import ParticleSystem from '../Experience/ParticleSystem'
import Decals from '../Experience/Decals'

import LoadingManager from '../Experience/Utils/LoadingManager'

export const initWorldPipelineModule = () => {
  let dummy
  let particleSystem
  let hachiko
  let decals

  const DRACO_DECODER_PATH =
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/'

  const init = () => {
    const { scene, canvas, camera } = XR8.Threejs.xrScene()

    /*-----------------------------------------------------------*/

    // Loaders
    const gltfLoader = new GLTFLoader(LoadingManager)
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH)
    gltfLoader.setDRACOLoader(dracoLoader)

    const textureLoader = new THREE.TextureLoader(LoadingManager)

    /*-----------------------------------------------------------*/

    // Lights
    scene.add(new THREE.AmbientLight(0x443333))

    const dirLight1 = new THREE.DirectionalLight(0xffddcc, 1)
    dirLight1.position.set(1, 0.75, 0.5)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0xccccff, 1)
    dirLight2.position.set(-1, 0.75, -0.5)
    scene.add(dirLight2)

    /*-----------------------------------------------------------*/

    // Objects
    particleSystem = new ParticleSystem({ scene, count: 600 })
    decals = new Decals({ scene, textureLoader, canvas, camera })
    // dummy = new Dummy({ scene, decals })
    hachiko = new Hachiko({ scene, gltfLoader, decals })

    /*-----------------------------------------------------------*/

    // Progress
    LoadingManager.onProgress = (_, loaded, total) => {
      const progress = (loaded / total) * 100
      console.log('⏳', `${progress}%`)
      if (progress >= 100) console.log('✅', 'World ready')
    }
  }

  const updateWorld = () => {
    dummy?.update()
    particleSystem?.update()
    decals?.update()
    hachiko?.update()
  }

  return {
    name: 'world',

    onStart: () => init(),

    onUpdate: () => updateWorld(),
  }
}
