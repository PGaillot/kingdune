import { DAY_LENGTH, Second } from "./config";

export type TimeOfDay = 'day' | 'night'

export class Clock {
    constructor(private time: Second) { }

    get days(): number {
        return Math.floor(this.time / DAY_LENGTH);
    };

    get timeInDay(): number {
        return this.time % DAY_LENGTH;
    }

    get timeOfDay(): TimeOfDay {
        return this.timeInDay > DAY_LENGTH / 2 ? 'night' : 'day';
    }

    updateClock(deltaSeconds: Second): void {
        this.time += deltaSeconds;
    }
}