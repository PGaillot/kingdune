import { centerX } from "../hitbox";
import { Workable } from "./interfaces/workable";
import { Worker } from './entities/worker'

/** Distribue les taches entre les workers */
export function taskDistributor(workersTasks: Workable[], availableWorkers: Worker[]): void {
    // quel worker est le plus proche et est dispoinible de chaque taches ?
    workersTasks.forEach((task: Workable) => {
        if (availableWorkers.length >= 1) {
            const workerReady: Worker = availableWorkers.reduce((a: Worker, b: Worker) =>
                Math.abs(centerX(a.hitbox) - centerX(task.hitbox)) < Math.abs(centerX(b.hitbox) - centerX(task.hitbox)) ? a : b
            )
            availableWorkers = availableWorkers.filter((worker: Worker) => worker !== workerReady)
            workerReady.task = task;
        }
    })
};