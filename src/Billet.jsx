import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { EVENEMENT, BILLETS } from './config'
import { lireBillet } from './api'
import { Losange } from './Ornements'

export default function Billet({ code }) {
  const [billet, setBillet] = useState(null)
  const [qr, setQr] = useState('')
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    let vivant = true
    ;(async () => {
      try {
        const b = await lireBillet(code)
        if (!vivant) return
        if (!b?.ok) return setErreur('Ce billet est introuvable.')
        setBillet(b)
        // Le QR encode uniquement le code du billet : court, lisible même
        // en basse lumière, et sans donnée personnelle dedans.
        setQr(await QRCode.toDataURL(b.code, {
          width: 600, margin: 1, errorCorrectionLevel: 'M',
          color: { dark: '#0A0E0C', light: '#FFFFFF' },
        }))
      } catch (e) { if (vivant) setErreur(e.message) }
    })()
    return () => { vivant = false }
  }, [code])

  if (erreur) return (
    <div className="enveloppe pile" style={{ paddingTop: '5rem' }}>
      <h2>{erreur}</h2>
      <p className="fine" style={{ marginTop: '1rem' }}>Vérifiez le lien reçu à la réservation.</p>
      <p style={{ marginTop: '2rem' }}><a className="btn" href="#/">Retour à l’accueil</a></p>
    </div>
  )
  if (!billet) return <div className="enveloppe" style={{ paddingTop: '5rem' }}><p className="fine">Chargement du billet…</p></div>

  const formule = BILLETS[billet.type]
  return (
    <div className="enveloppe pile" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
      <header style={{ textAlign: 'center' }}>
        <span className="surtitre">{EVENEMENT.nom}</span>
      </header>

      <div className="filet" style={{ color: 'var(--laiton)' }}><Losange /></div>

      <div className="billet">
        <p className="billet__type">{formule.nom}</p>
        <p className="billet__nom">{billet.nom}</p>
        <div className="billet__qr">
          {qr && <img src={qr} alt={`Code QR du billet ${billet.code}`} />}
        </div>
        <p className="billet__code">{billet.code}</p>
        <p className="billet__note">
          {billet.scanne
            ? 'Billet déjà utilisé à l’entrée'
            : 'À présenter à l’entrée'}
        </p>
      </div>

      <p className="fine" style={{ textAlign: 'center', marginTop: '2rem', maxWidth: '26rem', marginInline: 'auto' }}>
        Gardez cette page en favori ou faites-en une capture d’écran. Le billet reste
        valable même sans connexion, le code suffit à l’entrée.
      </p>

      <nav className="pied">
        <a href="#/">Accueil</a>
        <span className="fine">Billet {billet.code}</span>
      </nav>
    </div>
  )
}
