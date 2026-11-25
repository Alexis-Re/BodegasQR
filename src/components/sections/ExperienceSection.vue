<script setup>
import { computed } from 'vue'

const props = defineProps({
  tenant: { type: Object, required: true },
  section: { type: Object, required: true }
})

const backgroundStyle = computed(() => {
  if (!props.section.backgroundImage) return undefined

  return {
    '--experience-background-image': `url("${props.section.backgroundImage}")`
  }
})
</script>

<template>
  <section
    :id="section.id"
    class="content-section experience-section"
    :class="{ 'experience-section--image': section.backgroundImage }"
    :style="backgroundStyle"
    :aria-labelledby="`${section.id}-heading`"
  >
    <div class="page-frame">
      <div class="section-intro" v-reveal:left>
        <p class="eyebrow">{{ section.eyebrow }}</p>
        <h2 :id="`${section.id}-heading`">{{ section.title }}</h2>
        <p class="section-intro__text">{{ section.text }}</p>
      </div>

      <div class="experience-grid">
        <article
          v-for="(card, index) in section.cards"
          :key="card.title"
          class="experience-card"
          v-reveal
        >
          <figure class="experience-card__media" :aria-hidden="!card.image">
            <img
              v-if="card.image"
              :src="card.image"
              :alt="card.imageAlt || ''"
              :style="card.imagePosition ? { objectPosition: card.imagePosition } : undefined"
              loading="lazy"
              decoding="async"
            />
            <span class="experience-card__number" aria-hidden="true">0{{ index + 1 }}</span>
          </figure>

          <div class="experience-card__body">
            <h3>{{ card.title }}</h3>
            <span class="experience-card__rule" aria-hidden="true"></span>
            <p>{{ card.text }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
