<script lang="ts" setup>
import { ref } from 'vue'

const raflar = useRaflarStore()
const depolar = useDepolarStore()

await useAsyncData('depo', () => depolar.getAllDepos())

const form = ref({
  name: '',
  depo_id: null,
  id: null,
  raf_name: '',
})

const selectedDepo = ref({
  name: 'Lütfen Seçiniz',
  id: 0,
})

const clickStatus = ref()
const isDialogOpen = ref(false)
const confirmation = ref(false)
const mdlBtnText = ref('Yeni Raf Ekle')
const MdlText = ref('Yeni Raf Ekle')
const rafForm = ref()

const textRules = [
  (v: string) => !!v || 'Raf Adı Gereklidir.',
]

const selectRules = [
  (v: string) => !!v || 'Depo Seçimi Gereklidir.',
]

const showModal = deger => {
  clickStatus.value = deger
  isDialogOpen.value = true
}

const rafValid = ref(false)

const headers = [
  { title: 'Raf No', key: 'name' },
  { title: 'Bulunduğu Depo', key: 'depo' },
  { title: 'Aksiyonlar', key: 'actions' },
]

const clickedSave = async () => {
  rafForm.value?.validate()
  if (rafValid.value) {
    if (clickStatus.value === 'new') {
      await raflar.addRaf(form.value).then(() => {
        if (raflar.error === '')
          isDialogOpen.value = false
      })
    }
    else if (clickStatus.value === 'edit') {
      await raflar.editRaf(form.value).then(() => {
        if (raflar.error === '')
          isDialogOpen.value = false
      })
    }
  }
}

const onDepoChange = async deger => {
  await raflar.getRaflar(deger).then(() => {
  })
}

const confir = ref({
  deger: '',
  item: 0,
  title: '',
  message: '',
})

const openConfirmation = (deger, item) => {
  confir.value.deger = deger
  confir.value.item = item.id
  confir.value.title = 'Emin misiniz?'
  confir.value.message = 'Raf silme işlemi geri alınamaz ve rafa bağlı tüm ürünler de silinir.'
  confirmation.value = true
}

const clickedAgree = async val => {
  if (val.deger === 'delete') {
    await raflar.deleteRaf(val.item).then(() => {
      confirmation.value = false
    })
  }
}

const editItem = (deger, item) => {
  form.value.raf_name = item.name
  form.value.id = item.id
  form.value.depo_id = item.parent.id
  console.log(item.name)
  clickStatus.value = deger
  isDialogOpen.value = true
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
      <VCard title="Raf Listesi">
        <Modals
          v-model="isDialogOpen"
          :mdl-text="MdlText"
          :mdl-btn-text="mdlBtnText"
          :status="clickStatus"
          fullscreen
          @clicked-save="clickedSave"
        >
          <div class="pt-5">
            <VForm
              ref="rafForm"
              v-model="rafValid"
              lazy-validation
              @submit.prevent="() => {}"
            >
              <VContainer fluid>
                <VRow />
                <!-- depo adi  -->
                <VCol
                  cols="12"
                  md="12"
                >
                  <VSelect
                    v-model="form.depo_id"
                    label="Depo Seçiniz"
                    placeholder="Depo Seçiniz"
                    :items="depolar.depo"
                    item-title="name"
                    item-value="id"
                    :rules="selectRules"
                    required
                  />
                </VCol>
                <!-- raf adi  -->
                <VCol
                  cols="12"
                  md="12"
                >
                  <VTextField
                    v-model="form.raf_name"
                    label="Raf No"
                    type="text"
                    :rules="textRules"
                    placeholder="Raf Adı"
                  />
                </VCol>
                <VAlert
                  v-if="raflar.error !== ''"
                  type="error"
                  class="mb-3"
                >
                  {{ raflar.error }}
                </VAlert>
              </VContainer>
            </VForm>
          </div>
        </Modals>
        <VCardText class=" pt-0">
          Raf Listesini aşağıda görebilirsiniz. İlgili depodaki rafları görmek için aşağıdan depo seçiniz
          <br>
          Yeni raf eklemek için  <a
            href="javascript:void(0)"
            @click="showModal('new')"
          >tıklayınız.</a>
        </VCardText>
      </VCard>
    <!-- !SECTION -->
    </VCol>

    <!-- SECTION Recent Devices -->
    <VCol cols="12">
      <!-- 👉 Table -->

      <VCard title="Raflar">
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
                  <VCol cols="12">
                    <VSelect
                      v-model="selectedDepo"
                      label="Raf listesini görmek istediğiniz depoyu seçiniz"
                      placeholder="Depo Seç"
                      :items="depolar.depo"
                      item-title="name"
                      item-value="id"
                      @update:model-value="onDepoChange"
                    />
                  </VCol>
                </VRow>
              </VForm>
            </VCardText>
          </VCol>
        </VRow>
        <VDataTable
          :headers="headers"
          :items="raflar.raf"
          :loading="raflar.loading"
          hide-default-footer
          class="text-no-wrap"
        >
          <template #item.name="{ item }">
            <div class="d-flex">
              <span>
                {{ item.name }}
              </span>
            </div>
          </template>
          <template #item.depo="{ item }">
            <div class="d-flex">
              <span>
                {{ item.parent.name }}
              </span>
            </div>
          </template>
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
        </VDataTable>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
</template>
