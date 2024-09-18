import { MyStorage } from './storage'

class SoundHandling {
    private sfxVolume: number
    private musicVolume: number

    constructor() {
        this.sfxVolume = MyStorage.Retrieve('sfxVolume', 0.5)
        this.musicVolume = MyStorage.Retrieve('musicVolume', 0.5)
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
        MyStorage.Store('sfxVolume', this.sfxVolume)
    }

    public DecreaseSfxVolume() {
        this.sfxVolume -= 0.1
        if (this.sfxVolume < 0) {
            this.sfxVolume = 1.0
        }
        MyStorage.Store('sfxVolume', this.sfxVolume)
    }

    public IncreaseMusicVolume() {
        this.musicVolume += 0.1
        if (this.musicVolume > 1) {
            this.musicVolume = 0
        }
        MyStorage.Store('musicVolume', this.musicVolume)
    }

    public DecreaseMusicVolume() {
        this.musicVolume -= 0.1
        if (this.musicVolume < 0) {
            this.musicVolume = 1.0
        }
        MyStorage.Store('musicVolume', this.musicVolume)
    }
}

export const MySounds = new SoundHandling()
