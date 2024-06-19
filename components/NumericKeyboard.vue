<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  numbers: {
    type: Array,
    default: () => ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  },
})

const emit = defineEmits(['input', 'backspace', 'clear'])

const emitInput = value => {
  emit('input', value)
}

const emitBackspace = () => {
  emit('backspace')
}

const emitClear = () => {
  emit('clear')
}
</script>

<template>
  <VRow>
    <VCol
      v-for="number in numbers"
      :key="number"
      cols="4"

      class="pa-1 pt-1 pb-1 ma-0"
    >
      <VBtn

        height="50"
        block
        @click="() => emitInput(number)"
      >
        {{ number }}
      </VBtn>
    </VCol>
    <VCol
      cols="4"
      class="pa-1 pt-1 pb-1 ma-0"
    >
      <VBtn
        block
        height="50"
        color="secondary"
        variant="outlined"
        @click="emitClear"
      >
        Clear
      </VBtn>
    </VCol>
    <VCol
      cols="4"
      class="pa-1 pt-1 pb-1 ma-0"
    >
      <VBtn

        block
        height="50"
        color="secondary"
        variant="outlined"
        @click="emitBackspace"
      >
        <VIcon icon="ri-arrow-left-s-line" />
      </VBtn>
    </VCol>
  </VRow>
</template>

<style scoped>
.v-btn {
  block-size: 100%;
  inline-size: 100%;
}
</style>
