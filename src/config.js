// ── Tout ce que Justine peut vouloir changer se trouve ici ────────────────────
export const EVENEMENT = {
  nom: 'Soirée Cartes & Cocktails',   // ← le nom définitif se change ici
  surtitre: 'Une soirée privée',
  date: 'À déterminer',
  lieu: 'À déterminer',
  intro:
    "Une soirée où l'on joue aux cartes autour de tables feutrées, " +
    "portée par de la musique live. Choisissez votre formule.",
}

export const BILLETS = {
  cartes: {
    id: 'cartes',
    nom: 'Accès Salon',
    prix: null,                        // ← mettre un nombre quand le prix sera fixé
    inclus: [
      'Accès aux tables de jeux de cartes',
      'Prestations des musiciens toute la soirée',
      'Ambiance musicale et espace salon',
    ],
    exclus: ["L'atelier cocktail"],
  },
  cocktail: {
    id: 'cocktail',
    nom: 'Accès Salon + Cocktail',
    prix: null,
    inclus: [
      'Tout ce que comprend l’Accès Salon',
      'Participation à l’activité cocktail',
      'Dégustation des créations',
    ],
    exclus: [],
    vedette: true,
  },
}

export const SUPABASE_URL = 'https://kptphghxhexirezukarr.supabase.co'
export const SUPABASE_KEY = 'sb_publishable_V-G8u7AQT0jAiYDVYs5dBQ_Sq5tHutB'
