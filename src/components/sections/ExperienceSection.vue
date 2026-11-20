<script setup>
defineProps({
  tenant: { type: Object, required: true },
  section: { type: Object, required: true }
})
</script>

<template>
  <section :id="section.id" class="content-section experience-section" :aria-labelledby="`${section.id}-heading`" v-reveal>
    <div class="page-frame">
      <div class="section-intro">
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
          <span class="experience-card__number">0{{ index + 1 }}</span>
          <span class="experience-card__dot" aria-hidden="true"></span>
          <h3>{{ card.title }}</h3>
          <p>{{ card.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
