<script setup>
defineProps({
  tenant: { type: Object, required: true },
  section: { type: Object, required: true }
})
</script>

<template>
  <section :id="section.id" class="content-section about-section" :aria-labelledby="`${section.id}-heading`" v-reveal>
    <div class="page-frame about-section__grid">
      <div class="section-intro">
        <p class="eyebrow">{{ section.eyebrow }}</p>
        <h2 :id="`${section.id}-heading`">{{ section.title }}</h2>
        <p class="section-intro__text">{{ section.text }}</p>
      </div>

      <div class="about-section__aside">
        <figure class="about-section__visual">
          <img :src="section.image || tenant.assets.about" :alt="section.imageAlt" loading="lazy" />
          <figcaption class="about-section__visual-label">{{ section.imageLabel }}</figcaption>
        </figure>
        <div class="about-section__aside-copy">
          <span class="aside-line" aria-hidden="true"></span>
          <p>{{ section.asideLabel }}</p>
          <strong>{{ section.asideText }}</strong>
        </div>
      </div>
    </div>
  </section>
</template>
