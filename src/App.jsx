import React, { useEffect, useState, lazy, Suspense } from 'react'
import Accueil from './Accueil'
import Billet from './Billet'

// Le scanner ne sert qu'aux bénévoles : on ne l'impose pas aux invités.
// Si le morceau est introuvable (site redéployé pendant que la page était
// ouverte), on recharge une seule fois — sinon le scanner mourrait à la porte.
const Scan = lazy(() =>
  import('./Scan').catch((err) => {
    const CLE = 'evt_rechargement_scan'
    if (!sessionStorage.getItem(CLE)) {
      sessionStorage.setItem(CLE, '1')
      window.location.reload()
      return new Promise(() => {})   // on ne rend rien, la page se recharge
    }
    throw err
  })
)

const Attente = () => (
  <div className="enveloppe" style={{ paddingTop: '5rem' }}>
    <p className="fine">Chargement du scanner…</p>
  </div>
)

class Filet extends React.Component {
  constructor(p) { super(p); this.state = { casse: false } }
  static getDerivedStateFromError() { return { casse: true } }
  render() {
    if (!this.state.casse) return this.props.children
    return (
      <div className="enveloppe" style={{ paddingTop: '5rem', maxWidth: '26rem' }}>
        <h2>Scanner indisponible</h2>
        <p className="fine" style={{ margin: '1rem 0 2rem' }}>
          Le module de caméra n’a pas pu se charger. Vérifiez la connexion,
          puis rechargez la page.
        </p>
        <button className="btn btn--plein" onClick={() => window.location.reload()}>
          Recharger
        </button>
      </div>
    )
  }
}

export default function App() {
  const [route, setRoute] = useState(window.location.hash || '#/')
  useEffect(() => {
    const maj = () => {
      setRoute(window.location.hash || '#/')
      window.scrollTo(0, 0)   // sinon on arrive sur le billet scrollé en bas
    }
    window.addEventListener('hashchange', maj)
    return () => window.removeEventListener('hashchange', maj)
  }, [])

  if (route.startsWith('#/scan'))
    return <Filet><Suspense fallback={<Attente />}><Scan /></Suspense></Filet>

  const m = route.match(/^#\/billet\/([A-Za-z0-9-]+)/)
  if (m) return <Billet code={m[1].toUpperCase()} />
  return <Accueil />
}
