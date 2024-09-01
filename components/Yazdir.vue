<script lang="ts" setup>
import { defineProps, onMounted } from 'vue'
import printJS from 'print-js'

// Prop'ları tanımla
const props = defineProps<{
  platform: 'n11' | 'hepsiburada' | 'pazarama'
  customerName: string
  city: string
  district: string
  shippingCompanyName: string
  barcodeNumber: string
  items: Array<{
    product: {
      productCode: string
    }
    stockCode: string
  }>
}>()

const watermarkText = `${props.shippingCompanyName.toUpperCase()} `.repeat(500)

function getShippingLogo() {
  const logos: { [key: string]: string } = {
    'sürat kargo': 'https://galeri12.uludagsozluk.com/590/surat-kargo_620735.png',
    'yurtiçi kargo': 'https://upload.wikimedia.org/wikipedia/tr/a/a6/YurticiKargo_Logo.gif',
    'mng kargo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/MNG_Cargo_logo.svg/320px-MNG_Cargo_logo.svg.png',
    'mng': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/MNG_Cargo_logo.svg/320px-MNG_Cargo_logo.svg.png',
  }

  return logos[props.shippingCompanyName.toLowerCase()] || ''
}

function printContent() {
  // Her item için ayrı etiket HTML'i oluştur
  const content = props.items.map(item => `
    <div class="label">
      <div class="header">
        <p class="customer-name">${props.customerName}</p>
        <p class="location">${props.city} / ${props.district}</p>
      </div>
      <div class="shipping-logo-container">
     
        <img src="${getShippingLogo()}" alt="Kargo Firması Logo" class="shipping-logo" />
       </div>
       
      <div class="logos">
        <img src="${props.platform === 'n11' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/N11_logo.svg/320px-N11_logo.svg.png' : props.platform === 'hepsiburada' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Hepsiburada_logo_official.svg/320px-Hepsiburada_logo_official.svg.png' : props.platform === 'pazarama' ? 'https://birfatura.com/wp-content/uploads/2022/03/pazarama-pazaryeri-entegrasyonu.svg' : ''}" alt="Platform Logo" class="logo ${props.platform === 'n11' ? 'n11-logo' : ''}" />
      </div>
      <div class="barcode">
        <img src="https://barcode.tec-it.com/barcode.ashx?data=${props.barcodeNumber}&code=Code128" alt="Barkod" />
      </div>
      <div class="footer">
        <p class="stock-code">Stok Kodu: ${item.product.productCode}</p>
      </div>
    </div>
  `).join('')

  printJS({
    printable: content,
    type: 'raw-html',
    targetStyles: ['*'],
    style: `
      @page {
        size: 10.4cm 10.4cm; /* Sayfa boyutu ayarı */
        margin: 0; /* Kenar boşluklarını sıfırlama */
      }
      .label {
  display: flex;
  box-sizing: border-box; /* Kenar boşluklarını ve içeriği doğru bir şekilde hesaplamak için */
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border: 1px solid black; /* Kenarlık (isteğe bağlı) */
  block-size: 10cm; /* İçerik alanı */
  font-family: Arial, sans-serif;
  inline-size: 10cm; /* İçerik alanı */
  margin-bottom:0.35cm;
  width: 10cm;
  height: 10cm;
  position: relative; /* Pseudo-element konumlandırma için gerekli */
  overflow: hidden; /* Taşmaları önlemek için */
}

.label::before {
  content: '${watermarkText}'; /* Watermark metni */
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%; /* Genişliği artırarak tüm arka plana yayılır */
  height: 200%; /* Yüksekliği artırarak tüm arka plana yayılır */
  transform: rotate(-45deg); /* Ortala ve döndür */
  font-size: 1.2rem;
  color: rgba(0, 0, 0, 0.1); /* Şeffaflık ayarı */
  z-index: 1; /* Diğer içeriklerin altında kalması için */
  pointer-events: none; /* Tıklanamaz hale getir */
}

.header {
  margin-block: 0.5cm 0.5cm /* Müşteri bilgilerini 0.5 cm aşağı kaydır */
}

.header,
.barcode,
.shipping-logo-container {
  position: relative; /* Üstte kalması için */
  z-index: 2; /* Watermark altında */
}



.customer-name {
  padding: 0;
  margin: 0;
  font-size: 1em;
}

.location {
  padding: 0;
  margin: 0;
  font-size: 0.8em;
}

.logos {
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.logo {
  margin: 0;
  block-size: auto;
  inline-size: 120px; /* Platform logosunun boyutunu ayarlayın */
}

.n11-logo {
  inline-size: 70px;
}

.shipping-logo-container {
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
   width: 100%;
  margin-block-start: 0.5cm; /* Kargo logosu için üstten boşluk */
}

.shipping-logo {
  margin: 0;
  max-width: 100%;
  block-size: auto;
  inline-size: 250px; /* Kargo firmasının logosunun boyutunu ayarlayın */
 
}

.barcode {
  padding: 0;
  margin: 0;
  text-align: center;
}

.barcode img {
  block-size: auto; /* Barkod boyutunu ayarlayın */
  max-inline-size: 100%;
}

.footer {
  text-align: center;
}

.stock-code {
  padding: 0;
  margin: 0;
  font-size: 0.8em;
}
    `,
    scanStyles: false,
    honorMarginPadding: false,
  })
}
</script>

<template>
  <div>
    <!-- Etiketlerin tümünü içeren HTML'yi dinamik olarak oluştur -->
    <div
      v-for="(item, index) in items"
      :key="index"
      class="label"
      style="display: none;"
    >
      <div class="header">
        <p class="customer-name">
          {{ customerName }}
        </p>
        <p class="location">
          {{ city }} / {{ district }}
        </p>
      </div>

      <div class="shipping-logo-container">
        <img
          :src="getShippingLogo()"
          alt="Kargo Firması Logo"
          class="shipping-logo"
        >
      </div>
      <div class="logos">
        <img
          v-if="platform === 'n11'"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/N11_logo.svg/320px-N11_logo.svg.png"
          alt="n11 Logo"
          class="logo n11-logo"
        >
        <img
          v-if="platform === 'hepsiburada'"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Hepsiburada_logo_official.svg/320px-Hepsiburada_logo_official.svg.png"
          alt="Hepsiburada Logo"
          class="logo"
        >
        <img
          v-if="platform === 'pazarama'"
          src="https://birfatura.com/wp-content/uploads/2022/03/pazarama-pazaryeri-entegrasyonu.svg"
          alt="Pazarama Logo"
          class="logo"
        >
      </div>

      <div class="barcode">
        <!-- Dinamik olarak barkod verisini içeren URL -->
        <img
          :src="`https://barcode.tec-it.com/barcode.ashx?data=${barcodeNumber}&code=Code128`"
          alt="Barkod"
        >
      </div>
      <div class="footer">
        <p class="stock-code">
          Stok Kodu: {{ item.product.productCode }}
        </p>
      </div>
    </div>
    <a
      href="#"
      class="print-link"
      @click.prevent="printContent"
    > Etiket Yazdır</a>
  </div>
</template>

<style scoped>
.label {
  display: flex;
  box-sizing: border-box; /* Kenar boşluklarını ve içeriği doğru bir şekilde hesaplamak için */
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border: 1px solid black; /* Kenarlık (isteğe bağlı) */
  block-size: 10cm; /* İçerik alanı */
  font-family: Arial, sans-serif;
  inline-size: 10cm; /* İçerik alanı */
}

.header {
  margin-block: 0.5cm 0.5cm /* Müşteri bilgilerini 0.5 cm aşağı kaydır */
}

.customer-name {
  padding: 0;
  margin: 0;
  font-size: 1em;
}

.location {
  padding: 0;
  margin: 0;
  font-size: 0.8em;
}

.logos {
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.logo {
  margin: 0;
  block-size: auto;
  inline-size: 200px; /* Platform logosunun boyutunu ayarlayın */
}

.n11-logo {
  inline-size: 100px !important;
}

.shipping-logo-container {
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
  margin-block-start: 0.5cm; /* Kargo logosu için üstten boşluk */
}

.shipping-logo {
  margin: 0;
  block-size: auto;
  inline-size: 150px; /* Kargo firmasının logosunun boyutunu ayarlayın */
}

.barcode {
  padding: 0;
  margin: 0;
  text-align: center;
}

#watermark {
  position: relative;
  overflow: hidden;
}

#watermark p {
  position: relative;
  color: #fff;
  font-size: 18px;
  inset-block-start: 0;
  inset-inline-start: 0;
  pointer-events: none;
  transform: rotate(-45deg);
}

.barcode img {
  block-size: auto; /* Barkod boyutunu ayarlayın */
  max-inline-size: 100%;
}

.footer {
  text-align: center;
}

.stock-code {
  padding: 0;
  margin: 0;
  font-size: 0.8em;
}

.print-link {
  color: blue; /* Renk ayarı (isteğe bağlı) */
  font-size: 1em; /* Yazı boyutu ayarı (isteğe bağlı) */
  font-size:12px;
  text-decoration: underline ;/* Bağlantıyı çizili yapar */
}

@media print {
  .label {
    box-sizing: border-box; /* Kenar boşluklarını ve içeriği doğru bir şekilde hesaplamak için */
    padding: 0;
    margin: 0;
    block-size: 10cm; /* İçerik alanı */
    inline-size: 10cm; /* İçerik alanı */
  }

  /* İkinci sayfayı biraz daha aşağıdan başlatmak için ekstra bir boşluk ekleyin */
  .label:nth-child(n+1) { /* İkinci sayfada 2 cm'lik boşluk ekleyin, bu değeri ihtiyaca göre ayarlayabilirsiniz */
    margin-block-start:2cm;
  }
}
</style>
