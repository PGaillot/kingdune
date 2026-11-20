import { getRandomBetweenMinMax } from "../utils/random.utils";

export type SoundEvent = { name: SoundEventType, url: { folderName: string, filesName: string[] } }
export type SoundBuffered = Partial<Record<string, { fileName: string, buffer: AudioBuffer[] }>>

const SOUNDS_FILES_URL: string = '/ressources/sound_fx'

export type SoundEventType = 'hitGround'

const SOUNDS_EVENTS: SoundEvent[] = [
    {
        name: 'hitGround',
        url: {
            folderName: 'waterring',
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
            soundEvent.url.filesName.forEach((fileName: string) => {
                this.loadSound(this.createSoundUrl(soundEvent.url.folderName, fileName)).
                    then((audioBuffer: AudioBuffer) => {
                        const soundEventName: SoundEventType = soundEvent.name
                        if (!this.soundsBuffered[soundEventName]) {
                            this.soundsBuffered[soundEventName] = { fileName, buffer: [] }
                        }
                        this.soundsBuffered[soundEvent.name] = { fileName, buffer: [...this.soundsBuffered[soundEvent.name]!.buffer, audioBuffer] }
                    })
            })
        })
    }

    private createSoundUrl(folderName: string, fileName: string): string {
        return SOUNDS_FILES_URL + `/${folderName}/${fileName}`
    }

    private async loadSound(url: string): Promise<AudioBuffer> {
        const reponse = await fetch(url);
        const octets = await reponse.arrayBuffer();
        return AUDIO_MIX.decodeAudioData(octets);
    }

    private playSound(sound: AudioBuffer, volume: number = 1) {
        const source: AudioBufferSourceNode = AUDIO_MIX.createBufferSource();
        source.buffer = sound;
        const gainOptions = AUDIO_MIX.createGain();
        gainOptions.gain.value = volume;
        source.connect(gainOptions).connect(AUDIO_MIX.destination);
        source.start();
    }

    public playSoundEvent(soundEventType: SoundEventType, volume?: number): void {
        if (this.soundsBuffered[soundEventType] === undefined) return
        const soundCount: number = this.soundsBuffered[soundEventType].buffer.length;
        const randomNumber: number = Math.floor(getRandomBetweenMinMax(0, soundCount));
        const audioBuffer: AudioBuffer = this.soundsBuffered[soundEventType].buffer[randomNumber];
        this.playSound(audioBuffer, volume)
    }
}