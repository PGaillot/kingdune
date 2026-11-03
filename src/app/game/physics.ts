import { GameMeter, GRAVITY, MeterPerSecond, REBOUND_FRICTION, Second } from "./config";

export type PhysicsObject = {
    x: GameMeter,
    y: GameMeter,
    vX: MeterPerSecond,
    vY: MeterPerSecond
}

/** en m/s Sous cette vitesse (pour un rebond) l'objet s'arrete */
const MIN_BOUNCE_SPEED: MeterPerSecond = 0.3;

export function applyPhysics(deltaSeconds: Second, object: PhysicsObject, limitY: GameMeter): void {
    object.vY -= GRAVITY * deltaSeconds;
    object.y += (object.vY * deltaSeconds);
    if (object.y < limitY) {
        object.y = limitY;

        if (object.vY < 0 && object.vY > -MIN_BOUNCE_SPEED) {
            object.vY = 0;
            object.vX = 0;
        } else {
            object.vY = -object.vY * REBOUND_FRICTION;
            object.vX = object.vX * REBOUND_FRICTION;
        }
    }
    object.x += (object.vX * deltaSeconds);
}