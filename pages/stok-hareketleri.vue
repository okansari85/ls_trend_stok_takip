<!-- eslint-disable -->
<script lang="ts" setup>
import StokGirisi from '@/views/pages/account-settings/StokGirisi.vue';
import StokCikisi from '@/views/pages/account-settings/StokCikisi.vue';
import { useRoute } from 'vue-router';


const route = useRoute()

const activeTab = ref(route.params.tab)

const tabs = [
  { tab: 'account', title: 'Stok Girişi', icon: 'ri-group-line' },
  { tab: 'security', title: 'Stok Çıkışı', icon: 'ri-lock-line' },
]


</script>

<template>
  <div>
    <VTabs
      v-model="activeTab"
      show-arrows
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow
      v-model="activeTab"
      class="mt-5 disable-tab-transition"
    >
      <VWindowItem value="account">
        <StokGirisi />
      </VWindowItem>

      <VWindowItem value="security">
        <StokCikisi />
      </VWindowItem>
    </VWindow>
  </div>
</template>
