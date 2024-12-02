<script setup>
import ProgressSteps from '../components/ProgressSteps.vue'
</script>

<template>
  <progress-steps :current-step="1" />
</template>

<script>
export default {
  components: {
    ProgressSteps
  }
}
</script>