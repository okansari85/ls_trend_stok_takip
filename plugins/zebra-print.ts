import ZebraBrowserPrintWrapper from 'zebra-browser-print-wrapper'

import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('zebraPrint', new ZebraBrowserPrintWrapper())
})
