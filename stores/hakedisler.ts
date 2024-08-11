import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHakedisStore = defineStore('hakedisStore', () => {
  const hakedisler = ref<any[]>([])
  const loading = ref(false)
  const client = useSanctumClient()
  const error = ref('')

  async function fetchData() {
    loading.value = true
    error.value = ''
    await client('/api/hakedis/daily')
      .then(res => {
        loading.value = false
        hakedisler.value = res
      })
      .catch(err => {
        loading.value = false
        error.value = err.message
      })
  }

  return {
    hakedisler,
    loading,
    fetchData,
    error,
  }
})
