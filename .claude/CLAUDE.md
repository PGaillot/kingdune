# Kingdune

## Contexte du projet

- **Kingdune** est un jeu web en 2D, projet perso, inspiré de la série **Kingdom** (Kingdom
  Classic, New Lands, Two Crowns…). Le nom mélange _Kingdom_ et _Dune_ : on reprend les principes
  de Kingdom sans tout copier, dans un univers inspiré des romans de **Dune**.
- Le personnage court sur un **terrain plat et borné à gauche et à droite**. C'est un segment, pas
  un monde infini ni ouvert. Il ne saute pas.
- **Rendu** : tout est dessiné à la main dans un `<canvas>` (boucle `requestAnimationFrame` +
  `deltaSeconds`). Les entités du jeu (`Character`, `Npc`, `Muaddib`, `Hunter`…) sont des classes
  TypeScript simples, pas des composants Angular. Angular sert de coquille (composant `Game`,
  entrées clavier, UI autour du canvas).
- **Graphismes** : pas encore définis (papier, pixel art, 3D… on verra). Pour l'instant, on dessine
  des **blocs de couleur** et ça suffit. Ne pas investir dans le visuel.
- **Aucune librairie** : pas de moteur de jeu (Phaser, PixiJS…), pas de librairie de physique ni
  d'UI. Tout est fait à la main.

## Univers : on joue les Fremen

Principe : **garder les mécaniques de Kingdom et ne changer que leur sens.** Comme Kingdom, le jeu
reste simple : peu de touches et **une seule ressource**.

**Décidé :**

- **Camp** : on joue une tribu **Fremen**, menée par un naib (le monarque de Kingdom).
- **Ressource unique : l'eau.** Les pièces sont représentées par des **anneaux d'eau** (les anneaux
  qui comptent l'eau d'un Fremen). Pas d'épice comme monnaie.
- **Cœur du royaume : le siètch**, qui remplace le feu de camp et en garde tous les rôles : point
  de départ, centre améliorable, refuge, lumière (des brilleurs au lieu de flammes). Il est creusé
  dans une **île rocheuse** au centre du monde. Plus on va vers `leftEnd`/`rightEnd`, plus le sable
  est ouvert et dangereux (les vers ne vont pas sur la roche).
- **Équivalences avec Kingdom :**
  - lapins → **muad'dib** (souris du désert), chassés par les archers pour l'eau de leur corps ;
  - fermes → **pièges à vent / collecteurs de rosée**, à l'arrêt pendant la saison des tempêtes
    (l'équivalent de l'hiver) ;
  - banquier → **maître de l'eau du siètch** (la réserve de la tribu) ;
  - marchand → **contrebandiers** ;
  - coffres → **caches d'eau abandonnées**.
- **Ennemis** : Harkonnen et/ou Sardaukar. Comme les Greed, ils **ne donnent aucune eau** quand on les
  tue (ils se replient, ou les leurs emportent leurs morts).
- **Côtés du monde** : comme dans Kingdom, les deux bords diffèrent : d'un côté un « portail » ennemi
  à détruire, de l'autre un côté bouché. Croquis : dunes d'un côté, ruines de l'autre.

**Décidé à partir des croquis** (`recherches/recherches_1.png`, pas encore codé) :

- **Buissons secs** (l'équivalent des terriers/buissons à lapins) : les muad'dib en sortent et restent
  dans une zone autour. Ils n'apparaissent que sur certains biomes (le biome rock).
- **Dunes à aplanir** (l'équivalent de l'arbre à couper) : on marque la dune avec un **petit drapeau**
  en payant un anneau, puis un builder l'aplanit. Il rend alors au hasard **1 anneau** (on récupère la
  mise) ou **2 anneaux** (gain net d'un anneau). Probabilités à définir.
  Bonus : si la dune est au **bord d'un biome rock**, l'aplanir **fait grandir la roche**, où peuvent
  ensuite pousser des buissons secs et vivre des muad'dib (et où les vers ne vont pas).
- **Emplacements de construction signalés par des cairns** : un socle carré + 2-3 cailloux empilés =
  futur **mur** ; des pierres plates empilées = futur **tour**. L'anneau dessiné au-dessus indique où
  payer.

**Pistes ouvertes (rien de décidé) :**

- Grosse proie rare (le sanglier de Kingdom) : la **truite des sables**.
- Niveaux du siètch : distille-tente → entrée scellée → siètch avec réservoir.
- Monture : **chevaucher un ver** appelé avec un marteleur (thumper), sur le sable uniquement.
- Inverser le danger jour/nuit (les Fremen se déplacent la nuit) : plus original, moins intuitif.
- Naib anonyme avec Paul Atreides en toile de fond, ou incarner Paul (plus scénarisé).
- L'épice : simple élément de décor ou de lore, peut-être échangée aux contrebandiers plus tard.

## Rôle de Claude : mentor, pas développeur

Le but de ce projet est **d'apprendre**. C'est l'utilisateur qui écrit le code.

- **Ne pas écrire ni modifier le code du jeu** sauf demande explicite (« écris-le », « fais-le »).
- Par défaut : expliquer les concepts, poser des questions pour faire réfléchir, proposer des pistes
  et comparer des approches (avec leurs avantages et inconvénients), donner des indices progressifs
  plutôt que la solution.
- Pour illustrer un concept, préférer un **petit exemple générique** plutôt que la solution exacte
  à coller dans le projet.
- Relire le code de l'utilisateur quand il le demande : signaler les bugs, les mauvaises pratiques,
  les améliorations possibles, et **expliquer pourquoi**. Relire, c'est **signaler**, jamais
  corriger soi-même (commentaires et orthographe compris).
- **L'utilisateur est dyslexique** : ne pas relever les fautes d'orthographe (commentaires, messages)
  sauf s'il le demande. Exception : les fautes **dans le code lui-même** sont à signaler (sans les
  corriger) : noms de classes, fonctions, variables, types (ex. `Rabit` au lieu de `Rabbit`), et
  chaînes qui changent le comportement (ex. `'KeyA'` mal écrit). Les commentaires, on laisse tomber.
- L'utilisateur dicte souvent ses messages à la voix : un message peut partir tronqué. Si une
  demande semble contredire ce rôle de mentor (ex. « corrige-le »), demander avant d'écrire.
- Rester pédagogue : nommer les concepts (game loop, delta time, AABB, héritage vs composition…)
  pour que l'utilisateur puisse creuser de son côté.

## Conventions

- **Commentaires de code en français.**
- Les règles Angular ci-dessous s'appliquent à la partie Angular (composants, services). La logique
  de jeu reste en classes TypeScript pures.

## Organisation des fichiers

- `src/app/components/` : uniquement les composants Angular (`game/` = la coquille autour du canvas).
- `src/app/game/` : la logique de jeu en TypeScript pur.
  - `config.ts` (unités, constantes), `camera.ts` (systèmes transverses) à la racine.
  - `world/` : le décor (`World`, `Ground`, `Catchbasin`, `Sietch`).
  - `entities/` : ce qui bouge et a un comportement (`Character`, `Npc`, `Muaddib`, `Hunter`, `WaterRing`).
- `src/app/utils/` : fonctions utilitaires génériques.

## Conventions du monde et du rendu

- **Unités** : toute la logique de jeu (positions, tailles, vitesses) est en mètres (`GameMeter`).
  Seul le dessin parle en pixels (`Pixel`). Échelle : `METER_UNIT` (1 m = 40 px). Les types et
  constantes vivent dans `src/app/game/config.ts` (`WorldPoint`, `ScreenPoint`,
  `SCREEN_WIDTH`, `SCREEN_HEIGHT`, `GROUND`…).
- **Repère du monde** : centré sur `x = 0` (de `-width/2` à `+width/2`), sol à `y = 0`, la hauteur
  **monte**. Dans le canvas, `y` **descend** : la conversion inverse le signe.
- **Caméra** (`Camera`) : `follow()` décide où regarder (cible + `offset`, en mètres), `convert()`
  traduit un point du monde en pixels, le point regardé étant au milieu de l'écran. On ne touche pas
  à la formule de `convert()` : glissement, tremblement, etc. passent par le point regardé.
- **Dessin** : chaque objet se dessine avec `draw(ctx, camera)`. Les positions passent par
  `camera.convert()`, les tailles sont multipliées par `METER_UNIT`. La position d'un personnage
  désigne ses pieds, donc on remonte de sa hauteur pour trouver le coin haut-gauche de `fillRect`.

## État d'avancement (à mettre à jour)

**Fait** : `World` (largeur, bornes `leftEnd`/`rightEnd`, contient un `Ground` et la couleur du
ciel), `Ground` (bande dessinée sur toute la largeur du monde), `Camera` (suivi du personnage avec
décalage vertical), entités converties en mètres et posées sur le sol.

**Entrées et joueur (fait)** : `INPUT_MAPPING` dans `config.ts` (action → touches `event.code` +
trigger : `tap`, `hold`, `long_hold`, `double_tap_hold`) ; `PlayerController` (cerveau : lit les
actions dans `update()` et pilote le corps) ; `PlayerCharacter extends Character` (corps du joueur,
avec une `Purse`) ; `Purse` (capacité optionnelle, `add()` renvoie l'objet qui déborde,
`contentCount` en getter) ; `Hunter` a aussi une bourse (illimitée). Déplacement flèches + ZQSD OK.

**`InputManager` (fait, les 4 triggers)** : une `Map` code de touche → fiche `KeyRecord`
(`pressedAt`, `releasedAt`, notés avec `performance.now()` ; `event.repeat` ignoré ; plus de `Set`).
Chaque trigger est **calculé** depuis la fiche (`isDown`, `isDoubleTap`, `isLongHold`, `isTap`) via
un `switch` exhaustif sur `ActionTrigger` ; `isActive` = `some` sur les touches de l'action.
`updateClock(timestamp)` est appelé en haut de `Game.loop()` : il garde l'heure de la frame
précédente et de la frame actuelle. Les décisions lisent l'heure de la frame ; `tap` est un
**événement** (relâchée dans la tranche `]précédente, actuelle]` + appui court), vrai une seule
frame. `long_hold` est aussi un **événement** (corrigé le 29/10/2026) : l'instant du seuil
(`pressedAt + longHoldDelay`) tombe dans la tranche de la frame **et** la touche est encore
enfoncée (`isDown`). Avant, c'était un état vrai à chaque frame : un appui long payait une dune
par frame (la cible passait à la dune voisine). Concept : détection de front (edge detection).
Seuils : tap < 200 ms, double tap < 250 ms, long hold 800 ms.

**Personnages (fait)** : `Character` reçoit `x`, `y` et une fiche `Partial<CharacterOptions>`
(`width`, `height`, `speed`, `color`, `runFactor`) fusionnée avec `DEFAULT_CHARACTER` par spread ;
chaque sous-classe a sa constante de défauts hors de la classe, `Npc` relaie la fiche à `super`.
`move()` (protected, vitesse en paramètre) + intentions `walk()` / `run()` (`runSpeed` en getter).
`PlayerController` : une direction, puis `run()` **ou** `walk()`. Course au double tap OK.
Gauche + droite en même temps = arrêt : comportement voulu.

**Ramassage et dépôt (fait)** : `overlaps(a, b)` dans `src/app/hitbox.ts` (AABB écrite à la main,
X et Y) ; `hitbox` en **getter** sur `Character` et `Collectible` (recalculée à chaque lecture).
`Collectible` a ses options (`width`, `height`, `color`), `x`/`y`, `draw()` (remonté depuis
`WaterRing`) et un état `droppedBy`. Les collectibles vivent dans `World.collectibles`
(`Collectible[]`). `PlayerController.update(deltaSeconds, world)` reçoit le monde entier.
`dropCollectible(world)` pose **le même objet** sorti de la bourse aux pieds du naib.
Règle de ramassage : `canBePickedBy(character)` = tout le monde sauf `droppedBy` ; `update()` oublie
`droppedBy` dès que celui-ci ne touche plus l'anneau. Le délai en secondes a été retiré (à remettre
peut-être pour le hunter). Type `Second` dans `config.ts`.

**Sprite de la dune (fait, commité le 28/10/2026)** : `Catchbasin` (`world/catchbasin.ts`) = la dune
« cache d'eau ». Images dans `public/ressources/catchbasin/` (`catchbasin_1.png` 48×32 px,
`catchbasin_flag_1.png` = le drapeau). Échelle : 16 px de dessin = 1 m. Images chargées **une fois**
dans des constantes hors de la classe (`IMAGE`, `MARKER`), mises dans `DEFAULT_CATCHBASIN_OPTION`.
Taille logique (hitbox) **1 m × 2 m**, taille visuelle **3 m × 2 m** (`imageWidth` / `imageHeight`),
image **centrée sur le tronc** (comme les arbres de Kingdom, les dunes peuvent se chevaucher).
`draw()` : `ctx.save()` en premier / `ctx.restore()` à la fin (`imageSmoothingEnabled`, `filter`),
position et taille calculées une fois (`destinationOption`, `dimensionOption`), technique du peintre :
dune puis drapeau si `marker`. **Survol** : la dune s'assombrit (`filter = 'brightness(0.6)'`,
drapeau compris). Le mécanisme `hoverByPlayer` de ce commit a été remplacé depuis (voir
« Cible et objets achetables » ci-dessous).
Rappels donnés : `=` vs `===` dans un `if` ; `save()`/`restore()` = pile de réglages, pas de dessins.

**Cible et objets achetables (en cours, pas commité, 28/10/2026 au soir)** : le bug de départ :
deux dunes qui se chevauchent étaient survolées et payables en même temps (un booléen
`hoverByPlayer` par dune). Décisions prises ensemble :

- **Source unique de vérité** : plus de `hoverByPlayer`. Le `PlayerCharacter` a une seule case
  `target: Purchasable | undefined` (sur le joueur et pas `Character` : seul le naib paie ; pas
  dans le `World` : c'est une info du joueur).
- **Interface `Purchasable`** (`src/app/game/interfaces/purchasable.ts`) plutôt qu'une classe mère
  `Building` (un mendiant/recrue serait payable mais hérite déjà de `Npc` ; héritage simple ;
  règle de trois). Contrat : `hitbox`, `currentPrice`, `onPaid()` (renommé depuis `paid()` : une méthode = un verbe, `on…` = réaction à un événement), `draw(ctx, camera)`.
- **`currentPrice: number | undefined`** remplace `price` + `canPay()` : `undefined` = pas
  achetable en ce moment (dune marquée, siètch au niveau max, cooldown…). Une seule question,
  narrowing TypeScript possible. Le prix sert aussi à afficher N pièces (préparation du paiement
  pièce par pièce comme Kingdom).
- `Catchbasin` : `onPaid()` appelle `mark()` (devenu `private`), `currentPrice` lit `price`.
- `Sietch` implémente `Purchasable` : `sietchLevel` (prix 3/8/12), `currentPrice` via `?.`.
- `World.purchasables` (getter, dunes + siètch). `PlayerCharacter.findTarget(purchasables)` :
  un seul `filter` (overlaps **et** prix défini) puis `reduce` sur la distance
  `Math.abs(centerX(objet) - centerX(naib))`, `undefined` si liste vide. Appelée dans
  `PlayerController.update()`. `centerX(hitbox)` ajouté dans `hitbox.ts`. **Ça marche.**
- **Effet de survol factorisé** : `targetHighlight(ctx, camera, object, isTarget)`
  (`src/app/utils/target-highlight.ts`) enveloppe le dessin : `save`, `filter`, `object.draw()`,
  `restore`, puis les pièces. `World.draw()` appelle ça pour chaque achetable ; les objets ne
  savent plus qu'ils sont ciblés.

**Fait le 29/10/2026 (commité)** : pièces passées par `camera.convert()`, empilées à la verticale
et centrées sur `centerX(hitbox)` (on recule d'une demi-pièce : `fillRect` part du coin
haut-gauche) ; `Sietch` : hitbox et dessin alignés (`position` = centre, `draw()` lit
`this.hitbox`), `onPaid()` ne plante plus (simple `console.log`). Reste : l'écart vertical mélange
encore des pixels en dur (`METER_UNIT + 20`) ; le demi-décalage est fait en pixels après
`convert()` (marche tant qu'il n'y a pas de zoom). Aussi réglé : `target-highlight.ts` déplacé dans
`src/app/game/` ; collectibles dessinés après les achetables ; JSDoc dans `Purchasable` ;
`onOverlappingCheck` et branche `length === 1` retirée de `findTarget`.

**Images des anneaux (29/10/2026)** : `public/ressources/waterring/` (`waterring_1.png` et
`waterring_placeholder_1.png`, 16×16 px = 1 m). `CollectibleOptions.image?: HTMLImageElement`
(plus de `color`) : chaque sorte de collectible charge son image **une fois** dans une constante
hors de la classe (`WATERRING_IMAGE`), comme `Catchbasin` ; `Collectible.draw()` fait le narrowing
(`if (this.options.image)`), sinon carré argenté, entre `save()`/`restore()`. Le placeholder des
pièces est une constante dans `target-highlight.ts`, dessinée en `opacity(0.35)`. Décidé : le
`Purchasable` dirait *avec quelle monnaie* il se paie, l'image du placeholder appartient à la monnaie ;
pas utile tant qu'il n'y a qu'une ressource (YAGNI). Monde agrandi exprès : `new World(40)` et
25 dunes (le commentaire de `game.ts` parle encore de 15).

**Points signalés, pas encore corrigés :**

1. Dans `targetHighlight` : dessiner les pièces **après** `restore()` (technique du peintre : là,
   elles sont dessinées avant l'objet). `imageSmoothingEnabled` est maintenant réglé par la
   fonction, plus par la dune.
2. `Sietch` : `canPay()` n'est plus dans le contrat (le cooldown voulu ira dans `currentPrice`).
   Éventuellement un alias `type Price` dans l'interface.
3. **Paiement, première version (fait, 29/10/2026)** : `pay()` lit `target.currentPrice`, vérifie
   la bourse, retire les anneaux (ils disparaissent, pas encore lâchés ni comptés quelque part),
   appelle `onPaid()` ; dunes marquées, `Sietch.onPaid()` fait `level += 1`. Signalé : le test
   `currentPrice &&` traite un prix de 0 comme absent (`!== undefined` serait plus juste) ;
   `pressedAt + longHoldDelay` écrit deux fois dans `isLongHold` (une constante `longHoldAt`).
4. Plan de l'utilisateur après le paiement du siètch : faire apparaître **deux bâtiments** de part et
   d'autre du siètch, un pour les **builders**, un pour les **archers**. Les biomes viendront
   plus tard (une chose à la fois).

Rappels donnés : une interface = contrat sans valeur ni code ; `find`/`reduce` sans `return` dans
des accolades renvoient `undefined` (c'était le bug du premier essai avec `find`) ; `Math.min`
donne la distance, pas l'objet ; `Math.abs` = valeur absolue ; positions via `camera.convert()`,
tailles via `METER_UNIT` ; champs initialisés dans l'ordre d'écriture, getter = recalculé.
Toujours en attente : un `METER_UNIT` multiple de 16 (aujourd'hui 40 → agrandissement 2,5) ; le
drapeau dessiné avec la taille de la dune (à revoir si le PNG n'a pas la même taille).

**Pistes ouvertes / prochaines étapes possibles** :

- **Mode debug des hitbox** (voulu par l'utilisateur) : une fonction générique qui dessine le contour
  (`strokeRect`) de n'importe quel `hitbox` (tous les objets exposent le même getter), activée par
  une constante dans `config.ts` ou mieux une touche `tap` dans `INPUT_MAPPING`.
- Dessiner les collectibles au premier plan (aujourd'hui dans `World.draw()`, donc derrière les
  personnages) : les dessiner depuis `Game.render()` après les personnages, ou des calques.
- `WaterRing.draw()` est remonté dans `Collectible` ; `update()` des collectibles prendra
  `deltaSeconds` quand la gravité arrivera (chute, lancer, rebond : intégration d'Euler).
- Faire apparaître les muad'dib entre `leftEnd` et `rightEnd` (aujourd'hui entre 0 et `width`).
- Caméra : glissement horizontal selon la direction (`offset.x`), tremblement, zoom. Pour le zoom,
  les tailles devront aussi passer par la caméra (pas directement par `METER_UNIT`).
- La convention « centré sur 0 » est écrite à deux endroits (`World.leftEnd` et `Ground.draw()`).
- `speed` est typé `GameMeter` alors que c'est des m/s (à revoir plus tard).
- `hitbox.ts` est dans `src/app/` alors que c'est de la logique de jeu (`src/app/game/`).

---

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
