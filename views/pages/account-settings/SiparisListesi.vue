<script lang="ts" setup>
import { ref } from 'vue'

const siparisler = useSiparislerStore()

const search = ref('')

const confirmation = ref(false)

const headers = [
  { title: 'Platform', key: 'platformId' },
  { title: 'Sipariş Bilgileri', key: 'orderDate' },
  { title: 'Müşteri Bilgileri', key: 'buyer' },
  { title: 'Ürün Bilgileri', key: 'items' },
  { title: 'Kargo Bilgileri', key: 'shippingCompanyName' },
  { title: 'Teyitli mi', key: 'is_confirmed' },
  { title: 'Aksiyonlar', key: 'actions' },
]

const confir = ref({
  deger: '',
  item: 0,
  title: '',
  message: '',
})

const openConfirmation = (deger: string, item: { id: number }) => {
  confir.value.deger = deger
  confir.value.item = item.id
  confir.value.title = 'Emin misiniz?'
  confir.value.message = 'Siparişi onayladığınızda sipariş kalemleri hakedişe düşecek ve sipariş onaylanacaktır.'
  confirmation.value = true
}

const clickedAgree = async (val: { deger: string; item: any }) => {
  if (val.deger === 'approve_order') {
    await siparisler.addHakedis(val.item).then(() => {
      confirmation.value = false
      siparisler.options.status = 1
      siparisler.fetchData()
    })
  }
}

const updateOptions = (deger: { page: number; search: string }) => {
  siparisler.options.page = deger.page ?? 0
  siparisler.options.search = deger.search ?? ''
  siparisler.options.status = 1
  siparisler.fetchData()
}

defineExpose({
  updateOptions,
})
</script>

<template>
  <VRow>
    <LoadingDialog v-model="siparisler.loading" />
    <ConfirmationDialog
      v-model="confirmation"
      :deger="confir.deger"
      :item="confir.item"
      :title="confir.title"
      :message="confir.message"
      @clicked-agree="clickedAgree"
    />

    <VCol
      cols="12"
      md="12"
    >
      <!-- 👉 Table -->

      <VCard>
        <VDataTable
          :headers="headers"
          :items="siparisler.confirmedOrders"
          :items-length="siparisler.totalItems"
          :loading="siparisler.loading"
          :search="search"
          item-value="id"
          class="text-no-wrap"
          hide-default-footer
          @update:options="updateOptions"
        >
          <template #item.platformId="{ item }">
            <div class="d-flex">
              <span>
                {{ item.platformId === 1 ? 'N11' : item.platformId === 2 ? 'HB' : '' }}
              </span>
            </div>
          </template>
          <template #item.orderDate="{ item }">
            <div class="d-flex">
              <span>
                {{ item.orderDate }}
              </span>
            </div>
          </template>
          <template #item.buyer="{ item }">
            <div class="d-flex flex-column">
              <span class="d-block font-weight-medium text-high-emphasis text-truncate">{{ item.buyer.fullName }}</span>
              <small>{{ item.buyer.adresses[0].district }} / {{ item.buyer.adresses[0].city }}</small>
            </div>
          </template>
          <template #item.items="{ item }">
            <VList>
              <VListItem
                v-for="itm in item.items"
                :key="itm.id"
                :subtitle="itm.product.productCode"
                :title="itm.product.productTitle"
              >
                <template #prepend>
                  <VAvatar
                    color="grey"
                    rounded="0"
                    size="64"
                  >
                    <VImg :src="itm.product.cover_image.url" />
                  </VAvatar>
                </template>
              </VListItem>
            </VList>
          </template>
          <template #item.raf="{ item }">
            <div class="d-flex gap-2">
              <span>
                {{ item.malzemos.raf.name }}
              </span>
            </div>
          </template>
          <template #item.stock="{ item }">
            <VChip
              color="success"
              class="font-weight-medium"
              size="small"
            >
              + {{ item.stock }}
            </VChip>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex gap-2">
              <VBtn
                type="submit"
                size="small"
                @click="openConfirmation('approve_order', item)"
              >
                Onayla
              </VBtn>
              <VBtn
                type="submit"
                size="small"
                color="error"
              >
                Reddet
              </VBtn>
            </div>
          </template>
          <template #bottom />
        </VDataTable>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
</template>(: string): string: { id: number; }(: { deger: string; item: any; })(: { raw: { id: number | null; name: string; }; }): string: number(: number)(: string)(: null)
