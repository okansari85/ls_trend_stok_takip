<script setup lang="ts">
import { defineEmits, ref } from 'vue'

const form = defineProps<{
  modelValue: {
    depo_id: number | null
    id: number | null
    raf_id: string
    product_code: string
    product_desc: string
    stock: number
    type: string
    adet: string }
  depolar: Array<{
    id: number
    name: string
  }
  >
  raflar: Array<{
    id: number
    name: string
  }>
  disabled: boolean | true
}>()

const emit = defineEmits(['depoChange'])
const productValid = ref(false)
const productForm = ref()
const internalFormData = ref({ ...form.modelValue })

const textRules = [
  (v: string) => !!v || 'Raf Adı Gereklidir.',
]

const selectRules = [
  (v: string) => !!v || 'Depo Seçimi Gereklidir.',
]

const handleChange = (newValue: any) => {
  internalFormData.value.raf_id = ''
  emit('depoChange', newValue)
}

const clearForm = () => {
  // Clear form data
  internalFormData.value.raf_id = ''
  internalFormData.value.product_desc = ''
}

const validate = () => {
  productForm.value?.validate()

  return !!(productValid.value)
}

watch(() => form.modelValue, newVal => {
  internalFormData.value = { ...newVal }
}, { deep: true })

defineExpose({
  clearForm,
  validate,
  internalFormData,
})
</script>

<template>
  <VForm
    ref="productForm"
    v-model="productValid"
    lazy-validation
    @submit.prevent="() => {}"
  >
    <VContainer
      fluid
      style="padding-inline: 0 0;"
    >
      <VRow>
        <!-- depo adi  -->
        <VCol
          cols="12"
          md="12"
        >
          <VAutocomplete
            v-model="internalFormData.depo_id"
            label="Depo Seçiniz"
            placeholder="Depo Seçiniz"
            :items="depolar"
            item-title="name"
            item-value="id"
            :rules="[
              (v: string) => !!v || 'Depo Seçimi Gereklidir.',
            ]"
            required
            auto-select-first
            :disabled="form.disabled"
            @update:model-value="handleChange"
          />
        </VCol>
        <VCol
          cols="12"
          md="12"
        >
          <VTextField
            v-model="internalFormData.product_code"
            prepend-inner-icon="ri-barcode-line"
            label="Ürün Kodu"
            placeholder="Ürün Kodu"
            :disabled="form.disabled"
            required
            :rules="[
              (v: string) => !!v || 'Ürün Kodu Gereklidir.',
            ]"
          />
        </VCol>
        <VCol
          cols="12"
          md="12"
        >
          <VAutocomplete
            v-model="internalFormData.raf_id"
            auto-select-first
            :items="raflar"
            label="Raf Seçiniz"
            item-value="id"
            item-title="name"
            required
            :rules="[
              (v: string) => !!v || 'Raf Seçimi Gereklidir.',
            ]"
          />
        </VCol>
        <VCol
          cols="12"
          md="12"
        >
          <VTextField
            v-model="internalFormData.product_desc"
            prepend-inner-icon="ri-water-flash-fill"
            label="Ürün Kısa Açıklaması"
            placeholder="Ürün Kısa Açıklaması"
            :rules="[
              (v: string) => !!v || 'Ürün Açıklaması Gereklidir.',
            ]"
          />
        </VCol>
        <VCol
          cols="12"
          md="12"
        >
          <VTextField
            v-model="internalFormData.stock"
            prepend-inner-icon="ri-add-fill"
            label="Başlangıç Stok"
            placeholder="Başlangıç Stok"
          />
        </VCol>

        <!-- raf adi  -->
      </VRow>
    </VContainer>
  </VForm>
</template>
