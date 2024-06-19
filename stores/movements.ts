import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStockMovementStore = defineStore('stockmovements', () => {
  const stockmovements = ref<any[]>([])
  const totalItems = ref(0)
  const loading = ref(false)
  const client = useSanctumClient()
  const error = ref('')

  const options = ref({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
    sortDesc: [],
    groupBy: [],
    depo_id: 0,
    search: '',
  })

  async function fetchData() {
    loading.value = true
    error.value = ''
    await client(`/api/stockmovements?page=${options.value.page}&per_page=${options.value.itemsPerPage}&depo_id=${options.value.depo_id}&search=${options.value.search}`)
      .then(res => {
        loading.value = false
        stockmovements.value = res.data
        totalItems.value = res.total
      })
      .catch(err => {
        loading.value = false
        error.value = err.message
      })
  }

  async function deleteStockMovement(request) {
    loading.value = true
    error.value = ''
    await client(`/api/deleteStockMovement/${request}`, {
      method: 'DELETE',
    })
      .then(() => {
        loading.value = false

        // update record
        const index = stockmovements.value.findIndex(a => a.id === request)
        if (index !== -1)
          stockmovements.value.splice(index, 1)
      })
      .catch(err => {
        loading.value = false
        error.value = err.message
      })
  }

  // Stock In hareketlerini döndüren getter
  const stockInMovements = computed(() => {
    return stockmovements.value.filter(movement => movement.type === 'IN')
  })

  // Stock Out hareketlerini döndüren getter
  const stockOutMovements = computed(() => {
    return stockmovements.value.filter(movement => movement.type === 'OUT')
  })

  return {
    totalItems,
    loading,
    options,
    fetchData,
    error,
    stockmovements,
    stockInMovements,
    stockOutMovements,
    deleteStockMovement,
  }
})
