<script setup>
import { computed, reactive, ref, nextTick } from 'vue'
import { submitRegistration } from '../../services/registrationApi'

const props = defineProps({
  tenant: {
    type: Object,
    required: true
  }
})

function createInitialForm() {
  return {
    name: '',
    surname: '',
    email: '',
    phone: '',
    consent: false,
    marketingConsent: false,
    website: ''
  }
}

const form = reactive(createInitialForm())
const errors = reactive({})
const status = ref('idle')
const statusMessage = ref('')
const isSubmitting = computed(() => status.value === 'submitting')
const visibleFields = computed(() => props.tenant.form.fields.filter(isFieldVisible))

function isFieldVisible(field) {
  if (!field.showWhen) return true

  const currentValue = form[field.showWhen.field]
  return field.showWhen.values.includes(currentValue)
}

function fieldId(field) {
  return `${props.tenant.slug}-${field.name}`
}

function clearError(fieldName) {
  if (errors[fieldName]) {
    delete errors[fieldName]
  }
}

function validate() {
  Object.keys(errors).forEach((key) => delete errors[key])

  visibleFields.value.forEach((field) => {
    const rawValue = form[field.name]
    const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue

    if (field.required && !value) {
      errors[field.name] = field.requiredMessage || `Completa ${field.label.toLowerCase()}.`
      return
    }

    if (value && field.type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
      errors[field.name] = 'Revisa el formato del correo electronico.'
    }

    if (value && field.maxLength && String(value).length > field.maxLength) {
      errors[field.name] = `Este campo no puede superar los ${field.maxLength} caracteres.`
    }
  })

  if (!form.consent) {
    errors.consent = 'Necesitamos tu consentimiento para registrar la visita.'
  }

  return Object.keys(errors).length === 0
}

function createRequestId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return `web-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function normalizedValue(value) {
  return typeof value === 'string' ? value.trim() : value
}

function resetForm() {
  Object.assign(form, createInitialForm())
}

async function handleSubmit() {
  statusMessage.value = ''

  if (!validate()) {
    status.value = 'error'
    statusMessage.value = 'Revisa los campos marcados antes de continuar.'
    await nextTick()
    document.querySelector('[aria-invalid="true"]')?.focus()
    return
  }

  status.value = 'submitting'

  const query = new URLSearchParams(window.location.search)
  const result = await submitRegistration({
    tenantSlug: props.tenant.slug,
    formId: props.tenant.form.id,
    requestId: createRequestId(),
    fields: {
      name: normalizedValue(form.name),
      surname: normalizedValue(form.surname),
      email: normalizedValue(form.email).toLowerCase(),
      phone: normalizedValue(form.phone),
      marketingConsent: form.marketingConsent,
      qrLocation: query.get('location') || '',
      qrId: query.get('qr') || ''
    },
    consent: form.consent,
    honeypot: form.website,
    source: query.get('source') || props.tenant.form.defaultSource || 'direct'
  })

  if (result.ok) {
    status.value = 'success'
    statusMessage.value = props.tenant.form.successMessage || 'Registro completado correctamente.'
    resetForm()
    return
  }

  status.value = 'error'
  statusMessage.value = result.message
}
</script>

<template>
  <form class="registration-form" novalidate :aria-busy="isSubmitting" @submit.prevent="handleSubmit">
    <div class="registration-form__heading">
      <p class="eyebrow">Registro de visita</p>
      <h2>{{ tenant.form.title }}</h2>
      <p>{{ tenant.form.description }}</p>
    </div>

    <p class="registration-form__hint">Los campos marcados con * son obligatorios.</p>

    <div class="form-fields">
      <label
        v-for="field in visibleFields"
        :key="field.name"
        class="form-field"
        :class="{ 'form-field--wide': field.wide }"
        :for="fieldId(field)"
      >
        <span>{{ field.label }}<b v-if="field.required" aria-hidden="true"> *</b></span>

        <select
          v-if="field.type === 'select'"
          :id="fieldId(field)"
          v-model="form[field.name]"
          :name="field.name"
          :autocomplete="field.autocomplete"
          :aria-required="field.required"
          :aria-invalid="Boolean(errors[field.name])"
          :aria-describedby="errors[field.name] ? `${fieldId(field)}-error` : undefined"
          @change="clearError(field.name)"
        >
          <option value="">Selecciona una opcion</option>
          <option v-for="option in field.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>

        <input
          v-else
          :id="fieldId(field)"
          v-model="form[field.name]"
          :type="field.type"
          :name="field.name"
          :autocomplete="field.autocomplete"
          :inputmode="field.inputmode"
          :maxlength="field.maxLength"
          :required="field.required"
          :aria-required="field.required"
          :aria-invalid="Boolean(errors[field.name])"
          :aria-describedby="errors[field.name] ? `${fieldId(field)}-error` : undefined"
          @input="clearError(field.name)"
        />

        <small v-if="errors[field.name]" :id="`${fieldId(field)}-error`" class="field-error">
          {{ errors[field.name] }}
        </small>
      </label>
    </div>

    <label class="honeypot" aria-hidden="true">
      Website
      <input v-model="form.website" tabindex="-1" autocomplete="off" />
    </label>

    <div class="consent-group">
      <p class="consent-group__title">Tus preferencias</p>
      <p class="consent-group__hint">La aceptación para registrar tu visita es necesaria.</p>
      <label class="consent-field" :class="{ 'consent-field--error': errors.consent }" for="registration-consent">
        <input
          id="registration-consent"
          v-model="form.consent"
          type="checkbox"
          :aria-invalid="Boolean(errors.consent)"
          :aria-describedby="errors.consent ? 'registration-consent-error' : undefined"
          @change="clearError('consent')"
        />
        <span>{{ tenant.form.consentLabel }}</span>
      </label>
      <small v-if="errors.consent" id="registration-consent-error" class="field-error">
        {{ errors.consent }}
      </small>

      <label v-if="tenant.form.marketingConsentLabel" class="consent-field consent-field--optional" for="registration-marketing-consent">
        <input id="registration-marketing-consent" v-model="form.marketingConsent" type="checkbox" />
        <span>{{ tenant.form.marketingConsentLabel }}</span>
      </label>
    </div>

    <button class="button button--accent button--full" type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Registrando...' : tenant.form.submitLabel }}
      <span aria-hidden="true">→</span>
    </button>

    <p v-if="statusMessage" class="form-status" :class="`form-status--${status}`" role="status" aria-live="polite">
      {{ statusMessage }}
    </p>
  </form>
</template>
