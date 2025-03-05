<script setup lang="ts">
import { ref } from "vue"

const form = ref({ name: "", location: "plains" })
const emit = defineEmits(["submitForm"])

const submitForm = () => {
  emit("submitForm", form.value)
}
</script>

<template>
  <div class="form-container">
    <h2>Name your horse!</h2>

    <form @submit.prevent="submitForm" id="form">
      <label for="name">Choose a horse name!</label>
      <input
        type="text"
        placeholder="Pegasus"
        v-model="form.name"
        name="name"
        id="name"
        maxlength="7"
        required
      />

      <label for="location">Choose a location!</label>
      <select
        id="location"
        name="location"
        v-model="form.location"
      >
        <option value="plains" selected>Plains</option>
        <option value="forest">Forest</option>
        <option value="night">Night</option>
        <option value="garden">Garden</option>
      </select>

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style scoped>
* {
  font-family: "DynaPuff", system-ui;
}

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

form {
  display: flex;
  flex-direction: column;
  width: 18rem;
}

select {
  padding: 0.5rem;
  border-radius: 0.5rem;
}

input {
  padding: 0.5rem;
  border-radius: 0.5rem;
}

button {
  background-color: orange;
  border-radius: 0.5rem;
  padding: 0.5rem;
}

#form {
  display: flex;
  gap: 1rem;
}

select {
  font-family: "DynaPuff", system-ui;
}
</style>
