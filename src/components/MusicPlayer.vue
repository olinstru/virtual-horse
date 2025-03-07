<script setup>
import { ref } from "vue"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

const isPlaying = ref(false)
const audio = new Audio("/audios/music/nature-walk.mp3")

audio.onended = () => {
  isPlaying.value = false
}

const togglePlay = () => {
  if (isPlaying.value) {
    audio.pause()
    audio.currentTime = 0
  } else {
    audio.play()
  }
  isPlaying.value = !isPlaying.value
}
</script>

<template>
  <div class="music-player">
    <button @click="togglePlay">
      <i v-if="!isPlaying" class="fa-solid fa-circle-play"></i>
      <i v-else class="fa-solid fa-circle-pause"></i>
      {{ isPlaying ? " Stop" : " Play" }}
    </button>
  </div>
</template>

<style scoped>
.music-player {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

button {
  padding: 0.8rem;
  border-radius: 1rem;
  border: 2px solid var(--border-color);
  color: var(--text-color);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
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
</style>
