import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSiparislerStore = defineStore('siparisler', () => {
  const orders = ref<any[]>([])
  const totalItems = ref(0)
  const loading = ref(false)
  const client = useSanctumClient()
  const error = ref('')

  const options = ref({
    page: 1,
    itemsPerPage: 20,
    sortBy: [],
    sortDesc: [],
    groupBy: [],
    depo_id: 0,
    search: '',
    status: 0,
  })

  async function fetchData() {
    loading.value = true
    error.value = ''
    await client(`/api/orders?page=${options.value.page}&status=${options.value.status}&per_page=${options.value.itemsPerPage}&depo_id=${options.value.depo_id}&search=${options.value.search}`)
      .then(res => {
        loading.value = false
        orders.value = res.data
        totalItems.value = res.total
      })
      .catch(err => {
        loading.value = false
        error.value = err.message
      })
  }

  async function addHakedis(orderID: any) {
    loading.value = true
    error.value = ''
    await client('/api/addHakedisItem', {
      method: 'POST',
      body: {
        orderID,
      },
    })
      .then(res => {
        loading.value = false
      })
      .catch(err => {
        loading.value = false
        error.value = err.message
      })
  }

  const confirmedOrders = computed(() => {
    return orders.value.filter(ord => ord.is_confirmed === 1)
  })

  return {
    confirmedOrders,
    totalItems,
    loading,
    options,
    fetchData,
    error,
    orders,
    addHakedis,
  }
})
