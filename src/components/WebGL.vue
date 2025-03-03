<script setup lang="ts">
import { ref, onMounted } from "vue"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"

const threeContainer = ref<HTMLElement | null>(null)

let scene, camera, renderer, controls

onMounted(() => {
  setupScene()
  setupCamera()
  setupRenderer()
  setupControls()
  loadHDRI()
  loadModel()
  animate()
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

  camera.position.set(300, 1, 0)
}

function setupRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 0)
  if (threeContainer.value) {
    threeContainer.value.appendChild(renderer.domElement)
  }
}

function setupControls() {
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = false
  controls.minDistance = 100
  controls.maxDistance = 500
}

function loadHDRI() {
  const rgbeLoader = new RGBELoader()
  rgbeLoader.load("/models/rosendal_plains_2_4k.hdr", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = texture
    scene.background = null
  })
}

function loadModel() {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath("/draco/")

  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)

  loader.load(
    "/models/horse_stable.glb", // Modèle à charger
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
  const center = box.getCenter(new THREE.Vector3())
  model.position.sub(center) // Centre le modèle
}

function addLights() {
  scene.add(new THREE.AmbientLight(0xffffff, 0.3)) // Lumière ambiante
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5) // Lumière directionnelle
  directionalLight.position.set(1, 1, 1).normalize()
  scene.add(directionalLight)
}

function animate() {
  requestAnimationFrame(animate)
  controls.update() // Met à jour les contrôles de la caméra
  renderer.render(scene, camera) // Rendu de la scène avec la caméra
}
</script>

<template>
  <div ref="threeContainer"></div>
</template>
