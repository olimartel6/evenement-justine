import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { EVENEMENT, BILLETS } from './config'
import { scannerBillet, lireStats } from './api'

const CLE_PIN = 'evt_pin'
const CLE_BENEVOLE = 'evt_benevole'
const lire = (k) => { try { return localStorage.getItem(k) || '' } catch { return '' } }
const ecrire = (k, v) => { try { localStorage.setItem(k, v) } catch { /* mode privé */ } }

export default function Scan() {
  const [pin, setPin] = useState(lire(CLE_PIN))
  const [benevole, setBenevole] = useState(lire(CLE_BENEVOLE))
  const [ouvert, setOuvert] = useState(false)
  const [verdict, setVerdict] = useState(null)
  const [stats, setStats] = useState(null)
  const [erreur, setErreur] = useState('')
  const [manuel, setManuel] = useState('')
  const lecteurRef = useRef(null)
  const dernierRef = useRef({ code: '', t: 0 })

  async function rafraichirStats(p) {
    try {
      const s = await lireStats(p || pin)
      if (s?.ok) setStats(s)
    } catch { /* silencieux */ }
  }

  async function traiter(code) {
    // anti-rebond : la caméra relit le même QR plusieurs fois par seconde
    const now = Date.now()
    if (dernierRef.current.code === code && now - dernierRef.current.t < 2500) return
    dernierRef.current = { code, t: now }
    try {
      const r = await scannerBillet(code, pin, benevole)
      setVerdict(r)
      if (navigator.vibrate) navigator.vibrate(r.statut === 'ok' ? 60 : [40, 60, 40])
      rafraichirStats()
    } catch (e) { setErreur(e.message) }
  }

  async function entrer(e) {
    e.preventDefault()
    setErreur('')
    const s = await lireStats(pin)
    if (!s?.ok) return setErreur('NIP invalide.')
    ecrire(CLE_PIN, pin); ecrire(CLE_BENEVOLE, benevole)
    setStats(s); setOuvert(true)
  }

  useEffect(() => {
    if (!ouvert) return
    const lecteur = new Html5Qrcode('lecteur')
    lecteurRef.current = lecteur
    lecteur.start({ facingMode: 'environment' },
      { fps: 10, qrbox: { width: 240, height: 240 } },
      (texte) => traiter(texte.trim().toUpperCase()),
      () => {})
      .catch(() => setErreur("Caméra inaccessible. Utilisez la saisie manuelle ci-dessous."))
    return () => { lecteur.stop().then(() => lecteur.clear()).catch(() => {}) }
  }, [ouvert])

  if (!ouvert) return (
    <div className="enveloppe pile" style={{ paddingTop: '5rem', maxWidth: '26rem' }}>
      <span className="surtitre">{EVENEMENT.nom}</span>
      <h2 style={{ margin: '1rem 0 1.6rem' }}>Accès bénévoles</h2>
      {erreur && <div className="avis">{erreur}</div>}
      <form onSubmit={entrer}>
        <label className="champ"><span>Votre prénom</span>
          <input value={benevole} onChange={(e) => setBenevole(e.target.value)} placeholder="Qui scanne ?" />
        </label>
        <label className="champ"><span>NIP de l’équipe</span>
          <input value={pin} onChange={(e) => setPin(e.target.value)}
            inputMode="numeric" type="password" placeholder="••••" />
        </label>
        <button className="btn btn--plein btn--large">Ouvrir le scanner</button>
      </form>
      <nav className="pied"><a href="#/">Retour au site</a></nav>
    </div>
  )

  const V = verdict
  const classe = !V ? 'verdict--neutre'
    : V.statut === 'ok' ? 'verdict--ok'
    : V.statut === 'deja_scanne' || V.statut === 'introuvable' ? 'verdict--refus'
    : 'verdict--neutre'
  const titre = !V ? 'Prêt à scanner'
    : V.statut === 'ok' ? 'Entrée validée'
    : V.statut === 'deja_scanne' ? 'Déjà scanné'
    : V.statut === 'introuvable' ? 'Billet inconnu'
    : 'NIP invalide'

  return (
    <div className="enveloppe" style={{ paddingTop: '2.5rem', paddingBottom: '3rem', maxWidth: '30rem' }}>
      <span className="surtitre">Contrôle des entrées</span>
      {erreur && <div className="avis" style={{ marginTop: '1rem' }}>{erreur}</div>}

      <div className="lecteur" id="lecteur" style={{ marginTop: '1.2rem' }} />

      <div className={'verdict ' + classe}>
        <p className="verdict__titre">{titre}</p>
        {V && V.nom && (
          <>
            <p style={{ marginTop: '.7rem', fontSize: '1.1rem' }}>{V.nom}</p>
            <p className="surtitre" style={{ marginTop: '.5rem' }}>
              {BILLETS[V.type]?.nom || V.type}
            </p>
          </>
        )}
        {V?.statut === 'deja_scanne' && (
          <p className="fine" style={{ marginTop: '.9rem' }}>
            Entré à {new Date(V.scanne_le).toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}
            {V.scanne_par ? ` · scanné par ${V.scanne_par}` : ''}
          </p>
        )}
        {V?.code && <p className="fine" style={{ marginTop: '.5rem' }}>{V.code}</p>}
      </div>

      <form style={{ marginTop: '1.5rem' }}
        onSubmit={(e) => { e.preventDefault(); if (manuel.trim()) { traiter(manuel.trim().toUpperCase()); setManuel('') } }}>
        <label className="champ"><span>Saisie manuelle du code</span>
          <input value={manuel} onChange={(e) => setManuel(e.target.value)} placeholder="ABC-1234" />
        </label>
        <button className="btn btn--large">Valider ce code</button>
      </form>

      {stats && (
        <div className="stats">
          <div className="stat"><p className="stat__n">{stats.entres}</p><p className="stat__l">Entrés</p></div>
          <div className="stat"><p className="stat__n">{stats.vendus}</p><p className="stat__l">Vendus</p></div>
          <div className="stat"><p className="stat__n">{stats.entres_cartes}</p><p className="stat__l">Salon</p></div>
          <div className="stat"><p className="stat__n">{stats.entres_cocktail}</p><p className="stat__l">Cocktail</p></div>
        </div>
      )}

      <nav className="pied">
        <a href="#/">Site public</a>
        <a href="#/" onClick={() => { ecrire(CLE_PIN, ''); setOuvert(false) }}>Fermer la session</a>
      </nav>
    </div>
  )
}
