<script setup lang="ts">
const dialog = defineModel()
</script>

<template>
  <VDialog
    v-model="dialog"
    max-width="320"
    persistent
  >
    <VList
      class="py-2"
      color="primary"
      elevation="12"
      rounded="lg"
    >
      <VListItem
        prepend-icon="$vuetify-outline"
        title="Refreshing Application..."
      >
        <template #prepend>
          <div class="pe-4">
            <VIcon
              color="primary"
              size="x-large"
            />
          </div>
        </template>

        <template #append>
          <VProgressCircular
            color="primary"
            indeterminate="disable-shrink"
            size="16"
            width="2"
          />
        </template>
      </VListItem>
    </VList>
  </VDialog>
</template>
