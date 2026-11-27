import { Second } from "./config";

const INITIAL_VALUE: Second = 0


/**
 * ### Un temps d'attente entre deux actions. 
 * #### "*Prennez le temps de réspirer ...*"
 * Un cooldown simple qui fait ce qu'on lui demande : Démarer, se mettre à jours et tant que 
 * la durée définit n'est pas atteinte, il ne peux plus etre relancé.
 */
export class Cooldown {

    private timeCompleted: Second;

    /** @param duration la dure totale du cooldow */
    constructor(private readonly duration: Second) {
        this.timeCompleted = this.duration;
    }

    /** Met à jour le cooldown, ne fait rien si le temps de déjà écoulé. */
    public update(deltaSeconds: Second): void {
        if (!this.isReady) this.timeCompleted += deltaSeconds;
    }
    /** permet de demarer le cooldown, ne fait rien si le timer tourne déjà */
    public start(): void {
        if (this.isReady) this.timeCompleted = INITIAL_VALUE;
    }

    /** C'est maintenant ? On peux ? Retoune `true` si c'est le bon moment. */
    public get isReady(): boolean {
        return this.timeCompleted >= this.duration;
    }

    /** Si vous vous demandez il reste combien de temps ? la reponse est ici. */
    public get timeLeft(): Second {
        return this.duration - this.timeCompleted;
    }

    /** La reponse à la question : depuis combien te temps ca tourne déjà ? __Le temps se fige quand il est atteint__. */
    public get timeElapsed(): Second {
        return this.timeCompleted;
    }
}