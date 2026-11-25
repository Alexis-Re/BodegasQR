<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { sectionRegistry } from '../../config/sectionRegistry'
import SiteFooter from './SiteFooter.vue'

const props = defineProps({
  tenant: {
    type: Object,
    required: true
  }
})

const route = useRoute()
const menuOpen = ref(false)
const isScrolled = ref(false)
const headerElement = ref(null)
const menuToggle = ref(null)
let scrollFrame = 0
const navigationId = computed(() => `${props.tenant.slug}-main-navigation`)
const navigationItems = computed(() =>
  props.tenant.sections.filter((section) => section.id && section.navLabel)
)

const themeStyle = computed(() => ({
  '--color-primary': props.tenant.theme.primary,
  '--color-primary-dark': props.tenant.theme.primaryDark,
  '--color-accent': props.tenant.theme.accent,
  '--color-accent-soft': props.tenant.theme.accentSoft,
  '--color-surface': props.tenant.theme.surface,
  '--color-surface-strong': props.tenant.theme.surfaceStrong,
  '--color-text': props.tenant.theme.text,
  '--color-muted': props.tenant.theme.muted
}))

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  }
)

function closeMenu() {
  menuOpen.value = false
}

function handleDocumentPointerDown(event) {
  if (menuOpen.value && !headerElement.value?.contains(event.target)) {
    closeMenu()
  }
}

function handleEscape() {
  if (!menuOpen.value) return

  closeMenu()
  menuToggle.value?.focus()
}

function handleScroll() {
  if (scrollFrame) return

  scrollFrame = window.requestAnimationFrame(() => {
    isScrolled.value = window.scrollY > 48
    scrollFrame = 0
  })
}

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown)
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  window.removeEventListener('scroll', handleScroll)
  if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
})
</script>

<template>
  <div class="tenant-site" :style="themeStyle">
    <header
      ref="headerElement"
      class="site-header"
      :class="{ 'site-header--scrolled': isScrolled }"
      @keydown.esc="handleEscape"
    >
      <div class="page-frame site-header__inner">
        <a class="brand" href="#inicio" @click="closeMenu">
          <img :src="tenant.assets.logo" :alt="`Logo de ${tenant.name}`" />
          <span>
            <strong>{{ tenant.shortName }}</strong>
            <small>Registro de visitantes</small>
          </span>
        </a>

        <span class="header-status" aria-label="Registro de visitantes">
          <i aria-hidden="true"></i>
          Registro de visitantes
        </span>

        <button
          ref="menuToggle"
          class="menu-toggle"
          type="button"
          :aria-expanded="menuOpen"
          :aria-controls="navigationId"
          :aria-label="menuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'"
          @click="menuOpen = !menuOpen"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>

        <nav
          :id="navigationId"
          class="main-navigation"
          :class="{ 'main-navigation--open': menuOpen }"
          :aria-label="`Navegación de ${tenant.name}`"
        >
          <a
            v-for="item in navigationItems"
            :key="item.id"
            :href="`#${item.id}`"
            @click="closeMenu"
          >
            {{ item.navLabel }}
          </a>
          <a class="nav-cta" href="#registro" @click="closeMenu">Registrar mi visita</a>
        </nav>
      </div>
    </header>

    <main id="contenido-principal">
      <template v-for="section in tenant.sections" :key="section.id || section.type">
        <component
          :is="sectionRegistry[section.type]"
          v-if="sectionRegistry[section.type]"
          :tenant="tenant"
          :section="section"
        />
      </template>
    </main>

    <SiteFooter :tenant="tenant" />
  </div>
</template>
