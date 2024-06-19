<script setup lang="ts">
import { useTheme } from 'vuetify'

import logo from '@images/ls-trend-logo-removebg-preview.png'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import { FetchError } from 'ofetch'

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const loginvalid = ref(false)
const loginform = ref()
const loading = ref(false)
const errorMessage = ref()

const vuetifyTheme = useTheme()
const { login } = useSanctumAuth()

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
]

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 6 || 'Password must be at least 6 characters',
]

const handleLogin = async () => {
  loginform.value?.validate()
  if (loginvalid.value) {
    loading.value = true
    errorMessage.value = ''
    try {
      await login(form.value).then(res => {
        console.log(res)
      })
    }
    catch (e) {
      if (e instanceof FetchError && e.response?.status === 422) {
        errorMessage.value = e.response?._data.message || 'An error occurred'

        return
      }
      errorMessage.value = e || 'An error occurred'
    }
    finally {
      loading.value = false
    }
  }
}

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? authV1MaskLight
    : authV1MaskDark
})

const isPasswordVisible = ref(false)

definePageMeta({ layout: 'blank' })
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <img
            :src="logo"
            width="175"
            role="link"
          >
        </template>
      </VCardItem>

      <VCardText>
        <VForm
          ref="loginform"
          v-model="loginvalid"
          lazy-validation
          @submit.prevent="() => {}"
        >
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                label="Email"
                type="email"
                :rules="emailRules"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Password"
                placeholder="············"
                :rules="passwordRules"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <VCheckbox
                  v-model="form.remember"
                  label="Remember me"
                />

                <a
                  class="ms-2 mb-1"
                  href="javascript:void(0)"
                >
                  Şifremi Unuttum?
                </a>
              </div>
              <VAlert
                v-if="errorMessage"
                type="error"
                class="mb-3"
              >
                {{ errorMessage }}
              </VAlert>
              <!-- login button -->
              <VBtn
                block
                type="submit"
                to="/"
                :disabled="!loginvalid || loading"
                :loading="loading"
                @click="handleLogin"
              >
                Sisteme Giriş
              </VBtn>
            </VCol>
            <VCol
              cols="12"
              class="d-flex align-center"
            />
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VImg
      class="auth-footer-start-tree d-none d-md-block"
      :src="authV1Tree"
      :width="250"
    />

    <VImg
      :src="authV1Tree2"
      class="auth-footer-end-tree d-none d-md-block"
      :width="350"
    />

    <!-- bg img -->
    <VImg
      class="auth-footer-mask d-none d-md-block"
      :src="authThemeMask"
    />
  </div>
</template>

<style lang="scss">
@use "@core/scss/pages/page-auth.scss";
</style>
