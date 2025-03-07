<script setup>
import { ref } from "vue"

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
    <button @click="togglePlay" class="button">
      <i v-if="!isPlaying" class="fa-solid fa-circle-play"></i>
      <i v-else class="fa-solid fa-circle-pause"></i>
      {{ isPlaying ? " Stop" : " Play" }}
    </button>
  </div>
</template>