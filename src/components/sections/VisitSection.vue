<script setup>
import RegistrationForm from '../forms/RegistrationForm.vue'

defineProps({
  tenant: { type: Object, required: true },
  section: { type: Object, required: true }
})
</script>

<template>
  <section :id="section.id" class="content-section visit-section" :aria-labelledby="`${section.id}-heading`">
    <div class="page-frame visit-section__grid">
      <div class="visit-section__copy section-intro" v-reveal:left>
        <p class="eyebrow">{{ section.eyebrow }}</p>
        <h2 :id="`${section.id}-heading`">{{ section.title }}</h2>
        <p class="section-intro__text">{{ section.text }}</p>

        <dl class="visit-facts">
          <div v-for="fact in section.facts" :key="fact.label" class="visit-fact">
            <dt>{{ fact.label }}</dt>
            <dd><strong>{{ fact.value }}</strong></dd>
          </div>
        </dl>
        <p class="footer-note">{{ tenant.contact.email }}</p>
      </div>

      <RegistrationForm v-reveal:right :tenant="tenant" />
    </div>
  </section>
</template>
