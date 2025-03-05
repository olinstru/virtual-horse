<script setup lang="ts">
import WebGL from "./components/WebGL.vue"
import UserForm from "./components/UserForm.vue"
import { ref } from "vue"

let horseName = ref("")
let horseLocation = ref("")

const handleSubmit = (formData: { name: string, location: string }) => {
  horseName.value = formData.name
  horseLocation.value = formData.location
}
</script>

<template>
  <div>
    <h1>My Virtual Horse</h1>
  </div>

  <UserForm @submitForm="handleSubmit" />
  <WebGL :horseName="horseName" :horseLocation="horseLocation"/>
</template>
