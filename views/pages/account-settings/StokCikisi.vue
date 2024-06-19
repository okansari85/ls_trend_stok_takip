<script lang="ts" setup>
import { reactive, ref } from 'vue'
import LoadingDialog from '@/components/LoadingDialog.vue'
import ProductForm from '@/components/ProductForm.vue'

const { $toast } = useNuxtApp()

const depolar = useDepolarStore()
const malzemeler = useDataTableStore()
const barcode = ref('')

await useAsyncData('depo', () => depolar.getAllDepos())

const selectedDepo = ref({
  name: 'DEPO SEÇ',
  id: 0,
})

const form = ref({
  depo_id: null,
  id: null,
  raf_id: '',
  product_code: '',
  product_desc: '',
  stock: 0,
  type: 'OUT',
  adet: '0',
})

const clickStatus = ref()
const isDialogOpen = ref(false)
const BarcodeDialog = ref(false)
const confirmation = ref(false)
const step = ref(1)
const productForm = ref(null)

const mdlBtnText = ref('')
const MdlText = ref('')

const openModal = deger => {
  if (deger === 'depo_sec') {
    clickStatus.value = deger
    isDialogOpen.value = true
  }
  if (deger === 'barcode') {
    clickStatus.value = deger
    BarcodeDialog.value = true
  }
}

const headers = [
  { title: 'Ürün Kodu', key: 'name' },
  { title: 'Depo', key: 'depo' },
  { title: 'Raf No', key: 'raf' },
  { title: 'Durum', key: 'stock' },
  { title: 'Aksiyonlar', key: 'actions' },
]

const clickedSave = async () => {
  if (clickStatus.value === 'depo_sec')
    isDialogOpen.value = false
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

const clickedAgree = async val => {
  if (val.deger === 'delete') {
    await malzemeler.deleteStockMovement(val.item).then(() => {
      confirmation.value = false
    })
  }
}

const selectItem = item => {
  selectedDepo.value.id = item.raw.id
  form.value.depo_id = item.raw.id
  selectedDepo.value.name = item.raw.name
  depolar.getRaflar(item.raw.id)
}

const removeProductStock = async (barcodeVal: string, adet: string, depoId: number) => {
  await malzemeler.removeProductStock(barcodeVal, adet, depoId).then(() => {
    if (malzemeler.notFound) {
      openModal('barcode')
      step.value = 1
      MdlText.value = 'Ürün Bulunamadı' + `-${barcode.value}`
      form.value.product_code = barcode.value
      form.value.stock = 1
    }
    if (malzemeler.error !== '' && malzemeler.notFound === false) {
      $toast.open({
        message: malzemeler.error,
        type: 'error',
        position: 'top',

      })
    }
    barcode.value = ''
  })
}

const onEnter = () => {
  if (productForm.value)
    productForm.value.clearForm()

  if (barcode.value)
    removeProductStock(barcode.value, '1', selectedDepo.value.id)

  // ürün bulundu ise
}

const depoChange = val => {
  form.value.depo_id = val
  if (form.value.depo_id !== null)
    depolar.getRaflar(form.value.depo_id)
}

const clickHandler = async val => {
  if (val === 1) {
    step.value = step.value + 1
  }

  else if (val === 2 && productForm.value && productForm.value.validate()) {
    await malzemeler.saveMalzemos(productForm.value.internalFormData).then(() => {
      if (malzemeler.error === '') {
        console.log('tamam')
        BarcodeDialog.value = false
      }
    })
  }
}

const goBack = () => {
  step.value--
}

const cancelBarcodeDialog = () => {
  BarcodeDialog.value = false
}

const buttonText = computed(() => {
  if (step.value === 2 && malzemeler.notFound)
    return 'Geri Git'
  else if (step.value === 1)
    return 'Vazgeç'

  return ''
})

const handleButtonClick = () => {
  if (step.value === 2 && malzemeler.notFound)
    goBack()
  else if (step.value === 1)
    cancelBarcodeDialog()
}
</script>

<template>
  <VRow>
    <LoadingDialog v-model="malzemeler.loading" />
    <ConfirmationDialog
      v-model="confirmation"
      :deger="confir.deger"
      :item="confir.item"
      :title="confir.title"
      :message="confir.message"
      @clicked-agree="clickedAgree"
    />
    <Modals
      v-model="isDialogOpen"
      :mdl-text="MdlText"
      :mdl-btn-text="mdlBtnText"
      :status="clickStatus"
      fullscreen
      @clicked-save="clickedSave"
    >
      <VDataIterator
        :items="depolar.depo"
        :loading="depolar.loading"
        class="pa-6 pb-7 pt-1 mt-5"
      >
        <template #default="props">
          <VRow>
            <VCol
              v-for="item in props.items"
              :key="item.raw.id"
              cols="12"
              md="3"
            >
              <VCard
                role="button"
                :color="selectedDepo.id === item.raw.id ? 'warning' : ''"
                here
                @click="selectItem(item)"
              >
                <VCardText class="text-center ">
                  <h4>
                    {{ item.raw.name }}
                  </h4>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </template>
      </VDataIterator>
    </Modals>
    <Modals
      v-model="BarcodeDialog"
      :mdl-text="MdlText"
      :mdl-btn-text="mdlBtnText"
      :status="clickStatus"
      fullscreen
      :toolbar="false"
      @clicked-save="clickedSave"
    >
      <VCard
        prepend-icon="ri-24-hours-fill"
        :title="MdlText"
      >
        <VDivider class="mt-0" />
        <VCardText>
          <VWindow v-model="step">
            <VWindowItem :value="1">
              <VCol
                cols="12"
                md="12"
              >
                <VAlert
                  v-if="malzemeler.notFound"
                  type="error"
                  class="mb-3"
                >
                  Ürün ilgili depoda bulunamadı. Yeni ürün eklemek ister misiniz?
                </VAlert>
              </VCol>
            </VWindowItem>

            <VWindowItem :value="2">
              <ProductForm
                ref="productForm"
                v-model="form"
                :depolar="depolar.depo"
                :raflar="depolar.raflar"
                disabled
                @depo-change="depoChange"
              />
            </VWindowItem>
          </VWindow>
        </VCardText>
        <VDivider class="mb-2" />
        <VCardActions class="mb-1">
          <VContainer fluid>
            <VRow>
              <VCol>
                <VBtn
                  variant="outlined"
                  block
                  size="large"
                  @click="handleButtonClick"
                >
                  {{ buttonText }}
                </VBtn>
                <VBtn
                  color="primary"
                  variant="flat"
                  block
                  size="large"
                  prepend-icon="$vuetify"
                  class="mt-2"
                  style="margin-inline-start:0;"
                  @click="clickHandler(step)"
                >
                  {{ step === 1 ? 'Yeni Ürün Ekle' : step === 2 ? 'Kaydet' : '' }}
                </VBtn>
              </VCol>
            </VRow>
          </VContainer>
        </VCardActions>
      </VCard>
    </Modals>
    <VCol
      cols="12"
      md="3"
    >
      <!-- SECTION: Create an API key -->
      <VCard>
        <VCardText class=" pt-5">
          <VRow>
            <VCol
              cols="12"
              class="pb-2"
            >
              <VBtn
                type="submit"
                class="me-2"
                block
                @click="openModal('depo_sec')"
              >
                {{ selectedDepo.name }}
              </VBtn>
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="barcode"
                prepend-inner-icon="ri-barcode-line"
                label="Barkod Okut"
                placeholder="Barkod Okut"
                :disabled="selectedDepo.id === 0"
                @keyup.enter="onEnter"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>

    <!-- !SECTION -->
    </VCol>

    <!-- SECTION Recent Devices -->
    <VCol
      cols="12"
      md="9"
    >
      <!-- 👉 Table -->

      <VCard>
        <VDataTable
          :headers="headers"
          :items="malzemeler.stockOutMovements"
          hide-default-footer
          class="text-no-wrap"
        >
          <template #item.name="{ item }">
            <div class="d-flex flex-column ms-3">
              <span class="d-block font-weight-medium text-high-emphasis text-truncate">{{ item.malzemos.productCode }}</span>
              <small>{{ item.malzemos.productDesc }}</small>
            </div>
          </template>
          <template #item.depo="{ item }">
            <div class="d-flex">
              <span>
                {{ item.malzemos.raf.descendants.name }}
              </span>
            </div>
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
              color="error"
              class="font-weight-medium"
              size="small"
            >
              - {{ item.stock }}
            </VChip>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex gap-2">
              <VIcon
                icon="ri-close-circle-line"
                size="22"
                @click="openConfirmation('delete', item)"
              />
            </div>
          </template>
          <template #bottom />
        </VDataTable>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
</template>
