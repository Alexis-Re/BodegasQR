<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import TenantShell from '../components/layout/TenantShell.vue'
import { getTenantBySlug } from '../config/tenants'

const route = useRoute()

const tenant = computed(() => getTenantBySlug(route.params.slug))

watchEffect(() => {
  document.title = tenant.value?.seo?.title || 'Bodega QR'

  const description = document.querySelector('meta[name="description"]')
  if (description && tenant.value?.seo?.description) {
    description.setAttribute('content', tenant.value.seo.description)
  }
})
</script>

<template>
  <TenantShell v-if="tenant" :tenant="tenant" />

  <main v-else class="missing-tenant page-frame">
    <p class="eyebrow">Bodega no disponible</p>
    <h1>No encontramos esta experiencia.</h1>
    <p>Revisa el enlace del codigo QR o solicita una URL actualizada.</p>
    <RouterLink class="button button--primary" to="/bodega/bodega-aurora">
      Ver ejemplo
    </RouterLink>
  </main>
</template>
