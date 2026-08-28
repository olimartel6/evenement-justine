import { useState } from 'react'
import { EVENEMENT, BILLETS } from './config'
import { acheterBillet } from './api'
import { Pique, Coeur, Carreau, Trefle, Losange, Coche, Croix } from './Ornements'

function Offre({ b, choisi, onChoisir }) {
  return (
    <article className={'offre' + (b.vedette ? ' offre--vedette' : '')}>
      {b.vedette && <span className="offre__ruban">Formule complète</span>}
      <span className="surtitre">{b.id === 'cartes' ? 'Formule 1' : 'Formule 2'}</span>
      <h3 style={{ marginTop: '.6rem' }}>{b.nom}</h3>
      <p className="offre__prix">
        {b.prix == null ? '—' : `${b.prix} $`}
        <small>{b.prix == null ? 'Prix à venir' : 'par personne'}</small>
      </p>
      <ul className="liste">
        {b.inclus.map((x) => (
          <li key={x}><Coche />{x}</li>
        ))}
        {b.exclus.map((x) => (
          <li key={x} className="non"><Croix />{x}</li>
        ))}
      </ul>
      <button
        className={'btn btn--large' + (choisi ? ' btn--plein' : '')}
        onClick={() => onChoisir(b.id)}
      >
        {choisi ? 'Formule choisie' : 'Choisir'}
      </button>
    </article>
  )
}

export default function Accueil() {
  const [type, setType] = useState('cocktail')
  const [nom, setNom] = useState('')
  const [courriel, setCourriel] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')

  async function reserver(e) {
    e.preventDefault()
    setErreur('')
    if (!nom.trim()) return setErreur('Indiquez le nom qui figurera sur le billet.')
    setEnvoi(true)
    try {
      const r = await acheterBillet(nom, courriel, type)
      if (!r?.ok) throw new Error(r?.erreur || 'Réservation impossible')
      window.location.hash = `#/billet/${r.code}`
    } catch (err) {
      setErreur(err.message)
      setEnvoi(false)
    }
  }

  return (
    <div className="enveloppe pile" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
      <header>
        <span className="surtitre">{EVENEMENT.surtitre}</span>
        <h1 style={{ margin: '1.2rem 0' }}>{EVENEMENT.nom}</h1>
        <p className="plomb">{EVENEMENT.intro}</p>
        <p className="fine" style={{ marginTop: '1.2rem' }}>
          {EVENEMENT.date} · {EVENEMENT.lieu}
        </p>
      </header>

      <div className="filet" style={{ color: 'var(--laiton)' }}>
        <Pique /><Coeur /><Losange /><Carreau /><Trefle />
      </div>

      <section>
        <h2 style={{ marginBottom: '1.6rem' }}>Les formules</h2>
        <div className="grille">
          <Offre b={BILLETS.cartes} choisi={type === 'cartes'} onChoisir={setType} />
          <Offre b={BILLETS.cocktail} choisi={type === 'cocktail'} onChoisir={setType} />
        </div>
      </section>

      <section id="reserver" style={{ marginTop: '3.5rem', maxWidth: '30rem' }}>
        <h2>Réserver</h2>
        <p className="fine" style={{ margin: '.6rem 0 1.8rem' }}>
          Votre billet et son code QR s’affichent immédiatement après la réservation.
        </p>
        {erreur && <div className="avis">{erreur}</div>}
        <form onSubmit={reserver}>
          <label className="champ">
            <span>Nom sur le billet</span>
            <input value={nom} onChange={(e) => setNom(e.target.value)}
              placeholder="Prénom et nom" autoComplete="name" />
          </label>
          <label className="champ">
            <span>Courriel (facultatif)</span>
            <input type="email" value={courriel} onChange={(e) => setCourriel(e.target.value)}
              placeholder="vous@exemple.com" autoComplete="email" />
          </label>
          <label className="champ">
            <span>Formule</span>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="cartes">{BILLETS.cartes.nom}</option>
              <option value="cocktail">{BILLETS.cocktail.nom}</option>
            </select>
          </label>
          <button className="btn btn--plein btn--large" disabled={envoi}>
            {envoi ? 'Émission du billet…' : 'Obtenir mon billet'}
          </button>
        </form>
      </section>

      <nav className="pied">
        <span className="fine">{EVENEMENT.nom}</span>
        <a href="#/scan">Accès bénévoles</a>
      </nav>
    </div>
  )
}
