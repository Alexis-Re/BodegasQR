<script setup>
import RegistrationForm from '../forms/RegistrationForm.vue'

defineProps({
  tenant: { type: Object, required: true },
  section: { type: Object, required: true }
})
</script>

<template>
  <section :id="section.id" class="registration-section" :aria-labelledby="`${section.id}-heading`">
    <div class="page-frame registration-section__grid">
      <div class="registration-section__copy" v-reveal:left>
        <p class="eyebrow eyebrow--light">{{ section.eyebrow }}</p>
        <h2 :id="`${section.id}-heading`">{{ section.title }}</h2>
        <p>{{ section.text }}</p>
        <div class="registration-section__stamp" aria-label="Una visita para recordar">
          <span>{{ section.stamp || 'A' }}</span>
          <small>una visita<br />para recordar</small>
        </div>
      </div>

      <RegistrationForm v-reveal:right :tenant="tenant" />
    </div>
  </section>
</template>
