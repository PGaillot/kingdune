import { clamp } from "./clamp";

export function inverseLerp(value: number, min: number, max: number): number {
    return clamp((value - min) / (max - min), 0, 1)
}