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
- **Cycle jour/nuit (voulu, pas encore codé, 30/10/2026)** : une horloge qui cumule `deltaSeconds`
  (modulo la durée d'une journée), la phase (jour/nuit) et la couleur du ciel **déduites** par
  getter. Les machines à états des PNJ liront la phase (ex. les workers rentrent au siètch la
  nuit). La tombée de la nuit serait le **deuxième déclencheur** d'événements (après la montée de
  niveau du siètch) : argument pour l'Observer fait main.
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
- **Réglé le 31/10/2026** : `initialWorkCharge`, `hasArrived`, `availableWorkers` lu une fois
  par tâche (constante **dans** le `forEach`).
- **Points signalés, pas réglés** : le nom `runTo` ne dit pas qu'il renvoie « arrivé » ;
  `runTo` prend `deltaSeconds: number` au lieu de `Second` ; marge de 0,1 m : OK à 60 fps
  (environ 5 cm par frame en courant) mais un gros `deltaSeconds` peut la sauter (piste : ne
  jamais avancer plus que la distance restante) ; s'il y a plusieurs workers sur une dune, seul
  celui qui passe la charge sous 0 se libère tout de suite ; les `!` dans le `sort` de
  `workersTasks` (piste : un **type predicate** `(w): w is Workable & { requestedAt: number }`) ;
  `performance.now()` avance même en pause (l'horloge de jeu du jour/nuit sera la bonne source).

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
`hitbox` calcule le bord gauche. Murs créés par `mirrored` dans `World.buildSietchZone()` (±6 et
±20 m). `orientation` : getter `Direction` (1 si `positionX >= CENTER`, sinon -1) ; le mur de droite
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
- **Physique 2D (voulue)** : `update()` des collectibles prendra `deltaSeconds` quand la gravité
  arrivera (chute, lancer, rebond : intégration d'Euler, vitesse + gravité à chaque frame). Servira
  aussi aux **flèches des archers** (trajectoire en cloche).
- **Bourse visuelle (voulue)** : l'utilisateur ne sait jamais combien il a d'anneaux. Afficher le
  contenu de la `Purse` du naib (comme la bourse de Kingdom, les anneaux visibles dedans), pourra
  utiliser la même physique.
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
- **Zone du siètch / zone protégée (à attaquer bientôt : beaucoup d'états en dépendent)** : comme
  Kingdom, au départ le siètch seul, puis deux murs qui délimitent une zone où les personnages se
  cachent ou ne s'éloignent pas trop ; elle **s'agrandit** quand on construit un mur plus loin.
  Piste : la zone **se déduit des murs construits** (le mur construit le plus éloigné de chaque
  côté ; zone minimale autour du siètch s'il n'y en a pas), getter sur le `World`, rien à stocker.
  Servira à : savoir si un personnage est dehors (le personnage ne connaît pas le `World`, donc
  plutôt une fonction qui prend la zone et une hitbox), et choisir le mur à défendre la nuit (le
  mur frontière du côté du personnage, côté donné par rapport à `CENTER`). **Décidé** : un mur au
  niveau 0 (cairn) **ne compte pas**, c'est juste un marqueur « on pourra construire ici » (sinon la
  zone serait immense dès le départ). Distincte de l'île rocheuse (terrain fixe).
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
