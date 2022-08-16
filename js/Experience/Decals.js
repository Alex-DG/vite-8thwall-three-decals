import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js'

import decalDiffuseSrc from '../../assets/textures/decals/decal-diffuse.png'
import decalNormalSrc from '../../assets/textures/decals/decal-normal.jpg'

class Decals {
  constructor(options) {
    this.scene = options.scene
    this.camera = options.camera
    this.canvas = options.canvas
    this.textureLoader = options.textureLoader

    this.decals = []
    this.intersects = []

    this.position = new THREE.Vector3()
    this.tapPosition = new THREE.Vector2()
    this.orientation = new THREE.Euler()
    this.size = new THREE.Vector3(10, 10, 10)
    this.raycaster = new THREE.Raycaster()

    this.intersection = {
      intersects: false,
      point: new THREE.Vector3(),
      normal: new THREE.Vector3(),
    }

    this.params = {
      minScale: 0.2,
      maxScale: 1,
      rotate: true,
    }

    this.bind()
    this.init()
  }

  bind() {
    this.removeDecals = this.removeDecals.bind(this)
    this.placeDecalsTouchHandler = this.placeDecalsTouchHandler.bind(this)
    this.shoot = this.shoot.bind(this)
  }

  async init() {
    try {
      const [decalDiffuse, decalNormal] = await Promise.all([
        this.textureLoader.loadAsync(decalDiffuseSrc),
        this.textureLoader.loadAsync(decalNormalSrc),
      ])

      this.decalMaterial = new THREE.MeshPhongMaterial({
        specular: 0x444444,
        map: decalDiffuse,
        normalMap: decalNormal,
        normalScale: new THREE.Vector2(1, 1),
        shininess: 30,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        wireframe: false,
      })

      // Events
      this.canvas.addEventListener(
        'touchstart',
        this.placeDecalsTouchHandler,
        true
      )
    } catch (error) {
      console.error({ error })
    }
  }

  shoot(intersect) {
    const position = intersect.point.clone()
    const eye = position.clone()
    eye.add(intersect.face.normal)

    const rotation = new THREE.Matrix4()
    rotation.lookAt(eye, position, THREE.Object3D.DefaultUp)
    const euler = new THREE.Euler()
    euler.setFromRotationMatrix(rotation)

    const { minScale, maxScale } = this.params
    const scale = minScale + Math.random() * (maxScale - minScale)
    this.size.set(scale, scale, scale)

    const decalGeometry = new DecalGeometry(
      intersect.object,
      intersect.point,
      euler,
      this.size
    )

    const material = this.decalMaterial.clone()
    material.color.setHex(Math.random() * 0xffffff)

    const decal = new THREE.Mesh(decalGeometry, material)
    decal.receiveShadow = true

    this.decals.push(decal)
    this.scene.add(decal)
  }

  placeDecalsTouchHandler(e) {
    if (this.mesh) {
      if (e.touches.length === 2) XR8.XrController.recenter()
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
        this.shoot(intersect)
      }
    }
  }

  setTarget(mesh) {
    this.mesh = mesh
  }

  removeDecals() {
    this.decals.forEach((d) => {
      this.scene.remove(d)
    })

    this.decals.length = 0
  }

  update() {}
}

export default Decals
