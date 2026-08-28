# Billetterie d'événement — projet scolaire de Justine

Site public de réservation + application web de contrôle des entrées par code QR.

## Ce que ça fait

- **Site public** : présente l'événement et les deux formules, puis émet un billet
  avec un code QR unique, affiché immédiatement.
- **Deux formules** : « Accès Salon » (tables de cartes + musiciens) et
  « Accès Salon + Cocktail » (la même chose plus l'activité cocktail).
- **Contrôle des entrées** (`#/scan`) : les bénévoles scannent le QR avec la caméra
  de leur téléphone. L'écran affiche le nom et la formule. **Un billet déjà scanné
  est refusé**, avec l'heure d'entrée et le nom du bénévole qui l'avait scanné.
- **Saisie manuelle** de secours si la caméra ne coopère pas.
- **Compteurs en direct** : billets vendus, entrées, répartition par formule.

## Ce qu'il reste à décider

Tout se change dans `src/config.js` :

| Élément | Où | État |
|---|---|---|
| Nom de l'événement | `EVENEMENT.nom` | provisoire |
| Date et lieu | `EVENEMENT.date`, `.lieu` | à déterminer |
| Prix des billets | `BILLETS.*.prix` | `null` → affiche « Prix à venir » |

Mettre un nombre dans `prix` suffit à l'afficher partout.

## NIP des bénévoles

Le NIP est stocké côté base de données, pas dans le code. Pour le changer :

```sql
update evt_config set staff_pin = '1234' where id = 1;
```

## Développement

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Comment c'est sécurisé

La table des billets a le RLS activé **sans aucune politique** : la clé publique du
site ne peut donc ni lire ni modifier les billets directement. Tout passe par des
fonctions `SECURITY DEFINER` en base :

- `evt_create_ticket` — émet un billet
- `evt_get_ticket` — affiche un billet
- `evt_scan_ticket` — valide une entrée, **protégée par le NIP**
- `evt_stats` — compteurs, **protégés par le NIP**

Le double scan est bloqué par un `UPDATE ... WHERE scanned_at IS NULL` atomique :
même si deux bénévoles scannent le même billet à la même seconde, un seul passe.

## Limites connues

- **Pas de paiement en ligne.** La réservation émet le billet directement. Pour
  encaisser, il faudrait brancher Stripe avant l'appel à `evt_create_ticket`.
- **Le NIP est partagé** entre les bénévoles. Suffisant pour une soirée, pas pour
  un usage commercial.
- **La caméra exige HTTPS**, ce que GitHub Pages fournit. En local, utiliser
  `localhost` (autorisé) et non une adresse IP.
