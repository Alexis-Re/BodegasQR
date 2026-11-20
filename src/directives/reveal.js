const revealDirective = {
  mounted(element) {
    element.classList.add('reveal')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      element.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        element.classList.add('is-visible')
        observer.disconnect()
      },
      { threshold: 0.12 }
    )

    element._revealObserver = observer
    observer.observe(element)
  },
  unmounted(element) {
    element._revealObserver?.disconnect()
  }
}

export default revealDirective
