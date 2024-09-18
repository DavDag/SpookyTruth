import { EngineConfigs } from '../configs'

class SoundHandling {
    private sfxVolume: number
    private musicVolume: number

    constructor() {
        this.sfxVolume = parseFloat(
            localStorage.getItem('sfxVolume') ??
                EngineConfigs.StartingVolume.toString()
        )
        this.musicVolume = parseFloat(
            localStorage.getItem('musicVolume') ??
                EngineConfigs.StartingVolume.toString()
        )
    }

    public get SfxVolume() {
        return this.sfxVolume
    }

    public get MusicVolume() {
        return this.musicVolume
    }

    public PlayMenuInteraction() {
        // TODO
    }

    public IncreaseSfxVolume() {
        this.sfxVolume += 0.1
        if (this.sfxVolume > 1) {
            this.sfxVolume = 0
        }
        localStorage.setItem('sfxVolume', this.sfxVolume.toString())
    }

    public DecreaseSfxVolume() {
        this.sfxVolume -= 0.1
        if (this.sfxVolume < 0) {
            this.sfxVolume = 1.0
        }
        localStorage.setItem('sfxVolume', this.sfxVolume.toString())
    }

    public IncreaseMusicVolume() {
        this.musicVolume += 0.1
        if (this.musicVolume > 1) {
            this.musicVolume = 0
        }
        localStorage.setItem('musicVolume', this.musicVolume.toString())
    }

    public DecreaseMusicVolume() {
        this.musicVolume -= 0.1
        if (this.musicVolume < 0) {
            this.musicVolume = 1.0
        }
        localStorage.setItem('musicVolume', this.musicVolume.toString())
    }
}

export const MySounds = new SoundHandling()
