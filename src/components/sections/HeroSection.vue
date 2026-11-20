<script setup>
import { computed } from 'vue'

const props = defineProps({
  tenant: { type: Object, required: true },
  section: { type: Object, required: true }
})

const imageStyle = computed(() => ({
  backgroundImage: `url("${props.section.image || props.tenant.assets.hero}")`
}))
</script>

<template>
  <section :id="section.id" class="hero-section" :aria-labelledby="`${section.id}-heading`">
    <div class="hero-section__image" :style="imageStyle" role="img" :aria-label="section.imageAlt"></div>
    <div class="hero-section__veil" aria-hidden="true"></div>

    <div class="page-frame hero-section__content">
      <div class="hero-copy">
        <p class="eyebrow hero-copy__eyebrow"><span aria-hidden="true"></span>{{ section.eyebrow }}</p>
        <h1 :id="`${section.id}-heading`">{{ section.title }}</h1>
        <p class="hero-copy__tagline">{{ section.tagline }}</p>
        <div class="hero-copy__meta" aria-label="Información de la experiencia">
          <span>{{ tenant.name }}</span>
          <span>{{ tenant.contact.address }}</span>
        </div>
        <div class="hero-copy__actions">
          <a class="button button--accent" href="#experiencias">
            {{ section.primaryActionLabel }} <span aria-hidden="true">→</span>
          </a>
          <a class="text-link text-link--light" href="#registro">
            {{ section.secondaryActionLabel }} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <aside class="hero-side" aria-label="Una mirada a la experiencia">
        <div class="hero-mark" role="img" :aria-label="section.markLabel">
          <span>{{ section.mark }}</span>
          <small>{{ section.markLabel }}</small>
        </div>
        <div class="hero-side__card">
          <span class="hero-side__index">{{ section.sideIndex }} <i>/ 03</i></span>
          <strong>{{ section.sideTitle }}</strong>
          <span class="hero-side__line" aria-hidden="true"></span>
          <small>{{ section.sideText }}</small>
        </div>
      </aside>
    </div>

    <a class="hero-section__scroll" href="#esencia">
      Desliza para descubrir <span aria-hidden="true">↓</span>
    </a>
  </section>
</template>
