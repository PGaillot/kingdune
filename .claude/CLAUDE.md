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

**Pistes ouvertes (rien de décidé) :**

- Équivalent de l'arbre (obstacle à dégager qui rapporte de l'eau) : **caches d'eau dans la roche**,
  creusées par les bâtisseurs.
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
frame. Seuils : tap < 200 ms, double tap < 250 ms, long hold > 400 ms.

**Personnages (fait)** : `Character` reçoit `x`, `y` et une fiche `Partial<CharacterOptions>`
(`width`, `height`, `speed`, `color`, `runFactor`) fusionnée avec `DEFAULT_CHARACTER` par spread ;
chaque sous-classe a sa constante de défauts hors de la classe, `Npc` relaie la fiche à `super`.
`move()` (protected, vitesse en paramètre) + intentions `walk()` / `run()` (`runSpeed` en getter).
`PlayerController` : une direction, puis `run()` **ou** `walk()`. Course au double tap OK.
Gauche + droite en même temps = arrêt : comportement voulu.

**Prochaine étape** : ramasser les anneaux (AABB). `runFactor` (1,1) sera sans doute à régler en
jouant. `drop` (tap) et `pay` (long hold) sont détectés mais rien ne les utilise encore.

**Pistes ouvertes / prochaines étapes possibles** :

- Faire apparaître les muad'dib entre `leftEnd` et `rightEnd` (aujourd'hui entre 0 et `width`).
- Caméra : glissement horizontal selon la direction (`offset.x`), tremblement, zoom. Pour le zoom,
  les tailles devront aussi passer par la caméra (pas directement par `METER_UNIT`).
- La convention « centré sur 0 » est écrite à deux endroits (`World.leftEnd` et `Ground.draw()`).
- `src/app/hitbox.ts` n'est utilisé nulle part : à brancher (collisions AABB) ou à retirer.

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
