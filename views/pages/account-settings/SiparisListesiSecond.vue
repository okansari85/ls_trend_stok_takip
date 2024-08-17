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
]

const confir = ref({
  deger: '',
  item: 0,
  title: '',
  message: '',
})

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
  siparisler.options.status = 2
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
              <img
                v-if="item.platformId === 1"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/N11_logo.svg/320px-N11_logo.svg.png"
                alt="n11 Logo"
                class="logo n11-logo"
                style="inline-size: 50px;"
              >
              <img
                v-if="item.platformId === 2"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Hepsiburada_logo_official.svg/320px-Hepsiburada_logo_official.svg.png"
                alt="Hepsiburada Logo"
                class="logo"
                style="inline-size: 90px;"
              >
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
                :subtitle="`${itm.product.productCode} X ${itm.orderable.quantity}`"
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
          <template #item.shippingCompanyName="{ item }">
            <div class="d-flex flex-column">
              <span class="d-block font-weight-medium text-high-emphasis text-truncate"> {{ item.shippingCompanyName }}</span>
              <small style="margin-block-end:5px"> <VChip
                color="success"
                class="font-weight-medium"
                size="small"
              >
                {{ item.campaignNumber }}
              </VChip></small>
              <Yazdir
                :platform="item.platformId === 1 ? 'n11' : 'hepsiburada'"
                :district="item.buyer.adresses[0].district"
                :city="item.buyer.adresses[0].city"
                :shipping-company-name="item.shippingCompanyName"
                :barcode-number="item.campaignNumber"
                :customer-name="item.buyer.fullName"
                :items="item.items"
              />
            </div>
          </template>
        </VDataTable>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
</template>(: string): string: { id: number; }(: { deger: string; item: any; })(: { raw: { id: number | null; name: string; }; }): string: number(: number)(: string)(: null)
