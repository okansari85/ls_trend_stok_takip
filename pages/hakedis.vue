<script lang="ts" setup>
import { useHakedisStore } from '@/stores/hakedisler'

const hakedisler = useHakedisStore()

// Bileşen yüklendiğinde günlük hakedisleri al
onMounted(() => {
  hakedisler.fetchData()
})

const formatNumber = number => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)
}
</script>

<template>
  <VExpansionPanels multiple>
    <VExpansionPanel
      v-for="(hakedislerByDate, date) in hakedisler.hakedisler"
      :key="date"
      :title="`${date} Toplam Tutar : ${hakedislerByDate.totalAmount}`"
      :text="`Toplam Tutar : ${hakedislerByDate.totalAmount}`"
    >
      <VExpansionPanelText>
        <VTable density="compact">
          <thead>
            <tr>
              <th class="text-left">
                #
              </th>
              <th class="text-left">
                Sipariş
              </th>
              <th class="text-left">
                Ürün
              </th>
              <th class="text-left">
                Fiyat
              </th>
              <th class="text-left">
                10% Dahil
              </th>
              <th class="text-left">
                20% KDV
              </th>
              <th class="text-left">
                Quantity
              </th>
              <th class="text-left">
                Adet Toplamı
              </th>
              <th class="text-left">
                Paketleme Ücreti
              </th>
              <th class="text-left">
                Total Price
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(hakedis, index) in hakedislerByDate.hakedisler"
              :key="hakedis.id"
            >
              <td>{{ index + 1 }}</td>
              <td>
                <div><span>{{ hakedis.order.buyer.fullName }}</span></div>
                <div><small>{{ hakedis.order.buyer.adresses[0].city }} / {{ hakedis.order.buyer.adresses[0].district }}</small></div>
              </td>
              <td>{{ hakedis.product.productCode }}</td>
              <td>{{ formatNumber(hakedis.price) }}</td>
              <td>{{ formatNumber(hakedis.price * 1.10) }}</td>
              <td>{{ formatNumber(hakedis.price * 1.10 * 1.20) }}</td>
              <td>{{ hakedis.quantity }}</td>
              <td>{{ formatNumber(hakedis.price * 1.10 * 1.20 * hakedis.quantity) }}</td>
              <td>{{ formatNumber(hakedis.packet_price) }}</td>
              <td>{{ formatNumber(hakedis.total_price) }}</td>
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
