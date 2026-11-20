<script setup>
defineProps({
  tenant: { type: Object, required: true },
  section: { type: Object, required: true }
})
</script>

<template>
  <section :id="section.id" class="content-section location-section" :aria-labelledby="`${section.id}-heading`" v-reveal>
    <div class="page-frame location-section__grid">
      <div class="section-intro">
        <p class="eyebrow">{{ section.eyebrow }}</p>
        <h2 :id="`${section.id}-heading`">{{ section.title }}</h2>
        <p class="section-intro__text">{{ section.text }}</p>
      </div>

      <div class="location-card">
        <div class="location-card__pin" aria-hidden="true">⌖</div>
        <div>
          <p class="location-card__label">{{ section.addressLabel }}</p>
          <p>{{ section.address || tenant.contact.address }}</p>
          <p class="location-card__muted">{{ section.schedule || tenant.contact.schedule }}</p>
        </div>
        <a v-if="section.mapUrl" class="text-link" :href="section.mapUrl" target="_blank" rel="noopener noreferrer">
          Cómo llegar <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  </section>
</template>
