// Illustrations originales en SVG. Aucune photo de banque d'images :
// l'événement n'existe pas encore, et du dessin sur mesure vieillit mieux.

export function Soleil({ className = '' }) {
  // Éventail art déco derrière le titre
  const rayons = Array.from({ length: 24 }, (_, i) => i)
  return (
    <svg className={className} viewBox="0 0 400 200" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="gRayon" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--laiton)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--laiton)" stopOpacity=".55" />
        </linearGradient>
      </defs>
      <g transform="translate(200,200)">
        {/* la rotation vit sur le <g>, l'animation sur le <path> : sinon
            l'animation CSS écrase l'attribut transform et tous les rayons
            se superposent au même endroit. */}
        {rayons.map((i) => (
          <g key={i} transform={`rotate(${-90 + (i * 180) / 23})`}>
            <path d="M0 0 L-3.5 -190 L3.5 -190 Z" fill="url(#gRayon)"
              style={{ transformOrigin: '0 0', animation: `rayon 1s ${0.25 + i * 0.035}s both` }} />
          </g>
        ))}
        {[60, 105, 150].map((r, i) => (
          <path key={r} d={`M-${r} 0 A${r} ${r} 0 0 1 ${r} 0`} stroke="var(--laiton)"
            strokeOpacity={.3 - i * .07} strokeWidth="1" fill="none"
            style={{ strokeDasharray: r * 3.15, strokeDashoffset: r * 3.15,
                     animation: `trace 1.6s ${0.5 + i * 0.18}s ease-out forwards` }} />
        ))}
      </g>
    </svg>
  )
}

export function Cartes() {
  // Une main de cartes qui se déploie
  const mains = [
    { r: -22, x: -74, s: '♠', c: 'var(--encre)', d: '.15s' },
    { r: -11, x: -37, s: '♦', c: '#A6403C', d: '.28s' },
    { r: 0,   x: 0,   s: '♥', c: '#A6403C', d: '.41s' },
    { r: 11,  x: 37,  s: '♣', c: 'var(--encre)', d: '.54s' },
  ]
  return (
    <svg viewBox="0 0 340 260" className="illu illu--cartes" aria-hidden="true">
      <g transform="translate(170,150)">
        {mains.map((m, i) => (
          <g key={i} className="carte" style={{ animationDelay: m.d }}
             transform={`translate(${m.x},0) rotate(${m.r})`}>
            <rect x="-46" y="-70" width="92" height="140" rx="7"
              fill="var(--creme)" stroke="rgba(0,0,0,.14)" />
            <rect x="-40" y="-64" width="80" height="128" rx="4"
              fill="none" stroke={m.c} strokeOpacity=".22" />
            <text x="0" y="14" textAnchor="middle" fill={m.c}
              style={{ font: '600 42px var(--display)' }}>{m.s}</text>
            <text x="-33" y="-46" fill={m.c} style={{ font: '500 15px var(--texte)' }}>A</text>
            <text x="33" y="58" fill={m.c} textAnchor="end"
              style={{ font: '500 15px var(--texte)' }} transform="rotate(180 33 53)">A</text>
          </g>
        ))}
      </g>
    </svg>
  )
}

export function Coupe() {
  // Coupe de cocktail, liquide qui ondule et bulles qui montent
  return (
    <svg viewBox="0 0 200 260" className="illu" aria-hidden="true">
      <defs>
        <linearGradient id="gLiquide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E3C889" /><stop offset="100%" stopColor="#B5822F" />
        </linearGradient>
        <clipPath id="cCoupe"><path d="M46 66 L154 66 L100 132 Z" /></clipPath>
      </defs>
      <path d="M46 66 L154 66 L100 132 Z" fill="none" stroke="var(--laiton)" strokeWidth="1.5"
        style={{ strokeDasharray: 300, strokeDashoffset: 300, animation: 'trace 1.3s .2s forwards' }} />
      <g clipPath="url(#cCoupe)">
        <path fill="url(#gLiquide)" opacity=".85" className="liquide"
          d="M20 80 q20 -6 40 0 t40 0 t40 0 t40 0 v70 h-160 Z" />
      </g>
      <path d="M100 132 L100 196 M70 200 L130 200" stroke="var(--laiton)" strokeWidth="1.5"
        strokeLinecap="round" style={{ strokeDasharray: 130, strokeDashoffset: 130,
        animation: 'trace 1s .9s forwards' }} />
      <circle cx="128" cy="52" r="9" fill="none" stroke="var(--laiton)" strokeOpacity=".7" />
      <path d="M128 52 L128 76" stroke="var(--laiton)" strokeOpacity=".7" />
      {[[76, 3, '0s'], [96, 2.2, '.7s'], [116, 2.6, '1.3s']].map(([x, r, d], i) => (
        <circle key={i} cx={x} cy="118" r={r} fill="var(--creme)" opacity=".8"
          className="bulle" style={{ animationDelay: d }} />
      ))}
    </svg>
  )
}

export function Musique() {
  // Égaliseur : des barres qui respirent, pas un cliché de note de musique
  const barres = [14, 30, 52, 38, 66, 44, 24, 58, 34, 18, 46, 28]
  return (
    <svg viewBox="0 0 240 100" className="illu" aria-hidden="true">
      <g transform="translate(12,86)">
        {barres.map((h, i) => (
          <rect key={i} x={i * 19} y={-h} width="7" height={h} rx="3.5"
            fill="var(--laiton)" opacity={.35 + (i % 4) * .16}
            className="barre" style={{ animationDelay: `${i * 0.11}s`, transformOrigin: `${i * 19 + 3.5}px 0px` }} />
        ))}
      </g>
      <path d="M12 90 H228" stroke="var(--laiton)" strokeOpacity=".25" />
    </svg>
  )
}

export function Cadre({ children }) {
  // Encadrement art déco qui se dessine au défilement
  return (
    <div className="cadre">
      <svg className="cadre__trait" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <rect x="1" y="1" width="98" height="98" fill="none"
          stroke="var(--laiton)" strokeOpacity=".45" vectorEffect="non-scaling-stroke" />
      </svg>
      {['hg', 'hd', 'bg', 'bd'].map((c) => (
        <svg key={c} className={`coin coin--${c}`} viewBox="0 0 40 40" aria-hidden="true">
          <path d="M0 14 L0 0 L14 0 M0 8 L8 8 L8 0" fill="none"
            stroke="var(--laiton)" strokeWidth="1.4" />
        </svg>
      ))}
      {children}
    </div>
  )
}
