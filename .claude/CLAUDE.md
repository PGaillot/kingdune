# Kingdune

## Contexte du projet

- **Kingdune** est un jeu web en 2D, projet perso, inspiré de la série **Kingdom** (Kingdom
  Classic, New Lands, Two Crowns…). Le nom mélange _Kingdom_ et _Dune_ : on reprend les principes
  de Kingdom sans tout copier, dans un univers inspiré des romans de **Dune**.
- Le personnage court sur un **terrain plat et borné à gauche et à droite**. C'est un segment, pas
  un monde infini ni ouvert. Il ne saute pas.
- **Rendu** : tout est dessiné à la main dans un `<canvas>` (boucle `requestAnimationFrame` +
  `deltaSeconds`). Les entités du jeu (`Character`, `Npc`, `Muaddib`, `Hunter`…) sont des classes
  TypeScript simples. **Plus de framework** (Angular retiré le 16/11/2026, voir « Outillage ») :
  `src/main.ts` trouve le canvas et crée un `Game` (classe TS pure : boucle, entrées clavier,
  caméra).
- **Graphismes** : pas encore définis (papier, pixel art, 3D… on verra). Pour l'instant, on dessine
  des **blocs de couleur** et ça suffit. Ne pas investir dans le visuel.
- **Aucune librairie** : pas de moteur de jeu (Phaser, PixiJS…), pas de librairie de physique ni
  d'UI. Tout est fait à la main.
- **Outillage (depuis le 16/11/2026)** : **Bun** gère les paquets et lance les scripts (`bun.lock`,
  plus de npm), **Vite** sert et compile (`bun run dev`, `bun run build`). Vite ne vérifie pas les
  types : `build` lance d'abord `tsc --noEmit` (un seul `tsconfig.json`, `include: ["src"]`).
  Point d'entrée : `index.html` **à la racine** (canvas `#game` + `<script type="module">`,
  différé, donc le canvas existe quand `main.ts` s'exécute). `public/` est servi à la racine
  (`/ressources/...`). Pas de tests pour l'instant (`vitest` retiré).

## Univers : on joue les Fremen

Principe : **garder les mécaniques de Kingdom et ne changer que leur sens.** Comme Kingdom, le jeu
reste simple : peu de touches et **une monnaie principale** (d'autres monnaies viendront plus tard,
voir ci-dessous).

**Décidé :**

- **Camp** : on joue une tribu **Fremen**, menée par un naib (le monarque de Kingdom).
- **Monnaie principale : l'eau.** Les pièces sont représentées par des **anneaux d'eau** (les
  anneaux qui comptent l'eau d'un Fremen). Pas d'épice comme monnaie.
- **Plusieurs monnaies plus tard (changement d'avis du 29/10/2026)** : l'utilisateur ne veut plus
  une ressource unique. Il y aura sûrement d'autres monnaies, comme l'équivalent des **gemmes** de
  Kingdom, ou des **trophées / objets** de Kingdom Eighties. Pas encore codé. Conséquence déjà
  discutée : un `Purchasable` dira **avec quelle monnaie** il se paie, et l'image du placeholder
  appartiendra à la monnaie.
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

**Principe de design (décidé le 01/11/2026)** : comme dans les premiers Kingdom (ce que
l'utilisateur préfère aux derniers), **aucun texte, aucun tuto** : tout se comprend par le
**level design** et les réactions du monde. Les noms des choses (pyons, etc.) ne servent qu'à
nous, dans le code ; le joueur ne les voit jamais.

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
- **Cycle jour/nuit (horloge et ciel faits, 31/10/2026)** : `Clock` (`src/app/game/clock.ts`),
  possédée par le `World` (temps **de jeu**, s'arrête en pause ; le temps **réel** reste dans
  `Game` et l'`InputManager`). Stocke seulement `time` (secondes, part de 0), `updateClock()`
  cumule `deltaSeconds` (appelée dans `World.update()`). Getters : `days` (division +
  `Math.floor`), `timeInDay` (modulo), `timeOfDay` (`'day' | 'night'`, moitié de journée chacun).
  `DAY_LENGTH` = 5 min et les dégradés `DAY_LIGHT_GRADIENT` / `NIGHT_GRADIENT` sont dans
  `config.ts`. Ciel : dégradé vertical
  (`createLinearGradient` de `y = 0` jusqu'à l'horizon `camera.convert({ y: GROUND }).y`,
  `addColorStop(index / (length - 1))`), bascule nette jour/nuit (transition douce par lerp :
  plus tard). `backgroundColor` retiré du `World`. **Prochaine étape** : la machine à états du
  worker (rentrer au siètch la nuit). Questions ouvertes : comment le worker connaît la phase
  (paramètre de plus ou objet « contexte ») ; garde-t-il sa tâche la nuit. Les machines à états des PNJ liront la phase (ex. les workers rentrent au siètch la
  nuit). La tombée de la nuit serait le **deuxième déclencheur** d'événements (après la montée de
  niveau du siètch) : argument pour l'Observer fait main.
- **Bornes et zones (discuté le 01/11/2026, pas codé)** : l'utilisateur retire `minX`/`maxX`.
  Piste : séparer la **contrainte dure** (personne ne sort du monde, appliquée par le `World`
  après les `update()`) de la **zone d'errance** (comportement : le PNJ erre dans une `Hitbox`
  qui peut changer : autour de son camp, `sietchZone` la nuit ; s'il en sort, il y revient).
  Besoin à venir : les vagabonds de Kingdom (en attente d'être recrutés) errent autour de leur
  camp. Nom à trouver (pistes : pyons, errants, réfugiés).
- Naib anonyme avec Paul Atreides en toile de fond, ou incarner Paul (plus scénarisé).
- L'épice : simple élément de décor ou de lore, peut-être échangée aux contrebandiers plus tard.
- **Paliers de matériaux** (dans Kingdom : bois au départ, puis pierre, puis fer, débloqués en
  payant une mine) : ce ne sont pas des monnaies, on paie toujours en anneaux. Le palier
  débloqué ferait évoluer les murs (même emplacement, autre matériau) et bloquerait la montée du
  siètch à partir d'un certain niveau. Peut-être porté par le siètch. **Pas codé (YAGNI)**.
  Version Dune voulue par l'utilisateur (sur Arrakis, il n'y a que de la pierre et du sable) :
  1. une **pierre orangée** au départ (nom à trouver) ;
  2. une **pierre plus blanche**, type granit ;
  3. une **pierre noire**, type basalte.

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
- Tout le jeu est en classes TypeScript pures (plus d'Angular).

## Organisation des fichiers

- `index.html` (racine) et `src/main.ts` : point d'entrée, branchent le canvas sur `Game`.
- `src/app/game.ts` : la classe `Game` (boucle `requestAnimationFrame`, écouteurs clavier,
  caméra, debug des hitbox). Ex-composant Angular.
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

**Sortie d'Angular (fait, 16/11/2026)** : composant `Game` réécrit en classe TS pure (le
constructeur reçoit le canvas, règle sa taille, lance une erreur sans contexte 2D, donc `ctx` n'est
plus `| null` : invariant établi dans le constructeur ; `addEventListener` remplace le `host`).
Fichiers Angular, `.angular/`, `.vscode/`, `game.spec.ts`, `tslib`, `jsdom`, `vitest` supprimés.
Bugs rencontrés : `querySelector("game")` (balise, pas id) ; `<canvas #game>` (syntaxe de template
Angular, pas un id) ; `requestAnimationFrame` retiré de `loop()` avec `frameId` → une seule frame,
dessinée avant le chargement des images (`drawImage` sur une image pas chargée ne dessine rien,
sans erreur) ; `tsconfig` « chef d'orchestre » (`files: []` + `references`) sans ses enfants
(TS18002) ; `(next: Second)` alors que rAF donne des millisecondes. **Reste** : `<link
rel="stylesheet" src=…>` (`link` attend `href`), `styles.css` vide de toute façon.

**Fait** : `World` (largeur, bornes `leftEnd`/`rightEnd`, contient un `Ground` et une `Clock` qui donne la couleur du
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

**Sons des anneaux (faits, commités le 20/11/2026)** : `AudioManager`
(`src/app/game/audio-manager.ts`), **Web Audio API** (choisie d'emblée plutôt que
`HTMLAudioElement` : un seul `Audio` partagé ne rejoue pas tant qu'il joue, donc un seul son
entendu). Un seul manager, possédé par `Game`, passé au constructeur du `World`. Vocabulaire des
**sound events** (FMOD/Wwise) : le jeu dit `playSoundEvent('hitGround')`, le manager choisit une
variante au hasard. `SOUNDS_EVENTS` (nom, dossier, fichiers) chargés une fois au démarrage
(`fetch` → `arrayBuffer` → `decodeAudioData`) dans `soundsBuffered`
(`Partial<Record<SoundEventType, AudioBuffer[]>>`) ; un `AudioBufferSourceNode` + `GainNode` neuf
par son (sons superposés). `AUDIO_MIX` (l'`AudioContext`) reste une constante du module (déjà
privée au fichier, passage en champ jugé inutile). Chaîne d'événements comme `complete()` :
`applyPhysics()` **renvoie** `'hitGround' | undefined` (seulement dans la branche du vrai rebond,
pas au repos), `Collectible.update()` le traduit en `SoundEventType` et le renvoie, le `World`
appelle le manager. `audioResume()` appelé sur `keydown` dans `Game` (règle anti-autoplay ; seul
`keydown` compte comme geste, pas `keyup`/`blur` ; Chrome ne relance pas tout seul).
`loadSound()` lance sa propre erreur si `!response.ok`, le `catch` l'affiche. Bugs rencontrés :
son joué dans `draw()` à chaque frame ; `this.x >= 0` pris pour « au sol » ; événement à chaque
frame au repos (la gravité repasse sous le sol) ; un `AudioManager` par anneau ;
`.fileName.length` (lettres du nom) au lieu du nombre de sons ; `return` qui sautait le
`return soundEvent` ; `!` + `?? []` après l'accès (plante quand même) ; `.buffer` resté après
le changement de type (Vite ne vérifie pas les types : lancer `tsc`) ; `applyPhysics()` appelé
deux fois ; `- 1` en trop dans le tirage ; `catch` vide ; `DecodeErrorCallback` (type de
fonction) pris pour un type d'erreur. Appris : le **serveur de dev Vite renvoie `index.html` en
200** pour un fichier absent (SPA fallback) : `response.ok` ne le voit pas, seul le
`Content-Type` (`text/html`) le trahit. **Restent** : tester le `Content-Type` ; sable et roche
mélangés dans `hitGround` (le `World` choisira selon le biome) ; `catch((error: Error))` (en vrai `unknown`) ; l'avertissement
d'autoplay au démarrage est normal (contexte créé avant le geste).
**Volume selon le choc (fait, commité le 20/11/2026)** : `applyPhysics()` renvoie un
`PhysicsEvent` (`{ type, value }`, `value` = `Math.abs(vY)`, vitesse du choc toujours positive) ;
`Collectible.update()` le traduit en `AudioEvent` (`{ type, volume }`, dans `audio-manager.ts`)
avec `inverseLerp(valeur, min, max)` (`src/app/utils/inverse-lerp.ts`, normalisation 0 → 1
bridée par `clamp`) entre `MIN_BOUNCE_SPEED` (exporté de `physics.ts`) et `MAX_BOUNCE_HIT` (4 m/s) ;
`playSoundEvent(audioEvent)`. Deux types séparés voulus par l'utilisateur (un choc ne fait pas
forcément un son). Bug rencontré : `vY` négatif au choc → volume bridé à 0, silence. Débattu :
l'utilisateur garde `value` générique ; conseillé une **union discriminée** (champs nommés par
type d'événement) au deuxième événement physique (YAGNI d'ici là). Piste : volume au carré
(perception non linéaire).

**Stamina (faite, commitée le 20/11/2026)** : le contrôleur **demande** une allure (`Pace` =
`'run' | 'walk' | 'idle'`, dans `config.ts`), `PlayerCharacter.moveWithStamina()` peut la
**refuser**. `stamina` et `breathless` en `private`. **Hystérésis** : essoufflé à
`STAMINA_MIN` (0), plus essoufflé au-dessus de 2 ; essoufflé + course demandée → marche.
`STAMINA_RATE_BY_PACE` (`Record<Pace, number>`, par seconde) et `clamp()`
(`src/app/utils/clamp.ts`). `breathless` est stocké car il ne se déduit pas de la stamina (un
souvenir, comme l'orientation). Bugs rencontrés : alternance course/marche autour d'un seul
seuil ; `if (pace = "run")` ; `return` qui sautaient la mise à jour de la stamina. Signalés, pas
réglés : `STAMINA_MIN_FOR_RUN` est devenu un seuil de récupération (nom trompeur) ;
`update(deltaSeconds: number)` au lieu de `Second`. Piste de design : rendre l'essoufflement
visible (marche plus lente, arrêt) pour que la règle se comprenne sans texte.

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
`Purchasable` dirait _avec quelle monnaie_ il se paie, l'image du placeholder appartient à la monnaie ;
pas codé tant qu'il n'y a qu'une monnaie (YAGNI), mais d'autres monnaies viendront. Monde agrandi exprès : `new World(40)` et
25 dunes.

**Paiement, première version (fait, commité le 29/10/2026)** : `pay()` lit `target.currentPrice`
(`!== undefined`), vérifie la bourse, retire les anneaux (ils disparaissent, pas encore lâchés ni
comptés quelque part), appelle `onPaid()` ; dunes marquées, `Sietch.onPaid()` fait `level += 1`.
`isLongHold` utilise une constante `longHoldAt`.

**Workers et tâches (en cours, 30/10/2026, pas commité)** : **le worker va jusqu'à la dune et la
creuse, ça marche.** Points 1 et 2 ci-dessous réglés et commités le 31/10/2026 ; le point 3
(`state`) fera l'objet d'un commit à part. L'utilisateur ne veut pas commiter du code qui ne
sert à rien.

- **Fait** : image du siètch niveau 0 (commité : `sietch_level_0.png`, 240×112 px = 15 m × 7 m,
  centrée sur `CENTER`, `save()`/`imageSmoothingEnabled = false`/`restore()`). `Worker extends
Npc` (`workForce`, `task: Workable | undefined`, `work()` vide). Interface `Workable` :
  `workChargeLeft`, `workerRequired`, `requestedAt: number | undefined`, `complete()`, `hitbox`.
  Le type `Task` a été **retiré** (copie de la charge = deux sources de vérité ; le `Workable`
  **est** la tâche). `Catchbasin` : plus de booléen `marked`, remplacé par `requestedAt`
  (`performance.now()` dans `mark()`) et un getter privé `marked` qui le lit (« make impossible
  states unrepresentable »). Vocabulaire : l'interface reste générique (`requestedAt` = demande
  **en cours**), chaque classe garde ses mots (`marked` pour la dune, `isUnderConstruction` pour
  un futur mur, qui remettrait `requestedAt` à `undefined` dans `complete()`).
  `World.workersTasks` (getter) : `filter` sur `workerRequired > 0` puis `sort` sur
  `requestedAt` (FIFO). `World.workers: Worker[]` (un worker créé dans le constructeur), dessinés
  depuis `Game.render()`.
- **Règles décidées (comme Kingdom)** : c'est **la tâche qui choisit son worker** (répartiteur) ;
  les tâches sont servies dans l'ordre de la demande, chacune prend le **worker libre le plus
  proche** (même `filter` + `reduce` que `findTarget()`, distance à la tâche) ; une tâche pleine
  n'attire plus personne ; plus de worker libre → on arrête. Tout se **déduit** de
  `worker.task` : libre = `undefined`, workers sur une tâche = ceux qui la ciblent, pleine =
  ce nombre atteint `workerRequired`. Répartiteur dans le `World` pour commencer.
- **Fait le 30/10/2026 au soir (pas commité)** : `Npc<AdditionalState extends string = never>`
  avec `state: NpcState | AdditionalState = 'idle'` ; `Worker extends Npc<'build' | 'repair' |
'dig'>`, `Hunter extends Npc<'hunt' | 'protect_sietch'>` (plus de redéclaration de `state`).
  Concept expliqué : `extends` dans `< >` = **contrainte**, pas héritage ; `'lave'` est un type.
- **Fait le 30/10/2026, fin de soirée (pas commité)** :
  - `Npc.runTo(hitbox, …)` : un seul pas par frame (le `while` a été retiré : la game loop **est**
    la boucle, et `!==` sur des décimales ne devient jamais faux). `distance` = écart des
    `centerX`, direction = son signe, arrivé si `Math.abs(distance) <= 0.1` m (en mètres, pas
    `METER_UNIT`). Renvoie `true` une fois arrivé.
  - `Worker.update()` : `if (task) runTo… puis work() une fois arrivé, else super.update()`.
  - `Worker.work(deltaSeconds)` : `workChargeLeft -= workForce * deltaSeconds`, puis
    `task = undefined` quand la charge passe à 0. La dune est retirée par le `filter` dans
    `Game.loop()`.
  - Répartiteur `World.taskDistributor()` : bug corrigé, il relit maintenant le getter
    `availableWorkers` **à chaque tâche**. Avant, il lisait une « photo » prise une seule fois,
    et un même worker recevait plusieurs tâches dans la frame. Expliqué : complexité O(tâches ×
    workers), négligeable même à 50 workers, et le vrai levier serait de ne lancer le
    répartiteur que sur un événement.
  - **Refacto du 31/10/2026 (pas commité)** : tout le contenu du jeu est passé de `Game` au
    `World` : `World.update(deltaSeconds)` (workers, retrait des dunes finies, ramassage des
    anneaux, muad'dib, hunter, répartiteur) et `World.draw(ctx, camera)` (sol, achetables, PNJ,
    anneaux, joueur en dernier). Le joueur vit dans le `World` (`readonly player`) ; `Game` le lit
    par un getter `player` (caméra, contrôleur). `draw()` ne reçoit plus `target`, il lit
    `this.player.target`. `Game` = boucle, horloge, caméra, debug des hitbox.
- **À faire à la reprise (les 3 points, dans l'ordre que l'utilisateur voudra)** :
  1. **Fait le 31/10/2026** : plus de `-= 1`. `Workable.workerRequired` est `readonly` ;
     `Catchbasin` le déduit par getter (`marked ? 1 : 0`) ; `World.workersOnTask(task)` (privée)
     compte les workers dont `task` est cette tâche ; `workersTasks` filtre sur
     `workersOnTask(w) < w.workerRequired` (« il manque du monde »). Bug rencontré en route :
     `workerRequired = 1` en champ fixe → les 25 dunes demandaient un worker, et le `sort` sur
     `requestedAt!` comparait des `undefined` (`NaN`, ordre au hasard).
  2. **Récompense de la dune (fait le 31/10/2026)** : c'est le `World` qui **remarque** la fin
     (dans le `filter` de `update()`, `workChargeLeft <= 0`), appelle `complete()` une seule fois
     et pose les anneaux renvoyés (`createCollectible`). `complete()` **renvoie**
     `WaterRing[]` (1 ou 2, `Math.floor(Math.random() + 1.5)`, `Array.from` + fabrique, centrés
     sur `centerX(hitbox)`). `Workable.complete(): Collectible[] | undefined` : `undefined`
     voulu par l'utilisateur (= « ce genre de tâche ne rapporte rien », ex. un mur ; `[]` =
     « rien cette fois »). La détection de front dans `Worker.work()` a été retirée (code mort).
     Bugs rencontrés : condition inversée (`> 0`), `new Array().fill()` sur un tableau vide,
     `Array().from` (méthode **statique** appelée sur une instance). Le worker ne ramasse rien :
     seul le joueur ramasse.
  3. **`state` ne sert pas** (toujours `'idle'`, le worker décide avec `task`). L'utilisateur
     veut s'en servir (d'autres états viendront) et aime le générique `Npc<AdditionalState>`.
     Piste : `state` = **ce qu'il fait**, `task` = **sur quoi** ; `switch` sur `state` dans
     `update()` (machine à états) ; le répartiteur cherche les `idle` et change tâche **et**
     état. Pour que les deux champs ne se contredisent jamais (invariant), les changer
     uniquement via deux méthodes du worker (donner une tâche / libérer), encapsulation.
- **Machine à états, mise à jour du 01/11/2026 (pas commité, ça marche)** : le plantage est
  réglé (hunter créé dans le constructeur du `World`, `hunters: Hunter[]`) ; le contexte est
  rafraîchi à chaque frame (`updateWorldContexte(this.worldContext)` avant chaque `update()`,
  `WorldContext` contient aussi `world: { leftEnd, rightEnd }`) ; `case "dig"` ne repasse en
  `idle` que sans tâche. Le hunter rentre au siètch la nuit (`protect_sietch` + `runTo` vers la
  zone) et repart en `idle` le jour. Bugs rencontrés : `moveTo` sans `this.` = `window.moveTo`
  (global du DOM, compile sans rien faire) ; `GROUND` (= 0) passé à la place de `deltaSeconds`
  (pas nul, un alias `Second = number` ne protège pas : piste des branded types). Restent : tous
  vont au **centre** de la zone (point au hasard tiré une fois à la transition) ; le worker ne
  rentre pas encore la nuit ; le `return` de `case "dig"` sans tâche le bloquerait en `dig`.
  **`minX`/`maxX` retirés (01/11/2026)** : `Character` reçoit `worldStart`/`worldEnd` (`readonly`)
  au constructeur (fixes pendant la partie, donc pas de problème de photo) ; `Npc` les tire de
  `worldContext.world.start/end` ; `walk`/`run`/`move`/`runTo`/`update` n'ont plus de bornes.
  Bug rencontré : arguments de `super()` dans le désordre (`y` = -20, PNJ sous le sol) ;
  TypeScript ne voit rien car tout est `number` : argument pour un **parameter object**
  (le constructeur de `Npc` a 6 paramètres positionnels).
- **Machine à états, historique (31/10/2026 au soir)** :
  - Objectif : à la nuit, tout le monde (workers, hunter ; pas les muad'dib) rentre se cacher dans
    `World.sietchZone`. Plan conseillé en 2 étapes : (1) refaire l'existant du worker avec un
    `switch` (`idle` = balade via `super.update()`, `dig` = `runTo` + `work`), transitions :
    tâche reçue → `dig`, plus de tâche → `idle`, le jeu doit marcher **comme avant** → commit ;
    (2) ajouter l'état « se cacher » (pas encore dans `NpcState` ; `escape` existe déjà) avec
    les transitions nuit / jour. Idées : point au hasard dans la zone tiré **une fois** à la
    transition (sinon tous empilés) ; le worker peut **garder** sa tâche la nuit.
  - Fait par l'utilisateur : `switch` dans `Worker.update()` et `Hunter.update()` ; type
    `WorldContext` (`sietchZone`, `clock`) dans `npc.ts` ; getter `World.worldContext` ;
    contexte passé au **constructeur** de `Npc`, `Worker`, `Hunter`, `Muaddib` (choisi pour ne
    pas tester `undefined`).
  - **Problèmes signalés, pas réglés** :
    1. **Plantage au démarrage** : `hunter = new Hunter(..., this.worldContext)` est un
       **champ**, initialisé **avant** le constructeur : `walls` encore vide → `reduce` sur
       tableau vide dans `getLastSietchWall`, et `clock` vaut `undefined`.
    2. Le contexte au constructeur : OK pour `clock` (référence), mais `sietchZone` est
       recalculée par le getter → le PNJ garderait une **photo** de la zone. Et `Npc` ne range
       même pas `worldContext`. Conseil : passer le contexte (**parameter object**) à
       `update()` à chaque frame. Options discutées : tout le `World` (couplage), contexte
       (conseillé), `World` au constructeur (dépendance cachée).
    3. `case "dig"` : `this.state = 'idle'` exécuté à chaque frame sans condition (alterne
       dig/idle) ; la transition vers `idle` doit dépendre de « plus de tâche ».
  - L'utilisateur veut revoir la signature de `update()` : `minX`/`maxX` ne lui semblent plus
    utiles, « c'est plus subtil » (à réfléchir de son côté ; ils pourraient entrer dans le
    contexte).
- **Réglé le 31/10/2026** : `initialWorkCharge`, `hasArrived`, `availableWorkers` lu une fois
  par tâche (constante **dans** le `forEach`).
- **Points signalés, pas réglés** : le nom `runTo` ne dit pas qu'il renvoie « arrivé » ;
  `runTo` prend `deltaSeconds: number` au lieu de `Second` ; marge de 0,1 m : OK à 60 fps
  (environ 5 cm par frame en courant) mais un gros `deltaSeconds` peut la sauter (piste : ne
  jamais avancer plus que la distance restante) ; s'il y a plusieurs workers sur une dune, seul
  celui qui passe la charge sous 0 se libère tout de suite ; les `!` dans le `sort` de
  `workersTasks` (piste : un **type predicate** `(w): w is Workable & { requestedAt: number }`) ;
  `performance.now()` avance même en pause (l'horloge de jeu du jour/nuit sera la bonne source).

**Pyons et camps (fait, commité le 01/11/2026)** : `Pyon extends Npc` (`createdBy: PyonsCamp`,
`entities/pyon.ts`) et `PyonsCamp` (`entities/pyons-camp.ts`, deux camps à -32 et 34 m, carré rose, `MAX_PYONS` = 2, un
pyon toutes les 60 s via `createPyonTimer: number | undefined`). Même principe que
`Catchbasin.complete()` : **le camp fabrique, le monde range** (`update()` renvoie
`Pyon | undefined`, le `World` le pousse dans `pyons`, les met à jour et les dessine). Le `World`
réécrit `pyonsCreated` à chaque frame (photo dans un champ ; piste : passer le nombre en
paramètre d'`update()`). Bug rencontré : `0` est falsy (`if (timer)` ne démarrait jamais).

**Fremen et ramassage partagé (04/11/2026)** : `Fremen extends Npc` (`entities/fremen.ts`, erre
dans `sietchZone`) ; un pyon qui a une pièce dans sa `Purse` devient un Fremen (le `World`
le retire de `pyons` et pousse un `Fremen`). Type structurel `PurseHolder` (`{ purse, hitbox }`,
dans `purse.ts`, ex-`PurseCharacter`) ; `World.purseHolders` (ex-`purseCharacters`) = joueur + pyons. Bug réglé (commité) :
une pièce allait dans plusieurs bourses (`return` dans un `forEach` = `continue`, `find` sans
`return true` = parcours complet) → `find` qui **choisit**, puis un seul `add` (requête /
commande séparées). Signalés, pas réglés : `purse.ts` ↔ `collectible.ts` s'importent
mutuellement (types seulement, piste `import type`) ; tableaux modifiés pendant leur `forEach` ; `Fremen` prend `CharacterOptions` au lieu de
`Partial` ; joueur en `new Purse()` illimitée ; Fremen de test à `-4`.

**Recrutement par le naib uniquement (09/11/2026, pas commité, testé)** : un pyon ne devient
Fremen qu'avec une pièce **lâchée par le naib**. `Collectible.from` (durable, écrit dans
`dropCollectible()`) ≠ `droppedBy` (temporaire, effacé dès que la pièce ne touche plus le naib).
Condition du `find` : `overlaps && canBePickedBy && (!receiverIsPyon || from === this.player)`
(implication `!A || B`). `from` est effacé dans `Purse.add()` (seulement si la pièce est
vraiment rangée : valeur par défaut sûre). Concepts vus : identité par référence (`===`), `find`
avec accolades sans `return`, court-circuit du `||`. **Fait depuis** : `purseHolders` élargi aux
workers, hunters et Fremen (`Fremen` a une `Purse`) : prérequis de la **prochaine étape, les PNJ
rendent leurs pièces au naib** (comme Kingdom). Restent : priorité de ramassage donnée par
l'ordre du tableau ; `droppedBy` pas effacé dans `add()` ; piste d'une méthode de `Collectible`
(« je viens d'être rangée ») appelée par `add()` à la place de `resetSpeed()`.

**Champ de vision (commité le 23/11/2026)** : getter `view` (une `Hitbox` de largeur
`viewDistance`, devant le personnage s'il marche, centrée s'il est immobile), dessiné en debug
(`drawViewHitbox`, booléen `viewsDebug` dans `Game`). Depuis déplacé de `Npc` vers `Character`
(pas commité). `DEFAULT_VIEW_DISTANCE` = 4 m.

**Les PNJ rendent leurs anneaux au naib (fait, commité le 27/11/2026)** :
- Renommages : le type structurel `PurseCharacter` → `CharacterWithPurse` → **`PurseHolder`** (`purse.ts` ; « Character » promettait trop pour un type structurel : une cache d'eau ou le maître de l'eau auront une bourse) ; getter `World.purseHolders` ;
  interface **`CollectibleThrower extends PurseHolder`** (`interfaces/collectible-thrower.ts`,
  ne déclare que `view` et `throwCollectible(throwDistance)`). Nom d'agent en *-er* (le
  personnage agit), à l'inverse de `Purchasable`/`Workable` (*-able*). On ne redéclare un champ
  hérité que pour le resserrer. Question laissée ouverte : `view` fait-il partie du contrat ?
- `Worker` et `Fremen` implémentent l'interface ; `World.collectibleThrowers` (hunters
  commentés) ; dans `World.update()`, joueur dans la `view` d'un lanceur qui a des anneaux →
  `throwCollectible(distance)`, l'anneau renvoyé est poussé dans `collectibles`.
- **`Cooldown`** (`src/app/game/cooldown.ts`, commité à part) : `duration` (`private readonly`),
  `timeCompleted` compte **vers le haut**, né prêt (`= duration`), `start()` réarme (seulement si
  prêt), `update()` n'avance que si `!isReady` (règle écrite une seule fois), getters `isReady`,
  `timeLeft`, `timeElapsed`. JSDoc collée à chaque membre (pas de `@method`/`@readonly` : un
  getter sans setter est déjà en lecture seule).
  **Branché dans `Bush` (27/11/2026)** à la place de `createMuaddibTimer` : paramètre optionnel
  `startReady` (défaut `true`, les lanceurs naissent prêts ; `false` pour le buisson : l'attente
  commence quand une place se libère) ; `update()` du buisson sort tout de suite s'il est plein
  (compteur figé). Bugs rencontrés : cooldown prêt pendant que le buisson est plein → remplaçant
  instantané. Vu : `readonly` dans les paramètres du constructeur = *parameter property* (champ).
- Bug de départ : le délai était un `number` passé **par valeur** (la fonction modifiait sa
  copie). Réglé par un objet (`Cooldown`) : la fonction reçoit une copie de la **référence**.
  Bugs rencontrés ensuite : métronome qui se réarmait seul ; `=== 0` ; condition d'`update()`
  inversée (jamais prêt) ; `start()` jamais appelé (rafale) ; temps qui ne passait que pendant
  que le naib était dans la vue. Séparé : **le temps passe** dans `update()` des PNJ (avant le
  `switch`), **la décision** dans `throwCollectible()` (plus de `deltaSeconds`) ; `start()`
  après la vérification de la bourse.
- Signalés, pas réglés : champ + méthode identiques dans `Worker` et `Fremen` (règle de trois) ;
  `throwDistance` (m) mis dans `vX` (m/s) ; `y` de l'anneau pas remis au sol ; un autre PNJ
  peut attraper l'anneau en vol ; option `noUnusedParameters` évoquée.

**À la reprise (02/11/2026) : zones d'errance des PNJ** (piste discutée, pas codée) :

- la **machine à états choisit la zone** et la passe en paramètre à chaque frame, rien de
  stocké (pyon `idle` → hitbox de son camp ; hunter/worker la nuit → `sietchZone`) ;
- une fonction pure « hitbox dans la zone » dans `hitbox.ts` (centre ou corps entier : à
  décider ; seul l'axe X compte) : **par là que l'utilisateur commencera** ;
- une méthode « errer dans la zone » : dehors → court vers la zone (« arrivé » = dedans, plus
  au centre, ce qui règle l'entassement au centre) ; dedans → balade de `Npc.update()` avec
  demi-tour si le prochain pas sort. Piège : zone plus petite que le PNJ.

**Prochaine étape (plan de l'utilisateur)** : après le paiement du siètch, faire apparaître **deux
bâtiments** de part et d'autre du siètch, un pour les **builders**, un pour les **archers**. Les
biomes viendront plus tard (une chose à la fois). Piste retenue (discutée, pas codée) :

- **Quand ? Un Observer écrit à la main** (pas RxJS, même s'il est livré avec Angular : logique de
  jeu en TS pur, et `Subject.next()` est synchrone, donc ça ne règle rien). Le siètch prévient le
  `World` quand il change de niveau. Attention au **milieu de frame** : le paiement a lieu dans
  `PlayerController.update()` ; modifier les tableaux du `World` à ce moment-là est risqué (file
  d'événements traitée à un moment précis de la boucle). L'utilisateur est dev web : Observer et
  `subscribe` lui sont familiers.
- **Quoi et où ? Un plan fixe du camp (data-driven design)** : comme dans Kingdom, le centre est
  toujours le même : siètch, petit espace, bâtiments (builders, archers), tours, murs, un espace
  (fermes…), tour, mur, puis l'aléatoire. Décrire des **emplacements** (distance au centre, type,
  niveau requis) sur **un seul côté**, reflétés à gauche et à droite (× -1 / × 1). La zone du camp
  pourrait être l'**île rocheuse** (déjà posée avec `setZone` sous le siètch), et les emplacements
  correspondent aux **cairns** des croquis.

**Mur (fait, 29/10/2026)** : `Wall` (`entities/wall.ts`, `Purchasable`), niveaux dans un `Record`
`WALL_LEVEL` (prix, vie, image ; `public/ressources/wall/`), `currentPrice` = prix du niveau
**suivant** via `?.`. `positionX` = **centre** du mur, `width`/`height` en champs, le getter
`hitbox` calcule le bord gauche. Murs créés par `mirrored` dans `World.buildSietchZone()` (±14 et
±26 m). `orientation` : getter `Direction` (1 si `positionX >= CENTER`, sinon -1) ; le mur de droite
est dessiné retourné (`translate` sur le bord droit en pixels, `scale(-1, 1)`, `drawImage` en
coordonnées relatives). `CENTER` dans `config.ts` (`World.center` le lit), `Direction` déplacé de
`player-controller.ts` vers `config.ts`. **Debug des hitbox fait** : `drawHitbox(ctx, camera,
hitbox)` dans `hitbox.ts` (`strokeRect`, sans `save()`/`restore()`), appelé à la fin de
`Game.render()` ; pas de touche, voulu comme ça.

**Convention du point d'origine (décidé)** : **centre en bas** (pivot) pour tous les objets, une
seule règle ; seul le getter `hitbox` passe du centre au bord gauche, les `draw()` lisent
`this.hitbox`. **Tous convertis** (29/10/2026) : `Sietch`, `Wall`, `Catchbasin` (image de 3 m
centrée sur `x`), `Character` (et ses sous-classes), `Collectible`. Le joueur part de
`world.center` (plus de `- 0.5`) ; `Character.move()` borne le centre à une demi-largeur des bords ;
au dépôt, l'anneau est posé au centre du naib.

**`disperse` (fait, 29/10/2026)** : `disperse<T>(count, begin, end, create)` dans
`src/app/utils/disperse.ts` : fonction pure et générique avec fabrique (comme `mirrored`), positions
au hasard entre les bornes (`getRandomBetweenMinMax`). Le `World` s'en sert pour les anneaux de
départ (remplace les anneaux dupliqués à la main ; plus tard, sur la zone du siètch). Pourra servir
aux dunes (`getRandomCatchbasinPositions`) et aux muad'dib (`game.ts`). Bugs rencontrés et
expliqués : `fill(valeur)` met **le même objet** dans toutes les cases (une seule pièce visible) ;
`fill(() => …)` range **la fonction**, sans l'appeler (`update is not a function`), et
`new Array(n)` est un `any[]` qui cache l'erreur à TypeScript → `Array.from({ length }, fabrique)`.
`Array.from` renvoie directement les objets créés (l'emballage `{ t: T }` + `map` a été retiré).

**Symétrie, décidé** :

- **Orientation déduite, pas passée** (philosophie du projet : déduire plutôt que stocker) : un
  bâtiment calcule son côté avec un **getter** (à gauche ou à droite du centre). Le centre devient
  une **constante** dans `config.ts` (le siètch est toujours au centre), lue par le `World` et par
  le getter, au lieu du `x > 0` implicite. Décider le cas « pile au centre ».
- Exception : les **personnages** gardent leur orientation en **état** (le dernier sens de marche
  est un souvenir, il ne se déduit pas de la position).
- Une **fonction de dessin partagée** qui retourne le dessin selon une `Direction` (comme
  `targetHighlight` enveloppe le dessin), utilisée par murs, tours, portails, personnages.
- Une **fonction de paires** : crée deux objets à ± distance du centre, avec une **fabrique**
  (fonction qui crée l'objet à partir d'une position) plutôt qu'un objet à copier. Moteur du futur
  plan du camp. Objets concernés : murs, tours ; les portails sont orientés mais pas forcément par
  paires (un côté bouché).
- **Fait** : `mirrored(distance, create)` dans `src/app/utils/mirrored.ts` : `CENTER ± distance`,
  sans connaître la largeur des objets (chaque objet gère la sienne). La fonction de dessin
  partagée n'est pas encore faite (le retournement est dans `Wall.draw()`).

Idée en réserve : un alias `type Price` dans l'interface `Purchasable` ; le cooldown du siètch ira
dans `currentPrice`.

**Avant de citer un point « en attente » de ces notes, vérifier dans le code qu'il l'est encore.**

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
- **Physique 2D des anneaux (faite le 01/11/2026)** : `Collectible` a `vX`/`vY` (champs d'état,
  0 par défaut, pas des options) ; `update(deltaSeconds)` : gravité (`GRAVITY` dans `config.ts`)
  → vitesse → position (Euler) ; au sol : repos si `vY` entre -0,3 et 0 (les deux vitesses à 0),
  sinon rebond (`REBOUND_FRICTION` = 0,4). `Catchbasin.complete()` crée chaque anneau **dans** la
  fabrique d'`Array.from`, à 1 m, avec une vitesse au hasard. `resetSpeed()` appelé par
  `Purse.add()` seulement si l'anneau est rangé. Bugs rencontrés : position calculée dans des
  getters (vitesse jamais remise à 0 → anneau dans l'espace) ; test du sol sur `x` au lieu de
  `y` ; même objet dans `Array.from` (deux `update()` par frame = temps en accéléré) ;
  `forEach` sur `this.collectibles` au lieu du paramètre ; seuil de repos collé à la gravité
  d'une frame (dépend des fps). Restent : nombres magiques (`0.3`, hauteur `1`), pas de bornes
  pour les anneaux, ramassage en plein vol autorisé (à décider). Servira aussi aux **flèches
  des archers** (trajectoire en cloche, angle par `Math.atan2(vY, vX)`) et au paiement pièce
  par pièce (les pièces retombent si l'achat échoue).
- **Bourse visuelle (en cours, 02/11/2026, pas commité)** : `PurseHUD`
  (`entities/purse-hud.ts`), une **vue** qui **lit** la `Purse` (séparation modèle / vue,
  composition ; pas dans `Purse` car le `Hunter` en a une aussi). Possédée par `PlayerCharacter`
  (`update()` appelé par `World.update()`, dessinée dans `PlayerCharacter.draw()`). Garde sa
  propre liste `items: PurseItem[]` (référence au `Collectible`, `x`/`y`, `vX`/`vY`, `rotation`
  tirée **une fois** à la création, en radians) ; `updatePurse()` ajoute les anneaux sans item
  (`!some(=== )`). Pièce dessinée avec `translate` → `rotate` → `fillRect(-w/2, -h/2, …)`
  (pivot = centre). Taille lue dans `collectible.options.purseImageWidth/Height`. Pour l'instant
  une boîte rouge en haut à droite. Bugs rencontrés : référence prise pour une photo (diff
  toujours vide), dessin dans `update()`, `some` sur tableau vide, `update()` jamais appelé,
  position et taille converties deux fois après `translate`, `Math.random()` dans `draw()`,
  degrés passés à `rotate()`. Restent : retirer les items des anneaux sortis de la bourse
  (compteur `items.length` faux après un paiement) ; position de la bourse calculée deux fois
  (dessin / point d'apparition) ; noms `purse…`/`bourse…` mélangés ; `vX`/`vY` et
  `deltaSeconds` pas encore utilisés ; `Purse.content` en `public readonly` (le tableau reste
  modifiable : piste `readonly Collectible[]`) ; `fillText` du compteur = debug (aucun texte en
  jeu). **Prochaine étape voulue** : la bourse se cache après quelques secondes sans gain
  d'anneau (délai dans `config.ts`) et réapparaît dès qu'on en gagne.
- **Physique de la bourse (plan validé, à faire plus tard)** : dans Kingdom, les pièces tombent,
  s'empilent, glissent les unes sur les autres (effet **pousse-pièce**) et **débordent** du sac
  quand il y en a trop : c'est du gameplay, donc pas de « places d'arrivée » trichées.
  1. **Fait (03/11/2026, commité)** : `applyPhysics(deltaSeconds, object, limitY: GameMeter)`
     dans `src/app/game/physics.ts`, type `PhysicsObject` `{ x, y, vX, vY }`. Elle **modifie**
     l'objet (renvoie `void`) ; `Collectible.update()` lui passe `this` (typage structurel).
     `MIN_BOUNCE_SPEED` = 0,3 m/s (positif, signe moins dans la comparaison). Bugs rencontrés :
     copie `{ x: this.x, … }` passée au lieu de `this` (modifiée puis jetée) ; double signe
     moins (la pièce ne se posait jamais). Les sorties du HUD sont aussi gérées (filtre par
     référence, `removePurseItem`). Le `droppedBy` reste dans `Collectible`.
     **Pièces du HUD branchées (03/11/2026, commité)** : repère local du sac, **centre en
     bas**, en mètres, y vers le haut ; `PurseItem` naît à `x = 0`, `y = purseHeight` ;
     `applyPhysics(…, item, 0)` dans un `forEach` à part (pas dans un `filter` : effet de
     bord) ; `positionInPurse()` convertit seulement dans `drawCollectible()` (position
     écran du sac + mètres × `METER_UNIT`, **moins** pour `y`). Tri : `purseWidth`/
     `purseHeight` en `GameMeter`, `margin`/`pursePositionX`/`pursePositionY` en `Pixel`.
     Nouveaux types dans `config.ts` : `MeterPerSecond`, `Radian`. Bugs rencontrés : pièce
     née en pixels écran (posée dès la 1re frame), conversion faite sur le sol au lieu du
     dessin, `-` sur tout le résultat, `* METER_UNIT` en trop ou oublié (règle : une unité
     par champ, une seule conversion). Restent : pièces enfoncées à moitié (`y` = centre),
     toutes empilées au même `x`, `fillText` du compteur (debug).
  2. Collision : chaque pièce = **un cercle** invisible (la rotation reste visuelle). Par frame :
     gravité → vitesse → position ; puis, répété 4 à 8 fois : écarter les paires de pièces qui
     se chevauchent (moitié chacune, le long de la ligne des centres) et repousser dans les bords.
     20 pièces max → ~200 paires, négligeable. Mots-clés : **Verlet**, **position-based
     dynamics**, **sleeping**.
  3. Si ça fait trop « billes » : **deux petits cercles reliés** par une contrainte de distance
     (la rotation se déduit alors de l'angle entre eux), ou une capsule. Pas d'ovales (collision
     sans formule simple).
  4. Forme du sac : forme **visuelle** (PNG) ≠ forme de **collision** (simple). Commencer par la
     boîte ; ensuite sol en fonction de x et/ou segments (distance point-segment). `Path2D`
     accepte un chemin SVG (`fill`, `clip`, `isPointInPath`) mais ne donne pas le rebond.
  5. **Décidé (03/11/2026) : c'est la physique qui décide du débordement.** `maxSize` disparaîtra
     (pas avant que la physique existe, sinon bourse infinie en attendant). Le nombre d'anneaux
     ne baisse que si le joueur en retire (paiement, dépôt) ou si un anneau **tombe du sac**. Le
     sac doit alors en informer la `Purse`. Piste conseillée : `PurseHUD.update()` **renvoie**
     les anneaux tombés (même principe que `Catchbasin.complete()` et `PyonsCamp.update()` :
     la vue signale, le propriétaire range) ; `PlayerCharacter`/`World` les retire de la
     `Purse` (il faudra un `remove(collectible)` ciblé, aujourd'hui `remove()` fait un `pop`)
     et les pose dans le monde près du naib (comme `dropCollectible`, sans `droppedBy` ?).
- Faire apparaître les muad'dib entre `leftEnd` et `rightEnd` (aujourd'hui entre 0 et `width`).
- Caméra : glissement horizontal selon la direction (`offset.x`), tremblement, zoom. Pour le zoom,
  les tailles devront aussi passer par la caméra (pas directement par `METER_UNIT`).
- **Parallaxe (prévue, pas prioritaire : d'abord une petite boucle de gameplay)** : découverte par
  accident le 29/10/2026 (position écran comptée deux fois dans `Catchbasin.draw()` → la dune
  défilait 2× plus vite). À faire proprement : des couches de **décor sans hitbox**, chacune avec un
  **facteur de profondeur** (< 1 au loin, 1 = sol, > 1 premier plan) appliqué au **point regardé**,
  sans toucher à la formule de `convert()`.
- **Animations (voulues plus tard, quelques images/seconde, ex. le drapeau de la dune)** : une
  **planche de sprites** (images côte à côte dans un PNG), `drawImage` à **9 arguments** (morceau
  source `sx, sy, sw, sh` puis destination), numéro d'image **déduit du temps** :
  `Math.floor(time * fps) % frameCount` (même horloge que le jour/nuit). Décalage aléatoire par
  objet pour éviter que tout bouge en même temps. L'animation jouée dépend de l'**état** du PNJ.
  Une petite fonction/classe réutilisable (composition), comme `targetHighlight`.
- **Zone du siètch / zone protégée (faite et commitée le 31/10/2026)** : comme Kingdom, deux murs
  délimitent une zone où les personnages se cachent ; elle **s'agrandit** quand on construit un
  mur plus loin. Codé : getter `World.sietchZone` (une `Hitbox` de hauteur 2, du bord intérieur du
  mur gauche au bord intérieur du mur droit, rien de stocké) et `getLastSietchWall(direction)` :
  murs du côté, puis le **construit** (`currentLevel > 0`) le plus **éloigné** du centre, sinon
  l'emplacement (cairn) le plus **proche** (décision de l'utilisateur : sans mur construit, la zone
  est celle des premiers emplacements). Comparaison par `Math.abs(positionX - CENTER)` (plus de
  code par côté). Debug : la zone est dessinée par `drawHitbox` dans `Game.render()`. Reste : le
  filtre de côté compare `hitbox.x` à 0 (piste : `wall.orientation === direction`) ; un côté sans
  mur ferait planter le `reduce` (tableau vide, côté bouché). Servira à : savoir si un personnage est dehors (le personnage ne connaît pas le `World`, donc
  plutôt une fonction qui prend la zone et une hitbox), et choisir le mur à défendre la nuit (le
  mur frontière du côté du personnage, côté donné par rapport à `CENTER`). Un mur au niveau 0
  (cairn) ne compte comme frontière que s'il n'y a aucun mur construit de ce côté, et seulement le
  plus proche (sinon la zone serait immense dès le départ). Distincte de l'île rocheuse (terrain fixe).
- La convention « centré sur 0 » est écrite à deux endroits (`World.leftEnd` et `Ground.draw()`).
- `speed` est typé `GameMeter` alors que c'est des m/s (à revoir plus tard).
- `hitbox.ts` est dans `src/app/` alors que c'est de la logique de jeu (`src/app/game/`).

---

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
