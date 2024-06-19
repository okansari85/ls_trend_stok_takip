<script setup lang="ts">
interface Props {
  deger?: string
  item?: number
  title?: string
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  deger: '',
  item: 0,
  title: '',
  message: '',
})

const emit = defineEmits(['clickedAgree'])

const dialog = defineModel()

const agreed = (a, b) => {
  emit('clickedAgree', { deger: a, item: b })
}
</script>

<template>
  <VDialog
    v-model="dialog"
    max-width="400"
    persistent
  >
    <VCard
      prepend-icon="ri-error-warning-line"
      :text="props.message"
      :title="props.title"
    >
      <template #actions>
        <VSpacer />

        <VBtn @click="dialog = false">
          Hayır
        </VBtn>

        <VBtn @click="agreed(props.deger, props.item)">
          Evet Eminim
        </VBtn>
      </template>
    </VCard>
  </VDialog>
</template>
