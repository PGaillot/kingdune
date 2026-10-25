export type GameMeter = number;
export type Pixel = number;

export const SCREEN_HEIGHT: Pixel = 450;
export const SCREEN_WIDTH: Pixel = 800;
export const GROUND_Y = 0;

/** Un point dans le monde du jeu, en mètres. Le sol est à y = 0 et la hauteur monte. */
export type WorldPoint = { x: GameMeter, y: GameMeter }

/** Un point sur l'écran (le canvas), en pixels. y augmente vers le bas. */
export type ScreenPoint = { x: Pixel, y: Pixel }

export const METER_UNIT: Pixel = 40; // la taille d'un mètre en pixels dans le jeu
