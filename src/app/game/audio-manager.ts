import { getRandomBetweenMinMax } from "../utils/random.utils";

export type SoundEvent = { name: SoundEventType, folder: { name: string, filesName: string[] } }
export type SoundBuffered = Partial<Record<SoundEventType, AudioBuffer[]>>

const SOUNDS_FILES_URL: string = 'ressources/sound_fx'

export type SoundEventType = 'hitGround'

export type AudioEvent = { type: SoundEventType, volume: number }

const SOUNDS_EVENTS: SoundEvent[] = [
    {
        name: 'hitGround',
        folder: {
            name: 'waterring',
            filesName: [
                'waterring_impact_sand_0.mp3',
                'waterring_impact_sand_1.mp3',
                'waterring_impact_sand_2.mp3',
                'waterring_impact_rock_0.mp3',
                'waterring_impact_rock_1.mp3',
                'waterring_impact_rock_2.mp3'
            ]
        }
    },
]

const AUDIO_MIX: AudioContext = new AudioContext();

export class AudioManager {
    private soundsBuffered: SoundBuffered = {}
    constructor() {
        /**
         * Je Charge chaque sons au charement du jeu,
         * et je les mets dans un tableau pret à être
         * appellé via la fonction playSoundEvent(), 
         * qui prend juste le type de son qu'il doit jouer, 
         * et en joue un au hasard si il y en à plusieurs.
         */
        SOUNDS_EVENTS.forEach((soundEvent: SoundEvent) => {
            soundEvent.folder.filesName.forEach((fileName: string) => {
                const soundUrl: string = this.createSoundUrl(soundEvent.folder.name, fileName)
                this.loadSound(soundUrl).
                    then((audioBuffer: AudioBuffer) => {
                        const soundEventName: SoundEventType = soundEvent.name
                        if (!this.soundsBuffered[soundEventName]) {
                            this.soundsBuffered[soundEventName] = []
                        }
                        this.soundsBuffered[soundEventName].push(audioBuffer)
                    }).
                    catch(console.error)
            })
        })
    }

    public audioResume(): void {
        if (AUDIO_MIX.state === "suspended")
            AUDIO_MIX.resume().catch(console.warn);
    }

    private createSoundUrl(folderName: string, fileName: string): string {
        return SOUNDS_FILES_URL + `/${folderName}/${fileName}`
    }

    private async loadSound(url: string): Promise<AudioBuffer> {
        const reponse: Response = await fetch(url);
        if (!reponse.ok) throw new Error(`status ${reponse.status} : ${url} have problem.`)
        const octets: ArrayBuffer = await reponse.arrayBuffer();
        return AUDIO_MIX.decodeAudioData(octets)
    }

    private playSound(sound: AudioBuffer, volume: number = 1) {
        const source: AudioBufferSourceNode = AUDIO_MIX.createBufferSource();
        source.buffer = sound;
        const nodeVolume = AUDIO_MIX.createGain();
        nodeVolume.gain.value = volume;
        source.connect(nodeVolume).connect(AUDIO_MIX.destination);
        source.start();
    }

    public playSoundEvent(audioEvent: AudioEvent): void {
        const soundEventType: SoundEventType = audioEvent.type
        if (this.soundsBuffered[soundEventType] === undefined) return
        const soundCount: number = this.soundsBuffered[soundEventType].length;
        const randomNumber: number = Math.floor(getRandomBetweenMinMax(0, soundCount));
        const audioBuffer: AudioBuffer = this.soundsBuffered[soundEventType][randomNumber];
        this.playSound(audioBuffer, audioEvent.volume)
    }
}