<script setup>
import { ref } from "vue"

const form = ref({ name: "" })

const submit = () => {
  console.log("Form submitted:", form.value)
}
</script>

<template>
  <div class="form-container">
    <h2>Name your horse!</h2>

    <form @submit.prevent="submit" id="form">
      <input type="text" placeholder="Pegasus" v-model="form.name" />
      <button type="submit">Name!</button>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  background-color: rgba(255, 145, 0, 0.415);
  border: 2px white solid;
  width: 27rem;
  border-radius: 2rem;
  padding: 2rem;
  margin: 2rem;
  position: absolute;
  top: 20%;
}

input {
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-family: "DynaPuff", system-ui;
}

button {
  background-color: orange;
  border-radius: 0.5rem;
  font-family: "DynaPuff", system-ui;
  padding: 0.5rem;
}

#form {
  display: flex;
  gap: 0.5rem;
}
</style>
