import { useState } from 'react'
import { EVENEMENT, BILLETS } from './config'
import { acheterBillet } from './api'
import useRevele from './useRevele'
import { Pique, Coeur, Carreau, Trefle, Losange, Coche, Croix } from './Ornements'
import { Soleil, Cartes, Coupe, Musique, Cadre } from './Illustrations'

function Offre({ b, choisi, onChoisir }) {
  return (
    <article className={'offre revele' + (b.vedette ? ' offre--vedette' : '')}>
      {b.vedette && <span className="offre__ruban">Formule complète</span>}
      <span className="surtitre">{b.id === 'cartes' ? 'Formule 1' : 'Formule 2'}</span>
      <h3 style={{ marginTop: '.6rem' }}>{b.nom}</h3>
      <p className="offre__prix">
        {b.prix == null ? '—' : `${b.prix} $`}
        <small>{b.prix == null ? 'Prix à venir' : 'par personne'}</small>
      </p>
      <ul className="liste">
        {b.inclus.map((x) => <li key={x}><Coche />{x}</li>)}
        {b.exclus.map((x) => <li key={x} className="non"><Croix />{x}</li>)}
      </ul>
      <button className={'btn btn--large' + (choisi ? ' btn--plein' : '')}
        onClick={() => onChoisir(b.id)}>
        {choisi ? 'Formule choisie' : 'Choisir'}
      </button>
    </article>
  )
}

const MOTS = ['Tables de cartes', 'Musique live', 'Atelier cocktail', 'Soirée privée']

export default function Accueil() {
  const [type, setType] = useState('cocktail')
  const [nom, setNom] = useState('')
  const [courriel, setCourriel] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')
  useRevele()

  async function reserver(e) {
    e.preventDefault()
    setErreur('')
    if (!nom.trim()) return setErreur('Indiquez le nom qui figurera sur le billet.')
    setEnvoi(true)
    try {
      const r = await acheterBillet(nom, courriel, type)
      if (!r?.ok) throw new Error(r?.erreur || 'Réservation impossible')
      window.location.hash = `#/billet/${r.code}`
    } catch (err) { setErreur(err.message); setEnvoi(false) }
  }

  return (
    <div className="enveloppe" style={{ paddingBottom: '3rem' }}>
      <header className="heros pile">
        <Soleil className="heros__soleil" />
        <div className="heros__contenu">
          <span className="surtitre">{EVENEMENT.surtitre}</span>
          <h1 className="titre-brille" style={{ margin: '1.4rem 0' }}>{EVENEMENT.nom}</h1>
          <p className="plomb" style={{ marginInline: 'auto' }}>{EVENEMENT.intro}</p>
          <p className="fine" style={{ marginTop: '1.4rem' }}>
            {EVENEMENT.date} · {EVENEMENT.lieu}
          </p>
          <p style={{ marginTop: '2.2rem' }}>
            <a className="btn btn--plein" href="#reserver">Réserver ma place</a>
          </p>
        </div>
      </header>

      <div className="bandeau">
        <div className="bandeau__piste">
          {[...MOTS, ...MOTS, ...MOTS, ...MOTS].map((m, i) => (
            <span key={i}>{m} <Losange /></span>
          ))}
        </div>
      </div>

      <section className="duo revele">
        <div className="duo__art"><Cartes /></div>
        <div>
          <span className="surtitre">Le jeu</span>
          <h2 style={{ margin: '.8rem 0 1rem' }}>Des tables toute la soirée</h2>
          <p className="plomb">
            Installez-vous, distribuez, recommencez. Les tables restent ouvertes du début
            à la fin — venez avec votre jeu préféré ou apprenez-en un nouveau sur place.
          </p>
        </div>
      </section>

      <section className="duo duo--inverse revele">
        <div className="duo__art"><Musique /></div>
        <div>
          <span className="surtitre">La musique</span>
          <h2 style={{ margin: '.8rem 0 1rem' }}>Des musiciens, pas une liste de lecture</h2>
          <p className="plomb">
            Les prestations ponctuent la soirée. Assez présentes pour porter l’ambiance,
            assez discrètes pour qu’on s’entende parler autour de la table.
          </p>
        </div>
      </section>

      <section className="duo revele">
        <div className="duo__art"><Coupe /></div>
        <div>
          <span className="surtitre">Le cocktail</span>
          <h2 style={{ margin: '.8rem 0 1rem' }}>Un atelier, pas juste un verre</h2>
          <p className="plomb">
            Réservé à la formule complète : on vous montre à monter un cocktail,
            vous le préparez, vous le goûtez. C’est la seule différence entre les deux billets.
          </p>
        </div>
      </section>

      <div className="filet" style={{ color: 'var(--laiton)' }}>
        <Pique /><Coeur /><Losange /><Carreau /><Trefle />
      </div>

      <section>
        <h2 className="revele" style={{ marginBottom: '1.6rem' }}>Les formules</h2>
        <div className="grille">
          <Offre b={BILLETS.cartes} choisi={type === 'cartes'} onChoisir={setType} />
          <Offre b={BILLETS.cocktail} choisi={type === 'cocktail'} onChoisir={setType} />
        </div>
      </section>

      <section id="reserver" style={{ marginTop: '4rem' }}>
        <Cadre>
          <div style={{ maxWidth: '28rem', marginInline: 'auto' }}>
            <h2 style={{ textAlign: 'center' }}>Réserver</h2>
            <p className="fine" style={{ margin: '.7rem 0 1.8rem', textAlign: 'center' }}>
              Votre billet et son code QR s’affichent immédiatement.
            </p>
            {erreur && <div className="avis">{erreur}</div>}
            <form onSubmit={reserver}>
              <label className="champ"><span>Nom sur le billet</span>
                <input value={nom} onChange={(e) => setNom(e.target.value)}
                  placeholder="Prénom et nom" autoComplete="name" />
              </label>
              <label className="champ"><span>Courriel (facultatif)</span>
                <input type="email" value={courriel} onChange={(e) => setCourriel(e.target.value)}
                  placeholder="vous@exemple.com" autoComplete="email" />
              </label>
              <label className="champ"><span>Formule</span>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="cartes">{BILLETS.cartes.nom}</option>
                  <option value="cocktail">{BILLETS.cocktail.nom}</option>
                </select>
              </label>
              <button className="btn btn--plein btn--large" disabled={envoi}>
                {envoi ? 'Émission du billet…' : 'Obtenir mon billet'}
              </button>
            </form>
          </div>
        </Cadre>
      </section>

      <nav className="pied">
        <span className="fine">{EVENEMENT.nom}</span>
        <a href="#/scan">Accès bénévoles</a>
      </nav>
    </div>
  )
}
