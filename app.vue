<script setup lang="ts">
const { isMobile } = useDevice()
if (isMobile)
  console.log('mobile')

// configStore.appContentLayoutNav = 'vertical'
</script>

<template>
  <VApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </VApp>
</template>
