<script setup>
defineProps({
  tenant: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <footer class="site-footer">
    <div class="page-frame site-footer__grid">
      <div>
        <p class="footer-kicker">{{ tenant.name }}</p>
        <p class="footer-note">
          {{ tenant.footerNote || tenant.description }}
        </p>
        <p class="footer-credit">Una experiencia creada para <strong>Bodega QR</strong>.</p>
        <p class="footer-credit footer-author">
          <a href="https://wa.me/5493513446349" target="_blank" rel="noopener noreferrer">
            Hecho por Alexis Re
          </a>
          <a href="https://wa.me/5493513446349" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp al +54 9 351 344-6349">
            +54 9 351 344-6349
          </a>
        </p>
      </div>

      <address class="footer-contact">
        <span v-if="tenant.contact.address">{{ tenant.contact.address }}</span>
        <span v-if="tenant.contact.schedule">{{ tenant.contact.schedule }}</span>
        <span v-if="tenant.contact.email">{{ tenant.contact.email }}</span>
        <RouterLink :to="{ name: 'tenant-registration', params: { slug: tenant.slug } }">
          Registrar mi visita
        </RouterLink>
      </address>
    </div>
  </footer>
</template>
