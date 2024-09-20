import { Resources } from '../0_assets/resources'
import { MyStorage } from './storage'

class SoundHandling {
    private sfxVolume: number
    private musicVolume: number

    constructor() {
        // Retrieve the volumes
        this.sfxVolume = MyStorage.Retrieve('sfxVolume', 0.5)
        this.musicVolume = MyStorage.Retrieve('musicVolume', 0.5)

        // Settings for sounds
        Resources.music.musicTheme1.loop = true

        // Update the volumes
        this.setVolumes()
    }

    public get SfxVolume() {
        return this.sfxVolume
    }

    public get MusicVolume() {
        return this.musicVolume
    }

    public PlayMusicTheme() {
        void Resources.music.musicTheme1.play()
    }

    public PauseMusicTheme() {
        void Resources.music.musicTheme1.pause()
    }

    public StopMusicTheme() {
        void Resources.music.musicTheme1.stop()
    }

    public PlayMenuInteraction() {
        void Resources.sfx.menuInteraction.play()
    }

    public IncreaseSfxVolume() {
        this.sfxVolume += 0.1
        if (this.sfxVolume > 1) {
            this.sfxVolume = 0
        }
        this.setVolumes()
    }

    public DecreaseSfxVolume() {
        this.sfxVolume -= 0.1
        if (this.sfxVolume < 0) {
            this.sfxVolume = 1.0
        }
        this.setVolumes()
    }

    public IncreaseMusicVolume() {
        this.musicVolume += 0.1
        if (this.musicVolume > 1) {
            this.musicVolume = 0
        }
        this.setVolumes()
    }

    public DecreaseMusicVolume() {
        this.musicVolume -= 0.1
        if (this.musicVolume < 0) {
            this.musicVolume = 1.0
        }
        this.setVolumes()
    }

    public setVolumes() {
        // Store the volumes
        MyStorage.Store('sfxVolume', this.sfxVolume)
        MyStorage.Store('musicVolume', this.musicVolume)

        // SFX
        Resources.sfx.menuInteraction.volume = this.sfxVolume

        // Music
        Resources.music.musicTheme1.volume = this.musicVolume
    }
}

export const MySounds = new SoundHandling()