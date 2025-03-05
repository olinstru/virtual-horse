<script setup lang="ts">
import WebGL from "./components/WebGL.vue"
import UserForm from "./components/UserForm.vue"
import { ref } from "vue"

let horseName = ref("")

const handleSubmit = (formData: { name: string }) => {
  console.log(formData.name)
  horseName.value = formData.name
}
</script>

<template>
  <div>
    <h1>My Virtual Horse</h1>
  </div>

  <UserForm @submitForm="handleSubmit" />
  <WebGL :horseName="horseName" />
</template>
