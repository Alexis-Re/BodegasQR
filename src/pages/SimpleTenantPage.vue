<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import SiteFooter from '../components/layout/SiteFooter.vue'
import RegistrationForm from '../components/forms/RegistrationForm.vue'
import { getTenantBySlug } from '../config/tenants'

const route = useRoute()
const tenant = computed(() => getTenantBySlug(route.params.slug))
const registrationBackground = computed(
  () => tenant.value?.assets.registrationHero || tenant.value?.assets.hero
)

const themeStyle = computed(() => {
  if (!tenant.value) return {}

  return {
    '--color-primary': tenant.value.theme.primary,
    '--color-primary-dark': tenant.value.theme.primaryDark,
    '--color-accent': tenant.value.theme.accent,
    '--color-accent-soft': tenant.value.theme.accentSoft,
    '--color-surface': tenant.value.theme.surface,
    '--color-surface-strong': tenant.value.theme.surfaceStrong,
    '--color-text': tenant.value.theme.text,
    '--color-muted': tenant.value.theme.muted
  }
})

watchEffect(() => {
  document.title = tenant.value?.seo?.title ? `Registro | ${tenant.value.seo.title}` : 'Registro | Bodega QR'
})
</script>

<template>
  <div v-if="tenant" class="tenant-site simple-site" :style="themeStyle">
    <header class="simple-header">
      <div class="page-frame simple-header__inner">
        <RouterLink class="simple-brand" :to="{ name: 'tenant-landing', params: { slug: tenant.slug } }">
          <img :src="tenant.assets.logo" :alt="`Logo de ${tenant.name}`" />
          <span>
            <strong>{{ tenant.shortName }}</strong>
            <small>Registro de visitantes</small>
          </span>
        </RouterLink>
        <RouterLink class="simple-header__back" :to="{ name: 'tenant-landing', params: { slug: tenant.slug } }">
          Ver experiencia completa <span>-&gt;</span>
        </RouterLink>
      </div>
    </header>

    <main>
      <section
        id="registro"
        class="registration-page"
        :style="{ '--registration-background': `url('${registrationBackground}')` }"
        aria-labelledby="registration-page-heading"
      >
        <div class="page-frame registration-page__grid">
          <div class="registration-page__copy">
            <p class="eyebrow eyebrow--light">Registro de visita</p>
            <h1 id="registration-page-heading">Registra tu visita</h1>
            <p>Gracias por visitarnos. Completa tus datos para dejar registrado tu paso por {{ tenant.name }}.</p>
          </div>
          <RegistrationForm v-reveal :tenant="tenant" />
        </div>
      </section>
    </main>

    <SiteFooter :tenant="tenant" />
  </div>

  <main v-else class="missing-tenant page-frame">
    <p class="eyebrow">Bodega no disponible</p>
    <h1>No encontramos esta experiencia.</h1>
    <RouterLink class="button button--primary" to="/bodega/bodega-aurora/registro">Ir al registro</RouterLink>
  </main>
</template>
