export type GameMeter = number;
export type Pixel = number;

export const SCREEN_HEIGHT: Pixel = 450;
export const SCREEN_WIDTH: Pixel = 800;
export const GROUND = 0;

/** Un point dans le monde du jeu, en mètres. Le sol est à y = 0 et la hauteur monte. */
export type WorldPoint = { x: GameMeter, y: GameMeter }

/** Un point sur l'écran (le canvas), en pixels. y augmente vers le bas. */
export type ScreenPoint = { x: Pixel, y: Pixel }

export const METER_UNIT: Pixel = 40; // la taille d'un mètre en pixels dans le jeu


/**
 * TOUCHES
 */

export type KeyActionInGame = 'move_right' | 'move_left' | 'run_right' | 'run_left' | 'secondary_action' | 'pay' | 'drop';

export type ActionTrigger =
    'tap' // un tap rapide sur la touche declache l'action quand elle est relaché
    | 'double_tap_hold' // deux tap fait dans un temps déffinit, reste actif tant qu'on reste sur la touche
    | 'hold' // se declanche instantanémant et se stop quand on relache la touche
    | 'long_hold' // se declanche apres une durée deffinit quand on maintient la touche

export const INPUT_MAPPING: Record<KeyActionInGame, { keys: KeyboardEvent['code'][], trigger: ActionTrigger }> = {
    move_left: { keys: ['ArrowLeft', 'KeyA'], trigger: 'hold' },
    move_right: { keys: ['ArrowRight', 'KeyD'], trigger: 'hold' },
    run_left: { keys: ['ArrowLeft', 'KeyA'], trigger: 'double_tap_hold' },
    run_right: { keys: ['ArrowRight', 'KeyD'], trigger: 'double_tap_hold' },
    secondary_action: { keys: ['ArrowUp', 'KeyW'], trigger: 'tap' },
    pay: { keys: ['ArrowDown', 'KeyS'], trigger: 'long_hold' },
    drop: { keys: ['ArrowDown', 'KeyS'], trigger: 'tap' },
}
