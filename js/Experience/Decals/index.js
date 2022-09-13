import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js'

import decalDiffuseSrc from '../../../assets/textures/decals/decal-diffuse.png'
import decalNormalSrc from '../../../assets/textures/decals/decal-normal.jpg'

import { getRandomArrayItem } from '../../utils/maths'

import DebugPane from '../Utils/Debug'

import { splashColorCodes } from './data'

import { gsap } from 'gsap'

class Decals {
  constructor(options) {
    this.scene = options.scene
    this.camera = options.camera
    this.uiCamera = options.uiCamera
    this.canvas = options.canvas
    this.textureLoader = options.textureLoader

    this.decals = []

    this.tapPosition = new THREE.Vector2()
    this.defaultSize = new THREE.Vector3(0, 0, 0)
    this.size = new THREE.Vector3(10, 10, 10)
    this.raycaster = new THREE.Raycaster()
    this.uiRaycaster = new THREE.Raycaster()

    this.params = {
      minScale: 2,
      maxScale: 3,
      rotate: true,
    }

    this.bind()
    this.init()
  }

  bind() {
    this.removeDecals = this.removeDecals.bind(this)
    this.placeDecalsTouchHandler = this.placeDecalsTouchHandler.bind(this)
    this.setDebug = this.setDebug.bind(this)
    this.shoot = this.shoot.bind(this)
  }

  async init() {
    try {
      const [decalDiffuse, decalNormal] = await Promise.all([
        this.textureLoader.loadAsync(decalDiffuseSrc),
        this.textureLoader.loadAsync(decalNormalSrc),
      ])
      this.decalMaterial = new THREE.MeshPhongMaterial({
        specular: '#ffffff',
        map: decalDiffuse,
        normalMap: decalNormal,
        normalScale: new THREE.Vector2(1, 1),
        shininess: 25,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        dithering: true,
        // side: THREE.FrontSide,
        precision: 'highp',
      })

      // Events
      this.canvas.addEventListener(
        'touchstart',
        this.placeDecalsTouchHandler,
        true
      )

      // this.setDebug()
    } catch (error) {
      console.error({ error })
    }
  }

  ////////////////////////////////////////////////////////////////////////////////

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
    // material.color.setHex(Math.random() * 0xffffff)
    const code = getRandomArrayItem(splashColorCodes)
    material.color = new THREE.Color(code)
    material.color.convertSRGBToLinear()
    material.needsUpdate = true

    const decal = new THREE.Mesh(decalGeometry, material)
    decal.receiveShadow = true

    this.decals.push(decal)
    this.scene.add(decal)

    if (this.toyGun) {
      const pos = this.toyGun.position.clone()
      gsap.fromTo(
        this.toyGun.position,
        {
          z: pos.z - 1,
        },
        {
          z: pos.z,
          duration: 1.5,
          ease: 'elastic',
        }
      )
    }

    // gsap.fromTo(
    //   decal.material,
    //   {
    //     opacity: 0.25,
    //   },
    //   {
    //     opacity: 1,
    //     duration: 0.1,
    //     ease: 'power3.out',
    //   }
    // )

    // if (position.y < 0) {
    //   gsap.fromTo(
    //     decal.scale,
    //     {
    //       x: 0.5,
    //     },
    //     {
    //       x: 1,
    //       duration: 0.08,
    //       ease: 'power3.out',
    //     }
    //   )
    // } else {
    //   gsap.fromTo(
    //     decal.scale,
    //     {
    //       y: 0.5,
    //     },
    //     {
    //       y: 1,
    //       duration: 0.12,
    //       ease: 'power3.out',
    //     }
    //   )
    // }
  }

  placeDecalsTouchHandler(e) {
    if (this.mesh && this.cursor) {
      if (e.touches.length === 2) XR8.XrController.recenter()
      if (e.touches.length > 2) return

      // calculate tap position in normalized device coordinates (-1 to +1) for both components.
      this.tapPosition.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1
      this.tapPosition.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1

      // Update the picking ray with the camera and tap position.
      this.raycaster.setFromCamera(this.tapPosition, this.camera)
      this.uiRaycaster.setFromCamera(this.tapPosition, this.uiCamera)

      // Raycast against the object.
      const intersects = this.raycaster.intersectObject(this.mesh)

      // Raycast against the cursor.
      const cursorIntersects = this.uiRaycaster.intersectObject(this.cursor)

      //  On tap cursor
      if (cursorIntersects[0]?.object?.name === 'cursor') {
        if (intersects.length > 0) {
          this.shoot(intersects[0])
        }
      }
    }
  }

  removeDecals() {
    this.decals.forEach((d) => {
      if (d) {
        d.geometry.dispose()
        d.material.dispose()

        this.scene.remove(d)
      }
    })

    this.decals.length = 0
  }

  ////////////////////////////////////////////////////////////////////////////////

  setCursor(c) {
    this.cursor = c
  }

  setToyGun(tg) {
    this.toyGun = tg
  }

  setDebug() {
    const options = {
      specular: {
        color: '#ffffff',
      },
    }

    const decalMaterial = this.decalMaterial

    /**
     * Callbacks
     */
    const onChangeShininess = (value) => {
      decalMaterial.shininess = value
      decalMaterial.needsUpdate = true
      this.decals?.forEach((d) => {
        if (d) {
          d.material.shininess = value
          d.material.needsUpdate = true
        }
      })
    }
    const onChangeSpecular = (value) => {
      decalMaterial.specular = new THREE.Color(value)
      decalMaterial.needsUpdate = true
      this.decals?.forEach((d) => {
        if (d) {
          d.material.specular = new THREE.Color(value)
          d.material.needsUpdate = true
        }
      })
    }
    const onChangeNormalScale = (value) => {
      decalMaterial.normalScale = value
      decalMaterial.needsUpdate = true
      this.decals?.forEach((d) => {
        if (d) {
          d.material.normalScale = value
          d.material.needsUpdate = true
        }
      })
    }

    /**
     * Material
     */
    DebugPane.addSlider(
      this.decalMaterial,
      'shininess',
      {
        min: 0,
        max: 100,
        step: 0.001,
      },
      onChangeShininess
    )
    DebugPane.addColorPicker(
      options.specular,
      'color',
      {
        label: 'specular',
      },
      onChangeSpecular
    )
    DebugPane.addSlider(
      this.decalMaterial,
      'normalScale',
      {
        x: {
          min: 0,
          max: 1,
          step: 0.0001,
        },
        y: {
          min: 0,
          max: 1,
          step: 0.0001,
        },
      },
      onChangeNormalScale
    )

    /**
     * Decal scale options
     */
    DebugPane.addSlider(this.params, 'minScale', {
      min: 0,
      max: 10,
      step: 0.001,
    })
    DebugPane.addSlider(this.params, 'maxScale', {
      min: 0,
      max: 10,
      step: 0.001,
    })

    /**
     * Remove button
     */
    const onRemoveDecals = () => this.removeDecals()
    DebugPane.addButton({ label: 'decals', title: 'Remove' }, onRemoveDecals)
  }

  setTarget(mesh) {
    this.mesh = mesh
  }

  ////////////////////////////////////////////////////////////////////////////////

  update() {}
}

export default Decals
