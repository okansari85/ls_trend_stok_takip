<script setup lang="ts">
interface Props {
  mdlText?: string
  mdlBtnText?: string
  showbtn?: boolean
  fullscreen?: boolean
  status?: string
  toolbar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mdlText: 'Yeni Depo Ekle',
  mdlBtnText: 'Depo Ekle',
  showbtn: false,
  fullscreen: false,
  toolbar: true,
  status: '',
})

const emit = defineEmits(['clickedSave'])

const dialog = defineModel()

const newItem = () => {
  console.log('new item')
}

const saveItem = () => {
  emit('clickedSave')
}
</script>

<template>
  <VDialog
    v-model="dialog"
    :fullscreen="props.fullscreen"
    eager
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template
      v-if="props.showbtn"
      #activator="{ props: activatorProps }"
    >
      <VBtn
        color="primary"
        dark
        v-bind="activatorProps"
        @click="newItem"
      >
        {{ props.mdlBtnText }}
      </VBtn>
    </template>
    <VCard>
      <VToolbar
        v-show="toolbar"
        color="primary"
      >
        <VBtn
          icon
          @click="dialog = false"
        >
          <VIcon
            color="white"
            icon="ri-close-line"
            size="24"
          />
        </VBtn>
        <VToolbarTitle color="white">
          {{ props.mdlText }}
        </VToolbarTitle>
        <VSpacer />
        <VToolbarItems>
          <VBtn
            dark
            text
            @click="saveItem"
          >
            Kaydet
          </VBtn>
        </VToolbarItems>
      </VToolbar>
      <div>
        <slot />
      </div>
      <VDivider />
    </VCard>
  </VDialog>
</template>
