<script setup lang="ts">
import { ref } from 'vue'

const depolar = useDepolarStore()

await useAsyncData('depo', () => depolar.getAllDepos())

const productValid = ref(false)
const productForm = ref()

const form = ref({
  name: '',
  depo_id: null,
  id: null,
  raf_name: '',
})

const selectRules = [
  (v: string) => !!v || 'Depo Seçimi Gereklidir.',
]
</script>

<template>
  <VForm
    ref="productForm"
    v-model="productValid"
    lazy-validation
    @submit.prevent="() => {}"
  >
    <VContainer fluid>
      <VRow />
      <!-- depo adi  -->
      <VCol
        cols="12"
        md="12"
      >
        <VSelect
          v-model="form.depo_id"
          label="Depo Seçiniz"
          placeholder="Depo Seçiniz"
          :items="depolar.depo"
          item-title="name"
          item-value="id"
          :rules="selectRules"
          required
        />
      </VCol>
      <!-- raf adi  -->
      <VCol
        cols="12"
        md="12"
      />
      <VAlert
        v-if="depolar.error !== ''"
        type="error"
        class="mb-3"
      >
        {{ depolar.error }}
      </VAlert>
    </VContainer>
  </VForm>
</template>
