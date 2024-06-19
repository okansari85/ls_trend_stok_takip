import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Raf {
  id: number
  name: string
}

interface Depo {
  id: number
  name: string
  children: Raf[]
  created_at: string | null
  order: number
  parent_id: number
  updated_at: string | null
}

export const useDepolarStore = defineStore('depolar', () => {
  const depo = ref<Depo[]>([])
  const raflar = ref<Raf[]>([])
  const loading = ref(false)
  const error = ref('')

  const client = useSanctumClient()

  async function getAllDepos() {
    loading.value = true
    error.value = ''
    await client('/api/get_depos')
      .then(res => {
        loading.value = false
        depo.value = res
      })
      .catch(err => {
        loading.value = false
        error.value = err.message
      })
  }

  async function addDepo(request) {
    loading.value = true
    error.value = ''
    await client('/api/addDepo', {
      method: 'POST',
      body: {
        category_name: request,
        parent_id: 0,
      },
    })
      .then(res => {
        depo.value.push(res)
        loading.value = false
      })
      .catch(err => {
        loading.value = false
        error.value = err.message
      })
  }

  async function editDepo(request) {
    loading.value = true
    error.value = ''
    await client(`/api/get_depos/${request.id}`, {
      method: 'PUT',
      body: {
        name: request.depo_adi,
      },
    })
      .then(res => {
        loading.value = false

        // update record
        const index = depo.value.findIndex(a => a.id === res.id)
        if (index !== -1)
          depo.value[index] = res
      })
      .catch(err => {
        loading.value = false
        error.value = err.message
      })
  }

  async function deleteDepo(request) {
    loading.value = true
    error.value = ''
    await client(`/api/get_depos/${request}`, {
      method: 'DELETE',
    })
      .then(() => {
        loading.value = false

        // update record
        const index = depo.value.findIndex(a => a.id === request)
        if (index !== -1)
          depo.value.splice(index, 1)
      })
      .catch(err => {
        loading.value = false
        error.value = err.message
      })
  }

  // Stock Out hareketlerini döndüren getter
  const getRaflar = computed(() => {
    return (depoID: number) => {
      const index = depo.value.findIndex(a => a.id === depoID)

      raflar.value = depo.value[index].children ?? []
    }
  })

  return {
    depo,
    getAllDepos,
    addDepo,
    editDepo,
    deleteDepo,
    loading,
    error,
    getRaflar,
    raflar,
  }
})
