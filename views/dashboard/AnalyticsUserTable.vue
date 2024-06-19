<script setup lang="ts">
const store = useDataTableStore()
const depolar = useDepolarStore()

const isDialogOpen = ref(false)
const confirmation = ref(false)
const clickStatus = ref()

await useAsyncData('depo', () => depolar.getAllDepos())

const headers = [
  { title: 'Ürün Kodu', key: 'productCode' },
  { title: 'Depo', key: 'depo' },
  { title: 'Raf No', key: 'raf' },
  { title: 'Stok', key: 'stock' },
  { title: 'Aksiyonlar', key: 'actions' },
]

const mdlBtnText = ref('Yeni Ürün Ekle')
const MdlText = ref('Yeni Ürün Ekle')

const search = ref('')

const selectedDepo = ref(null)

const onDepoChange = async (deger: number) => {
  store.options.depo_id = deger ?? 0
  store.fetchData()
}

const updateOptions = deger => {
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

const form = ref({
  depo_id: null,
  id: 0,
  raf_id: '',
  product_code: '',
  product_desc: '',
  stock: 0,
  type: 'IN',
  adet: '0',
})

const productForm = ref()

const clickedAgree = async (val: { deger: string; item: any }) => {
  if (val.deger === 'delete') {
    await store.deleteProduct(val.item).then(() => {
      confirmation.value = false
      updateOptions(store.options)
    })
  }
}

const clickedSave = async () => {
  if (productForm.value?.validate()) {
    if (clickStatus.value === 'new') {
      await store.newProduct(productForm.value.internalFormData).then(() => {
        if (store.error === '') {
          console.log('tamam')
          isDialogOpen.value = false
          updateOptions(store.options)
        }
      })
    }
    else if (clickStatus.value === 'edit') {
      await store.editProduct(productForm.value.internalFormData).then(() => {
        if (store.error === '') {
          console.log('tamam')
          isDialogOpen.value = false
          updateOptions(store.options)
        }
      })
    }
  }
}

const depoChange = (val: null) => {
  form.value.depo_id = val
  form.value.raf_id = ''
  if (form.value.depo_id !== null)
    depolar.getRaflar(form.value.depo_id)
}

const showModal = (deger: any) => {
  if (productForm.value)
    productForm.value.clearForm()
  clickStatus.value = deger
  isDialogOpen.value = true
}

const editItem = (deger: any, item: { productCode: string; productDesc: string; id: number; depo_id: any; raf_id: string; stock: number; name: any }) => {
  depolar.getRaflar(item.depo_id)
  form.value.product_code = item.productCode
  form.value.product_desc = item.productDesc
  form.value.id = item.id
  form.value.depo_id = item.depo_id
  form.value.raf_id = item.raf_id
  form.value.stock = item.stock
  console.log(item.name)
  clickStatus.value = deger
  isDialogOpen.value = true
}

const openConfirmation = (deger: string, item: { id: number }) => {
  confir.value.deger = deger
  confir.value.item = item.id
  confir.value.title = 'Emin misiniz?'
  confir.value.message = 'Ürün silme işlemi geri alınamaz ve ürüne bağlı tüm hareketler de silinir.'
  confirmation.value = true
}
</script>

<template>
  <VRow>
    <ConfirmationDialog
      v-model="confirmation"
      :deger="confir.deger"
      :item="confir.item"
      :title="confir.title"
      :message="confir.message"
      @clicked-agree="clickedAgree"
    />
    <VCol cols="12">
      <!-- SECTION: Create an API key -->
      <VCard title="Ürün Listesi">
        <Modals
          v-model="isDialogOpen"
          :mdl-text="MdlText"
          :mdl-btn-text="mdlBtnText"
          :status="clickStatus"
          fullscreen
          @clicked-save="clickedSave"
        >
          <div class="pa-5 pt-2">
            <ProductForm
              ref="productForm"
              v-model="form"
              :depolar="depolar.depo"
              :raflar="depolar.raflar"
              :disabled="false"
              @depo-change="depoChange"
            />
          </div>
        </Modals>
        <VCardText class=" pt-0">
          Ürün Listesini aşağıda görebilirsiniz. Sistem 20 nin altındaki ürünleri kırmızıya boyar
          <br>
          Yeni ürün eklemek için  <a
            href="javascript:void(0)"
            @click="showModal('new')"
          >tıklayınız.</a>
        </VCardText>
      </VCard>
      <!-- !SECTION -->
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardTitle class="d-flex align-center pe-2" />
        <VRow>
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
            :items="store.items"
            :items-length="store.totalItems"
            :loading="store.loading"
            :search="search"
            item-value="id"
            class="text-no-wrap"
            @update:options="updateOptions"
          >
            <template #item.productCode="{ item }">
              <div class="d-flex flex-column ms-3">
                <span class="d-block font-weight-medium text-high-emphasis text-truncate">{{ item.productCode }}</span>
                <small>{{ item.productDesc }}</small>
              </div>
            </template>
            <template #item.raf="{ item }">
              <div class="d-flex gap-2">
                {{ item.raf.name }}
              </div>
            </template>
            <template #item.depo="{ item }">
              <div class="d-flex gap-2">
                {{ item.raf.descendants.name }}
              </div>
            </template>
            <template #item.stock="{ item }">
              <VChip
                :color="item.stock > 10 ? 'success' : 'error'"
                class="font-weight-medium"
                size="small"
              >
                {{ item.stock }}
              </VChip>
            </template>
            <!-- User -->
            <template #item.actions="{ item }">
              <div class="d-flex gap-2">
                <VIcon
                  icon="ri-close-circle-line"
                  size="22"
                  @click="openConfirmation('delete', item)"
                />
                <VIcon
                  icon="ri-pencil-line"
                  size="22"
                  @click="editItem('edit', item)"
                />
              </div>
            </template>
          </VDataTableServer>
        </ClientOnly>
      </VCard>
    </VCol>
  </VRow>
</template>
