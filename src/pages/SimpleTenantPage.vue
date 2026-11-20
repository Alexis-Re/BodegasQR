<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import SiteFooter from '../components/layout/SiteFooter.vue'
import RegistrationForm from '../components/forms/RegistrationForm.vue'
import { getTenantBySlug } from '../config/tenants'

const route = useRoute()
const tenant = computed(() => getTenantBySlug(route.params.slug))

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
      <section id="informacion" class="simple-intro" v-reveal>
        <div class="page-frame simple-intro__grid">
          <div class="simple-intro__copy">
            <p class="eyebrow"><span></span>Informacion de la bodega</p>
            <h1>{{ tenant.name }}</h1>
            <p class="simple-intro__description">{{ tenant.description }}</p>
            <a class="button button--primary" href="#registro">Completar registro <span>-&gt;</span></a>
          </div>
          <div class="simple-intro__media">
            <img
              :src="tenant.assets.registrationHero || tenant.assets.hero"
              :alt="tenant.assets.registrationHeroAlt || `Paisaje de ${tenant.name}`"
              :style="tenant.assets.registrationHero ? { objectPosition: '68% center' } : undefined"
            />
            <div class="simple-intro__media-label">
              <span>01</span>
              <strong>Una visita<br />para recordar</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="simple-details" v-reveal>
        <div class="page-frame simple-details__grid">
          <div>
            <p class="eyebrow">Tu visita</p>
            <h2>Todo empieza con un registro simple.</h2>
          </div>
          <dl class="simple-details__list">
            <div>
              <dt>Direccion</dt>
              <dd>{{ tenant.contact.address }}</dd>
            </div>
            <div>
              <dt>Atencion</dt>
              <dd>{{ tenant.contact.schedule }}</dd>
            </div>
            <div>
              <dt>Contacto</dt>
              <dd>{{ tenant.contact.email }}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="registro" class="simple-registration" v-reveal>
        <div class="page-frame simple-registration__grid">
          <div class="simple-registration__copy">
            <p class="eyebrow eyebrow--light">Registro de visita</p>
            <h2>Gracias por compartir este momento.</h2>
            <p>Completa tus datos en menos de un minuto. Nos ayuda a conocerte y a seguir en contacto despues de tu visita.</p>
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
    <RouterLink class="button button--primary" to="/bodega/bodega-aurora">Ver ejemplo</RouterLink>
  </main>
</template>
