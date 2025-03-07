<script setup lang="ts">
import { ref } from "vue"
import type { SceneConfig } from "../interfaces/scene-config.interface"

const form = ref<SceneConfig>({
  name: "",
  location: "plains",
  sunHeight: 3.14 / 2,
})

const emit = defineEmits(["submitForm", "updateLocation", "updateSunHeight"])

const submitForm = () => {
  emit("submitForm", form.value)
}

const updateLocation = () => {
  emit("updateLocation", form.value.location)
}

const updateSunHeight = () => {
  form.value.sunHeight = Number(form.value.sunHeight)
  emit("updateSunHeight", form.value.sunHeight)
}
</script>
<template>
  <div class="form-container">
    <h2>Personalise your horse!</h2>

    <form @submit.prevent="submitForm" id="form">
      <div class="form-group">
        <label for="name"
          >Choose a horse name! <small> (7 letters max)</small>
        </label>
        <div id="horse-name">
          <input
            type="text"
            placeholder="Pegasus"
            v-model="form.name"
            name="name"
            id="name"
            maxlength="7"
            required
          />
          <button type="submit">Change name</button>
        </div>
      </div>
    </form>
    <div class="form-group">
      <label for="location">Choose a location!</label>
      <select
        id="location"
        name="location"
        v-model="form.location"
        @change="updateLocation"
      >
        <option value="plains" selected>Plains</option>
        <option value="forest">Forest</option>
        <option value="night">Night</option>
      </select>
    </div>

    <div class="form-group">
      <label for="timeOfDay">Change the lighting!</label>
      <input
        name="sunHeight"
        type="range"
        v-model="form.sunHeight"
        min="0"
        max="3.14"
        step="0.01"
        @input="updateSunHeight"
      />
    </div>
  </div>
</template>

<style scoped>
.form-container {
  background-color: var(--light-color-transparent);
  border: 2px solid var(--light-color);
  width: 30rem;
  border-radius: 1.5rem;
  padding: 2.5rem;
  margin: 2rem;
  position: absolute;
  top: 20%;
  box-shadow: 0 4px 12px var(--border-color);
  transition: transform 0.3s ease-in-out;
}

.form-container:hover {
  transform: scale(1.05);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 5px var(--border-color);
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

label {
  font-size: 1.2rem;
}

input,
select,
button {
  padding: 0.8rem;
  border-radius: 1rem;
  border: 2px solid var(--border-color);
  color: var(--text-color);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

input:focus,
select:focus,
button:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 8px var(--border-color);
}

input::placeholder {
  color: var(--secondary-color);
}

button {
  background-color: var(--primary-color);
  color: var(--light-color);
  cursor: pointer;
}

button:hover {
  background-color: var(--secondary-color);
  transform: scale(1.05);
}

#horse-name {
  display: flex;
  gap: 1rem;
}

input[type="range"] {
  background: var(--primary-color);
  border-radius: 10px;
  height: 16px;
  -webkit-appearance: none;
  appearance: none;
}

input[type="range"]::-webkit-slider-runnable-track {
  height: 16px;
  border-radius: 10px;
  background: var(--secondary-color);
}

input[type="range"]::-webkit-slider-thumb {
  width: 1rem;
  height: 1rem;
  border-radius: 100%;
  -webkit-appearance: none;
  background: var(--light-color);
}
</style>
