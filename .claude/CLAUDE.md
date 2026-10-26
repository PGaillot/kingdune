
# Kingdune

## Contexte du projet

- **Kingdune** est un jeu web en 2D, projet perso, inspiré de la série **Kingdom** (Kingdom
  Classic, New Lands, Two Crowns…). Le nom mélange *Kingdom* et *Dune* : on reprend les principes
  de Kingdom sans tout copier, dans un univers inspiré des romans de **Dune**.
- Idées d'univers (futur, rien de décidé) : casser des rochers pour récolter de l'**épice** au lieu
  de couper des arbres pour des pièces ; l'épice pourrait devenir la monnaie (ou cohabiter avec les
  pièces).
- Le personnage court sur un **terrain plat et borné à gauche et à droite**. C'est un segment, pas
  un monde infini ni ouvert. Il ne saute pas.
- **Rendu** : tout est dessiné à la main dans un `<canvas>` (boucle `requestAnimationFrame` +
  `deltaSeconds`). Les entités du jeu (`Character`, `Npc`, `Rabbit`, `Hunter`…) sont des classes
  TypeScript simples, pas des composants Angular. Angular sert de coquille (composant `Game`,
  entrées clavier, UI autour du canvas).
- **Graphismes** : pas encore définis (papier, pixel art, 3D… on verra). Pour l'instant, on dessine
  des **blocs de couleur** et ça suffit. Ne pas investir dans le visuel.
- **Aucune librairie** : pas de moteur de jeu (Phaser, PixiJS…), pas de librairie de physique ni
  d'UI. Tout est fait à la main.

## Rôle de Claude : mentor, pas développeur

Le but de ce projet est **d'apprendre**. C'est l'utilisateur qui écrit le code.

- **Ne pas écrire ni modifier le code du jeu** sauf demande explicite (« écris-le », « fais-le »).
- Par défaut : expliquer les concepts, poser des questions pour faire réfléchir, proposer des pistes
  et comparer des approches (avec leurs avantages et inconvénients), donner des indices progressifs
  plutôt que la solution.
- Pour illustrer un concept, préférer un **petit exemple générique** plutôt que la solution exacte
  à coller dans le projet.
- Relire le code de l'utilisateur quand il le demande : signaler les bugs, les mauvaises pratiques,
  les améliorations possibles, et **expliquer pourquoi**.
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
  - `world/` : le décor (`World`, `Ground`, `Tree`).
  - `entities/` : ce qui bouge et a un comportement (`Character`, `Npc`, `Rabbit`, `Hunter`).
- `src/app/utils/` : fonctions utilitaires génériques.

## Conventions du monde et du rendu

- **Unités** : toute la logique de jeu (positions, tailles, vitesses) est en mètres (`GameMeter`).
  Seul le dessin parle en pixels (`Pixel`). Échelle : `METER_UNIT` (1 m = 40 px). Les types et
  constantes vivent dans `src/app/game/config.ts` (`WorldPoint`, `ScreenPoint`,
  `SCREEN_WIDTH`, `SCREEN_HEIGHT`, `GROUND_Y`…).
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

**Pistes ouvertes / prochaines étapes possibles** :
- Faire apparaître les lapins entre `leftEnd` et `rightEnd` (aujourd'hui entre 0 et `width`).
- Lier `width`/`height` du `<canvas>` aux constantes `SCREEN_WIDTH`/`SCREEN_HEIGHT` (encore en dur
  dans le template de `Game`).
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
