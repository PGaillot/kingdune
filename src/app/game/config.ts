export type GameMeter = number;
export type Pixel = number;
export type Second = number;
export type MeterPerSecond = number;
export type Radian = number; // pour les angles, c'est pas des degrès hein ! c'est des radians (*note :aller concprendre ce qu'es un radian*)

export type KeyboardKey = KeyboardEvent['code'];

/** -1 = gauche, 0 = immobile, 1 = droite */
export type Direction = -1 | 0 | 1;

export const SCREEN_HEIGHT: Pixel = 450;
export const SCREEN_WIDTH: Pixel = 800;
export const GROUND: GameMeter = 0;
export const CENTER: GameMeter = 0;


export const WORLD_RADIUS: number = 40;
export const GRAVITY: number = 9.81 // m/s²
export const REBOUND_FRICTION: number = 0.4;

/** Un point dans le monde du jeu, en mètres. Le sol est à y = 0 et la hauteur monte. */
export type WorldPoint = { x: GameMeter, y: GameMeter }

/** Un point sur l'écran (le canvas), en pixels. y augmente vers le bas. */
export type ScreenPoint = { x: Pixel, y: Pixel }

export const METER_UNIT: Pixel = 40; // la taille d'un mètre en pixels dans le jeu

export const DAY_LENGTH: Second = 5 * 60;
export const DAY_LIGHT_GRADIENT: string[] = ['#D9A066', '#D9A066', '#E8D597'];
export const NIGHT_GRADIENT: string[] = ['#0F0E24', '#0F0E24', '#24384D'];

/**
 * TOUCHES
 */
export type KeyActionInGame = 'move_right' | 'move_left' | 'run_right' | 'run_left' | 'pay' | 'drop';

export type ActionTrigger =
    'tap' // un tap rapide sur la touche declache l'action quand elle est relaché
    | 'double_tap_hold' // deux tap fait dans un temps déffinit, reste actif tant qu'on reste sur la touche
    | 'hold' // se declanche instantanémant et se stop quand on relache la touche
    | 'long_hold' // se declanche apres une durée deffinit quand on maintient la touche

export const INPUT_MAPPING: Record<KeyActionInGame, { keys: KeyboardKey[], trigger: ActionTrigger }> = {
    move_left: { keys: ['ArrowLeft', 'KeyA'], trigger: 'hold' },
    move_right: { keys: ['ArrowRight', 'KeyD'], trigger: 'hold' },
    run_left: { keys: ['ArrowLeft', 'KeyA'], trigger: 'double_tap_hold' },
    run_right: { keys: ['ArrowRight', 'KeyD'], trigger: 'double_tap_hold' },
    pay: { keys: ['ArrowDown', 'KeyS'], trigger: 'long_hold' },
    drop: { keys: ['ArrowDown', 'KeyS'], trigger: 'tap' },
}
