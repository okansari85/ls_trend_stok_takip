<script setup lang="ts">
const statistics = [
  {
    title: 'Toplam Depo Sayısı',
    stats: 'Yakında...',
    icon: 'ri-pie-chart-2-line',
    color: 'primary',
  },
  {
    title: 'Toplam Ürün Sayısı',
    stats: 'Yakında...',
    icon: 'ri-group-line',
    color: 'success',
  },

]
</script>

<template>
  <VCard title="İstatistikler">
    <template #subtitle>
      <p class="text-body-1 mb-0">
        <span class="d-inline-block font-weight-medium text-high-emphasis">Genel İstatistikler</span>
      </p>
    </template>

    <VCardText class="pt-2">
      <VRow>
        <VCol
          v-for="item in statistics"
          :key="item.title"
          cols="12"
          sm="6"
          md="3"
        >
          <div class="d-flex align-center gap-x-3">
            <VAvatar
              :color="item.color"
              rounded
              size="40"
              class="elevation-2"
            >
              <VIcon
                size="24"
                :icon="item.icon"
              />
            </VAvatar>

            <div class="d-flex flex-column">
              <div class="text-body-1">
                {{ item.title }}
              </div>
              <h5 class="text-h5">
                {{ item.stats }}
              </h5>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
