<!-- eslint-disable -->
<script lang="ts" setup>
import AccountSettingsNotification from '@/views/pages/account-settings/AccountSettingsNotification.vue';
import AccountSettingsSecurity from '@/views/pages/account-settings/AccountSettingsSecurity.vue';
import { useRoute } from 'vue-router';


const route = useRoute()

const activeTab = ref(route.params.tab)

const tabs = [
  { tab: 'account', title: 'Depolar', icon: 'ri-group-line' },
  { tab: 'security', title: 'Raflar', icon: 'ri-lock-line' },
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
      :touch="false"
    >
      <VWindowItem value="account">
        <AccountSettingsNotification />
      </VWindowItem>

      <VWindowItem value="security">
        <AccountSettingsSecurity />
      </VWindowItem>
    </VWindow>
  </div>
</template>
