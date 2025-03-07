<script setup lang="ts">
import * as THREE from "three"
import type { WebGLRenderer } from "three"
import { ref, onMounted } from "vue"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import { TextGeometry } from "three/addons/geometries/TextGeometry.js"
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { defineProps, watch } from "vue"
import { EffectComposer, EffectPass, RenderPass } from "postprocessing"
import { BloomEffect } from "../WebGL/effects/bloomEffect"
import { gsap } from "gsap"

let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: WebGLRenderer,
  controls: OrbitControls,
  light: THREE.DirectionalLight,
  composer: EffectComposer

let textFont: Font
let nameMesh: THREE.Mesh
let horseSounds: THREE.Audio[] = []

const threeContainer = ref<HTMLElement | null>(null)
const horse = ref<THREE.Object3D | null>(null)

const props = defineProps<{
  horseName: string
  horseLocation: string
  sunHeight: number
}>()

const horseName = ref("")
const horseLocation = ref("")
const sunHeight = ref(140)

watch(
  () => [props.horseName],
  ([newName]) => {
    horseName.value = newName

    updateText(newName)
  }
)

watch(
  () => [props.horseLocation],
  ([newLocation]) => {
    horseLocation.value = newLocation

    loadHDRI(newLocation)
  }
)

watch(
  () => props.sunHeight,
  (newSunHeight) => {
    sunHeight.value = newSunHeight

    updateLight(newSunHeight)
  }
)

onMounted(() => {
  setupScene()
  setupCamera()
  setupRenderer()
  setupComposer()
  setupControls()
  loadHDRI()
  loadModel()
  animate()
  addPlane()
  addText()
  addLights()
  enableHelpers(false)
  addSounds()
  gsapEffect()
})

function setupScene() {
  scene = new THREE.Scene()
}

function enableHelpers(boolean: boolean) {
  if (!boolean) {
    return
  }
  const axesHelper = new THREE.AxesHelper(300)
  scene.add(axesHelper)

  const cameraHelper = new THREE.CameraHelper(light.shadow.camera)
  scene.add(cameraHelper)
}

function setupCamera() {
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  )
  camera.position.set(400, 50, -80) // X Y Z
}

function setupComposer() {
  composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(new EffectPass(camera, new BloomEffect()))
}

function setupRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.9

  if (threeContainer.value) {
    threeContainer.value.appendChild(renderer.domElement)
  }
}

function setupControls() {
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = true
  controls.minDistance = 200
  controls.maxDistance = 800

  controls.maxPolarAngle = Math.PI / 2.1 // Bloque l'inclinaison en dessous du sol
  controls.minPolarAngle = Math.PI / 3 // Bloque l'inclinaison au dessus du cheval
}

function loadHDRI(location?: string) {
  const rgbeLoader = new RGBELoader()
  rgbeLoader.load(
    location
      ? `/models/hdri/background_${location}.hdr`
      : "/models/hdri/background_plains.hdr",
    (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      scene.background = texture
      scene.environment = texture
    }
  )
}

function loadModel() {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath("/draco/")

  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)

  loader.load("/models/glb/horse_stable.glb", (gltf) => {
    const model = gltf.scene

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    centerModel(model)
    scene.add(model)

    horse.value = model // Store reference to the horse model

    // Enable click detection once the model is loaded
    window.addEventListener("click", onHorseClick)
  })
}

function centerModel(model: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(model)
  const minY = box.min.y

  model.position.y -= minY
}

function addLights() {
  light = new THREE.DirectionalLight(0xffffff, 5)
  light.position.set(100, 140, 140) // Avant-arrière X, haut-bas Y, et gauche-droite Z
  light.castShadow = true

  light.shadow.mapSize.width = 512
  light.shadow.mapSize.height = 512
  light.shadow.camera.near = 0
  light.shadow.camera.far = 500
  light.shadow.camera.left = -150
  light.shadow.camera.bottom = -150
  light.shadow.camera.right = 150
  light.shadow.camera.top = 150
  light.shadow.bias = -0.001

  light.lookAt(0, 0, 0)

  scene.add(light)
}

function updateLight(sunHeight: number) {
  if (light) {
    light.position.z = Math.cos(sunHeight) * 250
    light.position.y = Math.sin(sunHeight) * 250
  }
}

function animate() {
  requestAnimationFrame(animate)
  composer.render()
}

function addPlane() {
  const textureLoader = new THREE.TextureLoader()
  const grassTexture = textureLoader.load("/models/textures/grass.jpg")
  const normalTexture = textureLoader.load("/models/textures/grass_normal.png")

  grassTexture.wrapS = THREE.RepeatWrapping
  grassTexture.wrapT = THREE.RepeatWrapping
  grassTexture.repeat.set(7, 7)
  grassTexture.colorSpace = THREE.SRGBColorSpace

  normalTexture.wrapS = THREE.RepeatWrapping
  normalTexture.wrapT = THREE.RepeatWrapping
  normalTexture.repeat.set(40, 40)

  const geometry = new THREE.RingGeometry(0, 10000, 24, 1)
  const material = new THREE.MeshStandardMaterial({
    map: grassTexture,
    normalMap: normalTexture,
    envMap: scene.environment,
    side: THREE.FrontSide,
    roughness: 0.9,
    normalScale: new THREE.Vector2(0.3, 0.3),
    color: new THREE.Color().setHSL(0.2, 0.35, 0.35),
  })

  const plane = new THREE.Mesh(geometry, material)
  plane.rotation.x = -Math.PI / 2
  plane.position.y = -1
  plane.receiveShadow = true

  scene.add(plane)
}

function addText(text: string = "Choupi") {
  const loader = new FontLoader()

  loader.load("/fonts/DynaPuff-Medium_Regular.json", function (font) {
    textFont = font
    const geometry = new TextGeometry(text, {
      font: font,
      size: 10,
      depth: 1,
      curveSegments: 12,
      bevelThickness: 1,
      bevelSize: 0.5,
      bevelOffset: 0,
      bevelSegments: 3,
    })

    const material = new THREE.MeshStandardMaterial({ color: 0xffffff }) // Blanc
    nameMesh = new THREE.Mesh(geometry, material)

    nameMesh.position.set(84, 50, 70) // Avant-arrière X, haut-bas Y, et gauche-droite Z
    nameMesh.rotation.set(0, 900, 0)

    scene.add(nameMesh)
  })
}

function updateText(text: string) {
  if (nameMesh) {
    nameMesh.geometry.dispose()

    const newGeometry = new TextGeometry(text, {
      font: textFont,
      size: 10,
      depth: 1,
      curveSegments: 12,
      bevelThickness: 1,
      bevelSize: 0.5,
      bevelOffset: 0,
      bevelSegments: 3,
    })

    nameMesh.geometry = newGeometry
  }
}

function addSounds() {
  const listener = new THREE.AudioListener()
  camera.add(listener)

  const audioLoader = new THREE.AudioLoader()
  const soundFiles = [
    "/audios/sounds/horse-neigh.mp3",
    "/audios/sounds/horse-neigh-2.mp3",
    "/audios/sounds/horse-snort.mp3",
  ]

  horseSounds = soundFiles.map((file) => {
    const sound = new THREE.Audio(listener)
    audioLoader.load(file, (buffer) => {
      sound.setBuffer(buffer)
      sound.setLoop(false)
      sound.setVolume(0.8)
    })
    return sound
  })
}

const onHorseClick = (event: MouseEvent) => {
  if (!horse.value || horseSounds.length === 0) return

  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(horse.value, true)

  if (intersects.length > 0) {
    horseSounds.forEach((sound) => {
      if (sound.isPlaying) sound.stop()
    })

    const randomSound =
      horseSounds[Math.floor(Math.random() * horseSounds.length)]
    randomSound.play()
  }
}

function gsapEffect() {
  gsap.from(camera.position, {
    duration: 3,
    x: 1000,
    y: 1000,
    z: 1000, 
    ease: "power3.out", 
    onComplete: () => {
      camera.position.set(400, 50, -80)
    },
  })
}
</script>

<template>
  <div ref="threeContainer"></div>
</template>
