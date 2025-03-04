<script setup lang="ts">
import { ref, onMounted } from "vue"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import type { WebGLRenderer } from "three"

const threeContainer = ref<HTMLElement | null>(null)

let scene: THREE.Scene,
  camera: THREE.Camera,
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
})

function setupScene() {
  scene = new THREE.Scene()
}

function setupCamera() {
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(400, 50, -80)
}

function setupRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)

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
  controls.maxDistance = 500

  controls.maxPolarAngle = Math.PI / 2.1 // Bloque l'inclinaison en dessous du sol
  controls.minPolarAngle = Math.PI / 3 // Bloque l'inclinaison au dessus du cheval
}

function loadHDRI() {
  const rgbeLoader = new RGBELoader()
  rgbeLoader.load("/models/background.hdr", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = texture
    scene.background = texture
  })
}

function loadModel() {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath("/draco/")

  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)

  loader.load(
    "/models/horse_stable.glb",
    (gltf) => {
      const model = gltf.scene

      centerModel(model)
      scene.add(model)
      addLights()
    },
    (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
    (error) => console.error("An error occurred", error)
  )
}

function centerModel(model: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(model)
  const minY = box.min.y

  model.position.y -= minY
}

function addLights() {
  scene.add(new THREE.AmbientLight(0xffffff, 0.3)) // Lumière ambiante
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5) // Lumière directionnelle
  directionalLight.position.set(1, 1, 1).normalize()
  scene.add(directionalLight)
}

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

function addPlane() {
  const textureLoader = new THREE.TextureLoader()
  const grassTexture = textureLoader.load("/models/grass.jpg")

  grassTexture.wrapS = THREE.RepeatWrapping
  grassTexture.wrapT = THREE.RepeatWrapping
  grassTexture.repeat.set(10, 10)

  const geometry = new THREE.PlaneGeometry(3000, 3000)
  const material = new THREE.MeshStandardMaterial({
    map: grassTexture,
    normalMap: grassTexture,
    envMap: scene.environment,
  })

  const plane = new THREE.Mesh(geometry, material)
  plane.rotation.x = -Math.PI / 2
  plane.position.y = -1

  scene.add(plane)
}
</script>

<template>
  <div ref="threeContainer"></div>
</template>
