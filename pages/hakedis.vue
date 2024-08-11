<script lang="ts" setup>
import { useHakedisStore } from '@/stores/hakedisler'

const hakedisler = useHakedisStore()

// Bileşen yüklendiğinde günlük hakedisleri al
onMounted(() => {
  hakedisler.fetchData()
})
</script>

<template>
  <VExpansionPanels multiple>
    <VExpansionPanel
      v-for="(hakedislerByDate, date) in hakedisler.hakedisler"
      :key="date"
      :title="date"
    >
      <VExpansionPanelText>
        <VTable density="compact">
          <thead>
            <tr>
              <th class="text-left">
                ID
              </th>
              <th class="text-left">
                Order ID
              </th>
              <th class="text-left">
                Product ID
              </th>
              <th class="text-left">
                Price
              </th>
              <th class="text-left">
                Quantity
              </th>
              <th class="text-left">
                Total Price
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="hakedis in hakedislerByDate"
              :key="hakedis.id"
            >
              <td>{{ hakedis.id }}</td>
              <td>{{ hakedis.order_id }}</td>
              <td>{{ hakedis.product_id }}</td>
              <td>{{ hakedis.price }}</td>
              <td>{{ hakedis.quantity }}</td>
              <td>{{ hakedis.total_price }}</td>
            </tr>
          </tbody>
        </VTable>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>

<style scoped>
.v-expansion-panel-header {
  font-weight: bold;
}
</style>
