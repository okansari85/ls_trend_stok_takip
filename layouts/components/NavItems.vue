<!-- eslint-disable-->
<script lang="ts" setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue';
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue';
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue';
const show = ref(false);
</script>

<template>
  <!-- 👉 Stok Hareketleri -->
  <VerticalNavLink
    :item="{
      title: 'Stok Giriş/Çıkış',
      to: '/stok-hareketleri',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Geçmiş Hareketler',
      to: '/stock-moevements',
    }"
  />

  <!-- 👉 Dashboards -->
  <VerticalNavGroup
    v-show="show"
    :item="{
      title: 'Dashboards',
      badgeContent: '5',
      badgeClass: 'bg-error',
      icon: 'ri-home-smile-line',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'Analytics',
        to: '/dashboard',
      }"
    />
  </VerticalNavGroup>

  <!-- 👉 Apps & Pages -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'TANIMLAMALAR',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Depo & Raflar',
      icon: 'ri-user-settings-line',
      to: '/account-settings',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Malzemeler',
      icon: 'ri-bar-chart-box-line',
      to: '/malzemeler',
    }"
  />

  <VerticalNavLink
    v-show="show"
    :item="{
      title: 'Login',
      icon: 'ri-login-box-line',
      to: '/login',
    }"
  />
  <VerticalNavLink
    v-show="show"
    :item="{
      title: 'Register',
      icon: 'ri-user-add-line',
      to: '/register',
    }"
  />
  <VerticalNavLink
    v-show="show"
    :item="{
      title: 'Error',
      icon: 'ri-information-line',
      to: '/no-existence',
    }"
  />

  <!-- 👉 User Interface -->
  <VerticalNavSectionTitle
    v-show="show"
    :item="{
      heading: 'User Interface',
    }"
  />
  <VerticalNavLink
    v-show="show"
    :item="{
      title: 'Typography',
      icon: 'ri-text',
      to: '/typography',
    }"
  />
  <VerticalNavLink
    v-show="show"
    :item="{
      title: 'Icons',
      icon: 'ri-remixicon-line',
      to: '/icons',
    }"
  />
  <VerticalNavLink
    v-show="show"
    :item="{
      title: 'Cards',
      icon: 'ri-bar-chart-box-line',
      to: '/cards',
    }"
  />

  <!-- 👉 Forms & Tables -->
  <VerticalNavSectionTitle
    v-show="show"
    :item="{
      heading: 'Forms & Tables',
    }"
  />
  <VerticalNavLink
    v-show="show"
    :item="{
      title: 'Form Layouts',
      icon: 'ri-layout-4-line',
      to: '/form-layouts',
    }"
  />
  <VerticalNavLink
    v-show="show"
    :item="{
      title: 'Tables',
      icon: 'ri-table-alt-line',
      to: '/tables',
    }"
  />
</template>
