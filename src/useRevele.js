import { useEffect } from 'react'

// Ajoute la classe « vu » aux éléments .revele et .cadre quand ils entrent
// dans l'écran. Un seul observateur pour toute la page.
export default function useRevele(deps = []) {
  useEffect(() => {
    const cibles = document.querySelectorAll('.revele:not(.vu), .cadre:not(.vu)')
    if (!cibles.length) return
    if (!('IntersectionObserver' in window)) {
      cibles.forEach((n) => n.classList.add('vu'))
      return
    }
    const obs = new IntersectionObserver(
      (entrees) => entrees.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('vu'); obs.unobserve(e.target) }
      }),
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    )
    cibles.forEach((n) => obs.observe(n))
    return () => obs.disconnect()
  }, deps)
}
