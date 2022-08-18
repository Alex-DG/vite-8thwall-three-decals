import modelSrc from '../../assets/models/hachiko.glb' // dog
import flowerSrc from '../../assets/models/sunflower.glb' // flower

import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'

class HachikoFlowers {
  constructor(options) {
    this.scene = options.scene
    this.surface = options.surface
    this.camera = options.camera
    this.canvas = options.canvas
    this.count = options.count || 1000
    this.gltfLoader = options.gltfLoader

    this.isReady = false

    this.tapPosition = new THREE.Vector2()
    this.raycaster = new THREE.Raycaster()

    // Mesh Surface Sampler / Instanced Mesh - Setup
    this.ages = new Float32Array(this.count)
    this.growthSpeed = new Float32Array(this.count) // each sunflower has a different growth speed
    this.scales = new Float32Array(this.count)
    this.dummy = new THREE.Object3D()

    this.currentPoint = null
    this.position = new THREE.Vector3()
    this.positions = []
    this.normal = new THREE.Vector3()
    this.normals = []
    this.scale = new THREE.Vector3()

    this.bind()
    this.init()
  }

  bind() {
    this.onTouchScreen = this.onTouchScreen.bind(this)
  }

  setSunflower(sunflowerModel) {
    if (sunflowerModel) {
      this.iterations = 0

      console.log({ sunflowerModel })

      sunflowerModel.scene.traverse((child) => {
        if (child.isMesh) {
          this.iterations++

          child.castShadow = true
          child.receiveShadow = true
          child.geometry.computeVertexNormals() // Computes vertex normals by averaging face normals https://threejs.org/docs/#api/en/core/BufferGeometry.computeVertexNormals
        }
      })

      this.sunflower = sunflowerModel.scene.children[0].children[0].children[0]

      const material = this.sunflower.material
      const map = material.map

      material.emissive = new THREE.Color('pink')
      material.emissiveIntensity = 0.8
      material.emissiveMap = map
      material.color.convertSRGBToLinear()
      map.encoding = THREE.sRGBEncoding

      const scale = 0.0025
      this.sunflower.geometry.scale(scale, scale, scale) // can be done with blender 1st, to optimise the code!
    }
  }

  setMain(mainModel) {
    if (mainModel) {
      let objectGeometries = []

      this.iterations = 0

      this.model = mainModel

      this.model.scene.traverse((child) => {
        if (child.isMesh) {
          this.iterations++

          child.castShadow = true
          child.receiveShadow = true
          child.geometry.computeVertexNormals() // Computes vertex normals by averaging face normals https://threejs.org/docs/#api/en/core/BufferGeometry.computeVertexNormals

          // if (this.iterations % 2 === 0) {
          // child.material = new THREE.MeshStandardMaterial({
          //   color: 0x00ffff,
          //   wireframe: true,
          // })
          // }

          objectGeometries.push(child.geometry)
        }
      })

      const mergedGeometries = mergeBufferGeometries(objectGeometries)
      const mergedGeometriesMat = new THREE.MeshNormalMaterial()
      this.mergedGeometriesMesh = new THREE.Mesh(
        mergedGeometries,
        mergedGeometriesMat
      )

      this.mesh = this.model.scene.children[0]

      // this.scene.add(mergedGeometriesMesh)
      this.scene.add(this.model.scene)
    }
  }

  setInstancedMesh() {
    this.sampler = new MeshSurfaceSampler(this.mergedGeometriesMesh)
      .setWeightAttribute('uv')
      .build()

    const geometry = this.sunflower.geometry //new THREE.BoxBufferGeometry(0.01, 0.01, 1)
    const material = this.sunflower.material //new THREE.MeshStandardMaterial({ color: 0x00ff00 })

    this.flowers = new THREE.InstancedMesh(geometry, material, this.count)
    this.flowers.receiveShadow = true
    this.flowers.castShadow = true

    for (let i = 0; i < this.count; i++) {
      this.ages[i] = 0 //Math.random()
      this.scales[i] = this.ages[i] //scaleCurve(this.ages[i])
      this.growthSpeed[i] = 0

      // Resample particle
      this.sampler.sample(this.position, this.normal)
      this.normal.add(this.position)

      this.dummy.position.copy(this.position)
      this.dummy.scale.set(this.scales[i], this.scales[i], this.scales[i])
      this.dummy.lookAt(this.normal)
      this.dummy.updateMatrix()

      this.flowers.setMatrixAt(i, this.dummy.matrix)
      this.positions.push(this.position.clone())
      this.normals.push(this.normal.clone())
    }

    this.flowers.instanceMatrix.needsUpdate = true

    this.scene.add(this.flowers)
  }

  onTouchScreen(e) {
    if (e.touches.length > 2) return

    // calculate tap position in normalized device coordinates (-1 to +1) for both components.
    this.tapPosition.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1
    this.tapPosition.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1

    // Update the picking ray with the camera and tap position.
    this.raycaster.setFromCamera(this.tapPosition, this.camera)

    // Raycast against the object.
    const intersects = this.raycaster.intersectObject(this.mesh)

    console.log('🙈', 'intersects?')

    if (intersects.length > 0) {
      const intersect = intersects[0]

      console.log('🐵✨', { intersect })

      if (!this.currentPoint) {
        this.currentPoint = new THREE.Vector3()
      }

      this.currentPoint.copy(intersect.point)
    }
  }

  async init() {
    try {
      const [mainModel, sunflowerModel] = await Promise.all([
        this.gltfLoader.loadAsync(modelSrc),
        this.gltfLoader.loadAsync(flowerSrc),
      ])

      this.setMain(mainModel)
      this.setSunflower(sunflowerModel)
      this.setInstancedMesh()

      // Events
      this.canvas.addEventListener('touchstart', this.onTouchScreen)
      this.surface.init(this.model)
      this.isReady = true
    } catch (error) {
      console.error({ error })
    }
  }

  rescaleSunflower(index) {
    this.dummy.position.copy(this.positions[index])

    const distance = this.currentPoint.distanceTo(this.positions[index])

    if (distance < 0.5) {
      this.growthSpeed[index] += 0.0025
    } else {
      this.growthSpeed[index] *= 0.9
    }

    this.scales[index] += this.growthSpeed[index]
    this.scales[index] = Math.min(1, this.scales[index])

    const scale = this.scales[index]
    this.dummy.scale.set(scale, scale, scale)
    this.dummy.lookAt(this.normals[index])
    this.dummy.updateMatrix()

    this.flowers.setMatrixAt(index, this.dummy.matrix)
  }

  updateSunflowers() {
    if (this.currentPoint) {
      for (let index = 0; index < this.count; index++) {
        this.rescaleSunflower(index)
      }
      this.flowers.instanceMatrix.needsUpdate = true
    }
  }

  update() {
    if (this.isReady) {
      this.updateSunflowers()
    }
  }
}

export default HachikoFlowers
