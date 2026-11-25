<script setup>
defineProps({
  tenant: { type: Object, required: true },
  section: { type: Object, required: true }
})
</script>

<template>
  <section :id="section.id" class="content-section gallery-section" :aria-labelledby="`${section.id}-heading`">
    <div class="page-frame">
      <div class="section-intro" v-reveal:left>
        <p class="eyebrow">{{ section.eyebrow }}</p>
        <h2 :id="`${section.id}-heading`">{{ section.title }}</h2>
        <p class="section-intro__text">{{ section.text }}</p>
      </div>

      <div class="gallery-grid">
        <figure
          v-for="(item, index) in section.images || tenant.assets.gallery"
          :key="item.image"
          class="gallery-card"
          :class="`gallery-card--${index + 1}`"
          v-reveal:scale
        >
          <img :src="item.image" :alt="item.alt" loading="lazy" />
          <figcaption><span>0{{ index + 1 }}</span>{{ item.caption }}</figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
