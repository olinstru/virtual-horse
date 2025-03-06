<script setup lang="ts">
import WebGL from "./components/WebGL.vue"
import { ref } from "vue"
import type { SceneConfig } from "./interfaces/scene-config.interface"
import UserForm from "./components/UserForm.vue"

let horseName = ref("")
let horseLocation = ref("")
let sunHeight = ref(0)

const handleSubmit = (formData: SceneConfig) => {
  horseName.value = formData.name
}

const handleSunHeightChange = (newHeight: number) => {
  sunHeight.value = newHeight
}

const handleLocationChange = (newLocation: string) => {
  horseLocation.value = newLocation
}
</script>

<template>
  <div>
    <h1>My Virtual Horse</h1>
  </div>

  <UserForm
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
