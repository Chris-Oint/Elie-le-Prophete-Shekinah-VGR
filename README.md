# WMB Bible d’étude — Shekinah + VGR

Bible d’étude hors connexion (PWA installable) reliée aux prédications de
William Marrion Branham : la Bible (Louis Segond) et les brochures **Shekinah**
et **VGR**, avec référence croisée verset ↔ paragraphe.

- **Application en ligne :** https://chris-oint.github.io/Elie-le-Prophete-Shekinah-VGR/
- **Installation :** ouvrir le lien, puis « Ajouter à l’écran d’accueil » / « Installer l’application ».
- **Hors connexion :** bouton **Télécharger tous les textes** (≈ 52 Mo une seule fois).

## Contenu

| Élément | Valeur |
|---|---|
| Documents | 1 597 (Shekinah 1 210 · VGR 387) |
| Prédications (codes) | 1 213 |
| Paragraphes | 406 960 |
| Liens verset ↔ paragraphe | 141 057 |
| Zones de texte | 5 (~52 Mo au total) |

Liens par catégorie : **Exact** 25 528 (le texte du verset est retrouvé dans le
paragraphe et surligné) · **Partiel** 58 233 · **Contextuel** 57 290.

Bascule de traduction Shekinah ⇄ VGR pour 384 prédications (768 documents).

## Source des textes

Les brochures proviennent du dépôt **`Chris-Oint/brochure`** : EPUB Shekinah
(1 140) et VGR (400) convertis depuis les PDF officiels. Les fichiers EPUB
illisibles ont été complétés par le corpus précédent (87 textes).

Les titres courants des PDF ont été retirés : **26 259 paragraphes** supprimés ou
nettoyés (date et lieu de l’enregistrement, numéro de page, nom de la brochure
répété en haut de page, pieds de page « Voice of God Recordings »,
« Shekinah Publications », etc.).

## Fichiers

- `index.html` — application (un seul écran, chargement des `js/part-0xx.js`)
- `js/part-004.js` — données (index des documents, liens verset ↔ paragraphe, alignement Shekinah/VGR)
- `data/brochures_z1..z5.json.gz` — corpus compressé par zone
- `sw.js` — service worker (cache `wmb-app-v3`)

## Reconstruction du corpus

```bash
python3 stage_a.py    # /tmp/docs.json  : EPUB -> documents (code, titre, date, paragraphes, zone)
python3 stage_b2.py   # /tmp/links.json : liens verset <-> paragraphe (+ surlignages)
OUT=... python3 stage_c.py   # nettoyage des titres courants, payload, zones
```
