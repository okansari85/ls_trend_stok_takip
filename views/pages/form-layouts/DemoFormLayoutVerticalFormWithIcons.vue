<script lang="ts" setup>
const barcode = ref('')
</script>

<template>
  <VForm @submit.prevent>
    <VRow>
      <VCol
        cols="12"
        class="pb-2"
      >
        <VBtn
          type="submit"
          class="me-2"
          block
        >
          DEPO SEÇ
        </VBtn>
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="barcode"
          prepend-inner-icon="ri-barcode-line"
          label="Barkod Okut"
          placeholder="Barkod Okut"
        />
      </VCol>
    </VRow>
  </VForm>
</template>
