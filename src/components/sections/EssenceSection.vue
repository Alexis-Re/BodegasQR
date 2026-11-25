<script setup>
defineProps({
  tenant: { type: Object, required: true },
  section: { type: Object, required: true }
})
</script>

<template>
  <section :id="section.id" class="content-section essence-section" :aria-labelledby="`${section.id}-heading`">
    <div class="page-frame essence-section__grid">
      <figure class="essence-section__visual" v-reveal:left>
        <img :src="section.image || tenant.assets.essence" :alt="section.imageAlt" loading="lazy" />
        <figcaption class="essence-section__label">{{ section.imageLabel }}</figcaption>
      </figure>

      <div class="essence-section__copy section-intro" v-reveal:right>
        <p class="eyebrow">{{ section.eyebrow }}</p>
        <h2 :id="`${section.id}-heading`">{{ section.title }}</h2>
        <p class="section-intro__text">{{ section.text }}</p>

        <dl class="essence-section__facts">
          <div v-for="fact in section.facts" :key="fact.label">
            <dt>{{ fact.label }}</dt>
            <dd><strong>{{ fact.value }}</strong></dd>
          </div>
        </dl>

        <a class="text-link" href="#experiencias">
          {{ section.linkLabel }} <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </section>
</template>
