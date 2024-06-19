<script setup lang="ts">
import { useStockMovementStore } from '@/stores/movements'

const store = useStockMovementStore()
const depolar = useDepolarStore()
const malzemeler = useDataTableStore()

await useAsyncData('depo', () => depolar.getAllDepos())

const headers = [
  { title: 'Ürün Kodu', key: 'productCode' },
  { title: 'Depo', key: 'depo' },
  { title: 'Raf No', key: 'raf' },
  { title: 'Durum', key: 'stock' },
  { title: 'Tarih', key: 'date' },
  { title: 'Aksiyonlar', key: 'actions' },
]

const search = ref('')

const selectedDepo = ref(null)
const confirmation = ref(false)

const onDepoChange = async (deger: number) => {
  store.options.depo_id = deger ?? 0
  store.fetchData()
}

const updateOptions = (deger: { page: number; search: string }) => {
  store.options.page = deger.page ?? 0
  store.options.search = deger.search ?? '' // search degeri null ise "" olarak atama yap
  store.options.depo_id = selectedDepo.value ?? 0
  store.fetchData()
}

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
  confir.value.message = 'Stok hareketi silme işlemi geri alınamaz ve ürünün stoğu da eski haline güncellenecektir.'
  confirmation.value = true
}

const clickedAgree = async (val: { deger: string; item: any }) => {
  if (val.deger === 'delete') {
    await store.deleteStockMovement(val.item).then(() => {
      confirmation.value = false
      malzemeler.stockmovements = []
    })
  }
}
</script>

<template>
  <VCard>
    <VCardTitle class="d-flex align-center pe-2" />
    <VRow>
      <LoadingDialog v-model="store.loading" />
      <ConfirmationDialog
        v-model="confirmation"
        :deger="confir.deger"
        :item="confir.item"
        :title="confir.title"
        :message="confir.message"
        @clicked-agree="clickedAgree"
      />
      <!-- 👉 Choose API Key -->
      <VCol
        cols="12"
        md="12"
        order-md="0"
        order="1"
      >
        <VCardText class="pt-0">
          <VForm @submit.prevent="() => {}">
            <VRow>
              <!-- 👉 Choose API Key -->
              <VCol
                cols="12"
                md="3"
              >
                <VSelect
                  v-model="selectedDepo"
                  :items="depolar.depo"
                  label="Malzeme listesini görmek istediğiniz depoyu seçiniz."
                  placeholder="Depo Seç"
                  item-title="name"
                  item-value="id"
                  clearable
                  @update:model-value="onDepoChange"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="search"
                  label="Ürün Kodu"
                  type="text"
                  placeholder="Ürün Koduna Göre Arama Yapın"
                  clearable
                  prepend-inner-icon="ri-user-line"
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCol>
    </VRow>
    <ClientOnly>
      <VDataTableServer
        v-model:items-per-page="store.options.itemsPerPage"
        :headers="headers"
        :items="store.stockmovements"
        :items-length="store.totalItems"
        :loading="store.loading"
        :search="search"
        item-value="id"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        <template #item.productCode="{ item }">
          <div class="d-flex flex-column ms-3">
            <span class="d-block font-weight-medium text-high-emphasis text-truncate">{{ item.malzemos.productCode }}</span>
            <small>{{ item.malzemos.productDesc }}</small>
          </div>
        </template>
        <template #item.raf="{ item }">
          <div class="d-flex gap-2">
            {{ item.malzemos.raf.name }}
          </div>
        </template>
        <template #item.depo="{ item }">
          <div class="d-flex gap-2">
            {{ item.malzemos.raf.descendants.name }}
          </div>
        </template>
        <template #item.stock="{ item }">
          <VChip
            :color="item.type === 'IN' ? 'success' : 'error'"
            class="font-weight-medium"
            size="small"
          >
            {{ item.type === 'IN' ? '+' : '-' }} {{ item.stock }}
          </VChip>
        </template>
        <template #item.date="{ item }">
          {{ item.created_at }}
        </template>
        <!-- User -->
        <template #item.actions="{ item }">
          <div class="d-flex gap-2">
            <VIcon
              icon="ri-close-circle-line"
              size="22"
              @click="openConfirmation('delete', item)"
            />
          </div>
        </template>
      </VDataTableServer>
    </ClientOnly>
  </VCard>
</template>
