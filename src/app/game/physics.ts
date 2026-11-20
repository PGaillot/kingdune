import { GameMeter, GRAVITY, MeterPerSecond, REBOUND_FRICTION, Second } from "./config";

export type PhysicsObject = {
    x: GameMeter,
    y: GameMeter,
    vX: MeterPerSecond,
    vY: MeterPerSecond
}

export type PhysicsEvent = { type: PhysicsEventType, value: number }

export type PhysicsEventType = 'hitGround'

/** en m/s Sous cette vitesse (pour un rebond) l'objet s'arrete */
export const MIN_BOUNCE_SPEED: MeterPerSecond = 0.3;

export function applyPhysics(deltaSeconds: Second, object: PhysicsObject, limitY: GameMeter): PhysicsEvent | undefined {
    let event: PhysicsEvent | undefined;

    object.vY -= GRAVITY * deltaSeconds;
    object.y += (object.vY * deltaSeconds);
    if (object.y < limitY) {
        object.y = limitY;
        if (object.vY < 0 && object.vY > -MIN_BOUNCE_SPEED) {
            object.vY = 0;
            object.vX = 0;
        } else {
            event = { type: 'hitGround', value: Math.abs(object.vY) }
            object.vY = -object.vY * REBOUND_FRICTION;
            object.vX = object.vX * REBOUND_FRICTION;
        }
    }
    object.x += (object.vX * deltaSeconds);
    return event;
}