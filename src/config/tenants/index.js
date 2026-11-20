const bodegaAurora = {
  slug: 'bodega-aurora',
  name: 'Bodega Aurora del Valle',
  shortName: 'Aurora',
  description:
    'Una experiencia de muestra inspirada en los paisajes, los aromas y la hospitalidad del Valle de Uco.',
  assets: {
    logo: '/tenants/bodega-aurora/logo.svg',
    hero: '/tenants/bodega-aurora/hero.webp',
    registrationHero: '/tenants/bodega-aurora/uvas-vinedo.webp',
    registrationHeroAlt: 'Racimos de uvas maduras creciendo entre las hojas de la vid',
    about: '/tenants/bodega-aurora/gallery-01.svg',
    essence: '/tenants/bodega-aurora/paisaje-esencia.webp',
    gallery: [
      {
        image: '/tenants/bodega-aurora/gallery-01.svg',
        alt: 'Ilustración de un sendero entre viñedos al pie de las montañas',
        caption: 'El paisaje de cerca'
      },
      {
        image: '/tenants/bodega-aurora/gallery-02.svg',
        alt: 'Ilustración de hileras de viñedos bajo la luz de la tarde',
        caption: 'Luz de montaña'
      },
      {
        image: '/tenants/bodega-aurora/gallery-03.svg',
        alt: 'Ilustración de una copa y racimos de uvas',
        caption: 'Tiempo para disfrutar'
      }
    ]
  },
  theme: {
    primary: '#1e4036',
    primaryDark: '#123027',
    accent: '#d6a75d',
    accentSoft: '#e6d4af',
    surface: '#f7f3eb',
    surfaceStrong: '#ebe5d8',
    text: '#202c27',
    muted: '#68736c'
  },
  contact: {
    address: 'Valle de Uco, Mendoza (dato de muestra)',
    email: 'Completar con el contacto oficial antes de publicar'
  },
  seo: {
    title: 'Bodega Aurora del Valle | Una experiencia entre viñedos',
    description:
      'Descubre una experiencia de muestra inspirada en el paisaje y la cultura del vino del Valle de Uco, Mendoza.'
  },
  footerNote: 'Bodega de demostración: actualiza los datos de contacto antes de publicar.',
  form: {
    id: 'bodega-aurora-visita',
    title: 'Completa tu registro',
    description: 'Registra tu visita a Bodega Aurora. El envío se confirmará cuando quede guardado correctamente.',
    consentLabel:
      'Acepto que mis datos se utilicen para registrar mi visita en la bodega.',
    marketingConsentLabel:
      'Quiero recibir novedades y comunicaciones de la bodega.',
    submitLabel: 'Registrar mi visita',
    successMessage: 'Tu visita quedó registrada. ¡Gracias por visitarnos!',
    defaultSource: 'direct',
    fields: [
      {
        name: 'name',
        label: 'Nombre',
        type: 'text',
        autocomplete: 'given-name',
        required: true,
        maxLength: 60
      },
      {
        name: 'surname',
        label: 'Apellido',
        type: 'text',
        autocomplete: 'family-name',
        required: true,
        maxLength: 80
      },
      {
        name: 'email',
        label: 'Correo electrónico',
        type: 'email',
        autocomplete: 'email',
        required: true,
        maxLength: 120,
        wide: true
      },
      {
        name: 'phone',
        label: 'Teléfono',
        type: 'tel',
        autocomplete: 'tel',
        inputmode: 'tel',
        required: true,
        maxLength: 30
      }
    ]
  },
  sections: [
      {
        type: 'hero',
        id: 'inicio',
        navLabel: 'Inicio',
        eyebrow: 'Una experiencia de muestra · Mendoza',
        title: 'El paisaje también se disfruta sin prisa.',
        tagline:
          'Una invitación a descubrir los viñedos, los sabores y la calma del Valle de Uco.',
        imageAlt: 'Paisaje ilustrado de viñedos y montañas al atardecer',
        primaryActionLabel: 'Conoce la experiencia',
        secondaryActionLabel: 'Registra tu visita',
        mark: 'A',
        markLabel: 'Valle de Uco',
        sideIndex: '01',
        sideTitle: 'Una pausa entre viñedos',
        sideText: 'Paisaje, encuentro y cultura del vino'
      },
      {
        type: 'essence',
        id: 'esencia',
        navLabel: 'La esencia',
        eyebrow: 'Nuestra esencia',
        title: 'Un lugar para mirar de cerca y bajar el ritmo.',
        text:
          'Aurora es una propuesta de muestra inspirada en la identidad del Valle de Uco: un paisaje de montaña, hileras de viñedos y encuentros alrededor del vino.',
        image: '/tenants/bodega-aurora/paisaje-esencia.webp',
        imageAlt: 'Vista panorámica de un viñedo verde con un árbol en el centro',
        imageLabel: 'Viñedos del Valle de Uco',
        facts: [
          { label: 'Región', value: 'Valle de Uco' },
          { label: 'Propuesta', value: 'Vino y paisaje' }
        ],
        linkLabel: 'Descubre las experiencias'
      },
      {
        type: 'experience',
        id: 'experiencias',
        navLabel: 'Experiencias',
        eyebrow: 'Una visita a tu ritmo',
        backgroundImage: '/tenants/bodega-aurora/experiencia-visita.webp',
        title: 'Pequeños detalles que hacen especial el recorrido.',
        text:
          'Explora distintas formas de acercarte a la cultura del vino y al paisaje que la inspira.',
        cards: [
          {
            title: 'El recorrido',
            text: 'Conoce los espacios y las etapas que dan forma a cada botella.'
          },
          {
            title: 'Los aromas',
            text: 'Acércate a los matices del vino en una experiencia guiada.'
          },
          {
            title: 'El paisaje',
            text: 'Tómate un momento para contemplar los viñedos y la cordillera.'
          }
        ]
      },
      {
        type: 'registration',
        id: 'registro',
        navLabel: 'Registro',
        eyebrow: 'Registro en la bodega',
        title: 'Deja tu visita registrada.',
        text: 'Si ya estás en Bodega Aurora, completa el formulario para registrar tu visita.'
      }
    ]
}

const tenants = [bodegaAurora]

export function getTenantBySlug(slug) {
  return tenants.find((tenant) => tenant.slug === slug)
}

export { tenants }
