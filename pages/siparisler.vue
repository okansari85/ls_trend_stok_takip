<!-- eslint-disable -->
<script lang="ts" setup>
import SiparisListesi from '@/views/pages/account-settings/SiparisListesi.vue';
import SiparisListesiSecond from '@/views/pages/account-settings/SiparisListesiSecond.vue';
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';

const route = useRoute()

const activeTab = ref(route.params.tab)

const siparisListesi = ref();
const siparisListesiSecond = ref();

const options = ref({
    page: 1,
    itemsPerPage: 20,
    sortBy: [],
    sortDesc: [],
    groupBy: [],
    depo_id: 0,
    search: '',
    status: 1,
  })

const tabs = [
  { tab: 'account', title: 'Yeni Siparişler', icon: 'ri-group-line' },
  { tab: 'security', title: 'Kargolanacak Siparişler (Onaylanmış)', icon: 'ri-lock-line' },
]

const handleTabChange = (val: any) => {
  // Tab değiştiğinde çalışacak olan metod
  if (val==='account') siparisListesi.value.updateOptions({
    page: 1,
    itemsPerPage: 20,
    sortBy: [],
    sortDesc: [],
    groupBy: [],
    depo_id: 0,
    search: '',
    status: 1,
  })

  if (val==='security') siparisListesiSecond.value.updateOptions({
    page: 1,
    itemsPerPage: 20,
    sortBy: [],
    sortDesc: [],
    groupBy: [],
    depo_id: 0,
    search: '',
    status: 2,
  })
};

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
        @click="handleTabChange(item.tab)"
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
      disabled
    >
      <VWindowItem value="account">
        <SiparisListesi ref="siparisListesi" />
      </VWindowItem>

      <VWindowItem value="security">
        <SiparisListesiSecond ref="siparisListesiSecond" />
      </VWindowItem>
    </VWindow>
  </div>
</template>
