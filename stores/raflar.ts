import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRaflarStore = defineStore('raflar', () => {
  const raf = ref<any[]>([])
  const loading = ref(false)
  const error = ref('')

  const client = useSanctumClient()

  async function getRaflar(request) {
    loading.value = true
    error.value = ''
    await client(`/api/get_depos/${request}`)
      .then(res => {
        loading.value = false
        raf.value = res
      })
      .catch(err => {
        loading.value = false
        error.value = err.message
      })
  }

  async function deleteRaf(request) {
    loading.value = true
    error.value = ''
    await client(`/api/get_depos/${request}`, {
      method: 'DELETE',
    })
      .then(() => {
        loading.value = false

        // update record
        const index = raf.value.findIndex(a => a.id === request)
        if (index !== -1)
          raf.value.splice(index, 1)
      })
      .catch(err => {
        loading.value = false
        error.value = err.message
      })
  }

  async function addRaf(request) {
    loading.value = true
    error.value = ''
    await client('/api/addDepo', {
      method: 'POST',
      body: {
        category_name: request.raf_name,
        parent_id: request.depo_id,
      },
    })
      .then(res => {
        raf.value.push(res)
        loading.value = false
      })
      .catch(err => {
        loading.value = false
        error.value = err.message
      })
  }

  async function editRaf(request) {
    loading.value = true
    error.value = ''
    await client(`/api/get_depos/${request.id}`, {
      method: 'PUT',
      body: {
        name: request.raf_name,
      },
    })
      .then(res => {
        loading.value = false

        // update record
        const index = raf.value.findIndex(a => a.id === res.id)
        if (index !== -1)
          raf.value[index] = res
      })
      .catch(err => {
        loading.value = false
        error.value = err.message
      })
  }

  return {
    getRaflar,
    raf,
    addRaf,
    editRaf,
    deleteRaf,
    loading,
    error,
  }
})
