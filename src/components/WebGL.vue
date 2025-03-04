<script setup lang="ts">
import { ref, onMounted } from "vue"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import type { WebGLRenderer } from "three"
import { TextGeometry } from "three/addons/geometries/TextGeometry.js"
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { defineProps, watch } from "vue"

const props = defineProps<{ horseName: string; horseLocation: string }>()

const horseName = ref("")
const horseLocation = ref("")

let textFont: Font
let nameMesh: THREE.Mesh

watch(
  () => [props.horseName, props.horseLocation],
  ([newName, newLocation]) => {
    horseName.value = newName
    horseLocation.value = newLocation

    updateText(newName)
    loadHDRI(newLocation)
  }
)

const threeContainer = ref<HTMLElement | null>(null)

let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: WebGLRenderer,
  controls: OrbitControls

onMounted(() => {
  setupScene()
  setupCamera()
  setupRenderer()
  setupControls()
  loadHDRI()
  loadModel()
  animate()
  addPlane()
  addText()
  addLights()
})

function setupScene() {
  scene = new THREE.Scene()
}

function setupCamera() {
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  )
  camera.position.set(400, 50, -80)
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
  controls.maxDistance = 1500

  controls.maxPolarAngle = Math.PI / 2.1 // Bloque l'inclinaison en dessous du sol
  controls.minPolarAngle = Math.PI / 3 // Bloque l'inclinaison au dessus du cheval
}

function loadHDRI(location?: string) {
  const rgbeLoader = new RGBELoader()
  rgbeLoader.load(
    location
      ? `/models/background_${location}.hdr`
      : "/models/background_plains.hdr",
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

  loader.load("/models/horse_stable.glb", (gltf) => {
    const model = gltf.scene

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    centerModel(model)
    scene.add(model)
  })
}

function centerModel(model: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(model)
  const minY = box.min.y

  model.position.y -= minY
}

function addLights() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
  scene.add(ambientLight)

  const light = new THREE.DirectionalLight(0xffffff, 3)
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

  const helper = new THREE.CameraHelper(light.shadow.camera)
  scene.add(helper)
}

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

function addPlane() {
  const textureLoader = new THREE.TextureLoader()
  const grassTexture = textureLoader.load("/models/grass.jpg")
  const normalTexture = textureLoader.load("/models/grass_normal.png")

  grassTexture.wrapS = THREE.RepeatWrapping
  grassTexture.wrapT = THREE.RepeatWrapping
  grassTexture.repeat.set(7, 7)

  normalTexture.wrapS = THREE.RepeatWrapping
  normalTexture.wrapT = THREE.RepeatWrapping
  normalTexture.repeat.set(40, 40)

  const geometry = new THREE.RingGeometry(0, 5000, 24, 1)
  const material = new THREE.MeshStandardMaterial({
    map: grassTexture,
    normalMap: normalTexture,
    envMap: scene.environment,
    side: THREE.FrontSide,
    roughness: 1,
    metalness: 0.7,
    normalScale: new THREE.Vector2(0.25, 0.25),
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
</script>

<template>
  <div ref="threeContainer"></div>
</template>
