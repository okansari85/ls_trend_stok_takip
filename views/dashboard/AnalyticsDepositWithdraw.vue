<script setup lang="ts">
import americanBank from '@images/logos/american-bank.png'
import aws from '@images/logos/aws.png'
import citiBank from '@images/logos/citi-bank.png'
import digitalOcean from '@images/logos/digital-ocean.png'
import github from '@images/logos/github.png'
import google from '@images/logos/google.png'
import gumroad from '@images/logos/gumroad.png'
import mastercardLabel from '@images/logos/mastercard-label.png'
import slack from '@images/logos/slack.png'
import stripe from '@images/logos/stripe.png'

const deposits = [
  {
    name: 'Nebula GTX 3080',
    image: '1.png',
    price: 699.99,
    rating: 5,
    stock: true,
  },
  {
    name: 'Galaxy RTX 3080',
    image: '2.png',
    price: 799.99,
    rating: 4,
    stock: false,
  },
  {
    name: 'Orion RX 6800 XT',
    image: '3.png',
    price: 649.99,
    rating: 3,
    stock: true,
  },
  {
    name: 'Vortex RTX 3090',
    image: '4.png',
    price: 1499.99,
    rating: 4,
    stock: true,
  },
  {
    name: 'Cosmos GTX 1660 Super',
    image: '5.png',
    price: 299.99,
    rating: 4,
    stock: false,
  },
]

const search = ref('')
</script>

<template>
  <VCard>
    <VRow no-gutters>
      <VCol
        cols="12"
        md="12"
      >
        <VCardItem>
          <VCardTitle>Deposit</VCardTitle>

          <template #append>
            <h6 class="text-h6">
              <a
                href="javascript:void(0)"
                class="text-primary"
              >View All</a>
            </h6>
          </template>
        </VCardItem>

        <VCardText>
          <VDataTable
            v-model:search="search"
            :items="deposits"
          >
            <template #header.stock>
              <div class="text-end">
                Stock
              </div>
            </template>

            <template #item.image="{ item }">
              <VCard
                class="my-2"
                elevation="2"
                rounded
              >
                <VImg
                  :src="`https://cdn.vuetifyjs.com/docs/images/graphics/gpus/${item.image}`"
                  height="64"
                  cover
                />
              </VCard>
            </template>

            <template #item.rating="{ item }">
              <VRating
                :model-value="item.rating"
                color="orange-darken-2"
                density="compact"
                size="small"
                readonly
              />
            </template>

            <template #item.stock="{ item }">
              <div class="text-end">
                <VChip
                  :color="item.stock ? 'green' : 'red'"
                  :text="item.stock ? 'In stock' : 'Out of stock'"
                  class="text-uppercase"
                  size="small"
                  label
                />
              </div>
            </template>
          </VDataTable>
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1.25rem;
}
</style>
