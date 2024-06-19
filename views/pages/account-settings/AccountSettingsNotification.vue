<script setup lang="ts">
import { ref } from 'vue'

const depolar = useDepolarStore()

await useAsyncData('depo', () => depolar.getAllDepos())

const form = ref({
  depo_adi: '',
  id: 0,
})

const confir = ref({
  deger: '',
  item: 0,
  title: '',
  message: '',
})

const textRules = [
  (v: string) => !!v || 'Depo Adı Gereklidir.',
]

const mdlBtnText = ref('Yeni Depo Ekle')
const MdlText = ref('Yeni Depo Ekle')
const clickStatus = ref()
const depoValid = ref(false)
const depoForm = ref()

const isDialogOpen = ref(false)
const confirmation = ref(false)

const headers = [
  { title: 'Depo Adı', key: 'name', width: '80%' },
  { title: 'Aksiyonlar', key: 'aksiyonlar' },
]

const openConfirmation = (deger, item) => {
  confir.value.deger = deger
  confir.value.item = item.id
  confir.value.title = 'Emin misiniz?'
  confir.value.message = 'Depo silme işlemi geri alınamaz ve depoya bağlı tüm ürünler de silinir.'
  confirmation.value = true
}

const clickedAgree = async val => {
  if (val.deger === 'delete') {
    await depolar.deleteDepo(val.item).then(() => {
      confirmation.value = false
    })
  }
}

const showModal = deger => {
  form.value.depo_adi = ''
  form.value.id = 0
  clickStatus.value = deger
  isDialogOpen.value = true
}

const editItem = (deger, item) => {
  form.value.depo_adi = item.name
  form.value.id = item.id
  console.log(item)
  clickStatus.value = deger
  isDialogOpen.value = true
}

const clickedSave = async () => {
  depoForm.value?.validate()
  if (depoValid.value) {
    if (clickStatus.value === 'new') {
      await depolar.addDepo(form.value.depo_adi).then(() => {
        if (depolar.error === '')
          isDialogOpen.value = false
      })
    }
    else if (clickStatus.value === 'edit') {
      await depolar.editDepo(form.value).then(() => {
        if (depolar.error === '')
          isDialogOpen.value = false
      })
    }
  }
}
</script>

<template>
  <VCard title="Depolar">
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
      <div class="pt-5">
        <VForm
          ref="depoForm"
          v-model="depoValid"
          lazy-validation
          @submit.prevent="() => {}"
        >
          <VContainer fluid>
            <VRow />
            <!-- depo_adi -->
            <VCol
              cols="12"
              md="12"
            >
              <VTextField
                v-model="form.depo_adi"
                label="Depo Adı"
                type="text"
                :rules="textRules"
                placeholder="Depo Adı"
              />
            </VCol>
            <VAlert
              v-if="depolar.error !== ''"
              type="error"
              class="mb-3"
            >
              {{ depolar.error }}
            </VAlert>
          </VContainer>
        </VForm>
      </div>
    </Modals>
    <VCardText>
      Depoların Listesini Aşağıda Görebilirsiniz.Yeni Depo Eklemek için
      <a
        href="javascript:void(0)"
        @click="showModal('new')"
      >tıklayınız.</a>
    </VCardText>
    <VDataTable
      :headers="headers"
      :items="depolar.depo"
      item-value="id"
      class="text-no-wrap"
    >
      <!-- Role -->
      <template #item.aksiyonlar="{ item }">
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
      <template #bottom />
    </VDataTable>
    <VDivider />
    <VCardText />
  </VCard>
</template>
