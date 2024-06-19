import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDataTableStore = defineStore('dataTable', () => {
  const items = ref<any[]>([])
  const stockmovements = ref<any[]>([])
  const totalItems = ref(0)
  const loading = ref(false)
  const client = useSanctumClient()
  const error = ref('')
  const singleProduct = ref<any[]>([])
  const notFound = ref(false)

  const options = ref({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
    sortDesc: [],
    groupBy: [],
    depo_id: 0,
    search: '',
    id: 0,
  })

  async function fetchData() {
    loading.value = true
    error.value = ''
    await client(`/api/malzemos?page=${options.value.page}&per_page=${options.value.itemsPerPage}&depo_id=${options.value.depo_id}&search=${options.value.search}`)
      .then(res => {
        loading.value = false
        items.value = res.data
        totalItems.value = res.total
      })
      .catch(err => {
        loading.value = false
        error.value = err.message
      })
  }

  async function getMalzemosByProductId(val) {
    loading.value = true
    error.value = ''
    notFound.value = false
    await client(`/api/getMalzemosByProductCode?product_code=${val.product_id}&depo_id=${val.depo_id}`)
      .then(res => {
        loading.value = false
        singleProduct.value = res
      })
      .catch(err => {
        loading.value = false
        if (err.response && err.response.status === 404) {
          notFound.value = true
          error.value = 'Malzeme bulunamadı'
        }
        else {
          error.value = err.response ? err.response.data.message : err.message
        }
      })
  }

  async function addProductStock(id, adet) {
    loading.value = true
    error.value = ''
    await client('/api/addProductStock', {
      method: 'POST',
      body: {
        id,
        adet,
      },
    })
      .then(res => {
        loading.value = false
        stockmovements.value.push(res)
      })
      .catch(err => {
        loading.value = false
        error.value = err.message
      })
  }

  async function removeProductStock(productCode, adet, depoID) {
    loading.value = true
    error.value = ''
    notFound.value = false
    await client('/api/removeProductStock', {
      method: 'POST',
      body: {
        productCode,
        adet,
        depoID,
      },
    })
      .then(res => {
        loading.value = false
        stockmovements.value.push(res)
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          notFound.value = true
          error.value = 'Malzeme bulunamadı'
        }
        else if (err.response && err.response.status === 400) {
          error.value = err.response._data
        }
        loading.value = false
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

  async function saveMalzemos(obj: any) {
    loading.value = true
    error.value = ''
    await client('/api/malzemos', {
      method: 'POST',
      body: {
        product: obj,
      },
    })
      .then(res => {
        stockmovements.value.push(res)
        loading.value = false
      })
      .catch(err => {
        loading.value = false
        error.value = err.message
      })
  }

  async function newProduct(obj: any) {
    loading.value = true
    error.value = ''
    await client('/api/newProduct', {
      method: 'POST',
      body: {
        product: obj,
      },
    })
      .then(() => {
        loading.value = false
      })
      .catch(err => {
        loading.value = false
        error.value = err.message
      })
  }

  async function editProduct(obj: any) {
    loading.value = true
    error.value = ''
    await client(`/api/malzemos/${obj.id}`, {
      method: 'PUT',
      body: {
        product: obj,
      },
    })
      .then(() => {
        loading.value = false
      })
      .catch(err => {
        loading.value = false
        error.value = err.message
      })
  }

  async function deleteProduct(request) {
    loading.value = true
    error.value = ''
    await client(`/api/malzemos/${request}`, {
      method: 'DELETE',
    })
      .then(() => {
        loading.value = false
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
    items,
    singleProduct,
    totalItems,
    loading,
    options,
    fetchData,
    getMalzemosByProductId,
    error,
    notFound,
    addProductStock,
    removeProductStock,
    stockmovements,
    stockInMovements,
    stockOutMovements,
    deleteStockMovement,
    saveMalzemos,
    newProduct,
    editProduct,
    deleteProduct,
  }
})
