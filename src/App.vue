<script setup lang="ts">
import WebGL from "./components/WebGL.vue"
import { ref } from "vue"
import type { SceneConfig } from "./interfaces/scene-config.interface"
import UserForm from "./components/UserForm.vue"
import MusicPlayer from "./components/MusicPlayer.vue"

let horseName = ref("")
let horseLocation = ref("")
let sunHeight = ref(0)
let isFormVisible = ref(true)

const handleSubmit = (formData: SceneConfig) => {
  horseName.value = formData.name
}

const handleSunHeightChange = (newHeight: number) => {
  sunHeight.value = newHeight
}

const handleLocationChange = (newLocation: string) => {
  horseLocation.value = newLocation
}

const closeFormHandler = () => {
  isFormVisible.value = false
}

const openForm = () => {
  isFormVisible.value = true
}
</script>

<template>
  <div>
    <h1>My Virtual Horse</h1>
  </div>

  <button
    type="button"
    @click="openForm"
    id="open-button"
    v-if="!isFormVisible"
  >
    <i class="fa-solid fa-compass"></i> Open
  </button>
  <MusicPlayer id="music-player" />
  <UserForm
    v-if="isFormVisible"
    @closeForm="closeFormHandler"
    @submitForm="handleSubmit"
    @updateSunHeight="handleSunHeightChange"
    @updateLocation="handleLocationChange"
  />
  <WebGL
    :horseName="horseName"
    :horseLocation="horseLocation"
    :sunHeight="sunHeight"
  />
</template>

<style>
#music-player {
  position: absolute;
  top: 0;
  right: 0;
}

#open-button {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
