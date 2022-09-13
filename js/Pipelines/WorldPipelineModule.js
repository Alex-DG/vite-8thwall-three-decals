import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// import Dummy from '../Experience/Dummy'
// import HachikoFlowers from '../Experience/HachikoFlowers'
// import Shoe from '../Experience/Shoe'
// import ParticleSystem from '../Experience/ParticleSystem'
// import SurfaceSampler from '../Experience/SurfaceSampler'
import Decals from '../Experience/Decals'
import Hachiko from '../Experience/Hachiko'

import LoadingManager from '../Experience/Utils/LoadingManager'
import ToyGun from '../Experience/ToyGun'

export const initWorldPipelineModule = () => {
  // let dummy
  // let particleSystem
  // let shoe
  // let hachiko
  // let hachikoFlowers
  let decals
  let toyGun
  // let surface

  const DRACO_DECODER_PATH =
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/'

  const init = () => {
    const { scene, uiScene, canvas, camera, uiCamera } = XR8.Threejs.xrScene()

    // const enableGimbalBtn = document.querySelector('.pistol-btn')
    // enableGimbalBtn.addEventListener('click', () => {
    //   alert('yoyo')
    // })

    /*-----------------------------------------------------------*/

    // Loaders
    const gltfLoader = new GLTFLoader(LoadingManager)
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH)
    gltfLoader.setDRACOLoader(dracoLoader)

    const textureLoader = new THREE.TextureLoader(LoadingManager)

    /*-----------------------------------------------------------*/

    // Lights
    // scene.add(new THREE.AmbientLight(0x443333))
    scene.add(new THREE.AmbientLight(0xffffff))

    const dirLight1 = new THREE.DirectionalLight(0xffddcc, 1)
    dirLight1.position.set(1, 0.75, 0.5)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0xccccff, 1)
    dirLight2.position.set(-1, 0.75, -0.5)
    scene.add(dirLight2)

    /*-----------------------------------------------------------*/

    // Objects
    // dummy = new Dummy({ scene, decals })
    // particleSystem = new ParticleSystem({ scene, count: 1000 })
    decals = new Decals({ scene, textureLoader, canvas, camera, uiCamera })
    // surface = new SurfaceSampler({ scene })
    // shoe = new Shoe({ scene, gltfLoader, decals })
    // hachikoFlowers = new HachikoFlowers({
    //   scene,
    //   gltfLoader,
    //   decals,
    //   canvas,
    //   camera,
    //   surface,
    // })

    toyGun = new ToyGun({
      scene,
      uiScene,
      gltfLoader,
      camera,
      textureLoader,
      decals,
    })

    hachiko = new Hachiko({
      scene,
      gltfLoader,
      decals,
    })

    /*-----------------------------------------------------------*/

    // Progress
    LoadingManager.onProgress = (_, loaded, total) => {
      const progress = (loaded / total) * 100
      console.log('⏳', `${progress}%`)
      if (progress >= 100) console.log('✅', 'World ready')
    }
  }

  const updateWorld = () => {
    // dummy?.update()

    // particleSystem?.update()

    // surface?.update()

    decals?.update()

    // shoe?.update()

    // hachikoFlowers?.update()
  }

  return {
    name: 'world',

    onStart: () => init(),

    onUpdate: () => updateWorld(),
  }
}
